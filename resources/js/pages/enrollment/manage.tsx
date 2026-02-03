/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Info,
    UserMinus,
    UserPlus,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    section: any;
    enrolledStudents: any[];
    availableStudents: { id: number; name: string; school_id: string }[];
}

export default function ManageSectionEnrollment({
    section,
    enrolledStudents,
    availableStudents,
}: Props) {
    const { data, setData, post, processing } = useForm({
        student_id: '',
        section_id: section.id,
    });

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/enrollments/section/${section.id}`, {
            onSuccess: () => {
                toast.success('Student enrolled successfully');
                // Using functional update to avoid TS deep instantiation error
                setData((prev: any) => ({ ...prev, student_id: '' }));
            },
        });
    };

    const handleRemoveStudent = (enrollmentId: number) => {
        if (
            confirm(
                'Are you sure you want to remove this student from the section?',
            )
        ) {
            router.delete(`/enrollments/${enrollmentId}`, {
                onSuccess: () => toast.error('Student removed from section'),
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Enrollment', href: '/enrollments' },
                { title: 'Manage Section', href: '#' },
            ]}
        >
            <Head title={`Manage ${section.section_name}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Section Context Header */}
                <Card className="border-t-2 border-t-slate-900 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                                <BookOpen className="h-6 w-6 text-slate-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                                    {section.subject.subject_title}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                    <span className="font-mono font-bold text-slate-900">
                                        {section.subject.subject_code}
                                    </span>
                                    <span>•</span>
                                    <span>Section {section.section_name}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/enrollments')}
                            className="cursor-pointer border-slate-200 hover:bg-slate-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Sections
                        </Button>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Side: Actions and Stats */}
                    <div className="flex flex-col gap-6">
                        {/* Enrollment Form */}
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="border-b bg-slate-50/30 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
                                    <UserPlus className="h-4 w-4" /> Enroll New
                                    Student
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form
                                    onSubmit={handleAddStudent}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Select
                                            value={data.student_id}
                                            onValueChange={(val) =>
                                                setData((prev: any) => ({
                                                    ...prev,
                                                    student_id: val,
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="w-full border-slate-200 focus:ring-slate-400">
                                                <SelectValue placeholder="Search student name..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableStudents.map((s) => (
                                                    <SelectItem
                                                        key={s.id}
                                                        value={s.id.toString()}
                                                    >
                                                        {s.name} ({s.school_id})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        disabled={
                                            processing || !data.student_id
                                        }
                                        className="w-full cursor-pointer bg-slate-900 font-bold text-white hover:bg-slate-800"
                                    >
                                        CONFIRM ENROLLMENT
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Section Information */}
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <Info className="mt-0.5 h-4 w-4 text-slate-400" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold tracking-tighter text-slate-500 uppercase">
                                            Current Occupancy
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">
                                            {enrolledStudents.length} Students
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-slate-400">
                                            Enrolling a student automatically
                                            prepares their grading record for
                                            the instructor's portal.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Enrolled Students List */}
                    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm lg:col-span-2">
                        <CardHeader className="border-b bg-slate-50/50 py-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                                    Currently Enrolled
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/30">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-4 pl-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            Student Name
                                        </TableHead>
                                        <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            School ID
                                        </TableHead>
                                        <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            Withdrawal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrolledStudents.length > 0 ? (
                                        enrolledStudents.map((entry) => (
                                            <TableRow
                                                key={entry.id}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30"
                                            >
                                                <TableCell className="py-4 pl-6">
                                                    <span className="text-xs font-bold text-slate-900 uppercase">
                                                        {entry.student.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="font-mono text-[11px] font-medium text-slate-500">
                                                        {
                                                            entry.student
                                                                .school_id
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveStudent(
                                                                entry.id,
                                                            )
                                                        }
                                                        className="h-8 cursor-pointer text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <UserMinus className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="h-40 text-center text-sm text-slate-400 italic"
                                            >
                                                No students are currently
                                                enrolled in this section.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
