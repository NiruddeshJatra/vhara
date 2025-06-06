import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Upload } from "lucide-react";
import { DateOfBirthPicker } from "@/components/common/DateOfBirthPicker";
import { useState } from 'react';
import { UserData } from "@/types/auth";

interface ProfileInformationProps {
  userData: UserData;
  isEditing: boolean;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
  onInputChange: (field: keyof UserData, value: string) => void;
  onProfilePictureUpload: (file: File) => void;
}

const ProfileInformation = ({
  userData,
  isEditing,
  onSaveChanges,
  onCancelEdit,
  onInputChange,
  onProfilePictureUpload
}: ProfileInformationProps) => {
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a preview URL for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      // Store the file for backend submission
      setProfilePictureFile(file);
      // Call the upload handler with the file
      onProfilePictureUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-t from-green-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-green-800">Personal Information</CardTitle>
            <CardDescription className="text-green-600">Your basic account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-green-800 font-medium">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={userData.firstName} 
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-green-800 font-medium">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={userData.lastName} 
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-green-800 font-medium">Email Address</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    value={userData.email} 
                    disabled
                    className="bg-green-50/70 pr-10 border-green-200 text-green-800"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber" className="text-green-800 font-medium">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  value={userData.phoneNumber} 
                  onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                  className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="text-green-800 font-medium">Location</Label>
                <Input 
                  id="location" 
                  value={userData.location} 
                  onChange={(e) => onInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className={`border-green-300 bg-white text-green-800 ${!isEditing ? "bg-green-50/70 border-green-200" : ""}`}
                />
              </div>
              
              <div>
                <DateOfBirthPicker
                  value={userData.dateOfBirth}
                  onChange={(date) => onInputChange('dateOfBirth', date)}
                  label="Date of Birth"
                  required={false}
                  className={!isEditing ? "opacity-70 pointer-events-none" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-t from-green-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-green-800">About Me</CardTitle>
            <CardDescription className="text-green-600">Tell others about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <Label htmlFor="bio" className="text-green-800 font-medium">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={userData.bio || ""} 
                  onChange={(e) => onInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  className="border-green-300 bg-white text-green-800"
                />
                <p className="text-green-700 text-sm mt-1">Tell others about yourself and your interests</p>
              </div>
              
              {isEditing && (
                <div className="pt-4">
                  <h4 className="text-base font-medium mb-2 text-green-800">Profile Picture</h4>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/70">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-full border-2 border-green-200">
                        <AvatarImage 
                          src={previewUrl || userData.profilePicture || '/default-avatar.png'} 
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {userData.firstName[0]}{userData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <label 
                          htmlFor="profile-pic" 
                          className="bg-white border border-green-300 rounded-lg px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 cursor-pointer inline-flex items-center gap-2 shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Choose file
                          <input 
                            id="profile-pic" 
                            type="file" 
                            className="hidden" 
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                        <p className="text-green-700 text-xs mt-1">JPG, JPEG, PNG formats, max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancelEdit}
            className="bg-white hover:bg-green-50 text-green-700 hover:text-green-900"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileInformation;