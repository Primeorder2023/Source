import React, { Component } from 'react';
// import { Text, View ,Image,ImageBackground,TouchableOpacity} from 'react-native';
// import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import { Card } from 'native-base'
const {width}=Dimensions.get("screen")
import {WebView} from 'react-native-webview'
 class OrderSent extends Component {
 
download=()=>{
  var base64Icon=this.state.fileData;
// this.setDocumentDetails();
const file_path = RNFS.DocumentDirectoryPath + "/"+this.state.DisplayFileName;

// const file_path = RNFS.ExternalDirectoryPath + "/haha.png"
var image_data = '';
image_data = base64Icon;

RNFS.writeFile(file_path, image_data, 'base64')
.then((success) => {

})
.catch((error) => {
alert(JSON.stringify(error));
});
const path = file_path;
}
  render() {
    let TYPE=this.props.navigation.getParam('TYPE','')
    let Title="Your Order is Placed Successfully!"
    let subtitle="Thank you for your Order!"
    if(TYPE=="RETURN"){

      Title="Return Order Initiated"
      subtitle=""
    }
    
    return (
      
      <SafeAreaView style={{ justifyContent: "center", alignItems: "center" ,backgroundColor:'#FFFFFF',height:900}}>
       
     <Animatable.View style={styles.footer} animation="fadeInUpBig">
       <View style={{flex:3}}>
         <View style={{flex:0.9}}>
        <Text style={styles.title}>Thank You</Text>
        <Image source={require('../components1/images/order_logo.jpeg')} style={{flex:0.5,height:200,width:200,alignSelf:'center',marginHorizontal:10,marginTop:20}}>
          </Image>
        <Text style={styles.text}>{Title}</Text>
        <Text style={styles.text}>Please check your email for Invoice</Text>
          {/* <Text style={styles.text}>Check your downloads for your Invoice copy</Text> */}
         
            <Text style={{color:'#000000',fontFamily:'Lato-Bold',fontWeight:'500',fontSize:16,alignSelf:'center',width:width-60,alignContent:'center',textAlign:'center',marginTop:20}}>Do You wish to place a new Order?</Text>
          <View style={{flexDirection:'row',backgroundColor:'white',marginTop:0,width:width-60,height:100,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
          <View style={{flex: 1}}>
    {/* <WebView
      style={{flex: 1}}
      source={{uri:"https://dev.ordo.primesophic.com/index.php?preview=yes&&entryPoint=downloadquote&id=604403fe-0549-9751-3188-638a08080be4&type=Notes"}}
    /> */}
</View>
<View style={{flexDirection:'row',backgroundColor:'white',marginTop:0,width:width-60,height:100,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
<TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.props.navigation.navigate('customer',{TYPE:""})}>
   
 <Text style={{color:'green',fontFamily:'Lato-Bold',alignSelf:'center',marginTop:10}}>Yes</Text>
     
  </TouchableOpacity>


  <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.props.navigation.navigate('HomeTab')}>
    
      <Text style={{color:'#800000',fontFamily:'Lato-Bold',alignSelf:'center',marginTop:10}}>No</Text>
      
  
  </TouchableOpacity>
  </View>
  </View>
        </View>
        
      
          </View>
      </Animatable.View>
        
      </SafeAreaView>
    );
  }
}
export default OrderSent;
const {height} = Dimensions.get('screen');
const height_logo = height*2.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011A90',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: height_logo,
    borderRadius:height_logo/2

  },
  footer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius:150,
    alignItems: 'center',
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf:'center'
  },
  text: {
    color: 'grey',
    marginTop: 5,
    alignSelf:'center'
  },
  button: {
    alignItems: 'flex-end',
    marginStart:100
  },
  signIn: {
    width: 140,
    height: 40,
    borderWidth:1,
  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',

  },
  yesbtn: {
    width: 140,
    height: 40,
   
    borderWidth:1,
    borderColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',

  },
  nobtn: {
    width: 140,
    height: 40,
    
    borderWidth:1,
    borderColor:'#800000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',

  },
  signIn1: {
    // alignItems: 'flex-end',
    marginBottom:100
  },
  textSign: {
    color: 'white',
    // fontWeight: 'bold',
    fontFamily:'Lato-Bold'
  },
});
