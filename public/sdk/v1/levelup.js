/*!
 * LevelUp tag v1 — https://levelup-ecosystem.com
 *
 * One line connects any website to the LevelUp Ecosystem:
 *   <script src="https://levelup-ecosystem.com/sdk/v1/levelup.js" data-site="ws_xxxxxxxxxxxxxxxx" defer></script>
 *
 * What it does (all managed from the LevelUp dashboard, no code changes):
 *   - SEO: page title, meta description, Open Graph / Twitter cards, canonical,
 *     robots and schema.org JSON-LD from the website's "seo" setting.
 *   - Content: fills elements marked with data-lu="path.in.bundle".
 *   - Forms: <form data-lu-form="contact|quote|newsletter|vip_signup|registration">
 *     are sent to the client's LevelUp inbox.
 *   - "Built by LevelUp" credit in elements marked data-lu-badge.
 *   - window.LevelUp: ready, site(), submitForm(), bookAppointment(),
 *     joinWaitlist(), waitlist(), ticketStatus().
 *
 * Security: only the public website id and the public (publishable) key are
 * used. Writes go through rate-limited database functions that only accept
 * the client's own domains. Content is inserted as text, never as HTML.
 * Options: data-seo="off" disables SEO changes, data-forms="off" disables
 * form handling.
 */
