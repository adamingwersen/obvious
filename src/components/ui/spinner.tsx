import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};

const Spinner = ({ className }: SpinnerProps) => {
  return <Loader2 className={cn("stroke-5 animate-spin", className)} />;
};

export default Spinner;
