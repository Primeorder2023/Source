import React, { Component } from 'react';
import { Text, View,StyleSheet,Image,TouchableOpacity,TextInput,Alert,ScrollView,FlatList,Dimensions} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {Card} from 'native-base'
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class Itemdetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID:'0001',
            description:'Strawberries',
            onHand:'23',
            MOQ:'12',
            LastOrdered:'23/08/2019',
            itemImage:'',
            search: '',
            qty:'',
            Sourcefile:'',
            price:'',
            weight:'',
            name:"",
            id:"",
            longdesc:"",
            hsn:""
    }
    }
   
    ArrowForwardClick=()=>{
        Alert.alert("Loading soon")
    }
    Back=()=>{
      var temparray=commonData.getCurrentArray();
      const filteredData = temparray.filter(item => item.qty !== 0);
      commonData.setArray(filteredData)
 
    }
    AddItem = (Qty,type) => {
        if(commonData.isOrderOpen==true){
          let TYPE =commonData.getContext();
          
          if(TYPE=="RETURN"){
            if(Qty==0|| type=="+" ||type=="-"){
            Alert.alert('Warning','You cannot change the quantity of the item in Return Orders')
            
            // Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            return;
            }
          }
          if(commonData.context=="OG"&&Qty==0){
            Alert.alert('Warning','Items cannot be added to the Bundled Orders')
            return;
          }
        let qtyval = Number(Qty)
        if(type=='+'){

        qtyval=qtyval+1; 
        }
         else if(type =='-'){
          if(qtyval>0)
          qtyval=qtyval-1;
         }
            this.state.qty=qtyval.toString()
        //Update the FlatList
        //11-Sept-2019
        //#Issue fixed for Updating Qty from 0
        var temparray=commonData.getCurrentArray();
        if(commonData.isOrderOpen==true)
        {
          
        const newData =temparray.filter(item =>item.itemid.includes(this.state.itemID))
          if(newData.length==0){
            temparray.push({ id:this.state.id,itemid: this.state.itemID, description: this.state.description, price: this.state.price, qty: this.state.qty, imgsrc: this.state.itemImage,upc:this.state.upc,weight:this.state.weight,name:this.state.name,stock:this.state.onHand});
          }
          
        }
         for(var i=0; i<temparray.length;i++){
           if(temparray[i].itemid==this.state.itemID){
              temparray[i].qty =Number(qtyval)
              if(qtyval==0){
                this.state.qty=0
                temparray.splice(i,1)
              }
              break;
           }
         }
         commonData.setArray(temparray)
          this.forceUpdate();
        }else{
          Alert.alert('Alert','You do not have an open order to add items.')
        }
      commonData.setContext('ID')
    }
    getvalueforkey=(key)=>{
     let skuarray= commonData.getSkuArray();
     const filterarray= skuarray.filter(item=>item.itemid==this.state.itemID);
     var result= commonData.escape(filterarray[0][key])
     return result;
    }
    componentWillMount(){
      this.state.itemID=this.props.navigation.getParam('storeID','')
      this.state.longdesc=this.props.navigation.getParam('longdesc','')
      this.state.description=this.props.navigation.getParam('desc','')
      this.state.onHand=this.props.navigation.getParam('onHand','')
      this.state.itemImage=this.props.navigation.getParam('itemImage','')
      var qtyvalue=this.props.navigation.getParam('qty','0');
      this.state.qty=qtyvalue.toString();
      this.state.Sourcefile=this.props.navigation.getParam('from','')
      this.state.price=this.props.navigation.getParam('price','0')
      this.state.upc=this.props.navigation.getParam('upc','')
      this.state.weight=this.props.navigation.getParam('weight','')
      this.state.name=this.props.navigation.getParam('name','');
      this.state.id=this.props.navigation.getParam('id','');
      this.state.hsn=this.props.navigation.getParam('hsn','');
    }
    


    render() {

      var message="You cannot add item to the bundled orders";
      // if(this.state.onHand<this.state.qty)
      //   message="You cannot order  more than the onHand Qty"
     
        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
          <View style={{flex:1}}>
          <View style={{flex:0.1,backgroundColor:'white',alignItems:'center',flexDirection:'row'}}>
          <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center'}} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
          <Text style={{  color: '#011A90',backgroundColor:' #FFFFFF', fontSize: 16,marginHorizontal:0,fontFamily:'Lato-Regular' ,fontWeight:'500',fontSize:18,alignSelf:'center',textAlign:"left",justifyContent:'center',width:width}}>Item Details</Text>
          </View>
          <View style={{flex:0.9,backgroundColor:'white'}}>
          <View style={{flex:0.5,backgroundColor:'white'}}>
          <Image  style={{marginTop:0, width:"80%", height:"80%",resizeMode:'contain',alignSelf:"center"}} source={{uri:this.state.itemImage}}></Image>
          <View style={{width:260,marginTop:-20, height:52,alignSelf:'center',flexDirection:'row',borderRadius:5, borderColor: 'grey', backgroundColor: '#ffffff',justifyContent:'center',alignContent:'space-between'}}>
                     <TouchableOpacity style={{width:50,height:52}} onPress={()=>{(commonData.getContext()!='OG')?this.AddItem(this.state.qty,'-'):Alert.alert("Warning",message)}}>
                     <Image source={require('./images/minus.png')} style={{width:40, height:40,marginTop:10} }></Image>
                    </TouchableOpacity>
                    <TextInput 
                label=""
               
                  type="outlined"
                  placeholderTextColor='#dddddd'
                  underlineColor='#dddddd'
                  activeUnderlineColor='#dddddd'
                  outlineColor="#dddddd"
                  selectionColor="#dddddd"
                  autoCompleteType='off'
                  autoCorrect={false}
                  style={{
                    textAlign:'center',textAlignVertical:'center',justifyContent:'center',backgroundColor:'white',borderWidth: 1, borderColor:  '#CAD0D6',color:'#000000', fontSize:12,marginTop:10, width:100, height:40,fontFamily:'Lato-Regular'}}
                    onChangeText={(value) =>{this.AddItem(value,"=")} }
                    value={this.state.qty}
                    ></TextInput>
                     <TouchableOpacity style={{width:50,height:52}} onPress={()=>{(commonData.getContext()!='OG')?this.AddItem(this.state.qty,'+'):Alert.alert("Warning",message)}}>

                     <Image source={require('./images/add.png')} style={{width:40, height:40,marginTop:10,alignSelf:'center'}}></Image>
                    </TouchableOpacity>
                    </View>
          </View>
          <View style={{flex:0.5,backgroundColor:'#e6eeff', flexDirection:'column'}}>
          <Text style={{marginTop:10,color:'#34495A',fontWeight:"700", width:100,fontFamily:'Lato-Regular',fontSize:20,width:width-20,alignSelf:'center'}}>{this.state.description}</Text>    
          <Text style={{marginTop:5,color:'red',fontWeight:"500", width:100,fontFamily:'Lato-Regular',fontSize:16,width:width-20,alignSelf:'center'}}>₹{Number(this.state.price).toFixed(2)}</Text>    
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"500", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center',marginTop:30}}>Description</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"300", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center'}}>{this.getvalueforkey("ldescription")}</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"300", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center',marginTop:20}}>Item Code : {this.getvalueforkey("itemid")}</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"300", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center',marginTop:0}}>HSN : {this.getvalueforkey("hsn")}</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"300", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center'}}>Product UPC Code : {this.state.upc}</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"300", width:100,fontFamily:'Lato-Regular',fontSize:14,width:width-20,alignSelf:'center'}}>MOQ : {this.state.MOQ}</Text>     
          <Text style={{marginTop:0,color:'#34495A',fontWeight:"700", width:100,fontFamily:'Lato-Regular',fontSize:12,width:width-20,alignSelf:'center'}}>On hand Stock : {this.state.onHand}</Text>     
        

          </View>

          </View>
          </View>
            </SafeAreaView>
        );
    }
    
}



