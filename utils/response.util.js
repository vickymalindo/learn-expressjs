const response = ({ statusCode, message, datas, res }) => {
  res.status(statusCode).json({
    payload: {
      status: statusCode,
      data: datas,
      message: message,
    },
  });
};

export default response;
