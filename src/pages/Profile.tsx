import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserById } from "../helpers/fireStoreFuncs";
import { useEffect } from "react";
import {
  setUserProfile,
  updateUserProfile,
} from "../store/slices/userProfileSlice";
import { useNavigate } from "react-router-dom";
import AvatarUploader from "../components/AvatarUploader";
import { EditableSection } from "../components/EditableSection";
import * as Yup from "yup";
import { updateEditableFields } from "../helpers/fireStoreFuncs";
const Profile = () => {
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userProfile = useAppSelector((state) => state.userProfile);

  type PersonalInfo = {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    bio: string;
  };

  const personalInfoSchema = Yup.object().shape({
    phone: Yup.string()
      .test(
        "phone-or-bio",
        "Either phone or bio must be provided",
        function (value) {
          return !!value || !!this.parent.bio;
        }
      )
      .test("valid-phone", "Invalid phone number", (value) => {
        if (!value) return true;
        return value.replace(/\D/g, "").length >= 10;
      }),
    bio: Yup.string()
      .max(300, "Bio must be less than 300 characters")
      .test(
        "phone-or-bio",
        "Either phone or bio must be provided",
        function (value) {
          return !!value || !!this.parent.phone;
        }
      ),
  }) as Yup.ObjectSchema<Partial<PersonalInfo>>;

  useEffect(() => {
    if (!userData.isLoggedIn) {
      void navigate("/");
    }
    const fetchUserData = async () => {
      if (userData.uid) {
        const user = await getUserById(userData.uid);
        if (user) {
          dispatch(setUserProfile(user));
        }
      }
    };
    void fetchUserData();
  }, [userData.isLoggedIn, userData.uid, dispatch, navigate]);
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
    phone = undefined,
    bio,
  } = userProfile.profile!;

  const initialValues = {
    fullName: `${firstName} ${lastName}`,
    gender,
    dateOfBirth: dob,
    phone: "",
    bio: "",
  };

  const editableConfig = {
    fullName: false,
    gender: false,
    dateOfBirth: false,
    phone: true,
    bio: true,
  };

  type HealthMetrics = {
    height: string;
    currentWeight: string;
    targetWeight: string;
    activityLevel: "low" | "moderate" | "active" | "veryActive" | "";
  };

  const healthMetricsSchema = Yup.object().shape({
    height: Yup.string(),
    currentWeight: Yup.string()
      .test("is-number", "Must be a valid number", (value) => {
        if (!value) return false;
        return !isNaN(Number(value));
      })
      .test("is-positive", "Must be positive", (value) => {
        if (!value) return false;
        return Number(value) > 0;
      })
      .required("Required"),
    targetWeight: Yup.string()
      .test("is-number", "Must be a valid number", (value) => {
        if (!value) return false;
        return !isNaN(Number(value));
      })
      .test("is-positive", "Must be positive", (value) => {
        if (!value) return false;
        return Number(value) > 0;
      })
      .required("Required"),
    activityLevel: Yup.mixed<HealthMetrics["activityLevel"]>()
      .oneOf(["low", "moderate", "active", "veryActive", ""])
      .required("Required"),
  }) as Yup.ObjectSchema<Partial<HealthMetrics>>;

  const healthMetricsInitialValues: HealthMetrics = {
    height: height || "",
    currentWeight: currentWeight || "",
    targetWeight: targetWeight || "",
    activityLevel: (activityLevel as HealthMetrics["activityLevel"]) || "",
  };

  const healthMetricsEditableConfig = {
    height: false,
    currentWeight: true,
    targetWeight: true,
    activityLevel: true,
  };
  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-gray-100 px-4 flex flex-col items-center">
      {/* <h1 className="text-3xl font-semibold text-black my-6">User Profile</h1> */}

      <div className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-md my-6">
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
        {/* Personal Information Section */}
        <div className="w-full mb-6 border relative border-gray-100 rounded-lg p-4 shadow-sm">
          <p className="text-gray-900  mb-6 text-xl font-bold">
            Personal Information
          </p>
          <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-700">
            <div>
              <p className="font-medium text-lg text-gray-500">Full Name</p>
              <p className="text-sm">{`${firstName} ${lastName}`}</p>
            </div>
            {/* <div>
              <p className="font-medium text-lg text-gray-500">Email</p>
              <p className="text-sm">{email}</p>
            </div> */}
            <div>
              <p className="font-medium text-lg text-gray-500">Gender</p>
              <p className="text-sm capitalize">{gender}</p>
            </div>
            <div>
              <p className="font-medium text-lg text-gray-500">Date of Birth</p>
              <p className="text-sm">{dob}</p>
            </div>
            <div>
              <p className="font-medium text-lg text-gray-500">Phone</p>
              <p className="text-sm capitalize">
                {typeof phone === "string" && phone.trim()
                  ? phone
                  : "Not Provided"}
              </p>
            </div>
            {/* Bio row spans full width */}
            <div className="md:col-span-2">
              <p className="font-medium text-lg text-gray-500">Bio</p>
              <p className="text-sm">
                {
                  <span className="text-gray-400 italic">
                    {bio || "Not Provided"}
                  </span>
                }
              </p>
            </div>
          </div>
          <EditableSection<PersonalInfo>
            title="Personal Information"
            fields={[
              { name: "fullName", label: "Full Name" },
              { name: "gender", label: "Gender" },
              { name: "dateOfBirth", label: "Date of Birth" },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "bio", label: "Bio", type: "textarea" },
            ]}
            initialValues={initialValues}
            validationSchema={personalInfoSchema}
            editableConfig={editableConfig}
            onSave={async (values) => {
              console.log("Saved:", values);
              const updates = await updateEditableFields(
                "users",
                userData.uid,
                values,
                initialValues,
                editableConfig
              );

              dispatch(updateUserProfile(updates));
            }}
          />
        </div>
        {/* health Metrics Section */}
        <div className="w-full mb-6 border relative border-gray-100 rounded-lg p-4 shadow-sm">
          <p className="text-gray-900  mb-6 text-xl font-bold">
            Health Information
          </p>
          <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-700">
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
              <p className="font-medium text-sm text-gray-500">
                Activity Level
              </p>
              <p className="text-lg capitalize">{activityLevel}</p>
            </div>
          </div>
          <EditableSection<HealthMetrics>
            title="Health Information"
            fields={[
              { name: "height", label: "Height" },
              { name: "currentWeight", label: "Current Weight" },
              { name: "targetWeight", label: "Target Weight" },
              {
                name: "activityLevel",
                label: "Activity Level",
                type: "select",
                options: [
                  { value: "low", label: "Low" },
                  { value: "moderate", label: "Moderate" },
                  { value: "active", label: "Active" },
                  { value: "veryActive", label: "Very Active" },
                ],
              },
            ]}
            initialValues={healthMetricsInitialValues}
            validationSchema={healthMetricsSchema}
            editableConfig={healthMetricsEditableConfig}
            onSave={async (values) => {
              console.log("Saved:", values);
              const updates = await updateEditableFields(
                "users",
                userData.uid,
                values,
                healthMetricsInitialValues,
                healthMetricsEditableConfig
              );
              console.log(updates);
              dispatch(updateUserProfile(updates));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
