const weatherRouter = require('express').Router()
const axios = require('axios');


weatherRouter.post('/', async (req, res) => {
    const latQuery = req.body.lat?`lat=${req.body.lat}&`:"";
    const lonQuery = req.body.lon?`lon=${req.body.lon}&`:"";
    const qQuery = req.body.q?`q=${req.body.q}&`:"";
    const unitsQuery = req.body.units?`units=${req.body.units}&`:"";
    const langQuery = req.body.lang?`lang=${req.body.lang}&`:"";
    const queries = `${latQuery}${lonQuery}${qQuery}${unitsQuery}${langQuery}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?${queries}appid=${process.env.WEATHER_API_KEY}`;
    axios
    .get(
      WEATHER_API_URL
    )
    .then(function (response) {
      // handle success
      console.log(response);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
})



module.exports = weatherRouter