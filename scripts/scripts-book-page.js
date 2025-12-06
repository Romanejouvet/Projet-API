const searchParams = new URLSearchParams(window.location.search);
const isbn = searchParams.get("isbn");

async function getBook() {
  if (!isbn) {
    console.error("Pas d'ISBN");
    return;
  }

  try {
    const book = await isbnApi(isbn);
    console.log("ISBN:", book);

    const titleElement = document.getElementById("book-title");
    titleElement.textContent = book.title;

    const booksResponse = await fetch(
      `https://openlibrary.org${book.key}.json`
    );
    const bookData = await booksResponse.json();

    const author = book.authors[0].key;
    const authorResponse = await fetch(`https://openlibrary.org${author}.json`);
    const authorData = await authorResponse.json();
    const authorName = authorData.name;

    const authorElement = document.getElementById("author-date");
    authorElement.textContent = `${authorName} - ${bookData.publish_date}`;

    const coverUrl = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
    document.getElementById("book-cover").src = coverUrl;
    document.getElementById("book-cover-blur").src = coverUrl;

    const work = bookData.works[0].key;

    const workResponse = await fetch(`https://openlibrary.org${work}.json`);
    const workData = await workResponse.json();
    description = workData.description.value || workData.description;
    document.getElementById("book-description").textContent = description;

    const ratingResponse = await fetch(
      `https://openlibrary.org${work}/ratings.json`
    );
    const ratingData = await ratingResponse.json();
    const avg = ratingData.summary.average;
    const count = ratingData.summary.count;
    const reviewText = `${avg.toFixed(1)} / 5 (${count} votes)`;
    document.getElementById("book-review").textContent = reviewText;
  } catch (error) {
    console.error("Erreur :", error);
  }
}

getBook();
