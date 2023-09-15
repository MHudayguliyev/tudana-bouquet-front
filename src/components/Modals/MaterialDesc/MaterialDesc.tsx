import React, {useState, useEffect} from 'react'
import { useAppDispatch } from '@app/hooks/redux_hooks';
// own component library
import { Modal, TextArea, Button  } from '@app/compLibrary';
// redux 
import MaterialAction from '@redux/actions/MaterialAction'
//css
import styles from './MaterialDesc.module.scss'


type MaterialDescProps = {
    data: any
    show: boolean,
    setShow: Function
    translate: Function
}

const MaterialDesc = (props: MaterialDescProps) => {
    const {
        data,
        show,
        setShow,
        translate
    } = props

    const dispatch = useAppDispatch()

    const [value, setValue] = useState<string>(data?.ord_line_desc || '')
    
   useEffect(() => {
    if(data)
        setValue(data.ord_line_desc)
   }, [data])

  return (
    <>
        <Modal isOpen={show} close={() => setShow(false)} className={styles.modalContainer} 
        header={ 
            <div className={styles.title}>
                <span>{data?.mtrl_name}</span>/<span className={styles.attrName}>{data?.attribute_name}</span>
            </div>
        } 
        footer={
            <div className={styles.btnSave}>
                <Button rounded color='gray' onClick={() => {
                    setShow(false)
                }}>
                    {translate('cancel')}
                </Button>
                <Button rounded color='theme' onClick={() => {
                    dispatch(MaterialAction.setMtrlDesc(data,value));
                    setShow(false)
                }}>
                    {translate('confirm')}
                </Button>
            </div>
        }>
            <div className={styles.content}>
                <TextArea 
                    autoFocus
                    maxLength={9999} 
                    rows={20} 
                    placeholder={translate("note")} 
                    defaultValue={data?.ord_line_desc}
                    onChange={(e) => setValue(e.currentTarget.value)}
                />
        
            </div>
        </Modal>
    </>
  )
}

export default MaterialDesc