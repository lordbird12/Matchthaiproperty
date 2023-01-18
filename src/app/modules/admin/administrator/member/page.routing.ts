import { Route } from '@angular/router';
import { UserListComponent } from './list/list.component';
import { UserComponent } from './page.component';
import { AssetTypeResolver, PermissionProductsResolver } from './page.resolvers';


export const userRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'list',
                component: UserListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
           

        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
