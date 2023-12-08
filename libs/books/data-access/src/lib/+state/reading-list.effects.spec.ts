import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ReadingListEffect', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let item: ReadingListItem;
  let book: Book;

  beforeAll(() => {
    item = createReadingListItem('A');
    book = createBook('A');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule,MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    actions = new ReplaySubject();
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add a book to the reading list successfully', (done) => {
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush({});
    });

    it('should undo the added book when API returns error', (done) => {
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });

      httpMock
        .expectOne('/api/reading-list')
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('confirmAddBook$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openSnackBar');
    });

    it('should open snackbar when a book is added successfully to reading list', () => {
      actions.next(ReadingListActions.confirmedAddToReadingList({ book }));

      effects.undoAddtoReadingList$.subscribe(() => {
        expect(effects.openSnackBar).toHaveBeenCalledWith(
          'Added "' + `${book.title}` + '" to the reading list',
          'Undo',
          ReadingListActions.removeFromReadingList({
            item,
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after removing a book', () => {
      actions.next(ReadingListActions.confirmedAddToReadingList({ book }));

      effects.undoAddtoReadingList$.subscribe(() => {
        expect(effects.openSnackBar).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeBook$', () => {
    it('should remove book successfully from reading list', (done) => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item,
          })
        );
        done();
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({});
    });

    it('should undo removed book when API returns error', (done) => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({
            item,
          })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${item.bookId}`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('confirmRemoveBook$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openSnackBar');
    });

    it('should open snackbar when book is removed successfully from reading list', () => {
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item }));

      effects.undoRemoveFromReadingList$.subscribe(() => {
        expect(effects.openSnackBar).toHaveBeenCalledWith(
          'Removed "' + `${item.title}` + '" from the reading list',
          'Undo',
          ReadingListActions.addToReadingList({
            book,
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after adding a book', () => {
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item }));

      effects.undoRemoveFromReadingList$.subscribe(() => {
        expect(effects.openSnackBar).not.toHaveBeenCalled();
      });
    });
  });
});
