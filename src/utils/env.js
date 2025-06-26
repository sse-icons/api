require("dotenv").config()

exports.PORT = process.env.PORT || 3000;
exports.MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/api";