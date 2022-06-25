var Bu = Symbol.for("#__initor__"),
   Nu = Symbol.for("#__inited__"),
   Du = Symbol.for("#__hooks__"),
   hu = Symbol.for("#type"),
   de = Symbol.for("#__listeners__");

function bo(s) {
   let _ = typeof s;
   if (_ == "number") return s;
   if (_ == "string") {
      if (/^\d+fps$/.test(s)) return 1e3 / parseFloat(s);
      if (/^([-+]?[\d\.]+)s$/.test(s)) return parseFloat(s) * 1e3;
      if (/^([-+]?[\d\.]+)ms$/.test(s)) return parseFloat(s)
   }
   return null
}

function ye(s, _, o) {
   if (!s) return;
   let e = Object.getOwnPropertyDescriptor(s, _);
   return e || s == o ? e || void 0 : ye(Reflect.getPrototypeOf(s), _, o)
}
var Tr = function (s, _, o) {
   let e, r, t;
   for (;
      (e = o) && (o = o.next);)(r = o.listener) && (o.path && r[o.path] ? t = _ ? r[o.path].apply(r, _) : r[o.path]() : t = _ ? r.apply(o, _) : r.call(o)), o.times && --o.times <= 0 && (e.next = o.next, o.listener = null)
};

function Ve(s, _, o, e) {
   var r;
   let t, i, x;
   return t = s[de] || (s[de] = {}), i = t[_] || (t[_] = {}), x = i.tail || (i.tail = i.next = {}), x.listener = o, x.path = e, i.tail = x.next = {}, x
}

function Ro(s, _, o) {
   let e = Ve(s, _, o);
   return e.times = 1, e
}

function Mr(s, _, o, e) {
   let r, t, i = s[de];
   if (!!i && (r = i[_])) {
      for (;
         (t = r) && (r = r.next);)
         if (r == o || r.listener == o) {
            t.next = r.next, r.listener = null;
            break
         }
   }
}

function ho(s, _, o) {
   let e;
   (e = s[de]) && (e[_] && Tr(_, o, e[_]), e.all && Tr(_, [_, o], e.all))
}

function zn(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}
var vr = Symbol.for("#__init__"),
   Vn = Symbol.for("#__patch__"),
   Su = Symbol.for("#__initor__"),
   ku = Symbol.for("#__inited__"),
   fu = Symbol.for("#__hooks__"),
   qr = Symbol.for("#schedule"),
   Ze = Symbol.for("#frames"),
   ce = Symbol.for("#interval"),
   Ko = Symbol.for("#stage"),
   So = Symbol.for("#scheduled"),
   Ie = Symbol.for("#version"),
   Zn = Symbol.for("#fps"),
   Ur = Symbol.for("#ticker"),
   jn = globalThis.requestAnimationFrame || function (s) {
      return globalThis.setTimeout(s, 1e3 / 60)
   };
var Gu = 1 / 60,
   Pr = class {
      [Vn](_ = {}) {
         var o;
         (o = _.owner) !== void 0 && (this.owner = o), (o = _.target) !== void 0 && (this.target = o), (o = _.active) !== void 0 && (this.active = o), (o = _.value) !== void 0 && (this.value = o), (o = _.skip) !== void 0 && (this.skip = o), (o = _.last) !== void 0 && (this.last = o)
      }
      constructor(_ = null) {
         this[vr](_)
      } [vr](_ = null, o = !0) {
         var e;
         this.owner = _ && (e = _.owner) !== void 0 ? e : null, this.target = _ && (e = _.target) !== void 0 ? e : null, this.active = _ && (e = _.active) !== void 0 ? e : !1, this.value = _ && (e = _.value) !== void 0 ? e : void 0, this.skip = _ && (e = _.skip) !== void 0 ? e : 0, this.last = _ && (e = _.last) !== void 0 ? e : 0
      }
      tick(_, o) {
         return this.last = this.owner[Ze], this.target.tick(this, o), 1
      }
      update(_, o) {
         let e = this.active,
            r = _.value;
         return this.value != r && (this.deactivate(), this.value = r), (this.value || e || o) && this.activate(), this
      }
      queue() {
         this.owner.add(this)
      }
      activate() {
         return this.value === !0 ? this.owner.on("commit", this) : this.value === !1 || typeof this.value == "number" && (this.value / (1e3 / 60) <= 2 ? this.owner.on("raf", this) : this[ce] = globalThis.setInterval(this.queue.bind(this), this.value)), this.active = !0, this
      }
      deactivate() {
         return this.value === !0 && this.owner.un("commit", this), this.owner.un("raf", this), this[ce] && (globalThis.clearInterval(this[ce]), this[ce] = null), this.active = !1, this
      }
   },
   br = class {
      constructor() {
         var _ = this;
         this.id = Symbol(), this.queue = [], this.stage = -1, this[Ko] = -1, this[Ze] = 0, this[So] = !1, this[Ie] = 0, this.listeners = {}, this.intervals = {}, _.commit = function () {
            return _.add("commit"), _
         }, this[Zn] = 0, _.$promise = null, _.$resolve = null, this[Ur] = function (o) {
            return _[So] = !1, _.tick(o)
         }
      }
      touch() {
         return this[Ie]++
      }
      get version() {
         return this[Ie]
      }
      add(_, o) {
         return (o || this.queue.indexOf(_) == -1) && this.queue.push(_), this[So] || this[qr](), this
      }
      get committing\u03A6() {
         return this.queue.indexOf("commit") >= 0
      }
      get syncing\u03A6() {
         return this[Ko] == 1
      }
      listen(_, o) {
         let e = this.listeners[_],
            r = !e;
         return e || (e = this.listeners[_] = new Set), e.add(o), _ == "raf" && r && this.add("raf"), this
      }
      unlisten(_, o) {
         var e;
         let r = this.listeners[_];
         return r && r.delete(o), _ == "raf" && r && r.size == 0 && (e = this.listeners.raf, delete this.listeners.raf), this
      }
      on(_, o) {
         return this.listen(_, o)
      }
      un(_, o) {
         return this.unlisten(_, o)
      }
      get promise() {
         var _ = this;
         return _.$promise || (_.$promise = new Promise(function (o) {
            return _.$resolve = o
         }))
      }
      tick(_) {
         var o = this;
         let e = this.queue,
            r = this[Ze]++;
         if (this.ts || (this.ts = _), this.dt = _ - this.ts, this.ts = _, this.queue = [], this[Ko] = 1, this[Ie]++, e.length)
            for (let t = 0, i = zn(e), x = i.length; t < x; t++) {
               let g = i[t];
               typeof g == "string" && this.listeners[g] ? o.listeners[g].forEach(function (w) {
                  if (w.tick instanceof Function) return w.tick(o, g);
                  if (w instanceof Function) return w(o, g)
               }) : g instanceof Function ? g(o.dt, o) : g.tick && g.tick(o.dt, o)
            }
         return this[Ko] = this[So] ? 0 : -1, o.$promise && (o.$resolve(o), o.$promise = o.$resolve = null), o.listeners.raf && o.add("raf"), o
      } [qr]() {
         return this[So] || (this[So] = !0, this[Ko] == -1 && (this[Ko] = 0), jn(this[Ur])), this
      }
      schedule(_, o) {
         var e, r;
         return o || (o = _[e = this.id] || (_[e] = {
            value: !0
         })), (o[r = this.id] || (o[r] = new Pr({
            owner: this,
            target: _
         }))).update(o, !0)
      }
      unschedule(_, o = {}) {
         o || (o = _[this.id]);
         let e = o && o[this.id];
         return e && e.active && e.deactivate(), this
      }
   },
   L_ = new br;

function ko() {
   return L_.add("commit").promise
}

function Qn(s, _) {
   return globalThis.setTimeout(function () {
      s(), ko()
   }, _)
}

function Fn(s, _) {
   return globalThis.setInterval(function () {
      s(), ko()
   }, _)
}
var _w = globalThis.clearInterval,
   ow = globalThis.clearTimeout,
   Ao = globalThis.imba || (globalThis.imba = {});
Ao.commit = ko;
Ao.setTimeout = Qn;
Ao.setInterval = Fn;
Ao.clearInterval = _w;
Ao.clearTimeout = ow;
var Mu = Symbol.for("#__initor__"),
   vu = Symbol.for("#__inited__"),
   qu = Symbol.for("#__hooks__"),
   Rr = class {
      constructor() {
         this.data = {}
      }
   },
   Ar = new Rr;
var bu = Symbol.for("#__initor__"),
   Ru = Symbol.for("#__inited__"),
   Au = Symbol.for("#__hooks__"),
   Cr = Symbol.for("#__init__"),
   ew = Symbol.for("#__patch__"),
   Hr = Symbol.for("#warned"),
   fo = Symbol.for("#asset"),
   Be = class {
      static wrap(_) {
         let o = new Be(_);
         return new Proxy(o, o)
      }
      constructor(_) {
         this.meta = _
      }
      get input() {
         return Ar.inputs[this.meta.input]
      }
      get asset() {
         return globalThis._MF_ ? this.meta : this.input ? this.input.asset : null
      }
      set(_, o, e) {
         return !0
      }
      get(_, o) {
         return this.meta.meta && this.meta.meta[o] != null ? this.meta.meta[o] : this.asset ? o == "absPath" && !this.asset.absPath ? this.asset.url : this.asset[o] : ((this.meta[Hr] != !0 ? (this.meta[Hr] = !0, !0) : !1) && console.warn("Asset for '" + this.meta.input + "' not found"), o == "valueOf" ? function () {
            return ""
         } : null)
      }
   },
   Lr = class {
      [ew](_ = {}) {
         var o;
         (o = _.url) !== void 0 && (this.url = o), (o = _.meta) !== void 0 && (this.meta = o)
      }
      constructor(_ = null) {
         this[Cr](_)
      } [Cr](_ = null, o = !0) {
         this.url = _ ? _.url : void 0, this.meta = _ ? _.meta : void 0
      }
      adoptNode(_) {
         var o;
         if ((o = this.meta) == null ? void 0 : o.content) {
            for (let e = this.meta.attributes, r = 0, t = Object.keys(e), i = t.length, x, g; r < i; r++) x = t[r], g = e[x], _.setAttribute(x, g);
            _.innerHTML = this.meta.content
         }
         return this
      }
      toString() {
         return this.url
      }
      toStyleString() {
         return "url(" + this.url + ")"
      }
   };

function $(s) {
   var _, o;
   if (s[fo]) return s[fo];
   if (s.type == "svg") return s[fo] || (s[fo] = new Lr(s));
   if (s.input) {
      let e = globalThis._MF_ && globalThis._MF_[s.input];
      return e && (Object.assign(s, e), s.toString = function () {
         return this.absPath
      }), s[fo] || (s[fo] = Be.wrap(s))
   }
   return s
}
var Yr = Symbol.for("#toStringDeopt"),
   Hu = Symbol.for("#__initor__"),
   Lu = Symbol.for("#__inited__"),
   Yu = Symbol.for("#__hooks__"),
   Er = Symbol.for("#symbols"),
   Jr = Symbol.for("#batches"),
   Xr = Symbol.for("#extras"),
   zr = Symbol.for("#stacks"),
   Co = class {
      constructor(_) {
         this.dom = _, this.string = ""
      }
      contains(_) {
         return this.dom.classList.contains(_)
      }
      add(_) {
         return this.contains(_) ? this : (this.string += (this.string ? " " : "") + _, this.dom.classList.add(_), this)
      }
      remove(_) {
         if (!this.contains(_)) return this;
         let o = new RegExp("(^|\\s)" + _ + "(?=\\s|$)", "g");
         return this.string = this.string.replace(o, ""), this.dom.classList.remove(_), this
      }
      toggle(_, o) {
         return o === void 0 && (o = !this.contains(_)), o ? this.add(_) : this.remove(_)
      }
      incr(_, o = 0) {
         var e = this;
         let r = this.stacks,
            t = r[_] || 0;
         return t < 1 && this.add(_), o > 0 && setTimeout(function () {
            return e.decr(_)
         }, o), r[_] = Math.max(t, 0) + 1
      }
      decr(_) {
         let o = this.stacks,
            e = o[_] || 0;
         return e == 1 && this.remove(_), o[_] = Math.max(e, 1) - 1
      }
      reconcile(_, o) {
         let e = this[Er],
            r = this[Jr],
            t = !0;
         if (!e) e = this[Er] = [_], r = this[Jr] = [o || ""], this.toString = this.valueOf = this[Yr];
         else {
            let i = e.indexOf(_),
               x = o || "";
            i == -1 ? (e.push(_), r.push(x)) : r[i] != x ? r[i] = x : t = !1
         }
         t && (this[Xr] = " " + r.join(" "), this.sync())
      }
      valueOf() {
         return this.string
      }
      toString() {
         return this.string
      } [Yr]() {
         return this.string + (this[Xr] || "")
      }
      sync() {
         return this.dom.flagSync$()
      }
      get stacks() {
         return this[zr] || (this[zr] = {})
      }
   };
var Ne = Symbol.for("#__init__"),
   rw = Symbol.for("#__patch__"),
   Vr = Symbol.for("#__initor__"),
   Zr = Symbol.for("#__inited__"),
   jr = Symbol.for("#__hooks__"),
   je = Symbol.for("#getRenderContext"),
   tw = Symbol.for("#getDynamicContext"),
   Qr = Symbol(),
   Wo = {
      context: null
   },
   Fr = class {
      [rw](_ = {}) {
         var o;
         (o = _.stack) !== void 0 && (this.stack = o)
      }
      constructor(_ = null) {
         this[Ne](_)
      } [Ne](_ = null, o = !0) {
         var e;
         this.stack = _ && (e = _.stack) !== void 0 ? e : []
      }
      push(_) {
         return this.stack.push(_)
      }
      pop(_) {
         return this.stack.pop()
      }
   },
   Ju = new Fr,
   Go = class extends Map {
      static[Ne]() {
         return this.prototype[Vr] = Qr, this
      }
      constructor(_, o = null) {
         super();
         this._ = _, this.sym = o, this[Vr] === Qr && (this[jr] && this[jr].inited(this), this[Zr] && this[Zr]())
      }
      pop() {
         return Wo.context = null
      } [je](_) {
         let o = this.get(_);
         return o || this.set(_, o = new Go(this._, _)), Wo.context = o
      } [tw](_, o) {
         return this[je](_)[je](o)
      }
      run(_) {
         return this.value = _, Wo.context == this && (Wo.context = null), this.get(_)
      }
      cache(_) {
         return this.set(this.value, _), _
      }
   };
Go[Ne]();

function _t(s, _ = Symbol(), o = s) {
   return Wo.context = s[_] || (s[_] = new Go(o, _))
}

function ot() {
   let s = Wo.context,
      _ = s || new Go(null);
   return s && (Wo.context = null), _
}

function Ho(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}

function sw(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}
var De = Symbol.for("#parent"),
   et = Symbol.for("#closestNode"),
   Ow = Symbol.for("#parentNode"),
   iw = Symbol.for("#context"),
   rt = Symbol.for("#__init__"),
   tt = Symbol.for("##inited"),
   Qe = Symbol.for("#getRenderContext"),
   pw = Symbol.for("#getDynamicContext"),
   st = Symbol.for("#insertChild"),
   Lo = Symbol.for("#appendChild"),
   Fe = Symbol.for("#replaceChild"),
   Ot = Symbol.for("#removeChild"),
   _o = Symbol.for("#insertInto"),
   it = Symbol.for("#insertIntoDeopt"),
   Yo = Symbol.for("#removeFrom"),
   pt = Symbol.for("#removeFromDeopt"),
   To = Symbol.for("#replaceWith"),
   gt = Symbol.for("#replaceWithDeopt"),
   _r = Symbol.for("#placeholderNode"),
   gw = Symbol.for("#attachToParent"),
   $w = Symbol.for("#detachFromParent"),
   xw = Symbol.for("#placeChild"),
   nw = Symbol.for("#beforeReconcile"),
   ww = Symbol.for("#afterReconcile"),
   uw = Symbol.for("#afterVisit"),
   $t = Symbol.for("##parent"),
   aw = Symbol.for("##up"),
   xt = Symbol.for("##context"),
   yo = Symbol.for("#domNode"),
   he = Symbol.for("##placeholderNode"),
   nt = Symbol.for("#domDeopt"),
   lw = Symbol.for("#isRichElement"),
   wt = Symbol.for("#src"),
   Mo = Symbol.for("#htmlNodeName"),
   mw = Symbol.for("#getSlot"),
   ut = Symbol.for("#ImbaElement"),
   at = Symbol.for("#cssns"),
   Ww = Symbol.for("#cssid"),
   {
      Event: co,
      UIEvent: Qu,
      MouseEvent: lt,
      PointerEvent: Fu,
      KeyboardEvent: mt,
      CustomEvent: Ke,
      Node: Io,
      Comment: Se,
      Text: or,
      Element: Y_,
      HTMLElement: er,
      HTMLHtmlElement: _a,
      HTMLSelectElement: oa,
      HTMLInputElement: ea,
      HTMLTextAreaElement: ra,
      HTMLButtonElement: ta,
      HTMLOptionElement: sa,
      HTMLScriptElement: Oa,
      SVGElement: Wt,
      DocumentFragment: ia,
      ShadowRoot: pa,
      Document: dw,
      Window: ga,
      customElements: $a
   } = globalThis.window,
   dt = {};

function yt(s, _, o) {
   if (!s) return o[_] = null;
   if (o[_] !== void 0) return o[_];
   let e = Object.getOwnPropertyDescriptor(s, _);
   return e !== void 0 || s == Wt ? o[_] = e || null : yt(Reflect.getPrototypeOf(s), _, o)
}
var rr = {},
   tr = {},
   sr = {},
   yw = {};
var cw = {
      get(s, _) {
         let o = s,
            e;
         for (; o && e == null;)(o = o[De]) && (e = o[_]);
         return e
      },
      set(s, _, o) {
         let e = s,
            r;
         for (; e && r == null;) {
            if (ye(e, _, Y_)) return e[_] = o, !0;
            e = e[De]
         }
         return !0
      }
   },
   ct = class {
      get flags() {
         return this.documentElement.flags
      }
   };
Ho(dw.prototype, ct.prototype);
var It = class {
   get[De]() {
      return this[$t] || this.parentNode || this[aw]
   }
   get[et]() {
      return this
   }
   get[Ow]() {
      return this[De][et]
   }
   get[iw]() {
      return this[xt] || (this[xt] = new Proxy(this, cw))
   } [rt]() {
      return this
   } [tt]() {
      return this
   } [Qe](_) {
      return _t(this, _)
   } [pw](_, o) {
      return this[Qe](_)[Qe](o)
   } [st](_, o) {
      return _[_o](this, o)
   } [Lo](_) {
      return _[_o](this, null)
   } [Fe](_, o) {
      let e = this[st](_, o);
      return this[Ot](o), e
   } [Ot](_) {
      return _[Yo](this)
   } [_o](_, o = null) {
      return o ? _.insertBefore(this, o) : _.appendChild(this), this
   } [it](_, o) {
      return o ? _.insertBefore(this[yo] || this, o) : _.appendChild(this[yo] || this), this
   } [Yo](_) {
      return _.removeChild(this)
   } [pt](_) {
      return _.removeChild(this[yo] || this)
   } [To](_, o) {
      return o[Fe](_, this)
   } [gt](_, o) {
      return o[Fe](_, this[yo] || this)
   }
   get[_r]() {
      return this[he] || (this[he] = globalThis.document.createComment("placeholder"))
   }
   set[_r](_) {
      let o = this[he];
      this[he] = _, o && o != _ && o.parentNode && o[To](_)
   } [gw]() {
      let _ = this[yo],
         o = _ && _.parentNode;
      return _ && o && _ != this && (this[yo] = null, this[_o](o, _), _[Yo](o)), this
   } [$w]() {
      (this[nt] != !0 ? (this[nt] = !0, !0) : !1) && (this[To] = this[gt], this[Yo] = this[pt], this[_o] = this[it]);
      let _ = this[_r];
      return this.parentNode && _ != this && (_[_o](this.parentNode, this), this[Yo](this.parentNode)), this[yo] = _, this
   } [xw](_, o, e) {
      let r = typeof _;
      if (r === "undefined" || _ === null) {
         if (e && e instanceof Se) return e;
         let t = globalThis.document.createComment("");
         return e ? e[To](t, this) : t[_o](this, null)
      }
      if (_ === e) return _;
      if (r !== "object") {
         let t, i = _;
         return o & 128 && o & 256, e ? e instanceof or ? (e.textContent = i, e) : (t = globalThis.document.createTextNode(i), e[To](t, this), t) : (this.appendChild(t = globalThis.document.createTextNode(i)), t)
      } else return e ? e[To](_, this) : _[_o](this, null)
   }
};
Ho(Io.prototype, It.prototype);
var Bt = class {
   log(..._) {
      return console.log(..._), this
   }
   emit(_, o, e = {
      bubbles: !0,
      cancelable: !0
   }) {
      o != null && (e.detail = o);
      let r = new Ke(_, e),
         t = this.dispatchEvent(r);
      return r
   }
   text$(_) {
      return this.textContent = _, this
   } [nw]() {
      return this
   } [ww]() {
      return this
   } [uw]() {
      this.render && this.render()
   }
   get flags() {
      return this.$flags || (this.$flags = new Co(this), this.flag$ == Y_.prototype.flag$ && (this.flags$ext = this.className), this.flagDeopt$()), this.$flags
   }
   flag$(_) {
      let o = this.flags$ns;
      this.className = o ? o + (this.flags$ext = _) : this.flags$ext = _
   }
   flagDeopt$() {
      var _ = this;
      this.flag$ = this.flagExt$, _.flagSelf$ = function (o) {
         return _.flagSync$(_.flags$own = o)
      }
   }
   flagExt$(_) {
      return this.flagSync$(this.flags$ext = _)
   }
   flagSelf$(_) {
      return this.flagDeopt$(), this.flagSelf$(_)
   }
   flagSync$() {
      return this.className = (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || "")
   }
   set$(_, o) {
      let e = ye(this, _, Y_);
      !e || !e.set ? this.setAttribute(_, o) : this[_] = o
   }
   get richValue() {
      return this.value
   }
   set richValue(_) {
      this.value = _
   }
};
Ho(Y_.prototype, Bt.prototype);
Y_.prototype.setns$ = Y_.prototype.setAttributeNS;
Y_.prototype[lw] = !0;

