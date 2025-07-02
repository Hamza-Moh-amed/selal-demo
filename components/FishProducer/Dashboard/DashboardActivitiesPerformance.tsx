"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Eye, TrendingUp } from "lucide-react";
import { DashboardActivitiesPerformanceProps } from "./types";

const DashboardActivitiesPerformance = ({
  mockActivities,
  mockPerformance,
  getActivityIcon,
  getActivityColor,
  getStatusColor,
  getTrendIcon,
}: DashboardActivitiesPerformanceProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>
            Latest updates and activities in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg border"
              >
                <div
                  className={`p-2 rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <Badge
                    className={getStatusColor(activity.status)}
                    variant="secondary"
                  >
                    {activity.status.replace("_", " ")}
                  </Badge>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Key performance indicators and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockPerformance.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    <span className="text-sm font-bold">{metric.value}%</span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Current performance
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      metric.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}% vs last period
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActivitiesPerformance;
