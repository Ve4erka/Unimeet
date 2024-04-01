import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import { connect } from 'react-redux';
import GetCurrentMember from '../API/Events/GetCurrentMember';
import { ColorsApp } from '../styles/colors';
import { styles } from '../styles/styles';
import { Modalize } from 'react-native-modalize';


class CurrentChatPage extends Component {
    constructor(props) {
        super(props);
        console.log('ПРОПСЫ ЭКРАНА ЧАТА');
        // console.log(props);
        this.chatId = props.route.params.chat_id;
        this.chat_name = props.route.params.data_generate.chat_name;
        console.log(this.chatId);
        this.user_hash = props.user_data.user_hash;
        this.user_data = props.user_data;
        this.height = Dimensions.get('screen').height;
        this.width = Dimensions.get('screen').width;
        this.modalizeRef = React.createRef();
        console.log(this.user_hash);
        this.chatRef = React.createRef();
        this.state = {
            count_all_unread_messages: 0,
            count_current_messages: 0,
            messages: [],
            can_read: true,
            unread_messages: {},
            show_unread_notif: false,
            first_unread_message_id: null,
            date_first_taken: "",
            get_more: true,
            date_last_unread: "",
            get_more_unread: true,
            members: {}
        }
    }

    componentDidMount() {
        this.client = new W3CWebSocket(`ws://unimeet.ru/ws/chat/${this.chatId}/?user_hash=${this.user_hash}`);

        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        this.client.onmessage = async (message) => {
            let message_parsed = JSON.parse(message.data);
            console.log('//////////////////////////');
            console.log(message_parsed.members_list);
            if (message_parsed.members_list) {
                this.setState({ members: message_parsed.members_list.event_users },()=>{
                    console.log(this.state.members);
                });
            }
            let count_already_read_messages = message_parsed.messages ? message_parsed.messages.length : 0;
            // let count_already_read_messages = message_parsed.messages?.length;
            if (message_parsed.type == "previous_messages") {
                if (count_already_read_messages) {
                    this.setState({ date_first_taken: message_parsed.messages[0].message_data.createdAt });
                    for (let current_message of message_parsed.messages) {
                        let parsedMessage = current_message.message_data;
                        this.setState((previousState) => ({
                            messages: GiftedChat.append(previousState.messages, parsedMessage),
                        }));
                    }
                }
                if (message_parsed.unread_messages.length) {
                    if (message_parsed.unread_messages.length == 30) {
                        this.setState({ date_last_unread: message_parsed.unread_messages[message_parsed.unread_messages.length - 1].message_data.createdAt, get_more_unread: true });
                    }
                    this.setState({ count_all_unread_messages: message_parsed.unread_messages.length, show_unread_notif: true });
                    this.setState({ first_unread_message_id: message_parsed.unread_messages[0].message_data._id });
                    for (let unreaded_message of message_parsed.unread_messages) {
                        let current_unreaded_message = unreaded_message.message_data;
                        current_unreaded_message["old"] = true;
                        this.setState((previousState) => ({
                            messages: GiftedChat.append(previousState.messages, current_unreaded_message),
                        }));
                    }
                }
            }
            else {
                console.log('Мы сразу упали сюда');
                if (message_parsed.loading_more) {
                    if (message_parsed.messages.length) {
                        this.setState({ date_first_taken: message_parsed.messages[message_parsed.messages.length - 1].message_data.createdAt }, () => {
                        });
                        for (let new_message of message_parsed.messages) {
                            //console.log(new_message);
                            new_message.message_data["old_read"] = true;
                            this.setState((previousState) => ({
                                messages: GiftedChat.prepend(previousState.messages, new_message.message_data),
                            }));
                        }
                        this.setState({ get_more: false });
                    }
                    else {
                        if (message_parsed.unread_messages.length) {
                            this.setState({ date_last_unread: message_parsed.unread_messages[message_parsed.unread_messages.length - 1].message_data.createdAt })
                            for (let unread_message of message_parsed.unread_messages) {

                                unread_message.message_data["new"] = true;
                                this.setState((previousState) => ({
                                    messages: GiftedChat.append(previousState.messages, unread_message.message_data),
                                }));
                            }
                            this.setState({ get_more_unread: false });
                        }

                    }
                }
                else {
                    console.log('Теперь сюда');
                    if (this.state.count_all_unread_messages < 30) {
                        console.log('А затем вообще сюда');
                        if (!this.state.can_read) {
                            message_parsed["unread"] = true;
                        }
                        else {
                            let message_id = message_parsed._id;
                            let data = {
                                "chat_id": this.chatId,
                                "user_hash": this.user_hash,
                                "message_id": message_id,
                            }
                            this.client.send(JSON.stringify({ "change_message_state": data }));

                        }
                        this.setState((previousState) => ({
                            messages: GiftedChat.append(previousState.messages, message_parsed),
                        }));
                    }
                    else {
                        //пока хз че тут должно быть
                    }

                }

            }
        };
    }

