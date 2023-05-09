

import React, { Component } from 'react';
import { Text,Keyboard,ImageBackground,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';
import LinearGradient from 'react-native-linear-gradient';
var RNFS = require('react-native-fs');
import {images} from './images/images'
var orderid=[]
const Constants = require('../components1/Constants');

const GET_DATAURL=Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class OrderGuide extends Component {
    
    constructor(props) {
        super(props);
        this.synccall= this.synccall.bind(this);
        this.imgloc=require('../components1/images/Customerimages/cust1.png');
        this.calculateRunningTotals= this.calculateRunningTotals.bind(this);
        this.state = {       
        search: '',
        data: [],
        error: null,
        mainData :[],
        tempArray:[],
        orderitemlist:[],
        //Qty:0,
        size:0,
        baseprice:0,    
        Items:0,
        weight:0,
        OrderedDate:'',
        customername:'',
        JSONResult:[],
        loading:true,
        value:'',
        searchmsg:'',
        screenHeight: height,

    }
     this.arrayholder = [];
    }
    
        //--------------------------------------------------11-11-21------------------------------------------------------------------
        componentWillMount() {
          const { navigation } = this.props;
           this.focusListener = navigation.addListener("didFocus", () => {
           
           });
       }
       getimageforid=(id)=>{
        var image="https://findicons.com/files/icons/305/cats_2/128/pictures.png";
        var itemlist = commonData.getSkuArray();
        const filterlist=itemlist.filter(item=>item.id==id);
        if(filterlist.length>0)
          image=filterlist[0].imgsrc;
        return image;
      }
    
     getorderguideitemd=(item,id)=>{

      var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\n    \"__module_code__\": \"PO_28\",\n    \"__session_id__\": \""+commonData.getsessionId()+"\",\n    \"__query__\": \"po_packageproducts_id_c='"+id+"'\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(Constants.GET_URL, requestOptions)
  .then(response => response.json())
  .then(result => { 
      currentArra=[];
      const skuarray=commonData.getSkuArray();
      const filterdata=skuarray.filter(skuitem=>skuitem.description ==item.name_value_list.parentid_c.value);

      if(filterdata.length>0)
      currentArra.push({ id: filterdata[0].id, description: filterdata[0].description, price: 0, qty: item.name_value_list.extrainfo1.value, imgsrc:this.getimageforid(filterdata[0].id),weight:"",type:item.name_value_list.type.value,parent:"1"});
      for(var i=0;i<result.entry_list.length;i++)
      currentArra.push({ id: result.entry_list[i].name_value_list.aos_products_id_c.value, description: result.entry_list[i].name_value_list.itemid.value, price: 0, qty: result.entry_list[i].name_value_list.quantity.value, imgsrc:this.getimageforid(result.entry_list[i].name_value_list.aos_products_id_c.value),weight:"",type:item.name_value_list.type.value,parent:"0"});

      console.log(currentArra);
      commonData.setArray(currentArra)

      this.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:"",From:'OG',TYPE:"" })

})
  .catch(error => console.log('error', error));
     
     }
       unsentclickPress=(item)=>{
     
       commonData.setOrderId(item.id)
       if(item.name_value_list.type.value=="Free goods")
       commonData.setparentitem(item.name_value_list.parentid_c.value);
       else{
        commonData.setparentitem("");
       }
       
       commonData.isOrderOpen= true;
       this.getorderguideitemd(item,item.id);
       commonData.setContext('OG')
     
        return;
    
     
     }


