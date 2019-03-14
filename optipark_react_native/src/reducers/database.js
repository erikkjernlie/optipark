
let defaultState = {
  //from auth
  /*
  currUser: {},
  //from rtdb
  userInfo: {
    username: "krisaa",
    email: "k@123.no",
    uid: "123455",
    isParked: false,

  },
  */
  login: false,
  isLoading: false,
  authError: '',
  isLoadingRegister: false,
}

export default (state = { defaultState }, action) => {

  switch (action.type) {

    case 'USER-INFO':
      return {
        ...state,
        userInfo: action.payload
      };
    case 'LOGIN':
      return {
        ...state,
        login: action.payload,
        authError: ''
      };
    case 'GET-GEO':
      return {
        ...state,
        json: action.payload,
        entrance: action.payload.entrance,
        corners: action.payload.corners,
        support: action.payload.support,
        sensors: action.payload.sensors,

      }
    case 'START-LOGIN':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        authError: action.err.message,
      }
    case 'START-REGISTER':
      return {
        isLoadingRegister: true,
        authError: '',
      }
    case 'REGISTER_ERROR':
      return {
        ...state,
        authError: action.err.message,
        isLoadingRegister: false,

      }
    case 'REGISTER_ERROR_STOP':
      return {
        ...state,
        isLoadingRegister: false,
      }
    default:
      return defaultState;
  }
};