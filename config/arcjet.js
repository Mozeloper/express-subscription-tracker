import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "../config/env.js";

const isDevelopment = NODE_ENV !== "production";

const aj = arcjet({
  // Get your site key from https://console.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ARCJET_KEY,
  //   characteristics: ["ip.src"], // Track user IP addresses
  rules: [
    // Shield protects your app from common attacks such as SQL injection
    shield({
      mode: isDevelopment ? "DRY_RUN" : "LIVE",
    }),
    // Create a bot detection rule
    detectBot({
      mode: isDevelopment ? "DRY_RUN" : "LIVE", // Blocks requests. Use "DRY_RUN" to log only // LIVE/DRY_RUN
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        ...(isDevelopment ? ["POSTMAN"] : []),
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews such as Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      characteristics: ["ip.src"], // Track user IP addresses
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
