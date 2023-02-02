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
    rewardData: any = [];
    files: File[] = [];
    video: File;

    image: File;
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
            course_type_id: '',
            course_id: ['', Validators.required],
            title: ['', Validators.required],
            detail: '',
            video: '',              //'images/course_lesson/1666553407.mp4',
            hour: '',
            min: '',
            sec: '',
            status: '',
            image: [''],
            lecturer: '',
            lecturer_profile: '',
            price: '',
            cost: '',
            price_sale: '',
            course_rewards: this._formBuilder.array([]),
            course_reward: [],
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
        const file: any = await lastValueFrom(this._Service.getReward())
        this.rewardData = file.data
        console.log(file.data)
        this._Service.getCourseType().subscribe((resp: any) => {
            this.courseType = resp.data;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        })
        // this._Service.getReward().subscribe((resp: any) => {
        //     this.rewardData = resp.data;

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // })

        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data;
            this.formData.patchValue({
                course_type_id: this.itemData.course_type_id,
                course_id: this.itemData.course_id,
                title: this.itemData.title,
                detail: this.itemData.detail,
                video: this.itemData.video,
                hour: this.itemData.hour,
                min: this.itemData.min,
                sec: this.itemData.sec,
                status: this.itemData.status,
                image: this.itemData.image,
                lecturer: this.itemData.lecturer,
                lecturer_profile: this.itemData.lecturer_profile,
                price: this.itemData.price,
                cost: this.itemData.cost,
                price_sale: this.itemData.price_sale,
                // course_rewards: this.itemData.course_rewards,
                // course_rewards: this._formBuilder.array([]),


            });
            for (const cr of this.itemData.course_course_rewards) {
                this.course_reward().push(this.getCourse_reward(cr.id, cr.course_reward_id));
            }

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
    course_reward(): FormArray {
        return this.formData.get('course_rewards') as FormArray;
    }

    newCourse_reward(): FormGroup {
        return this._formBuilder.group({
            id: '',course_reward_id:""
        });
    }
    getCourse_reward(id: any, course_reward_id: any): FormGroup {
        return this._formBuilder.group({
            id, course_reward_id
        });
    }

    removeCourse_reward(i: number): void {
        this.course_reward().removeAt(i);
    }

    addCourse_reward(): void {
        this.course_reward().push(this.newCourse_reward());
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
      
        const course_reward = [];
        this.formData.value.course_rewards.forEach(element => {
            console.log(element)
            
            course_reward.push(element.course_reward_id);
        });
        this.formData.patchValue({course_reward})
        this.flashMessage = null;
        //   console.log(this.formData.value)
        //  return
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

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe(async (result) => {

            if (result === 'confirmed') {
                if (this.video != null) 
                {
                    const video = new FormData()
                    video.append("file", this.video)
                    video.append("path", "images/course/")
                    const file = await lastValueFrom(this._Service.uploadVideo(video))
                    this.formData.patchValue({ video: file })
                }
                if (this.files.length>0) 
                {
                const image = new FormData()
                image.append("file", this.files[0])
                image.append("path", "images/course/")
                const file1 = await lastValueFrom(this._Service.uploadVideo(image))
                this.formData.patchValue({ image: file1 })
                 }

                this._Service.update(this.formData.value, this.Id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router
                            .navigateByUrl('course/list')
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
    videoChange(event) {
        this.video = event.target.files[0]
    }

    onSelect(event) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        // this.formData.patchValue({
        //     image: this.files[0],
        // });
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
    }
}
