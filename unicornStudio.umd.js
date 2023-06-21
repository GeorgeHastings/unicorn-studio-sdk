(function(G,I){typeof exports=="object"&&typeof module<"u"?I(exports):typeof define=="function"&&define.amd?define(["exports"],I):(G=typeof globalThis<"u"?globalThis:G||self,I(G.UnicornStudio={}))})(this,function(G){"use strict";var ls=Object.defineProperty;var us=(G,I,p)=>I in G?ls(G,I,{enumerable:!0,configurable:!0,writable:!0,value:p}):G[I]=p;var B=(G,I,p)=>(us(G,typeof I!="symbol"?I+"":I,p),p);let I=0;function p(){if(!(I>100)){if(I===100)console.warn("Curtains: too many warnings thrown, stop logging.");else{const a=Array.prototype.slice.call(arguments);console.warn.apply(console,a)}I++}}function D(){const a=Array.prototype.slice.call(arguments);console.error.apply(console,a)}function de(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,a=>{let e=Math.random()*16|0;return(a==="x"?e:e&3|8).toString(16).toUpperCase()})}function j(a){return(a&a-1)===0}function Je(a,e,t){return(1-t)*a+t*e}class et{constructor(e){if(this.type="Scene",!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){D(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=e.gl,this.initStacks()}initStacks(){this.stacks={pingPong:[],renderTargets:[],opaque:[],transparent:[],renderPasses:[],scenePasses:[]}}resetPlaneStacks(){this.stacks.pingPong=[],this.stacks.renderTargets=[],this.stacks.opaque=[],this.stacks.transparent=[];for(let e=0;e<this.renderer.planes.length;e++)this.addPlane(this.renderer.planes[e])}resetShaderPassStacks(){this.stacks.scenePasses=[],this.stacks.renderPasses=[];for(let e=0;e<this.renderer.shaderPasses.length;e++)this.renderer.shaderPasses[e].index=e,this.renderer.shaderPasses[e]._isScenePass?this.stacks.scenePasses.push(this.renderer.shaderPasses[e]):this.stacks.renderPasses.push(this.renderer.shaderPasses[e]);this.stacks.scenePasses.length===0&&(this.renderer.state.scenePassIndex=null)}addToRenderTargetsStack(e){const t=this.renderer.planes.filter(s=>s.type!=="PingPongPlane"&&s.target&&s.uuid!==e.uuid);let i=-1;if(e.target._depth){for(let s=t.length-1;s>=0;s--)if(t[s].target.uuid===e.target.uuid){i=s+1;break}}else i=t.findIndex(s=>s.target.uuid===e.target.uuid);i=Math.max(0,i),t.splice(i,0,e),e.target._depth?(t.sort((s,r)=>s.index-r.index),t.sort((s,r)=>r.renderOrder-s.renderOrder)):(t.sort((s,r)=>r.index-s.index),t.sort((s,r)=>s.renderOrder-r.renderOrder)),t.sort((s,r)=>s.target.index-r.target.index),this.stacks.renderTargets=t}addToRegularPlaneStack(e){const t=this.renderer.planes.filter(s=>s.type!=="PingPongPlane"&&!s.target&&s._transparent===e._transparent&&s.uuid!==e.uuid);let i=-1;for(let s=t.length-1;s>=0;s--)if(t[s]._geometry.definition.id===e._geometry.definition.id){i=s+1;break}return i=Math.max(0,i),t.splice(i,0,e),t.sort((s,r)=>s.index-r.index),t}addPlane(e){if(e.type==="PingPongPlane")this.stacks.pingPong.push(e);else if(e.target)this.addToRenderTargetsStack(e);else if(e._transparent){const t=this.addToRegularPlaneStack(e);t.sort((i,s)=>s.relativeTranslation.z-i.relativeTranslation.z),t.sort((i,s)=>s.renderOrder-i.renderOrder),this.stacks.transparent=t}else{const t=this.addToRegularPlaneStack(e);t.sort((i,s)=>s.renderOrder-i.renderOrder),this.stacks.opaque=t}}removePlane(e){e.type==="PingPongPlane"?this.stacks.pingPong=this.stacks.pingPong.filter(t=>t.uuid!==e.uuid):e.target?this.stacks.renderTargets=this.stacks.renderTargets.filter(t=>t.uuid!==e.uuid):e._transparent?this.stacks.transparent=this.stacks.transparent.filter(t=>t.uuid!==e.uuid):this.stacks.opaque=this.stacks.opaque.filter(t=>t.uuid!==e.uuid)}setPlaneRenderOrder(e){if(e.type==="ShaderPass")this.sortShaderPassStack(e._isScenePass?this.stacks.scenePasses:this.stacks.renderPasses);else if(e.type==="PingPongPlane")return;if(e.target)e.target._depth?(this.stacks.renderTargets.sort((t,i)=>t.index-i.index),this.stacks.renderTargets.sort((t,i)=>i.renderOrder-t.renderOrder)):(this.stacks.renderTargets.sort((t,i)=>i.index-t.index),this.stacks.renderTargets.sort((t,i)=>t.renderOrder-i.renderOrder)),this.stacks.renderTargets.sort((t,i)=>t.target.index-i.target.index);else{const t=e._transparent?this.stacks.transparent:this.stacks.opaque,i=this.stacks.scenePasses.find((s,r)=>s._isScenePass&&!s._depth&&r===0);!this.renderer.depth||i?(t.sort((s,r)=>r.index-s.index),e._transparent&&t.sort((s,r)=>s.relativeTranslation.z-r.relativeTranslation.z),t.sort((s,r)=>s.renderOrder-r.renderOrder)):(t.sort((s,r)=>s.index-r.index),e._transparent&&t.sort((s,r)=>r.relativeTranslation.z-s.relativeTranslation.z),t.sort((s,r)=>r.renderOrder-s.renderOrder))}}addShaderPass(e){e._isScenePass?(this.stacks.scenePasses.push(e),this.sortShaderPassStack(this.stacks.scenePasses)):(this.stacks.renderPasses.push(e),this.sortShaderPassStack(this.stacks.renderPasses))}removeShaderPass(e){this.resetShaderPassStacks()}sortShaderPassStack(e){e.sort((t,i)=>t.index-i.index),e.sort((t,i)=>t.renderOrder-i.renderOrder)}enableShaderPass(){this.stacks.scenePasses.length&&this.stacks.renderPasses.length===0&&this.renderer.planes.length&&(this.renderer.state.scenePassIndex=0,this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target))}drawRenderPasses(){this.stacks.scenePasses.length&&this.stacks.renderPasses.length&&this.renderer.planes.length&&(this.renderer.state.scenePassIndex=0,this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target));for(let e=0;e<this.stacks.renderPasses.length;e++)this.stacks.renderPasses[e]._startDrawing(),this.renderer.clearDepth()}drawScenePasses(){for(let e=0;e<this.stacks.scenePasses.length;e++)this.stacks.scenePasses[e]._startDrawing()}drawPingPongStack(){for(let e=0;e<this.stacks.pingPong.length;e++){const t=this.stacks.pingPong[e];t&&t._startDrawing()}}drawStack(e){for(let t=0;t<this.stacks[e].length;t++){const i=this.stacks[e][t];i&&i._startDrawing()}}draw(){this.drawPingPongStack(),this.enableShaderPass(),this.drawStack("renderTargets"),this.drawRenderPasses(),this.renderer.setBlending(!1),this.drawStack("opaque"),this.stacks.transparent.length&&(this.renderer.setBlending(!0),this.drawStack("transparent")),this.drawScenePasses()}}class tt{constructor(){this.geometries=[],this.clear()}clear(){this.textures=[],this.programs=[]}getGeometryFromID(e){return this.geometries.find(t=>t.id===e)}addGeometry(e,t,i){this.geometries.push({id:e,vertices:t,uvs:i})}isSameShader(e,t){return e.localeCompare(t)===0}getProgramFromShaders(e,t){return this.programs.find(i=>this.isSameShader(i.vsCode,e)&&this.isSameShader(i.fsCode,t))}addProgram(e){this.programs.push(e)}getTextureFromSource(e){const t=typeof e=="string"?e:e.src;return this.textures.find(i=>i.source&&i.source.src===t)}addTexture(e){this.getTextureFromSource(e.source)||this.textures.push(e)}removeTexture(e){this.textures=this.textures.filter(t=>t.uuid!==e.uuid)}}class it{constructor(){this.clear()}clear(){this.queue=[]}add(e,t=!1){const i={callback:e,keep:t,timeout:null};return i.timeout=setTimeout(()=>{this.queue.push(i)},0),i}execute(){this.queue.map(e=>{e.callback&&e.callback(),clearTimeout(this.queue.timeout)}),this.queue=this.queue.filter(e=>e.keep)}}class st{constructor({alpha:e,antialias:t,premultipliedAlpha:i,depth:s,failIfMajorPerformanceCaveat:r,preserveDrawingBuffer:o,stencil:n,container:u,pixelRatio:l,renderingScale:c,production:d,onError:g,onSuccess:m,onContextLost:y,onContextRestored:v,onDisposed:b,onSceneChange:x}){this.type="Renderer",this.alpha=e,this.antialias=t,this.premultipliedAlpha=i,this.depth=s,this.failIfMajorPerformanceCaveat=r,this.preserveDrawingBuffer=o,this.stencil=n,this.container=u,this.pixelRatio=l,this._renderingScale=c,this.production=d,this.onError=g,this.onSuccess=m,this.onContextLost=y,this.onContextRestored=v,this.onDisposed=b,this.onSceneChange=x,this.initState(),this.canvas=document.createElement("canvas");const P={alpha:this.alpha,premultipliedAlpha:this.premultipliedAlpha,antialias:this.antialias,depth:this.depth,failIfMajorPerformanceCaveat:this.failIfMajorPerformanceCaveat,preserveDrawingBuffer:this.preserveDrawingBuffer,stencil:this.stencil};if(this.gl=this.canvas.getContext("webgl2",P),this._isWebGL2=!!this.gl,this.gl||(this.gl=this.canvas.getContext("webgl",P)||this.canvas.getContext("experimental-webgl",P)),this.gl)this.onSuccess&&this.onSuccess();else{this.production||p(this.type+": WebGL context could not be created"),this.state.isActive=!1,this.onError&&this.onError();return}this.initRenderer()}initState(){this.state={isActive:!0,isContextLost:!0,drawingEnabled:!0,forceRender:!1,currentProgramID:null,currentGeometryID:null,forceBufferUpdate:!1,depthTest:null,blending:null,cullFace:null,frameBufferID:null,scenePassIndex:null,activeTexture:null,unpackAlignment:null,flipY:null,premultiplyAlpha:null}}initCallbackQueueManager(){this.nextRender=new it}initRenderer(){this.planes=[],this.renderTargets=[],this.shaderPasses=[],this.state.isContextLost=!1,this.state.maxTextureSize=this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),this.initCallbackQueueManager(),this.setBlendFunc(),this.setDepthFunc(),this.setDepthTest(!0),this.cache=new tt,this.scene=new et(this),this.getExtensions(),this._contextLostHandler=this.contextLost.bind(this),this.canvas.addEventListener("webglcontextlost",this._contextLostHandler,!1),this._contextRestoredHandler=this.contextRestored.bind(this),this.canvas.addEventListener("webglcontextrestored",this._contextRestoredHandler,!1)}getExtensions(){this.extensions=[],this._isWebGL2?(this.extensions.EXT_color_buffer_float=this.gl.getExtension("EXT_color_buffer_float"),this.extensions.OES_texture_float_linear=this.gl.getExtension("OES_texture_float_linear"),this.extensions.EXT_texture_filter_anisotropic=this.gl.getExtension("EXT_texture_filter_anisotropic"),this.extensions.WEBGL_lose_context=this.gl.getExtension("WEBGL_lose_context")):(this.extensions.OES_vertex_array_object=this.gl.getExtension("OES_vertex_array_object"),this.extensions.OES_texture_float=this.gl.getExtension("OES_texture_float"),this.extensions.OES_texture_float_linear=this.gl.getExtension("OES_texture_float_linear"),this.extensions.OES_texture_half_float=this.gl.getExtension("OES_texture_half_float"),this.extensions.OES_texture_half_float_linear=this.gl.getExtension("OES_texture_half_float_linear"),this.extensions.EXT_texture_filter_anisotropic=this.gl.getExtension("EXT_texture_filter_anisotropic"),this.extensions.OES_element_index_uint=this.gl.getExtension("OES_element_index_uint"),this.extensions.OES_standard_derivatives=this.gl.getExtension("OES_standard_derivatives"),this.extensions.EXT_sRGB=this.gl.getExtension("EXT_sRGB"),this.extensions.WEBGL_depth_texture=this.gl.getExtension("WEBGL_depth_texture"),this.extensions.WEBGL_draw_buffers=this.gl.getExtension("WEBGL_draw_buffers"),this.extensions.WEBGL_lose_context=this.gl.getExtension("WEBGL_lose_context"))}contextLost(e){this.state.isContextLost=!0,this.state.isActive&&(e.preventDefault(),this.nextRender.add(()=>this.onContextLost&&this.onContextLost()))}restoreContext(){this.state.isActive&&(this.initState(),this.gl&&this.extensions.WEBGL_lose_context?this.extensions.WEBGL_lose_context.restoreContext():(!this.gl&&!this.production?p(this.type+": Could not restore the context because the context is not defined"):!this.extensions.WEBGL_lose_context&&!this.production&&p(this.type+": Could not restore the context because the restore context extension is not defined"),this.onError&&this.onError()))}isContextexFullyRestored(){let e=!0;for(let t=0;t<this.renderTargets.length;t++){this.renderTargets[t].textures[0]._canDraw||(e=!1);break}if(e)for(let t=0;t<this.planes.length;t++)if(this.planes[t]._canDraw){for(let i=0;i<this.planes[t].textures.length;i++)if(!this.planes[t].textures[i]._canDraw){e=!1;break}}else{e=!1;break}if(e)for(let t=0;t<this.shaderPasses.length;t++)if(this.shaderPasses[t]._canDraw){for(let i=0;i<this.shaderPasses[t].textures.length;i++)if(!this.shaderPasses[t].textures[i]._canDraw){e=!1;break}}else{e=!1;break}return e}contextRestored(){this.getExtensions(),this.setBlendFunc(),this.setDepthFunc(),this.setDepthTest(!0),this.cache.clear(),this.scene.initStacks();for(let t=0;t<this.renderTargets.length;t++)this.renderTargets[t]._restoreContext();for(let t=0;t<this.planes.length;t++)this.planes[t]._restoreContext();for(let t=0;t<this.shaderPasses.length;t++)this.shaderPasses[t]._restoreContext();const e=this.nextRender.add(()=>{this.isContextexFullyRestored()&&(e.keep=!1,this.state.isContextLost=!1,this.onContextRestored&&this.onContextRestored(),this.onSceneChange(),this.needRender())},!0)}setPixelRatio(e){this.pixelRatio=e}setSize(){if(!this.gl)return;const e=this.container.getBoundingClientRect();this._boundingRect={width:e.width*this.pixelRatio,height:e.height*this.pixelRatio,top:e.top*this.pixelRatio,left:e.left*this.pixelRatio};const t=!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),i=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;if(t&&i){let s=function(r){let o=0;for(;r&&!isNaN(r.offsetTop);)o+=r.offsetTop-r.scrollTop,r=r.offsetParent;return o};this._boundingRect.top=s(this.container)*this.pixelRatio}this.canvas.style.width=Math.floor(this._boundingRect.width/this.pixelRatio)+"px",this.canvas.style.height=Math.floor(this._boundingRect.height/this.pixelRatio)+"px",this.canvas.width=Math.floor(this._boundingRect.width*this._renderingScale),this.canvas.height=Math.floor(this._boundingRect.height*this._renderingScale),this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)}resize(){for(let e=0;e<this.planes.length;e++)this.planes[e]._canDraw&&this.planes[e].resize();for(let e=0;e<this.shaderPasses.length;e++)this.shaderPasses[e]._canDraw&&this.shaderPasses[e].resize();for(let e=0;e<this.renderTargets.length;e++)this.renderTargets[e].resize();this.needRender()}clear(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}clearDepth(){this.gl.clear(this.gl.DEPTH_BUFFER_BIT)}clearColor(){this.gl.clear(this.gl.COLOR_BUFFER_BIT)}bindFrameBuffer(e,t){let i=null;e?(i=e.index,i!==this.state.frameBufferID&&(this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,e._frameBuffer),this.gl.viewport(0,0,e._size.width,e._size.height),e._shouldClear&&!t&&this.clear())):this.state.frameBufferID!==null&&(this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)),this.state.frameBufferID=i}setDepthTest(e){e&&!this.state.depthTest?(this.state.depthTest=e,this.gl.enable(this.gl.DEPTH_TEST)):!e&&this.state.depthTest&&(this.state.depthTest=e,this.gl.disable(this.gl.DEPTH_TEST))}setDepthFunc(){this.gl.depthFunc(this.gl.LEQUAL)}setBlending(e=!1){e&&!this.state.blending?(this.state.blending=e,this.gl.enable(this.gl.BLEND)):!e&&this.state.blending&&(this.state.blending=e,this.gl.disable(this.gl.BLEND))}setBlendFunc(){this.gl.enable(this.gl.BLEND),this.premultipliedAlpha?this.gl.blendFuncSeparate(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA)}setFaceCulling(e){if(this.state.cullFace!==e)if(this.state.cullFace=e,e==="none")this.gl.disable(this.gl.CULL_FACE);else{const t=e==="front"?this.gl.FRONT:this.gl.BACK;this.gl.enable(this.gl.CULL_FACE),this.gl.cullFace(t)}}useProgram(e){(this.state.currentProgramID===null||this.state.currentProgramID!==e.id)&&(this.gl.useProgram(e.program),this.state.currentProgramID=e.id)}removePlane(e){this.gl&&(this.planes=this.planes.filter(t=>t.uuid!==e.uuid),this.scene.removePlane(e),e=null,this.gl&&this.clear(),this.onSceneChange())}removeRenderTarget(e){if(!this.gl)return;let t=this.planes.find(i=>i.type!=="PingPongPlane"&&i.target&&i.target.uuid===e.uuid);for(let i=0;i<this.planes.length;i++)this.planes[i].target&&this.planes[i].target.uuid===e.uuid&&(this.planes[i].target=null);this.renderTargets=this.renderTargets.filter(i=>i.uuid!==e.uuid);for(let i=0;i<this.renderTargets.length;i++)this.renderTargets[i].index=i;e=null,this.gl&&this.clear(),t&&this.scene.resetPlaneStacks(),this.onSceneChange()}removeShaderPass(e){this.gl&&(this.shaderPasses=this.shaderPasses.filter(t=>t.uuid!==e.uuid),this.scene.removeShaderPass(e),e=null,this.gl&&this.clear(),this.onSceneChange())}enableDrawing(){this.state.drawingEnabled=!0}disableDrawing(){this.state.drawingEnabled=!1}needRender(){this.state.forceRender=!0}render(){this.gl&&(this.clear(),this.state.currentGeometryID=null,this.scene.draw())}deletePrograms(){for(let e=0;e<this.cache.programs.length;e++){const t=this.cache.programs[e];this.gl.deleteProgram(t.program)}}dispose(){if(!this.gl)return;for(this.state.isActive=!1;this.planes.length>0;)this.removePlane(this.planes[0]);for(;this.shaderPasses.length>0;)this.removeShaderPass(this.shaderPasses[0]);for(;this.renderTargets.length>0;)this.removeRenderTarget(this.renderTargets[0]);let e=this.nextRender.add(()=>{this.planes.length===0&&this.shaderPasses.length===0&&this.renderTargets.length===0&&(e.keep=!1,this.deletePrograms(),this.clear(),this.canvas.removeEventListener("webgllost",this._contextLostHandler,!1),this.canvas.removeEventListener("webglrestored",this._contextRestoredHandler,!1),this.gl&&this.extensions.WEBGL_lose_context&&this.extensions.WEBGL_lose_context.loseContext(),this.canvas.width=this.canvas.width,this.gl=null,this.container.removeChild(this.canvas),this.container=null,this.canvas=null,this.onDisposed&&this.onDisposed())},!0)}}class rt{constructor({xOffset:e=0,yOffset:t=0,lastXDelta:i=0,lastYDelta:s=0,shouldWatch:r=!0,onScroll:o=()=>{}}={}){this.xOffset=e,this.yOffset=t,this.lastXDelta=i,this.lastYDelta=s,this.shouldWatch=r,this.onScroll=o,this.handler=this.scroll.bind(this,!0),this.shouldWatch&&window.addEventListener("scroll",this.handler,{passive:!0})}scroll(){this.updateScrollValues(window.pageXOffset,window.pageYOffset)}updateScrollValues(e,t){const i=this.xOffset;this.xOffset=e,this.lastXDelta=i-this.xOffset;const s=this.yOffset;this.yOffset=t,this.lastYDelta=s-this.yOffset,this.onScroll&&this.onScroll(this.lastXDelta,this.lastYDelta)}dispose(){this.shouldWatch&&window.removeEventListener("scroll",this.handler,{passive:!0})}}const at="8.1.3";class ot{constructor({container:e,alpha:t=!0,premultipliedAlpha:i=!1,antialias:s=!0,depth:r=!0,failIfMajorPerformanceCaveat:o=!0,preserveDrawingBuffer:n=!1,stencil:u=!1,autoResize:l=!0,autoRender:c=!0,watchScroll:d=!0,pixelRatio:g=window.devicePixelRatio||1,renderingScale:m=1,production:y=!1}={}){this.type="Curtains",this._autoResize=l,this._autoRender=c,this._watchScroll=d,this.pixelRatio=g,m=isNaN(m)?1:parseFloat(m),this._renderingScale=Math.max(.25,Math.min(1,m)),this.premultipliedAlpha=i,this.alpha=t,this.antialias=s,this.depth=r,this.failIfMajorPerformanceCaveat=o,this.preserveDrawingBuffer=n,this.stencil=u,this.production=y,this.errors=!1,e?this.setContainer(e):this.production||p(this.type+": no container provided in the initial parameters. Use setContainer() method to set one later and initialize the WebGL context")}setContainer(e){if(e)if(typeof e=="string")if(e=document.getElementById(e),e)this.container=e;else{let t=document.createElement("div");t.setAttribute("id","curtains-canvas"),document.body.appendChild(t),this.container=t,this.production||p('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead')}else e instanceof Element&&(this.container=e);else{let t=document.createElement("div");t.setAttribute("id","curtains-canvas"),document.body.appendChild(t),this.container=t,this.production||p('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead')}this._initCurtains()}_initCurtains(){this.planes=[],this.renderTargets=[],this.shaderPasses=[],this._initRenderer(),this.gl&&(this._initScroll(),this._setSize(),this._addListeners(),this.container.appendChild(this.canvas),console.log("curtains.js - v"+at),this._animationFrameID=null,this._autoRender&&this._animate())}_initRenderer(){this.renderer=new st({alpha:this.alpha,antialias:this.antialias,premultipliedAlpha:this.premultipliedAlpha,depth:this.depth,failIfMajorPerformanceCaveat:this.failIfMajorPerformanceCaveat,preserveDrawingBuffer:this.preserveDrawingBuffer,stencil:this.stencil,container:this.container,pixelRatio:this.pixelRatio,renderingScale:this._renderingScale,production:this.production,onError:()=>this._onRendererError(),onSuccess:()=>this._onRendererSuccess(),onContextLost:()=>this._onRendererContextLost(),onContextRestored:()=>this._onRendererContextRestored(),onDisposed:()=>this._onRendererDisposed(),onSceneChange:()=>this._keepSync()}),this.gl=this.renderer.gl,this.canvas=this.renderer.canvas}restoreContext(){this.renderer.restoreContext()}_animate(){this.render(),this._animationFrameID=window.requestAnimationFrame(this._animate.bind(this))}enableDrawing(){this.renderer.enableDrawing()}disableDrawing(){this.renderer.disableDrawing()}needRender(){this.renderer.needRender()}nextRender(e,t=!1){return this.renderer.nextRender.add(e,t)}clear(){this.renderer&&this.renderer.clear()}clearDepth(){this.renderer&&this.renderer.clearDepth()}clearColor(){this.renderer&&this.renderer.clearColor()}isWebGL2(){return this.gl?this.renderer._isWebGL2:!1}render(){this.renderer.nextRender.execute(),!(!this.renderer.state.drawingEnabled&&!this.renderer.state.forceRender)&&(this.renderer.state.forceRender&&(this.renderer.state.forceRender=!1),this._onRenderCallback&&this._onRenderCallback(),this.renderer.render())}_addListeners(){this._resizeHandler=null,this._autoResize&&(this._resizeHandler=this.resize.bind(this,!0),window.addEventListener("resize",this._resizeHandler,!1))}setPixelRatio(e,t){this.pixelRatio=parseFloat(Math.max(e,1))||1,this.renderer.setPixelRatio(e),this.resize(t)}_setSize(){this.renderer.setSize(),this._scrollManager.shouldWatch&&(this._scrollManager.xOffset=window.pageXOffset,this._scrollManager.yOffset=window.pageYOffset)}getBoundingRect(){return this.renderer._boundingRect}resize(e){this.gl&&(this._setSize(),this.renderer.resize(),this.nextRender(()=>{this._onAfterResizeCallback&&e&&this._onAfterResizeCallback()}))}_initScroll(){this._scrollManager=new rt({xOffset:window.pageXOffset,yOffset:window.pageYOffset,lastXDelta:0,lastYDelta:0,shouldWatch:this._watchScroll,onScroll:(e,t)=>this._updateScroll(e,t)})}_updateScroll(e,t){for(let i=0;i<this.planes.length;i++)this.planes[i].watchScroll&&this.planes[i].updateScrollPosition(e,t);this.renderer.needRender(),this._onScrollCallback&&this._onScrollCallback()}updateScrollValues(e,t){this._scrollManager.updateScrollValues(e,t)}getScrollDeltas(){return{x:this._scrollManager.lastXDelta,y:this._scrollManager.lastYDelta}}getScrollValues(){return{x:this._scrollManager.xOffset,y:this._scrollManager.yOffset}}_keepSync(){this.planes=this.renderer.planes,this.shaderPasses=this.renderer.shaderPasses,this.renderTargets=this.renderer.renderTargets}lerp(e,t,i){return Je(e,t,i)}onAfterResize(e){return e&&(this._onAfterResizeCallback=e),this}onError(e){return e&&(this._onErrorCallback=e),this}_onRendererError(){setTimeout(()=>{this._onErrorCallback&&!this.errors&&this._onErrorCallback(),this.errors=!0},0)}onSuccess(e){return e&&(this._onSuccessCallback=e),this}_onRendererSuccess(){setTimeout(()=>{this._onSuccessCallback&&this._onSuccessCallback()},0)}onContextLost(e){return e&&(this._onContextLostCallback=e),this}_onRendererContextLost(){this._onContextLostCallback&&this._onContextLostCallback()}onContextRestored(e){return e&&(this._onContextRestoredCallback=e),this}_onRendererContextRestored(){this._onContextRestoredCallback&&this._onContextRestoredCallback()}onRender(e){return e&&(this._onRenderCallback=e),this}onScroll(e){return e&&(this._onScrollCallback=e),this}dispose(){this.renderer.dispose()}_onRendererDisposed(){this._animationFrameID&&window.cancelAnimationFrame(this._animationFrameID),this._resizeHandler&&window.removeEventListener("resize",this._resizeHandler,!1),this._scrollManager&&this._scrollManager.dispose()}}class nt{constructor(e,t,i){if(this.type="Uniforms",!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){D(this.type+": Renderer WebGL context is undefined",e);return}if(this.renderer=e,this.gl=e.gl,this.program=t,this.uniforms={},i)for(const s in i){const r=i[s];this.uniforms[s]={name:r.name,type:r.type,value:r.value.clone&&typeof r.value.clone=="function"?r.value.clone():r.value,update:null}}}handleUniformSetting(e){switch(e.type){case"1i":e.update=this.setUniform1i.bind(this);break;case"1iv":e.update=this.setUniform1iv.bind(this);break;case"1f":e.update=this.setUniform1f.bind(this);break;case"1fv":e.update=this.setUniform1fv.bind(this);break;case"2i":e.update=this.setUniform2i.bind(this);break;case"2iv":e.update=this.setUniform2iv.bind(this);break;case"2f":e.update=this.setUniform2f.bind(this);break;case"2fv":e.update=this.setUniform2fv.bind(this);break;case"3i":e.update=this.setUniform3i.bind(this);break;case"3iv":e.update=this.setUniform3iv.bind(this);break;case"3f":e.update=this.setUniform3f.bind(this);break;case"3fv":e.update=this.setUniform3fv.bind(this);break;case"4i":e.update=this.setUniform4i.bind(this);break;case"4iv":e.update=this.setUniform4iv.bind(this);break;case"4f":e.update=this.setUniform4f.bind(this);break;case"4fv":e.update=this.setUniform4fv.bind(this);break;case"mat2":e.update=this.setUniformMatrix2fv.bind(this);break;case"mat3":e.update=this.setUniformMatrix3fv.bind(this);break;case"mat4":e.update=this.setUniformMatrix4fv.bind(this);break;default:this.renderer.production||p(this.type+": This uniform type is not handled : ",e.type)}}setInternalFormat(e){e.value.type==="Vec2"?(e._internalFormat="Vec2",e.lastValue=e.value.clone()):e.value.type==="Vec3"?(e._internalFormat="Vec3",e.lastValue=e.value.clone()):e.value.type==="Mat4"?(e._internalFormat="Mat4",e.lastValue=e.value.clone()):e.value.type==="Quat"?(e._internalFormat="Quat",e.lastValue=e.value.clone()):Array.isArray(e.value)?(e._internalFormat="array",e.lastValue=Array.from(e.value)):e.value.constructor===Float32Array?(e._internalFormat="mat",e.lastValue=e.value):(e._internalFormat="float",e.lastValue=e.value)}setUniforms(){if(this.uniforms)for(const e in this.uniforms){let t=this.uniforms[e];t.location=this.gl.getUniformLocation(this.program,t.name),t._internalFormat||this.setInternalFormat(t),t.type||(t._internalFormat==="Vec2"?t.type="2f":t._internalFormat==="Vec3"?t.type="3f":t._internalFormat==="Mat4"?t.type="mat4":t._internalFormat==="array"?t.value.length===4?(t.type="4f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 4f (array of 4 floats) uniform type")):t.value.length===3?(t.type="3f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 3f (array of 3 floats) uniform type")):t.value.length===2&&(t.type="2f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 2f (array of 2 floats) uniform type")):t._internalFormat==="mat"?t.value.length===16?(t.type="mat4",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat4 (4x4 matrix array) uniform type")):t.value.length===9?(t.type="mat3",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat3 (3x3 matrix array) uniform type")):t.value.length===4&&(t.type="mat2",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat2 (2x2 matrix array) uniform type")):(t.type="1f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 1f (float) uniform type"))),this.handleUniformSetting(t),t.update&&t.update(t)}}updateUniforms(){if(this.uniforms)for(const e in this.uniforms){const t=this.uniforms[e];let i=!1;t._internalFormat==="Vec2"||t._internalFormat==="Vec3"||t._internalFormat==="Quat"?t.value.equals(t.lastValue)||(i=!0,t.lastValue.copy(t.value)):t.value.length?JSON.stringify(t.value)!==JSON.stringify(t.lastValue)&&(i=!0,t.lastValue=Array.from(t.value)):t.value!==t.lastValue&&(i=!0,t.lastValue=t.value),i&&t.update&&t.update(t)}}setUniform1i(e){this.gl.uniform1i(e.location,e.value)}setUniform1iv(e){this.gl.uniform1iv(e.location,e.value)}setUniform1f(e){this.gl.uniform1f(e.location,e.value)}setUniform1fv(e){this.gl.uniform1fv(e.location,e.value)}setUniform2i(e){e._internalFormat==="Vec2"?this.gl.uniform2i(e.location,e.value.x,e.value.y):this.gl.uniform2i(e.location,e.value[0],e.value[1])}setUniform2iv(e){e._internalFormat==="Vec2"?this.gl.uniform2iv(e.location,[e.value.x,e.value.y]):this.gl.uniform2iv(e.location,e.value)}setUniform2f(e){e._internalFormat==="Vec2"?this.gl.uniform2f(e.location,e.value.x,e.value.y):this.gl.uniform2f(e.location,e.value[0],e.value[1])}setUniform2fv(e){e._internalFormat==="Vec2"?this.gl.uniform2fv(e.location,[e.value.x,e.value.y]):this.gl.uniform2fv(e.location,e.value)}setUniform3i(e){e._internalFormat==="Vec3"?this.gl.uniform3i(e.location,e.value.x,e.value.y,e.value.z):this.gl.uniform3i(e.location,e.value[0],e.value[1],e.value[2])}setUniform3iv(e){e._internalFormat==="Vec3"?this.gl.uniform3iv(e.location,[e.value.x,e.value.y,e.value.z]):this.gl.uniform3iv(e.location,e.value)}setUniform3f(e){e._internalFormat==="Vec3"?this.gl.uniform3f(e.location,e.value.x,e.value.y,e.value.z):this.gl.uniform3f(e.location,e.value[0],e.value[1],e.value[2])}setUniform3fv(e){e._internalFormat==="Vec3"?this.gl.uniform3fv(e.location,[e.value.x,e.value.y,e.value.z]):this.gl.uniform3fv(e.location,e.value)}setUniform4i(e){e._internalFormat==="Quat"?this.gl.uniform4i(e.location,e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]):this.gl.uniform4i(e.location,e.value[0],e.value[1],e.value[2],e.value[3])}setUniform4iv(e){e._internalFormat==="Quat"?this.gl.uniform4iv(e.location,[e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]]):this.gl.uniform4iv(e.location,e.value)}setUniform4f(e){e._internalFormat==="Quat"?this.gl.uniform4f(e.location,e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]):this.gl.uniform4f(e.location,e.value[0],e.value[1],e.value[2],e.value[3])}setUniform4fv(e){e._internalFormat==="Quat"?this.gl.uniform4fv(e.location,[e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]]):this.gl.uniform4fv(e.location,e.value)}setUniformMatrix2fv(e){this.gl.uniformMatrix2fv(e.location,!1,e.value)}setUniformMatrix3fv(e){this.gl.uniformMatrix3fv(e.location,!1,e.value)}setUniformMatrix4fv(e){e._internalFormat==="Mat4"?this.gl.uniformMatrix4fv(e.location,!1,e.value.elements):this.gl.uniformMatrix4fv(e.location,!1,e.value)}}const oe=`
precision mediump float;
`.replace(/\n/g,""),Re=`
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
`.replace(/\n/g,""),ne=`
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
`.replace(/\n/g,""),lt=(oe+Re+ne+`
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g,""),ut=(oe+ne+`
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`).replace(/\n/g,""),ht=(oe+Re+ne+`
void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g,""),ct=(oe+ne+`
uniform sampler2D uRenderTexture;

void main() {
    gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
}
`).replace(/\n/g,"");let Ae=0;class Me{constructor(e,{parent:t,vertexShader:i,fragmentShader:s}={}){if(this.type="Program",!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){D(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.parent=t,this.defaultVsCode=this.parent.type==="Plane"?lt:ht,this.defaultFsCode=this.parent.type==="Plane"?ut:ct,i?this.vsCode=i:(!this.renderer.production&&this.parent.type==="Plane"&&p(this.parent.type+": No vertex shader provided, will use a default one"),this.vsCode=this.defaultVsCode),s?this.fsCode=s:(this.renderer.production||p(this.parent.type+": No fragment shader provided, will use a default one"),this.fsCode=this.defaultFsCode),this.compiled=!0,this.setupProgram()}createShader(e,t){const i=this.gl.createShader(t);if(this.gl.shaderSource(i,e),this.gl.compileShader(i),!this.renderer.production&&!this.gl.getShaderParameter(i,this.gl.COMPILE_STATUS)){const s=t===this.gl.VERTEX_SHADER?"vertex shader":"fragment shader";let o=this.gl.getShaderSource(i).split(`
`);for(let n=0;n<o.length;n++)o[n]=n+1+": "+o[n];return o=o.join(`
`),p(this.type+": Errors occurred while compiling the",s,`:
`,this.gl.getShaderInfoLog(i)),D(o),p(this.type+": Will use a default",s),this.createShader(t===this.gl.VERTEX_SHADER?this.defaultVsCode:this.defaultFsCode,t)}return i}useNewShaders(){this.vertexShader=this.createShader(this.vsCode,this.gl.VERTEX_SHADER),this.fragmentShader=this.createShader(this.fsCode,this.gl.FRAGMENT_SHADER),(!this.vertexShader||!this.fragmentShader)&&(this.renderer.production||p(this.type+": Unable to find or compile the vertex or fragment shader"))}setupProgram(){let e=this.renderer.cache.getProgramFromShaders(this.vsCode,this.fsCode);e?(this.vertexShader=e.vertexShader,this.fragmentShader=e.fragmentShader,this.activeUniforms=e.activeUniforms,this.activeAttributes=e.activeAttributes,this.createProgram()):(this.useNewShaders(),this.compiled&&(this.createProgram(),this.renderer.cache.addProgram(this)))}createProgram(){if(Ae++,this.id=Ae,this.program=this.gl.createProgram(),this.gl.attachShader(this.program,this.vertexShader),this.gl.attachShader(this.program,this.fragmentShader),this.gl.linkProgram(this.program),!this.renderer.production&&!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS)){p(this.type+": Unable to initialize the shader program: "+this.gl.getProgramInfoLog(this.program)),p(this.type+": Will use default vertex and fragment shaders"),this.vertexShader=this.createShader(this.defaultVsCode,this.gl.VERTEX_SHADER),this.fragmentShader=this.createShader(this.defaultFsCode,this.gl.FRAGMENT_SHADER),this.createProgram();return}if(this.gl.deleteShader(this.vertexShader),this.gl.deleteShader(this.fragmentShader),!this.activeUniforms||!this.activeAttributes){this.activeUniforms={textures:[],textureMatrices:[]};const e=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_UNIFORMS);for(let i=0;i<e;i++){const s=this.gl.getActiveUniform(this.program,i);s.type===this.gl.SAMPLER_2D&&this.activeUniforms.textures.push(s.name),s.type===this.gl.FLOAT_MAT4&&s.name!=="uMVMatrix"&&s.name!=="uPMatrix"&&this.activeUniforms.textureMatrices.push(s.name)}this.activeAttributes=[];const t=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_ATTRIBUTES);for(let i=0;i<t;i++){const s=this.gl.getActiveAttrib(this.program,i);this.activeAttributes.push(s.name)}}}createUniforms(e){this.uniformsManager=new nt(this.renderer,this.program,e),this.setUniforms()}setUniforms(){this.renderer.useProgram(this),this.uniformsManager.setUniforms()}updateUniforms(){this.renderer.useProgram(this),this.uniformsManager.updateUniforms()}}class dt{constructor(e,{program:t=null,width:i=1,height:s=1}={}){if(this.type="Geometry",!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){D(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.definition={id:i*s+i,width:i,height:s},this.setDefaultAttributes(),this.setVerticesUVs()}restoreContext(e){this.program=null,this.setDefaultAttributes(),this.setVerticesUVs(),this.setProgram(e)}setDefaultAttributes(){this.attributes={vertexPosition:{name:"aVertexPosition",size:3,isActive:!1},textureCoord:{name:"aTextureCoord",size:3,isActive:!1}}}setVerticesUVs(){const e=this.renderer.cache.getGeometryFromID(this.definition.id);e?(this.attributes.vertexPosition.array=e.vertices,this.attributes.textureCoord.array=e.uvs):(this.computeVerticesUVs(),this.renderer.cache.addGeometry(this.definition.id,this.attributes.vertexPosition.array,this.attributes.textureCoord.array))}setProgram(e){this.program=e,this.initAttributes(),this.renderer._isWebGL2?(this._vao=this.gl.createVertexArray(),this.gl.bindVertexArray(this._vao)):this.renderer.extensions.OES_vertex_array_object&&(this._vao=this.renderer.extensions.OES_vertex_array_object.createVertexArrayOES(),this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao)),this.initializeBuffers()}initAttributes(){for(const e in this.attributes){if(this.attributes[e].isActive=this.program.activeAttributes.includes(this.attributes[e].name),!this.attributes[e].isActive)return;this.attributes[e].location=this.gl.getAttribLocation(this.program.program,this.attributes[e].name),this.attributes[e].buffer=this.gl.createBuffer(),this.attributes[e].numberOfItems=this.definition.width*this.definition.height*this.attributes[e].size*2}}computeVerticesUVs(){this.attributes.vertexPosition.array=[],this.attributes.textureCoord.array=[];const e=this.attributes.vertexPosition.array,t=this.attributes.textureCoord.array;for(let i=0;i<this.definition.height;i++){const s=i/this.definition.height;for(let r=0;r<this.definition.width;r++){const o=r/this.definition.width;t.push(o),t.push(s),t.push(0),e.push((o-.5)*2),e.push((s-.5)*2),e.push(0),t.push(o+1/this.definition.width),t.push(s),t.push(0),e.push((o+1/this.definition.width-.5)*2),e.push((s-.5)*2),e.push(0),t.push(o),t.push(s+1/this.definition.height),t.push(0),e.push((o-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0),t.push(o),t.push(s+1/this.definition.height),t.push(0),e.push((o-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0),t.push(o+1/this.definition.width),t.push(s),t.push(0),e.push((o+1/this.definition.width-.5)*2),e.push((s-.5)*2),e.push(0),t.push(o+1/this.definition.width),t.push(s+1/this.definition.height),t.push(0),e.push((o+1/this.definition.width-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0)}}}initializeBuffers(){if(this.attributes){for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.enableVertexAttribArray(this.attributes[e].location),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(this.attributes[e].array),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.attributes[e].location,this.attributes[e].size,this.gl.FLOAT,!1,0,0)}this.renderer.state.currentGeometryID=this.definition.id}}bindBuffers(){if(this._vao)this.renderer._isWebGL2?this.gl.bindVertexArray(this._vao):this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao);else for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.enableVertexAttribArray(this.attributes[e].location),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.vertexAttribPointer(this.attributes[e].location,this.attributes[e].size,this.gl.FLOAT,!1,0,0)}this.renderer.state.currentGeometryID=this.definition.id}draw(){this.gl.drawArrays(this.gl.TRIANGLES,0,this.attributes.vertexPosition.numberOfItems)}dispose(){this._vao&&(this.renderer._isWebGL2?this.gl.deleteVertexArray(this._vao):this.renderer.extensions.OES_vertex_array_object.deleteVertexArrayOES(this._vao));for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,1,this.gl.STATIC_DRAW),this.gl.deleteBuffer(this.attributes[e].buffer)}this.attributes=null,this.renderer.state.currentGeometryID=null}}class K{constructor(e=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])){this.type="Mat4",this.elements=e}setFromArray(e){for(let t=0;t<this.elements.length;t++)this.elements[t]=e[t];return this}copy(e){const t=e.elements;return this.elements[0]=t[0],this.elements[1]=t[1],this.elements[2]=t[2],this.elements[3]=t[3],this.elements[4]=t[4],this.elements[5]=t[5],this.elements[6]=t[6],this.elements[7]=t[7],this.elements[8]=t[8],this.elements[9]=t[9],this.elements[10]=t[10],this.elements[11]=t[11],this.elements[12]=t[12],this.elements[13]=t[13],this.elements[14]=t[14],this.elements[15]=t[15],this}clone(){return new K().copy(this)}multiply(e){const t=this.elements,i=e.elements;let s=new K;return s.elements[0]=i[0]*t[0]+i[1]*t[4]+i[2]*t[8]+i[3]*t[12],s.elements[1]=i[0]*t[1]+i[1]*t[5]+i[2]*t[9]+i[3]*t[13],s.elements[2]=i[0]*t[2]+i[1]*t[6]+i[2]*t[10]+i[3]*t[14],s.elements[3]=i[0]*t[3]+i[1]*t[7]+i[2]*t[11]+i[3]*t[15],s.elements[4]=i[4]*t[0]+i[5]*t[4]+i[6]*t[8]+i[7]*t[12],s.elements[5]=i[4]*t[1]+i[5]*t[5]+i[6]*t[9]+i[7]*t[13],s.elements[6]=i[4]*t[2]+i[5]*t[6]+i[6]*t[10]+i[7]*t[14],s.elements[7]=i[4]*t[3]+i[5]*t[7]+i[6]*t[11]+i[7]*t[15],s.elements[8]=i[8]*t[0]+i[9]*t[4]+i[10]*t[8]+i[11]*t[12],s.elements[9]=i[8]*t[1]+i[9]*t[5]+i[10]*t[9]+i[11]*t[13],s.elements[10]=i[8]*t[2]+i[9]*t[6]+i[10]*t[10]+i[11]*t[14],s.elements[11]=i[8]*t[3]+i[9]*t[7]+i[10]*t[11]+i[11]*t[15],s.elements[12]=i[12]*t[0]+i[13]*t[4]+i[14]*t[8]+i[15]*t[12],s.elements[13]=i[12]*t[1]+i[13]*t[5]+i[14]*t[9]+i[15]*t[13],s.elements[14]=i[12]*t[2]+i[13]*t[6]+i[14]*t[10]+i[15]*t[14],s.elements[15]=i[12]*t[3]+i[13]*t[7]+i[14]*t[11]+i[15]*t[15],s}getInverse(){const e=this.elements,t=new K,i=t.elements;let s=e[0],r=e[1],o=e[2],n=e[3],u=e[4],l=e[5],c=e[6],d=e[7],g=e[8],m=e[9],y=e[10],v=e[11],b=e[12],x=e[13],P=e[14],M=e[15],k=s*l-r*u,L=s*c-o*u,E=s*d-n*u,R=r*c-o*l,z=r*d-n*l,U=o*d-n*c,Y=g*x-m*b,$=g*P-y*b,Q=g*M-v*b,J=m*P-y*x,ee=m*M-v*x,te=y*M-v*P,F=k*te-L*ee+E*J+R*Q-z*$+U*Y;return F?(F=1/F,i[0]=(l*te-c*ee+d*J)*F,i[1]=(o*ee-r*te-n*J)*F,i[2]=(x*U-P*z+M*R)*F,i[3]=(y*z-m*U-v*R)*F,i[4]=(c*Q-u*te-d*$)*F,i[5]=(s*te-o*Q+n*$)*F,i[6]=(P*E-b*U-M*L)*F,i[7]=(g*U-y*E+v*L)*F,i[8]=(u*ee-l*Q+d*Y)*F,i[9]=(r*Q-s*ee-n*Y)*F,i[10]=(b*z-x*E+M*k)*F,i[11]=(m*E-g*z-v*k)*F,i[12]=(l*$-u*J-c*Y)*F,i[13]=(s*J-r*$+o*Y)*F,i[14]=(x*L-b*R-P*k)*F,i[15]=(g*R-m*L+y*k)*F,t):null}scale(e){let t=this.elements;return t[0]*=e.x,t[1]*=e.x,t[2]*=e.x,t[3]*=e.x,t[4]*=e.y,t[5]*=e.y,t[6]*=e.y,t[7]*=e.y,t[8]*=e.z,t[9]*=e.z,t[10]*=e.z,t[11]*=e.z,this}compose(e,t,i){let s=this.elements;const r=t.elements[0],o=t.elements[1],n=t.elements[2],u=t.elements[3],l=r+r,c=o+o,d=n+n,g=r*l,m=r*c,y=r*d,v=o*c,b=o*d,x=n*d,P=u*l,M=u*c,k=u*d,L=i.x,E=i.y,R=i.z;return s[0]=(1-(v+x))*L,s[1]=(m+k)*L,s[2]=(y-M)*L,s[3]=0,s[4]=(m-k)*E,s[5]=(1-(g+x))*E,s[6]=(b+P)*E,s[7]=0,s[8]=(y+M)*R,s[9]=(b-P)*R,s[10]=(1-(g+v))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}composeFromOrigin(e,t,i,s){let r=this.elements;const o=t.elements[0],n=t.elements[1],u=t.elements[2],l=t.elements[3],c=o+o,d=n+n,g=u+u,m=o*c,y=o*d,v=o*g,b=n*d,x=n*g,P=u*g,M=l*c,k=l*d,L=l*g,E=i.x,R=i.y,z=i.z,U=s.x,Y=s.y,$=s.z,Q=(1-(b+P))*E,J=(y+L)*E,ee=(v-k)*E,te=(y-L)*R,F=(1-(m+P))*R,je=(x+M)*R,Ke=(v+k)*z,Ze=(x-M)*z,Qe=(1-(m+b))*z;return r[0]=Q,r[1]=J,r[2]=ee,r[3]=0,r[4]=te,r[5]=F,r[6]=je,r[7]=0,r[8]=Ke,r[9]=Ze,r[10]=Qe,r[11]=0,r[12]=e.x+U-(Q*U+te*Y+Ke*$),r[13]=e.y+Y-(J*U+F*Y+Ze*$),r[14]=e.z+$-(ee*U+je*Y+Qe*$),r[15]=1,this}}class f{constructor(e=0,t=e){this.type="Vec2",this._x=e,this._y=t}get x(){return this._x}get y(){return this._y}set x(e){const t=e!==this._x;this._x=e,t&&this._onChangeCallback&&this._onChangeCallback()}set y(e){const t=e!==this._y;this._y=e,t&&this._onChangeCallback&&this._onChangeCallback()}onChange(e){return e&&(this._onChangeCallback=e),this}set(e,t){return this._x=e,this._y=t,this}add(e){return this._x+=e.x,this._y+=e.y,this}addScalar(e){return this._x+=e,this._y+=e,this}sub(e){return this._x-=e.x,this._y-=e.y,this}subScalar(e){return this._x-=e,this._y-=e,this}multiply(e){return this._x*=e.x,this._y*=e.y,this}multiplyScalar(e){return this._x*=e,this._y*=e,this}copy(e){return this._x=e.x,this._y=e.y,this}clone(){return new f(this._x,this._y)}sanitizeNaNValuesWith(e){return this._x=isNaN(this._x)?e.x:parseFloat(this._x),this._y=isNaN(this._y)?e.y:parseFloat(this._y),this}max(e){return this._x=Math.max(this._x,e.x),this._y=Math.max(this._y,e.y),this}min(e){return this._x=Math.min(this._x,e.x),this._y=Math.min(this._y,e.y),this}equals(e){return this._x===e.x&&this._y===e.y}normalize(){let e=this._x*this._x+this._y*this._y;return e>0&&(e=1/Math.sqrt(e)),this._x*=e,this._y*=e,this}dot(e){return this._x*e.x+this._y*e.y}}class _{constructor(e=0,t=e,i=e){this.type="Vec3",this._x=e,this._y=t,this._z=i}get x(){return this._x}get y(){return this._y}get z(){return this._z}set x(e){const t=e!==this._x;this._x=e,t&&this._onChangeCallback&&this._onChangeCallback()}set y(e){const t=e!==this._y;this._y=e,t&&this._onChangeCallback&&this._onChangeCallback()}set z(e){const t=e!==this._z;this._z=e,t&&this._onChangeCallback&&this._onChangeCallback()}onChange(e){return e&&(this._onChangeCallback=e),this}set(e,t,i){return this._x=e,this._y=t,this._z=i,this}add(e){return this._x+=e.x,this._y+=e.y,this._z+=e.z,this}addScalar(e){return this._x+=e,this._y+=e,this._z+=e,this}sub(e){return this._x-=e.x,this._y-=e.y,this._z-=e.z,this}subScalar(e){return this._x-=e,this._y-=e,this._z-=e,this}multiply(e){return this._x*=e.x,this._y*=e.y,this._z*=e.z,this}multiplyScalar(e){return this._x*=e,this._y*=e,this._z*=e,this}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this}clone(){return new _(this._x,this._y,this._z)}sanitizeNaNValuesWith(e){return this._x=isNaN(this._x)?e.x:parseFloat(this._x),this._y=isNaN(this._y)?e.y:parseFloat(this._y),this._z=isNaN(this._z)?e.z:parseFloat(this._z),this}max(e){return this._x=Math.max(this._x,e.x),this._y=Math.max(this._y,e.y),this._z=Math.max(this._z,e.z),this}min(e){return this._x=Math.min(this._x,e.x),this._y=Math.min(this._y,e.y),this._z=Math.min(this._z,e.z),this}equals(e){return this._x===e.x&&this._y===e.y&&this._z===e.z}normalize(){let e=this._x*this._x+this._y*this._y+this._z*this._z;return e>0&&(e=1/Math.sqrt(e)),this._x*=e,this._y*=e,this._z*=e,this}dot(e){return this._x*e.x+this._y*e.y+this._z*e.z}applyMat4(e){const t=this._x,i=this._y,s=this._z,r=e.elements;let o=r[3]*t+r[7]*i+r[11]*s+r[15];return o=o||1,this._x=(r[0]*t+r[4]*i+r[8]*s+r[12])/o,this._y=(r[1]*t+r[5]*i+r[9]*s+r[13])/o,this._z=(r[2]*t+r[6]*i+r[10]*s+r[14])/o,this}applyQuat(e){const t=this._x,i=this._y,s=this._z,r=e.elements[0],o=e.elements[1],n=e.elements[2],u=e.elements[3],l=u*t+o*s-n*i,c=u*i+n*t-r*s,d=u*s+r*i-o*t,g=-r*t-o*i-n*s;return this._x=l*u+g*-r+c*-n-d*-o,this._y=c*u+g*-o+d*-r-l*-n,this._z=d*u+g*-n+l*-o-c*-r,this}project(e){return this.applyMat4(e.viewMatrix).applyMat4(e.projectionMatrix),this}unproject(e){return this.applyMat4(e.projectionMatrix.getInverse()).applyMat4(e.worldMatrix),this}}const fe=new f,ft=new _,pt=new K;class ie{constructor(e,{isFBOTexture:t=!1,fromTexture:i=!1,loader:s,sampler:r,floatingPoint:o="none",premultiplyAlpha:n=!1,anisotropy:u=1,generateMipmap:l=null,wrapS:c,wrapT:d,minFilter:g,magFilter:m}={}){if(this.type="Texture",e=e&&e.renderer||e,!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){e.production||D(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined");return}if(this.renderer=e,this.gl=this.renderer.gl,this.uuid=de(),this._globalParameters={unpackAlignment:4,flipY:!t,premultiplyAlpha:!1,shouldPremultiplyAlpha:n,floatingPoint:o,type:this.gl.UNSIGNED_BYTE,internalFormat:this.gl.RGBA,format:this.gl.RGBA},this.parameters={anisotropy:u,generateMipmap:l,wrapS:c||this.gl.CLAMP_TO_EDGE,wrapT:d||this.gl.CLAMP_TO_EDGE,minFilter:g||this.gl.LINEAR,magFilter:m||this.gl.LINEAR,_shouldUpdate:!0},this._initState(),this.sourceType=t?"fbo":"empty",this._useCache=!0,this._samplerName=r,this._sampler={isActive:!1,isTextureBound:!1,texture:this.gl.createTexture()},this._textureMatrix={matrix:new K,isActive:!1},this._size={width:1,height:1},this.scale=new f(1),this.scale.onChange(()=>this.resize()),this.offset=new f,this.offset.onChange(()=>this.resize()),this._loader=s,this._sourceLoaded=!1,this._uploaded=!1,this._willUpdate=!1,this.shouldUpdate=!1,this._forceUpdate=!1,this.userData={},this._canDraw=!1,i){this._copyOnInit=!0,this._copiedFrom=i;return}this._copyOnInit=!1,this._initTexture()}_initState(){this._state={anisotropy:1,generateMipmap:!1,wrapS:null,wrapT:null,minFilter:null,magFilter:this.gl.LINEAR}}_initTexture(){this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.sourceType==="empty"&&(this._globalParameters.flipY=!1,this._updateGlobalTexParameters(),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this._canDraw=!0)}_restoreFromTexture(){this._copyOnInit||this._initTexture(),this._parent&&(this._setTextureUniforms(),this._setSize()),this.copy(this._copiedFrom),this._canDraw=!0}_restoreContext(){if(this._canDraw=!1,this._sampler.texture=this.gl.createTexture(),this._sampler.isActive=!1,this._sampler.isTextureBound=!1,this._textureMatrix.isActive=!1,this._initState(),this._state.generateMipmap=!1,this.parameters._shouldUpdate=!0,!this._copiedFrom)this._initTexture(),this._parent&&this._setParent(),this.source&&(this.setSource(this.source),this.sourceType==="image"?this.renderer.cache.addTexture(this):this.needUpdate()),this._canDraw=!0;else{const e=this.renderer.nextRender.add(()=>{this._copiedFrom._canDraw&&(this._restoreFromTexture(),e.keep=!1)},!0)}}addParent(e){if(!e||e.type!=="Plane"&&e.type!=="PingPongPlane"&&e.type!=="ShaderPass"&&e.type!=="RenderTarget"){this.renderer.production||p(this.type+": cannot add texture as a child of ",e," because it is not a valid parent");return}this._parent=e,this.index=this._parent.textures.length,this._parent.textures.push(this),this._setParent()}_setParent(){if(this._sampler.name=this._samplerName||"uSampler"+this.index,this._textureMatrix.name=this._samplerName?this._samplerName+"Matrix":"uTextureMatrix"+this.index,this._parent._program){if(!this._parent._program.compiled){this.renderer.production||p(this.type+": Unable to create the texture because the program is not valid");return}if(this._setTextureUniforms(),this._copyOnInit){const e=this.renderer.nextRender.add(()=>{this._copiedFrom._canDraw&&this._copiedFrom._uploaded&&(this.copy(this._copiedFrom),e.keep=!1)},!0);return}this.source?this._parent.loader&&this._parent.loader._addSourceToParent(this.source,this.sourceType):this._size={width:this._parent._boundingRect.document.width,height:this._parent._boundingRect.document.height},this._setSize()}else this._parent.type==="RenderTarget"&&(this._size={width:this._parent._size&&this._parent._size.width||this.renderer._boundingRect.width,height:this._parent._size&&this._parent._size.height||this.renderer._boundingRect.height},this._upload(),this._updateTexParameters(),this._canDraw=!0)}hasParent(){return!!this._parent}_setTextureUniforms(){const e=this._parent._program.activeUniforms;for(let t=0;t<e.textures.length;t++)e.textures[t]===this._sampler.name&&(this._sampler.isActive=!0,this.renderer.useProgram(this._parent._program),this._sampler.location=this.gl.getUniformLocation(this._parent._program.program,this._sampler.name),e.textureMatrices.find(s=>s===this._textureMatrix.name)&&(this._textureMatrix.isActive=!0,this._textureMatrix.location=this.gl.getUniformLocation(this._parent._program.program,this._textureMatrix.name)),this.gl.uniform1i(this._sampler.location,this.index))}copy(e){if(!e||e.type!=="Texture"){this.renderer.production||p(this.type+": Unable to set the texture from texture:",e);return}this._globalParameters=Object.assign({},e._globalParameters),this._state=Object.assign({},e._state),this.parameters.generateMipmap=e.parameters.generateMipmap,this._state.generateMipmap=null,this._size=e._size,!this._sourceLoaded&&e._sourceLoaded&&this._onSourceLoadedCallback&&this._onSourceLoadedCallback(),this._sourceLoaded=e._sourceLoaded,!this._uploaded&&e._uploaded&&this._onSourceUploadedCallback&&this._onSourceUploadedCallback(),this._uploaded=e._uploaded,this.sourceType=e.sourceType,this.source=e.source,this._videoFrameCallbackID=e._videoFrameCallbackID,this._sampler.texture=e._sampler.texture,this._copiedFrom=e,this._parent&&this._parent._program&&(!this._canDraw||!this._textureMatrix.matrix)&&(this._setSize(),this._canDraw=!0),this._updateTexParameters(),this.renderer.needRender()}setSource(e){this._sourceLoaded||this.renderer.nextRender.add(()=>this._onSourceLoadedCallback&&this._onSourceLoadedCallback());const t=e.tagName.toUpperCase()==="IMG"?"image":e.tagName.toLowerCase();if((t==="video"||t==="canvas")&&(this._useCache=!1),this._useCache){const i=this.renderer.cache.getTextureFromSource(e);if(i&&i.uuid!==this.uuid){this._uploaded||(this.renderer.nextRender.add(()=>this._onSourceUploadedCallback&&this._onSourceUploadedCallback()),this._uploaded=!0),this.copy(i),this.resize();return}}if(this.sourceType==="empty"||this.sourceType!==t)if(t==="video")this._willUpdate=!1,this.shouldUpdate=!0;else if(t==="canvas")this._willUpdate=!0,this.shouldUpdate=!0;else if(t==="image")this._willUpdate=!1,this.shouldUpdate=!1;else{this.renderer.production||p(this.type+": this HTML tag could not be converted into a texture:",e.tagName);return}this.source=e,this.sourceType=t,this._size={width:this.source.naturalWidth||this.source.width||this.source.videoWidth,height:this.source.naturalHeight||this.source.height||this.source.videoHeight},this._sourceLoaded=!0,this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.resize(),this._globalParameters.flipY=!0,this._globalParameters.premultiplyAlpha=this._globalParameters.shouldPremultiplyAlpha,this.sourceType==="image"&&(this.parameters.generateMipmap=this.parameters.generateMipmap||this.parameters.generateMipmap===null,this.parameters._shouldUpdate=this.parameters.generateMipmap,this._state.generateMipmap=!1,this._upload()),this.renderer.needRender()}_updateGlobalTexParameters(){this.renderer.state.unpackAlignment!==this._globalParameters.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this._globalParameters.unpackAlignment),this.renderer.state.unpackAlignment=this._globalParameters.unpackAlignment),this.renderer.state.flipY!==this._globalParameters.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this._globalParameters.flipY),this.renderer.state.flipY=this._globalParameters.flipY),this.renderer.state.premultiplyAlpha!==this._globalParameters.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this._globalParameters.premultiplyAlpha),this.renderer.state.premultiplyAlpha=this._globalParameters.premultiplyAlpha),this._globalParameters.floatingPoint==="half-float"?this.renderer._isWebGL2&&this.renderer.extensions.EXT_color_buffer_float?(this._globalParameters.internalFormat=this.gl.RGBA16F,this._globalParameters.type=this.gl.HALF_FLOAT):this.renderer.extensions.OES_texture_half_float?this._globalParameters.type=this.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES:this.renderer.production||p(this.type+": could not use half-float textures because the extension is not available"):this._globalParameters.floatingPoint==="float"&&(this.renderer._isWebGL2&&this.renderer.extensions.EXT_color_buffer_float?(this._globalParameters.internalFormat=this.gl.RGBA16F,this._globalParameters.type=this.gl.FLOAT):this.renderer.extensions.OES_texture_float?this._globalParameters.type=this.renderer.extensions.OES_texture_half_float.FLOAT:this.renderer.production||p(this.type+": could not use float textures because the extension is not available"))}_updateTexParameters(){this.index&&this.renderer.state.activeTexture!==this.index&&this._bindTexture(),this.parameters.wrapS!==this._state.wrapS&&(!this.renderer._isWebGL2&&(!j(this._size.width)||!j(this._size.height))&&(this.parameters.wrapS=this.gl.CLAMP_TO_EDGE),this.parameters.wrapS!==this.gl.REPEAT&&this.parameters.wrapS!==this.gl.CLAMP_TO_EDGE&&this.parameters.wrapS!==this.gl.MIRRORED_REPEAT&&(this.renderer.production||p(this.type+": Wrong wrapS value",this.parameters.wrapS,"for this texture:",this,`
gl.CLAMP_TO_EDGE wrapping will be used instead`),this.parameters.wrapS=this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.parameters.wrapS),this._state.wrapS=this.parameters.wrapS),this.parameters.wrapT!==this._state.wrapT&&(!this.renderer._isWebGL2&&(!j(this._size.width)||!j(this._size.height))&&(this.parameters.wrapT=this.gl.CLAMP_TO_EDGE),this.parameters.wrapT!==this.gl.REPEAT&&this.parameters.wrapT!==this.gl.CLAMP_TO_EDGE&&this.parameters.wrapT!==this.gl.MIRRORED_REPEAT&&(this.renderer.production||p(this.type+": Wrong wrapT value",this.parameters.wrapT,"for this texture:",this,`
gl.CLAMP_TO_EDGE wrapping will be used instead`),this.parameters.wrapT=this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.parameters.wrapT),this._state.wrapT=this.parameters.wrapT),this.parameters.generateMipmap&&!this._state.generateMipmap&&this.source&&(!this.renderer._isWebGL2&&(!j(this._size.width)||!j(this._size.height))?this.parameters.generateMipmap=!1:this.gl.generateMipmap(this.gl.TEXTURE_2D),this._state.generateMipmap=this.parameters.generateMipmap),this.parameters.minFilter!==this._state.minFilter&&(!this.renderer._isWebGL2&&(!j(this._size.width)||!j(this._size.height))&&(this.parameters.minFilter=this.gl.LINEAR),!this.parameters.generateMipmap&&this.parameters.generateMipmap!==null&&(this.parameters.minFilter=this.gl.LINEAR),this.parameters.minFilter!==this.gl.LINEAR&&this.parameters.minFilter!==this.gl.NEAREST&&this.parameters.minFilter!==this.gl.NEAREST_MIPMAP_NEAREST&&this.parameters.minFilter!==this.gl.LINEAR_MIPMAP_NEAREST&&this.parameters.minFilter!==this.gl.NEAREST_MIPMAP_LINEAR&&this.parameters.minFilter!==this.gl.LINEAR_MIPMAP_LINEAR&&(this.renderer.production||p(this.type+": Wrong minFilter value",this.parameters.minFilter,"for this texture:",this,`
gl.LINEAR filtering will be used instead`),this.parameters.minFilter=this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.parameters.minFilter),this._state.minFilter=this.parameters.minFilter),this.parameters.magFilter!==this._state.magFilter&&(!this.renderer._isWebGL2&&(!j(this._size.width)||!j(this._size.height))&&(this.parameters.magFilter=this.gl.LINEAR),this.parameters.magFilter!==this.gl.LINEAR&&this.parameters.magFilter!==this.gl.NEAREST&&(this.renderer.production||p(this.type+": Wrong magFilter value",this.parameters.magFilter,"for this texture:",this,`
gl.LINEAR filtering will be used instead`),this.parameters.magFilter=this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.parameters.magFilter),this._state.magFilter=this.parameters.magFilter);const e=this.renderer.extensions.EXT_texture_filter_anisotropic;if(e&&this.parameters.anisotropy!==this._state.anisotropy){const t=this.gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);this.parameters.anisotropy=Math.max(1,Math.min(this.parameters.anisotropy,t)),this.gl.texParameterf(this.gl.TEXTURE_2D,e.TEXTURE_MAX_ANISOTROPY_EXT,this.parameters.anisotropy),this._state.anisotropy=this.parameters.anisotropy}}setWrapS(e){this.parameters.wrapS!==e&&(this.parameters.wrapS=e,this.parameters._shouldUpdate=!0)}setWrapT(e){this.parameters.wrapT!==e&&(this.parameters.wrapT=e,this.parameters._shouldUpdate=!0)}setMinFilter(e){this.parameters.minFilter!==e&&(this.parameters.minFilter=e,this.parameters._shouldUpdate=!0)}setMagFilter(e){this.parameters.magFilter!==e&&(this.parameters.magFilter=e,this.parameters._shouldUpdate=!0)}setAnisotropy(e){e=isNaN(e)?this.parameters.anisotropy:e,this.parameters.anisotropy!==e&&(this.parameters.anisotropy=e,this.parameters._shouldUpdate=!0)}needUpdate(){this._forceUpdate=!0}_videoFrameCallback(){this._willUpdate=!0,this.source.requestVideoFrameCallback(()=>this._videoFrameCallback())}_upload(){this._updateGlobalTexParameters(),this.source?this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._globalParameters.format,this._globalParameters.type,this.source):this.sourceType==="fbo"&&this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._size.width,this._size.height,0,this._globalParameters.format,this._globalParameters.type,this.source||null),this._uploaded||(this.renderer.nextRender.add(()=>this._onSourceUploadedCallback&&this._onSourceUploadedCallback()),this._uploaded=!0)}_getSizes(){if(this.sourceType==="fbo")return{parentWidth:this._parent._boundingRect.document.width,parentHeight:this._parent._boundingRect.document.height,sourceWidth:this._parent._boundingRect.document.width,sourceHeight:this._parent._boundingRect.document.height,xOffset:0,yOffset:0};const e=this._parent.scale?fe.set(this._parent.scale.x,this._parent.scale.y):fe.set(1,1),t=this._parent._boundingRect.document.width*e.x,i=this._parent._boundingRect.document.height*e.y,s=this._size.width,r=this._size.height,o=s/r,n=t/i;let u=0,l=0;return n>o?l=Math.min(0,i-t*(1/o)):n<o&&(u=Math.min(0,t-i*o)),{parentWidth:t,parentHeight:i,sourceWidth:s,sourceHeight:r,xOffset:u,yOffset:l}}setScale(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set scale because the parameter passed is not of Vec2 type:",e);return}e.sanitizeNaNValuesWith(this.scale).max(fe.set(.001,.001)),e.equals(this.scale)||(this.scale.copy(e),this.resize())}setOffset(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set offset because the parameter passed is not of Vec2 type:",scale);return}e.sanitizeNaNValuesWith(this.offset),e.equals(this.offset)||(this.offset.copy(e),this.resize())}_setSize(){if(this._parent&&this._parent._program){const e=this._getSizes();this._updateTextureMatrix(e)}}resize(){this.sourceType==="fbo"?(this._size={width:this._parent._size&&this._parent._size.width||this._parent._boundingRect.document.width,height:this._parent._size&&this._parent._size.height||this._parent._boundingRect.document.height},this._copiedFrom||(this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._size.width,this._size.height,0,this._globalParameters.format,this._globalParameters.type,null))):this.source&&(this._size={width:this.source.naturalWidth||this.source.width||this.source.videoWidth,height:this.source.naturalHeight||this.source.height||this.source.videoHeight}),this._setSize()}_updateTextureMatrix(e){const t=ft.set(e.parentWidth/(e.parentWidth-e.xOffset),e.parentHeight/(e.parentHeight-e.yOffset),1);t.x/=this.scale.x,t.y/=this.scale.y,this._textureMatrix.matrix=pt.setFromArray([t.x,0,0,0,0,t.y,0,0,0,0,1,0,(1-t.x)/2+this.offset.x,(1-t.y)/2+this.offset.y,0,1]),this._updateMatrixUniform()}_updateMatrixUniform(){this._textureMatrix.isActive&&(this.renderer.useProgram(this._parent._program),this.gl.uniformMatrix4fv(this._textureMatrix.location,!1,this._textureMatrix.matrix.elements))}_onSourceLoaded(e){this.setSource(e),this.sourceType==="image"&&this.renderer.cache.addTexture(this)}_bindTexture(){this._canDraw&&(this.renderer.state.activeTexture!==this.index&&(this.gl.activeTexture(this.gl.TEXTURE0+this.index),this.renderer.state.activeTexture=this.index),this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this._sampler.isTextureBound||(this._sampler.isTextureBound=!!this.gl.getParameter(this.gl.TEXTURE_BINDING_2D),this._sampler.isTextureBound&&this.renderer.needRender()))}_draw(){this._sampler.isActive&&(this._bindTexture(),this.sourceType==="video"&&this.source&&!this._videoFrameCallbackID&&this.source.readyState>=this.source.HAVE_CURRENT_DATA&&!this.source.paused&&(this._willUpdate=!0),(this._forceUpdate||this._willUpdate&&this.shouldUpdate)&&(this._state.generateMipmap=!1,this._upload()),this.sourceType==="video"&&(this._willUpdate=!1),this._forceUpdate=!1),this.parameters._shouldUpdate&&(this._updateTexParameters(),this.parameters._shouldUpdate=!1)}onSourceLoaded(e){return e&&(this._onSourceLoadedCallback=e),this}onSourceUploaded(e){return e&&(this._onSourceUploadedCallback=e),this}_dispose(e=!1){this.sourceType==="video"||this.sourceType==="image"&&!this.renderer.state.isActive?(this._loader&&this._loader._removeSource(this),this.source=null):this.sourceType==="canvas"&&(this.source.width=this.source.width,this.source=null),this._parent=null,this.gl&&!this._copiedFrom&&(e||this.sourceType!=="image"||!this.renderer.state.isActive)&&(this._canDraw=!1,this.renderer.cache.removeTexture(this),this.gl.activeTexture(this.gl.TEXTURE0+this.index),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.deleteTexture(this._sampler.texture))}}class mt{constructor(e,t="anonymous"){if(this.type="TextureLoader",e=e&&e.renderer||e,!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){D(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.crossOrigin=t,this.elements=[]}_addElement(e,t,i,s){const r={source:e,texture:t,load:this._sourceLoaded.bind(this,e,t,i),error:this._sourceLoadError.bind(this,e,s)};return this.elements.push(r),r}_sourceLoadError(e,t,i){t&&t(e,i)}_sourceLoaded(e,t,i){t._sourceLoaded||(t._onSourceLoaded(e),this._parent&&(this._increment&&this._increment(),this.renderer.nextRender.add(()=>this._parent._onLoadingCallback&&this._parent._onLoadingCallback(t))),i&&i(t))}_getSourceType(e){let t;return typeof e=="string"?e.match(/\.(jpeg|jpg|jfif|pjpeg|pjp|gif|bmp|png|webp|svg|avif|apng)$/)!==null?t="image":e.match(/\.(webm|mp4|mpg|mpeg|avi|ogg|ogm|ogv|mov|av1)$/)!==null&&(t="video"):e.tagName.toUpperCase()==="IMG"?t="image":e.tagName.toUpperCase()==="VIDEO"?t="video":e.tagName.toUpperCase()==="CANVAS"&&(t="canvas"),t}_createImage(e){if(typeof e=="string"||!e.hasAttribute("crossOrigin")){const t=new Image;return t.crossOrigin=this.crossOrigin,typeof e=="string"?t.src=e:(t.src=e.src,e.hasAttribute("data-sampler")&&t.setAttribute("data-sampler",e.getAttribute("data-sampler"))),t}else return e}_createVideo(e){if(typeof e=="string"||e.getAttribute("crossOrigin")===null){const t=document.createElement("video");return t.crossOrigin=this.crossOrigin,typeof e=="string"?t.src=e:(t.src=e.src,e.hasAttribute("data-sampler")&&t.setAttribute("data-sampler",e.getAttribute("data-sampler"))),t}else return e}loadSource(e,t,i,s){switch(this._getSourceType(e)){case"image":this.loadImage(e,t,i,s);break;case"video":this.loadVideo(e,t,i,s);break;case"canvas":this.loadCanvas(e,t,i);break;default:this._sourceLoadError(e,s,"this source could not be converted into a texture: "+e);break}}loadSources(e,t,i,s){for(let r=0;r<e.length;r++)this.loadSource(e[r],t,i,s)}loadImage(e,t={},i,s){const r=this.renderer.cache.getTextureFromSource(e);let o=Object.assign({},t);if(this._parent&&(o=Object.assign(o,this._parent._texturesOptions)),o.loader=this,r){o.sampler=typeof e!="string"&&e.hasAttribute("data-sampler")?e.getAttribute("data-sampler"):o.sampler,o.fromTexture=r;const c=new ie(this.renderer,o);this._sourceLoaded(r.source,c,i),this._parent&&this._addToParent(c,r.source,"image");return}const n=this._createImage(e);o.sampler=n.hasAttribute("data-sampler")?n.getAttribute("data-sampler"):o.sampler;const u=new ie(this.renderer,o),l=this._addElement(n,u,i,s);n.complete?this._sourceLoaded(n,u,i):n.decode?n.decode().then(this._sourceLoaded.bind(this,n,u,i)).catch(()=>{n.addEventListener("load",l.load,!1),n.addEventListener("error",l.error,!1)}):(n.addEventListener("load",l.load,!1),n.addEventListener("error",l.error,!1)),this._parent&&this._addToParent(u,n,"image")}loadImages(e,t,i,s){for(let r=0;r<e.length;r++)this.loadImage(e[r],t,i,s)}loadVideo(e,t={},i,s){const r=this._createVideo(e);r.preload=!0,r.muted=!0,r.loop=!0,r.setAttribute("playsinline",""),r.crossOrigin=this.crossOrigin;let o=Object.assign({},t);this._parent&&(o=Object.assign(t,this._parent._texturesOptions)),o.loader=this,o.sampler=r.hasAttribute("data-sampler")?r.getAttribute("data-sampler"):o.sampler;const n=new ie(this.renderer,o),u=this._addElement(r,n,i,s);r.addEventListener("canplaythrough",u.load,!1),r.addEventListener("error",u.error,!1),r.readyState>=r.HAVE_FUTURE_DATA&&i&&this._sourceLoaded(r,n,i),r.load(),this._addToParent&&this._addToParent(n,r,"video"),"requestVideoFrameCallback"in HTMLVideoElement.prototype&&(u.videoFrameCallback=n._videoFrameCallback.bind(n),n._videoFrameCallbackID=r.requestVideoFrameCallback(u.videoFrameCallback))}loadVideos(e,t,i,s){for(let r=0;r<e.length;r++)this.loadVideo(e[r],t,i,s)}loadCanvas(e,t={},i){let s=Object.assign({},t);this._parent&&(s=Object.assign(t,this._parent._texturesOptions)),s.loader=this,s.sampler=e.hasAttribute("data-sampler")?e.getAttribute("data-sampler"):s.sampler;const r=new ie(this.renderer,s);this._addElement(e,r,i,null),this._sourceLoaded(e,r,i),this._parent&&this._addToParent(r,e,"canvas")}loadCanvases(e,t,i){for(let s=0;s<e.length;s++)this.loadCanvas(e[s],t,i)}_removeSource(e){const t=this.elements.find(i=>i.texture.uuid===e.uuid);t&&(e.sourceType==="image"?t.source.removeEventListener("load",t.load,!1):e.sourceType==="video"&&(t.videoFrameCallback&&e._videoFrameCallbackID&&t.source.cancelVideoFrameCallback(e._videoFrameCallbackID),t.source.removeEventListener("canplaythrough",t.load,!1),t.source.pause(),t.source.removeAttribute("src"),t.source.load()),t.source.removeEventListener("error",t.error,!1))}}class gt extends mt{constructor(e,t,{sourcesLoaded:i=0,sourcesToLoad:s=0,complete:r=!1,onComplete:o=()=>{}}={}){super(e,t.crossOrigin),this.type="PlaneTextureLoader",this._parent=t,this._parent.type!=="Plane"&&this._parent.type!=="PingPongPlane"&&this._parent.type!=="ShaderPass"&&(p(this.type+": Wrong parent type assigned to this loader"),this._parent=null),this.sourcesLoaded=i,this.sourcesToLoad=s,this.complete=r,this.onComplete=o}_setLoaderSize(e){this.sourcesToLoad=e,this.sourcesToLoad===0&&(this.complete=!0,this.renderer.nextRender.add(()=>this.onComplete&&this.onComplete()))}_increment(){this.sourcesLoaded++,this.sourcesLoaded>=this.sourcesToLoad&&!this.complete&&(this.complete=!0,this.renderer.nextRender.add(()=>this.onComplete&&this.onComplete()))}_addSourceToParent(e,t){if(t==="image"){const i=this._parent.images;!i.find(r=>r.src===e.src)&&i.push(e)}else if(t==="video"){const i=this._parent.videos;!i.find(r=>r.src===e.src)&&i.push(e)}else if(t==="canvas"){const i=this._parent.canvases;!i.find(r=>r.isSameNode(e))&&i.push(e)}}_addToParent(e,t,i){this._addSourceToParent(t,i),this._parent&&e.addParent(this._parent)}}class vt{constructor(e,t="Mesh",{vertexShaderID:i,fragmentShaderID:s,vertexShader:r,fragmentShader:o,uniforms:n={},widthSegments:u=1,heightSegments:l=1,renderOrder:c=0,depthTest:d=!0,cullFace:g="back",texturesOptions:m={},crossOrigin:y="anonymous"}={}){if(this.type=t,e=e&&e.renderer||e,(!e||e.type!=="Renderer")&&(D(this.type+": Curtains not passed as first argument or Curtains Renderer is missing",e),setTimeout(()=>{this._onErrorCallback&&this._onErrorCallback()},0)),this.renderer=e,this.gl=this.renderer.gl,!this.gl){this.renderer.production||D(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined"),setTimeout(()=>{this._onErrorCallback&&this._onErrorCallback()},0);return}this._canDraw=!1,this.renderOrder=c,this._depthTest=d,this.cullFace=g,this.cullFace!=="back"&&this.cullFace!=="front"&&this.cullFace!=="none"&&(this.cullFace="back"),this.textures=[],this._texturesOptions=Object.assign({premultiplyAlpha:!1,anisotropy:1,floatingPoint:"none",wrapS:this.gl.CLAMP_TO_EDGE,wrapT:this.gl.CLAMP_TO_EDGE,minFilter:this.gl.LINEAR,magFilter:this.gl.LINEAR},m),this.crossOrigin=y,!r&&i&&document.getElementById(i)&&(r=document.getElementById(i).innerHTML),!o&&s&&document.getElementById(s)&&(o=document.getElementById(s).innerHTML),this._initMesh(),u=parseInt(u),l=parseInt(l),this._geometry=new dt(this.renderer,{width:u,height:l}),this._program=new Me(this.renderer,{parent:this,vertexShader:r,fragmentShader:o}),this._program.compiled?(this._program.createUniforms(n),this.uniforms=this._program.uniformsManager.uniforms,this._geometry.setProgram(this._program),this.renderer.onSceneChange()):this.renderer.nextRender.add(()=>this._onErrorCallback&&this._onErrorCallback())}_initMesh(){this.uuid=de(),this.loader=new gt(this.renderer,this,{sourcesLoaded:0,initSourcesToLoad:0,complete:!1,onComplete:()=>{this._onReadyCallback&&this._onReadyCallback(),this.renderer.needRender()}}),this.images=[],this.videos=[],this.canvases=[],this.userData={},this._canDraw=!0}_restoreContext(){this._canDraw=!1,this._matrices&&(this._matrices=null),this._program=new Me(this.renderer,{parent:this,vertexShader:this._program.vsCode,fragmentShader:this._program.fsCode}),this._program.compiled&&(this._geometry.restoreContext(this._program),this._program.createUniforms(this.uniforms),this.uniforms=this._program.uniformsManager.uniforms,this._programRestored())}setRenderTarget(e){if(!e||e.type!=="RenderTarget"){this.renderer.production||p(this.type+": Could not set the render target because the argument passed is not a RenderTarget class object",e);return}this.type==="Plane"&&this.renderer.scene.removePlane(this),this.target=e,this.type==="Plane"&&this.renderer.scene.addPlane(this)}setRenderOrder(e=0){e=isNaN(e)?this.renderOrder:parseInt(e),e!==this.renderOrder&&(this.renderOrder=e,this.renderer.scene.setPlaneRenderOrder(this))}createTexture(e={}){const t=new ie(this.renderer,Object.assign(e,this._texturesOptions));return t.addParent(this),t}addTexture(e){if(!e||e.type!=="Texture"){this.renderer.production||p(this.type+": cannot add ",e," to this "+this.type+" because it is not a valid texture");return}e.addParent(this)}loadSources(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadSource(e[r],t,i,s)}loadSource(e,t={},i,s){this.loader.loadSource(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,o)=>{this.renderer.production||p(this.type+": this HTML tag could not be converted into a texture:",r.tagName),s&&s(r,o)})}loadImage(e,t={},i,s){this.loader.loadImage(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,o)=>{this.renderer.production||p(this.type+`: There has been an error:
`,o,`
while loading this image:
`,r),s&&s(r,o)})}loadVideo(e,t={},i,s){this.loader.loadVideo(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,o)=>{this.renderer.production||p(this.type+`: There has been an error:
`,o,`
while loading this video:
`,r),s&&s(r,o)})}loadCanvas(e,t={},i){this.loader.loadCanvas(e,Object.assign(t,this._texturesOptions),s=>{i&&i(s)})}loadImages(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadImage(e[r],t,i,s)}loadVideos(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadVideo(e[r],t,i,s)}loadCanvases(e,t={},i){for(let s=0;s<e.length;s++)this.loadCanvas(e[s],t,i)}playVideos(){for(let e=0;e<this.textures.length;e++){const t=this.textures[e];if(t.sourceType==="video"){const i=t.source.play();i!==void 0&&i.catch(s=>{this.renderer.production||p(this.type+": Could not play the video : ",s)})}}}_draw(){this.renderer.setDepthTest(this._depthTest),this.renderer.setFaceCulling(this.cullFace),this._program.updateUniforms(),this._geometry.bindBuffers(),this.renderer.state.forceBufferUpdate=!1;for(let e=0;e<this.textures.length;e++)if(this.textures[e]._draw(),this.textures[e]._sampler.isActive&&!this.textures[e]._sampler.isTextureBound)return;this._geometry.draw(),this.renderer.state.activeTexture=null,this._onAfterRenderCallback&&this._onAfterRenderCallback()}onError(e){return e&&(this._onErrorCallback=e),this}onLoading(e){return e&&(this._onLoadingCallback=e),this}onReady(e){return e&&(this._onReadyCallback=e),this}onRender(e){return e&&(this._onRenderCallback=e),this}onAfterRender(e){return e&&(this._onAfterRenderCallback=e),this}remove(){this._canDraw=!1,this.target&&this.renderer.bindFrameBuffer(null),this._dispose(),this.type==="Plane"?this.renderer.removePlane(this):this.type==="ShaderPass"&&(this.target&&(this.target._shaderPass=null,this.target.remove(),this.target=null),this.renderer.removeShaderPass(this))}_dispose(){if(this.gl){this._geometry&&this._geometry.dispose(),this.target&&this.type==="ShaderPass"&&(this.renderer.removeRenderTarget(this.target),this.textures.shift());for(let e=0;e<this.textures.length;e++)this.textures[e]._dispose();this.textures=[]}}}const Ee=new f,xt=new f;class _t extends vt{constructor(e,t,i="DOMMesh",{widthSegments:s,heightSegments:r,renderOrder:o,depthTest:n,cullFace:u,uniforms:l,vertexShaderID:c,fragmentShaderID:d,vertexShader:g,fragmentShader:m,texturesOptions:y,crossOrigin:v}={}){c=c||t&&t.getAttribute("data-vs-id"),d=d||t&&t.getAttribute("data-fs-id"),super(e,i,{widthSegments:s,heightSegments:r,renderOrder:o,depthTest:n,cullFace:u,uniforms:l,vertexShaderID:c,fragmentShaderID:d,vertexShader:g,fragmentShader:m,texturesOptions:y,crossOrigin:v}),this.gl&&(this.htmlElement=t,(!this.htmlElement||this.htmlElement.length===0)&&(this.renderer.production||p(this.type+": The HTML element you specified does not currently exists in the DOM")),this._setDocumentSizes())}_setDocumentSizes(){let e=this.htmlElement.getBoundingClientRect();this._boundingRect||(this._boundingRect={}),this._boundingRect.document={width:e.width*this.renderer.pixelRatio,height:e.height*this.renderer.pixelRatio,top:e.top*this.renderer.pixelRatio,left:e.left*this.renderer.pixelRatio}}getBoundingRect(){return{width:this._boundingRect.document.width,height:this._boundingRect.document.height,top:this._boundingRect.document.top,left:this._boundingRect.document.left,right:this._boundingRect.document.left+this._boundingRect.document.width,bottom:this._boundingRect.document.top+this._boundingRect.document.height}}resize(){this._setDocumentSizes(),this.type==="Plane"&&(this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._setWorldSizes(),this._applyWorldPositions());for(let e=0;e<this.textures.length;e++)this.textures[e].resize();this.renderer.nextRender.add(()=>this._onAfterResizeCallback&&this._onAfterResizeCallback())}mouseToPlaneCoords(e){const t=this.scale?this.scale:xt.set(1,1),i=Ee.set((this._boundingRect.document.width-this._boundingRect.document.width*t.x)/2,(this._boundingRect.document.height-this._boundingRect.document.height*t.y)/2),s={width:this._boundingRect.document.width*t.x/this.renderer.pixelRatio,height:this._boundingRect.document.height*t.y/this.renderer.pixelRatio,top:(this._boundingRect.document.top+i.y)/this.renderer.pixelRatio,left:(this._boundingRect.document.left+i.x)/this.renderer.pixelRatio};return Ee.set((e.x-s.left)/s.width*2-1,1-(e.y-s.top)/s.height*2)}onAfterResize(e){return e&&(this._onAfterResizeCallback=e),this}}class yt{constructor({fov:e=50,near:t=.1,far:i=150,width:s,height:r,pixelRatio:o=1}={}){this.position=new _,this.projectionMatrix=new K,this.worldMatrix=new K,this.viewMatrix=new K,this._shouldUpdate=!1,this.setSize(),this.setPerspective(e,t,i,s,r,o)}setFov(e){e=isNaN(e)?this.fov:parseFloat(e),e=Math.max(1,Math.min(e,179)),e!==this.fov&&(this.fov=e,this.setPosition(),this._shouldUpdate=!0),this.setCSSPerspective()}setNear(e){e=isNaN(e)?this.near:parseFloat(e),e=Math.max(e,.01),e!==this.near&&(this.near=e,this._shouldUpdate=!0)}setFar(e){e=isNaN(e)?this.far:parseFloat(e),e=Math.max(e,50),e!==this.far&&(this.far=e,this._shouldUpdate=!0)}setPixelRatio(e){e!==this.pixelRatio&&(this._shouldUpdate=!0),this.pixelRatio=e}setSize(e,t){(e!==this.width||t!==this.height)&&(this._shouldUpdate=!0),this.width=e,this.height=t}setPerspective(e,t,i,s,r,o){this.setPixelRatio(o),this.setSize(s,r),this.setFov(e),this.setNear(t),this.setFar(i),this._shouldUpdate&&this.updateProjectionMatrix()}setPosition(){this.position.set(0,0,1),this.worldMatrix.setFromArray([1,0,0,0,0,1,0,0,0,0,1,0,this.position.x,this.position.y,this.position.z,1]),this.viewMatrix=this.viewMatrix.copy(this.worldMatrix).getInverse()}setCSSPerspective(){this.CSSPerspective=Math.pow(Math.pow(this.width/(2*this.pixelRatio),2)+Math.pow(this.height/(2*this.pixelRatio),2),.5)/Math.tan(this.fov*.5*Math.PI/180)}getScreenRatiosFromFov(e=0){const t=this.position.z;e<t?e-=t:e+=t;const i=this.fov*Math.PI/180,s=2*Math.tan(i/2)*Math.abs(e);return{width:s*this.width/this.height,height:s}}updateProjectionMatrix(){const e=this.width/this.height,t=this.near*Math.tan(Math.PI/180*.5*this.fov),i=2*t,s=e*i,r=-.5*s,o=r+s,n=t-i,u=2*this.near/(o-r),l=2*this.near/(t-n),c=(o+r)/(o-r),d=(t+n)/(t-n),g=-(this.far+this.near)/(this.far-this.near),m=-2*this.far*this.near/(this.far-this.near);this.projectionMatrix.setFromArray([u,0,0,0,0,l,0,0,c,d,g,-1,0,0,m,0])}forceUpdate(){this._shouldUpdate=!0}cancelUpdate(){this._shouldUpdate=!1}}class le{constructor(e=new Float32Array([0,0,0,1]),t="XYZ"){this.type="Quat",this.elements=e,this.axisOrder=t}setFromArray(e){return this.elements[0]=e[0],this.elements[1]=e[1],this.elements[2]=e[2],this.elements[3]=e[3],this}setAxisOrder(e){switch(e=e.toUpperCase(),e){case"XYZ":case"YXZ":case"ZXY":case"ZYX":case"YZX":case"XZY":this.axisOrder=e;break;default:this.axisOrder="XYZ"}return this}copy(e){return this.elements=e.elements,this.axisOrder=e.axisOrder,this}clone(){return new le().copy(this)}equals(e){return this.elements[0]===e.elements[0]&&this.elements[1]===e.elements[1]&&this.elements[2]===e.elements[2]&&this.elements[3]===e.elements[3]&&this.axisOrder===e.axisOrder}setFromVec3(e){const t=e.x*.5,i=e.y*.5,s=e.z*.5,r=Math.cos(t),o=Math.cos(i),n=Math.cos(s),u=Math.sin(t),l=Math.sin(i),c=Math.sin(s);return this.axisOrder==="XYZ"?(this.elements[0]=u*o*n+r*l*c,this.elements[1]=r*l*n-u*o*c,this.elements[2]=r*o*c+u*l*n,this.elements[3]=r*o*n-u*l*c):this.axisOrder==="YXZ"?(this.elements[0]=u*o*n+r*l*c,this.elements[1]=r*l*n-u*o*c,this.elements[2]=r*o*c-u*l*n,this.elements[3]=r*o*n+u*l*c):this.axisOrder==="ZXY"?(this.elements[0]=u*o*n-r*l*c,this.elements[1]=r*l*n+u*o*c,this.elements[2]=r*o*c+u*l*n,this.elements[3]=r*o*n-u*l*c):this.axisOrder==="ZYX"?(this.elements[0]=u*o*n-r*l*c,this.elements[1]=r*l*n+u*o*c,this.elements[2]=r*o*c-u*l*n,this.elements[3]=r*o*n+u*l*c):this.axisOrder==="YZX"?(this.elements[0]=u*o*n+r*l*c,this.elements[1]=r*l*n+u*o*c,this.elements[2]=r*o*c-u*l*n,this.elements[3]=r*o*n-u*l*c):this.axisOrder==="XZY"&&(this.elements[0]=u*o*n-r*l*c,this.elements[1]=r*l*n-u*o*c,this.elements[2]=r*o*c+u*l*n,this.elements[3]=r*o*n+u*l*c),this}}const bt=new f,Tt=new _,Pt=new _,wt=new _,St=new _,Ct=new _,Rt=new _,X=new _,W=new _,ke=new le,At=new _(.5,.5,0),Mt=new _,Et=new _,kt=new _,Lt=new _,Ft=new f;class Le extends _t{constructor(e,t,{widthSegments:i,heightSegments:s,renderOrder:r,depthTest:o,cullFace:n,uniforms:u,vertexShaderID:l,fragmentShaderID:c,vertexShader:d,fragmentShader:g,texturesOptions:m,crossOrigin:y,alwaysDraw:v=!1,visible:b=!0,transparent:x=!1,drawCheckMargins:P={top:0,right:0,bottom:0,left:0},autoloadSources:M=!0,watchScroll:k=!0,fov:L=50}={}){super(e,t,"Plane",{widthSegments:i,heightSegments:s,renderOrder:r,depthTest:o,cullFace:n,uniforms:u,vertexShaderID:l,fragmentShaderID:c,vertexShader:d,fragmentShader:g,texturesOptions:m,crossOrigin:y}),this.gl&&(this.index=this.renderer.planes.length,this.target=null,this.alwaysDraw=v,this._shouldDraw=!0,this.visible=b,this._transparent=x,this.drawCheckMargins=P,this.autoloadSources=M,this.watchScroll=k,this._updateMVMatrix=!1,this.camera=new yt({fov:L,width:this.renderer._boundingRect.width,height:this.renderer._boundingRect.height,pixelRatio:this.renderer.pixelRatio}),this._program.compiled&&(this._initPlane(),this.renderer.scene.addPlane(this),this.renderer.planes.push(this)))}_programRestored(){this.target&&this.setRenderTarget(this.renderer.renderTargets[this.target.index]),this._initMatrices(),this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._setWorldSizes(),this._applyWorldPositions(),this.renderer.scene.addPlane(this);for(let e=0;e<this.textures.length;e++)this.textures[e]._parent=this,this.textures[e]._restoreContext();this._canDraw=!0}_initPlane(){this._initTransformValues(),this._initPositions(),this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._initSources()}_initTransformValues(){this.rotation=new _,this.rotation.onChange(()=>this._applyRotation()),this.quaternion=new le,this.relativeTranslation=new _,this.relativeTranslation.onChange(()=>this._setTranslation()),this._translation=new _,this.scale=new _(1),this.scale.onChange(()=>{this.scale.z=1,this._applyScale()}),this.transformOrigin=new _(.5,.5,0),this.transformOrigin.onChange(()=>{this._setWorldTransformOrigin(),this._updateMVMatrix=!0})}resetPlane(e){this._initTransformValues(),this._setWorldTransformOrigin(),e!==null&&e?(this.htmlElement=e,this.resize()):!e&&!this.renderer.production&&p(this.type+": You are trying to reset a plane with a HTML element that does not exist. The old HTML element will be kept instead.")}removeRenderTarget(){this.target&&(this.renderer.scene.removePlane(this),this.target=null,this.renderer.scene.addPlane(this))}_initPositions(){this._initMatrices(),this._setWorldSizes(),this._applyWorldPositions()}_initMatrices(){const e=new K;this._matrices={world:{matrix:e},modelView:{name:"uMVMatrix",matrix:e,location:this.gl.getUniformLocation(this._program.program,"uMVMatrix")},projection:{name:"uPMatrix",matrix:e,location:this.gl.getUniformLocation(this._program.program,"uPMatrix")},modelViewProjection:{matrix:e}}}_setPerspectiveMatrix(){this.camera._shouldUpdate&&(this.renderer.useProgram(this._program),this.gl.uniformMatrix4fv(this._matrices.projection.location,!1,this._matrices.projection.matrix.elements)),this.camera.cancelUpdate()}setPerspective(e,t,i){this.camera.setPerspective(e,t,i,this.renderer._boundingRect.width,this.renderer._boundingRect.height,this.renderer.pixelRatio),this.renderer.state.isContextLost&&this.camera.forceUpdate(),this._matrices.projection.matrix=this.camera.projectionMatrix,this.camera._shouldUpdate&&(this._setWorldSizes(),this._applyWorldPositions(),this._translation.z=this.relativeTranslation.z/this.camera.CSSPerspective),this._updateMVMatrix=this.camera._shouldUpdate}_setMVMatrix(){this._updateMVMatrix&&(this._matrices.world.matrix=this._matrices.world.matrix.composeFromOrigin(this._translation,this.quaternion,this.scale,this._boundingRect.world.transformOrigin),this._matrices.world.matrix.scale({x:this._boundingRect.world.width,y:this._boundingRect.world.height,z:1}),this._matrices.modelView.matrix.copy(this._matrices.world.matrix),this._matrices.modelView.matrix.elements[14]-=this.camera.position.z,this._matrices.modelViewProjection.matrix=this._matrices.projection.matrix.multiply(this._matrices.modelView.matrix),this.alwaysDraw||this._shouldDrawCheck(),this.renderer.useProgram(this._program),this.gl.uniformMatrix4fv(this._matrices.modelView.location,!1,this._matrices.modelView.matrix.elements)),this._updateMVMatrix=!1}_setWorldTransformOrigin(){this._boundingRect.world.transformOrigin=new _((this.transformOrigin.x*2-1)*this._boundingRect.world.width,-(this.transformOrigin.y*2-1)*this._boundingRect.world.height,this.transformOrigin.z)}_documentToWorldSpace(e){return Pt.set(e.x*this.renderer.pixelRatio/this.renderer._boundingRect.width*this._boundingRect.world.ratios.width,-(e.y*this.renderer.pixelRatio/this.renderer._boundingRect.height)*this._boundingRect.world.ratios.height,e.z)}_setWorldSizes(){const e=this.camera.getScreenRatiosFromFov();this._boundingRect.world={width:this._boundingRect.document.width/this.renderer._boundingRect.width*e.width/2,height:this._boundingRect.document.height/this.renderer._boundingRect.height*e.height/2,ratios:e},this._setWorldTransformOrigin()}_setWorldPosition(){const e={x:this._boundingRect.document.width/2+this._boundingRect.document.left,y:this._boundingRect.document.height/2+this._boundingRect.document.top},t={x:this.renderer._boundingRect.width/2+this.renderer._boundingRect.left,y:this.renderer._boundingRect.height/2+this.renderer._boundingRect.top};this._boundingRect.world.top=(t.y-e.y)/this.renderer._boundingRect.height*this._boundingRect.world.ratios.height,this._boundingRect.world.left=(e.x-t.x)/this.renderer._boundingRect.width*this._boundingRect.world.ratios.width}setScale(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set scale because the parameter passed is not of Vec2 type:",e);return}e.sanitizeNaNValuesWith(this.scale).max(bt.set(.001,.001)),(e.x!==this.scale.x||e.y!==this.scale.y)&&(this.scale.set(e.x,e.y,1),this._applyScale())}_applyScale(){for(let e=0;e<this.textures.length;e++)this.textures[e].resize();this._updateMVMatrix=!0}setRotation(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set rotation because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.rotation),e.equals(this.rotation)||(this.rotation.copy(e),this._applyRotation())}_applyRotation(){this.quaternion.setFromVec3(this.rotation),this._updateMVMatrix=!0}setTransformOrigin(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set transform origin because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.transformOrigin),e.equals(this.transformOrigin)||(this.transformOrigin.copy(e),this._setWorldTransformOrigin(),this._updateMVMatrix=!0)}_setTranslation(){let e=Tt.set(0,0,0);this.relativeTranslation.equals(e)||(e=this._documentToWorldSpace(this.relativeTranslation)),this._translation.set(this._boundingRect.world.left+e.x,this._boundingRect.world.top+e.y,this.relativeTranslation.z/this.camera.CSSPerspective),this._updateMVMatrix=!0}setRelativeTranslation(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set translation because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.relativeTranslation),e.equals(this.relativeTranslation)||(this.relativeTranslation.copy(e),this._setTranslation())}_applyWorldPositions(){this._setWorldPosition(),this._setTranslation()}updatePosition(){this._setDocumentSizes(),this._applyWorldPositions()}updateScrollPosition(e,t){(e||t)&&(this._boundingRect.document.top+=t*this.renderer.pixelRatio,this._boundingRect.document.left+=e*this.renderer.pixelRatio,this._applyWorldPositions())}_getIntersection(e,t){let i=t.clone().sub(e),s=e.clone();for(;s.z>-1;)s.add(i);return s}_getNearPlaneIntersections(e,t,i){const s=this._matrices.modelViewProjection.matrix;if(i.length===1)i[0]===0?(t[0]=this._getIntersection(t[1],X.set(.95,1,0).applyMat4(s)),t.push(this._getIntersection(t[3],W.set(-1,-.95,0).applyMat4(s)))):i[0]===1?(t[1]=this._getIntersection(t[0],X.set(-.95,1,0).applyMat4(s)),t.push(this._getIntersection(t[2],W.set(1,-.95,0).applyMat4(s)))):i[0]===2?(t[2]=this._getIntersection(t[3],X.set(-.95,-1,0).applyMat4(s)),t.push(this._getIntersection(t[1],W.set(1,.95,0).applyMat4(s)))):i[0]===3&&(t[3]=this._getIntersection(t[2],X.set(.95,-1,0).applyMat4(s)),t.push(this._getIntersection(t[0],W.set(-1,.95,0).applyMat4(s))));else if(i.length===2)i[0]===0&&i[1]===1?(t[0]=this._getIntersection(t[3],X.set(-1,-.95,0).applyMat4(s)),t[1]=this._getIntersection(t[2],W.set(1,-.95,0).applyMat4(s))):i[0]===1&&i[1]===2?(t[1]=this._getIntersection(t[0],X.set(-.95,1,0).applyMat4(s)),t[2]=this._getIntersection(t[3],W.set(-.95,-1,0).applyMat4(s))):i[0]===2&&i[1]===3?(t[2]=this._getIntersection(t[1],X.set(1,.95,0).applyMat4(s)),t[3]=this._getIntersection(t[0],W.set(-1,.95,0).applyMat4(s))):i[0]===0&&i[1]===3&&(t[0]=this._getIntersection(t[1],X.set(.95,1,0).applyMat4(s)),t[3]=this._getIntersection(t[2],W.set(.95,-1,0).applyMat4(s)));else if(i.length===3){let r=0;for(let o=0;o<e.length;o++)i.includes(o)||(r=o);t=[t[r]],r===0?(t.push(this._getIntersection(t[0],X.set(-.95,1,0).applyMat4(s))),t.push(this._getIntersection(t[0],W.set(-1,.95,0).applyMat4(s)))):r===1?(t.push(this._getIntersection(t[0],X.set(.95,1,0).applyMat4(s))),t.push(this._getIntersection(t[0],W.set(1,.95,0).applyMat4(s)))):r===2?(t.push(this._getIntersection(t[0],X.set(.95,-1,0).applyMat4(s))),t.push(this._getIntersection(t[0],W.set(1,-.95,0).applyMat4(s)))):r===3&&(t.push(this._getIntersection(t[0],X.set(-.95,-1,0).applyMat4(s))),t.push(this._getIntersection(t[0],W.set(-1-.95,0).applyMat4(s))))}else for(let r=0;r<e.length;r++)t[r][0]=1e4,t[r][1]=1e4;return t}_getWorldCoords(){const e=[wt.set(-1,1,0),St.set(1,1,0),Ct.set(1,-1,0),Rt.set(-1,-1,0)];let t=[],i=[];for(let u=0;u<e.length;u++){const l=e[u].applyMat4(this._matrices.modelViewProjection.matrix);t.push(l),Math.abs(l.z)>1&&i.push(u)}i.length&&(t=this._getNearPlaneIntersections(e,t,i));let s=1/0,r=-1/0,o=1/0,n=-1/0;for(let u=0;u<t.length;u++){const l=t[u];l.x<s&&(s=l.x),l.x>r&&(r=l.x),l.y<o&&(o=l.y),l.y>n&&(n=l.y)}return{top:n,right:r,bottom:o,left:s}}_computeWebGLBoundingRect(){const e=this._getWorldCoords();let t={top:1-(e.top+1)/2,right:(e.right+1)/2,bottom:1-(e.bottom+1)/2,left:(e.left+1)/2};t.width=t.right-t.left,t.height=t.bottom-t.top,this._boundingRect.worldToDocument={width:t.width*this.renderer._boundingRect.width,height:t.height*this.renderer._boundingRect.height,top:t.top*this.renderer._boundingRect.height+this.renderer._boundingRect.top,left:t.left*this.renderer._boundingRect.width+this.renderer._boundingRect.left,right:t.left*this.renderer._boundingRect.width+this.renderer._boundingRect.left+t.width*this.renderer._boundingRect.width,bottom:t.top*this.renderer._boundingRect.height+this.renderer._boundingRect.top+t.height*this.renderer._boundingRect.height}}getWebGLBoundingRect(){if(this._matrices.modelViewProjection)(!this._boundingRect.worldToDocument||this.alwaysDraw)&&this._computeWebGLBoundingRect();else return this._boundingRect.document;return this._boundingRect.worldToDocument}_getWebGLDrawRect(){return this._computeWebGLBoundingRect(),{top:this._boundingRect.worldToDocument.top-this.drawCheckMargins.top,right:this._boundingRect.worldToDocument.right+this.drawCheckMargins.right,bottom:this._boundingRect.worldToDocument.bottom+this.drawCheckMargins.bottom,left:this._boundingRect.worldToDocument.left-this.drawCheckMargins.left}}_shouldDrawCheck(){const e=this._getWebGLDrawRect();Math.round(e.right)<=this.renderer._boundingRect.left||Math.round(e.left)>=this.renderer._boundingRect.left+this.renderer._boundingRect.width||Math.round(e.bottom)<=this.renderer._boundingRect.top||Math.round(e.top)>=this.renderer._boundingRect.top+this.renderer._boundingRect.height?this._shouldDraw&&(this._shouldDraw=!1,this.renderer.nextRender.add(()=>this._onLeaveViewCallback&&this._onLeaveViewCallback())):(this._shouldDraw||this.renderer.nextRender.add(()=>this._onReEnterViewCallback&&this._onReEnterViewCallback()),this._shouldDraw=!0)}isDrawn(){return this._canDraw&&this.visible&&(this._shouldDraw||this.alwaysDraw)}enableDepthTest(e){this._depthTest=e}_initSources(){let e=0;if(this.autoloadSources){const t=this.htmlElement.getElementsByTagName("img"),i=this.htmlElement.getElementsByTagName("video"),s=this.htmlElement.getElementsByTagName("canvas");t.length&&this.loadImages(t),i.length&&this.loadVideos(i),s.length&&this.loadCanvases(s),e=t.length+i.length+s.length}this.loader._setLoaderSize(e),this._canDraw=!0}_startDrawing(){this._canDraw&&(this._onRenderCallback&&this._onRenderCallback(),this.target?this.renderer.bindFrameBuffer(this.target):this.renderer.state.scenePassIndex===null&&this.renderer.bindFrameBuffer(null),this._setPerspectiveMatrix(),this._setMVMatrix(),(this.alwaysDraw||this._shouldDraw)&&this.visible&&this._draw())}mouseToPlaneCoords(e){if(ke.setAxisOrder(this.quaternion.axisOrder),ke.equals(this.quaternion)&&At.equals(this.transformOrigin))return super.mouseToPlaneCoords(e);{const t={x:2*(e.x/(this.renderer._boundingRect.width/this.renderer.pixelRatio))-1,y:2*(1-e.y/(this.renderer._boundingRect.height/this.renderer.pixelRatio))-1},i=this.camera.position.clone(),s=Mt.set(t.x,t.y,-.5);s.unproject(this.camera),s.sub(i).normalize();const r=Et.set(0,0,-1);r.applyQuat(this.quaternion).normalize();const o=Lt.set(0,0,0),n=r.dot(s);if(Math.abs(n)>=1e-4){const u=this._matrices.world.matrix.getInverse().multiply(this.camera.viewMatrix),l=this._boundingRect.world.transformOrigin.clone().add(this._translation),c=kt.set(this._translation.x-l.x,this._translation.y-l.y,this._translation.z-l.z);c.applyQuat(this.quaternion),l.add(c);const d=r.dot(l.clone().sub(i))/n;o.copy(i.add(s.multiplyScalar(d))),o.applyMat4(u)}else o.set(1/0,1/0,1/0);return Ft.set(o.x,o.y)}}onReEnterView(e){return e&&(this._onReEnterViewCallback=e),this}onLeaveView(e){return e&&(this._onLeaveViewCallback=e),this}}class pe{constructor(e,{shaderPass:t,depth:i=!1,clear:s=!0,maxWidth:r,maxHeight:o,minWidth:n=1024,minHeight:u=1024,texturesOptions:l={}}={}){if(this.type="RenderTarget",e=e&&e.renderer||e,!e||e.type!=="Renderer")D(this.type+": Renderer not passed as first argument",e);else if(!e.gl){e.production||D(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined");return}this.renderer=e,this.gl=this.renderer.gl,this.index=this.renderer.renderTargets.length,this._shaderPass=t,this._depth=i,this._shouldClear=s,this._maxSize={width:r?Math.min(this.renderer.state.maxTextureSize/4,r):this.renderer.state.maxTextureSize/4,height:o?Math.min(this.renderer.state.maxTextureSize/4,o):this.renderer.state.maxTextureSize/4},this._minSize={width:n*this.renderer.pixelRatio,height:u*this.renderer.pixelRatio},l=Object.assign({sampler:"uRenderTexture",isFBOTexture:!0,premultiplyAlpha:!1,anisotropy:1,generateMipmap:!1,floatingPoint:"none",wrapS:this.gl.CLAMP_TO_EDGE,wrapT:this.gl.CLAMP_TO_EDGE,minFilter:this.gl.LINEAR,magFilter:this.gl.LINEAR},l),this._texturesOptions=l,this.userData={},this.uuid=de(),this.renderer.renderTargets.push(this),this.renderer.onSceneChange(),this._initRenderTarget()}_initRenderTarget(){this._setSize(),this.textures=[],this._createFrameBuffer()}_restoreContext(){this._setSize(),this._createFrameBuffer()}_setSize(){this._shaderPass&&this._shaderPass._isScenePass?this._size={width:this.renderer._boundingRect.width,height:this.renderer._boundingRect.height}:this._size={width:Math.min(this._maxSize.width,Math.max(this._minSize.width,this.renderer._boundingRect.width)),height:Math.min(this._maxSize.height,Math.max(this._minSize.height,this.renderer._boundingRect.height))}}resize(){this._shaderPass&&(this._setSize(),this.textures[0].resize(),this.renderer.bindFrameBuffer(this,!0),this._depth&&this._bindDepthBuffer(),this.renderer.bindFrameBuffer(null))}_bindDepthBuffer(){this._depthBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this._depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,this._size.width,this._size.height),this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this._depthBuffer))}_createFrameBuffer(){this._frameBuffer=this.gl.createFramebuffer(),this.renderer.bindFrameBuffer(this,!0),this.textures.length?(this.textures[0]._parent=this,this.textures[0]._restoreContext()):new ie(this.renderer,this._texturesOptions).addParent(this),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.textures[0]._sampler.texture,0),this._depth&&(this._depthBuffer=this.gl.createRenderbuffer(),this._bindDepthBuffer()),this.renderer.bindFrameBuffer(null)}getTexture(){return this.textures[0]}remove(){if(this._shaderPass){this.renderer.production||p(this.type+": You're trying to remove a RenderTarget attached to a ShaderPass. You should remove that ShaderPass instead:",this._shaderPass);return}this._dispose(),this.renderer.removeRenderTarget(this)}_dispose(){this._frameBuffer&&(this.gl.deleteFramebuffer(this._frameBuffer),this._frameBuffer=null),this._depthBuffer&&(this.gl.deleteRenderbuffer(this._depthBuffer),this._depthBuffer=null),this.textures[0]._dispose(),this.textures=[]}}class Dt extends Le{constructor(e,t,{sampler:i="uPingPongTexture",widthSegments:s,heightSegments:r,renderOrder:o,depthTest:n,cullFace:u,uniforms:l,vertexShaderID:c,fragmentShaderID:d,vertexShader:g,fragmentShader:m,texturesOptions:y,crossOrigin:v,alwaysDraw:b,visible:x,transparent:P,drawCheckMargins:M,autoloadSources:k,watchScroll:L,fov:E}={}){if(n=!1,k=!1,super(e,t,{widthSegments:s,heightSegments:r,renderOrder:o,depthTest:n,cullFace:u,uniforms:l,vertexShaderID:c,fragmentShaderID:d,vertexShader:g,fragmentShader:m,texturesOptions:y,crossOrigin:v,alwaysDraw:b,visible:x,transparent:P,drawCheckMargins:M,autoloadSources:k,watchScroll:L,fov:E}),!this.gl)return;this.renderer.scene.removePlane(this),this.type="PingPongPlane",this.renderer.scene.addPlane(this),this.readPass=new pe(e,{depth:!1,clear:!1,texturesOptions:y}),this.writePass=new pe(e,{depth:!1,clear:!1,texturesOptions:y}),this.createTexture({sampler:i});let R=0;this.readPass.getTexture().onSourceUploaded(()=>{R++,this._checkIfReady(R)}),this.writePass.getTexture().onSourceUploaded(()=>{R++,this._checkIfReady(R)}),this.setRenderTarget(this.readPass),this._onRenderCallback=()=>{this.readPass&&this.writePass&&this.textures[0]&&this.textures[0]._uploaded&&this.setRenderTarget(this.writePass),this._onPingPongRenderCallback&&this._onPingPongRenderCallback()},this._onAfterRenderCallback=()=>{this.readPass&&this.writePass&&this.textures[0]&&this.textures[0]._uploaded&&this._swapPasses(),this._onPingPongAfterRenderCallback&&this._onPingPongAfterRenderCallback()}}_checkIfReady(e){e===2&&this.renderer.nextRender.add(()=>{this.textures[0].copy(this.target.getTexture())})}_swapPasses(){const e=this.readPass;this.readPass=this.writePass,this.writePass=e,this.textures[0].copy(this.readPass.getTexture())}getTexture(){return this.textures[0]}onRender(e){return e&&(this._onPingPongRenderCallback=e),this}onAfterRender(e){return e&&(this._onPingPongAfterRenderCallback=e),this}remove(){this.target=null,this.renderer.bindFrameBuffer(null),this.writePass&&(this.writePass.remove(),this.writePass=null),this.readPass&&(this.readPass.remove(),this.readPass=null),super.remove()}}const zt=(a,e)=>{const t=a[0]/a[1],i=Math.sqrt(t*(3e5*(e||1)));return[i,i/t]},O=(a,e)=>{const t=zt(e),i=t[0]/t[1]>1?4:t[0]/t[1]<1?6:4,r=14/Math.max(...e),o=e.map(n=>Math.round(n*r));return{name:a,dimensions:t.map(n=>Math.round(n)),scaleRatio:e[0]/t[0],realDimensions:e,placeholderPadding:`calc(${e[1]/e[0]*100/i}% - 2rem)`,aspectRatio:e[0]/e[1],iconDimensions:o}};O("iPhone 11 Pro",[375,812]),O("Instagram Story",[1080,1920]),O("Tabloid",[792,1224]),O("A4",[595,842]),O("Letter",[612,792]),O("Square",[1080,1080]),O("iPad",[1024,768]),O("Slide 4:3",[1024,768]),O("Desktop",[1440,1024]),O("Macbbook Pro",[1440,900]),O("Twitter post",[1200,675]),O("iMac",[1280,720]),O("Slide 16:9",[1920,1080]),O("Twitter header",[1500,500]),O("Window",[window.innerWidth,window.innerHeight]);const It={red:["#50000a","#690010","#8B0018","#AE0020","#D10029","#F50032","#FF5458","#FF8480","#FFAAA5","#FFCCC8","#FFE4E2"],orange:["#441700","#5A2200","#772F00","#953D00","#B34B00","#D35A00","#F36900","#FF894D","#FFAE87","#FFCEB7","#FFEDE4"],amber:["#392100","#4B2E00","#643F00","#7D5100","#986300","#B37500","#CE8800","#EA9B01","#FFB341","#FFD198","#FFEED9"],gold:["#2f2700","#403400","#564700","#6D5A00","#846E00","#9C8200","#B49700","#CDAC00","#E6C100","#FFD820","#FFF1BD"],lime:["#1f2d00","#2B3C00","#3B5100","#4B6700","#5C7D00","#6D9300","#7FAA00","#91C200","#A3DA00","#B6F200","#DEFFAB"],green:["#013017","#034121","#05572E","#086E3C","#0B854A","#0E9D58","#10B667","#12CF76","#14E885","#53FF9D","#CEFFDD"],mint:["#002e2c","#003E3B","#00544F","#006A64","#00817A","#009890","#00B0A7","#00C8BE","#00E1D6","#00FAEE","#C2FFF9"],cyan:["#002c3b","#003B4F","#00506A","#006585","#007AA0","#0090BD","#00A7DA","#00BEF8","#6BD2FF","#ABE4FF","#E0F5FF"],blue:["#002651","#00346A","#00478C","#005AAF","#006DD3","#0081F7","#459AFF","#73B1FF","#9CC7FF","#C2DDFF","#E8F2FF"],ultramarine:["#1b0c70","#251392","#331DBF","#4229EA","#5150F7","#6570FC","#7D8DFD","#97A7FE","#B3C0FE","#CFD8FE","#EDF0FF"],violet:["#320065","#420084","#5900AD","#7001D7","#8712FF","#9555FF","#A57AFF","#B69AFF","#C9B7FF","#DDD3FF","#F2EEFF"],purple:["#41004c","#560064","#730085","#8F00A6","#AD00C8","#CC00EA","#E13EFF","#E978FF","#F0A2FF","#F6C7FF","#FCEAFF"],magenta:["#4a0035","#610046","#81005D","#A10075","#C2008E","#E400A7","#FF2EBE","#FF75CA","#FFA1D8","#FFC7E6","#FFEAF5"]},se={NORMAL:"Normal",ADD:"Add",SUBTRACT:"Subtract",MULTIPLY:"Multiply",SCREEN:"Screen",OVERLAY:"Overlay",DARKEN:"Darken",LIGHTEN:"Lighten",COLOR_DODGE:"Color dodge",COLOR_BURN:"Color burn",LINEAR_BURN:"Linear burn",HARD_LIGHT:"Hard light",SOFT_LIGHT:"Soft light",DIFFERENCE:"Difference",EXCLUSION:"Exclusion",LINEAR_LIGHT:"Linear light",PIN_LIGHT:"Pin light",VIVID_LIGHT:"Vivid light"},Z=(a,e)=>(a=Math.ceil(a),e=Math.floor(e),Math.floor(Math.random()*(e-a))+a),Ot=()=>{var a=new Date().getTime(),e=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var i=Math.random()*16;return a>0?(i=(a+i)%16|0,a=Math.floor(a/16)):(i=(e+i)%16|0,e=Math.floor(e/16)),(t==="x"?i:i&3|8).toString(16)})},ue=(a,e,t)=>a*(1-t)+e*t,Fe=(a,e,t,i)=>Math.sqrt(Math.pow(a-t,2)+Math.pow(e-i,2)),Bt=(a,e,t,i)=>(i-t)/(e-a);function Vt(a){return a.map((e,t)=>t>0?Math.sqrt(Math.pow(e[0]-a[t-1][0],2)+Math.pow(e[1]-a[t-1][1],2)):0).reduce((e,t)=>e+t)}const Nt=(a,e)=>{const t=[a[0]],i=a.length-1;let s=0;for(let r=1;r<i;r++){const o=Fe(a[r][0],a[r][1],a[r-1][0],a[r-1][1]);o<=e/2?s<e/2?s+=o:(t.push([ue(a[r-1][0],a[r][0],.5),ue(a[r-1][1],a[r][1],.5)]),s=0):t.push([ue(a[r-1][0],a[r][0],.5),ue(a[r-1][1],a[r][1],.5)])}return t.push(a[i]),t},Ut=(a,e)=>{const t=Vt(a),i=Math.floor(t/e),s=[a[0]];function r(o){let n=1,u=0;for(;a[n+1]&&u<o*e;)u+=Fe(a[n][0],a[n][1],a[n-1][0],a[n-1][1]),n++;return a[n]}for(let o=0;o<i;o++){const n=r(o),u=Bt(s[o][0],n[0],s[o][1],n[1])||0,l=Math.atan(u),c={x:s[o][0]<=n[0]?1:-1,y:s[o][1]<=n[1]?1:-1};s.push([+(c.x*Math.abs(Math.cos(l))*e+s[o][0]).toFixed(1),+(c.y*Math.abs(Math.sin(l))*e+s[o][1]).toFixed(1)])}return s},De=(a,e)=>{const t=Math.max(1.5,e/500*4);return Ut(Nt(a,t),t)},S="none",ze={NORMAL:"src",ADD:"src + dst",SUBTRACT:"src - dst",MULTIPLY:"src * dst",SCREEN:"1. - (1. - src) * (1. - dst)",OVERLAY:"vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)))",DARKEN:"min(src, dst)",LIGHTEN:"max(src, dst)",COLOR_DODGE:"vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)))",COLOR_BURN:"vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)))",LINEAR_BURN:"(src + dst) - 1.0",HARD_LIGHT:"vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)),  (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)))",SOFT_LIGHT:"vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))))",DIFFERENCE:"abs(dst - src)",EXCLUSION:"src + dst - 2.0 * src * dst",LINEAR_LIGHT:"2.0 * src + dst - 1.0",PIN_LIGHT:"vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z))",VIDID_LIGHT:"vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))))"};let Ie="";Object.keys(ze).forEach((a,e)=>{Ie+=`
    if(blendMode == ${e}.) {
      return ${ze[a]};
    }
  `});const he=`
  vec3 blend (float blendMode, vec3 src, vec3 dst) {
    ${Ie} 
  }
`,T=`
  uniform sampler2D uMaskTexture;
  uniform float uIsMask;
  uniform float uAspectRatio;
  uniform vec2 uMousePos;
  uniform vec2 uResolution;
`,w={aspectRatio:{name:"uAspectRatio",type:"1f",value:1},isMask:{name:"uIsMask",type:"1f",value:0},mousePos:{name:"uMousePos",type:"2f",value:new f(.5)},resolution:{name:"uResolution",type:"2f",value:new f(1080)}},C=a=>`
  fragColor = ${a} * (uIsMask == 1. ? texture(uMaskTexture, uv).a : 1.);
`,A=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}`,Gt=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
}`,Xt=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
}`,Wt=`
  // CC0 license https://creativecommons.org/share-your-work/public-domain/cc0/
  // Borrowed from Stefan Gustavson's noise code

  vec4 permute(vec4 t) {
      return t * (t * 34.0 + 133.0);
  }

  // Gradient set is a normalized expanded rhombic dodecahedron
  vec3 grad(float hash) {
      
      // Random vertex of a cube, +/- 1 each
      vec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;
      
      // Random edge of the three edges connected to that vertex
      // Also a cuboctahedral vertex
      // And corresponds to the face of its dual, the rhombic dodecahedron
      vec3 cuboct = cube;
      cuboct[int(hash / 16.0)] = 0.0;
      
      // In a funky way, pick one of the four points on the rhombic face
      float type = mod(floor(hash / 8.0), 2.0);
      vec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));
      
      // Expand it so that the new edges are the same length
      // as the existing ones
      vec3 grad = cuboct * 1.22474487139 + rhomb;
      
      // To make all gradients the same length, we only need to shorten the
      // second type of vector. We also put in the whole noise scale constant.
      // The compiler should reduce it into the existing floats. I think.
      grad *= (1.0 - 0.042942436724648037 * type) * 3.5946317686139184;
      
      return grad;
  }

  // BCC lattice split up into 2 cube lattices
  vec4 bccNoiseDerivativesPart(vec3 X) {
      vec3 b = floor(X);
      vec4 i4 = vec4(X - b, 2.5);
      
      // Pick between each pair of oppposite corners in the cube.
      vec3 v1 = b + floor(dot(i4, vec4(.25)));
      vec3 v2 = b + vec3(1, 0, 0) + vec3(-1, 1, 1) * floor(dot(i4, vec4(-.25, .25, .25, .35)));
      vec3 v3 = b + vec3(0, 1, 0) + vec3(1, -1, 1) * floor(dot(i4, vec4(.25, -.25, .25, .35)));
      vec3 v4 = b + vec3(0, 0, 1) + vec3(1, 1, -1) * floor(dot(i4, vec4(.25, .25, -.25, .35)));
      
      // Gradient hashes for the four vertices in this half-lattice.
      vec4 hashes = permute(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));
      hashes = permute(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));
      hashes = mod(permute(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);
      
      // Gradient extrapolations & kernel function
      vec3 d1 = X - v1; vec3 d2 = X - v2; vec3 d3 = X - v3; vec3 d4 = X - v4;
      vec4 a = max(0.75 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);
      vec4 aa = a * a; vec4 aaaa = aa * aa;
      vec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);
      vec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);
      vec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));
      
      // Derivatives of the noise
      vec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)
          + mat4x3(g1, g2, g3, g4) * aaaa;
      
      // Return it all as a vec4
      return vec4(derivative, dot(aaaa, extrapolations));
  }

  // Rotates domain, but preserve shape. Hides grid better in cardinal slices.
  // Good for texturing 3D objects with lots of flat parts along cardinal planes.
  vec4 bccNoiseDerivatives_XYZ(vec3 X) {
      X = dot(X, vec3(2.0/3.0)) - X;
      
      vec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);
      
      return vec4(dot(result.xyz, vec3(2.0/3.0)) - result.xyz, result.w);
  }

  // Gives X and Y a triangular alignment, and lets Z move up the main diagonal.
  // Might be good for terrain, or a time varying X/Y plane. Z repeats.
  vec4 bccNoiseDerivatives_XYBeforeZ(vec3 X) {
      
      // Not a skew transform.
      mat3 orthonormalMap = mat3(
          0.788675134594813, -0.211324865405187, -0.577350269189626,
          -0.211324865405187, 0.788675134594813, -0.577350269189626,
          0.577350269189626, 0.577350269189626, 0.577350269189626);
      
      X = orthonormalMap * X;
      vec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);
      
      return vec4(result.xyz * orthonormalMap, result.w);
  }
`,me=`
  // https://www.shadertoy.com/view/4sc3z2

  float hash31(vec3 p3)
  {
    p3  = fract(p3 * vec3(.1031,.11369,.13787));
      p3 += dot(p3, p3.yzx + 19.19);
      return -1.0 + 2.0 * fract((p3.x + p3.y) * p3.z);
  }
  vec3 hash33(vec3 p3)
  {
    p3 = fract(p3 * vec3(.1031,.11369,.13787));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
  }

  float perlin_noise(vec3 p)
  {
      vec3 pi = floor(p);
      vec3 pf = p - pi;
      
      vec3 w = pf * pf * (3.0 - 2.0 * pf);
      
      return 	mix(
              mix(
                    mix(dot(pf - vec3(0, 0, 0), hash33(pi + vec3(0, 0, 0))), 
                          dot(pf - vec3(1, 0, 0), hash33(pi + vec3(1, 0, 0))),
                          w.x),
                    mix(dot(pf - vec3(0, 0, 1), hash33(pi + vec3(0, 0, 1))), 
                          dot(pf - vec3(1, 0, 1), hash33(pi + vec3(1, 0, 1))),
                          w.x),
                    w.z),
              mix(
                      mix(dot(pf - vec3(0, 1, 0), hash33(pi + vec3(0, 1, 0))), 
                          dot(pf - vec3(1, 1, 0), hash33(pi + vec3(1, 1, 0))),
                          w.x),
                      mix(dot(pf - vec3(0, 1, 1), hash33(pi + vec3(0, 1, 1))), 
                          dot(pf - vec3(1, 1, 1), hash33(pi + vec3(1, 1, 1))),
                          w.x),
                    w.z),
            w.y);
}
`,ge=`
// Copyright(c) 2021 Björn Ottosson
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy of
  // this softwareand associated documentation files(the "Software"), to deal in
  // the Software without restriction, including without limitation the rights to
  // use, copy, modify, merge, publish, distribute, sublicense, and /or sell copies
  // of the Software, and to permit persons to whom the Software is furnished to do
  // so, subject to the following conditions :
  // The above copyright noticeand this permission notice shall be included in all
  // copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.

  #define M_PI 3.1415926535897932384626433832795

  float cbrt( float x )
  {
      return sign(x)*pow(abs(x),1.0/3.0);
  }

  float srgb_transfer_function(float a)
  {
    return .0031308 >= a ? 12.92 * a : 1.055 * pow(a, .4166666666666667) - .055;
  }

  float srgb_transfer_function_inv(float a)
  {
    return .04045 < a ? pow((a + .055) / 1.055, 2.4) : a / 12.92;
  }

  vec3 linear_srgb_to_oklab(vec3 c)
  {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

    float l_ = cbrt(l);
    float m_ = cbrt(m);
    float s_ = cbrt(s);

    return vec3(
      0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
      1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
      0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    );
  }

  vec3 oklab_to_linear_srgb(vec3 c)
  {
    float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

    float l = l_ * l_ * l_;
    float m = m_ * m_ * m_;
    float s = s_ * s_ * s_;

    return vec3(
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
  }

  // Finds the maximum saturation possible for a given hue that fits in sRGB
  // Saturation here is defined as S = C/L
  // a and b must be normalized so a^2 + b^2 == 1
  float compute_max_saturation(float a, float b)
  {
    // Max saturation will be when one of r, g or b goes below zero.

    // Select different coefficients depending on which component goes below zero first
    float k0, k1, k2, k3, k4, wl, wm, ws;

    if (-1.88170328 * a - 0.80936493 * b > 1.)
    {
      // Red component
      k0 = +1.19086277; k1 = +1.76576728; k2 = +0.59662641; k3 = +0.75515197; k4 = +0.56771245;
      wl = +4.0767416621; wm = -3.3077115913; ws = +0.2309699292;
    }
    else if (1.81444104 * a - 1.19445276 * b > 1.)
    {
      // Green component
      k0 = +0.73956515; k1 = -0.45954404; k2 = +0.08285427; k3 = +0.12541070; k4 = +0.14503204;
      wl = -1.2684380046; wm = +2.6097574011; ws = -0.3413193965;
    }
    else
    {
      // Blue component
      k0 = +1.35733652; k1 = -0.00915799; k2 = -1.15130210; k3 = -0.50559606; k4 = +0.00692167;
      wl = -0.0041960863; wm = -0.7034186147; ws = +1.7076147010;
    }

    // Approximate max saturation using a polynomial:
    float S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b;

    // Do one step Halley's method to get closer
    // this gives an error less than 10e6, except for some blue hues where the dS/dh is close to infinite
    // this should be sufficient for most applications, otherwise do two/three steps 

    float k_l = +0.3963377774* a + 0.2158037573* b;
    float k_m = -0.1055613458* a - 0.0638541728* b;
    float k_s = -0.0894841775* a - 1.2914855480* b;

    {
      float l_ = 1.+ S * k_l;
      float m_ = 1.+ S * k_m;
      float s_ = 1.+ S * k_s;

      float l = l_ * l_ * l_;
      float m = m_ * m_ * m_;
      float s = s_ * s_ * s_;

      float l_dS = 3.* k_l * l_ * l_;
      float m_dS = 3.* k_m * m_ * m_;
      float s_dS = 3.* k_s * s_ * s_;

      float l_dS2 = 6.* k_l * k_l * l_;
      float m_dS2 = 6.* k_m * k_m * m_;
      float s_dS2 = 6.* k_s * k_s * s_;

      float f = wl * l + wm * m + ws * s;
      float f1 = wl * l_dS + wm * m_dS + ws * s_dS;
      float f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;

      S = S - f * f1 / (f1 * f1 - 0.5 * f * f2);
    }

    return S;
  }

  // finds L_cusp and C_cusp for a given hue
  // a and b must be normalized so a^2 + b^2 == 1
  vec2 find_cusp(float a, float b)
  {
    // First, find the maximum saturation (saturation S = C/L)
    float S_cusp = compute_max_saturation(a, b);

    // Convert to linear sRGB to find the first point where at least one of r,g or b >= 1:
    vec3 rgb_at_max = oklab_to_linear_srgb(vec3( 1, S_cusp * a, S_cusp * b ));
    float L_cusp = cbrt(1. / max(max(rgb_at_max.r, rgb_at_max.g), rgb_at_max.b));
    float C_cusp = L_cusp * S_cusp;

    return vec2( L_cusp , C_cusp );
  }

  // Finds intersection of the line defined by 
  // L = L0 * (1 - t) + t * L1;
  // C = t * C1;
  // a and b must be normalized so a^2 + b^2 == 1
  float find_gamut_intersection(float a, float b, float L1, float C1, float L0, vec2 cusp)
  {
    // Find the intersection for upper and lower half seprately
    float t;
    if (((L1 - L0) * cusp.y - (cusp.x - L0) * C1) <= 0.)
    {
      // Lower half

      t = cusp.y * L0 / (C1 * cusp.x + cusp.y * (L0 - L1));
    }
    else
    {
      // Upper half

      // First intersect with triangle
      t = cusp.y * (L0 - 1.) / (C1 * (cusp.x - 1.) + cusp.y * (L0 - L1));

      // Then one step Halley's method
      {
        float dL = L1 - L0;
        float dC = C1;

        float k_l = +0.3963377774 * a + 0.2158037573 * b;
        float k_m = -0.1055613458 * a - 0.0638541728 * b;
        float k_s = -0.0894841775 * a - 1.2914855480 * b;

        float l_dt = dL + dC * k_l;
        float m_dt = dL + dC * k_m;
        float s_dt = dL + dC * k_s;


        // If higher accuracy is required, 2 or 3 iterations of the following block can be used:
        {
          float L = L0 * (1. - t) + t * L1;
          float C = t * C1;

          float l_ = L + C * k_l;
          float m_ = L + C * k_m;
          float s_ = L + C * k_s;

          float l = l_ * l_ * l_;
          float m = m_ * m_ * m_;
          float s = s_ * s_ * s_;

          float ldt = 3. * l_dt * l_ * l_;
          float mdt = 3. * m_dt * m_ * m_;
          float sdt = 3. * s_dt * s_ * s_;

          float ldt2 = 6. * l_dt * l_dt * l_;
          float mdt2 = 6. * m_dt * m_dt * m_;
          float sdt2 = 6. * s_dt * s_dt * s_;

          float r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s - 1.;
          float r1 = 4.0767416621 * ldt - 3.3077115913 * mdt + 0.2309699292 * sdt;
          float r2 = 4.0767416621 * ldt2 - 3.3077115913 * mdt2 + 0.2309699292 * sdt2;

          float u_r = r1 / (r1 * r1 - 0.5 * r * r2);
          float t_r = -r * u_r;

          float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s - 1.;
          float g1 = -1.2684380046 * ldt + 2.6097574011 * mdt - 0.3413193965 * sdt;
          float g2 = -1.2684380046 * ldt2 + 2.6097574011 * mdt2 - 0.3413193965 * sdt2;

          float u_g = g1 / (g1 * g1 - 0.5 * g * g2);
          float t_g = -g * u_g;

          float b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s - 1.;
          float b1 = -0.0041960863 * ldt - 0.7034186147 * mdt + 1.7076147010 * sdt;
          float b2 = -0.0041960863 * ldt2 - 0.7034186147 * mdt2 + 1.7076147010 * sdt2;

          float u_b = b1 / (b1 * b1 - 0.5 * b * b2);
          float t_b = -b * u_b;

          t_r = u_r >= 0. ? t_r : 10000.;
          t_g = u_g >= 0. ? t_g : 10000.;
          t_b = u_b >= 0. ? t_b : 10000.;

          t += min(t_r, min(t_g, t_b));
        }
      }
    }

    return t;
  }

  float find_gamut_intersection(float a, float b, float L1, float C1, float L0)
  {
    // Find the cusp of the gamut triangle
    vec2 cusp = find_cusp(a, b);

    return find_gamut_intersection(a, b, L1, C1, L0, cusp);
  }

  vec3 gamut_clip_preserve_chroma(vec3 rgb)
  {
    if (rgb.r < 1. && rgb.g < 1. && rgb.b < 1. && rgb.r > 0. && rgb.g > 0. && rgb.b > 0.)
      return rgb;

    vec3 lab = linear_srgb_to_oklab(rgb);

    float L = lab.x;
    float eps = 0.00001;
    float C = max(eps, sqrt(lab.y * lab.y + lab.z * lab.z));
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    float L0 = clamp(L, 0., 1.);

    float t = find_gamut_intersection(a_, b_, L, C, L0);
    float L_clipped = L0 * (1. - t) + t * L;
    float C_clipped = t * C;

    return oklab_to_linear_srgb(vec3( L_clipped, C_clipped * a_, C_clipped * b_ ));
  }

  vec3 gamut_clip_project_to_0_5(vec3 rgb)
  {
    if (rgb.r < 1. && rgb.g < 1. && rgb.b < 1. && rgb.r > 0. && rgb.g > 0. && rgb.b > 0.)
      return rgb;

    vec3 lab = linear_srgb_to_oklab(rgb);

    float L = lab.x;
    float eps = 0.00001;
    float C = max(eps, sqrt(lab.y * lab.y + lab.z * lab.z));
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    float L0 = 0.5;

    float t = find_gamut_intersection(a_, b_, L, C, L0);
    float L_clipped = L0 * (1. - t) + t * L;
    float C_clipped = t * C;

    return oklab_to_linear_srgb(vec3( L_clipped, C_clipped * a_, C_clipped * b_ ));
  }

  vec3 gamut_clip_project_to_L_cusp(vec3 rgb)
  {
    if (rgb.r < 1. && rgb.g < 1. && rgb.b < 1. && rgb.r > 0. && rgb.g > 0. && rgb.b > 0.)
      return rgb;

    vec3 lab = linear_srgb_to_oklab(rgb);

    float L = lab.x;
    float eps = 0.00001;
    float C = max(eps, sqrt(lab.y * lab.y + lab.z * lab.z));
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    // The cusp is computed here and in find_gamut_intersection, an optimized solution would only compute it once.
    vec2 cusp = find_cusp(a_, b_);

    float L0 = cusp.x;

    float t = find_gamut_intersection(a_, b_, L, C, L0);

    float L_clipped = L0 * (1. - t) + t * L;
    float C_clipped = t * C;

    return oklab_to_linear_srgb(vec3( L_clipped, C_clipped * a_, C_clipped * b_ ));
  }

  vec3 gamut_clip_adaptive_L0_0_5(vec3 rgb, float alpha)
  {
    if (rgb.r < 1. && rgb.g < 1. && rgb.b < 1. && rgb.r > 0. && rgb.g > 0. && rgb.b > 0.)
      return rgb;

    vec3 lab = linear_srgb_to_oklab(rgb);

    float L = lab.x;
    float eps = 0.00001;
    float C = max(eps, sqrt(lab.y * lab.y + lab.z * lab.z));
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    float Ld = L - 0.5;
    float e1 = 0.5 + abs(Ld) + alpha * C;
    float L0 = 0.5 * (1. + sign(Ld) * (e1 - sqrt(e1 * e1 - 2. * abs(Ld))));

    float t = find_gamut_intersection(a_, b_, L, C, L0);
    float L_clipped = L0 * (1. - t) + t * L;
    float C_clipped = t * C;

    return oklab_to_linear_srgb(vec3( L_clipped, C_clipped * a_, C_clipped * b_ ));
  }

  vec3 gamut_clip_adaptive_L0_L_cusp(vec3 rgb, float alpha)
  {
    if (rgb.r < 1. && rgb.g < 1. && rgb.b < 1. && rgb.r > 0. && rgb.g > 0. && rgb.b > 0.)
      return rgb;

    vec3 lab = linear_srgb_to_oklab(rgb);

    float L = lab.x;
    float eps = 0.00001;
    float C = max(eps, sqrt(lab.y * lab.y + lab.z * lab.z));
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    // The cusp is computed here and in find_gamut_intersection, an optimized solution would only compute it once.
    vec2 cusp = find_cusp(a_, b_);

    float Ld = L - cusp.x;
    float k = 2. * (Ld > 0. ? 1. - cusp.x : cusp.x);

    float e1 = 0.5 * k + abs(Ld) + alpha * C / k;
    float L0 = cusp.x + 0.5 * (sign(Ld) * (e1 - sqrt(e1 * e1 - 2. * k * abs(Ld))));

    float t = find_gamut_intersection(a_, b_, L, C, L0);
    float L_clipped = L0 * (1. - t) + t * L;
    float C_clipped = t * C;

    return oklab_to_linear_srgb(vec3( L_clipped, C_clipped * a_, C_clipped * b_ ));
  }

  float toe(float x)
  {
    float k_1 = 0.206;
    float k_2 = 0.03;
    float k_3 = (1. + k_1) / (1. + k_2);
    return 0.5 * (k_3 * x - k_1 + sqrt((k_3 * x - k_1) * (k_3 * x - k_1) + 4. * k_2 * k_3 * x));
  }

  float toe_inv(float x)
  {
    float k_1 = 0.206;
    float k_2 = 0.03;
    float k_3 = (1. + k_1) / (1. + k_2);
    return (x * x + k_1 * x) / (k_3 * (x + k_2));
  }

  vec2 to_ST(vec2 cusp)
  {
    float L = cusp.x;
    float C = cusp.y;
    return vec2( C / L, C / (1. - L) );
  }

  // Returns a smooth approximation of the location of the cusp
  // This polynomial was created by an optimization process
  // It has been designed so that S_mid < S_max and T_mid < T_max
  vec2 get_ST_mid(float a_, float b_)
  {
    float S = 0.11516993 + 1. / (
      +7.44778970 + 4.15901240 * b_
      + a_ * (-2.19557347 + 1.75198401 * b_
        + a_ * (-2.13704948 - 10.02301043 * b_
          + a_ * (-4.24894561 + 5.38770819 * b_ + 4.69891013 * a_
            )))
      );

    float T = 0.11239642 + 1. / (
      +1.61320320 - 0.68124379 * b_
      + a_ * (+0.40370612 + 0.90148123 * b_
        + a_ * (-0.27087943 + 0.61223990 * b_
          + a_ * (+0.00299215 - 0.45399568 * b_ - 0.14661872 * a_
            )))
      );

    return vec2( S, T );
  }

  vec3 get_Cs(float L, float a_, float b_)
  {
    vec2 cusp = find_cusp(a_, b_);

    float C_max = find_gamut_intersection(a_, b_, L, 1., L, cusp);
    vec2 ST_max = to_ST(cusp);
    
    // Scale factor to compensate for the curved part of gamut shape:
    float k = C_max / min((L * ST_max.x), (1. - L) * ST_max.y);

    float C_mid;
    {
      vec2 ST_mid = get_ST_mid(a_, b_);

      // Use a soft minimum function, instead of a sharp triangle shape to get a smooth value for chroma.
      float C_a = L * ST_mid.x;
      float C_b = (1. - L) * ST_mid.y;
      C_mid = 0.9 * k * sqrt(sqrt(1. / (1. / (C_a * C_a * C_a * C_a) + 1. / (C_b * C_b * C_b * C_b))));
    }

    float C_0;
    {
      // for C_0, the shape is independent of hue, so vec2 are constant. Values picked to roughly be the average values of vec2.
      float C_a = L * 0.4;
      float C_b = (1. - L) * 0.8;

      // Use a soft minimum function, instead of a sharp triangle shape to get a smooth value for chroma.
      C_0 = sqrt(1. / (1. / (C_a * C_a) + 1. / (C_b * C_b)));
    }

    return vec3( C_0, C_mid, C_max );
  }

  vec3 okhsl_to_srgb(vec3 hsl)
  {
    float h = hsl.x;
    float s = hsl.y;
    float l = hsl.z;

    if (l == 1.0)
    {
      return vec3( 1., 1., 1. );
    }

    else if (l == 0.)
    {
      return vec3( 0., 0., 0. );
    }

    float a_ = cos(2. * M_PI * h);
    float b_ = sin(2. * M_PI * h);
    float L = toe_inv(l);

    vec3 cs = get_Cs(L, a_, b_);
    float C_0 = cs.x;
    float C_mid = cs.y;
    float C_max = cs.z;

    float mid = 0.8;
    float mid_inv = 1.25;

    float C, t, k_0, k_1, k_2;

    if (s < mid)
    {
      t = mid_inv * s;

      k_1 = mid * C_0;
      k_2 = (1. - k_1 / C_mid);

      C = t * k_1 / (1. - k_2 * t);
    }
    else
    {
      t = (s - mid)/ (1. - mid);

      k_0 = C_mid;
      k_1 = (1. - mid) * C_mid * C_mid * mid_inv * mid_inv / C_0;
      k_2 = (1. - (k_1) / (C_max - C_mid));

      C = k_0 + t * k_1 / (1. - k_2 * t);
    }

    vec3 rgb = oklab_to_linear_srgb(vec3( L, C * a_, C * b_ ));
    return vec3(
      srgb_transfer_function(rgb.r),
      srgb_transfer_function(rgb.g),
      srgb_transfer_function(rgb.b)
    );
  }

  vec3 srgb_to_okhsl(vec3 rgb)
  {
    vec3 lab = linear_srgb_to_oklab(vec3(
      srgb_transfer_function_inv(rgb.r),
      srgb_transfer_function_inv(rgb.g),
      srgb_transfer_function_inv(rgb.b)
      ));

    float C = sqrt(lab.y * lab.y + lab.z * lab.z);
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    float L = lab.x;
    float h = 0.5 + 0.5 * atan(-lab.z, -lab.y) / M_PI;

    vec3 cs = get_Cs(L, a_, b_);
    float C_0 = cs.x;
    float C_mid = cs.y;
    float C_max = cs.z;

    // Inverse of the interpolation in okhsl_to_srgb:

    float mid = 0.8;
    float mid_inv = 1.25;

    float s;
    if (C < C_mid)
    {
      float k_1 = mid * C_0;
      float k_2 = (1. - k_1 / C_mid);

      float t = C / (k_1 + k_2 * C);
      s = t * mid;
    }
    else
    {
      float k_0 = C_mid;
      float k_1 = (1. - mid) * C_mid * C_mid * mid_inv * mid_inv / C_0;
      float k_2 = (1. - (k_1) / (C_max - C_mid));

      float t = (C - k_0) / (k_1 + k_2 * (C - k_0));
      s = mid + (1. - mid) * t;
    }

    float l = toe(L);
    return vec3( h, s, l );
  }


  vec3 okhsv_to_srgb(vec3 hsv)
  {
    float h = hsv.x;
    float s = hsv.y;
    float v = hsv.z;

    float a_ = cos(2. * M_PI * h);
    float b_ = sin(2. * M_PI * h);
    
    vec2 cusp = find_cusp(a_, b_);
    vec2 ST_max = to_ST(cusp);
    float S_max = ST_max.x;
    float T_max = ST_max.y;
    float S_0 = 0.5;
    float k = 1.- S_0 / S_max;

    // first we compute L and V as if the gamut is a perfect triangle:

    // L, C when v==1:
    float L_v = 1. - s * S_0 / (S_0 + T_max - T_max * k * s);
    float C_v = s * T_max * S_0 / (S_0 + T_max - T_max * k * s);

    float L = v * L_v;
    float C = v * C_v;

    // then we compensate for both toe and the curved top part of the triangle:
    float L_vt = toe_inv(L_v);
    float C_vt = C_v * L_vt / L_v;

    float L_new = toe_inv(L);
    C = C * L_new / L;
    L = L_new;

    vec3 rgb_scale = oklab_to_linear_srgb(vec3( L_vt, a_ * C_vt, b_ * C_vt ));
    float scale_L = cbrt(1. / max(max(rgb_scale.r, rgb_scale.g), max(rgb_scale.b, 0.)));

    L = L * scale_L;
    C = C * scale_L;

    vec3 rgb = oklab_to_linear_srgb(vec3( L, C * a_, C * b_ ));
    return vec3(
      srgb_transfer_function(rgb.r),
      srgb_transfer_function(rgb.g),
      srgb_transfer_function(rgb.b)
    );
  }

  vec3 srgb_to_okhsv(vec3 rgb)
  {
    vec3 lab = linear_srgb_to_oklab(vec3(
      srgb_transfer_function_inv(rgb.r),
      srgb_transfer_function_inv(rgb.g),
      srgb_transfer_function_inv(rgb.b)
      ));

    float C = sqrt(lab.y * lab.y + lab.z * lab.z);
    float a_ = lab.y / C;
    float b_ = lab.z / C;

    float L = lab.x;
    float h = 0.5 + 0.5 * atan(-lab.z, -lab.y) / M_PI;

    vec2 cusp = find_cusp(a_, b_);
    vec2 ST_max = to_ST(cusp);
    float S_max = ST_max.x;
    float T_max = ST_max.y;
    float S_0 = 0.5;
    float k = 1. - S_0 / S_max;

    // first we find L_v, C_v, L_vt and C_vt

    float t = T_max / (C + L * T_max);
    float L_v = t * L;
    float C_v = t * C;

    float L_vt = toe_inv(L_v);
    float C_vt = C_v * L_vt / L_v;

    // we can then use these to invert the step that compensates for the toe and the curved top part of the triangle:
    vec3 rgb_scale = oklab_to_linear_srgb(vec3( L_vt, a_ * C_vt, b_ * C_vt ));
    float scale_L = cbrt(1. / max(max(rgb_scale.r, rgb_scale.g), max(rgb_scale.b, 0.)));

    L = L / scale_L;
    C = C / scale_L;

    C = C * toe(L) / L;
    L = toe(L);

    // we can now compute v and s:

    float v = L / L_v;
    float s = (S_0 + T_max) * C_v / ((T_max * S_0) + T_max * k * C_v);

    return vec3 (h, s, v );
  }
`,Ht={id:"coloration",label:"Adjust",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec3 vVertexPosition;
in vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uHue;
uniform float uSaturation;
uniform float uBrightness;
uniform float uContrast;
uniform float temperature;
uniform float uSharpness;
uniform float uGamma;
${T}
${ge}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec4 color = texture(uTexture, uv);

  // Sharpen
  vec3 avgSurround = (
      texture(uTexture, uv + vec2(-1.0, 0.0)/uResolution).rgb +
      texture(uTexture, uv + vec2(1.0, 0.0)/uResolution).rgb +
      texture(uTexture, uv + vec2(0.0, -1.0)/uResolution).rgb +
      texture(uTexture, uv + vec2(0.0, 1.0)/uResolution).rgb) / 4.0;
  color.rgb += uSharpness * (color.rgb - avgSurround);

  // Convert to OKHSL and adjust uHue, uSaturation, and uBrightness
  color.rgb = srgb_to_okhsl(color.rgb);
  color.x = fract(color.x + uHue);
  color.y = clamp(color.y * uSaturation, 0.0, 1.0);
  color.z = clamp(color.z + uBrightness, 0.0, 1.0);
  color.rgb = okhsl_to_srgb(color.rgb);

  // Adjust uContrast
  color.rgb = uContrast * (color.rgb - 0.5) + 0.5;

  // Adjust temperature
  color.r = clamp(color.r + temperature, 0.0, 1.0);
  color.b = clamp(color.b - temperature, 0.0, 1.0);

  // uGamma correction
  color.rgb = pow(color.rgb, vec3(1.0 / (uGamma + 1.)));

  color = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
  ${C("color")}
}`,vertexShader:Gt,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{hue:{name:"uHue",type:"1f",value:1},saturation:{name:"uSaturation",type:"1f",value:1},temperature:{name:"temperature",type:"1f",value:0},lightness:{name:"uBrightness",type:"1f",value:0},contrast:{name:"uContrast",type:"1f",value:1},sharpen:{name:"uSharpness",type:"1f",value:0},gamma:{name:"uGamma",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},properties:{hue:{label:"Hue",value:1,min:1,max:2,step:.0027,output:"degrees"},saturation:{label:"Saturation",value:1,min:0,max:2,step:.01,output:"percent"},temperature:{label:"Temperature",value:0,min:-.25,max:.25,step:.01,output:"percent"},lightness:{label:"Exposure",value:0,min:-.5,max:.5,step:.01,output:"percent"},contrast:{label:"Contrast",value:1,min:0,max:2,step:.01,output:"percent"},sharpen:{label:"Sharpness",value:0,min:0,max:1,step:.01,output:"percent"},gamma:{label:"Gamma",value:0,min:0,max:1,step:.01,output:"percent"}}},qt={id:"bokeh",label:"Bokeh",params:{fragmentShader:`#version 300 es
precision mediump float;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uAmount;
uniform float uTilt;
uniform float uTime;
uniform vec2 uPos;
${T}

