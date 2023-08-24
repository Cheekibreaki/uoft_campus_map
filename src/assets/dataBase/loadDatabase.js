const fs = require('fs');
const realm = require('realm');

// Read the GeoJSON file
const geojsonFilePath = '../geojson/BA_Indoor_1_room.json';
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, 'utf8'));
// console.log(geojson.features[0].geometry.coordinates)

// Define Realm schema (same as before)
class Geometry extends realm.Object {}
Geometry.schema = {
    name: 'Geometry',
    properties: {
      type: 'string',
      coordinates: 'string',
    },
};

class Feature extends realm.Object {}
Feature.schema = {
  // Your schema definition
  name: "feature",
  properties:{
    room: 'string',
    floor: 'string',
    color: {type: 'list', objectType: 'int'},
    layer_name: 'string',
    height: 'double',
    base_height: 'double',
    geometry: 'Geometry',
  }
};



// Create or open the Realm database
const realmInstance = new realm({ schema: [Feature, Geometry], path: './firstFloor.realm' });

// Insert GeoJSON data into the Realm database
realmInstance.write(() => {
  geojson.features.forEach(feature => {
    realmInstance.create(Feature, {
      room: feature.properties.room,
      floor: feature.properties.floor,
      color: feature.properties.color,
      layer_name: feature.properties.layer_name,
      height: feature.properties.height,
      base_height: feature.properties.base_height,
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates[0].toString(),
      },
    });
  });
});

// Close the Realm instance when done
realmInstance.close();