export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

export const validateFirstName = (firstName: string): string | null => {
  if (firstName.trim() === "") {
    return "First name is required";
  }
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regex.test(firstName)) {
    return "First name cannot contain numbers or symbols";
  }
  return null;
};

export const validateLastName = (lastName: string): string | null => {
  if (lastName.trim() === "") {
    return "Last name is required";
  }
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regex.test(lastName)) {
    return "Last name cannot contain numbers or symbols";
  }
  return null;
};
