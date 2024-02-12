import react, {Component} from 'react'
import {View, Text, Button, Image, TextInput,TouchableOpacity, ImageBackground, BackHandler, SafeAreaView, ActivityIndicator, FlatList} from 'react-native'
import { styles } from '../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Svg, SvgUri } from 'react-native-svg';
import EventElem from './EventElem';
import { Address } from '../API/System/config';


class Chats extends Component{

    constructor(props){
        super(props)
        this.backHandler = null;
        this.state = {
            data:[],
            isLoading:true,
        }
    }

    async getEvents() {
        try {
            const response = await fetch(Address+`/events/get`, {
                method: "GET",
                headers: {
                'Content-Type': 'application/json'
                },
            })
            const json = await response.json();
            console.log(json);
            this.setState({data: json});
        } 
        catch (error) {
            console.log(error);
        } 
        finally {
          this.setState({isLoading: false});
        }
    }

    loadEventsScene(){
        this.props.navigation.navigate('Events');
    }
    loadProfileScene(){
        this.props.navigation.navigate('Profile');
    }

    render(){

        const {data, isLoading} = this.state;

        return(
            <GestureHandlerRootView style = {{flex:1}}>
            <View style = {[styles.container, {paddingTop:30}]}>
                <View style = {styles.screenContent}>
                    <Text style = {styles.screenTitle}>Чаты</Text>
                    <View style = {styles.eventsContent}>
                        {isLoading ? (
                            <ActivityIndicator color = "#E94057" size = "large"/>
                            ) : (
                            <FlatList
                                overScrollMode="never"
                                showsVerticalScrollIndicator={false}
                                data={data}
                                keyExtractor={({id}) => id}
                                renderItem={({item}) => (
                                    <EventElem
                                        title = {item.title}
                                        subTitle = {item.text}
                                        director = {item.director_name}
                                        directorContacts = {item.director_contact}
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

export default Chats