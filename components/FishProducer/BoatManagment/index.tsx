"use client";

import { useState } from "react";
import {
  Plus,
  Ship,
  BarChart3,
  ChartBar,
  DotIcon,
  CircleIcon,
  BarChart2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import AddBoatForm from "./Forms/AddBoat";
import type { Boat } from "./types";
import { mockBoats } from "./constants";
import SummaryCards from "./SummaryCards";
import BoatList from "./BoatList";

export default function BoatManagement() {
  const [boats] = useState<Boat[]>(mockBoats);
  const [isAddBoatModalOpen, setIsAddBoatModalOpen] = useState(false);
  const [isEditBoatModalOpen, setIsEditBoatModalOpen] = useState(false);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return "bg-red-500";
    if (utilization >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
  const activeBoats = boats.filter((boat) => boat.status === "active").length;
  const totalUtilization =
    boats.reduce((sum, boat) => sum + (boat.currentUtilization ?? 0), 0) /
    boats.length;

  const handleEditBoat = (boat: Boat) => {
    setEditingBoat(boat);
    setIsEditBoatModalOpen(true);
  };

  const summaryCards = [
    {
      title: "Total Boats",
      value: boats.length,
      icon: (
        <Ship className="h-6 w-6 text-[#155DFC]" aria-label="Total Boats" />
      ),
      iconBgClass: "",
      valueClass: "",
    },
    {
      title: "Active Boats",
      value: activeBoats,
      icon: (
        <BarChart2
          className="h-6 w-6 text-[#00a63e]"
          aria-label="Active Boats"
        />
      ),
      iconBgClass: "",
      valueClass: "text-black",
    },
    {
      title: "Total Capacity",
      value: totalCapacity,
      icon: (
        <BarChart3
          className="h-6 w-6 text-purple-500"
          aria-label="Total Capacity"
        />
      ),
      iconBgClass: "",
      valueClass: "",
    },
    {
      title: "Avg. Utilization",
      value: `${totalUtilization.toFixed(0)}%`,
      icon: (
        <ChartBar className="h-6 w-6 text-[#155DFC]" aria-label="Utilization" />
      ),
      iconBgClass: "",
      valueClass: "",
    },
  ];

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Boat Management</h1>
          <p className="text-muted-foreground">
            Manage your fleet and monitor capacity utilization
          </p>
        </div>
        <ResponsiveDialog
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              Add New Boat
            </Button>
          }
        >
          <AddBoatForm />
        </ResponsiveDialog>
      </div>

      {/* Summary Cards */}
      <SummaryCards summaryCards={summaryCards} />
      {/* Boats List */}
      <BoatList
        boats={boats}
        editingBoat={editingBoat}
        handleEditBoat={handleEditBoat}
        setIsEditBoatModalOpen={setIsEditBoatModalOpen}
        getStatusColor={getStatusColor}
        getUtilizationColor={getUtilizationColor}
      />

      {/* Empty State */}
      {boats.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No boats in your fleet
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first boat to the system
              </p>
              <Dialog
                open={isAddBoatModalOpen}
                onOpenChange={setIsAddBoatModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Boat
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Your First Boat</DialogTitle>
                    <DialogDescription>
                      Get started by adding your first boat to the fleet
                      management system
                    </DialogDescription>
                  </DialogHeader>
                  <AddBoatForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
