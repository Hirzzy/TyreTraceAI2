
"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@/firebase/auth/use-user";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, isLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/"); // Redirect to landing page after sign out
    }
  };

  if (isLoading) {
    return null; // Or a skeleton loader
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center justify-between p-2">
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-7 w-7">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'Avatar'} />}
                    <AvatarFallback>{user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.displayName || user?.email}
                    </span>
                </div>
            </div>
             <SidebarMenuButton
                variant="default"
                size="icon"
                className="h-8 w-8 shrink-0"
                tooltip={{ children: "Se déconnecter", side: "right", align: "center" }}
                onClick={handleSignOut}
                aria-label="Se déconnecter"
            >
                <LogOut />
            </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
