import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { size } from 'lodash';
import classNames from 'classnames';

import { Label } from 'semantic-ui-react';

import './TableAdmin.scss';

import { ORDER_STATUS } from '../../../../utils/constants';
import { ReactComponent as IcTable } from '../../../../assets/table.svg';
import { getOrdersByTableApi } from '../../../../api/orders';
import { usePayment } from '../../../../hooks';


export function TableAdmin(props) {

    const { reload, table } = props;

    const [ orders, setOrders ] = useState([]);
    const [ tableBusy, setTableBusy ] = useState(false);
    const [ pendingPayment, setPendingPayment ] = useState(false);

    const { getPaymentByTable } = usePayment();

    useEffect(() => {
        
        (async () => {

            const response = await getOrdersByTableApi(table.id, ORDER_STATUS.PENDING);
            setOrders(response);
        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    useEffect(() => {
        
        (async () => {

            const response = await getOrdersByTableApi(table.id, ORDER_STATUS.DELIVERED);

            if (size(response) > 0) setTableBusy(response);
            else setTableBusy(false);

        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    useEffect(() => {

        (async() => {
            const response = await getPaymentByTable(table.id);
            if (size(response) > 0) setPendingPayment(true);
            else setPendingPayment(false);
        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);
    

    return (
        <Link className='table-admin' to={`/admin/table/${table.id}`}>
            { size(orders) > 0 ? (
                <Label circular color='red'>
                    { size(orders) }
                </Label>
            ): null}

            {pendingPayment && (
                <Label circular color='red'>
                    Cuenta
                </Label>
            )}

            <IcTable className={classNames({
                pending: size(orders) > 0,
                busy: tableBusy,
                "pending-payment": pendingPayment,
            })} />
            <h5>Mesa {table.number}</h5>
        </Link>
    )
}
