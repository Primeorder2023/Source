import React, { Component } from 'react';
import { Text,TextInput, Keyboard,View, FlatList,Dimensions, Alert,ImageBackground, TouchableOpacity ,StyleSheet,SafeAreaView,ScrollView,Image,ActivityIndicator} from 'react-native';
import CommonDataManager from './CommonDataManager';
let commonData = CommonDataManager.getInstance();
var RNFS = require('react-native-fs');
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
import LinearGradient from 'react-native-linear-gradient';
class unsentscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
       tempArray:[],
       loading:true,
       contentsvariable:'',
       value:'',
       searchmsg:'',
       data:[],
       screenheight:height,
    }
  }
  componentWillMount() {
     const { navigation } = this.props;
      this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action

      this.ReloadItems();
      });
  }
gettotalprice=(item)=>{

}
gettotalqty=(item)=>{

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

  unsentclickPress=(filename)=>{
    var callfunction=commonData.getCurrentDate()
  let currentArra=[]
  let uname= commonData.getusername()
  console.log(this.state.tempArray,"my result of temparary is here")
  console.log(filename.orderid,"item order id is here")
  console.log(filename.orderstatus,"order status is here")
  console.log(filename.name,"hi my filename is here..............")
  var dir = RNFS.DocumentDirectoryPath + '/unsent_folder' + '/'+ uname+'/';

  var path = dir+filename.orderid;
  var pathvar = filename.orderid.substring(3,filename.orderid.length-5);
  // commonData.setOrderId(pathvar)
  commonData.setcurrentfile(filename.name);
  var custid = filename.customerid;
  var custname = filename.custname;
  var address=filename.address;
// commonData.setCustInfo(custid,custname,address)
  console.log(path,"my path is here please check")
  var that = this
  RNFS.readFile(path, 'utf8')
      .then((contents) => {
        console.log(contents);
        var filecontent=JSON.parse(contents);
        console.log("file contents",filecontent[0].record[0],"*****items",filecontent[0].items);
        pathvar = filecontent[0].record[0].oid.substring(3,filecontent[0].record[0].oid.length-5);
        commonData.setOrderId(pathvar)
      
        commonData.setCustInfo(filecontent[0].record[0].custid,filecontent[0].record[0].cname)
        // currentArra = JSON.parse(filecontent[0].items)
        currentArra=filecontent[0].items;
        commonData.setUnsentOrders(currentArra)
        that.setState({
          contentsvariable:contents
        })
        contentlocal=contents
         console.log(commonData.getUnsentOrders(), "props to the next screen isrecord[0] here")
         commonData.setContext('UN')
         commonData.setArray(currentArra)
         that.props.navigation.navigate('OrderItem',{PATH:currentArra,PATH1:path,From:'UN',TYPE:"" })
         commonData.setUnsentOrders(this.state.contentsvariable);
   })
}

searchFilterFunction = (text) => {  
  this.state.searchmsg=''
  this.setState({
    value: text,
  });
if(text.length<=0){
  this.setState({ tempArray: this.state.data }); 
  Keyboard.dismiss();
    return
} 
 
 const newData = this.state.tempArray.filter(item => {      
   const itemData = `${item.orderid.toUpperCase()} ${item.orderstatus.toUpperCase()}  ${item.customerid.toUpperCase()}`;
  
    const textData = text.toUpperCase();
     
    return itemData.indexOf(textData) > -1;    
 });
 this.setState({ tempArray: newData }); 
 if(newData.length==0){
   this.state.searchmsg='Order not found'
   Keyboard.dismiss();
   
 }
 this.forceUpdate();
};
onContentSizeChange=(contentwidth, contentheight)=>{
  this.setState({screenheight:contentheight})
}
  render() {
    const scrollEnabled=this.state.screenheight>height;
    this.state.searchmsg=this.state.tempArray.length+' Results'
    const { search } = this.state.value;
   if (this.state.loading) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
        </View>
    );
}
return (
  <View style={{backgroundColor:'#FFFFFF',flex:1}}>
      <View style={{marginTop:30,width:width-30,alignSelf:'center'}}>
            <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{  color: '#011A90',backgroundColor:'#FFFFFF', fontSize: 20, height: 50,marginHorizontal:10, marginTop: -50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center"}}>Saved Orders</Text>
            </View>
 
      <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%',marginTop:5,width:width-30,alignSelf:'center'}}> 
                <TextInput  placeholder="Enter Order# or Name" 
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
                style={{marginHorizontal:10, 
                  width:width-140,
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
                   
              <Text style={styles.textSign}>Clear</Text>
             
                    </TouchableOpacity>  
                 
        </View>
    <View style={{backgroundColor:'#FFFFFF',height:55,marginLeft:20, flexDirection:"column"}}>
           {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20}}>Select Your Product to Order</Text> */}
           <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:20,fontWeight:"500"}}>{this.state.searchmsg} found</Text>
    </View>
  
    <View style={{flexGrow:1,marginTop:-30,height:90}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:0,height:height-200}}>
                    <FlatList
                        data={this.state.tempArray}
                        renderItem={this.sampleRenderItem}
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

