import React, { Component } from 'react';
import { Text,ImageBackground,Dimensions,Keyboard, View, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView, FlatList, ScrollView ,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withNavigation } from "react-navigation";
import CommonDataManager from './CommonDataManager';
import { TextInput } from 'react-native-gesture-handler';
const Constants = require('./Constants');
import LinearGradient from 'react-native-linear-gradient';
var RNFS = require('react-native-fs');
import Toast from 'react-native-simple-toast';
var currentpath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var offerpath = RNFS.DocumentDirectoryPath + '/OffersOffline.json';
const GET_DATAURL=Constants.GET_DATA_ORDO;
var ItemArrayAdded=[]
let commonData = CommonDataManager.getInstance();
var ItemArray=[]
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen");
var itemImage=[{img:require('../components1/images/bg2.jpeg'),img:require('../components1/images/bg3.jpeg')}];
const Card = ({id, name}) => {
  return (
    <View style={styles.card}>
      <Text>{id}</Text>
      <Text>{name}</Text>
    </View>
  );
};

class Offers extends Component {
imgloc= require('../components1/images/barcode.png')
    constructor(props) {
        super(props);
        this.state = {
            JSONResult: [],
            data:ItemArray,
            qty:0,
            dataList:[],
            refresh:false,
            loading:false,
            searchmsg:'',
            screenheight:height,
            itemArrayPricing:[]
        }
        this.arrayholder = [];
    }
    
    ArrowForwardClick = () => {
        Alert.alert("Loading soon")
    }
    
   
    componentDidMount(){
      

        const { navigation } = this.props;
      
    commonData.setItemArray(commonData.getSkuArray())
    this.focusListener = navigation.addListener("didFocus", () => {
      this.ReloadItems();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
       
    });
      }
      componentWillMount(){
       
        // this.searchFilterFunction('');
        // this.forceUpdate();
      }
      componentWillUnmount() {
        // Remove the event listener
        // this.focusListener.remove();
      }
 

makeRemoteRequest = () => {
    this.setState({ loading: true });
    this.setState({
        loading: false,
    });
 
};

ReloadItems(){
  this.sycnCall();
  for(var i=0;i<this.state.JSONResult.length;i++){
    var item = itemImage[Math.floor(Math.random()*itemImage.length)];
    
    this.state.JSONResult[i].image=item.img
 
  }
 
        this.forceUpdate();
       
}

searchFilterFunction = (text) => { 
 
    this.setState({
                value: text,
              });
            if(text.length<=0){
                this.ReloadItems();
                Keyboard.dismiss()
                return
            } 
      const newData = this.state.dataList.filter(item => {      
      const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });
    this.setState({ JSONResult: newData });  
    
    this.forceUpdate()
  };

    loadOffers(){
        var that = this;
        that.setState({ loading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
          fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_10",
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
         let skuArray = result.entry_list;
     
          let temparray=[];
          for(var i=0;i<result.entry_list.length;i++){
            // .push({name:skuArray[i].name_value_list.name.value,minQty:skuArray[i].name_value_list.min_qty.value,Code:skuArray[i].name_value_list.coupon_code.value,Validity:skuArray[i].name_value_list.valud_till.value,type:skuArray[i].name_value_list.type.value,OfferVAl:skuArray[i].name_value_list.discount_value.value,product_id:skuArray[i].name_value_list.aos_products_id_c.value});
                      temparray.push({name:skuArray[i].name_value_list.name.value,minQty:skuArray[i].name_value_list.min_qty.value,Code:skuArray[i].name_value_list.coupon_code.value,Validity:skuArray[i].name_value_list.valud_till.value,type:skuArray[i].name_value_list.type.value,OfferVAl:skuArray[i].name_value_list.discount_value.value,product_id:""});

          }
          that.state.JSONResult=[];
that.setState({JSONResult:temparray});

          console.log("The sku data which come from the server here")
          console.log(temparray);
          that.setState({
            loading: false,
            refreshing:false
          });
  that.forceUpdate();
    // write the file
  
    var json = JSON.stringify(temparray);
    console.log(json, "this is sku order array list array")
    RNFS.writeFile(offerpath, json, 'utf8')
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
        }).catch(function (error) {
          console.log("-------- error ------- " + error);
        });
      }
      
