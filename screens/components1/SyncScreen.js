import  React,{Component} from 'react';
import { useState, useEffect } from 'react'
import { Text,Platform, View,TouchableOpacity,Animated,ActivityIndicator,Image, StyleSheet, Dimensions,
  Alert,Button} from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
  import CommonDataManager from './CommonDataManager';
  let commonData = CommonDataManager.getInstance();
let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');
var RNFS = require('react-native-fs');
const Constants = require('../components1/Constants');
//FB#24
import PercentageCircle from 'react-native-percentage-circle';
const GET_DATAURL= Constants.GET_URL;
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
var substipath = RNFS.DocumentDirectoryPath + '/substiOffline.json';
var sessionid="";

 export default class SyncScreen extends Component {

  constructor(props) {
    super(props);

    //Dummy event data to list in calendar 
    //You can also get the data array from the API call
    this.focusListener=null;
    this.state = {
      SKULoaded:false,
      StoresLoaded:false,
      OrdersLoaded:false,
      offersloaded:false,
      message:'Syncing data...',
      loadingmessage:"message",
      activeqtrper:20,
      synctime:"",
      syncquery:"",

    };
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
  var raw = "{\n    \"__module_code__\": \"PO_17\",\"__session_id__\":\""+sessionid+"\",\n    \"__query__\": \"created_userval_c='"+value+"' "+that.state.syncquery+"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
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
        RNFS.readFile(orderpath, 'utf8')
        .then((contents) => {

          // json.push(contents);
         
          
          
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
     
 
      console.log(json, "this is for orders list array")
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
     that.readOrders();
     that.AllthFilesLoaded();
  })
  .catch(error => console.log('error', error));
  
  }
  async loadsku(){
  
    var myHeaders = new Headers();
    var typeval = await AsyncStorage.getItem('type');
    commonData.setusertype(typeval);
    myHeaders.append("Content-Type", " application/json");
    
    var raw = "{\n    \"__module_code__\": \"PO_20\",\n    \"__session_id__\": \""+sessionid+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
   
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    var that = this; 
      that.setState({loadingmessage:"Downloading Products",activeqtrper:40})

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
      RNFS.writeFile(skupath, json, 'utf8')
        .then((success) => {
          console.log('SKU FILE WRITTEN!',json);
        })
        .catch((err) => {
          console.log(err.message,"rtgfghfghghgghh");
        });
       
        that.setState({
          SKULoaded:true
        });
        that.readSku();
        that.AllthFilesLoaded();
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
  async loadstore(){
    var uid=await AsyncStorage.getItem('ordoid')
    var myHeaders = new Headers();
  myHeaders.append("Content-Type", " application/json");
  
  var raw = "{\n    \"__module_code__\": \"PO_19\",\n    \"__session_id__\": \""+sessionid+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  var that = this;
    that.setState({loadingmessage:"Downloading Stores",activeqtrper:50})

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
      // console.log("this data which come from the server...........................")
      // console.log(result.entry_list)
      commonData.setstorescount(result.entry_list.length);
      // write the file
      // console.log("contents are there...")
      var json = JSON.stringify(result.entry_list);
      // console.log(json, "this is for storing list array")
      RNFS.writeFile(storepath, json, 'utf8')
        .then((success) => {
          // console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          // console.log(err.message);
        });
       
      // Clear the timeout as cleanup
      that.setState({
        StoresLoaded:true
      });
      that.readstoreDetails();
      that.AllthFilesLoaded();
      clearTimeout(timeout);
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

  async loadsubstitutearray(){
    var myHeaders = new Headers();
  myHeaders.append("Content-Type", " application/json");
  
  var raw = "{\n    \"__module_code__\": \"PO_21\",\n    \"__session_id__\": \""+sessionid+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  var that = this;
    that.setState({loadingmessage:"Downloading Items",activeqtrper:60})

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
      console.log("this data which come from the server...........................")
      console.log(result.entry_list)
      // write the file
      console.log("contents are there...")
      var json = JSON.stringify(result.entry_list);
      console.log(json, "this is for substipath substipath array")
      RNFS.writeFile(substipath, json, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message);
        });
      
      that.readsubstitems();
      clearTimeout(timeout);
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


 async syncDataFromServer(){
    this.setState({
      OrdersLoaded:false,
      SKULoaded:false,
      StoresLoaded:false,
    })
this.loadsku();
this.loadstore();
this.loadorders();
this.loadsubstitutearray();

  }
  async readstoreDetails(){  
    const value = await AsyncStorage.getItem('Username');
      this.setState({loadingmessage:"Loading Stores"})

      RNFS.readFile(storepath, 'utf8')
      .then((contents) => {
        // log the file contents
        // contentstr=contents
        let tempArray = commonData.gettypeArray(contents,'PO_19');
        // here we are getting contents from the json and passisng that contents to the function and try to retrieve it .
       let filtertemparray= tempArray.filter(item=>item.owner==value);
       if(value=="admin")
       filtertemparray=tempArray;
        commonData.setstoresArray(filtertemparray)
        
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
  }
  
  
 async readSku(){
      this.setState({loadingmessage:"Loading Products",activeqtrper:90})

    RNFS.readFile(skupath, 'utf8')
      .then((contents) => {
        // log the file contents
           let tempArray = commonData.gettypeArray(contents,'PO_06')
        commonData.setSkuArray(tempArray)
       
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
   }
  
  async readOrders(){
       this.setState({loadingmessage:"Loading Orders",activeqtrper:98})
       
        RNFS.readFile(orderpath, 'utf8')
          .then((contents) => {
            let object=JSON.parse(contents);
           
            let tempArray = commonData.gettypeArray(contents,'PO_14')
            commonData.setorderssArray(tempArray)
          })
          .catch((err) => {
            console.log(err.message, err.code);
          });
       
   
        }
   async  readsubstitems(){
            this.setState({loadingmessage:"Loading Items",activeqtrper:80})

          RNFS.readFile(substipath, 'utf8')
            .then((contents) => {
             
                  let tempArray = commonData.gettypeArray(contents,'PO_21')
              commonData.setSubstiArray(tempArray)
            })
            .catch((err) => {
              console.log(err.message, err.code);
            });
         
     
          }
  async AllthFilesLoaded(){
    if(this.state.OrdersLoaded==true&& this.state.SKULoaded==true&&this.state.StoresLoaded==true){
    const isLogin = await AsyncStorage.getItem('isLogin');
    var typeval = await AsyncStorage.getItem('type');
    this.setState({loadingmessage:"App is ready to use",activeqtrper:100})
    var synctime=commonData.getCurrentDate();
    AsyncStorage.setItem("syncedtime",synctime);
    commonData.setusertype(typeval);
      const { navigate } = this.props.navigation;
      if(isLogin != null || isLogin == "true")
      {
        if(typeval=="1")
        this.props.navigation?.navigate("DeliveryMain")
         else
            this.props.navigation?.navigate("TabScreen");
      }

    }
  }

 async loadOffers(){
  this.state.synctime=await AsyncStorage.getItem("syncedtime");

  sessionid=await AsyncStorage.getItem('sessionid');
  commonData.setsessionId(sessionid);
        var that = this;
          that.setState({loadingmessage:"Downloading Offers",loading:true})

          fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_10",
            "__session_id":sessionid,
            "__query__": "",
            "__orderby__": "",
            "__offset__": 0,
            "__select _fields__": [""],
            "__max_result__": 1,
            "__delete__": 0,
          })
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
         let skuArray = result.entry_list;
     that.setState({offersloaded:true,loading:false});
     that.AllthFilesLoaded();
          let temparray=[];
          for(var i=0;i<result.entry_list.length;i++){
           temparray.push({name:skuArray[i].name_value_list.name.value,minQty:skuArray[i].name_value_list.min_qty.value,Code:skuArray[i].name_value_list.coupon_code.value,Validity:skuArray[i].name_value_list.valud_till.value,type:skuArray[i].name_value_list.type.value,OfferVAl:skuArray[i].name_value_list.discount_value.value,product_id:""});
          }
         


          console.log("The sku data which come from the server here")
          console.log(temparray);
    var json = JSON.stringify(temparray);
    commonData.setoffersArray(temparray);
    console.log(json, "this is sku order array list array")
    RNFS.writeFile(offerpath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
         
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }
     
     
   componentDidMount () {
   
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", this.clickHandler);
    
   

  }
  clickHandler=() => {
   
    this.loadOffers();
    this.syncDataFromServer();
  }

  render() {
    
    return (
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
      );
  }
  }

