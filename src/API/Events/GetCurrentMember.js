import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../System/config';

export default async function GetCurrentMember(memberHash){

    let result = "";
    result = await handleGetCurrentMember(memberHash);
    return result;
    
}

const handleGetCurrentMember = async (memberHash) => { 

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(Address + 'api/v1/user',{
        method: "GET",
        headers: {
            'USERHASH' : `${memberHash}`,
            'Authorization' : `Bearer ${accessToken}`,
        },
    });

    let data = await response.json();

    return data;
}