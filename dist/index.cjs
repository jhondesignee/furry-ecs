"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class e{classes=[e];EID;static nextEID=0;static recycledEID=new Set;constructor(){this.EID=e.getNextEID()}static recycleEID(e){this.recycledEID.add(e)}static reset(){this.nextEID=0,this.recycledEID.clear()}static getNextEID(){if(this.recycledEID.size){const e=this.recycledEID.values().next().value;return e===this.nextEID&&this.nextEID++,this.recycledEID.delete(e),e}return this.nextEID++}}const t=1e3;var s,r,i,a;!function(e){e[e.NUMBER=0]="NUMBER",e[e.ARRAY=1]="ARRAY"}(s||(s={})),function(e){e[e.ADDED=0]="ADDED",e[e.ACTIVE=1]="ACTIVE",e[e.REMOVED=2]="REMOVED"}(r||(r={})),function(e){e[e.NUMBER=0]="NUMBER",e[e.STRING=1]="STRING",e[e.BOOLEAN=2]="BOOLEAN",e[e.ARRAY=3]="ARRAY",e[e.MAP=4]="MAP",e[e.SET=5]="SET",e[e.OBJECT=6]="OBJECT"}(i||(i={})),function(e){e[e.ALL=0]="ALL",e[e.ANY=1]="ANY",e[e.EXACT=2]="EXACT"}(a||(a={}));var n=Object.freeze({__proto__:null,get ComponentType(){return s},DEFAULT_WORLD_SIZE:t,get QueryOperation(){return a},get Serializable(){return i},get Status(){return r}});class o{hasChanged;data;deferredData;constructor(){this.data=new Map,this.deferredData={added:new Set,removed:new Set},this.hasChanged=!1}addData(e,t=!1){return this.deferredData.removed.has(e)?(this.deferredData.removed.delete(e),!0):!this.data.has(e)&&!this.deferredData.added.has(e)&&(t?this.data.set(e,r.ACTIVE):this.deferredData.added.add(e),!0)}removeData(e,t=!1){return this.deferredData.added.has(e)?(this.deferredData.added.delete(e),!0):!(!this.data.has(e)||this.deferredData.removed.has(e))&&(t?this.data.delete(e):this.deferredData.removed.add(e),!0)}hasData(e){return this.data.has(e)}hasDeferredData(e){return this.deferredData.added.has(e)||this.deferredData.removed.has(e)}commitChanges(e=!1){e&&this.applyDeferredChanges(),this.cleanPreviousChanges(),e||this.applyDeferredChanges()}destroy(){this.data.clear(),this.cleanDeferredChanges(),this.hasChanged=!1}getDataStatus(e){return this.data.get(e)}keys(){return this.data.keys()}values(){return this.data.values()}length(e){return this.data.size+(e?this.deferredData.added.size:0)}*[Symbol.iterator](){for(const e of this.data)yield e}applyDeferredChanges(){for(const e of this.deferredData.added)this.data.set(e,r.ADDED),this.hasChanged=!0;for(const e of this.deferredData.removed)this.data.set(e,r.REMOVED),this.hasChanged=!0;this.cleanDeferredChanges()}cleanPreviousChanges(){let e=!1;for(const[t,s]of this.data)s===r.ADDED?(this.data.set(t,r.ACTIVE),e=!0):s===r.REMOVED&&(this.data.delete(t),e=!0);this.hasChanged=e}cleanDeferredChanges(){this.deferredData.added.clear(),this.deferredData.removed.clear()}}class c{classes=[c,o];entities;size;properties;constructor(e,s){this.size=s||t,e??={},this.properties=this.createProperties(e),this.entities=new o}get props(){return this.properties}getProp(e,t){return this.properties.get(e)?.get(t)??void 0}setProp(e,t,s){const r=this.properties.get(e);return!!r&&(!(r.size>=this.size&&!this.properties.get(e)?.has(t))&&(r.set(t,s),!0))}getProps(e){const t={};for(const[s,r]of this.properties){const i=r?.get(e);void 0!==i&&(t[s]=i)}return t}setProps(e,t){for(const[s,r]of Object.entries(t)){if(null==r)continue;if(!this.setProp(s,e,r))return!1}return!0}attachEntity(e){return!(this.entities.length(!0)>=this.size)&&this.entities.addData(e)}detachEntity(e){return this.entities.removeData(e)}destroy(){this.entities.destroy(),this.properties.forEach((e=>e?.clear()))}createProperties(e){return Object.entries(e).reduce(((e,[t,r])=>{switch(r){case s.ARRAY:case s.NUMBER:e.set(t,new Map);break;default:e.set(t,null)}return e}),new Map)}}class d{start;update;destroy;constructor(e){this.start=e?.start,this.update=e?.update,this.destroy=e?.destroy}}class h{includeComponents;excludeComponents;includeOperation;excludeOperation;operationTable;entities;world;constructor(e){this.includeComponents=new Set(e?.include||[]),this.excludeComponents=new Set(e?.exclude||[]),this.entities=new Set,this.includeOperation=e?.includeOperation??a.ALL,this.excludeOperation=e?.excludeOperation??a.ANY,this.operationTable={[a.ANY]:this.hasAnyComponents.bind(this),[a.ALL]:this.hasAllComponents.bind(this),[a.EXACT]:this.hasExactComponents.bind(this)}}exec(e,t,s){return this.world=e,this.entities=this.filterEntitiesByComponent(),void 0!==t?this.filterEntitiesByStatus(t,s):new Array(...this.entities.keys())}filterEntitiesByComponent(){const e=new Set;if(![...this.includeComponents.keys(),...this.excludeComponents.keys()].some((e=>this.world.components.hasData(e))))return e;for(const t of this.world.entities.keys())this.operationTable[this.includeOperation](t,this.includeComponents)&&e.add(t),this.operationTable[this.excludeOperation](t,this.excludeComponents)&&e.delete(t);return e}filterEntitiesByStatus(e,t){const s=new Array;for(const r of this.entities)t?.entities.getDataStatus(r)!==e&&this.world?.entities.getDataStatus(r)!==e||s.push(r);return s}hasAllComponents(e,t){if(!t.size)return!1;for(const s of t)if(!s.entities.hasData(e))return!1;return!0}hasAnyComponents(e,t){if(!t.size)return!1;for(const s of t)if(s.entities.hasData(e))return!0;return!1}hasExactComponents(e,t){if(!t.size)return!1;for(const s of t)if(!s.entities.hasData(e))return!1;for(const s of this.world.components.keys())if(!t.has(s)&&s.entities.hasData(e))return!1;return!0}}class u{serializeHandler;deserializeHandler;classes;constructor(e){this.serializeHandler=e?.serializeHandler,this.deserializeHandler=e?.deserializeHandler,this.classes=[]}serialize(e){if(e instanceof u)return;const t=this.serializeHandler?.(e,this);if(void 0!==t)return t;if(Array.isArray(e))return this.serializeArray(e);if(e instanceof Map)return this.serializeMap(e);if(e instanceof Set)return this.serializeSet(e);if(null!==e&&"object"==typeof e&&!Array.isArray(e))return this.serializeObject(e);switch(typeof e){case"number":return{type:i.NUMBER,name:e.constructor.name,value:e};case"string":return{type:i.STRING,name:e.constructor.name,value:e};case"boolean":return{type:i.BOOLEAN,name:e.constructor.name,value:e};default:return}}deserialize(e){const t=this.deserializeHandler?.(e,this);if(void 0!==t)return t;switch(e.type){case i.ARRAY:return this.deserializeArray(e);case i.MAP:return this.deserializeMap(e);case i.SET:return this.deserializeSet(e);case i.OBJECT:return this.deserializeObject(e);case i.NUMBER:case i.STRING:case i.BOOLEAN:return e.value;default:return}}serializeArray(e){const t=new Array;for(const s of e){const e=this.serialize(s);e&&t.push(e)}return{type:i.ARRAY,name:e.constructor.name,value:t}}serializeMap(e){const t=new Array;for(const[s,r]of e){const e=this.serialize(s),i=this.serialize(r);e&&i&&t.push([e,i])}return{type:i.MAP,name:e.constructor.name,value:t}}serializeSet(e){const t=new Array;for(const s of e){const e=this.serialize(s);e&&t.push(e)}return{type:i.SET,name:e.constructor.name,value:t}}serializeObject(e){const t=new Array;if(e.classes)for(const t of e.classes)this.classes.push(t);for(const[s,r]of Object.entries(e)){if("classes"===s)continue;const e=this.serialize(r);e&&t.push([s,e])}return{type:i.OBJECT,name:e.constructor.name,value:t}}deserializeArray(e){const t=new Array;for(const s of e.value){const e=this.deserialize(s);void 0!==e&&t.push(e)}return t}deserializeMap(e){const t=new Map;for(const[s,r]of e.value){const e=this.deserialize(s),i=this.deserialize(r);void 0!==e&&void 0!==i&&t.set(e,i)}return t}deserializeSet(e){const t=new Set;for(const s of e.value){const e=this.deserialize(s);void 0!==e&&t.add(e)}return t}deserializeObject(e){const t={};for(const[s,r]of e.value){const e=this.deserialize(r);void 0!==e&&(t[s]=e)}for(const s of this.classes)if(s.name===e.name)return Object.assign(Object.create(s.prototype),t);return t}}class l{classes=[l,o];entities;components;systems;size;constructor(e){this.entities=new o,this.components=new o,this.systems=new o,this.size=e?.size||t}addEntity(e){return!(this.entities.length(!0)>=this.size)&&this.entities.addData(e)}addComponent(e){return!(this.components.length(!0)>=this.size)&&this.components.addData(e)}addSystem(e){return!(this.systems.length(!0)>=this.size)&&(e.start?.(this),this.systems.addData(e))}removeEntity(e){const t=this.entities.removeData(e);if(t)for(const t of this.components.keys())t.entities.removeData(e);return t}removeComponent(e){return this.components.removeData(e)}removeSystem(e){return e.destroy?.(this),this.systems.removeData(e)}update(e,t,s){this.applyChanges();for(const r of this.systems.keys())r.update?.(this,e,t,s)}destroy(){this.entities.destroy(),this.components.destroy(),this.systems.destroy()}applyChanges(){this.entities.commitChanges(),this.components.commitChanges();for(const e of this.components.keys())e.entities.commitChanges();this.systems.commitChanges()}}class f{static Constants=n;static createWorld(){return new l}static createEntity(){return new e}static defineComponent(e,t){return new c(e,t)}static defineSystem(e){return new d(e)}static defineQuery(e){return new h(e)}static defineSerializer(e){return new u(e)}static addEntity(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.addEntity(t));return i}static addComponent(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.addComponent(t));return i}static addSystem(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.addSystem(t));return i}static removeEntity(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.removeEntity(t));return i}static removeComponent(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.removeComponent(t));return i}static removeSystem(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.removeSystem(t));return i}static attachEntity(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.attachEntity(t));return i}static detachEntity(e,t){const s=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=new Array;for(const e of s)for(const t of r)i.push(e.detachEntity(t));return i}static update(e,t,s,r){const i=Array.isArray(e)?e:[e];for(const e of i)e.update(t,s,r)}static destroyWorld(e){const t=Array.isArray(e)?e:[e];for(const e of t)e.destroy()}}exports.Component=c,exports.Constants=n,exports.ECS=f,exports.Entity=e,exports.Query=h,exports.Serializer=u,exports.Storage=o,exports.System=d,exports.World=l,exports.default=f;
