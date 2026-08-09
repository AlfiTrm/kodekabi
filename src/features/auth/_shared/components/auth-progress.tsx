const registerSteps = ["Akun", "Email", "Detektif", "Profil"] as const;

export function AuthProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Langkah ${currentStep + 1} dari ${registerSteps.length}`}>
      {registerSteps.map((label, index) => (
        <span key={label} className={`h-1 w-6 rounded-full ${index < currentStep ? "bg-green" : index === currentStep ? "bg-purple" : "bg-border-strong"}`} />
      ))}
    </div>
  );
}
