import React, { Component } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import moment from 'moment';
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    font: {
        fontSize: 8
    }
})

export default ({
    state, address, blockHash, transactionHash, label, createdAt
}) => (
        <View style={{ height: height / 6 }}>
            <Card style={{ flex: 1 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: address }} />
                        <Body>
                            <Text>label: {label} </Text>
                            <Text style={styles.font}>address: {address}</Text>
                            <Text style={styles.font}> blockHash: {blockHash}</Text>
                            <Text note>{moment(createdAt).format("MMM Do YY")}</Text>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </View>
    )
