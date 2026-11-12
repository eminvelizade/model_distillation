import{g as nn}from"./index-DPwBLxQ8.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const rs="170",_l=0,Es=1,xl=2,Lo=1,yl=2,tn=3,bn=0,Mt=1,rn=2,Mn=0,di=1,ws=2,Ts=3,As=4,Ml=5,On=100,Sl=101,bl=102,El=103,wl=104,Tl=200,Al=201,Rl=202,Cl=203,va=204,_a=205,Pl=206,Dl=207,Ll=208,Il=209,Ul=210,Nl=211,Fl=212,Ol=213,kl=214,xa=0,ya=1,Ma=2,_i=3,Sa=4,ba=5,Ea=6,wa=7,Io=0,Bl=1,zl=2,Sn=0,Vl=1,Hl=2,Gl=3,Wl=4,Xl=5,ql=6,Yl=7,Uo=300,xi=301,yi=302,Ta=303,Aa=304,Or=306,Lr=1e3,Bn=1001,Ra=1002,zt=1003,Kl=1004,Ji=1005,Ot=1006,Vr=1007,yn=1008,Xt=1009,No=1010,Fo=1011,Wi=1012,as=1013,Vn=1014,an=1015,qi=1016,ss=1017,os=1018,Mi=1020,Oo=35902,ko=1021,Bo=1022,kt=1023,zo=1024,Vo=1025,pi=1026,Si=1027,ls=1028,cs=1029,Ho=1030,hs=1031,us=1033,wr=33776,Tr=33777,Ar=33778,Rr=33779,Ca=35840,Pa=35841,Da=35842,La=35843,Ia=36196,Ua=37492,Na=37496,Fa=37808,Oa=37809,ka=37810,Ba=37811,za=37812,Va=37813,Ha=37814,Ga=37815,Wa=37816,Xa=37817,qa=37818,Ya=37819,Ka=37820,$a=37821,Cr=36492,Za=36494,ja=36495,Go=36283,Ja=36284,Qa=36285,es=36286,$l=3200,Zl=3201,jl=0,Jl=1,xn="",yt="srgb",Ei="srgb-linear",kr="linear",Ze="srgb",Xn=7680,Rs=519,Ql=512,ec=513,tc=514,Wo=515,nc=516,ic=517,rc=518,ac=519,ts=35044,Cs="300 es",sn=2e3,Ir=2001;class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ps=1234567;const Hi=Math.PI/180,Xi=180/Math.PI;function on(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ft[i&255]+ft[i>>8&255]+ft[i>>16&255]+ft[i>>24&255]+"-"+ft[e&255]+ft[e>>8&255]+"-"+ft[e>>16&15|64]+ft[e>>24&255]+"-"+ft[t&63|128]+ft[t>>8&255]+"-"+ft[t>>16&255]+ft[t>>24&255]+ft[n&255]+ft[n>>8&255]+ft[n>>16&255]+ft[n>>24&255]).toLowerCase()}function vt(i,e,t){return Math.max(e,Math.min(t,i))}function fs(i,e){return(i%e+e)%e}function sc(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function oc(i,e,t){return i!==e?(t-i)/(e-i):0}function Gi(i,e,t){return(1-t)*i+t*e}function lc(i,e,t,n){return Gi(i,e,1-Math.exp(-t*n))}function cc(i,e=1){return e-Math.abs(fs(i,e*2)-e)}function hc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function uc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function fc(i,e){return i+Math.floor(Math.random()*(e-i+1))}function dc(i,e){return i+Math.random()*(e-i)}function pc(i){return i*(.5-Math.random())}function mc(i){i!==void 0&&(Ps=i);let e=Ps+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function gc(i){return i*Hi}function vc(i){return i*Xi}function _c(i){return(i&i-1)===0&&i!==0}function xc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function yc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Mc(i,e,t,n,r){const a=Math.cos,s=Math.sin,o=a(t/2),l=s(t/2),c=a((e+n)/2),h=s((e+n)/2),p=a((e-n)/2),m=s((e-n)/2),f=a((n-e)/2),g=s((n-e)/2);switch(r){case"XYX":i.set(o*h,l*p,l*m,o*c);break;case"YZY":i.set(l*m,o*h,l*p,o*c);break;case"ZXZ":i.set(l*p,l*m,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function $e(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Sc={DEG2RAD:Hi,RAD2DEG:Xi,generateUUID:on,clamp:vt,euclideanModulo:fs,mapLinear:sc,inverseLerp:oc,lerp:Gi,damp:lc,pingpong:cc,smoothstep:hc,smootherstep:uc,randInt:fc,randFloat:dc,randFloatSpread:pc,seededRandom:mc,degToRad:gc,radToDeg:vc,isPowerOfTwo:_c,ceilPowerOfTwo:xc,floorPowerOfTwo:yc,setQuaternionFromProperEuler:Mc,normalize:$e,denormalize:Ft};class ke{constructor(e=0,t=0){ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*n-s*r+e.x,this.y=a*r+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pe{constructor(e,t,n,r,a,s,o,l,c){Pe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c)}set(e,t,n,r,a,s,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=n,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],h=n[4],p=n[7],m=n[2],f=n[5],g=n[8],_=r[0],d=r[3],u=r[6],w=r[1],b=r[4],M=r[7],U=r[2],T=r[5],A=r[8];return a[0]=s*_+o*w+l*U,a[3]=s*d+o*b+l*T,a[6]=s*u+o*M+l*A,a[1]=c*_+h*w+p*U,a[4]=c*d+h*b+p*T,a[7]=c*u+h*M+p*A,a[2]=m*_+f*w+g*U,a[5]=m*d+f*b+g*T,a[8]=m*u+f*M+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*s*h-t*o*c-n*a*h+n*o*l+r*a*c-r*s*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=h*s-o*c,m=o*l-h*a,f=c*a-s*l,g=t*p+n*m+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=p*_,e[1]=(r*c-h*n)*_,e[2]=(o*n-r*s)*_,e[3]=m*_,e[4]=(h*t-r*l)*_,e[5]=(r*a-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(s*t-n*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,a,s,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*s+c*o)+s+e,-r*c,r*l,-r*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Hr.makeScale(e,t)),this}rotate(e){return this.premultiply(Hr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hr=new Pe;function Xo(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ur(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bc(){const i=Ur("canvas");return i.style.display="block",i}const Ds={};function Oi(i){i in Ds||(Ds[i]=!0,console.warn(i))}function Ec(i,e,t){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}function wc(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Tc(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ge={enabled:!0,workingColorSpace:Ei,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Ze&&(i.r=ln(i.r),i.g=ln(i.g),i.b=ln(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Ze&&(i.r=mi(i.r),i.g=mi(i.g),i.b=mi(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xn?kr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function ln(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function mi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Ls=[.64,.33,.3,.6,.15,.06],Is=[.2126,.7152,.0722],Us=[.3127,.329],Ns=new Pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fs=new Pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ge.define({[Ei]:{primaries:Ls,whitePoint:Us,transfer:kr,toXYZ:Ns,fromXYZ:Fs,luminanceCoefficients:Is,workingColorSpaceConfig:{unpackColorSpace:yt},outputColorSpaceConfig:{drawingBufferColorSpace:yt}},[yt]:{primaries:Ls,whitePoint:Us,transfer:Ze,toXYZ:Ns,fromXYZ:Fs,luminanceCoefficients:Is,outputColorSpaceConfig:{drawingBufferColorSpace:yt}}});let qn;class Ac{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qn===void 0&&(qn=Ur("canvas")),qn.width=e.width,qn.height=e.height;const n=qn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=qn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ur("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=ln(a[s]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ln(t[n]/255)*255):t[n]=ln(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Rc=0;class qo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rc++}),this.uuid=on(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(Gr(r[s].image)):a.push(Gr(r[s]))}else a=Gr(r);n.url=a}return t||(e.images[this.uuid]=n),n}}function Gr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ac.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cc=0;class _t extends wi{constructor(e=_t.DEFAULT_IMAGE,t=_t.DEFAULT_MAPPING,n=Bn,r=Bn,a=Ot,s=yn,o=kt,l=Xt,c=_t.DEFAULT_ANISOTROPY,h=xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cc++}),this.uuid=on(),this.name="",this.source=new qo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ke(0,0),this.repeat=new ke(1,1),this.center=new ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Uo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Lr:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case Ra:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Lr:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case Ra:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_t.DEFAULT_IMAGE=null;_t.DEFAULT_MAPPING=Uo;_t.DEFAULT_ANISOTROPY=1;class Qe{constructor(e=0,t=0,n=0,r=1){Qe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r+s[12]*a,this.y=s[1]*t+s[5]*n+s[9]*r+s[13]*a,this.z=s[2]*t+s[6]*n+s[10]*r+s[14]*a,this.w=s[3]*t+s[7]*n+s[11]*r+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,a;const l=e.elements,c=l[0],h=l[4],p=l[8],m=l[1],f=l[5],g=l[9],_=l[2],d=l[6],u=l[10];if(Math.abs(h-m)<.01&&Math.abs(p-_)<.01&&Math.abs(g-d)<.01){if(Math.abs(h+m)<.1&&Math.abs(p+_)<.1&&Math.abs(g+d)<.1&&Math.abs(c+f+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,M=(f+1)/2,U=(u+1)/2,T=(h+m)/4,A=(p+_)/4,C=(g+d)/4;return b>M&&b>U?b<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(b),r=T/n,a=A/n):M>U?M<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(M),n=T/r,a=C/r):U<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(U),n=A/a,r=C/a),this.set(n,r,a,t),this}let w=Math.sqrt((d-g)*(d-g)+(p-_)*(p-_)+(m-h)*(m-h));return Math.abs(w)<.001&&(w=1),this.x=(d-g)/w,this.y=(p-_)/w,this.z=(m-h)/w,this.w=Math.acos((c+f+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Pc extends wi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Qe(0,0,e,t),this.scissorTest=!1,this.viewport=new Qe(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new _t(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new qo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hn extends Pc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Yo extends _t{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=zt,this.minFilter=zt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ko extends _t{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=zt,this.minFilter=zt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gn{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,a,s,o){let l=n[r+0],c=n[r+1],h=n[r+2],p=n[r+3];const m=a[s+0],f=a[s+1],g=a[s+2],_=a[s+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=p;return}if(o===1){e[t+0]=m,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(p!==_||l!==m||c!==f||h!==g){let d=1-o;const u=l*m+c*f+h*g+p*_,w=u>=0?1:-1,b=1-u*u;if(b>Number.EPSILON){const U=Math.sqrt(b),T=Math.atan2(U,u*w);d=Math.sin(d*T)/U,o=Math.sin(o*T)/U}const M=o*w;if(l=l*d+m*M,c=c*d+f*M,h=h*d+g*M,p=p*d+_*M,d===1-o){const U=1/Math.sqrt(l*l+c*c+h*h+p*p);l*=U,c*=U,h*=U,p*=U}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,r,a,s){const o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],p=a[s],m=a[s+1],f=a[s+2],g=a[s+3];return e[t]=o*g+h*p+l*f-c*m,e[t+1]=l*g+h*m+c*p-o*f,e[t+2]=c*g+h*f+o*m-l*p,e[t+3]=h*g-o*p-l*m-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),p=o(a/2),m=l(n/2),f=l(r/2),g=l(a/2);switch(s){case"XYZ":this._x=m*h*p+c*f*g,this._y=c*f*p-m*h*g,this._z=c*h*g+m*f*p,this._w=c*h*p-m*f*g;break;case"YXZ":this._x=m*h*p+c*f*g,this._y=c*f*p-m*h*g,this._z=c*h*g-m*f*p,this._w=c*h*p+m*f*g;break;case"ZXY":this._x=m*h*p-c*f*g,this._y=c*f*p+m*h*g,this._z=c*h*g+m*f*p,this._w=c*h*p-m*f*g;break;case"ZYX":this._x=m*h*p-c*f*g,this._y=c*f*p+m*h*g,this._z=c*h*g-m*f*p,this._w=c*h*p+m*f*g;break;case"YZX":this._x=m*h*p+c*f*g,this._y=c*f*p+m*h*g,this._z=c*h*g-m*f*p,this._w=c*h*p-m*f*g;break;case"XZY":this._x=m*h*p-c*f*g,this._y=c*f*p-m*h*g,this._z=c*h*g+m*f*p,this._w=c*h*p+m*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],a=t[8],s=t[1],o=t[5],l=t[9],c=t[2],h=t[6],p=t[10],m=n+o+p;if(m>0){const f=.5/Math.sqrt(m+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(s-r)*f}else if(n>o&&n>p){const f=2*Math.sqrt(1+n-o-p);this._w=(h-l)/f,this._x=.25*f,this._y=(r+s)/f,this._z=(a+c)/f}else if(o>p){const f=2*Math.sqrt(1+o-n-p);this._w=(a-c)/f,this._x=(r+s)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+p-n-o);this._w=(s-r)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,a=e._z,s=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+s*o+r*c-a*l,this._y=r*h+s*l+a*o-n*c,this._z=a*h+s*c+n*l-r*o,this._w=s*h-n*o-r*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,a=this._z,s=this._w;let o=s*e._w+n*e._x+r*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=n,this._y=r,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*s+t*this._w,this._x=f*n+t*this._x,this._y=f*r+t*this._y,this._z=f*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),p=Math.sin((1-t)*h)/c,m=Math.sin(t*h)/c;return this._w=s*p+this._w*m,this._x=n*p+this._x*m,this._y=r*p+this._y*m,this._z=a*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,n=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Os.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Os.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*r,this.y=a[1]*t+a[4]*n+a[7]*r,this.z=a[2]*t+a[5]*n+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=e.elements,s=1/(a[3]*t+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*r+a[12])*s,this.y=(a[1]*t+a[5]*n+a[9]*r+a[13])*s,this.z=(a[2]*t+a[6]*n+a[10]*r+a[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,a=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*r-o*n),h=2*(o*t-a*r),p=2*(a*n-s*t);return this.x=t+l*c+s*p-o*h,this.y=n+l*h+o*c-a*p,this.z=r+l*p+a*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r,this.y=a[1]*t+a[5]*n+a[9]*r,this.z=a[2]*t+a[6]*n+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,a=e.z,s=t.x,o=t.y,l=t.z;return this.x=r*l-a*o,this.y=a*s-n*l,this.z=n*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wr.copy(this).projectOnVector(e),this.sub(Wr)}reflect(e){return this.sub(Wr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Wr=new N,Os=new Gn;class Yi{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(It.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(It.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=It.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,It):It.fromBufferAttribute(a,s),It.applyMatrix4(e.matrixWorld),this.expandByPoint(It);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Qi.copy(n.boundingBox)),Qi.applyMatrix4(e.matrixWorld),this.union(Qi)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,It),It.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pi),er.subVectors(this.max,Pi),Yn.subVectors(e.a,Pi),Kn.subVectors(e.b,Pi),$n.subVectors(e.c,Pi),fn.subVectors(Kn,Yn),dn.subVectors($n,Kn),Tn.subVectors(Yn,$n);let t=[0,-fn.z,fn.y,0,-dn.z,dn.y,0,-Tn.z,Tn.y,fn.z,0,-fn.x,dn.z,0,-dn.x,Tn.z,0,-Tn.x,-fn.y,fn.x,0,-dn.y,dn.x,0,-Tn.y,Tn.x,0];return!Xr(t,Yn,Kn,$n,er)||(t=[1,0,0,0,1,0,0,0,1],!Xr(t,Yn,Kn,$n,er))?!1:(tr.crossVectors(fn,dn),t=[tr.x,tr.y,tr.z],Xr(t,Yn,Kn,$n,er))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,It).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(It).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($t),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const $t=[new N,new N,new N,new N,new N,new N,new N,new N],It=new N,Qi=new Yi,Yn=new N,Kn=new N,$n=new N,fn=new N,dn=new N,Tn=new N,Pi=new N,er=new N,tr=new N,An=new N;function Xr(i,e,t,n,r){for(let a=0,s=i.length-3;a<=s;a+=3){An.fromArray(i,a);const o=r.x*Math.abs(An.x)+r.y*Math.abs(An.y)+r.z*Math.abs(An.z),l=e.dot(An),c=t.dot(An),h=n.dot(An);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Dc=new Yi,Di=new N,qr=new N;class ds{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Dc.setFromPoints(e).getCenter(n);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Di.subVectors(e,this.center);const t=Di.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Di,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(qr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Di.copy(e.center).add(qr)),this.expandByPoint(Di.copy(e.center).sub(qr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Zt=new N,Yr=new N,nr=new N,pn=new N,Kr=new N,ir=new N,$r=new N;class Lc{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Zt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zt.copy(this.origin).addScaledVector(this.direction,t),Zt.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Yr.copy(e).add(t).multiplyScalar(.5),nr.copy(t).sub(e).normalize(),pn.copy(this.origin).sub(Yr);const a=e.distanceTo(t)*.5,s=-this.direction.dot(nr),o=pn.dot(this.direction),l=-pn.dot(nr),c=pn.lengthSq(),h=Math.abs(1-s*s);let p,m,f,g;if(h>0)if(p=s*l-o,m=s*o-l,g=a*h,p>=0)if(m>=-g)if(m<=g){const _=1/h;p*=_,m*=_,f=p*(p+s*m+2*o)+m*(s*p+m+2*l)+c}else m=a,p=Math.max(0,-(s*m+o)),f=-p*p+m*(m+2*l)+c;else m=-a,p=Math.max(0,-(s*m+o)),f=-p*p+m*(m+2*l)+c;else m<=-g?(p=Math.max(0,-(-s*a+o)),m=p>0?-a:Math.min(Math.max(-a,-l),a),f=-p*p+m*(m+2*l)+c):m<=g?(p=0,m=Math.min(Math.max(-a,-l),a),f=m*(m+2*l)+c):(p=Math.max(0,-(s*a+o)),m=p>0?a:Math.min(Math.max(-a,-l),a),f=-p*p+m*(m+2*l)+c);else m=s>0?-a:a,p=Math.max(0,-(s*m+o)),f=-p*p+m*(m+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Yr).addScaledVector(nr,m),f}intersectSphere(e,t){Zt.subVectors(e.center,this.origin);const n=Zt.dot(this.direction),r=Zt.dot(Zt)-n*n,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,a,s,o,l;const c=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,m=this.origin;return c>=0?(n=(e.min.x-m.x)*c,r=(e.max.x-m.x)*c):(n=(e.max.x-m.x)*c,r=(e.min.x-m.x)*c),h>=0?(a=(e.min.y-m.y)*h,s=(e.max.y-m.y)*h):(a=(e.max.y-m.y)*h,s=(e.min.y-m.y)*h),n>s||a>r||((a>n||isNaN(n))&&(n=a),(s<r||isNaN(r))&&(r=s),p>=0?(o=(e.min.z-m.z)*p,l=(e.max.z-m.z)*p):(o=(e.max.z-m.z)*p,l=(e.min.z-m.z)*p),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Zt)!==null}intersectTriangle(e,t,n,r,a){Kr.subVectors(t,e),ir.subVectors(n,e),$r.crossVectors(Kr,ir);let s=this.direction.dot($r),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;pn.subVectors(this.origin,e);const l=o*this.direction.dot(ir.crossVectors(pn,ir));if(l<0)return null;const c=o*this.direction.dot(Kr.cross(pn));if(c<0||l+c>s)return null;const h=-o*pn.dot($r);return h<0?null:this.at(h/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,n,r,a,s,o,l,c,h,p,m,f,g,_,d){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,l,c,h,p,m,f,g,_,d)}set(e,t,n,r,a,s,o,l,c,h,p,m,f,g,_,d){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=r,u[1]=a,u[5]=s,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=p,u[14]=m,u[3]=f,u[7]=g,u[11]=_,u[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Zn.setFromMatrixColumn(e,0).length(),a=1/Zn.setFromMatrixColumn(e,1).length(),s=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,a=e.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(a),p=Math.sin(a);if(e.order==="XYZ"){const m=s*h,f=s*p,g=o*h,_=o*p;t[0]=l*h,t[4]=-l*p,t[8]=c,t[1]=f+g*c,t[5]=m-_*c,t[9]=-o*l,t[2]=_-m*c,t[6]=g+f*c,t[10]=s*l}else if(e.order==="YXZ"){const m=l*h,f=l*p,g=c*h,_=c*p;t[0]=m+_*o,t[4]=g*o-f,t[8]=s*c,t[1]=s*p,t[5]=s*h,t[9]=-o,t[2]=f*o-g,t[6]=_+m*o,t[10]=s*l}else if(e.order==="ZXY"){const m=l*h,f=l*p,g=c*h,_=c*p;t[0]=m-_*o,t[4]=-s*p,t[8]=g+f*o,t[1]=f+g*o,t[5]=s*h,t[9]=_-m*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const m=s*h,f=s*p,g=o*h,_=o*p;t[0]=l*h,t[4]=g*c-f,t[8]=m*c+_,t[1]=l*p,t[5]=_*c+m,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const m=s*l,f=s*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-m*p,t[8]=g*p+f,t[1]=p,t[5]=s*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*p+g,t[10]=m-_*p}else if(e.order==="XZY"){const m=s*l,f=s*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-p,t[8]=c*h,t[1]=m*p+_,t[5]=s*h,t[9]=f*p-g,t[2]=g*p-f,t[6]=o*h,t[10]=_*p+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ic,e,Uc)}lookAt(e,t,n){const r=this.elements;return Et.subVectors(e,t),Et.lengthSq()===0&&(Et.z=1),Et.normalize(),mn.crossVectors(n,Et),mn.lengthSq()===0&&(Math.abs(n.z)===1?Et.x+=1e-4:Et.z+=1e-4,Et.normalize(),mn.crossVectors(n,Et)),mn.normalize(),rr.crossVectors(Et,mn),r[0]=mn.x,r[4]=rr.x,r[8]=Et.x,r[1]=mn.y,r[5]=rr.y,r[9]=Et.y,r[2]=mn.z,r[6]=rr.z,r[10]=Et.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],h=n[1],p=n[5],m=n[9],f=n[13],g=n[2],_=n[6],d=n[10],u=n[14],w=n[3],b=n[7],M=n[11],U=n[15],T=r[0],A=r[4],C=r[8],S=r[12],y=r[1],R=r[5],W=r[9],z=r[13],X=r[2],J=r[6],Y=r[10],ee=r[14],H=r[3],ae=r[7],fe=r[11],Me=r[15];return a[0]=s*T+o*y+l*X+c*H,a[4]=s*A+o*R+l*J+c*ae,a[8]=s*C+o*W+l*Y+c*fe,a[12]=s*S+o*z+l*ee+c*Me,a[1]=h*T+p*y+m*X+f*H,a[5]=h*A+p*R+m*J+f*ae,a[9]=h*C+p*W+m*Y+f*fe,a[13]=h*S+p*z+m*ee+f*Me,a[2]=g*T+_*y+d*X+u*H,a[6]=g*A+_*R+d*J+u*ae,a[10]=g*C+_*W+d*Y+u*fe,a[14]=g*S+_*z+d*ee+u*Me,a[3]=w*T+b*y+M*X+U*H,a[7]=w*A+b*R+M*J+U*ae,a[11]=w*C+b*W+M*Y+U*fe,a[15]=w*S+b*z+M*ee+U*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],a=e[12],s=e[1],o=e[5],l=e[9],c=e[13],h=e[2],p=e[6],m=e[10],f=e[14],g=e[3],_=e[7],d=e[11],u=e[15];return g*(+a*l*p-r*c*p-a*o*m+n*c*m+r*o*f-n*l*f)+_*(+t*l*f-t*c*m+a*s*m-r*s*f+r*c*h-a*l*h)+d*(+t*c*p-t*o*f-a*s*p+n*s*f+a*o*h-n*c*h)+u*(-r*o*h-t*l*p+t*o*m+r*s*p-n*s*m+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=e[9],m=e[10],f=e[11],g=e[12],_=e[13],d=e[14],u=e[15],w=p*d*c-_*m*c+_*l*f-o*d*f-p*l*u+o*m*u,b=g*m*c-h*d*c-g*l*f+s*d*f+h*l*u-s*m*u,M=h*_*c-g*p*c+g*o*f-s*_*f-h*o*u+s*p*u,U=g*p*l-h*_*l-g*o*m+s*_*m+h*o*d-s*p*d,T=t*w+n*b+r*M+a*U;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=w*A,e[1]=(_*m*a-p*d*a-_*r*f+n*d*f+p*r*u-n*m*u)*A,e[2]=(o*d*a-_*l*a+_*r*c-n*d*c-o*r*u+n*l*u)*A,e[3]=(p*l*a-o*m*a-p*r*c+n*m*c+o*r*f-n*l*f)*A,e[4]=b*A,e[5]=(h*d*a-g*m*a+g*r*f-t*d*f-h*r*u+t*m*u)*A,e[6]=(g*l*a-s*d*a-g*r*c+t*d*c+s*r*u-t*l*u)*A,e[7]=(s*m*a-h*l*a+h*r*c-t*m*c-s*r*f+t*l*f)*A,e[8]=M*A,e[9]=(g*p*a-h*_*a-g*n*f+t*_*f+h*n*u-t*p*u)*A,e[10]=(s*_*a-g*o*a+g*n*c-t*_*c-s*n*u+t*o*u)*A,e[11]=(h*o*a-s*p*a-h*n*c+t*p*c+s*n*f-t*o*f)*A,e[12]=U*A,e[13]=(h*_*r-g*p*r+g*n*m-t*_*m-h*n*d+t*p*d)*A,e[14]=(g*o*r-s*_*r-g*n*l+t*_*l+s*n*d-t*o*d)*A,e[15]=(s*p*r-h*o*r+h*n*l-t*p*l-s*n*m+t*o*m)*A,this}scale(e){const t=this.elements,n=e.x,r=e.y,a=e.z;return t[0]*=n,t[4]*=r,t[8]*=a,t[1]*=n,t[5]*=r,t[9]*=a,t[2]*=n,t[6]*=r,t[10]*=a,t[3]*=n,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),a=1-n,s=e.x,o=e.y,l=e.z,c=a*s,h=a*o;return this.set(c*s+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*s,0,c*l-r*o,h*l+r*s,a*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,a,s){return this.set(1,n,a,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,a=t._x,s=t._y,o=t._z,l=t._w,c=a+a,h=s+s,p=o+o,m=a*c,f=a*h,g=a*p,_=s*h,d=s*p,u=o*p,w=l*c,b=l*h,M=l*p,U=n.x,T=n.y,A=n.z;return r[0]=(1-(_+u))*U,r[1]=(f+M)*U,r[2]=(g-b)*U,r[3]=0,r[4]=(f-M)*T,r[5]=(1-(m+u))*T,r[6]=(d+w)*T,r[7]=0,r[8]=(g+b)*A,r[9]=(d-w)*A,r[10]=(1-(m+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let a=Zn.set(r[0],r[1],r[2]).length();const s=Zn.set(r[4],r[5],r[6]).length(),o=Zn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),e.x=r[12],e.y=r[13],e.z=r[14],Ut.copy(this);const c=1/a,h=1/s,p=1/o;return Ut.elements[0]*=c,Ut.elements[1]*=c,Ut.elements[2]*=c,Ut.elements[4]*=h,Ut.elements[5]*=h,Ut.elements[6]*=h,Ut.elements[8]*=p,Ut.elements[9]*=p,Ut.elements[10]*=p,t.setFromRotationMatrix(Ut),n.x=a,n.y=s,n.z=o,this}makePerspective(e,t,n,r,a,s,o=sn){const l=this.elements,c=2*a/(t-e),h=2*a/(n-r),p=(t+e)/(t-e),m=(n+r)/(n-r);let f,g;if(o===sn)f=-(s+a)/(s-a),g=-2*s*a/(s-a);else if(o===Ir)f=-s/(s-a),g=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=h,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,a,s,o=sn){const l=this.elements,c=1/(t-e),h=1/(n-r),p=1/(s-a),m=(t+e)*c,f=(n+r)*h;let g,_;if(o===sn)g=(s+a)*p,_=-2*p;else if(o===Ir)g=a*p,_=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-m,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Zn=new N,Ut=new rt,Ic=new N(0,0,0),Uc=new N(1,1,1),mn=new N,rr=new N,Et=new N,ks=new rt,Bs=new Gn;class qt{constructor(e=0,t=0,n=0,r=qt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],l=r[1],c=r[5],h=r[9],p=r[2],m=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,a),this._z=0);break;case"ZXY":this._x=Math.asin(vt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,f),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-vt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-p,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-vt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ks.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ks,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bs.setFromEuler(this),this.setFromQuaternion(Bs,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qt.DEFAULT_ORDER="XYZ";class $o{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Nc=0;const zs=new N,jn=new Gn,jt=new rt,ar=new N,Li=new N,Fc=new N,Oc=new Gn,Vs=new N(1,0,0),Hs=new N(0,1,0),Gs=new N(0,0,1),Ws={type:"added"},kc={type:"removed"},Jn={type:"childadded",child:null},Zr={type:"childremoved",child:null};class St extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nc++}),this.uuid=on(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new N,t=new qt,n=new Gn,r=new N(1,1,1);function a(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new rt},normalMatrix:{value:new Pe}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $o,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.multiply(jn),this}rotateOnWorldAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.premultiply(jn),this}rotateX(e){return this.rotateOnAxis(Vs,e)}rotateY(e){return this.rotateOnAxis(Hs,e)}rotateZ(e){return this.rotateOnAxis(Gs,e)}translateOnAxis(e,t){return zs.copy(e).applyQuaternion(this.quaternion),this.position.add(zs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vs,e)}translateY(e){return this.translateOnAxis(Hs,e)}translateZ(e){return this.translateOnAxis(Gs,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ar.copy(e):ar.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jt.lookAt(Li,ar,this.up):jt.lookAt(ar,Li,this.up),this.quaternion.setFromRotationMatrix(jt),r&&(jt.extractRotation(r.matrixWorld),jn.setFromRotationMatrix(jt),this.quaternion.premultiply(jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ws),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kc),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jt.multiply(e.parent.matrixWorld)),e.applyMatrix4(jt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ws),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,e,Fc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,Oc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const p=l[c];a(e.shapes,p)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(a(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),h=s(e.images),p=s(e.shapes),m=s(e.skeletons),f=s(e.animations),g=s(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=r,n;function s(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}St.DEFAULT_UP=new N(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nt=new N,Jt=new N,jr=new N,Qt=new N,Qn=new N,ei=new N,Xs=new N,Jr=new N,Qr=new N,ea=new N,ta=new Qe,na=new Qe,ia=new Qe;class Pt{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Nt.subVectors(e,t),r.cross(Nt);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,n,r,a){Nt.subVectors(r,t),Jt.subVectors(n,t),jr.subVectors(e,t);const s=Nt.dot(Nt),o=Nt.dot(Jt),l=Nt.dot(jr),c=Jt.dot(Jt),h=Jt.dot(jr),p=s*c-o*o;if(p===0)return a.set(0,0,0),null;const m=1/p,f=(c*l-o*h)*m,g=(s*h-o*l)*m;return a.set(1-f-g,g,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Qt)===null?!1:Qt.x>=0&&Qt.y>=0&&Qt.x+Qt.y<=1}static getInterpolation(e,t,n,r,a,s,o,l){return this.getBarycoord(e,t,n,r,Qt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Qt.x),l.addScaledVector(s,Qt.y),l.addScaledVector(o,Qt.z),l)}static getInterpolatedAttribute(e,t,n,r,a,s){return ta.setScalar(0),na.setScalar(0),ia.setScalar(0),ta.fromBufferAttribute(e,t),na.fromBufferAttribute(e,n),ia.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(ta,a.x),s.addScaledVector(na,a.y),s.addScaledVector(ia,a.z),s}static isFrontFacing(e,t,n,r){return Nt.subVectors(n,t),Jt.subVectors(e,t),Nt.cross(Jt).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nt.subVectors(this.c,this.b),Jt.subVectors(this.a,this.b),Nt.cross(Jt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Pt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,a){return Pt.getInterpolation(e,this.a,this.b,this.c,t,n,r,a)}containsPoint(e){return Pt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,a=this.c;let s,o;Qn.subVectors(r,n),ei.subVectors(a,n),Jr.subVectors(e,n);const l=Qn.dot(Jr),c=ei.dot(Jr);if(l<=0&&c<=0)return t.copy(n);Qr.subVectors(e,r);const h=Qn.dot(Qr),p=ei.dot(Qr);if(h>=0&&p<=h)return t.copy(r);const m=l*p-h*c;if(m<=0&&l>=0&&h<=0)return s=l/(l-h),t.copy(n).addScaledVector(Qn,s);ea.subVectors(e,a);const f=Qn.dot(ea),g=ei.dot(ea);if(g>=0&&f<=g)return t.copy(a);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ei,o);const d=h*g-f*p;if(d<=0&&p-h>=0&&f-g>=0)return Xs.subVectors(a,r),o=(p-h)/(p-h+(f-g)),t.copy(r).addScaledVector(Xs,o);const u=1/(d+_+m);return s=_*u,o=m*u,t.copy(n).addScaledVector(Qn,s).addScaledVector(ei,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Zo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gn={h:0,s:0,l:0},sr={h:0,s:0,l:0};function ra(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ge.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Ge.workingColorSpace){if(e=fs(e,1),t=vt(t,0,1),n=vt(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,s=2*n-a;this.r=ra(s,a,e+1/3),this.g=ra(s,a,e),this.b=ra(s,a,e-1/3)}return Ge.toWorkingColorSpace(this,r),this}setStyle(e,t=yt){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yt){const n=Zo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ln(e.r),this.g=ln(e.g),this.b=ln(e.b),this}copyLinearToSRGB(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yt){return Ge.fromWorkingColorSpace(dt.copy(this),e),Math.round(vt(dt.r*255,0,255))*65536+Math.round(vt(dt.g*255,0,255))*256+Math.round(vt(dt.b*255,0,255))}getHexString(e=yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.fromWorkingColorSpace(dt.copy(this),t);const n=dt.r,r=dt.g,a=dt.b,s=Math.max(n,r,a),o=Math.min(n,r,a);let l,c;const h=(o+s)/2;if(o===s)l=0,c=0;else{const p=s-o;switch(c=h<=.5?p/(s+o):p/(2-s-o),s){case n:l=(r-a)/p+(r<a?6:0);break;case r:l=(a-n)/p+2;break;case a:l=(n-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.fromWorkingColorSpace(dt.copy(this),t),e.r=dt.r,e.g=dt.g,e.b=dt.b,e}getStyle(e=yt){Ge.fromWorkingColorSpace(dt.copy(this),e);const t=dt.r,n=dt.g,r=dt.b;return e!==yt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(gn),this.setHSL(gn.h+e,gn.s+t,gn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(gn),e.getHSL(sr);const n=Gi(gn.h,sr.h,t),r=Gi(gn.s,sr.s,t),a=Gi(gn.l,sr.l,t);return this.setHSL(n,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*r,this.g=a[1]*t+a[4]*n+a[7]*r,this.b=a[2]*t+a[5]*n+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const dt=new Ye;Ye.NAMES=Zo;let Bc=0;class Ki extends wi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bc++}),this.uuid=on(),this.name="",this.blending=di,this.side=bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=va,this.blendDst=_a,this.blendEquation=On,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=_i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rs,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xn,this.stencilZFail=Xn,this.stencilZPass=Xn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==di&&(n.blending=this.blending),this.side!==bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==va&&(n.blendSrc=this.blendSrc),this.blendDst!==_a&&(n.blendDst=this.blendDst),this.blendEquation!==On&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rs&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const s=[];for(const o in a){const l=a[o];delete l.metadata,s.push(l)}return s}if(t){const a=r(e.textures),s=r(e.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ps extends Ki{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qt,this.combine=Io,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const st=new N,or=new ke;class Vt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ts,this.updateRanges=[],this.gpuType=an,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)or.fromBufferAttribute(this,t),or.applyMatrix3(e),this.setXY(t,or.x,or.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyMatrix3(e),this.setXYZ(t,st.x,st.y,st.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyMatrix4(e),this.setXYZ(t,st.x,st.y,st.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.applyNormalMatrix(e),this.setXYZ(t,st.x,st.y,st.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)st.fromBufferAttribute(this,t),st.transformDirection(e),this.setXYZ(t,st.x,st.y,st.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ft(t,this.array)),t}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ft(t,this.array)),t}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ft(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ft(t,this.array)),t}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),r=$e(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),r=$e(r,this.array),a=$e(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ts&&(e.usage=this.usage),e}}class jo extends Vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Jo extends Vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class zn extends Vt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let zc=0;const At=new rt,aa=new St,ti=new N,wt=new Yi,Ii=new Yi,ht=new N;class En extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zc++}),this.uuid=on(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xo(e)?Jo:jo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Pe().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return At.makeRotationFromQuaternion(e),this.applyMatrix4(At),this}rotateX(e){return At.makeRotationX(e),this.applyMatrix4(At),this}rotateY(e){return At.makeRotationY(e),this.applyMatrix4(At),this}rotateZ(e){return At.makeRotationZ(e),this.applyMatrix4(At),this}translate(e,t,n){return At.makeTranslation(e,t,n),this.applyMatrix4(At),this}scale(e,t,n){return At.makeScale(e,t,n),this.applyMatrix4(At),this}lookAt(e){return aa.lookAt(e),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ti).negate(),this.translate(ti.x,ti.y,ti.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,a=e.length;r<a;r++){const s=e[r];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new zn(n,3))}else{for(let n=0,r=t.count;n<r;n++){const a=e[n];t.setXYZ(n,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const a=t[n];wt.setFromBufferAttribute(a),this.morphTargetsRelative?(ht.addVectors(this.boundingBox.min,wt.min),this.boundingBox.expandByPoint(ht),ht.addVectors(this.boundingBox.max,wt.max),this.boundingBox.expandByPoint(ht)):(this.boundingBox.expandByPoint(wt.min),this.boundingBox.expandByPoint(wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(wt.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const o=t[a];Ii.setFromBufferAttribute(o),this.morphTargetsRelative?(ht.addVectors(wt.min,Ii.min),wt.expandByPoint(ht),ht.addVectors(wt.max,Ii.max),wt.expandByPoint(ht)):(wt.expandByPoint(Ii.min),wt.expandByPoint(Ii.max))}wt.getCenter(n);let r=0;for(let a=0,s=e.count;a<s;a++)ht.fromBufferAttribute(e,a),r=Math.max(r,n.distanceToSquared(ht));if(t)for(let a=0,s=t.length;a<s;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ht.fromBufferAttribute(o,c),l&&(ti.fromBufferAttribute(e,c),ht.add(ti)),r=Math.max(r,n.distanceToSquared(ht))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Vt(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new N,l[C]=new N;const c=new N,h=new N,p=new N,m=new ke,f=new ke,g=new ke,_=new N,d=new N;function u(C,S,y){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,S),p.fromBufferAttribute(n,y),m.fromBufferAttribute(a,C),f.fromBufferAttribute(a,S),g.fromBufferAttribute(a,y),h.sub(c),p.sub(c),f.sub(m),g.sub(m);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(p,-f.y).multiplyScalar(R),d.copy(p).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(R),o[C].add(_),o[S].add(_),o[y].add(_),l[C].add(d),l[S].add(d),l[y].add(d))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let C=0,S=w.length;C<S;++C){const y=w[C],R=y.start,W=y.count;for(let z=R,X=R+W;z<X;z+=3)u(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const b=new N,M=new N,U=new N,T=new N;function A(C){U.fromBufferAttribute(r,C),T.copy(U);const S=o[C];b.copy(S),b.sub(U.multiplyScalar(U.dot(S))).normalize(),M.crossVectors(T,S);const R=M.dot(l[C])<0?-1:1;s.setXYZW(C,b.x,b.y,b.z,R)}for(let C=0,S=w.length;C<S;++C){const y=w[C],R=y.start,W=y.count;for(let z=R,X=R+W;z<X;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,f=n.count;m<f;m++)n.setXYZ(m,0,0,0);const r=new N,a=new N,s=new N,o=new N,l=new N,c=new N,h=new N,p=new N;if(e)for(let m=0,f=e.count;m<f;m+=3){const g=e.getX(m+0),_=e.getX(m+1),d=e.getX(m+2);r.fromBufferAttribute(t,g),a.fromBufferAttribute(t,_),s.fromBufferAttribute(t,d),h.subVectors(s,a),p.subVectors(r,a),h.cross(p),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,d),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(d,c.x,c.y,c.z)}else for(let m=0,f=t.count;m<f;m+=3)r.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),s.fromBufferAttribute(t,m+2),h.subVectors(s,a),p.subVectors(r,a),h.cross(p),n.setXYZ(m+0,h.x,h.y,h.z),n.setXYZ(m+1,h.x,h.y,h.z),n.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ht.fromBufferAttribute(e,t),ht.normalize(),e.setXYZ(t,ht.x,ht.y,ht.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,p=o.normalized,m=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,d=l.length;_<d;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let u=0;u<h;u++)m[g++]=c[f++]}return new Vt(m,h,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new En,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,p=c.length;h<p;h++){const m=c[h],f=e(m,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let p=0,m=c.length;p<m;p++){const f=c[p];h.push(f.toJSON(e.data))}h.length>0&&(r[l]=h,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],p=a[c];for(let m=0,f=p.length;m<f;m++)h.push(p[m].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,h=s.length;c<h;c++){const p=s[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qs=new rt,Rn=new Lc,lr=new ds,Ys=new N,cr=new N,hr=new N,ur=new N,sa=new N,fr=new N,Ks=new N,dr=new N;class Bt extends St{constructor(e=new En,t=new ps){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){fr.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],p=a[l];h!==0&&(sa.fromBufferAttribute(p,e),s?fr.addScaledVector(sa,h):fr.addScaledVector(sa.sub(t),h))}t.add(fr)}return t}raycast(e,t){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),lr.copy(n.boundingSphere),lr.applyMatrix4(a),Rn.copy(e.ray).recast(e.near),!(lr.containsPoint(Rn.origin)===!1&&(Rn.intersectSphere(lr,Ys)===null||Rn.origin.distanceToSquared(Ys)>(e.far-e.near)**2))&&(qs.copy(a).invert(),Rn.copy(e.ray).applyMatrix4(qs),!(n.boundingBox!==null&&Rn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Rn)))}_computeIntersections(e,t,n){let r;const a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,p=a.attributes.normal,m=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(s))for(let g=0,_=m.length;g<_;g++){const d=m[g],u=s[d.materialIndex],w=Math.max(d.start,f.start),b=Math.min(o.count,Math.min(d.start+d.count,f.start+f.count));for(let M=w,U=b;M<U;M+=3){const T=o.getX(M),A=o.getX(M+1),C=o.getX(M+2);r=pr(this,u,e,n,c,h,p,T,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let d=g,u=_;d<u;d+=3){const w=o.getX(d),b=o.getX(d+1),M=o.getX(d+2);r=pr(this,s,e,n,c,h,p,w,b,M),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let g=0,_=m.length;g<_;g++){const d=m[g],u=s[d.materialIndex],w=Math.max(d.start,f.start),b=Math.min(l.count,Math.min(d.start+d.count,f.start+f.count));for(let M=w,U=b;M<U;M+=3){const T=M,A=M+1,C=M+2;r=pr(this,u,e,n,c,h,p,T,A,C),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let d=g,u=_;d<u;d+=3){const w=d,b=d+1,M=d+2;r=pr(this,s,e,n,c,h,p,w,b,M),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}}function Vc(i,e,t,n,r,a,s,o){let l;if(e.side===Mt?l=n.intersectTriangle(s,a,r,!0,o):l=n.intersectTriangle(r,a,s,e.side===bn,o),l===null)return null;dr.copy(o),dr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(dr);return c<t.near||c>t.far?null:{distance:c,point:dr.clone(),object:i}}function pr(i,e,t,n,r,a,s,o,l,c){i.getVertexPosition(o,cr),i.getVertexPosition(l,hr),i.getVertexPosition(c,ur);const h=Vc(i,e,t,n,cr,hr,ur,Ks);if(h){const p=new N;Pt.getBarycoord(Ks,cr,hr,ur,p),r&&(h.uv=Pt.getInterpolatedAttribute(r,o,l,c,p,new ke)),a&&(h.uv1=Pt.getInterpolatedAttribute(a,o,l,c,p,new ke)),s&&(h.normal=Pt.getInterpolatedAttribute(s,o,l,c,p,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const m={a:o,b:l,c,normal:new N,materialIndex:0};Pt.getNormal(cr,hr,ur,m.normal),h.face=m,h.barycoord=p}return h}class Ti extends En{constructor(e=1,t=1,n=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const l=[],c=[],h=[],p=[];let m=0,f=0;g("z","y","x",-1,-1,n,t,e,s,a,0),g("z","y","x",1,-1,n,t,-e,s,a,1),g("x","z","y",1,1,e,n,t,r,s,2),g("x","z","y",1,-1,e,n,-t,r,s,3),g("x","y","z",1,-1,e,t,n,r,a,4),g("x","y","z",-1,-1,e,t,-n,r,a,5),this.setIndex(l),this.setAttribute("position",new zn(c,3)),this.setAttribute("normal",new zn(h,3)),this.setAttribute("uv",new zn(p,2));function g(_,d,u,w,b,M,U,T,A,C,S){const y=M/A,R=U/C,W=M/2,z=U/2,X=T/2,J=A+1,Y=C+1;let ee=0,H=0;const ae=new N;for(let fe=0;fe<Y;fe++){const Me=fe*R-z;for(let Ce=0;Ce<J;Ce++){const V=Ce*y-W;ae[_]=V*w,ae[d]=Me*b,ae[u]=X,c.push(ae.x,ae.y,ae.z),ae[_]=0,ae[d]=0,ae[u]=T>0?1:-1,h.push(ae.x,ae.y,ae.z),p.push(Ce/A),p.push(1-fe/C),ee+=1}}for(let fe=0;fe<C;fe++)for(let Me=0;Me<A;Me++){const Ce=m+Me+J*fe,V=m+Me+J*(fe+1),F=m+(Me+1)+J*(fe+1),q=m+(Me+1)+J*fe;l.push(Ce,V,q),l.push(V,F,q),H+=6}o.addGroup(f,H,S),f+=H,m+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ti(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function bi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function mt(i){const e={};for(let t=0;t<i.length;t++){const n=bi(i[t]);for(const r in n)e[r]=n[r]}return e}function Hc(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qo(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const Gc={clone:bi,merge:mt};var Wc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cn extends Ki{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wc,this.fragmentShader=Xc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bi(e.uniforms),this.uniformsGroups=Hc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class el extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=sn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vn=new N,$s=new ke,Zs=new ke;class Ct extends el{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xi*2*Math.atan(Math.tan(Hi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vn.x,vn.y).multiplyScalar(-e/vn.z),vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(vn.x,vn.y).multiplyScalar(-e/vn.z)}getViewSize(e,t){return this.getViewBounds(e,$s,Zs),t.subVectors(Zs,$s)}setViewOffset(e,t,n,r,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Hi*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;a+=s.offsetX*r/l,t-=s.offsetY*n/c,r*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ni=-90,ii=1;class qc extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ct(ni,ii,e,t);r.layers=this.layers,this.add(r);const a=new Ct(ni,ii,e,t);a.layers=this.layers,this.add(a);const s=new Ct(ni,ii,e,t);s.layers=this.layers,this.add(s);const o=new Ct(ni,ii,e,t);o.layers=this.layers,this.add(o);const l=new Ct(ni,ii,e,t);l.layers=this.layers,this.add(l);const c=new Ct(ni,ii,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,a,s,o,l]=t;for(const c of t)this.remove(c);if(e===sn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,l,c,h]=this.children,p=e.getRenderTarget(),m=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,a),e.setRenderTarget(n,1,r),e.render(t,s),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(p,m,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class tl extends _t{constructor(e,t,n,r,a,s,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:xi,super(e,t,n,r,a,s,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Yc extends Hn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new tl(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ot}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ti(5,5,5),a=new cn({name:"CubemapFromEquirect",uniforms:bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Mt,blending:Mn});a.uniforms.tEquirect.value=t;const s=new Bt(r,a),o=t.minFilter;return t.minFilter===yn&&(t.minFilter=Ot),new qc(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,r){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,r);e.setRenderTarget(a)}}const oa=new N,Kc=new N,$c=new Pe;class In{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=oa.subVectors(n,t).cross(Kc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(oa),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||$c.getNormalMatrix(e),r=this.coplanarPoint(oa).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Cn=new ds,mr=new N;class nl{constructor(e=new In,t=new In,n=new In,r=new In,a=new In,s=new In){this.planes=[e,t,n,r,a,s]}set(e,t,n,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=sn){const n=this.planes,r=e.elements,a=r[0],s=r[1],o=r[2],l=r[3],c=r[4],h=r[5],p=r[6],m=r[7],f=r[8],g=r[9],_=r[10],d=r[11],u=r[12],w=r[13],b=r[14],M=r[15];if(n[0].setComponents(l-a,m-c,d-f,M-u).normalize(),n[1].setComponents(l+a,m+c,d+f,M+u).normalize(),n[2].setComponents(l+s,m+h,d+g,M+w).normalize(),n[3].setComponents(l-s,m-h,d-g,M-w).normalize(),n[4].setComponents(l-o,m-p,d-_,M-b).normalize(),t===sn)n[5].setComponents(l+o,m+p,d+_,M+b).normalize();else if(t===Ir)n[5].setComponents(o,p,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Cn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Cn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Cn)}intersectsSprite(e){return Cn.center.set(0,0,0),Cn.radius=.7071067811865476,Cn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Cn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(mr.x=r.normal.x>0?e.max.x:e.min.x,mr.y=r.normal.y>0?e.max.y:e.min.y,mr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(mr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function il(){let i=null,e=!1,t=null,n=null;function r(a,s){t(a,s),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function Zc(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,p=c.byteLength,m=i.createBuffer();i.bindBuffer(l,m),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,l,c){const h=l.array,p=l.updateRanges;if(i.bindBuffer(c,o),p.length===0)i.bufferSubData(c,0,h);else{p.sort((f,g)=>f.start-g.start);let m=0;for(let f=1;f<p.length;f++){const g=p[m],_=p[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++m,p[m]=_)}p.length=m+1;for(let f=0,g=p.length;f<g;f++){const _=p[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:a,update:s}}class $i extends En{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const a=e/2,s=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,p=e/o,m=t/l,f=[],g=[],_=[],d=[];for(let u=0;u<h;u++){const w=u*m-s;for(let b=0;b<c;b++){const M=b*p-a;g.push(M,-w,0),_.push(0,0,1),d.push(b/o),d.push(1-u/l)}}for(let u=0;u<l;u++)for(let w=0;w<o;w++){const b=w+c*u,M=w+c*(u+1),U=w+1+c*(u+1),T=w+1+c*u;f.push(b,M,T),f.push(M,U,T)}this.setIndex(f),this.setAttribute("position",new zn(g,3)),this.setAttribute("normal",new zn(_,3)),this.setAttribute("uv",new zn(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $i(e.width,e.height,e.widthSegments,e.heightSegments)}}var jc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Jc=`#ifdef USE_ALPHAHASH
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
#endif`,Qc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,eh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,th=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ih=`#ifdef USE_AOMAP
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
#endif`,rh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ah=`#ifdef USE_BATCHING
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
#endif`,sh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ch=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hh=`#ifdef USE_IRIDESCENCE
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
#endif`,uh=`#ifdef USE_BUMPMAP
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
#endif`,fh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,dh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ph=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_h=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,xh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,yh=`#define PI 3.141592653589793
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
} // validated`,Mh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sh=`vec3 transformedNormal = objectNormal;
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
#endif`,bh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Eh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Th=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ah="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ch=`#ifdef USE_ENVMAP
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
#endif`,Ph=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Dh=`#ifdef USE_ENVMAP
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
#endif`,Lh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ih=`#ifdef USE_ENVMAP
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
#endif`,Uh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Oh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,kh=`#ifdef USE_GRADIENTMAP
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
}`,Bh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Hh=`uniform bool receiveShadow;
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
#endif`,Gh=`#ifdef USE_ENVMAP
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
#endif`,Wh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kh=`PhysicalMaterial material;
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
#endif`,$h=`struct PhysicalMaterial {
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
}`,Zh=`
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
#endif`,jh=`#if defined( RE_IndirectDiffuse )
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
#endif`,Jh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,iu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ru=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,au=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,su=`#if defined( USE_POINTS_UV )
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
#endif`,ou=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,uu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fu=`#ifdef USE_MORPHTARGETS
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
#endif`,du=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,mu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,gu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_u=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xu=`#ifdef USE_NORMALMAP
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
#endif`,yu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Su=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Eu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Tu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Au=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ru=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Pu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Du=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Iu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Uu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Nu=`float getShadowMask() {
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
}`,Fu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ou=`#ifdef USE_SKINNING
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
#endif`,ku=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Bu=`#ifdef USE_SKINNING
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
#endif`,zu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Vu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gu=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wu=`#ifdef USE_TRANSMISSION
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
#endif`,Xu=`#ifdef USE_TRANSMISSION
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
#endif`,qu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ku=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$u=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Zu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ju=`uniform sampler2D t2D;
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
}`,Ju=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qu=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ef=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nf=`#include <common>
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
}`,rf=`#if DEPTH_PACKING == 3200
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
}`,af=`#define DISTANCE
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
}`,sf=`#define DISTANCE
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
}`,of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cf=`uniform float scale;
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
}`,hf=`uniform vec3 diffuse;
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
}`,uf=`#include <common>
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
}`,ff=`uniform vec3 diffuse;
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
}`,df=`#define LAMBERT
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
}`,pf=`#define LAMBERT
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
}`,mf=`#define MATCAP
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
}`,gf=`#define MATCAP
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
}`,vf=`#define NORMAL
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
}`,_f=`#define NORMAL
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
}`,xf=`#define PHONG
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
}`,yf=`#define PHONG
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
}`,Mf=`#define STANDARD
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
}`,Sf=`#define STANDARD
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
}`,bf=`#define TOON
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
}`,Ef=`#define TOON
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
}`,wf=`uniform float size;
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
}`,Tf=`uniform vec3 diffuse;
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
}`,Af=`#include <common>
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
}`,Rf=`uniform vec3 color;
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
}`,Cf=`uniform float rotation;
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
}`,Pf=`uniform vec3 diffuse;
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
}`,Ne={alphahash_fragment:jc,alphahash_pars_fragment:Jc,alphamap_fragment:Qc,alphamap_pars_fragment:eh,alphatest_fragment:th,alphatest_pars_fragment:nh,aomap_fragment:ih,aomap_pars_fragment:rh,batching_pars_vertex:ah,batching_vertex:sh,begin_vertex:oh,beginnormal_vertex:lh,bsdfs:ch,iridescence_fragment:hh,bumpmap_pars_fragment:uh,clipping_planes_fragment:fh,clipping_planes_pars_fragment:dh,clipping_planes_pars_vertex:ph,clipping_planes_vertex:mh,color_fragment:gh,color_pars_fragment:vh,color_pars_vertex:_h,color_vertex:xh,common:yh,cube_uv_reflection_fragment:Mh,defaultnormal_vertex:Sh,displacementmap_pars_vertex:bh,displacementmap_vertex:Eh,emissivemap_fragment:wh,emissivemap_pars_fragment:Th,colorspace_fragment:Ah,colorspace_pars_fragment:Rh,envmap_fragment:Ch,envmap_common_pars_fragment:Ph,envmap_pars_fragment:Dh,envmap_pars_vertex:Lh,envmap_physical_pars_fragment:Gh,envmap_vertex:Ih,fog_vertex:Uh,fog_pars_vertex:Nh,fog_fragment:Fh,fog_pars_fragment:Oh,gradientmap_pars_fragment:kh,lightmap_pars_fragment:Bh,lights_lambert_fragment:zh,lights_lambert_pars_fragment:Vh,lights_pars_begin:Hh,lights_toon_fragment:Wh,lights_toon_pars_fragment:Xh,lights_phong_fragment:qh,lights_phong_pars_fragment:Yh,lights_physical_fragment:Kh,lights_physical_pars_fragment:$h,lights_fragment_begin:Zh,lights_fragment_maps:jh,lights_fragment_end:Jh,logdepthbuf_fragment:Qh,logdepthbuf_pars_fragment:eu,logdepthbuf_pars_vertex:tu,logdepthbuf_vertex:nu,map_fragment:iu,map_pars_fragment:ru,map_particle_fragment:au,map_particle_pars_fragment:su,metalnessmap_fragment:ou,metalnessmap_pars_fragment:lu,morphinstance_vertex:cu,morphcolor_vertex:hu,morphnormal_vertex:uu,morphtarget_pars_vertex:fu,morphtarget_vertex:du,normal_fragment_begin:pu,normal_fragment_maps:mu,normal_pars_fragment:gu,normal_pars_vertex:vu,normal_vertex:_u,normalmap_pars_fragment:xu,clearcoat_normal_fragment_begin:yu,clearcoat_normal_fragment_maps:Mu,clearcoat_pars_fragment:Su,iridescence_pars_fragment:bu,opaque_fragment:Eu,packing:wu,premultiplied_alpha_fragment:Tu,project_vertex:Au,dithering_fragment:Ru,dithering_pars_fragment:Cu,roughnessmap_fragment:Pu,roughnessmap_pars_fragment:Du,shadowmap_pars_fragment:Lu,shadowmap_pars_vertex:Iu,shadowmap_vertex:Uu,shadowmask_pars_fragment:Nu,skinbase_vertex:Fu,skinning_pars_vertex:Ou,skinning_vertex:ku,skinnormal_vertex:Bu,specularmap_fragment:zu,specularmap_pars_fragment:Vu,tonemapping_fragment:Hu,tonemapping_pars_fragment:Gu,transmission_fragment:Wu,transmission_pars_fragment:Xu,uv_pars_fragment:qu,uv_pars_vertex:Yu,uv_vertex:Ku,worldpos_vertex:$u,background_vert:Zu,background_frag:ju,backgroundCube_vert:Ju,backgroundCube_frag:Qu,cube_vert:ef,cube_frag:tf,depth_vert:nf,depth_frag:rf,distanceRGBA_vert:af,distanceRGBA_frag:sf,equirect_vert:of,equirect_frag:lf,linedashed_vert:cf,linedashed_frag:hf,meshbasic_vert:uf,meshbasic_frag:ff,meshlambert_vert:df,meshlambert_frag:pf,meshmatcap_vert:mf,meshmatcap_frag:gf,meshnormal_vert:vf,meshnormal_frag:_f,meshphong_vert:xf,meshphong_frag:yf,meshphysical_vert:Mf,meshphysical_frag:Sf,meshtoon_vert:bf,meshtoon_frag:Ef,points_vert:wf,points_frag:Tf,shadow_vert:Af,shadow_frag:Rf,sprite_vert:Cf,sprite_frag:Pf},re={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pe}},envmap:{envMap:{value:null},envMapRotation:{value:new Pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pe},normalScale:{value:new ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0},uvTransform:{value:new Pe}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}}},Wt={basic:{uniforms:mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:mt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:mt([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:mt([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:mt([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:mt([re.points,re.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:mt([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:mt([re.common,re.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:mt([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:mt([re.sprite,re.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pe}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:mt([re.common,re.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:mt([re.lights,re.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};Wt.physical={uniforms:mt([Wt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pe},clearcoatNormalScale:{value:new ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pe},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pe},transmissionSamplerSize:{value:new ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pe},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pe},anisotropyVector:{value:new ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pe}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const gr={r:0,b:0,g:0},Pn=new qt,Df=new rt;function Lf(i,e,t,n,r,a,s){const o=new Ye(0);let l=a===!0?0:1,c,h,p=null,m=0,f=null;function g(w){let b=w.isScene===!0?w.background:null;return b&&b.isTexture&&(b=(w.backgroundBlurriness>0?t:e).get(b)),b}function _(w){let b=!1;const M=g(w);M===null?u(o,l):M&&M.isColor&&(u(M,1),b=!0);const U=i.xr.getEnvironmentBlendMode();U==="additive"?n.buffers.color.setClear(0,0,0,1,s):U==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function d(w,b){const M=g(b);M&&(M.isCubeTexture||M.mapping===Or)?(h===void 0&&(h=new Bt(new Ti(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:bi(Wt.backgroundCube.uniforms),vertexShader:Wt.backgroundCube.vertexShader,fragmentShader:Wt.backgroundCube.fragmentShader,side:Mt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(U,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Pn.copy(b.backgroundRotation),Pn.x*=-1,Pn.y*=-1,Pn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Pn.y*=-1,Pn.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Df.makeRotationFromEuler(Pn)),h.material.toneMapped=Ge.getTransfer(M.colorSpace)!==Ze,(p!==M||m!==M.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,p=M,m=M.version,f=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Bt(new $i(2,2),new cn({name:"BackgroundMaterial",uniforms:bi(Wt.background.uniforms),vertexShader:Wt.background.vertexShader,fragmentShader:Wt.background.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Ge.getTransfer(M.colorSpace)!==Ze,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(p!==M||m!==M.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,p=M,m=M.version,f=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function u(w,b){w.getRGB(gr,Qo(i)),n.buffers.color.setClear(gr.r,gr.g,gr.b,b,s)}return{getClearColor:function(){return o},setClearColor:function(w,b=1){o.set(w),l=b,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,u(o,l)},render:_,addToRenderList:d}}function If(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=m(null);let a=r,s=!1;function o(y,R,W,z,X){let J=!1;const Y=p(z,W,R);a!==Y&&(a=Y,c(a.object)),J=f(y,z,W,X),J&&g(y,z,W,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(J||s)&&(s=!1,M(y,R,W,z),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function p(y,R,W){const z=W.wireframe===!0;let X=n[y.id];X===void 0&&(X={},n[y.id]=X);let J=X[R.id];J===void 0&&(J={},X[R.id]=J);let Y=J[z];return Y===void 0&&(Y=m(l()),J[z]=Y),Y}function m(y){const R=[],W=[],z=[];for(let X=0;X<t;X++)R[X]=0,W[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:W,attributeDivisors:z,object:y,attributes:{},index:null}}function f(y,R,W,z){const X=a.attributes,J=R.attributes;let Y=0;const ee=W.getAttributes();for(const H in ee)if(ee[H].location>=0){const fe=X[H];let Me=J[H];if(Me===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(Me=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(Me=y.instanceColor)),fe===void 0||fe.attribute!==Me||Me&&fe.data!==Me.data)return!0;Y++}return a.attributesNum!==Y||a.index!==z}function g(y,R,W,z){const X={},J=R.attributes;let Y=0;const ee=W.getAttributes();for(const H in ee)if(ee[H].location>=0){let fe=J[H];fe===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(fe=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(fe=y.instanceColor));const Me={};Me.attribute=fe,fe&&fe.data&&(Me.data=fe.data),X[H]=Me,Y++}a.attributes=X,a.attributesNum=Y,a.index=z}function _(){const y=a.newAttributes;for(let R=0,W=y.length;R<W;R++)y[R]=0}function d(y){u(y,0)}function u(y,R){const W=a.newAttributes,z=a.enabledAttributes,X=a.attributeDivisors;W[y]=1,z[y]===0&&(i.enableVertexAttribArray(y),z[y]=1),X[y]!==R&&(i.vertexAttribDivisor(y,R),X[y]=R)}function w(){const y=a.newAttributes,R=a.enabledAttributes;for(let W=0,z=R.length;W<z;W++)R[W]!==y[W]&&(i.disableVertexAttribArray(W),R[W]=0)}function b(y,R,W,z,X,J,Y){Y===!0?i.vertexAttribIPointer(y,R,W,X,J):i.vertexAttribPointer(y,R,W,z,X,J)}function M(y,R,W,z){_();const X=z.attributes,J=W.getAttributes(),Y=R.defaultAttributeValues;for(const ee in J){const H=J[ee];if(H.location>=0){let ae=X[ee];if(ae===void 0&&(ee==="instanceMatrix"&&y.instanceMatrix&&(ae=y.instanceMatrix),ee==="instanceColor"&&y.instanceColor&&(ae=y.instanceColor)),ae!==void 0){const fe=ae.normalized,Me=ae.itemSize,Ce=e.get(ae);if(Ce===void 0)continue;const V=Ce.buffer,F=Ce.type,q=Ce.bytesPerElement,Q=F===i.INT||F===i.UNSIGNED_INT||ae.gpuType===as;if(ae.isInterleavedBufferAttribute){const te=ae.data,le=te.stride,ve=ae.offset;if(te.isInstancedInterleavedBuffer){for(let pe=0;pe<H.locationSize;pe++)u(H.location+pe,te.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let pe=0;pe<H.locationSize;pe++)d(H.location+pe);i.bindBuffer(i.ARRAY_BUFFER,V);for(let pe=0;pe<H.locationSize;pe++)b(H.location+pe,Me/H.locationSize,F,fe,le*q,(ve+Me/H.locationSize*pe)*q,Q)}else{if(ae.isInstancedBufferAttribute){for(let te=0;te<H.locationSize;te++)u(H.location+te,ae.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let te=0;te<H.locationSize;te++)d(H.location+te);i.bindBuffer(i.ARRAY_BUFFER,V);for(let te=0;te<H.locationSize;te++)b(H.location+te,Me/H.locationSize,F,fe,Me*q,Me/H.locationSize*te*q,Q)}}else if(Y!==void 0){const fe=Y[ee];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(H.location,fe);break;case 3:i.vertexAttrib3fv(H.location,fe);break;case 4:i.vertexAttrib4fv(H.location,fe);break;default:i.vertexAttrib1fv(H.location,fe)}}}}w()}function U(){C();for(const y in n){const R=n[y];for(const W in R){const z=R[W];for(const X in z)h(z[X].object),delete z[X];delete R[W]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;const R=n[y.id];for(const W in R){const z=R[W];for(const X in z)h(z[X].object),delete z[X];delete R[W]}delete n[y.id]}function A(y){for(const R in n){const W=n[R];if(W[y.id]===void 0)continue;const z=W[y.id];for(const X in z)h(z[X].object),delete z[X];delete W[y.id]}}function C(){S(),s=!0,a!==r&&(a=r,c(a.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:S,dispose:U,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:d,disableUnusedAttributes:w}}function Uf(i,e,t){let n;function r(c){n=c}function a(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function s(c,h,p){p!==0&&(i.drawArraysInstanced(n,c,h,p),t.update(h,n,p))}function o(c,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,p);let f=0;for(let g=0;g<p;g++)f+=h[g];t.update(f,n,1)}function l(c,h,p,m){if(p===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)s(c[g],h[g],m[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,m,0,p);let g=0;for(let _=0;_<p;_++)g+=h[_]*m[_];t.update(g,n,1)}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Nf(i,e,t,n){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(A){return!(A!==kt&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Xt&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==an&&!C)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const p=t.logarithmicDepthBuffer===!0,m=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),d=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),U=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reverseDepthBuffer:m,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:d,maxAttributes:u,maxVertexUniforms:w,maxVaryings:b,maxFragmentUniforms:M,vertexTextures:U,maxSamples:T}}function Ff(i){const e=this;let t=null,n=0,r=!1,a=!1;const s=new In,o=new Pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,m){const f=p.length!==0||m||n!==0||r;return r=m,n=p.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(p,m){t=h(p,m,0)},this.setState=function(p,m,f){const g=p.clippingPlanes,_=p.clipIntersection,d=p.clipShadows,u=i.get(p);if(!r||g===null||g.length===0||a&&!d)a?h(null):c();else{const w=a?0:n,b=w*4;let M=u.clippingState||null;l.value=M,M=h(g,m,b,f);for(let U=0;U!==b;++U)M[U]=t[U];u.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(p,m,f,g){const _=p!==null?p.length:0;let d=null;if(_!==0){if(d=l.value,g!==!0||d===null){const u=f+_*4,w=m.matrixWorldInverse;o.getNormalMatrix(w),(d===null||d.length<u)&&(d=new Float32Array(u));for(let b=0,M=f;b!==_;++b,M+=4)s.copy(p[b]).applyMatrix4(w,o),s.normal.toArray(d,M),d[M+3]=s.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,d}}function Of(i){let e=new WeakMap;function t(s,o){return o===Ta?s.mapping=xi:o===Aa&&(s.mapping=yi),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===Ta||o===Aa)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new Yc(l.height);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",r),t(c.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}class kf extends el{constructor(e=-1,t=1,n=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-e,s=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,s=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const hi=4,js=[.125,.215,.35,.446,.526,.582],kn=20,la=new kf,Js=new Ye;let ca=null,ha=0,ua=0,fa=!1;const Un=(1+Math.sqrt(5))/2,ri=1/Un,Qs=[new N(-Un,ri,0),new N(Un,ri,0),new N(-ri,0,Un),new N(ri,0,Un),new N(0,Un,-ri),new N(0,Un,ri),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class eo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){ca=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),fa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,r,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=io(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=no(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ca,ha,ua),this._renderer.xr.enabled=fa,e.scissorTest=!1,vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xi||e.mapping===yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ca=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),fa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:qi,format:kt,colorSpace:Ei,depthBuffer:!1},r=to(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=to(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Bf(a)),this._blurMaterial=zf(a,e,t)}return r}_compileMaterial(e){const t=new Bt(this._lodPlanes[0],e);this._renderer.compile(t,la)}_sceneToCubeUV(e,t,n,r){const o=new Ct(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,p=h.autoClear,m=h.toneMapping;h.getClearColor(Js),h.toneMapping=Sn,h.autoClear=!1;const f=new ps({name:"PMREM.Background",side:Mt,depthWrite:!1,depthTest:!1}),g=new Bt(new Ti,f);let _=!1;const d=e.background;d?d.isColor&&(f.color.copy(d),e.background=null,_=!0):(f.color.copy(Js),_=!0);for(let u=0;u<6;u++){const w=u%3;w===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):w===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const b=this._cubeSize;vr(r,w*b,u>2?b:0,b,b),h.setRenderTarget(r),_&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=m,h.autoClear=p,e.background=d}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===xi||e.mapping===yi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=io()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=no());const a=r?this._cubemapMaterial:this._equirectMaterial,s=new Bt(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;vr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,la)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let a=1;a<r;a++){const s=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Qs[(r-a-1)%Qs.length];this._blur(e,a-1,a,s,o)}t.autoClear=n}_blur(e,t,n,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,r,"latitudinal",a),this._halfBlur(s,e,n,n,r,"longitudinal",a)}_halfBlur(e,t,n,r,a,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,p=new Bt(this._lodPlanes[r],c),m=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*kn-1),_=a/g,d=isFinite(a)?1+Math.floor(h*_):kn;d>kn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${kn}`);const u=[];let w=0;for(let A=0;A<kn;++A){const C=A/_,S=Math.exp(-C*C/2);u.push(S),A===0?w+=S:A<d&&(w+=2*S)}for(let A=0;A<u.length;A++)u[A]=u[A]/w;m.envMap.value=e.texture,m.samples.value=d,m.weights.value=u,m.latitudinal.value=s==="latitudinal",o&&(m.poleAxis.value=o);const{_lodMax:b}=this;m.dTheta.value=g,m.mipInt.value=b-n;const M=this._sizeLods[r],U=3*M*(r>b-hi?r-b+hi:0),T=4*(this._cubeSize-M);vr(t,U,T,3*M,2*M),l.setRenderTarget(t),l.render(p,la)}}function Bf(i){const e=[],t=[],n=[];let r=i;const a=i-hi+1+js.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);t.push(o);let l=1/o;s>i-hi?l=js[s-i+hi-1]:s===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,p=1+c,m=[h,h,p,h,p,p,h,h,p,p,h,p],f=6,g=6,_=3,d=2,u=1,w=new Float32Array(_*g*f),b=new Float32Array(d*g*f),M=new Float32Array(u*g*f);for(let T=0;T<f;T++){const A=T%3*2/3-1,C=T>2?0:-1,S=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];w.set(S,_*g*T),b.set(m,d*g*T);const y=[T,T,T,T,T,T];M.set(y,u*g*T)}const U=new En;U.setAttribute("position",new Vt(w,_)),U.setAttribute("uv",new Vt(b,d)),U.setAttribute("faceIndex",new Vt(M,u)),e.push(U),r>hi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function to(i,e,t){const n=new Hn(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function vr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function zf(i,e,t){const n=new Float32Array(kn),r=new N(0,1,0);return new cn({name:"SphericalGaussianBlur",defines:{n:kn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ms(),fragmentShader:`

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
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function no(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ms(),fragmentShader:`

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
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function io(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ms(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function ms(){return`

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
	`}function Vf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ta||l===Aa,h=l===xi||l===yi;if(c||h){let p=e.get(o);const m=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new eo(i)),p=c?t.fromEquirectangular(o,p):t.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),p.texture;if(p!==void 0)return p.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&r(f)?(t===null&&(t=new eo(i)),p=c?t.fromEquirectangular(o):t.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),o.addEventListener("dispose",a),p.texture):null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Hf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Oi("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Gf(i,e,t,n){const r={},a=new WeakMap;function s(p){const m=p.target;m.index!==null&&e.remove(m.index);for(const g in m.attributes)e.remove(m.attributes[g]);for(const g in m.morphAttributes){const _=m.morphAttributes[g];for(let d=0,u=_.length;d<u;d++)e.remove(_[d])}m.removeEventListener("dispose",s),delete r[m.id];const f=a.get(m);f&&(e.remove(f),a.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(p,m){return r[m.id]===!0||(m.addEventListener("dispose",s),r[m.id]=!0,t.memory.geometries++),m}function l(p){const m=p.attributes;for(const g in m)e.update(m[g],i.ARRAY_BUFFER);const f=p.morphAttributes;for(const g in f){const _=f[g];for(let d=0,u=_.length;d<u;d++)e.update(_[d],i.ARRAY_BUFFER)}}function c(p){const m=[],f=p.index,g=p.attributes.position;let _=0;if(f!==null){const w=f.array;_=f.version;for(let b=0,M=w.length;b<M;b+=3){const U=w[b+0],T=w[b+1],A=w[b+2];m.push(U,T,T,A,A,U)}}else if(g!==void 0){const w=g.array;_=g.version;for(let b=0,M=w.length/3-1;b<M;b+=3){const U=b+0,T=b+1,A=b+2;m.push(U,T,T,A,A,U)}}else return;const d=new(Xo(m)?Jo:jo)(m,1);d.version=_;const u=a.get(p);u&&e.remove(u),a.set(p,d)}function h(p){const m=a.get(p);if(m){const f=p.index;f!==null&&m.version<f.version&&c(p)}else c(p);return a.get(p)}return{get:o,update:l,getWireframeAttribute:h}}function Wf(i,e,t){let n;function r(m){n=m}let a,s;function o(m){a=m.type,s=m.bytesPerElement}function l(m,f){i.drawElements(n,f,a,m*s),t.update(f,n,1)}function c(m,f,g){g!==0&&(i.drawElementsInstanced(n,f,a,m*s,g),t.update(f,n,g))}function h(m,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,a,m,0,g);let d=0;for(let u=0;u<g;u++)d+=f[u];t.update(d,n,1)}function p(m,f,g,_){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let u=0;u<m.length;u++)c(m[u]/s,f[u],_[u]);else{d.multiDrawElementsInstancedWEBGL(n,f,0,a,m,0,_,0,g);let u=0;for(let w=0;w<g;w++)u+=f[w]*_[w];t.update(u,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function Xf(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function qf(i,e,t){const n=new WeakMap,r=new Qe;function a(s,o,l){const c=s.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let m=n.get(o);if(m===void 0||m.count!==p){let S=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",S)};m!==void 0&&m.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let b=0;f===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let M=o.attributes.position.count*b,U=1;M>e.maxTextureSize&&(U=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const T=new Float32Array(M*U*4*p),A=new Yo(T,M,U,p);A.type=an,A.needsUpdate=!0;const C=b*4;for(let y=0;y<p;y++){const R=d[y],W=u[y],z=w[y],X=M*U*4*y;for(let J=0;J<R.count;J++){const Y=J*C;f===!0&&(r.fromBufferAttribute(R,J),T[X+Y+0]=r.x,T[X+Y+1]=r.y,T[X+Y+2]=r.z,T[X+Y+3]=0),g===!0&&(r.fromBufferAttribute(W,J),T[X+Y+4]=r.x,T[X+Y+5]=r.y,T[X+Y+6]=r.z,T[X+Y+7]=0),_===!0&&(r.fromBufferAttribute(z,J),T[X+Y+8]=r.x,T[X+Y+9]=r.y,T[X+Y+10]=r.z,T[X+Y+11]=z.itemSize===4?r.w:1)}}m={count:p,texture:A,size:new ke(M,U)},n.set(o,m),o.addEventListener("dispose",S)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}return{update:a}}function Yf(i,e,t,n){let r=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,p=e.get(l,h);if(r.get(p)!==c&&(e.update(p),r.set(p,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const m=l.skeleton;r.get(m)!==c&&(m.update(),r.set(m,c))}return p}function s(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:s}}class rl extends _t{constructor(e,t,n,r,a,s,o,l,c,h=pi){if(h!==pi&&h!==Si)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===pi&&(n=Vn),n===void 0&&h===Si&&(n=Mi),super(null,r,a,s,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:zt,this.minFilter=l!==void 0?l:zt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const al=new _t,ro=new rl(1,1),sl=new Yo,ol=new Ko,ll=new tl,ao=[],so=[],oo=new Float32Array(16),lo=new Float32Array(9),co=new Float32Array(4);function Ai(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let a=ao[r];if(a===void 0&&(a=new Float32Array(r),ao[r]=a),e!==0){n.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(a,o)}return a}function lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function ct(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=so[e];t===void 0&&(t=new Int32Array(e),so[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Kf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function $f(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;i.uniform2fv(this.addr,e),ct(t,e)}}function Zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(lt(t,e))return;i.uniform3fv(this.addr,e),ct(t,e)}}function jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;i.uniform4fv(this.addr,e),ct(t,e)}}function Jf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;co.set(n),i.uniformMatrix2fv(this.addr,!1,co),ct(t,n)}}function Qf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;lo.set(n),i.uniformMatrix3fv(this.addr,!1,lo),ct(t,n)}}function ed(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;oo.set(n),i.uniformMatrix4fv(this.addr,!1,oo),ct(t,n)}}function td(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function nd(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;i.uniform2iv(this.addr,e),ct(t,e)}}function id(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;i.uniform3iv(this.addr,e),ct(t,e)}}function rd(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;i.uniform4iv(this.addr,e),ct(t,e)}}function ad(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function sd(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;i.uniform2uiv(this.addr,e),ct(t,e)}}function od(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;i.uniform3uiv(this.addr,e),ct(t,e)}}function ld(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;i.uniform4uiv(this.addr,e),ct(t,e)}}function cd(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?(ro.compareFunction=Wo,a=ro):a=al,t.setTexture2D(e||a,r)}function hd(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||ol,r)}function ud(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||ll,r)}function fd(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||sl,r)}function dd(i){switch(i){case 5126:return Kf;case 35664:return $f;case 35665:return Zf;case 35666:return jf;case 35674:return Jf;case 35675:return Qf;case 35676:return ed;case 5124:case 35670:return td;case 35667:case 35671:return nd;case 35668:case 35672:return id;case 35669:case 35673:return rd;case 5125:return ad;case 36294:return sd;case 36295:return od;case 36296:return ld;case 35678:case 36198:case 36298:case 36306:case 35682:return cd;case 35679:case 36299:case 36307:return hd;case 35680:case 36300:case 36308:case 36293:return ud;case 36289:case 36303:case 36311:case 36292:return fd}}function pd(i,e){i.uniform1fv(this.addr,e)}function md(i,e){const t=Ai(e,this.size,2);i.uniform2fv(this.addr,t)}function gd(i,e){const t=Ai(e,this.size,3);i.uniform3fv(this.addr,t)}function vd(i,e){const t=Ai(e,this.size,4);i.uniform4fv(this.addr,t)}function _d(i,e){const t=Ai(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function xd(i,e){const t=Ai(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function yd(i,e){const t=Ai(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Md(i,e){i.uniform1iv(this.addr,e)}function Sd(i,e){i.uniform2iv(this.addr,e)}function bd(i,e){i.uniform3iv(this.addr,e)}function Ed(i,e){i.uniform4iv(this.addr,e)}function wd(i,e){i.uniform1uiv(this.addr,e)}function Td(i,e){i.uniform2uiv(this.addr,e)}function Ad(i,e){i.uniform3uiv(this.addr,e)}function Rd(i,e){i.uniform4uiv(this.addr,e)}function Cd(i,e,t){const n=this.cache,r=e.length,a=Br(t,r);lt(n,a)||(i.uniform1iv(this.addr,a),ct(n,a));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||al,a[s])}function Pd(i,e,t){const n=this.cache,r=e.length,a=Br(t,r);lt(n,a)||(i.uniform1iv(this.addr,a),ct(n,a));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||ol,a[s])}function Dd(i,e,t){const n=this.cache,r=e.length,a=Br(t,r);lt(n,a)||(i.uniform1iv(this.addr,a),ct(n,a));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||ll,a[s])}function Ld(i,e,t){const n=this.cache,r=e.length,a=Br(t,r);lt(n,a)||(i.uniform1iv(this.addr,a),ct(n,a));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||sl,a[s])}function Id(i){switch(i){case 5126:return pd;case 35664:return md;case 35665:return gd;case 35666:return vd;case 35674:return _d;case 35675:return xd;case 35676:return yd;case 5124:case 35670:return Md;case 35667:case 35671:return Sd;case 35668:case 35672:return bd;case 35669:case 35673:return Ed;case 5125:return wd;case 36294:return Td;case 36295:return Ad;case 36296:return Rd;case 35678:case 36198:case 36298:case 36306:case 35682:return Cd;case 35679:case 36299:case 36307:return Pd;case 35680:case 36300:case 36308:case 36293:return Dd;case 36289:case 36303:case 36311:case 36292:return Ld}}class Ud{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=dd(t.type)}}class Nd{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Id(t.type)}}class Fd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,t[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function ho(i,e){i.seq.push(e),i.map[e.id]=e}function Od(i,e,t){const n=i.name,r=n.length;for(da.lastIndex=0;;){const a=da.exec(n),s=da.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){ho(t,c===void 0?new Ud(o,i,e):new Nd(o,i,e));break}else{let p=t.map[o];p===void 0&&(p=new Fd(o),ho(t,p)),t=p}}}class Pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const a=e.getActiveUniform(t,r),s=e.getUniformLocation(t,a.name);Od(a,s,this)}}setValue(e,t,n,r){const a=this.map[t];a!==void 0&&a.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let a=0,s=t.length;a!==s;++a){const o=t[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in t&&n.push(s)}return n}}function uo(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const kd=37297;let Bd=0;function zd(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let s=r;s<a;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}const fo=new Pe;function Vd(i){Ge._getMatrix(fo,Ge.workingColorSpace,i);const e=`mat3( ${fo.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(i)){case kr:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function po(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const s=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+zd(i.getShaderSource(e),s)}else return r}function Hd(i,e){const t=Vd(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Gd(i,e){let t;switch(e){case Vl:t="Linear";break;case Hl:t="Reinhard";break;case Gl:t="Cineon";break;case Wl:t="ACESFilmic";break;case ql:t="AgX";break;case Yl:t="Neutral";break;case Xl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const _r=new N;function Wd(){Ge.getLuminanceCoefficients(_r);const i=_r.x.toFixed(4),e=_r.y.toFixed(4),t=_r.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xd(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ki).join(`
`)}function qd(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Yd(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(e,r),s=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[s]={type:a.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function ki(i){return i!==""}function mo(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function go(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Kd=/^[ \t]*#include +<([\w\d./]+)>/gm;function ns(i){return i.replace(Kd,Zd)}const $d=new Map;function Zd(i,e){let t=Ne[e];if(t===void 0){const n=$d.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ns(t)}const jd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vo(i){return i.replace(jd,Jd)}function Jd(i,e,t,n){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function _o(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Qd(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Lo?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===yl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===tn&&(e="SHADOWMAP_TYPE_VSM"),e}function ep(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case xi:case yi:e="ENVMAP_TYPE_CUBE";break;case Or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tp(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case yi:e="ENVMAP_MODE_REFRACTION";break}return e}function np(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Io:e="ENVMAP_BLENDING_MULTIPLY";break;case Bl:e="ENVMAP_BLENDING_MIX";break;case zl:e="ENVMAP_BLENDING_ADD";break}return e}function ip(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function rp(i,e,t,n){const r=i.getContext(),a=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=Qd(t),c=ep(t),h=tp(t),p=np(t),m=ip(t),f=Xd(t),g=qd(a),_=r.createProgram();let d,u,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ki).join(`
`),d.length>0&&(d+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ki).join(`
`),u.length>0&&(u+=`
`)):(d=[_o(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ki).join(`
`),u=[_o(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+p:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Sn?"#define TONE_MAPPING":"",t.toneMapping!==Sn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==Sn?Gd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,Hd("linearToOutputTexel",t.outputColorSpace),Wd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ki).join(`
`)),s=ns(s),s=mo(s,t),s=go(s,t),o=ns(o),o=mo(o,t),o=go(o,t),s=vo(s),o=vo(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,d=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,u=["#define varying in",t.glslVersion===Cs?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Cs?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const b=w+d+s,M=w+u+o,U=uo(r,r.VERTEX_SHADER,b),T=uo(r,r.FRAGMENT_SHADER,M);r.attachShader(_,U),r.attachShader(_,T),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(R){if(i.debug.checkShaderErrors){const W=r.getProgramInfoLog(_).trim(),z=r.getShaderInfoLog(U).trim(),X=r.getShaderInfoLog(T).trim();let J=!0,Y=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,U,T);else{const ee=po(r,U,"vertex"),H=po(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+W+`
`+ee+`
`+H)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(z===""||X==="")&&(Y=!1);Y&&(R.diagnostics={runnable:J,programLog:W,vertexShader:{log:z,prefix:d},fragmentShader:{log:X,prefix:u}})}r.deleteShader(U),r.deleteShader(T),C=new Pr(r,_),S=Yd(r,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,kd)),y},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Bd++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=U,this.fragmentShader=T,this}let ap=0;class sp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new op(e),t.set(e,n)),n}}class op{constructor(e){this.id=ap++,this.code=e,this.usedTimes=0}}function lp(i,e,t,n,r,a,s){const o=new $o,l=new sp,c=new Set,h=[],p=r.logarithmicDepthBuffer,m=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function d(S,y,R,W,z){const X=W.fog,J=z.geometry,Y=S.isMeshStandardMaterial?W.environment:null,ee=(S.isMeshStandardMaterial?t:e).get(S.envMap||Y),H=ee&&ee.mapping===Or?ee.image.height:null,ae=g[S.type];S.precision!==null&&(f=r.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const fe=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Me=fe!==void 0?fe.length:0;let Ce=0;J.morphAttributes.position!==void 0&&(Ce=1),J.morphAttributes.normal!==void 0&&(Ce=2),J.morphAttributes.color!==void 0&&(Ce=3);let V,F,q,Q;if(ae){const Ke=Wt[ae];V=Ke.vertexShader,F=Ke.fragmentShader}else V=S.vertexShader,F=S.fragmentShader,l.update(S),q=l.getVertexShaderID(S),Q=l.getFragmentShaderID(S);const te=i.getRenderTarget(),le=i.state.buffers.depth.getReversed(),ve=z.isInstancedMesh===!0,pe=z.isBatchedMesh===!0,Ie=!!S.map,Fe=!!S.matcap,Ve=!!ee,P=!!S.aoMap,ot=!!S.lightMap,Oe=!!S.bumpMap,Be=!!S.normalMap,we=!!S.displacementMap,et=!!S.emissiveMap,Ee=!!S.metalnessMap,E=!!S.roughnessMap,v=S.anisotropy>0,O=S.clearcoat>0,$=S.dispersion>0,j=S.iridescence>0,K=S.sheen>0,Se=S.transmission>0,oe=v&&!!S.anisotropyMap,de=O&&!!S.clearcoatMap,He=O&&!!S.clearcoatNormalMap,ne=O&&!!S.clearcoatRoughnessMap,me=j&&!!S.iridescenceMap,Te=j&&!!S.iridescenceThicknessMap,Ae=K&&!!S.sheenColorMap,ge=K&&!!S.sheenRoughnessMap,ze=!!S.specularMap,Ue=!!S.specularColorMap,je=!!S.specularIntensityMap,D=Se&&!!S.transmissionMap,se=Se&&!!S.thicknessMap,G=!!S.gradientMap,Z=!!S.alphaMap,ue=S.alphaTest>0,ce=!!S.alphaHash,De=!!S.extensions;let it=Sn;S.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(it=i.toneMapping);const ut={shaderID:ae,shaderType:S.type,shaderName:S.name,vertexShader:V,fragmentShader:F,defines:S.defines,customVertexShaderID:q,customFragmentShaderID:Q,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:pe,batchingColor:pe&&z._colorsTexture!==null,instancing:ve,instancingColor:ve&&z.instanceColor!==null,instancingMorph:ve&&z.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ei,alphaToCoverage:!!S.alphaToCoverage,map:Ie,matcap:Fe,envMap:Ve,envMapMode:Ve&&ee.mapping,envMapCubeUVHeight:H,aoMap:P,lightMap:ot,bumpMap:Oe,normalMap:Be,displacementMap:m&&we,emissiveMap:et,normalMapObjectSpace:Be&&S.normalMapType===Jl,normalMapTangentSpace:Be&&S.normalMapType===jl,metalnessMap:Ee,roughnessMap:E,anisotropy:v,anisotropyMap:oe,clearcoat:O,clearcoatMap:de,clearcoatNormalMap:He,clearcoatRoughnessMap:ne,dispersion:$,iridescence:j,iridescenceMap:me,iridescenceThicknessMap:Te,sheen:K,sheenColorMap:Ae,sheenRoughnessMap:ge,specularMap:ze,specularColorMap:Ue,specularIntensityMap:je,transmission:Se,transmissionMap:D,thicknessMap:se,gradientMap:G,opaque:S.transparent===!1&&S.blending===di&&S.alphaToCoverage===!1,alphaMap:Z,alphaTest:ue,alphaHash:ce,combine:S.combine,mapUv:Ie&&_(S.map.channel),aoMapUv:P&&_(S.aoMap.channel),lightMapUv:ot&&_(S.lightMap.channel),bumpMapUv:Oe&&_(S.bumpMap.channel),normalMapUv:Be&&_(S.normalMap.channel),displacementMapUv:we&&_(S.displacementMap.channel),emissiveMapUv:et&&_(S.emissiveMap.channel),metalnessMapUv:Ee&&_(S.metalnessMap.channel),roughnessMapUv:E&&_(S.roughnessMap.channel),anisotropyMapUv:oe&&_(S.anisotropyMap.channel),clearcoatMapUv:de&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:He&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:ge&&_(S.sheenRoughnessMap.channel),specularMapUv:ze&&_(S.specularMap.channel),specularColorMapUv:Ue&&_(S.specularColorMap.channel),specularIntensityMapUv:je&&_(S.specularIntensityMap.channel),transmissionMapUv:D&&_(S.transmissionMap.channel),thicknessMapUv:se&&_(S.thicknessMap.channel),alphaMapUv:Z&&_(S.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Be||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!J.attributes.uv&&(Ie||Z),fog:!!X,useFog:S.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:le,skinning:z.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:Ce,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,decodeVideoTexture:Ie&&S.map.isVideoTexture===!0&&Ge.getTransfer(S.map.colorSpace)===Ze,decodeVideoTextureEmissive:et&&S.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(S.emissiveMap.colorSpace)===Ze,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===rn,flipSided:S.side===Mt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:De&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&S.extensions.multiDraw===!0||pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ut.vertexUv1s=c.has(1),ut.vertexUv2s=c.has(2),ut.vertexUv3s=c.has(3),c.clear(),ut}function u(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)y.push(R),y.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(w(y,S),b(y,S),y.push(i.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function w(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function b(S,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),S.push(o.mask)}function M(S){const y=g[S.type];let R;if(y){const W=Wt[y];R=Gc.clone(W.uniforms)}else R=S.uniforms;return R}function U(S,y){let R;for(let W=0,z=h.length;W<z;W++){const X=h[W];if(X.cacheKey===y){R=X,++R.usedTimes;break}}return R===void 0&&(R=new rp(i,y,S,a),h.push(R)),R}function T(S){if(--S.usedTimes===0){const y=h.indexOf(S);h[y]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function C(){l.dispose()}return{getParameters:d,getProgramCacheKey:u,getUniforms:M,acquireProgram:U,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:C}}function cp(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function r(s,o,l){i.get(s)[o]=l}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:a}}function hp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function xo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function yo(){const i=[];let e=0;const t=[],n=[],r=[];function a(){e=0,t.length=0,n.length=0,r.length=0}function s(p,m,f,g,_,d){let u=i[e];return u===void 0?(u={id:p.id,object:p,geometry:m,material:f,groupOrder:g,renderOrder:p.renderOrder,z:_,group:d},i[e]=u):(u.id=p.id,u.object=p,u.geometry=m,u.material=f,u.groupOrder=g,u.renderOrder=p.renderOrder,u.z=_,u.group=d),e++,u}function o(p,m,f,g,_,d){const u=s(p,m,f,g,_,d);f.transmission>0?n.push(u):f.transparent===!0?r.push(u):t.push(u)}function l(p,m,f,g,_,d){const u=s(p,m,f,g,_,d);f.transmission>0?n.unshift(u):f.transparent===!0?r.unshift(u):t.unshift(u)}function c(p,m){t.length>1&&t.sort(p||hp),n.length>1&&n.sort(m||xo),r.length>1&&r.sort(m||xo)}function h(){for(let p=e,m=i.length;p<m;p++){const f=i[p];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:r,init:a,push:o,unshift:l,finish:h,sort:c}}function up(){let i=new WeakMap;function e(n,r){const a=i.get(n);let s;return a===void 0?(s=new yo,i.set(n,[s])):r>=a.length?(s=new yo,a.push(s)):s=a[r],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function fp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Ye};break;case"SpotLight":t={position:new N,direction:new N,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function dp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let pp=0;function mp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function gp(i){const e=new fp,t=dp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const r=new N,a=new rt,s=new rt;function o(c){let h=0,p=0,m=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,d=0,u=0,w=0,b=0,M=0,U=0,T=0,A=0;c.sort(mp);for(let S=0,y=c.length;S<y;S++){const R=c[S],W=R.color,z=R.intensity,X=R.distance,J=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=W.r*z,p+=W.g*z,m+=W.b*z;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(R.sh.coefficients[Y],z);A++}else if(R.isDirectionalLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const ee=R.shadow,H=t.get(R);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=J,n.directionalShadowMatrix[f]=R.shadow.matrix,w++}n.directional[f]=Y,f++}else if(R.isSpotLight){const Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(W).multiplyScalar(z),Y.distance=X,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,n.spot[_]=Y;const ee=R.shadow;if(R.map&&(n.spotLightMap[U]=R.map,U++,ee.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[_]=ee.matrix,R.castShadow){const H=t.get(R);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=J,M++}_++}else if(R.isRectAreaLight){const Y=e.get(R);Y.color.copy(W).multiplyScalar(z),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),n.rectArea[d]=Y,d++}else if(R.isPointLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){const ee=R.shadow,H=t.get(R);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,H.shadowCameraNear=ee.camera.near,H.shadowCameraFar=ee.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=J,n.pointShadowMatrix[g]=R.shadow.matrix,b++}n.point[g]=Y,g++}else if(R.isHemisphereLight){const Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(z),Y.groundColor.copy(R.groundColor).multiplyScalar(z),n.hemi[u]=Y,u++}}d>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=re.LTC_FLOAT_1,n.rectAreaLTC2=re.LTC_FLOAT_2):(n.rectAreaLTC1=re.LTC_HALF_1,n.rectAreaLTC2=re.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=p,n.ambient[2]=m;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==d||C.hemiLength!==u||C.numDirectionalShadows!==w||C.numPointShadows!==b||C.numSpotShadows!==M||C.numSpotMaps!==U||C.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=d,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=M+U-T,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=d,C.hemiLength=u,C.numDirectionalShadows=w,C.numPointShadows=b,C.numSpotShadows=M,C.numSpotMaps=U,C.numLightProbes=A,n.version=pp++)}function l(c,h){let p=0,m=0,f=0,g=0,_=0;const d=h.matrixWorldInverse;for(let u=0,w=c.length;u<w;u++){const b=c[u];if(b.isDirectionalLight){const M=n.directional[p];M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(d),p++}else if(b.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(d),M.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(d),f++}else if(b.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(d),s.identity(),a.copy(b.matrixWorld),a.premultiply(d),s.extractRotation(a),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(s),M.halfHeight.applyMatrix4(s),g++}else if(b.isPointLight){const M=n.point[m];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(d),m++}else if(b.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(d),_++}}}return{setup:o,setupView:l,state:n}}function Mo(i){const e=new gp(i),t=[],n=[];function r(h){c.camera=h,t.length=0,n.length=0}function a(h){t.push(h)}function s(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:s}}function vp(i){let e=new WeakMap;function t(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new Mo(i),e.set(r,[o])):a>=s.length?(o=new Mo(i),s.push(o)):o=s[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class _p extends Ki{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=$l,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class xp extends Ki{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const yp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mp=`uniform sampler2D shadow_pass;
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
}`;function Sp(i,e,t){let n=new nl;const r=new ke,a=new ke,s=new Qe,o=new _p({depthPacking:Zl}),l=new xp,c={},h=t.maxTextureSize,p={[bn]:Mt,[Mt]:bn,[rn]:rn},m=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ke},radius:{value:4}},vertexShader:yp,fragmentShader:Mp}),f=m.clone();f.defines.HORIZONTAL_PASS=1;const g=new En;g.setAttribute("position",new Vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Bt(g,m),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lo;let u=this.type;this.render=function(T,A,C){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||T.length===0)return;const S=i.getRenderTarget(),y=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),W=i.state;W.setBlending(Mn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const z=u!==tn&&this.type===tn,X=u===tn&&this.type!==tn;for(let J=0,Y=T.length;J<Y;J++){const ee=T[J],H=ee.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const ae=H.getFrameExtents();if(r.multiply(ae),a.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(a.x=Math.floor(h/ae.x),r.x=a.x*ae.x,H.mapSize.x=a.x),r.y>h&&(a.y=Math.floor(h/ae.y),r.y=a.y*ae.y,H.mapSize.y=a.y)),H.map===null||z===!0||X===!0){const Me=this.type!==tn?{minFilter:zt,magFilter:zt}:{};H.map!==null&&H.map.dispose(),H.map=new Hn(r.x,r.y,Me),H.map.texture.name=ee.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const fe=H.getViewportCount();for(let Me=0;Me<fe;Me++){const Ce=H.getViewport(Me);s.set(a.x*Ce.x,a.y*Ce.y,a.x*Ce.z,a.y*Ce.w),W.viewport(s),H.updateMatrices(ee,Me),n=H.getFrustum(),M(A,C,H.camera,ee,this.type)}H.isPointLightShadow!==!0&&this.type===tn&&w(H,C),H.needsUpdate=!1}u=this.type,d.needsUpdate=!1,i.setRenderTarget(S,y,R)};function w(T,A){const C=e.update(_);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Hn(r.x,r.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,C,m,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,C,f,_,null)}function b(T,A,C,S){let y=null;const R=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)y=R;else if(y=C.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const W=y.uuid,z=A.uuid;let X=c[W];X===void 0&&(X={},c[W]=X);let J=X[z];J===void 0&&(J=y.clone(),X[z]=J,A.addEventListener("dispose",U)),y=J}if(y.visible=A.visible,y.wireframe=A.wireframe,S===tn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:p[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const W=i.properties.get(y);W.light=C}return y}function M(T,A,C,S,y){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===tn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const z=e.update(T),X=T.material;if(Array.isArray(X)){const J=z.groups;for(let Y=0,ee=J.length;Y<ee;Y++){const H=J[Y],ae=X[H.materialIndex];if(ae&&ae.visible){const fe=b(T,ae,S,y);T.onBeforeShadow(i,T,A,C,z,fe,H),i.renderBufferDirect(C,null,z,fe,T,H),T.onAfterShadow(i,T,A,C,z,fe,H)}}}else if(X.visible){const J=b(T,X,S,y);T.onBeforeShadow(i,T,A,C,z,J,null),i.renderBufferDirect(C,null,z,J,T,null),T.onAfterShadow(i,T,A,C,z,J,null)}}const W=T.children;for(let z=0,X=W.length;z<X;z++)M(W[z],A,C,S,y)}function U(T){T.target.removeEventListener("dispose",U);for(const C in c){const S=c[C],y=T.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const bp={[xa]:ya,[Ma]:Ea,[Sa]:wa,[_i]:ba,[ya]:xa,[Ea]:Ma,[wa]:Sa,[ba]:_i};function Ep(i,e){function t(){let D=!1;const se=new Qe;let G=null;const Z=new Qe(0,0,0,0);return{setMask:function(ue){G!==ue&&!D&&(i.colorMask(ue,ue,ue,ue),G=ue)},setLocked:function(ue){D=ue},setClear:function(ue,ce,De,it,ut){ut===!0&&(ue*=it,ce*=it,De*=it),se.set(ue,ce,De,it),Z.equals(se)===!1&&(i.clearColor(ue,ce,De,it),Z.copy(se))},reset:function(){D=!1,G=null,Z.set(-1,0,0,0)}}}function n(){let D=!1,se=!1,G=null,Z=null,ue=null;return{setReversed:function(ce){if(se!==ce){const De=e.get("EXT_clip_control");se?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT);const it=ue;ue=null,this.setClear(it)}se=ce},getReversed:function(){return se},setTest:function(ce){ce?te(i.DEPTH_TEST):le(i.DEPTH_TEST)},setMask:function(ce){G!==ce&&!D&&(i.depthMask(ce),G=ce)},setFunc:function(ce){if(se&&(ce=bp[ce]),Z!==ce){switch(ce){case xa:i.depthFunc(i.NEVER);break;case ya:i.depthFunc(i.ALWAYS);break;case Ma:i.depthFunc(i.LESS);break;case _i:i.depthFunc(i.LEQUAL);break;case Sa:i.depthFunc(i.EQUAL);break;case ba:i.depthFunc(i.GEQUAL);break;case Ea:i.depthFunc(i.GREATER);break;case wa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Z=ce}},setLocked:function(ce){D=ce},setClear:function(ce){ue!==ce&&(se&&(ce=1-ce),i.clearDepth(ce),ue=ce)},reset:function(){D=!1,G=null,Z=null,ue=null,se=!1}}}function r(){let D=!1,se=null,G=null,Z=null,ue=null,ce=null,De=null,it=null,ut=null;return{setTest:function(Ke){D||(Ke?te(i.STENCIL_TEST):le(i.STENCIL_TEST))},setMask:function(Ke){se!==Ke&&!D&&(i.stencilMask(Ke),se=Ke)},setFunc:function(Ke,Dt,Yt){(G!==Ke||Z!==Dt||ue!==Yt)&&(i.stencilFunc(Ke,Dt,Yt),G=Ke,Z=Dt,ue=Yt)},setOp:function(Ke,Dt,Yt){(ce!==Ke||De!==Dt||it!==Yt)&&(i.stencilOp(Ke,Dt,Yt),ce=Ke,De=Dt,it=Yt)},setLocked:function(Ke){D=Ke},setClear:function(Ke){ut!==Ke&&(i.clearStencil(Ke),ut=Ke)},reset:function(){D=!1,se=null,G=null,Z=null,ue=null,ce=null,De=null,it=null,ut=null}}}const a=new t,s=new n,o=new r,l=new WeakMap,c=new WeakMap;let h={},p={},m=new WeakMap,f=[],g=null,_=!1,d=null,u=null,w=null,b=null,M=null,U=null,T=null,A=new Ye(0,0,0),C=0,S=!1,y=null,R=null,W=null,z=null,X=null;const J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,ee=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(H)[1]),Y=ee>=1):H.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),Y=ee>=2);let ae=null,fe={};const Me=i.getParameter(i.SCISSOR_BOX),Ce=i.getParameter(i.VIEWPORT),V=new Qe().fromArray(Me),F=new Qe().fromArray(Ce);function q(D,se,G,Z){const ue=new Uint8Array(4),ce=i.createTexture();i.bindTexture(D,ce),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<G;De++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,Z,0,i.RGBA,i.UNSIGNED_BYTE,ue):i.texImage2D(se+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ue);return ce}const Q={};Q[i.TEXTURE_2D]=q(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),te(i.DEPTH_TEST),s.setFunc(_i),Oe(!1),Be(Es),te(i.CULL_FACE),P(Mn);function te(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function le(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function ve(D,se){return p[D]!==se?(i.bindFramebuffer(D,se),p[D]=se,D===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=se),D===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=se),!0):!1}function pe(D,se){let G=f,Z=!1;if(D){G=m.get(se),G===void 0&&(G=[],m.set(se,G));const ue=D.textures;if(G.length!==ue.length||G[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,De=ue.length;ce<De;ce++)G[ce]=i.COLOR_ATTACHMENT0+ce;G.length=ue.length,Z=!0}}else G[0]!==i.BACK&&(G[0]=i.BACK,Z=!0);Z&&i.drawBuffers(G)}function Ie(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Fe={[On]:i.FUNC_ADD,[Sl]:i.FUNC_SUBTRACT,[bl]:i.FUNC_REVERSE_SUBTRACT};Fe[El]=i.MIN,Fe[wl]=i.MAX;const Ve={[Tl]:i.ZERO,[Al]:i.ONE,[Rl]:i.SRC_COLOR,[va]:i.SRC_ALPHA,[Ul]:i.SRC_ALPHA_SATURATE,[Ll]:i.DST_COLOR,[Pl]:i.DST_ALPHA,[Cl]:i.ONE_MINUS_SRC_COLOR,[_a]:i.ONE_MINUS_SRC_ALPHA,[Il]:i.ONE_MINUS_DST_COLOR,[Dl]:i.ONE_MINUS_DST_ALPHA,[Nl]:i.CONSTANT_COLOR,[Fl]:i.ONE_MINUS_CONSTANT_COLOR,[Ol]:i.CONSTANT_ALPHA,[kl]:i.ONE_MINUS_CONSTANT_ALPHA};function P(D,se,G,Z,ue,ce,De,it,ut,Ke){if(D===Mn){_===!0&&(le(i.BLEND),_=!1);return}if(_===!1&&(te(i.BLEND),_=!0),D!==Ml){if(D!==d||Ke!==S){if((u!==On||M!==On)&&(i.blendEquation(i.FUNC_ADD),u=On,M=On),Ke)switch(D){case di:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ws:i.blendFunc(i.ONE,i.ONE);break;case Ts:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case As:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case di:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ws:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ts:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case As:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}w=null,b=null,U=null,T=null,A.set(0,0,0),C=0,d=D,S=Ke}return}ue=ue||se,ce=ce||G,De=De||Z,(se!==u||ue!==M)&&(i.blendEquationSeparate(Fe[se],Fe[ue]),u=se,M=ue),(G!==w||Z!==b||ce!==U||De!==T)&&(i.blendFuncSeparate(Ve[G],Ve[Z],Ve[ce],Ve[De]),w=G,b=Z,U=ce,T=De),(it.equals(A)===!1||ut!==C)&&(i.blendColor(it.r,it.g,it.b,ut),A.copy(it),C=ut),d=D,S=!1}function ot(D,se){D.side===rn?le(i.CULL_FACE):te(i.CULL_FACE);let G=D.side===Mt;se&&(G=!G),Oe(G),D.blending===di&&D.transparent===!1?P(Mn):P(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),s.setFunc(D.depthFunc),s.setTest(D.depthTest),s.setMask(D.depthWrite),a.setMask(D.colorWrite);const Z=D.stencilWrite;o.setTest(Z),Z&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),et(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):le(i.SAMPLE_ALPHA_TO_COVERAGE)}function Oe(D){y!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),y=D)}function Be(D){D!==_l?(te(i.CULL_FACE),D!==R&&(D===Es?i.cullFace(i.BACK):D===xl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):le(i.CULL_FACE),R=D}function we(D){D!==W&&(Y&&i.lineWidth(D),W=D)}function et(D,se,G){D?(te(i.POLYGON_OFFSET_FILL),(z!==se||X!==G)&&(i.polygonOffset(se,G),z=se,X=G)):le(i.POLYGON_OFFSET_FILL)}function Ee(D){D?te(i.SCISSOR_TEST):le(i.SCISSOR_TEST)}function E(D){D===void 0&&(D=i.TEXTURE0+J-1),ae!==D&&(i.activeTexture(D),ae=D)}function v(D,se,G){G===void 0&&(ae===null?G=i.TEXTURE0+J-1:G=ae);let Z=fe[G];Z===void 0&&(Z={type:void 0,texture:void 0},fe[G]=Z),(Z.type!==D||Z.texture!==se)&&(ae!==G&&(i.activeTexture(G),ae=G),i.bindTexture(D,se||Q[D]),Z.type=D,Z.texture=se)}function O(){const D=fe[ae];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function de(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function He(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ne(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function me(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Te(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ae(D){V.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),V.copy(D))}function ge(D){F.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),F.copy(D))}function ze(D,se){let G=c.get(se);G===void 0&&(G=new WeakMap,c.set(se,G));let Z=G.get(D);Z===void 0&&(Z=i.getUniformBlockIndex(se,D.name),G.set(D,Z))}function Ue(D,se){const Z=c.get(se).get(D);l.get(se)!==Z&&(i.uniformBlockBinding(se,Z,D.__bindingPointIndex),l.set(se,Z))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ae=null,fe={},p={},m=new WeakMap,f=[],g=null,_=!1,d=null,u=null,w=null,b=null,M=null,U=null,T=null,A=new Ye(0,0,0),C=0,S=!1,y=null,R=null,W=null,z=null,X=null,V.set(0,0,i.canvas.width,i.canvas.height),F.set(0,0,i.canvas.width,i.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:te,disable:le,bindFramebuffer:ve,drawBuffers:pe,useProgram:Ie,setBlending:P,setMaterial:ot,setFlipSided:Oe,setCullFace:Be,setLineWidth:we,setPolygonOffset:et,setScissorTest:Ee,activeTexture:E,bindTexture:v,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:j,texImage2D:me,texImage3D:Te,updateUBOMapping:ze,uniformBlockBinding:Ue,texStorage2D:He,texStorage3D:ne,texSubImage2D:K,texSubImage3D:Se,compressedTexSubImage2D:oe,compressedTexSubImage3D:de,scissor:Ae,viewport:ge,reset:je}}function So(i,e,t,n){const r=wp(n);switch(t){case ko:return i*e;case zo:return i*e;case Vo:return i*e*2;case ls:return i*e/r.components*r.byteLength;case cs:return i*e/r.components*r.byteLength;case Ho:return i*e*2/r.components*r.byteLength;case hs:return i*e*2/r.components*r.byteLength;case Bo:return i*e*3/r.components*r.byteLength;case kt:return i*e*4/r.components*r.byteLength;case us:return i*e*4/r.components*r.byteLength;case wr:case Tr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ar:case Rr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Pa:case La:return Math.max(i,16)*Math.max(e,8)/4;case Ca:case Da:return Math.max(i,8)*Math.max(e,8)/2;case Ia:case Ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Na:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ka:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ba:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case za:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Va:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ha:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ga:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Wa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ya:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ka:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case $a:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Cr:case Za:case ja:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Go:case Ja:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Qa:case es:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function wp(i){switch(i){case Xt:case No:return{byteLength:1,components:1};case Wi:case Fo:case qi:return{byteLength:2,components:1};case ss:case os:return{byteLength:2,components:4};case Vn:case as:case an:return{byteLength:4,components:1};case Oo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Tp(i,e,t,n,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ke,h=new WeakMap;let p;const m=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,v){return f?new OffscreenCanvas(E,v):Ur("canvas")}function _(E,v,O){let $=1;const j=Ee(E);if((j.width>O||j.height>O)&&($=O/Math.max(j.width,j.height)),$<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const K=Math.floor($*j.width),Se=Math.floor($*j.height);p===void 0&&(p=g(K,Se));const oe=v?g(K,Se):p;return oe.width=K,oe.height=Se,oe.getContext("2d").drawImage(E,0,0,K,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+K+"x"+Se+")."),oe}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),E;return E}function d(E){return E.generateMipmaps}function u(E){i.generateMipmap(E)}function w(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(E,v,O,$,j=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let K=v;if(v===i.RED&&(O===i.FLOAT&&(K=i.R32F),O===i.HALF_FLOAT&&(K=i.R16F),O===i.UNSIGNED_BYTE&&(K=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.R8UI),O===i.UNSIGNED_SHORT&&(K=i.R16UI),O===i.UNSIGNED_INT&&(K=i.R32UI),O===i.BYTE&&(K=i.R8I),O===i.SHORT&&(K=i.R16I),O===i.INT&&(K=i.R32I)),v===i.RG&&(O===i.FLOAT&&(K=i.RG32F),O===i.HALF_FLOAT&&(K=i.RG16F),O===i.UNSIGNED_BYTE&&(K=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RG8UI),O===i.UNSIGNED_SHORT&&(K=i.RG16UI),O===i.UNSIGNED_INT&&(K=i.RG32UI),O===i.BYTE&&(K=i.RG8I),O===i.SHORT&&(K=i.RG16I),O===i.INT&&(K=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGB8UI),O===i.UNSIGNED_SHORT&&(K=i.RGB16UI),O===i.UNSIGNED_INT&&(K=i.RGB32UI),O===i.BYTE&&(K=i.RGB8I),O===i.SHORT&&(K=i.RGB16I),O===i.INT&&(K=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),O===i.UNSIGNED_INT&&(K=i.RGBA32UI),O===i.BYTE&&(K=i.RGBA8I),O===i.SHORT&&(K=i.RGBA16I),O===i.INT&&(K=i.RGBA32I)),v===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),v===i.RGBA){const Se=j?kr:Ge.getTransfer($);O===i.FLOAT&&(K=i.RGBA32F),O===i.HALF_FLOAT&&(K=i.RGBA16F),O===i.UNSIGNED_BYTE&&(K=Se===Ze?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function M(E,v){let O;return E?v===null||v===Vn||v===Mi?O=i.DEPTH24_STENCIL8:v===an?O=i.DEPTH32F_STENCIL8:v===Wi&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Vn||v===Mi?O=i.DEPTH_COMPONENT24:v===an?O=i.DEPTH_COMPONENT32F:v===Wi&&(O=i.DEPTH_COMPONENT16),O}function U(E,v){return d(E)===!0||E.isFramebufferTexture&&E.minFilter!==zt&&E.minFilter!==Ot?Math.log2(Math.max(v.width,v.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?v.mipmaps.length:1}function T(E){const v=E.target;v.removeEventListener("dispose",T),C(v),v.isVideoTexture&&h.delete(v)}function A(E){const v=E.target;v.removeEventListener("dispose",A),y(v)}function C(E){const v=n.get(E);if(v.__webglInit===void 0)return;const O=E.source,$=m.get(O);if($){const j=$[v.__cacheKey];j.usedTimes--,j.usedTimes===0&&S(E),Object.keys($).length===0&&m.delete(O)}n.remove(E)}function S(E){const v=n.get(E);i.deleteTexture(v.__webglTexture);const O=E.source,$=m.get(O);delete $[v.__cacheKey],s.memory.textures--}function y(E){const v=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let j=0;j<v.__webglFramebuffer[$].length;j++)i.deleteFramebuffer(v.__webglFramebuffer[$][j]);else i.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)i.deleteFramebuffer(v.__webglFramebuffer[$]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=E.textures;for(let $=0,j=O.length;$<j;$++){const K=n.get(O[$]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),s.memory.textures--),n.remove(O[$])}n.remove(E)}let R=0;function W(){R=0}function z(){const E=R;return E>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),R+=1,E}function X(E){const v=[];return v.push(E.wrapS),v.push(E.wrapT),v.push(E.wrapR||0),v.push(E.magFilter),v.push(E.minFilter),v.push(E.anisotropy),v.push(E.internalFormat),v.push(E.format),v.push(E.type),v.push(E.generateMipmaps),v.push(E.premultiplyAlpha),v.push(E.flipY),v.push(E.unpackAlignment),v.push(E.colorSpace),v.join()}function J(E,v){const O=n.get(E);if(E.isVideoTexture&&we(E),E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){const $=E.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{F(O,E,v);return}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function Y(E,v){const O=n.get(E);if(E.version>0&&O.__version!==E.version){F(O,E,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function ee(E,v){const O=n.get(E);if(E.version>0&&O.__version!==E.version){F(O,E,v);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function H(E,v){const O=n.get(E);if(E.version>0&&O.__version!==E.version){q(O,E,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}const ae={[Lr]:i.REPEAT,[Bn]:i.CLAMP_TO_EDGE,[Ra]:i.MIRRORED_REPEAT},fe={[zt]:i.NEAREST,[Kl]:i.NEAREST_MIPMAP_NEAREST,[Ji]:i.NEAREST_MIPMAP_LINEAR,[Ot]:i.LINEAR,[Vr]:i.LINEAR_MIPMAP_NEAREST,[yn]:i.LINEAR_MIPMAP_LINEAR},Me={[Ql]:i.NEVER,[ac]:i.ALWAYS,[ec]:i.LESS,[Wo]:i.LEQUAL,[tc]:i.EQUAL,[rc]:i.GEQUAL,[nc]:i.GREATER,[ic]:i.NOTEQUAL};function Ce(E,v){if(v.type===an&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ot||v.magFilter===Vr||v.magFilter===Ji||v.magFilter===yn||v.minFilter===Ot||v.minFilter===Vr||v.minFilter===Ji||v.minFilter===yn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,ae[v.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,ae[v.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,ae[v.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,fe[v.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,fe[v.minFilter]),v.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,Me[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===zt||v.minFilter!==Ji&&v.minFilter!==yn||v.type===an&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function V(E,v){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,v.addEventListener("dispose",T));const $=v.source;let j=m.get($);j===void 0&&(j={},m.set($,j));const K=X(v);if(K!==E.__cacheKey){j[K]===void 0&&(j[K]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,O=!0),j[K].usedTimes++;const Se=j[E.__cacheKey];Se!==void 0&&(j[E.__cacheKey].usedTimes--,Se.usedTimes===0&&S(v)),E.__cacheKey=K,E.__webglTexture=j[K].texture}return O}function F(E,v,O){let $=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=i.TEXTURE_3D);const j=V(E,v),K=v.source;t.bindTexture($,E.__webglTexture,i.TEXTURE0+O);const Se=n.get(K);if(K.version!==Se.__version||j===!0){t.activeTexture(i.TEXTURE0+O);const oe=Ge.getPrimaries(Ge.workingColorSpace),de=v.colorSpace===xn?null:Ge.getPrimaries(v.colorSpace),He=v.colorSpace===xn||oe===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ne=_(v.image,!1,r.maxTextureSize);ne=et(v,ne);const me=a.convert(v.format,v.colorSpace),Te=a.convert(v.type);let Ae=b(v.internalFormat,me,Te,v.colorSpace,v.isVideoTexture);Ce($,v);let ge;const ze=v.mipmaps,Ue=v.isVideoTexture!==!0,je=Se.__version===void 0||j===!0,D=K.dataReady,se=U(v,ne);if(v.isDepthTexture)Ae=M(v.format===Si,v.type),je&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,Ae,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Ae,ne.width,ne.height,0,me,Te,null));else if(v.isDataTexture)if(ze.length>0){Ue&&je&&t.texStorage2D(i.TEXTURE_2D,se,Ae,ze[0].width,ze[0].height);for(let G=0,Z=ze.length;G<Z;G++)ge=ze[G],Ue?D&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,ge.width,ge.height,me,Te,ge.data):t.texImage2D(i.TEXTURE_2D,G,Ae,ge.width,ge.height,0,me,Te,ge.data);v.generateMipmaps=!1}else Ue?(je&&t.texStorage2D(i.TEXTURE_2D,se,Ae,ne.width,ne.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ne.width,ne.height,me,Te,ne.data)):t.texImage2D(i.TEXTURE_2D,0,Ae,ne.width,ne.height,0,me,Te,ne.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ue&&je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,se,Ae,ze[0].width,ze[0].height,ne.depth);for(let G=0,Z=ze.length;G<Z;G++)if(ge=ze[G],v.format!==kt)if(me!==null)if(Ue){if(D)if(v.layerUpdates.size>0){const ue=So(ge.width,ge.height,v.format,v.type);for(const ce of v.layerUpdates){const De=ge.data.subarray(ce*ue/ge.data.BYTES_PER_ELEMENT,(ce+1)*ue/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,ce,ge.width,ge.height,1,me,De)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,ge.width,ge.height,ne.depth,me,ge.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,G,Ae,ge.width,ge.height,ne.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,ge.width,ge.height,ne.depth,me,Te,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,G,Ae,ge.width,ge.height,ne.depth,0,me,Te,ge.data)}else{Ue&&je&&t.texStorage2D(i.TEXTURE_2D,se,Ae,ze[0].width,ze[0].height);for(let G=0,Z=ze.length;G<Z;G++)ge=ze[G],v.format!==kt?me!==null?Ue?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,G,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,G,Ae,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?D&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,ge.width,ge.height,me,Te,ge.data):t.texImage2D(i.TEXTURE_2D,G,Ae,ge.width,ge.height,0,me,Te,ge.data)}else if(v.isDataArrayTexture)if(Ue){if(je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,se,Ae,ne.width,ne.height,ne.depth),D)if(v.layerUpdates.size>0){const G=So(ne.width,ne.height,v.format,v.type);for(const Z of v.layerUpdates){const ue=ne.data.subarray(Z*G/ne.data.BYTES_PER_ELEMENT,(Z+1)*G/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,ne.width,ne.height,1,me,Te,ue)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,me,Te,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,ne.width,ne.height,ne.depth,0,me,Te,ne.data);else if(v.isData3DTexture)Ue?(je&&t.texStorage3D(i.TEXTURE_3D,se,Ae,ne.width,ne.height,ne.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,me,Te,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,ne.width,ne.height,ne.depth,0,me,Te,ne.data);else if(v.isFramebufferTexture){if(je)if(Ue)t.texStorage2D(i.TEXTURE_2D,se,Ae,ne.width,ne.height);else{let G=ne.width,Z=ne.height;for(let ue=0;ue<se;ue++)t.texImage2D(i.TEXTURE_2D,ue,Ae,G,Z,0,me,Te,null),G>>=1,Z>>=1}}else if(ze.length>0){if(Ue&&je){const G=Ee(ze[0]);t.texStorage2D(i.TEXTURE_2D,se,Ae,G.width,G.height)}for(let G=0,Z=ze.length;G<Z;G++)ge=ze[G],Ue?D&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,me,Te,ge):t.texImage2D(i.TEXTURE_2D,G,Ae,me,Te,ge);v.generateMipmaps=!1}else if(Ue){if(je){const G=Ee(ne);t.texStorage2D(i.TEXTURE_2D,se,Ae,G.width,G.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,me,Te,ne)}else t.texImage2D(i.TEXTURE_2D,0,Ae,me,Te,ne);d(v)&&u($),Se.__version=K.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function q(E,v,O){if(v.image.length!==6)return;const $=V(E,v),j=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+O);const K=n.get(j);if(j.version!==K.__version||$===!0){t.activeTexture(i.TEXTURE0+O);const Se=Ge.getPrimaries(Ge.workingColorSpace),oe=v.colorSpace===xn?null:Ge.getPrimaries(v.colorSpace),de=v.colorSpace===xn||Se===oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const He=v.isCompressedTexture||v.image[0].isCompressedTexture,ne=v.image[0]&&v.image[0].isDataTexture,me=[];for(let Z=0;Z<6;Z++)!He&&!ne?me[Z]=_(v.image[Z],!0,r.maxCubemapSize):me[Z]=ne?v.image[Z].image:v.image[Z],me[Z]=et(v,me[Z]);const Te=me[0],Ae=a.convert(v.format,v.colorSpace),ge=a.convert(v.type),ze=b(v.internalFormat,Ae,ge,v.colorSpace),Ue=v.isVideoTexture!==!0,je=K.__version===void 0||$===!0,D=j.dataReady;let se=U(v,Te);Ce(i.TEXTURE_CUBE_MAP,v);let G;if(He){Ue&&je&&t.texStorage2D(i.TEXTURE_CUBE_MAP,se,ze,Te.width,Te.height);for(let Z=0;Z<6;Z++){G=me[Z].mipmaps;for(let ue=0;ue<G.length;ue++){const ce=G[ue];v.format!==kt?Ae!==null?Ue?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,0,0,ce.width,ce.height,Ae,ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,ze,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,0,0,ce.width,ce.height,Ae,ge,ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue,ze,ce.width,ce.height,0,Ae,ge,ce.data)}}}else{if(G=v.mipmaps,Ue&&je){G.length>0&&se++;const Z=Ee(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,se,ze,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ne){Ue?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,me[Z].width,me[Z].height,Ae,ge,me[Z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ze,me[Z].width,me[Z].height,0,Ae,ge,me[Z].data);for(let ue=0;ue<G.length;ue++){const De=G[ue].image[Z].image;Ue?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,0,0,De.width,De.height,Ae,ge,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,ze,De.width,De.height,0,Ae,ge,De.data)}}else{Ue?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ae,ge,me[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ze,Ae,ge,me[Z]);for(let ue=0;ue<G.length;ue++){const ce=G[ue];Ue?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,0,0,Ae,ge,ce.image[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ue+1,ze,Ae,ge,ce.image[Z])}}}d(v)&&u(i.TEXTURE_CUBE_MAP),K.__version=j.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function Q(E,v,O,$,j,K){const Se=a.convert(O.format,O.colorSpace),oe=a.convert(O.type),de=b(O.internalFormat,Se,oe,O.colorSpace),He=n.get(v),ne=n.get(O);if(ne.__renderTarget=v,!He.__hasExternalTextures){const me=Math.max(1,v.width>>K),Te=Math.max(1,v.height>>K);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,K,de,me,Te,v.depth,0,Se,oe,null):t.texImage2D(j,K,de,me,Te,0,Se,oe,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),Be(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,j,ne.__webglTexture,0,Oe(v)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,j,ne.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function te(E,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,E),v.depthBuffer){const $=v.depthTexture,j=$&&$.isDepthTexture?$.type:null,K=M(v.stencilBuffer,j),Se=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=Oe(v);Be(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,K,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,K,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,K,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,E)}else{const $=v.textures;for(let j=0;j<$.length;j++){const K=$[j],Se=a.convert(K.format,K.colorSpace),oe=a.convert(K.type),de=b(K.internalFormat,Se,oe,K.colorSpace),He=Oe(v);O&&Be(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,He,de,v.width,v.height):Be(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,He,de,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,de,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function le(E,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(v.depthTexture);$.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),J(v.depthTexture,0);const j=$.__webglTexture,K=Oe(v);if(v.depthTexture.format===pi)Be(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(v.depthTexture.format===Si)Be(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function ve(E){const v=n.get(E),O=E.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==E.depthTexture){const $=E.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const j=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",j)};$.addEventListener("dispose",j),v.__depthDisposeCallback=j}v.__boundDepthTexture=$}if(E.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");le(v.__webglFramebuffer,E)}else if(O){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=i.createRenderbuffer(),te(v.__webglDepthbuffer[$],E,!1);else{const j=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=v.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,K)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),te(v.__webglDepthbuffer,E,!1);else{const $=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,j)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function pe(E,v,O){const $=n.get(E);v!==void 0&&Q($.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ve(E)}function Ie(E){const v=E.texture,O=n.get(E),$=n.get(v);E.addEventListener("dispose",A);const j=E.textures,K=E.isWebGLCubeRenderTarget===!0,Se=j.length>1;if(Se||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=v.version,s.memory.textures++),K){O.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[oe]=[];for(let de=0;de<v.mipmaps.length;de++)O.__webglFramebuffer[oe][de]=i.createFramebuffer()}else O.__webglFramebuffer[oe]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let oe=0;oe<v.mipmaps.length;oe++)O.__webglFramebuffer[oe]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Se)for(let oe=0,de=j.length;oe<de;oe++){const He=n.get(j[oe]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),s.memory.textures++)}if(E.samples>0&&Be(E)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let oe=0;oe<j.length;oe++){const de=j[oe];O.__webglColorRenderbuffer[oe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[oe]);const He=a.convert(de.format,de.colorSpace),ne=a.convert(de.type),me=b(de.internalFormat,He,ne,de.colorSpace,E.isXRRenderTarget===!0),Te=Oe(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Te,me,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,O.__webglColorRenderbuffer[oe])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),te(O.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Ce(i.TEXTURE_CUBE_MAP,v);for(let oe=0;oe<6;oe++)if(v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)Q(O.__webglFramebuffer[oe][de],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,de);else Q(O.__webglFramebuffer[oe],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);d(v)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let oe=0,de=j.length;oe<de;oe++){const He=j[oe],ne=n.get(He);t.bindTexture(i.TEXTURE_2D,ne.__webglTexture),Ce(i.TEXTURE_2D,He),Q(O.__webglFramebuffer,E,He,i.COLOR_ATTACHMENT0+oe,i.TEXTURE_2D,0),d(He)&&u(i.TEXTURE_2D)}t.unbindTexture()}else{let oe=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(oe=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(oe,$.__webglTexture),Ce(oe,v),v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)Q(O.__webglFramebuffer[de],E,v,i.COLOR_ATTACHMENT0,oe,de);else Q(O.__webglFramebuffer,E,v,i.COLOR_ATTACHMENT0,oe,0);d(v)&&u(oe),t.unbindTexture()}E.depthBuffer&&ve(E)}function Fe(E){const v=E.textures;for(let O=0,$=v.length;O<$;O++){const j=v[O];if(d(j)){const K=w(E),Se=n.get(j).__webglTexture;t.bindTexture(K,Se),u(K),t.unbindTexture()}}}const Ve=[],P=[];function ot(E){if(E.samples>0){if(Be(E)===!1){const v=E.textures,O=E.width,$=E.height;let j=i.COLOR_BUFFER_BIT;const K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(E),oe=v.length>1;if(oe)for(let de=0;de<v.length;de++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let de=0;de<v.length;de++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),oe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[de]);const He=n.get(v[de]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,He,0)}i.blitFramebuffer(0,0,O,$,0,0,O,$,j,i.NEAREST),l===!0&&(Ve.length=0,P.length=0,Ve.push(i.COLOR_ATTACHMENT0+de),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Ve.push(K),P.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,P)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ve))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),oe)for(let de=0;de<v.length;de++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,Se.__webglColorRenderbuffer[de]);const He=n.get(v[de]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,He,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const v=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function Oe(E){return Math.min(r.maxSamples,E.samples)}function Be(E){const v=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function we(E){const v=s.render.frame;h.get(E)!==v&&(h.set(E,v),E.update())}function et(E,v){const O=E.colorSpace,$=E.format,j=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==Ei&&O!==xn&&(Ge.getTransfer(O)===Ze?($!==kt||j!==Xt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function Ee(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=W,this.setTexture2D=J,this.setTexture2DArray=Y,this.setTexture3D=ee,this.setTextureCube=H,this.rebindTextures=pe,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Be}function Ap(i,e){function t(n,r=xn){let a;const s=Ge.getTransfer(r);if(n===Xt)return i.UNSIGNED_BYTE;if(n===ss)return i.UNSIGNED_SHORT_4_4_4_4;if(n===os)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Oo)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===No)return i.BYTE;if(n===Fo)return i.SHORT;if(n===Wi)return i.UNSIGNED_SHORT;if(n===as)return i.INT;if(n===Vn)return i.UNSIGNED_INT;if(n===an)return i.FLOAT;if(n===qi)return i.HALF_FLOAT;if(n===ko)return i.ALPHA;if(n===Bo)return i.RGB;if(n===kt)return i.RGBA;if(n===zo)return i.LUMINANCE;if(n===Vo)return i.LUMINANCE_ALPHA;if(n===pi)return i.DEPTH_COMPONENT;if(n===Si)return i.DEPTH_STENCIL;if(n===ls)return i.RED;if(n===cs)return i.RED_INTEGER;if(n===Ho)return i.RG;if(n===hs)return i.RG_INTEGER;if(n===us)return i.RGBA_INTEGER;if(n===wr||n===Tr||n===Ar||n===Rr)if(s===Ze)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===wr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Tr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ar)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Rr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===wr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Tr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ar)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Rr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ca||n===Pa||n===Da||n===La)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Ca)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pa)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Da)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===La)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ia||n===Ua||n===Na)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Ia||n===Ua)return s===Ze?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Na)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Fa||n===Oa||n===ka||n===Ba||n===za||n===Va||n===Ha||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===Ka||n===$a)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Fa)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Oa)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ka)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ba)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===za)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Va)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ha)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ga)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Wa)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xa)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===qa)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ya)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ka)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$a)return s===Ze?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Cr||n===Za||n===ja)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===Cr)return s===Ze?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Za)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ja)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Go||n===Ja||n===Qa||n===es)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===Cr)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Ja)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Qa)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===es)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Mi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Rp extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ui extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cp={type:"move"};class pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ui,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ui,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ui,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,a=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const _ of e.hand.values()){const d=t.getJointPose(_,n),u=this._getHandJoint(c,_);d!==null&&(u.matrix.fromArray(d.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=d.radius),u.visible=d!==null}const h=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],m=h.position.distanceTo(p.position),f=.02,g=.005;c.inputState.pinching&&m>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cp)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ui;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Pp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Dp=`
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

}`;class Lp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new _t,a=e.properties.get(r);a.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new cn({vertexShader:Pp,fragmentShader:Dp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Bt(new $i(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ip extends wi{constructor(e,t){super();const n=this;let r=null,a=1,s=null,o="local-floor",l=1,c=null,h=null,p=null,m=null,f=null,g=null;const _=new Lp,d=t.getContextAttributes();let u=null,w=null;const b=[],M=[],U=new ke;let T=null;const A=new Ct;A.viewport=new Qe;const C=new Ct;C.viewport=new Qe;const S=[A,C],y=new Rp;let R=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(F){let q=b[F];return q===void 0&&(q=new pa,b[F]=q),q.getTargetRaySpace()},this.getControllerGrip=function(F){let q=b[F];return q===void 0&&(q=new pa,b[F]=q),q.getGripSpace()},this.getHand=function(F){let q=b[F];return q===void 0&&(q=new pa,b[F]=q),q.getHandSpace()};function z(F){const q=M.indexOf(F.inputSource);if(q===-1)return;const Q=b[q];Q!==void 0&&(Q.update(F.inputSource,F.frame,c||s),Q.dispatchEvent({type:F.type,data:F.inputSource}))}function X(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",J);for(let F=0;F<b.length;F++){const q=M[F];q!==null&&(M[F]=null,b[F].disconnect(q))}R=null,W=null,_.reset(),e.setRenderTarget(u),f=null,m=null,p=null,r=null,w=null,V.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(U.width,U.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(F){a=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(F){o=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(F){c=F},this.getBaseLayer=function(){return m!==null?m:f},this.getBinding=function(){return p},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(F){if(r=F,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",J),d.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(U),r.renderState.layers===void 0){const q={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(r,t,q),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new Hn(f.framebufferWidth,f.framebufferHeight,{format:kt,type:Xt,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let q=null,Q=null,te=null;d.depth&&(te=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,q=d.stencil?Si:pi,Q=d.stencil?Mi:Vn);const le={colorFormat:t.RGBA8,depthFormat:te,scaleFactor:a};p=new XRWebGLBinding(r,t),m=p.createProjectionLayer(le),r.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),w=new Hn(m.textureWidth,m.textureHeight,{format:kt,type:Xt,depthTexture:new rl(m.textureWidth,m.textureHeight,Q,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),V.setContext(r),V.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function J(F){for(let q=0;q<F.removed.length;q++){const Q=F.removed[q],te=M.indexOf(Q);te>=0&&(M[te]=null,b[te].disconnect(Q))}for(let q=0;q<F.added.length;q++){const Q=F.added[q];let te=M.indexOf(Q);if(te===-1){for(let ve=0;ve<b.length;ve++)if(ve>=M.length){M.push(Q),te=ve;break}else if(M[ve]===null){M[ve]=Q,te=ve;break}if(te===-1)break}const le=b[te];le&&le.connect(Q)}}const Y=new N,ee=new N;function H(F,q,Q){Y.setFromMatrixPosition(q.matrixWorld),ee.setFromMatrixPosition(Q.matrixWorld);const te=Y.distanceTo(ee),le=q.projectionMatrix.elements,ve=Q.projectionMatrix.elements,pe=le[14]/(le[10]-1),Ie=le[14]/(le[10]+1),Fe=(le[9]+1)/le[5],Ve=(le[9]-1)/le[5],P=(le[8]-1)/le[0],ot=(ve[8]+1)/ve[0],Oe=pe*P,Be=pe*ot,we=te/(-P+ot),et=we*-P;if(q.matrixWorld.decompose(F.position,F.quaternion,F.scale),F.translateX(et),F.translateZ(we),F.matrixWorld.compose(F.position,F.quaternion,F.scale),F.matrixWorldInverse.copy(F.matrixWorld).invert(),le[10]===-1)F.projectionMatrix.copy(q.projectionMatrix),F.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const Ee=pe+we,E=Ie+we,v=Oe-et,O=Be+(te-et),$=Fe*Ie/E*Ee,j=Ve*Ie/E*Ee;F.projectionMatrix.makePerspective(v,O,$,j,Ee,E),F.projectionMatrixInverse.copy(F.projectionMatrix).invert()}}function ae(F,q){q===null?F.matrixWorld.copy(F.matrix):F.matrixWorld.multiplyMatrices(q.matrixWorld,F.matrix),F.matrixWorldInverse.copy(F.matrixWorld).invert()}this.updateCamera=function(F){if(r===null)return;let q=F.near,Q=F.far;_.texture!==null&&(_.depthNear>0&&(q=_.depthNear),_.depthFar>0&&(Q=_.depthFar)),y.near=C.near=A.near=q,y.far=C.far=A.far=Q,(R!==y.near||W!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),R=y.near,W=y.far),A.layers.mask=F.layers.mask|2,C.layers.mask=F.layers.mask|4,y.layers.mask=A.layers.mask|C.layers.mask;const te=F.parent,le=y.cameras;ae(y,te);for(let ve=0;ve<le.length;ve++)ae(le[ve],te);le.length===2?H(y,A,C):y.projectionMatrix.copy(A.projectionMatrix),fe(F,y,te)};function fe(F,q,Q){Q===null?F.matrix.copy(q.matrixWorld):(F.matrix.copy(Q.matrixWorld),F.matrix.invert(),F.matrix.multiply(q.matrixWorld)),F.matrix.decompose(F.position,F.quaternion,F.scale),F.updateMatrixWorld(!0),F.projectionMatrix.copy(q.projectionMatrix),F.projectionMatrixInverse.copy(q.projectionMatrixInverse),F.isPerspectiveCamera&&(F.fov=Xi*2*Math.atan(1/F.projectionMatrix.elements[5]),F.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(m===null&&f===null))return l},this.setFoveation=function(F){l=F,m!==null&&(m.fixedFoveation=F),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=F)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let Me=null;function Ce(F,q){if(h=q.getViewerPose(c||s),g=q,h!==null){const Q=h.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let te=!1;Q.length!==y.cameras.length&&(y.cameras.length=0,te=!0);for(let ve=0;ve<Q.length;ve++){const pe=Q[ve];let Ie=null;if(f!==null)Ie=f.getViewport(pe);else{const Ve=p.getViewSubImage(m,pe);Ie=Ve.viewport,ve===0&&(e.setRenderTargetTextures(w,Ve.colorTexture,m.ignoreDepthValues?void 0:Ve.depthStencilTexture),e.setRenderTarget(w))}let Fe=S[ve];Fe===void 0&&(Fe=new Ct,Fe.layers.enable(ve),Fe.viewport=new Qe,S[ve]=Fe),Fe.matrix.fromArray(pe.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(pe.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),ve===0&&(y.matrix.copy(Fe.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),te===!0&&y.cameras.push(Fe)}const le=r.enabledFeatures;if(le&&le.includes("depth-sensing")){const ve=p.getDepthInformation(Q[0]);ve&&ve.isValid&&ve.texture&&_.init(e,ve,r.renderState)}}for(let Q=0;Q<b.length;Q++){const te=M[Q],le=b[Q];te!==null&&le!==void 0&&le.update(te,q,c||s)}Me&&Me(F,q),q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:q}),g=null}const V=new il;V.setAnimationLoop(Ce),this.setAnimationLoop=function(F){Me=F},this.dispose=function(){}}}const Dn=new qt,Up=new rt;function Np(i,e){function t(d,u){d.matrixAutoUpdate===!0&&d.updateMatrix(),u.value.copy(d.matrix)}function n(d,u){u.color.getRGB(d.fogColor.value,Qo(i)),u.isFog?(d.fogNear.value=u.near,d.fogFar.value=u.far):u.isFogExp2&&(d.fogDensity.value=u.density)}function r(d,u,w,b,M){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(d,u):u.isMeshToonMaterial?(a(d,u),p(d,u)):u.isMeshPhongMaterial?(a(d,u),h(d,u)):u.isMeshStandardMaterial?(a(d,u),m(d,u),u.isMeshPhysicalMaterial&&f(d,u,M)):u.isMeshMatcapMaterial?(a(d,u),g(d,u)):u.isMeshDepthMaterial?a(d,u):u.isMeshDistanceMaterial?(a(d,u),_(d,u)):u.isMeshNormalMaterial?a(d,u):u.isLineBasicMaterial?(s(d,u),u.isLineDashedMaterial&&o(d,u)):u.isPointsMaterial?l(d,u,w,b):u.isSpriteMaterial?c(d,u):u.isShadowMaterial?(d.color.value.copy(u.color),d.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(d,u){d.opacity.value=u.opacity,u.color&&d.diffuse.value.copy(u.color),u.emissive&&d.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(d.map.value=u.map,t(u.map,d.mapTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.bumpMap&&(d.bumpMap.value=u.bumpMap,t(u.bumpMap,d.bumpMapTransform),d.bumpScale.value=u.bumpScale,u.side===Mt&&(d.bumpScale.value*=-1)),u.normalMap&&(d.normalMap.value=u.normalMap,t(u.normalMap,d.normalMapTransform),d.normalScale.value.copy(u.normalScale),u.side===Mt&&d.normalScale.value.negate()),u.displacementMap&&(d.displacementMap.value=u.displacementMap,t(u.displacementMap,d.displacementMapTransform),d.displacementScale.value=u.displacementScale,d.displacementBias.value=u.displacementBias),u.emissiveMap&&(d.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,d.emissiveMapTransform)),u.specularMap&&(d.specularMap.value=u.specularMap,t(u.specularMap,d.specularMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest);const w=e.get(u),b=w.envMap,M=w.envMapRotation;b&&(d.envMap.value=b,Dn.copy(M),Dn.x*=-1,Dn.y*=-1,Dn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Dn.y*=-1,Dn.z*=-1),d.envMapRotation.value.setFromMatrix4(Up.makeRotationFromEuler(Dn)),d.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=u.reflectivity,d.ior.value=u.ior,d.refractionRatio.value=u.refractionRatio),u.lightMap&&(d.lightMap.value=u.lightMap,d.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,d.lightMapTransform)),u.aoMap&&(d.aoMap.value=u.aoMap,d.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,d.aoMapTransform))}function s(d,u){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,u.map&&(d.map.value=u.map,t(u.map,d.mapTransform))}function o(d,u){d.dashSize.value=u.dashSize,d.totalSize.value=u.dashSize+u.gapSize,d.scale.value=u.scale}function l(d,u,w,b){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,d.size.value=u.size*w,d.scale.value=b*.5,u.map&&(d.map.value=u.map,t(u.map,d.uvTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest)}function c(d,u){d.diffuse.value.copy(u.color),d.opacity.value=u.opacity,d.rotation.value=u.rotation,u.map&&(d.map.value=u.map,t(u.map,d.mapTransform)),u.alphaMap&&(d.alphaMap.value=u.alphaMap,t(u.alphaMap,d.alphaMapTransform)),u.alphaTest>0&&(d.alphaTest.value=u.alphaTest)}function h(d,u){d.specular.value.copy(u.specular),d.shininess.value=Math.max(u.shininess,1e-4)}function p(d,u){u.gradientMap&&(d.gradientMap.value=u.gradientMap)}function m(d,u){d.metalness.value=u.metalness,u.metalnessMap&&(d.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,d.metalnessMapTransform)),d.roughness.value=u.roughness,u.roughnessMap&&(d.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,d.roughnessMapTransform)),u.envMap&&(d.envMapIntensity.value=u.envMapIntensity)}function f(d,u,w){d.ior.value=u.ior,u.sheen>0&&(d.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),d.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(d.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,d.sheenColorMapTransform)),u.sheenRoughnessMap&&(d.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,d.sheenRoughnessMapTransform))),u.clearcoat>0&&(d.clearcoat.value=u.clearcoat,d.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(d.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,d.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(d.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Mt&&d.clearcoatNormalScale.value.negate())),u.dispersion>0&&(d.dispersion.value=u.dispersion),u.iridescence>0&&(d.iridescence.value=u.iridescence,d.iridescenceIOR.value=u.iridescenceIOR,d.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(d.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,d.iridescenceMapTransform)),u.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),u.transmission>0&&(d.transmission.value=u.transmission,d.transmissionSamplerMap.value=w.texture,d.transmissionSamplerSize.value.set(w.width,w.height),u.transmissionMap&&(d.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,d.transmissionMapTransform)),d.thickness.value=u.thickness,u.thicknessMap&&(d.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=u.attenuationDistance,d.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(d.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(d.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=u.specularIntensity,d.specularColor.value.copy(u.specularColor),u.specularColorMap&&(d.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,d.specularColorMapTransform)),u.specularIntensityMap&&(d.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,d.specularIntensityMapTransform))}function g(d,u){u.matcap&&(d.matcap.value=u.matcap)}function _(d,u){const w=e.get(u).light;d.referencePosition.value.setFromMatrixPosition(w.matrixWorld),d.nearDistance.value=w.shadow.camera.near,d.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Fp(i,e,t,n){let r={},a={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,b){const M=b.program;n.uniformBlockBinding(w,M)}function c(w,b){let M=r[w.id];M===void 0&&(g(w),M=h(w),r[w.id]=M,w.addEventListener("dispose",d));const U=b.program;n.updateUBOMapping(w,U);const T=e.render.frame;a[w.id]!==T&&(m(w),a[w.id]=T)}function h(w){const b=p();w.__bindingPointIndex=b;const M=i.createBuffer(),U=w.__size,T=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,U,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,M),M}function p(){for(let w=0;w<o;w++)if(s.indexOf(w)===-1)return s.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(w){const b=r[w.id],M=w.uniforms,U=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let T=0,A=M.length;T<A;T++){const C=Array.isArray(M[T])?M[T]:[M[T]];for(let S=0,y=C.length;S<y;S++){const R=C[S];if(f(R,T,S,U)===!0){const W=R.__offset,z=Array.isArray(R.value)?R.value:[R.value];let X=0;for(let J=0;J<z.length;J++){const Y=z[J],ee=_(Y);typeof Y=="number"||typeof Y=="boolean"?(R.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,W+X,R.__data)):Y.isMatrix3?(R.__data[0]=Y.elements[0],R.__data[1]=Y.elements[1],R.__data[2]=Y.elements[2],R.__data[3]=0,R.__data[4]=Y.elements[3],R.__data[5]=Y.elements[4],R.__data[6]=Y.elements[5],R.__data[7]=0,R.__data[8]=Y.elements[6],R.__data[9]=Y.elements[7],R.__data[10]=Y.elements[8],R.__data[11]=0):(Y.toArray(R.__data,X),X+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(w,b,M,U){const T=w.value,A=b+"_"+M;if(U[A]===void 0)return typeof T=="number"||typeof T=="boolean"?U[A]=T:U[A]=T.clone(),!0;{const C=U[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return U[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(w){const b=w.uniforms;let M=0;const U=16;for(let A=0,C=b.length;A<C;A++){const S=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,R=S.length;y<R;y++){const W=S[y],z=Array.isArray(W.value)?W.value:[W.value];for(let X=0,J=z.length;X<J;X++){const Y=z[X],ee=_(Y),H=M%U,ae=H%ee.boundary,fe=H+ae;M+=ae,fe!==0&&U-fe<ee.storage&&(M+=U-fe),W.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=M,M+=ee.storage}}}const T=M%U;return T>0&&(M+=U-T),w.__size=M,w.__cache={},this}function _(w){const b={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(b.boundary=4,b.storage=4):w.isVector2?(b.boundary=8,b.storage=8):w.isVector3||w.isColor?(b.boundary=16,b.storage=12):w.isVector4?(b.boundary=16,b.storage=16):w.isMatrix3?(b.boundary=48,b.storage=48):w.isMatrix4?(b.boundary=64,b.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),b}function d(w){const b=w.target;b.removeEventListener("dispose",d);const M=s.indexOf(b.__bindingPointIndex);s.splice(M,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete a[b.id]}function u(){for(const w in r)i.deleteBuffer(r[w]);s=[],r={},a={}}return{bind:l,update:c,dispose:u}}class Op{constructor(e={}){const{canvas:t=bc(),context:n=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=s;const g=new Uint32Array(4),_=new Int32Array(4);let d=null,u=null;const w=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=yt,this.toneMapping=Sn,this.toneMappingExposure=1;const M=this;let U=!1,T=0,A=0,C=null,S=-1,y=null;const R=new Qe,W=new Qe;let z=null;const X=new Ye(0);let J=0,Y=t.width,ee=t.height,H=1,ae=null,fe=null;const Me=new Qe(0,0,Y,ee),Ce=new Qe(0,0,Y,ee);let V=!1;const F=new nl;let q=!1,Q=!1;const te=new rt,le=new rt,ve=new N,pe=new Qe,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Fe=!1;function Ve(){return C===null?H:1}let P=n;function ot(x,L){return t.getContext(x,L)}try{const x={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${rs}`),t.addEventListener("webglcontextlost",Z,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",ce,!1),P===null){const L="webgl2";if(P=ot(L,x),P===null)throw ot(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Oe,Be,we,et,Ee,E,v,O,$,j,K,Se,oe,de,He,ne,me,Te,Ae,ge,ze,Ue,je,D;function se(){Oe=new Hf(P),Oe.init(),Ue=new Ap(P,Oe),Be=new Nf(P,Oe,e,Ue),we=new Ep(P,Oe),Be.reverseDepthBuffer&&m&&we.buffers.depth.setReversed(!0),et=new Xf(P),Ee=new cp,E=new Tp(P,Oe,we,Ee,Be,Ue,et),v=new Of(M),O=new Vf(M),$=new Zc(P),je=new If(P,$),j=new Gf(P,$,et,je),K=new Yf(P,j,$,et),Ae=new qf(P,Be,E),ne=new Ff(Ee),Se=new lp(M,v,O,Oe,Be,je,ne),oe=new Np(M,Ee),de=new up,He=new vp(Oe),Te=new Lf(M,v,O,we,K,f,l),me=new Sp(M,K,Be),D=new Fp(P,et,Be,we),ge=new Uf(P,Oe,et),ze=new Wf(P,Oe,et),et.programs=Se.programs,M.capabilities=Be,M.extensions=Oe,M.properties=Ee,M.renderLists=de,M.shadowMap=me,M.state=we,M.info=et}se();const G=new Ip(M,P);this.xr=G,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const x=Oe.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Oe.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(x){x!==void 0&&(H=x,this.setSize(Y,ee,!1))},this.getSize=function(x){return x.set(Y,ee)},this.setSize=function(x,L,k=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=x,ee=L,t.width=Math.floor(x*H),t.height=Math.floor(L*H),k===!0&&(t.style.width=x+"px",t.style.height=L+"px"),this.setViewport(0,0,x,L)},this.getDrawingBufferSize=function(x){return x.set(Y*H,ee*H).floor()},this.setDrawingBufferSize=function(x,L,k){Y=x,ee=L,H=k,t.width=Math.floor(x*k),t.height=Math.floor(L*k),this.setViewport(0,0,x,L)},this.getCurrentViewport=function(x){return x.copy(R)},this.getViewport=function(x){return x.copy(Me)},this.setViewport=function(x,L,k,B){x.isVector4?Me.set(x.x,x.y,x.z,x.w):Me.set(x,L,k,B),we.viewport(R.copy(Me).multiplyScalar(H).round())},this.getScissor=function(x){return x.copy(Ce)},this.setScissor=function(x,L,k,B){x.isVector4?Ce.set(x.x,x.y,x.z,x.w):Ce.set(x,L,k,B),we.scissor(W.copy(Ce).multiplyScalar(H).round())},this.getScissorTest=function(){return V},this.setScissorTest=function(x){we.setScissorTest(V=x)},this.setOpaqueSort=function(x){ae=x},this.setTransparentSort=function(x){fe=x},this.getClearColor=function(x){return x.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(x=!0,L=!0,k=!0){let B=0;if(x){let I=!1;if(C!==null){const ie=C.texture.format;I=ie===us||ie===hs||ie===cs}if(I){const ie=C.texture.type,he=ie===Xt||ie===Vn||ie===Wi||ie===Mi||ie===ss||ie===os,_e=Te.getClearColor(),xe=Te.getClearAlpha(),Re=_e.r,Le=_e.g,ye=_e.b;he?(g[0]=Re,g[1]=Le,g[2]=ye,g[3]=xe,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Re,_[1]=Le,_[2]=ye,_[3]=xe,P.clearBufferiv(P.COLOR,0,_))}else B|=P.COLOR_BUFFER_BIT}L&&(B|=P.DEPTH_BUFFER_BIT),k&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Z,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),de.dispose(),He.dispose(),Ee.dispose(),v.dispose(),O.dispose(),K.dispose(),je.dispose(),D.dispose(),Se.dispose(),G.dispose(),G.removeEventListener("sessionstart",gs),G.removeEventListener("sessionend",vs),wn.stop()};function Z(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const x=et.autoReset,L=me.enabled,k=me.autoUpdate,B=me.needsUpdate,I=me.type;se(),et.autoReset=x,me.enabled=L,me.autoUpdate=k,me.needsUpdate=B,me.type=I}function ce(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function De(x){const L=x.target;L.removeEventListener("dispose",De),it(L)}function it(x){ut(x),Ee.remove(x)}function ut(x){const L=Ee.get(x).programs;L!==void 0&&(L.forEach(function(k){Se.releaseProgram(k)}),x.isShaderMaterial&&Se.releaseShaderCache(x))}this.renderBufferDirect=function(x,L,k,B,I,ie){L===null&&(L=Ie);const he=I.isMesh&&I.matrixWorld.determinant()<0,_e=ml(x,L,k,B,I);we.setMaterial(B,he);let xe=k.index,Re=1;if(B.wireframe===!0){if(xe=j.getWireframeAttribute(k),xe===void 0)return;Re=2}const Le=k.drawRange,ye=k.attributes.position;let We=Le.start*Re,Je=(Le.start+Le.count)*Re;ie!==null&&(We=Math.max(We,ie.start*Re),Je=Math.min(Je,(ie.start+ie.count)*Re)),xe!==null?(We=Math.max(We,0),Je=Math.min(Je,xe.count)):ye!=null&&(We=Math.max(We,0),Je=Math.min(Je,ye.count));const tt=Je-We;if(tt<0||tt===1/0)return;je.setup(I,B,_e,k,xe);let xt,Xe=ge;if(xe!==null&&(xt=$.get(xe),Xe=ze,Xe.setIndex(xt)),I.isMesh)B.wireframe===!0?(we.setLineWidth(B.wireframeLinewidth*Ve()),Xe.setMode(P.LINES)):Xe.setMode(P.TRIANGLES);else if(I.isLine){let be=B.linewidth;be===void 0&&(be=1),we.setLineWidth(be*Ve()),I.isLineSegments?Xe.setMode(P.LINES):I.isLineLoop?Xe.setMode(P.LINE_LOOP):Xe.setMode(P.LINE_STRIP)}else I.isPoints?Xe.setMode(P.POINTS):I.isSprite&&Xe.setMode(P.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Xe.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Oe.get("WEBGL_multi_draw"))Xe.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const be=I._multiDrawStarts,Kt=I._multiDrawCounts,qe=I._multiDrawCount,Lt=xe?$.get(xe).bytesPerElement:1,Wn=Ee.get(B).currentProgram.getUniforms();for(let bt=0;bt<qe;bt++)Wn.setValue(P,"_gl_DrawID",bt),Xe.render(be[bt]/Lt,Kt[bt])}else if(I.isInstancedMesh)Xe.renderInstances(We,tt,I.count);else if(k.isInstancedBufferGeometry){const be=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Kt=Math.min(k.instanceCount,be);Xe.renderInstances(We,tt,Kt)}else Xe.render(We,tt)};function Ke(x,L,k){x.transparent===!0&&x.side===rn&&x.forceSinglePass===!1?(x.side=Mt,x.needsUpdate=!0,ji(x,L,k),x.side=bn,x.needsUpdate=!0,ji(x,L,k),x.side=rn):ji(x,L,k)}this.compile=function(x,L,k=null){k===null&&(k=x),u=He.get(k),u.init(L),b.push(u),k.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),x!==k&&x.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),u.setupLights();const B=new Set;return x.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const ie=I.material;if(ie)if(Array.isArray(ie))for(let he=0;he<ie.length;he++){const _e=ie[he];Ke(_e,k,I),B.add(_e)}else Ke(ie,k,I),B.add(ie)}),b.pop(),u=null,B},this.compileAsync=function(x,L,k=null){const B=this.compile(x,L,k);return new Promise(I=>{function ie(){if(B.forEach(function(he){Ee.get(he).currentProgram.isReady()&&B.delete(he)}),B.size===0){I(x);return}setTimeout(ie,10)}Oe.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Dt=null;function Yt(x){Dt&&Dt(x)}function gs(){wn.stop()}function vs(){wn.start()}const wn=new il;wn.setAnimationLoop(Yt),typeof self<"u"&&wn.setContext(self),this.setAnimationLoop=function(x){Dt=x,G.setAnimationLoop(x),x===null?wn.stop():wn.start()},G.addEventListener("sessionstart",gs),G.addEventListener("sessionend",vs),this.render=function(x,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(L),L=G.getCamera()),x.isScene===!0&&x.onBeforeRender(M,x,L,C),u=He.get(x,b.length),u.init(L),b.push(u),le.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),F.setFromProjectionMatrix(le),Q=this.localClippingEnabled,q=ne.init(this.clippingPlanes,Q),d=de.get(x,w.length),d.init(),w.push(d),G.enabled===!0&&G.isPresenting===!0){const ie=M.xr.getDepthSensingMesh();ie!==null&&zr(ie,L,-1/0,M.sortObjects)}zr(x,L,0,M.sortObjects),d.finish(),M.sortObjects===!0&&d.sort(ae,fe),Fe=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Fe&&Te.addToRenderList(d,x),this.info.render.frame++,q===!0&&ne.beginShadows();const k=u.state.shadowsArray;me.render(k,x,L),q===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=d.opaque,I=d.transmissive;if(u.setupLights(),L.isArrayCamera){const ie=L.cameras;if(I.length>0)for(let he=0,_e=ie.length;he<_e;he++){const xe=ie[he];xs(B,I,x,xe)}Fe&&Te.render(x);for(let he=0,_e=ie.length;he<_e;he++){const xe=ie[he];_s(d,x,xe,xe.viewport)}}else I.length>0&&xs(B,I,x,L),Fe&&Te.render(x),_s(d,x,L);C!==null&&(E.updateMultisampleRenderTarget(C),E.updateRenderTargetMipmap(C)),x.isScene===!0&&x.onAfterRender(M,x,L),je.resetDefaultState(),S=-1,y=null,b.pop(),b.length>0?(u=b[b.length-1],q===!0&&ne.setGlobalState(M.clippingPlanes,u.state.camera)):u=null,w.pop(),w.length>0?d=w[w.length-1]:d=null};function zr(x,L,k,B){if(x.visible===!1)return;if(x.layers.test(L.layers)){if(x.isGroup)k=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(L);else if(x.isLight)u.pushLight(x),x.castShadow&&u.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||F.intersectsSprite(x)){B&&pe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(le);const he=K.update(x),_e=x.material;_e.visible&&d.push(x,he,_e,k,pe.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||F.intersectsObject(x))){const he=K.update(x),_e=x.material;if(B&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),pe.copy(x.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),pe.copy(he.boundingSphere.center)),pe.applyMatrix4(x.matrixWorld).applyMatrix4(le)),Array.isArray(_e)){const xe=he.groups;for(let Re=0,Le=xe.length;Re<Le;Re++){const ye=xe[Re],We=_e[ye.materialIndex];We&&We.visible&&d.push(x,he,We,k,pe.z,ye)}}else _e.visible&&d.push(x,he,_e,k,pe.z,null)}}const ie=x.children;for(let he=0,_e=ie.length;he<_e;he++)zr(ie[he],L,k,B)}function _s(x,L,k,B){const I=x.opaque,ie=x.transmissive,he=x.transparent;u.setupLightsView(k),q===!0&&ne.setGlobalState(M.clippingPlanes,k),B&&we.viewport(R.copy(B)),I.length>0&&Zi(I,L,k),ie.length>0&&Zi(ie,L,k),he.length>0&&Zi(he,L,k),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function xs(x,L,k,B){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[B.id]===void 0&&(u.state.transmissionRenderTarget[B.id]=new Hn(1,1,{generateMipmaps:!0,type:Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float")?qi:Xt,minFilter:yn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace}));const ie=u.state.transmissionRenderTarget[B.id],he=B.viewport||R;ie.setSize(he.z,he.w);const _e=M.getRenderTarget();M.setRenderTarget(ie),M.getClearColor(X),J=M.getClearAlpha(),J<1&&M.setClearColor(16777215,.5),M.clear(),Fe&&Te.render(k);const xe=M.toneMapping;M.toneMapping=Sn;const Re=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),u.setupLightsView(B),q===!0&&ne.setGlobalState(M.clippingPlanes,B),Zi(x,k,B),E.updateMultisampleRenderTarget(ie),E.updateRenderTargetMipmap(ie),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let ye=0,We=L.length;ye<We;ye++){const Je=L[ye],tt=Je.object,xt=Je.geometry,Xe=Je.material,be=Je.group;if(Xe.side===rn&&tt.layers.test(B.layers)){const Kt=Xe.side;Xe.side=Mt,Xe.needsUpdate=!0,ys(tt,k,B,xt,Xe,be),Xe.side=Kt,Xe.needsUpdate=!0,Le=!0}}Le===!0&&(E.updateMultisampleRenderTarget(ie),E.updateRenderTargetMipmap(ie))}M.setRenderTarget(_e),M.setClearColor(X,J),Re!==void 0&&(B.viewport=Re),M.toneMapping=xe}function Zi(x,L,k){const B=L.isScene===!0?L.overrideMaterial:null;for(let I=0,ie=x.length;I<ie;I++){const he=x[I],_e=he.object,xe=he.geometry,Re=B===null?he.material:B,Le=he.group;_e.layers.test(k.layers)&&ys(_e,L,k,xe,Re,Le)}}function ys(x,L,k,B,I,ie){x.onBeforeRender(M,L,k,B,I,ie),x.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),I.onBeforeRender(M,L,k,B,x,ie),I.transparent===!0&&I.side===rn&&I.forceSinglePass===!1?(I.side=Mt,I.needsUpdate=!0,M.renderBufferDirect(k,L,B,I,x,ie),I.side=bn,I.needsUpdate=!0,M.renderBufferDirect(k,L,B,I,x,ie),I.side=rn):M.renderBufferDirect(k,L,B,I,x,ie),x.onAfterRender(M,L,k,B,I,ie)}function ji(x,L,k){L.isScene!==!0&&(L=Ie);const B=Ee.get(x),I=u.state.lights,ie=u.state.shadowsArray,he=I.state.version,_e=Se.getParameters(x,I.state,ie,L,k),xe=Se.getProgramCacheKey(_e);let Re=B.programs;B.environment=x.isMeshStandardMaterial?L.environment:null,B.fog=L.fog,B.envMap=(x.isMeshStandardMaterial?O:v).get(x.envMap||B.environment),B.envMapRotation=B.environment!==null&&x.envMap===null?L.environmentRotation:x.envMapRotation,Re===void 0&&(x.addEventListener("dispose",De),Re=new Map,B.programs=Re);let Le=Re.get(xe);if(Le!==void 0){if(B.currentProgram===Le&&B.lightsStateVersion===he)return Ss(x,_e),Le}else _e.uniforms=Se.getUniforms(x),x.onBeforeCompile(_e,M),Le=Se.acquireProgram(_e,xe),Re.set(xe,Le),B.uniforms=_e.uniforms;const ye=B.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(ye.clippingPlanes=ne.uniform),Ss(x,_e),B.needsLights=vl(x),B.lightsStateVersion=he,B.needsLights&&(ye.ambientLightColor.value=I.state.ambient,ye.lightProbe.value=I.state.probe,ye.directionalLights.value=I.state.directional,ye.directionalLightShadows.value=I.state.directionalShadow,ye.spotLights.value=I.state.spot,ye.spotLightShadows.value=I.state.spotShadow,ye.rectAreaLights.value=I.state.rectArea,ye.ltc_1.value=I.state.rectAreaLTC1,ye.ltc_2.value=I.state.rectAreaLTC2,ye.pointLights.value=I.state.point,ye.pointLightShadows.value=I.state.pointShadow,ye.hemisphereLights.value=I.state.hemi,ye.directionalShadowMap.value=I.state.directionalShadowMap,ye.directionalShadowMatrix.value=I.state.directionalShadowMatrix,ye.spotShadowMap.value=I.state.spotShadowMap,ye.spotLightMatrix.value=I.state.spotLightMatrix,ye.spotLightMap.value=I.state.spotLightMap,ye.pointShadowMap.value=I.state.pointShadowMap,ye.pointShadowMatrix.value=I.state.pointShadowMatrix),B.currentProgram=Le,B.uniformsList=null,Le}function Ms(x){if(x.uniformsList===null){const L=x.currentProgram.getUniforms();x.uniformsList=Pr.seqWithValue(L.seq,x.uniforms)}return x.uniformsList}function Ss(x,L){const k=Ee.get(x);k.outputColorSpace=L.outputColorSpace,k.batching=L.batching,k.batchingColor=L.batchingColor,k.instancing=L.instancing,k.instancingColor=L.instancingColor,k.instancingMorph=L.instancingMorph,k.skinning=L.skinning,k.morphTargets=L.morphTargets,k.morphNormals=L.morphNormals,k.morphColors=L.morphColors,k.morphTargetsCount=L.morphTargetsCount,k.numClippingPlanes=L.numClippingPlanes,k.numIntersection=L.numClipIntersection,k.vertexAlphas=L.vertexAlphas,k.vertexTangents=L.vertexTangents,k.toneMapping=L.toneMapping}function ml(x,L,k,B,I){L.isScene!==!0&&(L=Ie),E.resetTextureUnits();const ie=L.fog,he=B.isMeshStandardMaterial?L.environment:null,_e=C===null?M.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ei,xe=(B.isMeshStandardMaterial?O:v).get(B.envMap||he),Re=B.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Le=!!k.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),ye=!!k.morphAttributes.position,We=!!k.morphAttributes.normal,Je=!!k.morphAttributes.color;let tt=Sn;B.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(tt=M.toneMapping);const xt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Xe=xt!==void 0?xt.length:0,be=Ee.get(B),Kt=u.state.lights;if(q===!0&&(Q===!0||x!==y)){const Tt=x===y&&B.id===S;ne.setState(B,x,Tt)}let qe=!1;B.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Kt.state.version||be.outputColorSpace!==_e||I.isBatchedMesh&&be.batching===!1||!I.isBatchedMesh&&be.batching===!0||I.isBatchedMesh&&be.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&be.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&be.instancing===!1||!I.isInstancedMesh&&be.instancing===!0||I.isSkinnedMesh&&be.skinning===!1||!I.isSkinnedMesh&&be.skinning===!0||I.isInstancedMesh&&be.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&be.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&be.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&be.instancingMorph===!1&&I.morphTexture!==null||be.envMap!==xe||B.fog===!0&&be.fog!==ie||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==ne.numPlanes||be.numIntersection!==ne.numIntersection)||be.vertexAlphas!==Re||be.vertexTangents!==Le||be.morphTargets!==ye||be.morphNormals!==We||be.morphColors!==Je||be.toneMapping!==tt||be.morphTargetsCount!==Xe)&&(qe=!0):(qe=!0,be.__version=B.version);let Lt=be.currentProgram;qe===!0&&(Lt=ji(B,L,I));let Wn=!1,bt=!1,Ri=!1;const nt=Lt.getUniforms(),Ht=be.uniforms;if(we.useProgram(Lt.program)&&(Wn=!0,bt=!0,Ri=!0),B.id!==S&&(S=B.id,bt=!0),Wn||y!==x){we.buffers.depth.getReversed()?(te.copy(x.projectionMatrix),wc(te),Tc(te),nt.setValue(P,"projectionMatrix",te)):nt.setValue(P,"projectionMatrix",x.projectionMatrix),nt.setValue(P,"viewMatrix",x.matrixWorldInverse);const hn=nt.map.cameraPosition;hn!==void 0&&hn.setValue(P,ve.setFromMatrixPosition(x.matrixWorld)),Be.logarithmicDepthBuffer&&nt.setValue(P,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&nt.setValue(P,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,bt=!0,Ri=!0)}if(I.isSkinnedMesh){nt.setOptional(P,I,"bindMatrix"),nt.setOptional(P,I,"bindMatrixInverse");const Tt=I.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),nt.setValue(P,"boneTexture",Tt.boneTexture,E))}I.isBatchedMesh&&(nt.setOptional(P,I,"batchingTexture"),nt.setValue(P,"batchingTexture",I._matricesTexture,E),nt.setOptional(P,I,"batchingIdTexture"),nt.setValue(P,"batchingIdTexture",I._indirectTexture,E),nt.setOptional(P,I,"batchingColorTexture"),I._colorsTexture!==null&&nt.setValue(P,"batchingColorTexture",I._colorsTexture,E));const Ci=k.morphAttributes;if((Ci.position!==void 0||Ci.normal!==void 0||Ci.color!==void 0)&&Ae.update(I,k,Lt),(bt||be.receiveShadow!==I.receiveShadow)&&(be.receiveShadow=I.receiveShadow,nt.setValue(P,"receiveShadow",I.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Ht.envMap.value=xe,Ht.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&L.environment!==null&&(Ht.envMapIntensity.value=L.environmentIntensity),bt&&(nt.setValue(P,"toneMappingExposure",M.toneMappingExposure),be.needsLights&&gl(Ht,Ri),ie&&B.fog===!0&&oe.refreshFogUniforms(Ht,ie),oe.refreshMaterialUniforms(Ht,B,H,ee,u.state.transmissionRenderTarget[x.id]),Pr.upload(P,Ms(be),Ht,E)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Pr.upload(P,Ms(be),Ht,E),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&nt.setValue(P,"center",I.center),nt.setValue(P,"modelViewMatrix",I.modelViewMatrix),nt.setValue(P,"normalMatrix",I.normalMatrix),nt.setValue(P,"modelMatrix",I.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Tt=B.uniformsGroups;for(let hn=0,un=Tt.length;hn<un;hn++){const bs=Tt[hn];D.update(bs,Lt),D.bind(bs,Lt)}}return Lt}function gl(x,L){x.ambientLightColor.needsUpdate=L,x.lightProbe.needsUpdate=L,x.directionalLights.needsUpdate=L,x.directionalLightShadows.needsUpdate=L,x.pointLights.needsUpdate=L,x.pointLightShadows.needsUpdate=L,x.spotLights.needsUpdate=L,x.spotLightShadows.needsUpdate=L,x.rectAreaLights.needsUpdate=L,x.hemisphereLights.needsUpdate=L}function vl(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(x,L,k){Ee.get(x.texture).__webglTexture=L,Ee.get(x.depthTexture).__webglTexture=k;const B=Ee.get(x);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=k===void 0,B.__autoAllocateDepthBuffer||Oe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,L){const k=Ee.get(x);k.__webglFramebuffer=L,k.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(x,L=0,k=0){C=x,T=L,A=k;let B=!0,I=null,ie=!1,he=!1;if(x){const xe=Ee.get(x);if(xe.__useDefaultFramebuffer!==void 0)we.bindFramebuffer(P.FRAMEBUFFER,null),B=!1;else if(xe.__webglFramebuffer===void 0)E.setupRenderTarget(x);else if(xe.__hasExternalTextures)E.rebindTextures(x,Ee.get(x.texture).__webglTexture,Ee.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const ye=x.depthTexture;if(xe.__boundDepthTexture!==ye){if(ye!==null&&Ee.has(ye)&&(x.width!==ye.image.width||x.height!==ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(x)}}const Re=x.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(he=!0);const Le=Ee.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Le[L])?I=Le[L][k]:I=Le[L],ie=!0):x.samples>0&&E.useMultisampledRTT(x)===!1?I=Ee.get(x).__webglMultisampledFramebuffer:Array.isArray(Le)?I=Le[k]:I=Le,R.copy(x.viewport),W.copy(x.scissor),z=x.scissorTest}else R.copy(Me).multiplyScalar(H).floor(),W.copy(Ce).multiplyScalar(H).floor(),z=V;if(we.bindFramebuffer(P.FRAMEBUFFER,I)&&B&&we.drawBuffers(x,I),we.viewport(R),we.scissor(W),we.setScissorTest(z),ie){const xe=Ee.get(x.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+L,xe.__webglTexture,k)}else if(he){const xe=Ee.get(x.texture),Re=L||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,xe.__webglTexture,k||0,Re)}S=-1},this.readRenderTargetPixels=function(x,L,k,B,I,ie,he){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Ee.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){we.bindFramebuffer(P.FRAMEBUFFER,_e);try{const xe=x.texture,Re=xe.format,Le=xe.type;if(!Be.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=x.width-B&&k>=0&&k<=x.height-I&&P.readPixels(L,k,B,I,Ue.convert(Re),Ue.convert(Le),ie)}finally{const xe=C!==null?Ee.get(C).__webglFramebuffer:null;we.bindFramebuffer(P.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(x,L,k,B,I,ie,he){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Ee.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){const xe=x.texture,Re=xe.format,Le=xe.type;if(!Be.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=x.width-B&&k>=0&&k<=x.height-I){we.bindFramebuffer(P.FRAMEBUFFER,_e);const ye=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ye),P.bufferData(P.PIXEL_PACK_BUFFER,ie.byteLength,P.STREAM_READ),P.readPixels(L,k,B,I,Ue.convert(Re),Ue.convert(Le),0);const We=C!==null?Ee.get(C).__webglFramebuffer:null;we.bindFramebuffer(P.FRAMEBUFFER,We);const Je=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Ec(P,Je,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ye),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ie),P.deleteBuffer(ye),P.deleteSync(Je),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,L=null,k=0){x.isTexture!==!0&&(Oi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,x=arguments[1]);const B=Math.pow(2,-k),I=Math.floor(x.image.width*B),ie=Math.floor(x.image.height*B),he=L!==null?L.x:0,_e=L!==null?L.y:0;E.setTexture2D(x,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,he,_e,I,ie),we.unbindTexture()},this.copyTextureToTexture=function(x,L,k=null,B=null,I=0){x.isTexture!==!0&&(Oi("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,x=arguments[1],L=arguments[2],I=arguments[3]||0,k=null);let ie,he,_e,xe,Re,Le,ye,We,Je;const tt=x.isCompressedTexture?x.mipmaps[I]:x.image;k!==null?(ie=k.max.x-k.min.x,he=k.max.y-k.min.y,_e=k.isBox3?k.max.z-k.min.z:1,xe=k.min.x,Re=k.min.y,Le=k.isBox3?k.min.z:0):(ie=tt.width,he=tt.height,_e=tt.depth||1,xe=0,Re=0,Le=0),B!==null?(ye=B.x,We=B.y,Je=B.z):(ye=0,We=0,Je=0);const xt=Ue.convert(L.format),Xe=Ue.convert(L.type);let be;L.isData3DTexture?(E.setTexture3D(L,0),be=P.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(E.setTexture2DArray(L,0),be=P.TEXTURE_2D_ARRAY):(E.setTexture2D(L,0),be=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,L.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,L.unpackAlignment);const Kt=P.getParameter(P.UNPACK_ROW_LENGTH),qe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Lt=P.getParameter(P.UNPACK_SKIP_PIXELS),Wn=P.getParameter(P.UNPACK_SKIP_ROWS),bt=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,tt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,tt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,xe),P.pixelStorei(P.UNPACK_SKIP_ROWS,Re),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Le);const Ri=x.isDataArrayTexture||x.isData3DTexture,nt=L.isDataArrayTexture||L.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){const Ht=Ee.get(x),Ci=Ee.get(L),Tt=Ee.get(Ht.__renderTarget),hn=Ee.get(Ci.__renderTarget);we.bindFramebuffer(P.READ_FRAMEBUFFER,Tt.__webglFramebuffer),we.bindFramebuffer(P.DRAW_FRAMEBUFFER,hn.__webglFramebuffer);for(let un=0;un<_e;un++)Ri&&P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ee.get(x).__webglTexture,I,Le+un),x.isDepthTexture?(nt&&P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ee.get(L).__webglTexture,I,Je+un),P.blitFramebuffer(xe,Re,ie,he,ye,We,ie,he,P.DEPTH_BUFFER_BIT,P.NEAREST)):nt?P.copyTexSubImage3D(be,I,ye,We,Je+un,xe,Re,ie,he):P.copyTexSubImage2D(be,I,ye,We,Je+un,xe,Re,ie,he);we.bindFramebuffer(P.READ_FRAMEBUFFER,null),we.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else nt?x.isDataTexture||x.isData3DTexture?P.texSubImage3D(be,I,ye,We,Je,ie,he,_e,xt,Xe,tt.data):L.isCompressedArrayTexture?P.compressedTexSubImage3D(be,I,ye,We,Je,ie,he,_e,xt,tt.data):P.texSubImage3D(be,I,ye,We,Je,ie,he,_e,xt,Xe,tt):x.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,I,ye,We,ie,he,xt,Xe,tt.data):x.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,I,ye,We,tt.width,tt.height,xt,tt.data):P.texSubImage2D(P.TEXTURE_2D,I,ye,We,ie,he,xt,Xe,tt);P.pixelStorei(P.UNPACK_ROW_LENGTH,Kt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,qe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Lt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Wn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,bt),I===0&&L.generateMipmaps&&P.generateMipmap(be),we.unbindTexture()},this.copyTextureToTexture3D=function(x,L,k=null,B=null,I=0){return x.isTexture!==!0&&(Oi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,B=arguments[1]||null,x=arguments[2],L=arguments[3],I=arguments[4]||0),Oi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,L,k,B,I)},this.initRenderTarget=function(x){Ee.get(x).__webglFramebuffer===void 0&&E.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?E.setTextureCube(x,0):x.isData3DTexture?E.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?E.setTexture2DArray(x,0):E.setTexture2D(x,0),we.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,we.reset(),je.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}class kp extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qt,this.environmentIntensity=1,this.environmentRotation=new qt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Bp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ts,this.updateRanges=[],this.version=0,this.uuid=on()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,a=this.stride;r<a;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=on()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=on()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const pt=new N;class Nr{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ft(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ft(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ft(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ft(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),r=$e(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),r=$e(r,this.array),a=$e(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=a,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[r+a])}return new Vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Nr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[r+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class cl extends Ki{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ai;const Ui=new N,si=new N,oi=new N,li=new ke,Ni=new ke,hl=new rt,xr=new N,Fi=new N,yr=new N,bo=new ke,ma=new ke,Eo=new ke;class zp extends St{constructor(e=new cl){if(super(),this.isSprite=!0,this.type="Sprite",ai===void 0){ai=new En;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Bp(t,5);ai.setIndex([0,1,2,0,2,3]),ai.setAttribute("position",new Nr(n,3,0,!1)),ai.setAttribute("uv",new Nr(n,2,3,!1))}this.geometry=ai,this.material=e,this.center=new ke(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),si.setFromMatrixScale(this.matrixWorld),hl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),oi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&si.multiplyScalar(-oi.z);const n=this.material.rotation;let r,a;n!==0&&(a=Math.cos(n),r=Math.sin(n));const s=this.center;Mr(xr.set(-.5,-.5,0),oi,s,si,r,a),Mr(Fi.set(.5,-.5,0),oi,s,si,r,a),Mr(yr.set(.5,.5,0),oi,s,si,r,a),bo.set(0,0),ma.set(1,0),Eo.set(1,1);let o=e.ray.intersectTriangle(xr,Fi,yr,!1,Ui);if(o===null&&(Mr(Fi.set(-.5,.5,0),oi,s,si,r,a),ma.set(0,1),o=e.ray.intersectTriangle(xr,yr,Fi,!1,Ui),o===null))return;const l=e.ray.origin.distanceTo(Ui);l<e.near||l>e.far||t.push({distance:l,point:Ui.clone(),uv:Pt.getInterpolation(Ui,xr,Fi,yr,bo,ma,Eo,new ke),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Mr(i,e,t,n,r,a){li.subVectors(i,t).addScalar(.5).multiply(n),r!==void 0?(Ni.x=a*li.x-r*li.y,Ni.y=r*li.x+a*li.y):Ni.copy(li),i.copy(e),i.x+=Ni.x,i.y+=Ni.y,i.applyMatrix4(hl)}class wo extends _t{constructor(e,t,n,r,a,s,o,l,c){super(e,t,n,r,a,s,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rs}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rs);const at={ink:0,white:1,accent:2,dark:3,leaf:4},fi=[.05,.034,.09,.28],Gt=.045,Bi=8,zi=22,ul=-99,Nn=(i,e,t=0)=>Math.hypot(i,e,t),is=(i,e,t)=>Math.min(t,Math.max(e,i));function Vp(i,e){const[t,n,r]=e.a,a=i[0]-t,s=i[1]-n,o=i[2]-r,l=e.r;if(e.ty===0){const g=Nn(a/l[0],s/l[1],o/l[2]),_=Nn(a/(l[0]*l[0]),s/(l[1]*l[1]),o/(l[2]*l[2]));return g*(g-1)/Math.max(_,1e-5)}if(e.ty===1){const g=e.b,_=g[0]-t,d=g[1]-n,u=g[2]-r,w=_*_+d*d+u*u,b=l[0]-l[1],M=w-b*b,U=1/w,T=a*_+s*d+o*u,A=T-w,C=a*w-_*T,S=s*w-d*T,y=o*w-u*T,R=C*C+S*S+y*y,W=T*T*w,z=A*A*w,X=Math.sign(b)*b*b*R;return Math.sign(A)*M*z>X?Math.sqrt(R+z)*U-l[1]:Math.sign(T)*M*W<X?Math.sqrt(R+W)*U-l[0]:(Math.sqrt(R*M*U)+T*b)*U-l[0]}if(e.ty===2){const g=e.b,_=Math.abs(a)-g[0]+l[0],d=Math.abs(s)-g[1]+l[0],u=Math.abs(o)-g[2]+l[0];return Nn(Math.max(_,0),Math.max(d,0),Math.max(u,0))+Math.min(Math.max(_,d,u),0)-l[0]}const c=e.b,h=a*c[0]+s*c[1]+o*c[2],p=Nn(a-c[0]*h,s-c[1]*h,o-c[2]*h);if(e.ty===3)return Nn(p-l[0],h)-l[1];const m=Math.abs(p)-l[0]+l[2],f=Math.abs(h)-l[1]+l[2];return Math.min(Math.max(m,f),0)+Nn(Math.max(m,0),Math.max(f,0))-l[2]}function Hp(i,e,t=0){let n=1e3;return i.forEach((r,a)=>{const s=Vp(e,r)-t*fi[r.fur??0],o=r.k??0;if(a===0){n=s;return}if(o<=0){n=Math.min(n,s);return}const l=is(.5+.5*(s-n)/o,0,1);n=s+(n-s)*l-o*l*(1-l)}),n}function Sr(i,e,t,n=6){let r=0;for(let a=0;a<96&&r<n;a++){const s=Hp(i,[e[0]+t[0]*r,e[1]+t[1]*r,e[2]+t[2]*r],1);if(s<8e-4)return r;r+=Math.max(s*.9,8e-4)}return null}const Ln=i=>Number.isInteger(i)?`${i}.0`:`${+i.toFixed(5)}`;function Gp(i,e){var m;if(i.some(f=>f.ty>2&&f.ty!==6)||((m=i[0])==null?void 0:m.ty)===6)return null;const t=(f,g)=>`${f}[${g}]`,n=(f,g,_,d,u)=>{const w=t(_,g),b=t(d,g),M=t(u,g);return f.ty===0?`sdEllipsoid(p - ${w}.xyz, ${M}.xyz)`:f.ty===1?`sdRoundCone(p, ${w}.xyz, ${b}.xyz, ${M}.x, ${M}.y)`:f.ty===2?`sdRBox(p - ${w}.xyz, ${b}.xyz, ${M}.x)`:f.ty===3?`sdRing(p - ${w}.xyz, ${b}.xyz, ${M}.x, ${M}.y)`:f.ty===4?`sdDisc(p - ${w}.xyz, ${b}.xyz, ${M}.xyz)`:f.ty===5?`sdArc(p - ${w}.xyz, ${b}.x, ${M}.xyz)`:`layerD(d0, p.y, ${M}.x, ${w}.y, ${b}.y)`},r=(f,g,_)=>{const d=t("uFA",g),u=t("uFB",g),w=t("uFR",g);return f.ty===0?`sdEllipsoidG(p - ${d}.xyz, ${w}.xyz, ${_})`:f.ty===1?`sdRoundConeG(p, ${d}.xyz, ${u}.xyz, ${w}.x, ${w}.y, ${_})`:f.ty===2?`sdRBoxG(p - ${d}.xyz, ${u}.xyz, ${w}.x, ${_})`:`layerG(d0, g0, p.y, ${w}.x, ${d}.y, ${u}.y, ${_})`},a=i.slice(0,Bi).map((f,g)=>({q:f,i:g,L:(f.fur??0)===0?"BODY_PILE":Ln(fi[f.fur??0]),F:`vec4(uFurC[${f.fur??0}], ${Ln(f.fur??0)})`,k:f.k??0})),s=(f,g,_,d)=>_>0?`  h = clamp(0.5 + 0.5 * (di - d) / ${Ln(_)}, 0.0, 1.0); d = mix(di, d, h) - ${Ln(_)} * h * (1.0 - h); len = mix(${f}, len, h); fur = mix(${g}, fur, h);${d&&" n = mix(gi, n, h);"}`:`  if (di < d) { d = di; len = ${f}; fur = ${g};${d&&" n = gi;"} }`,o=a.map(({q:f,i:g,L:_,F:d,k:u})=>g===0?`  float d0 = ${n(f,0,"uFA","uFB","uFR")};
  float d = d0 - pile * ${_}, di, h;
  len = ${_}; fur = ${d};`:`  di = ${n(f,g,"uFA","uFB","uFR")} - pile * ${_};
${s(_,d,u,"")}`),l=a.map(({q:f,i:g,L:_,F:d,k:u})=>g===0?`  vec3 g0, gi;
  float d0 = ${r(f,0,"g0")};
  float d = d0, di, h;
  n = g0; len = ${_}; fur = ${d};`:`  di = ${r(f,g,"gi")};
${s(_,d,u,"n")}`),c=`float pileOf(float kind) { return kind < 0.5 ? BODY_PILE : kind < 1.5 ? ${Ln(fi[1])} : kind < 2.5 ? ${Ln(fi[2])} : ${Ln(fi[3])}; }
float cloth(vec3 p, float pile, out float len, out vec4 fur) {
${o.join(`
`)}
#ifdef MAT_DISPLACE
  if (gDetail > 0.5 && fur.a < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * fur.a);
#endif
  return d;
}
float clothN(vec3 p, out float len, out vec4 fur, out vec3 n) {
${l.join(`
`)}
  n = normalize(n);
  return d;
}
`,p=`float solid(vec3 p, out vec3 col, out float rough) {
  float d = 1e3, di;
  col = INK; rough = 0.2;
${e.slice(0,zi).map((f,g)=>`  di = ${n(f,g,"uSA","uSB","uSR")}; if (di < d) { d = di; col = uSolC[int(uSB[${g}].w + 0.5)]; rough = uSR[${g}].w; }`).join(`
`)}
  return d;
}
`;return{cloth:c,solid:p}}const en=(i,e,t)=>({ty:0,a:i,r:e,k:t}),gt=(i,e,t,n,r)=>({ty:1,a:i,b:e,r:[t,n,0],k:r}),To={pom:{parts:[en([0,.8,0],[.98,.86,.9])],eye:[.37,.86]},bean:{parts:[gt([0,.6,0],[0,1.34,0],.66,.55)],eye:[.27,1.16],scale:.9},drop:{parts:[en([0,.74,0],[.92,.8,.86]),gt([0,.98,0],[.03,1.84,0],.62,.085,.3)],eye:[.36,.8]},gumdrop:{parts:[gt([0,.5,0],[0,1.2,0],.88,.5)],eye:[.34,.8]},cub:{parts:[en([0,.8,0],[.96,.86,.88]),en([-.6,1.57,0],[.26,.26,.17],.07),en([.6,1.57,0],[.26,.26,.17],.07)],eye:[.36,.84]},frog:{parts:[en([0,.7,0],[1.06,.76,.88]),en([-.46,1.3,.14],[.36,.36,.34],.2),en([.46,1.3,.14],[.36,.36,.34],.2)],eye:[.46,1.34],onBumps:!0},tofu:{parts:[{ty:2,a:[0,.78,0],b:[.82,.82,.68],r:[.36,0,0]}],eye:[.36,.86]},kitten:{parts:[en([0,.8,0],[.96,.86,.88]),gt([-.52,1.36,0],[-.7,1.84,0],.27,.05,.1),gt([.52,1.36,0],[.7,1.84,0],.27,.05,.1)],eye:[.36,.84]}};function Wp(i){const e=To[i.shape]??To.pom,t=e.parts.map(V=>({...V,fur:0})),n=nn[i.colour]??nn.lime,r=nn[i.accent??"snow"]??nn.snow,a=[...t],s=[],o=(V,F)=>3-(Sr(t,[V,F,3],[0,0,-1])??3),l=(V=0,F=0)=>4-(Sr(t,[V,4,F],[0,-1,0])??4),c=(V,F)=>{const q=[Math.sin(F),0,Math.cos(F)];return 3-(Sr(t,[q[0]*3,V,q[2]*3],[-q[0],0,-q[2]])??3)},h=l(),[p,m]=e.eye,f=e.scale??1,g=i.eyes,_=g==="round"||g==="sparkle"?[.112*f,.112*f,.075]:g==="bead"?[.064,.064,.05]:g==="googly"?[.2*f,.2*f,.13]:[.088*f,.128*f,.07],d=g==="bead"?p*1.22:p,u=V=>{if(e.onBumps){const F=t[V<0?1:2],q=[V*.16,.1,.98],Q=Nn(...q),te=Sr(t,[F.a[0]+q[0]/Q*2,F.a[1]+q[1]/Q*2,F.a[2]+q[2]/Q*2],[-q[0]/Q,-.1/Q,-.98/Q])??2;return[F.a[0]+q[0]/Q*(2-te),F.a[1]+q[1]/Q*(2-te),F.a[2]+q[2]/Q*(2-te)]}return[V*d,m,o(V*d,m)]},w=[u(-1),u(1)],b=(g==="googly"?.045:.03)-(i.material==="boucle"||i.material==="sugar"?.03:0);if(i.glasses!=="none"&&!e.onBumps){const V=Math.max(.19*f,_[0]+.07),F=Math.max(d,V+.035),q=m+.005;let Q=0;for(let pe=0;pe<12;pe++){const Ie=pe/12*Math.PI*2;Q=Math.max(Q,o(F+Math.cos(Ie)*V,q+Math.sin(Ie)*V),o(-F+Math.cos(Ie)*V,q+Math.sin(Ie)*V))}Q+=.03;const te=i.glasses==="shades",le=te?.026:.021;for(const pe of[-1,1]){s.push({ty:3,a:[pe*F,q,Q],b:[0,0,1],r:[V,le,0],col:at.ink,rough:.2}),te&&s.push({ty:4,a:[pe*F,q,Q],b:[0,0,1],r:[V,.014,.012],col:at.ink,rough:.06});const Ie=.95,Fe=1.75,Ve=c(q,pe*Ie)+.03,P=c(q+.02,pe*Fe)+.012,ot=[Math.sin(pe*Ie)*Ve,q+.01,Math.cos(pe*Ie)*Ve],Oe=[Math.sin(pe*Fe)*P,q+.02,Math.cos(pe*Fe)*P];s.push(gt([pe*(F+V),q,Q],ot,.016,.015),gt(ot,Oe,.015,.014)),s[s.length-1].col=s[s.length-2].col=at.ink,s[s.length-1].rough=s[s.length-2].rough=.2}const ve=F-V*.96;s.push({...gt([-ve,q+.035,Q],[ve,q+.035,Q],.017,.017),col:at.ink,rough:.2})}let M=h;if(i.extra==="headphones"){let V=.3,F=h-.15;const q=ve=>h+.07-ve-(c(ve,Math.PI/2)+.055);for(let ve=0;ve<24;ve++){const pe=(V+F)/2;q(pe)>0?V=pe:F=pe}const Q=(V+F)/2,te=h+.07-Q,le=c(Q,Math.PI/2);s.push({ty:5,a:[0,Q,0],b:[1,0,0],r:[te,.034,1.62],col:at.dark,rough:.3});for(const ve of[-1,1])s.push({ty:4,a:[ve*(le+.075),Q,0],b:[1,0,0],r:[.215,.085,.05],col:at.accent,rough:.22}),s.push({ty:4,a:[ve*(le+0),Q,0],b:[1,0,0],r:[.19,.05,.04],col:at.dark,rough:.5});M=h+.12}else if(i.extra==="beanie"){const V=h-.34;a.push({ty:6,a:[0,V,0],b:[0,9,0],r:[.05,0,0],k:.012,fur:1}),a.push({ty:6,a:[0,V-.03,0],b:[0,V+.13,0],r:[.1,0,0],k:.012,fur:1}),a.push({ty:0,a:[0,h+.2,0],r:[.13,.13,.13],k:.02,fur:2}),M=h+.44}else if(i.extra==="sprout")s.push({...gt([0,h-.04,0],[.01,h+.2,0],.024,.02),col:at.leaf,rough:.7}),a.push({...gt([.01,h+.2,0],[-.2,h+.36,0],.022,.075,.03),fur:1}),a.push({...gt([.01,h+.2,0],[.19,h+.4,0],.022,.085,.03),fur:1}),M=h+.56;else if(i.extra==="antenna")s.push({...gt([0,h-.04,0],[0,h+.3,0],.017,.015),col:at.dark,rough:.35}),s.push({ty:0,a:[0,h+.36,0],r:[.078,.078,.078],col:at.accent,rough:.12}),M=h+.46;else if(i.extra==="scarf"){const V=Math.max(.2,m-(e.onBumps?.86:.4));a.push({ty:6,a:[0,V-.11,0],b:[0,V+.11,0],r:[.07,0,0],k:.012,fur:1});const F=o(.3,V-.12);a.push({...gt([.3,V-.02,F+.02],[.36,V-.33,o(.36,Math.max(.05,V-.33))+.03],.075,.09,.03),fur:1})}else i.extra==="cap"?(s.push({ty:4,a:[0,h+.02,0],b:[0,1,0],r:[.3,.075,.03],col:at.dark,rough:.6}),s.push({ty:2,a:[0,h+.115,0],b:[.43,.022,.43],r:[.018,0,0],col:at.dark,rough:.6}),s.push({...gt([0,h+.145,0],[.4,h+.14,.34],.012,.012),col:at.accent,rough:.5}),s.push({...gt([.4,h+.14,.34],[.42,h-.1,.36],.012,.03),col:at.accent,rough:.5}),M=h+.2):i.extra==="tuft"&&(a.push({ty:0,a:[0,h-.02,.06],r:[.06,.06,.06],k:.05,fur:3}),M=h+.3);const U=V=>({ty:V,a:[0,ul,0],b:[1,0,0],r:[.001,.001,.001],col:at.ink,rough:.5}),T=g==="smile"?[5]:g==="googly"?[0,0,5]:g==="sparkle"?[0,0,0,5]:[0,5],A=(V,F,q,Q)=>{const te=[];return w.forEach((le,ve)=>{const pe=ve?1:-1,Ie=T.map(U),Fe=T.length-1;if(V>.5||g==="smile"){const Ve=V>1.5?-1:1,P=Math.max(_[0],.085)*(g==="googly"?.62:.95);Ie[Fe]={ty:5,a:[le[0],le[1]-Ve*P*.45,le[2]-.012],b:[Ve,0,0],r:[P,.024,1.15],col:at.ink,rough:.55}}else{const Ve=le[2]-b;if(g==="googly"){Ie[0]={ty:0,a:[le[0],le[1],Ve],r:[_[0],_[1]*Math.max(F,.12),_[2]],col:at.white,rough:.12};const P=is(q*2.2,-1,1)*.07-pe*.012,ot=is(Q*2.6,-1,1)*.06,Oe=_[2]*Math.sqrt(Math.max(.2,1-(P*P+ot*ot)/(_[0]*_[0])));Ie[1]={ty:0,a:[le[0]+P,le[1]+ot,Ve+Oe-.03],r:[.105*f,.105*f*Math.max(F,.12),.05],col:at.ink,rough:.08}}else Ie[0]={ty:0,a:[le[0]+q*.5,le[1]+Q*.5,Ve],r:[_[0],_[1]*Math.max(F,.1),_[2]],col:at.ink,rough:.08},g==="sparkle"&&F>.6&&(Ie[1]={ty:0,a:[le[0]+q*.5-.036,le[1]+Q*.5+.04,Ve+_[2]*.83],r:[.031,.031,.016],col:at.white,rough:.3},Ie[2]={ty:0,a:[le[0]+q*.5+.034,le[1]+Q*.5-.038,Ve+_[2]*.86],r:[.015,.015,.01],col:at.white,rough:.3})}te.push(...Ie)}),te.concat(s)};let C=9,S=-9,y=9,R=-9,W=0;const z=(V,F)=>{if(V.ty===6)return;const q=V.ty===1?[V.a,V.b]:[V.a],Q=V.ty===0?Math.max(V.r[0],V.r[2]):V.ty===1?Math.max(V.r[0],V.r[1]):V.ty===2?Math.max(V.b[0],V.b[2]):V.r[0]+V.r[1]+.1,te=V.ty===0?V.r[0]:V.ty===2?V.b[0]:Q,le=V.ty===0?V.r[2]:V.ty===2?V.b[2]:Q,ve=V.ty===0?V.r[1]:V.ty===2?V.b[1]:Q;for(const pe of q)C=Math.min(C,pe[0]-te-F),S=Math.max(S,pe[0]+te+F),y=Math.min(y,pe[2]-le-F),R=Math.max(R,pe[2]+le+F),W=Math.max(W,pe[1]+ve+F)};a.forEach(V=>z(V,fi[V.fur??0]+.03+(a.some(F=>F.ty===6)?.11:0))),A(0,1,0,0).forEach(V=>z(V,.03)),M=Math.max(M,W-.03);const X=Math.max(S,-C),J=Math.max(R,-y),Y=2.4,ee=9.8,H=M*.5,ae=Math.hypot(Y-H,ee),fe=2*Math.atan(Math.max(M*.5+.08,X*.98)*1.14/ae)*180/Math.PI,Me=(i.material??"plush")!=="plush",Ce=Me?.07:0;return Me&&a.forEach((V,F)=>{(V.fur??0)===0?a[F]=V.ty===0?{...V,r:[V.r[0]+Gt,V.r[1]+Gt,V.r[2]+Gt]}:V.ty===1?{...V,r:[V.r[0]+Gt,V.r[1]+Gt,V.r[2]]}:{...V,b:[V.b[0]+Gt,V.b[1]+Gt,V.b[2]+Gt],r:[V.r[0]+Gt,V.r[1],V.r[2]]}:V.ty===6&&(a[F]={...V,r:[Math.max(V.r[0]-Gt,.006),V.r[1],V.r[2]]})}),{glsl:Gp(a,A(0,1,0,0)),bare:Me,pile:a.some(V=>(V.fur??0)!==0),fur:a,solids:A,furC:[n,i.extra==="sprout"?nn.leaf:r,i.extra==="beanie"?nn.snow:r,r],solidC:["#060608","#f6f7f9",r,"#23262d","#3f9b2f","#c9ced6"],box:[-X-Ce,-.1,-J-Ce,X+Ce,M+.06+Ce,J+Ce],top:h,cam:[Y,ee,H*.97,fe],shadow:[X*2.2,J*1.6],eyeY:m}}const Xp=`// The material library: what every surface material can use. (Read this before writing a material.)
//
// A material is one file in this folder. It is pasted into the fragment shader after this library and defines
//
//     vec4 matShade(vec3 p, vec3 n, vec3 v, float t)
//
//   p   the point of the body the eye's ray met, in the mascot's space: the floor is y = 0, the front faces +z, the
//       body is about 2 units tall and stays put while the mascot moves (so a pattern in p sticks to it)
//   n   the SMOOTH body's outward normal there (unit); add your own relief to it
//   v   the direction toward the eye (unit)
//   t   how far away the eye is (gPix, the size of a pixel at p, is already set)
//   returns  rgb: the light going to the eye (linear, before exposure and the tone curve)
//            a:   how much of the page behind it hides (1: opaque; see seeThrough for clear things)
//
// A file may start with a header: lines between "//#header" and "//#body" are placed before everything else, for
// defines that change the framework:
//     #define MAT_DISPLACE 0.05   the material has real relief: the body's surface stands matDisplace(p) (0 .. this
//                                 much) above its smooth shape, in silhouette, shadows and all. Then also define
//                                 float matDisplace(vec3 p). It runs at every step of every ray near the body: keep
//                                 it cheap, and fade it to its average where it is smaller than a pixel (resolved()).
//     #define MAT_STEP 0.6        take smaller steps toward the body (for relief with steep sides, which a full
//                                 step could jump through). 0.9 if not said.
//
// Units of light. Lamps are directions with a colour: a matte white surface facing the key lamp sends back uKeyCol
// (about 1). So a diffuse surface is  albedo * sum(lampCol * max(dot(n, lampDir), 0)), and a lobe f (in 1/sr) goes in as
// f * PI. Mirror-like things don't use the lamps as points at all: they reflect the studio (studioAt), where each
// lamp is a soft-edged panel of the right brightness for the light it gives.
//
// GLSL ES 3.00 reserves many ordinary words: don't name anything half, sample, input, output, filter, common, flat,
// smooth, active, fixed, packed, patch, union, long, short, double, class, public, static, inline, external or
// interface. A compile error draws nothing at all: the harness prints it with the line.
//
// From the rest of the shader you may use: uMain (the body's colour, linear), uAccent, uKey/uFill/uBack and their
// uKeyCol/uFillCol/uBackCol, uUp, uFwd (toward the camera along the floor), uBackdrop (the page behind), uDark,
// uTime (seconds; it stands still with "reduce motion"), gPix, snoise(q, lod), hash33, ign(gl_FragCoord.xy), smin,
// smax, lum, max3, D_Charlie, V_Neubelt, sheenIBL, skyIrr, and everything below.

// ---------------------------------------------------------------- small things
float sq(float x) { return x * x; }
float pow5(float x) { float x2 = x * x; return x2 * x2 * x; }
float sat(float x) { return clamp(x, 0.0, 1.0); }
// a frame on the surface: two directions along it
void frame(vec3 n, out vec3 t, out vec3 b) {
  t = normalize(cross(n, abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  b = cross(n, t);
}
// the way round the body (level, about the upright axis through its middle): for threads, brushing, rows of stitches.
// It turns smoothly everywhere but on that axis itself (the very top).
vec3 around(vec3 p, vec3 n) {
  vec3 a = cross(vec3(0.0, 1.0, 0.0), vec3(p.x, 0.0, p.z));
  a -= n * dot(a, n);
  return dot(a, a) > 1e-6 ? normalize(a) : normalize(cross(n, vec3(0.0, 0.0, 1.0)));
}

// ---------------------------------------------------------------- level of detail
// 1 where something this big (in the mascot's units) covers a few pixels, 0 where it is smaller than one. Fade fine
// detail toward its average with this, so nothing shimmers at small sizes.
float resolved(float size) { return 1.0 - smoothstep(0.35, 1.0, gPix / size); }
// the same for a pattern lying on a surface seen at a slant (the cosine of its angle to the eye): a pixel covers
// more of it there, so a pattern that is clear face-on would turn to rings toward the outline
float resolvedOn(float size, float cosine) { return resolved(size * clamp(cosine, 0.05, 1.0)); }
// noise at a frequency (cells per unit), filtered for this pixel
float noiseAt(vec3 p, float freq) { return snoise(p * freq, log2(max(gPix * freq, 1e-6)) + 0.5); }

// ---------------------------------------------------------------- the scene, for a material's own questions
// (All of these leave out the material's own relief unless they say otherwise: gDetail is 0 while they ask.)
// the distance to the smooth body and what it wears (negative inside)
float bodySmooth(vec3 p) { float keep = gDetail; gDetail = 0.0; float d = skinD(p); gDetail = keep; return d; }
// how open the sky is at p: 1 in the open, less in creases and under things (the body, what it wears, solid parts)
float occlusion(vec3 p, vec3 n) { float keep = gDetail; gDetail = 0.0; float a = calcAO(p, n); gDetail = keep; return a; }
// the same, with the material's relief (dearer: for a relief deep enough to shade itself)
float occlusionRelief(vec3 p, vec3 n) { return calcAO(p, n); }
// the key lamp's soft shadow at p: 1 lit, 0 in shadow. k: 3 very soft .. 8 crisp
float shadowKey(vec3 p, vec3 n, float k) { float keep = gDetail; gDetail = 0.0; float s = softShadow(p + n * 0.012, uKey, k); gDetail = keep; return s; }
float shadowKeyRelief(vec3 p, vec3 n, float k) { return softShadow(p + n * 0.012, uKey, k); }
// can p see far along dir, or is the mascot itself in the way? (1 clear, 0 blocked; soft.) For reflections.
float clearAlong(vec3 p, vec3 n, vec3 dir) { float keep = gDetail; gDetail = 0.0; float s = softShadow(p + n * 0.012, dir, 6.0); gDetail = keep; return s; }
// how the smooth body curves at p: positive on a bulge, negative in a crease (about 2 / radius on a ball). h: the
// scale to measure at (0.02 fine .. 0.1 broad). Six readings of the distance.
float curvature(vec3 p, float h) {
  float keep = gDetail; gDetail = 0.0;
  vec2 e = vec2(h, 0.0);
  float c = (skinD(p + e.xyy) + skinD(p - e.xyy) + skinD(p + e.yxy) + skinD(p - e.yxy) + skinD(p + e.yyx) + skinD(p - e.yyx) - 6.0 * skinD(p)) / (h * h);
  gDetail = keep;
  return c;
}
// how much body lies along dir from p (p on the surface or just under it), up to far. For light coming through.
float thickness(vec3 p, vec3 dir, float far) {
  float keep = gDetail; gDetail = 0.0;
  float t = 0.02;
  for (int i = 0; i < 14; i++) {
    float d = skinD(p + dir * t);
    if (d > 0.0 || t > far) break;
    t += max(-d, 0.02);
  }
  gDetail = keep;
  return min(t, far);
}
// Follow a ray inside the body from p (on its surface) along dir until it comes out, or meets a solid part on the
// way (the back of an eye). Returns how far it went. q: where it ended; nq: the smooth body's outward normal there;
// hit.a: 1 if it ended on a solid part (then hit.rgb is that part's colour).
float through(vec3 p, vec3 dir, out vec3 q, out vec3 nq, out vec4 hit) {
  float keep = gDetail; gDetail = 0.0;
  float t = 0.03;
  hit = vec4(0.0);
  for (int i = 0; i < 28; i++) {
    q = p + dir * t;
    float d = skinD(q);
    if (d > -0.002) break;
    vec3 c; float r;
    float s = solidNear(q, c, r);
    if (s < 0.004) { hit = vec4(c, 1.0); break; }
    t += max(min(-d, s) * 0.95, 0.01);
    if (t > 4.0) break;
  }
  q = p + dir * t;
  nq = bodyNormal(q);
  gDetail = keep;
  return t;
}
// Follow a ray outside the body from p along dir: how far until it meets the mascot again (its body, what it wears,
// a solid part), or -1 if it gets away. For a mirror's reflection of the mascot in itself.
float meets(vec3 p, vec3 dir, float far) {
  float keep = gDetail; gDetail = 0.0;
  float t = 0.02, at = -1.0;
  for (int i = 0; i < 40; i++) {
    float d = mapD(p + dir * t);
    if (d < 0.002) { at = t; break; }
    t += d * 0.95;
    if (t > far) break;
  }
  gDetail = keep;
  return at;
}

// ---------------------------------------------------------------- the studio
// What a mirror sees: a photographer's studio laid out round the mascot. A big soft key panel in front and above, a
// tall fill panel to the side, a strip behind for the rim, walls that are brightest low down, a darker side where the
// camera stands (a mirror needs something dark to have lines), and the floor, which is the page. Each panel is as
// bright as the light its lamp gives, so a mirror and a matte surface agree. \`blur\` softens everything, for rough
// surfaces: pass roughness squared.
struct Studio { vec3 room; vec3 key; vec3 fill; vec3 back; };   // light arriving from a direction, by where it comes from

// a soft-edged rounded panel seen in direction dir. c: its middle (unit); ax, ay: its sideways and upward axes;
// hs: its half sizes in radians. Blurring it wider than it is dims it (the light is the same, spread out).
float panel(vec3 dir, vec3 c, vec3 ax, vec3 ay, vec2 hs, float blur) {
  float z = dot(dir, c);
  vec2 q = vec2(atan(dot(dir, ax), z), atan(dot(dir, ay), z));
  float soft = 0.035 + blur;
  float r = 0.3 * min(hs.x, hs.y);
  vec2 e = abs(q) - hs + r;
  float d = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - r;
  vec2 dim = hs / sqrt(hs * hs + soft * soft);
  return (1.0 - smoothstep(-soft, soft, d)) * dim.x * dim.y;
}
const vec2 KEY_HALF = vec2(0.46, 0.34), FILL_HALF = vec2(0.13, 0.48), BACK_HALF = vec2(0.5, 0.11);
Studio studio(vec3 dir, float blur) {
  Studio s;
  float up = dot(dir, uUp), day = 1.0 - uDark;
  // the room: walls brightest low down, darker toward the ceiling and on the camera's side; under the horizon, the floor
  vec3 wall = mix(mix(vec3(0.14), vec3(0.62), day), mix(vec3(0.045), vec3(0.3), day), smoothstep(0.0, 0.9, up));
  wall *= mix(1.0, 0.35, smoothstep(0.15, 0.95, dot(dir, uFwd)) * (1.0 - smoothstep(0.45, 0.9, up)));
  vec3 ground = (uBackdrop + 0.045 * uDark) * mix(0.95, 0.6, smoothstep(0.0, -1.0, up));   // (a dark page still catches a little of the lamps)
  float w = 0.02 + blur;
  s.room = mix(ground, wall, smoothstep(-w, w, up));
  vec3 kx = normalize(cross(uUp, uKey)), fx = normalize(cross(uUp, uFill)), bx = normalize(cross(uUp, uBack));
  s.key = uKeyCol * (PI / (4.0 * KEY_HALF.x * KEY_HALF.y)) * panel(dir, uKey, kx, cross(uKey, kx), KEY_HALF, blur);
  s.fill = uFillCol * (PI / (4.0 * FILL_HALF.x * FILL_HALF.y)) * panel(dir, uFill, fx, cross(uFill, fx), FILL_HALF, blur);
  s.back = uBackCol * (PI / (4.0 * BACK_HALF.x * BACK_HALF.y)) * panel(dir, uBack, bx, cross(uBack, bx), BACK_HALF, blur);
  return s;
}
// the mascot's own soft shadow on the floor at x (the floor's x, z): 0 none .. about 0.4 right under it
float floorShadow(vec2 x) {
  float r = length((x - vec2(0.0, 0.04)) / max(uShadow, vec2(1e-3)));
  return r < 0.5 ? mix(0.4, 0.14, r * 2.0) : 0.14 * (1.0 - clamp(r * 2.0 - 1.0, 0.0, 1.0));
}
// the studio as seen from p: the floor near the mascot carries its shadow
Studio studioAt(vec3 p, vec3 dir, float blur) {
  Studio s = studio(dir, blur);
  if (dir.y < -0.02) s.room *= 1.0 - floorShadow(p.xz + dir.xz * (max(p.y, 0.0) / -dir.y)) * smoothstep(-0.02, -0.2, dir.y);
  return s;
}
// all of it added up, with what dims each part: open = how open the sky is (occlusion), lit = the key's shadow
vec3 studioLight(Studio s, float open, float lit) { return s.room * open + s.key * lit + s.fill * mix(0.6, 1.0, open) + s.back * open; }

// ---------------------------------------------------------------- lobes
// the three lamps as plain directions, for lobes too broad to show a lamp's shape: 0 key, 1 fill, 2 back
vec3 lampDir(int i) { return i == 0 ? uKey : i == 1 ? uFill : uBack; }
vec3 lampCol(int i) { return i == 0 ? uKeyCol : i == 1 ? uFillCol : uBackCol; }
float D_GGX(float NoH, float a) { float a2 = a * a; float d = NoH * NoH * (a2 - 1.0) + 1.0; return a2 / (PI * d * d); }
float V_GGX(float NoV, float NoL, float a) {   // Smith, height-correlated (already holds the 1 / (4 NoV NoL))
  float a2 = a * a;
  return 0.5 / max(NoL * sqrt(NoV * NoV * (1.0 - a2) + a2) + NoV * sqrt(NoL * NoL * (1.0 - a2) + a2), 1e-5);
}
// anisotropic GGX: at, ab are the roughnesses (alpha) along the tangent t and across it
float D_GGXaniso(float NoH, float ToH, float BoH, float at, float ab) {
  float d = ToH * ToH / (at * at) + BoH * BoH / (ab * ab) + NoH * NoH;
  return 1.0 / (PI * at * ab * d * d);
}
float V_GGXaniso(float NoV, float NoL, float ToV, float BoV, float ToL, float BoL, float at, float ab) {
  return 0.5 / max(NoL * length(vec3(at * ToV, ab * BoV, NoV)) + NoV * length(vec3(at * ToL, ab * BoL, NoL)), 1e-5);
}
vec3 F_Schlick(vec3 f0, float VoH) { return f0 + (1.0 - f0) * pow5(1.0 - VoH); }
float F_Schlick1(float f0, float VoH) { return f0 + (1.0 - f0) * pow5(1.0 - VoH); }
// a real mirror between two clear things: how much is reflected (n1 -> n2), exactly. cosI: cosine at the surface.
float fresnel(float cosI, float n1, float n2) {
  float s2 = sq(n1 / n2) * (1.0 - cosI * cosI);
  if (s2 >= 1.0) return 1.0;                       // total internal reflection
  float cosT = sqrt(1.0 - s2);
  float rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT), rp = (n1 * cosT - n2 * cosI) / (n1 * cosT + n2 * cosI);
  return 0.5 * (rs * rs + rp * rp);
}
// how much of the studio a surface of this roughness mirrors, facing you at NoV (Karis's fit to the split sum)
vec3 envBRDF(vec3 f0, float rough, float NoV) {
  vec4 r = rough * vec4(-1.0, -0.0275, -0.572, 0.022) + vec4(1.0, 0.0425, 1.04, -0.04);
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  vec2 ab = vec2(-1.04, 1.04) * a004 + r.zw;
  return f0 * ab.x + ab.y;
}
// how much of a mirrored view creases hide (Lagarde): open = occlusion()
float specOcclusion(float NoV, float open, float rough) { return clamp(pow(NoV + open, exp2(-16.0 * rough - 1.0)) - 1.0 + open, 0.0, 1.0); }

// ---------------------------------------------------------------- a plain surface (where most materials start)
struct Surf {
  vec3 base;       // its colour (a metal's colour, for a metal)
  float metal;     // 0 not a metal, 1 a metal
  float rough;     // 0 a mirror .. 1 matte
  float f0;        // how much it mirrors facing you, if not a metal (0.04 for most things)
  float wrap;      // how far diffuse light creeps past the shadow line (0 none .. 0.5 waxy)
  float sheen;     // a fuzz layer's sheen (cloth): 0 none .. 1
  vec3 sheenCol;
  float coat;      // a clear glossy coat on top: 0 none .. 1
  float coatRough;
};
Surf surf(vec3 base, float rough) { return Surf(base, 0.0, rough, 0.04, 0.0, 0.0, vec3(1.0), 0.0, 0.03); }
// its light toward the eye. open: occlusion(p, n); lit: shadowKey(p, n, k). n may carry your relief.
vec3 shade(vec3 p, vec3 n, vec3 v, Surf s, float open, float lit) {
  float NoV = max(dot(n, v), 1e-3);
  vec3 f0 = mix(vec3(s.f0), s.base, s.metal);
  // matte part: the dome and the floor, and the three lamps (the key's shadow falls on the key only)
  vec3 E = skyIrr(n) * open;
  for (int i = 0; i < 3; i++) {
    float w = clamp((dot(n, lampDir(i)) + s.wrap) / (1.0 + s.wrap), 0.0, 1.0);
    E += lampCol(i) * w * (i == 0 ? lit : mix(0.6, 1.0, open));
  }
  vec3 col = s.base * (1.0 - s.metal) * E;
  // mirrored part: the studio (its lamps keep their shapes; a rough surface blurs them)
  float a = s.rough * s.rough;
  vec3 R = normalize(mix(n, reflect(-v, n), (1.0 - a) * (sqrt(1.0 - a) + a)));
  col += studioLight(studioAt(p, R, a), specOcclusion(NoV, open, s.rough), lit) * envBRDF(f0, s.rough, NoV);
  if (s.sheen > 0.0) {          // fuzz: a soft glow toward the edges
    vec3 fz = s.sheenCol * s.sheen;
    col += fz * sheenIBL(NoV, 0.5) * skyIrr(n) * open;
    for (int i = 0; i < 3; i++) {
      vec3 l = lampDir(i);
      float nl = max(dot(n, l), 0.0);
      col += lampCol(i) * fz * D_Charlie(0.5, max(dot(n, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nl) * nl * PI * (i == 0 ? lit : open);
    }
  }
  if (s.coat > 0.0) {           // a clear coat: what is under it shows less where the coat mirrors more
    float Fc = F_Schlick1(0.04, NoV) * s.coat;
    col = col * (1.0 - Fc) + studioLight(studioAt(p, reflect(-v, n), s.coatRough * s.coatRough), specOcclusion(NoV, open, s.coatRough), lit) * Fc;
  }
  return col;
}

// ---------------------------------------------------------------- sparkle
// Grains that flash like tiny mirrors. Seed points sit on a jittered grid in the body's space; near each lies a
// grain facing its own way, and it flashes when it mirrors a lamp into the eye. cell: the grid's size (about the
// spacing of grains); share: how many cells hold a grain (0 .. 1); spread: how far the grains' facings stray from
// the surface's (0.3 nearly flat .. 1 every way); sharp: how exactly a grain must be lined up to flash (0.97 broad ..
// 0.999 pinpoint). Returns how strongly the key (x) and the other lamps (y) flash here. Grains smaller than a pixel
// fade out rather than flicker; they stay put on the body and twinkle as it turns.
vec2 glints(vec3 p, vec3 n, vec3 v, float cell, float share, float spread, float sharp) {
  float vis = 1.0 - smoothstep(0.25, 0.6, gPix / cell);
  if (vis <= 0.0) return vec2(0.0);
  vec3 hk = normalize(uKey + v), hf = normalize(uFill + v), hb = normalize(uBack + v);
  vec3 c0 = floor(p / cell - 0.5);
  float r = max(0.16 * cell, 0.75 * gPix);
  vec2 g = vec2(0.0);
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 h = hash33(c);
    if (h.x > share) continue;
    vec3 o = p - (c + 0.2 + 0.6 * hash33(c + 31.7)) * cell;
    float spot = 1.0 - smoothstep(0.35 * r, r, length(o));
    if (spot <= 0.0) continue;
    vec3 f = normalize(n + (hash33(c + 7.3) * 2.0 - 1.0) * spread);
    g += spot * vec2(smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hk)),
                     max(smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hf)), smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hb))));
  }
  return g * vis * min(1.0, sq(0.16 * cell / r));
}

// ---------------------------------------------------------------- clear things over the page
// A pixel of something clear. shown: the light it sends itself (reflections, glow, whatever is inside it); trans:
// how much of each colour of the page behind gets through (1 clear, 0 opaque). The mascot is drawn over the page, so
// this returns the colour and alpha that give  shown + trans * page  once it is laid over it (exactly, where the
// page is the colour uBackdrop says; closely, where it isn't).
vec4 seeThrough(vec3 shown, vec3 trans) {
  float tmin = min(trans.r, min(trans.g, trans.b));
  float a = 1.0 - tmin;
  return vec4((shown + (trans - tmin) * uBackdrop) / max(a, 1e-3), a);
}
`,qp=`// Boucle: curly, messy looped cloth (teddy fabric).
//
// Real boucle is knitted from a yarn that was overfed as it was spun, so it buckles into loops and curls 2 to 5 mm
// across that stand off the cloth every which way. What you see is a tangle of fuzzy strands with deep, saturated
// shade between them and a nubby outline. Here the strands are real relief. Where a wavy surface in space (a warped
// gyroid) cuts the body, the cut is a curve that wanders and closes on itself like a loop of yarn; two such sets at
// different scales, one over the other, make the tangle. Each strand is a rounded ridge along its curve, so the
// strands are in the outline and shade one another. They are lit as matte, fuzzy yarn (Oren & Nayar, with a
// "Charlie" sheen), darker and deeper in colour down between them. Smaller than a pixel, the tangle becomes an even
// nap of its average height and tone.
//#header
#define MAT_DISPLACE 0.036
#define MAT_STEP 0.6
//#body
// how high the yarn stands at p: 0 between strands .. 1 on top of one
float boucleYarn(vec3 p) {
  // the upper strands: loops about 0.1 across
  vec3 q = p * 30.0 + 1.9 * sin(p.zxy * 11.0 + vec3(0.0, 2.1, 4.2));
  float a = abs(dot(sin(q), cos(q.yzx))) / 39.0;                 // about how far the nearest curve is, along the surface
  // the lower ones: tighter curls, turned another way
  vec3 r = (p.yzx + p.zxy * 0.6) * 41.0 + 1.6 * sin(p * 15.0 + vec3(3.3, 1.2, 5.0));
  float b = abs(dot(sin(r), cos(r.zxy))) / 54.0;
  // and under both, small tight curls that fill the gaps (there is always more yarn underneath)
  vec3 u = (p.zxy - p.yzx * 0.5) * 68.0 + 1.3 * sin(p.yzx * 23.0 + vec3(1.1, 4.0, 2.3));
  float c = abs(dot(sin(u), cos(u.yzx))) / 88.0;
  float ha = sqrt(clamp(1.0 - a * a / (0.019 * 0.019), 0.0, 1.0));     // a strand is round: half a circle across
  float hb = sqrt(clamp(1.0 - b * b / (0.016 * 0.016), 0.0, 1.0));
  float hc = sqrt(clamp(1.0 - c * c / (0.011 * 0.011), 0.0, 1.0));
  return max(max(ha, 0.74 * hb), 0.2 + 0.32 * hc);
}
float matDisplace(vec3 p) {
  float clump = 0.8 + 0.4 * snoise(p * 5.0 + 3.0, 0.0);          // it stands taller in places
  return MAT_DISPLACE * mix(0.5, boucleYarn(p) * clump, resolved(0.02));
}
float boucleMatte(vec3 n, vec3 l, vec3 v, float nl) {             // rough matte yarn (Oren & Nayar, as Fujii wrote it)
  const float sigma = 0.9;
  float s = dot(l, v) - nl * dot(n, v);
  float tt = s > 0.0 ? max(nl, max(dot(n, v), 1e-3)) : 1.0;
  return PI * (1.0 + sigma * s / tt) / (PI + (PI * 0.5 - 2.0 / 3.0) * sigma);
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float seen = resolved(0.02);
  float e = max(0.003, 0.8 * gPix);
  float h = matDisplace(p) / MAT_DISPLACE;                         // 0 down between the strands .. 1 on top
  vec2 dh = vec2(matDisplace(p + tu * e) - matDisplace(p - tu * e), matDisplace(p + tv * e) - matDisplace(p - tv * e)) / (2.0 * e);
  // the yarn's own fuzz: fine fibres wrapped round it, a little unruly
  float fibre = noiseAt(p, 150.0) - 0.5;
  // A strand of yarn is soft and full of air: light gets round it, so it is shaded by a gentler slope than its
  // true one, roughened by the fibres wrapped round it. Its haze of loose fibres glows by the body's slope, not the
  // strand's (a halo over the whole tangle, not a rim on every strand).
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.72 + (tu * fibre + tv * (noiseAt(p + 9.0, 150.0) - 0.5)) * 0.22 * seen);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);
  float deepIn = mix(1.0, smoothstep(0.0, 0.75, h), seen);         // how far up out of the tangle this point is (1: on top)

  vec3 dye = uMain * 0.94;
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.05)) * 0.8;       // the same hue, more of it: light that bounced between strands
  vec3 alb = mix(deep, dye, mix(0.35, 1.0, deepIn)) * (1.0 + 0.1 * fibre * seen) * (1.0 + 0.06 * (noiseAt(p, 4.0) - 0.5));
  float gap = mix(0.42, 1.0, deepIn) * mix(0.6, 1.0, open);        // the strands above keep the sky and the lamps off what is below
  vec3 fuzz = mix(dye, vec3(1.0), 0.45) * 0.42;
  float NoV = max(dot(n, v), 1e-3);
  vec3 col = (alb * skyIrr(N) + fuzz * sheenIBL(NoV, 0.6) * skyIrr(n)) * gap * open;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = clamp((dot(N, l) + 0.25) / 1.25, 0.0, 1.0), nls = max(dot(n, l), 0.0), sh = (i == 0 ? lit : mix(0.6, 1.0, open)) * gap;
    col += lampCol(i) * sh * (alb * nl * boucleMatte(N, l, v, nl) + fuzz * nls * D_Charlie(0.6, max(dot(n, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nls) * PI);
  }
  return vec4(col, 1.0);
}
`,Yp=`// Ceramic: a figure of glazed stoneware.
//
// A glaze is a layer of coloured glass melted onto a matte clay body. You see two things at once: sharp mirror
// reflections off the glass on top, and under them the colour of the glaze, which depends on how thick it lies.
// Molten glaze runs off bulges and edges, where it ends up thin and pale ("breaking"), and gathers in hollows, where
// it is thick, dark and saturated ("pooling"). So the colour here follows how the body curves. The glass coat mirrors
// the studio with a soft falloff, over a surface that wavers very slightly. In close-up there is a fine crackle
// (crazing: the glaze shrank more than the clay), the odd iron speck and pinhole; and at the very bottom the foot is
// left bare, matte clay, where the piece stood in the kiln.
//#header
//#body
// crazing: thin cracks along the borders of irregular cells (the distance to the nearest border, in cells)
float ceramicCraze(vec3 x) {
  vec3 c0 = floor(x - 0.5);
  float d1 = 9.0, d2 = 9.0;
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int k = 0; k < 2; k++) {
    vec3 c = c0 + vec3(float(k), float(y), float(z));
    float d = length(x - (c + 0.15 + 0.7 * hash33(c)));
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return d2 - d1;
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float w0 = noiseAt(p + 6.0, 5.0);
  vec3 N = normalize(n + (tu * (noiseAt(p + 6.0 + tu * 0.05, 5.0) - w0) + tv * (noiseAt(p + 6.0 + tv * 0.05, 5.0) - w0)) * 0.22);   // a glaze is never quite flat
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);

  // how thick the glaze lies: thin on bulges and edges, thick in hollows
  float bulge = curvature(p, 0.06);
  float thick = clamp(0.78 - 0.075 * bulge + 0.55 * (1.0 - open) + 0.25 * (noiseAt(p + 1.0, 2.0) - 0.5), 0.0, 1.0);
  vec3 dye = uMain;
  vec3 clayBody = vec3(0.86, 0.8, 0.7);                                      // pale stoneware
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.06)) * 0.7;
  vec3 glaze = mix(mix(clayBody, dye, 0.6), mix(dye, deep, 0.8), smoothstep(0.25, 0.95, thick));
  // close up: crazing, iron specks, a pinhole here and there
  float seen = resolved(0.012);
  float craze = smoothstep(0.035, 0.0, ceramicCraze(p * 14.0 + 0.5 * noiseAt(p, 9.0))) * seen;
  float speck = smoothstep(0.9, 0.95, noiseAt(p + 3.0, 120.0)) * resolved(0.012);
  glaze = mix(glaze, glaze * 0.6, 0.45 * craze);
  glaze = mix(glaze, vec3(0.2, 0.12, 0.07), 0.6 * speck);

  Surf s = surf(glaze, 0.85);          // the glaze's colour, seen through the glass: matte
  s.coat = 1.0; s.coatRough = 0.035;   // the glass on top
  s.f0 = 0.0;
  // the foot: bare clay, matte
  float foot = 1.0 - smoothstep(0.05, 0.085, p.y + 0.012 * (noiseAt(p, 14.0) - 0.5));
  s.base = mix(s.base, clayBody * (0.9 + 0.2 * noiseAt(p, 60.0)), foot);
  s.coat *= 1.0 - foot;
  return vec4(shade(p, N, v, s, open, lit), 1.0);
}
`,Kp=`// Chrome: mirror-polished metal, tinted by the body's colour.
//
// A mirror has no look of its own: it is the studio, bent round the body. So the work is in what it mirrors (the
// lamps' panels, the bright floor under a darker room, the dark side where the camera stands) and in the mascot
// mirrored in itself, once (an ear in the head). What makes it a real object and not a perfect one is very small:
// the surface wavers by a hair (so straight edges in the reflections wobble), and there is a smudge or two where
// the mirror is a little dull. Snow is silver, sun is gold, ink is black chrome; the other colours are tinted
// chrome.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // the faintest waviness
  float w0 = noiseAt(p + 4.0, 4.5);
  vec3 N = n + (tu * (noiseAt(p + 4.0 + tu * 0.05, 4.5) - w0) + tv * (noiseAt(p + 4.0 + tv * 0.05, 4.5) - w0)) * 0.16;
  N = normalize(N);
  float smudge = smoothstep(0.55, 0.8, noiseAt(p + 8.0, 1.7));              // a fingermark: the mirror is a little dull there
  float blur = 0.0006 + 0.02 * smudge;
  float open = occlusion(p, n);
  float NoV = max(dot(N, v), 1e-3);

  float pale = max3(uMain);
  vec3 metal = mix(vec3(0.93), uMain / max(pale, 0.05), 0.62) * mix(0.42, 0.95, smoothstep(0.1, 0.6, pale));   // (a dark dye is black chrome)
  vec3 F = metal + (1.0 - metal) * pow5(1.0 - NoV);
  vec3 R = reflect(-v, N);
  float at = meets(p + n * 0.012, R, 3.0);
  vec3 seen;
  if (at > 0.0) {                          // it sees itself: mirror the studio once more there
    vec3 q = p + n * 0.012 + R * at;
    vec3 nq = bodyNormal(q);
    vec3 c; float r;
    float solidThere = solidNear(q, c, r);
    vec3 again = studioLight(studioAt(q, reflect(R, nq), blur), 1.0, 1.0) * (metal + (1.0 - metal) * pow5(1.0 - max(dot(nq, -R), 0.0)));
    seen = solidThere < 0.01 ? c * 0.6 + again * 0.04 : again;   // (an eye or the glasses mirrored: dark and glossy)
  } else seen = studioLight(studioAt(p, R, blur), 1.0, 1.0);
  return vec4(seen * F * mix(0.45, 1.0, open), 1.0);
}
`,$p=`// Clay: modelling clay (plasticine), shaped by hand.
//
// Plasticine is matte with a faint waxy sheen: light gets a little way into it, so shade is soft and the shadow
// line glows slightly, and there is only a broad, dull highlight. What makes it look hand-made is the surface:
// fingerprints (fine parallel ridges that curve round, in patches where a thumb pressed), shallow dents from
// fingers, a few straight grooves from a tool, and small pits. All of that is in the
// normal and the tone here; the body's outline stays as the shape gives it. The prints fade to nothing as they get
// smaller than a pixel.
//#header
//#body
// a patch of fingerprint at x (in patches): ridges that curve round the patch's middle; how strongly it pressed
float clayPrint(vec3 p, out float press) {
  vec3 x = p * 2.6, c = floor(x), f = fract(x) - 0.5;
  vec3 hs = hash33(c);
  vec3 o = f - (hs - 0.5) * 0.5;                           // from the middle of this press
  press = smoothstep(0.5, 0.15, length(o)) * step(0.35, hs.z);   // (not every patch was pressed)
  vec3 ax = normalize(hs - 0.5);
  float r = length(o - ax * dot(o, ax)) + 0.35 * dot(o, ax);     // loops round an axis, drifting: a whorl
  return sin(r * 2.6 / 0.011 * 0.3846 + 6.0 * hs.x);       // ridges 0.011 apart
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // dents from fingers, and the unevenness of anything pressed into shape
  float d0 = noiseAt(p + 12.0, 3.2) + 0.5 * noiseAt(p + 2.0, 7.5);
  vec3 N = n - (tu * (noiseAt(p + 12.0 + tu * 0.05, 3.2) + 0.5 * noiseAt(p + 2.0 + tu * 0.05, 7.5) - d0)
              + tv * (noiseAt(p + 12.0 + tv * 0.05, 3.2) + 0.5 * noiseAt(p + 2.0 + tv * 0.05, 7.5) - d0)) * 0.95;
  // fingerprints
  float seen = resolvedOn(0.011 * 0.36, dot(n, v));
  float press, pa, pb;
  float e = max(0.002, 0.6 * gPix);
  float r0 = clayPrint(p, press);
  N -= (tu * (clayPrint(p + tu * e, pa) - r0) + tv * (clayPrint(p + tv * e, pb) - r0)) / e * 0.0011 * press * seen;
  // a couple of grooves from a modelling tool, and pits
  float groove = exp(-sq((dot(p, normalize(vec3(-0.6, 0.7, 0.4))) - 0.2 + 0.02 * sin(p.x * 9.0)) / 0.014)) * smoothstep(0.2, 0.6, noiseAt(p + 30.0, 1.5));
  float pit = smoothstep(0.88, 0.94, noiseAt(p + 5.0, 30.0)) * resolved(0.025);
  N = normalize(N);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);

  vec3 dye = uMain * 0.9;
  vec3 alb = dye * (1.0 + 0.05 * (noiseAt(p, 3.0) - 0.5)) * (1.0 - 0.18 * min(groove, 1.0) * resolved(0.02)) * (1.0 - 0.3 * pit);
  Surf s = surf(alb, mix(0.62, 0.5, press * 0.6));          // a pressed patch is a little smoother
  s.wrap = 0.3;                                             // light gets in: the shadow line is soft
  s.f0 = 0.035;
  vec3 col = shade(p, N, v, s, open, lit);
  // and comes back a little from inside: a waxy glow at the shadow line, in a deeper tone of the colour
  float edge = clamp(1.0 - abs(dot(n, uKey)) * 2.2, 0.0, 1.0);
  col += dye * dye * 0.1 * edge * uKeyCol * mix(0.4, 1.0, lit);
  return vec4(col, 1.0);
}
`,Zp=`// Cotton: a smooth knitted cotton, as on a well-made soft toy.
//
// What tells cotton from the other materials is mostly what it lacks: no highlight at all (the brightest part of
// the body is still the dye's colour), an even, flat tone across the lit side, a crisp outline, and shade that gets
// deeper in colour, not greyer. So its light is a rough matte lobe that keeps its brightness out to the edge
// (Oren & Nayar's, in Fujii's form) under a weak, pale haze of fuzz (Estevez & Kulla's "Charlie" sheen), and
// nothing mirrored. Close up it is a jersey knit: columns of small V-shaped stitches that wander a little, with
// thick and thin places in the yarn, a seam where two panels meet, and an uneven dye. The knit fades to its average
// tone as it gets smaller than a pixel, so small views are clean.
//#header
//#body
const float COTTON_WALE = 0.021;    // the width of one column of stitches (three times life size: it shows a little sooner)
const float COTTON_ROW = 0.0172;    // the height of one stitch

