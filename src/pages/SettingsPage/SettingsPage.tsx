import React, { useEffect, useState } from 'react'
import styles from './SettingsPage.module.scss'

import InputNumber from '@app/components/InputNumber/InputNumber'

const SettingsPage = () => {
  const [inputNumberValue, setInputNumberValue] = useState<number | string>("")
  const [fileData, setFileData] = useState<File>()
  useEffect(() => {
    console.log('inputNumberValue: ', inputNumberValue)
  }, [inputNumberValue])


  


  return (
    <div>
      <InputNumber
        setInputNumberValue={setInputNumberValue}
        inputNumberValue={inputNumberValue}
        maxLength={5}
      />
    </div>
  )
}

export default SettingsPage