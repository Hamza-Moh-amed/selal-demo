import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import // Dialog, // Removed
// DialogContent, // Removed
// DialogDescription, // Removed
// DialogHeader, // Removed
// DialogTitle, // Removed
// DialogTrigger, // Removed
"@/components/ui/dialog";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Ship, Edit, Trash2, Eye } from "lucide-react";
import EditBoatForm from "./Forms/EditBoat";

import type { BoatListProps } from "./types";

const BoatList = ({
  boats,
  // selectedBoat, // Removed
  // setSelectedBoat, // Removed
  editingBoat,
  handleEditBoat,
  setIsEditBoatModalOpen,
  getStatusColor,
  getUtilizationColor,
}: BoatListProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {boats.map((boat) => (
      <Card key={boat.id} className="hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="space-y-4">
            {/* Boat Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={boat.photo || "/placeholder.svg"}
                    alt={boat.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Ship className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{boat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {boat.registrationNumber}
                  </p>
                  <Badge className={getStatusColor(boat.status)}>
                    {boat.status.charAt(0).toUpperCase() + boat.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Boat Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Captain</p>
                <p className="font-medium">{boat.captainName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Capacity</p>
                <p className="font-medium">
                  {boat.capacity} boxes ({boat.boxSize})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Maintenance</p>
                <p className="font-medium">
                  {new Date(boat.lastMaintenanceDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Boxes Used</p>
                <p className="font-medium">{boat.totalBoxesUsed}</p>
              </div>
            </div>
            {/* Capacity Utilization Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Capacity Utilization</p>
                <p className="text-sm font-medium">
                  {boat.currentUtilization}%
                </p>
              </div>
              <Progress value={boat.currentUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {boat.totalBoxesUsed} of {boat.capacity} boxes used
              </p>
            </div>

            {/*Action Buttons */}
            <div className="flex justify-start lg:justify-end gap-2">
              <ResponsiveDialog
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBoat(boat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                }
              >
                {editingBoat && editingBoat.id === boat.id && (
                  <EditBoatForm
                    boat={editingBoat}
                    onClose={() => setIsEditBoatModalOpen(false)}
                  />
                )}
              </ResponsiveDialog>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default BoatList;
