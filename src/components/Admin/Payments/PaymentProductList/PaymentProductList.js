import React, { useEffect, useState } from 'react';
import { map } from 'lodash';

import { Image, Table } from 'semantic-ui-react';

import './PaymentProductList.scss';
import { useOrder } from '../../../../hooks';


export function PaymentProductList(props) {

    const { payment } = props;

    const [orders, setOrders] = useState([]);
    const { getOrdersByPayment } = useOrder();

    useEffect(() => {
        (async () => {
            const response = await getOrdersByPayment(payment.id);
            setOrders(response);

        })();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div className='payment-product-list'>
            <Table striped>
                <Table.Body>
                    { map(orders, (order) => (
                        <Table.Row key={order.id}>
                            <Table.Cell>
                                <Image src={order.product_data.image} avatar size='tiny' />
                            </Table.Cell>
                            <Table.Cell>{order.product_data.title}</Table.Cell>
                            <Table.Cell textAlign='right'>$ {order.product_data.price}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
        // <div className='payment-product-list'>
        //     { map(orders, (order) => (
        //         <div className='payment-product-list__product' key={order.id}>
        //             <div>
        //                 <Image src={order.product_data.image} avatar size='tiny' />
        //                 <span>{order.product_data.title}</span>
        //             </div>
        //             <span>$ {order.product_data.price}</span>
        //         </div>
        //     ))}
        // </div>
    )
}
