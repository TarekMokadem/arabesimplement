import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen [&_[data-slot=input]]:bg-white [&_[data-slot=textarea]]:bg-white [&_[data-slot=select-trigger]]:bg-white [&_select:not([data-slot])]:bg-white">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
