import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, Action } from '@ngrx/store';
import {
  StoreDevtoolsModule,
  StoreDevtools,
  StoreDevtoolsOptions,
} from '@ngrx/store-devtools';

describe('Devtools Integration', () => {
  function setup(options: Partial<StoreDevtoolsOptions> = {}) {
    @NgModule({
      imports: [
        StoreModule.forFeature('a', (state: any, action: any) => state),
      ],
    })
    class EagerFeatureModule {}

    @NgModule({
      imports: [
        StoreModule.forRoot({}),
        EagerFeatureModule,
        StoreDevtoolsModule.instrument(options),
      ],
    })
    class RootModule {}

    TestBed.configureTestingModule({
      imports: [RootModule],
    });

    const store = TestBed.get(Store) as Store<any>;
    const devtools = TestBed.get(StoreDevtools) as StoreDevtools;
    return { store, devtools };
  }

  afterEach(() => {
    const devtools = TestBed.get(StoreDevtools) as StoreDevtools;
    devtools.reset();
  });

  it('should load the store eagerly', () => {
    let error = false;

    try {
      const { store } = setup();
      store.subscribe();
    } catch (e) {
      error = true;
    }

    expect(error).toBeFalsy();
  });

  it('should not throw if actions are ignored', (done: any) => {
    const { store, devtools } = setup({
      predicate: (_, { type }: Action) => type !== 'FOO',
    });
    store.subscribe();
    devtools.dispatcher.subscribe((action: Action) => {
      if (action.type === 'REFRESH') {
        done();
      }
    });
    store.dispatch({ type: 'FOO' });
    devtools.refresh();
  });

  it('should not throw if actions are blacklisted', (done: any) => {
    const { store, devtools } = setup({
      actionsBlacklist: ['FOO'],
    });
    store.subscribe();
    devtools.dispatcher.subscribe((action: Action) => {
      if (action.type === 'REFRESH') {
        done();
      }
    });
    store.dispatch({ type: 'FOO' });
    devtools.refresh();
  });

  it('should not throw if actions are whitelisted', (done: any) => {
    const { store, devtools } = setup({
      actionsWhitelist: ['BAR'],
    });
    store.subscribe();
    devtools.dispatcher.subscribe((action: Action) => {
      if (action.type === 'REFRESH') {
        done();
      }
    });
    store.dispatch({ type: 'FOO' });
    devtools.refresh();
  });
});
