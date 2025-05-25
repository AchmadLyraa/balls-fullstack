import { redirectIfAuthenticated } from "@/lib/server-auth";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return <RegisterForm />;
}
