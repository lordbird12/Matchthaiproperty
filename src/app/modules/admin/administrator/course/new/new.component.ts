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
    files1: any[] = [];
    video: File;
    image: File;
    type: string;

    courseType: any = [];
    rewardData: any = [];
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
        // this.formData = this._formBuilder.group({
        //     course_type_id: ['', Validators.required],
        //     title: ['', Validators.required],
        //     detail: '',
        //     video: '',      //'images/course_lesson/1666553407.mp4',
        //     image: '',
        //     lecturer: '',
        //     lecturer_profile: '',
        //     qty_lesson: '10',
        //     price: '',
        //     cost: '',
        //     price_sale: '',
        //     hour: '',
        //     min: '',
        //     sec: '',
        //     status: '',
        //     course_rewards: this._formBuilder.array([]),
        //     course_lecturers: this._formBuilder.array([]),
        //     course_reward: '',
        //     course_lecturer: '',
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.formData = this._formBuilder.group({
            course_type_id: ['', Validators.required],
            title: ['', Validators.required],
            detail: '',
            image: '',
            video: '', //'images/course_lesson/1666553407.mp4',
            lecturer: '',
            lecturer_profile: '',
            qty_lesson: '',
            price: '',
            type: '',
            cost: '',
            price_sale: '',
            hour: '',
            min: '',
            sec: '',
            exp_day: '',
            course_rewards: this._formBuilder.array([]),
            course_reward: '',
            course_lecturer: this._formBuilder.array([]),
            // course_lecturer: '',
        });

        this._Service.getCourseType().subscribe((resp: any) => {
            this.courseType = resp.data;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._Service.getReward().subscribe((resp: any) => {
            this.rewardData = resp.data;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    course_reward(): FormArray {
        return this.formData.get('course_rewards') as FormArray;
    }
    newCourse_reward(): FormGroup {
        return this._formBuilder.group({
            id: '',
        });
    }
    removeCourse_reward(i: number): void {
        this.course_reward().removeAt(i);
    }
    addCourse_reward(): void {
        this.course_reward().push(this.newCourse_reward());
    }

    course_lecturer(): FormArray {
        return this.formData.get('course_lecturer') as FormArray;
    }
    newCourse_lecturer(): FormGroup {
        return this._formBuilder.group({
            image: '',
            name: '',
            detail: '',
        });
    }
    removeCourse_lecturer(a: number): void {
        this.course_lecturer().removeAt(a);
    }
    addCourse_lecturer(): void {
        this.course_lecturer().push(this.newCourse_lecturer());
        this.files1.push([]);
        console.log(this.files1);
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
        // console.log(this.files)
        // return
        const course_reward = [];
        this.formData.value.course_rewards.forEach((element) => {
            course_reward.push(element.id);
        });
        const course_lecturer = [];
        this.formData.value.course_lecturer.forEach((element) => {
            course_lecturer.push(element.id);
        });
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
        confirmation.afterClosed().subscribe(async (result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // console.log(this.formData.value)
                // return
                this.formData.patchValue({
                    course_reward: course_reward,
                });

                const video = new FormData();
                if (this.video !== null) {
                    // If video is not null, proceed with the upload process
                    const video = new FormData();
                    video.append('file', this.video);
                    video.append('path', 'images/course/');
                    const file = await lastValueFrom(
                        this._Service.uploadVideo(video)
                    );
                    this.formData.patchValue({ video: file });
                }

                const image = new FormData();
                if (this.image !== null) {
                    image.append('image', this.files[0]);
                    image.append('path', 'images/course/');
                    image.append('width', '265');
                    image.append('height', '177');
                    const file1 = await lastValueFrom(
                        this._Service.uploadImage(image)
                    );
                    this.formData.patchValue({ image: file1 });
                }
                for await (const tutor of this.course_lecturer().controls) {
                    console.log(tutor.value);
                    const imageArray = new FormData();
                    imageArray.append('image', tutor.value.image);
                    imageArray.append('path', 'images/course/');
                    imageArray.append('width', '265');
                    imageArray.append('height', '177');
                    const file1 = await lastValueFrom(
                        this._Service.uploadImage(imageArray)
                    );
                    tutor.patchValue({ image: file1 });
                }

                this._Service.new(this.formData.value).subscribe({
                    next: (resp: any) => {
                        this._router
                            .navigateByUrl('course/list')
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

    videoChange(event) {
        this.video = event.target.files[0];
    }

    onSelect(event) {
        this.files.push(...event.addedFiles);
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

    onSelect1(event, index) {
        this.files1[index] = [];
        this.files1[index].push(...event.addedFiles);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.course_lecturer().get([index]).patchValue({
            image: this.files1[index][0],
        });
    }

    onRemove1(event) {
        this.files1.splice(this.files1.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
    }

    changeType(event) {
        console.log(event);
        if (event.value == 'seminar') {
            this.formData.patchValue({
                sec: 0,
                hour: 0,
                min: 0,
                qty_lesson: 0,
            });
            this.type = 'seminar';
        } else if (event.value == 'online') {
            this.type = 'online';
        }
    }
}
