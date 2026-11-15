/* eslint-disable */
// @ts-nocheck
/*
 * PanoramaCarousel / CurveCarouselScroll — vendored Framer community component.
 *
 * NOT OUR CODE. Copyright remains with its creator.
 *   Licence: Framer Community Terms, "Limited" (free content)
 *            https://www.framer.com/legal/community-terms
 *
 * The licence permits using and modifying it in our own projects, including
 * commercial ones. It does NOT permit reselling it, offering it on another
 * marketplace, publishing it as a standalone asset, or claiming it as our own.
 * The licence is revocable; if it is withdrawn, every copy must be deleted.
 *
 * Source:  https://framer.com/m/PanoramaCarousel-ob0y5r.js@0qiXXzmIneCN0mO22ZPX
 * Resolves to:
 *   https://framerusercontent.com/modules/ycQjcJe9xGLUgvafoTUn/0qiXXzmIneCN0mO22ZPX/CurveCarouselScroll.js
 *
 * Vendored rather than imported from the URL at runtime so visitors never
 * fetch third-party code from framer.com, the version is pinned, and the
 * page still builds and runs offline.
 *
 * TWO edits from the original, both marked inline with "KHARIS PATCH":
 *
 * 1. The `framer` runtime imports resolve to ./framer-shim so the module runs
 *    outside the Framer editor. The shim is a copy of the one beside
 *    AtomicGlobe rather than a shared import, so re-vendoring either
 *    component cannot disturb the other.
 *
 * 2. `focusCount` and `focusDim` props. The component fades every tile
 *    except the few at the centre of the arc, so images gain their colour as
 *    they come into focus. It rides the same Web Animations keyframes that
 *    already drive the curve, so it tracks the row exactly and costs no
 *    extra scheduling. `focusCount` defaults to 0, which is the original
 *    behaviour; `focusDim` says what the faded state is, defaulting to plain
 *    greyscale.
 *
 * 3. Video items. An entry in `items` may carry `video` alongside `image`,
 *    and that tile then renders a muted, looping <video> with the image as
 *    its poster. Such a tile is flat rather than curved across its own
 *    width — see the note at the patch — and clips pause when the row
 *    scrolls out of view. Items without `video` are unaffected.
 *
 * PERFORMANCE, measured so the next person does not repeat the experiments.
 * The hero runs about 42fps against 60fps on a page without it, with ~40% of
 * frames over 24ms. What it is NOT: the focus filter, the videos, the square
 * corners, and SLICES. Lowering SLICES from 16 to 10 cut the strip count from
 * 96 to 60 and changed nothing (41.7fps against 43.7), so it was put back —
 * the strips are what makes a tile curve across its own width, and there is
 * no reason to spend that fidelity for no gain. `will-change:transform` on
 * the strips makes it markedly WORSE (28fps) by promoting 96 layers.
 *
 * What it IS: painted area. Hiding one of the two rows recovers ~5fps and
 * hiding both restores 60, and an earlier reading of that as "element count"
 * was wrong — hiding a row removes half the composited surface, not just
 * half the nodes. A full-bleed wall of 3D-transformed photography costs what
 * it costs. The levers that would actually work are fewer rows, a shorter
 * hero, or less of the viewport covered.
 *
 * 4. Strips bleed on their outer edges too. A tile is SLICES flat strips
 *    stood around an arc, and a flat chord is slightly shorter than the arc
 *    it spans, so a hairline opens between neighbours. The component already
 *    overlapped strips by BLEED to hide that — but skipped the first and
 *    last strip of each tile, which left the shortfall to show at every
 *    tile seam. With no gap between tiles that reads as a dark slit down the
 *    wall, and a deeper curve widens it. Now every strip bleeds both ways
 *    (`isFirst?0:BLEED` → `BLEED`, and the inner <img> offset to match), so
 *    tiles overlap their neighbours by 2px and the row reads as one bent
 *    surface. Only matters when gap is 0; with a gap there is nothing to
 *    close.
 *
 * Re-vendoring loses edits 2, 3 and 4. Re-apply them by searching for
 * "KHARIS PATCH" in this file's git history.
 */
