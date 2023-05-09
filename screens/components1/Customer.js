import React from "react";
import { StyleSheet,Keyboard, ActivityIndicator,SafeAreaView, StatusBar,TextInput, View, ScrollView, Dimensions ,Text,FlatList,Image,TouchableOpacity,Alert,ImageBackground} from "react-native";
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
// import {default as UUID} from "uuid";
import uuid from 'react-native-uuid';
// import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
var storepath = RNFS.DocumentDirectoryPath + '/storesOffline.json';
let commonData = CommonDataManager.getInstance();
var storeData=commonData.getstoresArray()
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
import Orderlist from "./OrderList";
const GET_DATAURL= Constants.GET_URL;
const GET_HISTORY= Constants.GET_HISTORY_URL;
const GET_RETURNS=Constants.GET_RETURN_URL;
let OrderHistoryArray=[]
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
let calculatedArray=[]

export default class Customer extends React.Component {
   imgloc = "http://143.110.178.47/OrdoCRM7126/upload/3d761755-7c00-4a74-b345-6311a741f25f_img_src_c";
constructor(props)
{
  super(props);
    this.getorderitems=this.getorderitems.bind(this);
    this.connection_Status="ONLINE"
    this.state = {
      mainData :[],
      loading: false,
      refreshing:false,
      data: [],
      value:"",
      screenHeight: height,
      searchmsg:'',
    };
    this.arrayholder = [];
    this.searchBar
}
componentDidMount() {
  var storeData=commonData.getstoresArray()
  this.setState({ data:storeData });
  this.arrayholder = storeData;
  const { navigation } = this.props;
  this.focusListener = navigation.addListener("didFocus", () => {
    this.connection_Status="ONLINE"
    this.checknetwork();
     this.getListCall();
    });
}
checknetwork(){

this.connection_Status ="ONLINE"
}


resetHandler(){

}
getListCall() {
  this.state.value=''
  this.state.searchmsg=''
  storeData=commonData.getstoresArray()
  //Sort by Customer ID
  storeData.sort((a, b) => (a.storeid > b.storeid) ? 1 : -1)
  this.setState({ data:storeData });
  this.forceUpdate();
}
searchFilterFunction = (text) => {  
  this.state.searchmsg=''
  this.setState({
    value: text,
  });
  if(text.length<=0){
    var storeData=commonData.getstoresArray()
    this.setState({ data:storeData });
    Keyboard.dismiss()
    return
} 
  const newData = this.state.data.filter(item => {      
    const itemData = `${item.storeid.toUpperCase()} ${item.addressline2.toUpperCase()} ${item.postalcode.toUpperCase()} ${item.name.toUpperCase()}`;
   
     const textData = text.toUpperCase();
      
     return itemData.indexOf(textData) > -1;    
  });
  console.log(this.state.data,"my stores");
  this.setState({ data: newData });  
  this.forceUpdate();
};

ArrowForwardClick = () => {
  Alert.alert('Loading soon ');
};
onClickListener = viewId => {
  alert("clear")
  this.getdetails();
};
renderComp=(value)=>{
  
}
synccall(){
  this.loadstore();
  this.readstoreDetails();
}


  async getorderitems(result){
    let totalqty=0;
    let qtyvalue=0
    let  orderList=[]
    var that = this;
    if(result.entry_list.length==0){
      Alert.alert("Warning",'No orders for the Selected Customer.')
      Keyboard.dismiss()
      that.state.loading=false
      that.forceUpdate()
      return;
    }
       for(var i=0;i<result.entry_list.length;i++)
      {
        
        orderList.push(result.entry_list[i].name_value_list.id.value)
        
      }
    if(orderList.length>0){
      for(var i=0;i<orderList.length;i++){
     fetch(GET_DATAURL, { 
       method: "POST",
                body: JSON.stringify({
                  __module_code__: "PO_18",
                  __session_id__:commonData.getsessionId(),
                  __query__:"parent_id='"+ orderList[i]+"'",
                    __offset__:0,
                })
       
    }).then(function (response) {
     return response.json();   
   }).then(function (result) {
      console.log("oooooooooooo",result.entry_list)
      let len= orderList.length
      totalqty=0
     for(var j=0;j<result.entry_list.length;j++){
       calculatedArray.push({"itemid":result.entry_list[j].name_value_list.part_number.value,"qty":result.entry_list[j].name_value_list.product_qty.value})
     if(that.itempresentinArray(result.entry_list[j].name_value_list.part_number.value)===-1){
        OrderHistoryArray.push({'itemid':result.entry_list[j].name_value_list.part_number.value,'qty':totalqty})
      }
     }
    
    if(result.entry_list.length>0 && result.entry_list[0].name_value_list.parent_id.value==orderList[len-1]){
      
      commonData.setorderitemArray(OrderHistoryArray)
      that.state.loading=false
      commonData.setContext("HISTORY");
      that.props.navigation.navigate('HistoryDetails',{IT:OrderHistoryArray, From:'HISTORY'})
    }
 
  
   }).catch(function (error) {
     console.log("-------- error ------- " + error);
   });
      }
    }
  
  }

