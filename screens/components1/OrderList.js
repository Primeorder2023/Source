
import React, { Component } from 'react';
import { Text,Linking, View,Keyboard,StyleSheet,Dimensions,ImageBackground,Image,TextInput,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from './CommonDataManager';
import { Icon } from 'react-native-elements';
// import {default as UUID} from "uuid";
import uuid from 'react-native-uuid';
var orderid=[]
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
const GET_DATAURL=Constants.GET_URL;
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
var RNFS = require('react-native-fs');
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
var neworderpath = RNFS.DocumentDirectoryPath + '/ordersOfflinenew.json';

import Share, { Social } from 'react-native-share';
let commonData = CommonDataManager.getInstance();
let orderArray=[];
class Orderlist extends Component {
    constructor(props) {
        super(props);

        this.state = {       
        value:"",
        isLoading: false,
        data: [],
        error: null,
        mainData :[],
        data: [],
        orderitemlist:[],
        screenHeight: height,
        searchmsg:'',
        pendingcolor:"",
        ordersloading:false,
        returncolor:"#A0A0A0",
        pending:false,
        completed: false,
        returned:false,
        pendingcolor:"#011A90",

        completedcolor:"#A0A0A0",
        titlelabel:"Pending Orders"
    }
    this.synccall=this.synccall.bind(this);
    this.arrayholder = [];
    }
   async componentDidMount() {
 
      const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      let orderarray=commonData.getordderssArray();
      this.arrayholder=orderarray;
      console.log(orderarray,'+++++++++++++++')
      this.state.searchmsg=''
    });
    this.focusListener = navigation.addListener("willBlur", () => {
        this.resignView()
    });
    }
  resignView() {

  }

componentWillMount(){
  // this.synccall();
  // this.readorders();
  this.updatelist("P");
  
}
    searchFilterFunction = (text) => {  
       this.state.searchmsg=''
      this.setState({
        value: text,
      });
       if(text.length==0){
        this.setState({ mainData: this.arrayholder}); 
        Keyboard.dismiss();
        return;
       }
       var temparray=this.arrayholder;
      const newData = temparray.filter(item => {      
        const itemData = `${item.name.toUpperCase()}${item.orderid.toUpperCase()}${item.orderstatus.toUpperCase()}${item.type.toUpperCase()}${item.customerid.toUpperCase()} ${item.totalitems.toUpperCase()}${item.last_modified.toUpperCase()}`;
       
         const textData = text.toUpperCase();
          
         return itemData.indexOf(textData) > -1;    
      });
      this.setState({ mainData: newData }); 
     
     
    };
    componentWillUnmount(){
      commonData.resetHandler();
    }
