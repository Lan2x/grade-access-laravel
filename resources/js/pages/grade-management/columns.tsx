'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { entry } from '@/routes/manage-grades';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, FileEdit, MoreHorizontal, Users } from 'lucide-react';

export interface SectionGradeView {
    id: number;
    section_name: string;
    subject_code: string;
    subject_title: string;
    units: number;
    student_count: number;
    graded_count: number;
}

export const columns: ColumnDef<SectionGradeView>[] = [
    {
        accessorKey: 'subject_code',
        header: 'Code',
        cell: ({ row }) => (
            <span className="font-mono font-bold text-[#26a690]">
                {row.original.subject_code}
            </span>
        ),
    },
    {
        accessorKey: 'subject_title',
        header: 'Subject Title',
        cell: ({ row }) => (
            <span className="font-semibold">{row.original.subject_title}</span>
        ),
    },
    {
        accessorKey: 'section_name',
        header: 'Section',
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.section_name}</Badge>
        ),
    },
    {
        id: 'progress',
        header: 'Grading Progress',
        cell: ({ row }) => {
            const isComplete =
                row.original.student_count > 0 &&
                row.original.graded_count === row.original.student_count;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs">
                        {row.original.graded_count} /{' '}
                        {row.original.student_count} Students
                    </span>
                    {isComplete && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 cursor-pointer p-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => router.visit(entry(row.original.id))}
                        >
                            <FileEdit className="mr-2 h-4 w-4" /> Enter Grades
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    `/professor/sections/students/${row.original.id}`,
                                )
                            }
                        >
                            <Users className="mr-2 h-4 w-4" /> View Class List
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
