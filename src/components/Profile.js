import react, {useEffect, useState, Component, useRef, createRef} from 'react'
import {View, Text, Image, BackHandler, ImageBackground, Dimensions, TouchableOpacity, StyleSheet} from 'react-native'
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import { Address } from '../API/System/config';
import dataForEducation from './EditComponent/dataForEducation';

class Profile extends Component{

    constructor(props) {
        super(props);
        this.height = Dimensions.get('screen').height;
        this.width = Dimensions.get('screen').width;
        this.modalizeRef = createRef(null);
        this.backHandler = null;
        this.state = {
            user_data : this.props.user_data
        }
    }
    componentDidMount(){     
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));
    } 
    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.user_data && this.props.user_data !== prevProps.user_data){
            this.setState({ user_data: this.props.user_data });
        }
    }
    backAction() {
        this.props.navigation.navigate('Events');
        return true;
    }
    loadEditScreen = () => {
        this.componentWillUnmount();
        this.props.navigation.navigate('EditContentScreen');
    }
    
    render(){

        const {user_data} = this.state;

        let faculty = user_data.user_education.faculty ? user_data.user_education.faculty : "";
        let direction = "";
        let empty = true;
        if (faculty && user_data.user_education.direction){
            direction = dataForEducation["directions"][faculty][user_data.user_education.direction]["label"];
            faculty = dataForEducation["faculties"][faculty]["label"];
            empty = false;
        }

        console.log('ЭКРАН ПРОФИЛЯ')
        console.log(user_data);

        return (
            <GestureHandlerRootView style = {{flex:1}}>
                <View style = {[styles.container, {padding:0, backgroundColor:ColorsApp.fields_bg}]}>
                    <View style = {[styles.screenContent, {paddingHorizontal:0}]}>
                        <ImageBackground 
                            {
                                ...user_data.user_img ? 
                                ({
                                    source: { uri: user_data.user_img},
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
                        <View style = {profile_styles.edit_content_action}>
                            <TouchableOpacity
                                onPress={this.loadEditScreen}
                            >
                                <Image
                                    source={require('../images/editIcon3.png')}
                                    style = {profile_styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Modalize 
                            ref={this.modalizeRef}
                            alwaysOpen={190}
                            handlePosition='inside'
                            avoidKeyboardLikeIOS={true}
                            modalHeight={this.height/2}
                            snapPoint={this.height/2}
                            modalStyle={[profile_styles.modalize_content, {width:this.width - 2}]}
                            handleStyle = {profile_styles.modalize_handleShape}
                        >
                            <View style={profile_styles.profileName}>
                                <Text style={profile_styles.profileNameText}>
                                    {user_data.user_name ? user_data.user_name + "," : ""}
                                    {user_data.user_age ? ` ${user_data.user_age}` : ''}
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
                                <Text style = {profile_styles.infoBlockContent}>{user_data.user_description}</Text>
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
        marginLeft:1,
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

const mapStateToProps = (state) => {

    console.log('STATE');
    console.log(state);
    return {
        "user_data":{
            user_name: state.user_name, //initailState
            user_age: state.user_age,
            user_img:state.user_img,
            user_education:state.user_education,
            user_description:state.user_description,
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);