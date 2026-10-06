import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => res.send({ message: "CREATE new user" }));

userRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATE user details" }),
);

userRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETE user details" }),
);

export default userRouter;
