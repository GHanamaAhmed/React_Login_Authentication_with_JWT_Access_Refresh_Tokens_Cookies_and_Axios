const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const { jwtVerfyt } = require("../middlewares/jwtVerify");
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ err: "check all information!" });
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ err: "user dont exist!" });
  bcrypt.compare(password, user.password, async (err, same) => {
    if (err) return new Error(err);
    if (!same) return res.status(401).json({ err: "password dont valid!" });
    const accessToken = jwt.sign({ email }, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: 10,
    });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: 60,
    });
    user.tokens.push(refreshToken);
    await user.save();
    res
      .status(200)
      .cookie("jwt", refreshToken, { httpOnly: true, maxAge: 1000 * 60,secure:true })
      .json({ accessToken, email });
  });
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ err: "check all information!" });
  const user = await UserModel.findOne({ email });
  if (user) return res.status(401).json({ err: "user is exsisting" });
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  const newUser = new UserModel({ email, password: hashPwd });
  const accessToken = jwt.sign({ email }, process.env.ACCESS_SECRET_TOKEN, {
    expiresIn: 10,
  });
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET_TOKEN, {
    expiresIn: 60,
  });
  newUser.tokens.push(refreshToken);
  await newUser.save();
  res
    .cookie("jwt", refreshToken, { httpOnly: true, maxAge: 1000 * 60,secure:true })
    .json({ accessToken, email });
});

router.get("/logout", jwtVerfyt, async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.status(401).json({ err: "token!" });
  const user = await UserModel.findOne({ email: req.email });
  const newToken = user.tokens.filter((userToken) => refreshToken != userToken);
  user.tokens = [...newToken];
  await user.save();
  res
    .cookie("jwt", "", {
      httpOnly: true,
      maxAge: 1,
      secure:true
    })
    .json({ msg: "logout seccessful" });
});
module.exports = router;
