import { useEffect, useState } from "react";

import ReactDOM from "react-dom";

export interface PortalProps {
  container?: Element;
  children: React.ReactNode;
}

const Portal = ({ container: containerProp, children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const container = containerProp || document.body;

  return container ? ReactDOM.createPortal(children, container) : null;
};

export default Portal;
