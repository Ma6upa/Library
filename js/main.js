let write = document.getElementById('write');
let upload = document.getElementById('upload');
let writeForm = document.forms.writeForm;
let uploadForm = document.forms.uploadForm;

var data = localStorage.getItem('library');
var library = data ? JSON.parse(data) : [];

writeForm.style = 'display: none';
uploadForm.style = 'display: none';

write.addEventListener('click', function () {
    uploadForm.style = 'display: none';
    writeForm.style = 'display: block';
})

upload.addEventListener('click', function () {
    writeForm.style = 'display: none';
    uploadForm.style = 'display: block';
})

document.querySelector('#writeButton').addEventListener('click', function writeBook() {
    let title = document.querySelector('.addNewBook__form-name').value;
    let text = document.querySelector('.addNewBook__form-text').value;
    let book = {
        title: title,
        text: text,
        id: Date.now(),
        wasRead: false,
        isFavorite: false
    }
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
    location.reload()
});

document.querySelector('#uploadButton').addEventListener('click', function uploadBook () {
    let formData = new FormData(uploadForm);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://apiinterns.osora.ru/');
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
            let book = {
                title: formData.get('login'),
                text: JSON.parse(this.response).text,
                id: Date.now(),
                wasRead: false
            }
            library.push(book);
            localStorage.setItem('library', JSON.stringify(library));
            location.reload()
    }
    xhr.send(formData);
});

function sort() {
    let unsorted = localStorage['library'];
    localStorage['library'] != undefined ? unsorted = JSON.parse(localStorage['library']) : console.log('пустой LS');
    let read = [];
    let unread = [];
    for(let i = 0; i < unsorted.length; i++){
        if(unsorted[i].wasRead == true){
            read.push(unsorted[i]);
        } else {
            unread.push(unsorted[i]);
        }
    }
    read.sort(function (a, b) {
        return b.id - a.id;
    });
    unread.sort(function (a, b) {
        return b.id - a.id;
    });
    let sorted = read.concat(unread);
    localStorage.setItem('library', JSON.stringify(sorted));
}

function read(id){
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS')
    let book = books.find(book => book.id == id);
    let readSpace = document.createElement('div');
    let oldSpace = document.getElementsByClassName('read__space');
    document.querySelector('.read').replaceChild(readSpace, oldSpace[0]);
    readSpace.classList.add('read__space');
    readSpace.innerHTML = book.text;
}

function deleteBook(id){
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS');
    let book = books.find(book => book.id === id);
    let number =  books.indexOf(book);
    books.splice(number, 1);
    localStorage.setItem('library', JSON.stringify(books));
    bookList();
    location.reload();
}

function changeStatus(id){
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS');
    let book = books.find(book => book.id === id);
    let number =  books.indexOf(book);
    books[number].wasRead = !books[number].wasRead;
    localStorage.setItem('library', JSON.stringify(books));
    bookList();
}

function edit(id){
    document.querySelector('.read__space').innerHTML='';
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS ')
    let book = books.find(book => book.id === id);
    let newForm = document.createElement('form');
    newForm.style.display = 'flex';
    newForm.style.flexDirection = 'column';
    let newTitle = document.createElement('input');
    newTitle.setAttribute('value', `${books[books.indexOf(book)].title}`);
    let newText = document.createElement('textarea');
    newText.style.width = '70%';
    newText.style.height = '70%';
    newText.style.wordWrap = 'break-word';
    newText.innerHTML = `${books[books.indexOf(book)].text}`;
    let newButton = document.createElement('input');
    newButton.setAttribute('type', 'button');
    newButton.setAttribute('value', 'Сохранить книгу');
    newButton.addEventListener('click', function(){
        books[books.indexOf(book)].title = newTitle.value;
        books[books.indexOf(book)].text = newText.value;
        document.querySelector('.read__space').innerHTML='';
        localStorage.setItem('library', JSON.stringify(books));
        bookList()
    });
    document.querySelector('.read__space').appendChild(newForm);
    newForm.appendChild(newTitle);
    newForm.appendChild(newText);
    newForm.appendChild(newButton);
}

function bookList() {
    sort()
    let booksList = document.querySelector('.books__list');
    booksList.innerHTML = '';
    let favBooks = document.querySelector('.favorites__books');
    favBooks.innerHTML = '';
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS');

    if(localStorage['library'] != undefined){
        let booksArrCopy = books

        for(let i = 0; i < booksArrCopy.length ; i++) {
            let id = booksArrCopy[i].id.toString();
            let book = document.createElement('div');

            booksList.appendChild(book);
            if(booksArrCopy[i].isFavorite == true){
                favBooks.appendChild(book);
            }
            if (booksArrCopy[i].wasRead == false){
                book.classList.add('books__item');
            } else {
                book.classList.add('books__item-wasRead');
            }

            book.setAttribute('id', id);
            book.setAttribute('draggable', 'true');
            book.ondragstart = dragStart;
            book.ondragend = dragEnd;

            let bookTitle = document.createElement('div');
            book.appendChild(bookTitle);
            bookTitle.classList.add('books__item-title');
            bookTitle.innerHTML = booksArrCopy[i].title;
    
            let readButton = document.createElement('input');
            book.appendChild(readButton)
            readButton.classList.add('books__item-button');
            readButton.setAttribute('type', 'button');
            readButton.setAttribute('value', 'Читать книгу');
            readButton.setAttribute('onClick', `read(${id})`);
    
            let deleteButton = document.createElement('input');
            book.appendChild(deleteButton)
            deleteButton.classList.add('books__item-button-delete');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('value', 'Удалить книгу');
            deleteButton.setAttribute('onClick', `deleteBook(${id})`);
    
            let changeStatusButton = document.createElement('input');
            book.appendChild(changeStatusButton)
            changeStatusButton.classList.add('books__item-button');
            changeStatusButton.setAttribute('type', 'button');
            changeStatusButton.setAttribute('value', 'Статус');
            changeStatusButton.setAttribute('onClick', `changeStatus(${id})`);
    
            let editButton = document.createElement('input');
            book.appendChild(editButton)
            editButton.classList.add('books__item-button');
            editButton.setAttribute('type', 'button');
            editButton.setAttribute('value', 'Редактировать книгу');
            editButton.setAttribute('onClick', `edit(${id})`);
        }
    }
}

const dropzone = document.querySelector('.dropzone-start')
dropzone.ondragover = allowDrop;
dropzone.ondrop = drop;
    
function allowDrop(event){
    event.preventDefault();
}

function dragStart(event){
    dropzone.classList.add('dropzone-drop');
    event.dataTransfer.setData('id', event.target.id);
    console.log(event.target.id);
    dropzone.innerHTML = 'Любимые книги';
}

function dragEnd(){
    dropzone.classList.remove('dropzone-drop');
    dropzone.classList.add('dropzone-start');
    dropzone.innerHTML = '';
}

function drop(event){
    let bookId = event.dataTransfer.getData('id');
    let books = localStorage['library'];
    localStorage['library'] != undefined ? books = JSON.parse(localStorage['library']) : console.log('пустой LS');
    let book = books.find(book => book.id === Number(bookId));
    let number =  books.indexOf(book);
    books[number].isFavorite = true;
    localStorage.setItem('library', JSON.stringify(books));
    bookList();
}

window.onload = bookList