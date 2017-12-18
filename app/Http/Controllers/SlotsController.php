<?php

namespace App\Http\Controllers;

use App\Settings;
use App\Slot;
use App\User;
use App\WorkingHour;
use Carbon\Carbon;
use Faker\Provider\DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JWTAuth;
use Validator;
use App\Http\Requests;
use App\Http\Controllers\Controller;


class SlotsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getQueue']]);
    }

    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'week' => 'required',
            'day' => 'required',
            'year' => 'required',
            'stand_id' => 'required',
            'time' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => trans('messages.save_error')], Response::HTTP_FORBIDDEN);
        }

        $takenSlot = Slot::where('week', $request->get('week'))
            ->where('day', $request->get('day'))
            ->where('year', $request->get('year'))
            ->where('position_id', $request->get('stand_id'))
            ->where('time', $request->get('time'))
            ->count() > 0;

        if ($takenSlot) {
            return response()->json(['error' => trans('messages.slot_occupied')], Response::HTTP_FORBIDDEN);
        }

        $user = JWTAuth::parseToken()->authenticate();

        $slot = Slot::create($request->all());

        $user->slots()->save($slot);

        $slot->addReservationNumberColumn();

        return $slot;
    }

    public function getSchedule(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $minStartTime = WorkingHour::orderBy('start', 'asc')->first()->start;
        $maxEndTime = WorkingHour::orderBy('end', 'desc')->first()->end;
        $slotLength = Settings::get()->getSlotLength();

        $startParts = explode(':', $minStartTime);
        $endParts = explode(':', $maxEndTime);
        $startHour = intval($startParts[0]);
        $startMinute = intval($startParts[1]);

        $endHour = intval($endParts[0]);
        $endMinute = intval($endParts[1]);

        $slotsNumber = floor((($endHour * 60 + $endMinute) -  ($startHour * 60 + $startMinute)) / $slotLength);

        $schedule = [];
        for ($i = 1; $i <= 7; $i++) {
            $day = [];
            if ($request->get('stand_id')) {
                $slots = Slot::where('week', $request->get('week'))
                    ->where('year', $request->get('year'))
                    ->where('day', $i)
                    ->where('position_id', $request->get('stand_id'))
                    ->get();
            } elseif($user->isStandEmployee()) {
                $slots = Slot::with('user')
                    ->with('stand')
                    ->whereHas('stand', function($query ) use ($user)
                    {
                        $query->where('user_id', $user->id);
                    })
                    ->where('week', $request->get('week'))
                    ->where('year', $request->get('year'))
                    ->where('day', $i)
                    ->get();
            }

            $workingHours = WorkingHour::where('day', $i)->first();

            for ($j = 0; $j < $slotsNumber; $j++) {
                $time = Carbon::now();
                $time->hour = $startHour;
                $time->minute = $startMinute;
                $time->second = 0;
                $time->addMinutes($j * $slotLength);
                $nextTime = $time->copy();
                $nextTime->addMinutes($slotLength);
                $free = true;
                $myReservation = false;
                $reservationDetails = null;
                foreach ($slots as $slot) {
                    if ($slot->time >= $time->format('H:i') && $slot->time < $nextTime->format('H:i')) {
                        $free = false;
                        $reservationDetails = $slot;
                        if ($slot->user_id === $user->id) {
                            $myReservation = true;
                        }
                        break;
                    }
                }
                $open = $workingHours ? $time->format('H:i:s') >= $workingHours->start && $time->format('H:i:s') < $workingHours->end : false;

                $day[] = [
                    'free' => $free,
                    'open' => $open,
                    'time' => $time->format('H:i'),
                    'end' => $time->addMinutes($slotLength)->format('H:i'),
                    'my' => $myReservation,
                    'reservation' => $reservationDetails
                ];
            }

            $schedule[$i] = $day;
        }

        $slotTimes = [];
        for ($i = 0; $i < $slotsNumber; $i++) {
            $time = Carbon::now();
            $time->hour = $startHour;
            $time->minute = $startMinute;
            $time->addMinutes($i * $slotLength);
            $slotTimes[] = $time->format('H:i');
        }

        $schedule2 = [];
        foreach ($schedule as $dayIndex => $day) {
            foreach ($day as $slotIndex => $slot) {
                if (!isset($schedule2[$slotIndex])) {
                    $schedule2[$slotIndex] = [];
                }
                $schedule2[$slotIndex][] = $slot;
            }
        }

        return [
            'schedule' => $schedule2,
            'slotTimes' => $slotTimes
        ];
    }

    public function mySlots(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $slots = $user->slots()
            ->orderBy('year', 'desc')
            ->orderBy('week', 'desc')
            ->orderBy('day', 'desc')
            ->orderBy('time', 'desc')
            ->with('stand')
            ->get();

        foreach ($slots as $slot) {
            $date = new \DateTime();
            $date->setISODate($slot->year, $slot->week, $slot->day);
            $time = explode(':', $slot->time);
            $date->setTime($time[0], $time[1]);
            $slot->setAttribute('date', $date->format('Y-m-d H:i:s'));
            if ($date < (new \DateTime())) {
                $slot->past = true;
            }
            $slot->addReservationNumberColumn();
        }

        return [
            'slots' => $slots
        ];
    }

    public function removeSlot($slotId)
    {
        Slot::where('id', $slotId)->delete();
    }

    public function getQueue()
    {
        $now = new \DateTime();
        $reservations = Slot::where('week', $now->format('W'))
            ->where('year', $now->format('Y'))
            ->where('day', $now->format('N'))
            ->where('closed', false)
            ->with('user')
            ->with('stand')
            ->orderBy('time', 'asc')
            ->get();

        foreach ($reservations as $reservation) {
            $reservation
                ->addActiveColumn()
                ->addReservationNumberColumn()
                ->formatTime();
        }

        $stands = [];
        $a = [];
        foreach ($reservations as $reservation) {
            if (in_array($reservation->stand_id, $stands)) {
                $reservation->active = false;
                continue;
            }
            $stands[] = $reservation->stand_id;
            $a[] = $reservation;
        }


        return ['reservations' => $a];
    }

    public function getQueueForStand()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $now = new \DateTime();
        $reservations = Slot::where('week', $now->format('W'))
            ->where('year', $now->format('Y'))
            ->where('day', $now->format('N'))
            ->where('closed', false)
            ->with('user')
            ->with('stand')
            ->whereHas('stand', function($query ) use ($user)
            {
                $query
                    ->with('stands_user')
                    ->whereHas('stands_user', function($query ) use ($user)
                {
                    $query->where('user_id', $user->id);
                });
                //$query->where('user_id', $user->id);
            })
            ->orderBy('time', 'asc')
            ->get();

        foreach ($reservations as $reservation) {
            $reservation
                ->addActiveColumn()
                ->addReservationNumberColumn()
                ->formatTime();
        }

        return ['reservations' => $reservations];
    }

    public function closeReservation($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $reservation = Slot::where('id', $id)->first();
        if (!$user->isStandEmployee() || $reservation->stand->user_id !== $user->id) {
            return ['error' => 'nope'];
        }
        $reservation->closed = true;
        $reservation->save();

        return [
            'reservation' => $reservation
        ];
    }
}
