import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Container, Icon, Popup } from 'semantic-ui-react';

import './ClientLayout.scss';
import { useTable } from '../../hooks';

export function ClientLayout(props) {
    const { children } = props;
    const { isExistTable } = useTable();
    const { tableNumber } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const exist = await isExistTable(tableNumber);
            if (!exist) closeTable();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableNumber]);

    const closeTable = () => navigate('/');
    const goToCart = () => navigate(`/client/${tableNumber}/cart`);
    const goToOrders = () => navigate(`/client/${tableNumber}/orders`);

    return (
        <div className='client-layout-bg'>
            <Container className='client-layout'>
                <header className='client-layout__header'>
                    <Link to={`/client/${tableNumber}`} className='logo'>
                        <h1>Rinconcito Vallejano 🍽️</h1>
                    </Link>
                    <span className='table-number'>Mesa {tableNumber}</span>
                    <div className='nav-buttons'>
                        <Popup content='Ver carrito' trigger={
                            <Button icon color='teal' onClick={goToCart}>
                                <Icon name='shop' />
                            </Button>
                        } />
                        <Popup content='Mis pedidos' trigger={
                            <Button icon color='blue' onClick={goToOrders}>
                                <Icon name='list' />
                            </Button>
                        } />
                        <Popup content='Salir' trigger={
                            <Button icon color='red' onClick={closeTable}>
                                <Icon name='sign-out' />
                            </Button>
                        } />
                    </div>
                </header>
                <main className='client-layout__content'>
                    {children}
                </main>
            </Container>
        </div>
    );
}
