import React from "react";
import { Component } from "react";
import { View,Dimensions } from "react-native";
import Timeline from 'react-native-timeline-flatlist'
const{height}=Dimensions.get("window");
const {width}=Dimensions.get("screen")
class PastDelivery extends Component{
    constructor(){
        super()
        this.data = [
          {time: '1', title: 'Event 1', description: 'Event 1 Description'},
          {time: '2', title: 'Event 2', description: 'Event 2 Description'},
          {time: '3', title: 'Event 3', description: 'Event 3 Description'},
          {time: '4', title: 'Event 4', description: 'Event 4 Description'},
          {time: '5', title: 'Event 5', description: 'Event 5 Description'}
        ]
      }
    
    
    render(){
        return(
        <View style={{backgroundColor:"white",flex:1}}>
          <View style={{height:50,width:width}}>

          </View>
             <Timeline
              data={this.data}
            />
        </View>);
    }

}
export default(PastDelivery);