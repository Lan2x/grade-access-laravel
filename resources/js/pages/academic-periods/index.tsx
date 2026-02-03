/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Calendar, Edit2, Lock, Plus, Unlock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AcademicPeriodsIndex({ periods }: any) {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        school_year: '',
        semester: '1',
    });

    const openCreateModal = () => {
        setEditMode(false);
        setSelectedId(null);
        reset();
        setOpen(true);
    };

    const openEditModal = (period: any) => {
        setEditMode(true);
        setSelectedId(period.id);
        setData({
            school_year: period.school_year,
            semester: period.semester.toString(),
        });
        setOpen(true);
    };

    const activate = (id: number) => {
        router.patch(
            `/academic-periods/${id}/activate`,
            {},
            {
                onSuccess: () => toast.success('Academic period activated'),
            },
        );
    };

    const toggleSubmissions = (id: number) => {
        router.patch(`/academic-periods/${id}/toggle-submissions`);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editMode && selectedId) {
            patch(`/academic-periods/${selectedId}`, {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('Term updated successfully');
                },
            });
        } else {
            post('/academic-periods', {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast.success('Term created successfully');
                },
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Academic Terms', href: '/academic-periods' },
            ]}
        >
            <Head title="Manage Semesters" />

            <div className="flex flex-col gap-6 p-6">
                <Card className="border-t-2 border-slate-900 bg-white shadow-sm">
                    <CardHeader className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                        <div className="flex items-center gap-4">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                                <Calendar className="h-6 w-6 text-slate-700" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight uppercase">
                                    Academic Terms
                                </CardTitle>
                                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Configuration & Controls
                                </p>
                            </div>
                        </div>

                        <Dialog
                            open={open}
                            onOpenChange={(val) => {
                                setOpen(val);
                                if (!val) reset();
                            }}
                        >
                            <Button
                                onClick={openCreateModal}
                                className="h-9 bg-slate-900 font-bold text-white hover:bg-slate-800"
                            >
                                <Plus className="mr-2 h-4 w-4" /> NEW TERM
                            </Button>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={submit}>
                                    <DialogHeader>
                                        <DialogTitle className="font-black tracking-tight uppercase">
                                            {editMode
                                                ? 'Edit Academic Term'
                                                : 'Create Academic Term'}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs">
                                            {editMode
                                                ? 'Update the details for this academic period.'
                                                : 'Add a new semester to the system. Newly created terms are inactive by default.'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-6">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="sy"
                                                className="text-[10px] font-bold text-slate-500 uppercase"
                                            >
                                                School Year
                                            </Label>
                                            <Input
                                                id="sy"
                                                placeholder="e.g. 2025-2026"
                                                value={data.school_year}
                                                onChange={(e) =>
                                                    setData(
                                                        'school_year',
                                                        e.target.value,
                                                    )
                                                }
                                                className="focus:ring-slate-900"
                                            />
                                            {errors.school_year && (
                                                <span className="text-[10px] font-bold text-red-600 uppercase">
                                                    {errors.school_year}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="sem"
                                                className="text-[10px] font-bold text-slate-500 uppercase"
                                            >
                                                Semester
                                            </Label>
                                            <Select
                                                value={data.semester}
                                                onValueChange={(val) =>
                                                    setData('semester', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="sem"
                                                    className="focus:ring-slate-900"
                                                >
                                                    <SelectValue placeholder="Select Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        1st Semester
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        2nd Semester
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 w-full bg-slate-900 text-xs font-black text-white uppercase hover:bg-slate-800"
                                        >
                                            {processing
                                                ? editMode
                                                    ? 'UPDATING...'
                                                    : 'CREATING...'
                                                : 'CONFIRM AND SAVE'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                </Card>

                <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="py-4 pl-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        School Year
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Semester
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Submissions
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {periods.map((period: any) => (
                                    <TableRow
                                        key={period.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <TableCell className="py-5 pl-6 font-bold text-slate-900">
                                            {period.school_year}
                                        </TableCell>
                                        <TableCell className="text-center font-mono text-xs">
                                            {period.semester === 1
                                                ? '1ST'
                                                : '2ND'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {period.is_active ? (
                                                <Badge className="border-0 bg-slate-900 px-2 py-0 text-[9px] font-black text-white">
                                                    ACTIVE
                                                </Badge>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    toggleSubmissions(period.id)
                                                }
                                                className={`h-7 gap-1 text-[10px] font-bold ${period.allow_submissions ? 'text-slate-900' : 'text-slate-300'}`}
                                            >
                                                {period.allow_submissions ? (
                                                    <Unlock className="h-3 w-3" />
                                                ) : (
                                                    <Lock className="h-3 w-3" />
                                                )}
                                                {period.allow_submissions
                                                    ? 'OPEN'
                                                    : 'LOCKED'}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="space-x-2 pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    openEditModal(period)
                                                }
                                                className="h-7 px-2 text-slate-400 hover:text-slate-900"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            {!period.is_active && (
                                                <Button
                                                    onClick={() =>
                                                        activate(period.id)
                                                    }
                                                    className="h-7 border-slate-900 px-3 text-[9px] font-bold text-slate-900 uppercase hover:bg-slate-900 hover:text-white"
                                                    variant="outline"
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
