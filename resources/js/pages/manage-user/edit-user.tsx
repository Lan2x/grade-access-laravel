/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import manageUsers from '@/routes/manage-users';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

// Breadcrumbs updated to point to User Management
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: manageUsers.index().url,
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

interface UserProps {
    user: {
        id: number;
        school_id: string;
        name: string;
        email: string;
    };
}

export default function EditUser() {
    // Retrieve the user data passed from the Edit controller
    const { user } = usePage().props as unknown as UserProps;

    const {
        data: formData,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        school_id: user.school_id,
        name: user.name,
        email: user.email,
        password: '', // Optional: Leave empty if not changing password
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Uses the put method for the update route
        put(manageUsers.update({ user: user.id }).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col items-center gap-4 p-4">
                <form
                    onSubmit={onSubmit}
                    className="mt-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            Update Account Details
                        </h2>
                        <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
                            Modifying record for ID: {user.school_id}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="school_id"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            School ID / Employee ID
                        </Label>
                        <Input
                            id="school_id"
                            value={formData.school_id}
                            className="h-9"
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

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="name"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            className="h-9"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                {errors.name}
                            </span>
                        )}
                    </div>

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
                            value={formData.email}
                            className="h-9"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 border-t pt-4">
                        <Label
                            htmlFor="password"
                            className="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                            New Password (Leave blank to keep current)
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            className="h-9"
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
                            disabled={processing}
                            onClick={() =>
                                router.visit(manageUsers.index().url)
                            }
                            className="h-9 w-full text-[11px] font-black tracking-widest uppercase"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
