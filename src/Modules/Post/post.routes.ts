import express, { NextFunction, Request, Response } from "express";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import validationRequest from "../../Middleware/validationRequest";
import { createPostSchema } from "./postValidation";
import { postController } from "./postController";
import { fileUploader } from "../../Helpers/fileUploader";
const router = express.Router();

router.post(
  "/create",
  fileUploader.upload.array("file"),
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = createPostSchema.parse(JSON.parse(req.body.data));
    return postController.createPost(req, res, next);
  }
);
router.get("", postController.getAllPost);
router.get(
  "/my",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER),
  postController.getMyPost
);
router.get(
  "/admin-post",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  postController.adminPost
);

router.get("/:id", postController.singlePost);
router.patch("/:id", postController.deletePost);

// Update Route Incomplete

export const postRoutes = router;
