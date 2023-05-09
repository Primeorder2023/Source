
import React, { Component,createRef,useState } from 'react';

import { Text,Button,ImageBackground, View,Keyboard, StyleSheet,Dimensions,Image, 
  TouchableOpacity,TouchableHighlight, Alert, ScrollView, FlatList, Platform, Linking, PermissionsAndroid ,ActivityIndicator} from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  import Geolocation from "react-native-geolocation-service";
  import MapView,{ Polyline,PROVIDER_GOOGLE , Marker} from "react-native-maps";
    import Share, { Social } from 'react-native-share';
    // import {default as UUID} from "uuid";
    import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-navigation';
// import { TextInput } from 'react-native';
import { TextInput } from 'react-native-paper';
// import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import { CameraScreen } from 'react-native-camera-kit';
import moment from 'moment';
import {ItemArray,ItemArrayAdded } from '../components1/SKU'
import { Card } from 'native-base'
import CommonDataManager from './CommonDataManager';
import SignatureCapture from 'react-native-signature-capture';
import Toast from 'react-native-simple-toast';
// import ViewShot from 'react-native-view-shot';
import { captureScreen } from "react-native-view-shot";
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Icon from 'react-native-fontawesome';
import { Dropdown } from 'react-native-material-dropdown-no-proptypes';
const mobileNumber="8431639196"
var whatsAppMsg="Congratulations\n Your Order has been Placed Successfully."
whatsAppMsg=whatsAppMsg+" \nYour Invoice number :INV#.\n Happy Shopping, Team Ordo"
let brand = Platform.OS;
let systemVersion = DeviceInfo.getSystemVersion();
let deviceid=DeviceInfo.getDeviceId();
let orderfromHistory=[]
let contextvalue=''
var RNFS = require('react-native-fs');
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';

var currentPath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
let commonData = CommonDataManager.getInstance();
let Scannedvalue = ''
let isFromQty = false
let CurrentorderArray = []
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Constants = require('../components1/Constants');
const Configuration=require('../components1/Configuration');
var image_scr="../components1/Constants";
const GET_DATAURL= Constants.GET_URL;
const SET_DATAURL= Constants.SET_URL;
function getLinkWhastapp(number, message) {
  var url = 'https://api.whatsapp.com/send?phone=' 
     + number
     + '&text=' 
     + encodeURIComponent(message)

  return url
}
let ResonList = [{
  value: 'Shipped wrong product or size',
}, {
  value: 'The product was damaged or defective',
}, {
  value: 'The product arrived too late',
},{
  value: 'The product did not match the description',
},{
  value: 'Other',
}];
var totalAmount="";
class OrderItem extends Component {
  UnsentArray=[]
  constructor(props) {

    super(props);
    this.brefs= React.createRef();
    this.state = {
      Returnreson:"",
      headertype:'',
      headernumber:'',
      headercomments:'',
      selectedItem:"",
      headerref:"",
      headeradd:"",
      headeraddress:commonData.getActiveAdress(),
      SignitatureCapture:false,
      baseUrl: Constants.BASE_URL,
      QR_Code_Value: '',
      Start_Scanner: false,
      ItemArray: [],
      itemID:'',
      searchID:'',
      showsubstitute:false,
      description: '',
      couponcode:'',
      onHand:'0',
      MOQ:'0',
      LastOrdered: '',
      itemImage: require('../components1/images/noItem.png'),
      arrayHolder:[],
      textInput_Holder: '',
      itemVariable: '',
      qty: 0,
      TotalItem: 0,
      TotalPrice: 0,
      name: '',
      ABC: '',
      refresh: false,
      isloading:false,
      screenheight:height,
      headers:false,
      offerArray:[],
      offerValue:"",
      offertype:"",
      signinitemsarray:[],totalsavings:0,
      dragged:false,
      screenshotView:false,
      returnView:false,
      latitude: 0,
        longitude: 0,
        searcharray:[]
    }
    this.itemList = commonData.getSkuArray();
    
  }
  
//Order Header Implementation
changedValue=(text, index)=>{
 
  if(index==0)
  this.setState({
   headernumber:text,
   })
   else if(index==1)
   this.setState({
    headerref:text,
     })
     else if(index==2)
   this.setState({
   headercomments:text,
   })
   else if(index==3)
   this.setState({
   headeraddress:text
   })
   else if(index==4){
   this.setState({itemID:text})
   this.setState({showsubstitute:true})
//  this.setState({searcharray:this.state.data})
   this.forceUpdate();
   }else if(index==5){
    this.searchitemwithdescription(text);
    this.setState({searchID:text})
     this.forceUpdate();
   }
   
 }
 save=()=>{
   //Save header function
   Alert.alert("Message", "Order Headers Saved Successfully");
   commonData.setPOComments(this.state.headercomments);
   commonData.setPOType(this.state.headernumber);
   commonData.setPOnumber(this.state.headertype);
   
   this.saveHeaders();
   this.setState({headers:false});
   this.forceUpdate();
 }
 loadOffers=()=>{
  RNFS.readFile(offerpath, 'utf8')
  .then((contents) => {
    // log the file contents
    
    this.state.offerArray = JSON.parse(contents)
   
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
}
getitemval=(id)=>{
  
  var product_id="";
  var temparray=commonData.getSkuArray();
  for(var k=0;k<temparray.length;k++){
   
    if(id==temparray[k].id){
      console.log("vghhghhh",temparray[k]);
      product_id=temparray[k].itemid;
      break;
    }
  }
  return product_id;
}
initiateWhatsApp = (invoicenum) => {
  whatsAppMsg=whatsAppMsg.replace("INV#",invoicenum);

  var urlmsg = getLinkWhastapp(mobileNumber,whatsAppMsg);
  
  // Check for perfect 10 digit length
  if (mobileNumber.length != 10) {
    alert('Please insert correct WhatsApp number');
    return;
  }
  // Using 91 for India
  // You can change 91 with your country code
  let url =
    'whatsapp://send?text=' + 
     whatsAppMsg +
    '&phone=91' + mobileNumber;
  Linking.openURL(urlmsg)
    .then((data) => {
      console.log('WhatsApp Opened');
    })
    .catch(() => {
      alert('Make sure Whatsapp installed on your device');
    });
    
};
getofferforId=(id)=>{

  this.state.totalsavings=0;
  if(id==""){
    
    Toast.show('No Coupon code Selected', Toast.LONG)
    return;
  }
  
  var value=""
  let type=""
  let product_id="";
  let minQty=0;
  let couponfound=false;
  for(let i=0;i<this.state.offerArray.length;i++){
 
   if(id==this.state.offerArray[i].Code){
    couponfound=true;
      value=Number(this.state.offerArray[i].OfferVAl);
      type=this.state.offerArray[i].type;
      console.log("this.state.offerArray[i]",this.state.offerArray[i])
      product_id=this.getitemval(this.state.offerArray[i].product_id);
    }

  }
  if(couponfound==false){
    Toast.show('Invalid Coupon Code', Toast.LONG)
    return;
  }
   this.setState({offerValue:value,offertype:type});
 if(type=='Q'){
 
   
      let price=0;
      for(var j=0;j<this.state.arrayHolder.length;j++){
        if(product_id==this.state.arrayHolder[j].itemid){
         
        price=Number(this.state.arrayHolder[j].price)*value/100*Number(this.state.arrayHolder[j].qty);
     
       this.state.totalsavings=price;
       let discountvalue=Number(this.state.arrayHolder[j].price)*Number(this.state.arrayHolder[j].qty)*value/100;
      
        Toast.show('Congratulations Discount Applied', Toast.LONG)
        this.state.signinitemsarray.splice(j,1);
        this.state.signinitemsarray.push({itemid:this.state.arrayHolder[j].itemid,description:this.state.arrayHolder[j].description,qty:this.state.arrayHolder[j].qty,price:discountvalue})
       this.state.arrayHolder[j].price=discountvalue;
        commonData.setCouponDetails("");
        this.state.couponcode="";
        this.calculaterunningTotals();
        this.forceUpdate();
        break;
        }
      }
    
  

 }else{
   let p=commonData.getTotalPrice().split('₹')[1]
  var price=Number(p);
  price=p-price*value/100;
  Toast.show('Congratulations Discount Applied', Toast.LONG)
  commonData.setRunningTotals(price,commonData.getTotalQty(),commonData.getTotalItems());
 }
 this.forceUpdate();

}
 cancel=()=>{
   //Close header pop up
   var that =this;

   that.setState({headers:false,headeraddress:"",headercomments:"",headernumber:"",headernumber:""});
   that.forceUpdate();
 }
//**************************************** */
  readCurrentOrder(currentpath) {
    // write the fil

    RNFS.readFile(currentpath, 'utf8')
      .then((contents) => {
        // log the file contents
        console.log("Reading files from orders.....................")
        console.log(contents);
        console.log("Json_parse");
        CurrentorderArray = JSON.parse(contents)
        console.log('...............', CurrentorderArray);

      })
      .catch((err) => {
        console.log(err.message, err.code);
      });

  }
  deleteItms=(id,index)=>{
    this.state.From= commonData.getContext();
    if(this.state.From=='OG'){
    Alert.alert("You cannot delete items from the Current order.")
    return;
    }
    this.deleteItemById(id,index);
  }
  deleteItemById = (id,index) => {
    let temp=this.state.ItemArray
    // for (var i = 0; i < temp.length; i++) {
    //   if (this.state.arrayHolder[i].itemid == id) {
        this.state.arrayHolder[index].qty = 0
        this.state.ItemArray[index].qty = 0
        this.state.ItemArray.splice(index, 1)
        this.state.arrayHolder.splice(index, 1)
    //   }
    // }
  
    this.state.itemID = ''
    this.state.qty = 0
    this.state.itemImage=require('../components1/images/noItem.png')
    this.state.description=''
    this.refreshData();
    this.calculaterunningTotals()
    this.forceUpdate();
  }
  resignView() {
    commonData.getContext('')
    commonData.setArray(this.state.arrayHolder)
    console.log(commonData.getSkuArray())
    this.state.From=''
  }
  onSharePress = () =>{ 
    var base64data="";
    RNFS.readFile("https://engineering.fb.com/wp-content/uploads/2016/04/yearinreview.jpg", 'base64')
.then(res =>{
  console.log(res,'fdfdfdfxdfxdxd');
  base64data=res;
});
const shareOptions = {
  title: 'Title',
  message: 'Message to share', // Note that according to the documentation at least one of "message" or "url" fields is required
  url: 'www.example.com',
  subject: 'Subject',
  // social: Share.Social.WHATSAPP
};
    Share.share(shareOptions);}
  async ReloadItems() {
  
    var uid= await AsyncStorage.getItem('userid');
    commonData.setUserID(uid);
    this.setState({
      // loading: false,
      signinitemsarray:[]
    });
    let frm= this.props.navigation.getParam('frm','')
   
    this.loadOffers();
    let skuarray=commonData.getSkuArray();
  this.state.From= commonData.getContext();
  let TYPE=this.props.navigation.getParam('TYPE','')
  if(this.state.From=='HISTORY'|| TYPE=='RETURN'|| this.state.From=='RP'||commonData.getContext()=='RP'){

    this.state.couponcode="";
    
    var itmArray=commonData.getCurrentArray();

    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        // if(itmArray[k].itemid==skuarray[j].itemid && Number(skuarray[j].stock)>0){
       if(itmArray[k].itemid==skuarray[j].itemid){

        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        itmArray[k].price=Number(skuarray[j].price);
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].description=skuarray[j].description;
        itmArray[k].id=skuarray[j].id;
        itmArray[k].upc=skuarray[j].upc;
        itmArray[k].hsn=skuarray[j].hsn;
        itmArray[k].tax=skuarray[j].tax;
        break;
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    orderfromHistory=[...itmArray]
    commonData.setArray(orderfromHistory)
    this.state.ItemArray = itmArray
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }else if(this.state.From=='OG' ){
    var itmArray=commonData.getCurrentArray();
   
   
    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        if(itmArray[k].id==skuarray[j].id){
        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        if(itmArray[k].type!="Free goods" )
        itmArray[k].price=Number(skuarray[j].price);
        else{
          if(itmArray[k].parent=="1"){
            itmArray[k].price=Number(skuarray[j].price);
          }else
          itmArray[k].price=0;
         
        }
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].id=skuarray[j].id;
        itmArray[k].description=skuarray[j].description;
        itmArray[k].upc=skuarray[j].upc;
        itmArray[k].itemid=skuarray[j].itemid;
        itmArray[k].hsn=skuarray[j].hsn;
        itmArray[k].tax=skuarray[j].tax;
        break;
          // } 
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    console.log(this.state.arrayHolder,"Current Array");
    this.state.arrayHolder=this.state.arrayHolder.filter(item=>Number(item.qty)>0)

    orderfromHistory=this.state.arrayHolder

    commonData.setArray(orderfromHistory)
    this.state.ItemArray = orderfromHistory
    itmArray=orderfromHistory;
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }
  else if(this.state.From=='UN'){
    var itmArray=commonData.getCurrentArray();
   var  filename=commonData.getcurrentfile();
    if(filename.includes("OG_")){
      commonData.setContext('OG');
    }
    for(let k=0;k<itmArray.length;k++){
      for(let j=0;j<skuarray.length;j++){
        if(itmArray[k].itemid==skuarray[j].itemid){
        itmArray[k].stock=skuarray[j].stock;
        itmArray[k].noofdays=skuarray[j].noofdays;
        itmArray[k].price=Number(skuarray[j].price);
        itmArray[k].weight=Number(skuarray[j].weight);
        itmArray[k].id=skuarray[j].id;
        itmArray[k].upc=skuarray[j].upc;
        itmArray[k].hsn=skuarray[j].hsn;
        itmArray[k].tax=skuarray[j].tax;
        break;
        }
      }
    }
    this.state.arrayHolder=[...itmArray]
    console.log('hi i am array holder', this.state.arrayHolder)
    orderfromHistory=[...itmArray]
    commonData.setArray(orderfromHistory)
    this.state.ItemArray = itmArray
    this.state.orderid = commonData.getOrderId()
    contextvalue=commonData.getContext()
    CurrentorderArray=[...orderfromHistory]
    commonData.isOrderOpen=true
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals();
    this.forceUpdate()
  }
  else{
    if(this.state.From=='PREV'){
      // //Save the Order  
      this.saveorderShow();
      commonData.isOrderOpen=true
      commonData.setContext('')
      commonData.setArray('')
      this.state.arrayHolder=[]
      this.state.ItemArray=[]
    }
    
    if (commonData.isOrderOpen == true) {     
      this.state.orderid = commonData.getOrderId()
      if(this.state.From=='ID'){
        commonData.setContext('')
        let tempItemArrayAdded = commonData.getCurrentArray();
        this.state.arrayHolder = [...tempItemArrayAdded]
        this.state.ItemArray = tempItemArrayAdded
      }else{
      for (var i = 0; i < this.state.arrayHolder.length; i++) {
        if (this.state.arrayHolder[i].itemid == this.state.itemID) {
          this.state.qty =Number(this.state.arrayHolder[i].qty);
          this.state.price = this.state.arrayHolder[i].price
        }
      }
      let tempItemArrayAdded = ItemArrayAdded
      this.state.arrayHolder = [...tempItemArrayAdded]
      this.state.ItemArray = tempItemArrayAdded
    }  
  } else {
      this.state.ItemArray = []
      this.state.arrayHolder = []
    }
    this.state.itemID = ''
    this.state.qty = '0'
    this.state.description = ''
    this.state.MOQ='0'
    this.state.onHand='0'
    this.state.LastOrdered='--',
    this.state.itemImage=require('../components1/images/noItem.png')
    this.calculaterunningTotals()
    this.forceUpdate()
  }
  this.state.arrayHolder=this.state.arrayHolder.filter(item=>Number(item.qty)>0)
  this.forceUpdate();
  }
  componentWillMount = () => {
    
    const { navigation } = this.props;
    this.state.From=this.props.navigation.getParam('From','')
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
    if (this.state.From=="RETURN"){
      this.setState({couponcode:""});

    }else{
      // commonData.setCouponDetails("");
      this.setState({couponcode:commonData.getCouponDetails()})
    }
      contextvalue=this.props.navigation.getParam('From','')
      this.ReloadItems();
      this.calculaterunningTotals()
    });
    this.focusListener = navigation.addListener("willBlur", () => {
      this.resignView();
    });
    
  }
  saveorderShow = () => {
    
      this.newsaveorder();
      this.DeleteCurrentOrder();
      
       if(this.state.From!='PREV'){
       this.props.navigation.navigate('HomeTab')
     }

}
DeleteFunction =async ()=> {
  var that=this;
  let path1=this.props.navigation.getParam('PATH1')
  if(path1){
    console.log(path1,"RENDER CALL 22 new smile,...................")
    await RNFS.unlink(path1);
    console.log("file deleted", path1);
     }
    //  that.props.navigation.navigate('OrderSent',{"TYPE":""})
}
itemPresent=()=>{
  var itemtocheck=commonData.getSkuArray();
  const filtered=itemtocheck.filter(item=>item.itemid.toUpperCase()==this.state.itemID.toUpperCase());
  const filterupc=itemtocheck.filter(item=>item.upc==this.state.itemID);
  if(filtered.length>0 || filterupc.length>0)
  return true
  else
  return false;

}
searchitemwithdescription=(desc)=>{
  

  this.setState({
    searchID: desc,
  });
if(desc.length<=0){
    this.state.searchID="";
    this.state.itemID="";
    this.state.searcharray=[];
    this.forceUpdate();
    Keyboard.dismiss()
    return
} 
let skarray = commonData.getSkuArray();
const newData = skarray.filter(item => {      
const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
const textData = desc.toUpperCase();
return itemData.indexOf(textData) > -1;    
});
this.setState({ searcharray: newData });  
this.state.searchID="";
this.forceUpdate()
}

