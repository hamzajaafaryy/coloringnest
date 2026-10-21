import type { MetadataRoute } from "next";

export default function manifest():MetadataRoute.Manifest{
 return {
  name:"CraftColoring - Free Coloring & Creative Games",
  short_name:"CraftColoring",
  description:"Play free cartoon coloring games, paint printable pages and create your own art.",
  start_url:"/",
  display:"standalone",
  background_color:"#fffaf2",
  theme_color:"#7143e9",
  icons:[
   {src:"/icons/craftcoloring-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
   {src:"/icons/craftcoloring-512.png",sizes:"512x512",type:"image/png",purpose:"any"},
  ],
 };
}
