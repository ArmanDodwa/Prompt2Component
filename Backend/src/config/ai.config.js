import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Missing GOOGLE_API_KEY in environment variables.");
}

// Common configuration shared across all tiers
const baseConfig = {
  temperature: 0.2,
  apiKey,
  maxRetries: 2,
};

// Layer 1: Primary Workhorse (Verified active, lowest latency, highest general stability)
const layer1_Flash = new ChatGoogleGenerativeAI({
  ...baseConfig,
  model: "gemini-2.5-flash",
});

// Layer 2: Fast Shedding Fallback (Alternative cluster, lowest token-cost and queue saturation)
const layer2_FlashLite = new ChatGoogleGenerativeAI({
  ...baseConfig,
  model: "gemini-2.5-flash-lite",
});

// Layer 3: High-Capacity Reasoning (Routes to Pro compute pools if Flash clusters saturate)
const layer3_Pro = new ChatGoogleGenerativeAI({
  ...baseConfig,
  model: "gemini-2.5-pro",
});

// Layer 4: Dynamic Alias Track (Auto-resolves to Google's current production flash endpoint)
const layer4_FlashLatest = new ChatGoogleGenerativeAI({
  ...baseConfig,
  model: "gemini-flash-latest",
});

// Layer 5: High-Order Fallback (Next-gen frontier model to absorb downstream failures)
const layer5_Advanced = new ChatGoogleGenerativeAI({
  ...baseConfig,
  model: "gemini-3.5-flash",
});

/**
 * 5-Layer Resilient LLM Runnable.
 * Automatically catches 503, 429, and network timeouts from Layer 1
 * and cascades down Layer 2 -> Layer 3 -> Layer 4 -> Layer 5.
 */
export const llm = layer1_Flash.withFallbacks([
  layer2_FlashLite,
  layer3_Pro,
  layer4_FlashLatest,
  layer5_Advanced,
]);