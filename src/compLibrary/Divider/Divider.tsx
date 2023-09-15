import React, {PropsWithChildren} from 'react'
import styles from './Divider.module.scss'

type DividerProps = {
    children: React.ReactNode
}

function Divider(props: PropsWithChildren<DividerProps>): JSX.Element {
    const { children } = props
    return (
        <div className={styles.divider}>{children}</div>
    )
}

export default Divider