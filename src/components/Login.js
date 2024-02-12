import react, {Component} from 'react'
import {View, Text, Button, Image, TextInput,TouchableOpacity, Alert} from 'react-native'
import { styles } from '../styles/styles';
import {connect} from 'react-redux'
import { uploadUserData} from '../redux/Action';
import { Address } from '../API/System/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Token} from '../API/Account/Token';


class Login extends Component{

    constructor(props){
        super(props);
        this.state = {phoneNumber:null}
        this.state = {password:''}
    }
    handleAuthLogin = async () =>{
                
        let result = await Token(this.state.phoneNumber, this.state.password);
        if(result["page"]){
            this.props.updateUserData(result["data"]);
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
    loadSignInScene(){
        this.props.navigation.navigate('SignIn')
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
                            onPress= {()=>{this.handleAuthLogin(this.state.phoneNumber, this.state.password, this.props.navigation)}} 
                        >
                            <Text style={styles.logButtonText}>Войти</Text>
                        </TouchableOpacity>

                        <Text style = {{color:"#000000a1"}}>У вас нет аккаунта?</Text>
                        <TouchableOpacity
                            onPress={()=>{this.loadSignInScene()}}  
                        >
                            <Text style={styles.regText}> Создайте!</Text>
                        </TouchableOpacity>   
                    </View>
                </View>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
       username: state.username, //initailState
       userage: state.userage,
    }
 }
const mapDispatchToProps = (dispatch) => {
    return { 
       updateUserData: (parameter) => {
          dispatch(uploadUserData(parameter))
       },
     }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);