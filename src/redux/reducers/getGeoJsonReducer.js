import {SET_GEOJSON} from './setGeoJsonAction'
const initialState ={
    selectedGeoJSON: [],
};

export default (state = initialState,action)=>{
    switch (action.type) {
        case 'SET_GEOJSON':
            return {
                ...state,
                selectedGeoJSON: action.payload
            };
        default:
            return state;    
    }
    
};