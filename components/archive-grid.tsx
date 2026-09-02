'use client';
import {useMemo,useState} from 'react';
import type {ArchiveImage} from '../lib/archive-data';
export function ArchiveGrid({items}:{items:ArchiveImage[]}){
  const categories=['all',...Array.from(new Set(items.map(x=>x.category)))];
  const [filter,setFilter]=useState('all');
  const shown=useMemo(()=>filter==='all'?items:items.filter(x=>x.category===filter),[filter,items]);
  return <>
    <div className="archive-filters">{categories.map(c=><button className={filter===c?'active':''} onClick={()=>setFilter(c)} key={c}>{c}</button>)}</div>
    <div className="archive-grid">{shown.map((item,i)=><figure key={item.src}><img loading="lazy" src={item.src} alt={item.title}/><figcaption><span>{String(i+1).padStart(3,'0')}</span>{item.title}</figcaption></figure>)}</div>
  </>
}