// the knit's height at (round the body, up it), 0 in the grooves .. 1 on the yarn. fine: how well a single stitch is
// resolved (0: only the columns show, the stitches are their average)
float cottonKnit(vec2 uv, float fine) {
  float col = uv.x / COTTON_WALE + 0.22 * sin(uv.y * 7.0 + 2.0 * sin(uv.x * 3.1)) + 0.08 * sin(uv.y * 41.0);   // columns wander and lean
  float id = floor(col), x = fract(col) - 0.5;
  float thick = 0.5 + 0.5 * sin(id * 12.9898 + uv.y * (19.0 + 7.0 * sin(id * 4.1)));                           // thick and thin places in the yarn
  float stitch = 0.5 + 0.5 * cos(6.2832 * (uv.y / COTTON_ROW - abs(x) * 1.7 + 0.37 * id));                     // two legs of yarn meeting in a V; each column starts where it likes
  return smoothstep(0.5, mix(0.3, 0.2, thick), abs(x)) * mix(0.75, 0.45 + 0.55 * stitch, fine);
}
// one lamp on rough matte cloth (Oren & Nayar, as Fujii wrote it): it stays bright toward the edge, where a smooth
// matte surface would fall away
float cottonMatte(vec3 n, vec3 l, vec3 v, float nl) {
  const float sigma = 0.75;
  float s = dot(l, v) - nl * dot(n, v);
  float tt = s > 0.0 ? max(nl, max(dot(n, v), 1e-3)) : 1.0;
  float a = 1.0 / (PI + (PI * 0.5 - 2.0 / 3.0) * sigma);
  return PI * a * (1.0 + sigma * s / tt);
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu = around(p, n), tv = cross(n, tu);
  // where on the cloth: round the body and up it. (The join in "round" is at the back, under a seam.)
  vec2 uv = vec2(atan(p.x, p.z) * 0.9, p.y);
  // (the columns pinch together at the very top, and crowd toward the outline: none there)
  float knitSeen = resolvedOn(COTTON_WALE * 0.36, dot(n, v)) * smoothstep(0.1, 0.3, length(p.xz));
  float fine = resolvedOn(COTTON_ROW * 0.3, dot(n, v));
  float e = max(0.0025, gPix);
  float h = cottonKnit(uv, fine);
  vec2 dh = vec2(cottonKnit(uv + vec2(e, 0.0), fine) - h, cottonKnit(uv + vec2(0.0, e), fine) - h) / e;
  // the seam where the front and back panels meet (it shows when the mascot turns), puckered by its stitches
  float sd = abs(p.z + 0.06);
  float pucker = 0.6 + 0.4 * sin(p.y * 232.0 + 4.0 * sin(p.x * 9.0));
  float seam = exp(-sd * sd / (0.012 * 0.012)) * pucker * resolved(0.03);
  float dseam = -2.0 * (p.z + 0.06) / (0.012 * 0.012) * seam;
  // lumps of stuffing: nothing sewn is perfectly round
  float lump = noiseAt(p + 7.0, 2.6) - 0.5;
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.0024 * knitSeen + vec3(0.0, 0.0, 1.0) * dseam * 0.006
                       - (tu * (noiseAt(p + 7.0 + tu * 0.05, 2.6) - 0.5 - lump) + tv * (noiseAt(p + 7.0 + tv * 0.05, 2.6) - 0.5 - lump)) * 1.1);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);

  // the dye: a little uneven, deeper in the knit's grooves and along the seam, paler where the yarn is thick
  vec3 dye = uMain * 0.93;                                             // (white cotton is never paper white)
  float uneven = 1.0 + 0.05 * (noiseAt(p, 5.0) - 0.5) + 0.07 * (noiseAt(p * vec3(1.0, 0.25, 1.0), 60.0) - 0.5) * resolved(0.03);
  float groove = mix(1.0, 0.62 + 0.38 * h, knitSeen);
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.05)) * 0.9;           // the same hue, more of it: what light bouncing between dyed threads becomes
  vec3 alb = mix(deep, dye, groove * (1.0 - 0.5 * seam)) * uneven;
  alb = mix(deep * 0.8, alb, mix(0.55, 1.0, open));                     // creases gather colour

  vec3 col = alb * skyIrr(N) * open;
  vec3 fuzz = mix(dye, vec3(1.0), 0.55) * 0.42;                        // a pale haze of stray fibres
  float NoV = max(dot(N, v), 1e-3);
  col += fuzz * sheenIBL(NoV, 0.7) * skyIrr(N) * open;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = max(dot(N, l), 0.0), sh = i == 0 ? lit : mix(0.6, 1.0, open);
    col += lampCol(i) * sh * nl * (alb * cottonMatte(N, l, v, nl)
         + fuzz * D_Charlie(0.7, max(dot(N, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nl) * PI);
  }
  return vec4(col, 1.0);
}
`,jp=`// Elastane: the stretch fabric of swimwear and athletic wear.
//
// It is knitted very finely from smooth synthetic filaments and pulled taut, so it has no fuzz and no visible
// weave: what you see is deep, saturated colour with a satin lustre. Smooth fibres lying side by side mirror a lamp
// into a streak that runs across them (as brushed metal does), so the highlights are long soft bands that wrap round
// the body, and the cloth brightens toward its edges. That is an anisotropic GGX lobe laid along the fibres (which
// run up the body), part of it tinted by the dye, over a dark, rich matte base, with a tight sheen toward grazing
// angles. In close-up there is a very fine rib, and the lustre is a little uneven where the cloth is stretched more.
//#header
//#body
const float ELASTANE_RIB = 0.009;   // one rib of the knit

vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 across = around(p, n), along = cross(n, across);            // the fibres run up the body
  float ribSeen = resolvedOn(ELASTANE_RIB * 0.4, dot(n, v)) * smoothstep(0.1, 0.3, length(p.xz));
  float u = atan(p.x, p.z) * 0.9 / ELASTANE_RIB + 0.3 * sin(p.y * 9.0) + 0.5 * (noiseAt(p + 14.0, 11.0) - 0.5);   // (never ruler-straight)
  float rib = cos(6.2832 * u);
  vec3 N = normalize(n + across * rib * 0.07 * ribSeen);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);

  // stretched more in places: there the cloth is thinner, a touch paler and glossier
  float stretch = noiseAt(p + 3.0, 2.2);
  vec3 dye = uMain;
  vec3 alb = pow(dye, vec3(1.18)) * mix(0.7, 0.82, stretch) * mix(1.0, 0.9 + 0.1 * rib, ribSeen);   // deep and saturated
  vec3 tint = mix(vec3(1.0), dye / max(max3(dye), 0.05), 0.5);                                      // the lustre takes some of the dye's colour
  float aAlong = mix(0.15, 0.11, stretch), aAcross = 0.5;          // smooth along a fibre, rough across them
  float pole = smoothstep(0.05, 0.32, length(p.xz));               // (at the very top the fibres' direction has no meaning: no streak there)
  aAlong = mix(0.36, aAlong, pole); aAcross = mix(0.36, aAcross, pole);

  vec3 col = alb * skyIrr(N) * open;
  // the sky and the walls, mirrored softly; more toward the edges
  col += tint * envBRDF(vec3(0.05), 0.45, NoV) * studioAt(p, normalize(mix(N, reflect(-v, N), 0.6)), 0.25).room * specOcclusion(NoV, open, 0.45) * 0.8;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = max(dot(N, l), 0.0), sh = i == 0 ? lit : mix(0.6, 1.0, open);
    vec3 hv = normalize(l + v);
    float D = D_GGXaniso(max(dot(N, hv), 0.0), dot(along, hv), dot(across, hv), aAlong, aAcross);
    float V = V_GGXaniso(NoV, nl, dot(along, v), dot(across, v), dot(along, l), dot(across, l), aAlong, aAcross);
    float F = F_Schlick1(0.05, max(dot(v, hv), 0.0));
    col += lampCol(i) * sh * nl * (alb * (1.0 - F) + tint * min(D * V, 8.0) * F * PI * 3.4);
  }
  // a tight sheen toward grazing angles (filaments seen edge-on)
  col += tint * 0.26 * pow5(1.0 - NoV) * (skyIrr(N) * open + uBackCol * max(dot(N, uBack), 0.0) * open + uKeyCol * max(dot(N, uKey), 0.0) * lit * 0.5);
  return vec4(col, 1.0);
}
`,Jp=`// Glass: a figure of clear coloured glass, blown by hand.
//
// Glass has no colour on its surface: all of it comes from how much glass the light crossed, so thick parts are
// deep and thin parts pale (Beer and Lambert's law). It bends light strongly (index 1.5), mirrors the studio sharply
// and more toward its edges, and traps light that meets its inner surface too flatly, which sends it round again and
// makes the edges darker and richer. So a ray goes in, crosses the body, and either leaves the far side (and sees
// the lamps, or the page, tinted by the glass it crossed) or is mirrored back inside for a second crossing. Hand-blown
// glass is never optically flat: the surface wavers very slightly, which is what makes the reflections look real.
// Clear parts let the page show through.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float w0 = noiseAt(p + 2.0, 2.6);
  vec3 N = normalize(n + (tu * (noiseAt(p + 2.0 + tu * 0.07, 2.6) - w0) + tv * (noiseAt(p + 2.0 + tv * 0.07, 2.6) - w0)) * 0.4);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);
  float F = fresnel(NoV, 1.0, 1.5);
  vec3 mirrored = studioLight(studioAt(p, reflect(-v, N), 0.0), specOcclusion(NoV, open, 0.03), lit);

  vec3 dye = log(max(uMain, vec3(0.02))) / 1.15;        // per unit of glass: the body's colour is what 1.15 units lets through
  vec3 dir = refract(-v, N, 1.0 / 1.5);
  vec3 q, nq; vec4 hit;
  float len = through(p, dir, q, nq, hit);
  vec3 outDir = refract(dir, -nq, 1.5);
  bool trapped = dot(outDir, outDir) < 0.5 && hit.a < 0.5;
  // trapped: mirrored back inside for a second crossing (to no solid part and no further: by then little is left)
  vec3 back = reflect(dir, -nq);
  vec3 q2, nq2; vec4 hit2;
  float len2 = through(q - nq * 0.02, back, q2, nq2, hit2);
  vec3 out2 = refract(back, -nq2, 1.5);
  if (trapped) { len += len2; q = q2; outDir = dot(out2, out2) < 0.5 ? reflect(back, -nq2) : out2; }
  bool lost = trapped && dot(out2, out2) < 0.5;          // still inside after two crossings
  vec3 clear = exp(dye * len);
  Studio behind = studioAt(q, outDir, 0.0);
  vec3 inside = (behind.key + behind.fill + behind.back + (lost ? behind.room * 0.6 : vec3(0.0))) * clear;
  // The far side looks at the floor, the mascot's own shadow on it, or a wall: the page gets through less where
  // that is darker than the page, so the room shows through the glass, bent and upside down.
  vec3 page = lost ? vec3(0.0) : clear * clamp(behind.room / max(uBackdrop, vec3(0.04)), 0.0, 1.0);
  inside += clear * max(behind.room - uBackdrop, vec3(0.0)) * (lost ? 0.0 : 1.0);
  // No glass is perfectly clear: a little of the light inside it is scattered toward the eye, in the glass's own
  // colour. On a bright page it hardly shows; on a dark one it is what keeps the colour alive.
  float haze = (1.0 - exp(-len * 0.55)) * mix(0.07, 0.3, uDark);
  inside += exp(dye * mix(0.3, 0.9, uDark)) * haze * (skyIrr(n) + uKeyCol * mix(0.3, 0.8, lit) + uFillCol * 0.5);
  page *= 1.0 - haze;
  if (hit.a > 0.5) { inside = hit.rgb * clear; page = vec3(0.0); }       // the back of an eye
  return seeThrough(mirrored * F + (1.0 - F) * inside, (1.0 - F) * page);
}
`,Qp=`// Ice: a figure carved from real ice.
//
// Ice is clear, nearly colourless and bends light less than glass does (index 1.31), so it mirrors little head-on and
// a lot at its edges. What makes it ice and not glass is what is inside and on it: a milky core where air came out of
// the water as it froze, bubbles in that core, a few curved cracks that catch the light, a surface rippled by melting
// and wet with it, and patches of white frost where it is dry. So a ray goes in (bent at the rippled surface), and
// on its way through the body it gathers the core's milk, the bubbles and the cracks; what is left of it comes out
// the far side and sees the lamps or the page. The body's colour is only a tint in the thick parts: ice has no dye.
// Thin clear parts let the page show through.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // the surface: slow ripples where it has melted
  float w0 = noiseAt(p + 11.0, 6.0);
  vec3 N = normalize(n + (tu * (noiseAt(p + 11.0 + tu * 0.04, 6.0) - w0) + tv * (noiseAt(p + 11.0 + tv * 0.04, 6.0) - w0)) * 1.3);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);
  float F = fresnel(NoV, 1.0, 1.31);
  vec3 mirrored = studioLight(studioAt(p, reflect(-v, N), 0.0), specOcclusion(NoV, open, 0.05), lit);

  // through the ice
  vec3 dir = refract(-v, N, 1.0 / 1.31);
  vec3 q, nq; vec4 hit;
  float len = through(p, dir, q, nq, hit);
  float milk = 0.0, crack = 0.0;
  for (int i = 0; i < 6; i++) {
    vec3 s = p + dir * len * (float(i) + 0.5) / 6.0;
    float depth = -bodySmooth(s);                                           // how deep inside the body this is
    float air = snoise(s * 24.0 + 4.0, 0.0);                                // bubbles gather in the core
    milk += smoothstep(0.24, 0.6, depth) * (0.35 + 1.0 * smoothstep(0.6, 0.78, air));
    crack += smoothstep(0.007, 0.0, abs(snoise(s * 1.0 + 9.0, 0.0) - 0.46)) * smoothstep(0.04, 0.16, depth);   // a crack is a curved sheet
  }
  milk = 1.0 - exp(-milk * len * 0.3);                                      // how much of the view the core's milk hides
  vec3 tint = mix(vec3(0.74, 0.9, 1.0), uMain, 0.42);                       // ice's own blue-green, and a blush of the body's colour
  vec3 clear = exp(log(max(tint, vec3(0.03))) * len * 1.15);                // what gets through that much ice
  vec3 outDir = refract(dir, -nq, 1.31);
  bool trapped = dot(outDir, outDir) < 0.5;                                 // (it can't get out here: it is mirrored back inside)
  Studio behind = studioAt(q, trapped ? reflect(dir, -nq) : outDir, 0.03);
  vec3 lamps = behind.key + behind.fill + behind.back + (trapped ? behind.room : vec3(0.0));
  // the core scatters whatever light there is, through the tinted ice round it
  vec3 milkLit = mix(vec3(0.9, 0.96, 1.0), tint, 0.55) * (skyIrr(n) * 1.3 + uKeyCol * mix(0.3, 0.75, lit) + uBackCol * 0.45);
  vec3 inside = lamps * clear * (trapped ? 0.7 : 1.0) * (1.0 - milk) + milkLit * milk + uKeyCol * min(crack, 1.0) * 0.7 * (1.0 - 0.5 * milk);
  // how much of the page behind gets through: less where the far side looks at the mascot's own shadow or a wall
  vec3 page = trapped ? vec3(0.0) : clear * (1.0 - milk) * clamp(behind.room / max(uBackdrop, vec3(0.04)), 0.0, 1.0);
  if (hit.a > 0.5) { inside = hit.rgb * clear * (1.0 - milk) + milkLit * milk; page = vec3(0.0); }   // the back of an eye

  // frost: dry patches, white and rough, that sparkle
  float frost = smoothstep(0.5, 0.72, noiseAt(p + 5.0, 2.2) + 0.22 * noiseAt(p, 17.0)) * 0.8;
  vec3 frostLit = vec3(0.93, 0.97, 1.0) * (skyIrr(N) * open + uKeyCol * max(dot(N, uKey), 0.0) * lit + uFillCol * max(dot(N, uFill), 0.0) + uBackCol * max(dot(N, uBack), 0.0) * open);
  vec2 g = glints(p, n, v, 0.03, 0.6, 0.9, 0.975);
  frostLit += uKeyCol * g.x * lit * 5.0 + (uFillCol + uBackCol) * g.y * 2.5;

  F = max(F, 0.045);                                                        // (a film of melt water: it mirrors a little more head-on)
  vec3 shown = mirrored * F + (1.0 - F) * mix(inside, frostLit, frost);
  return seeThrough(shown, (1.0 - F) * page * (1.0 - frost));
}
`,em=`// Sugar: a soft jelly sweet in the body's colour, rolled in coarse sugar.
//
// Two things make it: the crystals and the jelly. The crystals are small clear bricks of sucrose lying every which
// way. Here they are real relief: one brick in each cell of a jittered grid, each turned its own way, with flat
// faces and sharp edges, so they roughen the outline and each face catches the light on its own. A face that
// mirrors a lamp into the eye flashes white (sucrose reflects about 5 % head-on); where the crystals are too small
// to resolve, the library's grains take over, which fade instead of flickering. Between the crystals the jelly shows:
// deep, saturated colour that light gets into (it creeps round the shadow line, and thin parts glow when a lamp is
// behind them), with a moist gloss.
//#header
#define MAT_DISPLACE 0.03
#define MAT_STEP 0.55
//#body
// how high the nearest crystal of one scattering stands at g (in cells): 0 none .. 1 on a face. id: which crystal.
float sugarGrid(vec3 g, out float id) {
  vec3 c0 = floor(g - 0.5);
  float best = 0.0;
  id = 0.0;
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 hs = hash33(c);
    vec3 o = g - (c + 0.15 + 0.7 * hs);                    // from the crystal's middle
    vec3 ax = normalize(hash33(c + 17.0) - 0.5);
    vec3 q = o - 2.0 * ax * dot(ax, o);                    // its own frame (a mirror image of a brick is a brick, turned)
    vec3 b = abs(q) - (0.19 + 0.27 * hs.yzx);              // a little brick, each its own size
    float k = clamp(-max(b.x, max(b.y, b.z)) / 0.1, 0.0, 1.0);   // flat faces, sharp sides
    if (k > best) { best = k; id = hs.x; }
  }
  return best;
}
// two scatterings, of different sizes and turned against each other, so no grid shows
float sugarCrystals(vec3 p, out float id) {
  float ia, ib;
  float a = sugarGrid(p / 0.034, ia);
  float b = sugarGrid(vec3(0.8 * p.x - 0.6 * p.z, p.y, 0.6 * p.x + 0.8 * p.z).yzx / 0.027 + 7.3, ib);
  id = a > b ? ia : ib;
  return max(a, b);
}
float matDisplace(vec3 p) {
  float seen = resolved(0.016), id;
  if (seen < 0.01) return MAT_DISPLACE * 0.35;             // too small to see a crystal: the average, for nothing
  return MAT_DISPLACE * mix(0.35, sugarCrystals(p, id), seen);
}

vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float seen = resolved(0.016);
  float e = max(0.0022, 0.7 * gPix);
  float h = matDisplace(p) / MAT_DISPLACE;
  vec2 dh = vec2(matDisplace(p + tu * e) - matDisplace(p - tu * e), matDisplace(p + tv * e) - matDisplace(p - tv * e)) / (2.0 * e);
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.9);     // a crystal's face
  float id;
  sugarCrystals(p, id);
  float crystal = smoothstep(0.03, 0.3, h);                  // on one of the big crystals
  float sugar = mix(0.55, max(crystal, 0.4), seen);          // how much of this pixel is sugar: between the big crystals lies fine dust
  N = normalize(N + (fract(id * vec3(17.3, 29.7, 43.1)) - 0.5) * 1.3 * crystal * seen);   // each crystal lies its own way: its top face too
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(n, v), 1e-3);

  // the jelly: light gets into it
  vec3 dye = uMain;
  vec3 jelly = pow(dye, vec3(1.35)) * 0.92;
  vec3 E = skyIrr(n) * open;
  for (int i = 0; i < 3; i++) E += lampCol(i) * clamp((dot(n, lampDir(i)) + 0.45) / 1.45, 0.0, 1.0) * (i == 0 ? mix(0.35, 1.0, lit) : mix(0.6, 1.0, open));
  float through = thickness(p - n * 0.03, uBack, 1.4);        // how much jelly lies between here and the lamp behind
  vec3 glow = uBackCol * exp(-through * vec3(3.0) / max(sqrt(dye), vec3(0.15))) * 1.5;   // (the dye's own colour gets through best)
  vec3 jel = jelly * E + sqrt(jelly) * glow;
  jel += studioLight(studioAt(p, reflect(-v, n), 0.1), specOcclusion(NoV, open, 0.3), lit) * envBRDF(vec3(0.04), 0.32, NoV) * 0.7;   // moist

  // the sugar: a crystal is clear, so the jelly shows through its faces. Its edges and its flaws scatter light
  // (white), and each crystal is clearer or cloudier than the next.
  float edge = crystal * (1.0 - smoothstep(0.45, 0.95, h));   // the bevel round a crystal's top face
  float cloudy = mix(0.5, mix(0.62, clamp(0.1 + 0.42 * id * id + 0.6 * edge, 0.0, 1.0), crystal), seen);   // (dust is cloudier: more faces)
  vec3 Es = skyIrr(N) * open;
  for (int i = 0; i < 3; i++) Es += lampCol(i) * max(dot(N, lampDir(i)), 0.0) * (i == 0 ? lit : mix(0.6, 1.0, open));
  vec3 sug = mix(jel * 1.1, vec3(0.95) * Es, cloudy);
  float NoVf = max(dot(N, v), 1e-3);
  sug += studioLight(studioAt(p, reflect(-v, N), 0.02), open, lit) * F_Schlick1(0.048, NoVf) * seen * crystal * 4.0;   // a face mirroring the studio
  // grains that flash: fine ones, and a few bigger ones that still show when the mascot is small
  vec2 g = glints(p, n, v, 0.024, 0.8, 1.0, 0.96) + 0.7 * glints(p + 3.1, n, v, 0.075, 0.6, 1.0, 0.955);
  vec3 col = mix(jel, sug, sugar) + uKeyCol * g.x * lit * 9.0 + (uFillCol + uBackCol) * g.y * 4.5 * open;
  return vec4(col, 1.0);
}
`,tm=Xp,Ao={cotton:Zp,boucle:qp,elastane:jp,sugar:em,ice:Qp,glass:Jp,chrome:Kp,ceramic:Yp,clay:$p};function nm(i){const e=Ao[i]??Ao.cotton,t=e.indexOf("//#body");if(t<0)return{header:"",body:e};const n=e.indexOf("//#header");return{header:n>=0?e.slice(n,t):"",body:e.slice(t)}}const im=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Ro=`
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
uniform vec3 uFwd;          // the way to the camera along the floor (the studio is laid out round it)
uniform vec3 uBackdrop;     // the page behind the mascot: what a clear body shows through it
uniform float uDark;        // 1 on the dark theme
uniform vec2 uShadow;       // the soft shadow on the floor: its half sizes along x and z
uniform float uTime;        // seconds (it stands still with "reduce motion" on)
uniform float uExposure;
uniform vec3 uMain;         // the palette: the body's colour,
uniform vec3 uAccent;       // an accent,
uniform vec3 uBlushC;       // the blush,
uniform vec3 uExtra;        // and one more
uniform vec4 uEye[2];       // (Bloom) stitched eyes on the face's chart: centre x, y, half width, half height
uniform float uEyeMode;     // 0 open, 1 happy arcs, 2 asleep
uniform float uEyeOpen;     // blink
uniform vec4 uNose;         // (Bloom) the stitched mouth: centre, half size
uniform vec4 uBlush[2];     // centre, radius (0 = none)
uniform vec3 uEarC[2];
uniform mat3 uEarM[2];
uniform float uSway;
varying vec3 vPos;

