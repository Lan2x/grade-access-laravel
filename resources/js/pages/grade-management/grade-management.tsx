import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    SearchIcon,
} from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Grades', href: '/professor/grades' },
];

export default function ProfessorGradeDashboard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { paginated_data, activePeriod } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/professor/grades',
            { search: searchTerm },
            { preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Grading Portal" />
            <div className="flex flex-col gap-6 p-6">
                {/* Professor Header Info */}
                <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-[#26a690]/10 p-3">
                            <GraduationCap className="h-6 w-6 text-[#26a690]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Instructor Grading Portal
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Active Semester:{' '}
                                <span className="font-semibold text-[#26a690]">
                                    {activePeriod?.school_year} -{' '}
                                    {activePeriod?.semester}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search / Filter Section */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="search">Search your sections:</Label>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative w-80">
                            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search Subject or Section..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Grade Sections Table */}
                <div className="white-card overflow-hidden">
                    <div className="flex items-center gap-2 border-b bg-slate-50/50 p-4 dark:bg-zinc-800/50">
                        <BookOpen className="h-4 w-4 text-[#26a690]" />
                        <h2 className="font-bold">Assigned Class Loads</h2>
                    </div>
                    <DataTable
                        columns={columns}
                        data={paginated_data?.data || []}
                    />
                </div>

                {/* Empty State Guard */}
                {paginated_data?.data.length === 0 && (
                    <div className="rounded-xl border border-dashed bg-white py-20 text-center">
                        <LayoutDashboard className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-2 text-sm font-semibold text-slate-900">
                            No classes assigned
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            If you believe this is an error, please contact the
                            Dean.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
