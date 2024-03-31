import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
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
            count_all_messages: 0,
            count_current_messages: 0,
            messages: [],
            can_read: true,
            unread_messages: {},
            show_unread_notif: false,
            first_unread_message_id: null,
            date_first_taken: "",
            get_more: true,
        }
    }

    componentDidMount() {
        this.client = new W3CWebSocket(`ws://unimeet.ru/ws/chat/${this.chatId}/?user_hash=${this.user_hash}`);

        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        this.client.onmessage = async (message) => {
            let message_parsed = JSON.parse(message.data);
            console.log(message_parsed);
            let count_already_read_messages = message_parsed.messages.length;
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
                    if (!count_already_read_messages) {
                        this.setState({ date_first_taken: message_parsed.unread_messages[0].message_data.createdAt });
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
                console.log('Пришедшие сообщения новые');
                if (message_parsed.loading_more) {
                    if (message_parsed.messages.length) {
                        this.setState({ date_first_taken: message_parsed.messages[message_parsed.messages.length - 1].message_data.createdAt });
                        for (let new_message of message_parsed.messages) {
                            //console.log(new_message);
                            this.setState((previousState) => ({
                                messages: GiftedChat.prepend(previousState.messages, new_message.message_data),
                            }));
                        }
                    }
                    else {
                        this.setState({ get_more: false });
                    }
                }
                else {
                    if (!this.state.can_read) {
                        //console.log(message_parsed);
                        message_parsed["unread"] = true;
                    }
                    else {
                        let message_id = message_parsed._id;
                        let data = {
                            "chat_id": this.chatId,
                            "user_hash": this.user_hash,
                            "message_id": message_id,
                        }
                        //console.log('Отправляем сообщение что оно прочитано');
                        this.client.send(JSON.stringify({ "change_message_state": data }));

                    }
                    this.setState((previousState) => ({
                        messages: GiftedChat.append(previousState.messages, message_parsed),
                    }));
                }

            }
        };
    }

    getItemLayout = (data, index) => ({
        length: 500,
        offset: 500 * index,
        index,
    });

    scrollToTop = () => {
        this.chatRef.current.scrollToIndex({ animated: false, index: this.state.count_all_messages + 1 });
    };

    onSend(messages = []) {
        //console.log('СООБЩЕНИЯ ОТПРАВЛЕННЫЕ', messages);
        this.client.send(JSON.stringify(messages[0]));
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    onScroll = (event) => {
        const { contentOffset } = event;

        console.log('EVENT');
        console.log(event)

        let download_messages_point = 0.9 * (event.contentSize.height - event.layoutMeasurement.height);
        console.log('Это смещение по вертикали', contentOffset.y);

        if (contentOffset.y < 50) {
            this.setState({ can_read: true })
        }
        else {

            console.log('Можно ли загружать сообщения?')
            console.log(this.state.get_more);

            if (contentOffset.y > download_messages_point && this.state.get_more) {
                //запросить еще сообщения

                console.log('Хочу запросить еще сообщения!');
                console.log(this.state.date_first_taken);

                data_get_more = {
                    "user_hash": "bb1b2d8081543b69fa605b9b6b00a51a18f45aa606e8189ea30eea0890ff37d5",
                    "last_read_message_date": this.state.date_first_taken,
                }
                // data_get_more = JSON.stringify(data_get_more)
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
        console.log('Высота сообщений');
        console.log(current_height_of_unread_messages);
        if (Number(contentOffset.y) < Number(current_height_of_unread_messages)) {
            const updatedUnreadMessages = { ...this.state.unread_messages };
            let chat_id = this.chatId;
            let user_hash = this.user_hash;
            let data = {
                "chat_id": chat_id,
                "user_hash": user_hash,
                "message_id": Object.keys(this.state.unread_messages)[0],
            }
            console.log('Отправляем сообщение что оно прочитано');
            console.log(data);
            this.client.send(JSON.stringify({ "change_message_state": data }));
            delete updatedUnreadMessages[Object.keys(this.state.unread_messages)[0]];
            this.setState({ unread_messages: updatedUnreadMessages });
        }
        if (Number(contentOffset.y) < 10) {
            this.setState(prevState => ({
                show_unread_notif: false
            }), () => {
                console.log('UPDATED notif:', this.state.show_unread_notif);
            });
        }


    }

    render() {

        const { count_all_messages, show_unread_notif, first_unread_message_id } = this.state;

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
                        // onScroll: ({ nativeEvent }) => {
                        //     this.onScroll(nativeEvent);
                        // },
                        // getItemLayout: this.getItemLayout,
                    }}
                    renderBubble={(props) => (
                        <View onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            if ((props.currentMessage.new && props.currentMessage.unread) || props.currentMessage.old) {
                                const messageId = props.currentMessage._id;
                                //console.log(messageId, 'Мессага ИД');
                                this.setState(prevState => ({
                                    unread_messages: { ...prevState.unread_messages, [messageId]: height }
                                }), () => {
                                    // console.log('UPDATED unread_messages:', this.state.unread_messages);
                                    // console.log(count_all_messages);
                                    // console.log(Object.keys(this.state.unread_messages).length);
                                    if (count_all_messages == Object.keys(this.state.unread_messages).length) this.scrollToTop();
                                    // console.log('Каво?', Object.keys(this.state.unread_messages));
                                });
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