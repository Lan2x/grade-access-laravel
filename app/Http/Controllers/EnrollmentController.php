<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicPeriod;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Section;
use App\Models\Subject;


use Inertia\Inertia;

class EnrollmentController extends Controller
{


    public function index(Request $request)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        $query = Section::with(['subject', 'enrollments'])
            ->where('academic_period_id', $activePeriod?->id);

        // Filter by Subject if selected
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        $sections = $query->get()->map(function ($section) {
            return [
                'id' => $section->id,
                'section_name' => $section->section_name,
                'subject_code' => $section->subject->subject_code,
                'subject_title' => $section->subject->subject_title,
                'student_count' => $section->enrollments->count(),
            ];
        });

        return Inertia::render('enrollment/enrollment', [
            'sections' => $sections,
            'subjects' => Subject::all(['id', 'subject_title', 'subject_code']),
            'activePeriod' => $activePeriod,
            'filters' => $request->only(['subject_id']),
        ]);
    }


    /**
     * Display a listing of the resource.
     */
    public function create()
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        return Inertia::render('dean/enrollment/create', [
            // Only fetch users with the 'student' role
            'students' => User::role('student')->get(['id', 'name', 'school_id']),

            // Sections available in the current semester
            'sections' => Section::with('subject')
                ->where('academic_period_id', $activePeriod?->id)
                ->get(),

            'activePeriod' => $activePeriod,
        ]);
    }

    public function manage(Section $section)
    {
        return Inertia::render('enrollment/manage', [
            'section' => $section->load('subject'),
            // Get current students with their user details
            'enrolledStudents' => $section->enrollments()
                ->with('student:id,name,school_id')
                ->get(),
            // Get students NOT currently in this specific section
            'availableStudents' => User::role('student')
                ->whereDoesntHave('enrollments', function ($q) use ($section) {
                    $q->where('section_id', $section->id);
                })
                ->get(['id', 'name', 'school_id']),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Section $section)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Double check for duplicates in the same section
        $exists = Enrollment::where('student_id', $validated['student_id'])
            ->where('section_id', $section->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Student is already enrolled in this section.');
        }

        Enrollment::create([
            'student_id' => $validated['student_id'],
            'section_id' => $section->id,
            'academic_period_id' => $activePeriod->id,
        ]);

        return back()->with('message', 'Student successfully enrolled.');
    }

    /**
     * Remove an enrollment record.
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return back()->with('message', 'Student successfully withdrawn from section.');
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }



}
