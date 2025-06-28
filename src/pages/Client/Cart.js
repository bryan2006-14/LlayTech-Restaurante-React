import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { size, map } from 'lodash';
import { Button, Loader, Checkbox } from 'semantic-ui-react';

import { useProduct } from '../../hooks';
import { getProductsCart } from '../../api/cart';
import { ListProductCart } from '../../components/Client';

import './Cart.scss';

export function Cart() {
  const [products, setProducts] = useState(null);
  const [reloadCart, setReloadCart] = useState(false);
  const [takeaway, setTakeaway] = useState(false); // NUEVO: estado para "para llevar"

  const { getProductById } = useProduct();
  const { tableNumber } = useParams();

  useEffect(() => {
    (async () => {
      const idProductsCart = getProductsCart();
      const productsArray = [];

      for await (const idProduct of idProductsCart) {
        const response = await getProductById(idProduct);
        // NUEVO: Ajusta el precio si es para llevar
        const updatedProduct = {
          ...response,
          price: takeaway
            ? parseFloat(response.price) + 1
            : parseFloat(response.price),
        };
        productsArray.push(updatedProduct);
      }

      setProducts(productsArray);
    })();
  }, [reloadCart, takeaway]); // Añade `takeaway` como dependencia

  const onReloadCart = () => setReloadCart((prev) => !prev);

  const handleTakeawayChange = (_, data) => {
    setTakeaway(data.checked);
  };

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h1>Tu Carrito</h1>

        <div style={{ marginBottom: '1rem' }}>
          <Checkbox
            label="¿Es para llevar? (+ S/ 1 por producto)"
            toggle
            checked={takeaway}
            onChange={handleTakeawayChange}
          />
        </div>

        {!products ? (
          <Loader active inline="centered">
            Cargando...
          </Loader>
        ) : size(products) < 1 ? (
          <>
            <p>No tienes productos en el carrito</p>
            <Link to={`/client/${tableNumber}/orders`}>
              <Button primary>Ver pedidos</Button>
            </Link>
          </>
        ) : (
          <ListProductCart products={products} onReloadCart={onReloadCart} />
        )}
      </div>
    </div>
  );
}
