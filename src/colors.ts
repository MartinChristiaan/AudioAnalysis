import { Scoremanager } from "./scoreManager";


function lrp(v1, v2, t) {
  return v1 + ((v2 - v1) * t);
}

export class rgb {
  r: any;
  g: any;
  b: any;
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
  getHTMLValue() {
    return ["rgb(", this.r, ",", this.g, ",", this.b, ")"].join("");
  }
}

const gradientColors = [new rgb(18, 194, 233), new rgb(196, 113, 237), new rgb(247, 157, 0), new rgb(100, 243, 140), new rgb(240, 203, 53), new rgb(237, 33, 58), new rgb(147, 41, 30)]

export function addRandomDeviation(color: rgb, dev = 20) {
  var r = Math.round(color.r + (Math.random() - 0.5) * dev)
  var g = Math.round(color.g + (Math.random() - 0.5) * dev)
  var b = Math.round(color.b + (Math.random() - 0.5) * dev)
  return new rgb(r, g, b)
}

export class NoteColorer {
  dynamicsManager: Scoremanager;
  constructor(dynamicsManager: Scoremanager) {
    this.dynamicsManager = dynamicsManager
  }

  getNoteColor(percent:number) {
      return this.getNoteColorRaw(percent).getHTMLValue()
  }

  getNoteColorRaw(percent:number) {
    var idx = this.dynamicsManager.level-1
//    var percent2 = this.dynamicsManager.speedLevelPercent
//    var collow = lerpColors(gradientColors[idx], gradientColors[idx + 1], percent2)
//    var colhigh = lerpColors(gradientColors[idx + 1], gradientColors[idx + 2], percent2)
    //console.log(idx)
    
    var col1 = gradientColors[idx]
    var col2 = col1
    if (idx+1 < gradientColors.length) {
      col2 = gradientColors[idx+1]  
    }
    
    
    var color = lerpColors(col1, col2, percent)
    return color
  }

}


export function lerpColors(c1, c2, percent) {
  var r1 = c1.r
  var g1 = c1.g
  var b1 = c1.b

  var r2 = c2.r
  var g2 = c2.g
  var b2 = c2.b

  var r = lrp(r1, r2, percent)
  var g = lrp(g1, g2, percent)
  var b = lrp(b1, b2, percent)


  return new rgb(r, g, b)
}