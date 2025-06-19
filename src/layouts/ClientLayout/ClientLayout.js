import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { Button, Container, Icon } from 'semantic-ui-react';

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
                <div className='client-layout__header'>
                    <Link to={`/client/${tableNumber}`}>
                        <h1>iCard</h1>
                    </Link>
                    <span>Mesa {tableNumber}</span>

                    <div>
                        <Button icon onClick={goToCart}>
                            <Icon name='shop' />
                        </Button>
                        <Button icon onClick={goToOrders}>
                            <Icon name='list' />
                        </Button>
                        <Button icon onClick={closeTable}>
                            <Icon name='sign-out' />
                        </Button>
                    </div>
                </div>
                <div className='client-layout__content'>
                    { children }
                </div>
            </Container>
        </div>
    )
}
