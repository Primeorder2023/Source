
import React, { Component } from 'react';
import {
Text,
Dimensions,
Alert,
ActivityIndicator,
ImageBackground,
StyleSheet,
Image,
TouchableOpacity,
SafeAreaView,
TouchableWithoutFeedback,
BackHandler,
Button,
View,
Keyboard,Platform
} from 'react-native';
import {TextInput} from "react-native-paper"
import Toast from 'react-native-simple-toast';
const Constants = require('../components1/Constants');
import DropDownPicker from 'react-native-dropdown-picker';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
import Icon from 'react-native-vector-icons/Ionicons';
// import { WebView } from 'react-native-webview';
import {getDistance, getPreciseDistance} from 'geolib';
import BackPressHandler from './BackPressHandler';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LinearGradient from 'react-native-linear-gradient';
import WebView from 'react-native-webview';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('screen');
var RNFS = require('react-native-fs');
import PercentageCircle from 'react-native-percentage-circle';
const GET_DATAURL= Constants.GET_URL;
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
class LoginScreen extends Component {
  
constructor(props) {
super(props);

// this.textHandler = this.textHandler.bind(this);
this.LoginButtonClick = this.LoginButtonClick.bind(this);
this.state = {
username: '',
forgot_username:"",
isForgotPasswordScreen:false,
type:'',
password: '',
isLoading: false,
responseCount: '',
error: '',
loadingmessage:"",
message:"",
activeqtrper:10,
isinitialsync:false,
};
this.textInput='';
this.textInputPassword='';

}



componentWillMount(){
this.setState({
username:'',
});
}
async getSession(){
 var sessionid = await AsyncStorage.getItem('sessionid')
 var user_id=await AsyncStorage.getItem('userid')
 var uname= await AsyncStorage.getItem('Username')
 commonData.setusername(uname)
 commonData.setsessionId(sessionid)
 commonData.setUserid(user_id)
}


readstoreDetails(){
  
  console.log("writting to store json file.......................")

    RNFS.readFile(storepath, 'utf8')
    .then((contents) => {
      let tempArray = commonData.gettypeArray(contents,'PO_01');
     commonData.setstoresArray(tempArray)
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
}
resetPassword=()=>{

  var that =this;
 
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "sugar_user_theme=SuiteP");

var raw = JSON.stringify({
  "__username__": that.state.forgot_username
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://dev.ordo.primesophic.com/app_change_password.php", requestOptions)
  .then(response => response.json())
  .then(result => {Toast.show('Reset Link has been sent to your registered email.', Toast.LONG)
  that.setState({isForgotPasswordScreen:false,forgot_username:""});
})
  .catch(error =>{ console.log("-------- error ------- " + error);
  Toast.show('Error while updating', Toast.LONG)
  that.setState({isForgotPasswordScreen:false,forgot_username:""}); console.log('error', error)});
}

 
storedis=()=>{
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"__module_code__":"PO_12","__query__":"po_ordousers.username='"+this.state.username+"'","__orderby__":"","__offset__":0,"__select _fields__":[""],"__max_result__":1,"__delete__":0});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(Constants.TYPE_DATA_URL, requestOptions)
  .then(response => response.json())
  .then(result => {
    var json = JSON.stringify(result.relationship_list[0].link_list[0].records);
    console.log(json, "this is for orders list array")
    let tempArray = commonData.gettypeArray(json,'PO_12');
    commonData.setstoresArray(tempArray);
    RNFS.writeFile(storepath, json, 'utf8')
    
.then((success) => {
  console.log('FILE WRITTEN!');
})
.catch((err) => {
  console.log(err.message);
});
    
    
  })
  .catch(error => console.log('error', error));
}
 
Forgotpassword=()=>{
this.setState({isForgotPasswordScreen:true,forgot_username:""});

this.forceUpdate();
}
  
 async LoginButtonClick(){
  if(this.state.username.length==0 || this.state.password.length==0){
    this.setState({error:'Field cannot be blank'})
    return;
    }
    var that = this;
    let type=99;
    
    if(that.state.type=='0'){
      type=0;
    }else if(that.state.type=='1'){
      type=1;
    }else if(that.state.type=='2'){
      type=2;
    }else if(that.state.type=='3'){
      type=3;
    }else if(that.state.type=='4'){
      type=4;
    }
    //______________________________________________
    that.state.isLoading=true;
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;
    that.setState({
      isLoading: true,
    });
    const GET_DATAURL =Constants.LOGIN_URL
    var uname=that.state.username
    var pname=that.state.password
    new Promise(function (resolve, reject) {
    const timeout = setTimeout(function () {
    didTimeOut = true;
    reject(new Error('Request timed out'));
    Alert.alert('Error', 'Coudnt Reach the Server,Try again later');
    that.setState({isLoading:false})
    }, FETCH_TIMEOUT);
  var formdata = new FormData();
formdata.append("input_type", "JSON");
formdata.append("response_type", "JSON");
formdata.append("method", "login");

formdata.append("rest_data", "{\"user_auth\":{\"__uname__\":\""+uname+"\",\"__pass__\":\""+pname+"\",\"encryption\":\"PLAIN\", \"__module_code__\":\"PO_12\",\"__token__\":\""+commonData.getFBToken()+"\"},\"application\":\"RestTest\"}");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://dev.ordo.primesophic.com/custom/service/ordo_mobileapp/OrdoMobileapp_rest.php", requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result); 

    that.setState({isLoading:false})
   
    console.log('result is', result)
    clearTimeout(timeout);
    if (!didTimeOut) {
    if(result.ErrorCode=='200'){
     
      var uid=result.id;
      commonData.setuid(uid);
      console.log("user details",uid,"result",result);
      AsyncStorage.setItem('isLogin', 'true');
      AsyncStorage.setItem('Username', that.state.username)
      AsyncStorage.setItem('sessionid', result.sessId)
      AsyncStorage.setItem('ordoid', uid)
      AsyncStorage.setItem('userid',uid)
      AsyncStorage.setItem('type',result.type)
      AsyncStorage.setItem('reward',result.reward)
      AsyncStorage.setItem("syncedtime","")
      commonData.setusertype(result.type);
      commonData.setUserID(uid)
      that.setState({
  error: '',
  isLoading:false,
  username:'',
  password:''
  });

  if(result.type==1)
  that.props.navigation?.navigate("DeliveryMain")
  else{
that.setState({isinitialsync:true});
// that.performinitialSync();
that.props.navigation?.navigate("Distributor",{initdist:"t"});
  }
  // that.props.navigation?.navigate("TabScreen")

  that.getSession();
    }
        
    else{
        that.setState({
      error: 'Invalid Credentials',
      });
      that.setState({
        isLoading:false,
        username:'',
        password:''
        });
  
        }
      }
     
  
  
  })
  .catch(error => console.log('error', error));
});
}
performTimeConsumingTask = async () => {
return new Promise((resolve) =>
setTimeout(
() => { resolve('result') },
5000
)
);

}
performinitialSync=()=>{
  this.loadorders();
}
async loadorders(){
  var that = this;
  that.setState({loadingmessage:"Downloading Orders",activeqtrper:30})
  var myHeaders = new Headers();
  const value = await AsyncStorage.getItem('Username');
  myHeaders.append("Content-Type", "application/json");
  that.state.syncquery="";
  // if(that.state.synctime!=""){
  //   that.state.syncquery="&&aos_quotes.date_modified >'"+that.state.synctime+"'";
  // }
  var raw = "{\n    \"__module_code__\": \"PO_17\",\"__session_id__\":\""+commonData.getsessionId()+"\",\n    \"__query__\": \"created_userval_c='"+value+"' "+that.state.syncquery+"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch(Constants.GET_URL, requestOptions)
  .then(response => response.json())
  .then(result => {console.log("orders",result);
        let json = JSON.stringify(result.entry_list);
        commonData.setorderscount(result.entry_list.length);
        let tempArray = commonData.gettypeArray(json,'PO_14')
    commonData.setorderssArray(tempArray)
      RNFS.writeFile(orderpath, json, 'utf8')
        .then((success) => {
          console.log('Orders Written');
        })
        .catch((err) => {
          console.log(err.message);
        });
     that.setState({
       OrdersLoaded:true
     });
     that.loadsku();
  })
  .catch(error => console.log('error', error));
  

}
async loadsku(){
  var myHeaders = new Headers();
  var typeval = await AsyncStorage.getItem('type');
  commonData.setusertype(typeval);
  myHeaders.append("Content-Type", " application/json");
  
  var raw = "{\n    \"__module_code__\": \"PO_20\",\n    \"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
 
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  var that = this; 
    that.setState({loadingmessage:"Downloading Products",activeqtrper:70})

  const FETCH_TIMEOUT = 2000;
    let didTimeOut = false;
    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
       
      }, FETCH_TIMEOUT);
