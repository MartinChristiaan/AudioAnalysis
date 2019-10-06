

function lrp(v1, v2, t) {
    return v1 + ((v2 - v1) * t);  
  }
  
  export class rgb {
      r: any;
      g: any;
      b: any;
    constructor(r,g,b)
    {
      this.r= r
      this.g = g
      this.b = b
    }
    getHTMLValue()
    {
      return ["rgb(",this.r,",",this.g,",",this.b,")"].join("");
    }
  }
  
  const gradientColors = [new rgb(18,194,233),new rgb(196,113,237),new rgb(247,157,0),new rgb(100,243,140),new rgb(192,36,37),new rgb(240,203,53),new rgb(237,33,58), new rgb(147,41,30)]
  
  export function addRandomDeviation(color:rgb,dev = 20)
  {
    var r = Math.round(color.r + (Math.random() - 0.5) * 20)
    var g = Math.round(color.g + (Math.random() - 0.5) * 20)
    var b = Math.round(color.b + (Math.random() - 0.5) * 20)
    return new rgb(r,g,b)
  }


  export function getNoteColor(percent,speed)
  {
    var idx = Math.floor(speed)
    var percent2 = speed%1
    var collow = lerpColors(gradientColors[idx],gradientColors[idx+1],percent2)
    var colhigh = lerpColors(gradientColors[idx+1],gradientColors[idx+2],percent2)
    
    var color = lerpColors(collow,colhigh,percent).getHTMLValue()
    return color  
  }
  
  export function getNoteColorRaw(percent,speed)
  {
    var idx = Math.floor(speed)
    var percent2 = speed%1
    var collow = lerpColors(gradientColors[idx],gradientColors[idx+1],percent2)
    var colhigh = lerpColors(gradientColors[idx+1],gradientColors[idx+2],percent2)
    
    var color = lerpColors(collow,colhigh,percent)
    return color  
  }

  function lerpColors(c1,c2,percent)
  {
    var r1 = c1.r
    var g1 = c1.g
    var b1 = c1.b
  
    var r2 = c2.r
    var g2 = c2.g
    var b2 = c2.b
    
    var r =lrp(r1,r2,percent)
    var g= lrp(g1,g2,percent)
    var b= lrp(b1,b2,percent)
  
  
    return new rgb(r,g,b)
  }