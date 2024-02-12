import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { getFormatedDate } from "react-native-modern-datepicker";
import { ColorsApp } from "../../styles/colors";

const BirthDatePicker = ({ onInputChange }) => {
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  const startDate = "2020/01/01";
  const [selectedStartDate, setSelectedStartDate] = useState(
    getFormatedDate(today, "YYYY/MM/DD")
  );

  function handleChangeStartDate(propDate) {
    setSelectedStartDate(propDate);
  }

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
    onInputChange("edit_userage", selectedStartDate);
  };

  return (
    <View>
      <View>
        <Text style={styles.main_title}>День рождения (ваш пожалуйста, не Путина)</Text>
        <TouchableOpacity style={styles.inputBtn} onPress={handleOnPressStartDate}>
          <Text style={styles.inputText}>{selectedStartDate}</Text>
        </TouchableOpacity>
      </View>

      {/* Create modal for date picker */}
      <Modal animationType="slide" transparent={true} visible={openStartDatePicker}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              mode="calendar"
              minimumDate={startDate}
              selected={selectedStartDate}
              onDateChanged={handleChangeStartDate}
              onSelectedChange={(date) => {
                setSelectedStartDate(date);
              }}
              locale = {"RUS"}
              options={{
                backgroundColor: "#080516",
                textHeaderColor: "#469ab6",
                textDefaultColor: "#FFFFFF",
                selectedTextColor: "#FFF",
                mainColor: "#469ab6",
                textSecondaryColor: "#FFFFFF",
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
            />

            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Text style={{ color: "white" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BirthDatePicker;

const styles = StyleSheet.create({
  main_title: {
    fontSize: 30,
    lineHeight: 51,
    //fontWeight: "700",
  },
  inputBtn: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: ColorsApp.main_color,
    height: 50,
    paddingLeft: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  inputText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: ColorsApp.white,
    borderWidth: 2,
    borderColor: ColorsApp.main_color,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});