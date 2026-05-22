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
  {id:"food",label:"Makan"},
  {id:"transport",label:"Transport"},
  {id:"shopping",label:"Belanja"},
  {id:"hiburan",label:"Hiburan"},
  {id:"tagihan",label:"Tagihan"},
  {id:"lainnya",label:"Lainnya"},
];
const CAT_ICON={food:"utensils",transport:"bus",shopping:"bag",hiburan:"film",tagihan:"file",lainnya:"more"};
const getCat=(id)=>CATEGORIES.find(c=>c.id===id)||CATEGORIES[5];
const REMINDER_OPT=[{v:0,l:"Hari H"},{v:1,l:"1 hari"},{v:3,l:"3 hari"},{v:7,l:"7 hari"}];

const T={
  light:{bg:"#ffffff",surface:"#ffffff",surface2:"#f7f7f7",border:"#efefef",text:"#111111",text2:"#666666",text3:"#999999",primary:"#16a34a",primaryBg:"#f0fdf4",primaryBorder:"#bbf7d0",navBg:"rgba(255,255,255,0.98)",inputBg:"#f5f5f5",modalBg:"rgba(0,0,0,0.4)",green:"#16a34a",greenBg:"#f0fdf4",greenBorder:"#e0f2e9",red:"#dc2626",redBg:"#fff5f5",redBorder:"#f5c6c6",teal:"#0891b2",tealBg:"#f0f9ff",tealBorder:"#bae6fd"},
  dark:{bg:"#0d0d0d",surface:"#1a1a1a",surface2:"#111111",border:"#2a2a2a",text:"#f0f0f0",text2:"#888888",text3:"#555555",primary:"#22c55e",primaryBg:"#0d2818",primaryBorder:"#1a4731",navBg:"rgba(13,13,13,0.98)",inputBg:"#111111",modalBg:"rgba(0,0,0,0.75)",green:"#22c55e",greenBg:"#0d1f0f",greenBorder:"#1a3320",red:"#ef4444",redBg:"#1f0d0d",redBorder:"#3d1a1a",teal:"#38bdf8",tealBg:"#0d1f2d",tealBorder:"#1a3a4d"},
};

const dueBadge=(due,status,dk)=>{
  if(status==="paid"||status==="verified"||!due)return null;
  const d=diffDays(due);
  if(d<0) return {label:`${Math.abs(d)}h terlambat`,color:dk?"#ef4444":"#dc2626",bg:dk?"#1f0d0d":"#fff5f5",urgent:true};
  if(d===0)return {label:"Jatuh tempo hari ini",color:dk?"#ef4444":"#dc2626",bg:dk?"#1f0d0d":"#fff5f5",urgent:true};
  if(d<=3) return {label:`${d} hari lagi`,color:dk?"#888":"#666",bg:"transparent",urgent:false};
  return      {label:`${d} hari lagi`,color:dk?"#555":"#999",bg:"transparent",urgent:false};
};
const payStatusInfo=(status,t)=>{
  if(status==="paying")   return {label:"Menunggu Konfirmasi",icon:"clock", color:t.text2,bg:t.surface2,border:t.border};
  if(status==="verified") return {label:"Terverifikasi",      icon:"verify",color:t.green,bg:t.greenBg,border:t.greenBorder};
  if(status==="disputed") return {label:"Pembayaran Ditolak", icon:"x",    color:t.red,  bg:t.redBg,  border:t.redBorder};
  if(status==="paid")     return {label:"Lunas",              icon:"check", color:t.green,bg:t.greenBg,border:t.greenBorder};
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
    {accId:"acc_reggy",share:120000,paid:120000,paymentStatus:"verified",payment:{payerNote:"Yang bayar duluan",proofImage:null,submittedAt:"17 Mei",verifiedAt:"17 Mei",verifiedBy:"acc_reggy",disputeNote:null}},
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
  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
}

