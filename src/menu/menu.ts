import { el, mount, list } from "redom";
import { ControlBus } from "../bus";
function div(classname)
{
  let dv =  el("div")
  dv.className = classname
  return dv
}

export function createMenu(songlist: string[],duration :string[],bus:ControlBus) {
  var menu = document.getElementById("menu");



  bus.songTitle$.subscribe(x =>{
    menu.className = "menu away"
  })
  let cnt = 0
  document.onkeydown = event => {
    if (event.key == "Escape") {
      if (menu.className == "menu") {
        menu.className = "menu away";
      } else {
        menu.className = "menu";
      }
    }
    if (event.key == "l") {
      cnt++
      console.log(cnt)
    }
  };
  let parent= document.getElementsByClassName("sidebar")[0]
  
  console.log(songlist)
  songlist.forEach((songname,idx) => {
    let card = el("div");
    card.className = "songelement";
    mount(parent, card);
    card.onclick = () => {
      bus.songTitle$.next(songname)
    };
 
    let nametext = el("p",songname)
    nametext.className = "songname"
    mount(card,nametext)

    let durationtext = el("p",duration[idx])
    durationtext.className = "songduration"
    mount(card,durationtext)

    //let stats = div("stats")





  });
}