struct Mat { vec3 alb; float fuzz; float ink; };   // dye colour, fuzz cover (none on thread), embroidery thread
// the pile at a point above the fabric
struct Fur {
  float gap;    // how far it is to the nearest pile (0 or less: inside it)
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
  float kind;   // which fabric this is: 0 the body, 1 knit, 2 a pom, 3 a tuft (in between where two meet)
};

const float PI = 3.14159265;
const vec3 INK = vec3(0.012, 0.011, 0.016);
float gPix = 0.002;     // the pixel footprint where we are
float gDetail = 1.0;    // 0 while a distance is asked for something coarse (a shadow, occlusion): a material's fine relief is left out
float gGrain = 1.0;     // 1: a soft shadow may hide its steps in grain (fine under pile); 0: it takes finer steps instead (a bare surface shows grain)

vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return max(a, b) + h * h * k * 0.25; }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-5); }
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

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

// ---- (Bloom) the stitched face, on its chart
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
`,rm=`
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
  f.n = n; f.len = len; f.h = h; f.gap = gap; f.ink = 0.0; f.top = 0.0; f.under = 0.0; f.root = s; f.dir = n; f.alb = alb; f.kind = 0.0;
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
`,fl=`
#define FUR
#define FUZZY
// The make-your-own mascots: a body, what it wears (a hat, a scarf, a tuft: short curly pile), and glossy eyes,
// glasses and other solid parts. This one isn't written out as a shape: its parts are lists the engine fills in
// (./looks.ts builds them from the chosen shape, eyes, glasses and extra, and places each on the body by marching
// this same distance field). The body is the same pile in plush; with MAT defined it is a bare surface that the
// chosen material shades (./materials), standing up to MAT_DISPLACE above its smooth shape if the material has relief.
#ifdef MAT
const float BODY_PILE = 0.0;
#else
const float BODY_PILE = 0.05;
#endif
#ifdef MAT_DISPLACE
float matDisplace(vec3 p);   // how far the material's surface stands above the smooth body at p (0 .. MAT_DISPLACE)
#endif
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
uniform vec4 uSolB;      // a ball that holds every solid part (xyz centre, w radius): outside it they needn't be asked
const mat3 TWIST = mat3(0.8, -0.6, 0.0, 0.36, 0.48, -0.8, 0.48, 0.64, 0.6);
vec3 gN = vec3(0.0, 1.0, 0.0);   // which way is out, where it was last worked out (gNat)
vec3 gNat = vec3(1e3);
// the kinds of part: a rounded box, a ring and a disc about an axis, an arc of a ring facing forward (and, from
// COMMON, an ellipsoid and a round cone)
float sdRBox(vec3 q, vec3 b, float r) { vec3 e = abs(q) - b + r; return length(max(e, 0.0)) + min(max(e.x, max(e.y, e.z)), 0.0) - r; }
float sdRing(vec3 q, vec3 ax, float R, float r) { float h = dot(q, ax); return length(vec2(length(q - ax * h) - R, h)) - r; }
float sdDisc(vec3 q, vec3 ax, vec3 R) {
  float h = dot(q, ax);
  vec2 e = abs(vec2(length(q - ax * h), h)) - R.xy + R.z;
  return min(max(e.x, e.y), 0.0) + length(max(e, 0.0)) - R.z;
}
float sdArc(vec3 q, float up, vec3 R) {   // (Quilez's capped torus) up: 1 the arc's middle is up, -1 down; R.z: half its angle
  q.y *= up; q.x = abs(q.x);
  vec2 sc = vec2(sin(R.z), cos(R.z));
  float k = sc.y * q.x > sc.x * q.y ? dot(q.xy, sc) : length(q.xy);
  return sqrt(max(dot(q, q) + R.x * R.x - 2.0 * R.x * k, 0.0)) - R.y;
}
// The kinds of part fur grows on, with which way is out (the distance's slope) worked out alongside: an ellipsoid, a
// round cone, a rounded box, and a layer over the first part between two heights (a hat, a scarf).
float sdEllipsoidG(vec3 q, vec3 r, out vec3 g) {
  vec3 q1 = q / r, q2 = q1 / r;
  float k0 = length(q1), k1 = max(length(q2), 1e-5);
  g = q2 / k1;
  return k0 * (k0 - 1.0) / k1;
}
float sdRoundConeG(vec3 p, vec3 a, vec3 b, float r1, float r2, out vec3 g) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) { vec3 pb = p - b; g = pb / max(length(pb), 1e-5); return sqrt(x2 + z2) * il2 - r2; }
  if (sign(y) * a2 * y2 < k) { g = pa / max(length(pa), 1e-5); return sqrt(x2 + y2) * il2 - r1; }
  g = xv * (sqrt(a2 * il2) / max(sqrt(x2), 1e-6)) + ba * (rr * il2);
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
float sdRBoxG(vec3 q, vec3 b, float r, out vec3 g) {
  vec3 e = abs(q) - b + r, m = max(e, 0.0);
  float l = length(m);
  g = sign(q) * (l > 1e-5 ? m / l : step(e.yzx, e.xyz) * step(e.zxy, e.xyz));
  return l + min(max(e.x, max(e.y, e.z)), 0.0) - r;
}
// (smax, with the first one's share of the slope)
float smaxW(float a, float b, float k, out float w) { float h = max(k - abs(a - b), 0.0) / k; w = a > b ? 1.0 - 0.5 * h : 0.5 * h; return max(a, b) + h * h * k * 0.25; }
float layerD(float d0, float y, float thick, float y0, float y1) { return smax(smax(d0 - thick, y0 - y, 0.035), y - y1, 0.035); }
float layerG(float d0, vec3 g0, float y, float thick, float y0, float y1, out vec3 g) {
  float w;
  float d = smaxW(d0 - thick, y0 - y, 0.035, w);
  g = mix(vec3(0.0, -1.0, 0.0), g0, w);
  d = smaxW(d, y - y1, 0.035, w);
  g = mix(vec3(0.0, 1.0, 0.0), g, w);
  return d;
}
// one part, whatever its kind (the general way; a look that is drawn a lot has its parts written out instead: see
// glslFor in ./looks.ts)
float partD(vec3 p, vec4 A, vec4 B, vec4 R) {
  int ty = int(A.w + 0.5);
  vec3 q = p - A.xyz;
  if (ty == 0) return sdEllipsoid(q, R.xyz);
  if (ty == 1) return sdRoundCone(p, A.xyz, B.xyz, R.x, R.y);
  if (ty == 2) return sdRBox(q, B.xyz, R.x);
  if (ty == 5) return sdArc(q, B.x, R.xyz);
  if (ty == 3) return sdRing(q, B.xyz, R.x, R.y);
  return sdDisc(q, B.xyz, R.xyz);
}
/*CLOTH<*/
float pileOf(float kind) { return kind < 0.5 ? BODY_PILE : kind < 1.5 ? 0.034 : kind < 2.5 ? 0.09 : 0.28; }
// the fabric (with that share of each part's pile on it); and the pile's depth and its fur (rgb: dye, a: which) there
float cloth(vec3 p, float pile, out float len, out vec4 fur) {
  float d = 1e3;
  len = BODY_PILE; fur = vec4(uFurC[0], 0.0);
  float d0 = partD(p, uFA[0], uFB[0], uFR[0]);
  for (int i = 0; i < NF; i++) {
    if (i >= uNF) break;
    float kind = uFR[i].w, li = pileOf(kind);
    float di;
    if (uFA[i].w > 5.5) di = layerD(d0, p.y, uFR[i].x, uFA[i].y, uFB[i].y);   // a layer of knit over the body itself (a hat, a scarf): it fits any shape
    else di = i == 0 ? d0 : partD(p, uFA[i], uFB[i], uFR[i]);
    di -= pile * li;
    vec4 fi = vec4(uFurC[int(kind + 0.5)], kind);
    if (i == 0) { d = di; len = li; fur = fi; continue; }
    float k = uFB[i].w;
    float h = k > 0.0 ? clamp(0.5 + 0.5 * (di - d) / k, 0.0, 1.0) : step(d, di);
    d = mix(di, d, h) - k * h * (1.0 - h);
    len = mix(li, len, h); fur = mix(fi, fur, h);
  }
#ifdef MAT_DISPLACE
  if (gDetail > 0.5 && fur.a < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * fur.a);   // the material's relief, on the body only
#endif
  return d;
}
// the smooth fabric (no pile, no relief), with which way is out. The parts are lists here, so there's no formula for
// it: it comes from four more readings of the distance, and only near a surface. The pile is thin beside the body's
// curve, so one reading serves a stretch of the ray through it.
float clothN(vec3 p, out float len, out vec4 fur, out vec3 n) {
  float detail = gDetail;
  gDetail = 0.0;
  float d = cloth(p, 0.0, len, fur);
  n = gN;
#ifdef MAT_DISPLACE
  float far = max(len, 0.01) + MAT_DISPLACE + 1.5 * gPix;
#elif defined(MAT)
  float far = max(len, 0.01) + 1.5 * gPix;
#else
  float far = max(len, max(0.01, 0.3 * gPix));
#endif
  if (d > far) { gNat = vec3(1e3); gDetail = detail; return d; }
  vec3 dn = p - gNat;
  if (dot(dn, dn) > 0.0009) {
    const vec2 k = vec2(1.0, -1.0);
    const float e = 0.004;
    float l2; vec4 f2;
    gN = normalize(k.xyy * cloth(p + k.xyy * e, 0.0, l2, f2) + k.yyx * cloth(p + k.yyx * e, 0.0, l2, f2)
                 + k.yxy * cloth(p + k.yxy * e, 0.0, l2, f2) + k.xxx * cloth(p + k.xxx * e, 0.0, l2, f2));
    gNat = p;
  }
  n = gN;
  gDetail = detail;
  return d;
}
/*>CLOTH*/
// which way is out of the smooth body at p, wherever p is (no shortcuts)
vec3 bodyNormal(vec3 p) {
  float l; vec4 f; vec3 n;
  float px = gPix;
  gPix = 1e3; gNat = vec3(1e3);
  clothN(p, l, f, n);
  gPix = px; gNat = vec3(1e3);
  return n;
}
float skinM(vec3 p, out Mat m, bool full) { float l; vec4 f; m = Mat(uMain, 0.0, 0.0); return cloth(p, 0.0, l, f); }
float pileD(vec3 p) { float l; vec4 f; return cloth(p, 0.5, l, f); }
// the fur at p: a short pile of curly fibres that lie every which way, in small whorls (like the pile of a soft toy)
float furM(vec3 p, out Fur f) {
  float len; vec4 fur; vec3 n;
  float d = clothN(p, len, fur, n);
  f.len = len; f.h = d / max(len, 1e-4); f.gap = d - len; f.ink = 0.0; f.top = 0.0; f.under = 0.0;
  f.n = n; f.root = p; f.dir = n; f.alb = fur.rgb; f.fine = 62.0; f.gloss = 0.3; f.kind = fur.a;
  if (f.gap > 0.0 && d > max(0.01, 0.3 * gPix)) return d;   // (not in the pile: the march only needs the distances)
#ifdef MAT
  if (fur.a < 0.5) return d;                                // (the bare body: its material shades it, not the pile)
#endif
  vec3 s = p - n * d;                                  // the fabric below this point
  float hc = clamp(f.h, 0.0, 1.0), kind = fur.a;
  vec3 t1 = normalize(cross(n, abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), t2 = cross(n, t1);
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
  q += 1.5 * (vec3(snoise(q * 0.47 + 3.0, 0.0), snoise(q * 0.47 + 17.0, 0.0), snoise(q * 0.47 + 41.0, 0.0)) - 0.5);   // (the grid wobbles, so patches aren't square)
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
/*SOLID<*/
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
/*>SOLID*/
float casters(vec3 p) { vec3 c; float r; return solid(p, c, r); }
// The march asks for the solid parts at every step, and only needs them where it's near them: well outside the ball
// that holds them all, its distance to the ball will do. (Only the march: a shadow measures how near its ray passes,
// and would take the ball for something in the light's way.)
float solidNear(vec3 p, out vec3 col, out float rough) {
  float far = length(p - uSolB.xyz) - uSolB.w;
  if (far > 0.06) { col = INK; rough = 0.2; return far; }
  return solid(p, col, rough);
}
`,Co=`
float skinD(vec3 p) { Mat m; return skinM(p, m, false); }
float solidD(vec3 p) { vec3 c; float r; return solid(p, c, r); }
float mapD(vec3 p) { return min(skinD(p), solidD(p)); }
#ifdef FUZZY
// (thin casters like glasses frames are thickened a little here, so the shadow march can't step over them in places)
float shadowD(vec3 p) { return min(pileD(p), casters(p) - 0.012); }
#else
float shadowD(vec3 p) { return pileD(p); }   // (fur casts its shadow from part-way up the pile)
#endif
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
  t += 0.03 * ign(gl_FragCoord.xy) * gGrain;   // (a hat's brim shades a flat face: without this its penumbra shows the march's steps as rings)
#endif
  float lo = mix(0.006, 0.012, gGrain), hi = mix(0.1, 0.2, gGrain);
  for (int i = 0; i < 56; i++) {
    if (i >= 32 && gGrain > 0.5) break;
    float h = shadowD(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(max(h * h - y * y, 0.0));
    res = min(res, k * d / max(0.0, t - y));
    ph = h;
    t += clamp(h, lo, hi);
    if (res < 0.003 || t > 2.6) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

// ---- lobes for fabric: a fuzz layer's sheen (Estevez & Kulla's "Charlie" distribution, with Neubelt's visibility)
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

// ---- the glossy parts (eyes, glasses, headphones): plastic lit by the studio
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
`,am=`
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
  // march up to the pile and then through it, a fibre's width at a time: each fibre met on the way covers part of the
  // pixel (front to back), until the pixel is covered or the fabric underneath is reached
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the fur's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
#ifdef FUZZY
  vec3 sAt = vec3(0.0), sCol = vec3(0.0);   // a solid part (a glossy eye, glasses) behind the fibres met so far: where, its colour,
  float sRough = 0.0, As = 0.0;             // ...its roughness, and how much of the pixel is left for it
#endif
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
#ifdef FUZZY
    vec3 sc; float sr;
    float sd = solidNear(p, sc, sr);
    if (sd < 0.3 * gPix) { sAt = p; sCol = sc; sRough = sr; As = 1.0 - A; hit = true; break; }   // (lit below, once: not on every step)
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
  if (As > 0.0) {
    vec3 n = solidNormal(sAt);
    Cp += As * shadePlastic(n, V, sCol, sRough, calcAO(sAt + n * 0.002, n), softShadow(sAt + n * 0.01, uKey, 5.0));
    A = min(1.0, A + As);
  }
#endif
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`,sm=`
#ifndef MAT_STEP
#define MAT_STEP 0.9   // the share of the distance a step toward the body takes (a material with steep, thin relief asks for less)
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
  // Front to back along the ray: pile (of what the body wears) covers part of the pixel as it goes; a solid part or
  // the body ends it. Each of those two is lit once, after the march, not on every step.
  vec3 sAt = vec3(0.0), sCol = vec3(0.0);   // a solid part: where, its colour,
  float sRough = 0.0, As = 0.0;             // ...its roughness, and how much of the pixel is left for it
  vec3 bAt = vec3(0.0);                     // the body: where,
  float bT = 0.0, Ab = 0.0;                 // ...how far along the ray, and how much of the pixel is left for it
  float lastE = 1e9, lastT = 0.0, nearE = 1e9, nearT = 0.0;   // how near the ray came to the body (in pixels) before leaving it again:
  bool missed = false;                                        // ...the body's edge covers part of such a pixel
  float sLastE = 1e9, sLastT = 0.0, sNearE = 1e9, sNearT = 0.0, sLastRough = 0.2, sNearRough = 0.2;   // the same for a solid part
  vec3 sLastCol = vec3(0.0), sNearCol = vec3(0.0);
  bool sMissed = false;
  gGrain = 0.0;
#ifdef PILE
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the pile's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
#endif
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
    vec3 sc; float sr;
    float sd = solidNear(p, sc, sr);
    float se = sd / gPix;
    if (se < 0.3) { sAt = p; sCol = sc; sRough = sr; As = 1.0 - A; break; }
    if (!sMissed && se > sLastE && sLastE < 1.0) { sMissed = true; sNearE = sLastE; sNearT = sLastT; sNearCol = sLastCol; sNearRough = sLastRough; }
    sLastE = se; sLastT = t; sLastCol = sc; sLastRough = sr;
#ifdef PILE
    Fur f;
    float d = furM(p, f);
    float kind = f.kind;
#ifdef MAT_DISPLACE
    if (kind < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * kind);   // (furM's distance is to the smooth body)
#endif
#else
    float len; vec4 fk;
    float d = cloth(p, 0.0, len, fk);                      // (with the material's relief, if it has any)
    float kind = fk.a;
#endif
    if (kind < 0.5) {                                      // the body, or the way to it
      float e = d / gPix;
      if (e < 0.3) { bAt = p; bT = t; Ab = 1.0 - A; break; }
      if (!missed && e > lastE && lastE < 1.0) { missed = true; nearE = lastE; nearT = lastT; }
      lastE = e; lastT = t;
#ifdef PILE
      inside = false;
#endif
      t += max(min(d * MAT_STEP, sd * 0.9), 0.3 * gPix);
      if (t > tf) break;
      continue;
    }
#ifdef PILE
    lastE = 1e9;
    bool fabric = d < 0.3 * gPix;
    if (f.gap > 0.0 && !fabric) {                          // not in the pile yet (or out of it again)
      inside = false;
      t += max(min(f.gap * 0.8, sd * 0.9), 0.3 * gPix);
      if (t > tf) break;
      continue;
    }
    float ds = min(max(0.7 * gPix, min(0.3 / f.fine, 0.12 * f.len)), 0.25 * f.len);
    if (!inside && !fabric) { inside = true; t += ds * ign(gl_FragCoord.xy); continue; }   // (so the steps don't show as rings)
    float c = fabric ? 1.0 : fibres(f, f.h, log2(max(gPix, ds) * f.fine) + 0.5);
    if (c > 0.003) {
      float a = 1.0;
      if (fabric) col = shadeFur(p, f, f.top + f.under, V, key);
      else {
        a = 1.0 - exp(-c * ds * f.fine * FUR_OPACITY);
        if (!seen || (1.0 - A) * a > 0.02) col = shadeFur(p, f, max(f.top - f.h, 0.0) + f.under, V, key);   // (a faint fibre takes the light of the one before)
      }
      float A1 = A + (1.0 - A) * a;
      if (!seen || (A < 0.5 && A1 >= 0.5)) { seen = true; sp = p; sn = f.n; lift = max(0.55 - f.h, 0.0) * f.len; depth = d; }
      Cp += (1.0 - A) * a * col; Ck += (1.0 - A) * a * key; A = A1;
      if (fabric || A > 0.985) break;
    }
    t += min(min(ds, max(0.9 * d, 0.3 * gPix)), max(0.9 * sd, 0.3 * gPix));
    if (t > tf) break;
#endif
  }
  gDetail = 0.0;   // (the pile's and the solid parts' shadows and creases don't need the material's fine relief)
#ifdef PILE
  if (seen) {      // the studio's shadow on the key light, and the creases: once per pixel, where the pile's surface is
    gGrain = 1.0;
    float sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), uKey, 3.0)), smoothstep(-0.1, 0.25, dot(sn, uKey)));
    gGrain = 0.0;
    float ao = calcAO(sp - sn * depth, sn);
    Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);
    if (A > 0.985) { Cp /= A; A = 1.0; }
  }
