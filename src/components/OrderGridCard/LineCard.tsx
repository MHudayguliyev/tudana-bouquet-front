import React, { ReactNode, useState, useEffect } from "react";
import styles from "./LineCard.module.scss";
//comps 
import { Button, Col, Input, Row } from "@app/compLibrary";


interface CardProps {
    bodyData: any,
    headData?: any
    materials?: any[]
    setIdentityLabel?: Function,
    setShow?: Function,
    setDataForDeleting?: Function,
    renderBody?: (data: any, index: number) => ReactNode
}

const LineCard = (props: CardProps) => {
    const {
        bodyData, 
        headData,
        materials,
        setIdentityLabel,
        setShow,
        setDataForDeleting,
        renderBody,
    } = props

  return (
    <Row colGutter={10} rowGutter={10}>
        {bodyData && renderBody ? bodyData.map((item: any, index: number) => (
            <Col key={index} grid={{ xxlg: 6, xlg: 6, lg: 6, sm: 12 }}>
                {renderBody(item, index)}
            </Col>
        )):null}
    </Row>
  )
}

export default LineCard