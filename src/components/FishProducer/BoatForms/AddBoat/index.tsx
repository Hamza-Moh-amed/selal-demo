"use client";
import React from "react";
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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Boat } from "@/components/FishProducer/BoatForms/types";

export default function BoatForm() {
	const [numberOfBoats, setNumberOfBoats] = useState<number>(1);
	const [boats, setBoats] = useState<Boat[]>([
		{
			id: "1",
			name: "",
			registrationNumber: "",
			captainName: "",
			capacity: 50,
			boxSize: "20kg",
			status: "active",
			photo: "/placeholder.svg?height=100&width=100",
			lastMaintenanceDate: "",
		},
	]);

	// State to control which accordions are open
	const [openBoatIds, setOpenBoatIds] = useState<string[]>(["1"]);

	// Add a ref to store file input refs for each boat
	const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Update boats array when number changes
	useEffect(() => {
		const currentBoats = [...boats];
		if (numberOfBoats > boats.length) {
			// Add new boats
			for (let i = boats.length; i < numberOfBoats; i++) {
				currentBoats.push({
					id: (i + 1).toString(),
					name: "",
					registrationNumber: "",
					captainName: "",
					capacity: 50,
					boxSize: "20kg",
					status: "active",
					photo: "/placeholder.svg?height=100&width=100",
					lastMaintenanceDate: "",
				});
			}
		} else if (numberOfBoats < boats.length) {
			// Remove boats
			currentBoats.splice(numberOfBoats);
		}
		setBoats(currentBoats);
		// Ensure the first boat's accordion is open by default
		if (currentBoats.length > 0) {
			setOpenBoatIds((prev) => {
				// If the first boat's id is not open, add it
				const firstId = currentBoats[0].id;
				if (!prev.includes(firstId)) {
					return [
						firstId,
						...prev.filter((id) => currentBoats.some((b) => b.id === id)),
					];
				}
				// Remove ids that no longer exist
				return prev.filter((id) => currentBoats.some((b) => b.id === id));
			});
		}
	}, [numberOfBoats]);

	const updateBoat = (
		id: string,
		field: keyof Boat,
		value: string | number
	) => {
		setBoats(
			boats.map((boat) => (boat.id === id ? { ...boat, [field]: value } : boat))
		);
	};

	// Handle image upload and preview
	const handlePhotoUpload = (id: string, file: File | null) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				updateBoat(id, "photo", e.target.result as string);
			}
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="w-full overflow-y-auto">
			<h2 className="text-3xl font-bold mb-4">Add Boats</h2>

			{/* Number of Boats */}

			<div className="space-y-2 w-full mb-6">
				<Label htmlFor="boat-count">Number of Boats</Label>
				<Select
					value={numberOfBoats.toString()}
					onValueChange={(value) => setNumberOfBoats(Number.parseInt(value))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select number of boats" />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
							<SelectItem key={num} value={num.toString()}>
								{num} {num === 1 ? "Boat" : "Boats"}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Boat Details */}
			<Accordion
				type="multiple"
				value={openBoatIds}
				onValueChange={setOpenBoatIds}
				className="flex flex-col gap-4 mb-4"
			>
				{boats.map((boat, index) => (
					<AccordionItem
						key={boat.id}
						value={boat.id}
						className="border rounded-lg shadow"
					>
						<AccordionTrigger className="px-6 py-4 hover:no-underline">
							<div className="flex items-center justify-between w-full mr-4">
								<div className="text-left">
									<div className="font-semibold">Boat {index + 1}</div>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent className="px-6 pb-6">
							<div className="space-y-6">
								{/* Boat Photo */}
								<div className="flex items-center gap-4 p-4 border rounded-lg">
									<Avatar className="h-20 w-20">
										<AvatarImage
											src={boat.photo || "/placeholder.svg"}
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
											onClick={() => fileInputRefs.current[index]?.click()}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													fileInputRefs.current[index]?.click();
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
											ref={(el) => {
												fileInputRefs.current[index] = el;
											}}
											onChange={(e) => {
												const file = e.target.files?.[0] || null;
												handlePhotoUpload(boat.id, file);
											}}
											aria-label="Select boat photo"
											tabIndex={-1}
										/>
									</div>
								</div>

								{/* Basic Information */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor={`boat-name-${boat.id}`}>Boat Name *</Label>
										<Input
											id={`boat-name-${boat.id}`}
											placeholder="Enter boat name"
											value={boat.name}
											onChange={(e) =>
												updateBoat(boat.id, "name", e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`boat-reg-${boat.id}`}>
											Registration Number *
										</Label>
										<Input
											id={`boat-reg-${boat.id}`}
											placeholder="e.g., EG-2024-001"
											value={boat.registrationNumber}
											onChange={(e) =>
												updateBoat(
													boat.id,
													"registrationNumber",
													e.target.value
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`captain-name-${boat.id}`}>
											Captain Name *
										</Label>
										<Input
											id={`captain-name-${boat.id}`}
											placeholder="Enter captain's full name"
											value={boat.captainName}
											onChange={(e) =>
												updateBoat(boat.id, "captainName", e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`boat-capacity-${boat.id}`}>
											Boat Capacity (boxes) *
										</Label>
										<Input
											id={`boat-capacity-${boat.id}`}
											type="number"
											min="50"
											max="1000"
											placeholder="e.g., 150"
											value={boat.capacity}
											onChange={(e) =>
												updateBoat(
													boat.id,
													"capacity",
													Number.parseInt(e.target.value) || 50
												)
											}
										/>
									</div>
								</div>

								{/* Box Size Configuration */}
								<div className="space-y-4">
									<Label>Primary Box Size *</Label>
									<RadioGroup
										value={boat.boxSize}
										onValueChange={(value) =>
											updateBoat(boat.id, "boxSize", value as "20kg" | "25kg")
										}
									>
										<div className="grid lg:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-4 border rounded-lg">
												<RadioGroupItem value="20kg" id={`20kg-${boat.id}`} />
												<Label
													htmlFor={`20kg-${boat.id}`}
													className="flex items-center space-x-2 cursor-pointer"
												>
													<div>
														<div className="font-medium">20kg Boxes</div>
													</div>
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-4 border rounded-lg">
												<RadioGroupItem value="25kg" id={`25kg-${boat.id}`} />
												<Label
													htmlFor={`25kg-${boat.id}`}
													className="flex items-center space-x-2 cursor-pointer"
												>
													<div>
														<div className="font-medium">25kg Boxes</div>
													</div>
												</Label>
											</div>
										</div>
									</RadioGroup>
								</div>

								{/* Status and Maintenance */}
								<div className="flex flex-wrap gap-4">
									<div className="space-y-2">
										<Label>Boat Status *</Label>
										<Select
											value={boat.status}
											onValueChange={(value) =>
												updateBoat(boat.id, "status", value)
											}
										>
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
									</div>
									<div className="space-y-2">
										<Label htmlFor={`maintenance-date-${boat.id}`}>
											Last Maintenance Date
										</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													id={`maintenance-date-${boat.id}`}
													className="w-48 justify-between font-normal"
												>
													{boat.lastMaintenanceDate
														? new Date(
																boat.lastMaintenanceDate
														  ).toLocaleDateString()
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
														boat.lastMaintenanceDate
															? new Date(boat.lastMaintenanceDate)
															: undefined
													}
													captionLayout="dropdown"
													onSelect={(date) => {
														if (date) {
															updateBoat(
																boat.id,
																"lastMaintenanceDate",
																date.toISOString().split("T")[0]
															);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>

								{/* Capacity Preview */}
								<ul className="grid grid-cols-3 gap-4">
									<li className="text-center p-3  rounded-lg border border-black/10">
										<p className="text-lg font-bold text-black">
											{boat.capacity}
										</p>
										<p className="text-xs text-muted-foreground">Total Boxes</p>
									</li>
									<li className="text-center p-3  rounded-lg border border-black/10">
										<p className="text-lg font-bold text-black">
											{boat.boxSize}
										</p>
										<p className="text-xs text-muted-foreground">Box Size</p>
									</li>
									<li className="text-center p-3  rounded-lg border border-black/10">
										<p className="text-lg font-bold text-black">
											{boat.capacity * (boat.boxSize === "20kg" ? 20 : 25)}kg
										</p>
										<p className="text-xs text-muted-foreground">
											Total Weight
										</p>
									</li>
								</ul>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			<Button type="submit" className="w-full">
				Submit
			</Button>
		</div>
	);
}
