<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicPeriod;
use App\Models\SubjectAssignment;
use App\Models\Section;
use App\Models\User;
use Inertia\Inertia;

class ProfessorLoadController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        // 1. Start the query for professors
        $query = User::role('professor')
            ->with([
                'assignments' => function ($q) use ($activePeriod) {
                    $q->where('academic_period_id', $activePeriod->id)
                        ->with('section.subject');
                }
            ]);

        // 2. Add search functionality (matches your Search handle in React)
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%')
                ->orWhere('school_id', 'like', '%' . $request->name . '%');
        }

        // 3. Paginate and transform the data
        $paginated_data = $query->paginate($request->per_page ?? 15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'school_id' => $user->school_id,
                    'assignments' => $user->assignments,
                    'total_units' => $user->assignments->sum('section.subject.units'),
                ];
            })
            ->withQueryString(); // Keeps your search/per_page params in the links

        return Inertia::render('professor-load/professor-load', [
            'activePeriod' => $activePeriod,
            'paginated_data' => $paginated_data, // Matching the React key
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('professor-load/add-load', [
            'professors' => User::role('professor')->get(['id', 'name', 'school_id']),
            'sections' => Section::with('subject')->get(),
            'activePeriod' => AcademicPeriod::where('is_active', true)->first(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming request
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'section_id' => ['required', 'exists:sections,id'],
            'academic_period_id' => ['required', 'exists:academic_periods,id'],
        ]);

        // 2. Conflict Check: Ensure this specific section isn't already assigned
        // to someone else in the same academic period.
        $isSectionTaken = SubjectAssignment::where('section_id', $request->section_id)
            ->where('academic_period_id', $request->academic_period_id)
            ->exists();

        if ($isSectionTaken) {
            return back()->with('error', 'This section/subject is already assigned to another professor.');
        }

        // 3. Conflict Check: Ensure this professor isn't already assigned 
        // to this specific section (prevent duplicate entries).
        $isAlreadyAssigned = SubjectAssignment::where('user_id', $request->user_id)
            ->where('section_id', $request->section_id)
            ->where('academic_period_id', $request->academic_period_id)
            ->exists();

        if ($isAlreadyAssigned) {
            return back()->with('error', 'This load is already assigned to this professor.');
        }

        // 4. Create the Load Assignment
        SubjectAssignment::create($validated);

        // 5. Redirect back with a success message
        return redirect()->route('professor-loads.index')
            ->with('message', 'Professor load has been successfully assigned.');
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

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Remove a specific subject assignment.
     */
    public function destroy(\App\Models\SubjectAssignment $assignment)
    {
        $assignment->delete();

        return back()->with('message', 'Subject successfully removed from professor load.');
    }

    /**
     * Clear all assignments for a specific professor for the active academic period.
     */
    public function clearAll(User $user)
    {
        $activePeriod = AcademicPeriod::where('is_active', true)->first();

        if (!$activePeriod) {
            return back()->with('error', 'No active academic period found.');
        }

        SubjectAssignment::where('user_id', $user->id)
            ->where('academic_period_id', $activePeriod->id)
            ->delete();

        return back()->with('message', "All assignments cleared for {$user->name}.");
    }
}
