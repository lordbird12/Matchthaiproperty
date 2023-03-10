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

    files: File[] = [];
    getMenu: any = [];
    statusData = [
        { value: 'Yes', name: 'อนุมัติใช้งาน' },
        { value: 'No', name: 'ไม่อนุมัติ' },
        { value: 'Request', name: 'รออนุมัติ' },
    ];

    Id: any;
    permissionName: any = [];

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
            id: '',
            name: '',
            menu: '',
            menu_id: 1,
            status: '',
            view: '',
            save: '',
            edit: '',
            delete: '',

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
        this.formData = this._formBuilder.group({
            name: ['', Validators.required],
            menu: this._formBuilder.array([]),
        });
        const menus = await lastValueFrom(this._Service.getMenu())
        this.getMenu = menus.data
        // console.log(menus.data)
        // this._Service.getMenu().subscribe((resp: any) => {
        //     this.getMenu = resp.data;
        //     this._changeDetectorRef.markForCheck();
        // })

        const resp = await lastValueFrom(this._Service.getById(this.Id))


        this.itemData = resp.data;
        for (const menu of this.itemData) {
            console.log(menu)
            let item = this._formBuilder.group({
                id: '',
                name: menu.name,
                menu_id: menu.menu_id,
                view: menu.view == 1 ? true : false,
                save: menu.save == 1 ? true : false,
                delete: menu.delete == 1 ? true : false,
                edit: menu.edit == 1 ? true : false,
            })
            this.permission().push(item)
        }
        this._changeDetectorRef.markForCheck();
        // this.formData.patchValue({
        //     id: this.itemData[0].id,
        //     name: this.itemData[0].name,
        //     status: this.itemData.status,
        //     menu: this.itemData.menu,
        //     menu_id: this.itemData[0].menu_id,
        //     view: this.itemData[0].view  == 1 ? true : false, 
        //     save: this.itemData[0].save  == 1 ? true : false, 
        //     edit: this.itemData[0].edit  == 1 ? true : false, 
        //     delete: this.itemData[0].delete  == 1 ? true : false, 
        // });


        // this._Service.getById(this.Id).subscribe((resp: any) => {
        //     this.itemData = resp.data;
        //     for (const menu of this.itemData) {
        //         console.log(menu)
        //         let item = this._formBuilder.group({
        //           id: '',
        //           name: menu.name,
        //           menu_id: menu.id,
        //           view: menu.view  == 1 ? true : false, 
        //           save: menu.save  == 1 ? true : false, 
        //           edit: menu.edit  == 1 ? true : false, 
        //           delete: menu.delete  == 1 ? true : false, 
        //         })
        //         this.permission().push(item)
        //       }
        //     this.formData.patchValue({
        //         id: this.itemData[0].id,
        //         name: this.itemData[0].name,
        //         status: this.itemData.status,
        //         menu: this.itemData.menu,
        //         menu_id: this.itemData[0].menu_id,
        //         view: this.itemData[0].view  == 1 ? true : false, 
        //         save: this.itemData[0].save  == 1 ? true : false, 
        //         edit: this.itemData[0].edit  == 1 ? true : false, 
        //         delete: this.itemData[0].delete  == 1 ? true : false, 
        //     });
        // });
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
    permission(): FormArray {
        return this.formData.get('menu') as FormArray;
    }
    newPermission(): FormGroup {
        return this._formBuilder.group({
            menu_id: '',
            view: '',
            save: '',
            edit: '',
            delete: '',
        });
    }
    addPermission(): void {
        this.permission().push(this.newPermission());
    }
    update(): void {
        // const data = {
        //     "name": this.formData.value.name,
        //     "menu": [
        //         {
        //             "menu_id": 1,
        //             "view":this.formData.value.view == true ? 1 : 0, 
        //             "save":this.formData.value.save == true ? 1 : 0,
        //             "edit":this.formData.value.edit == true ? 1 : 0,
        //             "delete": this.formData.value.delete == true ? 1 : 0,
        //         }
        //     ]
        // }
        this.flashMessage = null;
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
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                const menuedit = []
                for (const m of this.formData.value.menu) {
                    const menunew =
                    {
                        "menu_id":m.menu_id,
                        "view": m.view? 1:0 ,
                        "save": m.save? 1:0,
                        "delete":m.delete? 1:0,
                        "edit": m.edit? 1:0,
                     
                    }
                    menuedit.push(menunew)
                }
                const payload = {name:this.formData.value.name,menu:menuedit}



                this._Service.update(payload, this.Id).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router
                            .navigateByUrl('permission/list')
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