function O(s, _, o, e) {
   let r = globalThis.document.createElement(s);
   return o && (r.className = o), e !== null && r.text$(e), _ && _[Lo] && _[Lo](r), r
}
var Nt = class {
   set$(_, o) {
      var e;
      let r = dt[e = this.nodeName] || (dt[e] = {}),
         t = yt(this, _, r);
      !t || !t.set ? this.setAttribute(_, o) : this[_] = o
   }
   flag$(_) {
      let o = this.flags$ns;
      this.setAttribute("class", o ? o + (this.flags$ext = _) : this.flags$ext = _)
   }
   flagSelf$(_) {
      var o = this;
      return o.flag$ = function (e) {
         return o.flagSync$(o.flags$ext = e)
      }, o.flagSelf$ = function (e) {
         return o.flagSync$(o.flags$own = e)
      }, o.flagSelf$(_)
   }
   flagSync$() {
      return this.setAttribute("class", (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || ""))
   }
};
Ho(Wt.prototype, Nt.prototype);
var Dt = class {
   set src(_) {
      if ((this[wt] != _ ? (this[wt] = _, !0) : !1) && _) {
         if (_.adoptNode) _.adoptNode(this);
         else if (_.content) {
            for (let o = _.attributes, e = 0, r = Object.keys(o), t = r.length, i, x; e < t; e++) i = r[e], x = o[i], this.setAttribute(i, x);
            this.innerHTML = _.content
         }
      }
   }
};
Ho(SVGSVGElement.prototype, Dt.prototype);

function I_(s, _, o, e, r) {
   let t = globalThis.document.createElementNS("http://www.w3.org/2000/svg", s);
   return o && (t.className.baseVal = o), _ && _[Lo] && _[Lo](t), e && (t.textContent = e), t
}

function Eo(s) {
   return globalThis.document.createComment(s)
}

function Or(s) {
   return globalThis.document.createTextNode(s)
}
var ke = globalThis.navigator,
   Iw = ke && ke.vendor || "",
   ht = ke && ke.userAgent || "",
   Bw = Iw.indexOf("Apple") > -1 || ht.indexOf("CriOS") >= 0 || ht.indexOf("FxiOS") >= 0,
   fe = !Bw,
   Kt = new Map,
   St = class extends er {
      connectedCallback() {
         return fe ? this.parentNode.removeChild(this) : this.parentNode.connectedCallback()
      }
      disconnectedCallback() {
         if (!fe) return this.parentNode.disconnectedCallback()
      }
   };
window.customElements.define("i-hook", St);

function Nw(s, _) {
   let o = Kt.get(_);
   if (!o) {
      o = {};
      let e = _.prototype,
         r = [e];
      for (;
         (e = e && Object.getPrototypeOf(e)) && e.constructor != s.constructor;) r.unshift(e);
      for (let t = 0, i = sw(r), x = i.length; t < x; t++) {
         let g = i[t],
            w = Object.getOwnPropertyDescriptors(g);
         Object.assign(o, w)
      }
      Kt.set(_, o)
   }
   return o
}

function u(s, _, o, e, r) {
   let t;
   typeof s != "string" && s && s.nodeName && (s = s.nodeName);
   let i = tr[s] || s;
   if (rr[s]) {
      let x = rr[s],
         g = x.prototype[Mo];
      if (g && fe) t = globalThis.document.createElement(g, {
         is: s
      });
      else if (x.create$ && g) {
         t = globalThis.document.createElement(g), t.setAttribute("is", i);
         let w = Nw(t, x);
         Object.defineProperties(t, w), t.__slots = {}, t.appendChild(globalThis.document.createElement("i-hook"))
      } else x.create$ ? (t = x.create$(t), t.__slots = {}) : console.warn("could not create tag " + s)
   } else t = globalThis.document.createElement(tr[s] || s);
   return t[$t] = _, t[rt](), t[tt](), e !== null && t[mw]("__").text$(e), (o || t.flags$ns) && t.flag$(o || ""), t
}

function Dw(s, _) {
   if (sr[s]) return sr[s];
   if (window[_]) return window[_];
   if (window[s]) return window[s]
}

function vo(s, _, o) {
   let e = Dw(s, _);
   if (!(e == o || e.prototype instanceof o || e.prototype[Mo])) {
      let t = e.prototype[ut];
      if (!t) {
         t = class extends e {
            constructor() {
               super(...arguments);
               this.__slots = {}, this.__F = 0
            }
         }, e.prototype[ut] = t;
         let i = Object.getOwnPropertyDescriptors(o.prototype);
         Object.defineProperties(t.prototype, i), t.prototype[Mo] = s
      }
      return t
   }
   return e
}

function Q(s, _, o = {}) {
   sr[s] = yw[s] = _, _.nodeName = s;
   let e = s,
      r = _.prototype;
   if (s.indexOf("-") == -1 && (e = "" + s + "-tag", tr[s] = e), o.cssns) {
      let t = (r._ns_ || r[at] || "") + " " + (o.cssns || "");
      r._ns_ = t.trim() + " ", r[at] = o.cssns
   }
   if (o.cssid) {
      let t = (r.flags$ns || "") + " " + o.cssid;
      r[Ww] = o.cssid, r.flags$ns = t.trim() + " "
   }
   return r[Mo] && !o.extends && (o.extends = r[Mo]), o.extends ? (r[Mo] = o.extends, rr[s] = _, fe && window.customElements.define(e, _, {
      extends: o.extends
   })) : window.customElements.define(e, _), _
}
var hw = globalThis.imba || (globalThis.imba = {});
hw.document = globalThis.document;

function ir(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}

function Kw(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}
var Ge = Symbol.for("#parent"),
   kt = Symbol.for("#closestNode"),
   Sw = Symbol.for("#isRichElement"),
   kw = Symbol.for("#afterVisit"),
   ft = Symbol.for("#__initor__"),
   Gt = Symbol.for("#__inited__"),
   Tt = Symbol.for("#__hooks__"),
   Mt = Symbol.for("#appendChild"),
   vt = Symbol.for("#removeChild"),
   Z_ = Symbol.for("#insertInto"),
   Te = Symbol.for("#replaceWith"),
   qt = Symbol.for("#insertChild"),
   Me = Symbol.for("#removeFrom"),
   Ut = Symbol.for("#placeChild"),
   Pt = Symbol.for("#__init__"),
   fw = Symbol.for("#registerFunctionalSlot"),
   Gw = Symbol.for("#getFunctionalSlot"),
   bt = Symbol.for("#getSlot"),
   pr = Symbol.for("##parent"),
   ve = Symbol.for("##up"),
   Rt = Symbol.for("##flags"),
   Tw = Symbol.for("#domFlags"),
   E_ = Symbol.for("#end"),
   At = Symbol.for("#textContent"),
   qe = Symbol.for("#textNode"),
   gr = Symbol.for("#functionalSlots"),
   Ct = Symbol();

function oo() {
   return !0
}
var Jo = class {
      constructor() {
         this.childNodes = []
      }
      log(..._) {}
      hasChildNodes() {
         return !1
      }
      set[Ge](_) {
         this[pr] = _
      }
      get[Ge]() {
         return this[pr] || this[ve]
      }
      get[kt]() {
         return this[Ge][kt]
      }
      get[Sw]() {
         return !0
      }
      get flags() {
         return this[Rt] || (this[Rt] = new Co(this))
      }
      flagSync$() {
         return this
      } [kw]() {
         return this
      }
   },
   Mw = 0,
   $r = class extends Jo {
      static[Pt]() {
         return this.prototype[ft] = Ct, this
      }
      constructor(_, o) {
         super(...arguments);
         this[ve] = o, this.parentNode = null, this[Tw] = _, this.childNodes = [], this[E_] = Eo("slot" + Mw++), o && o[Mt](this), this[ft] === Ct && (this[Tt] && this[Tt].inited(this), this[Gt] && this[Gt]())
      }
      get[Ge]() {
         return this[pr] || this.parentNode || this[ve]
      }
      set textContent(_) {
         this[At] = _
      }
      get textContent() {
         return this[At]
      }
      hasChildNodes() {
         for (let _ = 0, o = ir(this.childNodes), e = o.length; _ < e; _++) {
            let r = o[_];
            if (r instanceof Jo && r.hasChildNodes()) return !0;
            if (!(r instanceof Se)) {
               if (r instanceof Io) return !0
            }
         }
         return !1
      }
      text$(_) {
         return this[qe] ? this[qe].textContent = _ : this[qe] = this[Ut](_), this[qe]
      }
      appendChild(_) {
         return this.parentNode && _[Z_](this.parentNode, this[E_]), this.childNodes.push(_)
      } [Mt](_) {
         return this.parentNode && _[Z_](this.parentNode, this[E_]), this.childNodes.push(_)
      }
      insertBefore(_, o) {
         this.parentNode && this.parentNode[qt](_, o);
         let e = this.childNodes.indexOf(o);
         return e >= 0 && this.childNodes.splice(e, 0, _), _
      } [vt](_) {
         this.parentNode && this.parentNode[vt](_);
         let o = this.childNodes.indexOf(_);
         o >= 0 && this.childNodes.splice(o, 1)
      } [Z_](_, o) {
         let e = this.parentNode;
         if (this.parentNode != _ ? (this.parentNode = _, !0) : !1) {
            this[E_] && (o = this[E_][Z_](_, o));
            for (let r = 0, t = ir(this.childNodes), i = t.length; r < i; r++) t[r][Z_](_, o)
         }
         return this
      } [Te](_, o) {
         let e = _[Z_](o, this[E_]);
         return this[Me](o), e
      } [qt](_, o) {
         if (this.parentNode && this.insertBefore(_, o || this[E_]), o) {
            let e = this.childNodes.indexOf(o);
            e >= 0 && this.childNodes.splice(e, 0, _)
         } else this.childNodes.push(_);
         return _
      } [Me](_) {
         for (let o = 0, e = ir(this.childNodes), r = e.length; o < r; o++) e[o][Me](_);
         return this[E_] && this[E_][Me](_), this.parentNode = null, this
      } [Ut](_, o, e) {
         let r = this.parentNode,
            t = typeof _;
         if (t === "undefined" || _ === null) {
            if (e && e instanceof Se) return e;
            let i = Eo("");
            if (e) {
               let x = this.childNodes.indexOf(e);
               return this.childNodes.splice(x, 1, i), r && e[Te](i, r), i
            }
            return this.childNodes.push(i), r && i[Z_](r, this[E_]), i
         }
         if (_ === e) return _;
         if (t !== "object") {
            let i, x = _;
            if (e) {
               if (e instanceof or) return e.textContent = x, e; {
                  i = Or(x);
                  let g = this.childNodes.indexOf(e);
                  return this.childNodes.splice(g, 1, i), r && e[Te](i, r), i
               }
            } else return this.childNodes.push(i = Or(x)), r && i[Z_](r, this[E_]), i
         } else if (e) {
            let i = this.childNodes.indexOf(e);
            return this.childNodes.splice(i, 1, _), r && e[Te](_, r), _
         } else return this.childNodes.push(_), r && _[Z_](r, this[E_]), _
      }
   };
$r[Pt]();

function Ht(s, _) {
   let o = new $r(s, null);
   return o[ve] = _, o
}
var Lt = class {
   [fw](_) {
      let o = this[gr] || (this[gr] = {});
      return o[_] || (o[_] = Ht(0, this))
   } [Gw](_, o) {
      let e = this[gr];
      return e && e[_] || this[bt](_, o)
   } [bt](_, o) {
      var e;
      return _ == "__" && !this.render ? this : (e = this.__slots)[_] || (e[_] = Ht(0, this))
   }
};
Kw(Io.prototype, Lt.prototype);

function vw(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}
var qw = Symbol.for("#afterVisit"),
   Ue = Symbol.for("#insertInto"),
   Yt = Symbol.for("#appendChild"),
   Uw = Symbol.for("#replaceWith"),
   xr = Symbol.for("#removeFrom"),
   Et = Symbol.for("#__initor__"),
   Jt = Symbol.for("#__inited__"),
   Xt = Symbol.for("#__hooks__"),
   zt = Symbol.for("#__init__"),
   Pw = Symbol.for("#domFlags"),
   bw = Symbol.for("##parent"),
   eo = Symbol.for("#end"),
   Rw = Symbol.for("#removeChild"),
   Aw = Symbol.for("#insertChild"),
   Vt = Symbol(),
   nr = class extends Jo {
      static[zt]() {
         return this.prototype[Et] = Vt, this
      }
      constructor(_, o) {
         super(...arguments);
         this[Pw] = _, this[bw] = o, _ & 256 || (this[eo] = Eo("list")), this.$ = this.childNodes, this.length = 0, o && o[Yt](this), this[Et] === Vt && (this[Xt] && this[Xt].inited(this), this[Jt] && this[Jt]())
      }
      hasChildNodes() {
         return this.length != 0
      } [qw](_) {
         let o = this.length;
         if (this.length = _, o == _) return;
         let e = this.parentNode;
         if (!e) return;
         let r = this.childNodes,
            t = this[eo];
         if (o > _)
            for (; o > _;) e[Rw](r[--o]);
         else if (_ > o)
            for (; _ > o;) e[Aw](r[o++], t);
         this.length = _
      } [Ue](_, o) {
         this.parentNode = _, this[eo] && this[eo][Ue](_, o), o = this[eo];
         for (let e = 0, r = vw(this.childNodes), t = r.length; e < t; e++) {
            let i = r[e];
            if (e == this.length) break;
            i[Ue](_, o)
         }
         return this
      } [Yt](_) {} [Uw](_, o) {
         let e = _[Ue](o, this[eo]);
         return this[xr](o), e
      } [xr](_) {
         let o = this.length;
         for (; o > 0;) this.childNodes[--o][xr](_);
         this[eo] && _.removeChild(this[eo]), this.parentNode = null
      }
   };
nr[zt]();

function Zt(s, _) {
   return new nr(s, _)
}
var Pe = Symbol.for("#__init__"),
   Cw = Symbol.for("#__patch__"),
   Hw = Symbol.for("##inited"),
   Lw = Symbol.for("#afterVisit"),
   Yw = Symbol.for("#beforeReconcile"),
   Ew = Symbol.for("#afterReconcile"),
   jt = Symbol.for("#__hooks__"),
   qo = Symbol.for("#autorender"),
   Jw = new class {
      [Cw](s = {}) {
         var _;
         (_ = s.items) !== void 0 && (this.items = _), (_ = s.current) !== void 0 && (this.current = _), (_ = s.lastQueued) !== void 0 && (this.lastQueued = _), (_ = s.tests) !== void 0 && (this.tests = _)
      }
      constructor(s = null) {
         this[Pe](s)
      } [Pe](s = null, _ = !0) {
         var o;
         this.items = s && (o = s.items) !== void 0 ? o : [], this.current = s && (o = s.current) !== void 0 ? o : null, this.lastQueued = s && (o = s.lastQueued) !== void 0 ? o : null, this.tests = s && (o = s.tests) !== void 0 ? o : 0
      }
      flush() {
         let s = null;
         for (; s = this.items.shift();) {
            if (!s.parentNode || s.hydrated\u03A6) continue;
            let _ = this.current;
            this.current = s, s.__F |= 1024, s.connectedCallback(), this.current = _
         }
      }
      queue(s) {
         var _ = this;
         let o = this.items.length,
            e = 0,
            r = this.lastQueued;
         this.lastQueued = s;
         let t = Io.DOCUMENT_POSITION_PRECEDING,
            i = Io.DOCUMENT_POSITION_FOLLOWING;
         if (o) {
            let x = this.items.indexOf(r),
               g = x,
               w = function (p, a) {
                  return _.tests++, p.compareDocumentPosition(a)
               };
            (x == -1 || r.nodeName != s.nodeName) && (g = x = 0);
            let n = _.items[g];
            for (; n && w(n, s) & i;) n = _.items[++g];
            if (g != x) n ? _.items.splice(g, 0, s) : _.items.push(s);
            else {
               for (; n && w(n, s) & t;) n = _.items[--g];
               g != x && (n ? _.items.splice(g + 1, 0, s) : _.items.unshift(s))
            }
         } else _.items.push(s), _.current || globalThis.queueMicrotask(_.flush.bind(_))
      }
   };
var j = class extends er {
   constructor() {
      super();
      this.flags$ns && (this.flag$ = this.flagExt$), this.setup$(), this.build()
   }
   setup$() {
      return this.__slots = {}, this.__F = 0
   } [Pe]() {
      return this.__F |= 1 | 2, this
   } [Hw]() {
      if (this[jt]) return this[jt].inited(this)
   }
   flag$(_) {
      this.className = this.flags$ext = _
   }
   build() {
      return this
   }
   awaken() {
      return this
   }
   mount() {
      return this
   }
   unmount() {
      return this
   }
   rendered() {
      return this
   }
   dehydrate() {
      return this
   }
   hydrate() {
      return this.autoschedule = !0, this
   }
   tick() {
      return this.commit()
   }
   visit() {
      return this.commit()
   }
   commit() {
      return this.render\u03A6 ? (this.__F |= 256, this.render && this.render(), this.rendered(), this.__F = (this.__F | 512) & ~256 & ~8192) : (this.__F |= 8192, this)
   }
   get autoschedule() {
      return (this.__F & 64) != 0
   }
   set autoschedule(_) {
      _ ? this.__F |= 64 : this.__F &= ~64
   }
   set autorender(_) {
      let o = this[qo] || (this[qo] = {});
      o.value = _, this.mounted\u03A6 && L_.schedule(this, o)
   }
   get render\u03A6() {
      return !this.suspended\u03A6
   }
   get mounting\u03A6() {
      return (this.__F & 16) != 0
   }
   get mounted\u03A6() {
      return (this.__F & 32) != 0
   }
   get awakened\u03A6() {
      return (this.__F & 8) != 0
   }
   get rendered\u03A6() {
      return (this.__F & 512) != 0
   }
   get suspended\u03A6() {
      return (this.__F & 4096) != 0
   }
   get rendering\u03A6() {
      return (this.__F & 256) != 0
   }
   get scheduled\u03A6() {
      return (this.__F & 128) != 0
   }
   get hydrated\u03A6() {
      return (this.__F & 2) != 0
   }
   get ssr\u03A6() {
      return (this.__F & 1024) != 0
   }
   schedule() {
      return L_.on("commit", this), this.__F |= 128, this
   }
   unschedule() {
      return L_.un("commit", this), this.__F &= ~128, this
   }
   async suspend(_ = null) {
      let o = this.flags.incr("_suspended_");
      return this.__F |= 4096, _ instanceof Function && (await _(), this.unsuspend()), this
   }
   unsuspend() {
      return this.flags.decr("_suspended_") == 0 && (this.__F &= ~4096, this.commit()), this
   } [Lw]() {
      return this.visit()
   } [Yw]() {
      return this.__F & 1024 && (this.__F = this.__F & ~1024, this.classList.remove("_ssr_"), this.flags$ext && this.flags$ext.indexOf("_ssr_") == 0 && (this.flags$ext = this.flags$ext.slice(5)), this.__F & 512 || (this.innerHTML = "")), this
   } [Ew]() {
      return this
   }
   connectedCallback() {
      let _ = this.__F,
         o = _ & 1,
         e = _ & 8;
      if (!o && !(_ & 1024)) {
         Jw.queue(this);
         return
      }
      if (_ & (16 | 32)) return;
      this.__F |= 16, o || this[Pe](), _ & 2 || (this.flags$ext = this.className, this.__F |= 2, this.hydrate(), this.commit()), e || (this.awaken(), this.__F |= 8), ho(this, "mount");
      let r = this.mount();
      return r && r.then instanceof Function && r.then(L_.commit), _ = this.__F = (this.__F | 32) & ~16, _ & 64 && this.schedule(), this[qo] && L_.schedule(this, this[qo]), this
   }
   disconnectedCallback() {
      if (this.__F = this.__F & (~32 & ~16), this.__F & 128 && this.unschedule(), ho(this, "unmount"), this.unmount(), this[qo]) return L_.unschedule(this, this[qo])
   }
};

function Xw(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}
var Qt = Symbol.for("#__init__"),
   zw = Symbol.for("#__patch__"),
   ha = Symbol.for("#__initor__"),
   Ka = Symbol.for("#__inited__"),
   Sa = Symbol.for("#__hooks__"),
   Vw = {
      cm: 1,
      mm: 1,
      Q: 1,
      pc: 1,
      pt: 1,
      px: 1,
      em: 1,
      ex: 1,
      ch: 1,
      rem: 1,
      vw: 1,
      vh: 1,
      vmin: 1,
      vmax: 1,
      s: 1,
      ms: 1,
      fr: 1,
      "%": 1,
      in: 1,
      turn: 1,
      grad: 1,
      rad: 1,
      deg: 1,
      Hz: 1,
      kHz: 1
   };