  joinData = () => {
    this.searchitemwithdescription(this.state.itemID);
    Keyboard.dismiss()  
    this.state.From= commonData.getContext();
    if(this.state.From=='OG'){
    Alert.alert("You cannot add items to the Current order.")
    return;
    }
   
    let TYPE=this.props.navigation.getParam('TYPE','')

    if(TYPE=="RETURN" && commonData.isOrderOpen==true){
      Alert.alert("Warning","You cannot add items to the return order")
      return;
     
    }
    this.itemList = commonData.getSkuArray()
    var qty = 0, price = 0;
    var weight=0;
    var hand=0; var id="",imgsrc="";
    if (commonData.isOrderOpen == false) {
      Alert.alert("Alert",'You do not have an order open.')
      Keyboard.dismiss()
      this.forceUpdate();
      return;
    }
    //UPC Check
    if (this.state.itemID == null || this.state.itemID==''){
      this.state.itemID="";
      this.forceUpdate();
      Alert.alert("Warning","Please enter the valid item id")
      return;
    }
    // var i = 0;
    var found = false;
    var index=-1;
    for(var i1=0;i1<this.itemList.length;i1++){
      var itemIdEnteredUpCase=this.state.itemID.toUpperCase();
      var itemEnteredLow=this.state.itemID.toLowerCase()
      var entereditemid=this.itemList[i1].itemid;
      if(itemIdEnteredUpCase==entereditemid.toUpperCase()||itemEnteredLow==entereditemid.toLowerCase()){
        index=i1;
        found=true;
        hand=this.itemList[i1].stock
        this.state.description = this.itemList[i1].description
        id=this.itemList[i1].id
        this.state.itemImage=this.itemList[i1].imgsrc
        price = this.itemList[i1].price
         weight=this.itemList[i1].weight
          if(Number(hand)>0){
          if (this.itemList[i1].qty != null || this.itemList[i1].qty >= 0) {
            this.state.qty = Number(this.itemList[i1].qty) + 1;
          }
          }
        break;
      }

    }
   
    for (var i = 0; i < this.state.arrayHolder.length; i++) {
      if (this.state.arrayHolder[i].itemid == this.state.itemID) {
        qty = Number(this.state.arrayHolder[i].qty) + 1;
        // if(qty>=hand){
        //   Alert.alert("Warning","Quantity cannot exceed the available on Hand count");
        //   qty=hand;
        //   this.state.arrayHolder[i].qty=qty;
        // }
          this.state.ItemArray[i].imgsrc=this.state.arrayHolder[i].imgsrc
          this.state.ItemArray[i].id=this.state.arrayHolder[i].id
          this.state.ItemArray[i].qty = qty
          this.state.ItemArray[i].weight= Number(this.state.arrayHolder[i].weight)
          this.state.ItemArray[i].stock = hand
          this.state.ItemArray[i].price = price
          this.state.ItemArray[i].itemid = this.state.arrayHolder[i].itemid
          this.state.ItemArray[i].id=id
          this.state.ItemArray[i].hsn=this.state.arrayHolder[i].hsn;
          this.state.ItemArray[i].tax=this.state.arrayHolder[i].tax;
      }
    }
    if (found) {
      if (isFromQty == false)
        this.state.qty = qty
        else
        this.state.qty=0
      if ((this.state.qty == 0 || this.state.qty == -1)) {
         this.state.qty = 1;
        this.state.ItemArray.push({id:id, itemid: this.state.itemID, description: this.state.description, price: price, qty: this.state.qty, imgsrc: this.state.itemImage,weight:weight,stock:hand});
       }
       this.setState.arrayHolder=[...this.state.ItemArray]
       this.state.refresh=false;
      commonData.setArray([...this.state.ItemArray])
      contextvalue=commonData.getContext()
      if(contextvalue.length==0){
        let tempItemArrayAdded = ItemArrayAdded
        this.state.arrayHolder = [...tempItemArrayAdded]
        this.state.ItemArray = tempItemArrayAdded
      }else{
        this.state.arrayHolder = [...this.state.ItemArray]
        commonData.setArray(this.state.ItemArray)
        console.log(commonData.getCurrentArray(), "this.state.itemarray")
        commonData.setContext('')
      }   
      this.refreshData()
      this.calculaterunningTotals();
      this.forceUpdate();
    } else {
      // Alert.alert("Alert",'Invalid Itemid')
      Keyboard.dismiss()
      this.state.description = ''
      this.state.qty = 0
      this.state.itemID = ''
      this.state.itemImage=require('../components1/images/noItem.png')
      this.forceUpdate();

    }
    
  }
  getimageforid=(id)=>{
    var image="https://findicons.com/files/icons/305/cats_2/128/pictures.png";
    var itemlist = commonData.getSkuArray();
    const filterlist=itemlist.filter(item=>item.id==id);
    if(filterlist.length>0)
      image=filterlist[0].imgsrc;
    return image;
  }
  newsaveorder=()=>{
    console.log("my orders are saving here.................")
    
    var oid = commonData.getOrderId()
    let uname=commonData.getusername();
    let custid=commonData.getActiveCustomerID();
    let address=commonData.getActiveAdress();
    // let address=address1[0]+","+address1[1]+","+address1[2]+"-"+address1[3]+""
    let cname=commonData.getcustomerName();
    let cqty=commonData.getTotalPrice();
   
    console.log(cqty, "oid-----cqty");
    var filename = 'UN_'+oid+'CNID-'+custid+'Nme-'+cname+'ADD-'+address+'LNT-'+this.state.ItemArray.length+'cntP-'+cqty+'.json'
    var dir = RNFS.DocumentDirectoryPath + '/unsent_folder' + '/'+ uname+'/';
    
    if(this.state.From=='UN'){
      filename=commonData.getcurrentfile();
    var tempfilename1=filename.split("LNT-")[0];
    // var tempfilename2=filename.split("cntP-")[1];
    var filenamefinal=tempfilename1+"LNT-"+this.state.ItemArray.length+"cntP-"+cqty+".json";
      filename=filenamefinal;
    this.DeleteFunction();
    }
    if(commonData.getContext()=='OG'){
      filename="OG_"+filename
    }
    var path = dir + filename;
    RNFS.mkdir(dir,{NSURLIsExcludedFromBackupKey:true});
 
    var savearray=[];
    var orderdetails=[];
    orderdetails.push({custid:cname,oid:oid,cname:cname,address:address,LNT:this.state.ItemArray.length,cqty:cqty})
    var json = JSON.stringify(this.state.ItemArray);
        savearray.push({record:orderdetails,items:this.state.ItemArray,skus:this.state.ItemArray.length})
        var json = JSON.stringify(savearray);
    // json=JSON.stringify(savearray);
    RNFS.writeFile(path, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
        console.log(path,"file wriiteen...........path is here.......savearraysavearray",savearray);
      })
      .catch((err) => {
        console.log(err.message);
      });
}

  GetItem(item) {

   

  }
  updateArray = () => {

  }
  calculaterunningTotals() {
    console.log('m inside calculate running')
    let Qtyval = 0
    let PriceVal = 0
    let ItemVAl = this.state.arrayHolder.length
   
    for (var i = 0; i < ItemVAl; i++) {
      Qtyval = Qtyval + Number(this.state.arrayHolder[i].qty)
      if (this.state.arrayHolder[i].price != null)
        PriceVal = PriceVal + (Number(this.state.arrayHolder[i].qty) * Number(this.state.arrayHolder[i].price))
    }
    this.state.TotalPrice = PriceVal
    this.state.TotalQty = Qtyval
    this.state.TotalItem = ItemVAl
    commonData.setRunningTotals(PriceVal, Qtyval, ItemVAl)
    this.forceUpdate();
    
    
  }
  DeletefromOrderItems() {
    var that = this;
    var oid = commonData.getOrderId()
   
    const url= SET_DATAURL;
    console.log("url:" + url);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_17",
        __query__: "id= '" + oid + "'",
        __session_id__:commonData.getsessionId(),
        __name_value_list__:{
          modified_by_name: "Support Primesophic",
          delete: 1,
        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("this is deleting order items")
      console.log(result);
      that.DeleteOrder();
      Alert.alert("Order Deleted succesfully")
      if(that.state.From!='PREV'){
        that.props.navigation.navigate('HomeTab')
     }

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });

  }
  DeleteCurrentOrder() {
    
    // let temp = this.state.arrayHolder;
    // for (var i = 0; i < this.state.arrayHolder.length; i++) {
      for(var j=0;j<this.state.ItemArray.length;j++){
      // if (this.state.arrayHolder[i].itemid == this.state.ItemArray[j].itemid) {
        this.state.ItemArray[j].qty = 0
      }
      // }
    // }
    // const filteredData =  this.state.ItemArray.filter(item => item.qty == 0);
    // for(var i=0;i<filteredData.length;i++){
    //   this.deleteItemById(filteredData[i].itemid)
    // }
    this.state.arrayHolder=[];
    orderfromHistory=[];
      commonData.isOrderOpen=false
      commonData.setArray( '')
      commonData.setContext("")
  }
  DeleteOrder() {
  
    this.DeleteCurrentOrder();
    this.DeleteFunction()
 if(this.state.From!='PREV'){
     this.props.navigation.navigate('HomeTab')
   }   
  }
  async synccall(){
    let variable=commonData.getusername();
    // var that = this;
 
    // fetch(GET_DATAURL, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     "__module_code__": "PO_17",
    //     "__session_id__":commonData.getsessionId(),
    //     "__query__": "initiated_by='"+variable+"'",
    //     "__orderby__": "",
    //     "__delete__": 0,
    //   })
    // }).then(function (response) {
    //   return response.json();
    // }).then(function (result) {
    //   orderArray = result.entry_list;
    //   console.log("The previous order data which come from the server here",result)
    //   console.log(orderArray);
    //   var json = JSON.stringify(orderArray);
    //   console.log(json, "this is for orders list array")
     
    //   RNFS.writeFile(orderpath, json, 'utf8')
    //     .then((success) => {
    //       console.log('FILE WRITTEN!');
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     });
    //   that.setState({
    //     // mainData: result.entry_list,
    //     // JSONResult: result.entry_list,
    //     // loading: false,
    //     refreshing: false
    //   });
    // }).catch(function (error) {
    //   console.log("-------- error ------- " + error);
    // });

    var that = this;
    that.setState({loadingmessage:"Downloading Orders",activeqtrper:30})
    var myHeaders = new Headers();
    const value = await AsyncStorage.getItem('Username');
    myHeaders.append("Content-Type", "application/json");
    var syncquery="";
    var synctime = await AsyncStorage.getItem("syncedtime");
    console.log("gghh",synctime);
    if(synctime!=""){
     syncquery="&&aos_quotes.date_modified >'"+synctime+"'";
    }
    var raw = "{\n    \"__module_code__\": \"PO_17\",\"__session_id__\":\""+commonData.getsessionId()+"\",\n    \"__query__\": \"created_userval_c='"+value+"' "+syncquery+"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(Constants.GET_URL, requestOptions)
    .then(response => response.json())
    .then(result => {console.log("orders))))))))))wqgsgsafghdsghx",result);
          var json = JSON.stringify(result.entry_list);
         
          RNFS.readFile(orderpath, 'utf8')
          .then((contents) => {
          
            json.push(contents);            
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
     
       that.readOrders();
    })
    .catch(error => console.log('error', error));

  }
  readorders(){
    
    RNFS.readFile(orderpath, 'utf8')
        .then((contents) => {
          contentsOrder=contents;
          let tempArray = commonData.gettypeArray(contents,'PO_14')
          commonData.setorderssArray(tempArray)
        commonData.setorderscount(Number(tempArray.length));
        alert(Number(tempArray.length)+"dsgvcghdsv`")
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });

  }
  SignandProceed=()=>{
   
    let TYPE=this.props.navigation.getParam('TYPE','')
    if(TYPE=="RETURN"){
      this.setState({returnView:true})
    }else{
    this.setState({SignitatureCapture:true});
    }
   
  }
  sendOrderFunction = () => {
   
    var that = this
    that.setState({  isloading: true });
    let TYPE=that.props.navigation.getParam('TYPE','')
    var address=commonData.getActiveAdress();
    console.log(address,"dsfhfbhb");
    var add2="",add3="";
    const add=address.split(",");
    if(add.length>1)
     add2=add[1].split(" "); 
     if(add2.length>1)

     add3 =add2[1].split("-");
    
    let uname=commonData.getusername();
    var custid=commonData.getActiveCustomerID()
   
    var cname =commonData.getActiveCustName();
    var last_modified=commonData.getCurrentDate1();
    var accountid=commonData.getaccountid();
   

    that.updatepayment(accountid);
    let totalitems=that.state.arrayHolder.length;
    let orderstatus="Pending";
    var price=commonData.getTotalPrice().split("₹")[1];
    var savings=that.state.totalsavings;
    var shippingadd=[];
    var addressarray=that.state.headeraddress.split(",");
    
    if(addressarray.length>3){
      shippingadd[0]=addressarray[0];
      shippingadd[1]=addressarray[1];
      shippingadd[2]=addressarray[2];
      shippingadd[3]=addressarray[3];
    }else{
      shippingadd[0]=that.state.headeraddress;
      shippingadd[1]="";
      shippingadd[2]="";
      shippingadd[3]="";
    }
    var billingaddress=commonData.getActiveAdress();
    bill1=[]
    billadd=billingaddress.split(",");
    if(billadd.length>3){
      bill1[0]=billadd[0];
      bill1[1]=billadd[1];
      bill1[2]=billadd[2];
      bill1[3]=billadd[3];
    }else{
      bill1[0]=commonData.getActiveAdress();
      bill1[1]="";
      bill1[2]="";
      bill1[3]="";
    }
    var gst=Number(price)*18/100;
    var grandtotal=Number(gst)+Number(price);
    var subtotal=Number(savings)+Number(price);
    var qname="SO"+that.state.orderid.substring(1,3);
    var valid_to = moment(last_modified, 'YYYY-MM-DD HH:mm:ss a').add(5, 'days');
    var type="New";
    if(commonData.getContext()=='OG')
    type='Special';
  
    if(TYPE=="RETURN"){
    orderstatus="Return";
    type='Return';
    }else{
      that.state.Returnreson="";
    }
   
   
    console.log("type******************",type);
    that.state.orderid=commonData.getOrderId();
    var url =SET_DATAURL
       fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        
        {
          __module_code__: "PO_17",
          __query__: "",
          __session_id__:commonData.getsessionId(),
          __name_value_list__:{
            "name": qname,
            "date_modified":last_modified,
            "description":qname,
            "approval_issue":"",
            "expiration":valid_to,
            "orderid":that.state.orderid,
            "billing_account_id":accountid,
            "billing_account":cname,
            "created_userval_c":uname,
            "assigned_user_name":uname,
            "initiated_by":uname,
            "lastmodifiedby":custid,
            "billing_address_street_2_c":bill1[0],
            "billing_address_street":bill1[0],
            "billing_address_city":"",
            "billing_address_state":bill1[1],
            "billing_address_postalcode":bill1[3],
            "billing_address_country":bill1[2],
            "line_items":commonData.getTotalItems(),
            "tax_amount":gst,
            "subtotal_amount":subtotal,
            "subtotal_amount_usdollar":subtotal,
            "discount_amount":savings,
            "currency_id":"-99",
            "stage":orderstatus,
            "reason_for_return":that.state.Returnreson,
            "term":"Neft15",
            "terms_c":"",
            "orderstatus_c":orderstatus,
            "invoice_status":"Not Invoiced",
            "total_amt":grandtotal,
            "total_amount":grandtotal,
            "total_amount_usdollar":grandtotal,
            "lastmodified":last_modified,
            "shipping_address_street":shippingadd[0],
            "shipping_address_state ":shippingadd[1],
            "shipping_address_country":shippingadd[2],
            "shipping_address_postalcode":shippingadd[3],
            "approval_status":"Approved",
            "totalitems_c":totalitems,
            "device_id":deviceid,
            "os_name":brand,
            "osversion_c":systemVersion,
            "latitude":commonData.getlatitude(),
            "longitude":commonData.getlongitude(),
            "type":type
          }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
     
      console.log("Order sent",result);
      // that.setState({isloading:false});
      if(TYPE=="RETURN"){

      }else{
      that.createGroupItemsrecord(result.id,custid+"Orders"+that.state.orderid,qname)
      }
      
     

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
      console.log("Order not sent");
    });
    
  }
  createGroupItemsrecord=(orderid,name,qname)=>{
    var that=this;
    that.setState({isloading:true});
    var price=commonData.getTotalPrice().split("₹")[1];
    var savings=that.state.savings;
   
    var gst=Number(price)*18/100;
    var grandtotal=Number(gst)+Number(price);
    var subtotal=Number(savings)+Number(price);
    var url =SET_DATAURL
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_28",
     __query__: "",
     __session_id__:commonData.getsessionId(),
     __name_value_list__:{
       "total_amt": price,
       "total_amt_usdollar": price,
       "name": name,
       "discount_amount": savings,
       "discount_amount_usdollar": savings,
       "subtotal_amount": subtotal,
       "subtotal_amount_usdollar": subtotal,
       "tax_amount": gst,
       "tax_amount_usdollar": grandtotal,
       "subtotal_tax_amount": grandtotal,
       "subtotal_tax_amount_usdollar": grandtotal,
       "total_amount":grandtotal,
       "total_amount_usdollar":grandtotal,
       "parent_type":"AOS_Quotes",
       "currency_id":-99,
       "assigned_user_id":1,
       "parent_id":orderid,
       "number":1
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  // that.setState({isloading:false});
  that.sendItems(orderid,name,result.id,qname)
}).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  saveHeaders=()=>{
   
  
    
    var url =SET_DATAURL
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_31",
     __query__: "",
     __session_id__:commonData.getsessionId(),
     __name_value_list__:{
     
      "ponumber":this.state.headernumber,
      "pocomments":this.state.headercomments,
      "orderid":commonData.getOrderId(),
      "potype":this.state.headerref,
      "haddress":this.state.headeraddress,
      "assigned_user_id":commonData.getUserID()
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  
  console.log("Order headers saved successfully");
}).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  sendItems=(parentid,name,groupid,qname)=>{
   
    var createduser = commonData.getUserID()
    var date_entered=commonData.getCurrentDate()
    var that = this
    that.setState({isloading:true});
    var url =SET_DATAURL
    let TYPE=this.props.navigation.getParam('TYPE','')
   let return_id="";
   let return_qty=0;
    let custname=commonData.getcustomerName();
    var val= uuid.v4();
    // var groupid=val;
    var groupname="grcd";
    var uname=commonData.getusername();
    var total_vat=0,total_price=0,grand_total=0;
    for (var i = 0; i < that.state.arrayHolder.length; i++) {
     
     
      let id=that.state.arrayHolder[i].id;
      let part_num=that.state.arrayHolder[i].itemid;
      let qty= Number(that.state.arrayHolder[i].qty);
      let stock =Number(that.state.arrayHolder[i].stock)-qty;
      let rid=that.state.arrayHolder[i].rid;
      var returned="0";

      if(TYPE=="RETURN"){
        stock =Number(that.state.arrayHolder[i].stock)+qty;
        returned="1"; 
      }else{

        
        // if(qty>that.state.arrayHolder[i].stock){
        
        //   if(qty==0)
        //    continue;
        // }

      }
      // that.updateitemStock(id,stock); 
      // this.stockcountupdate(id,stock);
      //in this method we are setting the username user has typed and store it in the set_data_s.php url.     
      console.log("url:" + url);
      var oid = commonData.getOrderId()
      this.setState({
        isloading: true,
      });
      
      var vat_amt=Number(this.state.arrayHolder[i].price)*Number(this.state.arrayHolder[i].qty)*Number(this.state.arrayHolder[i].tax)/100;
      var product_total_price=Number(this.state.arrayHolder[i].price)*Number(this.state.arrayHolder[i].qty)+vat_amt;
      total_vat=Number(total_vat)+Number(vat_amt);
     
      total_price=total_price+product_total_price;
      console.log("********total_vat",total_price)
      if(i==that.state.arrayHolder.length-1){
        console.log("mmmmm here",parentid,total_vat,total_price,grand_total)
        grand_total=total_price-this.state.totalsavings;
        this.updateOrderPrice(parentid,total_vat,total_price,grand_total,"");
        this.updateOrderPrice(groupid,total_vat,total_price,grand_total,"PO_28");
      }
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            "__module_code__": "PO_18",
            "__name_value_list__":{
              "name":this.state.arrayHolder[i].description,
              "description":"",
              "currency_id":"-99",
              "modified_by_name":createduser,
              "item_description":this.state.arrayHolder[i].description,
              "number":i+1,
              "product_qty":qty,
              "product_cost_price":this.state.arrayHolder[i].price,
              "product_total_price":product_total_price,
              "product_list_price":this.state.arrayHolder[i].price,
              "product_unit_price":this.state.arrayHolder[i].price,
              "vat":this.state.arrayHolder[i].tax,
              "vat_amt":vat_amt,
              "parent_name":qname,
              "hsn":this.state.arrayHolder[i].hsn,
              "parent_type":"AOS_Quotes",
              "parent_id":parentid,
              "product_id":id,
              "part_number":part_num,
              "group_id":groupid,
              "returned":returned,
              "assigned_user_name":uname,
              "group_name":name,
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
          console.log("this is sending order items")
          console.log(result);
          that.setState({
            isloading: true,
          });
          that.synccall();
          that.setState({
            loading: true,
          });
  
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      
    }
    
    that.DeleteCurrentOrder();
    that.DeleteFunction();
   

    
  }
  updateOrderPrice=(id,total_vat,total_price,grand_total,modulecode)=>{
   
           
          var that= this;
         
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            that.setState({isloading:true});
            var raw = JSON.stringify({"__module_code__":"PO_17","__session_id__":commonData.getsessionId(),"__query__":"id='"+id+"'","__name_value_list__":{"total_amt":total_price,"tax_amount":total_vat,"total_amount":grand_total,"id":id}});
           if(modulecode=="PO_28"){
            raw = JSON.stringify({"__module_code__":"PO_28","__session_id__":commonData.getsessionId(),"__query__":"id='"+id+"'","__name_value_list__":{
              "total_amt": commonData.getTotalPrice(),
       "total_amt_usdollar": commonData.getTotalPrice(),
       "discount_amount": 0,
       "discount_amount_usdollar": 0,
       "subtotal_amount": total_price,
       "subtotal_amount_usdollar": total_price,
       "tax_amount": total_vat,
       "tax_amount_usdollar": total_vat,
       "subtotal_tax_amount": total_vat,
       "subtotal_tax_amount_usdollar": total_vat,
       "total_amount":grand_total,
       "total_amount_usdollar":grand_total,
            }});
           }
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch("https://dev.ordo.primesophic.com/set_data_s.php", requestOptions).then(function (response) {
              return response.json();   
            }).then(function (result) {
              console.log(result);
              that.setState({isloading:true});
         that.forceUpdate();
           
      
         
            }).catch(function (error) {
              console.log("-------- error ------- " + error);
            });
        
     
  }
  refreshData() {
    this.setState({ refresh: !this.state.refresh })
    commonData.writedata(currentPath, this.state.arrayHolder)
    this.calculaterunningTotals()
    this.forceUpdate();
  }
  increment() {
    this.AddorDelete('+')
  }
  stockcountupdate=(id,stock)=>{
    var  that= this;
    that.setState({isloading:true});
    var url =SET_DATAURL
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_19",
     __session_id__:commonData.getsessionId(),
     __query__: "id='"+id+"'",
     __name_value_list__:{
       "id": id,
       "stock_c":stock
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  // that.setState({isloading:false});
  console.log("item deleted",id,stock,result) }).catch(function (error) {
    // that.setState({isloading:false});
   console.log("-------- error ------- " + error);
 });
  }

  
  updatepayment=(id)=>{
    this.setState({isloading:true});
    var url =SET_DATAURL
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_01",
     __query__: "id='"+id+"'",
     __session_id__:commonData.getsessionId(),
     __name_value_list__:{
       "due_amount_c": commonData.getTotalPrice(),
       "payment_due_c":"1",
       "id":id

     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  // this.setState({isloading:false});
  console.log("item deleted",id,result) }).catch(function (error) {
    // this.setState({isloading:false});
   console.log("-------- error ------- " + error);
 });
  }
  componentDidMount(){
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
              // console.log(position);
              // Alert.alert(position);
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
        alert("Location permission err", err);
        console.warn(err);
      }
     
    }
    requestLocationPermission();
    Geolocation.watchPosition(
      position => {
        // console.log(position.coords.latitude,"position.coords.latitude");
        commonData.setcordinates(position.coords.latitude,position.coords.longitude);
       
       
      },
      error => {
        // console.log(error);
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
  AddorDelete(type){
    let TYPE=this.props.navigation.getParam('TYPE', '')
    if(commonData.isOrderOpen==false){
      Alert.alert('Alert','You do not have an order open.');
      return;
    }
    if(this.state.From=='OG')
    {
      Alert.alert('Alert','You cannot add or delete items from the Bundled order.');
      return;
    }
    if (this.state.itemID == null||this.state.itemID.length==0){
      Alert.alert('Alert','Please enter the item id')
      Keyboard.dismiss()
      return;
    }
    
    this.state.From= commonData.getContext();
    if(TYPE=="RETURN" ){
      Alert.alert('Warning','You cannot change the Ordered quantity value.')
      Keyboard.dismiss()
      return;
    }

    this.itemList = commonData.getSkuArray();
    for(var i=0;i<this.state.arrayHolder.length;i++){
     
      if(this.state.arrayHolder[i].itemid==this.state.itemID){
        var itemIdEnteredUpCase=this.state.itemID.toUpperCase()
        var itemEnteredLow=this.state.itemID.toLowerCase()
        if ((itemIdEnteredUpCase)== this.state.arrayHolder[i].itemid.toUpperCase()) {
          if (this.state.qty <=0) {
            this.state.qty = 1;
          }
          
          this.state.ItemArray[i].imgsrc=this.state.arrayHolder[i].imgsrc
          if(type=='-')
          this.state.ItemArray[i].qty = this.state.qty-1
          else{
            this.state.qty=this.state.qty+1
            this.state.ItemArray[i].qty = this.state.qty;
          }
         
          this.state.ItemArray[i].price = this.state.arrayHolder[i].price
          this.state.ItemArray[i].itemid = this.state.arrayHolder[i].itemid
          this.state.ItemArray[i].weight= Number(this.state.arrayHolder[i].weight)
          this.state.qty=this.state.ItemArray[i].qty
          if(this.state.qty==0||this.state.ItemArray[i].qty==0)
          {
            this.state.ItemArray.splice(i,1)
            this.state.arrayHolder.splice(i,1)
            this.state.itemID = ''
            this.state.qty = 0
            this.state.itemImage=require('../components1/images/noItem.png')
            this.state.description=''
          }
        }
      }
     let filtItems=this.state.ItemArray.filter(itemval=>itemval.qty!=0)
     this.state.ItemArray=[...filtItems];
          this.state.arrayHolder =[...filtItems]
          commonData.setArray([...filtItems])
        this.forceUpdate()
      this.refreshData()
  
    }
  }
  decrement = () => {
    this.AddorDelete('-')

  }
  openLink_in_browser = () => {

    Linking.openURL(this.state.QR_Code_Value);

  }
    onQR_Code_Scan_Done = (QR_Code) => {
  Scannedvalue="";
  this.itemList = commonData.getSkuArray();
    var found=false;
    this.setState({ QR_Code_Value: QR_Code });
    QR_Code=QR_Code.toUpperCase();
    const filterdata= this.itemList.filter(item=>item.id.toUpperCase()==QR_Code||item.itemid.toUpperCase()==QR_Code||item.hsn.toUpperCase()==QR_Code||item.upc.toUpperCase()==QR_Code)
   if(filterdata.length>0){
   this.state.itemID= filterdata[0].itemid;
    this.setState({itemID:filterdata[0].itemid})
   
     
   }
    else{
      this.state.itemID="";
      this.setState({itemID:""})
     }
     this.joinData();
    this.setState({ Start_Scanner: false });
  }
  closeCamera = () => {
    this.setState({ Start_Scanner: false });
  }
  searchItem = () => {
    this.props.navigation.navigate('SKU');
  }
  invaliditems = () => {
    Alert.alert('Please enter the item ID')
  }
  onContentSizeChange=(contentwidth, contentheight)=>{
    this.setState({screenheight:contentheight})
  }
  open_QR_Code_Scanner = () => {

    var that = this;

    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'Camera App Permission',
            'message': 'Camera App needs access to your camera '
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            that.setState({ QR_Code_Value: '' });
            that.setState({ Start_Scanner: true });
          } else {

            alert("CAMERA permission denied");

          }
         } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ QR_Code_Value: '' });
      that.setState({ Start_Scanner: true });
    }
  }
  componentWillReceiveProps() {
    console.log('rerender here')
    //this.yourFunction()
    // this.setState({})
    
}
  productListfunction=(item)=>{
   
    this.state.description=item.description
    this.state.itemID=item.itemid
    this.state.qty=item.qty
    this.state.itemImage=item.imgsrc
    this.forceUpdate();
  }
  uploadsignatureFile=(contents)=>{
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__note_file__\": \""+contents+"\",\n    \"__note_filename__\": \""+"OrderReciept"+commonData.getOrderId()+".png"+"\"\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://143.110.178.47/OrdoCRM7126/uploadFile.php", requestOptions)
  .then(response => response.text())
  .then(result => {console.log("Signature Uploaded",result);
  // this.initiateWhatsApp(commonData.getOrderId());
    this.setState({loading:false,isloading:false})
  this.props.navigation.navigate('OrderSent',{"TYPE":"","doc_id":result.document_id})
 

})
  .catch(error => console.log('error', error));
  }
  captureAndShareScreenshot = () => {
    var that =this;
    captureScreen({
      format: "png",
      quality: 0.8
    })
    .then(
      uri => {console.log("Image saved to", uri);
      RNFS.readFile(uri, 'base64')
  .then((contents) => {
    that.setState({SignitatureCapture:false,screenshotView:false,returnView:false});
      this.uploadsignatureFile(contents);
      Toast.show("Signature Uploaded Successfully")
  //   let urlString = "https://dev.ordo.primesophic.com/index.php?preview=yes&&entryPoint=downloadquote&id=604403fe-0549-9751-3188-638a08080be4&type=Notes"
  //   let options = {
  //     title: 'Ordo Order Reciept',
  //     message: 'Please find the Confirmation Reciept',
  //     url: urlString,
  //     // type: 'image/png',
  //     social:Share.Social.WHATSAPP
  //   };
  //   Share.open(options)
  // .then((res) => {
  //   console.log(res);
  // })
  // .catch((err) => {
  //   err && console.log(err);
  // });
  
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
},
      error => console.error("Oops, snapshot failed", error)
    );
    return;
    
  };
async updaterewards(){
  var uid= await AsyncStorage.getItem('userid');
  var createduser = commonData.getusername()
  var custid=commonData.getActiveCustomerID()
  var last_modified=commonData.getCurrentDate();
  var that = this
  var rewardpoints=commonData.getrewardPoints();
  
  var points= Number(this.state.TotalPrice)*0.1;
  if(Number(points)>100)
  points=100;
  points=Number(points)+Number(rewardpoints);
  that.setState({  isloading: true });
  var url ="http://143.110.178.47/OrdoCRM7126/set_data_s.php";
     fetch(url, {
    method: 'POST',
    body: JSON.stringify(
      {
         __module_code__: "PO_12",
        __query__: "id='"+uid+"'",
        __session_id__:commonData.getsessionId(),
        __name_value_list__:{
          "reward_points": points,
          "id":uid
        }
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {

   commonData.setrewardpoints(points);
   var str_reward=points.toString();
   
   AsyncStorage.setItem('reward',str_reward)
    console.log("Rewards Updated",result);
    // that.setState({isloading:false});
    // that.props.navigation.navigate('OrderSent',{"TYPE":""})

  }).catch(function (error) {
    console.log("-------- error ------- " + error);
    console.log("Rewards not updated","id='"+createduser+"'");
  });

  
}
updatethestatusReturn=(id)=>{
  var that =this;
  that.setState({  isloading: true });
  var url ="http://143.110.178.47/OrdoCRM7126/set_data_s.php";
     fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      "__module_code__": "PO_17",
            "query":"id='"+id+"'",
            "__name_value_list__":{
             "id":id,
              "returned_c":"1",
              "stage":"Return",
              "reason_for_return":that.state.Returnreson
            }
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {

    console.log("Return status Updated",result);
    // that.setState({isloading:false});

  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
  
}
sendReturnFunction=()=>{
  var that =this;
  for (var i = 0; i < that.state.arrayHolder.length; i++) {
  
  var rid= that.state.arrayHolder[i].rid;
  console.log("return parent",that.state.arrayHolder[i]);
  that.updatethestatusReturn(that.state.arrayHolder[i].orderid);
console.log("return orderid",that.state.arrayHolder[i].orderid)
  that.setState({  isloading: true });
  var url ="http://143.110.178.47/OrdoCRM7126/set_data_s.php";
     fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      "__module_code__": "PO_18",
            "query":"id='"+rid+"'",
            "__name_value_list__":{
             "id":rid,
              "returned":1,
            }
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {

    console.log("Return Updated",result);
    // that.setState({isloading:false});

  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
  }
  
  that.DeleteCurrentOrder();
    that.DeleteFunction();
}
additemtolist=(item)=>{
  this.state.itemID=item.itemid;

this.joinData();
Toast.show('Item Added Successfully to your cart', Toast.LONG);
this.state.searchID="";
this.forceUpdate();
}
substituteView = ({ item, index }) => (
        
  <View style={styles.flatliststyle} >

  <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
    <View  style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
    <TouchableOpacity  style={{height: 100, width: 100,marginHorizontal:19,marginTop:27}} onPress={() =>{ this.props.navigation.navigate('Itemdetails',
               {id:item.id,hsn:item.hsn,name:item.description,storeID:item.itemid,desc:item.ldescription,onHand:item.stock,itemImage:require('./images/itemImage/IRG-14.jpg'), qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}}>
        <Image source={{uri:item.imgsrc}} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
        <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',width:100,textAlign:'center',fontWeight:"500"}}>{item.itemid}</Text>
   
    </TouchableOpacity>
          </View>
          <View style={{marginHorizontal:20,flexDirection:'column'}}>
      <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:25}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
      <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:30}}>{item.description}</Text>
      {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>Current Stock - {item.stock}</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
      {/* <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text> */}
     
      </View>
      <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
   
    <Text style={{color:'#00000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,height:60,marginTop:20}}>₹{Number(item.price)}</Text>

    {/* </View> */}
    </View>
    <View style={{ width: 120, height: 40, flexDirection: 'row',marginTop:88,marginHorizontal:-80, borderRadius: 5, borderColor: 'grey', backgroundColor: '#ffffff' }}>
               
                <TouchableOpacity onPress={()=>this.additemtolist(item)} style={{ marginTop: 0,flex:0.25 }}>
                {/* <Image transition={false} source={require('../components1/images/additems.png')} style={{ height: 40, width: 100, marginHorizontal: 0, resizeMode: 'contain' }}></Image> */}
                <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.textSign}>+ADD</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
            </View>
    </View>
 </ImageBackground>
 </View>
    
   
)
choosereson=(value)=>{
  const Filter=ResonList.filter(item=>item.value==value);
  this.setState({Returnreson:Filter[0].value})
}
  render() {
    console.log("the array",this.state.arrayHolder);
    let TYPE=this.props.navigation.getParam('TYPE','')
    const scrollEnabled=this.state.screenheight>height;
    const scrollEnabled1=this.state.screenheight>130;
    let screenwidth= Dimensions.get('window').width;
    let screenheight= Dimensions.get('window').height;
    var price=commonData.getTotalPrice().split("₹")[1];
    var savings=0;
    var gst=Number(price)*18/100;
    var grandtotal=Number(gst)+Number(price);
    var subtotal=Number(savings)+Number(price);
    const saveSign = () => {
      sign.current.saveImage();
  };

	const closeSign = () => {
    this.setState({SignitatureCapture:false,returnView:false});
  };
  const _onDragEvent=() =>{
    // This callback will be called when the user enters signature
    this.state.dragged=true;
   console.log("dragged");
}

	const saveSign1 = () => {
    if(this.state.dragged==false){
      Alert.alert("Warning","Please sign to continue.");
      return;
    }
		sign.current.saveImage();
    this.setState({screenshotView:true});
    var type=commonData.getContext();
    if(type=="RETURN"){
      this.sendReturnFunction();
    }else{
    this.sendOrderFunction();
    }
    
    this.captureAndShareScreenshot();
    this.setState({screenshotView:false});
   this.updaterewards();
	};

	const resetSign1 = () => {
    
		sign.current.resetImage();
    this.setState({dragged:false});
    this.forceUpdate();
	};


  const _onSaveEvent = (result) => {
		console.log(result.encoded);
	};
  const resetSign = () => {
      analytics().logEvent('ClearSignitureBtnClicked', {
          content_type: 'ClearSigniture',
          content_id: JSON.stringify(commonData.token),
          items: [{ name: 'ClearSigniture' }]
      })
      sign.current.resetImage();
      this.setState({dragged:false});
      this.forceUpdate();
  };


    const sign = createRef();
    if (this.state.showsubstitute==true) {
      return (
          <View style={{ flex: 1, alignItems: 'center',  alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(100, 100, 100, 0.9)'}}>
             <TouchableOpacity style={{width:width,height:40}} onPress={()=>{this.setState({showsubstitute:false})}}></TouchableOpacity>
             <View style={{height:300}}>
            <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
            contentContainerStyle={styles.scrollview}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}>
            <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-240}}>
            <Text style={{alignSelf:'center',width:width,textAlign:'center',fontFamily:'Lato-Bold',fontSize:19}}>Search Items</Text>
            <View style={{width:width-50,alignself:'center',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <TextInput 
                label="Search Product ID/Description"
               
                  type="outlined"
                  placeholderTextColor='#dddddd'
                  underlineColor='#dddddd'
                  activeUnderlineColor='#dddddd'
                  outlineColor="#dddddd"
                  selectionColor="#dddddd"
                  autoCompleteType='off'
                  autoCorrect={false}
                  style={{
                    // Setting up Hint Align center.
                    textAlign: 'center',
                    alignSelf:'center',
                    fontSize:12,
                    fontFamily:'Lato-Regular',
                    marginTop:-2,
                   
                    backgroundColor: "#FFFFFF",
                    width: width-110,
                    fontStyle: 'italic',
                    // marginTop: -1,
                    marginHorizontal:0,
                   
                    fontFamily:'Lato-Regular'}}
                    onChangeText={(itemID) => this.searchitemwithdescription(itemID)}
                    value={this.state.searchID}
                    ></TextInput>
                       <TouchableOpacity onPress={()=>this.searchitemwithdescription("")} style={{ marginTop: 0}}>
                {/* <Image transition={false} source={require('../components1/images/additems.png')} style={{ height: 40, width: 100, marginHorizontal: 0, resizeMode: 'contain' }}></Image> */}
                <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.textSign}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
              </View>
                                <Text style={{alignSelf:'center',width:width-100,textAlign:'center',fontFamily:'Lato-Bold',fontSize:19}}></Text>

                <FlatList
                    data={this.state.searcharray}
                    renderItem={this.substituteView}
                    extraData={this.state.refresh}
                    keyExtractor={(item, index) => toString(index,item)}
                    ItemSeparatorComponent={this.renderSeparator} 
                />
                </View>
            </ScrollView>
            </View>  
           </View>
      );
  }
    if (this.state.SignitatureCapture == true) {
      this.state.signinitemsarray=[...this.state.arrayHolder];
      return (
       
<SafeAreaView style={styles.container}>
    <View style={{alignSelf:'center',height:height-90,width:width-10}}>
      <TouchableOpacity style={styles.backStyle} onPress={() => {
      closeSign();
      }}>
      <Image transition={false}  source={require('../components1/images/close_btn.png')} style={{width: 30,height:30,alignSelf:'center' }} > 
      </Image> 
      </TouchableOpacity>
      <View style={{ flexDirection: 'row',alignSelf:'center', marginTop:10 , width:width-20,backgroundColor:'#ffffff'}} >

          <Text style={styles.titleStyle}>
          Order Review 
          </Text>
          <Image transition={false}  source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, marginHorizontal: width-260 ,width: 100,height:40,alignSelf:'center' }} > 
          </Image> 

      </View>


      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontFamily:'Lato-Bold',fontWeight:"500"}}>{commonData.getActiveCustName()} </Text>
      <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',fontWeight:"500"}}>{commonData.getActiveAdress()}</Text>
      <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',fontWeight:"500"}}>GSTIN: {Configuration.GSTIN}</Text>

      <View style={{flexGrow:0.25, height:"70%",backgroundColor: '#ffffff'}}>
      <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center',  marginTop:10,backgroundColor:'#d5d5d5',width:width-10,alignSelf:'center' }} >
      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold', width:width/2.5,marginHorizontal:20}}>Description</Text>
      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/4.5,marginHorizontal:2}}>Qty</Text>
      <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/3.5,marginHorizontal:2}}>Price</Text>
      </View>
<View style={{height:130}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled1}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',height:height-290}}>
                    <FlatList
                        data={this.state.signinitemsarray}
                        renderItem={this.SignItemsView}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
 
      <View style={{flexDirection:'row',height:30,width:width-10,alignSelf:'center',marginTop:30,alignItems:'center',paddingBottom:10}}>
          <View style={styles.parent}>
            <TextInput


            label="Coupon Code"
            //  placeholder="Enter Coupon Code"              
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
            underlineColorAndroid="#dddddd"
            onChangeText={(value) => this.setState({couponcode:value})}
            clearButtonMode="always"
            ref={username => { this.textInput = username }}
            style={{
            backgroundColor:'white',
            width:width-170,
            color: 'red',   
            height:50
            }}
            value={this.state.couponcode}
            />
            <TouchableOpacity
            style={styles.closeButtonParent}
            onPress={() => this.setState({couponcode:""})}
            >
            <Image
            style={styles.closeButton}
            source={require("./images/minus2.png")}
            />
            </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>this.getofferforId(this.state.couponcode)} style={{width:100,height:40,borderWidth:1,borderColor:'#011A90',backgroundColor:'#FFFFFF',borderRadius:5,marginTop:-10}}><Text style={{textAlign:'center',textAlignVertical:'center',color:'#011A90',height:40}}>APPLY</Text></TouchableOpacity>
      </View>      
      <View style={{height:"45%",backgroundColor:'#ffffff'}}>
      <View style={{height:30,flexDirection:'column',width:width-30,alignself:'center'}}>
      <Text style={{ color:'#000000',width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>Sub-Total :{commonData.getTotalPrice()}</Text>
      <Text style={{color:'#000000',width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>GST(18%) : ₹{gst}</Text>
      <Text style={{color:'#000000',width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right'}}>Saving : ₹{savings}</Text>
      <Text style={{color:'#000000', width:width-30,textAlign:'right',fontFamily:'Lato-Bold',fontSize:12,textAlign:'right'}}>GRAND TOTAL : {Number(grandtotal)}</Text>
      </View>
      <Text style={{ color:'#000000',marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10}}>SIGN BELOW</Text>
      <SignatureCapture
      style={styles.signature}
      ref={sign}
      onSaveEvent={_onSaveEvent}
      onDragEvent={_onDragEvent}
      showNativeButtons={false}
      showBorder={true}
      // minStrokeWidth={0.1}
      minStrokeWidth={3}
      maxStrokeWidth={3}
      strokeColor={'black'}
      maxSize={150}
      backgroundColor="#f5f5f5"
      showTitleLabel={true}
      viewMode={'portrait'}
      />
      <View style={{flexDirection:'row',width:"90%",alignself:'center',justifyContent:'center',marginTop:10}}>
       <Text style={{ color:'#000000',marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10}}>Date : {commonData.getCurrentDate()}</Text>
      <TouchableOpacity
      style={styles.buttonStylereset}
      onPress={() => {
      resetSign1();
      }}>

      <Text style={{width:"100%", color:'red',height:30,textAlign:'right',textDecorationLine: 'underline',
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10
      }}>Clear Signature</Text>
      </TouchableOpacity>
      </View>
      </View>
     
      </View>

      <TouchableOpacity
      style={styles.ProceedbuttonStyle}
      onPress={() => {
      saveSign1();
      }}>
      <Text style={{color:'#011A90',fontFamily:'Lato-Bold'}}>Place your Order</Text>
      </TouchableOpacity>
      </View>
</SafeAreaView>
                
      ); 
    }
  
        
   
   
 if (this.state.returnView == true) {
    this.state.signinitemsarray=[...this.state.arrayHolder];
    return (
     
<SafeAreaView style={styles.container}>
   <TouchableOpacity style={styles.backStyle} onPress={() => {
      closeSign();
      }}>
      <Image transition={false}  source={require('../components1/images/close_btn.png')} style={{width: 30,height:30,alignSelf:'center' }} > 
      </Image> 
      </TouchableOpacity>
    <View style={{ flexDirection: 'row',alignSelf:'center', marginTop:10 , width:width-20,backgroundColor:'#ffffff'}} >
      
        <Text style={styles.titleStyle, {fontSize:17,fontWeight:'700',color:'black'}}>
        Return Order Review 
        </Text>
        <Image transition={false}  source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, marginHorizontal: width-280 ,width: 100,height:40,alignSelf:'center' }} > 
        </Image> 

    </View>


    <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontFamily:'Lato-Bold',marginHorizontal:20,fontWeight:"500"}}>{commonData.getActiveCustName()} </Text>
    <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginHorizontal:20,fontWeight:"500"}}>{commonData.getActiveAdress()}</Text>
    <Text style={{color:'#34495A',fontSize:10,borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginHorizontal:20,fontWeight:"500"}}>GSTIN: {Configuration.GSTIN}</Text>

    <View style={{flexGrow:0.25, height:900,backgroundColor: '#ffffff'}}>
    <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center',  marginTop:10,backgroundColor:'#d5d5d5',width:width-10,alignSelf:'center' }} >

    <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold', width:width/2.5,marginHorizontal:20}}>Description</Text>
    <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/4.5,marginHorizontal:2}}>Qty</Text>
    <Text style={{color:'#34495A',fontSize:11,borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',width:width/3.5,marginHorizontal:2}}>Price</Text>
    </View>
    
<View style={{height:130}}>
              <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
              contentContainerStyle={styles.scrollview}
              scrollEnabled={scrollEnabled1}
              onContentSizeChange={this.onContentSizeChange}>
              <View style={{justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',height:height-290}}>
                  <FlatList
                      data={this.state.signinitemsarray}
                      renderItem={this.SignItemsView}
                      extraData={this.state.refresh}
                      keyExtractor={(item, index) => toString(index,item)}
                      ItemSeparatorComponent={this.renderSeparator} 
                  />
                  </View>
              </ScrollView>
              </View>

    <View style={{flexDirection:'row',height:30,width:width-10,alignSelf:'center',marginTop:30,alignItems:'center',paddingBottom:10}}>
    <Dropdown
        label='Reson For Return'
        containerStyle={{width:(width-40),alignself:'center'
        }}
        onChangeText={value=>this.choosereson(value)}
        value={this.state.Returnreson}
        data={ResonList}
        
        
      />
    </View> 
    <View style={{height:400,backgroundColor:'#ffffff'}}>
   
    <Text style={{ color:'#000000',marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10}}>SIGN BELOW</Text>
    <SignatureCapture
    style={styles.signature}
    ref={sign}
    onSaveEvent={_onSaveEvent}
    onDragEvent={_onDragEvent}
    showNativeButtons={false}
    showBorder={true}
     // minStrokeWidth={0.1}
      minStrokeWidth={3}
      maxStrokeWidth={3}
    strokeColor={'black'}
    maxSize={150}
    backgroundColor="#f5f5f5"
    showTitleLabel={true}
    viewMode={'portrait'}
    />
  <Text style={{ color:'#000000',marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10}}>Date:{commonData.getCurrentDate()}</Text>

  
    <TouchableOpacity
    style={styles.buttonStylereset}
    onPress={() => {
    resetSign1();
    }}>

    <Text style={{width:100, color:'red',height:30,textAlign:'center',textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
    }}>Clear Signature</Text>
    </TouchableOpacity>
   
    <TouchableOpacity
    style={styles.ProceedbuttonStyle}
    onPress={() => {
    saveSign1();
    }}>
    <Text style={{color:'#011A90',fontFamily:'Lato-Bold'}}>Place your Return</Text>
    </TouchableOpacity>
    </View>
    </View>
    <View>
</View>
</SafeAreaView>
              
    );
  
   }
    if(this.state.headers){
      return(        
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <View style={{width:screenwidth-20,height:450, backgroundColor:'#ffffff',alignItems:'center'}}>
      <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={{height:40,width:screenwidth-20,backgroundColor:'#ffffff',fontFamily:'Lato-Regular',fontSize:20,color:'#011A90',textAlignVertical:'center',textAlign:'center'}}>Order Headers</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
      
      <TextInput
       label="PO Number"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
         
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,0)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',

marginTop: 10,

}}
value={this.state.headernumber}
/>
<TextInput
       label="Reference #"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          
keyboardType="default"
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,1)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',
marginTop: 10,

}}
value={this.state.headerref}
/>
<TextInput
       label="Comments"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
         
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
         
