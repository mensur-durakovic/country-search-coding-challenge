const axios = require("../config/axios");
const config = require("../config/config");
/**
 * calculates distance between 2 geo-points using Haversine formula
 * @param {number} lat1 - latitude of first geo-point
 * @param {number} lat2 - latitude of second geo-point
 * @param {number} lon1 - longitude of first geo-point
 * @param {number} lon2 - longitude of second geo-point
 */
function calculateDistance(lat1, lat2, lon1, lon2) {
  const p = Math.PI / 180;
  const result =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;
  return 12742 * Math.asin(Math.sqrt(result));
}

/**
 * calls API service to get users current geolocation
 */
async function getUsersCurrentGeoPoint() {
  const response = await axios.get(`/check?access_key=${config.ipStackApiKey}`);

  const userLatitude = response.data.latitude;
  const userLongitude = response.data.longitude;
  return {
    userLatitude,
    userLongitude,
  };
}

module.exports = {
  calculateDistance,
  getUsersCurrentGeoPoint,
};