var Ft = {
      prefix: 1,
      suffix: 1,
      content: 1
   },
   wr = {
      rose: [
         [356, 100, 97],
         [356, 100, 95],
         [353, 96, 90],
         [353, 96, 82],
         [351, 95, 71],
         [350, 89, 60],
         [347, 77, 50],
         [345, 83, 41],
         [343, 80, 35],
         [342, 75, 30]
      ],
      pink: [
         [327, 73, 97],
         [326, 78, 95],
         [326, 85, 90],
         [327, 87, 82],
         [329, 86, 70],
         [330, 81, 60],
         [333, 71, 51],
         [335, 78, 42],
         [336, 74, 35],
         [336, 69, 30]
      ],
      fuchsia: [
         [289, 100, 98],
         [287, 100, 95],
         [288, 96, 91],
         [291, 93, 83],
         [292, 91, 73],
         [292, 84, 61],
         [293, 69, 49],
         [295, 72, 40],
         [295, 70, 33],
         [297, 64, 28]
      ],
      purple: [
         [270, 100, 98],
         [269, 100, 95],
         [269, 100, 92],
         [269, 97, 85],
         [270, 95, 75],
         [271, 91, 65],
         [271, 81, 56],
         [272, 72, 47],
         [273, 67, 39],
         [274, 66, 32]
      ],
      violet: [
         [250, 100, 98],
         [251, 91, 95],
         [251, 95, 92],
         [252, 95, 85],
         [255, 92, 76],
         [258, 90, 66],
         [262, 83, 58],
         [263, 70, 50],
         [263, 69, 42],
         [264, 67, 35]
      ],
      indigo: [
         [226, 100, 97],
         [226, 100, 94],
         [228, 96, 89],
         [230, 94, 82],
         [234, 89, 74],
         [239, 84, 67],
         [243, 75, 59],
         [245, 58, 51],
         [244, 55, 41],
         [242, 47, 34]
      ],
      blue: [
         [214, 100, 97],
         [214, 95, 93],
         [213, 97, 87],
         [212, 96, 78],
         [213, 94, 68],
         [217, 91, 60],
         [221, 83, 53],
         [224, 76, 48],
         [226, 71, 40],
         [224, 64, 33]
      ],
      sky: [
         [204, 100, 97],
         [204, 94, 94],
         [201, 94, 86],
         [199, 95, 74],
         [198, 93, 60],
         [199, 89, 48],
         [200, 98, 39],
         [201, 96, 32],
         [201, 90, 27],
         [202, 80, 24]
      ],
      cyan: [
         [183, 100, 96],
         [185, 96, 90],
         [186, 94, 82],
         [187, 92, 69],
         [188, 86, 53],
         [189, 94, 43],
         [192, 91, 36],
         [193, 82, 31],
         [194, 70, 27],
         [196, 64, 24]
      ],
      teal: [
         [166, 76, 97],
         [167, 85, 89],
         [168, 84, 78],
         [171, 77, 64],
         [172, 66, 50],
         [173, 80, 40],
         [175, 84, 32],
         [175, 77, 26],
         [176, 69, 22],
         [176, 61, 19]
      ],
      emerald: [
         [152, 81, 96],
         [149, 80, 90],
         [152, 76, 80],
         [156, 72, 67],
         [158, 64, 52],
         [160, 84, 39],
         [161, 94, 30],
         [163, 94, 24],
         [163, 88, 20],
         [164, 86, 16]
      ],
      green: [
         [138, 76, 97],
         [141, 84, 93],
         [141, 79, 85],
         [142, 77, 73],
         [142, 69, 58],
         [142, 71, 45],
         [142, 76, 36],
         [142, 72, 29],
         [143, 64, 24],
         [144, 61, 20]
      ],
      lime: [
         [78, 92, 95],
         [80, 89, 89],
         [81, 88, 80],
         [82, 85, 67],
         [83, 78, 55],
         [84, 81, 44],
         [85, 85, 35],
         [86, 78, 27],
         [86, 69, 23],
         [88, 61, 20]
      ],
      yellow: [
         [55, 92, 95],
         [55, 97, 88],
         [53, 98, 77],
         [50, 98, 64],
         [48, 96, 53],
         [45, 93, 47],
         [41, 96, 40],
         [35, 92, 33],
         [32, 81, 29],
         [28, 73, 26]
      ],
      amber: [
         [48, 100, 96],
         [48, 96, 89],
         [48, 97, 77],
         [46, 97, 65],
         [43, 96, 56],
         [38, 92, 50],
         [32, 95, 44],
         [26, 90, 37],
         [23, 83, 31],
         [22, 78, 26]
      ],
      orange: [
         [33, 100, 96],
         [34, 100, 92],
         [32, 98, 83],
         [31, 97, 72],
         [27, 96, 61],
         [25, 95, 53],
         [21, 90, 48],
         [17, 88, 40],
         [15, 79, 34],
         [15, 75, 28]
      ],
      red: [
         [0, 86, 97],
         [0, 93, 94],
         [0, 96, 89],
         [0, 94, 82],
         [0, 91, 71],
         [0, 84, 60],
         [0, 72, 51],
         [0, 74, 42],
         [0, 70, 35],
         [0, 63, 31]
      ],
      warmer: [
         [60, 9, 98],
         [60, 5, 96],
         [20, 6, 90],
         [24, 6, 83],
         [24, 5, 64],
         [25, 5, 45],
         [33, 5, 32],
         [30, 6, 25],
         [12, 6, 15],
         [24, 10, 10]
      ],
      warm: [
         [0, 0, 98],
         [0, 0, 96],
         [0, 0, 90],
         [0, 0, 83],
         [0, 0, 64],
         [0, 0, 45],
         [0, 0, 32],
         [0, 0, 25],
         [0, 0, 15],
         [0, 0, 9]
      ],
      gray: [
         [0, 0, 98],
         [240, 5, 96],
         [240, 6, 90],
         [240, 5, 84],
         [240, 5, 65],
         [240, 4, 46],
         [240, 5, 34],
         [240, 5, 26],
         [240, 4, 16],
         [240, 6, 10]
      ],
      cool: [
         [210, 20, 98],
         [220, 14, 96],
         [220, 13, 91],
         [216, 12, 84],
         [218, 11, 65],
         [220, 9, 46],
         [215, 14, 34],
         [217, 19, 27],
         [215, 28, 17],
         [221, 39, 11]
      ],
      cooler: [
         [210, 40, 98],
         [210, 40, 96],
         [214, 32, 91],
         [213, 27, 84],
         [215, 20, 65],
         [215, 16, 47],
         [215, 19, 35],
         [215, 25, 27],
         [217, 33, 17],
         [222, 47, 11]
      ]
   },
   Zw = new RegExp("^(" + Object.keys(wr).join("|") + ")(\\d+(?:\\.\\d+)?)$"),
   jw = /^([xyz])$/,
   Qw = /^([tlbr]|size|[whtlbr]|[mps][tlbrxy]?|[rcxy]?[gs])$/,
   Fw = `*,::before,::after {
box-sizing: border-box;
border-width: 0;
border-style: solid;
border-color: currentColor;
}`,
   _s = class {
      [zw](_ = {}) {
         var o;
         (o = _.entries) !== void 0 && (this.entries = o)
      }
      constructor(_ = null) {
         this[Qt](_)
      } [Qt](_ = null, o = !0) {
         var e;
         this.entries = _ && (e = _.entries) !== void 0 ? e : {}
      }
      register(_, o) {
         let e = this.entries[_];
         e ? e && (e.css = o, e.node && (e.node.textContent = o)) : (e = this.entries[_] = {
            sourceId: _,
            css: o
         }, this.entries.resets || this.register("resets", Fw), e.node = globalThis.document.createElement("style"), e.node.setAttribute("data-id", _), e.node.textContent = e.css, globalThis.document.head.appendChild(e.node))
      }
      toString() {
         return Object.values(this.entries).map(function (_) {
            return _.css
         }).join(`

`)
      }
      toValue(_, o, e, r = null) {
         let t;
         Ft[e] && (_ = String(_));
         let i = typeof _;
         if (i == "number") {
            if (o || (jw.test(e) ? o = "px" : Qw.test(e) ? o = "u" : e == "rotate" && (o = "turn", _ = (_ % 1).toFixed(4))), o) return Vw[o] ? _ + o : o == "u" ? _ * 4 + "px" : "calc(var(--u_" + o + ",1px) * " + _ + ")"
         } else if (i == "string") {
            if (e && Ft[e] && _[0] != '"' && _[0] != "'" && (_.indexOf('"') >= 0 ? _.indexOf("'") == -1 && (_ = "'" + _ + "'") : _ = '"' + _ + '"'), t = _.match(Zw)) {
               let g = wr[t[1]][parseInt(t[2])],
                  w = "100%";
               if (typeof r == "number" ? w = r + "%" : typeof r == "string" && (w = r), g) return "hsla(" + g[0] + "," + g[1] + "%," + g[2] + "%," + w + ")"
            }
         } else if (_ && _.toStyleString instanceof Function) return _.toStyleString();
         return _
      }
      parseDimension(_) {
         if (typeof _ == "string") {
            let [o, e, r] = _.match(/^([-+]?[\d\.]+)(%|\w+)$/);
            return [parseFloat(e), r]
         } else if (typeof _ == "number") return [_]
      }
   },
   _u = new _s,
   ka = Object.keys(wr);

function os() {
   return !0
}
var es = class {
   css$(_, o, e) {
      return this.style[_] = o
   }
   css$var(_, o, e, r, t = null) {
      let i = _u.toValue(o, e, r, t);
      this.style.setProperty(_, i)
   }
};
Xw(Y_.prototype, es.prototype);

function ou(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}

function rs() {
   return !0
}
var ts = class {
   \u03B1esc() {
      return this.keyCode == 27
   }
   \u03B1tab() {
      return this.keyCode == 9
   }
   \u03B1enter() {
      return this.keyCode == 13
   }
   \u03B1space() {
      return this.keyCode == 32
   }
   \u03B1up() {
      return this.keyCode == 38
   }
   \u03B1down() {
      return this.keyCode == 40
   }
   \u03B1left() {
      return this.keyCode == 37
   }
   \u03B1right() {
      return this.keyCode == 39
   }
   \u03B1del() {
      return this.keyCode == 8 || this.keyCode == 46
   }
   \u03B1key(_) {
      if (typeof _ == "string") return this.key == _;
      if (typeof _ == "number") return this.keyCode == _
   }
};
ou(mt.prototype, ts.prototype);

function eu(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}

function ro() {
   return !0
}
var ss = class {
   \u03B1left() {
      return this.button == 0
   }
   \u03B1middle() {
      return this.button == 1
   }
   \u03B1right() {
      return this.button == 2
   }
   \u03B1shift() {
      return !!this.shiftKey
   }
   \u03B1alt() {
      return !!this.altKey
   }
   \u03B1ctrl() {
      return !!this.ctrlKey
   }
   \u03B1meta() {
      return !!this.metaKey
   }
   \u03B1mod() {
      let _ = globalThis.navigator.platform;
      return /^(Mac|iPhone|iPad|iPod)/.test(_ || "") ? !!this.metaKey : !!this.ctrlKey
   }
};
eu(lt.prototype, ss.prototype);

function ur(s, _) {
   let o = Object.getOwnPropertyDescriptors(_);
   return delete o.constructor, Object.defineProperties(s, o), s
}

function Os(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}
var ru = Symbol.for("#extendType"),
   tu = Symbol.for("#modifierState"),
   be = Symbol.for("#sharedModifierState"),
   is = Symbol.for("#onceHandlerEnd"),
   Ha = Symbol.for("#__initor__"),
   La = Symbol.for("#__inited__"),
   Ya = Symbol.for("#__hooks__"),
   ps = Symbol.for("#extendDescriptors"),
   H_ = Symbol.for("#context"),
   gs = Symbol.for("#self"),
   su = Symbol.for("#target"),
   $s = Symbol.for("#stopPropagation"),
   xs = Symbol.for("#defaultPrevented");
rs();
ro();
var ns = class {
   [ru](_) {
      var o, e, r;
      let t = _[ps] || (_[ps] = (e = Object.getOwnPropertyDescriptors(_.prototype), r = e.constructor, delete e.constructor, e));
      return Object.defineProperties(this, t)
   }
};
ur(Ke.prototype, ns.prototype);
var ws = class {
   get[tu]() {
      var _, o;
      return (_ = this[H_])[o = this[H_].step] || (_[o] = {})
   }
   get[be]() {
      var _, o;
      return (_ = this[H_].handler)[o = this[H_].step] || (_[o] = {})
   } [is](_) {
      return Ro(this[H_], "end", _)
   }
   \u03B1sel(_) {
      return !!this.target.matches(String(_))
   }
   \u03B1closest(_) {
      return !!this.target.closest(String(_))
   }
   \u03B1log(..._) {
      return console.info(..._), !0
   }
   \u03B1trusted() {
      return !!this.isTrusted
   }
   \u03B1if(_) {
      return !!_
   }
   \u03B1wait(_ = 250) {
      return new Promise(function (o) {
         return setTimeout(o, bo(_))
      })
   }
   \u03B1self() {
      return this.target == this[H_].element
   }
   \u03B1cooldown(_ = 250) {
      let o = this[be];
      return o.active ? !1 : (o.active = !0, o.target = this[H_].element, o.target.flags.incr("cooldown"), this[is](function () {
         return setTimeout(function () {
            return o.target.flags.decr("cooldown"), o.active = !1
         }, bo(_))
      }), !0)
   }
   \u03B1throttle(_ = 250) {
      let o = this[be];
      return o.active ? (o.next && o.next(!1), new Promise(function (e) {
         return o.next = function (r) {
            return o.next = null, e(r)
         }
      })) : (o.active = !0, o.el || (o.el = this[H_].element), o.el.flags.incr("throttled"), Ro(this[H_], "end", function () {
         let e = bo(_);
         return o.interval = setInterval(function () {
            o.next ? o.next(!0) : (clearInterval(o.interval), o.el.flags.decr("throttled"), o.active = !1)
         }, e)
      }), !0)
   }
   \u03B1debounce(_ = 250) {
      let o = this[be],
         e = this;
      return o.queue || (o.queue = []), o.queue.push(o.last = e), new Promise(function (r) {
         return setTimeout(function () {
            return o.last == e ? (e.debounced = o.queue, o.last = null, o.queue = [], r(!0)) : r(!1)
         }, bo(_))
      })
   }
   \u03B1flag(_, o) {
      let {
         element: e,
         step: r,
         state: t,
         id: i,
         current: x
      } = this[H_], g = o instanceof Y_ ? o : o ? e.closest(o) : e;
      if (!g) return !0;
      this[H_].commit = !0, t[r] = i, g.flags.incr(_);
      let w = Date.now();
      return Ro(x, "end", function () {
         let n = Date.now() - w,
            p = Math.max(250 - n, 0);
         return setTimeout(function () {
            return g.flags.decr(_)
         }, p)
      }), !0
   }
   \u03B1busy(_) {
      return this.\u03B1flag("busy", _)
   }
   \u03B1mod(_) {
      return this.\u03B1flag("mod-" + _, globalThis.document.documentElement)
   }
   \u03B1outside() {
      let {
         handler: _
      } = this[H_];
      if (_ && _[gs]) return !_[gs].parentNode.contains(this.target)
   }
};
ur(co.prototype, ws.prototype);

function Uo() {
   return !0
}
var us = class {
      constructor(_, o) {
         this.params = _, this.closure = o
      }
      getHandlerForMethod(_, o) {
         return _ ? _[o] ? _ : this.getHandlerForMethod(_.parentNode, o) : null
      }
      emit(_, ...o) {
         return ho(this, _, o)
      }
      on(_, ...o) {
         return Ve(this, _, ...o)
      }
      once(_, ...o) {
         return Ro(this, _, ...o)
      }
      un(_, ...o) {
         return Mr(this, _, ...o)
      }
      get passive\u03A6() {
         return this.params.passive
      }
      get capture\u03A6() {
         return this.params.capture
      }
      get silent\u03A6() {
         return this.params.silent
      }
      get global\u03A6() {
         return this.params.global
      }
      async handleEvent(_) {
         let o = this[su] || _.currentTarget,
            e = this.params,
            r = null,
            t = e.silence || e.silent;
         this.count || (this.count = 0), this.state || (this.state = {});
         let i = {
            element: o,
            event: _,
            modifiers: e,
            handler: this,
            id: ++this.count,
            step: -1,
            state: this.state,
            commit: null,
            current: null
         };
         if (i.current = i, _.handle$mod && _.handle$mod.apply(i, e.options || []) == !1) return;
         let x = co[this.type + "$handle"] || co[_.type + "$handle"] || _.handle$mod;
         if (!(x && x.apply(i, e.options || []) == !1)) {
            this.currentEvents || (this.currentEvents = new Set), this.currentEvents.add(_);
            for (let g = 0, w = Object.keys(e), n = w.length, p, a; g < n; g++) {
               if (p = w[g], a = e[p], i.step++, p[0] == "_") continue;
               p.indexOf("~") > 0 && (p = p.split("~")[0]);
               let B = null,
                  h = [_, i],
                  f, N = null,
                  q, M = !1,
                  b = typeof p == "string";
               if (p[0] == "$" && p[1] == "_" && a[0] instanceof Function) p = a[0], p.passive || (i.commit = !0), h = [_, i].concat(a.slice(1)), N = o;
               else if (a instanceof Array) {
                  h = a.slice(), B = h;
                  for (let D = 0, G = Os(h), S = G.length; D < S; D++) {
                     let T = G[D];
                     if (typeof T == "string" && T[0] == "~" && T[1] == "$") {
                        let A = T.slice(2).split("."),
                           U = i[A.shift()] || _;
                        for (let P = 0, v = Os(A), z = v.length; P < z; P++) {
                           let R = v[P];
                           U = U ? U[R] : void 0
                        }
                        h[D] = U
                     }
                  }
               }
               if (typeof p == "string" && (q = p.match(/^(emit|flag|mod|moved|pin|fit|refit|map|remap|css)-(.+)$/)) && (B || (B = h = []), h.unshift(q[2]), p = q[1]), p == "trap") _[$s] = !0, _.stopImmediatePropagation(), _[xs] = !0, _.preventDefault();
               else if (p == "stop") _[$s] = !0, _.stopImmediatePropagation();
               else if (p == "prevent") _[xs] = !0, _.preventDefault();
               else if (p == "commit") i.commit = !0;
               else if (p == "once") o.removeEventListener(_.type, this);
               else {
                  if (p == "options" || p == "silence" || p == "silent") continue;
                  if (p == "emit") {
                     let D = h[0],
                        G = h[1],
                        S = new Ke(D, {
                           bubbles: !0,
                           detail: G
                        });
                     S.originalEvent = _;
                     let T = o.dispatchEvent(S)
                  } else if (typeof p == "string") {
                     p[0] == "!" && (M = !0, p = p.slice(1));
                     let D = "\u03B1" + p,
                        G = _[D];
                     G || (G = this.type && co[this.type + "$" + p + "$mod"]), G || (G = _[p + "$mod"] || co[_.type + "$" + p] || co[p + "$mod"]), G instanceof Function ? (p = G, N = i, h = B || [], _[D] && (N = _, _[H_] = i)) : p[0] == "_" ? (p = p.slice(1), N = this.closure) : N = this.getHandlerForMethod(o, p)
                  }
               }
               try {
                  p instanceof Function ? f = p.apply(N || o, h) : N && (f = N[p].apply(N, h)), f && f.then instanceof Function && f != L_.$promise && (i.commit && !t && L_.commit(), f = await f)
               } catch (D) {
                  r = D;
                  break
               }
               if (M && f === !0 || !M && f === !1) break;
               i.value = f
            }
            if (ho(i, "end", i), i.commit && !t && L_.commit(), this.currentEvents.delete(_), this.currentEvents.size == 0 && this.emit("idle"), r) throw r
         }
      }
   },
   as = class {
      on$(_, o, e) {
         let r = "on$" + _,
            t;
         t = new us(o, e);
         let i = o.capture || !1,
            x = o.passive,
            g = i;
         return x && (g = {
            passive: x,
            capture: i
         }), this[r] instanceof Function ? t = this[r](o, e, t, g) : this.addEventListener(_, t, g), t
      }
   };
ur(Y_.prototype, as.prototype);
var ls = Symbol.for("#beforeReconcile"),
   ms = Symbol.for("#afterReconcile"),
   Ws = Symbol(),
   ds = Symbol(),
   ys = class extends j {
      render() {
         var _, o, e, r = this._ns_ || "",
            t, i;
         return _ = this, _[ls](), o = e = 1, _[Ws] === 1 || (o = e = 0, _[Ws] = 1), (!o || e & 2) && _.flagSelf$("h-af"), o || (t = I_("svg", _, `${r}`, null)), o || t.set$("fill", "none"), o || t.set$("xmlns", "http://www.w3.org/2000/svg"), o || t.set$("viewBox", "0 0 32 20"), o || (i = I_("path", t, `${r}`, null)), o || i.set$("d", "M32 .0000019V6.66667h-6.4V.00000135l6.4 5.6e-7ZM6.4-3.2e-7V6.66667H.00000117L.00000175-8.9e-7 6.4-3.3e-7ZM25.6 6.66667v6.66663h-6.4V6.66667h6.4Zm-12.8 0v6.66663H6.4V6.66667h6.4Zm6.4 6.66663V20h-6.4v-6.6667h6.4Z"), o || i.set$("fill", "#fff"), _[ms](e), _
      }
   };
