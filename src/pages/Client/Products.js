import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Loader } from 'semantic-ui-react';

import { useProduct } from '../../hooks';
import { ListProducts } from '../../components/Client';


export function Products() {

    const { tableNumber, idCategory } = useParams();
    const { loading, products, getProductsByCategory } = useProduct();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getProductsByCategory(idCategory), [idCategory]);

    return (
        <div>
            <Link to={`/client/${tableNumber}`}>Volver a categorías</Link>

            {loading ? (
                <Loader active inline="centered">
                    Cargando...
                </Loader>
            ) : (
                <ListProducts products={products} />
            )}
        </div>
    )
}
