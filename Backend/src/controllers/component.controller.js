import { componentGraph } from "../services/ai/graph.js";
import Component from "../models/component.model.js";

/**
 * Streams real-time generation steps from LangGraph via Server-Sent Events (SSE)
 * Route: POST /api/components/generate
 */
export const generateComponentStream = async (req, res) => {
  const { prompt } = req.body;

  // Set SSE streaming headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ status: "connected", message: "Agent pipeline initialized." })}\n\n`);

  try {
    const stream = await componentGraph.stream({
      userPrompt: prompt,
      plan: null,
      code: "",
      errorLogs: [],
      iterationCount: 0,
      isValid: false,
    });

    for await (const chunk of stream) {
      const [nodeName, nodeOutput] = Object.entries(chunk)[0];

      const payload = {
        node: nodeName,
        plan: nodeOutput.plan || null,
        code: nodeOutput.code || null,
        errorLogs: nodeOutput.errorLogs || [],
        isValid: nodeOutput.isValid ?? null,
        iterationCount: nodeOutput.iterationCount ?? null,
      };

      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }

    // End of stream signal
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("LangGraph Streaming Execution Error:", error);
    res.write(
      `data: ${JSON.stringify({
        error: true,
        message: error.message || "Failed to generate component due to an internal agent error.",
      })}\n\n`
    );
    res.end();
  }
};

/**
 * Saves a generated component to the database
 * Route: POST /api/components/save
 */
export const saveComponent = async (req, res) => {
  try {
    const { title, prompt, plan, code, tags } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. User ID missing." });
    }

    const newComponent = await Component.create({
      userId,
      title,
      prompt,
      plan,
      code,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: "Component saved successfully.",
      data: newComponent,
    });
  } catch (error) {
    console.error("Save Component Error:", error);
    return res.status(500).json({ success: false, message: "Server error while saving component." });
  }
};

/**
 * Fetches all components for the authenticated user
 * Route: GET /api/components/my-components
 */
export const getUserComponents = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const components = await Component.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: components.length,
      data: components,
    });
  } catch (error) {
    console.error("Get Components Error:", error);
    return res.status(500).json({ success: false, message: "Server error while fetching components." });
  }
};

/**
 * Fetches a single component by ID
 * Route: GET /api/components/:id
 */
export const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const component = await Component.findOne({ _id: id, userId });
    if (!component) {
      return res.status(404).json({ success: false, message: "Component not found." });
    }

    return res.status(200).json({ success: true, data: component });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error fetching component." });
  }
};

/**
 * Deletes a component
 * Route: DELETE /api/components/:id
 */
export const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const deleted = await Component.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Component not found or unauthorized." });
    }

    return res.status(200).json({ success: true, message: "Component deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error deleting component." });
  }
};