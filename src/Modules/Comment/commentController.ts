import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { commentService } from "./commentServices";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await commentService.createComment(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Comment Successfully",
      data: result,
    });
  }
);
const updateComment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await commentService.updateComment(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Update Comment Successfully",
      data: result,
    });
  }
);
const deleteComment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const result = await commentService.deleteComment(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Delete Comment Successfully",
      data: result,
    });
  }
);

export const commentController = {
  createComment,
  updateComment,
  deleteComment,
};
