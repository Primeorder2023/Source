
import React, { Component } from 'react';
import { Text,Keyboard,ImageBackground,Dimensions,TextInput, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,FlatList, ScrollView,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import CommonDataManager from './CommonDataManager';

var RNFS = require('react-native-fs');
import {images} from './images/images'
var orderid=[]
const Constants = require('../components1/Constants');

// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const GET_DATAURL=Constants.GET_URL;
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class OrderGuidelist extends Component {
    
    constructor(props) {
        super(props);
        this.getListCall= this.getListCall.bind(this);
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
           // The screen is focused
           // Call any action
     
          //  this.ReloadItems();
           });
       }
     
       ReloadItems(){
         this.setState({
           loading:false
         })
         let uname= commonData.getusername()
         RNFS.readDir(RNFS.DocumentDirectoryPath+'/unsent_folder' + '/'+uname)
            .then((result) => {
              console.log('GOT RESULT form extenal directory', result);
             //  this.state.unsentlist = result;
              this.state.tempArray=commonData.getunsentlist(result);
              let sortedarray= this.state.tempArray.sort((a, b) => (a.TimeStamp < b.TimeStamp) ? 1 : -1)
              this.state.data=sortedarray
              commonData.setUnsetfilearray(this.state.tempArray);
              this.forceUpdate();
              console.log(  this.state.unsentlist,"here is my")
              return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
              if (statResult[0].isFile()) {
                // if we have a file, read it
                return RNFS.readFile(statResult[1], 'utf8');
              }
      
              return 'no file';
            })
            .catch((err) => {
              console.log(err.message, err.code);
            });
          //console.log(this.state.unsentlist, "unsent list he+++++++++++++++++++re")
          this.forceUpdate();
        }
     
       unsentclickPress1=(index)=>{
         var that=this;
       let currentArra=[]
       let uname= commonData.getusername()
       var dir = RNFS.DocumentDirectoryPath + '/unsent_folder' + '/'+ uname+'/';
       var path = dir+index.id;
       var pathvar = index.id.substring(3,index.id.length-5);
       commonData.setOrderId(index.id)
       commonData.setContext('OG')
        currentArra.push({ itemid: index.name_value_list.productid.value, description: index.name_value_list.productdescription.value, price: index.name_value_list.baseprice.value, qty: index.name_value_list.size.value, imgsrc: this.state.itemImage,weight:index.name_value_list.weight.value});

       commonData.setArray(currentArra)
       //tmpArray.push({ itemid: itmArray[i].name_value_list.productid.value, description: itmArray[i].name_value_list.productdescription.value, price: itmArray[i].name_value_list.baseprice.value, qty: itmArray[i].name_value_list.size.value, imgsrc: this.state.itemImage,weight:itmArray[i].name_value_list.weight.value});

        console.log(currentArra,"my path is her*******hhh**************e please check")
       that.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:path,From:'OG',TYPE:"" })
        return;
       console.log(index.id,"my path is here please check")
       var that = this
      //  RNFS.readFile(path, 'utf8')
      //      .then((contents) => {
      //        console.log(contents);
      //        currentArra = JSON.parse(contents)
      //        commonData.setUnsentOrders(currentArra)
      //        that.setState({
      //          contentsvariable:contents
      //        })
      //        contentlocal=contents
      //         console.log(commonData.getUnsentOrders(), "props to the next screen is here")
      //         commonData.setContext('OG')
      //         commonData.setArray(currentArra)
      //         that.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:path,From:'OG',TYPE:"" })
      //         commonData.setUnsentOrders(this.state.contentsvariable);
      //   })
     }


