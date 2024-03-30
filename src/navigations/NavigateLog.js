import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../components/Login";
import Signin from "../components/Sigin";
import Profile from "../components/Profile";
import Events from "../components/Events";
import CurrentEventPage from "../components/CurrentEventPage";
import CurrentChatPage from "../components/CurrentChatPage";
import Chats from "../components/Chats";
import EditContentScreen from "../components/EditContentScreen";
import MemberProfilePage from "../components/MemberProfilePage";

const Stack = createNativeStackNavigator();

class NavigateLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRoute: props.initialRout,
    };
  }


  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={this.state.initialRoute}
          screenOptions={{headerShown: false,  animation: 'slide_from_right' }}
        >
          <Stack.Screen
            name = "Login"
            component={Login}
          />
          <Stack.Screen
            name = "SignIn"
            component={Signin}
          />
          <Stack.Screen
            name = "Profile"
            component={Profile}
          />
          <Stack.Screen
            name = "Events"
            component={Events}
          />
          <Stack.Screen
            name = "EditContentScreen"
            component={EditContentScreen}
          />
          <Stack.Screen
            name = "Chats"
            component={Chats}
          />
          <Stack.Screen
            name = "CurrentEventPage"
            component={CurrentEventPage}
          />
          <Stack.Screen
            name = "CurrentChatPage"
            component={CurrentChatPage}
          />
          <Stack.Screen
            name = "MemberProfilePage"
            component={MemberProfilePage}
          />

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default NavigateLog;