
import React, { Component ,createRef} from 'react';
import { Text,Keyboard,ImageBackground,PermissionsAndroid,TouchableHighlight,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import {images} from './images/images'
var orderid=[]
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
const GET_DATAURL=Constants.SET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Configuration=require('../components1/Configuration');
import SignatureCapture from 'react-native-signature-capture';
import Share, { Social } from 'react-native-share';
import { captureScreen } from "react-native-view-shot";
var RNFS = require('react-native-fs');
import Toast from 'react-native-simple-toast';
import Geolocation from "react-native-geolocation-service";
var lat="";
var longi="";
class OrderInvoice extends Component {
    
    constructor(props) {
        super(props);
        
        this.calculateRunningTotals= this.calculateRunningTotals.bind(this);
        this.state = {       
        search: '',
        data: [],
        error: null,
        mainData :[],
        orderitemlist:[],
        Qty:0,
        price:0,    
        Items:0,
        OrderedDate:'',
        customername:'',
        JSONResult:[],
        loading:true,
        value:'',
        searchmsg:'',
        screenHeight: height,
        orderid:"",
        dragged:false,
        subtotal:0,
        GST:0,
        savings:0,
        grandtotal:0,
        screenshotView:false,
        latitude: "",
        longitude: "",
        coordinates:[],
        creditsapplied:0,
        credit_note:0,
        amount_pay:0

    }
     this.arrayholder = [];
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
      that.setState({screenshotView:false});
      that.sendData();
      console.log(contents+"vdvgvg")
      let urlString = 'data:image/png;base64,'+contents;
      let options = {
        title: 'Ordo Order Reciept',
        message: 'Please find the Confirmation Reciept',
        url: urlString,
        type: 'image/png',
        social:Share.Social.WHATSAPP
      };
      Share.open(options)
    .then((res) => {
    
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
    
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  },
        error => console.error("Oops, snapshot failed", error)
      );
      return;
      
    };
    componentWillMount(){
        this.state.value=''
        this.state.searchmsg=''
    
            var  array= this.props.navigation.getParam('array','') ;
           this.state.credit_note=this.props.navigation.getParam('credit_note',0);
            const checkedarray=array.filter(item=>item.checked=="1");
            for(var t=0;t<checkedarray.length;t++){
              // this.state.subtotal=(Number(checkedarray[t].totalitems)*Number(checkedarray[t].totalvalue))+Number(this.state.subtotal);
              this.state.subtotal=this.state.subtotal+checkedarray[t].subtotal_amount
              this.state.GST=this.state.GST+checkedarray[t].tax_amount;
              this.state.grandtotal=this.state.grandtotal+Number(this.state.subtotal)+Number(this.state.GST);
              // this.state.grandtotal=this.state.grandtotal+checkedarray[t].total_amount
            }
            // this.state.GST=Number(this.state.subtotal)*18/100;
            this.state.savings=0;
            // this.state.grandtotal=Number(this.state.subtotal)+Number(this.state.GST);
            if(this.state.grandtotal==0){
              this.state.credit_note=0;
            }
              var paycredit=0;
              if(this.state.grandtotal>0)
              paycredit=Number(this.state.credit_note)-Number(this.state.grandtotal);
              if(paycredit>0){
            this.state.amount_pay=0;
            this.state.creditsapplied=this.state.grandtotal;
            this.state.credit_note=paycredit;
              }
            else{
              this.state.amount_pay=paycredit*-1;
              this.state.creditsapplied=this.state.credit_note;
              this.state.credit_note=0
            }
          
            this.setState({ 
             loading:true
           
       });
            this.setState({ 
              mainData:checkedarray,
             JSONResult: checkedarray,
             loading:false
           
       });

        }
        showinvoice(){
          var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__id__\": \"bffe11dc-3b3e-445b-86c2-9c8020c945d9\"\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://143.110.178.47/OrdoCRM7126/getFile.php", requestOptions)
  .then(response => response.json())
  .then(result => {
    
    console.log(result);
  })
  .catch(error => console.log('error', error));
        }

    componentDidMount() {

      return;
        // this.getListCall();
        async function requestLocationPermission() {
          // var that =this;
          try {
            const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              'title': 'Ordo App Permission',
              'message': 'Ordo App needs access to your Location '
            }
            )
            Geolocation.getCurrentPosition(
              //Will give you the current location
              (position) => {
                //getting the Longitude from the location json
                const currentLongitude =
                  JSON.stringify(position.coords.longitude);
               
                //getting the Latitude from the location json
                const currentLatitude =
                  JSON.stringify(position.coords.latitude);
                  longi=currentLongitude;
                  lat=currentLatitude;
                                 
               }, (error) => alert(error.message), { 
                 enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
               }
            );
           } catch (err) {
            alert("Location permission err", err);
            console.warn(err);
          }
         
        }
        requestLocationPermission();
        
    }
    Sendordersstatustoserver=()=> {
      this.setState({screenshotView:true});
      this.updatecredits();
      this.captureAndShareScreenshot();
    }
    updatecredits=()=>{
      var that = this;
        that.state.loading=true;
      var customerid= commonData.getaccountid();
      console.log("customer id",customerid);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({"__module_code__":"PO_01","__session_id__":commonData.getsessionId(),"__query__":"id='"+customerid+"'","__name_value_list__":{"credit_note":that.state.credit_note,"id":customerid}});
       
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("https://dev.ordo.primesophic.com/set_data_s.php", requestOptions).then(function (response) {
          return response.json();   
        }).then(function (result) {
          console.log(result,"Credits*******************");
          that.setState({ 
          
           loading:false
         
     });
    
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
     


    }
    sendData=()=>{
      var that = this;
      
            // that.setState({screenshotView:false});
        if(that.state.dragged==false){
          Alert.alert("Warning","Please sign to continue.");
          return;
        }
        that.state.loading=true;
       for(var i=0;i<that.state.JSONResult.length;i++){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var oid=that.state.JSONResult[i].id;
        var raw = JSON.stringify({"__module_code__":"PO_17","__session_id__":commonData.getsessionId(),"__query__":"id='"+that.state.JSONResult[i].id+"'","__name_value_list__":{"orderstatus_c":"Delivered","stage":"Delivered","longitude":longi,"latitude":lat,"id":oid}});
       
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
        // if(i==that.state.JSONResult.length-1){
          that.setState({ 
          
           loading:false
         
     });
     that.forceUpdate();
          that.props.navigation.navigate("DeliveryMain")
   
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }

       
}

    makeRemoteRequest = () => {
        this.setState({ loading: true });
        this.setState({
            data: this.state.JSONResult,
           
        });
         this.arrayholder = this.state.JSONResult;
    };
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
      };

    searchFilterFunction = (text) => { 
        this.state.searchmsg=''
        this.setState({
            value: text,
          });
          if(text.length==0){
            this.setState({ JSONResult: this.state.mainData }); 
            Keyboard.dismiss();
            return;
           }
  const newData = this.state.mainData.filter(item => {      
  const itemData = `${item.name_value_list.productid.value.toUpperCase()} ${item.name_value_list.description.value.toUpperCase()}`;
   const textData = text.toUpperCase();
   return itemData.indexOf(textData) > -1;    
});
this.setState({ JSONResult: newData });  
};
    calculateRunningTotals=()=>{
            console.log('calculating running totals')
              let Qty=0,price=0
              let Items=this.state.JSONResult.length
              for(var i=0; i<Items;i++){
                Qty=Qty+Number(this.state.JSONResult[i].name_value_list.quantity.value)
                if(this.state.JSONResult[i].name_value_list.price.value!=null)
                 price=price+(Number(this.state.JSONResult[i].name_value_list.quantity.value)*Number(this.state.JSONResult[i].name_value_list.price.value))
              }
              this.state.price=price
              this.state.Qty=Qty
              this.state.Items=this.state.JSONResult.length
              this.forceUpdate()
            }
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
    SignItemsView = ({ item, index }) => (
        <View style={styles.flatliststyle1}>  
          <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center', backgroundColor:'#ffffff',width:width-10,alignSelf:'center' ,height:40}} >
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12, width:width/2.5,marginHorizontal:20}}>{item.orderid.substring(1, 8)}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:width/4.5,marginHorizontal:2}}>{Number(item.totalitems)}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:width/3.5,marginHorizontal:2}}>₹{Number(item.totalvalue)}</Text>
          </View>
        </View>
         
        )
    getImageforItemid(itemid){
      
        let imagloc=require('../components1/images/Customerimages/no-image-1.png')
        let itemArray=commonData.getSkuArray()
        const filteredData = itemArray.filter(item => item.itemid === itemid);
        if(filteredData.length>0)
         imagloc=images[filteredData[0].itemid]
         imagloc=require('./images/itemImage/IRG-14.jpg');
        return imagloc;
        
    }
    render() {
        const scrollEnabled = this.state.screenHeight > height;
        const scrollEnabled1=this.state.screenheight>60;

        this.state.searchmsg=this.state.JSONResult.length+' Results'
        var price=commonData.getTotalPrice().split("₹")[1];
        var totalsavings=0;
        var gst=Number(price)*18/100;
        var grandtotal=Number(gst)+Number(price);
        const saveSign = () => {
            sign.current.saveImage();
        };
      
          const closeSign = () => {
         
        };
          const saveSign1 = () => {
              sign.current.saveImage();
         
          };
      
          const resetSign1 = () => {
              sign.current.resetImage();
          };
      
          const _onDragEvent=() =>{
            // This callback will be called when the user enters signature
            this.state.dragged=true;
           console.log("dragged");
       }
        const _onSaveEvent = (result) => {
              //result.encoded - for the base64 encoded png
              //result.pathName - for the file path name
              // Alert.alert('Message',"Your Order Delivery is successfully");
              
              console.log(result.encoded);

          };
        const resetSign = () => {
            analytics().logEvent('ClearSignitureBtnClicked', {
                content_type: 'ClearSigniture',
                content_id: JSON. stringify(commonData.token),
                items: [{ name: 'ClearSigniture' }]
            })
            sign.current.resetImage();
            this.setState({dragged:false});
            this.forceUpdate();
        };
      
      
        const sign = createRef();
        if (this.state.loading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Loading Items, Please wait.</Text>
            </View>
          );
        }
        return (
       
        <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
            <View style={styles.container}>
     {this.state.screenshotView==false?

            <TouchableOpacity style={styles.backStyle} onPress={() => {
							this.props.navigation.goBack()
						}}>
    <Image transition={false}  source={require('../components1/images/close_btn.png')} style={{width: 30,height:30,alignSelf:'center' }} > 
          </Image> 
    </TouchableOpacity>:null}
        <View style={{ flexDirection: 'row',alignSelf:'center', marginTop:10 , width:width-20,backgroundColor:'#ffffff'}} >
        
        <Text style={styles.titleStyle}>
			Delivery Invoice 
				</Text>
        <Image transition={false}  source={require('../components1/images/OrDo.png')} style={{ marginTop: 10, marginHorizontal: width-260 ,width: 100,height:40,alignSelf:'center' }} > 
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

<View style={{height:190}}>
              
              <ScrollView style={{ backgroundColor: '#FFFFFF',flexGrow:1}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled1}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:5,backgroundColor: '#FFFFFF',marginTop:0,height:height-230}}>
                    <FlatList
                        data={this.state.JSONResult}
                        renderItem={this.SignItemsView}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
             </View>
              
                    <View style={{height:400,marginTop:-10,backgroundColor:'#ffffff'}}>
                        <View style={{height:30,flexDirection:'column',width:width-30,alignself:'center'}}>
                        <Text style={{ width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>Sub-Total :₹{Number(this.state.subtotal).toFixed(2)}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>GST(18%) : ₹{Number(this.state.GST).toFixed(2)}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>Credits Applied : ₹{Number(this.state.creditsapplied).toFixed(2)}</Text>
                    <Text style={{ width:width-30,textAlign:'right',fontFamily:'Lato-Bold',fontSize:11,textAlign:'right',color:'black'}}>GRAND TOTAL : ₹{Number(this.state.grandtotal).toFixed(2)}</Text>
                    <Text style={{ width:width-30,textAlign:'right',fontFamily:'Lato-Bold',fontSize:12,textAlign:'right',color:'black'}}>Amount Payable: ₹{Number(this.state.amount_pay).toFixed(2)}</Text>

                    </View>
                    <Text style={{ marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10,color:'black'}}>Customer Signature</Text>

<Text style={{ marginHorizontal: 30 ,marginTop:20,fontFamily:"Lato-Regular",fontSize:10,color:'black'}}>SIGN BELOW</Text>
                    <SignatureCapture
                        style={styles.signature}
                        ref={sign}
                        onSaveEvent={_onSaveEvent}
                        onDragEvent={_onDragEvent}
                        showNativeButtons={false}
                        showBorder={true}
                        minStrokeWidth={0.1}
                        strokeColor={'black'}
                        maxSize={150}
                        backgroundColor="#f5f5f5"
                        showTitleLabel={true}
                        viewMode={'portrait'}
                    />
     {this.state.screenshotView==false?

                    	<TouchableOpacity
						style={styles.buttonStylereset}
						onPress={() => {
							resetSign1();
						}}>
					
            <Text style={{width:100,marginRight:100, color:'red',height:30,textAlign:'center',textDecorationLine: 'underline',
            textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10
  }}>Clear Signature</Text>
					</TouchableOpacity>:null}
                   <Text style={{width:width-40,alignself:'center', marginHorizontal: 30,color:'black'}}>Delivery has been received successfully.</Text>
                   {this.state.screenshotView==false?
			
					<TouchableOpacity
						style={styles.ProceedbuttonStyle}
						onPress={() =>{
							this.Sendordersstatustoserver();
            }
						}>
						<Text style={{color:'#011A90',fontFamily:'Lato-Bold'}}>Confirm Delivery</Text>
					</TouchableOpacity>:null}
          </View>
				</View>
        <View  >
       </View>
      </View>
  </SafeAreaView>
          
        );
    }
    sampleRenderItem = ({ item }) => (

        <View style={styles.flatliststyle}>
        <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
          <View style={{flexDirection:'row'}}>
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{height: 100, width: 100,marginHorizontal:39,marginTop:10}}>
              <Image transition={false} source={this.getImageforItemid(item.name_value_list.productid.value)} style={{ height: 80, width: 80, marginTop: 5,marginHorizontal:0, resizeMode: 'center' }} />
          </TouchableOpacity>
          <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:100,marginHorizontal:-120,fontWeight:"500"}}>{item.name_value_list.productid.value}</Text>
          <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 25,marginHorizontal:93, resizeMode: 'contain' }} />
          </View>
          <View style={{marginHorizontal:-110,}}>
            <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: 200 gms</Text>
            <Image transition={false} source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
            <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.name_value_list.description.value}</Text>
            <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:10,width:190}}>Quantity Ordered : {item.name_value_list.quantity.value}</Text>
          </View>
          <Text style={{color:'#FF8DB8',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',marginTop:20,marginHorizontal:99}}>₹{Number(item.name_value_list.price.value)}</Text>
          </View>
       </ImageBackground>
       </View>
    )
}