import{jsx as _jsx}from"react/jsx-runtime";import{Fragment,useEffect,useRef,useState,startTransition}from"react";import{addPropertyControls,ControlType,useIsStaticRenderer}from"./framer-shim";// Vertical strips per tile: each one is a flat facet of the cylinder.
const SLICES=16;// Camera distance from the screen, as a multiple of the cylinder's radius.
const CAMERA=1.6;// A tile is never wider than this share of the component's width.
const MAX_WIDTH=55;// Overlap between neighbouring strips, in px.
const BLEED=2;
/* KHARIS PATCH — video tiles bend like every other tile.
 *
 * Each tile is SLICES strips, each rotated a little further round the
 * cylinder; that is what curves a tile along its own length. A <video>
 * cannot be cut into strips the way an <img> can, so this used to render one
 * flat <video> per tile — and a flat rectangle sitting among curved ones is
 * exactly the rigid edge you notice.
 *
 * Sixteen <video> elements per tile would be sixteen decoders drifting out of
 * step, which is why the flat fallback existed. So: ONE decoder, parked at
 * 2px and invisible, and sixteen <canvas> strips that each blit their own
 * slice of the current frame. The strips stay in step because they are all
 * reading the same frame, and the work is one tile's worth of pixels per
 * frame however many strips it is divided into.
 *
 * The source rectangle mirrors what the <img> branch gets from object-fit:
 * cover — centre-cropped to the tile's aspect, then divided across the
 * strips, with the same BLEED overlap so no hairline opens between them.
 */
