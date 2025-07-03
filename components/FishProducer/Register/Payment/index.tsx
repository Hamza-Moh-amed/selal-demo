"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Upload,
  Banknote,
  Wallet,
  CreditCard,
  X,
  FileText,
  Image,
  ChevronRight,
  ChevronDownIcon,
} from "lucide-react";

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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const schema = z.object({
  paymentMethod: z.enum(["bank", "cash", "instapay"]),
  paymentReference: z.string().optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentReceipt: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

interface PaymentSummary {
  subscriptionPlan: string;
  totalBoats: number;
  totalCapacity: number;
  totalAmount: number;
  discount?: number;
}

interface PaymentProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  paymentSummary: PaymentSummary;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function Payment({
  onSubmit,
  onBack,
  paymentSummary,
  loading = false,
  defaultValues,
}: PaymentProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "bank",
      paymentReference: "",
      paymentDate: "",
      ...defaultValues,
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  // Show image preview if uploaded file is an image
  useEffect(() => {
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(uploadedFile);
      setImagePreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreviewUrl(null);
    }
  }, [uploadedFile]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid file type (PNG, JPG, or PDF)");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    form.setValue("paymentReceipt", file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    form.setValue("paymentReceipt", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-6 w-6" />;
    }
    return <FileText className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24 sm:pb-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Payment</CardTitle>
          <CardDescription className="text-center">
            Complete your subscription payment
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subscription Plan:</span>
              <span className="font-medium capitalize">
                {paymentSummary.subscriptionPlan}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Boats:</span>
              <span className="font-medium">{paymentSummary.totalBoats}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <span className="font-medium">
                {paymentSummary.totalCapacity} boxes
              </span>
            </div>
            {typeof paymentSummary.discount === "number" &&
              paymentSummary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">
                    -{(paymentSummary.discount * 100).toFixed(0)}%
                  </span>
                </div>
              )}
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total Amount:</span>
            <span>EGP {paymentSummary.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-4"
                      >
                        <div
                          className={`flex items-center space-x-2 p-4 border rounded-lg ${
                            field.value === "bank"
                              ? "border-[#155DFC]"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="bank" id="bank" />
                          <Label
                            htmlFor="bank"
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Banknote className="h-5 w-5" />
                            <span>Bank Transfer</span>
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 p-4 border rounded-lg ${
                            field.value === "cash"
                              ? "border-[#155DFC]"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="cash" id="cash" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Wallet className="h-5 w-5" />
                            <span>Cash Payment</span>
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 p-4 border rounded-lg ${
                            field.value === "instapay"
                              ? "border-[#155DFC]"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="instapay" id="instapay" />
                          <Label
                            htmlFor="instapay"
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <CreditCard className="h-5 w-5" />
                            <span>InstaPay</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethod === "bank" && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Bank Details:</strong>
                      </p>
                      <p>Account Name: Fish Supply Chain Ltd.</p>
                      <p>Account Number: 1234567890</p>
                      <p>Bank: National Bank of Egypt</p>
                      <p>Amount: EGP {paymentSummary.totalAmount.toFixed(2)}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="paymentReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {paymentMethod === "instapay"
                        ? "InstaPay Reference Number"
                        : "Payment Reference Number"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter reference number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => {
                  // Convert string value to Date for the calendar
                  const valueAsDate = field.value
                    ? new Date(field.value)
                    : undefined;
                  return (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              id="paymentDate"
                              className="w-48 justify-between font-normal "
                              type="button"
                              variant="outline"
                              aria-label="Select payment date"
                            >
                              {valueAsDate && !isNaN(valueAsDate.getTime())
                                ? valueAsDate.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={valueAsDate}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                if (date) {
                                  // Format as YYYY-MM-DD
                                  const yyyy = date.getFullYear();
                                  const mm = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const dd = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  field.onChange(`${yyyy}-${mm}-${dd}`);
                                  setOpen(false);
                                } else {
                                  field.onChange("");
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="space-y-2">
                <Label>Payment Receipt Upload</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    tabIndex={0}
                    aria-label="Upload payment receipt"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload payment receipt or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(uploadedFile.type)}
                        <div>
                          <p className="text-sm font-medium">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                          {imagePreviewUrl && (
                            <img
                              src={imagePreviewUrl}
                              alt="Uploaded preview"
                              className="mt-2 max-w-xs max-h-40 rounded border"
                            />
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 p-0"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="signup-flow-actions fixed bottom-0 left-0  p-4 bg-white z-10 sm:static sm:p-0 sm:bg-transparent flex items-center justify-center gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-1 w-1/2"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1 w-1/2"
            >
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export type { FormData as PaymentData, PaymentSummary };
