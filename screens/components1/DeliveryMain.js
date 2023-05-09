import React from "react";
import { Component } from "react";
import { View,FlatList,Keyboard,Alert,TextInput,ImageBackground,SafeAreaView,Text,StyleSheet ,Dimensions,Image,TouchableOpacity,ActivityIndicator,ScrollView} from "react-native";
import { Card } from "native-base";
import Icon from 'react-native-vector-icons/Ionicons'; 
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
const Constants = require('../components1/Constants');
const GET_DATAURL=Constants.GET_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';

import Timeline from 'react-native-timeline-flatlist'
import Toast from 'react-native-simple-toast';

class DeliveryMain extends Component{
   constructor(props) {
      super(props);
      this.renderDetail = this.renderDetail.bind(this)

    this.data = [],
      this.state={
         pastorders:[],
         pendingorders:[],
         isLoading:false,
         ispastdeliverypressed:false,
         isprevdeliveryPressed:false,
         screenHeight:height,
         loadingorders:false,
         arrayholder:[],
         pending:false,
         completed: false,pendingcolor:"#011A90",

         completedcolor:"#A0A0A0"
      }
   }
    //execute callback in order to stop the refresh animation. 
  _onRefresh = (callback) => {
   this.getpendingOrders();
 } 
 gettotalitems=(custid,array)=>{
   var count=0;
   for(var i=0;i<array.length;i++){
     if(array[i].customerid==custid)
     count++;
   }
   return count;
 }
   getpendingOrders(){
      // "__query__": "username='"+variable+"'",
      var uid=commonData.getUserID();
      console.log("sgavxgvash",uid);
      let variable=commonData.getusername();
     uid=uid._j;
      var that = this;
      that.setState({ isLoading: true,loadingorders:true });
      fetch(GET_DATAURL, {
        method: "POST",
        body: JSON.stringify({
          "__module_code__": "PO_17",
          "__query__": "",
          "__session_id__":commonData.getsessionId(),
          "__delete__": 0,
          "__orderby__": "date_entered DESC"
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        
       let  orderArray = result.entry_list;
       var json = JSON.stringify(orderArray);
       let tempArray = commonData.gettypeArray(json,'PO_D14')
       console.log("tempArray",tempArray);
       let pendingarray=tempArray.filter(item=>item.orderstatus=="Delivery Assigned");
       let pastarray=tempArray.filter(item=>item.orderstatus=="Delivered");
       
      //  let pastarray=tempArray.filter(item=>item.orderstatus=="DELIVERED");
       console.log("pending",pendingarray,pastarray);
       console.log("*********************************************************");
      
       var ordertemparray=[];
       const unique = [...new Set(pendingarray.map(item => item.customerid))];
        console.log(unique,"past");
        let counter =0;
       for(var i=0;i<unique.length;i++){
         var count=0;
        pendingarray.map(item=>{if(item.customerid==unique[i]) count++})
        ordertemparray.push({"time":i,title:unique[i],description:"Total Orders: "+count,lineColor:'#009688',icon: require('../components1/images/Customerimages/cust1.png'),imageUrl:""})

       }

       that.data=[];
       that.data=[...ordertemparray];
       
        that.setState({
          isLoading: false,
          pendingorders:pendingarray,
          pastorders:pastarray,
          arrayholder:pastarray,
          loadingorders:false
        });
       
        Toast.show('Orders Loaded', Toast.LONG)
      }).catch(function (error) {
        console.log("-------- error ------- " + error);
      });
      that.forceUpdate();
   }
   
   gotoOrderItemScreen(item){
   console.log("oid",item.orderid);
    this.props.navigation.navigate('ItemInvoice',{orderid:item.orderid,code:'OD'})

    
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
               __session_id__:commonData.getsessionId(),
               __query__:"parent_id='"+oid+"'",
                 __offset__:0,
             })
    
  }).then(function (response) {
return response.json();   
}).then(function (result) {

// that.props.navigation.navigate('ItemInvoice',{orderid:oid,code:'OD'})

});
}
   sampleRenderItem = ({ item }) => (
      
      <TouchableOpacity onPress={()=>this.gotoOrderItemScreen(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row", width:70}}>
            <TouchableOpacity style={{height: 180, width: 60,marginTop:20,marginHorizontal:45}}>
                <Image transition={false} source={require('../components1/images/right.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
            </TouchableOpacity>
            
            <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',fontSize:10,marginTop:100,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.orderstatus}</Text>
            <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:68, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:80}}>
              {(item.orderid!=undefined)?
            <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.orderid.substring(1, 8)}</Text>:
             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}></Text>}
            <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

    {/* <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12}}>₹{(item.value).split('.')[0]}.{(item.value).split('.')[1].substring(1, 2)}</Text> */}
    <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:-20,fontWeight:"500"}}></Text>
    <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:0,fontWeight:"500"}}>{item.date_modified}</Text>
     
   
      <Text style={{marginHorizontal:-10, color: '#011A90',fontFamily:'Lato-Bold',fontSize:14,marginTop:0}}>{item.customerid}</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total SKUs: {item.totalitems}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total price: {Number(item.totalvalue)}</Text>
      </View>
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>
      
    );
  onContentSizeChange = (contentWidth, contentHeight) => {
   this.setState({ screenHeight: contentHeight });
 };
 renderDetail(rowData, sectionID, rowID) {
  let title = <Text style={[styles.title]}>{rowData.title}</Text>
  var desc = null
  if(rowData.description)
    desc = (
      <View style={styles.descriptionContainer}>
        <Text style={[styles.textDescription]}>{rowData.description}</Text>
      </View>
    )

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate("pendingdelivery",{ custid: rowData.title,credit_note:rowData.credit_note}); this.getaddressfor(rowData.title)}}>
      {title}
      {desc}
      </TouchableOpacity>
    </View>
  )
}
   pastdeliverypressed(){
      this.state.ispastdeliverypressed=true;
      this.state.ispendingdeliveryPressed=false;
      this.forceUpdate();
      this.props.navigation.navigate('PastDelivery');
   }
   pendingdeliveryPressed(){
      this.state.ispastdeliverypressed=false;
      this.state.ispendingdeliveryPressed=true;
      this.getaddressfor(rowData.title)
      this.forceUpdate();
      this.props.navigation.navigate('pendingdelivery');

   }

  loadstore(){
 
  var uid=commonData.getuid();
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  // var raw = "{\n\"__module_code__\": \"PO_01\",\n\"__query__\": \"po_stores.po_ordousers_id_c='"+uid+"'\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}";
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
    var json = JSON.stringify(result.entry_list);

    var tempArray = commonData.gettypeArray(json,'PO_19');
  console.log("dxdfdfdf",tempArray);
  
    commonData.setstoresArray(tempArray)
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
   getaddressfor=(name)=>{
    
     var stores= commonData.getstoresArray();
  
     const filterdata=stores.filter(item=>item.name==name);
     if(filterdata.length>0){
      let address=[];
    
      address[0]=filterdata[0].addressline1
      address[1]=filterdata[0].state
      address[2]=filterdata[0].country
      address[3]=filterdata[0].postalcode
     commonData.setActiveAddress(address);
     commonData.setaccountid(filterdata[0].id)
     
     }
   }
   componentDidMount(){
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
    this.getpendingOrders();
    this.loadstore();
    this.setState({pending:true,completed:false})   
   }
   componentWillMount(){
    const { navigation } = this.props;

    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      this.getpendingOrders();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
      
    });

   
   }
   async reset(){
    await AsyncStorage.removeItem('isLogin')
    await AsyncStorage.removeItem('Username')
    await AsyncStorage.removeItem('ordoid')

   }
   logout=()=>{
   
    console.log("after output")
    this.reset();
    commonData.setusername('')
    clearInterval(5000*60);
    this.forceUpdate();
   
    this.props.navigation.navigate("LoginScreen")  
  }
  searchFilterFunction = (text) => {  
    this.state.searchmsg=''
   this.setState({
     value: text,
   });
    if(text.length==0){
     this.setState({ pastorders: this.state.arrayholder}); 
     Keyboard.dismiss();
     return;
    }
   const newData = this.state.pastorders.filter(item => {      
     const itemData = `${item.orderid.toUpperCase()}${item.orderstatus.toUpperCase()}${item.type.toUpperCase()}${item.customerid.toUpperCase()} ${item.totalitems.toUpperCase()}${item.last_modified.toUpperCase()}`;
    
      const textData = text.toUpperCase();
       
      return itemData.indexOf(textData) > -1;    
   });
   this.setState({ pastorders: newData }); 
  
  
 };
    render(){
     
      var message=this.data.length+" records"
      if(this.data.length==0)
      message="No pending Orders"
      const scrollEnabled = this.state.screenHeight > height;
       return( <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
       
                  <View style={{width:width,flex:0.1,flexDirection:'row',height:70,backgroundColor:'white',borderBottomColor:'grey',shadowColor:'000',shadowRadius:1}}>

                  <View style={{width:(width) ,flexDirection:'row',alignself:'center',alignitems:'center',backgroundColor: 'white',justifyContent:'center',marginTop:10}}>
                  <View style={{width:(width)/2-30,backgroundColor:'#ffffff'}}>
                  <Image transition={false} source={require('../components1/images/OrDo.png')} style={{ height:50,width:100,resizeMode:"cover" }} ></Image>
                  </View>
                  <View style={{width:(width)/2-30,flexDirection:'row-reverse',backgroundColor:'#ffffff',height:60}}>
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
                  <Image transition={false} source={require('./images/logout.png')} style={{ height: 20, width: 20 }}></Image>

                  </TouchableOpacity>
                  <TouchableOpacity style={{padding:10,height:40}} onPress={() =>this.getpendingOrders()}>
                  {/* <Icon name="md-sync" color='#011A90' size={20}/>   */}
                  <Image transition={false} source={require('./images/sync.png')} style={{ height: 20, width: 20 }}></Image>

                  </TouchableOpacity>
                  </View>



                  </View> 


                  </View>

                  <View style={{flexDirection:'row',width:width-10,justifyContent:'space-evenly'}}>
                  <TouchableOpacity style={{width:width/2-10,height:30, backgroundColor:'white',fontFamily:'Lato-Bold',borderColor:this.state.pendingcolor,borderWidth:2,borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0}} onPress={()=>{this.setState({pending:true,completed:false,completedcolor:"#A0A0A0",pendingcolor:'#011A90'});this.forceUpdate()}}><Text style={{color:this.state.pendingcolor,textAlignVertical:'center',height:30,textAlign:'center'}}>Assigned Deliveries</Text></TouchableOpacity>
                  <TouchableOpacity style={{width:width/2-10,height:30, backgroundColor:'white',fontFamily:'Lato-Bold',borderColor:this.state.completedcolor,borderWidth:2,borderRightWidth:0,borderTopWidth:0,borderLeftWidth:0}} onPress={()=>{this.setState({completed:true,pending:false,pendingcolor:'#A0A0A0',completedcolor:'#011A90'});this.forceUpdate()}}><Text style={{color:this.state.completedcolor,textAlignVertical:'center',height:30,textAlign:'center'}}>Completed Deliveries</Text></TouchableOpacity>
                  </View>

                  <View style={{marginTop:10,flex:0.8}}>
                  {this.state.pending==true?
                  <ScrollView tabLabel="Assigned Deliveries" >
                  <View style={{flexGrow:1,marginTop:10,height:500}}>

                  <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                  contentContainerStyle={styles.scrollview}
                  scrollEnabled={scrollEnabled}
                  onContentSizeChange={this.onContentSizeChange}>
                  <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:500}}>
                  <Text style={{fontFamily:"Lato-Regular",fontSize:12,width:width-60,alignSelf:'center',color:'black'}}>{message}</Text>
                  {
                  this.state.loadingorders==false?
                  <Timeline
                  data={this.data}
                  circleSize={20}
                  circleColor='#011A90'
                  innerCircle={'icon'}
                  lineColor='#011A90'
                  timeContainerStyle={{minWidth:0, marginTop: 0}}
                  timeStyle={{textAlign: 'center',width:0, borderColor:'#011A90',borderWidth:0, color:'#011A90',fontFamily:"Lato-Regular", borderRadius:13}}
                  descriptionStyle={{color:'gray'}}


                  isUsingFlatlist={true}
                  renderDetail={this.renderDetail}/>: <ActivityIndicator />
                  }
                  </View>
                  </ScrollView>
                  </View>
                  </ScrollView>:
                  <ScrollView tabLabel="Completed Deliveries" >
                  <View style={{flexGrow:1,marginTop:-10,height:500}}>
                  <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%',marginTop:5}}> 
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
                  <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                  contentContainerStyle={styles.scrollview}
                  scrollEnabled={scrollEnabled}
                  onContentSizeChange={this.onContentSizeChange}>
                  <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:-10,height:height-200}}>
                  <FlatList
                  data={this.state.pastorders}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  keyExtractor={(item, index) => toString(index,item)}
                  ItemSeparatorComponent={this.renderSeparator} 
                  />
                  </View>
                  </ScrollView>
                  </View>
                  </ScrollView>
                  }
                  </View>
                  <View style={{flex:0.1}}><Text style={{fontFamily:"Lato-Regular",fontSize:12,alignSelf:'center',width:width,textAlign:'center',color:'black'}}>©2023 PrimeSophic. All rights reserved.</Text></View>
        </SafeAreaView>);
    }

}
export default(DeliveryMain);
const styles=StyleSheet.create({
   scrollview:{
     // flexGrow:1,
     height:height-200
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
         fontFamily:'Lato-Bold'
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
         title:{
           color:"black",
           fontFamily:'Lato-Bold',
           fontWeight:"500",
           fontSize:14,
           marginTop:0
         },
          shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }, textSign: {
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
         textDescription:{
           color:"#a5a5a5",
           fontFamily:'Lato-Regular',
           fontSize:14
         }
 })