keyboardType="default"
multiline={true}
// autoCapitalize="none"
underlineColorAndroid="transparent"
onChangeText={username => this.changedValue(username,2)}
clearButtonMode="always"
ref={username => { this.textInput = username }}
// autoCorrect={false}
style={{

backgroundColor:'white',
width:screenwidth-60,
// height: 40,
color: '#534F64',
marginTop: 10,

}}
value={this.state.headercomments}
/>
<TextInput
       label="Customer Address"
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
          keyboardType="default"
          underlineColorAndroid="transparent"
          onChangeText={username => this.changedValue(username,3)}
          clearButtonMode="always"
          ref={username => { this.textInput = username }}
          style={{
          backgroundColor:'white',
          width:screenwidth-60,
          color: '#534F64',
          marginTop: 10,
          borderRadius:10
          }}
          multiline={true}
          value={this.state.headeraddress}
/>

<View style={{flexDirection:'row',width:width-80,alignSelf:'center',backgroundColor:'#ffffff',height:60,marginTop:20,justifyContent:'space-between'}}>
   
<View style={{width:(width-80)/2,height:60}}>
<Card style={{ height: 40, width: 120, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:8}}>
             <TouchableOpacity    onPress={()=>this.save()}>
            
            <Text style  ={{fontFamily:"Lato-Regular",height: 40,width:120,textAlign:'center',color: 'green',
    // fontFamily:"Lato-Bold",
    textAlignVertical:'center',
    // fontWeight: 'bold',
    backgroundColor:'white'}}>SAVE</Text>
              </TouchableOpacity>
             </Card>

