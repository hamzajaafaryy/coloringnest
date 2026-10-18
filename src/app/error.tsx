"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCcw } from "lucide-react";

export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}) {
  return (
    <div role="alert" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-100 text-amber-700"><AlertTriangle className="h-10 w-10"/></div>
      <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">Oops! A little paint spilled.</h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">This page couldn't load right now. Your saved art on this device is safe. Give it another try or explore our coloring pages.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="cc-btn cc-btn-primary"><RefreshCcw className="h-4 w-4"/> Try again</button>
        <Link href="/" className="cc-btn cc-btn-outline">Go home <ArrowRight className="h-4 w-4"/></Link>
      </div>
    </div>
  );
}
