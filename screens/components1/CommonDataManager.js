'use strict';




var React = require('react-native');

import AsyncStorage from '@react-native-async-storage/async-storage';
var RNFS = require('react-native-fs');
import {images} from '../components1/images/images'
// import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import { getDeviceNameSync } from 'react-native-device-info';
// const GET_DATAURL='http://192.168.9.14:8080/get_data_s.php'
const Constants = require('../components1/Constants');
export default class CommonDataManager {
  _Username=""
  SharedItemArray=[]
    static myInstance = null;
    connection_Status = "ONLINE"
    offercount="0";
    pendingcount="0";
    completedcount="0";
    skucount="0";
    storescount="0";
    orderscount="0";
    _filename=[]
    context=''
    _userID = "";
    _ActiveCustomerID="";
    sessionid=''
    usertype="";
    returnarray=[];
    ogcontext="";
uid="";
    _ActiveCustName="";
    _TotalItems="";
    _TotalQty="";
    _TotalPrice="";
    _ActiveAddress=""
    _OrderId=""
    logintype=""
    _CurrentArray=[]
    _LoadArray = []
  _StoreArray = []
  _OffersArray=[]
  _OrderArray = []
  _SkuArray =[]
  _UnsentArray=[]
  _unsentfilelist=[]
  orderitemArray=[]
  substiArray=[]
  warehouse=[]
  rooms=[]
  racks=[]
  crates=[]
    isOrderOpen=false
    loggedin=false
    isRegistered=false
    inventoryItems=[]
    _PH_POtype=""
    _PH_PONumber=""
    _PH_Comments=""
    _codeDetails="";
    token="";
    email="";
    currentfile="";
    account_id="";
    rewardpoints=0;
    claimproduct="0"
    latitude="";
    longitude="";
    usertype="";
    dueamount=0;
    dueday=0;
    parent_item="";
    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }
    getparentitem(){
      return this.parent_item;
    }
    setparentitem(item){
      this.parent_item=item;
    }
    getusertype(){
      return this.usertype;
    }
    setusertype(type){
      this.usertype=type;
    }
    getdueamount(){
      return this.dueamount;
    }
    setdueamount(value){
      var duemt= value.replace("\\u20b","");
      this.dueamount=duemt;
    }
    getdueday(){
      return this.dueday;
    }
    setdueday(value){
      this.dueday=value;
    }
   
    getClainPoints(){
      return this.claimproduct;
    }
    setclaimpoints(value){
      this.claimproduct=value;
    }
    getlatitude(){
      return this.latitude;
    }
    getlongitude(){
      return this.longitude;
    }
    setcordinates(lat,long){
      this.latitude=lat;
      this.longitude=long;
      console.log(lat,long);
    }
    setclaimpoints(value){
      this.claimproduct=value;
    }
    getusertype(){
      return this.usertype;
    }
    setusertype(value){
      this.usertype=value;
    }
    getPOnumber(){
      return this._PH_PONumber;
    }
    setPOnumber(value){
      this._PH_PONumber=value;
    }
    setwarehousedetails(value){
      this.warehouse=value;
    }
    getwarehousedetails(){
      return this.warehouse;
    }
    setcrateetails(value){
      this.crates=value;
    }
    getcratedetails(){
      return this.crates;
    }
    getoffercount(){
      return this.offercount;
    }
    setoffercount(value){
      this.offercount=value;
    }
    getpendingcount(){
      return this.pendingcount;
    }
    setpendingcount(value){
      this.pendingcount=value;
    }
    getrewardPoints(){
      return this.rewardpoints;
    }
    setrewardpoints(points){
      this.rewardpoints=points;
    }
    getcompletedcount(){
      return this.completedcount;
    }
    setcompletedcount(value){
      this.completedcount=value;
    }
    getaccountid(){
      return this.account_id;
    }
    setaccountid(id){
      this.account_id=id;
    }
    getskucount(){
      return this.skucount;
    }
    setskucount(value){
      this.skucount=value;
    }
    getstorescount(){
      return this.storescount;
    }
    setstorescount(value){
      this.storescount=value;
    }
    getcustomerdetails(){
      return this.customer;
    }
    getorderscount(){
      return this.orderscount;
    }
    setorderscount(value){
      this.orderscount=value;
    }
    getPOType(){
      return this._PH_POtype;
    }
    setPOType(value){
      this._PH_POtype=value;
    }
    getPOComments(){
      return this._PH_Comments;
    }
    setPOComments(value){
      this._PH_Comments=value;
    }
    getusername(){
      return this._Username;
    }
    setusername(name){
      this._Username=name;
    }
    getFBToken(){
      return this.token;
    }
    setFBToken(token){
      this.token=token;
    }
    getemail(){
      return this.email;
    }
    setemail(email){
      this.email=email;
    }
    getLoginType(){
      return this.logintype;
    }
    setLoginType(name){
      this.logintype=name;
    }
    getCouponDetails(){
      return this._codeDetails;
    }
    setCouponDetails(code){
      console.log("coipons applied",code)
      this._codeDetails=code;
    }
    getsessionId(){
      return this.sessionid;
    }
   getuid()
   {
     return this.uid;
   }
   setuid(id){
     this.uid=id;
   }
    setsessionId(Id){
      this.sessionid=Id;
    }
    setArray(array){
      this._CurrentArray=array
     
    }
    setreturnarray(array){
      this.returnarray=array;
    }
    getreturnarray(){
      return this.returnarray;
    }
    setContext(str){
      this.context=str
    }
    getContext() {
      return this.context;
    }
    setOGContext(str){
      this.ogcontext=str
    }
    getOGContext() {
      return this.ogcontext;
    }
    setItemArray(array){
      this.SharedItemArray=array
    }
    getCurrentArray() {
      return this._CurrentArray;
    }
   getItemArray(){

     return this.SharedItemArray;
   }
   getcurrentfile(){
     return this.currentfile;
   }
   setcurrentfile(name){
     this.currentfile=name;
   }
   setstoresArray(array) {
    this._StoreArray = array;
  }
  getstoresArray() {
    return this._StoreArray;
  }
  setoffersArray(array) {
    this. _OffersArray = array;
  }
  getoffersArray() {
    return this._OffersArray;
  }
  setinventoryItemsArray(array) {
    this.inventoryItems = array;
  }
  getinventoryItemsArray() {
    return this.inventoryItems;
  }
  setorderssArray(array) {
    let sortedarray= array.sort((a, b) => (a.date_modified < b.date_modified) ? 1 : -1)

    this._OrderArray = array;
  }
  setSkuArray(array) {
    this._SkuArray = array;
    this.SharedItemArray=array
  }
  getSkuArray() {
    return this._SkuArray;
  }
  setSubstiArray(array) {
    this.substiArray = array;
  }
  getSubstiArray() {
    return this.substiArray;
  }
  getordderssArray() {
    return this._OrderArray;
  }
    getUserID() {
        return this._userID;
    }
    getOrderId() {
      return this._OrderId;
  }
  getfunction(contents){
    console.log("function which call here for saving my orders")
    console.log(contents,"contents lenghthgghggg....................")
    let tempArray=[]
    for (var i=0;i<contents.length;i++)
    {
     tempArray.push({
       'itemid':contents[i].itemid,
       'description':contents[i].description,
       'price':contents[i].price,
       'qty':contents[i].qty,
       'upc':contents[i].upc,
       'imgsrc':contents[i].imgsrc

      })
     console.log(tempArray, "temp here")
   }
  return tempArray;
  }
  
  getorderitemArray(){
    return this.orderitemArray
  }
  setorderitemArray(array)
  {
    this.orderitemArray=[...array]
  }
  setOrderId(id) {
    this._OrderId = id;
}
    setUserID(id) {
        this._userID = id;
    }
   

 
