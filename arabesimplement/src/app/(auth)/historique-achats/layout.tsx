export default function HistoriqueAchatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[&_[data-slot=input]]:bg-white [&_[data-slot=textarea]]:bg-white [&_[data-slot=select-trigger]]:bg-white [&_select:not([data-slot])]:bg-white">
      {children}
    </div>
  );
}
