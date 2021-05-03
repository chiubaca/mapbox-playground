require("dotenv").config();
const { Client } = require("@googlemaps/google-maps-services-js");
const fs = require("fs");

const client = new Client({});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log("GOOGLE_API_KEY:", GOOGLE_API_KEY);

async function main() {
  try {
    const leg1 = await client.directions({
      params: {
        origin: "51.5232543641021, -0.07819152682298208",
        destination: "52.26514799982734, 7.036375710947885",
        mode: "walking",
        key: GOOGLE_API_KEY,
      },
    });

    if (leg1.data["error_message"]) {
      console.log("GOOGLE ERROR: ", leg1.data["error_message"]);
      return;
    }

    console.log("success!", leg1.data);
    fs.writeFileSync(
      "./data-scripts/output/leg1.json",
      JSON.stringify(leg1.data)
    );
  } catch (e) {
    console.log("something went wrong", e);
  }
}

main();
