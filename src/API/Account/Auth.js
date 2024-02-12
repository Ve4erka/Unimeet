import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../System/config';

export default async function Auth(){

    let result = "";
    result = await handleAuth();
    return  result;
    
}

const handleAuth = async (type = "access") => { 
    // console.log('ВЫЗВАЛСЯ')
    // console.log(await AsyncStorage.getItem('accessToken'), await AsyncStorage.getItem('refreshToken'));
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    
    if(accessToken == "undefined" || accessToken == null || accessToken == ""){
        console.log('Пусто');
        return {"page":"Login", "data":{}};
    }

    if (type == "access"){
        // console.log(type);
        const response = await fetch(Address + 'api/v1/user',{
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        let data = await response.json();
        // console.log('access 34', data);
        if(data["code"] || data["detail"]){
            // console.log('refresh');
            let result = await handleAuth('refresh');
            return result;
        }
        else{
            data["page"] = "Events";
            return data;
        }
    }
    else if (type == "refresh"){
        // console.log(type);
        const response = await fetch(Address + 'api/v1/token/refresh/',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'refresh':refreshToken})
        });
        const data = await response.json();
        // console.log('54',data);
        if(data["code"]){
            return {"page":"Login"}
        }
        else{
            await AsyncStorage.setItem('accessToken', data["access"]);
            let result = await handleAuth('access');
            return result;
        }
        
    }
}