import { z } from "zod";

// Schema for component generation prompt
export const generateComponentSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .trim()
    .min(5, "Prompt must be at least 5 characters long")
    .max(1000, "Prompt cannot exceed 1000 characters"),
});

// Schema for saving a generated component to the database
export const saveComponentSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  prompt: z.string({ required_error: "Original prompt is required" }),
  plan: z.string().optional(),
  code: z
    .string({ required_error: "Component code is required" })
    .min(10, "Component code cannot be empty"),
  tags: z.array(z.string()).optional().default([]),
});

// Express validation middleware helper
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })) || error.message,
    });
  }
};