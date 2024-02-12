import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../System/config';
import Auth from './Auth';

export async function Token (phone_number, password) {

    const response = await fetch(Address+'api/v1/token/',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username': phone_number, 'password':password})
    });
    const data = await response.json();
    // console.log('TOKEN FROM LOGIN', data);
    if(data['access'] && data['refresh']){
        await AsyncStorage.setItem('accessToken', data['access']);
        await AsyncStorage.setItem('refreshToken', data['refresh']);
        //console.log('ЗАПУСК ИЗ ЛОГИНА')
        let data_auth = await Auth();
        return data_auth;
    }
    else{
        return false;
    }    
}