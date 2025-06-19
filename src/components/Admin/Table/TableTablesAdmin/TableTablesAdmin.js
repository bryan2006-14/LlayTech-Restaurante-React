import React, { useState } from 'react';
import { map } from 'lodash';
import QRCode from 'qrcode.react';

import { Table, Icon, Button } from 'semantic-ui-react';

import './TableTablesAdmin.scss';
import { ModalBasic } from '../../../Common';

export function TableTablesAdmin(props) {

    const { tables, updateTable, deleteTable } = props;

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);

    const openCloseModal = () => setShowModal((prev) => !prev);

    const showQR = (table) => {

        setContentModal(
            <div style={{ textAlign: 'center' }}>
                <QRCode value={`${window.location.origin}/client/${table.number}`} />
            </div>
        );

        openCloseModal();
    }

    return (
        <>
            <Table className='table-tables-admin'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Mesa número</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { map(tables, (table, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{table.number}</Table.Cell>
                            <Actions
                                table={table}
                                updateTable={updateTable}
                                deleteTable={deleteTable}
                                showQR={showQR}
                            />
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <ModalBasic
                show={showModal}
                onClose={openCloseModal}
                title="Código QR"
                size="mini"
                children={contentModal}
            />
        </>
    )
}

function Actions(props) {

    const { table, updateTable, deleteTable, showQR } = props;

    return (
        <Table.Cell textAlign='right'>
            <Button icon onClick={() => showQR(table)}>
                <Icon name='qrcode' />
            </Button>
            <Button icon onClick={() => updateTable(table)}>
                <Icon name='pencil' />
            </Button>
            <Button icon negative onClick={() => deleteTable(table)}>
                <Icon name='close' />
            </Button>
        </Table.Cell>
    )
}
