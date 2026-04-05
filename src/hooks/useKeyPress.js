import { useEffect } from "react";

export function useKeyPress(key, action) {
  useEffect(() => {
    function onKeyup(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        // Ignore if user is typing in an input or textarea
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
          return;
        }
        action();
      }
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [key, action]);
}
