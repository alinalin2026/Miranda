import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, RefreshCw } from "lucide-react";

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
}

const STORAGE_KEY = "mr_admin_pw";
const REFRESH_MS = 10000;

function ProductCard({ row }: { row: ProductRow }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900">/review/{row.product}/go/*</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-semibold">{row.total}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="py-1.5">Promoter slug</th>
                <th className="py-1.5">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {row.slugs.length ? (
                row.slugs.map((s) => (
                  <tr key={s.slug} className="border-t border-gray-100">
                    <td className="py-1.5 text-gray-900">{s.slug}</td>
                    <td className="py-1.5">{s.hits}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-3 text-gray-400">
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
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900">{data?.totalHits ?? 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Products Tracked</p>
            <p className="text-3xl font-bold text-gray-900">{data?.products.length ?? 0}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">By Product — click to see promoter breakdown</h2>
          </div>
          {data?.products.length ? (
            data.products.map((row) => <ProductCard key={row.product} row={row} />)
          ) : (
            <p className="px-4 py-8 text-center text-gray-400">No clicks yet</p>
          )}
        </div>

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
