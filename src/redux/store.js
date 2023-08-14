import {createStore, combineReducers} from 'redux';
import  GeoJsonReducer from './reducers/getGeoJsonReducer';
import  MapStateReducer from './reducers/getMapstateReducer';
import  FilterReducer from './reducers/getFilterReducer';
import IsCameraMovingReducer from './reducers/getIsCameraMovingReducer'
import GeoJsonInScreenReducer from './reducers/getFeatureInScreenReducer';

const rootReducer = combineReducers({
    GeoJSONs:  GeoJsonReducer,
    MapState:  MapStateReducer,
    Filter: FilterReducer,
    IsCameraMoving: IsCameraMovingReducer,
    FeatureInScreen: GeoJsonInScreenReducer
});

export const Store = createStore(rootReducer);