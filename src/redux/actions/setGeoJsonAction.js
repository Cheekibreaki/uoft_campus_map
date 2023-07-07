export const SET_GEOJSON = 'SET_GEOJSON'

export const setGeoJSON = selectedGEOJSON => dispatch => {
    dispatch ({
        type: SET_GEOJSON,
        payload: selectedGEOJSON
    });
};