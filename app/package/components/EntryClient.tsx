import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";

export default () => {
  // Remove this hack once https://github.com/facebook/react/issues/24430 is addressed
  // lastpass is adding a wonky div during hydration - so lets remove and add back for now
  const dsToRemove = Array.from(document.body.children)
    .filter(
      (d): d is HTMLDivElement =>
        d.nodeName === "DIV" &&
        d.getAttribute("style") === "position: static !important;"
    )
    .map((d) => ({ d, before: d.nextSibling }));
  dsToRemove.forEach(({ d }) => d.remove());

  hydrateRoot(document, <RemixBrowser />);
};
