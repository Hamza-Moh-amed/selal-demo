"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number (01XXXXXXXXX)"),
  nationalId: z
    .string()
    .min(14, "National ID must be 14 digits")
    .max(14, "National ID must be 14 digits"),
  companyName: z.string().min(2, "Company/Boat Owner Name is required"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormData = z.infer<typeof schema>;

interface PersonalInformationProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function PersonalInformation({
  onSubmit,
  onBack,
  loading = false,
  defaultValues,
}: PersonalInformationProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      nationalId: "",
      companyName: "",
      agreeTerms: false,
      ...defaultValues,
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="w-full max-w-3xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-[16px] font-semibold ">
                Personal Information
              </CardTitle>
              <CardDescription className="text-[14px] font-normal ">
                Please provide your personal details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-medium">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                          <span className="text-sm">+20</span>
                        </div>
                        <Input
                          {...field}
                          placeholder="01004956670"
                          className="rounded-l-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-medium">
                      National ID Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="12345678901234"
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[14px] font-medium">
                      Company/Boat Owner Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter company or boat owner name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[14px] font-medium text-sm gap-1">
                        I agree to the
                        <span className="text-[#155DFC]">
                          Terms & Conditions
                        </span>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="signup-flow-actions fixed bottom-0 left-0 w-full p-4 bg-white z-10 sm:static sm:p-0 sm:bg-transparent flex items-center justify-center gap-4 px-3">
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
              {loading ? "Sending OTP..." : "Verify Phone"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export type { FormData as PersonalInformationData };
