
import React, { Component } from 'react';
import { Text,ActivityIndicator, View,StyleSheet,Image,TouchableOpacity,Alert,Dimensions,ImageBackground,ScrollView,FlatList} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CommonDataManager from './CommonDataManager';
// import {default as UUID} from "uuid";
import uuid from 'react-native-uuid';
import moment from 'moment';
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen");
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
var createtype=''
const GET_DATAURL=Constants.GET_URL;
var rupeesymbol='₹'
let commonData = CommonDataManager.getInstance();
var customerImage=require('../components1/images/profile.jpeg')
var RNFS = require('react-native-fs');
var orderpath = RNFS.DocumentDirectoryPath + '/ordersOffline.json';
let billamount =0
let amountrecieved =0
let lastpaiddate=""
let lastordereddate=""
class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.createOrderFunction=this.createOrderFunction.bind(this);

        this.state = {
            
            screenheight:height,
            arrayHolder:[{orderid:"cgdfgrgh",Qty:"20",amount:"200"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"hu878ggy",Qty:"2",amount:"250"},{orderid:"jijy88899",Qty:"90",amount:"290"},{orderid:"cg8989dfgrgh",Qty:"65",amount:"2980"}],
            CustomerID:'0001',
            Name:'Seetha Charan Shetty',
            address:'',
            Line1:'',
            City: '',
            State:'',
            Zip:'',
            noImage:require('../components1/images/Customerimages/noimage.png'),
            customerImage:require('../components1/images/profile.jpeg'),
            accountid:"",
        search: '',
        orderid:'',
        id:'',
        baseUrl: 'http://ec2-13-59-29-50.us-east-2.compute.amazonaws.com/',
        products:[],
            data:[],
            show:true,
            isLoading:false,
            orderLoading:false,

    }

    }
   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon") 
    }
    Back=()=>{
        
            
    }
    
    storedData  (){
      
        this.props.navigation.navigate('OrderItem')   
      }
    CreateOrder=()=>{
        
        this.createOrderFunction();
       
    }
    OrderCreatefunction(ctype){
        commonData.isOrderOpen=true
        var val= uuid.v4();
        commonData.setOrderId(val)
        this.state.orderid=val
        this.state.id=val
        var address=[];
        address[0]=this.state.City
        address[1]=this.state.Line1
        address[2]=this.state.State
        address[3]=this.state.Zip
        // =this.state.City+' '+this.state.Line1+', '+ this.state.State+'- '+this.state.Zip
        commonData.setCustInfo(this.state.CustomerID,this.state.Name)
        commonData.setActiveAddress(address);
        commonData.setContext('')
        let TYPE=this.props.navigation.getParam('TYPE','')
        if(ctype=='CREATE'){
            this.props.navigation.navigate('OrderItem',{"TYPE":TYPE,"From":""})   
        }else{
            commonData.setContext('PREV')
            this.props.navigation.navigate('OrderItem',{From:'PREV'})   

        }
    }
     synccall(){
       
        var that = this;
        let variable=that.state.Name;
      
        var uname= commonData.getusername();
        that.setState({ orderLoading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
        fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_17",
            "__session_id__":commonData.getsessionId(),
            "__query__": "initiated_by='"+uname+"' && billing_account='"+variable+"'",
            "__orderby__": "",
            "__delete__": 0,
          })
        }).then(function (response) {
          return response.json();
        }).then(function (result) {
           console.log("dvhvdh",result)
         let orderArray = result.entry_list;
         
         console.log(result.entry_list,"ordersssss")
        
        lastpaiddate="";
        amountrecieved=0;
        // let tempArray = commonData.gettypeArray(result.entry_list,'PO_14')
        orderArray=[];
      //  for(var i=0;i<result.entry_list.length &&i<3 ;i++){
      //        orderArray.push({orderid:result.entry_list[i].name_value_list.orderid.value,totalvalue:result.entry_list[i].name_value_list.value.value}); 
        
      //  }
      var lastindex=-1;
      for(var i=0;i<result.entry_list.length&& i<3;i++){
        var days=commonData.checkoutdateditem(result.entry_list[i].name_value_list.date_modified.value)*-1;

       
       orderArray.push({orderid:result.entry_list[i].name_value_list.id.value,totalvalue:result.entry_list[i].name_value_list.total_amount.value,orderdate:result.entry_list[i].name_value_list.date_entered.value,noofdays:days}); 
        lastindex=i;
        billamount=result.entry_list[i].name_value_list.total_amount.value;
       
      }
      if(orderArray.length>0){
      orderArray= orderArray.sort((a, b) => (a.orderdate < b.orderdate) ? 1 : -1)
      lastpaiddate=orderArray[0].orderdate;
      lastordereddate=orderArray[0].orderdate;
      commonData.setdueamount(orderArray[0].totalvalue);
      if(Number(commonData.getdueamount())>0){
    
      commonData.setdueday(orderArray[0].noofdays);
      }
      else{
        commonData.setdueday("0");
      }
      }
        console.log(orderArray,"xxghsfghfsdgh)))))))")
          that.setState({
              data:orderArray,
            orderLoading: false,
            refreshing: false
          });
          that.forceUpdate();
        
        });
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
              let tempArray = commonData.gettypeArray(contents,'PO_04')
              commonData.setorderssArray(tempArray)
              this.setState({ data:tempArray });
              this.forceUpdate();
              console.log("temparay array")
              console.log(tempArray);
      
            })
            .catch((err) => {
              console.log(err.message, err.code);
            });
         
      }
      async getOrderItemListCall(oid,status) {

        let ispaymentdue=this.props.navigation.getParam('ispaymentdue','');
        let amountDue=this.props.navigation.getParam('due_amount_c','');
      
       
        
        if(ispaymentdue=='1')
        {
          Alert.alert("Notice","There is pending a payment of ₹"+amountDue +" linked with this customer.Make the payment to continue")
          return;
        }
        
        
        var that = this;
        // that.makeRemoteRequest();
        that.state.isLoading=true;
      
        const FETCH_TIMEOUT = 1000;
        let didTimeOut = false;
        

        var query="parent_id='"+oid+"'"
        // here we are quering po_user.username using post method ........
        fetch(GET_DATAURL, { 
          method: "POST",
                   body: JSON.stringify({
                     __module_code__: "PO_18",
                     __session_id__:commonData.getsessionId(),
                     __query__:query,
                       __offset__:0,
                   })
          
        }).then(function (response) {
      return response.json();   
      }).then(function (result) {
      console.log("this is for getting resonse from querying username and getting response")
      // Alert.alert("gggg");
      console.log(result);
      console.log(result.entry_list)
      console.log(":::::::::::order List Array:::::::::::::::::::::")
      commonData.isOrderOpen=true
      var val= uuid.v4();
      commonData.setOrderId(val)
      var address=[];
      address[0]=that.state.City
      address[1]=that.state.Line1
      address[2]=that.state.State
      address[3]=that.state.Zip
      // var address=that.state.City+','+that.state.Line1+','+ that.state.State+'-'+that.state.Zip
      commonData.setActiveAddress(address);
      commonData.setCustInfo(that.state.CustomerID,that.state.Name)
      //************************************************ */
      
      let currentArra=[]
      let uname= commonData.getusername()
      var skuarray=commonData.getSkuArray();
      for(var i=0;i<result.entry_list.length;i++){
        const filterdata=skuarray.filter(item=>item.itemid==result.entry_list[i].name_value_list.part_number.value);
        if(filterdata.length>0)
          currentArra.push({status:status, returned:result.entry_list[i].name_value_list.returned.value,itemid: result.entry_list[i].name_value_list.part_number.value, description: result.entry_list[i].name_value_list.item_description.value, price: result.entry_list[i].name_value_list.product_list_price.value, qty:result.entry_list[i].name_value_list.product_qty.value, imgsrc: "",weight:result.entry_list[i].name_value_list.product_total_price.value});

      }
      commonData.setContext('RP')
      that.props.navigation.navigate('OrderItem')
      
      
      commonData.setArray(currentArra)
      //tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});
      that.setState({ 
        mainData:result.entry_list,
       JSONResult: result.entry_list,
       isLoading:false
      
      });
    });
}

      
    createOrderFunction=()=>{

        if(commonData.isOrderOpen==false){
         
          // let ispaymentdue=this.props.navigation.getParam('ispaymentdue','');
          // let amountDue=this.props.navigation.getParam('due_amount_c','');
        
         
          
          // if(ispaymentdue=='1')
          // {
          //   // Alert.alert("Notice","There is pending a payment of ₹"+amountDue +" linked with this customer.Make the payment to continue")
          //   return;
          // }
          
            this.OrderCreatefunction('CREATE')
        }
        else{
            Alert.alert(
                //title
                'Confirmation',
                //body
                'You have an existing order open. Do you wish to proceed?',
                [
                  { text: 'Yes', onPress: () => this.OrderCreatefunction('PREV') },
                  { text: 'No', onPress: () => this.props.navigation.goBack(), style: 'cancel' },
                ],
                { cancelable: false }
                //clicking out side of alert will not cancel
              )
        }
       }
    componentWillMount(){
      this.state. orderLoading=true;
      // let orderarray=commonData.getordderssArray()
      // this.setState({ data:orderarray ,isLoading: false});
      
       
     
        this.state.CustomerID=this.props.navigation.getParam('storeID','')
       
        this.state.Name=this.props.navigation.getParam('name','')
        this.state.customerImage=this.props.navigation.getParam('imageLoc','')
        // this.state.address=this.props.navigation.getParam('address','')
        // this.state.City=this.props.navigation.getParam('city','')
        // this.state.State=this.props.navigation.getParam('Place','')
        // this.state.Zip=this.props.navigation.getParam('ZIP','')
        // this.state.Line1=this.props.navigation.getParam('LINE','D.K')
        var add=commonData.getActiveAdress().split(",");
        this.state.address=add[0];
         this.state.City=add[1]
        this.state.State=add[2]
        this.state.Zip=add[3]
        this.state.Line1=add[0]
        this.state.accountid=this.props.navigation.getParam("Id","");
        this.synccall();
    }
    SignItemsView = ({ item, index }) => (
       
        <View style={styles.flatliststyle1}>  
        
        <View style={{ flexDirection: "row", backgroundColor:'#ffffff',width:width-10,alignSelf:'center' ,height:30}} >
        <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',textAlign:'left',fontSize:12,height:30,textAlignVertical:'center', width:(width-10)/3}}>  XXXX{item.orderid.substring(1, 8)}{'\n'}<Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',textAlign:'left',fontSize:8,height:30,textAlignVertical:'center', width:(width-10)/3}}>   {item.orderdate}</Text></Text>
         <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:(width)/3,textAlignVertical:'center',height:30,textAlign:'center'}}>₹{Number(item.totalvalue).toFixed(2)}</Text>
         <TouchableOpacity style={{ width:(width-10)/3, flexDirection:'row',alignItems:'center',height:30}} onPress={()=>{this.getOrderItemListCall(item.orderid,"NEW")}}>
       <Text style={{width:(width-10)/3,height:30, color:'#011A90',textAlign:'center',textDecorationLine: 'underline',fontFamily:'Lato-Bold',textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10}}>Repeat</Text>
      </TouchableOpacity>
        </View>
      </View>
       
        )
    render() {
    
      var msg= " Last "+this.state.data.length+" Transaction Details";
      if(this.state.data.length==0)
      msg="No Previous Orders"
        const scrollEnabled=this.state.screenheight>200;
       
        if (this.state.isLoading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
            <ActivityIndicator />
            <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Loading Orders , Please wait</Text>

              </View>
          );
      }
    
    let TYPE=this.props.navigation.getParam('TYPE','')
    
    let amountDue=this.props.navigation.getParam('due_amount_c','');
    // lastpaiddate=this.props.navigation.getParam('lastpaymentdate','');
    // lastordereddate=this.props.navigation.getParam('lastsaledate','');
    // billamount=this.props.navigation.getParam('lastsaleamount','');
    amountrecieved=Number(billamount).toFixed(2);

    let ispaymentdue=this.props.navigation.getParam('ispaymentdue','');
    let createbuttonenables=true;
    if(ispaymentdue=='1')