#endif
  if (As > 0.0) {                           // a glossy part: it mirrors the same studio the body's material does
    vec3 n = solidNormal(sAt);
    Cp += As * shade(sAt, n, V, surf(sCol, max(sRough, 0.04)), calcAO(sAt + n * 0.002, n), softShadow(sAt + n * 0.01, uKey, 5.0));
    A = min(1.0, A + As);
  }
  gDetail = 1.0;
  if (Ab <= 0.0 && As <= 0.0 && missed) {   // nothing was met, but the ray passed within a pixel of the body
    bT = nearT; bAt = ro + rd * nearT; Ab = (1.0 - A) * clamp((1.0 - nearE) / 0.7, 0.0, 1.0);
  }
  if (Ab > 0.0) {                           // the body: its material's light toward the eye, and how much of the page it hides
    gPix = bT * uPix;
    vec4 m = matShade(bAt, bodyNormal(bAt), V, bT);
    Cp += Ab * m.a * m.rgb; A += Ab * m.a;
  }
  if (sMissed) {                            // the ray passed within a pixel of a solid part on its way: that part's edge lies over the rest
    float cov = clamp((1.0 - sNearE) / 0.7, 0.0, 1.0);
    vec3 pe = ro + rd * sNearT;
    gDetail = 0.0;
    vec3 c = shade(pe, solidNormal(pe), V, surf(sNearCol, max(sNearRough, 0.04)), 1.0, 1.0);
    gDetail = 1.0;
    Cp = c * cov + Cp * (1.0 - cov); A = cov + A * (1.0 - cov);
  }
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`,om={bloom:{glsl:rm,box:[-1.15,-.1,-1.08,1.15,2.22,1.08],cam:[2.48,9.9,1.08,17],top:1.73,shadow:[2.6,1.6],eye:{x:.321,y:.785,rx:.062,ry:.088},nose:[0,.711,.055,.014],blush:[.481,.62,0,.1],ears:{base:[.605,1.34,.339],off:[0,.14],yaw:0,lean:.8},rest:0,prop:"#68c7ea",exposure:1.1,colors:{main:"#eff2fa",accent:"#99d7f0",blush:"#b0f1fc",extra:"#84d1f0"}}},lm=i=>i.glsl&&fl.replace(/\/\*CLOTH<\*\/[\s\S]*?\/\*>CLOTH\*\//,()=>i.glsl.cloth).replace(/\/\*SOLID<\*\/[\s\S]*?\/\*>SOLID\*\//,()=>i.glsl.solid);function cm(i,e,t){if(!(e!=null&&e.bare)||!(t!=null&&t.material)||t.material==="plush")return Ro+i+Co+am;const n=nm(t.material);return Ro+`#define MAT
`+(e.pile?`#define PILE
`:"")+n.header+`
`+i+Co+tm+`
`+n.body+`
`+sm}function hm(i,e){const t=nn[e.colour]??nn.lime,n=e.colour==="snow";return{glsl:fl,box:i.box,cam:i.cam,top:i.top,shadow:i.shadow,eye:{x:0,y:i.eyeY,rx:0,ry:0},nose:[0,0,0,0],blush:[0,0,0,0],rest:0,prop:n?nn.ice:t,exposure:1.06,colors:{main:t,accent:t,blush:t,extra:t}}}const Rt=i=>new Ye(i),um=i=>i<=0?0:i>=1?1:i*i*(3-2*i),Po=()=>{var i;return!!((i=window.matchMedia)!=null&&i.call(window,"(prefers-reduced-motion: reduce)").matches)},fm=()=>document.documentElement.classList.contains("dark");let _n=null,br=0,Vi=0,ga=null;function dl(i,e){return _n||(_n=new Op({alpha:!0,premultipliedAlpha:!0,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"}),_n.setPixelRatio(1),_n.setClearColor(0,0),_n.autoClear=!1),(i>br||e>Vi)&&(br=Math.max(i,br),Vi=Math.max(e,Vi),_n.setSize(br,Vi,!1)),_n}function dm(){if(ga)return ga;const i=128,e=new Uint8Array(i*i*i);let t=49723857;for(let r=0;r<e.length;r++)t^=t<<13,t^=t>>>17,t^=t<<5,e[r]=t&255;const n=new Ko(e,i,i,i);return n.format=ls,n.type=Xt,n.minFilter=yn,n.magFilter=Ot,n.wrapS=n.wrapT=n.wrapR=Lr,n.generateMipmaps=!0,n.unpackAlignment=1,n.needsUpdate=!0,ga=n}function gm(){if(!_n&&!document.createElement("canvas").getContext("webgl2"))throw new Error("WebGL 2 is not available");dl(1,1)}const gi=new Set,vi={x:0,y:0,seen:!1};let Fr=0,Er=0,ci=0,Dr=1,Do=!1;function pm(){Do||(Do=!0,window.addEventListener("pointermove",i=>{vi.x=i.clientX,vi.y=i.clientY,vi.seen=!0},{passive:!0}),document.addEventListener("visibilitychange",Fn),new MutationObserver(()=>gi.forEach(i=>i.applyTheme())).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}))}function Fn(){!Fr&&!document.hidden&&(Fr=requestAnimationFrame(pl))}function pl(i){if(Fr=0,document.hidden)return;const e=Er?i-Er:16;if(Er=i,e>25&&e<1500){if(++ci>16){const n=[...gi].sort((r,a)=>a.gain-r.gain)[0];n!=null&&n.gain?(n.specialise(),ci=0):ci>30&&Dr>.6&&(Dr=Math.max(.6,Dr-.2),ci=0,gi.forEach(r=>r.resize()))}}else ci=Math.max(0,ci-1);let t=!1;for(const n of gi)n.frame(i)&&(t=!0);t?Fr=requestAnimationFrame(pl):Er=0}class vm{constructor(e,t){this.host=e,this.built=null,this.still=!1,this.own=null,this.scene=new kp,this.geos=[],this.disposables=[],this.root=new ui,this.squash=new ui,this.w=1,this.h=1,this.onScreen=!0,this.last=0,this.dirty=!0,this.st={pose:"idle",poseT:0,t:Math.random()*10,blinkIn:1.6+Math.random()*2,blinkT:-1,look:new ke,lookV:new ke,poke:-1,tilt:0,tiltV:0,flake:0,zz:0},this.earM=new rt,this.earE=new qt,this.v3=new N,this.q=new Gn,this.qi=new Gn,this.KEY=new N(-.42,.78,.5).normalize(),this.FILL=new N(.85,.15,.5).normalize(),this.BACK=new N(.25,.6,-.76).normalize(),this.poke=()=>{this.st.poke=0,this.dirty=!0,Fn()},t.kind==="fuzzy"&&(this.built=Wp(t.look??{shape:"pom",colour:"lime",eyes:"bean",glasses:"none",extra:"none"}));const n=this.K=this.built?hm(this.built,t.look):om[t.kind];this.still=!!t.still,this.own=this.built&&!t.general?lm(this.built):null,this.look=t.look,this.fps=t.fps??30,this.follow=t.follow??!0,this.canvas=document.createElement("canvas"),this.canvas.style.cssText="display:block;width:100%;height:100%";const r=this.canvas.getContext("2d");if(!r)throw new Error("no 2D canvas");this.ctx=r;const[a,s,o,l]=n.cam;this.fov=l/(t.zoom??1),this.camera=new Ct(this.fov,1,.1,60),this.camera.position.set(0,a,s),this.camera.lookAt(0,o,0);const c=b=>new Qe(b[0],b[1],b[2],b[3]),h=new N(n.box[0],n.box[1],n.box[2]),p=new N(n.box[3],n.box[4],n.box[5]);if(this.uniforms={uNoise:{value:dm()},uCam:{value:new N},uBoxMin:{value:h},uBoxMax:{value:p},uPix:{value:.001},uKey:{value:this.KEY.clone()},uKeyCol:{value:Rt("#fff7ee")},uFill:{value:this.FILL.clone()},uFillCol:{value:Rt("#f3f6ff").multiplyScalar(.32)},uBack:{value:this.BACK.clone()},uBackCol:{value:Rt("#ffffff").multiplyScalar(.58)},uUp:{value:new N(0,1,0)},uSky:{value:Rt("#ffffff").multiplyScalar(.42)},uGround:{value:Rt("#f1f3f7").multiplyScalar(.24)},uFwd:{value:new N(0,0,1)},uBackdrop:{value:Rt("#f5f8fc")},uDark:{value:0},uShadow:{value:new ke(n.shadow[0]/2,n.shadow[1]/2)},uTime:{value:0},uExposure:{value:n.exposure},uMain:{value:Rt(n.colors.main)},uAccent:{value:Rt(n.colors.accent)},uBlushC:{value:Rt(n.colors.blush)},uExtra:{value:Rt(n.colors.extra)},uEye:{value:[new Qe,new Qe]},uEyeMode:{value:n.rest},uEyeOpen:{value:1},uNose:{value:c(n.nose)},uBlush:{value:[c([-n.blush[0],n.blush[1],n.blush[2],n.blush[3]]),c(n.blush)]},uEarC:{value:[new N,new N]},uEarM:{value:[new Pe,new Pe]},uSway:{value:0}},this.built){const b=this.built,M=U=>Array.from({length:U},()=>new Qe);Object.assign(this.uniforms,{uNF:{value:b.fur.length},uFA:{value:M(Bi)},uFB:{value:M(Bi)},uFR:{value:M(Bi)},uFurC:{value:b.furC.map(Rt)},uNS:{value:0},uSA:{value:M(zi)},uSB:{value:M(zi)},uSR:{value:M(zi)},uSolC:{value:b.solidC.map(Rt)},uSolB:{value:new Qe(0,0,0,9)}}),b.fur.slice(0,Bi).forEach((U,T)=>{var A,C,S;this.uniforms.uFA.value[T].set(U.a[0],U.a[1],U.a[2],U.ty),this.uniforms.uFB.value[T].set(((A=U.b)==null?void 0:A[0])??0,((C=U.b)==null?void 0:C[1])??0,((S=U.b)==null?void 0:S[2])??0,U.k??0),this.uniforms.uFR.value[T].set(U.r[0],U.r[1],U.r[2],U.fur??0)}),this.setSolids(b.solids(0,1,0,0))}const m=new Ti(p.x-h.x,p.y-h.y,p.z-h.z);m.translate((p.x+h.x)/2,(p.y+h.y)/2,(p.z+h.z)/2),this.geos.push(m),this.mat=this.material(n.glsl),this.body=new Bt(m,this.mat),t.own&&this.specialise(),this.body.frustumCulled=!1,this.root.add(this.squash),this.squash.add(this.body),this.scene.add(this.root);const f=document.createElement("canvas");f.width=f.height=128;const g=f.getContext("2d"),_=g.createRadialGradient(64,64,0,64,64,64);_.addColorStop(0,"rgba(30,40,60,0.4)"),_.addColorStop(.5,"rgba(30,40,60,0.14)"),_.addColorStop(1,"rgba(30,40,60,0)"),g.fillStyle=_,g.fillRect(0,0,128,128);const d=new wo(f),u=new $i(n.shadow[0],n.shadow[1]);this.shadow=new Bt(u,new ps({map:d,transparent:!0,depthWrite:!1})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.002,.04),this.shadow.renderOrder=-1,this.scene.add(this.shadow),this.disposables.push(d,u,this.shadow.material);const w=b=>{const M=document.createElement("canvas");M.width=M.height=128,b(M.getContext("2d"));const U=new wo(M);U.colorSpace=yt;const T=new cl({map:U,transparent:!0,depthWrite:!1,depthTest:!1,opacity:0}),A=new zp(T);return A.renderOrder=10,A.visible=!1,this.scene.add(A),this.disposables.push(U,T),A};this.flake=w(b=>{b.translate(64,64),b.fillStyle=n.prop,b.beginPath();for(let M=0;M<4;M++)b.quadraticCurveTo(0,0,0,-56),b.quadraticCurveTo(0,0,56,0),b.rotate(Math.PI/2);b.fill()}),this.zs=[0,1].map(()=>w(b=>{b.fillStyle=n.prop,b.font="800 108px ui-sans-serif, system-ui, sans-serif",b.textAlign="center",b.textBaseline="middle",b.fillText("z",64,60)})),this.canvas.addEventListener("pointerdown",this.poke),e.appendChild(this.canvas),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.io=new IntersectionObserver(([b])=>{this.onScreen=b.isIntersecting,this.dirty=!0,Fn()}),this.io.observe(e),pm(),this.applyTheme(),this.resize(),t.pose&&this.setPose(t.pose),this.update(0),gi.add(this),Fn()}setSolids(e){var h,p,m;const t=this.uniforms,n=Math.min(e.length,zi);for(let f=0;f<n;f++){const g=e[f];t.uSA.value[f].set(g.a[0],g.a[1],g.a[2],g.ty),t.uSB.value[f].set(((h=g.b)==null?void 0:h[0])??0,((p=g.b)==null?void 0:p[1])??0,((m=g.b)==null?void 0:m[2])??0,g.col??0),t.uSR.value[f].set(g.r[0],g.r[1],g.r[2],g.rough??.2)}t.uNS.value=n;let r=0,a=0,s=0,o=0;const l=[];for(let f=0;f<n;f++){if(e[f].a[1]<=ul+1)continue;const g=e[f],_=g.ty===0?Math.max(g.r[0],g.r[1],g.r[2]):g.ty===1?Math.max(g.r[0],g.r[1]):g.ty===2?Math.hypot(g.b[0],g.b[1],g.b[2]):g.r[0]+g.r[1];l.push([g.a[0],g.a[1],g.a[2],_]),g.ty===1&&l.push([g.b[0],g.b[1],g.b[2],_])}for(const f of l)r+=f[0],a+=f[1],s+=f[2],o++;o&&(r/=o,a/=o,s/=o);let c=0;for(const f of l)c=Math.max(c,Math.hypot(f[0]-r,f[1]-a,f[2]-s)+f[3]);t.uSolB.value.set(r,a,s,o?c:-1)}setPose(e){const t=this.st;e!==t.pose&&(e==="idle"&&(t.pose==="wave"||t.pose==="happy")||(t.pose=e,t.poseT=0,this.dirty=!0,Fn()))}applyTheme(){const e=fm();this.uniforms.uBackCol.value.set("#ffffff").multiplyScalar(e?.85:.58),this.shadow.material.color.set(e?"#000000":"#ffffff");const t=getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim().split(/\s+/).map(Number),n=this.uniforms.uBackdrop.value;t.length===3&&t.every(r=>Number.isFinite(r))?n.setRGB(t[0]/255,t[1]/255,t[2]/255,yt):n.set(e?"#070a10":"#f5f8fc"),this.uniforms.uDark.value=e?1:0,this.dirty=!0,Fn()}material(e){return new cn({vertexShader:im,fragmentShader:cm(e,this.built,this.look),uniforms:this.uniforms,transparent:!0,depthWrite:!1,premultipliedAlpha:!0})}get gain(){return this.own&&this.onScreen&&!this.still?this.w*this.h:0}specialise(){if(!this.own)return;const e=this.mat;this.mat=this.material(this.own),this.own=null,this.body.material=this.mat,e.dispose(),this.dirty=!0}resize(){const e=this.host.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,2)*Dr;this.w=Math.max(1,Math.round(e.width*t)),this.h=Math.max(1,Math.round(e.height*t)),this.canvas.width=this.w,this.canvas.height=this.h,this.camera.aspect=this.w/this.h,this.camera.updateProjectionMatrix(),this.uniforms.uPix.value=2*Math.tan(Sc.degToRad(this.fov/2))/this.h,this.dirty=!0,Fn()}frame(e){if(!this.onScreen||this.w<2)return!1;if(this.still||Po())return this.dirty&&(this.update(0),this.draw(),this.dirty=!1),!1;if(this.last&&e-this.last<1e3/this.fps-2)return!0;const t=this.last?Math.min(.05,Math.max(0,e-this.last)/1e3):1/this.fps;return this.last=e,this.update(t),this.draw(),!0}draw(){const e=dl(this.w,this.h);e.setViewport(0,0,this.w,this.h),e.setScissor(0,0,this.w,this.h),e.setScissorTest(!0),e.clear(),e.render(this.scene,this.camera),this.ctx.clearRect(0,0,this.w,this.h),this.ctx.drawImage(e.domElement,0,Vi-this.h,this.w,this.h,0,0,this.w,this.h)}setEar(e,t,n,r){this.earE.set(0,n*e.yaw,-n*(e.lean+r),"YXZ"),this.earM.makeRotationFromEuler(this.earE),this.v3.set(n*e.off[0],e.off[1],0).applyMatrix4(this.earM),this.v3.x+=n*e.base[0],this.v3.y+=e.base[1],this.v3.z+=e.base[2],this.uniforms.uEarC.value[t].copy(this.v3),this.uniforms.uEarM.value[t].setFromMatrix4(this.earM).transpose()}update(e){const t=this.st,n=this.K,r=this.uniforms,a=Po();t.t+=e,t.poseT+=e;const s=t.t,o=t.pose,l=t.poseT,c=(C,S,y,R,W)=>{const z=(y-C)*R-S*W;return S+=z*e,[C+S*e,S]},h=new ke;if(o==="think")h.set(-.5,.6);else if(o==="sleep")h.set(0,-.3);else if(this.follow&&vi.seen){const C=this.host.getBoundingClientRect();h.set(Math.max(-1,Math.min(1,(vi.x-(C.left+C.width/2))/(window.innerWidth*.45))),Math.max(-1,Math.min(1,(C.top+C.height*.45-vi.y)/(window.innerHeight*.45))))}else h.set(Math.sin(s*.31)*.15,Math.sin(s*.23)*.08);e===0?t.look.copy(h):([t.look.x,t.lookV.x]=c(t.look.x,t.lookV.x,h.x,38,10),[t.look.y,t.lookV.y]=c(t.look.y,t.lookV.y,h.y,38,10)),this.root.rotation.y=t.look.x*.5,this.root.rotation.x=-t.look.y*.16;let p=o==="think"?.07+Math.sin(s*1.4)*.035:o==="sleep"?.05:0;o==="wave"&&l<1.6&&(p=.13*Math.sin(l*9)*(1-um(l/1.6))),e===0?t.tilt=p:[t.tilt,t.tiltV]=c(t.tilt,t.tiltV,p,30,8),this.root.rotation.z=t.tilt;const m=a?0:o==="sleep"?.02*Math.sin(s*1.25):.012*Math.sin(s*1.9);let f=0,g=0;if(o==="happy"&&!a){const C=l/.9;if(C<1)if(C<.15)g=-.12*Math.sin(C/.15*Math.PI);else if(C<.7){const S=(C-.15)/.55;f=.28*Math.sin(S*Math.PI),g=.06*Math.sin(S*Math.PI)}else g=-.1*Math.sin((C-.7)/.3*Math.PI)}t.poke>=0&&(t.poke+=e,t.poke<.5?g+=-.14*Math.sin(Math.min(1,t.poke/.5)*Math.PI)*Math.exp(-t.poke*3):t.poke=-1),this.root.position.y=f;const _=1+m+g;this.squash.scale.set(1/Math.sqrt(_),_,1/Math.sqrt(_)),this.shadow.scale.setScalar(1-f*.7),this.shadow.material.opacity=1-f*1.2;let d=n.rest,u=1;if(o==="wave"||o==="happy")d=1;else if(o==="sleep")d=2;else if(d===0&&!a&&(t.blinkIn-=e,t.blinkIn<=0&&t.blinkT<0&&(t.blinkT=0,t.blinkIn=Math.random()<.18?.28:2.4+Math.random()*3.2),t.blinkT>=0)){t.blinkT+=e;const C=t.blinkT/.15;u=C<1?Math.abs(1-2*C):1,C>=1&&(t.blinkT=-1)}(o==="wave"&&l>1.9||o==="happy"&&l>1.4||a&&(o==="wave"||o==="happy"))&&(t.pose="idle",t.poseT=0);const w=n.eye,b=t.look.x*.04,M=t.look.y*.03;r.uEye.value[0].set(-w.x+b,w.y+M,w.rx,w.ry),r.uEye.value[1].set(w.x+b,w.y+M,w.rx,w.ry),r.uEyeMode.value=d,r.uEyeOpen.value=Math.max(.05,u),this.built&&this.setSolids(this.built.solids(d,u,b,M)),r.uSway.value=a?0:s*1.4,r.uTime.value=a?0:s;const U=n.ears;U&&[-1,1].forEach((C,S)=>{const y=Math.max(0,Math.sin(s*.9+C*1.7)-.92)*4;this.setEar(U,S,C,y*.2+(o==="wave"?.06*Math.sin(l*9):0)+(o==="sleep"?-.1:0))});const T=n.top,A=n.box[3];t.flake+=((o==="think"?1:0)-t.flake)*(e===0?1:1-Math.exp(-e*6)),this.flake.visible=t.flake>.01,this.flake.material.opacity=t.flake,this.flake.material.rotation=a?0:Math.sin(s*2)*.25,this.flake.scale.setScalar(.3*(.5+.5*t.flake)),this.flake.position.set(A*.82,T+.42+(a?0:Math.sin(s*1.6)*.04),.3),t.zz+=((o==="sleep"?1:0)-t.zz)*(e===0?1:1-Math.exp(-e*4)),this.zs.forEach((C,S)=>{const y=a?.5+S*.25:(s*.42+S*.5)%1;C.visible=t.zz>.01,C.position.set(A*.62+y*.32,T*.95+y*.5,.3),C.material.opacity=t.zz*Math.sin(Math.PI*y),C.scale.setScalar((.15+.12*y)*(S?.85:1))}),this.body.updateWorldMatrix(!0,!1),r.uCam.value.copy(this.camera.position),this.body.worldToLocal(r.uCam.value),this.body.getWorldQuaternion(this.q),this.qi.copy(this.q).invert(),r.uKey.value.copy(this.KEY).applyQuaternion(this.qi),r.uFill.value.copy(this.FILL).applyQuaternion(this.qi),r.uBack.value.copy(this.BACK).applyQuaternion(this.qi),r.uUp.value.set(0,1,0).applyQuaternion(this.qi),r.uFwd.value.set(0,0,1).applyQuaternion(this.qi)}dispose(){gi.delete(this),this.ro.disconnect(),this.io.disconnect(),this.canvas.removeEventListener("pointerdown",this.poke),this.canvas.remove(),this.mat.dispose(),this.geos.forEach(e=>e.dispose()),this.disposables.forEach(e=>e.dispose())}}export{vm as View,gm as probe};
