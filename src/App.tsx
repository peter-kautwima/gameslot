import { FormEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import BetForm from "./components/bet-form/bet-form";
import Wallet from "./components/wallet/wallet";
import { extractPokemonImages, getPokemonListing } from "./pokemon";
import { TSlot, TSlots } from "./types";
import {
  generateSlotsArray,
  getLastSlots,
  hasWon,
  randomElement,
} from "./utils";

type TState = {
  slots?: TSlots;
  result?: TSlot[];
  isSpinning: boolean;
};

const config = {
  slotCols: 3,
  slotRows: 10,
  animationDuration: 4000,
};

function App() {
  const [state, setState] = useState<TState>({
    isSpinning: false,
  });

  const [images, setImages] = useState<string[]>([]);

  /**
   * Initial mount
   */
  useEffect(() => {
    const slots = generateSlotsArray(config.slotCols, config.slotRows);
    setState({
      ...state,
      slots,
    });
  }, []);

  const handlePlay = useCallback(() => {
    const result = state.slots ? getLastSlots(state.slots) : [];
    setState({
      ...state,
      result,
      isSpinning: true,
    });
  }, [setState, state]);

  const handleReset = useCallback(() => {
    const slots = generateSlotsArray(config.slotCols, config.slotRows)
    setState({
      ...state,
      slots,
      isSpinning: false,
    });
  }, [setState, state]);

  // Fetch pokenames from API
  useEffect(() => {
    (async () => {
      const pokemon = await getPokemonListing();
      const images = pokemon ? extractPokemonImages(pokemon) : [];
      setImages(images);
    })();
  }, []);

  const handleBetChange = (event: FormEvent) => {
    console.log(event);
  }

  return (
    <div className="App">
      <div className="bg-image" />
      <div className="slot-machine">
        {!state.isSpinning && state.result && hasWon(state.result) && (
          <div className="winner">You won!</div>
        )}
        <div className="slots-view">
          {state.slots?.map((col, index) => (
            <div
              className={`slot-column ${state.isSpinning && "animating"}`}
              key={index}
            >
              {col.map((item, index) => (
                <div className="slot-item" key={index}>
                  <img src={images[item]} alt={item.toString()} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="controls">
          <div>
            <Wallet balance={1000} />
          </div>
          <div>
            <BetForm onChange={handleBetChange} />
          </div>
          <div>
            {state.isSpinning ? (
              <button className="play-again" onClick={handleReset}>Play again</button>
            ) : (
              <button className="spin-button" onClick={handlePlay}>Spin</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
