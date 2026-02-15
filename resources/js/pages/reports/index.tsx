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
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    GraduationCap,
    Search,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    myClasses: any[];
    activePeriod: any;
}

export default function ReportIndex({ myClasses, activePeriod }: Props) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    console.log(myClasses);

    // Extract a unique list of students from all professor's assigned sections
    const allStudents = useMemo(() => {
        const studentMap = new Map();
        myClasses.forEach((cls) => {
            cls.section.enrollments?.forEach((enrollment: any) => {
                studentMap.set(enrollment.student.id, enrollment.student);
            });
        });
        return Array.from(studentMap.values());
    }, [myClasses]);

    const handleViewTranscript = () => {
        if (selectedStudentId && activePeriod) {
            router.get(
                `/professor-reports/student-transcript/${selectedStudentId}/${activePeriod.id}`,
            );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Academic Reports', href: '/professor-reports' },
            ]}
        >
            <Head title="Academic Reports" />

            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                        <FileText className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                            Reports Registry
                        </h1>
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            {activePeriod?.school_year} |{' '}
                            {activePeriod?.semester === '1' ? '1st' : '2nd'}{' '}
                            Semester
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Class List Report Card */}
                    <Card className="group border-slate-200 shadow-sm transition-colors hover:border-slate-900">
                        <CardHeader>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                                <Users className="h-5 w-5 text-slate-600" />
                            </div>
                            <CardTitle className="text-sm font-black tracking-tight uppercase">
                                Class List & Grading Sheets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs leading-relaxed font-medium text-slate-500">
                                Generate a comprehensive list of students
                                enrolled in your sections, including their
                                current calculated grades.
                            </p>
                            <div className="space-y-2 pt-2">
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Select a Section:
                                </p>
                                {myClasses.map((item: any) => (
                                    <Button
                                        key={item.id}
                                        variant="outline"
                                        className="h-10 w-full justify-between border-slate-200 text-xs font-bold uppercase group-hover:border-slate-300"
                                        onClick={() =>
                                            router.get(
                                                `/professor-reports/class-list/${item.section_id}`,
                                            )
                                        }
                                    >
                                        {item.section.section_name} -{' '}
                                        {item.section.subject.subject_code}
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Grade Report Card */}
                    <Card className="border-slate-200 shadow-sm transition-colors hover:border-slate-900">
                        <CardHeader>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                                <GraduationCap className="h-5 w-5 text-slate-600" />
                            </div>
                            <CardTitle className="text-sm font-black tracking-tight uppercase">
                                Individual Grade Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs leading-relaxed font-medium text-slate-500">
                                Select a specific student to generate a formal
                                summary of all their grades for the current
                                term.
                            </p>

                            <div className="space-y-3 pt-2">
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Search Student:
                                </p>
                                <Select
                                    onValueChange={setSelectedStudentId}
                                    value={selectedStudentId}
                                >
                                    <SelectTrigger className="w-full border-slate-200 text-xs font-bold uppercase">
                                        <SelectValue placeholder="CHOOSE STUDENT" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allStudents.length > 0 ? (
                                            allStudents.map((student: any) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={student.id.toString()}
                                                    className="text-xs font-bold uppercase"
                                                >
                                                    {student.name} (
                                                    {student.school_id})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <p className="p-2 text-center text-[10px] font-bold text-slate-400 uppercase">
                                                No students found
                                            </p>
                                        )}
                                    </SelectContent>
                                </Select>

                                <Button
                                    disabled={!selectedStudentId}
                                    onClick={handleViewTranscript}
                                    className="h-10 w-full bg-slate-900 text-[10px] font-black tracking-widest text-white uppercase hover:bg-slate-800 disabled:opacity-30"
                                >
                                    <Search className="mr-2 h-3 w-3" /> Generate
                                    Summary
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
