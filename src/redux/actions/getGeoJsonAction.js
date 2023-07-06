export const getGeoJSON = (selectedGEOJSON)=>{
    return {
        type: 'GET_GEOJSON',
        payload: selectedGEOJSON
    };
};