const float PI = 3.14159265;
const int SAMPLES = 64;

float radicalInverse_VdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10;
}

vec2 hammersley2D(uint i, uint N) {
    return vec2(float(i) / float(N), radicalInverse_VdC(i));
}

vec3 bokehBlur(vec2 uv, float blurRadius, float intensity) {
    vec2 poissonDiskSamples[SAMPLES];
    for (int i = 0; i < SAMPLES; ++i) {
        vec2 hammersleySample = hammersley2D(uint(i), uint(SAMPLES));
        float angle = 2.0 * PI * hammersleySample.x;
        float rad = sqrt(hammersleySample.y);
        poissonDiskSamples[i] = vec2(cos(angle), sin(angle)) * rad;
    }

    vec3 accumulatedColor = vec3(0.0);
    vec3 accumulatedWeights = vec3(0.0);
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 pixelSize = vec2(1.0 / aspectRatio, 1.0) * blurRadius * 0.075;

    for (int i = 0; i < SAMPLES; i++) {
        vec2 sampleOffset = poissonDiskSamples[i] * pixelSize;
        vec3 colorSample = texture(uTexture, uv + sampleOffset).xyz;
        vec3 bokehWeight = vec3(5.0) + pow(colorSample, vec3(9.0)) * intensity;

        accumulatedColor += colorSample * bokehWeight;
        accumulatedWeights += bokehWeight;
    }

    return accumulatedColor / accumulatedWeights;
}



