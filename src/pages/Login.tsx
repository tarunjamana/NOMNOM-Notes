import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { LoginFormValues } from "../types/form";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/userSlice";
import { getFirebaseSignInAuthErrorMessage } from "../utils/firebaseAuthUtils";
import FormError from "../components/FormError";
import { signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const fieldClasses =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";

  const handleSubmit = (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>
  ) => {
    const { setFieldValue } = formikHelpers;

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;

        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName ?? "",
            firstName: user.displayName?.split(" ")[0] ?? "",
            lastName: user.displayName?.split(" ")[1] ?? "",
            email: user.email ?? values.email,
            isLoggedIn: true,
          })
        );
      })
      .then(() => {
        console.log("User logged in successfully");

        navigate("/home");
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        const errorMessage = getFirebaseSignInAuthErrorMessage(error.code);
        setErrorMessage(errorMessage);
        setFieldValue("email", "");
        setFieldValue("password", "");
      });
  };

  return (
    <>
      {errorMessage && <FormError message={errorMessage} />}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={(values, formikHelpers) => {
          formikHelpers.validateForm().then((errors) => {
            const fieldNames = Object.keys(loginSchema.fields);
            const hasErrors = fieldNames.some(
              (field) => errors[field as keyof LoginFormValues]
            );

            if (hasErrors) {
              const touchedFields: Partial<
                Record<keyof LoginFormValues, boolean>
              > = {};
              fieldNames.forEach((field) => {
                touchedFields[field as keyof LoginFormValues] = true;
              });

              formikHelpers.setTouched(touchedFields, true);
            } else {
              console.log("Form is valid:", values);
              handleSubmit(values, formikHelpers);
            }
          });
        }}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="mb-4">
              <label className={labelClasses}>Email</label>
              <Field className={fieldClasses} type="email" name="email" />
              {touched.email && errors.email && (
                <div className={errorClasses}>{errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClasses}>Password</label>
              <Field className={fieldClasses} type="password" name="password" />
              {touched.password && errors.password && (
                <div className={errorClasses}>{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-auto"
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
