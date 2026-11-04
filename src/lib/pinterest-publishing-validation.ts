import { isPinTemplate, type PinTemplate } from "./pinterest-studio.ts";
export const PINTEREST_ORIGIN = "https://www.craftcoloring.com";
export const PINTEREST_CALLBACK = PINTEREST_ORIGIN + "/api/admin/pinterest/connect/callback";
export const PINTEREST_SCOPES = "boards:read,pins:read,pins:write";
export type ApprovedPin = { pageId:number; sheetId:string; template:PinTemplate; headline:string; title:string; description:string; altText:string; boardId:string; destination:string; scheduledAt:Date };
export function normalizeApprovedPin(input:Record<string,unknown>,now=new Date()):ApprovedPin{
 const pageId=Number(input.pageId);
 if(!Number.isSafeInteger(pageId)||pageId<=0) throw Error("Choose a published artwork");
 const sheetId=typeof input.sheetId==="string"?input.sheetId:"cover";
 if(!sheetId||sheetId.length>75) throw Error("Invalid collection sheet");
 if(!isPinTemplate(input.template))throw Error("Choose a Pin design");
 const template=input.template;
 const str=(key:string,max:number)=>{const v=typeof input[key]==="string"?input[key].replace(/\s+/g," ").trim():"";if(!v||v.length>max)throw Error("Invalid "+key);return v};
 const headline=str("headline",90),title=str("title",100),description=str("description",500),altText=str("altText",500),boardId=str("boardId",30),destination=str("destination",1000);
 if(!/^\d{2,30}$/.test(boardId))throw Error("Choose a real Pinterest board");
 const u=new URL(destination);
 if(u.origin!==PINTEREST_ORIGIN||u.protocol!=="https:"||!u.pathname.startsWith("/coloring-pages/")||u.username||u.password||u.hash)throw Error("Use a CraftColoring article link");
 const scheduledAt=new Date(String(input.scheduledAt||""));
 if(!Number.isFinite(scheduledAt.valueOf())||scheduledAt.valueOf()<now.valueOf()-60000||scheduledAt.valueOf()>now.valueOf()+90*86400000)throw Error("Choose a date within 90 days");
 return {pageId,sheetId,template,headline,title,description,altText,boardId,destination,scheduledAt};
}
export function pinterestErrorStatus(status:number):string{
 if(status===401)return "Pinterest authorization expired. Reconnect your account.";
 if(status===403)return "Pinterest denied permission. Check App access and pins:write scope.";
 if(status===429)return "Pinterest rate limit reached. Try later.";
 return status>=500?"Pinterest temporarily unavailable. Verify whether the Pin appeared before retrying.":"Pinterest rejected the request ("+status+").";
}
