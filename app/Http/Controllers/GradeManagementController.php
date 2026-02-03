<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\AcademicPeriod;
use App\Models\SubjectAssignment;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeManagementController extends Controller
{
    /**
     * Display a listing of all sections and their grading status.
     */
    public function index(Request $request)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        // We query the Assignments, then "reach through" to the Section and Subject
        $query = SubjectAssignment::with(['section.subject', 'section.enrollments'])
            ->where('user_id', auth()->id())
            ->where('academic_period_id', $activePeriod?->id);

        $paginated_data = $query->paginate($request->per_page ?? 15)
            ->through(function ($assignment) {
                // We pull the data from the related section
                $section = $assignment->section;

                return [
                    'id' => $section->id, // We pass the section ID for the "Enter Grades" link
                    'section_name' => $section->section_name,
                    'subject_code' => $section->subject->subject_code,
                    'subject_title' => $section->subject->subject_title,
                    'student_count' => $section->enrollments->count(),
                    'graded_count' => $section->enrollments->whereNotNull('final_grade')->count(),
                ];
            });

        return Inertia::render('grade-management/grade-management', [
            'paginated_data' => $paginated_data,
            'activePeriod' => $activePeriod,
        ]);
    }

    public function updateBatch(Request $request, Section $section)
    {

        // Debugging: Uncomment the line below to see if data arrives
        // 1. Validate the incoming data
        $request->validate([
            'students' => 'required|array',
            'students.*.enrollment_id' => 'required|exists:enrollments,id',
            // Change 'required' to 'nullable' if some students might not have grades yet
            'students.*.grade' => 'nullable|array',
        ]);
        // 2. Perform the Batch Update
        foreach ($request->students as $row) {
            Grade::updateOrCreate(
                ['enrollment_id' => $row['enrollment_id']],
                [
                    // We spread the grade object which contains qas_1st_sem, m_exam_1st_sem, etc.
                    'qas_1st_sem' => $row['grade']['qas_1st_sem'] ?? null,
                    'qas_2nd_sem' => $row['grade']['qas_2nd_sem'] ?? null,
                    'gaca_1st_sem' => $row['grade']['gaca_1st_sem'] ?? null,
                    'gaca_2nd_sem' => $row['grade']['gaca_2nd_sem'] ?? null,
                    'm_exam_1st_sem' => $row['grade']['m_exam_1st_sem'] ?? null,
                    'm_exam_2nd_sem' => $row['grade']['m_exam_2nd_sem'] ?? null,
                    'f_exam_1st_sem' => $row['grade']['f_exam_1st_sem'] ?? null,
                    'f_exam_2nd_sem' => $row['grade']['f_exam_2nd_sem'] ?? null,
                    'output_1st_sem' => $row['grade']['output_1st_sem'] ?? null,
                    'output_2nd_sem' => $row['grade']['output_2nd_sem'] ?? null,
                    'attendance_1st_sem' => $row['grade']['attendance_1st_sem'] ?? null,
                    'attendance_2nd_sem' => $row['grade']['attendance_2nd_sem'] ?? null,
                    'total_grade_1st_sem' => $row['grade']['total_grade_1st_sem'] ?? null,
                    'total_grade_2nd_sem' => $row['grade']['total_grade_2nd_sem'] ?? null,
                    'letter_grade' => $row['grade']['letter_grade'] ?? null,
                    'remarks' => $row['grade']['remarks'] ?? null,
                    'status' => 'published', // Update status from draft
                ]
            );
        }



        return back()->with('message', 'Grade ledger synchronized successfully.');
    }


    public function show(Section $section)
    {
        //
    }

    public function enter(Section $section)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        return Inertia::render('grade-management/entry', [
            'section' => $section->load('subject'),
            'activeSemester' => $activePeriod->semester, // '1st' or '2nd'
            'students' => $section->enrollments()
                ->with(['student', 'grade']) // Load the grade record
                ->get()
                ->map(function ($enrollment) {
                    return [
                        'enrollment_id' => $enrollment->id,
                        'student_name' => $enrollment->student->name,
                        'school_id' => $enrollment->student->school_id,
                        'grade' => $enrollment->grade ?? new \App\Models\Grade(),
                    ];
                }),
        ]);
    }
}
