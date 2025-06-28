import { BasicLayout, ClientLayout } from '../layouts';
import {
    SelectTable,
    Categories,
    Products,
    Cart,
    YapePaymentInfo,
    OrdersHistory
    
} from '../pages';

const routesClient = [
    {
        path: '/',
        layout: BasicLayout,
        component: SelectTable,
    },
    {
        path: '/client/:tableNumber',
        layout: ClientLayout,
        component: Categories,
    },
    {
        path: '/client/:tableNumber/cart',
        layout: ClientLayout,
        component: Cart,
    },
    {
        path: '/client/:tableNumber/orders',
        layout: ClientLayout,
        component: OrdersHistory,
    },
    {
        path: '/client/:tableNumber/:idCategory',
        layout: ClientLayout,
        component: Products,
    },
    {
    path: '/client/:tableNumber/yape',
    layout: ClientLayout,
    component: YapePaymentInfo,
},

];

export default routesClient;