setCustInfo(custmerid,name){
  this._ActiveCustName=name;
  this._ActiveCustomerID=custmerid;

}
setRunningTotals(price,qty,items) {
    var priceval= Number(price).toFixed(2);
    this._TotalPrice= '₹'+price;
    this._TotalItems=items;
    this._TotalQty=qty;
}
getActiveAdress() {
  let address=this._ActiveAddress[0]+" , "+this._ActiveAddress[1]+" , "+this._ActiveAddress[2]+" - "+this._ActiveAddress[3]
  return address;
}
setActiveAddress(value){
  this._ActiveAddress=value;

}
getActiveCustName() {
  return this._ActiveCustName;
}
getcustomerName(){
return this.custName;
}
setcustomerName(name){
this.custName=name;
}
getActiveCustomerID() {
  return this._ActiveCustomerID;
}
getTotalPrice() {
  return this._TotalPrice;
}
getTotalItems() {
  return this._TotalItems;
}
getTotalQty() {
  return this._TotalQty;
}
checknetwork(){
  this.connection_Status ="ONLINE"
//   NetInfo.isConnected.addEventListener(
//     'connectionChange',
//     this._handleConnectivityChange
// );
// NetInfo.isConnected.fetch().done((isConnected) => {

//   if(isConnected == true)
//   {
//     this.connection_Status ="ONLINE"
  
//   }
//   else
//   {
//     this.connection_Status ="OFFLINE"
//   }

// });

}
_handleConnectivityChange = (isConnected) => {
  // const info =  NetInfo.getConnectionInfo();
  // console.log('%%%%%%%%%%',info)
  // if(isConnected == true)
  //   {
  //     this.connection_Status ="ONLINE"
  //   }
  //   else
  //   {
  //       this.connection_Status = "OFFLINE"
        
  //   }
};

