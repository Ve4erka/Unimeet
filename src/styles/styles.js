import {StyleSheet} from "react-native";
import { ColorsApp } from "./colors";

export const styles = StyleSheet.create({
    container: {
        width:"100%",
        height:"100%",
        backgroundColor:ColorsApp["white"],
        flex:1,
    },
    screenTitle:{
        fontSize:34,
        lineHeight:51,
        //fontWeight:700,
    },
    screenSubTitle:{
        //fontWeight: 400,
        fontSize: 16,
        lineHeight:24,
        marginBottom:30,
    },
    contentInputBlock:{
        alignItems:'center',
        marginTop:"30%",
        padding:10,
    },
    logInputBlock: {
        width:'100%',
        alignItems:'center', 
    },
    logInput:{
        width:'80%',
        height: 50,
        backgroundColor:'transparent',
        borderRadius: 8,
        borderWidth:1,
        borderColor: ColorsApp.lines_color,
        textAlign:"center",
        fontSize:15,
        padding:10,
        marginBottom:10,
    },
    logButton:{
        width:'80%',
        height:50,
        borderRadius: 8,
        backgroundColor: ColorsApp.main_color,
        color:'white',
        justifyContent:"center",
        alignItems:"center",
        marginTop:20,
        marginBottom:10,
    },
    logButtonText:{
        color:'white',
        fontSize:16,
    },
    regText:{
        color:ColorsApp.main_color,      
    },
    loginIcon:{
        width:200,
        height:200,
        marginBottom:20,
    },
    screenContent: {
        height:'100%',
        width:'100%',
        flexDirection:"column",
        paddingHorizontal:40,
    },
    profilePhoto:{
        width:'100%',
        height:'90%',
    },
    profileName:{
        marginTop:5,
        flexDirection:'row'
    },
    profileNameText:{
        fontSize:24,
        //fontWeight:'bold',
        lineHeight:36,
        color:'#E94057'
    },
    footer:{
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,
        height:'6%',
        backgroundColor:'#F3F3F3',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    footerImg:{
        width:30,
        height:30,
    },
    eventsContent:{
        width:'100%',
        height:'75%',
        flexDirection:'column',
    },
    eventsElem:{
        minHeight:50,
        width:'100%',
        display:"flex",
        flexDirection:'row',
        alignItems:"center",
        marginBottom:14,
        borderRadius:8,
        backgroundColor:'transparent',
        borderWidth:1,
        borderColor: ColorsApp.lines_color,
        paddingLeft:10,
    },
    eventsElemImg:{
        resizeMode:"contain",
        height:'100%',
        width:'100%'
    },
    eventIcon:{
        width:'100%',
        height:90,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        marginTop:13,        
    },
    eventIconImg:{
        width:'100%',
        height:'100%',
        resizeMode:'contain'
    },
    eventsPhoto:{
        height:35,
        width:35,
        marginRight:10,
        backgroundColor:'transparent',
        resizeMode:"contain"
    },
    eventsElemTitle:{
        width:'100%',
        //fontWeight: 'bold',
        fontSize: 16,
        lineHeight:18,
        color:'black',
        backgroundColor:'transparent',
    },
    eventModalCenteredView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    eventModalView:{
        width:'80%',
        height:'70%',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        elevation: 5,
    },
    eventModalHeader:{
        width:'100%',
        height:50,
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:"center",
        paddingLeft:20,
        paddingRight:10,
        marginTop:8,
    },
    eventModalHederTitle:{
        //fontWeight:700,
        fontSize:21,
        lineHeight:36,
    },
    eventModalCenteredViewHeaderImg:{
        width:45,
        height:45,
        marginTop:3,
    },
    eventModalLine:{
        width:'100%',
        borderWidth:1,
        borderColor:'#E8E6EA',
        marginTop:10,
    },
    eventModalContent:{
        width:'100%',
        height:'85%',
        paddingHorizontal:20,
    },
    eventModalContentTitle:{
        //fontWeight:700,
        fontSize:18,
        lineHeight:27,
        marginBottom:5,
    },
    eventModalContentSubTitle:{
        //fontWeight: 400,
        fontSize: 15,
        lineHeight:20,
        marginBottom:10,
    },
    eventModalContentScrollBlock:{
        height:80,
        marginTop:25,
    },
    eventModalContentScrollMember:{
        width:80,
        height:80,
        borderRadius:40,
        marginRight:10,
    },
    eventModalContentScrollMemberPhoto:{
        width:'100%',
        height:'100%',
        borderRadius:40,
    },

});