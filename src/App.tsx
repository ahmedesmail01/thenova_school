import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import { NotFoundPage } from "./components/NotFoundPage";

// ── Loader fallback ───────────────────────────────────────────
const Loader = () => (
  <div className="min-h-screen bg-brand-navy flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── Public pages ──────────────────────────────────────────────
const HomePage = lazy(() => import("./routes/index.lazy"));
const LoginPage = lazy(() => import("./routes/login.lazy"));
const RegisterPage = lazy(() => import("./routes/register.lazy"));
const ForgotPasswordPage = lazy(() => import("./routes/forgot-password.lazy"));
const AboutPage = lazy(() => import("./routes/about.lazy"));
const PackagesPage = lazy(() => import("./routes/packages.lazy"));
const CoursesPage = lazy(() => import("./routes/courses/index.lazy"));
const CourseDetailPage = lazy(() => import("./routes/courses/CourseDetail"));
const PlayerPage = lazy(() => import("./routes/player.lazy"));
const PrivacyPolicyPage = lazy(() => import("./routes/privacy-policy.lazy"));
const TermsPage = lazy(() => import("./routes/terms-and-conditions.lazy"));
const DisclaimerPage = lazy(() => import("./routes/disclaimer.lazy"));
const CookiePolicyPage = lazy(() => import("./routes/cookie-policy.lazy"));

// ── Auth pages ────────────────────────────────────────────────
const DashboardPage = lazy(() => import("./routes/_auth/dashboard.lazy"));
const ProfilePage = lazy(() => import("./routes/_auth/profile.lazy"));
const WalletPage = lazy(() => import("./routes/_auth/wallet.lazy"));
const TankPage = lazy(() => import("./routes/_auth/tank.lazy"));
const TransactionsPage = lazy(() => import("./routes/_auth/transactions.lazy"));
const CommissionsPage = lazy(() => import("./routes/_auth/commissions.lazy"));
const RankRewardPage = lazy(() => import("./routes/_auth/rank-reward.lazy"));
const MembershipPage = lazy(() => import("./routes/_auth/membership.lazy"));
const GenealogyPage = lazy(() => import("./routes/_auth/genealogy.lazy"));
const LibraryPage = lazy(() => import("./routes/_auth/library.lazy"));
const NovaProPage = lazy(() => import("./routes/_auth/nova-pro.lazy"));
const SupportPage = lazy(() => import("./routes/_auth/support.lazy"));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />
          <Route path="player" element={<PlayerPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="disclaimer" element={<DisclaimerPage />} />
          <Route path="cookie-policy" element={<CookiePolicyPage />} />

          {/* Auth-protected routes */}
          <Route element={<AuthLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="tank" element={<TankPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="commissions" element={<CommissionsPage />} />
            <Route path="rank-reward" element={<RankRewardPage />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="genealogy" element={<GenealogyPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="nova-pro" element={<NovaProPage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
