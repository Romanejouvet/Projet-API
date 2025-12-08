const input = document.getElementById('search-bar');
input.addEventListener("search", searchApi);

async function searchApi() {
  console.log(input.value);

  if (/^\d+$/.test(input.value)) {
    console.log('ISBN');
    const data = await isbnApi(input.value);
    console.log(data);
  } else {
    console.log('auteur');
    const data = await authorApi(input.value);
    console.log(data);
  }
}

async function authorApi(author) {
  const response = await fetch(`https://openlibrary.org/search/authors.json?q=${author}`);
  const data = await response.json();
  // console.log(data);
  return data;
}

async function isbnApi(isbn) {
  const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
  const data = await response.json();
  // console.log(data);
  return data;
}
