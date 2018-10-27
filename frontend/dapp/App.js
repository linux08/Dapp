/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, PixelRatio, Image } from 'react-native';
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
  state = {
    avatarSource: null,
    loading: true,
  };

  selectImage = async () => {

    ImagePicker.showImagePicker(options, (response) => {
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
        data.append('file', {
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

        fetch('https://dappsela.herokuapp.com/upload', config)
          .then((resp) => resp.json())
          .then((res) => {
            console.log('resp', res);
            this.setState({
              hash: res.hash,
              address: `https://gateway.ipfs.io/ipfs/${res.hash}`,
              loading: false
            })
          })
          .catch((err) => {
            console.log('err', err.message)
          })

      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => this.selectImage()}>
            <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
              {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                <Image style={styles.avatar} source={this.state.avatarSource} />
              }
            </View>
          </TouchableOpacity>
        </View>{
          !!loading ? (
            <View style={{ backgroundColor: 'red' }}>
              <Text> file hash: {this.state.hash} </Text>
              <Text> Address on IPFS {this.state.address} </Text>
              {/* <Text> file hash: {this.state.name} </Text> */}
            </View>
          ) : null
        }

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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});