sampleRenderItem = ({ item }) => (

<TouchableOpacity
       onPress={() =>this.unsentclickPress(item)
      }> 
<View style={styles.flatliststyle}>
<ImageBackground source={require('../components1/images/itembg.png')} style={styles.flatrecord}>
  <View style={{flexDirection:'row'}}>
  <View style={{flexDirection:"row",width: 80}}>
          <TouchableOpacity style={{height: 100, width: 80,marginHorizontal:39}}>
              <Text style={{backgroundColor:'orange',textAlign:'center',textAlignVertical:'center', height: 40, width: 40, marginTop: 40,borderRadius:30,fontFamily:'Lato-Regular',fontSize:18}}>UN</Text>
          </TouchableOpacity>
          <Text  style={{color:'#011A90',fontFamily:'Lato-Regular',marginTop:90,width: 60,marginHorizontal:-120}}>{item.orderstatus}</Text>
          <Image transition={false} source={require('./images/line.png')} style={{ height: 100, width: 80,marginHorizontal:95, marginTop: 33, resizeMode: 'contain' }} />
          </View>
          <View style={{marginHorizontal:60}}>
          <Text style={{marginHorizontal:-10,marginTop:40,fontSize:15, color: '#34495A',fontFamily:'Lato-Bold',fontSize:17,fontWeight:"500"}}>{item.oid.substring(1, 8)}</Text>
          <Image transition={false} source={require('../components1/images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain',marginHorizontal:-10 }} />

  <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>{item.TimeStamp.substring(3,25)}</Text>
  <Text style={{marginHorizontal:-10, color: '#011A90',fontFamily:'Lato-Bold',fontSize:14}}>{item.customerid}</Text>
  <View style={{flexDirection:'row'}}>
      <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total SKUs: {item.cnt}</Text>
      <Text style={{marginHorizontal:30, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>Total price: {item.cntP}</Text>
      </View>
  <Text style={{marginHorizontal:-10, color: '#34495A',fontFamily:'Lato-Regular',fontSize:12,fontWeight:"500"}}>{item.type}</Text>
 
  </View>

  </View>
</ImageBackground>
</View>

</TouchableOpacity>

)
}
export default unsentscreen;

const styles=StyleSheet.create({ container: {
  flex: 1,
  backgroundColor: "#f5f5f5",
},
scrollview: {
  flexGrow: 1,
 

},
content: {
  flexGrow: 1,
  justifyContent: "space-between",
  padding: 10,
  
  
  
},
 flatliststyle: {
  marginTop: -5,
  // overflow: 'hidden',
  height: 150,
  borderRadius: 10,
  backgroundColor:'white' ,
  marginHorizontal: 10,
  // elevation: 3,
  marginVertical: 1,
  flex:1,
  },
  signIn: {
    width: 100,
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


  flatrecord: {
    // marginTop: -1,
    height: 180,
    width:width+30,
    backgroundColor:'#FFFFFF' ,
    // marginHorizontal: -30,
    alignSelf:'center',
    // marginVertical: -30,
    resizeMode:"stretch",
    },
    content: {
      flexGrow: 1,
      justifyContent: "space-between",
      padding: 10,
    },

})