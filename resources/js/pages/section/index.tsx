import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Layers, PlusSquareIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { columns } from './column';
import { DataTable } from './data-table';

export default function SectionIndex() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { sections } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Section Management', href: '/sections' }]}
        >
            <Head title="Section Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex flex-col gap-2">
                        <Label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Registry Search:
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search Section or Subject..."
                                className="h-9 w-64 text-xs font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="h-9 cursor-pointer bg-slate-900 px-6"
                            >
                                <SearchIcon className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </div>

                    <Button
                        className="h-9 w-fit cursor-pointer bg-slate-900 text-[10px] font-black tracking-widest uppercase hover:bg-slate-800"
                        onClick={() => router.visit('/sections/create')}
                    >
                        <PlusSquareIcon className="mr-2 h-4 w-4" />
                        Create New Section
                    </Button>
                </div>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b bg-slate-50/50 p-4">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            Active Section Registry
                        </span>
                    </div>
                    <DataTable columns={columns} data={sections} />
                </div>
            </div>
        </AppLayout>
    );
}
