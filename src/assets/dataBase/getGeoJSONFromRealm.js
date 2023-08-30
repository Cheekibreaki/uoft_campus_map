const Realm = require('realm');
const Building = require('./database.js').Building;
const Feature = require('./database.js').Feature;
// const Geometry = require('./database.js').Geometry;
import fs from 'react-native-fs';



const getGeoJSON = () => {
    let realm;
    const AllGeoJSONs = new Map();

    fs.copyFileAssets('firstFloor.realm',fs.DocumentDirectoryPath+'/firstFloor.realm')
    .then(()=>{
      realm = new Realm({
        schema: [Building], 
        path: fs.DocumentDirectoryPath+'/firstFloor.realm', 
      });
      try {
        console.log('REALM PATH', Realm.defaultPath);
        console.log("open successfully")
  
        const buildings = realm.objects('Building');
        console.log(buildings)
        // const feature = realm.objects('Feature');       

        // buildings.forEach(building => {
        //   const buildingName = building.building_name
        //   const buildingID = building.building_id
        //   buildingFloorIndeices = building.building_floor_indiceies

        //   for(i =0; i <buildingFloorIndeices.length;i++){
        //     let features = feature.filter(`buillding_id == "${buildingID}" AND building_floor == "${buildingFloorIndeices[i]}"`)
        //     if(features.length!==0){
        //       const contour =  features.filter('feature_type == "contour"')
        //       const rooms = features.filter('feature_type == "room"')
        //       const GeoJSONContour = {
        //         "type":"featureCollection",
        //         "name":buildingName,
        //         "features":[{
        //           "type": "Feature",
        //           "properties":{
        //             "room": "",
        //             "floor":contour.building_floor,
        //             "color": contour.feature_color,
                  
        //           "layer_name": contour.feature_layer_name,
        //           "height": contour.feature_height,
        //           "base_height": contour.feature_base_height
        //           },
        //           "geometry": {
        //             "type": contour.feature_geometry.geometry_type,
        //             "coordiantes": contour.feature_geometry.geometry_coordinates
        //           }
        //           }
        //         ],
        //         "floor_indicies": buildingFloorIndeices,
        //         "default_floor": building.building_default_floor
        //       }
        //       AllGeoJSONs.set(contour.feature_layer_name,GeoJSONContour)

        //       const GeoJSONRoom = {
        //         "type":"featureCollection",
        //         "name":buildingName,
        //         "features":rooms.map(room=>{
        //           return {
        //           "type": "Feature",
        //           "properties":{
        //             "room": "",
        //             "floor":room.building_floor,
        //             "color": room.feature_color,
                  
        //           "layer_name": room.feature_layer_name,
        //           "height": room.feature_height,
        //           "base_height": room.feature_base_height
        //           },
        //           "geometry": {
        //             "type": room.feature_geometry.geometry_type,
        //             "coordiantes": room.feature_geometry.geometry_coordinates
        //           }
        //           }
        //         }),
        //         "floor_indicies": buildingFloorIndeices,
        //         "default_floor": building.building_default_floor
        //       }
        //       AllGeoJSONs.set(rooms[0].feature_layer_name,GeoJSONRoom)
              

        //     }
            
        //   }
        // })


        
        


      
      } catch (error) {
        console.error('Error opening Realm database:', error);
      } finally {
        if (realm) {
          realm.close(); 
        }
      }
    });
    

  
    
    
    return AllGeoJSONs
  };
  
  export default getGeoJSON;


