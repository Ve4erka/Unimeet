import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../System/config';

export default async function GetCurrentEvent(eventKey){

    let result = "";
    result = await handleGetCurrentEvent(eventKey);
    return result;
    
}

const handleGetCurrentEvent = async (eventKey) => { 

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(Address + 'api/v1/events',{
        method: "GET",
        headers: {
            'EVENTUUID' : `${eventKey}`,
            'Authorization' : `Bearer ${accessToken}`,
        },
    });

    let data = await response.json();

    return data;
}