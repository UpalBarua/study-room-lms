import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./_components/breadcrumb";
import { DashboardSidebar } from "./_components/sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: Readonly<DashboardLayoutProps>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full bg-secondary p-4">
        <DashboardBreadcrumb />
        {children}
      </main>
    </SidebarProvider>
  );
}
