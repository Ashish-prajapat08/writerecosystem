import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "@/components/pages/LandingPage";
import AuthPage from "@/components/pages/AuthPage";
import { MainFeed } from "@/components/pages/Feed/subroutes/MainFeed";
import { JobsTab } from "@/components/pages/Feed/subroutes/JobsTab";
import { SearchTab } from "@/components/pages/Feed/subroutes/SearchTab";
import { NotificationsTab } from "@/components/pages/Feed/subroutes/NotificationsTab";
import { Leaderboard } from "@/components/pages/Feed/subroutes/Leaderboard";
import { ProfileTab } from "@/components/pages/Feed/subroutes/ProfileTab";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthCallback } from "./auth/callback";
import { ResetPassword } from "./ResetPassword";
import { ArticleDetailPage } from "@/components/pages/Feed/subroutes/ArticleDetailPage";
import { PostArticlePage } from "@/components/pages/Feed/subroutes/PostTab";
import { EditArticlePage } from "@/components/pages/EditArticlePage";
import UserProfilePage from "@/components/pages/UserProfilePage";
import { FollowersPage } from "@/components/FollowersPage";
import { FollowingPage } from "@/components/FollowingPage";
import { MainLayout } from "@/components/pages/Feed/layout/MainLayout";
import { PostJobForm } from "@/components/Jobs/PostJobForm";
import ApplicantsPage from "@/components/Jobs/ApplicantsPage";
import CompetitionsPage from "@/components/Competitions/CompetitionPage";
import EbookHub from "@/components/Ebooks/EbooksHub";
import PublishEbook from "@/components/Ebooks/PublishEbook";
import { TermsAndConditions } from "@/components/pages/TermsAndConditions";
import { PrivacyPolicy } from "@/components/pages/PrivacyPolicy";
import PaymentFailed from "@/components/Ebooks/PaymentFailed";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* All feed-related routes */}

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="feed" replace />} />
        {/* Main feed sections */}
        <Route path="feed" element={<MainFeed />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route
          path="jobs"
          element={
            <ProtectedRoute>
              <JobsTab />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs/post"
          element={
            <ProtectedRoute>
              <PostJobForm />
            </ProtectedRoute>
          }
        />
        <Route path="jobs/applicants" element={<ApplicantsPage />} />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsTab />
            </ProtectedRoute>
          }
        />
        <Route
          path="post"
          element={
            <ProtectedRoute>
              <PostArticlePage />
            </ProtectedRoute>
          }
        />
        <Route path="search" element={<SearchTab />} />
        {/* Article routes */}
        <Route path="article/:articleId" element={<ArticleDetailPage />} />
        <Route
          path="article/:articleId/edit"
          element={
            <ProtectedRoute>
              <EditArticlePage />
            </ProtectedRoute>
          }
        />
        {/* Profile routes */}
        <Route
          path="myprofile"
          element={
            <ProtectedRoute>
              <ProfileTab />
            </ProtectedRoute>
          }
        />
        <Route path="profile/:username" element={<UserProfilePage />} />
        <Route path="profile/:username/followers" element={<FollowersPage />} />
        <Route path="profile/:username/following" element={<FollowingPage />} />
        // In your router configuration
        <Route path="/competitions" element={<CompetitionsPage />} />

        //Ebooks routes
        <Route path="/ebookhub" element={<EbookHub />} />
        <Route path="/publish-ebook"  element={<PublishEbook/>} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Route>
    </Routes>
  );
}
