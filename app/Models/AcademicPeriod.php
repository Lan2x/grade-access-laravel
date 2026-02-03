<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class AcademicPeriod extends Model
{
    protected $fillable = ['school_year', 'semester', 'is_active', 'allow_submissions'];

    public function assignments(): HasMany
    {
        return $this->hasMany(SubjectAssignment::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}