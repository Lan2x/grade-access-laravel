/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Printer } from 'lucide-react';

export default function ClassListReport({ section }: any) {
    const handlePrint = () => window.print();
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Class List Report', href: '#' }]}>
            <Head title={`Class List - ${section.section_name}`} />

            <div className="mx-auto max-w-6xl space-y-8 bg-white p-8 print:p-0 print:shadow-none">
                {/* Actions (Hidden on Print) */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="text-[10px] font-bold uppercase"
                    >
                        <ArrowLeft className="mr-2 h-3 w-3" /> Back
                    </Button>
                    <Button
                        onClick={handlePrint}
                        className="h-10 bg-slate-900 px-6 text-xs font-black tracking-widest uppercase"
                    >
                        <Printer className="mr-2 h-4 w-4" /> Print Document
                    </Button>
                </div>

                {/* Report Header */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900">
                        <FileText className="h-6 w-6 text-slate-900" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">
                        Official Class Grading Sheet
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
                        Office of the University Registrar
                    </p>
                </div>

                {/* Section Meta Information */}
                <div className="grid grid-cols-3 gap-8 border-y-2 border-slate-900 py-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            Section & Subject
                        </p>
                        <p className="text-sm font-bold uppercase">
                            {section.section_name} —{' '}
                            {section.subject.subject_code}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            Description
                        </p>
                        <p className="text-sm font-bold uppercase">
                            {section.subject.subject_title}
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            Status
                        </p>
                        <p className="text-sm font-bold text-emerald-600 uppercase">
                            Published
                        </p>
                    </div>
                </div>

                {/* Data Table aligned with your JSON object */}
                <div className="overflow-hidden rounded-sm border border-slate-200">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-b border-slate-900 hover:bg-transparent">
                                <TableHead className="w-[180px] py-4 pl-6 text-[10px] font-black text-slate-900 uppercase">
                                    School ID
                                </TableHead>
                                <TableHead className="text-[10px] font-black text-slate-900 uppercase">
                                    Student Name
                                </TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                    QAS
                                </TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                    Mid-Exam
                                </TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                    Fin-Exam
                                </TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                    Attendance
                                </TableHead>
                                <TableHead className="pr-6 text-right text-[10px] font-black text-slate-900 uppercase">
                                    Final Grade
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {section.enrollments.map((enrollment: any) => (
                                <TableRow
                                    key={enrollment.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                >
                                    <TableCell className="py-4 pl-6 font-mono text-xs font-bold text-slate-600">
                                        {enrollment.student.school_id}
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-slate-900 uppercase">
                                        {enrollment.student.name}
                                    </TableCell>
                                    {/* Displaying 2nd Sem data based on your object, fallback to 1st sem if null */}
                                    <TableCell className="text-center font-mono text-xs">
                                        {enrollment.grade?.qas_2nd_sem ||
                                            enrollment.grade?.qas_1st_sem ||
                                            '0.00'}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs">
                                        {enrollment.grade?.m_exam_2nd_sem ||
                                            enrollment.grade?.m_exam_1st_sem ||
                                            '0.00'}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs">
                                        {enrollment.grade?.f_exam_2nd_sem ||
                                            enrollment.grade?.f_exam_1st_sem ||
                                            '0.00'}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs">
                                        {enrollment.grade?.attendance_2nd_sem ||
                                            '0.00'}
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <span
                                            className={`text-xs font-black ${!enrollment.grade?.letter_grade ? 'text-slate-400' : 'text-slate-900'}`}
                                        >
                                            {enrollment.grade?.letter_grade ||
                                                'INC'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Institutional Footer */}
                <div className="grid grid-cols-3 gap-12 pt-20">
                    <div className="border-t border-slate-900 pt-3 text-center">
                        <p className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                            {auth?.user?.name || 'Professor Name'}
                        </p>
                        <p className="text-[8px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                            Instructor of Record
                        </p>
                    </div>
                    <div className="border-t border-slate-900 pt-3 text-center">
                        <p className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                            Registrar Staff
                        </p>
                        <p className="text-[8px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                            Verification Signature
                        </p>
                    </div>
                    <div className="border-t border-slate-900 pt-3 text-center">
                        <p className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                            {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-[8px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                            Date Documented
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
