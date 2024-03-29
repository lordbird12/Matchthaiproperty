import { Route } from '@angular/router';
import { PageComponent } from './page.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { AddComponent } from './add/add.component';
import { AddGalleryComponent } from './add-gallery/add-gallery.component';
import { EditGalleryComponent } from './edit-gallery/edit-gallery.component';
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
                path: 'add/:id',
                component: AddComponent,
            },
            {
                path: 'add-gallery/:id',
                component: AddGalleryComponent,
            },
            {
                path: 'edit-gallery/:id',
                component: EditGalleryComponent,
            },

            {  
                path: 'print/:id',
                component: PrintComponent,
            },
        ],
    },
];
