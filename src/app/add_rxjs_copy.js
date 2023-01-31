import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';

self.ctx.rxjs = {
          ...RxJS,
          ...RxJSOperators
        };

console.log('resource works');
