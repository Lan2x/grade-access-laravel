import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import enrollments from '@/routes/enrollments';
import manageGrades from '@/routes/manage-grades';
import manageUsers from '@/routes/manage-users';
import myGrades from '@/routes/my-grades';
import professorLoads from '@/routes/professor-loads';
import professorReports from '@/routes/professor-reports';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    BookOpen,
    Calendar,
    FileTextIcon,
    GraduationCapIcon,
    Layers,
    LayoutGrid,
    UsersIcon,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // Access the shared data we set up in HandleInertiaRequests
    const { auth } = usePage<SharedData>().props;
    const userPermissions = auth.user?.permissions ?? [];

    // Helper function to check permissions
    const can = (permission: string) => userPermissions.includes(permission);

    const mainNavItems: NavItem[] = [
        // Shared Item: Everyone sees the Dashboard
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },

        // --- DEAN FEATURES ---
        ...(can('manage_users')
            ? [
                  {
                      title: 'Academic Terms',
                      href: '/academic-periods',
                      icon: Calendar,
                  },
                  {
                      title: 'Manage Users',
                      href: manageUsers.index().url,
                      icon: UsersIcon,
                  },
                  {
                      title: 'Subject Registry',
                      href: '/subjects',
                      icon: BookMarked,
                  },
                  {
                      title: 'Section Management',
                      href: '/sections',
                      icon: Layers,
                  },
                  {
                      title: 'Professor Loads',
                      href: professorLoads.index().url,
                      icon: BookOpen,
                  },
                  {
                      title: 'Student Enrollments',
                      href: enrollments.index().url,
                      icon: GraduationCapIcon,
                  },
              ]
            : []),

        // --- PROFESSOR FEATURES ---
        ...(can('manage_grades')
            ? [
                  {
                      title: 'My Classes',
                      href: manageGrades.index().url,
                      icon: BookOpen,
                  },
                  {
                      title: 'Academic Reports',
                      href: professorReports.index().url,
                      icon: FileTextIcon,
                  },
                  // The actual grading sheet is usually reached by clicking a specific class
              ]
            : []),

        // --- STUDENT FEATURES ---
        ...(can('view_my_grades')
            ? [
                  {
                      title: 'My Grades',
                      href: myGrades.index().url,
                      icon: BookOpen,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
