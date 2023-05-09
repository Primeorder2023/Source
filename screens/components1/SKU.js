import React, { Component } from 'react';
import { Text,ImageBackground,Dimensions,Keyboard, View, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView, FlatList, ScrollView ,ActivityIndicator} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withNavigation } from "react-navigation";
import CommonDataManager from './CommonDataManager';
import { TextInput } from 'react-native-gesture-handler';
const Constants = require('../components1/Constants');
import LinearGradient from 'react-native-linear-gradient';
import { relativeTimeThreshold } from 'moment';
import { Item } from 'native-base';

var RNFS = require('react-native-fs');
var currentpath = RNFS.DocumentDirectoryPath + '/currentOrder.json';
var skupath = RNFS.DocumentDirectoryPath + '/skuOffline.json';
const GET_DATAURL=Constants.GET_URL;
var ItemArrayAdded=[]
var badgecount=0
let commonData = CommonDataManager.getInstance();
var ItemArray=[]
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")

class SKU extends Component {
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
            showsubstitute:false,
            searchmsg:'',
            screenheight:height,
            itemArrayPricing:[],
            substutearray:[{itemid:"Ig-07",sitem:"Irg-10"},{itemid:"Ig-08",sitem:"Irg-11"},{itemid:"Ig-05",sitem:"Irg-04"}],
            substutearray2:[{itemid:"Irg-96",sitem:"Irg-43"},{itemid:"Irg-08",sitem:"Irg-11"},{itemid:"Ig-05",sitem:"Irg-04"}]

        }
        this.arrayholder = [];
    }
    
    ArrowForwardClick = () => {
        Alert.alert("Loading soon")
    }
    getproductidfor=(id)=>{
      var itemd="";
      var skuarray=commonData.getSkuArray();
      var array=skuarray.filter(item=>item.id==id);
      if(array.length>0)
      itemd=array[0].itemid;
      return itemd;
    }
    getsubstitutearray=()=>{
      var that = this;

      fetch(GET_DATAURL, {
        method: "POST",
        body: JSON.stringify({
          "__module_code__": "PO_21",
          "__session_id__":commonData.getsessionId(),
          "__query__": "",
          "__orderby__": "",
          "__offset__": 0,
          "__select _fields__": [""],
          "__max_result__": 1,
          "__delete__": 0,
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log("The previous order data which come from the server here",result)
        var json = JSON.stringify(result.entry_list);
        console.log(json, "this is for orders list array")
       that.state.substutearray2=[];
       var temparray=[];
       for(var i=0;i<result.entry_list.length;i++){
         temparray.push({itemid:that.getproductidfor(result.entry_list[i].name_value_list.aos_products_id_c.value),sitem:that.getproductidfor(result.entry_list[i].name_value_list.aos_products_id1_c.value)})
       }
       that.setState({substutearray2:temparray})
      that.forceUpdate();
       
      }).catch(function (error) {
        console.log("-------- error ------- " + error);
      });

    }
    calculaterunningTotals() {
      
        let Qtyval = 0
        let PriceVal = 0
        let ItemVAl = this.state.dataList.length

        for (var i = 0; i < ItemVAl; i++) {
          Qtyval = Qtyval + Number(this.state.dataList[i].qty)
          if (this.state.dataList[i].price != null)
            PriceVal = PriceVal + (Number(this.state.dataList[i].qty) * Number(this.state.dataList[i].price))
        }
        console.log(PriceVal,Qtyval,ItemVAl,'++++++++++++')
        commonData.setRunningTotals(PriceVal, Qtyval, ItemVAl)
        
      }
    resignView(){

        ItemArrayAdded=[]
        // if(this.state.isOrderOpen==true)
         ItemArrayAdded=this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded=filteredData
        commonData.setArray(ItemArrayAdded)
         commonData.writedata(currentpath,ItemArrayAdded)
        
    }
    componentDidMount(){
      

        const { navigation } = this.props;
        this.loadPricing();
    commonData.setItemArray(commonData.getSkuArray())
    this.focusListener = navigation.addListener("didFocus", () => {
      this.ReloadItems();
    });
    this.focusListener = navigation.addListener("willBlur", () => {
        this.resignView()
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

synccall(){
   
  var that = this;

  fetch(GET_DATAURL, {
    method: "POST",
    body: JSON.stringify({
      "__module_code__": "PO_20",
      "__session_id__":commonData.getsessionId(),
      "__query__": "",
      "__orderby__": "",
      "__offset__": 0,
      "__select _fields__": [""],
      "__max_result__": 1,
      "__delete__": 0,
    })
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    console.log("The previous order data which come from the server here",result)
    var json = JSON.stringify(result.entry_list);
    console.log(json, "this is for orders list array")
    let tempArray = commonData.gettypeArray(json,'PO_06');
    commonData.setSkuArray(tempArray)
   
  }).catch(function (error) {
    console.log("-------- error ------- " + error);
  });
  this.readorders();
}


async readSku(){
  
  
    // write the fil
  
    RNFS.readFile(skupath, 'utf8')
      .then((contents) => {
        // log the file contents
        console.log("writting files to orders.....................")
        console.log(contents);
        console.log("Json_parse");
        console.log(JSON.parse(contents));
        console.log("Reading Order array from json and use it throughout app using common data manager")
        let tempArray = commonData.gettypeArray(contents,'PO_06')
        commonData.setSkuArray(tempArray)
        console.log("temparay array")
        console.log(tempArray);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
    
   }

ReloadItems(){
  
  this.state.value='';
  this.state.searchmsg=''
  ItemArrayAdded=commonData.getCurrentArray()
  this.getsubstitutearray();
  this.readSku();
  
  ItemArray=commonData.getSkuArray()
  console.log('m here ',ItemArray)
  var type= commonData.getContext();
  if(type=="RETURN"){

  }else{
      if(commonData.isOrderOpen && (ItemArrayAdded.length>0 )){
       
          var temparray=[...ItemArray]
          ItemArray=commonData.getCurrentArray()
              for(var j=0;j<ItemArray.length;j++){
                  var index= temparray.findIndex(obj => obj.itemid === ItemArray[j].itemid);
                      temparray.splice(index,1)
              }
          
          const mergedarray=[...ItemArray,...temparray];
          console.log(mergedarray,'+++++++++merged array')
          ItemArray=mergedarray;
      }
    }
      this.state.dataList=ItemArray;
      this.state.JSONResult=ItemArray;
      commonData.setArray(ItemArray);
      ItemArrayAdded=this.state.dataList
      this.forceUpdate();
        //Sort in Descending Order
        this.state.dataList.sort((a, b) => (a.itemid > b.itemid) ? 1 : -1)
        // ItemArrayAdded=this.state.dataList
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        this.forceUpdate();
       
}

searchFilterFunction = (text) => { 
  var tempaarray=this.state.dataList;

    this.setState({
                value: text,
              });
            if(text.length<=0|| text==""){
              this.setState({JSONResult:this.state.dataList});
                Keyboard.dismiss()
                return
            } 
      const newData = tempaarray.filter(item => {      
      const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });
    this.setState({ JSONResult: newData });  
    
    this.forceUpdate()
  };

    loadsku(){
   
        var that = this;
        this.setState({ loading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
          fetch(GET_DATAURL, {
          method: "POST",
          body: JSON.stringify({
            "__module_code__": "PO_20",
            "__query__":"po_products.deleted=0",
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
          skuArray = result.entry_list;
          console.log("The sku data which come from the server here")
          console.log(skuArray);
  
    // write the file
  
    var json = JSON.stringify(skuArray);
    console.log(json, "this is sku order array list array")
    RNFS.writeFile(skupath, json, 'utf8')
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
      loadPricing=()=>{
   
        var that = this;
        
        that.setState({ loading: true });
       
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        var raw = "{\n\"__module_code__\":\"PO_13\",\n\"__session_id__\":\""+commonData.getsessionId()+"\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}\n";
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://143.110.178.47/primeorder/get_data_ordo.php", requestOptions)
          .then(response => response.json())
          .then(result => {console.log(result.entry_list);
            that.setState({ loading:false });
           that.setState({itemArrayPricing:result.entry_list})
          
          // ItemArray=[...resultArray];
           that.forceUpdate();
          })
          .catch(error => console.log('error', error));


      }
      readSku(){
        RNFS.readFile(skupath, 'utf8')
          .then((contents) => {
            // log the file contents
            console.log("writting files to orders.....................")
            console.log(contents);
            console.log("Json_parse");
            console.log(JSON.parse(contents));
            console.log("Reading Order array from json and use it throughout app using common data manager")
            let tempArray = commonData.gettypeArray(contents,'PO_06')
            commonData.setSkuArray(tempArray)
            console.log("temparay array")
            console.log(tempArray);
          })
          .catch((err) => {
            console.log(err.message, err.code);
          });
       }  
    sycnCall=()=>{
        this.loadsku();
        this.readSku();
      }
      onContentSizeChange=(contentwidth, contentheight)=>{
        this.setState({screenheight:contentheight})
      }
    render() {
      let Title="SKU"
      const scrollEnabled=this.state.screenheight>height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'

        if (this.state.loading==true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                    <ActivityIndicator />
                    <Text>Loading Item , Please wait</Text>
                </View>
            );
        }
        if (this.state.showsubstitute==true) {
          return (
              <View style={{ flex: 1, alignItems: 'center',  alignItems: 'center', justifyContent: 'center' ,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
                 <TouchableOpacity style={{width:width,height:40}} onPress={()=>{this.setState({showsubstitute:false})}}></TouchableOpacity>
                 <View style={{height:500}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-240}}>
                <Text style={{alignSelf:'center',width:width,textAlign:'center',fontFamily:'Lato-Bold',fontSize:19}}>Substitute Items</Text>
                <Text style={{alignSelf:'center',width:width,textAlign:'center',fontFamily:'Lato-Bold',fontSize:19}}></Text>

                    <FlatList
                        data={this.state.substutearray}
                        renderItem={this.substituteView}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>  
               </View>
          );
      }
        return (
           

            <SafeAreaView style={{backgroundColor:'#FFFFFF',flex:1}}>
             
            <View style={{flexDirection:'row',marginTop:30, alignItems:'center', width:width,alignSelf:'center'}}>
            {/*  */}
                <Text style={{  color: '#011A90',alignSelf:'center',backgroundColor:'#FFFFFF',fontSize: 20,width:width, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:22,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>{Title}</Text>
          </View> 
           <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',alignItems:'center',width:"100%"}}> 

                <TextInput  placeholder="Enter Product # or Name" 
                onChangeText={text => this.searchFilterFunction(text)}
                // onChangeText={(value) => this.setState({ value })}
                autoCorrect={false}
                autoCompleteType='off'
                value={this.state.value}
                style={{
                    // width: 250,
                    width:width-140,
                    marginHorizontal:10,
                    height:50,
                    color: '#534F64',
                    borderWidth: 1,
                    // alignSelf:"center",
                    // Set border Hex Color Code Here.
                    borderColor: '#CAD0D6',
                    fontFamily:'Lato-Regular',
                    borderRadius:10,
                    // alignSelf:"center",
                   
                    textAlign:'center'}}></TextInput>
                   <TouchableOpacity style={{alignSelf:'center',width:90,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={() => this.searchFilterFunction('')}>
            
              <Text style={styles.textSign}>Clear</Text>
       
                    </TouchableOpacity>  
                    </View>
                <View style={{backgroundColor:'#ffffff',height:40,width:width-20,alignSelf:'center', flexDirection:"column"}}>
               <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20,fontWeight:"500"}}>{this.state.searchmsg} </Text>
                </View>
               
               <View style={{flexGrow:1,marginTop:-10,height:700}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-240}}>
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
    AddItemToInventory=()=>{ 
      Alert.alert('Alert','You do not have an open order to add items.')
    }
    refreshDAta(){
      alert("c bsvxch")
        this.setState({refresh:!this.state.refresh})        
        ItemArrayAdded=[]
        ItemArrayAdded=this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        // ItemArrayAdded=filteredData
        //Write Data To file
        // commonData.setArray(ItemArrayAdded);
        // commonData.writedata(currentpath,ItemArrayAdded)
        this.forceUpdate();
    }
    AddSubstituteItem=(Qty,item,type)=>{
      var index= -1;
       console.log(this.state.JSONResult.length,"this.state.JSONResult.length")
      for(var t=0;t<this.state.JSONResult.length;t++){
        if(this.state.JSONResult[t].itemid==item.itemid){
        index=t;
        break;
        }
      }
      console.log(this.state.JSONResult,"this.state.JSONResult.length",index)

      this.AddItem(Qty,index,type);
    }
    updatesubstitutearray=(qty,itemid)=>{
      for(var j=0;j<this.state.substutearray.length;j++){
          if(this.state.substutearray[j].itemid==itemid){
          this.state.substutearray[j].qty=qty;
          }
      }
      this.forceUpdate();
    }
    AddItem = (Qty,index,type) => {
    
        if(commonData.isOrderOpen==true){
          let TYPE =commonData.getContext();
          
          if(TYPE=="RETURN"){
            if(Qty==0|| type=="+"){
            Alert.alert('Warning','You cannot add item to the Return Orders')
            
            // Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            return;
            }
          }
          if(commonData.context=="OG"){
            Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            Keyboard.dismiss()
            return;
          }
         
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
        this.updatesubstitutearray(this.state.dataList[index].qty,this.state.dataList[index].itemid);
        //Updates issue fix in Home Tab
        this.calculaterunningTotals();
      //  this.refreshDAta();
        }else{
            Alert.alert('Alert','You do not have an open order to add items.')
            Keyboard.dismiss()
        }
    }
    showsubstituteitems=(sitem)=>{
    
     var temparray= this.state.substutearray2;
     var items=this.state.JSONResult;
     var displayarray=[];
     temparray=temparray.filter(item=>item.itemid==sitem.itemid);
     console.log(items,"dsgcfgdsgdsg")

     for(var k=0;k<temparray.length;k++){
      var itemrecord = items.filter(itemval=>itemval.itemid==temparray[k].sitem)
      console.log(itemrecord,"dsgcfgdsgdsg")
      if(itemrecord.length>0){
        displayarray.push({'itemid':itemrecord[0].itemid,
        'description':itemrecord[0].description,
        'price':itemrecord[0].price,
        'qty':itemrecord[0].qty,'upc':itemrecord[0].upc,
        'category':itemrecord[0].category,
        'subcategory':itemrecord[0].subcategory,
        'unitofmeasure':itemrecord[0].unitofmeasure,
        'manufacturer':itemrecord[0].manufacturer,
        'class':itemrecord[0].class,
        'pack':itemrecord[0].pack,
        'size':itemrecord[0].size,
        'weight':itemrecord[0].weight,
        'extrainfo1':"",
        'extrainfo2':"",
        'extrainfo3':"",
        'extrainfo4':"",
        'extrainfo5':"",
        'imgsrc':itemrecord[0].imgsrc,
        'manufactured_date':itemrecord[0].manufactured_date,
        "stock":itemrecord[0].stock,
        "id":itemrecord[0].id,
        "noofdays":itemrecord[0].noofdays
      })
    
      }
     }
     this.state.substutearray=displayarray;
     console.log( this.state.substutearray,"fsdgfdhg")
     if(displayarray.length>0)
      this.state.showsubstitute=true;
    
      this.forceUpdate();
    }
    qtyvalview=()=>{
      Alert.alert("cvg")
    }
    substituteView = ({ item, index }) => (
        
      <View style={styles.flatliststyle}>
      <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
        <View  style={{flexDirection:'row'}}>
        <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
        <TouchableOpacity  style={{height: 100, width: 100,marginHorizontal:19,marginTop:27}} onPress={() =>{ this.props.navigation.navigate('Itemdetails',
                   {id:item.id,hsn:item.hsn,name:item.description,storeID:item.itemid,desc:item.ldescription,onHand:item.stock,itemImage:require('./images/itemImage/IRG-14.jpg'), qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}}>
            <Image source={{uri:item.imgsrc}} style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
            <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',width:100,textAlign:'center',fontWeight:"500"}}>{item.itemid}</Text>
       
        </TouchableOpacity>
              </View>
              <View style={{marginHorizontal:20,flexDirection:'column'}}>
          <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
          <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
          <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:30}}>{item.description}</Text>
          {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>Current Stock - {item.stock}</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
          {/* <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text> */}
          </View>
          <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
       
        <Text style={{color:'#00000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,height:60,marginTop:20}}>₹{Number(item.price)}</Text>
  
        {/* </View> */}
        </View>
        <View style={{ width: 120, height: 40, flexDirection: 'row',marginTop:88,marginHorizontal:-80, borderRadius: 5, borderColor: 'grey', backgroundColor: '#ffffff' }}>
                {/* <TouchableOpacity onPress={()=>{(Number(item.stock)>0)?this.AddSubstituteItem(Number(item.qty),item,'-'):Alert.alert("Warning","Item is out of Stock")}} style={{ width: 30, height: 40 }}> */}
                <TouchableOpacity onPress={()=>{this.AddSubstituteItem(Number(item.qty),item,'-')}} style={{ width: 30, height: 40 }}>

                    {/* <Image source={require('./images/minus.png')} style={{ width: 30, height: 30, marginTop: 12, marginHorizontal: 6 }}></Image> */}
                    <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>-</Text>
               
                </TouchableOpacity>
                <Text  style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 12,borderRadius:8, width: 40, height: 30,marginTop:12,marginHorizontal:10}}>{Number(item.qty)}</Text>
                {/* <TouchableOpacity onPress={()=>{(Number(item.stock)>0)?this.AddSubstituteItem(Number(item.qty),item,'+'):Alert.alert("Warning","Item is out of Stock")}} style={{ width: 30, height: 40 }} > */}
                <TouchableOpacity onPress={()=>{this.AddSubstituteItem(Number(item.qty),item,'+')}} style={{ width: 30, height: 40 }} >

                    <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>+</Text>
               
                </TouchableOpacity>
            </View>
        </View>
     </ImageBackground>
     </View>
        
       
    )
    changeqtyvalue=(qty,item)=>{
      for(var j=0;j<this.state.JSONResult.length;j++){
        if(this.state.JSONResult[j].itemid==item){
        this.state.JSONResult[j].qty=qty;
        }
    }
    this.forceUpdate();
    }
    sampleRenderItem = ({ item, index }) => (
        
      <View style={styles.flatliststyle}>
      <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
        <View  style={{flexDirection:'row'}}>
        <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
        <TouchableOpacity onLongPress={()=>this.showsubstituteitems(item)} style={{height: 100, width: 100,marginHorizontal:19,marginTop:27}} onPress={() => this.props.navigation.navigate('Itemdetails',
                   {id:item.id,hsn:item.hsn,storeID:item.itemid,desc:item.description,onHand:item.stock,itemImage:item.imgsrc, qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}>
            <Image source={{uri:item.imgsrc}}  style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'center' }} />
            <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',width:100,textAlign:'center'}}>{item.itemid}</Text>
        {/* <Image source={require('./images/line.png')} style={{ height: 100, width: 80,marginHorizontal:90, resizeMode: 'contain' }} /> */}
       
        </TouchableOpacity>
        {/* <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-80}}>{item.itemid}</Text>
        <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:63, resizeMode: 'contain' }} /> */}
        </View>
        <View style={{marginHorizontal:20,flexDirection:'column'}}>
          <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
          <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
          <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:30}}>{item.description}</Text>
          {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:0}}>Current Stock - {item.stock}</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
          {/* <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text> */}
          </View>
          <View style={{height: 20, width: 20,marginHorizontal:-10,flexDirection:'column',alignItems:'center'}}>
        {/* <View style={{height: 20, width: 20, marginTop:27,marginHorizontal:-80}}> */}
         {/* <TouchableOpacity style={{marginTop:30,marginHorizontal:90}} onPress={() => Alert.alert(
            //title
            'Confirmation',
            //body
            'Do you want to delete the selected Item?',
            [
              { text: 'Yes', onPress: () => this.deleteItms(item.itemid) },
              { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
          )}>
        <Image transition={false} source={require('./images/minus2.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
        </TouchableOpacity> */}
        <Text style={{color:'#000000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,height:60,marginTop:20}}>₹{Number(item.price)}</Text>
  
        {/* </View> */}
        </View>
        <View style={{ width: 120, height: 40, flexDirection: 'row',marginTop:88,marginHorizontal:-80, borderRadius: 5, borderColor: 'grey', backgroundColor: '#ffffff' }}>
                {/* <TouchableOpacity onPress={()=>{(Number(item.stock)>0)?this.AddItem(Number(item.qty),index,'-'):Alert.alert("Warning","Item is out of Stock")}} style={{ width: 30, height: 40 }}> */}
                    {/* <Image source={require('./images/minus.png')} style={{ width: 30, height: 30, marginTop: 12, marginHorizontal: 6 }}></Image> */}
                    <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),index,'-')}} style={{ width: 30, height: 40 }}>

                    <Text style={{color:'#000000', textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>-</Text>
               
                </TouchableOpacity>
                <Text  style={{ color:'#000000',textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 12,borderRadius:8, width: 40, height: 30,marginTop:12,marginHorizontal:10}}>{Number(item.qty)}</Text>
{/* <TextInput


label="Coupon Code"
//  placeholder="Enter Coupon Code"              
type="outlined"
placeholderTextColor='#dddddd'
underlineColor='#dddddd'
activeUnderlineColor='#dddddd'
outlineColor="#dddddd"
selectionColor="#dddddd"
autoCompleteType='off'
autoCorrect={false}

keyboardType="default"
autoCapitalize="none"
underlineColorAndroid="#dddddd"
onChangeText={(value) => this.changeqtyvalue(value,item.itemid)}
clearButtonMode="always"

style={{
backgroundColor:'white',
width:width-170,
color: 'red',

}}
value={Number(item.qty)}
/> */}
                {/* <TouchableOpacity onPress={()=>{(Number(item.stock)>0)?this.AddItem(Number(item.qty),index,'+'):Alert.alert("Warning","Item is out of Stock")}} style={{ width: 30, height: 40 }} > */}
                <TouchableOpacity onPress={()=>{this.AddItem(Number(item.qty),index,'+')}} style={{ width: 30, height: 40 }} >

                    <Text style={{color:'#000000', textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
               fontSize: 16,borderRadius:8, width: 40, height: 30,marginTop:11,marginHorizontal:10}}>+</Text>
               
                </TouchableOpacity>
            </View>
        </View>
     </ImageBackground>
     </View>
        
       
    )
}

// export default SKU;
export default withNavigation(SKU);
export {ItemArray,ItemArrayAdded}

const styles = StyleSheet.create({
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
  
    FloatingButtonStyle: {
   
      resizeMode: 'contain',
      width: 40,
      height: 40,
    }
})