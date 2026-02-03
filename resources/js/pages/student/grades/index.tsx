/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { FileText, Search } from 'lucide-react';

export default function StudentGrades({
    grades,
    periods,
    currentPeriodId,
}: any) {
    const handlePeriodChange = (value: string) => {
        router.get(
            '/my-grades',
            { academic_period_id: value },
            { preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'My Report Card', href: '/my-grades' }]}
        >
            <Head title="My Grades" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header & Filter */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                            <FileText className="h-6 w-6 text-slate-700" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                                My Academic Grades
                            </h1>
                            <p className="text-sm text-slate-500">
                                View your performance for the selected semester.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                            Term:
                        </span>
                        <Select
                            value={currentPeriodId.toString()}
                            onValueChange={handlePeriodChange}
                        >
                            <SelectTrigger className="w-[240px] border-slate-200 bg-white focus:ring-slate-400">
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((p: any) => (
                                    <SelectItem
                                        key={p.id}
                                        value={p.id.toString()}
                                    >
                                        SY {p.school_year} —{' '}
                                        {p.semester === 1 ? '1st' : '2nd'} Sem
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Grades Table */}
                <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="py-4 pl-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Subject
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Units
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Midterm
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Final Exam
                                    </TableHead>
                                    <TableHead className="bg-slate-100/30 text-center text-[10px] font-bold tracking-widest text-slate-900 uppercase">
                                        Total Grade
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Remarks
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grades.length > 0 ? (
                                    grades.map((item: any) => (
                                        <TableRow
                                            key={item.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30"
                                        >
                                            <TableCell className="py-5 pl-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs leading-tight font-bold text-slate-900 uppercase">
                                                        {item.subject_title}
                                                    </span>
                                                    <span className="font-mono text-[10px] font-medium text-slate-400">
                                                        {item.subject_code}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-xs font-medium text-slate-600">
                                                {item.units}
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-slate-500">
                                                {item.grade?.m_exam_1st_sem ??
                                                    item.grade
                                                        ?.m_exam_2nd_sem ??
                                                    '—'}
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-slate-500">
                                                {item.grade?.f_exam_1st_sem ??
                                                    item.grade
                                                        ?.f_exam_2nd_sem ??
                                                    '—'}
                                            </TableCell>
                                            <TableCell className="bg-slate-50/30 text-center">
                                                <span className="text-sm font-black text-slate-900">
                                                    {item.grade
                                                        ?.total_grade_1st_sem ??
                                                        item.grade
                                                            ?.total_grade_2nd_sem ??
                                                        'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-sm px-2 py-0 text-[10px] font-black uppercase ${
                                                        item.grade?.remarks ===
                                                        'PASSED'
                                                            ? 'border-slate-900 bg-slate-900 text-white'
                                                            : item.grade
                                                                    ?.remarks ===
                                                                'FAILED'
                                                              ? 'border-red-200 bg-red-50 text-red-700'
                                                              : 'border-slate-200 bg-white text-slate-400'
                                                    }`}
                                                >
                                                    {item.grade?.remarks ??
                                                        'Pending'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                                <Search className="h-8 w-8 opacity-20" />
                                                <p className="text-sm italic">
                                                    No enrollment records found
                                                    for this period.
                                                </p>
                                            </div>
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
