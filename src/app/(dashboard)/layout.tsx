import Link from "next/link";
import { Truck, LayoutDashboard, Package, Store, UsersRound, Boxes, Wallet, BarChart3, ShieldCheck, LogOut, ScanSearch } from "lucide-react";
import { session } from "@/lib/auth";
import type { Role } from "@/lib/types";
const menu = [
 {href:"/dashboard",label:"Tableau de bord",Icon:LayoutDashboard,roles:null},
 {href:"/shipments",label:"Colis & livraisons",Icon:Package,roles:null},
 {href:"/merchants",label:"Marchands",Icon:Store,roles:["super_admin","admin","manager","dispatcher","warehouse","accountant"]},
 {href:"/drivers",label:"Livreurs",Icon:UsersRound,roles:["super_admin","admin","manager","dispatcher","warehouse","accountant"]},
 {href:"/stock",label:"Stock & entrepôt",Icon:Boxes,roles:["super_admin","admin","manager","warehouse","accountant"]},
 {href:"/finance",label:"COD & règlements",Icon:Wallet,roles:["super_admin","admin","manager","accountant","merchant"]},
 {href:"/reports",label:"Rapports",Icon:BarChart3,roles:["super_admin","admin","manager","dispatcher","accountant"]},
 {href:"/team",label:"Équipe",Icon:ShieldCheck,roles:["super_admin","admin","manager"]}
] satisfies Array<{href:string;label:string;Icon:typeof Truck;roles:Role[]|null}>;
export default async function DashboardLayout({children}:{children:React.ReactNode}) {
 const {profile}=await session();
 return <div className="app">
  <aside className="sidebar"><Link className="brand" href="/dashboard"><span className="brand-mark"><Truck size={19}/></span>Atlas Delivery</Link>
    <nav className="nav" aria-label="Navigation principale">{menu.filter(x=>!x.roles||x.roles.some(role=>role===profile.role)).map(({href,label,Icon})=><Link key={href} href={href}><Icon size={18}/>{label}</Link>)}
      <Link href="/track"><ScanSearch size={18}/>Suivi public</Link>
    </nav>
    <div className="sidebar-bottom"><div style={{color:"#fff",fontWeight:700}}>{profile.full_name}</div><div className="muted-on-dark">{profile.role.replaceAll("_"," ")}</div></div>
  </aside>
  <div className="main"><header className="topbar"><div className="muted">Espace de gestion des livraisons</div>
  <div className="top-user"><div className="avatar">{profile.full_name.slice(0,1).toUpperCase()}</div>
    <form method="post" action="/logout"><button className="btn secondary small" aria-label="Déconnexion"><LogOut size={16}/><span className="hide-on-mobile">Quitter</span></button></form>
  </div></header><main className="content">{children}</main></div>
 </div>;
}
