/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, PixelRatio, Image, Linking, Dimensions, TextInput, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Spinner from './components/Spinner';
import Card from './components/Card';
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
      fetchLoading: true,
      clickUpload: false
    };
  }

  componentDidMount() {
    const config = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    };
    fetch('http://10.0.2.2:5000/images', config)
      .then((resp) => resp.json())
      .then((res) => {
        console.log('resp', res);
        this.setState({
          images: res,
          fetchLoading: false
        })
      })
      .catch((err) => {
        console.log('err', err.message)
        this.setState({
          fetchLoading: false,
          error: err.message
        });
      })
  }



  selectImage = async () => {

    ImagePicker.showImagePicker(options, async (response) => {

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
          uri: response.uri,
          type: response.type,
          name: response.fileName,
          originalName: response.fileName
        });


        global.data = new FormData();

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
      }
    })
  }

  upload = async () => {
    this.setState({
      loading: true
    });
    if (this.state.label === '') {
      alert('Enter image label')
    }
    data.append('label', this.state.label);

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

        this.setState({
          label: res.label,
          hash: res.ipfsHash,
          address: res.ipfsAddress,
          transactionHash: res.transactionHash,
          blockHash: res.blockHash,
          loading: false
        })
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: err.message
        });
      })
  }

  newUploadScreen = () => (
    <Fragment>
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
              onChangeText={(label) => this.setState({ label })}
              style={styles.label}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={{ alignItems: 'center', marginTop: '10%' }}>
            <TouchableOpacity onPress={() => this.upload()} style={[styles.label, { justifyContent: 'center', backgroundColor: '#8470ff' }]}>
              <Text style={{ fontWeight: 'bold' }}>  UPLOAD </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>{
        this.state.loading !== null ? (
          this.state.loading ? (
            <Spinner size="large" />
          ) : (
              <View>

                <TextContainer
                  first="Label"
                  second={this.state.label}
                />

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
    </Fragment>
  )

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.state.clickUpload ?
            this.newUploadScreen()
            :
            (
              <ScrollView>
                {
                  this.state.fetchLoading ?
                    (
                      <View style={{ flex: 1, marginTop: '40%' }}>
                        <Spinner size='large' />
                      </View>
                    )
                    : (
                      <ScrollView style={{ flex: 1 }}>
                        <Fragment>
                          <View style={{ alignItems: 'center' }}>
                            <Text> DAPP images listing  </Text>
                          </View>
                          {
                            this.state.images.map((data, index) => (
                              <Card
                                key={index}
                                state={this.state}
                                createdAt={data.createdAt}
                                address={data.ipfsAddress}
                                blockHash={data.blockHash}
                                transactionHash={data.transactionHash}
                                label={data.label}
                              />
                            )
                            )}
                        </Fragment>
                      </ScrollView>
                    )
                }
              </ScrollView>
            )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: '30%',
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
