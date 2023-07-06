import {createStore, combineReducers} from 'redux';
import getGeoJSONReducer from './reducers/getGeoJsonReducer';

const rootReducer = combineReducers({
    GeoJSONs: getGeoJSONReducer,
});

export const store = createStore(rootReducer);