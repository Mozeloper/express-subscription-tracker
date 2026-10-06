import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  deleleSubscription,
  getAllSubcriptions,
  getUserSubcriptionDetails,
  getUserSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getAllSubcriptions);

subscriptionRouter.get("/:id", authorize, getUserSubcriptionDetails);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleleSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ message: "GET upcoming renewals" }),
);

export default subscriptionRouter;
