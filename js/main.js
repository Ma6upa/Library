let write = document.getElementById('write');
let upload = document.getElementById('upload');
let writeForm = document.forms.writeForm;
let uploadForm = document.forms.uploadForm;

let library = [];

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
    }
    library.push(book);
    localStorage.setItem('xdd', JSON.stringify(library));
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
                id: Date.now()
            }
            library.push(book);
            localStorage.setItem('library', JSON.stringify(library));
    }
    xhr.send(formData);
});
