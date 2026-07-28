import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Sidebar, SidebarNav } from "./sidebar";
import { Topbar } from "./topbar";
import { Toaster } from "../ui/toaster";
import { useEnsureSession } from "../../api/auth";

/** Authenticated app frame: sidebar + topbar + routed content + toasts. */
export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEnsureSession();

  // close the mobile drawer on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-ink/80"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-line bg-panel py-5">
            <div className="mb-4 flex items-center justify-between px-6">
              <Link
                to="/"
                className="font-display text-lg font-bold tracking-tight text-bone"
                onClick={() => setMenuOpen(false)}
              >
                ZYNDICATE
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="text-fog hover:text-bone"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