Q("icon-carat-down", ys, {});
var cs = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A;
      return _ = this, _[ls](), o = e = 1, _[ds] === 1 || (o = e = 0, _[ds] = 1), (!o || e & 2) && _.flagSelf$("h-ai"), o || (t = I_("svg", _, `${r}`, null)), o || t.set$("fill", "none"), o || t.set$("xmlns", "http://www.w3.org/2000/svg"), o || t.set$("viewbox", "0 0 43 1860"), o || (i = I_("g", t, `${r}`, null)), o || i.set$("filter", "url(#a)"), o || (x = I_("path", i, `${r}`, null)), o || x.set$("fill-rule", "evenodd"), o || x.set$("clip-rule", "evenodd"), o || x.set$("d", "M42.5187 0H0v42.5187h42.5187V0ZM10 527H0v42.519h10V916H0v42.519h10v427.461H0v42.52h10V1817H0v42.52h42.5187V1817H32v-388.5h10.5187v-42.52H32V958.519h10.5187V916H32V569.519h10.5187V527H32V43H10v484Z"), o || x.set$("fill", "#012B44"), o || (g = I_("path", t, `${r}`, null)), o || g.set$("fill-rule", "evenodd"), o || g.set$("clip-rule", "evenodd"), o || g.set$("d", "M10.9727 8.23022h20.5735V28.8038H10.9727V8.23022ZM24 533h7.5462v20.573H10.9727V533H19V28.9998h5V533Z"), o || g.set$("fill", "url(#b)"), o || (w = I_("defs", t, `${r}`, null)), o || (n = I_("lineargradient", w, `${r}`, null)), o || (n.id = "b"), o || n.set$("x1", "21.2594"), o || n.set$("y1", "-64.9312"), o || n.set$("x2", "21.2594"), o || n.set$("y2", "225.624"), o || n.set$("gradientunits", "userSpaceOnUse"), o || (p = I_("stop", n, `${r}`, null)), o || p.set$("stop-color", "#57FFE1"), o || (a = I_("stop", n, `${r}`, null)), o || a.set$("offset", "1"), o || a.set$("stop-color", "#0069E6"), o || (B = I_("filter", w, `${r}`, null)), o || (B.id = "a"), o || B.set$("x", "0"), o || B.set$("y", "0"), o || B.set$("width", "42.5186"), o || B.set$("height", "1859.52"), o || B.set$("filterunits", "userSpaceOnUse"), o || B.set$("color-interpolation-filters", "sRGB"), o || (h = I_("feflood", B, `${r}`, null)), o || h.set$("flood-opacity", "0"), o || h.set$("result", "BackgroundImageFix"), o || (f = I_("feblend", B, `${r}`, null)), o || f.set$("in", "SourceGraphic"), o || f.set$("in2", "BackgroundImageFix"), o || f.set$("result", "shape"), o || (N = I_("fecolormatrix", B, `${r}`, null)), o || N.set$("in", "SourceAlpha"), o || N.set$("values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"), o || N.set$("result", "hardAlpha"), o || (q = I_("feoffset", B, `${r}`, null)), o || q.set$("dy", "-9"), o || (M = I_("fecomposite", B, `${r}`, null)), o || M.set$("in2", "hardAlpha"), o || M.set$("operator", "arithmetic"), o || M.set$("k2", "-1"), o || M.set$("k3", "1"), o || (b = I_("fecolormatrix", B, `${r}`, null)), o || b.set$("values", "0 0 0 0 0.00392157 0 0 0 0 0.0823529 0 0 0 0 0.129412 0 0 0 1 0"), o || (D = I_("feblend", B, `${r}`, null)), o || D.set$("in2", "shape"), o || D.set$("result", "effect1_innerShadow_1026_14637"), o || (G = I_("fecolormatrix", B, `${r}`, null)), o || G.set$("in", "SourceAlpha"), o || G.set$("values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"), o || G.set$("result", "hardAlpha"), o || (S = I_("feoffset", B, `${r}`, null)), o || S.set$("dy", "9"), o || (T = I_("fecomposite", B, `${r}`, null)), o || T.set$("in2", "hardAlpha"), o || T.set$("operator", "arithmetic"), o || T.set$("k2", "-1"), o || T.set$("k3", "1"), o || (H = I_("fecolormatrix", B, `${r}`, null)), o || H.set$("values", "0 0 0 0 0.0117647 0 0 0 0 0.235294 0 0 0 0 0.384314 0 0 0 1 0"), o || (A = I_("feblend", B, `${r}`, null)), o || A.set$("in2", "effect1_innerShadow_1026_14637"), o || A.set$("result", "effect2_innerShadow_1026_14637"), _[ms](e), _
   }
};
Q("image-roadmap-progress", cs, {});

function Ou(s, _) {
   return Object.defineProperties(s, Object.getOwnPropertyDescriptors(_.prototype)), s
}
var Re = Symbol.for("#__init__"),
   Is = Symbol.for("#__patch__"),
   to = Symbol.for("#beforeReconcile"),
   Po = Symbol.for("#placeChild"),
   so = Symbol.for("#afterReconcile"),
   Bs = Symbol(),
   Ns = Symbol(),
   Ds = Symbol(),
   hs = Symbol(),
   Ks = Symbol(),
   Ss = Symbol(),
   ks = Symbol(),
   fs = Symbol(),
   Gs = Symbol(),
   Ts = Symbol(),
   Ms = Symbol(),
   vs = Symbol(),
   qs = Symbol(),
   Us = Symbol(),
   Ps = Symbol(),
   bs = Symbol(),
   Rs = Symbol(),
   As = Symbol(),
   Cs = Symbol(),
   Hs = Symbol(),
   Ls = Symbol();
os();
var Ys = class extends vo("button", "HTMLButtonElement", j) {
   static create$() {
      return Ou(globalThis.document.createElement("button"), this)
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[Bs] === 1 || (o = e = 0, _[Bs] = 1), (!o || e & 2) && _.flagSelf$("i-af"), t = _.__slots.__, _[Ns] = _[Po](t, 384, _[Ns]), _[so](e), _
   }
};
Q("gridcraft-button", Ys, {
   extends: "button"
});
var Es = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[Ds] === 1 || (o = e = 0, _[Ds] = 1), (!o || e & 2) && _.flagSelf$("i-ah"), t = _.__slots.__, _[hs] = _[Po](t, 384, _[hs]), _[so](e), _
   }
};
Q("gridcraft-panel-stone", Es, {});
var Js = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[Ks] === 1 || (o = e = 0, _[Ks] = 1), (!o || e & 2) && _.flagSelf$("i-aj"), t = _.__slots.__, _[Ss] = _[Po](t, 384, _[Ss]), _[so](e), _
   }
};
Q("gridcraft-panel-cyan", Js, {});
var Xs = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[ks] === 1 || (o = e = 0, _[ks] = 1), (!o || e & 2) && _.flagSelf$("i-al"), t = _.__slots.__, _[fs] = _[Po](t, 384, _[fs]), _[so](e), _
   }
};
Q("gridcraft-circle-green", Xs, {});
var zs = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[Gs] === 1 || (o = e = 0, _[Gs] = 1), (!o || e & 2) && _.flagSelf$("i-an"), t = _.__slots.__, _[Ts] = _[Po](t, 384, _[Ts]), _[so](e), _
   }
};
Q("gridcraft-panel-slate", zs, {});
var Vs = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t;
      return _ = this, _[to](), o = e = 1, _[Ms] === 1 || (o = e = 0, _[Ms] = 1), (!o || e & 2) && _.flagSelf$("i-ap"), t = _.__slots.__, _[vs] = _[Po](t, 384, _[vs]), _[so](e), _
   }
};
Q("gridcraft-panel-slate-small", Vs, {});
var Zs = class extends j {
   [Is](_ = {}) {
      var o;
      (o = _.size) !== void 0 && (this.size = o)
   } [Re](_ = null, o = !0) {
      var e;
      super[Re](...arguments), this.size = _ && (e = _.size) !== void 0 ? e : "100px"
   }
   set size(_) {
      this.setAttribute("size", _)
   }
   get size() {
      return this.getAttribute("size")
   }
   render() {
      var _, o, e, r;
      return _ = this, _[to](), o = e = 1, _[qs] === 1 || (o = e = 0, _[qs] = 1), r = this.size, r === _[Us] || _.css$var("--i_as", _[Us] = r, null, "-webkit-mask-size"), r = this.size, r === _[Ps] || _.css$var("--i_at", _[Ps] = r, null, "t"), r = this.size, r === _[bs] || _.css$var("--i_au", _[bs] = r, null, "b"), (!o || e & 2) && _.flagSelf$("i-ar"), _[so](e), _
   }
};
Q("block-bleed-top", Zs, {});
var js = class extends j {
   [Is](_ = {}) {
      var o;
      (o = _.size) !== void 0 && (this.size = o)
   } [Re](_ = null, o = !0) {
      var e;
      super[Re](...arguments), this.size = _ && (e = _.size) !== void 0 ? e : "100px"
   }
   set size(_) {
      this.setAttribute("size", _)
   }
   get size() {
      return this.getAttribute("size")
   }
   render() {
      var _, o, e, r;
      return _ = this, _[to](), o = e = 1, _[Rs] === 1 || (o = e = 0, _[Rs] = 1), r = this.size, r === _[As] || _.css$var("--i_aw", _[As] = r, null, "-webkit-mask-size"), r = this.size, r === _[Cs] || _.css$var("--i_ax", _[Cs] = r, null, "t"), r = this.size, r === _[Hs] || _.css$var("--i_ay", _[Hs] = r, null, "b"), r = this.size, r === _[Ls] || _.css$var("--i_az", _[Ls] = r, null, "bgp"), (!o || e & 2) && _.flagSelf$("i-av"), _[so](e), _
   }
};
Q("block-bleed-bottom", js, {});
var Qs = "images/arrow-down-LADJI262.svg";
var Fs = $({
   url: Qs,
   type: "svg",
   meta: {
      attributes: {
         width: "36",
         height: "53",
         viewBox: "0 0 36 53",
         fill: "none"
      },
      flags: [],
      content: `
<path d="M34.6781 36.921L34.3238 36.5682L34.6781 36.921C35.774 35.8206 35.774 34.0374 34.6781 32.937C33.5812 31.8354 31.8018 31.8354 30.7048 32.937L20.8085 42.8746L20.8085 3.31818C20.8085 1.76371 19.5531 0.499999 18 0.499999C16.4469 0.499999 15.1915 1.76371 15.1915 3.31818L15.1915 42.8746L5.29522 32.937C4.19824 31.8354 2.41884 31.8354 1.32187 32.937C0.226046 34.0374 0.22605 35.8206 1.32187 36.921L16.0133 51.6738C17.1103 52.7754 18.8897 52.7754 19.9867 51.6738L34.6781 36.921Z" fill="white" stroke="white"/>

`
   },
   toString: function () {
      return this.url
   }
});
var _O = "images/gridcraft-logo-ENXLGD5T.png";
var ar = $({
   url: _O,
   type: "image",
   width: 500,
   height: 105,
   toString: function () {
      return this.url
   }
});
var oO = "images/twitter-logo-XLPG7IBD.png";
var lr = $({
   url: oO,
   type: "image",
   width: 62,
   height: 51,
   toString: function () {
      return this.url
   }
});
var eO = "images/discord-logo-6PIR6M6U.png";
var mr = $({
   url: eO,
   type: "image",
   width: 65,
   height: 49,
   toString: function () {
      return this.url
   }
});

function iu(s, _) {
   return Object.defineProperties(s, Object.getOwnPropertyDescriptors(_.prototype)), s
}
var Ae = Symbol.for("#__init__"),
   rO = Symbol.for("#__patch__"),
   j_ = Symbol.for("#beforeReconcile"),
   A_ = Symbol.for("#afterVisit"),
   b_ = Symbol.for("#appendChild"),
   Q_ = Symbol.for("#afterReconcile"),
   Wr = Symbol.for("##up"),
   dr = Symbol.for("#placeChild"),
   tO = Symbol.for("#getSlot"),
   sO = Symbol(),
   OO = Symbol(),
   iO = Symbol(),
   pO = Symbol(),
   gO = Symbol(),
   $O = Symbol(),
   xO = Symbol(),
   nO = Symbol(),
   wO = Symbol(),
   uO = Symbol(),
   aO = Symbol(),
   lO = Symbol(),
   mO = Symbol(),
   WO = Symbol(),
   dO = Symbol(),
   yO = Symbol(),
   cO = Symbol(),
   IO = Symbol(),
   BO = Symbol(),
   NO = Symbol(),
   DO = Symbol(),
   hO = Symbol(),
   KO = Symbol(),
   SO = Symbol(),
   kO = Symbol(),
   fO = Symbol(),
   GO = Symbol(),
   TO = Symbol(),
   MO = Symbol(),
   vO = Symbol(),
   qO = Symbol(),
   UO = Symbol(),
   PO = Symbol(),
   bO = Symbol(),
   RO = Symbol();
Uo(), ro(), oo();
var AO = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h;
      return _ = this, _[j_](), o = e = 1, _[sO] === 1 || (o = e = 0, _[sO] = 1), (!o || e & 2) && _.flagSelf$("j-af"), i = x = 1, (t = _[OO]) || (i = x = 0, _[OO] = t = u("gridcraft-scroll-down", _, `j-ag ${r}`, null)), i || (t.scroll\u039Eto\u039Eelm = "#avatarGallery"), i || !t.setup || t.setup(x), t[A_](x), i || _[b_](t), w = n = 1, (g = _[iO]) || (w = n = 0, _[iO] = g = u("gridcraft-hero-video", _, `${r}`, null)), w || !g.setup || g.setup(n), g[A_](n), w || _[b_](g), o || (p = O("header", _, `j-ai ${r}`, null)), B = h = 1, (a = _[pO]) || (B = h = 0, _[pO] = a = u("gridcraft-nav", p, `${r}`, null)), B || !a.setup || a.setup(h), a[A_](h), B || p[b_](a), _[Q_](e), _
   }
};
Q("gridcraft-hero", AO, {});
var CO = class extends j {
   [rO](_ = {}) {
      var o;
      (o = _.scroll\u039Eto\u039Eelm) !== void 0 && (this.scroll\u039Eto\u039Eelm = o)
   } [Ae](_ = null, o = !0) {
      var e;
      super[Ae](...arguments), this.scroll\u039Eto\u039Eelm = _ && (e = _.scroll\u039Eto\u039Eelm) !== void 0 ? e : "#"
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n;
      return _ = this, _[j_](), o = e = 1, _[gO] === 1 || (o = e = 0, _[gO] = 1), (!o || e & 2) && _.flagSelf$("j-ak"), i = x = 1, (t = _[$O]) || (i = x = 0, _[$O] = t = O("a", _, `${r}`, null)), g = this.scroll\u039Eto\u039Eelm, g === _[xO] || (t.href = _[xO] = g), i || (w = O("div", t, `j-am ${r}`, null)), i || (n = O("img", w, `j-an ${r}`, null)), i || (n.src = Fs), i || (n.alt = "Scroll down"), _[Q_](e), _
   }
};
Q("gridcraft-scroll-down", CO, {});
var HO = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a;
      return _ = this, _[j_](), o = e = 1, _[nO] === 1 || (o = e = 0, _[nO] = 1), o || (t = O("nav", _, `j-ap ${r}`, null)), o || (i = O("a", t, `j-aq ${r}`, null)), o || (i.href = "/"), o || (x = O("img", i, `${r}`, null)), o || (x.src = ar), o || (g = O("div", t, `j-as ${r}`, null)), o || (w = O("a", g, `j-at ${r}`, null)), o || (w.href = "https://twitter.com/gridcraft"), o || (n = O("img", w, `j-au ${r}`, null)), o || (n.src = lr), o || (p = O("a", g, `j-av ${r}`, null)), o || (p.href = "https://discord.gg/gridcraft"), o || (a = O("img", p, `j-aw ${r}`, null)), o || (a.src = mr), _[Q_](e), _
   }
};
Q("gridcraft-nav", HO, {});
var LO = class extends j {
   [rO](_ = {}) {
      var o;
      (o = _.video) !== void 0 && (this.video = o), (o = _.muted) !== void 0 && (this.muted = o)
   } [Ae](_ = null, o = !0) {
      var e;
      super[Ae](...arguments), this.video = _ ? _.video : void 0, this.muted = _ && (e = _.muted) !== void 0 ? e : !0
   }
   toggle_mute() {
      return this.muted ? (this.muted = !1, this.video.muted = !1) : (this.muted = !0, this.video.muted = !0)
   }
   render() {
      var _ = this,
         o, e, r, t, i = this._ns_ || "",
         x, g, w, n, p, a;
      return e = this, e[j_](), r = t = 1, e[wO] === 1 || (r = t = 0, e[wO] = 1), r || e.on$("click", {
         $_: [function (B, h) {
            return _.toggle_mute(B)
         }]
      }, this), (!r || t & 2) && e.flagSelf$("j-ax"), o = null, _.muted ? (x = g = 1, (o = e[uO]) || (x = g = 0, e[uO] = o = I_("svg", null, `${i}`, null)), x || (o[Wr] = e), x || o.set$("xmlns", "http://www.w3.org/2000/svg"), x || o.set$("viewBox", "0 0 640 512"), x || (w = I_("path", o, `${i}`, null)), x || w.set$("d", "M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z")) : (n = p = 1, (o = e[aO]) || (n = p = 0, e[aO] = o = I_("svg", null, `${i}`, null)), n || (o[Wr] = e), n || o.set$("xmlns", "http://www.w3.org/2000/svg"), n || o.set$("viewBox", "0 0 640 512"), n || (a = I_("path", o, `${i}`, null)), n || a.set$("d", "M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z")), e[lO] = e[dr](o, 0, e[lO]), e[Q_](t), e
   }
};
Q("audio-control", LO, {});
var YO = class extends j {
   get $video() {
      let _ = O("video", null, `j-be ${this._ns_||""} ref--video`, null);
      return Object.defineProperty(this, "$video", {
         value: _
      }), _
   }
   render() {
      var _, o, e, r, t, i, x = this._ns_ || "",
         g, w, n, p, a;
      return _ = this, _[j_](), o = e = 1, _[mO] === 1 || (o = e = 0, _[mO] = 1), (!o || e & 2) && _.flagSelf$("j-bd"), t = i = 1, (r = _[WO]) || (t = i = 0, _[WO] = (r = this.$video, r[Wr] = _, r)), t || (r.poster = "images/gridcraft-video-poster.webp"), t || (r.muted = "muted"), t || (r.autoplay = "autoplay"), t || (r.loop = "loop"), t || (r.playsinline = "playsinline"), t || (g = O("source", r, `${x}`, null)), t || (g.src = "/video/gridcraft-720p.mp4"), t || (g.type = "video/mp4"), t || _[b_](r), n = p = 1, (w = _[dO]) || (n = p = 0, _[dO] = w = u("audio-control", _, `j-bg ${x}`, null)), a = this.$video, a === _[yO] || (w.video = _[yO] = a), n || !w.setup || w.setup(p), w[A_](p), n || _[b_](w), _[Q_](e), _
   }
};
Q("gridcraft-hero-video", YO, {
   cssns: "j_bc"
});
var EO = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w;
      return _ = this, _[j_](), o = e = 1, _[cO] === 1 || (o = e = 0, _[cO] = 1), (!o || e & 2) && _.flagSelf$("j-bh"), o || (t = O("h1", _, `j-bi ${r}`, null)), o || (i = O("span", t, `text-gradient-lightblue ${r}`, "A brand new way")), o || (x = O("br", t, `${r}`, null)), o || (g = O("span", t, `text-gradient-lightblue ${r}`, "to ")), o || (w = O("span", t, `text-gradient-darkblue ${r}`, "play on the grid")), _[Q_](e), _
   }
};
Q("gridcraft-tagline", EO, {});
var JO = class extends vo("details", "HTMLDetailsElement", j) {
   static create$() {
      return iu(globalThis.document.createElement("details"), this)
   }
   set question(_) {
      this.setAttribute("question", _)
   }
   get question() {
      return this.getAttribute("question")
   }
   set answer(_) {
      this.setAttribute("answer", _)
   }
   get answer() {
      return this.getAttribute("answer")
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b;
      return _ = this, _[j_](), o = e = 1, _[IO] === 1 || (o = e = 0, _[IO] = 1), (!o || e & 2) && _.flagSelf$("j-bo"), o || (t = O("summary", _, `${r}`, null)), x = g = 1, (i = _[BO]) || (x = g = 0, _[BO] = i = u("gridcraft-panel-slate", t, `j-bq ${r}`, null)), w = i[tO]("__", _), (n = _[NO]) || (_[NO] = n = O("span", w, `j-br ${r}`, null)), p = this.question, p === _[hO] && x || (_[DO] = n[dr](_[hO] = p, 384, _[DO])), B = h = 1, (a = _[KO]) || (B = h = 0, _[KO] = a = u("icon-carat-down", w, `j-bs ${r}`, null)), B || !a.setup || a.setup(h), a[A_](h), B || w[b_](a), x || !i.setup || i.setup(g), i[A_](g), x || t[b_](i), N = q = 1, (f = _[SO]) || (N = q = 0, _[SO] = f = u("gridcraft-panel-stone", _, `j-bt ${r}`, null)), M = f[tO]("__", _), b = this.answer, b === _[fO] && N || (_[kO] = M[dr](_[fO] = b, 384, _[kO])), N || !f.setup || f.setup(q), f[A_](q), N || _[b_](f), _[Q_](e), _
   }
};
Q("gridcraft-faq-item", JO, {
   extends: "details",
   cssns: "j_bn",
   cssid: "j-bn"
});
var XO = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P;
      return _ = this, _[j_](), o = e = 1, _[GO] === 1 || (o = e = 0, _[GO] = 1), (!o || e & 2) && _.flagSelf$("j-bv"), o || (t = O("h2", _, `j-bw ${r}`, "FAQ")), o || (i = O("div", _, `j-bx ${r}`, null)), g = w = 1, (x = _[TO]) || (g = w = 0, _[TO] = x = u("gridcraft-faq-item", i, `${r}`, null)), g || (x.question = "When does Gridcraft Identities launch?"), g || (x.answer = "Whitelist sale will begin on June 27th at 1:00PM EST. Public sale will begin the same day at 4:00PM EST. Please ensure that you're interacting with our official website only when minting!"), g || !x.setup || x.setup(w), x[A_](w), g || i[b_](x), p = a = 1, (n = _[MO]) || (p = a = 0, _[MO] = n = u("gridcraft-faq-item", i, `${r}`, null)), p || (n.question = "Where will Gridcraft NFT be available to purchase?"), p || (n.answer = "Only on the official minting page, in this website. After initial mint, Gridcraft Identities will be available on the secondary marketplace OpenSea"), p || !n.setup || n.setup(a), n[A_](a), p || i[b_](n), h = f = 1, (B = _[vO]) || (h = f = 0, _[vO] = B = u("gridcraft-faq-item", i, `${r}`, null)), h || (B.question = "What do I need to mint a Gridcraft Identity?"), h || (B.answer = "Gridcraft Identities is hosted on the Ethereum network, so you\u2019ll need $ETH to purchase. Members with @Whitelist role will be given the first opportunity to mint."), h || !B.setup || B.setup(f), B[A_](f), h || i[b_](B), q = M = 1, (N = _[qO]) || (q = M = 0, _[qO] = N = u("gridcraft-faq-item", i, `${r}`, null)), q || (N.question = "How many Gridcraft Identities are there?"), q || (N.answer = "There are 9,800 Genesis Gridcraft Identities. Holding an Identity will unlock exclusive opportunities for additional collectibles such as Gen X Identities, Grid City Land, $BITS, and more!"), q || !N.setup || N.setup(M), N[A_](M), q || i[b_](N), D = G = 1, (b = _[UO]) || (D = G = 0, _[UO] = b = u("gridcraft-faq-item", i, `${r}`, null)), D || (b.question = "How many different Identities traits are there?"), D || (b.answer = "Gridcraft Identities are created from a large pool of over 2,600 traits, ensuring that every Gridcraft Identity is unique."), D || !b.setup || b.setup(G), b[A_](G), D || i[b_](b), T = H = 1, (S = _[PO]) || (T = H = 0, _[PO] = S = u("gridcraft-faq-item", i, `${r}`, null)), T || (S.question = "Will the Gridcraft Identities launch generate a carbon footprint?"), T || (S.answer = "We\u2019re dedicated to ensuring our launch is completely carbon neutral! 				We\u2019ll be donating a portion of our mint funds to https://native.eco/ in order to offset an equivalent amount of carbon emissions as to those produced from our launch.				Environmental impact is an important issue for the Gridcraft team and we know it is especially pressing for our gaming community, so we're happy to be the first NFT collection to offset launch emissions.				We hope other collections will follow suit."), T || !S.setup || S.setup(H), S[A_](H), T || i[b_](S), U = P = 1, (A = _[bO]) || (U = P = 0, _[bO] = A = u("gridcraft-faq-item", i, `${r}`, null)), U || (A.question = "What is the difference between Gridcraft Network and Gridcraft Studios?"), U || (A.answer = "Gridcraft Network is a metaverse platform in which games and experiences are hosted on. 				Gridcraft Studios is a fully fledged game studio that creates multiplayer experiences for Gridcraft Network.				The studio team is native to building gaming experiences within Minecraft with most members working in the UGC (user-generated content) industry for the past 5+ years on notable Minecraft games (TubNet, Skyblock Isles, Viper HCF and more)				We have up to 7 full-time and numerous part-time employees right now before the launch, and intend to expand for greater experience output."), U || !A.setup || A.setup(P), A[A_](P), U || i[b_](A), _[Q_](e), _
   }
};
Q("gridcraft-faq", XO, {
   cssns: "j_bu"
});
var zO = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h;
      return _ = this, _[j_](), o = e = 1, _[RO] === 1 || (o = e = 0, _[RO] = 1), (!o || e & 2) && _.flagSelf$("j-cf"), o || (t = O("footer", _, `j-cg ${r}`, null)), o || (i = O("a", t, `j-ch ${r}`, "Read whitepaper")), o || (i.target = "_blank"), o || (i.href = "https://gridcraft.gitbook.io/gridcraft-documentation/"), o || (x = O("p", t, `j-ci ${r}`, "Gridcraft is in no way associated with, endorsed by, or a partner of Minecraft, Mojang, Microsoft or any related parties. Email contact@gridcraft.net for inquiries.")), o || (g = O("div", t, `j-cj ${r}`, null)), o || (w = O("a", g, `j-ck ${r}`, null)), o || (w.href = "https://twitter.com/gridcraft"), o || (n = O("img", w, `j-cl ${r}`, null)), o || (n.src = lr), o || (p = O("a", g, `j-cm ${r}`, null)), o || (p.href = "https://discord.gg/gridcraft"), o || (a = O("img", p, `j-cn ${r}`, null)), o || (a.src = mr), o || (B = O("a", _, `j-co ${r}`, null)), o || (B.href = "/"), o || (h = O("img", B, `${r}`, null)), o || (h.src = ar), _[Q_](e), _
   }
};
Q("gridcraft-footer", zO, {});
var VO = "images/avatar-alien-active-QBHOUM6L.png";
var ZO = $({
   url: VO,
   type: "image",
   width: 152,
   height: 344,
   toString: function () {
      return this.url
   }
});
var jO = "images/avatar-alien-2x-V4U2IJNZ.png";
var QO = $({
   url: jO,
   type: "image",
   width: 152,
   height: 344,
   toString: function () {
      return this.url
   }
});
var FO = "images/avatar-alien-big-5I4QB6JH.png";
var _i = $({
   url: FO,
   type: "image",
   width: 376,
   height: 420,
   toString: function () {
      return this.url
   }
});
var oi = "images/avatar-human-active-U6NXTXOG.png";
var ei = $({
   url: oi,
   type: "image",
   width: 170,
   height: 344,
   toString: function () {
      return this.url
   }
});
var ri = "images/avatar-human-2x-7BMUKSZI.png";
var ti = $({
   url: ri,
   type: "image",
   width: 170,
   height: 344,
   toString: function () {
      return this.url
   }
});
var si = "images/avatar-human-big-54OIFIYP.png";
var Oi = $({
   url: si,
   type: "image",
   width: 376,
   height: 420,
   toString: function () {
      return this.url
   }
});
var ii = "images/avatar-zombie-active-JNFHMR4V.png";
var pi = $({
   url: ii,
   type: "image",
   width: 154,
   height: 344,
   toString: function () {
      return this.url
   }
});
var gi = "images/avatar-zombie-2x-XSF3SNBB.png";
var $i = $({
   url: gi,
   type: "image",
   width: 154,
   height: 344,
   toString: function () {
      return this.url
   }
});
var xi = "images/avatar-zombie-big-E64EUSW3.png";
var ni = $({
   url: xi,
   type: "image",
   width: 376,
   height: 420,
   toString: function () {
      return this.url
   }
});
var wi = "images/avatar-ape-active-2XGL6UQM.png";
var ui = $({
   url: wi,
   type: "image",
   width: 170,
   height: 344,
   toString: function () {
      return this.url
   }
});
var ai = "images/avatar-ape-2x-KQ522YQK.png";
var li = $({
   url: ai,
   type: "image",
   width: 170,
   height: 344,
   toString: function () {
      return this.url
   }
});
var mi = "images/avatar-ape-big-JB7WKMIB.png";
var Wi = $({
   url: mi,
   type: "image",
   width: 376,
   height: 420,
   toString: function () {
      return this.url
   }
});

