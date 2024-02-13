import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Image } from 'react-native';
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';
import {connect} from 'react-redux';
import { uploadUserData} from '../redux/Action';
import EditNameAge from "./EditComponent/editName";
import EditEducation from './EditComponent/editEducation';
import EditAboutMe from './EditComponent/editAboutMe';
import EditProfilePhoto from './EditComponent/editProfilePhoto';
import Edit from '../API/Account/Edit';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditContentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentIndex: 0,
            inputValues: {
                user_name : props.data_user.user_name,
                user_age : props.data_user.user_age,
                user_description : props.data_user.user_description,
                user_education : {
                    "faculty" : props.data_user.user_education["faculty"] ? props.data_user.user_education["faculty"] : "",
                    "direction" : props.data_user.user_education["direction"] ? props.data_user.user_education["direction"] : "",
                },
                user_img : props.data_user.user_img,
            },
        };
    }

    handleInputChange = (componentName, value) => {
        if (componentName === 'user_education') {
            this.setState((prevState) => ({
                inputValues: {
                    ...prevState.inputValues,
                    user_education: {
                        ...prevState.inputValues.user_education,
                        [value["faculty"] ? "faculty" : "direction"]: value["faculty"] ? value["faculty"] : value["direction"],
                    },
                },
            }));
        } else {
            this.setState((prevState) => ({
                inputValues: {
                    ...prevState.inputValues,
                    [componentName]: value,
                },
            }));
        }
    }

    async confirmChanges() {
        console.log(this.state.inputValues);
        let result = await Edit(this.state.inputValues);
        if(result["result"]){
            if (Object.keys(result["data"]).length){
                this.props.updateUserData(result["data"]);
            }
        }        
    };

    componentDidMount(){     
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));
    } 
    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }
    backAction = () => {
        this.props.navigation.navigate("Profile");
        return true;
    }

    loadProfileScreen = () =>{
        this.props.navigation.navigate("Profile");
    }

    async logOut(){
        await AsyncStorage.setItem('accessToken', "");
        await AsyncStorage.setItem('refreshToken', "");
        this.props.navigation.navigate("Login")
    }

    render() {
        const { inputValues } = this.state;
        return (
            <GestureHandlerRootView style = {{"flex" : 1}}>
                <View style={[styles.container, edit_styles.paddings_main]}>
                    <TouchableOpacity
                        style = {edit_styles.backActionButton}
                        onPress={this.loadProfileScreen}
                    >
                        <Image
                            source = {require("../images/arrowBack.png")}
                            style = {edit_styles.backActionIcon}
                        />
                    </TouchableOpacity>
                    <ScrollView>
                        <EditProfilePhoto onInputChange={this.handleInputChange} defaultValue = {inputValues["user_img"]}/>
                        <EditNameAge onInputChange={this.handleInputChange} defaultValue = {{"name" : inputValues["user_name"], "age" : inputValues["user_age"]}} />
                        <EditEducation onInputChange={this.handleInputChange} defaultValue = {inputValues["user_education"]} />
                        <EditAboutMe onInputChange={this.handleInputChange} defaultValue = {inputValues["user_description"]} />
                        <TouchableOpacity style = {edit_styles.edit_button} onPress={ () => this.confirmChanges() }><Text style = {edit_styles.edit_button_text} >Сохранить</Text></TouchableOpacity>
                        <TouchableOpacity style = {[edit_styles.edit_button]} onPress={ () => {this.logOut()} }><Text style = {[edit_styles.edit_button_text, {color:ColorsApp.main_red}]} >Выйти</Text></TouchableOpacity>
                    </ScrollView>
                </View>
            </GestureHandlerRootView>
        );
    }
}

const mapStateToProps = (data) => {
    return {
        "data_user" : {
            user_name: data.user_name, //initailState
            user_age: data.user_age,
            user_description:data.user_description,
            user_education:data.user_education,
            user_img:data.user_img,
        }
    }
}
const mapDispatchToProps = (dispatch) => {
    return { 
        updateUserData: (parameter) => {
            dispatch(uploadUserData(parameter))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditContentScreen);

const edit_styles = StyleSheet.create({
    paddings_main:{
        paddingTop: 30,
        paddingHorizontal:10,
        backgroundColor:ColorsApp.fields_bg,
    },
    backActionButton:{
        width:40,
        height:40,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:ColorsApp.white,
        borderRadius:8,
        marginBottom:10,
    },
    backActionIcon:{
        width:25,
        height:25,
    },
    edit_content:{
        paddingHorizontal:10,
        paddingVertical: 20,
        height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent: "space-between",
        alignItems:"center",
        // borderWidth: 1,
        borderRadius:8,
        // borderColor: ColorsApp.main_color,
        backgroundColor:"red",
    },
    edit_button :{
        height:40,
        borderRadius:8,
        backgroundColor:ColorsApp.white,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15,
    },
    edit_button_text:{
        color: ColorsApp.main_color,
        fontSize: 16,
    },
    edit_block_buttons:{
        display:"flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop:20,
        width:"100%",
    },
    edit_block_buttons_first:{
        display:"flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginTop:20,
        width: "100%",
    }
})