const Realm = require('realm');
const Building = require('./database.js').Building;
const Feature = require('./database.js').Feature;
const Geometry = require('./database.js').Geometry;
import fs from 'react-native-fs';

function convertStringToCoordinates(inputString) {
  const coordinatesArray = inputString.split(',').map(Number);

  // Group the coordinates in pairs
  const groupedCoordinates = [];
  for (let i = 0; i < coordinatesArray.length; i += 2) {
    groupedCoordinates.push([coordinatesArray[i], coordinatesArray[i + 1]]);
  }

  // Wrap the groupedCoordinates array in another array
  const nestedArray = [groupedCoordinates];

  return nestedArray;
}

// function rgbArrayToRgbString(rgbArray) {
//   if (rgbArray.length !== 3) {
//     throw new Error("RGB array must contain exactly three values (r, g, b).");
//   }

//   const [r, g, b] = rgbArray;
//   if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
//     throw new Error("Invalid RGB values. Each value must be in the range 0-255.");
//   }

//   return `rgb(${r}, ${g}, ${b})`;
// }

const getGeoJSON = async () => {
    let realm;
    let AllGeoJSONs = new Map();

    // await fs.readDir(fs.DocumentDirectoryPath)
    // .then((result) => {
    //   // Step 2: Iterate over the list of files and delete them
    //   result.forEach((item) => {
    //     if (item.isFile()) {
    //      fs.unlink(item.path)
    //         .then(() => {
    //           console.log(`Deleted file: ${item.path}`);
    //         })
    //         .catch((err) => {
    //           console.error(`Failed to delete file: ${item.path}`, err.message);
    //         });
    //     }
    //   });
    // })
    // .catch((err) => {
    //   console.error(`Error reading directory: ${fs.DocumentDirectoryPath}`, err.message);
    // });


    
    // await fs.exists(fs.DocumentDirectoryPath+'/firstFloor.realm').then((exists) => {
    //   if (exists) {
    //     console.log(`File  exists.`);
    //   } else {
    //     console.log(`File  does not exist.`);
    //   }
    // })
    // .catch((err) => {
    //   console.log('Error checking file existence:', err);
    // });
    // const directoryPath = fs.DocumentDirectoryPath; // Replace with the path of the directory you want to list

    // await fs.readDir(directoryPath)
    //   .then((result) => {
    //     // Loop through the list of files and directories
    //     result.forEach((item) => {
    //       console.log('Name:', item.name); // Name of the file or directory
    //       console.log('Is Directory:', item.isDirectory() ? 'Yes' : 'No'); // Check if it's a directory
    //       console.log('Path:', item.path); // Full path to the file or directory
    //       // console.log('Size:', item.size); // Size of the file (in bytes)
    //       // console.log('Modification Time:', item.mtime); // Last modification time
    //     });
    //   })
    //   .catch((err) => {
    //     console.log('Error reading directory:', err);
    //   });

    await fs.copyFileAssets('firstFloor.realm',fs.DocumentDirectoryPath+'/firstFloor.realm')
    .then(()=>{
      realm = new Realm({
        schema: [Building,Feature,Geometry], 
        path: fs.DocumentDirectoryPath+'/firstFloor.realm', 
      });
      try {
        console.log('REALM PATH', Realm.defaultPath);
        console.log("open successfully")
  
        const buildings = realm.objects('Building');
        // console.log(buildings)
        const feature = realm.objects('Feature');
        // console.log(feature)       

        buildings.forEach(building => {
          const buildingName = building.building_name
          const buildingID = building.building_id
          const buildingFloorIndeices = building.building_floor_indicies

          for(let i =0; i <buildingFloorIndeices.length;i++){
            let features = feature.filtered(`feature_building_id == "${buildingID}" AND building_floor == "${buildingFloorIndeices[i]}"`)
            if(features.length!==0){
              const contour =  features.filtered('feature_type == "contour"')
              const rooms = features.filtered('feature_type == "room"')
              // const GeoJSONContour = {
              //   "type":"featureCollection",
              //   "name":buildingName,
              //   "features":[{
              //     "type": "Feature",
              //     "properties":{
              //       "room": "",
              //       "floor":contour.building_floor,
              //       "color": contour.feature_color,
                  
              //     "layer_name": contour.feature_layer_name,
              //     "height": contour.feature_height,
              //     "base_height": contour.feature_base_height
              //     },
              //     "geometry": {
              //       "type": contour.feature_geometry.geometry_type,
              //       "coordinates": contour.feature_geometry.geometry_coordinates
              //     }
              //     }
              //   ],
              //   "floor_indicies": buildingFloorIndeices,
              //   "default_floor": building.building_default_floor
              // }
              // AllGeoJSONs.set(contour.feature_layer_name,GeoJSONContour)

              const GeoJSONRoom = {
                "type":"FeatureCollection",
                "name":buildingName,
                "features":rooms.map(room=>{
                  return {
                  "type": "Feature",
                  "properties":{
                    "room": room.feature_id,
                    "floor":room.building_floor,
                    "color": room.feature_color,
                  
                  "layer_name": room.feature_layer_name,
                  "height": room.feature_height,
                  "base_height": room.feature_base_height
                  },
                  "geometry": {
                    "type": room.feature_geometry.geometry_type,
                    "coordinates": convertStringToCoordinates(room.feature_geometry.geometry_coordinates)
                  }
                  }
                }),
                "floor_indicies": buildingFloorIndeices,
                "default_floor": building.building_default_floor
              }
              AllGeoJSONs.set(rooms[0].feature_layer_name,GeoJSONRoom)
              

            }
            
          }
        })
        // console.log(AllGeoJSONs)
        // AllGeoJSONs.get("BA_Indoor_1_room").features.forEach(feature=>{
        //   console.log(feature.geometry.coordiantes)
        // })
        
        const jsonMap = JSON.stringify(AllGeoJSONs.get("BA_Indoor_1_room"));

        // Define the file path where you want to save the data
        const filePath = fs.DocumentDirectoryPath + '/BA_Indoor_1_room.json';

        // Write the JSON data to the file
        fs.writeFile(filePath, jsonMap, 'utf8')
          .then(() => {
            console.log('Map data saved successfully.');
          })
          .catch((err) => {
            console.log('Error writing map data:', err);
          });


        return AllGeoJSONs;


      
      } catch (error) {
        console.error('Error opening Realm database:', error);
      } finally {
        if (realm) {
          // realm.close(); 
        }
      }
    }
    
    );

    
    
    return AllGeoJSONs
  };
  
  export default getGeoJSON;


