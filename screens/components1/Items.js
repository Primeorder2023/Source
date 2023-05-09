import React from 'react';
import { SearchBar } from 'react-native-elements';
//import react in our code. 
import { StyleSheet, FlatList, Text, View, Alert ,Image} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import all the components we are going to use. 

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
      // ItemArray:[
      //   {itemID:'0001', description:'Strawberies', Price:'$12.7',imgloc:require('../components1/images/itemImage/strawberry.png')},
      //   {itemID:'0002', description:' Egg', Price:'$12.7',imgloc:require('../components1/images/itemImage/egg.png')},
      //   {itemID:'0003', description:'Wine', Price:'$12.7',imgloc:require('../components1/images/itemImage/wine.png')},
      //   {itemID:'0004', description:'Coconut', Price:'$12.7',imgloc:require('../components1/images/itemImage/coconut.png')},
      //   {itemID:'0005', description:'Bread', Price:'$12.7',imgloc:require('../components1/images/itemImage/bread.png')},
      //   {itemID:'0006', description:'Hot Dog', Price:'$12.7',imgloc:require('../components1/images/itemImage/hotdog.png')},
      //   {itemID:'0007', description:'Sandwich', Price:'$12.7',imgloc:require('../components1/images/itemImage/sandwich.png')},
      //   {itemID:'0008', description:'Blueberries', Price:'$12.7',imgloc:require('../components1/images/itemImage/blueberries.png')}]
  // ,
      FlatListItems: [],
      search: ''
    };
    
  }
  updateSearch = search => {
    this.setState({ search });

  };
  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#d3d0d8'}}/>
    );
  };
  Loading=()=>{
    Alert.alert('Screen will be loaded soon')
  }
  increment=()=>{
    Alert.alert('Increment')
  }
  decrement=()=>{
    Alert.alert('decrement')
  }
  GetItem(item) {
    //Function for click on an item
    Alert.alert(item);
  }
  componentDidMount(){
    // this.setState(this.state.FlatListItems=this.state.ItemArray);
  }
  GoBack(){

    }
  render() {
    const { search } = this.state;  
    return (
      
      <SafeAreaView style={styles.MainContainer}>
        <View style={{backgroundColor:'#ffffff', height:40,flexDirection:'row'}}><Text style={{fontSize:23, color:'#534D64'}}>SKU's</Text></View>
        <SearchBar
        placeholder="Search items"
        onChangeText={this.updateSearch}
        value={search}
        lightTheme={false}
        round={true} 
        style={{marginStart:0, borderRadius:10, width:200}}
      />
        <FlatList
          data={this.state.FlatListItems}
          //data defined in constructor
          ItemSeparatorComponent={this.FlatListItemSeparator}
          //Item Separator View

          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <View style={{flex:1, flexDirection: 'column', height:100, borderRadius:10, backgroundColor:'#ffffff'}}>
            {/* <View style={{flex:1, flexDirection: 'row', height:100}}>
              <TouchableOpacity onPress={this.Loading}>
              <Image source={item.imgloc} style={styles.imageView}/>
              </TouchableOpacity>
              <Text
                style={styles.item1}
                onPress={this.GetItem.bind(this, 'ItemId : '+item.itemID+' Description : '+item.description)}>
                {item.itemID}
              </Text>
              <Text style={{marginTop:10, marginHorizontal:60, fontSize: 13,color:'grey',}}>{item.Price}</Text>
              <Text style={{marginVertical:35,marginLeft:-210,width:90,fontSize: 13, color:'grey',}}>{item.description}</Text>

              <View style={{flex:0,flexDirection:'row',marginLeft:120 ,marginTop:10, height:40 , backgroundColor:'#dddddd',borderRadius:1} }> 
              
              <Text
                style={styles.item2}
                  onPress={this.increment}>
                +
              </Text>
              <Text
                style={styles.item2}>
              0
              </Text>
              <Text
                style={styles.item2}
                onPress={this.decrement}>          
               -
              </Text>
              </View> 
              </View> */}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 0,
    backgroundColor:'#d3d0d8'
  },
  imageView: {
 
    width: 70,
    height: 70 ,
    margin: 7,
    borderRadius : 7,
    borderColor:'black',
    resizeMode: 'contain'
},
 
  item1: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color:'grey',
    fontWeight:'bold'
  },
  item2: {
    marginTop:-2,
    padding: 10,
    fontSize: 18,
    height: 44,
    alignItems:"center",
    color:'#534D64'
  },
});