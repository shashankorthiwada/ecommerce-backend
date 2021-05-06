const mongoose = require("mongoose");
async function initializeDbConnection() {
  try {
    const uri = process.env.DB_URI;
    const result = await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected Successfully", result);
  } catch (err) {
    console.log("mongoose connection failed", err);
  }
}

module.exports = { initializeDbConnection };