function pu(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}
var Ce = Symbol.for("#__init__"),
   di = Symbol.for("#__patch__"),
   yi = Symbol.for("#beforeReconcile"),
   ci = Symbol.for("#getSlot"),
   Ii = Symbol.for("#placeChild"),
   Xo = Symbol.for("#afterVisit"),
   He = Symbol.for("#appendChild"),
   gu = Symbol.for("##up"),
   Bi = Symbol.for("#afterReconcile"),
   Ni = Symbol(),
   Di = Symbol(),
   hi = Symbol(),
   Ki = Symbol(),
   Si = Symbol(),
   ki = Symbol(),
   Z8 = Symbol(),
   yr = Symbol(),
   fi = Symbol(),
   Gi = Symbol(),
   Ti = Symbol(),
   Mi = Symbol(),
   vi = Symbol(),
   qi = Symbol(),
   Ui = Symbol(),
   j8 = Symbol(),
   cr = Symbol(),
   Pi = Symbol(),
   bi = Symbol(),
   Ri = Symbol(),
   Ai = Symbol(),
   Ci = Symbol(),
   Hi = Symbol(),
   Li = Symbol(),
   Yi = Symbol();
Uo(), ro(), oo();
var Ei = class extends j {
   [di](_ = {}) {
      var o;
      (o = _.types) !== void 0 && (this.types = o), (o = _.active) !== void 0 && (this.active = o)
   } [Ce](_ = null, o = !0) {
      var e;
      super[Ce](...arguments), this.types = _ && (e = _.types) !== void 0 ? e : [{
         name: "Alien",
         rarity: "Legendary",
         images: {
            active: ZO,
            small: QO,
            big: _i
         },
         description: `The rarest of the species, the aliens originate from a home world not much different 
					than the Grid, making them particularly adequate for success in games and trade. 
					Aliens come in a variety of vibrant colors and give deep care to their fashionable appearances.`
      }, {
         name: "Human",
         rarity: "Uncommon",
         images: {
            active: ei,
            small: ti,
            big: Oi
         },
         description: `The most abundant species, humans represent a wide variety of cultures on the Grid. 
				Some mercenaries, some businesspeople, and many simply enjoying their time. 
				Receiving cyborg surgery has become accepted in human society, allowing members of this 
				species to level the playing field against others who are naturally better warriors. `
      }, {
         name: "Zombie",
         rarity: "Rare",
         images: {
            active: pi,
            small: $i,
            big: ni
         },
         description: `Through a mutation during initial testing of the Grid\u2019s gateway technology, 
				zombified humans spawned bearing resemblance to those in ancient twenty-first century media. 
				While abnormal, zombies can be quite pleasant; even if their hunger for brains is occasionally overwhelming.`
      }, {
         name: "Ape",
         rarity: "Epic",
         images: {
            active: ui,
            small: li,
            big: Wi
         },
         description: `Humans may have been the first sentient species on planet Terra, but the apes evolved soon after. 
				Naturally better leaders, apes ascended to the highest roles in human-ape society. 
				Apes drove scientific innovation, ended warring, and led the creation of the Grid. For this, they are recognized.`
      }], this.active = _ && (e = _.active) !== void 0 ? e : this.types[0]
   }
   select(_) {
      return this.active = _, ko()
   }
   render() {
      var w_, s_, m_, e_, Y, L, c_, g_;
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_; {
         _ = this, _[yi](), o = e = 1, _[Ni] === 1 || (o = e = 0, _[Ni] = 1);
         let i_ = this.active || this.types[0];
         i = x = 1, (t = _[Di]) || (i = x = 0, _[Di] = t = u("gridcraft-panel-stone", _, `k-ah ${r}`, null)), g = t[ci]("__", _), i || (w = O("div", g, `k-ai ${r}`, null)), p = a = 1, (n = _[hi]) || (p = a = 0, _[hi] = n = O("img", w, `k-aj ${r}`, null)), B = (s_ = (w_ = this.active) == null ? void 0 : w_.images) == null ? void 0 : s_.big, B === _[Ki] || (n.src = _[Ki] = B), i || (h = O("div", g, `k-ak ${r}`, null)), N = q = 1, (f = _[Si]) || (N = q = 0, _[Si] = f = u("gridcraft-panel-slate", h, `k-al ${r}`, null)), M = f[ci]("__", _), N || (b = O("div", M, `k-am ${r}`, null)), G = S = 1, (D = _[ki]) || (G = S = 0, _[ki] = D = O("h3", b, `${r}`, null)), T = (m_ = this.active) == null ? void 0 : m_.rarity.toLowerCase(), T === _[yr] || (S |= 2, _[yr] = T), S & 2 && D.flag$(`${r} ` + (_[yr] || "")), T = (e_ = this.active) == null ? void 0 : e_.name, T === _[Gi] && G || (_[fi] = D[Ii](_[Gi] = T, 384, _[fi])), (H = _[Ti]) || (_[Ti] = H = O("p", M, `k-ao ${r}`, null)), A = (Y = this.active) == null ? void 0 : Y.description, A === _[vi] && N || (_[Mi] = H[Ii](_[vi] = A, 384, _[Mi])), N || !f.setup || f.setup(q), f[Xo](q), N || h[He](f), (U = _[qi]) || (_[qi] = U = O("div", h, `k-ap ${r}`, null)), (P = _[Ui]) || (_[Ui] = P = Zt(384, U)), v = 0, z = P.$;
         for (let E = 0, W_ = pu(this.types), K_ = W_.length; E < K_; E++) {
            let d_ = W_[E];
            p_ = r_ = 1, (R = z[v]) || (p_ = r_ = 0, z[v] = R = O("div", P, `k-aq thumbnail ${r}`, null)), p_ || (R[gu] = P), O_ = (d_ == null ? void 0 : d_.name.toLowerCase()) == ((L = this.active) == null ? void 0 : L.name.toLowerCase()) || void 0, O_ === R[cr] || (r_ |= 2, R[cr] = O_), r_ & 2 && R.flag$(`k-aq thumbnail ${r} ` + (R[cr] ? "active" : "")), V = F = 1, (J = R[Pi]) || (V = F = 0, R[Pi] = J = O("img", R, `k-ar active-img ${r}`, null)), o_ = (c_ = d_ == null ? void 0 : d_.images) == null ? void 0 : c_.active, o_ === R[bi] || (J.src = R[bi] = o_), X = __ = 1, (Z = R[Ri]) || (X = __ = 0, R[Ri] = Z = O("img", R, `k-as main-img ${r}`, null)), n_ = (g_ = d_ == null ? void 0 : d_.images) == null ? void 0 : g_.small, n_ === R[Ai] || (Z.src = R[Ai] = n_), t_ = R[Ci] || (R[Ci] = {
               select: [null]
            }), t_.select[0] = d_, X || Z.on$("click", t_, this), v++
         }
         return P[Xo](v), i || !t.setup || t.setup(x), t[Xo](x), i || _[He](t), _[Bi](e), _
      }
   }
};
Q("gridcraft-avatar-selector", Ei, {
   cssns: "k_af"
});
var Ji = class extends j {
   [di](_ = {}) {
      var o;
      (o = _.active) !== void 0 && (this.active = o)
   } [Ce](_ = null, o = !0) {
      var e;
      super[Ce](...arguments), this.active = _ && (e = _.active) !== void 0 ? e : "alien"
   }
   set active(_) {
      this.setAttribute("active", _)
   }
   get active() {
      return this.getAttribute("active")
   }
   select(_) {
      return this.active = _, ko()
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a;
      return _ = this, _[yi](), o = e = 1, _[Hi] === 1 || (o = e = 0, _[Hi] = 1), (!o || e & 2) && _.flagSelf$("k-au"), i = x = 1, (t = _[Li]) || (i = x = 0, _[Li] = t = u("block-bleed-top", _, `k-av ${r}`, null)), i || !t.setup || t.setup(x), t[Xo](x), i || _[He](t), o || (g = O("div", _, `k-aw ${r}`, null)), o || (w = O("h2", g, `k-ax text-heading-blue ${r}`, "Avatar gallery")), p = a = 1, (n = _[Yi]) || (p = a = 0, _[Yi] = n = u("gridcraft-avatar-selector", g, `${r}`, null)), p || !n.setup || n.setup(a), n[Xo](a), p || g[He](n), _[Bi](e), _
   }
};
Q("gridcraft-avatar-gallery", Ji, {
   cssid: "k-at"
});
var Xi = "images/icon-coin-question-2IWX77KJ.png";
var zi = $({
   url: Xi,
   type: "image",
   width: 96,
   height: 96,
   toString: function () {
      return this.url
   }
});
var Vi = "images/gridcraft-play-java-QMLO2RXY.jpg";
var Zi = $({
   url: Vi,
   type: "image",
   width: 730,
   height: 460,
   toString: function () {
      return this.url
   }
});
var ji = "images/gridcraft-play-mobile-HE3NDVYN.jpg";
var Qi = $({
   url: ji,
   type: "image",
   width: 730,
   height: 460,
   toString: function () {
      return this.url
   }
});
var $u = Symbol.for("#beforeReconcile"),
   Oo = Symbol.for("#getSlot"),
   io = Symbol.for("#afterVisit"),
   po = Symbol.for("#appendChild"),
   xu = Symbol.for("#afterReconcile"),
   Fi = Symbol(),
   _p = Symbol(),
   op = Symbol(),
   ep = Symbol(),
   rp = Symbol(),
   tp = Symbol(),
   sp = Symbol(),
   Op = Symbol(),
   ip = Symbol();
