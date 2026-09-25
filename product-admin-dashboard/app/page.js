import { redirect } from "next/navigation";

export default function HomePage() {
  // This automatically sends anyone who visits the root URL straight to the login page
  redirect("/login");
}