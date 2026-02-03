import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import manageUsers from '@/routes/manage-users';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FilterIcon, PlusSquareIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns, type User } from './columns'; // Import User type from columns for consistency
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: manageUsers.index().url,
    },
];

export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

// Updated Response Interface to include user relationships
export interface UsersResponse {
    paginated_data: {
        current_page: number;
        data: User[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PaginationLink[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    flash: {
        message?: string;
    };
}

export default function ManageUserPage() {
    const { paginated_data, flash } = usePage()
        .props as unknown as UsersResponse;
    const params = new URLSearchParams(window.location.search);

    const [searchTerm, setSearchTerm] = useState(params.get('name') || '');
    const [selectedRole, setSelectedRole] = useState(
        params.get('role') || 'all',
    );

    useEffect(() => {
        if (flash.message) toast.success(flash.message);
    }, [flash.message]);

    // Centralized filter function to handle multiple parameters
    const applyFilters = (newParams: Record<string, string>) => {
        const currentParams = Object.fromEntries(params.entries());
        router.get(
            manageUsers.index().url,
            {
                ...currentParams,
                ...newParams,
                page: '1', // Reset to page 1 on filter change
            },
            { preserveState: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({
            name: searchTerm,
            role: selectedRole === 'all' ? '' : selectedRole,
        });
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        applyFilters({ role: value === 'all' ? '' : value });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex flex-col items-end gap-4 md:flex-row">
                        {/* Search Input */}
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="search"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Search Records:
                            </Label>
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-2"
                            >
                                <Input
                                    id="search"
                                    placeholder="Name or School ID..."
                                    className="h-9 w-64"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-9 cursor-pointer bg-slate-900"
                                >
                                    <SearchIcon className="mr-2 h-4 w-4" />{' '}
                                    Search
                                </Button>
                            </form>
                        </div>

                        {/* Role Filter */}
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="role-filter"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Filter by Role:
                            </Label>
                            <Select
                                value={selectedRole}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger
                                    id="role-filter"
                                    className="h-9 w-40"
                                >
                                    <div className="flex items-center gap-2">
                                        <FilterIcon className="h-3 w-3 text-slate-400" />
                                        <SelectValue placeholder="All Roles" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        ALL ROLES
                                    </SelectItem>
                                    <SelectItem value="dean">DEAN</SelectItem>
                                    <SelectItem value="professor">
                                        PROFESSOR
                                    </SelectItem>
                                    <SelectItem value="student">
                                        STUDENT
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        className="h-9 w-fit cursor-pointer bg-slate-900 hover:bg-slate-800"
                        onClick={() => router.visit(manageUsers.create().url)}
                    >
                        <PlusSquareIcon className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                    <DataTable columns={columns} data={paginated_data.data} />
                </div>

                {/* Pagination (Remember to update the pagination calls to preserve the 'role' param) */}
                <div className="flex items-center justify-between gap-2 px-2">
                    <div className="text-sm font-medium text-slate-500">
                        Showing {paginated_data.from} to {paginated_data.to} of{' '}
                        {paginated_data.total} users
                    </div>

                    <div className="flex gap-2">
                        {/* Per Page Select - Updated to preserve 'role' */}
                        <Select
                            onValueChange={(value) =>
                                applyFilters({ per_page: value })
                            }
                            defaultValue={params.get('per_page') || '15'}
                        >
                            <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 rows</SelectItem>
                                <SelectItem value="30">30 rows</SelectItem>
                                <SelectItem value="50">50 rows</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-1">
                            {paginated_data.links?.map((item, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        item.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className={`h-8 cursor-pointer ${!item.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() =>
                                        item.url && router.visit(item.url)
                                    }
                                    disabled={!item.url}
                                >
                                    {item.label.includes('Prev')
                                        ? 'Prev'
                                        : item.label.includes('Next')
                                          ? 'Next'
                                          : item.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