    getItemLayout = (data, index) => ({
        length: 50,
        offset: 50 * index,
        index,
    });

    scrollToTop = () => {
        console.log('произошел вызов');
        this.chatRef.current.scrollToIndex({ animated: false, index: this.state.count_all_unread_messages + 1 });
    };

    onSend(messages = []) {
        this.client.send(JSON.stringify(messages[0]));
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    onScroll = (event) => {

        const { contentOffset } = event;
        let download_messages_point = 0.7 * (event.contentSize.height - event.layoutMeasurement.height);

        if (contentOffset.y < 50) {
            this.setState({ can_read: true })
        }
        else {
            if (contentOffset.y > download_messages_point && this.state.get_more) {
                //запросить еще сообщения

                data_get_more = {
                    "user_hash": this.user_hash,
                    "last_read_message_date": this.state.date_first_taken,
                }
                console.log(data_get_more);
                this.setState(prevState => ({
                    trigger_height: prevState.trigger_height + Dimensions.get('window').height / 2
                }));
                this.client.send(JSON.stringify({ "get_more_messages": data_get_more }));
                this.setState({ get_more: false });
            }
            this.setState({ can_read: false })
        }

        let current_height_of_unread_messages = 0;

        for (let key in this.state.unread_messages) {
            current_height_of_unread_messages += this.state.unread_messages[key];
        }
        if (Number(contentOffset.y) < Number(current_height_of_unread_messages)) {
            const updatedUnreadMessages = { ...this.state.unread_messages };
            let chat_id = this.chatId;
            let user_hash = this.user_hash;
            let data = {
                "chat_id": chat_id,
                "user_hash": user_hash,
                "message_id": Object.keys(this.state.unread_messages)[0],
            }
            this.client.send(JSON.stringify({ "change_message_state": data }));
            delete updatedUnreadMessages[Object.keys(this.state.unread_messages)[0]];
            this.setState({ unread_messages: updatedUnreadMessages });
            console.log('Мы только что прочитали');
            if (Number(contentOffset.y) < 300) {
                if (this.state.count_all_unread_messages == 30 && this.state.get_more_unread) {
                    //Делаем запрос на дополнительные непрочитанные
                    data_get_more = {
                        "user_hash": this.user_hash,
                        "last_unread_message_date": this.state.date_last_unread,
                    }
                    this.client.send(JSON.stringify({ "get_more_unread_messages": data_get_more }));
                    this.setState({ get_more_unread: false });
                }
                // this.setState(prevState => ({
                //     show_unread_notif: false
                // }), () => {
                //     console.log('UPDATED notif:', this.state.show_unread_notif);
                // });
            }
        }

    }

    handlePressAvatar = async (user, type = '') => {
        let memberData = {};
        if(type == 'modal'){
            memberData = await GetCurrentMember(user);
        }
        else{
            memberData = await GetCurrentMember(user._id);
        }
       
        console.log(memberData);
        this.props.navigation.navigate('MemberProfilePage', { data_user: memberData });
    }

    openMembersList = () => {
        console.log('визвался');
        console.log(this.state.members);
        if (this.state.members.length){
            this.modalizeRef.current?.open();
        }
        else{
            return;
        }
        
    }

    renderUser = (item) => {

        console.log('ITEM');
        console.log(item);
        return (
            <TouchableOpacity
                style={chat_page_styles.memberPattern}
                onPress={() => { this.handlePressAvatar(item.item.user_hash, 'modal') }}
            >
                <View style={chat_page_styles.memberPhotoBlock}>
                    <Image
                        source={item.item.user_image ? { uri: item.item.user_image } : require('../images/memberEmptyImg.png')}
                        style={chat_page_styles.memberPhotoStyle}
                    />
                </View>
                <View style={[chat_page_styles.memberNameBlock, { width: this.width - 75 }]}>
                    <Text style={chat_page_styles.memberName}>{item.item.user_name ? item.item.user_name : "Варакин Иван"}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        const { count_all_unread_messages, show_unread_notif, first_unread_message_id, members } = this.state;

        return (
            <GestureHandlerRootView style={[styles.container, { paddingTop: 0 }]}>
                <View style={chat_page_styles.header}>
                    <Text style={chat_page_styles.header_title}>{this.chat_name}</Text>
                    <TouchableOpacity
                        onPress={this.openMembersList}
                    >
                        <Text style={chat_page_styles.header_members}>Участники</Text>
                    </TouchableOpacity>
                </View>
                <GiftedChat
                    messageContainerRef={this.chatRef}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    timeFormat="HH:mm"
                    dateFormat='DD.MM.YYYY'
                    user={{ _id: this.user_data.user_hash, name: this.user_data.user_name, avatar: this.user_data.user_img }} // Уникальный идентификатор пользователя
                    listViewProps={{
                        onScroll: ({ nativeEvent }) => {
                            this.onScroll(nativeEvent);
                        },
                        getItemLayout: this.getItemLayout,
                    }}
                    renderBubble={(props) => (
                        <View onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            if ((props.currentMessage.new && props.currentMessage.unread) || props.currentMessage.old) {
                                const messageId = props.currentMessage._id;
                                //console.log(messageId, 'Мессага ИД');
                                this.setState(prevState => ({
                                    unread_messages: { ...prevState.unread_messages, [messageId]: height },
                                }), () => {
                                    if (count_all_unread_messages == Object.keys(this.state.unread_messages).length && this.state.get_more_unread) this.scrollToTop();
                                });
                                if (props.currentMessage.createdAt == this.state.date_last_unread) {
                                    this.setState({ get_more_unread: true });
                                }
                            }
                            if (props.currentMessage.old_read) {
                                if (props.currentMessage.createdAt == this.state.date_first_taken) {
                                    this.setState({ get_more: true });
                                }
                            }
                        }}>
                            {show_unread_notif && ((props.currentMessage.new && props.currentMessage.unread) || props.currentMessage.old) && props.currentMessage._id == first_unread_message_id ? <Text style = {chat_page_styles.unread_message_notif}>Непрочитанные сообщения</Text> : <></>}
                            <Bubble
                                {...props}
                                wrapperStyle={{
                                    left: {
                                        //backgroundColor: 'lightblue',
                                        minHeight: 50,
                                    },
                                    right: {
                                        //backgroundColor: 'lightgreen',
                                        minHeight: 50,
                                    },
                                }}
                            />
                        </View>
                    )}
                    messagesContainerStyle={chat_page_styles.chat_container}
                    onPressAvatar={this.handlePressAvatar}
                />
                <Modalize
                    ref={this.modalizeRef}
                    //alwaysOpen={190}
                    handlePosition='inside'
                    avoidKeyboardLikeIOS={true}
                    modalHeight={this.height - 50}
                    snapPoint={this.height / 2}
                    modalStyle={[chat_page_styles.modalizeContainer, { width: this.width - 2 }]}
                    handleStyle={styles.modalizeHandleShape}
                    flatListProps={
                        members
                            ? {
                                data: members,
                                renderItem: this.renderUser,
                            }
                            : undefined
                    }
                >
                </Modalize>
            </GestureHandlerRootView>
        )
    }
}