const VTILES=new Map();
let VSEQ=0,VRAF=0;
function vpaint(){
  VRAF=0;
  let live=false;
  for(const[id,e]of VTILES){
    const v=e.video;
    if(!v||!v.isConnected){VTILES.delete(id);continue;}
    live=true;
    const vw=v.videoWidth,vh=v.videoHeight;
    if(v.readyState<2||!vw||!vh)continue;
    // A paused clip still holds its last frame; there is nothing to repaint.
    if(v.paused&&e.drawn)continue;
    for(const[k,c]of e.slices){
      if(!c||!c.isConnected){e.slices.delete(k);continue;}
      const sliceW=c.clientWidth,tileH=c.clientHeight;
      if(!(sliceW>0)||!(tileH>0))continue;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const bw=Math.max(1,Math.round(sliceW*dpr)),bh=Math.max(1,Math.round(tileH*dpr));
      if(c.width!==bw||c.height!==bh){c.width=bw;c.height=bh;}
      const ctx=c.getContext("2d");
      if(!ctx)continue;
      // The strip is BLEED px wider than its share of the tile at each side.
      const coreW=Math.max(1,sliceW-2*BLEED),tileW=coreW*SLICES;
      const tileAspect=tileW/tileH;
      let sw=vw,sh=vh,sx0=0,sy0=0;
      if(vw/vh>tileAspect){sw=vh*tileAspect;sx0=(vw-sw)/2;}
      else{sh=vw/tileAspect;sy0=(vh-sh)/2;}
      const perPx=sw/tileW;
      ctx.drawImage(v,sx0+(k*coreW-BLEED)*perPx,sy0,sliceW*perPx,sh,0,0,bw,bh);
    }
    e.drawn=true;
  }
  if(live)VRAF=requestAnimationFrame(vpaint);
}
function vreg(id,k,el){
  let e=VTILES.get(id);
  if(!e){if(!el)return;e={video:null,slices:new Map(),drawn:false};VTILES.set(id,e);}
  if(k<0)e.video=el;else if(el)e.slices.set(k,el);else e.slices.delete(k);
  e.drawn=false;
  if(!VRAF&&typeof requestAnimationFrame==="function")VRAF=requestAnimationFrame(vpaint);
}
const DEFAULT_IMAGES=[{src:"https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",alt:"Gradient 1"},{src:"https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",alt:"Gradient 2"},{src:"https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",alt:"Gradient 3"},{src:"https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",alt:"Gradient 4"},{src:"https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",alt:"Gradient 5"}];// Cylinder radius, as a share of the width, that puts the frame's edge `bend` radians round the arc.
function arc(bend){return(CAMERA-1+Math.cos(bend))/(2*CAMERA*Math.sin(bend));}function measure(width,height,tile,aspect,gap,bend){const h=Math.min(tile/100*height,MAX_WIDTH/100*width/aspect);const radius=width*arc(bend);if(!(h>0)||!(radius>0))return{columns:2,sweep:0,unit:0,limit:0};const deg=rad=>rad*180/Math.PI;const unit=deg(h/radius);const pitch=(aspect+gap/100)*unit;const limit=deg(bend)+aspect*unit/2;const columns=Math.min(60,Math.max(2,Math.ceil(2*limit/pitch)));const round=n=>+n.toFixed(4);const sweep=round(columns*pitch/2);return{columns,sweep,unit:round(unit),limit:round(Math.min(sweep,limit))};}/**
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 560
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */export default function PanoramaCarousel(props){const{items=[],speed=4,direction="left",autoplay=true,pauseOnHover=false,draggable=false,momentum=.5,scrollEffect=false,scrollBoost=1,scrollMode="direction",tileHeight=30,aspectRatio=1.78,gap=6,radius="12px",axis=50,curve=80,fade=12,placeholder="rgba(128, 128, 128, 0.15)",/* KHARIS PATCH: how many tiles keep their colour at the centre (0 = original),
 * and what the tiles outside that window fade to. The defaults desaturate
 * only; the hero also darkens, so the headline stays readable over it. */focusCount=0,focusDim,style}=props;const isStatic=useIsStaticRenderer();const ref=useRef(null);const bend=Math.min(85,Math.max(5,curve))*Math.PI/180;const reverse=direction==="right";const list=items.length?items:DEFAULT_IMAGES.map(()=>({}));const images=list.map((item,i)=>item?.image?.src?item.image:DEFAULT_IMAGES[i%DEFAULT_IMAGES.length]);const srcKey=images.map(img=>img.src).join("|");const[layout,setLayout]=useState(null);// How many times each tile has wrapped round the loop. Picks the image it shows.
const[laps,setLaps]=useState([]);const[inView,setInView]=useState(true);const tileEls=useRef([]);/* KHARIS PATCH: identifies this row's video tiles to the strip painter. */const vseq=useRef(0);if(!vseq.current)vseq.current=++VSEQ;const anims=useRef([]);// Logical time of the loop in ms, carried over whenever the animations are rebuilt.
const clock=useRef({base:0,time:0});const lapsRef=useRef([]);const tilePx=useRef(0);const flags=useRef({inView:true,hovered:false,dragging:false,coasting:false,reduced:false,autoplay});useEffect(()=>{const el=ref.current;if(!el||typeof ResizeObserver==="undefined")return;const ro=new ResizeObserver(([entry])=>{const{width,height}=entry.contentRect;tilePx.current=Math.min(tileHeight/100*height,MAX_WIDTH/100*width/aspectRatio);const next=measure(width,height,tileHeight,aspectRatio,gap,bend);startTransition(()=>setLayout(prev=>prev?.columns===next.columns&&prev.sweep===next.sweep&&prev.unit===next.unit?prev:next));});ro.observe(el);return()=>ro.disconnect();},[tileHeight,aspectRatio,gap,bend]);useEffect(()=>{if(isStatic)return;const el=ref.current;if(!el||typeof IntersectionObserver==="undefined")return;const io=new IntersectionObserver(([entry])=>startTransition(()=>setInView(entry.isIntersecting)),{threshold:.01});io.observe(el);return()=>io.disconnect();},[isStatic]);// Fetch every image up front, a tile picks up its next one just before it comes back into view.
useEffect(()=>{if(isStatic||typeof window==="undefined")return;for(const img of images)if(img.src)new window.Image().src=img.src;},[srcKey,isStatic]);const{columns,sweep,unit,limit}=layout??measure(1200,560,tileHeight,aspectRatio,gap,bend);// Every length is a multiple of the tile's height.
const u=n=>`calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(MAX_WIDTH/aspectRatio).toFixed(4)}cqw))`;const r=100*arc(bend);const radiusCq=`${+r.toFixed(3)}cqw`;const turn=deg=>`translateZ(${radiusCq}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radiusCq})`;// Share of the loop, at each end, where a tile is wholly off-screen and hidden.
const hide=Math.max(0,(sweep-limit)/(2*sweep||1));// Framer's radius control gives "12px" or "tl tr br bl"; older instances stored a plain number.
const corners=(()=>{const parts=String(radius).trim().split(/\s+/).map(p=>parseFloat(p)||0);const[tl=0,tr=tl,br=tl,bl=tr]=parts;return{tl,tr,br,bl};})();const share=aspectRatio/SLICES;const durMs=columns*speed*1e3;const stepMs=speed*1e3;// Auto-scroll speed, 0 to 1. Pauses and restarts ease the speed instead of cutting it, so a hover or the end
// of a drag hands over smoothly. Only a hand on the row stops it dead; off-screen it truly pauses.
const rate=useRef({value:autoplay?1:0,raf:0});const setRate=v=>{rate.current.value=v;for(const a of anims.current)a.playbackRate=v;};const syncPlay=()=>{const f=flags.current;const r=rate.current;cancelAnimationFrame(r.raf);r.raf=0;if(!f.inView){for(const a of anims.current)a.pause();return;}for(const a of anims.current)if(a.playState!=="running")a.play();if(f.dragging)return setRate(0);const target=f.autoplay&&!f.hovered&&!f.reduced?1:0;let last=performance.now();const ease=()=>{const now=performance.now();const k=1-Math.exp(-(now-last)/280);last=now;const v=r.value+(target-r.value)*k;if(Math.abs(target-v)<.005){setRate(target);r.raf=0;}else{setRate(v);r.raf=requestAnimationFrame(ease);}};if(r.value!==target)r.raf=requestAnimationFrame(ease);else setRate(target);};// One animation per tile, all on the same clock: tile t runs t steps ahead. Rebuilt when the loop changes,
// starting from the time the previous build had reached, so nothing jumps.
useEffect(()=>{if(isStatic||!(sweep>0))return;const els=tileEls.current.slice(0,columns);if(els.length<columns||els.some(el=>!el||typeof el.animate!=="function"))return;flags.current.reduced=typeof window!=="undefined"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;const at=o=>turn(-sweep+2*sweep*o);const e=1e-5;const stops=[[0,"hidden"],[hide,"hidden"],[Math.min(hide+e,.5),"visible"],[Math.max(1-hide-e,.5),"visible"],[1-hide,"hidden"],[1,"hidden"]];/* KHARIS PATCH — colour at the centre of the arc only.
 * A tile occupies 1/columns of the loop, so `focusCount` tiles span
 * focusCount/columns, i.e. half that either side of the centre at 0.5.
 * Extra offsets are merged into the existing stop list and every keyframe
 * then carries all three properties, because the Web Animations API will
 * only interpolate a property that appears in the first and last frame.
 * Visibility is read back off the original stops so its step behaviour is
 * unchanged. */
const halfWin=focusCount>0&&columns>0?Math.max(focusCount,0)/(2*columns):0;
/* Full colour across the middle tile, then a ramp out to the dimmed state at
 * the edge of the window. A bare linear ramp peaked only at the instant a
 * tile crossed dead centre, so nothing was ever properly in colour.
 *
 * Every frame emits the same three filter functions in the same order,
 * because the Web Animations API will only interpolate a filter list against
 * another list with a matching shape. t is 1 at the centre, 0 outside. */
const plateau=columns>0?.5/columns:0;
const dimG=focusDim?.grayscale??1,dimB=focusDim?.brightness??1,dimC=focusDim?.contrast??1;
const satAt=o=>{if(halfWin<=0)return"none";const d=Math.abs(o-.5);const span=Math.max(halfWin-plateau,1e-6);const t=1-Math.min(Math.max((d-plateau)/span,0),1);const k=1-t;return`grayscale(${(k*dimG).toFixed(3)}) brightness(${(1-k*(1-dimB)).toFixed(3)}) contrast(${(1-k*(1-dimC)).toFixed(3)})`;};
const visAt=o=>{let v="hidden";for(const s of stops){if(s[0]<=o)v=s[1];else break;}return v;};
const offsets=[...new Set(stops.map(s=>s[0]).concat(halfWin>0?[Math.max(0,.5-halfWin),.5-plateau,.5,.5+plateau,Math.min(1,.5+halfWin)]:[]))].sort((a,b)=>a-b);
/* KHARIS PATCH: with no focus window every keyframe carried filter:"none",
   which still declares filter as an animated property on every tile. When
   nothing is being dimmed it is left out of the keyframes entirely. */
const frames=offsets.map(offset=>{const f={offset,transform:at(offset),visibility:visAt(offset)};if(halfWin>0)f.filter=satAt(offset);return f;});// A large base keeps currentTime positive however far back the row is dragged.
const base=durMs*1e4;clock.current.base=base;anims.current=els.map((el,t)=>{const a=el.animate(frames,{duration:durMs,iterations:Infinity,easing:"linear",direction:reverse?"reverse":"normal"});a.currentTime=base+clock.current.time+t*stepMs;a.playbackRate=rate.current.value;return a;});syncPlay();return()=>{const lead=anims.current[0];if(lead)clock.current.time=Number(lead.currentTime??0)-clock.current.base;for(const a of anims.current)a.cancel();anims.current=[];};},[isStatic,columns,durMs,stepMs,reverse,sweep,hide,radiusCq]);useEffect(()=>{flags.current.inView=inView;syncPlay();/* KHARIS PATCH: a clip that has scrolled off screen should stop decoding. The row already pauses itself; the videos inside it did not. */const vids=ref.current?.querySelectorAll?.("video");if(vids)for(const v of vids){if(inView){const p=v.play();if(p&&p.catch)p.catch(()=>{});}else v.pause();}},[inView]);useEffect(()=>{flags.current.autoplay=autoplay;syncPlay();},[autoplay]);useEffect(()=>()=>cancelAnimationFrame(rate.current.raf),[]);// Follows each tile's position to hand it its next image when it wraps, out of sight, in either direction.
useEffect(()=>{if(isStatic||!inView)return;let raf=0;const loop=()=>{const list=anims.current;if(list.length){const base=clock.current.base;const next=list.map(a=>Math.floor((Number(a.currentTime??0)-base)/durMs));const prev=lapsRef.current;if(next.length!==prev.length||next.some((v,i)=>v!==prev[i])){lapsRef.current=next;startTransition(()=>setLaps(next));}}raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf);},[isStatic,inView,durMs]);// Moves the whole row by dx screen pixels, measured at the centre of the arc.
const shift=dx=>{const pitchPx=(aspectRatio+gap/100)*tilePx.current;if(!(pitchPx>0))return;const ms=(reverse?dx:-dx)*stepMs/pitchPx;for(const a of anims.current)a.currentTime=Number(a.currentTime??0)+ms;};// Page scroll pushes the row like a drag: down along the set direction, up against it. The push is eased
// over a few frames so wheel steps glide instead of jumping; the auto-scroll carries on underneath.
useEffect(()=>{if(isStatic||!scrollEffect||typeof window==="undefined")return;let y=window.scrollY;let pending=0;let raf=0;const glide=()=>{const step=pending*.18;pending-=step;shift(reverse?step:-step);if(Math.abs(pending)>.5)raf=requestAnimationFrame(glide);else{shift(reverse?pending:-pending);pending=0;raf=0;}};const onScroll=()=>{const next=window.scrollY;const dy=next-y;y=next;if(!dy||!flags.current.inView)return;pending+=(scrollMode==="scroll"?dy:Math.abs(dy))*scrollBoost;if(!raf)raf=requestAnimationFrame(glide);};window.addEventListener("scroll",onScroll,{passive:true});return()=>{window.removeEventListener("scroll",onScroll);cancelAnimationFrame(raf);};},[isStatic,scrollEffect,scrollBoost,scrollMode,reverse,aspectRatio,gap,stepMs]);const drag=useRef({id:-1,x:0,t:0,v:0,raf:0});const onPointerDown=e=>{if(!draggable||isStatic||e.pointerType==="mouse"&&e.button!==0)return;const d=drag.current;cancelAnimationFrame(d.raf);d.id=e.pointerId;d.x=e.clientX;d.t=performance.now();d.v=0;flags.current.dragging=true;flags.current.coasting=false;syncPlay();e.currentTarget.setPointerCapture?.(e.pointerId);e.currentTarget.style.cursor="grabbing";};const onPointerMove=e=>{const d=drag.current;if(!flags.current.dragging||e.pointerId!==d.id)return;const now=performance.now();const dx=e.clientX-d.x;const dt=Math.max(1,now-d.t);shift(dx);d.v=.8*d.v+.2*(dx/dt);d.x=e.clientX;d.t=now;};const onPointerUp=e=>{const d=drag.current;if(!flags.current.dragging||e.pointerId!==d.id)return;flags.current.dragging=false;d.id=-1;e.currentTarget.style.cursor="grab";// The auto-scroll eases back in straight away; a throw glides on top of it and fades into it.
syncPlay();// A pause before letting go means no throw.
let v=performance.now()-d.t>80?0:d.v;if(momentum>0&&Math.abs(v)>.05){flags.current.coasting=true;const friction=.86+.12*Math.min(1,momentum);let last=performance.now();const coast=()=>{const now=performance.now();const dt=now-last;last=now;shift(v*dt);v*=Math.pow(friction,dt/16.67);if(Math.abs(v)>.01&&flags.current.coasting)d.raf=requestAnimationFrame(coast);else flags.current.coasting=false;};d.raf=requestAnimationFrame(coast);}};useEffect(()=>()=>cancelAnimationFrame(drag.current.raf),[]);const onPointerEnter=e=>{if(!pauseOnHover||e.pointerType!=="mouse")return;flags.current.hovered=true;syncPlay();};const onPointerLeave=e=>{if(!flags.current.hovered)return;flags.current.hovered=false;syncPlay();};useEffect(()=>{if(!pauseOnHover&&flags.current.hovered){flags.current.hovered=false;syncPlay();}},[pauseOnHover]);const live=!isStatic;const canDrag=live&&draggable;// Fully transparent for the last 2px on each side, so a scaled canvas can't leave an unmasked pixel column.
const mask=`linear-gradient(90deg,transparent 2px,#000 ${fade}%,#000 ${100-fade}%,transparent calc(100% - 2px))`;return /*#__PURE__*/_jsx("div",{ref:ref,style:{...style,position:"relative",width:"100%",height:"100%",overflow:"hidden",containerType:"size",cursor:canDrag?"grab":undefined,// Vertical swipes still scroll the page, horizontal ones drag the row.
touchAction:canDrag?"pan-y":undefined,userSelect:canDrag?"none":undefined,WebkitUserSelect:canDrag?"none":undefined},onPointerDown:canDrag?onPointerDown:undefined,onPointerMove:canDrag?onPointerMove:undefined,onPointerUp:canDrag?onPointerUp:undefined,onPointerCancel:canDrag?onPointerUp:undefined,onPointerEnter:live&&pauseOnHover?onPointerEnter:undefined,onPointerLeave:live&&pauseOnHover?onPointerLeave:undefined,children:/*#__PURE__*/_jsx("div",{"aria-hidden":true,style:{position:"absolute",inset:0,pointerEvents:"none",opacity:layout||isStatic?1:0,transition:isStatic?"none":"opacity 0.5s ease",perspective:`${+(r*CAMERA).toFixed(3)}cqw`,perspectiveOrigin:`50% ${axis}%`,maskImage:mask,WebkitMaskImage:mask,maskRepeat:"no-repeat",WebkitMaskRepeat:"no-repeat",maskSize:"100% 100%",WebkitMaskSize:"100% 100%"},children:Array.from({length:columns},(_,t)=>{// Numbers tiles in the order they come on screen.
const first=reverse?t:columns-1-t;const n=Math.max(images.length,1);const img=images[(((laps[t]??0)*columns+first)%n+n)%n];// `base` is where the strips' common centre sits: the tile's own box when nested, or the tile's
// centre in the band when laid flat. Each strip is turned round the axis by `offset` more degrees.
const strips=(base,offset)=>{
/* KHARIS PATCH — a tile whose item carries `video` renders as one element.
 * Every other tile is SLICES clipped copies of the same <img>, which is how
 * the curve is faked across a tile's own width. A <video> cannot be sliced
 * that way: it would mean sixteen decoders per tile, drifting out of sync
 * with each other. So a video tile is flat — it still turns with the row,
 * it just does not bend within its own width, which at these tile sizes is
 * not something you can see. `poster` is what shows until the first frame
 * decodes, so a video item still wants its image. */
if(img?.video){const vid=`${vseq.current}:${t}`;const out=Array.from({length:SLICES},(_,k)=>{const isFirst=k===0;const isLast=k===SLICES-1;return /*#__PURE__*/_jsx("div",{style:{position:"absolute",top:isStatic?`calc(${axis}% - ${u(.5)})`:0,overflow:"hidden",background:placeholder,borderTopLeftRadius:isFirst?corners.tl:0,borderBottomLeftRadius:isFirst?corners.bl:0,borderTopRightRadius:isLast?corners.tr:0,borderBottomRightRadius:isLast?corners.br:0,left:`calc(${base} - ${BLEED}px)`,width:`calc(${u(share)} + ${2*BLEED}px)`,height:u(1),transform:turn(offset+(aspectRatio/2-(k+.5)*share)*unit)},children:/*#__PURE__*/_jsx("canvas",{"aria-hidden":true,ref:el=>vreg(vid,k,el),style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}})},k);});out.push(/*#__PURE__*/_jsx("video",{src:img.video,poster:img.src,loop:true,autoPlay:true,playsInline:true,preload:"auto",controls:false,disablePictureInPicture:true,tabIndex:-1,"aria-hidden":true,draggable:false,ref:el=>{if(el){/* React does not reflect `muted` as an attribute, and without it autoplay is blocked. */el.muted=true;el.defaultMuted=true;el.playsInline=true;el.setAttribute("muted","");el.setAttribute("playsinline","");const p=el.play();if(p&&p.catch)p.catch(()=>{});}vreg(vid,-1,el);},style:{position:"absolute",top:0,left:0,width:"2px",height:"2px",opacity:0,pointerEvents:"none"}},"kharis-video"));return out;}
return Array.from({length:SLICES},(_,k)=>{const isFirst=k===0;const isLast=k===SLICES-1;return /*#__PURE__*/_jsx("div",{style:{position:"absolute",top:isStatic?`calc(${axis}% - ${u(.5)})`:0,overflow:"hidden",background:placeholder,borderTopLeftRadius:isFirst?corners.tl:0,borderBottomLeftRadius:isFirst?corners.bl:0,borderTopRightRadius:isLast?corners.tr:0,borderBottomRightRadius:isLast?corners.br:0,// Inner edges reach BLEED px under the neighbouring facets, so no hairline opens between them.
    left:`calc(${base} - ${BLEED}px)`,width:`calc(${u(share)} + ${2*BLEED}px)`,height:u(1),transform:turn(offset+(aspectRatio/2-(k+.5)*share)*unit)},children:img?.src?/*#__PURE__*/_jsx("img",{src:img.src,alt:isFirst?img.alt??"":"",draggable:false,style:{position:"absolute",top:0,maxWidth:"none",objectFit:"cover",left:`calc(${u(-k*share)} + ${BLEED}px)`,width:u(aspectRatio),height:u(1)}}):null},k);});};// Static: no tile wrapper and no preserve-3d, every strip sits flat in the band with its full
// angle. Same picture, but the canvas has no 3D sorting to get wrong.
if(isStatic){const p=t/columns;const angle=reverse?sweep-2*sweep*p:-sweep+2*sweep*p;if(Math.abs(angle)>limit)return null;return /*#__PURE__*/_jsx(Fragment,{children:strips(`50% - ${u(share/2)}`,angle)},t);}return /*#__PURE__*/_jsx("div",{ref:el=>{tileEls.current[t]=el;},style:{position:"absolute",left:`calc(50% - ${u(aspectRatio/2)})`,top:`calc(${axis}% - ${u(.5)})`,width:u(aspectRatio),height:u(1),transformStyle:"preserve-3d",// Hidden until its animation takes over.
visibility:"hidden"},children:strips(u((aspectRatio-share)/2),0)},t);})})});}PanoramaCarousel.displayName="Panorama Carousel";addPropertyControls(PanoramaCarousel,{items:{type:ControlType.Array,title:"Images",control:{type:ControlType.Object,controls:{image:{type:ControlType.ResponsiveImage,title:"Image"}}},defaultValue:[{},{},{},{},{}]},autoplay:{type:ControlType.Boolean,title:"Autoplay",defaultValue:true},speed:{type:ControlType.Number,title:"Duration",description:"Seconds for the row to advance by one image.",defaultValue:4,min:.5,max:20,step:.1,unit:"s",hidden:p=>p.autoplay===false},direction:{type:ControlType.Enum,title:"Direction",options:["left","right"],optionTitles:["Left","Right"],defaultValue:"left",displaySegmentedControl:true},pauseOnHover:{type:ControlType.Boolean,title:"Hover Pause",defaultValue:false,hidden:p=>p.autoplay===false},draggable:{type:ControlType.Boolean,title:"Draggable",defaultValue:false},momentum:{type:ControlType.Number,title:"Momentum",description:"How far the row keeps gliding after a throw.",defaultValue:.5,min:0,max:1,step:.05,hidden:p=>!p.draggable},scrollEffect:{type:ControlType.Boolean,title:"Scroll Effect",description:"Scrolling the page pushes the row forward.",defaultValue:false},scrollMode:{type:ControlType.Enum,title:"Push",description:"Always along Direction, or following the scroll (up reverses).",options:["direction","scroll"],optionTitles:["Direction","Scroll"],defaultValue:"direction",displaySegmentedControl:true,hidden:p=>!p.scrollEffect},scrollBoost:{type:ControlType.Number,title:"Strength",description:"How far the row moves per pixel scrolled.",defaultValue:1,min:.1,max:5,step:.1,hidden:p=>!p.scrollEffect},curve:{type:ControlType.Number,title:"Curve",description:"How hard the ends bend toward the viewer.",defaultValue:80,min:5,max:85,step:1,unit:"\xb0"},tileHeight:{type:ControlType.Number,title:"Size",description:"Image height, as a share of the component’s height.",defaultValue:30,min:5,max:100,step:1,unit:"%"},aspectRatio:{type:ControlType.Number,title:"Ratio",description:"Image width divided by height (1.78 = 16:9).",defaultValue:1.78,min:.4,max:3,step:.01},gap:{type:ControlType.Number,title:"Gap",description:"Space between images, as a share of their height.",defaultValue:6,min:0,max:50,step:1,unit:"%"},radius:{type:ControlType.BorderRadius,title:"Radius",defaultValue:"12px"},axis:{type:ControlType.Number,title:"Vertical Pos.",description:"Vertical centre of the row.",defaultValue:50,min:0,max:100,step:1,unit:"%"},fade:{type:ControlType.Number,title:"Edge Fade",defaultValue:12,min:0,max:50,step:1,unit:"%"},placeholder:{type:ControlType.Color,title:"Placeholder",defaultValue:"rgba(128, 128, 128, 0.15)"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"PanoramaCarousel","slots":[],"annotations":{"framerSupportedLayoutHeight":"any-prefer-fixed","framerIntrinsicWidth":"1200","framerIntrinsicHeight":"560","framerContractVersion":"1","framerSupportedLayoutWidth":"any-prefer-fixed"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./CurveCarouselScroll.map