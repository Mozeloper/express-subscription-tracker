// Basically a function that is used to handle errors in the application

const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    // Mongoose bad ObjectId
    if (error.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplication
    if (error.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    next()
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
