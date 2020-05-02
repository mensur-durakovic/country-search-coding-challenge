const express = require("express");
const fs = require("fs");
var path = require('path');
const router = express.Router();
const axios = require("../../config/axios");
const config = require("../../config/config");

router.get("/", (req, res) => {
  try {
    console.log("get countries");

    const filePath = path.join(__dirname, '../../utils/', 'countries_metadata.json');
    fs.readFile(filePath, "utf8", function (
      err,
      data
    ) {
      if (err) throw err;
      res.send( JSON.parse(data));
    });
  } catch (error) {
    console.error("Unexpected error on /api/countries/", error);
    res.status(500).send("Unexpected error occurred!");
  }
});

router.get("/distance", async (req, res) => {
  try {
    console.log("search countries", config);
    const result = await axios.get(`/check?access_key=${config.ipStackApiKey}`);

    console.log("result", result.data);
    res.status(200).send(result.data);
  } catch (error) {
    console.error("Unexpected error on  /api/distance", error);
    res.status(500).send("Unexpected error occurred!");
  }
});

module.exports = router;
