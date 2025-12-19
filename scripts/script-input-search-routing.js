const form = document.getElementById("search-container");
const input = document.getElementById("search-bar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchApi(input.value.trim());
});

async function searchApi(value) {
  console.log(value);

  if (!isNaN(value) && Number.isInteger(Number(value)) && value.length < 13) {
    console.log("ISBN");
    window.location.href = `pages/book-page.html?isbn=${value}`;
  } else {
    const encodeValue = encodeURIComponent(value);
    console.log(encodeValue);
    const authorResponse = await fetch(
      `https://openlibrary.org/search/authors.json?q=${encodeValue}`
    );

    const dataResponse = await authorResponse.json();
    console.log(dataResponse);

    const authorKey = dataResponse.docs[0].key;

    window.location.href = `pages/book-page.html?author=${authorKey}`;
  }
}
