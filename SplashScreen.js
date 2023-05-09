import React, {Component} from 'react';
import {Text,View,Image,Alert,StyleSheet,SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from './screens/components1/CommonDataManager.js';
let commonData = CommonDataManager.getInstance();
class SplashScreen extends React.Component{
   
    async componentDidMount(){
      
       
            const isLogin = await AsyncStorage.getItem('isLogin');
            const value=await AsyncStorage.getItem('Username')
           const type =await AsyncStorage.getItem('type');
            const token= await AsyncStorage.getItem('FBtoken');
            const uid =await AsyncStorage.getItem('userid')
            commonData.setusertype(type);
            commonData.setUserID(uid);
                commonData.setLoginType(type);
                commonData.setFBToken(token); 
            
            setTimeout(() => {
               
                const { navigate } = this.props.navigation;
                if(isLogin != null || isLogin == "true")
                {
                   
                    commonData.setusername(value)
                
                    this.props.navigation.navigate("Distributor",{initdist:"f"});
                    
                }
                else
                {
                    navigate('LoginTest')
    
                }
            },
            1500
            );
      
    }


    render()
    
    {
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:'#ffffff'}}>
                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                  <Image source={require('../PrimeOrderv2/screens/components1/images/OrDoSplash.png')} style={{width:150,height:95}} > 
                  </Image>
                </View>
            </View>
            <Text style={{alignSelf:'center',fontFamily:'Lato-Bold',color:'black',flexDirection:'row-reverse'}}>©2023 PrimeSophic. All rights reserved.</Text>
            </SafeAreaView>
        )
    }

}
const styles = StyleSheet.create({
    textOrder: {
        color: '#00ACEA',
        fontSize: 27,
        fontWeight:'bold',
        fontFamily:'Lato-Bold'
        // fontWeight:'bold'
    
      },
      textPrime: {
        color: '#34495A',
        fontSize: 27,
        fontWeight:'bold',
        fontFamily:'Lato-Bold'
        // fontWeight:'bold'
      },

});

export default SplashScreen;