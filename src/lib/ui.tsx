import Link from "next/link";
import type { ReactNode } from "react";
import { statusClass,statusText } from "@/lib/format";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
export function Stat({title,value,icon:Icon,sub}:{title:string;value:string|number;icon:LucideIcon;sub?:string}) {
 return <div className="stat"><span className="stat-icon"><Icon size={19}/></span><div className="stat-title">{title}</div><div className="stat-value">{value}</div>{sub&&<div className="tiny" style={{marginTop:7}}>{sub}</div>}</div>;
}
export function Head({title,subtitle,children}:{title:string;subtitle?:string;children?:ReactNode}){
 return <div className="page-head"><div><h1>{title}</h1>{subtitle&&<p className="subtitle">{subtitle}</p>}</div>{children&&<div className="row">{children}</div>}</div>;
}
export function Pill({status}:{status:string}){return <span className={statusClass(status)}>{statusText(status)}</span>;}
export function ErrorMessage({message}:{message?:string}){return message?<div className="alert" role="alert">{message}</div>:null;}
export function Empty({text="Aucune donnée pour le moment."}:{text?:string}){return <div className="empty">{text}</div>;}
export function More({href,label="Voir tout"}:{href:string;label?:string}){return <Link className="btn secondary small" href={href}>{label}<ArrowUpRight size={14}/></Link>;}
