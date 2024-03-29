import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
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
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination, DataBank } from '../page.types';
import { Service } from '../page.service';
import { PictureComponent } from 'app/modules/admin/modules/recruit/picture/picture.component';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    animations: fuseAnimations,
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    Id: any;
    Data: any;
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
    toppings: any = [
        { id: 1, name: 'พระธรรมกาย' },
        { id: 2, name: 'พระวิริยะ' },
        { id: 3, name: 'พระมโนธรรม' },
    ];

    filterType: any;
    bank_trans_filter: any[] = [];

    rawDataFilter: any[] = [];
    filterData = [];
    dataRow = [];
    columns = [
        {
            price: 'price',
            type: 'type',
            remark: 'remark',
            create_by: 'create_by',
        },
    ];

    date: any;
    now: any;
    targetDate: any = new Date(2022, 10, 16);
    targetTime: any = this.targetDate.getTime();
    difference: number;
    months: Array<string> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    currentTime: any = `${
        this.months[this.targetDate.getMonth()]
    } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

    @ViewChild('days', { static: true }) days: ElementRef;
    @ViewChild('hours', { static: true }) hours: ElementRef;
    @ViewChild('minutes', { static: true }) minutes: ElementRef;
    @ViewChild('seconds', { static: true }) seconds: ElementRef;

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
            filter: '',
            type: '',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getById(this.Id).subscribe((resp: any) => {
            this.Data = resp.data;

            this.filterData = this.Data.user_job_interestings;
            this.rawDataFilter = this.filterData;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    tickTock() {
        this.date = new Date();
        this.now = this.date.getTime();
        this.days.nativeElement.innerText = Math.floor(this.difference);
        this.hours.nativeElement.innerText = 23 - this.date.getHours();
        this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
        this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
      }

    discard(): void {}

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        setInterval(() => {
            this.tickTock();
            this.difference = this.targetTime - this.now;
            this.difference = this.difference / (1000 * 60 * 60 * 24);
      
            !isNaN(this.days.nativeElement.innerText)
              ? (this.days.nativeElement.innerText = Math.floor(this.difference))
              : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
          }, 1000);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    createNewBranch(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มบัญชีธนาคารใหม่',
            message: 'คุณต้องการเพิ่มบัญชีธนาคารใหม่ใช่หรือไม่ ',
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
                console.log(this.formData.value);
            }
        });
    }
    showFlashMessage(arg0: string) {
        throw new Error('Method not implemented.');
    }

    CheckUserAppove(event): void {
        let formValue = this.formData.value.user_id;
        if (event.checked === true) {
            this.UserAppove.push(event.source.value);
            this.formData.patchValue({
                user_id: this.UserAppove,
            });

            // this.dataForm.get('componentData')['controls'][i].get('componentForm')['controls'][j].patchValue(formValue[j])
        } else {
            // this.UserAppove = this.UserAppove.filter((item) => item !== event.target.value)

            this.UserAppove = this.UserAppove.filter(function (
                value,
                index,
                arr
            ) {
                return value != event.checked;
            });
            this.formData.patchValue({
                user_id: this.UserAppove,
            });
        }
    }

    onFilter(event) {
        // ตัวให้เป็นตัวเล็กให้หมด
        let val = event.target.value.toLowerCase();
        // หา ชื่อ คอลัมน์
        let keys = Object.keys(this.columns[0]);
        // หาจำนวนคอลัม
        let colsAmt = keys.length;
        // console.log('keys', keys);
        this.Data.bank_trans = this.rawDataFilter.filter(function (item) {
            // console.log('item',item);
            for (let i = 0; i < colsAmt; i++) {
                //console.log(colsAmt);
                if (item[keys[i]]) {
                    if (
                        item[keys[i]].toString().toLowerCase().indexOf(val) !==
                            -1 ||
                        !val
                    ) {
                        // ส่งคืนตัวที่เจอ
                        return true;
                    }
                }
            }
        });
    }

    onFilter1(event) {
        // console.log('event',event);

        // ตัวให้เป็นตัวเล็กให้หมด
        let val = event.value.toLowerCase();

        // หา ชื่อ คอลัมน์
        let keys = Object.keys(this.columns[0]);
        //    console.log(keys)
        // หาจำนวนคอลัม

        let colsAmt = keys.length;

        this.Data.bank_trans = this.rawDataFilter.filter(function (item) {
            for (let i = 0; i < colsAmt; i++) {
                //console.log(colsAmt);
                if (item[keys[i]]) {
                    if (
                        item[keys[i]].toString().toLowerCase().indexOf(val) !==
                            -1 ||
                        !val
                    ) {
                        console.log(val);
                        // ส่งคืนตัวที่เจอ
                        return true;
                    }
                }
            }
        });
    }

    showPicture(imgObject: any): void {
        window.open(imgObject);
    }

    viewMap(start: string, end: string): void {
        this._router.navigate(['map/' + start + '/' + end]);
    }
}
