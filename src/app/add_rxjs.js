import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';

// export class WidgetContext {
//       rxjs = {
//         ...RxJS,
//         ...RxJSOperators
//       };
//   }

self.ctx.rxjs = {
          ...RxJS,
          ...RxJSOperators
        };
