


function lrp(v1, v2, t) {
  return v1 + ((v2 - v1) * t);
}

export function getRGBA(col:rgba,a) {
  return ["rgba(", col.r, ",", col.g, ",", col.b, ",",a ,")"].join("");
}


export class rgba {
  r:number;
  g:number;
  b:number;
  a:number
  constructor(r, g, b,a=1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
  getHTMLValue() {
    return ["rgba(", this.r, ",", this.g, ",", this.b,",", this.a, ")"].join("");
  }

}

const gradientColors = [new rgba(18, 194, 233), new rgba(196, 113, 237), new rgba(247, 157, 0), new rgba(100, 243, 140), new rgba(240, 203, 53), new rgba(237, 33, 58), new rgba(147, 41, 30)]

export function addRandomDeviation(color: rgba, dev = 20) {
  var r = Math.round(color.r + (Math.random() - 0.5) * dev)
  var g = Math.round(color.g + (Math.random() - 0.5) * dev)
  var b = Math.round(color.b + (Math.random() - 0.5) * dev)
  return new rgba(r, g, b)
}

export function getNoteColor(percent:number,level) {
      return getNoteColorRaw(percent,level).getHTMLValue()
  }

export function getNoteColorRaw(percent:number,level : number) {
    var idx = level-1
//    var percent2 = this.dynamicsManager.speedLevelPercent
//    var collow = lerpColors(gradientColors[idx], gradientColors[idx + 1], percent2)
//    var colhigh = lerpColors(gradientColors[idx + 1], gradientColors[idx + 2], percent2)
    //console.log(idx)
    if (idx+1 < gradientColors.length) {
      var col1 = gradientColors[idx]
      var col2 = gradientColors[idx+1]  
      var color = lerpColors(col1, col2, percent)
      return color
    }
    else
    {
      return gradientColors[gradientColors.length-1]
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


  return new rgba(r, g, b)
}