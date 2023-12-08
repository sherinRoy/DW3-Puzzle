import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { searchBooks } from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: { books: { entities: [] } },
        }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('searchBooks()', () => {
    it('should see the search results for all distinct input in every 500ms', fakeAsync(() => {
      component.searchForm.controls.term.setValue('Javascript');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'Javascript' })
      );

      component.searchForm.controls.term.setValue('Java');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'Java' })
      );
    }));

    it('should not see the search results when input received before 500ms', fakeAsync(() => {
      component.searchForm.controls.term.setValue('Javascript');
      tick(500);

      component.searchForm.controls.term.setValue('Java');
      tick(300);

      component.searchForm.controls.term.setValue('Javascript');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'Javascript' })
      );
    }));

    it('should see the existing search result when received same input for search term', fakeAsync(() => {
      component.searchForm.controls.term.setValue('Javascript');
      tick(500);

      component.searchForm.controls.term.setValue('Javascript');
      tick(500);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    }));
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe to input stream when component is destroyed', fakeAsync(() => {
      component.ngOnDestroy();

      component.searchForm.controls.term.setValue('Javascript');

      tick(500);

      expect(store.dispatch).not.toHaveBeenCalled();
    }));
  });
});
