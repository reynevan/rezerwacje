<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('users')->delete();

        $users = array(
            ['first_name' => 'Paweł', 'last_name' => 'Sumiński', 'email' => 'p.suminski@gmail.com', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 1],
            ['first_name' => 'Chris', 'last_name' => 'Sevilleja', 'email' => 'chris@scotch.io', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 1],
            ['first_name' => 'Holly', 'last_name' => 'Lloyd', 'email' => 'holly@scotch.io', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 1],
            ['first_name' => 'Baba', 'last_name' => 'Z Dziekanatu', 'email' => 'baba@example.com', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 2],
            ['first_name' => 'Druga Baba', 'last_name' => 'Z Dziekanatu', 'email' => 'baba2@example.com', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 2],
            ['first_name' => 'Admin', 'last_name' => 'Admin', 'email' => 'admin@rezerwacje.dev', 'password' => Hash::make('pass'), 'index_number' => rand(100000, 999999999), 'role' => 3],
        );

        $workingHours = [
            ['day' => 1, 'start' => '09:00', 'end' => '16:00'],
            ['day' => 2, 'start' => '08:00', 'end' => '17:00'],
            ['day' => 3, 'start' => '10:00', 'end' => '15:00'],
            ['day' => 5, 'start' => '9:30', 'end' => '16:30']
        ];

        $stands = [
            ['name' => 'stanowisko 1', 'description' => 'heh'],
            ['name' => 'stanowisko 2', 'description' => 'rzal i bul'],
        ];

        foreach ($workingHours as $wh) {
            \App\WorkingHour::create($wh);
        }

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        foreach ($stands as $stand) {
            \App\Position::create($stand);
        }

        Model::reguard();
    }
}
