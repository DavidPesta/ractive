import Ractive from 'ractive'
import YetAnotherComponent from './path/to/YetAnotherComponent.js'
import MyOtherComponent from './path/to/MyOtherComponent.js'
import MyComponent from './path/to/MyComponent.js'
import $ from 'jquery'

export default Ractive.extend({"components":{YetAnotherComponent,MyOtherComponent,MyComponent},"template":{"v":4,"t":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["a","b"],"s":"_0+_1"}}]}," ",{"t":7,"e":"MyComponent","f":["Hello, ",{"t":2,"r":"message"},"!"]}],"e":{"_0+_1":function (_0,_1){return(_0+_1);}}},"css":"div {\n  color: red\n}"}, {
  data: { message: 'World' }
})