const chat_page_styles = StyleSheet.create({
    chat_container: {
        backgroundColor: ColorsApp.white,
    },
    header: {
        height: 75,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsApp.fields_bg,
        borderBottomWidth: 1,
        borderBottomColor: ColorsApp.lines_color,
        paddingTop:30,
        paddingBottom:10,
    },
    unread_message_notif:{
        width: 300,
        marginHorizontal:0,
        textAlign:'center',
        backgroundColor:ColorsApp.fields_bg,
        color:ColorsApp.main_color,
        borderRadius:5,
        marginBottom:5,
        marginTop:2,
    },
    header_title: {
        color: ColorsApp.font_color,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
    header_members: {
        color: ColorsApp.main_color,
        textAlign: 'center',
        fontSize: 14,
    },
    modalizeContainer:{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding:10,
        paddingTop:30,
        marginHorizontal:'auto',
        marginLeft:1,
    },
    modalizeHandleShape:{
        backgroundColor: ColorsApp.main_color,
        top:15
    },
    memberPattern:{
        display:'flex',
        flexDirection:'row',
        height: 50,
    },
    memberPhotoBlock:{
        width: 50,
        height: 50,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        marginRight: 5,
    },
    memberPhotoStyle:{
        width: 40,
        height: 40,
        borderRadius:20,
    },
    memberNameBlock:{
        display: 'flex',
        flexDirection:"column",
        height: 50,
        justifyContent:"center",
        borderBottomWidth: 1,
        borderBottomColor: ColorsApp.lines_color,
    },
    memberName: {
        fontSize:18,
        //fontWeight: 500,
        color: ColorsApp.font_color,
    },
})

const mapStateToProps = (state) => {
    console.log('STATE');
    console.log(state);
    return {
        user_data: {
            user_name: state.user_name,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentChatPage);