
import React, { Component ,useEffect,useState} from 'react';
import { Text, View,Keyboard,StyleSheet,Dimensions,ImageBackground,Image,TextInput,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SearchBar } from 'react-native-elements';
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
import CheckBox from '@react-native-community/checkbox';
// const [toggleCheckBox, setToggleCheckBox] = useState(false)

var credit_note=0;
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';

let commonData = CommonDataManager.getInstance();
let accounts=[];
class pendingdelivery extends Component {
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
        checkedvalue:false,
        activecustomer:"",
    }
    this.synccall=this.synccall.bind(this);
    this.arrayholder = [];
    }
   async componentDidMount() {
       let orderarray=commonData.getordderssArray();
        this.arrayholder=orderarray;
        console.log(orderarray,'+++++++++++++++')
        this.state.searchmsg=''
        
    }
componentWillMount(){
  this.synccall();
  var customer=this.props.navigation.getParam('custid', '')
  let accounts=commonData.getstoresArray();
  var selectedaccount=accounts.filter(item=>item.name==customer);
  credit_note=selectedaccount[0].credit_note;
}
    searchFilterFunction = (text) => {  
       this.state.searchmsg=''
      this.setState({
        value: text,
      });
       if(text.length==0){
        this.setState({ mainData: this.state.data}); 
        Keyboard.dismiss();
        return;
       }
      const newData = this.state.mainData.filter(item => {      
        const itemData = `${item.orderid.toUpperCase()}${item.orderstatus.toUpperCase()}${item.type.toUpperCase()}${item.customerid.toUpperCase()} ${item.totalitems.toUpperCase()}${item.last_modified.toUpperCase()}`;
       
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
    this.getOrderItemListCall(item.orderid,item.orderstatus);
    return;
  }
    commonData.checknetwork()
    if(commonData.connection_Status=="ONLINE")
    this.props.navigation.navigate('ItemInvoice',{orderid:item.orderid,code:'OD',credit_note:credit_note})
    else
    Alert.alert("Error","No network, Please check your internet connection")
  
}
 synccall(){
  var that = this;
  that.setState({ isLoading: true });
  var customer=that.props.navigation.getParam('custid', '')
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "sugar_user_theme=SuiteP");
  var raw = "{\n    \"__module_code__\": \"PO_17\",\n    \"__query__\": \"stage='Delivery Assigned' && billing_account ='"+customer+"'\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"id\"],\n    \"__delete__\": 0\n    } \n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

  fetch(GET_DATAURL, requestOptions).then(function (response) {
    return response.json();
  }).then(function (result) {
   let  orderArray = result.entry_list;
   
    var json = JSON.stringify(orderArray);
    console.log('FILE WRITTEN!',json,result);
    
    let pendingarray = commonData.gettypeArray(json,'PO_D14')
    // let pendingarray=tempArray.filter(item=>item.orderstatus=="Delivery Assigned" && tem.customerid==customer);
    // temparray=pendingarray.filter(item=>item.customerid==customer);
    that.setState({
      mainData: pendingarray,
      data:pendingarray,
      JSONResult: pendingarray,
     
    });
  
   
    that.setState({
      isLoading: false,
      refreshing: false
    });
    that.forceUpdate();
  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
 
  that.forceUpdate();
}
readorders(){
  
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
        commonData.setorderscount(Number(tempArray.length));
        this.setState({
          mainData: tempArray,
          data:tempArray,
          JSONResult: tempArray,
         
        });
      
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
  

fetch(GET_DATAURL, { 
  method: "POST",
           body: JSON.stringify({
             __module_code__: "PO_18",
             __query__:"parent_id='"+oid+"'",
             __session_id:commonData.getsessionId(),
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
  
  currentArra.push({ itemid: result.entry_list[i].name_value_list.productid.value, description: result.entry_list[i].name_value_list.description.value, price: result.entry_list[i].name_value_list.price.value, qty:result.entry_list[i].name_value_list.quantity.value, imgsrc: "",weight:result.entry_list[i].name_value_list.um_id.value});
 }
commonData.setContext('RP')
that.props.navigation.navigate('OrderItem',{"frm":"RP"})


commonData.setArray(currentArra)
//tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});
that.setState({ 
  data:result.entry_list,
 isLoading:false

})

});
}
    

   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
   
    onContentSizeChange = (contentWidth, contentHeight) => {
      this.setState({ screenHeight: contentHeight });
    };
    proceedtoDeliver=()=>{
      if(credit_note>0){
      Alert.alert(
        //title
        'Confirmation',
        //body
        'Amount will be adjusted with the Credit Amount available in your account.Press Yes to proceed with credits.',
        [
          { text: 'Yes', onPress: () =>this.props.navigation.navigate('OrderInvoice',{array:this.state.mainData,credit_note:credit_note,accountid:this.state.activecustomer}) },
          { text: 'No', onPress: () => this.props.navigation.navigate('OrderInvoice',{array:this.state.mainData,credit_note:0,accountid:this.state.activecustomer}), style: 'cancel' },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      )
      }else{
        this.props.navigation.navigate('OrderInvoice',{array:this.state.mainData,credit_note:credit_note})
      }
      
    }
    gotoNextScreen=()=>{
      const filterarray=this.state.mainData.filter(item=>item.checked=="1")
      if(filterarray.length==0){
        Alert.alert("Message","Please choose the orders before confirming your delivery.");
        return;
      }else{
        Alert.alert(
          //title
          'Confirmation',
          //body
          'Only selected Orders will be Delivered.Do you wish to continue?',
          [
            { text: 'Yes', onPress: () => this.proceedtoDeliver() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        )
      
      
        }
     
    }
    getstoredetailsforStore(storename){
   
      let stores= commonData.getstoresArray();
      console.log(store.credit_note),"***********credit_note";
   
      const store=stores.filter(item=>item.name==storename);
      return store.credit_note;
    }
    render() {
      this.state.searchmsg=this.state.mainData.length+' Results'
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > 100;
        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
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
              <Text style={{ marginTop:10, color: '#011A90',backgroundColor:'#FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:17,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Assigned Orders</Text>
              <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
              <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
              </TouchableOpacity>
              </View> 
              <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 
              <TextInput  placeholder="Enter Order #" 
              onChangeText={text => this.searchFilterFunction(text)}
              autoCorrect={false}
              value={this.state.value}
              style={{marginHorizontal:10, 
              width:width-150,
              height:50,
              color: '#534F64',
              borderWidth: 1,
              borderRadius:10,
              borderColor: '#CAD0D6',
              fontFamily:'Lato-Regular',
              marginTop: 10,
              textAlign:'center'}}></TextInput>
              <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5, marginHorizontal:5,
              shadowRadius: 2,borderRadius:10,
              elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
              <Text style={styles.textSign}>Clear</Text>
              </TouchableOpacity>  
              </View>
              <View style={{backgroundColor:'#FFFFFF',height:40,width:width-40, flexDirection:"row",alignSelf:'center'}}>

              <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,fontWeight:"500",flex:0.4}}>{this.state.searchmsg}</Text>
              <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,fontWeight:"500",flex:0.6,textAlign:'right'}}>Credits: ₹{credit_note}</Text>

              </View>
              <View style={{flexGrow:1,marginTop:0,height:450}}>
              <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
              contentContainerStyle={styles.scrollview}
              scrollEnabled={scrollEnabled}
              onContentSizeChange={this.onContentSizeChange}>
              <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-310}}>
              <FlatList
              data={this.state.mainData}
              renderItem={this.sampleRenderItem}
              extraData={this.state.refresh}
              keyExtractor={(item, index) => toString(index,item)}
              ItemSeparatorComponent={this.renderSeparator} 
              />
              </View>
              </ScrollView>
              </View>
              <View style={{flexGrow:1,marginBottom:10,height:90}}>
              <Text style={{fontFamily:'Lato-Regular',fontSize:10,alignSelf:'center',width:width-60}}>I hereby agree to deliver only the orders that are selected and the remaining orders will be collected later.</Text>
              <TouchableOpacity
              style={styles.ProceedbuttonStyle}
              onPress={() => this.gotoNextScreen()}>
              <Text style={{color:'#011A90',fontFamily:'Lato-Bold',alignSelf:'center'}}>Confirm Delivery</Text>
              </TouchableOpacity>
              </View>
          </SafeAreaView>
        );
    }

selectme=(itemdetails)=>{
  let checked=false;
  let temparray=[...this.state.mainData];
  let temparray1=[...this.state.mainData];
  var index = temparray.indexOf(itemdetails,0);
  value=temparray[index].checked;
if(value=="1")
{
  temparray.splice(index,1);
  itemdetails.checked="0";
  checked=false;
  this.state.checkedvalue=false;
  
}else{
  temparray.splice(index,1);
  itemdetails.checked="1";
  checked=true;
}
this.state.mainData=[];
var temparray3=[];
for(var t=0;t<temparray1.length;t++){
if(t!=index){
  this.state.activecustomer=temparray1[t].customerid;
  temparray3.push({'orderid': temparray1[t].orderid,
'id': temparray1[t].id,
'record': temparray1[t].record,
'orderstatus':temparray1[t].orderstatus,
'type':temparray1[t].type,
'totalvalue':temparray1[t].totalvalue,
'date_modified':temparray1[t].date_modified,
 'aknowledgementnumber':temparray1[t].aknowledgementnumber,
 'customerid':temparray1[t].customerid,
 'po_number':temparray1[t].po_number,
 'comments':temparray1[t].comments,
 'location':temparray1[t].location,
 'totalitems':temparray1[t].totalitems,
 'checked':temparray1[t].checked,
 'name':temparray1[t].name,
 'total_amount':temparray1[t].total_amount,
 'subtotal_amount':temparray1[t].subtotal_amount,
 'discount_amount':temparray1[t].discount_amount,
 'tax_amount':temparray1[t].tax_amount,
 'shipping_amount':temparray1[t].shipping_amount,
 'total_amount_word':temparray1[t].total_amount_word,
 'delivered_date':temparray1[t].delivered_date,
'last_modified':temparray1[t].last_modified})
}else{
  this.state.activecustomer=itemdetails.customerid;
  temparray3.push({'orderid': itemdetails.orderid,
'id': itemdetails.id,
'record': itemdetails.record,
'orderstatus':itemdetails.orderstatus,
'type':itemdetails.type,
'name':itemdetails.name,
'totalvalue':itemdetails.totalvalue,
'date_modified':itemdetails.date_modified,
 'aknowledgementnumber':itemdetails.aknowledgementnumber,
 'customerid':itemdetails.customerid,
 'po_number':itemdetails.po_number,
 'comments':itemdetails.comments,
 'location':itemdetails.location,
 'totalitems':itemdetails.totalitems,
 'checked':itemdetails.checked,
 'total_amount':itemdetails.total_amount,
 'subtotal_amount':itemdetails.subtotal_amount,
 'discount_amount':itemdetails.discount_amount,
 'tax_amount':itemdetails.tax_amount,
 'shipping_amount':itemdetails.shipping_amount,
 'total_amount_word':itemdetails.total_amount_word,
 'delivered_date':itemdetails.delivered_date,
'last_modified':itemdetails.last_modified})
}
}
this.state.mainData=[];
this.state.mainData=temparray3;
console.log("Maindataaaaaaaaa",this.state.mainData);
  this.forceUpdate();
  return checked;
}

sampleRenderItem = ({ item,index }) => (                                                    
      
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
   
            <View style={{alignItems:'flex-start',justifyContent:'center'}}>
            <View style={{width:width-20, flexDirection:'row',alignItems:'center'}}>
            <Text style={{marginHorizontal:0,marginTop:0,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500",width:width-100}}>{item.name}</Text>
            {item.checked=="1"?
             <CheckBox
             style={{margintop:20,marginHorizontal:0,height:20}}
             disabled={false}
             value={true}
             onValueChange={(newValue) => this.selectme(item)}
           />
           :
           <CheckBox
             disabled={false}
                style={{margintop:20,marginHorizontal:0}}
             value={false}
             onValueChange={(newValue) => this.selectme(item)}
           />
              }
            </View>
             <View style={{flexDirection:'row',height:10,width:width-20,alignSelf:'center'}}>
             <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:0}} />
             <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)} style={{height:20,paddingLeft:190,margintop:50}}><Image transition={false} source={require('../components1/images/invoice.png')} style={{width:20,height:20}}></Image></TouchableOpacity>
             </View>
            <Text style={{marginHorizontal:30-width,width:20,height:10,borderRadius:10, backgroundColor: '#011A90',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}></Text>

    <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20,fontWeight:"500"}}></Text>
    <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-10,fontWeight:"500"}}>{item.last_modified}</Text>
     
   
      <View style={{flexDirection:'row',width:width-40,height:20}}>
    
      <Text style={{marginHorizontal:0, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total SKUs: {item.totalitems}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total price: {Number(item.totalvalue)}</Text>
    
      </View>
      
    </View>
    
    </View>
 </ImageBackground>
 </View>
  
// </TouchableOpacity>
      
    )
}

export default pendingdelivery;

const styles=StyleSheet.create({
  scrollview:{
    // flexGrow:1,
    // height:height-480
    // justifyContent: "space-between",
    // padding: 10,
  },
    flatliststyle: {
    marginTop: 10,
    height: 90,
    width:width+50,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    marginVertical: 0,
    resizeMode:"contain"
    },
    flatrecord: {
      height: 120,
      width:width+50,
      backgroundColor:'#FFFFFF' ,
      alignSelf:'center',
      resizeMode:"contain"
      },
    image: {
        height: 30,
        width: 30,
        marginHorizontal: 30,
        marginTop: 30,
        resizeMode: 'contain'

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
        marginTop: 10,marginBottom:10

    },
      textSignplus: {
          color: '#011A90',
          fontWeight: 'bold',
          fontSize:27,
          fontFamily:'Lato-Bold'
        },
})