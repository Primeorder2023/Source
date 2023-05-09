import React, { Component } from 'react';
import { Text,Alert, View ,Image,SafeAreaView,PermissionsAndroid,ImageBackground,Dimensions,TouchableOpacity} from 'react-native';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
import DeviceInfo from 'react-native-device-info';
import MapView from "react-native-maps";
import { withNavigation } from "react-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';


const{height}=Dimensions.get("screen");
const{width}=Dimensions.get("screen")
import Map from "./Map";
 class AppInfo extends Component {
   async reset(){
    await AsyncStorage.removeItem('isLogin')
    await AsyncStorage.removeItem('Username')

   }
   componentWillMount(){
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'Ordo App Permission',
          'message': 'Ordo App needs access to your Location '
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.forceUpdate();
          
        } else {

          Alert.alert("Location permission denied");

        }
       } catch (err) {
        // alert("Location permission err", err);
        console.warn(err);
      }
    }
    requestLocationPermission();
   }
  logout=()=>{
    this.reset();
    commonData.setusername('')
    this.forceUpdate();
   
    this.props.navigation.navigate("LoginScreen")  
  }
  render() {
    let buildNumber = DeviceInfo.getBuildNumber();
    let appName = DeviceInfo.getApplicationName();
   
    return (
      <SafeAreaView style={{ justifyContent: "center", alignItems: "center",backgroundColor:'#FFFFFF',height:height }}>
      <View style={{ flex: 2,alignItems:'center' ,flexDirection:'column'}}>
      {/* <View style={{ backgroundColor: '#FFFFFF'}}> */}
                 <View style={{flexDirection:'row',marginTop:10,ewidth:width,flex:0.1}}>
       <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
         </TouchableOpacity> 
           <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 19,width:width-60, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',alignSelf:'center',textAlign:"center",justifyContent:'center',fontFamily:"Lato-Regular",marginTop:20}}>App Information</Text>
     </View> 
     {/* </View> */}
        <View style={{height:80,width:width,alignSelf:'center',flex:0.2,backgroundColor:'white'}}>
        <Image transition={false} source={require('../components1/images/ordo_banner.jpeg')} style={{ marginTop: 10, width: width-10,height:100,resizeMode:'contain',alignSelf:'center' }} > 
          </Image>
      </View>
      <View style={{height:180,width:width,alignItems:'center',flex:0.3}}>
      <View style={{  borderRadius:4, 
               shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 4 ,height:120, width: width-20, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:2 }}>
           <Text  style={{fontFamily:'Lato-Regular',marginHorizontal:10,fontSize:20,color:"black"}}>{appName}</Text>
           <Text  style={{fontFamily:'Lato-Italic',marginHorizontal:10,color:"black"}}>An Order Management App</Text>
           {/* <Text style={{fontFamily:'Lato-Regular',marginHorizontal:10}}>Build Version :{buildNumber}</Text> */}
           <Text style={{fontFamily:'Lato-Regular',marginHorizontal:10,color:'black'}}>Build Version :{buildNumber}.22.12.1</Text>

           <Text style={{fontFamily:'Lato-Regular',marginHorizontal:10,color:"black"}}>Logged in as <Text style={{fontFamily:'Lato-Regular',fontWeight:'bold',marginHorizontal:10,color:'#011A90'}}>{commonData.getusername()}</Text></Text>
           <Text style={{fontFamily:'Lato-Regular',fontWeight:'bold',marginHorizontal:10,color:'grey'}}>Copyright © 2023 By Primesophic Technologies</Text>
            
               </View>
      </View>
   
      <View style={{height:100,width:width,alignSelf:'center',flex:0.4,flexDirection:'row-reverse'}}>
      <Map />
      </View>
    </View>
    </SafeAreaView>
    );
  }
}
export default AppInfo;