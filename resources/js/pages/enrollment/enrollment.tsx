/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    FilterX,
    GraduationCap,
    LayoutList,
    Users,
} from 'lucide-react';

interface Props {
    sections: any[];
    subjects: { id: number; subject_title: string; subject_code: string }[];
    activePeriod: any;
    filters: { subject_id?: string };
}

export default function EnrollmentIndex({
    sections,
    subjects,
    activePeriod,
    filters,
}: Props) {
    const handleFilterChange = (value: string) => {
        router.get(
            '/enrollments', // Updated to match your route prefix
            { subject_id: value },
            { preserveState: true },
        );
    };

    const clearFilters = () => {
        router.get('/enrollments');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Student Enrollment', href: '/enrollments' },
            ]}
        >
            <Head title="Enrollment Management" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Information Card */}
                <Card className="border-t-4 shadow-sm">
                    <CardHeader className="flex flex-col items-start justify-between space-y-4 pb-6 md:flex-row md:items-center md:space-y-0">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-slate-100 p-3">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight uppercase">
                                    Enrollment Management
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Active Period:{' '}
                                    <span className="font-bold">
                                        {activePeriod?.school_year} -{' '}
                                        {activePeriod?.semester} Semester
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-auto">
                            <Select
                                onValueChange={handleFilterChange}
                                defaultValue={filters.subject_id}
                            >
                                <SelectTrigger className="w-full border-slate-200 bg-slate-50 md:w-[280px]">
                                    <SelectValue placeholder="Filter by Subject..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub) => (
                                        <SelectItem
                                            key={sub.id}
                                            value={sub.id.toString()}
                                        >
                                            {sub.subject_code} -{' '}
                                            {sub.subject_title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {filters.subject_id && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="px-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <FilterX className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* Sections Table Card */}
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 py-4">
                        <div className="flex items-center gap-2">
                            <LayoutList className="h-4 w-4 text-slate-500" />
                            <CardTitle className="text-sm font-semibold text-slate-700">
                                Available Class Sections
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow>
                                    <TableHead className="py-4 pl-6 text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                                        Subject Details
                                    </TableHead>
                                    <TableHead className="text-center text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                                        Section Name
                                    </TableHead>
                                    <TableHead className="text-center text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                                        Total Students
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.length > 0 ? (
                                    sections.map((sec) => (
                                        <TableRow
                                            key={sec.id}
                                            className="transition-colors hover:bg-slate-50/50"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">
                                                        {sec.subject_title}
                                                    </span>
                                                    <span className="font-mono text-[11px] font-semibold">
                                                        {sec.subject_code}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className="border-slate-200 bg-slate-100 px-3 font-bold text-slate-600"
                                                >
                                                    {sec.section_name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    <span className="text-lg font-black text-slate-700">
                                                        {sec.student_count}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    onClick={() =>
                                                        router.visit(
                                                            `/enrollments/section/${sec.id}`,
                                                        )
                                                    }
                                                    className="h-9 cursor-pointer px-4 font-bold text-white shadow-md transition-all active:scale-95"
                                                >
                                                    Manage Enrollment{' '}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-40 text-center text-slate-400 italic"
                                        >
                                            No active sections found for the
                                            selected criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
