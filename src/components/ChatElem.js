import react, { Component } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';


class ChatElem extends Component {

    constructor(props) {
        super(props);
        // console.log('пропсы миниэлемента');
        // console.log(this.props);
        // console.log('CHAT ELEM');
        // console.log(this.props.data);
        this.state = {
            data_generate_chat: this.props.data,
        }

        //this.event_name = props.data.event_name;
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('ДО');
        // console.log(prevProps.data)
        // console.log('После');
        // console.log(this.props.data);
        if (this.props.data !== prevProps.data) {
            this.setState({ data_generate_chat: this.props.data });
        }
    }

    navigateToCurrentChatPage = () => {
        this.props.navigation.navigate('CurrentChatPage', { chat_id: this.props.data.chat_id, data_generate: this.state.data_generate_chat });
    }

    render() {

        console.log('Дата для генерации миничата');

        const { data_generate_chat } = this.state;

        return (
            <TouchableOpacity onPress={this.navigateToCurrentChatPage}>
                <View style={styles_chat.chatElem}>
                    <Image
                        source={require('../images/logo-event.png')}
                        style={styles_chat.chatPhoto}
                    />
                    <View style={styles_chat.info_last_message}>
                        <TextInput
                            multiline={true}
                            style={[styles_chat.chatName, { fontWeight: 'bold' }]}
                            value={data_generate_chat.chat_name.length > 20
                                ? data_generate_chat.chat_name.slice(0, 20) + '...'
                                : data_generate_chat.chat_name}
                            editable={false}
                        />
                        <View>
                            <TextInput
                                multiline={true}
                                style={[styles_chat.chatName, { fontSize: 14 }]}
                                value={data_generate_chat.last_message.user.name}
                                editable={false}
                            />
                            <TextInput
                                multiline={true}
                                style={[styles_chat.chatName, { fontSize: 14, color: ColorsApp.hint_color }]}
                                value={data_generate_chat.last_message.text}
                                editable={false}
                            />
                        </View>
                    </View>
                    {
                        data_generate_chat.unread_message_count ?
                            <View style={styles_chat.count_unread_messages}>
                                <View style={styles_chat.round_count}>
                                    <Text style={styles_chat.round_text}>{data_generate_chat.unread_message_count}</Text>
                                </View>
                            </View>
                            :
                            <></>
                    }

                </View>
            </TouchableOpacity>
        )
    }
}

export default ChatElem

const styles_chat = StyleSheet.create({
    chatName: {
        color: ColorsApp.font_color,
        fontSize: 16,
        height: 18,
    },
    chatElem: {
        height: 65,
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",      
        backgroundColor: ColorsApp.white,
        borderBottomWidth: 1,
        borderColor: ColorsApp.lines_color,
        paddingLeft: 5,
    },
    chatPhoto: {
        width: 50,
        height: 50,
    },
    info_last_message: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '71%',
        justifyContent: "space-between",
        paddingVertical: 5,
        marginLeft: 10,
    },
    count_unread_messages: {
        heght: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "13%",
        // backgroundColor:"red",
    },
    round_count: {
        backgroundColor: ColorsApp.main_color,
        borderRadius: 10,
        height: 20,
        paddingHorizontal: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "auto",
    },
    round_text: {
        color: ColorsApp.white,
        fontSize: 14,
        lineHeight: 16,
    }
})