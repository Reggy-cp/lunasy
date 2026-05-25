/* eslint-disable */
import {useState,useMemo,useRef} from "react";
const todayStr=()=>new Date().toISOString().split("T")[0];
const addDays=(s,n)=>{const d=new Date(s);d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];};
const fmt=(n)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const diffDays=(s)=>{const n=new Date();n.setHours(0,0,0,0);const d=new Date(s);d.setHours(0,0,0,0);return Math.round((d-n)/86400000);};
const uid=()=>Math.random().toString(36).slice(2,10);
const pct=(p,t)=>t>0?Math.round((p/t)*100):0;
const nowTime=()=>new Date().toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});

const BANKS=["BCA","BNI","BRI","Mandiri","BSI","CIMB","Jenius","GoPay","OVO","Dana","SeaBank","Jago","Blu"];
const CATEGORIES=[
  {id:"food",label:"Food"},
  {id:"transport",label:"Transport"},
  {id:"shopping",label:"Shopping"},
  {id:"hiburan",label:"Entertainment"},
  {id:"tagihan",label:"Bills"},
  {id:"lainnya",label:"Others"},
];
const CAT_ICON={food:"utensils",transport:"bus",shopping:"bag",hiburan:"film",tagihan:"file",lainnya:"more"};
const getCat=(id)=>CATEGORIES.find(c=>c.id===id)||CATEGORIES[5];
const REMINDER_OPT=[{v:0,l:"Hari H"},{v:1,l:"1 hari"},{v:3,l:"3 hari"},{v:7,l:"7 hari"}];

const T={
  light:{bg:"#ffffff",surface:"#ffffff",surface2:"#f7f7f7",border:"#efefef",text:"#0f172a",text2:"#64748b",text3:"#94a3b8",primary:"#29c36a",primaryBg:"#f0fdf4",primaryBorder:"#bbf7d0",navBg:"rgba(255,255,255,0.98)",inputBg:"#f5f5f5",modalBg:"rgba(0,0,0,0.4)",green:"#29c36a",greenBg:"#f0fdf4",greenBorder:"#bbf7d0",red:"#dc2626",redBg:"#fff5f5",redBorder:"#f5c6c6",teal:"#0891b2",tealBg:"#f0f9ff",tealBorder:"#bae6fd",lime:"#a8e63e",limeBg:"#f7fee7",limeBorder:"#d9f99d"},
  dark:{bg:"#0d0d0d",surface:"#1a1a1a",surface2:"#111111",border:"#2a2a2a",text:"#f0f0f0",text2:"#888888",text3:"#555555",primary:"#29c36a",primaryBg:"#0d2818",primaryBorder:"#1a4731",navBg:"rgba(13,13,13,0.98)",inputBg:"#111111",modalBg:"rgba(0,0,0,0.75)",green:"#29c36a",greenBg:"#0d1f0f",greenBorder:"#1a3320",red:"#ef4444",redBg:"#1f0d0d",redBorder:"#3d1a1a",teal:"#38bdf8",tealBg:"#0d1f2d",tealBorder:"#1a3a4d",lime:"#a8e63e",limeBg:"#1a2a00",limeBorder:"#3a5a00"},
};

const dueBadge=(due,status,dk)=>{
  if(status==="paid"||status==="verified"||!due)return null;
  const d=diffDays(due);
  if(d<0) return {label:`${Math.abs(d)}h terlambat`,color:dk?"#ef4444":"#dc2626",bg:dk?"#1f0d0d":"#fff5f5",urgent:true};
  if(d===0)return {label:"Due today",color:dk?"#ef4444":"#dc2626",bg:dk?"#1f0d0d":"#fff5f5",urgent:true};
  if(d<=3) return {label:`${d} days left`,color:dk?"#888":"#666",bg:"transparent",urgent:false};
  return      {label:`${d} days left`,color:dk?"#555":"#999",bg:"transparent",urgent:false};
};
const payStatusInfo=(status,t)=>{
  if(status==="paying")   return {label:"Awaiting Confirmation",icon:"clock", color:t.text2,bg:t.surface2,border:t.border};
  if(status==="verified") return {label:"Verified",      icon:"verify",color:t.green,bg:t.greenBg,border:t.greenBorder};
  if(status==="disputed") return {label:"Payment Rejected", icon:"x",    color:t.red,  bg:t.redBg,  border:t.redBorder};
  if(status==="paid")     return {label:"Settled",              icon:"check", color:t.green,bg:t.greenBg,border:t.greenBorder};
  return null;
};

const SEED_ACCOUNTS=[
  {id:"acc_reggy",name:"Reggy Caesar Putra",username:"reggy.caesar",phone:"081234567890",bio:"Developer & coffee addict",avatar:"RC",bankAccounts:[{id:"ba1",bank:"BCA",number:"1234567890",name:"Reggy Caesar Putra"},{id:"ba2",bank:"GoPay",number:"081234567890",name:"Reggy Caesar Putra"}]},
  {id:"acc_budi", name:"Budi Santoso",       username:"budi.santoso", phone:"082345678901",bio:"Finance guy",           avatar:"BS",bankAccounts:[{id:"ba3",bank:"Mandiri",number:"9876543210",name:"Budi Santoso"}]},
  {id:"acc_andi", name:"Andi Pratama",        username:"andi.p",       phone:"083456789012",bio:"Selalu bayar on time", avatar:"AP",bankAccounts:[{id:"ba4",bank:"BNI",number:"1122334455",name:"Andi Pratama"}]},
  {id:"acc_siti", name:"Siti Rahayu",         username:"siti.r",       phone:"084567890123",bio:"Traveler",             avatar:"SR",bankAccounts:[{id:"ba5",bank:"Dana",number:"084567890123",name:"Siti Rahayu"}]},
  {id:"acc_doni", name:"Doni Kurniawan",      username:"doni.k",       phone:"085678901234",bio:"",                     avatar:"DK",bankAccounts:[]},
];
const SEED_CONNECTIONS=[
  {id:"con1",fromId:"acc_reggy",toId:"acc_budi",status:"accepted"},
  {id:"con2",fromId:"acc_andi", toId:"acc_reggy",status:"accepted"},
  {id:"con3",fromId:"acc_siti", toId:"acc_reggy",status:"pending"},
  {id:"con4",fromId:"acc_reggy",toId:"acc_doni", status:"pending"},
];
const SEED_DEBTS=[
  {id:"d1",type:"regular",fromAccId:"acc_reggy",toAccId:"acc_budi",amount:150000,paidAmount:0,note:"Makan siang bareng",date:"2026-05-10",dueDate:addDays(todayStr(),2),status:"unpaid",reminders:[1,3],shared:true,category:"food",installments:null,payment:null},
  {id:"d2",type:"regular",fromAccId:"acc_andi",toAccId:"acc_reggy",amount:200000,paidAmount:0,note:"Patungan bensin",date:"2026-05-12",dueDate:addDays(todayStr(),-1),status:"paying",reminders:[3],shared:true,category:"transport",installments:null,payment:{payerNote:"Sudah transfer via BCA",proofImage:"https://placehold.co/400x300/f0fdf4/16a34a?text=Bukti+Transfer",submittedAt:"18 Mei 2026, 09:30",verifiedAt:null,verifiedBy:null,disputeNote:null}},
  {id:"d3",type:"regular",fromAccId:"acc_reggy",toAccId:"acc_siti",amount:75000,paidAmount:75000,note:"Kopi & snack",date:"2026-05-15",dueDate:addDays(todayStr(),7),status:"verified",reminders:[],shared:false,category:"food",installments:null,payment:{payerNote:"Cash langsung",proofImage:null,submittedAt:"16 Mei 2026, 14:00",verifiedAt:"16 Mei 2026, 15:20",verifiedBy:"acc_siti",disputeNote:null}},
  {id:"d4",type:"regular",fromAccId:"acc_budi",toAccId:"acc_reggy",amount:320000,paidAmount:0,note:"Tiket konser",date:"2026-05-01",dueDate:todayStr(),status:"unpaid",reminders:[1,7],shared:true,category:"hiburan",installments:null,payment:null},
  {id:"d5",type:"installment",fromAccId:"acc_reggy",toAccId:"acc_andi",amount:600000,paidAmount:200000,note:"Pinjam beli headphone",date:"2026-04-01",dueDate:addDays(todayStr(),14),status:"unpaid",reminders:[3],shared:true,category:"shopping",payment:null,installments:{total:3,paid:1,amount:200000,schedule:[
    {seq:1,dueDate:addDays(todayStr(),-30),status:"verified",paidAt:"2026-04-15",payment:{payerNote:"Transfer BCA",proofImage:null,submittedAt:"15 Apr",verifiedAt:"15 Apr",verifiedBy:"acc_andi",disputeNote:null}},
    {seq:2,dueDate:addDays(todayStr(),5),status:"paying",paidAt:null,payment:{payerNote:"Sudah transfer GoPay",proofImage:"https://placehold.co/400x300/f0f9ff/0891b2?text=Bukti",submittedAt:"17 Mei 2026",verifiedAt:null,verifiedBy:null,disputeNote:null}},
    {seq:3,dueDate:addDays(todayStr(),35),status:"unpaid",paidAt:null,payment:null},
  ]}},
];
// SEED_GROUPS removed
const _SEED_GROUPS=[
  {id:"g1",name:"Kos Bareng April",createdBy:"acc_reggy",category:"tagihan",totalAmount:2000000,date:"2026-05-01",note:"Biaya kos bulan April",members:[
    {accId:"acc_reggy",share:500000,paid:500000,paymentStatus:"verified",payment:{payerNote:"Transfer BCA",proofImage:null,submittedAt:"1 Mei",verifiedAt:"1 Mei",verifiedBy:"acc_reggy",disputeNote:null}},
    {accId:"acc_budi", share:500000,paid:0,paymentStatus:"unpaid",payment:null},
    {accId:"acc_andi", share:500000,paid:500000,paymentStatus:"verified",payment:{payerNote:"GoPay",proofImage:null,submittedAt:"2 Mei",verifiedAt:"2 Mei",verifiedBy:"acc_reggy",disputeNote:null}},
    {accId:"acc_siti", share:500000,paid:0,paymentStatus:"unpaid",payment:null},
  ]},
];
const SEED_SPLITS=[
  {id:"sb1",title:"Makan Malam Sate Senayan",category:"food",date:"2026-05-17",note:"Setelah meeting",totalAmount:385000,payerId:"acc_reggy",splitMode:"custom",createdBy:"acc_reggy",items:[{id:"i1",name:"Sate Ayam",amount:80000},{id:"i2",name:"Nasi+Lauk",amount:120000},{id:"i3",name:"Es Teh",amount:45000},{id:"i4",name:"Dessert",amount:60000},{id:"i5",name:"Pajak",amount:80000}],members:[
    {accId:"acc_reggy",share:120000,paid:120000,paymentStatus:"verified",payment:{payerNote:"Paid first",proofImage:null,submittedAt:"17 Mei",verifiedAt:"17 Mei",verifiedBy:"acc_reggy",disputeNote:null}},
    {accId:"acc_budi", share:95000, paid:0,paymentStatus:"paying",  payment:{payerNote:"Transfer GoPay",proofImage:null,submittedAt:"18 Mei",verifiedAt:null,verifiedBy:null,disputeNote:null}},
    {accId:"acc_andi", share:85000, paid:0,paymentStatus:"unpaid",  payment:null},
    {accId:"acc_siti", share:85000, paid:0,paymentStatus:"unpaid",  payment:null},
  ]},
];

function Icon({name,size=18,color="currentColor",sw=1.7}){
  const st={width:size,height:size,display:"inline-block",flexShrink:0,verticalAlign:"middle"};
  const p={fill:"none",stroke:color,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  if(name==="home")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if(name==="add")      return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
  if(name==="person")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  if(name==="people")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
  if(name==="check")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  if(name==="x")        return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  if(name==="chevron")  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
  if(name==="bell")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
  if(name==="upload")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>;
  if(name==="camera")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
  if(name==="scan")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>;
  if(name==="edit")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>;
  if(name==="link")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
  if(name==="clock")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  if(name==="alert")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  if(name==="calendar") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  if(name==="verify")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
  if(name==="transfer") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
  if(name==="creditcard")return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
  if(name==="receipt")  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>;
  if(name==="file")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  if(name==="sun")      return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
  if(name==="moon")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
  if(name==="inbox")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;
  if(name==="crown")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 17L5 7l5.5 5L12 4l1.5 8L19 7l2 10H3z"/></svg>;
  if(name==="lock")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  if(name==="settings") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;
  if(name==="utensils") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M21 2v20M18 2v7a3 3 0 003 3"/></svg>;
  if(name==="bus")      return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><line x1="8" y1="5" x2="8" y2="19"/></svg>;
  if(name==="bag")      return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
  if(name==="film")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
  if(name==="star")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  if(name==="split")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 00-1.172-2.872L3 3"/><path d="M21 3l-7.828 7.828"/></svg>;
  if(name==="info")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>;
  if(name==="heart")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
  if(name==="share")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
  if(name==="more")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
}


function LunasyLogo({size=32}){
  const s=size, r=s*0.22;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="llg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#29C36A"/>
          <stop offset="100%" stopColor="#A8E63E"/>
        </linearGradient>
        <linearGradient id="llg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8E63E"/>
          <stop offset="100%" stopColor="#29C36A"/>
        </linearGradient>
      </defs>
      {/* Left L */}
      <rect x="10" y="12" width="18" height="60" rx="9" fill="url(#llg1)"/>
      <rect x="10" y="55" width="42" height="18" rx="9" fill="url(#llg1)"/>
      {/* Right L (smaller, offset) */}
      <rect x="38" y="26" width="14" height="47" rx="7" fill="url(#llg2)"/>
      <rect x="38" y="58" width="30" height="14" rx="7" fill="url(#llg2)"/>
    </svg>
  );
}

function LunasyLogoFull({height=28, dark=false}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <LunasyLogo size={height}/>
      <span style={{fontSize:height*0.75,fontWeight:800,color:dark?"white":"#0f172a",fontFamily:"Inter,sans-serif",letterSpacing:"-0.02em"}}>Lunasy</span>
    </div>
  );
}

function Avatar({account,size=38}){
  return (
    <div style={{width:size,height:size,borderRadius:size*0.28,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.33,color:"#20a855",flexShrink:0,fontFamily:"Inter,sans-serif"}}>
      {account?.avatar||"?"}
    </div>
  );
}
function Toggle({value,onChange,t}){
  return (
    <div style={{width:40,height:22,borderRadius:11,background:value?t.green:"#d1d5db",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}} onClick={()=>onChange(!value)}>
      <div style={{position:"absolute",top:2,left:value?18:2,width:18,height:18,borderRadius:"50%",background:"white",transition:"left 0.2s"}}/>
    </div>
  );
}
function ProgressBar({paid,total,t}){
  const p=pct(paid,total);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:t.text3,marginBottom:3}}>
        <span>{fmt(paid)}</span><span>{p}%</span>
      </div>
      <div style={{height:4,borderRadius:3,background:t.border}}>
        <div style={{height:"100%",width:`${p}%`,background:p===100?t.green:t.primary,borderRadius:3}}/>
      </div>
    </div>
  );
}
function StatusBadge({si,t}){
  if(!si)return null;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,background:si.bg,color:si.color,border:`1px solid ${si.border}`,padding:"2px 7px",borderRadius:4,fontWeight:600}}>
      <Icon name={si.icon} size={9} color={si.color} sw={2.5}/>{si.label}
    </span>
  );
}