const styles=StyleSheet.create({
    
    textOrder: {
        color:'#34495A',
        fontSize:20,
         fontWeight:'bold',
         marginTop:5,
         fontWeight:"500"
  
     },
     textPrime: {
      color:'#34495A',
      fontSize:20,
       fontWeight:'bold',
       marginTop:5,
       fontWeight:"500"
   },
    image:{
        height:30,
        width:30,
        marginHorizontal:30,
        marginTop:30
        
    },
    big: {
        
        fontWeight: 'bold',
        fontSize: 13,
        borderColor: 'black',
        borderWidth: 1,
        marginTop:20, marginHorizontal:40, color:'grey', fontWeight:'bold', width:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        
},
TextComponentStyle: {

    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  },
  TextComponentStyle1:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color:  '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  },
  TextMOQ:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : "white",
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 10,

    textAlign: 'center',

    margin: 10,
    width:200
  },
  TextOrdered:{
    borderRadius: 5,

    // Set border width.
    borderWidth: 2,
 
    // Set border Hex Color Code Here.
    borderColor: 'gray',

    // Setting up Text Font Color.
    color: '#34495A',

    // Setting Up Background Color of Text component.
    backgroundColor : 'white',
    
    // Adding padding on Text component.
    padding : 2,

    fontSize: 12,

    textAlign: 'center',

    margin: 10,
    width:200 
  }
})
export default Itemdetails;