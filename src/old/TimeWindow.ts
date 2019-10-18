import { timedValue } from './songplayer';

export function GetItemsInTimeWindow(futureTimeMargin,pastTimeMargin,currentTime,items: timedValue[]) {
        let lowerBoundTime = currentTime + futureTimeMargin; // speed code
        let upperBoundTime = currentTime - pastTimeMargin; // speed code
        let itemsInWindow = [];
        for (let i = 0; i < items.length; i++) {
            const time = items[i].time;
            if (time > lowerBoundTime && time < upperBoundTime) {
                itemsInWindow.push(items[i]);
            }            
        }
        return items;
}

export function percentInWindow(futureTimeMargin,pastTimeMargin,currentTime,time) {
    return inverseLerp(currentTime - pastTimeMargin,currentTime + futureTimeMargin,time) 
}


export function inverseLerp(min,max,value) {
    return (value-min) /(max - min) 
}


export class IndexWindow
{
    upperBoundIdx: number;
    lowerBoundIdx: number;
    futureTimeMarginIndices= 2;
    pastTimeMarginIndices= 1;
 
    constructor(futureTimeMargin:number, pastTimeMargin:number) {
        this.futureTimeMarginIndices = futureTimeMargin/timePerIndex;
        this.pastTimeMarginIndices = pastTimeMargin/timePerIndex;

    }
    UpdateWindow(currentTime,data,timePerIndex:number) {
        let currentIndex = Math.round(currentTime/timePerIndex)
        this.upperBoundIdx = Math.min(data.length, currentIndex + this.futureTimeMarginIndices); // speed code
        this.lowerBoundIdx = Math.max(0,currentIndex - this.pastTimeMarginIndices); // speed code

        return data.slice(this.lowerBoundIdx,this.upperBoundIdx)
    }
    
}