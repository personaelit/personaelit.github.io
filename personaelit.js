window.addEventListener('DOMContentLoaded', (event) => {
    let time = document.getElementsByTagName("time")[0];
    if (time != null) {
        time.innerHTML = document.lastModified;
    }


});