oo();
var pp = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_;
      return _ = this, _[$u](), o = e = 1, _[Fi] === 1 || (o = e = 0, _[Fi] = 1), (!o || e & 2) && _.flagSelf$("l-ag"), o || (t = O("div", _, `l-ah ${r}`, null)), o || (i = O("img", t, `l-ai ${r}`, null)), o || (i.src = zi), o || (x = O("h2", t, `l-aj ${r}`, "How to Play")), o || (g = O("div", _, `l-ak ${r}`, null)), n = p = 1, (w = _[_p]) || (n = p = 0, _[_p] = w = u("gridcraft-panel-stone", g, `l-al ${r}`, null)), a = w[Oo]("__", _), n || (B = O("h3", a, `l-am ${r}`, "Java")), n || (h = O("div", a, `l-an ${r}`, null)), n || (f = O("img", h, `l-ao ${r}`, null)), n || (f.src = Zi), n || (N = O("ol", h, `${r}`, null)), n || (q = O("li", N, `${r}`, "Launch Minecraft (Version 1.17.1+)")), n || (M = O("li", N, `${r}`, 'Click "Multiplayer"')), n || (b = O("li", N, `${r}`, 'Click "Add Server"')), n || (D = O("li", N, `${r}`, 'Enter play.gridcraft.net in the "Server Address" box and click "Done"')), n || !w.setup || w.setup(p), w[io](p), n || g[po](w), S = T = 1, (G = _[op]) || (S = T = 0, _[op] = G = u("gridcraft-panel-stone", g, `l-au ${r}`, null)), H = G[Oo]("__", _), S || (A = O("h3", H, `l-av ${r}`, "Windows 10 / Mobile")), S || (U = O("div", H, `l-aw ${r}`, null)), S || (P = O("img", U, `l-ax ${r}`, null)), S || (P.src = Qi), S || (v = O("ol", U, `${r}`, null)), S || (z = O("li", v, `${r}`, "Launch Minecraft (Mobile / Windows 10)")), S || (R = O("li", v, `${r}`, 'Click "Play"')), S || (p_ = O("li", v, `${r}`, 'Click "Servers"')), S || (r_ = O("li", v, `${r}`, 'Click "Add Server"')), S || (O_ = O("li", v, `${r}`, "Enter anything for the server name, it doesn't matter")), S || (J = O("li", v, `${r}`, 'Enter play.gridcraft.net in the "Server Address" box and click "Save"')), S || (V = O("li", v, `${r}`, 'There will now be a new server at the bottom of your list! Click on it, and then click "Play"')), S || !G.setup || G.setup(T), G[io](T), S || g[po](G), o_ = Z = 1, (F = _[ep]) || (o_ = Z = 0, _[ep] = F = u("gridcraft-panel-stone", g, `l-bg ${r}`, null)), X = F[Oo]("__", _), o_ || (__ = O("h3", X, `${r}`, "Xbox")), o_ || (n_ = O("a", X, `${r}`, null)), o_ || (n_.href = "https://www.youtube.com/watch?v=g8mHvasVHMs"), w_ = s_ = 1, (t_ = _[rp]) || (w_ = s_ = 0, _[rp] = t_ = u("gridcraft-button", n_, `${r}`, "Watch video")), m_ = t_[Oo]("__", _), w_ || !t_.setup || t_.setup(s_), t_[io](s_), w_ || n_[po](t_), o_ || !F.setup || F.setup(Z), F[io](Z), o_ || g[po](F), Y = L = 1, (e_ = _[tp]) || (Y = L = 0, _[tp] = e_ = u("gridcraft-panel-stone", g, `l-bk ${r}`, null)), c_ = e_[Oo]("__", _), Y || (g_ = O("h3", c_, `l-bl ${r}`, "Nintendo Switch")), Y || (i_ = O("a", c_, `${r}`, null)), Y || (i_.href = "https://www.youtube.com/watch?v=zalT_oR1nPM"), W_ = K_ = 1, (E = _[sp]) || (W_ = K_ = 0, _[sp] = E = u("gridcraft-button", i_, `${r}`, "Watch video")), d_ = E[Oo]("__", _), W_ || !E.setup || E.setup(K_), E[io](K_), W_ || i_[po](E), Y || !e_.setup || e_.setup(L), e_[io](L), Y || g[po](e_), u_ = a_ = 1, ($_ = _[Op]) || (u_ = a_ = 0, _[Op] = $_ = u("gridcraft-panel-stone", g, `l-bo ${r}`, null)), x_ = $_[Oo]("__", _), u_ || (l_ = O("h3", x_, `${r}`, "Playstation")), u_ || (D_ = O("a", x_, `${r}`, null)), u_ || (D_.href = "#playstation"), B_ = y_ = 1, (N_ = _[ip]) || (B_ = y_ = 0, _[ip] = N_ = u("gridcraft-button", D_, `${r}`, "Watch video")), S_ = N_[Oo]("__", _), B_ || !N_.setup || N_.setup(y_), N_[io](y_), B_ || D_[po](N_), u_ || !$_.setup || $_.setup(a_), $_[io](a_), u_ || g[po]($_), _[xu](e), _
   }
};
Q("gridcraft-how-to-play", pp, {
   cssns: "l_af",
   cssid: "l-af"
});
var gp = "images/experience-3-LAPCQLZN.png";
var $p = $({
   url: gp,
   type: "image",
   width: 256,
   height: 289,
   toString: function () {
      return this.url
   }
});
var xp = "images/icon-mountaintop-JCEUXXJP.png";
var np = $({
   url: xp,
   type: "image",
   width: 96,
   height: 96,
   toString: function () {
      return this.url
   }
});
var wp = "images/roadmap-bar-UEXBDLTU.png";
var up = $({
   url: wp,
   type: "image",
   width: 124,
   height: 3588,
   toString: function () {
      return this.url
   }
});
var ap = "images/roadmap-bar-mobile-AMZGC3LM.png";
var lp = $({
   url: ap,
   type: "image",
   width: 100,
   height: 6074,
   toString: function () {
      return this.url
   }
});
var mp = "images/logo-gaming-ape-club-CQ6OMW3N.png";
var Wp = $({
   url: mp,
   type: "image",
   width: 196,
   height: 196,
   toString: function () {
      return this.url
   }
});
var dp = "images/logo-jrnyclub-XLKZVMBT.png";
var yp = $({
   url: dp,
   type: "image",
   width: 196,
   height: 196,
   toString: function () {
      return this.url
   }
});
var cp = "images/logo-llamaverse-MEDVJSC4.png";
var Ip = $({
   url: cp,
   type: "image",
   width: 192,
   height: 192,
   toString: function () {
      return this.url
   }
});
var Bp = "images/logo-squishysquad-T2WOTYQP.png";
var Np = $({
   url: Bp,
   type: "image",
   width: 192,
   height: 192,
   toString: function () {
      return this.url
   }
});
var Dp = "images/logo-goobers-T4R3OTDD.png";
var hp = $({
   url: Dp,
   type: "image",
   width: 192,
   height: 192,
   toString: function () {
      return this.url
   }
});
var Kp = "images/logo-cyberkongz-HKO2TZD7.png";
var Sp = $({
   url: Kp,
   type: "image",
   width: 192,
   height: 192,
   toString: function () {
      return this.url
   }
});
var kp = "images/icon-person-B2V7CVVX.png";
var Le = $({
   url: kp,
   type: "image",
   width: 96,
   height: 96,
   toString: function () {
      return this.url
   }
});
var fp = "images/avatar-dnp3-ZU7GSEYM.png";
var Gp = $({
   url: fp,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var Tp = "images/avatar-alec-c-MWOI2IRD.png";
var Mp = $({
   url: Tp,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var vp = "images/avatar-dan-h-5667O2JC.png";
var qp = $({
   url: vp,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var Up = "images/avatar-daniel-s-RWSH2LZO.png";
var Pp = $({
   url: Up,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var bp = "images/avatar-cameron-r-CPLCCPTX.png";
var Rp = $({
   url: bp,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var Ap = "images/avatar-coloredviolet-ZNMUDEKA.png";
var Cp = $({
   url: Ap,
   type: "image",
   width: 225,
   height: 205,
   toString: function () {
      return this.url
   }
});
var Hp = "images/avatar-onionwave-RN5FJU4U.png";
var Lp = $({
   url: Hp,
   type: "image",
   width: 225,
   height: 206,
   toString: function () {
      return this.url
   }
});
var Yp = "images/avatar-pogo-CVDDD2XW.png";
var Ep = $({
   url: Yp,
   type: "image",
   width: 225,
   height: 206,
   toString: function () {
      return this.url
   }
});
var Jp = "images/avatar-sagan-XGSYXOUR.png";
var Xp = $({
   url: Jp,
   type: "image",
   width: 225,
   height: 206,
   toString: function () {
      return this.url
   }
});
var zp = "images/avatar-seth-m-BQLBOVBT.png";
var Vp = $({
   url: zp,
   type: "image",
   width: 225,
   height: 206,
   toString: function () {
      return this.url
   }
});
var Zp = "images/avatar-teamplayer-OGRQ6AMF.png";
var jp = $({
   url: Zp,
   type: "image",
   width: 225,
   height: 206,
   toString: function () {
      return this.url
   }
});
var Qp = "images/avatar-mayor-05-EPC57QEY.png";
var Fp = $({
   url: Qp,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var _g = "images/avatar-david-p-Z7EMNOS2.png";
var og = $({
   url: _g,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var eg = "images/avatar-gijs-QPSHGESK.png";
var rg = $({
   url: eg,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var tg = "images/avatar-josh-m-LJYSUWBJ.png";
var sg = $({
   url: tg,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var Og = "images/avatar-jumi-MFSFN6ZV.png";
var ig = $({
   url: Og,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var pg = "images/avatar-mark-v-RHZDBCPV.png";
var gg = $({
   url: pg,
   type: "image",
   width: 225,
   height: 203,
   toString: function () {
      return this.url
   }
});
var $g = "images/experiance-g-2x-V25V3542.png";
var xg = $({
   url: $g,
   type: "image",
   width: 105,
   height: 122,
   toString: function () {
      return this.url
   }
});
var ng = "images/oe-panel1-5BEHGBMP.png";
var wg = $({
   url: ng,
   type: "image",
   width: 900,
   height: 504,
   toString: function () {
      return this.url
   }
});
var ug = "images/oe-panel2-2EWGQBFU.png";
var ag = $({
   url: ug,
   type: "image",
   width: 1184,
   height: 666,
   toString: function () {
      return this.url
   }
});
var lg = "images/oe-panel3-GG32DSFT.png";
var mg = $({
   url: lg,
   type: "image",
   width: 666,
   height: 454,
   toString: function () {
      return this.url
   }
});
var Wg = "images/oe-panel4-SH3LTGV4.png";
var dg = $({
   url: Wg,
   type: "image",
   width: 3840,
   height: 2160,
   toString: function () {
      return this.url
   }
});
var yg = "images/experience-5-XPLT3SFS.png";
var cg = $({
   url: yg,
   type: "image",
   width: 278,
   height: 180,
   toString: function () {
      return this.url
   }
});
var Ig = "images/experience-6-GFC5LJFH.png";
var Bg = $({
   url: Ig,
   type: "image",
   width: 278,
   height: 180,
   toString: function () {
      return this.url
   }
});
var Ng = "images/cyberkongz-CXZVOK23.png";
var Dg = $({
   url: Ng,
   type: "image",
   width: 287,
   height: 374,
   toString: function () {
      return this.url
   }
});
var hg = "images/llama-arena-OIA6O43Y.png";
var Kg = $({
   url: hg,
   type: "image",
   width: 191,
   height: 377,
   toString: function () {
      return this.url
   }
});
var Sg = "images/squishy-astronaut-4RODKE7V.png";
var kg = $({
   url: Sg,
   type: "image",
   width: 216,
   height: 305,
   toString: function () {
      return this.url
   }
});
var fg = "images/goobers-US6GF7FC.png";
var Gg = $({
   url: fg,
   type: "image",
   width: 244,
   height: 305,
   toString: function () {
      return this.url
   }
});
var Tg = "images/villagers-H3MR4D7D.png";
var Mg = $({
   url: Tg,
   type: "image",
   width: 235,
   height: 355,
   toString: function () {
      return this.url
   }
});
var vg = "images/CameronR-IACBMMPC.png";
var qg = $({
   url: vg,
   type: "image",
   width: 320,
   height: 421,
   toString: function () {
      return this.url
   }
});
var Ug = "images/ColoredViolet-LCMSXP2R.png";
var Pg = $({
   url: Ug,
   type: "image",
   width: 195,
   height: 341,
   toString: function () {
      return this.url
   }
});
var bg = "images/DanielS-5O2TLNRY.png";
var Rg = $({
   url: bg,
   type: "image",
   width: 281,
   height: 366,
   toString: function () {
      return this.url
   }
});
var Ag = "images/DavidP-KS4PA4ZG.png";
var Cg = $({
   url: Ag,
   type: "image",
   width: 243,
   height: 455,
   toString: function () {
      return this.url
   }
});
var Hg = "images/GIJS-INQ2MGQ6.png";
var Lg = $({
   url: Hg,
   type: "image",
   width: 292,
   height: 464,
   toString: function () {
      return this.url
   }
});
var Yg = "images/JoshM-FSN56OHA.png";
var Eg = $({
   url: Yg,
   type: "image",
   width: 281,
   height: 429,
   toString: function () {
      return this.url
   }
});
var Jg = "images/Mayor05-RYYIEO2I.png";
var Xg = $({
   url: Jg,
   type: "image",
   width: 247,
   height: 479,
   toString: function () {
      return this.url
   }
});
var zg = "images/OnionWave-U25EINLB.png";
var Vg = $({
   url: zg,
   type: "image",
   width: 196,
   height: 341,
   toString: function () {
      return this.url
   }
});
var Zg = "images/Pogo-MQ2C25DH.png";
var jg = $({
   url: Zg,
   type: "image",
   width: 294,
   height: 341,
   toString: function () {
      return this.url
   }
});
var Qg = "images/Sagan-KPHNFAPI.png";
var Fg = $({
   url: Qg,
   type: "image",
   width: 294,
   height: 345,
   toString: function () {
      return this.url
   }
});
var _$ = "images/SethM-2LSW664Q.png";
var o$ = $({
   url: _$,
   type: "image",
   width: 320,
   height: 421,
   toString: function () {
      return this.url
   }
});
var e$ = "images/SethM-1-LLXK537U.png";
var r$ = $({
   url: e$,
   type: "image",
   width: 268,
   height: 366,
   toString: function () {
      return this.url
   }
});
var t$ = "images/Teamplayer-I2H7KFWW.png";
var s$ = $({
   url: t$,
   type: "image",
   width: 281,
   height: 502,
   toString: function () {
      return this.url
   }
});
var O$ = "images/NFTLlama-CZHQT4GH.png";
var i$ = $({
   url: O$,
   type: "image",
   width: 336,
   height: 366,
   toString: function () {
      return this.url
   }
});
var p$ = "images/Jumi-VPCU6WRJ.png";
var g$ = $({
   url: p$,
   type: "image",
   width: 336,
   height: 366,
   toString: function () {
      return this.url
   }
});
var $$ = "images/Projecki-OLVYOIUT.png";
var x$ = $({
   url: $$,
   type: "image",
   width: 274,
   height: 366,
   toString: function () {
      return this.url
   }
});
var n$ = "images/MarkV-MLFHOBP6.png";
var w$ = $({
   url: n$,
   type: "image",
   width: 255,
   height: 366,
   toString: function () {
      return this.url
   }
});
var u$ = "images/DNP3-WRRF34TA.png";
var a$ = $({
   url: u$,
   type: "image",
   width: 235,
   height: 366,
   toString: function () {
      return this.url
   }
});

function Ye(s) {
   let _;
   return s && ((_ = s.toIterable) ? _.call(s) : s)
}

function nu(s, _) {
   return Object.defineProperties(s, Object.getOwnPropertyDescriptors(_.prototype)), s
}
var J_, zo = ot(),
   l$ = Symbol(),
   z_, Ee, Vo, Bo, m$ = Symbol(),
   Je, Xe, wu, W$, d$, Ir, uu, au, y$ = Symbol(),
   c$ = Symbol(),
   I$ = Symbol(),
   B$ = Symbol(),
   N$ = Symbol(),
   D$ = Symbol(),
   h$ = Symbol(),
   K$ = Symbol(),
   S$ = Symbol(),
   k$ = Symbol(),
   f$ = Symbol(),
   G$ = Symbol(),
   T$ = Symbol(),
   M$ = Symbol(),
   v$ = Symbol(),
   q$ = Symbol(),
   U$ = Symbol(),
   P$ = Symbol(),
   b$ = Symbol(),
   R$ = Symbol(),
   A$ = Symbol(),
   C$ = Symbol(),
   H$ = Symbol(),
   L$ = Symbol(),
   Y$ = Symbol(),
   E$ = Symbol(),
   J$ = Symbol(),
   X$ = Symbol(),
   z$ = Symbol(),
   V$ = Symbol(),
   Z$ = Symbol(),
   j$ = Symbol(),
   Q$ = Symbol(),
   F$ = Symbol(),
   _x = Symbol(),
   ox = Symbol(),
   ex = Symbol(),
   rx = Symbol(),
   tx = Symbol(),
   sx = Symbol(),
   Ox = Symbol(),
   ix = Symbol(),
   px = Symbol(),
   gx = Symbol(),
   $x = Symbol(),
   xx = Symbol(),
   nx = Symbol(),
   wx = Symbol(),
   ux = Symbol(),
   ax = Symbol(),
   lx = Symbol(),
   mx = Symbol(),
   Wx = Symbol(),
   dx = Symbol(),
   yx = Symbol(),
   cx = Symbol(),
   Ix = Symbol(),
   Bx = Symbol(),
   Nx = Symbol(),
   Dx = Symbol(),
   hx = Symbol(),
   Kx = Symbol(),
   Sx = Symbol(),
   kx = Symbol(),
   fx = Symbol(),
   Gx = Symbol(),
   Tx = Symbol(),
   Mx = Symbol(),
   vx = Symbol(),
   qx = Symbol(),
   Ux = Symbol(),
   Px = Symbol(),
   bx = Symbol(),
   Rx = Symbol(),
   Ax = Symbol(),
   Cx = Symbol(),
   Hx = Symbol(),
   Lx = Symbol(),
   Yx = Symbol(),
   Ex = Symbol(),
   Jx = Symbol(),
   Xx = Symbol(),
   zx = Symbol(),
   Vx = Symbol(),
   Zx = Symbol(),
   jx = Symbol(),
   Qx = Symbol(),
   Fx = Symbol(),
   _n = Symbol(),
   on = Symbol(),
   en = Symbol(),
   rn = Symbol(),
   tn = Symbol(),
   sn = Symbol(),
   On = Symbol(),
   pn = Symbol(),
   gn = Symbol(),
   $n = Symbol(),
   xn = Symbol(),
   nn = Symbol(),
   wn = Symbol(),
   un = Symbol(),
   an = Symbol(),
   ln = Symbol(),
   mn = Symbol(),
   Wn = Symbol(),
   dn = Symbol(),
   yn = Symbol(),
   cn = Symbol(),
   In = Symbol(),
   Bn = Symbol(),
   Nn = Symbol(),
   Dn = Symbol(),
   hn = Symbol(),
   lu = Symbol.for("##up"),
   C = Symbol.for("#getSlot"),
   K = Symbol.for("#afterVisit"),
   k = Symbol.for("#appendChild"),
   go = Symbol.for("#beforeReconcile"),
   Br = Symbol.for("#placeChild"),
   $o = Symbol.for("#afterReconcile");
Uo(), ro(), oo();
z_ = Ee = 1, (J_ = zo[l$]) || (z_ = Ee = 0, J_ = zo[l$] = J_ = u("gridcraft-panel-slate", null, "g-af", null));
z_ || (J_[lu] = zo._);
Vo = J_[C]("__", J_);
Je = Xe = 1, (Bo = J_[m$]) || (Je = Xe = 0, J_[m$] = Bo = u("gridcraft-panel-slate", Vo, "g-ag", "3"));
wu = Bo[C]("__", J_);
Je || !Bo.setup || Bo.setup(Xe);
Bo[K](Xe);
Je || Vo[k](Bo);
z_ || (W$ = O("div", Vo, "g-ah", null));
z_ || (d$ = O("img", W$, "g-ai", null));
z_ || (d$.src = $p);
z_ || (Ir = O("div", Vo, "g-aj", null));
z_ || (uu = O("h3", Ir, "g-ak", "Buy land"));
z_ || (au = O("p", Ir, "g-al", "Make your mark on Grid City by acquiring land! Purchasable with $BITS earned from staking rewards and gameplay, 										only a finite amount of land will ever exist in Grid City."));
z_ || zo.sym || !J_.setup || J_.setup(Ee);
zo.sym || J_[K](Ee);
var Kn = class extends j {
   mount() {
      let _ = globalThis.document.createElement("script");
      return _.setAttribute("src", "js/gridcraft-partners-js.js"), globalThis.document.head.appendChild(_)
   }
};
Q("gridcraft-partners-js", Kn, {});
var Sn = class extends j {
   mount() {
      let _ = globalThis.document.createElement("script");
      return _.setAttribute("src", "js/swiper.js"), _.setAttribute("module", ""), globalThis.document.head.appendChild(_)
   }
};
Q("gridcraft-swiper-js", Sn, {});
var kn = class extends j {
   mount() {
      let _ = globalThis.document.createElement("script");
      return _.setAttribute("src", "js/gridcraft-carousel.js"), _.setAttribute("module", ""), globalThis.document.head.appendChild(_)
   }
};
Q("gridcraft-carousel-js", kn, {});
var fn = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_, k_, M_, G_, v_, q_, T_, h_, R_;
      return _ = this, _[go](), o = e = 1, _[y$] === 1 || (o = e = 0, _[y$] = 1), (!o || e & 2) && _.flagSelf$("g-an"), i = x = 1, (t = _[c$]) || (i = x = 0, _[c$] = t = u("block-bleed-bottom", _, `g-ao ${r}`, null)), i || (t.size = "260px"), i || !t.setup || t.setup(x), t[K](x), i || _[k](t), o || (g = O("div", _, `g-ap ${r}`, null)), o || (w = O("img", g, `g-aq ${r}`, null)), o || (w.src = np), o || (n = O("h2", g, `g-ar text-heading-blue ${r}`, "Roadmap")), o || (p = O("div", _, `g-as ${r}`, null)), o || (a = O("div", p, `${r}`, null)), o || (B = O("div", a, `g-au ${r}`, null)), o || (h = O("img", B, `g-av ${r}`, null)), o || (h.src = up), o || (f = O("img", B, `g-aw ${r}`, null)), o || (f.src = lp), o || (N = O("div", p, `g-ax ${r}`, null)), M = b = 1, (q = _[I$]) || (M = b = 0, _[I$] = q = u("gridcraft-panel-stone", N, `g-ay ${r}`, null)), D = q[C]("__", _), M || (G = O("div", D, `g-az oversized-bg ${r}`, null)), M || (S = O("div", D, `g-ba ${r}`, null)), M || (T = O("h3", S, `${r}`, "Gridcraft IDs Launch")), (H = _[B$]) || (_[B$] = H = O("p", S, `g-bc ${r}`, null)), M || H[Br]("This is the collection of characters generated from a pool of over 2,600 traits. 							Gridcraft Identity holders will receive $BITS, priority to receive Gridcraft Land, and more amazing perks. 							Gridcraft Identites launch will also be carbon neutral! We're collaborating with "), M || (A = O("a", H, `${r}`, "https://native.eco")), M || (A.href = "https://native.eco"), M || H[Br](" to 100% offset carbon emissions caused by our launch."), M || !q.setup || q.setup(b), q[K](b), M || N[k](q), P = v = 1, (U = _[N$]) || (P = v = 0, _[N$] = U = u("gridcraft-panel-stone", N, `g-be ${r}`, null)), z = U[C]("__", _), P || (R = O("div", z, `g-bf oversized-bg right ${r}`, null)), P || (p_ = O("div", z, `g-bg ${r}`, null)), P || (r_ = O("h3", p_, `${r}`, "Grid city and gridcraft land launch")), P || (O_ = O("p", p_, `g-bi ${r}`, "The Grid City will launch, making land available on Gridcraft Network. 						All players can access and explore Grid City, but only Gridcraft Identity holders and their 						friends can take advantage of full modification of land in Grid City.")), P || !U.setup || U.setup(v), U[K](v), P || N[k](U), V = F = 1, (J = _[D$]) || (V = F = 0, _[D$] = J = u("gridcraft-panel-stone", N, `g-bj ${r}`, null)), o_ = J[C]("__", _), V || (Z = O("div", o_, `g-bk oversized-bg ${r}`, null)), V || (X = O("div", o_, `g-bl ${r}`, null)), V || (__ = O("h3", X, `${r}`, "Gaming on gridcraft")), V || (n_ = O("p", X, `g-bn ${r}`, "Gridcraft Studios is developing a suite of both classic and innovative minigames, raids, and missions. These experiences will follow our P&E model, rewarding users for participation and objective completions. We've already developed Grid Game, which is what we've used to host P&E events in the past. You can expect more fun games of the same amazing quality soon.")), V || !J.setup || J.setup(F), J[K](F), V || N[k](J), w_ = s_ = 1, (t_ = _[h$]) || (w_ = s_ = 0, _[h$] = t_ = u("gridcraft-panel-stone", N, `g-bo ${r}`, null)), m_ = t_[C]("__", _), w_ || (e_ = O("div", m_, `g-bp oversized-bg right ${r}`, null)), w_ || (Y = O("div", m_, `g-bq ${r}`, null)), w_ || (L = O("h3", Y, `${r}`, "Marketplace Launch")), w_ || (c_ = O("p", Y, `g-bs ${r}`, "Along with $BITS, players will be able to earn wearables and items through gameplay. 						Wearables include hats, backpacks, and other external character gear. 						Wearables like jetpacks will provide actual functional use, such as the ability to fly in certain games. Other items will be obtainable and tradable as well. 						There will be a comprehensive $BITS marketplace to promote trade on the open market hosted on Gridcraft\u2019s own website.")), w_ || !t_.setup || t_.setup(s_), t_[K](s_), w_ || N[k](t_), i_ = E = 1, (g_ = _[K$]) || (i_ = E = 0, _[K$] = g_ = u("gridcraft-panel-stone", N, `g-bt ${r}`, null)), W_ = g_[C]("__", _), i_ || (K_ = O("div", W_, `g-bu oversized-bg ${r}`, null)), i_ || (d_ = O("div", W_, `g-bv ${r}`, null)), i_ || ($_ = O("h3", d_, `${r}`, "Grid city map")), i_ || (u_ = O("p", d_, `g-bx ${r}`, "Grid City will receive an updated interactive map viewable on desktop and mobile, no download required. 						Opening the updated map webpage will pull up all land plots with listing status, owner, sorting abilities, and thumbnails for plots.")), i_ || !g_.setup || g_.setup(E), g_[K](E), i_ || N[k](g_), x_ = l_ = 1, (a_ = _[S$]) || (x_ = l_ = 0, _[S$] = a_ = u("gridcraft-panel-stone", N, `g-by ${r}`, null)), D_ = a_[C]("__", _), x_ || (N_ = O("div", D_, `g-bz oversized-bg right ${r}`, null)), x_ || (B_ = O("div", D_, `g-ca ${r}`, null)), x_ || (y_ = O("h3", B_, `${r}`, "Gridcraft tournaments")), x_ || (S_ = O("p", B_, `g-cc ${r}`, "Gridcraft will sponsor and host competitive gaming tournaments based on the experiences available to all players on Gridcraft Network. 						There will be different tiers of tournaments, from amateur to professional. 						Additionally, partnered collections will be able to send teams to represent their community in CvC (Collection vs Collection) games. 						Tournament victors are rewarded.")), x_ || !a_.setup || a_.setup(l_), a_[K](l_), x_ || N[k](a_), M_ = G_ = 1, (k_ = _[k$]) || (M_ = G_ = 0, _[k$] = k_ = u("gridcraft-panel-stone", N, `g-cd ${r}`, null)), v_ = k_[C]("__", _), M_ || (q_ = O("div", v_, `g-ce oversized-bg ${r}`, null)), M_ || (T_ = O("div", v_, `g-cf ${r}`, null)), M_ || (h_ = O("h3", T_, `${r}`, "Codename Colony")), M_ || (R_ = O("p", T_, `g-ch ${r}`, "Codename Colony is a secretive project that will provide new content and opportunties to Gridcraft players, 						including, but not limited to, new ways to stake Gridcraft Land and earn.")), M_ || !k_.setup || k_.setup(G_), k_[K](G_), M_ || N[k](k_), _[$o](e), _
   }
};
Q("gridcraft-roadmap", fn, {
   cssns: "g_am"
});
var Gn = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_, k_;
      return _ = this, _[go](), o = e = 1, _[f$] === 1 || (o = e = 0, _[f$] = 1), (!o || e & 2) && _.flagSelf$("g-ci"), i = x = 1, (t = _[G$]) || (i = x = 0, _[G$] = t = u("block-bleed-bottom", _, `g-cj ${r}`, null)), i || (t.size = "260px"), i || !t.setup || t.setup(x), t[K](x), i || _[k](t), o || (g = O("h2", _, `g-ck text-heading-darkblue ${r}`, "Our Partners")), o || (w = O("div", _, `g-cl ${r}`, null)), o || (n = O("a", w, `${r}`, null)), o || (n.href = "https://twitter.com/GamingApeClub"), a = B = 1, (p = _[T$]) || (a = B = 0, _[T$] = p = u("gridcraft-panel-slate", n, `g-cn ${r}`, null)), h = p[C]("__", _), a || (f = O("div", h, `g-co ${r}`, null)), a || (N = O("div", h, `g-cp ${r}`, null)), a || (q = O("img", N, `g-cq ${r}`, null)), a || (q.src = Wp), a || (M = O("h3", N, `g-cr ${r}`, "Gaming Ape Club")), a || !p.setup || p.setup(B), p[K](B), a || n[k](p), o || (b = O("a", w, `${r}`, null)), o || (b.href = "https://twitter.com/JRNYclub"), G = S = 1, (D = _[M$]) || (G = S = 0, _[M$] = D = u("gridcraft-panel-slate", b, `g-ct ${r}`, null)), T = D[C]("__", _), G || (H = O("div", T, `g-cu ${r}`, null)), G || (A = O("div", T, `g-cv ${r}`, null)), G || (U = O("img", A, `g-cw ${r}`, null)), G || (U.src = yp), G || (P = O("h3", A, `g-cx ${r}`, "JRNY Club")), G || !D.setup || D.setup(S), D[K](S), G || b[k](D), o || (v = O("a", w, `${r}`, null)), o || (v.href = "https://twitter.com/Llamaverse_"), R = p_ = 1, (z = _[v$]) || (R = p_ = 0, _[v$] = z = u("gridcraft-panel-slate", v, `g-cz ${r}`, null)), r_ = z[C]("__", _), R || (O_ = O("div", r_, `g-da ${r}`, null)), R || (J = O("div", r_, `g-db ${r}`, null)), R || (V = O("img", J, `g-dc ${r}`, null)), R || (V.src = Ip), R || (F = O("h3", J, `g-dd ${r}`, "Llamaverse")), R || !z.setup || z.setup(p_), z[K](p_), R || v[k](z), o || (o_ = O("a", w, `${r}`, null)), o || (o_.href = "https://twitter.com/SquishySquadNFT"), X = __ = 1, (Z = _[q$]) || (X = __ = 0, _[q$] = Z = u("gridcraft-panel-slate", o_, `g-df ${r}`, null)), n_ = Z[C]("__", _), X || (t_ = O("div", n_, `g-dg ${r}`, null)), X || (w_ = O("div", n_, `g-dh ${r}`, null)), X || (s_ = O("img", w_, `g-di ${r}`, null)), X || (s_.src = Np), X || (m_ = O("h3", w_, `g-dj ${r}`, "Squishy Squad")), X || !Z.setup || Z.setup(__), Z[K](__), X || o_[k](Z), o || (e_ = O("a", w, `${r}`, null)), o || (e_.href = "https://twitter.com/GoobersNFT"), L = c_ = 1, (Y = _[U$]) || (L = c_ = 0, _[U$] = Y = u("gridcraft-panel-slate", e_, `g-dl ${r}`, null)), g_ = Y[C]("__", _), L || (i_ = O("div", g_, `g-dm ${r}`, null)), L || (E = O("div", g_, `g-dn ${r}`, null)), L || (W_ = O("img", E, `g-do ${r}`, null)), L || (W_.src = hp), L || (K_ = O("h3", E, `g-dp ${r}`, "Goobers")), L || !Y.setup || Y.setup(c_), Y[K](c_), L || e_[k](Y), o || (d_ = O("a", w, `${r}`, null)), o || (d_.href = "https://twitter.com/CyberKongz"), u_ = a_ = 1, ($_ = _[P$]) || (u_ = a_ = 0, _[P$] = $_ = u("gridcraft-panel-slate", d_, `g-dr ${r}`, null)), x_ = $_[C]("__", _), u_ || (l_ = O("div", x_, `g-ds ${r}`, null)), u_ || (D_ = O("div", x_, `g-dt ${r}`, null)), u_ || (N_ = O("img", D_, `g-du ${r}`, null)), u_ || (N_.src = Sp), u_ || (B_ = O("h3", D_, `g-dv ${r}`, "CyberKongz")), u_ || !$_.setup || $_.setup(a_), $_[K](a_), u_ || d_[k]($_), o || (y_ = O("div", w, `g-dw ${r}`, null)), o || (S_ = O("div", w, `g-dx ${r}`, null)), o || (k_ = O("div", w, `g-dy ${r}`, null)), _[$o](e), _
   }
};
Q("gridcraft-partners", Gn, {});
var Tn = class extends j {
   set name(_) {
      this.setAttribute("name", _)
   }
   get name() {
      return this.getAttribute("name")
   }
   set image(_) {
      this.setAttribute("image", _)
   }
   get image() {
      return this.getAttribute("image")
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M;
      return _ = this, _[go](), o = e = 1, _[b$] === 1 || (o = e = 0, _[b$] = 1), (!o || e & 2) && _.flagSelf$("g-dz"), i = x = 1, (t = _[R$]) || (i = x = 0, _[R$] = t = u("gridcraft-panel-stone", _, `g-ea ${r}`, null)), g = t[C]("__", _), n = p = 1, (w = _[A$]) || (n = p = 0, _[A$] = w = O("img", g, `g-eb ${r}`, null)), a = this.image, a === _[C$] || (w.src = _[C$] = a), h = f = 1, (B = _[H$]) || (h = f = 0, _[H$] = B = u("gridcraft-panel-slate", g, `g-ec ${r}`, null)), N = B[C]("__", _), (q = _[L$]) || (_[L$] = q = O("h3", N, `g-ed ${r}`, null)), M = this.name, M === _[E$] && h || (_[Y$] = q[Br](_[E$] = M, 384, _[Y$])), h || !B.setup || B.setup(f), B[K](f), h || g[k](B), i || !t.setup || t.setup(x), t[K](x), i || _[k](t), _[$o](e), _
   }
};
Q("gridcraft-team-member", Tn, {});
var Mn = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_, k_, M_, G_, v_, q_, T_, h_, R_, C_, U_, f_, P_, X_, F_;
      return _ = this, _[go](), o = e = 1, _[J$] === 1 || (o = e = 0, _[J$] = 1), (!o || e & 2) && _.flagSelf$("g-ee"), i = x = 1, (t = _[X$]) || (i = x = 0, _[X$] = t = u("block-bleed-bottom", _, `g-ef ${r}`, null)), i || (t.size = "260px"), i || !t.setup || t.setup(x), t[K](x), i || _[k](t), o || (g = O("div", _, `g-eg ${r}`, null)), o || (w = O("img", g, `g-eh ${r}`, null)), o || (w.src = Le), o || (n = O("h2", g, `g-ei text-heading-blue ${r}`, "The Team")), o || (p = O("div", _, `g-ej ${r}`, null)), B = h = 1, (a = _[z$]) || (B = h = 0, _[z$] = a = u("gridcraft-team-member", p, `${r}`, null)), f = Gp, f === _[V$] || (a.image = _[V$] = f), B || (a.name = "DNP3"), B || !a.setup || a.setup(h), a[K](h), B || p[k](a), q = M = 1, (N = _[Z$]) || (q = M = 0, _[Z$] = N = u("gridcraft-team-member", p, `${r}`, null)), b = Mp, b === _[j$] || (N.image = _[j$] = b), q || (N.name = "Alec C"), q || !N.setup || N.setup(M), N[K](M), q || p[k](N), G = S = 1, (D = _[Q$]) || (G = S = 0, _[Q$] = D = u("gridcraft-team-member", p, `${r}`, null)), T = qp, T === _[F$] || (D.image = _[F$] = T), G || (D.name = "Dan H"), G || !D.setup || D.setup(S), D[K](S), G || p[k](D), A = U = 1, (H = _[_x]) || (A = U = 0, _[_x] = H = u("gridcraft-team-member", p, `${r}`, null)), P = Pp, P === _[ox] || (H.image = _[ox] = P), A || (H.name = "Daniel S"), A || !H.setup || H.setup(U), H[K](U), A || p[k](H), z = R = 1, (v = _[ex]) || (z = R = 0, _[ex] = v = u("gridcraft-team-member", p, `${r}`, null)), p_ = Rp, p_ === _[rx] || (v.image = _[rx] = p_), z || (v.name = "Cameron R"), z || !v.setup || v.setup(R), v[K](R), z || p[k](v), O_ = J = 1, (r_ = _[tx]) || (O_ = J = 0, _[tx] = r_ = u("gridcraft-team-member", p, `${r}`, null)), V = Cp, V === _[sx] || (r_.image = _[sx] = V), O_ || (r_.name = "Colored Violet"), O_ || !r_.setup || r_.setup(J), r_[K](J), O_ || p[k](r_), o_ = Z = 1, (F = _[Ox]) || (o_ = Z = 0, _[Ox] = F = u("gridcraft-team-member", p, `${r}`, null)), X = Lp, X === _[ix] || (F.image = _[ix] = X), o_ || (F.name = "Onionwave"), o_ || !F.setup || F.setup(Z), F[K](Z), o_ || p[k](F), n_ = t_ = 1, (__ = _[px]) || (n_ = t_ = 0, _[px] = __ = u("gridcraft-team-member", p, `${r}`, null)), w_ = Ep, w_ === _[gx] || (__.image = _[gx] = w_), n_ || (__.name = "pogo"), n_ || !__.setup || __.setup(t_), __[K](t_), n_ || p[k](__), m_ = e_ = 1, (s_ = _[$x]) || (m_ = e_ = 0, _[$x] = s_ = u("gridcraft-team-member", p, `${r}`, null)), Y = Xp, Y === _[xx] || (s_.image = _[xx] = Y), m_ || (s_.name = "Sagan"), m_ || !s_.setup || s_.setup(e_), s_[K](e_), m_ || p[k](s_), c_ = g_ = 1, (L = _[nx]) || (c_ = g_ = 0, _[nx] = L = u("gridcraft-team-member", p, `${r}`, null)), i_ = Vp, i_ === _[wx] || (L.image = _[wx] = i_), c_ || (L.name = "Seth M"), c_ || !L.setup || L.setup(g_), L[K](g_), c_ || p[k](L), W_ = K_ = 1, (E = _[ux]) || (W_ = K_ = 0, _[ux] = E = u("gridcraft-team-member", p, `${r}`, null)), d_ = jp, d_ === _[ax] || (E.image = _[ax] = d_), W_ || (E.name = "Team Player"), W_ || !E.setup || E.setup(K_), E[K](K_), W_ || p[k](E), u_ = a_ = 1, ($_ = _[lx]) || (u_ = a_ = 0, _[lx] = $_ = u("gridcraft-team-member", p, `${r}`, null)), x_ = Fp, x_ === _[mx] || ($_.image = _[mx] = x_), u_ || ($_.name = "Mayor 05"), u_ || !$_.setup || $_.setup(a_), $_[K](a_), u_ || p[k]($_), D_ = N_ = 1, (l_ = _[Wx]) || (D_ = N_ = 0, _[Wx] = l_ = u("gridcraft-team-member", p, `${r}`, null)), B_ = og, B_ === _[dx] || (l_.image = _[dx] = B_), D_ || (l_.name = "David P"), D_ || !l_.setup || l_.setup(N_), l_[K](N_), D_ || p[k](l_), S_ = k_ = 1, (y_ = _[yx]) || (S_ = k_ = 0, _[yx] = y_ = u("gridcraft-team-member", p, `${r}`, null)), M_ = rg, M_ === _[cx] || (y_.image = _[cx] = M_), S_ || (y_.name = "GIJS"), S_ || !y_.setup || y_.setup(k_), y_[K](k_), S_ || p[k](y_), v_ = q_ = 1, (G_ = _[Ix]) || (v_ = q_ = 0, _[Ix] = G_ = u("gridcraft-team-member", p, `${r}`, null)), T_ = sg, T_ === _[Bx] || (G_.image = _[Bx] = T_), v_ || (G_.name = "Josh M"), v_ || !G_.setup || G_.setup(q_), G_[K](q_), v_ || p[k](G_), R_ = C_ = 1, (h_ = _[Nx]) || (R_ = C_ = 0, _[Nx] = h_ = u("gridcraft-team-member", p, `${r}`, null)), U_ = ig, U_ === _[Dx] || (h_.image = _[Dx] = U_), R_ || (h_.name = "Jumi"), R_ || !h_.setup || h_.setup(C_), h_[K](C_), R_ || p[k](h_), P_ = X_ = 1, (f_ = _[hx]) || (P_ = X_ = 0, _[hx] = f_ = u("gridcraft-team-member", p, `${r}`, null)), F_ = gg, F_ === _[Kx] || (f_.image = _[Kx] = F_), P_ || (f_.name = "Mark V"), P_ || !f_.setup || f_.setup(X_), f_[K](X_), P_ || p[k](f_), _[$o](e), _
   }
};
Q("gridcraft-team", Mn, {});
var vn = class extends j {
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_, k_, M_, G_, v_, q_, T_, h_, R_, C_, U_, f_, P_, X_, F_, No, Do, V_;
      return _ = this, _[go](), o = e = 1, _[Sx] === 1 || (o = e = 0, _[Sx] = 1), (!o || e & 2) && _.flagSelf$("g-fb"), o || (t = O("div", _, `g-fc ${r}`, null)), o || (i = O("img", t, `g-fd ${r}`, null)), o || (i.src = xg), o || (x = O("h2", t, `g-fe text-heading-blue ${r}`, "Experience Gridcraft")), o || (g = O("div", _, `g-ff ${r}`, null)), n = p = 1, (w = _[kx]) || (n = p = 0, _[kx] = w = u("gridcraft-panel-cyan", g, `g-fg ${r}`, null)), a = w[C]("__", _), h = f = 1, (B = _[fx]) || (h = f = 0, _[fx] = B = u("gridcraft-circle-green", a, `g-fh ${r}`, "1")), N = B[C]("__", _), h || !B.setup || B.setup(f), B[K](f), h || a[k](B), n || (q = O("div", a, `g-fi ${r}`, null)), n || (M = O("img", q, `g-fj ${r}`, null)), n || (M.src = wg), n || (b = O("div", a, `g-fk ${r}`, null)), n || (D = O("h3", b, `g-fl ${r}`, "Find your identity")), n || (G = O("p", b, `g-fm ${r}`, "Identities are one of the most diverse collections ever created with 4 species Humans, Apes, Zombies, Aliens \u2013 and over 2,600 traits.")), n || !w.setup || w.setup(p), w[K](p), n || g[k](w), T = H = 1, (S = _[Gx]) || (T = H = 0, _[Gx] = S = u("gridcraft-panel-cyan", g, `g-fn ${r}`, null)), A = S[C]("__", _), P = v = 1, (U = _[Tx]) || (P = v = 0, _[Tx] = U = u("gridcraft-circle-green", A, `g-fo ${r}`, "2")), z = U[C]("__", _), P || !U.setup || U.setup(v), U[K](v), P || A[k](U), T || (R = O("img", A, `g-fp ${r}`, null)), T || (R.src = ag), T || (p_ = O("div", A, `g-fq ${r}`, null)), T || (r_ = O("h3", p_, `g-fr ${r}`, "Earn bits by playing")), T || (O_ = O("p", p_, `g-fs ${r}`, "Play & Earn is core to the Gridcraft experience. Engage in entertaining content while earning $BITS and cosmetics to customize your identity.")), T || !S.setup || S.setup(H), S[K](H), T || g[k](S), V = F = 1, (J = _[Mx]) || (V = F = 0, _[Mx] = J = u("gridcraft-panel-cyan", g, `g-ft ${r}`, null)), o_ = J[C]("__", _), X = __ = 1, (Z = _[vx]) || (X = __ = 0, _[vx] = Z = u("gridcraft-circle-green", o_, `g-fu ${r}`, "3")), n_ = Z[C]("__", _), X || !Z.setup || Z.setup(__), Z[K](__), X || o_[k](Z), V || (t_ = O("div", o_, `g-fv ${r}`, null)), V || (w_ = O("img", t_, `g-fw ${r}`, null)), V || (w_.src = mg), V || (s_ = O("div", o_, `g-fx ${r}`, null)), V || (m_ = O("h3", s_, `g-fy ${r}`, "Buy land")), V || (e_ = O("p", s_, `g-fz ${r}`, "Make your mark on Grid City by acquiring land! Purchasable with $BITS earned from staking rewards and gameplay, 										only a finite amount of land will ever exist in Grid City.")), V || !J.setup || J.setup(F), J[K](F), V || g[k](J), L = c_ = 1, (Y = _[qx]) || (L = c_ = 0, _[qx] = Y = u("gridcraft-panel-cyan", g, `g-ga ${r}`, null)), g_ = Y[C]("__", _), E = W_ = 1, (i_ = _[Ux]) || (E = W_ = 0, _[Ux] = i_ = u("gridcraft-circle-green", g_, `g-gb ${r}`, "4")), K_ = i_[C]("__", _), E || !i_.setup || i_.setup(W_), i_[K](W_), E || g_[k](i_), L || (d_ = O("img", g_, `g-gc ${r}`, null)), L || (d_.src = dg), L || ($_ = O("div", g_, `g-gd ${r}`, null)), L || (u_ = O("h3", $_, `g-ge ${r}`, "Build your world")), L || (a_ = O("p", $_, `g-gf ${r}`, "Partner up with friends to add value to your land. Build an art gallery to showcase your NFTs, condos to rent out to tenants, 										and spectacular builds to resell on the open market.")), L || !Y.setup || Y.setup(c_), Y[K](c_), L || g[k](Y), l_ = D_ = 1, (x_ = _[Px]) || (l_ = D_ = 0, _[Px] = x_ = u("gridcraft-panel-cyan", g, `g-gg ${r}`, null)), N_ = x_[C]("__", _), y_ = S_ = 1, (B_ = _[bx]) || (y_ = S_ = 0, _[bx] = B_ = u("gridcraft-circle-green", N_, `g-gh ${r}`, "5")), k_ = B_[C]("__", _), y_ || !B_.setup || B_.setup(S_), B_[K](S_), y_ || N_[k](B_), l_ || (M_ = O("img", N_, `${r}`, null)), l_ || (M_.src = cg), l_ || (G_ = O("div", N_, `g-gj ${r}`, null)), l_ || (v_ = O("h3", G_, `g-gk ${r}`, "Compete in PVP events")), l_ || (q_ = O("p", G_, `g-gl ${r}`, "Take part in competitive Esport events and Collection vs Collection tournament gameplay 										for even more exclusive rewards and honor for your community.")), l_ || !x_.setup || x_.setup(D_), x_[K](D_), l_ || g[k](x_), h_ = R_ = 1, (T_ = _[Rx]) || (h_ = R_ = 0, _[Rx] = T_ = u("gridcraft-panel-cyan", g, `g-gm ${r}`, null)), C_ = T_[C]("__", _), f_ = P_ = 1, (U_ = _[Ax]) || (f_ = P_ = 0, _[Ax] = U_ = u("gridcraft-circle-green", C_, `g-gn ${r}`, "6")), X_ = U_[C]("__", _), f_ || !U_.setup || U_.setup(P_), U_[K](P_), f_ || C_[k](U_), h_ || (F_ = O("img", C_, `g-go ${r}`, null)), h_ || (F_.src = Bg), h_ || (No = O("div", C_, `g-gp ${r}`, null)), h_ || (Do = O("h3", No, `g-gq ${r}`, "Shop in the marketplace")), h_ || (V_ = O("p", No, `g-gr ${r}`, "Utilize $BITS earned via gameplay to trade for rare cosmetic and functional items like hats, backpacks, jetpacks, cars, and more.")), h_ || !T_.setup || T_.setup(R_), T_[K](R_), h_ || g[k](T_), _[$o](e), _
   }
};
Q("gridcraft-experience", vn, {});
var qn = class extends j {
   pNextHandler(_) {
      let o = globalThis.document.querySelectorAll(".partners-container > div"),
         e = globalThis.document.querySelector(".partners-container > div.active");
      for (let r = 0, t = Ye(o), i = t.length; r < i; r++) t[r].classList.remove("active");
      return e.nextElementSibling ? e.nextElementSibling.classList.add("active") : o[0].classList.add("active")
   }
   pPrevHandler(_) {
      let o = globalThis.document.querySelectorAll(".partners-container > div"),
         e = globalThis.document.querySelector(".partners-container > div.active");
      for (let r = 0, t = Ye(o), i = t.length; r < i; r++) t[r].classList.remove("active");
      return e.previousElementSibling ? e.previousElementSibling.classList.add("active") : o[o.length - 1].classList.add("active")
   }
   render() {
      var _ = this,
         o, e, r, t = this._ns_ || "",
         i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_;
      return o = this, o[go](), e = r = 1, o[Cx] === 1 || (e = r = 0, o[Cx] = 1), (!e || r & 2) && o.flagSelf$("g-gt"), e || (i = O("div", o, `g-gu swiper ${t}`, null)), e || (x = O("div", i, `g-gv ${t}`, null)), e || (g = O("div", x, `g-gw ${t}`, null)), e || (w = O("img", g, `g-gx ${t}`, null)), e || (w.src = Le), e || (n = O("h2", g, `g-gy ${t}`, "Our partners")), e || (p = O("div", x, `g-gz team-header-content ${t}`, null)), e || (a = O("div", p, `g-ha team-controls ${t}`, null)), e || (B = O("p", a, `g-hb ${t}`, "Hover over each partner to learn more about them!")), e || (h = O("span", a, `prev ${t}`, null)), e || h.on$("click", {
         $_: [function (g_, i_) {
            return _.pPrevHandler(g_)
         }]
      }, this), N = q = 1, (f = o[Hx]) || (N = q = 0, o[Hx] = f = O("span", a, `next ${t}`, null)), M = o[Lx] || (o[Lx] = {
         $_: [function (g_, i_, E) {
            return E.pNextHandler(g_)
         }, null]
      }), M.$_[1] = _, N || f.on$("click", M, this), e || (b = O("div", i, `g-he partners-container team-container ${t}`, null)), e || (D = O("div", b, `active ${t}`, null)), S = T = 1, (G = o[Yx]) || (S = T = 0, o[Yx] = G = u("gridcraft-panel-slate-small", D, `${t}`, "CyberKongz")), H = G[C]("__", o), S || !G.setup || G.setup(T), G[K](T), S || D[k](G), e || (A = O("img", D, `g-hh cyberkongz-avatar ${t}`, null)), e || (A.src = Dg), e || (U = O("div", b, `active ${t}`, null)), v = z = 1, (P = o[Ex]) || (v = z = 0, o[Ex] = P = u("gridcraft-panel-slate-small", U, `${t}`, "Llamascape")), R = P[C]("__", o), v || !P.setup || P.setup(z), P[K](z), v || U[k](P), e || (p_ = O("img", U, `g-hk llama-avatar ${t}`, null)), e || (p_.src = Kg), e || (r_ = O("div", b, `active ${t}`, null)), J = V = 1, (O_ = o[Jx]) || (J = V = 0, o[Jx] = O_ = u("gridcraft-panel-slate-small", r_, `${t}`, "Squishy Squad")), F = O_[C]("__", o), J || !O_.setup || O_.setup(V), O_[K](V), J || r_[k](O_), e || (o_ = O("img", r_, `g-hn squishy-avatar ${t}`, null)), e || (o_.src = kg), e || (Z = O("div", b, `active ${t}`, null)), __ = n_ = 1, (X = o[Xx]) || (__ = n_ = 0, o[Xx] = X = u("gridcraft-panel-slate-small", Z, `${t}`, "The Goobers")), t_ = X[C]("__", o), __ || !X.setup || X.setup(n_), X[K](n_), __ || Z[k](X), e || (w_ = O("img", Z, `g-hq goobers-avatar ${t}`, null)), e || (w_.src = Gg), e || (s_ = O("div", b, `active ${t}`, null)), e_ = Y = 1, (m_ = o[zx]) || (e_ = Y = 0, o[zx] = m_ = u("gridcraft-panel-slate-small", s_, `${t}`, "JRNY Club")), L = m_[C]("__", o), e_ || !m_.setup || m_.setup(Y), m_[K](Y), e_ || s_[k](m_), e || (c_ = O("img", s_, `g-ht villagers-avatar ${t}`, null)), e || (c_.src = Mg), o[$o](r), o
   }
};
Q("gridcraft-partners-variant", qn, {
   cssns: "g_gs"
});
var Un = class extends j {
   nextHandler(_) {
      let o = globalThis.document.querySelectorAll(".ourteamContainer > div"),
         e = globalThis.document.querySelector(".ourteamContainer > div.active");
      for (let r = 0, t = Ye(o), i = t.length; r < i; r++) t[r].classList.remove("active");
      return e.nextElementSibling ? e.nextElementSibling.classList.add("active") : o[0].classList.add("active")
   }
   prevHandler(_) {
      let o = globalThis.document.querySelectorAll(".ourteamContainer > div"),
         e = globalThis.document.querySelector(".ourteamContainer > div.active");
      for (let r = 0, t = Ye(o), i = t.length; r < i; r++) t[r].classList.remove("active");
      return e.previousElementSibling ? e.previousElementSibling.classList.add("active") : o[o.length - 1].classList.add("active")
   }
   render() {
      var _ = this,
         o, e, r, t = this._ns_ || "",
         i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_, J, V, F, o_, Z, X, __, n_, t_, w_, s_, m_, e_, Y, L, c_, g_, i_, E, W_, K_, d_, $_, u_, a_, x_, l_, D_, N_, B_, y_, S_, k_, M_, G_, v_, q_, T_, h_, R_, C_, U_, f_, P_, X_, F_, No, Do, V_, Zo, jo, bn, Nr, Qo, xo, Fo, _e, Rn, Dr, oe, no, ee, re, An, hr, te, wo, se, Oe, Cn, Kr, ie, uo, pe, ge, Hn, Sr, $e, ao, xe, ne, Ln, kr, we, lo, ue, ae, Yn, fr, le, mo, me, We, En, Gr;
      return o = this, o[go](), e = r = 1, o[Vx] === 1 || (e = r = 0, o[Vx] = 1), (!e || r & 2) && o.flagSelf$("g-hv"), e || (i = O("div", o, `g-hw team-wrapper ${t}`, null)), e || (x = O("div", i, `g-hx ${t}`, null)), e || (g = O("div", x, `g-hy ${t}`, null)), e || (w = O("img", g, `g-hz icon ${t}`, null)), e || (w.src = Le), e || (n = O("h2", g, `g-ia ${t}`, "The team")), e || (p = O("div", x, `g-ib team-header-content ${t}`, null)), e || (a = O("div", p, `g-ic team-controls ${t}`, null)), e || (B = O("p", a, `g-id ${t}`, "Hover over each team member to learn more about them!")), e || (h = O("span", a, `prev ${t}`, null)), e || h.on$("click", {
         $_: [function (ze, Jn) {
            return _.prevHandler(ze)
         }]
      }, this), N = q = 1, (f = o[Zx]) || (N = q = 0, o[Zx] = f = O("span", a, `next ${t}`, null)), M = o[jx] || (o[jx] = {
         $_: [function (ze, Jn, Xn) {
            return Xn.nextHandler(ze)
         }, null]
      }), M.$_[1] = _, N || f.on$("click", M, this), e || (b = O("div", i, `g-ig floor ${t}`, null)), e || (D = O("div", i, `g-ih ourteamContainer ${t}`, null)), e || (G = O("div", D, `g-ii ${t}`, null)), T = H = 1, (S = o[Qx]) || (T = H = 0, o[Qx] = S = u("gridcraft-panel-slate-small", G, `${t}`, "Cameron R")), A = S[C]("__", o), T || !S.setup || S.setup(H), S[K](H), T || G[k](S), e || (U = O("img", G, `g-ik non-hover-img ${t}`, null)), e || (U.src = qg), e || (P = O("div", D, `g-il ${t}`, null)), z = R = 1, (v = o[Fx]) || (z = R = 0, o[Fx] = v = u("gridcraft-panel-slate-small", P, `${t}`, "Colored Violet")), p_ = v[C]("__", o), z || !v.setup || v.setup(R), v[K](R), z || P[k](v), e || (r_ = O("img", P, `g-in non-hover-img ${t}`, null)), e || (r_.src = Pg), e || (O_ = O("div", D, `g-io ${t}`, null)), V = F = 1, (J = o[_n]) || (V = F = 0, o[_n] = J = u("gridcraft-panel-slate-small", O_, `${t}`, "Daniel S")), o_ = J[C]("__", o), V || !J.setup || J.setup(F), J[K](F), V || O_[k](J), e || (Z = O("img", O_, `g-iq non-hover-img ${t}`, null)), e || (Z.src = Rg), e || (X = O("div", D, `g-ir ${t}`, null)), n_ = t_ = 1, (__ = o[on]) || (n_ = t_ = 0, o[on] = __ = u("gridcraft-panel-slate-small", X, `${t}`, "David P")), w_ = __[C]("__", o), n_ || !__.setup || __.setup(t_), __[K](t_), n_ || X[k](__), e || (s_ = O("img", X, `g-it non-hover-img ${t}`, null)), e || (s_.src = Cg), e || (m_ = O("div", D, `g-iu ${t}`, null)), Y = L = 1, (e_ = o[en]) || (Y = L = 0, o[en] = e_ = u("gridcraft-panel-slate-small", m_, `${t}`, "Gijs dJ")), c_ = e_[C]("__", o), Y || !e_.setup || e_.setup(L), e_[K](L), Y || m_[k](e_), e || (g_ = O("img", m_, `g-iw non-hover-img ${t}`, null)), e || (g_.src = Lg), e || (i_ = O("div", D, `g-ix ${t}`, null)), W_ = K_ = 1, (E = o[rn]) || (W_ = K_ = 0, o[rn] = E = u("gridcraft-panel-slate-small", i_, `${t}`, "Josh M")), d_ = E[C]("__", o), W_ || !E.setup || E.setup(K_), E[K](K_), W_ || i_[k](E), e || ($_ = O("img", i_, `g-iz non-hover-img ${t}`, null)), e || ($_.src = Eg), e || (u_ = O("div", D, `g-ja ${t}`, null)), x_ = l_ = 1, (a_ = o[tn]) || (x_ = l_ = 0, o[tn] = a_ = u("gridcraft-panel-slate-small", u_, `${t}`, "Mayor 05")), D_ = a_[C]("__", o), x_ || !a_.setup || a_.setup(l_), a_[K](l_), x_ || u_[k](a_), e || (N_ = O("img", u_, `g-jc non-hover-img ${t}`, null)), e || (N_.src = Xg), e || (B_ = O("div", D, `g-jd ${t}`, null)), S_ = k_ = 1, (y_ = o[sn]) || (S_ = k_ = 0, o[sn] = y_ = u("gridcraft-panel-slate-small", B_, `${t}`, "Onionwave")), M_ = y_[C]("__", o), S_ || !y_.setup || y_.setup(k_), y_[K](k_), S_ || B_[k](y_), e || (G_ = O("img", B_, `g-jf non-hover-img ${t}`, null)), e || (G_.src = Vg), e || (v_ = O("div", D, `g-jg ${t}`, null)), T_ = h_ = 1, (q_ = o[On]) || (T_ = h_ = 0, o[On] = q_ = u("gridcraft-panel-slate-small", v_, `${t}`, "Pogo")), R_ = q_[C]("__", o), T_ || !q_.setup || q_.setup(h_), q_[K](h_), T_ || v_[k](q_), e || (C_ = O("img", v_, `g-ji non-hover-img ${t}`, null)), e || (C_.src = jg), e || (U_ = O("div", D, `g-jj ${t}`, null)), P_ = X_ = 1, (f_ = o[pn]) || (P_ = X_ = 0, o[pn] = f_ = u("gridcraft-panel-slate-small", U_, `${t}`, "Sagan")), F_ = f_[C]("__", o), P_ || !f_.setup || f_.setup(X_), f_[K](X_), P_ || U_[k](f_), e || (No = O("img", U_, `g-jl non-hover-img ${t}`, null)), e || (No.src = Fg), e || (Do = O("div", D, `g-jm ${t}`, null)), Zo = jo = 1, (V_ = o[gn]) || (Zo = jo = 0, o[gn] = V_ = u("gridcraft-panel-slate-small", Do, `${t}`, "Seth M")), bn = V_[C]("__", o), Zo || !V_.setup || V_.setup(jo), V_[K](jo), Zo || Do[k](V_), e || (Nr = O("img", Do, `g-jo non-hover-img ${t}`, null)), e || (Nr.src = o$), e || (Qo = O("div", D, `g-jp ${t}`, null)), Fo = _e = 1, (xo = o[$n]) || (Fo = _e = 0, o[$n] = xo = u("gridcraft-panel-slate-small", Qo, `${t}`, "DanHues")), Rn = xo[C]("__", o), Fo || !xo.setup || xo.setup(_e), xo[K](_e), Fo || Qo[k](xo), e || (Dr = O("img", Qo, `g-jr non-hover-img ${t}`, null)), e || (Dr.src = r$), e || (oe = O("div", D, `g-js ${t}`, null)), ee = re = 1, (no = o[xn]) || (ee = re = 0, o[xn] = no = u("gridcraft-panel-slate-small", oe, `${t}`, "Team Player")), An = no[C]("__", o), ee || !no.setup || no.setup(re), no[K](re), ee || oe[k](no), e || (hr = O("img", oe, `g-ju non-hover-img ${t}`, null)), e || (hr.src = s$), e || (te = O("div", D, `g-jv ${t}`, null)), se = Oe = 1, (wo = o[nn]) || (se = Oe = 0, o[nn] = wo = u("gridcraft-panel-slate-small", te, `${t}`, "NFTLlama")), Cn = wo[C]("__", o), se || !wo.setup || wo.setup(Oe), wo[K](Oe), se || te[k](wo), e || (Kr = O("img", te, `g-jx non-hover-img ${t}`, null)), e || (Kr.src = i$), e || (ie = O("div", D, `g-jy ${t}`, null)), pe = ge = 1, (uo = o[wn]) || (pe = ge = 0, o[wn] = uo = u("gridcraft-panel-slate-small", ie, `${t}`, "Jumi")), Hn = uo[C]("__", o), pe || !uo.setup || uo.setup(ge), uo[K](ge), pe || ie[k](uo), e || (Sr = O("img", ie, `g-ka non-hover-img ${t}`, null)), e || (Sr.src = g$), e || ($e = O("div", D, `g-kb ${t}`, null)), xe = ne = 1, (ao = o[un]) || (xe = ne = 0, o[un] = ao = u("gridcraft-panel-slate-small", $e, `${t}`, "Projecki")), Ln = ao[C]("__", o), xe || !ao.setup || ao.setup(ne), ao[K](ne), xe || $e[k](ao), e || (kr = O("img", $e, `g-kd non-hover-img ${t}`, null)), e || (kr.src = x$), e || (we = O("div", D, `g-ke ${t}`, null)), ue = ae = 1, (lo = o[an]) || (ue = ae = 0, o[an] = lo = u("gridcraft-panel-slate-small", we, `${t}`, "Mark V")), Yn = lo[C]("__", o), ue || !lo.setup || lo.setup(ae), lo[K](ae), ue || we[k](lo), e || (fr = O("img", we, `g-kg non-hover-img ${t}`, null)), e || (fr.src = w$), e || (le = O("div", D, `g-kh active ${t}`, null)), me = We = 1, (mo = o[ln]) || (me = We = 0, o[ln] = mo = u("gridcraft-panel-slate-small", le, `${t}`, "DNP3")), En = mo[C]("__", o), me || !mo.setup || mo.setup(We), mo[K](We), me || le[k](mo), e || (Gr = O("img", le, `g-kj non-hover-img ${t}`, null)), e || (Gr.src = a$), o[$o](r), o
   }
};
Q("gridcraft-team-variant", Un, {
   cssns: "g_hu"
});
var Pn = class extends vo("body", "HTMLBodyElement", j) {
   static create$() {
      return nu(globalThis.document.createElement("body"), this)
   }
   render() {
      var _, o, e, r = this._ns_ || "",
         t, i, x, g, w, n, p, a, B, h, f, N, q, M, b, D, G, S, T, H, A, U, P, v, z, R, p_, r_, O_;
      return _ = this, _[go](), o = e = 1, _[mn] === 1 || (o = e = 0, _[mn] = 1), i = x = 1, (t = _[Wn]) || (i = x = 0, _[Wn] = t = u("gridcraft-hero", _, `${r}`, null)), i || !t.setup || t.setup(x), t[K](x), i || _[k](t), o || (g = O("div", _, `g-km ${r}`, null)), n = p = 1, (w = _[dn]) || (n = p = 0, _[dn] = w = u("block-bleed-top", g, `g-kn ${r}`, null)), n || !w.setup || w.setup(p), w[K](p), n || g[k](w), o || (a = O("div", g, `g-ko ${r}`, null)), h = f = 1, (B = _[yn]) || (h = f = 0, _[yn] = B = u("gridcraft-avatar-gallery", a, `${r}`, null)), h || (B.id = "avatarGallery"), h || !B.setup || B.setup(f), B[K](f), h || a[k](B), q = M = 1, (N = _[cn]) || (q = M = 0, _[cn] = N = u("gridcraft-experience", a, `g-kq ${r}`, null)), q || !N.setup || N.setup(M), N[K](M), q || a[k](N), D = G = 1, (b = _[In]) || (D = G = 0, _[In] = b = u("gridcraft-roadmap", _, `g-kr ${r}`, null)), D || !b.setup || b.setup(G), b[K](G), D || _[k](b), T = H = 1, (S = _[Bn]) || (T = H = 0, _[Bn] = S = u("gridcraft-partners-variant", _, `g-ks ${r}`, null)), T || !S.setup || S.setup(H), S[K](H), T || _[k](S), U = P = 1, (A = _[Nn]) || (U = P = 0, _[Nn] = A = u("gridcraft-team-variant", _, `g-kt ${r}`, null)), U || !A.setup || A.setup(P), A[K](P), U || _[k](A), z = R = 1, (v = _[Dn]) || (z = R = 0, _[Dn] = v = u("gridcraft-faq", _, `g-ku ${r}`, null)), z || !v.setup || v.setup(R), v[K](R), z || _[k](v), r_ = O_ = 1, (p_ = _[hn]) || (r_ = O_ = 0, _[hn] = p_ = u("gridcraft-footer", _, `g-kv ${r}`, null)), r_ || !p_.setup || p_.setup(O_), p_[K](O_), r_ || _[k](p_), _[$o](e), _
   }
};
Q("landing-page", Pn, {
   extends: "body"
});
//__FOOT__
