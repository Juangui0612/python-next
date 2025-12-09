// app/page.tsx (Server Component)
import { redirect } from "next/navigation";

export default function Home() {
  // Redirige inmediatamente a /login
  redirect("/login");
}
