import react, {Component} from 'react'
import {View, Text, Button, Image, TextInput,TouchableOpacity, ImageBackground, BackHandler, SafeAreaView, ActivityIndicator, FlatList} from 'react-native'
import { styles } from '../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Svg, SvgUri } from 'react-native-svg';
import EventElem from './EventElem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../API/System/config';


class Events extends Component{

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
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await fetch(Address+`api/v1/events`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            const json = await response.json();
            this.setState({data: json["data"]["events"]});
        } 
        catch (error) {
            console.log(error);
        } 
        finally {
          this.setState({isLoading: false});
        }
    }

    componentDidMount(){     
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));
        this.getEvents();  
    } 
    componentWillUnmount() {
        if (this.backHandler){
            this.backHandler.remove();
        }
    }
    backAction() {
        BackHandler.exitApp();
        return true;
    }

    loadProfileScene(){
        this.props.navigation.navigate('Profile');
    }
    loadChatsScene(){
        this.props.navigation.navigate('Chats');
    }

    render(){

        const {data, isLoading} = this.state;

        return(
            <GestureHandlerRootView style = {{flex:1}}>
            <View style = {[styles.container, {paddingTop:30}]}>
                <View style = {styles.screenContent}>
                    <Text style = {styles.screenTitle}>Активности</Text>
                    <Text style = {styles.screenSubTitle}>Список возможных активностей в нашем университете:</Text>
                    <View style = {styles.eventsContent}>
                        {isLoading ? (
                            <ActivityIndicator color = "#E94057" size = "large"/>
                            ) : (
                            <FlatList
                                overScrollMode="never"
                                showsVerticalScrollIndicator={false}
                                data={data}
                                keyExtractor={item => item["event"]["event_uuid"]}
                                renderItem={({item}) => (
                                    <EventElem
                                        data = {item["event"]}
                                        navigation = {this.props.navigation}
                                        // event_name = {item.event_name}
                                        // event_description = {item.event_description}
                                        // event_owners = {item.event_owners}
                                        //directorContacts = {item.director_contact}
                                    />
                                )}
                            />
                        )}
                    </View>
                    <View style={styles.footer}>
                        <Image
                            source={require('../images/eventsIcon.png')}
                            style = {styles.footerImg}
                        />
                        <TouchableOpacity onPress = {()=>{this.loadChatsScene()}}>
                            <Image
                                style = {styles.footerImg}
                                source={require('../images/messagesIcon.png')}
                            />
                        </TouchableOpacity>
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

export default Events