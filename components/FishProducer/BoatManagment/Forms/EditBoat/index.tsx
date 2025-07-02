"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Ship } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Boat } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { getLocalDateString } from "@/lib/utils";
import type { EditBoatFormProps } from "../../types";

const boatSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Boat name is required"),
	registrationNumber: z.string().min(1, "Registration number is required"),
	captainName: z.string().min(1, "Captain name is required"),
	capacity: z.number().min(1).max(1000),
	boxSize: z.enum(["20kg", "25kg"]),
	status: z.enum(["active", "maintenance", "retired"]),
	photo: z.string().optional(),
	lastMaintenanceDate: z.string().optional(),
});

export default function EditBoatForm({ boat, onClose }: EditBoatFormProps) {
	const [boatState, setBoatState] = useState<Boat>(boat);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [openCalendar, setOpenCalendar] = useState(false);

	const form = useForm({
		resolver: zodResolver(boatSchema),
		defaultValues: { ...boatState, photo: boatState.photo ?? "" },
		mode: "onChange",
	});

	useEffect(() => {
		form.reset({ ...boatState, photo: boatState.photo ?? "" });
	}, [boatState]);

	// Handle image upload and preview
	const handlePhotoUpload = (file: File | null) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				setBoatState((prev) => ({
					...prev,
					photo: e.target!.result as string,
				}));
				form.setValue("photo", e.target!.result as string);
			}
		};
		reader.readAsDataURL(file);
	};
	// remove any and fix typescript errors
	const onSubmit = (values: z.infer<typeof boatSchema>) => {
		setBoatState({
			...values,
			photo: values.photo ?? "",
			lastMaintenanceDate: values.lastMaintenanceDate ?? "",
		});
		onClose();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full overflow-y-auto"
			>
				<h2 className="text-2xl font-bold mb-4">Edit Boat</h2>
				<div className="space-y-6">
					{/* Boat Photo */}
					<div className="flex items-center gap-4 p-4 border rounded-lg">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={form.watch("photo") || "/placeholder.svg"}
								alt="Boat photo"
							/>
							<AvatarFallback className="bg-blue-100 text-blue-600">
								<Ship className="h-10 w-10" />
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<Label>Boat Photo</Label>
							<Button
								variant="outline"
								size="sm"
								type="button"
								aria-label="Upload boat photo"
								tabIndex={0}
								onClick={() => fileInputRef.current?.click()}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										fileInputRef.current?.click();
									}
								}}
							>
								<Camera className="h-4 w-4 mr-2" />
								Upload Photo
							</Button>
							<input
								type="file"
								accept="image/*"
								style={{ display: "none" }}
								ref={fileInputRef}
								onChange={(e) => {
									const file = e.target.files?.[0] || null;
									handlePhotoUpload(file);
								}}
								aria-label="Select boat photo"
								tabIndex={-1}
							/>
						</div>
					</div>

					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Boat Name *</FormLabel>
									<FormControl>
										<Input
											id="boat-name"
											placeholder="Enter boat name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="registrationNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Registration Number *</FormLabel>
									<FormControl>
										<Input
											id="boat-reg"
											placeholder="e.g., EG-2024-001"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="captainName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Captain Name *</FormLabel>
									<FormControl>
										<Input
											id="captain-name"
											placeholder="Enter captain's full name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="capacity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Boat Capacity (boxes) *</FormLabel>
									<FormControl>
										<Input
											id="boat-capacity"
											type="number"
											min="50"
											max="1000"
											placeholder="e.g., 150"
											value={
												field.value === undefined || field.value === null
													? ""
													: field.value
											}
											onChange={(e) => {
												const value = e.target.value;
												field.onChange(value === "" ? "" : Number(value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Box Size Configuration */}
					<FormField
						control={form.control}
						name="boxSize"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Primary Box Size *</FormLabel>
								<FormControl>
									<RadioGroup
										value={field.value}
										onValueChange={field.onChange}
										className="space-y-4"
									>
										<div className="grid lg:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-4 border rounded-lg">
												<RadioGroupItem value="20kg" id="20kg" />
												<Label
													htmlFor="20kg"
													className="flex items-center space-x-2 cursor-pointer"
												>
													<div>
														<div className="font-medium">Medium 20kg</div>
													</div>
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-4 border rounded-lg">
												<RadioGroupItem value="25kg" id="25kg" />
												<Label
													htmlFor="25kg"
													className="flex items-center space-x-2 cursor-pointer"
												>
													<div>
														<div className="font-medium">Large 25kg</div>
													</div>
												</Label>
											</div>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Status and Maintenance */}
					<div className="flex flex-wrap gap-4">
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Boat Status *</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">
													<div className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-green-500"></div>
														Active
													</div>
												</SelectItem>
												<SelectItem value="maintenance">
													<div className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-yellow-500"></div>
														Maintenance
													</div>
												</SelectItem>
												<SelectItem value="retired">
													<div className="flex items-center gap-2">
														<div className="h-2 w-2 rounded-full bg-gray-500"></div>
														Retired
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastMaintenanceDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Maintenance Date</FormLabel>
									<FormControl>
										<Popover open={openCalendar} onOpenChange={setOpenCalendar}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													id="maintenance-date"
													className="w-48 justify-between font-normal"
												>
													{field.value
														? new Date(field.value).toLocaleDateString()
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
													selected={
														field.value ? new Date(field.value) : undefined
													}
													captionLayout="dropdown"
													onSelect={(date) => {
														if (date) {
															field.onChange(getLocalDateString(date));
															setOpenCalendar(false);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Capacity Preview */}
					<ul className="grid grid-cols-3 gap-4">
						<li className="text-center p-3  rounded-lg border border-black/10">
							<p className="text-lg font-bold text-black">
								{form.watch("capacity")}
							</p>
							<p className="text-xs text-muted-foreground">Total Boxes</p>
						</li>
						<li className="text-center p-3  rounded-lg border border-black/10">
							<p className="text-lg font-bold text-black">
								{form.watch("boxSize")}
							</p>
							<p className="text-xs text-muted-foreground">Box Size</p>
						</li>
						<li className="text-center p-3  rounded-lg border border-black/10">
							<p className="text-lg font-bold text-black">
								{form.watch("capacity") *
									(form.watch("boxSize") === "20kg" ? 20 : 25)}
								kg
							</p>
							<p className="text-xs text-muted-foreground">Total Weight</p>
						</li>
					</ul>

					<Button type="submit" className="w-full">
						Save Changes
					</Button>
				</div>
			</form>
		</Form>
	);
}
