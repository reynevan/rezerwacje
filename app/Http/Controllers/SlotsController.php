<?php

namespace App\Http\Controllers;

use App\Http\Response;
use App\Position;
use App\Settings;
use App\Slot;
use App\User;
use App\WorkingHour;
use Carbon\Carbon;
use Faker\Provider\DateTime;
use Illuminate\Http\Request;
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
            'position_id' => 'required',
            'time' => 'required'
        ]);

        if ($validator->fails()) {
            return Response::forbiddenError(trans('messages.save_error'));
        }

        $takenSlot = Slot::where('week', $request->get('week'))
            ->where('day', $request->get('day'))
            ->where('year', $request->get('year'))
            ->where('position_id', $request->get('position_id'))
            ->where('time', $request->get('time'))
            ->count() > 0;

        if ($takenSlot) {
            return Response::forbiddenError(trans('messages.slot_occupied'));
        }

        $user = JWTAuth::parseToken()->authenticate();

        $slot = Slot::create($request->all());

        $user->slots()->save($slot);

        $slot->addReservationNumberColumn();

        return Response::success($slot);
    }

    public function getSchedule(Request $request)
    {
        $now = new \DateTime();

        $user = JWTAuth::parseToken()->authenticate();

        if ($request->get('position_id')) {
            $earliestWorkingHour = WorkingHour::where('position_id', $request->get('position_id'))->where('open', true)->orderBy('start', 'asc')->first();
            if ($earliestWorkingHour) {
                $minStartTime = $earliestWorkingHour->start;
            } else {
                $minStartTime = '09:00:00';
            }
            $latestWorkingHour = WorkingHour::orderBy('end', 'desc')->where('position_id', $request->get('position_id'))->where('open', true)->first();
            if ($latestWorkingHour) {
                $maxEndTime = $latestWorkingHour->end;
            } else {
                $maxEndTime = '17:00:00';
            }
        } else {
            $minStartTime = WorkingHour::orderBy('start', 'asc')->where('open', true)->first()->start;
            $maxEndTime = WorkingHour::orderBy('end', 'desc')->where('open', true)->first()->end;
        }
        $slotLength = Settings::get()->getSlotLength();

        $startParts = explode(':', $minStartTime);
        $endParts = explode(':', $maxEndTime);
        $startHour = intval($startParts[0]);
        $startMinute = intval($startParts[1]);

        $endHour = intval($endParts[0]);
        $endMinute = intval($endParts[1]);

        $slotsNumber = floor((($endHour * 60 + $endMinute) -  ($startHour * 60 + $startMinute)) / $slotLength);

        $schedule = [];
        $slots = [];
        for ($i = 1; $i <= 7; $i++) {
            $day = [];
            $workingHours = null;
            if ($request->get('position_id')) {
                $slots = Slot::where('week', $request->get('week'))
                    ->where('year', $request->get('year'))
                    ->where('day', $i)
                    ->where('position_id', $request->get('position_id'))
                    ->get();
                $workingHours = WorkingHour::where('day', $i)->where('open', true)->where('position_id', $request->get('position_id'))->first();
            } elseif($user->isPositionEmployee()) {
                $slots = Slot::with('user')
                    ->with('position')
                    ->whereHas('position', function($query) use ($user)
                    {
                        $query->whereHas('users', function($query) use ($user) {
                            $query->where('user_id', $user->id);
                        });
                    })
                    ->where('week', $request->get('week'))
                    ->where('year', $request->get('year'))
                    ->where('day', $i)
                    ->get();
                $workingHours = WorkingHour::where('day', $i)
                    ->where('open', true)
                    ->whereHas('position', function($query) use ($user)
                    {
                        $query->whereHas('users', function($query) use ($user) {
                            $query->where('user_id', $user->id);
                        });
                    })
                    ->first();
            }


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
                $reservationDetails = [];
                foreach ($slots as $slot) {
                    if ($slot->time >= $time->format('H:i') && $slot->time < $nextTime->format('H:i')) {
                        $free = false;
                        $reservationDetails[] = $slot;
                        if ($slot->user_id === $user->id) {
                            $myReservation = true;
                        }
                    }
                }
                $open = $workingHours ? $time->format('H:i:s') >= $workingHours->start && $time->format('H:i:s') < $workingHours->end : false;

                $slotTime = Carbon::now();
                $slotTime->setISODate($request->get('year'), $request->get('week'), $i);
                $slotTime->setTime($startHour, $startMinute);
                $slotTime->addMinutes($j * $slotLength);
                $past = $now->format('Y-m-d H:i:s') > $slotTime->format('Y-m-d H:i:s');
                $plus30Days = new \DateTime('+30 days');
                $over30Days = $slotTime->format('Y-m-d') > $plus30Days->format('Y-m-d');
                $day[] = [
                    'free' => $free,
                    'open' => $open,
                    'time' => $time->format('H:i'),
                    'end' => $time->addMinutes($slotLength)->format('H:i'),
                    'my' => $myReservation,
                    'reservations' => $reservationDetails,
                    'past' => $past,
                    'unavailable' => !$myReservation && ($past || !$free || $over30Days),
                    'date' => $slotTime->format('Y-m-d H:i')
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
            ->with('position')
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

        return Response::success(compact('slots'));
    }

    public function removeSlot($slotId)
    {
        Slot::where('id', $slotId)->delete();
    }

    public function getQueue()
    {
        $now = new \DateTime();

        $positions = Position::all();

        foreach ($positions as $position) {
            $reservations = Slot::where('week', $now->format('W'))
                ->where('year', $now->format('Y'))
                ->where('day', $now->format('N'))
                ->where('closed', false)
                ->with('user')
                ->where('position_id' , $position->id)
                ->with('position')
                ->orderBy('time', 'asc')
                ->limit(10)
                ->get();

            foreach ($reservations as $reservation) {
                $reservation
                    ->addActiveColumn()
                    ->addReservationNumberColumn()
                    ->formatTime();
            }

            $position->setAttribute('reservations', $reservations);
        }

        return Response::success(compact('positions'));
    }

    public function closeReservation($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $reservation = Slot::where('id', $id)->first();
        if (!$user->isPositionEmployee() || !$user->doesBelongTo($reservation->position)) {
            return ['error' => 'nope'];
        }
        $reservation->closed = true;
        $reservation->save();

        return Response::success(compact('reservation'));
    }
}
