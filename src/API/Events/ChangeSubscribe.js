import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../System/config';

export default async function ChangeSubscribe(eventKey){

    let result = "";
    result = await handleChangeSubscribe(eventKey);
    return result;
    
}

const handleChangeSubscribe = async (eventKey) => { 

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(Address + 'api/v1/events/subscribe',{
        method: "POST",
        headers: {
            'EVENTUUID' : `${eventKey}`,
            'Authorization' : `Bearer ${accessToken}`,
        },
    });

    let data = await response.json();

    return data;
}