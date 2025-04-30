import { ReactElement, useEffect, useRef, useState } from "react";

import { Slot } from "../slot";

export interface PresenceProps {
  present: boolean;
  children: ReactElement;
}

/************************************ Presence *************************************/
const Presence = ({ present, children }: PresenceProps) => {
  const { isPresent, ref } = usePresence(present);

  if (!isPresent) return null;

  return <Slot ref={ref}>{children}</Slot>;
};

/************************************ usePresence *************************************/
function usePresence(presentProp: boolean) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isPresent, setIsPresent] = useState(presentProp);

  useEffect(() => {
    if (presentProp) {
      setIsPresent(true);
      return;
    }

    const node = nodeRef.current;

    if (!node) {
      setIsPresent(false);
      return;
    }

    const handleAnimationEnd = () => {
      cleanup();
      setIsPresent(false);
    };

    const cleanup = () => {
      node.removeEventListener("animationend", handleAnimationEnd);
      node.removeEventListener("animationcancel", handleAnimationEnd);
    };

    node.addEventListener("animationend", handleAnimationEnd);
    node.addEventListener("animationcancel", handleAnimationEnd);

    return cleanup;
  }, [presentProp]);

  const ref = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  return { isPresent, ref };
}

export default Presence;
