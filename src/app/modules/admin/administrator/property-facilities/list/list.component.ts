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
import { AssetType, BranchPagination, DataBranch } from '../page.types';
import { Service } from '../page.service';
import { NewComponent } from '../new/new.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { PictureComponent } from '../picture/picture.component';
@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations,
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    public dataGrid: any[];
    formData: FormGroup
    public TypeList: any = [];
    private destroy$ = new Subject<any>();
    // dataRow: any = []
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'name',
        'status',
        'property_facility',
    ];
    dataSource: MatTableDataSource<DataBranch>;

    products$: Observable<any>;
    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl(null);
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    me: any | null;
    get roleType(): string {
        return 'marketing';
    }

    supplierId: string | null;
    pagination: BranchPagination;

    totalSummary: any;
    totalRows: any;
    totalRowSummary: any;

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
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadTable();
        this.formData = this._formBuilder.group({
            property_facility_id: [null, Validators.required],
   
        });
       
        this._Service.getPropertyTypeId().subscribe((resp: any) => {
            this.TypeList = resp.data;
            this._changeDetectorRef.markForCheck();
        });
        




    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            order: [[0, 'desc']],
            pagingType: 'full_numbers',
            pageLength: 100,
            serverSide: true,
            processing: true,
            responsive: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = '';
                dataTablesParameters.property_facility_id = this.formData.value.property_facility_id;
                if(!!dataTablesParameters.property_facility_id)
                {               
                     that._Service
                    .getPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
                }
                else
                {          
                    callback({
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                });
                 }


            },
            columns: [
                { data: 'name' },
                { data: 'status' },
                { data: 'property_facility' },
                { data: 'actice', orderable: false },
                { data: 'actice', orderable: false },
            ]
        };
    }

    totalPriceTable() {
        let total = 0;
        for (let data of this.dataRow) {
            total += Number(data.summary);
        }
        return total;
    }

    totalPrice() {
        let total = 0;
        for (let data of this.dataGrid) {
            total += Number(data.summary);
        }
        return total;
    }

    totalTrans() {
        let total = 0;
        for (let data of this.dataGrid) {
            total += data.today.length;
        }
        return total;
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
    Search() {
        this.rerender();
      
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

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

    edit(Id: string): void {
        this._router.navigate(['property-facilities/edit/' + Id]);
    }

    viewDetail(Id: string): void {
        this._router.navigate(['property-facilities/detail/' + Id]);
    }
    add(Id: string): void {
        this._router.navigate(['property-facilities/add/' + Id]);
    }
    
    textStatus(status: string): string {
        return startCase(status);
    }



    Delete(id) {
        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันลบข้อมูล",
            "message": "คุณต้องการลบข้อมูลใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });
        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                this._Service
                    .delete(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "ลบข้อมูล",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {
                                this.rerender();
                            })
                        }
                    });

            }
        });

    }

    showPicture(imgObject: any): void {
        this._matDialog.open(PictureComponent, {
            autoFocus: false,
            data: {
                imgSelected: imgObject
            }
        })
            .afterClosed()
            .subscribe(() => {

                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
}
