import{C as tn}from"./index-lB1LqW2S.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const na="170",fl=0,Sa=1,dl=2,Ao=1,pl=2,en=3,Sn=0,xt=1,nn=2,Mn=0,ci=1,Ea=2,ba=3,Ta=4,ml=5,Nn=100,gl=101,_l=102,vl=103,xl=104,Ml=200,yl=201,Sl=202,El=203,ms=204,gs=205,bl=206,Tl=207,wl=208,Al=209,Rl=210,Cl=211,Pl=212,Dl=213,Ll=214,_s=0,vs=1,xs=2,di=3,Ms=4,ys=5,Ss=6,Es=7,Ro=0,Ul=1,Il=2,yn=0,Nl=1,Fl=2,Ol=3,Bl=4,zl=5,kl=6,Vl=7,Co=300,pi=301,mi=302,bs=303,Ts=304,Ir=306,Cr=1e3,On=1001,ws=1002,kt=1003,Hl=1004,qi=1005,Ot=1006,Br=1007,xn=1008,Xt=1009,Po=1010,Do=1011,Oi=1012,ia=1013,zn=1014,rn=1015,ki=1016,ra=1017,sa=1018,gi=1020,Lo=35902,Uo=1021,Io=1022,Bt=1023,No=1024,Fo=1025,hi=1026,_i=1027,aa=1028,oa=1029,Oo=1030,la=1031,ca=1033,Sr=33776,Er=33777,br=33778,Tr=33779,As=35840,Rs=35841,Cs=35842,Ps=35843,Ds=36196,Ls=37492,Us=37496,Is=37808,Ns=37809,Fs=37810,Os=37811,Bs=37812,zs=37813,ks=37814,Vs=37815,Hs=37816,Gs=37817,Ws=37818,Xs=37819,qs=37820,Ys=37821,wr=36492,Zs=36494,Ks=36495,Bo=36283,$s=36284,js=36285,Js=36286,Gl=3200,Wl=3201,Xl=0,ql=1,vn="",bt="srgb",xi="srgb-linear",Nr="linear",Ze="srgb",Gn=7680,wa=519,Yl=512,Zl=513,Kl=514,zo=515,$l=516,jl=517,Jl=518,Ql=519,Qs=35044,Aa="300 es",sn=2e3,Pr=2001;class Mi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ra=1234567;const Ni=Math.PI/180,Bi=180/Math.PI;function an(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ut[i&255]+ut[i>>8&255]+ut[i>>16&255]+ut[i>>24&255]+"-"+ut[e&255]+ut[e>>8&255]+"-"+ut[e>>16&15|64]+ut[e>>24&255]+"-"+ut[t&63|128]+ut[t>>8&255]+"-"+ut[t>>16&255]+ut[t>>24&255]+ut[n&255]+ut[n>>8&255]+ut[n>>16&255]+ut[n>>24&255]).toLowerCase()}function gt(i,e,t){return Math.max(e,Math.min(t,i))}function ha(i,e){return(i%e+e)%e}function ec(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function tc(i,e,t){return i!==e?(t-i)/(e-i):0}function Fi(i,e,t){return(1-t)*i+t*e}function nc(i,e,t,n){return Fi(i,e,1-Math.exp(-t*n))}function ic(i,e=1){return e-Math.abs(ha(i,e*2)-e)}function rc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function sc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ac(i,e){return i+Math.floor(Math.random()*(e-i+1))}function oc(i,e){return i+Math.random()*(e-i)}function lc(i){return i*(.5-Math.random())}function cc(i){i!==void 0&&(Ra=i);let e=Ra+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function hc(i){return i*Ni}function uc(i){return i*Bi}function fc(i){return(i&i-1)===0&&i!==0}function dc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mc(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),f=s((e-n)/2),d=a((e-n)/2),m=s((n-e)/2),_=a((n-e)/2);switch(r){case"XYX":i.set(o*h,l*f,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*f,o*c);break;case"ZXZ":i.set(l*f,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*_,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*_,o*c);break;case"ZYZ":i.set(l*_,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ye(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const gc={DEG2RAD:Ni,RAD2DEG:Bi,generateUUID:an,clamp:gt,euclideanModulo:ha,mapLinear:ec,inverseLerp:tc,lerp:Fi,damp:nc,pingpong:ic,smoothstep:rc,smootherstep:sc,randInt:ac,randFloat:oc,randFloatSpread:lc,seededRandom:cc,degToRad:hc,radToDeg:uc,isPowerOfTwo:fc,ceilPowerOfTwo:dc,floorPowerOfTwo:pc,setQuaternionFromProperEuler:mc,normalize:Ye,denormalize:Ft};class Ne{constructor(e=0,t=0){Ne.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ce{constructor(e,t,n,r,s,a,o,l,c){Ce.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],d=n[2],m=n[5],_=n[8],y=r[0],p=r[3],u=r[6],T=r[1],E=r[4],S=r[7],I=r[2],A=r[5],R=r[8];return s[0]=a*y+o*T+l*I,s[3]=a*p+o*E+l*A,s[6]=a*u+o*S+l*R,s[1]=c*y+h*T+f*I,s[4]=c*p+h*E+f*A,s[7]=c*u+h*S+f*R,s[2]=d*y+m*T+_*I,s[5]=d*p+m*E+_*A,s[8]=d*u+m*S+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,d=o*l-h*s,m=c*s-a*l,_=t*f+n*d+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/_;return e[0]=f*y,e[1]=(r*c-h*n)*y,e[2]=(o*n-r*a)*y,e[3]=d*y,e[4]=(h*t-r*l)*y,e[5]=(r*s-o*t)*y,e[6]=m*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*s)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(zr.makeScale(e,t)),this}rotate(e){return this.premultiply(zr.makeRotation(-e)),this}translate(e,t){return this.premultiply(zr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const zr=new Ce;function ko(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _c(){const i=Dr("canvas");return i.style.display="block",i}const Ca={};function Li(i){i in Ca||(Ca[i]=!0,console.warn(i))}function vc(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function xc(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Mc(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ve={enabled:!0,workingColorSpace:xi,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Ze&&(i.r=on(i.r),i.g=on(i.g),i.b=on(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Ze&&(i.r=ui(i.r),i.g=ui(i.g),i.b=ui(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===vn?Nr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function on(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ui(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Pa=[.64,.33,.3,.6,.15,.06],Da=[.2126,.7152,.0722],La=[.3127,.329],Ua=new Ce().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ia=new Ce().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ve.define({[xi]:{primaries:Pa,whitePoint:La,transfer:Nr,toXYZ:Ua,fromXYZ:Ia,luminanceCoefficients:Da,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:Pa,whitePoint:La,transfer:Ze,toXYZ:Ua,fromXYZ:Ia,luminanceCoefficients:Da,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}});let Wn;class yc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Wn===void 0&&(Wn=Dr("canvas")),Wn.width=e.width,Wn.height=e.height;const n=Wn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Wn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Dr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=on(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(on(t[n]/255)*255):t[n]=on(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Sc=0;class Vo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sc++}),this.uuid=an(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(kr(r[a].image)):s.push(kr(r[a]))}else s=kr(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function kr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?yc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ec=0;class _t extends Mi{constructor(e=_t.DEFAULT_IMAGE,t=_t.DEFAULT_MAPPING,n=On,r=On,s=Ot,a=xn,o=Bt,l=Xt,c=_t.DEFAULT_ANISOTROPY,h=vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ec++}),this.uuid=an(),this.name="",this.source=new Vo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ce,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Co)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cr:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case ws:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cr:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case ws:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_t.DEFAULT_IMAGE=null;_t.DEFAULT_MAPPING=Co;_t.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,n=0,r=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],m=l[5],_=l[9],y=l[2],p=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,S=(m+1)/2,I=(u+1)/2,A=(h+d)/4,R=(f+y)/4,U=(_+p)/4;return E>S&&E>I?E<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(E),r=A/n,s=R/n):S>I?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=A/r,s=U/r):I<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),n=R/s,r=U/s),this.set(n,r,s,t),this}let T=Math.sqrt((p-_)*(p-_)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(p-_)/T,this.y=(f-y)/T,this.z=(d-h)/T,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bc extends Mi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new _t(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Vo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kn extends bc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ho extends _t{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=kt,this.minFilter=kt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Go extends _t{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=kt,this.minFilter=kt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vn{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],h=n[r+2],f=n[r+3];const d=s[a+0],m=s[a+1],_=s[a+2],y=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=_,e[t+3]=y;return}if(f!==y||l!==d||c!==m||h!==_){let p=1-o;const u=l*d+c*m+h*_+f*y,T=u>=0?1:-1,E=1-u*u;if(E>Number.EPSILON){const I=Math.sqrt(E),A=Math.atan2(I,u*T);p=Math.sin(p*A)/I,o=Math.sin(o*A)/I}const S=o*T;if(l=l*p+d*S,c=c*p+m*S,h=h*p+_*S,f=f*p+y*S,p===1-o){const I=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=I,c*=I,h*=I,f*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],f=s[a],d=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+h*f+l*m-c*d,e[t+1]=l*_+h*d+c*f-o*m,e[t+2]=c*_+h*m+o*d-l*f,e[t+3]=h*_-o*f-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),f=o(s/2),d=l(n/2),m=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=d*h*f+c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f-d*m*_;break;case"YXZ":this._x=d*h*f+c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f+d*m*_;break;case"ZXY":this._x=d*h*f-c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f-d*m*_;break;case"ZYX":this._x=d*h*f-c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f+d*m*_;break;case"YZX":this._x=d*h*f+c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f-d*m*_;break;case"XZY":this._x=d*h*f-c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f+d*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=n+o+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(h-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(gt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-r*o,this._w=a*h-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*f+this._w*d,this._x=n*f+this._x*d,this._y=r*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,n=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Na.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Na.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),h=2*(o*t-s*r),f=2*(s*n-a*t);return this.x=t+l*c+a*f-o*h,this.y=n+l*h+o*c-s*f,this.z=r+l*f+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Vr.copy(this).projectOnVector(e),this.sub(Vr)}reflect(e){return this.sub(Vr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vr=new N,Na=new Vn;class Vi{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ut.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ut.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ut.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ut):Ut.fromBufferAttribute(s,a),Ut.applyMatrix4(e.matrixWorld),this.expandByPoint(Ut);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Yi.copy(n.boundingBox)),Yi.applyMatrix4(e.matrixWorld),this.union(Yi)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ut),Ut.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ti),Zi.subVectors(this.max,Ti),Xn.subVectors(e.a,Ti),qn.subVectors(e.b,Ti),Yn.subVectors(e.c,Ti),un.subVectors(qn,Xn),fn.subVectors(Yn,qn),Tn.subVectors(Xn,Yn);let t=[0,-un.z,un.y,0,-fn.z,fn.y,0,-Tn.z,Tn.y,un.z,0,-un.x,fn.z,0,-fn.x,Tn.z,0,-Tn.x,-un.y,un.x,0,-fn.y,fn.x,0,-Tn.y,Tn.x,0];return!Hr(t,Xn,qn,Yn,Zi)||(t=[1,0,0,0,1,0,0,0,1],!Hr(t,Xn,qn,Yn,Zi))?!1:(Ki.crossVectors(un,fn),t=[Ki.x,Ki.y,Ki.z],Hr(t,Xn,qn,Yn,Zi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ut).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ut).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Zt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Zt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Zt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Zt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Zt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Zt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Zt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Zt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Zt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Zt=[new N,new N,new N,new N,new N,new N,new N,new N],Ut=new N,Yi=new Vi,Xn=new N,qn=new N,Yn=new N,un=new N,fn=new N,Tn=new N,Ti=new N,Zi=new N,Ki=new N,wn=new N;function Hr(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){wn.fromArray(i,s);const o=r.x*Math.abs(wn.x)+r.y*Math.abs(wn.y)+r.z*Math.abs(wn.z),l=e.dot(wn),c=t.dot(wn),h=n.dot(wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Tc=new Vi,wi=new N,Gr=new N;class ua{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Tc.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wi.subVectors(e,this.center);const t=wi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(wi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wi.copy(e.center).add(Gr)),this.expandByPoint(wi.copy(e.center).sub(Gr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Kt=new N,Wr=new N,$i=new N,dn=new N,Xr=new N,ji=new N,qr=new N;class wc{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Kt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kt.copy(this.origin).addScaledVector(this.direction,t),Kt.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Wr.copy(e).add(t).multiplyScalar(.5),$i.copy(t).sub(e).normalize(),dn.copy(this.origin).sub(Wr);const s=e.distanceTo(t)*.5,a=-this.direction.dot($i),o=dn.dot(this.direction),l=-dn.dot($i),c=dn.lengthSq(),h=Math.abs(1-a*a);let f,d,m,_;if(h>0)if(f=a*l-o,d=a*o-l,_=s*h,f>=0)if(d>=-_)if(d<=_){const y=1/h;f*=y,d*=y,m=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d<=-_?(f=Math.max(0,-(-a*s+o)),d=f>0?-s:Math.min(Math.max(-s,-l),s),m=-f*f+d*(d+2*l)+c):d<=_?(f=0,d=Math.min(Math.max(-s,-l),s),m=d*(d+2*l)+c):(f=Math.max(0,-(a*s+o)),d=f>0?s:Math.min(Math.max(-s,-l),s),m=-f*f+d*(d+2*l)+c);else d=a>0?-s:s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Wr).addScaledVector($i,d),m}intersectSphere(e,t){Kt.subVectors(e.center,this.origin);const n=Kt.dot(this.direction),r=Kt.dot(Kt)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Kt)!==null}intersectTriangle(e,t,n,r,s){Xr.subVectors(t,e),ji.subVectors(n,e),qr.crossVectors(Xr,ji);let a=this.direction.dot(qr),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;dn.subVectors(this.origin,e);const l=o*this.direction.dot(ji.crossVectors(dn,ji));if(l<0)return null;const c=o*this.direction.dot(Xr.cross(dn));if(c<0||l+c>a)return null;const h=-o*dn.dot(qr);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class nt{constructor(e,t,n,r,s,a,o,l,c,h,f,d,m,_,y,p){nt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,h,f,d,m,_,y,p)}set(e,t,n,r,s,a,o,l,c,h,f,d,m,_,y,p){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=d,u[3]=m,u[7]=_,u[11]=y,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Zn.setFromMatrixColumn(e,0).length(),s=1/Zn.setFromMatrixColumn(e,1).length(),a=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=a*h,m=a*f,_=o*h,y=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=m+_*c,t[5]=d-y*c,t[9]=-o*l,t[2]=y-d*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,m=l*f,_=c*h,y=c*f;t[0]=d+y*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=m*o-_,t[6]=y+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,m=l*f,_=c*h,y=c*f;t[0]=d-y*o,t[4]=-a*f,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*h,t[9]=y-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,m=a*f,_=o*h,y=o*f;t[0]=l*h,t[4]=_*c-m,t[8]=d*c+y,t[1]=l*f,t[5]=y*c+d,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,_=o*l,y=o*c;t[0]=l*h,t[4]=y-d*f,t[8]=_*f+m,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*f+_,t[10]=d-y*f}else if(e.order==="XZY"){const d=a*l,m=a*c,_=o*l,y=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+y,t[5]=a*h,t[9]=m*f-_,t[2]=_*f-m,t[6]=o*h,t[10]=y*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ac,e,Rc)}lookAt(e,t,n){const r=this.elements;return St.subVectors(e,t),St.lengthSq()===0&&(St.z=1),St.normalize(),pn.crossVectors(n,St),pn.lengthSq()===0&&(Math.abs(n.z)===1?St.x+=1e-4:St.z+=1e-4,St.normalize(),pn.crossVectors(n,St)),pn.normalize(),Ji.crossVectors(St,pn),r[0]=pn.x,r[4]=Ji.x,r[8]=St.x,r[1]=pn.y,r[5]=Ji.y,r[9]=St.y,r[2]=pn.z,r[6]=Ji.z,r[10]=St.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],d=n[9],m=n[13],_=n[2],y=n[6],p=n[10],u=n[14],T=n[3],E=n[7],S=n[11],I=n[15],A=r[0],R=r[4],U=r[8],M=r[12],v=r[1],w=r[5],W=r[9],B=r[13],X=r[2],j=r[6],q=r[10],ie=r[14],H=r[3],O=r[7],$=r[11],ee=r[15];return s[0]=a*A+o*v+l*X+c*H,s[4]=a*R+o*w+l*j+c*O,s[8]=a*U+o*W+l*q+c*$,s[12]=a*M+o*B+l*ie+c*ee,s[1]=h*A+f*v+d*X+m*H,s[5]=h*R+f*w+d*j+m*O,s[9]=h*U+f*W+d*q+m*$,s[13]=h*M+f*B+d*ie+m*ee,s[2]=_*A+y*v+p*X+u*H,s[6]=_*R+y*w+p*j+u*O,s[10]=_*U+y*W+p*q+u*$,s[14]=_*M+y*B+p*ie+u*ee,s[3]=T*A+E*v+S*X+I*H,s[7]=T*R+E*w+S*j+I*O,s[11]=T*U+E*W+S*q+I*$,s[15]=T*M+E*B+S*ie+I*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],m=e[14],_=e[3],y=e[7],p=e[11],u=e[15];return _*(+s*l*f-r*c*f-s*o*d+n*c*d+r*o*m-n*l*m)+y*(+t*l*m-t*c*d+s*a*d-r*a*m+r*c*h-s*l*h)+p*(+t*c*f-t*o*m-s*a*f+n*a*m+s*o*h-n*c*h)+u*(-r*o*h-t*l*f+t*o*d+r*a*f-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],m=e[11],_=e[12],y=e[13],p=e[14],u=e[15],T=f*p*c-y*d*c+y*l*m-o*p*m-f*l*u+o*d*u,E=_*d*c-h*p*c-_*l*m+a*p*m+h*l*u-a*d*u,S=h*y*c-_*f*c+_*o*m-a*y*m-h*o*u+a*f*u,I=_*f*l-h*y*l-_*o*d+a*y*d+h*o*p-a*f*p,A=t*T+n*E+r*S+s*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=T*R,e[1]=(y*d*s-f*p*s-y*r*m+n*p*m+f*r*u-n*d*u)*R,e[2]=(o*p*s-y*l*s+y*r*c-n*p*c-o*r*u+n*l*u)*R,e[3]=(f*l*s-o*d*s-f*r*c+n*d*c+o*r*m-n*l*m)*R,e[4]=E*R,e[5]=(h*p*s-_*d*s+_*r*m-t*p*m-h*r*u+t*d*u)*R,e[6]=(_*l*s-a*p*s-_*r*c+t*p*c+a*r*u-t*l*u)*R,e[7]=(a*d*s-h*l*s+h*r*c-t*d*c-a*r*m+t*l*m)*R,e[8]=S*R,e[9]=(_*f*s-h*y*s-_*n*m+t*y*m+h*n*u-t*f*u)*R,e[10]=(a*y*s-_*o*s+_*n*c-t*y*c-a*n*u+t*o*u)*R,e[11]=(h*o*s-a*f*s-h*n*c+t*f*c+a*n*m-t*o*m)*R,e[12]=I*R,e[13]=(h*y*r-_*f*r+_*n*d-t*y*d-h*n*p+t*f*p)*R,e[14]=(_*o*r-a*y*r-_*n*l+t*y*l+a*n*p-t*o*p)*R,e[15]=(a*f*r-h*o*r+h*n*l-t*f*l-a*n*d+t*o*d)*R,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,f=o+o,d=s*c,m=s*h,_=s*f,y=a*h,p=a*f,u=o*f,T=l*c,E=l*h,S=l*f,I=n.x,A=n.y,R=n.z;return r[0]=(1-(y+u))*I,r[1]=(m+S)*I,r[2]=(_-E)*I,r[3]=0,r[4]=(m-S)*A,r[5]=(1-(d+u))*A,r[6]=(p+T)*A,r[7]=0,r[8]=(_+E)*R,r[9]=(p-T)*R,r[10]=(1-(d+y))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=Zn.set(r[0],r[1],r[2]).length();const a=Zn.set(r[4],r[5],r[6]).length(),o=Zn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],It.copy(this);const c=1/s,h=1/a,f=1/o;return It.elements[0]*=c,It.elements[1]*=c,It.elements[2]*=c,It.elements[4]*=h,It.elements[5]*=h,It.elements[6]*=h,It.elements[8]*=f,It.elements[9]*=f,It.elements[10]*=f,t.setFromRotationMatrix(It),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=sn){const l=this.elements,c=2*s/(t-e),h=2*s/(n-r),f=(t+e)/(t-e),d=(n+r)/(n-r);let m,_;if(o===sn)m=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Pr)m=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=sn){const l=this.elements,c=1/(t-e),h=1/(n-r),f=1/(a-s),d=(t+e)*c,m=(n+r)*h;let _,y;if(o===sn)_=(a+s)*f,y=-2*f;else if(o===Pr)_=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=y,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Zn=new N,It=new nt,Ac=new N(0,0,0),Rc=new N(1,1,1),pn=new N,Ji=new N,St=new N,Fa=new nt,Oa=new Vn;class Ht{constructor(e=0,t=0,n=0,r=Ht.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],f=r[2],d=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(gt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-gt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oa.setFromEuler(this),this.setFromQuaternion(Oa,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ht.DEFAULT_ORDER="XYZ";class Wo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Cc=0;const Ba=new N,Kn=new Vn,$t=new nt,Qi=new N,Ai=new N,Pc=new N,Dc=new Vn,za=new N(1,0,0),ka=new N(0,1,0),Va=new N(0,0,1),Ha={type:"added"},Lc={type:"removed"},$n={type:"childadded",child:null},Yr={type:"childremoved",child:null};class Mt extends Mi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cc++}),this.uuid=an(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new N,t=new Ht,n=new Vn,r=new N(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new nt},normalMatrix:{value:new Ce}}),this.matrix=new nt,this.matrixWorld=new nt,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Kn.setFromAxisAngle(e,t),this.quaternion.multiply(Kn),this}rotateOnWorldAxis(e,t){return Kn.setFromAxisAngle(e,t),this.quaternion.premultiply(Kn),this}rotateX(e){return this.rotateOnAxis(za,e)}rotateY(e){return this.rotateOnAxis(ka,e)}rotateZ(e){return this.rotateOnAxis(Va,e)}translateOnAxis(e,t){return Ba.copy(e).applyQuaternion(this.quaternion),this.position.add(Ba.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(za,e)}translateY(e){return this.translateOnAxis(ka,e)}translateZ(e){return this.translateOnAxis(Va,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($t.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Qi.copy(e):Qi.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Ai.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$t.lookAt(Ai,Qi,this.up):$t.lookAt(Qi,Ai,this.up),this.quaternion.setFromRotationMatrix($t),r&&($t.extractRotation(r.matrixWorld),Kn.setFromRotationMatrix($t),this.quaternion.premultiply(Kn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ha),$n.child=e,this.dispatchEvent($n),$n.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lc),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$t.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$t.multiply(e.parent.matrixWorld)),e.applyMatrix4($t),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ha),$n.child=e,this.dispatchEvent($n),$n.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,e,Pc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,Dc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=r,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Mt.DEFAULT_UP=new N(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nt=new N,jt=new N,Zr=new N,Jt=new N,jn=new N,Jn=new N,Ga=new N,Kr=new N,$r=new N,jr=new N,Jr=new tt,Qr=new tt,es=new tt;class Pt{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Nt.subVectors(e,t),r.cross(Nt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Nt.subVectors(r,t),jt.subVectors(n,t),Zr.subVectors(e,t);const a=Nt.dot(Nt),o=Nt.dot(jt),l=Nt.dot(Zr),c=jt.dot(jt),h=jt.dot(Zr),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const d=1/f,m=(c*l-o*h)*d,_=(a*h-o*l)*d;return s.set(1-m-_,_,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Jt)===null?!1:Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,Jt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Jt.x),l.addScaledVector(a,Jt.y),l.addScaledVector(o,Jt.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Jr.setScalar(0),Qr.setScalar(0),es.setScalar(0),Jr.fromBufferAttribute(e,t),Qr.fromBufferAttribute(e,n),es.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Jr,s.x),a.addScaledVector(Qr,s.y),a.addScaledVector(es,s.z),a}static isFrontFacing(e,t,n,r){return Nt.subVectors(n,t),jt.subVectors(e,t),Nt.cross(jt).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nt.subVectors(this.c,this.b),jt.subVectors(this.a,this.b),Nt.cross(jt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Pt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Pt.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Pt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;jn.subVectors(r,n),Jn.subVectors(s,n),Kr.subVectors(e,n);const l=jn.dot(Kr),c=Jn.dot(Kr);if(l<=0&&c<=0)return t.copy(n);$r.subVectors(e,r);const h=jn.dot($r),f=Jn.dot($r);if(h>=0&&f<=h)return t.copy(r);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(jn,a);jr.subVectors(e,s);const m=jn.dot(jr),_=Jn.dot(jr);if(_>=0&&m<=_)return t.copy(s);const y=m*c-l*_;if(y<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(Jn,o);const p=h*_-m*f;if(p<=0&&f-h>=0&&m-_>=0)return Ga.subVectors(s,r),o=(f-h)/(f-h+(m-_)),t.copy(r).addScaledVector(Ga,o);const u=1/(p+y+d);return a=y*u,o=d*u,t.copy(n).addScaledVector(jn,a).addScaledVector(Jn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Xo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mn={h:0,s:0,l:0},er={h:0,s:0,l:0};function ts(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ve.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Ve.workingColorSpace){if(e=ha(e,1),t=gt(t,0,1),n=gt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ts(a,s,e+1/3),this.g=ts(a,s,e),this.b=ts(a,s,e-1/3)}return Ve.toWorkingColorSpace(this,r),this}setStyle(e,t=bt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){const n=Xo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=on(e.r),this.g=on(e.g),this.b=on(e.b),this}copyLinearToSRGB(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return Ve.fromWorkingColorSpace(ft.copy(this),e),Math.round(gt(ft.r*255,0,255))*65536+Math.round(gt(ft.g*255,0,255))*256+Math.round(gt(ft.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.fromWorkingColorSpace(ft.copy(this),t);const n=ft.r,r=ft.g,s=ft.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ve.workingColorSpace){return Ve.fromWorkingColorSpace(ft.copy(this),t),e.r=ft.r,e.g=ft.g,e.b=ft.b,e}getStyle(e=bt){Ve.fromWorkingColorSpace(ft.copy(this),e);const t=ft.r,n=ft.g,r=ft.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(mn),this.setHSL(mn.h+e,mn.s+t,mn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(mn),e.getHSL(er);const n=Fi(mn.h,er.h,t),r=Fi(mn.s,er.s,t),s=Fi(mn.l,er.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ft=new Xe;Xe.NAMES=Xo;let Uc=0;class Hi extends Mi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uc++}),this.uuid=an(),this.name="",this.blending=ci,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ms,this.blendDst=gs,this.blendEquation=Nn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=di,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gn,this.stencilZFail=Gn,this.stencilZPass=Gn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ci&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ms&&(n.blendSrc=this.blendSrc),this.blendDst!==gs&&(n.blendDst=this.blendDst),this.blendEquation!==Nn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==di&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Gn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Gn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class fa extends Hi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ht,this.combine=Ro,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const st=new N,tr=new Ne;class Vt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qs,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)tr.fromBufferAttribute(this,t),tr.applyMatrix3(e),this.setXY(t,tr.x,tr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyMatrix3(e),this.setXYZ(t,st.x,st.y,st.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyMatrix4(e),this.setXYZ(t,st.x,st.y,st.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyNormalMatrix(e),this.setXYZ(t,st.x,st.y,st.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.transformDirection(e),this.setXYZ(t,st.x,st.y,st.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ye(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ft(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ft(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ft(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ft(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),r=Ye(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),r=Ye(r,this.array),s=Ye(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qs&&(e.usage=this.usage),e}}class qo extends Vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Yo extends Vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Bn extends Vt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Ic=0;const At=new nt,ns=new Mt,Qn=new N,Et=new Vi,Ri=new Vi,ct=new N;class En extends Mi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ic++}),this.uuid=an(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ko(e)?Yo:qo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ce().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return At.makeRotationFromQuaternion(e),this.applyMatrix4(At),this}rotateX(e){return At.makeRotationX(e),this.applyMatrix4(At),this}rotateY(e){return At.makeRotationY(e),this.applyMatrix4(At),this}rotateZ(e){return At.makeRotationZ(e),this.applyMatrix4(At),this}translate(e,t,n){return At.makeTranslation(e,t,n),this.applyMatrix4(At),this}scale(e,t,n){return At.makeScale(e,t,n),this.applyMatrix4(At),this}lookAt(e){return ns.lookAt(e),ns.updateMatrix(),this.applyMatrix4(ns.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qn).negate(),this.translate(Qn.x,Qn.y,Qn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Bn(n,3))}else{for(let n=0,r=t.count;n<r;n++){const s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Et.setFromBufferAttribute(s),this.morphTargetsRelative?(ct.addVectors(this.boundingBox.min,Et.min),this.boundingBox.expandByPoint(ct),ct.addVectors(this.boundingBox.max,Et.max),this.boundingBox.expandByPoint(ct)):(this.boundingBox.expandByPoint(Et.min),this.boundingBox.expandByPoint(Et.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ua);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(Et.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ri.setFromBufferAttribute(o),this.morphTargetsRelative?(ct.addVectors(Et.min,Ri.min),Et.expandByPoint(ct),ct.addVectors(Et.max,Ri.max),Et.expandByPoint(ct)):(Et.expandByPoint(Ri.min),Et.expandByPoint(Ri.max))}Et.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)ct.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(ct));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ct.fromBufferAttribute(o,c),l&&(Qn.fromBufferAttribute(e,c),ct.add(Qn)),r=Math.max(r,n.distanceToSquared(ct))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Vt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<n.count;U++)o[U]=new N,l[U]=new N;const c=new N,h=new N,f=new N,d=new Ne,m=new Ne,_=new Ne,y=new N,p=new N;function u(U,M,v){c.fromBufferAttribute(n,U),h.fromBufferAttribute(n,M),f.fromBufferAttribute(n,v),d.fromBufferAttribute(s,U),m.fromBufferAttribute(s,M),_.fromBufferAttribute(s,v),h.sub(c),f.sub(c),m.sub(d),_.sub(d);const w=1/(m.x*_.y-_.x*m.y);isFinite(w)&&(y.copy(h).multiplyScalar(_.y).addScaledVector(f,-m.y).multiplyScalar(w),p.copy(f).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(w),o[U].add(y),o[M].add(y),o[v].add(y),l[U].add(p),l[M].add(p),l[v].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let U=0,M=T.length;U<M;++U){const v=T[U],w=v.start,W=v.count;for(let B=w,X=w+W;B<X;B+=3)u(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const E=new N,S=new N,I=new N,A=new N;function R(U){I.fromBufferAttribute(r,U),A.copy(I);const M=o[U];E.copy(M),E.sub(I.multiplyScalar(I.dot(M))).normalize(),S.crossVectors(A,M);const w=S.dot(l[U])<0?-1:1;a.setXYZW(U,E.x,E.y,E.z,w)}for(let U=0,M=T.length;U<M;++U){const v=T[U],w=v.start,W=v.count;for(let B=w,X=w+W;B<X;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const r=new N,s=new N,a=new N,o=new N,l=new N,c=new N,h=new N,f=new N;if(e)for(let d=0,m=e.count;d<m;d+=3){const _=e.getX(d+0),y=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,y),a.fromBufferAttribute(t,p),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ct.fromBufferAttribute(e,t),ct.normalize(),e.setXYZ(t,ct.x,ct.y,ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let m=0,_=0;for(let y=0,p=l.length;y<p;y++){o.isInterleavedBufferAttribute?m=l[y]*o.data.stride+o.offset:m=l[y]*h;for(let u=0;u<h;u++)d[_++]=c[m++]}return new Vt(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new En,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],m=e(d,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];h.push(m.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,m=f.length;d<m;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wa=new nt,An=new wc,nr=new ua,Xa=new N,ir=new N,rr=new N,sr=new N,is=new N,ar=new N,qa=new N,or=new N;class zt extends Mt{constructor(e=new En,t=new fa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){ar.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],f=s[l];h!==0&&(is.fromBufferAttribute(f,e),a?ar.addScaledVector(is,h):ar.addScaledVector(is.sub(t),h))}t.add(ar)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(s),An.copy(e.ray).recast(e.near),!(nr.containsPoint(An.origin)===!1&&(An.intersectSphere(nr,Xa)===null||An.origin.distanceToSquared(Xa)>(e.far-e.near)**2))&&(Wa.copy(s).invert(),An.copy(e.ray).applyMatrix4(Wa),!(n.boundingBox!==null&&An.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,An)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,y=d.length;_<y;_++){const p=d[_],u=a[p.materialIndex],T=Math.max(p.start,m.start),E=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,I=E;S<I;S+=3){const A=o.getX(S),R=o.getX(S+1),U=o.getX(S+2);r=lr(this,u,e,n,c,h,f,A,R,U),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),y=Math.min(o.count,m.start+m.count);for(let p=_,u=y;p<u;p+=3){const T=o.getX(p),E=o.getX(p+1),S=o.getX(p+2);r=lr(this,a,e,n,c,h,f,T,E,S),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,y=d.length;_<y;_++){const p=d[_],u=a[p.materialIndex],T=Math.max(p.start,m.start),E=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,I=E;S<I;S+=3){const A=S,R=S+1,U=S+2;r=lr(this,u,e,n,c,h,f,A,R,U),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),y=Math.min(l.count,m.start+m.count);for(let p=_,u=y;p<u;p+=3){const T=p,E=p+1,S=p+2;r=lr(this,a,e,n,c,h,f,T,E,S),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function Nc(i,e,t,n,r,s,a,o){let l;if(e.side===xt?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===Sn,o),l===null)return null;or.copy(o),or.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(or);return c<t.near||c>t.far?null:{distance:c,point:or.clone(),object:i}}function lr(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,ir),i.getVertexPosition(l,rr),i.getVertexPosition(c,sr);const h=Nc(i,e,t,n,ir,rr,sr,qa);if(h){const f=new N;Pt.getBarycoord(qa,ir,rr,sr,f),r&&(h.uv=Pt.getInterpolatedAttribute(r,o,l,c,f,new Ne)),s&&(h.uv1=Pt.getInterpolatedAttribute(s,o,l,c,f,new Ne)),a&&(h.normal=Pt.getInterpolatedAttribute(a,o,l,c,f,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new N,materialIndex:0};Pt.getNormal(ir,rr,sr,d.normal),h.face=d,h.barycoord=f}return h}class yi extends En{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,m=0;_("z","y","x",-1,-1,n,t,e,a,s,0),_("z","y","x",1,-1,n,t,-e,a,s,1),_("x","z","y",1,1,e,n,t,r,a,2),_("x","z","y",1,-1,e,n,-t,r,a,3),_("x","y","z",1,-1,e,t,n,r,s,4),_("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Bn(c,3)),this.setAttribute("normal",new Bn(h,3)),this.setAttribute("uv",new Bn(f,2));function _(y,p,u,T,E,S,I,A,R,U,M){const v=S/R,w=I/U,W=S/2,B=I/2,X=A/2,j=R+1,q=U+1;let ie=0,H=0;const O=new N;for(let $=0;$<q;$++){const ee=$*w-B;for(let le=0;le<j;le++){const we=le*v-W;O[y]=we*T,O[p]=ee*E,O[u]=X,c.push(O.x,O.y,O.z),O[y]=0,O[p]=0,O[u]=A>0?1:-1,h.push(O.x,O.y,O.z),f.push(le/R),f.push(1-$/U),ie+=1}}for(let $=0;$<U;$++)for(let ee=0;ee<R;ee++){const le=d+ee+j*$,we=d+ee+j*($+1),V=d+(ee+1)+j*($+1),J=d+(ee+1)+j*$;l.push(le,we,J),l.push(we,V,J),H+=6}o.addGroup(m,H,M),m+=H,d+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function vi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function pt(i){const e={};for(let t=0;t<i.length;t++){const n=vi(i[t]);for(const r in n)e[r]=n[r]}return e}function Fc(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Zo(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ve.workingColorSpace}const Oc={clone:vi,merge:pt};var Bc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ln extends Hi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bc,this.fragmentShader=zc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=vi(e.uniforms),this.uniformsGroups=Fc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Ko extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nt,this.projectionMatrix=new nt,this.projectionMatrixInverse=new nt,this.coordinateSystem=sn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gn=new N,Ya=new Ne,Za=new Ne;class Ct extends Ko{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Bi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ni*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bi*2*Math.atan(Math.tan(Ni*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){gn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gn.x,gn.y).multiplyScalar(-e/gn.z),gn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gn.x,gn.y).multiplyScalar(-e/gn.z)}getViewSize(e,t){return this.getViewBounds(e,Ya,Za),t.subVectors(Za,Ya)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ni*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ei=-90,ti=1;class kc extends Mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ct(ei,ti,e,t);r.layers=this.layers,this.add(r);const s=new Ct(ei,ti,e,t);s.layers=this.layers,this.add(s);const a=new Ct(ei,ti,e,t);a.layers=this.layers,this.add(a);const o=new Ct(ei,ti,e,t);o.layers=this.layers,this.add(o);const l=new Ct(ei,ti,e,t);l.layers=this.layers,this.add(l);const c=new Ct(ei,ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===sn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(f,d,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class $o extends _t{constructor(e,t,n,r,s,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:pi,super(e,t,n,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Vc extends kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new $o(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ot}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new yi(5,5,5),s=new ln({name:"CubemapFromEquirect",uniforms:vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:xt,blending:Mn});s.uniforms.tEquirect.value=t;const a=new zt(r,s),o=t.minFilter;return t.minFilter===xn&&(t.minFilter=Ot),new kc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const rs=new N,Hc=new N,Gc=new Ce;class Dn{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=rs.subVectors(n,t).cross(Hc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(rs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Gc.getNormalMatrix(e),r=this.coplanarPoint(rs).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Rn=new ua,cr=new N;class jo{constructor(e=new Dn,t=new Dn,n=new Dn,r=new Dn,s=new Dn,a=new Dn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=sn){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],f=r[6],d=r[7],m=r[8],_=r[9],y=r[10],p=r[11],u=r[12],T=r[13],E=r[14],S=r[15];if(n[0].setComponents(l-s,d-c,p-m,S-u).normalize(),n[1].setComponents(l+s,d+c,p+m,S+u).normalize(),n[2].setComponents(l+a,d+h,p+_,S+T).normalize(),n[3].setComponents(l-a,d-h,p-_,S-T).normalize(),n[4].setComponents(l-o,d-f,p-y,S-E).normalize(),t===sn)n[5].setComponents(l+o,d+f,p+y,S+E).normalize();else if(t===Pr)n[5].setComponents(o,f,y,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Rn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Rn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Rn)}intersectsSprite(e){return Rn.center.set(0,0,0),Rn.radius=.7071067811865476,Rn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Rn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(cr.x=r.normal.x>0?e.max.x:e.min.x,cr.y=r.normal.y>0?e.max.y:e.min.y,cr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(cr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jo(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Wc(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((m,_)=>m.start-_.start);let d=0;for(let m=1;m<f.length;m++){const _=f[d],y=f[m];y.start<=_.start+_.count+1?_.count=Math.max(_.count,y.start+y.count-_.start):(++d,f[d]=y)}f.length=d+1;for(let m=0,_=f.length;m<_;m++){const y=f[m];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Gi extends En{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,f=e/o,d=t/l,m=[],_=[],y=[],p=[];for(let u=0;u<h;u++){const T=u*d-a;for(let E=0;E<c;E++){const S=E*f-s;_.push(S,-T,0),y.push(0,0,1),p.push(E/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let T=0;T<o;T++){const E=T+c*u,S=T+c*(u+1),I=T+1+c*(u+1),A=T+1+c*u;m.push(E,S,A),m.push(S,I,A)}this.setIndex(m),this.setAttribute("position",new Bn(_,3)),this.setAttribute("normal",new Bn(y,3)),this.setAttribute("uv",new Bn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Xc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qc=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Zc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$c=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qc=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,eh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,th=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ih=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ah=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,oh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ch=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ph=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_h=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Eh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Th=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ah=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ch=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ph=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Uh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ih=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Nh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Oh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zh=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gh=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wh=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zh=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kh=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$h=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,eu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ru=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,su=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,au=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ou=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,du=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_u=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Su=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Eu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Au=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ru=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Pu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Du=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uu=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Nu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ou=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bu=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zu=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ku=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Wu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xu=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ku=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$u=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ju=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ju=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qu=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ef=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,af=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,of=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ff=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,df=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_f=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ef=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ie={alphahash_fragment:Xc,alphahash_pars_fragment:qc,alphamap_fragment:Yc,alphamap_pars_fragment:Zc,alphatest_fragment:Kc,alphatest_pars_fragment:$c,aomap_fragment:jc,aomap_pars_fragment:Jc,batching_pars_vertex:Qc,batching_vertex:eh,begin_vertex:th,beginnormal_vertex:nh,bsdfs:ih,iridescence_fragment:rh,bumpmap_pars_fragment:sh,clipping_planes_fragment:ah,clipping_planes_pars_fragment:oh,clipping_planes_pars_vertex:lh,clipping_planes_vertex:ch,color_fragment:hh,color_pars_fragment:uh,color_pars_vertex:fh,color_vertex:dh,common:ph,cube_uv_reflection_fragment:mh,defaultnormal_vertex:gh,displacementmap_pars_vertex:_h,displacementmap_vertex:vh,emissivemap_fragment:xh,emissivemap_pars_fragment:Mh,colorspace_fragment:yh,colorspace_pars_fragment:Sh,envmap_fragment:Eh,envmap_common_pars_fragment:bh,envmap_pars_fragment:Th,envmap_pars_vertex:wh,envmap_physical_pars_fragment:Oh,envmap_vertex:Ah,fog_vertex:Rh,fog_pars_vertex:Ch,fog_fragment:Ph,fog_pars_fragment:Dh,gradientmap_pars_fragment:Lh,lightmap_pars_fragment:Uh,lights_lambert_fragment:Ih,lights_lambert_pars_fragment:Nh,lights_pars_begin:Fh,lights_toon_fragment:Bh,lights_toon_pars_fragment:zh,lights_phong_fragment:kh,lights_phong_pars_fragment:Vh,lights_physical_fragment:Hh,lights_physical_pars_fragment:Gh,lights_fragment_begin:Wh,lights_fragment_maps:Xh,lights_fragment_end:qh,logdepthbuf_fragment:Yh,logdepthbuf_pars_fragment:Zh,logdepthbuf_pars_vertex:Kh,logdepthbuf_vertex:$h,map_fragment:jh,map_pars_fragment:Jh,map_particle_fragment:Qh,map_particle_pars_fragment:eu,metalnessmap_fragment:tu,metalnessmap_pars_fragment:nu,morphinstance_vertex:iu,morphcolor_vertex:ru,morphnormal_vertex:su,morphtarget_pars_vertex:au,morphtarget_vertex:ou,normal_fragment_begin:lu,normal_fragment_maps:cu,normal_pars_fragment:hu,normal_pars_vertex:uu,normal_vertex:fu,normalmap_pars_fragment:du,clearcoat_normal_fragment_begin:pu,clearcoat_normal_fragment_maps:mu,clearcoat_pars_fragment:gu,iridescence_pars_fragment:_u,opaque_fragment:vu,packing:xu,premultiplied_alpha_fragment:Mu,project_vertex:yu,dithering_fragment:Su,dithering_pars_fragment:Eu,roughnessmap_fragment:bu,roughnessmap_pars_fragment:Tu,shadowmap_pars_fragment:wu,shadowmap_pars_vertex:Au,shadowmap_vertex:Ru,shadowmask_pars_fragment:Cu,skinbase_vertex:Pu,skinning_pars_vertex:Du,skinning_vertex:Lu,skinnormal_vertex:Uu,specularmap_fragment:Iu,specularmap_pars_fragment:Nu,tonemapping_fragment:Fu,tonemapping_pars_fragment:Ou,transmission_fragment:Bu,transmission_pars_fragment:zu,uv_pars_fragment:ku,uv_pars_vertex:Vu,uv_vertex:Hu,worldpos_vertex:Gu,background_vert:Wu,background_frag:Xu,backgroundCube_vert:qu,backgroundCube_frag:Yu,cube_vert:Zu,cube_frag:Ku,depth_vert:$u,depth_frag:ju,distanceRGBA_vert:Ju,distanceRGBA_frag:Qu,equirect_vert:ef,equirect_frag:tf,linedashed_vert:nf,linedashed_frag:rf,meshbasic_vert:sf,meshbasic_frag:af,meshlambert_vert:of,meshlambert_frag:lf,meshmatcap_vert:cf,meshmatcap_frag:hf,meshnormal_vert:uf,meshnormal_frag:ff,meshphong_vert:df,meshphong_frag:pf,meshphysical_vert:mf,meshphysical_frag:gf,meshtoon_vert:_f,meshtoon_frag:vf,points_vert:xf,points_frag:Mf,shadow_vert:yf,shadow_frag:Sf,sprite_vert:Ef,sprite_frag:bf},ae={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ce},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ce}},envmap:{envMap:{value:null},envMapRotation:{value:new Ce},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ce}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ce}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ce},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ce},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ce},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ce}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ce}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ce}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0},uvTransform:{value:new Ce}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ce},alphaMap:{value:null},alphaMapTransform:{value:new Ce},alphaTest:{value:0}}},Wt={basic:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Ie.meshbasic_vert,fragmentShader:Ie.meshbasic_frag},lambert:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Ie.meshlambert_vert,fragmentShader:Ie.meshlambert_frag},phong:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Ie.meshphong_vert,fragmentShader:Ie.meshphong_frag},standard:{uniforms:pt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag},toon:{uniforms:pt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Ie.meshtoon_vert,fragmentShader:Ie.meshtoon_frag},matcap:{uniforms:pt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Ie.meshmatcap_vert,fragmentShader:Ie.meshmatcap_frag},points:{uniforms:pt([ae.points,ae.fog]),vertexShader:Ie.points_vert,fragmentShader:Ie.points_frag},dashed:{uniforms:pt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ie.linedashed_vert,fragmentShader:Ie.linedashed_frag},depth:{uniforms:pt([ae.common,ae.displacementmap]),vertexShader:Ie.depth_vert,fragmentShader:Ie.depth_frag},normal:{uniforms:pt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ie.meshnormal_vert,fragmentShader:Ie.meshnormal_frag},sprite:{uniforms:pt([ae.sprite,ae.fog]),vertexShader:Ie.sprite_vert,fragmentShader:Ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Ce},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ie.background_vert,fragmentShader:Ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ce}},vertexShader:Ie.backgroundCube_vert,fragmentShader:Ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ie.cube_vert,fragmentShader:Ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ie.equirect_vert,fragmentShader:Ie.equirect_frag},distanceRGBA:{uniforms:pt([ae.common,ae.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ie.distanceRGBA_vert,fragmentShader:Ie.distanceRGBA_frag},shadow:{uniforms:pt([ae.lights,ae.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Ie.shadow_vert,fragmentShader:Ie.shadow_frag}};Wt.physical={uniforms:pt([Wt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ce},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ce},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ce},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ce},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ce},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ce},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ce},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ce},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ce},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ce},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ce},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ce}}]),vertexShader:Ie.meshphysical_vert,fragmentShader:Ie.meshphysical_frag};const hr={r:0,b:0,g:0},Cn=new Ht,Tf=new nt;function wf(i,e,t,n,r,s,a){const o=new Xe(0);let l=s===!0?0:1,c,h,f=null,d=0,m=null;function _(T){let E=T.isScene===!0?T.background:null;return E&&E.isTexture&&(E=(T.backgroundBlurriness>0?t:e).get(E)),E}function y(T){let E=!1;const S=_(T);S===null?u(o,l):S&&S.isColor&&(u(S,1),E=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,a):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||E)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(T,E){const S=_(E);S&&(S.isCubeTexture||S.mapping===Ir)?(h===void 0&&(h=new zt(new yi(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:vi(Wt.backgroundCube.uniforms),vertexShader:Wt.backgroundCube.vertexShader,fragmentShader:Wt.backgroundCube.fragmentShader,side:xt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Cn.copy(E.backgroundRotation),Cn.x*=-1,Cn.y*=-1,Cn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Cn.y*=-1,Cn.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Tf.makeRotationFromEuler(Cn)),h.material.toneMapped=Ve.getTransfer(S.colorSpace)!==Ze,(f!==S||d!==S.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,f=S,d=S.version,m=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new zt(new Gi(2,2),new ln({name:"BackgroundMaterial",uniforms:vi(Wt.background.uniforms),vertexShader:Wt.background.vertexShader,fragmentShader:Wt.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Ve.getTransfer(S.colorSpace)!==Ze,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(f!==S||d!==S.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=S,d=S.version,m=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function u(T,E){T.getRGB(hr,Zo(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,E,a)}return{getClearColor:function(){return o},setClearColor:function(T,E=1){o.set(T),l=E,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,u(o,l)},render:y,addToRenderList:p}}function Af(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(v,w,W,B,X){let j=!1;const q=f(B,W,w);s!==q&&(s=q,c(s.object)),j=m(v,B,W,X),j&&_(v,B,W,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,S(v,w,W,B),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function f(v,w,W){const B=W.wireframe===!0;let X=n[v.id];X===void 0&&(X={},n[v.id]=X);let j=X[w.id];j===void 0&&(j={},X[w.id]=j);let q=j[B];return q===void 0&&(q=d(l()),j[B]=q),q}function d(v){const w=[],W=[],B=[];for(let X=0;X<t;X++)w[X]=0,W[X]=0,B[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:W,attributeDivisors:B,object:v,attributes:{},index:null}}function m(v,w,W,B){const X=s.attributes,j=w.attributes;let q=0;const ie=W.getAttributes();for(const H in ie)if(ie[H].location>=0){const $=X[H];let ee=j[H];if(ee===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(ee=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(ee=v.instanceColor)),$===void 0||$.attribute!==ee||ee&&$.data!==ee.data)return!0;q++}return s.attributesNum!==q||s.index!==B}function _(v,w,W,B){const X={},j=w.attributes;let q=0;const ie=W.getAttributes();for(const H in ie)if(ie[H].location>=0){let $=j[H];$===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&($=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&($=v.instanceColor));const ee={};ee.attribute=$,$&&$.data&&(ee.data=$.data),X[H]=ee,q++}s.attributes=X,s.attributesNum=q,s.index=B}function y(){const v=s.newAttributes;for(let w=0,W=v.length;w<W;w++)v[w]=0}function p(v){u(v,0)}function u(v,w){const W=s.newAttributes,B=s.enabledAttributes,X=s.attributeDivisors;W[v]=1,B[v]===0&&(i.enableVertexAttribArray(v),B[v]=1),X[v]!==w&&(i.vertexAttribDivisor(v,w),X[v]=w)}function T(){const v=s.newAttributes,w=s.enabledAttributes;for(let W=0,B=w.length;W<B;W++)w[W]!==v[W]&&(i.disableVertexAttribArray(W),w[W]=0)}function E(v,w,W,B,X,j,q){q===!0?i.vertexAttribIPointer(v,w,W,X,j):i.vertexAttribPointer(v,w,W,B,X,j)}function S(v,w,W,B){y();const X=B.attributes,j=W.getAttributes(),q=w.defaultAttributeValues;for(const ie in j){const H=j[ie];if(H.location>=0){let O=X[ie];if(O===void 0&&(ie==="instanceMatrix"&&v.instanceMatrix&&(O=v.instanceMatrix),ie==="instanceColor"&&v.instanceColor&&(O=v.instanceColor)),O!==void 0){const $=O.normalized,ee=O.itemSize,le=e.get(O);if(le===void 0)continue;const we=le.buffer,V=le.type,J=le.bytesPerElement,se=V===i.INT||V===i.UNSIGNED_INT||O.gpuType===ia;if(O.isInterleavedBufferAttribute){const te=O.data,ge=te.stride,Se=O.offset;if(te.isInstancedInterleavedBuffer){for(let Pe=0;Pe<H.locationSize;Pe++)u(H.location+Pe,te.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Pe=0;Pe<H.locationSize;Pe++)p(H.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,we);for(let Pe=0;Pe<H.locationSize;Pe++)E(H.location+Pe,ee/H.locationSize,V,$,ge*J,(Se+ee/H.locationSize*Pe)*J,se)}else{if(O.isInstancedBufferAttribute){for(let te=0;te<H.locationSize;te++)u(H.location+te,O.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let te=0;te<H.locationSize;te++)p(H.location+te);i.bindBuffer(i.ARRAY_BUFFER,we);for(let te=0;te<H.locationSize;te++)E(H.location+te,ee/H.locationSize,V,$,ee*J,ee/H.locationSize*te*J,se)}}else if(q!==void 0){const $=q[ie];if($!==void 0)switch($.length){case 2:i.vertexAttrib2fv(H.location,$);break;case 3:i.vertexAttrib3fv(H.location,$);break;case 4:i.vertexAttrib4fv(H.location,$);break;default:i.vertexAttrib1fv(H.location,$)}}}}T()}function I(){U();for(const v in n){const w=n[v];for(const W in w){const B=w[W];for(const X in B)h(B[X].object),delete B[X];delete w[W]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;const w=n[v.id];for(const W in w){const B=w[W];for(const X in B)h(B[X].object),delete B[X];delete w[W]}delete n[v.id]}function R(v){for(const w in n){const W=n[w];if(W[v.id]===void 0)continue;const B=W[v.id];for(const X in B)h(B[X].object),delete B[X];delete W[v.id]}}function U(){M(),a=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:U,resetDefaultState:M,dispose:I,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:p,disableUnusedAttributes:T}}function Rf(i,e,t){let n;function r(c){n=c}function s(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,f){f!==0&&(i.drawArraysInstanced(n,c,h,f),t.update(h,n,f))}function o(c,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_];t.update(m,n,1)}function l(c,h,f,d){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],h[_],d[_]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,f);let _=0;for(let y=0;y<f;y++)_+=h[y]*d[y];t.update(_,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Cf(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==Bt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const U=R===ki&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Xt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==rn&&!U)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=_>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:_,maxTextureSize:y,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:T,maxVaryings:E,maxFragmentUniforms:S,vertexTextures:I,maxSamples:A}}function Pf(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new Dn,o=new Ce,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||n!==0||r;return r=d,n=f.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,m){const _=f.clippingPlanes,y=f.clipIntersection,p=f.clipShadows,u=i.get(f);if(!r||_===null||_.length===0||s&&!p)s?h(null):c();else{const T=s?0:n,E=T*4;let S=u.clippingState||null;l.value=S,S=h(_,d,E,m);for(let I=0;I!==E;++I)S[I]=t[I];u.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,d,m,_){const y=f!==null?f.length:0;let p=null;if(y!==0){if(p=l.value,_!==!0||p===null){const u=m+y*4,T=d.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<u)&&(p=new Float32Array(u));for(let E=0,S=m;E!==y;++E,S+=4)a.copy(f[E]).applyMatrix4(T,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,p}}function Df(i){let e=new WeakMap;function t(a,o){return o===bs?a.mapping=pi:o===Ts&&(a.mapping=mi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===bs||o===Ts)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Vc(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Lf extends Ko{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const oi=4,Ka=[.125,.215,.35,.446,.526,.582],Fn=20,ss=new Lf,$a=new Xe;let as=null,os=0,ls=0,cs=!1;const Ln=(1+Math.sqrt(5))/2,ni=1/Ln,ja=[new N(-Ln,ni,0),new N(Ln,ni,0),new N(-ni,0,Ln),new N(ni,0,Ln),new N(0,Ln,-ni),new N(0,Ln,ni),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Ja{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){as=this._renderer.getRenderTarget(),os=this._renderer.getActiveCubeFace(),ls=this._renderer.getActiveMipmapLevel(),cs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=to(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=eo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(as,os,ls),this._renderer.xr.enabled=cs,e.scissorTest=!1,ur(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===pi||e.mapping===mi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),as=this._renderer.getRenderTarget(),os=this._renderer.getActiveCubeFace(),ls=this._renderer.getActiveMipmapLevel(),cs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:ki,format:Bt,colorSpace:xi,depthBuffer:!1},r=Qa(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qa(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Uf(s)),this._blurMaterial=If(s,e,t)}return r}_compileMaterial(e){const t=new zt(this._lodPlanes[0],e);this._renderer.compile(t,ss)}_sceneToCubeUV(e,t,n,r){const o=new Ct(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor($a),h.toneMapping=yn,h.autoClear=!1;const m=new fa({name:"PMREM.Background",side:xt,depthWrite:!1,depthTest:!1}),_=new zt(new yi,m);let y=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,y=!0):(m.color.copy($a),y=!0);for(let u=0;u<6;u++){const T=u%3;T===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):T===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const E=this._cubeSize;ur(r,T*E,u>2?E:0,E,E),h.setRenderTarget(r),y&&h.render(_,o),h.render(e,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=d,h.autoClear=f,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===pi||e.mapping===mi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=to()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=eo());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new zt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ur(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ss)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ja[(r-s-1)%ja.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new zt(this._lodPlanes[r],c),d=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Fn-1),y=s/_,p=isFinite(s)?1+Math.floor(h*y):Fn;p>Fn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Fn}`);const u=[];let T=0;for(let R=0;R<Fn;++R){const U=R/y,M=Math.exp(-U*U/2);u.push(M),R===0?T+=M:R<p&&(T+=2*M)}for(let R=0;R<u.length;R++)u[R]=u[R]/T;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=u,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=_,d.mipInt.value=E-n;const S=this._sizeLods[r],I=3*S*(r>E-oi?r-E+oi:0),A=4*(this._cubeSize-S);ur(t,I,A,3*S,2*S),l.setRenderTarget(t),l.render(f,ss)}}function Uf(i){const e=[],t=[],n=[];let r=i;const s=i-oi+1+Ka.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>i-oi?l=Ka[a-i+oi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,_=6,y=3,p=2,u=1,T=new Float32Array(y*_*m),E=new Float32Array(p*_*m),S=new Float32Array(u*_*m);for(let A=0;A<m;A++){const R=A%3*2/3-1,U=A>2?0:-1,M=[R,U,0,R+2/3,U,0,R+2/3,U+1,0,R,U,0,R+2/3,U+1,0,R,U+1,0];T.set(M,y*_*A),E.set(d,p*_*A);const v=[A,A,A,A,A,A];S.set(v,u*_*A)}const I=new En;I.setAttribute("position",new Vt(T,y)),I.setAttribute("uv",new Vt(E,p)),I.setAttribute("faceIndex",new Vt(S,u)),e.push(I),r>oi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Qa(i,e,t){const n=new kn(i,e,t);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ur(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function If(i,e,t){const n=new Float32Array(Fn),r=new N(0,1,0);return new ln({name:"SphericalGaussianBlur",defines:{n:Fn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function eo(){return new ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function to(){return new ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function da(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Nf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===bs||l===Ts,h=l===pi||l===mi;if(c||h){let f=e.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Ja(i)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||h&&m&&r(m)?(t===null&&(t=new Ja(i)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Ff(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Li("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Of(i,e,t,n){const r={},s=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const _ in d.attributes)e.remove(d.attributes[_]);for(const _ in d.morphAttributes){const y=d.morphAttributes[_];for(let p=0,u=y.length;p<u;p++)e.remove(y[p])}d.removeEventListener("dispose",a),delete r[d.id];const m=s.get(d);m&&(e.remove(m),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const _ in d)e.update(d[_],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const _ in m){const y=m[_];for(let p=0,u=y.length;p<u;p++)e.update(y[p],i.ARRAY_BUFFER)}}function c(f){const d=[],m=f.index,_=f.attributes.position;let y=0;if(m!==null){const T=m.array;y=m.version;for(let E=0,S=T.length;E<S;E+=3){const I=T[E+0],A=T[E+1],R=T[E+2];d.push(I,A,A,R,R,I)}}else if(_!==void 0){const T=_.array;y=_.version;for(let E=0,S=T.length/3-1;E<S;E+=3){const I=E+0,A=E+1,R=E+2;d.push(I,A,A,R,R,I)}}else return;const p=new(ko(d)?Yo:qo)(d,1);p.version=y;const u=s.get(f);u&&e.remove(u),s.set(f,p)}function h(f){const d=s.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Bf(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,m){i.drawElements(n,m,s,d*a),t.update(m,n,1)}function c(d,m,_){_!==0&&(i.drawElementsInstanced(n,m,s,d*a,_),t.update(m,n,_))}function h(d,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,d,0,_);let p=0;for(let u=0;u<_;u++)p+=m[u];t.update(p,n,1)}function f(d,m,_,y){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<d.length;u++)c(d[u]/a,m[u],y[u]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,s,d,0,y,0,_);let u=0;for(let T=0;T<_;T++)u+=m[T]*y[T];t.update(u,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function zf(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function kf(i,e,t){const n=new WeakMap,r=new tt;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==f){let M=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let E=0;m===!0&&(E=1),_===!0&&(E=2),y===!0&&(E=3);let S=o.attributes.position.count*E,I=1;S>e.maxTextureSize&&(I=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const A=new Float32Array(S*I*4*f),R=new Ho(A,S,I,f);R.type=rn,R.needsUpdate=!0;const U=E*4;for(let v=0;v<f;v++){const w=p[v],W=u[v],B=T[v],X=S*I*4*v;for(let j=0;j<w.count;j++){const q=j*U;m===!0&&(r.fromBufferAttribute(w,j),A[X+q+0]=r.x,A[X+q+1]=r.y,A[X+q+2]=r.z,A[X+q+3]=0),_===!0&&(r.fromBufferAttribute(W,j),A[X+q+4]=r.x,A[X+q+5]=r.y,A[X+q+6]=r.z,A[X+q+7]=0),y===!0&&(r.fromBufferAttribute(B,j),A[X+q+8]=r.x,A[X+q+9]=r.y,A[X+q+10]=r.z,A[X+q+11]=B.itemSize===4?r.w:1)}}d={count:f,texture:R,size:new Ne(S,I)},n.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let y=0;y<c.length;y++)m+=c[y];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function Vf(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,f=e.get(l,h);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Qo extends _t{constructor(e,t,n,r,s,a,o,l,c,h=hi){if(h!==hi&&h!==_i)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===hi&&(n=zn),n===void 0&&h===_i&&(n=gi),super(null,r,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:kt,this.minFilter=l!==void 0?l:kt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const el=new _t,no=new Qo(1,1),tl=new Ho,nl=new Go,il=new $o,io=[],ro=[],so=new Float32Array(16),ao=new Float32Array(9),oo=new Float32Array(4);function Si(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=io[r];if(s===void 0&&(s=new Float32Array(r),io[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function ot(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function lt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Fr(i,e){let t=ro[e];t===void 0&&(t=new Int32Array(e),ro[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Hf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2fv(this.addr,e),lt(t,e)}}function Wf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ot(t,e))return;i.uniform3fv(this.addr,e),lt(t,e)}}function Xf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4fv(this.addr,e),lt(t,e)}}function qf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;oo.set(n),i.uniformMatrix2fv(this.addr,!1,oo),lt(t,n)}}function Yf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;ao.set(n),i.uniformMatrix3fv(this.addr,!1,ao),lt(t,n)}}function Zf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;so.set(n),i.uniformMatrix4fv(this.addr,!1,so),lt(t,n)}}function Kf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $f(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2iv(this.addr,e),lt(t,e)}}function jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ot(t,e))return;i.uniform3iv(this.addr,e),lt(t,e)}}function Jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4iv(this.addr,e),lt(t,e)}}function Qf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ed(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2uiv(this.addr,e),lt(t,e)}}function td(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ot(t,e))return;i.uniform3uiv(this.addr,e),lt(t,e)}}function nd(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4uiv(this.addr,e),lt(t,e)}}function id(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(no.compareFunction=zo,s=no):s=el,t.setTexture2D(e||s,r)}function rd(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||nl,r)}function sd(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||il,r)}function ad(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||tl,r)}function od(i){switch(i){case 5126:return Hf;case 35664:return Gf;case 35665:return Wf;case 35666:return Xf;case 35674:return qf;case 35675:return Yf;case 35676:return Zf;case 5124:case 35670:return Kf;case 35667:case 35671:return $f;case 35668:case 35672:return jf;case 35669:case 35673:return Jf;case 5125:return Qf;case 36294:return ed;case 36295:return td;case 36296:return nd;case 35678:case 36198:case 36298:case 36306:case 35682:return id;case 35679:case 36299:case 36307:return rd;case 35680:case 36300:case 36308:case 36293:return sd;case 36289:case 36303:case 36311:case 36292:return ad}}function ld(i,e){i.uniform1fv(this.addr,e)}function cd(i,e){const t=Si(e,this.size,2);i.uniform2fv(this.addr,t)}function hd(i,e){const t=Si(e,this.size,3);i.uniform3fv(this.addr,t)}function ud(i,e){const t=Si(e,this.size,4);i.uniform4fv(this.addr,t)}function fd(i,e){const t=Si(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dd(i,e){const t=Si(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pd(i,e){const t=Si(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function md(i,e){i.uniform1iv(this.addr,e)}function gd(i,e){i.uniform2iv(this.addr,e)}function _d(i,e){i.uniform3iv(this.addr,e)}function vd(i,e){i.uniform4iv(this.addr,e)}function xd(i,e){i.uniform1uiv(this.addr,e)}function Md(i,e){i.uniform2uiv(this.addr,e)}function yd(i,e){i.uniform3uiv(this.addr,e)}function Sd(i,e){i.uniform4uiv(this.addr,e)}function Ed(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);ot(n,s)||(i.uniform1iv(this.addr,s),lt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||el,s[a])}function bd(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);ot(n,s)||(i.uniform1iv(this.addr,s),lt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||nl,s[a])}function Td(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);ot(n,s)||(i.uniform1iv(this.addr,s),lt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||il,s[a])}function wd(i,e,t){const n=this.cache,r=e.length,s=Fr(t,r);ot(n,s)||(i.uniform1iv(this.addr,s),lt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||tl,s[a])}function Ad(i){switch(i){case 5126:return ld;case 35664:return cd;case 35665:return hd;case 35666:return ud;case 35674:return fd;case 35675:return dd;case 35676:return pd;case 5124:case 35670:return md;case 35667:case 35671:return gd;case 35668:case 35672:return _d;case 35669:case 35673:return vd;case 5125:return xd;case 36294:return Md;case 36295:return yd;case 36296:return Sd;case 35678:case 36198:case 36298:case 36306:case 35682:return Ed;case 35679:case 36299:case 36307:return bd;case 35680:case 36300:case 36308:case 36293:return Td;case 36289:case 36303:case 36311:case 36292:return wd}}class Rd{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=od(t.type)}}class Cd{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ad(t.type)}}class Pd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const hs=/(\w+)(\])?(\[|\.)?/g;function lo(i,e){i.seq.push(e),i.map[e.id]=e}function Dd(i,e,t){const n=i.name,r=n.length;for(hs.lastIndex=0;;){const s=hs.exec(n),a=hs.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){lo(t,c===void 0?new Rd(o,i,e):new Cd(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Pd(o),lo(t,f)),t=f}}}class Ar{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Dd(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function co(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Ld=37297;let Ud=0;function Id(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ho=new Ce;function Nd(i){Ve._getMatrix(ho,Ve.workingColorSpace,i);const e=`mat3( ${ho.elements.map(t=>t.toFixed(4))} )`;switch(Ve.getTransfer(i)){case Nr:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function uo(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Id(i.getShaderSource(e),a)}else return r}function Fd(i,e){const t=Nd(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Od(i,e){let t;switch(e){case Nl:t="Linear";break;case Fl:t="Reinhard";break;case Ol:t="Cineon";break;case Bl:t="ACESFilmic";break;case kl:t="AgX";break;case Vl:t="Neutral";break;case zl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fr=new N;function Bd(){Ve.getLuminanceCoefficients(fr);const i=fr.x.toFixed(4),e=fr.y.toFixed(4),t=fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zd(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ui).join(`
`)}function kd(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Vd(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ui(i){return i!==""}function fo(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function po(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Hd=/^[ \t]*#include +<([\w\d./]+)>/gm;function ea(i){return i.replace(Hd,Wd)}const Gd=new Map;function Wd(i,e){let t=Ie[e];if(t===void 0){const n=Gd.get(e);if(n!==void 0)t=Ie[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ea(t)}const Xd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mo(i){return i.replace(Xd,qd)}function qd(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function go(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yd(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ao?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===pl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===en&&(e="SHADOWMAP_TYPE_VSM"),e}function Zd(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case pi:case mi:e="ENVMAP_TYPE_CUBE";break;case Ir:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Kd(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case mi:e="ENVMAP_MODE_REFRACTION";break}return e}function $d(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ro:e="ENVMAP_BLENDING_MULTIPLY";break;case Ul:e="ENVMAP_BLENDING_MIX";break;case Il:e="ENVMAP_BLENDING_ADD";break}return e}function jd(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Jd(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Yd(t),c=Zd(t),h=Kd(t),f=$d(t),d=jd(t),m=zd(t),_=kd(s),y=r.createProgram();let p,u,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ui).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ui).join(`
`),u.length>0&&(u+=`
`)):(p=[go(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ui).join(`
`),u=[go(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yn?"#define TONE_MAPPING":"",t.toneMapping!==yn?Ie.tonemapping_pars_fragment:"",t.toneMapping!==yn?Od("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ie.colorspace_pars_fragment,Fd("linearToOutputTexel",t.outputColorSpace),Bd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ui).join(`
`)),a=ea(a),a=fo(a,t),a=po(a,t),o=ea(o),o=fo(o,t),o=po(o,t),a=mo(a),o=mo(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===Aa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Aa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const E=T+p+a,S=T+u+o,I=co(r,r.VERTEX_SHADER,E),A=co(r,r.FRAGMENT_SHADER,S);r.attachShader(y,I),r.attachShader(y,A),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function R(w){if(i.debug.checkShaderErrors){const W=r.getProgramInfoLog(y).trim(),B=r.getShaderInfoLog(I).trim(),X=r.getShaderInfoLog(A).trim();let j=!0,q=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,y,I,A);else{const ie=uo(r,I,"vertex"),H=uo(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+W+`
`+ie+`
`+H)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(B===""||X==="")&&(q=!1);q&&(w.diagnostics={runnable:j,programLog:W,vertexShader:{log:B,prefix:p},fragmentShader:{log:X,prefix:u}})}r.deleteShader(I),r.deleteShader(A),U=new Ar(r,y),M=Vd(r,y)}let U;this.getUniforms=function(){return U===void 0&&R(this),U};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(y,Ld)),v},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ud++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=I,this.fragmentShader=A,this}let Qd=0;class ep{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tp(e),t.set(e,n)),n}}class tp{constructor(e){this.id=Qd++,this.code=e,this.usedTimes=0}}function np(i,e,t,n,r,s,a){const o=new Wo,l=new ep,c=new Set,h=[],f=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,v,w,W,B){const X=W.fog,j=B.geometry,q=M.isMeshStandardMaterial?W.environment:null,ie=(M.isMeshStandardMaterial?t:e).get(M.envMap||q),H=ie&&ie.mapping===Ir?ie.image.height:null,O=_[M.type];M.precision!==null&&(m=r.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const $=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ee=$!==void 0?$.length:0;let le=0;j.morphAttributes.position!==void 0&&(le=1),j.morphAttributes.normal!==void 0&&(le=2),j.morphAttributes.color!==void 0&&(le=3);let we,V,J,se;if(O){const qe=Wt[O];we=qe.vertexShader,V=qe.fragmentShader}else we=M.vertexShader,V=M.fragmentShader,l.update(M),J=l.getVertexShaderID(M),se=l.getFragmentShaderID(M);const te=i.getRenderTarget(),ge=i.state.buffers.depth.getReversed(),Se=B.isInstancedMesh===!0,Pe=B.isBatchedMesh===!0,Ke=!!M.map,Fe=!!M.matcap,rt=!!ie,L=!!M.aoMap,Tt=!!M.lightMap,Oe=!!M.bumpMap,Be=!!M.normalMap,be=!!M.displacementMap,Je=!!M.emissiveMap,Ee=!!M.metalnessMap,b=!!M.roughnessMap,g=M.anisotropy>0,F=M.clearcoat>0,Z=M.dispersion>0,Q=M.iridescence>0,Y=M.sheen>0,Me=M.transmission>0,ce=g&&!!M.anisotropyMap,de=F&&!!M.clearcoatMap,ke=F&&!!M.clearcoatNormalMap,ne=F&&!!M.clearcoatRoughnessMap,pe=Q&&!!M.iridescenceMap,Te=Q&&!!M.iridescenceThicknessMap,Ae=Y&&!!M.sheenColorMap,me=Y&&!!M.sheenRoughnessMap,ze=!!M.specularMap,Ue=!!M.specularColorMap,$e=!!M.specularIntensityMap,C=Me&&!!M.transmissionMap,oe=Me&&!!M.thicknessMap,G=!!M.gradientMap,K=!!M.alphaMap,fe=M.alphaTest>0,he=!!M.alphaHash,De=!!M.extensions;let it=yn;M.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(it=i.toneMapping);const ht={shaderID:O,shaderType:M.type,shaderName:M.name,vertexShader:we,fragmentShader:V,defines:M.defines,customVertexShaderID:J,customFragmentShaderID:se,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Pe,batchingColor:Pe&&B._colorsTexture!==null,instancing:Se,instancingColor:Se&&B.instanceColor!==null,instancingMorph:Se&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:xi,alphaToCoverage:!!M.alphaToCoverage,map:Ke,matcap:Fe,envMap:rt,envMapMode:rt&&ie.mapping,envMapCubeUVHeight:H,aoMap:L,lightMap:Tt,bumpMap:Oe,normalMap:Be,displacementMap:d&&be,emissiveMap:Je,normalMapObjectSpace:Be&&M.normalMapType===ql,normalMapTangentSpace:Be&&M.normalMapType===Xl,metalnessMap:Ee,roughnessMap:b,anisotropy:g,anisotropyMap:ce,clearcoat:F,clearcoatMap:de,clearcoatNormalMap:ke,clearcoatRoughnessMap:ne,dispersion:Z,iridescence:Q,iridescenceMap:pe,iridescenceThicknessMap:Te,sheen:Y,sheenColorMap:Ae,sheenRoughnessMap:me,specularMap:ze,specularColorMap:Ue,specularIntensityMap:$e,transmission:Me,transmissionMap:C,thicknessMap:oe,gradientMap:G,opaque:M.transparent===!1&&M.blending===ci&&M.alphaToCoverage===!1,alphaMap:K,alphaTest:fe,alphaHash:he,combine:M.combine,mapUv:Ke&&y(M.map.channel),aoMapUv:L&&y(M.aoMap.channel),lightMapUv:Tt&&y(M.lightMap.channel),bumpMapUv:Oe&&y(M.bumpMap.channel),normalMapUv:Be&&y(M.normalMap.channel),displacementMapUv:be&&y(M.displacementMap.channel),emissiveMapUv:Je&&y(M.emissiveMap.channel),metalnessMapUv:Ee&&y(M.metalnessMap.channel),roughnessMapUv:b&&y(M.roughnessMap.channel),anisotropyMapUv:ce&&y(M.anisotropyMap.channel),clearcoatMapUv:de&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:ke&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:me&&y(M.sheenRoughnessMap.channel),specularMapUv:ze&&y(M.specularMap.channel),specularColorMapUv:Ue&&y(M.specularColorMap.channel),specularIntensityMapUv:$e&&y(M.specularIntensityMap.channel),transmissionMapUv:C&&y(M.transmissionMap.channel),thicknessMapUv:oe&&y(M.thicknessMap.channel),alphaMapUv:K&&y(M.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Be||g),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!j.attributes.uv&&(Ke||K),fog:!!X,useFog:M.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:ge,skinning:B.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:le,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,decodeVideoTexture:Ke&&M.map.isVideoTexture===!0&&Ve.getTransfer(M.map.colorSpace)===Ze,decodeVideoTextureEmissive:Je&&M.emissiveMap.isVideoTexture===!0&&Ve.getTransfer(M.emissiveMap.colorSpace)===Ze,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===nn,flipSided:M.side===xt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:De&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&M.extensions.multiDraw===!0||Pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ht.vertexUv1s=c.has(1),ht.vertexUv2s=c.has(2),ht.vertexUv3s=c.has(3),c.clear(),ht}function u(M){const v=[];if(M.shaderID?v.push(M.shaderID):(v.push(M.customVertexShaderID),v.push(M.customFragmentShaderID)),M.defines!==void 0)for(const w in M.defines)v.push(w),v.push(M.defines[w]);return M.isRawShaderMaterial===!1&&(T(v,M),E(v,M),v.push(i.outputColorSpace)),v.push(M.customProgramCacheKey),v.join()}function T(M,v){M.push(v.precision),M.push(v.outputColorSpace),M.push(v.envMapMode),M.push(v.envMapCubeUVHeight),M.push(v.mapUv),M.push(v.alphaMapUv),M.push(v.lightMapUv),M.push(v.aoMapUv),M.push(v.bumpMapUv),M.push(v.normalMapUv),M.push(v.displacementMapUv),M.push(v.emissiveMapUv),M.push(v.metalnessMapUv),M.push(v.roughnessMapUv),M.push(v.anisotropyMapUv),M.push(v.clearcoatMapUv),M.push(v.clearcoatNormalMapUv),M.push(v.clearcoatRoughnessMapUv),M.push(v.iridescenceMapUv),M.push(v.iridescenceThicknessMapUv),M.push(v.sheenColorMapUv),M.push(v.sheenRoughnessMapUv),M.push(v.specularMapUv),M.push(v.specularColorMapUv),M.push(v.specularIntensityMapUv),M.push(v.transmissionMapUv),M.push(v.thicknessMapUv),M.push(v.combine),M.push(v.fogExp2),M.push(v.sizeAttenuation),M.push(v.morphTargetsCount),M.push(v.morphAttributeCount),M.push(v.numDirLights),M.push(v.numPointLights),M.push(v.numSpotLights),M.push(v.numSpotLightMaps),M.push(v.numHemiLights),M.push(v.numRectAreaLights),M.push(v.numDirLightShadows),M.push(v.numPointLightShadows),M.push(v.numSpotLightShadows),M.push(v.numSpotLightShadowsWithMaps),M.push(v.numLightProbes),M.push(v.shadowMapType),M.push(v.toneMapping),M.push(v.numClippingPlanes),M.push(v.numClipIntersection),M.push(v.depthPacking)}function E(M,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),M.push(o.mask)}function S(M){const v=_[M.type];let w;if(v){const W=Wt[v];w=Oc.clone(W.uniforms)}else w=M.uniforms;return w}function I(M,v){let w;for(let W=0,B=h.length;W<B;W++){const X=h[W];if(X.cacheKey===v){w=X,++w.usedTimes;break}}return w===void 0&&(w=new Jd(i,v,M,s),h.push(w)),w}function A(M){if(--M.usedTimes===0){const v=h.indexOf(M);h[v]=h[h.length-1],h.pop(),M.destroy()}}function R(M){l.remove(M)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:S,acquireProgram:I,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:U}}function ip(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function rp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function _o(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function vo(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(f,d,m,_,y,p){let u=i[e];return u===void 0?(u={id:f.id,object:f,geometry:d,material:m,groupOrder:_,renderOrder:f.renderOrder,z:y,group:p},i[e]=u):(u.id=f.id,u.object=f,u.geometry=d,u.material=m,u.groupOrder=_,u.renderOrder=f.renderOrder,u.z=y,u.group=p),e++,u}function o(f,d,m,_,y,p){const u=a(f,d,m,_,y,p);m.transmission>0?n.push(u):m.transparent===!0?r.push(u):t.push(u)}function l(f,d,m,_,y,p){const u=a(f,d,m,_,y,p);m.transmission>0?n.unshift(u):m.transparent===!0?r.unshift(u):t.unshift(u)}function c(f,d){t.length>1&&t.sort(f||rp),n.length>1&&n.sort(d||_o),r.length>1&&r.sort(d||_o)}function h(){for(let f=e,d=i.length;f<d;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:h,sort:c}}function sp(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new vo,i.set(n,[a])):r>=s.length?(a=new vo,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function ap(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Xe};break;case"SpotLight":t={position:new N,direction:new N,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function op(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let lp=0;function cp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function hp(i){const e=new ap,t=op(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const r=new N,s=new nt,a=new nt;function o(c){let h=0,f=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let m=0,_=0,y=0,p=0,u=0,T=0,E=0,S=0,I=0,A=0,R=0;c.sort(cp);for(let M=0,v=c.length;M<v;M++){const w=c[M],W=w.color,B=w.intensity,X=w.distance,j=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=W.r*B,f+=W.g*B,d+=W.b*B;else if(w.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(w.sh.coefficients[q],B);R++}else if(w.isDirectionalLight){const q=e.get(w);if(q.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const ie=w.shadow,H=t.get(w);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,n.directionalShadow[m]=H,n.directionalShadowMap[m]=j,n.directionalShadowMatrix[m]=w.shadow.matrix,T++}n.directional[m]=q,m++}else if(w.isSpotLight){const q=e.get(w);q.position.setFromMatrixPosition(w.matrixWorld),q.color.copy(W).multiplyScalar(B),q.distance=X,q.coneCos=Math.cos(w.angle),q.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),q.decay=w.decay,n.spot[y]=q;const ie=w.shadow;if(w.map&&(n.spotLightMap[I]=w.map,I++,ie.updateMatrices(w),w.castShadow&&A++),n.spotLightMatrix[y]=ie.matrix,w.castShadow){const H=t.get(w);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,n.spotShadow[y]=H,n.spotShadowMap[y]=j,S++}y++}else if(w.isRectAreaLight){const q=e.get(w);q.color.copy(W).multiplyScalar(B),q.halfWidth.set(w.width*.5,0,0),q.halfHeight.set(0,w.height*.5,0),n.rectArea[p]=q,p++}else if(w.isPointLight){const q=e.get(w);if(q.color.copy(w.color).multiplyScalar(w.intensity),q.distance=w.distance,q.decay=w.decay,w.castShadow){const ie=w.shadow,H=t.get(w);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,H.shadowCameraNear=ie.camera.near,H.shadowCameraFar=ie.camera.far,n.pointShadow[_]=H,n.pointShadowMap[_]=j,n.pointShadowMatrix[_]=w.shadow.matrix,E++}n.point[_]=q,_++}else if(w.isHemisphereLight){const q=e.get(w);q.skyColor.copy(w.color).multiplyScalar(B),q.groundColor.copy(w.groundColor).multiplyScalar(B),n.hemi[u]=q,u++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ae.LTC_FLOAT_1,n.rectAreaLTC2=ae.LTC_FLOAT_2):(n.rectAreaLTC1=ae.LTC_HALF_1,n.rectAreaLTC2=ae.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=d;const U=n.hash;(U.directionalLength!==m||U.pointLength!==_||U.spotLength!==y||U.rectAreaLength!==p||U.hemiLength!==u||U.numDirectionalShadows!==T||U.numPointShadows!==E||U.numSpotShadows!==S||U.numSpotMaps!==I||U.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=y,n.rectArea.length=p,n.point.length=_,n.hemi.length=u,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=S+I-A,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,U.directionalLength=m,U.pointLength=_,U.spotLength=y,U.rectAreaLength=p,U.hemiLength=u,U.numDirectionalShadows=T,U.numPointShadows=E,U.numSpotShadows=S,U.numSpotMaps=I,U.numLightProbes=R,n.version=lp++)}function l(c,h){let f=0,d=0,m=0,_=0,y=0;const p=h.matrixWorldInverse;for(let u=0,T=c.length;u<T;u++){const E=c[u];if(E.isDirectionalLight){const S=n.directional[f];S.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),f++}else if(E.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),m++}else if(E.isRectAreaLight){const S=n.rectArea[_];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(p),a.identity(),s.copy(E.matrixWorld),s.premultiply(p),a.extractRotation(s),S.halfWidth.set(E.width*.5,0,0),S.halfHeight.set(0,E.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(E.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(p),d++}else if(E.isHemisphereLight){const S=n.hemi[y];S.direction.setFromMatrixPosition(E.matrixWorld),S.direction.transformDirection(p),y++}}}return{setup:o,setupView:l,state:n}}function xo(i){const e=new hp(i),t=[],n=[];function r(h){c.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function up(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new xo(i),e.set(r,[o])):s>=a.length?(o=new xo(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class fp extends Hi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Gl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class dp extends Hi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const pp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function gp(i,e,t){let n=new jo;const r=new Ne,s=new Ne,a=new tt,o=new fp({depthPacking:Wl}),l=new dp,c={},h=t.maxTextureSize,f={[Sn]:xt,[xt]:Sn,[nn]:nn},d=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:pp,fragmentShader:mp}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new En;_.setAttribute("position",new Vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new zt(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ao;let u=this.type;this.render=function(A,R,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;const M=i.getRenderTarget(),v=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),W=i.state;W.setBlending(Mn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const B=u!==en&&this.type===en,X=u===en&&this.type!==en;for(let j=0,q=A.length;j<q;j++){const ie=A[j],H=ie.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const O=H.getFrameExtents();if(r.multiply(O),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/O.x),r.x=s.x*O.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/O.y),r.y=s.y*O.y,H.mapSize.y=s.y)),H.map===null||B===!0||X===!0){const ee=this.type!==en?{minFilter:kt,magFilter:kt}:{};H.map!==null&&H.map.dispose(),H.map=new kn(r.x,r.y,ee),H.map.texture.name=ie.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const $=H.getViewportCount();for(let ee=0;ee<$;ee++){const le=H.getViewport(ee);a.set(s.x*le.x,s.y*le.y,s.x*le.z,s.y*le.w),W.viewport(a),H.updateMatrices(ie,ee),n=H.getFrustum(),S(R,U,H.camera,ie,this.type)}H.isPointLightShadow!==!0&&this.type===en&&T(H,U),H.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(M,v,w)};function T(A,R){const U=e.update(y);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new kn(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,U,d,y,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,U,m,y,null)}function E(A,R,U,M){let v=null;const w=U.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)v=w;else if(v=U.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const W=v.uuid,B=R.uuid;let X=c[W];X===void 0&&(X={},c[W]=X);let j=X[B];j===void 0&&(j=v.clone(),X[B]=j,R.addEventListener("dispose",I)),v=j}if(v.visible=R.visible,v.wireframe=R.wireframe,M===en?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:f[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,U.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const W=i.properties.get(v);W.light=U}return v}function S(A,R,U,M,v){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===en)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,A.matrixWorld);const B=e.update(A),X=A.material;if(Array.isArray(X)){const j=B.groups;for(let q=0,ie=j.length;q<ie;q++){const H=j[q],O=X[H.materialIndex];if(O&&O.visible){const $=E(A,O,M,v);A.onBeforeShadow(i,A,R,U,B,$,H),i.renderBufferDirect(U,null,B,$,A,H),A.onAfterShadow(i,A,R,U,B,$,H)}}}else if(X.visible){const j=E(A,X,M,v);A.onBeforeShadow(i,A,R,U,B,j,null),i.renderBufferDirect(U,null,B,j,A,null),A.onAfterShadow(i,A,R,U,B,j,null)}}const W=A.children;for(let B=0,X=W.length;B<X;B++)S(W[B],R,U,M,v)}function I(A){A.target.removeEventListener("dispose",I);for(const U in c){const M=c[U],v=A.target.uuid;v in M&&(M[v].dispose(),delete M[v])}}}const _p={[_s]:vs,[xs]:Ss,[Ms]:Es,[di]:ys,[vs]:_s,[Ss]:xs,[Es]:Ms,[ys]:di};function vp(i,e){function t(){let C=!1;const oe=new tt;let G=null;const K=new tt(0,0,0,0);return{setMask:function(fe){G!==fe&&!C&&(i.colorMask(fe,fe,fe,fe),G=fe)},setLocked:function(fe){C=fe},setClear:function(fe,he,De,it,ht){ht===!0&&(fe*=it,he*=it,De*=it),oe.set(fe,he,De,it),K.equals(oe)===!1&&(i.clearColor(fe,he,De,it),K.copy(oe))},reset:function(){C=!1,G=null,K.set(-1,0,0,0)}}}function n(){let C=!1,oe=!1,G=null,K=null,fe=null;return{setReversed:function(he){if(oe!==he){const De=e.get("EXT_clip_control");oe?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT);const it=fe;fe=null,this.setClear(it)}oe=he},getReversed:function(){return oe},setTest:function(he){he?te(i.DEPTH_TEST):ge(i.DEPTH_TEST)},setMask:function(he){G!==he&&!C&&(i.depthMask(he),G=he)},setFunc:function(he){if(oe&&(he=_p[he]),K!==he){switch(he){case _s:i.depthFunc(i.NEVER);break;case vs:i.depthFunc(i.ALWAYS);break;case xs:i.depthFunc(i.LESS);break;case di:i.depthFunc(i.LEQUAL);break;case Ms:i.depthFunc(i.EQUAL);break;case ys:i.depthFunc(i.GEQUAL);break;case Ss:i.depthFunc(i.GREATER);break;case Es:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=he}},setLocked:function(he){C=he},setClear:function(he){fe!==he&&(oe&&(he=1-he),i.clearDepth(he),fe=he)},reset:function(){C=!1,G=null,K=null,fe=null,oe=!1}}}function r(){let C=!1,oe=null,G=null,K=null,fe=null,he=null,De=null,it=null,ht=null;return{setTest:function(qe){C||(qe?te(i.STENCIL_TEST):ge(i.STENCIL_TEST))},setMask:function(qe){oe!==qe&&!C&&(i.stencilMask(qe),oe=qe)},setFunc:function(qe,Dt,qt){(G!==qe||K!==Dt||fe!==qt)&&(i.stencilFunc(qe,Dt,qt),G=qe,K=Dt,fe=qt)},setOp:function(qe,Dt,qt){(he!==qe||De!==Dt||it!==qt)&&(i.stencilOp(qe,Dt,qt),he=qe,De=Dt,it=qt)},setLocked:function(qe){C=qe},setClear:function(qe){ht!==qe&&(i.clearStencil(qe),ht=qe)},reset:function(){C=!1,oe=null,G=null,K=null,fe=null,he=null,De=null,it=null,ht=null}}}const s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,m=[],_=null,y=!1,p=null,u=null,T=null,E=null,S=null,I=null,A=null,R=new Xe(0,0,0),U=0,M=!1,v=null,w=null,W=null,B=null,X=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,ie=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(H)[1]),q=ie>=1):H.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),q=ie>=2);let O=null,$={};const ee=i.getParameter(i.SCISSOR_BOX),le=i.getParameter(i.VIEWPORT),we=new tt().fromArray(ee),V=new tt().fromArray(le);function J(C,oe,G,K){const fe=new Uint8Array(4),he=i.createTexture();i.bindTexture(C,he),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<G;De++)C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,fe):i.texImage2D(oe+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,fe);return he}const se={};se[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),se[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),se[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(di),Oe(!1),Be(Sa),te(i.CULL_FACE),L(Mn);function te(C){h[C]!==!0&&(i.enable(C),h[C]=!0)}function ge(C){h[C]!==!1&&(i.disable(C),h[C]=!1)}function Se(C,oe){return f[C]!==oe?(i.bindFramebuffer(C,oe),f[C]=oe,C===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=oe),C===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function Pe(C,oe){let G=m,K=!1;if(C){G=d.get(oe),G===void 0&&(G=[],d.set(oe,G));const fe=C.textures;if(G.length!==fe.length||G[0]!==i.COLOR_ATTACHMENT0){for(let he=0,De=fe.length;he<De;he++)G[he]=i.COLOR_ATTACHMENT0+he;G.length=fe.length,K=!0}}else G[0]!==i.BACK&&(G[0]=i.BACK,K=!0);K&&i.drawBuffers(G)}function Ke(C){return _!==C?(i.useProgram(C),_=C,!0):!1}const Fe={[Nn]:i.FUNC_ADD,[gl]:i.FUNC_SUBTRACT,[_l]:i.FUNC_REVERSE_SUBTRACT};Fe[vl]=i.MIN,Fe[xl]=i.MAX;const rt={[Ml]:i.ZERO,[yl]:i.ONE,[Sl]:i.SRC_COLOR,[ms]:i.SRC_ALPHA,[Rl]:i.SRC_ALPHA_SATURATE,[wl]:i.DST_COLOR,[bl]:i.DST_ALPHA,[El]:i.ONE_MINUS_SRC_COLOR,[gs]:i.ONE_MINUS_SRC_ALPHA,[Al]:i.ONE_MINUS_DST_COLOR,[Tl]:i.ONE_MINUS_DST_ALPHA,[Cl]:i.CONSTANT_COLOR,[Pl]:i.ONE_MINUS_CONSTANT_COLOR,[Dl]:i.CONSTANT_ALPHA,[Ll]:i.ONE_MINUS_CONSTANT_ALPHA};function L(C,oe,G,K,fe,he,De,it,ht,qe){if(C===Mn){y===!0&&(ge(i.BLEND),y=!1);return}if(y===!1&&(te(i.BLEND),y=!0),C!==ml){if(C!==p||qe!==M){if((u!==Nn||S!==Nn)&&(i.blendEquation(i.FUNC_ADD),u=Nn,S=Nn),qe)switch(C){case ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ea:i.blendFunc(i.ONE,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ta:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ea:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ta:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}T=null,E=null,I=null,A=null,R.set(0,0,0),U=0,p=C,M=qe}return}fe=fe||oe,he=he||G,De=De||K,(oe!==u||fe!==S)&&(i.blendEquationSeparate(Fe[oe],Fe[fe]),u=oe,S=fe),(G!==T||K!==E||he!==I||De!==A)&&(i.blendFuncSeparate(rt[G],rt[K],rt[he],rt[De]),T=G,E=K,I=he,A=De),(it.equals(R)===!1||ht!==U)&&(i.blendColor(it.r,it.g,it.b,ht),R.copy(it),U=ht),p=C,M=!1}function Tt(C,oe){C.side===nn?ge(i.CULL_FACE):te(i.CULL_FACE);let G=C.side===xt;oe&&(G=!G),Oe(G),C.blending===ci&&C.transparent===!1?L(Mn):L(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),a.setFunc(C.depthFunc),a.setTest(C.depthTest),a.setMask(C.depthWrite),s.setMask(C.colorWrite);const K=C.stencilWrite;o.setTest(K),K&&(o.setMask(C.stencilWriteMask),o.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),o.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),Je(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):ge(i.SAMPLE_ALPHA_TO_COVERAGE)}function Oe(C){v!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),v=C)}function Be(C){C!==fl?(te(i.CULL_FACE),C!==w&&(C===Sa?i.cullFace(i.BACK):C===dl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ge(i.CULL_FACE),w=C}function be(C){C!==W&&(q&&i.lineWidth(C),W=C)}function Je(C,oe,G){C?(te(i.POLYGON_OFFSET_FILL),(B!==oe||X!==G)&&(i.polygonOffset(oe,G),B=oe,X=G)):ge(i.POLYGON_OFFSET_FILL)}function Ee(C){C?te(i.SCISSOR_TEST):ge(i.SCISSOR_TEST)}function b(C){C===void 0&&(C=i.TEXTURE0+j-1),O!==C&&(i.activeTexture(C),O=C)}function g(C,oe,G){G===void 0&&(O===null?G=i.TEXTURE0+j-1:G=O);let K=$[G];K===void 0&&(K={type:void 0,texture:void 0},$[G]=K),(K.type!==C||K.texture!==oe)&&(O!==G&&(i.activeTexture(G),O=G),i.bindTexture(C,oe||se[C]),K.type=C,K.texture=oe)}function F(){const C=$[O];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Y(){try{i.texSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Me(){try{i.texSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ce(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function de(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ke(){try{i.texStorage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ne(){try{i.texStorage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function pe(){try{i.texImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Te(){try{i.texImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ae(C){we.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),we.copy(C))}function me(C){V.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),V.copy(C))}function ze(C,oe){let G=c.get(oe);G===void 0&&(G=new WeakMap,c.set(oe,G));let K=G.get(C);K===void 0&&(K=i.getUniformBlockIndex(oe,C.name),G.set(C,K))}function Ue(C,oe){const K=c.get(oe).get(C);l.get(oe)!==K&&(i.uniformBlockBinding(oe,K,C.__bindingPointIndex),l.set(oe,K))}function $e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},O=null,$={},f={},d=new WeakMap,m=[],_=null,y=!1,p=null,u=null,T=null,E=null,S=null,I=null,A=null,R=new Xe(0,0,0),U=0,M=!1,v=null,w=null,W=null,B=null,X=null,we.set(0,0,i.canvas.width,i.canvas.height),V.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:te,disable:ge,bindFramebuffer:Se,drawBuffers:Pe,useProgram:Ke,setBlending:L,setMaterial:Tt,setFlipSided:Oe,setCullFace:Be,setLineWidth:be,setPolygonOffset:Je,setScissorTest:Ee,activeTexture:b,bindTexture:g,unbindTexture:F,compressedTexImage2D:Z,compressedTexImage3D:Q,texImage2D:pe,texImage3D:Te,updateUBOMapping:ze,uniformBlockBinding:Ue,texStorage2D:ke,texStorage3D:ne,texSubImage2D:Y,texSubImage3D:Me,compressedTexSubImage2D:ce,compressedTexSubImage3D:de,scissor:Ae,viewport:me,reset:$e}}function Mo(i,e,t,n){const r=xp(n);switch(t){case Uo:return i*e;case No:return i*e;case Fo:return i*e*2;case aa:return i*e/r.components*r.byteLength;case oa:return i*e/r.components*r.byteLength;case Oo:return i*e*2/r.components*r.byteLength;case la:return i*e*2/r.components*r.byteLength;case Io:return i*e*3/r.components*r.byteLength;case Bt:return i*e*4/r.components*r.byteLength;case ca:return i*e*4/r.components*r.byteLength;case Sr:case Er:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case br:case Tr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rs:case Ps:return Math.max(i,16)*Math.max(e,8)/4;case As:case Cs:return Math.max(i,8)*Math.max(e,8)/2;case Ds:case Ls:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Us:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Is:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ns:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Fs:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Os:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bs:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zs:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ks:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Vs:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Hs:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Gs:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ws:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xs:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qs:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ys:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wr:case Zs:case Ks:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Bo:case $s:return Math.ceil(i/4)*Math.ceil(e/4)*8;case js:case Js:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xp(i){switch(i){case Xt:case Po:return{byteLength:1,components:1};case Oi:case Do:case ki:return{byteLength:2,components:1};case ra:case sa:return{byteLength:2,components:4};case zn:case ia:case rn:return{byteLength:4,components:1};case Lo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Mp(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ne,h=new WeakMap;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(b,g){return m?new OffscreenCanvas(b,g):Dr("canvas")}function y(b,g,F){let Z=1;const Q=Ee(b);if((Q.width>F||Q.height>F)&&(Z=F/Math.max(Q.width,Q.height)),Z<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const Y=Math.floor(Z*Q.width),Me=Math.floor(Z*Q.height);f===void 0&&(f=_(Y,Me));const ce=g?_(Y,Me):f;return ce.width=Y,ce.height=Me,ce.getContext("2d").drawImage(b,0,0,Y,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Y+"x"+Me+")."),ce}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),b;return b}function p(b){return b.generateMipmaps}function u(b){i.generateMipmap(b)}function T(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(b,g,F,Z,Q=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Y=g;if(g===i.RED&&(F===i.FLOAT&&(Y=i.R32F),F===i.HALF_FLOAT&&(Y=i.R16F),F===i.UNSIGNED_BYTE&&(Y=i.R8)),g===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.R8UI),F===i.UNSIGNED_SHORT&&(Y=i.R16UI),F===i.UNSIGNED_INT&&(Y=i.R32UI),F===i.BYTE&&(Y=i.R8I),F===i.SHORT&&(Y=i.R16I),F===i.INT&&(Y=i.R32I)),g===i.RG&&(F===i.FLOAT&&(Y=i.RG32F),F===i.HALF_FLOAT&&(Y=i.RG16F),F===i.UNSIGNED_BYTE&&(Y=i.RG8)),g===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RG8UI),F===i.UNSIGNED_SHORT&&(Y=i.RG16UI),F===i.UNSIGNED_INT&&(Y=i.RG32UI),F===i.BYTE&&(Y=i.RG8I),F===i.SHORT&&(Y=i.RG16I),F===i.INT&&(Y=i.RG32I)),g===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),F===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),F===i.UNSIGNED_INT&&(Y=i.RGB32UI),F===i.BYTE&&(Y=i.RGB8I),F===i.SHORT&&(Y=i.RGB16I),F===i.INT&&(Y=i.RGB32I)),g===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),F===i.UNSIGNED_INT&&(Y=i.RGBA32UI),F===i.BYTE&&(Y=i.RGBA8I),F===i.SHORT&&(Y=i.RGBA16I),F===i.INT&&(Y=i.RGBA32I)),g===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),g===i.RGBA){const Me=Q?Nr:Ve.getTransfer(Z);F===i.FLOAT&&(Y=i.RGBA32F),F===i.HALF_FLOAT&&(Y=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Y=Me===Ze?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function S(b,g){let F;return b?g===null||g===zn||g===gi?F=i.DEPTH24_STENCIL8:g===rn?F=i.DEPTH32F_STENCIL8:g===Oi&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===zn||g===gi?F=i.DEPTH_COMPONENT24:g===rn?F=i.DEPTH_COMPONENT32F:g===Oi&&(F=i.DEPTH_COMPONENT16),F}function I(b,g){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==kt&&b.minFilter!==Ot?Math.log2(Math.max(g.width,g.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?g.mipmaps.length:1}function A(b){const g=b.target;g.removeEventListener("dispose",A),U(g),g.isVideoTexture&&h.delete(g)}function R(b){const g=b.target;g.removeEventListener("dispose",R),v(g)}function U(b){const g=n.get(b);if(g.__webglInit===void 0)return;const F=b.source,Z=d.get(F);if(Z){const Q=Z[g.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(b),Object.keys(Z).length===0&&d.delete(F)}n.remove(b)}function M(b){const g=n.get(b);i.deleteTexture(g.__webglTexture);const F=b.source,Z=d.get(F);delete Z[g.__cacheKey],a.memory.textures--}function v(b){const g=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(g.__webglFramebuffer[Z]))for(let Q=0;Q<g.__webglFramebuffer[Z].length;Q++)i.deleteFramebuffer(g.__webglFramebuffer[Z][Q]);else i.deleteFramebuffer(g.__webglFramebuffer[Z]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[Z])}else{if(Array.isArray(g.__webglFramebuffer))for(let Z=0;Z<g.__webglFramebuffer.length;Z++)i.deleteFramebuffer(g.__webglFramebuffer[Z]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let Z=0;Z<g.__webglColorRenderbuffer.length;Z++)g.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[Z]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const F=b.textures;for(let Z=0,Q=F.length;Z<Q;Z++){const Y=n.get(F[Z]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(F[Z])}n.remove(b)}let w=0;function W(){w=0}function B(){const b=w;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),w+=1,b}function X(b){const g=[];return g.push(b.wrapS),g.push(b.wrapT),g.push(b.wrapR||0),g.push(b.magFilter),g.push(b.minFilter),g.push(b.anisotropy),g.push(b.internalFormat),g.push(b.format),g.push(b.type),g.push(b.generateMipmaps),g.push(b.premultiplyAlpha),g.push(b.flipY),g.push(b.unpackAlignment),g.push(b.colorSpace),g.join()}function j(b,g){const F=n.get(b);if(b.isVideoTexture&&be(b),b.isRenderTargetTexture===!1&&b.version>0&&F.__version!==b.version){const Z=b.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(F,b,g);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+g)}function q(b,g){const F=n.get(b);if(b.version>0&&F.__version!==b.version){V(F,b,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+g)}function ie(b,g){const F=n.get(b);if(b.version>0&&F.__version!==b.version){V(F,b,g);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+g)}function H(b,g){const F=n.get(b);if(b.version>0&&F.__version!==b.version){J(F,b,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+g)}const O={[Cr]:i.REPEAT,[On]:i.CLAMP_TO_EDGE,[ws]:i.MIRRORED_REPEAT},$={[kt]:i.NEAREST,[Hl]:i.NEAREST_MIPMAP_NEAREST,[qi]:i.NEAREST_MIPMAP_LINEAR,[Ot]:i.LINEAR,[Br]:i.LINEAR_MIPMAP_NEAREST,[xn]:i.LINEAR_MIPMAP_LINEAR},ee={[Yl]:i.NEVER,[Ql]:i.ALWAYS,[Zl]:i.LESS,[zo]:i.LEQUAL,[Kl]:i.EQUAL,[Jl]:i.GEQUAL,[$l]:i.GREATER,[jl]:i.NOTEQUAL};function le(b,g){if(g.type===rn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Ot||g.magFilter===Br||g.magFilter===qi||g.magFilter===xn||g.minFilter===Ot||g.minFilter===Br||g.minFilter===qi||g.minFilter===xn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,O[g.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,O[g.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,O[g.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,$[g.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,$[g.minFilter]),g.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,ee[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===kt||g.minFilter!==qi&&g.minFilter!==xn||g.type===rn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function we(b,g){let F=!1;b.__webglInit===void 0&&(b.__webglInit=!0,g.addEventListener("dispose",A));const Z=g.source;let Q=d.get(Z);Q===void 0&&(Q={},d.set(Z,Q));const Y=X(g);if(Y!==b.__cacheKey){Q[Y]===void 0&&(Q[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Q[Y].usedTimes++;const Me=Q[b.__cacheKey];Me!==void 0&&(Q[b.__cacheKey].usedTimes--,Me.usedTimes===0&&M(g)),b.__cacheKey=Y,b.__webglTexture=Q[Y].texture}return F}function V(b,g,F){let Z=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(Z=i.TEXTURE_3D);const Q=we(b,g),Y=g.source;t.bindTexture(Z,b.__webglTexture,i.TEXTURE0+F);const Me=n.get(Y);if(Y.version!==Me.__version||Q===!0){t.activeTexture(i.TEXTURE0+F);const ce=Ve.getPrimaries(Ve.workingColorSpace),de=g.colorSpace===vn?null:Ve.getPrimaries(g.colorSpace),ke=g.colorSpace===vn||ce===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let ne=y(g.image,!1,r.maxTextureSize);ne=Je(g,ne);const pe=s.convert(g.format,g.colorSpace),Te=s.convert(g.type);let Ae=E(g.internalFormat,pe,Te,g.colorSpace,g.isVideoTexture);le(Z,g);let me;const ze=g.mipmaps,Ue=g.isVideoTexture!==!0,$e=Me.__version===void 0||Q===!0,C=Y.dataReady,oe=I(g,ne);if(g.isDepthTexture)Ae=S(g.format===_i,g.type),$e&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,Ae,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Ae,ne.width,ne.height,0,pe,Te,null));else if(g.isDataTexture)if(ze.length>0){Ue&&$e&&t.texStorage2D(i.TEXTURE_2D,oe,Ae,ze[0].width,ze[0].height);for(let G=0,K=ze.length;G<K;G++)me=ze[G],Ue?C&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,Te,me.data):t.texImage2D(i.TEXTURE_2D,G,Ae,me.width,me.height,0,pe,Te,me.data);g.generateMipmaps=!1}else Ue?($e&&t.texStorage2D(i.TEXTURE_2D,oe,Ae,ne.width,ne.height),C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ne.width,ne.height,pe,Te,ne.data)):t.texImage2D(i.TEXTURE_2D,0,Ae,ne.width,ne.height,0,pe,Te,ne.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ue&&$e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,Ae,ze[0].width,ze[0].height,ne.depth);for(let G=0,K=ze.length;G<K;G++)if(me=ze[G],g.format!==Bt)if(pe!==null)if(Ue){if(C)if(g.layerUpdates.size>0){const fe=Mo(me.width,me.height,g.format,g.type);for(const he of g.layerUpdates){const De=me.data.subarray(he*fe/me.data.BYTES_PER_ELEMENT,(he+1)*fe/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,he,me.width,me.height,1,pe,De)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,ne.depth,pe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,G,Ae,me.width,me.height,ne.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?C&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,ne.depth,pe,Te,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,G,Ae,me.width,me.height,ne.depth,0,pe,Te,me.data)}else{Ue&&$e&&t.texStorage2D(i.TEXTURE_2D,oe,Ae,ze[0].width,ze[0].height);for(let G=0,K=ze.length;G<K;G++)me=ze[G],g.format!==Bt?pe!==null?Ue?C&&t.compressedTexSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,G,Ae,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?C&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,Te,me.data):t.texImage2D(i.TEXTURE_2D,G,Ae,me.width,me.height,0,pe,Te,me.data)}else if(g.isDataArrayTexture)if(Ue){if($e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,Ae,ne.width,ne.height,ne.depth),C)if(g.layerUpdates.size>0){const G=Mo(ne.width,ne.height,g.format,g.type);for(const K of g.layerUpdates){const fe=ne.data.subarray(K*G/ne.data.BYTES_PER_ELEMENT,(K+1)*G/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,ne.width,ne.height,1,pe,Te,fe)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,pe,Te,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,ne.width,ne.height,ne.depth,0,pe,Te,ne.data);else if(g.isData3DTexture)Ue?($e&&t.texStorage3D(i.TEXTURE_3D,oe,Ae,ne.width,ne.height,ne.depth),C&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,pe,Te,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,ne.width,ne.height,ne.depth,0,pe,Te,ne.data);else if(g.isFramebufferTexture){if($e)if(Ue)t.texStorage2D(i.TEXTURE_2D,oe,Ae,ne.width,ne.height);else{let G=ne.width,K=ne.height;for(let fe=0;fe<oe;fe++)t.texImage2D(i.TEXTURE_2D,fe,Ae,G,K,0,pe,Te,null),G>>=1,K>>=1}}else if(ze.length>0){if(Ue&&$e){const G=Ee(ze[0]);t.texStorage2D(i.TEXTURE_2D,oe,Ae,G.width,G.height)}for(let G=0,K=ze.length;G<K;G++)me=ze[G],Ue?C&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,pe,Te,me):t.texImage2D(i.TEXTURE_2D,G,Ae,pe,Te,me);g.generateMipmaps=!1}else if(Ue){if($e){const G=Ee(ne);t.texStorage2D(i.TEXTURE_2D,oe,Ae,G.width,G.height)}C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Te,ne)}else t.texImage2D(i.TEXTURE_2D,0,Ae,pe,Te,ne);p(g)&&u(Z),Me.__version=Y.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function J(b,g,F){if(g.image.length!==6)return;const Z=we(b,g),Q=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+F);const Y=n.get(Q);if(Q.version!==Y.__version||Z===!0){t.activeTexture(i.TEXTURE0+F);const Me=Ve.getPrimaries(Ve.workingColorSpace),ce=g.colorSpace===vn?null:Ve.getPrimaries(g.colorSpace),de=g.colorSpace===vn||Me===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const ke=g.isCompressedTexture||g.image[0].isCompressedTexture,ne=g.image[0]&&g.image[0].isDataTexture,pe=[];for(let K=0;K<6;K++)!ke&&!ne?pe[K]=y(g.image[K],!0,r.maxCubemapSize):pe[K]=ne?g.image[K].image:g.image[K],pe[K]=Je(g,pe[K]);const Te=pe[0],Ae=s.convert(g.format,g.colorSpace),me=s.convert(g.type),ze=E(g.internalFormat,Ae,me,g.colorSpace),Ue=g.isVideoTexture!==!0,$e=Y.__version===void 0||Z===!0,C=Q.dataReady;let oe=I(g,Te);le(i.TEXTURE_CUBE_MAP,g);let G;if(ke){Ue&&$e&&t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ze,Te.width,Te.height);for(let K=0;K<6;K++){G=pe[K].mipmaps;for(let fe=0;fe<G.length;fe++){const he=G[fe];g.format!==Bt?Ae!==null?Ue?C&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe,0,0,he.width,he.height,Ae,he.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe,ze,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe,0,0,he.width,he.height,Ae,me,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe,ze,he.width,he.height,0,Ae,me,he.data)}}}else{if(G=g.mipmaps,Ue&&$e){G.length>0&&oe++;const K=Ee(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ze,K.width,K.height)}for(let K=0;K<6;K++)if(ne){Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,pe[K].width,pe[K].height,Ae,me,pe[K].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ze,pe[K].width,pe[K].height,0,Ae,me,pe[K].data);for(let fe=0;fe<G.length;fe++){const De=G[fe].image[K].image;Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe+1,0,0,De.width,De.height,Ae,me,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe+1,ze,De.width,De.height,0,Ae,me,De.data)}}else{Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ae,me,pe[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ze,Ae,me,pe[K]);for(let fe=0;fe<G.length;fe++){const he=G[fe];Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe+1,0,0,Ae,me,he.image[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,fe+1,ze,Ae,me,he.image[K])}}}p(g)&&u(i.TEXTURE_CUBE_MAP),Y.__version=Q.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function se(b,g,F,Z,Q,Y){const Me=s.convert(F.format,F.colorSpace),ce=s.convert(F.type),de=E(F.internalFormat,Me,ce,F.colorSpace),ke=n.get(g),ne=n.get(F);if(ne.__renderTarget=g,!ke.__hasExternalTextures){const pe=Math.max(1,g.width>>Y),Te=Math.max(1,g.height>>Y);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,Y,de,pe,Te,g.depth,0,Me,ce,null):t.texImage2D(Q,Y,de,pe,Te,0,Me,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),Be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,Q,ne.__webglTexture,0,Oe(g)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,Q,ne.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function te(b,g,F){if(i.bindRenderbuffer(i.RENDERBUFFER,b),g.depthBuffer){const Z=g.depthTexture,Q=Z&&Z.isDepthTexture?Z.type:null,Y=S(g.stencilBuffer,Q),Me=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=Oe(g);Be(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce,Y,g.width,g.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,Y,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,Y,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,b)}else{const Z=g.textures;for(let Q=0;Q<Z.length;Q++){const Y=Z[Q],Me=s.convert(Y.format,Y.colorSpace),ce=s.convert(Y.type),de=E(Y.internalFormat,Me,ce,Y.colorSpace),ke=Oe(g);F&&Be(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ke,de,g.width,g.height):Be(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ke,de,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,de,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ge(b,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(g.depthTexture);Z.__renderTarget=g,(!Z.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),j(g.depthTexture,0);const Q=Z.__webglTexture,Y=Oe(g);if(g.depthTexture.format===hi)Be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(g.depthTexture.format===_i)Be(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Se(b){const g=n.get(b),F=b.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==b.depthTexture){const Z=b.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),Z){const Q=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,Z.removeEventListener("dispose",Q)};Z.addEventListener("dispose",Q),g.__depthDisposeCallback=Q}g.__boundDepthTexture=Z}if(b.depthTexture&&!g.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");ge(g.__webglFramebuffer,b)}else if(F){g.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[Z]),g.__webglDepthbuffer[Z]===void 0)g.__webglDepthbuffer[Z]=i.createRenderbuffer(),te(g.__webglDepthbuffer[Z],b,!1);else{const Q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=g.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Y)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),te(g.__webglDepthbuffer,b,!1);else{const Z=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,Q)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pe(b,g,F){const Z=n.get(b);g!==void 0&&se(Z.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Se(b)}function Ke(b){const g=b.texture,F=n.get(b),Z=n.get(g);b.addEventListener("dispose",R);const Q=b.textures,Y=b.isWebGLCubeRenderTarget===!0,Me=Q.length>1;if(Me||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=g.version,a.memory.textures++),Y){F.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(g.mipmaps&&g.mipmaps.length>0){F.__webglFramebuffer[ce]=[];for(let de=0;de<g.mipmaps.length;de++)F.__webglFramebuffer[ce][de]=i.createFramebuffer()}else F.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){F.__webglFramebuffer=[];for(let ce=0;ce<g.mipmaps.length;ce++)F.__webglFramebuffer[ce]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Me)for(let ce=0,de=Q.length;ce<de;ce++){const ke=n.get(Q[ce]);ke.__webglTexture===void 0&&(ke.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&Be(b)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ce=0;ce<Q.length;ce++){const de=Q[ce];F.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ce]);const ke=s.convert(de.format,de.colorSpace),ne=s.convert(de.type),pe=E(de.internalFormat,ke,ne,de.colorSpace,b.isXRRenderTarget===!0),Te=Oe(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Te,pe,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,F.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),te(F.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),le(i.TEXTURE_CUBE_MAP,g);for(let ce=0;ce<6;ce++)if(g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)se(F.__webglFramebuffer[ce][de],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,de);else se(F.__webglFramebuffer[ce],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);p(g)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let ce=0,de=Q.length;ce<de;ce++){const ke=Q[ce],ne=n.get(ke);t.bindTexture(i.TEXTURE_2D,ne.__webglTexture),le(i.TEXTURE_2D,ke),se(F.__webglFramebuffer,b,ke,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,0),p(ke)&&u(i.TEXTURE_2D)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ce=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,Z.__webglTexture),le(ce,g),g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)se(F.__webglFramebuffer[de],b,g,i.COLOR_ATTACHMENT0,ce,de);else se(F.__webglFramebuffer,b,g,i.COLOR_ATTACHMENT0,ce,0);p(g)&&u(ce),t.unbindTexture()}b.depthBuffer&&Se(b)}function Fe(b){const g=b.textures;for(let F=0,Z=g.length;F<Z;F++){const Q=g[F];if(p(Q)){const Y=T(b),Me=n.get(Q).__webglTexture;t.bindTexture(Y,Me),u(Y),t.unbindTexture()}}}const rt=[],L=[];function Tt(b){if(b.samples>0){if(Be(b)===!1){const g=b.textures,F=b.width,Z=b.height;let Q=i.COLOR_BUFFER_BIT;const Y=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(b),ce=g.length>1;if(ce)for(let de=0;de<g.length;de++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let de=0;de<g.length;de++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[de]);const ke=n.get(g[de]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ke,0)}i.blitFramebuffer(0,0,F,Z,0,0,F,Z,Q,i.NEAREST),l===!0&&(rt.length=0,L.length=0,rt.push(i.COLOR_ATTACHMENT0+de),b.depthBuffer&&b.resolveDepthBuffer===!1&&(rt.push(Y),L.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let de=0;de<g.length;de++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,Me.__webglColorRenderbuffer[de]);const ke=n.get(g[de]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const g=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Oe(b){return Math.min(r.maxSamples,b.samples)}function Be(b){const g=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function be(b){const g=a.render.frame;h.get(b)!==g&&(h.set(b,g),b.update())}function Je(b,g){const F=b.colorSpace,Z=b.format,Q=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||F!==xi&&F!==vn&&(Ve.getTransfer(F)===Ze?(Z!==Bt||Q!==Xt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),g}function Ee(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=W,this.setTexture2D=j,this.setTexture2DArray=q,this.setTexture3D=ie,this.setTextureCube=H,this.rebindTextures=Pe,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=se,this.useMultisampledRTT=Be}function yp(i,e){function t(n,r=vn){let s;const a=Ve.getTransfer(r);if(n===Xt)return i.UNSIGNED_BYTE;if(n===ra)return i.UNSIGNED_SHORT_4_4_4_4;if(n===sa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Lo)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Po)return i.BYTE;if(n===Do)return i.SHORT;if(n===Oi)return i.UNSIGNED_SHORT;if(n===ia)return i.INT;if(n===zn)return i.UNSIGNED_INT;if(n===rn)return i.FLOAT;if(n===ki)return i.HALF_FLOAT;if(n===Uo)return i.ALPHA;if(n===Io)return i.RGB;if(n===Bt)return i.RGBA;if(n===No)return i.LUMINANCE;if(n===Fo)return i.LUMINANCE_ALPHA;if(n===hi)return i.DEPTH_COMPONENT;if(n===_i)return i.DEPTH_STENCIL;if(n===aa)return i.RED;if(n===oa)return i.RED_INTEGER;if(n===Oo)return i.RG;if(n===la)return i.RG_INTEGER;if(n===ca)return i.RGBA_INTEGER;if(n===Sr||n===Er||n===br||n===Tr)if(a===Ze)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Sr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Er)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===br)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Tr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Sr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Er)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===br)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Tr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===As||n===Rs||n===Cs||n===Ps)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===As)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Rs)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Cs)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ps)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ds||n===Ls||n===Us)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ds||n===Ls)return a===Ze?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Us)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Is||n===Ns||n===Fs||n===Os||n===Bs||n===zs||n===ks||n===Vs||n===Hs||n===Gs||n===Ws||n===Xs||n===qs||n===Ys)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Is)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ns)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Os)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ks)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Hs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Gs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ws)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qs)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ys)return a===Ze?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wr||n===Zs||n===Ks)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===wr)return a===Ze?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zs)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ks)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Bo||n===$s||n===js||n===Js)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===wr)return s.COMPRESSED_RED_RGTC1_EXT;if(n===$s)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===js)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Js)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Sp extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class li extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ep={type:"move"};class us{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new li,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new li,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new li,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const p=t.getJointPose(y,n),u=this._getHandJoint(c,y);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),m=.02,_=.005;c.inputState.pinching&&d>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ep)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new li;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const bp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new _t,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ln({vertexShader:bp,fragmentShader:Tp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new Gi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ap extends Mi{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,m=null,_=null;const y=new wp,p=t.getContextAttributes();let u=null,T=null;const E=[],S=[],I=new Ne;let A=null;const R=new Ct;R.viewport=new tt;const U=new Ct;U.viewport=new tt;const M=[R,U],v=new Sp;let w=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let J=E[V];return J===void 0&&(J=new us,E[V]=J),J.getTargetRaySpace()},this.getControllerGrip=function(V){let J=E[V];return J===void 0&&(J=new us,E[V]=J),J.getGripSpace()},this.getHand=function(V){let J=E[V];return J===void 0&&(J=new us,E[V]=J),J.getHandSpace()};function B(V){const J=S.indexOf(V.inputSource);if(J===-1)return;const se=E[J];se!==void 0&&(se.update(V.inputSource,V.frame,c||a),se.dispatchEvent({type:V.type,data:V.inputSource}))}function X(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",j);for(let V=0;V<E.length;V++){const J=S[V];J!==null&&(S[V]=null,E[V].disconnect(J))}w=null,W=null,y.reset(),e.setRenderTarget(u),m=null,d=null,f=null,r=null,T=null,we.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",X),r.addEventListener("inputsourceschange",j),p.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(I),r.renderState.layers===void 0){const J={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,J),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),T=new kn(m.framebufferWidth,m.framebufferHeight,{format:Bt,type:Xt,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let J=null,se=null,te=null;p.depth&&(te=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=p.stencil?_i:hi,se=p.stencil?gi:zn);const ge={colorFormat:t.RGBA8,depthFormat:te,scaleFactor:s};f=new XRWebGLBinding(r,t),d=f.createProjectionLayer(ge),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),T=new kn(d.textureWidth,d.textureHeight,{format:Bt,type:Xt,depthTexture:new Qo(d.textureWidth,d.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),we.setContext(r),we.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function j(V){for(let J=0;J<V.removed.length;J++){const se=V.removed[J],te=S.indexOf(se);te>=0&&(S[te]=null,E[te].disconnect(se))}for(let J=0;J<V.added.length;J++){const se=V.added[J];let te=S.indexOf(se);if(te===-1){for(let Se=0;Se<E.length;Se++)if(Se>=S.length){S.push(se),te=Se;break}else if(S[Se]===null){S[Se]=se,te=Se;break}if(te===-1)break}const ge=E[te];ge&&ge.connect(se)}}const q=new N,ie=new N;function H(V,J,se){q.setFromMatrixPosition(J.matrixWorld),ie.setFromMatrixPosition(se.matrixWorld);const te=q.distanceTo(ie),ge=J.projectionMatrix.elements,Se=se.projectionMatrix.elements,Pe=ge[14]/(ge[10]-1),Ke=ge[14]/(ge[10]+1),Fe=(ge[9]+1)/ge[5],rt=(ge[9]-1)/ge[5],L=(ge[8]-1)/ge[0],Tt=(Se[8]+1)/Se[0],Oe=Pe*L,Be=Pe*Tt,be=te/(-L+Tt),Je=be*-L;if(J.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Je),V.translateZ(be),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),ge[10]===-1)V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Ee=Pe+be,b=Ke+be,g=Oe-Je,F=Be+(te-Je),Z=Fe*Ke/b*Ee,Q=rt*Ke/b*Ee;V.projectionMatrix.makePerspective(g,F,Z,Q,Ee,b),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function O(V,J){J===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(J.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;let J=V.near,se=V.far;y.texture!==null&&(y.depthNear>0&&(J=y.depthNear),y.depthFar>0&&(se=y.depthFar)),v.near=U.near=R.near=J,v.far=U.far=R.far=se,(w!==v.near||W!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),w=v.near,W=v.far),R.layers.mask=V.layers.mask|2,U.layers.mask=V.layers.mask|4,v.layers.mask=R.layers.mask|U.layers.mask;const te=V.parent,ge=v.cameras;O(v,te);for(let Se=0;Se<ge.length;Se++)O(ge[Se],te);ge.length===2?H(v,R,U):v.projectionMatrix.copy(R.projectionMatrix),$(V,v,te)};function $(V,J,se){se===null?V.matrix.copy(J.matrixWorld):(V.matrix.copy(se.matrixWorld),V.matrix.invert(),V.matrix.multiply(J.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Bi*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=V)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(v)};let ee=null;function le(V,J){if(h=J.getViewerPose(c||a),_=J,h!==null){const se=h.views;m!==null&&(e.setRenderTargetFramebuffer(T,m.framebuffer),e.setRenderTarget(T));let te=!1;se.length!==v.cameras.length&&(v.cameras.length=0,te=!0);for(let Se=0;Se<se.length;Se++){const Pe=se[Se];let Ke=null;if(m!==null)Ke=m.getViewport(Pe);else{const rt=f.getViewSubImage(d,Pe);Ke=rt.viewport,Se===0&&(e.setRenderTargetTextures(T,rt.colorTexture,d.ignoreDepthValues?void 0:rt.depthStencilTexture),e.setRenderTarget(T))}let Fe=M[Se];Fe===void 0&&(Fe=new Ct,Fe.layers.enable(Se),Fe.viewport=new tt,M[Se]=Fe),Fe.matrix.fromArray(Pe.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(Pe.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Se===0&&(v.matrix.copy(Fe.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),te===!0&&v.cameras.push(Fe)}const ge=r.enabledFeatures;if(ge&&ge.includes("depth-sensing")){const Se=f.getDepthInformation(se[0]);Se&&Se.isValid&&Se.texture&&y.init(e,Se,r.renderState)}}for(let se=0;se<E.length;se++){const te=S[se],ge=E[se];te!==null&&ge!==void 0&&ge.update(te,J,c||a)}ee&&ee(V,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),_=null}const we=new Jo;we.setAnimationLoop(le),this.setAnimationLoop=function(V){ee=V},this.dispose=function(){}}}const Pn=new Ht,Rp=new nt;function Cp(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Zo(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function r(p,u,T,E,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(p,u):u.isMeshToonMaterial?(s(p,u),f(p,u)):u.isMeshPhongMaterial?(s(p,u),h(p,u)):u.isMeshStandardMaterial?(s(p,u),d(p,u),u.isMeshPhysicalMaterial&&m(p,u,S)):u.isMeshMatcapMaterial?(s(p,u),_(p,u)):u.isMeshDepthMaterial?s(p,u):u.isMeshDistanceMaterial?(s(p,u),y(p,u)):u.isMeshNormalMaterial?s(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,T,E):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===xt&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===xt&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const T=e.get(u),E=T.envMap,S=T.envMapRotation;E&&(p.envMap.value=E,Pn.copy(S),Pn.x*=-1,Pn.y*=-1,Pn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Pn.y*=-1,Pn.z*=-1),p.envMapRotation.value.setFromMatrix4(Rp.makeRotationFromEuler(Pn)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,T,E){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*T,p.scale.value=E*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function d(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,T){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===xt&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,u){u.matcap&&(p.matcap.value=u.matcap)}function y(p,u){const T=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Pp(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,E){const S=E.program;n.uniformBlockBinding(T,S)}function c(T,E){let S=r[T.id];S===void 0&&(_(T),S=h(T),r[T.id]=S,T.addEventListener("dispose",p));const I=E.program;n.updateUBOMapping(T,I);const A=e.render.frame;s[T.id]!==A&&(d(T),s[T.id]=A)}function h(T){const E=f();T.__bindingPointIndex=E;const S=i.createBuffer(),I=T.__size,A=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,I,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,S),S}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const E=r[T.id],S=T.uniforms,I=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let A=0,R=S.length;A<R;A++){const U=Array.isArray(S[A])?S[A]:[S[A]];for(let M=0,v=U.length;M<v;M++){const w=U[M];if(m(w,A,M,I)===!0){const W=w.__offset,B=Array.isArray(w.value)?w.value:[w.value];let X=0;for(let j=0;j<B.length;j++){const q=B[j],ie=y(q);typeof q=="number"||typeof q=="boolean"?(w.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,W+X,w.__data)):q.isMatrix3?(w.__data[0]=q.elements[0],w.__data[1]=q.elements[1],w.__data[2]=q.elements[2],w.__data[3]=0,w.__data[4]=q.elements[3],w.__data[5]=q.elements[4],w.__data[6]=q.elements[5],w.__data[7]=0,w.__data[8]=q.elements[6],w.__data[9]=q.elements[7],w.__data[10]=q.elements[8],w.__data[11]=0):(q.toArray(w.__data,X),X+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(T,E,S,I){const A=T.value,R=E+"_"+S;if(I[R]===void 0)return typeof A=="number"||typeof A=="boolean"?I[R]=A:I[R]=A.clone(),!0;{const U=I[R];if(typeof A=="number"||typeof A=="boolean"){if(U!==A)return I[R]=A,!0}else if(U.equals(A)===!1)return U.copy(A),!0}return!1}function _(T){const E=T.uniforms;let S=0;const I=16;for(let R=0,U=E.length;R<U;R++){const M=Array.isArray(E[R])?E[R]:[E[R]];for(let v=0,w=M.length;v<w;v++){const W=M[v],B=Array.isArray(W.value)?W.value:[W.value];for(let X=0,j=B.length;X<j;X++){const q=B[X],ie=y(q),H=S%I,O=H%ie.boundary,$=H+O;S+=O,$!==0&&I-$<ie.storage&&(S+=I-$),W.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=S,S+=ie.storage}}}const A=S%I;return A>0&&(S+=I-A),T.__size=S,T.__cache={},this}function y(T){const E={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(E.boundary=4,E.storage=4):T.isVector2?(E.boundary=8,E.storage=8):T.isVector3||T.isColor?(E.boundary=16,E.storage=12):T.isVector4?(E.boundary=16,E.storage=16):T.isMatrix3?(E.boundary=48,E.storage=48):T.isMatrix4?(E.boundary=64,E.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),E}function p(T){const E=T.target;E.removeEventListener("dispose",p);const S=a.indexOf(E.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(r[E.id]),delete r[E.id],delete s[E.id]}function u(){for(const T in r)i.deleteBuffer(r[T]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class Dp{constructor(e={}){const{canvas:t=_c(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),y=new Int32Array(4);let p=null,u=null;const T=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bt,this.toneMapping=yn,this.toneMappingExposure=1;const S=this;let I=!1,A=0,R=0,U=null,M=-1,v=null;const w=new tt,W=new tt;let B=null;const X=new Xe(0);let j=0,q=t.width,ie=t.height,H=1,O=null,$=null;const ee=new tt(0,0,q,ie),le=new tt(0,0,q,ie);let we=!1;const V=new jo;let J=!1,se=!1;const te=new nt,ge=new nt,Se=new N,Pe=new tt,Ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Fe=!1;function rt(){return U===null?H:1}let L=n;function Tt(x,P){return t.getContext(x,P)}try{const x={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${na}`),t.addEventListener("webglcontextlost",K,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",he,!1),L===null){const P="webgl2";if(L=Tt(P,x),L===null)throw Tt(P)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Oe,Be,be,Je,Ee,b,g,F,Z,Q,Y,Me,ce,de,ke,ne,pe,Te,Ae,me,ze,Ue,$e,C;function oe(){Oe=new Ff(L),Oe.init(),Ue=new yp(L,Oe),Be=new Cf(L,Oe,e,Ue),be=new vp(L,Oe),Be.reverseDepthBuffer&&d&&be.buffers.depth.setReversed(!0),Je=new zf(L),Ee=new ip,b=new Mp(L,Oe,be,Ee,Be,Ue,Je),g=new Df(S),F=new Nf(S),Z=new Wc(L),$e=new Af(L,Z),Q=new Of(L,Z,Je,$e),Y=new Vf(L,Q,Z,Je),Ae=new kf(L,Be,b),ne=new Pf(Ee),Me=new np(S,g,F,Oe,Be,$e,ne),ce=new Cp(S,Ee),de=new sp,ke=new up(Oe),Te=new wf(S,g,F,be,Y,m,l),pe=new gp(S,Y,Be),C=new Pp(L,Je,Be,be),me=new Rf(L,Oe,Je),ze=new Bf(L,Oe,Je),Je.programs=Me.programs,S.capabilities=Be,S.extensions=Oe,S.properties=Ee,S.renderLists=de,S.shadowMap=pe,S.state=be,S.info=Je}oe();const G=new Ap(S,L);this.xr=G,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const x=Oe.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Oe.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(x){x!==void 0&&(H=x,this.setSize(q,ie,!1))},this.getSize=function(x){return x.set(q,ie)},this.setSize=function(x,P,z=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=x,ie=P,t.width=Math.floor(x*H),t.height=Math.floor(P*H),z===!0&&(t.style.width=x+"px",t.style.height=P+"px"),this.setViewport(0,0,x,P)},this.getDrawingBufferSize=function(x){return x.set(q*H,ie*H).floor()},this.setDrawingBufferSize=function(x,P,z){q=x,ie=P,H=z,t.width=Math.floor(x*z),t.height=Math.floor(P*z),this.setViewport(0,0,x,P)},this.getCurrentViewport=function(x){return x.copy(w)},this.getViewport=function(x){return x.copy(ee)},this.setViewport=function(x,P,z,k){x.isVector4?ee.set(x.x,x.y,x.z,x.w):ee.set(x,P,z,k),be.viewport(w.copy(ee).multiplyScalar(H).round())},this.getScissor=function(x){return x.copy(le)},this.setScissor=function(x,P,z,k){x.isVector4?le.set(x.x,x.y,x.z,x.w):le.set(x,P,z,k),be.scissor(W.copy(le).multiplyScalar(H).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(x){be.setScissorTest(we=x)},this.setOpaqueSort=function(x){O=x},this.setTransparentSort=function(x){$=x},this.getClearColor=function(x){return x.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(x=!0,P=!0,z=!0){let k=0;if(x){let D=!1;if(U!==null){const re=U.texture.format;D=re===ca||re===la||re===oa}if(D){const re=U.texture.type,ue=re===Xt||re===zn||re===Oi||re===gi||re===ra||re===sa,_e=Te.getClearColor(),ve=Te.getClearAlpha(),Re=_e.r,Le=_e.g,xe=_e.b;ue?(_[0]=Re,_[1]=Le,_[2]=xe,_[3]=ve,L.clearBufferuiv(L.COLOR,0,_)):(y[0]=Re,y[1]=Le,y[2]=xe,y[3]=ve,L.clearBufferiv(L.COLOR,0,y))}else k|=L.COLOR_BUFFER_BIT}P&&(k|=L.DEPTH_BUFFER_BIT),z&&(k|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",K,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",he,!1),de.dispose(),ke.dispose(),Ee.dispose(),g.dispose(),F.dispose(),Y.dispose(),$e.dispose(),C.dispose(),Me.dispose(),G.dispose(),G.removeEventListener("sessionstart",pa),G.removeEventListener("sessionend",ma),bn.stop()};function K(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const x=Je.autoReset,P=pe.enabled,z=pe.autoUpdate,k=pe.needsUpdate,D=pe.type;oe(),Je.autoReset=x,pe.enabled=P,pe.autoUpdate=z,pe.needsUpdate=k,pe.type=D}function he(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function De(x){const P=x.target;P.removeEventListener("dispose",De),it(P)}function it(x){ht(x),Ee.remove(x)}function ht(x){const P=Ee.get(x).programs;P!==void 0&&(P.forEach(function(z){Me.releaseProgram(z)}),x.isShaderMaterial&&Me.releaseShaderCache(x))}this.renderBufferDirect=function(x,P,z,k,D,re){P===null&&(P=Ke);const ue=D.isMesh&&D.matrixWorld.determinant()<0,_e=cl(x,P,z,k,D);be.setMaterial(k,ue);let ve=z.index,Re=1;if(k.wireframe===!0){if(ve=Q.getWireframeAttribute(z),ve===void 0)return;Re=2}const Le=z.drawRange,xe=z.attributes.position;let He=Le.start*Re,je=(Le.start+Le.count)*Re;re!==null&&(He=Math.max(He,re.start*Re),je=Math.min(je,(re.start+re.count)*Re)),ve!==null?(He=Math.max(He,0),je=Math.min(je,ve.count)):xe!=null&&(He=Math.max(He,0),je=Math.min(je,xe.count));const Qe=je-He;if(Qe<0||Qe===1/0)return;$e.setup(D,k,_e,z,ve);let vt,Ge=me;if(ve!==null&&(vt=Z.get(ve),Ge=ze,Ge.setIndex(vt)),D.isMesh)k.wireframe===!0?(be.setLineWidth(k.wireframeLinewidth*rt()),Ge.setMode(L.LINES)):Ge.setMode(L.TRIANGLES);else if(D.isLine){let ye=k.linewidth;ye===void 0&&(ye=1),be.setLineWidth(ye*rt()),D.isLineSegments?Ge.setMode(L.LINES):D.isLineLoop?Ge.setMode(L.LINE_LOOP):Ge.setMode(L.LINE_STRIP)}else D.isPoints?Ge.setMode(L.POINTS):D.isSprite&&Ge.setMode(L.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)Ge.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(Oe.get("WEBGL_multi_draw"))Ge.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{const ye=D._multiDrawStarts,Yt=D._multiDrawCounts,We=D._multiDrawCount,Lt=ve?Z.get(ve).bytesPerElement:1,Hn=Ee.get(k).currentProgram.getUniforms();for(let yt=0;yt<We;yt++)Hn.setValue(L,"_gl_DrawID",yt),Ge.render(ye[yt]/Lt,Yt[yt])}else if(D.isInstancedMesh)Ge.renderInstances(He,Qe,D.count);else if(z.isInstancedBufferGeometry){const ye=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Yt=Math.min(z.instanceCount,ye);Ge.renderInstances(He,Qe,Yt)}else Ge.render(He,Qe)};function qe(x,P,z){x.transparent===!0&&x.side===nn&&x.forceSinglePass===!1?(x.side=xt,x.needsUpdate=!0,Xi(x,P,z),x.side=Sn,x.needsUpdate=!0,Xi(x,P,z),x.side=nn):Xi(x,P,z)}this.compile=function(x,P,z=null){z===null&&(z=x),u=ke.get(z),u.init(P),E.push(u),z.traverseVisible(function(D){D.isLight&&D.layers.test(P.layers)&&(u.pushLight(D),D.castShadow&&u.pushShadow(D))}),x!==z&&x.traverseVisible(function(D){D.isLight&&D.layers.test(P.layers)&&(u.pushLight(D),D.castShadow&&u.pushShadow(D))}),u.setupLights();const k=new Set;return x.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;const re=D.material;if(re)if(Array.isArray(re))for(let ue=0;ue<re.length;ue++){const _e=re[ue];qe(_e,z,D),k.add(_e)}else qe(re,z,D),k.add(re)}),E.pop(),u=null,k},this.compileAsync=function(x,P,z=null){const k=this.compile(x,P,z);return new Promise(D=>{function re(){if(k.forEach(function(ue){Ee.get(ue).currentProgram.isReady()&&k.delete(ue)}),k.size===0){D(x);return}setTimeout(re,10)}Oe.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Dt=null;function qt(x){Dt&&Dt(x)}function pa(){bn.stop()}function ma(){bn.start()}const bn=new Jo;bn.setAnimationLoop(qt),typeof self<"u"&&bn.setContext(self),this.setAnimationLoop=function(x){Dt=x,G.setAnimationLoop(x),x===null?bn.stop():bn.start()},G.addEventListener("sessionstart",pa),G.addEventListener("sessionend",ma),this.render=function(x,P){if(P!==void 0&&P.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(P),P=G.getCamera()),x.isScene===!0&&x.onBeforeRender(S,x,P,U),u=ke.get(x,E.length),u.init(P),E.push(u),ge.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),V.setFromProjectionMatrix(ge),se=this.localClippingEnabled,J=ne.init(this.clippingPlanes,se),p=de.get(x,T.length),p.init(),T.push(p),G.enabled===!0&&G.isPresenting===!0){const re=S.xr.getDepthSensingMesh();re!==null&&Or(re,P,-1/0,S.sortObjects)}Or(x,P,0,S.sortObjects),p.finish(),S.sortObjects===!0&&p.sort(O,$),Fe=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Fe&&Te.addToRenderList(p,x),this.info.render.frame++,J===!0&&ne.beginShadows();const z=u.state.shadowsArray;pe.render(z,x,P),J===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=p.opaque,D=p.transmissive;if(u.setupLights(),P.isArrayCamera){const re=P.cameras;if(D.length>0)for(let ue=0,_e=re.length;ue<_e;ue++){const ve=re[ue];_a(k,D,x,ve)}Fe&&Te.render(x);for(let ue=0,_e=re.length;ue<_e;ue++){const ve=re[ue];ga(p,x,ve,ve.viewport)}}else D.length>0&&_a(k,D,x,P),Fe&&Te.render(x),ga(p,x,P);U!==null&&(b.updateMultisampleRenderTarget(U),b.updateRenderTargetMipmap(U)),x.isScene===!0&&x.onAfterRender(S,x,P),$e.resetDefaultState(),M=-1,v=null,E.pop(),E.length>0?(u=E[E.length-1],J===!0&&ne.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,T.pop(),T.length>0?p=T[T.length-1]:p=null};function Or(x,P,z,k){if(x.visible===!1)return;if(x.layers.test(P.layers)){if(x.isGroup)z=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(P);else if(x.isLight)u.pushLight(x),x.castShadow&&u.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||V.intersectsSprite(x)){k&&Pe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ge);const ue=Y.update(x),_e=x.material;_e.visible&&p.push(x,ue,_e,z,Pe.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||V.intersectsObject(x))){const ue=Y.update(x),_e=x.material;if(k&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Pe.copy(x.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Pe.copy(ue.boundingSphere.center)),Pe.applyMatrix4(x.matrixWorld).applyMatrix4(ge)),Array.isArray(_e)){const ve=ue.groups;for(let Re=0,Le=ve.length;Re<Le;Re++){const xe=ve[Re],He=_e[xe.materialIndex];He&&He.visible&&p.push(x,ue,He,z,Pe.z,xe)}}else _e.visible&&p.push(x,ue,_e,z,Pe.z,null)}}const re=x.children;for(let ue=0,_e=re.length;ue<_e;ue++)Or(re[ue],P,z,k)}function ga(x,P,z,k){const D=x.opaque,re=x.transmissive,ue=x.transparent;u.setupLightsView(z),J===!0&&ne.setGlobalState(S.clippingPlanes,z),k&&be.viewport(w.copy(k)),D.length>0&&Wi(D,P,z),re.length>0&&Wi(re,P,z),ue.length>0&&Wi(ue,P,z),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function _a(x,P,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[k.id]===void 0&&(u.state.transmissionRenderTarget[k.id]=new kn(1,1,{generateMipmaps:!0,type:Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float")?ki:Xt,minFilter:xn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ve.workingColorSpace}));const re=u.state.transmissionRenderTarget[k.id],ue=k.viewport||w;re.setSize(ue.z,ue.w);const _e=S.getRenderTarget();S.setRenderTarget(re),S.getClearColor(X),j=S.getClearAlpha(),j<1&&S.setClearColor(16777215,.5),S.clear(),Fe&&Te.render(z);const ve=S.toneMapping;S.toneMapping=yn;const Re=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),u.setupLightsView(k),J===!0&&ne.setGlobalState(S.clippingPlanes,k),Wi(x,z,k),b.updateMultisampleRenderTarget(re),b.updateRenderTargetMipmap(re),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let xe=0,He=P.length;xe<He;xe++){const je=P[xe],Qe=je.object,vt=je.geometry,Ge=je.material,ye=je.group;if(Ge.side===nn&&Qe.layers.test(k.layers)){const Yt=Ge.side;Ge.side=xt,Ge.needsUpdate=!0,va(Qe,z,k,vt,Ge,ye),Ge.side=Yt,Ge.needsUpdate=!0,Le=!0}}Le===!0&&(b.updateMultisampleRenderTarget(re),b.updateRenderTargetMipmap(re))}S.setRenderTarget(_e),S.setClearColor(X,j),Re!==void 0&&(k.viewport=Re),S.toneMapping=ve}function Wi(x,P,z){const k=P.isScene===!0?P.overrideMaterial:null;for(let D=0,re=x.length;D<re;D++){const ue=x[D],_e=ue.object,ve=ue.geometry,Re=k===null?ue.material:k,Le=ue.group;_e.layers.test(z.layers)&&va(_e,P,z,ve,Re,Le)}}function va(x,P,z,k,D,re){x.onBeforeRender(S,P,z,k,D,re),x.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),D.onBeforeRender(S,P,z,k,x,re),D.transparent===!0&&D.side===nn&&D.forceSinglePass===!1?(D.side=xt,D.needsUpdate=!0,S.renderBufferDirect(z,P,k,D,x,re),D.side=Sn,D.needsUpdate=!0,S.renderBufferDirect(z,P,k,D,x,re),D.side=nn):S.renderBufferDirect(z,P,k,D,x,re),x.onAfterRender(S,P,z,k,D,re)}function Xi(x,P,z){P.isScene!==!0&&(P=Ke);const k=Ee.get(x),D=u.state.lights,re=u.state.shadowsArray,ue=D.state.version,_e=Me.getParameters(x,D.state,re,P,z),ve=Me.getProgramCacheKey(_e);let Re=k.programs;k.environment=x.isMeshStandardMaterial?P.environment:null,k.fog=P.fog,k.envMap=(x.isMeshStandardMaterial?F:g).get(x.envMap||k.environment),k.envMapRotation=k.environment!==null&&x.envMap===null?P.environmentRotation:x.envMapRotation,Re===void 0&&(x.addEventListener("dispose",De),Re=new Map,k.programs=Re);let Le=Re.get(ve);if(Le!==void 0){if(k.currentProgram===Le&&k.lightsStateVersion===ue)return Ma(x,_e),Le}else _e.uniforms=Me.getUniforms(x),x.onBeforeCompile(_e,S),Le=Me.acquireProgram(_e,ve),Re.set(ve,Le),k.uniforms=_e.uniforms;const xe=k.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(xe.clippingPlanes=ne.uniform),Ma(x,_e),k.needsLights=ul(x),k.lightsStateVersion=ue,k.needsLights&&(xe.ambientLightColor.value=D.state.ambient,xe.lightProbe.value=D.state.probe,xe.directionalLights.value=D.state.directional,xe.directionalLightShadows.value=D.state.directionalShadow,xe.spotLights.value=D.state.spot,xe.spotLightShadows.value=D.state.spotShadow,xe.rectAreaLights.value=D.state.rectArea,xe.ltc_1.value=D.state.rectAreaLTC1,xe.ltc_2.value=D.state.rectAreaLTC2,xe.pointLights.value=D.state.point,xe.pointLightShadows.value=D.state.pointShadow,xe.hemisphereLights.value=D.state.hemi,xe.directionalShadowMap.value=D.state.directionalShadowMap,xe.directionalShadowMatrix.value=D.state.directionalShadowMatrix,xe.spotShadowMap.value=D.state.spotShadowMap,xe.spotLightMatrix.value=D.state.spotLightMatrix,xe.spotLightMap.value=D.state.spotLightMap,xe.pointShadowMap.value=D.state.pointShadowMap,xe.pointShadowMatrix.value=D.state.pointShadowMatrix),k.currentProgram=Le,k.uniformsList=null,Le}function xa(x){if(x.uniformsList===null){const P=x.currentProgram.getUniforms();x.uniformsList=Ar.seqWithValue(P.seq,x.uniforms)}return x.uniformsList}function Ma(x,P){const z=Ee.get(x);z.outputColorSpace=P.outputColorSpace,z.batching=P.batching,z.batchingColor=P.batchingColor,z.instancing=P.instancing,z.instancingColor=P.instancingColor,z.instancingMorph=P.instancingMorph,z.skinning=P.skinning,z.morphTargets=P.morphTargets,z.morphNormals=P.morphNormals,z.morphColors=P.morphColors,z.morphTargetsCount=P.morphTargetsCount,z.numClippingPlanes=P.numClippingPlanes,z.numIntersection=P.numClipIntersection,z.vertexAlphas=P.vertexAlphas,z.vertexTangents=P.vertexTangents,z.toneMapping=P.toneMapping}function cl(x,P,z,k,D){P.isScene!==!0&&(P=Ke),b.resetTextureUnits();const re=P.fog,ue=k.isMeshStandardMaterial?P.environment:null,_e=U===null?S.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:xi,ve=(k.isMeshStandardMaterial?F:g).get(k.envMap||ue),Re=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Le=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),xe=!!z.morphAttributes.position,He=!!z.morphAttributes.normal,je=!!z.morphAttributes.color;let Qe=yn;k.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Qe=S.toneMapping);const vt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ge=vt!==void 0?vt.length:0,ye=Ee.get(k),Yt=u.state.lights;if(J===!0&&(se===!0||x!==v)){const wt=x===v&&k.id===M;ne.setState(k,x,wt)}let We=!1;k.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Yt.state.version||ye.outputColorSpace!==_e||D.isBatchedMesh&&ye.batching===!1||!D.isBatchedMesh&&ye.batching===!0||D.isBatchedMesh&&ye.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&ye.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&ye.instancing===!1||!D.isInstancedMesh&&ye.instancing===!0||D.isSkinnedMesh&&ye.skinning===!1||!D.isSkinnedMesh&&ye.skinning===!0||D.isInstancedMesh&&ye.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&ye.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&ye.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&ye.instancingMorph===!1&&D.morphTexture!==null||ye.envMap!==ve||k.fog===!0&&ye.fog!==re||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==ne.numPlanes||ye.numIntersection!==ne.numIntersection)||ye.vertexAlphas!==Re||ye.vertexTangents!==Le||ye.morphTargets!==xe||ye.morphNormals!==He||ye.morphColors!==je||ye.toneMapping!==Qe||ye.morphTargetsCount!==Ge)&&(We=!0):(We=!0,ye.__version=k.version);let Lt=ye.currentProgram;We===!0&&(Lt=Xi(k,P,D));let Hn=!1,yt=!1,Ei=!1;const et=Lt.getUniforms(),Gt=ye.uniforms;if(be.useProgram(Lt.program)&&(Hn=!0,yt=!0,Ei=!0),k.id!==M&&(M=k.id,yt=!0),Hn||v!==x){be.buffers.depth.getReversed()?(te.copy(x.projectionMatrix),xc(te),Mc(te),et.setValue(L,"projectionMatrix",te)):et.setValue(L,"projectionMatrix",x.projectionMatrix),et.setValue(L,"viewMatrix",x.matrixWorldInverse);const cn=et.map.cameraPosition;cn!==void 0&&cn.setValue(L,Se.setFromMatrixPosition(x.matrixWorld)),Be.logarithmicDepthBuffer&&et.setValue(L,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&et.setValue(L,"isOrthographic",x.isOrthographicCamera===!0),v!==x&&(v=x,yt=!0,Ei=!0)}if(D.isSkinnedMesh){et.setOptional(L,D,"bindMatrix"),et.setOptional(L,D,"bindMatrixInverse");const wt=D.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),et.setValue(L,"boneTexture",wt.boneTexture,b))}D.isBatchedMesh&&(et.setOptional(L,D,"batchingTexture"),et.setValue(L,"batchingTexture",D._matricesTexture,b),et.setOptional(L,D,"batchingIdTexture"),et.setValue(L,"batchingIdTexture",D._indirectTexture,b),et.setOptional(L,D,"batchingColorTexture"),D._colorsTexture!==null&&et.setValue(L,"batchingColorTexture",D._colorsTexture,b));const bi=z.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&Ae.update(D,z,Lt),(yt||ye.receiveShadow!==D.receiveShadow)&&(ye.receiveShadow=D.receiveShadow,et.setValue(L,"receiveShadow",D.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Gt.envMap.value=ve,Gt.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&P.environment!==null&&(Gt.envMapIntensity.value=P.environmentIntensity),yt&&(et.setValue(L,"toneMappingExposure",S.toneMappingExposure),ye.needsLights&&hl(Gt,Ei),re&&k.fog===!0&&ce.refreshFogUniforms(Gt,re),ce.refreshMaterialUniforms(Gt,k,H,ie,u.state.transmissionRenderTarget[x.id]),Ar.upload(L,xa(ye),Gt,b)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ar.upload(L,xa(ye),Gt,b),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&et.setValue(L,"center",D.center),et.setValue(L,"modelViewMatrix",D.modelViewMatrix),et.setValue(L,"normalMatrix",D.normalMatrix),et.setValue(L,"modelMatrix",D.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const wt=k.uniformsGroups;for(let cn=0,hn=wt.length;cn<hn;cn++){const ya=wt[cn];C.update(ya,Lt),C.bind(ya,Lt)}}return Lt}function hl(x,P){x.ambientLightColor.needsUpdate=P,x.lightProbe.needsUpdate=P,x.directionalLights.needsUpdate=P,x.directionalLightShadows.needsUpdate=P,x.pointLights.needsUpdate=P,x.pointLightShadows.needsUpdate=P,x.spotLights.needsUpdate=P,x.spotLightShadows.needsUpdate=P,x.rectAreaLights.needsUpdate=P,x.hemisphereLights.needsUpdate=P}function ul(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(x,P,z){Ee.get(x.texture).__webglTexture=P,Ee.get(x.depthTexture).__webglTexture=z;const k=Ee.get(x);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||Oe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,P){const z=Ee.get(x);z.__webglFramebuffer=P,z.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(x,P=0,z=0){U=x,A=P,R=z;let k=!0,D=null,re=!1,ue=!1;if(x){const ve=Ee.get(x);if(ve.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(L.FRAMEBUFFER,null),k=!1;else if(ve.__webglFramebuffer===void 0)b.setupRenderTarget(x);else if(ve.__hasExternalTextures)b.rebindTextures(x,Ee.get(x.texture).__webglTexture,Ee.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const xe=x.depthTexture;if(ve.__boundDepthTexture!==xe){if(xe!==null&&Ee.has(xe)&&(x.width!==xe.image.width||x.height!==xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(x)}}const Re=x.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(ue=!0);const Le=Ee.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Le[P])?D=Le[P][z]:D=Le[P],re=!0):x.samples>0&&b.useMultisampledRTT(x)===!1?D=Ee.get(x).__webglMultisampledFramebuffer:Array.isArray(Le)?D=Le[z]:D=Le,w.copy(x.viewport),W.copy(x.scissor),B=x.scissorTest}else w.copy(ee).multiplyScalar(H).floor(),W.copy(le).multiplyScalar(H).floor(),B=we;if(be.bindFramebuffer(L.FRAMEBUFFER,D)&&k&&be.drawBuffers(x,D),be.viewport(w),be.scissor(W),be.setScissorTest(B),re){const ve=Ee.get(x.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+P,ve.__webglTexture,z)}else if(ue){const ve=Ee.get(x.texture),Re=P||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,ve.__webglTexture,z||0,Re)}M=-1},this.readRenderTargetPixels=function(x,P,z,k,D,re,ue){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Ee.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ue!==void 0&&(_e=_e[ue]),_e){be.bindFramebuffer(L.FRAMEBUFFER,_e);try{const ve=x.texture,Re=ve.format,Le=ve.type;if(!Be.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=x.width-k&&z>=0&&z<=x.height-D&&L.readPixels(P,z,k,D,Ue.convert(Re),Ue.convert(Le),re)}finally{const ve=U!==null?Ee.get(U).__webglFramebuffer:null;be.bindFramebuffer(L.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(x,P,z,k,D,re,ue){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Ee.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ue!==void 0&&(_e=_e[ue]),_e){const ve=x.texture,Re=ve.format,Le=ve.type;if(!Be.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(P>=0&&P<=x.width-k&&z>=0&&z<=x.height-D){be.bindFramebuffer(L.FRAMEBUFFER,_e);const xe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,xe),L.bufferData(L.PIXEL_PACK_BUFFER,re.byteLength,L.STREAM_READ),L.readPixels(P,z,k,D,Ue.convert(Re),Ue.convert(Le),0);const He=U!==null?Ee.get(U).__webglFramebuffer:null;be.bindFramebuffer(L.FRAMEBUFFER,He);const je=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await vc(L,je,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,xe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,re),L.deleteBuffer(xe),L.deleteSync(je),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,P=null,z=0){x.isTexture!==!0&&(Li("WebGLRenderer: copyFramebufferToTexture function signature has changed."),P=arguments[0]||null,x=arguments[1]);const k=Math.pow(2,-z),D=Math.floor(x.image.width*k),re=Math.floor(x.image.height*k),ue=P!==null?P.x:0,_e=P!==null?P.y:0;b.setTexture2D(x,0),L.copyTexSubImage2D(L.TEXTURE_2D,z,0,0,ue,_e,D,re),be.unbindTexture()},this.copyTextureToTexture=function(x,P,z=null,k=null,D=0){x.isTexture!==!0&&(Li("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,x=arguments[1],P=arguments[2],D=arguments[3]||0,z=null);let re,ue,_e,ve,Re,Le,xe,He,je;const Qe=x.isCompressedTexture?x.mipmaps[D]:x.image;z!==null?(re=z.max.x-z.min.x,ue=z.max.y-z.min.y,_e=z.isBox3?z.max.z-z.min.z:1,ve=z.min.x,Re=z.min.y,Le=z.isBox3?z.min.z:0):(re=Qe.width,ue=Qe.height,_e=Qe.depth||1,ve=0,Re=0,Le=0),k!==null?(xe=k.x,He=k.y,je=k.z):(xe=0,He=0,je=0);const vt=Ue.convert(P.format),Ge=Ue.convert(P.type);let ye;P.isData3DTexture?(b.setTexture3D(P,0),ye=L.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(b.setTexture2DArray(P,0),ye=L.TEXTURE_2D_ARRAY):(b.setTexture2D(P,0),ye=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,P.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,P.unpackAlignment);const Yt=L.getParameter(L.UNPACK_ROW_LENGTH),We=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Lt=L.getParameter(L.UNPACK_SKIP_PIXELS),Hn=L.getParameter(L.UNPACK_SKIP_ROWS),yt=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Qe.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Qe.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ve),L.pixelStorei(L.UNPACK_SKIP_ROWS,Re),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Le);const Ei=x.isDataArrayTexture||x.isData3DTexture,et=P.isDataArrayTexture||P.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){const Gt=Ee.get(x),bi=Ee.get(P),wt=Ee.get(Gt.__renderTarget),cn=Ee.get(bi.__renderTarget);be.bindFramebuffer(L.READ_FRAMEBUFFER,wt.__webglFramebuffer),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,cn.__webglFramebuffer);for(let hn=0;hn<_e;hn++)Ei&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ee.get(x).__webglTexture,D,Le+hn),x.isDepthTexture?(et&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ee.get(P).__webglTexture,D,je+hn),L.blitFramebuffer(ve,Re,re,ue,xe,He,re,ue,L.DEPTH_BUFFER_BIT,L.NEAREST)):et?L.copyTexSubImage3D(ye,D,xe,He,je+hn,ve,Re,re,ue):L.copyTexSubImage2D(ye,D,xe,He,je+hn,ve,Re,re,ue);be.bindFramebuffer(L.READ_FRAMEBUFFER,null),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else et?x.isDataTexture||x.isData3DTexture?L.texSubImage3D(ye,D,xe,He,je,re,ue,_e,vt,Ge,Qe.data):P.isCompressedArrayTexture?L.compressedTexSubImage3D(ye,D,xe,He,je,re,ue,_e,vt,Qe.data):L.texSubImage3D(ye,D,xe,He,je,re,ue,_e,vt,Ge,Qe):x.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,D,xe,He,re,ue,vt,Ge,Qe.data):x.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,D,xe,He,Qe.width,Qe.height,vt,Qe.data):L.texSubImage2D(L.TEXTURE_2D,D,xe,He,re,ue,vt,Ge,Qe);L.pixelStorei(L.UNPACK_ROW_LENGTH,Yt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,We),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Lt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Hn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,yt),D===0&&P.generateMipmaps&&L.generateMipmap(ye),be.unbindTexture()},this.copyTextureToTexture3D=function(x,P,z=null,k=null,D=0){return x.isTexture!==!0&&(Li("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,x=arguments[2],P=arguments[3],D=arguments[4]||0),Li('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,P,z,k,D)},this.initRenderTarget=function(x){Ee.get(x).__webglFramebuffer===void 0&&b.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?b.setTextureCube(x,0):x.isData3DTexture?b.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?b.setTexture2DArray(x,0):b.setTexture2D(x,0),be.unbindTexture()},this.resetState=function(){A=0,R=0,U=null,be.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ve._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ve._getUnpackColorSpace()}}class Lp extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ht,this.environmentIntensity=1,this.environmentRotation=new Ht,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Up{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Qs,this.updateRanges=[],this.version=0,this.uuid=an()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=an()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=an()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const dt=new N;class Lr{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyMatrix4(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyNormalMatrix(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.transformDirection(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ye(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ye(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ft(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ft(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ft(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ft(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),r=Ye(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ye(t,this.array),n=Ye(n,this.array),r=Ye(r,this.array),s=Ye(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Lr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class rl extends Hi{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ii;const Ci=new N,ri=new N,si=new N,ai=new Ne,Pi=new Ne,sl=new nt,dr=new N,Di=new N,pr=new N,yo=new Ne,fs=new Ne,So=new Ne;class Ip extends Mt{constructor(e=new rl){if(super(),this.isSprite=!0,this.type="Sprite",ii===void 0){ii=new En;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Up(t,5);ii.setIndex([0,1,2,0,2,3]),ii.setAttribute("position",new Lr(n,3,0,!1)),ii.setAttribute("uv",new Lr(n,2,3,!1))}this.geometry=ii,this.material=e,this.center=new Ne(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ri.setFromMatrixScale(this.matrixWorld),sl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),si.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ri.multiplyScalar(-si.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const a=this.center;mr(dr.set(-.5,-.5,0),si,a,ri,r,s),mr(Di.set(.5,-.5,0),si,a,ri,r,s),mr(pr.set(.5,.5,0),si,a,ri,r,s),yo.set(0,0),fs.set(1,0),So.set(1,1);let o=e.ray.intersectTriangle(dr,Di,pr,!1,Ci);if(o===null&&(mr(Di.set(-.5,.5,0),si,a,ri,r,s),fs.set(0,1),o=e.ray.intersectTriangle(dr,pr,Di,!1,Ci),o===null))return;const l=e.ray.origin.distanceTo(Ci);l<e.near||l>e.far||t.push({distance:l,point:Ci.clone(),uv:Pt.getInterpolation(Ci,dr,Di,pr,yo,fs,So,new Ne),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function mr(i,e,t,n,r,s){ai.subVectors(i,t).addScalar(.5).multiply(n),r!==void 0?(Pi.x=s*ai.x-r*ai.y,Pi.y=r*ai.x+s*ai.y):Pi.copy(ai),i.copy(e),i.x+=Pi.x,i.y+=Pi.y,i.applyMatrix4(sl)}class Eo extends _t{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:na}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=na);const at={ink:0,white:1,accent:2,dark:3,leaf:4},al=[.05,.034,.09,.28],gr=8,_r=22,Un=(i,e,t=0)=>Math.hypot(i,e,t),ta=(i,e,t)=>Math.min(t,Math.max(e,i));function Np(i,e){const[t,n,r]=e.a,s=i[0]-t,a=i[1]-n,o=i[2]-r,l=e.r;if(e.ty===0){const _=Un(s/l[0],a/l[1],o/l[2]),y=Un(s/(l[0]*l[0]),a/(l[1]*l[1]),o/(l[2]*l[2]));return _*(_-1)/Math.max(y,1e-5)}if(e.ty===1){const _=e.b,y=_[0]-t,p=_[1]-n,u=_[2]-r,T=y*y+p*p+u*u,E=l[0]-l[1],S=T-E*E,I=1/T,A=s*y+a*p+o*u,R=A-T,U=s*T-y*A,M=a*T-p*A,v=o*T-u*A,w=U*U+M*M+v*v,W=A*A*T,B=R*R*T,X=Math.sign(E)*E*E*w;return Math.sign(R)*S*B>X?Math.sqrt(w+B)*I-l[1]:Math.sign(A)*S*W<X?Math.sqrt(w+W)*I-l[0]:(Math.sqrt(w*S*I)+A*E)*I-l[0]}if(e.ty===2){const _=e.b,y=Math.abs(s)-_[0]+l[0],p=Math.abs(a)-_[1]+l[0],u=Math.abs(o)-_[2]+l[0];return Un(Math.max(y,0),Math.max(p,0),Math.max(u,0))+Math.min(Math.max(y,p,u),0)-l[0]}const c=e.b,h=s*c[0]+a*c[1]+o*c[2],f=Un(s-c[0]*h,a-c[1]*h,o-c[2]*h);if(e.ty===3)return Un(f-l[0],h)-l[1];const d=Math.abs(f)-l[0]+l[2],m=Math.abs(h)-l[1]+l[2];return Math.min(Math.max(d,m),0)+Un(Math.max(d,0),Math.max(m,0))-l[2]}function Fp(i,e,t=0){let n=1e3;return i.forEach((r,s)=>{const a=Np(e,r)-t*al[r.fur??0],o=r.k??0;if(s===0){n=a;return}if(o<=0){n=Math.min(n,a);return}const l=ta(.5+.5*(a-n)/o,0,1);n=a+(n-a)*l-o*l*(1-l)}),n}function vr(i,e,t,n=6){let r=0;for(let s=0;s<96&&r<n;s++){const a=Fp(i,[e[0]+t[0]*r,e[1]+t[1]*r,e[2]+t[2]*r],1);if(a<8e-4)return r;r+=Math.max(a*.9,8e-4)}return null}const Qt=(i,e,t)=>({ty:0,a:i,r:e,k:t}),mt=(i,e,t,n,r)=>({ty:1,a:i,b:e,r:[t,n,0],k:r}),bo={pom:{parts:[Qt([0,.8,0],[.98,.86,.9])],eye:[.37,.86]},bean:{parts:[mt([0,.6,0],[0,1.34,0],.66,.55)],eye:[.27,1.16],scale:.9},drop:{parts:[Qt([0,.74,0],[.92,.8,.86]),mt([0,.98,0],[.03,1.84,0],.62,.085,.3)],eye:[.36,.8]},gumdrop:{parts:[mt([0,.5,0],[0,1.2,0],.88,.5)],eye:[.34,.8]},cub:{parts:[Qt([0,.8,0],[.96,.86,.88]),Qt([-.6,1.57,0],[.26,.26,.17],.07),Qt([.6,1.57,0],[.26,.26,.17],.07)],eye:[.36,.84]},frog:{parts:[Qt([0,.7,0],[1.06,.76,.88]),Qt([-.46,1.3,.14],[.36,.36,.34],.2),Qt([.46,1.3,.14],[.36,.36,.34],.2)],eye:[.46,1.34],onBumps:!0},tofu:{parts:[{ty:2,a:[0,.78,0],b:[.82,.82,.68],r:[.36,0,0]}],eye:[.36,.86]},kitten:{parts:[Qt([0,.8,0],[.96,.86,.88]),mt([-.52,1.36,0],[-.7,1.84,0],.27,.05,.1),mt([.52,1.36,0],[.7,1.84,0],.27,.05,.1)],eye:[.36,.84]}};function Op(i){const e=bo[i.shape]??bo.pom,t=e.parts.map(O=>({...O,fur:0})),n=tn[i.colour]??tn.lime,r=tn[i.accent??"snow"]??tn.snow,s=[...t],a=[],o=(O,$)=>3-(vr(t,[O,$,3],[0,0,-1])??3),l=(O=0,$=0)=>4-(vr(t,[O,4,$],[0,-1,0])??4),c=(O,$)=>{const ee=[Math.sin($),0,Math.cos($)];return 3-(vr(t,[ee[0]*3,O,ee[2]*3],[-ee[0],0,-ee[2]])??3)},h=l(),[f,d]=e.eye,m=e.scale??1,_=i.eyes,y=_==="round"||_==="sparkle"?[.112*m,.112*m,.075]:_==="bead"?[.064,.064,.05]:_==="googly"?[.2*m,.2*m,.13]:[.088*m,.128*m,.07],p=_==="bead"?f*1.22:f,u=O=>{if(e.onBumps){const $=t[O<0?1:2],ee=[O*.16,.1,.98],le=Un(...ee),we=vr(t,[$.a[0]+ee[0]/le*2,$.a[1]+ee[1]/le*2,$.a[2]+ee[2]/le*2],[-ee[0]/le,-.1/le,-.98/le])??2;return[$.a[0]+ee[0]/le*(2-we),$.a[1]+ee[1]/le*(2-we),$.a[2]+ee[2]/le*(2-we)]}return[O*p,d,o(O*p,d)]},T=[u(-1),u(1)],E=_==="googly"?.045:.03;if(i.glasses!=="none"&&!e.onBumps){const O=Math.max(.19*m,y[0]+.07),$=Math.max(p,O+.035),ee=d+.005;let le=0;for(let se=0;se<12;se++){const te=se/12*Math.PI*2;le=Math.max(le,o($+Math.cos(te)*O,ee+Math.sin(te)*O),o(-$+Math.cos(te)*O,ee+Math.sin(te)*O))}le+=.03;const we=i.glasses==="shades",V=we?.026:.021;for(const se of[-1,1]){a.push({ty:3,a:[se*$,ee,le],b:[0,0,1],r:[O,V,0],col:at.ink,rough:.2}),we&&a.push({ty:4,a:[se*$,ee,le],b:[0,0,1],r:[O,.014,.012],col:at.ink,rough:.06});const te=.95,ge=1.75,Se=c(ee,se*te)+.03,Pe=c(ee+.02,se*ge)+.012,Ke=[Math.sin(se*te)*Se,ee+.01,Math.cos(se*te)*Se],Fe=[Math.sin(se*ge)*Pe,ee+.02,Math.cos(se*ge)*Pe];a.push(mt([se*($+O),ee,le],Ke,.016,.015),mt(Ke,Fe,.015,.014)),a[a.length-1].col=a[a.length-2].col=at.ink,a[a.length-1].rough=a[a.length-2].rough=.2}const J=$-O*.96;a.push({...mt([-J,ee+.035,le],[J,ee+.035,le],.017,.017),col:at.ink,rough:.2})}let S=h;if(i.extra==="headphones"){let O=.3,$=h-.15;const ee=J=>h+.07-J-(c(J,Math.PI/2)+.055);for(let J=0;J<24;J++){const se=(O+$)/2;ee(se)>0?O=se:$=se}const le=(O+$)/2,we=h+.07-le,V=c(le,Math.PI/2);a.push({ty:5,a:[0,le,0],b:[1,0,0],r:[we,.034,1.62],col:at.dark,rough:.3});for(const J of[-1,1])a.push({ty:4,a:[J*(V+.075),le,0],b:[1,0,0],r:[.215,.085,.05],col:at.accent,rough:.22}),a.push({ty:4,a:[J*(V+0),le,0],b:[1,0,0],r:[.19,.05,.04],col:at.dark,rough:.5});S=h+.12}else if(i.extra==="beanie"){const O=h-.34;s.push({ty:6,a:[0,O,0],b:[0,9,0],r:[.05,0,0],k:.012,fur:1}),s.push({ty:6,a:[0,O-.03,0],b:[0,O+.13,0],r:[.1,0,0],k:.012,fur:1}),s.push({ty:0,a:[0,h+.2,0],r:[.13,.13,.13],k:.02,fur:2}),S=h+.44}else if(i.extra==="sprout")a.push({...mt([0,h-.04,0],[.01,h+.2,0],.024,.02),col:at.leaf,rough:.7}),s.push({...mt([.01,h+.2,0],[-.2,h+.36,0],.022,.075,.03),fur:1}),s.push({...mt([.01,h+.2,0],[.19,h+.4,0],.022,.085,.03),fur:1}),S=h+.56;else if(i.extra==="antenna")a.push({...mt([0,h-.04,0],[0,h+.3,0],.017,.015),col:at.dark,rough:.35}),a.push({ty:0,a:[0,h+.36,0],r:[.078,.078,.078],col:at.accent,rough:.12}),S=h+.46;else if(i.extra==="scarf"){const O=Math.max(.2,d-(e.onBumps?.86:.4));s.push({ty:6,a:[0,O-.11,0],b:[0,O+.11,0],r:[.07,0,0],k:.012,fur:1});const $=o(.3,O-.12);s.push({...mt([.3,O-.02,$+.02],[.36,O-.33,o(.36,Math.max(.05,O-.33))+.03],.075,.09,.03),fur:1})}else i.extra==="cap"?(a.push({ty:4,a:[0,h+.02,0],b:[0,1,0],r:[.3,.075,.03],col:at.dark,rough:.6}),a.push({ty:2,a:[0,h+.115,0],b:[.43,.022,.43],r:[.018,0,0],col:at.dark,rough:.6}),a.push({...mt([0,h+.145,0],[.4,h+.14,.34],.012,.012),col:at.accent,rough:.5}),a.push({...mt([.4,h+.14,.34],[.42,h-.1,.36],.012,.03),col:at.accent,rough:.5}),S=h+.2):i.extra==="tuft"&&(s.push({ty:0,a:[0,h-.02,.06],r:[.06,.06,.06],k:.05,fur:3}),S=h+.3);const I=(O,$,ee,le)=>{const we=[];return T.forEach((V,J)=>{const se=J?1:-1;if(O>.5||_==="smile"){const ge=O>1.5?-1:1,Se=Math.max(y[0],.085)*(_==="googly"?.62:.95);we.push({ty:5,a:[V[0],V[1]-ge*Se*.45,V[2]-.012],b:[ge,0,0],r:[Se,.024,1.15],col:at.ink,rough:.55});return}const te=V[2]-E;if(_==="googly"){we.push({ty:0,a:[V[0],V[1],te],r:[y[0],y[1]*Math.max($,.12),y[2]],col:at.white,rough:.12});const ge=ta(ee*2.2,-1,1)*.07-se*.012,Se=ta(le*2.6,-1,1)*.06,Pe=y[2]*Math.sqrt(Math.max(.2,1-(ge*ge+Se*Se)/(y[0]*y[0])));we.push({ty:0,a:[V[0]+ge,V[1]+Se,te+Pe-.03],r:[.105*m,.105*m*Math.max($,.12),.05],col:at.ink,rough:.08});return}we.push({ty:0,a:[V[0]+ee*.5,V[1]+le*.5,te],r:[y[0],y[1]*Math.max($,.1),y[2]],col:at.ink,rough:.08}),_==="sparkle"&&$>.6&&(we.push({ty:0,a:[V[0]+ee*.5-.036,V[1]+le*.5+.04,te+y[2]*.83],r:[.031,.031,.016],col:at.white,rough:.3}),we.push({ty:0,a:[V[0]+ee*.5+.034,V[1]+le*.5-.038,te+y[2]*.86],r:[.015,.015,.01],col:at.white,rough:.3}))}),we.concat(a)};let A=9,R=-9,U=9,M=-9,v=0;const w=(O,$)=>{if(O.ty===6)return;const ee=O.ty===1?[O.a,O.b]:[O.a],le=O.ty===0?Math.max(O.r[0],O.r[2]):O.ty===1?Math.max(O.r[0],O.r[1]):O.ty===2?Math.max(O.b[0],O.b[2]):O.r[0]+O.r[1]+.1,we=O.ty===0?O.r[0]:O.ty===2?O.b[0]:le,V=O.ty===0?O.r[2]:O.ty===2?O.b[2]:le,J=O.ty===0?O.r[1]:O.ty===2?O.b[1]:le;for(const se of ee)A=Math.min(A,se[0]-we-$),R=Math.max(R,se[0]+we+$),U=Math.min(U,se[2]-V-$),M=Math.max(M,se[2]+V+$),v=Math.max(v,se[1]+J+$)};s.forEach(O=>w(O,al[O.fur??0]+.03+(s.some($=>$.ty===6)?.11:0))),I(0,1,0,0).forEach(O=>w(O,.03)),S=Math.max(S,v-.03);const W=Math.max(R,-A),B=Math.max(M,-U),X=2.4,j=9.8,q=S*.5,ie=Math.hypot(X-q,j),H=2*Math.atan(Math.max(S*.5+.08,W*.98)*1.14/ie)*180/Math.PI;return{fur:s,solids:I,furC:[n,i.extra==="sprout"?tn.leaf:r,i.extra==="beanie"?tn.snow:r,r],solidC:["#060608","#f6f7f9",r,"#23262d","#3f9b2f","#c9ced6"],box:[-W,-.1,-B,W,S+.06,B],top:h,cam:[X,j,q*.97,H],shadow:[W*2.2,B*1.6],eyeY:d}}const Bp=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,zp=`
uniform sampler3D uNoise;
uniform vec3 uCam;          // camera, in the mascot's space (floor at y = 0, front is +z)
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform float uPix;         // units per pixel, at distance 1
uniform vec3 uKey;          // the studio: a big softbox in front and above (it casts soft shadows),
uniform vec3 uKeyCol;
uniform vec3 uFill;         // a fill from the other side,
uniform vec3 uFillCol;
uniform vec3 uBack;         // a rim light behind and above,
uniform vec3 uBackCol;
uniform vec3 uUp;           // and a white sky dome over a pale floor
uniform vec3 uSky;
uniform vec3 uGround;
uniform float uExposure;
uniform vec3 uMain;         // the palette: body colour,
uniform vec3 uAccent;       // accent (ears, leaf, headphones, beak),
uniform vec3 uBlushC;       // blush,
uniform vec3 uExtra;        // and one more (a stem)
uniform float uPeel;        // 1: the fabric has small raised dots (minky dot), like citrus peel
uniform vec4 uEye[2];       // eyes on the face plane: centre x, y, half width, half height
uniform float uEyeZ;        // glossy eyes: how far forward they sit (at x = 0)
uniform float uFaceR;       // ...and how round the face is there
uniform float uEyeMode;     // 0 open, 1 happy arcs, 2 asleep
uniform float uEyeOpen;     // blink
uniform vec4 uNose;         // stitched nose: centre, half size (0 = none)
uniform vec4 uMouth;        // stitched smile: centre, radius, thread (0 = none)
uniform vec4 uBlush[2];     // centre, radius (0 = none)
uniform vec3 uEarC[2];
uniform mat3 uEarM[2];
uniform vec3 uArmA;
uniform vec3 uArmB;
uniform float uArmOn;
uniform float uSway;
varying vec3 vPos;

struct Mat { vec3 alb; float fuzz; float ink; };   // dye colour, fuzz cover (none on thread), embroidery thread
// the fur at a point above the fabric (for a mascot with a real pile: see FUR in RENDER)
struct Fur {
  float gap;    // how far it is to the nearest fur (0 or less: inside the pile)
  float len;    // how deep the pile is here,
  float h;      // ...and how far up it this point is (0: at the fabric, 1: at the tips)
  float top;    // how far up the fibre through this point reaches (fibres differ; 0 where embroidery leaves none)
  float under;  // how much taller the pile round it stands (pile pulled down by stitches lies in a hollow, in the shade)
  vec3 n;       // which way is out
  vec3 root;    // where that fibre is rooted (fibres lean and wander, so not straight below)
  vec3 dir;     // which way it runs here
  vec3 alb;     // its colour here (tips can be paler than roots)
  float fine;   // fibres across one unit of fabric
  float gloss;  // how silky
  float ink;    // embroidery thread on the fabric below (then dir is the way the thread runs)
};

const float PI = 3.14159265;
const vec3 INK = vec3(0.012, 0.011, 0.016);
float gPix = 0.002;   // the pixel footprint where we are

vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return max(a, b) + h * h * k * 0.25; }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-5); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
float sdTorusZ(vec3 p, float R, float r) { return length(vec2(length(p.xy) - R, p.z)) - r; }
float sdCylX(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.yz), p.x)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
// two parts of plush sewn together: a smooth union that also blends their materials
void addPart(inout float d, inout Mat m, float d2, Mat m2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d) / k, 0.0, 1.0);
  d = mix(d2, d, h) - k * h * (1.0 - h);
  m.alb = mix(m2.alb, m.alb, h); m.fuzz = mix(m2.fuzz, m.fuzz, h); m.ink = mix(m2.ink, m.ink, h);
}
// a sewn seam pulls the fabric in along the line where two panels meet
float seam(float dist, float depth, float width) { return depth * exp(-(dist * dist) / (width * width)); }

// noise that stays smooth when magnified (its slope is continuous, so no grid shows) and is mip-mapped when minified;
// q is in noise cells, lod is this pixel's level for it
float snoise(vec3 q, float lod) {
  if (lod >= 1.0) return textureLod(uNoise, q / 128.0, lod).r;
  vec3 x = q + 0.5;
  vec3 i = floor(x), f = fract(x);
  float sm = textureLod(uNoise, (i + f * f * (3.0 - 2.0 * f) - 0.5) / 128.0, 0.0).r;
  if (lod <= 0.0) return sm;
  return mix(sm, textureLod(uNoise, q / 128.0, lod).r, smoothstep(0.0, 1.0, lod));
}
float fab(vec3 p, float freq, float off) { return snoise(p * freq + off, log2(max(gPix * freq, 1e-6)) + 0.5); }

// ---- the stitched face, on the front (x, y) plane
float ellipseD(vec2 p, vec2 c, vec2 r) { vec2 d = (p - c) / r; return (length(d) - 1.0) * min(r.x, r.y); }
float arcD(vec2 p, vec2 c, float R, float a0, float a1) {
  vec2 d = p - c; float a = atan(d.x, d.y);
  if (a > a0 && a < a1) return abs(length(d) - R);
  vec2 e0 = c + R * vec2(sin(a0), cos(a0)); vec2 e1 = c + R * vec2(sin(a1), cos(a1));
  return min(length(p - e0), length(p - e1));
}
float eyeD(vec2 p, vec4 e) {
  if (uEyeMode < 0.5) return ellipseD(p, e.xy, vec2(e.z, max(e.w * uEyeOpen, e.z * 0.2)));
  float t = e.z * 0.38;
  if (uEyeMode < 1.5) return arcD(p, e.xy - vec2(0.0, e.w * 0.5), e.w * 0.85, -1.0, 1.0) - t;   // happy: ^
  return arcD(vec2(p.x, 2.0 * e.y - p.y), e.xy - vec2(0.0, e.w * 0.6), e.w * 0.95, -0.95, 0.95) - t; // asleep: a soft U
}
float noseD(vec2 p) { if (uNose.z <= 0.0) return 1e3; vec2 d = abs(p - uNose.xy) - uNose.zw; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uNose.w * 0.7; }
float mouthD(vec2 p) {
  if (uMouth.w <= 0.0) return 1e3;
  return arcD(vec2(p.x, 2.0 * uMouth.y - p.y), vec2(uMouth.x, uMouth.y - uMouth.z), uMouth.z, -0.9, 0.9) - uMouth.w;
}
float faceD(vec2 p, bool stitchedEyes) {
  float d = min(noseD(p), mouthD(p));
  if (stitchedEyes || uEyeMode > 0.5) d = min(d, min(eyeD(p, uEye[0]), eyeD(p, uEye[1])));
  return d;
}
// the face, embroidered: thread where the stitches are (no fuzz on it), blush dyed into the plush
void stitchFace(vec3 p, inout Mat m, vec3 blush, bool stitchedEyes) {
  if (p.z < 0.05) return;
  vec3 a = m.alb;
  for (int i = 0; i < 2; i++)
    if (uBlush[i].w > 0.0) a = mix(a, blush, 0.5 * (1.0 - smoothstep(0.0, uBlush[i].w, distance(p, uBlush[i].xyz))));
  float fd = faceD(p.xy, stitchedEyes);
  if (fd < 0.05) fd += 0.005 * (snoise(p * 260.0, 0.0) - 0.5);   // stitched edges aren't perfectly clean
  float k = 1.0 - smoothstep(-gPix, gPix, fd);
  m.ink = max(m.ink, k);
  m.alb = mix(a, INK, k);
  m.fuzz *= 1.0 - k;
}
// glossy plastic eyes (safety eyes), set into the face; when closed they become stitched arcs instead
float eyeDomes(vec3 p) {
  if (uEyeMode > 0.5) return 1e3;
  float d = 1e3;
  for (int i = 0; i < 2; i++) {
    vec4 e = uEye[i];
    float zs = uEyeZ - (uFaceR - sqrt(max(uFaceR * uFaceR - e.x * e.x, 0.0)));
    vec3 q = p - vec3(e.xy, zs);
    q.xz = rot2(asin(clamp(e.x / uFaceR, -0.8, 0.8))) * q.xz;
    d = min(d, sdEllipsoid(q, vec3(e.z, max(e.w * uEyeOpen, e.z * 0.12), e.z * 0.72)));
  }
  return d;
}
`,kp=`
// Dr. Mochi, the scientist: a soft gumdrop in a white lab coat, with round glasses and a pen in the breast pocket.
// (The glasses, buttons and pen were placed on the surface by solving this same shape numerically.)
float bodyD(vec3 p) {
  float d = sdRoundCone(vec3(p.x, p.y, p.z / 0.9), vec3(0.0, 0.6, 0.0), vec3(0.0, 1.1, 0.0), 0.8, 0.6) * 0.9;
  return smax(d, -p.y + 0.02, 0.2);
}
const float COLLAR = 0.74, V_START = 0.34, V_SLOPE = 0.6;
const vec3 SH = vec3(0.7, 0.62, 0.12), HAND = vec3(0.8305, 0.35, 0.12);   // the sleeves at rest: shoulder and cuff
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  float d = bodyD(p);
  if (full) stitchFace(p, m, uBlushC, false);
  // the lab coat: cotton over the lower body, open in a V at the chest, its collar and lapels rolled
  float vEdge = (abs(p.x) - V_SLOPE * (p.y - V_START)) * 0.857;    // distance to the V's edge (negative inside it)
  float front = smoothstep(0.15, 0.35, p.z);
  float collarY = COLLAR + 0.12 * (1.0 - smoothstep(-0.1, 0.45, p.z));   // the collar stands up at the sides and back
  float roll = exp(-pow((p.y - collarY) / 0.035, 2.0)) + front * step(V_START, p.y) * exp(-pow(vEdge / 0.025, 2.0));
  float dc = d - 0.03 - 0.014 * roll;
  float lapelZone = front * step(V_START + 0.04, p.y);
  dc -= 0.006 * lapelZone * (1.0 - smoothstep(0.06, 0.075, vEdge)) * smoothstep(0.0, 0.01, vEdge);   // lapels: folded back,
  dc += lapelZone * seam(vEdge - 0.075, 0.004, 0.006);                                                 // two layers of cloth
  dc -= front * step(p.y, V_START) * 0.005 * exp(-pow(p.x / 0.035, 2.0));   // where the coat overlaps and buttons
  dc += front * step(p.y, V_START + 0.02) * seam(p.x + 0.035, 0.004, 0.006);
  // a breast pocket on the wearer's left: a patch, sewn on round three sides
  vec2 pk = vec2(p.x - 0.4, p.y - 0.38);
  float pd = max(abs(pk.x) - 0.1, abs(pk.y) - 0.09);
  dc -= front * (0.008 * (1.0 - smoothstep(-0.008, 0.002, pd)) - seam(pd + 0.012, 0.003, 0.004) * step(pk.y, 0.075));
  dc = smax(dc, p.y - collarY, 0.02);                               // the coat ends at the collar
  dc = smax(dc, -max(vEdge, 0.2 - p.z), 0.012);                     // and is open at the front, above the buttons
  dc = smax(dc, -p.y, 0.02);
  addPart(d, m, dc, Mat(uExtra, 0.5, 0.0), 0.006);
  // coat sleeves with orange paws peeking out; the one on the viewer's right waves
  for (int i = 0; i < 2; i++) {
    vec3 a = i == 0 ? vec3(-SH.x, SH.y, SH.z) : uArmA;
    vec3 b = i == 0 ? vec3(-HAND.x, HAND.y, HAND.z) : uArmB;
    vec3 dir = normalize(b - a);
    addPart(d, m, sdRoundCone(p, a, b, 0.12, 0.1), Mat(uExtra, 0.5, 0.0), 0.04);
    addPart(d, m, length(p - (b + dir * 0.075)) - 0.08, Mat(uMain, 1.0, 0.0), 0.02);
  }
  return d;
}
// round glasses: two rings facing along the face, a little arched bridge, and arms that run round the sides of the head
const vec3 GC = vec3(0.28, 1.1272, 0.5834), GR = vec3(0.9177, 0.0, -0.3973), GU = vec3(-0.1476, 0.9285, -0.3408), GN = vec3(0.3689, 0.3714, 0.8521);
const float FR = 0.16, FT = 0.02;
float glassesD(vec3 p) {
  vec3 a = vec3(abs(p.x), p.y, p.z);   // the glasses are symmetric
  vec3 q = a - GC;
  float d = sdTorusZ(vec3(dot(q, GR), dot(q, GU), dot(q, GN)), FR, FT);
  vec3 inner = GC - GR * FR, outer = GC + GR * FR;
  vec3 bc = vec3(0.0, inner.y + 0.005, inner.z);
  vec3 qb = a - bc;
  float arch = max(length(vec2(length(qb.xy) - 0.05, qb.z)) - 0.016, -qb.y);
  d = min(d, min(arch, sdCapsule(a, inner, bc + vec3(0.05, 0.0, 0.0), 0.016)));
  d = min(d, sdCapsule(a, outer, vec3(0.5194, 1.148, 0.3743), 0.015));
  d = min(d, sdCapsule(a, vec3(0.5194, 1.148, 0.3743), vec3(0.582, 1.148, 0.2893), 0.015));
  d = min(d, sdCapsule(a, vec3(0.582, 1.148, 0.2893), vec3(0.6238, 1.148, 0.2059), 0.015));
  return d;
}
float buttonsD(vec3 p) {
  vec3 q1 = p - vec3(0.0, 0.2376, 0.6886); q1.yz = rot2(-0.403) * q1.yz;
  vec3 q2 = p - vec3(0.0, 0.1262, 0.6261); q2.yz = rot2(-0.686) * q2.yz;
  return min(sdEllipsoid(q1, vec3(0.034, 0.034, 0.013)), sdEllipsoid(q2, vec3(0.034, 0.034, 0.013)));
}
float penD(vec3 p) {   // a pen in the pocket: only what shows above the pocket's edge
  return max(sdCapsule(p, vec3(0.408, 0.4, 0.662), vec3(0.428, 0.6, 0.67), 0.022), 0.47 - p.y);
}
float solid(vec3 p, out vec3 col, out float rough) {
  float d = eyeDomes(p);
  col = INK; rough = 0.16;
  float dg = glassesD(p);
  if (dg < d) { d = dg; col = vec3(0.016, 0.016, 0.02); rough = 0.2; }
  float db = buttonsD(p);
  if (db < d) { d = db; col = vec3(0.05, 0.055, 0.07); rough = 0.25; }
  float dp = penD(p);
  if (dp < d) { d = dp; col = p.y > 0.57 ? INK : uAccent; rough = 0.24; }
  return d;
}
float casters(vec3 p) { return min(glassesD(p), penD(p)); }   // the glasses and the pen cast soft shadows
`,Vp=`
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  vec3 q = vec3(p.x, p.y, p.z / 0.88);
  float d = smax(sdCapsule(q, vec3(0.0, 0.6, 0.0), vec3(0.0, 1.22, 0.0), 0.6) * 0.88, -p.y + 0.02, 0.16);
  d += seam(p.z + 0.02, 0.006, 0.02);
  if (full) stitchFace(p, m, uBlushC, true);
  return d;
}
// headphones: a band over the head and a cup on each side, glossy plastic
float solid(vec3 p, out vec3 col, out float rough) {
  vec3 q = p - vec3(0.0, 1.22, -0.02);
  float band = max(sdTorusZ(q, 0.69, 0.05), -q.y - 0.1);
  vec3 cq = vec3(abs(q.x) - 0.64, q.y + 0.12, q.z);
  float cup = sdCylX(cq, 0.19, 0.06) - 0.03;
  col = cup < band ? uAccent : vec3(0.014, 0.014, 0.018);
  rough = 0.22;
  return min(band, cup);
}
float casters(vec3 p) { vec3 c; float r; return solid(p, c, r); }   // the headphones shade the head
`,Hp=`
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  // a stuffed star: five soft arms blended into a plump middle, sewn from a front and a back panel
  vec3 q = p - vec3(0.0, 0.93, 0.0);
  float d = sdEllipsoid(q, vec3(0.47, 0.47, 0.35));
  for (int i = 0; i < 5; i++) {
    float a = float(i) * 1.2566371;
    vec2 dir = vec2(sin(a), cos(a));
    vec3 qa = vec3(q.x * dir.y - q.y * dir.x, dot(q.xy, dir) - 0.5, q.z);
    d = smin(d, sdEllipsoid(qa, vec3(0.26, 0.53, 0.27)), 0.22);
  }
  d += seam(q.z, 0.012, 0.026);
  d = smax(d, -p.y + 0.02, 0.1);
  if (full) stitchFace(p, m, uBlushC, false);
  return d;
}
float solid(vec3 p, out vec3 col, out float rough) { col = INK; rough = 0.16; return eyeDomes(p); }
float casters(vec3 p) { return 1e3; }
`,Gp=`
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  float body = sdEllipsoid(p - vec3(0.0, 0.64, 0.0), vec3(0.74, 0.66, 0.7));
  float top = sdRoundCone(p, vec3(0.0, 0.92, 0.0), vec3(0.1 + 0.02 * sin(uSway), 1.6, -0.06), 0.44, 0.05);   // a pointy top that leans
  float d = smax(smin(body, top, 0.3), -p.y + 0.02, 0.16);
  if (full) stitchFace(p, m, uBlushC, false);
  // little wings
  vec3 qw = vec3(abs(p.x) - 0.72, p.y - 0.6, p.z - 0.04);
  qw.xy = rot2(-0.35) * qw.xy;
  addPart(d, m, sdEllipsoid(qw, vec3(0.09, 0.23, 0.15)), Mat(uMain * 0.9, 1.0, 0.0), 0.06);
  return d;
}
// a glossy beak and glossy eyes
float solid(vec3 p, out vec3 col, out float rough) {
  float de = eyeDomes(p);
  float db = sdRoundCone(p, vec3(0.0, 0.76, 0.6), vec3(0.0, 0.72, 0.83), 0.085, 0.022);
  if (db < de) { col = uAccent; rough = 0.3; return db; }
  col = INK; rough = 0.16;
  return de;
}
float casters(vec3 p) { return 1e3; }
`,Wp=`
#define SNOW
// Rime, the snow golem: tall and slender, made of packed snow, with long arms and legs, a smooth blank face, two tiny
// dark pebbles for eyes set far apart and only a faint line pressed in for a mouth. His expression never changes; his
// head turns to watch you. The snow and the frost drifting round him are in RENDER.
uniform float uFrostT;   // the frost's clock: faster while he thinks, slower asleep, stopped with reduced motion
uniform float uFrostR;   // how far out it drifts (it puffs out when he nods)
uniform vec3 uFrostC;    // its colour (deeper on a light page, paler on a dark one)
uniform mat3 uHead;      // the head's turn, about NECK
const vec3 NECK = vec3(0.0, 2.14, 0.035), HEAD_C = vec3(0.0, 2.5, 0.06);    // he stoops a little: head forward
const vec3 SHOULDER_L = vec3(-0.215, 1.97, 0.0);
// soft lumps of packed snow (smooth, from sines: the noise texture is filtered in 8 bits, which shows as terraces)
float lumps(vec3 p) {
  vec3 q = p * 8.5;
  float a = sin(q.x + 1.3 * sin(q.y * 0.8 + 0.5)) * sin(q.y * 1.1 + 1.2 * sin(q.z * 0.9 + 2.0)) * sin(q.z * 1.05 + 1.4 * sin(q.x * 0.85 + 1.0));
  q = p * 19.0 + 1.7;
  float b = sin(q.x + 1.2 * sin(q.z * 0.9)) * sin(q.y + 1.3 * sin(q.x * 1.1)) * sin(q.z + 1.1 * sin(q.y * 0.95));
  return 0.0085 * a + 0.0038 * b;
}
// the head, in its own turned space (q from its centre): an egg, a little narrower at the top, smooth in front
float headD(vec3 q) {
  float d = sdRoundCone(vec3(q.x, q.y, q.z / 0.92), vec3(0.0, -0.08, 0.0), vec3(0.0, 0.11, -0.01), 0.215, 0.165) * 0.92;
  // barely a mouth: a faint short line pressed in
  if (q.z > 0.1) d += seam(length(vec2(max(abs(q.x) - 0.028, 0.0), q.y + 0.125)), 0.0022, 0.0045);
  return d;
}
// a long arm from shoulder a to wrist b, bending a little forward at the elbow (raised, the elbow goes out and down,
// the forearm up), ending in a long flat mitten of a hand
float armD(vec3 p, vec3 a, vec3 b, float side) {
  float raised = clamp((b.y - a.y + 0.4) / 0.8, 0.0, 1.0);
  vec3 e = (a + b) * 0.5 + vec3(side * (0.015 + 0.16 * raised), -0.12 * raised, 0.025);
  float d = smin(sdRoundCone(p, a, e, 0.064, 0.053), sdRoundCone(p, e, b, 0.053, 0.043), 0.025);
  vec3 Y = normalize(b - e), Z = normalize(vec3(0.0, 0.0, 1.0) - Y * Y.z), X = cross(Y, Z);
  vec3 v = p - (b + Y * 0.075);
  return smin(d, sdEllipsoid(vec3(dot(v, X), dot(v, Y), dot(v, Z)), vec3(0.03, 0.09, 0.047)), 0.035);
}
float snowD(vec3 p) {
  vec3 q = uHead * (p - NECK) + NECK - HEAD_C;
  float d = headD(q);
  d = smin(d, sdRoundCone(uHead * (p - NECK), vec3(0.0), vec3(0.0, 0.14, 0.02), 0.085, 0.09), 0.07);    // the neck,
  d = smin(d, sdRoundCone(p, vec3(0.0, 1.9, 0.0), NECK, 0.1, 0.085), 0.07);                             // in two halves
  // a lean body: one column of packed snow, a little wider at the chest, stooping forward at the top
  float body = sdRoundCone(p, vec3(0.0, 1.33, 0.0), vec3(0.0, 1.86, 0.025), 0.15, 0.16);
  body = smin(body, sdEllipsoid(p - vec3(0.0, 1.76, 0.02), vec3(0.17, 0.22, 0.13)), 0.1);
  // shoulders that slope down from the neck into the arms
  vec3 sp = vec3(abs(p.x), p.yz);
  body = smin(body, sdRoundCone(sp, vec3(0.0, 2.02, 0.01), vec3(-SHOULDER_L.x, SHOULDER_L.yz), 0.075, 0.066), 0.08);
  d = smin(d, body, 0.07);
  // long thin legs, a little apart and slightly bent, on small feet that point a little outward
  vec3 lp = vec3(abs(p.x), p.y, p.z);
  float leg = smin(sdRoundCone(lp, vec3(0.082, 1.36, 0.0), vec3(0.094, 0.72, 0.025), 0.08, 0.061),
                   sdRoundCone(lp, vec3(0.094, 0.72, 0.025), vec3(0.104, 0.1, 0.0), 0.061, 0.047), 0.025);
  vec3 fp = lp - vec3(0.112, 0.042, 0.05);
  fp.xz = rot2(-0.25) * fp.xz;
  leg = smin(leg, sdEllipsoid(fp, vec3(0.06, 0.046, 0.11)), 0.045);
  d = smin(d, leg, 0.07);
  // long arms: they hang past his hips; the one on the viewer's right waves
  d = smin(d, armD(p, SHOULDER_L, vec3(-0.305, 0.87, 0.05), -1.0), 0.05);
  d = smin(d, armD(p, uArmA, uArmB, 1.0), 0.05);
  // packed by hand: soft lumps everywhere but his face
  float face = smoothstep(0.2, 0.12, length(q.xy)) * smoothstep(0.05, 0.14, q.z);
  d += (1.0 - face) * lumps(p);
  return smax(d, -p.y, 0.02) * 0.8;    // (the lumps steepen the field a little)
}
float skinM(vec3 p, out Mat m, bool full) { m = Mat(uMain, 0.0, 0.0); return snowD(p); }
// two tiny dark pebbles for eyes, pressed into his face (they turn with his head)
float solid(vec3 p, out vec3 col, out float rough) {
  col = vec3(0.022, 0.024, 0.028); rough = 0.32;
  return eyeDomes(uHead * (p - NECK) + NECK - HEAD_C);
}
float casters(vec3 p) { return 1e3; }
`,Xp=`
#define FUR
// Bloom: a round, fluffy white cub with furry sky-blue ears and a tuft of the same long blue fur, modelled on a photo of the real
// plush. A camera and this shape were fitted to the photo's outline, eyes, mouth and ears, and the colours were sampled
// from it. He's the one mascot with a real pile: FUR switches RENDER to draw his fur as a volume of fibres.
const float PILE = 0.05;                         // how far the body's pile stands off its fabric
const vec3 EAR_R = vec3(0.165, 0.165, 0.05);     // an ear's fabric: a thick disc on the head, facing forward,
const float EAR_PILE = 0.075;                    // ...in the tuft's fur, cut shorter
const vec3 TUFT_C = vec3(0.0, 1.73, 0.2);        // the tuft: a small core lying across the crown,
const float TUFT_W = 0.15, TUFT_R = 0.06;        // (a capsule: half its length, and its radius)
const float TUFT_PILE = 0.3;                     // ...and long fibres all round it
const float FACE_R = 0.947;                      // the face is laid out on the body's surface: longitude x this, and height
const float EYE_TILT = 0.17;                     // the eyes lean outward at the top
const vec3 THREAD = vec3(0.061, 0.059, 0.073);    // embroidery thread: a soft black (the tone curve deepens it)
// (the noise is read in a turned frame: its cells would show as squares on a flat part that faces along an axis, as the ears do)
const mat3 TWIST = mat3(0.8, -0.6, 0.0, 0.36, 0.48, -0.8, 0.48, 0.64, 0.6);
// the body's fabric: a superellipse of revolution with a flat base (the photo's outline, less the pile), and which way
// is out (worked out with it, so the pile needs no numeric normals)
float bodyD(vec3 p, out vec3 n) {
  float rho = length(p.xz), hh = p.y - 0.694;
  float w = smoothstep(-0.45, 0.45, hh);
  float e = mix(1.98, 2.33, w), B = mix(0.804, 1.036, w);
  vec2 q = max(vec2(rho, abs(hh) / B), 1e-4);
  vec2 qn = pow(q, vec2(e));
  float r = pow(qn.x + qn.y, 1.0 / e);
  vec2 g = pow(r, 1.0 - e) * (qn / q) / vec2(1.0, B);
  float gl = max(length(g), 1e-3);
  float d = (r - 1.0) / gl + PILE, fl = 0.02 + PILE - p.y;
  float h = clamp(0.5 + 0.5 * (fl - d) / 0.313, 0.0, 1.0);
  n = normalize(mix(vec3(g.x * p.x, g.y * sign(hh) * rho, g.x * p.z) / (gl * max(rho, 1e-4)), vec3(0.0, -1.0, 0.0), h));
  return mix(d, fl, h) + 0.313 * h * (1.0 - h);
}
// the fabric (pile = 0), or the fabric with that share of its pile on it (the fur casts shadows too)
float bloomD(vec3 p, float pile) {
  vec3 n;
  float d = bodyD(p, n) - pile * PILE;
  for (int i = 0; i < 2; i++) {
    vec3 q = uEarM[i] * (p - uEarC[i]);
    d = smin(d, sdEllipsoid(q, EAR_R) - pile * EAR_PILE, 0.04);
  }
  vec3 v = p - TUFT_C;
  v.x -= clamp(v.x, -TUFT_W, TUFT_W);
  return smin(d, length(v) - TUFT_R - pile * TUFT_PILE, 0.1);
}
float skinM(vec3 p, out Mat m, bool full) { m = Mat(uMain, 0.0, 0.0); return bloomD(p, 0.0); }
float pileD(vec3 p) { return bloomD(p, 0.5); }
// the embroidery, on the face's chart: two oval eyes and a small mouth (a short bar, flat below)
vec2 eyeQ(vec2 q, int i) { return rot2(i == 0 ? -EYE_TILT : EYE_TILT) * (q - uEye[i].xy); }   // in an eye's own frame
float barD(vec2 q) {
  vec2 m = q - uNose.xy;
  return max(length(vec2(max(abs(m.x) - uNose.z + uNose.w, 0.0), m.y)) - uNose.w, -0.6 * uNose.w - m.y);
}
float eyesD(vec2 q) { return min(eyeD(uEye[0].xy + eyeQ(q, 0), uEye[0]), eyeD(uEye[1].xy + eyeQ(q, 1), uEye[1])); }
float stitchD(vec2 q) { return min(barD(q), eyesD(q)); }
// how much of a pixel a stitched shape covers, from its distance; 'wide' is how wide the shape is (one thinner than a
// pixel only ever covers that share of it, so a small view shows a faint mouth, not a heavy one)
float inked(float d, float wide) { return clamp(0.5 - d / gPix, 0.0, min(1.0, wide / gPix)); }
// the fur at p: the distance to the fabric, and the pile there
float furM(vec3 p, out Fur f) {
  vec3 n;
  float d = bodyD(p, n);
  // the body: a long white pile that lies down, combed away from the crown
  float len = PILE, lean = 2.0, stray = 0.3, curl = 0.04, grain = 17.0, body = 1.0, tufty = 0.0;
  vec3 pull = normalize(vec3(p.x, 0.0, p.z) * 0.3 - vec3(0.0, 1.0, 0.0)), alb = uMain, tip = uMain;
  f.fine = 80.0; f.gloss = 0.5;
  // the ears: blue all over, in the same fur as the tuft, cut shorter
  for (int i = 0; i < 2; i++) {
    vec3 q = uEarM[i] * (p - uEarC[i]);
    if (dot(q, q) > 0.16) continue;
    float de = sdEllipsoid(q, EAR_R);
    float w = clamp(0.5 + 0.5 * (de - d) / 0.04, 0.0, 1.0), e = 1.0 - w;
    d = mix(de, d, w) - 0.04 * w * e;
    n = mix(n, normalize(q / (EAR_R * EAR_R)) * uEarM[i], e);
    pull = mix(pull, normalize(vec3(q.xy, 0.0) + 1e-4) * uEarM[i], e);
    len = mix(len, EAR_PILE, e);
    lean = mix(lean, 0.35, e); stray = mix(stray, 0.5, e); curl = mix(curl, 0.03, e); grain = mix(grain, 46.0, e);
    alb = mix(alb, uExtra * 0.9, e);
    tip = mix(tip, mix(uExtra, vec3(1.0), 0.4), e);
    f.fine = mix(f.fine, 105.0, e); f.gloss = mix(f.gloss, 0.8, e);
    tufty = max(tufty, e);
    body *= w;
  }
  n = normalize(n);
  vec3 s = p - n * d;                                  // the fabric below this point
  float h = d / len, gap = d - len;
  // the tuft: long, fine, tangled fibres fanning out of a small core on the crown, lying over the head's own fur
  vec3 v = p - TUFT_C;
  if (dot(v, v) < 0.3) {
    vec3 axis = vec3(clamp(v.x, -TUFT_W, TUFT_W), 0.0, 0.0);
    float dt = length(v - axis) - TUFT_R;
    gap = min(gap, dt - TUFT_PILE);
    if (dt < TUFT_PILE && d >= len) {                  // (above the head's pile: the two don't mix)
      n = normalize(v - axis + vec3(0.0, 0.04, 0.0));
      s = TUFT_C + axis + n * 0.2;                     // (its fibres are told apart by their direction from the core)
      h = dt / TUFT_PILE;
      pull = normalize(vec3(v.x * 2.0 + 0.25 * sin(uSway * 0.7), -0.35, v.z * 2.0 + 0.15 * sin(uSway * 0.9 + 1.0)));
      len = TUFT_PILE; lean = 0.35; stray = 0.5; curl = 0.03; grain = 46.0;
      alb = uExtra * 0.9; tip = mix(uExtra, vec3(1.0), 0.4);
      f.fine = 105.0; f.gloss = 0.8;
      body = 0.0; tufty = 1.0;
    }
    d = smin(d, dt, 0.06);
  }
  f.n = n; f.len = len; f.h = h; f.gap = gap; f.ink = 0.0; f.top = 0.0; f.under = 0.0; f.root = s; f.dir = n; f.alb = alb;
  if (gap > 0.0 && d > max(0.01, 0.3 * gPix)) return d;   // (not in the pile: the march only needs the distances)
  // how the pile lies: locks of fibres lean together, turned a little off the way it was combed; curly pile wanders
  float lock = snoise(TWIST * s * grain + 3.0, 0.0);
  vec3 lay = pull - n * dot(pull, n);
  lay = dot(lay, lay) > 1e-5 ? normalize(lay) : normalize(cross(n, vec3(0.31, 0.2, 0.93)));
  float turn = 0.5 * stray * (sin(dot(s, vec3(11.0, 7.0, 9.0))) + sin(dot(s, vec3(-8.0, 13.0, 6.0)) + 1.7));
  vec3 side = cross(n, lay);
  lay = lay * cos(turn) + side * sin(turn);
  side = cross(n, lay);
  float hc = clamp(h, 0.0, 1.0);
  float reach = lean * len * (0.75 + 0.5 * lock);
  float wave = curl * len * sin(hc * 6.0 + lock * 37.0 + dot(s, vec3(53.0, 37.0, 41.0)));
  f.root = TWIST * (s - lay * reach * hc * (0.4 + 0.6 * hc) - side * wave * hc);
  f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc) + side * wave);
  f.top = mix(0.55 + 0.45 * lock, 0.3 + 0.3 * lock + 0.34 * snoise(s * 11.0 + 5.0, 0.0), tufty);   // (the tuft and ears are ragged: their locks differ a lot, and stop short of the longest fibres)
  // the face: embroidery (no pile on it, and the stitches pull the pile down round them) and a blush sprayed on the fur
  if (body > 0.5 && s.z > 0.3 && s.y > 0.4 && s.y < 1.1) {
    vec2 q = vec2(atan(s.x, s.z) * FACE_R, s.y);
    float press = smoothstep(0.0, 0.085, stitchD(q + vec2(0.0, 0.018)));   // (a few fibres from above lie over the edge)
    f.under = 0.8 * f.top * (1.0 - press);
    f.top *= press;
    for (int i = 0; i < 2; i++) {
      vec2 b = rot2(i == 0 ? 0.35 : -0.35) * (q - uBlush[i].xy) / (uBlush[i].w * vec2(1.0, 0.72));
      float k = exp(-0.69 * dot(b, b));
      alb = mix(alb, alb * mix(vec3(1.0), uBlushC, 0.4), k);
      tip = mix(tip, tip * mix(vec3(1.0), uBlushC, 0.85), k);
    }
    if (d < 0.03) {                                    // the thread itself, on the fabric
      float fray = 0.007 * (1.0 - smoothstep(0.5, 1.5, gPix * 300.0)) * (snoise(vec3(q * 300.0, 1.0), 0.0) - 0.5);   // stitched edges are a little ragged
      f.ink = max(inked(eyesD(q) + fray, (uEyeMode > 0.5 ? 0.76 : 2.0) * uEye[0].z), inked(barD(q) + fray, 2.0 * uNose.w));
      if (f.ink > 0.0) {
        // satin stitch: the eyes are filled in rows that zigzag, with a border sewn round the edge; the mouth is
        // sewn across. The thread runs along 'dir', and the rows show as shallow grooves.
        vec3 eu = normalize(vec3(s.z, 0.0, -s.x)), ev = cross(n, eu);
        vec2 td = vec2(0.0, 1.0);
        float groove = 1.0;
        float rows = 1.0 - smoothstep(0.35, 1.0, gPix / 0.0125);
        for (int i = 0; i < 2; i++) {
          vec2 e = eyeQ(q, i);
          float ed = ellipseD(e, vec2(0.0), uEye[i].zw);
          if (ed > 0.004) continue;
          float row = e.y / 0.0125;
          td = normalize(vec2(1.0, fract(e.x / 0.024 + 0.5 * floor(row)) < 0.5 ? 0.55 : -0.55));
          groove = 0.5 + 0.5 * cos(6.2832 * row);
          if (ed > -0.013) {                           // the border: sewn across the edge
            td = normalize(e / (uEye[i].zw * uEye[i].zw));
            groove = 0.5 + 0.5 * cos(atan(e.x, e.y) * 60.0);
          }
          td = rot2(i == 0 ? EYE_TILT : -EYE_TILT) * td;
        }
        if (abs(q.x - uNose.x) < uNose.z + 0.01 && abs(q.y - uNose.y) < uNose.w * 2.0 + 0.01) groove = 0.5 + 0.5 * cos(q.x / 0.007 * 6.2832);
        f.dir = normalize(eu * td.x + ev * td.y);
        f.alb = THREAD * mix(1.0, mix(0.45, 1.25, groove), rows);
        f.gloss = rows;
        f.top = 0.0;
        return d - 0.016 * f.ink;
      }
    }
  }
  f.alb = mix(alb, tip, smoothstep(0.55, 1.0, hc / max(f.top, 0.05)));
  return d;
}
float solid(vec3 p, out vec3 col, out float rough) { col = vec3(0.0); rough = 0.3; return 1e3; }   // (no plastic parts)
float casters(vec3 p) { return 1e3; }
`,qp=`
#define FUR
#define FUZZY
// The make-your-own mascots: a body (and a hat, a scarf) of short curly pile, with glossy eyes, glasses and other
// solid parts. This one isn't written out as a shape: its parts are lists the engine fills in (./looks.ts builds them
// from the chosen shape, eyes, glasses and extra, and places each on the body by marching this same distance field).
const int NF = 8;        // fur parts
const int NS = 22;       // solid parts
uniform int uNF;
uniform vec4 uFA[NF];    // xyz: a point (the centre, or one end); w: the part's type
uniform vec4 uFB[NF];    // xyz: a second point, a half size or an axis; w: how softly it joins what's before it
uniform vec4 uFR[NF];    // radii; w: which fur (0 body, 1 knit, 2 pom, 3 tuft)
uniform vec3 uFurC[4];   // each fur's dye
uniform int uNS;
uniform vec4 uSA[NS];
uniform vec4 uSB[NS];    // (w: which colour)
uniform vec4 uSR[NS];    // (w: roughness)
uniform vec3 uSolC[6];
const mat3 TWIST = mat3(0.8, -0.6, 0.0, 0.36, 0.48, -0.8, 0.48, 0.64, 0.6);
// one part: an ellipsoid, a round cone, a rounded box, a ring or a disc about an axis, or an arc of a ring facing forward
float partD(vec3 p, vec4 A, vec4 B, vec4 R) {
  int ty = int(A.w + 0.5);
  vec3 q = p - A.xyz;
  if (ty == 0) return sdEllipsoid(q, R.xyz);
  if (ty == 1) return sdRoundCone(p, A.xyz, B.xyz, R.x, R.y);
  if (ty == 2) { vec3 e = abs(q) - B.xyz + R.x; return length(max(e, 0.0)) + min(max(e.x, max(e.y, e.z)), 0.0) - R.x; }
  if (ty == 5) {           // (Quilez's capped torus) B.x: 1 the arc's middle is up, -1 down; R.z: half its angle
    q.y *= B.x; q.x = abs(q.x);
    vec2 sc = vec2(sin(R.z), cos(R.z));
    float k = sc.y * q.x > sc.x * q.y ? dot(q.xy, sc) : length(q.xy);
    return sqrt(max(dot(q, q) + R.x * R.x - 2.0 * R.x * k, 0.0)) - R.y;
  }
  float h = dot(q, B.xyz), rho = length(q - B.xyz * h);
  if (ty == 3) return length(vec2(rho - R.x, h)) - R.y;
  vec2 e = abs(vec2(rho, h)) - vec2(R.x, R.y) + R.z;
  return min(max(e.x, e.y), 0.0) + length(max(e, 0.0)) - R.z;
}
float pileOf(float kind) { return kind < 0.5 ? 0.05 : kind < 1.5 ? 0.034 : kind < 2.5 ? 0.09 : 0.28; }
// the fabric (with that share of each part's pile on it); and the pile's depth and its fur (rgb: dye, a: which) there
float cloth(vec3 p, float pile, out float len, out vec4 fur) {
  float d = 1e3;
  len = 0.05; fur = vec4(uFurC[0], 0.0);
  float d0 = partD(p, uFA[0], uFB[0], uFR[0]);
  for (int i = 0; i < NF; i++) {
    if (i >= uNF) break;
    float kind = uFR[i].w, li = pileOf(kind);
    float di;
    if (uFA[i].w > 5.5) {   // a layer of knit over the body itself, between two heights (a hat, a scarf): it fits any shape
      di = smax(smax(d0 - uFR[i].x, uFA[i].y - p.y, 0.035), p.y - uFB[i].y, 0.035);
    } else di = i == 0 ? d0 : partD(p, uFA[i], uFB[i], uFR[i]);
    di -= pile * li;
    vec4 fi = vec4(uFurC[int(kind + 0.5)], kind);
    if (i == 0) { d = di; len = li; fur = fi; continue; }
    float k = uFB[i].w;
    float h = k > 0.0 ? clamp(0.5 + 0.5 * (di - d) / k, 0.0, 1.0) : step(d, di);
    d = mix(di, d, h) - k * h * (1.0 - h);
    len = mix(li, len, h); fur = mix(fi, fur, h);
  }
  return d;
}
float skinM(vec3 p, out Mat m, bool full) { float l; vec4 f; m = Mat(uMain, 0.0, 0.0); return cloth(p, 0.0, l, f); }
float pileD(vec3 p) { float l; vec4 f; return cloth(p, 0.5, l, f); }
// the fur at p: a short pile of curly fibres that lie every which way, in small whorls (like the pile of a soft toy)
float furM(vec3 p, out Fur f) {
  float len; vec4 fur;
  float d = cloth(p, 0.0, len, fur);
  f.len = len; f.h = d / len; f.gap = d - len; f.ink = 0.0; f.top = 0.0; f.under = 0.0;
  f.n = vec3(0.0, 1.0, 0.0); f.root = p; f.dir = f.n; f.alb = fur.rgb; f.fine = 62.0; f.gloss = 0.3;
  if (f.gap > 0.0 && d > max(0.01, 0.3 * gPix)) return d;   // (not in the pile: the march only needs the distances)
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.004;
  float l2; vec4 f2;
  vec3 n = normalize(k.xyy * cloth(p + k.xyy * e, 0.0, l2, f2) + k.yyx * cloth(p + k.yyx * e, 0.0, l2, f2)
                   + k.yxy * cloth(p + k.yxy * e, 0.0, l2, f2) + k.xxx * cloth(p + k.xxx * e, 0.0, l2, f2));
  vec3 s = p - n * d;                                  // the fabric below this point
  float hc = clamp(f.h, 0.0, 1.0), kind = fur.a;
  vec3 t1 = normalize(cross(n, abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), t2 = cross(n, t1);
  f.n = n;
  if (kind > 2.5) {        // a tuft: long, fine fibres fanning out of a small core, drooping a little, swaying
    s = s + n * 0.14;      // (told apart by their direction from the core)
    float lock = snoise(TWIST * s * 46.0 + 3.0, 0.0);
    vec3 pull = normalize(vec3(n.x * 2.0 + 0.25 * sin(uSway * 0.7), -0.35, n.z * 2.0 + 0.15 * sin(uSway * 0.9 + 1.0)));
    vec3 lay = pull - n * dot(pull, n);
    lay = dot(lay, lay) > 1e-5 ? normalize(lay) : t1;
    float reach = 0.35 * len * (0.75 + 0.5 * lock);
    f.root = TWIST * (s - lay * reach * hc * (0.4 + 0.6 * hc));
    f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc));
    f.top = 0.3 + 0.3 * lock + 0.34 * snoise(s * 11.0 + 5.0, 0.0);
    f.fine = 105.0; f.gloss = 0.8;
    f.alb = mix(fur.rgb * 0.9, mix(fur.rgb, vec3(1.0), 0.35), smoothstep(0.55, 1.0, hc / max(f.top, 0.05)));
    return d;
  }
  // which way the pile lies: it turns from whorl to whorl, and each lock a little more
  // A short plush pile lies in small patches, each combed its own way, a few strands side by side. A patch is a cell of
  // a wobbly grid; inside it the strands are the noise stretched along the way the patch lies.
  float knit = step(0.5, kind) * step(kind, 1.5), pom = step(1.5, kind);
  float grain = mix(25.0, 31.0, knit);
  vec3 q = TWIST * s * grain;
  q += 1.5 * (vec3(snoise(q * 0.47 + 3.0, 0.0), snoise(q * 0.47 + 17.0, 0.0), snoise(q * 0.47 + 41.0, 0.0)) - 0.5);
  vec3 cell = floor(q), hsh = hash33(cell + 0.5);
  vec3 c0 = (cell + 0.5) * TWIST / grain;                    // the patch's middle (TWIST is a rotation: this undoes it)
  float ang = 6.2832 * hsh.x, lock = hsh.y;
  vec3 lay = t1 * cos(ang) + t2 * sin(ang), side = cross(n, lay);
  float along = dot(s - c0, lay);
  float reach = mix(1.25, 0.8, pom) * len * (0.75 + 0.5 * lock);
  vec3 root = s - lay * reach * hc * (0.4 + 0.6 * hc) - side * 0.0045 * sin(along * 85.0 + hsh.z * 6.2832);   // (strands bend a little)
  root -= lay * dot(root - c0, lay) * (1.0 - 1.0 / mix(6.5, 3.0, pom));   // stretched along the lay: strands, not grains
  f.root = TWIST * root;
  f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc));
  f.top = 0.82 + 0.18 * lock;                  // (a sheared pile: its fibres are all about as long)
  f.fine = mix(175.0, 190.0, knit);
  f.gloss = 0.08;
  f.alb = mix(fur.rgb, vec3(1.0), 0.02 * smoothstep(0.35, 1.0, hc / max(f.top, 0.05)));   // (the tips scatter a trace of white light; the dye stays pure)
  return d;
}
// the solid parts: glossy eyes, glasses, headphones and the like
float solid(vec3 p, out vec3 col, out float rough) {
  float d = 1e3;
  col = INK; rough = 0.2;
  for (int i = 0; i < NS; i++) {
    if (i >= uNS) break;
    float di = partD(p, uSA[i], uSB[i], uSR[i]);
    if (di < d) { d = di; col = uSolC[int(uSB[i].w + 0.5)]; rough = uSR[i].w; }
  }
  return d;
}
float casters(vec3 p) { vec3 c; float r; return solid(p, c, r); }
`,Yp=`
float skinD(vec3 p) { Mat m; return skinM(p, m, false); }
float solidD(vec3 p) { vec3 c; float r; return solid(p, c, r); }
float mapD(vec3 p) { return min(skinD(p), solidD(p)); }
#ifdef FUZZY
float shadowD(vec3 p) { return min(pileD(p), casters(p) - 0.012); }
#elif defined(FUR)
float shadowD(vec3 p) { return pileD(p); }   // (fur casts its shadow from part-way up the pile)
#else
// (thin casters like glasses frames are thickened a little here, so the shadow march can't step over them in places)
float shadowD(vec3 p) { return min(skinD(p), casters(p) - 0.012); }
#endif
vec3 skinNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(k.xyy * skinD(p + k.xyy * h) + k.yyx * skinD(p + k.yyx * h) + k.yxy * skinD(p + k.yxy * h) + k.xxx * skinD(p + k.xxx * h));
}
vec3 solidNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(k.xyy * solidD(p + k.xyy * h) + k.yyx * solidD(p + k.yyx * h) + k.yxy * solidD(p + k.yxy * h) + k.xxx * solidD(p + k.xxx * h));
}
// ambient occlusion from the distance field (Evans 2006, Quilez 2008): how much nearby surface closes over this point
float calcAO(vec3 p, vec3 n) {
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.015 + 0.17 * float(i) / 4.0;
    occ += (h - mapD(p + h * n)) * sca;
    sca *= 0.85;
  }
  return clamp(1.0 - 2.2 * occ, 0.0, 1.0);
}
// a soft shadow from the softbox (Quilez's improved penumbra); a smaller k is a bigger, softer light
float softShadow(vec3 ro, vec3 rd, float k) {
  float res = 1.0, t = 0.015, ph = 1e10;
#ifdef FUZZY
  t += 0.03 * ign(gl_FragCoord.xy);   // (a hat's brim shades a flat face: without this its penumbra shows the march's steps as rings)
#endif
  for (int i = 0; i < 32; i++) {
    float h = shadowD(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(max(h * h - y * y, 0.0));
    res = min(res, k * d / max(0.0, t - y));
    ph = h;
    t += clamp(h, 0.012, 0.2);
    if (res < 0.003 || t > 2.6) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

// ---- plush: dyed fibres underneath, a fuzz layer on top (layered as in OpenPBR: F f_fuzz + (1 - F E_fuzz) f_base)
float D_Charlie(float r, float NoH) { float a = r * r; float inv = 1.0 / a; float s2 = max(1.0 - NoH * NoH, 0.0078125); return (2.0 + inv) * pow(s2, inv * 0.5) / (2.0 * PI); }
float V_Neubelt(float NoV, float NoL) { return clamp(1.0 / (4.0 * (NoL + NoV - NoL * NoV)), 0.0, 1.0); }
float sheenIBL(float NoV, float r) {   // the fuzz lit by the whole sky (three.js's fit to Estevez & Kulla), in our units
  float r2 = r * r;
  float a = r < 0.25 ? -339.2 * r2 + 161.4 * r - 25.9 : -8.48 * r2 + 14.3 * r - 9.95;
  float b = r < 0.25 ? 44.0 * r2 - 23.7 * r + 3.26 : 1.97 * r2 - 3.27 * r + 0.72;
  return min(exp(a * NoV + b) + (r < 0.25 ? 0.0 : 0.1 * (r - 0.25)), PI);
}
float max3(vec3 v) { return max(v.r, max(v.g, v.b)); }
float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 skyIrr(vec3 N) { return mix(uGround, uSky, dot(N, uUp) * 0.5 + 0.5); }
const float FUZZ_R = 0.5;    // fuzz roughness (OpenPBR's default): a fibre-like sheen, not a dusty one

// one light: the fibres underneath catch it with a soft wrap past the terminator, the way light creeps through soft
// fabric (Green 2004), coming back a little deeper in colour there; the fuzz on top adds a sheen toward grazing angles
vec3 plushLight(vec3 L, vec3 Lc, vec3 N, vec3 V, vec3 base, vec3 deep, vec3 fuzzC, float baseW, float sh) {
  float NoL = dot(N, L);
  float wrap = clamp((NoL + 0.4) / 1.4, 0.0, 1.0);
  vec3 diff = mix(deep, base, smoothstep(-0.3, 0.5, NoL)) * wrap;
  float nl = max(NoL, 0.0);
  vec3 H = normalize(L + V);
  vec3 sheen = fuzzC * D_Charlie(FUZZ_R, max(dot(N, H), 0.0)) * V_Neubelt(max(dot(N, V), 1e-3), nl) * nl * PI;
  return Lc * (diff * baseW + sheen) * sh;
}
vec3 shadePlush(vec3 p, vec3 N, vec3 V, Mat m, float ao, float shK, float grain, float crush) {
  vec3 base = m.alb * (1.0 + 0.14 * (grain - 0.5) * (1.0 - m.ink));
  vec3 deep = max(mix(vec3(lum(base)), base, 1.3), 0.0) * 0.82;              // same hue, richer
  vec3 fuzzC = mix(base, sqrt(base), 0.45) * m.fuzz * mix(0.7, 1.3, crush);   // the fuzz: a lighter tint of the dye, in soft patches
  float baseW = 1.0 - 0.157 * max3(fuzzC);
  float NoV = max(dot(N, V), 1e-3);
  float occ = ao * mix(0.55, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * N.y));   // and the floor hides the underside
  vec3 env = skyIrr(N) * occ;
  vec3 col = base * env * baseW + fuzzC * sheenIBL(NoV, FUZZ_R) * env;
  col += plushLight(uKey, uKeyCol, N, V, base, deep, fuzzC, baseW, mix(1.0, shK, smoothstep(-0.1, 0.25, dot(N, uKey))) * mix(0.75, 1.0, occ));
  col += plushLight(uFill, uFillCol, N, V, base, deep, fuzzC, baseW, mix(0.5, 1.0, occ));
  col += plushLight(uBack, uBackCol, N, V, base, deep, fuzzC, baseW, occ);
  if (m.ink > 0.0) col += m.ink * uKeyCol * 0.14 * pow(max(dot(reflect(-V, N), uKey), 0.0), 12.0) * shK;   // the thread's satin gloss
  return col;
}
vec3 shadePlastic(vec3 n, vec3 V, vec3 base, float rough, float ao, float shK) {
  float nv = max(dot(n, V), 1e-3);
  vec3 col = base * (skyIrr(n) * ao + uKeyCol * max(dot(n, uKey), 0.0) * shK + uFillCol * max(dot(n, uFill), 0.0));
  vec3 R = reflect(-V, n);
  float fres = 0.04 + 0.96 * pow(1.0 - nv, 5.0);
  float w = mix(0.95, 0.82, rough);                 // the softbox reflects as a soft bright window
  vec3 refl = mix(uGround, uSky, dot(R, uUp) * 0.5 + 0.5) * 0.6 * ao
            + uKeyCol * 3.0 * smoothstep(w, w + 0.04, dot(R, uKey)) * shK
            + uBackCol * 1.2 * smoothstep(w, w + 0.05, dot(R, uBack))
            + uFillCol * 1.6 * smoothstep(w + 0.01, w + 0.05, dot(R, uFill));
  return col + refl * fres * mix(1.0, 0.6, rough);
}
// the fabric's texture, only where it's bigger than a pixel (so nothing shimmers): soft clumps that bend the normal a
// little, a fine grain, patches where the pile lies differently, and (some fabrics) small raised dots
void fabricTexture(vec3 p, inout vec3 N, out float grain, out float crush) {
  vec3 T1 = normalize(cross(N, abs(N.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), T2 = cross(N, T1);
  float fC = 1.0 - smoothstep(0.3, 0.9, gPix * 90.0);
  float c0 = snoise(p * 90.0 + 17.0, 0.0);
  const float e = 0.004;
  vec2 g = vec2(snoise((p + T1 * e) * 90.0 + 17.0, 0.0) - c0, snoise((p + T2 * e) * 90.0 + 17.0, 0.0) - c0) / e;
  N = normalize(N - (T1 * g.x + T2 * g.y) * 0.0016 * fC);
  float fF = 1.0 - smoothstep(0.3, 0.9, gPix * 300.0);
  grain = 0.5 + (c0 - 0.5) * 0.8 * fC + (snoise(p * 300.0 + 51.0, 0.0) - 0.5) * 0.6 * fF;
  crush = snoise(p * 3.2 + 9.0, 0.0);
  if (uPeel > 0.5) {    // citrus pores: a small soft dimple at each jittered point of a cell grid (Worley 1996)
    float fD = 1.0 - smoothstep(0.25, 0.7, gPix * 34.0);
    if (fD > 0.0) {
      vec3 q = p * 34.0, c = floor(q), bv = vec3(0.0);
      float best = 1e9;
      for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec3 cc = c + vec3(float(x), float(y), float(z));
        vec3 v = q - (cc + 0.15 + 0.7 * hash33(cc));
        float d2 = dot(v, v);
        if (d2 < best) { best = d2; bv = v; }
      }
      float r = sqrt(best) / 0.36, slope = r < 1.0 ? 6.0 * r * (1.0 - r) / 0.36 : 0.0;   // smoothstep's slope
      vec3 g = slope * bv / max(sqrt(best), 1e-4) * 34.0;                                 // the dimple's slope, outward
      N = normalize(N - (g - N * dot(g, N)) * 0.0011 * fD);
      grain -= (1.0 - smoothstep(0.0, 1.0, r)) * 0.25 * fD;                               // a little darker inside
    }
  }
}
#ifdef FUR
// ---- fur, as real as we can: a pile of fibres standing off the fabric, drawn as a volume (Kajiya & Kay 1989). Each
// fibre is a cell of the noise read at the fibre's root, so the pattern runs along the fibre however it leans; it's
// there where the noise is above a level that rises toward the tip, so fibres taper and differ in length. Rays are
// marched through the pile a fibre's width at a time and each fibre met covers part of the pixel, which gives the
// soft outline, the depth and the locks for free. Where fibres are smaller than a pixel their average is used, so
// nothing shimmers.
const float FUR_OPACITY = 1.5;                  // how much of the light a fibre's width of fibre stops
#ifdef FUZZY
const vec3 FUR_SHADE = vec3(1.0);               // (a dyed pile takes its own colour in the shade, deeper)
const vec3 FUR_FLOOR = vec3(1.0);
#else
const vec3 FUR_SHADE = vec3(0.8, 0.93, 1.0);    // the tint a pale pile takes in its own shade (the photo's: a cool blue),
const vec3 FUR_FLOOR = vec3(0.7, 0.92, 1.15);   // ...and the light that comes up off the floor (the photo's blue blanket)
#endif
// how much of the noise is above a level (its values are near enough normal: mean 0.5, deviation 0.18)
float above(float level) {
  float z = abs(level - 0.5) / 0.18, q = exp(-0.5 * z * z) / (1.64 * z + sqrt(0.76 * z * z + 4.0));
  return level > 0.5 ? q : 1.0 - q;
}
float fibres(Fur f, float h, float lod) {
  if (h >= 1.0) return 0.0;
  float hs = h / max(f.top, 1e-3);
  // locks of fibres, which end at the lock's own height; and a few single fibres that stand a little clear of them
  float level = hs < 1.0 ? 0.3 + 0.62 * hs * hs : 9.0, wisp = f.top > 0.3 ? 0.9 + 0.25 * max(h - f.top, 0.0) : 9.0;
#ifdef FUZZY
  if (f.fine > 120.0) {   // a short curly pile: strands of even thickness that end together, and no stray single fibres (a tuft has both)
    level = hs < 1.0 ? 0.47 + 0.2 * hs * hs : 9.0;
    wisp = 9.0;
  }
#endif
  float mean = 1.0 - (1.0 - above(level)) * (1.0 - above(wisp));
  if (lod >= 1.5) return mean;
  float fine = snoise(f.root * f.fine * 2.9 + 11.0, max(lod + 1.5, 0.0));
  float n = 0.5 + (0.66 * snoise(f.root * f.fine, max(lod, 0.0)) + 0.34 * fine - 0.5) * 1.3;
  return mix(max(smoothstep(level - 0.09, level + 0.09, n), smoothstep(wisp - 0.03, wisp + 0.03, fine)), mean, smoothstep(0.0, 1.5, lod));
}
// one light on a fibre under 'cover' of pile (0: a tip in the open, 1: a root). Direct light thins out with depth,
// faster when it comes in low; what the pile stops comes back scattered, deeper in colour ('again'). The fibre itself
// is lit as a thin cylinder: brightest side-on, with a silky highlight (Kajiya & Kay), and it glows when lit from
// behind (light passes through pale fibres).
vec3 furLight(vec3 L, vec3 Lc, Fur f, vec3 V, float cover, vec3 again, float sh) {
  float NoL = dot(f.n, L);
  float w = 0.45 + 0.4 * lum(f.alb), wrap = clamp((NoL + w) / (1.0 + w), 0.0, 1.0);   // (the paler the pile, the further round the light gets)
#ifdef FUZZY
  float reach = exp(-1.05 * cover / max(0.7 * NoL + 0.3, 0.1));   // (a short pile is open: more light gets down into it)
#else
  float reach = exp(-1.6 * cover / max(0.7 * NoL + 0.3, 0.1));
#endif
  float TL = dot(f.dir, L), TV = dot(f.dir, V);
  float sL = sqrt(max(1.0 - TL * TL, 0.0)), sV = sqrt(max(1.0 - TV * TV, 0.0));
  vec3 diff = f.alb * mix(again, vec3(1.0), reach) * wrap * mix(1.0, sL, 0.3);
  float spec = 0.22 * f.gloss * pow(max(sL * sV - TL * TV, 0.0), 40.0) * reach * wrap;
  float thru = 0.35 * pow(max(dot(-V, L), 0.0), 3.0) * (1.0 - cover) * (1.0 - cover);
  return Lc * (diff + spec + f.alb * thru) * sh;
}
// a fibre's colour: the key light's share comes back in 'key' (the studio's shadow falls on it afterwards, once per
// pixel), the rest is returned
vec3 shadeFur(vec3 p, Fur f, float cover, vec3 V, out vec3 key) {
#ifdef FUZZY
  vec3 again = 0.92 * pow(f.alb, vec3(0.5));   // (an open pile: the light that comes back out of it is less deep in colour)
#else
  vec3 again = 0.85 * pow(f.alb, vec3(0.75)) * FUR_SHADE;
#endif
  float occ = mix(0.55, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * f.n.y));   // the floor hides the underside
  vec3 env = mix(uGround * FUR_FLOOR, uSky, dot(f.n, uUp) * 0.5 + 0.5);
  key = furLight(uKey, uKeyCol, f, V, cover, again, mix(0.75, 1.0, occ));
  return f.alb * env * occ * mix(again, vec3(1.0), exp(-1.6 * cover))
       + furLight(uFill, uFillCol, f, V, cover, again, mix(0.5, 1.0, occ)) + furLight(uBack, uBackCol, f, V, cover, again, occ);
}
// embroidery: satin thread, glossy along its length (f.dir)
vec3 shadeThread(vec3 p, Fur f, vec3 V, out vec3 key) {
  float TH = dot(f.dir, normalize(uKey + V)), TF = dot(f.dir, normalize(uFill + V)), g = 0.035 * mix(0.5, 1.0, f.gloss);
  key = uKeyCol * max(dot(f.n, uKey), 0.0) * (f.alb + g * pow(max(1.0 - TH * TH, 0.0), 16.0));
  return f.alb * skyIrr(f.n) + uFillCol * max(dot(f.n, uFill), 0.0) * (f.alb + g * pow(max(1.0 - TF * TF, 0.0), 16.0));
}
#endif
#ifdef SNOW
// ---- snow, as real as we can: packed grains of ice, nearly white. Light goes into snow and scatters a long way before
// it comes back out, so the shadow line is soft and the light that crept round it comes back blue (ice absorbs a little
// red over a long path); thin parts glow when lit from behind (Barre-Brisebois & Bouchard 2011); shadows and creases
// fill with the cool light of the sky; and here and there a single grain flashes, mirroring the light into the eye.
const vec3 SNOW_DEEP = vec3(0.6, 0.79, 1.0);   // the colour light comes back after a long way through snow
const vec3 SNOW_SKY = vec3(0.8, 0.89, 1.0);    // the sky's light, cooler than the key
vec3 snowLight(vec3 L, vec3 Lc, vec3 N, vec3 V, vec3 base, float sh, float thin) {
  float NoL = dot(N, L), lit = max(NoL, 0.0);
  float crept = clamp((NoL + 0.45) / 1.45, 0.0, 1.0) * 0.55 - lit * 0.4;          // light that crept past the shadow line
  float through = pow(clamp(dot(V, -normalize(L + N * 0.4)), 0.0, 1.0), 4.0) * thin; // through thin snow, from behind
  float NoV = max(dot(N, V), 0.0);
  float sheen = 0.06 * pow(max(dot(N, normalize(L + V)), 0.0), 10.0) * lit          // a dull, broad sheen
              + 0.18 * pow(1.0 - NoV, 3.0) * pow(clamp(dot(-V, L), 0.0, 1.0), 2.0); // and brighter edges against the light
  return Lc * ((base * lit + sheen) * sh + base * SNOW_DEEP * (max(crept, 0.0) * sh + through * 0.7));
}
// how thin the snow is behind this point (1: thin enough for light to come through)
float thinness(vec3 p, vec3 N) { return clamp(1.0 + (skinD(p - N * 0.05) + skinD(p - N * 0.1)) / 0.15, 0.0, 1.0); }
// glints: single grains flashing like tiny mirrors. Seed points sit on a jittered 3D grid; where the surface passes
// near one there's a grain facing a random way, and it flashes when it mirrors the key light (x) or the bright sky (y)
// into the eye (after Wang & Bowles 2016). They're sparse and small, and they twinkle as he moves; where they'd be
// smaller than about a pixel, they fade out.
vec2 glints(vec3 p, vec3 N, vec3 V) {
  const float CELL = 0.04;
  float vis = 1.0 - smoothstep(0.25, 0.5, gPix / CELL);
  if (vis <= 0.0) return vec2(0.0);
  vec3 Hk = normalize(uKey + V), Hs = normalize(uUp + V);
  vec3 c0 = floor(p / CELL - 0.5);
  float r = max(0.14 * CELL, 0.75 * gPix);
  vec2 g = vec2(0.0);
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 h = hash33(c);
    if (h.x > 0.6) continue;                                     // not every cell holds a grain
    vec3 o = p - (c + 0.2 + 0.6 * hash33(c + 31.7)) * CELL;
    float spot = 1.0 - smoothstep(0.35 * r, r, length(o));
    if (spot <= 0.0) continue;
    vec3 f = normalize(N + (hash33(c + 7.3) * 2.0 - 1.0) * 0.7 + 0.06 * sin(uSway * (1.0 + 2.0 * h.y) + h.z * 6.28));
    g += spot * vec2(smoothstep(0.965, 0.99, dot(f, Hk)), smoothstep(0.985, 0.997, dot(f, Hs)));
  }
  return g * vis * min(1.0, 0.14 * CELL / r);
}
// the surface, only where it's bigger than a pixel (so nothing shimmers): shallow scoops where the snow was pressed
// together (Worley cells, 1996), then grains, then finer grains standing up, and the odd tiny hole between them
void snowTexture(vec3 p, inout vec3 N, out float grain) {
  grain = 0.5;
  for (int s = 0; s < 3; s++) {
    float F = s == 0 ? 9.0 : s == 1 ? 30.0 : 85.0;
    float fade = 1.0 - smoothstep(0.15, 0.45, gPix * F);
    if (fade <= 0.0) break;
    vec3 q = p * F + float(s) * 17.3, c0 = floor(q - 0.5), slope = vec3(0.0);
    float hgt = 0.0, hole = 0.0;
    for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
      vec3 c = c0 + vec3(float(x), float(y), float(z));
      vec3 h = hash33(c);
      vec3 v = q - (c + 0.15 + 0.7 * h);
      float r = length(v) / 0.62;
      if (r >= 1.0) continue;
      float k = 1.0 - r * r;
      hgt += k * k;
      slope += -4.0 * k * v / 0.3844;                     // the gradient of (1 - r^2)^2
      if (s > 0 && h.y < 0.06) hole = max(hole, 1.0 - smoothstep(0.1, 0.35, r));
    }
    slope -= N * dot(slope, N);
    float amp = s == 0 ? -0.03 : s == 1 ? 0.018 : 0.016;   // scoops dip in, grains stand up
    N = normalize(N - slope * amp * fade);
    grain += (s == 0 ? -0.12 : 0.32) * (min(hgt, 1.2) - 0.55) * fade - hole * 0.6 * fade;
  }
}
vec3 shadeSnow(vec3 p, vec3 N, vec3 V, Mat m, float ao, float shK, float grain, float thin, vec2 glint) {
  vec3 base = m.alb * mix(SNOW_DEEP, vec3(1.0), clamp(0.93 + 0.6 * (grain - 0.5), 0.0, 1.0));   // gaps and holes: bluer
  float occ = ao * mix(0.65, 1.0, smoothstep(-0.05, 0.4, p.y + 0.25 * N.y));   // and the floor hides the underside
  vec3 sky = skyIrr(N) * SNOW_SKY * mix(SNOW_DEEP, vec3(1.0), occ) * occ * 0.6;    // creases fill with blue
  vec3 col = base * sky;
  col += snowLight(uKey, uKeyCol, N, V, base, mix(1.0, shK, smoothstep(-0.1, 0.25, dot(N, uKey))) * mix(0.75, 1.0, occ), thin);
  col += snowLight(uFill, uFillCol * 0.5, N, V, base, mix(0.5, 1.0, occ), thin);
  col += snowLight(uBack, uBackCol, N, V, base, occ, thin);
  return col + uKeyCol * glint.x * shK * 5.0 + vec3(0.8, 0.9, 1.0) * glint.y * occ * 2.0;   // grains flashing
}
#endif
vec3 neutralTone(vec3 color) {   // Khronos PBR Neutral: faithful colour, gentle highlight roll-off
  const float startCompression = 0.8 - 0.04;
  const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < startCompression) return color;
  const float d = 1.0 - startCompression;
  float newPeak = 1.0 - d * d / (peak + d - startCompression);
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}
vec3 toSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
#ifdef SNOW
// frost: diamond dust, tiny ice crystals drifting round him, slowly falling and turning. Most of the time a crystal is a
// faint speck; when it turns to mirror the light it flashes, with a small four-point flare like a camera sees. They're
// drawn over the picture where they're in front of him and hidden where they're behind; one smaller than a pixel is
// a dot with its brightness scaled to its true size (so it doesn't swell).
vec4 frost(vec3 ro, vec3 rd, float tEnd) {
  vec3 right = normalize(cross(rd, uUp)), up = cross(right, rd);
  vec3 fc = toSRGB(uFrostC);
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 28; i++) {
    float fi = float(i);
    vec3 h = hash33(vec3(fi * 7.31, fi * 1.93 + 2.0, 5.17)), g = hash33(vec3(fi * 3.17 + 9.0, 4.41, fi * 2.71));
    float fall = fract(h.x + uFrostT * (0.012 + 0.016 * g.x));
    float ang = h.y * 6.2832 + uFrostT * (0.12 + 0.12 * g.y);
    float rad = uFrostR * (0.42 + 0.5 * h.z);
    vec3 c = vec3(sin(ang) * rad, mix(3.05, 0.1, fall) + 0.04 * sin(uFrostT * 0.9 + g.z * 6.28), cos(ang) * rad);
    float tc = dot(c - ro, rd);
    if (tc <= 0.0 || tc > tEnd) continue;
    float px = tc * uPix, size = 0.008 + 0.012 * g.z;
    float rr = max(size, 0.8 * px);
    vec3 o = ro + rd * tc - c;
    vec2 uv = vec2(dot(o, right), dot(o, up)) / rr;
    if (dot(uv, uv) > 36.0) continue;
    float flash = pow(0.5 + 0.5 * sin(uFrostT * (1.3 + 2.4 * h.z) + g.x * 6.28), 8.0);   // mostly faint, now and then bright
    float fade = smoothstep(0.0, 0.08, fall) * smoothstep(1.0, 0.9, fall);
    float k = min(1.0, (size / px) * (size / px));
    vec2 a2 = abs(uv);
    float flare = (exp(-a2.x * 1.1) * exp(-a2.y * 9.0) + exp(-a2.y * 1.1) * exp(-a2.x * 9.0)) * flash * smoothstep(0.6, 1.5, size / px);
    float core = exp(-dot(uv, uv) * 2.5) * (0.3 + 0.7 * flash);
    float a = clamp(core + flare * 0.6, 0.0, 1.0) * k * fade;
    acc.rgb += mix(fc, vec3(1.0), clamp(core * 1.5, 0.0, 1.0) * (0.4 + 0.6 * flash)) * a * (1.0 - acc.a);
    acc.a += a * (1.0 - acc.a);
  }
  return acc;
}
#endif

void main() {
  vec3 ro = uCam;
  vec3 rd = normalize(vPos - uCam);
  rd = mix(rd, vec3(1e-5), step(abs(rd), vec3(1e-5)));
  vec3 t0 = (uBoxMin - ro) / rd, t1 = (uBoxMax - ro) / rd;
  vec3 tl = min(t0, t1), th = max(t0, t1);
  float t = max(max(max(tl.x, tl.y), tl.z), 0.0), tf = min(min(th.x, th.y), th.z);
  if (t >= tf) discard;
  vec3 V = -rd;
  vec3 Cp = vec3(0.0);   // premultiplied
  float A = 0.0;
  bool hit = false;
#ifdef FUR
  // march up to the pile and then through it, a fibre's width at a time: each fibre met on the way covers part of the
  // pixel (front to back), until the pixel is covered or the fabric underneath is reached
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the fur's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
#ifdef FUZZY
  vec3 Cs = vec3(0.0);   // a solid part (a glossy eye, glasses) behind the fibres met so far,
  float As = 0.0;        // ...and how much of the pixel is left for it
#endif
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
#ifdef FUZZY
    vec3 sc; float sr;
    float sd = solid(p, sc, sr);
    if (sd < 0.3 * gPix) {
      vec3 n = solidNormal(p);
      Cs = shadePlastic(n, V, sc, sr, calcAO(p + n * 0.002, n), softShadow(p + n * 0.01, uKey, 5.0));
      As = 1.0 - A; hit = true;
      break;
    }
#endif
    Fur f;
    float d = furM(p, f);
    bool fabric = d < 0.3 * gPix;
    if (f.gap > 0.0 && !fabric) {                          // not in the pile yet (or out of it again)
      inside = false;
#ifdef FUZZY
      t += max(min(f.gap * 0.8, sd * 0.9), 0.3 * gPix);
#else
      t += max(f.gap * 0.8, 0.5 * gPix);
#endif
      if (t > tf) break;
      continue;
    }
    float ds = min(max(0.7 * gPix, min(0.3 / f.fine, 0.12 * f.len)), 0.25 * f.len);
    if (!inside && !fabric) { inside = true; t += ds * ign(gl_FragCoord.xy); continue; }   // (so the steps don't show as rings)
    float c = fabric ? 1.0 : fibres(f, f.h, log2(max(gPix, ds) * f.fine) + 0.5);
    if (c > 0.003) {
      float a = 1.0;
      if (fabric) {                                        // the fabric itself: bare only where it's embroidered
        col = shadeFur(p, f, f.top + f.under, V, key);
        if (f.ink > 0.0) { vec3 k2; col = mix(col, shadeThread(p, f, V, k2), f.ink); key = mix(key, k2, f.ink); }
      } else {
        a = 1.0 - exp(-c * ds * f.fine * FUR_OPACITY);
        if (!seen || (1.0 - A) * a > 0.02) col = shadeFur(p, f, max(f.top - f.h, 0.0) + f.under, V, key);   // (a faint fibre takes the light of the one before)
      }
      float A1 = A + (1.0 - A) * a;
      if (!seen || (A < 0.5 && A1 >= 0.5)) { seen = true; sp = p; sn = f.n; lift = max(0.55 - f.h, 0.0) * f.len; depth = d; }
      Cp += (1.0 - A) * a * col; Ck += (1.0 - A) * a * key; A = A1;
      if (fabric) { hit = true; break; }
      if (A > 0.985) break;
    }
#ifdef FUZZY
    t += min(min(ds, max(0.9 * d, 0.3 * gPix)), max(0.9 * sd, 0.3 * gPix));
#else
    t += min(ds, max(0.9 * d, 0.3 * gPix));
#endif
    if (t > tf) break;
  }
  if (seen) {    // the studio's shadow on the key light, and the creases: once per pixel, where the fur's surface is
    float sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), uKey, 3.0)), smoothstep(-0.1, 0.25, dot(sn, uKey)));   // (fur lets light through)
    float ao = calcAO(sp - sn * depth, sn);
    Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);
    if (A > 0.985) { Cp /= A; A = 1.0; }
  }
