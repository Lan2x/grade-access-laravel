<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class ManageUsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query()->with('roles');

        if ($request->filled('name')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->name}%")
                    ->orWhere('school_id', 'like', "%{$request->name}%");
            });
        }

        // Role Filtering logic
        if ($request->filled('role')) {
            $query->role($request->role);
        }

        $paginated_data = $query->paginate($request->per_page ?? 15)
            ->withQueryString(); // This keeps the URL params during pagination

        return Inertia::render('manage-user/manage-user', [
            'paginated_data' => $paginated_data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('manage-user/add-user');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming request
        $request->validate([
            'school_id' => ['required', 'string', 'max:255', 'unique:users'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'role' => ['required', 'string', 'exists:roles,name'], // Ensures role exists in Spatie table
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // 2. Create the User
        // Note: We use the school_id as the default password
        $user = User::create([
            'school_id' => $request->school_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Assign the Spatie Role
        $user->assignRole($request->role);

        // 4. Redirect back to the index with a flash message
        return redirect()->route('manage-users.index')
            ->with('message', "User {$user->name} has been successfully registered.");
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('manage-user/edit-user', compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // 1. Validate the incoming request
        $validated = $request->validate([
            'school_id' => [
                'required',
                'string',
                Rule::unique('users')->ignore($user->id) // Ignore current user for unique check
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id) // Ignore current user for unique check
            ],
            // Password is optional during update
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // 2. Update basic information
        $user->fill([
            'school_id' => $validated['school_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // 3. Only update password if it was actually provided
        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // 4. Redirect with a success flash message
        return redirect()->route('manage-users.index')
            ->with('message', "Account for {$user->name} has been updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // 1. Security Check: Prevent the Dean from deleting their own account
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        // 2. Capture name for the success message before deletion
        $userName = $user->name;

        // 3. Delete the user
        // Because of ->cascadeOnDelete() in your migrations, related 
        // subject_assignments and enrollments will be deleted automatically.
        $user->delete();

        // 4. Redirect with a success toast message
        return redirect()->route('manage-users.index')
            ->with('message', "User {$userName} and all associated records have been removed.");
    }
}
