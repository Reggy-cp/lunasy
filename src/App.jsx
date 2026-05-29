/* eslint-disable */
import {useState,useMemo,useRef} from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────
const todayStr=()=>new Date().toISOString().split("T")[0];
const addDays=(s,n)=>{const d=new Date(s);d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];};
const fmt=(n)=>"Rp"+n.toLocaleString("id-ID");
const diffDays=(s)=>{const n=new Date();n.setHours(0,0,0,0);const d=new Date(s);d.setHours(0,0,0,0);return Math.round((d-n)/86400000);};
const uid=()=>Math.random().toString(36).slice(2,10);
const nowTime=()=>new Date().toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const safeGet=(obj,key,def)=>{if(!obj)return def===undefined?null:def;return obj[key]===undefined?(def===undefined?null:def):obj[key];};
const safeName=(acc)=>acc?acc.name:"Unknown";
const safeArr=(v)=>Array.isArray(v)?v:[];

// ── Theme ────────────────────────────────────────────────────────────────────
const T={
  light:{bg:"#f8fafc",surface:"#ffffff",surface2:"#f1f5f9",border:"#e2e8f0",text:"#0f172a",text2:"#64748b",text3:"#94a3b8",primary:"#29c36a",primaryBg:"#f0fdf4",primaryBorder:"#bbf7d0",modalBg:"rgba(0,0,0,0.4)",green:"#29c36a",greenBg:"#f0fdf4",greenBorder:"#bbf7d0",red:"#dc2626",redBg:"#fef2f2",redBorder:"#fecaca",amber:"#f59e0b"},
  dark:{bg:"#0d0d0d",surface:"#1a1a1a",surface2:"#111111",border:"#2a2a2a",text:"#f0f0f0",text2:"#888888",text3:"#555555",primary:"#29c36a",primaryBg:"#0d2818",primaryBorder:"#1a4731",modalBg:"rgba(0,0,0,0.75)",green:"#29c36a",greenBg:"#0d1f0f",greenBorder:"#1a3320",red:"#ef4444",redBg:"#1f0d0d",redBorder:"#3d1a1a",amber:"#f59e0b"},
};

const CATEGORIES=[
  {id:"food",label:"Food"},{id:"transport",label:"Transport"},
  {id:"shopping",label:"Shopping"},{id:"hiburan",label:"Entertainment"},
  {id:"tagihan",label:"Bills"},{id:"lainnya",label:"Others"},
];

// ── Seed Data ────────────────────────────────────────────────────────────────
const ACCOUNTS=[
  {id:"acc_reggy",name:"Reggy Caesar Putra",username:"reggy.caesar",phone:"081234567890",bio:"Developer & coffee addict",avatar:"RC",bankAccounts:[{id:"ba1",bank:"BCA",number:"1234567890",name:"Reggy Caesar Putra"},{id:"ba2",bank:"GoPay",number:"081234567890",name:"Reggy Caesar Putra"}]},
  {id:"acc_budi", name:"Budi Santoso",username:"budi.santoso",phone:"082345678901",bio:"Finance guy",avatar:"BS",bankAccounts:[{id:"ba3",bank:"Mandiri",number:"9876543210",name:"Budi Santoso"}]},
  {id:"acc_andi", name:"Andi Pratama",username:"andi.p",phone:"083456789012",bio:"Selalu bayar on time",avatar:"AP",bankAccounts:[{id:"ba4",bank:"BNI",number:"1122334455",name:"Andi Pratama"}]},
  {id:"acc_siti", name:"Siti Rahayu",username:"siti.r",phone:"084567890123",bio:"Traveler",avatar:"SR",bankAccounts:[{id:"ba5",bank:"Dana",number:"084567890123",name:"Siti Rahayu"}]},
  {id:"acc_doni", name:"Doni Kurniawan",username:"doni.k",phone:"085678901234",bio:"",avatar:"DK",bankAccounts:[]},
];
const CONNECTIONS=[
  {id:"con1",fromId:"acc_reggy",toId:"acc_budi",status:"accepted"},
  {id:"con2",fromId:"acc_andi",toId:"acc_reggy",status:"accepted"},
  {id:"con3",fromId:"acc_siti",toId:"acc_reggy",status:"pending"},
  {id:"con4",fromId:"acc_reggy",toId:"acc_doni",status:"pending"},
];
const DEBTS=[
  {id:"d1",type:"regular",fromAccId:"acc_reggy",toAccId:"acc_budi",amount:150000,paidAmount:0,note:"Makan siang bareng",date:"2026-05-10",dueDate:addDays(todayStr(),2),status:"unpaid",category:"food",payment:null,installments:null},
  {id:"d2",type:"regular",fromAccId:"acc_andi",toAccId:"acc_reggy",amount:200000,paidAmount:0,note:"Patungan bensin",date:"2026-05-12",dueDate:addDays(todayStr(),-1),status:"paying",category:"transport",payment:{payerNote:"Sudah transfer via BCA",proofImage:null,submittedAt:"18 Mei 2026, 09:30",verifiedAt:null,disputeNote:null},installments:null},
  {id:"d3",type:"regular",fromAccId:"acc_reggy",toAccId:"acc_siti",amount:75000,paidAmount:75000,note:"Kopi & snack",date:"2026-05-15",dueDate:addDays(todayStr(),7),status:"verified",category:"food",payment:{payerNote:"Cash",proofImage:null,submittedAt:"16 Mei",verifiedAt:"16 Mei",disputeNote:null},installments:null},
  {id:"d4",type:"regular",fromAccId:"acc_budi",toAccId:"acc_reggy",amount:320000,paidAmount:0,note:"Tiket konser",date:"2026-05-01",dueDate:todayStr(),status:"unpaid",category:"hiburan",payment:null,installments:null},
];
const SPLITS=[
  {id:"sb1",title:"Makan Malam Sate Senayan",category:"food",date:"2026-05-17",totalAmount:385000,payerId:"acc_reggy",members:[
    {accId:"acc_reggy",share:120000,paid:120000,paymentStatus:"verified",payment:null},
    {accId:"acc_budi",share:95000,paid:0,paymentStatus:"paying",payment:{payerNote:"Transfer GoPay",proofImage:null,submittedAt:"18 Mei",verifiedAt:null,disputeNote:null}},
    {accId:"acc_andi",share:85000,paid:0,paymentStatus:"unpaid",payment:null},
    {accId:"acc_siti",share:85000,paid:0,paymentStatus:"unpaid",payment:null},
  ]},
];

// ── Icon Component ───────────────────────────────────────────────────────────
function Icon(props){
  var name=props.name,size=props.size||18,color=props.color||"currentColor",sw=props.sw||1.7;
  var st={width:size,height:size,display:"inline-block",flexShrink:0,verticalAlign:"middle"};
  var p="fill:none;stroke:"+color+";stroke-width:"+sw+";stroke-linecap:round;stroke-linejoin:round";
  if(name==="home")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if(name==="person")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  if(name==="bell")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
  if(name==="check")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  if(name==="x")        return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  if(name==="chevron")  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
  if(name==="upload")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>;
  if(name==="crown")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 20l-2-9 7 4 5-8 5 8 7-4-2 9"/></svg>;
  if(name==="lock")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  if(name==="people")   return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
  if(name==="settings") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
  if(name==="transfer") return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
  if(name==="receipt")  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
  if(name==="split")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 00-1.172-2.872L3 3"/><path d="M21 3l-7.828 7.828"/></svg>;
  if(name==="star")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  if(name==="more")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
  if(name==="chart")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>;
  if(name==="alert")    return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  if(name==="creditcard")return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
  if(name==="link")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
  if(name==="scan")     return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>;
  return <svg style={st} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}><circle cx="12" cy="12" r="10"/></svg>;
}

