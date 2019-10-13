import { timedValue } from './song';
export class TimeWindow // can also be used for charts
{
    upperBoundTime: number;
    lowerBoundTime: number;
    futureTimeMargin: 2;
    pastTimeMargin: 1;
    constructor(futureTimeMargin, pastTimeMargin) {
        this.futureTimeMargin = futureTimeMargin;
        this.pastTimeMargin = pastTimeMargin;
    }
    UpdateWindow(currentTime) {
        this.lowerBoundTime = currentTime + this.futureTimeMargin; // speed code
        this.upperBoundTime = currentTime - this.pastTimeMargin; // speed code
    }
    GetItemsInWindow(items: timedValue[]) {
        let itemsInWindow = [];
        for (let i = 0; i < items.length; i++) {
            const time = items[i].time;
            if (time > this.lowerBoundTime && time < this.upperBoundTime) {
                itemsInWindow.push(items[i]);
            }
            
        }
        return items;
    }
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