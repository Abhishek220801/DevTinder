import express from "express"
import { validateProfileEditData } from "../utils/validation.js"
import bcrypt from "bcrypt"
import validator from "validator"
const profileRouter = express.Router()

import { userAuth } from "../middlewares/auth.js"
import upload from "../middlewares/upload.js"

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

profileRouter.patch(
  "/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!validateProfileEditData(req)) {
        return res.status(400).json({ message: "Invalid Edit Request" })
      }
      const loggedInUser = req.user
      const updates = req.body || {}
      // Reject empty update
      if (Object.keys(updates).length === 0 && !req.file) {
        return res.status(400).json({ message: "No fields provided" })
      }
      if(updates.skills && typeof updates.skills === 'string'){
        try{
          updates.skills = JSON.parse(updates.skills);
        } catch (e) {
          updates.skills = []
        }
      }
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          loggedInUser[key] = updates[key]
        }
      })
      if (req.file) {
        loggedInUser.photoUrl = `/uploads/${req.file.filename}`
      }
      await loggedInUser.save()
      return res.json({
        message: `${loggedInUser.firstName}, your profile was updated successfully!`,
        data: loggedInUser,
          })
    } catch (err) {
      return res.status(400).json({
        message: err.message || "Edit request failed",
      })
    }
  }
)

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    // console.log(req);
    const { currentPassword, newPassword } = req.body
    // console.log('Current password: ', currentPassword + '\nHashed pass: ', loggedInUser.password);
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    )
    if (!isPasswordValid)
      throw new Error("Please enter correct current password")
    if (!validator.isStrongPassword(newPassword))
      throw new Error("Please enter a strong password")
    loggedInUser.password = newPassword
    await loggedInUser.save()
    return res.json({
      message: "Password updated successfully",
    })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

export default profileRouter
