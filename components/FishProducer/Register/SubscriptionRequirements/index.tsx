"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  numberOfBoats: z.number().min(1).max(10),
  boats: z.array(
    z.object({
      name: z.string().min(1, "Boat name is required"),
      registrationNumber: z.string().min(1, "Registration number is required"),
      // Capacity min and Max (Removed)
      capacity: z.number(),
      boxSize: z.enum(["20kg", "25kg"]),
    })
  ),
  subscriptionPlan: z.enum(["monthly", "quarterly", "annual"]),
});

type FormData = z.infer<typeof schema>;

interface Boat {
  name: string;
  registrationNumber: string;
  capacity: number;
  boxSize: "20kg" | "25kg";
}

interface SubscriptionRequirementsProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function SubscriptionRequirements({
  onSubmit,
  onBack,
  loading = false,
  defaultValues,
}: SubscriptionRequirementsProps) {
  // Pricing constants - Fixed: No price difference between box sizes
  const BASE_RATE = 2.5; // EGP per box per month
  const PLAN_DISCOUNTS = { monthly: 0, quarterly: 0.05, annual: 0.15 };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      numberOfBoats: 1,
      boats: [
        { name: "", registrationNumber: "", capacity: 50, boxSize: "20kg" },
      ],
      subscriptionPlan: "monthly",
      ...defaultValues,
    },
  });

  const boats = form.watch("boats") || [];
  const subscriptionPlan = form.watch("subscriptionPlan");
  const numberOfBoats = form.watch("numberOfBoats");

  const [openBoatIndexes, setOpenBoatIndexes] = useState<string[]>(["0"]);

  // Calculate pricing
  const calculatePricing = (
    boats: Boat[],
    plan: "monthly" | "quarterly" | "annual"
  ) => {
    const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
    // Fixed: Same rate for all box sizes
    const monthlyBaseCost = totalCapacity * BASE_RATE;

    // Calculate individual plan costs with their respective discounts
    const planCosts = {
      monthly: monthlyBaseCost, // No discount for monthly
      quarterly: monthlyBaseCost * (1 - PLAN_DISCOUNTS.quarterly) * 3,
      annual: monthlyBaseCost * (1 - PLAN_DISCOUNTS.annual) * 12,
    };

    const selectedDiscount = PLAN_DISCOUNTS[plan];
    const finalMonthlyCost = monthlyBaseCost * (1 - selectedDiscount);

    return {
      totalCapacity,
      monthlyBaseCost,
      finalMonthlyCost,
      planCosts,
      discount: selectedDiscount,
    };
  };

  // Update boats array when number changes
  const updateBoatsArray = (numberOfBoats: number) => {
    const currentBoats = form.getValues("boats");
    const newBoats = [...currentBoats];

    if (numberOfBoats > currentBoats.length) {
      for (let i = currentBoats.length; i < numberOfBoats; i++) {
        newBoats.push({
          name: "",
          registrationNumber: "",
          capacity: 50,
          boxSize: "20kg" as const,
        });
      }
    } else if (numberOfBoats < currentBoats.length) {
      newBoats.splice(numberOfBoats);
    }

    form.setValue("boats", newBoats);
  };

  useEffect(() => {
    updateBoatsArray(numberOfBoats);
  }, [numberOfBoats]);

  const pricing = calculatePricing(boats, subscriptionPlan);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-24 sm:pb-0">
      <div className="space-y-2 text-center">
        <h2 className="text-[16px] font-semibold text-[#030712] text-start md:text-center">
          Subscription Requirements
        </h2>
        <p className="text-[14px] font-normal text-[#6A7282] text-start md:text-center">
          As a Fish Producer, you need an active subscription to use our
          platform
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Number of Boats */}
          <Card>
            <CardContent className="space-y-2">
              <FormLabel className="text-[16px] font-medium">
                Fleet Configration
              </FormLabel>
              <FormField
                control={form.control}
                name="numberOfBoats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-medium">
                      Number of Boats
                    </FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        const num = Number.parseInt(value);
                        field.onChange(num);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Boat" : "Boats"}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Boat Details Accordion */}
          <Accordion
            type="multiple"
            value={openBoatIndexes}
            onValueChange={setOpenBoatIndexes}
            className="flex flex-col gap-4 mb-4"
          >
            {boats.map((boat, index) => (
              <AccordionItem
                key={index}
                value={index.toString()}
                className="border rounded-lg shadow"
              >
                <AccordionTrigger className="bg-white px-6 py-4  hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="text-left">
                      <div className="text-[16px] font-semibold">
                        Boat {index + 1} Details
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 bg-white  ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`boats.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] font-medium">
                            Boat Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`boats.${index}.registrationNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] font-medium">
                            Registration Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., EG-2024-001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`boats.${index}.capacity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] font-medium">
                            Boat Capacity (boxes)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="50"
                              max="500"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 50
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`boats.${index}.boxSize`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[14px] font-medium">
                            Primary Box Size
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="20kg"
                                  id={`20kg-${index}`}
                                />
                                <Label
                                  className="text-sm font-normal"
                                  htmlFor={`20kg-${index}`}
                                >
                                  20kg
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="25kg"
                                  id={`25kg-${index}`}
                                />
                                <Label
                                  className="text-sm font-normal"
                                  htmlFor={`25kg-${index}`}
                                >
                                  25kg
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Subscription Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[16px] font-semibold ">
                Subscription Plan
              </CardTitle>
              <CardDescription>Choose your billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="">
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between p-4 border rounded-xl">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="font-medium">
                              Monthly
                            </Label>
                          </div>
                          <div className="text-right">
                            <Label className="font-medium">
                              EGP {pricing.planCosts.monthly.toFixed(2)}
                            </Label>
                            <Label className="text-sm font-light text-muted-foreground">
                              per month
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quarterly" id="quarterly" />
                            <Label htmlFor="quarterly" className="font-medium">
                              Quarterly
                            </Label>
                            <span className="text-sm text-green-700 font-light bg-green-100 px-1 rounded-xs py-1">
                              5% OFF
                            </span>
                          </div>
                          <div className="text-right">
                            <Label className="font-medium">
                              EGP {pricing.planCosts.quarterly.toFixed(2)}
                            </Label>

                            <Label className="text-sm font-light text-muted-foreground">
                              3 months
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual" id="annual" />
                            <Label htmlFor="annual" className="font-medium">
                              Annual
                            </Label>
                            <span className="text-sm text-green-700 font-light bg-green-100 px-1 rounded-sm py-1">
                              15% OFF
                            </span>
                          </div>
                          <div className="text-right">
                            <Label className="font-medium">
                              EGP {pricing.planCosts.annual.toFixed(2)}
                            </Label>
                            <Label className="text-sm font-light text-muted-foreground">
                              per year
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 text-sm">
                <Label className="text-[16px] font-semibold">
                  Pricing Summary
                </Label>
                <div className="flex flex-row items-center justify-between">
                  <Label className="font-normal">Total Fleet Capacity:</Label>
                  <Label>{pricing.totalCapacity} boxes</Label>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <Label className="font-normal">Base Monthly Rate:</Label>

                  <Label>EGP {pricing.monthlyBaseCost.toFixed(2)}</Label>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <Label className="font-medium text-base">Total Cost:</Label>
                <Label className="text-base">
                  EGP {pricing.planCosts[subscriptionPlan].toFixed(2)}
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="signup-flow-actions fixed bottom-0 left-0 p-4 bg-white z-10 sm:static sm:p-0 sm:bg-transparent flex items-center justify-center gap-4 w-full px-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-1 w-1/2 text-[14px] font-medium"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1 w-1/2 text-[14px] font-medium"
            >
              {loading ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export type { FormData as SubscriptionRequirementsData };
