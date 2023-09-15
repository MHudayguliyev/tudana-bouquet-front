import React from 'react'
import styles from './Card.module.scss'
import { FaUser, FaPhone, FaMapMarkedAlt } from 'react-icons/fa'
import { MdQrCode } from 'react-icons/md'
import { Accordion, Paper } from '@app/compLibrary'
import { useTranslation } from 'react-i18next';
import tuat from 'src/assets/images/tuat.png'
import {Preloader} from '@app/compLibrary'

export type ClientProps = {
    partner: any,
    onClickEdit: (guid: string) => void,
    bool: string

}

const CardGrid = (props: ClientProps) => {
    const { partner, onClickEdit, bool } = props
    const { t } = useTranslation()



    return (
        <>
            {
                partner ? <Paper rounded>
                <div className={styles.mainCard} >
                    <div className={styles.gridCardHeaderWrapper}>
                        <div className={styles.cardBody}>
                            <img src={tuat} alt="Client Avatar" width={75} height={75} />
                            <div className={styles.headerTxtWrapper} >
                                <h4 className={styles.fullName}>{partner.partner_full_name}</h4>
                                <i className={styles.clientBalance} style={{color: partner.partner_balance > 0 ? '#00953F' : partner.partner_balance < 0 ? '#E40050' : ''}} title='Client balance'>
                                    <span>{t('balance')}: {partner.partner_balance}</span>
                                </i>
                            </div>
                        </div>
                            <div className={styles.clientInfoGrid}>
                                <div className={styles.clientCode}>
                                    <span className={styles.iconContent}><MdQrCode /></span>
                                    <h4>{partner.partner_code}</h4>
                                </div>
                                <div className={styles.clientName}>
                                    <span className={styles.iconContent}><FaUser /></span> 
                                    <h4 className={styles.name}>{partner.partner_name}</h4>
                                </div>
                                <div className={styles.clientPhone}>
                                    <span className={styles.iconContent}><FaPhone /></span>
                                    <h4>+993 { partner.partner_telephone}</h4>       
                                </div>
                                <div className={styles.clientAddress}>
                                    <span className={styles.iconContent}><FaMapMarkedAlt/></span>
                                    <h4 className={styles.address}>{partner.partner_address}</h4>
                                </div>
                            </div>
                        </div>
    
                    <hr style={{ borderTop: '.0011px dashed silver', marginBottom: '5px'}} />
                    
                    {
                        <Accordion
                        showEndIcon
                        rightContent={
                            <span className={styles.accordionActionIcon} onClick={() => onClickEdit(partner.partner_guid)}>
                                <i className='bx bx-edit'></i>
                            </span>
                        }
                        >
                        {
                           <div className={styles.extrainfoGrid}>
                            {
                                partner.addition_telephones ? 
                                <div style={{display: 'flex', padding: '10px 0'}}>
                                    <span className={styles.iconContent}><FaPhone /></span>
                                    <h4 className={styles.phone}>+993 {partner.addition_telephones}</h4>
                                </div> : ''
                            }
                            {
                                partner.addition_addresses ? 
                                    <div style={{display: 'flex', padding: '10px 0'}}>
                                        <span className={styles.iconContent}><FaMapMarkedAlt/></span>
                                        <h4 className={styles.addr}>{partner.addition_addresses }</h4>
                                    </div> : ''
                            }
                            </div>
                        }
                    </Accordion>
                    }
                </div>
            </Paper> : <Preloader />
            }
        </>
    )
}

export default CardGrid