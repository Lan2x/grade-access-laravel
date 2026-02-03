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
import professorLoads from '@/routes/professor-loads';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpenCheck, PlusSquareIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Professor Loads',
        href: '/professor-loads',
    },
];

// Reusing your pagination interfaces for consistency
export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

// resources/js/pages/dean/professor-loads/types.ts (or inside your index.tsx)

export interface Subject {
    id: number;
    subject_code: string;
    subject_title: string;
    units: number;
}

export interface Section {
    id: number;
    section_name: string;
    subject: Subject; // From the .subject eager load
}

export interface Assignment {
    id: number;
    user_id: number;
    section_id: number;
    academic_period_id: number;
    section: Section; // From the .section eager load
}

export interface Professor {
    id: number;
    school_id: string;
    name: string;
    email: string;
    assignments: Assignment[]; // The professor's "load"
    total_units: number; // Calculated in the Controller map
}

// Update your main Response interface
export interface ProfessorLoadResponse {
    paginated_data: {
        current_page: number;
        data: Professor[]; // Use the new interface here
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
    activePeriod: {
        id: number;
        school_year: string;
        semester: string;
    };
    flash: {
        message?: string;
        error?: string;
    };
}
export default function ProfessorLoadPage() {
    const { paginated_data, activePeriod, flash } = usePage()
        .props as unknown as ProfessorLoadResponse;
    const [searchTerm, setSearchTerm] = useState('');
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        if (flash.message) toast.success(flash.message);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/professor-loads', {
            per_page: params.get('per_page') || '15',
            name: searchTerm,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Professor Loads" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Information Card */}
                <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#26a690]/10 p-2">
                            <BookOpenCheck className="h-5 w-5 text-[#26a690]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                Academic Loading
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Currently viewing:{' '}
                                <span className="font-semibold text-[#26a690]">
                                    {activePeriod?.school_year} -{' '}
                                    {activePeriod?.semester} Semester
                                </span>
                            </p>
                        </div>
                    </div>

                    <Button
                        className="w-fit cursor-pointer bg-[#26a690] hover:bg-[#26a690]/90"
                        onClick={() =>
                            router.visit(professorLoads.create().url)
                        }
                    >
                        <PlusSquareIcon className="mr-2 h-4 w-4" />
                        Assign New Load
                    </Button>
                </div>

                {/* Search & Filtering */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="search">Find Professor:</Label>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            id="search"
                            placeholder="Search by Professor Name or ID..."
                            className="w-80"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            defaultValue={params.get('name') || ''}
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            className="cursor-pointer"
                        >
                            <SearchIcon className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </form>
                </div>

                {/* Main Data Table */}
                <div className="rounded-md border bg-white dark:bg-zinc-900">
                    <DataTable
                        columns={columns}
                        data={paginated_data?.data || []}
                    />
                </div>

                {/* Standardized Pagination Controls */}
                <div className="flex items-center justify-between gap-2 px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {paginated_data?.from} to {paginated_data?.to}{' '}
                        of {paginated_data?.total} records
                    </div>

                    <div className="flex gap-2">
                        <Select
                            onValueChange={(value) =>
                                router.get(
                                    '/professor-loads',
                                    {
                                        per_page: value,
                                        name: params.get('name') || '',
                                    },
                                    { preserveState: true },
                                )
                            }
                            defaultValue={params.get('per_page') || '15'}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 rows</SelectItem>
                                <SelectItem value="30">30 rows</SelectItem>
                                <SelectItem value="50">50 rows</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-1">
                            {paginated_data?.links?.map((item, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        item.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className={`cursor-pointer ${!item.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() =>
                                        item.url && router.visit(item.url)
                                    }
                                    disabled={!item.url}
                                >
                                    {item.label
                                        .replace('&laquo; Previous', 'Prev')
                                        .replace('Next &raquo;', 'Next')}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
