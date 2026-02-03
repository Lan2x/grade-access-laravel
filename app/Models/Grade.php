<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    // These fields match the 1st/2nd Sem split in your form
    protected $fillable = [
        'enrollment_id',
        'qas_1st_sem',
        'qas_2nd_sem',
        'gaca_1st_sem',
        'gaca_2nd_sem',
        'm_exam_1st_sem',
        'm_exam_2nd_sem',
        'f_exam_1st_sem',
        'f_exam_2nd_sem',
        'output_1st_sem',
        'output_2nd_sem',
        'attendance_1st_sem',
        'attendance_2nd_sem',
        'total_grade_1st_sem',
        'total_grade_2nd_sem',
        'letter_grade',
        'remarks',
        'status',
    ];

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}