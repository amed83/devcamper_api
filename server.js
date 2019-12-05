const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
dotenv.config({ path: "./config/config.env" });

connectDB();

const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const user = require("./routes/user");
const reviews = require("./routes/reviews");

const PORT = process.env.PORT || 500;

const app = express();

// Sanitize
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSSS
app.use(xss())

// Rate limiting

const limiter = rateLimit({
    windowMs:10 * 60 * 1000,
    max:100
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable cors
app.use(cors())

//logger middleware morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  fileupload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
);




// Set public as static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//File upload

//Mount routers
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/user", user);
app.use("/api/v1/reviews", reviews);
//Error handler must be here in order to be used on bootcamp controllers
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode listeining on port ${PORT}`
      .yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`.red);
  server.close(() => process.exit(1));
});
