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
    files1: File[] = [];
    MemberType: any = [];
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
            member_group_id: 4,
            username: '',
            email: '',
            password:'',
            tel: '',
            fname: '',
            lname: '',
            profile_image:'',
            birthday: '',
            age: '',
            sex: '',
            address: '',
            line: '',
            facebook: '',
            citizen_id: '',
            citizen_back_no:'',
            citizen_image:'',
            buyer_type:'',
           
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        this._Service.getCourseType().subscribe((resp: any) => {
            this.MemberType = resp.data;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        })
    }

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

    create(): void {
        // let file =this.formData.value.citizen_image
        //  console.log(typeof file )
        //  return
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูลใหม่',
            message: 'คุณต้องการเพิ่มข้อมูลใหม่ใช่หรือไม่ ',
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
                this.formData.patchValue({
                    citizen_image:this.files[0],
                    profile_image:this.files1[0],
                })
                const formData = new FormData()
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.new(formData).subscribe({
                    next: (resp: any) => {
                        this._router
                            .navigateByUrl('member/list')
                            .then(() => {});
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'กรุณาระบุข้อมูล',
                            message:
                                'ไม่สามารถบันทึกข้อมูลได้กรุณาตรวจสอบใหม่อีกครั้ง',
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
            citizen_image: this.files[0],
        });
    }
    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            citizen_image: '',
        });
    }


    onSelect1(event) {
        this.files1.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            profile_image: this.files1[0],
        });
    }

    onRemove1(event) {
        this.files1.splice(this.files1.indexOf(event), 1);
        this.formData.patchValue({
            profile_image: '',
        });
    }
    // onProfileSelect(event) {
    //     this.files1.push(...event.addedFiles);
    //     // Trigger Image Preview
    //     setTimeout(() => {
    //         this._changeDetectorRef.detectChanges();
    //     }, 150);
    //     this.formData.patchValue({
    //         profile_image: this.files1[0],
    //     });
    // }


}
