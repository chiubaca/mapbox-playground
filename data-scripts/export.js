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
        origin: "50.34568827203633, 40.20240876885365",
        destination: "27.71570013984922, 85.3246534010905",
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
      "./data-scripts/output/gmaps_leg5.json",
      JSON.stringify(result.data)
    );
  } catch (e) {
    console.log("something went wrong", e);
  }
}

main();
