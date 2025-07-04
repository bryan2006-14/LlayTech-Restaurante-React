import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { size } from 'lodash';
import classNames from 'classnames';

import { Label } from 'semantic-ui-react';

import './TableAdmin.scss';

import { ORDER_STATUS } from '../../../../utils/constants';
import { ReactComponent as IcTable } from '../../../../assets/table.svg';
import { getOrdersByTableApi } from '../../../../api/orders';
import { usePayment } from '../../../../hooks';

// Sonido de notificación (puedes reemplazar la URL con tu propio sonido)
const notificationSound = new Audio('https://s33.aconvert.com/convert/p3r68-cdx67/w6h1d-nqrif.mp3');

export function TableAdmin(props) {
    const { reload, table } = props;
    const [orders, setOrders] = useState([]);
    const [tableBusy, setTableBusy] = useState(false);
    const [pendingPayment, setPendingPayment] = useState(false);
    const [newOrderNotification, setNewOrderNotification] = useState(false);
    const prevOrdersRef = useRef([]);

    const { getPaymentByTable } = usePayment();

    // Función para cargar los pedidos
    const loadOrders = async () => {
        try {
            const response = await getOrdersByTableApi(table.id, ORDER_STATUS.PENDING);
            setOrders(response);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    };

    // Efecto para cargar pedidos iniciales y cuando cambia 'reload'
    useEffect(() => {
        loadOrders();
        
        // Configurar intervalo para verificar nuevos pedidos cada 5 segundos
        const intervalId = setInterval(loadOrders, 5000);
        
        return () => clearInterval(intervalId);
    }, [reload, table.id]);

    // Efecto para detectar nuevos pedidos y reproducir sonido
    useEffect(() => {
        if (size(orders) > 0 && size(orders) !== size(prevOrdersRef.current)) {
            // Solo reproducir si hay más pedidos que antes
            if (size(orders) > size(prevOrdersRef.current)) {
                setNewOrderNotification(true);
                notificationSound.play().catch(e => console.log("No se pudo reproducir el sonido:", e));
                
                // Ocultar notificación después de 3 segundos
                setTimeout(() => setNewOrderNotification(false), 3000);
            }
        }
        prevOrdersRef.current = orders;
    }, [orders]);

    // Efecto para verificar estado de la mesa
    useEffect(() => {
        (async () => {
            const response = await getOrdersByTableApi(table.id, ORDER_STATUS.DELIVERED);
            setTableBusy(size(response) > 0);
        })();
    }, [reload, table.id]);

    // Efecto para verificar pagos pendientes
    useEffect(() => {
        (async() => {
            const response = await getPaymentByTable(table.id);
            setPendingPayment(size(response) > 0);
        })();
    }, [reload, table.id, getPaymentByTable]);
    
    return (
        <Link className='table-admin' to={`/admin/table/${table.id}`}>
            {size(orders) > 0 && (
                <Label circular color='red' className={newOrderNotification ? 'pulse' : ''}>
                    {size(orders)}
                </Label>
            )}

            {pendingPayment && (
                <Label circular color='orange'>
                    Cuenta
                </Label>
            )}

            <IcTable className={classNames({
                pending: size(orders) > 0,
                busy: tableBusy,
                "pending-payment": pendingPayment,
            })} />
            
            <h5>Mesa {table.number}</h5>
            
            {/* Notificación visual */}
            {newOrderNotification && (
                <div className="new-order-notification">
                    ¡Nuevo pedido!
                </div>
            )}
        </Link>
    );
}