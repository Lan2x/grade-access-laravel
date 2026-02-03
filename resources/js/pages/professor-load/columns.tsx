/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2Icon, UserCog, X } from 'lucide-react';
import { toast } from 'sonner';
import { Professor } from './professor-load';

// ... (Keep your interfaces as they were)

export const columns: ColumnDef<Professor>[] = [
    {
        accessorKey: 'school_id',
        header: 'School ID',
        cell: ({ row }) => (
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">
                {row.original.school_id}
            </span>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Professor Name',
        cell: ({ row }) => (
            <span className="text-xs font-bold text-slate-900 uppercase">
                {row.original.name}
            </span>
        ),
    },
    {
        id: 'assigned_load',
        header: 'Assigned Load',
        cell: ({ row }) => {
            const loads = row.original.assignments;

            const removeAssignment = (assignmentId: number) => {
                if (confirm('Remove this subject from professor load?')) {
                    router.delete(`/professor-loads/${assignmentId}`, {
                        onSuccess: () => toast.error('Assignment removed'),
                    });
                }
            };

            if (loads.length === 0)
                return (
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                        No assignments
                    </span>
                );

            return (
                <div className="flex max-w-[400px] flex-wrap gap-2">
                    {loads.map((asgn) => (
                        <div
                            key={asgn.id}
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white py-1 pr-1 pl-2 shadow-sm transition-colors hover:border-slate-300"
                        >
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-black text-slate-900 uppercase">
                                    {asgn.section.section_name}
                                </span>
                                <span className="max-w-[120px] truncate text-[9px] font-medium text-slate-500">
                                    {asgn.section.subject.subject_title}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAssignment(asgn.id)}
                                className="h-6 w-6 rounded-sm text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'total_units',
        header: 'Total Units',
        cell: ({ row }) => {
            const units = row.original.total_units;
            return (
                <Badge
                    variant="outline"
                    className={`rounded-sm px-2 py-0.5 text-[10px] font-black ${
                        units > 21
                            ? 'border-red-200 bg-red-50 text-red-700 shadow-none'
                            : 'border-slate-900 bg-slate-900 text-white shadow-none'
                    }`}
                >
                    {units} UNITS
                </Badge>
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
                            className="h-8 w-8 cursor-pointer p-0 hover:bg-slate-100"
                        >
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="border-slate-200 shadow-xl"
                    >
                        <DropdownMenuItem
                            className="py-2 text-xs font-bold tracking-tight uppercase"
                            onClick={() =>
                                router.visit(
                                    `/professor-loads/manage/${row.original.id}`,
                                )
                            }
                        >
                            <UserCog className="mr-2 h-4 w-4" /> Manage Load
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="py-2 text-xs font-bold tracking-tight text-red-600 uppercase focus:bg-red-50 focus:text-red-600"
                            onClick={() => {
                                if (
                                    confirm(
                                        `Clear all assignments for ${row.original.name}?`,
                                    )
                                ) {
                                    router.delete(
                                        `/professor-loads/clear/${row.original.id}`,
                                    );
                                }
                            }}
                        >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Clear All
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