</View>
<View style={{width:(width-80)/2,height:60}}>
<Card style={{ height: 40, width: 120, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',borderRadius:8}}>
             <TouchableOpacity    onPress={()=>this.cancel()}>
            
            <Text style  ={{fontFamily:"Lato-Regular",height: 40,width:120,textAlign:'center',color: 'red',
    // fontFamily:"Lato-Bold",
    textAlignVertical:'center',
    // fontWeight: 'bold',
    backgroundColor:'white'}}>CANCEL</Text>
              </TouchableOpacity>
             </Card>

</View>
</View>
{commonData.isOrderOpen==false?
<Text style={{fontFamily:'Lato-Regular',color:'red'}}>There is no Active order to save the headers.</Text>:undefined}
      </View>
      </View>);
    }
    if (this.state.isloading==true) {
      return (
          <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Regular',color:'#000000'}}>Please wait,</Text>
              <Text style={{fontFamily:'Lato-Regular',color:'#000000'}}>While we are Processing your order</Text>
          </SafeAreaView>
      );
  }
    if (!this.state.Start_Scanner) {
      return (
          <View style={{ backgroundColor: '#FFFFFF',flex:1}}>
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF' ,marginHorizontal:5,alignContent:'center',justifyContent:'center'}}>
              <Text style={{ alignSelf: "center",justifyContent:'center', color: '#011A90', fontSize: 20,fontWeight:"700",marginTop: 40,fontFamily:'Lato-Regular' }}>My Cart</Text>
              </View>
              {/* <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}> */}
              <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,width:width-30,backgroundColor:'white' }}>
           
                  <TouchableOpacity style={{marginTop:0}} onPress={this.searchItem} >
              {/* <Image transition={false} source={require('./images/search.png')} style={{ height: 40, width: 40, marginHorizontal: 10,marginTop: -14}}></Image> */}
              <Card 
              style={[styles.signInplus,styles.shadowProp]}>
              <Text style={styles.textSignplus}>+</Text>
          </Card>
            </TouchableOpacity>

              <TouchableOpacity style={{
                color:'#ffffff',
                // marginLeft:-10,
             
                
              }}
                onPress={() =>{{(commonData.isOrderOpen==true)?this.setState({headers:true}):Alert.alert("Warning","There is no active order")}}}>
                     <Image transition={false} source={require('./images/header.png')} style={{ width: 34, height: 40,resizeMode:"contain"}}></Image>
                {/* <Text style={{ width: 100, height: 40, textAlign: 'center', textAlign: 'center', marginTop: -5,color:'white' }}>SEND</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={{
                color:'red',
                // marginLeft:0
              }}
                onPress={() => this.state.arrayHolder.length > 0 ?
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Do you want to send an order?',
                    [
                      { text: 'Yes', onPress: () => this.SignandProceed() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) : Alert.alert('Please add items to the order')}>
            
              <Card
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.sendview}>SEND</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.state.arrayHolder.length > 0 ?
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Order will be saved locally , Saved orders will not be received by the office unless send button is pressed. Do you wish to continue?\n\nDisclaimer: Orders saved locally will be lost if you uninstall the application. ',
                    [
                      { text: 'Yes', onPress: () => this.saveorderShow() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) : Alert.alert('Please add items to the order')} >
                {/* <Image transition={false} source={require('./images/save.png')} style={{ width: 74, height: 40, marginTop: -14,resizeMode:"contain"}}></Image> */}
                <Card
              style={styles.signIn}>
              <Text style={styles.saveview}>SAVE</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => commonData.isOrderOpen?
                  Alert.alert(
                    //title
                    'Warning',
                    //body
                    'Do you want to discard the order. Press Yes to Proceed.',
                    [
                      { text: 'Yes', onPress: () => this.DeleteOrder() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) : (commonData.isOrderOpen==false ?Alert.alert("Warning",'There is no Active order'):Alert.alert("Warning",'There are no Items in your cart to Delete'))}>
                     
                <Card
              style={styles.signIn}>
              <Text style={styles.deleteview}>DELETE</Text>
            </Card>
              </TouchableOpacity>
                
            </View>
              <View style={{ marginTop:10,alignSelf:'center', backgroundColor: '#FFFFFF',width:width-10,height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

                {this.state.QR_Code_Value.includes("http") ?
                  <TouchableOpacity
                    onPress={this.openLink_in_browser}
                    style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14,fontFamily:'Lato-Regular' }}>Open Link in default Browser</Text>
                  </TouchableOpacity> : null
                }
                <TouchableOpacity  onPress={() => commonData.isOrderOpen ? this.open_QR_Code_Scanner() : Alert.alert('There is no Active order')} style={{ marginTop: 10,marginHorizontal:5,flex:0.15}}>
                  <Image transition={false} source={require('./images/barcode.png')} style={{ height: 36, width: 50 ,marginTop:-10}}></Image>
                </TouchableOpacity>
            
               
                <TextInput 
                label="Search Product"
               
                  type="outlined"
                  placeholderTextColor='#dddddd'
                  underlineColor='#dddddd'
                  activeUnderlineColor='#dddddd'
                  outlineColor="#dddddd"
                  selectionColor="#dddddd"
                  autoCompleteType='off'
                  autoCorrect={false}
                  editable={false}
                  style={{
                    // Setting up Hint Align center.
                    textAlign: 'center',
                    fontSize:12,
                    fontFamily:'Lato-Regular',
                    marginTop:-2,
                   
                    backgroundColor: "#FFFFFF",
                    width: width-180,
                    fontStyle: 'italic',
                    // marginTop: -1,
                    marginHorizontal:0,
                    flex:0.49,
                    fontFamily:'Lato-Regular'}}
                    onChangeText={(itemID) => this.changedValue(itemID,4)}
                    value={this.state.itemID}
                    ></TextInput>
                      <TouchableOpacity onPress={()=> {
   this.setState({showsubstitute:true});this.searchitemwithdescription(this.state.itemID)}} style={{ marginTop: 0,flex:0.15 }}>
              
              <Image transition={false} source={require('../components1/images/search1.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>

           
              </TouchableOpacity>
                     <TouchableOpacity onPress={()=>this.joinData()} style={{ marginTop: 0,flex:0.25 }}>
                {/* <Image transition={false} source={require('../components1/images/additems.png')} style={{ height: 40, width: 100, marginHorizontal: 0, resizeMode: 'contain' }}></Image> */}
                <Card 
              style={[styles.signIn,styles.shadowProp]}>
              <Text style={styles.textSign}>+ADD</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </Card>
              </TouchableOpacity>
                
              </View>
               <Text style={{ color: '#34495A',fontFamily:'Lato-Regular', fontWeight: 'bold', marginTop: 5, marginHorizontal: 25 ,height:30,fontWeight:"500"}}>Order Totals:</Text>
              <View style={{flexDirection:'row',marginTop:-10,marginHorizontal:5,backgroundColor:'#FFFFFF'}}> 
                  <Text style={{marginHorizontal:20,color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>
                    Items: {this.state.TotalItem}
                  </Text>
                  <Text style={{marginHorizontal:60,color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>
                    Qty: {Number(this.state.TotalQty)}
                  </Text>
                  <Text style={{marginHorizontal:10,color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>
                    Price: ₹{this.state.TotalPrice}
                  </Text>
              </View> 
               <View style={{flexGrow:1,marginTop:0,height:610}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-300}}>
                    <FlatList
                        data={this.state.arrayHolder}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
          </View>
      );
    }
    this.resignView();
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:'black' }}>
        <View style={{ height: 40,width:width-20,alignself:'center', backgroundColor: 'black', flexDirection: 'row-reverse' }}>
          <TouchableOpacity onPress={this.closeCamera} style={{ marginVertical: 5, height: 30, width: 70, backgroundColor: '#011A90', borderRadius: 25 }}><Text style={{ textAlign: 'center', textAlignVertical: 'center' ,textAlignVertical:'center',height:30,width: 70}}>Cancel</Text></TouchableOpacity>
        </View>
  <CameraScreen
  onReadCode={event =>
    this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
  }
  // Barcode props
  scanBarcode={true}
  // onReadCode={(event) => Alert.alert('QR code found')} // optional
  showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
  laserColor={'#011A90'}// (default red) optional, color of laser in scanner frame
  frameColor='white' // (default white) optional, color of border of scanner frame
/>
      </SafeAreaView>
    );
  }


AddItem = (Qty,itemid,type) => {
   this.state.itemID=itemid
   this.state.qty=Qty
   this.AddorDelete(type)
}
SignItemsView = ({ item, index }) => (
<View style={styles.flatliststyle1}>  
  <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center', backgroundColor:'#ffffff',width:width-10,alignSelf:'center' ,height:40}} >
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:10,height:40, width:width/2.5,marginHorizontal:20}}>{item.description}</Text>
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:width/4.5,marginHorizontal:10}}>{Number(item.qty)}</Text>
   <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',fontSize:12,width:width/3.5,marginHorizontal:10}}>₹{Number(item.price)}</Text>
  </View> 
