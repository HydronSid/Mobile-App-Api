const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
    password
  );

const validateSignUpData = async (data, User) => {
  const { email, password, name, mobile } = data;
  const errors = {};

  //* Validate mobile
  if (!name) {
    errors.name = ["The Name field is required."];
  } else if (name.length < 3) {
    errors.name = ["Name should be more than or equal to 3 characters long."];
  }

  //* Validate name
  if (!mobile) {
    errors.mobile = ["The Mobile field is required."];
  } else if (mobile.length < 10) {
    errors.mobile = ["Mobile should be 10 digits long."];
  }

  //* Validate email
  if (!email) {
    errors.email = ["The Email field is required."];
  } else if (!validateEmail(email)) {
    errors.email = ["Invalid Email."];
  } else {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = ["Email already exists."];
    }
  }

  //* Validate password
  if (!password) {
    errors.password = ["The password field is required."];
  } else if (!validatePassword(password)) {
    errors.password = [
      "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    ];
  }

  return errors;
};

module.exports = { validateEmail, validatePassword, validateSignUpData };
