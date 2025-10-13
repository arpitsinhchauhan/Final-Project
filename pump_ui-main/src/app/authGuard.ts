import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { UserServiceService } from './services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  
  constructor(private authService: UserServiceService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = localStorage.getItem('role');
     const userId = localStorage.getItem('userId');

    if (!isLoggedIn) {
      this.router.navigate(['/']);
       return of(false);
    }

    // Check route path
    const requestedPath = state.url;

    // if (username === 'aaa' && requestedPath === '/User') {
    //   this.router.navigate(['/dashboard']);
    //   return false;
    // }

    if (role === 'admin' && requestedPath !== '/User') {
      this.router.navigate(['/User']);
       return of(false);
    }
  
    // User: block access to /User, redirect to /dashboard
    if (role === 'user' && requestedPath === '/User') {
      this.router.navigate(['/dashboard']);
     return of(false);
    }
   if (requestedPath === '/XPpetrol' || requestedPath === '/powerDiesel' ||  requestedPath === '/extraDipp' ||  requestedPath === '/extraPurchasedetails') {
      return this.authService.getUserPump(userId).pipe(
        map(response => {
          const data = response?.data;
          if (requestedPath === '/XPpetrol' && data?.xp_petrol_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/powerDiesel' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/extraDipp' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/extraPurchasedetails' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          return true;
        }),
        catchError(error => {
          console.error('AuthGuard error:', error);
          this.router.navigate(['/']);
          return of(false);
        })
      );
    }
     return of(true);
  }
  

}
