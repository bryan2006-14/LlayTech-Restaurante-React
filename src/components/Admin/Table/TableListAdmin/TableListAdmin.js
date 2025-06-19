import React, { useEffect, useState } from 'react';
import { map } from 'lodash';

import { Button, Icon, Checkbox } from 'semantic-ui-react';

import './TableListAdmin.scss';
import { TableAdmin } from '../';


export function TableListAdmin(props) {

    const { tables } = props;

    const [ reload, setReload ] = useState(false);
    const [ autoReload, setAutoReload ] = useState(false);

    const onReload = () => setReload(prev => !prev);

    useEffect(() => {
        
        if (autoReload) {

            // función recursiva
            const autoReloadAction = () => {
                onReload();

                setTimeout(() => {
                    autoReloadAction();
                }, 5000);
            }

            autoReloadAction();
        }

    }, [autoReload]);

    const onCheckAutoReload = (check) => {
        if (check) {
            setAutoReload(true);
        } else {
            window.location.reload();
        }
    }

    return (
        <div className='table-list-admin'>
            <Button
                primary
                icon
                className='table-list-admin__reload'
                onClick={onReload}
            >
                <Icon name='refresh' />
            </Button>

            <div className='table-list-admin__reload-toggle'>
                <span>Reload automático</span>
                <Checkbox
                    toggle
                    checked={autoReload}
                    onChange={(_, data) => onCheckAutoReload(data.checked)}
                />
            </div>

            { map(tables, (table) => (
                <TableAdmin
                    key={table.number}
                    table={table}
                    reload={reload}
                />
            ))}
        </div>
    )
}