//--------------------------------------------------end------------------------------------------------------------------

    componentDidMount() {
        this.synccall();
        
    }
    synccall() {
        this.state.value=''
        this.state.searchmsg=''
        var that = this;
        var ogtype=commonData.getOGContext();
        var query="po_packageproducts.type='Free goods'"
        if(ogtype=="PRE")
        query="po_packageproducts.type='Prebooks'";
      

        this.makeRemoteRequest();
        // here we are quering po_user.username using post method ........
        fetch(GET_DATAURL, { 
            method: "POST",
                     body: JSON.stringify({
                        "__module_code__": "PO_11",
                        "__module_name__": "PackageProducts",
                        "__session_id__":commonData.getsessionId(),
                        "__query__": query,
                        "__orderby__": "",
                        "__offset__": 0,
                        "__select _fields__": [""],
                        "__max_result__": 1,
                        "__delete__": 0
                        })
            
         }).then(function (response) {
          return response.json();   
        }).then(function (result) {
            orderArray = result.entry_list;
          console.log("this is for getting resonse from querying username and getting response")
         // alert(result)
          console.log(result);
          console.log(result.entry_list)
          var json = JSON.stringify(orderArray);
         // alert(json)
          console.log(":::::::::::order guide Array:::::::::::::::::::::")
          
          that.setState({ 
            mainData:result.entry_list,
           JSONResult: result.entry_list,
           loading:false
         
     });
  
     if(result.entry_list[0].name_value_list.lastmodified.value)
         that.state.OrderedDate=result.entry_list[0].name_value_list.lastmodified.value
    
     that.calculateRunningTotals()
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
  const itemData = `${item.name_value_list.name.value.toUpperCase()} ${item.name_value_list.id.value.toUpperCase()}`;
   const textData = text.toUpperCase();
   return itemData.indexOf(textData) > -1;    
});
this.setState({ JSONResult: newData });  
};
    calculateRunningTotals=()=>{
            console.log('calculating running totals')
              let size=0,baseprice=0
              let Items=this.state.JSONResult.length
              for(var i=0; i<Items;i++){
                size=size+Number(this.state.JSONResult[i].name_value_list.pack.value)
                if(this.state.JSONResult[i].name_value_list.baseprice.value!=null)
                 baseprice=baseprice+(Number(this.state.JSONResult[i].name_value_list.pack.value)*Number(this.state.JSONResult[i].name_value_list.baseprice.value))
              }
              this.state.baseprice=baseprice
              this.state.size=size
              this.state.Items=this.state.JSONResult.length
              this.forceUpdate()
            }
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
    getImageforItemid(itemid){
        let imagloc=require('../components1/images/Customerimages/no-image-1.png')
        let itemArray=commonData.getSkuArray()
        const filteredData = itemArray.filter(item => item.itemid === itemid);
        if(filteredData.length>0)
         imagloc=images[filteredData[0].itemid]
        return imagloc;
        
    }
    render() {
      const { search } = this.state.value;
      const scrollEnabled = this.state.screenHeight > height;
      this.state.searchmsg=this.state.JSONResult.length+' Results'
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
              <Text style={{ marginTop:10, color: '#011A90',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Bundled Orders</Text>
              <TouchableOpacity onPress={() =>this.synccall()} style={{marginTop:10,width:width/3-50}}>
               <Image transition={false} source={require('../components1/images/sync.png')} style={{height:25,width:25,resizeMode:'contain',alignSelf:'center'}}></Image>
              </TouchableOpacity>
        </View> 
   
        <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%',marginTop:5}}> 
                  <TextInput  placeholder="Enter Bundled ID or Name" 
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
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
                       {/* <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} /> */}
                
                <Text style={styles.textSign}>Clear</Text>
                {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}

                      </TouchableOpacity>  
                     {/* <TouchableOpacity style={{height: 60, width: 100}} onPress={() => this.searchFilterFunction('')}>
                       <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} />
                      </TouchableOpacity>   */}
          </View>
          <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30,fontWeight:"500"}}>Select Your Bundle to place the order.</Text>
          <Text style={{marginTop:5,marginHorizontal:30,fontFamily:'Lato-Bold'}}>{this.state.searchmsg}</Text>
          
                   <View style={{flexGrow:1,marginTop:0,height:610}}>
                  <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                  contentContainerStyle={styles.scrollview}
                  scrollEnabled={scrollEnabled}
                  onContentSizeChange={this.onContentSizeChange}>
                  <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-270}}>
                      <FlatList
                          data={this.state.JSONResult}
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
    render1() {
        const scrollEnabled = this.state.screenHeight > height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        console.log(this.state,"testing1")

        if (this.state.loading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold'}}>Loading Orderguides, Please wait.</Text>
            </View>
          );
        }
        return (
       
          <View style={{backgroundColor:'#FFFFFF',flex:1}}>
         
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>Packaged Orders</Text>
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
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
                   
              <Text style={styles.textSign}>Clear</Text>
             
                    </TouchableOpacity>  
                    
        </View>
        <View style={{backgroundColor:'#FFFFFF',height:50,marginLeft:20, flexDirection:"row"}}>
               {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}>Select Your Product to Order</Text> */}
               <Text  style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Regular',marginTop:30,marginHorizontal:-215}}>{this.state.searchmsg}</Text>
        </View>
        <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.ScrollView}
                scrollEnabled={scrollEnabled}
                horizontal={true}
                onContentSizeChange={this.onContentSizeChange}>
              <FlatList
                  data={this.state.JSONResult}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  
                  keyExtractor={(item, index) => toString(index)}
                  ItemSeparatorComponent={this.renderSeparator}

              />
             
          </ScrollView>
          </View>
        );
    }
    sampleRenderItem = ({ item }) => (
      
      <TouchableOpacity onPress={() =>this.unsentclickPress(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row", width:70}}>
            <TouchableOpacity style={{height: 100, width: 60,marginHorizontal:39}}>
                <Image transition={false} source={require('../components1/images/og.png')} style={{ height: 40, width: 40, marginTop: 30,marginHorizontal:25, resizeMode: 'contain' }} />
            </TouchableOpacity>
           
            <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',fontSize:10,marginTop:90,marginHorizontal:-90,width:60,textAlign:'center'}}>{item.name_value_list.name.value}</Text>
            <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 60, marginTop: 33,marginHorizontal:78, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:80}}>
              {(item.name_value_list.id.value!=undefined)?
            <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:17}}>{item.name_value_list.id.value.substring(1, 8)}</Text>:
             <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:17}}></Text>}
            <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

    <Text style={{marginHorizontal:-10, color: '#34495A',fontWeight:"500",fontFamily:'Lato-Regular',fontSize:12}}>Last Updated:{item.name_value_list.date_entered.value}</Text>
     
    
     
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>
      
    )

    sampleRenderItem1 = ({ item }) => (
       <TouchableOpacity   onPress={() =>this.unsentclickPress(item)}>  
  <View style={styles.flatliststyle}>
  <ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
    <View style={{flexDirection:'row'}}>
    <View style={{flexDirection:"row"}}>
    
            <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39}}>
            <Image transition={false} source={this.imgloc} style={{ height: 80, width: 80, marginTop: 40,marginHorizontal:0, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <Image source={require('./images/line.png')} style={{ height: 100, width: 10, marginTop: 33,marginHorizontal:0, resizeMode: 'contain' }} />
            </View>
            <View style={{marginHorizontal:10,}}>
    <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.name_value_list.id.value.substring(1, 8)}</Text>
      <Image source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />
      <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:10,width:190,marginHorizontal:-10}}>{item.name_value_list.name.value}</Text>
      <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontSize:12,marginTop:10,marginHorizontal:-10,fontWeight:"500"}}>Last Ordered:{item.name_value_list.date_entered.value}</Text>
    </View>

    </View>
 </ImageBackground>
 </View>
  
</TouchableOpacity>

    )
}





export default OrderGuide;

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
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
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