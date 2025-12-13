import { Router } from "express"
import { userAuth } from "../middlewares/auth.js"
import ConnectionRequest from "../models/connectionRequest.js"
import User from "../models/user.js"
const userRouter = Router()

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "like",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .lean()
    if (connectionRequests.length === 0)
      return res.json({ message: "No new connection requests" })
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    })
  } catch (err) {
    return res.status(400).send("ERROR : ", err.message)
  }
})

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_SAFE_DATA)

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId
      else return row.fromUserId
    })

    res.json({ data })
  } catch (err) {
    return res.status(400).json({ "ERROR : ": err.message })
  }
})

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId")

    const hideFromFeed = new Set()
    connectionRequests.forEach((req) => {
      hideFromFeed.add(req.fromUserId.toString())
      hideFromFeed.add(req.toUserId.toString())
    })
    console.log(hideFromFeed)

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(users)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

export default userRouter
