/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, PixelRatio, Image, Linking, Dimensions, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Spinner from './components/Spinner';
import TextContainer from './components/TextContainer';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { height, width } = Dimensions.get('window');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      loading: null,
    };
  }



  selectImage = async () => {
    console.log('this.state', this.state)
    this.setState({
      loading: null
    });

    ImagePicker.showImagePicker(options, (response) => {
      this.setState({
        loading: true
      });
      if (response.didCancel) {
        this.setState({ error: 'Image upload failed', loading: null });
      } else if (response.error) {
        this.setState({ error: 'Image upload failed', loading: null });
      } else if (response.customButton) {
        this.setState({ error: 'Image upload failed', loading: null });
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

        fetch('http://10.0.2.2:5000/upload', config)
          .then((resp) => resp.json())
          .then((res) => {
            console.log('resp', res);
            this.setState({
              hash: res.ipfsHash,
              address: `https://gateway.ipfs.io/ipfs/${res.ipfsHash}`,
              transactionHash: res.transactionHash,
              blockHash: res.blockHash,
              loading: false
            })
          })
          .catch((err) => {
            this.setState({
              loading: true
            });
            console.log('err', err.message)
          })

      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <View>
            <Text style={{ color: 'blue' }}>  DAPP file system using ethereum and IPFS </Text>
          </View>
          <View style={{ marginTop: '10%' }}>
            <TouchableOpacity onPress={() => this.selectImage()}>
              <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                }
              </View>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <TextInput
                placeholder="Label"
                onChange={(label) => this.setState({ label })}
                style={styles.label}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>{
          this.state.loading !== null ? (
            this.state.loading ? (
              <Spinner size="large" />
            ) : (
                <View>

                  <TextContainer
                    first="Hash"
                    second={this.state.hash}
                  />

                  <TextContainer
                    first="Address on IPFS"
                    second={this.state.address}
                    link={() => Linking.openURL(this.state.address)}
                    style={{ color: 'blue', textDecorationLine: 'underline' }}
                  />

                  <TextContainer
                    first="Transaction Hash"
                    second={this.state.transactionHash}
                  />

                  <TextContainer
                    first="Block Hash"
                    second={this.state.blockHash}
                  />

                </View>
              )
          ) : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '30%',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: width / 3,
    width: width / 2,
    height: width / 2
  },
  label: {
    height: 40,
    width: width / 4,
    paddingLeft: '8%',
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }

});