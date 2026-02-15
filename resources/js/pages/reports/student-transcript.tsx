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
import { Head } from '@inertiajs/react';
import { ArrowLeft, GraduationCap, Printer, ShieldCheck } from 'lucide-react';

interface Props {
    student: any;
    period: any;
    enrollments: any[];
}

export default function StudentTranscript({
    student,
    period,
    enrollments,
}: Props) {
    const handlePrint = () => window.print();

    return (
        <AppLayout breadcrumbs={[{ title: 'Student Transcript', href: '#' }]}>
            <Head title={`Transcript - ${student.name}`} />

            <div className="mx-auto max-w-5xl space-y-8 bg-white p-8 print:p-0 print:shadow-none">
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
                        <Printer className="mr-2 h-4 w-4" /> Print Transcript
                    </Button>
                </div>

                {/* Header Section */}
                <div className="flex items-start justify-between border-b-4 border-slate-900 pb-6">
                    <div className="space-y-1">
                        <div className="mb-2 flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-slate-900" />
                            <h1 className="text-2xl font-black tracking-tighter uppercase">
                                Student Grade Summary
                            </h1>
                        </div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
                            Official Academic Record
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Academic Period
                        </p>
                        <p className="text-sm font-bold uppercase">
                            {period.school_year}
                        </p>
                        <p className="text-[11px] font-black uppercase">
                            {period.semester === '1' ? 'First' : 'Second'}{' '}
                            Semester
                        </p>
                    </div>
                </div>

                {/* Student Personal Info Ledger */}
                <div className="grid grid-cols-2 gap-12 rounded-sm border border-slate-200 bg-slate-50 p-6">
                    <div className="space-y-3">
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Student Name
                            </p>
                            <p className="text-base font-black text-slate-900 uppercase">
                                {student.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                School Identification No.
                            </p>
                            <p className="font-mono text-sm font-bold text-slate-700">
                                {student.school_id}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Email Address
                            </p>
                            <p className="text-sm font-medium text-slate-600">
                                {student.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                                Verified Record
                            </span>
                        </div>
                    </div>
                </div>

                {/* Academic Performance Table */}
                <div className="space-y-4">
                    <h3 className="border-l-4 border-slate-900 pl-3 text-xs font-black tracking-widest uppercase">
                        Enrolled Subjects & Performance
                    </h3>
                    <Table className="border border-slate-200">
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-b border-slate-900 hover:bg-transparent">
                                <TableHead className="py-4 text-[10px] font-black text-slate-900 uppercase">
                                    Subject Code
                                </TableHead>
                                <TableHead className="text-[10px] font-black text-slate-900 uppercase">
                                    Subject Description
                                </TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-900 uppercase">
                                    Units
                                </TableHead>
                                <TableHead className="pr-6 text-right text-[10px] font-black text-slate-900 uppercase">
                                    Final Grade
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.map((item: any) => (
                                <TableRow
                                    key={item.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30"
                                >
                                    <TableCell className="py-4 text-xs font-bold text-slate-900 uppercase">
                                        {item.section.subject.subject_code}
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-slate-600 uppercase">
                                        {item.section.subject.subject_title}
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs font-bold text-slate-900">
                                        {item.section.subject.units}.0
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <span
                                            className={`text-sm font-black ${!item.grade?.letter_grade ? 'text-slate-300' : 'text-slate-900'}`}
                                        >
                                            {item.grade?.letter_grade || 'N/A'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Formal Certification Footer */}
                <div className="border-t border-slate-100 pt-20">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400">
                                Document generated by:
                            </p>
                            <p className="text-xs font-black text-slate-900 uppercase">
                                System Automated Registry
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 italic">
                                Valid only when electronically signed or
                                stamped.
                            </p>
                        </div>
                        <div className="space-y-4 text-right">
                            <div className="inline-block h-px w-48 border-b border-slate-900"></div>
                            <p className="pr-2 text-[10px] font-black tracking-widest uppercase">
                                University Registrar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
