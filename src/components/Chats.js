import react, { Component } from 'react'
import { View, Text, Button, Image, TextInput, TouchableOpacity, ImageBackground, BackHandler, SafeAreaView, ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { styles } from '../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Svg, SvgUri } from 'react-native-svg';
import EventElem from './EventElem';
import { Address } from '../API/System/config';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { connect } from 'react-redux';
import { ColorsApp } from '../styles/colors';
import ChatElem from './ChatElem';
import { Dimensions } from 'react-native';


class Chats extends Component {

    constructor(props) {
        super(props)
        this.backHandler = null;
        this.state = {
            chats: [],
            isLoading: true,
        }
        this.user_hash = this.props.user_data.user_hash;
        // console.log('ШЫРИНА')
        // console.log(Dimensions.get('window').width);
    }

    componentDidMount() {

        this.client = new W3CWebSocket(`ws://unimeet.ru/ws/chat-list/?user_hash=${this.user_hash}`);

        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        this.client.onmessage = (message) => {
            // console.log('Сообщения из CHATS');
            // console.log(message);
            const newChats = JSON.parse(message.data).user_chat_list;
            // console.log('То что прокидываем в State');
            // console.log(newChats);

            this.setState({
                isLoading: false,
                chats: newChats.slice() // создаем новый массив, чтобы обновить FlatList
            });
        };
    }

    renderChats(isLoading, chats) {

        // console.log('Вызвался?');
        // console.log(isLoading);
        // console.log(chats);
        if (isLoading) {
            return <ActivityIndicator color={ColorsApp.main_color} size="large" />
        }
        else {
            // console.log("Перерисовываем ъуъ")
            return <FlatList
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                data={chats}
                keyExtractor={item => item["chat_id"]}
                renderItem={({ item }) => (
                    <ChatElem
                        data={item}
                        navigation={this.props.navigation}
                    />
                )}
            />
        }
    }


    loadEventsScene() {
        this.props.navigation.navigate('Events');
    }
    loadProfileScene() {
        this.props.navigation.navigate('Profile');
    }

    render() {

        const { chats, isLoading } = this.state;
        // console.log('Генерация списка');
        // console.log(chats);

        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={[styles.container, { paddingTop: 0 }]}>
                    <View style={[styles.screenContent, chats_styles.mainContainer]}>
                        <View style = {chats_styles.header_block}>
                            <Text style={chats_styles.screenTitle}>Чаты</Text>
                        </View>
                        <View style={[styles.eventsContent]}>
                            {this.renderChats(isLoading, chats)}
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={() => { this.loadEventsScene() }}>
                                <SvgUri
                                    width="30"
                                    height="30"
                                    uri="https://unimeet.ru/api/v1/media/images/icons8-events-96-_1_.svg"
                                />
                            </TouchableOpacity>
                            <SvgUri
                                width="30"
                                height="30"
                                uri="https://unimeet.ru/api/v1/media/images/icons8-chat-96-_1_.svg"
                            />
                            <TouchableOpacity onPress={() => { this.loadProfileScene() }}>
                                <SvgUri
                                    width="30"
                                    height="30"
                                    uri="https://unimeet.ru/api/v1/media/images/icons8-male-user-96-_1_.svg"
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
    mainContainer: {
        paddingHorizontal: 0,
    },
    header_block:{
        backgroundColor:ColorsApp.fields_bg,
        height:70,
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-end',
        borderBottomWidth:1,
        borderColor:ColorsApp.lines_color,
    },
    screenTitle:{
        color:ColorsApp.font_color,
        fontWeight:'bold',
        textAlign:'center',
        fontSize:17,
        marginBottom:10,
    }
})

const mapStateToProps = (state) => {

    console.log('STATE');
    console.log(state);
    return {
        "user_data": {
            user_name: state.user_name, //initailState
            user_age: state.user_age,
            user_img: state.user_img,
            user_education: state.user_education,
            user_description: state.user_description,
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