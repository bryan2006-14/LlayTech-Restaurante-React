import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Form, Button } from 'semantic-ui-react';

import './AddEditTableForm.scss';
import { useTable } from '../../../../hooks';


export function AddEditTableForm(props) {

    const { onClose, onRefetch, table } = props;

    const { addTable, updateTable } = useTable();

    const formik = useFormik({
        initialValues: initialValues(table),
        validationSchema: Yup.object(validationSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            
            if (table) await updateTable(table.id, formValue);
            else await addTable(formValue);

            onRefetch();
            onClose();
        }
    });
    
    return (
        <Form className='add-edit-table-form' onSubmit={formik.handleSubmit}>
            <Form.Input
                type='number'
                name='number'
                placeholder='Número de la mesa'
                value={formik.values.number}
                onChange={formik.handleChange}
                error={formik.errors.number}
            />

            <Button type='submit' primary fluid content={ table ? 'Actualizar' : 'Crear' } />
        </Form>
    )
}

function initialValues(data) {
    return {
        number: data?.number || ''
    }
}

function validationSchema() {
    return {
        number: Yup.number().required('El número de la mesa es obligatorio')
    }
}
