export const setWifiGrant = isGranted =>{
    return {
        type:'SET_WIFIGRANT',
        payload: isGranted 
    };
};