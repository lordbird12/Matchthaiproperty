import { Route } from '@angular/router';
import { PageComponent } from './page.component';
import { EditComponent } from './edit/edit.component';
import { EditSubComponent } from './edit-sub/edit-sub.component';
import { EditSubExplendComponent } from './edit-sub-explend/edit-sub-explend.component';


import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { AddComponent } from './add/add.component';
import { AddSubExplendComponent } from './add-sub-explend/add-sub-explend.component';
import { PrintComponent } from './print/print.component';

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
                path: 'edit-sub/:id',
                component: EditSubComponent,
            },
            {
                path: 'edit-sub-explend/:id',
                component: EditSubExplendComponent,
            }, 
            {
                path: 'add/:id',
                component: AddComponent,
            },
            {
                path: 'add-sub-explend/:id',
                component: AddSubExplendComponent,
            },

            {
                path: 'print/:id',
                component: PrintComponent,
            },
        ],
    },
];
