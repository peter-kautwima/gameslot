import React, { ChangeEvent, FC, FormEvent, useEffect, useRef } from "react";
import styles from "./bet-form.module.css";

type Props = {
  onChange: (event: any) => void; // @todo any type
};

const BetForm: FC<Props> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus();
  }, [])
  
  return (
    <input
      ref={inputRef}
      className={styles.root}
      type="number"
      name="bet"
      onChange={onChange}
      placeholder='Place bet'
    />
  );
};

export default BetForm;
