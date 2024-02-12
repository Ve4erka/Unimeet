import { Component } from "react";
import { Address } from "../System/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function confirmEdit (data){
    let result = "";
    let formData = new FormData();
    console.log('Хрень пришедшая в сохранение изменений');
    console.log(data);
    for (let key in data){
        if(key == "user_education"){
            formData.append(key, JSON.stringify(data[key]));
        }
        else if (key == "user_img"){
            formData.append(key,{
                uri: data[key],
                type: 'image/jpeg',
                name: 'test.jpg'
            })
        }
        else{
            formData.append(key, data[key]);
        }
    }
    console.log('выгружаем данные');
    console.log(formData);
    result = await handleConfirmEdit(formData);
    return result;
};

const handleConfirmEdit = async (data) => {

    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log(accessToken);

    let response, result;
    // let test = new FormData();
    // test.append('test', 'test');
    response  = await fetch(Address+'api/v1/user', {
        method: "PUT",
        headers: {
            'enctype': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: data
        // method: "PUT",
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${accessToken}`,
        // },
        // body: JSON.stringify(data)
    })
    console.log('СТАТУС',response.status);
    console.log('СТАТУС ТЕКСТ',response.statusText);
    result = await response.json();    
    return result;
    
}