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
import { sortBy, startCase,chain,groupBy } from 'lodash';
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

    files: File[] = [];
    inquiry_facilitys : any=[];
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

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {

        this.formData = this._formBuilder.group({

            id: '',
            name: '',
            objective: '',
            type: '',
            member_fname: '',
            property_type_name: '',
            inquiry_type_name: '',
            property_sub_type_name: '',
            property_color_land_name: '',
            status: '',
            updated_at: '',
            floor: '',
            bed_room: '',
            bath_room: '',
            kitchen_room: '',
            parking: '',
            living_room: '',
            usable_area_max: '',
            // property_sub_facility: '',
            Inquiry_facility_display: '',
            property_sub_type_explend: '',
            property_sub_type_rent:'',
            property_location_nearby:'',
            inquiry_tags:'',
            code:'',

            codeasset:'',
            lname:'',
            email:'',
            facebook:'',
            line:'',
            sex:'',
            tel:'',



        });


        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            console.log(this.itemData.inquiry_facilitys)
           //// ARRAY 3ชั้น forซ้อนfor
            // let property_sub_facility = ""
            // for (const data of this.itemData.Inquiry_facility_display) {
            //     for (const data1 of data.facility) {
            //         property_sub_facility += (data1.property_sub_facility?.name) + "   "
            //     }
            // }

            let property_sub_type_explend = ""
            for (const data of this.itemData.inquiry_property_explends) {
                property_sub_type_explend += (data.property_sub_type_explend?.name)+ "   "
            }

            let property_sub_type_rent = ""
            for (const data of this.itemData.inquiry_property_rents) {
                property_sub_type_rent += (data.property_sub_type_rent?.name)+ "   "
            }

            let property_location_nearby = ""
            for (const data of this.itemData.inquiry_locations) {
                for (const data1 of data.inquiry_location_nearbys) {
                    property_location_nearby += (data1.property_location_nearby?.name) + "   "
                }
            }
            let inquiry_tags = ""
            for (const data of this.itemData.inquiry_tags) {
                inquiry_tags += (data?.name)+ "   "
            }

            // console.log(this.itemData.inquiry_facilitys)
            this.inquiry_facilitys = chain(this.itemData.inquiry_facilitys).groupBy("property_sub_facility.property_facility.name").map((value,key)=>({key,value})).value()
          



            this.formData.patchValue({
                id: this.itemData.id,
                name: this.itemData?.name,
                objective: this.itemData?.objective,
                type: this.itemData?.type,
                member_fname: this.itemData.member?.fname,
                property_type_name: this.itemData.property_type?.name,
                property_sub_type_name: this.itemData.property_sub_type?.name,
                inquiry_type_name: this.itemData.inquiry_type?.name,
                property_color_land_name: this.itemData.property_color_land?.name,
                updated_at: this.itemData?.updated_at,
                status: this.itemData?.status,
                floor: this.itemData?.floor,
                bed_room: this.itemData?.bed_room,
                bath_room: this.itemData?.bath_room,
                kitchen_room: this.itemData?.kitchen_room,
                parking: this.itemData?.parking,
                living_room: this.itemData?.living_room,
                usable_area_max: this.itemData?.usable_area_max,
                // property_sub_facility: property_sub_facility,
                property_sub_type_explend:property_sub_type_explend,
                property_sub_type_rent:property_sub_type_rent,
                property_location_nearby:property_location_nearby,
                inquiry_tags:inquiry_tags,
       
                code: this.itemData.member?.code,
                codeasset: this.itemData.code,



                lname: this.itemData.member?.lname,
                codemember: this.itemData.member?.code,
                email: this.itemData.member?.email,
                facebook: this.itemData.member?.facebook,
                line: this.itemData.member?.line,
                sex: this.itemData.member?.sex,
                tel: this.itemData.member?.tel,



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

    property_sub_facilityFN(item){
        console.log(item)
       let property_sub_facility_name=""
        for (const data of item.value) {
            property_sub_facility_name += (data.property_sub_facility.name?? " ")+ "   "
        }
        return property_sub_facility_name
    }

    addUser(): void {
        this.approve().push(this.NewUser());

        // alert(1)
    }

    removeUser(i: number): void {
        this.approve().removeAt(i);
    }

    discard(): void { }

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

                this._Service.update(this.formData.value, this.Id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router
                            .navigateByUrl('purchase-services/list')
                            .then(() => { });
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
