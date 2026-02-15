'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, EditIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';

export type Subject = {
    id: number;
    subject_code: string;
    subject_title: string;
    units: number;
    created_at: string;
};

export const columns: ColumnDef<Subject>[] = [
    {
        accessorKey: 'subject_code',
        header: 'Code',
        cell: ({ row }) => (
            <span className="font-mono font-bold text-slate-900">
                {row.original.subject_code}
            </span>
        ),
    },
    {
        accessorKey: 'subject_title',
        header: 'Subject Title',
        cell: ({ row }) => (
            <span className="text-xs font-medium uppercase">
                {row.original.subject_title}
            </span>
        ),
    },
    {
        accessorKey: 'units',
        header: 'Units',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-slate-400" />
                <span className="font-bold">{row.original.units}.0</span>
            </div>
        ),
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
                            onClick={() =>
                                router.visit(
                                    `/subjects/${row.original.id}/edit`,
                                )
                            }
                        >
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                if (
                                    confirm(
                                        'Remove this subject from the registry?',
                                    )
                                ) {
                                    router.delete(
                                        `/subjects/${row.original.id}`,
                                    );
                                }
                            }}
                        >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