#ifdef FUZZY
  if (As > 0.0) { Cp += As * Cs; A = min(1.0, A + As); }
#endif
#else
#ifdef SNOW
  const float FUZZ = 0.003;  // (snow has a crisp edge: this is only enough to smooth it)
#else
  const float FUZZ = 0.016;  // how far the fuzz stands off the fabric
#endif
  // 1. trace to the surface, noting the first near miss of the fabric on the way: its fuzzy edge, in front
  float prevD = 1e9, prevT = t, nmD = 1e9, nmT = 0.0;
  for (int i = 0; i < 120; i++) {
    vec3 p = ro + rd * t;
    float ds = skinD(p);
    float d = min(ds, solidD(p));
    float px = t * uPix;
    if (d < 0.3 * px) { hit = true; break; }
    if (nmD > 1e8 && ds > prevD && prevD < FUZZ + 1.5 * px) { nmD = prevD; nmT = prevT; }
    prevD = ds; prevT = t;
    t += max(d * 0.9, 0.3 * px);
    if (t > tf) break;
  }
  if (hit) {
    vec3 p = ro + rd * t;
    gPix = t * uPix;
    vec3 sc; float sr;
    if (solid(p, sc, sr) < skinD(p)) {
      vec3 n = solidNormal(p);
      float ao = calcAO(p + n * 0.002, n), sh = softShadow(p + n * 0.01, uKey, 5.0);
      Cp = shadePlastic(n, V, sc, sr, ao, sh);
    } else {
      Mat m;
      skinM(p, m, true);
      vec3 N = skinNormal(p);
      float ao = calcAO(p, N);
      float sh = softShadow(p + N * 0.012, uKey, 5.0);
      vec3 N0 = N;
#ifdef SNOW
      float grain;
      snowTexture(p, N, grain);
      N = normalize(mix(N, N0, m.ink));
      Cp = shadeSnow(p, N, V, m, ao, sh, grain, thinness(p, N0), glints(p, N, V));
#else
      float grain, crush;
      fabricTexture(p, N, grain, crush);
      N = normalize(mix(N, N0, m.ink));   // embroidery thread is smooth satin: no fabric texture under it
      Cp = shadePlush(p, N, V, m, ao, sh, grain, crush);
#endif
    }
    A = 1.0;
  }
  if (nmD < 1e8) {        // the fuzz: fibres standing off the fabric, growing from the surface below the near miss
    vec3 q = ro + rd * nmT;
    gPix = nmT * uPix;
    vec3 N = skinNormal(q);
    Mat m;
    skinM(q, m, true);
    float x = nmD / (FUZZ + 1.5 * gPix);
    vec3 s = q - N * nmD;
    float detail = smoothstep(0.8, 2.5, FUZZ / gPix);
#ifdef SNOW
    float strands = 0.5;   // (a clean edge, no fibres)
    vec3 hc = shadeSnow(q, N, V, m, 0.95, 1.0, 0.5, 0.5, vec2(0.0));
#else
    float strands = snoise(s * 420.0 + 7.0, 0.0);
    vec3 hc = shadePlush(q, N, V, m, 0.95, 1.0, 0.5, 0.5);
#endif
    float cov = (1.0 - smoothstep(0.0, 1.0, x + (strands - 0.5) * 0.9 * x * detail)) * mix(1.0, 0.0, m.ink);
    Cp = hc * cov + Cp * (1.0 - cov);
    A = cov + A * (1.0 - cov);
  }
