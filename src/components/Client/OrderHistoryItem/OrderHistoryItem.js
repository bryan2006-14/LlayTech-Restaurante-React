import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/es';

import { Image } from 'semantic-ui-react';

import './OrderHistoryItem.scss';
import { ORDER_STATUS } from '../../../utils/constants';


export function OrderHistoryItem(props) {

    const { order } = props;
    const { title, image } = order.product_data;

    return (
        <div className={classNames('order-history-item', {
            [order.status.toLowerCase()]: true
        })}>
            <div className='order-history-item__time'>
                <span>
                    Pedido {moment(order.created_at).startOf('second').fromNow()}
                </span>
            </div>

            <div className='order-history-item__product'>
                <Image src={image} size='tiny' />
                <p>{title}</p>
            </div>

            {order.status === ORDER_STATUS.PENDING ? (
                <span style={{ color: 'orange'}}>En marcha</span>
            ) : <span style={{ color: 'green'}}>Entregado</span>}
        </div>
    )
}
