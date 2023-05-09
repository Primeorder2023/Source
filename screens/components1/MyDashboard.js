



import React, { Component } from 'react';
import Carousel from 'react-native-banner-carousel';
import { Text, View,Dimensions, FlatList,ActivityIndicator, Modal,TextInput,StyleSheet, Button, AppRegistry, ScrollView, Linking, Alert, TouchableOpacity, Image, TouchableNativeFeedbackBase } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemArrayAdded } from '../components1/SKU'
import CommonDataManager from './CommonDataManager';
import { Card, Row } from 'native-base'
import { withNavigation } from "react-navigation";
import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
const{height}=Dimensions.get("window");
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; 
import TextTicker from 'react-native-text-ticker'
import moment from 'moment';
let commonData = CommonDataManager.getInstance();
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

// import HSNZ from "react-native-marquee";
//FB#24
import PercentageCircle from 'react-native-percentage-circle';

let screenwidth= Dimensions.get('window').width;
let screenheight= Dimensions.get('window').height;
const BannerWidth = screenwidth-20;
const BannerHeight = screenheight/4-20;
const{width}=Dimensions.get("screen")
const connection_error='Could not Sync With the Server.Try again later'
let connnctionFailed=false
const Constants = require('../components1/Constants');
if(screenwidth>375){
  screenwidth=120;
}else{
 screenwidth=110;
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(1, 26, 144, ${opacity})`,
  strokeWidth: 1, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};
import Map from "./Map";
import { ceil } from 'react-native-reanimated';
 class MyDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      activequatername:"",
      activeqtrper:0,
      assigned_orders:0,
      completedorderes:0,
      target:0,
      achieved:0,
      annual_per:0,
      sales_result:"",
      bardata : {
        labels: ["Qtr1", "Qtr2", "Qtr3", "Qtr4"],
        datasets: [
          {
            data: [
              0,
              0,
              0,
              0
            ]
          }
        ]
      }
    }
  }
   
   
   componentWillMount(){
     this.setState({loading:true});
   this.getSalesDetails();
    }
    
 
  
 
    loadsalesDetails=()=>{

      const today = moment();
      var month = Number(today.format('MM'));
     
      if(month>=1 && month<=3){

      this.setState({activequatername:"Quarter-1",
    assigned_orders:Number(this.state.sales_result.q1_target),
  completedorderes:Number(this.state.sales_result.q1_achieved_target)});
      }
      else  if(month>=4 && month<=6){
      this.setState({activequatername:"Quarter-2",
      assigned_orders:Number(this.state.sales_result.q2_target),
    completedorderes:Number(this.state.sales_result.q2_achieved_target)});
      }
      else  if(month>=7 && month<=9){
      this.setState({activequatername:"Quarter-3",
      assigned_orders:Number(this.state.sales_result.q3_target),
    completedorderes:Number(this.state.sales_result.q3_achieved_target)});
      }
      else  if(month>=10 && month<=12){
      this.setState({activequatername:"Quarter-4",
      assigned_orders:Number(this.state.sales_result.q4_target),
    completedorderes:Number(this.state.sales_result.q4_achieved_target)});
      }
      this.setState({target:this.state.sales_result.annual_target,achieved:this.state.sales_result.annual_achieved_target});
      this.setState({activeqtrper:(Number(this.state.assigned_orders/this.state.completedorderes)*100).toFixed(2)});
      this.setState({annual_per:(Number(this.state.achieved/this.state.target)*100).toFixed(2)})

    }
    getSalesDetails=()=>{
      var username= commonData.getusername();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");
      myHeaders.append("Cookie", "sugar_user_theme=SuiteP");
      
      var raw = "{\"__username__\":\""+username+"\"}";
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("https://dev.ordo.primesophic.com/get_sales_proforma_user.php", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result);
          this.setState({sales_result:result})
          let bardataset=[];
          bardataset.push(result.q1_achieved_target);
          bardataset.push(result.q2_achieved_target);
          bardataset.push(result.q3_achieved_target);
          bardataset.push(result.q4_achieved_target);
         var tempbardata={
          labels: ["Qtr1", "Qtr2", "Qtr3", "Qtr4"],
          datasets: [
            {
              data: bardataset
            }
          ]
        };
        
        this.setState({bardata:tempbardata});
        this.loadsalesDetails();
        this.setState({loading:false});
        })
        .catch(error => console.log('error', error));
    }
  render() {
  
   const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };
   if(this.state.loading==true){
     return(  <View style={{ flex: 1,justifyContent:'center', backgroundColor:'#FFFFFF'}}>
     <ActivityIndicator
            animating = {true}
            color = {'#011A90'}
            size = "large"/>
          
     <Text style={{alignSelf:'center',color:'#21283d'}}> Loading,Please wait</Text>
      </View>);
   }
   
    return (
      <SafeAreaView style={{ backgroundColor: 'white',flex:3}}>
       {/* Header View  */}
      <View style={{backgroundColor:"green",flex:1.4,flexDirection:'column'}}> 
      {/* Title and Back button*/}
      <View style={{backgroundColor:"white",flex:0.2,width:width,justifyContent:'center'}}>
        <View style={{width:width,flexDirection:'row',alignSelf:'center',justifyContent:'center',alignItems:'center',flex:1}}>
        <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center',flex:0.1 }} onPress={()=>this.props.navigation.goBack()}>           
                 <Image source={require('../components1/images/arrow.png')} style={{height:35,width:35,  resizeMode:"contain", alignSelf:'center'}} />
          </TouchableOpacity> 
        <Text style={{textAlign:'center',fontFamily:'Lato-Bold',fontSize:20,color:'#011A90',flex:0.8,width:width-35}}>Sales Performa</Text>
        <TouchableOpacity style={{borderRadius:20, height:60,width:60, justifyContent:'center', alignItems:'center',flex:0.1 }}>           
          </TouchableOpacity> 
        </View>
      </View>
      {/* Partition View  */}
      <View style={{backgroundColor:"white",flex:0.8,flexDirection:'row'}}>
      <View style={{backgroundColor:"#ffffff",borderBottomWidth:1,borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0,borderColor:'#a5a5a5',flex:1,justifyContent:'center',width:width/2,alignItems:'center'}}>
      <View style={{flex:1}}>
      <View style={{flex:0.7, justifyContent:'center'}}>
      <Text style={{alignSelf:'center',color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',marginTop:-20}}>Target Accomplished</Text>

<Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14, marginTop:0, alignSelf:'center'}}>{this.state.activequatername}</Text>

    <View style={{alignSelf:'center',marginTop:20}}>

    <PercentageCircle textStyle={{color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',fontSize:24}} radius={50} percent={this.state.activeqtrper} color={"#011A90"}></PercentageCircle>  
  </View>
   </View>
   <View style={{flex:0.3}}>
    <Text></Text>
    <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14}}>Assigned Orders:{this.state.assigned_orders}</Text>
    <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14}}>Completed Orders:{this.state.completedorderes}</Text>
    </View>
    </View>
  
      </View>
      <View style={{backgroundColor:"#ffffff",borderBottomWidth:1,borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0,borderColor:'#a5a5a5',flex:1,justifyContent:'center',width:width/2,alignItems:'center'}}>
      <View style={{flex:1}}>
      <View style={{flex:0.7, justifyContent:'center'}}>
      <Text style={{alignSelf:'center',color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',marginTop:-20}}>Annual Sales</Text>

      <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14, marginTop:0, alignSelf:'center'}}>FY-2023</Text>

<View style={{alignSelf:'center',marginTop:20}}>
    <PercentageCircle textStyle={{color:'#011A90',fontFamily:'Lato-Bold',fontWeight:'700',fontSize:24}} radius={50} percent={this.state.annual_per} color={"#011A90"}></PercentageCircle>  
    </View>
   </View>
   <View style={{flex:0.3, alignSelf:'center'}}>
    <Text></Text>
    <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14}}>Target:{this.state.target}</Text>
    <Text style={{color:'grey',fontFamily:'Lato-Bold',fontSize:14}}>Achieved:{this.state.achieved}</Text>
    </View>
    </View>
  
      </View>
      </View>
      </View>
      {/* Middle View  */}
      <View style={{backgroundColor:"White",flex:1.2}}>
      <View style={{justifyContent:'center'}}>
  <Text style={{height:40,color:"#011A90",fontSize:18,textAlignVertical:'center',width:width-20,alignSelf:'center',fontFamily:'Lato-Regular', fontWeight:'600'}}>Annual Performace FY 2023</Text>
  <BarChart
  style={{
    marginVertical: 8,
    borderRadius: 16,
    alignSelf:'center'
  }}
  data={this.state.bardata}
  width={Dimensions.get("window").width-20} // from react-native
  height={220}
  yAxisLabel=""
  chartConfig={{
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(1, 26, 144, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(1, 26, 144, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "2",
      strokeWidth: "0",
      stroke: "#011A90"
    }
  }}
  verticalLabelRotation={30}
/>
  
</View>
      </View>
      {/* Bottom View  */}
      <View style={{backgroundColor:"white",flex:0.3}}>
      <TouchableOpacity style={{alignSelf:'center',marginTop:10,width:150,height:40,backgroundColor:'#ffffff',  shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.5, marginHorizontal:5,
shadowRadius: 2,borderRadius:10,
elevation: 4 }} onPress={()=>      this.props.navigation.navigate('Orderwisereport',{"sales":this.state.sales_result})
}>
              <Text style={styles.textSign}>My Performance</Text>
       
                    </TouchableOpacity>   
      </View>       
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  textSign: {
    color: '#011A90',
    fontWeight: '300',
    fontFamily:'Lato-Regular',
    alignSelf:'center',
    marginTop:10
  },
 
  });
export default MyDashboard;