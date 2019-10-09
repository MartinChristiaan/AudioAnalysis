import { ScreenShaker } from "./screenshake";
import { ctx } from "./main";

export const screenShaker = new ScreenShaker()
export function drawCircle(x,y,r)
{
    ctx.arc(x+screenShaker.x, y+screenShaker.y, r, 0, Math.PI * 2, false);
}
export function drawRect(x,y,w,h)
{
    ctx.rect(x + screenShaker.x,y + screenShaker.y,w,h)
}
export function moveTo(x,y)
{
    ctx.moveTo(x + screenShaker.x,y + screenShaker.y)
}
export function lineTo(x,y)
{
    ctx.lineTo(x + screenShaker.x,y + screenShaker.y)
}