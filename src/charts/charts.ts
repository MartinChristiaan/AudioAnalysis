import { Chart } from "chart.js"
import { chartDelta } from "../config";
import { ControlBus } from "../bus";
import { withLatestFrom, tap } from "rxjs/operators";

import { Observable } from "rxjs";

export function getData(curIdx, data: number[]) {
    let minIdx = Math.max(curIdx - chartDelta / 2, 0)
    let maxIdx = Math.min(curIdx + chartDelta, data.length)

    return data.slice(minIdx, maxIdx)
}


function alternatePointRadius(ctx,curIdx) {
    var index = ctx.dataIndex;
 
    if (index === curIdx) {
        return '4'
    }
    // else if (highligths.includes(index))
    // {
    //     //console.log("highlight")
    //     return '3'
    // }
    return 0
}




function updateData(songTime:number,values : number[],dt:number,chart:Chart)
{

    let margin = 5
    let curIdx = Math.round(songTime/dt)
    let lowIdx = Math.max(0,Math.round((songTime - margin/2)/dt))
    let highIdx = Math.min(values.length,Math.round((songTime + margin)/dt))
    let newData = values.slice(lowIdx,highIdx)        
  
    
//        let curHighLiths = this.highlights.map(x=>  x - Math.max(0,idx - chartDelta/2)) 
    chart.data.datasets[0].data = newData 
    chart.data.datasets[0].pointRadius = (ctx) => alternatePointRadius(ctx,curIdx - lowIdx)
    
    chart.data.labels = newData.map((x,idx,arr)=> idx)
    chart.update()
}

export function SetupUpdatingChart (bus:ControlBus,values$:Observable<number[]>,id){
        var ctx = (document.getElementById(id) as HTMLCanvasElement).getContext('2d');
        Chart.defaults.global.elements.line.fill = false;
        Chart.defaults.global.animation = false;
        let chart = createChart(ctx,id);
        bus.songTime$.pipe(
            withLatestFrom(values$,bus.songAnalysis$)
        ).subscribe(([time,values,analysis]) =>{
            updateData(time,values,analysis.dt,chart)
        }
)
    
   



}



function createChart(ctx: CanvasRenderingContext2D,label) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            //                labels: labels,
            datasets: [{
                labels: [],
                label: label,
                borderColor: "#3e95cd",
                data: [],
                pointRadius: 0 // (ctx) => alternatePointRadius(ctx,this.curIdx,highligths),
            },
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    }
                }],
                xAxes: [{
                    display: false,
                    
                }]
            }
        },
    });
}

// module.exports = {
//     // parseJson : string -> string
//     CreateChart: function (xvalues,yvalues,labels,xaxislabel,ctx) {
//         var chartColors = [
//              'rgb(255, 99, 132)',
//              'rgb(255, 159, 64)',
//              'rgb(255, 205, 86)',
//              'rgb(75, 192, 192)',
//              'rgb(54, 162, 235)',
//              'rgb(153, 102, 255)',
//              'rgb(201, 203, 207)'
//         ]


//     let datasets = []
//         for (let i = 0; i < labels.length; i++) {
//             data = yvalues[i]
//             if(data.length == 0)
//             {
//                 data = []
//             }
//             d = {
//                 label : labels[i],
//                 data : data,
//                 backgroundColor : 'rgba(0, 0, 0, 0)',
//                 borderColor : chartColors[i],
//                 pointRadius: 0,
//             }
//             datasets = datasets.concat(d)          
//         }
//     labels = xvalues
//     if(xvalues.length == 0)
//     {
//         labels = []
//     }

// var myChart = new Chart(ctx, {
//     type: 'line',


//     data:{
//         labels : labels,
//         datasets : datasets
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,

//         animation: {
//             duration: 0 // general animation time
//         },
//         hover: {
//             animationDuration: 0 // duration of animations when hovering an item
//         },
//         responsiveAnimationDuration: 0, // animation duration after a resize
//         elements: {
//             line: {
//                 tension: 0 // disables bezier curves
//             }
//         },
//         scales: {
//             xAxes: [{
//                 // type: 'time',
//                 // time: {
//                 //     unit: 'second'
//                 // }, 

//                 gridLines: {
//                     color: "rgba(0, 0, 0, 0)",
//                 },
//                 scaleLabel: {
//                     display: true,
//                     labelString: xaxislabel
//                   }
//             }],
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 },
//                 gridLines: {
//                     color: "rgba(0, 0, 0, 0)",
//                 }  
//             }]
//         }
//     }
// });

// return myChart
// },
function AppendTimeSeries(chart, values, time) {


    for (let i = 0; i < values.length; i++) {
        chart.data.datasets[i].data.push(values[i]);
    }
    chart.data.labels.push(time)
    if (chart.data.labels.length > 400) {
        chart.data.labels.shift()
        for (let i = 0; i < values.length; i++) {
            chart.data.datasets[i].data.shift();
        }
    }


    chart.update()
}


