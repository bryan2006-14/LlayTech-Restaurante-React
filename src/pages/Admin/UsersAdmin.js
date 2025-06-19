import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { Loader } from 'semantic-ui-react';

import { useUser } from '../../hooks';
import { AddEditUserForm, HeaderPage, TableUsers } from '../../components/Admin';
import { ModalBasic } from '../../components/Common';


export function UsersAdmin() {

    const [ showModal, setShowModal ] = useState(false);
    const [ titleModal, setTitleModal ] = useState(null);
    const [ contentModal, setContentModal ] = useState(null);
    const [ refetch, setRefetch ] = useState(false);

    const { loading, users, getUsers, deleteUser } = useUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getUsers(), [refetch]);

    const openCloseModal = () => setShowModal((prevState) => !prevState);
    
    const onRefetch = () => setRefetch((prevState) => !prevState);

    const addUser = () => {
        setTitleModal('Nuevo usuario');
        setContentModal(<AddEditUserForm onClose={openCloseModal} onRefetch={onRefetch} />);
        openCloseModal();
    }

    const updateUser = (data) => {
        setTitleModal('Actualizar usuario');
        setContentModal(<AddEditUserForm onClose={openCloseModal} onRefetch={onRefetch} user={data} />);
        openCloseModal();
    }

    const onDeleteUser = async (data) => {

        Swal.fire({
            title: `¿Eliminar usuario ${data.email}?`,
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
                    await deleteUser(data.id);
                    onRefetch();
                    
                } catch (error) {
                    console.error(error);
                }
            }
        });

        // const result = window.confirm(`¿Eliminar usuario ${data.email}?`);

        // if (result) {

        //     try {
        //         // console.log('Usuario eliminado');
        //         await deleteUser(data.id);
        //         onRefetch();
                
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    }

    return (
        <>
            <HeaderPage
                title='Usuarios'
                btnTitle='Nuevo usuario'
                btnClick={addUser}
            />

            { loading ? (
                <Loader active inline="centered">
                    Cargando...
                </Loader>
            ) : (
                <TableUsers
                    users={users}
                    updateUser={updateUser}
                    onDeleteUser={onDeleteUser}
                />
            )}

            <ModalBasic
                show={ showModal }
                onClose={ openCloseModal }
                title={ titleModal }
                children={ contentModal } />
        </>
    )
}
