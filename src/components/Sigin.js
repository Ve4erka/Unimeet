import react, {Component} from 'react'
import {View, Text, Button, Image, TextInput,TouchableOpacity, Alert} from 'react-native'
import { styles } from '../styles/styles';
import createUser from '../API/Account/CreateUser';
import { Address } from '../API/System/config';
import { Token } from '../API/Account/Token';

class Signin extends Component{

    constructor(props){
        super(props);
        this.state = {phoneNumber:null}
        this.state = {password:''}
    }

    handleAuthSign = async (phone_number, password) => {
        console.log(phone_number, password);
        let response, data;
        response = await fetch(Address+'api/v1/register',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': phone_number, 'password':password})
        });
        data = await response.json();
        //console.log('data',data);

        let result = {};
        result = await Token(this.state.phoneNumber, this.state.password);
        if(result["page"]){
            this.props.navigation.navigate(result["page"]);
        }
        else{
            Alert.alert(
                'Ошибка регистрации',
                'Попробуйте ещё раз',
                [
                    {
                        text:'Ок',
                        style:'cancel',
                    },
                ],
                { cancelable:false }
            );
        }
    }

    render(){
        return (
            <View style = {styles.container}>     
                <View style = {styles.contentInputBlock}>
                    <Image
                        source={require('../images/mainIcon.png')}
                        style={styles.loginIcon}
                    />
                    <View style = {styles.logInputBlock}>
                        <TextInput
                            keyboardType='phone-pad'
                            placeholder="Введите номер телефона"
                            style={styles.logInput}
                            value={this.state.phoneNumber}
                            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                        />
                        <TextInput
                            placeholder="Введите пароль"
                            style={styles.logInput}
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <TouchableOpacity
                            style={styles.logButton}
                            onPress= {()=>{this.handleAuthSign(this.state.phoneNumber, this.state.password, this.props.navigation)}} 
                        >
                            <Text style={styles.logButtonText}>Создать аккаунт</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default Signin