fetch(GET_DATAURL, requestOptions)
  .then(response => response.json())
  .then(result => {
   
    // write the file
    var json = JSON.stringify(result.entry_list);
    commonData.setskucount(result.entry_list.length);
    let tempArray = commonData.gettypeArray(json,'PO_06')
    commonData.setSkuArray(tempArray)
    RNFS.writeFile(skupath, json, 'utf8')
      .then((success) => {
        console.log('SKU FILE WRITTEN!',json);

      })
      .catch((err) => {
        console.log(err.message,"rtgfghfghghgghh");
      });
     
     that.loadaccounts();
    // Clear the timeout as cleanup
    clearTimeout(timeout);
    if (!didTimeOut) {
      resolve(result);
    }})
  .catch(error => console.log('error', error));
})
.then(function () {
  // Request success and no timeout
  console.log('good promise, no timeout! ');
})
.catch(function (err) {
  // Error: response error, request timeout or runtime error
  console.log('promise error! ', err);
});
}
async loadaccounts(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", " application/json");

var raw = "{\n    \"__module_code__\": \"PO_19\",\n    \"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
var that = this;
  that.setState({loadingmessage:"Downloading Stores",activeqtrper:100})

    const FETCH_TIMEOUT = 1000;
    let didTimeOut = false;
    that.setState({ loading: true });
    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
        that.setState({ loading: false });
      }, FETCH_TIMEOUT);

      fetch(GET_DATAURL, requestOptions)
  .then(response => response.json())
  .then(result => {
    var json = JSON.stringify(result.entry_list);
    let tempArray = commonData.gettypeArray(json,'PO_19')
    commonData.setstoresArray(tempArray)
    RNFS.writeFile(storepath, json, 'utf8')
      .then((success) => {
        // console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        // console.log(err.message);
      });
     
   
    // that.props.navigation?.navigate("Distributor",{initdist:"t"});
    if (!didTimeOut) {
      console.log('fetch good! ', result);
      resolve(result);
    }})
  .catch(error => console.log('error', error));
})
.then(function () {
  // Request success and no timeout
  console.log('good promise, no timeout! ');
})
.catch(function (err) {
  // Error: response error, request timeout or runtime error
  console.log('promise error! ', err);
});
}

