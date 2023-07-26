import {createStore, combineReducers} from 'redux';
import  GeoJsonReducer from './reducers/getGeoJsonReducer';
import  MapStateReducer from './reducers/getMapstateReducer';
import  FilterReducer from './reducers/getFilterReducer';

const rootReducer = combineReducers({
    GeoJSONs:  GeoJsonReducer,
    MapState:  MapStateReducer,
    Filter: FilterReducer
});

export const Store = createStore(rootReducer);