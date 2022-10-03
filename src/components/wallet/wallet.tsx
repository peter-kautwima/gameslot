import React, { FC } from 'react'
import styles from './wallet.module.css'

type Props = {
  balance: number
}

const Wallet: FC<Props> = ({ balance }) => {
  return (
    <div className={styles.wallet}>
      Balance: &nbsp;
      {balance}
    </div>
  )
}

export default Wallet
