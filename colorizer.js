function lrp(v1, v2, t) {
  return v1 + ((v2 - v1) * t);
  
}
export function get_note_color(percent)
{
  var r1 = 252
  var g1 = 92
  var b1 = 125

  var r2 = 106
  var g2 = 130
  var b2 = 251
  
  var r =lrp(r1,r2,percent)
  var g= lrp(g1,g2,percent)
  var b= lrp(b1,b2,percent)

  return ["rgb(",r,",",g,",",b,")"].join("");
 
}

function getcolor2(percent)
{
  var r1 = 0
  var g1 = 255
  var b1 = 0

  var r2 = 255
  var g2 = 0
  var b2 = 0
  
  var r =lrp(r1,r2,percent)
  var g= lrp(g1,g2,percent)
  var b= lrp(b1,b2,percent)

  return ["rgb(",r,",",g,",",b,")"].join("")
 
}