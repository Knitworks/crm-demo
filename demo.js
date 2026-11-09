/* Knitworks CRM — static demo mode (GitHub Pages).
   Replaces the server: answers the app's /api/ calls from sample data kept in this browser (localStorage).
   Every visitor gets their own copy; nothing is sent anywhere. The demo login only keeps casual
   visitors out; it is not security (the files are public). Only made-up sample data is included. */
(function () {
  "use strict";
  const DEMO_USER = "manager", DEMO_PASS = "knitworks-demo";
  const KEY = "kwdemo:db:v1", SESS = "kwdemo:session";
  const realFetch = window.fetch.bind(window);
  const pad = (n) => String(n).padStart(2, "0");
  const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const nowStr = () => { const d = new Date(); return `${isoDay(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  const DATE_FIELDS = ["at", "day", "contract_start", "contract_end", "last_contact", "expected", "deadline", "done_on", "start", "due", "last_booking", "reported", "since"];
  const TABLES = ["customers", "vendors", "contacts", "deals", "calls", "tasks", "people", "roles", "projects", "project_steps", "project_updates", "emails", "feed_loads", "audit"];
  const MODULE_OF = { customers: "customers", vendors: "vendors", contacts: "contacts", deals: "pipeline", calls: "calls", tasks: "tasks", people: "people", roles: "roles",
    projects: "projects", project_steps: "projects", project_updates: "projects", emails: "email" };
  const LABEL = { customers: "name", vendors: "name", contacts: "name", deals: "title", calls: "topic", tasks: "title", people: "name", roles: "name",
    projects: "title", project_steps: "title", project_updates: "note", emails: "subject" };

  // Shift every date in the sample data so "today" in the data is today in the browser.
  function shift(value, days) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
    const d = new Date(value.slice(0, 10) + "T12:00:00"); d.setDate(d.getDate() + days);
    return isoDay(d) + value.slice(10);
  }
  let DB = null, seedPromise = null;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* storage full or blocked: keep in memory */ } }
  async function load() {
    if (DB) return DB;
    try { const s = localStorage.getItem(KEY); if (s) { DB = JSON.parse(s); return DB; } } catch (e) { /* blocked */ }
    seedPromise = seedPromise || realFetch("seed.json").then((r) => r.json());
    const seed = await seedPromise;
    const days = Math.round((Date.parse(isoDay(new Date()) + "T12:00:00") - Date.parse(seed.seed_day + "T12:00:00")) / 864e5);
    DB = { farm: seed.farm, lang: seed.lang || null, modules: seed.modules, next: 100000 };
    for (const t of TABLES) DB[t] = (seed.tables[t] || []).map((r) => { const o = Object.assign({}, r); DATE_FIELDS.forEach((f) => { if (f in o) o[f] = shift(o[f], days); }); return o; });
    save();
    return DB;
  }
  const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { "Content-Type": "application/json" } });
  const me = () => DB.people.find((p) => p.username === "admin") || { id: 0, name: "Manager" };
  const audit = (action, entity, id, summary) => { DB.audit.unshift({ id: ++DB.next, at: nowStr(), user_id: me().id, user_name: "Demo Manager", action, entity, entity_id: id, summary: String(summary || "").slice(0, 300) }); };

  function bootstrap() {
    const admin = DB.roles.find((r) => r.name === "Admin");
    const perms = admin ? admin.perms : {};
    const loads = DB.feed_loads;
    const by = {};
    loads.forEach((l) => { const w = by[l.operator] || (by[l.operator] = { operator: l.operator, loads: 0, actual: 0, planned: 0, acc: 0, n: 0, first_day: l.day, last_day: l.day, g: new Set() });
      w.loads++; w.actual += l.actual || 0; w.planned += l.planned || 0; if (l.accuracy != null) { w.acc += l.accuracy; w.n++; }
      if (l.day < w.first_day) w.first_day = l.day; if (l.day > w.last_day) w.last_day = l.day; w.g.add(l.grp); });
    const feed_workers = Object.values(by).map((w) => ({ operator: w.operator, loads: w.loads, actual: Math.round(w.actual), planned: Math.round(w.planned),
      accuracy: w.n ? Math.round((w.acc / w.n) * 10) / 10 : null, first_day: w.first_day, last_day: w.last_day, groups: [...w.g].join(",") })).sort((a, b) => b.loads - a.loads);
    const maxDay = loads.reduce((m, l) => (l.day > m ? l.day : m), "");
    const from = maxDay ? shift(maxDay, -27) : "";
    const days = {};
    loads.filter((l) => l.day >= from).forEach((l) => { const k = l.operator + "|" + l.day; const d = days[k] || (days[k] = { operator: l.operator, day: l.day, loads: 0, acc: 0, n: 0 });
      d.loads++; if (l.accuracy != null) { d.acc += l.accuracy; d.n++; } });
    const feed_days = Object.values(days).map((d) => ({ operator: d.operator, day: d.day, loads: d.loads, accuracy: d.n ? Math.round((d.acc / d.n) * 10) / 10 : null })).sort((a, b) => a.day.localeCompare(b.day));
    const m = me();
    return { me: { id: m.id, name: "Demo Manager", username: DEMO_USER, role: "Admin" }, perms, today: isoDay(new Date()), modules: DB.modules,
      customers: DB.customers, vendors: DB.vendors, contacts: DB.contacts, deals: DB.deals, calls: DB.calls, tasks: DB.tasks,
      people: DB.people, roles: DB.roles, projects: DB.projects, project_steps: DB.project_steps, project_updates: DB.project_updates,
      emails: DB.emails, farm: DB.farm, lang: DB.lang, feed_workers, feed_days,
      sample_count: ["customers", "vendors", "contacts", "deals", "calls", "tasks", "people", "projects", "emails"].reduce((s, t) => s + DB[t].filter((r) => r.sample).length, 0) };
  }

  function write(ent, id, body) {
    const ts = nowStr(), list = DB[ent];
    const data = Object.assign({}, body); delete data.password; delete data.id;
    if (ent === "project_steps" && "done" in data) data.done_on = data.done ? isoDay(new Date()) : "";
    if (ent === "roles" && data.perms) { const p = {}; DB.modules.forEach((mm) => (p[mm] = ["none", "see", "edit"].includes(data.perms[mm]) ? data.perms[mm] : "none")); data.perms = p; }
    if (id == null) {
      const req = LABEL[ent];
      if (!String(data[req] || "").trim()) return json(400, { error: `${req} is required` });
      if (ent === "project_updates") Object.assign(data, { at: ts.slice(0, 16), author: "Demo Manager" });
      if (ent === "emails") Object.assign(data, { at: ts.slice(0, 16), sent_by: "Demo Manager" });
      if (ent === "roles" && !data.perms) { data.perms = {}; DB.modules.forEach((mm) => (data.perms[mm] = "none")); }
      const rec = Object.assign({ id: ++DB.next, sample: 0, created: ts, updated: ts }, data);
      list.push(rec); audit("created", ent, rec.id, rec[LABEL[ent]]); save(); return json(200, rec);
    }
    const rec = list.find((r) => r.id === id);
    if (!rec) return json(404, { error: "not found" });
    Object.assign(rec, data, ent === "roles" ? {} : { updated: ts });
    audit("changed", ent, id, `${rec[LABEL[ent]]} (${Object.keys(data).join(", ")})`); save(); return json(200, rec);
  }

  async function handle(method, path, body) {
    await load();
    if (path === "/api/login") {
      if (body.username === DEMO_USER && body.password === DEMO_PASS) { sessionStorage.setItem(SESS, "1"); return json(200, { ok: true }); }
      return json(401, { error: "Wrong user or password." });
    }
    if (path === "/api/public/book") {
      if (!body.name || !(body.email || body.phone) || !body.topic) return json(400, { error: "Please give your name, a way to reach you and a topic." });
      const id = ++DB.next;
      DB.calls.push({ id, at: String(body.when || "").replace("T", " ").slice(0, 16), topic: body.topic, status: "requested", source: "booking",
        req_name: body.name, req_org: body.org || "", req_email: body.email || "", req_phone: body.phone || "", sample: 0, created: nowStr(), updated: nowStr() });
      audit("requested", "calls", id, `${body.name}: ${body.topic}`); save(); return json(200, { ok: true });
    }
    if (!sessionStorage.getItem(SESS)) return json(401, { error: "login" });
    if (path === "/api/logout") { sessionStorage.removeItem(SESS); return json(200, { ok: true }); }
    if (path === "/api/bootstrap") return json(200, bootstrap());
    if (path === "/api/audit") return json(200, DB.audit.slice(0, 300));
    if (path === "/api/settings/lang") { DB.lang = body; save(); return json(200, { ok: true }); }
    if (path === "/api/settings/farm") { DB.farm = { name: String(body.name || "").slice(0, 120) }; save(); return json(200, { ok: true }); }
    if (path === "/api/admin/remove-sample") {
      let n = 0; for (const t of ["project_updates", "project_steps", "projects", "emails", "deals", "calls", "contacts", "vendors", "customers", "tasks", "people", "feed_loads"]) { const before = DB[t].length; DB[t] = DB[t].filter((r) => !r.sample); n += before - DB[t].length; }
      audit("deleted", "sample", null, `${n} sample records`); save(); return json(200, { removed: n });
    }
    if (path === "/api/import/contacts") {
      let added = 0; (body.rows || []).forEach((r) => { if (!r.name) return; DB.contacts.push({ id: ++DB.next, name: r.name, org_kind: "other", org_id: null, title: r.title || "", phone: r.phone || "", email: r.email || "", language: r.language || "", sample: 0 }); added++; });
      save(); return json(200, { added });
    }
    if (path === "/api/import/feed") {
      let added = 0; (body.rows || []).forEach((r) => { const day = String(r.Datum || "").slice(0, 10), op = r.operatorName || r.OperatorName; if (!day || !op) return;
        DB.feed_loads.push({ day, grp: r.Gruppe || "", operator: op, feed: r.Futtermittelbezeichnung || "", planned: Number(r.plannedQuantity) || 0, actual: Number(r.Menge) || 0, accuracy: r.accuracy ? Number(r.accuracy) : null, sample: 0 }); added++; });
      save(); return json(200, { added });
    }
    const m = path.match(/^\/api\/([a-z_]+)(?:\/(\d+))?$/);
    if (m && MODULE_OF[m[1]]) {
      const ent = m[1], id = m[2] ? Number(m[2]) : null;
      if (method === "POST" && id == null) return write(ent, null, body);
      if (method === "PATCH" && id != null) return write(ent, id, body);
      if (method === "DELETE" && id != null) {
        const rec = DB[ent].find((r) => r.id === id); if (!rec) return json(404, { error: "not found" });
        DB[ent] = DB[ent].filter((r) => r.id !== id); audit("deleted", ent, id, rec[LABEL[ent]]); save(); return json(200, { ok: true });
      }
    }
    return json(404, { error: "not found" });
  }

  window.fetch = function (input, init) {
    const url = new URL(typeof input === "string" ? input : input.url, location.href);
    const i = url.pathname.indexOf("/api/");
    if (i < 0) return realFetch(input, init);
    const method = ((init && init.method) || "GET").toUpperCase();
    let body = {};
    try { body = init && init.body ? JSON.parse(init.body) : {}; } catch (e) { body = {}; }
    return handle(method, url.pathname.slice(i), body);
  };
  window.KW_DEMO = { reset() { try { localStorage.removeItem(KEY); } catch (e) { /* blocked */ } DB = null; location.reload(); } };
})();
