import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import professorLoads from '@/routes/professor-loads';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, BookPlus } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    professors: { id: number; name: string; school_id: string }[];
    sections: {
        id: number;
        section_name: string;
        subject: { subject_title: string; subject_code: string };
    }[];
    activePeriod: { id: number; school_year: string; semester: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Professor Loads', href: '/professor-loads' },
    { title: 'Assign Load', href: '/professor-loads/create' },
];

export default function AddLoad({ professors, sections, activePeriod }: Props) {
    const { setData, post, processing, errors } = useForm({
        user_id: '',
        section_id: '',
        academic_period_id: activePeriod?.id || '',
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(professorLoads.store().url, {
            onSuccess: () => console.log('Saved!'),
            onError: (errors) => console.log('Validation Errors:', errors),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Professor Load" />

            <div className="flex h-full flex-1 flex-col items-center p-6">
                <form
                    onSubmit={onSubmit}
                    className="w-full max-w-2xl space-y-6 rounded-xl border bg-white p-8 shadow-sm dark:bg-zinc-900"
                >
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="rounded-lg bg-[#26a690]/10 p-2">
                            <BookPlus className="h-6 w-6 text-[#26a690]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                Assign Subject Load
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Period: {activePeriod?.school_year} |{' '}
                                {activePeriod?.semester} Semester
                            </p>
                        </div>
                    </div>

                    {/* Professor Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="professor">Select Professor</Label>
                        <Select
                            onValueChange={(value) => setData('user_id', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a faculty member" />
                            </SelectTrigger>
                            <SelectContent>
                                {professors.map((prof) => (
                                    <SelectItem
                                        key={prof.id}
                                        value={prof.id.toString()}
                                    >
                                        {prof.name} ({prof.school_id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.user_id && (
                            <p className="text-xs text-red-500">
                                {errors.user_id}
                            </p>
                        )}
                    </div>

                    {/* Section/Subject Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="section">Subject & Section</Label>
                        <Select
                            onValueChange={(value) =>
                                setData('section_id', value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select class to assign" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((sec) => (
                                    <SelectItem
                                        key={sec.id}
                                        value={sec.id.toString()}
                                    >
                                        {sec.subject.subject_code} -{' '}
                                        {sec.subject.subject_title} (
                                        {sec.section_name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.section_id && (
                            <p className="text-xs text-red-500">
                                {errors.section_id}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex-1 cursor-pointer bg-[#26a690] hover:bg-[#26a690]/90"
                        >
                            {processing ? 'Assigning...' : 'Confirm Assignment'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/professor-loads')}
                            className="flex-1 cursor-pointer"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
