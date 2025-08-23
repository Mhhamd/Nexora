import { SignupForm } from '@/components/signup-form';
import { protectRoute } from '@/server/session';

async function SignUpPage() {
  await protectRoute({
    requireAuth: false,
    redirectTo: '/',
  });
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}

export default SignUpPage;
