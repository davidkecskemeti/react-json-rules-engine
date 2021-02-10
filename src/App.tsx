import React, { useState } from "react";
import "./App.css";
import { Engine } from "json-rules-engine";

const engine = new Engine();
engine.addRule({
  conditions: {
    any: [
      {
        all: [
          {
            fact: "cost",
            operator: "lessThanInclusive",
            value: 400,
          },
          {
            fact: "cost",
            operator: "greaterThan",
            value: 0,
          },
        ],
      },
    ],
  },
  event: {
    type: "canTrade",
    params: {
      message: "Trade can be entered",
    },
  },
});

interface StateProps {
  shares: number;
  unitPrice: number;
}
interface ResultProps {
  results: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<StateProps>({ shares: 0, unitPrice: 0 });
  const [results, setResults] = React.useState<ResultProps>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newState = {
      ...state,
      [name]: +value,
    };
    setState(newState);

    engine
      .run({
        cost: newState.shares * newState.unitPrice,
      })
      .then((engineResult) => {
        const res = engineResult.events.map((e) => e.params?.message!);
        setResults(res[0]);
      });
  };

  return (
    <form>
      <div>
        <label>Balance: 400</label>
      </div>
      <div>
        <label>
          Shares
          <input
            type="text"
            name="shares"
            value={state.shares}
            onChange={onChange}
          />
        </label>
      </div>
      <div>
        <label>
          Unit Price
          <input
            type="text"
            name="unitPrice"
            value={state.unitPrice}
            onChange={onChange}
          />
        </label>
      </div>
      <div>Result: {results}</div>
      <div>
        Next Steps: add a rule that checks Shares and Unit Price are bigger than
        zero
      </div>
    </form>
  );
};

export default App;
