import React, { CSSProperties, useMemo } from 'react';
// types
import { Orders } from '@app/api/Types/queryReturnTypes';
// custom styles
import classNames from 'classnames/bind';
import styles from './A4Paper.module.scss';
import commonStyles from '../commonStyles.module.scss';
// queries
import { useQuery } from 'react-query';
import { getPrintData } from '@app/api/Queries/Getters';
import moment from 'moment';

// logo
import logo from '@app/assets/images/logo.png';
import { SizedBox } from '@app/compLibrary';

type A4PaperProps = {
    checkedOrders: Orders[],
    isDisplayPrintStyle?: boolean
}

const cx =  classNames.bind(styles)

const A4Paper = React.forwardRef<HTMLDivElement, A4PaperProps>((props, ref) => {

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
    const style1: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '22px',
        width: '100%'
    }
    const borderStyle: CSSProperties = {
        borderBottom: '1px solid gray'
    }
    const style2: CSSProperties = {
        width: '100%',
        fontSize: '14px'
    }
        return (
            <div ref={ref} className={commonStyles.sectionToPrint} style={{ margin: '0', padding: '2vh' }} >
                {data?.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div>
                                <div className={`${styles.top_div}`} >
                                    <img
                                        src={logo}
                                        alt="Tudana official logo"
                                        height="100%"
                                    />
                                    <div className={styles.top_div_firm_name}>
                                        <span className={styles.firm_name}>{item.firm_full_name}</span>
                                        <span>Sargyt fakturasy</span>
                                    </div>
                                    <span className={styles.top_div_ord_code}>
                                        {item.ord_code}
                                    </span>
                                </div>

                                <div className={styles.a4_header_div}>
                                    <div className={styles.first_column}>
                                        <span>Müşderi:</span>
                                        <span>Müşderi kody:</span>
                                        <span>Müşderi telefony:</span>
                                        <span>Ammar:</span>
                                        <span>Müşderi salgysy:</span>
                                        <span>Sargyt belligi:</span>
                                    </div>

                                    <div className={styles.second_column}>
                                        <div style={style1}>
                                            <div
                                                style={{ ...borderStyle, ...style2, width: "60%" }}
                                            >
                                                {item.client_full_name}
                                            </div>
                                            <div style={{ ...borderStyle, ...style2, display: 'flex', justifyContent: 'flex-end', }}>
                                                {moment(item.ord_delivery_date).format("LLL")}
                                            </div>
                                        </div>

                                        <div style={style1}>
                                            <div
                                                style={{ ...borderStyle, ...style2, width: "30%" }}
                                            >
                                                {item.client_code}
                                            </div>
                                        </div>

                                        <div style={style1}>
                                            <div style={{ ...borderStyle, ...style2 }}>{item.contact_telephone}</div>
                                        </div>

                                        <div style={style1}>
                                            <div style={{ ...borderStyle, ...style2 }}>{item.warehouse_name}</div>
                                        </div>

                                        <div style={style1}>
                                            <div style={{ ...borderStyle, ...style2 }}>{item.contact_address}</div>
                                        </div>

                                        <div style={style1}>
                                            <div style={{ ...borderStyle, ...style2 }}>{item.ord_desc}</div>
                                        </div>
                                    </div>
                                </div>

                                <table className={styles.custom_table}>
                                    <thead>
                                        <tr>
                                            <th>№</th>
                                            <th colSpan={2}>Haryt</th>
                                            <th>Mukdar</th>
                                            <th>
                                                Birlik <br />
                                                (baha)
                                            </th>
                                            <th>
                                                Jemi <br />
                                                (baha)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.products_data.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.mtr_name}</td>
                                                <td>SAN</td>
                                                <td>{data.ord_line_amount}</td>
                                                <td>{data.ord_line_price_value}</td>
                                                <td>{data.ord_line_nettotal}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td
                                                style={{ border: "none", textAlign: "right" }}
                                                colSpan={3}
                                            >
                                                Jemi (mukdar|tölenmeli):
                                            </td>
                                            <td>
                                                {item.products_data
                                                    .reduce((acc, dop) => {
                                                        return acc + Number(dop.ord_line_amount);
                                                    }, 0)
                                                    .toFixed(0)}
                                            </td>
                                            <td style={{ borderRight: "none" }}></td>
                                            <td style={{ borderLeft: "none" }}>
                                                {item.products_data
                                                    .reduce((acc, dop) => {
                                                        return acc + Number(dop.ord_line_nettotal);
                                                    }, 0)
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={styles.client_sign}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            columnGap: "5px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontStyle: "italic",
                                                fontWeight: "300",
                                                marginTop: "5px",
                                            }}
                                        >
                                            Müşderi (goly):
                                        </div>
                                        <div
                                            style={{
                                                borderBottom: "1px solid gray ",
                                                width: "75%",
                                                marginTop: "20px",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.pageBreak} />
                        </React.Fragment>
                    )
                })}
            </div>
        )
})

export default A4Paper;