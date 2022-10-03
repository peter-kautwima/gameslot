import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { extractPokemonImages, getPokemonListing } from "./pokemon";
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

  const [images, setImages] = useState<string[]>([]);

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

  const handleReset = useCallback(() => {
    setState({
      ...state,
      slots: generateSlotsArray(config.slotCols, config.slotRows),
      isAnimating: false,
    });
  }, [setState, state])

  // Fetch pokenames from API
  useEffect(() => {
    (async () => {
      const pokemon = await getPokemonListing()
      const images = pokemon ? extractPokemonImages(pokemon) : []
      setImages(images)
    })()
  }, []);

  return (
    <div className="App">
      <div className="bg-image" />
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
                    <img src={images[item]} alt={item.toString()} />
                  </div>
                ))}
              </div>
            ))
          }
        </div>
        {state.isAnimating ? (
          <button onClick={handleReset}>Play again</button>
        ) : (
          <button onClick={handlePlay}>Spin</button>
        )}
      </div>
    </div>
  );
}

export default App;
