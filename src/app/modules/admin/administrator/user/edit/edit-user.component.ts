import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, lastValueFrom, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, UserPagination } from '../user.types';
import { UserService } from '../user.service';

import { NgxMatTimepickerHoursFaceDirective } from 'ngx-mat-timepicker/lib/components/ngx-mat-timepicker-hours-face/ngx-mat-timepicker-hours-face.directive';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    flashErrorMessage: string;

    departmentData: any = []
    positionData: any = []
    permissionData: any = []
    branchData: any = []
    url_pro: any = []
    url_sig: any = []
    DatabyId: any = []

    files: File[] = [];
    filesSignature: File[] = [];

    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    fileUpload: string;
    fileUploadData: string;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    statusData: any = [
        { value: 'Yes', name: 'เปิดใช้งาน' },
        { value: 'No', name: 'ปิดใช้งาน' },
    ];

    supplierId: string | null;
    pagination: UserPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: UserService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            id: ['',],
            user_id: ['', Validators.required],
            name: ['', Validators.required],
            permission_id: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required,],
            image: ['',],
            status: '',
        })
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.formData.reset();


        const permission = await lastValueFrom(this._Service.getPermission())
        this.permissionData = permission.data;

        this._activatedRoute.params.subscribe(params => {
            const id = params.id;
            this._Service.getById(id).subscribe((resp: any) => {
                this.DatabyId = resp.data
                this.formData.patchValue({
                    id: this.DatabyId.id,
                    user_id: this.DatabyId.user_id,
                    email: this.DatabyId.email,
                    name: this.DatabyId.name,
                    permission_id: +this.DatabyId.permission_id,
                    status: this.DatabyId.status,
                })
                this.url_pro = this.DatabyId.image
            })
            // this.image(this.DatabyId.image)

        });

    }


    discard(): void {

    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions

    }

    update(): void {

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขผู้ใช้งาน",
            "message": "คุณต้องการแก้ไขผู้ใช้งานใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.update(formData).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('user/list').then(() => { })
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
                    }
                })
            }
        });

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



    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }




    onSelectSignature(event) {
        console.log(event);
        this.filesSignature.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image_signature: this.filesSignature[0],
        });
        console.log(this.formData.value)
    }

    onRemoveSignature(event) {
        console.log('1', event);
        this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
        this.formData.patchValue({
            image_signature: '',
        });
        console.log(this.formData.value)
    }


    onSubmit(): void {
        console.log(this.formData.value)
    }
    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url_pro = e.target.result;
        const file = event.target.files[0];
        this.formData.patchValue({
            image: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }
    onChangeSignature(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url_sig = e.target.result;
        const file = event.target.files[0];
        this.formData.patchValue({
            image_signature: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }

}
