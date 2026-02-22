import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[#C9E3FF] bg-[#E6F3FF] transition-colors data-[state=checked]:bg-[#0066CC]",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Indicator
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
}

