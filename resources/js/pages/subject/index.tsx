import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { BookCopy, PlusSquareIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { columns } from './column';
import { DataTable } from './data-table';

export default function SubjectIndex() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { subjects } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Subject Registry', href: '/subjects' }]}
        >
            <Head title="Subject Registry" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex flex-col gap-2">
                        <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Registry Search:
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search Code or Title..."
                                className="h-9 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="h-9 cursor-pointer bg-slate-900"
                            >
                                <SearchIcon className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </div>

                    <Button
                        className="h-9 w-fit cursor-pointer bg-slate-900 hover:bg-slate-800"
                        onClick={() => router.visit('/subjects/create')}
                    >
                        <PlusSquareIcon className="mr-2 h-4 w-4" />
                        Add New Subject
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b bg-slate-50/50 p-4">
                        <BookCopy className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            Official Course Catalog
                        </span>
                    </div>
                    <DataTable columns={columns} data={subjects} />
                </div>
            </div>
        </AppLayout>
    );
}
