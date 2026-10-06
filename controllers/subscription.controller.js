import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/uptash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });
    res
      .status(201)
      .json({ success: true, data: { ...subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getUserSubcriptionDetails = async (req, res, next) => {
  const id = req.params.id;
  try {
    const subscriptionDetails = await Subscription.findById(id);
    if (!subscriptionDetails) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    // const isOwner = subscriptionDetails.user.toString() === req.user.id.toString();
    const isOwner = subscriptionDetails.user.equals(req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this subscription",
      });
    }
    res.status(200).json({ success: true, data: subscriptionDetails });
    next();
  } catch (error) {
    next(error);
  }
};

export const getAllSubcriptions = async (_, res, next) => {
  try {
    const allSubcriptions = await Subscription.find();
    return res.status(200).json({
      success: true,
      data: allSubcriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod, category, frequency } = req.body;
    const sub = await Subscription.findById(id);
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    const isOwner = sub.user.equals(req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this subscription",
      });
    }
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        paymentMethod,
        category,
        frequency,
      },
      { new: true, runValidators: true },
    );
    const { name } = updatedSubscription;
    return res.status(200).json({
      success: true,
      message: `${name} Subscription updated successfully`,
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleleSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.findById(id);
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    const isOwner = sub.user.equals(req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this subscription",
      });
    }
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      messsage: `${deletedSubscription.name} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.findById(id);
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    const isOwner = sub.user.equals(req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this subscription",
      });
    }
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        status: "canceled",
        renewalDate: null,
      },
      // { new: true, runValidators: true },
    );
    const { name } = updatedSubscription;
    return res.status(200).json({
      success: true,
      message: `${name} Subscription canceled successfully`,
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};
