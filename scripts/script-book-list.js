async function getIndividualBook(bookId) { // get individual book name / author / image

    let bookTitle = "";
    let bookAuthor = "";
    let bookImage = "";
    let bookTitleLink = "";
    let bookAuthorLink = "";

    try {
        const individualBook = await isbnApi(bookId);
        console.log("Individual book:", individualBook);

        // récupérer le titre
        bookTitle = individualBook.title || "Titre inconnu";
        // récupérer le lien vers la page du livre
        bookTitleLink = `./pages/book-page.html?isbn=${individualBook.isbn_13 ? individualBook.isbn_13[0] : bookId}`;

        // récupérer la cover
        if (individualBook.covers) {
            const coverUrl = `https://covers.openlibrary.org/b/id/${individualBook.covers[0]}-M.jpg`;
            bookImage = coverUrl;
        }

        // récupérer l'auteur
        const authorKey = individualBook.authors?.[0]?.key;
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
        bookAuthor = `${authorName}`;
        bookAuthorLink = `./pages/author-page.html?author=${authorIdParam}`;

        let bookInfos = [bookTitle, bookAuthor, bookImage, bookTitleLink, bookAuthorLink];
        return bookInfos;

    } catch (error) {
        console.error("Error fetching individual book:", error);
    }
}

async function IndividualBook(bookId) {

    const bookInfos = await getIndividualBook(bookId);
    console.log("Book Infos:", bookInfos);

    const template = document.getElementById("book-item-template");
    const clone = template.content.cloneNode(true);

    // récupérer le titre
    clone.querySelector(".book-item-title").textContent = bookInfos[0];
    // récupérer le lien vers la page du livre
    clone.querySelector(".book-item-link").href = bookInfos[3];

    // récupérer la cover
    if (bookInfos[2]) {
        clone.querySelector("img").src = bookInfos[2];
    }

    // récupérer l'auteur
    clone.querySelector(".book-item-author").textContent = bookInfos[1];
    clone.querySelector(".book-item-author").href = bookInfos[4];

    document.querySelector("#book-list").appendChild(clone);


}

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
            console.log("Work:", work);
            const bookName = work.title;
            console.log("Book Name:", bookName);
            const authorName = work.authors?.[0]?.name || "Auteur inconnu";
            console.log("Author Name:", authorName);
            const bookCoverId = work.cover_id ? work.cover_id : null;
            console.log("Book Cover ID:", bookCoverId);
            const bookLink = `./pages/book-page.html?isbn=${work.cover_edition_key}`;
            console.log("Book Link:", bookLink);
            const authorLink = `./pages/author-page.html?author=${work.authors?.[0]?.key.replace("/authors/", "")}`;
            console.log("Author Link:", authorLink);

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

displayGenreLists();
