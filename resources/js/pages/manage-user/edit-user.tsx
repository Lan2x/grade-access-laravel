import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import products from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Product',
        href: products.index().url,
    },
];

interface Product {
    product: { id: number; product_name: string };
}

export default function EditProduct() {
    const { product: data } = usePage().props as unknown as Product;

    const {
        data: formData,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        product_name: data.product_name,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/product/${data.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="flex h-full flex-1 flex-col items-center gap-4 p-4">
                <form
                    onSubmit={onSubmit}
                    className="mt-10 flex w-1/2 flex-col gap-3"
                >
                    <div className="flex flex-col gap-3">
                        <Label>Product Name:</Label>
                        <Input
                            defaultValue={formData.product_name}
                            onChange={(e) =>
                                setData('product_name', e.target.value)
                            }
                        />
                        {errors.product_name && (
                            <div className="text-red-500">
                                {errors.product_name}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            disabled={processing}
                            type="submit"
                            className="w-full cursor-pointer"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="h-3 w-3" /> Loading{' '}
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={() => router.visit(products.index().url)}
                            className="w-full cursor-pointer bg-red-600 hover:bg-red-500"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
