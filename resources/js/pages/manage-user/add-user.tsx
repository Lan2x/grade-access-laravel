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

// For the role selection
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
    const { data, setData, post, processing, errors } = useForm({
        school_id: '',
        name: '',
        email: '',
        role: 'student', // Default role
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // This matches the Route::post('/manage-users') in your web.php
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
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold">
                            User Information
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Register a new student, professor, or administrator.
                        </p>
                    </div>

                    {/* School ID / Username */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="school_id">
                            School ID / Employee ID
                        </Label>
                        <Input
                            id="school_id"
                            placeholder="e.g. 2026-0001"
                            value={data.school_id}
                            onChange={(e) =>
                                setData('school_id', e.target.value)
                            }
                        />
                        {errors.school_id && (
                            <span className="text-xs text-red-500">
                                {errors.school_id}
                            </span>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Jeffrey D. Dianito"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-xs text-red-500">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@university.edu"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role">System Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.filter((r) => r !== 'dean').map(
                                    (role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.toUpperCase()}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <span className="text-xs text-red-500">
                                {errors.role}
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <Button disabled={processing} type="submit">
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
