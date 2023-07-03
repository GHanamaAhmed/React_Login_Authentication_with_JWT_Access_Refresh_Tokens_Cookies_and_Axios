const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const refreshTokenRouter = require("./routes/refreshToken");
const userRouter = require("./routes/user");
require("dotenv").config({ path: __dirname + "/.env" });
const { dbConnect } = require("./config/dbConnect");
const { jwtVerfyt } = require("./middlewares/jwtVerify");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/refreshToken", refreshTokenRouter);
app.use("/user",jwtVerfyt, userRouter);
dbConnect()
  .then((res) =>
    app.listen(4000, () => {
      console.log("http://localhost:4000");
    })
  )
  .catch((err) => console.log(err));
