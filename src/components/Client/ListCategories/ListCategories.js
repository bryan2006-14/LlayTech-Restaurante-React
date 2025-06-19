import React from 'react';
import { map } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

import { Image } from 'semantic-ui-react';

import './ListCategories.scss';


export function ListCategories(props) {

    const { categories } = props;

    const location = useLocation();
    const navigate = useNavigate();

    const goToCategory = (id) => navigate(`${location.pathname}/${id}`);

    return (
        <div className='list-categories-client'>
            {map(categories, (category) => (
                <div
                    className='list-categories-client__category'
                    key={category.id}
                    onClick={() => goToCategory(category.id)}
                >
                    <Image src={category.image} size="small" />
                    <span>{category.title}</span>
                </div>
            ))}
        </div>
    )
}
