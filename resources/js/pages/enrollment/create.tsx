import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Info, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    students: { id: number; name: string; school_id: string }[];
    sections: {
        id: number;
        section_name: string;
        subject: { subject_title: string; subject_code: string };
    }[];
    activePeriod: { id: number; school_year: string; semester: string };
}

export default function StudentEnrollment({
    students,
    sections,
    activePeriod,
}: Props) {
    const { setData, post, processing, errors } = useForm({
        student_id: '',
        section_id: '',
        academic_period_id: activePeriod?.id || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dean/enrollments', {
            onSuccess: () => toast.success('Student enrolled successfully'),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Enrollment', href: '/dean/enrollments' },
                { title: 'New Enrollment', href: '#' },
            ]}
        >
            <Head title="Enroll Student" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Student Enrollment
                        </h1>
                        <p className="text-sm text-slate-500">
                            Assign a student to a specific class section.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Form */}
                    <Card className="border-t-4 border-t-[#26a690] shadow-sm md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Enrollment Details
                            </CardTitle>
                            <CardDescription>
                                Select the student and the corresponding
                                section.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* Student Selection */}
                                <div className="space-y-2">
                                    <Label>Select Student</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            setData('student_id', val)
                                        }
                                    >
                                        <SelectTrigger className="focus:ring-[#26a690]">
                                            <SelectValue placeholder="Choose a student..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={student.id.toString()}
                                                >
                                                    {student.name} (
                                                    {student.school_id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && (
                                        <p className="text-xs text-red-600">
                                            {errors.student_id}
                                        </p>
                                    )}
                                </div>

                                {/* Section Selection */}
                                <div className="space-y-2">
                                    <Label>Select Section</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            setData('section_id', val)
                                        }
                                    >
                                        <SelectTrigger className="focus:ring-[#26a690]">
                                            <SelectValue placeholder="Choose a section..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.map((sec) => (
                                                <SelectItem
                                                    key={sec.id}
                                                    value={sec.id.toString()}
                                                >
                                                    {sec.subject.subject_code} -{' '}
                                                    {sec.section_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.section_id && (
                                        <p className="text-xs text-red-600">
                                            {errors.section_id}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full cursor-pointer bg-[#26a690] font-bold hover:bg-[#1e8573]"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Enrolling...'
                                        : 'Confirm Enrollment'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Summary Info Card */}
                    <div className="space-y-4">
                        <Card className="border-none bg-slate-50 shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-sm font-bold text-slate-700">
                                    <Info className="mr-2 h-4 w-4 text-[#26a690]" />
                                    Active Period
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs font-semibold text-slate-600 uppercase">
                                    School Year
                                </p>
                                <p className="mb-2 text-sm font-bold text-[#26a690]">
                                    {activePeriod?.school_year}
                                </p>

                                <p className="text-xs font-semibold text-slate-600 uppercase">
                                    Semester
                                </p>
                                <p className="text-sm font-bold text-[#26a690]">
                                    {activePeriod?.semester} Semester
                                </p>
                            </CardContent>
                        </Card>

                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
                            <strong>Note:</strong> Enrollment automatically
                            initializes the grade record for this student in the
                            selected section.
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
