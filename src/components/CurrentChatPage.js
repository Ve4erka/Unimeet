import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import { connect } from 'react-redux';


class CurrentChatPage extends Component {
    constructor(props) {
        super(props);
        console.log('ПРОПСЫ ЭКРАНА ЧАТА');
        console.log(props);
        this.chatId = props.route.params.chat_id;
        console.log(this.chatId);
        this.user_hash = props.user_data.user_hash;
        this.user_data = props.user_data;
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
            date_last_unread:"",
            get_more_unread: true,
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
            console.log(message_parsed);
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
                        this.setState({ date_last_unread: message_parsed.unread_messages[message_parsed.unread_messages.length - 1].message_data.createdAt, get_more_unread : true });
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
                        this.setState({ date_first_taken: message_parsed.messages[message_parsed.messages.length - 1].message_data.createdAt }, ()=>{
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
                        if(message_parsed.unread_messages.length){
                            this.setState({ date_last_unread: message_parsed.unread_messages[message_parsed.unread_messages.length - 1].message_data.createdAt })
                            for (let unread_message of message_parsed.unread_messages){

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

    handlePressAvatar = (user) =>{
        console.log(user);
    }

    render() {

        const { count_all_unread_messages, show_unread_notif, first_unread_message_id } = this.state;

        return (
            <>
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
                            if ((props.currentMessage.new && props.currentMessage.unread) || props.currentMessage.old ) {
                                const messageId = props.currentMessage._id;
                                //console.log(messageId, 'Мессага ИД');
                                this.setState(prevState => ({
                                    unread_messages: { ...prevState.unread_messages, [messageId]: height },
                                }), () => {
                                    if (count_all_unread_messages == Object.keys(this.state.unread_messages).length && this.state.get_more_unread) this.scrollToTop();
                                });
                                if (props.currentMessage.createdAt == this.state.date_last_unread){
                                    this.setState({get_more_unread : true});
                                }
                            }
                            if(props.currentMessage.old_read){
                                if (props.currentMessage.createdAt == this.state.date_first_taken) {
                                    this.setState({ get_more: true });
                                }
                            }
                        }}>
                            {show_unread_notif && ((props.currentMessage.new && props.currentMessage.unread) || props.currentMessage.old) && props.currentMessage._id == first_unread_message_id ? <Text>Непрочитанные сообщения</Text> : <></>}
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
                    onPressAvatar={this.handlePressAvatar}
                />
            </>
        )
    }
}

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