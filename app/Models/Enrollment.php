<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
;

class Enrollment extends Model
{
    protected $fillable = ['student_id', 'section_id', 'academic_period_id'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    // Every enrollment has one grade record
    public function grade(): HasOne
    {
        return $this->hasOne(Grade::class);
    }

    public function academicPeriod()
    {
        return $this->belongsTo(AcademicPeriod::class);
    }
}