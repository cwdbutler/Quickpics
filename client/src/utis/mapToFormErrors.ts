import { FieldError } from "../graphql/generated/graphql";
// maps server error response to Formik errors for displaying validation
export const mapToFormErrors = (errors: FieldError[]) => {
  const formErrors: Record<string, string> = {}; // Formik errors are this type
  errors.forEach(({ field, message }) => {
    formErrors[field] = message;
  });

  return formErrors;
};
