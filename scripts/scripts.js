const input = document.getElementById('search-bar');
input.addEventListener("search", searchApi);


function searchApi() {
    console.log(input.value);
    if (/^\d+$/.test(input.value)) {
        console.log('ISBN');
      isbnApi(input.value)
    } else {
        console.log('auteur');
          authorApi(input.value)
    }
}

async function authorApi(author) {
  const response = await fetch(`https://openlibrary.org/search/authors.json?q=${author}`);
  const data = await response.json();
  console.log(data);
}

async function isbnApi(isbn) {
  const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
  const data = await response.json();
  console.log(data);
}
