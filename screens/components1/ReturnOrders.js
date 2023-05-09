
import React, { Component } from 'react';
import { Text, View,Keyboard,StyleSheet,Dimensions,ImageBackground,Image,TextInput,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from './CommonDataManager';
import { Icon } from 'react-native-elements';
import {AccordionList} from "accordion-collapse-react-native";
import { Row, Separator } from 'native-base';
// import {default as UUID} from "uuid";
import uuid from 'react-native-uuid';
var orderid=[]
const Constants = require('./Constants');
import LinearGradient from 'react-native-linear-gradient';
const GET_DATAURL=Constants.GET_URL;
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
var RNFS = require('react-native-fs');
import { Card } from 'native-base'
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';

let commonData = CommonDataManager.getInstance();
let orderArray=[];
class ReturnOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {     
          list:[],  
        value:"",
        isLoading: false,
        data: [],
        error: null,
        mainData :[],
        orderitemlist:[],
        screenHeight: height,
        searchmsg:''
    }
    this.synccall=this.synccall.bind(this);
    this.arrayholder = [];
    }
   async componentDidMount() {
 
      const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      let orderarray=commonData.getordderssArray();
      let returnarray=this.props.navigation.getParam('returnarray',[])

      this.setState({list:returnarray,mainData:returnarray});
      this.arrayholder=returnarray;
      console.log(this.arrayholder,'++++++hxcgh+++++++++')
      this.state.searchmsg=''
    });
   
    }
  
  _head(item){
    return(
        <Separator bordered style={{alignItems:'center',height:60}}>
          <Text>{item.title}</Text>
        </Separator>
    );
}

_body(item){
    return (
     
        <View style={{padding:10}}>
       <Text style={{textAlign:'center'}}>{item[0].name}</Text>
        </View>
    );
}
componentWillMount(){
  // this.synccall();
}
    searchFilterFunction = (text) => {  
       this.state.searchmsg=''
      this.setState({
        value: text,
      });
       if(text.length==0){
        // this.setState({ list: this.arrayholder}); 
        this.synccall();
        Keyboard.dismiss();
        return;
       }
            
      const newData = this.state.mainData.filter(item => {      
        const itemData = `${item.order.name.toUpperCase()}${item.order.shipping_address_street.toUpperCase()}${item.order.total_amt.toUpperCase()}${item.id.toUpperCase()}${item.productcount}`;
       
         const textData = text.toUpperCase();
          
         return itemData.indexOf(textData) > -1;    
      });
      console.log("NEWDATA",this.state.mainData);
      this.setState({ list: newData }); 
      this.forceUpdate();
     
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
    this.props.navigation.navigate('OrderListdetail',{orderid:item.orderid,code:'OD',status:item.orderstatus})
    else
    Alert.alert("Error","No network, Please check your internet connection")
  
}
 synccall(){
  let variable=commonData.getusername();
  var myHeaders = new Headers();
  var that = this;


  myHeaders.append("Cookie", "sugar_user_theme=SuiteP");

  var raw = "{\n    \"__accountid__\":\""+commonData.getaccountid()+"\",\n\"__username__\":\""+variable+"\"}";


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://dev.ordo.primesophic.com/get_orders.php", requestOptions)
  .then(response => response.json())
  .then(result =>{ 
    
    let listarray=[];
    that.state.list=[];
  for(var i=0;i<result.length;i++){
   if(result[i].products_array!== undefined && result[i].products_array.length>0)
   {
   
    listarray.push({id:result[i].number,title:result[i].name,products:result[i].products_array,order:result[i],productcount:result[i].products_array.length});
   }
  }
  const filterarray=listarray.filter(item=>item.productcount>0);
  that.state.list=[...filterarray];
  that.state.mainData=[...filterarray];
  that.arrayholder=[...filterarray];
  that.forceUpdate();
  })
  .catch(error => console.log('error', error));
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
              "stage":"Return"
            }
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {

    console.log("Return status Updated",result);
    that.setState({isloading:false});

  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
  
}
// sendReturnFunction=()=>{
//   var that =this;
//   for (var i = 0; i < that.state.arrayHolder.length; i++) {
  
//   var rid= that.state.arrayHolder[i].rid;
//   console.log("return parent",that.state.arrayHolder[i]);
//   that.updatethestatusReturn(that.state.arrayHolder[i].orderid);
// console.log("return orderid",that.state.arrayHolder[i].orderid)
//   that.setState({  isloading: true });
//   var url ="http://143.110.178.47/OrdoCRM7126/set_data_s.php";
//      fetch(url, {
//     method: 'POST',
//     body: JSON.stringify({
//       "__module_code__": "PO_18",
//             "query":"id='"+rid+"'",
//             "__name_value_list__":{
//              "id":rid,
//               "returned":1,
//             }
//     })
//   }).then(function (response) {
//     return response.json();
//   }).then(function (result) {

//     console.log("Return Updated",result);
//     that.setState({isloading:false});

