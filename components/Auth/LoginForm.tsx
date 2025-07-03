"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

// OTP logic is mocked in LoginFlow.tsx for development purposes. Remove this comment when restoring real OTP verification.

const schema = z.object({
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number (01XXXXXXXXX)"),
});

type FormData = z.infer<typeof schema>;

interface PhoneLoginProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  defaultValues,
}: PhoneLoginProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-[16px] font-semibold">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-[14px] font-normal">
          Enter your phone number to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
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

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-12 text-[14px] font-medium"
                size="lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue"}
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-primary text-sm ">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { FormData as PhoneLoginData };
