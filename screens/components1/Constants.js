var USER_ID = 'userid';
var ACTIVE_CUST_ID = 'customerid';
var ACTIVE_ORDER='orderid'
var ACTIVE_ITEMS='OrderedItems'

export {USER_ID,ACTIVE_CUST_ID,ACTIVE_ORDER,ACTIVE_ITEMS}


module.exports = {
  BASE_URL :'http://143.110.178.47/OrdoCRM7126/',
  IMAGE_URL:'http://143.110.178.47/OrdoCRM7126/upload/',
   SET_URL:'http://143.110.178.47/OrdoCRM7126/set_data_s.php',
  GET_URL:"https://dev.ordo.primesophic.com/get_data_s_v2.php",
  GET_DATA_ORDO:'http://143.110.178.47/OrdoCRM7126/get_data_ordo.php',
  LOGIN_URL :'http://143.110.178.47/OrdoCRM7126/log_in_ordo.php' ,
  DOCUMENT_URL:'http://ec2-13-58-157-192.us-east-2.compute.amazonaws.com/CRM-BHI/get_document_crm_2.php',
  TYPE_DATA_URL:'http://143.110.178.47/OrdoCRM7126/get_data_ltype.php',
 GET_RETURN_URL:'http://143.110.178.47/OrdoCRM7126/getreturnArray.php',
  GET_HISTORY_URL :'http://143.110.178.47/OrdoCRM7126/gethistoryitemsv2.php',
  LOGOUT_URL:'http://ec2-13-58-157-192.us-east-2.compute.amazonaws.com/CRM-BHI/log_out_crm.php',
  DISCOUNT_ITEMS:"Discount Items",
  FREE_GOODS:"Free goods",
  PREEBOOKS:"Prebooks"
  
};