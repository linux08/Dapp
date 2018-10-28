import React, { Component } from 'react';
import { StyleSheet, Text, View, } from 'react-native';

export default ({ first, second, style, link }) => (
    <View style={styles.view}>
        <View>
            <Text>{first}:  </Text>
        </View>
        <View>{
            link ? (
                <Text onPress={link} style={[style, styles.text]}>{second} </Text>
            )
                : (
                    <Text style={styles.text}>{second} </Text>
                )
        }
        </View>
    </View>
)
const styles = StyleSheet.create({
    view: {
        marginTop: 4,
        marginLeft: 5,
        flexDirection: 'row'
    },
    text: {
        fontWeight: '500',
    }
})