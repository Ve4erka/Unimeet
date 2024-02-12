import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ColorsApp } from '../../styles/colors';
import dataForEducation from './dataForEducation';

class EditEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueFac: dataForEducation["faculties"][props.defaultValue["faculty"]]["value"],
      isFocusFac: false,
      labelFac : "",
      valueDir: dataForEducation["directions"][this.props.defaultValue["faculty"]][this.props.defaultValue["direction"]]["value"],
      isFocusDir:false,
      labelDir: "",
    };
  }

  handleInputChangeFac(text) {
    this.setState({ valueFac: text });
    this.props.onInputChange('user_education', {"faculty" : text});
  }

  handleInputChangeDir(text){
    this.setState({ valueDir: text });
    this.props.onInputChange('user_education', {"direction" : text});
  }

  render() {
    const { valueFac , isFocusFac, labelFac, valueDir, isFocusDir, labelDir } = this.state;

    const isLongValueFac = labelFac && labelFac.length > 40;
    const dropdownHeight = isLongValueFac ? 60 : 50;

    const isLongValueDir = labelDir && labelDir.length > 40;
    const dropdownHeightDir = isLongValueDir ? 60 : 50;

    return (
      <View >
        <View style={styles.container}>
          <Dropdown
            style={[styles.dropdown, { height: dropdownHeight }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={[styles.selectedTextStyle, isLongValueFac ? styles.selectedTextStyleLong : '']}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle = {styles.containerStyle}
            data={dataForEducation["faculties"]}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusFac ? 'Факультет' : ''}
            searchPlaceholder="Поиск..."
            value={valueFac}
            onFocus={() => this.setState({ isFocusFac: true })}
            onBlur={() => this.setState({ isFocusFac: false })}
            onChange={(item) => {
              this.handleInputChangeFac(item.value);
              this.setState({ isFocusFac: false, labelFac: item.label, valueDir : null, labelDir: "" });
            }}
          />
          <View style = {styles.horizontalWrapper}>
            <View style = {styles.horizontalLine}></View>
          </View>
          <View style = {styles.secondDropdown} pointerEvents={ valueFac ? undefined : "none" }>
            <Dropdown
              style={[styles.dropdown, { height: dropdownHeightDir }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={[styles.selectedTextStyle, isLongValueDir ? styles.selectedTextStyleLong : '']}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              containerStyle = {styles.containerStyle}
              data={dataForEducation["directions"][valueFac] ? dataForEducation["directions"][valueFac] : [] }
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocusDir ? 'Направление' : ''}
              searchPlaceholder="Поиск..."
              value={valueDir}
              onFocus={() => this.setState({ isFocusDir: true })}
              onBlur={() => this.setState({ isFocusDir: false })}
              onChange={(item) => {
                this.handleInputChangeDir(item.value);
                this.setState({ isFocusDir: false, labelDir: item.label });
              }}
            />
          </View>
        </View>
        <Text style = {styles.smallHint}>Укажите, если хотите, Ваш факультет и направление.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  containerStyle: {
    borderRadius: 7,
    marginTop: 2,
  },
  horizontalWrapper:{
    width: "100%",
    paddingHorizontal: 10,
    height: 1,
  },
  horizontalLine:{
    width: "100%",
    height: "100%",
    backgroundColor: ColorsApp.lines_color,
  },
  dropdown: {
    height:50,
    // borderColor: ColorsApp.main_color,
    // borderWidth: 2,
    // borderRadius: 8,
    paddingLeft: 14,
    paddingRight: 8,
    // backgroundColor:"red",
  },
  secondDropdown:{
  },
  itemContainerStyle: {
    borderBottomColor: ColorsApp.main_color,
    borderBottomWidth: 1
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 8,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color:ColorsApp.placeholder,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  selectedTextStyleLong:{
    marginTop: -5, 
    marginBottom: -5,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: ColorsApp.main_color,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
});

export default EditEducation;