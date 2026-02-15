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
import { EditIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';

export type Section = {
    id: number;
    section_name: string;
    subject: {
        subject_code: string;
        subject_title: string;
    };
    academic_period?: {
        school_year: string;
        semester: string;
    };
};

export const columns: ColumnDef<Section>[] = [
    {
        accessorKey: 'section_name',
        header: 'Section Name',
        cell: ({ row }) => (
            <span className="font-mono font-bold text-slate-900 uppercase">
                {row.original.section_name}
            </span>
        ),
    },
    {
        id: 'subject_info',
        header: 'Assigned Subject',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-tight text-slate-400 uppercase">
                    {row.original.subject.subject_code}
                </span>
                <span className="text-xs font-bold text-slate-700 uppercase">
                    {row.original.subject.subject_title}
                </span>
            </div>
        ),
    },
    {
        id: 'period',
        header: 'Academic Term',
        cell: ({ row }) => (
            <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                {row.original.academic_period?.school_year} | Sem{' '}
                {row.original.academic_period?.semester}
            </span>
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
                                    `/sections/${row.original.id}/edit`,
                                )
                            }
                        >
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                if (confirm('Remove this section instance?')) {
                                    router.delete(
                                        `/sections/${row.original.id}`,
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
