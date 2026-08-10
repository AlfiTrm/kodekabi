type AdminDataErrorProps = {
  title: string;
  description: string;
};

export function AdminDataError({ title, description }: AdminDataErrorProps) {
  return (
    <section className="mt-5 rounded-2xl border border-red/25 bg-red/8 px-6 py-16 text-center">
      <h2 className="text-sm font-semibold text-red">{title}</h2>
      <p className="mt-2 text-xs text-foreground/45">{description}</p>
    </section>
  );
}
