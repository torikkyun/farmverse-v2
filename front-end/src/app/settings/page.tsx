"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import SettingsTabMenu from "./SettingsTabMenu";
import ProfileTabForm from "./ProfileTabForm";
import AccountTabForm from "./AccountTabForm";

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    try {
      const userObj = JSON.parse(userStr);
      const userId = userObj?.data?.user?.id;
      if (!userId) return;

      fetch(`${API_URL}/users/${userId}`)
        .then((res) => res.json())
        .then((res) => {
          const data = res.data?.user;
          if (!data) return;
          setUser(data);
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            avatar: data.avatar ? data.avatar : "/avatar.png", // Sửa dòng này
          });
        });
    } catch (e) {
      console.error("Lỗi parse user từ localStorage", e);
    }
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center py-8 px-0 bg-white min-h-screen">
          <div className="flex flex-row w-full gap-4 min-h-[500px] px-6">
            <div className="w-full max-w-xs md:w-[320px] mb-6 md:mb-0 h-full flex">
              <SettingsTabMenu
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <Card className="p-6 sm:p-10 rounded-2xl shadow-lg h-full flex flex-col justify-between">
                {activeTab === "profile" && (
                  <ProfileTabForm form={form} user={user} setForm={setForm} />
                )}
                {activeTab === "account" && (
                  <AccountTabForm form={form} setForm={setForm} />
                )}
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
