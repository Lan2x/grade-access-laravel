<?php

namespace App\Http\Controllers;

use App\Models\AcademicPeriod;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        // Filter by selected period if the student wants to see past grades
        $periodId = $request->input('academic_period_id', $activePeriod?->id);

        $grades = Enrollment::with(['section.subject', 'grade'])
            ->where('student_id', auth()->id())
            ->where('academic_period_id', $periodId)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'subject_code' => $enrollment->section->subject->subject_code,
                    'subject_title' => $enrollment->section->subject->subject_title,
                    'units' => $enrollment->section->subject->units,
                    'grade' => $enrollment->grade, // Contains all the granular fields
                ];
            });

        return Inertia::render('student/grades/index', [
            'grades' => $grades,
            'periods' => AcademicPeriod::orderBy('school_year', 'desc')->get(),
            'currentPeriodId' => (int) $periodId,
        ]);
    }
}