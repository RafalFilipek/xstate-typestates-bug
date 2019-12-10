import * as React from "react";
import { render } from "react-dom";

import { createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";

interface User {
  name: string;
}

interface UserContext {
  user?: User;
  error?: string;
}

type UserEvent =
  | { type: "FETCH"; id: string }
  | { type: "RESOLVE"; user: User }
  | { type: "REJECT"; error: string };

type UserState =
  | {
      value: "idle";
      context: UserContext & {
        user: undefined;
        error: undefined;
      };
    }
  | {
      value: "loading";
      context: UserContext;
    }
  | {
      value: "success";
      context: UserContext & { user: User; error: undefined };
    }
  | {
      value: "failure";
      context: UserContext & { user: undefined; error: string };
    };

const userMachine = createMachine<UserContext, UserEvent, UserState>({
  id: "user",
  initial: "idle",
  states: {
    idle: {},
    loading: {},
    success: {},
    failure: {}
  }
});

const userService = interpret(userMachine);

userService.subscribe(state => {
  // just checking - user can be undefined - OK
  state.context.user.name;

  if (state.matches<any>("success")) {
    // from the UserState typestate, `user` will be defined
    // :( still, use can be undefined
    state.context.user.name;
  }

  if (state.matches<any>("failure")) {
    // error is string | undefined :(
    state.context.error[0];
  }
});

function App() {
  const [state, send] = useMachine(userMachine);

  return (
    <div className="App">
      {state.matches<any>("success") && (
        <strong>
          {/* same problem :( */}
          {state.context.user.name}
        </strong>
      )}
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
