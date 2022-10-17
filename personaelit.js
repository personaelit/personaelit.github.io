window.addEventListener('DOMContentLoaded', (event) => {
    let lastUpdated = document.getElementsByClassName("last-updated")[0];
    if (lastUpdated != null) {
        lastUpdated.innerHTML = "Last updated: " + document.lastModified;
        lastUpdated.setAttribute('datetime', document.lastModified);
    }
});