componentDidMount() {

  PushNotification.configure({
    onRegister: function(token) {
      console.log("TOKEN:", token.token);
      AsyncStorage.setItem('FBtoken', token.token);
     commonData.setFBToken(token.token);
      
     
    },
    onAction:function(notification){
      console.log("notification:", notification);
     
    },
    onNotification: function(notification) {
      console.log("NOTIFICATION************:", notification);
     if(Platform.OS === 'ios')
       notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // Android only
    senderID: "877731960223",
    // iOS only
    permissions: {
      alert: true,
      badge: true,
      sound: true,
      ignoreInForeground:true
    },
   
    popInitialNotification: true,
    requestPermissions: true
  });
}

calculatelocation(latitude1, longitude1, latitude2, longitude2, unit) {
 
 
    var theta = longitude1 - longitude2;
    var distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
        Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
        Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
    );
    if (unit=="miles") {
        return Math.round(distance, 2);
    } else if (unit=="kilometers") {
        return Math.round(distance * 1.609344, 2);
    } else {
        return 0;
    }
 
}
changedPasswordValue=(text)=>{
  this.setState({
  password:text,
  error:''
  })
  if(text.length==0){
  this.setState({
  error:text
  })
  }
  }

changedValue=(text)=>{
this.setState({
username:text,
error:''
})
if(text.length==0){
this.setState({
error:text
})
}
}
render() {
if(this.state.isinitialsync==true){
  return(  
  <View style={{ flex: 1,justifyContent:'center', backgroundColor:'#FFFFFF'}}>
  <View style={{alignSelf:'center',marginTop:20}}>

    <PercentageCircle textStyle={{color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',fontSize:24}} radius={50} percent={this.state.activeqtrper} color={"#011A90"}></PercentageCircle>  
  </View>
        <ActivityIndicator
               animating = {true}
               color = {'#011A90'}
               size = "large"/>
             
        <Text style={{alignSelf:'center',color:'#21283d',fontSize:17}} >{this.state.message}</Text>
        <Text style={{alignSelf:'center',color:'#011A90',fontSize:14,marginTop:5}} >{this.state.loadingmessage}</Text>
        <Text style={{alignSelf:'center',color:'#21283d',fontSize:14,marginTop:5}} >Please wait, this action may take few hours.</Text>


         </View>
         )
}
if(this.state.isForgotPasswordScreen==true){
  return(<SafeAreaView style={{flex:1, backgroundColor:'white'}}>
     <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.setState({isForgotPasswordScreen:false})}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
        
      </View> 
  <View
    style={{
    alignSelf:'center',
    marginTop:-10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    }}>
      
    <View style={styles.ForgotSection}>
    <Image transition={false} source={require('./images/forgot-password.png')} style={{ height: 30, width: 30 }}></Image>
</View>
<View style={styles.ForgotSection}>
<Text style={{
  fontFamily:'Lato-Bold',
  fontSize:24,
  alignSelf:'center'
}}>Forgot Password?
  </Text></View>
  <Text style={{
  fontFamily:'Lato-Bold',
  color:'#dddd',
  fontSize:14,
  alignSelf:'center'
}}>No worries, we'll send you reset Instructions.
  </Text>
    <View style={styles.searchSection}>
    {/* <Icon style={styles.searchIcon}  name="ios-person-outline" size={20} color="#000"/> */}
    <Image transition={false} source={require('./images/user.png')} style={{ height: 20, width: 20 }}></Image>

    <TextInput
       label="Enter your username"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"
autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={(username) => {this.setState({forgot_username:username})}}
clearButtonMode="always"
ref={forgot_username => { this.textInput = forgot_username }}
style={{

backgroundColor:'white',
width:width-110,
height:60,
color: '#534F64',
marginTop: -10,
}}
value={this.state.forgot_username}
/>
 
</View>

<View style={styles.searchSection}>

<TouchableOpacity title="Login" onPress={()=>{this.resetPassword();}} style={{ alignSelf: 'flex-end',marginTop:20, justifyContent: 'center'}}>
                
                <LinearGradient
             colors={['#ffffff', '#ffffff']}
             style={styles.signIn}>
               
             <Text style={styles.textSignF}>Reset Password </Text>
           
           </LinearGradient>
              </TouchableOpacity>
              </View>
    </View></SafeAreaView>);
}
if (this.state.isLoading) {
return (
<View
style={{
flex: 1,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: 'rgba(52, 52, 52, 0.8)',
}}>
<ActivityIndicator />
<Text style={{color:'black'}}>Loading , Please wait.</Text>
</View>
);
}

return (
<SafeAreaView style={{ flex: 1 }} backgroundColor='#FFFFFF'>

{/* <View style={{borderTopLeftRadius:30}} backgroundColor='#FFFFFF'> */}

<View style={{ marginTop:10 ,width:width-40,alignSelf:'center'}}>
          <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, width: 150,height:70}} > 
          </Image>
          <Text
style={{
color:'#a5a5a5',
// fontWeight: '700',
// alignSelf: 'center',
width:width-60,
alignSelf:'center',
fontSize:12,
marginTop: -20,
height:30,
fontFamily:'Lato-Regular'
}}>
We don't make it until you order it.
</Text>
          </View>
          
          <Text
style={{
color:'black',
// fontWeight: '700',
// alignSelf: 'center',
width:width-60,
alignSelf:'center',
fontSize:24,
marginTop: 20,
height:40,
fontFamily:'Lato-Bold'
}}>
{' '}
Login
</Text>

<View>
<View style={styles.searchSection}>
    {/* <Icon style={styles.searchIcon}  name="ios-person-outline" size={20} color="#000"/> */}
    <Image transition={false} source={require('./images/user.png')} style={{ height: 20, width: 20 }}></Image>

    <TextInput
       label="Username"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"
autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={(username) => {this.setState({username:username})}}
clearButtonMode="always"
ref={username => { this.textInput = username }}
style={{

backgroundColor:'white',
width:width-110,
height:60,
color: '#534F64',
marginTop: -10,
}}


value={this.state.username}
/>
 
</View>


<View style={styles.searchSection}>
  
    {/* <Icon style={styles.searchIcon} name="lock-closed-sharp" size={20} color="#000"/> */}
    <Image transition={false} source={require('./images/padlock.png')} style={{ height: 20, width: 20 }}></Image>

    <TextInput
        label="Password"

        type="outlined"
        placeholderTextColor='#dddddd'
        underlineColor='#dddddd'

        activeUnderlineColor='#dddddd'
        outlineColor="#dddddd"
        selectionColor="#dddddd"
        autoCompleteType='off'
        autoCorrect={false}
        keyboardType="default"
        fontSize={8}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry={true}
        onChangeText={(password) => {this.setState({password:password})}}
        clearButtonMode="always"
        ref={username => { this.textInput = username }}
        style={{

        backgroundColor:'white',
        width:width-110,

        height:60,
        color: '#534F64',
        marginTop: -10,
        }}
        value={this.state.password}
    />
 
</View>
</View>
      <Text
      style={{
      marginTop: 0,
      color: 'red',
      textAlign: 'center',
      alignSelf: 'center',
      fontFamily:'Lato-Regular'
      }}>
      {this.state.error}
      </Text>


    <TouchableOpacity title="Login" onPress={this.LoginButtonClick} style={{ alignSelf: 'flex-end',paddingRight:30,marginTop:20, justifyContent: 'center'}}>
    <LinearGradient
    colors={['#011A90', '#011A90']}
    style={styles.signIn}>
    <Text style={styles.textSign}>Continue </Text>
    <Image transition={false} source={require('./images/fast-forward.png')} style={{ height: 20, width: 20 }}></Image>
    </LinearGradient>
    </TouchableOpacity>
    <TouchableOpacity title="Forgot Password" onPress={this.Forgotpassword} style={{ alignSelf: 'flex-end',paddingRight:30,marginTop:20, justifyContent: 'center'}}>

    <LinearGradient
    colors={['#ffffff', '#ffffff']}
    style={styles.Forgot}>

    <Text style={styles.textForgot}>Forgot Password?</Text>

    </LinearGradient>
    </TouchableOpacity>

</SafeAreaView>
);
}
}

