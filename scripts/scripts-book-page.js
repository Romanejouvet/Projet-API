const searchParams = new URLSearchParams(window.location.search);
const isbn = searchParams.get("isbn");


async function getBook() {
  if (!isbn) {
    console.error("Pas d'ISBN");
    return;
  }

  try {
    const template = document.getElementById("book-detail-template");
    const cloneBookDetail = template.content.cloneNode(true);

    const book = await isbnApi(isbn);
    console.log("ISBN:", book);

    cloneBookDetail.querySelector("#book-title").textContent =
      book.title || "Titre inconnu";

    const booksResponse = await fetch(
      `https://openlibrary.org${book.key}.json`
    );
    const bookData = await booksResponse.json();

    const authorKey = book.authors?.[0]?.key;
    let authorName = "Auteur inconnu";
    let authorIdParam = "";

    if (authorKey) {
      const authorResponse = await fetch(
        `https://openlibrary.org${authorKey}.json`
      );
      const authorData = await authorResponse.json();

      authorName = authorData.name || authorName;

      authorIdParam = authorKey.replace("/authors/", "");
    }
    cloneBookDetail.querySelector("#author").textContent = `${authorName}`;
    cloneBookDetail.querySelector(
      "#author"
    ).href = `author-page.html?author=${authorIdParam}`;

    cloneBookDetail.querySelector("#date").textContent = `${
      bookData.publish_date || "date inconnue"
    }`;

    if (book.covers) {
      const coverUrl = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
      cloneBookDetail.querySelector("#book-cover").src = coverUrl;
      cloneBookDetail.querySelector("#book-cover-blur").src = coverUrl;
    }

    const workKey = bookData.works?.[0]?.key;
    if (workKey) {
      const workResponse = await fetch(
        `https://openlibrary.org${workKey}.json`
      );
      const workData = await workResponse.json();

      const description =
        workData.description?.value ||
        workData.description ||
        "Aucune description disponible.";

      cloneBookDetail.querySelector("#book-description").textContent =
        description;

      const ratingResponse = await fetch(
        `https://openlibrary.org${workKey}/ratings.json`
      );
      const ratingData = await ratingResponse.json();

      if (ratingData.summary?.average) {
        const avg = ratingData.summary.average;
        const count = ratingData.summary.count;
        const reviewText = `${avg.toFixed(1)} / 5 (${count} votes)`;
        cloneBookDetail.querySelector("#book-review").textContent = reviewText;
      } else {
        cloneBookDetail.querySelector("#book-review").textContent =
          "Aucun avis";
      }
    }

    document.querySelector("main").appendChild(cloneBookDetail);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

getBook();
