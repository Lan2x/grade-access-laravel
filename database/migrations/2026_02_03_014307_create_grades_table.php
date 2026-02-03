<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            // Link to the enrollment (which ties student to a specific subject/section)
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();

            /**
             * ORANGE BOX FIELDS (Right Panel)
             * Columns: 1st Semester | 2nd Semester
             */

            // QAS (Quiz/Assignment/Seatwork)
            $table->decimal('qas_1st_sem', 5, 2)->nullable();
            $table->decimal('qas_2nd_sem', 5, 2)->nullable();

            // GA/CA (Group/Class Activity)
            $table->decimal('gaca_1st_sem', 5, 2)->nullable();
            $table->decimal('gaca_2nd_sem', 5, 2)->nullable();

            // M. EXAM (Midterm Exam) 
            $table->decimal('m_exam_1st_sem', 5, 2)->nullable();
            $table->decimal('m_exam_2nd_sem', 5, 2)->nullable();

            // F. EXAM (Final Exam)
            $table->decimal('f_exam_1st_sem', 5, 2)->nullable();
            $table->decimal('f_exam_2nd_sem', 5, 2)->nullable();

            // F. OUTPUT (Final Output)
            $table->decimal('output_1st_sem', 5, 2)->nullable();
            $table->decimal('output_2nd_sem', 5, 2)->nullable();

            // ATTENDANCE (Single field in UI, but usually applies to the semester)
            $table->decimal('attendance_1st_sem', 5, 2)->nullable();
            $table->decimal('attendance_2nd_sem', 5, 2)->nullable();

            // The two boxes under "Grades" title
            $table->decimal('total_grade_1st_sem', 5, 2)->nullable();
            $table->decimal('total_grade_2nd_sem', 5, 2)->nullable();

            // Final Result Fields
            $table->string('remarks')->nullable(); // e.g., "PASSED"
            $table->string('letter_grade', 10)->nullable(); // e.g., "1.25"

            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};