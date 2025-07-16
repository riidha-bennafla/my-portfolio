// @/components/layout/Container.tsx

export default function Container({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full flex-items-center-col">
      <div className="size-full justify-center bg-main z-10">
        <div className="relative w-full max-w-8xl flex-col px-4 md:px-3 pb-8 border-b-neutral-800 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
