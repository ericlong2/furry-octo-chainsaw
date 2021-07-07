export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 10)
    return 'Password must be at least 10 characters long.'
  return ''
}
