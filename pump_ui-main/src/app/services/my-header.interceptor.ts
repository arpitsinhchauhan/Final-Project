import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const clonedRequest = req.clone({
      setHeaders: {
        'Bypass-Tunnel-Reminder': 'true'
      }
    });

    // Pass the cloned request with the header to the next handler.
    return next.handle(clonedRequest);
  }

}
