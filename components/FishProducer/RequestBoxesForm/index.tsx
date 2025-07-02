"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockBoats } from "./const";
import { getLocalDateString } from "@/lib/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

// Mock boats data - in real app this would come from your API

const formSchema = z.object({
	selectedBoat: z.string().min(1, { message: "Please select a boat" }),
	boxType: z.enum(["standard", "premium"], {
		message: "Please select a box type",
	}),
	quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
	deliveryAddress: z
		.string()
		.min(1, { message: "Delivery address is required" }),
	deliveryDate: z.string().min(1, { message: "Please select a delivery date" }),
	deliveryTime: z.string().min(1, { message: "Please select a delivery time" }),
	specialInstructions: z.string().optional(),
});

export default function RequestBoxesForm() {
	const [selectedBoat, setSelectedBoat] = useState<string>("");
	const [boxType, setBoxType] = useState<"standard" | "premium">("standard");
	const [quantity, setQuantity] = useState<number>(1);
	// const [deliveryAddress, setDeliveryAddress] = useState<string>("");
	// const [deliveryDate, setDeliveryDate] = useState<string>("");
	// const [deliveryTime, setDeliveryTime] = useState<string>("");
	// const [specialInstructions, setSpecialInstructions] = useState<string>("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			selectedBoat: "",
			boxType: "standard",
			quantity: 1,
			deliveryAddress: "",
			deliveryDate: "",
			deliveryTime: "",
			specialInstructions: "",
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log("Form Values:", values);
	};

	const timeSlots = [
		"06:00 - 08:00",
		"08:00 - 10:00",
		"10:00 - 12:00",
		"12:00 - 14:00",
		"14:00 - 16:00",
		"16:00 - 18:00",
		"18:00 - 20:00",
		"20:00 - 22:00",
		"22:00 - 24:00",
	];

	const boxTypes = {
		standard: { name: "Medium Box", capacity: "20kg", price: 50 },
		premium: { name: "Large Box", capacity: "25kg", price: 50 },
	};

	// Get selected boat details
	const selectedBoatDetails = mockBoats.find(
		(boat) => boat.id === form.watch("selectedBoat") || boat.id === selectedBoat
	);

	const calculateTotal = () => {
		const currentBoxType = form.watch("boxType") || boxType;
		const currentQuantity = form.watch("quantity") || quantity;
		const subtotal = boxTypes[currentBoxType].price * currentQuantity;
		return {
			subtotal,
			total: subtotal,
		};
	};

	const totals = calculateTotal();

	// Check if selected quantity exceeds boat capacity
	const isQuantityValid = () => {
		if (!selectedBoatDetails) return true;
		const currentQuantity = form.watch("quantity") || quantity;
		return currentQuantity <= (selectedBoatDetails.availableCapacity || 0);
	};

	// Add state to control open state for the delivery date calendar popover
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	// Add state to control open state for the accordion (like AddBoat)
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		"details"
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="w-full mx-auto p-6 space-y-6 overflow-y-auto">
					{/* Boat Selection - Standalone Select */}
					<div className="space-y-2 w-full mb-6">
						<Label htmlFor="boat-select">Select Boat</Label>
						<Select
							value={form.watch("selectedBoat") || selectedBoat}
							onValueChange={(value) => {
								form.setValue("selectedBoat", value);
								setSelectedBoat(value);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a boat from your fleet" />
							</SelectTrigger>
							<SelectContent>
								{mockBoats
									.filter((boat) => boat.status === "active")
									.map((boat) => (
										<SelectItem key={boat.id} value={boat.id}>
											<span className="font-medium">{boat.name}</span>
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						{selectedBoatDetails && (
							<div className="mt-3 p-3 bg-blue-50 rounded-lg">
								<div className="flex items-center justify-between text-sm">
									<div>
										<p className="font-medium text-blue-900">
											{selectedBoatDetails.name}
										</p>
										<p className="text-blue-700">
											Available Capacity:{" "}
											{selectedBoatDetails.availableCapacity} boxes
										</p>
									</div>
									<div className="text-right">
										<p className="text-blue-900 font-medium">
											{selectedBoatDetails.boxSize}
										</p>
										<p className="text-blue-700">
											{selectedBoatDetails.currentUtilization}% used
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Accordion for all remaining details */}
					<Accordion
						type="single"
						value={openAccordion}
						onValueChange={setOpenAccordion}
						className="flex flex-col gap-4 mb-4"
					>
						<AccordionItem value="details" className="border rounded-lg shadow">
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<div className="flex items-center justify-between w-full mr-4">
									<div className="text-left">
										<div className="font-semibold">Request Details</div>
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="space-y-6">
									{/* Box Selection & Delivery Details */}
									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="boxType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Box Type</FormLabel>
														<Select
															onValueChange={(value) => {
																field.onChange(value);
																setBoxType(value as "standard" | "premium");
															}}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{Object.entries(boxTypes).map(([key, type]) => (
																	<SelectItem key={key} value={key}>
																		{type.name} - {type.capacity} (EGP{" "}
																		{type.price})
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="quantity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Quantity</FormLabel>
														<FormControl>
															<Input
																type="number"
																min="1"
																max={
																	selectedBoatDetails?.availableCapacity || 50
																}
																{...field}
																onChange={(e) => {
																	const value =
																		Number.parseInt(e.target.value) || 1;
																	field.onChange(value);
																	setQuantity(value);
																}}
																className={
																	!isQuantityValid() ? "border-red-500" : ""
																}
															/>
														</FormControl>
														{selectedBoatDetails && (
															<FormDescription>
																Max available:{" "}
																{selectedBoatDetails.availableCapacity} boxes
															</FormDescription>
														)}
														{!isQuantityValid() && (
															<p className="text-xs text-red-500">
																Quantity exceeds available capacity (
																{selectedBoatDetails?.availableCapacity} boxes)
															</p>
														)}
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									<div className="space-y-4">
										<FormField
											control={form.control}
											name="deliveryAddress"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Delivery Address</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Enter your complete delivery address including building number, floor, and apartment"
															{...field}
															onChange={(e) => {
																field.onChange(e.target.value);
																// setDeliveryAddress(e.target.value);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="deliveryDate"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="flex items-center gap-2">
															<CalendarIcon className="h-4 w-4" />
															Preferred Date
														</FormLabel>
														<Popover
															open={isCalendarOpen}
															onOpenChange={setIsCalendarOpen}
														>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant="outline"
																		className="w-48 justify-between font-normal"
																	>
																		{field.value
																			? new Date(
																					field.value
																			  ).toLocaleDateString()
																			: "Select date"}
																		<ChevronDownIcon />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto overflow-hidden p-0"
																align="start"
															>
																<Calendar
																	mode="single"
																	selected={
																		field.value
																			? new Date(field.value)
																			: undefined
																	}
																	captionLayout="dropdown"
																	fromDate={(() => {
																		const d = new Date();
																		d.setDate(d.getDate() + 1);
																		d.setHours(0, 0, 0, 0);
																		return d;
																	})()}
																	onSelect={(date: Date | undefined) => {
																		if (date) {
																			const dateString =
																				getLocalDateString(date);
																			field.onChange(dateString);
																			// setDeliveryDate(dateString);
																			setIsCalendarOpen(false);
																		}
																	}}
																/>
															</PopoverContent>
														</Popover>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="deliveryTime"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="flex items-center gap-2">
															<Clock className="h-4 w-4" />
															Preferred Time Slot
														</FormLabel>
														<Select
															onValueChange={(value) => {
																field.onChange(value);
																// setDeliveryTime(value);
															}}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select time slot" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{timeSlots.map((slot) => (
																	<SelectItem key={slot} value={slot}>
																		{slot}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="specialInstructions"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Special Instructions (Optional)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Add any special delivery instructions, access codes, or specific requirements..."
															{...field}
															onChange={(e) => {
																field.onChange(e.target.value);
																// setSpecialInstructions(e.target.value);
															}}
															rows={3}
														/>
													</FormControl>
													<FormDescription>
														Include any specific delivery requirements, access
														codes, or handling instructions
													</FormDescription>
												</FormItem>
											)}
										/>
									</div>

									{/* Order Summary */}
									<div className="space-y-4">
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>
													{boxTypes[form.watch("boxType") || boxType].name} ×{" "}
													{form.watch("quantity") || quantity}
												</span>
												<span>
													EGP{" "}
													{(
														boxTypes[form.watch("boxType") || boxType].price *
														(form.watch("quantity") || quantity)
													).toFixed(2)}
												</span>
											</div>
											{selectedBoatDetails && (
												<div className="flex justify-between text-sm text-muted-foreground">
													<span>Assigned to: {selectedBoatDetails.name}</span>
													<span>{selectedBoatDetails.registrationNumber}</span>
												</div>
											)}
										</div>

										<Separator />

										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Subtotal:</span>
												<span>EGP {totals.subtotal.toFixed(2)}</span>
											</div>
										</div>

										<Separator />

										<div className="flex justify-between items-center text-lg font-bold">
											<span>Total:</span>
											<span>EGP {totals.total.toFixed(2)}</span>
										</div>
									</div>

									{/* Validation Alerts */}
									{!selectedBoat && !form.watch("selectedBoat") && (
										<Alert className="border-orange-200 bg-orange-50">
											<AlertCircle className="h-4 w-4" />
											<AlertDescription className="text-orange-800">
												<strong>Please select a boat</strong> to proceed with
												your box request.
											</AlertDescription>
										</Alert>
									)}

									{!isQuantityValid() && selectedBoatDetails && (
										<Alert className="border-red-200 bg-red-50">
											<AlertCircle className="h-4 w-4" />
											<AlertDescription className="text-red-800">
												<strong>Quantity exceeds capacity:</strong> The selected
												boat ({selectedBoatDetails.name}) only has{" "}
												{selectedBoatDetails.availableCapacity} boxes available.
											</AlertDescription>
										</Alert>
									)}

									{/* Important Notice */}

									{/* Submit Button */}
									<Button
										type="submit"
										className="w-full"
										disabled={
											!(form.watch("selectedBoat") || selectedBoat) ||
											!isQuantityValid()
										}
									>
										Submit Request - EGP {totals.total.toFixed(2)}
									</Button>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</form>
		</Form>
	);
}
