import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { TSlot, TSlots } from "./types";
import { generateSlotsArray, randomElement } from "./utils";

type TState = {
  isIdle: boolean;
  winners?: TSlot[],
  slots?: TSlots;
  isAnimating: boolean;
};

const config = {
  slotCols: 3,
  slotRows: 10,
  animationDuration: 4000
}

function App() {
  const [state, setState] = useState<TState>({
    isIdle: true,
    isAnimating: false
  });

  useEffect(() => {
    const slots = generateSlotsArray(config.slotCols, config.slotRows);
    setState({
      ...state,
      slots,
    });
  }, []);

  const handlePlay = useCallback(() => {
    const winners = state.slots?.map((slot) => randomElement(slot));

    setState({
      ...state,
      isIdle: false,
      winners,
      isAnimating: true
    });
  }, [setState, state])

  // Stop animation after animationDuration and regenerate slots
  useEffect(() => {
    if (state.isAnimating) {
      const timeout = setTimeout(() => {
        setState({
          ...state,
          slots: generateSlotsArray(config.slotCols, config.slotRows),
          isAnimating: false,
        });
      }, config.animationDuration);
    }

    // return timeout.clear
  }, [state.isAnimating, setState, state]);

  return (
    <div className="App">
      <div className="slot-machine">
        <div className="slots-view">
          {
            state.winners ? state.winners.map((winner, index) => (
              <div className="slot-column" key={index}>
                  <div className="slot-item" key={index}>
                    {winner}
                  </div>
              </div>
            )) : state.slots?.map((col, index) => (
              <div className="slot-column" key={index}>
                {col.map((item, index) => (
                  <div className="slot-item" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            ))
          }
        </div>
        <button onClick={handlePlay}>Play</button>
      </div>
    </div>
  );
}

export default App;