    sycnCall=()=>{
        this.loadOffers();
       
      }
      onContentSizeChange=(contentwidth, contentheight)=>{
        this.setState({screenheight:contentheight})
      }
    render() {
      const scrollEnabled=this.state.screenheight>height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'
       


        if (this.state.loading==true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                    <ActivityIndicator />
                    <Text style={{fontFamily:'Lato-Bold'}}>Loading Item , Please wait</Text>
                </View>
            );
        }
        return (
           
            <View style={{backgroundColor:'#FFFFFF',flex:1}}>
             
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:30,marginHorizontal:20, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width-100, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Offers & Promotions</Text>
            
      </View> 
       
               
               
               {/* <View style={{flexGrow:1,marginTop:0,height:900}}> */}
                {/* <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10,height:height-130}}>
                    <FlatList
                        data={this.state.JSONResult}
                        renderItem={this.sampleRenderItem}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView> */}

<ScrollView 
    contentContainerStyle={{
        flexDirection: 'row',
        alignSelf:'center',
        width:width-20,
        flexWrap: 'wrap'}}
      >
      {this.state.JSONResult.map((item, index) => {
        console.log(index);

        return (
          <View style={styles.flatliststyle}>
          {
             item.type=='P'? <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width/2-20,fontSize:16,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}{item.OfferVAl}% OFF</Text>:<Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width/2-40,fontSize:16,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}Buy {item.minQty} Get {item.OfferVAl}% OFF </Text>
           }
           <TouchableOpacity style={{alignSelf:'center',width:120,height:30,backgroundColor:'#ffffff',  shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal:5,
        shadowRadius: 2,borderRadius:10,
        elevation: 4 }} onPress={()=>{Toast.show('Coupon Code Applied.', Toast.LONG);commonData.setCouponDetails(item.Code)}}>
        <Text style={{alignSelf:'center',fontSize:12,fontWeight:'700',fontFamily:"Lato-Bold",width:120,height:30,textAlignVertical:'center',textAlign:'center',color:'#011A90',fontFamily:'Lato-Regular'}}>{item.Code}</Text></TouchableOpacity>
         <Text style={{fontFamily:'Lato-bold',fontSize:8,textAlignVertical:'center',height:20,marginTop:10}}>Press and hold to apply coupon code.</Text>
         </View>
        );
      })}
    </ScrollView>
                {/* </View> */}
                <Text style={{fontFamily:'Lato-bold',color:'red',fontSize:8,textAlignVertical:'center',height:20,width:width-20,alignSelf:'center',textAlign:'center'}}>*Disclaimer : Coupons and Promotions will not be applied to bundled and return orders</Text>

            </View>
        );
    }
    AddItemToInventory=()=>{ 
      Alert.alert('Alert','You do not have an open order to add items.')

      // this.props.navigation.navigate('AddProduct')
    }
    refreshDAta(){
        this.setState({refresh:!this.state.refresh})        
        ItemArrayAdded=[]
        ItemArrayAdded=this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded=filteredData
        //Write Data To file
        commonData.writedata(currentpath,ItemArrayAdded)
        this.forceUpdate();
    }
    AddItem = (Qty,index,type) => {
        if(commonData.isOrderOpen==true){
        let qtyval = Number(Qty)
        if(type=='+')
        qtyval=qtyval+1; 
         else if(type =='-') 
         {
             //Qty value cannot be less than 0
                if(qtyval>0)
                 qtyval=qtyval-1;
                 else
                 qtyval=0
         }
        this.state.dataList[index].qty=qtyval
        this.state.JSONResult[index].qty=qtyval
        //Updates issue fix in Home Tab
        this.calculaterunningTotals();
       this.refreshDAta();
        }else{
            Alert.alert('Alert','You do not have an open order to add items.')
            Keyboard.dismiss()
        }
    }
   
