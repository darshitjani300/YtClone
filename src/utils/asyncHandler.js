const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

// Below is the logic behind the function wiht double brackets
// const asyncHandler = (fn) => {};
// const asyncHandler = (fn) => {
//   async () => {};
// };
// const asyncHandler = (fn) => async() => {};

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
