import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Loader } from 'semantic-ui-react';

import { AddEditProductForm, HeaderPage, TableProductAdmin } from '../../components/Admin';
import { ModalBasic } from '../../components/Common';
import { useProduct } from '../../hooks';

export function ProductsAdmin() {

    const [ showModal, setShowModal ] = useState(false);
    const [ titleModal, setTitleModal ] = useState(null);
    const [ contentModal, setContentModal ] = useState(null);
    const [ refetch, setRefetch ] = useState(false);

    const { loading, products, getProducts, deleteProduct } = useProduct();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getProducts(), [refetch]);

    const openCloseModal = () => setShowModal(prev => !prev);

    const onRefetch = () => setRefetch(prev => !prev);

    const addProduct = () => {
        setTitleModal('Nuevo producto');
        setContentModal(<AddEditProductForm onClose={openCloseModal} onRefetch={onRefetch} />);
        openCloseModal();
    }

    const updateProduct = (data) => {
        setTitleModal('Actualizar producto');
        setContentModal(
            <AddEditProductForm
                onClose={openCloseModal}
                onRefetch={onRefetch}
                product={data}
            />
        );
        openCloseModal();
    }

    const onDeleteProduct = async (data) => {

        Swal.fire({
            title: `¿Eliminar producto ${data.title}?`,
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
                    await deleteProduct(data.id);
                    onRefetch();
                    
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    return (
        <>
            <HeaderPage title='Productos' btnTitle='Nuevo producto' btnClick={addProduct} />

            { loading ? (
                <Loader active inline='centered'>
                    Cargando...
                </Loader>
            ) : (
                <TableProductAdmin
                    products={products}
                    updateProduct={updateProduct}
                    deleteProduct={onDeleteProduct}
                />
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
