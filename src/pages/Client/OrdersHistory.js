import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { map, size, forEach } from 'lodash';

import { Button, Loader } from 'semantic-ui-react';

import { OrderHistoryItem } from '../../components/Client';
import { ModalConfirm } from '../../components/Common';
import { useOrder, useTable, usePayment } from '../../hooks';


export function OrdersHistory() {

    const [showTypePayment, setShowTypePayment] = useState(false);
    const [idTable, setIdTable] = useState(null);
    const [isRequestAccount, setIsRequestAccount] = useState(false);

    const { loading, orders, getOrdersByTable, addPaymentToOrder } = useOrder();
    const { getTableByNumber } = useTable();
    const { tableNumber } = useParams();
    const { createPayment, getPaymentByTable } = usePayment();

    useEffect(() => {
        
        (async() => {

            const table = await getTableByNumber(tableNumber);
            const idTableTemp = table[0].id;
            setIdTable(idTableTemp);

            getOrdersByTable(idTableTemp, '', 'ordering=-status, -created_at');;

        })();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        
        (async () => {

            if (idTable) {

                const response = await getPaymentByTable(idTable);
                setIsRequestAccount(response);
            }

        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idTable]);
    

    const onCreatePayment = async (paymentType) => {

        setShowTypePayment(false);

        let totalPayment = 0;
        forEach(orders, (order) => {
            totalPayment += Number(order.product_data.price);
        });

        const paymentData = {
            table: idTable,
            totalPayment: totalPayment.toFixed(2),
            paymentType,
            statusPayment: 'PENDING'
        }

        const payment = await createPayment(paymentData);

        for await (const order of orders) {
            await addPaymentToOrder(order.id, payment.id);
        }
        window.location.reload();
    }

    return (
        <div>
            <h1>Historial de pedidos</h1>

            {loading ? (
                <Loader active inline="centered">
                    Cargando...
                </Loader>
            ) : (
                <>
                    {size(orders) > 0 && (
                        <Button
                            // primary
                            color={size(isRequestAccount) === 0 ? 'blue' : 'red'}
                            fluid
                            onClick={() => size(isRequestAccount) === 0 && setShowTypePayment(true)}
                        >
                            {size(isRequestAccount) > 0
                                ? "La cuenta ya está pedida"
                                : "Pedir la cuenta"}
                        </Button>
                    )}
                    {map(orders, (order) => (
                        <OrderHistoryItem key={order.id} order={order} />
                    ))}
                </>
            )}

            <ModalConfirm
                title="Pagar con tarjeta o efectivo"
                show={showTypePayment}
                onCloseText="Tarjeta"
                onClose={() => onCreatePayment('CARD')}
                onConfirmText="Efectivo"
                onConfirm={() => onCreatePayment('CASH')}
            />
        </div>
    )
}
