globalThis.alert = console.log;
import { throwTypeErrorFromTemplate } from "../lib/utils/customErrors.js";

const options = {
  showHidden: true, // customizing the output.
  compact: false,
}
const value  = {
  someProp: ()=>{
    console.log("Hello reader, how are you? I'm alright.");
  }
}
throwTypeErrorFromTemplate('value', '[Number]',value, options);
// TypeError: 
// 
// Variable: value
// Expected type: [Number]
// Error value type: [Object] 
// Error value: {
  // someProp: [Function: someProp] {
    // [length]: 0,
    // [name]: 'someProp'
  // }
// }