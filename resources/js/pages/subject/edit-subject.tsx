/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BookMarked } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subject Registry',
        href: '/subjects',
    },
    {
        title: 'Edit Subject',
        href: '#',
    },
];

interface SubjectProps {
    subject: {
        id: number;
        subject_code: string;
        subject_title: string;
        units: number;
    };
}

export default function EditSubject() {
    // Retrieve the subject data passed from the controller
    const { subject } = usePage().props as unknown as SubjectProps;

    const { data, setData, put, processing, errors } = useForm({
        subject_code: subject.subject_code,
        subject_title: subject.subject_title,
        units: subject.units,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Uses the put method to match standard Laravel update routes
        put(`/subjects/${subject.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Subject: ${subject.subject_code}`} />
            <div className="flex h-full flex-1 flex-col items-center gap-4 p-4">
                <form
                    onSubmit={onSubmit}
                    className="mt-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="rounded bg-slate-100 p-2">
                            <BookMarked className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Update Subject Record
                            </h2>
                            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Modifying Curriculum Entry
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <Label
                                htmlFor="subject_code"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Subject Code
                            </Label>
                            <Input
                                id="subject_code"
                                className="h-9 font-mono font-bold"
                                value={data.subject_code}
                                onChange={(e) =>
                                    setData('subject_code', e.target.value)
                                }
                            />
                            {errors.subject_code && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.subject_code}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label
                                htmlFor="subject_title"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Subject Title
                            </Label>
                            <Input
                                id="subject_title"
                                className="h-9"
                                value={data.subject_title}
                                onChange={(e) =>
                                    setData('subject_title', e.target.value)
                                }
                            />
                            {errors.subject_title && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.subject_title}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="units"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            Credits (Units)
                        </Label>
                        <Input
                            id="units"
                            type="number"
                            min="1"
                            max="6"
                            className="h-9 w-24"
                            value={data.units}
                            onChange={(e) =>
                                setData('units', parseInt(e.target.value))
                            }
                        />
                        {errors.units && (
                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                {errors.units}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <Button
                            disabled={processing}
                            type="submit"
                            className="h-9 w-full bg-slate-900 text-[11px] font-black tracking-widest text-white uppercase hover:bg-slate-800"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />{' '}
                                    Updating...
                                </>
                            ) : (
                                'Update Record'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 w-full text-[11px] font-black tracking-widest uppercase"
                            disabled={processing}
                            onClick={() => router.visit('/subjects')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
