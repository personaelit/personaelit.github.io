function searchWikipedia() {
    const searchTerm = document.getElementById('searchTerm').value;
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=5&origin=*&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.log(error));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const titles = data[1];
    const links = data[3];

    titles.forEach((title, index) => {
        const link = links[index];
        resultsDiv.innerHTML += `<a href="${link}" target="_blank">${title}</a><br>`;
    });
}
