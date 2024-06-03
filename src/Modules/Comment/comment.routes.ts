import express from "express";
import { commentController } from "./commentController";
const router = express.Router();

router.post("/create", commentController.createComment);
router.patch("/update", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export const commentRoutes = router;
