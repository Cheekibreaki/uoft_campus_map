export const SET_GEOJSON = 'SET_GEOJSON'

export const setGeoJSON = selectedGEOJSON => {
    return {
        type: 'SET_GEOJSON',
        payload: selectedGEOJSON
    };
};

