import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, Mail, RefreshCw, Send, X } from "lucide-react";

interface SlugRow {
  slug: string;
  hits: number;
}

interface ProductRow {
  product: string;
  total: number;
  slugs: SlugRow[];
}

interface LogEntry {
  ts: number;
  product: string;
  slug: string;
  country: string;
  referrer: string;
  userAgent?: string;
}

interface DashboardData {
  totalHits: number;
  products: ProductRow[];
  recent: LogEntry[];
  quizLeadCount: number;
}

interface LeadRecord {
  ts: number;
  email: string;
  name?: string;
  memory?: string;
  answers: Record<string, string>;
  result: string;
  source: string;
  emailSent: boolean;
  emailSentAt: number | null;
  emailError?: string | null;
}

type SendState = "idle" | "sending" | "ok" | "error";

const STORAGE_KEY = "mr_admin_pw";
const REFRESH_MS = 10000;
const MAX_BATCH_SEND = 50;

function ProductCard({
  row,
  onResetSlug,
  onResetProduct,
}: {
  row: ProductRow;
  onResetSlug: (product: string, slug: string) => void;
  onResetProduct: (product: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <button className="flex-1 text-left" onClick={() => setOpen(!open)}>
          <span className="font-medium text-gray-900">/review/{row.product}/go/*</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-semibold">{row.total}</span>
          <button
            title="Reset all clicks for this product"
            onClick={() => {
              if (confirm(`Reset all ${row.total} clicks for ${row.product}? This can't be undone.`)) {
                onResetProduct(row.product);
              }
            }}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Reset
          </button>
          <button onClick={() => setOpen(!open)}>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-3">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="py-1.5">Promoter slug</th>
                <th className="py-1.5">Clicks</th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody>
              {row.slugs.length ? (
                row.slugs.map((s) => (
                  <tr key={s.slug} className="border-t border-gray-100">
                    <td className="py-1.5 text-gray-900">{s.slug}</td>
                    <td className="py-1.5">{s.hits}</td>
                    <td className="py-1.5 text-right">
                      <button
                        title={`Reset clicks for ${s.slug}`}
                        onClick={() => {
                          if (confirm(`Reset ${s.hits} clicks for ${row.product}/${s.slug}? This can't be undone.`)) {
                            onResetSlug(row.product, s.slug);
                          }
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-3 text-gray-400">
                    No clicks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ lead }: { lead: LeadRecord }) {
  if (lead.emailSent) {
    return (
      <span
        title={lead.emailSentAt ? new Date(lead.emailSentAt).toLocaleString() : undefined}
        className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full"
      >
        Sent
      </span>
    );
  }
  if (lead.emailError) {
    return (
      <span
        title={lead.emailError}
        className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full"
      >
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      Not sent
    </span>
  );
}

function LeadsManager({ password }: { password: string }) {
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "sent" | "not-sent">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rowState, setRowState] = useState<Record<string, SendState>>({});
  const [bulkSending, setBulkSending] = useState(false);

  const fetchLeads = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-password": password } });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Failed to load leads (${res.status})`);
      }
      const json = (await res.json()) as { leads: LeadRecord[] };
      setLeads(json.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    if (filter === "sent") return leads.filter((l) => l.emailSent);
    if (filter === "not-sent") return leads.filter((l) => !l.emailSent);
    return leads;
  }, [leads, filter]);

  const counts = useMemo(() => {
    const sent = leads?.filter((l) => l.emailSent).length ?? 0;
    const total = leads?.length ?? 0;
    return { sent, notSent: total - sent, total };
  }, [leads]);

  function toggleOne(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((prev) => {
      const visibleEmails = filtered.map((l) => l.email);
      const allSelected = visibleEmails.length > 0 && visibleEmails.every((e) => prev.has(e));
      if (allSelected) {
        const next = new Set(prev);
        visibleEmails.forEach((e) => next.delete(e));
        return next;
      }
      return new Set([...Array.from(prev), ...visibleEmails]);
    });
  }

  async function sendTo(emails: string[]) {
    if (emails.length === 0) return;
    const batch = emails.slice(0, MAX_BATCH_SEND);
    setRowState((prev) => {
      const next = { ...prev };
      batch.forEach((e) => (next[e] = "sending"));
      return next;
    });
    try {
      const res = await fetch("/api/send-recipe-email", {
        method: "POST",
        headers: { "x-admin-password": password, "content-type": "application/json" },
        body: JSON.stringify({ emails: batch }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || `Send failed (${res.status})`);

      const results = (body?.results ?? []) as { email: string; ok: boolean; error?: string }[];
      setRowState((prev) => {
        const next = { ...prev };
        results.forEach((r) => (next[r.email] = r.ok ? "ok" : "error"));
        return next;
      });
      await fetchLeads();
    } catch (err) {
      setRowState((prev) => {
        const next = { ...prev };
        batch.forEach((e) => (next[e] = "error"));
        return next;
      });
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  async function sendSelected() {
    setBulkSending(true);
    await sendTo(Array.from(selected));
    setBulkSending(false);
    setSelected(new Set());
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
      <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-gray-900">
          Quiz Leads{" "}
          <span className="font-normal text-gray-400 text-sm">
            ({counts.total} total — {counts.sent} sent, {counts.notSent} not sent)
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {(["all", "not-sent", "sent"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 font-medium ${
                  filter === f ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "all" ? "All" : f === "sent" ? "Sent" : "Not sent"}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 px-4 pt-3">{error}</p>}

      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={filtered.length > 0 && filtered.every((l) => selected.has(l.email))}
            onChange={toggleAllVisible}
            className="rounded"
          />
          Select all visible ({filtered.length})
        </label>
        <Button
          size="sm"
          disabled={selected.size === 0 || bulkSending}
          onClick={sendSelected}
          className="bg-amber-800 hover:bg-amber-900 text-white disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {bulkSending
            ? "Sending…"
            : `Send Recipe Email${selected.size ? ` (${Math.min(selected.size, MAX_BATCH_SEND)})` : ""}`}
        </Button>
      </div>

      <div className="max-h-[32rem] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-gray-400">
            {leads === null ? "Loading…" : "No leads in this view yet"}
          </p>
        ) : (
          filtered.map((lead) => (
            <div key={lead.email} className="border-b border-gray-100 px-4 py-3 flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.has(lead.email)}
                onChange={() => toggleOne(lead.email)}
                className="mt-1 rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-gray-900 truncate">
                    {lead.email}
                    {lead.name ? <span className="text-gray-500 font-normal"> ({lead.name})</span> : null}
                  </span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {new Date(lead.ts).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge lead={lead} />
                  <span className="text-gray-500 text-xs">{lead.result}</span>
                </div>
                {lead.memory && <p className="text-xs text-gray-400 truncate mt-1">"{lead.memory}"</p>}
              </div>
              <button
                title={lead.emailSent ? "Resend" : "Send"}
                disabled={rowState[lead.email] === "sending"}
                onClick={() => sendTo([lead.email])}
                className="text-gray-400 hover:text-amber-800 disabled:opacity-50 mt-1"
              >
                {rowState[lead.email] === "sending" ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (pw: string) => {
    if (!pw) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard-data", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setAuthed(false);
        setError("Incorrect password");
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Failed to load (${res.status})`);
      }
      const json = (await res.json()) as DashboardData;
      setData(json);
      setAuthed(true);
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetClicks = useCallback(
    async (product: string, slug?: string) => {
      try {
        const res = await fetch("/api/dashboard-reset", {
          method: "POST",
          headers: { "x-admin-password": password, "content-type": "application/json" },
          body: JSON.stringify({ product, slug }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || `Reset failed (${res.status})`);
        }
        await fetchData(password);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reset");
      }
    },
    [password, fetchData],
  );

  useEffect(() => {
    if (password) fetchData(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchData(password), REFRESH_MS);
    return () => clearInterval(interval);
  }, [authed, password, fetchData]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">Click Dashboard</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(password);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
              {loading ? "Checking..." : "Enter"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Click Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={() => fetchData(password)} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto py-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900">{data?.totalHits ?? 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Products Tracked</p>
            <p className="text-3xl font-bold text-gray-900">{data?.products.length ?? 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Quiz Emails Captured</p>
            <p className="text-3xl font-bold text-gray-900">{data?.quizLeadCount ?? 0}</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">By Product — click to see promoter breakdown</h2>
          </div>
          {data?.products.length ? (
            data.products.map((row) => (
              <ProductCard
                key={row.product}
                row={row}
                onResetSlug={(product, slug) => resetClicks(product, slug)}
                onResetProduct={(product) => resetClicks(product)}
              />
            ))
          ) : (
            <p className="px-4 py-8 text-center text-gray-400">No clicks yet</p>
          )}
        </div>

        <LeadsManager password={password} />

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data?.recent.length ? (
              data.recent.map((entry, i) => (
                <div key={i} className="border-b border-gray-100 pb-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-gray-900">
                      /review/{entry.product}/go/{entry.slug}
                    </span>
                    <span className="text-gray-500">{entry.country}</span>
                    <span className="text-gray-400 whitespace-nowrap">{new Date(entry.ts).toLocaleTimeString()}</span>
                  </div>
                  {entry.userAgent && <p className="text-xs text-gray-400 truncate mt-0.5">{entry.userAgent}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No activity yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
