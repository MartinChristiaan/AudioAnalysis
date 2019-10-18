import {fromEvent} from "rxjs"
import {filter, map} from "rxjs/operators"
import {songTitle$ } from "./loader";

console.log("Starting")
console.time('Initialization');

export var canvas = document.querySelector('canvas')
canvas.height = innerHeight
canvas.width= document.getElementById("canvasdiv").clientWidth
export var ctx = canvas.getContext('2d')


songTitle$.subscribe(console.log)