out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  float dis = distance(uv * uResolution, uPos * uResolution);
  vec4 color = vec4(bokehBlur(uv, uAmount * mix(1. , dis * 0.001, uTilt), 150.0), 1.0);
  ${C("color")}
}
`,crossorigin:"Anonymous",vertexShader:A,texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{radius:{name:"uAmount",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:0},tilt:{name:"uTilt",type:"1f",value:0},...w}},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},radius:{label:"Radius",value:.5,min:0,max:1,step:.01,output:"percent"},tilt:{label:"Tilt",value:.5,min:0,max:1,step:.01,output:"percent"}}},Yt={id:"blinds",label:"Blinds",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform int uStyle;
  uniform float uFrequency;
  uniform float uDistortion;
  uniform float uAmount;
  uniform vec2 uPos;
  ${T}

  const float PI = 3.1415926;

  vec2 blinds(vec2 textureCoord) {
    vec3 distort = vec3(0);
    float divisions = 2. + uFrequency * 30.;
    float dist = (uDistortion * 4.) + 1.;

    vec3 first = vec3(1,0,0);
    vec3 second = vec3(0,1,0);
    vec3 third = vec3(0,0,1);
    
    if(uStyle == 0) {
      float segment = fract((textureCoord.y + 1.-uPos.y) * divisions);
      
      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));

      textureCoord.y -= pow(distort.r, dist)/10. * uAmount;
      textureCoord.y += pow(distort.b, dist)/10. * uAmount;
    }
    else if(uStyle == 1) {
      float segment = fract((textureCoord.x + 1.-uPos.x) * uAspectRatio * divisions);
      
      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord.x -= pow(distort.r, dist)/10. * uAmount;
      textureCoord.x += pow(distort.b, dist)/10. * uAmount;
    }
    else if(uStyle == 2) {
      float segment = fract((textureCoord.x + 1.-uPos.x) * uAspectRatio * divisions);
      
      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord.x -= pow(distort.r, dist)/10. * uAmount;
      textureCoord.x += pow(distort.b, dist)/10. * uAmount;

      segment = fract((textureCoord.y + 1.-uPos.y) * divisions);
      
      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord.y -= pow(distort.r, dist)/10. * uAmount;
      textureCoord.y += pow(distort.b, dist)/10. * uAmount;
    }
    else if(uStyle == 3) {
      vec2 diff = textureCoord - uPos;
      float angle = atan(diff.y, diff.x);
      float segment = fract((angle + PI) / (2. * PI) * divisions);

      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord -= pow(distort.r, dist)/10. * uAmount * normalize(diff);
      textureCoord += pow(distort.b, dist)/10. * uAmount * normalize(diff);
    } else if(uStyle == 4) {
      vec2 diff = textureCoord - uPos;
      float radius = length(diff * vec2(uAspectRatio, 1));
      float segment = fract(radius * divisions);

      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord -= pow(distort.r, dist)/10. * uAmount * normalize(diff);
      textureCoord += pow(distort.b, dist)/10. * uAmount * normalize(diff);
    } else if(uStyle == 5) {
      vec2 diff = textureCoord - uPos;
      float angle = -PI/4.; // rotate by -45 degrees
      vec2 rotatedDiff = vec2(
          diff.x * cos(angle) - diff.y * sin(angle),
          diff.x * sin(angle) + diff.y * cos(angle)
      );

      float manhattanDist = abs(rotatedDiff.x) + abs(rotatedDiff.y);
      float segment = fract(manhattanDist * divisions);
      
      distort = mix(mix(first, second, segment/0.5), mix(second, third, (segment - 0.5)/(1. - 0.5)), step(0.5, segment));
      textureCoord -= pow(distort.r, dist)/10. * uAmount * normalize(diff);
      textureCoord += pow(distort.b, dist)/10. * uAmount * normalize(diff);
    }
    
    return textureCoord;
  }

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec4 col = texture(uTexture, blinds(uv));

    ${C("col")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{frequency:{name:"uFrequency",type:"1f",value:.5},style:{name:"uStyle",type:"1i",value:0},gradient:{name:"uAmount",type:"1f",value:1},distortion:{name:"uDistortion",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:0,max:1,step:.01,output:"percent"},gradient:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},distortion:{label:"Distortion",value:.5,min:0,max:1,step:.01,output:"percent"},style:{label:"Style",value:0,options:{0:"Horizontal",1:"Vertical",2:"Both",3:"Radial",4:"Circles",5:"Squares"}}}},$t={id:"bloom",label:"Bloom",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec3 vVertexPosition;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uBgTexture;
uniform float uAmount;
uniform float uIntensity;
uniform float uExposure;
uniform float uDirection;
uniform float uVertical;
uniform int uFinal;
uniform float uTime;
${T}

const float MAX_ITERATIONS = 30.;

vec3 screen(vec3 src, vec3 dst) {
  return (src + dst) - (src * dst);
}

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}
  
// Define the standard deviation of the Gaussian blur
const float sigma = 5.0;

// Define the Gaussian function
float Gaussian(float x, float sigma) {
  return exp(-x * x / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159265) * sigma);
}

// Define the size of the blur kernel
const int kernelSize = 72;

vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 dir) {
  vec4 color = vec4(0.0);
  float weightSum = 0.0;
  
  // Compute the horizontal weights for the blur kernel
  float weights[kernelSize];

  for (int i = 1; i < kernelSize; i++) {
    float x = float(i - kernelSize / 2);
    weights[i] = Gaussian(x, 24.);
    weightSum += weights[i];
  }

  color += texture(tex, uv) * (weights[0] / weightSum);
  
  // Apply the horizontal blur
  for (int i = 0; i < kernelSize; i++) {
    float x = float(i - kernelSize / 2) * (uAmount * 12.);
    color += texture(tex, uv + vec2(x / uResolution.x) * dir) * (weights[i] / weightSum);
  }
  
  return color;
}

out vec4 fragColor;

void main()
{	
  vec2 uv = vTextureCoord;
  vec4 color = texture(uTexture, uv);
  if(uFinal == 1) {
    vec4 bg = texture(uBgTexture, uv);
    color.rgb = screen(color.rgb, bg.rgb) + (color.rgb * uIntensity)/2.;
  } else if(uVertical >= 2.) {
    vec3 bloom = color.rgb * color.rgb * sign(max(0.0, luma(color) - uExposure));
    color.rgb = smoothstep(0., 1., bloom) * uIntensity * 2.;
  } else {
    color = GaussianBlur(uTexture, uv, vec2(uVertical, 1.-uVertical) * vec2(uDirection, 1.-uDirection));
  }
  ${C("color")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.25},vertical:{name:"uVertical",type:"1f",value:2},direction:{name:"uDirection",type:"1f",value:.5},intensity:{name:"uIntensity",type:"1f",value:.5},exposure:{name:"uExposure",type:"1f",value:.5},final:{name:"uFinal",type:"1i",value:0},...w}},passes:[{prop:"vertical",value:0,downSample:!0},{prop:"vertical",value:1,downSample:!0},{prop:"final",value:1}],aspectRatio:1,properties:{amount:{label:"Radius",value:.5,min:0,max:1,step:.01,output:"percent"},intensity:{label:"Intensity",value:.5,min:0,max:1,step:.01,output:"percent"},exposure:{label:"Exposure",value:.5,min:0,max:1,step:.01,output:"percent"},direction:{label:"Direction",value:.5,min:0,max:1,step:.01,output:"percent"}}},jt={id:"custom",label:"Custom",params:{fragmentShader:`#version 300 es
