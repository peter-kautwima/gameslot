import React, { ChangeEvent, FC, FormEvent } from "react";
import styles from "./bet-form.module.css";

type Props = {
  onChange: (event: FormEvent) => void;
};

const BetForm: FC<Props> = ({ onChange }) => {
  return (
    <input
      className={styles.root}
      type="number"
      name="bet"
      onChange={onChange}
      placeholder='Place bet'
    />
  );
};

export default BetForm;
