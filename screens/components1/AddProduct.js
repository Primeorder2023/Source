



import React, { Component } from 'react';
import { Text,ImageBackground, View,Keyboard, StyleSheet,Dimensions,Image, 
  TouchableOpacity, Alert, ScrollView, FlatList, Platform, Linking, PermissionsAndroid ,ActivityIndicator} from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-navigation';
import { TextInput } from 'react-native';
import { CameraScreen} from 'react-native-camera-kit';
import { Dropdown } from 'react-native-material-dropdown-no-proptypes';
import CommonDataManager from './CommonDataManager';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { registerCustomIconType } from 'react-native-elements';
var warehouselist=[{value: 'All'}];
const Constants = require('../components1/Constants');
const SET_DATAURL= Constants.SET_URL;
const cratelogic=false;
var rooms=[];
var racks=[];
let data = [{
  value: 'Warehouse 1',
}, {
  value: 'Warehouse 2',
}, {
  value: 'Warehouse 3',
}];

let orderfromHistory=[]
let contextvalue=''
var RNFS = require('react-native-fs');
var currentPath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
var inventorypath = RNFS.DocumentDirectoryPath + '/inventoryOffline.json';
let commonData = CommonDataManager.getInstance();
let Scannedvalue = ''
let isFromQty = false
let CurrentorderArray = []
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
var imgsrc= require('./images/itemImage/IRG-14.jpg')
const GET_DATAURL= Constants.GET_URL;
var invpath = RNFS.DocumentDirectoryPath + '/inventorywareOffline.json';

