import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Inbox, Image, LogOut, Settings, ShoppingBag, Wrench, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/shop", label: "Shop", icon: ShoppingBag },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-3 py-4">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-sidebar-primary">
            Smart &amp; Wise
          </p>
          <p className="text-sm font-semibold text-sidebar-foreground">Admin</p>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.to}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" target="_blank" rel="noreferrer">
                  <ExternalLink />
                  <span>View public site</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <SidebarTrigger />
          <p className="text-sm font-semibold">Admin dashboard</p>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
