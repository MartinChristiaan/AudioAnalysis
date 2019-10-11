import { dynamicsManager, hitDetection,gearbox,noteDrawer, song } from "./main";
import { keycodes } from "./config";

var shiftDown = false






document.addEventListener('keydown', function (event) {
    var key = event.key;
    console.log(key)
    if (event.code == 'Space') {
    //    console.log("boosting")
        dynamicsManager.applyBooster()
    }
    else if (key == "Shift") {
        shiftDown = true
       // console.log("Shifting")
    }
    if(shiftDown == false)
    {
        hitDetection.updateKey(key,gearbox.curGear)
    }
    else
    {   

        let shiftKeyCodes = keycodes[4].map(x => x.toUpperCase())
        if (shiftKeyCodes.includes(key)) {
           // console.log("Shifting to gear " + shiftKeyCodes.indexOf(key))
            gearbox.shiftGear(shiftKeyCodes.indexOf(key))
            noteDrawer.shiftGear(gearbox.curGear,song)
        }
    }
});

document.addEventListener('keyup', function (event) {
    var key = event.key;
    if (key == "Shift") {
        shiftDown = false
        //console.log("No longer Shifting")
    }
    

});

export var load = 0