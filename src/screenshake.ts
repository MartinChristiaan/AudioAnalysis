import { ControlBus, FeedbackBus, IHits } from "./bus";
import { mapTo, withLatestFrom, map,scan } from "rxjs/operators";
import { merge } from "rxjs";
import { V2 } from "./noteViz/interfaces";


interface ISongtime {
    kind: "timeUpdate"

}
interface IHitEnergy
{
    kind: "hitEnergy"
    amount : number
}

type ScreenshakeUdpate = ISongtime | IHitEnergy

export function setupScreenshake(controlBus : ControlBus,feedbackBus : FeedbackBus)
{
    let hitEnergy$ = feedbackBus.hits$.pipe(
        withLatestFrom(controlBus.onsets$),
        map(([hits,onsets]) => 
            hits.hitNotes
            .map(idx => onsets[idx].energy)
            .reduce((acc,val) => acc +val)),
        map(energy =>{return {kind:"hitEnergy",amount:energy*energy * 260}})
    )

    let timePassed$ =controlBus.songTime$.pipe(
        mapTo({kind:"timeUpdate"})
    )
    
    
    merge(timePassed$, hitEnergy$ ).pipe(
        scan((screenshake,msg:ScreenshakeUdpate ) =>{
            if (msg.kind == "timeUpdate") {
                return Math.max(0,screenshake-0.1*screenshake)
            }
            else
            {
                console.log(msg.amount)
                return screenshake + msg.amount
            }
        },0),
        map(amount => {return{x:(Math.random()-.5)*amount,y:(Math.random()-.5)*amount}})
    ).subscribe(ss => feedbackBus.screenShake$.next(ss))


}