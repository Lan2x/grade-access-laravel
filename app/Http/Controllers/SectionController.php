<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Subject;
use App\Models\AcademicPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SectionController extends Controller
{
    /**
     * Display a listing of section-subject instances.
     */
    public function index()
    {
        return Inertia::render('section/index', [
            'sections' => Section::with(['subject', 'academicPeriod'])
                ->orderBy('section_name')
                ->get()
        ]);
    }

    /**
     * Show the form for creating a new section instance.
     */
    public function create()
    {
        return Inertia::render('section/add-section', [
            'subjects' => Subject::orderBy('subject_code')->get(['id', 'subject_code', 'subject_title']),
            'activePeriod' => AcademicPeriod::where('is_active', true)->first()
        ]);
    }

    /**
     * Store a new section-subject pair in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_name' => ['required', 'string', 'max:50'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'academic_period_id' => ['required', 'exists:academic_periods,id'],
        ]);

        Log::info('Adding section.', [
            'academic_period_id' => $validated["academic_period_id"]
        ]);

        // Prevention: Check if this specific subject is already assigned to this section name in this period
        $exists = Section::where('section_name', $validated['section_name'])
            ->where('subject_id', $validated['subject_id'])
            ->where('academic_period_id', $validated['academic_period_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', "Section {$validated['section_name']} already has this subject assigned for the current term.");
        }

        Section::create($validated);

        return redirect()->route('sections.index')
            ->with('message', "Section instance {$validated['section_name']} created successfully.");
    }


    public function edit(Section $section)
    {
        // Eager load the period so we can show it in the UI
        $section->load('academicPeriod');

        return Inertia::render('section/edit-section', [
            'section' => $section,
            'subjects' => Subject::orderBy('subject_code')->get(['id', 'subject_code', 'subject_title']),
        ]);
    }

    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'section_name' => ['required', 'string', 'max:50'],
            'subject_id' => ['required', 'exists:subjects,id'],
        ]);

        // Check for duplicates (excluding current record)
        $exists = Section::where('section_name', $validated['section_name'])
            ->where('subject_id', $validated['subject_id'])
            ->where('academic_period_id', $section->academic_period_id)
            ->where('id', '!=', $section->id)
            ->exists();

        if ($exists) {
            return back()->with('error', "This subject/section combination already exists for this term.");
        }

        $section->update($validated);

        return redirect()->route('sections.index')
            ->with('message', "Section {$section->section_name} updated successfully.");
    }

    /**
     * Remove the specified section instance.
     */
    public function destroy(Section $section)
    {
        $name = $section->section_name;
        $section->delete();

        return redirect()->route('sections.index')
            ->with('message', "Section instance {$name} has been removed.");
    }
}