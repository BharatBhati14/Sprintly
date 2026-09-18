import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/current-user";
import { InvitationPage } from "@/features/invitations/components";

interface InvitationRouteProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitationRoute({
  params,
}: InvitationRouteProps) {
  const { token } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/invitations/${token}`);
  }

  return (
    // <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
    //   <InvitationPage token={token} />
    // </div>

    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      {/* Invitation content */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur-sm ">
          <InvitationPage token={token} />
        </div>
      </div>
    </div>
  );
}
