const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const axios = require("../../config/axios");
const config = require("../../config/config");
const utilies = require("../../utils/utilies");

router.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm
      ? req.query.searchTerm.toLowerCase()
      : "";

    const usersGeoPoint = await utilies.getUsersCurrentGeoPoint();
    
    const filePath = path.join(
      __dirname,
      "../../utils/countries_metadata.json"
    );
    
    fs.readFile(filePath, "utf8", (err, fileContent) => {
      if (err) {
        throw err;
      }
      const countriesData = JSON.parse(fileContent);
      if (!searchTerm) {
        res.send(countriesData);
        return;
      }

      const filteredCountries = countriesData.countries.filter((c) =>
        c.name.toLowerCase().includes(searchTerm)
      );
      
      filteredCountries.sort((a, b) =>
        utilies.calculateDistance(a.lat, usersGeoPoint.latitude, a.lng, usersGeoPoint.longitude) >
        utilies.calculateDistance(b.lat, usersGeoPoint.latitude, b.lng, usersGeoPoint.longitude)
          ? 1
          : -1
      );
      res.send({ countries: filteredCountries });
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
