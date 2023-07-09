(function(G, U) { typeof exports == "object" && typeof module < "u" ? U(exports) : typeof define == "function" && define.amd ? define(["exports"], U) : (G = typeof globalThis < "u" ? globalThis : G || self, U(G.UnicornStudio = {})) })(this, function(G) { "use strict"; var Mi = Object.defineProperty; var Si = (G, U, _) => U in G ? Mi(G, U, { enumerable: !0, configurable: !0, writable: !0, value: _ }) : G[U] = _; var H = (G, U, _) => (Si(G, typeof U != "symbol" ? U + "" : U, _), _); let U = 0;

  function _() { if (!(U > 100)) { if (U === 100) console.warn("Curtains: too many warnings thrown, stop logging.");
      else { const a = Array.prototype.slice.call(arguments);
        console.warn.apply(console, a) }
      U++ } }

  function I() { const a = Array.prototype.slice.call(arguments);
    console.error.apply(console, a) }

  function le() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, a => { let e = Math.random() * 16 | 0; return (a === "x" ? e : e & 3 | 8).toString(16).toUpperCase() }) }

  function q(a) { return (a & a - 1) === 0 }

  function Ve(a, e, t) { return (1 - t) * a + t * e }
  class Ne { constructor(e) { if (this.type = "Scene", !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { I(this.type + ": Renderer WebGL context is undefined", e); return }
      this.renderer = e, this.gl = e.gl, this.initStacks() }
    initStacks() { this.stacks = { pingPong: [], renderTargets: [], opaque: [], transparent: [], renderPasses: [], scenePasses: [] } }
    resetPlaneStacks() { this.stacks.pingPong = [], this.stacks.renderTargets = [], this.stacks.opaque = [], this.stacks.transparent = []; for (let e = 0; e < this.renderer.planes.length; e++) this.addPlane(this.renderer.planes[e]) }
    resetShaderPassStacks() { this.stacks.scenePasses = [], this.stacks.renderPasses = []; for (let e = 0; e < this.renderer.shaderPasses.length; e++) this.renderer.shaderPasses[e].index = e, this.renderer.shaderPasses[e]._isScenePass ? this.stacks.scenePasses.push(this.renderer.shaderPasses[e]) : this.stacks.renderPasses.push(this.renderer.shaderPasses[e]);
      this.stacks.scenePasses.length === 0 && (this.renderer.state.scenePassIndex = null) }
    addToRenderTargetsStack(e) { const t = this.renderer.planes.filter(s => s.type !== "PingPongPlane" && s.target && s.uuid !== e.uuid); let i = -1; if (e.target._depth) { for (let s = t.length - 1; s >= 0; s--)
          if (t[s].target.uuid === e.target.uuid) { i = s + 1; break } } else i = t.findIndex(s => s.target.uuid === e.target.uuid);
      i = Math.max(0, i), t.splice(i, 0, e), e.target._depth ? (t.sort((s, r) => s.index - r.index), t.sort((s, r) => r.renderOrder - s.renderOrder)) : (t.sort((s, r) => r.index - s.index), t.sort((s, r) => s.renderOrder - r.renderOrder)), t.sort((s, r) => s.target.index - r.target.index), this.stacks.renderTargets = t }
    addToRegularPlaneStack(e) { const t = this.renderer.planes.filter(s => s.type !== "PingPongPlane" && !s.target && s._transparent === e._transparent && s.uuid !== e.uuid); let i = -1; for (let s = t.length - 1; s >= 0; s--)
        if (t[s]._geometry.definition.id === e._geometry.definition.id) { i = s + 1; break }
      return i = Math.max(0, i), t.splice(i, 0, e), t.sort((s, r) => s.index - r.index), t }
    addPlane(e) { if (e.type === "PingPongPlane") this.stacks.pingPong.push(e);
      else if (e.target) this.addToRenderTargetsStack(e);
      else if (e._transparent) { const t = this.addToRegularPlaneStack(e);
        t.sort((i, s) => s.relativeTranslation.z - i.relativeTranslation.z), t.sort((i, s) => s.renderOrder - i.renderOrder), this.stacks.transparent = t } else { const t = this.addToRegularPlaneStack(e);
        t.sort((i, s) => s.renderOrder - i.renderOrder), this.stacks.opaque = t } }
    removePlane(e) { e.type === "PingPongPlane" ? this.stacks.pingPong = this.stacks.pingPong.filter(t => t.uuid !== e.uuid) : e.target ? this.stacks.renderTargets = this.stacks.renderTargets.filter(t => t.uuid !== e.uuid) : e._transparent ? this.stacks.transparent = this.stacks.transparent.filter(t => t.uuid !== e.uuid) : this.stacks.opaque = this.stacks.opaque.filter(t => t.uuid !== e.uuid) }
    setPlaneRenderOrder(e) { if (e.type === "ShaderPass") this.sortShaderPassStack(e._isScenePass ? this.stacks.scenePasses : this.stacks.renderPasses);
      else if (e.type === "PingPongPlane") return; if (e.target) e.target._depth ? (this.stacks.renderTargets.sort((t, i) => t.index - i.index), this.stacks.renderTargets.sort((t, i) => i.renderOrder - t.renderOrder)) : (this.stacks.renderTargets.sort((t, i) => i.index - t.index), this.stacks.renderTargets.sort((t, i) => t.renderOrder - i.renderOrder)), this.stacks.renderTargets.sort((t, i) => t.target.index - i.target.index);
      else { const t = e._transparent ? this.stacks.transparent : this.stacks.opaque,
          i = this.stacks.scenePasses.find((s, r) => s._isScenePass && !s._depth && r === 0);!this.renderer.depth || i ? (t.sort((s, r) => r.index - s.index), e._transparent && t.sort((s, r) => s.relativeTranslation.z - r.relativeTranslation.z), t.sort((s, r) => s.renderOrder - r.renderOrder)) : (t.sort((s, r) => s.index - r.index), e._transparent && t.sort((s, r) => r.relativeTranslation.z - s.relativeTranslation.z), t.sort((s, r) => r.renderOrder - s.renderOrder)) } }
    addShaderPass(e) { e._isScenePass ? (this.stacks.scenePasses.push(e), this.sortShaderPassStack(this.stacks.scenePasses)) : (this.stacks.renderPasses.push(e), this.sortShaderPassStack(this.stacks.renderPasses)) }
    removeShaderPass(e) { this.resetShaderPassStacks() }
    sortShaderPassStack(e) { e.sort((t, i) => t.index - i.index), e.sort((t, i) => t.renderOrder - i.renderOrder) }
    enableShaderPass() { this.stacks.scenePasses.length && this.stacks.renderPasses.length === 0 && this.renderer.planes.length && (this.renderer.state.scenePassIndex = 0, this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target)) }
    drawRenderPasses() { this.stacks.scenePasses.length && this.stacks.renderPasses.length && this.renderer.planes.length && (this.renderer.state.scenePassIndex = 0, this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target)); for (let e = 0; e < this.stacks.renderPasses.length; e++) this.stacks.renderPasses[e]._startDrawing(), this.renderer.clearDepth() }
    drawScenePasses() { for (let e = 0; e < this.stacks.scenePasses.length; e++) this.stacks.scenePasses[e]._startDrawing() }
    drawPingPongStack() { for (let e = 0; e < this.stacks.pingPong.length; e++) { const t = this.stacks.pingPong[e];
        t && t._startDrawing() } }
    drawStack(e) { for (let t = 0; t < this.stacks[e].length; t++) { const i = this.stacks[e][t];
        i && i._startDrawing() } }
    draw() { this.drawPingPongStack(), this.enableShaderPass(), this.drawStack("renderTargets"), this.drawRenderPasses(), this.renderer.setBlending(!1), this.drawStack("opaque"), this.stacks.transparent.length && (this.renderer.setBlending(!0), this.drawStack("transparent")), this.drawScenePasses() } }
  class We { constructor() { this.geometries = [], this.clear() }
    clear() { this.textures = [], this.programs = [] }
    getGeometryFromID(e) { return this.geometries.find(t => t.id === e) }
    addGeometry(e, t, i) { this.geometries.push({ id: e, vertices: t, uvs: i }) }
    isSameShader(e, t) { return e.localeCompare(t) === 0 }
    getProgramFromShaders(e, t) { return this.programs.find(i => this.isSameShader(i.vsCode, e) && this.isSameShader(i.fsCode, t)) }
    addProgram(e) { this.programs.push(e) }
    getTextureFromSource(e) { const t = typeof e == "string" ? e : e.src; return this.textures.find(i => i.source && i.source.src === t) }
    addTexture(e) { this.getTextureFromSource(e.source) || this.textures.push(e) }
    removeTexture(e) { this.textures = this.textures.filter(t => t.uuid !== e.uuid) } }
  class He { constructor() { this.clear() }
    clear() { this.queue = [] }
    add(e, t = !1) { const i = { callback: e, keep: t, timeout: null }; return i.timeout = setTimeout(() => { this.queue.push(i) }, 0), i }
    execute() { this.queue.map(e => { e.callback && e.callback(), clearTimeout(this.queue.timeout) }), this.queue = this.queue.filter(e => e.keep) } }
  class Ge { constructor({ alpha: e, antialias: t, premultipliedAlpha: i, depth: s, failIfMajorPerformanceCaveat: r, preserveDrawingBuffer: n, stencil: h, container: l, pixelRatio: o, renderingScale: c, production: f, onError: x, onSuccess: m, onContextLost: u, onContextRestored: p, onDisposed: g, onSceneChange: y }) { this.type = "Renderer", this.alpha = e, this.antialias = t, this.premultipliedAlpha = i, this.depth = s, this.failIfMajorPerformanceCaveat = r, this.preserveDrawingBuffer = n, this.stencil = h, this.container = l, this.pixelRatio = o, this._renderingScale = c, this.production = f, this.onError = x, this.onSuccess = m, this.onContextLost = u, this.onContextRestored = p, this.onDisposed = g, this.onSceneChange = y, this.initState(), this.canvas = document.createElement("canvas"); const v = { alpha: this.alpha, premultipliedAlpha: this.premultipliedAlpha, antialias: this.antialias, depth: this.depth, failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat, preserveDrawingBuffer: this.preserveDrawingBuffer, stencil: this.stencil }; if (this.gl = this.canvas.getContext("webgl2", v), this._isWebGL2 = !!this.gl, this.gl || (this.gl = this.canvas.getContext("webgl", v) || this.canvas.getContext("experimental-webgl", v)), this.gl) this.onSuccess && this.onSuccess();
      else { this.production || _(this.type + ": WebGL context could not be created"), this.state.isActive = !1, this.onError && this.onError(); return }
      this.initRenderer() }
    initState() { this.state = { isActive: !0, isContextLost: !0, drawingEnabled: !0, forceRender: !1, currentProgramID: null, currentGeometryID: null, forceBufferUpdate: !1, depthTest: null, blending: null, cullFace: null, frameBufferID: null, scenePassIndex: null, activeTexture: null, unpackAlignment: null, flipY: null, premultiplyAlpha: null } }
    initCallbackQueueManager() { this.nextRender = new He }
    initRenderer() { this.planes = [], this.renderTargets = [], this.shaderPasses = [], this.state.isContextLost = !1, this.state.maxTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE), this.initCallbackQueueManager(), this.setBlendFunc(), this.setDepthFunc(), this.setDepthTest(!0), this.cache = new We, this.scene = new Ne(this), this.getExtensions(), this._contextLostHandler = this.contextLost.bind(this), this.canvas.addEventListener("webglcontextlost", this._contextLostHandler, !1), this._contextRestoredHandler = this.contextRestored.bind(this), this.canvas.addEventListener("webglcontextrestored", this._contextRestoredHandler, !1) }
    getExtensions() { this.extensions = [], this._isWebGL2 ? (this.extensions.EXT_color_buffer_float = this.gl.getExtension("EXT_color_buffer_float"), this.extensions.OES_texture_float_linear = this.gl.getExtension("OES_texture_float_linear"), this.extensions.EXT_texture_filter_anisotropic = this.gl.getExtension("EXT_texture_filter_anisotropic"), this.extensions.WEBGL_lose_context = this.gl.getExtension("WEBGL_lose_context")) : (this.extensions.OES_vertex_array_object = this.gl.getExtension("OES_vertex_array_object"), this.extensions.OES_texture_float = this.gl.getExtension("OES_texture_float"), this.extensions.OES_texture_float_linear = this.gl.getExtension("OES_texture_float_linear"), this.extensions.OES_texture_half_float = this.gl.getExtension("OES_texture_half_float"), this.extensions.OES_texture_half_float_linear = this.gl.getExtension("OES_texture_half_float_linear"), this.extensions.EXT_texture_filter_anisotropic = this.gl.getExtension("EXT_texture_filter_anisotropic"), this.extensions.OES_element_index_uint = this.gl.getExtension("OES_element_index_uint"), this.extensions.OES_standard_derivatives = this.gl.getExtension("OES_standard_derivatives"), this.extensions.EXT_sRGB = this.gl.getExtension("EXT_sRGB"), this.extensions.WEBGL_depth_texture = this.gl.getExtension("WEBGL_depth_texture"), this.extensions.WEBGL_draw_buffers = this.gl.getExtension("WEBGL_draw_buffers"), this.extensions.WEBGL_lose_context = this.gl.getExtension("WEBGL_lose_context")) }
    contextLost(e) { this.state.isContextLost = !0, this.state.isActive && (e.preventDefault(), this.nextRender.add(() => this.onContextLost && this.onContextLost())) }
    restoreContext() { this.state.isActive && (this.initState(), this.gl && this.extensions.WEBGL_lose_context ? this.extensions.WEBGL_lose_context.restoreContext() : (!this.gl && !this.production ? _(this.type + ": Could not restore the context because the context is not defined") : !this.extensions.WEBGL_lose_context && !this.production && _(this.type + ": Could not restore the context because the restore context extension is not defined"), this.onError && this.onError())) }
    isContextexFullyRestored() { let e = !0; for (let t = 0; t < this.renderTargets.length; t++) { this.renderTargets[t].textures[0]._canDraw || (e = !1); break } if (e)
        for (let t = 0; t < this.planes.length; t++)
          if (this.planes[t]._canDraw) { for (let i = 0; i < this.planes[t].textures.length; i++)
              if (!this.planes[t].textures[i]._canDraw) { e = !1; break } } else { e = !1; break }
      if (e)
        for (let t = 0; t < this.shaderPasses.length; t++)
          if (this.shaderPasses[t]._canDraw) { for (let i = 0; i < this.shaderPasses[t].textures.length; i++)
              if (!this.shaderPasses[t].textures[i]._canDraw) { e = !1; break } } else { e = !1; break }
      return e }
    contextRestored() { this.getExtensions(), this.setBlendFunc(), this.setDepthFunc(), this.setDepthTest(!0), this.cache.clear(), this.scene.initStacks(); for (let t = 0; t < this.renderTargets.length; t++) this.renderTargets[t]._restoreContext(); for (let t = 0; t < this.planes.length; t++) this.planes[t]._restoreContext(); for (let t = 0; t < this.shaderPasses.length; t++) this.shaderPasses[t]._restoreContext(); const e = this.nextRender.add(() => { this.isContextexFullyRestored() && (e.keep = !1, this.state.isContextLost = !1, this.onContextRestored && this.onContextRestored(), this.onSceneChange(), this.needRender()) }, !0) }
    setPixelRatio(e) { this.pixelRatio = e }
    setSize() { if (!this.gl) return; const e = this.container.getBoundingClientRect();
      this._boundingRect = { width: e.width * this.pixelRatio, height: e.height * this.pixelRatio, top: e.top * this.pixelRatio, left: e.left * this.pixelRatio }; const t = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
        i = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; if (t && i) { let s = function(r) { let n = 0; for (; r && !isNaN(r.offsetTop);) n += r.offsetTop - r.scrollTop, r = r.offsetParent; return n };
        this._boundingRect.top = s(this.container) * this.pixelRatio }
      this.canvas.style.width = Math.floor(this._boundingRect.width / this.pixelRatio) + "px", this.canvas.style.height = Math.floor(this._boundingRect.height / this.pixelRatio) + "px", this.canvas.width = Math.floor(this._boundingRect.width * this._renderingScale), this.canvas.height = Math.floor(this._boundingRect.height * this._renderingScale), this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight) }
    resize() { for (let e = 0; e < this.planes.length; e++) this.planes[e]._canDraw && this.planes[e].resize(); for (let e = 0; e < this.shaderPasses.length; e++) this.shaderPasses[e]._canDraw && this.shaderPasses[e].resize(); for (let e = 0; e < this.renderTargets.length; e++) this.renderTargets[e].resize();
      this.needRender() }
    clear() { this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) }
    clearDepth() { this.gl.clear(this.gl.DEPTH_BUFFER_BIT) }
    clearColor() { this.gl.clear(this.gl.COLOR_BUFFER_BIT) }
    bindFrameBuffer(e, t) { let i = null;
      e ? (i = e.index, i !== this.state.frameBufferID && (this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e._frameBuffer), this.gl.viewport(0, 0, e._size.width, e._size.height), e._shouldClear && !t && this.clear())) : this.state.frameBufferID !== null && (this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)), this.state.frameBufferID = i }
    setDepthTest(e) { e && !this.state.depthTest ? (this.state.depthTest = e, this.gl.enable(this.gl.DEPTH_TEST)) : !e && this.state.depthTest && (this.state.depthTest = e, this.gl.disable(this.gl.DEPTH_TEST)) }
    setDepthFunc() { this.gl.depthFunc(this.gl.LEQUAL) }
    setBlending(e = !1) { e && !this.state.blending ? (this.state.blending = e, this.gl.enable(this.gl.BLEND)) : !e && this.state.blending && (this.state.blending = e, this.gl.disable(this.gl.BLEND)) }
    setBlendFunc() { this.gl.enable(this.gl.BLEND), this.premultipliedAlpha ? this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA) : this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA) }
    setFaceCulling(e) { if (this.state.cullFace !== e)
        if (this.state.cullFace = e, e === "none") this.gl.disable(this.gl.CULL_FACE);
        else { const t = e === "front" ? this.gl.FRONT : this.gl.BACK;
          this.gl.enable(this.gl.CULL_FACE), this.gl.cullFace(t) } }
    useProgram(e) {
      (this.state.currentProgramID === null || this.state.currentProgramID !== e.id) && (this.gl.useProgram(e.program), this.state.currentProgramID = e.id) }
    removePlane(e) { this.gl && (this.planes = this.planes.filter(t => t.uuid !== e.uuid), this.scene.removePlane(e), e = null, this.gl && this.clear(), this.onSceneChange()) }
    removeRenderTarget(e) { if (!this.gl) return; let t = this.planes.find(i => i.type !== "PingPongPlane" && i.target && i.target.uuid === e.uuid); for (let i = 0; i < this.planes.length; i++) this.planes[i].target && this.planes[i].target.uuid === e.uuid && (this.planes[i].target = null);
      this.renderTargets = this.renderTargets.filter(i => i.uuid !== e.uuid); for (let i = 0; i < this.renderTargets.length; i++) this.renderTargets[i].index = i;
      e = null, this.gl && this.clear(), t && this.scene.resetPlaneStacks(), this.onSceneChange() }
    removeShaderPass(e) { this.gl && (this.shaderPasses = this.shaderPasses.filter(t => t.uuid !== e.uuid), this.scene.removeShaderPass(e), e = null, this.gl && this.clear(), this.onSceneChange()) }
    enableDrawing() { this.state.drawingEnabled = !0 }
    disableDrawing() { this.state.drawingEnabled = !1 }
    needRender() { this.state.forceRender = !0 }
    render() { this.gl && (this.clear(), this.state.currentGeometryID = null, this.scene.draw()) }
    deletePrograms() { for (let e = 0; e < this.cache.programs.length; e++) { const t = this.cache.programs[e];
        this.gl.deleteProgram(t.program) } }
    dispose() { if (!this.gl) return; for (this.state.isActive = !1; this.planes.length > 0;) this.removePlane(this.planes[0]); for (; this.shaderPasses.length > 0;) this.removeShaderPass(this.shaderPasses[0]); for (; this.renderTargets.length > 0;) this.removeRenderTarget(this.renderTargets[0]); let e = this.nextRender.add(() => { this.planes.length === 0 && this.shaderPasses.length === 0 && this.renderTargets.length === 0 && (e.keep = !1, this.deletePrograms(), this.clear(), this.canvas.removeEventListener("webgllost", this._contextLostHandler, !1), this.canvas.removeEventListener("webglrestored", this._contextRestoredHandler, !1), this.gl && this.extensions.WEBGL_lose_context && this.extensions.WEBGL_lose_context.loseContext(), this.canvas.width = this.canvas.width, this.gl = null, this.container.removeChild(this.canvas), this.container = null, this.canvas = null, this.onDisposed && this.onDisposed()) }, !0) } }
  class je { constructor({ xOffset: e = 0, yOffset: t = 0, lastXDelta: i = 0, lastYDelta: s = 0, shouldWatch: r = !0, onScroll: n = () => {} } = {}) { this.xOffset = e, this.yOffset = t, this.lastXDelta = i, this.lastYDelta = s, this.shouldWatch = r, this.onScroll = n, this.handler = this.scroll.bind(this, !0), this.shouldWatch && window.addEventListener("scroll", this.handler, { passive: !0 }) }
    scroll() { this.updateScrollValues(window.pageXOffset, window.pageYOffset) }
    updateScrollValues(e, t) { const i = this.xOffset;
      this.xOffset = e, this.lastXDelta = i - this.xOffset; const s = this.yOffset;
      this.yOffset = t, this.lastYDelta = s - this.yOffset, this.onScroll && this.onScroll(this.lastXDelta, this.lastYDelta) }
    dispose() { this.shouldWatch && window.removeEventListener("scroll", this.handler, { passive: !0 }) } } const Xe = "8.1.3";
  class Ye { constructor({ container: e, alpha: t = !0, premultipliedAlpha: i = !1, antialias: s = !0, depth: r = !0, failIfMajorPerformanceCaveat: n = !0, preserveDrawingBuffer: h = !1, stencil: l = !1, autoResize: o = !0, autoRender: c = !0, watchScroll: f = !0, pixelRatio: x = window.devicePixelRatio || 1, renderingScale: m = 1, production: u = !1 } = {}) { this.type = "Curtains", this._autoResize = o, this._autoRender = c, this._watchScroll = f, this.pixelRatio = x, m = isNaN(m) ? 1 : parseFloat(m), this._renderingScale = Math.max(.25, Math.min(1, m)), this.premultipliedAlpha = i, this.alpha = t, this.antialias = s, this.depth = r, this.failIfMajorPerformanceCaveat = n, this.preserveDrawingBuffer = h, this.stencil = l, this.production = u, this.errors = !1, e ? this.setContainer(e) : this.production || _(this.type + ": no container provided in the initial parameters. Use setContainer() method to set one later and initialize the WebGL context") }
    setContainer(e) { if (e)
        if (typeof e == "string")
          if (e = document.getElementById(e), e) this.container = e;
          else { let t = document.createElement("div");
            t.setAttribute("id", "curtains-canvas"), document.body.appendChild(t), this.container = t, this.production || _('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead') }
      else e instanceof Element && (this.container = e);
      else { let t = document.createElement("div");
        t.setAttribute("id", "curtains-canvas"), document.body.appendChild(t), this.container = t, this.production || _('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead') }
      this._initCurtains() }
    _initCurtains() { this.planes = [], this.renderTargets = [], this.shaderPasses = [], this._initRenderer(), this.gl && (this._initScroll(), this._setSize(), this._addListeners(), this.container.appendChild(this.canvas), this._animationFrameID = null, this._autoRender && this._animate()) }
    _initRenderer() { this.renderer = new Ge({ alpha: this.alpha, antialias: this.antialias, premultipliedAlpha: this.premultipliedAlpha, depth: this.depth, failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat, preserveDrawingBuffer: this.preserveDrawingBuffer, stencil: this.stencil, container: this.container, pixelRatio: this.pixelRatio, renderingScale: this._renderingScale, production: this.production, onError: () => this._onRendererError(), onSuccess: () => this._onRendererSuccess(), onContextLost: () => this._onRendererContextLost(), onContextRestored: () => this._onRendererContextRestored(), onDisposed: () => this._onRendererDisposed(), onSceneChange: () => this._keepSync() }), this.gl = this.renderer.gl, this.canvas = this.renderer.canvas }
    restoreContext() { this.renderer.restoreContext() }
    _animate() { this.render(), this._animationFrameID = window.requestAnimationFrame(this._animate.bind(this)) }
    enableDrawing() { this.renderer.enableDrawing() }
    disableDrawing() { this.renderer.disableDrawing() }
    needRender() { this.renderer.needRender() }
    nextRender(e, t = !1) { return this.renderer.nextRender.add(e, t) }
    clear() { this.renderer && this.renderer.clear() }
    clearDepth() { this.renderer && this.renderer.clearDepth() }
    clearColor() { this.renderer && this.renderer.clearColor() }
    isWebGL2() { return this.gl ? this.renderer._isWebGL2 : !1 }
    render() { this.renderer.nextRender.execute(), !(!this.renderer.state.drawingEnabled && !this.renderer.state.forceRender) && (this.renderer.state.forceRender && (this.renderer.state.forceRender = !1), this._onRenderCallback && this._onRenderCallback(), this.renderer.render()) }
    _addListeners() { this._resizeHandler = null, this._autoResize && (this._resizeHandler = this.resize.bind(this, !0), window.addEventListener("resize", this._resizeHandler, !1)) }
    setPixelRatio(e, t) { this.pixelRatio = parseFloat(Math.max(e, 1)) || 1, this.renderer.setPixelRatio(e), this.resize(t) }
    _setSize() { this.renderer.setSize(), this._scrollManager.shouldWatch && (this._scrollManager.xOffset = window.pageXOffset, this._scrollManager.yOffset = window.pageYOffset) }
    getBoundingRect() { return this.renderer._boundingRect }
    resize(e) { this.gl && (this._setSize(), this.renderer.resize(), this.nextRender(() => { this._onAfterResizeCallback && e && this._onAfterResizeCallback() })) }
    _initScroll() { this._scrollManager = new je({ xOffset: window.pageXOffset, yOffset: window.pageYOffset, lastXDelta: 0, lastYDelta: 0, shouldWatch: this._watchScroll, onScroll: (e, t) => this._updateScroll(e, t) }) }
    _updateScroll(e, t) { for (let i = 0; i < this.planes.length; i++) this.planes[i].watchScroll && this.planes[i].updateScrollPosition(e, t);
      this.renderer.needRender(), this._onScrollCallback && this._onScrollCallback() }
    updateScrollValues(e, t) { this._scrollManager.updateScrollValues(e, t) }
    getScrollDeltas() { return { x: this._scrollManager.lastXDelta, y: this._scrollManager.lastYDelta } }
    getScrollValues() { return { x: this._scrollManager.xOffset, y: this._scrollManager.yOffset } }
    _keepSync() { this.planes = this.renderer.planes, this.shaderPasses = this.renderer.shaderPasses, this.renderTargets = this.renderer.renderTargets }
    lerp(e, t, i) { return Ve(e, t, i) }
    onAfterResize(e) { return e && (this._onAfterResizeCallback = e), this }
    onError(e) { return e && (this._onErrorCallback = e), this }
    _onRendererError() { setTimeout(() => { this._onErrorCallback && !this.errors && this._onErrorCallback(), this.errors = !0 }, 0) }
    onSuccess(e) { return e && (this._onSuccessCallback = e), this }
    _onRendererSuccess() { setTimeout(() => { this._onSuccessCallback && this._onSuccessCallback() }, 0) }
    onContextLost(e) { return e && (this._onContextLostCallback = e), this }
    _onRendererContextLost() { this._onContextLostCallback && this._onContextLostCallback() }
    onContextRestored(e) { return e && (this._onContextRestoredCallback = e), this }
    _onRendererContextRestored() { this._onContextRestoredCallback && this._onContextRestoredCallback() }
    onRender(e) { return e && (this._onRenderCallback = e), this }
    onScroll(e) { return e && (this._onScrollCallback = e), this }
    dispose() { this.renderer.dispose() }
    _onRendererDisposed() { this._animationFrameID && window.cancelAnimationFrame(this._animationFrameID), this._resizeHandler && window.removeEventListener("resize", this._resizeHandler, !1), this._scrollManager && this._scrollManager.dispose() } }
  class qe { constructor(e, t, i) { if (this.type = "Uniforms", !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { I(this.type + ": Renderer WebGL context is undefined", e); return } if (this.renderer = e, this.gl = e.gl, this.program = t, this.uniforms = {}, i)
        for (const s in i) { const r = i[s];
          this.uniforms[s] = { name: r.name, type: r.type, value: r.value.clone && typeof r.value.clone == "function" ? r.value.clone() : r.value, update: null } } }
    handleUniformSetting(e) { switch (e.type) {
        case "1i":
          e.update = this.setUniform1i.bind(this); break;
        case "1iv":
          e.update = this.setUniform1iv.bind(this); break;
        case "1f":
          e.update = this.setUniform1f.bind(this); break;
        case "1fv":
          e.update = this.setUniform1fv.bind(this); break;
        case "2i":
          e.update = this.setUniform2i.bind(this); break;
        case "2iv":
          e.update = this.setUniform2iv.bind(this); break;
        case "2f":
          e.update = this.setUniform2f.bind(this); break;
        case "2fv":
          e.update = this.setUniform2fv.bind(this); break;
        case "3i":
          e.update = this.setUniform3i.bind(this); break;
        case "3iv":
          e.update = this.setUniform3iv.bind(this); break;
        case "3f":
          e.update = this.setUniform3f.bind(this); break;
        case "3fv":
          e.update = this.setUniform3fv.bind(this); break;
        case "4i":
          e.update = this.setUniform4i.bind(this); break;
        case "4iv":
          e.update = this.setUniform4iv.bind(this); break;
        case "4f":
          e.update = this.setUniform4f.bind(this); break;
        case "4fv":
          e.update = this.setUniform4fv.bind(this); break;
        case "mat2":
          e.update = this.setUniformMatrix2fv.bind(this); break;
        case "mat3":
          e.update = this.setUniformMatrix3fv.bind(this); break;
        case "mat4":
          e.update = this.setUniformMatrix4fv.bind(this); break;
        default:
          this.renderer.production || _(this.type + ": This uniform type is not handled : ", e.type) } }
    setInternalFormat(e) { e.value.type === "Vec2" ? (e._internalFormat = "Vec2", e.lastValue = e.value.clone()) : e.value.type === "Vec3" ? (e._internalFormat = "Vec3", e.lastValue = e.value.clone()) : e.value.type === "Mat4" ? (e._internalFormat = "Mat4", e.lastValue = e.value.clone()) : e.value.type === "Quat" ? (e._internalFormat = "Quat", e.lastValue = e.value.clone()) : Array.isArray(e.value) ? (e._internalFormat = "array", e.lastValue = Array.from(e.value)) : e.value.constructor === Float32Array ? (e._internalFormat = "mat", e.lastValue = e.value) : (e._internalFormat = "float", e.lastValue = e.value) }
    setUniforms() { if (this.uniforms)
        for (const e in this.uniforms) { let t = this.uniforms[e];
          t.location = this.gl.getUniformLocation(this.program, t.name), t._internalFormat || this.setInternalFormat(t), t.type || (t._internalFormat === "Vec2" ? t.type = "2f" : t._internalFormat === "Vec3" ? t.type = "3f" : t._internalFormat === "Mat4" ? t.type = "mat4" : t._internalFormat === "array" ? t.value.length === 4 ? (t.type = "4f", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a 4f (array of 4 floats) uniform type")) : t.value.length === 3 ? (t.type = "3f", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a 3f (array of 3 floats) uniform type")) : t.value.length === 2 && (t.type = "2f", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a 2f (array of 2 floats) uniform type")) : t._internalFormat === "mat" ? t.value.length === 16 ? (t.type = "mat4", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a mat4 (4x4 matrix array) uniform type")) : t.value.length === 9 ? (t.type = "mat3", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a mat3 (3x3 matrix array) uniform type")) : t.value.length === 4 && (t.type = "mat2", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a mat2 (2x2 matrix array) uniform type")) : (t.type = "1f", this.renderer.production || _(this.type + ": No uniform type declared for " + t.name + ", applied a 1f (float) uniform type"))), this.handleUniformSetting(t), t.update && t.update(t) } }
    updateUniforms() { if (this.uniforms)
        for (const e in this.uniforms) { const t = this.uniforms[e]; let i = !1;
          t._internalFormat === "Vec2" || t._internalFormat === "Vec3" || t._internalFormat === "Quat" ? t.value.equals(t.lastValue) || (i = !0, t.lastValue.copy(t.value)) : t.value.length ? JSON.stringify(t.value) !== JSON.stringify(t.lastValue) && (i = !0, t.lastValue = Array.from(t.value)) : t.value !== t.lastValue && (i = !0, t.lastValue = t.value), i && t.update && t.update(t) } }
    setUniform1i(e) { this.gl.uniform1i(e.location, e.value) }
    setUniform1iv(e) { this.gl.uniform1iv(e.location, e.value) }
    setUniform1f(e) { this.gl.uniform1f(e.location, e.value) }
    setUniform1fv(e) { this.gl.uniform1fv(e.location, e.value) }
    setUniform2i(e) { e._internalFormat === "Vec2" ? this.gl.uniform2i(e.location, e.value.x, e.value.y) : this.gl.uniform2i(e.location, e.value[0], e.value[1]) }
    setUniform2iv(e) { e._internalFormat === "Vec2" ? this.gl.uniform2iv(e.location, [e.value.x, e.value.y]) : this.gl.uniform2iv(e.location, e.value) }
    setUniform2f(e) { e._internalFormat === "Vec2" ? this.gl.uniform2f(e.location, e.value.x, e.value.y) : this.gl.uniform2f(e.location, e.value[0], e.value[1]) }
    setUniform2fv(e) { e._internalFormat === "Vec2" ? this.gl.uniform2fv(e.location, [e.value.x, e.value.y]) : this.gl.uniform2fv(e.location, e.value) }
    setUniform3i(e) { e._internalFormat === "Vec3" ? this.gl.uniform3i(e.location, e.value.x, e.value.y, e.value.z) : this.gl.uniform3i(e.location, e.value[0], e.value[1], e.value[2]) }
    setUniform3iv(e) { e._internalFormat === "Vec3" ? this.gl.uniform3iv(e.location, [e.value.x, e.value.y, e.value.z]) : this.gl.uniform3iv(e.location, e.value) }
    setUniform3f(e) { e._internalFormat === "Vec3" ? this.gl.uniform3f(e.location, e.value.x, e.value.y, e.value.z) : this.gl.uniform3f(e.location, e.value[0], e.value[1], e.value[2]) }
    setUniform3fv(e) { e._internalFormat === "Vec3" ? this.gl.uniform3fv(e.location, [e.value.x, e.value.y, e.value.z]) : this.gl.uniform3fv(e.location, e.value) }
    setUniform4i(e) { e._internalFormat === "Quat" ? this.gl.uniform4i(e.location, e.value.elements[0], e.value.elements[1], e.value.elements[2], e.value[3]) : this.gl.uniform4i(e.location, e.value[0], e.value[1], e.value[2], e.value[3]) }
    setUniform4iv(e) { e._internalFormat === "Quat" ? this.gl.uniform4iv(e.location, [e.value.elements[0], e.value.elements[1], e.value.elements[2], e.value[3]]) : this.gl.uniform4iv(e.location, e.value) }
    setUniform4f(e) { e._internalFormat === "Quat" ? this.gl.uniform4f(e.location, e.value.elements[0], e.value.elements[1], e.value.elements[2], e.value[3]) : this.gl.uniform4f(e.location, e.value[0], e.value[1], e.value[2], e.value[3]) }
    setUniform4fv(e) { e._internalFormat === "Quat" ? this.gl.uniform4fv(e.location, [e.value.elements[0], e.value.elements[1], e.value.elements[2], e.value[3]]) : this.gl.uniform4fv(e.location, e.value) }
    setUniformMatrix2fv(e) { this.gl.uniformMatrix2fv(e.location, !1, e.value) }
    setUniformMatrix3fv(e) { this.gl.uniformMatrix3fv(e.location, !1, e.value) }
    setUniformMatrix4fv(e) { e._internalFormat === "Mat4" ? this.gl.uniformMatrix4fv(e.location, !1, e.value.elements) : this.gl.uniformMatrix4fv(e.location, !1, e.value) } } const re = `
precision mediump float;
`.replace(/\n/g, ""),
    _e = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
