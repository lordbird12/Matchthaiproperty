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
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { Service } from '../page.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-dialog',
    templateUrl: './edit-dialog.component.html',
    styleUrls: ['./edit-dialog.component.scss'],

    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EditDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
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
    public id: any;
    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;

    url: any = [];
    files: File[] = [];

    constructor(
        public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
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
            // user_id: ['', Validators.required],
            approve: '',
            approve_remark: '',
        });
    }

    ngOnInit(): void {}

    onClose() {
        this.dialogRef.close();
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

    Submit(): void {
        console.log(this.formData.value);
        // const end =  moment(this.addForm.value.register_date).format('YYYY-MM-DD')
        // console.log(end)
        // this.addForm.patchValue({
        //   register_date:end
        // })
        const confirmation = this._fuseConfirmationService.open({
            title: 'ติดตามสถานะ',
            message: 'คุณต้องการยืนยันการติดตามสถานะใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Confirm',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                const formValue = this.formData.value;
                this._Service
                    .followstatus(this.data.itemid, formValue)
                    .subscribe({
                        next: (resp: any) => {
                            this.dialogRef.close();
                        },

                        error: (err: any) => {
                            console.log(err);
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'Confirm',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'Cancel',
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
    New(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        console.log('this.id:', this.id);
        const confirmation = this._fuseConfirmationService.open({
            title: 'ติดตามสถานะ',
            message: 'คุณต้องการบันทึกสถานะใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:plus-circle',
                color: 'info',
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
                console.log('formdata', this.formData.value);

                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                console.log('this.id before calling service:', this.id);
                this._Service.followstatus(this.id, formData).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this.dialogRef.close();
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
                    },
                });
            }
        });
    }

    showFlashMessage(type): void {
        if (type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูลเรียบร้อย',
                message: 'ขอบคุณครับ',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    },
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });

            setTimeout(() => {
                this.flashMessage = null;
                this._changeDetectorRef.markForCheck();
                // this.dialogRef.close()
            }, 3000);
        } else {
            // error
        }
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            file: this.files[0],
        });
        // console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            file: '',
        });
        // console.log(this.formData.value)
    }

    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        reader.onload = (e: any) => (this.url = e.target.result);
        const file = event.target.files[0];
        this.formData.patchValue({
            file: file,
        });
        this._changeDetectorRef.markForCheck();
    }
}