function MemberProofPanel({gId,accId,m,isMe,isMePayer,t,proofNote,setProofNote,proofImg,setProofImg,showPayDisputePanel,setShowPayDisputePanel,disputeText,setDisputeText,onSubmitProof,onVerify,onDispute,onClose}){
  const isPaying=m.paymentStatus==="paying";
  const isUnpaid=!m.paymentStatus||m.paymentStatus==="unpaid";
  const isDisputed=m.paymentStatus==="disputed";
  const fid=`pf_${gId}_${accId}`;
  const handlePayFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProofImg(ev.target.result);r.readAsDataURL(f);};
  return (
    <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,padding:14,marginTop:4}}>
      {m.payment&&(
        <div style={{marginBottom:12}}>
          {m.payment.payerNote&&<div style={{fontSize:13,color:t.text,fontStyle:"italic",background:t.surface2,borderRadius:8,padding:"7px 10px",marginBottom:8}}>"{m.payment.payerNote}"</div>}
          {m.payment.proofImage&&<img src={m.payment.proofImage} alt="Bukti" style={{width:"100%",borderRadius:8,maxHeight:130,objectFit:"cover",marginBottom:4,border:`1px solid ${t.border}`}}/>}
          <div style={{fontSize:10,color:t.text3}}>Dikirim: {m.payment.submittedAt}</div>
          {m.payment.verifiedAt&&<div style={{fontSize:10,color:t.green,marginTop:2}}><Icon name="check" size={9} color={t.green} sw={2.5}/> Dikonfirmasi: {m.payment.verifiedAt}</div>}
        </div>
      )}
      {isMe&&(isUnpaid||isDisputed)&&(
        <div>
          {isDisputed&&m.payment?.disputeNote&&<div style={{fontSize:11,color:t.red,background:t.redBg,border:`1px solid ${t.redBorder}`,borderRadius:8,padding:"7px 10px",marginBottom:10}}>Ditolak: "{m.payment.disputeNote}"</div>}
          <input className="input" placeholder="Payment note..." value={proofNote} onChange={e=>setProofNote(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.border}`,marginBottom:10}}/>
          <input type="file" accept="image/*" style={{display:"none"}} id={fid} onChange={handlePayFile}/>
          {proofImg
            ? <div style={{position:"relative",marginBottom:10}}><img src={proofImg} alt="prev" style={{width:"100%",borderRadius:8,maxHeight:110,objectFit:"cover"}}/><button style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setProofImg(null)}><Icon name="x" size={11} color="white" sw={2}/></button></div>
            : <div style={{border:`2px dashed ${t.primaryBorder}`,borderRadius:8,padding:14,textAlign:"center",cursor:"pointer",marginBottom:10}} onClick={()=>document.getElementById(fid).click()}><Icon name="camera" size={22} color={t.text3} sw={1.5}/><div style={{fontSize:12,color:t.text2,marginTop:4,fontWeight:500}}>Upload bukti transfer</div></div>
          }
          <div style={{display:"flex",gap:8}}>
            <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={onClose}>"Batal"</button>
            <button className="btn" style={{flex:2,background:t.primary,color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:!proofNote.trim()&&!proofImg?0.5:1}} onClick={()=>onSubmitProof({payerNote:proofNote,proofImage:proofImg,submittedAt:nowTime(),verifiedAt:null,verifiedBy:null,disputeNote:null})}><Icon name="upload" size={13} color="white" sw={2}/>Kirim Bukti</button>
          </div>
        </div>
      )}
      {isMePayer&&!isMe&&isPaying&&!showPayDisputePanel&&(
        <div style={{display:"flex",gap:8}}>
          <button className="btn" style={{flex:1,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",gap:5}} onClick={()=>setShowPayDisputePanel(true)}><Icon name="x" size={13} color={t.red} sw={2}/>"Tolak"</button>
          <button className="btn" style={{flex:2,background:t.green,color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:5}} onClick={()=>{onVerify();onClose();}}><Icon name="check" size={13} color="white" sw={2.5}/>Konfirmasi Lunas</button>
        </div>
      )}
      {isMePayer&&!isMe&&isPaying&&showPayDisputePanel&&(
        <div>
          <input className="input" placeholder="Reason for rejection..." value={disputeText} onChange={e=>setDisputeText(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.redBorder}`,marginBottom:8}}/>
          <div style={{display:"flex",gap:8}}>
            <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setShowPayDisputePanel(false)}>"Batal"</button>
            <button className="btn" style={{flex:1,background:t.red,color:"white",opacity:!disputeText.trim()?0.5:1}} onClick={()=>{onDispute(disputeText);onClose();setDisputeText("");setShowPayDisputePanel(false);}}>Tolak Bukti</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentModal({payModal,accounts,meId,t,payNote,setPayNote,payImg,setPayImg,payDNote,setPayDNote,showPayD,setShowPayD,payFullImg,setPayFullImg,payFileRef,handleSubmitProof,handleVerify,handleDispute,showToast,setPayModal}){
  const d=payModal.debt,seq=payModal.installSeq;
  const isMeOwing=d.fromAccId===meId,isMeLender=d.toAccId===meId;
  const other=accounts.find(a=>a.id===(isMeOwing?d.toAccId:d.fromAccId));
  const slot=seq!=null?d.installments?.schedule.find(s=>s.seq===seq):null;
  const tStatus=slot?slot.status:d.status;
  const tPay=slot?slot.payment:d.payment;
  const tAmt=slot?d.installments?.amount:(d.amount-d.paidAmount);
  const si=payStatusInfo(tStatus,t);
  const lenderBanks=accounts.find(a=>a.id===d.toAccId)?.bankAccounts||[];
  const handlePayFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPayImg(ev.target.result);r.readAsDataURL(f);};
  return (
          <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>{setPayModal(null);setPayNote("");setPayImg(null);setPayDNote("");setShowPayD(false);setPayFullImg(false);}}>
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 50px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${t.border}`}}>
                
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:t.text}}>{d.note}</div>
                  <div style={{fontSize:11,color:t.text3}}>{other?.name}</div>
                  {slot&&<div style={{fontSize:11,color:t.primary,fontWeight:600,marginTop:2}}>Cicilan ke-{seq} dari {d.installments.total}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:800,color:t.primary}}>{fmt(tAmt)}</div>
                  {si&&<StatusBadge si={si} t={t}/>}
                </div>
              </div>
              {isMeOwing&&lenderBanks.length>0&&(tStatus==="unpaid"||tStatus==="disputed")&&(
                <div style={{background:t.surface2,borderRadius:10,overflow:"hidden",border:`1px solid ${t.border}`,marginBottom:12}}>
                  <div style={{padding:"8px 12px",borderBottom:`1px solid ${t.border}`,fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.05em"}}>Transfer ke</div>
                  {lenderBanks.map((ba,i,arr)=>(
                    <div key={ba.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{ba.bank}</div><div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:t.primary}}>{ba.number}</div><div style={{fontSize:11,color:t.text3}}>{ba.name}</div></div>
                      <button style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:t.primary,fontWeight:600,display:"flex",alignItems:"center",gap:3}} onClick={()=>{navigator.clipboard?.writeText(ba.number);showToast(`${ba.bank} disalin`);}}><Icon name="file" size={12} color={t.primary} sw={2}/>Salin</button>
                    </div>
                  ))}
                </div>
              )}
              {tPay&&(
                <div style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:10,padding:14,marginBottom:14}}>
                  {tPay.payerNote&&<div style={{fontSize:13,color:t.text,fontStyle:"italic",marginBottom:8,background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px"}}>"{tPay.payerNote}"</div>}
                  {tPay.proofImage&&<img src={tPay.proofImage} alt="Bukti" style={{width:"100%",borderRadius:8,border:`1px solid ${t.border}`,cursor:"pointer",maxHeight:150,objectFit:"cover",marginBottom:4}} onClick={()=>setPayFullImg(true)}/>}
                  <div style={{fontSize:10,color:t.text3}}>Dikirim: {tPay.submittedAt}</div>
                  {tPay.verifiedAt&&<div style={{fontSize:10,color:t.green,marginTop:2}}><Icon name="check" size={9} color={t.green} sw={2.5}/> Dikonfirmasi: {tPay.verifiedAt}</div>}
                  {tPay.disputeNote&&<div style={{fontSize:11,color:t.red,marginTop:6,background:t.redBg,border:`1px solid ${t.redBorder}`,borderRadius:8,padding:"7px 10px"}}>Ditolak: "{tPay.disputeNote}"</div>}
                </div>
              )}
              {isMeOwing&&(tStatus==="unpaid"||tStatus==="disputed")&&(
                <div style={{background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:10,padding:14,marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.primary,marginBottom:10}}>{tStatus==="disputed"?"Kirim Ulang Bukti":"Kirim Bukti Pembayaran"}</div>
                  <input className="input" placeholder="Payment note..." value={payNote} onChange={e=>setPayNote(e.target.value)} style={{background:t.surface,color:t.text,border:`1px solid ${t.primaryBorder}`,marginBottom:10}}/>
                  <input type="file" accept="image/*" ref={payFileRef} style={{display:"none"}} onChange={handlePayFile}/>
                  {payImg
                    ? <div style={{position:"relative",marginBottom:10}}><img src={payImg} alt="prev" style={{width:"100%",borderRadius:8,maxHeight:120,objectFit:"cover",border:`1px solid ${t.primaryBorder}`}}/><button style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setPayImg(null)}><Icon name="x" size={11} color="white" sw={2}/></button></div>
                    : <div style={{background:t.surface,border:`2px dashed ${t.primaryBorder}`,borderRadius:8,padding:18,textAlign:"center",cursor:"pointer",marginBottom:10}} onClick={()=>payFileRef.current.click()}><Icon name="camera" size={28} color={t.text3} sw={1.5}/><div style={{fontSize:12,color:t.text2,fontWeight:600,marginTop:6}}>Upload foto bukti transfer</div></div>
                  }
                  <button className="btn" style={{width:"100%",background:t.primary,color:"white",padding:11,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:(!payNote.trim()&&!payImg)?0.5:1}} onClick={()=>{handleSubmitProof(d.id,{payerNote:payNote,proofImage:payImg,submittedAt:nowTime(),verifiedAt:null,verifiedBy:null,disputeNote:null},seq);setPayModal(null);}}>
                    <Icon name="upload" size={14} color="white" sw={2}/>Kirim Bukti
                  </button>
                </div>
              )}
              {isMeOwing&&tStatus==="paying"&&<div style={{background:t.surface2,borderRadius:10,padding:14,marginBottom:12,textAlign:"center",fontSize:13,color:t.text2}}>Bukti terkirim — menunggu konfirmasi {other?.name}</div>}
              {isMeLender&&tStatus==="paying"&&!showPayD&&(
                <div style={{display:"flex",gap:10,marginBottom:12}}>
                  <button className="btn" style={{flex:1,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",gap:5}} onClick={()=>setShowPayD(true)}><Icon name="x" size={13} color={t.red} sw={2}/>"Tolak"</button>
                  <button className="btn" style={{flex:2,background:t.green,color:"white",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}} onClick={()=>{handleVerify(d.id,seq);setPayModal(null);}}><Icon name="check" size={13} color="white" sw={2.5}/>Konfirmasi Lunas</button>
                </div>
              )}
              {isMeLender&&tStatus==="paying"&&showPayD&&(
                <div style={{marginBottom:12}}>
                  <input className="input" placeholder="Reason for rejection..." value={payDNote} onChange={e=>setPayDNote(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.redBorder}`,marginBottom:8}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setShowPayD(false)}>"Batal"</button>
                    <button className="btn" style={{flex:1,background:t.red,color:"white",opacity:!payDNote.trim()?0.5:1}} onClick={()=>{handleDispute(d.id,payDNote,seq);setPayModal(null);}}>Tolak Bukti</button>
                  </div>
                </div>
              )}
              {tStatus==="verified"&&<div style={{background:t.greenBg,border:`1px solid ${t.greenBorder}`,borderRadius:10,padding:14,marginBottom:12,textAlign:"center"}}><Icon name="verify" size={28} color={t.green} sw={1.5}/><div style={{fontSize:14,fontWeight:700,color:t.green,marginTop:8}}>Pembayaran Terverifikasi</div></div>}
              <button className="btn" style={{width:"100%",background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setPayModal(null)}>"Tutup"</button>
            </div>
            {payFullImg&&tPay?.proofImage&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setPayFullImg(false)}><img src={tPay.proofImage} alt="Bukti" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}}/></div>}
          </div>
  );
}

function compressImage(dataUrl, maxW, quality) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      try {
        var w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        var canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch(e) { reject(e); }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
async function scanReceiptAPI(dataUrl) {
  var compressed;
  try { compressed = await compressImage(dataUrl, 800, 0.6); }
  catch(ce) { throw new Error("Compress failed: " + ce.message); }
  var b64 = compressed.split(",")[1];
  if (!b64 || b64.length < 100) throw new Error("Image too small after compress");
  var payload = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: [
        {type: "image", source: {type: "base64", media_type: "image/jpeg", data: b64}},
        {type: "text", text: "You are a receipt parser. Extract all line items from this receipt image. Respond with ONLY a JSON object. No other text. JSON format: {title: string, category: food, total: number, items: [{name: string, amount: number}], tax: number, service: number}"}
      ]
    }]
  };
  var res;
  try { res = await fetch("https://api.anthropic.com/v1/messages", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)}); }
  catch(fe) { throw new Error("Network: " + fe.message + " (b64 size:" + b64.length + ")"); }
  var txt;
  try { txt = await res.text(); }
  catch(te) { throw new Error("Read failed: " + te.message); }
  var data;
  try { data = JSON.parse(txt); }
  catch(je) { throw new Error("Not JSON: " + txt.slice(0, 60)); }
  if (data.error) throw new Error("API: " + (data.error.message || JSON.stringify(data.error).slice(0,40)));
  var raw = (data.content && data.content[0] && data.content[0].text) || "";
  var s = raw.indexOf("{"); var e = raw.lastIndexOf("}");
  if (s < 0 || e < s) throw new Error("No JSON block in: " + raw.slice(0, 60));
  var parsed;
  try { parsed = JSON.parse(raw.slice(s, e + 1)); }
  catch(pe) { throw new Error("Parse: " + raw.slice(s, s + 60)); }
  if (!parsed.items) throw new Error("No items field in response");
  return parsed;
}

