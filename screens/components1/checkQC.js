import React from "react";
import { Component } from "react";
import { View,FlatList,Keyboard,Alert,TextInput,ImageBackground,SafeAreaView,Text,StyleSheet ,Dimensions,Image,TouchableOpacity,ActivityIndicator,ScrollView} from "react-native";
import { Card } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
const Constants = require('../components1/Constants');
const GET_DATAURL=Constants.GET_URL;
import {ScrollableTabView} from '@valdio/react-native-scrollable-tabview'
import Timeline from 'react-native-timeline-flatlist'
import Toast from 'react-native-simple-toast';
import CheckBox from '@react-native-community/checkbox';
function uniqueByKey(array, key) {
  return [...new Map(array.map((x) => [x[key], x])).values()];
}
class checkQC extends Component{
   constructor(props) {
      super(props);
      this.renderDetail = this.renderDetail.bind(this)

    this.data = [],
      this.state={
        checklist:[{
            label:"Missing Logo,tag or warning label:",field:"list3",value:true
        },{
            label:"Wrong Product Size:",field:"list1",value:true
        },{
            label:"Missing Logo,tag or warning label:",field:"list3",value:true
        },{
            label:"The UPC label on the carton should match the PO information and scan correctly.:",field:"list4",value:true
        },{
            label:"Wrong or missing distributor details:",field:"list2",value:true
        },{
            label:"Proper packing:",field:"list5",value:true
        }],
        itemid:"",
         isLoading:false,
         ispastdeliverypressed:false,
         isprevdeliveryPressed:false,
         screenHeight:height,
         loadingorders:false,
         arrayholder:[]
      }
   }
    //execute callback in order to stop the refresh animation. 
  _onRefresh = (callback) => {
   // networkRequest().then(response => callback(response))    
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
      let variable=commonData.getusername();
      var that = this;
      that.setState({ isLoading: true,loadingorders:true });
      fetch(GET_DATAURL, {
        method: "POST",
        body: JSON.stringify({
          "__module_code__": "PO_17",
          "__session_id__":commonData.getsessionId(),
          "__query__": "",
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
       let pastarray=tempArray.filter(item=>item.orderstatus=="DELIVERED");
       
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
      // this.getOrderItemListCall(item.orderid,item.orderstatus);
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
      
    <View style={{width:width-50,alignSelf:"center",flexDirection:'row'}}>
   <Text style={{width:width/3-30}}>{item.label}</Text>
   <CheckBox
             style={{margintop:0,marginHorizontal:200}}
             disabled={false}
             value={item.value}
             onValueChange={(newValue) => item.value=newValue}
           />
    </View>
      
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
        {/* <Image source={{uri: rowData.imageUrl}} style={styles.image}/> */}
        <Text style={[styles.textDescription]}>{rowData.description}</Text>
      </View>
    )

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={()=>this.props.navigation.navigate("pendingdelivery",{ custid: rowData.title})}>
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
      this.forceUpdate();
      this.props.navigation.navigate('pendingdelivery');

   }
   componentDidMount(){
      
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
      const scrollEnabled1 = this.state.screenHeight > 300;
       return( <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
        <View style={{flexGrow:1,marginTop:-10,height:500}}>
        
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:-10,height:height-200}}>
                    <FlatList
                        data={this.state.checklist}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
                   </SafeAreaView>);
    }

}
export default(checkQC);
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