//--------------------------------------------------end------------------------------------------------------------------

    componentDidMount() {
        this.getListCall();
        
    }
    getListCall() {
        this.state.value=''
        this.state.searchmsg=''
       var  oid= this.props.navigation.getParam('orderid','')
        var that = this;
        this.makeRemoteRequest();
        // here we are quering po_user.username using post method ........
        fetch(GET_DATAURL, { 
            method: "POST",
                     body: JSON.stringify({
                        "__module_code__": "PO_11",
                        "__module_name__": "PackageProducts",
                        "__session_id__":commonData.getsessionId(),
                        "__query__": "",
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
  const itemData = `${item.name_value_list.productid.value.toUpperCase()} ${item.name_value_list.productdescription.value.toUpperCase()}`;
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
        const scrollEnabled = this.state.screenHeight > height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        console.log(this.state,"testing1")

        if (this.state.loading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
              <ActivityIndicator />
              <Text style={{fontFamily:'Lato-Bold'}}>Loading Items, Please wait.</Text>
            </View>
          );
        }
        return (
       
        <View style={{backgroundColor:'#F5FDFE',flex:1}}>
            <View style={{marginTop:30}}>
            <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{  color: '#5B139A',backgroundColor:'#F5FDFE', fontSize: 20, height: 50,marginHorizontal:10, marginTop: -50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center"}}>PackageProducts Details</Text>
            </View>
        <View style={{flexDirection:'row',backgroundColor:'#F5FDFE',alignContent:'center',justifyContent:'center',width:'100%'}}>  
                
{/* //onPress={() => { this.props.navigation.navigate('OrderGuide') }} */}




        <TouchableOpacity style={{height: 34, width: 70,margin:2,padding:2,paddingLeft:6,margin:9}} onPress={() => { this.props.navigation.navigate('OrderItem') }}>
                     <Image source={require('../components1/images/add.png')} style={{marginTop:-10, height: '200%', width:'100%' }} />
                    </TouchableOpacity>  


                <TextInput  placeholder="Enter Product # or Name" 
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
                       {/* <Image transition={false} source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, height: '200%', width:'100%' }} /> */}
                
                <Text style={styles.textSign}>Clear</Text>
                {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}

                      </TouchableOpacity>  
                   {/* <TouchableOpacity style={{height: 60, width: 70}} onPress={() => this.searchFilterFunction('')}>
                     <Image source={require('../components1/images/cleartxt.png')} style={{marginTop:-13, paddingRight:2 ,height: '200%', width:'80%' }} />
                    </TouchableOpacity>   */}
                    
         </View>
         <View>
         
         </View>
        {/* <View style={{backgroundColor:'#F5FDFE',height:50,marginLeft:20, flexDirection:"row",marginHorizontal:30}}> */}
        {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>Select Your Store to Place the Order</Text> */}
        <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30,fontWeight:"500"}}>{this.state.searchmsg}</Text>
                 <View style={{height:100, backgroundColor:'#F5F9FF',marginTop:5,marginHorizontal:0,alignContent:'center',width:width}}>
                     <View style={{marginHorizontal:30,marginTop:8,height:100}}>
                <Text style={{color:'#34495A',fontFamily:'Lato-Bold',marginTop:-10,fontWeight:"500"}}>Order Summary</Text>
                 <Text style={{marginTop:-20, fontSize:17, color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>{this.state.customername}</Text>
                 <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>Ordered Date: {this.state.OrderedDate}</Text>
                 <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>Total Items: {this.state.Items}</Text>
                 <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>Total Size:      {this.state.size}</Text>
                 <Text style={{color:'#34495A',fontFamily:'Lato-Regular',fontWeight:"500"}}>Total Price:      {this.state.baseprice}</Text>
                 </View>
                 </View>
                 <ScrollView style={{ backgroundColor: '#F5FDFE',}} 
                contentContainerStyle={styles.ScrollView}
                scrollEnabled={scrollEnabled}
                horizontal={true}
                onContentSizeChange={this.onContentSizeChange}>
        <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#F5FDFE',marginTop:10}}>
              <FlatList
                  data={this.state.JSONResult}
                  renderItem={this.sampleRenderItem}
                  extraData={this.state.refresh}
                  keyExtractor={(item, index) => toString(item)}
                  ItemSeparatorComponent={this.renderSeparator}

              />
            </View> 
          </ScrollView>
            </View>
          
        );
    }
    sampleRenderItem = ({ item }) => (
      <TouchableOpacity
      onPress={()=>this.unsentclickPress1(item)}
     >  
        <View style={styles.flatliststyle}>
        <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
          <View style={{flexDirection:'row'}}>
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39,marginTop:10}}>
              <Image source={this.getImageforItemid(item.name_value_list.productid.value)} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:0, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:100,marginHorizontal:-100,fontWeight:"500"}}>{item.name_value_list.category.value}</Text>
          <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 25,marginHorizontal:83, resizeMode: 'contain' }} />
          </View>
          <View style={{marginHorizontal:-110,}}>
          <Text style={{marginHorizontal:-10,marginTop:30,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.name_value_list.category.value}</Text>
            {/* <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: 200 gms</Text> */}
            <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
            {/* <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190}}>{item.name_value_list.description.value}</Text> */}
            <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:10,width:190}}>Quantity Ordered : {item.name_value_list.weight.value}</Text>
          </View>
          <Text style={{color:'#FF8DB8',borderBottomColor:'#7A7F85',fontWeight:'900',fontFamily:'Lato-Bold',marginTop:20,marginHorizontal:99}}>₹{Number(item.name_value_list.baseprice.value)}</Text>
          </View>
       </ImageBackground>
       </View>
       </TouchableOpacity>
    )
}





export default OrderGuidelist;

const styles=StyleSheet.create({
    flatliststyle: {
        marginTop: -10,
    height: 200,
    backgroundColor:'#F5FDFE' ,
    marginHorizontal: -30,
    alignSelf:'center',
    // elevation: 3,
    marginVertical: -40,
    resizeMode:"contain"
            },
            textSign: {
              color: '#011A90',
              fontWeight: 'bold',
              fontFamily:'Lato-Bold',
              alignSelf:'center',
              marginTop:10
            },
        textOrder: {
            color: '#00ACEA',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold',
            fontFamily:'Lato-Bold'
            // fontWeight:'bold'
        
          },
          textPrime: {
            color: '#34495A',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold',
            fontFamily:'Lato-Bold',
            fontWeight:"500"
            // fontWeight:'bold'
          },
          flatrecord: {
            marginTop: -1,
            paddingVertical:10,
            height: 180,
            width:width+50,
            backgroundColor:'#F5FDFE' ,
            // marginHorizontal: -30,
            alignSelf:'center',
            // marginVertical: -30,
            resizeMode:"stretch"
            },
             shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
            content: {
                flexGrow: 1,
                justifyContent: "space-between",
                padding: 10,
              },
              ScrollView:{
                flexGrow:1,
              },
})