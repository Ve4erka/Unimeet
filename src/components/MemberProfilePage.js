import react, {useEffect, useState, Component, useRef, createRef} from 'react'
import {View, Text, Image, BackHandler, ImageBackground, Dimensions, TouchableOpacity, StyleSheet} from 'react-native'
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import { Address } from '../API/System/config';
import dataForEducation from './EditComponent/dataForEducation';

class MemberProfilePage extends Component{

    constructor(props) {
        super(props);
        console.log('Пропсы экрана мембера')
        console.log(props);
        this.data_user = props.route.params.data_user.data;
        this.height = Dimensions.get('screen').height;
        this.width = Dimensions.get('screen').width;
        this.modalizeRef = createRef(null);
        this.backHandler = null;
    }
    componentDidMount(){     
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));
    } 
    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }
    backAction() {
        this.props.navigation.goBack();
        return true;
    }
    
    render(){

        let faculty = this.data_user.user_education.faculty ? this.data_user.user_education.faculty : "";
        let direction = "";
        let empty = true;
        if (faculty && this.data_user.user_education.direction){
            direction = dataForEducation["directions"][faculty][this.data_user.user_education.direction]["label"];
            faculty = dataForEducation["faculties"][faculty]["label"];
            empty = false;
        }
        console.log(this.data_user);
        return (
            <GestureHandlerRootView style = {{flex:1}}>
                <View style = {[styles.container, {padding:0, backgroundColor:ColorsApp.fields_bg}]}>
                    <View style = {[styles.screenContent, {paddingHorizontal:0}]}>
                        <ImageBackground 
                            {
                                ...this.data_user.user_img && this.data_user.user_img.length !== 0 ? 
                                ({
                                    source: { uri: Address+ 'api/v1' + this.data_user.user_img[0].entity_img },
                                    resizeMode: 'cover'
                                }) 
                                :
                                ({
                                    source: require('../images/mainIcon.png'),
                                    resizeMode: "contain"
                                })
                            }
                            style={styles.profilePhoto} 
                            >
                        </ImageBackground>
                        <Modalize 
                            ref={this.modalizeRef}
                            alwaysOpen={190}
                            handlePosition='inside'
                            avoidKeyboardLikeIOS={true}
                            modalHeight={this.height/2}
                            snapPoint={this.height/2}
                            modalStyle={[profile_styles.modalize_content, {width:this.width}]}
                            handleStyle = {profile_styles.modalize_handleShape}
                        >
                            <View style={profile_styles.profileName}>
                                <Text style={profile_styles.profileNameText}>
                                    {this.data_user.user_name ? this.data_user.user_name + "," : ""}
                                    {this.data_user.user_age ? ` ${this.data_user.user_age}` : ''}
                                </Text>
                            </View>
                            <View style = {profile_styles.infoBlock}>
                                <Text style = {profile_styles.infoBlockTitle}>Образование</Text>
                                <Text style = {profile_styles.infoBlockContent}>
                                    {
                                        empty ? 'Заполните поле "Образование" в меню редактирования': faculty + ', ' + direction
                                    }
                                </Text>
                            </View>
                            <View style = {profile_styles.infoBlock}>
                                <Text style = {profile_styles.infoBlockTitle}>Обо мне</Text>
                                <Text style = {profile_styles.infoBlockContent}>{this.data_user.user_description}</Text>
                            </View>
                        </Modalize>
                    </View>
                </View>
            </GestureHandlerRootView>
        )
    }
}
const profile_styles = StyleSheet.create({
    edit_content_action: {
        position:'absolute',
        top:60,
        right:40,
    },
    editIcon:{
        width:30,
        height:30,
    },
    modalize_content:{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding:10,
        marginHorizontal:'auto',
    },
    modalize_handleShape:{
        backgroundColor: ColorsApp.main_color,
        top:15
    },
    infoBlock:{
        marginTop:10,
        color:ColorsApp.font_color
    },
    infoBlockTitle:{
        fontSize:16,
        //fontWeight:500,
        lineHeight:18,
        marginBottom:5,
        color:ColorsApp.font_color,
    },
    infoBlockContent:{
        fontSize:14,
        //fontWeight:400,
        lineHeight:18,
        color:ColorsApp.font_color
    },
    profileName:{
        marginTop:15,
    },
    profileNameText:{
        fontSize:22,
        //fontWeight:700,
        color: ColorsApp.font_color,
    }
})

export default MemberProfilePage;