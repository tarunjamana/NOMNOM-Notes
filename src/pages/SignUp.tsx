import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  FormikHelpers,
  FormikErrors,
  FormikTouched,
} from "formik";
import * as Yup from "yup";
import { SignupFormValues } from "../types/form";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/userSlice";
import { getFirebaseSignUpAuthErrorMessage } from "../utils/firebaseAuthUtils";
import FormError from "../components/FormError";
import { doc, setDoc, setLogLevel } from "firebase/firestore";
import { db } from "../utils/firebase";

const Signup = () => {
  const [step, setStep] = useState(1);

  const [errorMessage, setErrorMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  setLogLevel("debug");
  const initialValues: SignupFormValues = {
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    activityLevel: "",
    email: "",
    password: "",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stepSchemas: Yup.ObjectSchema<any>[] = [
    // Step 1: Name
    Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
    }),

    // Step 2: Gender & DOB
    Yup.object({
      gender: Yup.string()
        .oneOf(["male", "female", "other"], "Invalid gender")
        .required("Gender is required"),
      dob: Yup.string()
        .required("Date of birth is required")
        .test("is-valid-date", "DOB must be a valid past date", (value) => {
          if (!value) return false;
          const date = new Date(value);
          return (
            date instanceof Date && !isNaN(date.getTime()) && date < new Date()
          );
        }),
    }),

    // Step 3: Height & Weights
    Yup.object({
      height: Yup.number()
        .typeError("Height must be a number")
        .positive("Height must be positive")
        .required("Height is required"),
      currentWeight: Yup.number()
        .typeError("Current weight must be a number")
        .positive("Current weight must be positive")
        .required("Current weight is required"),
      targetWeight: Yup.number()
        .typeError("Target weight must be a number")
        .positive("Target weight must be positive")
        .required("Target weight is required"),
    }),

    // Step 4: Activity Level
    Yup.object({
      activityLevel: Yup.string()
        .oneOf(
          ["low", "moderate", "active", "veryActive"],
          "Invalid activity level"
        )
        .required("Activity level is required"),
    }),

    // Step 5: Email & Password
    Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
  ];

  const handleSubmit = (
    values: SignupFormValues,
    formikHelpers: FormikHelpers<SignupFormValues>
  ) => {
    console.log("Form submitted:", values);
    const { setFieldValue } = formikHelpers;
    // sign up the user with Firebase
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed up:", user);
        // Update the user's profile with first and last name
        dispatch(
          setUser({
            uid: user.uid,
            displayName: `${values.firstName} ${values.lastName}`,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            isLoggedIn: true,
          })
        );
        return Promise.all([
          updateProfile(user, {
            displayName: `${values.firstName} ${values.lastName}`,
          }),
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dob: values.dob,
            height: values.height,
            currentWeight: values.currentWeight,
            targetWeight: values.targetWeight,
            activityLevel: values.activityLevel,
            email: values.email,
            createdAt: new Date().toISOString(),
          }).catch((firestoreError) => {
            console.error("Error writing to Firestore:", firestoreError);
          }),
        ]);
      })
      .then(() => {
        console.log("User signed up and profile updated successfully");
        // You can redirect or show a success message here
        navigate("/home"); // Redirect to home page after successful signup
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        const errorMessage = getFirebaseSignUpAuthErrorMessage(error.code);
        setErrorMessage(errorMessage);
        setFieldValue("email", "");
        setFieldValue("password", "");
        // Handle errors here, e.g., show an error message to the user
      });
  };

  const fieldClasses =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";

  const renderStep = (
    touched: FormikTouched<SignupFormValues>,
    errors: FormikErrors<SignupFormValues>
  ) => {
    const showError = (field: keyof SignupFormValues) =>
      (touched[field] || submitted) && errors[field];
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label className={labelClasses}>First Name</label>
              <Field name="firstName" className={fieldClasses} />
              {showError("firstName") && (
                <div className={errorClasses}>{errors.firstName}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Last Name</label>
              <Field name="lastName" className={fieldClasses} />
              {showError("lastName") && (
                <div className={errorClasses}>{errors.lastName}</div>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label className={labelClasses}>Gender</label>
              <Field className={fieldClasses} as="select" name="gender">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              {showError("gender") && (
                <div className={errorClasses}>{errors.gender}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>DOB</label>
              <Field type="date" name="dob" className={fieldClasses} />
              {showError("dob") && (
                <div className={errorClasses}>{errors.dob}</div>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-4">
              <label className={labelClasses}>Height (cm)</label>
              <Field className={fieldClasses} name="height" />
              {showError("height") && (
                <div className={errorClasses}>{errors.height}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Current Weight (kg)</label>
              <Field className={fieldClasses} name="currentWeight" />
              {showError("currentWeight") && (
                <div className={errorClasses}>{errors.currentWeight}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Target Weight (kg)</label>
              <Field name="targetWeight" className={fieldClasses} />
              {showError("targetWeight") && (
                <div className={errorClasses}>{errors.targetWeight}</div>
              )}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mb-4">
              <label className={labelClasses}>Activity Level</label>
              <Field as="select" name="activityLevel" className={fieldClasses}>
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </Field>
              {showError("activityLevel") && (
                <div className={errorClasses}>{errors.activityLevel}</div>
              )}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="mb-4">
              <label className={labelClasses}>Email</label>
              <Field className={fieldClasses} type="email" name="email" />
              {showError("email") && (
                <div className={errorClasses}>{errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Password</label>
              <Field className={fieldClasses} type="password" name="password" />
              {showError("password") && (
                <div className={errorClasses}>{errors.password}</div>
              )}
            </div>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      {errorMessage && step === 5 && <FormError message={errorMessage} />}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Signup - Step {step}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={stepSchemas[step - 1]}
        onSubmit={(values, formikHelpers) => {
          setSubmitted(true);

          if (step === 5) {
            handleSubmit(values, formikHelpers);
          } else {
            formikHelpers.validateForm().then((errors) => {
              const stepFields = Object.keys(stepSchemas[step - 1].fields);
              const hasStepErrors = stepFields.some(
                (field) => errors[field as keyof SignupFormValues]
              );

              if (hasStepErrors) {
                // 👇 Mark all step fields as touched so their errors show
                const touchedFields: Partial<{
                  [K in keyof SignupFormValues]: boolean;
                }> = {};
                stepFields.forEach((field) => {
                  touchedFields[field as keyof SignupFormValues] = true;
                });

                formikHelpers.setTouched(touchedFields, true); // second arg means "shouldValidate"
              } else {
                setSubmitted(false);
                setStep((prev) => prev + 1);
              }
            });
          }
        }}
      >
        {/* Formik render prop to handle form submission and rendering */}
        {({ touched, errors }) => (
          <Form>
            {renderStep(touched, errors)}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-auto"
              >
                {step === 5 ? "Submit" : "Next"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
