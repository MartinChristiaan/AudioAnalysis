import { el, mount, list } from "redom";
import { ControlBus } from "../bus";
function div(classname)
{
  let dv =  el("div")
  dv.className = classname
  return dv
}

export function createMenu(songlist: string[],bus:ControlBus) {
  var menu = document.getElementById("menu");

  let sidebar = el("div");
  sidebar.className = "sidebar card";
  mount(menu, sidebar);
  
  
  let menulabel =el("p", "General") 
  menulabel.className = "menu-label is-size-6	"

  mount(sidebar,menulabel );

  let menuitems = el("ul")
  menuitems.className = "menu-list"
  mount(sidebar,menuitems)

  let items = ["songs"]
  let listItem = el("li")
  let actionItem = el("a","Songs")
  actionItem.className = "is-active"
  mount(listItem,actionItem)
  mount(menuitems,listItem)  
  





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

  let songgrid = el("div");
  songgrid.className = "songGrid";

  mount(menu, songgrid);

  songlist.forEach(songname => {
    let card = el("div");
    card.className = "songCard";
    mount(songgrid, card);
    card.onclick = () => {
      bus.songTitle$.next(songname)
    };

    let avatar = el("div")
    avatar.className = "avatar"
    mount(card,avatar)

    let name = el("div")
    name.className = "name"
    let nametext = el("p",songname)
    nametext.className = "nameText"
    mount(name,nametext)
    mount(card,name)

    //let stats = div("stats")





  });
}