class AddProduct extends Component {
  UnsentArray=[]
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: Constants.BASE_URL,
      QR_Code_Value: '',
      Start_Scanner: false,
      Start_CScanner: false,
      ItemArray: [],
      itemID:'',
      crateID:"",
      crateavailable:0,
      crate_recordid:"",
      description: '',
      onHand:'0',
      bindetails:[],
      MOQ:'0',
      LastOrdered: '',
      itemImage: require('../components1/images/noItem.png'),
      arrayHolder:[],
      textInput_Holder: '',
      itemVariable: '',
      qty: 0,
      cratecount:0,
      TotalItem: 0,
      TotalPrice: 0,
      name: '',
      ABC: '',
      warehouse:"",
      refresh: false,
      loading:false,
      screenheight:height,
      capacity:"",
      available:"",
      rcapacity:"",
      ravailable:"",
      onhand:"",
      ronhand:"",
      warehousedate:[],
      rackdata:[],
      dproom:"",
      dprack:"",
      currentrack:"",
      rackid:"",
      warehouseid:""
    }
    this.itemList = [];
  }
  updaterackdetails=(id,val)=>{
    var that=this;

   
    var url =SET_DATAURL
    var ronhandval=Number(val)+1;
    // that.state.onhand=onhandval;
    // that.state.available=Number(that.state.capacity)-Number(that.state.onhand);
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_24",
     __query__: "id='"+id+"'",
     __session_id__:commonData.getsessionId(),
     __name_value_list__:{
       "id": id,
       "onhand":ronhandval
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  console.log("item deleted",id,ronhandval,result) ;
  

  
  
  that.forceUpdate();
}).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  updatebindetails=(id,val)=>{
    var that=this;

    var url =SET_DATAURL
    var onhandval=Number(val)+1;
    that.state.onhand=onhandval;
    that.state.available=Number(that.state.capacity)-Number(that.state.onhand);
    fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_27",
     __query__: "id='"+id+"'",
     __name_value_list__:{
       "id": id,
       "onhand":onhandval
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  console.log("bin updated",id,onhandval,result) ;
  

  
  
  that.forceUpdate();
}).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  updateinventorydetails=(id,val)=>{
    var that=this;
    var url =SET_DATAURL
        fetch(url, {
   method: 'POST',
   body: JSON.stringify({
     __module_code__: "PO_26",
     __query__: "id='"+id+"'",
     __name_value_list__:{
       "rackid":that.state.rackid,
       "row_id":that.state.row_id,
       "warehouseid":that.state.warehouseid,
       "itemid":id,
       "binid_c":that.state.crate_recordid,
       "qty":val,
       "name":that.state.dprack+that.state.dproom+that.state.itemID
     }
   })
 }).then(function (response) {
   return response.json();
 }).then(function (result) {
  console.log("Inventory Updated") ;
  

  
  
  that.forceUpdate();
}).catch(function (error) {
   console.log("-------- error ------- " + error);
 });
  }
  deleteItemById = id => {
    let temp =[...commonData.getinventoryItemsArray()];
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id == id) {
        
        temp.splice(i, 1)
      }
    }
    this.state.itemID = ''
    this.deleteitemfromserver(id);
    commonData.setinventoryItemsArray(temp);
    // this.state.itemImage=require('../components1/images/noItem.png')
    this.forceUpdate();
  }
  loadInventoryItems(){
 
    var that = this;
    that.setState({ loading: true,showfilter:false });
    if(that.state.warehouse=="All")
    {
      var tempinvarray=commonData.getSkuArray();
      this.setState({JSONResult:tempinvarray});
      that.setState({ loading: false});
      this.forceUpdate();
      return;
    }
    const warehousedetails=that.state.warehousedate.filter(item=>item.name==that.state.warehouse);
    if(warehousedetails.length==0){
      Alert.alert("Warning","Choose a Warehouse to Proceed")
      that.setState({ loading: false});
      this.forceUpdate();
      return;
    }
    const id =warehousedetails[0].id;
    that.state.warehouseid=id;
    console.log(id,"warehousedetails.id;",that.state.warehouse)
    if(id==undefined)
    return;
    var raw = "{\n    \"__id__\":\""+id+"\"\n}";

    var requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    fetch("http://143.110.178.47/OrdoCRM7126/getrecods.php", requestOptions)
    .then(response => response.json())
    .then(result => {
      var invskuArray = result[0].products;
      var roomdate=result[0].rooms;
      var racksdata=result[0].racks;
      racks=[];
      rooms=[];
      for(var rk=0;rk<racksdata.length;rk++){
        racks.push({value:racksdata[rk].name})
        that.state.rackdata.push({id:racksdata[rk].id,name:racksdata[rk].name,barcode:racksdata[rk].barcode,capacity:racksdata[rk].capacity,onhand:racksdata[rk].onhand})
      }
      for(var rm=0;rm<roomdate.length;rm++){
        rooms.push({value:roomdate[rm].name})
      }

      console.log("The sku data which come from the server here")
      console.log(invskuArray);

// write the file

var json = JSON.stringify(invskuArray);
console.log(json, "this is invskuArray order array list array")
RNFS.writeFile(invpath, json, 'utf8')
  .then((success) => {
    console.log('FILE WRITTEN!');
  })
  .catch((err) => {
    console.log(err.message);
  });
      that.setState({
        loading: false,
        refreshing:false
      });
      // that.readInventory();
    })
    .catch(error => console.log('error', error));
    that.setState({
      loading: false,
      refreshing:false
    });


  }
  
  async readInventory(){


    // write the fil
  var tempskuarray=commonData.getSkuArray();
  var tempinvarray=[];
    RNFS.readFile(invpath, 'utf8')
      .then((contents) => {
        // log the file contents
        console.log("writting files to orders.....................")
        console.log(contents);
        console.log("Json_parse");
        console.log(JSON.parse(contents));
        console.log("Reading Order array from json and use it throughout app using common data manager")
        let temparray=JSON.parse(contents);
       
        console.log("temparray",tempskuarray)

        for(var i=0;i<temparray.length;i++){
          for(var j=0;j<tempskuarray.length;j++){
        if(temparray[i].id==tempskuarray[j].id){
        
        
          tempinvarray.push({
            'itemid':temparray[i].part_number,
      'description':temparray[i].name,
      'price':temparray[i].price,
      'qty':0,'upc':temparray[i].upc_c,
      'category':temparray[i].category,
      'subcategory':temparray[i].subcategory_c,
      'unitofmeasure':temparray[i].unitofmeasure_c,
      'manufacturer_c':temparray[i].manufacturer_c,
      'class':temparray[i].class_c,
      'pack':"12",
      'size':"",
      'weight':temparray[i].weight_c,
      'extrainfo1':"",
      'extrainfo2':"",
      'extrainfo3':"",
      'extrainfo4':"",
      'extrainfo5':"",
      'imgsrc':temparray[i].product_image,
      'manufactured_date':temparray[i].manufactured_date_c,
      "stock":temparray[i].stock_c,
      "id":temparray[i].id,
      "noofdays":10
            
          })
        }
      
         }
        }
        // commonData.setSkuArray(temparray)
        console.log("temparay array inventory")
        console.log(tempinvarray);
        this.setState({JSONResult:tempinvarray});
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
   }

  ReloadItems() {
    this.setState({
      loading: false,
    });
  this.loadwarehouse();
  this.getbindetails();
    RNFS.readFile(inventorypath, 'utf8')
      .then((contents) => {
       
       commonData.setinventoryItemsArray(contents);
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
   
   
    if(commonData.getinventoryItemsArray().length>0)
     this.joinData();
  }
  componentWillMount = () => {
    const { navigation } = this.props;
    this.state.From=this.props.navigation.getParam('From','')
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
    
      this.ReloadItems();
    
   
    });
    this.focusListener = navigation.addListener("willBlur", () => {
    });

  }
  loadwarehouse=()=>{
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__module_code__\": \"PO_22\",\"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

var requestOptions = {
method: 'POST',
headers: myHeaders,
body: raw,
redirect: 'follow'
};

fetch(Constants.GET_URL, requestOptions)
.then(response => response.json())
.then(result => {
var tempwarehouse=result.entry_list;
warehouselist=[];
warehouselist.push({value:"All"})
var tempwarehousedata=[]
for(var i=0;i<tempwarehouse.length;i++)
{
  warehouselist.push({value:tempwarehouse[i].name_value_list.name.value});
  tempwarehousedata.push({"id":tempwarehouse[i].name_value_list.id.value,"name":tempwarehouse[i].name_value_list.name.value})
}
this.state.warehousedate=[...tempwarehousedata];
this.forceUpdate();
})
.catch(error => console.log('error', error));
  }
  componentWillUnmount(){
    this.state.itemID="";
    this.closeCamera();
   
  }
  saveItem = () => {
 var that=this;
 var uname=commonData.getusername();
    if(commonData.getinventoryItemsArray().length==0)
    {
      Alert.alert("Warning","There are no items to Upload.Please add to continue.");
      return;
    }
    var ItemArray =[...commonData.getinventoryItemsArray()];
    for(var i=0;i<ItemArray.length;i++){
      console.log("itemArray",ItemArray[i].id,"**********")
    
        fetch(SET_DATAURL, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_19",
        __session_id__:commonData.getsessionId(),
        __query__: "id='"+ItemArray[i].id+"'",
        __name_value_list__:{
          "id":ItemArray[i].id,
         "part_number":ItemArray[i].itemid,
         "description":ItemArray[i].description,
         "name":ItemArray[i].description,
         "product_image":"http://143.110.178.47/OrdoCRM7126/upload/3C4CE90C-B9D6-CC8B-5A6B-3CC60A83E131_619nZU7iyGL._SL1500_.jpg",
         "assigned_user_name":uname,
         "price":ItemArray[i].base_price,
         "dfd_price_c":ItemArray[i].base_price,
         "mfd_price_c":ItemArray[i].base_price,
         "retail_price":ItemArray[i].base_price,
         "baseprice_c":ItemArray[i].base_price,
         "qty_c": ItemArray[i].qty,
         "upc_c": ItemArray[i].UPC,
         "category": ItemArray[i].category,
         "subcategory_c": ItemArray[i].sub_cat,
         "unitofmeasure_c": ItemArray[i].uom,
         "pack_c": ItemArray[i].pack,
         "size_c":ItemArray[i].size,
         "weight_c":ItemArray[i].weight,
         "extrainfo1_c":ItemArray[i].exta1,
         "extrainfo2_c":ItemArray[i].exta2,
         "extrainfo3_c":ItemArray[i].exta3,
         "extrainfo4_c":ItemArray[i].exta4,
         "extrainfo5_c":ItemArray[i].exta5,
         "extrainfo6_c":ItemArray[i].exta6,
         "stock_c":ItemArray[i].stock,
         "manufacturer_c":ItemArray[i].mfd,
         "class_c":ItemArray[i].class
        }
      }
  )
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("Added Item to Server")
      that.addnewItemRelationship(result.id,that.state.warehouseid)
     var ItemArray =[];
     commonData.setinventoryItemsArray(ItemArray);
 that.state.itemID=""
 that.forceUpdate();
 that.synccall();

    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    

  }
    
    
       

}

  async joinData(){
    Keyboard.dismiss();
    var json = JSON.stringify(ItemArray);
if(inventorypath){
     
  await RNFS.unlink(inventorypath);
  console.log("file deleted", inventorypath);
   }
   this.scanbarcode();
   // this.searchForItem();
    // this.props.navigate('AddItemToList');
  }
  
  updateArray = () => {

  }
  
  
 
  async DeleteOrder() {
    if(commonData.getinventoryItemsArray().length==0)
    {
      Alert.alert("Warning","No items to be deleted.");
      return;
    }
    var ItemArray =[];
    if(inventorypath){
     
      await RNFS.unlink(inventorypath);
      console.log("file deleted", inventorypath);
       }
    commonData.setinventoryItemsArray(ItemArray);
this.state.itemID=""
this.forceUpdate();
  }

  synccall(){
   
    var that = this;
 
    fetch(GET_DATAURL, {
      method: "POST",
      body: JSON.stringify({
        "__module_code__": "PO_20",
        "__query__": "",
        "__orderby__": "",
        "__session_id__":commonData.getsessionId(),
        "__offset__": 0,
        "__select _fields__": [""],
        "__max_result__": 1,
        "__delete__": 0,
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("The previous order data which come from the server here",result)
      var json = JSON.stringify(result.entry_list);
      console.log(json, "this is for orders list array")
      let tempArray = commonData.gettypeArray(json,'PO_06');
      commonData.setSkuArray(tempArray)
     that.props.navigation.goBack();
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });
    
  }
  
  
  
  refreshData() {
    this.setState({ refresh: !this.state.refresh })
    this.forceUpdate();
  }
 
  openLink_in_browser = () => {

    Linking.openURL(this.state.QR_Code_Value);

  }
  onQR_Code_Scan_Done = (QR_Code) => {
    let skuList = commonData.getSkuArray();
    this.setState({ QR_Code_Value: QR_Code });
    for (i = 0; i < skuList.length; i++) {
      if(QR_Code==skuList[i].itemid||QR_Code==skuList[i].upc){
        this.setState({ itemID: skuList[i].itemid });
       
      }
    }
    Scannedvalue = QR_Code;
    this.joinData()
    this.setState({ Start_Scanner: false,QR_Code:"" });
  }
  getavailablespaceforcrate=(id)=>{
    const array=this.state.bindetails.filter(item=>item.name_value_list.id.value==id);
    return array[0].name_value_list.capacity.value;
  }
  getbindetails=()=>{
    var myHeaders = new Headers();
    var that=this;
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__module_code__\": \"PO_27\",\"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(Constants.GET_URL, requestOptions)
  .then(response => response.json())
  .then(result => {console.log("bindetails",result);
    that.setState({bindetails:result.entry_list});
    if(cratelogic==false){
      if(result.entry_list.length>0){
       
        for(var i=0;i<result.entry_list.length;i++){
         
          console.log("bindetails",result.entry_list[i].name_value_list.id.value)

          console.log("bindetails",result.entry_list[i].name_value_list)
        var avail= this.getavailablespaceforcrate(result.entry_list[i].name_value_list.id.value);
        if(Number(avail)>0){
          this.searchCrate(result.entry_list[i].name_value_list.barcode.value);
          that.forceUpdate();
          return;
        }
      }
      }
     
    }
    that.forceUpdate();
  })
  .catch(error => console.log('error', error));
  }
  searchCrate=(value)=>{
    var that=this;
    if(value=="")
    return;

   const listarray= that.state.bindetails;
   if(listarray!==undefined){
   var binarray=[];
   console.log(listarray,"listarray")
   for(var i=0;i<listarray.length;i++){
   binarray.push({id:listarray[i].name_value_list.id,barcode:listarray[i].name_value_list.barcode.value,available:Number(listarray[i].name_value_list.capacity.value)-Number(listarray[i].name_value_list.onhand.value),capacity:listarray[i].name_value_list.capacity.value,onhand:listarray[i].name_value_list.onhand.value})
  console.log(binarray) 
  }
   var array=binarray.filter(item=>item.barcode==value)
   console.log(array,"that.state.bindetails")
  
   if(listarray.length>0 && array.length>0)
   that.setState({ Start_CScanner: false,crateID:value,crate_recordid:array[0].id,crateavailable:array[0].available,onhand:array[0].onhand,capacity:array[0].capacity,available:array[0].available});
    else{
     
      Alert.alert("Warning","Barcode invalid");
      that.setState({ Start_CScanner: false,crateID:"",crate_recordid:""});
      that.setState({ crateavailable:0,onhand:0,capacity:0,available:0});
     


    }
    that.forceUpdate();
  }
  }
  onQR_Code_CScan_Done = (QR_Code) => {
   var that=this;
   console.log(that.state.bindetails);
    if(that.state.bindetails.length>0){

    var listarray=[];
    for(var i=0;i<that.state.bindetails.length;i++){
    console.log("barcode",that.state.bindetails[i].name_value_list.barcode.value);
    if(that.state.bindetails[i].name_value_list.barcode.value==QR_Code){
    listarray.push(that.state.bindetails[i]);
    break;
    }
    }
    if(listarray.length>0){
    that.setState({ Start_CScanner: false,crateID:QR_Code,crate_recordid:listarray[0].name_value_list.id,crateavailable:listarray[0].name_value_list.capacity.value});
    that.searchCrate(QR_Code);
    }
    else{
    Alert.alert("Warning","Barcode invalid");
    that.setState({ Start_CScanner: false,crateID:"",crate_recordid:""});

    }
    }
  }
  closeCamera = () => {
    this.setState({ Start_Scanner: false ,Start_CScanner:false});
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
  open_QR_Code_Scanner_ForInventory = () => {

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

            that.setState({ crateID: '' ,crate_recordid:""});
            that.setState({ Start_CScanner: true });
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
      that.setState({ crateID: '',crate_recordid:"" });
      that.setState({ Start_CScanner: true });
    }
  }
  // productListfunction=(item)=>{
   
  //   this.state.description=item.description
  //   this.state.itemID=item.itemid
  //   this.state.qty=item.qty
  //   this.state.itemImage=item.imgsrc
  //   this.forceUpdate();
  // }
//   render() {
//     const scrollEnabled=this.state.screenheight>height;
//     if (this.state.loading==true) {
//       return (
//           <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
//               <ActivityIndicator />
//               <Text style={{fontFamily:'Lato-Bold'}}>Please wait,</Text>
//               <Text style={{fontFamily:'Lato-Bold'}}>While we are Uploading</Text>
//           </View>
//       );
//   }
//     if (!this.state.Start_Scanner) {
//       return (
//           <View style={{ backgroundColor: '#FFFFFF',flex:1}}>
//                    <View style={{flexDirection:'row',marginTop:30}}>
//          <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>{this.state.itemID="";commonData.setinventoryItemsArray("");this.props.navigation.goBack()}}>           
//                   <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
//            </TouchableOpacity> 
//              <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width-90, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center',fontFamily:"Lato-Regular",marginTop:20}}>Inventory Management</Text>
//        </View> 
//               {/* <View style={{ alignSelf:'center',marginTop:0, backgroundColor: '#FFFFFF',height: 50, flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}> */}
//               <View style={{ alignSelf:'center',alignItems:'center',marginTop:-10, backgroundColor: '#FFFFFF',height: 50,width:width-80, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20 }}>
//             <TouchableOpacity onPress={() => 
//                   Alert.alert(
//                     //title
//                     'Confirmation',
//                     //body
//                     'Do you want to Upload the items to the server?',
//                     [
//                       { text: 'Yes', onPress: () => this.saveItem() },
//                       { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
//                     ],
//                     { cancelable: false }
//                     //clicking out side of alert will not cancel
//                   ) }>
//               <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.7, marginHorizontal:5,
// shadowRadius: 5,
// elevation: 9 }}>UPLOAD ITEMS</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//             style={{height:30}}
//              onPress={() => 
//               Alert.alert(
//                 //title
//                 'Confirmation',
//                 //body
//                 'Do you want to delete all items?',
//                 [
//                   { text: 'Yes', onPress: () => this.DeleteOrder() },
//                   { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
//                 ],
//                 { cancelable: false }
//                 //clicking out side of alert will not cancel
//               ) }>
//               <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.5, marginHorizontal:5,
// shadowRadius: 2,
// elevation: 9 }}>DELETE ITEMS</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={{
//                 width: 40,
                
//                 height:30,
//               }}
//                 onPress={() => 
//                   this.props.navigation.navigate('AddItemToList')
//                   }>
                    
              
//              <Text style={{backgroundColor:'white',height:30,width:40,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:24,borderRadius:8,shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.5, marginHorizontal:5,
// shadowRadius: 2,
// elevation: 9 }}>+</Text>
//                  </TouchableOpacity>

//             </View>
//             <View style={{ height: 50,backgroundColor:'#FFFFFF' }}>
//               <View style={{ marginTop:1,alignSelf:'center', backgroundColor: '#FFFFFF',width:380,height: 100, flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',flex:1 }}>

//                 {this.state.QR_Code_Value.includes("http") ?
//                   <TouchableOpacity
//                     onPress={this.openLink_in_browser}
//                     style={styles.button}>
//                     <Text style={{ color: '#FFF', fontSize: 14 ,fontFamily:'Lato-Bold'}}>Open Link in default Browser</Text>
//                   </TouchableOpacity> : null
//                 }
//                 <TouchableOpacity onPress={() => this.open_QR_Code_Scanner() } style={{ marginTop: 10}}>
//                   <Image transition={false} source={require('./images/barcode.png')} style={{ height: 36, width: 50 ,marginHorizontal:-10,marginTop:-10}}></Image>
//                 </TouchableOpacity>
//                 <TextInput placeholder="Enter the Product ID"
//                   placeholderTextColor='#dddddd'
//                   onChangeText={(itemID) => this.setState({ itemID:itemID })}
//                   autoCompleteType='off'
//                   autoCorrect={false}
//                   style={{
//                     textAlign: 'center',
//                     // Setting up TextInput height as 50 pixel.
//                     height: 40,
//                     // Set border width.
//                     borderWidth: 1,
//                     // Set border Hex Color Code Here.
//                     borderColor: '#011A90',
//                     // Set border Radius.
//                     borderRadius: 5,
//                     //Set background color of Text Input.
//                     backgroundColor: "#FFFFFF",
//                     width: width-150,
//                     fontStyle: 'italic',
//                     marginTop: -1,
//                     fontFamily:'Lato-Regular'}}>{this.state.itemID}</TextInput>
//                    <TouchableOpacity onPress={()=>this.searchForItem()} style={{ marginTop: 0,height: 30, width: 30 }}>
//                   <Image transition={false} source={require('../components1/images/find.png')} style={{ height: 30, width: 30 ,resizeMode:'contain'}}></Image>
//                 </TouchableOpacity>
//               </View>
//               </View>
//               <View style={{height:66,width:width-30,alignSelf:'center',backgroundColor:'#ffffff',flexDirection:'column'}}>
//               <Text style={{fontFamily:'Lato-Bold',fontSize:12,height:22}}>Instructions:</Text>
//               <View style={{flexDirection: 'row',height:22}}>
//       <Text>{'\u2022'}</Text>
//       <Text style={{flex: 1, paddingLeft: 5,fontSize:12}}>Scan upc or enter item id to edit</Text>
//     </View>
//     <View style={{flexDirection: 'row',height:22}}>
//       <Text>{'\u2022'}</Text>
//       <Text style={{flex: 1, paddingLeft: 5,fontSize:12}}>Click on + button to add new item</Text>
//     </View>

                 
//               </View>
//             <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
//                 contentContainerStyle={styles.ScrollView}
//                 horizontal={true}
//                 scrollEnabled={scrollEnabled}
//                 onContentSizeChange={this.onContentSizeChange}>
//                 <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10}}>
//                 <FlatList
//                   data={commonData.getinventoryItemsArray()}
//                   extraData={this.state.refresh}
//                   renderItem={this.sampleRenderItem}
//                   keyExtractor={(item, index) => toString(index)}
//                   ItemSeparatorComponent={this.renderSeparator} />
//                   </View>
//               </ScrollView>
//           </View>
//       );
//     }
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor:'black' }}>
//         <View style={{ height: 40, backgroundColor: 'black', flexDirection: 'row-reverse' }}>
//           <TouchableOpacity onPress={this.closeCamera} style={{ marginVertical: 5, height: 30, width: 70, backgroundColor: '#FF7D6B', borderRadius: 25 }}><Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>cancel</Text></TouchableOpacity>
//         </View>
//         <CameraKitCameraScreen
//           showFrame={true}
//           scanBarcode={true}
//           laserColor={'#FF3D00'}
//           frameColor={'#00C853'}
//           colorForScannerFrame={'black'}
//           onReadCode={event =>
//             this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
//           }
//         />

//       </SafeAreaView>
//     );
//   }
changeracks=(value)=>{
  this.setState({dprack:value})
  
  let rackselected= this.state.rackdata.filter(item=>item.name==value);

 if(rackselected.length>0){
   this.state.rackid=rackselected[0].id
   this.state.rcapacity=rackselected[0].capacity;
   this.state.ronhand=rackselected[0].onhand;
   this.state.ravailable=Number(rackselected[0].capacity)-Number(rackselected[0].onhand)
 }
 this.forceUpdate();
}
changewarehouse=(value)=>{
  this.setState({warehouse:value})
  this.forceUpdate();
  this.loadInventoryItems()
}
render() {
  const editablecrate=(cratelogic==false)?true:true;
  const scrollEnabled=this.state.screenheight>height;
  if (this.state.loading==true) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
            <ActivityIndicator />
            <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Please wait,</Text>
            <Text style={{fontFamily:'Lato-Bold',color:'black'}}>While we are Uploading</Text>
        </View>
    );

}
if(this.state.Start_CScanner==true){
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black' }}>
      <View style={{ height: 40,marginTop:20,width:width-20,alignself:'center', backgroundColor: 'black', flexDirection: 'row-reverse' }}>
          <TouchableOpacity onPress={this.closeCamera} style={{height: 40, width: 70, backgroundColor: '#011A90', borderRadius: 25 ,alignItems:'center',justifyContent:'center'}}><Text style={{ alignself:'center'}}>Cancel</Text></TouchableOpacity>
        </View>
      <CameraScreen
        showFrame={true}
        scanBarcode={true}
        laserColor={'#011A90'}
        frameColor={'#00C853'}
        colorForScannerFrame={'black'}
        onReadCode={event =>
          this.onQR_Code_CScan_Done(event.nativeEvent.codeStringValue)
        }
      />

    </SafeAreaView>
  );
}
 else if (!this.state.Start_Scanner) {
    return (
        <View style={{ backgroundColor: '#FFFFFF',flex:1}}>
                 <View style={{flexDirection:'row',marginTop:30}}>
       <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>{this.state.itemID="";commonData.setinventoryItemsArray("");this.props.navigation.goBack()}}>           
                <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
         </TouchableOpacity> 
           <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 19,width:width-90, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',alignSelf:'center',textAlign:"center",justifyContent:'center',fontFamily:"Lato-Regular",marginTop:20}}>Inventory Management</Text>
     </View> 
    
     <View style={{ alignSelf:'center',alignItems:'center', backgroundColor: '#FFFFFF',height: 60,width:width-40, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>

                       <Dropdown
        label='Choose Warehouse'
        labelTextStyle={{fontSize:8}}
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.changewarehouse(value)}
        value={this.state.warehouse}
        data={warehouselist}
        
        
      />
         <Dropdown
        label='Choose Room'
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.setState({dproom:value})}
        data={rooms}
        value={this.state.dproom}
        
      />  
                  </View>
                  <View style={{width:width-40,height:40,alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              {/* <Dropdown
        label='Choose Room'
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.setState({dproom:value})}
        data={rooms}
        
        
      />   */}
       <Dropdown
        label='Choose Rack'
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.changeracks(value)}
        data={racks}
        value={this.state.dprack}
        
      />
      <View style={{width:(width-40)/2-10,flexDirection:"row",height:40}}>
            <TextInput placeholder="Activate Crate"
                placeholderTextColor='gray'
                onChangeText={(value) => this.setState({ crateID:value})}
                autoCompleteType='off'
                autoCorrect={false}

                editable={editablecrate}
                onSubmitEditing = {(event) => (this.searchCrate(event.nativeEvent.text))}
                style={{
                  textAlign: 'center',
                  // Setting up TextInput height as 50 pixel.
                  height: 40,
                  width:(width-60)/2,
                  alignSelf:'center',
                  // Set border width.
                  borderWidth: 1,
                  // Set border Hex Color Code Here.
                  borderColor: '#A0A0A0',
                  // Set border Radius.
                  borderRadius: 5,
                  //Set background color of Text Input.
                  backgroundColor: "#FFFFFF",
                  
                  fontStyle: 'italic',
                  marginTop: 10,
                  fontSize:12,
                  fontFamily:'Lato-Regular'}}>{this.state.crateID}</TextInput>
                  {/* {cratelogic==true? */}
                  <TouchableOpacity style={{marginHorizontal:-(width-60)/2,height:40,alignItems:'flex-start',alignSelf:'center',marginTop:10,width:40}} onPress={()=>this.open_QR_Code_Scanner_ForInventory()}>
                    {/* <Icon style={{marginTop:10}} name="md-barcode" color='#011A90' size={22}/> */}
                    <Image transition={false} source={require('./images/barcode.png')} style={{ height: 40, width: 40 ,marginTop:0}}></Image>

                    </TouchableOpacity>
                    {/* :null} */}

                  </View>
      </View>
                  <View style={{width:width-20,marginTop:0,height:60,alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      
                  
                           <TextInput placeholder="Search Product ID/UPC code"
                placeholderTextColor='gray'
                onChangeText={(itemID) => this.setState({ itemID:itemID })}
                autoCompleteType='off'
                autoCorrect={false}
                style={{
                  textAlign: 'center',
                  // Setting up TextInput height as 50 pixel.
                  height: 40,
                  width:(width-20)/2,
                  alignSelf:'center',
                  // Set border width.
                  borderWidth: 1,
                  // Set border Hex Color Code Here.
                  borderColor: '#A0A0A0',
                  // Set border Radius.
                  borderRadius: 5,
                  //Set background color of Text Input.
                  backgroundColor: "#FFFFFF",
                  
                  fontStyle: 'italic',
                  marginTop: 10,
                  fontSize:12,
                  fontFamily:'Lato-Regular'}}>{this.state.itemID}</TextInput>
                    
                  <Text style={{ width:(width-20)/2,marginHorizontal:20,textAlign:'center',color:"black"}}>Activated Crate{"\n"}<Text style={{width:(width-20)/2,textAlign:'center',color:'green',fontSize:18}}>{this.state.crateID}</Text></Text>
        </View>
        <View style={{height:36,width:width-30,alignSelf:'center',backgroundColor:'#ffffff',flexDirection:'column'}}>
            {/* <Text style={{fontFamily:'Lato-Bold',fontSize:12,height:22}}>Instructions:</Text>
            <View style={{flexDirection: 'row',height:22}}>
    <Text>{'\u2022'}</Text>
    <Text style={{flex: 1, paddingLeft: 5,fontSize:12}}>Scan upc or enter item id to edit</Text>
  </View>
  <View style={{flexDirection: 'row',height:22}}>
    <Text>{'\u2022'}</Text>
    <Text style={{flex: 1, paddingLeft: 5,fontSize:12}}>Click on + button to add new item</Text>
  </View> */}
{/* <View style={{width:width-20,height:40,alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <Dropdown
        label='Choose Room'
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.setState({dproom:value})}
        data={rooms}
        
        
      />  
       <Dropdown
        label='Choose Rack'
        containerStyle={{width:(width-40)/2-10
        }}
        onChangeText={value=>this.changeracks(value)}
        data={racks}
        
        
      />
      </View> */}
      <View style={{width:width-40,marginTop:0,height:20,alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
       <Text style={{color:"black"}}>Capacity:{this.state.capacity}</Text>
       <Text style={{color:"black"}}>On Hand:{this.state.onhand}</Text>
       <Text style={{color:"black"}}>Available:{this.state.available}</Text>
        </View>
            </View>
          <View style={{ alignSelf:'center',alignItems:'center',marginTop:10, backgroundColor: '#FFFFFF',height: 40,width:width-40, flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
          <TouchableOpacity onPress={() => 
                this.addItem()
                }>
          <Card 
              style={[styles.signInplus1,styles.shadowProp]}>
                 <Icon name="md-add" color='red' size={22}/> 
          </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => 
                Alert.alert(
                  //title
                  'Confirmation',
                  //body
                  'Do you want to Upload the items to the server?',
                  [
                    { text: 'Yes', onPress: () => this.saveItem() },
                    { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                  ],
                  { cancelable: false }
                  //clicking out side of alert will not cancel
                ) }>
          <Card onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}}
              style={[styles.signInplus1,styles.shadowProp]}>
                 {/* <Icon name="md-cloud-upload" color='green' size={22}/>  */}
                 <Image source={require("../components1/images/upload.png")} style={{width:22,height:22}}/>

              {/* <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>+</Text> */}
          </Card>
          </TouchableOpacity>
          <TouchableOpacity 
                onPress={() => 
                  Alert.alert(
                    //title
                    'Confirmation',
                    //body
                    'Do you want to delete all items?',
                    [
                      { text: 'Yes', onPress: () => this.DeleteOrder() },
                      { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //clicking out side of alert will not cancel
                  ) }>
          <Card  
              style={[styles.signInplus1,styles.shadowProp]}>
                
                <Image source={require("../components1/images/recycle-bin.png")} style={{width:22,height:22}}/>

                 {/* <Icon name="md-trash" color='orange' size={22}/>  */}
              {/* <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>+</Text> */}
          </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.open_QR_Code_Scanner() }>
          <Card onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}}
              style={[styles.signInplus1,styles.shadowProp]}>
          <Image source={require("../components1/images/scan.png")} style={{width:22,height:22}}/>

                 {/* <Icon name="md-barcode" color='purple' size={22}/>  */}
              {/* <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>+</Text> */}
          </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.searchForItem()}>
          <Card 
              style={[styles.signInplus1,styles.shadowProp]}>
                 {/* <Icon name="md-search" color='#011A90' size={22}/>  */}
                 <Image source={require("../components1/images/search.png")} style={{width:22,height:22}}/>
              {/* <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>+</Text> */}
          </Card>
          </TouchableOpacity>
</View>
<View style={{ alignSelf:'center',alignItems:'center', backgroundColor: '#FFFFFF',height: 20,width:width-40, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>Add</Text>
                <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>Upload</Text>

                <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>Delete</Text>

                <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>Scan</Text>

                <Text onPress={() =>{commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct')}} style={styles.textSignplus}>Search</Text>


</View>
{/* <View style={{ alignSelf:'center',alignItems:'center', backgroundColor: '#FFFFFF',height: 60,width:width-40, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>

<TextInput placeholder="Search Product ID/UPC code"
                placeholderTextColor='gray'
                onChangeText={(itemID) => this.setState({ itemID:itemID })}
                autoCompleteType='off'
                autoCorrect={false}
                style={{
                  textAlign: 'center',
                  // Setting up TextInput height as 50 pixel.
                  height: 40,
                  width:(width-40)/2,
                  alignSelf:'center',
                  // Set border width.
                  borderWidth: 1,
                  // Set border Hex Color Code Here.
                  borderColor: '#A0A0A0',
                  // Set border Radius.
                  borderRadius: 5,
                  //Set background color of Text Input.
                  backgroundColor: "#FFFFFF",
                  
                  fontStyle: 'italic',
                  marginTop: 10,
                  fontSize:12,
                  fontFamily:'Lato-Regular'}}>{this.state.itemID}</TextInput>
                      <Dropdown
        label='Choose Warehouse'
        containerStyle={{width:(width-40)/2-10
        }}
        data={data}
      />
                  </View> */}
              
            {/* <View style={{ alignSelf:'center',alignItems:'center',marginTop:-10, backgroundColor: '#FFFFFF',height: 50,width:width-80, flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20 }}>
          <TouchableOpacity onPress={() => 
                Alert.alert(
                  //title
                  'Confirmation',
                  //body
                  'Do you want to Upload the items to the server?',
                  [
                    { text: 'Yes', onPress: () => this.saveItem() },
                    { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                  ],
                  { cancelable: false }
                  //clicking out side of alert will not cancel
                ) }>
            <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.7, marginHorizontal:5,
shadowRadius: 5,
elevation: 9 }}>UPLOAD ITEMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={{height:30}}
           onPress={() => 
            Alert.alert(
              //title
              'Confirmation',
              //body
              'Do you want to delete all items?',
              [
                { text: 'Yes', onPress: () => this.DeleteOrder() },
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
              ],
              { cancelable: false }
              //clicking out side of alert will not cancel
            ) }>
            <Text style={{backgroundColor:'white',height:30,width:120,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:12,borderRadius:8,shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 9 }}>DELETE ITEMS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{
              width: 40,
              
              height:30,
            }}
              onPress={() => 
                this.props.navigation.navigate('AddItemToList')
                }>
                  
            
           <Text style={{backgroundColor:'white',height:30,width:40,textAlign:'center',textAlignVertical:'center',fontFamily:'Lato-Bold',fontSize:24,borderRadius:8,shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 9 }}>+</Text>
               </TouchableOpacity>

          </View>
          <View style={{ height: 50,backgroundColor:'#FFFFFF' }}>
            <View style={{ marginTop:1,alignSelf:'center', backgroundColor: '#FFFFFF',width:380,height: 100, flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',flex:1 }}>

              {this.state.QR_Code_Value.includes("http") ?
                <TouchableOpacity
                  onPress={this.openLink_in_browser}
                  style={styles.button}>
                  <Text style={{ color: '#FFF', fontSize: 14 ,fontFamily:'Lato-Bold'}}>Open Link in default Browser</Text>
                </TouchableOpacity> : null
              }
              <TouchableOpacity onPress={() => this.open_QR_Code_Scanner() } style={{ marginTop: 10}}>
                <Image transition={false} source={require('./images/barcode.png')} style={{ height: 36, width: 50 ,marginHorizontal:-10,marginTop:-10}}></Image>
              </TouchableOpacity>
              <TextInput placeholder="Enter the Product ID"
                placeholderTextColor='#dddddd'
                onChangeText={(itemID) => this.setState({ itemID:itemID })}
                autoCompleteType='off'
                autoCorrect={false}
                style={{
                  textAlign: 'center',
                  // Setting up TextInput height as 50 pixel.
                  height: 40,
                  // Set border width.
                  borderWidth: 1,
                  // Set border Hex Color Code Here.
                  borderColor: '#011A90',
                  // Set border Radius.
                  borderRadius: 5,
                  //Set background color of Text Input.
                  backgroundColor: "#FFFFFF",
                  width: width-150,
                  fontStyle: 'italic',
                  marginTop: -1,
                  fontFamily:'Lato-Regular'}}>{this.state.itemID}</TextInput>
                 <TouchableOpacity onPress={()=>this.searchForItem()} style={{ marginTop: 0,height: 30, width: 30 }}>
                <Image transition={false} source={require('../components1/images/find.png')} style={{ height: 30, width: 30 ,resizeMode:'contain'}}></Image>
              </TouchableOpacity>
            </View>
            </View> */}
  
          <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
              contentContainerStyle={styles.ScrollView}
              horizontal={true}
              scrollEnabled={scrollEnabled}
              onContentSizeChange={this.onContentSizeChange}>
              <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10}}>
              <FlatList
                data={commonData.getinventoryItemsArray()}
                extraData={this.state.refresh}
                renderItem={this.sampleRenderItem}
                keyExtractor={(item, index) => toString(index)}
                ItemSeparatorComponent={this.renderSeparator} />
                </View>
            </ScrollView>
        </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'black' }}>
     <View style={{ height: 40,marginTop:20,width:width-20,alignself:'center', backgroundColor: 'black', flexDirection: 'row-reverse' }}>
          <TouchableOpacity onPress={this.closeCamera} style={{height: 40, width: 70, backgroundColor: '#011A90', borderRadius: 25 ,alignItems:'center',justifyContent:'center'}}><Text style={{ alignself:'center',color:'white'}}>Cancel</Text></TouchableOpacity>
        </View>
      <CameraScreen
        showFrame={true}
        scanBarcode={true}
        laserColor={'#FF3D00'}
        frameColor={'#00C853'}
        colorForScannerFrame={'black'}
        onReadCode={event =>
          this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
        }
      />

    </SafeAreaView>
  );
}
scanbarcode=()=>{
  
    let skuList = commonData.getSkuArray();
  
  
    let itemdetial= skuList.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase());
    let ItemArray =[]
    if(itemdetial.length>0)
    {
      var stock=Number(itemdetial[0].stock)+1;
     ItemArray= [...commonData.getinventoryItemsArray()];
     
      const itemdetailsarray=ItemArray.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase())
     if(ItemArray.length>0){
      let index =-1
      for(var i=0;i<ItemArray.length;i++){
        if(ItemArray[i].itemid.toLowerCase()==itemdetailsarray[0].itemid.toLowerCase()){
          index=i;
          break;
        }
      }
  
      stock=Number(itemdetailsarray[0].stock)+1;
      if(index>=0)
      ItemArray.splice(index,1);
     }
      
  
     
      ItemArray.push({id:itemdetial[0].id,
        itemid:itemdetial[0].itemid,
        description:itemdetial[0].description,
        mfd:itemdetial[0].mfd,
        category:itemdetial[0].category,
      sub_cat:itemdetial[0].sub_cat,
      class:itemdetial[0].class,
      UPC:itemdetial[0].UPC,
      stock:stock,
      base_price:itemdetial[0].base_price,
      uom:itemdetial[0].uom,
      size:itemdetial[0].size,
      weight:itemdetial[0].weight,
      pack:itemdetial[0].pack,
      exta1:itemdetial[0].exta1,
      exta2:itemdetial[0].exta2,
      imgsrc:itemdetial[0].imgsrc,
      exta3:itemdetial[0].exta3,
      exta4:itemdetial[0].exta4,
      exta5:itemdetial[0].exta5,
      });
      commonData.setinventoryItemsArray(ItemArray);
      this.forceUpdate();
    }else{
     
      this.props.navigation.navigate('AddItemToList',{"warehouseid":this.state.warehouseid,"rackid":this.state.rackid,"rowid":this.state.row_id,"crateid":this.state.crate_recordid,"bindetails":this.state.bindetails,"itmdetails":[]});
    }
  }
