/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added Button
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    FileText,
    GraduationCap,
    Printer,
    Search,
    ShieldCheck,
} from 'lucide-react'; // Added Printer icon

export default function StudentGrades({
    grades,
    periods,
    currentPeriodId,
    auth,
}: any) {
    const activePeriod = periods.find(
        (p: any) => p.id.toString() === currentPeriodId.toString(),
    );

    const handlePeriodChange = (value: string) => {
        router.get(
            '/my-grades',
            { academic_period_id: value },
            { preserveState: true },
        );
    };

    // Trigger browser print dialog
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'My Report Card', href: '/my-grades' }]}
        >
            <Head title="My Grades" />

            {/* Print-specific Styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    nav, aside, button, .no-print { display: none !important; }
                    .print-container { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
                    body { background-color: white !important; }
                    .card { border: none !important; box-shadow: none !important; }
                }
            `,
                }}
            />

            <div className="print-container mx-auto flex max-w-5xl flex-col gap-6 p-6">
                {/* Institutional Header & Filter */}
                <div className="flex flex-col justify-between gap-6 border-b-2 border-slate-900 pb-6 md:flex-row md:items-end">
                    <div className="space-y-1">
                        <div className="mb-2 flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-slate-900" />
                            <h1 className="text-2xl font-black tracking-tighter uppercase">
                                Academic Transcript
                            </h1>
                        </div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
                            Official Student Grade Registry
                        </p>
                    </div>

                    <div className="no-print flex flex-col gap-4 md:items-end">
                        <div className="flex flex-col gap-2 md:items-end">
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                Academic Term:
                            </span>
                            <Select
                                value={currentPeriodId.toString()}
                                onValueChange={handlePeriodChange}
                            >
                                <SelectTrigger className="h-10 w-[260px] border-slate-200 font-bold uppercase focus:ring-slate-400">
                                    <SelectValue placeholder="Select Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periods.map((p: any) => (
                                        <SelectItem
                                            key={p.id}
                                            value={p.id.toString()}
                                            className="text-xs font-bold uppercase"
                                        >
                                            SY {p.school_year} —{' '}
                                            {p.semester === 1 ? '1st' : '2nd'}{' '}
                                            Sem
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Print Action Button */}
                        <Button
                            onClick={handlePrint}
                            className="h-9 bg-slate-900 text-[10px] font-black tracking-widest uppercase hover:bg-slate-800"
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print
                            Transcript
                        </Button>
                    </div>
                </div>

                {/* Student Info Ledger */}
                <div className="grid grid-cols-1 gap-8 rounded-sm border border-slate-200 bg-slate-50/50 p-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Student Name
                            </p>
                            <p className="text-base font-black text-slate-900 uppercase">
                                {auth.user.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Identification No.
                            </p>
                            <p className="font-mono text-sm font-bold text-slate-700">
                                {auth.user.school_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between md:items-end">
                        <div className="md:text-right">
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Status
                            </p>
                            <div className="flex items-center gap-2 md:justify-end">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                                    Verified Grades
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {activePeriod?.school_year} |{' '}
                            {activePeriod?.semester === 1 ? 'First' : 'Second'}{' '}
                            Semester
                        </p>
                    </div>
                </div>

                {/* Simplified Table */}
                <Card className="card overflow-hidden border-slate-200 bg-white shadow-sm">
                    <CardHeader className="no-print border-b bg-slate-50/50 py-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                Course Completion Summary
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-4 pl-6 text-[10px] font-black tracking-widest text-slate-900 uppercase">
                                        Subject & Course Code
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                        Credits
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                        Numerical Rating
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-black text-slate-900 uppercase">
                                        Result
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
                                            <TableCell className="py-6 pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs leading-tight font-black text-slate-900 uppercase">
                                                        {item.subject_title}
                                                    </span>
                                                    <span className="font-mono text-[10px] font-bold text-slate-400">
                                                        {item.subject_code}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-xs font-bold text-slate-600">
                                                {item.units}.0
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-base font-black text-slate-900">
                                                    {item.grade?.letter_grade ??
                                                        '—'}
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
                                                        'N/A'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-300">
                                                <Search className="h-8 w-8 opacity-20" />
                                                <p className="text-[10px] font-bold tracking-widest uppercase">
                                                    No curriculum records for
                                                    this period.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex justify-center border-t border-dashed border-slate-200 pt-6">
                    <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        End of Transcript — Confidential Student Record —
                        Generated {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
