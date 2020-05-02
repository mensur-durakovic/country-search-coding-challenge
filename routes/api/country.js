const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const axios = require('../../config/axios');
const config = require('../../config/config');

router.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    console.log('searchTerm', searchTerm);

    const response = await axios.get(`/check?access_key=${config.ipStackApiKey}`);
    console.log('result', response.data);

    const userLatitude = response.data.latitude;
    const userLongitude = response.data.longitude;
    console.log('userLatitude', userLatitude);
    console.log('userLongitude', userLongitude);

    const filePath = path.join(__dirname, '../../utils/', 'countries_metadata.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      if(!searchTerm){
        res.send(JSON.parse(data));
        return;
      }

      res.send(JSON.parse(data));
    });

  } catch (error) {
    console.error('Unexpected error on /api/countries/', error);
    res.status(500).send('Unexpected error occurred!');
  }
});

router.get('/distance', async (req, res) => {
  try {
    console.log('search countries', config);
    const result = await axios.get(`/check?access_key=${config.ipStackApiKey}`);
    console.log('result', result.data);
    res.status(200).send(result.data);
  } catch (error) {
    console.error('Unexpected error on  /api/distance', error);
    res.status(500).send('Unexpected error occurred!');
  }
});

module.exports = router;
