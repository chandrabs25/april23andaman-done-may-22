
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.5.7";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n)
          return n.exports;
        var i = r[o] = { exports: {} }, l = true;
        try {
          e[o](i, i.exports, t), l = false;
        } finally {
          l && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var l = e2.length; l > 0 && e2[l - 1][2] > i; l--)
              e2[l] = e2[l - 1];
            e2[l] = [o, n, i];
            return;
          }
          for (var a = 1 / 0, l = 0; l < e2.length; l++) {
            for (var [o, n, i] = e2[l], f = true, u = 0; u < o.length; u++)
              a >= i && Object.keys(t.O).every((e3) => t.O[e3](o[u])) ? o.splice(u--, 1) : (f = false, i < a && (a = i));
            if (f) {
              e2.splice(l--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.d = (e2, r2) => {
        for (var o in r2)
          t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.g = function() {
        if ("object" == typeof globalThis)
          return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window)
            return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [l, a, f] = o2, u = 0;
          if (l.some((r4) => 0 !== e2[r4])) {
            for (n in a)
              t.o(a, n) && (t.m[n] = a[n]);
            if (f)
              var s = f(t);
          }
          for (r3 && r3(o2); u < l.length; u++)
            i = l[u], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[727], { 67: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 376: (e, t, r) => {
      "use strict";
      let n, a, i;
      r.r(t), r.d(t, { default: () => t$ });
      var o, s, l, c, d, u, p, h, g, f, m, b, w = {};
      async function v() {
        let e10 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e10)
          try {
            await e10();
          } catch (e11) {
            throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
          }
      }
      r.r(w), r.d(w, { config: () => tU, middleware: () => tj });
      let y = null;
      function S() {
        return y || (y = v()), y;
      }
      function _(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
        let t2 = new Proxy(function() {
        }, { get(t3, r2) {
          if ("then" === r2)
            return {};
          throw Error(_(e10));
        }, construct() {
          throw Error(_(e10));
        }, apply(r2, n2, a2) {
          if ("function" == typeof a2[0])
            return a2[0](t2);
          throw Error(_(e10));
        } });
        return new Proxy({}, { get: () => t2 });
      }, enumerable: false, configurable: false }), S();
      class x extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class E extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class P extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let R = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      function O(e10) {
        var t2, r2, n2, a2, i2, o2 = [], s2 = 0;
        function l2() {
          for (; s2 < e10.length && /\s/.test(e10.charAt(s2)); )
            s2 += 1;
          return s2 < e10.length;
        }
        for (; s2 < e10.length; ) {
          for (t2 = s2, i2 = false; l2(); )
            if ("," === (r2 = e10.charAt(s2))) {
              for (n2 = s2, s2 += 1, l2(), a2 = s2; s2 < e10.length && "=" !== (r2 = e10.charAt(s2)) && ";" !== r2 && "," !== r2; )
                s2 += 1;
              s2 < e10.length && "=" === e10.charAt(s2) ? (i2 = true, s2 = a2, o2.push(e10.substring(t2, n2)), t2 = s2) : s2 = n2 + 1;
            } else
              s2 += 1;
          (!i2 || s2 >= e10.length) && o2.push(e10.substring(t2, e10.length));
        }
        return o2;
      }
      function T(e10) {
        let t2 = {}, r2 = [];
        if (e10)
          for (let [n2, a2] of e10.entries())
            "set-cookie" === n2.toLowerCase() ? (r2.push(...O(a2)), t2[n2] = 1 === r2.length ? r2[0] : r2) : t2[n2] = a2;
        return t2;
      }
      function C(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      ({ ...R, GROUP: { serverOnly: [R.reactServerComponents, R.actionBrowser, R.appMetadataRoute, R.appRouteHandler, R.instrument], clientOnly: [R.serverSideRendering, R.appPagesBrowser], nonClientServerTarget: [R.middleware, R.api], app: [R.reactServerComponents, R.actionBrowser, R.appMetadataRoute, R.appRouteHandler, R.serverSideRendering, R.appPagesBrowser, R.shared, R.instrument] } });
      let N = Symbol("response"), A = Symbol("passThrough"), I = Symbol("waitUntil");
      class k {
        constructor(e10) {
          this[I] = [], this[A] = false;
        }
        respondWith(e10) {
          this[N] || (this[N] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[A] = true;
        }
        waitUntil(e10) {
          this[I].push(e10);
        }
      }
      class M extends k {
        constructor(e10) {
          super(e10.request), this.sourcePage = e10.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
      }
      function L(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function D(e10) {
        let t2 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return n2 || t2 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t2), query: n2 ? e10.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e10.slice(t2) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function j(e10, t2) {
        if (!e10.startsWith("/") || !t2)
          return e10;
        let { pathname: r2, query: n2, hash: a2 } = D(e10);
        return "" + t2 + r2 + n2 + a2;
      }
      function U(e10, t2) {
        if (!e10.startsWith("/") || !t2)
          return e10;
        let { pathname: r2, query: n2, hash: a2 } = D(e10);
        return "" + r2 + t2 + n2 + a2;
      }
      function V(e10, t2) {
        if ("string" != typeof e10)
          return false;
        let { pathname: r2 } = D(e10);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function W(e10, t2) {
        let r2;
        let n2 = e10.split("/");
        return (t2 || []).some((t3) => !!n2[1] && n2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, n2.splice(1, 1), e10 = n2.join("/") || "/", true)), { pathname: e10, detectedLocale: r2 };
      }
      let H = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function $(e10, t2) {
        return new URL(String(e10).replace(H, "localhost"), t2 && String(t2).replace(H, "localhost"));
      }
      let q = Symbol("NextURLInternal");
      class B {
        constructor(e10, t2, r2) {
          let n2, a2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (n2 = t2, a2 = r2 || {}) : a2 = r2 || t2 || {}, this[q] = { url: $(e10, n2 ?? a2.base), options: a2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t2, r2, n2, a2;
          let i2 = function(e11, t3) {
            var r3, n3;
            let { basePath: a3, i18n: i3, trailingSlash: o3 } = null != (r3 = t3.nextConfig) ? r3 : {}, s3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : o3 };
            a3 && V(s3.pathname, a3) && (s3.pathname = function(e12, t4) {
              if (!V(e12, t4))
                return e12;
              let r4 = e12.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(s3.pathname, a3), s3.basePath = a3);
            let l2 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e12 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e12[0];
              s3.buildId = r4, l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t3.parseData && (s3.pathname = l2);
            }
            if (i3) {
              let e12 = t3.i18nProvider ? t3.i18nProvider.analyze(s3.pathname) : W(s3.pathname, i3.locales);
              s3.locale = e12.detectedLocale, s3.pathname = null != (n3 = e12.pathname) ? n3 : s3.pathname, !e12.detectedLocale && s3.buildId && (e12 = t3.i18nProvider ? t3.i18nProvider.analyze(l2) : W(l2, i3.locales)).detectedLocale && (s3.locale = e12.detectedLocale);
            }
            return s3;
          }(this[q].url.pathname, { nextConfig: this[q].options.nextConfig, parseData: true, i18nProvider: this[q].options.i18nProvider }), o2 = function(e11, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host))
              r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname)
                return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[q].url, this[q].options.headers);
          this[q].domainLocale = this[q].options.i18nProvider ? this[q].options.i18nProvider.detectDomainLocale(o2) : function(e11, t3, r3) {
            if (e11)
              for (let i3 of (r3 && (r3 = r3.toLowerCase()), e11)) {
                var n3, a3;
                if (t3 === (null == (n3 = i3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === i3.defaultLocale.toLowerCase() || (null == (a3 = i3.locales) ? void 0 : a3.some((e12) => e12.toLowerCase() === r3)))
                  return i3;
              }
          }(null == (t2 = this[q].options.nextConfig) ? void 0 : null == (e10 = t2.i18n) ? void 0 : e10.domains, o2);
          let s2 = (null == (r2 = this[q].domainLocale) ? void 0 : r2.defaultLocale) || (null == (a2 = this[q].options.nextConfig) ? void 0 : null == (n2 = a2.i18n) ? void 0 : n2.defaultLocale);
          this[q].url.pathname = i2.pathname, this[q].defaultLocale = s2, this[q].basePath = i2.basePath ?? "", this[q].buildId = i2.buildId, this[q].locale = i2.locale ?? s2, this[q].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t2;
          return t2 = function(e11, t3, r2, n2) {
            if (!t3 || t3 === r2)
              return e11;
            let a2 = e11.toLowerCase();
            return !n2 && (V(a2, "/api") || V(a2, "/" + t3.toLowerCase())) ? e11 : j(e11, "/" + t3);
          }((e10 = { basePath: this[q].basePath, buildId: this[q].buildId, defaultLocale: this[q].options.forceLocale ? void 0 : this[q].defaultLocale, locale: this[q].locale, pathname: this[q].url.pathname, trailingSlash: this[q].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t2 = L(t2)), e10.buildId && (t2 = U(j(t2, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t2 = j(t2, e10.basePath), !e10.buildId && e10.trailingSlash ? t2.endsWith("/") ? t2 : U(t2, "/") : L(t2);
        }
        formatSearch() {
          return this[q].url.search;
        }
        get buildId() {
          return this[q].buildId;
        }
        set buildId(e10) {
          this[q].buildId = e10;
        }
        get locale() {
          return this[q].locale ?? "";
        }
        set locale(e10) {
          var t2, r2;
          if (!this[q].locale || !(null == (r2 = this[q].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e10)))
            throw TypeError(`The NextURL configuration includes no locale "${e10}"`);
          this[q].locale = e10;
        }
        get defaultLocale() {
          return this[q].defaultLocale;
        }
        get domainLocale() {
          return this[q].domainLocale;
        }
        get searchParams() {
          return this[q].url.searchParams;
        }
        get host() {
          return this[q].url.host;
        }
        set host(e10) {
          this[q].url.host = e10;
        }
        get hostname() {
          return this[q].url.hostname;
        }
        set hostname(e10) {
          this[q].url.hostname = e10;
        }
        get port() {
          return this[q].url.port;
        }
        set port(e10) {
          this[q].url.port = e10;
        }
        get protocol() {
          return this[q].url.protocol;
        }
        set protocol(e10) {
          this[q].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t2}${this.hash}`;
        }
        set href(e10) {
          this[q].url = $(e10), this.analyze();
        }
        get origin() {
          return this[q].url.origin;
        }
        get pathname() {
          return this[q].url.pathname;
        }
        set pathname(e10) {
          this[q].url.pathname = e10;
        }
        get hash() {
          return this[q].url.hash;
        }
        set hash(e10) {
          this[q].url.hash = e10;
        }
        get search() {
          return this[q].url.search;
        }
        set search(e10) {
          this[q].url.search = e10;
        }
        get password() {
          return this[q].url.password;
        }
        set password(e10) {
          this[q].url.password = e10;
        }
        get username() {
          return this[q].url.username;
        }
        set username(e10) {
          this[q].url.username = e10;
        }
        get basePath() {
          return this[q].basePath;
        }
        set basePath(e10) {
          this[q].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new B(String(this), this[q].options);
        }
      }
      var K = r(945);
      let J = Symbol("internal request");
      class G extends Request {
        constructor(e10, t2 = {}) {
          let r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          C(r2), e10 instanceof Request ? super(e10, t2) : super(r2, t2);
          let n2 = new B(r2, { headers: T(this.headers), nextConfig: t2.nextConfig });
          this[J] = { cookies: new K.RequestCookies(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[J].cookies;
        }
        get geo() {
          return this[J].geo;
        }
        get ip() {
          return this[J].ip;
        }
        get nextUrl() {
          return this[J].nextUrl;
        }
        get page() {
          throw new E();
        }
        get ua() {
          throw new P();
        }
        get url() {
          return this[J].url;
        }
      }
      class F {
        static get(e10, t2, r2) {
          let n2 = Reflect.get(e10, t2, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t2, r2, n2) {
          return Reflect.set(e10, t2, r2, n2);
        }
        static has(e10, t2) {
          return Reflect.has(e10, t2);
        }
        static deleteProperty(e10, t2) {
          return Reflect.deleteProperty(e10, t2);
        }
      }
      let z = Symbol("internal response"), X = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function Y(e10, t2) {
        var r2;
        if (null == e10 ? void 0 : null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers))
            throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [n2, a2] of e10.request.headers)
            t2.set("x-middleware-request-" + n2, a2), r3.push(n2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class Z extends Response {
        constructor(e10, t2 = {}) {
          super(e10, t2);
          let r2 = this.headers, n2 = new Proxy(new K.ResponseCookies(r2), { get(e11, n3, a2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...a3) => {
                  let i2 = Reflect.apply(e11[n3], e11, a3), o2 = new Headers(r2);
                  return i2 instanceof K.ResponseCookies && r2.set("x-middleware-set-cookie", i2.getAll().map((e12) => (0, K.stringifyCookie)(e12)).join(",")), Y(t2, o2), i2;
                };
              default:
                return F.get(e11, n3, a2);
            }
          } });
          this[z] = { cookies: n2, url: t2.url ? new B(t2.url, { headers: T(r2), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[z].cookies;
        }
        static json(e10, t2) {
          let r2 = Response.json(e10, t2);
          return new Z(r2.body, r2);
        }
        static redirect(e10, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!X.has(r2))
            throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let n2 = "object" == typeof t2 ? t2 : {}, a2 = new Headers(null == n2 ? void 0 : n2.headers);
          return a2.set("Location", C(e10)), new Z(null, { ...n2, headers: a2, status: r2 });
        }
        static rewrite(e10, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", C(e10)), Y(t2, r2), new Z(null, { ...t2, headers: r2 });
        }
        static next(e10) {
          let t2 = new Headers(null == e10 ? void 0 : e10.headers);
          return t2.set("x-middleware-next", "1"), Y(e10, t2), new Z(null, { ...e10, headers: t2 });
        }
      }
      function Q(e10, t2) {
        let r2 = "string" == typeof t2 ? new URL(t2) : t2, n2 = new URL(e10, t2), a2 = r2.protocol + "//" + r2.host;
        return n2.protocol + "//" + n2.host === a2 ? n2.toString().replace(a2, "") : n2.toString();
      }
      let ee = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]], et = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], er = ["__nextDataReq"];
      class en extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new en();
        }
      }
      class ea extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t2, r2, n2) {
            if ("symbol" == typeof r2)
              return F.get(t2, r2, n2);
            let a2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            if (void 0 !== i2)
              return F.get(t2, i2, n2);
          }, set(t2, r2, n2, a2) {
            if ("symbol" == typeof r2)
              return F.set(t2, r2, n2, a2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return F.set(t2, o2 ?? r2, n2, a2);
          }, has(t2, r2) {
            if ("symbol" == typeof r2)
              return F.has(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== a2 && F.has(t2, a2);
          }, deleteProperty(t2, r2) {
            if ("symbol" == typeof r2)
              return F.deleteProperty(t2, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === a2 || F.deleteProperty(t2, a2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t2, r2) {
            switch (t2) {
              case "append":
              case "delete":
              case "set":
                return en.callable;
              default:
                return F.get(e11, t2, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new ea(e10);
        }
        append(e10, t2) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t2] : Array.isArray(r2) ? r2.push(t2) : this.headers[e10] = t2;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t2 = this.headers[e10];
          return void 0 !== t2 ? this.merge(t2) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t2) {
          this.headers[e10] = t2;
        }
        forEach(e10, t2) {
          for (let [r2, n2] of this.entries())
            e10.call(t2, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = e10.toLowerCase(), r2 = this.get(t2);
            yield [t2, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = e10.toLowerCase();
            yield t2;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t2 = this.get(e10);
            yield t2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let ei = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class eo {
        disable() {
          throw ei;
        }
        getStore() {
        }
        run() {
          throw ei;
        }
        exit() {
          throw ei;
        }
        enterWith() {
          throw ei;
        }
      }
      let es = globalThis.AsyncLocalStorage;
      function el() {
        return es ? new es() : new eo();
      }
      let ec = el();
      class ed extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new ed();
        }
      }
      class eu {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t2, r2) {
            switch (t2) {
              case "clear":
              case "delete":
              case "set":
                return ed.callable;
              default:
                return F.get(e11, t2, r2);
            }
          } });
        }
      }
      let ep = Symbol.for("next.mutated.cookies");
      class eh {
        static wrap(e10, t2) {
          let r2 = new K.ResponseCookies(new Headers());
          for (let t3 of e10.getAll())
            r2.set(t3);
          let n2 = [], a2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e11 = ec.getStore();
            if (e11 && (e11.pathWasRevalidated = true), n2 = r2.getAll().filter((e12) => a2.has(e12.name)), t2) {
              let e12 = [];
              for (let t3 of n2) {
                let r3 = new K.ResponseCookies(new Headers());
                r3.set(t3), e12.push(r3.toString());
              }
              t2(e12);
            }
          };
          return new Proxy(r2, { get(e11, t3, r3) {
            switch (t3) {
              case ep:
                return n2;
              case "delete":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    e11.delete(...t4);
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t4) {
                  a2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    return e11.set(...t4);
                  } finally {
                    i2();
                  }
                };
              default:
                return F.get(e11, t3, r3);
            }
          } });
        }
      }
      !function(e10) {
        e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404";
      }(o || (o = {})), function(e10) {
        e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents";
      }(s || (s = {})), function(e10) {
        e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer";
      }(l || (l = {})), function(e10) {
        e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch";
      }(c || (c = {})), (d || (d = {})).startServer = "startServer.startServer", function(e10) {
        e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult";
      }(u || (u = {})), function(e10) {
        e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch";
      }(p || (p = {})), (h || (h = {})).executeRoute = "Router.executeRoute", (g || (g = {})).runHandler = "Node.runHandler", (f || (f = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e10) {
        e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport";
      }(m || (m = {})), (b || (b = {})).execute = "Middleware.execute";
      let eg = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], ef = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: em, propagation: eb, trace: ew, SpanStatusCode: ev, SpanKind: ey, ROOT_CONTEXT: eS } = n = r(439), e_ = (e10) => null !== e10 && "object" == typeof e10 && "function" == typeof e10.then, ex = (e10, t2) => {
        (null == t2 ? void 0 : t2.bubble) === true ? e10.setAttribute("next.bubble", true) : (t2 && e10.recordException(t2), e10.setStatus({ code: ev.ERROR, message: null == t2 ? void 0 : t2.message })), e10.end();
      }, eE = /* @__PURE__ */ new Map(), eP = n.createContextKey("next.rootSpanId"), eR = 0, eO = () => eR++;
      class eT {
        getTracerInstance() {
          return ew.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return em;
        }
        getActiveScopeSpan() {
          return ew.getSpan(null == em ? void 0 : em.active());
        }
        withPropagatedContext(e10, t2, r2) {
          let n2 = em.active();
          if (ew.getSpanContext(n2))
            return t2();
          let a2 = eb.extract(n2, e10, r2);
          return em.with(a2, t2);
        }
        trace(...e10) {
          var t2;
          let [r2, n2, a2] = e10, { fn: i2, options: o2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: a2, options: { ...n2 } }, s2 = o2.spanName ?? r2;
          if (!eg.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || o2.hideSpan)
            return i2();
          let l2 = this.getSpanContext((null == o2 ? void 0 : o2.parentSpan) ?? this.getActiveScopeSpan()), c2 = false;
          l2 ? (null == (t2 = ew.getSpanContext(l2)) ? void 0 : t2.isRemote) && (c2 = true) : (l2 = (null == em ? void 0 : em.active()) ?? eS, c2 = true);
          let d2 = eO();
          return o2.attributes = { "next.span_name": s2, "next.span_type": r2, ...o2.attributes }, em.with(l2.setValue(eP, d2), () => this.getTracerInstance().startActiveSpan(s2, o2, (e11) => {
            let t3 = "performance" in globalThis ? globalThis.performance.now() : void 0, n3 = () => {
              eE.delete(d2), t3 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && ef.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t3, end: performance.now() });
            };
            c2 && eE.set(d2, new Map(Object.entries(o2.attributes ?? {})));
            try {
              if (i2.length > 1)
                return i2(e11, (t5) => ex(e11, t5));
              let t4 = i2(e11);
              if (e_(t4))
                return t4.then((t5) => (e11.end(), t5)).catch((t5) => {
                  throw ex(e11, t5), t5;
                }).finally(n3);
              return e11.end(), n3(), t4;
            } catch (t4) {
              throw ex(e11, t4), n3(), t4;
            }
          }));
        }
        wrap(...e10) {
          let t2 = this, [r2, n2, a2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eg.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof a2 && (e11 = e11.apply(this, arguments));
            let i2 = arguments.length - 1, o2 = arguments[i2];
            if ("function" != typeof o2)
              return t2.trace(r2, e11, () => a2.apply(this, arguments));
            {
              let n3 = t2.getContext().bind(em.active(), o2);
              return t2.trace(r2, e11, (e12, t3) => (arguments[i2] = function(e13) {
                return null == t3 || t3(e13), n3.apply(this, arguments);
              }, a2.apply(this, arguments)));
            }
          } : a2;
        }
        startSpan(...e10) {
          let [t2, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? ew.setSpan(em.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = em.active().getValue(eP);
          return eE.get(e10);
        }
      }
      let eC = (() => {
        let e10 = new eT();
        return () => e10;
      })(), eN = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eN);
      class eA {
        constructor(e10, t2, r2, n2) {
          var a2;
          let i2 = e10 && function(e11, t3) {
            let r3 = ea.from(e11.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t3.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t2, e10).isOnDemandRevalidate, o2 = null == (a2 = r2.get(eN)) ? void 0 : a2.value;
          this.isEnabled = !!(!i2 && o2 && e10 && o2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        enable() {
          if (!this._previewModeId)
            throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: eN, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: eN, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      function eI(e10, t2) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r2 = e10.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of O(r2))
            n2.append("set-cookie", e11);
          for (let e11 of new K.ResponseCookies(n2).getAll())
            t2.set(e11);
        }
      }
      let ek = { wrap(e10, { req: t2, res: r2, renderOpts: n2 }, a2) {
        let i2;
        function o2(e11) {
          r2 && r2.setHeader("Set-Cookie", e11);
        }
        n2 && "previewProps" in n2 && (i2 = n2.previewProps);
        let s2 = {}, l2 = { get headers() {
          return s2.headers || (s2.headers = function(e11) {
            let t3 = ea.from(e11);
            for (let e12 of ee)
              t3.delete(e12.toString().toLowerCase());
            return ea.seal(t3);
          }(t2.headers)), s2.headers;
        }, get cookies() {
          if (!s2.cookies) {
            let e11 = new K.RequestCookies(ea.from(t2.headers));
            eI(t2, e11), s2.cookies = eu.seal(e11);
          }
          return s2.cookies;
        }, get mutableCookies() {
          if (!s2.mutableCookies) {
            let e11 = function(e12, t3) {
              let r3 = new K.RequestCookies(ea.from(e12));
              return eh.wrap(r3, t3);
            }(t2.headers, (null == n2 ? void 0 : n2.onUpdateCookies) || (r2 ? o2 : void 0));
            eI(t2, e11), s2.mutableCookies = e11;
          }
          return s2.mutableCookies;
        }, get draftMode() {
          return s2.draftMode || (s2.draftMode = new eA(i2, t2, this.cookies, this.mutableCookies)), s2.draftMode;
        }, reactLoadableManifest: (null == n2 ? void 0 : n2.reactLoadableManifest) || {}, assetPrefix: (null == n2 ? void 0 : n2.assetPrefix) || "" };
        return e10.run(l2, a2, l2);
      } }, eM = el();
      function eL() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      class eD extends G {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw new x({ page: this.sourcePage });
        }
        respondWith() {
          throw new x({ page: this.sourcePage });
        }
        waitUntil() {
          throw new x({ page: this.sourcePage });
        }
      }
      let ej = { keys: (e10) => Array.from(e10.keys()), get: (e10, t2) => e10.get(t2) ?? void 0 }, eU = (e10, t2) => eC().withPropagatedContext(e10.headers, t2, ej), eV = false;
      async function eW(e10) {
        let t2, n2;
        !function() {
          if (!eV && (eV = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e11, wrapRequestHandler: t3 } = r(177);
            e11(), eU = t3(eU);
          }
        }(), await S();
        let a2 = void 0 !== self.__BUILD_MANIFEST;
        e10.request.url = e10.request.url.replace(/\.rsc($|\?)/, "$1");
        let i2 = new B(e10.request.url, { headers: e10.request.headers, nextConfig: e10.request.nextConfig });
        for (let e11 of [...i2.searchParams.keys()]) {
          let t3 = i2.searchParams.getAll(e11);
          !function(e12, t4) {
            for (let r2 of ["nxtP", "nxtI"])
              e12 !== r2 && e12.startsWith(r2) && t4(e12.substring(r2.length));
          }(e11, (r2) => {
            for (let e12 of (i2.searchParams.delete(r2), t3))
              i2.searchParams.append(r2, e12);
            i2.searchParams.delete(e11);
          });
        }
        let o2 = i2.buildId;
        i2.buildId = "";
        let s2 = e10.request.headers["x-nextjs-data"];
        s2 && "/index" === i2.pathname && (i2.pathname = "/");
        let l2 = function(e11) {
          let t3 = new Headers();
          for (let [r2, n3] of Object.entries(e11))
            for (let e12 of Array.isArray(n3) ? n3 : [n3])
              void 0 !== e12 && ("number" == typeof e12 && (e12 = e12.toString()), t3.append(r2, e12));
          return t3;
        }(e10.request.headers), c2 = /* @__PURE__ */ new Map();
        if (!a2)
          for (let e11 of ee) {
            let t3 = e11.toString().toLowerCase();
            l2.get(t3) && (c2.set(t3, l2.get(t3)), l2.delete(t3));
          }
        let d2 = new eD({ page: e10.page, input: function(e11, t3) {
          let r2 = "string" == typeof e11, n3 = r2 ? new URL(e11) : e11;
          for (let e12 of et)
            n3.searchParams.delete(e12);
          if (t3)
            for (let e12 of er)
              n3.searchParams.delete(e12);
          return r2 ? n3.toString() : n3;
        }(i2, true).toString(), init: { body: e10.request.body, geo: e10.request.geo, headers: l2, ip: e10.request.ip, method: e10.request.method, nextConfig: e10.request.nextConfig, signal: e10.request.signal } });
        s2 && Object.defineProperty(d2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCache && e10.IncrementalCache && (globalThis.__incrementalCache = new e10.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e10.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: eL() }) }));
        let u2 = new M({ request: d2, page: e10.page });
        if ((t2 = await eU(d2, () => "/middleware" === e10.page || "/src/middleware" === e10.page ? eC().trace(b.execute, { spanName: `middleware ${d2.method} ${d2.nextUrl.pathname}`, attributes: { "http.target": d2.nextUrl.pathname, "http.method": d2.method } }, () => ek.wrap(eM, { req: d2, renderOpts: { onUpdateCookies: (e11) => {
          n2 = e11;
        }, previewProps: eL() } }, () => e10.handler(d2, u2))) : e10.handler(d2, u2))) && !(t2 instanceof Response))
          throw TypeError("Expected an instance of Response to be returned");
        t2 && n2 && t2.headers.set("set-cookie", n2);
        let p2 = null == t2 ? void 0 : t2.headers.get("x-middleware-rewrite");
        if (t2 && p2 && !a2) {
          let r2 = new B(p2, { forceLocale: true, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          r2.host === d2.nextUrl.host && (r2.buildId = o2 || r2.buildId, t2.headers.set("x-middleware-rewrite", String(r2)));
          let n3 = Q(String(r2), String(i2));
          s2 && t2.headers.set("x-nextjs-rewrite", n3);
        }
        let h2 = null == t2 ? void 0 : t2.headers.get("Location");
        if (t2 && h2 && !a2) {
          let r2 = new B(h2, { forceLocale: false, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          t2 = new Response(t2.body, t2), r2.host === d2.nextUrl.host && (r2.buildId = o2 || r2.buildId, t2.headers.set("Location", String(r2))), s2 && (t2.headers.delete("Location"), t2.headers.set("x-nextjs-redirect", Q(String(r2), String(i2))));
        }
        let g2 = t2 || Z.next(), f2 = g2.headers.get("x-middleware-override-headers"), m2 = [];
        if (f2) {
          for (let [e11, t3] of c2)
            g2.headers.set(`x-middleware-request-${e11}`, t3), m2.push(e11);
          m2.length > 0 && g2.headers.set("x-middleware-override-headers", f2 + "," + m2.join(","));
        }
        return { response: g2, waitUntil: Promise.all(u2[I]), fetchMetrics: d2.fetchMetrics };
      }
      r(340), "undefined" == typeof URLPattern || URLPattern;
      let eH = new TextEncoder(), e$ = new TextDecoder(), eq = (e10) => {
        let t2 = atob(e10), r2 = new Uint8Array(t2.length);
        for (let e11 = 0; e11 < t2.length; e11++)
          r2[e11] = t2.charCodeAt(e11);
        return r2;
      }, eB = (e10) => {
        let t2 = e10;
        t2 instanceof Uint8Array && (t2 = e$.decode(t2)), t2 = t2.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          return eq(t2);
        } catch {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      };
      class eK extends Error {
        constructor(e10, t2) {
          super(e10, t2), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      eK.code = "ERR_JOSE_GENERIC";
      class eJ extends eK {
        constructor(e10, t2, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t2 } }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = r2, this.reason = n2, this.payload = t2;
        }
      }
      eJ.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      class eG extends eK {
        constructor(e10, t2, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t2 } }), this.code = "ERR_JWT_EXPIRED", this.claim = r2, this.reason = n2, this.payload = t2;
        }
      }
      eG.code = "ERR_JWT_EXPIRED";
      class eF extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
        }
      }
      eF.code = "ERR_JOSE_ALG_NOT_ALLOWED";
      class ez extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
        }
      }
      ez.code = "ERR_JOSE_NOT_SUPPORTED";
      class eX extends eK {
        constructor(e10 = "decryption operation failed", t2) {
          super(e10, t2), this.code = "ERR_JWE_DECRYPTION_FAILED";
        }
      }
      eX.code = "ERR_JWE_DECRYPTION_FAILED";
      class eY extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_INVALID";
        }
      }
      eY.code = "ERR_JWE_INVALID";
      class eZ extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_INVALID";
        }
      }
      eZ.code = "ERR_JWS_INVALID";
      class eQ extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JWT_INVALID";
        }
      }
      eQ.code = "ERR_JWT_INVALID";
      class e0 extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JWK_INVALID";
        }
      }
      e0.code = "ERR_JWK_INVALID";
      class e1 extends eK {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_INVALID";
        }
      }
      e1.code = "ERR_JWKS_INVALID";
      class e2 extends eK {
        constructor(e10 = "no applicable key found in the JSON Web Key Set", t2) {
          super(e10, t2), this.code = "ERR_JWKS_NO_MATCHING_KEY";
        }
      }
      e2.code = "ERR_JWKS_NO_MATCHING_KEY";
      class e3 extends eK {
        constructor(e10 = "multiple matching keys found in the JSON Web Key Set", t2) {
          super(e10, t2), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        }
      }
      Symbol.asyncIterator, e3.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
      class e4 extends eK {
        constructor(e10 = "request timed out", t2) {
          super(e10, t2), this.code = "ERR_JWKS_TIMEOUT";
        }
      }
      e4.code = "ERR_JWKS_TIMEOUT";
      class e5 extends eK {
        constructor(e10 = "signature verification failed", t2) {
          super(e10, t2), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        }
      }
      e5.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      let e6 = crypto, e9 = (e10) => e10 instanceof CryptoKey, e8 = (e10, t2) => {
        if (e10.startsWith("RS") || e10.startsWith("PS")) {
          let { modulusLength: r2 } = t2.algorithm;
          if ("number" != typeof r2 || r2 < 2048)
            throw TypeError(`${e10} requires key modulusLength to be 2048 bits or larger`);
        }
      };
      function e7(e10, t2 = "algorithm.name") {
        return TypeError(`CryptoKey does not support this operation, its ${t2} must be ${e10}`);
      }
      function te(e10, t2) {
        return e10.name === t2;
      }
      function tt(e10) {
        return parseInt(e10.name.slice(4), 10);
      }
      function tr(e10, t2, ...r2) {
        if ((r2 = r2.filter(Boolean)).length > 2) {
          let t3 = r2.pop();
          e10 += `one of type ${r2.join(", ")}, or ${t3}.`;
        } else
          2 === r2.length ? e10 += `one of type ${r2[0]} or ${r2[1]}.` : e10 += `of type ${r2[0]}.`;
        return null == t2 ? e10 += ` Received ${t2}` : "function" == typeof t2 && t2.name ? e10 += ` Received function ${t2.name}` : "object" == typeof t2 && null != t2 && t2.constructor?.name && (e10 += ` Received an instance of ${t2.constructor.name}`), e10;
      }
      let tn = (e10, ...t2) => tr("Key must be ", e10, ...t2);
      function ta(e10, t2, ...r2) {
        return tr(`Key for the ${e10} algorithm must be `, t2, ...r2);
      }
      let ti = (e10) => !!e9(e10) || e10?.[Symbol.toStringTag] === "KeyObject", to = ["CryptoKey"];
      function ts(e10) {
        if (!("object" == typeof e10 && null !== e10) || "[object Object]" !== Object.prototype.toString.call(e10))
          return false;
        if (null === Object.getPrototypeOf(e10))
          return true;
        let t2 = e10;
        for (; null !== Object.getPrototypeOf(t2); )
          t2 = Object.getPrototypeOf(t2);
        return Object.getPrototypeOf(e10) === t2;
      }
      function tl(e10) {
        return ts(e10) && "string" == typeof e10.kty;
      }
      let tc = async (e10) => {
        if (!e10.alg)
          throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: t2, keyUsages: r2 } = function(e11) {
          let t3, r3;
          switch (e11.kty) {
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t3 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t3 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t3 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r3 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new ez('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                  t3 = { name: "ECDSA", namedCurve: "P-256" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES384":
                  t3 = { name: "ECDSA", namedCurve: "P-384" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES512":
                  t3 = { name: "ECDSA", namedCurve: "P-521" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: "ECDH", namedCurve: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new ez('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "Ed25519":
                  t3 = { name: "Ed25519" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "EdDSA":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t3 = { name: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new ez('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            default:
              throw new ez('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t3, keyUsages: r3 };
        }(e10), n2 = [t2, e10.ext ?? false, e10.key_ops ?? r2], a2 = { ...e10 };
        return delete a2.alg, delete a2.use, e6.subtle.importKey("jwk", a2, ...n2);
      }, td = (e10) => eB(e10), tu = (e10) => e10?.[Symbol.toStringTag] === "KeyObject", tp = async (e10, t2, r2, n2, a2 = false) => {
        let i2 = e10.get(t2);
        if (i2?.[n2])
          return i2[n2];
        let o2 = await tc({ ...r2, alg: n2 });
        return a2 && Object.freeze(t2), i2 ? i2[n2] = o2 : e10.set(t2, { [n2]: o2 }), o2;
      }, th = { normalizePublicKey: (e10, t2) => {
        if (tu(e10)) {
          let r2 = e10.export({ format: "jwk" });
          return (delete r2.d, delete r2.dp, delete r2.dq, delete r2.p, delete r2.q, delete r2.qi, r2.k) ? td(r2.k) : (i || (i = /* @__PURE__ */ new WeakMap()), tp(i, e10, r2, t2));
        }
        return tl(e10) ? e10.k ? eB(e10.k) : (i || (i = /* @__PURE__ */ new WeakMap()), tp(i, e10, e10, t2, true)) : e10;
      }, normalizePrivateKey: (e10, t2) => {
        if (tu(e10)) {
          let r2 = e10.export({ format: "jwk" });
          return r2.k ? td(r2.k) : (a || (a = /* @__PURE__ */ new WeakMap()), tp(a, e10, r2, t2));
        }
        return tl(e10) ? e10.k ? eB(e10.k) : (a || (a = /* @__PURE__ */ new WeakMap()), tp(a, e10, e10, t2, true)) : e10;
      } };
      async function tg(e10, t2, r2) {
        if ("sign" === r2 && (t2 = await th.normalizePrivateKey(t2, e10)), "verify" === r2 && (t2 = await th.normalizePublicKey(t2, e10)), e9(t2))
          return !function(e11, t3, ...r3) {
            switch (t3) {
              case "HS256":
              case "HS384":
              case "HS512": {
                if (!te(e11.algorithm, "HMAC"))
                  throw e7("HMAC");
                let r4 = parseInt(t3.slice(2), 10);
                if (tt(e11.algorithm.hash) !== r4)
                  throw e7(`SHA-${r4}`, "algorithm.hash");
                break;
              }
              case "RS256":
              case "RS384":
              case "RS512": {
                if (!te(e11.algorithm, "RSASSA-PKCS1-v1_5"))
                  throw e7("RSASSA-PKCS1-v1_5");
                let r4 = parseInt(t3.slice(2), 10);
                if (tt(e11.algorithm.hash) !== r4)
                  throw e7(`SHA-${r4}`, "algorithm.hash");
                break;
              }
              case "PS256":
              case "PS384":
              case "PS512": {
                if (!te(e11.algorithm, "RSA-PSS"))
                  throw e7("RSA-PSS");
                let r4 = parseInt(t3.slice(2), 10);
                if (tt(e11.algorithm.hash) !== r4)
                  throw e7(`SHA-${r4}`, "algorithm.hash");
                break;
              }
              case "EdDSA":
                if ("Ed25519" !== e11.algorithm.name && "Ed448" !== e11.algorithm.name)
                  throw e7("Ed25519 or Ed448");
                break;
              case "Ed25519":
                if (!te(e11.algorithm, "Ed25519"))
                  throw e7("Ed25519");
                break;
              case "ES256":
              case "ES384":
              case "ES512": {
                if (!te(e11.algorithm, "ECDSA"))
                  throw e7("ECDSA");
                let r4 = function(e12) {
                  switch (e12) {
                    case "ES256":
                      return "P-256";
                    case "ES384":
                      return "P-384";
                    case "ES512":
                      return "P-521";
                    default:
                      throw Error("unreachable");
                  }
                }(t3);
                if (e11.algorithm.namedCurve !== r4)
                  throw e7(r4, "algorithm.namedCurve");
                break;
              }
              default:
                throw TypeError("CryptoKey does not support this operation");
            }
            (function(e12, t4) {
              if (t4.length && !t4.some((t5) => e12.usages.includes(t5))) {
                let e13 = "CryptoKey does not support this operation, its usages must include ";
                if (t4.length > 2) {
                  let r4 = t4.pop();
                  e13 += `one of ${t4.join(", ")}, or ${r4}.`;
                } else
                  2 === t4.length ? e13 += `one of ${t4[0]} or ${t4[1]}.` : e13 += `${t4[0]}.`;
                throw TypeError(e13);
              }
            })(e11, r3);
          }(t2, e10, r2), t2;
        if (t2 instanceof Uint8Array) {
          if (!e10.startsWith("HS"))
            throw TypeError(tn(t2, ...to));
          return e6.subtle.importKey("raw", t2, { hash: `SHA-${e10.slice(-3)}`, name: "HMAC" }, false, [r2]);
        }
        throw TypeError(tn(t2, ...to, "Uint8Array", "JSON Web Key"));
      }
      let tf = async (e10, t2, r2, n2) => {
        let a2 = await tg(e10, t2, "verify");
        e8(e10, a2);
        let i2 = function(e11, t3) {
          let r3 = `SHA-${e11.slice(-3)}`;
          switch (e11) {
            case "HS256":
            case "HS384":
            case "HS512":
              return { hash: r3, name: "HMAC" };
            case "PS256":
            case "PS384":
            case "PS512":
              return { hash: r3, name: "RSA-PSS", saltLength: e11.slice(-3) >> 3 };
            case "RS256":
            case "RS384":
            case "RS512":
              return { hash: r3, name: "RSASSA-PKCS1-v1_5" };
            case "ES256":
            case "ES384":
            case "ES512":
              return { hash: r3, name: "ECDSA", namedCurve: t3.namedCurve };
            case "Ed25519":
              return { name: "Ed25519" };
            case "EdDSA":
              return { name: t3.name };
            default:
              throw new ez(`alg ${e11} is not supported either by JOSE or your javascript runtime`);
          }
        }(e10, a2.algorithm);
        try {
          return await e6.subtle.verify(i2, a2, r2, n2);
        } catch {
          return false;
        }
      }, tm = (...e10) => {
        let t2;
        let r2 = e10.filter(Boolean);
        if (0 === r2.length || 1 === r2.length)
          return true;
        for (let e11 of r2) {
          let r3 = Object.keys(e11);
          if (!t2 || 0 === t2.size) {
            t2 = new Set(r3);
            continue;
          }
          for (let e12 of r3) {
            if (t2.has(e12))
              return false;
            t2.add(e12);
          }
        }
        return true;
      }, tb = (e10) => e10?.[Symbol.toStringTag], tw = (e10, t2, r2) => {
        if (void 0 !== t2.use && "sig" !== t2.use)
          throw TypeError("Invalid key for this operation, when present its use must be sig");
        if (void 0 !== t2.key_ops && t2.key_ops.includes?.(r2) !== true)
          throw TypeError(`Invalid key for this operation, when present its key_ops must include ${r2}`);
        if (void 0 !== t2.alg && t2.alg !== e10)
          throw TypeError(`Invalid key for this operation, when present its alg must be ${e10}`);
        return true;
      }, tv = (e10, t2, r2, n2) => {
        if (!(t2 instanceof Uint8Array)) {
          if (n2 && tl(t2)) {
            if (function(e11) {
              return tl(e11) && "oct" === e11.kty && "string" == typeof e11.k;
            }(t2) && tw(e10, t2, r2))
              return;
            throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
          }
          if (!ti(t2))
            throw TypeError(ta(e10, t2, ...to, "Uint8Array", n2 ? "JSON Web Key" : null));
          if ("secret" !== t2.type)
            throw TypeError(`${tb(t2)} instances for symmetric algorithms must be of type "secret"`);
        }
      }, ty = (e10, t2, r2, n2) => {
        if (n2 && tl(t2))
          switch (r2) {
            case "sign":
              if (function(e11) {
                return "oct" !== e11.kty && "string" == typeof e11.d;
              }(t2) && tw(e10, t2, r2))
                return;
              throw TypeError("JSON Web Key for this operation be a private JWK");
            case "verify":
              if (function(e11) {
                return "oct" !== e11.kty && void 0 === e11.d;
              }(t2) && tw(e10, t2, r2))
                return;
              throw TypeError("JSON Web Key for this operation be a public JWK");
          }
        if (!ti(t2))
          throw TypeError(ta(e10, t2, ...to, n2 ? "JSON Web Key" : null));
        if ("secret" === t2.type)
          throw TypeError(`${tb(t2)} instances for asymmetric algorithms must not be of type "secret"`);
        if ("sign" === r2 && "public" === t2.type)
          throw TypeError(`${tb(t2)} instances for asymmetric algorithm signing must be of type "private"`);
        if ("decrypt" === r2 && "public" === t2.type)
          throw TypeError(`${tb(t2)} instances for asymmetric algorithm decryption must be of type "private"`);
        if (t2.algorithm && "verify" === r2 && "private" === t2.type)
          throw TypeError(`${tb(t2)} instances for asymmetric algorithm verifying must be of type "public"`);
        if (t2.algorithm && "encrypt" === r2 && "private" === t2.type)
          throw TypeError(`${tb(t2)} instances for asymmetric algorithm encryption must be of type "public"`);
      };
      function tS(e10, t2, r2, n2) {
        t2.startsWith("HS") || "dir" === t2 || t2.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t2) ? tv(t2, r2, n2, e10) : ty(t2, r2, n2, e10);
      }
      tS.bind(void 0, false);
      let t_ = tS.bind(void 0, true), tx = function(e10, t2, r2, n2, a2) {
        let i2;
        if (void 0 !== a2.crit && n2?.crit === void 0)
          throw new e10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!n2 || void 0 === n2.crit)
          return /* @__PURE__ */ new Set();
        if (!Array.isArray(n2.crit) || 0 === n2.crit.length || n2.crit.some((e11) => "string" != typeof e11 || 0 === e11.length))
          throw new e10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        for (let o2 of (i2 = void 0 !== r2 ? new Map([...Object.entries(r2), ...t2.entries()]) : t2, n2.crit)) {
          if (!i2.has(o2))
            throw new ez(`Extension Header Parameter "${o2}" is not recognized`);
          if (void 0 === a2[o2])
            throw new e10(`Extension Header Parameter "${o2}" is missing`);
          if (i2.get(o2) && void 0 === n2[o2])
            throw new e10(`Extension Header Parameter "${o2}" MUST be integrity protected`);
        }
        return new Set(n2.crit);
      }, tE = (e10, t2) => {
        if (void 0 !== t2 && (!Array.isArray(t2) || t2.some((e11) => "string" != typeof e11)))
          throw TypeError(`"${e10}" option must be an array of strings`);
        if (t2)
          return new Set(t2);
      };
      async function tP(e10, t2) {
        if (!ts(e10))
          throw TypeError("JWK must be an object");
        switch (t2 || (t2 = e10.alg), e10.kty) {
          case "oct":
            if ("string" != typeof e10.k || !e10.k)
              throw TypeError('missing "k" (Key Value) Parameter value');
            return eB(e10.k);
          case "RSA":
            if ("oth" in e10 && void 0 !== e10.oth)
              throw new ez('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          case "EC":
          case "OKP":
            return tc({ ...e10, alg: t2 });
          default:
            throw new ez('Unsupported "kty" (Key Type) Parameter value');
        }
      }
      async function tR(e10, t2, r2) {
        let n2, a2;
        if (!ts(e10))
          throw new eZ("Flattened JWS must be an object");
        if (void 0 === e10.protected && void 0 === e10.header)
          throw new eZ('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== e10.protected && "string" != typeof e10.protected)
          throw new eZ("JWS Protected Header incorrect type");
        if (void 0 === e10.payload)
          throw new eZ("JWS Payload missing");
        if ("string" != typeof e10.signature)
          throw new eZ("JWS Signature missing or incorrect type");
        if (void 0 !== e10.header && !ts(e10.header))
          throw new eZ("JWS Unprotected Header incorrect type");
        let i2 = {};
        if (e10.protected)
          try {
            let t3 = eB(e10.protected);
            i2 = JSON.parse(e$.decode(t3));
          } catch {
            throw new eZ("JWS Protected Header is invalid");
          }
        if (!tm(i2, e10.header))
          throw new eZ("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let o2 = { ...i2, ...e10.header }, s2 = tx(eZ, /* @__PURE__ */ new Map([["b64", true]]), r2?.crit, i2, o2), l2 = true;
        if (s2.has("b64") && "boolean" != typeof (l2 = i2.b64))
          throw new eZ('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: c2 } = o2;
        if ("string" != typeof c2 || !c2)
          throw new eZ('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let d2 = r2 && tE("algorithms", r2.algorithms);
        if (d2 && !d2.has(c2))
          throw new eF('"alg" (Algorithm) Header Parameter value not allowed');
        if (l2) {
          if ("string" != typeof e10.payload)
            throw new eZ("JWS Payload must be a string");
        } else if ("string" != typeof e10.payload && !(e10.payload instanceof Uint8Array))
          throw new eZ("JWS Payload must be a string or an Uint8Array instance");
        let u2 = false;
        "function" == typeof t2 ? (t2 = await t2(i2, e10), u2 = true, t_(c2, t2, "verify"), tl(t2) && (t2 = await tP(t2, c2))) : t_(c2, t2, "verify");
        let p2 = function(...e11) {
          let t3 = new Uint8Array(e11.reduce((e12, { length: t4 }) => e12 + t4, 0)), r3 = 0;
          for (let n3 of e11)
            t3.set(n3, r3), r3 += n3.length;
          return t3;
        }(eH.encode(e10.protected ?? ""), eH.encode("."), "string" == typeof e10.payload ? eH.encode(e10.payload) : e10.payload);
        try {
          n2 = eB(e10.signature);
        } catch {
          throw new eZ("Failed to base64url decode the signature");
        }
        if (!await tf(c2, t2, n2, p2))
          throw new e5();
        if (l2)
          try {
            a2 = eB(e10.payload);
          } catch {
            throw new eZ("Failed to base64url decode the payload");
          }
        else
          a2 = "string" == typeof e10.payload ? eH.encode(e10.payload) : e10.payload;
        let h2 = { payload: a2 };
        return (void 0 !== e10.protected && (h2.protectedHeader = i2), void 0 !== e10.header && (h2.unprotectedHeader = e10.header), u2) ? { ...h2, key: t2 } : h2;
      }
      async function tO(e10, t2, r2) {
        if (e10 instanceof Uint8Array && (e10 = e$.decode(e10)), "string" != typeof e10)
          throw new eZ("Compact JWS must be a string or Uint8Array");
        let { 0: n2, 1: a2, 2: i2, length: o2 } = e10.split(".");
        if (3 !== o2)
          throw new eZ("Invalid Compact JWS");
        let s2 = await tR({ payload: a2, protected: n2, signature: i2 }, t2, r2), l2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
        return "function" == typeof t2 ? { ...l2, key: s2.key } : l2;
      }
      let tT = (e10) => Math.floor(e10.getTime() / 1e3), tC = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, tN = (e10) => {
        let t2;
        let r2 = tC.exec(e10);
        if (!r2 || r2[4] && r2[1])
          throw TypeError("Invalid time period format");
        let n2 = parseFloat(r2[2]);
        switch (r2[3].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            t2 = Math.round(n2);
            break;
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            t2 = Math.round(60 * n2);
            break;
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            t2 = Math.round(3600 * n2);
            break;
          case "day":
          case "days":
          case "d":
            t2 = Math.round(86400 * n2);
            break;
          case "week":
          case "weeks":
          case "w":
            t2 = Math.round(604800 * n2);
            break;
          default:
            t2 = Math.round(31557600 * n2);
        }
        return "-" === r2[1] || "ago" === r2[4] ? -t2 : t2;
      }, tA = (e10) => e10.toLowerCase().replace(/^application\//, ""), tI = (e10, t2) => "string" == typeof e10 ? t2.includes(e10) : !!Array.isArray(e10) && t2.some(Set.prototype.has.bind(new Set(e10))), tk = (e10, t2, r2 = {}) => {
        let n2, a2;
        try {
          n2 = JSON.parse(e$.decode(t2));
        } catch {
        }
        if (!ts(n2))
          throw new eQ("JWT Claims Set must be a top-level JSON object");
        let { typ: i2 } = r2;
        if (i2 && ("string" != typeof e10.typ || tA(e10.typ) !== tA(i2)))
          throw new eJ('unexpected "typ" JWT header value', n2, "typ", "check_failed");
        let { requiredClaims: o2 = [], issuer: s2, subject: l2, audience: c2, maxTokenAge: d2 } = r2, u2 = [...o2];
        for (let e11 of (void 0 !== d2 && u2.push("iat"), void 0 !== c2 && u2.push("aud"), void 0 !== l2 && u2.push("sub"), void 0 !== s2 && u2.push("iss"), new Set(u2.reverse())))
          if (!(e11 in n2))
            throw new eJ(`missing required "${e11}" claim`, n2, e11, "missing");
        if (s2 && !(Array.isArray(s2) ? s2 : [s2]).includes(n2.iss))
          throw new eJ('unexpected "iss" claim value', n2, "iss", "check_failed");
        if (l2 && n2.sub !== l2)
          throw new eJ('unexpected "sub" claim value', n2, "sub", "check_failed");
        if (c2 && !tI(n2.aud, "string" == typeof c2 ? [c2] : c2))
          throw new eJ('unexpected "aud" claim value', n2, "aud", "check_failed");
        switch (typeof r2.clockTolerance) {
          case "string":
            a2 = tN(r2.clockTolerance);
            break;
          case "number":
            a2 = r2.clockTolerance;
            break;
          case "undefined":
            a2 = 0;
            break;
          default:
            throw TypeError("Invalid clockTolerance option type");
        }
        let { currentDate: p2 } = r2, h2 = tT(p2 || /* @__PURE__ */ new Date());
        if ((void 0 !== n2.iat || d2) && "number" != typeof n2.iat)
          throw new eJ('"iat" claim must be a number', n2, "iat", "invalid");
        if (void 0 !== n2.nbf) {
          if ("number" != typeof n2.nbf)
            throw new eJ('"nbf" claim must be a number', n2, "nbf", "invalid");
          if (n2.nbf > h2 + a2)
            throw new eJ('"nbf" claim timestamp check failed', n2, "nbf", "check_failed");
        }
        if (void 0 !== n2.exp) {
          if ("number" != typeof n2.exp)
            throw new eJ('"exp" claim must be a number', n2, "exp", "invalid");
          if (n2.exp <= h2 - a2)
            throw new eG('"exp" claim timestamp check failed', n2, "exp", "check_failed");
        }
        if (d2) {
          let e11 = h2 - n2.iat;
          if (e11 - a2 > ("number" == typeof d2 ? d2 : tN(d2)))
            throw new eG('"iat" claim timestamp check failed (too far in the past)', n2, "iat", "check_failed");
          if (e11 < 0 - a2)
            throw new eJ('"iat" claim timestamp check failed (it should be in the past)', n2, "iat", "check_failed");
        }
        return n2;
      };
      async function tM(e10, t2, r2) {
        let n2 = await tO(e10, t2, r2);
        if (n2.protectedHeader.crit?.includes("b64") && false === n2.protectedHeader.b64)
          throw new eQ("JWTs MUST NOT use unencoded payload");
        let a2 = { payload: tk(n2.protectedHeader, n2.payload, r2), protectedHeader: n2.protectedHeader };
        return "function" == typeof t2 ? { ...a2, key: n2.key } : a2;
      }
      let tL = () => {
        let e10 = process.env.JWT_SECRET;
        if (!e10)
          throw Error("JWT_SECRET environment variable is not defined");
        return new TextEncoder().encode(e10);
      };
      async function tD(e10) {
        try {
          let t2 = e10.cookies.get("auth_token")?.value;
          if (!t2)
            return { isAuthenticated: false, user: null };
          let { payload: r2 } = await tM(t2, tL()), n2 = Math.floor(Date.now() / 1e3);
          if (r2.exp && r2.exp < n2)
            return { isAuthenticated: false, user: null };
          let a2 = { id: r2.sub, email: r2.email, role_id: r2.role_id };
          return { isAuthenticated: true, user: a2 };
        } catch (e11) {
          return e11 instanceof Error && "code" in e11 && "ERR_JWT_EXPIRED" === e11.code ? console.log("Auth token expired during verification.") : console.error("Error verifying auth token:", e11), { isAuthenticated: false, user: null };
        }
      }
      async function tj(e10) {
        let { pathname: t2 } = e10.nextUrl;
        if (t2.startsWith("/admin") || t2.startsWith("/api/admin")) {
          let { isAuthenticated: r2, user: n2 } = await tD(e10);
          if (!r2) {
            if (t2.startsWith("/api/admin"))
              return new Z(JSON.stringify({ success: false, message: "Authentication required. Please log in." }), { status: 401, headers: { "Content-Type": "application/json" } });
            let r3 = new URL("/auth/signin", e10.url);
            return r3.searchParams.set("callbackUrl", t2), Z.redirect(r3);
          }
          if (n2?.role_id !== 1)
            return t2.startsWith("/api/admin") ? new Z(JSON.stringify({ success: false, message: "Forbidden: You do not have admin privileges." }), { status: 403, headers: { "Content-Type": "application/json" } }) : (console.log(`[Middleware] User not admin. Rewriting ${t2} to /not-authorized`), Z.rewrite(new URL("/not-authorized", e10.url)));
        }
        return Z.next();
      }
      let tU = { matcher: ["/admin/:path*", "/api/admin/:path*"] }, tV = { ...w }, tW = tV.middleware || tV.default, tH = "/src/middleware";
      if ("function" != typeof tW)
        throw Error(`The Middleware "${tH}" must export a \`middleware\` or a \`default\` function`);
      function t$(e10) {
        return eW({ ...e10, page: tH, handler: tW });
      }
    }, 945: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, i = {};
      function o(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function s(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2)
            continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, a2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != a2 ? a2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        var t2, r2;
        if (!e2)
          return;
        let [[n2, a2], ...i2] = s(e2), { domain: o2, expires: l2, httponly: u2, maxage: p2, path: h, samesite: g, secure: f, partitioned: m, priority: b } = Object.fromEntries(i2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3)
            e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: n2, value: decodeURIComponent(a2), domain: o2, ...l2 && { expires: new Date(l2) }, ...u2 && { httpOnly: true }, ..."string" == typeof p2 && { maxAge: Number(p2) }, path: h, ...g && { sameSite: c.includes(t2 = (t2 = g).toLowerCase()) ? t2 : void 0 }, ...f && { secure: true }, ...b && { priority: d.includes(r2 = (r2 = b).toLowerCase()) ? r2 : void 0 }, ...m && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var n2 in r2)
          t(e2, n2, { get: r2[n2], enumerable: true });
      })(i, { RequestCookies: () => u, ResponseCookies: () => p, parseCookie: () => s, parseSetCookie: () => l, stringifyCookie: () => o }), e.exports = ((e2, i2, o2, s2) => {
        if (i2 && "object" == typeof i2 || "function" == typeof i2)
          for (let l2 of n(i2))
            a.call(e2, l2) || l2 === o2 || t(e2, l2, { get: () => i2[l2], enumerable: !(s2 = r(i2, l2)) || s2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), i);
      var c = ["strict", "lax", "none"], d = ["low", "medium", "high"], u = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2)
            for (let [e3, r2] of s(t2))
              this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length)
            return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => o(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => o(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, p = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let a2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(a2) ? a2 : function(e4) {
            if (!e4)
              return [];
            var t3, r3, n3, a3, i2, o2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); )
                s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, i2 = false; l2(); )
                if ("," === (r3 = e4.charAt(s2))) {
                  for (n3 = s2, s2 += 1, l2(), a3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; )
                    s2 += 1;
                  s2 < e4.length && "=" === e4.charAt(s2) ? (i2 = true, s2 = a3, o2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
                } else
                  s2 += 1;
              (!i2 || s2 >= e4.length) && o2.push(e4.substring(t3, e4.length));
            }
            return o2;
          }(a2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length)
            return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, a2 = this._parsed;
          return a2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = o(r3);
              t3.append("set-cookie", e4);
            }
          }(a2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, n2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: n2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(o).join("; ");
        }
      };
    }, 439: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let n2 = r2(223), a2 = r2(172), i2 = r2(930), o = "context", s = new n2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...n3) {
              return this._getContextManager().with(e3, t4, r3, ...n3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, a2.getGlobal)(o) || s;
            }
            disable() {
              this._getContextManager().disable(), (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = l;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let n2 = r2(56), a2 = r2(912), i2 = r2(957), o = r2(172);
          class s {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, o.getGlobal)("diag");
                  if (r3)
                    return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: i2.DiagLogLevel.INFO }) => {
                var n3, s2, l;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null !== (n3 = e5.stack) && void 0 !== n3 ? n3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let c = (0, o.getGlobal)("diag"), d = (0, a2.createLogLevelDiagLogger)(null !== (s2 = r3.logLevel) && void 0 !== s2 ? s2 : i2.DiagLogLevel.INFO, e4);
                if (c && !r3.suppressOverrideMessage) {
                  let e5 = null !== (l = Error().stack) && void 0 !== l ? l : "<failed to generate stacktrace>";
                  c.warn(`Current logger will be overwritten from ${e5}`), d.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, o.registerGlobal)("diag", d, t4, true);
              }, t4.disable = () => {
                (0, o.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
          }
          t3.DiagAPI = s;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let n2 = r2(660), a2 = r2(172), i2 = r2(930), o = "metrics";
          class s {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new s()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, a2.registerGlobal)(o, e3, i2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, a2.getGlobal)(o) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, a2.unregisterGlobal)(o, i2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = s;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let n2 = r2(172), a2 = r2(874), i2 = r2(194), o = r2(277), s = r2(369), l = r2(930), c = "propagation", d = new a2.NoopTextMapPropagator();
          class u {
            constructor() {
              this.createBaggage = s.createBaggage, this.getBaggage = o.getBaggage, this.getActiveBaggage = o.getActiveBaggage, this.setBaggage = o.setBaggage, this.deleteBaggage = o.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(c, e3, l.DiagAPI.instance());
            }
            inject(e3, t4, r3 = i2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = i2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(c, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(c) || d;
            }
          }
          t3.PropagationAPI = u;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let n2 = r2(172), a2 = r2(846), i2 = r2(139), o = r2(607), s = r2(930), l = "trace";
          class c {
            constructor() {
              this._proxyTracerProvider = new a2.ProxyTracerProvider(), this.wrapSpanContext = i2.wrapSpanContext, this.isSpanContextValid = i2.isSpanContextValid, this.deleteSpan = o.deleteSpan, this.getSpan = o.getSpan, this.getActiveSpan = o.getActiveSpan, this.getSpanContext = o.getSpanContext, this.setSpan = o.setSpan, this.setSpanContext = o.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new c()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, n2.registerGlobal)(l, this._proxyTracerProvider, s.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, n2.unregisterGlobal)(l, s.DiagAPI.instance()), this._proxyTracerProvider = new a2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = c;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let n2 = r2(491), a2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function i2(e3) {
            return e3.getValue(a2) || void 0;
          }
          t3.getBaggage = i2, t3.getActiveBaggage = function() {
            return i2(n2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(a2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(a2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4)
                return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let n2 = new r2(this._entries);
              return n2._entries.set(e3, t4), n2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3)
                t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let n2 = r2(930), a2 = r2(993), i2 = r2(830), o = n2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new a2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (o.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: i2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0;
          let n2 = r2(491);
          t3.context = n2.ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let n2 = r2(780);
          class a2 {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...n3) {
              return t4.call(r3, ...n3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = a2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, n2) => {
                let a2 = new r2(t4._currentContext);
                return a2._currentContext.set(e4, n2), a2;
              }, t4.deleteValue = (e4) => {
                let n2 = new r2(t4._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0;
          let n2 = r2(930);
          t3.diag = n2.DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let n2 = r2(172);
          class a2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          }
          function i2(e3, t4, r3) {
            let a3 = (0, n2.getGlobal)("diag");
            if (a3)
              return r3.unshift(t4), a3[e3](...r3);
          }
          t3.DiagComponentLogger = a2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class n2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++)
                this[r2[e3].n] = function(e4) {
                  return function(...t4) {
                    if (console) {
                      let r3 = console[e4];
                      if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3)
                        return r3.apply(console, t4);
                    }
                  };
                }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = n2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let n2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, n3) {
              let a2 = t4[r4];
              return "function" == typeof a2 && e3 >= n3 ? a2.bind(t4) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", n2.DiagLogLevel.ERROR), warn: r3("warn", n2.DiagLogLevel.WARN), info: r3("info", n2.DiagLogLevel.INFO), debug: r3("debug", n2.DiagLogLevel.DEBUG), verbose: r3("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let n2 = r2(200), a2 = r2(521), i2 = r2(130), o = a2.VERSION.split(".")[0], s = Symbol.for(`opentelemetry.js.api.${o}`), l = n2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, n3 = false) {
            var i3;
            let o2 = l[s] = null !== (i3 = l[s]) && void 0 !== i3 ? i3 : { version: a2.VERSION };
            if (!n3 && o2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (o2.version !== a2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${o2.version} for ${e3} does not match previously registered API v${a2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return o2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${a2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let n3 = null === (t4 = l[s]) || void 0 === t4 ? void 0 : t4.version;
            if (n3 && (0, i2.isCompatible)(n3))
              return null === (r3 = l[s]) || void 0 === r3 ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${a2.VERSION}.`);
            let r3 = l[s];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let n2 = r2(521), a2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function i2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), n3 = e3.match(a2);
            if (!n3)
              return () => false;
            let i3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != i3.prerelease)
              return function(t5) {
                return t5 === e3;
              };
            function o(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4))
                return true;
              if (r3.has(e4))
                return false;
              let n4 = e4.match(a2);
              if (!n4)
                return o(e4);
              let s = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              return null != s.prerelease || i3.major !== s.major ? o(e4) : 0 === i3.major ? i3.minor === s.minor && i3.patch <= s.patch ? (t4.add(e4), true) : o(e4) : i3.minor <= s.minor ? (t4.add(e4), true) : o(e4);
            };
          }
          t3._makeCompatibilityCheck = i2, t3.isCompatible = i2(n2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0;
          let n2 = r2(653);
          t3.metrics = n2.MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class n2 {
          }
          t3.NoopMetric = n2;
          class a2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = a2;
          class i2 extends n2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = i2;
          class o extends n2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = o;
          class s {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = s;
          class l extends s {
          }
          t3.NoopObservableCounterMetric = l;
          class c extends s {
          }
          t3.NoopObservableGaugeMetric = c;
          class d extends s {
          }
          t3.NoopObservableUpDownCounterMetric = d, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new a2(), t3.NOOP_HISTOGRAM_METRIC = new o(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new i2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new c(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new d(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let n2 = r2(102);
          class a2 {
            getMeter(e3, t4, r3) {
              return n2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = a2, t3.NOOP_METER_PROVIDER = new a2();
        }, 200: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3)
              "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t4[r3];
          }), a2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3)
              "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || n2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), a2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0;
          let n2 = r2(181);
          t3.propagation = n2.PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3)
              return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0;
          let n2 = r2(997);
          t3.trace = n2.TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let n2 = r2(476);
          class a2 {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = a2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let n2 = r2(491), a2 = r2(607), i2 = r2(403), o = r2(139), s = n2.ContextAPI.getInstance();
          class l {
            startSpan(e3, t4, r3 = s.active()) {
              if (null == t4 ? void 0 : t4.root)
                return new i2.NonRecordingSpan();
              let n3 = r3 && (0, a2.getSpanContext)(r3);
              return "object" == typeof n3 && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, o.isSpanContextValid)(n3) ? new i2.NonRecordingSpan(n3) : new i2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, n3) {
              let i3, o2, l2;
              if (arguments.length < 2)
                return;
              2 == arguments.length ? l2 = t4 : 3 == arguments.length ? (i3 = t4, l2 = r3) : (i3 = t4, o2 = r3, l2 = n3);
              let c = null != o2 ? o2 : s.active(), d = this.startSpan(e3, i3, c), u = (0, a2.setSpan)(c, d);
              return s.with(u, l2, void 0, d);
            }
          }
          t3.NoopTracer = l;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let n2 = r2(614);
          class a2 {
            getTracer(e3, t4, r3) {
              return new n2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = a2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let n2 = new (r2(614)).NoopTracer();
          class a2 {
            constructor(e3, t4, r3, n3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = n3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, n3) {
              let a3 = this._getTracer();
              return Reflect.apply(a3.startActiveSpan, a3, arguments);
            }
            _getTracer() {
              if (this._delegate)
                return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          }
          t3.ProxyTracer = a2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let n2 = r2(125), a2 = new (r2(124)).NoopTracerProvider();
          class i2 {
            getTracer(e3, t4, r3) {
              var a3;
              return null !== (a3 = this.getDelegateTracer(e3, t4, r3)) && void 0 !== a3 ? a3 : new n2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null !== (e3 = this._delegate) && void 0 !== e3 ? e3 : a2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var n3;
              return null === (n3 = this._delegate) || void 0 === n3 ? void 0 : n3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = i2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let n2 = r2(780), a2 = r2(403), i2 = r2(491), o = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s(e3) {
            return e3.getValue(o) || void 0;
          }
          function l(e3, t4) {
            return e3.setValue(o, t4);
          }
          t3.getSpan = s, t3.getActiveSpan = function() {
            return s(i2.ContextAPI.getInstance().active());
          }, t3.setSpan = l, t3.deleteSpan = function(e3) {
            return e3.deleteValue(o);
          }, t3.setSpanContext = function(e3, t4) {
            return l(e3, new a2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null === (t4 = s(e3)) || void 0 === t4 ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let n2 = r2(564);
          class a2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), a3 = r3.indexOf("=");
                if (-1 !== a3) {
                  let i2 = r3.slice(0, a3), o = r3.slice(a3 + 1, t4.length);
                  (0, n2.validateKey)(i2) && (0, n2.validateValue)(o) && e4.set(i2, o);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new a2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = a2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", n2 = `[a-z]${r2}{0,255}`, a2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, i2 = RegExp(`^(?:${n2}|${a2})$`), o = /^[ -~]{0,255}[!-~]$/, s = /,|=/;
          t3.validateKey = function(e3) {
            return i2.test(e3);
          }, t3.validateValue = function(e3) {
            return o.test(e3) && !s.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let n2 = r2(325);
          t3.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let n2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let n2 = r2(476), a2 = r2(403), i2 = /^([0-9a-f]{32})$/i, o = /^[0-9a-f]{16}$/i;
          function s(e3) {
            return i2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l(e3) {
            return o.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t3.isValidTraceId = s, t3.isValidSpanId = l, t3.isSpanContextValid = function(e3) {
            return s(e3.traceId) && l(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new a2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, n = {};
        function a(e2) {
          var r2 = n[e2];
          if (void 0 !== r2)
            return r2.exports;
          var i2 = n[e2] = { exports: {} }, o = true;
          try {
            t2[e2].call(i2.exports, i2, i2.exports, a), o = false;
          } finally {
            o && delete n[e2];
          }
          return i2.exports;
        }
        a.ab = "//";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true }), i.trace = i.propagation = i.metrics = i.diag = i.context = i.INVALID_SPAN_CONTEXT = i.INVALID_TRACEID = i.INVALID_SPANID = i.isValidSpanId = i.isValidTraceId = i.isSpanContextValid = i.createTraceState = i.TraceFlags = i.SpanStatusCode = i.SpanKind = i.SamplingDecision = i.ProxyTracerProvider = i.ProxyTracer = i.defaultTextMapSetter = i.defaultTextMapGetter = i.ValueType = i.createNoopMeter = i.DiagLogLevel = i.DiagConsoleLogger = i.ROOT_CONTEXT = i.createContextKey = i.baggageEntryMetadataFromString = void 0;
          var e2 = a(369);
          Object.defineProperty(i, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = a(780);
          Object.defineProperty(i, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(i, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = a(972);
          Object.defineProperty(i, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var n2 = a(957);
          Object.defineProperty(i, "DiagLogLevel", { enumerable: true, get: function() {
            return n2.DiagLogLevel;
          } });
          var o = a(102);
          Object.defineProperty(i, "createNoopMeter", { enumerable: true, get: function() {
            return o.createNoopMeter;
          } });
          var s = a(901);
          Object.defineProperty(i, "ValueType", { enumerable: true, get: function() {
            return s.ValueType;
          } });
          var l = a(194);
          Object.defineProperty(i, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(i, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var c = a(125);
          Object.defineProperty(i, "ProxyTracer", { enumerable: true, get: function() {
            return c.ProxyTracer;
          } });
          var d = a(846);
          Object.defineProperty(i, "ProxyTracerProvider", { enumerable: true, get: function() {
            return d.ProxyTracerProvider;
          } });
          var u = a(996);
          Object.defineProperty(i, "SamplingDecision", { enumerable: true, get: function() {
            return u.SamplingDecision;
          } });
          var p = a(357);
          Object.defineProperty(i, "SpanKind", { enumerable: true, get: function() {
            return p.SpanKind;
          } });
          var h = a(847);
          Object.defineProperty(i, "SpanStatusCode", { enumerable: true, get: function() {
            return h.SpanStatusCode;
          } });
          var g = a(475);
          Object.defineProperty(i, "TraceFlags", { enumerable: true, get: function() {
            return g.TraceFlags;
          } });
          var f = a(98);
          Object.defineProperty(i, "createTraceState", { enumerable: true, get: function() {
            return f.createTraceState;
          } });
          var m = a(139);
          Object.defineProperty(i, "isSpanContextValid", { enumerable: true, get: function() {
            return m.isSpanContextValid;
          } }), Object.defineProperty(i, "isValidTraceId", { enumerable: true, get: function() {
            return m.isValidTraceId;
          } }), Object.defineProperty(i, "isValidSpanId", { enumerable: true, get: function() {
            return m.isValidSpanId;
          } });
          var b = a(476);
          Object.defineProperty(i, "INVALID_SPANID", { enumerable: true, get: function() {
            return b.INVALID_SPANID;
          } }), Object.defineProperty(i, "INVALID_TRACEID", { enumerable: true, get: function() {
            return b.INVALID_TRACEID;
          } }), Object.defineProperty(i, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return b.INVALID_SPAN_CONTEXT;
          } });
          let w = a(67);
          Object.defineProperty(i, "context", { enumerable: true, get: function() {
            return w.context;
          } });
          let v = a(506);
          Object.defineProperty(i, "diag", { enumerable: true, get: function() {
            return v.diag;
          } });
          let y = a(886);
          Object.defineProperty(i, "metrics", { enumerable: true, get: function() {
            return y.metrics;
          } });
          let S = a(939);
          Object.defineProperty(i, "propagation", { enumerable: true, get: function() {
            return S.propagation;
          } });
          let _ = a(845);
          Object.defineProperty(i, "trace", { enumerable: true, get: function() {
            return _.trace;
          } }), i.default = { context: w.context, diag: v.diag, metrics: y.metrics, propagation: S.propagation, trace: _.trace };
        })(), e.exports = i;
      })();
    }, 133: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2)
              throw TypeError("argument str must be a string");
            for (var a2 = {}, i = t2.split(n), o = (r2 || {}).decode || e2, s = 0; s < i.length; s++) {
              var l = i[s], c = l.indexOf("=");
              if (!(c < 0)) {
                var d = l.substr(0, c).trim(), u = l.substr(++c, l.length).trim();
                '"' == u[0] && (u = u.slice(1, -1)), void 0 == a2[d] && (a2[d] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(u, o));
              }
            }
            return a2;
          }, t.serialize = function(e3, t2, n2) {
            var i = n2 || {}, o = i.encode || r;
            if ("function" != typeof o)
              throw TypeError("option encode is invalid");
            if (!a.test(e3))
              throw TypeError("argument name is invalid");
            var s = o(t2);
            if (s && !a.test(s))
              throw TypeError("argument val is invalid");
            var l = e3 + "=" + s;
            if (null != i.maxAge) {
              var c = i.maxAge - 0;
              if (isNaN(c) || !isFinite(c))
                throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(c);
            }
            if (i.domain) {
              if (!a.test(i.domain))
                throw TypeError("option domain is invalid");
              l += "; Domain=" + i.domain;
            }
            if (i.path) {
              if (!a.test(i.path))
                throw TypeError("option path is invalid");
              l += "; Path=" + i.path;
            }
            if (i.expires) {
              if ("function" != typeof i.expires.toUTCString)
                throw TypeError("option expires is invalid");
              l += "; Expires=" + i.expires.toUTCString();
            }
            if (i.httpOnly && (l += "; HttpOnly"), i.secure && (l += "; Secure"), i.sameSite)
              switch ("string" == typeof i.sameSite ? i.sameSite.toLowerCase() : i.sameSite) {
                case true:
                case "strict":
                  l += "; SameSite=Strict";
                  break;
                case "lax":
                  l += "; SameSite=Lax";
                  break;
                case "none":
                  l += "; SameSite=None";
                  break;
                default:
                  throw TypeError("option sameSite is invalid");
              }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, n = /; */, a = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 340: (e, t, r) => {
      var n;
      (() => {
        var a = { 226: function(a2, i2) {
          !function(o2, s2) {
            "use strict";
            var l = "function", c = "undefined", d = "object", u = "string", p = "major", h = "model", g = "name", f = "type", m = "vendor", b = "version", w = "architecture", v = "console", y = "mobile", S = "tablet", _ = "smarttv", x = "wearable", E = "embedded", P = "Amazon", R = "Apple", O = "ASUS", T = "BlackBerry", C = "Browser", N = "Chrome", A = "Firefox", I = "Google", k = "Huawei", M = "Microsoft", L = "Motorola", D = "Opera", j = "Samsung", U = "Sharp", V = "Sony", W = "Xiaomi", H = "Zebra", $ = "Facebook", q = "Chromium OS", B = "Mac OS", K = function(e2, t2) {
              var r2 = {};
              for (var n2 in e2)
                t2[n2] && t2[n2].length % 2 == 0 ? r2[n2] = t2[n2].concat(e2[n2]) : r2[n2] = e2[n2];
              return r2;
            }, J = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++)
                t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, G = function(e2, t2) {
              return typeof e2 === u && -1 !== F(t2).indexOf(F(e2));
            }, F = function(e2) {
              return e2.toLowerCase();
            }, z = function(e2, t2) {
              if (typeof e2 === u)
                return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === c ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, n2, a3, i3, o3, c2, u2 = 0; u2 < t2.length && !o3; ) {
                var p2 = t2[u2], h2 = t2[u2 + 1];
                for (r2 = n2 = 0; r2 < p2.length && !o3 && p2[r2]; )
                  if (o3 = p2[r2++].exec(e2))
                    for (a3 = 0; a3 < h2.length; a3++)
                      c2 = o3[++n2], typeof (i3 = h2[a3]) === d && i3.length > 0 ? 2 === i3.length ? typeof i3[1] == l ? this[i3[0]] = i3[1].call(this, c2) : this[i3[0]] = i3[1] : 3 === i3.length ? typeof i3[1] !== l || i3[1].exec && i3[1].test ? this[i3[0]] = c2 ? c2.replace(i3[1], i3[2]) : void 0 : this[i3[0]] = c2 ? i3[1].call(this, c2, i3[2]) : void 0 : 4 === i3.length && (this[i3[0]] = c2 ? i3[3].call(this, c2.replace(i3[1], i3[2])) : void 0) : this[i3] = c2 || s2;
                u2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2)
                if (typeof t2[r2] === d && t2[r2].length > 0) {
                  for (var n2 = 0; n2 < t2[r2].length; n2++)
                    if (G(t2[r2][n2], e2))
                      return "?" === r2 ? s2 : r2;
                } else if (G(t2[r2], e2))
                  return "?" === r2 ? s2 : r2;
              return e2;
            }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [b, [g, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [b, [g, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [g, b], [/opios[\/ ]+([\w\.]+)/i], [b, [g, D + " Mini"]], [/\bopr\/([\w\.]+)/i], [b, [g, D]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [g, b], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [b, [g, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [b, [g, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [b, [g, "WeChat"]], [/konqueror\/([\w\.]+)/i], [b, [g, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [b, [g, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [b, [g, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[g, /(.+)/, "$1 Secure " + C], b], [/\bfocus\/([\w\.]+)/i], [b, [g, A + " Focus"]], [/\bopt\/([\w\.]+)/i], [b, [g, D + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [b, [g, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [b, [g, "Dolphin"]], [/coast\/([\w\.]+)/i], [b, [g, D + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [b, [g, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [b, [g, A]], [/\bqihu|(qi?ho?o?|360)browser/i], [[g, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[g, /(.+)/, "$1 " + C], b], [/(comodo_dragon)\/([\w\.]+)/i], [[g, /_/g, " "], b], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [g, b], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [g], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[g, $], b], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [g, b], [/\bgsa\/([\w\.]+) .*safari\//i], [b, [g, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [b, [g, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [b, [g, N + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[g, N + " WebView"], b], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [b, [g, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [g, b], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [b, [g, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [b, g], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [g, [b, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [g, b], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[g, "Netscape"], b], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [b, [g, A + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [g, b], [/(cobalt)\/([\w\.]+)/i], [g, [b, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[w, "amd64"]], [/(ia32(?=;))/i], [[w, F]], [/((?:i[346]|x)86)[;\)]/i], [[w, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[w, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[w, "armhf"]], [/windows (ce|mobile); ppc;/i], [[w, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[w, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[w, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[w, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [h, [m, j], [f, S]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [h, [m, j], [f, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [h, [m, R], [f, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [h, [m, R], [f, S]], [/(macintosh);/i], [h, [m, R]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [h, [m, U], [f, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [h, [m, k], [f, S]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [h, [m, k], [f, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[h, /_/g, " "], [m, W], [f, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[h, /_/g, " "], [m, W], [f, S]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [h, [m, "OPPO"], [f, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [h, [m, "Vivo"], [f, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [h, [m, "Realme"], [f, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [h, [m, L], [f, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [h, [m, L], [f, S]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [h, [m, "LG"], [f, S]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [h, [m, "LG"], [f, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [h, [m, "Lenovo"], [f, S]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[h, /_/g, " "], [m, "Nokia"], [f, y]], [/(pixel c)\b/i], [h, [m, I], [f, S]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [h, [m, I], [f, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [h, [m, V], [f, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[h, "Xperia Tablet"], [m, V], [f, S]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [h, [m, "OnePlus"], [f, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [h, [m, P], [f, S]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[h, /(.+)/g, "Fire Phone $1"], [m, P], [f, y]], [/(playbook);[-\w\),; ]+(rim)/i], [h, m, [f, S]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [h, [m, T], [f, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [h, [m, O], [f, S]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [h, [m, O], [f, y]], [/(nexus 9)/i], [h, [m, "HTC"], [f, S]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [h, /_/g, " "], [f, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [h, [m, "Acer"], [f, S]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [h, [m, "Meizu"], [f, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, h, [f, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, h, [f, S]], [/(surface duo)/i], [h, [m, M], [f, S]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [h, [m, "Fairphone"], [f, y]], [/(u304aa)/i], [h, [m, "AT&T"], [f, y]], [/\bsie-(\w*)/i], [h, [m, "Siemens"], [f, y]], [/\b(rct\w+) b/i], [h, [m, "RCA"], [f, S]], [/\b(venue[\d ]{2,7}) b/i], [h, [m, "Dell"], [f, S]], [/\b(q(?:mv|ta)\w+) b/i], [h, [m, "Verizon"], [f, S]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [h, [m, "Barnes & Noble"], [f, S]], [/\b(tm\d{3}\w+) b/i], [h, [m, "NuVision"], [f, S]], [/\b(k88) b/i], [h, [m, "ZTE"], [f, S]], [/\b(nx\d{3}j) b/i], [h, [m, "ZTE"], [f, y]], [/\b(gen\d{3}) b.+49h/i], [h, [m, "Swiss"], [f, y]], [/\b(zur\d{3}) b/i], [h, [m, "Swiss"], [f, S]], [/\b((zeki)?tb.*\b) b/i], [h, [m, "Zeki"], [f, S]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], h, [f, S]], [/\b(ns-?\w{0,9}) b/i], [h, [m, "Insignia"], [f, S]], [/\b((nxa|next)-?\w{0,9}) b/i], [h, [m, "NextBook"], [f, S]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], h, [f, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], h, [f, y]], [/\b(ph-1) /i], [h, [m, "Essential"], [f, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [h, [m, "Envizen"], [f, S]], [/\b(trio[-\w\. ]+) b/i], [h, [m, "MachSpeed"], [f, S]], [/\btu_(1491) b/i], [h, [m, "Rotor"], [f, S]], [/(shield[\w ]+) b/i], [h, [m, "Nvidia"], [f, S]], [/(sprint) (\w+)/i], [m, h, [f, y]], [/(kin\.[onetw]{3})/i], [[h, /\./g, " "], [m, M], [f, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [h, [m, H], [f, S]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [h, [m, H], [f, y]], [/smart-tv.+(samsung)/i], [m, [f, _]], [/hbbtv.+maple;(\d+)/i], [[h, /^/, "SmartTV"], [m, j], [f, _]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, "LG"], [f, _]], [/(apple) ?tv/i], [m, [h, R + " TV"], [f, _]], [/crkey/i], [[h, N + "cast"], [m, I], [f, _]], [/droid.+aft(\w)( bui|\))/i], [h, [m, P], [f, _]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [h, [m, U], [f, _]], [/(bravia[\w ]+)( bui|\))/i], [h, [m, V], [f, _]], [/(mitv-\w{5}) bui/i], [h, [m, W], [f, _]], [/Hbbtv.*(technisat) (.*);/i], [m, h, [f, _]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, z], [h, z], [f, _]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[f, _]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, h, [f, v]], [/droid.+; (shield) bui/i], [h, [m, "Nvidia"], [f, v]], [/(playstation [345portablevi]+)/i], [h, [m, V], [f, v]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [h, [m, M], [f, v]], [/((pebble))app/i], [m, h, [f, x]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [h, [m, R], [f, x]], [/droid.+; (glass) \d/i], [h, [m, I], [f, x]], [/droid.+; (wt63?0{2,3})\)/i], [h, [m, H], [f, x]], [/(quest( 2| pro)?)/i], [h, [m, $], [f, x]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [f, E]], [/(aeobc)\b/i], [h, [m, P], [f, E]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [h, [f, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [h, [f, S]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[f, S]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[f, y]], [/(android[-\w\. ]{0,9});.+buil/i], [h, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [b, [g, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [b, [g, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [g, b], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [b, g]], os: [[/microsoft (windows) (vista|xp)/i], [g, b], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [g, [b, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[g, "Windows"], [b, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[b, /_/g, "."], [g, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[g, B], [b, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [b, g], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [g, b], [/\(bb(10);/i], [b, [g, T]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [b, [g, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [b, [g, A + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [b, [g, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [b, [g, "watchOS"]], [/crkey\/([\d\.]+)/i], [b, [g, N + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[g, q], b], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [g, b], [/(sunos) ?([\w\.\d]*)/i], [[g, "Solaris"], b], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [g, b]] }, ee = function(e2, t2) {
              if (typeof e2 === d && (t2 = e2, e2 = s2), !(this instanceof ee))
                return new ee(e2, t2).getResult();
              var r2 = typeof o2 !== c && o2.navigator ? o2.navigator : s2, n2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), a3 = r2 && r2.userAgentData ? r2.userAgentData : s2, i3 = t2 ? K(Q, t2) : Q, v2 = r2 && r2.userAgent == n2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[g] = s2, t3[b] = s2, X.call(t3, n2, i3.browser), t3[p] = typeof (e3 = t3[b]) === u ? e3.replace(/[^\d\.]/g, "").split(".")[0] : s2, v2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[g] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[w] = s2, X.call(e3, n2, i3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[m] = s2, e3[h] = s2, e3[f] = s2, X.call(e3, n2, i3.device), v2 && !e3[f] && a3 && a3.mobile && (e3[f] = y), v2 && "Macintosh" == e3[h] && r2 && typeof r2.standalone !== c && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[h] = "iPad", e3[f] = S), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[g] = s2, e3[b] = s2, X.call(e3, n2, i3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[g] = s2, e3[b] = s2, X.call(e3, n2, i3.os), v2 && !e3[g] && a3 && "Unknown" != a3.platform && (e3[g] = a3.platform.replace(/chrome os/i, q).replace(/macos/i, B)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return n2;
              }, this.setUA = function(e3) {
                return n2 = typeof e3 === u && e3.length > 350 ? z(e3, 350) : e3, this;
              }, this.setUA(n2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = J([g, b, p]), ee.CPU = J([w]), ee.DEVICE = J([h, m, f, v, y, _, S, x, E]), ee.ENGINE = ee.OS = J([g, b]), typeof i2 !== c ? (a2.exports && (i2 = a2.exports = ee), i2.UAParser = ee) : r.amdO ? void 0 !== (n = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = n) : typeof o2 !== c && (o2.UAParser = ee);
            var et = typeof o2 !== c && (o2.jQuery || o2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2)
                  et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, i = {};
        function o(e2) {
          var t2 = i[e2];
          if (void 0 !== t2)
            return t2.exports;
          var r2 = i[e2] = { exports: {} }, n2 = true;
          try {
            a[e2].call(r2.exports, r2, r2.exports, o), n2 = false;
          } finally {
            n2 && delete i[e2];
          }
          return r2.exports;
        }
        o.ab = "//";
        var s = o(226);
        e.exports = s;
      })();
    }, 488: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2)
          Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return o;
      }, withRequest: function() {
        return i;
      } });
      let n = new (r(67)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2)
          return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function i(e2, t2, r2) {
        let i2 = a(e2, t2);
        return i2 ? n.run(i2, r2) : r2();
      }
      function o(e2, t2) {
        return n.getStore() || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 375: (e, t, r) => {
      "use strict";
      var n = r(195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2)
          Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return s;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return i;
      } });
      let a = r(488), i = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function o(e2, t2) {
        let { url: r2, method: a2, headers: i2, body: o2, cache: s2, credentials: l2, integrity: c, mode: d, redirect: u, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: a2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++)
            if (e3[t3].length > 0) {
              e3 = e3.slice(t3);
              break;
            }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: o2 ? n.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: c, mode: d, redirect: u, referrer: p, referrerPolicy: h } };
      }
      async function s(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, i);
        if (!r2)
          return e2(t2);
        let { testData: s2, proxyPort: l2 } = r2, c = await o(s2, t2), d = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(c), next: { internal: true } });
        if (!d.ok)
          throw Error(`Proxy request failed: ${d.status}`);
        let u = await d.json(), { api: p } = u;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: a2 } = e3.response;
          return new Response(a2 ? n.from(a2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(u);
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var n2;
          return (null == r2 ? void 0 : null == (n2 = r2.next) ? void 0 : n2.internal) ? e2(t2, r2) : s(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 177: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2)
          Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return i;
      }, wrapRequestHandler: function() {
        return o;
      } });
      let n = r(488), a = r(375);
      function i() {
        return (0, a.interceptFetch)(r.g.fetch);
      }
      function o(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    } }, (e) => {
      var t = e(e.s = 376);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = t;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
globalThis._ENTRIES = {};
globalThis.self = globalThis;
globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(.json)?[\\/#\\?]?$"] }];
require_edge_runtime_webpack();
require_middleware();
async function edgeFunctionHandler(request) {
  const path = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
export {
  edgeFunctionHandler as default
};
