import React, {useEffect} from 'react'
import { FaUser, FaPhone, FaMapMarkedAlt } from 'react-icons/fa'
import { useMatch } from '@tanstack/react-location'
import { MdQrCode } from 'react-icons/md'
import { Accordion, Paper } from '@app/compLibrary'
import { useTranslation } from 'react-i18next';
import tuat from 'src/assets/images/tuat.png'
/// css
import styles from './Card.module.scss'
import classNames from 'classnames/bind';
import {Preloader} from '@app/compLibrary'


export type ClientProps = {
    partner: any,
    onClickEdit: (guid: string) => void,
    onClickSelect: (guid: any) => void,
    className?: string,
    bool?: string,
    id?: number,
    guid?: string
}


const CardList = (props: ClientProps) => {
    const { partner, onClickEdit, onClickSelect, bool, className, guid} = props
    const match = useMatch()
    const { t } = useTranslation()
    const cx = classNames.bind(styles)



    return (
        <>
            {
                partner ? <Paper rounded style={{margin: '10px 0', cursor: 'pointer', }}  className={cx({
                    isSelected: guid == partner.partner_guid
                })}>
                    <div className={styles.mainCard}>
                        <div className={styles.listCardHeaderWrappper} onClick={() => onClickSelect(partner.partner_guid)}>
                            <div className={styles.listCardBody}>
                                <img src={tuat} alt="Client Avatar" width={75} height={75}  className={styles.imgWrapper}/>
                                <div className={styles.headerWrapper}>
                                    <h4 className={styles.fName}>{partner.partner_full_name}</h4>
                                    <i className={styles.clientBalance} style={{color: partner.partner_balance > 0 ? '#00953F' : partner.partner_balance < 0 ? '#E40050' : ''}} title='Client balance'>
                                        <span>{t('balance')}: {partner.partner_balans}</span>
                                    </i>
                                    <div className={styles.clientCode2}>
                                        <span className={styles.iconContent}><MdQrCode /></span>
                                        <h4>{partner.partner_code}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.clientInfoList2}>
                                <template className={styles.clientCode}>
                                    <span className={styles.iconContent}><MdQrCode /></span>
                                    <h4>{partner.partner_code}</h4>
                                </template>
                                <template className={styles.clientName}>
                                    <span className={styles.iconContent}><FaPhone /></span> 
                                    <h4 className={styles.name}>{partner.partner_telephone}</h4>
                                </template>
                            </div>
                            <div className={styles.clientInfoList} >
                                <div className={styles.clientPhone}>
                                    <span className={styles.iconContent}><FaUser /></span>
                                    <h4 className={styles.ellipsPhone}>{partner.partner_name}</h4>       
                                </div>
                                <div className={styles.clientName2}>
                                    <span className={styles.iconContent}><FaPhone /></span> 
                                    <h4 className={styles.name}>{partner.partner_telephone}</h4>
                                </div>
                                <div className={styles.clientAddress}>
                                    <span className={styles.iconContent}><FaMapMarkedAlt/></span>
                                    <h4 className={styles.addr}>{partner.partner_address}</h4>
                                </div>
                            </div>
                        </div>
        
                        <hr style={{ borderTop: '.0011px dashed silver', marginBottom: '5px'}} />
                        
                        {
                            <Accordion
                            showEndIcon
                            rightContent={
                                match.pathname == '/contacts' ? 
                                <span className={styles.accordionActionIcon} onClick={() => onClickEdit(partner.partner_guid)}>
                                <i className='bx bx-edit' ></i>
                            </span> : null
                            }
                        >
                            {
                               <div className={styles.extraInfoList}>
                                {
                                    partner.addition_telephones ?
                                    <div style={{ backgroundColor: 'transparent', width: '33.3%' }}>
                                        <div style={{display: 'flex', padding: '10px 0'}}>
                                            <span className={styles.iconContent}><FaPhone /></span>
                                            <h4 className={styles.phone}>{partner.addition_telephones}</h4>
                                        </div>
                                    </div> : ''
                                }
                                {
                                    partner.addition_addresses ? 
                                    <div style={{ backgroundColor: 'transparent', width: '66.7%' }}>
                                        <div style={{display: 'flex', padding: '10px 0'}}>
                                            {partner.addition_addresses ? <span className={styles.iconContent}><FaMapMarkedAlt/></span> : ''}
                                            <h4 className={styles.addr}>{partner.addition_addresses }</h4>
                                        </div>
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

export default CardList