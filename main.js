// Book Class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static displayBooks() {
        // get books from local storage
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        // grab the list
        const list = document.querySelector('#book-list');

        // create a table row
        const row = document.createElement('tr');

        // feed data into the row
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" role="button" class="btn btn-danger btn-sm delete">X</a></td>
        `

        // apend the row into DOM
        list.appendChild(row);
    }

    static deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 1 second
        setTimeout(() => document.querySelector('.alert').remove(), 1000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}

// Store class: Handles SStorage
class Store {
    static getBooks() {
        // create a new array books → local storage stores data as a string, not an object
        let books;
        if (localStorage.getItem('books') === null) {
            // if localStorage doesn't have any content, initialise book to empty string
            books = [];
        } else {
            // if localStorage has any content, load the content into books
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        // get the books from localstorage
        const books = Store.getBooks();
        // push the newly added book into the books array
        books.push(book);

        // reset the local storage books string as per the JS array books
        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) {
        // get the books from localstorage
        const books = Store.getBooks();

        // let i = 0;
        books.forEach((book, index) => {
            // match the passed isbn to the isbn of book being looped
            if (book.isbn === isbn) {
                // splie the object array at given index

                // index is inbuilt in JS forEach thatcarries the index of the current element
                books.splice(index, 1);
            }
            // i++;
        });

        // update local storage with updated list
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Activate button on data filling
document.querySelector('#book-form').addEventListener('keyup', (e) => {

    //prevent default
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate the data
    if (title == '' || author == '' || isbn == '') {
        document.querySelector('#addBookButton').setAttribute('disabled','');
    } else {
        document.querySelector('#addBookButton').removeAttribute('disabled');
    }
})


// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //prevent default
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate the data
    if (title == '' || author == '' || isbn == '') {
        alert('Please enter the data');
    } else {
        // Instantiate book
        const book = new Book(title, author, isbn);

        // add book to UI
        UI.addBookToList(book);

        //store book tolocalstorage
        Store.addBook(book);

        // Clear fields
        UI.clearFields();

        //disable the button
        document.querySelector('#addBookButton').setAttribute('disabled', '');

        // Show book added alert
        UI.showAlert('Book added to List', 'success');
    }
})

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {

    //prevent default
    e.preventDefault();

    //removebook from UI
    UI.deleteBook(e.target);

    // remove book from local storage
    const isbn = e.target.parentElement.previousElementSibling.textContent;
    Store.removeBook(isbn);

    // Show book delted alert
    UI.showAlert('Book Removed from List', 'info');
})