 OrderCreatefunction=(item)=>{
  commonData.isOrderOpen=true;
  var val= uuid.v4();
  commonData.setOrderId(val);
  
  // var address=item.addressline1+','+item.addressline1+','+ item.state+","+item.country+'-'+item.postalcode;
  var address=[];
  address[0]=item.addressline1
  address[1]=item.state
  address[2]=item.country
  address[3]=item.postalcode
  commonData.setCustInfo(item.storeid,item.name);
  commonData.setActiveAddress(address);
  commonData.setaccountid(item.id);
  commonData.setContext('OG');
  this.props.navigation.navigate('OrderGuide',{ From: '',TYPE:"OG" }) ;
 }
  GoToNextScreen=(item) =>{
   
    commonData.setdueamount(item.due_amount_c);

    if(item.id==commonData.getaccountid()&& commonData.isOrderOpen==true){
      Alert.alert("Warning","You have an existing orderguide open. ")
      Alert.alert(
        //title
        'Warning',
        //body
        'You have an existing orderguide open.Complete the transaction to continue',
        [
          { text: 'OK', style: 'cancel' },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      )
      return;
    }
    this.state.From=this.props.navigation.getParam("From",'')
    let TYPE =this.props.navigation.getParam("TYPE",'')
    commonData.setContext(TYPE);
   

    if(this.state.From=='HISTORY'){
      this.state.loading=true
        
          var val= uuid.v4();
          commonData.setOrderId(val)
          this.state.orderid=val
          this.state.id=val
          // var address=item.addressline1+','+item.state +'-'+item.postalcode
          var address=[];
  address[0]=item.addressline1
  address[1]=item.state
  address[2]=item.country
  address[3]=item.postalcode
  commonData.setCustInfo(item.storeid,item.name);
  commonData.setActiveAddress(address);
          commonData.setaccountid(item.id);
          finishedGettingItems=false
          this.getOrderListCall(item.id)
      
          this.checknetwork();
          
          this.forceUpdate()
    }
    else if(TYPE=="RETURN"){
    
     
      var val= uuid.v4();
      commonData.setOrderId(val)
      this.state.orderid=val
      this.state.id=val
      var address=[];
  address[0]=item.addressline1
  address[1]=item.state
  address[2]=item.country
  address[3]=item.postalcode
      // var address=item.addressline1+','+item.state +'-'+item.postalcode
      commonData.setCustInfo(item.storeid,item.name);
      commonData.setActiveAddress(address);
            commonData.setaccountid(item.id);
      finishedGettingItems=false
      this.getreturnList(item.id);
      commonData.setcustomerName(item.storeid);
      
      // this.getOrderListCall(item.id)
      commonData.setemail(item.email);
     
    }else if(this.state.From=="OG"){
      if(commonData.isOrderOpen==false){
       this.OrderCreatefunction(item,"NEW");
      }

      else{
          Alert.alert(
              //title
              'Warning',
              //body
              'You have an existing orderguide open.Complete the transaction to continue',
              [
                { text: 'OK', style: 'cancel' },
              ],
              { cancelable: false }
              //clicking out side of alert will not cancel
            )
      }
     

    }
    else{
      commonData.setemail(item.email);
      commonData.setaccountid(item.id)
      let TYPE=this.props.navigation.getParam('TYPE','');
      commonData.setcustomerName(item.name);

      var address=[];
  address[0]=item.addressline1
  address[1]=item.state
  address[2]=item.country
  address[3]=item.postalcode
      // var address=item.addressline1+','+item.state +'-'+item.postalcode
      commonData.setCustInfo(item.storeid,item.name);
      commonData.setActiveAddress(address);
            commonData.setaccountid(item.id);

      this.props.navigation.navigate('CreateOrder', {
        Id:item.id,
        storeID: item.storeid,
        name: item.name,
        imageLoc: item.image1,
        address:item.addressline1,
        city: item.addressline2,
        Place: item.state+" "+item.country,
        ZIP: item.postalcode,
        "TYPE":TYPE ,
        creditlimit:item.creditlimit,
        lastpaymentdate:"",
        lastsaleamount:0,
        lastsaledate:"",
        due_amount_c:item.due_amount_c,
        ispaymentdue:item.ispaymentdue,
      })
    }
  }
readstoreDetails(){
  console.log("writting to store json file.......................")
    RNFS.readFile(storepath, 'utf8')
    .then((contents) => {
      // log the file contents
      // contentstr=contents
      console.log(contents);
      console.log("cvbnkjhgfdfghjkjhgfdsfgh")
      console.log("Json_parse");
      console.log(JSON.parse(contents));
      var tempArray = commonData.gettypeArray(contents,'PO_19');
      let variable=commonData.getusername();
        
       let filtertemparray= tempArray.filter(item=>item.owner==variable);
       if(variable=="admin")
       filtertemparray=tempArray;
      commonData.setstoresArray(filtertemparray)
      this.setState({ data:filtertemparray });
      console.log("after json parse")
      console.log("here is our temparary data")
      console.log("temparay array")
      console.log(tempArray);
      // here we are getting contents from the json and passisng that contents to the function and try to retrieve it .
      // commonData.setstoresArray(tempArray)
      this.state.loading=false
      that.forceUpdate();
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}

loadstore(){

var uid=commonData.getuid();
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = "{\n    \"__module_code__\": \"PO_19\",\"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

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
.then(result => {
  console.log("this data which come from the server...........................")
  console.log(result.entry_list)
  // write the file
  console.log("contents are there...")
  var json = JSON.stringify(result.entry_list);
  console.log(json, "this is for storing list array")
  RNFS.writeFile(storepath, json, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
 
     that.setState({
      mainData: result.entry_list,
      JSONResult: result.entry_list,
      loading: false,
      refreshing:false
    });
 
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

onContentSizeChange = (contentWidth, contentHeight) => {
  this.setState({ screenHeight: contentHeight });
};

handleRefresh=()=>{
  this.setState({
      refreshing:true,
  })
}
itempresentinArray(item){
var index =-1
for(var i=0;i<OrderHistoryArray.length;i++){
  if(item==OrderHistoryArray[i].itemid){
    index = i;
    break;
  }
}
return index
}

async getreturnList(resultval){

  OrderHistoryArray=[]
  let orderList=[]
   var that = this;
   let variable=commonData.getusername();
   var myHeaders = new Headers();
   var that = this;
 
 
   myHeaders.append("Cookie", "sugar_user_theme=SuiteP");
 
   var raw = "{\n    \"__accountid__\":\""+resultval+"\",\n\"__username__\":\""+variable+"\"}";
 console.log("raw*******",raw);
 
 var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
 };
 
 fetch("https://dev.ordo.primesophic.com/get_orders.php", requestOptions)
   .then(response => response.json())
   .then(result =>{ 
     console.log(result)
      let listarray=[];

 for(var i=0;i<result.length;i++){
  if(result[i].products_array!== undefined && result[i].products_array.length>0)
  {
  
   listarray.push({id:result[i].number,title:result[i].name,products:result[i].products_array,order:result[i],productcount:result[i].products_array.length});
  }
 }
 const filterarray=listarray.filter(item=>item.productcount>0);
   if(filterarray.length<=0){
    Alert.alert("Warning","There are no previously booked orders to return.");
    commonData.isOrderOpen=false
  
    commonData.setOrderId("")
    commonData.setCustInfo("","");
    commonData.setActiveAddress("");
    commonData.setaccountid("");
    commonData.setcustomerName("");
    commonData.setemail();
   return;
    
    
  }
  that.setState({loading:false});
  that.forceUpdate();
  OrderHistoryArray=[];
  OrderHistoryArray=[...listarray];
    
     that.props.navigation.navigate('ReturnOrders',{returnarray:listarray});
    return;

   })
   .catch(error => console.log('error', error));
 
     
 
}
async getOrderListCall(storeid){
  var that = this;
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "__accountid__": storeid
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://143.110.178.47/OrdoCRM7126/order_from_history.php", requestOptions)
  .then(response => response.json())
  .then(result => {console.log(result)
  
    for(var j=0;j<result.length;j++){
      calculatedArray.push({"itemid":result[j].part_number,"qty":1})
    if(that.itempresentinArray(result[j].part_number)===-1){
       OrderHistoryArray.push({'itemid':result[j].part_number,'qty':1})
     }
    }
   
     
     commonData.setorderitemArray(OrderHistoryArray)
     that.state.loading=false
     commonData.setContext("HISTORY");
     that.props.navigation.navigate('HistoryDetails',{IT:OrderHistoryArray, From:'HISTORY'})
   

  })
  .catch(error => console.log('error', error));
}





  render() {
    const { search } = this.state.value;
    
    const scrollEnabled = this.state.screenHeight > height;
    this.state.searchmsg=this.state.data.length+' Results'
    let TYPE =this.props.navigation.getParam("TYPE",'')
    var msg="Select Your Store to Place the Order";
    if(TYPE=="RETURN")
    msg="Select Your Store to Place the Return";
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
          <ActivityIndicator />
          <Text style={{fontFamily:'Lato-Bold'}}>Loading Stores, Please wait.</Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
       
      <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:'#FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Stores</Text>
            <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
             <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
            </TouchableOpacity>
      </View> 
 
      <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%',marginTop:5}}> 
                <TextInput  placeholder="Enter the store# or Name" 
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
                style={{marginHorizontal:10, 
                  width:width-150,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    borderRadius:10,
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
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
                   {/* <TouchableOpacity style={{height: 60, width: 100}} onPress={() => this.searchFilterFunction('')}>
                     <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} />
                    </TouchableOpacity>   */}
        </View>
        <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>{msg}</Text>
        <Text style={{marginTop:5,marginHorizontal:30,fontFamily:'Lato-Bold',color:'black'}}>{this.state.searchmsg}</Text>
        
                 <View style={{flexGrow:1,marginTop:0,height:610}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-270}}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
      </SafeAreaView>
  );
  
}
componentWillMount(){
  this.setState({loading:false});
}
componentWillUnmount(){
  this.resetHandler()
}
sampleRenderItem1 = ({ item, index }) => (
        
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
    <TouchableOpacity style={{height: 100, width: 100,marginHorizontal:19,marginTop:27}} >
        <Image transition={false} source={iem.image} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
        <Text  style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular',width:100,textAlign:'center'}}>{item.storeid}</Text>
    </TouchableOpacity>
     </View>
    <View style={{marginHorizontal:20,flexDirection:'column'}}>
    <Text style={{color:'#7A7F85',borderBottomColor:'#011A90',fontFamily:'Lato-Bold',marginTop:23}}>{item.name}</Text>
      <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,width:190}}>{item.addressline2}</Text>
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,width:190}}>{item.addressline2}</Text>
      <Text style={{fontFamily:'Lato-Bold',color:'black'}}>{item.state}</Text>
      <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontSize:12}}>{item.postalcode}</Text>
   
        </View>
    </View>
 </ImageBackground>
 </View>
    
   
)

sampleRenderItem = ({ item, index }) => (
  <TouchableOpacity
           onPress={() =>this.GoToNextScreen(item)
            
          }>     
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row"}}>
    <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39,marginTop:27}}>
        <Image transition={false} source={{uri:item.image1}} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:0, resizeMode: 'contain' }} />
    </TouchableOpacity>
    <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-110,fontSize:13}}>{item.storeid}</Text>
    <Image transition={false} source={require('../components1/images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:95, resizeMode: 'contain' }} />
    </View>
    <View style={{marginHorizontal:-110,}}>
      <Text style={{color:'#011A90',borderBottomColor:'#7A7F85',fontFamily:'Lato-Bold',marginTop:23}}>{item.name}</Text>
      <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
      {/* <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.addressline2}</Text> */}
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.addressline1}</Text>

      {/* <Text style={{fontFamily:'Lato-Bold'}}>{item.country}</Text> */}
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.postalcode}</Text>
    </View>
    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>

)
}



const styles = StyleSheet.create({
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
      shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      textSignplus: {
          color: '#011A90',
          fontWeight: 'bold',
          fontSize:27,
          fontFamily:'Lato-Bold'
        },
});