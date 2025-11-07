// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Name validation regex (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (!NAME_REGEX.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(field => {
    switch (field) {
      case 'email':
        errors.email = validateEmail(fields.email);
        break;
      case 'password':
        errors.password = validatePassword(fields.password);
        break;
      case 'confirmPassword':
        errors.confirmPassword = validateConfirmPassword(fields.password, fields.confirmPassword);
        break;
      case 'name':
      case 'displayName':
        errors[field] = validateName(fields[field]);
        break;
      default:
        break;
    }
  });
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return errors;
};
