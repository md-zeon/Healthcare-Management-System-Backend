import { Response } from "express";

interface IResponseData<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = (res: Response, responseData: IResponseData<T>) => {
  const { httpStatusCode, success, message, data } = responseData;

  res.status(httpStatusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
