// script-book-list.js

async function displayGenreBooks(genre) {
    const bookInfos = [];

    try {
        const genreData = await genreAPI(genre);
        console.log("Genre Data:", genreData);

        const works = genreData.works || [];

        for (let i = 0; i < 10; i++) {
            const work = works[i];
            if (!work) continue;

            const bookName = work.title || "Titre inconnu";
            const authorName = work.authors?.[0]?.name || "Auteur inconnu";
            const bookCoverId = work.cover_id || null;
            let bookLink = "#";
            const authorLink = work.authors?.[0]?.key
                ? `./pages/author-page.html?author=${work.authors[0].key.replace("/authors/", "")}`
                : "#";

            const workKey =  work.key;
            let bookIsbnLink = "#";
            if (workKey) {
                const bookResponse = await fetch(`https://openlibrary.org${workKey}/editions.json`);
                const bookData = await bookResponse.json();
                console.log("Book Data for editions:", bookData);
                bookIsbnLink = bookData.entries?.[0]?.isbn_13;
                if (bookIsbnLink) {
                    bookLink = `./pages/book-page.html?isbn=${bookIsbnLink}`;
                }
                else {
                    bookLink = `./pages/book-page.html?isbn=`;
                }
            }

            bookInfos.push([bookName, authorName, bookCoverId ? `https://covers.openlibrary.org/b/id/${bookCoverId}-M.jpg` : "", bookLink, authorLink]);
        }

        return bookInfos;

    } catch (error) {
        console.error("Error displaying genre books:", error);
        return [];
    }
}

async function displayGenreLists(genre) {
    const bookInfos = await displayGenreBooks(genre);
    if (!bookInfos || bookInfos.length === 0) return;

    const template = document.getElementById("book-item-template");
    const bookList = document.getElementById("book-list");

    bookList.innerHTML = "";

    for (const book of bookInfos) {
        if (!book) continue;

        const clone = template.content.cloneNode(true);

        clone.querySelector(".book-item-link").href = book[3];
        clone.querySelector(".book-cover").src = book[2] || "./medias/img/aucuneImage.png";
        clone.querySelector(".book-cover").alt = `Couverture de ${book[0]}`;
        clone.querySelector(".book-item-title").textContent = book[0];
        clone.querySelector(".book-item-author").textContent = book[1];
        clone.querySelector(".book-item-author").href = book[4];

        bookList.appendChild(clone);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const template = document.getElementById("book-item-template");
    if (!template) {
        console.error("Template introuvable !");
        return;
    }

    displayGenreLists("love");

    const selectGenre = document.getElementById("select-genre");
    selectGenre.addEventListener("change", (e) => {
        const genre = e.target.value;
        if (!genre) return;
        displayGenreLists(genre);
    });
});

