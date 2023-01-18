/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'administrator',
        title: 'ผู้ดูแลระบบ',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:home',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'user',
                title: 'ผู้ใช้งาน',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/user/list',
            },

            {
                id: 'vendor',
                title: 'พันธมิตร',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/vendor/list',
            },

            {
                id: 'unemployed',
                title: 'พันธมิตรกลุ่มย่อย',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: 'vendor-company/list',
            },
            {
                id: 'unemployed',
                title: 'Co - Agent',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: 'co-agency/list',
            },
        ],
    },
    {
        id: 'website',
        title: 'จัดการหน้าเว็บไซต์',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cube',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                title: 'ภาพแบนเนอร์',
                type: 'basic',
                link: '/banner/list',
            },
            {
                title: 'คำถามพบบ่อย',
                type: 'basic',
                link: '/faq/list',
            },
            {
                title: 'ช่องทางติดต่อและเงื่อนไข',
                type: 'basic',
                link: '/contact/list',
            },
            {
                title: 'Youtube',
                type: 'basic',
                link: '/video/list',
            },
            {
                id: 'website.news',
                title: 'ข่าวสาร',
                type: 'collapsable',
                children: [
                    {
                        id: 'news.category',
                        title: 'หมวดหมู่ข่าวสาร',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/news-category/list',
                    },
                    {
                        id: 'news.list',
                        title: 'รายการข่าวสาร',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/news/list',
                    },
                ],
            },
        ],
    },
    {
        id: 'course',
        title: 'คอร์สฝึกอบรม',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'website.course',
                title: 'คอร์สอบรม',
                type: 'collapsable',
                children: [
                    {
                        id: 'course.type',
                        title: 'ประเภทคอร์ส',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/course-type/list',
                    },
                    {
                        id: 'course.reward',
                        title: 'สิ่งที่ได้รับ',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/course-reward/list',
                    },
                    {
                        id: 'course.list',
                        title: 'คอร์สอบรม',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/course/list',
                    },
                    // {
                    //     id: 'course.lesson',
                    //     title: 'บทเรียน',
                    //     type: 'basic',
                    //     // icon: 'heroicons_outline:clipboard-check',
                    //     link: '/course-lesson/list',
                    // },
                ],
            },

            {
                id: 'payment',
                title: 'การรับชำระเงิน',
                type: 'collapsable',
                children: [
                    {
                        id: 'payment',
                        title: 'รายการซื้อคอร์ส',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/payment-course/list',
                    },
                    {
                        id: 'course.reward',
                        title: 'รายการเติมเงิน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/payment-member/list',
                    },
                ],
            },
        ],
    },
    {
        id: 'account',
        title: 'บัญชีผู้ใช้',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'settings',
                title: 'ตั้งค่าโปรไฟล์',
                type: 'basic',
                link: '/pages/settings',
            },
            {
                id: 'signout',
                title: 'ออกจากระบบ',
                type: 'basic',
                link: '/sign-out',
            },
        ],
    },
];
