import {Chart} from "chart.js"
import { song } from "../main";
export async function loadEnergyChart(energy:number[])
{
var ctx = (document.getElementById('EnergyChart') as HTMLCanvasElement).getContext('2d');
console.log(energy.reduce((total,newElem)=> total+newElem)/energy.length)
let dt = energy.length/song.duration
let labels = energy.map((x,idx,arr) => idx)
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.animation = false;

await new Chart(ctx, {
    type: 'line',
    data: {
        labels:labels,
        datasets: [{
            label: 'Energy',
            borderColor: "#3e95cd",
            data: energy ,
            pointRadius: 0,           
        }]
    },
    options: {
        scales: {
            yAxes: [{
                display:true,
                
            }],
            xAxes: [{
                display:false,

               
            }]
        }
    }
});
}