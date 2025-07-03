"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Truck,
  ShoppingCart,
  Ship,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const userTypes = [
  {
    value: "producer",
    label: "Fish Producer",
    description: "Boat owners and fish producers",
    icon: Ship,
  },
  {
    value: "wholesaler",
    label: "Wholesaler",
    description: "Fish wholesale distributors",
    icon: Building2,
  },
  {
    value: "logistics",
    label: "Logistics Partners",
    description: "Transportation and logistics providers",
    icon: Truck,
  },
  {
    value: "customer",
    label: "Customer",
    description: "End customers and retailers",
    icon: ShoppingCart,
  },
];

const schema = z.object({
  userType: z.string().min(1, "Please select a user type"),
});

type FormData = z.infer<typeof schema>;

interface UserTypeSelectionProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export default function UserTypeSelection({
  onSubmit,
  loading = false,
}: UserTypeSelectionProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { userType: "" },
  });

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-between space-y-4 pb-24 sm:pb-0">
      <div className="space-y-2 text-center">
        <h2 className="text-[20px] font-semibold text-[#030712] text-start md:text-center">
          Choose Your Account Type
        </h2>
        <p className="text-[14px] font-normal text-[#6A7282] text-start md:text-center">
          Select the option that best describes your role in the fish supply
          chain
        </p>
      </div>
      <div className="flex-1 flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
            id="user-type-form"
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {userTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div key={type.value}>
                              <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="peer sr-only"
                              />

                              <Label
                                htmlFor={type.value}
                                className="flex flex-row lg:flex-col items-center justify-start gap-4 lg:gap-4 rounded-2xl lg:rounded-xl border-2 border-muted bg-popover p-6  peer-data-[state=checked]:border-[#155DFC] [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                              >
                                <div className="p-4 rounded-2xl bg-[#F3F4F6]">
                                  <Icon className="h-6 w-6 text-[#155DFC]" />
                                </div>
                                <div className="w-2/3 flex flex-col gap-1 items-start md:items-center justify-center">
                                  <div className="font-semibold text-[16px] text-[#030712]">
                                    {type.label}
                                  </div>
                                  <p className="font-normal text-[14px] text-[#6A7282] md:text-center">
                                    {type.description}
                                  </p>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="signup-flow-actions fixed bottom-0 left-0 p-4 bg-white z-10 sm:static sm:p-0 sm:bg-transparent flex items-center justify-center gap-4 w-full px-3">
        <Button
          type="submit"
          disabled={loading}
          form="user-type-form"
          className="flex items-center w-full text-[14px] font-medium"
        >
          Go to Personal info
        </Button>
      </div>
    </div>
  );
}

export { userTypes };
