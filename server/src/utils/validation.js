import validator from "validator"

export const validateSignUpData = (req) => {
  const { firstName, password } = req.body
  if (!firstName) throw new Error("Please enter a first name")
  if (!password) throw new Error("Please enter a password")
  else if (firstName.length < 3 && firstName.length > 64)
    throw new Error("First name must be between 4-64 characters long")
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password")
  }
}

export const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ]
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
  return isEditAllowed;
}
