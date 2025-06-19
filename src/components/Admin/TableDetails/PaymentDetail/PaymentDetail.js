import React from 'react';
import Swal from 'sweetalert2';

import { Button, Icon, Table } from 'semantic-ui-react';

import './PaymentDetail.scss';
import { usePayment, useOrder } from '../../../../hooks';


export function PaymentDetail(props) {

    const {
        payment,
        orders,
        openCloseModal,
        onReloadOrders
    } = props;

    const { closePayment } = usePayment();
    const { closeOrder } = useOrder();

    const getIconPayment = (key) => {

        if (key === 'CARD') return "credit card alternative";
        if (key === 'CASH') return "money bill alternate";
        return null;
    }

    const onCloseTable = async () => {

        Swal.fire({
            title: '¿Cerrar mesa para nuevos clientes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2185d0',
            cancelButtonColor: '#db2828',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'No, cancelar'

        }).then(async (result) => {

            if (result.isConfirmed) await closePayment(payment.id);

            for await (const order of orders) {
                await closeOrder(order.id);
            }

            onReloadOrders();
            openCloseModal();
        });
    }

    return (
        <div className='payment-detail'>
            <Table striped>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Mesa:</Table.Cell>
                        <Table.Cell>{payment.table_data.number}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Total:</Table.Cell>
                        <Table.Cell>$ {payment.totalPayment}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Forma de pago:</Table.Cell>
                        <Table.Cell>
                            <Icon size='large' name={getIconPayment(payment.paymentType)} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <Button primary fluid onClick={onCloseTable}>
                Marcar como pagado y cerrar mesa
            </Button>
        </div>
    )
}
