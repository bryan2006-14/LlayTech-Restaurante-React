import React, { useEffect } from 'react';

import { Loader } from 'semantic-ui-react';

import { useCategory } from '../../hooks';
import { ListCategories } from '../../components/Client';


export function Categories() {

    const { loading, categories, getCategories } = useCategory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getCategories(), []);
    

    return (
        <div>
            {loading ? (
                <Loader active inline="centered">
                    Cargando...
                </Loader>
            ) : (
                <ListCategories categories={categories} />
            )}
        </div>
    )
}