resetHandler(){
//   NetInfo.isConnected.removeEventListener(
//     'connectionChange',
//     this._handleConnectivityChange

// );
}
resetValues(){
  this._userID="";
  this._ActiveCustomerID="";
  this._ActiveCustName="";
  this.custName="";
  this._TotalItems="";
  this._TotalQty="";
  this._TotalPrice="";
  this._ActiveAddress=""
  this._OrderId=""
  this.isOrderOpen=false
  

}
getCurrentDate()
{
  // var date = new Date().getDate(); //Current Date
  // var month = new Date().getMonth() + 1; //Current Month
  // var year = new Date().getFullYear(); //Current Year
  // var hours = new Date().getHours(); //Current Hours
  // var min = new Date().getMinutes(); //Current Minutes
  // if(min)
  // var sec = new Date().getSeconds(); //Current Seconds
  // var datetime=date+'-'+month+'-'+year+' '+hours+':'+min+':'+sec
  var date = moment()
      .utcOffset('+00:00')
      .format('YYYY-MM-DD HH:mm:ss');
  return date
}
getCurrentDate1()
{
  // var date = new Date().getDate(); //Current Date
  // var month = new Date().getMonth() + 1; //Current Month
  // var year = new Date().getFullYear(); //Current Year
  // var hours = new Date().getHours(); //Current Hours
  // var min = new Date().getMinutes(); //Current Minutes
  // if(min)
  // var sec = new Date().getSeconds(); //Current Seconds
  // var datetime=date+'-'+month+'-'+year+' '+hours+':'+min+':'+sec
  var date = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD HH:mm:ss a');
  return date
}

getunsentlist=(filename)=>{
  moment.locale('en');
   let tempArray=[]
   if(filename.includes("OG"))
     filename.replace("OG_","");
   for (var i=0;i<filename.length;i++)
   {
    var custid = filename[i].name.split("CNID-")[1];
    custid=custid.split("Nme-")[0];
    var custname = filename[i].name.split("Nme-")[1];
    custname=custname.split("ADD-")[0];
    var address=filename[i].name.split("ADD-")[1];
    address=address.split(".json")[0];
    var orderid=filename[i].name.split("UN_")[1];
    orderid=orderid.split("CNID-")[0];
    let cnt=filename[i].name.split("LNT-")[1];
    cnt=cnt.split("cntP-")[0];
    
    let cntP=filename[i].name.split("cntP-")[1];
    console.log(filename,"-total price",cntP)
    cntP=cntP.split(".json")[0];
     tempArray.push({
       orderid:filename[i].name,
       name:filename[i].name,
       oid:orderid,
       orderstatus:'UNSENT',
       customerid:custid,
       custname:custname,
       address:address,
       cnt:cnt,
       cntP:cntP,
       TimeStamp:filename[i].mtime.toString()//*timestamp fix
     })
    
   }
   return tempArray;
}

