const dotenv = require("dotenv");

dotenv.config();

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  ipStackApiKey: process.env.IPSTACK_API_KEY,
});
