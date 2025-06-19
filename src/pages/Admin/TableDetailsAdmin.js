import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { forEach, size } from 'lodash';

import { Loader } from 'semantic-ui-react';

import { AddOrderForm, HeaderPage } from '../../components/Admin';
import { ModalBasic } from '../../components/Common';
import { ListOrderAdmin, PaymentDetail } from '../../components/Admin/TableDetails';
import { useOrder, usePayment, useTable } from '../../hooks';


export function TableDetailsAdmin() {

    const [ reloadOrders, setReloadOrders ] = useState(false);
    const [ paymentData, setPaymentData ] = useState(null);

    const { id } = useParams();

    const { loading, orders, getOrdersByTable, addPaymentToOrder } = useOrder();
    const { table, getTable } = useTable();
    const { createPayment, getPaymentByTable } = usePayment();

    const [ showModal, setShowModal ] = useState(false);

    useEffect(() => {
        
        getOrdersByTable(id, '', 'ordering=-status, created_at');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, reloadOrders]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getTable(id), [id]);

    useEffect(() => {
        
        (async() => {

            const response = await getPaymentByTable(id);
            if (size(response) > 0) setPaymentData(response[0]);
            
        })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadOrders]);
 
    const onReloadOrders = () => setReloadOrders(prev => !prev);
    
    const openCloseModal = () => setShowModal(prev => !prev);
    
    const onCreatePayment = async () => {
        
        Swal.fire({
            title: '¿Estas seguro de generar la cuenta de la mesa?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2185d0',
            cancelButtonColor: '#db2828',
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'No, cancelar'

        }).then((result) => {

            if (result.isConfirmed) {

                let totalPayment = 0;
                let paymentType = 'CARD';

                forEach(orders, (order) => {
                    totalPayment += Number(order.product_data.price)
                });

                Swal.fire({
                    title: 'Elija el medio de pago',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#21ba45',
                    cancelButtonColor: '#db2828',
                    confirmButtonText: 'Efectivo',
                    cancelButtonText: 'Tarjeta'

                }).then(async (result) => {

                    if (result.isConfirmed) {
                        paymentType = 'CASH'
                    }

                    const paymentData = {
                        table: id,
                        totalPayment: totalPayment.toFixed(2),
                        paymentType: paymentType,
                        statusPayment: 'PENDING'
                    };

                    const payment = await createPayment(paymentData);
    
                    for await (const order of orders) {
                        await addPaymentToOrder(order.id, payment.id);
                    }
                    onReloadOrders();
                });
                
            }
        })
    }

    return (
        <>
            <HeaderPage
                title={`Mesa ${table?.number || ''}`}
                btnTitle={paymentData ? 'Ver cuenta' : 'Añadir pedido'}
                btnClick={openCloseModal}
                btnTitleTwo={!paymentData ? "Generar cuenta" : null}
                btnClickTwo={onCreatePayment}
            />

            { loading ? (
                <Loader active inline='centered'>
                    Cargando...
                </Loader>
            ) : (
                <ListOrderAdmin orders={orders} onReloadOrders={onReloadOrders} />
            )}

            <ModalBasic
                show={showModal}
                onClose={openCloseModal}
                title='Generar pedido'
            >
                {paymentData ? (
                    <PaymentDetail
                        payment={paymentData}
                        orders={orders}
                        openCloseModal={openCloseModal}
                        onReloadOrders={onReloadOrders}
                    />
                ) : (
                    <AddOrderForm
                        idTable={id}
                        openCloseModal={openCloseModal}
                        onReloadOrders={onReloadOrders}
                    />
                )}
            </ModalBasic>
        </>
    )
}
