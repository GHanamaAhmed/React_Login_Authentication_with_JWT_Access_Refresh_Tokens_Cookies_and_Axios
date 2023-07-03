const jwt = require("jsonwebtoken");
const jwtVerfyt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401);
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, decode) => {
    if (err) return res.status(401).json({err:"token!"});
    req.email = decode.email;
    next();
  });
};
module.exports = { jwtVerfyt };
