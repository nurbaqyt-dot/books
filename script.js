const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const resultsGrid = document.getElementById("resultsGrid");
const favBtn = document.getElementById("showFavorites");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
searchBtn.addEventListener("click", searchBooks);
async function searchBooks() {
  const query = input.value || "book";
  const genre = genreSelect.value;

  const url = `https://openlibrary.org/search.json?q=${query}&fields=title,author_name,cover_i,subject`;
  const response = await fetch(url);
  const data = await response.json();

  let books = data.docs;
  if (genre !== "") {
    books = books.filter(
      (book) =>
        book.subject &&
        book.subject.some((s) =>
          s.toLowerCase().includes(genre.replace("_", " ")),
        ),
    );
  }
  showBooks(books.slice(0, 20));
}
function showBooks(books) {
  resultsGrid.innerHTML = "";

  books.forEach((book) => {
    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/200x250";
    const div = document.createElement("div");
    div.className = "book-card";
    div.innerHTML = `<img src="${cover}" alt="">
    <h3>${book.title}</h3>
    <p>${book.author_name ? book.author_name[0] : "Unknown"}</p>
    <button class ="add-fav">Add to favourites</button>`;
    div
      .querySelector(".add-fav")
      .addEventListener("click", () => addFavorite(book));

    resultsGrid.appendChild(div);
  });
}
function addFavorite(book) {
  favorites.push(book);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to favorites");
}
favBtn.addEventListener("click", function () {
  showBooks(favorites);
});
