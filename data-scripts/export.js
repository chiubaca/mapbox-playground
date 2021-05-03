require("dotenv").config();
const { Client } = require("@googlemaps/google-maps-services-js");
const fs = require("fs");

const client = new Client({});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log("GOOGLE_API_KEY:", GOOGLE_API_KEY);

async function main() {
  try {
    const result = await client.directions({
      params: {
        origin: "50.81501306551635, 13.981899590806208",
        destination: "48.243921279996606, 14.763759153719763",
        mode: "walking",
        key: GOOGLE_API_KEY,
      },
    });

    if (result.data["error_message"]) {
      console.log("GOOGLE ERROR: ", result.data["error_message"]);
      return;
    }

    console.log("success!", result.data);
    fs.writeFileSync(
      "./data-scripts/output/gmaps_leg3.json",
      JSON.stringify(result.data)
    );
  } catch (e) {
    console.log("something went wrong", e);
  }
}

main();
