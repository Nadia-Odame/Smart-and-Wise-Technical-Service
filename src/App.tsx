import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/admin/RequireAuth";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers"));
const AdminShop = lazy(() => import("./pages/admin/AdminShop"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminVerifyEmail = lazy(() => import("./pages/admin/AdminVerifyEmail"));

const queryClient = new QueryClient();

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
    Loading...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/products" element={<Navigate to="/shop" replace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/verify-email"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminVerifyEmail />
              </Suspense>
            }
          />
          <Route element={<RequireAuth />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<Navigate to="/admin/enquiries" replace />} />
              <Route
                path="enquiries"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminEnquiries />
                  </Suspense>
                }
              />
              <Route
                path="careers"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminCareers />
                  </Suspense>
                }
              />
              <Route
                path="shop"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminShop />
                  </Suspense>
                }
              />
              <Route
                path="shop/products/new"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminProductForm />
                  </Suspense>
                }
              />
              <Route
                path="shop/products/:id/edit"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminProductForm />
                  </Suspense>
                }
              />
              <Route
                path="gallery"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminGallery />
                  </Suspense>
                }
              />
              <Route
                path="services"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminServices />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminSettings />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