`.replace(/\n/g, ""),
    ae = `
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
`.replace(/\n/g, ""),
    $e = (re + _e + ae + `
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g, ""),
    Qe = (re + ae + `
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`).replace(/\n/g, ""),
    Ze = (re + _e + ae + `
void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g, ""),
    Ke = (re + ae + `
uniform sampler2D uRenderTexture;

void main() {
    gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
}
`).replace(/\n/g, ""); let xe = 0;
  class ye { constructor(e, { parent: t, vertexShader: i, fragmentShader: s } = {}) { if (this.type = "Program", !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { I(this.type + ": Renderer WebGL context is undefined", e); return }
      this.renderer = e, this.gl = this.renderer.gl, this.parent = t, this.defaultVsCode = this.parent.type === "Plane" ? $e : Ze, this.defaultFsCode = this.parent.type === "Plane" ? Qe : Ke, i ? this.vsCode = i : (!this.renderer.production && this.parent.type === "Plane" && _(this.parent.type + ": No vertex shader provided, will use a default one"), this.vsCode = this.defaultVsCode), s ? this.fsCode = s : (this.renderer.production || _(this.parent.type + ": No fragment shader provided, will use a default one"), this.fsCode = this.defaultFsCode), this.compiled = !0, this.setupProgram() }
    createShader(e, t) { const i = this.gl.createShader(t); if (this.gl.shaderSource(i, e), this.gl.compileShader(i), !this.renderer.production && !this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS)) { const s = t === this.gl.VERTEX_SHADER ? "vertex shader" : "fragment shader"; let n = this.gl.getShaderSource(i).split(`
`); for (let h = 0; h < n.length; h++) n[h] = h + 1 + ": " + n[h]; return n = n.join(`
`), _(this.type + ": Errors occurred while compiling the", s, `:
`, this.gl.getShaderInfoLog(i)), I(n), _(this.type + ": Will use a default", s), this.createShader(t === this.gl.VERTEX_SHADER ? this.defaultVsCode : this.defaultFsCode, t) } return i }
    useNewShaders() { this.vertexShader = this.createShader(this.vsCode, this.gl.VERTEX_SHADER), this.fragmentShader = this.createShader(this.fsCode, this.gl.FRAGMENT_SHADER), (!this.vertexShader || !this.fragmentShader) && (this.renderer.production || _(this.type + ": Unable to find or compile the vertex or fragment shader")) }
    setupProgram() { let e = this.renderer.cache.getProgramFromShaders(this.vsCode, this.fsCode);
      e ? (this.vertexShader = e.vertexShader, this.fragmentShader = e.fragmentShader, this.activeUniforms = e.activeUniforms, this.activeAttributes = e.activeAttributes, this.createProgram()) : (this.useNewShaders(), this.compiled && (this.createProgram(), this.renderer.cache.addProgram(this))) }
    createProgram() { if (xe++, this.id = xe, this.program = this.gl.createProgram(), this.gl.attachShader(this.program, this.vertexShader), this.gl.attachShader(this.program, this.fragmentShader), this.gl.linkProgram(this.program), !this.renderer.production && !this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) { _(this.type + ": Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.program)), _(this.type + ": Will use default vertex and fragment shaders"), this.vertexShader = this.createShader(this.defaultVsCode, this.gl.VERTEX_SHADER), this.fragmentShader = this.createShader(this.defaultFsCode, this.gl.FRAGMENT_SHADER), this.createProgram(); return } if (this.gl.deleteShader(this.vertexShader), this.gl.deleteShader(this.fragmentShader), !this.activeUniforms || !this.activeAttributes) { this.activeUniforms = { textures: [], textureMatrices: [] }; const e = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS); for (let i = 0; i < e; i++) { const s = this.gl.getActiveUniform(this.program, i);
          s.type === this.gl.SAMPLER_2D && this.activeUniforms.textures.push(s.name), s.type === this.gl.FLOAT_MAT4 && s.name !== "uMVMatrix" && s.name !== "uPMatrix" && this.activeUniforms.textureMatrices.push(s.name) }
        this.activeAttributes = []; const t = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES); for (let i = 0; i < t; i++) { const s = this.gl.getActiveAttrib(this.program, i);
          this.activeAttributes.push(s.name) } } }
    createUniforms(e) { this.uniformsManager = new qe(this.renderer, this.program, e), this.setUniforms() }
    setUniforms() { this.renderer.useProgram(this), this.uniformsManager.setUniforms() }
    updateUniforms() { this.renderer.useProgram(this), this.uniformsManager.updateUniforms() } }
  class Je { constructor(e, { program: t = null, width: i = 1, height: s = 1 } = {}) { if (this.type = "Geometry", !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { I(this.type + ": Renderer WebGL context is undefined", e); return }
      this.renderer = e, this.gl = this.renderer.gl, this.definition = { id: i * s + i, width: i, height: s }, this.setDefaultAttributes(), this.setVerticesUVs() }
    restoreContext(e) { this.program = null, this.setDefaultAttributes(), this.setVerticesUVs(), this.setProgram(e) }
    setDefaultAttributes() { this.attributes = { vertexPosition: { name: "aVertexPosition", size: 3, isActive: !1 }, textureCoord: { name: "aTextureCoord", size: 3, isActive: !1 } } }
    setVerticesUVs() { const e = this.renderer.cache.getGeometryFromID(this.definition.id);
      e ? (this.attributes.vertexPosition.array = e.vertices, this.attributes.textureCoord.array = e.uvs) : (this.computeVerticesUVs(), this.renderer.cache.addGeometry(this.definition.id, this.attributes.vertexPosition.array, this.attributes.textureCoord.array)) }
    setProgram(e) { this.program = e, this.initAttributes(), this.renderer._isWebGL2 ? (this._vao = this.gl.createVertexArray(), this.gl.bindVertexArray(this._vao)) : this.renderer.extensions.OES_vertex_array_object && (this._vao = this.renderer.extensions.OES_vertex_array_object.createVertexArrayOES(), this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao)), this.initializeBuffers() }
    initAttributes() { for (const e in this.attributes) { if (this.attributes[e].isActive = this.program.activeAttributes.includes(this.attributes[e].name), !this.attributes[e].isActive) return;
        this.attributes[e].location = this.gl.getAttribLocation(this.program.program, this.attributes[e].name), this.attributes[e].buffer = this.gl.createBuffer(), this.attributes[e].numberOfItems = this.definition.width * this.definition.height * this.attributes[e].size * 2 } }
    computeVerticesUVs() { this.attributes.vertexPosition.array = [], this.attributes.textureCoord.array = []; const e = this.attributes.vertexPosition.array,
        t = this.attributes.textureCoord.array; for (let i = 0; i < this.definition.height; i++) { const s = i / this.definition.height; for (let r = 0; r < this.definition.width; r++) { const n = r / this.definition.width;
          t.push(n), t.push(s), t.push(0), e.push((n - .5) * 2), e.push((s - .5) * 2), e.push(0), t.push(n + 1 / this.definition.width), t.push(s), t.push(0), e.push((n + 1 / this.definition.width - .5) * 2), e.push((s - .5) * 2), e.push(0), t.push(n), t.push(s + 1 / this.definition.height), t.push(0), e.push((n - .5) * 2), e.push((s + 1 / this.definition.height - .5) * 2), e.push(0), t.push(n), t.push(s + 1 / this.definition.height), t.push(0), e.push((n - .5) * 2), e.push((s + 1 / this.definition.height - .5) * 2), e.push(0), t.push(n + 1 / this.definition.width), t.push(s), t.push(0), e.push((n + 1 / this.definition.width - .5) * 2), e.push((s - .5) * 2), e.push(0), t.push(n + 1 / this.definition.width), t.push(s + 1 / this.definition.height), t.push(0), e.push((n + 1 / this.definition.width - .5) * 2), e.push((s + 1 / this.definition.height - .5) * 2), e.push(0) } } }
    initializeBuffers() { if (this.attributes) { for (const e in this.attributes) { if (!this.attributes[e].isActive) return;
          this.gl.enableVertexAttribArray(this.attributes[e].location), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.attributes[e].buffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.attributes[e].array), this.gl.STATIC_DRAW), this.gl.vertexAttribPointer(this.attributes[e].location, this.attributes[e].size, this.gl.FLOAT, !1, 0, 0) }
        this.renderer.state.currentGeometryID = this.definition.id } }
    bindBuffers() { if (this._vao) this.renderer._isWebGL2 ? this.gl.bindVertexArray(this._vao) : this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao);
      else
        for (const e in this.attributes) { if (!this.attributes[e].isActive) return;
          this.gl.enableVertexAttribArray(this.attributes[e].location), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.attributes[e].buffer), this.gl.vertexAttribPointer(this.attributes[e].location, this.attributes[e].size, this.gl.FLOAT, !1, 0, 0) }
      this.renderer.state.currentGeometryID = this.definition.id }
    draw() { this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.vertexPosition.numberOfItems) }
    dispose() { this._vao && (this.renderer._isWebGL2 ? this.gl.deleteVertexArray(this._vao) : this.renderer.extensions.OES_vertex_array_object.deleteVertexArrayOES(this._vao)); for (const e in this.attributes) { if (!this.attributes[e].isActive) return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.attributes[e].buffer), this.gl.bufferData(this.gl.ARRAY_BUFFER, 1, this.gl.STATIC_DRAW), this.gl.deleteBuffer(this.attributes[e].buffer) }
      this.attributes = null, this.renderer.state.currentGeometryID = null } }
  class $ { constructor(e = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])) { this.type = "Mat4", this.elements = e }
    setFromArray(e) { for (let t = 0; t < this.elements.length; t++) this.elements[t] = e[t]; return this }
    copy(e) { const t = e.elements; return this.elements[0] = t[0], this.elements[1] = t[1], this.elements[2] = t[2], this.elements[3] = t[3], this.elements[4] = t[4], this.elements[5] = t[5], this.elements[6] = t[6], this.elements[7] = t[7], this.elements[8] = t[8], this.elements[9] = t[9], this.elements[10] = t[10], this.elements[11] = t[11], this.elements[12] = t[12], this.elements[13] = t[13], this.elements[14] = t[14], this.elements[15] = t[15], this }
    clone() { return new $().copy(this) }
    multiply(e) { const t = this.elements,
        i = e.elements; let s = new $; return s.elements[0] = i[0] * t[0] + i[1] * t[4] + i[2] * t[8] + i[3] * t[12], s.elements[1] = i[0] * t[1] + i[1] * t[5] + i[2] * t[9] + i[3] * t[13], s.elements[2] = i[0] * t[2] + i[1] * t[6] + i[2] * t[10] + i[3] * t[14], s.elements[3] = i[0] * t[3] + i[1] * t[7] + i[2] * t[11] + i[3] * t[15], s.elements[4] = i[4] * t[0] + i[5] * t[4] + i[6] * t[8] + i[7] * t[12], s.elements[5] = i[4] * t[1] + i[5] * t[5] + i[6] * t[9] + i[7] * t[13], s.elements[6] = i[4] * t[2] + i[5] * t[6] + i[6] * t[10] + i[7] * t[14], s.elements[7] = i[4] * t[3] + i[5] * t[7] + i[6] * t[11] + i[7] * t[15], s.elements[8] = i[8] * t[0] + i[9] * t[4] + i[10] * t[8] + i[11] * t[12], s.elements[9] = i[8] * t[1] + i[9] * t[5] + i[10] * t[9] + i[11] * t[13], s.elements[10] = i[8] * t[2] + i[9] * t[6] + i[10] * t[10] + i[11] * t[14], s.elements[11] = i[8] * t[3] + i[9] * t[7] + i[10] * t[11] + i[11] * t[15], s.elements[12] = i[12] * t[0] + i[13] * t[4] + i[14] * t[8] + i[15] * t[12], s.elements[13] = i[12] * t[1] + i[13] * t[5] + i[14] * t[9] + i[15] * t[13], s.elements[14] = i[12] * t[2] + i[13] * t[6] + i[14] * t[10] + i[15] * t[14], s.elements[15] = i[12] * t[3] + i[13] * t[7] + i[14] * t[11] + i[15] * t[15], s }
    getInverse() { const e = this.elements,
        t = new $,
        i = t.elements; let s = e[0],
        r = e[1],
        n = e[2],
        h = e[3],
        l = e[4],
        o = e[5],
        c = e[6],
        f = e[7],
        x = e[8],
        m = e[9],
        u = e[10],
        p = e[11],
        g = e[12],
        y = e[13],
        v = e[14],
        b = e[15],
        P = s * o - r * l,
        M = s * c - n * l,
        T = s * f - h * l,
        R = r * c - n * o,
        D = r * f - h * o,
        F = n * f - h * c,
        A = x * y - m * g,
        S = x * v - u * g,
        k = x * b - p * g,
        N = m * v - u * y,
        z = m * b - p * y,
        L = u * b - p * v,
        w = P * L - M * z + T * N + R * k - D * S + F * A; return w ? (w = 1 / w, i[0] = (o * L - c * z + f * N) * w, i[1] = (n * z - r * L - h * N) * w, i[2] = (y * F - v * D + b * R) * w, i[3] = (u * D - m * F - p * R) * w, i[4] = (c * k - l * L - f * S) * w, i[5] = (s * L - n * k + h * S) * w, i[6] = (v * T - g * F - b * M) * w, i[7] = (x * F - u * T + p * M) * w, i[8] = (l * z - o * k + f * A) * w, i[9] = (r * k - s * z - h * A) * w, i[10] = (g * D - y * T + b * P) * w, i[11] = (m * T - x * D - p * P) * w, i[12] = (o * S - l * N - c * A) * w, i[13] = (s * N - r * S + n * A) * w, i[14] = (y * M - g * R - v * P) * w, i[15] = (x * R - m * M + u * P) * w, t) : null }
    scale(e) { let t = this.elements; return t[0] *= e.x, t[1] *= e.x, t[2] *= e.x, t[3] *= e.x, t[4] *= e.y, t[5] *= e.y, t[6] *= e.y, t[7] *= e.y, t[8] *= e.z, t[9] *= e.z, t[10] *= e.z, t[11] *= e.z, this }
    compose(e, t, i) { let s = this.elements; const r = t.elements[0],
        n = t.elements[1],
        h = t.elements[2],
        l = t.elements[3],
        o = r + r,
        c = n + n,
        f = h + h,
        x = r * o,
        m = r * c,
        u = r * f,
        p = n * c,
        g = n * f,
        y = h * f,
        v = l * o,
        b = l * c,
        P = l * f,
        M = i.x,
        T = i.y,
        R = i.z; return s[0] = (1 - (p + y)) * M, s[1] = (m + P) * M, s[2] = (u - b) * M, s[3] = 0, s[4] = (m - P) * T, s[5] = (1 - (x + y)) * T, s[6] = (g + v) * T, s[7] = 0, s[8] = (u + b) * R, s[9] = (g - v) * R, s[10] = (1 - (x + p)) * R, s[11] = 0, s[12] = e.x, s[13] = e.y, s[14] = e.z, s[15] = 1, this }
    composeFromOrigin(e, t, i, s) { let r = this.elements; const n = t.elements[0],
        h = t.elements[1],
        l = t.elements[2],
        o = t.elements[3],
        c = n + n,
        f = h + h,
        x = l + l,
        m = n * c,
        u = n * f,
        p = n * x,
        g = h * f,
        y = h * x,
        v = l * x,
        b = o * c,
        P = o * f,
        M = o * x,
        T = i.x,
        R = i.y,
        D = i.z,
        F = s.x,
        A = s.y,
        S = s.z,
        k = (1 - (g + v)) * T,
        N = (u + M) * T,
        z = (p - P) * T,
        L = (u - M) * R,
        w = (1 - (m + v)) * R,
        Z = (y + b) * R,
        K = (p + P) * D,
        J = (y - b) * D,
        W = (1 - (m + g)) * D; return r[0] = k, r[1] = N, r[2] = z, r[3] = 0, r[4] = L, r[5] = w, r[6] = Z, r[7] = 0, r[8] = K, r[9] = J, r[10] = W, r[11] = 0, r[12] = e.x + F - (k * F + L * A + K * S), r[13] = e.y + A - (N * F + w * A + J * S), r[14] = e.z + S - (z * F + Z * A + W * S), r[15] = 1, this } }
  class O { constructor(e = 0, t = e) { this.type = "Vec2", this._x = e, this._y = t }
    get x() { return this._x }
    get y() { return this._y }
    set x(e) { const t = e !== this._x;
      this._x = e, t && this._onChangeCallback && this._onChangeCallback() }
    set y(e) { const t = e !== this._y;
      this._y = e, t && this._onChangeCallback && this._onChangeCallback() }
    onChange(e) { return e && (this._onChangeCallback = e), this }
    set(e, t) { return this._x = e, this._y = t, this }
    add(e) { return this._x += e.x, this._y += e.y, this }
    addScalar(e) { return this._x += e, this._y += e, this }
    sub(e) { return this._x -= e.x, this._y -= e.y, this }
    subScalar(e) { return this._x -= e, this._y -= e, this }
    multiply(e) { return this._x *= e.x, this._y *= e.y, this }
    multiplyScalar(e) { return this._x *= e, this._y *= e, this }
    copy(e) { return this._x = e.x, this._y = e.y, this }
    clone() { return new O(this._x, this._y) }
    sanitizeNaNValuesWith(e) { return this._x = isNaN(this._x) ? e.x : parseFloat(this._x), this._y = isNaN(this._y) ? e.y : parseFloat(this._y), this }
    max(e) { return this._x = Math.max(this._x, e.x), this._y = Math.max(this._y, e.y), this }
    min(e) { return this._x = Math.min(this._x, e.x), this._y = Math.min(this._y, e.y), this }
    equals(e) { return this._x === e.x && this._y === e.y }
    normalize() { let e = this._x * this._x + this._y * this._y; return e > 0 && (e = 1 / Math.sqrt(e)), this._x *= e, this._y *= e, this }
    dot(e) { return this._x * e.x + this._y * e.y } }
  class E { constructor(e = 0, t = e, i = e) { this.type = "Vec3", this._x = e, this._y = t, this._z = i }
    get x() { return this._x }
    get y() { return this._y }
    get z() { return this._z }
    set x(e) { const t = e !== this._x;
      this._x = e, t && this._onChangeCallback && this._onChangeCallback() }
    set y(e) { const t = e !== this._y;
      this._y = e, t && this._onChangeCallback && this._onChangeCallback() }
    set z(e) { const t = e !== this._z;
      this._z = e, t && this._onChangeCallback && this._onChangeCallback() }
    onChange(e) { return e && (this._onChangeCallback = e), this }
    set(e, t, i) { return this._x = e, this._y = t, this._z = i, this }
    add(e) { return this._x += e.x, this._y += e.y, this._z += e.z, this }
    addScalar(e) { return this._x += e, this._y += e, this._z += e, this }
    sub(e) { return this._x -= e.x, this._y -= e.y, this._z -= e.z, this }
    subScalar(e) { return this._x -= e, this._y -= e, this._z -= e, this }
    multiply(e) { return this._x *= e.x, this._y *= e.y, this._z *= e.z, this }
    multiplyScalar(e) { return this._x *= e, this._y *= e, this._z *= e, this }
    copy(e) { return this._x = e.x, this._y = e.y, this._z = e.z, this }
    clone() { return new E(this._x, this._y, this._z) }
    sanitizeNaNValuesWith(e) { return this._x = isNaN(this._x) ? e.x : parseFloat(this._x), this._y = isNaN(this._y) ? e.y : parseFloat(this._y), this._z = isNaN(this._z) ? e.z : parseFloat(this._z), this }
    max(e) { return this._x = Math.max(this._x, e.x), this._y = Math.max(this._y, e.y), this._z = Math.max(this._z, e.z), this }
    min(e) { return this._x = Math.min(this._x, e.x), this._y = Math.min(this._y, e.y), this._z = Math.min(this._z, e.z), this }
    equals(e) { return this._x === e.x && this._y === e.y && this._z === e.z }
    normalize() { let e = this._x * this._x + this._y * this._y + this._z * this._z; return e > 0 && (e = 1 / Math.sqrt(e)), this._x *= e, this._y *= e, this._z *= e, this }
    dot(e) { return this._x * e.x + this._y * e.y + this._z * e.z }
    applyMat4(e) { const t = this._x,
        i = this._y,
        s = this._z,
        r = e.elements; let n = r[3] * t + r[7] * i + r[11] * s + r[15]; return n = n || 1, this._x = (r[0] * t + r[4] * i + r[8] * s + r[12]) / n, this._y = (r[1] * t + r[5] * i + r[9] * s + r[13]) / n, this._z = (r[2] * t + r[6] * i + r[10] * s + r[14]) / n, this }
    applyQuat(e) { const t = this._x,
        i = this._y,
        s = this._z,
        r = e.elements[0],
        n = e.elements[1],
        h = e.elements[2],
        l = e.elements[3],
        o = l * t + n * s - h * i,
        c = l * i + h * t - r * s,
        f = l * s + r * i - n * t,
        x = -r * t - n * i - h * s; return this._x = o * l + x * -r + c * -h - f * -n, this._y = c * l + x * -n + f * -r - o * -h, this._z = f * l + x * -h + o * -n - c * -r, this }
    project(e) { return this.applyMat4(e.viewMatrix).applyMat4(e.projectionMatrix), this }
    unproject(e) { return this.applyMat4(e.projectionMatrix.getInverse()).applyMat4(e.worldMatrix), this } } const de = new O,
    et = new E,
    tt = new $;
  class ee { constructor(e, { isFBOTexture: t = !1, fromTexture: i = !1, loader: s, sampler: r, floatingPoint: n = "none", premultiplyAlpha: h = !1, anisotropy: l = 1, generateMipmap: o = null, wrapS: c, wrapT: f, minFilter: x, magFilter: m } = {}) { if (this.type = "Texture", e = e && e.renderer || e, !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { e.production || I(this.type + ": Unable to create a " + this.type + " because the Renderer WebGL context is not defined"); return } if (this.renderer = e, this.gl = this.renderer.gl, this.uuid = le(), this._globalParameters = { unpackAlignment: 4, flipY: !t, premultiplyAlpha: !1, shouldPremultiplyAlpha: h, floatingPoint: n, type: this.gl.UNSIGNED_BYTE, internalFormat: this.gl.RGBA, format: this.gl.RGBA }, this.parameters = { anisotropy: l, generateMipmap: o, wrapS: c || this.gl.CLAMP_TO_EDGE, wrapT: f || this.gl.CLAMP_TO_EDGE, minFilter: x || this.gl.LINEAR, magFilter: m || this.gl.LINEAR, _shouldUpdate: !0 }, this._initState(), this.sourceType = t ? "fbo" : "empty", this._useCache = !0, this._samplerName = r, this._sampler = { isActive: !1, isTextureBound: !1, texture: this.gl.createTexture() }, this._textureMatrix = { matrix: new $, isActive: !1 }, this._size = { width: 1, height: 1 }, this.scale = new O(1), this.scale.onChange(() => this.resize()), this.offset = new O, this.offset.onChange(() => this.resize()), this._loader = s, this._sourceLoaded = !1, this._uploaded = !1, this._willUpdate = !1, this.shouldUpdate = !1, this._forceUpdate = !1, this.userData = {}, this._canDraw = !1, i) { this._copyOnInit = !0, this._copiedFrom = i; return }
      this._copyOnInit = !1, this._initTexture() }
    _initState() { this._state = { anisotropy: 1, generateMipmap: !1, wrapS: null, wrapT: null, minFilter: null, magFilter: this.gl.LINEAR } }
    _initTexture() { this.gl.bindTexture(this.gl.TEXTURE_2D, this._sampler.texture), this.sourceType === "empty" && (this._globalParameters.flipY = !1, this._updateGlobalTexParameters(), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255])), this._canDraw = !0) }
    _restoreFromTexture() { this._copyOnInit || this._initTexture(), this._parent && (this._setTextureUniforms(), this._setSize()), this.copy(this._copiedFrom), this._canDraw = !0 }
    _restoreContext() { if (this._canDraw = !1, this._sampler.texture = this.gl.createTexture(), this._sampler.isActive = !1, this._sampler.isTextureBound = !1, this._textureMatrix.isActive = !1, this._initState(), this._state.generateMipmap = !1, this.parameters._shouldUpdate = !0, !this._copiedFrom) this._initTexture(), this._parent && this._setParent(), this.source && (this.setSource(this.source), this.sourceType === "image" ? this.renderer.cache.addTexture(this) : this.needUpdate()), this._canDraw = !0;
      else { const e = this.renderer.nextRender.add(() => { this._copiedFrom._canDraw && (this._restoreFromTexture(), e.keep = !1) }, !0) } }
    addParent(e) { if (!e || e.type !== "Plane" && e.type !== "PingPongPlane" && e.type !== "ShaderPass" && e.type !== "RenderTarget") { this.renderer.production || _(this.type + ": cannot add texture as a child of ", e, " because it is not a valid parent"); return }
      this._parent = e, this.index = this._parent.textures.length, this._parent.textures.push(this), this._setParent() }
    _setParent() { if (this._sampler.name = this._samplerName || "uSampler" + this.index, this._textureMatrix.name = this._samplerName ? this._samplerName + "Matrix" : "uTextureMatrix" + this.index, this._parent._program) { if (!this._parent._program.compiled) { this.renderer.production || _(this.type + ": Unable to create the texture because the program is not valid"); return } if (this._setTextureUniforms(), this._copyOnInit) { const e = this.renderer.nextRender.add(() => { this._copiedFrom._canDraw && this._copiedFrom._uploaded && (this.copy(this._copiedFrom), e.keep = !1) }, !0); return }
        this.source ? this._parent.loader && this._parent.loader._addSourceToParent(this.source, this.sourceType) : this._size = { width: this._parent._boundingRect.document.width, height: this._parent._boundingRect.document.height }, this._setSize() } else this._parent.type === "RenderTarget" && (this._size = { width: this._parent._size && this._parent._size.width || this.renderer._boundingRect.width, height: this._parent._size && this._parent._size.height || this.renderer._boundingRect.height }, this._upload(), this._updateTexParameters(), this._canDraw = !0) }
    hasParent() { return !!this._parent }
    _setTextureUniforms() { const e = this._parent._program.activeUniforms; for (let t = 0; t < e.textures.length; t++) e.textures[t] === this._sampler.name && (this._sampler.isActive = !0, this.renderer.useProgram(this._parent._program), this._sampler.location = this.gl.getUniformLocation(this._parent._program.program, this._sampler.name), e.textureMatrices.find(s => s === this._textureMatrix.name) && (this._textureMatrix.isActive = !0, this._textureMatrix.location = this.gl.getUniformLocation(this._parent._program.program, this._textureMatrix.name)), this.gl.uniform1i(this._sampler.location, this.index)) }
    copy(e) { if (!e || e.type !== "Texture") { this.renderer.production || _(this.type + ": Unable to set the texture from texture:", e); return }
      this._globalParameters = Object.assign({}, e._globalParameters), this._state = Object.assign({}, e._state), this.parameters.generateMipmap = e.parameters.generateMipmap, this._state.generateMipmap = null, this._size = e._size, !this._sourceLoaded && e._sourceLoaded && this._onSourceLoadedCallback && this._onSourceLoadedCallback(), this._sourceLoaded = e._sourceLoaded, !this._uploaded && e._uploaded && this._onSourceUploadedCallback && this._onSourceUploadedCallback(), this._uploaded = e._uploaded, this.sourceType = e.sourceType, this.source = e.source, this._videoFrameCallbackID = e._videoFrameCallbackID, this._sampler.texture = e._sampler.texture, this._copiedFrom = e, this._parent && this._parent._program && (!this._canDraw || !this._textureMatrix.matrix) && (this._setSize(), this._canDraw = !0), this._updateTexParameters(), this.renderer.needRender() }
    setSource(e) { this._sourceLoaded || this.renderer.nextRender.add(() => this._onSourceLoadedCallback && this._onSourceLoadedCallback()); const t = e.tagName.toUpperCase() === "IMG" ? "image" : e.tagName.toLowerCase(); if ((t === "video" || t === "canvas") && (this._useCache = !1), this._useCache) { const i = this.renderer.cache.getTextureFromSource(e); if (i && i.uuid !== this.uuid) { this._uploaded || (this.renderer.nextRender.add(() => this._onSourceUploadedCallback && this._onSourceUploadedCallback()), this._uploaded = !0), this.copy(i), this.resize(); return } } if (this.sourceType === "empty" || this.sourceType !== t)
        if (t === "video") this._willUpdate = !1, this.shouldUpdate = !0;
        else if (t === "canvas") this._willUpdate = !0, this.shouldUpdate = !0;
      else if (t === "image") this._willUpdate = !1, this.shouldUpdate = !1;
      else { this.renderer.production || _(this.type + ": this HTML tag could not be converted into a texture:", e.tagName); return }
      this.source = e, this.sourceType = t, this._size = { width: this.source.naturalWidth || this.source.width || this.source.videoWidth, height: this.source.naturalHeight || this.source.height || this.source.videoHeight }, this._sourceLoaded = !0, this.gl.bindTexture(this.gl.TEXTURE_2D, this._sampler.texture), this.resize(), this._globalParameters.flipY = !0, this._globalParameters.premultiplyAlpha = this._globalParameters.shouldPremultiplyAlpha, this.sourceType === "image" && (this.parameters.generateMipmap = this.parameters.generateMipmap || this.parameters.generateMipmap === null, this.parameters._shouldUpdate = this.parameters.generateMipmap, this._state.generateMipmap = !1, this._upload()), this.renderer.needRender() }
    _updateGlobalTexParameters() { this.renderer.state.unpackAlignment !== this._globalParameters.unpackAlignment && (this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this._globalParameters.unpackAlignment), this.renderer.state.unpackAlignment = this._globalParameters.unpackAlignment), this.renderer.state.flipY !== this._globalParameters.flipY && (this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this._globalParameters.flipY), this.renderer.state.flipY = this._globalParameters.flipY), this.renderer.state.premultiplyAlpha !== this._globalParameters.premultiplyAlpha && (this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._globalParameters.premultiplyAlpha), this.renderer.state.premultiplyAlpha = this._globalParameters.premultiplyAlpha), this._globalParameters.floatingPoint === "half-float" ? this.renderer._isWebGL2 && this.renderer.extensions.EXT_color_buffer_float ? (this._globalParameters.internalFormat = this.gl.RGBA16F, this._globalParameters.type = this.gl.HALF_FLOAT) : this.renderer.extensions.OES_texture_half_float ? this._globalParameters.type = this.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES : this.renderer.production || _(this.type + ": could not use half-float textures because the extension is not available") : this._globalParameters.floatingPoint === "float" && (this.renderer._isWebGL2 && this.renderer.extensions.EXT_color_buffer_float ? (this._globalParameters.internalFormat = this.gl.RGBA16F, this._globalParameters.type = this.gl.FLOAT) : this.renderer.extensions.OES_texture_float ? this._globalParameters.type = this.renderer.extensions.OES_texture_half_float.FLOAT : this.renderer.production || _(this.type + ": could not use float textures because the extension is not available")) }
    _updateTexParameters() { this.index && this.renderer.state.activeTexture !== this.index && this._bindTexture(), this.parameters.wrapS !== this._state.wrapS && (!this.renderer._isWebGL2 && (!q(this._size.width) || !q(this._size.height)) && (this.parameters.wrapS = this.gl.CLAMP_TO_EDGE), this.parameters.wrapS !== this.gl.REPEAT && this.parameters.wrapS !== this.gl.CLAMP_TO_EDGE && this.parameters.wrapS !== this.gl.MIRRORED_REPEAT && (this.renderer.production || _(this.type + ": Wrong wrapS value", this.parameters.wrapS, "for this texture:", this, `
gl.CLAMP_TO_EDGE wrapping will be used instead`), this.parameters.wrapS = this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.parameters.wrapS), this._state.wrapS = this.parameters.wrapS), this.parameters.wrapT !== this._state.wrapT && (!this.renderer._isWebGL2 && (!q(this._size.width) || !q(this._size.height)) && (this.parameters.wrapT = this.gl.CLAMP_TO_EDGE), this.parameters.wrapT !== this.gl.REPEAT && this.parameters.wrapT !== this.gl.CLAMP_TO_EDGE && this.parameters.wrapT !== this.gl.MIRRORED_REPEAT && (this.renderer.production || _(this.type + ": Wrong wrapT value", this.parameters.wrapT, "for this texture:", this, `
gl.CLAMP_TO_EDGE wrapping will be used instead`), this.parameters.wrapT = this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.parameters.wrapT), this._state.wrapT = this.parameters.wrapT), this.parameters.generateMipmap && !this._state.generateMipmap && this.source && (!this.renderer._isWebGL2 && (!q(this._size.width) || !q(this._size.height)) ? this.parameters.generateMipmap = !1 : this.gl.generateMipmap(this.gl.TEXTURE_2D), this._state.generateMipmap = this.parameters.generateMipmap), this.parameters.minFilter !== this._state.minFilter && (!this.renderer._isWebGL2 && (!q(this._size.width) || !q(this._size.height)) && (this.parameters.minFilter = this.gl.LINEAR), !this.parameters.generateMipmap && this.parameters.generateMipmap !== null && (this.parameters.minFilter = this.gl.LINEAR), this.parameters.minFilter !== this.gl.LINEAR && this.parameters.minFilter !== this.gl.NEAREST && this.parameters.minFilter !== this.gl.NEAREST_MIPMAP_NEAREST && this.parameters.minFilter !== this.gl.LINEAR_MIPMAP_NEAREST && this.parameters.minFilter !== this.gl.NEAREST_MIPMAP_LINEAR && this.parameters.minFilter !== this.gl.LINEAR_MIPMAP_LINEAR && (this.renderer.production || _(this.type + ": Wrong minFilter value", this.parameters.minFilter, "for this texture:", this, `
gl.LINEAR filtering will be used instead`), this.parameters.minFilter = this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.parameters.minFilter), this._state.minFilter = this.parameters.minFilter), this.parameters.magFilter !== this._state.magFilter && (!this.renderer._isWebGL2 && (!q(this._size.width) || !q(this._size.height)) && (this.parameters.magFilter = this.gl.LINEAR), this.parameters.magFilter !== this.gl.LINEAR && this.parameters.magFilter !== this.gl.NEAREST && (this.renderer.production || _(this.type + ": Wrong magFilter value", this.parameters.magFilter, "for this texture:", this, `
gl.LINEAR filtering will be used instead`), this.parameters.magFilter = this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.parameters.magFilter), this._state.magFilter = this.parameters.magFilter); const e = this.renderer.extensions.EXT_texture_filter_anisotropic; if (e && this.parameters.anisotropy !== this._state.anisotropy) { const t = this.gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        this.parameters.anisotropy = Math.max(1, Math.min(this.parameters.anisotropy, t)), this.gl.texParameterf(this.gl.TEXTURE_2D, e.TEXTURE_MAX_ANISOTROPY_EXT, this.parameters.anisotropy), this._state.anisotropy = this.parameters.anisotropy } }
    setWrapS(e) { this.parameters.wrapS !== e && (this.parameters.wrapS = e, this.parameters._shouldUpdate = !0) }
    setWrapT(e) { this.parameters.wrapT !== e && (this.parameters.wrapT = e, this.parameters._shouldUpdate = !0) }
    setMinFilter(e) { this.parameters.minFilter !== e && (this.parameters.minFilter = e, this.parameters._shouldUpdate = !0) }
    setMagFilter(e) { this.parameters.magFilter !== e && (this.parameters.magFilter = e, this.parameters._shouldUpdate = !0) }
    setAnisotropy(e) { e = isNaN(e) ? this.parameters.anisotropy : e, this.parameters.anisotropy !== e && (this.parameters.anisotropy = e, this.parameters._shouldUpdate = !0) }
    needUpdate() { this._forceUpdate = !0 }
    _videoFrameCallback() { this._willUpdate = !0, this.source.requestVideoFrameCallback(() => this._videoFrameCallback()) }
    _upload() { this._updateGlobalTexParameters(), this.source ? this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._globalParameters.internalFormat, this._globalParameters.format, this._globalParameters.type, this.source) : this.sourceType === "fbo" && this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._globalParameters.internalFormat, this._size.width, this._size.height, 0, this._globalParameters.format, this._globalParameters.type, this.source || null), this._uploaded || (this.renderer.nextRender.add(() => this._onSourceUploadedCallback && this._onSourceUploadedCallback()), this._uploaded = !0) }
    _getSizes() { if (this.sourceType === "fbo") return { parentWidth: this._parent._boundingRect.document.width, parentHeight: this._parent._boundingRect.document.height, sourceWidth: this._parent._boundingRect.document.width, sourceHeight: this._parent._boundingRect.document.height, xOffset: 0, yOffset: 0 }; const e = this._parent.scale ? de.set(this._parent.scale.x, this._parent.scale.y) : de.set(1, 1),
        t = this._parent._boundingRect.document.width * e.x,
        i = this._parent._boundingRect.document.height * e.y,
        s = this._size.width,
        r = this._size.height,
        n = s / r,
        h = t / i; let l = 0,
        o = 0; return h > n ? o = Math.min(0, i - t * (1 / n)) : h < n && (l = Math.min(0, t - i * n)), { parentWidth: t, parentHeight: i, sourceWidth: s, sourceHeight: r, xOffset: l, yOffset: o } }
    setScale(e) { if (!e.type || e.type !== "Vec2") { this.renderer.production || _(this.type + ": Cannot set scale because the parameter passed is not of Vec2 type:", e); return }
      e.sanitizeNaNValuesWith(this.scale).max(de.set(.001, .001)), e.equals(this.scale) || (this.scale.copy(e), this.resize()) }
    setOffset(e) { if (!e.type || e.type !== "Vec2") { this.renderer.production || _(this.type + ": Cannot set offset because the parameter passed is not of Vec2 type:", scale); return }
      e.sanitizeNaNValuesWith(this.offset), e.equals(this.offset) || (this.offset.copy(e), this.resize()) }
    _setSize() { if (this._parent && this._parent._program) { const e = this._getSizes();
        this._updateTextureMatrix(e) } }
    resize() { this.sourceType === "fbo" ? (this._size = { width: this._parent._size && this._parent._size.width || this._parent._boundingRect.document.width, height: this._parent._size && this._parent._size.height || this._parent._boundingRect.document.height }, this._copiedFrom || (this.gl.bindTexture(this.gl.TEXTURE_2D, this._sampler.texture), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._globalParameters.internalFormat, this._size.width, this._size.height, 0, this._globalParameters.format, this._globalParameters.type, null))) : this.source && (this._size = { width: this.source.naturalWidth || this.source.width || this.source.videoWidth, height: this.source.naturalHeight || this.source.height || this.source.videoHeight }), this._setSize() }
    _updateTextureMatrix(e) { const t = et.set(e.parentWidth / (e.parentWidth - e.xOffset), e.parentHeight / (e.parentHeight - e.yOffset), 1);
      t.x /= this.scale.x, t.y /= this.scale.y, this._textureMatrix.matrix = tt.setFromArray([t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, 1, 0, (1 - t.x) / 2 + this.offset.x, (1 - t.y) / 2 + this.offset.y, 0, 1]), this._updateMatrixUniform() }
    _updateMatrixUniform() { this._textureMatrix.isActive && (this.renderer.useProgram(this._parent._program), this.gl.uniformMatrix4fv(this._textureMatrix.location, !1, this._textureMatrix.matrix.elements)) }
    _onSourceLoaded(e) { this.setSource(e), this.sourceType === "image" && this.renderer.cache.addTexture(this) }
    _bindTexture() { this._canDraw && (this.renderer.state.activeTexture !== this.index && (this.gl.activeTexture(this.gl.TEXTURE0 + this.index), this.renderer.state.activeTexture = this.index), this.gl.bindTexture(this.gl.TEXTURE_2D, this._sampler.texture), this._sampler.isTextureBound || (this._sampler.isTextureBound = !!this.gl.getParameter(this.gl.TEXTURE_BINDING_2D), this._sampler.isTextureBound && this.renderer.needRender())) }
    _draw() { this._sampler.isActive && (this._bindTexture(), this.sourceType === "video" && this.source && !this._videoFrameCallbackID && this.source.readyState >= this.source.HAVE_CURRENT_DATA && !this.source.paused && (this._willUpdate = !0), (this._forceUpdate || this._willUpdate && this.shouldUpdate) && (this._state.generateMipmap = !1, this._upload()), this.sourceType === "video" && (this._willUpdate = !1), this._forceUpdate = !1), this.parameters._shouldUpdate && (this._updateTexParameters(), this.parameters._shouldUpdate = !1) }
    onSourceLoaded(e) { return e && (this._onSourceLoadedCallback = e), this }
    onSourceUploaded(e) { return e && (this._onSourceUploadedCallback = e), this }
    _dispose(e = !1) { this.sourceType === "video" || this.sourceType === "image" && !this.renderer.state.isActive ? (this._loader && this._loader._removeSource(this), this.source = null) : this.sourceType === "canvas" && (this.source.width = this.source.width, this.source = null), this._parent = null, this.gl && !this._copiedFrom && (e || this.sourceType !== "image" || !this.renderer.state.isActive) && (this._canDraw = !1, this.renderer.cache.removeTexture(this), this.gl.activeTexture(this.gl.TEXTURE0 + this.index), this.gl.bindTexture(this.gl.TEXTURE_2D, null), this.gl.deleteTexture(this._sampler.texture)) } }
  class it { constructor(e, t = "anonymous") { if (this.type = "TextureLoader", e = e && e.renderer || e, !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { I(this.type + ": Renderer WebGL context is undefined", e); return }
      this.renderer = e, this.gl = this.renderer.gl, this.crossOrigin = t, this.elements = [] }
    _addElement(e, t, i, s) { const r = { source: e, texture: t, load: this._sourceLoaded.bind(this, e, t, i), error: this._sourceLoadError.bind(this, e, s) }; return this.elements.push(r), r }
    _sourceLoadError(e, t, i) { t && t(e, i) }
    _sourceLoaded(e, t, i) { t._sourceLoaded || (t._onSourceLoaded(e), this._parent && (this._increment && this._increment(), this.renderer.nextRender.add(() => this._parent._onLoadingCallback && this._parent._onLoadingCallback(t))), i && i(t)) }
    _getSourceType(e) { let t; return typeof e == "string" ? e.match(/\.(jpeg|jpg|jfif|pjpeg|pjp|gif|bmp|png|webp|svg|avif|apng)$/) !== null ? t = "image" : e.match(/\.(webm|mp4|mpg|mpeg|avi|ogg|ogm|ogv|mov|av1)$/) !== null && (t = "video") : e.tagName.toUpperCase() === "IMG" ? t = "image" : e.tagName.toUpperCase() === "VIDEO" ? t = "video" : e.tagName.toUpperCase() === "CANVAS" && (t = "canvas"), t }
    _createImage(e) { if (typeof e == "string" || !e.hasAttribute("crossOrigin")) { const t = new Image; return t.crossOrigin = this.crossOrigin, typeof e == "string" ? t.src = e : (t.src = e.src, e.hasAttribute("data-sampler") && t.setAttribute("data-sampler", e.getAttribute("data-sampler"))), t } else return e }
    _createVideo(e) { if (typeof e == "string" || e.getAttribute("crossOrigin") === null) { const t = document.createElement("video"); return t.crossOrigin = this.crossOrigin, typeof e == "string" ? t.src = e : (t.src = e.src, e.hasAttribute("data-sampler") && t.setAttribute("data-sampler", e.getAttribute("data-sampler"))), t } else return e }
    loadSource(e, t, i, s) { switch (this._getSourceType(e)) {
        case "image":
          this.loadImage(e, t, i, s); break;
        case "video":
          this.loadVideo(e, t, i, s); break;
        case "canvas":
          this.loadCanvas(e, t, i); break;
        default:
          this._sourceLoadError(e, s, "this source could not be converted into a texture: " + e); break } }
    loadSources(e, t, i, s) { for (let r = 0; r < e.length; r++) this.loadSource(e[r], t, i, s) }
    loadImage(e, t = {}, i, s) { const r = this.renderer.cache.getTextureFromSource(e); let n = Object.assign({}, t); if (this._parent && (n = Object.assign(n, this._parent._texturesOptions)), n.loader = this, r) { n.sampler = typeof e != "string" && e.hasAttribute("data-sampler") ? e.getAttribute("data-sampler") : n.sampler, n.fromTexture = r; const c = new ee(this.renderer, n);
        this._sourceLoaded(r.source, c, i), this._parent && this._addToParent(c, r.source, "image"); return } const h = this._createImage(e);
      n.sampler = h.hasAttribute("data-sampler") ? h.getAttribute("data-sampler") : n.sampler; const l = new ee(this.renderer, n),
        o = this._addElement(h, l, i, s);
      h.complete ? this._sourceLoaded(h, l, i) : h.decode ? h.decode().then(this._sourceLoaded.bind(this, h, l, i)).catch(() => { h.addEventListener("load", o.load, !1), h.addEventListener("error", o.error, !1) }) : (h.addEventListener("load", o.load, !1), h.addEventListener("error", o.error, !1)), this._parent && this._addToParent(l, h, "image") }
    loadImages(e, t, i, s) { for (let r = 0; r < e.length; r++) this.loadImage(e[r], t, i, s) }
    loadVideo(e, t = {}, i, s) { const r = this._createVideo(e);
      r.preload = !0, r.muted = !0, r.loop = !0, r.setAttribute("playsinline", ""), r.crossOrigin = this.crossOrigin; let n = Object.assign({}, t);
      this._parent && (n = Object.assign(t, this._parent._texturesOptions)), n.loader = this, n.sampler = r.hasAttribute("data-sampler") ? r.getAttribute("data-sampler") : n.sampler; const h = new ee(this.renderer, n),
        l = this._addElement(r, h, i, s);
      r.addEventListener("canplaythrough", l.load, !1), r.addEventListener("error", l.error, !1), r.readyState >= r.HAVE_FUTURE_DATA && i && this._sourceLoaded(r, h, i), r.load(), this._addToParent && this._addToParent(h, r, "video"), "requestVideoFrameCallback" in HTMLVideoElement.prototype && (l.videoFrameCallback = h._videoFrameCallback.bind(h), h._videoFrameCallbackID = r.requestVideoFrameCallback(l.videoFrameCallback)) }
    loadVideos(e, t, i, s) { for (let r = 0; r < e.length; r++) this.loadVideo(e[r], t, i, s) }
    loadCanvas(e, t = {}, i) { let s = Object.assign({}, t);
      this._parent && (s = Object.assign(t, this._parent._texturesOptions)), s.loader = this, s.sampler = e.hasAttribute("data-sampler") ? e.getAttribute("data-sampler") : s.sampler; const r = new ee(this.renderer, s);
      this._addElement(e, r, i, null), this._sourceLoaded(e, r, i), this._parent && this._addToParent(r, e, "canvas") }
    loadCanvases(e, t, i) { for (let s = 0; s < e.length; s++) this.loadCanvas(e[s], t, i) }
    _removeSource(e) { const t = this.elements.find(i => i.texture.uuid === e.uuid);
      t && (e.sourceType === "image" ? t.source.removeEventListener("load", t.load, !1) : e.sourceType === "video" && (t.videoFrameCallback && e._videoFrameCallbackID && t.source.cancelVideoFrameCallback(e._videoFrameCallbackID), t.source.removeEventListener("canplaythrough", t.load, !1), t.source.pause(), t.source.removeAttribute("src"), t.source.load()), t.source.removeEventListener("error", t.error, !1)) } }
  class st extends it { constructor(e, t, { sourcesLoaded: i = 0, sourcesToLoad: s = 0, complete: r = !1, onComplete: n = () => {} } = {}) { super(e, t.crossOrigin), this.type = "PlaneTextureLoader", this._parent = t, this._parent.type !== "Plane" && this._parent.type !== "PingPongPlane" && this._parent.type !== "ShaderPass" && (_(this.type + ": Wrong parent type assigned to this loader"), this._parent = null), this.sourcesLoaded = i, this.sourcesToLoad = s, this.complete = r, this.onComplete = n }
    _setLoaderSize(e) { this.sourcesToLoad = e, this.sourcesToLoad === 0 && (this.complete = !0, this.renderer.nextRender.add(() => this.onComplete && this.onComplete())) }
    _increment() { this.sourcesLoaded++, this.sourcesLoaded >= this.sourcesToLoad && !this.complete && (this.complete = !0, this.renderer.nextRender.add(() => this.onComplete && this.onComplete())) }
    _addSourceToParent(e, t) { if (t === "image") { const i = this._parent.images;!i.find(r => r.src === e.src) && i.push(e) } else if (t === "video") { const i = this._parent.videos;!i.find(r => r.src === e.src) && i.push(e) } else if (t === "canvas") { const i = this._parent.canvases;!i.find(r => r.isSameNode(e)) && i.push(e) } }
    _addToParent(e, t, i) { this._addSourceToParent(t, i), this._parent && e.addParent(this._parent) } }
  class rt { constructor(e, t = "Mesh", { vertexShaderID: i, fragmentShaderID: s, vertexShader: r, fragmentShader: n, uniforms: h = {}, widthSegments: l = 1, heightSegments: o = 1, renderOrder: c = 0, depthTest: f = !0, cullFace: x = "back", texturesOptions: m = {}, crossOrigin: u = "anonymous" } = {}) { if (this.type = t, e = e && e.renderer || e, (!e || e.type !== "Renderer") && (I(this.type + ": Curtains not passed as first argument or Curtains Renderer is missing", e), setTimeout(() => { this._onErrorCallback && this._onErrorCallback() }, 0)), this.renderer = e, this.gl = this.renderer.gl, !this.gl) { this.renderer.production || I(this.type + ": Unable to create a " + this.type + " because the Renderer WebGL context is not defined"), setTimeout(() => { this._onErrorCallback && this._onErrorCallback() }, 0); return }
      this._canDraw = !1, this.renderOrder = c, this._depthTest = f, this.cullFace = x, this.cullFace !== "back" && this.cullFace !== "front" && this.cullFace !== "none" && (this.cullFace = "back"), this.textures = [], this._texturesOptions = Object.assign({ premultiplyAlpha: !1, anisotropy: 1, floatingPoint: "none", wrapS: this.gl.CLAMP_TO_EDGE, wrapT: this.gl.CLAMP_TO_EDGE, minFilter: this.gl.LINEAR, magFilter: this.gl.LINEAR }, m), this.crossOrigin = u, !r && i && document.getElementById(i) && (r = document.getElementById(i).innerHTML), !n && s && document.getElementById(s) && (n = document.getElementById(s).innerHTML), this._initMesh(), l = parseInt(l), o = parseInt(o), this._geometry = new Je(this.renderer, { width: l, height: o }), this._program = new ye(this.renderer, { parent: this, vertexShader: r, fragmentShader: n }), this._program.compiled ? (this._program.createUniforms(h), this.uniforms = this._program.uniformsManager.uniforms, this._geometry.setProgram(this._program), this.renderer.onSceneChange()) : this.renderer.nextRender.add(() => this._onErrorCallback && this._onErrorCallback()) }
    _initMesh() { this.uuid = le(), this.loader = new st(this.renderer, this, { sourcesLoaded: 0, initSourcesToLoad: 0, complete: !1, onComplete: () => { this._onReadyCallback && this._onReadyCallback(), this.renderer.needRender() } }), this.images = [], this.videos = [], this.canvases = [], this.userData = {}, this._canDraw = !0 }
    _restoreContext() { this._canDraw = !1, this._matrices && (this._matrices = null), this._program = new ye(this.renderer, { parent: this, vertexShader: this._program.vsCode, fragmentShader: this._program.fsCode }), this._program.compiled && (this._geometry.restoreContext(this._program), this._program.createUniforms(this.uniforms), this.uniforms = this._program.uniformsManager.uniforms, this._programRestored()) }
    setRenderTarget(e) { if (!e || e.type !== "RenderTarget") { this.renderer.production || _(this.type + ": Could not set the render target because the argument passed is not a RenderTarget class object", e); return }
      this.type === "Plane" && this.renderer.scene.removePlane(this), this.target = e, this.type === "Plane" && this.renderer.scene.addPlane(this) }
    setRenderOrder(e = 0) { e = isNaN(e) ? this.renderOrder : parseInt(e), e !== this.renderOrder && (this.renderOrder = e, this.renderer.scene.setPlaneRenderOrder(this)) }
    createTexture(e = {}) { const t = new ee(this.renderer, Object.assign(e, this._texturesOptions)); return t.addParent(this), t }
    addTexture(e) { if (!e || e.type !== "Texture") { this.renderer.production || _(this.type + ": cannot add ", e, " to this " + this.type + " because it is not a valid texture"); return }
      e.addParent(this) }
    loadSources(e, t = {}, i, s) { for (let r = 0; r < e.length; r++) this.loadSource(e[r], t, i, s) }
    loadSource(e, t = {}, i, s) { this.loader.loadSource(e, Object.assign(t, this._texturesOptions), r => { i && i(r) }, (r, n) => { this.renderer.production || _(this.type + ": this HTML tag could not be converted into a texture:", r.tagName), s && s(r, n) }) }
    loadImage(e, t = {}, i, s) { this.loader.loadImage(e, Object.assign(t, this._texturesOptions), r => { i && i(r) }, (r, n) => { this.renderer.production || _(this.type + `: There has been an error:
`, n, `
while loading this image:
`, r), s && s(r, n) }) }
    loadVideo(e, t = {}, i, s) { this.loader.loadVideo(e, Object.assign(t, this._texturesOptions), r => { i && i(r) }, (r, n) => { this.renderer.production || _(this.type + `: There has been an error:
`, n, `
while loading this video:
`, r), s && s(r, n) }) }
    loadCanvas(e, t = {}, i) { this.loader.loadCanvas(e, Object.assign(t, this._texturesOptions), s => { i && i(s) }) }
    loadImages(e, t = {}, i, s) { for (let r = 0; r < e.length; r++) this.loadImage(e[r], t, i, s) }
    loadVideos(e, t = {}, i, s) { for (let r = 0; r < e.length; r++) this.loadVideo(e[r], t, i, s) }
    loadCanvases(e, t = {}, i) { for (let s = 0; s < e.length; s++) this.loadCanvas(e[s], t, i) }
    playVideos() { for (let e = 0; e < this.textures.length; e++) { const t = this.textures[e]; if (t.sourceType === "video") { const i = t.source.play();
          i !== void 0 && i.catch(s => { this.renderer.production || _(this.type + ": Could not play the video : ", s) }) } } }
    _draw() { this.renderer.setDepthTest(this._depthTest), this.renderer.setFaceCulling(this.cullFace), this._program.updateUniforms(), this._geometry.bindBuffers(), this.renderer.state.forceBufferUpdate = !1; for (let e = 0; e < this.textures.length; e++)
        if (this.textures[e]._draw(), this.textures[e]._sampler.isActive && !this.textures[e]._sampler.isTextureBound) return;
      this._geometry.draw(), this.renderer.state.activeTexture = null, this._onAfterRenderCallback && this._onAfterRenderCallback() }
    onError(e) { return e && (this._onErrorCallback = e), this }
    onLoading(e) { return e && (this._onLoadingCallback = e), this }
    onReady(e) { return e && (this._onReadyCallback = e), this }
    onRender(e) { return e && (this._onRenderCallback = e), this }
    onAfterRender(e) { return e && (this._onAfterRenderCallback = e), this }
    remove() { this._canDraw = !1, this.target && this.renderer.bindFrameBuffer(null), this._dispose(), this.type === "Plane" ? this.renderer.removePlane(this) : this.type === "ShaderPass" && (this.target && (this.target._shaderPass = null, this.target.remove(), this.target = null), this.renderer.removeShaderPass(this)) }
    _dispose() { if (this.gl) { this._geometry && this._geometry.dispose(), this.target && this.type === "ShaderPass" && (this.renderer.removeRenderTarget(this.target), this.textures.shift()); for (let e = 0; e < this.textures.length; e++) this.textures[e]._dispose();
        this.textures = [] } } } const ve = new O,
    at = new O;
  class nt extends rt { constructor(e, t, i = "DOMMesh", { widthSegments: s, heightSegments: r, renderOrder: n, depthTest: h, cullFace: l, uniforms: o, vertexShaderID: c, fragmentShaderID: f, vertexShader: x, fragmentShader: m, texturesOptions: u, crossOrigin: p } = {}) { c = c || t && t.getAttribute("data-vs-id"), f = f || t && t.getAttribute("data-fs-id"), super(e, i, { widthSegments: s, heightSegments: r, renderOrder: n, depthTest: h, cullFace: l, uniforms: o, vertexShaderID: c, fragmentShaderID: f, vertexShader: x, fragmentShader: m, texturesOptions: u, crossOrigin: p }), this.gl && (this.htmlElement = t, (!this.htmlElement || this.htmlElement.length === 0) && (this.renderer.production || _(this.type + ": The HTML element you specified does not currently exists in the DOM")), this._setDocumentSizes()) }
    _setDocumentSizes() { let e = this.htmlElement.getBoundingClientRect();
      this._boundingRect || (this._boundingRect = {}), this._boundingRect.document = { width: e.width * this.renderer.pixelRatio, height: e.height * this.renderer.pixelRatio, top: e.top * this.renderer.pixelRatio, left: e.left * this.renderer.pixelRatio } }
    getBoundingRect() { return { width: this._boundingRect.document.width, height: this._boundingRect.document.height, top: this._boundingRect.document.top, left: this._boundingRect.document.left, right: this._boundingRect.document.left + this._boundingRect.document.width, bottom: this._boundingRect.document.top + this._boundingRect.document.height } }
    resize() { this._setDocumentSizes(), this.type === "Plane" && (this.setPerspective(this.camera.fov, this.camera.near, this.camera.far), this._setWorldSizes(), this._applyWorldPositions()); for (let e = 0; e < this.textures.length; e++) this.textures[e].resize();
      this.renderer.nextRender.add(() => this._onAfterResizeCallback && this._onAfterResizeCallback()) }
    mouseToPlaneCoords(e) { const t = this.scale ? this.scale : at.set(1, 1),
        i = ve.set((this._boundingRect.document.width - this._boundingRect.document.width * t.x) / 2, (this._boundingRect.document.height - this._boundingRect.document.height * t.y) / 2),
        s = { width: this._boundingRect.document.width * t.x / this.renderer.pixelRatio, height: this._boundingRect.document.height * t.y / this.renderer.pixelRatio, top: (this._boundingRect.document.top + i.y) / this.renderer.pixelRatio, left: (this._boundingRect.document.left + i.x) / this.renderer.pixelRatio }; return ve.set((e.x - s.left) / s.width * 2 - 1, 1 - (e.y - s.top) / s.height * 2) }
    onAfterResize(e) { return e && (this._onAfterResizeCallback = e), this } }
  class ht { constructor({ fov: e = 50, near: t = .1, far: i = 150, width: s, height: r, pixelRatio: n = 1 } = {}) { this.position = new E, this.projectionMatrix = new $, this.worldMatrix = new $, this.viewMatrix = new $, this._shouldUpdate = !1, this.setSize(), this.setPerspective(e, t, i, s, r, n) }
    setFov(e) { e = isNaN(e) ? this.fov : parseFloat(e), e = Math.max(1, Math.min(e, 179)), e !== this.fov && (this.fov = e, this.setPosition(), this._shouldUpdate = !0), this.setCSSPerspective() }
    setNear(e) { e = isNaN(e) ? this.near : parseFloat(e), e = Math.max(e, .01), e !== this.near && (this.near = e, this._shouldUpdate = !0) }
    setFar(e) { e = isNaN(e) ? this.far : parseFloat(e), e = Math.max(e, 50), e !== this.far && (this.far = e, this._shouldUpdate = !0) }
    setPixelRatio(e) { e !== this.pixelRatio && (this._shouldUpdate = !0), this.pixelRatio = e }
    setSize(e, t) {
      (e !== this.width || t !== this.height) && (this._shouldUpdate = !0), this.width = e, this.height = t }
    setPerspective(e, t, i, s, r, n) { this.setPixelRatio(n), this.setSize(s, r), this.setFov(e), this.setNear(t), this.setFar(i), this._shouldUpdate && this.updateProjectionMatrix() }
    setPosition() { this.position.set(0, 0, 1), this.worldMatrix.setFromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, this.position.x, this.position.y, this.position.z, 1]), this.viewMatrix = this.viewMatrix.copy(this.worldMatrix).getInverse() }
    setCSSPerspective() { this.CSSPerspective = Math.pow(Math.pow(this.width / (2 * this.pixelRatio), 2) + Math.pow(this.height / (2 * this.pixelRatio), 2), .5) / Math.tan(this.fov * .5 * Math.PI / 180) }
    getScreenRatiosFromFov(e = 0) { const t = this.position.z;
      e < t ? e -= t : e += t; const i = this.fov * Math.PI / 180,
        s = 2 * Math.tan(i / 2) * Math.abs(e); return { width: s * this.width / this.height, height: s } }
    updateProjectionMatrix() { const e = this.width / this.height,
        t = this.near * Math.tan(Math.PI / 180 * .5 * this.fov),
        i = 2 * t,
        s = e * i,
        r = -.5 * s,
        n = r + s,
        h = t - i,
        l = 2 * this.near / (n - r),
        o = 2 * this.near / (t - h),
        c = (n + r) / (n - r),
        f = (t + h) / (t - h),
        x = -(this.far + this.near) / (this.far - this.near),
        m = -2 * this.far * this.near / (this.far - this.near);
      this.projectionMatrix.setFromArray([l, 0, 0, 0, 0, o, 0, 0, c, f, x, -1, 0, 0, m, 0]) }
    forceUpdate() { this._shouldUpdate = !0 }
    cancelUpdate() { this._shouldUpdate = !1 } }
  class ne { constructor(e = new Float32Array([0, 0, 0, 1]), t = "XYZ") { this.type = "Quat", this.elements = e, this.axisOrder = t }
    setFromArray(e) { return this.elements[0] = e[0], this.elements[1] = e[1], this.elements[2] = e[2], this.elements[3] = e[3], this }
    setAxisOrder(e) { switch (e = e.toUpperCase(), e) {
        case "XYZ":
        case "YXZ":
        case "ZXY":
        case "ZYX":
        case "YZX":
        case "XZY":
          this.axisOrder = e; break;
        default:
          this.axisOrder = "XYZ" } return this }
    copy(e) { return this.elements = e.elements, this.axisOrder = e.axisOrder, this }
    clone() { return new ne().copy(this) }
    equals(e) { return this.elements[0] === e.elements[0] && this.elements[1] === e.elements[1] && this.elements[2] === e.elements[2] && this.elements[3] === e.elements[3] && this.axisOrder === e.axisOrder }
    setFromVec3(e) { const t = e.x * .5,
        i = e.y * .5,
        s = e.z * .5,
        r = Math.cos(t),
        n = Math.cos(i),
        h = Math.cos(s),
        l = Math.sin(t),
        o = Math.sin(i),
        c = Math.sin(s); return this.axisOrder === "XYZ" ? (this.elements[0] = l * n * h + r * o * c, this.elements[1] = r * o * h - l * n * c, this.elements[2] = r * n * c + l * o * h, this.elements[3] = r * n * h - l * o * c) : this.axisOrder === "YXZ" ? (this.elements[0] = l * n * h + r * o * c, this.elements[1] = r * o * h - l * n * c, this.elements[2] = r * n * c - l * o * h, this.elements[3] = r * n * h + l * o * c) : this.axisOrder === "ZXY" ? (this.elements[0] = l * n * h - r * o * c, this.elements[1] = r * o * h + l * n * c, this.elements[2] = r * n * c + l * o * h, this.elements[3] = r * n * h - l * o * c) : this.axisOrder === "ZYX" ? (this.elements[0] = l * n * h - r * o * c, this.elements[1] = r * o * h + l * n * c, this.elements[2] = r * n * c - l * o * h, this.elements[3] = r * n * h + l * o * c) : this.axisOrder === "YZX" ? (this.elements[0] = l * n * h + r * o * c, this.elements[1] = r * o * h + l * n * c, this.elements[2] = r * n * c - l * o * h, this.elements[3] = r * n * h - l * o * c) : this.axisOrder === "XZY" && (this.elements[0] = l * n * h - r * o * c, this.elements[1] = r * o * h - l * n * c, this.elements[2] = r * n * c + l * o * h, this.elements[3] = r * n * h + l * o * c), this } } const ot = new O,
    lt = new E,
    dt = new E,
    ct = new E,
    ut = new E,
    ft = new E,
    pt = new E,
    j = new E,
    X = new E,
    be = new ne,
    gt = new E(.5, .5, 0),
    mt = new E,
    _t = new E,
    xt = new E,
    yt = new E,
    vt = new O;
  class bt extends nt { constructor(e, t, { widthSegments: i, heightSegments: s, renderOrder: r, depthTest: n, cullFace: h, uniforms: l, vertexShaderID: o, fragmentShaderID: c, vertexShader: f, fragmentShader: x, texturesOptions: m, crossOrigin: u, alwaysDraw: p = !1, visible: g = !0, transparent: y = !1, drawCheckMargins: v = { top: 0, right: 0, bottom: 0, left: 0 }, autoloadSources: b = !0, watchScroll: P = !0, fov: M = 50 } = {}) { super(e, t, "Plane", { widthSegments: i, heightSegments: s, renderOrder: r, depthTest: n, cullFace: h, uniforms: l, vertexShaderID: o, fragmentShaderID: c, vertexShader: f, fragmentShader: x, texturesOptions: m, crossOrigin: u }), this.gl && (this.index = this.renderer.planes.length, this.target = null, this.alwaysDraw = p, this._shouldDraw = !0, this.visible = g, this._transparent = y, this.drawCheckMargins = v, this.autoloadSources = b, this.watchScroll = P, this._updateMVMatrix = !1, this.camera = new ht({ fov: M, width: this.renderer._boundingRect.width, height: this.renderer._boundingRect.height, pixelRatio: this.renderer.pixelRatio }), this._program.compiled && (this._initPlane(), this.renderer.scene.addPlane(this), this.renderer.planes.push(this))) }
    _programRestored() { this.target && this.setRenderTarget(this.renderer.renderTargets[this.target.index]), this._initMatrices(), this.setPerspective(this.camera.fov, this.camera.near, this.camera.far), this._setWorldSizes(), this._applyWorldPositions(), this.renderer.scene.addPlane(this); for (let e = 0; e < this.textures.length; e++) this.textures[e]._parent = this, this.textures[e]._restoreContext();
      this._canDraw = !0 }
    _initPlane() { this._initTransformValues(), this._initPositions(), this.setPerspective(this.camera.fov, this.camera.near, this.camera.far), this._initSources() }
    _initTransformValues() { this.rotation = new E, this.rotation.onChange(() => this._applyRotation()), this.quaternion = new ne, this.relativeTranslation = new E, this.relativeTranslation.onChange(() => this._setTranslation()), this._translation = new E, this.scale = new E(1), this.scale.onChange(() => { this.scale.z = 1, this._applyScale() }), this.transformOrigin = new E(.5, .5, 0), this.transformOrigin.onChange(() => { this._setWorldTransformOrigin(), this._updateMVMatrix = !0 }) }
    resetPlane(e) { this._initTransformValues(), this._setWorldTransformOrigin(), e !== null && e ? (this.htmlElement = e, this.resize()) : !e && !this.renderer.production && _(this.type + ": You are trying to reset a plane with a HTML element that does not exist. The old HTML element will be kept instead.") }
    removeRenderTarget() { this.target && (this.renderer.scene.removePlane(this), this.target = null, this.renderer.scene.addPlane(this)) }
    _initPositions() { this._initMatrices(), this._setWorldSizes(), this._applyWorldPositions() }
    _initMatrices() { const e = new $;
      this._matrices = { world: { matrix: e }, modelView: { name: "uMVMatrix", matrix: e, location: this.gl.getUniformLocation(this._program.program, "uMVMatrix") }, projection: { name: "uPMatrix", matrix: e, location: this.gl.getUniformLocation(this._program.program, "uPMatrix") }, modelViewProjection: { matrix: e } } }
    _setPerspectiveMatrix() { this.camera._shouldUpdate && (this.renderer.useProgram(this._program), this.gl.uniformMatrix4fv(this._matrices.projection.location, !1, this._matrices.projection.matrix.elements)), this.camera.cancelUpdate() }
    setPerspective(e, t, i) { this.camera.setPerspective(e, t, i, this.renderer._boundingRect.width, this.renderer._boundingRect.height, this.renderer.pixelRatio), this.renderer.state.isContextLost && this.camera.forceUpdate(), this._matrices.projection.matrix = this.camera.projectionMatrix, this.camera._shouldUpdate && (this._setWorldSizes(), this._applyWorldPositions(), this._translation.z = this.relativeTranslation.z / this.camera.CSSPerspective), this._updateMVMatrix = this.camera._shouldUpdate }
    _setMVMatrix() { this._updateMVMatrix && (this._matrices.world.matrix = this._matrices.world.matrix.composeFromOrigin(this._translation, this.quaternion, this.scale, this._boundingRect.world.transformOrigin), this._matrices.world.matrix.scale({ x: this._boundingRect.world.width, y: this._boundingRect.world.height, z: 1 }), this._matrices.modelView.matrix.copy(this._matrices.world.matrix), this._matrices.modelView.matrix.elements[14] -= this.camera.position.z, this._matrices.modelViewProjection.matrix = this._matrices.projection.matrix.multiply(this._matrices.modelView.matrix), this.alwaysDraw || this._shouldDrawCheck(), this.renderer.useProgram(this._program), this.gl.uniformMatrix4fv(this._matrices.modelView.location, !1, this._matrices.modelView.matrix.elements)), this._updateMVMatrix = !1 }
    _setWorldTransformOrigin() { this._boundingRect.world.transformOrigin = new E((this.transformOrigin.x * 2 - 1) * this._boundingRect.world.width, -(this.transformOrigin.y * 2 - 1) * this._boundingRect.world.height, this.transformOrigin.z) }
    _documentToWorldSpace(e) { return dt.set(e.x * this.renderer.pixelRatio / this.renderer._boundingRect.width * this._boundingRect.world.ratios.width, -(e.y * this.renderer.pixelRatio / this.renderer._boundingRect.height) * this._boundingRect.world.ratios.height, e.z) }
    _setWorldSizes() { const e = this.camera.getScreenRatiosFromFov();
      this._boundingRect.world = { width: this._boundingRect.document.width / this.renderer._boundingRect.width * e.width / 2, height: this._boundingRect.document.height / this.renderer._boundingRect.height * e.height / 2, ratios: e }, this._setWorldTransformOrigin() }
    _setWorldPosition() { const e = { x: this._boundingRect.document.width / 2 + this._boundingRect.document.left, y: this._boundingRect.document.height / 2 + this._boundingRect.document.top },
        t = { x: this.renderer._boundingRect.width / 2 + this.renderer._boundingRect.left, y: this.renderer._boundingRect.height / 2 + this.renderer._boundingRect.top };
      this._boundingRect.world.top = (t.y - e.y) / this.renderer._boundingRect.height * this._boundingRect.world.ratios.height, this._boundingRect.world.left = (e.x - t.x) / this.renderer._boundingRect.width * this._boundingRect.world.ratios.width }
    setScale(e) { if (!e.type || e.type !== "Vec2") { this.renderer.production || _(this.type + ": Cannot set scale because the parameter passed is not of Vec2 type:", e); return }
      e.sanitizeNaNValuesWith(this.scale).max(ot.set(.001, .001)), (e.x !== this.scale.x || e.y !== this.scale.y) && (this.scale.set(e.x, e.y, 1), this._applyScale()) }
    _applyScale() { for (let e = 0; e < this.textures.length; e++) this.textures[e].resize();
      this._updateMVMatrix = !0 }
    setRotation(e) { if (!e.type || e.type !== "Vec3") { this.renderer.production || _(this.type + ": Cannot set rotation because the parameter passed is not of Vec3 type:", e); return }
      e.sanitizeNaNValuesWith(this.rotation), e.equals(this.rotation) || (this.rotation.copy(e), this._applyRotation()) }
    _applyRotation() { this.quaternion.setFromVec3(this.rotation), this._updateMVMatrix = !0 }
    setTransformOrigin(e) { if (!e.type || e.type !== "Vec3") { this.renderer.production || _(this.type + ": Cannot set transform origin because the parameter passed is not of Vec3 type:", e); return }
      e.sanitizeNaNValuesWith(this.transformOrigin), e.equals(this.transformOrigin) || (this.transformOrigin.copy(e), this._setWorldTransformOrigin(), this._updateMVMatrix = !0) }
    _setTranslation() { let e = lt.set(0, 0, 0);
      this.relativeTranslation.equals(e) || (e = this._documentToWorldSpace(this.relativeTranslation)), this._translation.set(this._boundingRect.world.left + e.x, this._boundingRect.world.top + e.y, this.relativeTranslation.z / this.camera.CSSPerspective), this._updateMVMatrix = !0 }
    setRelativeTranslation(e) { if (!e.type || e.type !== "Vec3") { this.renderer.production || _(this.type + ": Cannot set translation because the parameter passed is not of Vec3 type:", e); return }
      e.sanitizeNaNValuesWith(this.relativeTranslation), e.equals(this.relativeTranslation) || (this.relativeTranslation.copy(e), this._setTranslation()) }
    _applyWorldPositions() { this._setWorldPosition(), this._setTranslation() }
    updatePosition() { this._setDocumentSizes(), this._applyWorldPositions() }
    updateScrollPosition(e, t) {
      (e || t) && (this._boundingRect.document.top += t * this.renderer.pixelRatio, this._boundingRect.document.left += e * this.renderer.pixelRatio, this._applyWorldPositions()) }
    _getIntersection(e, t) { let i = t.clone().sub(e),
        s = e.clone(); for (; s.z > -1;) s.add(i); return s }
    _getNearPlaneIntersections(e, t, i) { const s = this._matrices.modelViewProjection.matrix; if (i.length === 1) i[0] === 0 ? (t[0] = this._getIntersection(t[1], j.set(.95, 1, 0).applyMat4(s)), t.push(this._getIntersection(t[3], X.set(-1, -.95, 0).applyMat4(s)))) : i[0] === 1 ? (t[1] = this._getIntersection(t[0], j.set(-.95, 1, 0).applyMat4(s)), t.push(this._getIntersection(t[2], X.set(1, -.95, 0).applyMat4(s)))) : i[0] === 2 ? (t[2] = this._getIntersection(t[3], j.set(-.95, -1, 0).applyMat4(s)), t.push(this._getIntersection(t[1], X.set(1, .95, 0).applyMat4(s)))) : i[0] === 3 && (t[3] = this._getIntersection(t[2], j.set(.95, -1, 0).applyMat4(s)), t.push(this._getIntersection(t[0], X.set(-1, .95, 0).applyMat4(s))));
      else if (i.length === 2) i[0] === 0 && i[1] === 1 ? (t[0] = this._getIntersection(t[3], j.set(-1, -.95, 0).applyMat4(s)), t[1] = this._getIntersection(t[2], X.set(1, -.95, 0).applyMat4(s))) : i[0] === 1 && i[1] === 2 ? (t[1] = this._getIntersection(t[0], j.set(-.95, 1, 0).applyMat4(s)), t[2] = this._getIntersection(t[3], X.set(-.95, -1, 0).applyMat4(s))) : i[0] === 2 && i[1] === 3 ? (t[2] = this._getIntersection(t[1], j.set(1, .95, 0).applyMat4(s)), t[3] = this._getIntersection(t[0], X.set(-1, .95, 0).applyMat4(s))) : i[0] === 0 && i[1] === 3 && (t[0] = this._getIntersection(t[1], j.set(.95, 1, 0).applyMat4(s)), t[3] = this._getIntersection(t[2], X.set(.95, -1, 0).applyMat4(s)));
      else if (i.length === 3) { let r = 0; for (let n = 0; n < e.length; n++) i.includes(n) || (r = n);
        t = [t[r]], r === 0 ? (t.push(this._getIntersection(t[0], j.set(-.95, 1, 0).applyMat4(s))), t.push(this._getIntersection(t[0], X.set(-1, .95, 0).applyMat4(s)))) : r === 1 ? (t.push(this._getIntersection(t[0], j.set(.95, 1, 0).applyMat4(s))), t.push(this._getIntersection(t[0], X.set(1, .95, 0).applyMat4(s)))) : r === 2 ? (t.push(this._getIntersection(t[0], j.set(.95, -1, 0).applyMat4(s))), t.push(this._getIntersection(t[0], X.set(1, -.95, 0).applyMat4(s)))) : r === 3 && (t.push(this._getIntersection(t[0], j.set(-.95, -1, 0).applyMat4(s))), t.push(this._getIntersection(t[0], X.set(-1 - .95, 0).applyMat4(s)))) } else
        for (let r = 0; r < e.length; r++) t[r][0] = 1e4, t[r][1] = 1e4; return t }
    _getWorldCoords() { const e = [ct.set(-1, 1, 0), ut.set(1, 1, 0), ft.set(1, -1, 0), pt.set(-1, -1, 0)]; let t = [],
        i = []; for (let l = 0; l < e.length; l++) { const o = e[l].applyMat4(this._matrices.modelViewProjection.matrix);
        t.push(o), Math.abs(o.z) > 1 && i.push(l) }
      i.length && (t = this._getNearPlaneIntersections(e, t, i)); let s = 1 / 0,
        r = -1 / 0,
        n = 1 / 0,
        h = -1 / 0; for (let l = 0; l < t.length; l++) { const o = t[l];
        o.x < s && (s = o.x), o.x > r && (r = o.x), o.y < n && (n = o.y), o.y > h && (h = o.y) } return { top: h, right: r, bottom: n, left: s } }
    _computeWebGLBoundingRect() { const e = this._getWorldCoords(); let t = { top: 1 - (e.top + 1) / 2, right: (e.right + 1) / 2, bottom: 1 - (e.bottom + 1) / 2, left: (e.left + 1) / 2 };
      t.width = t.right - t.left, t.height = t.bottom - t.top, this._boundingRect.worldToDocument = { width: t.width * this.renderer._boundingRect.width, height: t.height * this.renderer._boundingRect.height, top: t.top * this.renderer._boundingRect.height + this.renderer._boundingRect.top, left: t.left * this.renderer._boundingRect.width + this.renderer._boundingRect.left, right: t.left * this.renderer._boundingRect.width + this.renderer._boundingRect.left + t.width * this.renderer._boundingRect.width, bottom: t.top * this.renderer._boundingRect.height + this.renderer._boundingRect.top + t.height * this.renderer._boundingRect.height } }
    getWebGLBoundingRect() { if (this._matrices.modelViewProjection)(!this._boundingRect.worldToDocument || this.alwaysDraw) && this._computeWebGLBoundingRect();
      else return this._boundingRect.document; return this._boundingRect.worldToDocument }
    _getWebGLDrawRect() { return this._computeWebGLBoundingRect(), { top: this._boundingRect.worldToDocument.top - this.drawCheckMargins.top, right: this._boundingRect.worldToDocument.right + this.drawCheckMargins.right, bottom: this._boundingRect.worldToDocument.bottom + this.drawCheckMargins.bottom, left: this._boundingRect.worldToDocument.left - this.drawCheckMargins.left } }
    _shouldDrawCheck() { const e = this._getWebGLDrawRect();
      Math.round(e.right) <= this.renderer._boundingRect.left || Math.round(e.left) >= this.renderer._boundingRect.left + this.renderer._boundingRect.width || Math.round(e.bottom) <= this.renderer._boundingRect.top || Math.round(e.top) >= this.renderer._boundingRect.top + this.renderer._boundingRect.height ? this._shouldDraw && (this._shouldDraw = !1, this.renderer.nextRender.add(() => this._onLeaveViewCallback && this._onLeaveViewCallback())) : (this._shouldDraw || this.renderer.nextRender.add(() => this._onReEnterViewCallback && this._onReEnterViewCallback()), this._shouldDraw = !0) }
    isDrawn() { return this._canDraw && this.visible && (this._shouldDraw || this.alwaysDraw) }
    enableDepthTest(e) { this._depthTest = e }
    _initSources() { let e = 0; if (this.autoloadSources) { const t = this.htmlElement.getElementsByTagName("img"),
          i = this.htmlElement.getElementsByTagName("video"),
          s = this.htmlElement.getElementsByTagName("canvas");
        t.length && this.loadImages(t), i.length && this.loadVideos(i), s.length && this.loadCanvases(s), e = t.length + i.length + s.length }
      this.loader._setLoaderSize(e), this._canDraw = !0 }
    _startDrawing() { this._canDraw && (this._onRenderCallback && this._onRenderCallback(), this.target ? this.renderer.bindFrameBuffer(this.target) : this.renderer.state.scenePassIndex === null && this.renderer.bindFrameBuffer(null), this._setPerspectiveMatrix(), this._setMVMatrix(), (this.alwaysDraw || this._shouldDraw) && this.visible && this._draw()) }
    mouseToPlaneCoords(e) { if (be.setAxisOrder(this.quaternion.axisOrder), be.equals(this.quaternion) && gt.equals(this.transformOrigin)) return super.mouseToPlaneCoords(e); { const t = { x: 2 * (e.x / (this.renderer._boundingRect.width / this.renderer.pixelRatio)) - 1, y: 2 * (1 - e.y / (this.renderer._boundingRect.height / this.renderer.pixelRatio)) - 1 },
          i = this.camera.position.clone(),
          s = mt.set(t.x, t.y, -.5);
        s.unproject(this.camera), s.sub(i).normalize(); const r = _t.set(0, 0, -1);
        r.applyQuat(this.quaternion).normalize(); const n = yt.set(0, 0, 0),
          h = r.dot(s); if (Math.abs(h) >= 1e-4) { const l = this._matrices.world.matrix.getInverse().multiply(this.camera.viewMatrix),
            o = this._boundingRect.world.transformOrigin.clone().add(this._translation),
            c = xt.set(this._translation.x - o.x, this._translation.y - o.y, this._translation.z - o.z);
          c.applyQuat(this.quaternion), o.add(c); const f = r.dot(o.clone().sub(i)) / h;
          n.copy(i.add(s.multiplyScalar(f))), n.applyMat4(l) } else n.set(1 / 0, 1 / 0, 1 / 0); return vt.set(n.x, n.y) } }
    onReEnterView(e) { return e && (this._onReEnterViewCallback = e), this }
    onLeaveView(e) { return e && (this._onLeaveViewCallback = e), this } }
  class wt { constructor(e, { shaderPass: t, depth: i = !1, clear: s = !0, maxWidth: r, maxHeight: n, minWidth: h = 1024, minHeight: l = 1024, texturesOptions: o = {} } = {}) { if (this.type = "RenderTarget", e = e && e.renderer || e, !e || e.type !== "Renderer") I(this.type + ": Renderer not passed as first argument", e);
      else if (!e.gl) { e.production || I(this.type + ": Unable to create a " + this.type + " because the Renderer WebGL context is not defined"); return }
      this.renderer = e, this.gl = this.renderer.gl, this.index = this.renderer.renderTargets.length, this._shaderPass = t, this._depth = i, this._shouldClear = s, this._maxSize = { width: r ? Math.min(this.renderer.state.maxTextureSize / 4, r) : this.renderer.state.maxTextureSize / 4, height: n ? Math.min(this.renderer.state.maxTextureSize / 4, n) : this.renderer.state.maxTextureSize / 4 }, this._minSize = { width: h * this.renderer.pixelRatio, height: l * this.renderer.pixelRatio }, o = Object.assign({ sampler: "uRenderTexture", isFBOTexture: !0, premultiplyAlpha: !1, anisotropy: 1, generateMipmap: !1, floatingPoint: "none", wrapS: this.gl.CLAMP_TO_EDGE, wrapT: this.gl.CLAMP_TO_EDGE, minFilter: this.gl.LINEAR, magFilter: this.gl.LINEAR }, o), this._texturesOptions = o, this.userData = {}, this.uuid = le(), this.renderer.renderTargets.push(this), this.renderer.onSceneChange(), this._initRenderTarget() }
    _initRenderTarget() { this._setSize(), this.textures = [], this._createFrameBuffer() }
    _restoreContext() { this._setSize(), this._createFrameBuffer() }
    _setSize() { this._shaderPass && this._shaderPass._isScenePass ? this._size = { width: this.renderer._boundingRect.width, height: this.renderer._boundingRect.height } : this._size = { width: Math.min(this._maxSize.width, Math.max(this._minSize.width, this.renderer._boundingRect.width)), height: Math.min(this._maxSize.height, Math.max(this._minSize.height, this.renderer._boundingRect.height)) } }
    resize() { this._shaderPass && (this._setSize(), this.textures[0].resize(), this.renderer.bindFrameBuffer(this, !0), this._depth && this._bindDepthBuffer(), this.renderer.bindFrameBuffer(null)) }
    _bindDepthBuffer() { this._depthBuffer && (this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._depthBuffer), this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this._size.width, this._size.height), this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this._depthBuffer)) }
    _createFrameBuffer() { this._frameBuffer = this.gl.createFramebuffer(), this.renderer.bindFrameBuffer(this, !0), this.textures.length ? (this.textures[0]._parent = this, this.textures[0]._restoreContext()) : new ee(this.renderer, this._texturesOptions).addParent(this), this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textures[0]._sampler.texture, 0), this._depth && (this._depthBuffer = this.gl.createRenderbuffer(), this._bindDepthBuffer()), this.renderer.bindFrameBuffer(null) }
    getTexture() { return this.textures[0] }
    remove() { if (this._shaderPass) { this.renderer.production || _(this.type + ": You're trying to remove a RenderTarget attached to a ShaderPass. You should remove that ShaderPass instead:", this._shaderPass); return }
      this._dispose(), this.renderer.removeRenderTarget(this) }
    _dispose() { this._frameBuffer && (this.gl.deleteFramebuffer(this._frameBuffer), this._frameBuffer = null), this._depthBuffer && (this.gl.deleteRenderbuffer(this._depthBuffer), this._depthBuffer = null), this.textures[0]._dispose(), this.textures = [] } } const Tt = (a, e) => { const t = a[0] / a[1],
        i = Math.sqrt(t * (3e5 * (e || 1))); return [i, i / t] },
    B = (a, e) => { const t = Tt(e),
        i = t[0] / t[1] > 1 ? 4 : t[0] / t[1] < 1 ? 6 : 4,
        r = 14 / Math.max(...e),
        n = e.map(h => Math.round(h * r)); return { name: a, dimensions: t.map(h => Math.round(h)), scaleRatio: e[0] / t[0], realDimensions: e, placeholderPadding: `calc(${e[1]/e[0]*100/i}% - 2rem)`, aspectRatio: e[0] / e[1], iconDimensions: n } };
  B("iPhone 11 Pro", [375, 812]), B("Instagram Story", [1080, 1920]), B("Tabloid", [792, 1224]), B("A4", [595, 842]), B("Letter", [612, 792]), B("Square", [1080, 1080]), B("iPad", [1024, 768]), B("Slide 4:3", [1024, 768]), B("Desktop", [1440, 1024]), B("Macbbook Pro", [1440, 900]), B("Twitter post", [1200, 675]), B("iMac", [1280, 720]), B("Slide 16:9", [1920, 1080]), B("Twitter header", [1500, 500]), B("Window", [window.innerWidth, window.innerHeight]); const Pt = { red: ["#50000a", "#690010", "#8B0018", "#AE0020", "#D10029", "#F50032", "#FF5458", "#FF8480", "#FFAAA5", "#FFCCC8", "#FFE4E2"], orange: ["#441700", "#5A2200", "#772F00", "#953D00", "#B34B00", "#D35A00", "#F36900", "#FF894D", "#FFAE87", "#FFCEB7", "#FFEDE4"], amber: ["#392100", "#4B2E00", "#643F00", "#7D5100", "#986300", "#B37500", "#CE8800", "#EA9B01", "#FFB341", "#FFD198", "#FFEED9"], gold: ["#2f2700", "#403400", "#564700", "#6D5A00", "#846E00", "#9C8200", "#B49700", "#CDAC00", "#E6C100", "#FFD820", "#FFF1BD"], lime: ["#1f2d00", "#2B3C00", "#3B5100", "#4B6700", "#5C7D00", "#6D9300", "#7FAA00", "#91C200", "#A3DA00", "#B6F200", "#DEFFAB"], green: ["#013017", "#034121", "#05572E", "#086E3C", "#0B854A", "#0E9D58", "#10B667", "#12CF76", "#14E885", "#53FF9D", "#CEFFDD"], mint: ["#002e2c", "#003E3B", "#00544F", "#006A64", "#00817A", "#009890", "#00B0A7", "#00C8BE", "#00E1D6", "#00FAEE", "#C2FFF9"], cyan: ["#002c3b", "#003B4F", "#00506A", "#006585", "#007AA0", "#0090BD", "#00A7DA", "#00BEF8", "#6BD2FF", "#ABE4FF", "#E0F5FF"], blue: ["#002651", "#00346A", "#00478C", "#005AAF", "#006DD3", "#0081F7", "#459AFF", "#73B1FF", "#9CC7FF", "#C2DDFF", "#E8F2FF"], ultramarine: ["#1b0c70", "#251392", "#331DBF", "#4229EA", "#5150F7", "#6570FC", "#7D8DFD", "#97A7FE", "#B3C0FE", "#CFD8FE", "#EDF0FF"], violet: ["#320065", "#420084", "#5900AD", "#7001D7", "#8712FF", "#9555FF", "#A57AFF", "#B69AFF", "#C9B7FF", "#DDD3FF", "#F2EEFF"], purple: ["#41004c", "#560064", "#730085", "#8F00A6", "#AD00C8", "#CC00EA", "#E13EFF", "#E978FF", "#F0A2FF", "#F6C7FF", "#FCEAFF"], magenta: ["#4a0035", "#610046", "#81005D", "#A10075", "#C2008E", "#E400A7", "#FF2EBE", "#FF75CA", "#FFA1D8", "#FFC7E6", "#FFEAF5"] },
    Rt = { NORMAL: "Normal", ADD: "Add", SUBTRACT: "Subtract", MULTIPLY: "Multiply", SCREEN: "Screen", OVERLAY: "Overlay", DARKEN: "Darken", LIGHTEN: "Lighten", COLOR_DODGE: "Color dodge", COLOR_BURN: "Color burn", LINEAR_BURN: "Linear burn", HARD_LIGHT: "Hard light", SOFT_LIGHT: "Soft light", DIFFERENCE: "Difference", EXCLUSION: "Exclusion", LINEAR_LIGHT: "Linear light", PIN_LIGHT: "Pin light", VIVID_LIGHT: "Vivid light" },
    Q = (a, e) => (a = Math.ceil(a), e = Math.floor(e), Math.floor(Math.random() * (e - a)) + a),
    Et = () => { var a = new Date().getTime(),
        e = typeof performance < "u" && performance.now && performance.now() * 1e3 || 0; return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) { var i = Math.random() * 16; return a > 0 ? (i = (a + i) % 16 | 0, a = Math.floor(a / 16)) : (i = (e + i) % 16 | 0, e = Math.floor(e / 16)), (t === "x" ? i : i & 3 | 8).toString(16) }) },
    he = (a, e, t) => a * (1 - t) + e * t,
    we = (a, e, t, i) => Math.sqrt(Math.pow(a - t, 2) + Math.pow(e - i, 2)),
    Mt = (a, e, t, i) => (i - t) / (e - a);

  function St(a) { return a.map((e, t) => t > 0 ? Math.sqrt(Math.pow(e[0] - a[t - 1][0], 2) + Math.pow(e[1] - a[t - 1][1], 2)) : 0).reduce((e, t) => e + t) } const Ft = (a, e) => { const t = [a[0]],
        i = a.length - 1; let s = 0; for (let r = 1; r < i; r++) { const n = we(a[r][0], a[r][1], a[r - 1][0], a[r - 1][1]);
        n <= e / 2 ? s < e / 2 ? s += n : (t.push([he(a[r - 1][0], a[r][0], .5), he(a[r - 1][1], a[r][1], .5)]), s = 0) : t.push([he(a[r - 1][0], a[r][0], .5), he(a[r - 1][1], a[r][1], .5)]) } return t.push(a[i]), t },
    At = (a, e) => { const t = St(a),
        i = Math.floor(t / e),
        s = [a[0]];

      function r(n) { let h = 1,
          l = 0; for (; a[h + 1] && l < n * e;) l += we(a[h][0], a[h][1], a[h - 1][0], a[h - 1][1]), h++; return a[h] } for (let n = 0; n < i; n++) { const h = r(n),
          l = Mt(s[n][0], h[0], s[n][1], h[1]) || 0,
          o = Math.atan(l),
          c = { x: s[n][0] <= h[0] ? 1 : -1, y: s[n][1] <= h[1] ? 1 : -1 };
        s.push([+(c.x * Math.abs(Math.cos(o)) * e + s[n][0]).toFixed(1), +(c.y * Math.abs(Math.sin(o)) * e + s[n][1]).toFixed(1)]) } return s },
    Te = (a, e) => { const t = Math.max(1.5, e / 500 * 4); return At(Ft(a, t), t) };
  (function() {
    function a(u, p) { document.addEventListener ? u.addEventListener("scroll", p, !1) : u.attachEvent("scroll", p) }

    function e(u) { document.body ? u() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function p() { document.removeEventListener("DOMContentLoaded", p), u() }) : document.attachEvent("onreadystatechange", function p() {
        (document.readyState == "interactive" || document.readyState == "complete") && (document.detachEvent("onreadystatechange", p), u()) }) }

    function t(u) { this.g = document.createElement("div"), this.g.setAttribute("aria-hidden", "true"), this.g.appendChild(document.createTextNode(u)), this.h = document.createElement("span"), this.i = document.createElement("span"), this.m = document.createElement("span"), this.j = document.createElement("span"), this.l = -1, this.h.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.i.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.j.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.m.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;", this.h.appendChild(this.m), this.i.appendChild(this.j), this.g.appendChild(this.h), this.g.appendChild(this.i) }

    function i(u, p) { u.g.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" + p + ";" }

    function s(u) { var p = u.g.offsetWidth,
        g = p + 100; return u.j.style.width = g + "px", u.i.scrollLeft = g, u.h.scrollLeft = u.h.scrollWidth + 100, u.l !== p ? (u.l = p, !0) : !1 }

    function r(u, p) {
      function g() { var v = y;
        s(v) && v.g.parentNode !== null && p(v.l) } var y = u;
      a(u.h, g), a(u.i, g), s(u) }

    function n(u, p, g) { p = p || {}, g = g || window, this.family = u, this.style = p.style || "normal", this.weight = p.weight || "normal", this.stretch = p.stretch || "normal", this.context = g } var h = null,
      l = null,
      o = null,
      c = null;

    function f(u) { return l === null && (x(u) && /Apple/.test(window.navigator.vendor) ? (u = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent), l = !!u && 603 > parseInt(u[1], 10)) : l = !1), l }

    function x(u) { return c === null && (c = !!u.document.fonts), c }

    function m(u, p) { var g = u.style,
        y = u.weight; if (o === null) { var v = document.createElement("div"); try { v.style.font = "condensed 100px sans-serif" } catch {}
        o = v.style.font !== "" } return [g, y, o ? u.stretch : "", "100px", p].join(" ") }
    n.prototype.load = function(u, p) { var g = this,
        y = u || "BESbswy",
        v = 0,
        b = p || 3e3,
        P = new Date().getTime(); return new Promise(function(M, T) { if (x(g.context) && !f(g.context)) { var R = new Promise(function(F, A) {
              function S() { new Date().getTime() - P >= b ? A(Error("" + b + "ms timeout exceeded")) : g.context.document.fonts.load(m(g, '"' + g.family + '"'), y).then(function(k) { 1 <= k.length ? F() : setTimeout(S, 25) }, A) }
              S() }),
            D = new Promise(function(F, A) { v = setTimeout(function() { A(Error("" + b + "ms timeout exceeded")) }, b) });
          Promise.race([D, R]).then(function() { clearTimeout(v), M(g) }, T) } else e(function() {
          function F() { var C;
            (C = z != -1 && L != -1 || z != -1 && w != -1 || L != -1 && w != -1) && ((C = z != L && z != w && L != w) || (h === null && (C = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), h = !!C && (536 > parseInt(C[1], 10) || parseInt(C[1], 10) === 536 && 11 >= parseInt(C[2], 10))), C = h && (z == Z && L == Z && w == Z || z == K && L == K && w == K || z == J && L == J && w == J)), C = !C), C && (W.parentNode !== null && W.parentNode.removeChild(W), clearTimeout(v), M(g)) }

          function A() { if (new Date().getTime() - P >= b) W.parentNode !== null && W.parentNode.removeChild(W), T(Error("" + b + "ms timeout exceeded"));
            else { var C = g.context.document.hidden;
              (C === !0 || C === void 0) && (z = S.g.offsetWidth, L = k.g.offsetWidth, w = N.g.offsetWidth, F()), v = setTimeout(A, 50) } } var S = new t(y),
            k = new t(y),
            N = new t(y),
            z = -1,
            L = -1,
            w = -1,
            Z = -1,
            K = -1,
            J = -1,
            W = document.createElement("div");
          W.dir = "ltr", i(S, m(g, "sans-serif")), i(k, m(g, "serif")), i(N, m(g, "monospace")), W.appendChild(S.g), W.appendChild(k.g), W.appendChild(N.g), g.context.document.body.appendChild(W), Z = S.g.offsetWidth, K = k.g.offsetWidth, J = N.g.offsetWidth, A(), r(S, function(C) { z = C, F() }), i(S, m(g, '"' + g.family + '",sans-serif')), r(k, function(C) { L = C, F() }), i(k, m(g, '"' + g.family + '",serif')), r(N, function(C) { w = C, F() }), i(N, m(g, '"' + g.family + '",monospace')) }) }) }, typeof module == "object" ? module.exports = n : (window.FontFaceObserver = n, window.FontFaceObserver.prototype.load = n.prototype.load) })(); const Pe = { NORMAL: "src", ADD: "src + dst", SUBTRACT: "src - dst", MULTIPLY: "src * dst", SCREEN: "1. - (1. - src) * (1. - dst)", OVERLAY: "vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)))", DARKEN: "min(src, dst)", LIGHTEN: "max(src, dst)", COLOR_DODGE: "vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)))", COLOR_BURN: "vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)))", LINEAR_BURN: "(src + dst) - 1.0", HARD_LIGHT: "vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)),  (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)))", SOFT_LIGHT: "vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))))", DIFFERENCE: "abs(dst - src)", EXCLUSION: "src + dst - 2.0 * src * dst", LINEAR_LIGHT: "2.0 * src + dst - 1.0", PIN_LIGHT: "vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z))", VIDID_LIGHT: "vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))))" }; let Re = "";
  Object.keys(Pe).forEach((a, e) => { Re += `
    if(blendMode == ${e}) {
      return ${Pe[a]};
    }
  ` }); const Ct = `
  vec3 blend (int blendMode, vec3 src, vec3 dst) {
    ${Re} 
  }
`,
    ce = `#version 300 es
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
}`,
    Dt = { fragmentShader: `#version 300 es
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
`, vertexShader: ce, crossorigin: "Anonymous", texturesOptions: { floatingPoint: "none", premultiplyAlpha: !0 }, uniforms: { resolution: { name: "uResolution", type: "1f", value: new O(1080) } } },
    zt = { fragmentShader: `#version 300 es
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
`, vertexShader: ce, crossorigin: "Anonymous", texturesOptions: { floatingPoint: "none", premultiplyAlpha: !0 }, uniforms: { opacity: { name: "uOpacity", type: "1f", value: 1 }, dissolve: { name: "uDissolve", type: "1f", value: 0 } } },
    Lt = { fragmentShader: `#version 300 es
