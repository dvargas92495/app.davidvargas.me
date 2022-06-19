import type { HTMLAttributes } from "react";

const Subtitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`font-semibold mb-2 ${className}`} {...props} />
);

export default Subtitle;
