const axios = require("axios");
const dedent = require("dedent");
const functions = require("firebase-functions");
const { conversation } = require("@assistant/conversation");

const app = conversation();
const token = functions.config().waqi.key;

const getRemarks = (aqi) => {
  if (aqi <= 50) {
    return "Good";
  } else if (aqi <= 100) {
    return "Moderate";
  } else if (aqi <= 150) {
    return "Unhealthy for Sensitive Groups";
  } else if (aqi <= 200) {
    return "Unhealthy";
  } else if (aqi <= 300) {
    return "Very Unhealthy";
  } else {
    return "Hazardous";
  }
};

app.handle("fetch_aqi", async (conv) => {
  const coords = conv.device.currentLocation.coordinates;
  try {
    const { data } = await axios.get(`https://api.waqi.info/feed/geo:${coords.latitude};${coords.longitude}/?token=${token}`);
    const city = data.data.city.name;
    const aqi = data.data.aqi;
    const remarks = getRemarks(aqi);
    conv.add(
      dedent`The current air quality at ${city} is ${remarks},
       with an AQI of ${aqi}.`,
    );
  } catch (error) {
    conv.add("Sorry, I encountered an unexpected error.");
    console.error(error, conv.intent);
  }
});

app.handle("fetch_aqi_with_station", async (conv) => {
  try {
    const keyword = conv.intent.params["station"].resolved;
    const { data } = await axios.get(`https://api.waqi.info/search/?keyword=${keyword}&token=${token}`);
    if (data.data.length > 0) {
      const station = data.data[0].station.name;
      const aqi = data.data[0].aqi;
      const remarks = getRemarks(aqi);
      conv.add(
        dedent`The current air quality at ${station} is ${remarks},
         with an AQI of ${aqi}.`,
      );
    } else {
      conv.add(
        "Sorry, I could not find any stations with that query.",
      );
    }
  } catch (error) {
    conv.add("Sorry, I encountered an unexpected error.");
    console.error(error, conv.intent);
  }
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
