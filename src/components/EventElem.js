import react, {Component} from 'react'
import {View, Text, Image, TextInput,TouchableOpacity, StyleSheet} from 'react-native'
import { styles } from '../styles/styles';
import { ColorsApp } from '../styles/colors';


class EventElem extends Component{

    constructor(props){
        super(props);
        this.event_name = props.data.event_name;
    }

    navigateToCurrentEventPage = () => {
        this.props.navigation.navigate('CurrentEventPage', {eventKey:this.props.data.event_uuid});
    }

    render(){
        return(
            <TouchableOpacity onPress = {this.navigateToCurrentEventPage}>
                <View style = {styles.eventsElem}>
                    <Image 
                        source={require('../images/logo-event.png')}
                        style = {styles.eventsPhoto}
                    />
                    <TextInput
                        multiline={true}
                        style={styles_event.eventName}
                        value={this.event_name}
                        editable = {false}
                    />
                
                </View>
            </TouchableOpacity>
        )
    }
}

export default EventElem

const styles_event = StyleSheet.create({
    eventName:{
        color: ColorsApp.font_color,
        fontSize: 16,
        width:'80%',
        //fontWeight: 'bold',
    }
})