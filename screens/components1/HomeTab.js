



import React, { Component } from 'react';
import Carousel from 'react-native-banner-carousel';
import { Text, View,Dimensions,ActivityIndicator,StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from './CommonDataManager';
import { Card } from 'native-base'
import { withNavigation } from "react-navigation";
// import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
const{height}=Dimensions.get("window");
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; 
import TextTicker from 'react-native-text-ticker'
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';

// import HSNZ from "react-native-marquee";
//FB#24
let screenwidth= Dimensions.get('window').width;
let screenheight= Dimensions.get('window').height;
const BannerWidth = screenwidth-20;
const BannerHeight = screenheight/4-20;

var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';

const{width}=Dimensions.get("screen")
const connection_error='Could not Sync With the Server.Try again later'
let connnctionFailed=false
const Constants = require('../components1/Constants');
const GET_DATAURL= Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
let listArray = [];
let orderArray=[];
let skuArray = [];
const OFFLINE='Offline'
const ONLINE='Online'

  let data = [{
    value: 'Return',
  }, {
    value: 'New',
  }, {
    value: 'History',
  }];
   if(screenwidth>375){
       screenwidth=115;
    }else{
      screenwidth=105;
    }
class HomeTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenheight:height,
            arrayHolder:[{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"}],
         
      isVisible: false,
      userValue: '', totalqty: '',
      loading: false,
      refreshing:false,
      TotalAmount: '',
      items: '',
      Username:'',
      custname: '',
      custid:'',
      custaddress: '',
      connection_Status : ONLINE,
      OffersArray:commonData.getoffersArray(),
      type:"99"
      


    }
    
  }
  logout=()=>{
   
    console.log("after output")
    this.reset();
    commonData.setusername('')
    this.forceUpdate();
  //  this.props.navigation.goBack();
    this.props.navigation.navigate("LoginScreen")  
  }



  async getSession(){
    var sessionid = await AsyncStorage.getItem('sessionid')
    var user_id=await AsyncStorage.getItem('ordoid')
    var uname= await AsyncStorage.getItem('Username')

    commonData.setUname(uname)
    commonData.setsessionId(sessionid)
    commonData.setuid(user_id)
   }
   async getuser() {
    this.state.userValue = this.props.navigation.getParam('userid', '')
    var user_id=await AsyncStorage.getItem('ordoid')
    var uname= await AsyncStorage.getItem('Username')
    this.state.userValue=uname;
    this.state.totalqty = commonData.getTotalQty();
    this.state.TotalAmount = commonData.getTotalPrice();
    this.state.items = commonData.getTotalItems();
    this.state.custname = commonData.getActiveCustName();
    this.state.custid=commonData.getActiveCustomerID();
    let address=commonData.getActiveAdress();
    this.state.custaddress = address;
    this.forceUpdate();
  }
  async LoadDetails(){
    this.state.type= await AsyncStorage.getItem('type')
    var uname= await AsyncStorage.getItem('Username')
    var rewards=await AsyncStorage.getItem('reward');
    this.getuser();
    RNFS.readDir(RNFS.DocumentDirectoryPath+'/unsent_folder' + '/'+uname)
    .then((result) => {
     const { navigation } = this.props;
      console.log('GOT RESULT form extenal directory', result);
       let tempArray=commonData.getunsentlist(result);
      let sortedarray= tempArray.sort((a, b) => (a.TimeStamp < b.TimeStamp) ? 1 : -1)
      commonData.setpendingcount(tempArray.length);
      commonData.setUnsetfilearray(tempArray);
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
   commonData.setoffercount(commonData.getoffersArray().length);
   commonData.setskucount(commonData.getSkuArray().length);
   commonData.setstorescount(commonData.getstoresArray().length);
   commonData.setcompletedcount(commonData.getordderssArray().length);
   commonData.setrewardpoints(rewards);
   this.forceUpdate();
   
   }
  
     componentDidMount() {
      //FB#24
      this.setState({connection_Status :ONLINE})
      setInterval(function(){ 
        var uid=commonData.getUserID();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({"__module_code__":"PO_32","__session_id__":commonData.getsessionId(),"__query__":"","__name_value_list__":{"latitude":""+commonData.getlatitude()+"","longitude":""+commonData.getlongitude()+"","po_ordousers_id_c":""+uid+""}});
    
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://143.110.178.47/OrdoCRM7126/set_data_s.php", requestOptions)
        .then(response => response.text())
        .then(result => {console.log(result);
          })
        .catch(error => console.log('error', error));
    }, 5000*60);
    
    const { navigation } = this.props;

    this.focusListener = navigation.addListener("didFocus", () => {  
     this.LoadDetails();
     
    });
    this.focusListener = navigation.addListener("willBlur", () => {
      
    });
    console.log(commonData.getFBToken(),"*****getFBToken********");

 }
 async loadstore(){
  var myHeaders = new Headers();
myHeaders.append("Content-Type", " application/json");
let uid= await AsyncStorage.getItem('ordoid')

var raw = "{\n\"__module_code__\": \"PO_01\", \"__session_id__\":\""+commonData.getsessionId()+"\",\n\"__query__\":  \"po_stores.po_ordousers_id1_c='"+uid+"'\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
var that = this;
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
  .then(result => {listArray = result.entry_list;

    var json = JSON.stringify(listArray);
    RNFS.writeFile(storepath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
   
    // Clear the timeout as cleanup
    clearTimeout(timeout);
    if (!didTimeOut) {
      console.log('fetch good! ', response);
      resolve(response);
    }})
  .catch(error => {console.log('error', error);that.readstoreDetails();});
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
 

    loadsku(){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", " application/json");
      
      var raw = "{\n\"__module_code__\": \"PO_20\", \"__session_id__\":\""+commonData.getsessionId()+"\",\n\"__query__\": \"aos_products.deleted=0\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      var that = this; 
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
      .then(result => {skuArray = result.entry_list;
        console.log("The sku data which come from the server here")
        console.log(skuArray);
        // write the file
        var json = JSON.stringify(skuArray);
        console.log(json, "this is sku order array list array")
        RNFS.writeFile(skupath, json, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
        
        console.log(response, "smile pleasea")
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if (!didTimeOut) {
          console.log('fetch good! ', response);
          resolve(response);
        }})
      .catch(error => {console.log('error', error);that.readSku()});
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

 
async loadorders(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", " application/json");
  
  // var raw = "{\n\"__module_code__\": \"PO_14\",\n\"__query__\": \"created_by_name='"+uname+"'\",\n\"__orderby__\": \"date_entered DESC\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";  
  var raw = "{\n    \"__module_code__\": \"PO_17\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var that = this;
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;
    that.setState({ loading: true });
    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
        that.setState({ loading: false });
      }, FETCH_TIMEOUT);
      const value = commonData.getusername();
      let variable=commonData.getusername();
     
      fetch(GET_DATAURL, {
        method: "POST",
        // body: JSON.stringify({
        //   "__module_code__": "PO_14",
        //   "__query__": "username = '" + value + "'",
        //   "__orderby__": "date_entered DESC",
        //   "__offset__": 0,
        //   "__select _fields__": [""],
        //   "__max_result__": 1,
        //   "__delete__": 0,
        // })
        body: JSON.stringify({
          "__module_code__": "PO_17",
          "__query__": "initiated_by='"+variable+"'",
          "__orderby__": "",
          "__offset__": 0,
          "__session_id__":commonData.getsessionId(),
          "__select _fields__": [""],
          "__max_result__": 1,
          "__delete__": 0,
        })
      }).then(function (response) {
        return response.json();})
  .then(result => {orderArray = result.entry_list;
    console.log("The previous order data which come from the server here", result)
    console.log(orderArray);
    var json = JSON.stringify(orderArray);
    console.log(json, "this is for orders list array")
    RNFS.writeFile(orderpath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
        
      });
   
    console.log(response, "smile pleasea")
    // Clear the timeout as cleanup
    clearTimeout(timeout);
    if (!didTimeOut) {
      console.log('fetch good! ', response);
      resolve(response);
    }})
  .catch(error => {that.readOrders();console.log('error', error)});

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
 

  componentDidUpdate() {
    const value = commonData.getUserID();
      if (value !== null) {
    //  this.readstoreDetails();
    //  this.readSku();
    //  this.readOrders();
      }
  }
  readstoreDetails(){
  
 

    RNFS.readFile(storepath, 'utf8')
    .then((contents) => {
     
      let tempArray = commonData.gettypeArray(contents,'PO_01');
    
      // here we are getting contents from the json and passisng that contents to the function and try to retrieve it .
      commonData.setstoresArray(tempArray)
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
}
readOffersDetails(){
  
 

  RNFS.readFile(offerpath, 'utf8')
  .then((contents) => {
   
   commonData.setoffersArray(contents);
   this.setState({OffersArray:contents})
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });

}


readSku(){
  
  
  RNFS.readFile(skupath, 'utf8')
    .then((contents) => {
      // log the file contents
      console.log("writting files to orders.....................")
      console.log(contents);
      console.log("Json_parse");
      console.log(JSON.parse(contents));
      console.log("Reading Order array from json and use it throughout app using common data manager")
      let tempArray = commonData.gettypeArray(contents,'PO_06')
      commonData.setSkuArray(tempArray)
      console.log("temparay array")
      console.log(tempArray);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  
 }

 readOrders(){
      RNFS.readFile(orderpath, 'utf8')
        .then((contents) => {
          contentsOrder=contents
          // log the file contents
          console.log("writting files to orders.....................")
          console.log(contents);
          console.log("Json_parse");
          console.log(JSON.parse(contents));
          console.log("Reading Order array from json and use it throughout app using common data manager")
          let tempArray = commonData.gettypeArray(contents,'PO_14')
          commonData.setorderssArray(tempArray)
          console.log("temparay array")
          console.log(tempArray);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
     
 
      }

     
  synccall =() =>{
    
    this.loadorders();
    this.loadsku();
    this.loadstore();

  }
  
  retrieveData = async () => {
    try {
     
        this.synccall();
        
      // }
     } catch (error) {
       // Error retrieving data
     }
  }

  onbuttonClick = () => {
   
  }

  itemSepartor = () => {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: "#000",
        }} />
    );
  }
  getdetails= () =>  {
    let variable=commonData.getusername();
    if(this.state.connection_Status==OFFLINE){
      Alert.alert('No Internet Connection!!')
      return;
    }
    var that = this;
    // fetch("http://192.168.9.14:8080/get_data_s.php", {
      fetch(GET_DATAURL, {
      method: "POST",
      // body: JSON.stringify({
      //   "__module_code__": "PO_14",
      //   "__query__": "created_by_name='"+variable+"'",
      //   "__orderby__": "date_entered DESC",
      //   "__offset__": 0,
      //   "__select _fields__": [""],
      //   "__max_result__": 1,
      //   "__delete__": 0
      //   })
      body: JSON.stringify({
        "__module_code__": "PO_17",
        "__query__": "initiated_by='"+variable+"'",
        "__orderby__": "",
        "__offset__": 0,
        "__session_id__":commonData.getsessionId(),
        "__select _fields__": [""],
        "__max_result__": 1,
        "__delete__": 0
        })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
     if(result.result_count>0){
      // that.setuserDetails()
      // that.retrieveData()
      that.setState({ isVisible: true });
      commonData.isRegistered=true
  
      that.forceUpdate()
     }else{
       Alert.alert('Invalid Credentials.')
       that.forceUpdate()
     }
      
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
     } 
     makeRemoteRequest = () => {
      //  this.setState({ loading: true });
      //  this.setState({
      //      loading: false,
      //  });
    
   };
   async reset(){
    await AsyncStorage.setItem('isLogin',"")
    await AsyncStorage.setItem('Username',"")
    await AsyncStorage.setItem('ordoid',"")

   }
   getdatafrompath(path){
     var that =this
    //  that.state.Username=''
     commonData.isRegistered=false
    //  that.state.isVisible=false
    RNFS.readFile(path, 'utf8')
    .then((contents) => {
    console.log(contents,"++++++++++++++++++++",contents.length);
    // that.state.Username=contents
    if(contents.length>0)
    that.state.isVisible=true;
  })
  .catch((err) => {
  });  
   }
  

    sendLocationtoServer=()=>{
      var location="{"+commonData.getlatitude()+","+commonData.getlongitude()+"}";
      var uid=commonData.getuid();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({"__module_code__":"PO_22","__session_id__":commonData.getsessionId(),"__query__":"","__name_value_list__":{"latitude":""+commonData.getlatitude()+"","longitude":""+commonData.getlongitude()+"","id":""+uid+""}});
    
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://143.110.178.47/OrdoCRM7126/set_data_s.php", requestOptions)
        .then(response => response.text())
        .then(result => {console.log(result);
          })
        .catch(error => console.log('error', error));
      
   }
    renderPage(image, index) {
      return (
          <View key={index} style={{borderRadius:10}}>
              <Image style={{ width: BannerWidth, height: BannerHeight-0,resizeMode:'stretch' ,borderRadius:10}} source={{ uri:image }} />
          <TouchableOpacity style={{backgroundColor:'red',height:50,width:100,borderRadius:25}} onPress={()=>Alert.alert(image.urlloc)}><Text style={{color:'black'}}>Submit</Text></TouchableOpacity>
          </View>
      );
  }

   render() {
   
   
   var type= commonData.getusertype();
  if (this.state.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
        <ActivityIndicator />
        <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Loading , Please wait.</Text>
      </View>
    );
  }
  return (
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
            <View style={{ backgroundColor: '#ffffff'}}>
            <View style={{width:(width) ,flexDirection:'row',alignself:'center',alignitems:'center',backgroundColor: 'white',justifyContent:'center',marginTop:10}}>
            <View style={{width:(width)/2-30,backgroundColor:'#ffffff'}}>
            <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ height:50,width:100,resizeMode:"cover" }} ></Image>
            </View>
            <View style={{width:(width)/2-30,flexDirection:'row-reverse',backgroundColor:'#ffffff',height:60,marginTop:0}}>
            <TouchableOpacity style={{padding:10,height:40,backgroundColor:'#ffffff'}} onPress={() =>
            Alert.alert(
            //title
            'Confirmation',
            //body
            'Are you sure ,You want to logout?',
            [
            { text: 'Yes', onPress: () => { this.logout() }},
            { text: 'Cancel', onPress: () => console.log('No Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
            )}
            >
            {/* <Icon name="md-log-out" color='#011A90' size={22}/>   */}
            <Image transition={false} source={require('./images/logout.png')} style={{ height: 20, width: 20 }}></Image>

            </TouchableOpacity>
            <TouchableOpacity style={{padding:10,height:40}} onPress={() =>this.synccall()}>
            <Image transition={false} source={require('./images/sync.png')} style={{ height: 20, width: 20 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:10,height:40}} onPress={() =>this.synccall()}>
            <Image transition={false} source={require('../components1/images/coin.png')} style={{ width: 25, height: 25 ,resizeMode:'contain'}} />  
            <Text style={{fontFamily:"Lato-Regular",fontSize:10,alignSelf:'center',color:'black'}}>{Number(commonData.getrewardPoints()).toFixed(1)}</Text>
            </TouchableOpacity>
            </View>



            </View> 
            <View style={{marginTop:-10,borderRadius:10,flexDirection:'row',height:40,backgroundColor:'#ffffff',width:width-80,alignSelf:'center'

            }}>

            <Text style={{fontFamily:'Lato-Bold', fontSize:22,color:'black'}}>Welcome {commonData.getusername()}</Text>
            {type=="3"?<TouchableOpacity style={{marginHorizontal:width/2-80,height:40,alignitems:"center"}} onPress={() =>{ this.props.navigation.navigate('MyDashboard') }}>
            <Image transition={false} source={require('../components1/images/Customerimages/cust1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center'}} >
            </Image>
            <Text style={{fontFamily:"Lato-Regular",fontSize:8,color:'black'}}>Insights</Text>
            </TouchableOpacity>:null
            }
            </View>


            <View style={{marginTop:0,height:screenheight/2+2,flexDirection:'column',backgroundColor:'#ffffff',alignSelf:'center',width:width-20,alignSelf:'center',alignItems:'center'
            }}>
            <View style={{padding:10, flexDirection: 'row' ,backgroundColor:'#FFFFFF',alignSelf:'center',alignitems:'space-between',justifyContent:'space-between'}} >
            <View style={styles.recoredbuttonStyle}>
            <TouchableOpacity onPress={() =>{ this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"NEW" }) }}>
            <Image transition={false} source={require('../components1/images/order1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'NEW' }) }} >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>New Order</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.recoredbuttonStyle}>
            <TouchableOpacity    onPress={() => {commonData.setContext("RN"); this.props.navigation.navigate('customer', { From: 'RETURN',TYPE:"RETURN"  }) }}>
            <Image transition={false} source={require('../components1/images/return1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'RT' }) }} >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Return</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.recoredbuttonStyle}>

            <TouchableOpacity onPress={() => {commonData.setContext("OG");commonData.setOGContext("PRE");  this.props.navigation.navigate('customer',{ From: 'OG',TYPE:"OG",OGTYPE:"PRE"}) }}>                
            <Image transition={false} source={require('../components1/images/prebookings.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'OG' }) }} >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",color:'#707070',fontSize:13,width:screenwidth-10,textAlign:'center'}}>Bundled</Text>
            </TouchableOpacity>
            </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF',alignSelf:'center' ,marginTop:0}}>
            <View style={styles.recoredbuttonStyle}>
            <View style={{backgroundColor:"#c94c4c",width:20,height:20,borderRadius:10,marginHorizontal:(screenwidth-25),marginTop:-32,alignitems:"center",alignContent:'center',justifyContent:'center'}}>
            <Text style={{color:'white',alignSelf:'center',fontSize:8,fontFamily:'Lato-Regular'}}>{Number(commonData.getpendingcount())<100?commonData.getpendingcount():"100+"}</Text>
            </View>

            <TouchableOpacity   onPress={() => { this.props.navigation.navigate('unsentscreen') }}>
            <Image transition={false} source={require('../components1/images/Pending1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Pending</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.recoredbuttonStyle}>
            <View style={{backgroundColor:"#c94c4c",width:20,height:20,borderRadius:10,marginHorizontal:(screenwidth-25),marginTop:-32,alignitems:"center",alignContent:'center',justifyContent:'center'}}>
            <Text style={{color:'white',textAlign:'center',alignself:'center',fontSize:8,fontFamily:'Lato-Regular'}}>{Number(commonData.getorderscount())<100?commonData.getorderscount():"100+"}</Text>
            </View>
            <TouchableOpacity   onPress={() => { this.props.navigation.navigate('Orderlist') }}>
            <Image transition={false} source={require('../components1/images/completed1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Orders</Text>
            </TouchableOpacity>

            </View>           
            <View style={styles.recoredbuttonStyle}>
            <TouchableOpacity   onPress={() => { commonData.setContext("HISTORY"); this.props.navigation.navigate('customer', { From: 'HISTORY',TYPE:"HISTORY"  }) }}>
            <Image transition={false} source={require('../components1/images/history1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>History</Text>
            </TouchableOpacity>
            </View>

            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF',alignSelf:'center' ,marginTop:10}}>
            <View style={styles.recoredbuttonStyle}>
            {/* <View style={{backgroundColor:"#c94c4c",width:20,height:20,borderRadius:10,marginHorizontal:(screenwidth-25),marginTop:-32,alignitems:"center",justifyContent:'center'}}> */}
            <View style={{backgroundColor:"#c94c4c",width:20,height:20,borderRadius:10,marginHorizontal:(screenwidth-25),marginTop:-32,alignitems:"center",alignContent:'center',justifyContent:'center'}}>

            <Text style={{color:'white',alignSelf:'center',fontSize:8,fontFamily:'Lato-Regular'}}>{Number(commonData.getoffercount())<100?commonData.getoffercount():"100+"}</Text>
            </View>
            <TouchableOpacity   onPress={() =>{ this.props.navigation.navigate('Offers') }}>
            <Image transition={false} source={require('../components1/images/promotions1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}   >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Promotions</Text>
            </TouchableOpacity>

            </View>

            <View style={styles.recoredbuttonStyle}>
            <TouchableOpacity  onPress={()=>{this.props.navigation.navigate("Inventory",{From:"INV"})}} >
            <Image transition={false} source={require('../components1/images/inventory1.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
            </Image>
            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Inventory</Text>
            </TouchableOpacity>

            </View>
            <View style={styles.recoredbuttonStyle}>
            <TouchableOpacity onPress={() => {commonData.setContext("OG");commonData.setOGContext("SPC");  this.props.navigation.navigate('customer',{ From: 'OG',TYPE:"OG",OGTYPE:"SPC"}) }}>                
            <Image transition={false} source={require('../components1/images/prebookings.png')} style={{ width: 30, height: 30 ,resizeMode:'stretch',alignSelf:'center',marginTop:-1}}  onPress={() => { this.props.navigation.navigate('customer', { From: 'HISTORY' }) }} >
            </Image>

            <Text style  ={{fontFamily:"Lato-Bold",fontSize:13,color:'#707070',width:screenwidth-10,textAlign:'center'}}>Special{"\n"} Orders</Text>

            </TouchableOpacity>
            </View>
            </View>
            </View>

            <View style={{ backgroundColor: '#ffffff', marginTop:-30, height: 200, alignSelf:'center',width:screenheight,alignitems:'center'}}>
            {commonData.isOrderOpen ? 
            <Card style={{ height: 180, width:width-30, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:20}}>
            <Text style={{alignSelf:'center',justifyContent:'center',textAlign:'center',marginTop:10,fontFamily:'Lato-Bold',fontSize:20,fontWeight:'700',color:'black'}}>{commonData.getActiveCustName()}</Text>
            <Text style={{color:'#707070',fontFamily:'Lato-Bold',fontSize:14,width:300,alignSelf:'center',textAlign:'center'}}>{commonData.getActiveAdress()}</Text>
            <View style={{ flexDirection: 'row', marginTop:10,flex:3 }}>
            <View style={{flexDirection:'column',width:120,alignItems:'center',flex:1}}>
            <Text style={{  fontSize: 17, color: '#313841', fontFamily:'Lato-Bold',fontWeight:'700' }}>
            {commonData.getTotalPrice()}</Text>
            <Text style={{ color: '#707070', fontSize: 10, fontFamily: 'Lato-Bold' }}>Amount</Text>
            </View>
            <View style={{flexDirection:'column',width:100,alignItems:'center',flex:1}}>
            <Text style={{  fontFamily:'Lato-Bold', fontSize: 17, color: '#313841',fontWeight:'700'}}>
            {commonData.getTotalItems()}</Text>
            <Text style={{ color: '#707070', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Items</Text>
            </View>
            <View style={{flexDirection:'column',width:140,alignItems:'center',flex:1}}>
            <Text style={{ fontFamily:'Lato-Bold', color:'#313841', fontSize: 17,fontWeight:'700' }}>
            {commonData.getTotalQty()}
            </Text>
            <Text style={{ color: '#707070', fontSize: 10, fontFamily: 'Lato-Bold' }}>Total Qty</Text>
            </View>
            </View>

            <Card style={{ height: 40, width: 300, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',marginBottom:10}}>
            <TouchableOpacity    onPress={() => this.props.navigation.navigate('OrderItem')}>

            <Text style  ={{fontFamily:"Lato-Bold",width:300,textAlign:'center',color: '#011A90',
            fontFamily:"Lato-Bold",
            fontWeight: 'bold',
            backgroundColor:'white'}}>View Items</Text>
            </TouchableOpacity>
            </Card>

            </Card> :

            <Card style={{ height: 170, width: width-30, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:20}}>
            <Text style={{alignSelf:'center',color:'black',justifyContent:'center',textAlign:'center',marginTop:10,fontFamily:'Lato-Bold',fontSize:20}}>No Active Order</Text>
            <Text style={{color:'#00AFA5',fontFamily:'Lato-Bold',fontSize:14,width:300,alignSelf:'center',textAlign:'center'}}></Text>
            <View style={{ flexDirection: 'row', marginTop: 0,flex:3 }}>
            <View style={{flexDirection:'column',width:120,alignItems:'center',flex:1}}>
            <Text style={{  fontSize: 17, color: '#313841', fontFamily:'Lato-Bold',fontWeight:'700' }}>
            0</Text>
            <Text style={{ color: '#707070', fontSize: 12, fontFamily: 'Lato-Bold' }}>Amount</Text>

            </View>
            <View style={{flexDirection:'column',width:100,alignItems:'center',flex:1}}>
            <Text style={{  fontFamily:'Lato-Bold', fontSize: 17, color: '#313841',fontWeight:'700'}}>
            0</Text>
            <Text style={{ color: '#707070', fontSize: 12, fontFamily: 'Lato-Bold' }}>Total Items</Text>

            </View>
            <View style={{flexDirection:'column',width:140,alignItems:'center',flex:1}}>
            <Text style={{ fontFamily:'Lato-Bold', color:'#313841', fontSize: 17,fontWeight:'700' }}>
            0
            </Text>
            <Text style={{ color: '#707070', fontSize: 12, fontFamily: 'Lato-Bold' }}>Total Qty</Text>

            </View>
            </View>
            <Card style={{ height: 40, width: 300, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',marginBottom:10}}>
            <TouchableOpacity    onPress={() =>{commonData.setContext("HISTORY"); this.props.navigation.navigate('customer', { From: 'NEW' ,TYPE:"" })}}>

            <Text style  ={{fontFamily:"Lato-Bold",width:300,textAlign:'center',color: '#011A90',
            fontFamily:"Lato-Bold",
            fontWeight: 'bold',
            backgroundColor:'white'}}>Create an Order</Text>
            </TouchableOpacity>
            </Card>


            </Card>
            }



            </View>
            </View>

            </SafeAreaView>

  
    );
  
  }
  






}

const styles = StyleSheet.create({
cardContainer: {
  marginTop: 10,
  overflow: 'hidden',
  height: 100,
  width: 150,
  borderRadius: 10,
  backgroundColor: 'red',
  marginHorizontal: 5,
  elevation: 3,
  marginVertical: 10,

  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 2,
  shadowOpacity: 0.4
},
DashBoardArrayViewContainer: {
  width: Dimensions.get('window').width / 3,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  margin: 1,
  color:'red',
  backgroundColor:'white',
},
DashBoardIconView: {
    height: 30,
    width: 30
  },
  DashBoardTextView: {
    fontSize: 12,
    paddingHorizontal: 1,
    marginTop: 5,
    // fontFamily: Fonts.Poppins,
  },
shadowStyle: {
  marginTop: 10,
  overflow: 'hidden',
  height: 35,
  width: 100,
  borderRadius: 10,
  backgroundColor: 'red',
  marginHorizontal: 5,
  elevation: 3,
  marginVertical: 20,
  shadowColor: 'red',
  shadowOffset: { width: 80, height: 80 },
  shadowRadius: 10,
  shadowOpacity: 0.8,
  alignItems: 'center'
},
input: {
  width: 200,
  color: '#534F64',
  alignSelf: "center",
  marginTop: 10,
  fontFamily:'Lato-Bold'
},
submitButton: {
  padding: 10,
  margin: 15,
  height: 60,
},
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ecf0f1',
  marginTop: 30
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
  padding: 100
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
  fontFamily:'Lato-Bold',
  fontWeight:"500"
  // fontWeight:'bold'
},
RunningText: {
  color: '#DCDCDE',
  fontSize: 17,
  fontWeight: 'bold'
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
  fontFamily:'Lato-Bold',

  // Set border Radius.
  borderRadius: 25,

  //Set background color of Text Input.
  backgroundColor: "#00ACEA",
  fontFamily: 'Lato-Bold'
},
MainContainer: {

  flex: 1,
  paddingTop: 30,
  justifyContent: 'center',
  alignItems: 'center'

},

LinearGradientStyle: {
  height: 100,
  paddingLeft: 15,
  paddingRight: 15,
  borderRadius: 5,
  marginBottom: 20,
  borderEndColor: 'black',
  backgroundColor: 'red'
},
signIn: {
  width: 300,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  flexDirection: 'row',
  alignSelf:'center',marginTop:-10,
  borderRadius:4, 
  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 4 ,
fontFamily:'Lato-Bold'
},
textSign: {
    color: '#011A90',
    fontFamily:"Lato-Bold",
    fontWeight: 'bold',
    backgroundColor:'white'
    
  },
buttonText: {
  fontSize: 18,
  textAlign: 'center',
  margin: 7,
  color: '#fff',
  backgroundColor: 'transparent'

},
badgeStyle: { 
  position: 'absolute',
  top: -4,
  right: -4 
},
button: {
  shadowColor: 'rgba(0,0,0, 1.0)', // IOS
  shadowOffset: { height: 10, width: 0 }, // IOS
  shadowOpacity: 0.53, // IOS
  shadowRadius: 13.97, //IOS
  backgroundColor: '#fff',
  elevation: 21, // Android
  height: 50,
  width: 100,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},
recoredbuttonStyle:{
  borderRadius:4, 
  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 4 ,
height: screenwidth-15, 
width: screenwidth-15,
 backgroundColor: 'white',
 alignSelf:'center',
 justifyContent:'center',
 borderRadius:15 
},
flatliststyle1: {
    
  height: 40,
  padding:10,
  alignContent:'center',
  width: width -20,
  // backgroundColor: 'red',
  alignSelf: 'center',
  resizeMode: "contain"
},
});
export default withNavigation(HomeTab);