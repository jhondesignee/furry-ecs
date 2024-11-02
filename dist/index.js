class t{EID;static nextEID=0;static recycledEID=new Set;constructor(){this.EID=t.getNextEID()}static recycleEID(t){this.recycledEID.add(t)}static reset(){this.nextEID=0,this.recycledEID.clear()}static getNextEID(){if(this.recycledEID.size){const t=this.recycledEID.values().next().value;return t===this.nextEID&&this.nextEID++,this.recycledEID.delete(t),t}return this.nextEID++}}const e=1e3,s=1e3;var r,a;!function(t){t[t.NUMBER=0]="NUMBER",t[t.ARRAY=1]="ARRAY"}(r||(r={})),function(t){t[t.ADDED=0]="ADDED",t[t.ACTIVE=1]="ACTIVE",t[t.REMOVED=2]="REMOVED"}(a||(a={}));var n=Object.freeze({__proto__:null,get ComponentType(){return r},DEFAULT_ARRAY_SIZE:s,DEFAULT_WORLD_SIZE:e,get Status(){return a}});class i{hasChanged;data;deferredData;constructor(){this.data=new Map,this.deferredData={added:new Set,removed:new Set},this.hasChanged=!1}addData(t,e=!1){return this.deferredData.removed.has(t)?(this.deferredData.removed.delete(t),!0):!this.data.has(t)&&!this.deferredData.added.has(t)&&(e?this.data.set(t,a.ACTIVE):this.deferredData.added.add(t),!0)}removeData(t,e=!1){return this.deferredData.added.has(t)?(this.deferredData.added.delete(t),!0):!(!this.data.has(t)||this.deferredData.removed.has(t))&&(e?this.data.delete(t):this.deferredData.removed.add(t),!0)}hasData(t){return this.data.has(t)}hasDeferredData(t){return this.deferredData.added.has(t)||this.deferredData.removed.has(t)}commitChanges(t=!1){this.hasChanged&&(this.hasChanged=!1),t&&this.applyDeferredChanges(),this.cleanPreviousChanges(),t||this.applyDeferredChanges()}destroy(){this.data.clear(),this.cleanDeferredChanges()}getDataStatus(t){return this.data.get(t)}keys(){return this.data.keys()}values(){return this.data.values()}length(t){return this.data.size+(t?this.deferredData.added.size:0)}*[Symbol.iterator](){for(const t of this.data)yield t}applyDeferredChanges(){for(const t of this.deferredData.added)this.data.set(t,a.ADDED),this.hasChanged=!0;for(const t of this.deferredData.removed)this.data.set(t,a.REMOVED),this.hasChanged=!0;this.cleanDeferredChanges()}cleanPreviousChanges(){for(const[t,e]of this.data)e===a.ADDED?this.data.set(t,a.ACTIVE):e===a.REMOVED&&this.data.delete(t)}cleanDeferredChanges(){this.deferredData.added.clear(),this.deferredData.removed.clear()}}class o{props;entities;size;constructor(t,s){let r;this.size=s||e,t??={};for(const e of Object.values(t))if("object"!=typeof e){r=this.resolveDeprecatedSchema(t);break}this.props=this.createProperties(r||t),this.entities=new i}attachEntity(t){return!(this.entities.length(!0)>=this.size)&&this.entities.addData(t)}detachEntity(t){return this.entities.removeData(t)}createProperties(t){return Object.fromEntries(Object.entries(t).map((([t,{type:e,length:a}])=>{switch(e){case r.NUMBER:return[t,new Array(this.size).fill(0)];case r.ARRAY:return a??=s,[t,Array.from({length:this.size},(()=>new Array(a).fill(0)))];default:return[t,null]}})))}resolveDeprecatedSchema(t){let e={};for(const[a,n]of Object.entries(t))n===r.NUMBER?e[a]={type:n}:n===r.ARRAY?e[a]={type:n,length:s}:e[a]={type:n};return e}}class h{start;update;destroy;constructor(t){
/* istanbul ignore if -- @preserve */
"function"==typeof t?console.warn("Deprecation warning: config cannot be used as a function"):(this.start=t?.start,this.update=t?.update,this.destroy=t?.destroy)}}class d{includeComponents;excludeComponents;entities;updated;constructor(t){this.includeComponents=new Set(t?.include||[]),this.excludeComponents=new Set(t?.exclude||[]),this.entities=new Map,this.updated=!1}exec(t,e){return this.updated=0!==this.entities.size&&!this.hasChanges(),this.updated?this.cleanChanges():this.entities=this.filterEntitiesByComponent(t),void 0!==e?this.filterEntitiesByStatus(e):new Array(...this.entities.keys())}hasChanges(){for(const t of[...this.includeComponents.keys(),...this.excludeComponents.keys()])if(t.entities.hasChanged)return!0;return!1}cleanChanges(){for(const[t,e]of this.entities)e===a.ADDED?this.entities.set(t,a.ACTIVE):e===a.REMOVED&&this.entities.delete(t)}filterEntitiesByComponent(t){const e=new Map;for(const s of this.includeComponents)if(t.components.hasData(s))for(const[t,r]of s.entities)e.set(t,r);for(const s of this.excludeComponents)if(t.components.hasData(s))for(const t of s.entities.keys())e.delete(t);return e}filterEntitiesByStatus(t){const e=new Array;for(const[s,r]of this.entities)r===t&&e.push(s);return e}}class c{entities;components;systems;size;constructor(t){this.entities=new i,this.components=new i,this.systems=new i,this.size=t?.size||e}get hasChanged(){return console.warn("Deprecation warning: 'this.hasChanged' is deprecated. Use 'this.entities.hasChanged' instead"),!1}addEntity(t){return!(this.entities.length(!0)>=this.size)&&this.entities.addData(t)}addComponent(t,e){return!(this.components.length(!0)>=this.size)&&(!(!this.entities.hasData(t)&&!this.entities.hasDeferredData(t))&&(this.components.addData(e),e.attachEntity(t)))}addSystem(t){return!(this.systems.length(!0)>=this.size)&&(t.start?.(this),this.systems.addData(t))}removeEntity(t){for(const e of this.components.keys())(e.entities.hasData(t)||e.entities.hasDeferredData(t))&&this.removeComponent(t,e);return!(!this.entities.hasData(t)&&!this.entities.hasDeferredData(t))&&this.entities.removeData(t)}removeComponent(t,e){return!(!this.entities.hasData(t)&&!this.entities.hasDeferredData(t)||!this.components.hasData(e)&&!this.components.hasDeferredData(e))&&e.detachEntity(t)}removeSystem(t){return t.destroy?.(this),this.systems.removeData(t)}update(t,e,s){this.applyChanges();for(const[r,n]of this.systems)n===a.ACTIVE&&r.update?.(this,t,e,s)}destroy(){this.entities.destroy(),this.components.destroy(),this.systems.destroy()}applyChanges(){this.entities.commitChanges(),this.components.commitChanges();for(const t of this.components.keys())t.entities.commitChanges(),0===t.entities.length()&&this.components.removeData(t,!0);this.systems.commitChanges()}}class f{static ComponentType=r;static Status=a;static createWorld(){return new c}static createEntity(){return new t}static defineComponent(t,e){return new o(t,e)}static defineSystem(t){return new h(t)}static defineQuery(t){return new d(t)}static addEntity(t,e){const s=Array.isArray(t)?t:[t],r=Array.isArray(e)?e:[e],a=new Array;for(const t of s)for(const e of r)a.push(t.addEntity(e));return a}static addComponent(t,e,s){const r=Array.isArray(t)?t:[t],a=Array.isArray(e)?e:[e],n=Array.isArray(s)?s:[s],i=new Array;for(const t of r)for(const e of a)for(const s of n)i.push(t.addComponent(e,s));return i}static addSystem(t,e){const s=Array.isArray(t)?t:[t],r=Array.isArray(e)?e:[e],a=new Array;for(const t of s)for(const e of r)a.push(t.addSystem(e));return a}static removeEntity(t,e){const s=Array.isArray(t)?t:[t],r=Array.isArray(e)?e:[e],a=new Array;for(const t of s)for(const e of r)a.push(t.removeEntity(e));return a}static removeComponent(t,e,s){const r=Array.isArray(t)?t:[t],a=Array.isArray(e)?e:[e],n=Array.isArray(s)?s:[s],i=new Array;for(const t of r)for(const e of a)for(const s of n)i.push(t.removeComponent(e,s));return i}static removeSystem(t,e){const s=Array.isArray(t)?t:[t],r=Array.isArray(e)?e:[e],a=new Array;for(const t of s)for(const e of r)a.push(t.removeSystem(e));return a}static update(t,e,s,...r){const a=Array.isArray(t)?t:[t];for(const t of a)t.update(e,s,r)}static destroyWorld(t){const e=Array.isArray(t)?t:[t];for(const t of e)t.destroy()}}export{o as Component,n as Constants,f as ECS,t as Entity,d as Query,i as Storage,h as System,c as World,f as default};
