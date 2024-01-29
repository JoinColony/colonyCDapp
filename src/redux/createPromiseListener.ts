import createReduxPromiseListener, {
  type State,
  type Action,
  type Config,
} from '@colony/redux-promise-listener';
import { type Middleware } from 'redux';

// More specific types than in package (with generics)
export type AsyncFunction<Params, Return> = {
  asyncFunction: (arg0: Params) => Promise<Return>;
  unsubscribe: () => void;
};

export type PromiseListener = {
  middleware: Middleware<State, Action>;
  createAsyncFunction: <Params, Return>(
    arg0: Config,
  ) => AsyncFunction<Params, Return>;
};

const reduxPromiseListener: PromiseListener = createReduxPromiseListener();

export default reduxPromiseListener;
