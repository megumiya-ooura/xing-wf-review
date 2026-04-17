(() => {
  const w = window;
  const d = document;

    const cfg = {
    tenant: "2008520183",
    apiBase: "https://ltag.jp",
    decorateAllowlist: [
              "xing-flower.com",
              "xing-flower.resv.jp",
          ],
  };

    const uuid = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const nowISO = () => new Date().toISOString();
  const parseQuery = () => Object.fromEntries(new URLSearchParams(location.search).entries());

  const storage = {
    get(k) {
      try {
        const ttl = localStorage.getItem(k + '_ttl');
        if (ttl) {
          if (Date.now() > Number(ttl)) {
            this.del(k);
            return "";
          }
        }
        return localStorage.getItem(k) || "";
      } catch {
        return "";
      }
    },
    isExpired(k) {
      try {
        const ttl = localStorage.getItem(k + '_ttl');
        const exp = Number(ttl);
        if (!ttl || !Number.isFinite(exp)) return true;
        return Date.now() > exp;
      } catch {
        return true;
      }
    },
    getExpiresAt(k) {
      try {
        const ttl = localStorage.getItem(k + '_ttl');
        const exp = Number(ttl);
        if (!Number.isFinite(exp)) return null;
        return new Date(exp).toISOString();
      } catch {
        return null;
      }
    },
    set(k, v, ttlMs) {
      if (typeof ttlMs === "number" && ttlMs > 0) {
        const expireAt = Date.now() + ttlMs;
        localStorage.setItem(k + '_ttl', String(expireAt));
      }
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
    del(k) {
      try {
        localStorage.removeItem(k);
        localStorage.removeItem(k + '_ttl');
      } catch {}
    },
  };

    const qs = parseQuery();
  const getLmclid = () => {
    let lmclid = qs.lmclid || storage.get("lmclid");
    if (lmclid) {
      storage.set("lmclid", lmclid);
    }
    return lmclid || null;
  };
  const lmclid = getLmclid();

    const getUtm = () => {
    const pick = (k) => qs[k] || "";
    return {
      source: pick("utm_source"),
      medium: pick("utm_medium"),
      campaign: pick("utm_campaign"),
      term: pick("utm_term"),
      content: pick("utm_content"),
    };
  };

    const send = async (payload, idempKey) => {
    try {
      const res = await fetch(cfg.apiBase + '/v1/events/ingest', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": cfg.tenant,
          "Idempotency-Key": idempKey,
        },
        body: JSON.stringify(payload),
        credentials: "omit",
      });
      if (!res.ok) {
        let err;
        try {
          err = await res.json();
        } catch {
          err = await res.text();
        }
        console.warn("[LM] send failed", res.status, err);
        return false;
      }
      console.log("[LM] event sent", payload);
      return true;
    } catch (e) {
      console.warn("[LM] send error", e);
      return false;
    }
  };

    const trackConversion = (journeyTagCode, eventName = "conversion") => {
    if (!journeyTagCode) {
      console.warn("[LM] journey_tag_code is required for conversion tracking");
      return;
    }

    const currentLmclid = storage.get("lmclid");
    if (!currentLmclid) {
      console.warn("[LM] lmclid not found, skipping conversion tracking");
      return;
    }

    const ids = JSON.parse(storage.get("lm_ids") || "{}");
    const consent = JSON.parse(storage.get("lm_consent") || "{}");
    const storageIdempKey = 'lm_last_conversion_' + journeyTagCode + '_idempkey';

    if (!storage.isExpired(storageIdempKey)) {
      console.log('[LM] Skipped tracking (idempotency window active until ' + storage.getExpiresAt(storageIdempKey) + ').');
      return;
    }

    const idempKey = uuid();
    storage.set(storageIdempKey, idempKey, 30 * 60 * 1000); // 30分TTL

    const utm = getUtm();
    const payload = {
      idempotency_key: idempKey,
      tenant_id: cfg.tenant,
      event_name: eventName,
      event_time: nowISO(),
      source: "web",
      ids: { lmclid: currentLmclid, ...ids },
      properties: { conversion_id: journeyTagCode },
      consent,
      context: {
        page: { url: location.href, referrer: document.referrer || "" },
        utm,
        user_agent: navigator.userAgent,
      },
    };

    send(payload, idempKey);
  };

    w.lmtrack = w.lmtrack || trackConversion;

    const _lmLayer = w['lmLayer'] || [];
  w['lmLayer'] = { push: (item) => { if (typeof item === 'string') trackConversion(item); } };
  _lmLayer.forEach((item) => { if (typeof item === 'string') trackConversion(item); });

    if (lmclid && cfg.decorateAllowlist.length) {
    const linkDecorator = () => {
      const allow = new Set(cfg.decorateAllowlist.map((s) => s.toLowerCase()));
      allow.add(location.hostname.toLowerCase());

      const decorate = (a) => {
        try {
          const u = new URL(a.href, location.href);
          const host = u.hostname.toLowerCase();
          if (allow.has(host)) {
            if (!u.searchParams.get("lmclid")) {
              u.searchParams.set("lmclid", lmclid);
              a.href = u.toString();
            }
          }
        } catch {}
      };

      [...document.querySelectorAll("a[href]")].forEach(decorate);

      const mo = new MutationObserver((ms) => {
        ms.forEach((m) => {
          [...m.addedNodes].forEach((n) => {
            if (n.nodeType === 1) {
              if (n.tagName === "A" && n.href) decorate(n);
              [...(n.querySelectorAll?.("a[href]") || [])].forEach(decorate);
            }
          });
        });
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    };

    if (d.readyState === "complete" || d.readyState === "interactive") {
      linkDecorator();
    } else {
      d.addEventListener("DOMContentLoaded", () => {
        linkDecorator();
      });
    }
  } else if (!lmclid) {
    console.log("[LM] lmclid not found, skipping link decoration");
  }
})();
