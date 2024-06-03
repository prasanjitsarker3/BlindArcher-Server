import express from "express";
import { userRoutes } from "../Modules/User/user.routes";
import { authRoutes } from "../Modules/Auth/auth.routes";
import { postRoutes } from "../Modules/Post/post.routes";
import { commentRoutes } from "../Modules/Comment/comment.routes";

const router = express.Router();

const moduleRoute = [
  {
    path: "/users",
    element: userRoutes,
  },
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/post",
    element: postRoutes,
  },
  {
    path: "/comment",
    element: commentRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.element));
export default router;
