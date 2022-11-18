window.addEventListener('DOMContentLoaded', (event) => {
    tryClearStorage();

    let _plus = document.getElementById('plus');
    let _page = document.getElementById('page');
    let _index = document.getElementById('index');

    _plus.addEventListener('click', addNewPage);
    _page.addEventListener('keyup', savePage);

    let _pageCount = 0;
    let _currentPageNumber = 0;

    try {
        loadPageCount();
        loadCurrentPage();
    } catch (error) {
        console.error(error);
    }

    function loadCurrentPage() {
        let hash = window.location.hash;
        if (hash === '') {
            _currentPageNumber = 0;
            savePage();
        }
        else {
            _currentPageNumber = hash.replace('#', '');
            _currentPageNumber = parseInt(_currentPageNumber);
        }

        let currentPage = localStorage.getItem(`pages-page${_currentPageNumber}`);
        if (currentPage === null) {
            throw 'Current page does not exist.';
        }
        else {
            _page.innerHTML = currentPage;
        }
    }

    function loadPageCount() {

        if (localStorage.getItem('pages-pageCount') === null) {
            localStorage.setItem('pages-pageCount', _pageCount);
        }

        _pageCount = localStorage.getItem('pages-pageCount');
        _pageCount = parseInt(_pageCount);
        createLinks();
    }

    function savePage(event) {
        localStorage.setItem(`pages-page${_currentPageNumber}`, _page.innerHTML);
    }

    function addNewPage(event) {
        _pageCount += 1;
        _currentPageNumber +=1;
        createLinks(_pageCount);
        localStorage.setItem('pages-pageCount', _pageCount);
        _page.innerHTML = ""
        savePage();
    }

    function createLinks(i) {
        _index.innerHTML = '';
        for (let i = 0; i <= _pageCount; i++) {
            let link = document.createElement('a');
            link.setAttribute('href', `#${i}`);
            link.innerHTML = `${i}`;
            link.addEventListener('click', indexClick);
            _index.appendChild(link);
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