"use client";

import * as React from "react";
import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive";

interface ResponsiveDialogProps {
  children: ReactNode;
  title?: string;
  trigger: ReactNode;
}

export function ResponsiveDialog({
  children,
  title,
  trigger,
}: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-3xl min-w-2xl p-4 max-h-[90vh] overflow-y-auto w-full">
          {title && <DialogTitle className="">{title}</DialogTitle>}
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4">
        {title && <DrawerTitle className="sr-only">{title}</DrawerTitle>}
        {children}
      </DrawerContent>
    </Drawer>
  );
}