const styles = StyleSheet.create({
  searchSection: {
    height:70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop:0,width:width-70,alignSelf:'center',
    
},
ForgotSection: {
  // flex: 1,
  height:30,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  marginTop:0,width:width-70,alignSelf:'center',
  
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    fontFamily:'Lato-Regular',
    alignSelf:'flex-start'
},
cardContainer: {
marginTop: 10,
overflow: 'hidden',
borderRadius: 10,
backgroundColor: '#F5F5F5',
marginHorizontal: 5,
elevation: 3,
marginVertical: 10,
shadowColor: '#F5F5F5',
shadowOffset: { width: 0, height: 0 },
shadowRadius: 2,
shadowOpacity: 0.4,
},
container: {
flex: 0,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#ecf0f1',
marginTop: 10,
},

flatliststyle: {
marginTop: 1,
overflow: 'hidden',
borderRadius: 10,
backgroundColor: '#ffffff',
marginHorizontal: 5,
elevation: 3,
marginVertical: 1,
shadowColor: '#534F64',
shadowOffset: { width: 0, height: 0 },
shadowRadius: 2,
shadowOpacity: 0.4,
alignContent: 'center',
},
modal: {
flex: 1,
alignItems: 'center',
backgroundColor: '#00ff00',
padding: 100,
},
text: {
color: '#3f2949',
marginTop: 10,
fontFamily:'Lato-Bold'
},
textOrder: {
color: '#00ACEA',
fontSize: 27,
marginHorizontal: -25,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
// fontWeight:'bold'
},
textPrime: {
color: '#34495A',
fontSize: 27,
marginHorizontal: 27,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
// fontWeight:'bold'
},
RunningText: {
color: '#DCDCDE',
fontSize: 17,
fontWeight: 'bold',
fontFamily:'Lato-Bold'
},
input: {
width: 200,
color: '#534F64',
alignSelf: 'center',
marginTop: 10,
textAlign: 'center',
fontFamily:'Lato-Bold'
},
TextInputStyleClass: {
// Setting up Hint Align center.
textAlign: 'center',
alignSelf: 'center',
// Setting up TextInput height as 50 pixel.
height: 40,
width: 150,
padding: 10,
// Set border width.
borderWidth: 2,
color: '#DCDCDE',
// Set border Hex Color Code Here.
borderColor: '#00ACEA',

// Set border Radius.
borderRadius: 25,

//Set background color of Text Input.
backgroundColor: '#00ACEA',
},
submitButton: {
padding: 10,
margin: 15,
height: 50,
shadowColor: 'rgba(0, 0, 0, 0.1)',
shadowOpacity: 0.8,
elevation: 6,
shadowRadius: 15,
shadowOffset: { width: 1, height: 13 },
},
button: {
  alignItems: 'flex-end',
  marginTop: 30,
},
signIn: {
  width: width-60,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 180,
  flexDirection: 'row',
  borderWidth:1,
  borderColor:'#011A90',
},
Forgot: {
  width: width-60,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 180,
  flexDirection: 'row',
  borderWidth:0,
  borderColor:'#011A90',
},
textSign: {
  color: '#ffffff',
  fontWeight: '500',
  fontSize:17,
  fontFamily:'Lato-Bold'
},
textSignF: {
  // color: '#ffffff',
  color:"#011A90",
  fontWeight: '500',
  fontSize:17,
  fontFamily:'Lato-Bold'
},
textForgot: {
  color: '#a5a5a5',
  fontWeight: '500',
  fontSize:14,
  fontFamily:'Lato-Bold',
  marginTop:-30,
  textDecorationLine: 'underline'
  
},
textStyle: {
  marginTop: 30,
  fontSize: 16,
  textAlign: 'center',
  color: 'black',
  paddingVertical: 20,
},
buttonStyle: {
  justifyContent: 'center',
  alignItems: 'center',
  height: 50,
  backgroundColor: '#dddddd',
  margin: 10,
},
});

export default LoginScreen;

