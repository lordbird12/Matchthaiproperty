


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Service, } from './page.service';
import { AssetType, Chat, Division, BranchPagination, BranchProduct, BranchProductDetail, Store, StoreType } from './logistic.types';

@Injectable({
  providedIn: 'root'
})
export class PageResolve implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(
    // private _Service: UserService,
    private _Service: Service,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chat[]> | any {
    return this._Service.getChatById('f73a5a34-a723-4b35-8439-5289e0164c83')
      .pipe(
        // Error here means the requested chat is not available
        catchError((error) => {

          // Log the error
          console.error(error);

          // Get the parent url
          const parentUrl = state.url.split('/').slice(0, -1).join('/');

          // Navigate to there
          this._router.navigateByUrl(parentUrl);

          // Throw an error
          return throwError(error);
        })
      );
  }
}

