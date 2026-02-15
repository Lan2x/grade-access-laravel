<?php

use App\Http\Controllers\AcademicPeriodController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeManagementController;
use App\Http\Controllers\ManageUsersController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\Products;
use App\Http\Controllers\ProfessorLoadController;
use App\Http\Controllers\ProfessorReportController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentGradeController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');//products', [Products::class, 'index'])->name('products.index'); // name is used by wayfinder when generating types


    Route::middleware(['can:manage_users'])->group(function () {
        Route::prefix('manage-users')->name('manage-users.')->group(function () {
            Route::get('/', [ManageUsersController::class, 'index'])->name('index');
            Route::get('/create', [ManageUsersController::class, 'create'])->name('create');
            Route::get('/edit/{user}', [ManageUsersController::class, 'edit'])->name('edit');

            // Don't forget your actions (POST, PUT, DELETE) should also be here!
            Route::post('/', [ManageUsersController::class, 'store'])->name('store');
            Route::put('/{user}', [ManageUsersController::class, 'update'])->name('update');
            Route::delete('/{user}', [ManageUsersController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('subjects')->name('subjects.')->group(function () {
            Route::get('/', [SubjectController::class, 'index'])->name('index');
            Route::get('/create', [SubjectController::class, 'create'])->name('create');
            Route::get('/{subject}/edit', [SubjectController::class, 'edit'])->name('edit');
            Route::post('/', [SubjectController::class, 'store'])->name('store');
            Route::put('/{subject}', [SubjectController::class, 'update'])->name('update');
            Route::delete('/{subject}', [SubjectController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('sections')->name('sections.')->group(function () {
            Route::get('/', [SectionController::class, 'index'])->name('index');
            Route::get('/create', [SectionController::class, 'create'])->name('create');
            Route::get('/{section}/edit', [SectionController::class, 'edit'])->name('edit'); // Add this
            Route::post('/', [SectionController::class, 'store'])->name('store');
            Route::put('/{section}', [SectionController::class, 'update'])->name('update'); // Add this
            Route::delete('/{section}', [SectionController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('professor-loads')->name('professor-loads.')->group(function () {
            Route::get('/', [ProfessorLoadController::class, 'index'])->name('index');
            Route::get('/create', [ProfessorLoadController::class, 'create'])->name('create'); // For the assignment form

            // Don't forget your actions (POST, PUT, DELETE) should also be here!
            Route::post('/', [ProfessorLoadController::class, 'store'])->name('store');
            // Remove a specific assignment/subject from a professor
            Route::delete('/{assignment}', [ProfessorLoadController::class, 'destroy'])->name('destroy');

            // Bulk action to clear all loads for a specific professor in the current semester
            Route::delete('/clear/{user}', [ProfessorLoadController::class, 'clearAll'])->name('clear-all');

        });

        // 3. Student Enrollment 
        Route::prefix('enrollments')->name('enrollments.')->group(function () {
            // The main list of sections with student counts
            Route::get('/', [EnrollmentController::class, 'index'])->name('index');

            // The page where you actually add/remove students from a specific section
            Route::get('/section/{section}', [EnrollmentController::class, 'manage'])->name('manage');

            // Actions for adding and removing students
            Route::post('/section/{section}', [EnrollmentController::class, 'store'])->name('store');
            Route::delete('/{enrollment}', [EnrollmentController::class, 'destroy'])->name('destroy');
        });
        // 4. Academic Period Management
        Route::prefix('academic-periods')->name('academic-periods.')->group(function () {
            Route::get('/', [AcademicPeriodController::class, 'index'])->name('index');
            Route::post('/', [AcademicPeriodController::class, 'store'])->name('store');
            Route::patch('/{period}', [AcademicPeriodController::class, 'update'])->name('update');
            Route::patch('/{period}/activate', [AcademicPeriodController::class, 'activate'])->name('activate');
            Route::patch('/{period}/toggle-submissions', [AcademicPeriodController::class, 'toggleSubmissions'])->name('toggle-submissions');
        });
    });

    Route::middleware(['can:manage_grades'])->group(function () {
        Route::prefix('manage-grades')->name('manage-grades.')->group(function () {
            Route::get('/', [GradeManagementController::class, 'index'])->name('index');
            Route::get('/entry/{section}', [GradeManagementController::class, 'enter'])->name('entry');
            Route::post('/update-batch/{section}', [GradeManagementController::class, 'updateBatch'])->name('update-batch');
        });
        Route::prefix('professor-reports')->name('professor-reports.')->group(function () {
            // Main report selection page
            Route::get('/', [ProfessorReportController::class, 'index'])->name('index');

            // View/Export Class List with Grades
            Route::get('/class-list/{section}', [ProfessorReportController::class, 'classList'])->name('class-list');

            // View/Export Individual Student Grade Report
            Route::get('/student-transcript/{user}/{period}', [ProfessorReportController::class, 'studentTranscript'])->name('student-transcript');
        });
    });

    Route::middleware(['can:view_my_grades'])->group(function () {
        Route::prefix('my-grades')->name('my-grades.')->group(function () {
            Route::get('/', [StudentGradeController::class, 'index'])->name('index');
        });
    });


});

require __DIR__ . '/settings.php';
