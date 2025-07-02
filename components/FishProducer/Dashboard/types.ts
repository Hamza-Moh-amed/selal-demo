export interface DashboardStats {
  activeBoxes: number;
  pendingBoxes: number;
  totalRevenue: number;
  totalBoats: number;
  activeBoats: number;
  completedRequests: number;
  pendingRequests: number;
}

export interface RecentActivity {
  id: string;
  type: "box_request" | "box_handover" | "boat_added" | "payment_received";
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "in_progress";
}

export interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

export interface DashboardActivitiesPerformanceProps {
  mockActivities: RecentActivity[];
  mockPerformance: PerformanceMetric[];
  getActivityIcon: (type: string) => React.ReactNode;
  getActivityColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  getTrendIcon: (trend: string) => React.ReactNode;
}