checkoutdateditem=(date)=>{
  var result=true;
  var msDiff = new Date(date).getTime() - new Date().getTime();    //Future date - current date
var noofdays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
if(noofdays>179)
result=false;
return noofdays;
}
escape=(htmlStr)=>{
  return htmlStr.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace("&amp;#039;","'");        

}

gettypeArray(jsonData,code) {
  let object=JSON.parse(jsonData);
   var typeval= this.getusertype();
  let tempArray = []
  if(code=='PO_01')
  {
    for(var i=0; i< object.length;i++)
  {
    tempArray.push({ 'addressline1': object[i].name_value_list.addressline1.value,
    'addressline2': object[i].name_value_list.addressline2.value,
    'country': object[i].name_value_list.country.value,
    'state': object[i].name_value_list.state.value,
    'name': object[i].name_value_list.name.value,
    'postalcode': object[i].name_value_list.postalcode.value,
    'creditlimit':object[i].name_value_list.creditlimit.value,
    'lastpaymentdate':object[i].name_value_list.lastpaymentdate.value,
    'lastsaleamount':object[i].name_value_list.lastsaleamount.value,
    'image1':"http://143.110.178.47/OrdoCRM7126/upload/"+object[i].name_value_list.id.value+"_img_src_c",

    'lastsaledate':object[i].name_value_list.lastsaledate.value,
    'due_amount_c':object[i].name_value_list.due_amount_c.value,
    'ispaymentdue':object[i].name_value_list.payment_due_c.value,
    'email':object[i].name_value_list.email.value,
    'id':object[i].name_value_list.id.value,
    'owner':object[i].name_value_list.ownership.value,
     'storeid': object[i].name_value_list.customerid.value})
  }
  }else if(code=='PO_19')
  {
    for(var i=0; i< object.length;i++)
  {
    var img_src_c= object[i].name_value_list.img_src_c.value
    tempArray.push({'addressline1': object[i].name_value_list.billing_address_street.value,
    'addressline2': object[i].name_value_list.billing_address_street_2.value,
    'country': object[i].name_value_list.billing_address_country.value,
    'state': object[i].name_value_list.billing_address_state.value,
    'name': object[i].name_value_list.name.value,
    'postalcode': object[i].name_value_list.billing_address_postalcode.value,
    'creditlimit':object[i].name_value_list.annual_revenue.value,
    "credit_note":object[i].name_value_list.credit_note.value,
    'image1':"http://143.110.178.47/OrdoCRM7126/upload/"+object[i].name_value_list.id.value+"_img_src_c",
    'lastsaleamount':"0",
    'lastpaymentdate':"",
    'lastsaledate':"",
    // 'lastsaledate':object[i].name_value_list.lastsaledate.value,
    'due_amount_c':object[i].name_value_list.due_amount_c.value,
    // 'ispaymentdue':object[i].name_value_list.payment_due_c.value,
    'ispaymentdue':"0",
    'id':object[i].name_value_list.id.value,
        'email':object[i].name_value_list.email.value,
        'owner':object[i].name_value_list.ownership.value,
    
     'storeid': object[i].name_value_list.storeid_c.value})
  }
  console.log("PO_19*****************",tempArray);
  }
  else if(code=='PO_12'){

    for(var i=0; i< object.length;i++)
  {

  tempArray.push({ 'addressline1': object[i].addressline1,
    'addressline2': object[i].addressline2,
    'country': object[i].country,
    'state': object[i].addressline2,
    'name': object[i].name,
    'postalcode': object[i].postalcode,
    'creditlimit':object[i].creditlimit,
    'lastpaymentdate':object[i].lastpaymentdate,
    'lastsaleamount':object[i].lastsaleamount,
    'lastsaledate':object[i].lastsaledate,
    'due_amount_c':object[i].due_amount_c,
    'ispaymentdue':object[i].payment_due_c,
    'id':object[i].id,
     'storeid': object[i].customerid})
  }
  }
 else if(code=='PO_04')
  {
    for(var i=0; i< object.length;i++)
  {
    tempArray.push({'orderid': object[i].name_value_list.orderid.value,
                    'name':object[i].name_value_list.name.value,
                   'id': object[i].name_value_list.id.value,
                   'record': object[i].name_value_list.name.value,
                   'orderstatus':object[i].name_value_list.orderstatus.value,
                   'type':object[i].name_value_list.type.value,
                   'totalvalue':object[i].name_value_list.totalvalue.value,
                   'date_modified':object[i].name_value_list.date_modified.value,
                   'last_modified':object[i].name_value_list.lastmodified.value})
  }
  }
  else if(code=='PO_21')
  {
    for(var i=0; i< object.length;i++)
  {
    tempArray.push({'sitem': object[i].name_value_list.substituteitemid.value,
                   'id': object[i].name_value_list.aos_products_id_c.value,
                   'itemid': ""
                   })
  }
  }
  else if(code=='PO_14'){
  
    for(var i=0; i< object.length;i++)
    {
   
      tempArray.push({'orderid': object[i].name_value_list.id.value,
                     'id': object[i].name_value_list.number.value,
                     'name':object[i].name_value_list.name.value,
                     'record': object[i].name_value_list.name.value,
                     'orderstatus':object[i].name_value_list.approval_status.value,
                     'type':object[i].name_value_list.stage.value,
                     'totalvalue':object[i].name_value_list.total_amount.value,
                     'date_modified':object[i].name_value_list.date_modified.value,
                      'aknowledgementnumber':object[i].name_value_list.number.value,
                      'customerid':object[i].name_value_list.billing_account.value,
                      'po_number':object[i].name_value_list.number.value,
                      'comments':object[i].name_value_list.approval_issue.value,
                      'location':object[i].name_value_list.shipping_address_state.value,
                      'totalitems':object[i].name_value_list.totalitems_c.value,
                      'notes_id':object[i].name_value_list.notes_id.value,
                      'total_amount':object[i].name_value_list.total_amount.value,
                      'address':object[i].name_value_list.shipping_address_street.value,
                      'customername':object[i].name_value_list.billing_account.value,
       'subtotal_amount':object[i].name_value_list.subtotal_amount.value,
       'discount_amount':object[i].name_value_list.discount_amount.value,
       'tax_amount':object[i].name_value_list.tax_amount.value,
       'shipping_amount':object[i].name_value_list.shipping_amount.value,
       'total_amount_word':object[i].name_value_list.total_amount_word.value,
       'delivered_date':object[i].name_value_list.delivered_date.value,
                     'last_modified':object[i].name_value_list.date_modified.value})
    }
  }
  else if(code=='PO_D14'){
    for(var i=0; i< object.length;i++)
    {
      
      tempArray.push({'orderid': object[i].name_value_list.id.value,
      'id': object[i].name_value_list.id.value,
      'name':object[i].name_value_list.name.value,
      'record': object[i].name_value_list.name.value,
      'orderstatus':object[i].name_value_list.stage.value,
      'type':object[i].name_value_list.stage.value,
      'totalvalue':object[i].name_value_list.total_amount.value,
      'date_modified':object[i].name_value_list.date_modified.value,
       'aknowledgementnumber':object[i].name_value_list.number.value,
       'customerid':object[i].name_value_list.billing_account.value,
       'po_number':object[i].name_value_list.number.value,
       'comments':object[i].name_value_list.approval_issue.value,
       'location':object[i].name_value_list.shipping_address_state.value,
       'totalitems':object[i].name_value_list.totalitems_c.value,
       'notes_id':object[i].name_value_list.notes_id.value,
       'checked':"0",
       'address':object[i].name_value_list.shipping_address_street.value,
       'customername':object[i].name_value_list.billing_account.value,
       'total_amount':object[i].name_value_list.total_amount.value,
       'subtotal_amount':object[i].name_value_list.subtotal_amount.value,
       'discount_amount':object[i].name_value_list.discount_amount.value,
       'tax_amount':object[i].name_value_list.tax_amount.value,
       'shipping_amount':object[i].name_value_list.shipping_amount.value,
       'total_amount_word':object[i].name_value_list.total_amount_word.value,
       'delivered_date':object[i].name_value_list.delivered_date.value,
      'last_modified':object[i].name_value_list.expiration.value})
}
  }
  
     else if(code=='PO_06'|| code=='PO_10')
  {
   
        for(var i=0;i<object.length;i++){
         var pce = Number(object[i].name_value_list.price_c.value);
         var pricevalue=Number(object[i].name_value_list.price.value);//Admin
         if(typeval=="4")//Distributor
         pricevalue=object[i].name_value_list.dfd_price_c.value;
         else if(typeval=="3")//Sales
         pricevalue=object[i].name_value_list.mfd_price_c.value;
         else if(typeval=="2")//Customer
         pricevalue=object[i].name_value_list.retail_price.value;
     
          var days=this.checkoutdateditem(object[i].name_value_list.manufactured_date_c.value);
          if(days<0){
            var imageval=object[i].name_value_list.product_image.value;
            if(object[i].name_value_list.product_image.value=="")
             imageval="https://findicons.com/files/icons/305/cats_2/128/pictures.png";
        tempArray.push({'itemid':object[i].name_value_list.part_number.value,
        'description':object[i].name_value_list.name.value,
        'ldescription':this.escape(object[i].name_value_list.description.value),
        'price':pricevalue,
        'qty':0,'upc':object[i].name_value_list.upc_c.value,
        'category':object[i].name_value_list.category.value,
        'subcategory':object[i].name_value_list.subcategory_c.value,
        'unitofmeasure':object[i].name_value_list.unitofmeasure_c.value,
        'manufacturer':object[i].name_value_list.manufacturer_c.value,
        'class':object[i].name_value_list.class_c.value,
        'pack':object[i].name_value_list.pack_c.value,
        'size':object[i].name_value_list.size_c.value,
        "tax":object[i].name_value_list.tax.value,
        "hsn":object[i].name_value_list.hsn.value,
        'weight':object[i].name_value_list.weight_c.value,
        'extrainfo1':object[i].name_value_list.extrainfo1_c.value,
        'extrainfo2':object[i].name_value_list.extrainfo2_c.value,
        'extrainfo3':object[i].name_value_list.extrainfo3_c.value,
        'extrainfo4':object[i].name_value_list.extrainfo4_c.value,
        'extrainfo5':object[i].name_value_list.extrainfo5_c.value,
        'imgsrc':imageval,
        'manufactured_date':object[i].name_value_list.manufactured_date_c.value,
        "stock":object[i].name_value_list.stock_c.value,
        "id":object[i].name_value_list.id.value,
        "noofdays":days*-1
      })
    
      }
      // else{
      //     this.deleteitem(object[i].name_value_list.part_number.value,object[i].name_value_list.id.value);
      //   }
      }
  }
 
  return tempArray;
}
checksessionid=()=>{
  var validsession=true;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");
  
  var raw = "{\n    \"__module_code__\": \"PO_27\",\n    \"__query__\": \"\",\n    \"__session_id__:\""+this.sessionid+"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("http://143.110.178.47/OrdoCRM7126/get_data_s.php", requestOptions)
    .then(response => response.json())
    .then(result => {console.log(result.ErrorCode) ; if(result.ErrorCode=="404")validsession= false;
    React.Alert.alert("Warning","session expired \n Please Login to continue.");
  })
    .catch(error => console.log('error', error));
    return validsession;
}
deleteitem=(itemid,id)=> {
 
  const SET_DATAURL= Constants.SET_URL;
    const url= SET_DATAURL;
    console.log("url:" + url);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        __module_code__: "PO_20",
        __session_id__:commonData.getsessionId(),
        __query__: "aos_products.part_number= '" + itemid + "'",
        __name_value_list__: {
          modified_by_name: "Support Primesophic",
          delete: 1,
          id:id
        }
      })
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log("this is deleting order items")
      console.log(result);
     
      
    
    }).catch(function (error) {
      console.log("-------- error ------- " + error);
    });

  }
  checkstock=(itemid)=> {
    let stock_onhand=true;
    const GET_DATAURL= Constants.GET_URL;
      const url= GET_DATAURL;
      console.log("url:" + url);
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          __module_code__: "PO_20",
          __session_id__:this.getsessionId(),
          __query__: "aos_product.part_number= '" + itemid + "'"
        })
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log("this is deleting order items")
        console.log(result);
        let stock= result.entry_list[0].name_value_list.stock_c.value;
        if(Number(stock)<=0)
          stock_onhand=false;

          return  stock_onhand;
        
      
      }).catch(function (error) {
         return  stock_onhand;
        console.log("-------- error ------- " + error);
      });
  
    }
