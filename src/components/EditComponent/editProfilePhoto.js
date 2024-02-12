import React, { Component } from 'react';
import { Button, Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ColorsApp } from '../../styles/colors';
import pickImageSource from '../../images/pickImage.png'

class EditProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: props.defaultValue,
    };
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
      this.props.onInputChange('user_img', result.assets[0].uri);
    }
  };

  render() {
    const { image } = this.state;

    return (
      <View style = {styles.container}>
        <View style = {styles.containerForPhoto}>
          <Image 
            source = {image? {uri:image} : pickImageSource}
            style={image? styles.userPhoto :styles.defaultImage} 
          />
        </View>
        <TouchableOpacity
          onPress={this.pickImage}
          style = {styles.pickImageStyle}
        >
          <Text style = {styles.titlePick}>Выбрать фотографию</Text>
        </TouchableOpacity>
      </View>
      
    );
  }
}

export default EditProfilePhoto;

const styles = StyleSheet.create({
  container:{
    width:"100%",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:"column",
    backgroundColor:ColorsApp.white,
    borderRadius:8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  defaultImage:{
    width:30,
    height: 30,
  },
  userPhoto:{
    width:"100%",
    height:"100%",
    borderRadius: 40,
  },
  titlePick:{
    fontSize: 15,
    color: ColorsApp.main_color,
    lineHeight: 25,
  },
  containerForPhoto:{
    width: 80,
    height: 80,
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
  }
})