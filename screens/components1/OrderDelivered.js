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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper';
const {width}=Dimensions.get("screen")
 class OrderDelivered extends Component {
 

  render() {
    let TYPE=this.props.navigation.getParam('TYPE','')
    let Title="Order Sent Successfully!"
    let subtitle="Thank you for your Order!"
    if(TYPE=="RETURN"){

      Title="Return Order Initiated"
      subtitle=""
    }
    return (
      <View style={{ justifyContent: "center", alignItems: "center" ,backgroundColor:'#FFFFFF',height:900}}>
     <Animatable.View style={styles.footer} animation="fadeInUpBig">
       <View style={{flex:3}}>
         <View style={{flex:1}}>
        <Text style={styles.title}>Thank You</Text>
        <Image source={require('../components1/images/order_logo.jpeg')} style={{flex:0.5,height:200,width:200,alignSelf:'center',marginHorizontal:10,marginTop:20}}>
            </Image>
        <Text style={styles.text}>Your Order is Placed Successfully</Text>
        <Text style={styles.text}>Please check your email for Invoice</Text>
       
            </View>
            <View>
              <Text style={styles.text}></Text>
            </View>
        {/* <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',marginTop:10}}></View> */}
        {/* {TYPE==""?  */}
         <Text style={{color:'#000000',fontFamily:'Lato-Bold',fontSize:16,alignSelf:'center',width:width-60,alignContent:'center'}}>Do You wish to place a new Order?</Text>
        <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',flex:1,marginTop:10,width:width-60,alignSelf:'center'}}>
        
      
          <TouchableOpacity onPress={() => this.props.navigation.navigate('customer')}>
            <LinearGradient
              colors={['#FFFFFF', '#FFFFFF']}
              style={styles.yesbtn}>
              <Text style={{color:'green',fontFamily:'Lato-Bold'}}>Yes</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>

      
          <TouchableOpacity style={{marginHorizontal:10}} onPress={() => this.props.navigation.navigate('HomeTab')}>
            <LinearGradient
              colors={['#FFFFFF', '#FFFFFF']}
              style={styles.nobtn}>
              <Text style={{color:'#800000',fontFamily:'Lato-Bold'}}>No</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>
          </View>
          </View>
      </Animatable.View>
        
      </View>
    );
  }
}
export default OrderDelivered;
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
   shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textSign: {
    color: 'white',
    // fontWeight: 'bold',
    fontFamily:'Lato-Bold'
  },
});
