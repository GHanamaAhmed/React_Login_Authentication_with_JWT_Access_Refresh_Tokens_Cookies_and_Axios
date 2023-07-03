const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const router = require("express").Router();
router.get("/", (req, res) => {
  const token = req?.cookies?.jwt;
  if (!token) return res.status(401).json({err:"token!"});
  jwt.verify(token, process.env.REFRESH_SECRET_TOKEN, async (err, decode) => {
    if (err) return res.status(401).json({err:"token!"});
    const email = decode.email;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ err: "user dont found!" });
    if (!user.tokens.includes(token)) return res.status(401).json({err:"token!"});
    const newToken = user.tokens.filter((userToken) => userToken != token);
    const accessToken = jwt.sign({ email }, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: 10,
    });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: 60,
    });
    newToken.push(refreshToken);
    user.tokens = [...newToken];
    await user.save();
    res
      .status(200)
      .cookie("jwt", refreshToken, { httpOnly: true, maxAge: 60 * 1000,secure:true })
      .json({accessToken});
  });
});
module.exports = router;
