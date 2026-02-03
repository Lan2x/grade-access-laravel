'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge'; // Optional: using shadcn badge for roles
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import manageUsers, { edit } from '@/routes/manage-users';
import { router } from '@inertiajs/react';

export type User = {
    id: number;
    school_id: string;
    name: string;
    email: string;
    roles: { name: string }[]; // Added to show User Type
    // For Students
    enrollment?: {
        section?: {
            section_name: string;
        };
    };
    // For Professors
    assignments?: {
        section?: {
            subject?: {
                subject_title: string;
            };
        };
    }[];
    created_at: Date;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'school_id',
        header: 'School ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        id: 'user_type',
        header: 'User Type',
        cell: ({ row }) => {
            const role = row.original.roles?.[0]?.name || 'N/A';
            const colors: Record<string, string> = {
                dean: 'bg-red-100 text-red-700 border-red-200',
                professor: 'bg-blue-100 text-blue-700 border-blue-200',
                student: 'bg-green-100 text-green-700 border-green-200',
            };

            return (
                <Badge
                    variant="outline"
                    className={`capitalize ${colors[role]}`}
                >
                    {role}
                </Badge>
            );
        },
    },
    {
        id: 'section_or_subject',
        header: 'Section / Subject',
        cell: ({ row }) => {
            const role = row.original.roles?.[0]?.name;

            if (role === 'student') {
                return (
                    <span className="text-sm">
                        {row.original.enrollment?.section?.section_name || '—'}
                    </span>
                );
            }

            if (role === 'professor') {
                // Shows the first assigned subject title
                return (
                    <span className="text-sm italic">
                        {row.original.assignments?.[0]?.section?.subject
                            ?.subject_title || 'No Load'}
                    </span>
                );
            }

            return <span className="text-gray-400">—</span>;
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
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
                                router.visit(edit({ id: row.original.id }))
                            }
                        >
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                if (confirm('Delete this user?')) {
                                    router.delete(
                                        manageUsers.destroy({
                                            id: row.original.id,
                                        }),
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
