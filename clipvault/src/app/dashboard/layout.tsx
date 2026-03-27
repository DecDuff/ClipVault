import Sidebar from '@/components/clips/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar />
      <div className="flex-1 transition-all duration-500">
        {children}
      </div>
    </div>
  );
}