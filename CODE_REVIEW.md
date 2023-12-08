**Code Smells**

1.	Used `ngSubmit` instead of `submit`

    it’s a good practice to use `ngSubmit` for reactive forms instead of `submit` button as it provides more control over form behaviour, and enhances the overall maintainability and testability of the code. So replaced `submit` with `ngSubmit` in `book-search.component.html`.

2.	formateDate function is removed, instead added built-in date pipe

    Replaced custom `formatDate()` with pipes for date formatting in `book-search.component.html`, as pipes evaluate expressions only once which improves efficiency compared to a custom method that might be re-evaluated frequently.

3.	Removed unnecessary code : async pipe is used for displaying books data

    `book-search.component.ts` has `this.store.select(getAllBooks)` which is not unsubscribed, hence async pipe is added in the template to prevent potential memory leaks by automatically handling subscription management and ensuring proper clean-up of resources.

4.	changed name convention -book for b in `book-search.component.html`, `reading-list.component.html`. Provides a concise and potentially clearer representation, enhancing code readability.

5.	Test cases failure

    Testcases for `reading-list.reducer.spec.ts`, `reading-list.effect.spec.ts`, `books.reducer.spec.ts` were failing and fixed those testcases by making code changes.

**Accessibility**

Lighthouse Report:

1.	Buttons do not have accessible name. It is fixed by adding `aria-label` attribute.
2.	Increased text colour from gray40 to gray80 so that contrast ratio between foreground and background colours will be  adjusted.

**Manually Detected:**

1. Added `alt` attribute for img tags to provide alternate text in case the image fails to load. Here Empty `alt` attribute is used to indicate that the image is decorative. It is added in `book-search.component.html` and `reading-list.component.html` files.
2.	In `book-search.component.html` the anchor tag(<a>) used as a button is replaced with an actual button element(<button>) and a click event listener is used. Elements not intended for redirection or navigation should not be wrapped in tag. It is specifically used for creating hyperlinks and using it incorrectly can lead to unexpected behaviour or accessibility issues.
3.	The buttons can be made visually focusable and accessible. The closing button of reading list in `app.component.html` is made focusable by adding outline in `app.component.scss`.
