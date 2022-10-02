import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { TSlot, TSlots } from "./types";
import { generateSlotsArray, getLastSlots, hasWon, randomElement } from "./utils";

type TState = {
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
    setState({
      ...state,
      isAnimating: true,
    });
  }, [setState, state])

  // Stop animation after animationDuration and regenerate slots
  useEffect(() => {
    if (state.isAnimating) {
      const timeout = setTimeout(() => {
        setState({
          ...state,
          isAnimating: false,
        });
      }, config.animationDuration);
    }

    // return timeout.clear
  }, [setState, state]);

  return (
    <div className="App">
      <div className="slot-machine">
        {state.slots && hasWon(getLastSlots(state.slots)) && (
        <div className="winner">You won!</div>
      )}
        <div className="slots-view">
          {
            state.slots?.map((col, index) => (
              <div className={`slot-column ${state.isAnimating && 'animating'}`} key={index}>
                {col.map((item, index) => (
                  <div className="slot-item" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            ))
          }
        </div>
        <button onClick={handlePlay}>Spin</button>
      </div>
    </div>
  );
}

export default App;
