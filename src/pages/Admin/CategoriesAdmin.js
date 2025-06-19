import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Loader } from 'semantic-ui-react';

import { HeaderPage, TableCategoryAdmin, AddEditCategoryForm } from '../../components/Admin';
import { useCategory } from '../../hooks';
import { ModalBasic } from '../../components/Common';


export function CategoriesAdmin() {

    const [ showModal, setShowModal ] = useState(false);
    const [ titleModal, setTitleModal ] = useState(null);
    const [ contentModal, setContentModal ] = useState(null);
    const [ refetch, setRefetch ] = useState(false);

    const { loading, categories, getCategories, deleteCategory } = useCategory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getCategories(), [refetch]);

    const openCloseModal = () => setShowModal(prev => !prev);

    const onRefetch = () => setRefetch(prev => !prev);

    const addCategory = () => {

        setTitleModal('Nueva categoría');
        setContentModal(<AddEditCategoryForm onClose={openCloseModal} onRefetch={onRefetch} />);
        openCloseModal();
    }

    const updateCategory = (data) => {

        setTitleModal('Actualizar categoría');
        setContentModal(
            <AddEditCategoryForm
                onClose={openCloseModal}
                onRefetch={onRefetch}
                category={data}
            />
        );
        openCloseModal();
    }

    const onDeleteCategory = async (data) => {

        Swal.fire({
            title: `¿Eliminar categoría ${data.title}?`,
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
                    await deleteCategory(data.id);
                    onRefetch();
                    
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    return (
        <>
            <HeaderPage title="Categorías" btnTitle="Nueva categoría" btnClick={addCategory} />
            { loading ? (
                <Loader active inline='centered'>
                    Cargando...
                </Loader>
            ) : (
                <TableCategoryAdmin
                    categories={categories}
                    updateCategory={updateCategory}
                    deleteCategory={onDeleteCategory}
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
