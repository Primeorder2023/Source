import React, { Component } from 'react';
import { Text,FlatList,ScrollView,Alert, View,ActivityIndicator ,Image,SafeAreaView,PermissionsAndroid,ImageBackground,Dimensions,TouchableOpacity,StyleSheet} from 'react-native';
import CommonDataManager from './CommonDataManager';
import { Card } from 'native-base'
import PercentageCircle from 'react-native-percentage-circle';
let initdist='t';
let commonData = CommonDataManager.getInstance();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Touchable } from 'react-native';

var moduleexecuted=0;
const{height}=Dimensions.get("screen");
const{width}=Dimensions.get("screen")
class Distributor extends Component {
    constructor(props) {
        super(props);
    
        this.state = { 
            activeqtrper:10,
            list:[],
            syncing:false,
            completed:false
        }
    }
    loadDistributors=()=>{
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "__id__": "c5dffe5a-e0bc-a2a1-c5f3-63103c0dde89"
                });

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("http://143.110.178.47/OrdoCRM7126/get_distributor_ordo_users.php", requestOptions)
                .then(response => response.json())
                .then(result =>{ console.log(result);
                this.setState({list:result})})
                .catch(error => console.log('error', error));

    }

    gettypeArray=(object,code)=> {
       
            // var typeval = await AsyncStorage.getItem('type');
            var typeval =6;
            console.log(object,"code",code)
            let tempArray = []
            if(code=='PO_19')
            {
                for(var i=0; i< object.length;i++)
                {
                tempArray.push({'addressline1': object[i].billing_address_street,
                'addressline2': object[i].billing_address_street_2,
                'country': object[i].billing_address_country,
                'state': object[i].billing_address_state,
                'name': object[i].name,
                'postalcode': object[i].billing_address_postalcode,
                'creditlimit':object[i].creditlimit_c,
                "credit_note":object[i].credit_note,
                'image1':"http://143.110.178.47/OrdoCRM7126/upload/"+object[i].id+"_img_src_c",
                'lastsaleamount':"0",
                'lastpaymentdate':"",
                'lastsaledate':"",
                'description':object[i].description,
                'due_amount_c':object[i].due_amount_c,
                'ispaymentdue':"0",
                'id':object[i].id,
                'email':object[i].email,
                'owner':object[i].ownership,
                'storeid': object[i].storeid_c})
                }
            commonData.setstoresArray(tempArray);
            moduleexecuted++;
            }
            else if(code=='PO_14'){

                for(var i=0; i< object.length;i++)
                {

                tempArray.push({
                'orderid': object[i].id,
                'id': object[i].number,
                'name':object[i].name,
                'record': object[i].name,
                'orderstatus':object[i].approval_status,
                'type':object[i].stage,
                'totalvalue':object[i].total_amount,
                'date_modified':object[i].date_modified,
                'aknowledgementnumber':object[i].number,
                'customerid':object[i].billing_account,
                'po_number':object[i].number,
                'comments':object[i].approval_issue,
                'location':object[i].shipping_address_state,
                'totalitems':object[i].totalitems_c,
                'notes_id':object[i].notes_id,
                'total_amount':object[i].total_amount,
                'address':object[i].shipping_address_street,
                'customername':object[i].billing_account,
                'subtotal_amount':object[i].subtotal_amount,
                'discount_amount':object[i].discount_amount,
                'tax_amount':object[i].tax_amount,
                'shipping_amount':object[i].shipping_amount,
                'total_amount_word':object[i].total_amount_word,
                'delivered_date':object[i].delivered_date,
                'last_modified':object[i].date_modified})
                }
            commonData.setorderssArray(tempArray);
            moduleexecuted++;

            }

            else if(code=='PO_06')
            {

                for(var i=0;i<object.length;i++){
                var pce = Number(object[i].price_c);
                var pricevalue=Number(object[i].price);//Admin
                if(typeval=="4")//Distributor
                pricevalue=object[i].dfd_price_c;
                else if(typeval=="3")//Sales
                pricevalue=object[i].mfd_price_c;
                else if(typeval=="2")//Customer
                pricevalue=object[i].retail_price;

                var days=commonData.checkoutdateditem(object[i].manufactured_date_c);
                if(days<0){
                var imageval=object[i].product_image;
                if(object[i].product_image=="")
                imageval="https://findicons.com/files/icons/305/cats_2/128/pictures.png";
                tempArray.push({
                'itemid':object[i].part_number,
                'description':object[i].name,
                'ldescription':commonData.escape(object[i].description),
                'price':pricevalue,
                'qty':0,'upc':object[i].upc_c,
                'category':object[i].category,
                'subcategory':object[i].subcategory_c,
                'unitofmeasure':object[i].unitofmeasure_c,
                'manufacturer':object[i].manufacturer_c,
                'class':object[i].class_c,
                'pack':object[i].pack_c,
                'size':object[i].size_c,
                "tax":object[i].tax,
                "hsn":object[i].hsn,
                'weight':object[i].weight_c,
                'extrainfo1':object[i].extrainfo1_c,
                'extrainfo2':object[i].extrainfo2_c,
                'extrainfo3':object[i].extrainfo3_c,
                'extrainfo4':object[i].extrainfo4_c,
                'extrainfo5':object[i].extrainfo5_c,
                'imgsrc':imageval,
                'manufactured_date':object[i].manufactured_date_c,
                "stock":object[i].stock_c,
                "id":object[i].id,
                "noofdays":days*-1
                })

                }
                }

            commonData.setSkuArray(tempArray);
            moduleexecuted++;
            
            }
            console.log("modulecode",moduleexecuted);
            if(moduleexecuted==3){
                
            this.setState({completed:true})
            this.completedLoading();
            }
       
    }

    loadData=()=>{
        initdist='f';
        this.forceUpdate();
        commonData.setArray([]);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "__id__": "655fc305-8551-0d98-89b8-640985a2f24d"
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://dev.ordo.primesophic.com/get_distributor_rel_details.php", requestOptions)
            .then(response => response.json())
            .then(result => {
            this.gettypeArray(result.accounts,"PO_19")
            this.gettypeArray(result.quotes,"PO_14")
            this.gettypeArray(result.products,"PO_06")





            })
            .catch(error => console.log('error', error));
    }
    Distributoritems = ({ item, index }) => (
        <View style={styles.flatliststyle1}>  
          <View style={{ flexDirection: "row",justifyContent:'center',alignItems:'center', backgroundColor:'white',width:width-10,alignSelf:'center' ,height:50,borderColor:"grey"}} >
            <Card style={{ height: 40, width: width-30, backgroundColor: 'white',alignSelf:'center',justifyContent:'center',marginBottom:10}}>
            <TouchableOpacity    onPress={()=>{this.loadData()}}>

            <Text style  ={{fontFamily:"Lato-Bold",width:width-30,textAlign:'left',padding:10,color: '#011A90',
            fontFamily:"Lato-Bold",
            fontWeight: 'bold',
            backgroundColor:'white'}}>{item.name}</Text>
            </TouchableOpacity>
            </Card>
          </View> 
        </View>
         
        )
    componentDidMount(){
        if(initdist=='t') 
        this.loadDistributors();
        else{
            this.loadData()
        }
    }
    completedLoading=()=>{
        if(this.state.completed==true)
        this.props.navigation?.navigate("TabScreen");
    }
    render(){
      
        var scrollEnabled=true;
        if(this.state.syncing==true){
            return(<SafeAreaView><View style={{ flex: 1,justifyContent:'center', backgroundColor:'#FFFFFF'}}>
            <View style={{alignSelf:'center',marginTop:20}}>
          
              <PercentageCircle textStyle={{color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',fontSize:24}} radius={50} percent={this.state.activeqtrper} color={"#011A90"}></PercentageCircle>  
            </View>
                  <ActivityIndicator
                         animating = {true}
                         color = {'#011A90'}
                         size = "large"/>
                       
                  <Text style={{alignSelf:'center',color:'#21283d',fontSize:17}} >{this.state.message}</Text>
                  <Text style={{alignSelf:'center',color:'#011A90',fontSize:14,marginTop:5}} >{this.state.loadingmessage}</Text>
                  <Text style={{alignSelf:'center',color:'#21283d',fontSize:14,marginTop:5}} >Please wait, this action may take few hours.</Text>
          
          
                   </View></SafeAreaView>)
        }
        return(
        <SafeAreaView style={{flex:1,justifyContent:'center'}}>
            
            <View style={{height:300,alignSelf:'center'}}>
            <View style={{width:width-20,alignItems:'center',height:50,justifyContent:'center'}}><Text style={{fontSize:17,fontFamily:'Lato-Bold',fontWeight:"700"}}> Choose Distributor</Text></View>

                <ScrollView style={{ backgroundColor: '#FFFFFF',}} 
                contentContainerStyle={styles.scrollview}
                scrollEnabled={scrollEnabled}
                onContentSizeChange={this.onContentSizeChange}>
                <View style={{justifyContent:"space-between",padding:10,backgroundColor: '#FFFFFF',height:height-290}}>
                    <FlatList
                        data={this.state.list}
                        renderItem={this.Distributoritems}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => toString(index,item)}
                        ItemSeparatorComponent={this.renderSeparator} 
                    />
                    </View>
                </ScrollView>
                </View>
        </SafeAreaView>);
    }
    
}
const styles = StyleSheet.create({
    flatliststyle1: {
    
        height: 50,
        alignContent:'center',
        width: width -10,
        alignSelf: 'center',
        resizeMode: "contain",
        borderColor:'grey',
        
      },
      scrollview:{
        // flexGrow:1,
        // height:height-480,
        // justifyContent: "space-between",
        // padding: 10,
      }
})
    export default Distributor;