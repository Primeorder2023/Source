import React, { Component } from 'react';
import { Text,StyleSheet, Dimensions,View ,Image,FlatList, ScrollView,ImageBackground,TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
let screenwidth= Dimensions.get('window').width;
let screenheight= Dimensions.get('window').height;
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
const Constants = require('../components1/Constants');

import {TextInput} from "react-native-paper"
let data = [{
  value: 'Room 1',
}, {
  value: 'Room 2',
}, {
  value: 'Room 3',
}];
let rackdata = [{
  value: 'Rack 1',
}, {
  value: 'Rack 2',
}, {
  value: 'Rack 3',
}];
let Scannedvalue = ''

const SET_DATAURL= Constants.SET_URL;
 class AddItemToList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      warehouseid:"",
      QR_Code_Value:"",
      Start_Scanner: false,
      arrayHolder:[  
        {key: 'ProductID',placeholder:"Enter the ProductID",value:""},{key: 'Product Description',placeholder:"Enter the Description",value:""}, {key: 'Manufacturer',placeholder:"Enter the Manufacturer",value:""},{key: 'Category',placeholder:"Enter the Category",value:""},  
        {key: 'Sub-Category',placeholder:"Enter the Sub-Category",value:""},{key: 'Product Class',placeholder:"Enter the Product Class",value:""},{key: 'UPC/Barcode',placeholder:"Enter the UPC",value:""},  
        {key: 'Qty On Hand',placeholder:"Enter the Qty on Hand",value:""}, {key: 'Base Price',placeholder:"Enter the Base Price",value:""},  
        {key: 'UOM',placeholder:"Enter the UOM",value:""},{key: 'Size',placeholder:"Enter the Size",value:""},{key: 'Weight',placeholder:"Enter the Weight",value:""},  
        {key: 'Pack',placeholder:"Enter the Pack",value:""}, {key: 'Extra Info 1',placeholder:"Enter the Extra Info1",value:""},{key: 'Extra Info 2',placeholder:"Enter the Extra Info 2",value:""},  
        {key: 'Extra Info 3',placeholder:"Enter the Extra Info 3",value:""},{key: 'Extra Info 4',placeholder:"Enter the Extra Info 4",value:""},{key: 'Extra Info 5',placeholder:"Enter the Extra Info 5",value:""}  
    ],
      itemID:"",
      desc:"",
      mfd:"",
      category:"",
      sub_cat:"",
      class:"",
      upc:"",
      moq:"",
      on_hand:"",
      base:"",
      Selling:"",
      cost1:"",
      cost2:"",
      uom:"",
      size:"",
      weight:"",
      pack:"",
      ext1:"",ext2:"",ext3:"",ext4:"",ext5:"",
      value:"",
      data:"",
      text:"gfgggg",
      refresh:false,
      screenHeight:"",
      textInputs: [],
      crateid:"",
      id:"",
    rackid:"",
    row_id:"",
     mfd:"",
     qty:"",
     bindetails:[]
    }
  }
  openLink_in_browser = () => {

    // Linking.openURL(this.state.QR_Code_Value);

  }
  

  searchFilterFunction=(text,index)=>{
    var iarray=commonData.getSkuArray();
  const arr=iarray.filter(item=>item.itemid==text);
  if(arr.length>0){
    Alert.alert("Warning","Item Already present")
    this.state.arrayHolder[index].value="";
    this.forceUpdate();
    return;
  }
    this.state.arrayHolder[index].value=text;

     this.forceUpdate();

  }

  sampleRenderItem = ({ item ,index}) => (
  
<View style={{width:width-50}}>

<TextInput
       label={item.key}
               
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"

underlineColorAndroid="transparent"
onChangeText={username => this.searchFilterFunction(username,index)}
clearButtonMode="always"
// ref={username => { this.textInput = username }}

style={{
backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',
marginTop: 10,

}}
value={item.value}
/>
</View>


    
  )
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };
  renderSeparator = () => {  
    return (  
        <View  
            style={{  
                height: 0,  
                width: "100%",  
                backgroundColor: "#000",  
            }}  
        />  
    );  
};  
updatebindetails=(id,val)=>{
  if(commonData.checksessionid()==false){
    return;
  }
  var that=this;
  const listarray= that.state.bindetails.entry_list;
  var binarray=[];
  console.log(that.state.bindetails.entry_list,"listarray")
  for(var i=0;i<listarray.length;i++){
  binarray.push({id:listarray[i].name_value_list.id,barcode:listarray[i].name_value_list.barcode.value,available:Number(listarray[i].name_value_list.capacity.value)-Number(listarray[i].name_value_list.onhand.value),capacity:listarray[i].name_value_list.capacity.value,onhand:listarray[i].name_value_list.onhand.value})
 console.log(binarray) 
 }
  var array=binarray.filter(item=>item.id==value)
 if(array[0].available>val){
   Alert.alert("Warning","Please choose different crate to store item.")
  return;
 }
  
   
   that.forceUpdate();
  var url =SET_DATAURL
  var onhandval=Number(val);
  fetch(url, {
 method: 'POST',
 body: JSON.stringify({
   __module_code__: "PO_27",
   __query__: "id='"+id+"'",
   __session_id__:commonData.getsessionId(),
   __name_value_list__:{
     "id": id,
     "onhand":onhandval
   }
 })
}).then(function (response) {
 return response.json();
}).then(function (result) {
console.log("bin updated",id,onhandval,result) ;
that.forceUpdate();
}).catch(function (error) {
 console.log("-------- error ------- " + error);
});
}
componentDidMount(){
  this.state.warehouseid=this.props.navigation.getParam('warehouseid','660e1742-bedf-2782-d381-632d7e0f7736')
  this.state.rackid=this.props.navigation.getParam('rackid','')
  const item=this.props.navigation.getParam('item','')
  this.state.row_id=this.props.navigation.getParam('rowid','')
  this.state.crateid=this.props.navigation.getParam('crateid','')
  this.state.bindetails=this.props.navigation.getParam('bindetails','')
  var itemdetails =this.props.navigation.getParam('itmdetails',commonData.getinventoryItemsArray());

  this.state.arrayHolder[0].value=this.props.navigation.getParam('itemid','')
  
  this.state.arrayHolder[1].value=this.props.navigation.getParam('desc','')
  this.state.arrayHolder[8].value=this.props.navigation.getParam('price','')
  this.state.id=this.props.navigation.getParam('id','')
  this.state.arrayHolder[6].value=this.props.navigation.getParam('upc','')
  this.state.arrayHolder[11].value=this.props.navigation.getParam('weight','')
  this.state.arrayHolder[11].value=Number(this.state.arrayHolder[11].value);
  this.state.arrayHolder[7].value=this.props.navigation.getParam('onHand','')

  if(itemdetails!=undefined){
  this.state.arrayHolder[2].value=itemdetails.mfd;
  this.state.arrayHolder[3].value=itemdetails.category
  this.state.arrayHolder[4].value=itemdetails.subcategory
  this.state.arrayHolder[5].value=itemdetails.class
  this.state.arrayHolder[9].value=itemdetails.uom
  this.state.arrayHolder[10].value=itemdetails.size
  this.state.arrayHolder[12].value=itemdetails.pack
  this.state.arrayHolder[13].value=itemdetails.extrainfo1
  this.state.arrayHolder[14].value=itemdetails.extrainfo2
  this.state.arrayHolder[15].value=itemdetails.extrainfo3
  this.state.arrayHolder[16].value=itemdetails.extrainfo4
  this.state.arrayHolder[17].value=itemdetails.extrainfo5
  }

  this.forceUpdate();
 
  let editable = true;
  if(this.state.arrayHolder[0].value!="")
  {
    
   editable=false;
  }
  for(var i=0;i<this.state.arrayHolder.length;i++){
    if(this.state.arrayHolder[i].key=="ProductID" && editable==false)
      this.state.arrayHolder[i].editable=editable
    else
    this.state.arrayHolder[i].editable=true
  }
}
updateinventorydetails=(id,val)=>{
  var that=this;
  var url =SET_DATAURL
      fetch(url, {
 method: 'POST',
 body: JSON.stringify({
   __module_code__: "PO_26",
   __query__: "id='"+id+"'",
   __session_id__:commonData.getsessionId(),
   __name_value_list__:{
     "rackid":that.state.rackid,
     "row_id":that.state.row_id,
     "warehouseid":that.state.warehouseid,
     "itemid":id,
     "qty":val,
     "name":"From Inventory"+that.state.rackid
   }
 })
}).then(function (response) {
 return response.json();
}).then(function (result) {
console.log("Inventory Updated") ;




that.forceUpdate();
}).catch(function (error) {
 console.log("-------- error ------- " + error);
});
}
submitebuttonPressed=()=>{
  var that=this;
  var last_modified=commonData.getCurrentDate1();
  fetch(SET_DATAURL, {
    method: 'POST',
    body: JSON.stringify({
      __module_code__: "PO_19",
      __query__: "",
      __session_id__:commonData.getsessionId(),
      __name_value_list__:{
       "itemid":that.state.arrayHolder[0].value,
       "part_number":that.state.arrayHolder[0].value,
       "description":that.state.arrayHolder[1].value,
       "product_image":"http://143.110.178.47/OrdoCRM7126/upload/3C4CE90C-B9D6-CC8B-5A6B-3CC60A83E131_619nZU7iyGL._SL1500_.jpg",
        "maincode":that.state.arrayHolder[0].value,
        "type":"",
        "currency_id":"-99",
        "hsn":that.state.arrayHolder[0].value,
        "tax":"5%",
        "manufactured_date_c":last_modified,
        "cost":that.state.arrayHolder[8].value,
       "name":that.state.arrayHolder[1].value,
       "price":that.state.arrayHolder[8].value,
       "dfd_price_c":that.state.arrayHolder[8].value,
       "mfd_price_c":that.state.arrayHolder[8].value,
       "retail_price":that.state.arrayHolder[8].value,
       "baseprice_c":that.state.arrayHolder[8].value,
       "qty_c": that.state.arrayHolder[7].value,
       "upc_c": that.state.arrayHolder[6].value,
       "category": that.state.arrayHolder[3].value,
       "subcategory_c": that.state.arrayHolder[4].value,
       "unitofmeasure_c": that.state.arrayHolder[9].value,
       "pack_c": that.state.arrayHolder[12].value,
       "size_c":that.state.arrayHolder[10].value,
       "weight_c":that.state.arrayHolder[11].value,
       "extrainfo1_c":that.state.arrayHolder[13].value,
       "extrainfo2_c":that.state.arrayHolder[13].value,
       "extrainfo3_c":that.state.arrayHolder[13].value,
       "extrainfo4_c":that.state.arrayHolder[13].value,
       "extrainfo5_c":that.state.arrayHolder[13].value,
       "extrainfo6_c":that.state.arrayHolder[13].value,
       "stock_c":that.state.arrayHolder[7].value,
       "manufacturer_c":that.state.arrayHolder[2].value,
       "class_c":that.state.arrayHolder[5].value
      }
    }
)
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    console.log("Added Item to Server",result.id)
   var ItemArray=[];
    ItemArray.push({id:that.state.id,
      itemid:that.state.arrayHolder[0].value,
      description:that.state.arrayHolder[1].value,
      mfd:that.state.arrayHolder[2].value,
      category:that.state.arrayHolder[3].value,
    sub_cat:that.state.arrayHolder[4].value,
    class:that.state.arrayHolder[5].value,
    UPC:that.state.arrayHolder[6].value,
    stock:that.state.arrayHolder[7].value,
    base_price:that.state.arrayHolder[8].value,
    uom:that.state.arrayHolder[9].value,
    size:that.state.arrayHolder[10].value,
    weight:that.state.arrayHolder[11].value,
    pack:that.state.arrayHolder[12].value,
    exta1:that.state.arrayHolder[13].value,
    exta2:that.state.arrayHolder[14].value,
    imgsrc:"http://143.110.178.47/OrdoCRM7126/upload/B022C166-1888-4421-11C9-2F9C5A4E1060_Screenshot 2022-09-21 at 12.47.12 PM.png",
    exta3:that.state.arrayHolder[15].value,
    exta4:that.state.arrayHolder[16].value,
    exta5:that.state.arrayHolder[17].value
    });
    
    // commonData.setinventoryItemsArray(ItemArray);
    that.props.navigation.goBack();
    that.addnewItemRelationship(result.id,"660e1742-bedf-2782-d381-632d7e0f7736")
    that.updatebindetails(that.state.crateid,that.state.arrayHolder[7].value);
    that.updateinventorydetails(that.state.arrayHolder[0].value,"1")


  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
  
}

  addnewItemRelationship=(itemid,wid)=>{
    var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    "__id__": wid,
    "__pid__": itemid
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("http://143.110.178.47/OrdoCRM7126/setwarehousedetails.php", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }

submitebuttonPressed1=()=>{
  var itemdetails =this.props.navigation.getParam('itmdetails','');

  var ItemArray =[...commonData.getinventoryItemsArray()];
  let index =ItemArray.indexOf(item=>item.itemid==this.state.arrayHolder[0].value);
  ItemArray.splice(index,1);
ItemArray.push({id:this.state.id,
  itemid:this.state.arrayHolder[0].value,
  description:this.state.arrayHolder[1].value,
  mfd:this.state.arrayHolder[2].value,
  category:this.state.arrayHolder[3].value,
sub_cat:this.state.arrayHolder[4].value,
class:this.state.arrayHolder[5].value,
UPC:this.state.arrayHolder[6].value,
stock:this.state.arrayHolder[7].value,
base_price:this.state.arrayHolder[8].value,
uom:this.state.arrayHolder[9].value,
size:this.state.arrayHolder[10].value,
weight:this.state.arrayHolder[11].value,
pack:this.state.arrayHolder[12].value,
exta1:this.state.arrayHolder[13].value,
exta2:this.state.arrayHolder[14].value,
imgsrc:itemdetails.imgsrc,
exta3:this.state.arrayHolder[15].value,
exta4:this.state.arrayHolder[16].value,
exta5:this.state.arrayHolder[17].value
});

commonData.setinventoryItemsArray(ItemArray);
this.props.navigation.goBack();
  return;
    
    
  }

//handling onPress action  
getListViewItem = (item) => {  
   
}  
  render() {
    const scrollEnabled = true;
    return (
      <SafeAreaView style={{ backgroundColor: '#FFFFFF',flex:1}}>
    <View style={{ backgroundColor: '#FFFFFF'}}>
                 <View style={{flexDirection:'row',marginTop:10}}>
       <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
         </TouchableOpacity> 
           <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 19,width:width-90, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',alignSelf:'center',textAlign:"center",justifyContent:'center',fontFamily:"Lato-Regular",marginTop:20}}>Add Item details</Text>
     </View> 
     </View>
      <ScrollView 
    contentContainerStyle={{
        flexDirection: 'row',
        alignSelf:'center',
        width:width-20,
        flexWrap: 'wrap'}}
      >
      {this.state.arrayHolder.map((item, index) => {
        console.log(index);

        return (
          <TextInput
       label={item.key}
       type="outlined"
          placeholderTextColor='#dddddd'
          underlineColor='#dddddd'
          activeUnderlineColor='#dddddd'
          outlineColor="#dddddd"
          selectionColor="#dddddd"
          autoCompleteType='off'
          autoCorrect={false}
keyboardType="default"
underlineColorAndroid="transparent"
onChangeText={username => this.searchFilterFunction(username,index)}
clearButtonMode="always"
style={{
backgroundColor:'white',
width:screenwidth-60,
color: '#534F64',
marginTop: 5,
height:50,
}}
value={item.value}
/>
        );
      })}
    </ScrollView>
    
     <View style={{paddingBottom:30}}>
      <TouchableOpacity onPress={()=>{this.submitebuttonPressed()}} style={{flexDirection:'row',borderRadius: 20,alignSelf:'center',backgroundColor: '#011A90', width: screenwidth-100, height: 40 ,marginTop:10}}>
           <Text style={{ width: screenwidth-100,color:'white',fontSize: 16,borderRadius: 20,fontFamily:'Lato-Regular',alignSelf:'center', height: 40, textAlignVertical:'center',backgroundColor:  '#011A90',textAlign:'center' ,alignSelf:'center'}}>Submit</Text>
         </TouchableOpacity>
         </View>
         {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}



const styles=StyleSheet.create({
ScrollView:{
flexGrow:1,
},
flatliststyle: {
marginTop: 0,
height: 200,
width:screenwidth+30,
backgroundColor:'#FFFFFF' ,
marginHorizontal: -30,
alignSelf:'center',
marginVertical: -40,
resizeMode:"contain"
},
textOrder: {
    color: '#FF7D6B',
    fontSize:20,
    // fontWeight:'bold'

 },
 textPrime: {
  color: '#534F64',
  fontSize:20,
  // fontWeight:'bold'
},

 flatrecord: {
  // marginTop: -1,
  height: 180,
  width:screenwidth+30,
  backgroundColor:'#FFFFFF' ,
  // marginHorizontal: -30,
  alignSelf:'center',
  // marginVertical: -30,
  resizeMode:"stretch"
  },
  container: {  
    flex: 1,  
},  
item: {  
    padding: 10,  
    marginHorizontal:10,
    fontSize: 15,  
    height: 44,  
    width:150,
    fontFamily:'Lato-Regular'
},  
TouchableOpacityStyle:{
   
    height: 40, width: 40
   },
  
   FloatingButtonStyle: {
  
     resizeMode: 'contain',
     width: 40,
     height: 40,
   }
})
export default AddItemToList;