import { useState } from 'react';

interface CheckboxItem {
  label: string;
  checked: boolean;
  required: boolean;
}

interface SignupFields {
  name: string;
  id: string;
  password: string;
  phone: string;
}

export const useSignupValidation = (
  checkboxes: CheckboxItem[],
  fields: SignupFields,
) => {
  const [showError, setShowError] = useState({
    checkboxError: false,
    nameError: false,
    idError: false,
    passwordError: false,
    phoneError: false
  });

  const validateCheckboxes = () => {
    const requiredUnchecked = checkboxes.some(
      (checkbox) => checkbox.required && !checkbox.checked,
    );

    const nameError = fields.name.length < 2;
    const idError = fields.id.length < 8;
    const passwordError =
      fields.password.length < 8 ||
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/.test(fields.password);
    const phoneRegex = /^010\d{8}$/;
    const phoneError = !phoneRegex.test(fields.phone);

    if (requiredUnchecked || nameError || idError || passwordError || phoneError) {
      setShowError({
        checkboxError: requiredUnchecked,
        nameError,
        idError,
        passwordError,
        phoneError,
      });
      return false;
    }

    setShowError({
      checkboxError: false,
      nameError: false,
      idError: false,
      passwordError: false,
      phoneError: false,
    });
    return true;
  };

  return { showError, validateCheckboxes };
};
