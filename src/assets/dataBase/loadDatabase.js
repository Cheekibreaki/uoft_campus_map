const fs = require('fs');
const realm = require('realm');


const Building = require('./database.js').Building;
const Feature = require('./database.js').Feature;
const Geometry = require('./database.js').Geometry;

  // Read the GeoJSON file
  const geojsonFilePath = '../geojson/BA_Indoor_1_room.json';
  const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, 'utf8'));
  // console.log(geojson.features[0].geometry.coordinates)
function main() {



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

  const features = geojson.features;
  // Insert GeoJSON data into the Realm database

  for (const feature of features) {

      const layer_name = feature.properties.layer_name; //"BA_Indoor_2_room"
      const layer_name_arr = layer_name.split('_');

      // Extract the desired substrings
      const feature_building_abbr = layer_name_arr[0]; // "BA"
      const feature_layer_name = layer_name; // "BA_Indoor_2_room"
      const building_floor = layer_name_arr[2]; // "2"
      const feature_type = layer_name_arr[layer_name_arr.length - 1];//"room"

      let existingBuilding = realmInstance.objects("Building").filtered("building_id = $0", feature_building_abbr);
      if (existingBuilding.length === 0) {
        // If no object with the same building_id exists, create a new one
        createBuilding(feature_building_abbr,realmInstance);
      }

      existingBuilding = realmInstance.objects("Building").filtered("building_id = $0", feature_building_abbr);



      // console.log('Building ID:', existingBuilding.building_id);

      room_name = ""

      realmInstance.write(() => {
        if(feature.properties.room == "E"){
          existingBuilding[0].building_elevator_num = existingBuilding[0].building_elevator_num + 1;
          room_name = `E${existingBuilding[0].building_elevator_num}`
        }else if(feature.properties.room == "S"){
          existingBuilding[0].building_stairs_num = existingBuilding[0].building_stairs_num + 1;
          room_name = `S${existingBuilding[0].building_elevator_num}`
        }else if(feature.properties.room == "FW"){
          existingBuilding[0].building_f_washroom_num = existingBuilding[0].building_f_washroom_num + 1;
          room_name = `FW${existingBuilding[0].building_elevator_num}`
        }else if(feature.properties.room == "MW"){
          existingBuilding[0].building_m_washroom_num = existingBuilding[0].building_m_washroom_num + 1;
          room_name = `MW${existingBuilding[0].building_elevator_num}`
        }else if(/^[0-9]+$/.test(feature.properties.room)){
          existingBuilding[0].building_room_num = existingBuilding[0].building_room_num + 1;
          room_name = feature.properties.room
        }
      });

      realmInstance.write(() => {
        const newFeature = realmInstance.create("Feature", {
          _id: new Realm.BSON.ObjectId(),
          feature_id: room_name,
          feature_building: existingBuilding[0],
          feature_type: feature_type,
          feature_layer_name: feature_layer_name,
          building_floor: building_floor,
          feature_color: feature.properties.color,
          feature_height: feature.properties.height,
          feature_base_height: feature.properties.base_height,
        });

        newFeature.feature_geometry = realmInstance.create("Geometry", {
          _id: new Realm.BSON.ObjectId(),
          geometry_building: existingBuilding[0],
          geometry_type: feature.geometry.type,
          geometry_coordinates: feature.geometry.coordinates[0].toString(),
        });

        newFeature.feature_geometry.geometry_feature = newFeature;

      });

  };


  const allBuildings = realmInstance.objects('Building');

  // Print the content of each Building object
  allBuildings.forEach(building => {
    console.log('Building ID:', building.building_id);
    console.log('Building Name:', building.building_name);
    console.log('Building Floor Indices:', building.building_floor_indicies);
    console.log('Building Default Floor:', building.building_default_floor);
    console.log('Building Room num:', building.building_room_num);
    console.log('Building stairs num:', building.building_stairs_num);
    console.log('Building elevator num:', building.building_elevator_num);
    console.log('Building f washroom num:', building.building_f_washroom_num);
    console.log('Building m washroom num:', building.building_m_washroom_num);
    console.log('-----------------------------');
  });

  const allFeatures = realmInstance.objects('Feature');
  allFeatures.forEach(feature => {
    console.log('Feature ID:', feature.feature_id);
    console.log('Feature Type:', feature.feature_type);
    console.log('Feature Layer Name:', feature.feature_layer_name);
    console.log('Building Floor:', feature.building_floor);
    console.log('Feature Color:', feature.feature_color);
    console.log('Feature Height:', feature.feature_height);
    console.log('Feature Base Height:', feature.feature_base_height);
    console.log('Feature Geometry:', feature.feature_geometry);
    console.log('Feature Building:', feature.feature_building);

    // Print the associated building for the feature
    console.log('Associated Building ID:', feature.feature_building.building_id);
    console.log('-----------------------------');
  });

  // Print the content of each Geometry object
  const allGeometries = realmInstance.objects('Geometry');
  allGeometries.forEach(geometry => {
    console.log('Geometry Type:', geometry.geometry_type);
    console.log('Geometry Coordinates:', geometry.geometry_coordinates);

    // Print the associated building and feature for the geometry
    console.log('Associated Building ID:', geometry.geometry_building.building_id);
    console.log('Associated Feature ID:', geometry.geometry_feature.feature_id);
    console.log('-----------------------------');
  });


  // Close the Realm instance when done
  realmInstance.close();

}


function createBuilding(
  feature_building_abbr,
  realmInstance
  ) {
  try {
    realmInstance.write(() => {
      realmInstance.create("Building", {
        _id: new Realm.BSON.ObjectId(),
        building_id: feature_building_abbr,
        building_name: geojson.name,
        building_floor_indicies: geojson.floor_indicies,
        building_default_floor: geojson.default_floor,
        building_room_num: 0,
        building_stairs_num: 0, 
        building_elevator_num: 0,
        building_f_washroom_num: 0,
        building_m_washroom_num: 0,
      });
    });
    console.log("writing")
    console.log('Write transaction completed successfully.');
  } catch (error) {
    console.error('Error during write transaction:', error);
  }
}


main();