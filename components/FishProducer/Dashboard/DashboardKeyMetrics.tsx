"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, Ship, Activity } from "lucide-react";
import { DashboardStats } from "./types";

const DashboardKeyMetrics = ({ mockStats }: { mockStats: DashboardStats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active & Pending Boxes */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-muted-foreground">Active Boxes</p>
              <p className="text-sm font-semibold text-[#00a63e]">
                {mockStats.activeBoxes}
              </p>
              <p className="text-sm text-muted-foreground">32 pending</p>
            </div>
            <Package className="h-6 w-6 text-[#00a63e]" />
          </div>
        </CardContent>
      </Card>
      {/* Total Revenue */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-muted-foreground">Total Revenue</p>
              <p className="text-sm font-semibold text-[#00a63e]">
                EGP {mockStats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-[#00a63e]">+12% this month</p>
            </div>
            <DollarSign className="h-6 w-6 text-[#00a63e]" />
          </div>
        </CardContent>
      </Card>
      {/* Boats */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-muted-foreground">Fleet Size</p>
              <p className="text-sm font-semibold text-[#00a63e]">
                {mockStats.totalBoats}
              </p>
              <p className="text-sm text-muted-foreground">6 Active</p>
            </div>
            <Ship className="h-6 w-6 text-[#155DFC]" />
          </div>
        </CardContent>
      </Card>
      {/* Requests Status */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-muted-foreground">Requests</p>
              <p className="text-sm font-normal">
                {mockStats.completedRequests}
              </p>
              <p className="text-sm text-muted-foreground">15 Pending</p>
            </div>
            <Activity className="h-6 w-6 text-purple-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKeyMetrics;
