// script-book-list.js

async function displayGenreBooks(genre) {
    let bookInfos = [];
    for (let i = 0; i < 10; i++) {
        bookInfos[i] = [];
    }

    try {
        const genreData = await genreAPI(genre);
        console.log("Genre Data:", genreData);
        const works = genreData.works || [];

        for (let i = 0; i < 10; i++) {
            const work = works[i];

            const bookName = work.title;
            const authorName = work.authors?.[0]?.name || "Auteur inconnu";
            const bookCoverId = work.cover_id ? work.cover_id : null;
            const bookLink = `./pages/book-page.html?isbn=${work.cover_edition_key}`;
            const authorLink = `./pages/author-page.html?author=${work.authors?.[0]?.key.replace("/authors/", "")}`;

            bookInfos[i][0] = bookName;
            bookInfos[i][1] = authorName;
            bookInfos[i][2] = bookCoverId ? `https://covers.openlibrary.org/b/id/${bookCoverId}-M.jpg` : "";
            bookInfos[i][3] = bookLink;
            bookInfos[i][4] = authorLink;
        }

        return bookInfos;

    } catch (error) {
        console.error("Error displaying genre books:", error);
    }
}

async function displayGenreLists() {
    const bookInfos = await displayGenreBooks("love");
    console.log("Book Infos for Genre 'love':", bookInfos);
}

async function displayGenreLists() {
    const bookInfos = await displayGenreBooks("love");
    if (!bookInfos) return;

    const template = document.getElementsByClassName("book-item-template")[0];
    const bookList = document.getElementById("book-list");

    for (let i = 0; i < bookInfos.length; i++) {
        const book = bookInfos[i];
        if (!book) return;
        const clone = template.content.cloneNode(true);

        clone.querySelector(".book-item-link").href = book[3];
        clone.querySelector(".book-item-cover").src = book[2] || "./medias/img/aucuneImage.png";
        clone.querySelector(".book-item-cover").alt = `Couverture de ${book[0]}`;
        clone.querySelector(".book-item-title").textContent = book[0];
        clone.querySelector(".book-item-author").textContent = book[1];
        clone.querySelector(".book-item-author").href = book[4];

        bookList.appendChild(clone);

    };
}

displayGenreLists();

/*
async function getBookListAuthor() {
  try {
    const BookAuthorResponse = await fetch(
      `https://openlibrary.org/authors/${authorURL}/works.json?limit=10`
    );

    const BookAuthorData = await BookAuthorResponse.json();
    console.log(BookAuthorData);

    const template = document.getElementById("book-list-template");

    // On récupère le nom de l’auteur déjà affiché en haut
    const authorName =
      document.querySelector("#author-name")?.textContent || "Auteur";

    BookAuthorData.entries.forEach((entry) => {
      const cloneBookListAuthor = template.content.cloneNode(true);

      cloneBookListAuthor.querySelector(".book-title").textContent =
        entry.title;

      cloneBookListAuthor.querySelector(".book-author").textContent =
        authorName;

      const imageElement = cloneBookListAuthor.querySelector(".book-cover");

      const coverId = entry.covers?.find((id) => id > 0);

      if (coverId) {
        imageElement.src = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
        imageElement.alt = `Couverture de ${entry.title}`;
      } else {
        imageElement.src = "/medias/img/aucuneImage.png";
        imageElement.alt = "Pas de couverture disponible";
      }

      imageElement.addEventListener("click", async () => {
        try {
        
          const editionsResponse = await fetch(
            `https://openlibrary.org${entry.key}/editions.json`
          );
          const editionsData = await editionsResponse.json();
          let isbn = null;

          for (const edition of editionsData.entries) {
            if (edition.isbn_13 && edition.isbn_13.length > 0) {
              isbn = edition.isbn_13[0];
              break;
            } else if (edition.isbn_10 && edition.isbn_10.length > 0) {
              isbn = edition.isbn_10[0];
              break;
            }
          }

       
          if (isbn) {
            window.location.href = `/pages/book-page.html?isbn=${isbn}`;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'ISBN :", error);
        }
      });

      document.getElementById("book-list").appendChild(cloneBookListAuthor);
    });
  } catch (error) {
    console.error("Erreur :", error);
  }
}
  */