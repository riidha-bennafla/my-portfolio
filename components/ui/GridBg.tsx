import { cn } from "@/lib/utils";

const GridBg = () => {
  return (
    <div className="absolute top-0 left-0 flex h-screen min-w-screen w-full items-center justify-center bg-white dark:bg-black-100">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:60px_60px]",
          "dark:[background-image:linear-gradient(to_right,#e4e4e706_2px,transparent_2px),linear-gradient(to_bottom,#e4e4e706_2px,transparent_2px)]",
          "[background-image:linear-gradient(to_right,#26262606_2px,transparent_2px),linear-gradient(to_bottom,#26262606_2px,transparent_2px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
    </div>
  );
};

export default GridBg;
