import React from 'react';

import { Message } from 'semantic-ui-react';
import './Error404.scss';

export const Error404 = () => {
    return (
        <div className='content-error404'>
            <Message
                icon='warning sign'
                header='Error 404'
                content='No se encontró la página'
                negative
                size='large'
            />
        </div>
    )
}
