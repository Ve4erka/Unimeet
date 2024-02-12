import React, {Component} from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import Auth from './src/API/Account/Auth';
import Preloader from './src/components/Preloader';
import StartNavComponent from './src/navigations/StartNavComponent';
import {View, Text, Button, Image, TextInput,TouchableOpacity, ImageBackground, BackHandler, SafeAreaView, ActivityIndicator, FlatList} from 'react-native'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      screen: null,
      data:{},
    };
  }

  async componentDidMount(){
    let data = await Auth();
    let screen = data["page"];
    console.log('ВЫВОД РЕЗУЛЬТАТА АВТОРИЗАЦИИ');
    console.log(screen);
    console.log(data);
    //delete data["page"];
    this.setState({ isLoading: false, screen:screen, data:data["data"] ? data["data"] : "" });
  }

  render(){

    const {isLoading, screen, data} = this.state;
    
    console.log('ЧТо-то случится я базарю')
    console.log(screen)
    console.log(isLoading)
    console.log(data);

    return(
      <Provider store = {store}>
        {
          isLoading ?
            <Preloader/>
            :
            <StartNavComponent
              initialRout = {screen}
              data_user = {data}
            />
        }
      </Provider>
    )
  }
}

export default App;