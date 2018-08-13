import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Image } from 'react-native';
import {Permissions} from 'expo';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';

import CameraComponent from './components/camera';

import ConfigCamera from './components/configcamera';
import MediaComponent from './components/media';
import Amplify, { API } from 'aws-amplify';

import aws_exports from './aws-exports';

const styles = StyleSheet.create({
  slideDefault:{
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#9DD6EB"
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      userID: -1
    }
    global.userIDset = false;
    this.configure = this.configure.bind(this);
    this.reconfigure = this.reconfigure.bind(this);
    Amplify.configure(aws_exports);


  }
  async componentDidMount(){
    const value = await AsyncStorage.getItem('userID');
    this.setState({userID: value})
    console.log(value)
  }

  async reconfigure(){
    await AsyncStorage.removeItem('userID');
    global.userIDset = false;
    this.setState({userID: -1})

  }
  async configure(){
    global.userIDset = true;
    const value = await AsyncStorage.getItem('userID');
    this.setState({userID: value});
    console.log("WOWOWOWOW");

  }
  render() {
    const {userID} = this.state
    console.log("userID:" + userID);
    if(userID > 0 || global.userIDset){
      return (
        <Swiper ref='swiper' loop={false} showsPagination={false} index={0} removeClippedSubviews={true}>
        <View style={{flex: 1}}>
          <CameraComponent method={this.reconfigure}>
          </CameraComponent>
        </View>
        <View style={{flex: 1}}>
          <MediaComponent>
          </MediaComponent>

        </View>

      </Swiper>
      );
    }else{

      return (
      <View style={{flex: 1}}>
          <ConfigCamera method={this.configure}>
          </ConfigCamera>
        </View>
        );
    }
  }
}
