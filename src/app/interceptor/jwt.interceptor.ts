import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(NgxUiLoaderService);
  loader.start();
  const token = localStorage.getItem('token');
  if(token){
    req = req.clone({
      setHeaders: {Authorization: token}
    })
  }
  return next(req).pipe(finalize(() => loader.stop()));
};
