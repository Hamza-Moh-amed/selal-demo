"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// OTP logic is mocked in LoginFlow.tsx and SignUpFlow.tsx for development purposes. Remove this comment when restoring real OTP verification.

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

interface OtpVerificationProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  onResend: () => void;
  phone: string;
  loading?: boolean;
  resendLoading?: boolean;
  initialTimer?: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function OtpVerification({
  onSubmit,
  onBack,
  onResend,
  phone,
  loading = false,
  resendLoading = false,
  initialTimer = 60,
  inputRef,
}: OtpVerificationProps) {
  const [timer, setTimer] = useState(initialTimer);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const handleResend = () => {
    onResend();
    setTimer(60);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-3xl mx-auto"
      >
        <Card className="w-full max-w-3xl mx-auto mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-[16px] font-semibold ">
              Verify Your Phone
            </CardTitle>
            <CardDescription className="text-[14px] font-normal text-[#6A7282]">
              We&apos;ve sent a 6-digit code to +20{phone?.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-center mb-4 text-[14px] font-medium">
                    Enter OTP Code
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field} ref={inputRef}>
                        <InputOTPGroup>
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={timer > 0 || resendLoading}
                className="text-[14px] font-medium text-[#155DFC]"
              >
                {resendLoading
                  ? "Resending..."
                  : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="signup-flow-actions fixed bottom-0 left-0  p-4 bg-white z-10 sm:static sm:p-0 sm:bg-transparent flex items-center justify-center gap-4 w-full px-3">
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
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { FormData as OtpVerificationData };
