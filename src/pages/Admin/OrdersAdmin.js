import React, { useEffect } from 'react';

import { Loader } from 'semantic-ui-react';

import { HeaderPage, TableListAdmin } from '../../components/Admin';
import { useTable } from '../../hooks';


export function OrdersAdmin() {

    const { loading, tables, getTables } = useTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getTables(), []);
    
    return (
        <>
            <HeaderPage title='Restaurante' />

            { loading ? (
                <Loader active inline='centered'>
                    Cargando...
                </Loader>
            ) : (
                <TableListAdmin tables={tables} />
            )}
        </>
    )
}