addnewItemRelationship=(itemid,wid)=>{
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "__id__": wid,
  "__pid__": itemid
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://143.110.178.47/OrdoCRM7126/setwarehousedetails.php", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}
addItem=()=>{
  if(this.state.warehouse==""||this.state.dprack==""||this.state.dproom==""){
    Alert.alert("Warning","Choose the warehouse details to proceed");
    return;
  }
  if(Number(this.state.available)==0)
  {
    Alert.alert("Warning","Choose different Crate to Store your item");
    return;
  }else if(Number(this.state.ravailable)==0){
    Alert.alert("Warning","Choose different Rack to Store your item");
    return;
  }

  let skuList = commonData.getSkuArray();


  let itemdetial= skuList.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase());
  
  if(itemdetial.length>0)
  {

    var stock=Number(itemdetial[0].stock)+1;

    var ItemArray =[...commonData.getinventoryItemsArray()];
    const itemdetailsarray=ItemArray.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase())
   if(ItemArray.length>0 && itemdetailsarray.length>0){
    let index =-1
    for(var i=0;i<ItemArray.length;i++){
      if(ItemArray[i].itemid.toLowerCase()==itemdetailsarray[0].itemid.toLowerCase()){
        index=i;
        break;
      }
    }

    stock=Number(itemdetailsarray[0].stock)+1;
    if(index>=0)
    ItemArray.splice(index,1);
   }
    

   
    ItemArray.push({id:itemdetial[0].id,
      itemid:itemdetial[0].itemid,
      description:itemdetial[0].description,
      mfd:itemdetial[0].mfd,
      category:itemdetial[0].category,
    sub_cat:itemdetial[0].sub_cat,
    class:itemdetial[0].class,
    UPC:itemdetial[0].UPC,
    stock:stock,
    base_price:itemdetial[0].base_price,
    uom:itemdetial[0].uom,
    size:itemdetial[0].size,
    weight:itemdetial[0].weight,
    pack:itemdetial[0].pack,
    exta1:itemdetial[0].exta1,
    exta2:itemdetial[0].exta2,
    imgsrc:itemdetial[0].imgsrc,
    exta3:itemdetial[0].exta3,
    exta4:itemdetial[0].exta4,
    exta5:itemdetial[0].exta5,
    });
    commonData.setinventoryItemsArray(ItemArray);
    this.updaterackdetails(this.state.rackid,this.state.ronhand);
    this.updatebindetails(this.state.crate_recordid,this.state.onhand);
    this.updateinventorydetails(itemdetial[0].id,1)
    this.forceUpdate();
  }else{
    this.props.navigation.navigate('AddItemToList',{warehouseid:this.state.warehouseid,rack:this.state.dprack,room:this.state.dproom,avail:this.state.available,"crateid":this.state.crate_recordid,"bindetails":this.state.bindetails,"itmdetails":itemdetial[0]});
  }
}
searchForItem=()=>{
  
  //Get all the items from Products Table
  /*Check if the the entered item is present in the Product Table
  2. If present get the description and the item details of the itemid and add it to the list

*/

  let skuList = commonData.getSkuArray();
  var found = false;

  let itemdetial= skuList.filter(item=>item.itemid.toLowerCase()==this.state.itemID.toLowerCase());
  if(itemdetial.length>0)
  {
    
    this.props.navigation.navigate('AddItemToList',{itemid:itemdetial[0].itemid,desc:itemdetial[0].description,onHand:itemdetial[0].stock,itemImage:itemdetial[0].imgsrc, qty:itemdetial[0].qty,from:'Inventory',price:itemdetial[0].base_price,upc:itemdetial[0].upc,weight:itemdetial[0].weight,itmdetails:itemdetial[0],id:itemdetial[0].id,"crateid":this.state.crate_recordid,"bindetails":this.state.bindetails,"item":itemdetial[0]});
  
  }else{
    Alert.alert("Warning","Please enter the valid item id.")
  }
  return;
  
}
deleteitemfromserver=id=>{
  const SET_DATAURL= Constants.SET_URL;
    const url= SET_DATAURL;
    console.log("url:" + url);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_20",
        __session_id__:commonData.getsessionId(),
        __query__: "aos_products.id= '" + id + "'",
        __name_value_list__: {
          modified_by_name: "Support Primesophic",
          delete: 1,
          id:id
        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("this is deleting order items")
      console.log(result);
      this.synccall();
      
    
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });


}
sampleRenderItem = ({ item, index }) => (
  <TouchableOpacity style={styles.flatliststyle} onPress={() => this.props.navigation.navigate('AddItemToList',
  {itemid:item.itemid,desc:item.description,onHand:item.stock,itemImage:item.imgsrc, qty:item.qty,from:'Inventory',price:item.base_price,upc:item.upc,weight:item.weight,itmdetails:item})}>
  
    <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
      <View style={{flexDirection:'row'}}>

      <View style={{flexDirection:"row"}}>

      <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39,marginTop:27}} >
          <Image transition={false} source={{uri:item.imgsrc}} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:0, resizeMode: 'contain' }} />
      </TouchableOpacity>
      <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-100}}>{item.itemid}</Text>
      <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:83, resizeMode: 'contain' }} />
      </View>
      <View style={{marginHorizontal:-110,}}>
        <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} gms</Text>
        <Image transition={false} source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
        <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.description}</Text>
        <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.stock} - On Hand</Text>
      </View>
      <Text style={{color:'#FF8DB8',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',marginTop:27,marginHorizontal:84}}>₹{item.base_price}</Text>
     <View style={{height: 20, width: 20, marginTop:27,marginHorizontal:-70}}>
       <TouchableOpacity onPress={() => Alert.alert(
          //title
          'Confirmation',
          //body
          'Do you want to delete the selected Item?',
          [
            { text: 'Yes', onPress: () => this.deleteItemById(item.id) },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )}>
      <Image transition={false} source={require('./images/minus2.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
      </TouchableOpacity>
      </View>
   
      </View>
   </ImageBackground>
   {/* </TouchableOpacity> */}
   {/* </View> */}
   </TouchableOpacity>
 
)
}
const styles = StyleSheet.create({
  ScrollView:{
    flexGrow:1,
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
    padding: 12,
    width: 300,

  },
  
  flatliststyle: {
      marginTop: -12,
      height: 200,
      width:width+30,
      backgroundColor:'#FFFFFF' ,
      marginHorizontal: -30,
      alignSelf:'center',
      marginVertical: -40,
      resizeMode:"contain"
    },
    flatrecord: {
      // marginTop: -1,
      height: 180,
      width:width+30,
      backgroundColor:'#FFFFFF' ,
      // marginHorizontal: -30,

      alignSelf:'center',
      // marginVertical: -30,
      resizeMode:"stretch"
      },
  image: {
    height: 30,
    width: 30,
    marginHorizontal: 30,
    marginTop: 30

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
  signInplus1: {
    width: 40,
    height: 40,
    // borderColor:'#011A90',
    borderRadius:15,
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
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
      fontSize:10,
      width:40,
      textAlign:'center',
      fontFamily:'Lato-Bold'
    },
});
export {orderfromHistory}
export default AddProduct;