import {
  Component,
  Input,
  AfterContentInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PrettyPrinter } from '../code/pretty-printer.service';

const EFFECTS_EXAMPLE = `
@Effect() search$ = this.actions$.pipe(
  ofType<SearchAction>(BookActions.Types.Search),
  map(action => action.query),
  exhaustMap(query =>
    this.googleBooksService.search(query)
  ),
);`;

const SCHEMATICS_EXAMPLE = `
$ ng g store State --root --module app.module.ts
 create src/app/reducers/index.ts
 update src/app/app.module.ts
`;

@Component({
  selector: 'ngrx-code-block',
  template: `
    <pre class="prettyprint" #codeContainer></pre>
  `,
})
export class CodeBlockComponent implements AfterContentInit {
  @Input() code = '';

  @ViewChild('codeContainer', { read: ElementRef })
  codeContainer;

  formattedCode = '';

  constructor(private pretty: PrettyPrinter) {}

  ngAfterContentInit() {
    let code = this.code === 'effects' ? EFFECTS_EXAMPLE : SCHEMATICS_EXAMPLE;

    this.pretty.formatCode(code).subscribe(formattedCode => {
      this.codeContainer.nativeElement.innerHTML = formattedCode;
    });
  }
}
