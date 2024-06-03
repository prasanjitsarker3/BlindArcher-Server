import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { postServices } from "./postServices";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import pick from "../../App/Common/Pick";
import { optionsPaginationFields, postFilterableFields } from "./postConstant";

const createPost = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await postServices.createPostIntoDB(req, user);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Post Create Successfully",
      data: result,
    });
  }
);
const getAllPost = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filterData = pick(req.query, postFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await postServices.getAllPostFromDB(filterData, optionsData);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Post Create Successfully",
      data: result,
    });
  }
);
const getMyPost = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await postServices.myPostFromDB(user);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "My Post Fetch Successfully",
      data: result,
    });
  }
);
const adminPost = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filterData = pick(req.query, postFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await postServices.adminActionPostFromDB(
      filterData,
      optionsData
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Post Fetch Successfully",
      data: result,
    });
  }
);
const singlePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postServices.singleBlogPost(id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Single Post Fetch Successfully",
    data: result,
  });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await postServices.deleteBlogPostFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Delete Post Successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  getAllPost,
  getMyPost,
  adminPost,
  singlePost,
  deletePost,
};
