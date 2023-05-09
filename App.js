import React, { Component ,useEffect} from 'react';
import { Platform, Text, View ,LogBox,AppState,Permiss} from 'react-native';
import Routes from './Routes'
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
import { BackHandler } from 'react-native';
import MapView,{ Polyline,PROVIDER_GOOGLE , Marker} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import CommonDataManager from './screens/components1/CommonDataManager';
let commonData = CommonDataManager.getInstance();
//Code to disable the yellow warning box throughout the program
console.disableYellowBox = true;

export let Badgecount = 0;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.focusListener=null,
    this.state = {
      latitude: 0,
      longitude: 0,
      coordinates: [],
    appState: AppState.currentState
  }
}
  componentDidMount() {
    this.focusListener=AppState.addEventListener('change', this._handleAppStateChange);
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'Ordo App Permission',
          'message': 'Ordo App needs access to your Location '
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
            
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
          
          
        } else {

          Alert.alert("Location permission denied");

        }
       } catch (err) {
        console.warn(err);
      }
     
    }
    requestLocationPermission();
    this.loadlocation();
  }
  loadlocation(){
    Geolocation.watchPosition(
      position => {
        console.log(position.coords.latitude,"position.coords.latitude");
        commonData.setcordinates(position.coords.latitude,position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
       
      },
      error => {
        console.log(error);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 0
      }
    );
   } 

  
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }else{
      console.log('App has come to the background!')
      clearInterval(5000*60) 

    }

  }

  
  // onBackButtonPressed() {
  //   return true;
  // }
  render() {
    return (
      <Routes/>
    );
   
  }
}