import { Component } from "react";
import { Address } from "../System/config";

export default function createUser (phone_number, password, navigation){

    fetch(Address+'/add', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({phone_number:phone_number, password:password})
    })
    .then(res => {
      return res.json();
    })
    .then(
        (result) => {
            console.log(result);
            // if(result.result.status == 200){
            //     navigation.navigate('Events');
            // }
            
      },
      (error) => {
            console.log(error);
      }
    )

};
