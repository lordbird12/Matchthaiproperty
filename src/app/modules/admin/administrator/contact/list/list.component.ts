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
import { AssetType, DataPosition, PositionPagination } from '../page.types';
import { Service } from '../page.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    dtOptions: DataTables.Settings = {};
    dataRow: any = [];
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    quillModules: any = {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
          ['link','image']
          
        ]
      };
    displayedColumns: string[] = [
        'id',
        'name',
        'status',
        'create_by',
        'created_at',
        'actions',
    ];
    dataSource: MatTableDataSource<DataPosition>;

    products$: Observable<any>;
    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    itemData: any = [];
    formData: FormGroup;

    supplierId: string | null;
    pagination: PositionPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {
        this.formData = this._formBuilder.group({
            id: '1',
            condition_asset: '',
            condition_inquiry: '',
            condition_announcer_agent: '',
            share_condition_asset: '',
            share_condition_inquiry: '',
            condition_app: '',

            text_check_condition_asset: '',
            text_check_share_condition_asset: '',
            text_check_condition_inquiry: '',
            text_check_share_condition_inquiry: '',
            text_check_condition_app: '',



            url_youtube_channel: '',
            lat: '',
            long: '',
            address: '',
            tel1: '',
            tel2: '',
            email1: '',
            email2: '',
            facebook: '',
            line: '',
            ig: '',
            twitter: '',
            youtube: '',
            tiktok: '',
            line_oa_url: '',
            facebook_url: '',
            twitter_url: '',
            ig_url: '',
            about_us: '',
            shot_desception_web: '',
            announcer_agent_agree:'',
            comment_news:'',
            review_web:'',
            comment_course:'0',
            
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._Service.getById(1).subscribe((resp: any) => {
            this.itemData = resp.data;
            this.formData.patchValue({
                condition_asset: this.itemData.condition_asset,
                condition_inquiry: this.itemData.condition_inquiry,
                share_condition_asset: this.itemData.share_condition_asset,
                share_condition_inquiry: this.itemData.share_condition_inquiry,
                condition_app: this.itemData.condition_app,
                condition_announcer_agent: this.itemData.condition_announcer_agent,

                text_check_condition_asset: this.itemData.text_check_condition_asset,
                text_check_share_condition_asset: this.itemData.text_check_share_condition_asset,
                text_check_condition_inquiry: this.itemData.text_check_condition_inquiry,
                text_check_share_condition_inquiry: this.itemData.text_check_share_condition_inquiry,
                text_check_condition_app: this.itemData.text_check_condition_app,
                announcer_agent_agree: this.itemData.announcer_agent_agree,

                url_youtube_channel: this.itemData.url_youtube_channel,
                lat: this.itemData.lat,
                long: this.itemData.long,
                address: this.itemData.address,
                tel1: this.itemData.tel1,
                tel2: this.itemData.tel2,
                email1: this.itemData.email1,
                email2: this.itemData.email2,
                facebook: this.itemData.facebook,
                line: this.itemData.line,
                ig: this.itemData.ig,
                twitter: this.itemData.twitter,
                youtube: this.itemData.youtube,
                tiktok: this.itemData.tiktok,
                line_oa_url: this.itemData.line_oa_url,
                facebook_url: this.itemData.facebook_url,
                twitter_url: this.itemData.twitter_url,
                ig_url: this.itemData.ig_url,
                about_us: this.itemData.about_us,
                shot_desception_web: this.itemData.shot_desception_web,
                comment_news: this.itemData.comment_news,
                review_web: this.itemData.review_web,
                comment_course: this.itemData.comment_course,

            });
            this._changeDetectorRef.markForCheck();
        });
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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resetForm(): void {
        this.filterForm.reset();
        this.filterForm.get('asset_type').setValue('default');
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Show flash message
     */
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

    edit(id: string): void {
        this._router.navigate(['round/edit/' + id]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }

    update(): void {
        this.flashMessage = null;

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
                this._Service.update(this.formData.value).subscribe({
                    next: (resp: any) => {
                        this._Service.getById(1).subscribe((resp: any) => {
                            this.itemData = resp.data;
                            this.formData.patchValue({
                                condition_asset: this.itemData.condition_asset,
                                condition_inquiry: this.itemData.condition_inquiry,
                                share_condition_asset: this.itemData.share_condition_asset,
                                share_condition_inquiry: this.itemData.share_condition_inquiry,
                                condition_app: this.itemData.condition_app,
                                url_youtube_channel: this.itemData.url_youtube_channel,
                                lat: this.itemData.lat,
                                long: this.itemData.long,
                                address: this.itemData.address,
                                tel1: this.itemData.tel1,
                                tel2: this.itemData.tel2,
                                email1: this.itemData.email1,
                                email2: this.itemData.email2,
                                facebook: this.itemData.facebook,
                                line: this.itemData.line,
                                ig: this.itemData.ig,
                                twitter: this.itemData.twitter,
                                youtube: this.itemData.youtube,
                                tiktok: this.itemData.tiktok,
                                line_oa_url: this.itemData.line_oa_url,
                            });
                            this._changeDetectorRef.markForCheck();
                        });
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
                        // console.log(err.error.message)
                    },
                });
            }
        });
    }
}