precision mediump float;

// Want a quick intro?
// Select "Shader tutorial" from the dropdown above

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uMousePos;
uniform float uMouseClick;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uPos;
uniform float uAmount;
uniform float uScale;
uniform float uFrequency;
uniform float uAngle;
uniform float uAmplitude;
uniform int uVariant;
uniform float uTime;

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;

  vec4 color = texture(uTexture, uv);

  fragColor = color;
}`,vertexShader:`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    gl_Position = vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
}`,crossorigin:"Anonymous",widthSegments:250,heightSegments:250,texturesOptions:{floatingPoint:S},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},scale:{name:"uScale",type:"1f",value:.5},frequency:{name:"uFrequency",type:"1f",value:.5},angle:{name:"uAngle",type:"1f",value:0},amplitude:{name:"uAmplitude",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},mousePos:{name:"uMousePos",type:"2f",value:new f(.5)},color1:{name:"uColor1",type:"3f",value:new _(1,0,1)},color2:{name:"uColor2",type:"3f",value:new _(0,1,1)},time:{name:"uTime",type:"1f",value:0},click:{name:"uMouseClick",type:"1f",value:0},variant:{name:"uVariant",type:"1i",value:0},resolution:{name:"uResolution",type:"2f",value:new f(1080)}}},aspectRatio:1,animation:{active:!1,speed:.25},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},color1:{label:"Color 1",value:new _(1,0,1),output:"color"},color2:{label:"Color 2",value:new _(0,1,1),output:"color"},amount:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},scale:{label:"Scale",value:.5,min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:0,max:1,step:.01,output:"percent"},amplitude:{label:"Amplitude",value:.75,min:0,max:1,step:.01,output:"percent"},angle:{label:"Angle",value:0,min:0,max:1,step:.0027,output:"degrees"},variant:{label:"Variant",value:0,options:{0:"Option 1",1:"Option 2",2:"Option 3",3:"Option 4",4:"Option 5"}},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},Kt={id:"blur",label:"Blur",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uWarp;
  uniform float uSkew;
  uniform int uDirection;
  uniform int uType;
  uniform vec2 uPos;
  ${T}

  const float STEPS = 72.;

  out vec4 fragColor;

  // Define the standard deviation of the Gaussian blur
  const float sigma = 5.0;

  // Define the Gaussian function
  float Gaussian(float x, float sigma) {
    return exp(-x * x / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159265) * sigma);
  }

  // Define the size of the blur kernel
  const int kernelSize = 72;

  vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
    vec4 color = vec4(0.0);
    float weightSum = 0.0;

    float inner = distance(uv, uPos);
    float outer = max(0., 1.-distance(uv, uPos));
    float amount = (uAmount * 4.) * mix(inner, outer, uWarp)*2.4;
    
    // Compute the horizontal weights for the blur kernel
    float weights[kernelSize];

    for (int i = 1; i < kernelSize; i++) {
      float x = float(i - kernelSize / 2);
      weights[i] = Gaussian(x, 24.);
      weightSum += weights[i];
    }

    color += texture(tex, uv) * (weights[0] / weightSum);
    
    // Apply the horizontal blur
    for (int i = 0; i < kernelSize; i++) {
      float x = float(i - kernelSize / 2) * amount;
      color += texture(tex, uv + vec2(x/1000.) * direction * vec2(uSkew, 1.-uSkew)) * (weights[i] / weightSum);
    }
    
    return color;
  }

  vec4 BoxBlur(sampler2D tex, vec2 uv, vec2 direction) {
    vec4 color = vec4(0.0);

    float inner = distance(uv, uPos);
    float outer = max(0., 1.-distance(uv, uPos));
    float amount = uAmount * mix(inner, outer, uWarp);
    
    // Apply the horizontal blur
    for (int i = 0; i < kernelSize; i++) {
      float x = float(i - kernelSize / 2) * amount/144.;
      color += texture(tex, uv + vec2(x) * direction * vec2(uSkew, 1.-uSkew));
    }
    
    return color/STEPS;
  }

  void main() {	
    vec2 uv = vTextureCoord;
    vec4 color = vec4(0);
    vec2 direction = uDirection == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);
    if(uType == 0) {
      color = GaussianBlur(uTexture, uv, direction);
    } else {
      color = BoxBlur(uTexture, uv, direction);
    }

    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{blurType:{name:"uType",type:"1i",value:0},amount:{name:"uAmount",type:"1f",value:.2},vertical:{name:"uDirection",type:"1i",value:0},warp:{name:"uWarp",type:"1f",value:.5},skew:{name:"uSkew",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,passes:[{prop:"vertical",value:1,downSample:!0}],properties:{blurType:{label:"Type",value:0,options:{0:"Gaussian",1:"Box"}},amount:{label:"Radius",value:.2,min:0,max:1,step:.01,output:"percent"},skew:{label:"Skew",value:.5,min:0,max:1,step:.01,output:"percent"},warp:{label:"Tilt",value:.5,min:0,max:1,step:.01,output:"percent"},pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"}}},Zt={id:"chromab",label:"Chromatic abb.",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec3 vVertexPosition;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uAmount;
uniform float uAngle;
uniform float uWarp;
uniform float uBlend;
uniform vec2 uPos;
uniform float uTime;
uniform int uType;
${T}

out vec4 fragColor;
const float STEPS = 30.0;
const float PI = 3.1415926;

// Convert an RGB color to CMYK
vec4 rgb2cmyk(vec3 rgb) {
  float k = 1.0 - max(max(rgb.r, rgb.g), rgb.b);
  float c = (1.0 - rgb.r - k) / (1.0 - k);
  float m = (1.0 - rgb.g - k) / (1.0 - k);
  float y = (1.0 - rgb.b - k) / (1.0 - k);
  return vec4(c, m, y, k);
}

// Convert a CMYK color to RGB
vec3 cmyk2rgb(vec4 cmyk) {
  float c = cmyk.r;
  float m = cmyk.g;
  float y = cmyk.b;
  float k = cmyk.a;
  float r = (1.0 - c) * (1.0 - k);
  float g = (1.0 - m) * (1.0 - k);
  float b = (1.0 - y) * (1.0 - k);
  return vec3(r, g, b);
}

void main() {  
  vec2 uv = vTextureCoord;
  float angle = ((uAngle + uTime / 20.0) * 360.0) * PI / 180.0;
  vec2 rotation = vec2(sin(angle) * uAspectRatio, cos(angle));
  vec2 aberrated = uAmount * rotation * 0.08 * mix(1.0, distance(uv, uPos) * (1.0 + uWarp), uWarp);
  
  vec4 left = uBlend == 1.0 ? vec4(0) : texture(uTexture, uv - aberrated);
  vec4 right = uBlend == 1.0 ? vec4(0) : texture(uTexture, uv + aberrated);
  vec4 center = vec4(0);

  if (uBlend == 1.0) {
    float invSteps = 1.0 / STEPS;

    for (float i = 0.0; i <= STEPS; i++) {
      vec2 offset = aberrated * (i * invSteps);
      left += texture(uTexture, uv - offset) * invSteps;
      right += texture(uTexture, uv + offset) * invSteps;
      center += texture(uTexture, uv - offset * 0.5) * invSteps * 0.5;
      center += texture(uTexture, uv + offset * 0.5) * invSteps * 0.5;
    }
  }

  vec4 color = texture(uTexture, uv);
  if(uType == 0) {
    color.r = left.r;
    color.g = uBlend == 1.0 ? center.g : color.g;
    color.b = right.b;
  } if(uType == 1) {
    color.r = uBlend == 1.0 ? center.r : color.r;
    color.g = left.g;
    color.b = right.b;
  } else if(uType == 2) {
    color.r = right.r;
    color.g = left.g;
    color.b = uBlend == 1.0 ? center.b : color.b;
  }

  color.a = max(max(left.a, center.a), right.a); // use max alpha from the aberrated color channels
  ${C("color")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.2},angle:{name:"uAngle",type:"1f",value:0},warp:{name:"uWarp",type:"1f",value:0},colorMode:{name:"uType",type:"1i",value:0},blend:{name:"uBlend",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:.5},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Spread",value:.2,min:0,max:1,step:.01,output:"percent"},angle:{label:"Angle",value:0,min:0,max:1,step:.0027,output:"degrees"},warp:{label:"Tilt shift",value:0,min:0,max:1,step:.01,output:"percent"},colorMode:{label:"Color mode",value:0,options:{0:"Blue/Red",1:"Blue/Green",2:"Red/Green"}},blend:{label:"Blend",value:0,classic:!0,options:{0:"Off",1:"On"}},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},Qt={id:"diffuse",label:"Diffuse",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uAmount;
uniform float uTime;
uniform float xy;
uniform float uDirection;
uniform float uGrain;
uniform float uWarp;
uniform vec2 uPos;
${T}

const float MAX_ITERATIONS = 12.;
const float PI = 3.1415926;


float random(vec2 seed) {
  seed.x *= uResolution.x/uResolution.y;
  return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  float aspectRatio = uResolution.x/uResolution.y;
  float delta = fract(floor(uTime)/20.);
  float angle, rotation, amp;
  float inner = distance(uv, uPos);
  float outer = max(0., 1.-distance(uv, uPos));

  float amount = uAmount * mix(inner, outer, uWarp) * 2.;

  angle = random(uv + vec2(0.1 + delta, 0));
  rotation = angle * 2. * PI;
  amp = random(uv + vec2(0.2 + delta, 0));

  vec2 offset_rough = vec2(cos(rotation) / aspectRatio * uDirection, sin(rotation) * (1. - uDirection)) * mix(amp, 1., 0.1) * amount * 0.5;
  vec4 rough = texture(uTexture, uv + offset_rough);
  vec4 fine = vec4(0);

  for(float i = 1.; i <= MAX_ITERATIONS; i++) {
    angle = random(uv + vec2(delta + 1.2 + i/MAX_ITERATIONS, 0));
    rotation = angle * 2. * PI;
    amp = random(uv + vec2(delta + 0.1 + i/MAX_ITERATIONS, 0));

    vec2 offset_fine = vec2(cos(rotation) / aspectRatio * uDirection, sin(rotation) * (1.-uDirection)) * mix(amp, 1., 0.1) * amount * 0.5;
    fine += texture(uTexture, uv + offset_fine) / MAX_ITERATIONS;
  }

  vec4 col = mix(fine, rough, uGrain);

  ${C("col")}
}

`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{time:{name:"uTime",type:"1f",value:0},amount:{name:"uAmount",type:"1f",value:.25},warp:{name:"uWarp",type:"1f",value:0},graininess:{name:"uGrain",type:"1f",value:.5},direction:{name:"uDirection",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Amount",value:.25,min:0,max:1,step:.01,output:"percent"},graininess:{label:"Grain",value:.5,min:0,max:1,step:.01,output:"percent"},direction:{label:"Direction",value:.5,min:0,max:1,step:.01,output:"percent"},warp:{label:"Tilt shift",value:.5,min:0,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},Jt={id:"dither",label:"Dither",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform sampler2D uBlueNoise;

  uniform float uAmount;
  uniform float uDither;
  uniform int uType;
  uniform float uTime;
  ${T}
  

  #define MAX_LEVEL 4

  //https://www.shadertoy.com/view/4lGGWt
  float getBayerFromCoordLevel(vec2 pixelpos)
  {
    float finalBayer   = 0.0;
    float finalDivisor = 0.0;
    float layerMult = 1.0;
      
      for(float bayerLevel = float(MAX_LEVEL); bayerLevel >= 1.0; bayerLevel--)
    {
      float bayerSize 	= exp2(bayerLevel)*0.5;
      vec2 bayercoord 	= mod(floor(pixelpos.xy / bayerSize),2.0);
      layerMult 		   *= 4.0;
      
      float byxx2 = bayercoord.x*2.0;

      finalBayer += mix(byxx2,3.0 - byxx2,bayercoord.y) / 3.0 * layerMult;
      finalDivisor += layerMult;
    }

    return finalBayer / finalDivisor;
  }

  //https://www.shadertoy.com/view/Mlcyzs
  float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy, vec2(a,b));
    float sn= mod(dt,3.14159);
    return fract((sin(sn) * c)*(3.0));
  }

  vec3 dither(vec3 color, float step, vec2 st, vec2 offset, float delta) {
    float noise;
    if(uType == 0) {
      vec4 blueNoise = texture(uBlueNoise, fract(st * vec2(uResolution.x/uResolution.y, 1) + offset));
      noise = blueNoise.r;
    }
    if(uType == 1) {
      noise = getBayerFromCoordLevel(st * uResolution + delta);
    }
    if(uType == 2) {
      noise = fract(sin(dot(st + vec2(fract(uTime/10.)), vec2(12.9898,78.233))) * 43758.5453);
    }
    color += (noise - 0.5) * step;
    return round(color * (1.0 / step)) * step;
  }

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    float delta = floor(uTime);
    vec2 offset = vec2(rand(vec2(123,16) + delta), rand(vec2(56,96) + delta));

    vec4 color = texture(uTexture, uv);
    color.rgb = mix(color.rgb, dither(color.rgb, uDither, uv, offset, delta), uAmount);

    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},dithering:{name:"uDither",type:"1f",value:.5},noiseType:{name:"uType",type:"1i",value:0},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:.5},texture:{src:"/images/blue_noise_large.png",sampler:"uBlueNoise"},properties:{noiseType:{label:"Type",value:0,options:{0:"Blue noise",1:"Bayer",2:"Random"}},dithering:{label:"Threshold",value:.5,min:0,max:1,step:.01,output:"percent"},amount:{label:"Mix",value:.5,min:0,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ei={id:"neon",label:"Neon",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uLightAMix;
  uniform float uLightBMix;
  uniform float uAngle;
  uniform vec3 uLightA;
  uniform vec3 uLightB;
  uniform float uLights;
  uniform float uVividness;
  uniform float uTime;
  ${T}

  const float SIZE = 4.;
  const float RES = 1.;

  //https://github.com/hughsk/glsl-luma/blob/master/index.glsl
  float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  vec4 sampleAvg(vec2 uv) {
    
    vec4 sum = vec4(0.);
    float iter = 0.;
    
    for(float y = -SIZE/2.; y <= SIZE/2.; y += RES) {
        for(float x = -SIZE/2.; x <= SIZE/2.; x += RES) {
            sum += texture(uTexture, uv + vec2(x, y)/1080.);
            iter += 1.; // figures out how many things get added
        }
    }
    
    return sum / vec4(iter);
  }

  float dist(vec2 p){
    p = abs(p);
    return pow(dot(pow(p, vec2(3)), vec2(1)), 1./3.); // 1.666, 4., etc.
  }

  vec4 photoshop_desaturate(vec3 color)
  {
    float bw = (min(color.r, min(color.g, color.b)) + max(color.r, max(color.g, color.b))) * 0.5;
    return vec4(bw, bw, bw, 1.0);
  }

  float getHeight(vec2 uv) {
    vec4 col = sampleAvg(uv);
    col = photoshop_desaturate(col.rgb);
    return smoothstep(0., 1., col.r);
  }

  mat4 brightnessMatrix( float brightness )
  {
      return mat4( 1, 0, 0, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  brightness, brightness, brightness, 1 );
  }

  vec4 computeNoise(vec2 uv, float offset) {
    float rotation = (-(uAngle + offset + uTime/100.) * 360.) * 3.1415926 / 180.;
    vec2 ste = 1./uResolution;
    float height = getHeight(uv);
    vec2 dxy = height - vec2(getHeight(uv + vec2(ste.x*cos(rotation), 0.)),
                            getHeight(uv + vec2(0., ste.y*sin(rotation))));
    return vec4( normalize(vec3(dxy * (0.03*uAmount)/ste,1.0)), height);
  }

  vec3 screen(vec3 src, vec3 dst) {
    return (src + dst) - (src * dst);
  }

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    float rotation = ((-(uAngle - 0.5 + uTime/100.) + 0.75) * 360.) * 3.1415926 / 180.;
    vec4 normalMapX = computeNoise(uv, 0.);
    vec4 normalMapY = computeNoise(uv, 0.5);
    
    normalMapX = vec4(normalMapX.rgb * 0.5 + 0.25, 1.);
    normalMapY = vec4(normalMapY.rgb * 0.5 + 0.25, 1.);
   
    vec4 color = texture(uTexture, uv);
    
    vec3 lightmapX = vec3( 
      smoothstep(0., 1., normalMapX.r),
      smoothstep(0., 1., normalMapX.g),
      smoothstep(0., 1., normalMapX.b)
    );

    vec3 lightmapY = vec3( 
      smoothstep(0., 1., normalMapY.r),
      smoothstep(0., 1., normalMapY.g),
      smoothstep(0., 1., normalMapY.b)
    );

    
    vec3 lighting = ((uLightA * lightmapX.r) * uLightAMix * 2.) + ((uLightB * lightmapY.r) * uLightBMix * 2.) + 
    ((uLightA * lightmapX.g) * uLightAMix * 2.) + ((uLightB * lightmapY.g) * uLightBMix * 2.);
    
    vec2 pointA = vec2(0.5) + vec2(0.5 * sin(-rotation), 0.5 * cos(-rotation));
    vec2 pointB = vec2(0.5) - vec2(0.5 * sin(-rotation), 0.5 * cos(-rotation));
    vec2 ba = pointB - pointA;
    float t = dot(uv - pointA, ba) / dot(ba, ba);
    
    color = brightnessMatrix((-1. + uLights)) * color;
    
    vec3 backgroundAmbient = mix(uLightB * uLightBMix, uLightA * uLightAMix, smoothstep(0., 1., t));
    vec3 foregroundAmbient = mix(uLightA * uLightAMix, uLightB * uLightBMix, smoothstep(0., 1., t));
    
    backgroundAmbient *= mix(lightmapX.b, lightmapY.b, t);

    lighting *= backgroundAmbient;

    color.rgb += mix(lighting, color.rgb + lighting, uVividness);
    
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},spread:{name:"spread",type:"1f",value:.5},lightBMix:{name:"uLightBMix",type:"1f",value:.5},lightAMix:{name:"uLightAMix",type:"1f",value:.5},lights:{name:"uLights",type:"1f",value:.5},angle:{name:"uAngle",type:"1f",value:0},vividness:{name:"uVividness",type:"1f",value:.5},lightA:{name:"uLightA",type:"3f",value:new _(.98,.12,.89)},lightB:{name:"uLightB",type:"3f",value:new _(.12,.77,.89)},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{lightA:{label:"Light A",value:new _(.98,.12,.89),output:"color"},lightAMix:{label:"LightA Mix",value:.5,min:0,max:1,step:.01,output:"percent"},lightB:{label:"Light B",value:new _(.12,.77,.89),output:"color"},lightBMix:{label:"LightB Mix",value:.5,min:0,max:1,step:.01,output:"percent"},amount:{label:"Highlights",value:.5,min:0,max:1,step:.01,output:"percent"},angle:{label:"Angle",value:0,min:0,max:1,step:.01,output:"percent"},vividness:{label:"Vividness",value:.5,min:0,max:1,step:.01,output:"percent"},lights:{label:"Exposure",value:.5,min:0,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ti={id:"fbm",label:"FBM",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAmplitude;
uniform float uPhase;
uniform float uFrequency;
uniform float uTurbulence;
uniform vec2 uPos;
uniform float uAngle; // new uniform for angle
${T}

${me}

#define OCTAVES 6
#define PI 3.14159265359
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float fbm (in vec3 st) {
  // Initial values
  float value = 0.0;
  float amp = .25;
  float frequency = 0.;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.5));
  for (int i = 0; i < OCTAVES; i++) {
      value += amp * perlin_noise(st);
      st.xy *= rot * 2.5;
      st.xy += shift;
      amp *= (0.1 + uAmplitude * .65);
  }
  return value;
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  float aspectRatio = uResolution.x/uResolution.y;
  float multiplier = 6.0 * (uFrequency / ((aspectRatio + 1.) / 2.));
  vec2 st = (uv*vec2(aspectRatio, 1) + (1. - uPos) - vec2(1)) * multiplier * aspectRatio;
  st = rot(-uAngle * 2.0 * PI) * st; // rotate st using uAngle (from 0 to 2PI)
  vec2 drift = vec2(uTime/200.);
  vec2 r = vec2(
    fbm(vec3(st - drift + vec2(1.7, 9.2), uPhase*25. + uTime/40.)),
    fbm(vec3(st - drift + vec2(8.2, 1.3), uPhase*25. + uTime/40.))
  );
  float f = fbm(vec3(st + r - drift, uPhase*25. + uTime/40.)) * uTurbulence;
  vec4 color = texture(uTexture, uv + (f * 2. + (r * uTurbulence)));
  ${C("color")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{amplitude:{name:"uAmplitude",type:"1f",value:.5},turbulence:{name:"uTurbulence",type:"1f",value:.5},frequency:{name:"uFrequency",type:"1f",value:.2},phase:{name:"uPhase",type:"1f",value:0},time:{name:"uTime",type:"1f",value:1},angle:{name:"uAngle",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Scale",value:.2,min:.01,max:1,step:.01,output:"percent"},amplitude:{label:"Gain",value:.5,min:.01,max:1,step:.01,output:"percent"},turbulence:{label:"Amplitude",value:.5,min:.1,max:1,step:.01,output:"percent"},phase:{label:"Phase",value:0,min:0,max:1,step:.01,output:"percent"},angle:{label:"Angle",value:0,min:0,max:1,step:.0027,output:"degrees"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ii={id:"flowField",label:"Flow field",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uScale;
  uniform float uPhase;
  uniform float uMix;
  uniform float uAngle;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}

  ${me}

  const float MAX_ITERATIONS = 16.;
  
  vec2 flow (in vec2 st) {
    float aspectRatio = uResolution.x/uResolution.y;
    float sprd = (uScale + 0.1) / ((aspectRatio + 1.) / 2.);
    float amt = uAmount * 0.01;

    for (float i = 0.; i < MAX_ITERATIONS; i++) {
        vec2 scaled = (st-0.5) * vec2(aspectRatio, 1) + (1. - uPos);
        float perlin = perlin_noise(vec3((scaled-0.5) * (6. * sprd), uPhase*5. + uTime/60.))-0.5;
        float ang = (perlin * (360. * (uAngle * 6.))) * 3.1415926 / 180.;
        st += vec2(cos(ang), sin(ang)) * amt;
        st = clamp(st, 0., 1.);
    }

    return st;
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec4 color =  texture(uTexture, mix(uv, flow(uv), uMix));
  ${C("color")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{},uniforms:{spread:{name:"uScale",type:"1f",value:.25},deviation:{name:"uAmount",type:"1f",value:.5},complexity:{name:"uAngle",type:"1f",value:.25},phase:{name:"uPhase",type:"1f",value:0},blend:{name:"uMix",type:"1f",value:.5},time:{name:"uTime",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,animation:{active:!1,speed:.25},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},deviation:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},spread:{label:"Scale",value:.5,min:0,max:1,step:.01,output:"percent"},blend:{label:"Mix",value:1,min:0,max:1,step:.01,output:"percent"},complexity:{label:"Angle",value:.5,min:0,max:1,step:.01,output:"degrees"},phase:{label:"Time",value:0,min:.01,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.25,min:0,max:1,step:.01,output:"percent"}}},si={id:"godrays",label:"God Rays",params:{fragmentShader:`#version 300 es
precision mediump float;

in vec3 vVertexPosition;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uBgTexture;
uniform float uAmount;
uniform float uIntensity;
uniform float uExposure;
uniform float uVertical;
uniform int uFinal;
uniform vec2 uPos;
uniform float uTime;
${T}

const float MAX_ITERATIONS = 75.;

//https://github.com/hughsk/glsl-luma/blob/master/index.glsl
float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

float Gaussian(float x, float sigma) {
  return exp(-x * x / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159265) * sigma);
}

vec4 blur(vec2 st) {
  vec4 color = vec4(0);
  float weightSum = 0.0;
  //st -= vec2(0.5);

  vec2 direction = mix(vec2(1, 0), vec2(0, 1), uVertical);
  for (float i = -MAX_ITERATIONS; i <= 0.; i++) {
      float x = float(i) * (0.25 + uAmount)/100.;
      color += texture(uTexture, st * (1. + x) - vec2(x/2.) - (1. - uPos - 0.5) * x);
      weightSum += x;
  }
  return color/MAX_ITERATIONS;
}

out vec4 fragColor;

void main()
{	
  vec2 uv = vTextureCoord;
  vec4 color = vec4(0);
  if(uFinal != 1) {
    color = texture(uTexture, uv);
    float lum = luma(color);
    color = mix(vec4(0), color, lum/lum + uExposure);
  } else {
    color = blur(uv);
    vec4 bg = texture(uBgTexture, uv);
    color = bg + (color * uIntensity * 1.);
  }
  ${C("color")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.25},pos:{name:"uPos",type:"2f",value:new f(.5)},vertical:{name:"vertical",type:"1f",value:0},intensity:{name:"uIntensity",type:"1f",value:.5},exposure:{name:"uExposure",type:"1f",value:.5},final:{name:"uFinal",type:"1i",value:0},...w}},passes:[{prop:"final",value:1}],aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Spread",value:.5,min:0,max:1,step:.01,output:"percent"},intensity:{label:"Intensity",value:.5,min:0,max:1,step:.01,output:"percent"},exposure:{label:"Exposure",value:.5,min:0,max:1,step:.01,output:"percent"}}},ri={id:"texturize",label:"Glitch",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uOffsetX;
  uniform float uChromAbb;
  uniform float uGlitch;
  uniform float uTime;
  uniform float uPhase;
  ${T}

  float random (in float x) { return fract(sin(x)*1e4); }
  float quadratic(float x, float tot) { return round(100. * x / tot / (2. - x / tot)); }
  
  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    float size = uAmount * 0.2 * random(uTime + 0.001);
    float floorY = floor(uv.y/size);
    float floorX = floor(uv.x/size);
    float delta = fract((floor(uTime)/20.));
    float glitchMod = max(0., sign(random(sin(floorY + delta + uPhase/100.)) - 0.5 - (1. - uGlitch*2.)/2.));
    float offX = (
      (random(floorY + delta * glitchMod + uPhase/100.)) * uOffsetX - uOffsetX/2.
    )/5.;
    uv.x = mix(uv.x, uv.x + offX * 2., glitchMod);

    vec4 color = texture(uTexture, uv);
    color.r = texture(uTexture, vec2(uv.x + (glitchMod * -.05 * uChromAbb), uv.y)).r;
    color.b = texture(uTexture, vec2(uv.x + (glitchMod * .05 * uChromAbb), uv.y)).b;
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},offsetX:{name:"uOffsetX",type:"1f",value:.5},chromAbb:{name:"uChromAbb",type:"1f",value:.5},glitch:{name:"uGlitch",type:"1f",value:.5},phase:{name:"uPhase",type:"1f",value:0},time:{name:"uTime",type:"1f",value:0},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{amount:{label:"Size",value:.5,min:.01,max:1,step:.01,output:"percent"},offsetX:{label:"Offset",value:.5,min:0,max:1,step:.01,output:"percent"},chromAbb:{label:"Abberation",value:.5,min:0,max:1,step:.01,output:"percent"},glitch:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},phase:{label:"Time",value:0,min:.01,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:1,min:0,max:1,step:.01,output:"percent"}}},ai={id:"grain",label:"Grain",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAmount;
  uniform float frequency;
  uniform int uRgb;
  uniform float uDirection;
  uniform float uBlendMode;
  ${T}
  ${he}

  //https://www.shadertoy.com/view/ltB3zD
  const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 
  float gold_noise(in vec2 xy, in float seed)
  {
      return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
  }

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    vec2 st = uv;
    vec3 grainRGB = vec3(0);

    st.x = (uDirection == 0.) ? uv.y : uv.x;
    st.y = (uDirection == 1.) ? uv.x : uv.y;
    
    st *= uResolution;

    float delta = fract((floor(uTime)/20.));

    if(uRgb == 1) {
      grainRGB = vec3(
        gold_noise(st, delta + 1.),
        gold_noise(st, delta + 2.),
        gold_noise(st, delta + 3.)
      );
    } else {
      grainRGB = vec3(gold_noise(st, delta + 1.));
    }
      
    if(uBlendMode > 0.) {
      color.rgb = mix(color.rgb, blend(uBlendMode, grainRGB, color.rgb), uAmount);
    }
    color.rgb *= color.a;
          
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{time:{name:"uTime",type:"1f",value:1},intensity:{name:"uAmount",type:"1f",value:.5},rgb:{name:"uRgb",type:"1i",value:0},direction:{name:"uDirection",type:"1f",value:0},blendMode:{name:"uBlendMode",type:"1f",value:0},...w}},animation:{active:!1,speed:1},aspectRatio:1,dpi:2,properties:{intensity:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},rgb:{label:"RGB",value:0,options:[{value:0,label:"Off"},{value:1,label:"On"}],classic:!0},direction:{label:"Direction",value:2,options:{0:"Horizontal",1:"Vertical",2:"None"}},blendMode:{label:"Blend mode",value:"ADD",options:se},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},oi={id:"hologram",label:"Hologram",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uFrequency;
  uniform float uStyle;
  uniform float uBlendMode;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}
  ${ge}
  ${he}

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec4 base = texture(uTexture, uv);
    vec3 okHSL = srgb_to_okhsl(base.rgb);
    vec2 st = uv - uPos - 0.21 - vec2((dot(base.rgb, vec3(0.3, 0.6, 0.1)) - 0.5));
    float d = length(st);
    float hue = (atan(st.y, st.x)*(uFrequency * 12.5))/(2.*M_PI);
    hue = mix(hue, st.y * uFrequency * 7.5, uStyle);
    vec3 ok = okhsl_to_srgb(vec3(fract(hue + uTime/100.), mix(d, okHSL.z, 0.5), okHSL.z));
    vec4 color = base;
    if(uBlendMode > 0.) {
      color.rgb = blend(uBlendMode, base.rgb, ok);
    }
    color = mix(base, color, uAmount);
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},blendMode:{name:"uBlendMode",type:"1f",value:3},style:{name:"uStyle",type:"1f",value:0},frequency:{name:"uFrequency",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:0,max:1,step:.01,output:"percent"},style:{label:"Type",value:0,options:{0:"Radial",1:"Linear"}},blendMode:{label:"Blend mode",value:"OVERLAY",options:se},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ni={id:"mouse",label:"Mouse",params:{fragmentShader:`#version 300 es
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform sampler2D uPingPongTexture;
  uniform vec2 uMousePos;
  uniform float uScale;
  uniform float uAmount;
  uniform float uDecay;
  uniform float uTime;

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    
    float s1 = smoothstep(0., uScale*0.25, distance(uv, uMousePos));
    vec3 draw = mix(vec3(1, 0, 0), vec3(0,0,1), s1)*uAmount*0.5;

    fragColor = vec4(draw, 0.3 * (1.-uDecay));
  }
`,vertexShader:`#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// default mandatory variables
in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// custom variables
out vec3 vVertexPosition;
out vec2 vTextureCoord;

void main() {

    vec3 vertexPosition = aVertexPosition;

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // varyings
    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
}
`,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"half-float",premultiplyAlpha:!0},uniforms:{pos:{name:"uPos",type:"2f",value:new f(.5)},scale:{name:"uScale",type:"1f",value:.5},amount:{name:"uAmount",type:"1f",value:.5},decay:{name:"uDecay",type:"1f",value:.5},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},scale:{label:"Radius",value:.5,min:0,max:1,step:.01,output:"percent"},amount:{label:"Strength",value:.5,min:0,max:1,step:.01,output:"percent"},decay:{label:"Tail",value:.5,min:0,max:1,step:.01,output:"percent"}}},li={id:"liquify",label:"Liquify",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uComplexity;
  uniform float uMix;
  uniform vec2 uPos;
  ${T}

  uniform sampler2D uTexture;

  vec2 liquify(vec2 st) {
    float xPos = 1.-uPos.y * 10.;
    float yPos = 1.-uPos.x * 10.;
    float amplitude = uAmplitude/5.;
    for(float i = 1.0; i < 4.; i++){
      st.x += (amplitude / i) * ((cos(i * (5. * (uFrequency + 0.1)) * st.y + uTime*0.025 + xPos) * uComplexity + cos(i * (7. * (uFrequency + 0.1)) * st.y + uTime*0.05 + xPos) + cos(i * (9. * (uFrequency + 0.1)) * st.y * 2. + uTime*0.0625 + xPos)/3. * uComplexity));
      st.y += (amplitude / i) * ((sin(i * (5. * (uFrequency + 0.1)) * st.x + uTime*0.025 + yPos) * uComplexity + sin(i * (7. * (uFrequency + 0.1)) * st.x + uTime*0.05 + yPos) + sin(i * (9. * (uFrequency + 0.1)) * st.x * 2. + uTime*0.0625 + yPos)/3. * uComplexity));
    }
    return st;
  }

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, mix(uv, liquify(uv), uMix));

    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{time:{name:"uTime",type:"1f",value:0},frequency:{name:"uFrequency",type:"1f",value:.5},variation:{name:"uAmplitude",type:"1f",value:.5},complexity:{name:"uComplexity",type:"1f",value:.5},blend:{name:"uMix",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:.01,max:1,step:.01,output:"percent"},variation:{label:"Amplitude",value:.5,min:.01,max:1,step:.01,output:"percent"},blend:{label:"Mix",value:.5,min:.01,max:1,step:.01,output:"percent"},complexity:{label:"Complexity",value:.5,min:.01,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ui={id:"mirror",label:"Mirror",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uDirection;
  ${T}

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec2 vertCoords = uv;
    vec2 horizCoords = uv;
    vec2 bothCoords = uv;

    vertCoords.x = vertCoords.x > 0.5 ? 0.5 - (vertCoords.x - 0.5) : vertCoords.x;
    vertCoords.y = vertCoords.x > 0.5 ? 0.5 - (vertCoords.y - 0.5) : vertCoords.y;

    horizCoords.y = horizCoords.y > 0.5 ? 0.5 - (horizCoords.y - 0.5) : horizCoords.y;
    horizCoords.x = horizCoords.y > 0.5 ? 0.5 - (horizCoords.x - 0.5) : horizCoords.x;

    bothCoords.y = horizCoords.y > 0.5 ? (1. - horizCoords.y) : 0.5 - (horizCoords.y - 0.5);
    bothCoords.x = vertCoords.y > 0.5 ? (1. - vertCoords.x) : 0.5 - (vertCoords.x - 0.5);

    uv = mix(vertCoords, bothCoords, uDirection);
    vec4 color = texture(uTexture, uv);
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{direction:{name:"uDirection",type:"1f",value:0},...w}},aspectRatio:1,properties:{direction:{label:"Direction",value:1,options:{0:"Half",1:"Quad"}}}},hi={id:"ripple",label:"Ripple",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform vec2 uPos;
  ${T}

  out vec4 fragColor;

  // Easing function for smooth wave transitions
  float easeInOut(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
  }

  float easeQuintic(float x) { 
    return x*x*x*(10.0 + x*(-15.0 + 6.0*x));
  }

  // Ripple effect function
  vec2 ripple(vec2 uv, vec2 pos, float amplitude, float frequency, float time) {
    float distance = length(uv - pos);
    float wave = sin(distance * frequency + time) * amplitude;
    return uv + normalize(uv - pos) * wave;
  }

  void main() {
    // Normalize texture coordinates
    vec2 uv = vTextureCoord;

    // Calculate the ripple effect
    float rippleAmplitude = easeInOut(uAmplitude * 0.25);
    float rippleFrequency = easeInOut(uFrequency * 10.);
    uv = ripple(uv, uPos, rippleAmplitude, rippleFrequency, uTime/4.);

    // Sample the texture with the ripple effect applied
    vec4 color = texture(uTexture, uv);

    // Set the output color
    ${C("color")};
  }
`,vertexShader:A,crossorigin:"Anonymous",widthSegments:250,heightSegments:250,texturesOptions:{floatingPoint:S},uniforms:{frequency:{name:"uFrequency",type:"1f",value:.5},amplitude:{name:"uAmplitude",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},phase:{name:"phase",type:"1f",value:0},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:0,max:1,step:.01,output:"percent"},amplitude:{label:"Amplitude",value:.5,min:0,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},ci={id:"voronoi",label:"Shatter",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;

  uniform float uAmount;
  uniform float uSpread;
  uniform float uWarp;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}

  
  vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }
  
  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;

    vec2 st = (uv - uPos) * vec2(uResolution.x/uResolution.y, 1) * 50. * uAmount;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 15.;  // minimum distance
    vec2 m_point;        // minimum point
    vec2 d;

    for (int j=-1; j<=1; j++ ) {
      for (int i=-1; i<=1; i++ ) {
          vec2 neighbor = vec2(float(i),float(j));
          vec2 point = random2(i_st + neighbor);

          point = 0.5 + 0.5 * sin(5. + uTime/4. + 6.2831*point);
          vec2 diff = neighbor + point - f_st;
          float dist = length(diff);

          if( dist < m_dist ) {
              m_dist = dist;
              m_point = point;
              d = diff;
          }
      }
    }

    vec2 distort = vec2(m_dist)/2. * (d * uWarp);
    vec2 offset = (m_point/5. * (uSpread * 2. + distort*2.)) - (0.1 * (uSpread * 2. + distort*2.));
    vec4 color = texture(uTexture, uv + offset);
              
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{pos:{name:"pos",type:"2f",value:new f(.5)},amount:{name:"uAmount",type:"1f",value:.5},spread:{name:"uSpread",type:"1f",value:.25},warp:{name:"uWarp",type:"1f",value:1},time:{name:"uTime",type:"1f",value:0},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Scale",value:.5,min:0,max:1,step:.01,output:"percent"},spread:{label:"Spread",value:.25,min:0,max:1,step:.01,output:"percent"},warp:{label:"Warp",value:.25,min:0,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},di=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uRotation;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}

  //https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
  vec2 rotateUV(vec2 uv, float rotation)
  {
      float mid = 0.5;
      return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
      );
  }

  const float PI = 3.141592;

  void main() {	
    vec3 vertexPosition = aVertexPosition;
    float frequency = ((uFrequency / uResolution.x/uResolution.y) + uFrequency)/2.;

    vec2 waveCoord = vec2(vertexPosition.x, vertexPosition.y);
    float angle = (uRotation * 360.) * 3.1415926 / 180.;
  
    float waveX = sin(waveCoord.y * (40.0 * frequency) + (uTime/4. * PI/3.) + uPos.y * 10.) * uAmplitude/5.;
    float waveY = sin(waveCoord.x * (40.0 * frequency) + (uTime/4. * PI/3.) + uPos.x * 10.) * uAmplitude/5.;
    waveCoord.xy += vec2(mix(waveX, 0., uRotation), mix(0., waveY, uRotation));

    if(vertexPosition.x == 1.) {
        waveCoord.x = 1.;
    }
    if(vertexPosition.x == -1.) {
        waveCoord.x = -1.;
    }
    if(vertexPosition.y == 1.) {
        waveCoord.y = 1.;
    }
    if(vertexPosition.y == -1.) {
        waveCoord.y = -1.;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(vec3(waveCoord, 0.), 1.0);

    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
  }
`,fi={id:"sine",label:"Sine",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec2 vTextureCoord;
  
  uniform sampler2D uTexture;
  ${T}
  
  out vec4 fragColor;

  void main()
  {	
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    ${C("color")}
  }
`,vertexShader:di,crossorigin:"Anonymous",widthSegments:250,heightSegments:250,texturesOptions:{floatingPoint:S,premultiplyAlpha:!0,samper:"uTexture"},uniforms:{frequency:{name:"uFrequency",type:"1f",value:.5},amplitude:{name:"uAmplitude",type:"1f",value:.3},rotation:{name:"uRotation",type:"1f",value:0},time:{name:"uTime",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Frequency",value:.5,min:0,max:1,step:.01,output:"percent"},amplitude:{label:"Amplitude",value:.3,min:0,max:1,step:.01,output:"percent"},rotation:{label:"Direction",value:0,min:.01,max:1,step:.01,output:"percent"},phase:{label:"Time",value:0,min:.01,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},pi={id:"sphere",label:"Sphere",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uRadius;
  uniform float uInvert;
  uniform vec2 uPos;
  uniform float uTime;
  ${T}

  // Author @patriciogv - 2015
  // http://patriciogonzalezvivo.com
  float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-uPos;
    return 1.-smoothstep(_radius-(_radius*0.01),
                          _radius+(_radius*0.01),
                          dot(dist,dist)*4.0);
  }

  mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
  }

  // Adapted from https://www.shadertoy.com/view/7lS3Ww
  vec2 sphericalTransformation(
      float u,
      float v,
      float uCenter,
      float vCenter,
      float lensRadius,
      float tau)
  {
      u -= uCenter;
      v -= vCenter;
      
      float s = sqrt(u * u + v * v);
      float z = sqrt(lensRadius * lensRadius - s * s);
      
      float sphereRadius = sqrt(u * u + v * v + z * z);

      float uAlpha = (1.0 - (1.0 / tau)) * sin(u / sphereRadius);
      float vAlpha = (1.0 - (1.0 / tau)) * sin(v / sphereRadius);
      
      u = 
          s <= lensRadius ?
          u + uCenter - z * tan(uAlpha) :
          u + uCenter;
          
      v = 
          s <= lensRadius ?
          v + vCenter - z * tan(vAlpha) :
          v + vCenter;
      
      return vec2(u, v);
  }

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    float aspectRatio = uResolution.x/uResolution.y;
    uv.x = uv.x * aspectRatio - (-0.5 + 0.5 * aspectRatio);
    vec2 sphereCoords = uv;

    sphereCoords = sphericalTransformation(
      mix(1.-sphereCoords.x, sphereCoords.x, uInvert),
      mix(1.-sphereCoords.y, sphereCoords.y, uInvert),
      mix(1.-uPos.x, uPos.x, uInvert),
      mix(1.-uPos.y, uPos.y, uInvert),
      uRadius/2.,
      1. + uAmount * 9.
    );

    vec2 scaledCoords = (sphereCoords - 0.5) + 0.5;
    vec4 sphere = texture(uTexture, clamp(scaledCoords, 0.0, 1.0));
    color = mix(color, sphere, circle(uv, pow(uRadius, 2.)));
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{amount:{name:"uAmount",type:"1f",value:.2},radius:{name:"uRadius",type:"1f",value:.5},mirror:{name:"uInvert",type:"1f",value:1},time:{name:"uTime",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},radius:{label:"Radius",value:.5,min:0,max:1,step:.01,output:"percent"},amount:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},mirror:{label:"Mirror",value:1,classic:!0,options:{0:"Off",1:"On"}}}},mi={id:"scan",label:"Scan",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform vec2 uPos;
  uniform float uAngle;
  ${T}

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    float degrees = uAngle * 360.;
    float rot1 = degrees * 3.1415926 / 180.;
    float rot2 = ((uAngle - 0.25) * 360.) * 3.1415926 / 180.;
    float amt = smoothstep(0.15, 1., uAmount) * 10.;
    
    vec2 diff = vec2(
      (uv.x - uPos.x),
      (uv.y - uPos.y)
    );

    vec2 scaled = vec2(1) + diff;
    
    vec2 pointA = uPos + vec2(0.1 * sin(rot1), 0.1 * cos(rot1));
    vec2 pointB = uPos - vec2(0.1 * sin(rot1), 0.1 * cos(rot1));

    vec2 pointC = uv + vec2(0.1 * sin(rot2), 0.1 * cos(rot2));
    vec2 pointD = uv - vec2(0.1 * sin(rot2), 0.1 * cos(rot2));

    float m1 = (pointB.y - pointA.y)/(pointB.x - pointA.x);
    float c1 = pointA.y - m1*pointA.x;
    float m2 = (pointD.y - pointC.y)/(pointD.x - pointC.x);
    float c2 = pointC.y - m2*pointC.x;

    vec2 line1 = vec2((uv.y-c1)/m1, uv.x*m1+c1);
    vec2 line2 = vec2((uPos.y-c2)/m2, uPos.x*m2+c2);
    
    float intersectX = (c1 - c2) / (m2 - m1);
    float intersectY = intersectX * m1 + c1;

    
    vec4 color = vec4(0);
    
    float diffX = abs(uv.x - intersectX);
    float diffY = abs(uv.y - intersectY);

    vec2 st = uv;
    
    float degreesModulo = mod(degrees, 360.0);

    if(degreesModulo >= 0.0 && degreesModulo < 90.0) {
      if(uv.x < intersectX || uv.y > intersectY) {
        st.x = intersectX - diffX/((diffX + 1.0) + diffX * amt * 4.0);
        st.y = intersectY + diffY/((diffY + 1.0) + diffY * amt * 4.0);
      }
    }
    else if(degreesModulo >= 90.0 && degreesModulo < 180.0) {
      if(uv.x > intersectX || uv.y > intersectY) {
        st.x = intersectX + diffX/((diffX + 1.0) + diffX * amt * 4.0);
        st.y = intersectY + diffY/((diffY + 1.0) + diffY * amt * 4.0);
      }
    }
    else if(degreesModulo >= 180.0 && degreesModulo < 270.0) {
      if(uv.x > intersectX || uv.y < intersectY) {
        st.x = intersectX + diffX/((diffX + 1.0) + diffX * amt * 4.0);
        st.y = intersectY - diffY/((diffY + 1.0) + diffY * amt * 4.0);
      }
    }
    else if(degreesModulo >= 270.0 && degreesModulo < 360.0) {
      if(uv.x < intersectX || uv.y < intersectY) {
        st.x = intersectX - diffX/((diffX + 1.0) + diffX * amt * 4.0);
        st.y = intersectY - diffY/((diffY + 1.0) + diffY * amt * 4.0);
      }
    }

    color = texture(uTexture, st);


    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},angle:{name:"uAngle",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,properties:{amount:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},angle:{label:"Angle",value:.5,min:0,max:1,step:.0027,output:"degrees"}}},gi={id:"duotone",label:"Duotone",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uMix;
  ${T}

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    
    // Convert to grayscale
    vec4 color = texture(uTexture, uv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    // Map grayscale to duotone gradient
    vec3 duotoneColor = mix(uColor1, uColor2, gray);
    
    // Output final color
    color = vec4(mix(color.rgb, duotoneColor, uMix), color.a);
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{color1:{name:"uColor1",type:"3f",value:new _(.5,0,.5)},color2:{name:"uColor2",type:"3f",value:new _(0,1,1)},mix:{name:"uMix",type:"1f",value:1},...w}},aspectRatio:1,properties:{color1:{label:"Color 1",value:new _(0,0,0),output:"color"},color2:{label:"Color 2",value:new _(1,0,1),output:"color"},mix:{label:"Mix",value:1,min:.01,max:1,step:.01,output:"percent"}}},vi={id:"swirl",label:"Swirl",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uRadius;
  uniform float uAngle;
  uniform float uPhase;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    float angle = uAngle * 10.; 
    uv -= uPos;
    vec2 R = vec2(uv.x * uResolution.x/uResolution.y, uv.y);
    float rot = atan(R.y, R.x) + angle * smoothstep(uRadius, 0., length(R));
    float rad = length(R);
    uv = rad * vec2(cos(rot + uTime/20. + uPhase*6.28), sin(rot + uTime/20. + uPhase*6.28)) + uPos;
    vec4 color = texture(uTexture, uv);
    ${C("color")}
  }
`,crossorigin:"Anonymous",vertexShader:A,texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{radius:{name:"uRadius",type:"1f",value:.5},angle:{name:"uAngle",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:0},phase:{name:"uPhase",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{angle:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"},radius:{label:"Radius",value:.5,min:0,max:1,step:.01,output:"percent"},pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},phase:{label:"Rotation",value:0,min:0,max:1,step:.0027,output:"degrees"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},xi=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 uTextureMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uTime;
  uniform float uPhase;
  uniform float uFrequency;
  uniform float uTurbulence;
  uniform float uDirection;
  uniform vec2 uPos;
  ${T}
  
  ${Wt}
  
  void main()
  {	
    vec3 vertexPosition = aVertexPosition;
    vec2 textureCoord = (vertexPosition.xy+1.) / 2.;
    
    vec2 st = vec2(textureCoord.x * uResolution.x/uResolution.y + (1. - uPos.x), textureCoord.y + 1. - uPos.y);
    vec4 noise = bccNoiseDerivatives_XYBeforeZ(vec3((st - 1.) * vec2(uDirection, 1.-uDirection) * 9. * uFrequency, uPhase + uTime/40.));
    st.xy = mix(textureCoord, (noise.xy/7. + 0.5), uTurbulence);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
    
    vTextureCoord = (uTextureMatrix * vec4(st, 0.0, 1.0)).xy;
    vVertexPosition = ((noise.xyz) / 7. + 0.5)* uTurbulence;
  }
`,_i={id:"noise",label:"Noise",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec2 vTextureCoord;
  in vec3 vVertexPosition;

  uniform sampler2D uTexture;
  ${T}

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    ${C("color")}
  }
`,vertexShader:xi,widthSegments:250,heightSegments:250,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{turbulence:{name:"uTurbulence",type:"1f",value:.5},frequency:{name:"uFrequency",type:"1f",value:.2},direction:{name:"uDirection",type:"1f",value:.5},phase:{name:"uPhase",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:1},...w}},animation:{active:!1,speed:1},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},frequency:{label:"Scale",value:.2,min:.01,max:1,step:.01,output:"percent"},turbulence:{label:"Amplitude",value:.5,min:.01,max:1,step:.01,output:"percent"},direction:{label:"Direction",value:.5,min:.01,max:1,step:.01,output:"percent"},phase:{label:"Time",value:0,min:0,max:1,step:.01},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"},mousePos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent",hidden:!0}}},yi=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 uTextureMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uAmount;
  uniform float uScale;
  uniform float uPhase;
  uniform float uEasing;
  uniform float uTime;
  uniform vec2 uPos;
  ${T}

  // https://www.shadertoy.com/view/4sc3z2

  ${me}

  mat4 rotation(float angle) {
    return mat4(
        vec4( cos(angle), -sin(angle), 0.0,  0.0 ),
        vec4( sin(angle), cos(angle),  0.0,  0.0 ),
        vec4( 0.0,        0.0,         1.0,  0.0 ),
        vec4( 0.0,        0.0,         0.0,  1.0 ) ); 
  }

  const float MAX_ITERATIONS = 30.0;
  
  void main()
  {	
    vec3 vertexPosition = aVertexPosition;
    vec3 waveCoord = vertexPosition;
    float cumval = 0.;
    float spr = uScale / ((uResolution.x/uResolution.y + 1.) / 2.);
    float time = uPhase*10. + uTime/20.;

    float value = perlin_noise(vec3((waveCoord.xy + uPos) * (vec2(0.2, 1.) * (1. + spr * 10.)), time)) * uAmount*1.;

    waveCoord.z = 0.;
    waveCoord.y += mix(value, smoothstep(-1., 0., value) - 1., uEasing);
    waveCoord.x += value/50.;
    
    if(vertexPosition.x == 1.) {
        waveCoord.x = 1.;
    }
    if(vertexPosition.x == -1.) {
        waveCoord.x = -1.;
    }
    if(vertexPosition.y == 1.) {
        waveCoord.y = 1.;
    }
    if(vertexPosition.y == -1.) {
        waveCoord.y = -1.;
    }

    gl_Position = uPMatrix * uMVMatrix * rotation(3.14159) * vec4(vec3(waveCoord), 1.0);

    vTextureCoord = aTextureCoord - vec2(0, mix(value, smoothstep(-1., 0., value) - 1., uEasing));
    vVertexPosition = vertexPosition;
  }
`,bi={id:"noiseField",label:"Waves",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  ${T}

  out vec4 fragColor;

  void main() {
    vec2 uv = vTextureCoord;
    uv = vec2(
        1. - uv.x,
        1. - uv.y
    );
    vec4 color = texture(uTexture, uv);
    ${C("color")}
  }
`,crossorigin:"Anonymous",vertexShader:yi,widthSegments:100,heightSegments:100,texturesOptions:{floatingPoint:S},uniforms:{amount:{name:"uAmount",type:"1f",value:.5},spread:{name:"uScale",type:"1f",value:.5},easing:{name:"uEasing",type:"1f",value:.5},phase:{name:"uPhase",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:.5},properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},spread:{label:"Scale",value:.5,min:0,max:1,step:.01,output:"percent"},amount:{label:"Amplitude",value:.5,min:.01,max:1,step:.01,output:"percent"},easing:{label:"Easing",value:.5,min:0,max:1,step:.01,output:"percent"},phase:{label:"Time",value:0,min:.01,max:1,step:.01,output:"percent"},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},Ti={id:"pixelate",label:"Pixelate",params:{fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform vec2 uPos;
  ${T}

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    float aspectRatio = uResolution.x/uResolution.y;
    vec2 modulate = mod(vec2(uv.x * aspectRatio, uv.y) - uPos, (uAmount + 0.01) / 12.);
    vec2 pixelatedCoord = vec2(
      uv.x - modulate.x / aspectRatio + (0.08333 * uAmount)/2.,
      uv.y - modulate.y + (0.08333 * uAmount)/2.
    );
    vec4 color = texture(uTexture, pixelatedCoord);
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{amount:{name:"uAmount",type:"1f",value:0},pos:{name:"uPos",type:"2f",value:new f(.5)},...w}},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},amount:{label:"Amount",value:.5,min:0,max:1,step:.01,output:"percent"}}},Pi={id:"replicate",label:"Replicate",params:{fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uSpacing;
uniform float uAngle;
uniform float uTime;
uniform float uRepeatCount; // New uniform to control the number of repetitions
${T}

out vec4 fragColor;

void main() {
    vec2 uv = vTextureCoord;
    float rotation = (uAngle * 360.) * 3.1415926 / 180.;
    vec2 aberrated = vec2(0);
    vec4 col = vec4(0);
    float repeatSpacing = uSpacing/10.;
    for(float i = 0.; i < uRepeatCount; i++){
        aberrated = vec2(repeatSpacing * (i - uRepeatCount/2. + fract(uTime/40.)) * sin(rotation) * uResolution.x/uResolution.y, 
                                  repeatSpacing * (i - uRepeatCount/2. + fract(uTime/40.)) * cos(rotation));
        col += texture(uTexture, uv + aberrated) * (1. - col.a);
    }
    
    ${C("col")}
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S,premultiplyAlpha:!0},uniforms:{amount:{name:"uSpacing",type:"1f",value:.5},angle:{name:"uAngle",type:"1f",value:0},repeatCount:{name:"uRepeatCount",type:"1f",value:16},time:{name:"uTime",type:"1f",value:0},...w}},aspectRatio:1,animation:{active:!1,speed:1},properties:{amount:{label:"Spacing",value:1,min:0,max:1,step:.01,output:"percent"},repeatCount:{label:"Replicates",value:16,min:1,max:100,step:1,output:"number"},angle:{label:"Angle",value:0,min:0,max:1,step:.01,output:"percent"},pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent",hidden:!0},speed:{label:"Speed",value:.5,min:0,max:1,step:.01,output:"percent"}}},wi={id:"halftone",label:"Halftone",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uRotation;
  uniform float uThreshold;
  uniform float uStyle;
  uniform float uMix;
  uniform vec2 uPos;
  uniform vec3 uColor;
  ${T}

  ${ge}

  float luma(vec4 color) {
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
  }

  // modified from https://www.shadertoy.com/view/wsjGD1

  vec3 CMYKtoRGB (vec4 cmyk) {
    float c = cmyk.x;
    float m = cmyk.y;
    float y = cmyk.z;
    float k = cmyk.w;

    float invK = 1.0 - k;
    float r = 1.0 - min(1.0, c * invK + k);
    float g = 1.0 - min(1.0, m * invK + k);
    float b = 1.0 - min(1.0, y * invK + k);
    return clamp(vec3(r, g, b), 0.0, 1.0);
  }

  vec4 RGBtoCMYK (vec3 rgb) {
      float r = rgb.r;
      float g = rgb.g;
      float b = rgb.b;
      float k = min(1.0 - r, min(1.0 - g, 1.0 - b));
      vec3 cmy = vec3(0.0);
      float invK = 1.0 - k;
      if (invK != 0.0) {
          cmy.x = (1.0 - r - k) / invK;
          cmy.y = (1.0 - g - k) / invK;
          cmy.z = (1.0 - b - k) / invK;
      }
      return clamp(vec4(cmy, k), 0.0, 1.0);
  }

  float aastep(float threshold, float value) {
    float afwidth = uAmount*200. * (1./uResolution.x);
    float minval = threshold - afwidth;
    float maxval = threshold + afwidth;
    return smoothstep(minval, maxval, value);
  }

  vec2 rotate2D(vec2 st, float degrees) {
      float c = cos(radians(degrees));
      float s = sin(radians(degrees));
      return mat2(c,-s,s,c) * st;
  }

  float halftone(vec2 st, float col, float angle) {
      st *= vec2(uResolution.x/uResolution.y, 1.);
      vec2 r_st = (uAmount*200.) * rotate2D(st - uPos, angle - uRotation*360.);
      st = (2. * fract(r_st) - 1.) * 0.82;
      return aastep(uThreshold, sqrt(col) - length(st));
  }

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    vec4 cmyk = uStyle == 0. ? RGBtoCMYK(color.rgb) : color;
    float alpha = color.a;

    float k = halftone(uv, cmyk.w, 45.);
    float c = halftone(uv, cmyk.x, 15.);
    float m = halftone(uv, cmyk.y, 75.);
    float y = halftone(uv, cmyk.z, 0.);

    float rC = 1. - halftone(uv, 1. - cmyk.x, 15.);
    float rM = 1. - halftone(uv, 1. - cmyk.y, 75.);
    float rY = 1. - halftone(uv, 1. - cmyk.z, 0.);

    float g = 1. - halftone(uv, 1. - luma(color), 0.);

    vec4 halftone = uStyle == 0. ? vec4(CMYKtoRGB(vec4(c,m,y,k)), 1) : vec4(rC,rM,rY,1);
    halftone = uStyle == 2. ? vec4(mix(vec3(g), uColor, 1.-(g*g)), 1) : halftone;
    
    halftone *= color.a;

    color = mix(color, halftone, uMix);
    
    ${C("color")}
  }
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:S},uniforms:{pos:{name:"uPos",type:"2f",value:new f(.5)},style:{name:"uStyle",type:"1f",value:0},mix:{name:"uMix",type:"1f",value:0},color:{name:"uColor",type:"3f",value:new _(0)},amount:{name:"uAmount",type:"1f",value:.75},threshold:{name:"uThreshold",type:"1f",value:.5},rotation:{name:"uRotation",type:"1f",value:0},...w}},aspectRatio:1,properties:{pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},style:{label:"Style",value:0,options:{0:"CYMK",1:"RGB",2:"Monochrome"}},color:{label:"Color",value:new _(0),output:"color",conditional:{prop:"style",value:"2"}},amount:{label:"Scale",value:.75,min:0,max:1,step:.01,output:"percent"},rotation:{label:"Rotation",value:0,min:0,max:1,step:.01,output:"percent"},mix:{label:"Mix",value:1,min:0,max:1,step:.01,output:"percent"},threshold:{label:"Threshold",value:0,min:-.5,max:.5,step:.01,output:"percent"}}},Si={id:"pattern",label:"Pattern",params:{fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform float uWeight;
  uniform float uScale;
  uniform float uAngle;
  uniform int uPattern;
  uniform vec2 pos;
  uniform vec3 stroke;
  uniform float uBlendMode;
  ${T}
  ${he}

  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float grid(vec2 st, float tile) {
    float result = 0.;
    result = fract(st.x) < tile ? 1. : 0.;
    if(result == 0.) {
      result += fract(st.y) < tile ? 1. : 0.;
    }
    return result;
  }

  float stripe(vec2 st, float tile) {
    return fract(st.x) < tile ? 1. : 0.;
  }

  float arrows(vec2 st, float tile) {
    float s = fract(st.y) < mod(floor(st.x + st.y), 2.) ? st.x : st.y;
    return mod(floor(s), 2.);
  }

  float concentric_circle( vec2 st, float tile ) {
      return fract(length(st) - tile/2.) < tile ? 1. : 0.;
  }

  float circle(vec2 st, float tile) {
    vec2 gridPos = floor(st);
    vec2 cellPos = fract(st);
    return (length(cellPos - 0.5) < tile * 0.5) ? 1. : 0.;
  }


  float checkerboard(vec2 st, float tile){
    vec2 pos = floor(st); 
    return mod(pos.x+pos.y,2.0);
  }

  // 2. Wavy lines pattern
  float wavy_lines(vec2 st, float tile) {
    float value = sin(st.x * 3.1415926 * 2.0 + st.y * 10.0) * 0.5 + 0.5;
    return value < tile ? 1. : 0.;
  }

  // 3. Hexagonal pattern
  float hexagonal_pattern(vec2 st, float tile) {
    const float sqrt3 = 1.7320508;
    vec2 hexSize = vec2(1.0, sqrt3) * tile;
    vec2 grid = fract(st / hexSize);
    vec3 grid3 = vec3(grid, grid.y * 0.5);
    vec3 corner = round(grid3);
    vec3 v1 = abs(grid3 - corner);
    vec3 v2 = abs(grid3 + vec3(-0.5, sqrt3 * 0.5, 0.0) - corner);
    vec3 v3 = abs(grid3 + vec3(0.5, sqrt3 * 0.5, 0.0) - corner);
    vec3 dist = min(min(v1, v2), v3);
    return (dist.x + dist.y) < tile * 0.5 ? 1. : 0.;
  }

  // 4. Diamond pattern
  float diamond_pattern(vec2 st, float tile) {
    vec2 diamond_coord = abs(st * 2.0);
    return (diamond_coord.x + diamond_coord.y) < tile ? 1. : 0.;
  }

  // 5. Spiral pattern
  float spiral_pattern(vec2 st, float tile) {
    float r = length(st);
    float theta = atan(st.y, st.x);
    float spiral = mod(theta + r * 5.0, 3.1415926 * 2.0) - 3.1415926;
    return abs(spiral) < tile ? 1. : 0.;
  }

  out vec4 fragColor;
  
  void main() {
    vec2 uv = vTextureCoord;
    vec4 bg = texture(uTexture, uv);
    vec4 color = vec4(stroke,0.);
    float px = (1./uResolution.x);
    float py = (1./uResolution.y);
    float scl = (40. * uScale);
    float tile = (px + uWeight/scl)*scl;
    tile = round(tile / px) * px;

    vec2 st = (uv - pos) * scl * rotate2d(uAngle * 360. * 3.1415926 / 180.) * vec2(uResolution.x/uResolution.y, 1);

    if(uPattern == 0) {
      color.a = grid(st, tile);
    }
    if(uPattern == 1) {
      color.a = stripe(st, tile);
    }
    if(uPattern == 2) {
      color.a = circle(st, tile);
    }
    if(uPattern == 3) {
      color.a = concentric_circle(st, tile);
    }
    if(uPattern == 4) {
      color.a = arrows(st, tile);
    }
    if(uPattern == 5) {
      color.a = checkerboard(st, tile);
    }
    if (uPattern == 6) {
      color.a = wavy_lines(st, tile);
    }
    if (uPattern == 7) {
      color.a = hexagonal_pattern(st, tile);
    }
    if (uPattern == 8) {
      color.a = diamond_pattern(st, tile);
    }
    if (uPattern == 9) {
      color.a = spiral_pattern(st, tile);
    }

    
    if(uBlendMode > 0.) {
      color.rgb = blend(uBlendMode, color.rgb, bg.rgb);
    }
    
    fragColor = mix(bg, color, color.a);
  }
`,vertexShader:Xt,crossorigin:"Anonymous",hidden:!0,texturesOptions:{floatingPoint:S},uniforms:{weight:{name:"uWeight",type:"1f",value:0},scale:{name:"uScale",type:"1f",value:0},stroke:{name:"stroke",type:"3f",value:new _(.5)},pos:{name:"pos",type:"2f",value:new f(.5)},angle:{name:"angle",type:"1f",value:0},pattern:{name:"uPattern",type:"1i",value:0},blendMode:{name:"uBlendMode",type:"1f",value:0},...w}},aspectRatio:1,properties:{pattern:{label:"Pattern",value:0,options:{0:"Grid",5:"Checkerboad",1:"Stripes",2:"Dots",3:"Circles",4:"Arrows",5:"Checkerboard",9:"Spiral"}},pos:{label:"Position",value:new f(.5),min:0,max:1,step:.01,output:"percent"},weight:{label:"Weight",value:.01,min:0,max:1,step:.01,output:"percent"},scale:{label:"Scale",value:.5,min:0,max:1,step:.001,output:"percent"},angle:{label:"Angle",value:0,min:0,max:1,step:.0027,output:"degrees"},stroke:{label:"Fill",value:new _(.98,.12,.89),output:"color"},blendMode:{label:"Blend mode",value:"NORMAL",options:se}}},Ci={fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uBgTexture;
uniform sampler2D uPingPongTexture;

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec4 mouseTrail = texture(uPingPongTexture, uv);
  mouseTrail = mix(vec4(0,0,0,1), mouseTrail, mouseTrail.a);
  vec4 color = vec4(1);

  color.rgb = mix(
    texture(uBgTexture, uv).rgb,
    texture(uTexture, uv).rgb,
    smoothstep(0., 1., mouseTrail.r)
  );

  fragColor = color;
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"none",premultiplyAlpha:!0},uniforms:{resolution:{name:"uResolution",type:"1f",value:new f(1080)}}},Ri={fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;

uniform sampler2D uBgTexture;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uDissolve;

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec4 color = texture(uTexture, uv);
  vec4 background = texture(uBgTexture, uv);
  
  color = mix(background, color, color.a * uOpacity);
  
  float thresh = 1.-background.r > (1.-uDissolve)/2. + 0.5 ? 1. : 0.;
    
  color = mix(color, background, thresh);
  
  fragColor = color/(color.a + 0.0000000000001);
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"none",premultiplyAlpha:!0},uniforms:{opacity:{name:"uOpacity",type:"1f",value:1},dissolve:{name:"uDissolve",type:"1f",value:0}}},Ai={fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;

uniform float uAspectRatio;
uniform sampler2D uBgTexture;
uniform sampler2D uMaskTexture;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uBlendMode;
uniform float uBgDisplace;
uniform float uDisplace;
uniform float uDissolve;
uniform float uDispersion;
uniform float uMask;

${he}

const float STEPS = 30.0;
const float PI = 3.1415926;

vec3 chromaticAbberation(vec2 st, float angle, float amount, float blend) {
  float rotation = angle * 360.0 * PI / 180.0;
  vec2 aberrated = amount * vec2(0.1 * sin(rotation) * uAspectRatio, 0.1 * cos(rotation));
  aberrated *= distance(st, vec2(0.5)) * 2.0;

  vec4 red = vec4(0);
  vec4 blue = vec4(0);
  vec4 green = vec4(0);

  float invSteps = 1.0 / STEPS;
  float invStepsHalf = invSteps * 0.5;

  for(float i = 0.0; i <= STEPS; i++) {
    vec2 offset = aberrated * (i * invSteps);
    red += texture(uBgTexture, st - offset) * invSteps;
    blue += texture(uBgTexture, st + offset) * invSteps;
    green += texture(uBgTexture, st - offset * 0.5) * invStepsHalf;
    green += texture(uBgTexture, st + offset * 0.5) * invStepsHalf;
  }

  return vec3(red.r, green.g, blue.b);
}

vec3 refrakt(vec3 eyeVector, vec3 normal, float iorRatio) {
  float dotProduct = dot(eyeVector, normal);
  float k = 1.0 - iorRatio * iorRatio * (1.0 - dotProduct * dotProduct);
  
  // Handle total internal reflection
  if (k < 0.0) {
    // Calculate reflection instead
    return reflect(eyeVector, normal);
  } else {
    // Calculate refraction
    return iorRatio * eyeVector - (iorRatio * dotProduct + sqrt(k)) * normal;
  }
}

vec4 displacement (vec2 st, vec4 bg, vec4 color) {
  if(uBgDisplace == 1.0) {
    vec2 refraction = refrakt(vec3(st, 1. + uDisplace), color.rgg, uDisplace).xy;
    vec2 displaced = st + refraction * 0.05;
    vec4 bgDisp = texture(uBgTexture, displaced);
    bgDisp.rgb = uDispersion == 1.0 ? chromaticAbberation(displaced, atan(displaced.y, displaced.x)-0.25, uDisplace/2., 1.0) : bgDisp.rgb;
    return bgDisp * color.a;
  } else {
    vec2 normal = vec2(bg.r * 2.0 - 1.0, bg.g * 2.0 - 1.0) * 0.1; // Convert the color range from [0, 1] to [-1, 1]
    if(uMask == 1.) {
      return texture(uMaskTexture, st + normal * uDisplace) * texture(uTexture, st + normal * uDisplace).a;
    } else {
      return texture(uTexture, st + normal * uDisplace);
    }
  }
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;

  // Sample the mask, color, and background textures.
  vec4 maskColor = texture(uMaskTexture, uv);
  vec4 base = texture(uTexture, uv);
  vec4 background = texture(uBgTexture, uv);
  vec4 color = base;

  // If the mask is active, replace the color with the maskColor.
  if (uMask == 1.) {
    color = maskColor * color.a;
  }

  // Apply displacement if required.
  if (uDisplace > 0.0) {
    if(uMask == 1.) {
      color = displacement(uv, background, uBgDisplace == 1. ? color : maskColor);
    } else {
      color = displacement(uv, background, color);
    }
  }

  // Apply blend mode if required.
  if (uBlendMode > 0.0) {
    color.rgb = blend(uBlendMode, color.rgb, background.rgb) * color.a;
  }

  // Blend the color with the background using the color's alpha and the overall opacity.
  color = mix(background, color, color.a * uOpacity);

  // Apply the dissolve effect.
  float thresh = 1.-background.r > (1.-uDissolve)/2. + 0.5 ? 1. : 0.;
  color = mix(color, background, thresh);

  // Correct the color by its alpha to prevent artifacts when alpha is near zero.
  if(color.a > 0.0000001) {
    fragColor = color / color.a;
  } else {
    fragColor = color;
  }
}
`,vertexShader:A,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"none",premultiplyAlpha:!0},uniforms:{dispersion:{name:"uDispersion",type:"1f",value:0},displace:{name:"uDisplace",type:"1f",value:0},bgDisplace:{name:"uBgDisplace",type:"1f",value:0},aspectRatio:{name:"uAspectRatio",type:"1f",value:1},opacity:{name:"uOpacity",type:"1f",value:1},dissolve:{name:"uDissolve",type:"1f",value:0},mask:{name:"uMask",type:"1f",value:0},blendMode:{name:"uBlendMode",type:"1f",value:0}}},V={custom:jt,coloration:Ht,bokeh:qt,blinds:Yt,bloom:$t,blur:Kt,chromab:Zt,diffuse:Qt,dither:Jt,duotone:gi,neon:ei,fbm:ti,flowField:ii,godrays:si,texturize:ri,grain:ai,hologram:oi,liquify:li,mirror:ui,mouse:ni,ripple:hi,voronoi:ci,sine:fi,sphere:pi,scan:mi,swirl:vi,halftone:wi,noise:_i,noiseField:bi,pixelate:Ti,pattern:Si,replicate:Pi},Mi=a=>{var e=(a[0]+16)/116,t=a[1]/500+e,i=e-a[2]/200,s,r,o;return t=.95047*(t*t*t>.008856?t*t*t:(t-16/116)/7.787),e=1*(e*e*e>.008856?e*e*e:(e-16/116)/7.787),i=1.08883*(i*i*i>.008856?i*i*i:(i-16/116)/7.787),s=t*3.2406+e*-1.5372+i*-.4986,r=t*-.9689+e*1.8758+i*.0415,o=t*.0557+e*-.204+i*1.057,s=s>.0031308?1.055*Math.pow(s,1/2.4)-.055:12.92*s,r=r>.0031308?1.055*Math.pow(r,1/2.4)-.055:12.92*r,o=o>.0031308?1.055*Math.pow(o,1/2.4)-.055:12.92*o,[Math.max(0,Math.min(1,s))*255,Math.max(0,Math.min(1,r))*255,Math.max(0,Math.min(1,o))*255]},Ei=a=>{var e=a[0]/255,t=a[1]/255,i=a[2]/255,s,r,o;return e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92,t=t>.04045?Math.pow((t+.055)/1.055,2.4):t/12.92,i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92,s=(e*.4124+t*.3576+i*.1805)/.95047,r=(e*.2126+t*.7152+i*.0722)/1,o=(e*.0193+t*.1192+i*.9505)/1.08883,s=s>.008856?Math.pow(s,1/3):7.787*s+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,[116*r-16,500*(s-r),200*(r-o)]},Oe=(a,e,t)=>"#"+((1<<24)+(a<<16)+(e<<8)+t).toString(16).slice(1),Be=a=>a.reduce((e,t)=>e+t,0),ki=(a,e)=>Be(a.map((t,i)=>t*e[i]))/Be(e),ve=a=>{var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;a=a.replace(e,function(i,s,r,o){return s+s+r+r+o+o});var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:null};class Li{constructor(){this.grads=[["#000000","#151515","#292929","#464646","#646464","#7D7D7D","#9D9D9D","#B7B7B7","#D0D0D0","#EEEEEE","#FFFFFF"]],this.swatches=Object.values(It);for(let e=0;e<this.swatches.length;e++)this.grads.push(this.swatches[e]);for(let e=0;e<this.swatches.length;e++){const t=[];for(let i=0;i<5;i++)t.push(this.swatches[e-i<0?e-i+11:e-i][8-i]);this.grads.push(t)}for(let e=0;e<this.swatches.length;e+=2){const t=[];for(let i=0;i<6;i++)t.push(this.swatches[e-i<0?e-i+11:e-i][8]);this.grads.push(t)}this.grads.push(this.swatches.map(e=>e[6]))}getSimilarValueIndex(e){let t=!1;return this.swatches.forEach(i=>{i.includes(...e)&&(t=i.indexOf(...e))}),t}getSimilarColors(e){const t=this.getSimilarValueIndex(e);return t?this.swatches.map(i=>i[t]):e}getRandomSimilarColor(e){const t=this.getSimilarColors(e);if(t){let i=t[Z(0,t.length-1)];for(;e===i;)i=t[Z(0,t.length-1)];return i}else return e}getBand(e,t){const i=[];let s=this.swatches[Z(1,this.swatches.length)],r=s[Z(3,s.length)],o=Ei(ve(r));for(let n=0;n<e;n++){for(let u=0;u<3;u++){let l;u===0?(l=(.5-Math.random())*t/2,o[u]+=o[u]+l>100&&o[u]-l>0?-l:l):(l=(.5-Math.random())*t,o[u]+=o[u]+l>160&&o[u]-l>-160?-l:l)}i.push(Oe(...Mi(o).map(u=>Math.round(u))))}return i}randomFill(e,t){let i=e;if(e.length>1)i=this.getBand(Z(2,8),Z(80,280));else if(t)i=[this.getRandomSimilarColor(e)];else for(i=this.swatches[Z(0,this.swatches.length-1)],i=[i[Z(0,i.length-1)]];e===i;)i=[i[Z(0,i.length-1)]];return i}}new Li,function(a){var e={};function t(i){if(e[i])return e[i].exports;var s=e[i]={i,l:!1,exports:{}};return a[i].call(s.exports,s,s.exports,t),s.l=!0,s.exports}t.m=a,t.c=e,t.d=function(i,s,r){t.o(i,s)||Object.defineProperty(i,s,{enumerable:!0,get:r})},t.r=function(i){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:!0})},t.t=function(i,s){if(1&s&&(i=t(i)),8&s||4&s&&typeof i=="object"&&i&&i.__esModule)return i;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:i}),2&s&&typeof i!="string")for(var o in i)t.d(r,o,function(n){return i[n]}.bind(null,o));return r},t.n=function(i){var s=i&&i.__esModule?function(){return i.default}:function(){return i};return t.d(s,"a",s),s},t.o=function(i,s){return Object.prototype.hasOwnProperty.call(i,s)},t.p="",t(t.s=0)}([function(a,e,t){var i=this&&this.__spreadArray||function(n,u){for(var l=0,c=u.length,d=n.length;l<c;l++,d++)n[d]=u[l];return n};Object.defineProperty(e,"__esModule",{value:!0}),e.ConicalGradient=void 0;var s=t(1);function r(n,u,l,c,d,g,m){u===void 0&&(u=[[0,"#fff"],[1,"#fff"]]),l===void 0&&(l=0),c===void 0&&(c=0),d===void 0&&(d=0),g===void 0&&(g=2*Math.PI),m===void 0&&(m=!1);var y=Math.floor(180*d/Math.PI),v=Math.ceil(180*g/Math.PI),b=document.createElement("canvas");b.width=n.canvas.width,b.height=n.canvas.height;var x=b.getContext("2d"),P=[[0,0],[n.canvas.width,0],[n.canvas.width,n.canvas.height],[0,n.canvas.height]],M=Math.max.apply(Math,P.map(function(U){var Y=U[0],$=U[1];return Math.sqrt(Math.pow(Y-l,2)+Math.pow($-c,2))}))+10;x.translate(l,c);for(var k=2*Math.PI*(M+20)/360,L=new s.default(u,v-y+1),E=y;E<=v;E++)x.save(),x.rotate((m?-1:1)*(Math.PI*E)/180),x.beginPath(),x.moveTo(0,0),x.lineTo(M,-2*k),x.lineTo(M,0),x.fillStyle=L.getColor(E-y),x.fill(),x.closePath(),x.restore();var R=document.createElement("canvas");R.width=n.canvas.width,R.height=n.canvas.height;var z=R.getContext("2d");return z.beginPath(),z.arc(l,c,M,d,g,m),z.lineTo(l,c),z.closePath(),z.fillStyle=z.createPattern(b,"no-repeat"),z.fill(),n.createPattern(R,"no-repeat")}e.default=r,CanvasRenderingContext2D.prototype.createConicalGradient=function(){for(var n=[],u=0;u<arguments.length;u++)n[u]=arguments[u];var l=this,c={stops:[],addColorStop:function(d,g){this.stops.push([d,g])},get pattern(){return r.apply(void 0,i([l,this.stops],n))}};return c};var o=t(2);Object.defineProperty(e,"ConicalGradient",{enumerable:!0,get:function(){return o.ConicalGradient}})},function(a,e,t){Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function s(r,o){r===void 0&&(r=[]),o===void 0&&(o=100);var n=document.createElement("canvas");n.width=o,n.height=1,this.ctx=n.getContext("2d");for(var u=this.ctx.createLinearGradient(0,0,o,0),l=0,c=r;l<c.length;l++){var d=c[l];u.addColorStop.apply(u,d)}this.ctx.fillStyle=u,this.ctx.fillRect(0,0,o,1),this.rgbaSet=this.ctx.getImageData(0,0,o,1).data}return s.prototype.getColor=function(r){var o=this.rgbaSet.slice(4*r,4*r+4);return"rgba("+o[0]+", "+o[1]+", "+o[2]+", "+o[3]/255+")"},s}();e.default=i},function(a,e,t){Object.defineProperty(e,"__esModule",{value:!0})}]);const xe=(a,e,t,i,s)=>{var r=Math.PI/180*s,o=Math.cos(r),n=Math.sin(r),u=o*(t-a)+n*(i-e)+a,l=o*(i-e)-n*(t-a)+e;return[+u.toFixed(1),+l.toFixed(1)]},re=(a,e)=>{const t=e||1,i=Math.min(...a.map(l=>l[0])),s=Math.max(...a.map(l=>l[0])),r=Math.min(...a.map(l=>l[1])),o=Math.max(...a.map(l=>l[1])),n=Math.abs(s-i),u=Math.abs(o-r);return{width:Math.round(n/t),height:Math.round(u/t),aspectRatio:n/t/(u/t),center:{x:Math.round((n/2+i)/t),y:Math.round((u/2+r)/t)},corners:[[i,r],[s,r],[s,o],[i,o]]}},Ve=(a,e)=>{const t=e.size/2;let i,s=e.fill;if(s.length>1){let r=Math.sqrt(Math.pow(t,2),Math.pow(t,2)),o=e.gradientAngle?+e.gradientAngle*2*Math.PI:0;if(!e.gradientType||e.gradientType==="linear"||e.gradientType==="radial")e.gradientType==="radial"?i=a.createRadialGradient(e.x,e.y,t,e.x,e.y,0):i=a.createLinearGradient(e.x-Math.cos(o)*r,e.y-Math.sin(o)*r,e.x+Math.cos(o)*r,e.y+Math.sin(o)*r),s.forEach((n,u)=>{i.addColorStop(u*(1/(s.length-1)),n)});else if(e.gradientType==="conic"){i=a.createConicalGradient(e.x,e.y,-Math.PI+o,Math.PI+o);const n=[...s,...s.slice().reverse()];n.forEach((u,l)=>{i.addColorStop(l*(1/(n.length-1)),u)}),i=i.pattern}}else i=s[0];return i},Ne=(a,e,t)=>{let i;const s=re(t);if(e.fill.length>1){let r=e.gradientAngle?+e.gradientAngle*2*Math.PI:0,o=s.center.x,n=s.center.y;if(e.gradientType==="radial"&&(i=a.createRadialGradient(o,n,Math.max(s.width,s.height)*.7,o,n,0)),e.gradientType==="linear"&&(i=a.createLinearGradient(o-Math.cos(r)*s.width/2,n-Math.sin(r)*s.height/2,o+Math.cos(r)*s.width/2,n+Math.sin(r)*s.height/2)),e.gradientType==="conic"){i=a.createConicalGradient(o,n,-Math.PI+r,Math.PI+r);const u=[...e.fill,...e.fill.slice().reverse()];u.forEach((c,d)=>{i.addColorStop(d*(1/(u.length-1)),c)}),document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGMatrix(),i=i.pattern}else e.fill.forEach((u,l)=>{i.addColorStop(l*(1/(e.fill.length-1)),u)})}else i=e.fill[0];return i},Ue={circle:(a,e)=>{a.arc(e.x,e.y,e.size/2,0,2*Math.PI,!1)},custom:(a,e)=>{let t=e.coords;const i=e.box||re(t.flat());let s=Math.max(i.width,i.height);for(let r=0;r<t.length;r++){const o=t[r].length;a.moveTo(...xe(e.x,e.y,t[r][0][0]*e.size/s+e.x,t[r][0][1]*e.size/s+e.y,e.rotation));for(let n=0;n<o;n++)a.lineTo(...xe(e.x,e.y,t[r][n][0]*e.size/s+e.x,t[r][n][1]*e.size/s+e.y,e.rotation))}}},Fi=(a,e,t,i,s,r)=>{const o=a.getContext("2d");return a.width=e.size*i*s,a.height=e.size*i*s,o.scale(s*i,s*i),e.x=a.width/(2*i*s),e.y=a.height/(2*i*s),o.fillStyle=Ve(o,e),o.fillRect(0,0,a.width,a.height),o.globalCompositeOperation="destination-in",e.type in Ue&&(Ue[e.type](o,e),o.fill()),a},h={canvasWidth:window.innerWidth/2,canvasHeight:window.innerHeight/2,curtain:void 0,curtainRaf:void 0,dpi:window.devicePixelRatio||1.5,history:[],initialized:!1,loading:!0,mouse:{downPos:{x:0,y:0},movePos:{x:0,y:0},lastPos:{x:0,y:0},delta:{x:0,y:0},dragging:!1,trail:[],pos:{x:window.innerWidth/2,y:window.innerHeight/2}},scale:1,size:"Square",versionId:"",windowWidth:window.innerWidth,windowHeight:window.innerHeight};function H(a,e){if(e)return a;let t={};for(let i=0;i<a.length;i++)t[i]=a[i];return t}function q(a){return a&&typeof a=="string"&&(a=JSON.parse(a)),Object.values(a)}const Di=document.createElement("canvas");function zi(a){const e=a.local.boxStart||re(a.coords),t=a.getPositionOffset();let i=a.coords.map(([s,r])=>xe(e.center.x,e.center.y,s,r,-a.rotation*360));return i=i.map(([s,r])=>[Math.round(s+t.x),Math.round(r+t.y)]),i}function Ii(a){return{x:Math.sqrt(h.canvasWidth/h.canvasHeight/a),y:Math.sqrt(h.canvasHeight/h.canvasWidth*a)}}function Ge(a,e,t){for(let i=0;i<t;i++)a=(a+e)/2;return+((a+e)/2).toFixed(2)}class ae{constructor(e,t){B(this,"local",{id:""});this.visible=e.visible!==void 0?e.visible:!e.hidden||!0,this.locked=e.locked||!1,this.blendMode=e.blendMode||"NORMAL",this.aspectRatio=e.aspectRatio||1,this.opacity=e.opacity||1,this.displace=e.displace||0,this.dissolve=e.dissolve||0,this.bgDisplace=e.bgDisplace||0,this.dispersion=e.dispersion||0,this.local.id=t||Ot()}getIndex(){return h.history.map(e=>e.local.id).indexOf(this.local.id)}update(){this.blendMode!=="NORMAL"?this.local.plane.uniforms.blendMode.value=Object.keys(se).indexOf(this.blendMode):this.local.plane.uniforms.blendMode.value=0,this.effects&&this.layerType!=="image"?this.local.effects&&this.local.effects.filter(e=>e.visible).length&&(this.local.plane.visible=!1):this.local.plane.visible=this.visible}deselect(){this.local.isSelected=!1,this.justCreated&&(this.justCreated=!1)}createLocalCanvas(){const e=document.createElement("canvas"),t=h.scale*h.dpi;e.width=h.canvasWidth*t,e.height=h.canvasHeight*t;const i=e.getContext("2d");i.scale(t,t),this.local.canvas=e,this.local.ctx=i}resize(e){const t=(e||h.scale)*h.dpi;this.local.canvas&&(this.local.canvas.width=h.canvasWidth*t,this.local.canvas.height=h.canvasHeight*t,this.local.ctx.scale(t,t))}getPlane(){return h.curtain.planes.find(e=>e.userData.id===this.local.id)}getPlanes(){return h.curtain.planes.filter(e=>e.userData.id===this.local.id)}getMaskedItem(){return this.mask?h.history.filter(e=>e.visible&&!e.parentLayer)[this.getIndex()-1]:!1}getChildEffectItems(){return this.effects?h.history.filter(e=>e.visible&&e.parentLayer&&this.effects.includes(e.parentLayer)):[]}getPositionOffset(){const e=this.aspectRatio/h.canvasWidth/h.canvasHeight,t=h.canvasWidth*Math.sqrt(e),i=h.canvasHeight/Math.sqrt(e);let s=(h.canvasWidth-t)/2,r=(h.canvasHeight-i)/2;this.layerType==="image"&&(s+=t/2,r+=i/2);let o=this.translateX+s,n=this.translateY+r;return{x:o,y:n,offX:s,offY:r}}}class _e extends ae{constructor(t,i){super(t,i);B(this,"layerType","draw");B(this,"isElement",!0);let s=this.default(t||{});for(let r in s)this[r]=s[r];Object.keys(t).length&&this.createLocalCanvas()}default(t){return{displace:t.displace||0,bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,dissolve:t.dissolve||0,blendMode:"NORMAL",opacity:t.opacity||1,type:t.type||"circle",mask:t.mask||!1,brushRotation:t.brushRotation||t.rotation||0,coords:t.coords||[],effects:t.effects||[],gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",fill:t.fill||["#777777"],rotateHue:t.rotateHue||t.huerotate||!1,rotation:t.rotation||0,lerp:t.lerp||!0,size:t.size||100,translateX:t.translateX||0,translateY:t.translateY||0}}unpackage(){return this.coords=q(this.coords),this.fill=q(this.fill),this.effects=q(this.effects),this.coords.length>3?this.coordsHiRes=De(this.coords,this.size):this.coordsHiRes=this.coords,this}package(t){return{layerType:"draw",visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,blendMode:this.blendMode,bgDisplace:this.bgDisplace,mask:this.mask,dispersion:this.dispersion||0,dissolve:this.dissolve||0,type:this.type,brushRotation:this.brushRotation||0,coords:H(this.coords,t),displace:this.displace,effects:H(this.effects,t),fill:H(this.fill,t),gradientAngle:this.gradientAngle,gradientType:this.gradientType,rotateHue:this.rotateHue,lerp:this.lerp,rotation:this.rotation,opacity:this.opacity,size:this.size,translateX:this.translateX,translateY:this.translateY}}interpolatePath(){this.coordsHiRes=De(this.coords,this.size)}render(){const t=Ii(this.aspectRatio);let i=this.lerp?this.coordsHiRes||this.coords:this.coords;this.local.ctx.clearRect(0,0,h.canvasWidth,h.canvasHeight);let s=Fi(Di,{type:"circle",size:this.size/2,coords:i,rotation:this.rotation,fill:this.fill,gradientType:this.gradientType,gradientAngle:this.gradientAngle},null,h.dpi,h.scale);const r=i.length,o=this.getPositionOffset();if(this.fill.length>1&&this.rotateHue)for(let n=0;n<r;n++){let u=i[n][0]*t.x+o.x,l=i[n][1]*t.y+o.y;if(this.fill.length>1&&this.rotateHue){let c=Math.floor(n/r*this.fill.length),d=c<this.fill.length-1?c+1:0;d=d||c;const g=n/r*this.fill.length-c,m=ve(this.fill[c]).map((y,v)=>ki([y,ve(this.fill[d])[v]],[1-g,g]));this.local.ctx.beginPath(),this.local.ctx.fillStyle=Oe(...m.map(y=>Math.round(y))),this.local.ctx.arc(u,l,this.size/2,0,2*Math.PI,!1),this.local.ctx.fill()}}else for(let n=0;n<r;n++){let u=i[n][0]*t.x+o.x,l=i[n][1]*t.y+o.y;this.local.ctx.drawImage(s,u-s.width/2/h.scale,l-s.height/2/h.scale,s.width/h.scale,s.height/h.scale)}}hide(){this.visible=!1}show(){this.visible=!0}copy(t,i){return new _e(i||this,t)}}class ye extends ae{constructor(t,i){super(t,i);B(this,"layerType","fill");B(this,"isElement",!0);t=t.properties?t.properties:t,this.fill=t.fill||["#ffffff"],this.gradientAngle=t.gradientAngle||t.gradAngle||0,this.gradientType=t.gradientType||t.gradType||"linear",(!h.initialized||Object.keys(t).length)&&this.createLocalCanvas()}package(t){return{layerType:"fill",visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,fill:H(this.fill,t),gradientAngle:this.gradientAngle,gradientType:this.gradientType}}unpackage(){return this.fill=q(this.fill),this}render(){this.local.ctx.fillStyle=Ve(this.local.ctx,{size:Math.min(this.local.canvas.width,this.local.canvas.height)*(.5/h.scale),x:this.local.canvas.width/2*(.5/h.scale),y:this.local.canvas.height/2*(.5/h.scale),...this}),this.local.ctx.fillRect(0,0,this.local.canvas.width,this.local.canvas.height)}copy(t,i){return new ye(i||this,t)}}class be extends ae{constructor(t,i){super(t,i);B(this,"layerType","shape");B(this,"isElement",!0);let s=this.default(t||{});for(let r in s)this[r]=s[r];Object.keys(t).length&&this.createLocalCanvas()}default(t){return{blendMode:t.blendMode||"NORMAL",borderRadius:t.borderRadius||0,coords:t.coords||[],displace:t.displace||0,dispersion:t.dispersion||0,dissolve:t.dissolve||0,bgDisplace:t.bgDisplace||0,effects:t.effects||[],fill:t.fill||["#777777"],gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",mask:t.mask||0,opacity:t.opacity||1,rotation:t.rotation||0,translateX:t.translateX||0,translateY:t.translateY||0,type:t.type||"rectangle"}}package(t){return{layerType:"shape",visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,blendMode:this.blendMode,borderRadius:this.borderRadius,dispersion:this.dispersion,dissolve:this.dissolve,bgDisplace:this.bgDisplace,coords:H(this.coords,t),displace:this.displace,effects:H(this.effects,t),fill:H(this.fill,t),gradientAngle:this.gradientAngle,gradientType:this.gradientType,mask:this.mask,opacity:this.opacity,rotation:this.rotation,translateX:this.translateX,translateY:this.translateY,type:this.type}}unpackage(){return this.fill=q(this.fill),this.coords=q(this.coords),this.effects=q(this.effects),this}render(){let t=zi(this);if(this.local.ctx.beginPath(),this.type==="rectangle"){const i=re(this.coords);let s=this.borderRadius*Math.min(i.width,i.height)/2;const r=(n,u,l)=>{const c=Math.cos(l),d=Math.sin(l);return[n*c-u*d,n*d+u*c]},o=this.rotation*2*Math.PI;if(t.length){this.local.ctx.beginPath();let n=this.coords[0][0]<this.coords[1][0],u=this.coords[0][1]>this.coords[2][1],l=[-1,1,-1,1];n&&(l=[-1,-1,-1,-1]),u&&(l=[1,1,1,1]),n&&u&&(l=[1,-1,1,-1]);for(let c=0;c<t.length;c++){const[d,g]=t[c],[m,y]=t[(c+1)%t.length],v=(c+1)*Math.PI/2+o,[b,x]=r(s,0,v);let P=l[c];this.local.ctx.lineTo(d-b*P,g-x*P),this.local.ctx.arcTo(d,g,m,y,s)}this.local.ctx.closePath(),this.local.ctx.stroke()}}else if(this.type==="circle"){let i=re(t);const s=re(this.coords);this.local.ctx.ellipse(i.center.x,i.center.y,s.width/2,s.height/2,this.rotation*Math.PI*2,0,2*Math.PI)}this.local.ctx.fillStyle=Ne(this.local.ctx,this,t),this.local.ctx.clearRect(0,0,h.canvasWidth,h.canvasHeight),this.local.ctx.fill()}copy(t,i){return new be(i||this,t)}}class Te extends ae{constructor(t,i){super(t,i);B(this,"layerType","effect");this.type=t.type||"sine",this.type==="ungulate"&&(this.type="noise");for(let s in V[this.type].properties)this[s]=s in t?t[s]:V[this.type].properties[s].value;this.effects=[],this.parentLayer=t.parentLayer||!1,this.animating=t.animating||!1,this.isMask=t.isMask||!1,this.customFragmentShader=t.customFragmentShader||"",this.customVertexShader=t.customVertexShader||""}package(t){let i={layerType:"effect",customFragmentShader:this.customFragmentShader,customVertexShader:this.customVertexShader,visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,blendMode:this.blendMode,type:this.type,isMask:this.isMask,parentLayer:this.parentLayer,animating:this.animating};for(let s in V[this.type].properties)t?i[s]=this[s]:V[this.type].properties[s].value.type==="Vec2"?i[s]={type:this[s].type,_x:this[s]._x,_y:this[s]._y}:V[this.type].properties[s].value.type==="Vec3"?i[s]={type:"Vec3",_x:this[s]._x,_y:this[s]._y,_z:this[s]._z}:i[s]=this[s];return i}unpackage(){this.type==="blur"&&this.type,this.type==="smoothBlur"&&(this.type="blur"),this.type==="ungulate"&&(this.type="noise");for(let t in this)this[t].type==="Vec2"?this[t]=new f(this[t]._x,this[t]._y):this[t].type==="Vec3"&&(this[t]=new _(this[t]._x,this[t]._y,this[t]._z));return this}render(t){if(t){for(let i in this)i!=="visible"&&t.uniforms[i]&&(t.uniforms[i].value=this[i]);this.animating&&(t.uniforms.time.value+=this.speed*2),this.type==="mouse"&&(t.uniforms.time.value+=.01)}}copy(t,i){return new Te(i||this,t)}getParent(){return h.history.filter(t=>t.effects&&t.effects.length).find(t=>t.effects.includes(this.parentLayer))}}class Pe extends ae{constructor(t,i){super(t,i);B(this,"layerType","image");B(this,"isElement",!0);B(this,"imageLoaded",!1);let s=this.default(t||{});for(let r in s)this[r]=s[r];Object.keys(t).length&&(this.loadImage(),this.createLocalCanvas())}default(t){return{bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,dissolve:t.dissolve||0,effects:t.effects||[],size:t.size||.25,rotation:t.rotation||t.angle||0,height:t.height||50,displace:t.displace||0,repeat:t.repeat||0,mask:t.mask||0,rotation:t.rotation||0,scaleX:t.scaleX||1,scaleY:t.scaleY||1,src:t.src||"",speed:t.speed||.5,thumb:t.thumb||"",translateX:t.translateX||0,translateY:t.translateY||0,width:t.width||50}}package(t){return{layerType:"image",visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,dispersion:this.dispersion,bgDisplace:this.bgDisplace,blendMode:this.blendMode,displace:this.displace,dissolve:this.dissolve,height:this.height,effects:H(this.effects,t),rotation:this.rotation,repeat:this.repeat,size:this.size,mask:this.mask,scaleX:this.scaleX,scaleY:this.scaleY,src:this.src,speed:this.speed,opacity:this.opacity,thumb:this.thumb,translateX:this.translateX,translateY:this.translateY,width:this.width}}unpackage(){return this.effects=q(this.effects),this}loadImage(){const t=new Image,i=new Image;t.crossOrigin="Anonymous",i.crossOrigin="Anonymous",t.addEventListener("load",()=>{this.local.img=t,this.width=t.width,this.height=t.height,this.render(),this.getPlane()&&this.getPlane().textures.filter(s=>s._samplerName==="uTexture").forEach(s=>{s.shouldUpdate=!1,s.needUpdate()}),Xe(1)},!1),i.addEventListener("load",()=>{this.local.img||(this.local.img=i,this.render=this.renderImage)},!1),i.src=this.thumb,t.src=this.src}getImageCoords(){return[]}getRelativeScale(){return Math.min(h.canvasWidth*2/this.width,h.canvasHeight*2/this.height)}renderImage(){this.coords=this.getImageCoords();const t=this.getPositionOffset(),i=t.x,s=t.y,r=this.rotation*360*(Math.PI/180),o=this.getRelativeScale();let n=this.width*o*this.scaleX,u=this.height*o*this.scaleY;this.local.ctx.clearRect(0,0,h.canvasWidth,h.canvasHeight),this.local.ctx.save(),this.local.ctx.translate(i,s),this.local.ctx.rotate(r),this.local.ctx.scale(this.size,this.size),this.local.ctx.drawImage(this.local.img,-n/2,-u/2,n,u),this.local.ctx.restore()}render(){this.coords=this.getImageCoords()}copy(t,i){return new Pe(i||this,t)}}class we extends ae{constructor(t,i){super(t,i);B(this,"layerType","text");B(this,"isElement",!0);B(this,"justCreated",!1);let s=this.default(t||{});for(let r in s)this[r]=s[r];Object.keys(t).length&&(this.createLocalCanvas(),requestAnimationFrame(()=>{this.coords=[[-2,0],[-2+this.width,0],[-2+this.width,0+this.height],[-2,0+this.height]],this.render()}))}default(t){return{bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,dissolve:t.dissolve||0,effects:t.effects||[],fill:t.fill||["#ffffff"],highlight:t.highlight||["transparent"],fontSize:t.fontSize||24,lineHeight:t.lineHeight||25,letterSpacing:t.letterSpacing||0,mask:t.mask||0,fontFamily:t.fontFamily||"arial",fontStyle:t.fontStyle||"normal",fontWeight:t.fontWeight||"normal",textAlign:t.textAlign||"left",textContent:t.textContent||"",gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",coords:t.coords||[],rotation:t.rotation||0,translateX:t.translateX||0,translateY:t.translateY||0,width:t.width||200,height:t.height||50}}package(t){return{layerType:"text",visible:this.visible,locked:this.locked,aspectRatio:this.aspectRatio,dispersion:this.dispersion,dissolve:this.dissolve,highlight:H(this.highlight,t),bgDisplace:this.bgDisplace,blendMode:this.blendMode,coords:H(this.coords,t),displace:this.displace,effects:H(this.effects,t),fill:H(this.fill,t),gradientAngle:this.gradientAngle,gradientType:this.gradientType,rotation:this.rotation,translateX:this.translateX,translateY:this.translateY,fontFamily:this.fontFamily,fontSize:this.fontSize,mask:this.mask,lineHeight:this.lineHeight,letterSpacing:this.letterSpacing,fontStyle:this.fontStyle,fontWeight:this.fontWeight,opacity:this.opacity,textAlign:this.textAlign,textContent:this.textContent,width:this.width,height:this.height}}unpackage(){return this.fill=q(this.fill),this.highlight=q(this.highlight),this.coords=q(this.coords),this.effects=q(this.effects),this}render(){const t=this.getPositionOffset();let i=t.x,s=t.y,r=0,o=this.width,n=this.height,u=this.fontSize>0?this.fontSize:0,l=this.lineHeight>0?this.lineHeight:0,c=this.fontStyle.includes("italic")?"italic":"normal",d=c==="italic"?this.fontStyle.replace("italic",""):this.fontStyle;d=d==="regular"?400:d,this.local.textBoxPos={x:i,y:s},this.local.ctx.clearRect(0,0,h.canvasWidth,h.canvasHeight),this.local.ctx.font=`${c} ${d} ${u}px/${l}px ${this.fontFamily}`,this.local.ctx.letterSpacing=this.letterSpacing+"px",this.local.ctx.textAlign=this.textAlign,this.local.ctx.save(),this.local.ctx.translate(i+o/2,s+n/2),this.local.ctx.rotate(this.rotation*360*Math.PI/180),this.local.ctx.translate(-(i+o/2),-(s+n/2));const g=(v,b)=>{let x=this.local.ctx.measureText(v).width;this.local.ctx.fillStyle=this.highlight,this.local.ctx.fillRect(i+(this.textAlign==="center"?(o-x)/2:this.textAlign==="right"?x:0),s+l*b,this.local.ctx.measureText(v).width,this.lineHeight),this.local.ctx.fillStyle=Ne(this.local.ctx,this,this.coords),this.local.ctx.fillText(v,i+(this.textAlign==="center"?o/2:this.textAlign==="right"?o:0),s+l*b+l/2+u/3)},m=this.textContent?this.textContent.split(`
`):[""];let y=m.length;for(let v=0;v<y;v++){let b="",x=m[v].split(" ");for(let P=0;P<x.length;P++){const M=x[P];if(this.local.ctx.measureText(b+M).width>o)if(this.local.ctx.measureText(M).width<=o){m[v]=b.trim(),m.splice(v+1,0,M+" "+x.slice(P+1).join(" ")),y++;break}else{m[v]=b.trim();let k=M,L=v+1;for(;k.length>0;){let E="";for(let R=0;R<k.length;R++)if(this.local.ctx.measureText(E+k[R]).width<=o)E+=k[R];else{E.length===0&&(E+=k[R]);break}k=k.slice(E.length),m.splice(L,0,E.trim()),y++,L++}x.slice(P+1).length>0&&(m[L-1]=m[L-1]+" "+x.slice(P+1).join(" "));break}else b=b+M+" ",P===x.length-1&&(m[v]=b.trim())}}m.forEach((v,b)=>{!v.length&&!v.includes(`
`)&&r--,v&&g(v,r),b<m.length-1&&r++}),this.local.ctx.translate(-(i+o/2),-(s+n/2)),this.local.ctx.restore(),this.height=this.lineHeight*r+this.lineHeight,this.justCreated?(this.width=this.local.ctx.measureText(this.textContent).width+20,this.height=this.lineHeight,this.coords=[[-2,0],[-2+this.width,0],[-2+this.width,0+this.height],[-2,0+this.height]]):this.coords=[[0,0],[0+this.width,0],[0+this.width,0+this.height],[0,0+this.height]]}copy(t,i){return new we(i||this,t)}}function ce(){return h.history.filter(a=>a.animating&&a.visible)}function Oi(a,e,t){console.log(t);const i=new ot({container:t,premultipliedAlpha:!0,antialias:!1,autoRender:!1,autoResize:!1,watchScroll:!1,renderingScale:Math.min(1,a)||1,production:window.location.hostname.includes("unicorn.studio"),pixelRatio:Math.min(Math.min(e||1.5,2),h.dpi)});h.curtain=i}function Bi(a){function e(){a.forEach(t=>{t.render()}),h.curtain.render()}if(a.length)for(let t=0;t<a.length;t++){const i=document.createElement("link");i.rel="stylesheet",i.href=`https://fonts.googleapis.com/css?family=${a[t].fontFamily}:${a[t].fontStyle}&display=swap&text=${a[t].textContent}`,document.head.appendChild(i)}setTimeout(e,100),setTimeout(e,200),setTimeout(e,300),setTimeout(e,400)}function Vi(a){const e=[];return a.forEach(t=>{switch(t.layerType||(t.layerType=t.type,V[t.type]&&(t.layerType="effect")),t.layerType){case"text":e.push(new we(t).unpackage());break;case"image":e.push(new Pe(t).unpackage());break;case"fill":e.push(new ye(t).unpackage());break;case"draw":e.push(new _e(t).unpackage());break;case"shape":e.push(new be(t).unpackage());break;case"effect":e.push(new Te(t).unpackage());break}}),e}function Ni(){h.history.filter(a=>a.isElement).forEach(a=>{a.resize(),a.render(),a.getPlane().textures.filter(e=>e.sourceType==="canvas").forEach(e=>{e.needUpdate()})}),h.curtain.resize()}function Ui(a){h.mouse.movePos.x=Math.round(a.pageX/2),h.mouse.movePos.y=Math.round(a.pageY/2),h.mouse.pos.x=Ge(h.mouse.movePos.x,h.mouse.lastPos.x,1),h.mouse.pos.y=Ge(h.mouse.movePos.y,h.mouse.lastPos.y,1),h.mouse.lastPos.x=h.mouse.pos.x,h.mouse.lastPos.y=h.mouse.pos.y,ce().length||h.curtain.render()}function Gi(){h.fullRedrawEnabled=!0,h.curtain.render(),h.fullRedrawEnabled=!1}function Xe(a,e){let t=0;const i=()=>{h.curtain.render(),t<a?(t++,requestAnimationFrame(i)):e&&e()};ce().length||i()}function Xi(a){let e=0;cancelAnimationFrame(h.curtainRafId);const t=Math.floor(1e3/(a||60)),i=s=>{h.curtain?(s-e>=t&&(h.curtain.render(),e=s),h.curtainRafId=requestAnimationFrame(i)):cancelAnimationFrame(h.curtainRafId)};Gi(),h.curtainRafId=requestAnimationFrame(i)}function We(a,e){return h.curtain.planes.find(t=>t.userData.id===a.local.id&&t.userData.passIndex===e)}function N(){return h.curtain.renderTargets.filter(a=>a.userData.id)}function Se(){return h.curtain.planes.filter(a=>a.userData.type!=="pingpong")}function Wi(){h.curtain.planes.filter(e=>!h.history.find(t=>t.local.id===e.userData.id)).forEach(e=>{e.target?e.target.remove():(N().at(-1).remove(),e.userData.passIndex!==void 0&&N().at(-1)&&N().at(-1).remove()),e.remove()})}function He(a,e){let t=Ai;h.embedded&&a.displace===0&&a.blendMode==="NORMAL"&&!a.mask&&(t=Ri),a.layerType==="effect"&&(a.type==="custom"?(t=Object.assign({},V.custom.params),a.customFragmentShader&&(t.fragmentShader=a.customFragmentShader),a.customVertexShader&&(t.vertexShader=a.customVertexShader)):a.type==="mouse"?t=Ci:t=V[a.type].params);const i=new Le(h.curtain,h.curtain.container,t);return i.userData.id=a.local.id,i.userData.type=a.layerType,i.setRenderOrder(e),i}function Hi(a,e,t){const i=new Dt(h.curtain,h.curtain.container,V.mouse.params),s=a.getParent();if(i)return i.userData.id=a.local.id,i.userData.type="pingpong",i.setRenderOrder(e),i.onReady(()=>{i.userData.isReady=!0}).onRender(()=>qe(i,a,s,t)),i}function Ce(a,e,t){const i=He(a,e),s=a.getParent();i&&(V[a.type].texture&&i.loadImage(V[a.type].texture.src,{sampler:V[a.type].texture.sampler},r=>{a.render(),h.curtain.render()}),t&&(i.userData.passIndex=t.index,i.userData.length=V[a.type].passes.length,Object.entries(t).forEach(([r,o])=>{i.uniforms[r]&&(i.uniforms[r].value=o)})),i.onReady(()=>{i.userData.isReady=!0}).onRender(()=>qe(i,a,s,t)))}function qi(a,e){const t=He(a,e);t&&t.onReady(()=>{t.userData.isReady=!0}).onRender(()=>{t.uniforms.opacity.value=a.visible?a.opacity:0,t.uniforms.dissolve.value=a.dissolve,t.uniforms.displace&&(t.uniforms.displace.value=a.displace,t.uniforms.bgDisplace.value=a.bgDisplace,t.uniforms.dispersion.value=a.dispersion),t.uniforms.blendMode&&(t.uniforms.blendMode.value=Object.keys(se).indexOf(a.blendMode)),t.uniforms.mask&&"mask"in a&&(t.uniforms.mask.value=a.mask),a.local.ctx&&a.layerType!=="effect"&&h.fullRedrawEnabled&&a.render()})}function Yi(a,e,t,i){const s="passIndex"in t?We(a,t.passIndex):a.getPlane();let r=N()[e-1],o=h.curtain.planes.find(u=>u.userData.type==="pingpong"&&u.userData.id===a.local.id),n=r.getTexture();i&&(s.textures.length=0),o&&(s.createTexture({sampler:"uPingPongTexture",fromTexture:o.getTexture()}),s.createTexture({sampler:"uBgTexture",fromTexture:N()[e-2].getTexture()})),r&&s.createTexture({sampler:"uTexture",fromTexture:n}),t.length&&s.createTexture({sampler:"uBgTexture",fromTexture:N()[e-(1+t.passIndex)].getTexture()})}function $i(a,e){const t=a.getPlane(),i=a.getChildEffectItems().filter(r=>r.visible);let s=N()[e-1];if(t.textures.length=0,i.length?t.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:s.getTexture()}):t.loadCanvas(a.local.canvas,{premultipliedAlpha:!0,sampler:"uTexture"}),s){let r=i.length+1,o=Se()[e-r],n=h.history.find(l=>l.local.id===o.userData.id);if(a.mask){const l=s.getTexture();if(a.effects.length){const c=a.getChildEffectItems().filter(d=>!d.isMask).length;s=N()[e-(1+c)]}t.createTexture({sampler:"uMaskTexture",premultipliedAlpha:!0,fromTexture:n.isElement?l:s.getTexture()})}let u=i.reduce((l,c)=>l+c.getPlanes().length,0);if(a.mask){let l=n.getPlanes().length+n.getChildEffectItems().reduce((c,d)=>c+d.getPlanes().length,0);n.getMaskedItem()&&(l+=n.getMaskedItem().getPlanes().length),s=N()[e-(1+l+u)]}else s=N()[e-(1+u)];s&&t.createTexture({sampler:"uBgTexture",premultipliedAlpha:!0,fromTexture:s.getTexture()})}}function ji(a,e,t){const i="passIndex"in t?We(a,t.passIndex):a.getPlane(),s=a.getParent();let r=N()[e-1];s.effects.filter(u=>{if(h.history.find(l=>l.parentLayer===u))return h.history.find(l=>l.parentLayer===u).visible}).indexOf(a.parentLayer)||t.passIndex>0?(i.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:r.getTexture()}),a.isMask&&(!t.length||t.length<=1||t.passIndex===t.length-1)&&i.loadCanvas(s.local.canvas,{premultipliedAlpha:!0,sampler:"uMaskTexture"})):a.isMask?((!t.length||t.length<=1)&&i.loadCanvas(s.local.canvas,{premultipliedAlpha:!0,sampler:"uMaskTexture"}),i.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:r.getTexture()})):i.loadCanvas(s.local.canvas,{premultipliedAlpha:!0,sampler:"uTexture"})}function Ki(){as().forEach((a,e)=>{a.getPlanes().length?a.getPlanes().forEach(t=>t.setRenderOrder(e)):a.layerType==="effect"?Zi(a,e):qi(a,e)})}function Zi(a,e){const t=V[a.type];t.passes&&t.passes.length?(Ce(a,e,{index:0,length:t.passes.length+1}),t.passes.forEach((i,s)=>{Ce(a,e,{index:s+1,length:t.passes.length+1,[i.prop]:i.value})})):(Ce(a,e),a.type==="mouse"&&Hi(a,e))}function Qi(){const a=Se().filter(t=>t.visible).sort((t,i)=>t.renderOrder-i.renderOrder),e=a.length;for(let t=0;t<e;t++){const i=a[t];let s=h.history.find(r=>r.local.id===i.userData.id);t<e-1&&Ji(a,t,s,i),es(s,t,i.userData)}}function Ji(a,e,t,i){let s=h.embedded?os(a,e,t):{},r=N()[e]||new pe(h.curtain,s);r.userData.id=i.userData.id,i.setRenderTarget(r)}function es(a,e,t){a.layerType==="effect"?a.parentLayer?ji(a,e,t):Yi(a,e,t):$i(a,e)}function ts(a,e){Wi(),e&&rs(e),Ki(),Qi(),is(a)}function is(a){const e=()=>{h.curtain.planes.filter(t=>!t.userData.isReady).length?((!h.initialized||!ce().length)&&h.curtain.render(),requestAnimationFrame(e)):a()};e()}function qe(a,e,t,i){for(let s in e)s in a.uniforms&&(s==="pos"?a.uniforms[s].value=new f(e.pos.x,1-e.pos.y):a.uniforms[s].value=e[s]);e.animating&&a.uniforms.time&&(a.uniforms.time.value+=e.speed),a.uniforms.blendMode&&(a.uniforms.blendMode.value=Object.keys(se).indexOf(e.blendMode)),a.uniforms.mousePos&&(a.uniforms.mousePos.value=new f(h.mouse.pos.x/h.canvasWidth,1-h.mouse.pos.y/h.canvasHeight)),a.uniforms.click&&(a.uniforms.click.value=0),t&&i&&i.index<i.length-1&&(a.uniforms.isMask.value=0),a.uniforms.resolution.value=new f(h.curtain.canvas.width,h.curtain.canvas.height)}function Ye(a){return a.parentLayer&&a.getParent().effects.length>1?a.getParent().effects.indexOf(a.parentLayer)===0:!1}function ss(){N().forEach(a=>a.remove())}function $e(){Se().forEach(a=>a.textures.length=0)}function rs(a){(a.reorder||a.changed&&Ye(a.changed))&&(ss(),$e()),a.changed&&Ye(a.changed)&&$e()}function as(){let a=[];return h.history.filter(e=>!e.parentLayer&&e.visible).forEach(e=>{e.effects&&e.effects.length&&a.push(...e.getChildEffectItems()),a.push(e)}),a}function os(a,e,t){const i={},s=a[e],r=a[e+1]?h.history.find(n=>n.local.id===a[e+1].userData.id):null;return(r&&!r.parentLayer&&r.type==="pixelate"||r&&!r.parentLayer&&r.type==="diffuse"||t.type==="blur"||t.type==="bokeh"||t.type==="bloom"||t.type==="pixelate")&&(i.maxWidth=h.canvasWidth,i.maxHeight=h.canvasHeight,!s.uniforms.final||s.uniforms.final.value<1),i}function ns(a){fetch(`https://firebasestorage.googleapis.com/v0/b/embeds.unicorn.studio/o/${a.projectId}?alt=media`).then(e=>e.json()).then(e=>{h.history=Vi(e.history),Bi(h.history.filter(i=>i.fontFamily));const t=document.getElementById(a.element)||document.body;h.canvasWidth=t.offsetWidth/window.devicePixelRatio,h.canvasHeight=t.offsetHeight/window.devicePixelRatio,Oi(a.scale,a.dpi,t),ts(()=>{if(h.history.filter(i=>i.layerType!=="image"&&i.layerType!=="effect").forEach(i=>{i.getPlane().textures.filter(s=>s.sourceType==="canvas").forEach(s=>{s.shouldUpdate=!1,s.needUpdate()})}),h.loading=!1,h.initialized=!0,ce().length){const i=a.fps?Math.min(a.fps,120):60;Xi(Math.max(0,i))}else Xe(2);h.curtain.planes.find(i=>i.uniforms.mousePos)&&window.addEventListener("mousemove",Ui),window.addEventListener("resize",Ni)},{embed:!0})}).catch(e=>{console.log(e)})}G.init=ns,Object.defineProperty(G,Symbol.toStringTag,{value:"Module"})});
