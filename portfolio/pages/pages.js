window.addEventListener('DOMContentLoaded', (event) => {
    tryClearStorage();

    let plus = document.getElementById('plus');
    let page = document.getElementById('page');
    let index = document.getElementById('index');

    plus.addEventListener('click', addNewPage);
    page.addEventListener('keyup', savePage);

    let pageCount = 0;
    let currentPageNumber = 0;

    try {
        loadPageCount();
        loadCurrentPage();
    } catch (error) {
        console.error(error);
    }

    function loadCurrentPage() {
        let hash = window.location.hash;
        if (hash === '') {
            currentPageNumber = 0;
        }
        else {
            currentPageNumber = hash.replace('#', '');
            currentPageNumber = parseInt(currentPageNumber);
        }

        let currentPage = localStorage.getItem(`pages-page${currentPageNumber}`);
        if (currentPage === null) {
            throw 'Current page does not exist.';
        }
        else {
            page.innerHTML = currentPage;
        }
    }

    function loadPageCount() {

        if (localStorage.getItem('pages-pageCount') === null) {
            localStorage.setItem('pages-pageCount', pageCount);
        }

        pageCount = localStorage.getItem('pages-pageCount');
        pageCount = parseInt(pageCount);
        createLinks();
    }

    function savePage(event) {
        localStorage.setItem(`pages-page${currentPageNumber}`, page.innerHTML);
    }

    function addNewPage(event) {
        pageCount += 1;
        createLinks(pageCount);
        localStorage.setItem('pages-pageCount', pageCount);
        page.innerHTML = ""
        savePage();
    }

    function createLinks(i) {
        index.innerHTML = '';
        for (let i = 0; i <= pageCount; i++) {
            let link = document.createElement('a');
            link.setAttribute('href', `#${i}`);
            link.innerHTML = `${i}`;
            link.addEventListener('click', indexClick);
            index.appendChild(link);
        }
    }

    function indexClick(event) {
        event.preventDefault();
        hash = event.target.href.substring(event.target.href.lastIndexOf('#'), event.target.href.length);
        console.log(hash)
        window.location = window.location.pathname + hash;
        window.location.reload();
    }

    function tryClearStorage() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let value = params.clear;
        if (value === '1') {
            localStorage.clear();
        }
    }
});