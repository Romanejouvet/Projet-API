async function authorApi(author) {
  const response = await fetch(
    `https://openlibrary.org/search/authors.json?q=${author}`
  );
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

async function genreAPI(genre) {
  const response = await fetch(`https://openlibrary.org/subjects/${genre}.json`);
  const data = await response.json();
  // console.log(data);
  return data;
}
