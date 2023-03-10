import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'landing' },

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'landing' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },
    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'landing', loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'home', loadChildren: () => import('./modules/admin/pages/home/home.module').then(m => m.HomeModule)
            },
            //permission
            {
                path: 'permission',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/permission/page.module').then(m => m.Module) },
                ]
            },
            //user
            {
                path: 'user',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/user/user.module').then(m => m.UserModule) },
                    // { path: 'create-user', loadChildren: () => import('app/modules/admin/g-admin/user/create-user/create-user.component').then(m => m.UserModule) },
                    // { path: 'orders', loadChildren: () => import('app/modules/admin/marketing/orders/orders.module').then(m => m.OrdersModule) },
                    // { path: 'expand-store-list', loadChildren: () => import('app/modules/admin/marketing/orders/expand-store-list/expand-store-list.module').then(m => m.ExpandStoreModule) },
                    // {
                    //     path: 'data', children: [
                    //         { path: 'new-item-list-checking', loadChildren: () => import('app/modules/admin/marketing/new-item-list-checking/new-item-list-checking.module').then(m => m.NewItemListCheckingModule) },
                    //         { path: 'assets-list', loadChildren: () => import('app/modules/admin/marketing/assets-list/assets-list.module').then(m => m.AssetsListModule) },
                    //         { path: 'user', loadChildren: () => import('app/modules/admin/marketing/user/user.module').then(m => m.UserListModule) },
                    //         { path: 'store', loadChildren: () => import('app/modules/admin/marketing/store/store.module').then(m => m.StoreModule) },
                    //         { path: 'store-type', loadChildren: () => import('app/modules/admin/marketing/store-type/store-type.module').then(m => m.StoreTypeModule) },
                    //     ]
                    // },
                ]
            },

            {
                path: 'member',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/member/page.module').then(m => m.Module) },
                ]
            },


            {
                path: 'course-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/course-type/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'course-reward',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/course-reward/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'course-lesson',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/course-lesson/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'course',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/course/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'news-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/news-type/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'news',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/news/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'property-rent-time',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-rent-time/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'asset',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/asset/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'inquiry',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/inquiry/page.module').then(m => m.Module) },
                ]
            },


            {
                path: 'inquiry-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/inquiry-type/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-type-name',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-type-name/page.module').then(m => m.Module) },
                ]
            },


            {
                path: 'property-facilities-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-facilities-type/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-facilities',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-facilities/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'property-facilities-detail',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-facilities-detail/page.module').then(m => m.Module) },
                ]
            },



            {
                path: 'property-tag',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-tag/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-type-rent',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-type-rent/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-owner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-owner/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-announcer',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-announcer/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-location-nearby',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-location-nearby/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'property-type-detail',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-type-detail/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'property-color-land',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-color-land/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'inquiry-group',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/inquiry-group/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'property-group',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-group/page.module').then(m => m.Module) },
                ]
            },



            {
                path: 'property-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/property-type/page.module').then(m => m.Module) },
                ]
            },


             {
                path: 'contact',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/contact/page.module').then(m => m.Module) },
                ]
            },


            {
                path: 'payment-course',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/payment-course/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'payment-member',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/payment-course/page.module').then(m => m.Module) },
                ]
            },
           
            {
                path: 'vendor',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/vendor/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'vendor-company',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/vendor-company/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'co-agency',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/co-agency/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'banner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/banner/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'banner-promotion',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/banner-promotion/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'gift-voucher',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/gift-voucher/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'gift-voucher-code',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/gift-voucher-code/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'news-tag',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/news-tag/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'report-title',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/report-title/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'asset-report',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/asset-report/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'inquiry-report',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/inquiry-report/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'member-report',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/member-report/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'app-comment',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/app-comment/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'member-comment',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/member-comment/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'config-banner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/config-banner/page.module').then(m => m.Module) },
                ]
            },  
            {
                path: 'post-contact',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/post-contact/page.module').then(m => m.Module) },
                ]
            },  

            {
                path: 'transection',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/transection/page.module').then(m => m.Module) },
                ]
            },  

            {
                path: 'faq',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/faq/page.module').then(m => m.Module) },
                ]
            },


            {
                path: 'partner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/partner/page.module').then(m => m.Module) },
                ]
            },
        
            {
                path: 'video',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/video/page.module').then(m => m.Module) },
                ]
            },

            // 404 & Catch all
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
            { path: '**', redirectTo: '404-not-found' }
        ]
    },

];
