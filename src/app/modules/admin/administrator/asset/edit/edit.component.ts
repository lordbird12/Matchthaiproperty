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
import { chain, groupBy, sortBy, startCase, values } from 'lodash';
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
    images: String[]=[];
    files: File[] = [];
    asset_facilitys : any=[];
    statusData = [
        { value: 'Yes', name: 'อนุมัติใช้งาน' },
        { value: 'No', name: 'ไม่อนุมัติ' },
        { value: 'Request', name: 'รออนุมัติ' },
    ];

    Id: any;
    courseType: any = [];
    property_type:string="";

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
            name:'',
            description:'',
            map_address:'',
            price:'',
            price_per_month:'',
            price_share:'',
            status: '',
            floor: '',
            bed_room: '',
            bath_room:'',
            kitchen_room: '',
            parking:'',
            living_room:'',
            usable_area:'',
            responsible_transfer:'',
            view:'',
            asset_facility_display:'',
            property_type:'',
            inquiry_type:'',
            property_location_nearby:'',
            property_sub_facility:'',
            property_announcer:'',
            property_ownership:'',
            property_color_land:'',
            asset_tags:'',
            property_sub_type_rent:'',
            property_sub_type:'',
            fname:'',
            code:'',

        });

        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;

            /////เก็บรูป string
            this.images=this.itemData.asset_images

                        // ARRAY2ชั้น
            let property_sub_facility = ""
            for (const data of this.itemData.asset_facilitys) {
                // property_sub_facility += data.name + "    "
                property_sub_facility += (data.property_sub_facility?.name)+ "   "
                // property_sub_facility += (data.property_sub_facility?.name ?? "  ,")+ "\n"
            }
            // console.log(this.itemData)


//////////////////////////////////////////////////////////

            this.asset_facilitys = chain(this.itemData.asset_facilitys).groupBy("property_sub_facility.property_facility.name").map((value,key)=>({key,value})).value()
            console.log(this.asset_facilitys)
            // for (const data of this.itemData.asset_facilitys) {
            //     // property_sub_facility += data.name + "    "
            //     asset_facilitys += (data.name)+ "   "
            //     // property_sub_facility += (data.property_sub_facility?.name ?? "  ,")+ "\n"
            // }

//////////////////////////////////////////////
                      
            let property_location_nearby = ""
            for (const data of this.itemData.asset_location_nearbys) {
                // property_location_nearby += data.name + "    "
                property_location_nearby += (data.property_location_nearby?.name  )+ "   "
            }

               // ARRAY1ชั้น
            let asset_tags = ""
            for (const data of this.itemData.asset_tags) {
                // property_location_nearby += data.name + "    "
                asset_tags += (data.name?? " ")+ "   "
            }
            // let asset_facility_display = ""
            // for (const data of this.itemData.asset_facility_display) {
            //     // property_location_nearby += data.name + "    "
            //     asset_facility_display += (data.name?? " ")+ "   "
            // }
            let property_sub_type_rent = ""
            for (const data of this.itemData.asset_property_rents) {
                // property_location_nearby += data.name + "    "
                property_sub_type_rent += (data.property_sub_type_rent?.name  )+ "   "
            }
            asset_tags
            this.formData.patchValue({
                name: this.itemData.name,
                description: this.itemData?.description,
                map_address: this.itemData?.map_address,
                price: this.itemData?.price,
                price_per_month: this.itemData?.price_per_month,
                price_share: this.itemData?.price_share,
                status: this.itemData?.status,
                floor: this.itemData?.floor,
                bed_room: this.itemData?.bed_room,
                bath_room: this.itemData?.bath_room,
                kitchen_room: this.itemData?.kitchen_room,
                parking: this.itemData?.parking,
                living_room: this.itemData?.living_room,
                usable_area: this.itemData?.usable_area,
                responsible_transfer: this.itemData?.responsible_transfer,
                view: this.itemData?.view,
                property_type: this.itemData.property_type?.name,
                inquiry_type: this.itemData.inquiry_type?.name,
                property_location_nearby: property_location_nearby,
                property_sub_facility:property_sub_facility,
                property_announcer: this.itemData.property_announcer?.name,
                property_ownership: this.itemData.property_ownership?.name,
                property_color_land: this.itemData.property_color_land?.name,
                asset_tags:asset_tags,
                property_sub_type_rent:property_sub_type_rent,
                property_sub_type: this.itemData.property_sub_type?.name,
                fname: this.itemData.member?.fname,
                code: this.itemData.code,


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

    property_sub_facilityFN(item){
        console.log(item)
       let property_sub_facility_name=""
        for (const data of item.value) {
            // property_location_nearby += data.name + "    "
            property_sub_facility_name += (data.property_sub_facility.name?? " ")+ "   "
        }
        return property_sub_facility_name
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
