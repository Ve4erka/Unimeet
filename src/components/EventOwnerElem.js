import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { ColorsApp } from '../styles/colors';

class EventOwnerElem extends Component {


    openSocialMedia = (media, value) =>{
        if (media == "vk"){
            Linking.openURL(value);
        }
        else if (media == "tg"){
            console.log(`https://t.me/${value}`);
            Linking.openURL(`https://t.me/${value.slice(1)}`);
        }
        else if (media == "phone"){
            Linking.openURL(`tel:${value}`);
        }
    }

    renderContact(contactType, contactInfo, iconSource) {
        if (contactInfo && contactInfo.trim() !== "") {
            return (
                <View style = {styles.mediaBlock}>
                    <Image source={iconSource} style = {styles.mediaIcon}/>
                    <TouchableOpacity
                        onPress = {() => {this.openSocialMedia(contactType, contactInfo.trim())}}
                    >
                        <Text style = {styles.linkText}>{contactInfo.trim()}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }

    render() {
        const { data_owner } = this.props;

        return (
            <View style = {styles.ownerBlock}>
                <Text style = {styles.ownerName}>{data_owner.owner_name}</Text>
                {this.renderContact('vk', data_owner.owner_contacts.vk, require('../images/vk.png'))}
                {this.renderContact('tg', data_owner.owner_contacts.tg, require('../images/telegram.png'))}
                {this.renderContact('phone', data_owner.owner_contacts.phone, require('../images/phone.png'))}
            </View>
        );
    }
}

export default EventOwnerElem;

const styles = StyleSheet.create({
    ownerBlock:{
        width: '100%',
        marginTop: 5,
    },
    ownerName:{
        fontSize: 16,
        color: ColorsApp.font_color,
    },
    mediaBlock:{
        display: 'flex',
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -2,
    },
    mediaIcon:{
        width: 30,
        height: 30,
        marginRight: 5,
    },
    linkText: {
        fontSize: 15,
    },
})