//   }).catch(function (error) {
//     console.log("-------- error ------- " + error);
//   });
//   }
// }
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
commonData.isOrderOpen=true
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
   getReturnItems=(order)=>{
     console.log("*********",order.order.id)
     let itemarray=[]
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "sugar_user_theme=SuiteP");
    
    var raw = JSON.stringify({
      "__orderid__": order.order.id
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://dev.ordo.primesophic.com/return_order.php", requestOptions)
      .then(response => response.json())
      .then(result =>{ console.log(result);
      for(var i=0;i<result.length;i++){
        itemarray.push({itemid:result[i].part_number,qty:result[i].returnable_qunatity,orderid:order.order.id,rid:result[i].id})

            }
            if(itemarray.length==0){
              Alert.alert("Message","Order is not returnable");
              return;
            }
            
            
            
               var OrderHistoryArray=[];
                OrderHistoryArray=[...itemarray];
                  commonData.setArray(OrderHistoryArray);
                  this.props.navigation.navigate('OrderItem',{"IT":itemarray," From":'RETURN','TYPE':"RETURN"})
                  commonData.isOrderOpen=true;
            
                })
      .catch(error => console.log('error', error));




   }
    render() {
      this.state.searchmsg=this.state.mainData.length+' Results'
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > height;
        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
              <ActivityIndicator />
               <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Loading Orders , Please wait</Text>

                </View>
            );
        }
        return (
          <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
      
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:17,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Return Order</Text>
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
                     
              <Text style={styles.cleartyle}>Clear</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            
                    </TouchableOpacity>  
                    
        </View>
        <View style={{backgroundColor:'#FFFFFF',height:40,marginLeft:20, flexDirection:"column"}}>
               {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}></Text> */}
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20,fontWeight:"500"}}>{this.state.searchmsg}</Text>
        </View>
   
                <View style={{flexGrow:1,marginTop:-10,height:90}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:-10,height:height-200}}>
                    <FlatList
                        data={this.state.list}
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
    sampleRenderItem = ({ item }) => (
      

               
<TouchableOpacity  style={{ width:width-40,alignContent:'center',alignSelf:'center'}} onPress={()=>this.getReturnItems(item)}>
<Card 
style={[styles.signIn,styles.shadowProp]}>
<View style={{width:width-40 , flexDirection:'row'}}>
  <View style={{marginTop:15,width:50}}>
<Image source={require('../components1/images/invoice2.png')} style={{ height: 40, width: 40,resizeMode: 'contain' ,borderRadius:40}} />
</View>
<View style={{flexDirection:'column'}}>
<Text style={{fontFamily:"Lato-Bold",color:"#011A90",fontSize:14,fontWeight:'600'}}>{item.order.name}</Text>
<Text>Invoice# : {item.id}</Text>
<Text><Text style={{fontFamily:"Lato-Bold"}}>Amount(₹) : </Text>{Number(item.order.total_amt).toFixed(2)}{'\t\t\t\t'} <Text style={{fontFamily:"Lato-Bold"}}>SKU's :</Text> {Number(item.productcount)}</Text>
<Text style={{fontSize:12,fontFamily:"Lato-regular" ,color:'#011A90'}}>Delivered to : {item.order.shipping_address_street}</Text>
</View>
</View>
</Card>
</TouchableOpacity>
// </View>
      
    )
    sampleRenderItem1 = ({ item }) => (
      
      <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row", width:70}}>
            <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
                <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
            </TouchableOpacity>
            
            <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.type}</Text>
            <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:80}}>
              {(item.orderid!=undefined)?
            <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.orderid.substring(1, 8)}</Text>:
             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}></Text>}
            <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />
           <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>{item.last_modified}</Text>
     
    <TouchableOpacity style={{height: 60, width: 60,marginHorizontal:139,marginTop: -40, flexDirection:'row',alignItems:'center'}} onPress={()=>{this.getOrderItemListCall(item.orderid,item.type)}}>
       <Text style={{width:60,fontFamily:'Lato-Regular', color:'#011A90',height:60,textAlign:'center',textDecorationLine: 'underline',textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10}}>Repeat</Text>
      </TouchableOpacity>
      <Text style={{marginHorizontal:-10, color: '#011A90',fontFamily:'Lato-Bold',fontSize:14,marginTop:-10}}>{item.customerid}</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total SKUs: {item.totalitems}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total price: {Number(item.totalvalue)}</Text>
      </View>
    </View>
    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>
      
    )
}

export default ReturnOrders;

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
      height: 60,
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
      width: width-20,
      height: 100,
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
      marginTop:10,
      width:width-10
      },
      signInplus: {
        width: width-10,
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
    
      cleartyle:{
        color: '#011A90',
        fontWeight: 'bold',
        fontFamily:'Lato-Bold',
        alignSelf:'center',
        marginTop:10
      },
      textSignplus: {
          color: '#011A90',
          fontWeight: 'bold',
          fontSize:27,
          fontFamily:'Lato-Bold'
        },
})