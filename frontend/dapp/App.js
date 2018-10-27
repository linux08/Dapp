/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Spinner from './components/Spinner';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

type Props = {};
export default class App extends Component<Props> {

  selectImage = async () => {

    ImagePicker.showImagePicker(options, async (response) => {
      console.log('resp', response);
      if (response.didCancel) {
        this.setState({ error: 'Image upload failed' });
      } else if (response.error) {
        this.setState({ error: 'Image upload failed' });
      } else if (response.customButton) {
        this.setState({ error: 'Image upload failed' });
      } else {
        const source = { uri: response.uri };
        this.setState({
          avatarSource: source,
        });
        const data = new FormData();
        data.append('upload', {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
          originalname: response.fileName,
        });

        const config = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        };


        // fetch('https://l/api/upload', config);
        // .then(resp => ({
        //   resp.json();
        // }))
        // .catch(error => this.setState({ error }));
        try {
          const resp = await fetch('/upload', config);
          console.log('resp', resp.json());
        }
        catch (err) {
          console.log('err', err.message)
        }


      }
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => this.selectImage()}>
            <Text> Choose image </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
