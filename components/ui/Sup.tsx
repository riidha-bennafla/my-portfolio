import { cn } from "./../../lib/utils";
type SupProps = {
  supValue?: string;
  className?: string;
};

const Sup = ({ supValue, className }: SupProps) => {
  return <sup className={cn("sup-font", className)}>{supValue}</sup>;
};

export default Sup;
