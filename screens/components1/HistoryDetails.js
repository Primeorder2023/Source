import React, { Component } from 'react';
import { Text,Keyboard,Dimensions, View,StyleSheet,Image,TouchableOpacity,Alert,SafeAreaView,TextInput,FlatList, ScrollView,ActivityIndicator,ImageBackground} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from './CommonDataManager';
var orderid=[]
// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const GET_DATAURL='http://csardent.com/primeorder/get_data_s.php'
let commonData = CommonDataManager.getInstance();
var storeData=commonData.getstoresArray()
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
import LinearGradient from 'react-native-linear-gradient';
class HistoryDetails extends Component {
    
    constructor(props) {
        super(props);
        this.getListCall= this.getListCall.bind(this);
        this.calculateRunningTotals= this.calculateRunningTotals.bind(this);
        this.state = {       
        search: '',
        loading: false,
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
        screenHeight: height,
        arary:[],
        searchmsg:'',
    }
     this.arrayholder = [];
    }

    
   
    componentWillMount() {
      const { navigation } = this.props;
      this.focusListener = navigation.addListener("didFocus", () => {
        this.getListCall();

       this.calculateRunningTotals();
      });
        
    }
    componentDidMount(){
      var address=this.props.navigation.getParam('address')
        this.forceUpdate();
    }
    getListCall() {
       
        var that =this
        let temparray=[]
        let itemArray=commonData.getSkuArray()
        let listItemID=this.props.navigation.getParam('IT','');
        console.log(itemArray,'+++++++++++++',listItemID)
     
        for(var i=0;i<listItemID.length;i++){
        
            for(var j=0;j<itemArray.length;j++){
                if(listItemID[i].itemid == itemArray[j].itemid)
                {
                    console.log(itemArray[j].itemid)
                    if(Number(itemArray[j].stock)>0)
                    temparray.push({ itemid: itemArray[j].itemid, description:itemArray[j].description, price: itemArray[j].price, qty:1, imgsrc:itemArray[j].imgsrc,weight:itemArray[j].weight,stock:itemArray[j].stock,noofdays:itemArray[j].noofdays});
                }
            }
        }
        that.setState({JSONResult:temparray,data:temparray,
        loading:false})
        that.calculateRunningTotals();
        that.forceUpdate()
    }

      searchFilterFunction = (text) => {  
        this.state.searchmsg=''
        this.setState({
          value: text,
        });
        if(text.length<=0){
            this.getListCall();
            Keyboard.dismiss()
            return
        } 
        
        const newData = this.state.data.filter(item => {      
          const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
         
           const textData = text.toUpperCase();
            
           return itemData.indexOf(textData) > -1;    
        });
        this.setState({ JSONResult: newData });  
        if(newData.length==0){
          this.state.searchmsg='Item not Found'
          // Keyboard.dismiss()
        }
      };
       calculateRunningTotals=()=>{
            console.log('calculating running totals')
              let Qty=0,price=0
              let Items=this.state.JSONResult.length
              for(var i=0; i<Items;i++){
                Qty=Qty+Number(this.state.JSONResult[i].qty)
                if(this.state.JSONResult[i].price!=null)
                 price=price+(Number(this.state.JSONResult[i].qty)*Number(this.state.JSONResult[i].price))
              }
              this.state.price=price
              this.state.Qty=Qty
              this.state.Items=this.state.JSONResult.length
              this.forceUpdate()
            }
   
