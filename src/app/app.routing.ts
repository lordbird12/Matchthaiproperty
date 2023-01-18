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
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/permission/permission.module').then(m => m.PermissionModule) },
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
                path: 'news-category',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/news-category/page.module').then(m => m.Module) },
                ]
            },

            {
                path: 'news',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/administrator/news/page.module').then(m => m.Module) },
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
