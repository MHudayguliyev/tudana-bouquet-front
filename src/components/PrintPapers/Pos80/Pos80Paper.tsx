import React, { useMemo } from 'react';
// types
import { Orders } from '@app/api/Types/queryReturnTypes';
// custom styles
import styles from './Pos80Paper.module.scss';
import commonStyles from '../commonStyles.module.scss';
import { useQuery } from 'react-query';
import { getPrintData } from '@app/api/Queries/Getters';

// logo
import logo from '@app/assets/images/logo.png';
import moment from 'moment';

type Pos80Props = {
    checkedOrders: Orders[],
    isDisplayPrintStyle?: boolean
}

const Pos80Paper = React.forwardRef<HTMLDivElement, Pos80Props>((props, ref) => {

    const {
        checkedOrders,
        isDisplayPrintStyle
    } = props;
    const clientGuids = useMemo(() => {
        return checkedOrders.map(item => item.client_guid)
    }, [checkedOrders])
    const orderGuids = useMemo(() => {
        return checkedOrders.map(item => item.ord_guid)
    }, [checkedOrders])

    // queries
    const {
        isLoading,
        isError,
        data
    } = useQuery(
        ['dataForPrint', clientGuids, orderGuids],
        () => getPrintData(clientGuids, orderGuids),
        { enabled: !!clientGuids[0] && !!orderGuids[0] }
    )
        return (
            <div ref={ref} className={`${commonStyles.sectionToPrint} ${styles.pos_main}`}>
            {
                data?.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.pos_header} >
                            <div className={styles.bootstrapDflex} >
                                <img src={logo} alt="Tudana logo" className={styles.logo_img} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className={styles.fst_italic}> {item.firm_full_name}</span>
                                    <span> Sargyt fakturasy</span>
                                </div>
                            </div>




                            <table className={styles.pos_header_table} >
                                <tbody>
                                    <tr>
                                        <td className={styles.spec_td}>Faktura №:</td>
                                        <td>{item.ord_code}</td>
                                        <td style={{ textAlign: 'right' }}>{moment(item.ord_delivery_date).format('LLL')}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Müşderi:</td>
                                        <td>{item.client_full_name}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Müşderi kody:</td>
                                        <td>{item.client_code}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Müşderi telefony:</td>
                                        <td>{item.contact_telephone}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Ammar:</td>
                                        <td> {item.warehouse_name} </td>

                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Müşderi salgysy:</td>
                                        <td>{item.contact_address}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.spec_td}>Bellik:</td>
                                        <td>{item.ord_desc}</td>
                                    </tr>
                                </tbody>
                            </table>


                            <table className={styles.custom_table} style={{ marginTop: '15px' }} >
                                <thead style={{ fontSize: '9px' }} >
                                    <tr>
                                        <th>Haryt ({item.products_data.length} sany)</th>
                                        <th>Mukdar</th>
                                        <th>Birlik<br />(baha)</th>
                                        <th>Jemi<br />(baha)</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: '9px' }} >
                                    {
                                        item.products_data.map((data, index) => (
                                            <tr className={styles.custom_tr} key={index}>
                                                <td className={styles.fst_italic}>{data.mtr_name}</td>
                                                <td>{data.ord_line_amount}</td>
                                                <td>{data.ord_line_price_value}</td>
                                                <td>{data.ord_line_nettotal}</td>
                                            </tr>
                                        ))
                                    }

                                    <tr>
                                        <td style={{ border: 'none', textAlign: 'right' }} >Jemi (mukdar|tölenmeli):</td>
                                        <td >
                                            {
                                                item.products_data.reduce((acc, dop) => {
                                                    return acc + Number(dop.ord_line_amount);
                                                }, 0).toFixed(0)
                                            }
                                        </td>
                                        <td style={{ borderRight: 'none' }} ></td>
                                        <td style={{ borderLeft: 'none ' }} >{
                                            item.products_data.reduce((acc, dop) => {
                                                return acc + Number(dop.ord_line_nettotal);
                                            }, 0).toFixed(2)
                                        }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                            <div className={styles.client_sign} style={{ fontSize: '9px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                    <div style={{ fontStyle: 'italic', fontWeight: '300', marginTop: '5px' }}>Müşderi (goly):</div>
                                    <div style={{ borderBottom: '1px solid gray ', width: '75%', marginTop: '20px' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.pageBreak}></div>
                    </React.Fragment>
                ))
            }
        </div>
        )
})

export default Pos80Paper;