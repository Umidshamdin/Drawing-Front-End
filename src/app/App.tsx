import { useEffect, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { ShopLayout } from '../components/ShopLayout';
import { AdminLayout } from '../components/AdminLayout';
import { HomePage } from '../pages/site/Home';
import { CatalogPage } from '../pages/site/Catalog';
import { ArtworkPage } from '../pages/site/Artwork';
import { ArtistsPage, ArtistPublicPage, ContactPage, ContentPage, NotFoundPage } from '../pages/site/General';
import { ForgotPasswordPage, LoginPage, RegisterPage, TokenActionPage } from '../pages/site/Auth';
import { AccountPage, FavoritesPage, OrdersPage, OrderTrackingPage } from '../pages/site/Account';
import { CheckoutPage } from '../pages/site/Checkout';
import { ArtistApplyPage, ArtistDashboardPage, ArtworkEditorPage, ArtistSalesPage } from '../pages/artist/Artist';
import { AdminDashboardPage } from '../pages/admin/Dashboard';
import { AdminArtistsPage, AdminArtworksPage, AdminFeaturedPage } from '../pages/admin/Moderation';
import { AdminOrdersPage, AdminOrderDetailsPage } from '../pages/admin/Orders';
import { AdminCategoriesPage, AdminSlidesPage, AdminPagesPage } from '../pages/admin/Content';
import { AdminEmailsPage, AdminLookupsPage, AdminMessagesPage, AdminSettingsPage, AdminUsersPage } from '../pages/admin/Management';

function Public({ children }: { children: ReactNode }) { return <ShopLayout>{children}</ShopLayout>; }
function Admin({ children }: { children: ReactNode }) { return <AdminLayout>{children}</AdminLayout>; }
export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [location.pathname]);
  return <Routes>
    <Route path="/" element={<Public><HomePage /></Public>} />
    <Route path="/artworks" element={<Public><CatalogPage /></Public>} />
    <Route path="/artworks/:id" element={<Public><ArtworkPage /></Public>} />
    <Route path="/artists" element={<Public><ArtistsPage /></Public>} />
    <Route path="/artists/:id" element={<Public><ArtistPublicPage /></Public>} />
    <Route path="/about" element={<Public><ContentPage slug="about" /></Public>} />
    <Route path="/how-it-works" element={<Public><ContentPage slug="how-it-works" /></Public>} />
    <Route path="/delivery" element={<Public><ContentPage slug="delivery" /></Public>} />
    <Route path="/privacy" element={<Public><ContentPage slug="privacy" /></Public>} />
    <Route path="/terms" element={<Public><ContentPage slug="terms" /></Public>} />
    <Route path="/pages/:slug" element={<Public><ContentPage /></Public>} />
    <Route path="/contact" element={<Public><ContactPage /></Public>} />
    <Route path="/login" element={<Public><LoginPage /></Public>} />
    <Route path="/register" element={<Public><RegisterPage /></Public>} />
    <Route path="/forgot-password" element={<Public><ForgotPasswordPage /></Public>} />
    <Route path="/verify-email" element={<Public><TokenActionPage mode="verify" /></Public>} />
    <Route path="/reset-password" element={<Public><TokenActionPage mode="reset" /></Public>} />
    <Route path="/account" element={<Public><AccountPage /></Public>} />
    <Route path="/favorites" element={<Public><FavoritesPage /></Public>} />
    <Route path="/orders" element={<Public><OrdersPage /></Public>} />
    <Route path="/orders/:id" element={<Public><OrderTrackingPage /></Public>} />
    <Route path="/checkout/:id" element={<Public><CheckoutPage /></Public>} />
    <Route path="/artist" element={<Public><ArtistDashboardPage /></Public>} />
    <Route path="/artist/apply" element={<Public><ArtistApplyPage /></Public>} />
    <Route path="/artist/artworks/new" element={<Public><ArtworkEditorPage /></Public>} />
    <Route path="/artist/artworks/:id/edit" element={<Public><ArtworkEditorPage /></Public>} />
    <Route path="/artist/sales" element={<Public><ArtistSalesPage /></Public>} />
    <Route path="/admin" element={<Admin><AdminDashboardPage /></Admin>} />
    <Route path="/admin/artists" element={<Admin><AdminArtistsPage /></Admin>} />
    <Route path="/admin/artworks" element={<Admin><AdminArtworksPage /></Admin>} />
    <Route path="/admin/featured" element={<Admin><AdminFeaturedPage /></Admin>} />
    <Route path="/admin/categories" element={<Admin><AdminCategoriesPage /></Admin>} />
    <Route path="/admin/slides" element={<Admin><AdminSlidesPage /></Admin>} />
    <Route path="/admin/pages" element={<Admin><AdminPagesPage /></Admin>} />
    <Route path="/admin/settings" element={<Admin><AdminSettingsPage /></Admin>} />
    <Route path="/admin/lookups" element={<Admin><AdminLookupsPage /></Admin>} />
    <Route path="/admin/orders" element={<Admin><AdminOrdersPage /></Admin>} />
    <Route path="/admin/orders/:id" element={<Admin><AdminOrderDetailsPage /></Admin>} />
    <Route path="/admin/users" element={<Admin><AdminUsersPage /></Admin>} />
    <Route path="/admin/messages" element={<Admin><AdminMessagesPage /></Admin>} />
    <Route path="/admin/emails" element={<Admin><AdminEmailsPage /></Admin>} />
    <Route path="*" element={<Public><NotFoundPage /></Public>} />
  </Routes>;
}
