export default function BackgroundEffects() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"></div>
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
    </>
  );
}
