const fs = require('fs');
const realm = require('realm');

// Read the GeoJSON file
const geojsonFilePath = '../geojson/BA_Indoor_1_room.json';
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, 'utf8'));
// console.log(geojson.features[0].geometry.coordinates)

// Define Realm schema (same as before)
class Building extends realm.Object {}
Building.schema = {
  name: 'Building',
  primaryKey: '_id',
  properties: {
      _id: 'objectId',
      building_id: { type: 'string', indexed: true, unique: true, required: true },//BA
      building_name: { type: 'string', indexed: true, unique: true,required: true },//Bahen Centre for Information Technology
      building_floor_indicies: { type: 'string', required: true },//B12345678
      building_default_floor: { type: 'string', required: false},//1
  },
};

class Feature extends realm.Object {}
Feature.schema = {
  // Your schema definition
  name: "Feature",
  primaryKey: '_id',
  properties:{
    _id: 'objectId',
    building_id: { type: 'string', required: true}, 
    feature_building: { type: 'Building', required: true},
    feature_type: { type: 'string', required: true },
    feature_layer_name: { type: 'string', required: true },
    feature_id: { type: 'string', required: true, indexed: true },
    building_floor: { type: 'string', required: true },
    feature_color: {type: 'list', objectType: 'int', required: true},
    feature_height: { type: 'double', required: true }, 
    feature_base_height: { type: 'double', required: true },
    feature_geometry: { type: 'Geometry', required: true }
  }
  
};



class Geometry extends realm.Object {}
Geometry.schema = {
    name: 'Geometry',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      building_id: { type: 'string', required: true},
      feature_id: { type: 'string', required: true, indexed: true },
      geometry_type: { type: 'string', required: true},
      geometry_coordinates: { type: 'string', required: true},
    },
    
};

module.exports = {
  Building,
  Feature,
  Geometry,
};


// // Define the base path to the Realm database file
// const realmBasePath = './firstFloor.realm';

// // Function to delete a file if it exists
// const deleteIfExists = (filePath) => {
//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//     console.log(`Deleted ${filePath}`);
//   }
// };

// // Delete the main database file, lock file, and management file if they exist
// deleteIfExists(realmBasePath);
// deleteIfExists(`${realmBasePath}.lock`);



// // Create or open the Realm database
// const realmInstance = new realm({ schema: [Feature, Geometry], path: './firstFloor.realm' });

// // Insert GeoJSON data into the Realm database
// realmInstance.write(() => {
//   geojson.features.forEach(feature => {
//     realmInstance.create(Feature, {
//       _id: new Realm.BSON.ObjectId(),
//       room: feature.properties.room,
//       floor: feature.properties.floor,
//       color: feature.properties.color,
//       layer_name: feature.properties.layer_name,
//       height: feature.properties.height,
//       base_height: feature.properties.base_height,
//       geometry: {
//         _id: new Realm.BSON.ObjectId(),
//         type: feature.geometry.type,
//         coordinates: feature.geometry.coordinates[0].toString(),
//       },
//     });
//   });
// });

// // Close the Realm instance when done
// realmInstance.close();