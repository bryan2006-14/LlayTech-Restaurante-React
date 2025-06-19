import React, { useCallback, useEffect, useState } from 'react';
import { map } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Form, Image, Button, Dropdown, Checkbox } from 'semantic-ui-react';

import './AddEditProductForm.scss';
import { useCategory, useProduct } from '../../../../hooks';


export function AddEditProductForm(props) {

    const { onClose, onRefetch, product } = props;

    const [ categoriesFormat, setCategoriesFormat ] = useState([]);
    const [ previewImage, setPreviewImage ] = useState(product ? product?.image : null);

    const { categories, getCategories } = useCategory();
    const { addProduct, updateProduct } = useProduct();

    const formik = useFormik({
        initialValues: initialValues(product),
        validationSchema: Yup.object(product ? updateValidationSchema() : newValidationSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {

            if (product) await updateProduct(product.id, formValue);
            else await addProduct(formValue);

            onRefetch();
            onClose();
        }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getCategories(), []);

    useEffect(() => {
        setCategoriesFormat(formatDropdownData(categories));
    }, [categories]);

    const onDrop = useCallback(async (acceptedFile) => {

        const file = acceptedFile[0];
        await formik.setFieldValue('image', file);
        setPreviewImage(URL.createObjectURL(file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getInputProps, getRootProps } = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        multiple: false,
        onDrop
    });

    return (
        <Form className='add-edit-product-form' onSubmit={formik.handleSubmit}>
            <Form.Input
                name='title'
                placeholder='Nombre del producto'
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.errors.title}
            />
            <Form.Input
                type='number'
                name='price'
                placeholder='Precio del producto'
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.errors.price}
            />
            <Dropdown
                placeholder='Categoría del producto'
                fluid
                selection
                search
                options={categoriesFormat}
                value={formik.values.category}
                onChange={(_, data) => formik.setFieldValue('category', data.value)}
                error={formik.errors.category ? true : false}
            />

            { formik.errors.category && (
                <div className='ui pointing above prompt label' role="alert" aria-atomic="true">
                    {formik.errors.category}
                </div>
            )}

            <div className='add-edit-product-form__active'>
                <Checkbox
                    toggle
                    checked={formik.values.active}
                    onChange={(_, data) => formik.setFieldValue('active', data.checked)}
                /> Producto activo
            </div>

            <Button type='button' fluid {...getRootProps()} color={formik.errors.image && 'red'}>
                {previewImage ? 'Cambiar imagen' : 'Subir imagen'}
            </Button>

            { formik.errors.image && (
                <div className='ui pointing above prompt label' role="alert" aria-atomic="true">
                    {formik.errors.image}
                </div>
            )}

            <input {...getInputProps()} />
            <Image src={previewImage} fluid />

            <Button type='submit' primary fluid>
                { product ? 'Actualizar' : 'Crear' }
            </Button>
        </Form>
    )
}

function formatDropdownData(data) {

    return map(data, (item) => ({
        key: item.id,
        text: item.title,
        value: item.id
    }));
}

function initialValues(data) {

    return {
        title: data?.title || '',
        price: data?.price || '',
        category: data?.category || '',
        image: '',
        active: data?.active ? true : false
    }
}

function newValidationSchema() {

    return {
        title: Yup.string().required('El nombre del producto es obligatorio'),
        price: Yup.number().required('El precio del producto es obligatorio'),
        category: Yup.number().required('La categoría del producto es obligatoria'),
        active: Yup.boolean().required(true),
        image: Yup.string().required('La imagen del producto es obligatoria'),
    }
}

function updateValidationSchema() {

    return {
        title: Yup.string().required('El nombre del producto es obligatorio'),
        price: Yup.number().required('El precio del producto es obligatorio'),
        category: Yup.number().required('La categoría del producto es obligatoria'),
        active: Yup.boolean().required(true),
        image: Yup.string(),
    }
}
