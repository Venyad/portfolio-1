import{noChange as e,_$LH as t}from"./lit-html.js";import{PartType as r}from"./directive.js";import{isPrimitive as n,isTemplateResult as o,isCompiledTemplateResult as a,isSingleExpression as i}from"./directive-helpers.js";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{L:l,R:s,D:c,I:d,F:p}=t,f=(e,t,r={})=>{if(console.warn("Importing `hydrate()` from `lit-html/experimental-hydrate.js` is deprecated.Import from `@lit-labs/ssr-client` instead."),void 0!==t._$litPart$)throw Error("container already contains a live render");let n,o,a;const i=[],l=document.createTreeWalker(t,NodeFilter.SHOW_COMMENT,null,!1);let s;for(;null!==(s=l.nextNode());){const t=s.data;if(t.startsWith("lit-part")){if(0===i.length&&void 0!==n)throw Error(`There must be only one root part per container. Found a part marker (${s}) when we already have a root part marker (${o})`);a=m(e,s,i,r),null!=n||(n=a),null!=o||(o=s)}else if(t.startsWith("lit-node"))u(s,i,r);else if(t.startsWith("/lit-part")){if(1===i.length&&a!==n)throw Error("internal error");a=h(s,a,i)}}if(void 0===n){const e=t instanceof ShadowRoot?"{container.host.localName}'s shadow root":t instanceof DocumentFragment?"DocumentFragment":t.localName;console.error(`There should be exactly one root part in a render container, but we didn't find any in ${e}.`)}t._$litPart$=n},m=(t,r,i,p)=>{let f,m;if(0===i.length)m=new d(r,null,void 0,p),f=t;else{const e=i[i.length-1];if("template-instance"===e.type)m=new d(r,null,e.instance,p),e.instance._$AV.push(m),f=e.result.values[e.instancePartIndex++],e.templatePartIndex++;else if("iterable"===e.type){m=new d(r,null,e.part,p);const t=e.iterator.next();if(t.done)throw f=void 0,e.done=!0,Error("Unhandled shorter than expected iterable");f=t.value,e.part._$AH.push(m)}else m=new d(r,null,e.part,p)}if(f=c(m,f),f===e)i.push({part:m,type:"leaf"});else if(n(f))i.push({part:m,type:"leaf"}),m._$AH=f;else if(o(f)){if(a(f))throw Error("compiled templates are not supported");const e="lit-part "+w(f);if(r.data!==e)throw Error("Hydration value mismatch: Unexpected TemplateResult rendered to part");{const e=d.prototype._$AC(f),t=new l(e,m);i.push({type:"template-instance",instance:t,part:m,templatePartIndex:0,instancePartIndex:0,result:f}),m._$AH=t}}else s(f)?(i.push({part:m,type:"iterable",value:f,iterator:f[Symbol.iterator](),done:!1}),m._$AH=[]):(i.push({part:m,type:"leaf"}),m._$AH=null==f?"":f);return m},h=(e,t,r)=>{if(void 0===t)throw Error("unbalanced part marker");t._$AB=e;const n=r.pop();if("iterable"===n.type&&!n.iterator.next().done)throw Error("unexpected longer than expected iterable");if(r.length>0)return r[r.length-1].part},u=(e,t,n)=>{const o=/lit-node (\d+)/.exec(e.data),a=parseInt(o[1]),l=e.nextElementSibling;if(null===l)throw Error("could not find node for attribute parts");l.removeAttribute("defer-hydration");const s=t[t.length-1];if("template-instance"!==s.type)throw Error("internal error");{const e=s.instance;for(;;){const t=e._$AD.parts[s.templatePartIndex];if(void 0===t||t.type!==r.ATTRIBUTE&&t.type!==r.ELEMENT||t.index!==a)break;if(t.type===r.ATTRIBUTE){const o=new t.ctor(l,t.name,t.strings,s.instance,n),a=i(o)?s.result.values[s.instancePartIndex]:s.result.values,c=!(o.type===r.EVENT||o.type===r.PROPERTY);o._$AI(a,o,s.instancePartIndex,c),s.instancePartIndex+=t.strings.length-1,e._$AV.push(o)}else{const t=new p(l,s.instance,n);c(t,s.result.values[s.instancePartIndex++]),e._$AV.push(t)}s.templatePartIndex++}}},w=e=>{const t=new Uint32Array(2).fill(5381);for(const r of e.strings)for(let e=0;e<r.length;e++)t[e%2]=33*t[e%2]^r.charCodeAt(e);const r=String.fromCharCode(...new Uint8Array(t.buffer));return btoa(r)};export{w as digestForTemplateResult,f as hydrate};
//# sourceMappingURL=experimental-hydrate.js.map