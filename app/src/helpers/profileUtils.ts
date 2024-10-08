export const validateOldPassword = (password: string): string | null => {
  if (password.length < 6) {
    return "The old password must be at least 6 characters long.";
  }
  return null;
};

export const validateNewPassword = (
  newPassword: string,
  oldPassword: string
): string | null => {
  if (newPassword.length < 6) {
    return "The new password must be at least 6 characters long.";
  }
  if (newPassword === oldPassword) {
    return "The new password cannot be the same as the old password.";
  }
  return null;
};

export const validateConfirmPassword = (
  newPassword: string,
  confirmPassword: string
): string | null => {
  if (confirmPassword !== newPassword) {
    return "The passwords do not match.";
  }
  return null;
};
