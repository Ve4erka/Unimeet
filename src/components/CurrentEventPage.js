import react, {Component, createRef} from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GetCurrentEvent from '../API/Events/GetCurrentEvent';
import GetCurrentMember from '../API/Events/GetCurrentMember';
import { ColorsApp } from '../styles/colors';
import { Modalize } from 'react-native-modalize';
import EventOwnerElem from './EventOwnerElem';

class CurrentEventPage extends Component{

    constructor(props) {
        super(props);
        console.log('ПРОПСЫ ЭКРАНА ИВЕНТА');
        console.log(props);
        this.height = Dimensions.get('screen').height;
        this.width = Dimensions.get('screen').width;
        this.modalizeRef = createRef(null);
        eventKey = props.route.params.eventKey;
        this.backHandler = null;
        this.isFirstMember = true,
        this.state = {
            eventGenerateData: {},
        }
    }
    async componentDidMount(){
        let data = await GetCurrentEvent(eventKey);
        console.log(data.data.event_users);
        this.setState({ eventGenerateData : data["data"] })
    }

    async getMemberInfo (memberHash) {

        let memberData = await GetCurrentMember(memberHash);
        console.log(memberData);
        this.props.navigation.navigate('MemberProfilePage', { data_user : memberData });
    }

    openMembersList = () => {
        if (this.state.eventGenerateData.event_users && this.state.eventGenerateData.event_users.length){
            this.modalizeRef.current?.open();
        }
        else{
            return;
        }
        
    }

    renderUser = (item) =>{

        return(
            <TouchableOpacity 
                style = {styles.memberPattern}
                onPress = {()=> {this.getMemberInfo(item.item.user_hash)}}
            >
                <View style = {styles.memberPhotoBlock}>
                    <Image
                        source = {item.item.user_image ? { uri: item.item.user_image } : require('../images/memberEmptyImg.png')}
                        style = {styles.memberPhotoStyle}
                    />
                </View>
                <View style = {[styles.memberNameBlock, {width: this.width - 75}]}>
                    <Text style = {styles.memberName}>{item.item.user_name ? item.item.user_name : "Варакин Иван"}</Text>
                </View>
            </TouchableOpacity>
        )
    }
   

    renderContacts = (data) => {
        console.log('ГЕНЕРИРУЕМ КОНТАКТЫ')
        console.log(data);
        if(data == undefined) return;
        for (let i = 0; i<data.length; i++){
            return(
                <EventOwnerElem data_owner = {data[i]}/>
            )
        }
    }

    render(){

        const {eventGenerateData} = this.state;

        eventGenerateData.event_img = [];

        let membersCount = 0;

        if(eventGenerateData.event_users){
            membersCount = Object.keys(eventGenerateData.event_users).length;
        }

        const membersText = membersCount === 1 ? 'участник' :
            membersCount % 10 === 1 && membersCount % 100 !== 11 ? 'участник' :
            membersCount % 10 >= 2 && membersCount % 10 <= 4 && (membersCount % 100 < 10 || membersCount % 100 >= 20) ? 'участника' :
            'участников';

        return(
            <GestureHandlerRootView style = {styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style = {styles.headerblock}>
                    <Image
                        source={require('../images/logo-event.png')}
                        style = {styles.eventIconStyle}
                    />
                    <Text style = {styles.eventTitle}>{eventGenerateData.event_name}</Text>
                    <Text style = {styles.eventMembersCount}>{membersCount + ' ' + membersText}</Text>
                </View>
                <TouchableOpacity
                    style = {styles.eventButtonPattern}
                    onPress = {()=>{console.log('Че тыкаешь?')}}
                >
                    {
                        eventGenerateData.subscribed ?
                        <Text style = {[styles.eventButtonPatternText, {color: ColorsApp.main_red}]}>Отписаться</Text>
                        :
                        <Text style = {styles.eventButtonPatternText}>Подписаться</Text>
                    }
                    
                </TouchableOpacity>
                
                    {/* { eventGenerateData.event_img.length == 0 ? (
                        <></>
                    ):(
                        <View style = {styles.eventBlock}>
                            <Text style = {styles.eventBlockSmallTitle}>Фото</Text>
                            <FlatList
                                horizontal
                                overScrollMode="never"
                                showsHorizontalScrollIndicator={false}
                                data={eventGenerateData.event_img}
                                //keyExtractor={item => item["event"]["event_uuid"]}
                                renderItem={({item}) => (
                                    <Image
                                        source={''}
                                        style = {styles.eventImagesPattern}
                                    />
                                )}
                            />
                        </View>
                    )} */}
                    <View style = {styles.eventBlock}>
                        <Text style = {styles.eventBlockSmallTitle}>описание</Text>
                        <TextInput
                            multiline={true}
                            style={styles.eventDescription}
                            value={eventGenerateData.event_description}
                            editable = {false}
                        />
                    </View>
                    <View style = {styles.eventBlock}>
                        <Text style = {styles.eventBlockSmallTitle}>контакты</Text>
                        {this.renderContacts(eventGenerateData.event_owners)}
                    </View>
                    
                    <TouchableOpacity
                        style = {styles.eventButtonPattern}
                        onPress = {this.openMembersList}
                    >
                        <Text style = {styles.eventButtonPatternText}>Участники</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Modalize 
                    ref={this.modalizeRef}
                    //alwaysOpen={190}
                    handlePosition='inside'
                    avoidKeyboardLikeIOS={true}
                    modalHeight={this.height - 50}
                    snapPoint={this.height/2}
                    modalStyle={[styles.modalizeContainer, {width:this.width - 2}]}
                    handleStyle = {styles.modalizeHandleShape}
                    flatListProps={
                        eventGenerateData.event_users?.length > 0
                        ? {
                            data: eventGenerateData.event_users,
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

export default CurrentEventPage;

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        height:"100%",
        paddingTop:30,
        paddingHorizontal:10,
    },
    headerblock:{
        width:"100%",
        display:'flex',
        flexDirection:"column",
        alignItems:'center',
        height:"auto",
    },
    eventIconStyle:{
        width:100,
        height:100,
    },
    eventTitle:{
        fontSize:22,
        //fontWeight:700,
        color: ColorsApp.font_color,
        textAlign: 'center',
    },
    eventMembersCount:{
        paddingHorizontal: 19,
        color:ColorsApp.hint_color,
        fontSize: 17,
    },
    eventButtonPattern:{
        width: "100%",
        height: 40,
        borderRadius: 8,
        backgroundColor:ColorsApp.white,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 10,
    },
    eventButtonPatternText:{
        fontSize:17,
        color:ColorsApp.main_color,
    },
    eventBlock:{
        backgroundColor:ColorsApp.white,
        width:"100%",
        flexDirection:"column",
        alignItems:'flex-start',
        borderRadius:8,
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    eventImagesPattern:{
        height: 80,
        width: 80,
        borderRadius: 8,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    eventEmptyPhotos:{
        width:50,
        height:50,
    },
    eventBlockSmallTitle:{
        fontSize: 15,
        color: ColorsApp.font_color,
    },
    eventDescription:{
        fontSize: 17,
        color:ColorsApp.font_color,
        maxHeight: 400,
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
    modalizeTitle:{
        fontSize:20,
        //fontWeight:600,
        color:ColorsApp.font_color,
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
