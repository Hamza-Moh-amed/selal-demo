"use client";

import { Ship, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import AddBoatForm from "../BoatManagment/Forms/AddBoat";
import RequestBoxesForm from "../RequestBoxesForm";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const DashboardQuickActions = () => {
  const router = useRouter();

  // Define the quick actions
  const quickActions: {
    label: string;
    icon: ReactNode;
    type: "dialog" | "button";
    dialogTitle?: string;
    dialogContent?: ReactNode;
    onClick?: () => void;
    ariaLabel: string;
  }[] = [
    {
      label: "Add New Boat",
      icon: <Ship className="h-6 w-6" />,
      type: "dialog",
      dialogTitle: "Add New Boat",
      dialogContent: <AddBoatForm />,
      ariaLabel: "Add new boat",
    },
    {
      label: "Request Boxes",
      icon: <Package className="h-6 w-6" />,
      type: "dialog",
      dialogTitle: "Request Boxes",
      dialogContent: <RequestBoxesForm />,
      ariaLabel: "Request boxes",
    },
    {
      label: "Confirm Handover",
      icon: <ArrowRight className="h-6 w-6" />,
      type: "button",
      onClick: () => router.push("/dashboard/handover-confirmation"),
      ariaLabel: "Confirm handover",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium">Quick Actions</CardTitle>
        <CardDescription>
          Frequently used actions for managing your fleet and operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) =>
            action.type === "dialog" ? (
              <ResponsiveDialog
                key={action.label}
                trigger={
                  <Button
                    variant="outline"
                    className="flex flex-row lg:flex-col py-2 px-4 font-normal gap-2 h-12 lg:h-24 text-[#155DFC] border-[#155DFC]"
                    aria-label={action.ariaLabel}
                    tabIndex={0}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                }
                title={action.dialogTitle || ""}
              >
                {action.dialogContent}
              </ResponsiveDialog>
            ) : (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant="outline"
                className="flex flex-row lg:flex-col py-2 px-4 gap-2 h-12 lg:h-24 text-[#155DFC] border-[#155DFC]"
                aria-label={action.ariaLabel}
                tabIndex={0}
              >
                {action.icon}
                <span className="font-normal">{action.label}</span>
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
