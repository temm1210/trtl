import { Global } from "@emotion/react";
import { createContext } from "@rtl/react-utils";

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
      <Global styles={styles} />
      {children}
    </RtlContextProvider>
  );
}

export { RtlProvider, useProviderRtlContext };
