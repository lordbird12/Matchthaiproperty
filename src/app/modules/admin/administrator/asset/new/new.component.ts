import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
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
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../page.types';
import { Service } from '../page.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
    animations: fuseAnimations,
})
export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

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
    supplierId: string | null;
    pagination: BranchPagination;
    public UserAppove: any = [];
    files: File[] = [];
    public Approve: any = [];

    /**
     * Constructor
     */
    constructor(

        public dialogRef: MatDialogRef<NewComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,

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

            approve:"",
            approve_remark:"",
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.formData = this._formBuilder.group({
            approve: "",
            approve_remark: "",

        });
        console.log(this.data)
        // this._Service.getConfirm().subscribe((resp: any) => {
        //     this.Approve = resp.data;

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    // create(): void {
    //     this.flashMessage = null;
    //     this.flashErrorMessage = null;
    //     // Return if the form is invalid
    //     // if (this.formData.invalid) {
    //     //     return;
    //     // }
    //     // Open the confirmation dialog
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'เพิ่มข้อมูลใหม่',
    //         message: 'คุณต้องการเพิ่มข้อมูลใหม่ใช่หรือไม่ ',
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

    //     // Subscribe to the confirmation dialog closed action
    //     confirmation.afterClosed().subscribe((result) => {
    //         // If the confirm button pressed...
    //         if (result === 'confirmed') {

    //             this._Service.new(this.formData.value).subscribe({
    //                 next: (resp: any) => {
    //                     this._router
    //                         .navigateByUrl('course-lesson/list')
    //                         .then(() => { });
    //                 },
    //                 error: (err: any) => {
    //                     this._fuseConfirmationService.open({
    //                         title: 'กรุณาระบุข้อมูล',
    //                         message:
    //                             'ไม่สามารถบันทึกข้อมูลได้กรุณาตรวจสอบใหม่อีกครั้ง',
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
    //                 },
    //             });
    //         }
    //     });
    // }



    update(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            title: 'แก้ไขข้อมูล',
            message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
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

          
            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(this.formData.value);
                this._Service.updateConfirm(this.formData.value,this.data.id).subscribe({
                    next: (resp: any) => {
                        this.dialogRef.close();
                    },
                    error: (err: any) => {

                        this._fuseConfirmationService.open({
                            "title": "กรุณาระบุข้อมูล",
                            "message": err.error.message,
                            "icon": {
                                "show": true,
                                "name": "heroicons_outline:exclamation",
                                "color": "warning"
                            },
                            "actions": {
                                "confirm": {
                                    "show": false,
                                    "label": "ยืนยัน",
                                    "color": "primary"
                                },
                                "cancel": {
                                    "show": false,
                                    "label": "ยกเลิก",

                                }
                            },
                            "dismissible": true
                        });
                        console.log(err.error.message)
                    }
                })
            }
        });
    }
    showFlashMessage(arg0: string) {
        throw new Error('Method not implemented.');
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
