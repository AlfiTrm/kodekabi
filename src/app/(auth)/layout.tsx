import { PageLoader } from "@/src/shared/components/feedback/page-loader/page-loader";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageLoader label="Memeriksa identitas" />
      {children}
    </div>
  );
}
