import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { FiEdit2, FiX } from "react-icons/fi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as Yup from "yup";

type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "textarea" | "tel" | "select" | "date";
  options?: { value: string; label: string }[];
};

type EditableSectionProps<T extends Record<string, any>> = {
  title: string;
  fields: FieldConfig<T>[];
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<Partial<T>>;
  editableConfig: Record<keyof T, boolean>;
  onSave: (values: T) => Promise<void> | void;
};

export const EditableSection = <T extends Record<string, any>>({
  title,
  fields,
  initialValues,
  validationSchema,
  editableConfig,
  onSave,
}: EditableSectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values: T, actions: FormikHelpers<T>) => {
    try {
      await onSave(values);
      setIsOpen(false);
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="absolute top-5 right-6">
      <div className="flex justify-between items-center mb-4">
        {/* <h3 className="text-lg font-semibold text-gray-800">{title}</h3> */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 
                     rounded-full border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 
                     transition-colors duration-200"
        >
          <FiEdit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      {/* Edit Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Edit {title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  isSubmitting,
                  isValid,
                  errors,
                  touched,
                  values,
                  setFieldValue,
                }) => (
                  <Form className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.name.toString()}>
                        <label
                          htmlFor={field.name.toString()}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {field.label}
                        </label>

                        {!editableConfig[field.name] ? (
                          <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
                            {values[field.name] ||
                              `No ${field.label.toLowerCase()} provided`}
                          </div>
                        ) : field.type === "tel" ? (
                          <div
                            className={`border rounded-md ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <PhoneInput
                              international
                              defaultCountry="IN"
                              value={values[field.name] as string}
                              onChange={(value) =>
                                setFieldValue(field.name.toString(), value)
                              }
                              className="w-full p-2 bg-transparent"
                            />
                          </div>
                        ) : field.type === "select" ? (
                          <Field
                            as="select"
                            name={field.name.toString()}
                            className={`w-full px-3 py-2 border rounded-md ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        ) : (
                          <Field
                            name={field.name.toString()}
                            as={
                              field.type === "textarea" ? "textarea" : "input"
                            }
                            type={field.type || "text"}
                            disabled={!editableConfig[field.name]}
                            className={`w-full px-3 py-2 border rounded-md ${
                              editableConfig[field.name]
                                ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                : "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                            } ${
                              errors[field.name] && touched[field.name]
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder={
                              editableConfig[field.name]
                                ? `Enter ${field.label.toLowerCase()}`
                                : "Cannot be edited"
                            }
                            rows={field.type === "textarea" ? 4 : undefined}
                          />
                        )}

                        {errors[field.name] && touched[field.name] && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors[field.name] as string}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          isSubmitting || !isValid
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
