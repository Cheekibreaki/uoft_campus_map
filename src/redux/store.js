import {createStore, combineReducers} from 'redux';
import  GeoJsonReducer from './reducers/getGeoJsonReducer';
import  MapStateReducer from './reducers/getMapstateReducer';
import  FilterReducer from './reducers/getFilterReducer';
import IsCameraMovingReducer from './reducers/getIsCameraMovingReducer';
import GeoJsonInScreenReducer from './reducers/getFeatureInScreenReducer';
import SelectRoomReducer from './reducers/getSelectedRoomReducer';
import GeoJsonDataReducer from './reducers/getGeoJSONDataReducer';

const rootReducer = combineReducers({
    GeoJSONs:  GeoJsonReducer,
    MapState:  MapStateReducer,
    Filter: FilterReducer,
    IsCameraMoving: IsCameraMovingReducer,
    FeatureInScreen: GeoJsonInScreenReducer,
    SelectRoom: SelectRoomReducer,
    AllGeoJSONs: GeoJsonDataReducer
});

export const Store = createStore(rootReducer);