const router = require("express").Router();
router.get("/", async (req, res) => {
  const email = req.email;
  res.json({email})
});
module.exports = router;
