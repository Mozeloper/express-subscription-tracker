import { createRequire } from "module";
import dayjs from "dayjs";

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const require = createRequire(import.meta.url);

const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubcription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore()) {
    console.log(
      `Renawal date has passed for subscription ${subscriptionId}. stopping workflow`,
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    // renewal date = 22 feb, reminder date = 15 feb, 17, 20, 21.
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      // sleep function
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate,
      );
    }
    // trigger function
    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription,
      );
    }
  }
});

const fetchSubcription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });

  // Send email, SMS push notification...
};
