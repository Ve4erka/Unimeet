import react, {Component} from 'react'
import {View, Text, Button, Image, TextInput,TouchableOpacity, ImageBackground, BackHandler, SafeAreaView, ActivityIndicator, FlatList, StyleSheet} from 'react-native'
import { styles } from '../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Svg, SvgUri } from 'react-native-svg';
import EventElem from './EventElem';
import { Address } from '../API/System/config';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {connect} from 'react-redux';
import { ColorsApp } from '../styles/colors';
import ChatElem from './ChatElem';


class Chats extends Component{

    constructor(props){
        super(props)
        this.backHandler = null;
        this.state = {
            chats:[],
            isLoading:true,
        }
        this.user_hash = this.props.user_data.user_hash
    }

    componentDidMount(){
        
        this.client = new W3CWebSocket(`ws://unimeet.ru/ws/chat-list/?user_hash=${this.user_hash}`);

        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        this.client.onmessage =  (message) => {
            console.log(message);
            this.setState({isLoading:false})
            let chats = JSON.parse(message.data).user_chat_list;
            console.log(chats);
            this.setState({chats:chats});
        }
    }

    
    loadEventsScene(){
        this.props.navigation.navigate('Events');
    }
    loadProfileScene(){
        this.props.navigation.navigate('Profile');
    }

    render(){

        const {chats, isLoading} = this.state;

        return(
            <GestureHandlerRootView style = {{flex:1}}>
            <View style = {[styles.container, {paddingTop:30}]}>
                <View style = {[styles.screenContent, chats_styles.mainContainer]}>
                    <Text style = {styles.screenTitle}>Чаты</Text>
                    <View style = {[styles.eventsContent, {}]}>
                        {isLoading ? (
                            <ActivityIndicator color = {ColorsApp.main_color} size = "large"/>
                            ) : (
                            <FlatList
                                overScrollMode="never"
                                showsVerticalScrollIndicator={false}
                                data={chats}
                                keyExtractor={item => item["chat_id"]}
                                renderItem={({item}) => (
                                    <ChatElem
                                        data = {item}
                                        navigation = {this.props.navigation}
                                    />
                                )}
                            />
                        )}
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress = {()=>{this.loadEventsScene()}}>
                            <Image
                                source={require('../images/eventsIcon.png')}
                                style = {styles.footerImg}
                            />
                        </TouchableOpacity>
                        <Image
                            style = {styles.footerImg}
                            source={require('../images/messagesIcon.png')}
                        />
                        <TouchableOpacity onPress = {()=>{this.loadProfileScene()}}>
                            <Image
                                source={require('../images/userIcon.png')}
                                style = {styles.footerImg}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </GestureHandlerRootView>
        )
    }
}

const chats_styles = StyleSheet.create({
    mainContainer:{
        paddingHorizontal:10,
    },
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
            user_hash: state.user_hash,
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

export default connect(mapStateToProps, mapDispatchToProps)(Chats);