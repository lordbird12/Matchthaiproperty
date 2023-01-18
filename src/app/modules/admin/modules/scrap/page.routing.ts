import { Route } from '@angular/router';
import { PageComponent } from './page.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { PrintComponent } from './print/print.component';
import { DetailComponent } from './detail/detail.component';

export const pageRoute: Route[] = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'new',
                component: NewComponent,
            },
            {
                path: 'edit/:id',
                component: EditComponent,
            },
            {
                path: 'detail/:id',
                component: DetailComponent,
            },
        ],
    },
];
