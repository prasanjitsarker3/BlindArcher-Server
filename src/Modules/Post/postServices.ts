import httpStatus from "http-status";
import prisma from "../../App/Common/Prisma";
import { ITokenUser } from "../../App/Common/authType";
import ApiError from "../../App/Error/ApiError";
import { ICloudinaryResponse, IFile } from "../../Helpers/file";
import { fileUploader } from "../../Helpers/fileUploader";
import { Prisma, RequestStatus } from "@prisma/client";
import { IPaginationOptions } from "../User/userInterface";
import paginationCalculation from "../../Utilities/paginationCalculation";
import { postSearchingField } from "./postConstant";

const createPostIntoDB = async (req: any, user: ITokenUser) => {
  const files = req.files;
  if (files && files.length > 0) {
    const cloudinaryImgs = await Promise.all(
      files.map((file: IFile) => fileUploader.uploadToCloudinary(file))
    );
    req.body.photo = cloudinaryImgs.map(
      (img: ICloudinaryResponse) => img.secure_url
    );
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !");
  }
  const data = {
    ...req.body,
    authorId: userData.id,
  };
  const result = await prisma.post.create({
    data,
  });

  return result;
};

const getAllPostFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.PostWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: postSearchingField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  andCondition.push({
    status: RequestStatus.ACCEPTED,
  });
  const whereCondition: Prisma.PostWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.post.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "asc",
          },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const myPostFromDB = async (user: ITokenUser) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  const myPostData = await prisma.post.findMany({
    where: {
      author: {
        email: userData.email,
      },
    },
  });
  return myPostData;
};

const adminActionPostFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.PostWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: postSearchingField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.PostWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.post.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "asc",
          },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleBlogPost = async (id: string) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          name: true,
          profile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const deleteBlogPostFromDb = async (id: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const deletePost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      isDelete: true,
    },
  });
  return deletePost;
};
export const postServices = {
  createPostIntoDB,
  getAllPostFromDB,
  myPostFromDB,
  adminActionPostFromDB,
  singleBlogPost,
  deleteBlogPostFromDb,
};
