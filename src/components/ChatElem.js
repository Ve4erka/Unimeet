import react, {Component} from 'react'
import {View, Text, Image, TextInput,TouchableOpacity, StyleSheet} from 'react-native'
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';


class ChatElem extends Component{

    constructor(props){
        super(props);
        console.log('пропсы миниэлемента');
        console.log(this.props);
        this.data_generate_chat = this.props.data;
        //this.event_name = props.data.event_name;
    }

    navigateToCurrentChatPage = () => {
        console.log('test');
        //this.props.navigation.navigate('CurrentEventPage', {eventKey:this.props.data.event_uuid});
    }

    render(){

        console.log(this.data_generate_chat);

        return(
            <TouchableOpacity onPress = {this.navigateToCurrentChatPage}>
                <View style = {styles_chat.chatElem}>
                    <Image 
                        source={require('../images/logo-event.png')}
                        style = {styles_chat.chatPhoto}
                    />
                    <View style = {styles_chat.info_last_message}>
                        <TextInput
                            multiline={true}
                            style={[styles_chat.chatName, {fontWeight:'bold'}]}
                            value={this.data_generate_chat.chat_name.length > 20
                                ? this.data_generate_chat.chat_name.slice(0, 20) + '...'
                                : this.data_generate_chat.chat_name}
                            editable = {false}
                        />
                        <View>
                            <TextInput
                                multiline={true}
                                style={[styles_chat.chatName, {fontSize: 14}]}
                                value={this.data_generate_chat.last_message.user.name}
                                editable = {false}
                            />
                            <TextInput
                                multiline={true}
                                style={[styles_chat.chatName, {fontSize: 14, color: ColorsApp.hint_color}]}
                                value={this.data_generate_chat.last_message.text}
                                editable = {false}
                            />
                        </View>
                    </View>  
                    <View style = {styles_chat.count_unread_messages}>
                        <View style = {styles_chat.round_count}>
                            <Text style = {styles_chat.round_text}>{this.data_generate_chat.unread_message_count}</Text>
                        </View>
                    </View>             
                </View>
            </TouchableOpacity>
        )
    }
}

export default ChatElem

const styles_chat = StyleSheet.create({
    chatName:{
        color: ColorsApp.font_color,
        fontSize: 16,
        height:18,
    },
    chatElem:{
        height:65,
        width:'100%',
        display:"flex",
        flexDirection:'row',
        alignItems:"center",
        marginBottom:14,
        borderRadius:8,
        backgroundColor: ColorsApp.white,
        borderWidth:1,
        borderColor: ColorsApp.lines_color,
        paddingLeft:5,
    },
    chatPhoto:{
        width:50,
        height:50,
    },
    info_last_message:{
        display:'flex',
        flexDirection:'column',
        height:'100%',
        width:'71%',
        justifyContent:"space-between",
        paddingVertical:5,
        marginLeft: 10,
    },
    count_unread_messages:{
        heght:"100%",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        width:"13%",
        // backgroundColor:"red",
    },
    round_count:{
        backgroundColor: ColorsApp.main_color,
        borderRadius:10,
        height:20,
        paddingHorizontal:7,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:"auto",
    },
    round_text:{
        color:ColorsApp.white,
        fontSize:14,
        lineHeight:16,
    }
})