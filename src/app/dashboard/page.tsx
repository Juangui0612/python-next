import DashboardStats from "@/components/dashboard/DashboardStats"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>

      <DashboardStats />
    </div>
  );
}
