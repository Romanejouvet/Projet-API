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
