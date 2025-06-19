import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Form, Image, Button } from 'semantic-ui-react';

import './AddEditCategoryForm.scss';
import { useCategory } from '../../../../hooks';


export function AddEditCategoryForm(props) {

    const { category, onClose, onRefetch } = props;

    const [ previewImage, setPreviewImage ] = useState(category?.image || null);

    const { addCategory, updateCategory } = useCategory();

    const formik = useFormik({
        initialValues: initialValues(category),
        validationSchema: Yup.object(category ? updateValidationSchema() : newValidationSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {

                if (category) await updateCategory(category.id, formValue);
                else await addCategory(formValue);

                onRefetch();
                onClose();

            } catch (error) {
                console.log(error);
            }
        }
    })

    const onDrop = useCallback(async (acceptedFile) => {
        const file = acceptedFile[0];
        await formik.setFieldValue('image', file);
        setPreviewImage(URL.createObjectURL(file));
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        multiple: false,
        onDrop
    });

    return (
        <Form className='add-edit-category-form' onSubmit={formik.handleSubmit}>
            <Form.Input
                name='title'
                placeholder='Nombre de la categoría'
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.errors.title}
            />

            <Button type='button' fluid { ...getRootProps() } color={formik.errors.image && 'red'}>
                {previewImage ? 'Cambiar imagen' : 'Subir imagen'}
            </Button>
            <input { ...getInputProps() } />
            <Image src={previewImage} fluid />

            <Button type='submit' primary fluid content={category ? 'Actualizar' : 'Crear'} />
        </Form>
    )
}

function initialValues(data) {
    return {
        title: data?.title || '',
        image: '',
    }
}

function newValidationSchema() {
    return {
        title: Yup.string().required('El nombre de la categoría es obligatorio'),
        image: Yup.string().required('La imagen de la categoría es obligatoria')
    }
}

function updateValidationSchema() {
    return {
        title: Yup.string().required('El nombre de la categoría es obligatorio'),
        image: Yup.string(),
    }
}
