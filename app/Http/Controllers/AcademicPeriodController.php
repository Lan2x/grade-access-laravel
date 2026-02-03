<?php

namespace App\Http\Controllers;

use App\Models\AcademicPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicPeriodController extends Controller
{
    public function index()
    {
        return Inertia::render('academic-periods/index', [
            'periods' => AcademicPeriod::orderBy('school_year', 'desc')->orderBy('semester', 'desc')->get()
        ]);
    }

    // AcademicPeriodController.php

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year' => [
                'required',
                'string',
                'regex:/^\d{4}-\d{4}$/', // Validates format like 2025-2026
            ],
            'semester' => 'required|integer|in:1,2',
        ]);

        // Check if this specific term already exists
        $exists = AcademicPeriod::where('school_year', $validated['school_year'])
            ->where('semester', $validated['semester'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['school_year' => 'This academic term already exists.']);
        }

        AcademicPeriod::create([
            'school_year' => $validated['school_year'],
            'semester' => $validated['semester'],
            'is_active' => false,
            'allow_submissions' => false,
        ]);

        return back()->with('message', 'New academic term created successfully.');
    }

    public function activate(AcademicPeriod $period)
    {
        // Set all to inactive
        AcademicPeriod::where('id', '!=', $period->id)->update(['is_active' => false]);

        // Activate this one
        $period->update(['is_active' => true]);

        return back()->with('message', "SY {$period->school_year} Semester {$period->semester} is now active.");
    }

    public function toggleSubmissions(AcademicPeriod $period)
    {
        $period->update(['allow_submissions' => !$period->allow_submissions]);
        return back();
    }

    public function update(Request $request, AcademicPeriod $period)
    {
        $validated = $request->validate([
            'school_year' => [
                'required',
                'string',
                'regex:/^\d{4}-\d{4}$/', // Ensures YYYY-YYYY format
            ],
            'semester' => 'required|integer|in:1,2',
        ]);

        // Check if another record already has this SY and Semester combination
        $exists = AcademicPeriod::where('school_year', $validated['school_year'])
            ->where('semester', $validated['semester'])
            ->where('id', '!=', $period->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['school_year' => 'This academic term already exists in the registry.']);
        }

        $period->update($validated);

        return back()->with('message', 'Academic term updated successfully.');
    }
}