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
                id: 'user',
                title: 'สิทธิ์การใช้งาน',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/permission/list',
            },
            {
                id: 'user',
                title: 'สมาชิก',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/member/list',
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
                id: 'website.news',
                title: 'จัดการข้อมูล website',
                type: 'collapsable',
                children: [
                    {
                        id: 'property-color-land',
                        title: 'สีที่ดิน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-color-land/list',
                    },
                    {
                        id: 'property-type',
                        title: 'ประเภทอสังหา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-type/list',
                    },
                    {
                        id: 'property-type-detail',
                        title: 'รายละเอียดประเภทอสังหา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-type-detail/list',
                    },
                    {
                        id: 'property-location-nearby',
                        title: 'สถานที่ใกล้เคียง',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-location-nearby/list',
                    },
                    {
                        id: 'nproperty-announcer',
                        title: 'สถานะผู้ประกาศ',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-announcer/list',
                    },
                    {
                        id: 'property-owner',
                        title: 'เจ้าของอสังหา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-owner/list',
                    },
                    {
                        id: 'property-type-rent',
                        title: 'รายละเอียดการเช่าประเภทอสังหา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-type-rent/list',
                    },
                    {
                        id: 'property-rent-time',
                        title: 'ระยะเวลาเช่าทรัพย์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-rent-time/list',
                    },

                    {
                        id: 'property-tag',
                        title: 'แท็กอสังหา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-tag/list',
                    },
                    {
                        id: 'property-facilities-type',
                        title: 'ประเภทสิ่งอำนวยความสะดวก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-facilities-type/list',
                    },
                    {
                        id: 'property-facilities',
                        title: 'สิ่งอำนวยความสะดวก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/property-facilities/list',
                    },

                ],
            },
            {
                title: 'รายการจัดการอสังหา',
                type: 'basic',
                link: '/asset/list',
            },
            {
                title: 'จัดการความต้องการ',
                type: 'basic',
                link: '/inquiry/list',
            },

            {
                title: 'ตั้งค่าแบนเนอร์และฟูตเตอร์',
                type: 'basic',
                link: '/config-banner/list',
            },
            {
                title: 'จัดการติดต่อเว็ปไซต์',
                type: 'basic',
                link: '/post-contact/list',
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
                title: 'วีดีโอการใช้งาน',
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
                    {
                        // id: 'news.list',
                        title: 'จัดการแท็กข่าว',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/news-tag/list',
                    },


                ],
            },
            {
                id: 'website.news',
                title: 'โฆษณา',
                type: 'collapsable',
                children: [
                    {
                        title: 'ภาพแบนเนอร์',
                        type: 'basic',
                        link: '/banner/list',
                    },
                    {

                        title: 'โปรโมชั่นโฆษณา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/banner-promotion/list',
                    },
                ],
            },
            {
                id: 'review',
                title: 'รีวิว',
                type: 'collapsable',
                children: [
                    {
                        id: 'app-comment',
                        title: 'รีวิวเว็ปไซต์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/app-comment/list',
                    },
                    {
                        id: 'member-comment',
                        title: 'รีวิวสมาชิก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/member-comment/list',
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
                    {
                        id: 'course.lesson',
                        title: 'บทเรียน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/course-lesson/list',
                    },
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
                    {
                        id: 'payment',
                        title: 'คูปองส่วนลด',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/gift-voucher/list',
                    },
                    {
                        id: 'gift-voucher-code',
                        title: 'จัดการรหัสส่วนลด',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/gift-voucher-code/list',
                    },

                    {
                        id: 'transection',
                        title: 'รายงานการจ่ายเงิน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/transection/list',
                    },
                ],
            },
        ],
    },

    {
        id: 'report',
        title: 'รีพอร์ต',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'report-title',
                title: 'จัดการหัวข้อรายงาน',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/report-title/list',
            },
            {
                id: 'asseet-report',
                title: 'การรายงานทรัพย์',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/asset-report/list',
            },
            {
                id: 'inquiry-report',
                title: 'การรายงานความต้องการซื้อ',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/inquiry-report/list',
            },
            {
                id: 'gift-voucher-code',
                title: 'การรายงานสมาชิก และรายงานทั่วไป',
                type: 'basic',
                // icon: 'heroicons_outline:clipboard-check',
                link: '/member-report/list',
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