</View>
 
)
sampleRenderItem = ({ item, index }) => (
        
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
    <TouchableOpacity style={{height: 70, width: 70,marginHorizontal:19,marginTop:27}} onPress={() => this.props.navigation.navigate('Itemdetails',
               {storeID:item.itemid,desc:item.description,onHand:item.stock,itemImage:item.imgsrc, qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}>
        <Image source={{uri:this.getimageforid(item.id)}} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
        <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',width:100,textAlign:'center',fontWeight:"500"}}>{item.itemid}</Text>
   
    </TouchableOpacity>
   </View>
    <View style={{marginHorizontal:20,flexDirection:'column'}}>
      <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
      <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:30}}>{item.description}</Text>
      {/* {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>Current Stock - {item.stock}</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>} */}
      </View>
      <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
       <TouchableOpacity style={{marginTop:30,marginHorizontal:90}} onPress={() => Alert.alert(
          //title
          'Confirmation',
          //body
          'Do you want to delete the selected Item?',
          [
            { text: 'Yes', onPress: () => this.deleteItms(item.itemid,index) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )}>
      <Image transition={false} source={require('./images/minus2.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <Text style={{color:'#000000',borderBottomColor:'#000000',fontWeight:'300',textAlign:'center',fontFamily:'Lato-Bold',width:60,height:60,marginTop:20}}>₹{Number(item.price)}</Text>

      {/* </View> */}
      </View>
      <View style={{ width: 120, height: 40, flexDirection: 'row',marginTop:88,marginHorizontal:-90, borderRadius: 5, backgroundColor: '#ffffff' }}>
              <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),item.itemid,'-')}} style={{ width: 30, height: 40 }}>
                  {/* <Image source={require('./images/minus.png')} style={{ width: 30, height: 30, marginTop: 12, marginHorizontal: 6 }}></Image> */}
                  <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,color:'#000000',
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>-</Text>
             
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,color:'#000000',
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 12,borderRadius:8, width: 40, height: 30,marginTop:12,marginHorizontal:10}}>{Number(item.qty)}</Text>
              <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),item.itemid,'+')}} style={{ width: 30, height: 40 }} >
                  {/* <Image source={require('./images/add.png')} style={{ width: 30, height: 30, marginTop: 12,marginHorizontal:-7}}></Image> */}
                  <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,color:'#000000',
              borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
             fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>+</Text>
             
              </TouchableOpacity>
          </View>
    </View>
 </ImageBackground>
 </View>
    
   
)



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 500,
  },
  ScrollView: {
    // flexGrow: 1,
  },
  scrollview:{
    // flexGrow:1,
    // height:height-480,
    // justifyContent: "space-between",
    // padding: 10,
  },
  searchlist:{
    marginTop: -12,
    height: 200,
    width:width+50,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    marginVertical: -40,
    resizeMode:"contain"
  },
    flatliststyle: {
    marginTop: -12,
    height: 200,
    width:width-40,
    backgroundColor:'white' ,
    alignSelf:'center',
    marginVertical: -40,
    resizeMode:"contain"
    },
    flatrecord: {
      height: 180,
      width:width-30,
      backgroundColor:'#FFFFFF' ,
      alignSelf:'center',
      resizeMode:"contain"
      },
  button1:{
    backgroundColor: "#00C851",
    
    width: "25%",
    height:45,
    
    textAlign:"center",
    alignItems:"center",
    justifyContent:"center",
    fontSize:17,
    borderRadius:10
    
    
    
  },
  signature: {
    flex: 0,
    borderColor: '#ffffff',
    borderWidth: 1,
    color: '#ffffff',
    width: '85%',
    height:80,
    marginHorizontal: 30
},
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 10,


  },
  button: {
    backgroundColor: '#2979FF',
    alignItems: 'center',
    // padding: 12,
    // marginHorizontal:40,
    width: 60,

  },
  backStyle:{
   
      fontSize: 20,
      width:30,
      height:30,
      marginHorizontal:width-60,
      // borderWidth:2.0,
      borderRadius:15,
      marginTop:5,
      textAlign:'center',
      textAlignVertical:'center',
      fontWeight:'bold',
      fontFamily:'Lato',
      backgroundColor:'#ffffff',
  },
  	titleStyle: {
		fontSize: 20,
    width:140,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
    fontFamily:'Lato',
		backgroundColor:'#ffffff',
    color:'#000000'
		// margin: 10,
   
	},
  titleStyle1: {
    fontSize:10,
		color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',margin:10
	},
  flatliststyle2: {
    marginTop: -12,
    height: 200,
    width: width - 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: -30,
    alignSelf: 'center',
    marginVertical: -40,
    resizeMode: "contain"
  },
  flatliststyle1: {
    
    height: 30,
    alignContent:'center',
    width: width -10,
    // backgroundColor: 'red',
    alignSelf: 'center',
    resizeMode: "contain"
  },
  flatrecord1: {
    // marginTop: -1,
    height: 180,
    width: width + 30,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: -30,

    alignSelf: 'center',
    // marginVertical: -30,
    resizeMode: "stretch"
  },
  flatrecord: {
    // marginTop: -1,
    height: 180,
    width: width + 30,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: -30,

    alignSelf: 'center',
    // marginVertical: -30,
    resizeMode: "stretch"
  },
 
  ProceedbuttonStyle: {
		
		justifyContent: 'center',
		alignItems: 'center',
    alignSelf:'center',
   
		height: 40,
    width:width-40,
		// backgroundColor: '#011A90',
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderWidth:1,
    
    borderColor:'#011A90',
		marginBottom: 10,
    
	},
  signIn: {
   
    width: 70,
    height: 35,
    // borderColor:'#011A90',
    borderRadius:8,
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf:'center',
    shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 4 ,
  
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headersave: {
  
    width: 120,
    height: 35,
    // borderColor:'#011A90',
    borderRadius:8,
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf:'center',
//     shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.5,
// shadowRadius: 2,
// elevation: 4 ,
  
  },
  textSign: {
      color: '#011A90',
      // fontWeight: 'bold',
      fontFamily:'Lato-Regular'
    },
  deleteview:{
    color: 'red',
   
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  sendview:{
    color: 'green',
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  saveview:{
    color: '#800080',
    //  fontWeight: 'bold',
     fontFamily:'Lato-Regular'
  },
  buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		backgroundColor: '#eeeeee',
		margin: 10,
	},
  buttonStylereset: {
    width:"57%",
		alignItems: 'center',
		height: 30,
    backgroundColor:'white',
		// marginHorizontal:width-200,
		// margin: 10,
	},
  signInplus: {
    width: 40,
    height: 40,
    // borderColor:'#011A90',
    borderRadius:8,
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf:'center',
    shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 4 ,
  
  },
  textSignplus: {
      color: '#011A90',
      fontWeight: 'bold',
      fontSize:27,
      fontFamily:'Lato-Regular'
    },
  image: {
    height: 30,
    width: 30,
    marginHorizontal: 30,
    marginTop: 30

  },
  parent: {
    // marginLeft: 25,
    // marginRight: 25,
    borderColor: "gray",
    borderRadius: 5,
    // borderWidth: 1,
    flexDirection: "row",
    // justifyContent: "space-between",
    backgroundColor:'white',
    borderRadius:10,
    width: width-150,
marginHorizontal:10,
paddingRight:10,
marginTop:-10,
height:50,
color: '#534F64',
borderWidth: 1,
borderColor:'white',
borderBottomColor:'#dddddd'
// borderColor:'#d5d5d5',
  },
  textInput: {
    height: 40,
    width: width-170,
    fontFamily:'Lato-Regular',


textAlign: 'center',


  },
  closeButton: {
    height: 16,
    width: 16,
    marginHorizontal:0
  },
  closeButtonParent: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    marginTop:-20
  },
});
export { orderfromHistory }
export default OrderItem;