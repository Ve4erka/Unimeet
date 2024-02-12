import { UPLOAD_USERDATA } from './ActionTypes';

//initializing state
const initialState = {
   user_name: '',
   user_age: null,
   user_img: null,
   user_education : {},
   user_description:"",
}
const counterReducer = (state = initialState, action) => {
   console.log('БАБУБЫ')
   console.log(state);
   console.log(action);
   console.log('TEST',action.payload);
   //console.log(action.payload.data.user_img)
   // console.log(action.payload.data.user_name);
   switch (action.type) {
      case UPLOAD_USERDATA: 
         console.log('REDUCER', action.payload);
         return {
            ...state, 
            user_name: action.payload.user_name ? action.payload.user_name : "",
            user_age: action.payload.user_age ? action.payload.user_age : "",
            user_img: action.payload.user_img ? action.payload.user_img : "",
            user_education: action.payload.user_education ? action.payload.user_education : {},
            user_description: action.payload.user_description ? action.payload.user_description : "",
         }
      default: return state
   }
}
export default counterReducer;