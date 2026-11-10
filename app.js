/* Knitworks CRM v2 — review prototype. Plain JavaScript, no build step. */
(function () {
  "use strict";

  /* ================= helpers ================= */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("kw2:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("kw2:" + k, JSON.stringify(v)); } catch (e) { /* blocked */ } },
  };
  const ICON = {
    users: '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6"/></svg>',
    truck: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    phone: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    task: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>',
    euro: '<svg class="icon" viewBox="0 0 24 24"><path d="M17 6a7 7 0 1 0 0 12M4 10h9M4 14h9"/></svg>',
    inbox: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    feed: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bell: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    alert: '<svg class="icon" viewBox="0 0 24 24"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
    doc: '<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>',
    grid: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    sun: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M9 15l2 2 4-4"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    link: '<svg class="icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    layers: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    chart: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    shield: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    gear: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24"><path d="M9 4h6l-1 6 4 4H6l4-4zM12 14v7"/></svg>',
  };

  /* ================= texts (English built in, German for the main labels; Admin can add languages) ================= */
  const BUILTIN = {
    en: { name: "English", locale: "en-GB", strings: {
      overview: "Dashboard", customers: "Buyers", vendors: "Suppliers", contacts: "Contacts", pipeline: "Sales pipeline", calls: "Activities",
      tasks: "Tasks", workers: "Workers", reports: "Reports", roles: "Roles", admin: "Admin", logout: "Log out",
      cases: "Cases", documents: "Documents", projects: "Projects", schedule: "Schedule", today_page: "Today", email: "Email",
      grp_main: "Overview", grp_production: "Production", grp_partners: "Partners", grp_insights: "Insights", grp_settings: "Settings",
      pin: "Keep the menu open", unpin: "Let the menu close",
      welcome: "Welcome back, {name}.", ov_sub: "Production, partners, workers and what needs doing today.",
      open_pipeline: "Open pipeline", weighted: "{v} weighted by stage", calls_week: "Activities next 7 days", today_n: "{n} today",
      open_tasks: "Open tasks", urgent_n: "{n} urgent", requests: "Booking requests", from_form: "from the Book a call form",
      volume_year: "Partner volume this year", read_only_fin: "Read only, from finance", top_customers: "Top buyers (income)",
      top_vendors: "Top suppliers (spend)", today: "Today", nothing_today: "Nothing planned for today.", due_call: "Due a call",
      longest: "Longest since we spoke", workers_latest: "Feeding: latest day", recent: "Recent activity", view_all: "View all",
      new: "New", new_customer: "New buyer", new_vendor: "New supplier", new_contact: "New contact", new_deal: "New deal",
      new_call: "New activity", new_task: "New task", new_worker: "New person", new_role: "New role",
      search: "Search", all: "All", favourites: "Favourites", name: "Name", type: "Type", status: "Status", owner: "Owner",
      volume: "Volume this year", spend: "Spend this year", last_booking: "Last booking", contract_end: "Contract ends",
      organisation: "Organisation", title: "Title", phone: "Phone", email_addr: "Email", last_contact: "Last contact", language: "Language",
      city: "City", country: "Country", level: "Area level", notes: "Notes", code: "Code", contract_start: "Contract starts",
      customer: "Buyer", supplier: "Supplier", stage: "Stage", value: "Value (EUR)", expected: "Expected", when: "When", topic: "Topic", contact: "Contact",
      outcome: "Outcome", area: "Area", priority: "Priority", deadline: "Deadline", reason: "Why this priority", next: "Next step",
      job: "Job", role: "Role", operator: "CowConnect operator name", username: "Login name", password: "New password", active: "Active",
      kind: "Type", place: "Place", opened: "Opened", resolved_on: "Resolved on", description: "Description", resolution: "Resolution",
      valid_from: "Valid from", valid_until: "Valid until", link: "Link (file or web address)",
      save: "Save", delete: "Delete", cancel: "Cancel", close: "Close", saved: "Saved.", deleted: "Deleted.", confirm_delete: "Delete {name}?",
      showing: "{a} of {b}", none_here: "Nothing here yet.", sample_tag: "sample", contacts_of: "Contacts", deals_of: "Deals",
      calls_of: "Activities", cases_of: "Cases", docs_of: "Documents", ends_in: "ends in {n} days", ended: "ended", no_access: "You have no access to this page.",
      sample_banner: "This CRM shows made-up sample data. Admin can remove it with one click.",
      upcoming: "Upcoming", history: "History", accept: "Accept", decline: "Decline", copy_link: "Copy Book a call link",
      link_copied: "Link copied.", requested_by: "Requested by {name}", no_time: "No time given",
      board: "Board", total: "Total", open_deals: "{n} open deals", odds: "{n}% odds", drag_hint: "Drag a card to another stage.",
      tiles_urgent: "urgent", tiles_waiting: "reported done, waiting for check", tiles_noowner: "need an owner", tiles_decision: "wait for a decision",
      all_tasks: "All tasks", g_waiting: "Reported done – waiting for check", g_urgent: "Urgent", g_week: "This week", g_later: "Later",
      g_none: "No action needed", g_done: "Done (last 30 days)", report_done: "Report done", confirm: "Confirm", not_done: "Not done",
      mark_done: "Mark done", edit: "Edit", not_replied: "Not replied", flow_open: "Open", flow_reported: "Reported done", flow_confirmed: "Confirmed",
      feeding: "Feeding activity", loads: "loads", accuracy: "accuracy", planned_actual: "{a} of {p} kg planned", groups: "Feed groups",
      first_last: "{f} to {l}", login_yes: "Has login", login_no: "No login", from_cowconnect: "Shape of CowConnect Futterdaten (sample data)",
      everyone: "Everyone", rep_pipeline: "Pipeline value by stage", rep_calls: "Activities by type", rep_feed: "Feed loads per worker, last 8 weeks",
      rep_cust: "Buyers by income this year", rep_vend: "Supplier spend by type", rep_tasks: "Open tasks by priority",
      rep_cases: "Open cases by type", rep_docs: "Documents by status",
      farm: "Farm", farm_name: "Farm name", sample_data: "Sample data", sample_n: "{n} sample records", remove_sample: "Remove sample data",
      remove_confirm: "Remove all sample data? Real data you entered stays.", import_contacts: "Import contacts (CSV)",
      import_feed: "Import feed loads (CowConnect CSV)", import_hint: "CSV with a header row. Contacts: name, organisation, title, phone, email, language. Feed: Datum, Gruppe, operatorName, Futtermittelbezeichnung, plannedQuantity, Menge, accuracy.",
      imported: "{n} rows added.", languages: "Languages", default_lang: "Default language for everyone", add_lang: "Add language",
      lang_code: "Code (e.g. nl)", lang_name: "Name", translate: "Translate", only_missing: "Only not translated", missing_n: "{n} not translated",
      changelog: "Change log", rights: "Rights per module", none: "No access", see: "See", edit_r: "Edit", data_sources: "Data sources",
      ds_hint: "Where real farm data would come from (schema only): see app/DATA_SOURCES.md.",
      pages_buttons: "Pages and buttons", pb_hint: "Choose which pages and top buttons everyone sees. Roles still decide who may open what.",
      pages: "Pages in the menu", buttons: "Buttons in the top bar", shown: "Shown", hidden: "Hidden",
      btn_search: "Search", btn_new: "New", btn_today: "Today", btn_email: "Email", btn_booklink: "Book a call link", btn_bell: "Notifications",
      btn_lang: "Language", btn_theme: "Light / dark",
      o_dairy: "Dairy (milk buyer)", o_cattle_buyer: "Cattle buyer", o_biogas: "Biogas / energy", o_crop_buyer: "Crop buyer", o_private: "Private",
      o_other: "Other", o_lead: "Prospect", o_active: "Active", o_paused: "Paused", o_former: "Former", o_feed_supplier: "Feed supplier",
      o_vet: "Vet", o_breeding: "Breeding", o_machinery: "Machinery", o_service: "Service", o_advisor: "Advisor", o_farm: "Our farm",
      o_customer: "Buyer", o_vendor: "Supplier", o_first_call: "First call", o_demo: "Demo / visit", o_proposal: "Proposal", o_won: "Won",
      o_lost: "Lost", o_requested: "Requested", o_planned: "Planned", o_done: "Done", o_missed: "Missed", o_cancelled: "Cancelled",
      o_urgent: "Urgent", o_week: "This week", o_later: "Later", o_none: "No action", o_decision: "Decision needed", o_reported: "Reported done",
      o_notdone: "Not done", o_confirmed: "Confirmed", o_fin: "Finance", o_prod: "Product and buyers", o_animal: "Processes: animal",
      o_plant: "Processes: plant", o_res: "Resources", o_platform: "Platform", o_app: "App", o_sec: "Security", o_kb: "Knowledge", o_gen: "General",
      o_planning: "Planning", o_review: "Review",
      o_call: "Call", o_visit: "Farm visit", o_inspection: "Inspection", o_meeting: "Meeting",
      o_quality: "Milk quality", o_animal_health: "Animal health", o_supply: "Supply", o_equipment: "Equipment", o_safety: "Safety", o_complaint: "Complaint",
      o_high: "High", o_medium: "Medium", o_low: "Low", o_open: "Open", o_in_progress: "In progress", o_waiting: "Waiting", o_resolved: "Resolved", o_closed: "Closed",
      o_certificate: "Certificate", o_contract: "Contract", o_sop: "SOP", o_inspection_report: "Inspection report",
      l_finance: "Finance", l_product: "Product and buyers", l_process: "Internal processes", l_resources: "Resources", l_foundation: "Foundation",
      new_project: "New project", prj_sub: "Every farm project with its steps and progress.", active_projects: "Active projects", steps_week: "Steps done this week",
      next_due: "Next due", overall: "Overall progress", in_days: "in {n} days", days_ago: "{n} days late", of_steps: "{a} of {b}",
      all_done: "All done", no_steps: "No steps yet", steps: "Steps", add_step: "Add a step", progress_updates: "Progress updates",
      add_update: "Add update", update_ph: "What happened? e.g. offers received, vet visit booked", due: "Due", start: "Start",
      subtitle: "Where / what", open: "Open",
      sch_sub: "Activities, farm visits, deadlines, project due dates and contract ends in one calendar.", today_btn: "Today", prev: "Previous", next_m: "Next",
      v_week: "Week", v_month: "Month", v_agenda: "Agenda",
      ev_call: "Activity", ev_task: "Task deadline", ev_deal: "Deal expected", ev_project: "Project due", ev_contract: "Contract ends", ev_case: "Case due", more_n: "+{n} more",
      td_sub: "Everything that needs you today.", calls_today: "Activities today", tasks_due: "Overdue and urgent tasks", steps_next: "Next project steps",
      contracts_soon: "Contracts ending in 30 days", nothing: "Nothing here.", late: "late",
      em_sub: "Write to buyers, suppliers and workers. Every email is logged.", compose: "Write an email", to: "To",
      or_email: "or type an email address", template: "Template", subject: "Subject", message: "Message",
      send_app: "Open in my email app", log_only: "Save to log only", sent_log: "Sent emails", email_logged: "Email saved to the log.",
      write_email: "Write email", tpl_none: "No template", tpl_followup: "Follow-up", tpl_renewal: "Contract renewal",
      tpl_confirm: "Visit confirmation", tpl_thanks: "Thank you",
      notif: "Notifications", notif_none: "All clear. Nothing needs attention.", n_requests: "{n} booking requests",
      n_overdue: "{n} overdue tasks", n_contracts: "{n} contracts end within 30 days", n_projects: "{n} projects due within 7 days",
      n_missed: "{n} missed activities this week", n_cases: "{n} high-priority cases open", n_docs: "{n} documents expire within 60 days",
      search_all: "Search buyers, suppliers, contacts, cases, documents, projects, tasks…", export: "Export CSV",
      prj_in_progress: "Projects in progress",
      new_case: "New case", cases_sub: "Quality, animal health, supply and equipment issues, followed until they are solved.",
      open_cases: "Open cases", high_n: "{n} high priority", overdue_n: "{n} overdue", resolved_month: "Resolved in 30 days",
      new_document: "New document", docs_sub: "Certificates, contracts, SOPs and inspection reports with their expiry dates.",
      valid: "Valid", expiring: "Expiring within 60 days", expired: "Expired", no_expiry: "No expiry date", open_link: "Open",
      act_sub: "Calls, farm visits, services, inspections and meetings with partners.",
      k_milk: "Milk, kg ECM", vs_avg: "{v} vs 7-day average", k_cows: "Milking cows", milk_cow: "{v} kg per cow", k_cells: "Somatic cells (1000/ml)",
      above_limit: "above limit", limit_n: "limit {n}", k_preg: "Pregnant (TU+)", inseminated_n: "{n}% inseminated", cells_case: "Somatic cells high ({n}k): check with dairy",
      create_case: "Create case", fmis_title: "Farm performance", fmis_sub: "From FMIS, read only. Same fields for every farm on FMIS.", crm_title: "Work and partners",
      ch_milk: "Milk delivered (kg ECM)", last_60: "last 60 days", last_28: "last 28 days", last_6m: "last 6 months", kg_ecm_day: "kg ECM per day", avg7: "7-day average",
      dairy_link: "Dairy", ch_quality: "Milk quality", cells_unit: "somatic cells, 1000/ml", fat: "Fat", protein: "Protein", urea: "Urea", ch_herd: "Herd",
      lact_days: "Days in milk", ch_losses: "Losses and sales", died_cows: "Cows died", died_young: "Young stock died", died_calves: "Calves died", sold_cows: "Cows sold",
      vet_link: "Vet", ch_repro: "Fertility status", ch_feed: "Feeding accuracy per worker",
      rs_pregnant: "Pregnant (TU+)", rs_inseminated: "Inseminated, not checked", rs_open: "Open, ready to breed", rs_fresh: "Fresh, waiting period", rs_dnb: "Do not breed",
      visits_week: "Visits and services, 7 days", feed_acc: "Feeding accuracy", latest_day: "latest day", docs_expiring: "Documents expiring",
      within_60: "within 60 days", expired_n: "{n} expired", overdue_lbl: "Overdue", open_cases_list: "Open cases", visits_list: "Visits and services",
    } },
    de: { name: "Deutsch", locale: "de-DE", strings: {
      overview: "Dashboard", customers: "Abnehmer", vendors: "Lieferanten", contacts: "Kontakte", pipeline: "Vertriebs-Pipeline", calls: "Aktivitäten",
      tasks: "Aufgaben", workers: "Mitarbeitende", reports: "Berichte", roles: "Rollen", admin: "Admin", logout: "Abmelden",
      cases: "Vorgänge", documents: "Dokumente", projects: "Projekte", schedule: "Kalender", today_page: "Heute", email: "E-Mail",
      grp_main: "Übersicht", grp_production: "Produktion", grp_partners: "Partner", grp_insights: "Auswertung", grp_settings: "Einstellungen",
      pin: "Menü offen halten", unpin: "Menü automatisch schließen",
      welcome: "Willkommen zurück, {name}.", ov_sub: "Produktion, Partner, Mitarbeitende und was heute zu tun ist.",
      open_pipeline: "Offene Pipeline", weighted: "{v} gewichtet nach Phase", calls_week: "Aktivitäten nächste 7 Tage", today_n: "{n} heute",
      open_tasks: "Offene Aufgaben", urgent_n: "{n} dringend", requests: "Terminanfragen", from_form: "aus dem Formular „Termin anfragen“",
      volume_year: "Partnervolumen dieses Jahr", read_only_fin: "Nur lesen, aus der Buchhaltung", top_customers: "Größte Abnehmer (Erlös)",
      top_vendors: "Größte Lieferanten (Ausgaben)", today: "Heute", nothing_today: "Für heute ist nichts geplant.", due_call: "Anruf fällig",
      longest: "Am längsten ohne Kontakt", workers_latest: "Fütterung: letzter Tag", recent: "Letzte Aktivität", view_all: "Alle anzeigen",
      new: "Neu", new_customer: "Neuer Abnehmer", new_vendor: "Neuer Lieferant", new_contact: "Neuer Kontakt", new_deal: "Neues Geschäft",
      new_call: "Neue Aktivität", new_task: "Neue Aufgabe", new_worker: "Neue Person", new_role: "Neue Rolle",
      search: "Suchen", all: "Alle", favourites: "Favoriten", name: "Name", type: "Typ", status: "Status", owner: "Zuständig",
      volume: "Volumen dieses Jahr", spend: "Ausgaben dieses Jahr", last_booking: "Letzte Buchung", contract_end: "Vertragsende",
      organisation: "Organisation", title: "Funktion", phone: "Telefon", email_addr: "E-Mail", last_contact: "Letzter Kontakt", language: "Sprache",
      city: "Ort", country: "Land", level: "Bereichsebene", notes: "Notizen", code: "Kürzel", contract_start: "Vertragsbeginn",
      customer: "Abnehmer", supplier: "Lieferant", stage: "Phase", value: "Wert (EUR)", expected: "Erwartet", when: "Wann", topic: "Thema", contact: "Kontakt",
      outcome: "Ergebnis", area: "Bereich", priority: "Priorität", deadline: "Frist", reason: "Warum diese Priorität", next: "Nächster Schritt",
      job: "Tätigkeit", role: "Rolle", operator: "CowConnect-Bedienername", username: "Anmeldename", password: "Neues Passwort", active: "Aktiv",
      kind: "Art", place: "Ort", opened: "Eröffnet", resolved_on: "Gelöst am", description: "Beschreibung", resolution: "Lösung",
      valid_from: "Gültig ab", valid_until: "Gültig bis", link: "Link (Datei oder Webadresse)",
      save: "Speichern", delete: "Löschen", cancel: "Abbrechen", close: "Schließen", saved: "Gespeichert.", deleted: "Gelöscht.", confirm_delete: "{name} löschen?",
      showing: "{a} von {b}", none_here: "Hier ist noch nichts.", sample_tag: "Beispiel", contacts_of: "Kontakte", deals_of: "Geschäfte",
      calls_of: "Aktivitäten", cases_of: "Vorgänge", docs_of: "Dokumente", ends_in: "endet in {n} Tagen", ended: "beendet", no_access: "Kein Zugriff auf diese Seite.",
      sample_banner: "Dieses CRM zeigt erfundene Beispieldaten. Admin kann sie mit einem Klick entfernen.",
      upcoming: "Anstehend", history: "Verlauf", accept: "Annehmen", decline: "Ablehnen", copy_link: "Link „Termin anfragen“ kopieren",
      link_copied: "Link kopiert.", requested_by: "Angefragt von {name}", no_time: "Keine Zeit angegeben",
      board: "Board", total: "Gesamt", open_deals: "{n} offene Geschäfte", odds: "{n} % Chance", drag_hint: "Karte in eine andere Phase ziehen.",
      tiles_urgent: "dringend", tiles_waiting: "erledigt gemeldet, Prüfung offen", tiles_noowner: "ohne Zuständigen", tiles_decision: "warten auf Entscheidung",
      all_tasks: "Alle Aufgaben", g_waiting: "Erledigt gemeldet – Prüfung offen", g_urgent: "Dringend", g_week: "Diese Woche", g_later: "Später",
      g_none: "Nichts zu tun", g_done: "Erledigt (letzte 30 Tage)", report_done: "Erledigt melden", confirm: "Bestätigen", not_done: "Nicht erledigt",
      mark_done: "Erledigt", edit: "Bearbeiten", not_replied: "Nicht beantwortet", flow_open: "Offen", flow_reported: "Erledigt gemeldet", flow_confirmed: "Bestätigt",
      feeding: "Fütterung", loads: "Ladungen", accuracy: "Genauigkeit", planned_actual: "{a} von {p} kg geplant", groups: "Futtergruppen",
      first_last: "{f} bis {l}", login_yes: "Hat Anmeldung", login_no: "Keine Anmeldung", from_cowconnect: "Aufbau wie CowConnect-Futterdaten (Beispieldaten)",
      everyone: "Alle", rep_pipeline: "Pipeline-Wert nach Phase", rep_calls: "Aktivitäten nach Art", rep_feed: "Futterladungen je Mitarbeitendem, letzte 8 Wochen",
      rep_cust: "Abnehmer nach Erlös dieses Jahr", rep_vend: "Lieferantenausgaben nach Art", rep_tasks: "Offene Aufgaben nach Priorität",
      rep_cases: "Offene Vorgänge nach Art", rep_docs: "Dokumente nach Status",
      farm: "Betrieb", farm_name: "Name des Betriebs", sample_data: "Beispieldaten", sample_n: "{n} Beispieldatensätze", remove_sample: "Beispieldaten entfernen",
      remove_confirm: "Alle Beispieldaten entfernen? Eigene Daten bleiben erhalten.", import_contacts: "Kontakte importieren (CSV)",
      import_feed: "Futterladungen importieren (CowConnect-CSV)", import_hint: "CSV mit Kopfzeile. Kontakte: name, organisation, title, phone, email, language. Futter: Datum, Gruppe, operatorName, Futtermittelbezeichnung, plannedQuantity, Menge, accuracy.",
      imported: "{n} Zeilen hinzugefügt.", languages: "Sprachen", default_lang: "Standardsprache für alle", add_lang: "Sprache hinzufügen",
      lang_code: "Code (z. B. nl)", lang_name: "Name", translate: "Übersetzen", only_missing: "Nur nicht übersetzte", missing_n: "{n} nicht übersetzt",
      changelog: "Änderungsprotokoll", rights: "Rechte je Modul", none: "Kein Zugriff", see: "Lesen", edit_r: "Bearbeiten", data_sources: "Datenquellen",
      ds_hint: "Woher echte Betriebsdaten kämen (nur Struktur): siehe app/DATA_SOURCES.md.",
      pages_buttons: "Seiten und Schaltflächen", pb_hint: "Festlegen, welche Seiten und oberen Schaltflächen alle sehen. Die Rollen bestimmen weiterhin, wer was öffnen darf.",
      pages: "Seiten im Menü", buttons: "Schaltflächen oben", shown: "Sichtbar", hidden: "Ausgeblendet",
      btn_search: "Suche", btn_new: "Neu", btn_today: "Heute", btn_email: "E-Mail", btn_booklink: "Link „Termin anfragen“", btn_bell: "Benachrichtigungen",
      btn_lang: "Sprache", btn_theme: "Hell / dunkel",
      o_dairy: "Molkerei (Milchabnehmer)", o_cattle_buyer: "Viehhändler", o_biogas: "Biogas / Energie", o_crop_buyer: "Getreideabnehmer", o_private: "Privat",
      o_other: "Sonstiges", o_lead: "Interessent", o_active: "Aktiv", o_paused: "Pausiert", o_former: "Ehemalig", o_feed_supplier: "Futtermittellieferant",
      o_vet: "Tierarzt", o_breeding: "Zucht", o_machinery: "Landtechnik", o_service: "Dienstleistung", o_advisor: "Berater", o_farm: "Unser Betrieb",
      o_customer: "Abnehmer", o_vendor: "Lieferant", o_first_call: "Erstgespräch", o_demo: "Vorführung / Besuch", o_proposal: "Angebot", o_won: "Gewonnen",
      o_lost: "Verloren", o_requested: "Angefragt", o_planned: "Geplant", o_done: "Erledigt", o_missed: "Verpasst", o_cancelled: "Abgesagt",
      o_urgent: "Dringend", o_week: "Diese Woche", o_later: "Später", o_none: "Nichts zu tun", o_decision: "Entscheidung nötig", o_reported: "Erledigt gemeldet",
      o_notdone: "Nicht erledigt", o_confirmed: "Bestätigt", o_fin: "Finanzen", o_prod: "Produkt und Abnehmer", o_animal: "Prozesse: Tier",
      o_plant: "Prozesse: Pflanze", o_res: "Ressourcen", o_platform: "Plattform", o_app: "App", o_sec: "Sicherheit", o_kb: "Wissen", o_gen: "Allgemein",
      o_planning: "Planung", o_review: "Prüfung",
      o_call: "Anruf", o_visit: "Hofbesuch", o_inspection: "Kontrolle", o_meeting: "Besprechung",
      o_quality: "Milchqualität", o_animal_health: "Tiergesundheit", o_supply: "Lieferung", o_equipment: "Technik", o_safety: "Arbeitssicherheit", o_complaint: "Reklamation",
      o_high: "Hoch", o_medium: "Mittel", o_low: "Niedrig", o_open: "Offen", o_in_progress: "In Arbeit", o_waiting: "Wartet", o_resolved: "Gelöst", o_closed: "Abgeschlossen",
      o_certificate: "Zertifikat", o_contract: "Vertrag", o_sop: "Arbeitsanweisung", o_inspection_report: "Prüfbericht",
      l_finance: "Finanzen", l_product: "Produkt und Abnehmer", l_process: "Interne Prozesse", l_resources: "Ressourcen", l_foundation: "Fundament",
      new_project: "Neues Projekt", prj_sub: "Jedes Betriebsprojekt mit seinen Schritten und seinem Fortschritt.", active_projects: "Aktive Projekte", steps_week: "Schritte erledigt diese Woche",
      next_due: "Als Nächstes fällig", overall: "Gesamtfortschritt", in_days: "in {n} Tagen", days_ago: "{n} Tage überfällig", of_steps: "{a} von {b}",
      all_done: "Alles erledigt", no_steps: "Noch keine Schritte", steps: "Schritte", add_step: "Schritt hinzufügen", progress_updates: "Fortschrittsberichte",
      add_update: "Bericht hinzufügen", update_ph: "Was ist passiert? z. B. Angebote erhalten, Tierarzttermin gebucht", due: "Fällig", start: "Beginn",
      subtitle: "Wo / was", open: "Öffnen",
      sch_sub: "Aktivitäten, Hofbesuche, Fristen, Projekttermine und Vertragsenden in einem Kalender.", today_btn: "Heute", prev: "Zurück", next_m: "Weiter",
      v_week: "Woche", v_month: "Monat", v_agenda: "Liste",
      ev_call: "Aktivität", ev_task: "Aufgabenfrist", ev_deal: "Geschäft erwartet", ev_project: "Projekt fällig", ev_contract: "Vertragsende", ev_case: "Vorgang fällig", more_n: "+{n} weitere",
      td_sub: "Alles, was heute Ihre Aufmerksamkeit braucht.", calls_today: "Aktivitäten heute", tasks_due: "Überfällige und dringende Aufgaben", steps_next: "Nächste Projektschritte",
      contracts_soon: "Verträge, die in 30 Tagen enden", nothing: "Nichts vorhanden.", late: "überfällig",
      em_sub: "An Abnehmer, Lieferanten und Mitarbeitende schreiben. Jede E-Mail wird protokolliert.", compose: "E-Mail schreiben", to: "An",
      or_email: "oder E-Mail-Adresse eingeben", template: "Vorlage", subject: "Betreff", message: "Nachricht",
      send_app: "In meinem E-Mail-Programm öffnen", log_only: "Nur protokollieren", sent_log: "Gesendete E-Mails", email_logged: "E-Mail im Protokoll gespeichert.",
      write_email: "E-Mail schreiben", tpl_none: "Keine Vorlage", tpl_followup: "Nachfassen", tpl_renewal: "Vertragsverlängerung",
      tpl_confirm: "Terminbestätigung", tpl_thanks: "Dankeschön",
      notif: "Benachrichtigungen", notif_none: "Alles in Ordnung. Nichts braucht Aufmerksamkeit.", n_requests: "{n} Terminanfragen",
      n_overdue: "{n} überfällige Aufgaben", n_contracts: "{n} Verträge enden in 30 Tagen", n_projects: "{n} Projekte in 7 Tagen fällig",
      n_missed: "{n} verpasste Aktivitäten diese Woche", n_cases: "{n} Vorgänge mit hoher Priorität offen", n_docs: "{n} Dokumente laufen in 60 Tagen ab",
      search_all: "Abnehmer, Lieferanten, Kontakte, Vorgänge, Dokumente, Projekte, Aufgaben suchen…", export: "CSV exportieren",
      prj_in_progress: "Laufende Projekte",
      new_case: "Neuer Vorgang", cases_sub: "Probleme bei Milchqualität, Tiergesundheit, Lieferung und Technik, verfolgt bis zur Lösung.",
      open_cases: "Offene Vorgänge", high_n: "{n} mit hoher Priorität", overdue_n: "{n} überfällig", resolved_month: "Gelöst in 30 Tagen",
      new_document: "Neues Dokument", docs_sub: "Zertifikate, Verträge, Arbeitsanweisungen und Prüfberichte mit Ablaufdatum.",
      valid: "Gültig", expiring: "Läuft in 60 Tagen ab", expired: "Abgelaufen", no_expiry: "Kein Ablaufdatum", open_link: "Öffnen",
      act_sub: "Anrufe, Hofbesuche, Dienstleistungen, Kontrollen und Besprechungen mit Partnern.",
      k_milk: "Milch, kg ECM", vs_avg: "{v} zum 7-Tage-Mittel", k_cows: "Melkende Kühe", milk_cow: "{v} kg je Kuh", k_cells: "Zellzahl (1000/ml)",
      above_limit: "über Grenzwert", limit_n: "Grenzwert {n}", k_preg: "Tragend (TU+)", inseminated_n: "{n}% besamt", cells_case: "Zellzahl hoch ({n} Tsd.): mit Molkerei klären",
      create_case: "Fall anlegen", fmis_title: "Betriebsleistung", fmis_sub: "Aus FMIS, nur lesen. Gleiche Felder für jeden Betrieb mit FMIS.", crm_title: "Arbeit und Partner",
      ch_milk: "Abgelieferte Milch (kg ECM)", last_60: "letzte 60 Tage", last_28: "letzte 28 Tage", last_6m: "letzte 6 Monate", kg_ecm_day: "kg ECM pro Tag", avg7: "7-Tage-Mittel",
      dairy_link: "Molkerei", ch_quality: "Milchqualität", cells_unit: "Zellzahl, 1000/ml", fat: "Fett", protein: "Eiweiß", urea: "Harnstoff", ch_herd: "Herde",
      lact_days: "Laktationstage", ch_losses: "Abgänge und Verkäufe", died_cows: "Kühe verendet", died_young: "Jungrinder verendet", died_calves: "Kälber verendet", sold_cows: "Kühe verkauft",
      vet_link: "Tierarzt", ch_repro: "Fruchtbarkeitsstatus", ch_feed: "Fütterungsgenauigkeit je Mitarbeiter",
      rs_pregnant: "Tragend (TU+)", rs_inseminated: "Besamt, nicht untersucht", rs_open: "Offen, besamungsbereit", rs_fresh: "Frischmelker, Wartezeit", rs_dnb: "Nicht besamen",
      visits_week: "Besuche und Dienste, 7 Tage", feed_acc: "Fütterungsgenauigkeit", latest_day: "letzter Tag", docs_expiring: "Ablaufende Dokumente",
      within_60: "in 60 Tagen", expired_n: "{n} abgelaufen", overdue_lbl: "Überfällig", open_cases_list: "Offene Vorgänge", visits_list: "Besuche und Dienste",
    } },
  };
  let LANG = null, lang = "en";
  function buildLang(saved) {
    const out = { default: "en", languages: JSON.parse(JSON.stringify(BUILTIN)) };
    if (saved && saved.languages) {
      for (const [c, L] of Object.entries(saved.languages)) {
        const base = out.languages[c] || { name: c, locale: c, strings: {} };
        out.languages[c] = { name: L.name || base.name, locale: L.locale || base.locale, strings: Object.assign({}, base.strings, L.strings || {}) };
      }
      if (saved.default && out.languages[saved.default]) out.default = saved.default;
    }
    return out;
  }
  function t(k, v) {
    const cur = (LANG.languages[lang] || {}).strings || {}, en = LANG.languages.en.strings;
    let s = cur[k] || en[k] || BUILTIN.en.strings[k] || k;
    return v ? s.replace(/\{(\w+)\}/g, (m, n) => (n in v ? v[n] : m)) : s;
  }
  const locale = () => (LANG.languages[lang] || {}).locale || "en-GB";
  const opt = (v) => t("o_" + v);

  /* ================= state ================= */
  const S = { data: null, route: "overview", f: {}, audit: null };
  const today = () => S.data.today;
  const can = (m, level = "see") => ({ none: 0, see: 1, edit: 2 }[S.data.perms[m] || "none"] >= { see: 1, edit: 2 }[level]);
  const byId = (list, id) => (S.data[list] || []).find((x) => x.id === id);
  const personName = (id) => (byId("people", id) || {}).name || "";
  const initials = (n) => String(n || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 70% 60%)`; };
  const ava = (n) => `<span class="ava" style="--h:${hue(n)}">${esc(initials(n))}</span>`;
  const eur = (v, compact) => v == null || v === "" ? "–" : new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR", maximumFractionDigits: 0, notation: compact && Math.abs(v) >= 100000 ? "compact" : "standard" }).format(v);
  const fdate = (d, o) => { if (!d) return ""; const x = new Date(d.length > 10 ? d.replace(" ", "T") : d + "T12:00:00"); try { return x.toLocaleDateString(locale(), o || { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } };
  const ftime = (d) => d && d.length > 10 ? d.slice(11, 16) : "";
  const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  const sampleTag = (r) => r && r.sample ? `<span class="sample">${esc(t("sample_tag"))}</span>` : "";
  const orgName = (kind, id) => kind === "customer" ? (byId("customers", id) || {}).name : kind === "vendor" ? (byId("vendors", id) || {}).name : kind === "farm" ? S.data.farm.name : "";

  async function api(method, url, body) {
    const r = await fetch(url, { method, credentials: "same-origin", headers: body !== undefined ? { "Content-Type": "application/json" } : {}, body: body !== undefined ? JSON.stringify(body) : undefined });
    if (r.status === 401) { location.href = "login.html"; throw new Error("login"); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Error " + r.status);
    return j;
  }
  function toast(msg, bad) {
    const el = document.createElement("div"); el.textContent = msg; if (bad) el.className = "bad";
    $("#toast").appendChild(el); setTimeout(() => el.remove(), 3200);
  }
  function countUp(root) {
    $$("[data-to]", root).forEach((el) => {
      const to = Number(el.dataset.to), fmt = el.dataset.fmt, dur = 700, t0 = performance.now();
      const show = (v) => { el.textContent = fmt === "eur" ? eur(v, true) : fmt === "pct" ? Math.round(v) + "%" : Math.round(v).toLocaleString(locale()); };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return show(to);
      const step = (now) => { const p = Math.min(1, (now - t0) / dur); show(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ================= enums and forms ================= */
  const ENUM = {
    customer_type: ["dairy", "cattle_buyer", "biogas", "crop_buyer", "private", "other"], customer_status: ["lead", "active", "paused", "former"],
    vendor_type: ["feed_supplier", "vet", "breeding", "machinery", "service", "advisor", "other"], vendor_status: ["active", "paused", "former"],
    org_kind: ["farm", "customer", "vendor", "other"], stage: ["lead", "first_call", "demo", "proposal", "won", "lost"],
    call_status: ["requested", "planned", "done", "missed", "cancelled"], prio: ["urgent", "week", "later", "none"],
    project_status: ["planning", "active", "review", "done", "paused"],
    call_kind: ["call", "visit", "service", "inspection", "meeting"],
    case_kind: ["quality", "animal_health", "supply", "equipment", "safety", "complaint"],
    case_priority: ["high", "medium", "low"], case_status: ["open", "in_progress", "waiting", "resolved", "closed"],
    doc_kind: ["certificate", "contract", "sop", "inspection_report", "other"],
    task_status: ["active", "decision", "reported", "notdone", "confirmed", "done"],
    area: ["fin", "prod", "animal", "plant", "res", "platform", "app", "sec", "kb", "gen"], level: ["", "finance", "product", "process", "resources", "foundation"],
  };
  const LEVEL_OF = { fin: "finance", prod: "product", animal: "process", plant: "process", res: "resources", platform: "foundation", app: "foundation", sec: "foundation", kb: "foundation", gen: "foundation" };
  const LEVELS = ["finance", "product", "process", "resources", "foundation"];
  const STAGE_ODDS = { lead: 10, first_call: 25, demo: 50, proposal: 75, won: 100, lost: 0 };
  const STAGE_C = { lead: "var(--amber)", first_call: "var(--blue)", demo: "var(--violet)", proposal: "var(--green)", won: "var(--green)", lost: "var(--faint)" };
  const FORMS = {
    customers: [["name", "text", 1, 1], ["type", "enum:customer_type"], ["status", "enum:customer_status"], ["owner_id", "person"], ["code", "text"], ["city", "text"], ["country", "text"], ["level", "enum:level"], ["notes", "long", 0, 1]],
    vendors: [["name", "text", 1, 1], ["type", "enum:vendor_type"], ["status", "enum:vendor_status"], ["contract_start", "date"], ["contract_end", "date"], ["owner_id", "person"], ["notes", "long", 0, 1]],
    contacts: [["name", "text", 1, 1], ["org", "org", 0, 1], ["title", "text"], ["language", "text"], ["phone", "text"], ["email", "text"], ["last_contact", "date"], ["notes", "long", 0, 1]],
    deals: [["title", "text", 1, 1], ["customer_id", "customer"], ["stage", "enum:stage"], ["value", "num"], ["expected", "date"], ["owner_id", "person"], ["notes", "long", 0, 1]],
    calls: [["topic", "text", 1, 1], ["kind", "enum:call_kind"], ["at", "datetime"], ["status", "enum:call_status"], ["place", "text"], ["vendor_id", "supplier"], ["customer_id", "customer"], ["contact_id", "contact"], ["owner_id", "person"], ["outcome", "long", 0, 1]],
    cases: [["title", "text", 1, 1], ["kind", "enum:case_kind"], ["priority", "enum:case_priority"], ["status", "enum:case_status"], ["owner_id", "person"], ["vendor_id", "supplier"], ["customer_id", "customer"], ["opened", "date"], ["due", "date"], ["resolved_on", "date"], ["description", "long", 0, 1], ["resolution", "long", 0, 1]],
    documents: [["title", "text", 1, 1], ["kind", "enum:doc_kind"], ["owner_id", "person"], ["valid_from", "date"], ["valid_until", "date"], ["vendor_id", "supplier"], ["customer_id", "customer"], ["link", "text", 0, 1], ["notes", "long", 0, 1]],
    tasks: [["title", "text", 1, 1], ["prio", "enum:prio"], ["status", "enum:task_status"], ["area", "enum:area"], ["owner_id", "person"], ["deadline", "date"], ["reason", "text", 0, 1], ["next", "text", 0, 1]],
    projects: [["title", "text", 1, 1], ["subtitle", "text", 0, 1], ["status", "enum:project_status"], ["owner_id", "person"], ["customer_id", "customer"], ["start", "date"], ["due", "date"], ["notes", "long", 0, 1]],
    people: [["name", "text", 1, 1], ["job", "text"], ["org", "org"], ["role_id", "role"], ["operator_name", "text"], ["email", "text"], ["phone", "text"], ["username", "text"], ["password", "password"], ["active", "bool"]],
  };
  const LABEL = { name: "name", type: "type", status: "status", owner_id: "owner", code: "code", city: "city", country: "country", level: "level", notes: "notes",
    contract_start: "contract_start", contract_end: "contract_end", org: "organisation", title: "title", language: "language", phone: "phone", email: "email_addr", vendor_id: "supplier", kind: "kind", place: "place",
    opened: "opened", resolved_on: "resolved_on", description: "description", resolution: "resolution", valid_from: "valid_from",
    valid_until: "valid_until", link: "link", priority: "priority",
    last_contact: "last_contact", customer_id: "customer", stage: "stage", value: "value", expected: "expected", topic: "topic", at: "when", contact_id: "contact",
    outcome: "outcome", prio: "priority", area: "area", deadline: "deadline", reason: "reason", next: "next", job: "job", role_id: "role",
    operator_name: "operator", username: "username", password: "password", active: "active", subtitle: "subtitle", start: "start", due: "due" };
  const MODULE_OF = { customers: "customers", vendors: "vendors", contacts: "contacts", deals: "pipeline", calls: "calls", tasks: "tasks", people: "people", roles: "roles",
    projects: "projects", project_steps: "projects", project_updates: "projects", emails: "email", cases: "cases", documents: "documents" };

  function field(entity, [f, kind, req, full], rec) {
    const v = rec[f] == null ? "" : rec[f];
    const L = `<span>${esc(t(LABEL[f] || f))}${req ? " *" : ""}</span>`;
    const cls = full ? ' class="full"' : "";
    const sel = (opts) => `<select name="${f}">${opts}</select>`;
    let input;
    if (kind.startsWith("enum:")) input = sel(ENUM[kind.slice(5)].map((o) => `<option value="${o}"${o === v ? " selected" : ""}>${esc(o ? opt(o) : "–")}</option>`).join(""));
    else if (kind === "person") input = sel(`<option value="">–</option>` + S.data.people.map((p) => `<option value="${p.id}"${p.id === v ? " selected" : ""}>${esc(p.name)}</option>`).join(""));
    else if (kind === "role") input = sel(`<option value="">–</option>` + S.data.roles.map((r) => `<option value="${r.id}"${r.id === v ? " selected" : ""}>${esc(r.name)}</option>`).join(""));
    else if (kind === "supplier") input = sel(`<option value="">–</option>` + S.data.vendors.map((c) => `<option value="${c.id}"${c.id === v ? " selected" : ""}>${esc(c.name)}</option>`).join(""));
    else if (kind === "customer") input = sel(`<option value="">–</option>` + S.data.customers.map((c) => `<option value="${c.id}"${c.id === v ? " selected" : ""}>${esc(c.name)}</option>`).join(""));
    else if (kind === "contact") input = sel(`<option value="">–</option>` + S.data.contacts.map((c) => `<option value="${c.id}"${c.id === v ? " selected" : ""}>${esc(c.name)}${c.org_id ? " · " + esc(orgName(c.org_kind, c.org_id) || "") : ""}</option>`).join(""));
    else if (kind === "org") {
      const cur = (rec.org_kind || (entity === "people" ? "farm" : "customer")) + ":" + (rec.org_id || "");
      const o = [[`farm:`, S.data.farm.name]].concat(S.data.customers.map((c) => [`customer:${c.id}`, c.name])).concat(S.data.vendors.map((x) => [`vendor:${x.id}`, x.name])).concat([["other:", opt("other")]]);
      input = sel(o.map(([k, n]) => `<option value="${esc(k)}"${k === cur ? " selected" : ""}>${esc(n)}</option>`).join(""));
    }
    else if (kind === "long") input = `<textarea name="${f}" maxlength="4000">${esc(v)}</textarea>`;
    else if (kind === "bool") input = sel(`<option value="1"${v !== 0 ? " selected" : ""}>✓</option><option value="0"${v === 0 ? " selected" : ""}>–</option>`);
    else if (kind === "num") input = `<input name="${f}" type="number" step="100" value="${esc(v)}">`;
    else if (kind === "date") input = `<input name="${f}" type="date" value="${esc(v)}">`;
    else if (kind === "datetime") input = `<input name="${f}" type="datetime-local" value="${esc(String(v).replace(" ", "T"))}">`;
    else if (kind === "password") input = `<input name="${f}" type="password" autocomplete="new-password" placeholder="••••••••">`;
    else input = `<input name="${f}" value="${esc(v)}" maxlength="300"${req ? " required" : ""}>`;
    return `<label${cls}>${L}${input}</label>`;
  }

  function collect(entity, form) {
    const out = {};
    for (const [f, kind] of FORMS[entity]) {
      const el = form.elements[f]; if (!el) continue;
      let v = el.value;
      if (kind === "org") { const [k, id] = v.split(":"); out.org_kind = k; out.org_id = id ? Number(id) : null; continue; }
      if (kind === "password") { if (v) out.password = v; continue; }
      if (["person", "role", "customer", "contact"].includes(kind)) v = v ? Number(v) : null;
      if (kind === "bool") v = v === "1" ? 1 : 0;
      if (kind === "num") v = v === "" ? 0 : Number(v);
      if (kind === "datetime") v = v.replace("T", " ");
      out[f] = v;
    }
    return out;
  }

  /* ================= drawer ================= */
  function openDrawer(html) {
    $("#layer").innerHTML = `<div class="scrim" data-close></div><aside class="drawer" role="dialog" aria-modal="true">${html}</aside>`;
    const first = $(".drawer input, .drawer select, .drawer textarea"); if (first) setTimeout(() => first.focus(), 60);
  }
  const closeDrawer = () => { $("#layer").innerHTML = ""; S.drawer = null; };
  async function refreshDrawer() {
    await reload();
    if (!S.drawer) return;
    const r = byId(S.drawer.entity, S.drawer.id);
    r ? openForm(S.drawer.entity, r) : closeDrawer();
  }

  function openForm(entity, rec, preset) {
    rec = Object.assign({}, preset || {}, rec || {});
    S.drawer = rec.id ? { entity, id: rec.id } : null;
    const isNew = !rec.id, editable = can(MODULE_OF[entity], "edit");
    const titleKey = { customers: "new_customer", vendors: "new_vendor", contacts: "new_contact", deals: "new_deal", calls: "new_call", tasks: "new_task", people: "new_worker", projects: "new_project", cases: "new_case", documents: "new_document" }[entity];
    let extra = "";
    if (!isNew && entity === "projects") extra = projectPanel(rec);
    if (!isNew && (entity === "contacts" || entity === "people") && rec.email && can("email", "edit"))
      extra += `<div class="toolbar"><button class="btn small" data-writemail="${entity === "contacts" ? "contact" : "person"}:${rec.id}">✉ ${esc(t("write_email"))}</button><a class="btn small" href="mailto:${esc(rec.email)}">${esc(rec.email)}</a></div>`;
    if (!isNew && (entity === "customers" || entity === "vendors")) extra = orgPanel(entity, rec);
    if (!isNew && entity === "people") extra = workerPanel(rec);
    if (!isNew && entity === "calls" && rec.source === "booking") extra = `<div class="ro">${esc(t("requested_by", { name: rec.req_name }))}${rec.req_org ? " · " + esc(rec.req_org) : ""}<br>${esc(rec.req_email || "")} ${esc(rec.req_phone || "")}</div>`;
    openDrawer(`
      <div class="drawer-head"><div><div class="muted">${esc(t(entity === "people" ? "workers" : entity === "deals" ? "pipeline" : entity))}${entity === "projects" && rec.due ? " · " + dueBadge(rec.due, rec.status === "done") : ""}</div>
        <h2>${esc(isNew ? t(titleKey) : rec.name || rec.title || rec.topic)}${sampleTag(rec)}</h2></div>
        <button class="icon-btn x" data-close title="${esc(t("close"))}">${ICON.x}</button></div>
      ${extra}
      <form class="form" id="edit-form" data-entity="${entity}" data-id="${rec.id || ""}">
        ${FORMS[entity].map((f) => field(entity, f, rec)).join("")}
      </form>
      <div class="form-actions">
        ${editable ? `<button class="btn primary" data-save>${esc(t("save"))}</button>` : ""}
        ${editable && !isNew ? `<button class="btn danger" data-del>${esc(t("delete"))}</button>` : ""}
        <button class="btn" data-close>${esc(t("cancel"))}</button><span class="err" id="form-err"></span>
      </div>`);
    if (!editable) $$("#edit-form input, #edit-form select, #edit-form textarea").forEach((el) => (el.disabled = true));
  }

  function orgPanel(entity, rec) {
    const kind = entity === "customers" ? "customer" : "vendor";
    const cons = S.data.contacts.filter((c) => c.org_kind === kind && c.org_id === rec.id);
    const deals = entity === "customers" ? S.data.deals.filter((d) => d.customer_id === rec.id) : [];
    const fk = entity === "customers" ? "customer_id" : "vendor_id";
    const calls = S.data.calls.filter((c) => c[fk] === rec.id);
    const cases = (S.data.cases || []).filter((c) => c[fk] === rec.id);
    const docs = (S.data.documents || []).filter((c) => c[fk] === rec.id);
    const list = (title, items, fn) => items.length ? `<div class="section-title">${esc(title)}</div><div class="rows">${items.map(fn).join("")}</div>` : "";
    return `${rec.volume_eur != null ? `<div class="ro"><span class="muted">${esc(t(entity === "customers" ? "volume" : "spend"))} · ${esc(t("read_only_fin"))}</span><b class="num">${eur(rec.volume_eur)}</b><span class="muted">${esc(rec.volume_note || "")}${rec.last_booking ? " · " + esc(t("last_booking")) + ": " + esc(fdate(rec.last_booking)) : ""}</span></div>` : ""}
      ${list(t("contacts_of"), cons, (c) => `<div class="row-item click" data-open="contacts:${c.id}">${ava(c.name)}<div class="main"><b>${esc(c.name)}</b><small>${esc(c.title || "")} ${esc(c.phone || "")}</small></div></div>`)}
      ${list(t("deals_of"), deals, (d) => `<div class="row-item click" data-open="deals:${d.id}"><span class="dot" style="background:${STAGE_C[d.stage]}"></span><div class="main"><b>${esc(d.title)}</b><small>${esc(opt(d.stage))}</small></div><div class="end num">${eur(d.value)}</div></div>`)}
      ${list(t("calls_of"), calls, (c) => `<div class="row-item click" data-open="calls:${c.id}"><div class="ico-box">${ICON.phone}</div><div class="main"><b>${esc(c.topic)}</b><small>${esc(opt(c.kind || "call"))} · ${esc(fdate(c.at))} ${esc(ftime(c.at))} · ${esc(opt(c.status))}</small></div></div>`)}
      ${list(t("cases_of"), cases, (c) => `<div class="row-item click" data-open="cases:${c.id}"><span class="badge ${PRIO_C[c.priority]}">${esc(opt(c.priority))}</span><div class="main"><b>${esc(c.title)}</b><small>${esc(opt(c.kind))} · ${esc(opt(c.status))}</small></div></div>`)}
      ${list(t("docs_of"), docs, (c) => `<div class="row-item click" data-open="documents:${c.id}"><div class="ico-box">${ICON.doc}</div><div class="main"><b>${esc(c.title)}</b><small>${esc(opt(c.kind))}${c.valid_until ? " · " + esc(t("valid_until")) + " " + esc(fdate(c.valid_until)) : ""}</small></div>${docBadge(c)}</div>`)}`;
  }

  /* ================= workers' feeding activity ================= */
  function workerStats(op) { return (S.data.feed_workers || []).find((w) => w.operator === op); }
  function spark(op) {
    const days = (S.data.feed_days || []).filter((d) => d.operator === op);
    if (!days.length) return "";
    const max = Math.max(...days.map((d) => d.loads));
    return `<div class="spark" title="${esc(t("loads"))}">${days.map((d, i) => `<i style="height:${Math.max(8, (d.loads / max) * 100)}%;animation-delay:${i * 15}ms" class="${d.accuracy < 97 ? "low" : ""}" title="${esc(fdate(d.day))}: ${d.loads} ${esc(t("loads"))}, ${d.accuracy}%"></i>`).join("")}</div>`;
  }
  function workerPanel(p) {
    const w = p.operator_name && workerStats(p.operator_name);
    if (!w) return "";
    return `<div class="ro"><span class="muted">${esc(t("feeding"))} · ${esc(t("from_cowconnect"))}</span>
      <b class="num">${w.loads.toLocaleString(locale())} ${esc(t("loads"))} · ${w.accuracy}% ${esc(t("accuracy"))}</b>
      <span class="muted">${esc(t("planned_actual", { a: Math.round(w.actual).toLocaleString(locale()), p: Math.round(w.planned).toLocaleString(locale()) }))} · ${esc(t("first_last", { f: fdate(w.first_day), l: fdate(w.last_day) }))}</span>
      <div style="margin-top:10px">${spark(p.operator_name)}</div><div class="muted" style="margin-top:6px">${esc(t("groups"))}: ${esc(w.groups || "")}</div></div>`;
  }

  /* ================= page frame ================= */
  function head(eyebrow, title, sub, actions) {
    return `<div class="page-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ""}</div><div class="actions">${actions || ""}</div></div>`;
  }
  const newBtn = (entity, key, preset) => can(MODULE_OF[entity], "edit") ? `<button class="btn primary" data-new="${entity}"${preset ? ` data-preset='${esc(JSON.stringify(preset))}'` : ""}>${ICON.plus} ${esc(t(key))}</button>` : "";
  function card(i, label, value, sub, icon, cls, go) {
    return `<div class="card reveal ${cls || ""}${go ? " click" : ""}" style="--i:${i}"${go ? ` data-go="${go}"` : ""}><div class="label">${esc(label)}<span class="badge-ico">${icon}</span></div>
      <div class="value${typeof value === "string" && !/^(eur|pct):/.test(value) ? " txt" : ""}" ${typeof value === "number" ? `data-to="${value}"` : ""}${typeof value === "string" && /^(eur|pct):/.test(value) ? ` data-to="${value.slice(4)}" data-fmt="${value.slice(0, 3)}"` : ""}>${typeof value === "number" || /^(eur|pct):/.test(String(value)) ? "0" : esc(value)}</div><div class="sub">${esc(sub || "")}</div></div>`;
  }
  const banner = () => S.data.sample_count ? `<div class="chips"><span class="badge amber">${esc(t("sample_banner"))}</span></div>` : "";

  /* ================= pages ================= */
  const PAGES = {};

  /* ---------- production helpers ---------- */
  const PRIO_C = { high: "red", medium: "amber", low: "" };
  const KIND_C = { call: "blue", visit: "green", service: "violet", inspection: "amber", meeting: "" };
  const CST_C = { open: "red", in_progress: "blue", waiting: "amber", resolved: "green", closed: "" };
  function docState(d) {
    if (!d.valid_until) return "none";
    const n = daysBetween(today(), d.valid_until);
    return n < 0 ? "expired" : n <= 60 ? "expiring" : "valid";
  }
  function docBadge(d) {
    const s = docState(d);
    if (s === "none") return `<span class="badge">${esc(t("no_expiry"))}</span>`;
    const n = daysBetween(today(), d.valid_until);
    return s === "expired" ? `<span class="badge red">${esc(t("expired"))}</span>` : s === "expiring" ? `<span class="badge amber">${esc(t("ends_in", { n }))}</span>` : `<span class="badge green">${esc(t("valid"))}</span>`;
  }
  const openCases = () => (S.data.cases || []).filter((c) => !["resolved", "closed"].includes(c.status));
  const partnerName = (r) => (byId("vendors", r.vendor_id) || {}).name || (byId("customers", r.customer_id) || {}).name || "";

  /* ---------- charts (plain SVG) ---------- */
  function niceTicks(lo, hi, n = 4) {
    const span = hi - lo || 1, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) || step0;
    const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, out = [];
    for (let v = a; v <= b + step / 2; v += step) out.push(Math.round(v * 1000) / 1000);
    return out;
  }
  // series: [{ name, color, pts: [[iso, value], ...], area }]; refs: [{ v, label, color }]
  function lineChart({ series, refs = [], fmt = (v) => v.toLocaleString(locale()), height = 210, max = null }) {
    const W = 640, H = height, L = 48, R = 14, T = 14, B = 28;
    const pts0 = series[0].pts; if (!pts0.length) return `<div class="empty">${esc(t("none_here"))}</div>`;
    const vals = series.flatMap((s) => s.pts.map((p) => p[1])).concat(refs.map((r) => r.v)).filter((v) => v != null);
    let lo = Math.min(...vals), hi = Math.max(...vals); const minSpan = Math.abs(hi) * 0.05;
    if (hi - lo < minSpan) { const c = (hi + lo) / 2; lo = c - minSpan / 2; hi = c + minSpan / 2; }
    const pad = (hi - lo) * 0.12 || 1; lo -= pad; hi += pad; if (max != null) hi = Math.min(hi, max);
    const ticks = niceTicks(lo, hi); lo = ticks[0]; hi = ticks.at(-1);
    const n = pts0.length, X = (i) => L + (n === 1 ? 0 : (i / (n - 1)) * (W - L - R)), Y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const grid = ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" class="ax">${esc(fmt(v))}</text>`).join("");
    const xl = [0, Math.floor((n - 1) / 2), n - 1].map((i) => `<text x="${X(i)}" y="${H - 8}" text-anchor="${i === 0 ? "start" : i === n - 1 ? "end" : "middle"}" class="ax">${esc(fdate(pts0[i][0], { day: "numeric", month: "short" }))}</text>`).join("");
    const lines = series.map((s, si) => {
      let gap = true; const d = s.pts.map((p, i) => { if (p[1] == null) return ""; const c = gap ? "M" : "L"; gap = false; return `${c}${X(i).toFixed(1)} ${Y(p[1]).toFixed(1)}`; }).join(" ");
      const area = s.area ? `<path d="${d} L${X(n - 1)} ${Y(lo)} L${X(0)} ${Y(lo)} Z" fill="${s.color}" fill-opacity=".12" stroke="none"/>` : "";
      return `${area}<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.thin ? 1.6 : 2.4}" stroke-linejoin="round" stroke-linecap="round" class="ln" style="animation-delay:${si * 120}ms"${s.dash ? ' stroke-dasharray="5 4"' : ""}/>`;
    }).join("");
    const refL = refs.map((r) => `<line x1="${L}" x2="${W - R}" y1="${Y(r.v)}" y2="${Y(r.v)}" stroke="${r.color || "var(--red)"}" stroke-dasharray="6 5" stroke-width="1.4"/><text x="${L + 6}" y="${Y(r.v) - 6}" class="ax" style="fill:${r.color || "var(--red)"}">${esc(r.label)}</text>`).join("");
    const last = [...series[0].pts].reverse().find((p) => p[1] != null) || pts0.at(-1), li = series[0].pts.lastIndexOf(last);
    const dots = series[0].pts.map((p, i) => p[1] == null ? "" : `<circle cx="${X(i)}" cy="${Y(p[1])}" r="7" class="hit"><title>${esc(fdate(p[0]))}: ${esc(fmt(p[1]))}${series[1] && series[1].pts[i] && series[1].pts[i][1] != null ? " · " + esc(series[1].name) + " " + esc(fmt(series[1].pts[i][1])) : ""}</title></circle>`).join("");
    const legend = series.length > 1 ? `<div class="legend">${series.map((s) => `<span class="lg"><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>` : "";
    return `${legend}<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${esc(series[0].name)}">${grid}${xl}${refL}${lines}<circle cx="${X(li)}" cy="${Y(last[1])}" r="4.5" fill="${series[0].color}" stroke="var(--bg-2)" stroke-width="2"/>${dots}</svg>`;
  }
  // groups: [{ label, parts: { key: value } }], keys: [{ key, name, color }]
  function stackedBars({ groups, keys, height = 200 }) {
    const W = 640, H = height, L = 34, R = 10, T = 12, B = 28;
    const tot = groups.map((g) => keys.reduce((a, k) => a + (g.parts[k.key] || 0), 0));
    const ticks = niceTicks(0, Math.max(1, ...tot)), hi = ticks.at(-1);
    const bw = (W - L - R) / groups.length, Y = (v) => T + (1 - v / hi) * (H - T - B);
    const grid = ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" class="ax">${v}</text>`).join("");
    const bars = groups.map((g, i) => { let acc = 0; const x = L + i * bw + bw * 0.2, w = bw * 0.6;
      return keys.map((k) => { const v = g.parts[k.key] || 0; if (!v) return ""; const y1 = Y(acc + v), y0 = Y(acc); acc += v;
        return `<rect x="${x}" y="${y1}" width="${w}" height="${Math.max(0, y0 - y1)}" fill="${k.color}" rx="3" class="bar" style="animation-delay:${i * 50}ms"><title>${esc(g.label)} · ${esc(k.name)}: ${v}</title></rect>`; }).join("") +
        `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" class="ax">${esc(g.label)}</text>`; }).join("");
    return `<div class="legend">${keys.map((k) => `<span class="lg"><i style="background:${k.color}"></i>${esc(k.name)}</span>`).join("")}</div><svg viewBox="0 0 ${W} ${H}" class="chart" role="img">${grid}${bars}</svg>`;
  }
  const hbars = (rows, fmt) => { const max = Math.max(1, ...rows.map((r) => r[1])); return `<div class="bars">${rows.map(([n, v], i) => `<div class="bar-row"><span class="name">${esc(n)}</span><span class="track"><span class="fill" style="width:${(v / max) * 100}%;animation-delay:${i * 60}ms"></span></span><span class="num muted">${fmt ? fmt(v) : v}</span></div>`).join("")}</div>`; };

  /* ---------- Farm performance from FMIS (read only) ---------- */
  const CELL_LIMIT = 250;
  function fmisCards() {
    const F = S.data.fmis; if (!F || !F.milk.length) return "";
    const m = F.milk, last = m.at(-1), prev7 = m.slice(-8, -1), avg7 = prev7.reduce((a, r) => a + r.kg_ecm, 0) / Math.max(1, prev7.length);
    const h = F.herd.at(-1) || {};
    const diff = Math.round(((last.kg_ecm - avg7) / avg7) * 1000) / 10;
    return `<div class="cards">
      ${card(10, t("k_milk"), last.kg_ecm, t("vs_avg", { v: (diff > 0 ? "+" : "") + diff + "%" }), ICON.chart, "accent", "")}
      ${card(11, t("k_cows"), h.cows_milking || 0, t("milk_cow", { v: (h.milk_per_cow || 0).toLocaleString(locale()) }), ICON.users)}
      ${card(12, t("k_cells"), last.cells, last.cells > CELL_LIMIT ? t("above_limit") + " " + CELL_LIMIT : t("limit_n", { n: CELL_LIMIT }), ICON.alert, last.cells > CELL_LIMIT ? "warn" : "")}
      ${card(13, t("k_preg"), "pct:" + (h.pct_pregnant || 0), t("inseminated_n", { n: Math.round(h.pct_inseminated || 0) }), ICON.task)}
    </div>`;
  }
  function fmisCharts() {
    const F = S.data.fmis; if (!F || !F.milk.length) return "";
    const D = S.data, m = F.milk.slice(-60), h = F.herd.slice(-60), last = F.milk.at(-1);
    const ma = m.map((r, i) => { const w = m.slice(Math.max(0, i - 6), i + 1); return [r.day, Math.round(w.reduce((a, x) => a + x.kg_ecm, 0) / w.length)]; });
    const dairy = D.customers.filter((c) => c.type === "dairy" && c.status === "active").sort((a, b) => (b.volume_eur || 0) - (a.volume_eur || 0))[0];
    const vet = D.vendors.find((v) => v.type === "vet");
    const months = {}; F.herd.forEach((r) => { const k = r.day.slice(0, 7); const o = months[k] || (months[k] = { died_cows: 0, died_young: 0, died_calves: 0, sold_cows: 0 }); ["died_cows", "died_young", "died_calves", "sold_cows"].forEach((x) => (o[x] += r[x] || 0)); });
    const mk = Object.keys(months).sort().slice(-6);
    const fw = {}; (D.feed_days || []).forEach((d) => { (fw[d.operator] = fw[d.operator] || {})[d.day] = d.accuracy; });
    const fdays = [...new Set((D.feed_days || []).map((d) => d.day))].sort().slice(-28);
    const FC = ["var(--blue)", "var(--green)", "var(--violet)", "var(--amber)"];
    const workerName = (op) => (D.people.find((p) => p.operator_name === op) || {}).name || op;
    const feedSeries = Object.keys(fw).map((op, i) => ({ name: workerName(op), color: FC[i % FC.length], thin: true, pts: fdays.map((d) => [d, fw[op][d] != null ? fw[op][d] : null]) })).filter((s) => s.pts.filter((p) => p[1] != null).length > 3);
    const caseBtn = last.cells > CELL_LIMIT && can("cases", "edit") ? `<button class="btn small" data-new="cases" data-preset='${esc(JSON.stringify({ title: t("cells_case", { n: last.cells }), kind: "quality", priority: "high", status: "open", opened: today(), customer_id: dairy ? dairy.id : null }))}'>${ICON.alert} ${esc(t("create_case"))}</button>` : "";
    const panel = (i, title, sub, inner, foot) => `<div class="panel reveal" style="--i:${i}"><div class="panel-head"><h3>${esc(title)}</h3><span class="sub">${esc(sub || "")}</span></div>${inner}${foot ? `<div class="chart-foot">${foot}</div>` : ""}</div>`;
    return `<div class="section-band"><div><h2>${esc(t("fmis_title"))}</h2><p class="muted">${esc(t("fmis_sub"))}</p></div></div>
      <div class="grid halves charts-grid">
        ${panel(14, t("ch_milk"), t("last_60"), lineChart({ series: [{ name: t("kg_ecm_day"), color: "var(--blue)", pts: m.map((r) => [r.day, r.kg_ecm]), area: true }, { name: t("avg7"), color: "var(--green)", pts: ma }] }),
          dairy ? `<span class="muted">${esc(t("dairy_link"))}:</span> <a href="#" data-open="customers:${dairy.id}">${esc(dairy.name)}</a>` : "")}
        ${panel(15, t("ch_quality"), t("cells_unit"), lineChart({ series: [{ name: t("k_cells"), color: "var(--violet)", pts: m.map((r) => [r.day, r.cells]), area: true }], refs: [{ v: CELL_LIMIT, label: t("limit_n", { n: CELL_LIMIT }) }] }),
          `<span class="chip">${esc(t("fat"))} ${last.fat}%</span><span class="chip">${esc(t("protein"))} ${last.protein}%</span><span class="chip">${esc(t("urea"))} ${last.urea} mg/l</span>${caseBtn}`)}
        ${panel(16, t("ch_herd"), t("last_60"), lineChart({ series: [{ name: t("k_cows"), color: "var(--green)", pts: h.map((r) => [r.day, r.cows_milking]), area: true }] }),
          `<span class="chip">${esc(t("k_preg"))} ${(F.herd.at(-1) || {}).pct_pregnant}%</span><span class="chip">${esc(t("lact_days"))} ${(F.herd.at(-1) || {}).lact_days}</span>`)}
        ${panel(17, t("ch_losses"), t("last_6m"), stackedBars({ groups: mk.map((k) => ({ label: fdate(k, { month: "short" }), parts: months[k] })),
          keys: [{ key: "died_cows", name: t("died_cows"), color: "var(--red)" }, { key: "died_young", name: t("died_young"), color: "var(--amber)" }, { key: "died_calves", name: t("died_calves"), color: "var(--violet)" }, { key: "sold_cows", name: t("sold_cows"), color: "var(--blue)" }] }),
          vet ? `<span class="muted">${esc(t("vet_link"))}:</span> <a href="#" data-open="vendors:${vet.id}">${esc(vet.name)}</a>` : "")}
        ${panel(18, t("ch_repro"), t("latest_day"), hbars(F.repro.map((r) => [t("rs_" + r.status) === "rs_" + r.status ? r.status : t("rs_" + r.status), r.animals])), "")}
        ${feedSeries.length ? panel(19, t("ch_feed"), t("last_28"), lineChart({ series: feedSeries, fmt: (v) => Math.round(v) + "%", max: 100, refs: [{ v: 97, label: "97%", color: "var(--amber)" }] }), "") : ""}
      </div>`;
  }

  PAGES.overview = () => {
    const D = S.data, td = today();
    const cases = openCases(), high = cases.filter((c) => c.priority === "high");
    const visits = D.calls.filter((c) => c.status === "planned" && c.at && c.at.slice(0, 10) >= td && daysBetween(td, c.at.slice(0, 10)) <= 7);
    const tasksOpen = D.tasks.filter((x) => !["done", "confirmed"].includes(x.status));
    const urgent = tasksOpen.filter((x) => x.prio === "urgent");
    const reqs = D.calls.filter((c) => c.status === "requested");
    const todayActs = D.calls.filter((c) => c.at && c.at.slice(0, 10) === td && c.status === "planned").sort((a, b) => a.at.localeCompare(b.at));
    const docs = (D.documents || []).filter((d) => ["expiring", "expired"].includes(docState(d))).sort((a, b) => a.valid_until.localeCompare(b.valid_until));
    const latest = (D.feed_workers || []).map((w) => { const last = (D.feed_days || []).filter((d) => d.operator === w.operator).at(-1); return { w, last, p: D.people.find((p) => p.operator_name === w.operator) }; });
    const lastDayAcc = latest.filter((x) => x.last && x.last.accuracy != null);
    const acc = lastDayAcc.length ? Math.round((lastDayAcc.reduce((a, x) => a + x.last.accuracy, 0) / lastDayAcc.length) * 10) / 10 : null;
    const due = D.contacts.filter((c) => c.last_contact).sort((a, b) => a.last_contact.localeCompare(b.last_contact)).slice(0, 4);
    const topC = D.customers.filter((c) => c.volume_eur).sort((a, b) => b.volume_eur - a.volume_eur).slice(0, 4);
    const topV = D.vendors.filter((c) => c.volume_eur).sort((a, b) => b.volume_eur - a.volume_eur).slice(0, 4);
    const bars = (items, link) => { const max = Math.max(1, ...items.map((x) => x.volume_eur)); return `<div class="bars">${items.map((x, i) => `<div class="bar-row" data-open="${link}:${x.id}" style="cursor:pointer"><span class="name">${esc(x.name)}</span><span class="track"><span class="fill" style="width:${(x.volume_eur / max) * 100}%;animation-delay:${i * 60}ms"></span></span><span class="num muted">${eur(x.volume_eur, true)}</span></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div>`; };
    const live = D.projects.filter((p) => ["active", "review"].includes(p.status));
    const vis = (pg) => pageVisible(pg) && can(PERM_OF[pg]);
    return head(fdate(td, { weekday: "long", day: "numeric", month: "long" }), t("overview"), t("welcome", { name: D.me.name }) + " " + t("ov_sub"), vis("cases") ? newBtn("cases", "new_case", { status: "open", priority: "medium", opened: td }) : newBtn("tasks", "new_task")) + banner() + `
      <div class="cards">
        ${card(0, t("open_cases"), cases.length, t("high_n", { n: high.length }), ICON.alert, high.length ? "accent" : "", "cases")}
        ${card(1, t("visits_week"), visits.length, t("today_n", { n: todayActs.length }), ICON.calendar, "", "schedule")}
        ${card(2, t("open_tasks"), tasksOpen.length, t("urgent_n", { n: urgent.length }), ICON.task, "", "tasks")}
        ${card(3, t("feed_acc"), acc == null ? "–" : "pct:" + acc, t("latest_day"), ICON.feed, "", "workers")}
      </div>
      ${fmisCards()}
      ${fmisCharts()}
      <div class="section-band"><div><h2>${esc(t("crm_title"))}</h2></div></div>
      <div class="grid two">
        <div class="grid">
          <div class="panel reveal" style="--i:4"><div class="panel-head"><h3>${esc(t("open_cases_list"))}</h3><a href="#/cases">${esc(t("view_all"))} →</a></div>
            <div class="rows">${cases.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])).slice(0, 5).map((c) => `<div class="row-item click" data-open="cases:${c.id}"><span class="badge ${PRIO_C[c.priority]}">${esc(opt(c.priority))}</span><div class="main"><b>${esc(c.title)}</b><small>${esc(opt(c.kind))}${partnerName(c) ? " · " + esc(partnerName(c)) : ""}${c.owner_id ? " · " + esc(personName(c.owner_id)) : ""}</small></div><span class="badge ${CST_C[c.status]}">${esc(opt(c.status))}</span></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div></div>
          <div class="panel reveal" style="--i:5"><div class="panel-head"><h3>${esc(t("workers_latest"))}</h3><a href="#/workers">${esc(t("view_all"))} →</a></div>
            <div class="rows">${latest.map(({ w, last, p }) => `<div class="row-item${p ? " click" : ""}"${p ? ` data-open="people:${p.id}"` : ""}>${ava(p ? p.name : w.operator)}<div class="main"><b>${esc(p ? p.name : w.operator)}</b><small>${esc(last ? fdate(last.day) : "")} · ${last ? last.loads : 0} ${esc(t("loads"))}</small></div><div class="end"><span class="badge ${last && last.accuracy < 97 ? "amber" : "green"}">${last ? last.accuracy : "–"}%</span></div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div></div>
          ${live.length && vis("projects") ? `<div class="panel reveal" style="--i:6"><div class="panel-head"><h3>${esc(t("prj_in_progress"))}</h3><a href="#/projects">${esc(t("view_all"))} →</a></div>
            <div class="rows">${live.map((p) => { const pr = progressOf(p.id); return `<div class="row-item click" data-open="projects:${p.id}"><div class="main"><b>${esc(p.title)}</b><small>${esc(t("of_steps", { a: pr.done, b: pr.n }))} · ${esc(pr.cur ? pr.cur.title : t("all_done"))}</small><div class="track" style="margin-top:6px"><span class="fill" style="width:${pr.pct}%"></span></div></div><div class="end num">${pr.pct}%</div></div>`; }).join("")}</div></div>` : ""}
          <div class="panel reveal" style="--i:7"><div class="panel-head"><h3>${esc(t("volume_year"))}</h3><span class="sub">${esc(t("read_only_fin"))}</span></div>
            <div class="grid halves"><div><div class="section-title" style="margin-top:0">${esc(t("top_vendors"))}</div>${bars(topV, "vendors")}</div><div><div class="section-title" style="margin-top:0">${esc(t("top_customers"))}</div>${bars(topC, "customers")}</div></div></div>
        </div>
        <div class="grid">
          <div class="panel reveal" style="--i:5"><div class="panel-head"><h3>${esc(t("today"))}</h3><span class="sub">${todayActs.length + urgent.length + reqs.length}</span></div>
            <div class="rows">${todayActs.map((c) => `<div class="row-item click" data-open="calls:${c.id}"><span class="badge blue">${esc(ftime(c.at))}</span><div class="main"><b>${esc(c.topic)}</b><small>${esc(opt(c.kind || "call"))}${partnerName(c) ? " · " + esc(partnerName(c)) : ""}${c.place ? " · " + esc(c.place) : ""}</small></div></div>`).join("")}
              ${urgent.map((x) => `<div class="row-item click" data-open="tasks:${x.id}"><span class="dot urgent"></span><div class="main"><b>${esc(x.title)}</b><small>${esc(personName(x.owner_id) || t("tiles_noowner"))}</small></div></div>`).join("")}
              ${reqs.map((c) => `<div class="row-item click" data-open="calls:${c.id}"><span class="badge amber">${esc(opt("requested"))}</span><div class="main"><b>${esc(c.topic)}</b><small>${esc(c.req_name)} · ${esc(c.req_org || "")}</small></div></div>`).join("")}
              ${!todayActs.length && !urgent.length && !reqs.length ? `<div class="empty">${esc(t("nothing_today"))}</div>` : ""}</div></div>
          <div class="panel reveal" style="--i:6"><div class="panel-head"><h3>${esc(t("visits_list"))}</h3><a href="#/schedule">${esc(t("view_all"))} →</a></div>
            <div class="rows">${visits.filter((c) => (c.kind || "call") !== "call").sort((a, b) => a.at.localeCompare(b.at)).slice(0, 5).map((c) => `<div class="row-item click" data-open="calls:${c.id}"><div class="ico-box">${ICON.calendar}</div><div class="main"><b>${esc(c.topic)}</b><small>${esc(fdate(c.at, { weekday: "short", day: "numeric", month: "short" }))} ${esc(ftime(c.at))} · ${esc(opt(c.kind))}${partnerName(c) ? " · " + esc(partnerName(c)) : ""}</small></div></div>`).join("") || `<div class="empty">${esc(t("nothing"))}</div>`}</div></div>
          <div class="panel reveal" style="--i:7"><div class="panel-head"><h3>${esc(t("docs_expiring"))}</h3><a href="#/documents">${esc(t("view_all"))} →</a></div>
            <div class="rows">${docs.slice(0, 5).map((d) => `<div class="row-item click" data-open="documents:${d.id}"><div class="ico-box">${ICON.doc}</div><div class="main"><b>${esc(d.title)}</b><small>${esc(opt(d.kind))} · ${esc(fdate(d.valid_until))}</small></div>${docBadge(d)}</div>`).join("") || `<div class="empty">${esc(t("nothing"))}</div>`}</div></div>
          <div class="panel reveal" style="--i:8"><div class="panel-head"><h3>${esc(t("due_call"))}</h3><span class="sub">${esc(t("longest"))}</span></div>
            <div class="rows">${due.map((c) => `<div class="row-item click" data-open="contacts:${c.id}">${ava(c.name)}<div class="main"><b>${esc(c.name)}</b><small>${daysBetween(c.last_contact, td)} d · ${esc(orgName(c.org_kind, c.org_id) || "")}</small></div><span class="ico-box">${ICON.phone}</span></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div></div>
          ${can("admin") ? `<div class="panel reveal" style="--i:9"><div class="panel-head"><h3>${esc(t("recent"))}</h3><a href="#/admin">${esc(t("view_all"))} →</a></div><div class="rows" id="recent"><div class="empty">…</div></div></div>` : ""}
        </div>
      </div>`;
  };

  /* ---------- cases ---------- */
  PAGES.cases = () => {
    const D = S.data, td = today(), f = S.f.cases || (S.f.cases = { status: "active", kind: "", q: "" });
    const all = D.cases || [];
    const open = openCases();
    const list = all.filter((c) => (f.status === "active" ? !["resolved", "closed"].includes(c.status) : !f.status || c.status === f.status) && (!f.kind || c.kind === f.kind) &&
      (!f.q || (c.title + " " + c.description + " " + partnerName(c)).toLowerCase().includes(f.q.toLowerCase())))
      .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]) || (a.due || "9").localeCompare(b.due || "9"));
    const overdue = open.filter((c) => c.due && c.due < td).length;
    const resolved30 = all.filter((c) => c.resolved_on && daysBetween(c.resolved_on, td) <= 30).length;
    const st = [["active", t("open_cases"), open.length]].concat(ENUM.case_status.map((s) => [s, opt(s), all.filter((c) => c.status === s).length]).filter((x) => x[2])).concat([["", t("all"), all.length]]);
    const kinds = ENUM.case_kind.filter((k) => all.some((c) => c.kind === k));
    return head(D.farm.name, t("cases"), t("cases_sub"), newBtn("cases", "new_case", { status: "open", priority: "medium", opened: td })) + `
      <div class="cards">
        ${card(0, t("open_cases"), open.length, "", ICON.alert, "accent")}
        ${card(1, opt("high"), open.filter((c) => c.priority === "high").length, t("open_cases"), ICON.alert)}
        ${card(2, t("overdue_lbl"), overdue, "", ICON.calendar)}
        ${card(3, t("resolved_month"), resolved30, "", ICON.task)}
      </div>
      <div class="toolbar"><label class="search">${ICON.search}<input data-q="cases" value="${esc(f.q)}" placeholder="${esc(t("search"))}"></label>
        <select class="mini" data-ckind><option value="">${esc(t("kind"))}: ${esc(t("all"))}</option>${kinds.map((k) => `<option value="${k}"${f.kind === k ? " selected" : ""}>${esc(opt(k))}</option>`).join("")}</select>
        <span class="count">${esc(t("showing", { a: list.length, b: all.length }))}</span></div>
      <div class="chips">${st.map(([v, l, n]) => `<button class="chip-btn${f.status === v ? " on" : ""}" data-cstatus="${v}">${esc(l)}<span class="n">${n}</span></button>`).join("")}</div>
      <div class="table-wrap"><table><thead><tr><th>${esc(t("priority"))}</th><th>${esc(t("title"))}</th><th>${esc(t("kind"))}</th><th>${esc(t("status"))}</th><th>${esc(t("supplier"))} / ${esc(t("customer"))}</th><th>${esc(t("owner"))}</th><th>${esc(t("due"))}</th></tr></thead>
      <tbody>${list.map((c, i) => `<tr class="reveal" style="--i:${Math.min(i, 12)}" data-open="cases:${c.id}"><td><span class="badge ${PRIO_C[c.priority]}">${esc(opt(c.priority))}</span></td>
        <td class="wrap"><b>${esc(c.title)}</b>${sampleTag(c)}</td><td>${esc(opt(c.kind))}</td><td><span class="badge ${CST_C[c.status]}">${esc(opt(c.status))}</span></td>
        <td>${esc(partnerName(c))}</td><td>${c.owner_id ? ava(personName(c.owner_id)) + " " + esc(personName(c.owner_id)) : ""}</td>
        <td>${c.due ? esc(fdate(c.due, { day: "numeric", month: "short" })) + (c.due < td && !["resolved", "closed"].includes(c.status) ? ` <span class="badge red">${esc(t("late"))}</span>` : "") : ""}</td></tr>`).join("") ||
        `<tr><td colspan="7" class="empty">${esc(t("none_here"))}</td></tr>`}</tbody></table></div>`;
  };

  /* ---------- documents ---------- */
  PAGES.documents = () => {
    const D = S.data, f = S.f.documents || (S.f.documents = { kind: "", q: "", state: "" });
    const all = D.documents || [];
    const list = all.filter((d) => (!f.kind || d.kind === f.kind) && (!f.state || docState(d) === f.state) && (!f.q || (d.title + " " + d.notes + " " + partnerName(d)).toLowerCase().includes(f.q.toLowerCase())))
      .sort((a, b) => (a.valid_until || "9999").localeCompare(b.valid_until || "9999"));
    const n = (s) => all.filter((d) => docState(d) === s).length;
    const chips = [["", t("all"), all.length]].concat(ENUM.doc_kind.map((k) => [k, opt(k), all.filter((d) => d.kind === k).length]).filter((x) => x[2]));
    return head(D.farm.name, t("documents"), t("docs_sub"), newBtn("documents", "new_document", { kind: "certificate" })) + `
      <div class="cards">
        <div class="card click reveal${f.state === "valid" ? " accent" : ""}" style="--i:0" data-dstate="valid"><div class="label">${esc(t("valid"))}<span class="badge-ico">${ICON.doc}</span></div><div class="value" data-to="${n("valid")}">0</div></div>
        <div class="card click reveal${f.state === "expiring" ? " accent" : ""}" style="--i:1" data-dstate="expiring"><div class="label">${esc(t("expiring"))}<span class="badge-ico">${ICON.calendar}</span></div><div class="value" data-to="${n("expiring")}">0</div></div>
        <div class="card click reveal${f.state === "expired" ? " accent" : ""}" style="--i:2" data-dstate="expired"><div class="label">${esc(t("expired"))}<span class="badge-ico">${ICON.alert}</span></div><div class="value" data-to="${n("expired")}">0</div></div>
        <div class="card click reveal${f.state === "none" ? " accent" : ""}" style="--i:3" data-dstate="none"><div class="label">${esc(t("no_expiry"))}<span class="badge-ico">${ICON.doc}</span></div><div class="value" data-to="${n("none")}">0</div></div>
      </div>
      <div class="toolbar"><label class="search">${ICON.search}<input data-q="documents" value="${esc(f.q)}" placeholder="${esc(t("search"))}"></label><span class="count">${esc(t("showing", { a: list.length, b: all.length }))}</span></div>
      <div class="chips">${chips.map(([v, l, c]) => `<button class="chip-btn${f.kind === v ? " on" : ""}" data-dkind="${v}">${esc(l)}<span class="n">${c}</span></button>`).join("")}</div>
      <div class="table-wrap"><table><thead><tr><th>${esc(t("title"))}</th><th>${esc(t("kind"))}</th><th>${esc(t("supplier"))} / ${esc(t("customer"))}</th><th>${esc(t("owner"))}</th><th>${esc(t("valid_until"))}</th><th>${esc(t("status"))}</th><th></th></tr></thead>
      <tbody>${list.map((d, i) => `<tr class="reveal" style="--i:${Math.min(i, 12)}" data-open="documents:${d.id}"><td class="wrap"><b>${esc(d.title)}</b>${sampleTag(d)}</td><td>${esc(opt(d.kind))}</td>
        <td>${esc(partnerName(d))}</td><td>${esc(personName(d.owner_id))}</td><td>${esc(fdate(d.valid_until))}</td><td>${docBadge(d)}</td>
        <td>${/^https?:\/\//.test(d.link || "") ? `<a class="btn small" href="${esc(d.link)}" target="_blank" rel="noopener noreferrer" data-stop>${esc(t("open_link"))}</a>` : ""}</td></tr>`).join("") ||
        `<tr><td colspan="7" class="empty">${esc(t("none_here"))}</td></tr>`}</tbody></table></div>`;
  };

  PAGES.overview.after = async () => {
    if (!can("admin") || !$("#recent")) return;
    try { S.audit = await api("GET", "/api/audit"); } catch (e) { return; }
    $("#recent").innerHTML = S.audit.slice(0, 7).map((a) => `<div class="row-item">${ava(a.user_name)}<div class="main"><b>${esc(a.user_name)} ${esc(a.action)} ${esc(a.entity)}</b><small>${esc(a.summary || "")}</small></div><div class="end muted">${esc(fdate(a.at, { day: "numeric", month: "short" }))} ${esc(ftime(a.at))}</div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
  };

  function listPage({ entity, key, items, typeField, enumName, cols, newKey, searchFields, extraChips }) {
    const f = S.f[entity] || (S.f[entity] = { type: "", q: "", fav: false });
    let list = items.filter((x) => (!f.type || x[typeField] === f.type) && (!f.fav || x.favourite) &&
      (!f.q || searchFields.map((s) => typeof s === "function" ? s(x) : x[s]).join(" ").toLowerCase().includes(f.q.toLowerCase())));
    const chips = [["", t("all"), items.length]].concat(ENUM[enumName].map((o) => [o, opt(o), items.filter((x) => x[typeField] === o).length]).filter((c) => c[2]));
    return head(S.data.farm.name, t(key), "", `<button class="btn" data-export="${entity}">${esc(t("export"))}</button>` + newBtn(entity, newKey)) + `
      <div class="toolbar"><label class="search">${ICON.search}<input data-q="${entity}" value="${esc(f.q)}" placeholder="${esc(t("search"))}"></label>
        <span class="count">${esc(t("showing", { a: list.length, b: items.length }))}</span></div>
      <div class="chips">${chips.map(([v, l, n]) => `<button class="chip-btn${f.type === v ? " on" : ""}" data-chip="${entity}" data-v="${esc(v)}">${esc(l)}<span class="n">${n}</span></button>`).join("")}
        ${typeField !== "org_kind" ? `<button class="chip-btn${f.fav ? " on" : ""}" data-fav="${entity}">★ ${esc(t("favourites"))}</button>` : ""}${extraChips || ""}</div>
      <div class="table-wrap"><table><thead><tr>${cols.map((c) => `<th class="${c.right ? "right" : ""}">${esc(c.h)}</th>`).join("")}</tr></thead>
        <tbody>${list.map((x, i) => `<tr class="reveal" style="--i:${Math.min(i, 12)}" data-open="${entity}:${x.id}">${cols.map((c) => `<td class="${c.right ? "right num" : ""}${c.wrap ? " wrap" : ""}">${c.v(x)}</td>`).join("")}</tr>`).join("") ||
          `<tr><td colspan="${cols.length}" class="empty">${esc(t("none_here"))}</td></tr>`}</tbody></table></div>`;
  }
  const star = (entity, x) => `<button class="star${x.favourite ? " on" : ""}" data-star="${entity}:${x.id}" title="${esc(t("favourites"))}">★</button>`;
  const statusBadge = (s) => `<span class="badge ${{ active: "green", lead: "amber", paused: "", former: "" }[s] || ""}">${esc(opt(s))}</span>`;

  PAGES.customers = () => listPage({ entity: "customers", key: "customers", items: S.data.customers, typeField: "type", enumName: "customer_type", newKey: "new_customer",
    searchFields: ["name", "code", "city", "notes"], cols: [
      { h: "", v: (x) => star("customers", x) }, { h: t("name"), v: (x) => `<b>${esc(x.name)}</b>${sampleTag(x)}` }, { h: t("type"), v: (x) => esc(opt(x.type)) },
      { h: t("status"), v: (x) => statusBadge(x.status) }, { h: t("volume"), right: 1, v: (x) => eur(x.volume_eur) },
      { h: t("last_booking"), v: (x) => esc(fdate(x.last_booking)) }, { h: t("owner"), v: (x) => esc(personName(x.owner_id)) }] });

  PAGES.vendors = () => listPage({ entity: "vendors", key: "vendors", items: S.data.vendors, typeField: "type", enumName: "vendor_type", newKey: "new_vendor",
    searchFields: ["name", "notes"], cols: [
      { h: "", v: (x) => star("vendors", x) }, { h: t("name"), v: (x) => `<b>${esc(x.name)}</b>${sampleTag(x)}` }, { h: t("type"), v: (x) => esc(opt(x.type)) },
      { h: t("spend"), right: 1, v: (x) => eur(x.volume_eur) },
      { h: t("contract_end"), v: (x) => { if (!x.contract_end) return ""; const n = daysBetween(today(), x.contract_end); return `${esc(fdate(x.contract_end))} ${n < 0 ? `<span class="badge">${esc(t("ended"))}</span>` : n <= 90 ? `<span class="badge ${n <= 30 ? "red" : "amber"}">${esc(t("ends_in", { n }))}</span>` : ""}`; } },
      { h: t("contact"), v: (x) => esc((S.data.contacts.find((c) => c.org_kind === "vendor" && c.org_id === x.id) || {}).name || "") }] });

  PAGES.contacts = () => {
    const f = S.f.contacts || (S.f.contacts = { type: "", q: "", fav: false, due: false });
    const items = f.due ? S.data.contacts.filter((c) => c.last_contact && daysBetween(c.last_contact, today()) > 30) : S.data.contacts;
    const html = listPage({ entity: "contacts", key: "contacts", items, typeField: "org_kind", enumName: "org_kind", newKey: "new_contact",
      searchFields: ["name", "title", "email", "phone", (x) => orgName(x.org_kind, x.org_id)],
      extraChips: `<button class="chip-btn${f.due ? " on" : ""}" data-due>${ICON.phone} ${esc(t("due_call"))}</button>`, cols: [
        { h: t("name"), v: (x) => `${ava(x.name)} <b style="margin-left:8px">${esc(x.name)}</b>${sampleTag(x)}` },
        { h: t("organisation"), v: (x) => esc(orgName(x.org_kind, x.org_id) || "") }, { h: t("title"), v: (x) => esc(x.title) },
        { h: t("phone"), v: (x) => esc(x.phone) }, { h: t("email_addr"), v: (x) => esc(x.email) },
        { h: t("last_contact"), v: (x) => x.last_contact ? `${esc(fdate(x.last_contact))} <span class="muted">(${daysBetween(x.last_contact, today())} d)</span>` : "" }] });
    return html.replace('<div class="actions">', `<div class="actions">${can("contacts", "edit") ? `<label class="btn">${esc(t("import_contacts"))}<input type="file" accept=".csv,text/csv" data-import="contacts" hidden></label>` : ""}`);
  };

  PAGES.pipeline = () => {
    const D = S.data, f = S.f.pipeline || (S.f.pipeline = { owner: "" });
    const deals = D.deals.filter((d) => !f.owner || d.owner_id === Number(f.owner));
    const open = deals.filter((d) => !["won", "lost"].includes(d.stage));
    const total = open.reduce((s, d) => s + d.value, 0), weighted = open.reduce((s, d) => s + d.value * STAGE_ODDS[d.stage] / 100, 0);
    const owners = [...new Set(D.deals.map((d) => d.owner_id).filter(Boolean))];
    return head(t("open_deals", { n: open.length }), t("pipeline"), `${t("total")} ${eur(total)} · ${t("weighted", { v: eur(weighted) })}. ${t("drag_hint")}`, newBtn("deals", "new_deal")) + `
      <div class="chips"><button class="chip-btn${!f.owner ? " on" : ""}" data-owner="">${esc(t("everyone"))}</button>${owners.map((o) => `<button class="chip-btn${f.owner == o ? " on" : ""}" data-owner="${o}">${esc(personName(o))}</button>`).join("")}</div>
      <div class="board">${ENUM.stage.map((s) => { const l = deals.filter((d) => d.stage === s); return `<div class="col" data-stage="${s}" style="--c:${STAGE_C[s]}">
        <div class="col-head"><b><span class="dot"></span>${esc(opt(s))} <span class="badge">${l.length}</span></b><div><b class="num">${eur(l.reduce((a, d) => a + d.value, 0), true)}</b><small>${esc(t("odds", { n: STAGE_ODDS[s] }))}</small></div></div>
        ${l.map((d, i) => `<div class="deal" draggable="${can("pipeline", "edit")}" data-deal="${d.id}" data-open="deals:${d.id}" style="--c:${STAGE_C[s]};animation-delay:${i * 40}ms"><b>${esc(d.title)}</b>${sampleTag(d)}<span class="muted">${esc((byId("customers", d.customer_id) || {}).name || "")}</span>
          <div class="foot"><b class="num" style="color:var(--text)">${eur(d.value)}</b><span>${esc(fdate(d.expected, { day: "numeric", month: "short" }))}</span>${d.owner_id ? ava(personName(d.owner_id)) : ""}</div></div>`).join("")}</div>`; }).join("")}</div>`;
  };

  PAGES.calls = () => {
    const D = S.data, f = S.f.calls || (S.f.calls = { tab: "upcoming", kind: "" }), td = today();
    const ofKind = (c) => !f.kind || (c.kind || "call") === f.kind;
    const reqs = D.calls.filter((c) => c.status === "requested");
    const up = D.calls.filter((c) => c.status === "planned" && ofKind(c)).sort((a, b) => (a.at || "").localeCompare(b.at || ""));
    const hist = D.calls.filter((c) => ["done", "missed", "cancelled"].includes(c.status) && ofKind(c)).sort((a, b) => (b.at || "").localeCompare(a.at || ""));
    const kchips = [["", t("all"), D.calls.filter((c) => c.status !== "requested").length]].concat(ENUM.call_kind.map((k) => [k, opt(k), D.calls.filter((c) => c.status !== "requested" && (c.kind || "call") === k).length]).filter((x) => x[2]));
    const dueC = D.contacts.filter((c) => c.last_contact).sort((a, b) => a.last_contact.localeCompare(b.last_contact));
    const row = (c) => `<div class="row-item click" data-open="calls:${c.id}"><span class="badge ${c.status === "planned" ? "blue" : c.status === "done" ? "green" : c.status === "missed" ? "red" : "amber"}">${esc(ftime(c.at) || opt(c.status))}</span>
      <span class="badge ${KIND_C[c.kind || "call"]}">${esc(opt(c.kind || "call"))}</span>
      <div class="main"><b>${esc(c.topic)}</b>${sampleTag(c)}<small>${esc(partnerName(c) || c.req_org || "")}${c.place ? " · " + esc(c.place) : ""}${c.owner_id ? " · " + esc(personName(c.owner_id)) : ""}</small></div>${c.outcome ? `<div class="end muted">${esc(c.outcome)}</div>` : ""}</div>`;
    let body;
    if (f.tab === "requests") body = reqs.map((c) => `<div class="row-item"><div class="ico-box">${ICON.inbox}</div><div class="main"><b>${esc(c.topic)}</b>${sampleTag(c)}<small>${esc(c.req_name)}${c.req_org ? " · " + esc(c.req_org) : ""} · ${esc(c.req_email || c.req_phone || "")} · ${esc(c.at ? fdate(c.at) + " " + ftime(c.at) : t("no_time"))}</small></div>
        ${can("calls", "edit") ? `<button class="btn small primary" data-call="${c.id}:planned">${esc(t("accept"))}</button><button class="btn small" data-call="${c.id}:cancelled">${esc(t("decline"))}</button>` : ""}</div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
    else if (f.tab === "history") body = hist.map(row).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
    else if (f.tab === "due") body = dueC.map((c) => `<div class="row-item click" data-new="calls" data-preset='${esc(JSON.stringify({ contact_id: c.id, customer_id: c.org_kind === "customer" ? c.org_id : null, topic: "Call " + c.name, status: "planned" }))}'>${ava(c.name)}<div class="main"><b>${esc(c.name)}</b><small>${esc(orgName(c.org_kind, c.org_id) || "")} · ${esc(c.phone || "")}</small></div><div class="end"><span class="badge ${daysBetween(c.last_contact, td) > 30 ? "amber" : ""}">${daysBetween(c.last_contact, td)} d</span></div></div>`).join("");
    else {
      const days = {}; up.forEach((c) => { const k = (c.at || "").slice(0, 10) || "—"; (days[k] = days[k] || []).push(c); });
      body = Object.keys(days).map((k) => `<div class="section-title">${esc(k === td ? t("today") : fdate(k, { weekday: "long", day: "numeric", month: "long" }))}</div><div class="panel" style="padding:4px 12px">${days[k].map(row).join("")}</div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
    }
    const tab = (k, label, n) => `<button class="${f.tab === k ? "on" : ""}" data-tab="${k}">${esc(label)}${n != null ? `<span class="count">${n}</span>` : ""}</button>`;
    return head(S.data.farm.name, t("calls"), t("act_sub"), `<button class="btn" data-act="booklink">${esc(t("copy_link"))}</button>` + newBtn("calls", "new_call", { status: "planned", kind: f.kind || "visit" })) +
      `<div class="tabs">${tab("upcoming", t("upcoming"), up.length)}${tab("requests", t("requests"), reqs.length)}${tab("due", t("due_call"))}${tab("history", t("history"), hist.length)}</div>
      ${["upcoming", "history"].includes(f.tab) ? `<div class="chips">${kchips.map(([v, l, n]) => `<button class="chip-btn${f.kind === v ? " on" : ""}" data-akind="${v}">${esc(l)}<span class="n">${n}</span></button>`).join("")}</div>` : ""}
      <div class="rows">${body}</div>`;
  };

  PAGES.tasks = () => {
    const D = S.data, f = S.f.tasks || (S.f.tasks = { level: null, tiles: [], q: "", owner: "" });
    const open = D.tasks.filter((x) => !["done", "confirmed"].includes(x.status));
    const TILES = [["urgent", "tiles_urgent", (x) => x.prio === "urgent"], ["waiting", "tiles_waiting", (x) => x.status === "reported"], ["noowner", "tiles_noowner", (x) => !x.owner_id], ["decision", "tiles_decision", (x) => x.status === "decision"]];
    const pass = (x) => (!f.level || LEVEL_OF[x.area] === f.level) && f.tiles.every((k) => TILES.find((d) => d[0] === k)[2](x)) &&
      (!f.owner || x.owner_id === Number(f.owner)) && (!f.q || (x.title + " " + x.reason + " " + x.next).toLowerCase().includes(f.q.toLowerCase()));
    const list = open.filter(pass);
    const cnt = (l) => ({ n: l.length, w: l.filter((x) => x.prio === "week").length, u: l.filter((x) => x.prio === "urgent").length });
    const LV_C = ["var(--blue)", "var(--violet)", "var(--green)", "var(--amber)", "var(--faint)"];
    const navItem = (id, name, c, i) => `<button data-level="${id || ""}" class="lv${id ? "" : " all"}${(f.level || "") === (id || "") ? " on" : ""}" style="--c:${id ? LV_C[i] : "var(--text)"}">
      <span class="pt"></span><span class="t"><b>${esc(name)}</b>
      <span class="nums"><span class="badge">${c.n}</span>${c.w ? `<span class="badge amber">${c.w} ${esc(t("g_week").toLowerCase())}</span>` : ""}${c.u ? `<span class="badge red">${c.u} ${esc(t("tiles_urgent"))}</span>` : ""}</span></span></button>`;
    const row = (x) => {
      const step = x.status === "confirmed" || x.status === "done" ? 2 : x.status === "reported" ? 1 : 0;
      const ed = can("tasks", "edit");
      return `<details class="task" data-task="${x.id}"><summary><span class="dot ${x.prio}"></span><span class="t">${esc(x.title)}</span>${sampleTag(x)}
        ${x.source === "teams" && !x.replied ? `<span class="badge red">${esc(t("not_replied"))}</span>` : ""}${x.owner_id ? ava(personName(x.owner_id)) : `<span class="badge amber">${esc(t("tiles_noowner"))}</span>`}</summary>
        <div class="detail"><div><b class="muted">${esc(t("reason"))}:</b> <span class="badge ${x.prio === "urgent" ? "red" : x.prio === "week" ? "amber" : ""}">${esc(opt(x.prio))}</span> ${esc(x.reason || "")}</div>
          <div class="flow">${[t("flow_open"), t("flow_reported"), t("flow_confirmed")].map((s, i) => `<span class="${i === step ? "on" : ""}">${esc(s)}</span>`).join("<i>→</i>")}</div>
          <dl class="facts"><dt>${esc(t("status"))}</dt><dd>${esc(opt(x.status))}</dd><dt>${esc(t("owner"))}</dt><dd>${esc(personName(x.owner_id) || "–")}</dd>
            <dt>${esc(t("area"))}</dt><dd>${esc(opt(x.area))} · ${esc(t("l_" + LEVEL_OF[x.area]))}</dd>${x.deadline ? `<dt>${esc(t("deadline"))}</dt><dd>${esc(fdate(x.deadline))}</dd>` : ""}${x.next ? `<dt>${esc(t("next"))}</dt><dd>${esc(x.next)}</dd>` : ""}</dl>
          ${ed ? `<div class="toolbar" style="margin:0"><button class="btn small" data-open="tasks:${x.id}">${esc(t("edit"))}</button>
            ${x.status !== "reported" ? `<button class="btn small" data-tstat="${x.id}:reported">${esc(t("report_done"))}</button>` : `<button class="btn small primary" data-tstat="${x.id}:confirmed">${esc(t("confirm"))}</button><button class="btn small" data-tstat="${x.id}:notdone">${esc(t("not_done"))}</button>`}
            <button class="btn small" data-tstat="${x.id}:done">${esc(t("mark_done"))}</button></div>` : ""}</div></details>`;
    };
    const group = (key, title, items, open) => `<details class="group" ${open ? "open" : ""} data-g="${key}"><summary><b>${esc(title)}</b><small>${items.length}</small></summary>${items.map(row).join("") || `<div class="empty" style="padding-left:34px">${esc(t("none_here"))}</div>`}</details>`;
    const cut = new Date(Date.parse(today()) - 30 * 864e5).toISOString().slice(0, 10);
    const done = D.tasks.filter((x) => ["done", "confirmed"].includes(x.status) && (x.done_on || x.updated || "").slice(0, 10) >= cut);
    const og = S.f.taskGroups || (S.f.taskGroups = new Set(["urgent", "week"]));
    return head(S.data.farm.name, t("tasks"), "", newBtn("tasks", "new_task")) + `
      <div class="cards">${TILES.map(([k, label, fn], i) => `<div class="card click reveal${f.tiles.includes(k) ? " accent" : ""}" style="--i:${i}" data-tile="${k}"><div class="label">${esc(t(label))}</div><div class="value" data-to="${open.filter((x) => (!f.level || LEVEL_OF[x.area] === f.level)).filter(fn).length}">0</div></div>`).join("")}</div>
      <div class="task-layout"><nav class="pyr"><div class="head">${esc(t("area"))}</div>${navItem(null, t("all_tasks"), cnt(open), 0)}${LEVELS.map((id, i) => navItem(id, t("l_" + id), cnt(open.filter((x) => LEVEL_OF[x.area] === id)), i)).join("")}</nav>
      <div><div class="toolbar"><label class="search">${ICON.search}<input data-tq value="${esc(f.q)}" placeholder="${esc(t("search"))}"></label>
        <select class="mini" data-towner><option value="">${esc(t("everyone"))}</option>${D.people.map((p) => `<option value="${p.id}"${f.owner == p.id ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
        <span class="count">${esc(t("showing", { a: list.length, b: open.length }))}</span></div>
        ${list.some((x) => x.status === "reported") ? group("waiting", t("g_waiting"), list.filter((x) => x.status === "reported"), og.has("waiting")) : ""}
        ${["urgent", "week", "later", "none"].map((p) => group(p, t("g_" + p), list.filter((x) => x.prio === p && x.status !== "reported"), og.has(p))).join("")}
        <details class="group" data-g="done" ${og.has("done") ? "open" : ""}><summary><b>${esc(t("g_done"))}</b><small>${done.length}</small></summary><div class="rows" style="padding:0 16px 10px">${done.sort((a, b) => (b.done_on || "").localeCompare(a.done_on || "")).map((x) => `<div class="row-item"><span class="muted num">${esc(fdate(x.done_on || x.updated))}</span><div class="main"><b>${esc(x.title)}</b></div>${x.owner_id ? ava(personName(x.owner_id)) : ""}</div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div></details>
      </div></div>`;
  };

  PAGES.workers = () => {
    const D = S.data;
    const feeders = (D.feed_workers || []);
    return head(S.data.farm.name, t("workers"), t("from_cowconnect"), newBtn("people", "new_worker")) + `
      <div class="worker-cards">${feeders.map((w, i) => { const p = D.people.find((x) => x.operator_name === w.operator); return `<div class="card click reveal" style="--i:${i}" ${p ? `data-open="people:${p.id}"` : ""}>
        <div class="label"><span style="display:flex;gap:10px;align-items:center">${ava(p ? p.name : w.operator)}<b style="color:var(--text)">${esc(p ? p.name : w.operator)}</b></span><span class="badge ${w.accuracy < 97 ? "amber" : "green"}">${w.accuracy}%</span></div>
        <div class="value" data-to="${w.loads}">0</div><div class="sub">${esc(t("loads"))} · ${esc(t("first_last", { f: fdate(w.first_day, { day: "numeric", month: "short" }), l: fdate(w.last_day, { day: "numeric", month: "short" }) }))}</div>
        <div style="margin-top:10px">${spark(w.operator)}</div></div>`; }).join("")}</div>
      <div class="table-wrap"><table><thead><tr><th>${esc(t("name"))}</th><th>${esc(t("job"))}</th><th>${esc(t("organisation"))}</th><th>${esc(t("role"))}</th><th>${esc(t("operator"))}</th><th>${esc(t("username"))}</th></tr></thead>
      <tbody>${D.people.map((p, i) => `<tr class="reveal" style="--i:${Math.min(i, 12)}" data-open="people:${p.id}"><td>${ava(p.name)} <b style="margin-left:8px">${esc(p.name)}</b>${sampleTag(p)}${p.active === 0 ? ' <span class="badge">off</span>' : ""}</td><td>${esc(p.job || "")}</td><td>${esc(orgName(p.org_kind, p.org_id) || "")}</td>
        <td>${esc((D.roles.find((r) => r.id === p.role_id) || {}).name || "")}</td><td>${esc(p.operator_name || "")}</td><td>${p.username ? `<span class="badge blue">${esc(p.username)}</span>` : `<span class="muted">${esc(t("login_no"))}</span>`}</td></tr>`).join("")}</tbody></table></div>`;
  };

  PAGES.reports = () => {
    const D = S.data;
    const bars = (rows, fmt) => { const max = Math.max(1, ...rows.map((r) => r[1])); return `<div class="bars">${rows.map(([n, v], i) => `<div class="bar-row"><span class="name">${esc(n)}</span><span class="track"><span class="fill" style="width:${(v / max) * 100}%;animation-delay:${i * 60}ms"></span></span><span class="num muted">${fmt ? fmt(v) : v}</span></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div>`; };
    const sum = (l, k) => l.reduce((s, x) => s + (x[k] || 0), 0);
    const panel = (i, title, inner) => `<div class="panel reveal" style="--i:${i}"><div class="panel-head"><h3>${esc(title)}</h3></div>${inner}</div>`;
    const vt = ENUM.vendor_type.map((tp) => [opt(tp), sum(D.vendors.filter((v) => v.type === tp), "volume_eur")]).filter((r) => r[1]);
    const weeks = {}; (D.feed_days || []).forEach((d) => { weeks[d.operator] = (weeks[d.operator] || 0) + d.loads; });
    const oc = openCases();
    const ds = ["valid", "expiring", "expired", "none"].map((k) => [t(k === "none" ? "no_expiry" : k), (D.documents || []).filter((d) => docState(d) === k).length]);
    return head(S.data.farm.name, t("reports"), "") + `<div class="grid halves">
      ${panel(0, t("rep_cases"), bars(ENUM.case_kind.map((k) => [opt(k), oc.filter((c) => c.kind === k).length]).filter((r) => r[1])))}
      ${panel(1, t("rep_calls"), bars(ENUM.call_kind.map((k) => [opt(k), D.calls.filter((c) => (c.kind || "call") === k && c.status !== "cancelled").length])))}
      ${panel(6, t("rep_docs"), bars(ds))}
      ${pageVisible("pipeline") ? panel(7, t("rep_pipeline"), bars(ENUM.stage.map((s) => [opt(s), sum(D.deals.filter((d) => d.stage === s), "value")]), (v) => eur(v, true))) : ""}
      ${panel(2, t("rep_cust"), bars(D.customers.filter((c) => c.volume_eur).sort((a, b) => b.volume_eur - a.volume_eur).map((c) => [c.name, c.volume_eur]), (v) => eur(v, true)))}
      ${panel(3, t("rep_vend"), bars(vt.sort((a, b) => b[1] - a[1]), (v) => eur(v, true)))}
      ${panel(4, t("rep_feed"), bars(Object.entries(weeks).map(([op, n]) => [(D.people.find((p) => p.operator_name === op) || {}).name || op, n])))}
      ${panel(5, t("rep_tasks"), bars(ENUM.prio.map((p) => [opt(p), D.tasks.filter((x) => x.prio === p && !["done", "confirmed"].includes(x.status)).length])))}</div>`;
  };

  PAGES.roles = () => {
    const D = S.data, ed = can("roles", "edit");
    const mods = D.modules;
    return head(S.data.farm.name, t("roles"), t("rights"), ed ? `<button class="btn primary" data-newrole>${ICON.plus} ${esc(t("new_role"))}</button>` : "") + `
      <div class="table-wrap matrix"><table><thead><tr><th>${esc(t("role"))}</th>${mods.map((m) => `<th>${esc(t(m === "people" ? "workers" : m))}</th>`).join("")}<th></th></tr></thead>
      <tbody>${D.roles.map((r) => `<tr data-role="${r.id}"><td><b>${esc(r.name)}</b><br><small class="muted">${esc(r.note || "")}</small></td>${mods.map((m) => `<td><select data-perm="${m}"${ed ? "" : " disabled"}>${["none", "see", "edit"].map((l) => `<option value="${l}"${(r.perms[m] || "none") === l ? " selected" : ""}>${esc(t(l === "edit" ? "edit_r" : l))}</option>`).join("")}</select></td>`).join("")}
        <td>${ed ? `<button class="btn small" data-saverole="${r.id}">${esc(t("save"))}</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`;
  };

  PAGES.admin = () => {
    const D = S.data, ed = can("admin", "edit"), codes = Object.keys(LANG.languages);
    const f = S.f.admin || (S.f.admin = { edit: codes.find((c) => c !== "en") || "en", missing: false, pack: null });
    if (!f.pack) f.pack = JSON.parse(JSON.stringify(LANG));
    const L = f.pack.languages[f.edit] || f.pack.languages.en;
    const keys = Object.keys(BUILTIN.en.strings);
    const miss = f.edit === "en" ? 0 : keys.filter((k) => !L.strings[k]).length;
    return head(S.data.farm.name, t("admin"), "") + `<div class="grid halves">
      <div class="panel"><div class="panel-head"><h3>${esc(t("farm"))}</h3></div><form class="form" id="farm-form"><label class="full">${esc(t("farm_name"))}<input name="name" value="${esc(D.farm.name)}" maxlength="120"${ed ? "" : " disabled"}></label></form>
        ${ed ? `<div class="form-actions"><button class="btn primary" data-savefarm>${esc(t("save"))}</button></div>` : ""}
        <div class="section-title">${esc(t("sample_data"))}</div><p class="muted">${esc(t("sample_n", { n: D.sample_count }))}</p>
        ${ed && D.sample_count ? `<button class="btn danger" data-rmsample>${esc(t("remove_sample"))}</button>` : ""}
        <div class="section-title">${esc(t("data_sources"))}</div><p class="muted">${esc(t("ds_hint"))}</p></div>
      <div class="panel"><div class="panel-head"><h3>Import</h3></div><p class="muted">${esc(t("import_hint"))}</p>
        <div class="toolbar">${can("contacts", "edit") ? `<label class="btn">${esc(t("import_contacts"))}<input type="file" accept=".csv,text/csv" data-import="contacts" hidden></label>` : ""}
        ${ed ? `<label class="btn">${esc(t("import_feed"))}<input type="file" accept=".csv,text/csv" data-import="feed" hidden></label>` : ""}</div></div>
    </div>
    <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>${esc(t("pages_buttons"))}</h3></div><p class="muted">${esc(t("pb_hint"))}</p>
      <div class="grid halves"><div><div class="section-title" style="margin-top:0">${esc(t("pages"))}</div><div class="pb-list">
        ${NAV.filter(([r]) => !["overview", "admin"].includes(r)).map(([r, , ic]) => `<label class="pb"><span class="ni">${ICON[ic]}</span><span>${esc(pageLabel(r))}</span><input type="checkbox" class="switch" data-pb="page:${r}"${pageVisible(r) ? " checked" : ""}${ed ? "" : " disabled"}></label>`).join("")}</div></div>
        <div><div class="section-title" style="margin-top:0">${esc(t("buttons"))}</div><div class="pb-list">
        ${TOP_BUTTONS.map((b) => `<label class="pb"><span>${esc(t("btn_" + b))}</span><input type="checkbox" class="switch" data-pb="button:${b}"${buttonVisible(b) ? " checked" : ""}${ed ? "" : " disabled"}></label>`).join("")}</div></div></div></div>
    <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>${esc(t("languages"))}</h3><span class="sub">${miss ? esc(t("missing_n", { n: miss })) : ""}</span></div>
      <div class="toolbar"><label class="muted">${esc(t("default_lang"))} <select class="mini" data-adefault${ed ? "" : " disabled"}>${Object.entries(f.pack.languages).map(([c, x]) => `<option value="${c}"${c === f.pack.default ? " selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label>
        <label class="muted">${esc(t("translate"))} <select class="mini" data-aedit>${Object.entries(f.pack.languages).map(([c, x]) => `<option value="${c}"${c === f.edit ? " selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label>
        <label class="muted"><input type="checkbox" data-amissing${f.missing ? " checked" : ""}> ${esc(t("only_missing"))}</label>
        ${ed ? `<input class="mini" style="width:90px" data-newcode placeholder="${esc(t("lang_code"))}"><input class="mini" style="width:120px" data-newname placeholder="${esc(t("lang_name"))}"><button class="btn small" data-addlang>${esc(t("add_lang"))}</button><button class="btn small primary" data-savelang>${esc(t("save"))}</button>` : ""}</div>
      <div class="table-wrap" style="max-height:420px;overflow:auto"><table><thead><tr><th>Key</th><th>English</th><th>${esc(L.name)}</th></tr></thead><tbody>
        ${keys.filter((k) => !f.missing || !L.strings[k]).map((k) => `<tr style="cursor:default"><td class="muted"><code>${esc(k)}</code></td><td class="wrap">${esc(BUILTIN.en.strings[k])}</td><td class="wrap"><input class="mini" style="width:100%" data-lkey="${esc(k)}" value="${esc(L.strings[k] || "")}"${ed ? "" : " disabled"}></td></tr>`).join("")}</tbody></table></div></div>
    <div class="panel" style="margin-top:14px"><div class="panel-head"><h3>${esc(t("changelog"))}</h3></div><div class="rows" id="audit-list"><div class="empty">…</div></div></div>`;
  };
  PAGES.admin.after = async () => {
    try { S.audit = await api("GET", "/api/audit"); } catch (e) { return; }
    $("#audit-list").innerHTML = S.audit.map((a) => `<div class="row-item"><span class="muted num" style="width:130px">${esc(a.at)}</span><div class="main"><b>${esc(a.user_name)} · ${esc(a.action)} ${esc(a.entity)}</b><small>${esc(a.summary || "")}</small></div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
  };

  /* ================= projects ================= */
  const PST_C = { planning: "blue", active: "green", review: "violet", done: "", paused: "amber" };
  const stepsOf = (pid) => S.data.project_steps.filter((s) => s.project_id === pid);
  function progressOf(pid) { const st = stepsOf(pid), done = st.filter((s) => s.done).length; return { st, done, n: st.length, pct: st.length ? Math.round((done / st.length) * 100) : 0, cur: st.find((s) => !s.done) }; }
  function stepper(pid) {
    const p = progressOf(pid);
    if (!p.n) return `<div class="stepper"><small class="muted">${esc(t("no_steps"))}</small></div>`;
    const dots = p.st.map((s) => `<span class="sd ${s.done ? "done" : s === p.cur ? "cur" : ""}" title="${esc(s.title)}">${s.done ? "✓" : ""}</span>`).join('<span class="sl"></span>');
    return `<div class="stepper"><div class="dots">${dots}</div><small class="muted">${esc(t("of_steps", { a: p.done, b: p.n }))} · ${esc(p.cur ? p.cur.title : t("all_done"))}</small></div>`;
  }
  function dueBadge(due, done) {
    if (!due) return "";
    const n = daysBetween(today(), due);
    const cls = done ? "" : n < 0 ? "red" : n <= 7 ? "amber" : "";
    return `<span class="badge ${cls}">${esc(t("due"))} ${esc(fdate(due, { day: "numeric", month: "short" }))}${!done && n < 0 ? " · " + esc(t("late")) : ""}</span>`;
  }

  PAGES.projects = () => {
    const D = S.data, f = S.f.projects || (S.f.projects = { status: "" });
    const list = D.projects.filter((p) => !f.status || p.status === f.status);
    const live = D.projects.filter((p) => ["active", "review"].includes(p.status));
    const wk = D.project_steps.filter((s) => s.done && s.done_on && daysBetween(s.done_on, today()) <= 7).length;
    const next = D.projects.filter((p) => p.status !== "done" && p.due).sort((a, b) => a.due.localeCompare(b.due))[0];
    const avg = live.length ? Math.round(live.reduce((a, p) => a + progressOf(p.id).pct, 0) / live.length) : 0;
    const chips = [["", t("all"), D.projects.length]].concat(ENUM.project_status.map((s) => [s, opt(s), D.projects.filter((p) => p.status === s).length]).filter((c) => c[2]));
    const team = (p) => [...new Set([p.owner_id].concat(stepsOf(p.id).map((s) => s.owner_id)).filter(Boolean))].slice(0, 4).map((id) => ava(personName(id))).join("");
    return head(`${live.length} ${t("active_projects").toLowerCase()}`, t("projects"), t("prj_sub"), newBtn("projects", "new_project", { status: "planning" })) + `
      <div class="cards">
        ${card(0, t("active_projects"), live.length, `${D.projects.filter((p) => p.status === "planning").length} ${opt("planning").toLowerCase()} · ${D.projects.filter((p) => p.status === "review").length} ${opt("review").toLowerCase()}`, ICON.task, "accent")}
        ${card(1, t("steps_week"), wk, "", ICON.task)}
        ${card(2, t("next_due"), next ? next.title : "–", next ? `${fdate(next.due, { day: "numeric", month: "short" })} · ${daysBetween(today(), next.due) >= 0 ? t("in_days", { n: daysBetween(today(), next.due) }) : t("days_ago", { n: -daysBetween(today(), next.due) })}` : "", ICON.task)}
        ${card(3, t("overall"), "pct:" + avg, t("active_projects"), ICON.task)}
      </div>
      <div class="chips">${chips.map(([v, l, n]) => `<button class="chip-btn${f.status === v ? " on" : ""}" data-pstatus="${v}">${esc(l)}<span class="n">${n}</span></button>`).join("")}</div>
      <div class="proj-grid">${list.map((p, i) => { const pr = progressOf(p.id); return `<div class="proj reveal" style="--i:${Math.min(i, 10)}" data-open="projects:${p.id}">
        <div class="proj-top"><span class="badge ${PST_C[p.status]}">● ${esc(opt(p.status))}</span>${dueBadge(p.due, p.status === "done")}</div>
        <h3>${esc(p.title)}${sampleTag(p)}</h3><small class="muted">${esc(p.subtitle || (byId("customers", p.customer_id) || {}).name || "")}</small>
        ${stepper(p.id)}
        <div class="proj-prog"><span class="muted">${esc(t("overall"))}</span><b class="num">${pr.pct}%</b></div>
        <div class="track big"><span class="fill" style="width:${pr.pct}%"></span></div>
        <div class="proj-foot"><span class="team">${team(p)}</span><span class="link-txt">${esc(t("open"))} →</span></div></div>`; }).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div>`;
  };

  function projectPanel(p) {
    const pr = progressOf(p.id), ed = can("projects", "edit");
    const ups = S.data.project_updates.filter((u) => u.project_id === p.id);
    return `<div class="ro"><span class="muted">${esc(opt(p.status))} · ${esc(t("of_steps", { a: pr.done, b: pr.n }))}</span><b class="num">${pr.pct}%</b>
        <div class="track big" style="margin-top:6px"><span class="fill" style="width:${pr.pct}%"></span></div></div>
      <div class="section-title">${esc(t("steps"))}</div>
      <div class="checklist">${pr.st.map((s) => `<div class="check-row${s.done ? " done" : ""}">
          <label><input type="checkbox" data-step="${s.id}"${s.done ? " checked" : ""}${ed ? "" : " disabled"}><span>${esc(s.title)}</span></label>
          ${s.done_on ? `<small class="muted">${esc(fdate(s.done_on, { day: "numeric", month: "short" }))}</small>` : ""}${s.owner_id ? ava(personName(s.owner_id)) : ""}
          ${ed ? `<button class="icon-btn small-x" data-stepdel="${s.id}" title="${esc(t("delete"))}">${ICON.x}</button>` : ""}</div>`).join("") || `<div class="empty">${esc(t("no_steps"))}</div>`}</div>
      ${ed ? `<div class="add-row"><input id="new-step" maxlength="300" placeholder="${esc(t("add_step"))}"><select id="new-step-owner"><option value="">–</option>${S.data.people.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join("")}</select><button class="btn small" data-stepadd="${p.id}">${ICON.plus}</button></div>` : ""}
      <div class="section-title">${esc(t("progress_updates"))}</div>
      ${ed ? `<div class="add-row"><textarea id="new-update" maxlength="4000" placeholder="${esc(t("update_ph"))}"></textarea><button class="btn small primary" data-updadd="${p.id}">${esc(t("add_update"))}</button></div>` : ""}
      <div class="timeline">${ups.map((u) => `<div class="tl"><span class="tl-dot"></span><div><b>${esc(u.author || "")}</b> <small class="muted">${esc(fdate(u.at, { day: "numeric", month: "short" }))} ${esc(ftime(u.at))}</small><p>${esc(u.note)}</p></div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div>
      <div class="section-title">${esc(t("edit"))}</div>`;
  }

  /* ================= schedule ================= */
  const EV_C = { call: "var(--blue)", visit: "var(--green)", service: "var(--violet)", inspection: "var(--amber)", meeting: "var(--faint)", request: "var(--amber)",
    task: "var(--amber)", deal: "var(--violet)", project: "var(--green)", contract: "var(--red)", case: "var(--red)" };
  const evLabel = (type) => ENUM.call_kind.includes(type) ? opt(type) : type === "request" ? opt("requested") : t("ev_" + type);
  function schedEvents() {
    const D = S.data, out = [];
    D.calls.filter((c) => c.at && c.status !== "cancelled").forEach((c) => out.push({ date: c.at.slice(0, 10), time: ftime(c.at), type: c.status === "requested" ? "request" : (c.kind || "call"), title: c.topic, sub: partnerName(c) || c.req_org || c.place || "", open: "calls:" + c.id, owner: c.owner_id, done: c.status === "done" }));
    D.tasks.filter((x) => x.deadline && !["done", "confirmed"].includes(x.status)).forEach((x) => out.push({ date: x.deadline, type: "task", title: x.title, open: "tasks:" + x.id, owner: x.owner_id }));
    (D.cases || []).filter((c) => c.due && !["resolved", "closed"].includes(c.status)).forEach((c) => out.push({ date: c.due, type: "case", title: c.title, sub: opt(c.priority), open: "cases:" + c.id, owner: c.owner_id }));
    if (pageVisible("pipeline")) D.deals.filter((x) => x.expected && !["won", "lost"].includes(x.stage)).forEach((x) => out.push({ date: x.expected, type: "deal", title: x.title, sub: eur(x.value), open: "deals:" + x.id, owner: x.owner_id }));
    D.projects.filter((p) => p.due && p.status !== "done").forEach((p) => out.push({ date: p.due, type: "project", title: p.title, sub: progressOf(p.id).pct + "%", open: "projects:" + p.id, owner: p.owner_id }));
    D.vendors.filter((v) => v.contract_end).forEach((v) => out.push({ date: v.contract_end, type: "contract", title: v.name, open: "vendors:" + v.id, owner: v.owner_id }));
    return out;
  }
  const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  const monday = (iso) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
  const evPill = (e) => `<button class="ev" style="--c:${EV_C[e.type]}" data-open="${e.open}" title="${esc(evLabel(e.type))}: ${esc(e.title)}">${e.time ? `<b>${esc(e.time)}</b> ` : ""}${esc(e.title)}</button>`;

  PAGES.schedule = () => {
    const D = S.data, td = today(), f = S.f.schedule || (S.f.schedule = { view: "week", anchor: td, who: "" });
    const evs = schedEvents().filter((e) => !f.who || e.owner === Number(f.who));
    const todayLeft = evs.filter((e) => e.date === td && !e.done).length;
    const owners = [...new Set(schedEvents().map((e) => e.owner).filter(Boolean))];
    const legend = ["call", "visit", "service", "inspection", "task", "project", "case", "contract"].map((k) => `<span class="lg"><i style="background:${EV_C[k]}"></i>${esc(evLabel(k))}</span>`).join("");
    let body = "", rangeTitle = "";
    if (f.view === "month") {
      const a = new Date(f.anchor + "T12:00:00"), first = new Date(a.getFullYear(), a.getMonth(), 1, 12), start = monday(isoOf(first));
      rangeTitle = a.toLocaleDateString(locale(), { month: "long", year: "numeric" });
      const cells = [];
      for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); cells.push(d); }
      const wd = cells.slice(0, 7).map((d) => `<div class="mh">${esc(d.toLocaleDateString(locale(), { weekday: "short" }))}</div>`).join("");
      body = `<div class="month">${wd}${cells.map((d) => { const iso = isoOf(d), l = evs.filter((e) => e.date === iso);
        return `<div class="mc${d.getMonth() !== a.getMonth() ? " out" : ""}${iso === td ? " now" : ""}" data-day="${iso}"><span class="dn">${d.getDate()}</span>${l.slice(0, 3).map(evPill).join("")}${l.length > 3 ? `<small class="muted">${esc(t("more_n", { n: l.length - 3 }))}</small>` : ""}</div>`; }).join("")}</div>`;
    } else if (f.view === "agenda") {
      const from = td, upto = isoOf(new Date(Date.parse(td) + 30 * 864e5));
      const days = {}; evs.filter((e) => e.date >= from && e.date <= upto).sort((a, b) => (a.date + (a.time || "00")).localeCompare(b.date + (b.time || "00"))).forEach((e) => (days[e.date] = days[e.date] || []).push(e));
      rangeTitle = `${fdate(from, { day: "numeric", month: "short" })} – ${fdate(upto, { day: "numeric", month: "short", year: "numeric" })}`;
      body = Object.keys(days).map((k) => `<div class="section-title">${esc(k === td ? t("today") : fdate(k, { weekday: "long", day: "numeric", month: "long" }))}</div>
        <div class="panel" style="padding:4px 12px">${days[k].map((e) => `<div class="row-item click" data-open="${e.open}"><span class="dot" style="background:${EV_C[e.type]}"></span><span class="badge">${esc(e.time || evLabel(e.type))}</span><div class="main"><b>${esc(e.title)}</b><small>${esc(e.sub || "")}${e.owner ? " · " + esc(personName(e.owner)) : ""}</small></div></div>`).join("")}</div>`).join("") || `<div class="empty">${esc(t("nothing"))}</div>`;
    } else {
      const mon = monday(f.anchor), days = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
      rangeTitle = `${days[0].toLocaleDateString(locale(), { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" })}`;
      const H0 = 7, H1 = 19, PX = 52;
      const hours = [...Array(H1 - H0 + 1)].map((_, i) => H0 + i);
      const nowD = new Date(), nowTop = (nowD.getHours() + nowD.getMinutes() / 60 - H0) * PX;
      body = `<div class="week" style="--px:${PX}px">
        <div class="wk-head"><div></div>${days.map((d) => { const iso = isoOf(d); return `<div class="wd${iso === td ? " now" : ""}" data-day="${iso}">${esc(d.toLocaleDateString(locale(), { weekday: "short" }))} <b>${d.getDate()}</b></div>`; }).join("")}</div>
        <div class="wk-allday"><div class="muted">∑</div>${days.map((d) => `<div>${evs.filter((e) => e.date === isoOf(d) && !e.time).map(evPill).join("")}</div>`).join("")}</div>
        <div class="wk-body"><div class="hours">${hours.map((h) => `<div>${String(h).padStart(2, "0")}:00</div>`).join("")}</div>
          ${days.map((d) => { const iso = isoOf(d); return `<div class="wk-col${iso === td ? " now" : ""}" style="height:${(H1 - H0 + 1) * PX}px">
            ${iso === td && nowTop > 0 && nowTop < (H1 - H0 + 1) * PX ? `<div class="now-line" style="top:${nowTop}px"></div>` : ""}
            ${evs.filter((e) => e.date === iso && e.time).map((e) => { const [h, m] = e.time.split(":").map(Number); const top = Math.max(0, (h + m / 60 - H0) * PX);
              return `<button class="wk-ev" style="top:${top}px;--c:${EV_C[e.type]}" data-open="${e.open}"><b>${esc(e.title)}</b><small>${esc(e.time)}${e.sub ? " · " + esc(e.sub) : ""}</small></button>`; }).join("")}</div>`; }).join("")}</div></div>`;
    }
    const tab = (k) => `<button class="${f.view === k ? "on" : ""}" data-sview="${k}">${esc(t("v_" + k))}</button>`;
    return head(fdate(td, { weekday: "long", day: "numeric", month: "long" }) + " · " + todayLeft + " " + t("today").toLowerCase(), t("schedule"), t("sch_sub"),
        newBtn("calls", "new_call", { status: "planned", at: td + " 10:00" })) + `
      <div class="tabs">${tab("week")}${tab("month")}${tab("agenda")}</div>
      <div class="chips"><button class="chip-btn${!f.who ? " on" : ""}" data-swho="">${esc(t("everyone"))}</button>${owners.map((o) => `<button class="chip-btn${f.who == o ? " on" : ""}" data-swho="${o}">${ava(personName(o))} ${esc(personName(o))}</button>`).join("")}</div>
      <div class="panel"><div class="sch-head"><div><h3>${esc(rangeTitle)}</h3><div class="legend">${legend}</div></div>
        ${f.view !== "agenda" ? `<div class="sch-nav"><button class="icon-btn" data-snav="-1" title="${esc(t("prev"))}">‹</button><button class="btn small" data-snav="0">${esc(t("today_btn"))}</button><button class="icon-btn" data-snav="1" title="${esc(t("next_m"))}">›</button></div>` : ""}</div>${body}</div>`;
  };

  /* ================= today ================= */
  PAGES.today = () => {
    const D = S.data, td = today();
    const calls = D.calls.filter((c) => c.at && c.at.slice(0, 10) === td && ["planned", "done", "missed"].includes(c.status)).sort((a, b) => a.at.localeCompare(b.at));
    const tasks = D.tasks.filter((x) => !["done", "confirmed"].includes(x.status) && (x.prio === "urgent" || (x.deadline && x.deadline <= td)));
    const tcases = openCases().filter((c) => c.priority === "high" || (c.due && c.due <= td));
    const reqs = D.calls.filter((c) => c.status === "requested");
    const steps = D.projects.filter((p) => ["active", "review"].includes(p.status)).map((p) => ({ p, s: progressOf(p.id).cur })).filter((x) => x.s);
    const contracts = D.vendors.filter((v) => v.contract_end && daysBetween(td, v.contract_end) >= 0 && daysBetween(td, v.contract_end) <= 30);
    const due = D.contacts.filter((c) => c.last_contact).sort((a, b) => a.last_contact.localeCompare(b.last_contact)).slice(0, 5);
    const ce = can("calls", "edit"), te = can("tasks", "edit"), pe = can("projects", "edit");
    const panel = (i, title, n, inner) => `<div class="panel reveal" style="--i:${i}"><div class="panel-head"><h3>${esc(title)}</h3><span class="badge">${n}</span></div><div class="rows">${inner || `<div class="empty">${esc(t("nothing"))}</div>`}</div></div>`;
    return head(fdate(td, { weekday: "long", day: "numeric", month: "long" }), t("today_page"), t("welcome", { name: D.me.name }) + " " + t("td_sub")) + `
      <div class="grid halves">
        ${panel(0, t("calls_today"), calls.length, calls.map((c) => `<div class="row-item"><span class="badge ${c.status === "done" ? "green" : c.status === "missed" ? "red" : "blue"}">${esc(ftime(c.at))}</span><div class="main click" data-open="calls:${c.id}"><b>${esc(c.topic)}</b><small>${esc((byId("customers", c.customer_id) || {}).name || "")}</small></div>
          ${ce && c.status === "planned" ? `<button class="btn small" data-call="${c.id}:done">${esc(opt("done"))}</button><button class="btn small" data-call="${c.id}:missed">${esc(opt("missed"))}</button>` : `<span class="muted">${esc(opt(c.status))}</span>`}</div>`).join(""))}
        ${panel(1, t("tasks_due"), tasks.length, tasks.map((x) => `<div class="row-item"><span class="dot ${x.prio}"></span><div class="main click" data-open="tasks:${x.id}"><b>${esc(x.title)}</b><small>${x.deadline ? esc(fdate(x.deadline)) + (x.deadline < td ? " · " + esc(t("late")) : "") : esc(opt(x.prio))}${x.owner_id ? " · " + esc(personName(x.owner_id)) : ""}</small></div>${te ? `<button class="btn small" data-tstat="${x.id}:done">${esc(t("mark_done"))}</button>` : ""}</div>`).join(""))}
        ${panel(6, t("open_cases_list"), tcases.length, tcases.map((c) => `<div class="row-item click" data-open="cases:${c.id}"><span class="badge ${PRIO_C[c.priority]}">${esc(opt(c.priority))}</span><div class="main"><b>${esc(c.title)}</b><small>${esc(opt(c.kind))}${c.due ? " · " + esc(t("due")) + " " + esc(fdate(c.due, { day: "numeric", month: "short" })) : ""}${c.owner_id ? " · " + esc(personName(c.owner_id)) : ""}</small></div><span class="badge ${CST_C[c.status]}">${esc(opt(c.status))}</span></div>`).join(""))}
        ${panel(2, t("requests"), reqs.length, reqs.map((c) => `<div class="row-item"><div class="ico-box">${ICON.inbox}</div><div class="main"><b>${esc(c.topic)}</b><small>${esc(c.req_name)} · ${esc(c.req_org || "")}</small></div>${ce ? `<button class="btn small primary" data-call="${c.id}:planned">${esc(t("accept"))}</button>` : ""}</div>`).join(""))}
        ${panel(3, t("steps_next"), steps.length, steps.map(({ p, s }) => `<div class="row-item"><label class="tick"><input type="checkbox" data-step="${s.id}"${pe ? "" : " disabled"}></label><div class="main click" data-open="projects:${p.id}"><b>${esc(s.title)}</b><small>${esc(p.title)} · ${progressOf(p.id).pct}%</small></div>${s.owner_id ? ava(personName(s.owner_id)) : ""}</div>`).join(""))}
        ${panel(4, t("contracts_soon"), contracts.length, contracts.map((v) => `<div class="row-item click" data-open="vendors:${v.id}"><div class="ico-box">${ICON.truck}</div><div class="main"><b>${esc(v.name)}</b><small>${esc(fdate(v.contract_end))}</small></div><span class="badge ${daysBetween(td, v.contract_end) <= 14 ? "red" : "amber"}">${esc(t("ends_in", { n: daysBetween(td, v.contract_end) }))}</span></div>`).join(""))}
        ${panel(5, t("due_call"), due.length, due.map((c) => `<div class="row-item click" data-open="contacts:${c.id}">${ava(c.name)}<div class="main"><b>${esc(c.name)}</b><small>${daysBetween(c.last_contact, td)} d · ${esc(orgName(c.org_kind, c.org_id) || "")}</small></div><span class="ico-box">${ICON.phone}</span></div>`).join(""))}
      </div>`;
  };

  /* ================= email ================= */
  const TEMPLATES = {
    followup: ["Follow-up on our call", "Hello {name},\n\nthank you for the call today. As agreed, here is a short summary:\n\n- \n\nKind regards,\n{me}"],
    renewal: ["Contract renewal", "Hello {name},\n\nour contract ends soon. Could we talk about the renewal and the terms for next year?\n\nKind regards,\n{me}"],
    confirm: ["Confirmation of our call", "Hello {name},\n\nthis confirms our call on [date and time]. Please let me know if the time does not suit you.\n\nKind regards,\n{me}"],
    thanks: ["Thank you", "Hello {name},\n\nthank you for your help. We appreciate working with you.\n\nKind regards,\n{me}"],
  };
  function recipients() {
    const D = S.data, out = [];
    D.roles.forEach((r) => { const ppl = D.people.filter((p) => p.role_id === r.id && p.email && p.active !== 0); if (ppl.length) out.push({ key: "role:" + r.id, label: `${t("role")}: ${r.name} (${ppl.length})`, emails: ppl.map((p) => p.email), name: "all" }); });
    D.people.filter((p) => p.email && p.active !== 0).forEach((p) => out.push({ key: "person:" + p.id, label: `${p.name} · ${p.job || t("workers")}`, emails: [p.email], name: p.name.split(" ")[0] }));
    D.contacts.filter((c) => c.email).forEach((c) => out.push({ key: "contact:" + c.id, label: `${c.name} · ${orgName(c.org_kind, c.org_id) || ""}`, emails: [c.email], name: c.name.split(" ")[0], contact: c }));
    return out;
  }
  PAGES.email = () => {
    const D = S.data, f = S.f.email || (S.f.email = { to: "", q: "" }), ed = can("email", "edit");
    const rec = recipients();
    const log = D.emails.filter((m) => !f.q || (m.subject + " " + m.to_email + " " + m.body).toLowerCase().includes(f.q.toLowerCase()));
    const groups = [["role", t("roles")], ["person", t("workers")], ["contact", t("contacts")]];
    return head(S.data.farm.name, t("email"), t("em_sub")) + `
      <div class="grid two">
        <div class="panel"><div class="panel-head"><h3>${esc(t("compose"))}</h3></div>
          <form class="form" id="mail-form">
            <label class="full">${esc(t("to"))}<select name="to"><option value="">–</option>${groups.map(([g, gl]) => `<optgroup label="${esc(gl)}">${rec.filter((r) => r.key.startsWith(g + ":")).map((r) => `<option value="${esc(r.key)}"${f.to === r.key ? " selected" : ""}>${esc(r.label)}</option>`).join("")}</optgroup>`).join("")}</select></label>
            <label class="full">${esc(t("or_email"))}<input name="free" type="email" maxlength="200" placeholder="name@example.com"></label>
            <label>${esc(t("template"))}<select name="tpl"><option value="">${esc(t("tpl_none"))}</option>${Object.keys(TEMPLATES).map((k) => `<option value="${k}">${esc(t("tpl_" + k))}</option>`).join("")}</select></label>
            <label>${esc(t("subject"))}<input name="subject" maxlength="300" required></label>
            <label class="full">${esc(t("message"))}<textarea name="body" maxlength="4000" style="min-height:200px"></textarea></label>
          </form>
          ${ed ? `<div class="form-actions"><button class="btn primary" data-mail="app">${esc(t("send_app"))}</button><button class="btn" data-mail="log">${esc(t("log_only"))}</button><span class="err" id="mail-err"></span></div>` : ""}</div>
        <div class="panel"><div class="panel-head"><h3>${esc(t("sent_log"))}</h3><span class="badge">${D.emails.length}</span></div>
          <label class="search" style="max-width:none;margin-bottom:8px">${ICON.search}<input data-q="email" value="${esc(f.q)}" placeholder="${esc(t("search"))}"></label>
          <div class="rows">${log.map((m) => `<div class="row-item">${ava(m.sent_by)}<div class="main"><b>${esc(m.subject)}</b>${sampleTag(m)}<small>${esc(m.to_email)} · ${esc(fdate(m.at, { day: "numeric", month: "short" }))} ${esc(ftime(m.at))}</small></div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`}</div></div>
      </div>`;
  };

  /* ================= notifications, search, export ================= */
  function notifications() {
    const D = S.data, td = today(), out = [];
    const reqs = D.calls.filter((c) => c.status === "requested").length;
    const overdue = D.tasks.filter((x) => x.deadline && x.deadline < td && !["done", "confirmed"].includes(x.status)).length;
    const contracts = D.vendors.filter((v) => v.contract_end && daysBetween(td, v.contract_end) >= 0 && daysBetween(td, v.contract_end) <= 30).length;
    const prj = D.projects.filter((p) => p.due && p.status !== "done" && daysBetween(td, p.due) <= 7).length;
    const missed = D.calls.filter((c) => c.status === "missed" && c.at && daysBetween(c.at.slice(0, 10), td) <= 7).length;
    if (reqs) out.push([ICON.inbox, t("n_requests", { n: reqs }), "calls"]);
    if (overdue) out.push([ICON.task, t("n_overdue", { n: overdue }), "today"]);
    if (contracts) out.push([ICON.truck, t("n_contracts", { n: contracts }), "today"]);
    if (prj) out.push([ICON.task, t("n_projects", { n: prj }), "projects"]);
    if (missed) out.push([ICON.phone, t("n_missed", { n: missed }), "calls"]);
    const hc = openCases().filter((c) => c.priority === "high").length;
    const dx = (D.documents || []).filter((d) => ["expiring", "expired"].includes(docState(d))).length;
    if (hc) out.unshift([ICON.alert, t("n_cases", { n: hc }), "cases"]);
    if (dx) out.push([ICON.doc, t("n_docs", { n: dx }), "documents"]);
    return out;
  }
  function openSearch() {
    $("#layer").innerHTML = `<div class="scrim" data-close></div><div class="palette" role="dialog" aria-modal="true"><label class="search" style="max-width:none">${ICON.search}<input id="pal-q" placeholder="${esc(t("search_all"))}" autocomplete="off"></label><div class="rows" id="pal-res"></div></div>`;
    $("#pal-q").focus(); searchFill("");
  }
  function searchFill(q) {
    const D = S.data, lq = q.toLowerCase(), res = [];
    const add = (ent, list, fld, sub, icon) => list.forEach((x) => { if (!lq || String(x[fld]).toLowerCase().includes(lq)) res.push({ open: `${ent}:${x.id}`, title: x[fld], sub: sub(x), icon }); });
    add("customers", D.customers, "name", (x) => opt(x.type), ICON.users); add("vendors", D.vendors, "name", (x) => opt(x.type), ICON.truck);
    add("contacts", D.contacts, "name", (x) => orgName(x.org_kind, x.org_id) || "", ICON.users); add("deals", D.deals, "title", (x) => opt(x.stage), ICON.euro);
    add("projects", D.projects, "title", (x) => opt(x.status), ICON.task); add("tasks", D.tasks, "title", (x) => opt(x.prio), ICON.task);
    add("people", D.people, "name", (x) => x.job || "", ICON.users);
    add("cases", D.cases || [], "title", (x) => opt(x.kind) + " · " + opt(x.status), ICON.alert);
    add("documents", D.documents || [], "title", (x) => opt(x.kind), ICON.doc);
    $("#pal-res").innerHTML = res.slice(0, 12).map((r) => `<div class="row-item click" data-open="${r.open}" data-palette><div class="ico-box">${r.icon}</div><div class="main"><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></div></div>`).join("") || `<div class="empty">${esc(t("none_here"))}</div>`;
  }
  function exportCSV(entity) {
    const rowsOf = S.data[entity] || [], f = S.f[entity] || {};
    const typeField = entity === "contacts" ? "org_kind" : "type";
    const list = rowsOf.filter((x) => (!f.type || x[typeField] === f.type) && (!f.fav || x.favourite) && (!f.q || JSON.stringify(x).toLowerCase().includes(f.q.toLowerCase())));
    const cols = { customers: ["name", "type", "status", "city", "country", "volume_eur", "last_booking", "notes"], vendors: ["name", "type", "status", "contract_start", "contract_end", "volume_eur", "notes"],
      contacts: ["name", "title", "phone", "email", "language", "last_contact"] }[entity];
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [cols.concat(entity === "contacts" ? ["organisation"] : []).join(";")].concat(list.map((x) => cols.map((c) => q(x[c])).concat(entity === "contacts" ? [q(orgName(x.org_kind, x.org_id))] : []).join(";")));
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv" })); a.download = `${entity}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ================= render ================= */
  /* Sidebar: page groups. [route, permission module, icon] */
  const NAV_GROUPS = [
    ["grp_main", [["overview", "overview", "grid"], ["today", "overview", "sun"], ["schedule", "calls", "calendar"]]],
    ["grp_production", [["workers", "people", "users"], ["projects", "projects", "layers"], ["tasks", "tasks", "task"], ["cases", "cases", "alert"], ["documents", "documents", "doc"]]],
    ["grp_partners", [["customers", "customers", "euro"], ["vendors", "vendors", "truck"], ["contacts", "contacts", "users"], ["calls", "calls", "phone"], ["pipeline", "pipeline", "chart"]]],
    ["grp_insights", [["reports", "reports", "chart"], ["email", "email", "mail"]]],
    ["grp_settings", [["roles", "roles", "shield"], ["admin", "admin", "gear"]]],
  ];
  const NAV = NAV_GROUPS.flatMap(([, items]) => items);
  const PERM_OF = { overview: "overview", customers: "customers", vendors: "vendors", contacts: "contacts", pipeline: "pipeline", calls: "calls", schedule: "calls", projects: "projects",
    tasks: "tasks", workers: "people", reports: "reports", roles: "roles", admin: "admin", today: "overview", email: "email", cases: "cases", documents: "documents" };
  const TOP_BUTTONS = ["search", "new", "today", "email", "booklink", "bell", "lang", "theme"];
  const ui = () => S.data.ui || { hidden_pages: ["pipeline"], hidden_buttons: [] };
  // Admin can hide pages for everyone; Overview and Admin always stay so nobody locks themselves out
  const pageVisible = (r) => r === "overview" || r === "admin" || !ui().hidden_pages.includes(r);
  const buttonVisible = (b) => !ui().hidden_buttons.includes(b);
  const pageLabel = (r) => t(r === "today" ? "today_page" : r);

  function render() {
    const D = S.data;
    document.documentElement.lang = lang;
    $("#farm-name").textContent = D.farm.name;
    const reqs = D.calls.filter((c) => c.status === "requested").length;
    const badge = { calls: reqs, cases: openCases().filter((c) => c.priority === "high").length };
    $("#nav").innerHTML = NAV_GROUPS.map(([g, items]) => {
      const vis = items.filter(([r, m]) => can(m) && pageVisible(r));
      return vis.length ? `<div class="nav-group"><div class="nav-h">${esc(t(g))}</div>${vis.map(([r, , ic]) => `<a href="#/${r}" class="${S.route === r ? "on" : ""}" title="${esc(pageLabel(r))}"><span class="ni">${ICON[ic]}</span><span class="nl">${esc(pageLabel(r))}</span>${badge[r] ? `<span class="count">${badge[r]}</span>` : ""}</a>`).join("")}</div>` : "";
    }).join("");
    const grp = NAV_GROUPS.find(([, items]) => items.some(([r]) => r === S.route));
    $("#crumb").innerHTML = `${grp ? `<span class="muted">${esc(t(grp[0]))} /</span> ` : ""}<b>${esc(pageLabel(S.route))}</b>`;
    TOP_BUTTONS.forEach((b) => $$(`[data-tb="${b}"]`).forEach((el) => { el.hidden = !buttonVisible(b) || (b === "email" && (!can("email") || !pageVisible("email"))) || (b === "today" && !pageVisible("today")); }));
    const nn = notifications().length;
    $("#bell").innerHTML = `${ICON.bell}${nn ? `<span class="dot-n">${nn}</span>` : ""}`;
    $("#me").textContent = initials(D.me.name);
    $("#lang").innerHTML = Object.entries(LANG.languages).map(([c, L]) => `<option value="${c}"${c === lang ? " selected" : ""}>${esc(L.name)}</option>`).join("");
    $("#pin").title = t(document.body.classList.contains("side-pinned") ? "unpin" : "pin");
    const sl = $(".tb-search span"); if (sl) sl.textContent = t("search");
    const pl = $("#pin .nl"); if (pl) pl.textContent = t(document.body.classList.contains("side-pinned") ? "unpin" : "pin");
    const perm = PERM_OF[S.route];
    const page = PAGES[S.route];
    const html = !page || !can(perm) || !pageVisible(S.route) ? `<p class="muted">${esc(t("no_access"))}</p>` : page();
    $("#view").innerHTML = `<div class="page">${html}</div>`;
    countUp($("#view"));
    if (page && page.after && can(perm)) page.after();
  }

  function route() {
    const r = (location.hash.replace(/^#\/?/, "") || "").split("/")[0];
    const first = NAV.find(([x, m]) => can(m) && pageVisible(x)) || ["admin"];
    S.route = PAGES[r] && can(PERM_OF[r]) && pageVisible(r) ? r : first[0];
    render();
  }

  async function reload(keepRoute = true) {
    S.data = await api("GET", "/api/bootstrap");
    LANG = buildLang(S.data.lang);
    if (!LANG.languages[lang]) lang = LANG.default;
    if (keepRoute) render();
  }

  /* ================= events ================= */
  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-close],[data-open],[data-new],[data-go],[data-act],[data-chip],[data-fav],[data-star],[data-due],[data-owner],[data-tab],[data-call],[data-level],[data-tile],[data-tstat],[data-save],[data-del],[data-saverole],[data-newrole],[data-savefarm],[data-rmsample],[data-addlang],[data-savelang],[data-pstatus],[data-stepdel],[data-stepadd],[data-updadd],[data-sview],[data-snav],[data-swho],[data-day],[data-mail],[data-export],[data-writemail],[data-cstatus],[data-dkind],[data-dstate],[data-akind],#me,#bell,#theme,#pin,a[data-logout]");
    if (!el) { if (!e.target.closest(".menu")) $$(".menu").forEach((m) => m.remove()); return; }
    if (e.target.closest("input[type=checkbox][data-step]")) return;   // handled on change
    if (e.target.closest("a[data-stop]")) return;                      // plain links inside clickable rows
    const d = el.dataset;
    try {
      if ("close" in d) return closeDrawer();
      if ("cstatus" in d) { S.f.cases.status = d.cstatus; return render(); }
      if ("dkind" in d) { S.f.documents.kind = d.dkind; return render(); }
      if ("dstate" in d) { S.f.documents.state = S.f.documents.state === d.dstate ? "" : d.dstate; return render(); }
      if ("akind" in d) { S.f.calls.kind = d.akind; return render(); }
      if (el.id === "pin") { const on = !document.body.classList.contains("side-pinned"); document.body.classList.toggle("side-pinned", on); store.set("pinned", on); return render(); }
      if ("pstatus" in d) { S.f.projects.status = d.pstatus; return render(); }
      if (d.stepdel) { await api("DELETE", `/api/project_steps/${d.stepdel}`); return refreshDrawer(); }
      if (d.stepadd) {
        const title = $("#new-step").value.trim(); if (!title) return $("#new-step").focus();
        const owner = $("#new-step-owner").value;
        await api("POST", "/api/project_steps", { project_id: Number(d.stepadd), title, position: stepsOf(Number(d.stepadd)).length, owner_id: owner ? Number(owner) : null });
        return refreshDrawer();
      }
      if (d.updadd) {
        const note = $("#new-update").value.trim(); if (!note) return $("#new-update").focus();
        await api("POST", "/api/project_updates", { project_id: Number(d.updadd), note }); toast(t("saved")); return refreshDrawer();
      }
      if (d.sview) { S.f.schedule.view = d.sview; return render(); }
      if (d.snav) {
        const f = S.f.schedule, n = Number(d.snav);
        if (!n) f.anchor = today();
        else { const a = new Date(f.anchor + "T12:00:00"); f.view === "month" ? a.setMonth(a.getMonth() + n) : a.setDate(a.getDate() + 7 * n); f.anchor = isoOf(a); }
        return render();
      }
      if ("swho" in d) { S.f.schedule.who = d.swho; return render(); }
      if (d.day && !e.target.closest("[data-open]")) { S.f.schedule.view = "week"; S.f.schedule.anchor = d.day; return render(); }
      if (d.export) return exportCSV(d.export);
      if (d.writemail) { S.f.email = Object.assign(S.f.email || { q: "" }, { to: d.writemail }); closeDrawer(); location.hash = "#/email"; return render(); }
      if (d.mail) {
        const form = $("#mail-form"), err = $("#mail-err"); err.textContent = "";
        const r = recipients().find((x) => x.key === form.elements.to.value), free = form.elements.free.value.trim();
        const emails = free ? [free] : r ? r.emails : [];
        if (!emails.length) { err.textContent = t("to") + "?"; return; }
        if (!form.reportValidity()) return;
        const subject = form.elements.subject.value.trim(), body = form.elements.body.value;
        if (d.mail === "app") { const a = document.createElement("a"); a.href = `mailto:${emails.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; document.body.appendChild(a); a.click(); a.remove(); }
        await api("POST", "/api/emails", { to_email: emails.join(", ").slice(0, 300), subject, body,
          contact_id: r && r.contact ? r.contact.id : null, customer_id: r && r.contact && r.contact.org_kind === "customer" ? r.contact.org_id : null });
        S.f.email.to = ""; toast(t("email_logged")); return reload();
      }
      if (el.id === "bell") {
        if ($(".menu.notif")) return $(".menu.notif").remove();
        $$(".menu").forEach((m) => m.remove());
        const m = document.createElement("div"); m.className = "menu notif"; const list = notifications();
        m.innerHTML = `<div class="who"><b>${esc(t("notif"))}</b></div>` + (list.map(([ic, txt, go]) => `<a href="#/${go}">${ic} ${esc(txt)}</a>`).join("") || `<div class="empty" style="padding:10px">${esc(t("notif_none"))}</div>`);
        $(".topbar").appendChild(m); return;
      }
      if (d.open && !e.target.closest("[data-star],button[data-tstat],button[data-call]")) {
        if (e.target.closest("summary")) return;
        const [ent, id] = d.open.split(":"); const rec = byId(ent, Number(id)); if (rec) openForm(ent, rec); return;
      }
      if (d.new) { e.preventDefault(); return openForm(d.new, null, d.preset ? JSON.parse(d.preset) : {}); }
      if (d.go) { location.hash = "#/" + d.go; return; }
      if (d.act === "search") return openSearch();
      if (d.act === "new") { const ent = { customers: "customers", vendors: "vendors", contacts: "contacts", pipeline: "deals", calls: "calls", schedule: "calls", workers: "people", projects: "projects", cases: "cases", documents: "documents" }[S.route] || "tasks";
        return openForm(ent, null, ent === "cases" ? { status: "open", priority: "medium", opened: today() } : ent === "calls" ? { status: "planned", kind: "visit" } : {}); }
      if (d.act === "booklink") { const url = new URL("book.html", location.href).href; try { await navigator.clipboard.writeText(url); toast(t("link_copied") + " " + url); } catch (x) { toast(url); } return; }
      if (d.chip) { S.f[d.chip].type = d.v; return render(); }
      if (d.fav) { S.f[d.fav].fav = !S.f[d.fav].fav; return render(); }
      if ("due" in d) { S.f.contacts.due = !S.f.contacts.due; return render(); }
      if (d.star) { const [ent, id] = d.star.split(":"); const rec = byId(ent, Number(id)); if (!can(MODULE_OF[ent], "edit")) return; await api("PATCH", `/api/${ent}/${id}`, { favourite: rec.favourite ? 0 : 1 }); rec.favourite = rec.favourite ? 0 : 1; return render(); }
      if ("owner" in d && el.classList.contains("chip-btn")) { S.f.pipeline.owner = d.owner; return render(); }
      if (d.tab) { S.f.calls.tab = d.tab; return render(); }
      if (d.call) { const [id, st] = d.call.split(":"); await api("PATCH", `/api/calls/${id}`, { status: st }); toast(t("saved")); return reload(); }
      if ("level" in d && el.closest(".pyr")) { S.f.tasks.level = d.level ? (S.f.tasks.level === d.level ? null : d.level) : null; return render(); }
      if (d.tile) { const tl = S.f.tasks.tiles; const i = tl.indexOf(d.tile); i < 0 ? tl.push(d.tile) : tl.splice(i, 1); return render(); }
      if (d.tstat) { const [id, st] = d.tstat.split(":"); await api("PATCH", `/api/tasks/${id}`, { status: st, ...(st === "done" || st === "confirmed" ? { done_on: today() } : {}), ...(st === "reported" ? { reported: today() } : {}) }); toast(t("saved")); return reload(); }
      if ("save" in d) {
        const form = $("#edit-form"), ent = form.dataset.entity, id = form.dataset.id;
        if (!form.reportValidity()) return;
        const body = collect(ent, form);
        await api(id ? "PATCH" : "POST", id ? `/api/${ent}/${id}` : `/api/${ent}`, body);
        closeDrawer(); toast(t("saved")); return reload();
      }
      if ("del" in d) {
        const form = $("#edit-form"), ent = form.dataset.entity, id = form.dataset.id, rec = byId(ent, Number(id));
        if (!confirm(t("confirm_delete", { name: rec.name || rec.title || rec.topic }))) return;
        await api("DELETE", `/api/${ent}/${id}`); closeDrawer(); toast(t("deleted")); return reload();
      }
      if (d.saverole) {
        const tr = el.closest("tr"), perms = {}; $$("select[data-perm]", tr).forEach((s) => (perms[s.dataset.perm] = s.value));
        await api("PATCH", `/api/roles/${d.saverole}`, { perms }); toast(t("saved")); return reload();
      }
      if ("newrole" in d) { const name = prompt(t("new_role")); if (!name) return; await api("POST", "/api/roles", { name }); return reload(); }
      if ("savefarm" in d) { await api("POST", "/api/settings/farm", { name: $("#farm-form").elements.name.value }); toast(t("saved")); return reload(); }
      if ("rmsample" in d) { if (!confirm(t("remove_confirm"))) return; const r = await api("POST", "/api/admin/remove-sample", {}); toast(t("deleted") + " " + r.removed); return reload(); }
      if ("addlang" in d) {
        const code = $("[data-newcode]").value.trim().toLowerCase(), name = $("[data-newname]").value.trim();
        if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(code) || S.f.admin.pack.languages[code]) return toast(t("lang_code"), true);
        S.f.admin.pack.languages[code] = { name: name || code, locale: code, strings: {} }; S.f.admin.edit = code; return render();
      }
      if ("savelang" in d) { await api("POST", "/api/settings/lang", S.f.admin.pack); S.f.admin.pack = null; toast(t("saved")); return reload(); }
      if (el.id === "me") {
        if ($(".menu")) return $(".menu").remove();
        const m = document.createElement("div"); m.className = "menu";
        m.innerHTML = `<div class="who"><b>${esc(S.data.me.name)}</b><br><small class="muted">${esc(S.data.me.role)}</small></div>
          ${can("roles") ? `<a href="#/roles">${esc(t("roles"))}</a>` : ""}${can("admin") ? `<a href="#/admin">${esc(t("admin"))}</a>` : ""}<a href="#" data-logout>${esc(t("logout"))}</a>`;
        $(".topbar").appendChild(m); return;
      }
      if (el.matches("a[data-logout]")) { e.preventDefault(); await api("POST", "/api/logout", {}); location.href = "login.html"; return; }
      if (el.id === "theme") return switchTheme();
    } catch (err) {
      const fe = $("#form-err"); if (fe) fe.textContent = err.message; toast(err.message, true);
    }
  });

  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "pal-q") return searchFill(el.value);
    if (el.dataset.q) { S.f[el.dataset.q].q = el.value; const pos = el.selectionStart; render(); const n = $(`[data-q="${el.dataset.q}"]`); n.focus(); n.setSelectionRange(pos, pos); }
    if ("tq" in el.dataset) { S.f.tasks.q = el.value; const pos = el.selectionStart; render(); const n = $("[data-tq]"); n.focus(); n.setSelectionRange(pos, pos); }
    if (el.dataset.lkey) { const f = S.f.admin; f.pack.languages[f.edit].strings[el.dataset.lkey] = el.value; }
  });
  document.addEventListener("change", async (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.step) {
      try { await api("PATCH", `/api/project_steps/${el.dataset.step}`, { done: el.checked ? 1 : 0 }); toast(t("saved")); await refreshDrawer(); }
      catch (err) { el.checked = !el.checked; toast(err.message, true); }
      return;
    }
    if (el.closest && el.closest("#mail-form")) {
      const form = $("#mail-form");
      if (el.name === "to") S.f.email.to = el.value;
      if (el.name === "tpl" && TEMPLATES[el.value]) {
        const r = recipients().find((x) => x.key === form.elements.to.value);
        const [subj, body] = TEMPLATES[el.value];
        form.elements.subject.value = subj;
        form.elements.body.value = body.replace("{name}", r ? r.name : "").replace("{me}", S.data.me.name + "\n" + S.data.farm.name);
      }
      return;
    }
    if (el.id === "lang") { lang = el.value; store.set("lang", lang); return render(); }
    if ("towner" in el.dataset) { S.f.tasks.owner = el.value; return render(); }
    if ("ckind" in el.dataset) { S.f.cases.kind = el.value; return render(); }
    if (el.dataset && el.dataset.pb) {
      const cur = ui(), [kind, key] = el.dataset.pb.split(":"), field = kind === "page" ? "hidden_pages" : "hidden_buttons";
      const next = { hidden_pages: cur.hidden_pages.slice(), hidden_buttons: cur.hidden_buttons.slice() };
      next[field] = el.checked ? next[field].filter((x) => x !== key) : next[field].concat([key]);
      try { S.data.ui = await api("POST", "/api/settings/ui", next); toast(t("saved")); render(); } catch (err) { el.checked = !el.checked; toast(err.message, true); }
      return;
    }
    if ("adefault" in el.dataset) { S.f.admin.pack.default = el.value; return; }
    if ("aedit" in el.dataset) { S.f.admin.edit = el.value; return render(); }
    if ("amissing" in el.dataset) { S.f.admin.missing = el.checked; return render(); }
    if (el.dataset.import) {
      const file = el.files[0]; if (!file) return;
      const rows = parseCSV(await file.text());
      try { const r = await api("POST", `/api/import/${el.dataset.import}`, { rows }); toast(t("imported", { n: r.added })); await reload(); }
      catch (err) { toast(err.message, true); }
    }
  });
  document.addEventListener("toggle", (e) => {
    const g = e.target; if (!g.dataset || !g.dataset.g) return;
    const s = S.f.taskGroups; g.open ? s.add(g.dataset.g) : s.delete(g.dataset.g);
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeDrawer(); $$(".menu").forEach((m) => m.remove()); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && S.data) { e.preventDefault(); openSearch(); }
    if (e.key === "Enter" && e.target.id === "pal-q") { const first = $("#pal-res [data-open]"); if (first) first.click(); }
  });

  // pipeline drag and drop
  document.addEventListener("dragstart", (e) => { const c = e.target.closest && e.target.closest(".deal"); if (!c) return; e.dataTransfer.setData("text/plain", c.dataset.deal); c.classList.add("dragging"); });
  document.addEventListener("dragend", (e) => { const c = e.target.closest && e.target.closest(".deal"); if (c) c.classList.remove("dragging"); $$(".col.drop").forEach((x) => x.classList.remove("drop")); });
  document.addEventListener("dragover", (e) => { const col = e.target.closest && e.target.closest(".col"); if (!col) return; e.preventDefault(); $$(".col.drop").forEach((x) => x !== col && x.classList.remove("drop")); col.classList.add("drop"); });
  document.addEventListener("drop", async (e) => {
    const col = e.target.closest && e.target.closest(".col"); if (!col) return; e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain")), deal = byId("deals", id); if (!deal || deal.stage === col.dataset.stage) return render();
    try { await api("PATCH", `/api/deals/${id}`, { stage: col.dataset.stage }); deal.stage = col.dataset.stage; toast(t("saved")); render(); } catch (err) { toast(err.message, true); render(); }
  });

  /* Theme switch: the new theme washes down the page behind a moving wave edge (own code, View Transitions API). */
  function wavePolygon(edgeY, phase, amp, W, H) {
    const pts = ["0px 0px", `${W}px 0px`];
    const n = 28;
    for (let i = n; i >= 0; i--) {
      const x = (W * i) / n;
      const y = edgeY + amp * Math.sin((x / W) * Math.PI * 3 + phase) + amp * 0.35 * Math.sin((x / W) * Math.PI * 7 - phase * 1.6);
      pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
    }
    return `polygon(${pts.join(", ")})`;
  }
  function switchTheme() {
    const root = document.documentElement, next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => { root.dataset.theme = next; try { localStorage.setItem("kw2:theme", next); } catch (e) { /* blocked */ } };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      const W = innerWidth, H = innerHeight, amp = Math.max(18, H * 0.035), steps = 9, frames = [];
      for (let s = 0; s <= steps; s++) {
        const p = s / steps, eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        frames.push({ clipPath: wavePolygon(-amp * 2 + eased * (H + amp * 4), p * Math.PI * 2.5, amp * (1 - p * 0.4), W, H) });
      }
      root.animate(frames, { duration: 950, easing: "linear", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  }

  function parseCSV(text) {
    const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
    if (!lines.length) return [];
    const sep = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ";" : ",";
    const split = (line) => { const out = []; let cur = "", q = false; for (let i = 0; i < line.length; i++) { const ch = line[i];
      if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true; else if (ch === sep) { out.push(cur); cur = ""; } else cur += ch; } out.push(cur); return out.map((s) => s.trim()); };
    const head = split(lines[0]);
    return lines.slice(1).map((l) => { const v = split(l); const o = {}; head.forEach((h, i) => (o[h] = v[i] || "")); return o; });
  }

  // Sidebar: opens while the mouse is over it (the page moves right with it); the pin keeps it open.
  (function sidebar() {
    const side = $("#side"); if (!side) return;
    if (store.get("pinned", false)) document.body.classList.add("side-pinned");
    document.documentElement.classList.remove("pin-early");
    let timer = null;
    side.addEventListener("mouseenter", () => { clearTimeout(timer); document.body.classList.add("side-open"); });
    side.addEventListener("mouseleave", () => { timer = setTimeout(() => document.body.classList.remove("side-open"), 120); });
    side.addEventListener("focusin", () => document.body.classList.add("side-open"));
    side.addEventListener("focusout", () => document.body.classList.remove("side-open"));
  })();

  window.addEventListener("hashchange", route);

  /* ================= start ================= */
  (async () => {
    try {
      await reload(false);
      const saved = store.get("lang", ""); lang = LANG.languages[saved] ? saved : LANG.default;
      route();
    } catch (e) { if (e.message !== "login") $("#view").innerHTML = `<div class="page"><p class="muted">${esc(e.message)}</p></div>`; }
  })();
})();
