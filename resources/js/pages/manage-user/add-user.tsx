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
import manageUsers from '@/routes/manage-users';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const ROLES = ['dean', 'professor', 'student'];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: manageUsers.index().url,
    },
    {
        title: 'Create User',
        href: manageUsers.create().url,
    },
];

export default function CreateUser() {
    // 1. Updated useForm to include password fields
    const { data, setData, post, processing, errors } = useForm({
        school_id: '',
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(manageUsers.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New User" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 p-4">
                <form
                    onSubmit={onSubmit}
                    className="mt-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="space-y-1 text-center md:text-left">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            System User Registration
                        </h2>
                        <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
                            Official University Personnel & Student Entry
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* School ID */}
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="school_id"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                School ID / ID No.
                            </Label>
                            <Input
                                id="school_id"
                                placeholder="e.g. 2026-0001"
                                className="h-9"
                                value={data.school_id}
                                onChange={(e) =>
                                    setData('school_id', e.target.value)
                                }
                            />
                            {errors.school_id && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.school_id}
                                </span>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="role"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                System Role
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData('role', value)
                                }
                            >
                                <SelectTrigger id="role" className="h-9 w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.filter((r) => r !== 'dean').map(
                                        (role) => (
                                            <SelectItem
                                                key={role}
                                                value={role}
                                                className="text-xs font-bold uppercase"
                                            >
                                                {role.toUpperCase()}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.role}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="name"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Jeffrey D. Dianito"
                            className="h-9"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@university.edu"
                            className="h-9"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="password"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                className="h-9"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            {errors.password && (
                                <span className="text-[10px] font-bold text-red-500 uppercase">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                className="h-9"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <Button
                            disabled={processing}
                            type="submit"
                            className="h-9 bg-slate-900 px-6 text-[11px] font-black tracking-widest text-white uppercase hover:bg-slate-800"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />{' '}
                                    Saving...
                                </>
                            ) : (
                                'Register User'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 px-6 text-[11px] font-black tracking-widest uppercase"
                            disabled={processing}
                            onClick={() =>
                                router.visit(manageUsers.index().url)
                            }
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
