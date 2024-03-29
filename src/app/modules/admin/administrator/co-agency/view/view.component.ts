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
    selector: 'view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    animations: fuseAnimations,
})
export class ViewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];
    itemData: any = [];
    images: String[]=[];
    statusData = [
        { value: 'open', name: 'Open' },
        { value: 'post', name: 'Share' },
        { value: 'contact', name: 'Contact' },
        { value: 'close_deal', name: 'Close Deal' },
        { value: 'finish', name: 'Finish' },
    ];
    // branchId = 2;
    Id: any;
    files: File[] = [];

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
            id: ['', Validators.required],
            status: ['', Validators.required],
            asset_name: '',
            asset_description: '',
            asset_type: '',
            asset_property_name: '',
            asset_image: '',
            asset_map_address: '',
            asset_floor: '',
            asset_bed_room: '',
            asset_bath_room: '',
            asset_kitchen_room: '',
            asset_parking: '',
            asset_living_room: '',
            asset_funiture: '',
            asset_usable_area: '',
            asset_price: '',
            asset_price_per_month: '',
            asset_price_share: '',
            asset_property_type_name:'',
            asset_property_sub_type_name:'',
            asset_property_announcer_name:'',
            asset_property_ownership_name:'',
            asset_property_color_land_name:'',
            asset_inquiry_type_name:'',
            asset:'',
            property_location_nearby:'',
            property_sub_facility:'',
            asset_tags:'',
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
        




        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
/////เอามาไว้ด้านบนเนื่องจาก ต้องอยู่ใต้ itemData////
            let property_location_nearby = ""
            for (const data of this.itemData.asset.asset_location_nearbys) {
                    property_location_nearby += (data.property_location_nearby?.name) + "   "   
            }
            let property_sub_facility = ""
            for (const data of this.itemData.asset.asset_facilitys) {
                    property_sub_facility += (data.property_sub_facility?.name) + "   "
            }
            let asset_tags = ""
            for (const data of this.itemData.asset.asset_tags) {
                // property_location_nearby += data.name + "    "
                asset_tags += (data.name?? " ")+ "   "
            }


            this.formData.patchValue({
                id: this.itemData.id,
                asset_name: this.itemData.asset.name,
                asset_description: this.itemData.asset.description,
                asset_type: this.itemData.asset.type,
                asset_property_name: this.itemData.asset.property_name,
                asset_image: this.itemData.asset.image,
                asset_map_address: this.itemData.asset.map_address,
                asset_floor: this.itemData.asset.floor,
                asset_bed_room: this.itemData.asset.bed_room,
                asset_bath_room: this.itemData.asset.bath_room,
                asset_kitchen_room: this.itemData.asset.kitchen_room,
                asset_parking: this.itemData.asset.parking,
                asset_living_room: this.itemData.asset.living_room,
                asset_funiture: this.itemData.asset.funiture,
                asset_usable_area: this.itemData.asset.usable_area,
                asset_price: this.itemData.asset.price,
                asset_price_per_month: this.itemData.asset.price_per_month,
                asset_price_share: this.itemData.asset.price_share,
                asset_property_type_name: this.itemData.asset.property_type?.name,
                asset_property_sub_type_name: this.itemData.asset.property_sub_type?.name,
                asset_property_announcer_name: this.itemData.asset.property_announcer?.name,
                asset_property_ownership_name: this.itemData.asset.property_ownership?.name,
                asset_property_color_land_name: this.itemData.asset.property_color_land?.name,
                asset_inquiry_type_name: this.itemData.asset.inquiry_type?.name,
                property_location_nearby:property_location_nearby,
                property_sub_facility:property_sub_facility,
                asset_tags:asset_tags,
            });
            this.images=this.itemData.asset.asset_images
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

    Update(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'แก้ไขรายการ',
            message: 'คุณต้องการแก้ไขรายการใช่หรือไม่ ',
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
                // Disable the form
                this.formData.disable();

                let formValue = this.formData.value;


                this._Service.update(formValue, this.Id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router
                            .navigateByUrl('co-agency/list')
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
                    },
                });

                // Sign in
                // this._Service.createUser(this.userForm.value)
                //     .subscribe({
                //         next: (res) => {
                //             console.log(res);
                //         },
                //         error: (err: HttpErrorResponse) => {
                //             this.userForm.enable();
                //             this.flashMessage = 'error';

                //             if (err.error.error['message'] === 'This attribute must be unique') {
                //                 this.flashErrorMessage = 'Username is already';
                //             } else {
                //                 this.flashErrorMessage = err.error.error['message'];
                //             }
                //         },
                //         complete: () => {
                //             this._location.back();
                //         },
                //     }
                //     );
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
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }
}
