var Zs = Symbol.for("#__initor__"),
	Ds = Symbol.for("#__inited__"),
	Is = Symbol.for("#__hooks__"),
	Ls = Symbol.for("#type"),
	nt = Symbol.for("#__listeners__");

function H(s) {
	let t = typeof s;
	if (t == "number") return s;
	if (t == "string") {
		if (/^\d+fps$/.test(s)) return 1e3 / parseFloat(s);
		if (/^([-+]?[\d\.]+)s$/.test(s)) return parseFloat(s) * 1e3;
		if (/^([-+]?[\d\.]+)ms$/.test(s)) return parseFloat(s)
	}
	return null
}

function ot(s, t, e) {
	if (!s) return;
	let r = Object.getOwnPropertyDescriptor(s, t);
	return r || s == e ? r || void 0 : ot(Reflect.getPrototypeOf(s), t, e)
}
var Wt = function(s, t, e) {
	let r, i, n;
	for (;
		(r = e) && (e = e.next);)(i = e.listener) && (e.path && i[e.path] ? n = t ? i[e.path].apply(i, t) : i[e.path]() : n = t ? i.apply(e, t) : i.call(e)), e.times && --e.times <= 0 && (r.next = e.next, e.listener = null)
};

function Et(s, t, e, r) {
	var i;
	let n, o, l;
	return n = s[nt] || (s[nt] = {}), o = n[t] || (n[t] = {}), l = o.tail || (o.tail = o.next = {}), l.listener = e, l.path = r, o.tail = l.next = {}, l
}

function q(s, t, e) {
	let r = Et(s, t, e);
	return r.times = 1, r
}

function Ht(s, t, e, r) {
	let i, n, o = s[nt];
	if (!!o && (i = o[t])) {
		for (;
			(n = i) && (i = i.next);)
			if (i == e || i.listener == e) {
				n.next = i.next, i.listener = null;
				break
			}
	}
}

function I(s, t, e) {
	let r;
	(r = s[nt]) && (r[t] && Wt(t, e, r[t]), r.all && Wt(t, [t, e], r.all))
}

function Tr(s) {
	let t;
	return s && ((t = s.toIterable) ? t.call(s) : s)
}
var qt = Symbol.for("#__init__"),
	Fr = Symbol.for("#__patch__"),
	Rs = Symbol.for("#__initor__"),
	Ks = Symbol.for("#__inited__"),
	Ns = Symbol.for("#__hooks__"),
	Gt = Symbol.for("#schedule"),
	kt = Symbol.for("#frames"),
	lt = Symbol.for("#interval"),
	L = Symbol.for("#stage"),
	B = Symbol.for("#scheduled"),
	ut = Symbol.for("#version"),
	Mr = Symbol.for("#fps"),
	Yt = Symbol.for("#ticker"),
	Zr = globalThis.requestAnimationFrame || function(s) {
		return globalThis.setTimeout(s, 1e3 / 60)
	};
var js = 1 / 60,
	Qt = class {
		[Fr](t = {}) {
			var e;
			(e = t.owner) !== void 0 && (this.owner = e), (e = t.target) !== void 0 && (this.target = e), (e = t.active) !== void 0 && (this.active = e), (e = t.value) !== void 0 && (this.value = e), (e = t.skip) !== void 0 && (this.skip = e), (e = t.last) !== void 0 && (this.last = e)
		}
		constructor(t = null) {
			this[qt](t)
		} [qt](t = null) {
			var e;
			this.owner = t && (e = t.owner) !== void 0 ? e : null, this.target = t && (e = t.target) !== void 0 ? e : null, this.active = t && (e = t.active) !== void 0 ? e : !1, this.value = t && (e = t.value) !== void 0 ? e : void 0, this.skip = t && (e = t.skip) !== void 0 ? e : 0, this.last = t && (e = t.last) !== void 0 ? e : 0
		}
		tick(t, e) {
			return this.last = this.owner[kt], this.target.tick(this, e), 1
		}
		update(t, e) {
			let r = this.active,
				i = t.value;
			return this.value != i && (this.deactivate(), this.value = i), (this.value || r || e) && this.activate(), this
		}
		queue() {
			this.owner.add(this)
		}
		activate() {
			return this.value === !0 ? this.owner.on("commit", this) : this.value === !1 || typeof this.value == "number" && (this.value / (1e3 / 60) <= 2 ? this.owner.on("raf", this) : this[lt] = globalThis.setInterval(this.queue.bind(this), this.value)), this.active = !0, this
		}
		deactivate() {
			return this.value === !0 && this.owner.un("commit", this), this.owner.un("raf", this), this[lt] && (globalThis.clearInterval(this[lt]), this[lt] = null), this.active = !1, this
		}
	},
	zt = class {
		constructor() {
			var t = this;
			this.id = Symbol(), this.queue = [], this.stage = -1, this[L] = -1, this[kt] = 0, this[B] = !1, this[ut] = 0, this.listeners = {}, this.intervals = {}, t.commit = function() {
				return t.add("commit"), t
			}, this[Mr] = 0, t.$promise = null, t.$resolve = null, this[Yt] = function(e) {
				return t[B] = !1, t.tick(e)
			}
		}
		touch() {
			return this[ut]++
		}
		get version() {
			return this[ut]
		}
		add(t, e) {
			return (e || this.queue.indexOf(t) == -1) && this.queue.push(t), this[B] || this[Gt](), this
		}
		get committing\u03A6() {
			return this.queue.indexOf("commit") >= 0
		}
		get syncing\u03A6() {
			return this[L] == 1
		}
		listen(t, e) {
			let r = this.listeners[t],
				i = !r;
			return r || (r = this.listeners[t] = new Set), r.add(e), t == "raf" && i && this.add("raf"), this
		}
		unlisten(t, e) {
			var r;
			let i = this.listeners[t];
			return i && i.delete(e), t == "raf" && i && i.size == 0 && (r = this.listeners.raf, delete this.listeners.raf), this
		}
		on(t, e) {
			return this.listen(t, e)
		}
		un(t, e) {
			return this.unlisten(t, e)
		}
		get promise() {
			var t = this;
			return t.$promise || (t.$promise = new Promise(function(e) {
				return t.$resolve = e
			}))
		}
		tick(t) {
			var e = this;
			let r = this.queue,
				i = this[kt]++;
			if (this.ts || (this.ts = t), this.dt = t - this.ts, this.ts = t, this.queue = [], this[L] = 1, this[ut]++, r.length)
				for (let n = 0, o = Tr(r), l = o.length; n < l; n++) {
					let u = o[n];
					typeof u == "string" && this.listeners[u] ? e.listeners[u].forEach(function(a) {
						if (a.tick instanceof Function) return a.tick(e, u);
						if (a instanceof Function) return a(e, u)
					}) : u instanceof Function ? u(e.dt, e) : u.tick && u.tick(e.dt, e)
				}
			return this[L] = this[B] ? 0 : -1, e.$promise && (e.$resolve(e), e.$promise = e.$resolve = null), e.listeners.raf && e.add("raf"), e
		} [Gt]() {
			return this[B] || (this[B] = !0, this[L] == -1 && (this[L] = 0), Zr(this[Yt])), this
		}
		schedule(t, e) {
			var r, i;
			return e || (e = t[r = this.id] || (t[r] = {
				value: !0
			})), (e[i = this.id] || (e[i] = new Qt({
				owner: this,
				target: t
			}))).update(e, !0)
		}
		unschedule(t, e = {}) {
			e || (e = t[this.id]);
			let r = e && e[this.id];
			return r && r.active && r.deactivate(), this
		}
	},
	w = new zt;

