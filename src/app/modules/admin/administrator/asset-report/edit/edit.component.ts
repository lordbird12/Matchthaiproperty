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
    lastValueFrom,
    map,
    merge,
    Observable,
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
import { AssetType, BranchPagination } from '../page.types';
import { Service } from '../page.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    animations: fuseAnimations,
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];
    itemData: any = [];
    url_pro: any = []
    files: File[] = [];

    statusData = [
        { value: 'Yes', name: 'อนุมัติใช้งาน' },
        { value: 'No', name: 'ไม่อนุมัติ' },
        { value: 'Request', name: 'รออนุมัติ' },
    ];

    Id: any;
    courseType: any = [];

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

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
    pagination: BranchPagination;

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
            course_id: ['', Validators.required],
            title: ['', Validators.required],
            name: '',
            detail: '',
            asset_type: '',
            asset_member_code: '',
            asset_name: '',
            asset_code:'',
            asset_description: '',
            asset_image: '',
            asset_updated_at: '',
            asset_property_type_name:'',
            asset_property_announcer_name: '',
            asset_property_sub_type_name: '',
            asset_property_color_land_name:'',
            asset_asset_location_nearbys_name: '',
            asset_member_fname: '',
            asset_member_lname: '',
            asset_member_tel: '',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');

        // this._Service.getCourseType().subscribe((resp: any) => {
        //     this.courseType = resp.data;

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // })

        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            this.formData.patchValue({
                id: this.itemData.id,
                name: this.itemData.name,
                detail: this.itemData.detail,
                asset_name: this.itemData.asset.name,
                asset_code: this.itemData.asset.code,
                asset_description: this.itemData.asset.description,
                asset_type: this.itemData.asset.type,
                asset_image: this.itemData.asset.image,
                asset_updated_at: this.itemData.asset.updated_at,
                asset_property_type_name: this.itemData.asset.property_type.name,
                asset_property_announcer_name: this.itemData.asset.property_announcer.name,
                asset_property_sub_type_name: this.itemData.asset.property_sub_type.name,
                asset_property_color_land_name: this.itemData.asset.property_color_land.name,
                // asset_asset_location_nearbys_name: this.itemData.asset.asset_location_nearbys.property_location_nearby.name,
                asset_member_fname: this.itemData.asset.member.fname,
                asset_member_lname: this.itemData.asset.member.lname,
                asset_member_tel: this.itemData.asset.member.tel,
                member: this.itemData.member,
                status: this.itemData.status,
            });
        });
    }

    approve(): FormArray {
        return this.formData.get('approve') as FormArray;
    }

    NewUser(): FormGroup {
        return this._formBuilder.group({
            user_id: '',
            remark: '',
        });
    }

    addUser(): void {
        this.approve().push(this.NewUser());

        // alert(1)
    }

    removeUser(i: number): void {
        this.approve().removeAt(i);
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
          asset_image: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
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

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                this._Service.update(this.formData.value,this.Id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router
                            .navigateByUrl('purchase-services/list')
                            .then(() => {});
                    },
                    error: (err: any) => {
                        this.formData.enable();
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
