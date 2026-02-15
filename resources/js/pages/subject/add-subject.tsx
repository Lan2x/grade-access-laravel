import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import subjects from '@/routes/subjects';
import { Head, router, useForm } from '@inertiajs/react';
import { BookPlus } from 'lucide-react';
import { FormEvent } from 'react';

export default function CreateSubject() {
    const { data, setData, post, processing, errors } = useForm({
        subject_code: '',
        subject_title: '',
        units: 3,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(subjects.store().url);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Registry', href: '/subjects' },
                { title: 'New Subject', href: '#' },
            ]}
        >
            <Head title="Register Subject" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 p-4">
                <form
                    onSubmit={onSubmit}
                    className="mt-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-white p-8 shadow-sm"
                >
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="rounded bg-slate-100 p-2">
                            <BookPlus className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-left text-xl font-bold tracking-tight text-slate-900">
                                Subject Registration
                            </h2>
                            <p className="text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Official Curriculum Entry
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-2 md:col-span-1">
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Subject Code
                            </Label>
                            <Input
                                placeholder="e.g. IT101"
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
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Subject Title
                            </Label>
                            <Input
                                placeholder="Introduction to Programming"
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
                        <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Credits (Units)
                        </Label>
                        <Input
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
                            className="h-9 bg-slate-900 px-6 text-[11px] font-black tracking-widest text-white uppercase hover:bg-slate-800"
                        >
                            {processing ? (
                                <Spinner className="mr-2 h-4 w-4" />
                            ) : (
                                'Register Subject'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 px-6 text-[11px] font-black tracking-widest uppercase"
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
