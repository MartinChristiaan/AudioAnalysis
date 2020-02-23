import { el, mount, list } from "redom";
import { IWorkerInfo } from "../types/worker";

export function div(classname)
{
  let dv =  el("div")
  dv.className = classname
  return dv
}

let ids = ["workerTab","contractTab","orderTab"]
let tabLabels = ["Workers","Contracts","Orders"]

export function createSidebar(menu)
{
  let sidebar = el("div");
  sidebar.className = "sidebar card";
  mount(menu, sidebar);
    
  let menulabel =el("p", "General") 
  menulabel.className = "menu-label is-size-6	"
  mount(sidebar,menulabel );
  
  let menuitems = el("ul")
  menuitems.className = "menu-list"
  mount(sidebar,menuitems)

  //let actionItem = el("a","Workers")
  let menuItemslist : HTMLAnchorElement[] = []
  let x = tabLabels.forEach((label,idx) => {
    let listItem = el("li")
    let menuItem = el("a",label)
    if (idx ==0) {
      menuItem.className = "is-active"
    }

    menuItem.onclick = () => {
      showTab(ids[idx])
      menuItemslist.filter((item,i) => idx == i).forEach(x => {x.className = "is-active"})
      menuItemslist.filter((item,i) => idx != i).forEach(x => {x.className = ""})
    }
    menuItemslist.push(menuItem)
  
    mount(listItem,menuItem)    
    mount(menuitems,listItem)
  });
  
}


export function createContractTab()
{

}
export function createOrderTab()
{

}

export function showTab(tabname)
{

  let visibleIdx = ids.indexOf(tabname)
  let elements = ids.map(id => document.getElementById(id))
  console.log(tabname)
  elements.filter((x,idx) => idx != visibleIdx).map(x => x.className = "tab hidden")
  elements.filter((x,idx) => idx == visibleIdx).map(x => x.className = "tab")
}





export function createMenu() {
  var menu = document.getElementById("menu");
  createSidebar(menu)


  // songlist.forEach(songname => {
  //   let card = el("div");
  //   card.className = "songCard";
  //   mount(songgrid, card);
  //   card.onclick = () => {
  //     bus.songTitle$.next(songname)
  //   };

  //   let avatar = el("div")
  //   avatar.className = "avatar"
  //   mount(card,avatar)

  //   let name = el("div")
  //   name.className = "name"
  //   let nametext = el("p",songname)
  //   nametext.className = "nameText"
  //   mount(name,nametext)
  //   mount(card,name)

    //let stats = div("stats")


}