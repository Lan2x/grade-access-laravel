/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import manageGrades from '@/routes/manage-grades';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Calculator, GraduationCap, Save } from 'lucide-react';
import { toast } from 'sonner';

interface GradeRecord {
    qas_1st_sem: any;
    qas_2nd_sem: any;
    gaca_1st_sem: any;
    gaca_2nd_sem: any;
    m_exam_1st_sem: any;
    m_exam_2nd_sem: any;
    f_exam_1st_sem: any;
    f_exam_2nd_sem: any;
    output_1st_sem: any;
    output_2nd_sem: any;
    attendance_1st_sem: any;
    attendance_2nd_sem: any;
    total_grade_1st_sem: any;
    total_grade_2nd_sem: any;
    remarks: string;
    letter_grade: string;
}

interface StudentEntry {
    enrollment_id: number;
    student_name: string;
    school_id: string;
    grade: GradeRecord;
}

export default function GradeEntry({ section, students, activeSemester }: any) {
    const semSuffix = activeSemester === '1st' ? '1st_sem' : '2nd_sem';

    const { data, setData, post, processing } = useForm({
        students: students,
    });

    const handleInput = (index: number, field: string, value: string) => {
        const updated = [...data.students];
        updated[index].grade[field] = value;
        setData((prev: any) => {
            const updatedStudents = [...prev.students];

            // Ensure the path to the field exists
            updatedStudents[index] = {
                ...updatedStudents[index],
                grade: {
                    ...updatedStudents[index].grade,
                    [field]: value,
                },
            };

            return {
                ...prev,
                students: updatedStudents,
            };
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(manageGrades.updateBatch({ id: section.id }).url, {
            onSuccess: () => toast.success('Grades synchronized successfully'),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'My Grades', href: '/professor/grades' },
                { title: 'Entry', href: '#' },
            ]}
        >
            <Head title={`Grades: ${section.section_name}`} />

            <div className="flex flex-col gap-6 p-6">
                <Card className="border-t-2 border-slate-900 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                                <GraduationCap className="h-6 w-6 text-slate-700" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                                    {section.subject.subject_title}
                                </CardTitle>
                                <p className="font-mono text-sm text-slate-500">
                                    {section.subject.subject_code} —{' '}
                                    {activeSemester} Semester
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="cursor-pointer border-slate-200"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </CardHeader>
                </Card>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50 py-3">
                            <div className="flex items-center gap-2">
                                <Calculator className="h-4 w-4 text-slate-400" />
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Input Ledger
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table className="border-collapse">
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-4 pl-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                            Student
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            QAS
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            GACA
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            Attend
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            Midterm
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            Final Ex
                                        </TableHead>
                                        <TableHead className="w-20 text-center text-[10px] font-bold text-slate-500 uppercase">
                                            Output
                                        </TableHead>
                                        <TableHead className="w-24 bg-slate-100/50 text-center text-[10px] font-black text-slate-900 uppercase">
                                            Total
                                        </TableHead>
                                        <TableHead className="w-24 text-center text-[10px] font-black text-slate-900 uppercase">
                                            Rating
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.students.map(
                                        (row: StudentEntry, index: number) => (
                                            <TableRow
                                                key={row.enrollment_id}
                                                className="border-b border-slate-100 hover:bg-slate-50/30"
                                            >
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-900 uppercase">
                                                            {row.student_name}
                                                        </span>
                                                        <span className="font-mono text-[10px] text-slate-400">
                                                            {row.school_id}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `qas_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `qas_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `gaca_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `gaca_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `attendance_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `attendance_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `m_exam_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `m_exam_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `f_exam_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `f_exam_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-center text-xs"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `output_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `output_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="bg-slate-50/50">
                                                    <Input
                                                        className="h-8 border-slate-300 text-center text-xs font-black"
                                                        type="number"
                                                        value={
                                                            row.grade[
                                                                `total_grade_${semSuffix}` as keyof GradeRecord
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleInput(
                                                                index,
                                                                `total_grade_${semSuffix}`,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="w-full justify-center border-slate-900 bg-slate-900 text-[10px] font-black text-white"
                                                    >
                                                        {row.grade
                                                            .letter_grade ||
                                                            '0.00'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="sticky bottom-6 flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer bg-slate-900 px-12 py-6 text-xs font-black text-white shadow-2xl transition-all hover:bg-slate-800 active:scale-95"
                        >
                            <Save className="mr-2 h-4 w-4" />{' '}
                            {processing ? 'SYNCHRONIZING...' : 'COMMIT CHANGES'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