gotoOrderItemScreen(item){
  if(item.orderstatus=='NEW'){
    this.getOrderItemListCall(item.orderid,item.type);
    return;
  }
    commonData.checknetwork()
    if(commonData.connection_Status=="ONLINE")
    this.props.navigation.navigate('OrderListdetail',{orderid:item.orderid,code:'OD',status:item.orderstatus,order:item})
    else
    Alert.alert("Error","No network, Please check your internet connection")
  
}
async synccall(){
  var synctime=await AsyncStorage.getItem("syncedtime");
  var syncquery="";
   if(synctime!=""){
    syncquery= " && aos_quotes.date_modified>'"+synctime+"'";

   }
    const variable = await AsyncStorage.getItem('Username');

  var that = this;
 
  that.setState({ isLoading: true });
  fetch(GET_DATAURL, {
    method: "POST",
   
    body: JSON.stringify({
      "__module_code__": "PO_17",
      "__query__": "created_userval_c='"+variable+"'" + syncquery,
      "__session_id__":commonData.getsessionId(),
      "__orderby__": "",
      "__delete__": 0,
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    console.log(result.entry_list);
   let  orderArray = result.entry_list;
    if(orderArray.length==0){
    that.setState({isLoading:false});
    that.forceUpdate();
    return;
    }
    var json = JSON.stringify(orderArray);
   let tempArray = commonData.gettypeArray(json,'PO_14')
   let oldArray = commonData.getordderssArray();
   oldArray.push([...tempArray]);
        commonData.setorderssArray([...oldArray])
        commonData.setorderscount(Number(oldArray.length));
    RNFS.writeFile(neworderpath, json, 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
     
    that.setState({
    
      isLoading: false,
      refreshing: false
    });
  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
 
  // that.readorders();
  that.forceUpdate();
}
readorders(){
  
  RNFS.readFile(neworderpath, 'utf8')
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
        commonData.setorderscount(Number(tempArray.length));
        // this.setState({
        //   mainData: tempArray,
        //   data:tempArray,
        //   JSONResult: tempArray,
         
        // });
        this.updatelist("P");
        this.forceUpdate();
        console.log("temparay array")
        console.log(tempArray);

      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
   
}

async getOrderItemListCall(oid,status) {
  var that = this;
  // that.makeRemoteRequest();
  that.state.isLoading=true;

  const FETCH_TIMEOUT = 1000;
  let didTimeOut = false;
  

  var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__module_code__\": \"PO_18\",\n    \"__query__\": \"parent_id\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(GET_DATAURL, { 
  method: "POST",
           body: JSON.stringify({
             __module_code__: "PO_18",
             __session_id__:commonData.getsessionId(),
             __query__:"parent_id='"+oid+"'",
               __offset__:0,
           })
  
}).then(function (response) {
return response.json();   
}).then(function (result) {
console.log("this is for getting resonse from querying username and getting response")
console.log(result);
console.log(result.entry_list)
console.log(":::::::::::order List Array:::::::::::::::::::::")
commonData.isOrderOpen=true
var val= uuid.v4();
commonData.setOrderId(val)

//************************************************ */

let currentArra=[]
let uname= commonData.getusername()

for(var i=0;i<result.entry_list.length;i++){
    currentArra.push({status:status, returned:result.entry_list[i].name_value_list.returned.value,itemid: result.entry_list[i].name_value_list.part_number.value, description: result.entry_list[i].name_value_list.item_description.value, price: result.entry_list[i].name_value_list.product_list_price.value, qty:result.entry_list[i].name_value_list.product_qty.value, imgsrc: "",weight:result.entry_list[i].name_value_list.product_total_price.value});
 }
 
commonData.setContext('RP')
that.props.navigation.navigate('OrderItem',{"frm":"RP"})

commonData.setArray(currentArra)
//tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});
that.setState({ 
  data:result.entry_list,
 isLoading:false

})
//****************************************************** */
// that.props.navigation.navigate('OrderItem',{orderid:val,code:'OL',json:result.entry_list,TYPE:'CREATE'})
});
}
    
// getOrderItemListCall(oid,status) {
//   var that = this;
//   this.makeRemoteRequest();
//  // here we are quering po_user.username using post method ........
//  fetch(GET_DATAURL, { 
//    method: "POST",
//    body: JSON.stringify({
//      __module_code__: "PO_08",
//      __query__:"",
//        __offset__:0,
//    })
//   }).then(function (response) {
//    return response.json();   
//   }).then(function (result) {
//     console.log(result);
//     if(result){
//       var item =result.entry_list
//       if(status=='NEW')
//      that.props.navigation.navigate('SKU',{orderid:oid.value,code:'OL',json:result.entry_list})
//     }
//     console.log(":::::::::::orderItem List Array:::++++::::::for oid::::::::::::",oid)
//     console.log(result.entry_list)
//     that.setState({ 
//      orderitemlist: result.entry_list});
//   }).catch(function (error) {
//     console.log("-------- error ------- " + error);
//   });
  
 
// }
   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
   
    onContentSizeChange = (contentWidth, contentHeight) => {
      this.setState({ screenHeight: contentHeight });
    };
    updatelist=(type)=>{
      this.setState({ordersloading:true})
      var typearray=commonData.getordderssArray();
      if(type=="P"){
        this.state.mainData=typearray.filter(item=>(item.type.toUpperCase()=="CONFIRMED" ||item.type.toUpperCase()=="DELIVERY ASSIGNED" ||item.type.toUpperCase()=="PENDING"))
        this.state.titlelabel="Pending Orders";
        this.setState({pending:true,completed:false,returned:false,completedcolor:"#A0A0A0",pendingcolor:'#011A90',returncolor:"#A0A0A0",fontFamily:'Lato-Regular'});
      }else if(type=="C"){
        this.state.mainData=typearray.filter(item=>item.type.toUpperCase()=="DELIVERED" ||item.type.toUpperCase()=="CANCEL")
        this.state.titlelabel="Completed Orders";
        this.setState({completed:true,pending:false,returned:false,pendingcolor:'#A0A0A0',completedcolor:'#011A90',returncolor:"#A0A0A0",fontFamily:'Lato-Regular'});
      }else if(type=="R"){
        this.state.mainData=typearray.filter(item=>item.type.toUpperCase()=="RETURN")
        this.state.titlelabel="Return Orders";
        this.setState({completed:false,pending:false,returned:true,pendingcolor:'#A0A0A0',completedcolor:'#A0A0A0',returncolor:"#011A90",fontFamily:'Lato-Regular'});
      }
      this.arrayholder=[...this.state.mainData];
      this.setState({ordersloading:false})
      this.forceUpdate();
    }
    
    cancelorder=(item)=>{
      console.log(item);
      if(item.type.toUpperCase()=="DELIVERY ASSIGNED"){
        Alert.alert("Warning","Cancellation of the Order cannot be initiated.");
        return;
      }
      var that = this;
      
        that.state.loading=true;
     
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"__module_code__":"PO_17","__session_id__":commonData.getsessionId(),"__query__":"id='"+item.orderid+"'","__name_value_list__":{"orderstatus_c":"Cancel","stage":"Cancel","id":item.orderid}});
       
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
       
          that.setState({ 
          
           loading:false
         
     });
    
     that.synccall();
     
     that.forceUpdate();
     
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }

     getLinkWhastapp(number, message) {
        var url = 'https://api.whatsapp.com/send?phone=' 
           + number
           + '&text=' 
           + encodeURIComponent(message)
      
        return url
      }      
shareMyInvoice=(item)=>{
 var message = "Please click the link below t open your invoice  \nhttps://dev.ordo.primesophic.com/index.php?preview=yes&&entryPoint=downloadquote&id="+item.notes_id+"&type=Notes";
var urlmsg = this.getLinkWhastapp("7892948615",message)



  Linking.openURL(urlmsg)
    .then((data) => {
      console.log('WhatsApp Opened');
    })
    .catch(() => {
      alert('Make sure Whatsapp installed on your device');
    });
}

    render() {
      this.state.searchmsg=this.state.mainData.length+' Results'
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > height;
        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.2)'}}>
              <ActivityIndicator />
               <Text style={{fontFamily:'Lato-Bold'}}>Loading Orders , Please wait</Text>

                </View>
            );
        }
        return (
          <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
         
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:17,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>{this.state.titlelabel}</Text>
            <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
             <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
            </TouchableOpacity>
      </View> 
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 
                <TextInput  placeholder="Enter Order #" 
                onChangeText={text => this.searchFilterFunction(text)}
                // onChangeText={(value) => this.setState({ value })}
                autoCorrect={false}
                value={this.state.value}
                style={{marginHorizontal:10, 
                    // width: 250,
                    width:width-150,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    borderRadius:10,
                    // alignSelf:"center",
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
                    // alignSelf:"center",
                    marginTop: 10,
                    textAlign:'center'}}></TextInput>
                   <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }}
                   onPress={() => this.searchFilterFunction('')}>
                     {/* <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} /> */}
                     
              <Text style={styles.textSign}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            
                    </TouchableOpacity>  
                    
        </View>
        <View style={{backgroundColor:'#FFFFFF',height:40,marginLeft:20, flexDirection:"column"}}>
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20,fontWeight:"500"}}>{this.state.searchmsg}</Text>
        </View>
        <View style={{flexDirection:'row',width:width-10,justifyContent:'space-evenly',alignSelf:'center'}}>
        <TouchableOpacity style={{width:width/2-10,height:30, backgroundColor:'white',fontFamily:'Lato-Bold',borderColor:this.state.pendingcolor,borderWidth:2,borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0}} onPress={()=>{this.updatelist("P")}}><Text style={{color:this.state.pendingcolor,textAlignVertical:'center',height:30,textAlign:'center', fontWeight:'700',fontFamily:'Lato-Regular'}}>Pending</Text></TouchableOpacity>
        <TouchableOpacity style={{width:width/2-10,height:30, backgroundColor:'white',fontFamily:'Lato-Bold',borderColor:this.state.completedcolor,borderWidth:2,borderRightWidth:0,borderTopWidth:0,borderLeftWidth:0}} onPress={()=>{this.updatelist("C")}}><Text style={{color:this.state.completedcolor,textAlignVertical:'center',height:30,textAlign:'center',fontWeight:'700',fontFamily:'Lato-Regular'}}>Completed</Text></TouchableOpacity>
        <TouchableOpacity style={{width:width/2-10,height:30, backgroundColor:'white',fontFamily:'Lato-Bold',borderColor:this.state.returncolor,borderWidth:2,borderRightWidth:0,borderTopWidth:0,borderLeftWidth:0}} onPress={()=>{this.updatelist("R")}}><Text style={{color:this.state.returncolor,textAlignVertical:'center',height:30,textAlign:'center',fontWeight:'700',fontFamily:'Lato-Regular'}}>Return</Text></TouchableOpacity>

      </View>
                <View style={{flexGrow:1,marginTop:10,height:90}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:-10,height:height-200}}>
                  {this.state.ordersloading==false?
                    <FlatList
                        data={this.state.mainData}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />:
                    <ActivityIndicator />
                    }
                    </View>
                </ScrollView>
                </View>
          </SafeAreaView>
        );
    }
    sampleRenderItem = ({ item }) => (
      
          <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
          <View style={styles.flatliststyle}>
          <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
            <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:"row",width:70,alignItems:'flex-start'}}>
                  <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
                  <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
                  </TouchableOpacity>
                  <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.type}</Text>
                  {/* <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} /> */}

                </View>
                <View style={{backgroundColor:'white',flex:0.8,width:"90%",height:110,marginHorizontal:60,marginTop:25}}>
                  <View style={{backgroundColor:'white',flexDirection:'row'}}>
                    <View style={{height:60,width:80}}>
                    {(item.orderid!=undefined)?
                  <Text style={{marginTop:10,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.name}</Text>:
                  <Text style={{marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}></Text>}
                  <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:0 }} />
                  <Text style={{color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500",width:140}}>{item.last_modified}</Text>
                  
                  <Text style={{ color: '#011A90',fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:100}}>{item.customerid}</Text>
                
                    </View>
                    <View style={{flexDirection:'column',backgroundColor:'white',width:60 ,marginHorizontal:110,height:100}}>
                    {/* <TouchableOpacity style={{height: 60, width: 60, flexDirection:'row',alignItems:'center'}} onPress={()=>{this.shareMyInvoice(item)}}>
                    <Image transition={false} source={require('./images/whatsapp.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />

                  </TouchableOpacity> */}
                      {this.state.completed==true?
                  <TouchableOpacity style={{height: 60, width: 60, flexDirection:'row',alignItems:'center',marginTop:30}} onPress={()=>{this.getOrderItemListCall(item.orderid,item.type)}}>
                  <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'left',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  textShadowOffset: {width: -1, height: 1},
                  textShadowRadius: 10}}>Repeat</Text>
                  </TouchableOpacity>:this.state.pending==true&&(item.type.toUpperCase()=='CONFIRMED'||item.type.toUpperCase()=='PENDING')? 
                  <TouchableOpacity style={{height: 60, width: 60, flexDirection:'row',alignItems:'center',marginTop:30}} onPress={()=>{
                    Alert.alert(
                      //title
                      'Confirmation',
                      //body
                      'Do you want to cancel this order?',
                      [
                        { text: 'Yes', onPress: () => this.cancelorder(item) },
                        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                      ],
                      { cancelable: false }
                      //clicking out side of alert will not cancel
                    )
                    }}>
                  <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'left',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  textShadowOffset: {width: -1, height: 1},
                  textShadowRadius: 10}}>Cancel</Text>
                  </TouchableOpacity>:
                  <TouchableOpacity style={{height: 60, width: 60,marginTop:30, flexDirection:'row',alignItems:'center'}} >
                  <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'left',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  textShadowOffset: {width: -1, height: 1},
                  textShadowRadius: 10}}></Text>
                  </TouchableOpacity>}</View>
                  </View>
                  <View style={{flexDirection:'row',marginTop:-10,width:300}}>
                  <Text style={{color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500",flex:0.5}}>Total SKUs: {item.totalitems}</Text>
                  <Text style={{ color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500",flex:0.6}}>Total price: {Number(item.total_amount)}</Text>
                </View>
                </View>
            </View>
          </ImageBackground>
          </View>

          </TouchableOpacity>
      
    )
//     sampleRenderItem = ({ item }) => (
      
//       <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
//   <View style={styles.flatliststyle}>
//   <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
//     <View style={{flexDirection:'row'}}>
      
//     <View style={{flexDirection:"row", width:70}}>
//             <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
//                 <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
//             </TouchableOpacity>
           
//             <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.type}</Text>
//             <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} />
        
//             </View>
//     <View style={{marginHorizontal:80}}>
//               {(item.orderid!=undefined)?
//             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.name}</Text>:
//              <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}></Text>}
//             <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />
//            <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>{item.last_modified}</Text>
//         <View>
          
//         </View>
//      {this.state.completed==true?
//     <TouchableOpacity style={{height: 60, width: 60,marginHorizontal:139,marginTop: -40, flexDirection:'row',alignItems:'center'}} onPress={()=>{this.getOrderItemListCall(item.orderid,item.type)}}>
//        <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'center',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
//   textShadowOffset: {width: -1, height: 1},
//   textShadowRadius: 10}}>Repeat</Text>
//       </TouchableOpacity>:this.state.pending==true&&(item.type.toUpperCase()=='CONFIRMED'||item.type.toUpperCase()=='PENDING')? <TouchableOpacity style={{height: 60, width: 60,marginHorizontal:139,marginTop: -40, flexDirection:'row',alignItems:'center'}} onPress={()=>{this.cancelorder(item)}}>
//        <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'center',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
//   textShadowOffset: {width: -1, height: 1},
//   textShadowRadius: 10}}>Cancel</Text>
//       </TouchableOpacity>:
//       <TouchableOpacity style={{height: 60, width: 60,marginHorizontal:139,marginTop: -40, flexDirection:'row',alignItems:'center'}} >
//        <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'center',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
//   textShadowOffset: {width: -1, height: 1},
//   textShadowRadius: 10}}></Text>
//       </TouchableOpacity>}
//       <Text style={{marginHorizontal:-10, color: '#011A90',fontFamily:'Lato-Bold',fontSize:14,marginTop:-10}}>{item.customerid}</Text>
//       <View style={{flexDirection:'row'}}>
//       <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total SKUs: {item.totalitems}</Text>
//       <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total price: {Number(item.totalvalue)}</Text>
//       </View>
//     </View>
//     </View>
//  </ImageBackground>
//  </View>
  
// </TouchableOpacity>
      
//     )
}

export default Orderlist;

const styles=StyleSheet.create({
  scrollview:{
    // flexGrow:1,
    // height:height-480
    // justifyContent: "space-between",
    // padding: 10,
  },
    flatliststyle: {
    marginTop: -12,
    height: 200,
    width:width+50,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    marginVertical: -40,
    resizeMode:"contain"
    },
    flatrecord: {
      height: 180,
      width:width+50,
      backgroundColor:'#FFFFFF' ,
      alignSelf:'center',
      resizeMode:"stretch"
      },
    image: {
        height: 30,
        width: 30,
        marginHorizontal: 30,
        marginTop: 30,
        resizeMode: 'contain'

    },
     shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
    heading:{

    },
    MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : '#F5F5F5'
    },
   
    TouchableOpacityStyle:{
   
     height: 40, width: 40,marginTop: 15
    },
    signIn: {
      width: 90,
      height: 48,
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
    textSign: {
      color: '#011A90',
      fontWeight: 'bold',
      fontFamily:'Lato-Bold',
      alignSelf:'center',
      marginTop:10
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
          fontFamily:'Lato-Bold'
        },
})