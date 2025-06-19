import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { size } from 'lodash';

import { Button, Loader } from 'semantic-ui-react';

import { useProduct } from '../../hooks';
import { getProductsCart } from '../../api/cart';
import { ListProductCart } from '../../components/Client'


export function Cart() {

    const [products, setProducts] = useState(null);
    const [reloadCart, setReloadCart] = useState(false);

    const { getProductById } = useProduct();
    const { tableNumber } = useParams();

    useEffect(() => {
    
        (async () => {

            const idProductsCart = getProductsCart();

            const productsArray = [];
            for await (const idProduct of idProductsCart) {
                const response = await getProductById(idProduct);
                productsArray.push(response);
            }
            setProducts(productsArray);
            
        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCart]);

    const onReloadCart = () => setReloadCart((prev) => !prev);
    
    return (
        <div>
            <h1>Carrito</h1>
            {!products ? (
                <Loader active inline="centered">
                    Cargando...
                </Loader>
            ) : size(products) < 1 ? (
                <div style={{ textAlign: 'center' }}>
                    <p>No tienes productos en el carrito</p>
                    <Link to={`/client/${tableNumber}/orders`}>
                        <Button primary>Ver pedidos</Button>
                    </Link>
                </div>
                
            ) : (
                <ListProductCart products={products} onReloadCart={onReloadCart} />
            )}
        </div>
    )
}
