import { DashboardStats, PerformanceMetric, RecentActivity } from "./types";

export const mockStats: DashboardStats = {
  activeBoxes: 245,
  pendingBoxes: 32,
  totalRevenue: 45750,
  totalBoats: 8,
  activeBoats: 6,
  completedRequests: 127,
  pendingRequests: 15,
};

export const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "box_request",
    description: "New box request from Ahmed Hassan - 5 Premium boxes",
    timestamp: "2024-01-18T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    type: "payment_received",
    description: "Payment received - EGP 750 from Mohamed Ali",
    timestamp: "2024-01-18T09:15:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "box_handover",
    description: "Box handover completed - BOX-001 returned by Fatma Omar",
    timestamp: "2024-01-18T08:45:00Z",
    status: "completed",
  },
  {
    id: "4",
    type: "boat_added",
    description: "New boat added to fleet - Sea Explorer",
    timestamp: "2024-01-17T16:20:00Z",
    status: "completed",
  },
  {
    id: "5",
    type: "box_request",
    description: "Express delivery request - 3 Large boxes",
    timestamp: "2024-01-17T14:10:00Z",
    status: "in_progress",
  },
];

export const mockPerformance: PerformanceMetric[] = [
  { label: "Box Utilization", value: 87, change: 5, trend: "up" },
  { label: "Fleet Efficiency", value: 92, change: -2, trend: "down" },
  { label: "Revenue Growth", value: 15, change: 8, trend: "up" },
  { label: "Customer Satisfaction", value: 94, change: 3, trend: "up" },
];
