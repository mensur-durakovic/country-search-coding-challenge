const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require("./config/config");
const constants = require("./constants/base");
const countries = require("./routes/api/country");

const app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// routes
app.use("/api/countries", countries);

app.listen(config.port, () => {
  console.log(`${constants.appName} running on port ${config.port}`);
});

module.exports = app; // for testing