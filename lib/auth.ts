import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.refresh(); // Refresh the page to clear the session
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { logout };
}
