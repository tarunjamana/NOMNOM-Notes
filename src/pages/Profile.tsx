import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserById } from "../helpers/fireStoreFuncs";
import { useEffect } from "react";
import { setUserProfile } from "../store/slices/userProfileSlice";
import { useNavigate } from "react-router-dom";
import AvatarUploader from "../components/AvatarUploader";
const Profile = () => {
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userProfile = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    if (!userData.isLoggedIn) {
      navigate("/");
    }
    const fetchUserData = async () => {
      if (userData.uid) {
        const user = await getUserById(userData.uid);
        if (user) {
          dispatch(setUserProfile(user));
        }
      }
    };
    fetchUserData();
  }, [userData.uid, dispatch, userProfile.isLoaded]);
  console.log("User Data:", userData);
  if (!userProfile.isLoaded) {
    return <p>Loading user profile...</p>;
  }

  const {
    firstName,
    lastName,
    gender,
    dob,
    height,
    currentWeight,
    targetWeight,
    activityLevel,
    email,
  } = userProfile.profile!;

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-gray-100 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-black my-6">User Profile</h1>

      <div className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-md">
        <p className="text-gray-900  mb-6 text-3xl font-bold">My Profile</p>
        {/* User Image with name section */}
        <div>
          <div className="flex items-center space-x-4 mb-6 border border-gray-100 rounded-lg p-4 shadow-sm">
            <AvatarUploader />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-700">
          <div>
            <p className="font-medium text-sm text-gray-500">Full Name</p>
            <p className="text-lg">{`${firstName} ${lastName}`}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Email</p>
            <p className="text-lg">{email}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Gender</p>
            <p className="text-lg capitalize">{gender}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Date of Birth</p>
            <p className="text-lg">{dob}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Height (cm)</p>
            <p className="text-lg">{height}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">
              Current Weight (kg)
            </p>
            <p className="text-lg">{currentWeight}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">
              Target Weight (kg)
            </p>
            <p className="text-lg">{targetWeight}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Activity Level</p>
            <p className="text-lg capitalize">{activityLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
