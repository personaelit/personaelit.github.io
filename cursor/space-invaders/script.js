document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header h1");
    header.addEventListener("click", function () {
        alert("Welcome to My Website!");
    });

    const footer = document.querySelector("footer p");
    footer.addEventListener("mouseover", function () {
        footer.style.color = "blue";
    });

    footer.addEventListener("mouseout", function () {
        footer.style.color = "initial";
    });
});