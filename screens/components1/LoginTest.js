import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper';

const LoginTest = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceInUp"
          duraton="4000"
          source={require('../components1/images/CheckoutOrder.png')}
          style={styles.logo}
          resizeMode="center"
        />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.title}>Welcome to OrDo</Text>
        <Text style={styles.text}>Stay connected with your Customers and Vendors</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <LinearGradient
              colors={['#011A90', '#011A90']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Get Started</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};
export default LoginTest;

const {height} = Dimensions.get('screen');
const height_logo = height;
const {width}=Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6eeff',
  },
  header: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: height_logo,
    borderRadius:height_logo/2

  },
  footer: {
    flex: 1,
    backgroundColor: '#e6eeff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: width-20,
    height:600,
    resizeMode:'contain',
    // borderRadius:150,
  
    alignItems: 'center',
  },
  title: {
    color: '#000000',
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily:'Lato-Bold'
  },
  text: {
    color: 'grey',
    marginTop: 5,
    fontFamily:'Lato-Regular'
  },
  button: {
    // alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: width-50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    fontFamily:'Lato-Bold'
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily:'Lato-Bold'
  },
});
