import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import { ColorsApp } from '../../styles/colors';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '19' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
];

class EditNameAge extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputValue: props.defaultValue["name"],
            value: props.defaultValue["age"].toString(),
            isFocus: false,
        };
    }

    handleInputChange = (text, type) => {
      if (type == "drop"){
        this.setState({value : text});
        this.props.onInputChange('user_age', text);
      }
      else{
        this.setState({inputValue : text});
        this.props.onInputChange('user_name', text);
      }
    };

    render() {
        const { inputValue, value } = this.state;
    
        return (
          <View style = {styles.container}>
            <View style = {styles.input_fields}>
              <TextInput
                value={inputValue}
                onChangeText={this.handleInputChange}
                placeholder="Имя"
                style = {styles.input_style}
                placeholderTextColor={ColorsApp.placeholder}
              />
              <View style = {styles.verticalLine}></View>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                itemContainerStyle={styles.itemContainer}
                containerStyle = {styles.containerStyle}
                itemTextStyle = {styles.itemTextStyle}
                data={data}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={''}
                value={value}
                onChange={(item) => {
                  this.handleInputChange(item.value, 'drop');
                }}
              />
            </View>
            <Text style = {styles.smallHint}>Укажите имя и, если хотите, возраст для Вашего профиля.</Text>
          </View>
        );
      }

}

export default EditNameAge;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderRadius: 8,
  },
  input_fields:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:5,
    backgroundColor: ColorsApp.white,
    borderRadius:8,
  },
  input_style:{
    width:"80%",
    height:40,
    paddingHorizontal: 19,
    fontSize:16,
    color:ColorsApp.font_color,
  },
  smallHint:{
    paddingHorizontal: 19,
    color:ColorsApp.hint_color,
    marginTop:5,
  },
  verticalLine:{
    width:1,
    height:"100%",
    backgroundColor: ColorsApp.lines_color,
  },
  main_title:{
    fontSize:30,
    lineHeight:51,
    //fontWeight:700,
    color: ColorsApp.font_color,
  },
  dropdown: {
    width:"18%",
    height: 40,
    // borderColor: ColorsApp.main_color,
    // borderWidth: 2,
    // borderRadius: 10,
    paddingHorizontal: 8,
  },
  containerStyle: {
    backgroundColor:"white",
    borderRadius: 7,
    marginTop: 2,
  },
  itemContainer: {
    borderBottomWidth:1,
    borderBottomColor: ColorsApp.main_color,
    height:45,
    padding: 0,
  },
  itemTextStyle: {
    fontSize: 18,
    padding:0,
    marginTop: -8,
    height: 20,
    marginRight: 1,
    color:ColorsApp.font_color,
  },
  icon: {
    marginRight: 0,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 18,
    marginLeft:3,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: ColorsApp.main_color,
    marginRight:4,
  },
})