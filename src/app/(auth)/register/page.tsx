import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Start managing your work with TaskFlow.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
