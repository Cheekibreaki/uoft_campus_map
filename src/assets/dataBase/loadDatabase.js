const fs = require('fs');
const realm = require('realm');


const Building = require('./database.js').Building;
const Feature = require('./database.js').Feature;
const Geometry = require('./database.js').Geometry;

async function setupRealmDatabase() {
// Read the GeoJSON file
const geojsonFilePath = '../geojson/BA_Indoor_1_room.json';
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, 'utf8'));
// console.log(geojson.features[0].geometry.coordinates)

// Define the base path to the Realm database file
const realmBasePath = './firstFloor.realm';

// Function to delete a file if it exists
const deleteIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted ${filePath}`);
  }
};

// Delete the main database file, lock file, and management file if they exist
deleteIfExists(realmBasePath);
deleteIfExists(`${realmBasePath}.lock`);



// Create or open the Realm database
const realmInstance = new realm({ schema: [Feature, Geometry, Building], path: './firstFloor.realm' });


// Insert GeoJSON data into the Realm database

  geojson.features.forEach(feature => {

    const layer_name = feature.properties.layer_name; //"BA_Indoor_2_room"
    const layer_name_arr = layer_name.split('_');

    // Extract the desired substrings
    const feature_building_name = layer_name_arr[0]; // "BA"
    const feature_layer_name = layer_name; // "BA_Indoor_2_room"
    const building_floor = layer_name_arr[2]; // "2"
    const feature_type = layer_name_arr[layer_name_arr.length - 1];//"room"

    const existingBuilding = realmInstance.objects("Building").filtered("building_id = $0", feature_building_name);

    if (existingBuilding.length === 0) {
      // If no object with the same building_id exists, create a new one
      realmInstance.write(() => {
        realmInstance.create("Building", {
          _id: new Realm.BSON.ObjectId(),
          building_id: feature_building_name,
          building_name: "bahen",
          building_floor_indicies: "B12345678",
          building_default_floor: "1",
        });
      });
    } else {
      // Handle the case where an object with the same building_id already exists
      console.log("Building with the same building_id already exists.");
    }

    // realmInstance.write(() => {
    //   realmInstance.create("Feature", {
    //     _id: new Realm.BSON.ObjectId(),
    //     building_id: feature_building_name,
    //     building_name: "bahen",
    //     building_floor_indicies: "B12345678",
    //     building_default_floor: "1",
    //   });
    // });


    // realmInstance.create(Feature, {
    //   _id: new Realm.BSON.ObjectId(),
    //   room: feature.properties.room,
    //   floor: feature.properties.floor,
    //   color: feature.properties.color,
    //   layer_name: feature.properties.layer_name,
    //   height: feature.properties.height,
    //   base_height: feature.properties.base_height,
    //   geometry: {
    //     _id: new Realm.BSON.ObjectId(),
    //     type: feature.geometry.type,
    //     coordinates: feature.geometry.coordinates[0].toString(),
    //   },
    // });
  });


const allBuildings = realmInstance.objects('Building');

// Print the content of each Building object
allBuildings.forEach(building => {
  console.log('Building ID:', building.building_id);
  console.log('Building Name:', building.building_name);
  console.log('Building Floor Indices:', building.building_floor_indicies);
  console.log('Building Default Floor:', building.building_default_floor);
  console.log('-----------------------------');
});


// Close the Realm instance when done
realmInstance.close();
};

setupRealmDatabase();