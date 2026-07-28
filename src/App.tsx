import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorBoundary } from "./components/shell/error-boundary";
import { AppShell } from "./components/shell/app-shell";
import { LandingPage } from "./pages/landing";
import { ExchangePage } from "./pages/exchange";
import { ComposePage } from "./pages/compose";
import { MandateDetailPage } from "./pages/mandate-detail";
import { WorkroomPage } from "./pages/workroom";
import { WorkroomsIndexPage } from "./pages/workrooms-index";
import { PassportPage } from "./pages/passport";
import { VaultPage } from "./pages/vault";
import { TribunalPage } from "./pages/tribunal";
import { SettingsPage } from "./pages/settings";
import { NotFoundPage } from "./pages/not-found";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppShell />}>
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/mandates/new" element={<ComposePage />} />
            <Route path="/mandates/:id" element={<MandateDetailPage />} />
            <Route path="/workrooms" element={<WorkroomsIndexPage />} />
            <Route path="/workrooms/:mandateId" element={<WorkroomPage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/tribunal" element={<TribunalPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
