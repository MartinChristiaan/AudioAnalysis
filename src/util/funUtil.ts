//var song = selectSong(3)
//var player = new SongPlayer(song,30)
export function sum(acc,val)
{
return acc + val
}

export function map2<T1,T2,T3>(arr1 : T1[],arr2:T2[],fun:(x:T1,y:T2)=>T3)
{
    return arr1.map((x1,idx) =>fun(x1,arr2[idx]))
}
export function map3<T1,T2,T3,T4>(arr1 : T1[],arr2: T2[],arr3: T3[],fun:(x:T1,y:T2,z:T3)=>T4)
{
    return arr1.map((x1,idx) =>fun(x1,arr2[idx],arr3[idx]))
}

class Range
{
    min : number
    max : number

}
export function getRange(arr,fun) : Range
{
    let trueidx: number[] = []
    for (let index = 0; index < arr.length; index++) {
        if(fun(arr[index])){trueidx.push(index)}        
    }
    return {min : Math.min(...trueidx),max : Math.max(...trueidx)}
}

export function argWhere(arr,fun) : number []
{
    let trueidx: number[] = []
    for (let index = 0; index < arr.length; index++) {
        if(fun(arr[index])){trueidx.push(index)}        
    }
    return trueidx
}


export function percentInWindow(futureTimeMargin,pastTimeMargin,currentTime,time) {
    return inverseLerp(currentTime - pastTimeMargin,currentTime + futureTimeMargin,time) 
}


export function inverseLerp(min,max,value) {
    return (value-min) /(max - min) 
}