export default OrderInvoice;

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        height: 500,
      },
      ScrollView: {
        flexGrow: 1,
      },
      scrollview:{
        // flexGrow:1,
        // height:height-480
        // justifyContent: "space-between",
        // padding: 10,
      },
        flatliststyle: {
        marginTop: -12,
        height: 200,
        width:width-30,
        backgroundColor:'#FFFFFF' ,
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
          marginTop:25,
          textAlign:'center',
          textAlignVertical:'center',
          fontWeight:'bold',
          fontFamily:'Lato',
          backgroundColor:'#ffffff',
      },
          titleStyle: {
            fontSize: 18,
        width:140,
        marginTop:20,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontFamily:'Lato',
        color:'black',
            backgroundColor:'#ffffff',
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
        width: width -20,
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
        color:'black',
            height: 40,
        width:width-40,
            // backgroundColor: '#011A90',
        backgroundColor:'#ffffff',
        borderRadius:5,
        borderWidth:1,
        borderColor:'#011A90',
            marginTop: 10,
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
         fontFamily:'Lato-Regulr'
      },
      saveview:{
        color: '#800080',
        //  fontWeight: 'bold',
         fontFamily:'Lato-Regulr'
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
        width:"85%",
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
        
            marginHorizontal:width-220,
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
})