        gotoOrderscreen=()=>
        {
            commonData.setContext('HISTORY')
            commonData.setArray(this.state.JSONResult)
            commonData.isOrderOpen=true
            this.props.navigation.navigate('OrderItem',{IT:this.state.JSONResult, From:'HISTORY'})
            

        }
        onContentSizeChange = (contentWidth, contentHeight) => {
            this.setState({ screenHeight: contentHeight });
          };
    render() {
        const scrollEnabled = this.state.screenHeight > height;
        this.state.searchmsg=this.state.JSONResult.length+' Results'
        console.log("json result")
        console.log(this.state.JSONResult)
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                    <Text style={{fontFamily:'Lato-Bold',color:'black'}}>Loading Items Please wait</Text>
                </View>
            );
        }
        return (
            <View style={{backgroundColor:'#FFFFFF',flex:1}}>
            
             <View style={{flexDirection:'row',marginTop:30}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:width/3-10, justifyContent:'center', alignItems:'center' }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image transition={false} source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
            <Text style={{ marginTop:10, color: '#011A90',backgroundColor:' #FFFFFF',fontSize: 20,width:width/3+50, height: 50,fontFamily:'Lato-Regular' ,fontWeight:'bold',fontSize:20,alignSelf:'center',textAlign:"center",justifyContent:'center'}}>History Details</Text>
           
      </View> 
 
            <View style={{flexDirection:'row',backgroundColor:'#FFFFFF',alignContent:'center',justifyContent:'center',width:'100%'}}> 
                <TextInput  placeholder="Enter Product #" 
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
                    borderRadius:10,
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
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
        
                    </TouchableOpacity>  
                    
        </View>
        {/* <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:5,marginHorizontal:30}}>Select Your Product# to Place the Order</Text> */}
        <Text style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:10,marginHorizontal:30,fontWeight:"500"}}>{this.state.searchmsg}</Text>
        <View style={{height:height-290}}>
                {/* <ScrollView
                    style={{ flex: 1}}
                    contentContainerStyle={styles.scrollview}
                    scrollEnabled={scrollEnabled}
                    horizontal={true}
                    onContentSizeChange={this.onContentSizeChange}>
                    <View style={styles.content}>
               
                {/* flatlist accessing using props.............. importing from FSClist class */}
                {/* <FlatList
                    data={this.state.JSONResult}
                    renderItem={this.sampleRenderItem}
                    keyExtractor={(item, index) => toString(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                />
                </View>
                
             </ScrollView> */}
             <View style={{flexGrow:1,marginTop:0,height:300}}>
                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{flexGrow:1,justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',marginTop:10,height:height-320}}>
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
             </View>
            
            <TouchableOpacity style={{justifyContent:'center',alignItems:'center',height:50,width:250,alignSelf:'center',borderRadius:10,borderWidth:1,borderColor:'#011A90'}} onPress={()=>
              Alert.alert(
                //title
                'Note',
                //body
                'Quantity value of the added items will be set to 1.',
                [
                  { text: 'Continue>>', onPress: () => this.gotoOrderscreen() },
                  // { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                ],
                { cancelable: false })}>
                     <Text style={{color:'#011A90',fontFamily:'Lato-Regular',}}>Proceed to Order</Text>
                     {/* <Imge source={require('../components1/images/Proceed.png')} style={{height:100,width:160,alignSelf:'center'}}></Image> */}
                    </TouchableOpacity>

            </View>
          
        );
    }
     sampleRenderItem = ({ item, index }) => (
        
      
            
            
      <View style={styles.flatliststyle}>
      <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
        <View style={{flexDirection:'row'}}>
        <View style={{flexDirection:"row",backgroundColor:'#ffffff',width:100}}>
        <TouchableOpacity style={{height: 80, width: 80,marginHorizontal:19,marginTop:27}} onPress={() => this.props.navigation.navigate('Itemdetails',
                   {storeID:item.itemid,desc:item.description,onHand:item.stock,itemImage:item.imgsrc, qty:item.qty,from:'SKU',price:item.price,upc:item.upc,weight:item.weight})}>
                  <Image source={{uri:item.imgsrc}}  style={{ height: 80, width: 80, marginTop: 10,marginHorizontal:10, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <Text  style={{color:'#34495A',fontFamily:'Lato-Regular',marginTop:120,marginHorizontal:-80,fontWeight:"500"}}>{item.itemid}</Text>
        {/* <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:63, resizeMode: 'contain' }} /> */}
        </View>
        <View style={{marginHorizontal:39,flexDirection:'column'}}>
          <Text style={{color:'#7A7F85',borderBottomColor:'#7A7F85',fontFamily:'Lato-Regular',marginTop:23}}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
          <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
          <Text style={{color:'#34495A',fontWeight:"500",fontFamily:'Lato-Bold',fontSize:14,marginTop:0,width:190,height:35}}>{item.description}</Text>
          {(Number(item.stock)>0)?<Text style={{color:'#1D8815',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>{item.stock} - On Hand</Text>:<Text style={{color:'red',fontFamily:'Lato-Regular',fontSize:12,marginTop:10}}>Out of stock!!</Text>}
          <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:12,marginTop:0}}>{item.noofdays} days Older</Text>
          </View>
          <View style={{height: 20, width: 20,marginHorizontal:-20,flexDirection:'column',alignItems:'center'}}>
       
        <Text style={{color:'#000000',borderBottomColor:'#000000',fontWeight:'100',textAlign:'center',fontFamily:'Lato-Bold',width:60,marginTop:20}}>₹{Number(item.price)}</Text>
        <Text style={{ textAlign: 'center', textAlignVertical: 'center',borderWidth: 1,
                    borderColor: '#CAD0D6', alignContent: 'center', alignSelf: 'center', fontWeight: 'bold', 
                   fontSize: 12, width: 40, height: 30,marginTop:17,marginHorizontal:50}}>{item.qty}</Text>
      
        </View>
      
        </View>
     </ImageBackground>
     </View>
        
       
    )
   
}





export default HistoryDetails;

const styles=StyleSheet.create({
    
        
        textOrder: {
            color: '#00ACEA',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold'
            // fontWeight:'bold'
        
          },
          textPrime: {
            color: '#34495A',
            fontSize: 27,
            marginHorizontal:0,
            fontWeight:'bold',
            fontWeight:"500"
            // fontWeight:'bold'
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
     shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
    textSign: {
        color: '#011A90',
        fontWeight: 'bold',
        fontFamily:'Lato-Bold',
        marginTop:10,
        alignSelf:'center'
      },
            content: {
                flexGrow: 1,
                justifyContent: "space-between",
                padding: 10,
              },
              scrollview: {
                flexGrow: 1,
              },
    
})