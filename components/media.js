import React, { Component } from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity, ImageBackground, Image} from "react-native";
import {Camera, Permissions, GestureHandler, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
//import { RNS3 } from 'react-native-aws3';

import { Storage, Auth } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';


const styles = StyleSheet.create({
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

class MediaComponent extends Component{


	constructor(props) {
    super(props);

    this.state = {
      displayphotos: [],
      displayphoto: null,
      displayindex: 0,
	  location: null
    }
    this.checkServer = this.checkServer.bind(this);
    }

    async componentWillMount() {
    //var intervalID = window.setInterval(this.checkServer, 10000);
    this.checkServer();
  	}

  	async checkServer(){
    	let location = await Location.getCurrentPositionAsync({});
    	this.setState({location: location});
    	let userId = await AsyncStorage.getItem('userID');
    	var latitude = location.coords.latitude;
    	var longitude = location.coords.longitude;
    	var time = new Date().getTime();

      let name = 'image62084022.jpg';
      const access = { level: "public" };
      let fileUrl = await Storage.get(name, access);
      console.log(fileUrl)
      this.setState({displayphotos: this.state.displayphotos.concat(fileUrl)});

      var params = {
        ExpressionAttributeValues: {
            //':ulong': .05+longitude,
            //':llong': longitude-.05,
            //':ulat' : .05 + latitude
            //':llat' : latitude-.05,
            ':tim' : time - 3600000
          },
        KeyConditionExpression: 'post_time > :tim',
        TableName: 'candid-mobilehub-1124912258-candidmedia'
          };


      Auth.currentCredentials().then(credentials => {
      const db= new DynamoDB.DocumentClient({
      credentials: Auth.essentialCredentials(credentials)
      });
      db.query(params, function(err, data) {
      if (err) {
    console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
      console.log("Query succeeded.");
      data.Items.forEach(function(details) {
        console.log(details.hub_id,details.sensor_name);
      });}
      // now you can run queries with dynamo and current scoped credentials i.e. db.query(...)
    });
    })  

    	//let url = 'https://rocky-anchorage-68937.herokuapp.com/similar/' + userId + '/' + latitude + '/' + longitude + '/' + 'time';
    	/*console.log(url);
       var g = fetch(url, {
       method: 'GET',
       headers: {
       Accept: 'application/json',
      'Content-Type': 'application/json',
      },
      }).then((responseJSON) => responseJSON.json())
      .then((response) => {
      	console.log("starting resposne data");
      	console.log(response);
      	console.log(response["name"]);
        if(this.state.displayphotos.indexOf("https://s3.amazonaws.com/mirrormediacontent1/" + response["name"]) == -1){
      	this.setState({displayphotos: this.state.displayphotos.concat("https://s3.amazonaws.com/mirrormediacontent1/" + response["name"])});
        console.log("HELLO, photo is: " + "https://s3.amazonaws.com/mirrormediacontent1/" + response["name"]);
      }
    }).catch((error) => {
      console.error(error);
    });
    */


    	console.log(latitude + " , " + longitude);
    }





	async scrollForward(e){
		if(this.state.displayindex < this.state.displayphotos.length - 1){
			this.setState({displayindex: this.state.displayindex + 1
						});
		}

	}
	async scrollBack(e){
		if(this.state.displayindex > 0){
			this.setState({displayindex: this.state.displayindex - 1
						});
		}
	}
	async save(e){
		CameraRoll.saveToCameraRoll(this.state.displayphotos[this.state.displayindex]);
	}

	render(){
		if (this.state.displayphotos.length != 0){
			return(
			<View style={{flex:1}}>
				<ImageBackground style={{flex: 1, flexDirection: 'row'}}

				source={{ uri: this.state.displayphotos[this.state.displayindex]}} alt="Image of you!">

				<TouchableOpacity style={{width: "30%", height: "100%",  opacity: 0, backgroundColor: '#FFFFFF'}} onPress={e => this.scrollBack(e)}>

				</TouchableOpacity>
				<TouchableOpacity style={{width: "70%", height: "100%", opacity: 0, backgroundColor: '#FFFFFF'}} onPress={e => this.scrollForward(e)}>
				</TouchableOpacity>

				</ImageBackground>

				<View style={{position: 'absolute', right: 10, bottom: 10}}>
					<TouchableOpacity onPress={e => this.save(e)}>
					<MaterialCommunityIcons name="cloud-download" style={{color:'white', fontSize: 50}}></MaterialCommunityIcons>
					</TouchableOpacity>
				</View>
			</View>

			)
		}else{
			return(
			<View style={styles.slideDefault}>
                <Text style={styles.text}>No candids yet!</Text>
              </View>
              )

		}
		}
	}






export default MediaComponent

