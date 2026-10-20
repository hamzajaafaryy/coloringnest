import {NextResponse} from "next/server";
import {db} from "@/db";
import {categories,categoryFaqs,coloringPages,faqs,blogPosts,tags} from "@/db/schema";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {revalidatePath} from "next/cache";
export const dynamic="force-dynamic";
function sameOrigin(request:Request){const origin=request.headers.get("origin");const host=request.headers.get("host");return !!origin&&!!host&&new URL(origin).host===host;}
export async function GET(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const [allCategories,allCategoryFaqs,allPages,allFaqs,allPosts,allTags]=await Promise.all([db.select().from(categories),db.select().from(categoryFaqs),db.select().from(coloringPages),db.select().from(faqs),db.select().from(blogPosts),db.select().from(tags)]);
 return new Response(JSON.stringify({exportedAt:new Date().toISOString(),categories:allCategories,categoryFaqs:allCategoryFaqs,coloringPages:allPages,faqs:allFaqs,blogPosts:allPosts,tags:allTags},null,2),{headers:{"Content-Type":"application/json; charset=utf-8","Content-Disposition":'attachment; filename="craftcoloring-content-backup.json"',"Cache-Control":"no-store"}});
 }catch(e){console.error(e);return NextResponse.json({error:"Backup failed"},{status:500});}}
export async function POST(request:Request){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});if(!sameOrigin(request))return NextResponse.json({error:"Invalid request origin"},{status:403});
 try{const body=await request.json();if(body.confirm!=="RESET CRAFTCOLORING CONTENT")return NextResponse.json({error:"Type the exact confirmation phrase."},{status:400});
 await db.transaction(async tx=>{await tx.delete(faqs);await tx.delete(categoryFaqs);await tx.delete(coloringPages);await tx.delete(blogPosts);await tx.delete(tags);await tx.delete(categories);});
 for(const path of ["/","/coloring-pages/","/printable-coloring-pages/","/blog/","/color-online/","/sitemap.xml"])revalidatePath(path);
 return NextResponse.json({ok:true,message:"All content tables reset. Admin account and storage settings were not touched."});
 }catch(e){console.error(e);return NextResponse.json({error:"Reset failed; check server logs."},{status:500});}}