(function () {
  'use strict';
  if (window.LevelUp && window.LevelUp.version) return;

  var VERSION = '1.0.0';
  var API = 'https://rncuhmvykrmtxfzqpitc.supabase.co/rest/v1/rpc/';
  var KEY = 'sb_publishable_C6yyhI8mh1Dcgfw94mxVYg_VIIMqvBE';
  var CREDIT_URL = 'https://levelup-ecosystem.com';
  var CACHE_MS = 5 * 60 * 1000;

  var script = document.currentScript || document.querySelector('script[data-site][src*="levelup"]');
  var siteId = script && script.getAttribute('data-site');
  var seoEnabled = !script || script.getAttribute('data-seo') !== 'off';
  var formsEnabled = !script || script.getAttribute('data-forms') !== 'off';

  function warn(msg) {
    if (window.console) console.warn('[LevelUp] ' + msg);
  }

  if (!siteId || !/^ws_[a-z0-9]{8,32}$/.test(siteId)) {
    warn('missing or invalid data-site attribute');
    return;
  }

  function LevelUpError(message, code, status) {
    var e = new Error(message);
    e.name = 'LevelUpError';
    e.code = code;
    e.status = status;
    return e;
  }

  function rpc(name, args) {
    return fetch(API + name, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {}),
      credentials: 'omit',
      keepalive: name === 'tag_ping'
    }).then(function (res) {
      return res.text().then(function (text) {
        var body = text ? JSON.parse(text) : null;
        if (!res.ok) {
          var code = body && body.code;
          var message =
            code === 'PT429'
              ? 'Too many requests, please try again later.'
              : code === 'PT409'
                ? 'This time slot is no longer available.'
                : code === 'PT403'
                  ? 'This action is not available on this website.'
                  : (body && body.message) || 'Request failed';
          throw LevelUpError(message, code, res.status);
        }
        return body;
      });
    });
  }

  // ------------------------------------------------------------------ site bundle

  var cacheKey = 'levelup:bundle:' + siteId;
  function readCache() {
    try {
      var raw = sessionStorage.getItem(cacheKey);
      if (!raw) return null;
      var c = JSON.parse(raw);
      return Date.now() - c.t < CACHE_MS ? c.v : null;
    } catch (e) {
      return null;
    }
  }
  function writeCache(v) {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), v: v }));
    } catch (e) {
      /* storage unavailable */
    }
  }

  var bundlePromise = (function () {
    var cached = readCache();
    if (cached) return Promise.resolve(cached);
    return rpc('get_site_bundle', { p_website_id: siteId }).then(function (b) {
      if (!b) throw LevelUpError('Website not found or not active', 'PT404', 404);
      writeCache(b);
      return b;
    });
  })();

  // ------------------------------------------------------------------ helpers

  function get(obj, path) {
    var parts = String(path).split('.');
    for (var i = 0; i < parts.length && obj != null; i++) obj = obj[parts[i]];
    return obj;
  }

  function clean(value, max) {
    if (value == null) return '';
    return String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 500);
  }

  function safeUrl(value) {
    try {
      var u = new URL(String(value), location.href);
      return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
    } catch (e) {
      return '';
    }
  }

  function setMeta(attr, key, content) {
    if (!content) return;
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      el.setAttribute('data-levelup', '');
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setLink(rel, href) {
    if (!href) return;
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute('data-levelup', '');
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function normalizePath(p) {
    p = (p || '/').split('?')[0].split('#')[0];
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  // ------------------------------------------------------------------ SEO

  function businessJsonLd(b, seo) {
    var s = b.settings || {};
    var contact = s.contact || {};
    var phone = contact.phones && contact.phones[0] && contact.phones[0].tel;
    var data = {
      '@context': 'https://schema.org',
      '@type': clean(seo.business_type, 60) || 'LocalBusiness',
      name: clean(seo.business_name || b.name, 120),
      url: b.primary_domain ? 'https://' + b.primary_domain : location.origin
    };
    if (seo.description) data.description = clean(seo.description, 300);
    if (seo.image) data.image = safeUrl(seo.image);
    if (s.branding && s.branding.logo_url) data.logo = safeUrl(s.branding.logo_url);
    if (phone) data.telephone = clean(phone, 40);
    if (contact.address) data.address = clean(contact.address, 200);
    if (contact.coordinates && contact.coordinates.lat) {
      data.geo = {
        '@type': 'GeoCoordinates',
        latitude: Number(contact.coordinates.lat),
        longitude: Number(contact.coordinates.lng)
      };
    }
    var weekly = s.hours && s.hours.weekly;
    if (weekly) {
      var names = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
      data.openingHoursSpecification = Object.keys(names)
        .filter(function (d) { return weekly[d] && weekly[d].length === 2; })
        .map(function (d) {
          return { '@type': 'OpeningHoursSpecification', dayOfWeek: names[d], opens: weekly[d][0], closes: weekly[d][1] };
        });
    }
    var social = s.social || {};
    var sameAs = Object.keys(social).map(function (k) { return safeUrl(social[k]); }).filter(Boolean);
    if (sameAs.length) data.sameAs = sameAs;
    var reviews = b.reviews || [];
    var rated = reviews.filter(function (r) { return r.rating; });
    if (rated.length >= 3) {
      var sum = rated.reduce(function (a, r) { return a + Number(r.rating); }, 0);
      data.aggregateRating = { '@type': 'AggregateRating', ratingValue: (sum / rated.length).toFixed(1), reviewCount: rated.length };
    }
    return data;
  }

  function applySeo(b) {
    var seo = (b.settings && b.settings.seo) || null;
    if (!seo || seo.enabled === false) return;
    var page = (seo.pages && seo.pages[normalizePath(location.pathname)]) || {};
    var title = clean(page.title || seo.title, 70);
    var description = clean(page.description || seo.description, 320);
    var image = safeUrl(page.image || seo.image || '');

    if (title) document.title = title;
    setMeta('name', 'description', description);
    if (seo.keywords) setMeta('name', 'keywords', clean([].concat(seo.keywords).join(', '), 300));
    if (page.robots || seo.robots) setMeta('name', 'robots', clean(page.robots || seo.robots, 60));
    if (seo.google_site_verification) setMeta('name', 'google-site-verification', clean(seo.google_site_verification, 100));

    var canonicalBase = b.primary_domain ? 'https://' + b.primary_domain : location.origin;
    if (seo.canonical !== false) setLink('canonical', canonicalBase + normalizePath(location.pathname));

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', clean(seo.business_name || b.name, 120));
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalBase + normalizePath(location.pathname));
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    if (seo.structured_data !== false) {
      var ld = seo.structured_data && typeof seo.structured_data === 'object'
        ? seo.structured_data
        : businessJsonLd(b, seo);
      var el = document.getElementById('levelup-jsonld');
      if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.id = 'levelup-jsonld';
        document.head.appendChild(el);
      }
      // Escape "<" so stored data can never close the script element.
      el.textContent = JSON.stringify(ld).replace(/</g, '\\u003c');
    }
  }

  // ------------------------------------------------------------------ content & badge

  function applyContent(b) {
    var nodes = document.querySelectorAll('[data-lu]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = get(b, el.getAttribute('data-lu'));
      if (value == null || typeof value === 'object') continue;
      var attr = el.getAttribute('data-lu-attr');
      if (attr) {
        if (!/^(src|href|alt|title|content|placeholder|aria-label)$/.test(attr)) continue;
        var v = attr === 'src' || attr === 'href' ? safeUrl(value) : String(value);
        if (v) el.setAttribute(attr, v);
      } else {
        el.textContent = String(value);
      }
    }
  }

  function applyBadge(b) {
    var slots = document.querySelectorAll('[data-lu-badge]');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (!b.show_powered_by) {
        slot.style.display = 'none';
        continue;
      }
      if (slot.querySelector('a')) continue;
      var a = document.createElement('a');
      a.href = CREDIT_URL + '/?utm_source=' + encodeURIComponent(b.primary_domain || location.hostname) + '&utm_medium=referral&utm_campaign=built_by';
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Built by LevelUp';
      a.style.cssText = 'font:500 12px/1.4 system-ui,sans-serif;opacity:.75;color:inherit;text-decoration:none';
      slot.appendChild(a);
    }
  }

  // ------------------------------------------------------------------ forms

  var STANDARD_FIELDS = { name: 1, email: 1, phone: 1, company: 1, message: 1 };

  function submitForm(type, fields) {
    fields = fields || {};
    var data = {};
    Object.keys(fields).forEach(function (k) {
      if (!STANDARD_FIELDS[k] && k.charAt(0) !== '_' && Object.keys(data).length < 30) {
        data[clean(k, 60)] = clean(fields[k], 1000);
      }
    });
    return rpc('submit_form', {
      p_website_id: siteId,
      p_form_type: type || 'contact',
      p_name: clean(fields.name, 120) || null,
      p_email: clean(fields.email, 254) || null,
      p_phone: clean(fields.phone, 40) || null,
      p_company: clean(fields.company, 160) || null,
      p_message: clean(fields.message, 5000) || null,
      p_data: data,
      p_source: clean(location.hostname + location.pathname, 200)
    });
  }

  function bindForms() {
    if (!formsEnabled) return;
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || !form.getAttribute || !form.hasAttribute('data-lu-form')) return;
      event.preventDefault();
      // Honeypot: real visitors never fill a hidden "_hp" field.
      var hp = form.querySelector('[name="_hp"]');
      if (hp && hp.value) return;
      var fields = {};
      new FormData(form).forEach(function (v, k) {
        if (typeof v === 'string') fields[k] = v;
      });
      var status = form.querySelector('[data-lu-status]');
      var button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;
      if (status) status.textContent = form.getAttribute('data-lu-sending') || 'Sending…';
      submitForm(form.getAttribute('data-lu-form'), fields)
        .then(function (res) {
          form.reset();
          if (status) status.textContent = form.getAttribute('data-lu-success') || 'Thank you! We will get back to you soon.';
          form.dispatchEvent(new CustomEvent('levelup:success', { detail: res, bubbles: true }));
        })
        .catch(function (err) {
          if (status) status.textContent = err.message || 'Something went wrong. Please try again.';
          form.dispatchEvent(new CustomEvent('levelup:error', { detail: err, bubbles: true }));
        })
        .then(function () {
          if (button) button.disabled = false;
        });
    });
  }

  // ------------------------------------------------------------------ public API

  window.LevelUp = {
    version: VERSION,
    siteId: siteId,
    ready: bundlePromise,
    site: function () { return bundlePromise; },
    submitForm: submitForm,
    bookAppointment: function (o) {
      o = o || {};
      return rpc('book_appointment', {
        p_website_id: siteId, p_service_slug: o.service, p_date: o.date, p_time: o.time,
        p_name: o.name, p_email: o.email || null, p_phone: o.phone || null,
        p_team_member_slug: o.teamMember || null, p_notes: o.notes || null
      });
    },
    joinWaitlist: function (o) {
      o = o || {};
      return rpc('join_waitlist', {
        p_website_id: siteId, p_name: o.name, p_phone: o.phone || null, p_email: o.email || null,
        p_service_slug: o.service || null, p_team_member_slug: o.teamMember || null
      });
    },
    waitlist: function () { return rpc('get_public_waitlist', { p_website_id: siteId }); },
    ticketStatus: function (code) { return rpc('get_ticket_status', { p_website_id: siteId, p_ticket_code: code }); }
  };

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  bindForms();
  bundlePromise
    .then(function (b) {
      onReady(function () {
        if (seoEnabled) applySeo(b);
        applyContent(b);
        applyBadge(b);
        document.dispatchEvent(new CustomEvent('levelup:ready', { detail: b }));
      });
    })
    .catch(function (err) {
      warn(err.message);
    });

  // Install check for the dashboard (once per visitor session).
  try {
    if (!sessionStorage.getItem('levelup:ping:' + siteId)) {
      sessionStorage.setItem('levelup:ping:' + siteId, '1');
      rpc('tag_ping', { p_website_id: siteId, p_version: VERSION }).catch(function () {});
    }
  } catch (e) {
    /* storage unavailable */
  }
})();
