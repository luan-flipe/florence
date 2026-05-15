import { createClient } from "./supabase-server";
import type { UserProfile, UserRole } from "@/types/database";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function requireProfile(): Promise<UserProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireRole(allowed: UserRole[]): Promise<UserProfile> {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) redirect("/leads"); // fallback genérico
  return profile;
}
