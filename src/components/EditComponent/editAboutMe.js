import React, { Component } from 'react';
import { TextInput, View, Text } from 'react-native';
import { ColorsApp } from '../../styles/colors';

class EditAboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.defaultValue,
      height: 0
    };
  }

  handleContentSizeChange = (event) => {
    this.setState({ height: event.nativeEvent.contentSize.height });
  };

  handleTextChange = (text) => {
    this.setState({ text });
    this.props.onInputChange('user_description', text);
  };

  render() {

    const { text, height } = this.state;
    
    return (
      <View>
        <View style = {styles.container}>
          <TextInput
            multiline={true}
            onContentSizeChange={this.handleContentSizeChange}
            onChangeText={this.handleTextChange}
            style={[styles.default, { height: Math.max(40, height) }]}
            value={text}
            placeholder='Обо себе'
            placeholderTextColor={ColorsApp.placeholder}
          />
        </View>
        <Text style = {styles.smallHint}>Любые подробности, например: увлечения, хобби, знак зодиака{' :)'}</Text>
      </View>
    );
  }
}

const styles = {
  container:{
    width: "100%",
    backgroundColor: ColorsApp.white,
    borderRadius: 8,
    marginTop: 15,
    paddingHorizontal: 5,
  },
  smallHint:{
    paddingHorizontal: 19,
    color:ColorsApp.hint_color,
    marginTop:5,
  },
  default: {
    width:"100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 16,
  },
  main_title: {
    fontSize:30,
    lineHeight:51,
    //fontWeight:700,
  },
};

export default EditAboutMe;