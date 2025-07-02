"use client";
import {
  Package,
  Ship,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardKeyMetrics from "./DashboardKeyMetrics";
import DashboardActivitiesPerformance from "./DashboardActivitiesPerformance";
import { mockActivities, mockPerformance, mockStats } from "./constants";

export default function Dashboard() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "box_request":
        return <Package className="h-4 w-4" />;
      case "box_handover":
        return <ArrowRight className="h-4 w-4" />;
      case "boat_added":
        return <Ship className="h-4 w-4" />;
      case "payment_received":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "box_request":
        return "bg-blue-100 text-blue-600";
      case "box_handover":
        return "bg-green-100 text-green-600";
      case "boat_added":
        return "bg-purple-100 text-purple-600";
      case "payment_received":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
  };

  return (
    <div className=" p-6 space-y-8 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-normal">Dashboard</h2>
        <p className=" text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your boat management system.
        </p>
      </div>

      {/* First Section: Quick Actions */}
      <DashboardQuickActions />

      {/* second Section: Key Metrics */}
      <DashboardKeyMetrics mockStats={mockStats} />

      {/* Third Section: Recent Activities & Performance */}
      <DashboardActivitiesPerformance
        mockActivities={mockActivities}
        mockPerformance={mockPerformance}
        getActivityIcon={getActivityIcon}
        getActivityColor={getActivityColor}
        getStatusColor={getStatusColor}
        getTrendIcon={getTrendIcon}
      />
    </div>
  );
}
