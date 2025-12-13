import express, { request } from "express"
import mongoose from "mongoose"
const requestRouter = express.Router()

import { userAuth } from "../middlewares/auth.js"
import User from "../models/user.js"
import ConnectionRequest from "../models/connectionRequest.js"

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    console.log("SEND endpoint hit by:", req.user._id) // confirm route
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    console.log("toUserId param:", toUserId)

    // validate ObjectId first
    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({ message: "Invalid user id format" })
    }

    // prevent self-like
    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" })
    }

    // safe fetch
    const toUser = await User.findById(toUserId).select("+_id firstName") // minimal fetch
    console.log("toUser (db result):", toUser) // will log null if not found

    if (!toUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const allowedStatus = ["like", "pass"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      })
    }

    // if there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId }, // You -> Them
        { fromUserId: toUserId, toUserId: fromUserId }, // Them -> You
      ],
    })

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection Request Already Exists!" })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connectionRequest.save()
    res.json({
      message: `${req.user.firstName} gave ${toUser.firstName} a ${status}.`,
      data,
    })
  } catch (err) {
    console.error("Send endpoint error:", err)
    return res.status(500).json({ message: "Server error", error: err.message })
  }
})

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { status, requestId } = req.params
    const allowedStatus = ["accepted", "rejected"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Status: ${status} not allowed` })
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "like",
    })
    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found" })
    }
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.json({ message: `Connection request ${status}`, data })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

export default requestRouter
