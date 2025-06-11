// src/components/admin/DashboardOverview.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Users, Package, ShoppingBag, PawPrint, Image as ImageIcon, Briefcase } from "lucide-react"; // Import relevant icons

interface DashboardOverviewProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalPets: number;
  totalTeamMembers: number;
  totalGalleryImages: number;
  // Add other stats here as your API expands
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ showMessage }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/stats"); // Fetch from your new stats endpoint
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || "Failed to fetch dashboard statistics.");
        showMessage("error", data.message || "Failed to fetch dashboard statistics.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching dashboard statistics.");
      showMessage("error", err.message || "Network error fetching dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({ icon, title, value }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-3 bg-secondary/10 text-secondary rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Dashboard Overview</h2>

      {loading && (
        <p className="text-gray-600 py-8 text-center">Loading dashboard statistics...</p>
      )}
      {error && (
        <p className="text-red-600 py-8 text-center">Error: {error}</p>
      )}

      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<Users size={24} />} title="Total Users" value={stats.totalUsers} />
          <StatCard icon={<Package size={24} />} title="Total Products" value={stats.totalProducts} />
          <StatCard icon={<ShoppingBag size={24} />} title="Total Orders" value={stats.totalOrders} />
          <StatCard icon={<PawPrint size={24} />} title="Total Pets" value={stats.totalPets} />
          <StatCard icon={<Briefcase size={24} />} title="Team Members" value={stats.totalTeamMembers} />
          <StatCard icon={<ImageIcon size={24} />} title="Gallery Images" value={stats.totalGalleryImages} />
          {/* Add more StatCards here for other metrics */}
        </div>
      )}
      {!loading && !error && !stats && (
        <p className="text-gray-600 py-8 text-center">No statistics available.</p>
      )}
    </div>
  );
};

export default DashboardOverview;
