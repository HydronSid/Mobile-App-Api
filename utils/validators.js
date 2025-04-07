const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&^]{8,15}$/.test(
    password
  );

// Helper for required fields
const requiredField = (value, field) => {
  return !value ? [`The ${field} field is required.`] : [];
};

// Name Validator
const nameValidator = (name, errors) => {
  if (!name) {
    errors.name = ["The Name field is required."];
  } else if (name.length < 3) {
    errors.name = ["Name should be more than or equal to 3 characters long."];
  }
  return errors;
};

// Mobile Validator
const mobileValidator = async (mobile, errors, User = null) => {
  if (!mobile) {
    errors.mobile = ["The Mobile field is required."];
  } else if (mobile.length < 10) {
    errors.mobile = ["Mobile should be 10 digits long."];
  } else if (User) {
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      errors.mobile = ["Mobile already exists."];
    }
  }
  return errors;
};

// Email Validator
const emailValidator = async (email, errors, User = null) => {
  if (!email) {
    errors.email = ["The Email field is required."];
  } else if (!validateEmail(email)) {
    errors.email = ["Invalid Email."];
  } else if (User) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = ["Email already exists."];
    }
  }
  return errors;
};

// Password Validator
const passwordValidator = (password, errors, key) => {
  if (!password) {
    errors[key] = ["The password field is required."];
  } else if (!validatePassword(password)) {
    errors[key] = [
      "Password must be 8–15 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    ];
  }
  return errors;
};

// Signup Validator
const validateSignUpData = async (data, User) => {
  const { email, password, name, mobile } = data;
  let errors = {};
  errors = nameValidator(name, errors);
  errors = await mobileValidator(mobile, errors, User);
  errors = await emailValidator(email, errors, User);
  errors = passwordValidator(password, errors, "password");
  return errors;
};

// Signin Validator
const validateSignInData = async (data) => {
  const { email, password } = data;
  let errors = {};
  errors = await emailValidator(email, errors);
  errors = passwordValidator(password, errors, "password");
  return errors;
};

// Change Password Validator
const validateChangePassword = async (data) => {
  const { old_password, new_password } = data;
  let errors = {};
  errors = passwordValidator(old_password, errors, "old_password");
  errors = passwordValidator(new_password, errors, "new_password");
  return errors;
};

// Category Validator
const validateCreateCategory = async (data, Category) => {
  const { name } = data;
  let errors = {};

  if (!name) {
    errors.name = ["Category name is required."];
  } else {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      errors.name = ["Category with this name already exists."];
    }
  }
  return errors;
};

module.exports = {
  validateSignUpData,
  validateSignInData,
  validateChangePassword,
  validateCreateCategory,
};
