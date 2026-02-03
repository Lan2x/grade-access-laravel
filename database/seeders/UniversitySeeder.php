<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\Section;
use App\Models\AcademicPeriod;
use App\Models\SubjectAssignment;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Setup Permissions and Roles
        $roles = ['dean' => ['manage_users'], 'professor' => ['manage_grades'], 'student' => ['view_my_grades']];
        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            foreach ($perms as $p) {
                Permission::firstOrCreate(['name' => $p]);
                $role->givePermissionTo($p);
            }
        }

        // 2. Create the Dean
        User::create([
            'school_id' => 'ADMIN-001',
            'name' => 'University Dean',
            'email' => 'dean@university.edu',
            'password' => Hash::make('password'),
        ])->assignRole('dean');

        // 3. Create an Academic Period
        $period = AcademicPeriod::create([
            'school_year' => '2025-2026',
            'semester' => 1,
            'is_active' => true,
            'allow_submissions' => true,
        ]);

        // 4. Create 5 Subjects
        $subjectData = [
            ['code' => 'IT101', 'title' => 'Introduction to Programming'],
            ['code' => 'IT102', 'title' => 'Data Structures and Algorithms'],
            ['code' => 'IT103', 'title' => 'Database Management Systems'],
            ['code' => 'IT104', 'title' => 'Web Development Frameworks'],
            ['code' => 'IT105', 'title' => 'Discrete Mathematics'],
        ];

        $subjects = collect($subjectData)->map(fn($s) => Subject::create([
            'subject_code' => $s['code'],
            'subject_title' => $s['title'],
            'units' => 3
        ]));

        // 5. Create 5 Sections (Distributed across subjects)
        $sectionNames = ['BSIT-1A', 'BSIT-1B', 'BSIT-2A', 'BSIT-2B', 'BSIT-3A'];
        $sections = $subjects->map(fn($subject, $index) => Section::create([
            'subject_id' => $subject->id,
            'section_name' => $sectionNames[$index],
            'academic_period_id' => $period->id,
        ]));

        // 6. Create 2 Professors
        $profs = collect([
            ['id' => 'PROF-001', 'name' => 'Jeffrey D. Dianito', 'email' => 'jeffrey@university.edu'],
            ['id' => 'PROF-002', 'name' => 'Maria S. Santos', 'email' => 'maria@university.edu'],
        ])->map(fn($p) => User::create([
                'school_id' => $p['id'],
                'name' => $p['name'],
                'email' => $p['email'],
                'password' => Hash::make('password'),
            ])->assignRole('professor'));

        // 7. Assign Load (Prof 1 gets 3 sections, Prof 2 gets 2)
        $sections->each(fn($sec, $i) => SubjectAssignment::create([
            'user_id' => ($i < 3) ? $profs[0]->id : $profs[1]->id,
            'section_id' => $sec->id,
            'academic_period_id' => $period->id,
        ]));

        // 8. Create 10 Students
        $students = collect([
            'John Doe',
            'Jane Smith',
            'Michael Chen',
            'Sarah Jenkins',
            'Robert Wilson',
            'Emily Davis',
            'David Miller',
            'Chris Evans',
            'Anna Taylor',
            'Mark Thompson'
        ])->each(fn($name, $i) => User::create([
                'school_id' => 'STUD-2026-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@student.edu',
                'password' => Hash::make('password'),
            ])->assignRole('student'));
    }
}