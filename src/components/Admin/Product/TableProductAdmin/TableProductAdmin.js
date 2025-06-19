import React from 'react';
import { map } from 'lodash';

import { Button, Icon, Image, Table } from 'semantic-ui-react';

import './TableProductAdmin.scss';


export function TableProductAdmin(props) {

    const { products, updateProduct, deleteProduct } = props;

    return (
        <Table className='table-product-admin'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Imagen</Table.HeaderCell>
                    <Table.HeaderCell>Producto</Table.HeaderCell>
                    <Table.HeaderCell>Precio</Table.HeaderCell>
                    <Table.HeaderCell>Categoría</Table.HeaderCell>
                    <Table.HeaderCell>Activo</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                { map(products, (product, index) => (
                    <Table.Row key={index}>
                        <Table.Cell width={2}>
                            <Image src={product.image} />
                        </Table.Cell>
                        <Table.Cell>{product.title}</Table.Cell>
                        <Table.Cell>$ {product.price}</Table.Cell>
                        <Table.Cell>{product.category_data.title}</Table.Cell>
                        <Table.Cell>
                            { product.active
                                ? <Icon name='check' color='green' />
                                : <Icon name='close' color='red' />
                            }
                        </Table.Cell>
                        <Actions
                            product={product}
                            updateProduct={updateProduct}
                            deleteProduct={deleteProduct}
                        />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

function Actions(props) {

    const { product, updateProduct, deleteProduct } = props;

    return (
        <Table.Cell textAlign='right'>
            <Button icon onClick={() => updateProduct(product)}>
                <Icon name='pencil' />
            </Button>
            <Button icon negative onClick={() => deleteProduct(product)}>
                <Icon name='trash' />
            </Button>
        </Table.Cell>
    )
}
