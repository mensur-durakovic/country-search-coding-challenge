const axios = require('axios');
const apiConstants = require('../constants/api');

const axiosInstance = axios.create({
    baseURL: apiConstants.countriesUrl,
});

module.exports = axiosInstance;