// ── LunasyLogo ───────────────────────────────────────────────────────────────
function LunasyLogo(props){
  var size=props.size||32;
  return (
    <svg width={size} height={size} viewBox="0 0 120 100" fill="none">
      <defs>
        <linearGradient id="llg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#29c36a"/>
          <stop offset="100%" stopColor="#a8e63e"/>
        </linearGradient>
        <linearGradient id="llg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5dd45a"/>
          <stop offset="100%" stopColor="#c8e83e"/>
        </linearGradient>
      </defs>
      {/* Left L - vertical bar */}
      <rect x="8" y="8" width="18" height="72" rx="9" fill="url(#llg1)"/>
      {/* Left L - horizontal bar */}
      <rect x="8" y="62" width="48" height="18" rx="9" fill="url(#llg1)"/>
      {/* Right L - vertical bar (shorter, offset) */}
      <rect x="44" y="24" width="16" height="56" rx="8" fill="url(#llg2)"/>
      {/* Right L - horizontal bar */}
      <rect x="44" y="62" width="40" height="16" rx="8" fill="url(#llg2)"/>
    </svg>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar(props){
  var account=props.account,size=props.size||38;
  var initials=account?account.avatar:"?";
  return (
    <div style={{width:size,height:size,borderRadius:size*0.28,background:"#f0fdf4",border:"1.5px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.33,color:"#29c36a",flexShrink:0,fontFamily:"Inter,sans-serif"}}>
      {initials}
    </div>
  );
}

// ── Onboarding ───────────────────────────────────────────────────────────────
function Onboarding(props){
  var onDone=props.onDone;
  var [step,setStep]=useState(0);

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,overflow:"hidden",fontFamily:"Inter,sans-serif"}}>

      {/* ── SLIDE 1: Two-Party Verification (white) ── */}
      {step===0&&(
        <div style={{height:"100%",background:"#ffffff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"52px 24px 0",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <LunasyLogo size={28}/>
              <span style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>Lunasy</span>
            </div>
            <button style={{background:"transparent",border:"none",color:"#94a3b8",fontSize:14,cursor:"pointer"}} onClick={onDone}>Skip</button>
          </div>
          <div style={{padding:"20px 28px 0",flexShrink:0}}>
            <div style={{fontSize:34,fontWeight:800,color:"#0f172a",lineHeight:1.15,marginBottom:10}}>Two-Party<br/>Verification</div>
            <div style={{fontSize:14,color:"#64748b",lineHeight:1.55}}>Every payment needs confirmation from both parties.</div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",overflow:"hidden"}}>
            {/* Two avatars with shield */}
            <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#d1fae5,#a7f3d0)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 6px 20px rgba(0,0,0,0.1)",zIndex:2}}>
                <svg width="44" height="44" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="21" r="10" fill="#f97316"/>
                  <rect x="14" y="36" width="32" height="20" rx="10" fill="#15803d"/>
                </svg>
              </div>
              <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 4px 16px rgba(41,195,106,0.4)",zIndex:3,margin:"0 -6px"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#fce7f3,#fbcfe8)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 6px 20px rgba(0,0,0,0.1)",zIndex:2}}>
                <svg width="44" height="44" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="21" r="10" fill="#f9a8d4"/>
                  <rect x="14" y="36" width="32" height="20" rx="10" fill="#d1d5db"/>
                </svg>
              </div>
            </div>
            {/* Payment card */}
            <div style={{background:"white",borderRadius:14,padding:"14px 18px",boxShadow:"0 6px 24px rgba(0,0,0,0.09)",border:"1px solid #f0f0f0",width:"100%",maxWidth:260}}>
              <div style={{fontSize:11,color:"#9ca3af",marginBottom:3}}>Payment Request</div>
              <div style={{fontSize:20,fontWeight:800,color:"#0f172a",marginBottom:8,fontFamily:"JetBrains Mono,monospace"}}>Rp200.000</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fff7ed",borderRadius:20,padding:"4px 10px"}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style={{fontSize:11,color:"#f97316",fontWeight:600}}>Awaiting confirmation</span>
              </div>
            </div>
          </div>
          {/* Feature badges */}
          <div style={{display:"flex",justifyContent:"center",gap:20,padding:"10px 0 8px",flexShrink:0}}>
            {["Secure","Transparent","Trusted"].map(function(f){return(
              <div key={f} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:34,height:34,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="check" size={15} color="#29c36a" sw={2}/>
                </div>
                <span style={{fontSize:10,color:"#64748b",fontWeight:500}}>{f}</span>
              </div>
            );})}
          </div>
          <div style={{padding:"10px 24px 44px",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
              {[0,1,2].map(function(_,i){return <div key={i} style={{width:i===0?28:8,height:8,borderRadius:4,background:i===0?"#29c36a":"#e2e8f0",transition:"all 0.3s"}}/>;}) }
            </div>
            <button style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#29c36a,#20a855)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={function(){setStep(1);}}>
              Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── SLIDE 2: AI-Powered Split Bill (lavender) ── */}
      {step===1&&(
        <div style={{height:"100%",background:"#f5f3ff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"52px 24px 0",flexShrink:0}}>
            <button style={{background:"transparent",border:"none",color:"#94a3b8",fontSize:14,cursor:"pointer"}} onClick={onDone}>Skip</button>
          </div>
          <div style={{textAlign:"center",padding:"10px 24px 0",flexShrink:0}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"white",borderRadius:20,padding:"5px 14px",border:"1.5px solid #e9d5ff",marginBottom:12}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>
              <span style={{fontSize:11,fontWeight:700,color:"#7c3aed",letterSpacing:"0.06em"}}>AI POWERED</span>
            </div>
            <div style={{fontSize:30,fontWeight:800,lineHeight:1.15,marginBottom:8}}>
              <span style={{color:"#16a34a"}}>AI-Powered</span><br/>
              <span style={{color:"#0f172a"}}>Split Bill</span>
            </div>
            <div style={{fontSize:13,color:"#64748b",lineHeight:1.5,marginBottom:12}}>Scan receipts with AI, decide who pays what, and track all payments in real-time.</div>
          </div>
          <div style={{flex:1,overflow:"hidden",padding:"0 20px",display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
            {/* Receipt card */}
            <div style={{background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 8px 28px rgba(124,58,237,0.12)"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0f172a",textAlign:"center",marginBottom:8}}>Café Lunasy</div>
              {[["2x Latte","Rp60.000"],["1x Sandwich","Rp45.000"],["1x Cake","Rp35.000"]].map(function(row){return(
                <div key={row[0]} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:"#6b7280"}}>{row[0]}</span>
                  <span style={{fontSize:12,color:"#374151",fontWeight:500,fontFamily:"JetBrains Mono,monospace"}}>{row[1]}</span>
                </div>
              );})}
              <div style={{borderTop:"1px solid #f3f4f6",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Total</span>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a",fontFamily:"JetBrains Mono,monospace"}}>Rp140.000</span>
              </div>
            </div>
            {/* Split suggestion */}
            <div style={{background:"white",borderRadius:16,padding:"12px 16px",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Split suggestion</span>
                <span style={{fontSize:11,color:"#9ca3af"}}>3 people</span>
              </div>
              {[{name:"You",amt:"Rp46.667"},{name:"Andi Pratama",amt:"Rp46.667"},{name:"Budi Santoso",amt:"Rp46.666"}].map(function(m){return(
                <div key={m.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#16a34a"}}>{m.name[0]}</span>
                  </div>
                  <span style={{flex:1,fontSize:13,color:"#374151"}}>{m.name}</span>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:"JetBrains Mono,monospace",color:"#374151",marginRight:8}}>{m.amt}</span>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              );})}
            </div>
          </div>
          <div style={{padding:"12px 24px 44px",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
              {[0,1,2].map(function(_,i){return <div key={i} style={{width:i===1?28:8,height:8,borderRadius:4,background:i===1?"#29c36a":"#e2e8f0",transition:"all 0.3s"}}/>;}) }
            </div>
            <button style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#29c36a,#20a855)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={function(){setStep(2);}}>
              Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── SLIDE 3: Track Pay Lunasy (dark green) ── */}
      {step===2&&(
        <div style={{height:"100%",background:"linear-gradient(160deg,#052e16 0%,#0f4023 40%,#166534 100%)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",padding:"56px 28px 0",overflow:"hidden"}}>
            <div style={{fontSize:38,fontWeight:800,lineHeight:1.1,marginBottom:10,flexShrink:0}}>
              <span style={{color:"white"}}>Track, Pay,</span><br/>
              <span style={{color:"#4ade80"}}>Lunasy.</span>
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.55,marginBottom:16,flexShrink:0}}>Manage debts easily. Everything recorded, transparent, and settled.</div>
            {/* App mockup + floating cards side by side */}
            <div style={{flex:1,position:"relative",overflow:"hidden"}}>
              {/* Main app card */}
              <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(12px)",borderRadius:16,padding:"12px",border:"1px solid rgba(255,255,255,0.15)",width:"65%",boxShadow:"0 12px 32px rgba(0,0,0,0.3)"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <LunasyLogo size={16}/>
                  <span style={{fontSize:11,fontWeight:700,color:"white"}}>Lunasy</span>
                </div>
                <div style={{fontSize:7,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>Net Balance</div>
                <div style={{fontSize:18,fontWeight:800,color:"white",fontFamily:"JetBrains Mono,monospace",marginBottom:5}}>-Rp30.000</div>
                <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"3px 8px",marginBottom:8}}>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.8)"}}>You owe more</span>
                </div>
                <div style={{display:"flex",gap:0,borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:6,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:1}}>You will receive</div>
                    <div style={{fontSize:9,fontWeight:700,color:"#4ade80",fontFamily:"JetBrains Mono,monospace"}}>Rp520.000</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:6,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:1}}>You owe</div>
                    <div style={{fontSize:9,fontWeight:700,color:"white",fontFamily:"JetBrains Mono,monospace"}}>Rp550.000</div>
                  </div>
                </div>
              </div>
              {/* Floating debt cards */}
              <div style={{position:"absolute",top:0,right:0,display:"flex",flexDirection:"column",gap:6,width:"48%"}}>
                {[{name:"Andi Pratama",cat:"Transport",amt:"+Rp200.000",color:"#4ade80"},{name:"Budi Santoso",cat:"Hiburan",amt:"+Rp320.000",color:"#4ade80"},{name:"Budi Santoso",cat:"Food",amt:"-Rp150.000",color:"#f87171"}].map(function(c,i){return(
                  <div key={i} style={{background:"white",borderRadius:10,padding:"8px 10px",boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}}>
                    <div style={{fontSize:8,color:"#9ca3af",marginBottom:2}}>{c.cat}</div>
                    <div style={{fontSize:10,fontWeight:600,color:"#374151"}}>{c.name}</div>
                    <div style={{fontSize:11,fontWeight:800,color:c.color,fontFamily:"JetBrains Mono,monospace"}}>{c.amt}</div>
                  </div>
                );})}
              </div>
              {/* Security badge */}
              <div style={{position:"absolute",bottom:8,left:0,right:0,background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",gap:8}}>
                <Icon name="lock" size={13} color="#4ade80" sw={2}/>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.85)"}}>Your data is secure and always protected.</span>
              </div>
            </div>
          </div>
          <div style={{padding:"16px 24px 44px",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
              {[0,1,2].map(function(_,i){return <div key={i} style={{width:i===2?28:8,height:8,borderRadius:4,background:i===2?"#4ade80":"rgba(255,255,255,0.3)",transition:"all 0.3s"}}/>;}) }
            </div>
            <button style={{width:"100%",padding:"16px 0",background:"linear-gradient(135deg,#29c36a,#20a855)",color:"white",fontSize:16,fontWeight:700,borderRadius:50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 8px 24px rgba(41,195,106,0.4)"}} onClick={onDone}>
              Start Lunasy
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#4ade80"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>
            </button>
            <div style={{textAlign:"center",marginTop:12}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Already have an account? </span>
              <span style={{fontSize:13,color:"#4ade80",fontWeight:600,cursor:"pointer"}} onClick={onDone}>Log in</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function DebtTracker(){
  var [dark,setDark]=useState(false);
  var t=dark?T.dark:T.light;
  var [accounts,setAccounts]=useState(ACCOUNTS);
  var [connections,setConnections]=useState(CONNECTIONS);
  var [debts,setDebts]=useState(DEBTS);
  var [splits,setSplits]=useState(SPLITS);
  var [meId,setMeId]=useState("acc_reggy");
  var [view,setView]=useState("dashboard");
  var [filter,setFilter]=useState("all");
  var [catFilter,setCatFilter]=useState("all");
  var [mainTab,setMainTab]=useState("debts");
  var [toast,setToast]=useState(null);
  var [showOnboarding,setShowOnboarding]=useState(true);
  var [showNotifPanel,setShowNotifPanel]=useState(false);
  var [switchModal,setSwitchModal]=useState(false);
  var [payModal,setPayModal]=useState(null);
  var [addDebtModal,setAddDebtModal]=useState(false);
  var [createSplit,setCreateSplit]=useState(false);
  var [splitDetail,setSplitDetail]=useState(null);
  var [editProfile,setEditProfile]=useState(false);
  var [editForm,setEditForm]=useState({name:"",username:"",bio:""});
  var [showBankModal,setShowBankModal]=useState(false);
  var [bankForm,setBankForm]=useState({bank:"BCA",number:"",name:""});
  var [showPreferences,setShowPreferences]=useState(false);
  var [accountTab,setAccountTab]=useState("connected");
  var [addForm,setAddForm]=useState({type:"lend",toAccId:"",amount:"",note:"",date:todayStr(),dueDate:addDays(todayStr(),7),category:"lainnya"});
  var [notifList,setNotifList]=useState([
    {id:"n1",type:"payment",title:"Andi Pratama kirim bukti bayar",body:"Rp 200.000 - Patungan bensin",time:"18 Mei, 09:30",read:false,icon:"upload",debtId:"d2"},
    {id:"n2",type:"due",title:"Hutang ke Budi jatuh tempo besok",body:"Rp 150.000 - Makan siang bareng",time:"17 Mei, 08:00",read:false,icon:"bell",debtId:"d1"},
    {id:"n3",type:"verified",title:"Siti Rahayu konfirmasi pembayaran",body:"Rp 75.000 lunas",time:"16 Mei, 15:20",read:true,icon:"check",debtId:null},
  ]);
  var [showInviteModal,setShowInviteModal]=useState(false);
  var [confirmDialog,setConfirmDialog]=useState(null);
  var [payNote,setPayNote]=useState("");
  var [payProofImg,setPayProofImg]=useState(null);
  var [proofFullImg,setProofFullImg]=useState(null);
  var [splitVerifyMember,setSplitVerifyMember]=useState(null);
  var [splitPayModal,setSplitPayModal]=useState(null);
  var [splitPayNote,setSplitPayNote]=useState("");
  var [splitPayImg,setSplitPayImg]=useState(null);
  var splitPayFileRef=useRef();
  var [addDebtImg,setAddDebtImg]=useState(null);
  var [splitBillImg,setSplitBillImg]=useState(null);
  var [splitForm,setSplitForm]=useState({title:"",totalAmount:"",category:"food",memberIds:[]});
  var payFileRef=useRef();
  var addDebtFileRef=useRef();
  var splitBillFileRef=useRef();

  var me=accounts.find(function(a){return a.id===meId;})||accounts[0];
  var myConns=connections.filter(function(c){return(c.fromId===meId||c.toId===meId)&&c.status==="accepted";});
  var connIds=myConns.map(function(c){return c.fromId===meId?c.toId:c.fromId;});
  var incoming=connections.filter(function(c){return c.toId===meId&&c.status==="pending";});
  var myDebts=debts.filter(function(d){return d.fromAccId===meId||d.toAccId===meId;});
  var isDone=function(d){return d.status==="verified"||d.status==="paid";};
  var totalIOwe=myDebts.filter(function(d){return d.fromAccId===meId&&!isDone(d);}).reduce(function(s,d){return s+(d.amount-d.paidAmount);},0);
  var totalOwed=myDebts.filter(function(d){return d.toAccId===meId&&!isDone(d);}).reduce(function(s,d){return s+(d.amount-d.paidAmount);},0);
  var netBalance=totalOwed-totalIOwe;
  var pendVerif=myDebts.filter(function(d){return d.toAccId===meId&&d.status==="paying";}).length;
  var unreadNotif=notifList.filter(function(n){return !n.read;}).length;
  var getAcc=function(id){return accounts.find(function(a){return a.id===id;})||null;};
  var showToast=function(msg,type){setToast({msg:msg,type:type||"success"});setTimeout(function(){setToast(null);},2800);};
  var addNotif=function(type,title,body,icon){setNotifList(function(prev){return [{id:uid(),type:type,title:title,body:body,time:nowTime(),read:false,icon:icon||"bell",debtId:null}].concat(prev);});};

  var filteredDebts=useMemo(function(){
    var list=myDebts.slice();
    if(filter==="owe")     list=list.filter(function(d){return d.fromAccId===meId&&!isDone(d);});
    else if(filter==="lent")    list=list.filter(function(d){return d.toAccId===meId&&!isDone(d);});
    else if(filter==="paid")    list=list.filter(function(d){return isDone(d);});
    else if(filter==="overdue") list=list.filter(function(d){return !isDone(d)&&d.dueDate&&diffDays(d.dueDate)<0;});
    else if(filter==="soon")    list=list.filter(function(d){return !isDone(d)&&d.dueDate&&diffDays(d.dueDate)>=0&&diffDays(d.dueDate)<=3;});
    else if(filter==="verif")   list=list.filter(function(d){return d.status==="paying";});
    if(catFilter!=="all") list=list.filter(function(d){return d.category===catFilter;});
    return list.sort(function(a,b){if(isDone(a)&&!isDone(b))return 1;if(isDone(b)&&!isDone(a))return -1;if(!a.dueDate)return 1;if(!b.dueDate)return -1;return new Date(a.dueDate)-new Date(b.dueDate);});
  },[myDebts,filter,catFilter,meId]);

  var dueBadge=function(due,status){
    if(status==="paid"||status==="verified"||!due)return null;
    var d=diffDays(due);
    if(d<0)return{label:Math.abs(d)+"h terlambat",color:t.red,bg:t.redBg};
    if(d===0)return{label:"Due today",color:t.red,bg:t.redBg};
    if(d<=3)return{label:d+" days left",color:t.amber,bg:"#fff7ed"};
    return{label:d+" days left",color:t.text3,bg:"transparent"};
  };

  var handleAddDebt=function(){
    if(!addForm.toAccId||!addForm.amount||!addForm.note){showToast("Please fill all fields","error");return;}
    var amt=parseInt(addForm.amount);
    var nd={id:"d"+uid(),type:"regular",amount:amt,paidAmount:0,note:addForm.note,date:addForm.date,dueDate:addForm.dueDate,status:"unpaid",category:addForm.category,receiptImg:addDebtImg,payment:null,installments:null};
    if(addForm.type==="lend"){nd.fromAccId=addForm.toAccId;nd.toAccId=meId;}
    else{nd.fromAccId=meId;nd.toAccId=addForm.toAccId;}
    setDebts([nd].concat(debts));
    setAddForm({type:"lend",toAccId:"",amount:"",note:"",date:todayStr(),dueDate:addDays(todayStr(),7),category:"lainnya"});
    setAddDebtImg(null);
    setAddDebtModal(false);setView("dashboard");
    showToast("Debt record added!");
  };

  var handleVerify=function(id){
    setDebts(debts.map(function(d){
      if(d.id!==id)return d;
      return Object.assign({},d,{status:"verified",paidAmount:d.amount,payment:Object.assign({},d.payment,{verifiedAt:nowTime(),verifiedBy:meId})});
    }));
    if(payModal)setPayModal(null);
    showToast("Payment confirmed!");
    addNotif("verified","Payment confirmed","Hutang telah lunas","check");
  };

  var handleSubmitProof=function(id,note,img){
    setDebts(debts.map(function(d){
      if(d.id!==id)return d;
      return Object.assign({},d,{status:"paying",payment:{payerNote:note,proofImage:img,submittedAt:nowTime(),verifiedAt:null,disputeNote:null}});
    }));
    if(payModal)setPayModal(null);
    showToast("Proof sent!");
    addNotif("payment","Payment proof sent","Waiting confirmation","upload");
  };

  var handleVerifySplitMember=function(sId,aId){
    setSplits(splits.map(function(s){
      if(s.id!==sId)return s;
      return Object.assign({},s,{members:s.members.map(function(x){
        if(x.accId!==aId)return x;
        var newPayment=Object.assign({},x.payment||{},{verifiedAt:nowTime(),verifiedBy:meId});
        return Object.assign({},x,{paid:x.share,paymentStatus:"verified",payment:newPayment});
      })});
    }));
    setSplitDetail(null);
    showToast("Confirmed!");
  };

  var handlePaySplitMember=function(sId,aId){
    setSplits(splits.map(function(s){
      if(s.id!==sId)return s;
      return Object.assign({},s,{members:s.members.map(function(x){
        if(x.accId!==aId)return x;
        return Object.assign({},x,{paymentStatus:"paying",payment:{payerNote:"Paid",proofImage:null,submittedAt:nowTime(),verifiedAt:null,disputeNote:null}});
      })});
    }));
    showToast("Payment submitted!");
  };

  var meName=me?me.name:"";
  var meInitials=me?me.avatar:"RC";
  var meFirstName=meName?meName.split(" ")[0]:"";
  var hour=new Date().getHours();
  var greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return (
    <div style={{fontFamily:"Inter,sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:t.bg,color:t.text,overflow:"hidden"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:7px;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;cursor:pointer;border:none;transition:all 0.15s ease;}.btn:active{transform:scale(0.97);}.inp{width:100%;border-radius:10px;padding:11px 13px;font-family:'Inter',sans-serif;font-size:13px;outline:none;border:1.5px solid #e2e8f0;background:#f8fafc;color:#0f172a;}.inp:focus{border-color:#29c36a;box-shadow:0 0 0 3px rgba(41,195,106,0.1);}@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}"}</style>

      {/* ── HEADER ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px",flexShrink:0,background:t.surface,borderBottom:"1px solid "+t.border,zIndex:60}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <LunasyLogo size={32}/>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:t.text,letterSpacing:"-0.02em"}}>Lunasy</div>
            <div style={{fontSize:11,color:t.text3,marginTop:1}}>{greeting}, {meFirstName} 👋</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{position:"relative",cursor:"pointer"}} onClick={function(){setShowNotifPanel(true);}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:t.surface2,border:"1px solid "+t.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="bell" size={16} color={t.text2} sw={1.6}/>
            </div>
            {unreadNotif>0&&<div style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:"#ef4444",border:"2px solid "+t.bg}}/>}
          </div>
          <div style={{cursor:"pointer"}} onClick={function(){setDark(!dark);}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:t.surface2,border:"1px solid "+t.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>
              {dark?"☀️":"🌙"}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:t.surface2,border:"1px solid "+t.border,borderRadius:20,padding:"4px 10px 4px 4px",cursor:"pointer"}} onClick={function(){setSwitchModal(true);}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"white",fontFamily:"Inter,sans-serif"}}>
              {meInitials}
            </div>
            <Icon name="chevron" size={11} color={t.text3} sw={1.5}/>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>

        {/* DASHBOARD */}
        {view==="dashboard"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            {/* Balance Card */}
            <div style={{padding:"14px 14px 0",flexShrink:0}}>
              <div style={{background:"linear-gradient(135deg,#15803d 0%,#166534 100%)",borderRadius:20,padding:"18px 18px 16px",position:"relative",overflow:"hidden",boxShadow:"0 4px 20px rgba(22,163,74,0.25)"}}>
                <div style={{position:"absolute",right:-20,top:-20,opacity:0.1,fontSize:140}}>🍃</div>
                <div style={{position:"absolute",right:16,top:16,width:46,height:46,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
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
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>YOU WILL RECEIVE</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"white",fontWeight:700}}>{fmt(totalOwed)}</div>
                  </div>
                  <div style={{flex:1,padding:"0 8px",borderRight:"1px solid rgba(255,255,255,0.15)"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>YOU OWE</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"white",fontWeight:700}}>{fmt(totalIOwe)}</div>
                  </div>
                  <div style={{flex:1,paddingLeft:8,cursor:pendVerif>0?"pointer":"default"}} onClick={function(){if(pendVerif>0)setFilter("verif");}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>TO VERIFY</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:"white",fontWeight:700}}>{pendVerif}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab content */}
            <div style={{flex:1,overflowY:"auto",padding:"10px 14px 100px"}}>
              {/* Filters */}
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{position:"relative",flex:1}}>
                  <select value={filter} onChange={function(e){setFilter(e.target.value);}} style={{width:"100%",appearance:"none",background:t.surface,border:"1.5px solid "+(filter!=="all"?t.primary:t.border),borderRadius:10,padding:"8px 28px 8px 12px",fontSize:12,color:filter!=="all"?t.primary:t.text3,fontFamily:"Inter,sans-serif",fontWeight:500,outline:"none",cursor:"pointer"}}>
                    <option value="all">All Status</option>
                    <option value="owe">You Owe</option>
                    <option value="lent">Receivable</option>
                    <option value="paid">Settled</option>
                    <option value="overdue">Overdue</option>
                    <option value="soon">Due Soon</option>
                    <option value="verif">Need Verify</option>
                  </select>
                  <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={12} color={t.text3} sw={1.5}/></div>
                </div>
                <div style={{position:"relative",flex:1}}>
                  <select value={catFilter} onChange={function(e){setCatFilter(e.target.value);}} style={{width:"100%",appearance:"none",background:t.surface,border:"1.5px solid "+(catFilter!=="all"?t.primary:t.border),borderRadius:10,padding:"8px 28px 8px 12px",fontSize:12,color:catFilter!=="all"?t.primary:t.text3,fontFamily:"Inter,sans-serif",fontWeight:500,outline:"none",cursor:"pointer"}}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(function(c){return <option key={c.id} value={c.id}>{c.label}</option>;})}
                  </select>
                  <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Icon name="chevron" size={12} color={t.text3} sw={1.5}/></div>
                </div>
              </div>

              {/* Unified list: debts + splits mixed */}
              {filteredDebts.length===0&&splits.filter(function(s){return s.members.some(function(m){return m.accId===meId;});}).length===0&&(
                <div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>No records found</div>
              )}

              {/* Debt cards */}
              {filteredDebts.map(function(d){
                var isMeOwing=d.fromAccId===meId;
                var isMeLender=d.toAccId===meId;
                var other=getAcc(isMeOwing?d.toAccId:d.fromAccId);
                var done=isDone(d);
                var due=dueBadge(d.dueDate,d.status);
                var rem=d.amount-d.paidAmount;
                var cat=CATEGORIES.find(function(c){return c.id===d.category;})||CATEGORIES[5];
                return(
                  <div key={d.id} onClick={function(){setPayModal({debt:d});}} style={{padding:"14px 14px 12px",background:t.surface,borderRadius:14,border:"1px solid "+t.border,marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:4}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:14,fontWeight:700,color:t.text}}>{safeName(other)}</span>
                            <span style={{fontSize:10,background:catFilter===d.category?t.primaryBg:t.surface2,color:catFilter===d.category?t.primary:t.text3,padding:"2px 8px",borderRadius:20,fontWeight:500,border:"1px solid "+(catFilter===d.category?t.primaryBorder:t.border),cursor:"pointer"}} onClick={function(e){e.stopPropagation();setCatFilter(catFilter===d.category?"all":d.category);}}>{cat.label}</span>
                          </div>
                          <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:done?t.text3:isMeOwing?t.red:t.green}}>{isMeOwing?"−":"+"}{fmt(rem)}</span>
                        </div>
                        <div style={{fontSize:12,color:t.text3,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.note}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        {done&&<span style={{fontSize:10,fontWeight:600,color:t.green,background:t.greenBg,border:"1px solid "+t.greenBorder,padding:"2px 8px",borderRadius:20}}>✓ Settled</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        {!done&&isMeOwing&&d.status==="unpaid"&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:"1.5px solid "+t.primary,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:4}} onClick={function(e){e.stopPropagation();setPayModal({debt:d});}}><Icon name="creditcard" size={11} color={t.primary} sw={2}/>Pay</button>}
                        {!done&&isMeLender&&d.status==="paying"&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:"1.5px solid "+t.primary,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600,display:"flex",alignItems:"center",gap:4}} onClick={function(e){e.stopPropagation();setPayModal({debt:d});}}><Icon name="check" size={11} color={t.primary} sw={2}/>Verify</button>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Split bill cards mixed in */}
              {splits.filter(function(s){return s.members.some(function(m){return m.accId===meId;});}).map(function(s){
                var payer=getAcc(s.payerId);
                var settled=s.members.filter(function(m){return m.paymentStatus==="verified";}).length;
                var myM=s.members.find(function(m){return m.accId===meId;})||null;
                var myStatus=myM?myM.paymentStatus:"unpaid";
                var isAllDone=settled===s.members.length;
                return(
                  <div key={s.id} style={{background:t.surface,borderRadius:14,border:"1px solid "+t.border,padding:"14px",marginBottom:8,cursor:"pointer"}} onClick={function(){setSplitDetail(s);}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:14,fontWeight:700,color:t.text}}>{s.title}</span>
                        <span style={{fontSize:10,background:t.surface2,color:t.text3,padding:"2px 8px",borderRadius:20,fontWeight:500,border:"1px solid "+t.border}}>Split Bill</span>
                      </div>
                      <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:isAllDone?t.text3:t.text}}>{fmt(s.totalAmount)}</span>
                    </div>
                    <div style={{fontSize:12,color:t.text3,marginBottom:8}}>{safeName(payer)} paid · {s.members.length} people</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                        <div style={{flex:1,background:t.surface2,borderRadius:4,height:5,overflow:"hidden"}}>
                          <div style={{width:(settled/s.members.length*100)+"%",height:"100%",background:t.primary,borderRadius:4}}/>
                        </div>
                        <span style={{fontSize:11,color:t.text3,flexShrink:0}}>{settled}/{s.members.length}</span>
                      </div>
                      <div style={{marginLeft:10}}>
                        {isAllDone&&<span style={{fontSize:10,fontWeight:600,color:t.green,background:t.greenBg,border:"1px solid "+t.greenBorder,padding:"2px 8px",borderRadius:20}}>✓ Settled</span>}
                        {!isAllDone&&myStatus==="unpaid"&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:"1.5px solid "+t.primary,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={function(e){e.stopPropagation();setSplitDetail(s);}}>Pay</button>}
                        {!isAllDone&&myStatus==="paying"&&<span style={{fontSize:10,fontWeight:600,color:t.amber,background:"#fff7ed",padding:"2px 8px",borderRadius:20}}>Pending</span>}
                        {!isAllDone&&myStatus==="verified"&&s.payerId===meId&&<button className="btn" style={{padding:"4px 12px",fontSize:11,background:"transparent",color:t.primary,border:"1.5px solid "+t.primary,borderRadius:20,fontFamily:"Inter,sans-serif",fontWeight:600}} onClick={function(e){e.stopPropagation();setSplitDetail(s);}}>Verify</button>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Premium Banner */}
              <div style={{marginTop:16,background:"linear-gradient(135deg,#0f4023 0%,#166534 100%)",borderRadius:16,padding:"13px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",boxShadow:"0 4px 12px rgba(20,83,45,0.3)"}} onClick={function(){showToast("Premium coming soon!");}}>
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
          </div>
        )}

        {/* ADD VIEW */}
        {view==="add"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 100px"}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:4}}>Add Record</div>
            <div style={{fontSize:13,color:t.text3,marginBottom:20}}>Choose the type of record</div>
            {[{id:"lend",icon:"transfer",label:"Add Receivable",sub:"Someone owes you money",color:t.green,bg:t.greenBg},{id:"borrow",icon:"creditcard",label:"Add Debt",sub:"You owe someone money",color:t.red,bg:t.redBg},{id:"split",icon:"split",label:"Split Bill",sub:"Split expenses with friends",color:t.primary,bg:t.primaryBg}].map(function(item){return(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px",background:t.surface,borderRadius:14,border:"1px solid "+t.border,marginBottom:10,cursor:"pointer"}} onClick={function(){if(item.id==="split"){setCreateSplit(true);}else{setAddForm(Object.assign({},addForm,{type:item.id==="lend"?"lend":"borrow"}));setAddDebtModal(true);}}}>
                <div style={{width:44,height:44,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={item.icon} size={22} color={item.color} sw={1.8}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:t.text}}>{item.label}</div>
                  <div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div>
                </div>
                <Icon name="chevron" size={18} color={t.text3} sw={1.5}/>
              </div>
            );})}
          </div>
        )}

        {/* CONNECTIONS VIEW */}
        {view==="connections"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 100px"}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text,marginBottom:4}}>Connections</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["connected","requests","discover"].map(function(tab){return(
                <button key={tab} className="btn" style={{flex:1,padding:"8px 0",borderRadius:20,border:"1px solid "+(accountTab===tab?t.primary:t.border),background:accountTab===tab?t.primaryBg:"transparent",color:accountTab===tab?t.primary:t.text3,fontSize:12,fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={function(){setAccountTab(tab);}}>
                  {tab==="connected"?"Connected":tab==="requests"?"Requests ("+(incoming.length)+")":"Discover"}
                </button>
              );})}
            </div>
            {accountTab==="connected"&&(
              <div>
                <div style={{background:t.surface,border:"1.5px dashed "+t.primaryBorder,borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={function(){setShowInviteModal(true);}}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name="people" size={20} color={t.primary} sw={1.8}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:t.primary}}>Invite Member</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:1}}>Invite via WhatsApp, Link, or QR</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.primary} sw={1.5}/>
                </div>
                {connIds.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:t.text3}}>No connections yet</div>}
                {connIds.map(function(id){
                  var a=getAcc(id);
                  if(!a)return null;
                  return(
                    <div key={id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid "+t.border}}>
                      <Avatar account={a} size={42}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div>
                        <div style={{fontSize:12,color:t.text3}}>@{a.username}</div>
                      </div>
                      <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                    </div>
                  );
                })}
              </div>
            )}
            {accountTab==="requests"&&(
              <div>
                {incoming.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:t.text3}}>No pending requests</div>}
                {incoming.map(function(c){
                  var a=getAcc(c.fromId);
                  if(!a)return null;
                  return(
                    <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",background:t.surface,borderRadius:12,border:"1px solid "+t.border,marginBottom:8}}>
                      <Avatar account={a} size={42}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div>
                        <div style={{fontSize:12,color:t.text3}}>@{a.username}</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn" style={{padding:"6px 12px",fontSize:12,background:t.primary,color:"white",borderRadius:20}} onClick={function(){setConnections(connections.map(function(x){return x.id===c.id?Object.assign({},x,{status:"accepted"}):x;}));showToast("Accepted!");}}>Accept</button>
                        <button className="btn" style={{padding:"6px 12px",fontSize:12,background:t.surface2,color:t.text2,border:"1px solid "+t.border,borderRadius:20}} onClick={function(){setConnections(connections.filter(function(x){return x.id!==c.id;}));showToast("Declined");}}>Decline</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {accountTab==="discover"&&(
              <div>
                {accounts.filter(function(a){return a.id!==meId&&!connIds.includes(a.id);}).map(function(a){return(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid "+t.border}}>
                    <Avatar account={a} size={42}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div>
                      <div style={{fontSize:12,color:t.text3}}>@{a.username}</div>
                    </div>
                    <button className="btn" style={{padding:"6px 14px",fontSize:12,background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:20}} onClick={function(){setConnections([{id:uid(),fromId:meId,toId:a.id,status:"pending"}].concat(connections));showToast("Request sent!");}}>Connect</button>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {/* PROFILE VIEW */}
        {view==="profile"&&(
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 100px"}}>
            {/* Profile card */}
            <div style={{background:t.surface,borderRadius:20,padding:"20px",border:"1px solid "+t.border,marginBottom:16,textAlign:"center"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#20a855)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:24,color:"white",margin:"0 auto 12px",fontFamily:"Inter,sans-serif"}}>
                {meInitials}
              </div>
              <div style={{fontSize:18,fontWeight:800,color:t.text,marginBottom:4}}>{meName}</div>
              <div style={{fontSize:13,color:t.text3,marginBottom:4}}>@{me?me.username:""}</div>
              {me&&me.bio&&<div style={{fontSize:12,color:t.text3,marginBottom:12,fontStyle:"italic"}}>{me.bio}</div>}
              <div style={{display:"flex",borderTop:"1px solid "+t.border,paddingTop:16}}>
                {[{num:myDebts.length,label:"Records"},{num:connIds.length,label:"Connections"},{num:myDebts.filter(isDone).length,label:"Settled"}].map(function(s,i,arr){return(
                  <div key={s.label} style={{flex:1,textAlign:"center",borderRight:i<arr.length-1?"1px solid "+t.border:"none"}}>
                    <div style={{fontSize:20,fontWeight:800,color:t.text}}>{s.num}</div>
                    <div style={{fontSize:11,color:t.text3}}>{s.label}</div>
                  </div>
                );})}
              </div>
            </div>

            {/* Premium Banner */}
            <div style={{background:"linear-gradient(135deg,#0f4023,#166534)",borderRadius:16,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={function(){showToast("Premium coming soon!");}}>
              <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="crown" size={20} color="#fbbf24" sw={1.8}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"white"}}>Upgrade to Premium</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:1}}>Unlock Travel Mode, Analytics & more</div>
              </div>
              <div style={{background:"#fbbf24",borderRadius:20,padding:"6px 12px"}}>
                <span style={{fontSize:11,fontWeight:700,color:"#78350f"}}>Upgrade</span>
              </div>
            </div>

            {/* Account Section */}
            <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,marginLeft:4}}>Account</div>
            <div style={{background:t.surface,borderRadius:16,border:"1px solid "+t.border,overflow:"hidden",marginBottom:16}}>
              {[
                {icon:"person",label:"Edit Profile",sub:"Update name, username, bio",action:function(){setEditForm({name:meName,username:me?me.username:"",bio:me?me.bio:""});setEditProfile(true);}},
                {icon:"people",label:"Connections",sub:"Manage your friends",action:function(){setView("connections");}},
                {icon:"bell",label:"Notifications",sub:"Reminders & alerts",action:function(){showToast("Coming soon!");}},
                {icon:"lock",label:"Privacy & Security",sub:"Password, data protection",action:function(){showToast("Coming soon!");}},
              ].map(function(item,i,arr){return(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid "+t.border:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={item.icon} size={17} color={t.primary} sw={1.7}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:1}}>{item.sub}</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              );})}
            </div>

            {/* Features Section */}
            <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,marginLeft:4}}>Features</div>
            <div style={{background:t.surface,borderRadius:16,border:"1px solid "+t.border,overflow:"hidden",marginBottom:16}}>
              {[
                {icon:"star",label:"Analytics",sub:"Spending trends & insights",badge:"PRO",action:function(){showToast("Upgrade to Premium!");}},
                {icon:"transfer",label:"Travel Mode",sub:"Track trip expenses",badge:"PRO",action:function(){showToast("Upgrade to Premium!");}},
                {icon:"receipt",label:"Export Report",sub:"Download PDF summary",badge:"PRO",action:function(){showToast("Upgrade to Premium!");}},
                {icon:"split",label:"Split Bill",sub:"Divide expenses with friends",action:function(){setView("dashboard");setMainTab("splits");}},
              ].map(function(item,i,arr){return(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid "+t.border:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={item.icon} size={17} color={t.primary} sw={1.7}/></div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</span>
                      {item.badge&&<span style={{fontSize:9,fontWeight:800,color:"#78350f",background:"#fbbf24",borderRadius:6,padding:"2px 6px"}}>{item.badge}</span>}
                    </div>
                    <div style={{fontSize:11,color:t.text3,marginTop:1}}>{item.sub}</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              );})}
            </div>

            {/* Preferences Section */}
            <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,marginLeft:4}}>Preferences</div>
            <div style={{background:t.surface,borderRadius:16,border:"1px solid "+t.border,overflow:"hidden",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:"1px solid "+t.border,cursor:"pointer"}} onClick={function(){setDark(!dark);}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{dark?"☀️":"🌙"}</span></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:t.text}}>{dark?"Light Mode":"Dark Mode"}</div>
                  <div style={{fontSize:11,color:t.text3,marginTop:1}}>Switch appearance</div>
                </div>
                <div style={{width:40,height:22,borderRadius:11,background:dark?t.primary:t.surface2,border:"1px solid "+t.border,position:"relative",transition:"background 0.2s"}}>
                  <div style={{position:"absolute",top:2,left:dark?20:2,width:18,height:18,borderRadius:"50%",background:"white",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.2s"}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}} onClick={function(){showToast("Coming soon!");}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="settings" size={17} color={t.primary} sw={1.7}/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:t.text}}>App Preferences</div>
                  <div style={{fontSize:11,color:t.text3,marginTop:1}}>Language, currency, notifications</div>
                </div>
                <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
              </div>
            </div>

            {/* Support Section */}
            <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,marginLeft:4}}>Support</div>
            <div style={{background:t.surface,borderRadius:16,border:"1px solid "+t.border,overflow:"hidden",marginBottom:16}}>
              {[
                {emoji:"❓",label:"Help & Support",sub:"FAQ, contact us",action:function(){showToast("Coming soon!");}},
                {emoji:"📋",label:"Terms of Service",sub:"Read our terms",action:function(){showToast("Coming soon!");}},
                {emoji:"🔒",label:"Privacy Policy",sub:"How we protect your data",action:function(){showToast("Coming soon!");}},
                {emoji:"⭐",label:"Rate Lunasy",sub:"Leave us a review",action:function(){showToast("Thank you! 💚");}},
              ].map(function(item,i,arr){return(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid "+t.border:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.surface2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:1}}>{item.sub}</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              );})}
            </div>

            {/* Sign Out */}
            <div style={{background:t.surface,borderRadius:16,border:"1px solid "+t.border,overflow:"hidden",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}} onClick={function(){setConfirmDialog({title:"Sign Out",msg:"Are you sure you want to sign out?",onConfirm:function(){showToast("Signed out!");}});}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.redBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>🚪</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:t.red}}>Sign Out</div>
                  <div style={{fontSize:11,color:t.text3,marginTop:1}}>Log out of your account</div>
                </div>
                <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
              </div>
            </div>

            <div style={{textAlign:"center",color:t.text3,fontSize:12,marginBottom:8}}>Lunasy v1.0.0 • Made with 💚 in Indonesia</div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{display:"flex",alignItems:"center",background:t.surface,backdropFilter:"blur(16px)",borderTop:"1px solid "+t.border,paddingBottom:"env(safe-area-inset-bottom)",position:"fixed",bottom:0,left:0,right:0,zIndex:50,height:64}}>
        <button className="btn" style={{flex:1,height:"100%",flexDirection:"column",gap:3,background:"transparent",border:"none",color:view==="dashboard"?t.primary:"#9ca3af",fontFamily:"Inter,sans-serif",padding:0}} onClick={function(){setView("dashboard");}}>
          <Icon name="home" size={22} color={view==="dashboard"?t.primary:"#9ca3af"} sw={view==="dashboard"?2:1.5}/>
          <span style={{fontSize:10,fontWeight:view==="dashboard"?700:400,color:view==="dashboard"?t.primary:"#9ca3af"}}>Home</span>
          {view==="dashboard"&&<div style={{width:4,height:4,borderRadius:"50%",background:t.primary}}/>}
        </button>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <button className="btn" style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#29c36a,#20a855)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(41,195,106,0.4)",marginBottom:20,padding:0}} onClick={function(){setView(view==="add"?"dashboard":"add");}}>
            {view==="add"
              ?<Icon name="x" size={20} color="white" sw={2.5}/>
              :<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            }
          </button>
        </div>
        <button className="btn" style={{flex:1,height:"100%",flexDirection:"column",gap:3,background:"transparent",border:"none",color:view==="profile"?t.primary:"#9ca3af",fontFamily:"Inter,sans-serif",padding:0,position:"relative"}} onClick={function(){setView("profile");}}>
          <Icon name="person" size={22} color={view==="profile"?t.primary:"#9ca3af"} sw={view==="profile"?2:1.5}/>
          <span style={{fontSize:10,fontWeight:view==="profile"?700:400,color:view==="profile"?t.primary:"#9ca3af"}}>Profile</span>
          {unreadNotif>0&&<div style={{position:"absolute",top:10,right:"calc(50% - 14px)",width:7,height:7,borderRadius:"50%",background:t.red,border:"2px solid "+t.bg}}/>}
        </button>
      </div>

      {/* ── NOTIFICATION PANEL ── */}
      {showNotifPanel&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:500}} onClick={function(){setShowNotifPanel(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"14px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Notifications</div>
                {notifList.length>0&&<button className="btn" style={{fontSize:12,color:t.text3,background:"transparent",border:"none",padding:"4px 8px"}} onClick={function(){setNotifList([]);}}>Clear all</button>}
              </div>
              {notifList.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:t.text3,fontSize:14}}>No notifications</div>}
              {notifList.map(function(n){return(
                <div key={n.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid "+t.border,opacity:n.read?0.6:1,cursor:"pointer"}} onClick={function(){
                  setNotifList(notifList.map(function(x){return x.id===n.id?Object.assign({},x,{read:true}):x;}));
                  setShowNotifPanel(false);
                  if(n.debtId){
                    setView("dashboard");
                    setMainTab("debts");
                    setFilter("all");
                    setPayModal({debt:debts.find(function(d){return d.id===n.debtId;})||null});
                  }else{
                    setView("dashboard");
                    setMainTab("debts");
                  }
                }}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={n.icon} size={16} color={t.primary} sw={1.8}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:12,color:t.text3}}>{n.body}</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:4}}>{n.time}</div>
                  </div>
                  {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:t.primary,marginTop:4,flexShrink:0}}/>}
                </div>
              );})}
            </div>
          </div>
        </div>
      )}

      {/* ── PAY MODAL ── */}
      {payModal&&payModal.debt&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setPayModal(null);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:t.text}}>{payModal.debt.toAccId===meId?"Verify Payment":"Payment Detail"}</div>
                  <div style={{fontSize:12,color:t.text3,marginTop:2}}>{payModal.debt.note}</div>
                </div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center",padding:0}} onClick={function(){setPayModal(null);}}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>

              {/* Amount card */}
              <div style={{background:"linear-gradient(135deg,#15803d,#166534)",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>
                  {payModal.debt.fromAccId===meId?"You owe":"You will receive"}
                </div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:26,fontWeight:800,color:"white"}}>{fmt(payModal.debt.amount-payModal.debt.paidAmount)}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                  <Avatar account={getAcc(payModal.debt.fromAccId===meId?payModal.debt.toAccId:payModal.debt.fromAccId)} size={24}/>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.85)"}}>{safeName(getAcc(payModal.debt.fromAccId===meId?payModal.debt.toAccId:payModal.debt.fromAccId))}</span>
                </div>
              </div>

              {/* Receipt image if attached */}
              {payModal.debt.receiptImg&&(
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Attached Receipt</div>
                  <img src={payModal.debt.receiptImg} alt="receipt" style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:12,display:"block",cursor:"pointer",border:"1px solid "+t.border}} onClick={function(){setProofFullImg(payModal.debt.receiptImg);}}/>
                </div>
              )}

              {/* Status */}
              {(payModal.debt.status==="verified"||payModal.debt.status==="paid")&&(
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:48,marginBottom:8}}>✅</div>
                  <div style={{fontSize:16,fontWeight:700,color:t.green}}>This debt is settled!</div>
                  <div style={{fontSize:13,color:t.text3,marginTop:4}}>Verified and completed</div>
                  <button className="btn" style={{marginTop:20,padding:"12px 32px",background:t.surface2,color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setPayModal(null);}}>Close</button>
                </div>
              )}

              {/* Lender verify incoming payment */}
              {payModal.debt.status==="paying"&&payModal.debt.toAccId===meId&&(
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Payment Proof</div>
                  {payModal.debt.payment&&(
                    <div style={{background:t.surface2,borderRadius:12,padding:"12px 14px",marginBottom:12,border:"1px solid "+t.border}}>
                      {payModal.debt.payment.proofImage&&(
                        <img src={payModal.debt.payment.proofImage} alt="proof" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:8,marginBottom:10,display:"block",cursor:"pointer"}} onClick={function(){setProofFullImg(payModal.debt.payment.proofImage);}}/>
                      )}
                      {!payModal.debt.payment.proofImage&&(
                        <div style={{background:t.surface,borderRadius:8,padding:"14px",textAlign:"center",marginBottom:10,border:"1px dashed "+t.border}}>
                          <Icon name="upload" size={20} color={t.text3} sw={1.5}/>
                          <div style={{fontSize:12,color:t.text3,marginTop:6}}>No proof image attached</div>
                        </div>
                      )}
                      <div style={{fontSize:13,color:t.text,marginBottom:2,fontWeight:600}}>{payModal.debt.payment.payerNote||"No note"}</div>
                      <div style={{fontSize:11,color:t.text3}}>{payModal.debt.payment.submittedAt}</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button className="btn" style={{flex:1,padding:"13px",background:t.primary,color:"white",borderRadius:12,fontWeight:700,fontSize:14}} onClick={function(){handleVerify(payModal.debt.id);}}>
                      <Icon name="check" size={14} color="white" sw={2}/> Confirm
                    </button>
                    <button className="btn" style={{flex:1,padding:"13px",background:t.redBg,color:t.red,border:"1px solid "+t.redBorder,borderRadius:12,fontWeight:700,fontSize:14}} onClick={function(){setPayModal(null);showToast("Rejected","error");}}>
                      <Icon name="x" size={14} color={t.red} sw={2}/> Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Borrower submit proof */}
              {payModal.debt.fromAccId===meId&&payModal.debt.status==="unpaid"&&(
                <div>
                  {/* Bank Account Details */}
                  {(function(){
                    var lender=getAcc(payModal.debt.toAccId);
                    var banks=lender?safeArr(lender.bankAccounts):[];
                    if(banks.length===0)return null;
                    var BANK_COLORS={"BCA":"#0066AE","Mandiri":"#003d79","BNI":"#f15a22","BRI":"#004B8D","GoPay":"#00AED6","OVO":"#4c3494","Dana":"#118AE6","QRIS":"#e83b3b"};
                    var BANK_APPS={"BCA":"mybca://","GoPay":"gojek://","OVO":"ovo://","Dana":"dana://"};
                    return(
                      <div style={{marginBottom:16}}>
                        <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Transfer To</div>
                        {banks.map(function(ba){
                          var bankColor=BANK_COLORS[ba.bank]||t.primary;
                          var appLink=BANK_APPS[ba.bank]||null;
                          return(
                            <div key={ba.id} style={{background:t.surface2,borderRadius:14,padding:"14px 16px",marginBottom:8,border:"1px solid "+t.border}}>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                                <div style={{display:"flex",alignItems:"center",gap:10}}>
                                  <div style={{width:36,height:36,borderRadius:10,background:bankColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                    <span style={{fontSize:11,fontWeight:800,color:"white"}}>{ba.bank.slice(0,3)}</span>
                                  </div>
                                  <div>
                                    <div style={{fontSize:13,fontWeight:700,color:t.text}}>{ba.bank}</div>
                                    <div style={{fontSize:11,color:t.text3}}>{ba.name}</div>
                                  </div>
                                </div>
                                {appLink&&(
                                  <button className="btn" style={{padding:"5px 10px",fontSize:11,background:bankColor,color:"white",borderRadius:20,fontWeight:600}} onClick={function(){window.open(appLink);}}>
                                    Open App
                                  </button>
                                )}
                              </div>
                              <div style={{background:t.surface,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"1px solid "+t.border}}>
                                <div>
                                  <div style={{fontSize:11,color:t.text3,marginBottom:2}}>Account Number</div>
                                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:700,color:t.text,letterSpacing:"0.08em"}}>{ba.number}</div>
                                </div>
                                <button className="btn" style={{padding:"6px 12px",fontSize:12,background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:20,fontWeight:600,flexShrink:0}} onClick={function(){
                                  if(navigator.clipboard){navigator.clipboard.writeText(ba.number);}
                                  showToast("Copied! "+ba.number);
                                }}>
                                  Copy
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Upload Payment Proof</div>
                  {payProofImg?(
                    <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:"1px solid "+t.border,marginBottom:12}}>
                      <img src={payProofImg} alt="proof" style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block"}}/>
                      <button className="btn" style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",padding:0}} onClick={function(){setPayProofImg(null);}}><Icon name="x" size={12} color="white" sw={2}/></button>
                    </div>
                  ):(
                    <div style={{border:"2px dashed "+t.border,borderRadius:12,padding:"24px",textAlign:"center",cursor:"pointer",background:t.surface2,marginBottom:12}} onClick={function(){payFileRef.current&&payFileRef.current.click();}}>
                      <Icon name="upload" size={24} color={t.text3} sw={1.5}/>
                      <div style={{fontSize:13,color:t.text3,marginTop:8}}>Tap to upload proof</div>
                      <div style={{fontSize:11,color:t.text3,marginTop:2}}>Photo of transfer receipt</div>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={payFileRef} style={{display:"none"}} onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setPayProofImg(ev.target.result);};r.readAsDataURL(f);}}/>
                  <div style={{marginBottom:12}}>
                    <input value={payNote} onChange={function(e){setPayNote(e.target.value);}} placeholder="Add a note (optional)..." style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <button className="btn" style={{width:"100%",padding:"14px",background:t.primary,color:"white",borderRadius:12,fontSize:14,fontWeight:700,marginBottom:8}} onClick={function(){handleSubmitProof(payModal.debt.id,payNote,payProofImg);setPayNote("");setPayProofImg(null);}}>
                    <Icon name="upload" size={16} color="white" sw={2}/> Submit Proof
                  </button>
                  <button className="btn" style={{width:"100%",padding:"12px",background:"transparent",color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setPayModal(null);}}>Cancel</button>
                </div>
              )}

              {/* Lender - unpaid (remind) */}
              {payModal.debt.toAccId===meId&&payModal.debt.status==="unpaid"&&(
                <div>
                  <button className="btn" style={{width:"100%",padding:"14px",background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:12,fontSize:14,fontWeight:700,marginBottom:8}} onClick={function(){showToast("Reminder sent!");setPayModal(null);}}>
                    🔔 Send Reminder
                  </button>
                  <button className="btn" style={{width:"100%",padding:"12px",background:"transparent",color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setPayModal(null);}}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD DEBT MODAL ── */}
      {addDebtModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setAddDebtModal(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
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
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center",padding:0}} onClick={function(){setAddDebtModal(false);}}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{addForm.type==="lend"?"Who owes you?":"You owe to?"}</div>
                <div style={{background:t.surface2,borderRadius:10,padding:"12px 14px",cursor:"pointer",border:"1px solid "+t.border,marginBottom:8}}>
                  {addForm.toAccId
                    ?<div style={{display:"flex",alignItems:"center",gap:10}}><Avatar account={getAcc(addForm.toAccId)} size={28}/><span style={{fontSize:14,color:t.text}}>{(getAcc(addForm.toAccId)||{name:""}).name}</span></div>
                    :<span style={{fontSize:14,color:t.text3}}>Select connection...</span>
                  }
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {connIds.map(function(id){var a=getAcc(id);if(!a)return null;return(
                    <button key={id} className="btn" style={{padding:"5px 10px",borderRadius:8,border:"1px solid "+(addForm.toAccId===id?t.primary:t.border),background:addForm.toAccId===id?t.primaryBg:"transparent",color:addForm.toAccId===id?t.primary:t.text3,fontSize:12,fontFamily:"Inter,sans-serif"}} onClick={function(){setAddForm(Object.assign({},addForm,{toAccId:id}));}}>
                      {a.name.split(" ")[0]}
                    </button>
                  );})}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Amount</div>
                <div style={{display:"flex",alignItems:"center",gap:8,background:t.surface2,borderRadius:10,padding:"10px 14px",border:"1px solid "+t.border}}>
                  <span style={{fontSize:14,fontWeight:600,color:t.text3}}>Rp</span>
                  <input type="number" value={addForm.amount} onChange={function(e){setAddForm(Object.assign({},addForm,{amount:e.target.value}));}} placeholder="0" style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:18,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}}/>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Note</div>
                <input value={addForm.note} onChange={function(e){setAddForm(Object.assign({},addForm,{note:e.target.value}));}} placeholder="What for?" style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Category</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {CATEGORIES.map(function(c){return(
                    <button key={c.id} className="btn" style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+(addForm.category===c.id?t.primary:t.border),background:addForm.category===c.id?t.primaryBg:"transparent",color:addForm.category===c.id?t.primary:t.text2,fontSize:12,fontFamily:"Inter,sans-serif"}} onClick={function(){setAddForm(Object.assign({},addForm,{category:c.id}));}}>
                      {c.label}
                    </button>
                  );})}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Due Date</div>
                <input type="date" value={addForm.dueDate} onChange={function(e){setAddForm(Object.assign({},addForm,{dueDate:e.target.value}));}} style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Receipt / Proof (Optional)</div>
                <input type="file" accept="image/*" ref={addDebtFileRef} style={{display:"none"}} onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setAddDebtImg(ev.target.result);};r.readAsDataURL(f);}}/>
                {addDebtImg?(
                  <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:"1px solid "+t.border}}>
                    <img src={addDebtImg} alt="receipt" style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                      <button className="btn" style={{padding:"6px 14px",background:"white",color:"#0f172a",borderRadius:20,fontSize:12,fontWeight:600}} onClick={function(){setProofFullImg(addDebtImg);}}>View</button>
                      <button className="btn" style={{padding:"6px 14px",background:"rgba(255,255,255,0.2)",color:"white",border:"1px solid rgba(255,255,255,0.4)",borderRadius:20,fontSize:12}} onClick={function(){setAddDebtImg(null);addDebtFileRef.current.value="";}}>Remove</button>
                    </div>
                  </div>
                ):(
                  <div style={{border:"2px dashed "+t.border,borderRadius:12,padding:"20px",textAlign:"center",cursor:"pointer",background:t.surface2}} onClick={function(){addDebtFileRef.current&&addDebtFileRef.current.click();}}>
                    <Icon name="upload" size={22} color={t.text3} sw={1.5}/>
                    <div style={{fontSize:13,color:t.text3,marginTop:6,fontWeight:500}}>Tap to attach receipt</div>
                    <div style={{fontSize:11,color:t.text3,marginTop:2}}>JPG, PNG supported</div>
                  </div>
                )}
              </div>
              <button className="btn" style={{width:"100%",padding:14,background:addForm.type==="lend"?t.green:t.red,color:"white",fontSize:15,fontWeight:700,borderRadius:12}} onClick={handleAddDebt}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ACCOUNT SWITCH MODAL ── */}
      {switchModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setSwitchModal(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"14px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:16}}>Switch Account</div>
              {accounts.map(function(a){return(
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:12,cursor:"pointer",background:a.id===meId?t.primaryBg:"transparent",border:"1px solid "+(a.id===meId?t.primaryBorder:"transparent"),marginBottom:6}} onClick={function(){setMeId(a.id);setSwitchModal(false);setView("dashboard");showToast("Switched to "+a.name);}}>
                  <Avatar account={a} size={40}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:t.text}}>{a.name}</div>
                    <div style={{fontSize:12,color:t.text3}}>@{a.username}</div>
                  </div>
                  {a.id===meId&&<Icon name="check" size={16} color={t.primary} sw={2.5}/>}
                </div>
              );})}
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL ── */}
      {editProfile&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setEditProfile(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"14px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Edit Profile</div>
                <button className="btn" style={{width:30,height:30,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setEditProfile(false);}}><Icon name="x" size={13} color={t.text2} sw={2}/></button>
              </div>
              {/* Profile fields */}
              {[{key:"name",label:"Full Name",ph:"Your name"},{key:"username",label:"Username",ph:"@username"},{key:"bio",label:"Bio",ph:"About you"}].map(function(f){return(
                <div key={f.key} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:600,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{f.label}</div>
                  <input style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"10px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box"}} placeholder={f.ph} value={editForm[f.key]||""} onChange={function(e){var upd={};upd[f.key]=e.target.value;setEditForm(Object.assign({},editForm,upd));}}/>
                </div>
              );})}

              {/* Bank accounts */}
              <div style={{fontSize:12,fontWeight:600,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10,marginTop:8}}>Bank Accounts</div>
              {safeArr(me&&me.bankAccounts).map(function(ba){
                var BANK_COLORS={"BCA":"#0066AE","Mandiri":"#003d79","BNI":"#f15a22","BRI":"#004B8D","GoPay":"#00AED6","OVO":"#4c3494","Dana":"#118AE6","QRIS":"#e83b3b"};
                var bankColor=BANK_COLORS[ba.bank]||t.primary;
                return(
                  <div key={ba.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:t.surface2,borderRadius:12,marginBottom:8,border:"1px solid "+t.border}}>
                    <div style={{width:36,height:36,borderRadius:10,background:bankColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:800,color:"white"}}>{ba.bank.slice(0,3)}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>{ba.bank}</div>
                      <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:t.text3}}>{ba.number}</div>
                    </div>
                    <button className="btn" style={{width:28,height:28,borderRadius:"50%",background:t.redBg,border:"none",padding:0,flexShrink:0}} onClick={function(){setAccounts(accounts.map(function(a){if(a.id!==meId)return a;return Object.assign({},a,{bankAccounts:safeArr(a.bankAccounts).filter(function(x){return x.id!==ba.id;})});}));showToast("Removed!");}}>
                      <Icon name="x" size={12} color={t.red} sw={2}/>
                    </button>
                  </div>
                );
              })}
              <button className="btn" style={{width:"100%",padding:"11px",background:"transparent",color:t.primary,border:"1.5px dashed "+t.primaryBorder,borderRadius:12,fontSize:13,fontWeight:600,marginBottom:16}} onClick={function(){setBankForm({bank:"BCA",number:"",name:meName});setShowBankModal(true);}}>
                + Add Bank Account
              </button>

              <button className="btn" style={{width:"100%",padding:"14px",background:t.primary,color:"white",borderRadius:12,fontSize:14,fontWeight:700,marginBottom:8}} onClick={function(){setAccounts(accounts.map(function(a){return a.id===meId?Object.assign({},a,editForm):a;}));setEditProfile(false);showToast("Profile updated!");}}>Save Changes</button>
              <button className="btn" style={{width:"100%",padding:"12px",background:"transparent",color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setEditProfile(false);}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD BANK MODAL ── */}
      {showBankModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={function(){setShowBankModal(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 36px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Add Bank Account</div>
                <button className="btn" style={{width:30,height:30,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setShowBankModal(false);}}><Icon name="x" size={13} color={t.text2} sw={2}/></button>
              </div>
              {/* Bank selector */}
              <div style={{fontSize:12,fontWeight:600,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Bank / E-Wallet</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {["BCA","Mandiri","BNI","BRI","GoPay","OVO","Dana","QRIS"].map(function(b){
                  var BANK_COLORS={"BCA":"#0066AE","Mandiri":"#003d79","BNI":"#f15a22","BRI":"#004B8D","GoPay":"#00AED6","OVO":"#4c3494","Dana":"#118AE6","QRIS":"#e83b3b"};
                  var selected=bankForm.bank===b;
                  return(
                    <button key={b} className="btn" style={{padding:"8px 14px",borderRadius:20,border:"1.5px solid "+(selected?BANK_COLORS[b]:t.border),background:selected?BANK_COLORS[b]:"transparent",color:selected?"white":t.text3,fontSize:13,fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={function(){setBankForm(Object.assign({},bankForm,{bank:b}));}}>
                      {b}
                    </button>
                  );
                })}
              </div>
              {/* Account number */}
              <div style={{fontSize:12,fontWeight:600,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{bankForm.bank==="GoPay"||bankForm.bank==="OVO"||bankForm.bank==="Dana"?"Phone Number":"Account Number"}</div>
              <input style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"12px 14px",fontSize:16,color:t.text,fontFamily:"JetBrains Mono,monospace",outline:"none",boxSizing:"border-box",marginBottom:14}} placeholder={bankForm.bank==="GoPay"||bankForm.bank==="OVO"||bankForm.bank==="Dana"?"08xxxxxxxxxx":"Account number"} value={bankForm.number} onChange={function(e){setBankForm(Object.assign({},bankForm,{number:e.target.value}));}} type="tel"/>
              {/* Account name */}
              <div style={{fontSize:12,fontWeight:600,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Account Holder Name</div>
              <input style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"12px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:20}} placeholder="Your name on the account" value={bankForm.name} onChange={function(e){setBankForm(Object.assign({},bankForm,{name:e.target.value}));}}/>
              <button className="btn" style={{width:"100%",padding:"14px",background:t.primary,color:"white",borderRadius:12,fontSize:14,fontWeight:700}} onClick={function(){
                if(!bankForm.number||!bankForm.name){showToast("Please fill all fields","error");return;}
                var nb={id:"ba"+uid(),bank:bankForm.bank,number:bankForm.number,name:bankForm.name};
                setAccounts(accounts.map(function(a){
                  if(a.id!==meId)return a;
                  return Object.assign({},a,{bankAccounts:safeArr(a.bankAccounts).concat([nb])});
                }));
                setShowBankModal(false);
                showToast(bankForm.bank+" account added!");
              }}>Save Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ── INVITE MODAL ── */}
      {showInviteModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={function(){setShowInviteModal(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"14px auto 0"}}/>
            <div style={{padding:"16px 20px 40px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{fontSize:18,fontWeight:700,color:t.text}}>Invite Member</div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setShowInviteModal(false);}}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              {[{icon:"💬",label:"Invite via WhatsApp",sub:"Send to WA contact",action:function(){showToast("Opening WhatsApp...");setShowInviteModal(false);}},{icon:"🔗",label:"Invite via Link",sub:"Copy invite link",action:function(){showToast("Link copied! ✓");setShowInviteModal(false);}},{icon:"📱",label:"Invite via QR Code",sub:"Scan QR to join",action:function(){showToast("QR Code coming soon!");}}].map(function(item,i,arr){return(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid "+t.border:"none",cursor:"pointer"}} onClick={item.action}>
                  <div style={{width:42,height:42,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:t.text}}>{item.label}</div>
                    <div style={{fontSize:12,color:t.text3,marginTop:2}}>{item.sub}</div>
                  </div>
                  <Icon name="chevron" size={16} color={t.text3} sw={1.5}/>
                </div>
              );})}
              <button className="btn" style={{width:"100%",marginTop:16,padding:"16px",background:"linear-gradient(135deg,#29c36a,#15803d)",color:"white",fontSize:15,fontWeight:700,borderRadius:14}} onClick={function(){setShowInviteModal(false);}}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SPLIT DETAIL MODAL ── */}
      {splitDetail&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setSplitDetail(null);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:t.text}}>{splitDetail.title}</div>
                  <div style={{fontSize:12,color:t.text3,marginTop:2}}>{safeName(getAcc(splitDetail.payerId))} paid first</div>
                </div>
                <button className="btn" style={{width:32,height:32,borderRadius:"50%",background:t.surface2,border:"none",display:"flex",alignItems:"center",justifyContent:"center",padding:0}} onClick={function(){setSplitDetail(null);}}><Icon name="x" size={14} color={t.text2} sw={2}/></button>
              </div>
              {/* Summary */}
              <div style={{background:t.primaryBg,borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid "+t.primaryBorder}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:t.text2}}>Total</span>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:700,color:t.text}}>{fmt(splitDetail.totalAmount)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:t.text2}}>Your share</span>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:700,color:t.primary}}>{fmt((splitDetail.members.find(function(m){return m.accId===meId;})||{share:0}).share)}</span>
                </div>
              </div>
              {/* Receipt image */}
              {splitDetail.receiptImg&&(
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Receipt</div>
                  <img src={splitDetail.receiptImg} alt="receipt" style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:12,display:"block",cursor:"pointer",border:"1px solid "+t.border}} onClick={function(){setProofFullImg(splitDetail.receiptImg);}}/>
                </div>
              )}
              {/* Progress */}
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:t.text3}}>Payment progress</span>
                  <span style={{fontSize:12,color:t.text3}}>{splitDetail.members.filter(function(m){return m.paymentStatus==="verified";}).length}/{splitDetail.members.length} settled</span>
                </div>
                <div style={{background:t.surface2,borderRadius:4,height:8,overflow:"hidden"}}>
                  <div style={{width:(splitDetail.members.filter(function(m){return m.paymentStatus==="verified";}).length/splitDetail.members.length*100)+"%",height:"100%",background:t.primary,borderRadius:4}}/>
                </div>
              </div>
              {/* Members */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Members</div>
              {splitDetail.members.map(function(m){
                var a=getAcc(m.accId);
                var isMe=m.accId===meId;
                var isVerified=m.paymentStatus==="verified";
                var isPaying=m.paymentStatus==="paying";
                return(
                  <div key={m.accId} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:t.surface2,borderRadius:12,marginBottom:8,border:"1px solid "+t.border}}>
                    <Avatar account={a} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:t.text}}>{safeName(a)}{isMe?" (You)":""}</div>
                      <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:t.text3}}>{fmt(m.share)}</div>
                    </div>
                    {isVerified&&<span style={{fontSize:11,fontWeight:600,color:t.green,background:t.greenBg,padding:"3px 8px",borderRadius:20}}>✓ Paid</span>}
                    {isPaying&&splitDetail.payerId===meId&&(
                      <button className="btn" style={{padding:"4px 12px",fontSize:11,background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:20}} onClick={function(e){e.stopPropagation();setSplitVerifyMember(m);}}>View Proof</button>
                    )}
                    {isPaying&&splitDetail.payerId!==meId&&<span style={{fontSize:11,fontWeight:600,color:t.amber,background:"#fff7ed",padding:"3px 8px",borderRadius:20}}>Pending</span>}
                    {!isVerified&&!isPaying&&isMe&&m.accId!==splitDetail.payerId&&<button className="btn" style={{padding:"4px 10px",fontSize:11,background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:20}} onClick={function(){setSplitPayModal({split:splitDetail,member:m});setSplitPayNote("");setSplitPayImg(null);}}>Pay</button>}
                    {!isVerified&&!isPaying&&!isMe&&<span style={{fontSize:11,color:t.text3}}>Unpaid</span>}
                  </div>
                );
              })}
              <button className="btn" style={{width:"100%",marginTop:8,padding:"12px",background:t.surface2,color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setSplitDetail(null);}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE SPLIT MODAL ── */}
      {createSplit&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100}} onClick={function(){setCreateSplit(false);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 36px"}}>

              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.primaryBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="split" size={20} color={t.primary} sw={1.8}/>
                  </div>
                  <div>
                    <div style={{fontSize:18,fontWeight:700,color:t.text}}>Create Split Bill</div>
                    <div style={{fontSize:12,color:t.text3}}>Split expenses with friends</div>
                  </div>
                </div>
                <button className="btn" style={{width:30,height:30,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setCreateSplit(false);}}><Icon name="x" size={13} color={t.text2} sw={2}/></button>
              </div>

              {/* AI Scan banner */}
              <div style={{background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid #e9d5ff",display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:28,flexShrink:0}}>🤖</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#7c3aed"}}>AI-Powered Scan</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>Scan receipt and AI splits automatically</div>
                </div>
                <button className="btn" style={{background:"#7c3aed",color:"white",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,flexShrink:0}} onClick={function(){showToast("AI scan coming soon!");}}>
                  Scan
                </button>
              </div>

              {/* Title */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Title *</div>
              <input style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"11px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:14}} placeholder="e.g. Makan malam, Trip Bali..." value={splitForm.title} onChange={function(e){setSplitForm(Object.assign({},splitForm,{title:e.target.value}));}}/>

              {/* Total Amount */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Total Amount (Rp) *</div>
              <div style={{display:"flex",alignItems:"center",gap:8,background:t.surface2,borderRadius:10,padding:"10px 14px",border:"1px solid "+t.border,marginBottom:14}}>
                <span style={{fontSize:14,fontWeight:600,color:t.text3}}>Rp</span>
                <input type="number" style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:18,fontWeight:700,color:t.text,fontFamily:"JetBrains Mono,monospace"}} placeholder="0" value={splitForm.totalAmount} onChange={function(e){setSplitForm(Object.assign({},splitForm,{totalAmount:e.target.value}));}}/>
              </div>

              {/* Category */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Category</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {CATEGORIES.map(function(c){return(
                  <button key={c.id} className="btn" style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+(splitForm.category===c.id?t.primary:t.border),background:splitForm.category===c.id?t.primaryBg:"transparent",color:splitForm.category===c.id?t.primary:t.text3,fontSize:12,fontFamily:"Inter,sans-serif",fontWeight:splitForm.category===c.id?600:400}} onClick={function(){setSplitForm(Object.assign({},splitForm,{category:c.id}));}}>
                    {c.label}
                  </button>
                );})}
              </div>

              {/* Members */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>
                Add Members ({splitForm.memberIds.length+1} selected)
              </div>
              <div style={{marginBottom:16}}>
                {/* You (always included) */}
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:t.primaryBg,borderRadius:10,border:"1px solid "+t.primaryBorder,marginBottom:6}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:t.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:800,color:"white"}}>{meInitials}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:t.text}}>{meName} <span style={{fontSize:10,color:t.primary}}>(You)</span></div>
                  </div>
                  <Icon name="check" size={14} color={t.primary} sw={2.5}/>
                </div>
                {/* Connections */}
                {connIds.map(function(id){
                  var a=getAcc(id);
                  if(!a)return null;
                  var selected=splitForm.memberIds.includes(id);
                  return(
                    <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:selected?t.primaryBg:t.surface2,borderRadius:10,border:"1px solid "+(selected?t.primaryBorder:t.border),marginBottom:6,cursor:"pointer"}} onClick={function(){
                      var newIds=selected?splitForm.memberIds.filter(function(x){return x!==id;}):splitForm.memberIds.concat([id]);
                      setSplitForm(Object.assign({},splitForm,{memberIds:newIds}));
                    }}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:selected?t.primaryBg:t.surface,border:"1px solid "+(selected?t.primaryBorder:t.border),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:11,fontWeight:700,color:selected?t.primary:t.text3}}>{a.avatar}</span>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:t.text}}>{a.name}</div>
                        <div style={{fontSize:11,color:t.text3}}>@{a.username}</div>
                      </div>
                      <div style={{width:22,height:22,borderRadius:"50%",background:selected?t.primary:t.surface,border:"1px solid "+(selected?t.primary:t.border),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {selected&&<Icon name="check" size={11} color="white" sw={2.5}/>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Per person preview */}
              {splitForm.totalAmount&&(splitForm.memberIds.length+1)>0&&(
                <div style={{background:t.surface2,borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid "+t.border}}>
                  <span style={{fontSize:13,color:t.text2}}>Per person ({splitForm.memberIds.length+1} people)</span>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:800,color:t.primary}}>{fmt(Math.floor(parseInt(splitForm.totalAmount)/(splitForm.memberIds.length+1)))}</span>
                </div>
              )}

              {/* Receipt image */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Attach Receipt (Optional)</div>
              <input type="file" accept="image/*" ref={splitBillFileRef} style={{display:"none"}} onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setSplitBillImg(ev.target.result);};r.readAsDataURL(f);}}/>
              {splitBillImg?(
                <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:"1px solid "+t.border,marginBottom:16}}>
                  <img src={splitBillImg} alt="receipt" style={{width:"100%",maxHeight:140,objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                    <button className="btn" style={{padding:"5px 12px",background:"white",color:"#0f172a",borderRadius:20,fontSize:12}} onClick={function(){setProofFullImg(splitBillImg);}}>View</button>
                    <button className="btn" style={{padding:"5px 12px",background:"rgba(255,255,255,0.2)",color:"white",border:"1px solid rgba(255,255,255,0.4)",borderRadius:20,fontSize:12}} onClick={function(){setSplitBillImg(null);}}>Remove</button>
                  </div>
                </div>
              ):(
                <div style={{border:"2px dashed "+t.border,borderRadius:12,padding:"16px",textAlign:"center",cursor:"pointer",background:t.surface2,marginBottom:16}} onClick={function(){splitBillFileRef.current&&splitBillFileRef.current.click();}}>
                  <Icon name="upload" size={20} color={t.text3} sw={1.5}/>
                  <div style={{fontSize:12,color:t.text3,marginTop:6}}>Tap to attach receipt photo</div>
                </div>
              )}

              {/* Create button */}
              <button className="btn" style={{width:"100%",padding:"14px",background:t.primary,color:"white",borderRadius:12,fontSize:14,fontWeight:700,marginBottom:8}} onClick={function(){
                if(!splitForm.title||!splitForm.totalAmount){showToast("Please fill title and amount","error");return;}
                var total=parseInt(splitForm.totalAmount);
                var allMembers=[meId].concat(splitForm.memberIds);
                var perPerson=Math.floor(total/allMembers.length);
                var ns={
                  id:"sb"+uid(),
                  title:splitForm.title,
                  category:splitForm.category,
                  date:todayStr(),
                  totalAmount:total,
                  payerId:meId,
                  receiptImg:splitBillImg,
                  members:allMembers.map(function(aId){
                    return{accId:aId,share:perPerson,paid:aId===meId?perPerson:0,paymentStatus:aId===meId?"verified":"unpaid",payment:null};
                  }),
                };
                setSplits([ns].concat(splits));
                setSplitForm({title:"",totalAmount:"",category:"food",memberIds:[]});
                setSplitBillImg(null);
                setCreateSplit(false);
                showToast("Split bill created!");
              }}>Create Split Bill ✓</button>
              <button className="btn" style={{width:"100%",padding:"12px",background:"transparent",color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setCreateSplit(false);}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DIALOG ── */}
      {confirmDialog&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"0 20px"}} onClick={function(){setConfirmDialog(null);}}>
          <div style={{background:t.surface,borderRadius:20,padding:"24px",width:"100%",maxWidth:320}} onClick={function(e){e.stopPropagation();}}>
            <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:8}}>{confirmDialog.title}</div>
            <div style={{fontSize:14,color:t.text2,marginBottom:20}}>{confirmDialog.msg}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" style={{flex:1,padding:"12px",background:t.surface2,color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setConfirmDialog(null);}}>Cancel</button>
              <button className="btn" style={{flex:1,padding:"12px",background:t.primary,color:"white",borderRadius:12}} onClick={function(){if(confirmDialog.onConfirm)confirmDialog.onConfirm();setConfirmDialog(null);}}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?t.red:"#1f2937",color:"white",padding:"10px 18px",borderRadius:20,fontSize:13,fontWeight:500,zIndex:300,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.2)",animation:"toastIn 0.2s ease"}}>
          {toast.msg}
        </div>
      )}

      {/* ── SPLIT PAY MODAL ── */}
      {splitPayModal&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:250}} onClick={function(){setSplitPayModal(null);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 36px"}}>

              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:t.text}}>Pay Split Bill</div>
                  <div style={{fontSize:12,color:t.text3,marginTop:2}}>{splitPayModal.split.title}</div>
                </div>
                <button className="btn" style={{width:30,height:30,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setSplitPayModal(null);}}><Icon name="x" size={13} color={t.text2} sw={2}/></button>
              </div>

              {/* Amount card */}
              <div style={{background:"linear-gradient(135deg,#15803d,#166534)",borderRadius:14,padding:"16px 18px",marginBottom:20}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Your Share</div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:28,fontWeight:800,color:"white",marginBottom:8}}>{fmt(splitPayModal.member.share)}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:9,fontWeight:800,color:"white"}}>{(getAcc(splitPayModal.split.payerId)||{avatar:"?"}).avatar}</span>
                  </div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>Transfer to {safeName(getAcc(splitPayModal.split.payerId))}</span>
                </div>
              </div>

              {/* Payer bank accounts */}
              {(function(){
                var payer=getAcc(splitPayModal.split.payerId);
                var banks=payer?safeArr(payer.bankAccounts):[];
                var BANK_COLORS={"BCA":"#0066AE","Mandiri":"#003d79","BNI":"#f15a22","BRI":"#004B8D","GoPay":"#00AED6","OVO":"#4c3494","Dana":"#118AE6","QRIS":"#e83b3b"};
                var BANK_APPS={"GoPay":"gojek://","OVO":"ovo://","Dana":"dana://"};
                if(banks.length===0)return(
                  <div style={{background:t.surface2,borderRadius:12,padding:"12px 14px",marginBottom:16,textAlign:"center",border:"1px solid "+t.border}}>
                    <div style={{fontSize:13,color:t.text3}}>No bank account added by payer</div>
                  </div>
                );
                return(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Transfer To</div>
                    {banks.map(function(ba){
                      var bankColor=BANK_COLORS[ba.bank]||t.primary;
                      var appLink=BANK_APPS[ba.bank]||null;
                      return(
                        <div key={ba.id} style={{background:t.surface2,borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid "+t.border}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:34,height:34,borderRadius:10,background:bankColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <span style={{fontSize:11,fontWeight:800,color:"white"}}>{ba.bank.slice(0,3)}</span>
                              </div>
                              <div>
                                <div style={{fontSize:13,fontWeight:700,color:t.text}}>{ba.bank}</div>
                                <div style={{fontSize:11,color:t.text3}}>{ba.name}</div>
                              </div>
                            </div>
                            {appLink&&<button className="btn" style={{padding:"5px 10px",fontSize:11,background:bankColor,color:"white",borderRadius:20,fontWeight:600,flexShrink:0}} onClick={function(){window.open(appLink);}}>Open App</button>}
                          </div>
                          <div style={{background:t.surface,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"1px solid "+t.border}}>
                            <div>
                              <div style={{fontSize:11,color:t.text3,marginBottom:2}}>Account Number</div>
                              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:16,fontWeight:700,color:t.text,letterSpacing:"0.08em"}}>{ba.number}</div>
                            </div>
                            <button className="btn" style={{padding:"6px 12px",fontSize:12,background:t.primaryBg,color:t.primary,border:"1px solid "+t.primaryBorder,borderRadius:20,fontWeight:600,flexShrink:0}} onClick={function(){
                              if(navigator.clipboard){navigator.clipboard.writeText(ba.number);}
                              showToast("Copied! "+ba.number);
                            }}>Copy</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Upload proof */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Payment Proof *</div>
              <input type="file" accept="image/*" ref={splitPayFileRef} style={{display:"none"}} onChange={function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){setSplitPayImg(ev.target.result);};r.readAsDataURL(f);}}/>
              {splitPayImg?(
                <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:"1px solid "+t.border,marginBottom:12}}>
                  <img src={splitPayImg} alt="proof" style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                    <button className="btn" style={{padding:"6px 14px",background:"white",color:"#0f172a",borderRadius:20,fontSize:12}} onClick={function(){setProofFullImg(splitPayImg);}}>View</button>
                    <button className="btn" style={{padding:"6px 14px",background:"rgba(255,255,255,0.2)",color:"white",border:"1px solid rgba(255,255,255,0.4)",borderRadius:20,fontSize:12}} onClick={function(){setSplitPayImg(null);}}>Remove</button>
                  </div>
                </div>
              ):(
                <div style={{border:"2px dashed "+t.border,borderRadius:12,padding:"20px",textAlign:"center",cursor:"pointer",background:t.surface2,marginBottom:12}} onClick={function(){splitPayFileRef.current&&splitPayFileRef.current.click();}}>
                  <Icon name="upload" size={22} color={t.text3} sw={1.5}/>
                  <div style={{fontSize:13,color:t.text3,marginTop:8,fontWeight:500}}>Tap to upload transfer proof</div>
                  <div style={{fontSize:11,color:t.text3,marginTop:2}}>Photo of receipt / screenshot</div>
                </div>
              )}

              {/* Note */}
              <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8,marginTop:4}}>Note (Optional)</div>
              <input style={{width:"100%",background:t.surface2,border:"1px solid "+t.border,borderRadius:10,padding:"11px 14px",fontSize:14,color:t.text,fontFamily:"Inter,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:20}} placeholder="e.g. Paid via BCA transfer" value={splitPayNote} onChange={function(e){setSplitPayNote(e.target.value);}}/>

              {/* Submit */}
              <button className="btn" style={{width:"100%",padding:"14px",background:t.primary,color:"white",borderRadius:12,fontSize:14,fontWeight:700,marginBottom:8}} onClick={function(){
                handlePaySplitMember(splitPayModal.split.id,splitPayModal.member.accId);
                setSplits(splits.map(function(s){
                  if(s.id!==splitPayModal.split.id)return s;
                  return Object.assign({},s,{members:s.members.map(function(m){
                    if(m.accId!==splitPayModal.member.accId)return m;
                    return Object.assign({},m,{paymentStatus:"paying",payment:{payerNote:splitPayNote||"Paid",proofImage:splitPayImg,submittedAt:nowTime(),verifiedAt:null,disputeNote:null}});
                  })});
                }));
                setSplitPayModal(null);
                setSplitPayNote("");
                setSplitPayImg(null);
                showToast("Payment submitted! Waiting for confirmation.");
              }}>
                <Icon name="upload" size={16} color="white" sw={2}/> Submit Payment
              </button>
              <button className="btn" style={{width:"100%",padding:"12px",background:"transparent",color:t.text2,border:"1px solid "+t.border,borderRadius:12}} onClick={function(){setSplitPayModal(null);}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SPLIT VERIFY MEMBER POPUP ── */}
      {splitVerifyMember&&splitDetail&&(
        <div style={{position:"fixed",inset:0,background:t.modalBg,backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={function(){setSplitVerifyMember(null);}}>
          <div style={{background:t.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480}} onClick={function(e){e.stopPropagation();}}>
            <div style={{width:36,height:4,borderRadius:2,background:t.border,margin:"12px auto 0"}}/>
            <div style={{padding:"12px 16px 32px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar account={getAcc(splitVerifyMember.accId)} size={36}/>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,color:t.text}}>{safeName(getAcc(splitVerifyMember.accId))}</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:t.primary,fontWeight:600}}>{fmt(splitVerifyMember.share)}</div>
                  </div>
                </div>
                <button className="btn" style={{width:30,height:30,borderRadius:"50%",background:t.surface2,border:"none",padding:0}} onClick={function(){setSplitVerifyMember(null);}}><Icon name="x" size={13} color={t.text2} sw={2}/></button>
              </div>
              {/* Proof image */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Payment Proof</div>
                {splitVerifyMember.payment&&splitVerifyMember.payment.proofImage?(
                  <img src={splitVerifyMember.payment.proofImage} alt="proof" style={{width:"100%",maxHeight:220,objectFit:"cover",borderRadius:12,display:"block",cursor:"pointer"}} onClick={function(){setProofFullImg(splitVerifyMember.payment.proofImage);}}/>
                ):(
                  <div style={{background:t.surface2,borderRadius:12,padding:"24px",textAlign:"center",border:"1px dashed "+t.border}}>
                    <Icon name="upload" size={24} color={t.text3} sw={1.5}/>
                    <div style={{fontSize:13,color:t.text3,marginTop:8}}>No proof image attached</div>
                  </div>
                )}
                {splitVerifyMember.payment&&splitVerifyMember.payment.payerNote&&(
                  <div style={{marginTop:10,background:t.surface2,borderRadius:10,padding:"10px 14px",fontSize:13,color:t.text}}>
                    {splitVerifyMember.payment.payerNote}
                  </div>
                )}
                {splitVerifyMember.payment&&splitVerifyMember.payment.submittedAt&&(
                  <div style={{fontSize:11,color:t.text3,marginTop:6}}>{splitVerifyMember.payment.submittedAt}</div>
                )}
              </div>
              {/* Actions */}
              <div style={{display:"flex",gap:8}}>
                <button className="btn" style={{flex:1,padding:"13px",background:t.primary,color:"white",borderRadius:12,fontWeight:700,fontSize:14}} onClick={function(){handleVerifySplitMember(splitDetail.id,splitVerifyMember.accId);setSplitVerifyMember(null);}}>
                  <Icon name="check" size={14} color="white" sw={2}/> Confirm
                </button>
                <button className="btn" style={{flex:1,padding:"13px",background:t.redBg,color:t.red,border:"1px solid "+t.redBorder,borderRadius:12,fontWeight:700,fontSize:14}} onClick={function(){setSplitVerifyMember(null);showToast("Rejected","error");}}>
                  <Icon name="x" size={14} color={t.red} sw={2}/> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROOF FULL IMAGE ── */}
      {proofFullImg&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600}} onClick={function(){setProofFullImg(null);}}>
          <button style={{position:"absolute",top:20,right:20,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={function(){setProofFullImg(null);}}>
            <Icon name="x" size={16} color="white" sw={2}/>
          </button>
          <img src={proofFullImg} alt="proof" style={{maxWidth:"90%",maxHeight:"80vh",objectFit:"contain",borderRadius:12}}/>
        </div>
      )}

      {/* ── ONBOARDING ── */}
      {showOnboarding&&<Onboarding onDone={function(){setShowOnboarding(false);}}/>}
    </div>
  );
}
