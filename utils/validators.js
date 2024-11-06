const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
    password
  );

const nameValidator = (name, errors) => {
  //* Validate name
  if (!name) {
    errors.name = ["The Name field is required."];
  } else if (name.length < 3) {
    errors.name = ["Name should be more than or equal to 3 characters long."];
  }

  return errors;
};

const mobileValidator = (mobile, errors) => {
  //* Validate mobile
  if (!mobile) {
    errors.mobile = ["The Mobile field is required."];
  } else if (mobile.length < 10) {
    errors.mobile = ["Mobile should be 10 digits long."];
  }

  return errors;
};

const emailValidator = async (email, errors, User = null) => {
  //* Validate email
  if (!email) {
    errors.email = ["The Email field is required."];
  } else if (!validateEmail(email)) {
    errors.email = ["Invalid Email."];
  } else if (User) {
    // Only check for existing email if User is provided
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = ["Email already exists."];
    }
  }

  return errors;
};

const passwordValidator = (password, errors, key) => {
  //* Validate password
  if (!password) {
    errors[key] = ["The password field is required."];
  } else if (!validatePassword(password)) {
    errors[key] = [
      "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    ];
  }

  return errors;
};

const validateSignUpData = async (data, User) => {
  const { email, password, name, mobile } = data;
  let errors = {};
  errors = nameValidator(name, errors);
  errors = mobileValidator(mobile, errors);
  errors = passwordValidator(password, errors, "password");
  errors = emailValidator(email, errors, User);

  return errors;
};

const validateSignInData = async (data) => {
  const { email, password } = data;
  let errors = {};
  errors = passwordValidator(password, errors, "password");
  errors = emailValidator(email, errors);

  return errors;
};

const validateChangePassword = async (data) => {
  const { old_passsword, new_password } = data;
  let errors = {};
  errors = passwordValidator(old_passsword, errors, "old_passsword");
  errors = passwordValidator(new_password, errors, "new_password");

  return errors;
};

module.exports = {
  validateSignUpData,
  validateSignInData,
  validateChangePassword,
};
