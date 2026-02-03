<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Support\Facades\Auth;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = Auth::user();

        // Check Spatie roles
        if ($user->hasRole('dean')) {
            return redirect()->intended('/manage-users'); // Or your Dean dashboard
        }

        if ($user->hasRole('professor')) {
            return redirect()->intended('/dashboard'); // Or specific grading page
        }

        // Default for students or others
        return redirect()->intended('/dashboard');
    }
}