createbuttonenables=false;
        let Title = "Create Order"
        if(TYPE=="RETURN")
        Title = "Create Return"
        // this.state.customerImage=require('../components1/images/profile.jpeg');
        this.state.customerImage=this.props.navigation.getParam('imageLoc','')
        
        return (
            <SafeAreaView>
                <View style={{flexDirection:'row',backgroundColor:'#FFFFFF', width:'100%'}}>
                <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
                </TouchableOpacity> 
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF'}}>
               <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF', fontSize: 20, height: 50,marginHorizontal:70,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center',marginTop:10}}>{Title}</Text>
            </View>
            </View>
        
            <View style={{marginTop:30,flexDirection:'row',height:height/4-20,backgroundColor:'#ffffff',width:width-20,alignSelf:'center',alignItems:'center', shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 2}}>
           
            {/* <View style={{backgroundColor:'#FFFFFF',alignItems:'center',alignContent:'center',alignItems:'center',width:(width-20)/2,alignSelf:'center',borderRadius:8}}> */}
           <View style={{height:120,width:120,backgroundColor:'#ffffff',borderRadius:80,width:(width-20)/2}}>
            <Image transition={false} source={{uri:this.state.customerImage}} style={{height:120,width:120, resizeMode:'contain',borderRadius:100,marginHorizontal:5}} />    
            {/* <Text style={{height:100,width:100, textAlign:'center',fontSize:70,color:'white',textAlignVertical:'center',alignSelf:'center',fontFamily:'Lato-Bold'}} >{this.state.Name.charAt(0)}</Text> */}

            </View>
            {/* </View> */}
            <View style={{backgroundColor:'#FFFFFF',alignItems:'center',alignContent:'center',borderRadius:5,width:(width-20)/2,alignSelf:'center'}}>
            <Text style={{marginTop:10,fontSize:15, marginHorizontal:10, color:'#34495A', fontFamily:'Lato-Bold', width:200,fontWeight:"500"}}>{this.state.CustomerID}</Text>
            <Text style={{ marginHorizontal:15,fontSize:16, color:'#011A90', fontFamily:'Lato-Bold', width:200}}>{this.state.Name}</Text>
            <Text style={{ marginHorizontal:15,fontSize:14, color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular', width:200}}>{this.state.address}</Text>
            <Text style={{ marginHorizontal:12,fontSize:14, color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular', width:200}}>{this.state.Line1}</Text>
            <Text style={{ marginHorizontal:12,fontSize:14, color:'#34495A',fontWeight:"500", fontFamily:'Lato-Regular', width:200}}>{this.state.City}</Text>
            <Text style={{ marginHorizontal:5,fontSize:14, color:'#34495A',fontWeight:"500", fontFamily:'Lato-Regular', width:200}}>{this.state.State}</Text>
            <Text style={{ marginHorizontal:5,fontSize:14, color:'#34495A',fontWeight:"500", fontFamily:'Lato-Regular', width:200}}>{this.state.Zip}</Text>
            </View>
             </View>
             <View style={{marginTop:30,flexDirection:'column',height:height/2-60,backgroundColor:'#ffffff',width:width-20,alignSelf:'center',alignItems:'center', shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 2,borderRadius:8}}>
     <Text style={{fontFamily:'Lato-Bold',fontSize:12,marginBottom:10,color:'black'}}>{msg}</Text>

                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",backgroundColor: '#FFFFFF',height:150}}>
                <View style={{ flexDirection: "row", backgroundColor:'#F1F2F1',width:width-20,alignSelf:'center' ,height:40}} >
        <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',textAlign:'left',fontSize:12,height:30,textAlignVertical:'center', width:(width-10)/3}}>Transaction Id {'\n'}<Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',textAlign:'left',fontSize:10,height:30,textAlignVertical:'center', width:(width-10)/3}}>(Ordered Date)</Text></Text>
         <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:(width)/3,textAlignVertical:'center',height:30,textAlign:'center'}}>Amount(₹)</Text>
       <Text style={{width:(width-10)/3,height:30, color:'#011A90',textAlign:'center',textDecorationLine: 'underline',fontFamily:'Lato-Bold',textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10}}></Text>
           {/* <Text style={{color:'#34495A',textAlign:'left',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12, width:170,height:30,textAlignVertical:'center'}}>Transaction Id</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:60,height:30,textAlignVertical:'center'}}>Amount(₹)</Text> */}
          </View>
                {/* <Text style={{fontFamily:'Lato-Bold',fontSize:12,marginBottom:10}}>{msg}</Text> */}
              {this.state.orderLoading==false?
               
                <FlatList
                
                  data={this.state.data}
                  extraData={this.state.refresh}
                  renderItem={this.SignItemsView}
                  keyExtractor={(item, index) => toString(index)}
                   />: <ActivityIndicator />

              }
                  </View>
              </ScrollView>
              <View style={{ flexDirection: "column",justifyContent:'center',alignItems:'center', backgroundColor:'#F1F2F1',width:width-20,alignSelf:'center' ,height:100,borderRadius:8}} >
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12, width:300,marginHorizontal:20}}>Last Payment Date : {lastpaiddate}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:300, marginHorizontal:20}}>Last Due Amount : ₹{Number(commonData.getdueamount()).toFixed(2)}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12, width:300,marginHorizontal:20}}>No of days due : {commonData.getdueday()}</Text>
           {/* <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12, width:300,marginHorizontal:20}}>Last Due Amount : {lastordereddate}</Text>          */}
           {ispaymentdue=='1'?<Text style={{color:'red',borderBottomColor:'#7A7F85',fontWeight:'200',fontFamily:'Lato-Bold',fontSize:8.5, width:width-60,marginHorizontal:20}}>"Alert:You have crossed the credit limit,please make the payment to continue"</Text>:undefined}
          </View>
          </View>
          {ispaymentdue!='1'?
      <TouchableOpacity style={{marginHorizontal:10,marginTop:height/4-150,height:50,width:300,alignSelf:'center',alignSelf:'center'}}
                onPress={this.createOrderFunction}
                >
            <LinearGradient
              colors={['#ffffff', '#ffffff']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Create an Order</Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </LinearGradient>
          </TouchableOpacity>:<View style={{marginHorizontal:10,marginTop:height/4-150,height:50,width:300,alignSelf:'center',alignSelf:'center'}}
                >
            <LinearGradient
              colors={['#f0f0f0', '#f0f0f0']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Create an Order</Text>
            </LinearGradient>
          </View>
    }
            </SafeAreaView>
        );
    }
    
}//                  <View style={{width:250,marginTop:-20, height:48,alignSelf:'center',alignItems:'center',flexDirection:'row',borderRadius:8,borderColor:'grey', backgroundColor: '#011A90'}}>
    //                  <TouchableOpacity style={{alignContent:'center',width:250,}} onPress={this.createOrderFunction}>
    //                  <Text style={{alignItems:'center',alignSelf:'center',textAlign:'center',width:250,color:'white',fontFamily:'Lato-Regular'}}>{Title}</Text>
    //                 </TouchableOpacity>
    //                 </View>



const styles=StyleSheet.create({
    
    textOrder: {
        color: '#34495A',
        fontSize:24,
        fontWeight:'bold',
        marginTop:4,
        fontWeight:"500",
        fontFamily:'Lato-Bold'
  
     },
     flatliststyle1: {
    
        height: 40,
        alignContent:'center',
        width: width -20,
        // backgroundColor: 'red',
        alignSelf: 'center',
        resizeMode: "contain"
      },
     textPrime: {
      color: '#34495A',
      fontSize:24,
      fontWeight:'bold',
      marginTop:4,
      fontFamily:'Lato-Bold'
   },
   signIn: {
    width: 300,
    borderWidth:1,
    borderRadius:10,borderColor:'#011A90',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignSelf:'center',
    fontFamily:'Lato-Bold'
  
  },
  textSign: {
      color: '#011A90',
      fontFamily:'Lato-Regular'
    },
    image:{
        height:0,
        width:30,
        marginHorizontal:30,
        marginTop:30
        
    }
})
export default CreateOrder;