function Avatar({account,size=38}){
  return (
    <div style={{width:size,height:size,borderRadius:size*0.28,background:"#f0fdf4",border:"1.5px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.33,color:"#16a34a",flexShrink:0,fontFamily:"Inter,sans-serif"}}>
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
          <input className="input" placeholder="Catatan pembayaran..." value={proofNote} onChange={e=>setProofNote(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.border}`,marginBottom:10}}/>
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
          <input className="input" placeholder="Alasan penolakan..." value={disputeText} onChange={e=>setDisputeText(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.redBorder}`,marginBottom:8}}/>
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
                <Avatar account={other} size={44}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:t.text}}>{d.note}</div>
                  <div style={{fontSize:11,color:t.text3}}>{isMeOwing?"Hutang ke":"Piutang dari"} {other?.name}</div>
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
                  <input className="input" placeholder="Catatan pembayaran..." value={payNote} onChange={e=>setPayNote(e.target.value)} style={{background:t.surface,color:t.text,border:`1px solid ${t.primaryBorder}`,marginBottom:10}}/>
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
                  <input className="input" placeholder="Alasan penolakan..." value={payDNote} onChange={e=>setPayDNote(e.target.value)} style={{background:t.surface2,color:t.text,border:`1px solid ${t.redBorder}`,marginBottom:8}}/>
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
  const doCreate=()=>{if(!isValid)return;const total=mode==="custom"?totalShares:totalItems;handleAddSplit({id:"sb"+uid(),title,category:cat,date,note,totalAmount:total,payerId:meId,splitMode:mode,createdBy:meId,items:items.filter(i=>i.name&&i.amount).map(i=>({...i,id:i.id||uid(),amount:parseInt(i.amount)})),members:members.map(id=>({accId:id,share:getShare(id),paid:id===meId?getShare(id):0,paymentStatus:id===meId?"verified":"unpaid",payment:id===meId?{payerNote:"Yang bayar duluan",proofImage:null,submittedAt:nowTime(),verifiedAt:nowTime(),verifiedBy:meId,disputeNote:null}:null}))});};
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
                  <button className="btn" style={{width:"100%",background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,fontSize:13}} onClick={()=>setStep(2)}>Input Manual Tanpa AI →</button>
                </div>}
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setStep(0)}>"Kembali"</button>
                    {!aiRes
                      ? <button className="btn" style={{flex:2,background:aiLoading?t.surface2:t.primary,color:aiLoading?t.text2:"white",fontWeight:700,opacity:!billImg||aiLoading?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={doScan} disabled={!billImg||aiLoading}>{aiLoading?<><Icon name="clock" size={14} color={t.text2} sw={2}/>Membaca...</>:<><Icon name="scan" size={14} color="white" sw={1.8}/>Scan</>}</button>
                      : <button className="btn" style={{flex:2,background:t.primary,color:"white",fontWeight:700}} onClick={()=>setStep(2)}>Gunakan Hasil</button>
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
                  {[meId,...connIds].map(id=>{const acc=getAcc2(id);const sel=members.includes(id);return(<div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:sel?t.primaryBg:t.surface2,border:`1px solid ${sel?t.primary:t.border}`,borderRadius:10,marginBottom:8,cursor:id===meId?"default":"pointer"}} onClick={id===meId?undefined:()=>setMembers(p=>p.includes(id)?p.length>1?p.filter(x=>x!==id):p:[...p,id])}><Avatar account={acc} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{acc?.name} {id===meId&&<span style={{fontSize:10,color:t.primary}}>(Kamu)</span>}</div><div style={{fontSize:11,color:t.text3}}>@{acc?.username}</div></div>{sel?<Icon name="check" size={16} color={t.primary} sw={2.5}/>:<Icon name="add" size={16} color={t.text3} sw={1.8}/>}</div>);})}
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
                    {[["equal","Rata"],["custom","Custom"],["itemized","Per Item"]].map(([m,l])=>(
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
                    <button className="btn" style={{flex:1,background:t.green,color:"white",fontWeight:700,opacity:!isValid?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={doCreate}><Icon name="check" size={14} color="white" sw={2.5}/>Buat Split Bill</button>
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
  const sendReq=(toId)=>{if(isConn(meId,toId)||outgoing.some(c=>c.toId===toId))return;setConnections(prev=>[...prev,{id:uid(),fromId:meId,toId,status:"pending"}]);showToast("Permintaan koneksi dikirim");};
  const acceptReq=(cId)=>{setConnections(prev=>prev.map(c=>c.id===cId?{...c,status:"accepted"}:c));showToast("Koneksi diterima");addNotif("connection","Koneksi baru diterima","Kamu dan mereka sekarang terhubung","link");};
  const rejectReq=(cId)=>{const conn=connections.find(c=>c.id===cId);const isOut=conn?.fromId===meId;if(isOut){setConfirmDialog({title:"Batalkan Permintaan",msg:"Yakin ingin membatalkan permintaan koneksi ini?",onConfirm:()=>setConnections(prev=>prev.filter(c=>c.id!==cId))});}else{setConnections(prev=>prev.filter(c=>c.id!==cId));showToast("Ditolak");}};
  const disconn=(aId)=>{const acc=accounts.find(a=>a.id===aId);setConfirmDialog({title:"Putus Koneksi",msg:`${"Yakin ingin memutus koneksi dengan"} ${acc?.name}${"? Catatan hutang bersama tetap tersimpan."}`,onConfirm:()=>{const c=getConn(meId,aId);if(c)setConnections(connections.filter(x=>x.id!==c.id));showToast("Koneksi diputus");setProfileAcc(null);}});};
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
    showToast("Bukti terkirim");addNotif("payment","Bukti pembayaran terkirim","Menunggu konfirmasi dari penerima","upload");
  };
  const handleVerify=(id,seq)=>{
    setDebts(debts.map(d=>{if(d.id!==id)return d;if(seq!=null){const ns=d.installments.schedule.map(s=>s.seq===seq?{...s,status:"verified",paidAt:todayStr(),payment:{...s.payment,verifiedAt:nowTime(),verifiedBy:meId}}:s);const pn=ns.filter(s=>s.status==="verified").length;return{...d,paidAmount:pn*d.installments.amount,status:pn===d.installments.total?"verified":"unpaid",installments:{...d.installments,paid:pn,schedule:ns}};}return{...d,status:"verified",paidAmount:d.amount,payment:{...d.payment,verifiedAt:nowTime(),verifiedBy:meId}};}));
    showToast("Pembayaran dikonfirmasi!");addNotif("verified","Pembayaran dikonfirmasi","Hutang telah lunas","check");
  };
  const handleDispute=(id,dn,seq)=>{
    setDebts(debts.map(d=>{if(d.id!==id)return d;if(seq!=null){const ns=d.installments.schedule.map(s=>s.seq===seq?{...s,status:"disputed",payment:{...s.payment,disputeNote:dn}}:s);return{...d,installments:{...d.installments,schedule:ns}};}return{...d,status:"disputed",payment:{...d.payment,disputeNote:dn}};}));
    showToast("Bukti ditolak","error");
  };
  const handleAddDebt=()=>{
    if(!addForm.toAccId||!addForm.amount||!addForm.note){showToast("Lengkapi semua field","error");return;}
    const amt=parseInt(addForm.amount);let ins=null;
    if(addForm.isInstallment){const iAmt=parseInt(addForm.installAmount)||Math.round(amt/parseInt(addForm.installTotal));ins={total:parseInt(addForm.installTotal),paid:0,amount:iAmt,schedule:Array.from({length:parseInt(addForm.installTotal)},(_,i)=>({seq:i+1,dueDate:addDays(addForm.dueDate,i*30),status:"unpaid",paidAt:null,payment:null}))};}
    const nd={id:"d"+uid(),type:ins?"installment":"regular",amount:amt,paidAmount:0,note:addForm.note,date:addForm.date,dueDate:addForm.dueDate,reminders:addForm.reminders,status:"unpaid",shared:addForm.shared,category:addForm.category,installments:ins,payment:null};
    if(addForm.type==="lend"){nd.fromAccId=addForm.toAccId;nd.toAccId=meId;}else{nd.fromAccId=meId;nd.toAccId=addForm.toAccId;}
    setDebts([nd,...debts]);
    setAddForm({type:"lend",toAccId:"",amount:"",note:"",date:todayStr(),dueDate:addDays(todayStr(),7),reminders:[1,3],shared:true,category:"lainnya",isInstallment:false,installTotal:3,installAmount:""});
    setAddDebtModal(false);setView("dashboard");showToast("Catatan hutang ditambahkan");
  };
  const handleSaveReminder=(id,r,due)=>{setDebts(debts.map(d=>d.id===id?{...d,reminders:r,dueDate:due}:d));setReminderDebt(null);showToast("Reminder diperbarui");};
  const handleSwitch=(id)=>{setMeId(id);setSwitchModal(false);setView("dashboard");showToast(`Beralih ke ${accounts.find(a=>a.id===id)?.name}`);};
  const handleSaveProfile=()=>{setAccounts(accounts.map(a=>a.id===meId?{...a,...editForm}:a));setEditProfile(false);showToast("Profil diperbarui");};
  const handleAddSplit=(s)=>{setSplits([s,...splits]);setCreateSplit(false);showToast("Split bill dibuat");};
  const handleSubmitSplitProof=(sId,aId,pd)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paymentStatus:"paying",payment:pd})}));showToast("Bukti terkirim");};
  const handleVerifySplitMember=(sId,aId)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paid:m.share,paymentStatus:"verified",payment:{...m.payment,verifiedAt:nowTime(),verifiedBy:meId}})}));showToast("Dikonfirmasi!");};
  const handleDisputeSplitMember=(sId,aId,dn)=>{setSplits(splits.map(s=>s.id!==sId?s:{...s,members:s.members.map(m=>m.accId!==aId?m:{...m,paymentStatus:"disputed",payment:{...m.payment,disputeNote:dn}})}));showToast("Ditolak","error");};
  const toggleAddReminder=(v)=>setAddForm(f=>({...f,reminders:f.reminders.includes(v)?f.reminders.filter(x=>x!==v):[...f.reminders,v]}));

  const renderDebtCard=(d)=>{
    const isMeOwing=d.fromAccId===meId,isMeLender=d.toAccId===meId;
    const other=getAcc(isMeOwing?d.toAccId:d.fromAccId);
    const due=dueBadge(d.dueDate,d.status,dark);
    const done=isDone(d);
    const si=payStatusInfo(d.status,t);
    const isIns=d.type==="installment";
    const rem=d.amount-d.paidAmount;
    const accentColor=done?t.border:isMeOwing?t.red:t.green;
    const instPaying=isIns?d.installments.schedule.filter(s=>s.status==="paying").length:0;
    return (
      <div key={d.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",background:t.surface,borderRadius:12,border:`1px solid ${t.border}`,cursor:"pointer",position:"relative",marginBottom:8}} onClick={()=>isIns?setInstallModal(d):setPayModal({debt:d,installSeq:null})}>
        <div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:"60%",borderRadius:"2px",background:accentColor,minHeight:32}}/>
        <Avatar account={other} size={40}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:13,fontWeight:600,color:t.text}}>{other?.name||"Unknown"}</span>
            <span style={{fontSize:10,background:t.surface2,color:t.text3,padding:"1px 7px",borderRadius:4,fontWeight:500}}>{getCat(d.category).label}</span>
          </div>
          <div style={{fontSize:11,color:t.text3}}>{isMeOwing?"Hutang ke":"Piutang dari"}</div>
          <div style={{fontSize:11,color:t.text3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.note}</div>
          <div style={{display:"flex",gap:4,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>
            {si&&!done&&<StatusBadge si={si} t={t}/>}
            {done&&<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,padding:"2px 7px",borderRadius:4,fontWeight:600}}><Icon name="check" size={9} color={t.green} sw={2.5}/>Lunas</span>}
            {due&&!done&&d.status==="unpaid"&&<span style={{fontSize:10,fontWeight:600,color:due.color,background:due.bg,padding:"2px 7px",borderRadius:4}}>{due.label}</span>}
            {isIns&&instPaying>0&&isMeLender&&<span style={{fontSize:10,background:t.surface2,color:t.text2,padding:"2px 7px",borderRadius:4,fontWeight:600}}>{instPaying} perlu verifikasi</span>}
            {isIns&&<span style={{fontSize:10,color:t.text3}}>{d.installments.paid}/{d.installments.total} cicilan</span>}
          </div>
          {isIns&&!done&&<ProgressBar paid={d.paidAmount} total={d.amount} t={t}/>}
        </div>
        <div style={{textAlign:"right",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:done?t.text3:isMeOwing?t.red:t.green}}>{fmt(isIns?rem:d.amount)}</div>
          {!done&&isMeOwing&&d.status==="unpaid"&&!isIns&&<button className="btn" style={{padding:"4px 10px",fontSize:11,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={e=>{e.stopPropagation();setPayModal({debt:d,installSeq:null});}}><Icon name="creditcard" size={11} color={t.primary} sw={2}/>Bayar</button>}
          {!done&&isMeLender&&d.status==="paying"&&<button className="btn" style={{padding:"4px 10px",fontSize:11,background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={e=>{e.stopPropagation();setPayModal({debt:d,installSeq:null});}}><Icon name="verify" size={11} color={t.green} sw={2}/>Verif</button>}
          {!done&&d.status==="disputed"&&isMeOwing&&<button className="btn" style={{padding:"4px 10px",fontSize:11,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={e=>{e.stopPropagation();setPayModal({debt:d,installSeq:null});}}><Icon name="transfer" size={11} color={t.red} sw={2}/>Ulang</button>}
          <button className="btn" style={{padding:"3px 8px",fontSize:10,background:t.surface2,color:t.text3,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:3}} onClick={e=>{e.stopPropagation();setReminderDebt({...d});}}><Icon name="bell" size={10} color={t.text3} sw={2}/></button>
        </div>
      </div>
    );
  };

  const NAV=[{id:"dashboard",icon:"home",label:"Beranda"},{id:"add",icon:"add",label:"Tambah"},{id:"profile",icon:"person",label:"Profil"}];

  return (
    <div style={{fontFamily:"Inter,sans-serif",minHeight:"100vh",background:t.bg,color:t.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:7px;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;cursor:pointer;border:none;transition:all 0.15s ease;}
        .btn:active{transform:scale(0.97);}
        .input{width:100%;border-radius:7px;padding:10px 13px;font-family:'Inter',sans-serif;font-size:13px;outline:none;}
        .input:focus{box-shadow:0 0 0 3px rgba(22,163,74,0.1);}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
      `}</style>

      {/* HEADER */}
      <div style={{padding:"20px 20px 0",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 6 L6 26 L16 26 L16 22 L10 22 L10 6 Z" fill="#16a34a"/>
              <path d="M13 2 L13 22 L23 22 L23 18 L17 18 L17 2 Z" fill="#dc2626"/>
            </svg>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:t.text,letterSpacing:"-0.02em",lineHeight:1}}>Lunasy</div>
              <div style={{fontSize:11,color:t.text3,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:1}}>{view==="dashboard"?"Beranda":view==="add"?"Tambah":"Profil"}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}} onClick={()=>{setShowNotifPanel(true);setNotifList(prev=>prev.map(n=>({...n,read:true})));}} >
              <Icon name="bell" size={15} color={t.text2} sw={1.6}/>
              {unreadNotif>0&&<div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:t.red,border:`1.5px solid ${t.surface2}`}}/>}
            </div>
            <div style={{width:34,height:34,borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setDark(!dark)}>
              <Icon name={dark?"sun":"moon"} size={15} color={t.text2} sw={1.6}/>
            </div>
            <div style={{cursor:"pointer",position:"relative"}} onClick={()=>setSwitchModal(true)}>
              <Avatar account={me} size={38}/>
              {(overdueCount+todayCount)>0&&<div style={{position:"absolute",top:-1,right:-1,width:7,height:7,borderRadius:"50%",background:t.red,border:`2px solid ${t.bg}`}}/>}
            </div>
          </div>
        </div>

        {/* Balance card — dashboard only */}
        {view==="dashboard"&&(
          <div style={{marginBottom:20}}>
            <div style={{background:"linear-gradient(135deg,#15803d 0%,#16a34a 50%,#22c55e 100%)",borderRadius:20,padding:"22px 24px",boxShadow:"0 8px 32px rgba(22,163,74,0.3)",position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(22,163,74,0.25)",minHeight:170}}>
              <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",bottom:-50,right:40,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:18}}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6 L6 26 L16 26 L16 22 L10 22 L10 6 Z" fill="rgba(255,255,255,0.7)"/>
                  <path d="M13 2 L13 22 L23 22 L23 18 L17 18 L17 2 Z" fill="white"/>
                </svg>
                <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.8)",letterSpacing:"0.08em",textTransform:"uppercase"}}>Lunasy</span>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Net Balance</div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:30,fontWeight:700,color:"white",letterSpacing:"-0.02em",marginBottom:20}}>{netBalance>=0?"+":""}{fmt(netBalance)}</div>
              <div style={{display:"flex",gap:0}}>
                {[["Piutang",fmt(totalOwed),false],["Hutang",fmt(totalIOwe),false],["Verifikasi",pendVerif,true]].map(([l,v,click],i)=>(
                  <div key={l} style={{flex:1,borderRight:i<2?"1px solid rgba(255,255,255,0.15)":"none",paddingRight:i<2?12:0,paddingLeft:i>0?12:0,cursor:click?"pointer":"default"}} onClick={click?()=>setFilter("verif"):undefined}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"white",fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{position:"absolute",bottom:22,right:24,opacity:0.2}}>
                <svg width="36" height="28" viewBox="0 0 36 28" fill="none"><rect width="36" height="28" rx="4" fill="white"/><rect x="0" y="9" width="36" height="10" fill="rgba(0,0,0,0.15)"/><rect x="12" y="0" width="12" height="28" fill="rgba(0,0,0,0.1)"/></svg>
              </div>
            </div>
          </div>
        )}

        {/* Banners */}
        {view==="dashboard"&&(overdueCount>0||todayCount>0)&&(
          <div style={{padding:"10px 0",marginBottom:2,display:"flex",alignItems:"center",gap:10,cursor:"pointer",borderBottom:`1px solid ${t.border}`}} onClick={()=>setFilter("overdue")}>
            <Icon name="alert" size={16} color={t.red} sw={2}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.red}}>{overdueCount>0&&`${overdueCount} terlambat`}{overdueCount>0&&todayCount>0&&" · "}{todayCount>0&&`${todayCount} hari ini`}</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>Tap untuk lihat</div></div>
            <Icon name="chevron" size={14} color={t.text3} sw={1.5}/>
          </div>
        )}
        {view==="dashboard"&&pendVerif>0&&(
          <div style={{padding:"10px 0",marginBottom:2,display:"flex",alignItems:"center",gap:10,cursor:"pointer",borderBottom:`1px solid ${t.border}`}} onClick={()=>setFilter("verif")}>
            <Icon name="verify" size={16} color={t.text3} sw={1.6}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:t.text}}>{pendVerif} pembayaran menunggu verifikasi</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>Tap untuk verifikasi</div></div>
            <Icon name="chevron" size={14} color={t.text3} sw={1.5}/>
          </div>
        )}
        {view==="dashboard"&&incoming.length>0&&(
          <div style={{padding:"10px 0",marginBottom:2,display:"flex",alignItems:"center",gap:10,cursor:"pointer",borderBottom:`1px solid ${t.border}`}} onClick={()=>{setView("profile");setAccountTab("requests");}}>
            <Icon name="link" size={16} color={t.text3} sw={1.6}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:t.text}}>{incoming.length} permintaan koneksi</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>Tap untuk lihat</div></div>
            <Icon name="chevron" size={14} color={t.text3} sw={1.5}/>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{padding:"0 20px",maxWidth:480,margin:"0 auto",paddingBottom:110}}>

        {/* DASHBOARD */}
        {view==="dashboard"&&(
          <div>
            <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,marginBottom:16}}>
              {[{id:"debts",label:"Catatan"},{id:"splits",label:"Split Bill"}].map(tab=>(
                <button key={tab.id} style={{flex:1,padding:"9px 4px",border:"none",background:"transparent",fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",borderBottom:`2px solid ${mainTab===tab.id?t.primary:"transparent"}`,color:mainTab===tab.id?t.primary:t.text3}} onClick={()=>setMainTab(tab.id)}>{tab.label}</button>
              ))}
            </div>

            {mainTab==="debts"&&(
              <div>
                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  <div style={{flex:1,position:"relative"}}>
                    <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{width:"100%",appearance:"none",background:catFilter!=="all"?t.primaryBg:t.surface2,border:`1px solid ${catFilter!=="all"?t.primary:t.border}`,borderRadius:8,padding:"9px 28px 9px 12px",fontSize:12,fontWeight:500,color:catFilter!=="all"?t.primary:t.text2,fontFamily:"Inter,sans-serif",cursor:"pointer",outline:"none"}}>
                      <option value="all">Semua Kategori</option>
                      {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <div style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={13} color={catFilter!=="all"?t.primary:t.text3} sw={1.8}/></div>
                  </div>
                  <div style={{flex:1,position:"relative"}}>
                    <select value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"100%",appearance:"none",background:filter!=="all"?t.primaryBg:t.surface2,border:`1px solid ${filter!=="all"?t.primary:t.border}`,borderRadius:8,padding:"9px 28px 9px 12px",fontSize:12,fontWeight:500,color:filter!=="all"?t.primary:t.text2,fontFamily:"Inter,sans-serif",cursor:"pointer",outline:"none"}}>
                      <option value="all">Semua Status</option>
                      <option value="verif">Perlu Verifikasi</option>
                      <option value="overdue">Terlambat</option>
                      <option value="soon">Segera</option>
                      <option value="lent">Piutang</option>
                      <option value="owe">Hutang</option>
                      <option value="paid">Lunas</option>
                    </select>
                    <div style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={13} color={filter!=="all"?t.primary:t.text3} sw={1.8}/></div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em"}}>Catatan</div>
                  <div style={{fontSize:12,color:t.text3}}>{filteredDebts.length} item</div>
                </div>
                {filteredDebts.length===0&&(
                  <div style={{textAlign:"center",color:t.text3,padding:"40px 0"}}>
                    <div style={{width:48,height:48,borderRadius:12,background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Icon name="inbox" size={22} color={t.text3} sw={1.4}/></div>
                    <div style={{fontSize:14,fontWeight:500}}>Tidak ada catatan</div>
                  </div>
                )}
                {filteredDebts.map(renderDebtCard)}
              </div>
            )}

            {mainTab==="splits"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em"}}>Split Bill ({mySplits.length})</div>
                  <button className="btn" style={{padding:"6px 12px",fontSize:12,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,display:"flex",alignItems:"center",gap:5}} onClick={()=>setCreateSplit(true)}><Icon name="add" size={13} color={t.primary} sw={2}/>Buat</button>
                </div>
                {mySplits.length===0&&<div style={{textAlign:"center",color:t.text3,padding:"40px 0"}}><Icon name="receipt" size={32} color={t.text3} sw={1.4}/><div style={{marginTop:8,fontSize:13}}>Belum ada split bill</div></div>}
                {mySplits.map(s=>{
                  const totalPaid=s.members.reduce((sum,m)=>sum+m.paid,0);
                  const myM=s.members.find(m=>m.accId===meId);
                  const allDone=s.members.every(m=>m.paymentStatus==="verified");
                  const pendCnt=s.members.filter(m=>m.paymentStatus==="paying"&&m.accId!==meId).length;
                  const iMPayer=s.payerId===meId;
                  return (
                    <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"13px 16px",background:t.surface,borderRadius:12,border:`1px solid ${t.border}`,cursor:"pointer",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onClick={()=>setSplitDetail(s)}>
                      <div style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={CAT_ICON[getCat(s.category).id]||"receipt"} size={18} color={t.primary} sw={1.8}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
                        <div style={{fontSize:11,color:t.text3,marginBottom:6}}>{s.members.length} orang · {s.date}</div>
                        <ProgressBar paid={totalPaid} total={s.totalAmount} t={t}/>
                        <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                          {iMPayer&&pendCnt>0&&<span style={{fontSize:10,background:t.surface2,color:t.text2,padding:"1px 6px",borderRadius:4,fontWeight:600,border:`1px solid ${t.border}`}}>{pendCnt} perlu verif</span>}
                          {!myM?.paymentStatus?.includes("verified")&&!iMPayer&&<span style={{fontSize:10,background:t.redBg,color:t.red,padding:"1px 6px",borderRadius:4,fontWeight:600,border:`1px solid ${t.redBorder}`}}>Belum bayar</span>}
                          {allDone&&<span style={{fontSize:10,background:t.greenBg,color:t.green,padding:"1px 6px",borderRadius:4,fontWeight:600,border:`1px solid ${t.greenBorder}`}}>Selesai</span>}
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:allDone?t.green:t.primary}}>{fmt(s.totalAmount)}</div>
                        {myM&&<div style={{fontSize:10,color:t.text3,marginTop:2}}>{fmt(myM.share)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ADD VIEW */}
        {view==="add"&&(
          <div>
            {[
              {id:"debt",  icon:"creditcard",label:"Catat Hutang",  sub:"Kamu yang berhutang ke orang lain",color:t.red},
              {id:"lend",  icon:"transfer",  label:"Catat Piutang", sub:"Orang lain berhutang ke kamu",     color:t.green},
              {id:"split", icon:"receipt",   label:"Split Bill",    sub:"Bagi tagihan dengan beberapa orang",color:t.primary},

            ].map((item,i,arr)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 0",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={()=>{if(item.id==="debt"){setAddForm({...addForm,type:"borrow"});setAddDebtModal(true);}else if(item.id==="lend"){setAddForm({...addForm,type:"lend"});setAddDebtModal(true);}else if(item.id==="split"){setCreateSplit(true);}}}>
                <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={item.icon} size={20} color={item.color} sw={1.8}/></div>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:t.text}}>{item.label}</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div></div>
                <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {view==="profile"&&(
          <div>
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:18,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                <Avatar account={me} size={64}/>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>{me?.name}</div><div style={{fontSize:13,color:t.primary,fontWeight:600}}>@{me?.username}</div>{me?.bio&&<div style={{fontSize:12,color:t.text2,marginTop:4}}>{me.bio}</div>}</div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {[["Koneksi",connIds.length,t.primary],["Aktif",myDebts.filter(d=>!isDone(d)).length,t.red],["Lunas",myDebts.filter(d=>isDone(d)).length,t.green]].map(([l,v,c])=>(
                  <div key={l} style={{flex:1,background:t.surface2,borderRadius:8,padding:"10px 12px",border:`1px solid ${t.border}`,textAlign:"center"}}>
                    <div style={{fontSize:9,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:20,color:c,fontWeight:700,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
              {(me?.bankAccounts||[]).length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Rekening Bank</div>
                  <div style={{background:t.surface2,borderRadius:12,overflow:"hidden",border:`1px solid ${t.border}`}}>
                    {(me.bankAccounts||[]).map((ba,i,arr)=>(
                      <div key={ba.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                        <Icon name="creditcard" size={16} color={t.text2} sw={1.8}/>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{ba.bank}</div><div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:t.text2}}>{ba.number}</div><div style={{fontSize:11,color:t.text3}}>{ba.name}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{background:t.surface2,borderRadius:10,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                {[{icon:"edit",label:"Edit Profil",action:()=>{setEditForm({name:me.name,username:me.username,phone:me.phone,bio:me.bio,bankAccounts:JSON.parse(JSON.stringify(me.bankAccounts||[]))});setEditProfile(true);}},{icon:"bell",label:"Notifikasi",action:()=>setShowNotifSettings(true)},{icon:"lock",label:"Keamanan",action:()=>{}},{icon:"settings",label:"Preferensi",action:()=>setShowPreferences(true)}].map((item,i,arr)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none",cursor:"pointer"}} onClick={item.action}>
                    <div style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={item.icon} size={16} color={t.text2} sw={1.6}/></div>
                    <span style={{flex:1,fontSize:14,fontWeight:500,color:t.text}}>{item.label}</span>
                    <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Koneksi */}
            <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:18,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Koneksi ({connIds.length})</div>
                <div style={{display:"flex",gap:4}}>
                  {[{id:"connected",label:"Terhubung"},{id:"requests",label:`Permintaan${incoming.length>0?" ("+incoming.length+")":""}`},{id:"discover",label:"Temukan"}].map(tab=>(
                    <button key={tab.id} style={{padding:"5px 9px",fontSize:11,borderRadius:5,border:`1px solid ${accountTab===tab.id?t.primary:t.border}`,background:accountTab===tab.id?t.primaryBg:"transparent",color:accountTab===tab.id?t.primary:t.text2,fontFamily:"Inter,sans-serif",fontWeight:500,cursor:"pointer"}} onClick={()=>setAccountTab(tab.id)}>{tab.label}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <input className="input" placeholder="Cari..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/>
              </div>
              {accountTab==="connected"&&connIds.map(id=>{
                const a=getAcc(id);
                const net=debts.filter(d=>d.toAccId===meId&&d.fromAccId===id&&!isDone(d)).reduce((s,d)=>s+d.amount-d.paidAmount,0)-debts.filter(d=>d.fromAccId===meId&&d.toAccId===id&&!isDone(d)).reduce((s,d)=>s+d.amount-d.paidAmount,0);
                return (
                  <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`,cursor:"pointer"}} onClick={()=>setProfileAcc(a)}>
                    <Avatar account={a} size={40}/>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div><div style={{fontSize:11,color:t.text3}}>@{a?.username}</div></div>
                    <div style={{textAlign:"right",marginRight:4}}>
                      {net>0&&<div style={{fontSize:12,color:t.green,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>+{fmt(net)}</div>}
                      {net<0&&<div style={{fontSize:12,color:t.red,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{fmt(net)}</div>}
                      {net===0&&<div style={{fontSize:11,color:t.text3}}>Seimbang</div>}
                    </div>
                    <Icon name="chevron" size={14} color={t.text3} sw={1.5}/>
                  </div>
                );
              })}
              {accountTab==="requests"&&(
                <div>
                  {incoming.map(c=>{const a=getAcc(c.fromId);return(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}><Avatar account={a} size={38}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div><div style={{fontSize:11,color:t.text3}}>@{a?.username}</div></div><div style={{display:"flex",gap:5}}><button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,display:"flex",alignItems:"center",gap:3}} onClick={()=>acceptReq(c.id)}><Icon name="check" size={11} color={t.green} sw={2.5}/>"Terima"</button><button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`}} onClick={()=>rejectReq(c.id)}>"Tolak"</button></div></div>);})}
                  {outgoing.map(c=>{const a=getAcc(c.toId);return(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}><Avatar account={a} size={38}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a?.name}</div><div style={{fontSize:11,color:t.text3}}>Menunggu konfirmasi...</div></div><button className="btn" style={{padding:"5px 9px",fontSize:11,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`}} onClick={()=>rejectReq(c.id)}>"Batal"</button></div>);})}
                  {incoming.length===0&&outgoing.length===0&&<div style={{textAlign:"center",color:t.text3,padding:"16px 0",fontSize:13}}>Tidak ada permintaan</div>}
                </div>
              )}
              {accountTab==="discover"&&(
                <div>
                  {(searchQ.trim().length>1?accounts.filter(a=>a.id!==meId&&(a.name.toLowerCase().includes(searchQ.toLowerCase())||a.username.toLowerCase().includes(searchQ.toLowerCase()))):discover).map(a=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
                      <Avatar account={a} size={38}/>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{a.name}</div><div style={{fontSize:11,color:t.text3}}>@{a.username}</div></div>
                      {outgoing.some(c=>c.toId===a.id)
                        ? <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:t.text3}}>Menunggu...</span><button className="btn" style={{padding:"5px 9px",fontSize:11,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`}} onClick={()=>rejectReq(outgoing.find(c=>c.toId===a.id).id)}>"Batal"</button></div>
                        : <button className="btn" style={{padding:"6px 11px",fontSize:11,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={()=>sendReq(a.id)}><Icon name="link" size={11} color={t.primary} sw={2}/>Hubungkan</button>
                      }
                    </div>
                  ))}
                  {discover.length===0&&searchQ.trim().length<=1&&<div style={{textAlign:"center",color:t.text3,padding:"16px 0",fontSize:13}}>Tidak ada akun lain</div>}
                </div>
              )}
            </div>

            <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Ganti Akun</div>
            {accounts.filter(a=>a.id!==meId).map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:t.surface,border:`1px solid ${t.border}`,borderRadius:10,marginBottom:6,cursor:"pointer"}} onClick={()=>handleSwitch(a.id)}>
                <Avatar account={a} size={40}/>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div><div style={{fontSize:11,color:t.text3}}>@{a.username}</div></div>
                <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:t.surface,backdropFilter:"blur(16px)",borderTop:`1px solid ${t.border}`,boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",padding:"10px 4px 20px",display:"flex",justifyContent:"space-around",maxWidth:480,margin:"0 auto"}}>
        {NAV.map(n=>(
          <div key={n.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 10px",borderRadius:10,cursor:"pointer",color:view===n.id?t.primary:t.text3,background:view===n.id?t.primaryBg:"transparent",fontSize:10,fontWeight:600,letterSpacing:"0.02em",position:"relative",transition:"all 0.15s"}} onClick={()=>setView(n.id)}>
            {n.id==="dashboard"&&(overdueCount+todayCount)>0&&<div style={{position:"absolute",top:3,right:5,width:7,height:7,borderRadius:"50%",background:t.red,border:`2px solid ${t.bg}`}}/>}
            <Icon name={n.icon} size={n.id==="add"?22:20} color="currentColor" sw={n.id==="add"?2.2:view===n.id?2:1.6}/>
            <span>{n.label}</span>
          </div>
        ))}
      </div>

      {/* SWITCH MODAL */}
      {switchModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>setSwitchModal(false)}>
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:380}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:16}}>Ganti Akun</div>
            {accounts.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:a.id===meId?t.primaryBg:t.surface2,border:`1px solid ${a.id===meId?t.primary:t.border}`,borderRadius:10,marginBottom:8,cursor:"pointer"}} onClick={()=>handleSwitch(a.id)}>
                <Avatar account={a} size={40}/>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div><div style={{fontSize:11,color:t.text3}}>@{a.username}</div></div>
                {a.id===meId?<span style={{fontSize:11,color:t.primary,fontWeight:700}}>Aktif</span>:<Icon name="chevron" size={16} color={t.text3} sw={1.5}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileAcc&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>setProfileAcc(null)}>
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:360}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{display:"inline-block",marginBottom:10}}><Avatar account={profileAcc} size={64}/></div>
              <div style={{fontSize:18,fontWeight:700,color:t.text}}>{profileAcc.name}</div>
              <div style={{fontSize:13,color:t.primary,fontWeight:600}}>@{profileAcc.username}</div>
              {profileAcc.bio&&<div style={{fontSize:12,color:t.text2,marginTop:6}}>{profileAcc.bio}</div>}
            </div>
            {(profileAcc.bankAccounts||[]).length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Rekening Bank</div>
                <div style={{background:t.surface2,borderRadius:10,overflow:"hidden",border:`1px solid ${t.border}`}}>
                  {(profileAcc.bankAccounts||[]).map((ba,i,arr)=>(
                    <div key={ba.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                      <Icon name="creditcard" size={14} color={t.text2} sw={1.8}/>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{ba.bank} <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:t.text2}}>{ba.number}</span></div><div style={{fontSize:11,color:t.text3}}>{ba.name}</div></div>
                      <button style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:t.primary,fontWeight:600,display:"flex",alignItems:"center",gap:3}} onClick={()=>{navigator.clipboard?.writeText(ba.number);showToast(`${ba.bank} disalin`);}}>
                        <Icon name="file" size={12} color={t.primary} sw={2}/>Salin
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(profileAcc.bankAccounts||[]).length===0&&<div style={{background:t.surface2,borderRadius:10,padding:"11px 14px",marginBottom:14,textAlign:"center",fontSize:12,color:t.text3}}>Belum ada rekening bank</div>}
            <div style={{display:"flex",gap:10}}>
              {isConn(meId,profileAcc.id)&&<button className="btn" style={{flex:1,background:t.redBg,color:t.red,border:`1px solid ${t.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center",gap:5}} onClick={()=>disconn(profileAcc.id)}><Icon name="x" size={13} color={t.red} sw={2}/>Putus</button>}
              <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setProfileAcc(null)}>"Tutup"</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editProfile&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setEditProfile(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 32px"}}>
              <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:20}}>Edit Profil</div>
              <div style={{background:t.surface2,borderRadius:12,overflow:"hidden",marginBottom:14}}>
                {[["name","Nama Lengkap"],["username","Username"],["phone","No. HP"],["bio","Bio"]].map(([k,label],i,arr)=>(
                  <div key={k} style={{padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>{label}</div>
                    <input className="input" placeholder={label} value={editForm[k]||""} onChange={e=>setEditForm({...editForm,[k]:e.target.value})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,width:"100%",outline:"none"}}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:t.text}}>Rekening Bank</div>
                <button className="btn" style={{padding:"5px 11px",fontSize:12,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={()=>setEditForm({...editForm,bankAccounts:[...(editForm.bankAccounts||[]),{id:uid(),bank:"BCA",number:"",name:editForm.name||""}]})}>
                  <Icon name="add" size={13} color={t.primary} sw={2}/>Tambah
                </button>
              </div>
              {(editForm.bankAccounts||[]).length===0&&<div style={{background:t.surface2,borderRadius:10,padding:16,textAlign:"center",marginBottom:14,fontSize:13,color:t.text3}}>Belum ada rekening</div>}
              {(editForm.bankAccounts||[]).map((ba,i)=>(
                <div key={ba.id} style={{background:t.surface2,borderRadius:12,overflow:"hidden",marginBottom:10,border:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${t.border}`,background:t.primaryBg}}>
                    <span style={{fontSize:12,fontWeight:700,color:t.primary}}>Rekening {i+1}</span>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:t.red,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:3}} onClick={()=>setEditForm({...editForm,bankAccounts:editForm.bankAccounts.filter(x=>x.id!==ba.id)})}>
                      <Icon name="x" size={12} color={t.red} sw={2}/>Hapus
                    </button>
                  </div>
                  <div style={{padding:"10px 14px",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>Bank</div>
                    <div style={{position:"relative"}}>
                      <select className="input" value={ba.bank} onChange={e=>setEditForm({...editForm,bankAccounts:editForm.bankAccounts.map(x=>x.id===ba.id?{...x,bank:e.target.value}:x)})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",outline:"none",cursor:"pointer",appearance:"none"}}>
                        {BANKS.map(b=><option key={b} value={b}>{b}</option>)}
                      </select>
                      <div style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={13} color={t.text3} sw={1.5}/></div>
                    </div>
                  </div>
                  <div style={{padding:"10px 14px",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>Nomor Rekening</div>
                    <input className="input" type="tel" placeholder="1234567890" value={ba.number} onChange={e=>setEditForm({...editForm,bankAccounts:editForm.bankAccounts.map(x=>x.id===ba.id?{...x,number:e.target.value}:x)})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",outline:"none",fontFamily:"JetBrains Mono,monospace"}}/>
                  </div>
                  <div style={{padding:"10px 14px"}}>
                    <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>Nama Pemilik</div>
                    <input className="input" placeholder="Nama di rekening" value={ba.name} onChange={e=>setEditForm({...editForm,bankAccounts:editForm.bankAccounts.map(x=>x.id===ba.id?{...x,name:e.target.value}:x)})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",outline:"none"}}/>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:6}}>
                <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setEditProfile(false)}>"Batal"</button>
                <button className="btn" style={{flex:1,background:t.primary,color:"white",fontWeight:700}} onClick={handleSaveProfile}>"Simpan"</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {payModal&&<PaymentModal payModal={payModal} accounts={accounts} meId={meId} t={t} payNote={payNote} setPayNote={setPayNote} payImg={payImg} setPayImg={setPayImg} payDNote={payDNote} setPayDNote={setPayDNote} showPayD={showPayD} setShowPayD={setShowPayD} payFullImg={payFullImg} setPayFullImg={setPayFullImg} payFileRef={payFileRef} handleSubmitProof={handleSubmitProof} handleVerify={handleVerify} handleDispute={handleDispute} showToast={showToast} setPayModal={setPayModal}/>}
      {/* INSTALLMENT MODAL */}
      {installModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>setInstallModal(null)}>
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:14,fontWeight:700,color:t.text,marginBottom:2}}>{installModal.note}</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:22,fontWeight:800,color:t.primary,marginBottom:6}}>{fmt(installModal.amount)}</div>
            <ProgressBar paid={installModal.paidAmount} total={installModal.amount} t={t}/>
            <div style={{fontSize:11,color:t.text3,marginTop:6,marginBottom:18}}>{installModal.installments.paid}/{installModal.installments.total} cicilan — {fmt(installModal.installments.amount)}/cicilan</div>
            {installModal.installments.schedule.map(s=>{
              const si=payStatusInfo(s.status,t);
              return (
                <div key={s.seq} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:s.status==="verified"?t.greenBg:t.surface2,border:`1px solid ${s.status==="verified"?t.greenBorder:t.border}`,borderRadius:10,marginBottom:8,cursor:"pointer"}} onClick={()=>{setInstallModal(null);setPayModal({debt:installModal,installSeq:s.seq});}}>
                  <div style={{width:30,height:30,borderRadius:8,background:s.status==="verified"?t.green:t.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:13,flexShrink:0}}>{s.seq}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:t.text}}>{fmt(installModal.installments.amount)}</div>
                    <div style={{fontSize:11,color:t.text3}}>Jatuh tempo {s.dueDate}</div>
                    {si&&<StatusBadge si={si} t={t}/>}
                  </div>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              );
            })}
            <button className="btn" style={{width:"100%",marginTop:4,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setInstallModal(null)}>"Tutup"</button>
          </div>
        </div>
      )}

      {/* REMINDER MODAL */}
      {reminderDebt&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}} onClick={()=>setReminderDebt(null)}>
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:380}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:4}}>Atur Reminder</div>
            <div style={{fontSize:12,color:t.text3,marginBottom:18}}>{getAcc(reminderDebt.fromAccId===meId?reminderDebt.toAccId:reminderDebt.fromAccId)?.name} — {fmt(reminderDebt.amount)}</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:8}}>Tanggal Jatuh Tempo</div>
              <input className="input" type="date" value={reminderDebt.dueDate||""} onChange={e=>setReminderDebt({...reminderDebt,dueDate:e.target.value})} style={{background:t.inputBg,color:t.text,border:`1px solid ${t.border}`}}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:t.text2,fontWeight:600,marginBottom:8}}>Ingatkan saya</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {REMINDER_OPT.map(r=>{
                  const active=(reminderDebt.reminders||[]).includes(r.v);
                  return <div key={r.v} style={{display:"inline-flex",alignItems:"center",padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${active?t.primary:t.border}`,background:active?t.primaryBg:"transparent",color:active?t.primary:t.text2}} onClick={()=>setReminderDebt({...reminderDebt,reminders:active?(reminderDebt.reminders||[]).filter(x=>x!==r.v):[...(reminderDebt.reminders||[]),r.v]})}>{active&&<Icon name="check" size={11} color={t.primary} sw={2.5}/>} {r.l}</div>;
                })}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setReminderDebt(null)}>"Batal"</button>
              <button className="btn" style={{flex:1,background:t.primary,color:"white"}} onClick={()=>handleSaveReminder(reminderDebt.id,reminderDebt.reminders||[],reminderDebt.dueDate)}>"Simpan"</button>
            </div>
          </div>
        </div>
      )}

      {/* GROUP DETAIL */}
      {splitDetail&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>{setSplitDetail(null);setProofPanel(null);setProofNote("");setProofImg(null);setShowPayDisputePanel(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 32px"}}>
              {(()=>{
                const s=splits.find(x=>x.id===splitDetail.id)||splitDetail;
                const iMPayer=s.payerId===meId;
                const totalPaid=s.members.reduce((sum,m)=>sum+(m.paid||0),0);
                return (
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${t.border}`}}>
                      <Icon name={CAT_ICON[getCat(s.category).id]||"receipt"} size={24} color={t.primary} sw={1.8}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:17,fontWeight:700,color:t.text}}>{s.title}</div>
                        <div style={{fontSize:12,color:t.text3}}>{getCat(s.category).label} · {s.date}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:700,color:t.primary}}>{fmt(s.totalAmount)}</div>
                        <div style={{fontSize:11,color:t.text3}}>{fmt(totalPaid)} terkumpul</div>
                      </div>
                    </div>
                    <ProgressBar paid={totalPaid} total={s.totalAmount} t={t}/>
                    {s.items.length>0&&(
                      <div style={{marginTop:12,background:t.surface2,borderRadius:10,padding:"10px 14px",marginBottom:4}}>
                        {s.items.map(item=>(
                          <div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`}}>
                            <span style={{fontSize:13,color:t.text}}>{item.name}</span>
                            <span style={{fontSize:13,fontWeight:600,color:t.text,fontFamily:"JetBrains Mono,monospace"}}>{fmt(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{background:t.primaryBg,border:`1px solid ${t.primaryBorder}`,borderRadius:10,padding:"10px 14px",marginTop:12,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                      <Icon name="crown" size={14} color={t.primary} sw={2}/>
                      <div style={{fontSize:13,color:t.primary,fontWeight:600}}>{iMPayer?"Kamu":accounts.find(a=>a.id===s.payerId)?.name} bayar duluan</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",margin:"16px 0 10px"}}>Anggota</div>
                    {s.members.map(m=>{
                      const acc=accounts.find(a=>a.id===m.accId);
                      const isMe=m.accId===meId;
                      const isPayer=m.accId===s.payerId;
                      const si=payStatusInfo(m.paymentStatus,t);
                      const showProof=proofPanel?.id===s.id&&proofPanel?.accId===m.accId;
                      return (
                        <div key={m.accId} style={{marginBottom:8}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:m.paymentStatus==="verified"?t.greenBg:isPayer?t.primaryBg:t.surface2,border:`1px solid ${m.paymentStatus==="verified"?t.greenBorder:isPayer?t.primaryBorder:t.border}`,borderRadius:12}}>
                            <Avatar account={acc} size={38}/>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600,color:t.text}}>{acc?.name} {isMe&&<span style={{fontSize:10,color:t.primary,fontWeight:700}}>(Kamu)</span>} {isPayer&&<span style={{fontSize:10,color:t.primary,fontWeight:700}}>• Bayar duluan</span>}</div>
                              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:t.text2}}>{fmt(m.share)}</div>
                              {si&&!isPayer&&<StatusBadge si={si} t={t}/>}
                            </div>
                            {!isPayer&&(
                              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                                {m.paymentStatus==="verified"&&<Icon name="check" size={20} color={t.green} sw={2}/>}
                                {isMe&&(!m.paymentStatus||m.paymentStatus==="unpaid"||m.paymentStatus==="disputed")&&<button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.primaryBg,color:t.primary,border:`1px solid ${t.primaryBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={()=>{setProofPanel({id:s.id,accId:m.accId});setProofNote("");setProofImg(null);setShowPayDisputePanel(false);}}><Icon name="creditcard" size={11} color={t.primary} sw={2}/>Bayar</button>}
                                {isMe&&m.paymentStatus==="paying"&&<div style={{fontSize:11,color:t.text2}}>Menunggu...</div>}
                                {iMPayer&&!isMe&&m.paymentStatus==="paying"&&<button className="btn" style={{padding:"5px 10px",fontSize:11,background:t.greenBg,color:t.green,border:`1px solid ${t.greenBorder}`,display:"flex",alignItems:"center",gap:4}} onClick={()=>{setProofPanel({id:s.id,accId:m.accId});setShowPayDisputePanel(false);}}><Icon name="verify" size={11} color={t.green} sw={2}/>Verif</button>}
                              </div>
                            )}
                          </div>
                          {showProof&&<MemberProofPanel gId={s.id} accId={m.accId} m={m} isMe={isMe} isMePayer={iMPayer} t={t} proofNote={proofNote} setProofNote={setProofNote} proofImg={proofImg} setProofImg={setProofImg} showPayDisputePanel={showPayDisputePanel} setShowPayDisputePanel={setShowPayDisputePanel} disputeText={disputeText} setDisputeText={setDisputeText} onSubmitProof={(pd)=>handleSubmitSplitProof(s.id,m.accId,pd)} onVerify={()=>handleVerifySplitMember(s.id,m.accId)} onDispute={(dn)=>handleDisputeSplitMember(s.id,m.accId,dn)} onClose={()=>{setProofPanel(null);setProofNote("");setProofImg(null);}}/>}
                        </div>
                      );
                    })}
                    <button className="btn" style={{width:"100%",marginTop:8,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>{setSplitDetail(null);setProofPanel(null);}}>"Tutup"</button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ADD DEBT MODAL */}
      {addDebtModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setAddDebtModal(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:12,background:addForm.type==="lend"?t.greenBg:t.redBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name={addForm.type==="lend"?"transfer":"creditcard"} size={22} color={addForm.type==="lend"?t.green:t.red} sw={1.8}/>
                    </div>
                    <div>
                      <div style={{fontSize:20,fontWeight:700,color:addForm.type==="lend"?t.green:t.red}}>{addForm.type==="lend"?"Catat Piutang":"Catat Hutang"}</div>
                      <div style={{fontSize:13,color:t.text3,marginTop:2}}>{addForm.type==="lend"?"Orang lain berhutang ke kamu":"Kamu berhutang ke orang lain"}</div>
                    </div>
                  </div>
                <button style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setAddDebtModal(false)}><Icon name="x" size={15} color={t.text2} sw={2}/></button>
              </div>

              <div style={{background:t.surface2,borderRadius:12,overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{addForm.type==="lend"?"Siapa yang berhutang":"Kamu berhutang kepada"}</div>
                  {connIds.length>0
                    ? <div style={{position:"relative"}}><select className="input" value={addForm.toAccId} onChange={e=>setAddForm({...addForm,toAccId:e.target.value})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",appearance:"none",cursor:"pointer",outline:"none"}}><option value="">Pilih koneksi...</option>{connIds.map(id=>{const a=getAcc(id);return <option key={id} value={id}>{a?.name}</option>;})}</select><div style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={14} color={t.text3} sw={1.5}/></div></div>
                    : <div style={{fontSize:13,color:t.primary,fontWeight:500,cursor:"pointer"}} onClick={()=>{setAddDebtModal(false);setView("profile");setAccountTab("discover");}}>Tambah koneksi dulu →</div>
                  }
                </div>
                <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Jumlah</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14,color:t.text3,fontWeight:500}}>Rp</span><input className="input" type="number" placeholder="0" value={addForm.amount} onChange={e=>setAddForm({...addForm,amount:e.target.value})} style={{background:"transparent",border:"none",padding:0,fontSize:20,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace",flex:1,outline:"none"}}/></div>
                </div>
                <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Keterangan</div>
                  <input className="input" placeholder="Untuk apa?" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",outline:"none"}}/>
                </div>
                <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Kategori</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {CATEGORIES.map(c=>{const active=addForm.category===c.id;return <div key={c.id} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${active?t.primary:t.border}`,background:active?t.primaryBg:"transparent",color:active?t.primary:t.text2}} onClick={()=>setAddForm({...addForm,category:c.id})}>{c.label}</div>;})}
                  </div>
                </div>
                <div style={{padding:"13px 16px"}}>
                  <div style={{fontSize:11,color:t.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Tanggal</div>
                  <input className="input" type="date" value={addForm.date} onChange={e=>setAddForm({...addForm,date:e.target.value})} style={{background:"transparent",border:"none",padding:0,fontSize:14,color:t.text,fontWeight:500,width:"100%",outline:"none"}}/>
                </div>
              </div>
              <div style={{background:t.surface2,borderRadius:12,overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"13px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:t.text}}>Jatuh Tempo</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>{addForm.dueDate||"Pilih tanggal"}</div></div>
                    <div style={{position:"relative"}}><input type="date" value={addForm.dueDate} onChange={e=>setAddForm({...addForm,dueDate:e.target.value})} style={{opacity:0,position:"absolute",right:0,width:44,height:44,cursor:"pointer"}}/><Icon name="chevron" size={14} color={t.text3} sw={1.5}/></div>
                  </div>
                </div>
                <div style={{padding:"13px 16px",borderBottom:addForm.isInstallment?`1px solid ${t.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:t.text}}>Cicilan</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>Bayar bertahap</div></div>
                    <Toggle value={addForm.isInstallment} onChange={v=>setAddForm({...addForm,isInstallment:v})} t={t}/>
                  </div>
                </div>
                {addForm.isInstallment&&(
                  <div style={{padding:"13px 16px",display:"flex",gap:12,borderBottom:`1px solid ${t.border}`}}>
                    <div style={{flex:1}}><div style={{fontSize:11,color:t.text3,marginBottom:6}}>Jumlah cicilan</div><select className="input" value={addForm.installTotal} onChange={e=>setAddForm({...addForm,installTotal:e.target.value})} style={{background:t.surface,color:t.text,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 10px",fontSize:13}}>{[2,3,4,5,6,12].map(n=><option key={n} value={n}>{n}x</option>)}</select></div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:t.text3,marginBottom:6}}>Per cicilan (Rp)</div><input className="input" type="number" placeholder={addForm.amount?Math.round(parseInt(addForm.amount||0)/parseInt(addForm.installTotal)):""} value={addForm.installAmount} onChange={e=>setAddForm({...addForm,installAmount:e.target.value})} style={{background:t.surface,color:t.text,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 10px",fontSize:13}}/></div>
                  </div>
                )}
                <div style={{padding:"13px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Icon name="bell" size={14} color={t.text2} sw={1.8}/><div style={{fontSize:13,fontWeight:600,color:t.text}}>Reminder</div></div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {REMINDER_OPT.map(r=>{const active=addForm.reminders.includes(r.v);return <div key={r.v} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:6,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${active?t.primary:t.border}`,background:active?t.primaryBg:"transparent",color:active?t.primary:t.text2}} onClick={()=>toggleAddReminder(r.v)}>{active&&<Icon name="check" size={10} color={t.primary} sw={2.5}/>}{r.l}</div>;})}
                  </div>
                </div>
              </div>
              {addForm.toAccId&&isConn(meId,addForm.toAccId)&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:t.greenBg,border:`1px solid ${t.greenBorder}`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:t.green}}>Catatan Bersama</div><div style={{fontSize:11,color:t.text3,marginTop:1}}>Pihak lain bisa verifikasi</div></div>
                  <Toggle value={addForm.shared} onChange={v=>setAddForm({...addForm,shared:v})} t={t}/>
                </div>
              )}
              <button className="btn" style={{width:"100%",padding:14,background:addForm.type==="lend"?t.green:t.red,color:"white",fontSize:15,fontWeight:700,borderRadius:12}} onClick={handleAddDebt}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD GROUP MODAL */}

      {/* CREATE SPLIT MODAL */}
      {createSplit&&<CreateSplitModal createSplit={createSplit} connIds={connIds} accounts={accounts} meId={meId} t={t} handleAddSplit={handleAddSplit} setCreateSplit={setCreateSplit} showToast={showToast}/>}
      {/* ONBOARDING */}
      {showOnboarding&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",background:"#ffffff"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"56px 28px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M6 6 L6 26 L16 26 L16 22 L10 22 L10 6 Z" fill="#16a34a"/><path d="M13 2 L13 22 L23 22 L23 18 L17 18 L17 2 Z" fill="#dc2626"/></svg>
              <span style={{fontSize:16,fontWeight:700,color:"#111111",letterSpacing:"0.04em"}}>LUNASY</span>
            </div>
            <button style={{background:"#f5f5f5",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,color:"#888888",cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>setShowOnboarding(false)}>{"Lewati"}</button>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 28px"}}>
            {onboardStep===0&&(
              <div style={{textAlign:"center"}}>
                <div style={{marginBottom:32}}><svg width="120" height="120" viewBox="0 0 32 32" fill="none" style={{filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.4))"}}>
                  <path d="M6 6 L6 26 L16 26 L16 22 L10 22 L10 6 Z" fill="#4ade80"/>
                  <path d="M13 2 L13 22 L23 22 L23 18 L17 18 L17 2 Z" fill="#f87171"/>
                </svg></div>
                <div style={{fontSize:32,fontWeight:800,color:"#111111",marginBottom:14,letterSpacing:"-0.02em",lineHeight:1.1}}>Catat, Bayar, Lunasy.</div>
                <div style={{fontSize:16,color:"#666666",lineHeight:1.7,maxWidth:280,margin:"0 auto"}}>Pencatat hutang P2P pertama dengan verifikasi dua pihak. Tidak ada lagi sengketa soal pembayaran.</div>
              </div>
            )}
            {onboardStep===1&&(
              <div style={{textAlign:"center"}}>
                <div style={{width:100,height:100,borderRadius:28,background:"#f0fdf4",border:"1px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px"}}><Icon name="verify" size={48} color="#16a34a" sw={1.4}/></div>
                <div style={{fontSize:30,fontWeight:800,color:"#111111",marginBottom:14,letterSpacing:"-0.02em",lineHeight:1.1}}>Verifikasi Dua Pihak</div>
                <div style={{fontSize:16,color:"#666666",lineHeight:1.7,maxWidth:280,margin:"0 auto 32px"}}>Yang bayar upload bukti transfer. Yang menerima konfirmasi. Semua transparan.</div>
                <div style={{display:"flex",gap:0,background:"#f5f5f5",borderRadius:16,overflow:"hidden",border:"1px solid #e8e8e8",maxWidth:300,margin:"0 auto"}}>
                  {[{icon:"creditcard",label:"Upload bukti",sub:"Foto transfer"},{icon:"check",label:"Konfirmasi",sub:"Pihak penerima"},{icon:"verify",label:"Lunas",sub:"Tercatat rapi"}].map((item,i,arr)=>(
                    <div key={item.label} style={{flex:1,padding:"14px 8px",textAlign:"center",borderRight:i<arr.length-1?"1px solid #e8e8e8":"none"}}>
                      <Icon name={item.icon} size={20} color="#16a34a" sw={1.8}/>
                      <div style={{fontSize:11,fontWeight:600,color:"#111111",marginTop:6}}>{item.label}</div>
                      <div style={{fontSize:10,color:"#888888",marginTop:2}}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {onboardStep===2&&(
              <div style={{textAlign:"center"}}>
                <div style={{width:100,height:100,borderRadius:28,background:"#f0fdf4",border:"1px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px"}}><Icon name="scan" size={48} color="#16a34a" sw={1.4}/></div>
                <div style={{fontSize:30,fontWeight:800,color:"#111111",marginBottom:14,letterSpacing:"-0.02em",lineHeight:1.1}}>Split Bill dengan AI</div>
                <div style={{fontSize:16,color:"#666666",lineHeight:1.7,maxWidth:280,margin:"0 auto 32px"}}>Foto struk restoran, AI baca semua item secara otomatis. Bagi rata atau custom ke semua orang.</div>
                <div style={{background:"#f5f5f5",borderRadius:16,padding:"16px 20px",border:"1px solid #e8e8e8",maxWidth:300,margin:"0 auto",textAlign:"left"}}>
                  {[["1","Foto struk","AI ekstrak item"],["2","Pilih anggota","Dari koneksimu"],["3","Split & kirim","Verifikasi per orang"]].map(([n,a,b])=>(
                    <div key={n} style={{display:"flex",alignItems:"center",gap:12,marginBottom:n<"3"?12:0}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:"#16a34a",color:"white",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div>
                      <div><div style={{fontSize:13,fontWeight:600,color:"#111111"}}>{a}</div><div style={{fontSize:11,color:"#888888",marginTop:1}}>{b}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{padding:"0 28px 52px"}}>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:28}}>
              {[0,1,2].map(i=><div key={i} style={{height:4,borderRadius:2,background:i===onboardStep?t.primary:"#e8e8e8",width:i===onboardStep?28:8,transition:"all 0.3s"}}/>)}
            </div>
            <div style={{display:"flex",gap:10}}>
              {onboardStep>0&&<button className="btn" style={{flex:1,background:"#f5f5f5",color:"#666666",border:"1px solid #e8e8e8",fontSize:14}} onClick={()=>setOnboardStep(s=>s-1)}>"Kembali"</button>}
              <button className="btn" style={{flex:2,background:t.primary,color:"white",fontSize:15,fontWeight:700,borderRadius:12,padding:14}} onClick={()=>{if(onboardStep<2)setOnboardStep(s=>s+1);else setShowOnboarding(false);}}>
                {onboardStep<2?"Lanjut →":"Mulai Lunasy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION PANEL */}
      {showNotifPanel&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowNotifPanel(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"75vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"14px 20px 28px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Notifikasi</div>
                {notifList.length>0&&<button style={{background:"none",border:"none",fontSize:12,color:t.text3,cursor:"pointer"}} onClick={()=>setNotifList([])}>Hapus semua</button>}
              </div>
              {notifList.length===0&&<div style={{textAlign:"center",padding:"32px 0"}}><Icon name="bell" size={28} color={t.text3} sw={1.4}/><div style={{fontSize:14,color:t.text3,marginTop:8}}>Belum ada notifikasi</div></div>}
              {notifList.map((n,i)=>(
                <div key={n.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:i<notifList.length-1?`1px solid ${t.border}`:"none",opacity:n.read?0.65:1}}>
                  <div style={{width:36,height:36,borderRadius:10,background:n.type==="verified"?t.greenBg:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={n.icon} size={16} color={n.type==="verified"?t.green:t.primary} sw={2}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:n.read?500:700,color:t.text}}>{n.title}</div>
                    <div style={{fontSize:12,color:t.text3,marginTop:2}}>{n.body}</div>
                    <div style={{fontSize:10,color:t.text3,marginTop:4}}>{n.time}</div>
                  </div>
                  {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:t.primary,flexShrink:0,marginTop:6}}/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* NOTIFICATION SETTINGS */}
      {showNotifSettings&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowNotifSettings(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="bell" size={20} color={t.primary} sw={1.8}/></div>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>Notifikasi</div><div style={{fontSize:12,color:t.text3,marginTop:1}}>Atur pengingat dan alert</div></div>
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Pengingat Hutang</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                {[
                  {key:"dueSoon",label:"Jatuh tempo segera",sub:"Ingatkan 3 hari sebelum"},
                  {key:"dueToday",label:"Jatuh tempo hari ini",sub:"Ingatkan di hari H"},
                  {key:"overdue",label:"Hutang terlambat",sub:"Ingatkan setelah jatuh tempo"},
                ].map((item,i,arr)=>(
                  <div key={item.key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:t.text}}>{item.label}</div>
                      <div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div>
                    </div>
                    <Toggle value={notifSettings[item.key]} onChange={v=>setNotifSettings({...notifSettings,[item.key]:v})} t={t}/>
                  </div>
                ))}
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Aktivitas</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                {[
                  {key:"paymentReceived",label:"Bukti bayar diterima",sub:"Saat ada yang upload bukti"},
                  {key:"paymentConfirmed",label:"Pembayaran dikonfirmasi",sub:"Saat hutang dikonfirmasi lunas"},
                  {key:"newConnection",label:"Koneksi baru",sub:"Saat ada yang ingin terhubung"},
                  {key:"splitBill",label:"Split bill baru",sub:"Saat ditambahkan ke split bill"},
                ].map((item,i,arr)=>(
                  <div key={item.key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:t.text}}>{item.label}</div>
                      <div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div>
                    </div>
                    <Toggle value={notifSettings[item.key]} onChange={v=>setNotifSettings({...notifSettings,[item.key]:v})} t={t}/>
                  </div>
                ))}
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Suara & Getar</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                {[
                  {key:"sound",label:"Suara notifikasi",sub:"Mainkan suara saat ada notif"},
                  {key:"vibrate",label:"Getar",sub:"Getar saat ada notif"},
                ].map((item,i,arr)=>(
                  <div key={item.key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,color:t.text}}>{item.label}</div>
                      <div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div>
                    </div>
                    <Toggle value={notifSettings[item.key]} onChange={v=>setNotifSettings({...notifSettings,[item.key]:v})} t={t}/>
                  </div>
                ))}
              </div>

              <button className="btn" style={{width:"100%",background:t.primary,color:"white",fontSize:15,fontWeight:700,padding:14,borderRadius:12}} onClick={()=>{setShowNotifSettings(false);showToast("Pengaturan notifikasi disimpan");}}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* PREFERENCES SETTINGS */}
      {showPreferences&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={()=>setShowPreferences(false)}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${t.border}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="settings" size={20} color={t.primary} sw={1.8}/></div>
                <div><div style={{fontSize:18,fontWeight:700,color:t.text}}>Preferensi</div><div style={{fontSize:12,color:t.text3,marginTop:1}}>Atur tampilan dan perilaku app</div></div>
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Tampilan</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:14,fontWeight:500,color:t.text}}>Tema</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Pilih tampilan app</div></div>
                    <div style={{display:"flex",gap:6}}>
                      {[["light","☀️ Terang"],["dark","🌙 Gelap"],["system","📱 Sistem"]].map(([v,l])=>(
                        <button key={v} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${prefSettings.theme===v?t.primary:t.border}`,background:prefSettings.theme===v?t.primaryBg:"transparent",color:prefSettings.theme===v?t.primary:t.text3,fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}} onClick={()=>{setPrefSettings({...prefSettings,theme:v});if(v==="light")setDark(false);else if(v==="dark")setDark(true);}}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Tampilan Ringkas</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Kecilkan ukuran kartu hutang</div></div>
                  <Toggle value={prefSettings.compactView} onChange={v=>setPrefSettings({...prefSettings,compactView:v})} t={t}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Sembunyikan Saldo</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Sembunyikan angka di balance card</div></div>
                  <Toggle value={!prefSettings.showBalance} onChange={v=>setPrefSettings({...prefSettings,showBalance:!v})} t={t}/>
                </div>
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Default Catatan</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:14,fontWeight:500,color:t.text}}>Jatuh Tempo Default</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Hari setelah tanggal catatan</div></div>
                    <div style={{display:"flex",gap:6}}>
                      {[7,14,30].map(d=>(
                        <button key={d} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${prefSettings.defaultDuedays===d?t.primary:t.border}`,background:prefSettings.defaultDuedays===d?t.primaryBg:"transparent",color:prefSettings.defaultDuedays===d?t.primary:t.text3,fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}} onClick={()=>setPrefSettings({...prefSettings,defaultDuedays:d})}>{d}h</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:14,fontWeight:500,color:t.text}}>Format Tanggal</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Tampilan tanggal di app</div></div>
                    <div style={{display:"flex",gap:6}}>
                      {[["DD/MM/YYYY","DD/MM"],["MM/DD/YYYY","MM/DD"],["YYYY-MM-DD","ISO"]].map(([v,l])=>(
                        <button key={v} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${prefSettings.dateFormat===v?t.primary:t.border}`,background:prefSettings.dateFormat===v?t.primaryBg:"transparent",color:prefSettings.dateFormat===v?t.primary:t.text3,fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",cursor:"pointer"}} onClick={()=>setPrefSettings({...prefSettings,dateFormat:v})}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:14,fontWeight:500,color:t.text}}>Kategori Default</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Saat buat catatan baru</div></div>
                    <div style={{position:"relative"}}>
                      <select value={prefSettings.defaultCategory} onChange={e=>setPrefSettings({...prefSettings,defaultCategory:e.target.value})} style={{appearance:"none",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,padding:"6px 28px 6px 10px",fontSize:12,color:t.text,fontFamily:"Inter,sans-serif",cursor:"pointer",outline:"none"}}>
                        {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={12} color={t.text3} sw={1.5}/></div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Lanjutan</div>
              <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500,color:t.text}}>Auto-verifikasi</div><div style={{fontSize:12,color:t.text3,marginTop:2}}>Konfirmasi otomatis setelah 24 jam</div></div>
                  <Toggle value={prefSettings.autoVerify} onChange={v=>setPrefSettings({...prefSettings,autoVerify:v})} t={t}/>
                </div>
              </div>

              <button className="btn" style={{width:"100%",background:t.primary,color:"white",fontSize:15,fontWeight:700,padding:14,borderRadius:12}} onClick={()=>{setShowPreferences(false);showToast("Preferensi disimpan");}}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:24}}>
          <div style={{background:t.surface,borderRadius:16,padding:24,width:"100%",maxWidth:340,boxShadow:"0 20px 50px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:17,fontWeight:700,color:t.text,marginBottom:8}}>{confirmDialog.title}</div>
            <div style={{fontSize:14,color:t.text2,lineHeight:1.6,marginBottom:22}}>{confirmDialog.msg}</div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn" style={{flex:1,background:t.surface2,color:t.text2,border:`1px solid ${t.border}`}} onClick={()=>setConfirmDialog(null)}>"Batal"</button>
              <button className="btn" style={{flex:1,background:t.red,color:"white",fontWeight:700}} onClick={()=>{confirmDialog.onConfirm();setConfirmDialog(null);}}>"Ya, Lanjutkan"</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",padding:"9px 18px",borderRadius:8,fontSize:13,fontWeight:600,zIndex:200,whiteSpace:"nowrap",animation:"toastIn 0.25s ease",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",background:toast.type==="error"?t.redBg:t.greenBg,color:toast.type==="error"?t.red:t.green,border:`1px solid ${toast.type==="error"?t.redBorder:t.greenBorder}`}}>{toast.msg}</div>}
    </div>
  );
}