#endif
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
#ifdef SNOW
  vec4 fr = frost(ro, rd, hit ? t : tf);   // the frost, over him where it's in front
  o = fr + o * (1.0 - fr.a);
#endif
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`,Zp={bloom:{glsl:Xp,box:[-1.15,-.1,-1.08,1.15,2.22,1.08],cam:[2.48,9.9,1.08,17],top:1.73,shadow:[2.6,1.6],eye:{x:.321,y:.785,rx:.062,ry:.088},eyeZ:0,faceR:1,nose:[0,.711,.055,.014],mouth:[0,0,0,0],blush:[.481,.62,0,.1],ears:{base:[.605,1.34,.339],off:[0,.14],yaw:0,lean:.8},rest:0,prop:"#68c7ea",exposure:1.1,colors:{main:"#eff2fa",accent:"#99d7f0",blush:"#b0f1fc",extra:"#84d1f0"}},mochi:{glsl:kp,box:[-1,-.1,-.92,1,1.92,.95],cam:[2.2,9.6,.9,17],top:1.72,shadow:[2.1,1.5],eye:{x:.28,y:1.12,rx:.068,ry:.086},eyeZ:.5813,faceR:.711,nose:[0,0,0,0],mouth:[0,.885,.062,.011],blush:[.44,.9,.538,.12],rest:0,prop:"#14b8a6",bubbles:!0,exposure:1.13,arm:{shoulder:[.7,.62,.12],len:.3,rest:Math.PI+.45,hide:!1},colors:{main:"#fb923c",accent:"#14b8a6",blush:"#ea580c",extra:"#f8fafc"}},bop:{glsl:Vp,box:[-.98,-.1,-.86,.98,2.1,.86],cam:[2.3,9.6,.98,17],top:1.82,shadow:[1.9,1.3],eye:{x:.22,y:1.12,rx:.06,ry:.07},eyeZ:0,faceR:.6,nose:[0,0,0,0],mouth:[0,.94,.07,.01],blush:[.36,.98,.42,.12],rest:1,prop:"#3d82dc",exposure:1.12,colors:{main:"#3d82dc",accent:"#fbbf24",blush:"#7eb0ee",extra:"#3d82dc"}},twinkle:{glsl:Hp,box:[-1.14,-.1,-.64,1.14,2.04,.64],cam:[2.2,9.6,.92,17],top:1.82,shadow:[2,1.1],eye:{x:.21,y:1,rx:.065,ry:.082},eyeZ:.44,faceR:5,nose:[0,0,0,0],mouth:[0,.83,.07,.011],blush:[.39,.86,.36,.13],rest:0,prop:"#f59e0b",exposure:1.13,colors:{main:"#facc15",accent:"#f59e0b",blush:"#fb923c",extra:"#facc15"}},pip:{glsl:Gp,box:[-.98,-.1,-.86,.98,1.88,1],cam:[2.1,9.4,.86,17],top:1.6,shadow:[1.9,1.4],eye:{x:.22,y:.96,rx:.07,ry:.088},eyeZ:.67,faceR:.7,nose:[0,0,0,0],mouth:[0,0,0,0],blush:[.42,.74,.58,.12],rest:0,prop:"#84cc16",exposure:1,colors:{main:"#a3e635",accent:"#f97316",blush:"#facc15",extra:"#a3e635"}},rime:{glsl:Wp,box:[-1.15,-.1,-1.15,1.15,3.25,1.15],cam:[2.2,10.5,1.5,19.5],portrait:[2.75,10.5,2.42,7.5],top:2.9,shadow:[.95,.6],eye:{x:.105,y:.02,rx:.019,ry:.019},eyeZ:.178,faceR:.21,nose:[0,0,0,0],mouth:[0,0,0,0],blush:[0,0,0,0],rest:0,prop:"#7eb0ee",exposure:1.1,stoic:!0,frost:!0,props:!1,head:!0,motion:{breathe:.25,hop:0,squash:.15,tilt:.5},arm:{shoulder:[.215,1.97,0],len:1.105,rest:Math.PI+.082,hide:!1,raise:-.85,fwd:.12},colors:{main:"#f6f9fc",accent:"#7eb0ee",blush:"#7eb0ee",extra:"#7eb0ee"}}};function Kp(i,e){const t=tn[e.colour]??tn.lime,n=e.colour==="snow";return{glsl:qp,box:i.box,cam:i.cam,top:i.top,shadow:i.shadow,eye:{x:0,y:i.eyeY,rx:0,ry:0},eyeZ:0,faceR:1,nose:[0,0,0,0],mouth:[0,0,0,0],blush:[0,0,0,0],rest:0,prop:n?tn.ice:t,exposure:1.06,colors:{main:t,accent:t,blush:t,extra:t}}}const Rt=i=>new Xe(i),ds=i=>i<=0?0:i>=1?1:i*i*(3-2*i),To=()=>{var i;return!!((i=window.matchMedia)!=null&&i.call(window,"(prefers-reduced-motion: reduce)").matches)},$p=()=>document.documentElement.classList.contains("dark");let _n=null,xr=0,Ii=0,ps=null;function ol(i,e){return _n||(_n=new Dp({alpha:!0,premultipliedAlpha:!0,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"}),_n.setPixelRatio(1),_n.setClearColor(0,0),_n.autoClear=!1),(i>xr||e>Ii)&&(xr=Math.max(i,xr),Ii=Math.max(e,Ii),_n.setSize(xr,Ii,!1)),_n}function jp(){if(ps)return ps;const i=128,e=new Uint8Array(i*i*i);let t=49723857;for(let r=0;r<e.length;r++)t^=t<<13,t^=t>>>17,t^=t<<5,e[r]=t&255;const n=new Go(e,i,i,i);return n.format=aa,n.type=Xt,n.minFilter=xn,n.magFilter=Ot,n.wrapS=n.wrapT=n.wrapR=Cr,n.generateMipmaps=!0,n.unpackAlignment=1,n.needsUpdate=!0,ps=n}function em(){if(!_n&&!document.createElement("canvas").getContext("webgl2"))throw new Error("WebGL 2 is not available");ol(1,1)}const zi=new Set,fi={x:0,y:0,seen:!1};let Ur=0,Mr=0,yr=0,Rr=1,wo=!1;function Jp(){wo||(wo=!0,window.addEventListener("pointermove",i=>{fi.x=i.clientX,fi.y=i.clientY,fi.seen=!0},{passive:!0}),document.addEventListener("visibilitychange",In),new MutationObserver(()=>zi.forEach(i=>i.applyTheme())).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}))}function In(){!Ur&&!document.hidden&&(Ur=requestAnimationFrame(ll))}function ll(i){if(Ur=0,document.hidden)return;const e=Mr?i-Mr:16;Mr=i,e>25&&e<200?++yr>30&&Rr>.6&&(Rr=Math.max(.6,Rr-.2),yr=0,zi.forEach(n=>n.resize())):yr=Math.max(0,yr-1);let t=!1;for(const n of zi)n.frame(i)&&(t=!0);t?Ur=requestAnimationFrame(ll):Mr=0}class tm{constructor(e,t){this.host=e,this.built=null,this.scene=new Lp,this.geos=[],this.disposables=[],this.root=new li,this.squash=new li,this.w=1,this.h=1,this.onScreen=!0,this.last=0,this.dirty=!0,this.st={pose:"idle",poseT:0,t:Math.random()*10,blinkIn:1.6+Math.random()*2,blinkT:-1,look:new Ne,lookV:new Ne,poke:-1,tilt:0,tiltV:0,flake:0,zz:0,bub:0,frost:Math.random()*40,bow:0,roll:0},this.earM=new nt,this.earE=new Ht,this.v3=new N,this.headM=new nt,this.headE=new Ht,this.q=new Vn,this.qi=new Vn,this.KEY=new N(-.42,.78,.5).normalize(),this.FILL=new N(.85,.15,.5).normalize(),this.BACK=new N(.25,.6,-.76).normalize(),this.poke=()=>{this.st.poke=0,this.dirty=!0,In()},t.kind==="fuzzy"&&(this.built=Op(t.look??{shape:"pom",colour:"lime",eyes:"bean",glasses:"none",extra:"none"}));const n=this.K=this.built?Kp(this.built,t.look):Zp[t.kind];this.fps=t.fps??30,this.follow=t.follow??!0,this.canvas=document.createElement("canvas"),this.canvas.style.cssText="display:block;width:100%;height:100%";const r=this.canvas.getContext("2d");if(!r)throw new Error("no 2D canvas");this.ctx=r;const[s,a,o,l]=t.portrait&&n.portrait||n.cam;this.fov=l/(t.zoom??1),this.camera=new Ct(this.fov,1,.1,60),this.camera.position.set(0,s,a),this.camera.lookAt(0,o,0);const c=E=>new tt(E[0],E[1],E[2],E[3]),h=new N(n.box[0],n.box[1],n.box[2]),f=new N(n.box[3],n.box[4],n.box[5]);if(this.uniforms={uNoise:{value:jp()},uCam:{value:new N},uBoxMin:{value:h},uBoxMax:{value:f},uPix:{value:.001},uKey:{value:this.KEY.clone()},uKeyCol:{value:Rt("#fff7ee")},uFill:{value:this.FILL.clone()},uFillCol:{value:Rt("#f3f6ff").multiplyScalar(.32)},uBack:{value:this.BACK.clone()},uBackCol:{value:Rt("#ffffff").multiplyScalar(.58)},uUp:{value:new N(0,1,0)},uSky:{value:Rt("#ffffff").multiplyScalar(.42)},uGround:{value:Rt("#f1f3f7").multiplyScalar(.24)},uExposure:{value:n.exposure},uMain:{value:Rt(n.colors.main)},uAccent:{value:Rt(n.colors.accent)},uBlushC:{value:Rt(n.colors.blush)},uExtra:{value:Rt(n.colors.extra)},uPeel:{value:0},uEye:{value:[new tt,new tt]},uEyeZ:{value:n.eyeZ},uFaceR:{value:n.faceR},uEyeMode:{value:n.rest},uEyeOpen:{value:1},uNose:{value:c(n.nose)},uMouth:{value:c(n.mouth)},uBlush:{value:[c([-n.blush[0],n.blush[1],n.blush[2],n.blush[3]]),c(n.blush)]},uEarC:{value:[new N,new N]},uEarM:{value:[new Ce,new Ce]},uArmA:{value:new N},uArmB:{value:new N},uArmOn:{value:0},uSway:{value:0},uFrostT:{value:0},uFrostR:{value:1},uFrostC:{value:Rt("#3d82dc")},uHead:{value:new Ce}},this.built){const E=this.built,S=I=>Array.from({length:I},()=>new tt);Object.assign(this.uniforms,{uNF:{value:E.fur.length},uFA:{value:S(gr)},uFB:{value:S(gr)},uFR:{value:S(gr)},uFurC:{value:E.furC.map(Rt)},uNS:{value:0},uSA:{value:S(_r)},uSB:{value:S(_r)},uSR:{value:S(_r)},uSolC:{value:E.solidC.map(Rt)}}),E.fur.slice(0,gr).forEach((I,A)=>{var R,U,M;this.uniforms.uFA.value[A].set(I.a[0],I.a[1],I.a[2],I.ty),this.uniforms.uFB.value[A].set(((R=I.b)==null?void 0:R[0])??0,((U=I.b)==null?void 0:U[1])??0,((M=I.b)==null?void 0:M[2])??0,I.k??0),this.uniforms.uFR.value[A].set(I.r[0],I.r[1],I.r[2],I.fur??0)}),this.setSolids(E.solids(0,1,0,0))}const d=new yi(f.x-h.x,f.y-h.y,f.z-h.z);d.translate((f.x+h.x)/2,(f.y+h.y)/2,(f.z+h.z)/2),this.geos.push(d),this.mat=new ln({vertexShader:Bp,fragmentShader:zp+n.glsl+Yp,uniforms:this.uniforms,transparent:!0,depthWrite:!1,premultipliedAlpha:!0}),this.body=new zt(d,this.mat),this.body.frustumCulled=!1,this.root.add(this.squash),this.squash.add(this.body),this.scene.add(this.root);const m=document.createElement("canvas");m.width=m.height=128;const _=m.getContext("2d"),y=_.createRadialGradient(64,64,0,64,64,64);y.addColorStop(0,"rgba(30,40,60,0.4)"),y.addColorStop(.5,"rgba(30,40,60,0.14)"),y.addColorStop(1,"rgba(30,40,60,0)"),_.fillStyle=y,_.fillRect(0,0,128,128);const p=new Eo(m),u=new Gi(n.shadow[0],n.shadow[1]);this.shadow=new zt(u,new fa({map:p,transparent:!0,depthWrite:!1})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.002,.04),this.shadow.renderOrder=-1,this.scene.add(this.shadow),this.disposables.push(p,u,this.shadow.material);const T=E=>{const S=document.createElement("canvas");S.width=S.height=128,E(S.getContext("2d"));const I=new Eo(S);I.colorSpace=bt;const A=new rl({map:I,transparent:!0,depthWrite:!1,depthTest:!1,opacity:0}),R=new Ip(A);return R.renderOrder=10,R.visible=!1,this.scene.add(R),this.disposables.push(I,A),R};this.flake=T(E=>{E.translate(64,64),E.fillStyle=n.prop,E.beginPath();for(let S=0;S<4;S++)E.quadraticCurveTo(0,0,0,-56),E.quadraticCurveTo(0,0,56,0),E.rotate(Math.PI/2);E.fill()}),this.bubbles=n.bubbles?[0,1,2].map(()=>T(E=>{E.beginPath(),E.arc(64,64,50,0,Math.PI*2),E.fillStyle=n.prop+"40",E.fill(),E.lineWidth=9,E.strokeStyle=n.prop,E.stroke(),E.beginPath(),E.arc(46,46,11,0,Math.PI*2),E.fillStyle="#ffffffcc",E.fill()})):[],this.zs=[0,1].map(()=>T(E=>{E.fillStyle=n.prop,E.font="800 108px ui-sans-serif, system-ui, sans-serif",E.textAlign="center",E.textBaseline="middle",E.fillText("z",64,60)})),this.canvas.addEventListener("pointerdown",this.poke),e.appendChild(this.canvas),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.io=new IntersectionObserver(([E])=>{this.onScreen=E.isIntersecting,this.dirty=!0,In()}),this.io.observe(e),Jp(),this.applyTheme(),this.resize(),t.pose&&this.setPose(t.pose),this.update(0),zi.add(this),In()}setSolids(e){var r,s,a;const t=this.uniforms,n=Math.min(e.length,_r);for(let o=0;o<n;o++){const l=e[o];t.uSA.value[o].set(l.a[0],l.a[1],l.a[2],l.ty),t.uSB.value[o].set(((r=l.b)==null?void 0:r[0])??0,((s=l.b)==null?void 0:s[1])??0,((a=l.b)==null?void 0:a[2])??0,l.col??0),t.uSR.value[o].set(l.r[0],l.r[1],l.r[2],l.rough??.2)}t.uNS.value=n}setPose(e){const t=this.st;e!==t.pose&&(e==="idle"&&(t.pose==="wave"||t.pose==="happy")||(t.pose=e,t.poseT=0,this.dirty=!0,In()))}applyTheme(){const e=$p();this.uniforms.uBackCol.value.set("#ffffff").multiplyScalar(e?.85:.58),this.shadow.material.color.set(e?"#000000":"#ffffff"),this.uniforms.uFrostC.value.set(e?"#cfe1f8":"#3d82dc"),this.dirty=!0,In()}resize(){const e=this.host.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,2)*Rr;this.w=Math.max(1,Math.round(e.width*t)),this.h=Math.max(1,Math.round(e.height*t)),this.canvas.width=this.w,this.canvas.height=this.h,this.camera.aspect=this.w/this.h,this.camera.updateProjectionMatrix(),this.uniforms.uPix.value=2*Math.tan(gc.degToRad(this.fov/2))/this.h,this.dirty=!0,In()}frame(e){if(!this.onScreen||this.w<2)return!1;if(To())return this.dirty&&(this.update(0),this.draw(),this.dirty=!1),!1;if(this.last&&e-this.last<1e3/this.fps-2)return!0;const t=this.last?Math.min(.05,Math.max(0,e-this.last)/1e3):1/this.fps;return this.last=e,this.update(t),this.draw(),!0}draw(){const e=ol(this.w,this.h);e.setViewport(0,0,this.w,this.h),e.setScissor(0,0,this.w,this.h),e.setScissorTest(!0),e.clear(),e.render(this.scene,this.camera),this.ctx.clearRect(0,0,this.w,this.h),this.ctx.drawImage(e.domElement,0,Ii-this.h,this.w,this.h,0,0,this.w,this.h)}setEar(e,t,n,r){this.earE.set(0,n*e.yaw,-n*(e.lean+r),"YXZ"),this.earM.makeRotationFromEuler(this.earE),this.v3.set(n*e.off[0],e.off[1],0).applyMatrix4(this.earM),this.v3.x+=n*e.base[0],this.v3.y+=e.base[1],this.v3.z+=e.base[2],this.uniforms.uEarC.value[t].copy(this.v3),this.uniforms.uEarM.value[t].setFromMatrix4(this.earM).transpose()}update(e){const t=this.st,n=this.K,r=this.uniforms,s=To(),a={breathe:1,hop:1,squash:1,tilt:1,...n.motion};t.t+=e,t.poseT+=e;const o=t.t,l=t.pose,c=t.poseT,h=(M,v,w,W,B)=>{const X=(w-M)*W-v*B;return v+=X*e,[M+v*e,v]},f=new Ne;if(l==="think")f.set(-.5,.6);else if(l==="sleep")f.set(0,-.3);else if(this.follow&&fi.seen){const M=this.host.getBoundingClientRect();f.set(Math.max(-1,Math.min(1,(fi.x-(M.left+M.width/2))/(window.innerWidth*.45))),Math.max(-1,Math.min(1,(M.top+M.height*.45-fi.y)/(window.innerHeight*.45))))}else f.set(Math.sin(o*.31)*.15,Math.sin(o*.23)*.08);if(e===0)t.look.copy(f);else{const[M,v]=n.stoic?[16,7]:[38,10];[t.look.x,t.lookV.x]=h(t.look.x,t.lookV.x,f.x,M,v),[t.look.y,t.lookV.y]=h(t.look.y,t.lookV.y,f.y,M,v)}this.root.rotation.y=t.look.x*.5*(n.head?.25:1),this.root.rotation.x=-t.look.y*.16*(n.head?.15:1);let d=l==="think"?.07+Math.sin(o*1.4)*.035:l==="wave"&&c<1.7||l==="sleep"?.05:0;l==="wave"&&!n.arm&&c<1.6&&(d=.13*Math.sin(c*9)*(1-ds(c/1.6))),e===0?t.tilt=d:[t.tilt,t.tiltV]=h(t.tilt,t.tiltV,d,30,8),this.root.rotation.z=t.tilt*a.tilt;const m=(s?0:l==="sleep"?.02*Math.sin(o*1.25):.012*Math.sin(o*1.9))*a.breathe;let _=0,y=0;if(l==="happy"&&!s){const M=c/.9;if(M<1)if(M<.15)y=-.12*Math.sin(M/.15*Math.PI);else if(M<.7){const v=(M-.15)/.55;_=.28*Math.sin(v*Math.PI),y=.06*Math.sin(v*Math.PI)}else y=-.1*Math.sin((M-.7)/.3*Math.PI)}t.poke>=0&&(t.poke+=e,t.poke<.5?y+=-.14*Math.sin(Math.min(1,t.poke/.5)*Math.PI)*Math.exp(-t.poke*3):t.poke=-1),_*=a.hop,y*=a.squash,this.root.position.y=_;const p=1+m+y;this.squash.scale.set(1/Math.sqrt(p),p,1/Math.sqrt(p)),this.shadow.scale.setScalar(1-_*.7),this.shadow.material.opacity=1-_*1.2;let u=n.rest,T=1;if(!n.stoic){if(l==="wave"||l==="happy")u=1;else if(l==="sleep")u=2;else if(u===0&&!s&&(t.blinkIn-=e,t.blinkIn<=0&&t.blinkT<0&&(t.blinkT=0,t.blinkIn=Math.random()<.18?.28:2.4+Math.random()*3.2),t.blinkT>=0)){t.blinkT+=e;const M=t.blinkT/.15;T=M<1?Math.abs(1-2*M):1,M>=1&&(t.blinkT=-1)}}(l==="wave"&&c>1.9||l==="happy"&&c>1.4||s&&(l==="wave"||l==="happy"))&&(t.pose="idle",t.poseT=0);const E=n.eye,S=n.stoic?0:t.look.x*.04,I=n.stoic?0:t.look.y*.03;r.uEye.value[0].set(-E.x+S,E.y+I,E.rx,E.ry),r.uEye.value[1].set(E.x+S,E.y+I,E.rx,E.ry),r.uEyeMode.value=u,r.uEyeOpen.value=Math.max(.05,T),this.built&&this.setSolids(this.built.solids(u,T,S,I)),r.uSway.value=s?0:o*1.4;const A=n.ears;if(A&&[-1,1].forEach((M,v)=>{const w=Math.max(0,Math.sin(o*.9+M*1.7)-.92)*4;this.setEar(A,v,M,w*.2+(l==="wave"?.06*Math.sin(c*9):0)+(l==="sleep"?-.1:0))}),n.arm){let M=0,v=n.arm.raise??-.38;l==="wave"&&(M=ds(c/.4)*(1-ds((c-1.45)/.4)),v+=(n.stoic?.16*Math.sin((c-.4)*6):.26*Math.sin((c-.4)*11))*(c>.4&&c<1.45?1:0)),r.uArmOn.value=!n.arm.hide||M>.01?1:0;const w=n.arm.rest+(v+Math.PI*2-n.arm.rest)*M,[W,B,X]=n.arm.shoulder,j=n.arm.len;r.uArmA.value.set(W,B,X),r.uArmB.value.set(W-Math.sin(w)*j,B+Math.cos(w)*j,X+(n.arm.fwd??.04)*M)}if(n.head){const M=e===0?1:1-Math.exp(-e*3);t.bow+=((l==="sleep"?.38:0)-t.bow)*M,t.roll+=((l==="think"?.13:0)-t.roll)*M;const v=l==="happy"&&!s?.3*Math.sin(Math.PI*Math.min(1,c/1.1)):0;this.headE.set(-t.look.y*.4+v+t.bow,t.look.x*.65,t.roll,"YXZ"),this.headM.makeRotationFromEuler(this.headE),r.uHead.value.setFromMatrix4(this.headM).transpose()}n.frost&&(t.frost+=s?0:e*(l==="think"?2.6:l==="sleep"?.35:1),r.uFrostT.value=t.frost,r.uFrostR.value=1+(l==="happy"&&!s?.2*Math.sin(Math.PI*Math.min(1,c/1.2)):0));const R=n.top,U=n.box[3];t.flake+=((l==="think"?1:0)-t.flake)*(e===0?1:1-Math.exp(-e*6)),this.flake.visible=t.flake>.01&&!n.bubbles&&n.props!==!1,this.flake.material.opacity=t.flake,this.flake.material.rotation=s?0:Math.sin(o*2)*.25,this.flake.scale.setScalar(.3*(.5+.5*t.flake)),this.flake.position.set(U*.82,R+.42+(s?0:Math.sin(o*1.6)*.04),.3),t.bub+=((l==="think"?1:0)-t.bub)*(e===0?1:1-Math.exp(-e*5)),this.bubbles.forEach((M,v)=>{const w=s?.3+v*.25:(o*.45+v/3)%1;M.visible=t.bub>.01,M.position.set(U*.62+Math.sin(w*7+v*2)*.06,R*.88+w*.62,.3),M.material.opacity=t.bub*Math.sin(Math.PI*Math.min(1,w*1.2)),M.scale.setScalar(.09+.1*w+.02*v)}),t.zz+=((l==="sleep"?1:0)-t.zz)*(e===0?1:1-Math.exp(-e*4)),this.zs.forEach((M,v)=>{const w=s?.5+v*.25:(o*.42+v*.5)%1;M.visible=t.zz>.01&&n.props!==!1,M.position.set(U*.62+w*.32,R*.95+w*.5,.3),M.material.opacity=t.zz*Math.sin(Math.PI*w),M.scale.setScalar((.15+.12*w)*(v?.85:1))}),this.body.updateWorldMatrix(!0,!1),r.uCam.value.copy(this.camera.position),this.body.worldToLocal(r.uCam.value),this.body.getWorldQuaternion(this.q),this.qi.copy(this.q).invert(),r.uKey.value.copy(this.KEY).applyQuaternion(this.qi),r.uFill.value.copy(this.FILL).applyQuaternion(this.qi),r.uBack.value.copy(this.BACK).applyQuaternion(this.qi),r.uUp.value.set(0,1,0).applyQuaternion(this.qi)}dispose(){zi.delete(this),this.ro.disconnect(),this.io.disconnect(),this.canvas.removeEventListener("pointerdown",this.poke),this.canvas.remove(),this.mat.dispose(),this.geos.forEach(e=>e.dispose()),this.disposables.forEach(e=>e.dispose())}}export{tm as View,em as probe};
