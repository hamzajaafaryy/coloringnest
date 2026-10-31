"use client";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <main className="track-wrap"><div className="panel"><h1>Une erreur est survenue</h1><p>Impossible de terminer l'opération. Réessayez ou contactez un administrateur.</p><p className="tiny">{error.digest?"Incident: "+error.digest:""}</p><button className="btn" onClick={reset}>Réessayer</button></div></main>;
}
