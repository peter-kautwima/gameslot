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
  balance: number;
};

const config = {
  slotCols: 3,
  slotRows: 10,
  animationDuration: 1000,
  winMultiplier: 10,
};

function App() {
  const [state, setState] = useState<TState>({
    isSpinning: false,
    balance: 10000
  });

  const [betAmount, setBetAmount] = useState(0);

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

  const handleBetChange = (event: any) => {
    setBetAmount(event.target.value)
  }

  /**
   * Spin animation and wallet balance calculation
   */
  useEffect(() => {
    if (state.isSpinning) {
      // disable-copilot
      setTimeout(() => {
        if (state.result) {
          const won = hasWon(state.result);
          const balance = won ? state.balance + (betAmount * config.winMultiplier) : state.balance - betAmount;
          setState({
            ...state,
            isSpinning: false,
            balance,
          });
        }
      }, config.animationDuration);
    }
  }, [state.isSpinning])

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
            <Wallet balance={state.balance} />
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
