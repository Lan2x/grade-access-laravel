/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Layers } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Section Registry', href: '/sections' },
    { title: 'Edit Instance', href: '#' },
];

interface Props {
    section: {
        id: number;
        section_name: string;
        subject_id: number;
        academic_period_id: number;
        academic_period: { school_year: string; semester: number };
    };
    subjects: { id: number; subject_code: string; subject_title: string }[];
}

export default function EditSection() {
    const { section, subjects } = usePage().props as unknown as Props;

    const { data, setData, put, processing, errors } = useForm({
        section_name: section.section_name,
        subject_id: section.subject_id.toString(),
        academic_period_id: section.academic_period_id,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/sections/${section.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Section: ${section.section_name}`} />
            <div className="flex h-full flex-1 flex-col items-center p-6">
                <form
                    onSubmit={onSubmit}
                    className="w-full max-w-xl space-y-6 rounded-xl border bg-white p-8 shadow-sm dark:bg-zinc-900"
                >
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="rounded bg-slate-100 p-2">
                            <Layers className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Update Section Instance
                            </h2>
                            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Modifying Linked Course Entry
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Section Name
                            </Label>
                            <Input
                                className="h-10 font-mono font-bold uppercase"
                                value={data.section_name}
                                onChange={(e) =>
                                    setData(
                                        'section_name',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                            />
                            {errors.section_name && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.section_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Change Subject
                            </Label>
                            <Select
                                value={data.subject_id}
                                onValueChange={(value) =>
                                    setData('subject_id', value)
                                }
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="SELECT SUBJECT" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub) => (
                                        <SelectItem
                                            key={sub.id}
                                            value={sub.id.toString()}
                                            className="text-xs font-bold uppercase"
                                        >
                                            {sub.subject_code} -{' '}
                                            {sub.subject_title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subject_id && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.subject_id}
                                </span>
                            )}
                        </div>

                        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                Assigned Academic Term
                            </p>
                            <p className="text-xs font-bold text-slate-700 uppercase">
                                {section.academic_period.school_year} |{' '}
                                {section.academic_period.semester === 1
                                    ? '1st'
                                    : '2nd'}{' '}
                                Semester
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            disabled={processing}
                            type="submit"
                            className="h-10 flex-1 bg-slate-900 text-[11px] font-black tracking-widest text-white uppercase hover:bg-slate-800"
                        >
                            {processing ? (
                                <Spinner className="mr-2 h-4 w-4" />
                            ) : (
                                'Update Instance'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 flex-1 text-[11px] font-black tracking-widest uppercase"
                            onClick={() => router.visit('/sections')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