function CreateSplitModal({createSplit,connIds,accounts,meId,t,handleAddSplit,setCreateSplit,showToast}){
  const [step,setStep]=useState(0);
  const [title,setTitle]=useState("");
  const [cat,setCat]=useState("food");
  const [note,setNote]=useState("");
  const [date,setDate]=useState(todayStr());
  const [mode,setMode]=useState("equal");
  const [members,setMembers]=useState([meId]);
  const [custom,setCustom]=useState({});
  const [items,setItems]=useState([{id:uid(),name:"",amount:""}]);
  const [billImg,setBillImg]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiErr,setAiErr]=useState("");
  const [aiRes,setAiRes]=useState(null);
  const fRef2=useRef();
  const getAcc2=(id)=>accounts.find(a=>a.id===id);
  const totalItems=items.reduce((s,i)=>s+(parseInt(i.amount)||0),0);
  const getShare=(id)=>mode==="equal"?Math.round(totalItems/members.length):parseInt(custom[id]||0);
  const totalShares=members.reduce((s,id)=>s+getShare(id),0);
  const isValid=title.trim()&&members.length>=2&&totalItems>0;
  const handleFile2=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setBillImg(ev.target.result);r.readAsDataURL(f);};
  const doScan=async()=>{if(!billImg)return;setAiLoading(true);setAiErr('');setAiRes(null);try{const p=await scanReceiptAPI(billImg);if(!p||!p.items||!p.items.length){setAiErr('Item tidak ditemukan. Input manual di bawah.');setAiLoading(false);return;}setAiRes(p);setTitle(p.title||'Split Bill');if(p.category)setCat(p.category);const itms=[...p.items];if(p.tax>0)itms.push({name:'Pajak',amount:p.tax});if(p.service>0)itms.push({name:'Service',amount:p.service});setItems(itms.map(it=>({id:uid(),name:String(it.name||''),amount:String(it.amount||0)})));setMode('itemized');setStep(2);}catch(err){setAiErr('AI scan tidak tersedia di app mobile. Gunakan Input Manual.');}setAiLoading(false);};
  const doCreate=()=>{if(!isValid)return;const total=mode==="custom"?totalShares:totalItems;handleAddSplit({id:"sb"+uid(),title,category:cat,date,note,totalAmount:total,payerId:meId,splitMode:mode,createdBy:meId,proofImage:splitProofImg,items:items.filter(i=>i.name&&i.amount).map(i=>({...i,id:i.id||uid(),amount:parseInt(i.amount)})),members:members.map(id=>({accId:id,share:getShare(id),paid:id===meId?getShare(id):0,paymentStatus:id===meId?"verified":"unpaid",payment:id===meId?{payerNote:"Paid first",proofImage:null,submittedAt:nowTime(),verifiedAt:nowTime(),verifiedBy:meId,disputeNote:null}:null}))});};
  if(!createSplit)return null;
  return (
          <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>setCreateSplit(false)}>
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <div style={{height:3,borderRadius:3,background:t.border,marginBottom:18,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/4)*100}%`,background:t.primary,borderRadius:3}}/></div>
              {step===0&&(
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:14}}>Buat Split Bill</div>
                  <div style={{background:t.primaryBg,border:`1.5px solid ${t.primaryBorder}`,borderRadius:12,padding:18,marginBottom:10,cursor:"pointer"}} onClick={()=>setStep(1)}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <Icon name="scan" size={24} color={t.primary} sw={1.8}/>
                      <div><div style={{fontSize:14,fontWeight:700,color:t.primary}}>Scan dengan AI</div><div style={{fontSize:12,color:t.text2,marginTop:2}}>Foto struk — AI baca otomatis</div></div>
                    </div>
                  </div>
                  <div style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:12,padding:18,cursor:"pointer"}} onClick={()=>setStep(2)}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <Icon name="edit" size={22} color={t.text2} sw={1.8}/>
                      <div><div style={{fontSize:14,fontWeight:700,color:t.text}}>Input Manual</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Ketik sendiri item dan harga</div></div>
                    </div>
                  </div>
                  <button className="btn" style={{width:"100%",marginTop:14,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setCreateSplit(false)}>"Batal"</button>
                </div>
              )}
              {step===1&&(
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:14}}>Scan Struk dengan AI</div>
                  <input type="file" accept="image/*" ref={fRef2} style={{display:"none"}} onChange={handleFile2}/>
                  {!billImg
                    ? <div style={{background:t.surface2,border:`2px dashed ${t.primaryBorder}`,borderRadius:12,padding:32,textAlign:"center",cursor:"pointer",marginBottom:14}} onClick={()=>fRef2.current.click()}><Icon name="camera" size={44} color={t.primary} sw={1.4}/><div style={{fontSize:14,fontWeight:700,color:t.primary,marginTop:10}}>Foto atau pilih gambar</div></div>
                    : <div style={{position:"relative",marginBottom:14}}><img src={billImg} alt="Struk" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover",border:`1.5px solid ${t.primaryBorder}`}}/><button style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{setBillImg(null);setAiRes(null);setAiErr("");}}><Icon name="x" size={13} color="white" sw={2}/></button></div>
                  }
                  {aiRes&&<div style={{background:t.greenBg,border:`1px solid ${t.greenBorder}`,borderRadius:10,padding:14,marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:t.green,marginBottom:4}}><Icon name="check" size={13} color={t.green} sw={2.5}/> Berhasil dibaca!</div><div style={{fontSize:13,fontWeight:700,color:t.text}}>{aiRes.title}</div></div>}
                  {aiErr&&<div style={{marginBottom:12}}>
                  <div style={{background:t.redBg,border:`1px solid ${t.redBorder}`,borderRadius:8,padding:10,marginBottom:8,fontSize:12,color:t.red}}>{aiErr}</div>
                  <button className="btn" style={{width:"100%",background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,fontSize:13}} onClick={()=>setStep(2)}>Manual Input →</button>
                </div>}
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setStep(0)}>"Kembali"</button>
                    {!aiRes
                      ? <button className="btn" style={{flex:2,background:aiLoading?t.surface2:t.primary,color:aiLoading?t.text2:"white",fontWeight:700,opacity:!billImg||aiLoading?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={doScan} disabled={!billImg||aiLoading}>{aiLoading?<><Icon name="clock" size={14} color={t.text2} sw={2}/>Membaca...</>:<><Icon name="scan" size={14} color="white" sw={1.8}/>Scan</>}</button>
                      : <button className="btn" style={{flex:2,background:t.primary,color:"white",fontWeight:700}} onClick={()=>setStep(2)}>Use Result</button>
                    }
                  </div>
                </div>
              )}
              {step===2&&(
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:14}}>Detail Split Bill</div>
                  <div style={{marginBottom:12}}><div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:6}}>Nama</div><input className="input" placeholder="Makan malam di restoran" value={title} onChange={e=>setTitle(e.target.value)} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/></div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:8}}>Kategori</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{CATEGORIES.map(c=>{const active=cat===c.id;return <div key={c.id} style={{display:"inline-flex",gap:4,padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${active?t.primary:t.border}`,background:active?t.primaryBg:"transparent",color:active?t.primary:t.text2}} onClick={()=>setCat(c.id)}>{c.label}</div>;})}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}><div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:6}}>Tanggal</div><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/></div>
                  <div style={{marginBottom:16}}><div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:6}}>Catatan</div><input className="input" placeholder="Opsional" value={note} onChange={e=>setNote(e.target.value)} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/></div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setStep(aiRes?1:0)}>"Kembali"</button>
                    <button className="btn" style={{flex:1,background:t.primary,color:"white",opacity:!title.trim()?0.5:1}} onClick={()=>title.trim()&&setStep(3)}>Lanjut</button>
                  </div>
                </div>
              )}
              {step===3&&(
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:14}}>Pilih Anggota</div>
                  {[meId,...connIds].map(id=>{const acc=getAcc2(id);const sel=members.includes(id);return(<div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:sel?t.primaryBg:t.surface2,border:`1px solid ${sel?t.primary:t.border}`,borderRadius:10,marginBottom:8,cursor:id===meId?"default":"pointer"}} onClick={id===meId?undefined:()=>setMembers(p=>p.includes(id)?p.length>1?p.filter(x=>x!==id):p:[...p,id])}><Avatar account={acc} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{acc?.name} {id===meId&&<span style={{fontSize:10,color:t.primary}}>(You)</span>}</div><div style={{fontSize:11,color:t.text3}}>@{acc?.username}</div></div>{sel?<Icon name="check" size={16} color={t.primary} sw={2.5}/>:<Icon name="add" size={16} color={t.text3} sw={1.8}/>}</div>);})}
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setStep(2)}>"Kembali"</button>
                    <button className="btn" style={{flex:1,background:t.primary,color:"white",opacity:members.length<2?0.5:1}} onClick={()=>members.length>=2&&setStep(4)}>Lanjut</button>
                  </div>
                </div>
              )}
              {step===4&&(
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:14}}>Pembagian</div>
                  <div style={{display:"flex",gap:6,marginBottom:14}}>
                    {[["equal","Equal"],["custom","Custom"],["itemized","Per Item"]].map(([m,l])=>(
                      <button key={m} style={{flex:1,padding:"8px 4px",borderRadius:6,border:`1px solid ${mode===m?t.primary:t.border}`,background:mode===m?t.primaryBg:"transparent",color:mode===m?t.primary:t.text2,fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:600,cursor:"pointer"}} onClick={()=>setMode(m)}>{l}</button>
                    ))}
                  </div>
                  {mode==="equal"&&(
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:6}}>Total (Rp)</div>
                      <input className="input" type="number" placeholder="0" value={items[0]?.amount||""} onChange={e=>setItems([{id:"i0",name:"Total",amount:e.target.value}])} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/>
                      {totalItems>0&&<div style={{marginTop:8,background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:8,padding:"10px 12px",fontSize:12,color:t.primary,fontWeight:600}}>Per orang: {fmt(Math.round(totalItems/members.length))}</div>}
                    </div>
                  )}
                  {mode==="custom"&&(
                    <div style={{marginBottom:14}}>
                      {members.map(id=>{const acc=getAcc2(id);return(<div key={id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><Avatar account={acc} size={32}/><div style={{flex:1,fontSize:12,fontWeight:600,color:t.text}}>{acc?.name}</div><input className="input" type="number" placeholder="0" value={custom[id]||""} onChange={e=>setCustom({...custom,[id]:e.target.value})} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`,width:110,padding:"8px 10px"}}/></div>);})}
                      {totalShares>0&&<div style={{background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:8,padding:10,fontSize:12,color:t.primary,fontWeight:700,textAlign:"center"}}>Total: {fmt(totalShares)}</div>}
                    </div>
                  )}
                  {mode==="itemized"&&(
                    <div style={{marginBottom:14}}>
                      <div style={{maxHeight:200,overflowY:"auto"}}>
                        {items.map((item,idx)=>(
                          <div key={item.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                            <input className="input" placeholder="Nama item" value={item.name} onChange={e=>setItems(items.map((it,i)=>i===idx?{...it,name:e.target.value}:it))} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`,flex:2}}/>
                            <input className="input" type="number" placeholder="Rp" value={item.amount} onChange={e=>setItems(items.map((it,i)=>i===idx?{...it,amount:e.target.value}:it))} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`,flex:1,padding:"10px 8px"}}/>
                            {items.length>1&&<button style={{background:"none",border:"none",color:t.red,cursor:"pointer",fontSize:18,flexShrink:0}} onClick={()=>setItems(items.filter((_,i)=>i!==idx))}>×</button>}
                          </div>
                        ))}
                      </div>
                      <button className="btn" style={{width:"100%",background:t.surface2,color:t.text2,border:`1px solid ${t.border}`,fontSize:12,marginBottom:10}} onClick={()=>setItems([...items,{id:uid(),name:"",amount:""}])}>+ Tambah Item</button>
                      {totalItems>0&&<div style={{background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:8,padding:10,fontSize:12,color:t.primary,fontWeight:700,textAlign:"center"}}>Total: {fmt(totalItems)} — {fmt(Math.round(totalItems/members.length))}/orang</div>}
                    </div>
                  )}
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setStep(3)}>"Kembali"</button>
                    <div style={{width:"100%",marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Proof Photo <span style={{fontWeight:400}}>(Optional)</span></div>
                      {splitProofImg?(
                        <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:`1px solid ${t.border}`,marginBottom:4}}>
                          <img src={splitProofImg} alt="proof" style={{width:"100%",maxHeight:100,objectFit:"cover",display:"block"}}/>
                          <button className="btn" style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",padding:0}} onClick={()=>setSplitProofImg(null)}><Icon name="x" size={10} color="white" sw={2}/></button>
                        </div>
                      ):(
                        <div style={{border:`2px dashed ${t.border}`,borderRadius:10,padding:"10px",textAlign:"center",cursor:"pointer",background:t.surface2,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>splitProofRef.current?.click()}>
                          <Icon name="upload" size={14} color={t.text3} sw={1.5}/>
                          <span style={{fontSize:11,color:t.text3}}>Add photo</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" ref={splitProofRef} style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setSplitProofImg(ev.target.result);r.readAsDataURL(f);}}/>
                    </div>
                    <button className="btn" style={{flex:1,background:t.green,color:"white",fontWeight:700,opacity:!isValid?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={doCreate}><Icon name="check" size={14} color="white" sw={2.5}/>Create Split Bill</button>
                  </div>
                </div>
              )}
            </div>
          </div>
  );
}


export default function DebtTracker(){
  const [dark,setDark]=useState(false);
  const t=dark?T.dark:T.light;
  const [accounts,setAccounts]=useState(SEED_ACCOUNTS);
  const [connections,setConnections]=useState(SEED_CONNECTIONS);
  const [debts,setDebts]=useState(SEED_DEBTS);
  const [splits,setSplits]=useState(SEED_SPLITS);
  const [meId,setMeId]=useState("acc_reggy");
  const [view,setView]=useState("dashboard");
  const [filter,setFilter]=useState("all");
  const [catFilter,setCatFilter]=useState("all");
  const [mainTab,setMainTab]=useState("debts");
  const [toast,setToast]=useState(null);
  const [payModal,setPayModal]=useState(null);
  const [installModal,setInstallModal]=useState(null);
  const [reminderDebt,setReminderDebt]=useState(null);
  const [splitDetail,setSplitDetail]=useState(null);
  const [createSplit,setCreateSplit]=useState(false);
  const [addDebtModal,setAddDebtModal]=useState(false);
  const [switchModal,setSwitchModal]=useState(false);
  const [accountTab,setAccountTab]=useState("connected");
  const [searchQ,setSearchQ]=useState("");
  const [profileAcc,setProfileAcc]=useState(null);
  const [editProfile,setEditProfile]=useState(false);
  const [editForm,setEditForm]=useState({});
  const [showNotifSettings,setShowNotifSettings]=useState(false);
  const [showAddFriend,setShowAddFriend]=useState(false);
  const [showInviteModal,setShowInviteModal]=useState(false);
  const [addProofImg,setAddProofImg]=useState(null);
  const addProofRef=useRef();
  const [showPreferences,setShowPreferences]=useState(false);
  const [notifSettings,setNotifSettings]=useState({dueSoon:true,dueToday:true,overdue:true,paymentReceived:true,paymentConfirmed:true,newConnection:true,splitBill:true,sound:true,vibrate:true});
  const [prefSettings,setPrefSettings]=useState({currency:"IDR",dateFormat:"DD/MM/YYYY",defaultDuedays:7,defaultCategory:"lainnya",showBalance:true,compactView:false,autoVerify:false,theme:"system"});
  const [confirmDialog,setConfirmDialog]=useState(null);
  const [showOnboarding,setShowOnboarding]=useState(true);
  const [onboardStep,setOnboardStep]=useState(0);
  const [showNotifPanel,setShowNotifPanel]=useState(false);
  const [notifList,setNotifList]=useState([
    {id:"n1",type:"payment",title:"Andi Pratama kirim bukti bayar",body:"Rp 200.000 · Patungan bensin",time:"18 Mei, 09:30",read:false,icon:"upload"},
    {id:"n2",type:"due",title:"Hutang ke Budi jatuh tempo besok",body:"Rp 150.000 · Makan siang bareng",time:"17 Mei, 08:00",read:false,icon:"bell"},
    {id:"n3",type:"verified",title:"Siti Rahayu konfirmasi pembayaran",body:"Rp 75.000 lunas",time:"16 Mei, 15:20",read:true,icon:"check"},
  ]);
  const [proofPanel,setProofPanel]=useState(null);
  const [proofNote,setProofNote]=useState("");
  const [proofImg,setProofImg]=useState(null);
  const [disputeText,setDisputeText]=useState("");
  const [showDisputePanel,setShowDisputePanel]=useState(false);
  const [addForm,setAddForm]=useState({type:"lend",toAccId:"",amount:"",note:"",date:todayStr(),dueDate:addDays(todayStr(),7),reminders:[1,3],shared:true,category:"lainnya",isInstallment:false,installTotal:3,installAmount:""});
  const [payNote,setPayNote]=useState("");
  const [payImg,setPayImg]=useState(null);
  const [payDNote,setPayDNote]=useState("");
  const [showPayD,setShowPayD]=useState(false);
  const [payFullImg,setPayFullImg]=useState(false);
  const payFileRef=useRef();
  const [showPayDisputePanel,setShowPayDisputePanel]=useState(false);
  const me=accounts.find(a=>a.id===meId);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const addNotif=(type,title,body,icon="bell")=>setNotifList(prev=>[{id:uid(),type,title,body,time:nowTime(),read:false,icon},...prev]);
  const unreadNotif=notifList.filter(n=>!n.read).length;
  const getAcc=(id)=>accounts.find(a=>a.id===id);
  const getConn=(a,b)=>connections.find(c=>(c.fromId===a&&c.toId===b)||(c.fromId===b&&c.toId===a));
  const isConn=(a,b)=>getConn(a,b)?.status==="accepted";
  const myConns=connections.filter(c=>(c.fromId===meId||c.toId===meId)&&c.status==="accepted");
  const connIds=myConns.map(c=>c.fromId===meId?c.toId:c.fromId);
  const incoming=connections.filter(c=>c.toId===meId&&c.status==="pending");
  const outgoing=connections.filter(c=>c.fromId===meId&&c.status==="pending");
  const discover=accounts.filter(a=>a.id!==meId&&!connIds.includes(a.id)&&!incoming.some(c=>c.fromId===a.id));
  const sendReq=(toId)=>{if(isConn(meId,toId)||outgoing.some(c=>c.toId===toId))return;setConnections(prev=>[...prev,{id:uid(),fromId:meId,toId,status:"pending"}]);showToast("Connection request sent");};
  const acceptReq=(cId)=>{setConnections(prev=>prev.map(c=>c.id===cId?{...c,status:"accepted"}:c));showToast("Connection accepted");addNotif("connection","New connection accepted","You are now connected","link");};
  const rejectReq=(cId)=>{const conn=connections.find(c=>c.id===cId);const isOut=conn?.fromId===meId;if(isOut){setConfirmDialog({title:"Cancel Request",msg:"Yakin ingin membatalkan permintaan koneksi ini?",onConfirm:()=>setConnections(prev=>prev.filter(c=>c.id!==cId))});}else{setConnections(prev=>prev.filter(c=>c.id!==cId));showToast("Declined");}};
  const disconn=(aId)=>{const acc=accounts.find(a=>a.id===aId);setConfirmDialog({title:"Disconnect",msg:`${"Yakin ingin memutus koneksi dengan"} ${acc?.name}${"? Catatan hutang bersama tetap tersimpan."}`,onConfirm:()=>{const c=getConn(meId,aId);if(c)setConnections(connections.filter(x=>x.id!==c.id));showToast("Disconnected");setProfileAcc(null);}});};
  const myDebts=debts.filter(d=>d.fromAccId===meId||d.toAccId===meId);
  const isDone=(d)=>["verified","paid"].includes(d.status);
  const totalIOwe=myDebts.filter(d=>d.fromAccId===meId&&!isDone(d)).reduce((s,d)=>s+(d.amount-d.paidAmount),0);
  const totalOwed=myDebts.filter(d=>d.toAccId===meId&&!isDone(d)).reduce((s,d)=>s+(d.amount-d.paidAmount),0);
  const netBalance=totalOwed-totalIOwe;
  const overdueCount=myDebts.filter(d=>!isDone(d)&&d.dueDate&&diffDays(d.dueDate)<0).length;
  const todayCount=myDebts.filter(d=>!isDone(d)&&d.dueDate&&diffDays(d.dueDate)===0).length;
  const pendVerif=myDebts.filter(d=>d.toAccId===meId&&(d.status==="paying"||(d.installments?.schedule.some(s=>s.status==="paying")))).length;
  const mySplits=splits.filter(s=>s.members.some(m=>m.accId===meId));
  const filteredDebts=useMemo(()=>{
    let list=myDebts;
    if(filter==="owe")    list=list.filter(d=>d.fromAccId===meId&&!isDone(d));
    else if(filter==="lent")   list=list.filter(d=>d.toAccId===meId&&!isDone(d));
    else if(filter==="paid")   list=list.filter(d=>isDone(d));
    else if(filter==="overdue")list=list.filter(d=>!isDone(d)&&d.dueDate&&diffDays(d.dueDate)<0);
    else if(filter==="soon")   list=list.filter(d=>!isDone(d)&&d.dueDate&&diffDays(d.dueDate)>=0&&diffDays(d.dueDate)<=3);
    else if(filter==="verif")  list=list.filter(d=>d.status==="paying"||(d.installments?.schedule.some(s=>s.status==="paying")));
    if(catFilter!=="all")list=list.filter(d=>d.category===catFilter);
    return [...list].sort((a,b)=>{if(isDone(a)&&!isDone(b))return 1;if(isDone(b)&&!isDone(a))return -1;if(!a.dueDate)return 1;if(!b.dueDate)return -1;return new Date(a.dueDate)-new Date(b.dueDate);});
  },[myDebts,filter,catFilter,meId]);
  const handleSubmitProof=(id,pd,seq)=>{
    setDebts(debts.map(d=>{if(d.id!==id)return d;if(seq!=null){const ns=d.installments.schedule.map(s=>s.seq===seq?{...s,status:"paying",payment:pd}:s);return{...d,installments:{...d.installments,schedule:ns}};}return{...d,status:"paying",payment:pd};}));
    showToast("Proof sent");addNotif("payment","Payment proof sent","Waiting for recipient confirmation","upload");
  };
  const handleVerify=(id,seq)=>{
    setDebts(debts.map(d=>{if(d.id!==id)return d;if(seq!=null){const ns=d.installments.schedule.map(s=>s.seq===seq?{...s,status:"verified",paidAt:todayStr(),payment:{...s.payment,verifiedAt:nowTime(),verifiedBy:meId}}:s);const pn=ns.filter(s=>s.status==="verified").length;return{...d,paidAmount:pn*d.installments.amount,status:pn===d.installments.total?"verified":"unpaid",installments:{...d.installments,paid:pn,schedule:ns}};}return{...d,status:"verified",paidAmount:d.amount,payment:{...d.payment,verifiedAt:nowTime(),verifiedBy:meId}};}));
    showToast("Payment confirmed!");addNotif("verified","Payment confirmed","Hutang telah lunas","check");
  };
  const handleDispute=(id,dn,seq)=>{
    setDebts(debts.map(d=>{if(d.id!==id)return d;if(seq!=null){const ns=d.installments.schedule.map(s=>s.seq===seq?{...s,status:"disputed",payment:{...s.payment,disputeNote:dn}}:s);return{...d,installments:{...d.installments,schedule:ns}};}return{...d,status:"disputed",payment:{...d.payment,disputeNote:dn}};}));
    showToast("Proof rejected","error");
  };
  const handleAddDebt=()=>{
    if(!addForm.toAccId||!addForm.amount||!addForm.note){showToast("Lengkapi semua field","error");return;}
    const amt=parseInt(addForm.amount);let ins=null;
    if(addForm.isInstallment){const iAmt=parseInt(addForm.installAmount)||Math.round(amt/parseInt(addForm.installTotal));ins={total:parseInt(addForm.installTotal),paid:0,amount:iAmt,schedule:Array.from({length:parseInt(addForm.installTotal)},(_,i)=>({seq:i+1,dueDate:addDays(addForm.dueDate,i*30),status:"unpaid",paidAt:null,payment:null}))};}
    const nd={id:"d"+uid(),type:ins?"installment":"regular",amount:amt,paidAmount:0,note:addForm.note,date:addForm.date,dueDate:addForm.dueDate,reminders:addForm.reminders,status:"unpaid",shared:addForm.shared,category:addForm.category,installments:ins,payment:addProofImg?{payerNote:"",proofImage:addProofImg,submittedAt:nowTime(),verifiedAt:null,verifiedBy:null,disputeNote:null}:null};
    if(addForm.type==="lend"){nd.fromAccId=addForm.toAccId;nd.toAccId=meId;}else{nd.fromAccId=meId;nd.toAccId=addForm.toAccId;}
    setDebts([nd,...debts]);
    setAddForm({type:"lend",toAccId:"",amount:"",note:"",date:todayStr(),dueDate:addDays(todayStr(),7),reminders:[1,3],shared:true,category:"lainnya",isInstallment:false,installTotal:3,installAmount:""});
    setAddDebtModal(false);setView("dashboard");setAddProofImg(null);showToast("Debt record added");
  };
  const handleSaveReminder=(id,r,due)=>{setDebts(debts.map(d=>d.id===id?{...d,reminders:r,dueDate:due}:d));setReminderDebt(null);showToast("Reminder updated");};
  const handleSwitch=(id)=>{setMeId(id);setSwitchModal(false);setView("dashboard");showToast(`Beralih ke ${accounts.find(a=>a.id===id)?.name}`);};
  const handleSaveProfile=()=>{setAccounts(accounts.map(a=>a.id===meId?{...a,...editForm}:a));setEditProfile(false);showToast("Profile updated");};
  const handleAddSplit=(s)=>{setSplits([s,...splits]);setCreateSplit(false);showToast("Split bill created");};
  const handleSubmitSplitProof=(sId,aId,pd)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paymentStatus:"paying",payment:pd})}));showToast("Proof sent");};
  const handleVerifySplitMember=(sId,aId)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paid:m.share,paymentStatus:"verified",payment:{...m.payment,verifiedAt:nowTime(),verifiedBy:meId}})}));showToast("Confirmed!");};
  const handleDisputeSplitMember=(sId,aId,dn)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paymentStatus:"disputed",payment:{...m.payment,disputeNote:dn}})}));showToast("Declined","error");};
  const toggleAddReminder=(v)=>setAddForm(f=>({...f,reminders:f.reminders.includes(v)?f.reminders.filter(x=>x!==v):[...f.reminders,v]}));

  const renderDebtCard=(d)=>{
    const isMeOwing=d.fromAccId===meId,isMeLender=d.toAccId===meId;
    const other=getAcc(isMeOwing?d.toAccId:d.fromAccId);
    const due=dueBadge(d.dueDate,d.status,dark);
    const done=isDone(d);
    const si=payStatusInfo(d.status,t);
    const isIns=d.type==="installment";
    const rem=d.amount-d.paidAmount;
    const instPaying=isIns?d.installments.schedule.filter(s=>s.status==="paying").length:0;
    return (
      <div key={d.id} onClick={()=>isIns?setInstallModal(d):setPayModal({debt:d,installSeq:null})} style={{padding:"14px 14px 12px",background:t.surface,borderRadius:14,border:`1px solid ${t.border}`,marginBottom:8,cursor:"pointer",position:"relative",overflow:"hidden"}}>


        {/* Row 1: Avatar + Name + Amount */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:4}}>
          <Avatar account={other} size={38}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14,fontWeight:700,color:t.text}}>{other?.name||"Unknown"}</span>
                <span style={{fontSize:10,background:catFilter===d.category?t.primaryBg:t.surface2,color:catFilter===d.category?t.primary:t.text3,padding:"2px 8px",borderRadius:20,fontWeight:500,border:`1px solid ${catFilter===d.category?t.primaryBorder:t.border}`,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setCatFilter(catFilter===d.category?"all":d.category);}}>{d.category.charAt(0).toUpperCase()+d.category.slice(1)}</span>
              </div>
              <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:done?t.text3:isMeOwing?t.red:t.green}}>{isMeOwing?"−":"+"}{fmt(rem)}</span>
            </div>

            {/* Row 2: Note */}
            <div style={{fontSize:12,color:t.text3,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.note}</div>
          </div>
        </div>

        {/* Row 3: Status + Due + Actions */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            {done&&<span style={{fontSize:10,fontWeight:600,color:t.green,background:t.greenBg,border:`1px solid ${t.greenBorder}`,padding:"2px 8px",borderRadius:20}}>✓ Settled</span>}
            {si&&!done&&<StatusBadge si={si} t={t}/>}
            {due&&!done&&d.status==="unpaid"&&<span style={{fontSize:10,fontWeight:600,color:due.color,padding:"2px 8px",borderRadius:20,background:due.bg}}>{due.label}</span>}
            {isIns&&<span style={{fontSize:10,color:t.text3,fontWeight:500}}>{d.installments.paid}/{d.installments.total} installment</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {!done&&isMeOwing&&d.status==="unpaid"&&!isIns&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:`1.5px solid ${t.primary}`,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={e=>{e.stopPropagation();setPayModal({debt:d,installSeq:null});}}><Icon name="creditcard" size={11} color={t.primary} sw={2}/>Pay</button>}
            {!done&&isMeLender&&d.status==="paying"&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:`1.5px solid ${t.primary}`,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={e=>{e.stopPropagation();setPayModal({debt:d,installSeq:null});}}><Icon name="verify" size={11} color={t.primary} sw={2}/>Verify</button>}

          </div>
        </div>

        {/* Progress bar for installments */}
        {isIns&&!done&&<div style={{marginTop:8}}><ProgressBar paid={d.paidAmount} total={d.amount} t={t}/></div>}
      </div>
    );
  };

  const NAV=[{id:"dashboard",icon:"home",label:"Home"},{id:"add",icon:"add",label:"Add"},{id:"profile",icon:"person",label:"Profile"}];

  return (
    <div style={{fontFamily:"Inter,sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:t.bg,color:t.text,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:7px;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;cursor:pointer;border:none;transition:all 0.15s ease;}
        .btn:active{transform:scale(0.97);}
        .input{width:100%;border-radius:7px;padding:10px 13px;font-family:'Inter',sans-serif;font-size:13px;outline:none;}
        .input:focus{box-shadow:0 0 0 3px rgba(41,195,106,0.1);}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
      `}</style>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <LunasyLogo size={34}/>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:t.text,letterSpacing:"-0.02em"}}>Lunasy</div>
            <div style={{fontSize:11,color:t.text3,marginTop:1}}>{new Date().getHours()<12?"Good morning":new Date().getHours()<17?"Good afternoon":"Good evening"}, {me?.name?.split(" ")[0]} 👋</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowNotifPanel(true)}>
            <div style={{width:36,height:36,borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="bell" size={16} color={t.text2} sw={1.6}/>
            </div>
            {unreadNotif>0&&<div style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:"#ef4444",border:`2px solid ${t.bg}`}}/>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:t.surface2,border:`1px solid ${t.border}`,borderRadius:20,padding:"4px 10px 4px 4px",cursor:"pointer"}} onClick={()=>setSwitchModal(true)}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"white",fontFamily:"Inter,sans-serif"}}>
              {me?.name?.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <Icon name="chevron" size={11} color={t.text3} sw={1.5}/>
          </div>
        </div>
      </div>

      {/* BALANCE CARD */}
      {view==="dashboard"&&(
        <div style={{padding:"0 14px 10px",flexShrink:0}}>
          <div style={{background:"linear-gradient(135deg,#29c36a 0%,#20a855 100%)",borderRadius:20,padding:"18px 18px 16px",position:"relative",overflow:"hidden",boxShadow:"0 4px 20px rgba(41,195,106,0.25)"}}>
            {/* Leaf decoration */}
            <svg style={{position:"absolute",right:-20,top:-20,opacity:0.12}} width="160" height="160" viewBox="0 0 160 160" fill="none">
              <ellipse cx="100" cy="60" rx="60" ry="90" fill="white" transform="rotate(-30 100 60)"/>
              <ellipse cx="60" cy="100" rx="50" ry="75" fill="white" transform="rotate(20 60 100)"/>
            </svg>
            {/* Wallet icon */}
            <div style={{position:"absolute",right:16,top:16,width:46,height:46,borderRadius:12,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="creditcard" size={22} color="white" sw={1.6}/>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>NET BALANCE</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:30,fontWeight:700,color:"white",marginBottom:8,letterSpacing:"-0.02em"}}>
              {netBalance<0?"−":""}{fmt(Math.abs(netBalance))}
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"4px 10px",marginBottom:14}}>
              <Icon name={netBalance<0?"alert":"check"} size={11} color="rgba(255,255,255,0.85)" sw={2}/>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.85)",fontWeight:600}}>{netBalance<0?"You owe more than you're owed":"You're in the green!"}</span>
            </div>
            <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:12,gap:0}}>
              <div style={{flex:1,paddingRight:8,borderRight:"1px solid rgba(255,255,255,0.15)"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>You will receive</div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"#bbf7d0",fontWeight:700}}>{fmt(totalOwed)}</div>
              </div>
              <div style={{flex:1,padding:"0 8px",borderRight:"1px solid rgba(255,255,255,0.15)"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>You owe</div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"white",fontWeight:700}}>{fmt(totalIOwe)}</div>
              </div>
              <div style={{flex:1,paddingLeft:8,cursor:pendVerif>0?"pointer":"default"}} onClick={()=>pendVerif>0&&setFilter("verif")}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>To verify</div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:pendVerif>0?"#fbbf24":"white",fontWeight:700}}>{pendVerif}</div>
              </div>
            </div>
          </div>
        </div>
      )}


        {/* Banners */}

        {/* DEBT LIST / SPLIT LIST */}
        {view==="dashboard"&&(
          <div style={{flex:1,overflowY:"auto",padding:"0 14px 90px"}}>
            {/* Quick Action Buttons */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
              {[
                {id:"debts",icon:"receipt",label:"Records"},
                {id:"splits",icon:"split",label:"Split Bill"},
                {id:"analytics",icon:"star",label:"Analytics"},
                {id:"more",icon:"more",label:"More"},
              ].map(btn=>(
                <button key={btn.id} className="btn" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"10px 4px",borderRadius:12,border:`1.5px solid ${mainTab===btn.id?t.primary:t.border}`,background:mainTab===btn.id?t.primaryBg:t.surface,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onClick={()=>setMainTab(btn.id)}>
                  <div style={{width:32,height:32,borderRadius:8,background:mainTab===btn.id?t.primary:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name={btn.icon} size={16} color={mainTab===btn.id?"white":t.primary} sw={1.8}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,color:mainTab===btn.id?t.primary:t.text2,fontFamily:"Inter,sans-serif"}}>{btn.label}</span>
                </button>
              ))}
            </div>
            {mainTab==="debts"&&(
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <div style={{position:"relative",flex:1}}>
                    <select value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"100%",appearance:"none",background:t.surface,border:`1.5px solid ${filter!=="all"?t.primary:t.border}`,borderRadius:10,padding:"8px 30px 8px 12px",fontSize:12,color:filter!=="all"?t.primary:t.text2,fontFamily:"Inter,sans-serif",fontWeight:500,outline:"none",cursor:"pointer"}}>
                      <option value="all">All Status</option>
                      <option value="owe">Debt</option>
                      <option value="lent">Receivable</option>
                      <option value="paid">Settled</option>
                      <option value="overdue">Overdue</option>
                      <option value="soon">Due Soon</option>
                      <option value="verif">Need Verify</option>
                    </select>
                    <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={12} color={filter!=="all"?t.primary:t.text3} sw={1.5}/></div>
                  </div>
                  <div style={{position:"relative",flex:1}}>
                    <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{width:"100%",appearance:"none",background:t.surface,border:`1.5px solid ${catFilter!=="all"?t.primary:t.border}`,borderRadius:10,padding:"8px 30px 8px 12px",fontSize:12,color:catFilter!=="all"?t.primary:t.text2,fontFamily:"Inter,sans-serif",fontWeight:500,outline:"none",cursor:"pointer"}}>
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={12} color={catFilter!=="all"?t.primary:t.text3} sw={1.5}/></div>
                  </div>
                </div>
                {filteredDebts.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>Tidak ada catatan</div>}
                {filteredDebts.map(d=>renderDebtCard(d))}
              </div>
            )}
            {mainTab==="splits"&&(
              <div>

                {mySplits.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>Belum ada split bill</div>}
                {mySplits.map(s=>{
                  const payer=getAcc(s.payerId);
                  const myM=s.members.find(m=>m.accId===meId);
                  const paidCount=s.members.filter(m=>m.paymentStatus==="verified").length;
                  return(
                    <div key={s.id} style={{padding:"13px 16px",background:t.surface,borderRadius:12,border:`1px solid ${t.border}`,cursor:"pointer",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onClick={()=>setSplitDetail(s)}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:600,color:t.text,marginBottom:2}}>{s.title}</div>
                          <div style={{fontSize:12,color:t.text3}}>{payer?.name} paid first · {s.members.length} people</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:14,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(s.totalAmount||s.total||0)}</div>
                          <div style={{fontSize:11,color:myM?.paymentStatus==="verified"?t.green:t.text3,marginTop:2}}>{myM?.paymentStatus==="verified"?"Settled":`Bagianmu: Rp ${fmt(myM?.share||0)}`}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,height:4,background:t.surface2,borderRadius:2,overflow:"hidden"}}>
                          <div style={{width:`${(paidCount/s.members.length)*100}%`,height:"100%",background:t.primary,borderRadius:2}}/>
                        </div>
                        <div style={{fontSize:11,color:t.text3}}>{paidCount}/{s.members.length}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {mainTab==="analytics"&&(
              <div style={{paddingTop:8}}>
                <div style={{background:t.surface,borderRadius:14,border:`1px solid ${t.border}`,padding:"16px",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:12}}>Ringkasan Bulan Ini</div>
                  {[
                    {label:"Total Hutang",value:totalIOwe,color:t.red},
                    {label:"Total Piutang",value:totalOwed,color:t.green},
                    {label:"Net Balance",value:Math.abs(netBalance),color:netBalance>=0?t.green:t.red},
                  ].map((item,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:i<2?"10px":0,borderBottom:i<2?`1px solid ${t.border}`:"none",marginBottom:i<2?10:0}}>
                      <span style={{fontSize:13,color:t.text2}}>{item.label}</span>
                      <span style={{fontSize:14,fontWeight:700,color:item.color,fontFamily:"JetBrains Mono,monospace"}}>{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"linear-gradient(135deg,#29c36a,#14532d)",borderRadius:14,padding:"16px",textAlign:"center"}}>
                  <Icon name="crown" size={28} color="#fbbf24" sw={1.8}/>
                  <div style={{fontSize:13,fontWeight:700,color:"white",marginTop:8}}>Analytics lengkap tersedia di Premium</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:4,marginBottom:12}}>Lihat tren, kategori, dan insight keuangan</div>
                  <button className="btn" style={{background:"#fbbf24",color:"#78350f",borderRadius:20,padding:"8px 20px",fontSize:12,fontWeight:700}} onClick={()=>showToast("Premium coming soon!")}>Upgrade Now</button>
                </div>
              </div>
            )}
            {mainTab==="more"&&(
              <div style={{paddingTop:8}}>
                {[
                  {icon:"bell",label:"Reminders",sub:"Atur pengingat hutang"},
                  {icon:"people",label:"Connections",sub:"Kelola koneksi teman",action:()=>setView("connections")},
                  {icon:"transfer",label:"Riwayat Transaksi",sub:"Semua transaksi tersettled"},
                  {icon:"settings",label:"Preferences",sub:"Pengaturan tampilan",action:()=>setShowPreferences(true)},
                ].map((item,i,arr)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:t.surface,borderRadius:i===0?"14px 14px 0 0":i===arr.length-1?"0 0 14px 14px":"0",border:`1px solid ${t.border}`,borderTop:i===0?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={item.action||(() => showToast("Coming soon!"))}>
                    <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name={item.icon} size={18} color={t.primary} sw={1.7}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</div>
                      <div style={{fontSize:11,color:t.text3,marginTop:1}}>{item.sub}</div>
                    </div>
                    <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                  </div>
                ))}
              </div>
            )}
            {/* PREMIUM BANNER - inside scroll so it's never hidden */}
            <div style={{marginTop:16,background:"linear-gradient(135deg,#0f4023 0%,#166534 100%)",borderRadius:16,padding:"13px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",boxShadow:"0 4px 12px rgba(20,83,45,0.3)"}} onClick={()=>showToast("Premium coming soon!")}>
              <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="crown" size={20} color="#fbbf24" sw={1.8}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"white"}}>Upgrade to Lunasy Premium</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Unlock insights, custom categories, and more.</div>
              </div>
              <div style={{background:"#fbbf24",borderRadius:20,padding:"7px 13px",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                <span style={{fontSize:11,fontWeight:700,color:"#78350f"}}>Upgrade Now</span>
                <Icon name="chevron" size={10} color="#78350f" sw={2.5}/>
              </div>
            </div>
          </div>
        )}
        {view==="add"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 80px"}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:4}}>Tambah</div>
            <div style={{fontSize:13,color:t.text3,marginBottom:20}}>Pilih jenis catatan</div>
            {[
              {id:"lend",icon:"transfer",label:"Add Receivable",sub:"Someone owes you money",color:t.green,bg:t.greenBg},
              {id:"borrow",icon:"creditcard",label:"Add Debt",sub:"You owe someone money",color:t.red,bg:t.redBg},
              {id:"split",icon:"split",label:"Split Bill",sub:"Split a bill with others",color:t.primary,bg:t.primaryBg},
            ].map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px",background:t.surface,borderRadius:14,border:`1px solid ${t.border}`,marginBottom:10,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}} onClick={()=>{if(item.id==="split"){setCreateSplit(true);}else{setAddForm({...addForm,type:item.id==="lend"?"lend":"borrow"});setAddDebtModal(true);}}}>
                <div style={{width:44,height:44,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={item.icon} size={22} color={item.color} sw={1.8}/></div>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:t.text}}>{item.label}</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div></div>
                <Icon name="chevron" size={18} color={t.text3} sw={1.5}/>
              </div>
            ))}
          </div>
        )}

        {/* CONNECTIONS VIEW */}
        {view==="connections"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 80px"}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:16}}>Koneksi</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[{id:"connected",label:"Connected"},{id:"requests",label:`Permintaan${incoming.length>0?" ("+incoming.length+")":""}`},{id:"discover",label:"Discover"}].map(tab=>(
                <button key={tab.id} className="btn" style={{flex:1,padding:"8px 4px",borderRadius:50,border:`1.5px solid ${accountTab===tab.id?t.primary:t.border}`,background:"transparent",color:accountTab===tab.id?t.primary:t.text2,fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={()=>setAccountTab(tab.id)}>{tab.label}</button>
              ))}
            </div>
            {accountTab==="connected"&&(
              <div>
                {/* Invite Member Button */}
                <div style={{background:t.surface,border:`1.5px dashed ${t.primaryBorder}`,borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowInviteModal(true)}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name="add" size={20} color={t.primary} sw={2.5}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:t.primary}}>Invite Member</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:1}}>Ajak teman via WhatsApp, Link, atau QR</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.primary} sw={1.5}/>
                </div>
                {connIds.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>Tidak ada koneksi</div>}
                {connIds.map(id=>{const a=getAcc(id);return(
                  <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${t.border}`,cursor:"pointer"}} onClick={()=>setProfileAcc(a)}>
                    <Avatar account={a} size={40}/>
                    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:t.text}}>{a?.name}</div><div style={{fontSize:12,color:t.text3}}>@{a?.username}</div></div>
                    <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                  </div>
                );})}
              </div>
            )}
            {accountTab==="requests"&&(
              <div>
                {incoming.map(c=>{const a=getAcc(c.fromId);return(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><Avatar account={a} size={38}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div><div style={{fontSize:11,color:t.text3}}>@{a?.username}</div></div><div style={{display:"flex",gap:5}}><button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,display:"flex",alignItems:"center",gap:3}} onClick={()=>acceptReq(c.id)}><Icon name="check" size={11} color={t.green} sw={2.5}/>"Terima"</button><button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`}} onClick={()=>rejectReq(c.id)}>"Tolak"</button></div></div>);})}
                {incoming.length===0&&outgoing.length===0&&<div style={{textAlign:"center",color:t.text3,padding:"16px 0",fontSize:13}}>Tidak ada permintaan</div>}
              </div>
            )}
            {accountTab==="discover"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,background:t.surface2,borderRadius:10,padding:"8px 12px",marginBottom:12}}>
                  <Icon name="search" size={14} color={t.text3} sw={1.8}/>
                  <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Cari..." style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,color:t.text,fontFamily:"Inter,sans-serif"}}/>
                </div>
                {discover.filter(a=>!searchQ||a.name.toLowerCase().includes(searchQ.toLowerCase())||a.username.toLowerCase().includes(searchQ.toLowerCase())).map(a=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${t.border}`}}>
                    <Avatar account={a} size={38}/>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a.name}</div><div style={{fontSize:11,color:t.text3}}>@{a.username}</div></div>
                    {outgoing.some(c=>c.toId===a.id)?<span style={{fontSize:11,color:t.text3,padding:"4px 8px",borderRadius:6,background:t.surface2}}>Terkirim</span>:<button className="btn" style={{padding:"6px 14px",fontSize:12,background:"transparent",color:t.primary,border:`1.5px solid ${t.primary}`,fontFamily:"Inter,sans-serif",fontWeight:600,borderRadius:20}} onClick={()=>sendReq(a.id)}>"Hubungkan"</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE VIEW */}
        {view==="profile"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 80px"}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:16}}>Profil</div>
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:18,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                <Avatar account={me} size={64}/>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>{me?.name}</div><div style={{fontSize:13,color:t.primary,marginTop:2}}>@{me?.username}</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>{me?.bio}</div></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[["Connections",connIds.length],["Active",myDebts.filter(d=>!isDone(d)).length],["Settled",myDebts.filter(d=>isDone(d)).length]].map(([l,v])=>(
                  <div key={l} style={{flex:1,background:t.surface2,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{l}</div>
                    <div style={{fontSize:18,fontWeight:700,color:t.text}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {me?.bankAccounts?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Rekening Bank</div>
                <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  {me.bankAccounts.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<me.bankAccounts.length-1?`1px solid ${t.border}`:"none"}}>
                      <Icon name="creditcard" size={18} color={t.text3} sw={1.5}/>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{b.bank}</div><div style={{fontSize:12,color:t.text3,fontFamily:"JetBrains Mono,monospace"}}>{b.number}</div><div style={{fontSize:11,color:t.text3}}>{b.name}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              {[{icon:"edit",label:"Edit Profile",action:()=>{setEditForm({name:me.name,username:me.username,phone:me.phone,bio:me.bio,bankAccounts:JSON.parse(JSON.stringify(me.bankAccounts||[]))});setEditProfile(true);}},{icon:"bell",label:"Notifications",action:()=>setShowNotifSettings(true)},{icon:"lock",label:"Security",action:()=>{}},{icon:"settings",label:"Preferences",action:()=>setShowPreferences(true)}].map((item,i,arr)=>(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={item.icon} size={16} color={t.text2} sw={1.6}/></div>
                  <span style={{flex:1,fontSize:14,fontWeight:500,color:t.text}}>{item.label}</span>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              ))}
            </div>
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              {[{icon:"info",label:"Info",action:()=>{}},{icon:"heart",label:"Support us",action:()=>{}},{icon:"star",label:"Rate our app",action:()=>{}},{icon:"share",label:"Tell a friend",action:()=>{}}].map((item,i,arr)=>(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={item.icon} size={16} color={t.text2} sw={1.6}/></div>
                  <span style={{flex:1,fontSize:14,fontWeight:500,color:t.text}}>{item.label}</span>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              ))}
            </div>
            <button className="btn" style={{width:"100%",marginTop:16,padding:14,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`,borderRadius:12,fontSize:14,fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={()=>setSwitchModal(true)}>Ganti Akun</button>
          </div>
        )}

        {/* NAV BAR */}
        <div style={{display:"flex",alignItems:"center",background:t.surface,backdropFilter:"blur(16px)",borderTop:`1px solid ${t.border}`,boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",paddingBottom:"env(safe-area-inset-bottom)",position:"fixed",bottom:0,left:0,right:0,zIndex:50,maxWidth:"100%",height:64}}>
          {/* Home */}
          <button className="btn" style={{flex:1,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"transparent",border:"none",color:view==="dashboard"?t.primary:t.text3,fontFamily:"Inter,sans-serif"}} onClick={()=>setView("dashboard")}>
            <Icon name="home" size={22} color={view==="dashboard"?t.primary:t.text3} sw={view==="dashboard"?2:1.5}/>
            <span style={{fontSize:10,fontWeight:view==="dashboard"?700:400}}>Home</span>
            {view==="dashboard"&&<div style={{width:4,height:4,borderRadius:"50%",background:t.primary,position:"absolute",bottom:10}}/>}
          </button>
          {/* FAB Add */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button className="btn" style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#15803d)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(41,195,106,0.4)",marginBottom:20}} onClick={()=>setView(view==="add"?"dashboard":"add")}>
              {view==="add"
                ? <Icon name="x" size={20} color="white" sw={2.5}/>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </button>
          </div>
          {/* Profile */}
          <button className="btn" style={{flex:1,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"transparent",border:"none",color:view==="profile"?t.primary:t.text3,fontFamily:"Inter,sans-serif",position:"relative"}} onClick={()=>setView("profile")}>
            <Icon name="person" size={22} color={view==="profile"?t.primary:t.text3} sw={view==="profile"?2:1.5}/>
            <span style={{fontSize:10,fontWeight:view==="profile"?700:400}}>Profile</span>
            {unreadNotif>0&&<div style={{position:"absolute",top:12,right:"calc(50% - 14px)",width:7,height:7,borderRadius:"50%",background:t.red,border:`2px solid ${t.bg}`}}/>}
          </button>
        </div>

      {/* MODALS */}
      {payModal&&<PaymentModal payModal={payModal} accounts={accounts} meId={meId} t={t} payNote={payNote} setPayNote={setPayNote} payImg={payImg} setPayImg={setPayImg} payDNote={payDNote} setPayDNote={setPayDNote} showPayD={showPayD} setShowPayD={setShowPayD} payFullImg={payFullImg} setPayFullImg={setPayFullImg} payFileRef={payFileRef} handleSubmitProof={handleSubmitProof} handleVerify={handleVerify} handleDispute={handleDispute} showToast={showToast} setPayModal={setPayModal}/>}
      {createSplit&&<CreateSplitModal createSplit={createSplit} connIds={connIds} accounts={accounts} meId={meId} t={t} handleAddSplit={handleAddSplit} setCreateSplit={setCreateSplit} showToast={showToast}/>}

      {/* ADD DEBT MODAL */}
      {addDebtModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setAddDebtModal(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:addForm.type==="lend"?t.greenBg:t.redBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name={addForm.type==="lend"?"transfer":"creditcard"} size={22} color={addForm.type==="lend"?t.green:t.red} sw={1.8}/>
                  </div>
                  <div>
                    <div style={{fontSize:20,fontWeight:700,color:addForm.type==="lend"?t.green:t.red}}>{addForm.type==="lend"?"Add Receivable":"Add Debt"}</div>
                    <div style={{fontSize:13,color:t.text3,marginTop:2}}>{addForm.type==="lend"?"Someone owes you money":"You owe someone money"}</div>
                  </div>
                </div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setAddDebtModal(false)}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{addForm.type==="lend"?"Siapa yang berhutang":"Kamu berhutang kepada"}</div>
                <div style={{background:t.surface2,borderRadius:10,padding:"12px 14px",cursor:"pointer",border:`1px solid ${t.border}`}} onClick={()=>{}}>
                  {addForm.toAccId?<div style={{display:"flex",alignItems:"center",gap:10}}><Avatar account={getAcc(addForm.toAccId)} size={28}/><span style={{fontSize:14,color:t.text}}>{getAcc(addForm.toAccId)?.name}</span></div>:<span style={{fontSize:14,color:t.text3}}>Pilih koneksi...</span>}
                </div>
                {connIds.length>0&&<div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
                  {connIds.map(id=>{const a=getAcc(id);return(<button key={id} className="btn" style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${addForm.toAccId===id?t.primary:t.border}`,background:addForm.toAccId===id?t.primaryBg:"transparent",color:addForm.toAccId===id?t.primary:t.text2,fontSize:12,fontFamily:"Inter,sans-serif"}} onClick={()=>setAddForm({...addForm,toAccId:id})}>{a?.name}</button>);})}
                  <button className="btn" style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${t.primaryBorder}`,background:t.primaryBg,color:t.primary,fontSize:12,fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:4}} onClick={()=>setShowAddFriend(true)}><Icon name="add" size={12} color={t.primary} sw={2.5}/>Add Friend</button>
                </div>}
              {connIds.length===0&&<button className="btn" style={{marginTop:8,padding:"8px 14px",borderRadius:8,border:`1px solid ${t.primaryBorder}`,background:t.primaryBg,color:t.primary,fontSize:12,fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:4}} onClick={()=>setShowAddFriend(true)}><Icon name="add" size={12} color={t.primary} sw={2.5}/>Add Friend</button>}
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Jumlah</div>
                <div style={{display:"flex",alignItems:"center",gap:8,background:t.surface2,borderRadius:10,padding:"10px 14px",border:`1px solid ${t.border}`}}>
                  <span style={{fontSize:14,fontWeight:600,color:t.text3}}>Rp</span>
                  <input type="number" value={addForm.amount} onChange={e=>setAddForm({...addForm,amount:e.target.value})} placeholder="0" style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:18,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}}/>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Keterangan</div>
                <input value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})} placeholder="What for?" style={{width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Kategori</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {CATEGORIES.map(c=>(<button key={c.id} className="btn" style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${addForm.category===c.id?t.primary:t.border}`,background:addForm.category===c.id?t.primaryBg:"transparent",color:addForm.category===c.id?t.primary:t.text2,fontSize:12,fontFamily:"Inter,sans-serif"}} onClick={()=>setAddForm({...addForm,category:c.id})}>{c.label}</button>))}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Jatuh Tempo</div>
                <input type="date" value={addForm.dueDate} onChange={e=>setAddForm({...addForm,dueDate:e.target.value})} style={{width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              {/* Optional proof photo */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Proof Photo <span style={{fontWeight:400,color:t.text3}}>(Optional)</span></div>
                {addProofImg?(
                  <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:`1px solid ${t.border}`}}>
                    <img src={addProofImg} alt="proof" style={{width:"100%",maxHeight:140,objectFit:"cover",display:"block"}}/>
                    <button className="btn" style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",padding:0}} onClick={()=>setAddProofImg(null)}><Icon name="x" size={12} color="white" sw={2}/></button>
                  </div>
                ):(
                  <div style={{border:`2px dashed ${t.border}`,borderRadius:10,padding:"16px",textAlign:"center",cursor:"pointer",background:t.surface2}} onClick={()=>addProofRef.current?.click()}>
                    <Icon name="upload" size={20} color={t.text3} sw={1.5}/>
                    <div style={{fontSize:12,color:t.text3,marginTop:6}}>Tap to add photo</div>
                  </div>
                )}
                <input type="file" accept="image/*" ref={addProofRef} style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setAddProofImg(ev.target.result);r.readAsDataURL(f);}}/>
              </div>
              <button className="btn" style={{width:"100%",padding:14,background:addForm.type==="lend"?t.green:t.red,color:"white",fontSize:15,fontWeight:700,borderRadius:12}} onClick={handleAddDebt}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT DETAIL */}
      {splitDetail&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setSplitDetail(null)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>{splitDetail.title}</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>{getAcc(splitDetail.payerId)?.name} paid first</div></div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setSplitDetail(null)}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              <div style={{background:t.primaryBg,borderRadius:12,padding:"10px 10px",marginBottom:16,border:`1px solid ${t.primaryBorder}`}}>
                <div style={{fontSize:12,color:t.primary,marginBottom:4}}>Total Bill</div>
                <div style={{fontSize:22,fontWeight:700,color:t.primary,fontFamily:"JetBrains Mono,monospace"}}>{fmt(splitDetail.totalAmount)}</div>
              </div>
              {splitDetail.members.map(m=>{
                const a=getAcc(m.accId);
                const isMe=m.accId===meId;
                const isPayer=m.accId===splitDetail.payerId;
                const psi=payStatusInfo(m.paymentStatus,t);
                return(
                  <div key={m.accId} style={{marginBottom:12,background:t.surface2,borderRadius:12,padding:"12px 14px",border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><Avatar account={a} size={32}/><div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}{isMe?" (You)":""}{isPayer?" 👑":""}</div></div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(m.share)}</div>{psi&&<div style={{fontSize:11,color:psi.color,marginTop:2}}>{psi.label}</div>}</div>
                    </div>
                    {isMe&&!isPayer&&(
                      <MemberProofPanel gId={splitDetail.id} accId={meId} m={m} isMe={true} isMePayer={false} t={t} proofNote={proofNote} setProofNote={setProofNote} proofImg={proofImg} setProofImg={setProofImg} showPayDisputePanel={showPayDisputePanel} setShowPayDisputePanel={setShowPayDisputePanel} disputeText={disputeText} setDisputeText={setDisputeText} onSubmitProof={(pd)=>handleSubmitSplitProof(splitDetail.id,meId,pd)} onVerify={null} onDispute={null} onClose={()=>setSplitDetail(null)}/>
                    )}
                    {!isMe&&splitDetail.payerId===meId&&m.paymentStatus==="paying"&&(
                      <MemberProofPanel gId={splitDetail.id} accId={m.accId} m={m} isMe={false} isMePayer={true} t={t} proofNote={proofNote} setProofNote={setProofNote} proofImg={proofImg} setProofImg={setProofImg} showPayDisputePanel={showPayDisputePanel} setShowPayDisputePanel={setShowPayDisputePanel} disputeText={disputeText} setDisputeText={setDisputeText} onSubmitProof={null} onVerify={()=>handleVerifySplitMember(splitDetail.id,m.accId)} onDispute={(dn)=>handleDisputeSplitMember(splitDetail.id,m.accId,dn)} onClose={()=>setSplitDetail(null)}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REMINDER MODAL */}
      {reminderDebt&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setReminderDebt(null)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:16}}>Atur Reminder</div>
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",marginBottom:8}}>Ingatkan saya</div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {[1,3,7].map(d=>(<button key={d} className="btn" style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${(addForm.reminders||[]).includes(d)?t.primary:t.border}`,background:(addForm.reminders||[]).includes(d)?t.primaryBg:"transparent",color:(addForm.reminders||[]).includes(d)?t.primary:t.text2,fontSize:12,fontFamily:"Inter,sans-serif"}} onClick={()=>toggleAddReminder(d)}>{d} hari sebelum</button>))}
              </div>
              <button className="btn" style={{width:"100%",padding:12,background:t.primary,color:"white",borderRadius:10,fontSize:14,fontWeight:600}} onClick={()=>handleSaveReminder(reminderDebt.id,addForm.reminders,addForm.dueDate)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* SWITCH ACCOUNT MODAL */}
      {switchModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setSwitchModal(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:16}}>Ganti Akun</div>
              {accounts.map(a=>(<div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${t.border}`,cursor:"pointer"}} onClick={()=>handleSwitch(a.id)}><Avatar account={a} size={40}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div><div style={{fontSize:12,color:t.text3}}>@{a.username}</div></div>{a.id===meId&&<span style={{fontSize:11,color:t.primary,fontWeight:700}}>Aktif</span>}</div>))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE */}
      {editProfile&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setEditProfile(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:20}}>Edit Profil</div>
              {/* Basic Info */}
              {[{key:"name",label:"Full Name",ph:"Your full name"},{key:"username",label:"Username",ph:"@username"},{key:"phone",label:"Phone Number",ph:"08xx"},{key:"bio",label:"Bio",ph:"Write something..."}].map(f=>(<div key={f.key} style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",marginBottom:6}}>{f.label}</div><input value={editForm[f.key]||""} onChange={e=>setEditForm({...editForm,[f.key]:e.target.value})} placeholder={f.ph} style={{width:"100%",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/></div>))}

              {/* Bank Accounts */}
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Bank Accounts</div>
                  <button className="btn" style={{fontSize:12,color:t.primary,background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,padding:"4px 10px",borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={()=>setEditForm({...editForm,bankAccounts:[...(editForm.bankAccounts||[]),{bank:"",number:"",name:editForm.name||""}]})}>+ Add</button>
                </div>
                {(editForm.bankAccounts||[]).length===0&&(
                  <div style={{textAlign:"center",padding:"16px",background:t.surface2,borderRadius:10,border:`1px dashed ${t.border}`}}>
                    <div style={{fontSize:13,color:t.text3}}>No bank accounts yet</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:4}}>Add your bank or e-wallet account</div>
                  </div>
                )}
                {(editForm.bankAccounts||[]).map((b,i)=>(
                  <div key={i} style={{background:t.surface2,borderRadius:12,padding:"12px 14px",marginBottom:8,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontSize:12,fontWeight:700,color:t.text}}>Account {i+1}</div>
                      <button className="btn" style={{padding:"2px 8px",fontSize:11,color:t.red,background:t.redBg,border:`1px solid ${t.redBorder}`,borderRadius:6}} onClick={()=>setEditForm({...editForm,bankAccounts:editForm.bankAccounts.filter((_,j)=>j!==i)})}>Remove</button>
                    </div>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",marginBottom:4}}>Bank / E-Wallet</div>
                      <select value={b.bank} onChange={e=>{const arr=[...editForm.bankAccounts];arr[i]={...arr[i],bank:e.target.value};setEditForm({...editForm,bankAccounts:arr});}} style={{width:"100%",appearance:"none",background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:b.bank?t.text:t.text3,fontFamily:"Inter,sans-serif",outline:"none"}}>
                        <option value="">Select bank...</option>
                        {["BCA","BRI","BNI","Mandiri","CIMB Niaga","Danamon","Permata","BTN","BSI","GoPay","OVO","DANA","ShopeePay","LinkAja","Jenius","Jago","SeaBank","Other"].map(bk=><option key={bk} value={bk}>{bk}</option>)}
                      </select>
                    </div>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",marginBottom:4}}>Account Number</div>
                      <input type="tel" value={b.number} onChange={e=>{const arr=[...editForm.bankAccounts];arr[i]={...arr[i],number:e.target.value};setEditForm({...editForm,bankAccounts:arr});}} placeholder="e.g. 1234567890" style={{width:"100%",background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:t.text,fontFamily:"JetBrains Mono,monospace",outline:"none",boxSizing:"border-box"}}/>
                    </div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",marginBottom:4}}>Account Holder Name</div>
                      <input value={b.name} onChange={e=>{const arr=[...editForm.bankAccounts];arr[i]={...arr[i],name:e.target.value};setEditForm({...editForm,bankAccounts:arr});}} placeholder="Account holder name" style={{width:"100%",background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn" style={{width:"100%",padding:14,background:t.primary,color:"white",fontSize:15,fontWeight:700,borderRadius:50}} onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIF PANEL */}
      {showNotifPanel&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowNotifPanel(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Notifikasi</div>
                {notifList.length>0&&<button className="btn" style={{fontSize:12,color:t.text3,background:"transparent",border:"none",padding:"4px 8px"}} onClick={()=>setNotifList([])}>Hapus semua</button>}
              </div>
              {notifList.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>Belum ada notifikasi</div>}
              {notifList.map(n=>(<div key={n.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid ${t.border}`,opacity:n.read?0.6:1}} onClick={()=>setNotifList(notifList.map(x=>x.id===n.id?{...x,read:true}:x))}>
                <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={n.icon} size={16} color={t.primary} sw={1.8}/></div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:2}}>{n.title}</div><div style={{fontSize:12,color:t.text3}}>{n.body}</div><div style={{fontSize:11,color:t.text3,marginTop:4}}>{n.time}</div></div>
                {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:t.primary,marginTop:4,flexShrink:0}}/>}
              </div>))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION SETTINGS */}
      {showNotifSettings&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowNotifSettings(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="bell" size={20} color={t.primary} sw={1.8}/></div>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>Notifikasi</div><div style={{fontSize:12,color:t.text3,marginTop:1}}>Atur pengingat dan alert</div></div>
              </div>
              {[{key:"dueSoon",label:"Due soon",sub:"3 hari sebelum"},{key:"dueToday",label:"Due today",sub:"Di hari H"},{key:"overdue",label:"Overdue debt",sub:"After due date"},{key:"paymentReceived",label:"Payment proof received",sub:"When someone uploads proof"},{key:"paymentConfirmed",label:"Payment confirmed",sub:"When debt is settled"},{key:"sound",label:"Notification sound",sub:"Play sound for notifications"},{key:"vibrate",label:"Vibrate",sub:"Vibrate for notifications"}].map((item,i,arr)=>(
                <div key={item.key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>{item.label}</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div></div>
                  <Toggle value={notifSettings[item.key]} onChange={v=>setNotifSettings({...notifSettings,[item.key]:v})} t={t}/>
                </div>
              ))}
              <button className="btn" style={{width:"100%",marginTop:16,background:t.primary,color:"white",fontSize:15,fontWeight:700,padding:14,borderRadius:12}} onClick={()=>{setShowNotifSettings(false);showToast("Notification settings saved");}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* PREFERENCES */}
      {showPreferences&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowPreferences(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="settings" size={20} color={t.primary} sw={1.8}/></div>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>Preferensi</div><div style={{fontSize:12,color:t.text3,marginTop:1}}>Atur tampilan dan perilaku app</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${t.border}`}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Tema</div></div>
                <div style={{display:"flex",gap:6}}>
                  {[["light","☀️"],["dark","🌙"],["system","📱"]].map(([v,l])=>(<button key={v} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${prefSettings.theme===v?t.primary:t.border}`,background:prefSettings.theme===v?t.primaryBg:"transparent",color:prefSettings.theme===v?t.primary:t.text3,fontSize:11,fontFamily:"Inter,sans-serif",cursor:"pointer"}} onClick={()=>{setPrefSettings({...prefSettings,theme:v});if(v==="light")setDark(false);else if(v==="dark")setDark(true);}}>{l}</button>))}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${t.border}`}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Sembunyikan Saldo</div></div>
                <Toggle value={!prefSettings.showBalance} onChange={v=>setPrefSettings({...prefSettings,showBalance:!v})} t={t}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0"}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Auto-verifikasi 24 jam</div></div>
                <Toggle value={prefSettings.autoVerify} onChange={v=>setPrefSettings({...prefSettings,autoVerify:v})} t={t}/>
              </div>
              <button className="btn" style={{width:"100%",marginTop:16,background:t.primary,color:"white",fontSize:15,fontWeight:700,padding:14,borderRadius:12}} onClick={()=>{setShowPreferences(false);showToast("Preferences saved");}}>Save</button>
            </div>
          </div>
        </div>
      )}


      {/* INSTALLMENT MODAL */}
      {installModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setInstallModal(null)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:t.text}}>{installModal.note}</div>
                  <div style={{fontSize:12,color:t.text3,marginTop:2}}>Cicilan · {getAcc(installModal.fromAccId===meId?installModal.toAccId:installModal.fromAccId)?.name}</div>
                </div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setInstallModal(null)}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              <div style={{background:t.primaryBg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1px solid ${t.primaryBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:t.text3}}>Total</span>
                  <span style={{fontSize:14,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(installModal.amount)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:t.text3}}>Per cicilan</span>
                  <span style={{fontSize:13,fontWeight:600,color:t.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(installModal.installments?.amount)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:t.text3}}>Progress</span>
                  <span style={{fontSize:13,fontWeight:600,color:t.primary}}>{installModal.installments?.paid}/{installModal.installments?.total} installment</span>
                </div>
                <ProgressBar paid={installModal.paidAmount} total={installModal.amount} t={t}/>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Jadwal Cicilan</div>
              {(installModal.installments?.schedule||[]).map((s,i)=>{
                const psi=payStatusInfo(s.status,t);
                const isMe=installModal.fromAccId===meId;
                const isLender=installModal.toAccId===meId;
                return(
                  <div key={s.seq} style={{marginBottom:10,background:t.surface2,borderRadius:12,padding:"12px 14px",border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>Cicilan {s.seq}</div>
                      <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:t.text}}>{fmt(installModal.installments?.amount)}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontSize:11,color:t.text3}}>{s.dueDate}</div>
                      {psi?<StatusBadge si={psi} t={t}/>:<span style={{fontSize:11,color:t.text3,background:t.surface,border:`1px solid ${t.border}`,padding:"2px 8px",borderRadius:4}}>Belum Bayar</span>}
                    </div>
                    {isMe&&s.status==="unpaid"&&<button className="btn" style={{width:"100%",marginTop:8,padding:"8px 0",background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,fontSize:12,fontWeight:600}} onClick={()=>{setPayModal({debt:installModal,installSeq:s.seq});setInstallModal(null);}}>Bayar Cicilan Ini</button>}
                    {isLender&&s.status==="paying"&&<button className="btn" style={{width:"100%",marginTop:8,padding:"8px 0",background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,fontSize:12,fontWeight:600}} onClick={()=>{setPayModal({debt:installModal,installSeq:s.seq});setInstallModal(null);}}>Verifikasi Cicilan Ini</button>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* ADD FRIEND MODAL */}
      {/* INVITE MEMBER MODAL */}
      {showInviteModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={()=>setShowInviteModal(false)}>
          <div style={{background:t.surface,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,borderRadius:2,background:t.border,margin:"14px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Invite Member</div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowInviteModal(false)}>
                  <Icon name="x" size={14} color={t.text2} sw={2}/>
                </button>
              </div>
              {/* Current user card */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:t.surface2,borderRadius:14,marginBottom:20,border:`1px solid ${t.border}`}}>
                <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#29c36a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"white",fontFamily:"Inter,sans-serif",flexShrink:0}}>
                  {me?.name?.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:t.text}}>{me?.name}</div>
                  <div style={{fontSize:12,color:t.text3}}>@{me?.username}</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:"white",background:t.primary,borderRadius:20,padding:"3px 10px"}}>YOU</span>
              </div>
              {/* Invite options */}
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
                {[
                  {icon:"whatsapp",label:"Invite via WhatsApp",sub:"Kirim pesan ke kontak WA",color:"#25D366",bg:"#f0fdf4",action:()=>{window.open(`https://wa.me/?text=Hey! Aku lagi pakai Lunasy buat catat hutang bareng. Join yuk! 🎉 https://lunasy.vercel.app`);setShowInviteModal(false);}},
                  {icon:"link2",label:"Invite via Link",sub:"Salin link undangan",color:t.primary,bg:t.primaryBg,action:()=>{navigator.clipboard?.writeText("https://lunasy.vercel.app/invite/"+me?.username);showToast("Link disalin! ✓");setShowInviteModal(false);}},
                  {icon:"qr2",label:"Invite via QR Code",sub:"Scan QR untuk bergabung",color:"#7c3aed",bg:"#f5f3ff",action:()=>{showToast("QR Code coming soon!");}}
                ].map((item,i,arr)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer",background:"transparent"}} onClick={item.action}>
                    <div style={{width:42,height:42,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {item.icon==="whatsapp"&&<svg width="22" height="22" viewBox="0 0 24 24" fill={item.color}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
                      {item.icon==="link2"&&<Icon name="link" size={20} color={item.color} sw={1.8}/>}
                      {item.icon==="qr2"&&<Icon name="scan" size={20} color={item.color} sw={1.8}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</div>
                      <div style={{fontSize:11,color:t.text3,marginTop:1}}>{item.sub}</div>
                    </div>
                    <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                  </div>
                ))}
              </div>
              {/* Member count */}
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:12}}>{connIds.length} member{connIds.length!==1?"s":""}</div>
              {/* Member list */}
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden"}}>
                {/* Add members row */}
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:`1px solid ${t.border}`,cursor:"pointer"}} onClick={()=>{setShowInviteModal(false);setAccountTab("discover");setView("connections");}}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.surface2,border:`1.5px dashed ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="add" size={18} color={t.text3} sw={2}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:500,color:t.text2}}>Add members</span>
                </div>
                {/* Connected members */}
                {connIds.map((id,i,arr)=>{const a=getAcc(id);return(
                  <div key={id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <Avatar account={a} size={40}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div>
                      <div style={{fontSize:11,color:t.text3}}>@{a?.username}</div>
                    </div>
                  </div>
                );})}
              </div>
              {/* Done button */}
              <button className="btn" style={{width:"100%",marginTop:20,padding:16,background:"linear-gradient(135deg,#29c36a,#15803d)",color:"white",fontSize:15,fontWeight:700,borderRadius:14,fontFamily:"Inter,sans-serif",boxShadow:"0 4px 12px rgba(41,195,106,0.3)"}} onClick={()=>setShowInviteModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFriend&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={()=>setShowAddFriend(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Add Friend</div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAddFriend(false)}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>

              {/* Current user */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:t.surface2,borderRadius:12,marginBottom:16,border:`1px solid ${t.border}`}}>
                <Avatar account={me} size={40}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:t.text}}>{me?.name}</div>
                  <div style={{fontSize:12,color:t.text3}}>@{me?.username}</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:t.primary,background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:6,padding:"2px 8px"}}>YOU</span>
              </div>

              {/* Invite options */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Invite Friends</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
                {[
                  {icon:"whatsapp",label:"Invite via WhatsApp",color:"#25D366",action:()=>window.open(`https://wa.me/?text=Hey! Join me on Lunasy — the best P2P debt tracker app. Track and verify payments together! 🎉`)},
                  {icon:"link",label:"Invite via Link",color:t.primary,action:()=>{navigator.clipboard?.writeText("https://lunasy.vercel.app");showToast("Link copied!");setShowAddFriend(false);}},
                  {icon:"qr",label:"Invite via QR Code",color:t.text2,action:()=>{showToast("QR Code coming soon!");}}
                ].map((item,i,arr)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={item.action}>
                    <div style={{width:36,height:36,borderRadius:10,background:item.color+"20",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name={item.icon==="whatsapp"?"share":item.icon==="link"?"link":"qr"} size={18} color={item.color} sw={1.8}/>
                    </div>
                    <span style={{flex:1,fontSize:14,fontWeight:500,color:t.text}}>{item.label}</span>
                    <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                  </div>
                ))}
              </div>

              {/* Connected friends */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{connIds.length} Connected Friends</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
                {connIds.length===0&&<div style={{padding:"16px",textAlign:"center",color:t.text3,fontSize:13}}>No connections yet</div>}
                {connIds.map((id,i)=>{const a=getAcc(id);return(
                  <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<connIds.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={()=>{setAddForm({...addForm,toAccId:id});setShowAddFriend(false);}}>
                    <Avatar account={a} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div>
                      <div style={{fontSize:11,color:t.text3}}>@{a?.username}</div>
                    </div>
                    {addForm.toAccId===id
                      ? <span style={{fontSize:11,fontWeight:700,color:t.primary}}>Selected ✓</span>
                      : <button className="btn" style={{padding:"5px 12px",borderRadius:8,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,fontSize:12,fontFamily:"Inter,sans-serif",fontWeight:600}}>Select</button>
                    }
                  </div>
                );})}
              </div>

              {/* Discover new friends */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Discover</div>
              <div style={{display:"flex",alignItems:"center",gap:8,background:t.surface2,borderRadius:10,padding:"8px 12px",marginBottom:10,border:`1px solid ${t.border}`}}>
                <Icon name="search" size={14} color={t.text3} sw={1.8}/>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name or username..." style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,color:t.text,fontFamily:"Inter,sans-serif"}}/>
              </div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden"}}>
                {discover.filter(a=>!searchQ||a.name.toLowerCase().includes(searchQ.toLowerCase())||a.username.toLowerCase().includes(searchQ.toLowerCase())).slice(0,5).map((a,i,arr)=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <Avatar account={a} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>{a.name}</div>
                      <div style={{fontSize:11,color:t.text3}}>@{a.username}</div>
                    </div>
                    {outgoing.some(c=>c.toId===a.id)
                      ? <span style={{fontSize:11,color:t.text3,padding:"4px 8px",borderRadius:6,background:t.surface2}}>Sent</span>
                      : <button className="btn" style={{padding:"5px 12px",borderRadius:8,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,fontSize:12,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={()=>sendReq(a.id)}>Connect</button>
                    }
                  </div>
                ))}
                {discover.length===0&&<div style={{padding:"16px",textAlign:"center",color:t.text3,fontSize:13}}>No users to discover</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"0 20px"}} onClick={()=>setConfirmDialog(null)}>
          <div style={{background:t.surface,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:8}}>{confirmDialog.title}</div>
            <div style={{fontSize:13,color:t.text3,marginBottom:20,lineHeight:1.5}}>{confirmDialog.msg}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" style={{flex:1,padding:12,borderRadius:10,border:`1px solid ${t.border}`,background:"transparent",color:t.text2,fontSize:14,fontFamily:"Inter,sans-serif"}} onClick={()=>setConfirmDialog(null)}>"Batal"</button>
              <button className="btn" style={{flex:1,padding:12,borderRadius:10,background:t.red,color:"white",fontSize:14,fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={()=>{confirmDialog.onConfirm();setConfirmDialog(null);}}>"Ya, Lanjutkan"</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?t.red:"#1f2937",color:"white",padding:"10px 18px",borderRadius:20,fontSize:13,fontWeight:500,zIndex:300,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>
          {toast.msg}
        </div>
      )}

      {/* ONBOARDING */}
      {showOnboarding&&(
        <div style={{position:"fixed",inset:0,zIndex:400,overflow:"hidden"}}>

          {/* ── SLIDE 1: Two-Party Verification (white bg) ── */}
          {onboardStep===0&&(
            <div style={{height:"100%",background:"#ffffff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Top bar */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"52px 24px 0",flexShrink:0}}>
                <LunasyLogoFull height={28}/>
                <button className="btn" style={{background:"transparent",border:"none",color:"#9ca3af",fontSize:14,fontFamily:"Inter,sans-serif",fontWeight:500}} onClick={()=>setShowOnboarding(false)}>Skip</button>
              </div>
              {/* Title */}
              <div style={{padding:"20px 28px 0",flexShrink:0}}>
                <div style={{fontSize:34,fontWeight:800,color:"#111827",lineHeight:1.15,marginBottom:10,fontFamily:"Inter,sans-serif"}}>Two-Party<br/>Verification</div>
                <div style={{fontSize:14,color:"#6b7280",lineHeight:1.55}}>Every payment needs confirmation from both parties.</div>
              </div>
              {/* Illustration */}
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",position:"relative",overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:16}}>
                  <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#d1fae5,#a7f3d0)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 6px 20px rgba(0,0,0,0.1)",zIndex:2}}>
                    <svg width="46" height="46" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="21" r="10" fill="#f97316"/>
                      <rect x="14" y="36" width="32" height="20" rx="10" fill="#15803d"/>
                    </svg>
                  </div>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 4px 16px rgba(41,195,106,0.4)",zIndex:3,margin:"0 -6px"}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#fce7f3,#fbcfe8)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 6px 20px rgba(0,0,0,0.1)",zIndex:2}}>
                    <svg width="46" height="46" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="21" r="10" fill="#f9a8d4"/>
                      <rect x="14" y="36" width="32" height="20" rx="10" fill="#d1d5db"/>
                    </svg>
                  </div>
                </div>
                <div style={{background:"white",borderRadius:14,padding:"14px 18px",boxShadow:"0 6px 24px rgba(0,0,0,0.09)",border:"1px solid #f0f0f0",width:"100%",maxWidth:260}}>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:3,fontFamily:"Inter,sans-serif"}}>Payment Request</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:8,fontFamily:"JetBrains Mono,monospace"}}>Rp200.000</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fff7ed",borderRadius:20,padding:"4px 10px"}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{fontSize:11,color:"#f97316",fontWeight:600,fontFamily:"Inter,sans-serif"}}>Awaiting confirmation</span>
                  </div>
                </div>
              </div>
              {/* Feature badges */}
              <div style={{display:"flex",justifyContent:"center",gap:20,padding:"10px 0 8px",flexShrink:0}}>
                {[{icon:"lock",label:"Secure"},{icon:"people",label:"Transparent"},{icon:"verify",label:"Trusted"}].map(f=>(
                  <div key={f.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{width:34,height:34,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name={f.icon} size={15} color="#29c36a" sw={1.8}/>
                    </div>
                    <span style={{fontSize:10,color:"#6b7280",fontWeight:500,fontFamily:"Inter,sans-serif"}}>{f.label}</span>
                  </div>
                ))}
              </div>
              {/* Bottom */}
              <div style={{padding:"10px 24px 44px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
                  {[0,1,2].map(i=>(<div key={i} style={{width:i===0?28:8,height:8,borderRadius:4,background:i===0?"#29c36a":"#e5e7eb",transition:"all 0.3s"}}/>))}
                </div>
                <button className="btn" style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#29c36a,#15803d)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,fontFamily:"Inter,sans-serif",boxShadow:"0 8px 24px rgba(41,195,106,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setOnboardStep(1)}>
                  Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* ── SLIDE 2: AI-Powered Split Bill (lavender bg) ── */}
          {onboardStep===1&&(
            <div style={{height:"100%",background:"#f5f3ff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Top bar */}
              <div style={{display:"flex",justifyContent:"flex-end",padding:"52px 24px 0",flexShrink:0}}>
                <button className="btn" style={{background:"transparent",border:"none",color:"#9ca3af",fontSize:14,fontFamily:"Inter,sans-serif",fontWeight:500}} onClick={()=>setShowOnboarding(false)}>Skip</button>
              </div>
              {/* AI badge + Title */}
              <div style={{textAlign:"center",padding:"10px 24px 0",flexShrink:0}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"white",borderRadius:20,padding:"5px 14px",border:"1.5px solid #e9d5ff",marginBottom:10}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>
                  <span style={{fontSize:11,fontWeight:700,color:"#7c3aed",letterSpacing:"0.06em",fontFamily:"Inter,sans-serif"}}>AI POWERED</span>
                </div>
                <div style={{fontSize:30,fontWeight:800,lineHeight:1.15,fontFamily:"Inter,sans-serif",marginBottom:6}}>
                  <span style={{color:"#29c36a"}}>AI-Powered</span><br/>
                  <span style={{color:"#111827"}}>Split Bill</span>
                </div>
                <div style={{fontSize:13,color:"#6b7280",lineHeight:1.5,marginBottom:12}}>Scan receipts with AI, decide who pays what, and track all payments in real-time.</div>
              </div>
              {/* Cards */}
              <div style={{flex:1,overflow:"hidden",padding:"0 20px",position:"relative",display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
                <div style={{background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 28px rgba(124,58,237,0.12)"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#111827",textAlign:"center",marginBottom:8,fontFamily:"Inter,sans-serif"}}>Café Lunasy</div>
                  {[["2x Latte","Rp60.000"],["1x Sandwich","Rp45.000"],["1x Cake","Rp35.000"]].map(([n,p])=>(
                    <div key={n} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12,color:"#6b7280",fontFamily:"Inter,sans-serif"}}>{n}</span>
                      <span style={{fontSize:12,color:"#374151",fontWeight:500,fontFamily:"JetBrains Mono,monospace"}}>{p}</span>
                    </div>
                  ))}
                  <div style={{borderTop:"1px solid #f3f4f6",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#111827",fontFamily:"Inter,sans-serif"}}>Total</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#111827",fontFamily:"JetBrains Mono,monospace"}}>Rp140.000</span>
                  </div>
                </div>
                <div style={{background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#111827",fontFamily:"Inter,sans-serif"}}>Split suggestion</span>
                    <span style={{fontSize:11,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>3 people</span>
                  </div>
                  {[{name:"You",amt:"Rp46.667"},{name:"Andi Pratama",amt:"Rp46.667"},{name:"Budi Santoso",amt:"Rp46.666"}].map(m=>(
                    <div key={m.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:11,fontWeight:700,color:"#29c36a",fontFamily:"Inter,sans-serif"}}>{m.name[0]}</span>
                      </div>
                      <span style={{flex:1,fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif"}}>{m.name}</span>
                      <span style={{fontSize:12,fontWeight:600,fontFamily:"JetBrains Mono,monospace",color:"#374151",marginRight:8}}>{m.amt}</span>
                      <div style={{width:24,height:24,borderRadius:"50%",background:"#29c36a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom always visible */}
              <div style={{padding:"12px 24px 44px",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
                  {[0,1,2].map(i=>(<div key={i} style={{width:i===1?28:8,height:8,borderRadius:4,background:i===1?"#29c36a":"#e5e7eb",transition:"all 0.3s"}}/>))}
                </div>
                <button className="btn" style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#29c36a,#15803d)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,fontFamily:"Inter,sans-serif",boxShadow:"0 8px 24px rgba(41,195,106,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setOnboardStep(2)}>
                  Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* ── SLIDE 3: Track Pay Lunasy (dark green bg) ── */}
          {onboardStep===2&&(
            <div style={{height:"100%",background:"linear-gradient(160deg,#052e16 0%,#0f4023 40%,#166534 100%)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
              {/* Decorative wave bg */}
              <svg style={{position:"absolute",bottom:0,left:0,right:0,opacity:0.15}} viewBox="0 0 400 200" fill="none" preserveAspectRatio="none" width="100%" height="200">
                <path d="M0 100 Q100 60 200 100 Q300 140 400 80 L400 200 L0 200Z" fill="#22c55e"/>
                <path d="M0 140 Q120 100 240 130 Q320 150 400 110 L400 200 L0 200Z" fill="#29c36a"/>
              </svg>
              {/* Content */}
              <div style={{flex:1,display:"flex",flexDirection:"column",padding:"64px 28px 0",position:"relative",zIndex:1}}>
                <div style={{fontSize:42,fontWeight:800,lineHeight:1.1,marginBottom:14,fontFamily:"Inter,sans-serif"}}>
                  <span style={{color:"white"}}>Track, Pay,<br/></span>
                  <span style={{color:"#4ade80"}}>Lunasy.</span>
                </div>
                <div style={{fontSize:15,color:"rgba(255,255,255,0.7)",lineHeight:1.65,marginBottom:28}}>Manage debts easily.<br/>Everything recorded,<br/>transparent, and settled.</div>
                {/* App mockup cards */}
                <div style={{position:"relative",flex:1}}>
                  {/* Main app card */}
                  <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(12px)",borderRadius:20,padding:"14px",border:"1px solid rgba(255,255,255,0.15)",width:"75%",boxShadow:"0 16px 40px rgba(0,0,0,0.3)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <LunasyLogo size={18}/>
                      <span style={{fontSize:12,fontWeight:700,color:"white",fontFamily:"Inter,sans-serif"}}>Lunasy</span>
                      <div style={{marginLeft:"auto",width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Icon name="person" size={11} color="white" sw={1.5}/>
                      </div>
                    </div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Net Balance</div>
                    <div style={{fontSize:20,fontWeight:800,color:"white",fontFamily:"JetBrains Mono,monospace",marginBottom:6}}>-Rp30.000</div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"3px 8px",marginBottom:10}}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{fontSize:9,color:"rgba(255,255,255,0.8)",fontFamily:"Inter,sans-serif"}}>You owe more</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:7,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:2}}>You will receive</div>
                        <div style={{fontSize:10,fontWeight:700,color:"#4ade80",fontFamily:"JetBrains Mono,monospace"}}>Rp520.000</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:7,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:2}}>You owe</div>
                        <div style={{fontSize:10,fontWeight:700,color:"white",fontFamily:"JetBrains Mono,monospace"}}>Rp550.000</div>
                      </div>
                    </div>
                  </div>
                  {/* Floating debt cards */}
                  {[
                    {name:"Andi Pratama",cat:"Transport",amt:"+Rp200.000",color:"#4ade80",top:120,right:0},
                    {name:"Budi Santoso",cat:"Hiburan",amt:"+Rp320.000",color:"#4ade80",top:185,right:8},
                    {name:"Budi Pratacso",cat:"Makan",amt:"-Rp150.000",color:"#f87171",top:250,right:-4},
                  ].map((c,i)=>(
                    <div key={i} style={{position:"absolute",top:c.top,right:c.right,background:"white",borderRadius:12,padding:"8px 12px",width:180,boxShadow:"0 6px 20px rgba(0,0,0,0.2)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:9,fontWeight:700,color:"#29c36a"}}>{c.name[0]}</span>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:8,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>{c.cat}</span>
                          </div>
                          <div style={{fontSize:9,fontWeight:600,color:"#374151",fontFamily:"Inter,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                          <div style={{fontSize:11,fontWeight:800,color:c.color,fontFamily:"JetBrains Mono,monospace"}}>{c.amt}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Security badge */}
                  <div style={{position:"absolute",bottom:20,left:0,right:"30%",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(8px)",borderRadius:12,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",gap:8}}>
                    <Icon name="lock" size={14} color="#4ade80" sw={2}/>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.85)",fontFamily:"Inter,sans-serif",lineHeight:1.3}}>Your data is secure<br/>and always protected.</span>
                  </div>
                </div>
              </div>
              {/* Bottom */}
              <div style={{padding:"0 24px 48px",position:"relative",zIndex:1}}>
                <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}>
                  {[0,1,2].map(i=>(<div key={i} style={{width:i===2?28:8,height:8,borderRadius:4,background:i===2?"#4ade80":"rgba(255,255,255,0.3)",transition:"all 0.3s"}}/>))}
                </div>
                <button className="btn" style={{width:"100%",padding:"17px 0",background:"linear-gradient(135deg,#29c36a,#15803d)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,fontFamily:"Inter,sans-serif",boxShadow:"0 8px 24px rgba(41,195,106,0.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:"none"}} onClick={()=>setShowOnboarding(false)}>
                  Start Lunasy
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4ade80"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>
                </button>
                <div style={{textAlign:"center",marginTop:14}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontFamily:"Inter,sans-serif"}}>Already have an account? </span>
                  <span style={{fontSize:13,color:"#4ade80",fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}} onClick={()=>setShowOnboarding(false)}>Log in</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
