import {createStore, combineReducers} from 'redux';
import  GeoJsonReducer from './reducers/getGeoJsonReducer';
import  MapStateReducer from './reducers/getMapstateReducer';
import  FilterReducer from './reducers/getFilterReducer';
import IsCameraMovingReducer from './reducers/getIsCameraMovingReducer'

const rootReducer = combineReducers({
    GeoJSONs:  GeoJsonReducer,
    MapState:  MapStateReducer,
    Filter: FilterReducer,
    IsCameraMoving: IsCameraMovingReducer
});

export const Store = createStore(rootReducer);