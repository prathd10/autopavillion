import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import CarDetailsPage from './pages/CarDetailsPage';
import AboutPage from './pages/AboutPage';
import SourcingPage from './pages/SourcingPage';
import SellPage from './pages/SellPage';
import FinancePage from './pages/FinancePage';
import ComparePage from './pages/ComparePage';
import InsightsPage from './pages/InsightsPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import Chatbot from './components/Chatbot';
import ViewingModal from './components/ViewingModal';
import ComparisonTray from './components/ComparisonTray';

// Admin pages
import AdminLogin     from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminInventory from './admin/pages/AdminInventory';
import CarForm        from './admin/pages/CarForm';
import AdminTestimonials from './admin/pages/AdminTestimonials';
import TestimonialForm   from './admin/pages/TestimonialForm';
import AdminInquiries from './admin/pages/AdminInquiries';
import AdminFAQs from './admin/pages/AdminFAQs';
import FAQForm from './admin/pages/FAQForm';

// Admin layout + route guard
import AdminLayout    from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';

/**
 * Root router.
 * - /               → Public homepage (Supabase-backed car data + page tracking)
 * - /inventory      → Public inventory listing
 * - /about          → Public about page
 * - /sourcing       → Public sourcing page
 * - /faq            → Public FAQ page
 * - /admin/login    → Supabase auth login
 * - /admin/*        → Protected admin panel (dashboard, inventory CRUD)
 *
 * BrowserRouter is provided by main.jsx.
 * AuthProvider is provided by main.jsx.
 */
export default function App() {
  return (
    <>
      <ViewingModal />
      <ComparisonTray />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:slug" element={<CarDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sourcing" element={<SourcingPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* ── Admin Auth ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Protected Admin (sidebar layout via Outlet) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin → redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"           element={<AdminDashboard />} />
          <Route path="inquiries"           element={<AdminInquiries />} />
          <Route path="inventory"           element={<AdminInventory />} />
          <Route path="inventory/new"       element={<CarForm />} />
          <Route path="inventory/:id/edit"  element={<CarForm />} />
          
          <Route path="faqs"                  element={<AdminFAQs />} />
          <Route path="faqs/new"              element={<FAQForm />} />
          <Route path="faqs/:id/edit"         element={<FAQForm />} />

          <Route path="testimonials"          element={<AdminTestimonials />} />
          <Route path="testimonials/new"      element={<TestimonialForm />} />
          <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
        </Route>

        {/* Catch-all → homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Chatbot />} />
      </Routes>
    </>
  );
}
