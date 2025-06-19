import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Loader } from 'semantic-ui-react';

import { HeaderPage, TableTablesAdmin, AddEditTableForm } from '../../components/Admin';
import { ModalBasic } from '../../components/Common';
import { useTable } from '../../hooks';


export function TablesAdmin() {

    const [ showModal, setShowModal ] = useState(false);
    const [ titleModal, setTitleModal ] = useState(null);
    const [ contentModal, setContentModal ] = useState(null);
    const [ refetch, setRefetch ] = useState(false);

    const { loading, tables, getTables, deleteTable } = useTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getTables(), [refetch]);

    const openCloseModal = () => setShowModal(prev => !prev);

    const onRefetch = () => setRefetch(prev => !prev);

    const addTable = () => {
        setTitleModal('Nueva mesa');
        setContentModal(<AddEditTableForm onClose={openCloseModal} onRefetch={onRefetch} />);
        openCloseModal();
    }

    const updateTable = (data) => {
        setTitleModal('Actualizar mesa');
        setContentModal(
            <AddEditTableForm
                onClose={openCloseModal}
                onRefetch={onRefetch}
                table={data}
            />
        );
        openCloseModal();
    }

    const onDeleteTable = async (data) => {

        Swal.fire({
            title: `¿Eliminar mesa ${data.number}?`,
            text: "No podrá revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2185d0',
            cancelButtonColor: '#db2828',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    await deleteTable(data.id);
                    onRefetch();
                    
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    return (
        <>
            <HeaderPage title='Mesas' btnTitle='Nueva mesa' btnClick={addTable} />

            { loading ? (
                <Loader active inline='centered'>
                    Cargando...
                </Loader>
            ) : (
                <TableTablesAdmin tables={tables} updateTable={updateTable} deleteTable={onDeleteTable} />
            )}

            <ModalBasic
                show={showModal}
                onClose={openCloseModal}
                title={titleModal}
                children={contentModal}
            />
        </>
    )
}
