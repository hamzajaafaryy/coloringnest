import Link from "next/link";
export default function NotFound(){return <main className="track-wrap"><section className="panel"><h1>Page introuvable</h1><p>La ressource demandée n'existe pas ou n'est pas accessible.</p><Link className="btn" href="/dashboard">Retour au tableau de bord</Link></section></main>;}
