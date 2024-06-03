import { ITokenUser } from "../../App/Common/authType";

const createComment = async (user: ITokenUser, payload: any) => {
  console.log({ user, payload });
};

const updateComment = async (payload: any) => {
  console.log(payload);
};

const deleteComment = async (id: string) => {
  console.log(id);
};

export const commentService = {
  createComment,
  updateComment,
  deleteComment,
};
