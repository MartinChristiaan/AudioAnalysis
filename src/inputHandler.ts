//import { dynamicsManager, hitDetection,gearbox,noteDrawer, song } from "./main";
import { keycodes } from "./config";
import { MyEvent } from "./util/MyEvent";
let numberKeys = [1,2,3,4,5,6,7,8,9].map(x => x.toString())
var shiftDown = false
export var numberKeyDown = new MyEvent<number>()
export function keyDown(event)
{
    var key = event.key;
    if (numberKeys.includes(key))
    {
        numberKeyDown.fire(numberKeys.indexOf(key))
    }

            

    // if (event.code == 'Space') {
    // //    console.log("boosting")
    //     dynamicsManager.applyBooster()
    // }
    // else if (key == "Shift") {
    //     shiftDown = true
    //    // console.log("Shifting")
    // }
    // if(shiftDown == false)
    // {
    //     hitDetection.updateKey(key,gearbox.curGear)
    // }
    // else
    // {   

    //     let shiftKeyCodes = keycodes[4].map(x => x.toUpperCase())
    //     if (shiftKeyCodes.includes(key)) {
    //        // console.log("Shifting to gear " + shiftKeyCodes.indexOf(key))
    //         gearbox.shiftGear(shiftKeyCodes.indexOf(key))
    //         noteDrawer.shiftGear(gearbox.curGear,song)
    //     }
    // }
}







document.addEventListener('keyup', function (event) {
    var key = event.key;
    if (key == "Shift") {
        shiftDown = false
        //console.log("No longer Shifting")
    }
    

});

export var load = 0