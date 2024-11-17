export const phoneValidation = (value, helpers) => {
  if (!value) return value;

  if (
    (/^234\d{10}$/.test(value) && value.length === 13) ||
    (/^\+234\d{10}$/.test(value) && value.length === 14) ||
    (/^(?!234|(\+234))\d{11}$/.test(value) && value.length === 11)
  ) {
    return value;
  }
  return helpers.message("Enter a valid phone number");
};
