import { UPLOAD_USERDATA} from
'./ActionTypes';
export const uploadUserData = (parameter) => {
   console.log('UPLOADUSERDATA',parameter);
   return {
      type: UPLOAD_USERDATA,
      payload: parameter
   }
}