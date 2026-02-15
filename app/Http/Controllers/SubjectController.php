<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display the list of subjects.
     */
    public function index()
    {
        return Inertia::render('subject/index', [
            'subjects' => Subject::orderBy('subject_code')->get()
        ]);
    }

    /**
     * Show the creation form.
     */
    public function create()
    {
        return Inertia::render('subject/add-subject');
    }

    /**
     * Store a new subject in the registry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => ['required', 'string', 'max:20', 'unique:subjects,subject_code'],
            'subject_title' => ['required', 'string', 'max:255'],
            'units' => ['required', 'integer', 'min:1', 'max:6'],
        ]);

        Subject::create($validated);

        return redirect()->route('subjects.index')
            ->with('message', "Subject {$validated['subject_code']} successfully registered.");
    }

    /**
     * Show the edit form for a specific subject.
     */
    public function edit(Subject $subject)
    {
        return Inertia::render('subject/edit-subject', [
            'subject' => $subject
        ]);
    }

    /**
     * Update the subject record.
     */
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'subject_code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('subjects')->ignore($subject->id)
            ],
            'subject_title' => ['required', 'string', 'max:255'],
            'units' => ['required', 'integer', 'min:1', 'max:6'],
        ]);

        $subject->update($validated);

        return redirect()->route('subjects.index')
            ->with('message', "Subject record for {$subject->subject_code} has been updated.");
    }

    /**
     * Remove the subject from the registry.
     */
    public function destroy(Subject $subject)
    {
        $code = $subject->subject_code;
        $subject->delete();

        return redirect()->route('subjects.index')
            ->with('message', "Subject {$code} has been removed from the registry.");
    }
}