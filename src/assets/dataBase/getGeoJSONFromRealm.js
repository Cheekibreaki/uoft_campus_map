const Realm = require('realm');
const Building = require('./database.js').Building;
const Feature = require('./database.js').Feature;
const Geometry = require('./database.js').Geometry;
import fs from 'react-native-fs';



const getGeoJSON = () => {
    let realm;
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
        const feature = realm.objects('Feature');
        const geometry = realm.objects('Geometry');

        // buildings.forEach(building => {
        //   console.log('Building ID:', building.building_id);
        //   console.log('Building Name:', building.building_name);
        //   console.log('Building Floor Indices:', building.building_floor_indicies);
        //   console.log('Building Default Floor:', building.building_default_floor);
        //   console.log('-----------------------------');
        // })

        // buildings.forEach(building => {
        //   const buildingName = building.building_name
        //   const buildingID = building.building_id
        //   buildingFloorIndeices = building.building_floor_indiceies

        //   for(i =0; i <buildingFloorIndeices.length;i++){
        //     let features = feature.filter(`buillding_id == "${buildingID}" AND building_floor == "${buildingFloorIndeices[i]}"`)

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
    

  
    
    
    // return (
    //   <>
    //   </>
    // );
  };
  
  export default getGeoJSON;


