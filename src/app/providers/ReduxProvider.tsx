import { Provider } from "react-redux";
import { store } from "../store";
import { memo, type PropsWithChildren } from "react";

const ReduxProvider = memo(({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
));

export default ReduxProvider;
