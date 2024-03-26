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
        return(
            <TouchableOpacity onPress = {this.navigateToCurrentChatPage}>
                <View style = {styles.eventsElem}>
                    {/* <Image 
                        source={require('../images/logo-event.png')}
                        style = {styles.eventsPhoto}
                    /> */}
                    <TextInput
                        multiline={true}
                        style={[styles_chat.eventName]}
                        value={this.data_generate_chat.chat_name}
                        editable = {false}
                    />
                
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
        width:'90%',
        //fontWeight: 'bold',
    }
})