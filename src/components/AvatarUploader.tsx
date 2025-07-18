import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateUserAvatarInFirestore } from "../helpers/fireStoreFuncs";
import { uploadAvatar } from "../helpers/firebaseStorageFuncs";
import { updateUserProfile } from "../store/slices/userProfileSlice";

const AvatarUploader = () => {
  const [hovering, setHovering] = useState(false);
  const userData = useAppSelector((state) => state.user);
  const userProfile = useAppSelector((state) => state.userProfile.profile);
  const dispatch = useAppDispatch();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file);
    console.log(event.target.files);
    if (!file) return;
    console.log("file is present trying to upload");
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }
    try {
      const downloadURL = await uploadAvatar(file, userData.uid);
      await updateUserAvatarInFirestore(userData.uid, downloadURL);
      dispatch(updateUserProfile({ photoURL: downloadURL }));
      console.log(
        "Avatar uploaded successfully and Firestore updated and Redux state updated"
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      return;
    }
  };

  return (
    <div
      className="relative w-24 h-24 rounded-full bg-gray-200 text-center group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {userProfile?.photoURL ? (
        <img
          src={userProfile.photoURL as string}
          alt="Profile"
          className="w-full h-full object-contain rounded-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500 text-2xl font-bold">
          {userData.firstName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Always render the file input, but keep it hidden */}
      <input
        id="avatarUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {hovering && (
        <label
          htmlFor="avatarUpload"
          className="absolute inset-0 bg-transparent bg-opacity-40 flex items-end justify-center cursor-pointer transition duration-200 ease-in-out"
        >
          <span
            className={
              "text-sm font-medium " + userProfile?.photoURL
                ? "text-gray-700"
                : "text-black"
            }
          >
            Edit
          </span>
        </label>
      )}
    </div>
  );
};

export default AvatarUploader;