function Ct() {
	return w.add("commit").promise
}

function Dr(s, t) {
	return globalThis.setTimeout(function() {
		s(), Ct()
	}, t)
}

function Ir(s, t) {
	return globalThis.setInterval(function() {
		s(), Ct()
	}, t)
}
var Lr = globalThis.clearInterval,
	Br = globalThis.clearTimeout,
	G = globalThis.imba || (globalThis.imba = {});
G.commit = Ct;
G.setTimeout = Dr;
G.setInterval = Ir;
G.clearInterval = Lr;
G.clearTimeout = Br;
var As = Symbol.for("#__initor__"),
	Us = Symbol.for("#__inited__"),
	Ws = Symbol.for("#__hooks__"),
	Jt = class {
		constructor() {
			this.data = {}
		}
	},
	Xt = new Jt;
var Gs = Symbol.for("#__initor__"),
	Ys = Symbol.for("#__inited__"),
	Qs = Symbol.for("#__hooks__"),
	te = Symbol.for("#__init__"),
	Rr = Symbol.for("#__patch__"),
	ee = Symbol.for("#warned"),
	R = Symbol.for("#asset"),
	ht = class {
		static wrap(t) {
			let e = new ht(t);
			return new Proxy(e, e)
		}
		constructor(t) {
			this.meta = t
		}
		get input() {
			return Xt.inputs[this.meta.input]
		}
		get asset() {
			return globalThis._MF_ ? this.meta : this.input ? this.input.asset : null
		}
		set(t, e, r) {
			return !0
		}
		get(t, e) {
			return this.meta.meta && this.meta.meta[e] != null ? this.meta.meta[e] : this.asset ? e == "absPath" && !this.asset.absPath ? this.asset.url : this.asset[e] : ((this.meta[ee] != !0 ? (this.meta[ee] = !0, !0) : !1) && console.warn("Asset for '" + this.meta.input + "' not found"), e == "valueOf" ? function() {
				return ""
			} : null)
		}
	},
	re = class {
		[Rr](t = {}) {
			var e;
			(e = t.url) !== void 0 && (this.url = e), (e = t.meta) !== void 0 && (this.meta = e)
		}
		constructor(t = null) {
			this[te](t)
		} [te](t = null) {
			this.url = t ? t.url : void 0, this.meta = t ? t.meta : void 0
		}
		adoptNode(t) {
			var e;
			if ((e = this.meta) == null ? void 0 : e.content) {
				for (let r = this.meta.attributes, i = 0, n = Object.keys(r), o = n.length, l, u; i < o; i++) l = n[i], u = r[l], t.setAttribute(l, u);
				t.innerHTML = this.meta.content
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

function K(s) {
	var t, e;
	if (s[R]) return s[R];
	if (s.type == "svg") return s[R] || (s[R] = new re(s));
	if (s.input) {
		let r = globalThis._MF_ && globalThis._MF_[s.input];
		return r && (Object.assign(s, r), s.toString = function() {
			return this.absPath
		}), s[R] || (s[R] = ht.wrap(s))
	}
	return s
}
var se = Symbol.for("#toStringDeopt"),
	Js = Symbol.for("#__initor__"),
	Xs = Symbol.for("#__inited__"),
	ti = Symbol.for("#__hooks__"),
	ie = Symbol.for("#symbols"),
	ne = Symbol.for("#batches"),
	oe = Symbol.for("#extras"),
	le = Symbol.for("#stacks"),
	Ot = class {
		constructor(t) {
			this.dom = t, this.string = ""
		}
		contains(t) {
			return this.dom.classList.contains(t)
		}
		add(t) {
			return this.contains(t) ? this : (this.string += (this.string ? " " : "") + t, this.dom.classList.add(t), this)
		}
		remove(t) {
			if (!this.contains(t)) return this;
			let e = new RegExp("(^|\\s)" + t + "(?=\\s|$)", "g");
			return this.string = this.string.replace(e, ""), this.dom.classList.remove(t), this
		}
		toggle(t, e) {
			return e === void 0 && (e = !this.contains(t)), e ? this.add(t) : this.remove(t)
		}
		incr(t, e = 0) {
			var r = this;
			let i = this.stacks,
				n = i[t] || 0;
			return n < 1 && this.add(t), e > 0 && setTimeout(function() {
				return r.decr(t)
			}, e), i[t] = Math.max(n, 0) + 1
		}
		decr(t) {
			let e = this.stacks,
				r = e[t] || 0;
			return r == 1 && this.remove(t), e[t] = Math.max(r, 1) - 1
		}
		reconcile(t, e) {
			let r = this[ie],
				i = this[ne],
				n = !0;
			if (!r) r = this[ie] = [t], i = this[ne] = [e || ""], this.toString = this.valueOf = this[se];
			else {
				let o = r.indexOf(t),
					l = e || "";
				o == -1 ? (r.push(t), i.push(l)) : i[o] != l ? i[o] = l : n = !1
			}
			n && (this[oe] = " " + i.join(" "), this.sync())
		}
		valueOf() {
			return this.string
		}
		toString() {
			return this.string
		} [se]() {
			return this.string + (this[oe] || "")
		}
		sync() {
			return this.dom.flagSync$()
		}
		get stacks() {
			return this[le] || (this[le] = {})
		}
	};
var at = Symbol.for("#__init__"),
	Kr = Symbol.for("#__patch__"),
	ue = Symbol.for("#__initor__"),
	he = Symbol.for("#__inited__"),
	ae = Symbol.for("#__hooks__"),
	Pt = Symbol.for("#getRenderContext"),
	Nr = Symbol.for("#getDynamicContext"),
	ce = Symbol(),
	Y = {
		context: null
	},
	fe = class {
		[Kr](t = {}) {
			var e;
			(e = t.stack) !== void 0 && (this.stack = e)
		}
		constructor(t = null) {
			this[at](t)
		} [at](t = null) {
			var e;
			this.stack = t && (e = t.stack) !== void 0 ? e : []
		}
		push(t) {
			return this.stack.push(t)
		}
		pop(t) {
			return this.stack.pop()
		}
	},
	ri = new fe,
	Q = class extends Map {
		static[at]() {
			return this.prototype[ue] = ce, this
		}
		constructor(t, e = null) {
			super();
			this._ = t, this.sym = e, this[ue] === ce && (this[ae] && this[ae].inited(this), this[he] && this[he]())
		}
		pop() {
			return Y.context = null
		} [Pt](t) {
			let e = this.get(t);
			return e || this.set(t, e = new Q(this._, t)), Y.context = e
		} [Nr](t, e) {
			return this[Pt](t)[Pt](e)
		}
		run(t) {
			return this.value = t, Y.context == this && (Y.context = null), this.get(t)
		}
		cache(t) {
			return this.set(this.value, t), t
		}
	};
Q[at]();

function me(s, t = Symbol(), e = s) {
	return Y.context = s[t] || (s[t] = new Q(e, t))
}

function z(s, t) {
	let e = Object.getOwnPropertyDescriptors(t);
	return delete e.constructor, Object.defineProperties(s, e), s
}

function jr(s) {
	let t;
	return s && ((t = s.toIterable) ? t.call(s) : s)
}
var ct = Symbol.for("#parent"),
	de = Symbol.for("#closestNode"),
	Vr = Symbol.for("#parentNode"),
	Ar = Symbol.for("#context"),
	pe = Symbol.for("#__init__"),
	ge = Symbol.for("##inited"),
	Tt = Symbol.for("#getRenderContext"),
	Ur = Symbol.for("#getDynamicContext"),
	ye = Symbol.for("#insertChild"),
	J = Symbol.for("#appendChild"),
	Ft = Symbol.for("#replaceChild"),
	$e = Symbol.for("#removeChild"),
	P = Symbol.for("#insertInto"),
	_e = Symbol.for("#insertIntoDeopt"),
	X = Symbol.for("#removeFrom"),
	be = Symbol.for("#removeFromDeopt"),
	N = Symbol.for("#replaceWith"),
	xe = Symbol.for("#replaceWithDeopt"),
	Mt = Symbol.for("#placeholderNode"),
	Wr = Symbol.for("#attachToParent"),
	Hr = Symbol.for("#detachFromParent"),
	qr = Symbol.for("#placeChild"),
	Gr = Symbol.for("#beforeReconcile"),
	Yr = Symbol.for("#afterReconcile"),
	Qr = Symbol.for("#afterVisit"),
	Se = Symbol.for("##parent"),
	zr = Symbol.for("##up"),
	we = Symbol.for("##context"),
	F = Symbol.for("#domNode"),
	ft = Symbol.for("##placeholderNode"),
	ve = Symbol.for("#domDeopt"),
	Jr = Symbol.for("#isRichElement"),
	Ee = Symbol.for("#src"),
	j = Symbol.for("#htmlNodeName"),
	Xr = Symbol.for("#getSlot"),
	ke = Symbol.for("#ImbaElement"),
	Ce = Symbol.for("#cssns"),
	ts = Symbol.for("#cssid"),
	{
		Event: M,
		UIEvent: ui,
		MouseEvent: Oe,
		PointerEvent: hi,
		KeyboardEvent: Pe,
		CustomEvent: mt,
		Node: dt,
		Comment: es,
		Text: rs,
		Element: C,
		HTMLElement: pt,
		HTMLHtmlElement: ai,
		HTMLSelectElement: ci,
		HTMLInputElement: fi,
		HTMLTextAreaElement: mi,
		HTMLButtonElement: di,
		HTMLOptionElement: pi,
		HTMLScriptElement: gi,
		SVGElement: Te,
		DocumentFragment: yi,
		ShadowRoot: $i,
		Document: ss,
		Window: _i,
		customElements: bi
	} = globalThis.window,
	Fe = {};

function Me(s, t, e) {
	if (!s) return e[t] = null;
	if (e[t] !== void 0) return e[t];
	let r = Object.getOwnPropertyDescriptor(s, t);
	return r !== void 0 || s == Te ? e[t] = r || null : Me(Reflect.getPrototypeOf(s), t, e)
}
var Zt = {},
	Dt = {},
	It = {},
	Lt = {};
var is = {
		get(s, t) {
			let e = s,
				r;
			for (; e && r == null;)(e = e[ct]) && (r = e[t]);
			return r
		},
		set(s, t, e) {
			let r = s,
				i;
			for (; r && i == null;) {
				if (ot(r, t, C)) return r[t] = e, !0;
				r = r[ct]
			}
			return !0
		}
	},
	Ze = class {
		get flags() {
			return this.documentElement.flags
		}
	};
z(ss.prototype, Ze.prototype);
var De = class {
	get[ct]() {
		return this[Se] || this.parentNode || this[zr]
	}
	get[de]() {
		return this
	}
	get[Vr]() {
		return this[ct][de]
	}
	get[Ar]() {
		return this[we] || (this[we] = new Proxy(this, is))
	} [pe]() {
		return this
	} [ge]() {
		return this
	} [Tt](t) {
		return me(this, t)
	} [Ur](t, e) {
		return this[Tt](t)[Tt](e)
	} [ye](t, e) {
		return t[P](this, e)
	} [J](t) {
		return t[P](this, null)
	} [Ft](t, e) {
		let r = this[ye](t, e);
		return this[$e](e), r
	} [$e](t) {
		return t[X](this)
	} [P](t, e = null) {
		return e ? t.insertBefore(this, e) : t.appendChild(this), this
	} [_e](t, e) {
		return e ? t.insertBefore(this[F] || this, e) : t.appendChild(this[F] || this), this
	} [X](t) {
		return t.removeChild(this)
	} [be](t) {
		return t.removeChild(this[F] || this)
	} [N](t, e) {
		return e[Ft](t, this)
	} [xe](t, e) {
		return e[Ft](t, this[F] || this)
	}
	get[Mt]() {
		return this[ft] || (this[ft] = globalThis.document.createComment("placeholder"))
	}
	set[Mt](t) {
		let e = this[ft];
		this[ft] = t, e && e != t && e.parentNode && e[N](t)
	} [Wr]() {
		let t = this[F],
			e = t && t.parentNode;
		return t && e && t != this && (this[F] = null, this[P](e, t), t[X](e)), this
	} [Hr]() {
		(this[ve] != !0 ? (this[ve] = !0, !0) : !1) && (this[N] = this[xe], this[X] = this[be], this[P] = this[_e]);
		let t = this[Mt];
		return this.parentNode && t != this && (t[P](this.parentNode, this), this[X](this.parentNode)), this[F] = t, this
	} [qr](t, e, r) {
		let i = typeof t;
		if (i === "undefined" || t === null) {
			if (r && r instanceof es) return r;
			let n = globalThis.document.createComment("");
			return r ? r[N](n, this) : n[P](this, null)
		}
		if (t === r) return t;
		if (i !== "object") {
			let n, o = t;
			return e & 128 && e & 256, r ? r instanceof rs ? (r.textContent = o, r) : (n = globalThis.document.createTextNode(o), r[N](n, this), n) : (this.appendChild(n = globalThis.document.createTextNode(o)), n)
		} else return r ? r[N](t, this) : t[P](this, null)
	}
};
z(dt.prototype, De.prototype);
var Ie = class {
	log(...t) {
		return console.log(...t), this
	}
	emit(t, e, r = {
		bubbles: !0,
		cancelable: !0
	}) {
		e != null && (r.detail = e);
		let i = new mt(t, r),
			n = this.dispatchEvent(i);
		return i
	}
	text$(t) {
		return this.textContent = t, this
	} [Gr]() {
		return this
	} [Yr]() {
		return this
	} [Qr]() {
		this.render && this.render()
	}
	get flags() {
		return this.$flags || (this.$flags = new Ot(this), this.flag$ == C.prototype.flag$ && (this.flags$ext = this.className), this.flagDeopt$()), this.$flags
	}
	flag$(t) {
		let e = this.flags$ns;
		this.className = e ? e + (this.flags$ext = t) : this.flags$ext = t
	}
	flagDeopt$() {
		var t = this;
		this.flag$ = this.flagExt$, t.flagSelf$ = function(e) {
			return t.flagSync$(t.flags$own = e)
		}
	}
	flagExt$(t) {
		return this.flagSync$(this.flags$ext = t)
	}
	flagSelf$(t) {
		return this.flagDeopt$(), this.flagSelf$(t)
	}
	flagSync$() {
		return this.className = (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || "")
	}
	set$(t, e) {
		let r = ot(this, t, C);
		!r || !r.set ? this.setAttribute(t, e) : this[t] = e
	}
	get richValue() {
		return this.value
	}
	set richValue(t) {
		this.value = t
	}
};
z(C.prototype, Ie.prototype);
C.prototype.setns$ = C.prototype.setAttributeNS;
C.prototype[Jr] = !0;

function f(s, t, e, r) {
	let i = globalThis.document.createElement(s);
	return e && (i.className = e), r !== null && i.text$(r), t && t[J] && t[J](i), i
}
var Le = class {
	set$(t, e) {
		var r;
		let i = Fe[r = this.nodeName] || (Fe[r] = {}),
			n = Me(this, t, i);
		!n || !n.set ? this.setAttribute(t, e) : this[t] = e
	}
	flag$(t) {
		let e = this.flags$ns;
		this.setAttribute("class", e ? e + (this.flags$ext = t) : this.flags$ext = t)
	}
	flagSelf$(t) {
		var e = this;
		return e.flag$ = function(r) {
			return e.flagSync$(e.flags$ext = r)
		}, e.flagSelf$ = function(r) {
			return e.flagSync$(e.flags$own = r)
		}, e.flagSelf$(t)
	}
	flagSync$() {
		return this.setAttribute("class", (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || ""))
	}
};
z(Te.prototype, Le.prototype);
var Be = class {
	set src(t) {
		if ((this[Ee] != t ? (this[Ee] = t, !0) : !1) && t) {
			if (t.adoptNode) t.adoptNode(this);
			else if (t.content) {
				for (let e = t.attributes, r = 0, i = Object.keys(e), n = i.length, o, l; r < n; r++) o = i[r], l = e[o], this.setAttribute(o, l);
				this.innerHTML = t.content
			}
		}
	}
};
z(SVGSVGElement.prototype, Be.prototype);

function tt(s, t, e, r, i) {
	let n = globalThis.document.createElementNS("http://www.w3.org/2000/svg", s);
	return e && (n.className.baseVal = e), t && t[J] && t[J](n), r && (n.textContent = r), n
}
var gt = globalThis.navigator,
	ns = gt && gt.vendor || "",
	Re = gt && gt.userAgent || "",
	os = ns.indexOf("Apple") > -1 || Re.indexOf("CriOS") >= 0 || Re.indexOf("FxiOS") >= 0,
	yt = !os,
	Ke = new Map,
	Ne = class extends pt {
		connectedCallback() {
			return yt ? this.parentNode.removeChild(this) : this.parentNode.connectedCallback()
		}
		disconnectedCallback() {
			if (!yt) return this.parentNode.disconnectedCallback()
		}
	};
window.customElements.define("i-hook", Ne);

function ls(s, t) {
	let e = Ke.get(t);
	if (!e) {
		e = {};
		let r = t.prototype,
			i = [r];
		for (;
			(r = r && Object.getPrototypeOf(r)) && r.constructor != s.constructor;) i.unshift(r);
		for (let n = 0, o = jr(i), l = o.length; n < l; n++) {
			let u = o[n],
				a = Object.getOwnPropertyDescriptors(u);
			Object.assign(e, a)
		}
		Ke.set(t, e)
	}
	return e
}

function et(s, t, e, r, i) {
	let n;
	typeof s != "string" && s && s.nodeName && (s = s.nodeName);
	let o = Dt[s] || s;
	if (Zt[s]) {
		let l = Zt[s],
			u = l.prototype[j];
		if (u && yt) n = globalThis.document.createElement(u, {
			is: s
		});
		else if (l.create$ && u) {
			n = globalThis.document.createElement(u), n.setAttribute("is", o);
			let a = ls(n, l);
			Object.defineProperties(n, a), n.__slots = {}, n.appendChild(globalThis.document.createElement("i-hook"))
		} else l.create$ ? (n = l.create$(n), n.__slots = {}) : console.warn("could not create tag " + s)
	} else n = globalThis.document.createElement(Dt[s] || s);
	return n[Se] = t, n[pe](), n[ge](), r !== null && n[Xr]("__").text$(r), (e || n.flags$ns) && n.flag$(e || ""), n
}

function us(s, t) {
	if (It[s]) return It[s];
	if (window[t]) return window[t];
	if (window[s]) return window[s]
}

function je(s, t, e) {
	let r = us(s, t);
	if (!(r == e || r.prototype instanceof e || r.prototype[j])) {
		let n = r.prototype[ke];
		if (!n) {
			n = class extends r {
				constructor() {
					super(...arguments);
					this.__slots = {}, this.__F = 0
				}
			}, r.prototype[ke] = n;
			let o = Object.getOwnPropertyDescriptors(e.prototype);
			Object.defineProperties(n.prototype, o), n.prototype[j] = s
		}
		return n
	}
	return r
}

function Z(s, t, e = {}) {
	It[s] = Lt[s] = t, t.nodeName = s;
	let r = s,
		i = t.prototype;
	if (s.indexOf("-") == -1 && (r = "" + s + "-tag", Dt[s] = r), e.cssns) {
		let n = (i._ns_ || i[Ce] || "") + " " + (e.cssns || "");
		i._ns_ = n.trim() + " ", i[Ce] = e.cssns
	}
	if (e.cssid) {
		let n = (i.flags$ns || "") + " " + e.cssid;
		i[ts] = e.cssid, i.flags$ns = n.trim() + " "
	}
	return i[j] && !e.extends && (e.extends = i[j]), e.extends ? (i[j] = e.extends, Zt[s] = t, yt && window.customElements.define(r, t, {
		extends: e.extends
	})) : window.customElements.define(r, t), t
}
var hs = globalThis.imba || (globalThis.imba = {});
hs.document = globalThis.document;

function as(s) {
	let t;
	return s && ((t = s.toIterable) ? t.call(s) : s)
}
var $t = Symbol.for("#__init__"),
	cs = Symbol.for("#__patch__"),
	fs = Symbol.for("##inited"),
	ms = Symbol.for("#afterVisit"),
	ds = Symbol.for("#beforeReconcile"),
	ps = Symbol.for("#afterReconcile"),
	Bt = Symbol.for("#count"),
	Ve = Symbol.for("#__hooks__"),
	V = Symbol.for("#autorender"),
	gs = new class {
		[cs](s = {}) {
			var t;
			(t = s.items) !== void 0 && (this.items = t), (t = s.current) !== void 0 && (this.current = t), (t = s.lastQueued) !== void 0 && (this.lastQueued = t), (t = s.tests) !== void 0 && (this.tests = t)
		}
		constructor(s = null) {
			this[$t](s)
		} [$t](s = null) {
			var t;
			this.items = s && (t = s.items) !== void 0 ? t : [], this.current = s && (t = s.current) !== void 0 ? t : null, this.lastQueued = s && (t = s.lastQueued) !== void 0 ? t : null, this.tests = s && (t = s.tests) !== void 0 ? t : 0
		}
		flush() {
			let s = null;
			for (; s = this.items.shift();) {
				if (!s.parentNode || s.hydrated\u03A6) continue;
				let t = this.current;
				this.current = s, s.__F |= 1024, s.connectedCallback(), this.current = t
			}
		}
		queue(s) {
			var t = this;
			let e = this.items.length,
				r = 0,
				i = this.lastQueued;
			this.lastQueued = s;
			let n = dt.DOCUMENT_POSITION_PRECEDING,
				o = dt.DOCUMENT_POSITION_FOLLOWING;
			if (e) {
				let l = this.items.indexOf(i),
					u = l,
					a = function(h, m) {
						return t.tests++, h.compareDocumentPosition(m)
					};
				(l == -1 || i.nodeName != s.nodeName) && (u = l = 0);
				let c = t.items[u];
				for (; c && a(c, s) & o;) c = t.items[++u];
				if (u != l) c ? t.items.splice(u, 0, s) : t.items.push(s);
				else {
					for (; c && a(c, s) & n;) c = t.items[--u];
					u != l && (c ? t.items.splice(u + 1, 0, s) : t.items.unshift(s))
				}
			} else t.items.push(s), t.current || globalThis.queueMicrotask(t.flush.bind(t))
		}
		run(s) {
			var t, e;
			if (this.active) return;
			this.active = !0;
			let r = globalThis.document.querySelectorAll(".__ssr");
			console.log("running hydrator", s, r.length, Array.from(r));
			for (let i = 0, n = as(r), o = n.length; i < o; i++) {
				let l = n[i];
				l[Bt] || (l[Bt] = 1), l[Bt]++;
				let u = l.nodeName,
					a = (e = this.map)[u] || (e[u] = globalThis.window.customElements.get(u.toLowerCase()) || pt);
				console.log("item type", u, a, !!Lt[u.toLowerCase()]), !(!l.connectedCallback || !l.parentNode || l.hydrated\u03A6) && console.log("hydrate", l)
			}
			return this.active = !1
		}
	};
var T = class extends pt {
	constructor() {
		super();
		this.flags$ns && (this.flag$ = this.flagExt$), this.setup$(), this.build()
	}
	setup$() {
		return this.__slots = {}, this.__F = 0
	} [$t]() {
		return this.__F |= 1 | 2, this
	} [fs]() {
		if (this[Ve]) return this[Ve].inited(this)
	}
	flag$(t) {
		this.className = this.flags$ext = t
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
	set autoschedule(t) {
		t ? this.__F |= 64 : this.__F &= ~64
	}
	set autorender(t) {
		let e = this[V] || (this[V] = {});
		e.value = t, this.mounted\u03A6 && w.schedule(this, e)
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
		return w.on("commit", this), this.__F |= 128, this
	}
	unschedule() {
		return w.un("commit", this), this.__F &= ~128, this
	}
	async suspend(t = null) {
		let e = this.flags.incr("_suspended_");
		return this.__F |= 4096, t instanceof Function && (await t(), this.unsuspend()), this
	}
	unsuspend() {
		return this.flags.decr("_suspended_") == 0 && (this.__F &= ~4096, this.commit()), this
	} [ms]() {
		return this.visit()
	} [ds]() {
		return this.__F & 1024 && (this.__F = this.__F & ~1024, this.classList.remove("_ssr_"), this.flags$ext && this.flags$ext.indexOf("_ssr_") == 0 && (this.flags$ext = this.flags$ext.slice(5)), this.__F & 512 || (this.innerHTML = "")), this
	} [ps]() {
		return this
	}
	connectedCallback() {
		let t = this.__F,
			e = t & 1,
			r = t & 8;
		if (!e && !(t & 1024)) {
			gs.queue(this);
			return
		}
		if (t & (16 | 32)) return;
		this.__F |= 16, e || this[$t](), t & 2 || (this.flags$ext = this.className, this.__F |= 2, this.hydrate(), this.commit()), r || (this.awaken(), this.__F |= 8), I(this, "mount");
		let i = this.mount();
		return i && i.then instanceof Function && i.then(w.commit), t = this.__F = (this.__F | 32) & ~16, t & 64 && this.schedule(), this[V] && w.schedule(this, this[V]), this
	}
	disconnectedCallback() {
		if (this.__F = this.__F & (~32 & ~16), this.__F & 128 && this.unschedule(), I(this, "unmount"), this.unmount(), this[V]) return w.unschedule(this, this[V])
	}
};

function ys(s, t) {
	let e = Object.getOwnPropertyDescriptors(t);
	return delete e.constructor, Object.defineProperties(s, e), s
}

function Ae() {
	return !0
}
var Ue = class {
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
	\u03B1key(t) {
		if (typeof t == "string") return this.key == t;
		if (typeof t == "number") return this.keyCode == t
	}
};
ys(Pe.prototype, Ue.prototype);

function $s(s, t) {
	let e = Object.getOwnPropertyDescriptors(t);
	return delete e.constructor, Object.defineProperties(s, e), s
}

function _t() {
	return !0
}
var We = class {
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
		let t = globalThis.navigator.platform;
		return /^(Mac|iPhone|iPad|iPod)/.test(t || "") ? !!this.metaKey : !!this.ctrlKey
	}
};
$s(Oe.prototype, We.prototype);

function Rt(s, t) {
	let e = Object.getOwnPropertyDescriptors(t);
	return delete e.constructor, Object.defineProperties(s, e), s
}

function He(s) {
	let t;
	return s && ((t = s.toIterable) ? t.call(s) : s)
}
var _s = Symbol.for("#extendType"),
	bs = Symbol.for("#modifierState"),
	bt = Symbol.for("#sharedModifierState"),
	qe = Symbol.for("#onceHandlerEnd"),
	Ki = Symbol.for("#__initor__"),
	Ni = Symbol.for("#__inited__"),
	ji = Symbol.for("#__hooks__"),
	Ge = Symbol.for("#extendDescriptors"),
	S = Symbol.for("#context"),
	Ye = Symbol.for("#self"),
	xs = Symbol.for("#target"),
	Qe = Symbol.for("#stopPropagation"),
	ze = Symbol.for("#defaultPrevented");
Ae();
_t();
var Je = class {
	[_s](t) {
		var e, r, i;
		let n = t[Ge] || (t[Ge] = (r = Object.getOwnPropertyDescriptors(t.prototype), i = r.constructor, delete r.constructor, r));
		return Object.defineProperties(this, n)
	}
};
Rt(mt.prototype, Je.prototype);
var Xe = class {
	get[bs]() {
		var t, e;
		return (t = this[S])[e = this[S].step] || (t[e] = {})
	}
	get[bt]() {
		var t, e;
		return (t = this[S].handler)[e = this[S].step] || (t[e] = {})
	} [qe](t) {
		return q(this[S], "end", t)
	}
	\u03B1sel(t) {
		return !!this.target.matches(String(t))
	}
	\u03B1closest(t) {
		return !!this.target.closest(String(t))
	}
	\u03B1log(...t) {
		return console.info(...t), !0
	}
	\u03B1trusted() {
		return !!this.isTrusted
	}
	\u03B1if(t) {
		return !!t
	}
	\u03B1wait(t = 250) {
		return new Promise(function(e) {
			return setTimeout(e, H(t))
		})
	}
	\u03B1self() {
		return this.target == this[S].element
	}
	\u03B1cooldown(t = 250) {
		let e = this[bt];
		return e.active ? !1 : (e.active = !0, e.target = this[S].element, e.target.flags.incr("cooldown"), this[qe](function() {
			return setTimeout(function() {
				return e.target.flags.decr("cooldown"), e.active = !1
			}, H(t))
		}), !0)
	}
	\u03B1throttle(t = 250) {
		let e = this[bt];
		return e.active ? (e.next && e.next(!1), new Promise(function(r) {
			return e.next = function(i) {
				return e.next = null, r(i)
			}
		})) : (e.active = !0, e.el || (e.el = this[S].element), e.el.flags.incr("throttled"), q(this[S], "end", function() {
			let r = H(t);
			return e.interval = setInterval(function() {
				e.next ? e.next(!0) : (clearInterval(e.interval), e.el.flags.decr("throttled"), e.active = !1)
			}, r)
		}), !0)
	}
	\u03B1debounce(t = 250) {
		let e = this[bt],
			r = this;
		return e.queue || (e.queue = []), e.queue.push(e.last = r), new Promise(function(i) {
			return setTimeout(function() {
				return e.last == r ? (r.debounced = e.queue, e.last = null, e.queue = [], i(!0)) : i(!1)
			}, H(t))
		})
	}
	\u03B1flag(t, e) {
		let {
			element: r,
			step: i,
			state: n,
			id: o,
			current: l
		} = this[S], u = e instanceof C ? e : e ? r.closest(e) : r;
		if (!u) return !0;
		this[S].commit = !0, n[i] = o, u.flags.incr(t);
		let a = Date.now();
		return q(l, "end", function() {
			let c = Date.now() - a,
				h = Math.max(250 - c, 0);
			return setTimeout(function() {
				return u.flags.decr(t)
			}, h)
		}), !0
	}
	\u03B1busy(t) {
		return this.\u03B1flag("busy", t)
	}
	\u03B1mod(t) {
		return this.\u03B1flag("mod-" + t, globalThis.document.documentElement)
	}
	\u03B1outside() {
		let {
			handler: t
		} = this[S];
		if (t && t[Ye]) return !t[Ye].parentNode.contains(this.target)
	}
};
Rt(M.prototype, Xe.prototype);

function tr() {
	return !0
}
var er = class {
		constructor(t, e) {
			this.params = t, this.closure = e
		}
		getHandlerForMethod(t, e) {
			return t ? t[e] ? t : this.getHandlerForMethod(t.parentNode, e) : null
		}
		emit(t, ...e) {
			return I(this, t, e)
		}
		on(t, ...e) {
			return Et(this, t, ...e)
		}
		once(t, ...e) {
			return q(this, t, ...e)
		}
		un(t, ...e) {
			return Ht(this, t, ...e)
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
		async handleEvent(t) {
			let e = this[xs] || t.currentTarget,
				r = this.params,
				i = null,
				n = r.silence || r.silent;
			this.count || (this.count = 0), this.state || (this.state = {});
			let o = {
				element: e,
				event: t,
				modifiers: r,
				handler: this,
				id: ++this.count,
				step: -1,
				state: this.state,
				commit: null,
				current: null
			};
			if (o.current = o, t.handle$mod && t.handle$mod.apply(o, r.options || []) == !1) return;
			let l = M[this.type + "$handle"] || M[t.type + "$handle"] || t.handle$mod;
			if (!(l && l.apply(o, r.options || []) == !1)) {
				this.currentEvents || (this.currentEvents = new Set), this.currentEvents.add(t);
				for (let u = 0, a = Object.keys(r), c = a.length, h, m; u < c; u++) {
					if (h = a[u], m = r[h], o.step++, h[0] == "_") continue;
					h.indexOf("~") > 0 && (h = h.split("~")[0]);
					let D = null,
						x = [t, o],
						k, O = null,
						St, wt = !1,
						Es = typeof h == "string";
					if (h[0] == "$" && h[1] == "_" && m[0] instanceof Function) h = m[0], h.passive || (o.commit = !0), x = [t, o].concat(m.slice(1)), O = e;
					else if (m instanceof Array) {
						x = m.slice(), D = x;
						for (let v = 0, E = He(x), st = E.length; v < st; v++) {
							let W = E[v];
							if (typeof W == "string" && W[0] == "~" && W[1] == "$") {
								let At = W.slice(2).split("."),
									it = o[At.shift()] || t;
								for (let vt = 0, Ut = He(At), Or = Ut.length; vt < Or; vt++) {
									let Pr = Ut[vt];
									it = it ? it[Pr] : void 0
								}
								x[v] = it
							}
						}
					}
					if (typeof h == "string" && (St = h.match(/^(emit|flag|mod|moved|pin|fit|refit|map|remap|css)-(.+)$/)) && (D || (D = x = []), x.unshift(St[2]), h = St[1]), h == "trap") t[Qe] = !0, t.stopImmediatePropagation(), t[ze] = !0, t.preventDefault();
					else if (h == "stop") t[Qe] = !0, t.stopImmediatePropagation();
					else if (h == "prevent") t[ze] = !0, t.preventDefault();
					else if (h == "commit") o.commit = !0;
					else if (h == "once") e.removeEventListener(t.type, this);
					else {
						if (h == "options" || h == "silence" || h == "silent") continue;
						if (h == "emit") {
							let v = x[0],
								E = x[1],
								st = new mt(v, {
									bubbles: !0,
									detail: E
								});
							st.originalEvent = t;
							let W = e.dispatchEvent(st)
						} else if (typeof h == "string") {
							h[0] == "!" && (wt = !0, h = h.slice(1));
							let v = "\u03B1" + h,
								E = t[v];
							E || (E = this.type && M[this.type + "$" + h + "$mod"]), E || (E = t[h + "$mod"] || M[t.type + "$" + h] || M[h + "$mod"]), E instanceof Function ? (h = E, O = o, x = D || [], t[v] && (O = t, t[S] = o)) : h[0] == "_" ? (h = h.slice(1), O = this.closure) : O = this.getHandlerForMethod(e, h)
						}
					}
					try {
						h instanceof Function ? k = h.apply(O || e, x) : O && (k = O[h].apply(O, x)), k && k.then instanceof Function && k != w.$promise && (o.commit && !n && w.commit(), k = await k)
					} catch (v) {
						i = v;
						break
					}
					if (wt && k === !0 || !wt && k === !1) break;
					o.value = k
				}
				if (I(o, "end", o), o.commit && !n && w.commit(), this.currentEvents.delete(t), this.currentEvents.size == 0 && this.emit("idle"), i) throw i
			}
		}
	},
	rr = class {
		on$(t, e, r) {
			let i = "on$" + t,
				n;
			n = new er(e, r);
			let o = e.capture || !1,
				l = e.passive,
				u = o;
			return l && (u = {
				passive: l,
				capture: o
			}), this[i] instanceof Function ? n = this[i](e, r, n, u) : this.addEventListener(t, n, u), n
		}
	};
Rt(C.prototype, rr.prototype);
var sr = "/images/gridcraft-logo-ENXLGD5T.png";
var Kt = K({
	url: sr,
	type: "image",
	width: 500,
	height: 105,
	toString: function() {
		return this.url
	}
});
var ir = "/images/twitter-logo-XLPG7IBD.png";
var Nt = K({
	url: ir,
	type: "image",
	width: 62,
	height: 51,
	toString: function() {
		return this.url
	}
});
var nr = "/images/discord-logo-6PIR6M6U.png";
var jt = K({
	url: nr,
	type: "image",
	width: 65,
	height: 49,
	toString: function() {
		return this.url
	}
});

function Ss(s, t) {
	return Object.defineProperties(s, Object.getOwnPropertyDescriptors(t.prototype)), s
}
var or = Symbol.for("#__init__"),
	ws = Symbol.for("#__patch__"),
	A = Symbol.for("#beforeReconcile"),
	xt = Symbol.for("#afterVisit"),
	rt = Symbol.for("#appendChild"),
	U = Symbol.for("#afterReconcile"),
	Vt = Symbol.for("##up"),
	vs = Symbol.for("#placeChild"),
	lr = Symbol(),
	ur = Symbol(),
	hr = Symbol(),
	ar = Symbol(),
	cr = Symbol(),
	fr = Symbol(),
	mr = Symbol(),
	dr = Symbol(),
	pr = Symbol(),
	gr = Symbol(),
	yr = Symbol(),
	$r = Symbol(),
	_r = Symbol(),
	br = Symbol(),
	xr = Symbol();
tr(), _t();
var Sr = class extends T {
	render() {
		var t, e, r, i = this._ns_ || "",
			n, o, l, u, a, c, h;
		return t = this, t[A](), e = r = 1, t[lr] === 1 || (e = r = 0, t[lr] = 1), (!e || r & 2) && t.flagSelf$("ck-af"), o = l = 1, (n = t[ur]) || (o = l = 0, t[ur] = n = et("gridcraft-hero-video", t, `${i}`, null)), o || !n.setup || n.setup(l), n[xt](l), o || t[rt](n), e || (u = f("header", t, `ck-ah ${i}`, null)), c = h = 1, (a = t[hr]) || (c = h = 0, t[hr] = a = et("gridcraft-nav", u, `${i}`, null)), c || !a.setup || a.setup(h), a[xt](h), c || u[rt](a), t[U](r), t
	}
};
Z("gridcraft-hero", Sr, {});
var wr = class extends T {
	render() {
		var t, e, r, i = this._ns_ || "",
			n, o, l, u, a, c, h, m;
		return t = this, t[A](), e = r = 1, t[ar] === 1 || (e = r = 0, t[ar] = 1), e || (n = f("nav", t, `ck-ak ${i}`, null)), e || (o = f("a", n, `ck-al ${i}`, null)), e || (o.href = "/"), e || (l = f("img", o, `${i}`, null)), e || (l.src = Kt), e || (u = f("div", n, `ck-an ${i}`, null)), e || (a = f("a", u, `ck-ao ${i}`, null)), e || (a.href = "https://twitter.com/gridcraft"), e || (c = f("img", a, `ck-ap ${i}`, null)), e || (c.src = Nt), e || (h = f("a", u, `ck-aq ${i}`, null)), e || (h.href = "https://discord.gg/gridcraft"), e || (m = f("img", h, `ck-ar ${i}`, null)), e || (m.src = jt), t[U](r), t
	}
};
Z("gridcraft-nav", wr, {});
var vr = class extends T {
	get $video() {
		let t = f("video", null, `ck-at ${this._ns_||""} ref--video`, null);
		return Object.defineProperty(this, "$video", {
			value: t
		}), t
	}
	render() {
		var t, e, r, i, n, o, l = this._ns_ || "",
			u, a, c, h, m;
		return t = this, t[A](), e = r = 1, t[cr] === 1 || (e = r = 0, t[cr] = 1), (!e || r & 2) && t.flagSelf$("ck-as"), n = o = 1, (i = t[fr]) || (n = o = 0, t[fr] = (i = this.$video, i[Vt] = t, i)), n || (i.poster = "images/gridcraft-video-poster.webp"), n || (i.muted = "muted"), n || (i.autoplay = "autoplay"), n || (i.loop = "loop"), n || (i.playsinline = "playsinline"), n || (u = f("source", i, `${l}`, null)), n || (u.src = "/video/gridcraft-720p.mp4"), n || (u.type = "video/mp4"), n || t[rt](i), c = h = 1, (a = t[mr]) || (c = h = 0, t[mr] = a = et("audio-control", t, `ck-av ${l}`, null)), m = this.$video, m === t[dr] || (a.video = t[dr] = m), c || !a.setup || a.setup(h), a[xt](h), c || t[rt](a), t[U](r), t
	}
};
Z("gridcraft-hero-video", vr, {});
var Er = class extends T {
	render() {
		var t, e, r, i = this._ns_ || "",
			n, o, l, u, a, c, h;
		return t = this, t[A](), e = r = 1, t[pr] === 1 || (e = r = 0, t[pr] = 1), (!e || r & 2) && t.flagSelf$("ck-aw"), e || (n = f("footer", t, `ck-ax ${i}`, null)), e || (o = f("a", n, `ck-ay ${i}`, null)), e || (o.href = "https://twitter.com/gridcraft"), e || (l = f("img", o, `ck-az ${i}`, null)), e || (l.src = Nt), e || (u = f("a", n, `ck-ba ${i}`, null)), e || (u.href = "https://discord.gg/gridcraft"), e || (a = f("img", u, `ck-bb ${i}`, null)), e || (a.src = jt), e || (c = f("a", t, `ck-bc ${i}`, null)), e || (c.href = "/"), e || (h = f("img", c, `${i}`, null)), e || (h.src = Kt), t[U](r), t
	}
};
Z("gridcraft-links", Er, {});
var kr = class extends T {
	[ws](t = {}) {
		var e;
		(e = t.video) !== void 0 && (this.video = e), (e = t.muted) !== void 0 && (this.muted = e)
	} [or](t = null) {
		var e;
		super[or](...arguments), this.video = t ? t.video : void 0, this.muted = t && (e = t.muted) !== void 0 ? e : !0
	}
	toggle_mute() {
		return this.muted ? (this.muted = !1, this.video.muted = !1) : (this.muted = !0, this.video.muted = !0)
	}
	render() {
		var t = this,
			e, r, i, n, o = this._ns_ || "",
			l, u, a, c, h, m;
		return r = this, r[A](), i = n = 1, r[gr] === 1 || (i = n = 0, r[gr] = 1), i || r.on$("click", {
			$_: [function(D, x) {
				return t.toggle_mute(D)
			}]
		}, this), (!i || n & 2) && r.flagSelf$("ck-be"), e = null, t.muted ? (l = u = 1, (e = r[yr]) || (l = u = 0, r[yr] = e = tt("svg", null, `${o}`, null)), l || (e[Vt] = r), l || e.set$("xmlns", "http://www.w3.org/2000/svg"), l || e.set$("viewBox", "0 0 576 512"), l || (a = tt("path", e, `${o}`, null)), l || a.set$("d", "M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z")) : (c = h = 1, (e = r[$r]) || (c = h = 0, r[$r] = e = tt("svg", null, `${o}`, null)), c || (e[Vt] = r), c || e.set$("xmlns", "http://www.w3.org/2000/svg"), c || e.set$("viewBox", "0 0 640 512"), c || (m = tt("path", e, `${o}`, null)), c || m.set$("d", "M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z")), r[_r] = r[vs](e, 0, r[_r]), r[U](n), r
	}
};
Z("audio-control", kr, {});
var Cr = class extends je("body", "HTMLBodyElement", T) {
	static create$() {
		return Ss(globalThis.document.createElement("body"), this)
	}
	render() {
		var t, e, r, i = this._ns_ || "",
			n, o, l;
		return t = this, t[A](), e = r = 1, t[br] === 1 || (e = r = 0, t[br] = 1), o = l = 1, (n = t[xr]) || (o = l = 0, t[xr] = n = et("gridcraft-hero", t, `${i}`, null)), o || !n.setup || n.setup(l), n[xt](l), o || t[rt](n), t[U](r), t
	}
};
Z("index-page", Cr, {
	extends: "body"
});
//__FOOT__