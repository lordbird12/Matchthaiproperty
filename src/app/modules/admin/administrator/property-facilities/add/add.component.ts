import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    Observable,
    lastValueFrom,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
// import { AssetType, PositionPagination } from '../page.types';
import { Service } from '../page.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],

    animations: fuseAnimations,
})
export class AddComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    // @ViewChild(DataTableDirective)
    // dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dataRow: any = [];
    private destroy$ = new Subject<any>();
    formData: FormGroup;
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    ClassData: any;

    supplierId: string | null;
    // pagination: PositionPagination;
    id: string;
    itemData: any = [];
    files: File[] = [];
    AddCouponType: any = [];
    AddType: any = [];
    video: File;



    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {
            this.formData = this._formBuilder.group({
                id: '',
                course_id: '',
                title: '',
                detail: '',
                video: '',
                hour: '',
                min: '',
                sec: '',
                status: '',

            }); 
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.id = this._activatedRoute.snapshot.paramMap.get('id');
        this.loadTable();
        this.formData = this._formBuilder.group({
            course_id: this.id,
            title: '',
            detail: '',
            video: '',
            hour: '',
            min: '',
            sec: '',
            status: '',
        });
        // this._Service.getAddType().subscribe((resp: any) => {
        //     this.AddType = resp.data;
        //     this._changeDetectorRef.markForCheck();
        // })
        // this._Service.getCourseById(this.id).subscribe((resp: any) => {
        //     this.itemData = resp.data;
        //     this.formData.patchValue({
        //         id: this.itemData.id,

        //     });
        // });
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 100,
            serverSide: true,
            processing: true,
            responsive: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = '';
                dataTablesParameters.course_id= this.id;
                that._Service
                    .getFacilitiePage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'id' },
                { data: 'title' },
                { data: 'video' },
                { data: 'detail' },     
                { data: 'time' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
                { data: 'actice', orderable: false },
            ]
        };
    }

    discard(): void {}

    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    // createCoupon(): void {
    //     this.flashMessage = null;
    //     this.flashErrorMessage = null;
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'สร้างรายการใหม่',
    //         message: 'คุณต้องการสร้างรายการใหม่ใช่หรือไม่ ',
    //         icon: {
    //             show: false,
    //             name: 'heroicons_outline:exclamation',
    //             color: 'warning',
    //         },
    //         actions: {
    //             confirm: {
    //                 show: true,
    //                 label: 'ยืนยัน',
    //                 color: 'primary',
    //             },
    //             cancel: {
    //                 show: true,
    //                 label: 'ยกเลิก',
    //             },
    //         },
    //         dismissible: true,
    //     });
    //     confirmation.afterClosed().subscribe(async (result) => {
    //         if (result === 'confirmed') {
    //             const video = new FormData()
    //             video.append("file",this.video)
    //             video.append("path","images/course_lesson/")
    //             const file = await lastValueFrom(this._Service.uploadVideo(video))
    //             this.formData.patchValue({video:file})
    //             this._Service.newCourse(this.formData.value).subscribe({
    //                 next: (resp: any) => {
    //                     // this._router
    //                     //     .navigateByUrl('course/add')
    //                     //     .then(() => {});
    //                     window.location.reload()
    //                 },
    //                 error: (err: any) => {
    //                     this._fuseConfirmationService.open({
    //                         title: 'กรุณาระบุข้อมูล',
    //                         message: err.error.message,
    //                         icon: {
    //                             show: true,
    //                             name: 'heroicons_outline:exclamation',
    //                             color: 'warning',
    //                         },
    //                         actions: {
    //                             confirm: {
    //                                 show: false,
    //                                 label: 'ยืนยัน',
    //                                 color: 'primary',
    //                             },
    //                             cancel: {
    //                                 show: false,
    //                                 label: 'ยกเลิก',
    //                             },
    //                         },
    //                         dismissible: true,
    //                     });
    //                     console.log(err.error.message);
    //                 },
    //             });
    //         }
    //     });
    // }
    videoChange(event) {
        this.video = event.target.files[0]
    }
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }


    DeleteCourse(id: any): void {
        this.flashMessage = null;

        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบรายการที่เลือก',
            message: 'คุณต้องการลบรายการที่เลือกใช่หรือไม่ ',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._Service.deleteCourse(id).subscribe({
                    next: (resp: any) => {
                        location.reload();
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'กรุณาระบุข้อมูล',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ยืนยัน',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                        console.log(err.error.message);
                    },
                });
            }
        });
    }
    
    edit(Id: string): void {
        this._router.navigate(['course-lesson/edit/' + Id]);
    }
    onSelect(event) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            image: this.files[0],
        });
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
    }
}