//     sampleRenderItem = ({ item, postmanindex }) => (
        
//       <View style={styles.flatliststyle}>
//       {/* <ImageBackground source={require('../components1/images/bg4.jpeg')} style={styles.flatrecord}> */}
//       {
//          item.type=='P'? <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width-20,fontSize:20,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}{item.OfferVAl}% OFF</Text>: <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width-20,fontSize:20,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}Buy 1 Get {item.OfferVAl} FREE</Text>
//        }
//        <TouchableOpacity style={{alignSelf:'center',width:150,height:30,backgroundColor:'#ffffff',  shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.5, marginHorizontal:5,
//   shadowRadius: 2,borderRadius:10,
//   elevation: 4 }} onPress={()=>{Toast.show('Coupon Code Applied.', Toast.LONG);commonData.setCouponDetails(item.Code)}}>
//     <Text style={{alignSelf:'center',fontSize:12,fontWeight:'700',fontFamily:"Lato-Bold",width:150,height:30,textAlignVertical:'center',textAlign:'center',color:'#011A90',fontFamily:'Lato-Regular'}}>{item.Code}</Text></TouchableOpacity>
//      {/* </ImageBackground> */}
//      <Text style={{fontFamily:'Lato-bold',fontSize:10,textAlignVertical:'center',height:20}}>Press and hold to apply coupon code.</Text>
//      </View>
            
       
//     )
// }
sampleRenderItem = ({ item, postmanindex }) => (
        
  <View style={styles.flatliststyle}>
  {
     item.type=='P'? <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width-20,fontSize:20,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}{item.OfferVAl}% OFF</Text>: <Text style={{alignSelf:'center',textAlign:'center',textAlignVertical:'center', height: 80, width:width-20,fontSize:20,fontWeight:'700',fontFamily:"Lato-Regular",color:'#000000'}}>{item.name}{"\n"}Buy 1 Get {item.OfferVAl} FREE</Text>
   }
   <TouchableOpacity style={{alignSelf:'center',width:150,height:30,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={()=>{Toast.show('Coupon Code Applied.', Toast.LONG);commonData.setCouponDetails(item.Code)}}>
<Text style={{alignSelf:'center',fontSize:12,fontWeight:'700',fontFamily:"Lato-Bold",width:150,height:30,textAlignVertical:'center',textAlign:'center',color:'#011A90',fontFamily:'Lato-Regular'}}>{item.Code}</Text></TouchableOpacity>
 <Text style={{fontFamily:'Lato-bold',fontSize:10,textAlignVertical:'center',height:20}}>Press and hold to apply coupon code.</Text>
 </View>
        
   
)
}

// export default SKU;
export default withNavigation(Offers);


const styles = StyleSheet.create({
  scrollview:{
    // flexGrow:1,
    // height:height-480
    // justifyContent: "space-between",
    // padding: 10,
  },
    flatliststyle: {
    marginTop: 10,
    height: 150,
    borderRadius:100,
    width:width/2-20,
    backgroundColor:'#FFFFFF' ,
    alignSelf:'center',
    resizeMode:"contain",
    alignItems:'center',
    borderRadius:8, 
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5, marginHorizontal:5,
  shadowRadius: 2,
  elevation: 4 
    },
    flatrecord: {
      height: 200,
      width:width-20,
alignItems:'center',
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
      width: 100,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 0,
      flexDirection: 'row',
      alignSelf:'center'
    
    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
      },
    FloatingButtonStyle: {
   
      resizeMode: 'contain',
      width: 40,
      height: 40,
    },
    recoredbuttonStyle:{
  borderRadius:4, 
  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,
elevation: 4 ,
 backgroundColor: 'white',
 alignSelf:'center',
 justifyContent:'center',
 borderRadius:15 
},
})
