export const SET_ISCAMERAMOVING = 'SET_ISCAMERAMOVING'

export const setIsCameraMoving = isCameraMoving => {
    return {
        type: 'SET_ISCAMERAMOVING',
        payload: isCameraMoving
    };
};