setUnsentOrders(array) {
  this._UnsentArray = array;
}
getUnsentOrders() {
  return this._UnsentArray;
}
setUnsetfilearray(array)
{
  this._unsentfilelist=array
}
getUnsetfilearray(){
  return this._unsentfilelist;
}
getorderitemArray(orderitemArray){
  var tempArray=this.getItemArray();
  var returnarray=[]
  var itemid, description, qty, price;
  for(var i=0;i<tempArray.length;i++){
    for(var j=0;j<orderitemArray.length;j++){
      itemid=tempArray[i].itemid
      description=tempArray[i].description
      qty=(tempArray[i].qty).split('.')[0]+"."+(tempArray[i].qty).split('.')[1].substring(1, 2)
      // qty=tempArray[i].qty;
      price=tempArray[i].price;
      if(tempArray[i].itemid==orderitemArray[j].productid){
        qty=orderitemArray[j].quantity
        qty=(qty).split('.')[0]+"."+(qty).split('.')[1].substring(1, 2)
      }
      returnarray.push({'itemid':itemid,
    'description':description,
    'price':price,
    'qty':qty
  })
    }
    

  }
  if(returnarray.length==0){
    returnarray=tempArray;
  }
  return returnarray;
}

// here new code...
setstoresArray(array)
{
  this._StoreArray=array;
}
getstoresArray(){
  return this._StoreArray
}
writedata(path,listArray){
  

      // write the file
    
      var json = JSON.stringify(listArray);
      console.log(json, "this is for storing list array")
      RNFS.writeFile(path, json,'utf8')
      .then((success) => {
      console.log('FILE WRITTEN!');
      })
      .catch((err) => {
      console.log(err.message);
      });
  
      RNFS.readFile(path, 'utf8')
          .then((contents) => {
          // log the file contents
          console.log("writting files to skuuuu")
          console.log(contents);
          console.log("Json_parse");
          console.log(JSON.parse(contents));
      })
      .catch((err) => {
          console.log(err.message, err.code);
      });
  
}
getdataOffline(path){

  RNFS.readFile(path, 'utf8')
  .then((contents) => {
  // log the file contents
  // console.log(contents);
  return(JSON.parse(contents));
})
.catch((err) => {
  // console.log(err.message, err.code);
});
}
getfile(filename){
  
  let tempArray=[]
  for (var i=0;i<filename.length;i++)
  {
   tempArray.push({
    //  'orderid':filename[i].filename,
     "status":"unsent"
    })
   console.log(tempArray, "temp here")
 }
return tempArray;
}
getunsentlist (filename){
   let tempArray=[]
   for (var i=0;i<filename.length;i++)
   {
     tempArray.push({
       orderid:filename[i].name,
       orderstatus:'UNSENT'
     })
   }
   return tempArray;
}

}