precision mediump float;
in vec2 vTextureCoord;

uniform vec2 uResolution;
uniform sampler2D uBgTexture;
uniform sampler2D uMaskTexture;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform int uBlendMode;
uniform float uBgDisplace;
uniform float uDisplace;
uniform float uDissolve;
uniform float uDispersion;
uniform float uMask;

${Ct}

const float STEPS = 30.0;
const float PI = 3.1415926;

vec3 chromaticAbberation(vec2 st, float angle, float amount, float blend) {
  float aspectRatio = uResolution.x/uResolution.y;
  float rotation = angle * 360.0 * PI / 180.0;
  vec2 aberrated = amount * vec2(0.1 * sin(rotation) * aspectRatio, 0.1 * cos(rotation));
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
  if (uBlendMode > 0) {
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
`, vertexShader: ce, crossorigin: "Anonymous", texturesOptions: { floatingPoint: "none", premultiplyAlpha: !0 }, uniforms: { dispersion: { name: "uDispersion", type: "1f", value: 0 }, displace: { name: "uDisplace", type: "1f", value: 0 }, bgDisplace: { name: "uBgDisplace", type: "1f", value: 0 }, resolution: { name: "uResolution", type: "2f", value: new O(1080, 1080) }, opacity: { name: "uOpacity", type: "1f", value: 1 }, dissolve: { name: "uDissolve", type: "1f", value: 0 }, mask: { name: "uMask", type: "1f", value: 0 }, blendMode: { name: "uBlendMode", type: "1i", value: 0 } } },
    It = a => { var e = (a[0] + 16) / 116,
        t = a[1] / 500 + e,
        i = e - a[2] / 200,
        s, r, n; return t = .95047 * (t * t * t > .008856 ? t * t * t : (t - 16 / 116) / 7.787), e = 1 * (e * e * e > .008856 ? e * e * e : (e - 16 / 116) / 7.787), i = 1.08883 * (i * i * i > .008856 ? i * i * i : (i - 16 / 116) / 7.787), s = t * 3.2406 + e * -1.5372 + i * -.4986, r = t * -.9689 + e * 1.8758 + i * .0415, n = t * .0557 + e * -.204 + i * 1.057, s = s > .0031308 ? 1.055 * Math.pow(s, 1 / 2.4) - .055 : 12.92 * s, r = r > .0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - .055 : 12.92 * r, n = n > .0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - .055 : 12.92 * n, [Math.max(0, Math.min(1, s)) * 255, Math.max(0, Math.min(1, r)) * 255, Math.max(0, Math.min(1, n)) * 255] },
    kt = a => { var e = a[0] / 255,
        t = a[1] / 255,
        i = a[2] / 255,
        s, r, n; return e = e > .04045 ? Math.pow((e + .055) / 1.055, 2.4) : e / 12.92, t = t > .04045 ? Math.pow((t + .055) / 1.055, 2.4) : t / 12.92, i = i > .04045 ? Math.pow((i + .055) / 1.055, 2.4) : i / 12.92, s = (e * .4124 + t * .3576 + i * .1805) / .95047, r = (e * .2126 + t * .7152 + i * .0722) / 1, n = (e * .0193 + t * .1192 + i * .9505) / 1.08883, s = s > .008856 ? Math.pow(s, 1 / 3) : 7.787 * s + 16 / 116, r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116, n = n > .008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116, [116 * r - 16, 500 * (s - r), 200 * (r - n)] },
    Ee = (a, e, t) => "#" + ((1 << 24) + (a << 16) + (e << 8) + t).toString(16).slice(1),
    Me = a => a.reduce((e, t) => e + t, 0),
    Ot = (a, e) => Me(a.map((t, i) => t * e[i])) / Me(e),
    ue = a => { var e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      a = a.replace(e, function(i, s, r, n) { return s + s + r + r + n + n }); var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a); return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : null };
  class Ut { constructor() { this.grads = [
        ["#000000", "#151515", "#292929", "#464646", "#646464", "#7D7D7D", "#9D9D9D", "#B7B7B7", "#D0D0D0", "#EEEEEE", "#FFFFFF"]
      ], this.swatches = Object.values(Pt); for (let e = 0; e < this.swatches.length; e++) this.grads.push(this.swatches[e]); for (let e = 0; e < this.swatches.length; e++) { const t = []; for (let i = 0; i < 5; i++) t.push(this.swatches[e - i < 0 ? e - i + 11 : e - i][8 - i]);
        this.grads.push(t) } for (let e = 0; e < this.swatches.length; e += 2) { const t = []; for (let i = 0; i < 6; i++) t.push(this.swatches[e - i < 0 ? e - i + 11 : e - i][8]);
        this.grads.push(t) }
      this.grads.push(this.swatches.map(e => e[6])) }
    getSimilarValueIndex(e) { let t = !1; return this.swatches.forEach(i => { i.includes(...e) && (t = i.indexOf(...e)) }), t }
    getSimilarColors(e) { const t = this.getSimilarValueIndex(e); return t ? this.swatches.map(i => i[t]) : e }
    getRandomSimilarColor(e) { const t = this.getSimilarColors(e); if (t) { let i = t[Q(0, t.length - 1)]; for (; e === i;) i = t[Q(0, t.length - 1)]; return i } else return e }
    getBand(e, t) { const i = []; let s = this.swatches[Q(1, this.swatches.length)],
        r = s[Q(3, s.length)],
        n = kt(ue(r)); for (let h = 0; h < e; h++) { for (let l = 0; l < 3; l++) { let o;
          l === 0 ? (o = (.5 - Math.random()) * t / 2, n[l] += n[l] + o > 100 && n[l] - o > 0 ? -o : o) : (o = (.5 - Math.random()) * t, n[l] += n[l] + o > 160 && n[l] - o > -160 ? -o : o) }
        i.push(Ee(...It(n).map(l => Math.round(l)))) } return i }
    randomFill(e, t) { let i = e; if (e.length > 1) i = this.getBand(Q(2, 8), Q(80, 280));
      else if (t) i = [this.getRandomSimilarColor(e)];
      else
        for (i = this.swatches[Q(0, this.swatches.length - 1)], i = [i[Q(0, i.length - 1)]]; e === i;) i = [i[Q(0, i.length - 1)]]; return i } }
  new Ut,
  function(a) { var e = {};

    function t(i) { if (e[i]) return e[i].exports; var s = e[i] = { i, l: !1, exports: {} }; return a[i].call(s.exports, s, s.exports, t), s.l = !0, s.exports }
    t.m = a, t.c = e, t.d = function(i, s, r) { t.o(i, s) || Object.defineProperty(i, s, { enumerable: !0, get: r }) }, t.r = function(i) { typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 }) }, t.t = function(i, s) { if (1 & s && (i = t(i)), 8 & s || 4 & s && typeof i == "object" && i && i.__esModule) return i; var r = Object.create(null); if (t.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: i }), 2 & s && typeof i != "string")
        for (var n in i) t.d(r, n, function(h) { return i[h] }.bind(null, n)); return r }, t.n = function(i) { var s = i && i.__esModule ? function() { return i.default } : function() { return i }; return t.d(s, "a", s), s }, t.o = function(i, s) { return Object.prototype.hasOwnProperty.call(i, s) }, t.p = "", t(t.s = 0) }([function(a, e, t) { var i = this && this.__spreadArray || function(h, l) { for (var o = 0, c = l.length, f = h.length; o < c; o++, f++) h[f] = l[o]; return h };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ConicalGradient = void 0; var s = t(1);

    function r(h, l, o, c, f, x, m) { l === void 0 && (l = [
        [0, "#fff"],
        [1, "#fff"]
      ]), o === void 0 && (o = 0), c === void 0 && (c = 0), f === void 0 && (f = 0), x === void 0 && (x = 2 * Math.PI), m === void 0 && (m = !1); var u = Math.floor(180 * f / Math.PI),
        p = Math.ceil(180 * x / Math.PI),
        g = document.createElement("canvas");
      g.width = h.canvas.width, g.height = h.canvas.height; var y = g.getContext("2d"),
        v = [
          [0, 0],
          [h.canvas.width, 0],
          [h.canvas.width, h.canvas.height],
          [0, h.canvas.height]
        ],
        b = Math.max.apply(Math, v.map(function(F) { var A = F[0],
            S = F[1]; return Math.sqrt(Math.pow(A - o, 2) + Math.pow(S - c, 2)) })) + 10;
      y.translate(o, c); for (var P = 2 * Math.PI * (b + 20) / 360, M = new s.default(l, p - u + 1), T = u; T <= p; T++) y.save(), y.rotate((m ? -1 : 1) * (Math.PI * T) / 180), y.beginPath(), y.moveTo(0, 0), y.lineTo(b, -2 * P), y.lineTo(b, 0), y.fillStyle = M.getColor(T - u), y.fill(), y.closePath(), y.restore(); var R = document.createElement("canvas");
      R.width = h.canvas.width, R.height = h.canvas.height; var D = R.getContext("2d"); return D.beginPath(), D.arc(o, c, b, f, x, m), D.lineTo(o, c), D.closePath(), D.fillStyle = D.createPattern(g, "no-repeat"), D.fill(), h.createPattern(R, "no-repeat") }
    e.default = r, CanvasRenderingContext2D.prototype.createConicalGradient = function() { for (var h = [], l = 0; l < arguments.length; l++) h[l] = arguments[l]; var o = this,
        c = { stops: [], addColorStop: function(f, x) { this.stops.push([f, x]) }, get pattern() { return r.apply(void 0, i([o, this.stops], h)) } }; return c }; var n = t(2);
    Object.defineProperty(e, "ConicalGradient", { enumerable: !0, get: function() { return n.ConicalGradient } }) }, function(a, e, t) { Object.defineProperty(e, "__esModule", { value: !0 }); var i = function() {
      function s(r, n) { r === void 0 && (r = []), n === void 0 && (n = 100); var h = document.createElement("canvas");
        h.width = n, h.height = 1, this.ctx = h.getContext("2d"); for (var l = this.ctx.createLinearGradient(0, 0, n, 0), o = 0, c = r; o < c.length; o++) { var f = c[o];
          l.addColorStop.apply(l, f) }
        this.ctx.fillStyle = l, this.ctx.fillRect(0, 0, n, 1), this.rgbaSet = this.ctx.getImageData(0, 0, n, 1).data } return s.prototype.getColor = function(r) { var n = this.rgbaSet.slice(4 * r, 4 * r + 4); return "rgba(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] / 255 + ")" }, s }();
    e.default = i }, function(a, e, t) { Object.defineProperty(e, "__esModule", { value: !0 }) }]); const fe = (a, e, t, i, s) => { var r = Math.PI / 180 * s,
        n = Math.cos(r),
        h = Math.sin(r),
        l = n * (t - a) + h * (i - e) + a,
        o = n * (i - e) - h * (t - a) + e; return [+l.toFixed(1), +o.toFixed(1)] },
    te = (a, e) => { const t = e || 1,
        i = Math.min(...a.map(o => o[0])),
        s = Math.max(...a.map(o => o[0])),
        r = Math.min(...a.map(o => o[1])),
        n = Math.max(...a.map(o => o[1])),
        h = Math.abs(s - i),
        l = Math.abs(n - r); return { width: Math.round(h / t), height: Math.round(l / t), aspectRatio: h / t / (l / t), center: { x: Math.round((h / 2 + i) / t), y: Math.round((l / 2 + r) / t) }, corners: [
          [i, r],
          [s, r],
          [s, n],
          [i, n]
        ] } },
    Se = (a, e) => { const t = e.size / 2; let i, s = e.fill; if (s.length > 1) { let r = Math.sqrt(Math.pow(t, 2), Math.pow(t, 2)),
          n = e.gradientAngle ? +e.gradientAngle * 2 * Math.PI : 0; if (!e.gradientType || e.gradientType === "linear" || e.gradientType === "radial") e.gradientType === "radial" ? i = a.createRadialGradient(e.x, e.y, t, e.x, e.y, 0) : i = a.createLinearGradient(e.x - Math.cos(n) * r, e.y - Math.sin(n) * r, e.x + Math.cos(n) * r, e.y + Math.sin(n) * r), s.forEach((h, l) => { i.addColorStop(l * (1 / (s.length - 1)), h) });
        else if (e.gradientType === "conic") { i = a.createConicalGradient(e.x, e.y, -Math.PI + n, Math.PI + n); const h = [...s, ...s.slice().reverse()];
          h.forEach((l, o) => { i.addColorStop(o * (1 / (h.length - 1)), l) }), i = i.pattern } } else i = s[0]; return i },
    Fe = (a, e, t) => { let i; const s = te(t); if (e.fill.length > 1) { let r = e.gradientAngle ? +e.gradientAngle * 2 * Math.PI : 0,
          n = s.center.x,
          h = s.center.y; if (e.gradientType === "radial" && (i = a.createRadialGradient(n, h, Math.max(s.width, s.height) * .7, n, h, 0)), e.gradientType === "linear" && (i = a.createLinearGradient(n - Math.cos(r) * s.width / 2, h - Math.sin(r) * s.height / 2, n + Math.cos(r) * s.width / 2, h + Math.sin(r) * s.height / 2)), e.gradientType === "conic") { i = a.createConicalGradient(n, h, -Math.PI + r, Math.PI + r); const l = [...e.fill, ...e.fill.slice().reverse()];
          l.forEach((c, f) => { i.addColorStop(f * (1 / (l.length - 1)), c) }), document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix(), i = i.pattern } else e.fill.forEach((l, o) => { i.addColorStop(o * (1 / (e.fill.length - 1)), l) }) } else i = e.fill[0]; return i },
    Ae = { circle: (a, e) => { a.arc(e.x, e.y, e.size / 2, 0, 2 * Math.PI, !1) }, custom: (a, e) => { let t = e.coords; const i = e.box || te(t.flat()); let s = Math.max(i.width, i.height); for (let r = 0; r < t.length; r++) { const n = t[r].length;
          a.moveTo(...fe(e.x, e.y, t[r][0][0] * e.size / s + e.x, t[r][0][1] * e.size / s + e.y, e.rotation)); for (let h = 0; h < n; h++) a.lineTo(...fe(e.x, e.y, t[r][h][0] * e.size / s + e.x, t[r][h][1] * e.size / s + e.y, e.rotation)) } } },
    Bt = (a, e, t, i, s, r) => { const n = a.getContext("2d"); return a.width = e.size * i * s, a.height = e.size * i * s, n.scale(s * i, s * i), e.x = a.width / (2 * i * s), e.y = a.height / (2 * i * s), n.fillStyle = Se(n, e), n.fillRect(0, 0, a.width, a.height), n.globalCompositeOperation = "destination-in", e.type in Ae && (Ae[e.type](n, e), n.fill()), a },
    d = { canvasWidth: window.innerWidth / 2, canvasHeight: window.innerHeight / 2, curtain: void 0, curtainRafId: void 0, dpi: window.devicePixelRatio || 1, element: "", fps: 60, history: [], initialized: !1, loading: !0, mouse: { downPos: { x: 0, y: 0 }, movePos: { x: 0, y: 0 }, lastPos: { x: 0, y: 0 }, delta: { x: 0, y: 0 }, dragging: !1, trail: [], pos: { x: window.innerWidth / 2, y: window.innerHeight / 2 } }, scale: 1, staticCanvas: null, staticCanvasTexture: null, size: "Square", versionId: "", windowWidth: window.innerWidth, windowHeight: window.innerHeight };

  function Y(a) { return a && typeof a == "string" && (a = JSON.parse(a)), Object.values(a) } const Vt = document.createElement("canvas");

  function Nt(a) { const e = te(a.coords),
      t = a.getPositionOffset(); let i = a.coords.map(([s, r]) => fe(e.center.x, e.center.y, s, r, -a.rotation * 360)); return i = i.map(([s, r]) => [Math.round(s + t.x), Math.round(r + t.y)]), i }

  function Wt(a) { return { x: Math.sqrt(d.canvasWidth / d.canvasHeight / a), y: Math.sqrt(d.canvasHeight / d.canvasWidth * a) } }

  function Ce(a, e, t) { for (let i = 0; i < t; i++) a = (a + e) / 2; return +((a + e) / 2).toFixed(2) }
  class De { constructor(e, t) { H(this, "local", { id: "" });
      this.visible = e.visible !== void 0 ? e.visible : !e.hidden || !0, this.locked = e.locked || !1, this.aspectRatio = e.aspectRatio || 1, this.local.id = t || Et() }
    getIndex() { return d.history.map(e => e.local.id).indexOf(this.local.id) }
    getPlane() { return d.curtain.planes.find(e => e.userData.id === this.local.id) }
    getPlanes() { return d.curtain.planes.filter(e => e.userData.id === this.local.id) }
    getMaskedItem() { return this.mask ? d.history.filter(e => e.visible && !e.parentLayer)[this.getIndex() - 1] : !1 }
    getChildEffectItems() { return this.effects ? d.history.filter(e => e.visible && e.parentLayer && this.effects.includes(e.parentLayer)) : [] } } let ie = class extends De { constructor(t, i) { super(t, i);
      H(this, "isElement", !0);
      this.opacity = t.opacity || 1, this.displace = t.displace || 0, this.dissolve = t.dissolve || 0, this.bgDisplace = t.bgDisplace || 0, this.dispersion = t.dispersion || 0, this.blendMode = t.blendMode || "NORMAL" }
    createLocalCanvas() { const t = document.createElement("canvas"),
        i = d.scale * d.dpi;
      t.width = d.canvasWidth * i, t.height = d.canvasHeight * i; const s = t.getContext("2d");
      s.scale(i, i), this.local.canvas = t, this.local.ctx = s }
    resize(t) { const i = (t || d.scale) * d.dpi;
      this.local.canvas && (this.local.canvas.width = d.canvasWidth * i, this.local.canvas.height = d.canvasHeight * i, this.local.ctx.scale(i, i)) }
    getPositionOffset() { const t = this.aspectRatio / (d.canvasWidth / d.canvasHeight),
        i = d.canvasWidth * Math.sqrt(t),
        s = d.canvasHeight / Math.sqrt(t); let r = (d.canvasWidth - i) / 2,
        n = (d.canvasHeight - s) / 2;
      this.layerType === "image" && (r += i / 2, n += s / 2); let h = this.translateX + r,
        l = this.translateY + n; return { x: h, y: l, offX: r, offY: n } } };
  class Ht extends ie { constructor(t, i) { super(t, i);
      H(this, "layerType", "draw"); let s = this.default(t || {}); for (let r in s) this[r] = s[r];
      Object.keys(t).length && this.createLocalCanvas() }
    default (t) { return { displace: t.displace || 0, bgDisplace: t.bgDisplace || 0, dispersion: t.dispersion || 0, dissolve: t.dissolve || 0, blendMode: "NORMAL", opacity: t.opacity || 1, type: t.type || "circle", mask: t.mask || !1, brushRotation: t.brushRotation || t.rotation || 0, coords: t.coords || [], effects: t.effects || [], gradientAngle: t.gradientAngle || t.gradAngle || 0, gradientType: t.gradientType || t.gradType || "linear", fill: t.fill || ["#777777"], rotateHue: t.rotateHue || t.huerotate || !1, rotation: t.rotation || 0, lerp: t.lerp || !0, size: t.size || 100, translateX: t.translateX || 0, translateY: t.translateY || 0 } }
    unpackage() { return this.coords = Y(this.coords), this.fill = Y(this.fill), this.effects = Y(this.effects), this.coords.length > 3 ? this.coordsHiRes = Te(this.coords, this.size) : this.coordsHiRes = this.coords, this }
    interpolatePath() { this.coordsHiRes = Te(this.coords, this.size) }
    render() { const t = Wt(this.aspectRatio); let i = this.lerp ? this.coordsHiRes || this.coords : this.coords;
      this.local.ctx.clearRect(0, 0, d.canvasWidth, d.canvasHeight); let s = Bt(Vt, { type: "circle", size: this.size / 2, coords: i, rotation: this.rotation, fill: this.fill, gradientType: this.gradientType, gradientAngle: this.gradientAngle }, null, d.dpi, d.scale); const r = i.length,
        n = this.getPositionOffset(); if (this.fill.length > 1 && this.rotateHue)
        for (let h = 0; h < r; h++) { let l = i[h][0] * t.x + n.x,
            o = i[h][1] * t.y + n.y; if (this.fill.length > 1 && this.rotateHue) { let c = Math.floor(h / r * this.fill.length),
              f = c < this.fill.length - 1 ? c + 1 : 0;
            f = f || c; const x = h / r * this.fill.length - c,
              m = ue(this.fill[c]).map((u, p) => Ot([u, ue(this.fill[f])[p]], [1 - x, x]));
            this.local.ctx.beginPath(), this.local.ctx.fillStyle = Ee(...m.map(u => Math.round(u))), this.local.ctx.arc(l, o, this.size / 2, 0, 2 * Math.PI, !1), this.local.ctx.fill() } } else
          for (let h = 0; h < r; h++) { let l = i[h][0] * t.x + n.x,
              o = i[h][1] * t.y + n.y;
            this.local.ctx.drawImage(s, l - s.width / 2 / d.scale, o - s.height / 2 / d.scale, s.width / d.scale, s.height / d.scale) } } }
  class Gt extends ie { constructor(t, i) { super(t, i);
      H(this, "layerType", "fill");
      H(this, "isElement", !0);
      t = t.properties ? t.properties : t, this.fill = t.fill || ["#ffffff"], this.gradientAngle = t.gradientAngle || t.gradAngle || 0, this.gradientType = t.gradientType || t.gradType || "linear", Object.keys(t).length && this.createLocalCanvas() }
    unpackage() { return this.fill = Y(this.fill), this }
    render() { this.local.ctx.fillStyle = Se(this.local.ctx, { size: Math.min(this.local.canvas.width, this.local.canvas.height) * (.5 / d.scale), x: this.local.canvas.width / 2 * (.5 / d.scale), y: this.local.canvas.height / 2 * (.5 / d.scale), ...this }), this.local.ctx.fillRect(0, 0, this.local.canvas.width, this.local.canvas.height) } }
  class jt extends ie { constructor(t, i) { super(t, i);
      H(this, "layerType", "shape");
      H(this, "isElement", !0); let s = this.default(t || {}); for (let r in s) this[r] = s[r];
      Object.keys(t).length && this.createLocalCanvas() }
    default (t) { return { blendMode: t.blendMode || "NORMAL", borderRadius: t.borderRadius || 0, coords: t.coords || [], displace: t.displace || 0, dispersion: t.dispersion || 0, dissolve: t.dissolve || 0, bgDisplace: t.bgDisplace || 0, effects: t.effects || [], fill: t.fill || ["#777777"], gradientAngle: t.gradientAngle || t.gradAngle || 0, gradientType: t.gradientType || t.gradType || "linear", mask: t.mask || 0, opacity: t.opacity || 1, rotation: t.rotation || 0, translateX: t.translateX || 0, translateY: t.translateY || 0, type: t.type || "rectangle" } }
    unpackage() { return this.fill = Y(this.fill), this.coords = Y(this.coords), this.effects = Y(this.effects), this }
    render() { let t = Nt(this); if (this.local.ctx.beginPath(), this.type === "rectangle") { const i = te(this.coords); let s = this.borderRadius * Math.min(i.width, i.height) / 2; const r = (h, l, o) => { const c = Math.cos(o),
              f = Math.sin(o); return [h * c - l * f, h * f + l * c] },
          n = this.rotation * 2 * Math.PI; if (t.length) { this.local.ctx.beginPath(); let h = this.coords[0][0] < this.coords[1][0],
            l = this.coords[0][1] > this.coords[2][1],
            o = [-1, 1, -1, 1];
          h && (o = [-1, -1, -1, -1]), l && (o = [1, 1, 1, 1]), h && l && (o = [1, -1, 1, -1]); for (let c = 0; c < t.length; c++) { const [f, x] = t[c], [m, u] = t[(c + 1) % t.length], p = (c + 1) * Math.PI / 2 + n, [g, y] = r(s, 0, p); let v = o[c];
            this.local.ctx.lineTo(f - g * v, x - y * v), this.local.ctx.arcTo(f, x, m, u, s) }
          this.local.ctx.closePath(), this.local.ctx.stroke() } } else if (this.type === "circle") { let i = te(t); const s = te(this.coords);
        this.local.ctx.ellipse(i.center.x, i.center.y, s.width / 2, s.height / 2, this.rotation * Math.PI * 2, 0, 2 * Math.PI) }
      this.local.ctx.fillStyle = Fe(this.local.ctx, this, t), this.local.ctx.clearRect(0, 0, d.canvasWidth, d.canvasHeight), this.local.ctx.fill() } }
  class Xt extends De { constructor(t, i) { super(t, i);
      H(this, "layerType", "effect");
      this.type = t.type || "sine", this.type === "ungulate" && (this.type = "noise"); for (let s in t) this[s] = t[s];
      this.effects = [], this.data = t.data || {}, this.parentLayer = t.parentLayer || !1, this.animating = t.animating || !1, this.isMask = t.isMask || 0, this.customFragmentShader = t.customFragmentShader || "", this.customVertexShader = t.customVertexShader || "", this.compiledFragmentShaders = t.compiledFragmentShaders || [], this.compiledVertexShaders = t.compiledVertexShaders || [] }
    unpackage() { this.type === "blur" && this.type, this.type === "smoothBlur" && (this.type = "blur"), this.type === "ungulate" && (this.type = "noise"); for (let t in this) this[t].type === "Vec2" ? this[t] = new O(this[t]._x, this[t]._y) : this[t].type === "Vec3" && (this[t] = new E(this[t]._x, this[t]._y, this[t]._z)); return this }
    render(t) { if (t) { for (let i in this) i !== "visible" && t.uniforms[i] && (t.uniforms[i].value = this[i]);
        this.animating && (t.uniforms.time.value += this.speed * 2), this.type === "mouse" && (t.uniforms.time.value += .01) } }
    getParent() { return d.history.filter(t => t.effects && t.effects.length).find(t => t.effects.includes(this.parentLayer)) } }
  class Yt extends ie { constructor(t, i) { super(t, i);
      H(this, "layerType", "image");
      H(this, "isElement", !0); let s = this.default(t || {}); for (let r in s) this[r] = s[r];
      Object.keys(t).length && (this.loadImage(), this.createLocalCanvas()) }
    default (t) { return { bgDisplace: t.bgDisplace || 0, dispersion: t.dispersion || 0, dissolve: t.dissolve || 0, effects: t.effects || [], size: t.size || .25, rotation: t.rotation || t.angle || 0, height: t.height || 50, displace: t.displace || 0, repeat: t.repeat || 0, mask: t.mask || 0, rotation: t.rotation || 0, scaleX: t.scaleX || 1, scaleY: t.scaleY || 1, src: t.src || "", speed: t.speed || .5, thumb: t.thumb || "", translateX: t.translateX || 0, translateY: t.translateY || 0, width: t.width || 50 } }
    unpackage() { return this.effects = Y(this.effects), this }
    loadImage() { const t = new Image,
        i = new Image;
      t.crossOrigin = "Anonymous", i.crossOrigin = "Anonymous", t.addEventListener("load", () => { this.local.img = t, this.local.loaded = !0, this.width = t.width, this.height = t.height, this.getPlane() && this.getPlane().textures.filter(s => s.sourceType === "canvas").forEach(s => { s.shouldUpdate = !1, s.sourceType === "canvas" && !se().length && s.needUpdate() }) }, !1), i.addEventListener("load", () => { this.local.img || (this.local.img = i, this.render = this.renderImage) }, !1), i.src = this.thumb, t.src = this.src }
    getRelativeScale() { return Math.min(d.canvasWidth * 2 / this.width, d.canvasHeight * 2 / this.height) }
    renderImage() { const t = this.getPositionOffset(),
        i = t.x,
        s = t.y,
        r = this.rotation * 360 * (Math.PI / 180),
        n = this.getRelativeScale(); let h = this.width * n * this.scaleX,
        l = this.height * n * this.scaleY;
      this.local.ctx.clearRect(0, 0, d.canvasWidth, d.canvasHeight), this.local.ctx.save(), this.local.ctx.translate(i, s), this.local.ctx.rotate(r), this.local.ctx.scale(this.size, this.size), this.local.ctx.drawImage(this.local.img, -h / 2, -l / 2, h, l), this.local.ctx.restore() }
    render() {} }
  class qt extends ie { constructor(t, i) { super(t, i);
      H(this, "layerType", "text");
      H(this, "isElement", !0);
      H(this, "justCreated", !1); let s = this.default(t || {}); for (let n in s) this[n] = s[n];
      Object.keys(t).length && (this.createLocalCanvas(), requestAnimationFrame(() => { this.coords = [
          [-2, 0],
          [-2 + this.width, 0],
          [-2 + this.width, 0 + this.height],
          [-2, 0 + this.height]
        ], this.render() })), new window.FontFaceObserver(t.fontFamily).load().then(() => { this.local.loaded = !0, this.render(), requestAnimationFrame(() => { this.render() }) }) }
    default (t) { return { bgDisplace: t.bgDisplace || 0, dispersion: t.dispersion || 0, dissolve: t.dissolve || 0, effects: t.effects || [], fill: t.fill || ["#ffffff"], highlight: t.highlight || ["transparent"], fontSize: t.fontSize || 24, lineHeight: t.lineHeight || 25, letterSpacing: t.letterSpacing || 0, mask: t.mask || 0, fontFamily: t.fontFamily || "arial", fontStyle: t.fontStyle || "normal", fontWeight: t.fontWeight || "normal", textAlign: t.textAlign || "left", textContent: t.textContent || "", gradientAngle: t.gradientAngle || t.gradAngle || 0, gradientType: t.gradientType || t.gradType || "linear", coords: t.coords || [], rotation: t.rotation || 0, translateX: t.translateX || 0, translateY: t.translateY || 0, width: t.width || 200, height: t.height || 50 } }
    unpackage() { return this.fill = Y(this.fill), this.highlight = Y(this.highlight), this.coords = Y(this.coords), this.effects = Y(this.effects), this }
    render() { const t = this.getPositionOffset(); let i = t.x,
        s = t.y,
        r = 0,
        n = this.width,
        h = this.height,
        l = this.fontSize > 0 ? this.fontSize : 0,
        o = this.lineHeight > 0 ? this.lineHeight : 0,
        c = this.fontStyle.includes("italic") ? "italic" : "normal",
        f = c === "italic" ? this.fontStyle.replace("italic", "") : this.fontStyle;
      f = f === "regular" ? 400 : f, this.local.textBoxPos = { x: i, y: s }, this.local.ctx.clearRect(0, 0, d.canvasWidth, d.canvasHeight), this.local.ctx.font = `${c} ${f} ${l}px/${o}px ${this.fontFamily}`, this.local.ctx.letterSpacing = this.letterSpacing + "px", this.local.ctx.textAlign = this.textAlign, this.local.ctx.save(), this.local.ctx.translate(i + n / 2, s + h / 2), this.local.ctx.rotate(this.rotation * 360 * Math.PI / 180), this.local.ctx.translate(-(i + n / 2), -(s + h / 2)); const x = (p, g) => { let y = this.local.ctx.measureText(p).width;
          this.local.ctx.fillStyle = this.highlight, this.local.ctx.fillRect(i + (this.textAlign === "center" ? (n - y) / 2 : this.textAlign === "right" ? y : 0), s + o * g, this.local.ctx.measureText(p).width, this.lineHeight), this.local.ctx.fillStyle = Fe(this.local.ctx, this, this.coords), this.local.ctx.fillText(p, i + (this.textAlign === "center" ? n / 2 : this.textAlign === "right" ? n : 0), s + o * g + o / 2 + l / 3) },
        m = this.textContent ? this.textContent.split(`
`) : [""]; let u = m.length; for (let p = 0; p < u; p++) { let g = "",
          y = m[p].split(" "); for (let v = 0; v < y.length; v++) { const b = y[v]; if (this.local.ctx.measureText(g + b).width > n)
            if (this.local.ctx.measureText(b).width <= n) { m[p] = g.trim(), m.splice(p + 1, 0, b + " " + y.slice(v + 1).join(" ")), u++; break } else { m[p] = g.trim(); let P = b,
                M = p + 1; for (; P.length > 0;) { let T = ""; for (let R = 0; R < P.length; R++)
                  if (this.local.ctx.measureText(T + P[R]).width <= n) T += P[R];
                  else { T.length === 0 && (T += P[R]); break }
                P = P.slice(T.length), m.splice(M, 0, T.trim()), u++, M++ }
              y.slice(v + 1).length > 0 && (m[M - 1] = m[M - 1] + " " + y.slice(v + 1).join(" ")); break }
          else g = g + b + " ", v === y.length - 1 && (m[p] = g.trim()) } }
      m.forEach((p, g) => {!p.length && !p.includes(`
`) && r--, p && x(p, r), g < m.length - 1 && r++ }), this.local.ctx.translate(-(i + n / 2), -(s + h / 2)), this.local.ctx.restore(), this.height = this.lineHeight * r + this.lineHeight, this.justCreated ? (this.width = this.local.ctx.measureText(this.textContent).width + 20, this.height = this.lineHeight, this.coords = [
        [-2, 0],
        [-2 + this.width, 0],
        [-2 + this.width, 0 + this.height],
        [-2, 0 + this.height]
      ]) : this.coords = [
        [0, 0],
        [0 + this.width, 0],
        [0 + this.width, 0 + this.height],
        [0, 0 + this.height]
      ] } }

  function se() { return d.history.filter(a => a.animating && a.visible) }

  function $t(a, e, t) { const i = new Ye({ container: t, premultipliedAlpha: !0, antialias: !1, autoRender: !1, autoResize: !1, watchScroll: !1, renderingScale: Math.min(1, a) || 1, production: !0, pixelRatio: Math.min(Math.min(e || 1.5, 2), d.dpi) });
    d.curtain = i }

  function Qt(a) { if (a.length) { const e = document.createElement("style"); for (let t = 0; t < a.length; t++) { let i = a[t].fontStyle === "normal" || a[t].fontStyle === "regular" ? 400 : a[t].fontStyle;
        e.innerHTML += `@import url(https://fonts.googleapis.com/css2?family=${a[t].fontFamily.split(" ").join("+")}:wght@${i});` }
      document.head.appendChild(e) } }

  function Zt(a) { const e = []; return a.forEach(t => { switch (t.layerType) {
        case "text":
          e.push(new qt(t).unpackage()); break;
        case "image":
          e.push(new Yt(t).unpackage()); break;
        case "fill":
          e.push(new Gt(t).unpackage()); break;
        case "draw":
          e.push(new Ht(t).unpackage()); break;
        case "shape":
          e.push(new jt(t).unpackage()); break;
        case "effect":
          e.push(new Xt(t).unpackage()); break } }), e }

  function Kt() { cancelAnimationFrame(d.curtainRafId) }

  function Jt() { if (se().length) { const a = Math.min(d.fps, 120);
      Le(Math.max(1, a)) } }

  function ei() { d.history.filter(a => a.isElement).forEach(a => { a.resize(), a.render(), a.getPlane().textures.filter(e => e.sourceType === "canvas").forEach(e => { e.needUpdate() }) }), d.curtain.resize() }

  function ti(a) { d.mouse.movePos.x = Math.round(a.pageX / 2), d.mouse.movePos.y = Math.round(a.pageY / 2), d.mouse.pos.x = Ce(d.mouse.movePos.x, d.mouse.lastPos.x, 1), d.mouse.pos.y = Ce(d.mouse.movePos.y, d.mouse.lastPos.y, 1), d.mouse.lastPos.x = d.mouse.pos.x, d.mouse.lastPos.y = d.mouse.pos.y, se().length || d.curtain.render() }

  function ze() { d.fullRedrawEnabled = !0, d.curtain.render(), d.fullRedrawEnabled = !1 }

  function ii(a, e) { let t = 0; const i = () => { d.curtain.render(), t < a ? (t++, requestAnimationFrame(i)) : e && e() };
    se().length || i() }

  function Le(a) { let e = 0;
    cancelAnimationFrame(d.curtainRafId); const t = Math.floor(1e3 / (a || 60)),
      i = s => { d.curtain ? (s - e >= t && (d.curtain.render(), e = s), d.curtainRafId = requestAnimationFrame(i)) : cancelAnimationFrame(d.curtainRafId) };
    ze(), d.curtainRafId = requestAnimationFrame(i) }

  function Ie(a, e) { return d.curtain.planes.find(t => t.userData.id === a.local.id && t.userData.passIndex === e) }

  function V() { return d.curtain.renderTargets.filter(a => a.userData.id) }

  function pe() { return d.curtain.planes.filter(a => a.userData.type !== "pingpong") }

  function si() { d.curtain.planes.filter(e => !d.history.find(t => t.local.id === e.userData.id)).forEach(e => { e.target ? e.target.remove() : V().at(-1) && (V().at(-1).remove(), e.userData.passIndex !== void 0 && V().at(-1) && V().at(-1).remove()), e.remove() }) }

  function ke(a, e, t) { let i = Lt; if (a.displace === 0 && a.blendMode === "NORMAL" && !a.mask && (i = zt), a.layerType === "effect") { let r = ["noise", "noiseField", "sine"].includes(a.type) ? 250 : 1;
      i = { crossOrigin: "", fragmentShader: a.compiledFragmentShaders[t ? t.index : 0], vertexShader: a.compiledVertexShaders[t ? t.index : 0], widthSegments: r, heightSegments: r, texturesOptions: { floatingPoint: "half-float", premultiplyAlpha: !0 }, uniforms: { resolution: { name: "uResolution", type: "2f", value: new O(d.canvasWidth, d.canvasHeight) }, mousePos: { name: "uMousePos", type: "2f", value: new O(.5) }, time: { name: "uTime", type: "1f", value: 0 } } }, a.type === "mouse" && (i = Dt) } const s = new bt(d.curtain, d.curtain.container, i); return s.userData.id = a.local.id, s.userData.layerType = a.layerType, s.userData.type = a.type, s.setRenderOrder(e), s }

  function ge(a, e, t) { const i = ke(a, e, t),
      s = a.getParent();
    i && (a.data.texture && (i.userData.textureLoaded = !1, i.loadImage(a.data.texture.src, { sampler: a.data.texture.sampler }, r => { i.userData.textureLoaded = !0, d.curtain.render() })), t && (i.userData.passIndex = t.index, i.userData.length = a.data.passes.length, Object.entries(t).forEach(([r, n]) => { i.uniforms[r] && (i.uniforms[r].value = n) })), i.onReady(() => { i.userData.isReady = !0 }).onRender(() => gi(i, a, s, t))) }

  function ri(a, e) { const t = ke(a, e);
    t && t.onReady(() => { t.userData.isReady = !0 }).onRender(() => { t.uniforms.opacity.value = a.visible ? a.opacity : 0, t.uniforms.dissolve.value = a.dissolve, t.uniforms.displace && (t.uniforms.displace.value = a.displace, t.uniforms.bgDisplace.value = a.bgDisplace, t.uniforms.dispersion.value = a.dispersion), t.uniforms.blendMode && (t.uniforms.blendMode.value = Object.keys(Rt).indexOf(a.blendMode)), t.uniforms.mask && "mask" in a && (t.uniforms.mask.value = a.mask), a.local.ctx && a.layerType !== "effect" && d.fullRedrawEnabled && a.render() }) }

  function ai(a, e, t) { const i = "passIndex" in t ? Ie(a, t.passIndex) : a.getPlane(); let s = V()[e - 1],
      r = d.curtain.planes.find(n => n.userData.type === "pingpong" && n.userData.id === a.local.id); if (r && (i.createTexture({ sampler: "uPingPongTexture", fromTexture: r.getTexture() }), i.createTexture({ sampler: "uBgTexture", fromTexture: V()[e - 2].getTexture() })), s ? i.createTexture({ sampler: "uTexture", fromTexture: s.getTexture() }) : d.staticCanvas && i.loadCanvas(d.staticCanvas, { sampler: "uTexture", premultipliedAlpha: !0 }, n => { n.shouldUpdate = !1, n.needUpdate(), d.staticCanvasTexture = n }), t.passIndex > 0) { let n = V()[e - (1 + t.passIndex)] ? V()[e - (1 + t.passIndex)].getTexture() : d.staticCanvasTexture;
      i.createTexture({ sampler: "uBgTexture", fromTexture: n }) } }

  function ni(a, e) { const t = a.getPlane(),
      i = a.getChildEffectItems(); let s = V()[e - 1]; if (i.length || (t.textures.length = 0), s && i.length ? t.createTexture({ sampler: "uTexture", premultipliedAlpha: !0, fromTexture: s.getTexture() }) : t.loadCanvas(a.local.canvas, { premultipliedAlpha: !0, sampler: "uTexture" }), s) { let r = i.length + 1,
        n = i.reduce((o, c) => o + c.getPlanes().length, 0),
        h = pe()[e - r],
        l = h ? d.history.find(o => o.local.id === h.userData.id) : null; if (a.mask) { const o = s.getTexture(); if (a.effects.length) { const c = a.getChildEffectItems().filter(f => !f.isMask).length;
          s = V()[e - (1 + c)] }
        t.createTexture({ sampler: "uMaskTexture", premultipliedAlpha: !0, fromTexture: l.isElement ? o : s.getTexture() }) } if (a.mask) { let o = l.getPlanes().length + l.getChildEffectItems().reduce((c, f) => c + f.getPlanes().length, 0);
        l.getMaskedItem() && (o += l.getMaskedItem().getPlanes().length), s = V()[e - (1 + o + n)] } else s = V()[e - (1 + n)];
      s ? t.createTexture({ sampler: "uBgTexture", premultipliedAlpha: !0, fromTexture: s.getTexture() }) : d.staticCanvas && t.loadCanvas(d.staticCanvas, { sampler: "uBgTexture", premultipliedAlpha: !0 }, o => { o.shouldUpdate = !1, o.needUpdate(), d.staticCanvasTexture = o }) } }

  function hi(a, e, t) { const i = "passIndex" in t ? Ie(a, t.passIndex) : a.getPlane(),
      s = a.getParent(); let r = V()[e - 1],
      h = s.effects.filter(l => { if (d.history.find(o => o.parentLayer === l)) return d.history.find(o => o.parentLayer === l).visible }).indexOf(a.parentLayer);
    r && (h || t.passIndex > 0) ? (i.createTexture({ sampler: "uTexture", premultipliedAlpha: !0, fromTexture: r.getTexture() }), a.isMask && (!t.length || t.length <= 1 || t.passIndex === t.length - 1) && i.loadCanvas(s.local.canvas, { premultipliedAlpha: !0, sampler: "uMaskTexture" })) : a.isMask ? ((!t.length || t.length <= 1) && i.loadCanvas(s.local.canvas, { premultipliedAlpha: !0, sampler: "uMaskTexture" }), r && i.createTexture({ sampler: "uTexture", premultipliedAlpha: !0, fromTexture: r.getTexture() })) : i.loadCanvas(s.local.canvas, { premultipliedAlpha: !0, sampler: "uTexture" }) }

  function oi() { oe().forEach((a, e) => { a.getPlanes().length ? a.getPlanes().forEach(t => t.setRenderOrder(e)) : a.layerType === "effect" ? li(a, e) : ri(a, e) }) }

  function li(a, e) { const t = a.data;
    t.passes && t.passes.length ? (ge(a, e, { index: 0, length: t.passes.length + 1 }), t.passes.forEach((i, s) => { ge(a, e, { index: s + 1, length: t.passes.length + 1, [i.prop]: i.value }) })) : (ge(a, e), a.type) }

  function di() { const a = pe().filter(t => t.visible).sort((t, i) => t.renderOrder - i.renderOrder),
      e = a.length; for (let t = 0; t < e; t++) { const i = a[t]; let s = d.history.find(r => r.local.id === i.userData.id);
      t < e - 1 && ci(a, t, s, i), ui(s, t, i.userData) } }

  function ci(a, e, t, i) { let s = xi(a, e, t),
      r = V()[e] || new wt(d.curtain, s);
    r.userData.id = i.userData.id, i.setRenderTarget(r) }

  function ui(a, e, t) { a.layerType === "effect" ? a.parentLayer ? hi(a, e, t) : ai(a, e, t) : ni(a, e) }

  function me(a, e) { e && _i(e), oi(), di(), pi(a) }

  function fi(a) { const e = d.history.find(r => r.local.id === a.userData.id),
      t = e.layerType === "image" && !e.local.loaded,
      i = e.layerType === "text" && !e.local.loaded,
      s = "textureLoaded" in a.userData && !a.userData.textureLoaded; return t || i || s || !a.userData.isReady }

  function pi(a) { const e = () => { d.curtain.planes.filter(t => fi(t)).length ? (d.curtain.render(), requestAnimationFrame(e)) : a() };
    e() }

  function gi(a, e, t, i) { e.animating && a.uniforms.time && (a.uniforms.time.value += e.speed * 60 / d.fps), a.uniforms.mousePos && (a.uniforms.mousePos.value = new O(d.mouse.pos.x / d.canvasWidth, 1 - d.mouse.pos.y / d.canvasHeight)), a.uniforms.click && (a.uniforms.click.value = 0), t && i && i.index < i.length - 1 && a.uniforms.isMask && (a.uniforms.isMask.value = 0), a.uniforms.resolution.value = new O(d.curtain.canvas.width, d.curtain.canvas.height) }

  function Oe(a) { return a.parentLayer && a.getParent().effects.length > 1 ? a.getParent().effects.indexOf(a.parentLayer) === 0 : !1 }

  function mi() { V().forEach(a => a.remove()) }

  function Ue() { pe().forEach(a => a.textures.length = 0) }

  function _i(a) {
    (a.reorder || a.changed && Oe(a.changed)) && (mi(), Ue()), a.changed && Oe(a.changed) && Ue() }

  function oe() { let a = []; return d.history.filter(e => !e.parentLayer && e.visible).forEach(e => { e.effects && e.effects.length && a.push(...e.getChildEffectItems()), a.push(e) }), a }

  function xi(a, e, t) { const i = {},
      s = a[e],
      r = a[e + 1] ? d.history.find(h => h.local.id === a[e + 1].userData.id) : null; return (r && !r.parentLayer && r.type === "pixelate" || r && !r.parentLayer && r.type === "diffuse" || t.type === "blur" || t.type === "bokeh" || t.type === "bloom" || t.type === "pixelate") && (i.maxWidth = d.canvasWidth, i.maxHeight = d.canvasHeight, !s.uniforms.final || s.uniforms.final.value < 1), i }

  function yi(a) { const e = document.createElement("canvas");
    e.width = a.width, e.height = a.height; const t = e.getContext("2d"),
      i = d.scale; return t.scale(i, i), t.drawImage(a, 0, 0), e }

  function vi(a) { let e = a.compiledFragmentShaders && a.compiledFragmentShaders.filter(s => s.match(/uMousePos/g).length > 1).length,
      t = a.layerType === "effect" && a.animating,
      i = a.parentLayer && a.getParent().getChildEffectItems().some(s => s.animating); return e || t || i }

  function bi() { let a = oe(),
      e = 0,
      t = a[e]; for (; t && !vi(t);) e++, t = a[e]; return { static: oe().splice(0, e), dynamic: oe().splice(e) } }

  function Be() { if (d.history.filter(a => a.layerType !== "effect").forEach(a => { a.getPlane() && a.getPlane().textures.filter(e => e.sourceType === "canvas").forEach(e => { e.shouldUpdate = !1, e.needUpdate() }) }), d.initialized = !0, se().length) { const a = Math.min(d.fps, 120);
      Le(Math.max(1, a)) } else ze(), ii(2);
    d.curtain.planes.find(a => a.uniforms.mousePos) && d.element.addEventListener("mousemove", ti), window.addEventListener("resize", ei), window.addEventListener("blur", Kt), window.addEventListener("focus", Jt) } const wi = (a, e) => { const t = a[0] / a[1],
      i = Math.sqrt(t * (3e5 * (e || 1))); return [i, i / t] };

  function Ti(a, e) { me(() => { d.history.filter(t => t.isElement).forEach(t => t.render()), d.curtain.render(), d.staticCanvas = yi(d.curtain.canvas), d.history = a.dynamic, si(), me(() => { Be(), e && e() }, { reorder: !0 }) }) }

  function Pi(a) { const e = bi();
    e.static.length > 1 && e.dynamic.length ? (d.history = e.static, Ti(e, a)) : me(() => { Be(), a && a() }) }

  function Ri() { const e = wi([d.element.offsetWidth, d.element.offsetHeight])[0] / d.element.offsetWidth;
    d.canvasWidth = d.element.offsetWidth * e, d.canvasHeight = d.element.offsetHeight * e }

  function Ei(a) { return new Promise((e, t) => { fetch(`https://firebasestorage.googleapis.com/v0/b/embeds.unicorn.studio/o/${a.projectId}?alt=media`).then(i => i.json()).then(i => { d.fps = a.fps || 60, d.dpi = a.dpi || d.dpi; const s = document.getElementById(a.elementId); if (!s) { t(new Error(`The provided element id '${a.elementId}' does not exist on the page.`)); return }
        d.element = s, Ri(), d.history = Zt(i.history), Qt(d.history.filter(r => r.layerType === "text")), $t(a.scale, a.dpi, s), Pi(e) }).catch(i => { console.log(i), t(i) }) }) }
  G.init = Ei, Object.defineProperty(G, Symbol.toStringTag, { value: "Module" }) });