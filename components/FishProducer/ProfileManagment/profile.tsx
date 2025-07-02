"use client";

import { useState, useRef } from "react";
import { Camera, Edit, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
	id: string;
	fullName: string;
	phone: string;
	address: string;
	city: string;
	country: string;
	profileImage: string;
	joinDate: string;
	lastLogin: string;
}

interface ProfileAccountProps {
	profile: UserProfile;
	onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfileAccount({
	profile,
	onProfileUpdate,
}: ProfileAccountProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
	const [imagePreview, setImagePreview] = useState<string | null>(
		profile.profileImage || null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChangePhotoClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				setEditedProfile({
					...editedProfile,
					profileImage: reader.result as string,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemovePhoto = () => {
		setImagePreview(null);
		setEditedProfile({ ...editedProfile, profileImage: "" });
	};

	const handleSaveProfile = () => {
		onProfileUpdate(editedProfile);
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setEditedProfile(profile);
		setImagePreview(profile.profileImage || null);
		setIsEditing(false);
	};

	return (
		<div className="space-y-6">
			{/* Profile Information */}
			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								Manage your personal information and contact details
							</CardDescription>
						</div>
						{!isEditing ? (
							<Button variant="outline" onClick={() => setIsEditing(true)}>
								<Edit className="h-4 w-4" />
								Edit Profile
							</Button>
						) : (
							<div className="flex gap-1 lg:gap-2">
								<Button size="sm" onClick={handleSaveProfile}>
									<Check className="h-4 w-4" />
									Save
								</Button>
								<Button variant="outline" size="sm" onClick={handleCancelEdit}>
									<X className="h-4 w-4" />
									Cancel
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Profile Picture */}
					<div className="flex items-center gap-6">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={imagePreview || "/placeholder.svg"}
								alt={editedProfile.fullName}
							/>
							<AvatarFallback className="text-lg">
								{editedProfile.fullName
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">
								{editedProfile.fullName}
							</h3>
							<p className="text-sm text-muted-foreground">
								Member since {new Date(profile.joinDate).toLocaleDateString()}
							</p>
							{isEditing ? (
								<div className="flex gap-1 lg:gap-2">
									<input
										type="file"
										accept="image/*"
										ref={fileInputRef}
										className="hidden"
										onChange={handleFileChange}
										tabIndex={-1}
										aria-label="Upload profile photo"
									/>
									<Button
										variant="outline"
										size="sm"
										type="button"
										onClick={handleChangePhotoClick}
										aria-label="Change Photo"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												handleChangePhotoClick();
										}}
									>
										<Camera className="h-4 w-4" />
										Change Photo
									</Button>
									<Button
										variant="destructive"
										size="sm"
										type="button"
										onClick={handleRemovePhoto}
										aria-label="Remove Photo"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												handleRemovePhoto();
										}}
										disabled={!imagePreview}
									>
										<X className="h-4 w-4" />
										Remove Photo
									</Button>
								</div>
							) : (
								<Button
									variant="outline"
									size="sm"
									type="button"
									aria-label="Change Photo (edit mode only)"
									tabIndex={-1}
									disabled
								>
									<Camera className="h-4 w-4" />
									Change Photo
								</Button>
							)}
						</div>
					</div>

					<Separator />

					{/* Personal Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label>Full Name</Label>
							{isEditing ? (
								<Input
									value={editedProfile.fullName}
									onChange={(e) =>
										setEditedProfile({
											...editedProfile,
											fullName: e.target.value,
										})
									}
								/>
							) : (
								<p className="text-sm p-2 bg-gray-50 rounded">
									{profile.fullName}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>Phone Number</Label>
							{isEditing ? (
								<Input
									type="tel"
									value={editedProfile.phone}
									onChange={(e) =>
										setEditedProfile({
											...editedProfile,
											phone: e.target.value,
										})
									}
								/>
							) : (
								<p className="text-sm p-2 bg-gray-50 rounded">
									{profile.phone}
								</p>
							)}
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label>Address</Label>
							{isEditing ? (
								<Textarea
									value={editedProfile.address}
									onChange={(e) =>
										setEditedProfile({
											...editedProfile,
											address: e.target.value,
										})
									}
								/>
							) : (
								<p className="text-sm p-2 bg-gray-50 rounded">
									{profile.address}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>City</Label>
							{isEditing ? (
								<Input
									value={editedProfile.city}
									onChange={(e) =>
										setEditedProfile({
											...editedProfile,
											city: e.target.value,
										})
									}
								/>
							) : (
								<p className="text-sm p-2 bg-gray-50 rounded">{profile.city}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>Country</Label>
							{isEditing ? (
								<Input
									value={editedProfile.country}
									onChange={(e) =>
										setEditedProfile({
											...editedProfile,
											country: e.target.value,
										})
									}
								/>
							) : (
								<p className="text-sm p-2 bg-gray-50 rounded">
									{profile.country}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
