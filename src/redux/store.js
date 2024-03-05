import {createStore, combineReducers} from 'redux';
import  GeoJsonReducer from './reducers/getGeoJsonReducer';
import  MapStateReducer from './reducers/getMapstateReducer';
import  FilterReducer from './reducers/getFilterReducer';
import IsCameraMovingReducer from './reducers/getIsCameraMovingReducer';
import GeoJsonInScreenReducer from './reducers/getFeatureInScreenReducer';
import SelectRoomReducer from './reducers/getSelectedRoomReducer';
import GeoJsonDataReducer from './reducers/getGeoJSONDataReducer';
import HideUIElementsReducer from './reducers/getHideUIElementReducer';
import IsGrantedReducer from './reducers/getWifiGrantReducer';
import CameraPositionReducer from './reducers/getCameraPositionReducer';

const rootReducer = combineReducers({
    GeoJSONs:  GeoJsonReducer,
    MapState:  MapStateReducer,
    Filter: FilterReducer,
    IsCameraMoving: IsCameraMovingReducer,
    FeatureInScreen: GeoJsonInScreenReducer,
    SelectRoom: SelectRoomReducer,
    AllGeoJSONs: GeoJsonDataReducer,
    HideUIElements: HideUIElementsReducer,
    IsWifiGranted: IsGrantedReducer,
    CameraPosition: CameraPositionReducer,
});

export const Store = createStore(rootReducer);