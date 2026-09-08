import { Router } from "express";
import {
  generateComponentStream,
  saveComponent,
  getUserComponents,
  getComponentById,
  deleteComponent,
} from "../controllers/component.controller.js";
import { validate, generateComponentSchema, saveComponentSchema } from "../schemas/component.schema.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all component endpoints with authentication
router.use(verifyToken);

// Real-time AI Generation Stream (SSE)
router.post("/generate", validate(generateComponentSchema), generateComponentStream);

// CRUD operations
router.post("/save", validate(saveComponentSchema), saveComponent);
router.get("/my-components", getUserComponents);
router.get("/:id", getComponentById);
router.delete("/:id", deleteComponent);

export default router;