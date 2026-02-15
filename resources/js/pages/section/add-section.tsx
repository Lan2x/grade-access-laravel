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
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, LayersIcon } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    subjects: { id: number; subject_code: string; subject_title: string }[];
    activePeriod: { id: number; school_year: string; semester: number };
}

export default function CreateSection({ subjects, activePeriod }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        section_name: '',
        subject_id: '',
        academic_period_id: activePeriod?.id || '',
    });

    console.log(activePeriod);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/sections');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Sections', href: '/sections' },
                { title: 'New Instance', href: '#' },
            ]}
        >
            <Head title="Create Section" />
            <div className="flex h-full flex-1 flex-col items-center p-6">
                <form
                    onSubmit={onSubmit}
                    className="w-full max-w-xl space-y-6 rounded-xl border bg-white p-8 shadow-sm"
                >
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="rounded bg-slate-100 p-2">
                            <LayersIcon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Section Instance Creation
                            </h2>
                            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Linking Course to Group
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Section Name
                            </Label>
                            <Input
                                placeholder="e.g. BSIT-1A"
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
                                Assign Subject
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('subject_id', value)
                                }
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="SELECT SUBJECT FROM CATALOG" />
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
                                Target Academic Term
                            </p>
                            <p className="text-xs font-bold text-slate-700 uppercase">
                                {activePeriod?.school_year} |{' '}
                                {activePeriod?.semester === 1 ? '1st' : '2nd'}{' '}
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
                                'Confirm Section Instance'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 flex-1 text-[11px] font-black tracking-widest uppercase"
                            onClick={() => router.visit('/sections')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
