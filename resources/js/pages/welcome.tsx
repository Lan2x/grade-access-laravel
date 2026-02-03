import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="University Grading System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Enter System
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Request Access
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-xl font-medium text-[#0f172a] dark:text-white">
                                Academic Management Portal
                            </h1>
                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                A centralized platform for instructors to manage
                                student grades, attendance, and academic
                                performance across semesters.
                            </p>

                            <ul className="mb-6 flex flex-col lg:mb-8">
                                <li className="relative flex items-center gap-4 py-2">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#26a690] bg-[#26a690]/10 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#26a690]" />
                                    </span>
                                    <span>
                                        <strong>Instructor Dashboard:</strong>{' '}
                                        Input Midterm and Final grades with
                                        automated equivalence calculation.
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#26a690] bg-[#26a690]/10 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#26a690]" />
                                    </span>
                                    <span>
                                        <strong>Academic Periods:</strong>{' '}
                                        Seamlessly switch between first and
                                        second semester records.
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#26a690] bg-[#26a690]/10 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#26a690]" />
                                    </span>
                                    <span>
                                        <strong>Dean Review:</strong>{' '}
                                        Administrative oversight for grade
                                        verification and submission locking.
                                    </span>
                                </li>
                            </ul>

                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-8 py-2 text-sm leading-normal font-semibold text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Sign In to Portal
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#f8fafc] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#0f172a]">
                            {/* Grading System Branding Placeholder */}
                            <div className="flex h-full w-full flex-col items-center justify-center p-12 text-center">
                                <div className="mb-4 rounded-full bg-[#26a690]/20 p-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#26a690"
                                        className="h-24 w-24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.26 10.147L12 14.654l7.74-4.507m-15.48 0L12 5.64l7.74 4.507m-15.48 0v4.707c0 .484.312.906.761 1.088l6.502 2.636a1.14 1.14 0 00.834 0l6.502-2.636a1.14 1.14 0 00.761-1.088v-4.707"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#1e293b] dark:text-white">
                                    University Grading
                                </h2>
                                <p className="mt-2 text-[#64748b]">
                                    Efficiency in Academic Reporting
                                </p>
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <footer className="mt-auto py-6 text-center text-xs text-[#706f6c] dark:text-[#A1A09A]">
                    © {new Date().getFullYear()} University Academic Management
                    System
                </footer>
            </div>
        </>
    );
}
