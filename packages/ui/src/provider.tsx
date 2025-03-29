import { Global } from "@emotion/react";
import { createContext } from "@rtl/react-utils";

import * as defaultCss from "./reset.css";

export interface RtlContextProps {}

const [RtlContextProvider, useProviderRtlContext] =
  createContext<RtlContextProps>({});

export interface ProviderProps {
  children: React.ReactNode;
  styles?: Record<string, any>;
}

function RtlProvider({ children, styles }: ProviderProps) {
  return (
    <RtlContextProvider value={{}}>
      <Global styles={styles ?? defaultCss} />
      {children}
    </RtlContextProvider>
  );
}

export { RtlProvider, useProviderRtlContext };
