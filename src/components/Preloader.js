import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {ColorsApp} from '../styles/colors'
//import FastImage from 'react-native-fast-image';

class Preloader extends Component {
  constructor(props) {
    super(props);
  }
  render() {    
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <Image
            source={require('../images/avatar.jpg')}
            style={styles.image}
          /> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorsApp["white"],
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    // borderRadius: 50,
    // backgroundColor: ColorsApp["white"],
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 50,
    color: '#fff',
  },
});

export default Preloader;