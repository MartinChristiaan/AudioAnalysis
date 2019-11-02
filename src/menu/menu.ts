import { el, mount } from "redom";
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
  sidebar.className = "sidebar";
  mount(menu, sidebar);
  mount(sidebar, el("h1", "test"));

bus.songTitle$.subscribe(x =>{
    menu.className = "menu away"
})

  document.onkeydown = event => {
    if (event.key == "Escape") {
      if (menu.className == "menu") {
        menu.className = "menu away";
      } else {
        menu.className = "menu";
      }
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
