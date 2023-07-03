const mongoose = require("mongoose");
const userShema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  tokens: {
    type: [String],
    required: true,
  },
});
module.exports=mongoose.model("user",userShema)