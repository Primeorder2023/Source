
import React, { Component ,createRef} from 'react';
import { Text,Keyboard,ImageBackground,TouchableHighlight,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import {images} from './images/images'
var orderid=[]
const Constants = require('./Constants');
import LinearGradient from 'react-native-linear-gradient';
// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const GET_DATAURL=Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Configuration=require('./Configuration');
import SignatureCapture from 'react-native-signature-capture';
import Toast from 'react-native-simple-toast';
class ItemInvoice extends Component {
    
    constructor(props) {
        super(props);
        this.getListCall= this.getListCall.bind(this);
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
        dragged:true,
        subtotal:0,
        GST:0,
        savings:0,
        grandtotal:0

    }
     this.arrayholder = [];
    }
    componentWillMount(){
        this.state.value=''
        this.state.searchmsg=''
        this.getListCall();
            // this.calculateRunningTotals();
            
        }
    componentDidMount() {
       
        
    }
    getListCall() {
        this.state.value=''
        this.state.searchmsg=''
       var  oid= this.props.navigation.getParam('orderid','')
       this.state.orderid=oid;
       console.log("oid****************",oid);
        var that = this;
        that.makeRemoteRequest();
        // here we are quering po_user.username using post method ........
        fetch(GET_DATAURL, { 
          method: "POST",
                   body: JSON.stringify({
                     __module_code__: "PO_18",
                     "__session_id__":commonData.getsessionId(),
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
          
          that.setState({ 
            mainData:result.entry_list,
           JSONResult: result.entry_list,
           loading:false
         
     });
     var GSTval=0;
  for(var t=0;t<result.entry_list.length;t++){
    that.state.subtotal=Number(result.entry_list[t].name_value_list.product_total_price.value)+Number(that.state.subtotal);
   GSTval=GSTval+(Number(result.entry_list[t].name_value_list.vat.value)*that.state.subtotal/100)
  }
  that.state.GST=GSTval;
  that.state.savings=0;
  that.state.grandtotal=Number(that.state.subtotal)+Number(that.state.GST);
  that.forceUpdate();
  if(result.entry_list[0].name_value_list.date_modified.value)
  that.state.OrderedDate=result.entry_list[0].name_value_list.date_modified.value
    
    
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });

       
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
                Qty=Qty+Number(this.state.JSONResult[i].name_value_list.product_qty.value)
                if(this.state.JSONResult[i].name_value_list.product_total_price.value!=null)
                 price=price+(Number(this.state.JSONResult[i].name_value_list.product_qty.value)*Number(this.state.JSONResult[i].name_value_list.product_total_price.value))
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
          <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center', backgroundColor:'#ffffff',width:width-10,alignSelf:'center' ,height:50}} >
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:10, width:width/2.5,marginHorizontal:20}}>{item.name_value_list.item_description.value}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:width/4.5,marginHorizontal:2}}>{Number(item.name_value_list.product_qty.value)}</Text>
           <Text style={{color:'#34495A',borderBottomColor:'#7A7F85',fontWeight:'500',fontFamily:'Lato-Bold',fontSize:12,width:width/3.5,marginHorizontal:2}}>₹{Number(item.name_value_list.product_total_price.value)}</Text>
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
        const scrollEnabled = this.state.screenHeight > 130;
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
      
      
        const _onSaveEvent = (result) => {
              //result.encoded - for the base64 encoded png
              //result.pathName - for the file path name
              Alert.alert('Message',"Your Order Delivery is successfully");
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
            <TouchableOpacity style={styles.backStyle} onPress={() => {
							this.props.navigation.goBack()
						}}>
    <Image transition={false}  source={require('../components1/images/close_btn.png')} style={{width: 30,height:30,alignSelf:'center' }} > 
          </Image> 
    </TouchableOpacity>
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
                scrollEnabled={scrollEnabled}
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
              
                    <View style={{height:400,backgroundColor:'#ffffff'}}>
                        <View style={{height:30,flexDirection:'column',width:width-30,alignself:'center'}}>
                        <Text style={{ width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>Sub-Total :₹{this.state.subtotal}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>GST(18%) : ₹{this.state.GST}</Text>
                        <Text style={{width:width-30,fontFamily:'Lato-Regular',fontSize:11,textAlign:'right',color:'black'}}>Saving : ₹0</Text>
                  
                    <Text style={{ width:width-30,textAlign:'right',fontFamily:'Lato-Bold',fontSize:12,textAlign:'right',color:'black'}}>GRAND TOTAL : {this.state.grandtotal}</Text>
                   
                    </View>

                   <Text style={{width:width-40,alignself:'center', marginHorizontal: 30,marginTop:40,color:'black'}}>I hereby agree that the orders mentioned above have been received.</Text>
			
				
          </View>
				</View>
                    <View  >
                    
                         </View>

                </View>
  
   
            </SafeAreaView>
          
        );
    }}





export default ItemInvoice;

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
            fontSize: 16,
        width:140,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
        fontFamily:'Lato',
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