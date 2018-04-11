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

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        Model::reguard();
    }
}
