import React, { ChangeEvent, FC, KeyboardEvent, UIEvent } from 'react'
import styles from './InputNumber.module.scss'
import { Input, Paper } from '@app/compLibrary'


type InputNumber = {
    setInputNumberValue: Function
    inputNumberValue: string
    maxLength?: number
    id?: string
}

const InputNumber: FC<InputNumber> = (props): JSX.Element => {

    const {
        setInputNumberValue,
        inputNumberValue,
        maxLength = Infinity,
        id
    } = props;


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { value } = e.target

        if (value.length > maxLength) {
            setInputNumberValue(value.slice(0, maxLength));
        } else {
            setInputNumberValue(value);
        }
    }

    const handleWheel = (e: UIEvent<HTMLElement>) => {
        e.currentTarget.blur()
        e.stopPropagation()
        setTimeout(() => {
            e.currentTarget?.focus()
        }, 0)

    }

    return (
        <span className={styles.inputNumberWrapper}>
            <Paper rounded >
                <Input
                    type='number'
                    onKeyDown={(evt: KeyboardEvent<HTMLElement>) => {
                        if (+inputNumberValue === 0) {
                            if (evt.keyCode === 40) {
                                evt.preventDefault()
                            }
                        }
                        ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
                    }}
                    onChange={handleChange}
                    className={styles.inputNumberStyle}
                    value={inputNumberValue}
                    maxLength={maxLength}
                    id={id}
                    onWheel={handleWheel}
                />
            </Paper>
            <div className={styles.chevronButtonGroup}>
                <button
                    type='button'
                    className={styles.chevronUp}
                    onClick={() => {
                        if (String(inputNumberValue).length > maxLength) {
                            setInputNumberValue(String(inputNumberValue).slice(0, maxLength));
                        } else {
                            setInputNumberValue(String(+inputNumberValue + 1))
                        }
                    }}
                >
                    <i className='bx bx-chevron-up'></i>
                </button>
                <button
                    type='button'
                    className={styles.chevronDown}
                    onClick={() => {
                        if (+inputNumberValue === 0) {
                            return
                        }
                        setInputNumberValue(String(+inputNumberValue - 1))
                    }}
                >
                    <i className='bx bx-chevron-down'></i>
                </button>
            </div>
        </span>
    )
}

export default InputNumber