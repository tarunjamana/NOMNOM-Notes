# Multi-Step Signup Form with Formik, Yup, and Firebase

This document explains a multi-step signup form implemented using **Formik**, **Yup**, **React**, and **Firebase Authentication**. The form is designed to:

- Handle user input step-by-step.
- Validate fields for each step individually.
- Submit the user data to Firebase.
- Show meaningful error messages and handle navigation.

---

## Table of Contents

- [Component Purpose](#component-purpose)
- [State Management](#state-management)
- [Initial Values](#initial-values)
- [Validation Schemas](#validation-schemas)
- [Firebase Submission](#firebase-submission)
- [Styling](#styling)
- [Render Logic](#render-logic)
- [Formik Setup](#formik-setup)
- [Form Navigation](#form-navigation)
- [Summary](#summary)
- [Suggested Improvements](#suggested-improvements)

---

## Component Purpose

The `Signup` component provides a user-friendly multistep form that progressively collects user details and registers them using Firebase.

### Technologies Used

- React (Functional Component + Hooks)
- Formik (Form state handling)
- Yup (Schema validation)
- Firebase Auth
- Redux (for setting logged-in user)
- React Router (for navigation)

---

## State Management

```tsx
const [step, setStep] = useState(1);
const [errorMessage, setErrorMessage] = useState("");
const [submitted, setSubmitted] = useState(false);
```

- `step`: Current form step (1 to 5).
- `errorMessage`: Stores Firebase error messages.
- `submitted`: Triggers validation display when user submits the form.

---

## Initial Values

```tsx
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
```

Represents all fields used across 5 steps of the form.

---

## Validation Schemas

Each step uses a corresponding Yup schema.

```tsx
const stepSchemas: Yup.ObjectSchema<any>[] = [
  Yup.object({ firstName, lastName }),
  Yup.object({ gender, dob }),
  Yup.object({ height, currentWeight, targetWeight }),
  Yup.object({ activityLevel }),
  Yup.object({ email, password }),
];
```

Each schema ensures the required fields are validated at the correct step only.

---

## Firebase Submission

```tsx
const handleSubmit = (values, helpers) => {
  createUserWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) => {
      dispatch(setUser(...));
      return updateProfile(...);
    })
    .then(() => navigate("/home"))
    .catch((error) => {
      setErrorMessage(...);
      helpers.setFieldValue("email", "");
      helpers.setFieldValue("password", "");
    });
};
```

- Creates user with Firebase Auth.
- Sets the user in Redux.
- Redirects on success.
- Displays error messages on failure.

---

## Styling (Tailwind)

```tsx
const fieldClasses = "...";
const labelClasses = "...";
const errorClasses = "...";
```

Used consistently to keep the UI clean and responsive.

---

## Render Logic

```tsx
const renderStep = (touched, errors) => {
  const showError = (field) => (touched[field] || submitted) && errors[field];

  switch (step) {
    case 1: return FirstName + LastName fields
    case 2: return Gender + DOB fields
    case 3: return Height + Weight fields
    case 4: return Activity dropdown
    case 5: return Email + Password
  }
};
```

Renders fields relevant to the current step. `showError` controls error message visibility.

---

## Formik Setup

```tsx
<Formik
  initialValues={initialValues}
  validationSchema={stepSchemas[step - 1]}
  onSubmit={(values, helpers) => {
    setSubmitted(true);

    if (step === 5) {
      handleSubmit(values, helpers);
    } else {
      helpers.validateForm().then((errors) => {
        const stepFields = Object.keys(stepSchemas[step - 1].fields);
        const hasStepErrors = stepFields.some(
          (field) => errors[field]
        );

        if (hasStepErrors) {
          const touchedFields = {};
          stepFields.forEach((field) => {
            touchedFields[field] = true;
          });
          helpers.setTouched(touchedFields, true);
        } else {
          setSubmitted(false);
          setStep((prev) => prev + 1);
        }
      });
    }
  }}
>
```

Validates current step before proceeding. Displays errors by marking fields as touched.

---

## Form Navigation

```tsx
{step > 1 && <Back button>}
<Submit/Next button>
```

Buttons allow step-based navigation. Submission only happens on the last step.

---

## Summary Table

| Step | Fields                      | Validation                    |
| ---- | --------------------------- | ----------------------------- |
| 1    | First Name, Last Name       | Required                      |
| 2    | Gender, DOB                 | Gender + past date validation |
| 3    | Height, Current & Target Wt | Numbers + positive + required |
| 4    | Activity Level              | One of predefined options     |
| 5    | Email, Password             | Format + min 6 char password  |

---

## Suggested Improvements

- Save state in localStorage to persist across reloads.
- Add progress bar (e.g. Step 2 of 5).
- Auto-focus on the first invalid field.
- Disable next button while validating.
- Add link to switch to login for existing users.

---

## Final Note

This component is well-structured and scalable. You can even extract it into a reusable multi-step wizard with `children` or `step configs` if needed.
