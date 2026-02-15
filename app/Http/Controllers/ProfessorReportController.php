<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Section;
use App\Models\AcademicPeriod;
use App\Models\SubjectAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessorReportController extends Controller
{
    /**
     * Show report selection dashboard for the professor.
     */
    public function index()
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        $myClasses = SubjectAssignment::with([
            'section.subject',
            'section.enrollments.student' // Add this to get the student list
        ])
            ->where('user_id', auth()->id())
            ->where('academic_period_id', $activePeriod?->id)
            ->get();

        return Inertia::render('reports/index', [
            'myClasses' => $myClasses,
            'activePeriod' => $activePeriod
        ]);
    }

    /**
     * Generate Class List Report for a specific section.
     */
    public function classList(Section $section)
    {
        // Ensure this section belongs to the professor
        $this->authorizeAssignment($section);

        $section->load(['subject', 'enrollments.student', 'enrollments.grade']);

        return Inertia::render('reports/class-list', [
            'section' => $section,
        ]);
    }

    /**
     * Generate individual student report across all subjects for a specific period.
     */
    public function studentTranscript(User $user, AcademicPeriod $period)
    {
        // Load student's enrollments and grades for that specific period
        $reportData = $user->enrollments()
            ->where('academic_period_id', $period->id)
            ->with(['section.subject', 'grade'])
            ->get();

        return Inertia::render('reports/student-transcript', [
            'student' => $user->only('id', 'name', 'school_id'),
            'period' => $period,
            'enrollments' => $reportData
        ]);
    }

    private function authorizeAssignment(Section $section)
    {
        $isAssigned = SubjectAssignment::where('user_id', auth()->id())
            ->where('section_id', $section->id)
            ->exists();

        if (!$isAssigned) {
            abort(403, 'You are not assigned to this section.');
        }
    }
}