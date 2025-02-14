const API_URL = "http://127.0.0.1:5000/api";
console.log(API_URL);

// Centralized error handler
function handleError(message) {
  const errorAlert = document.createElement("div");
  errorAlert.className = "alert alert-danger";
  errorAlert.textContent = message;
  document.body.prepend(errorAlert);
  setTimeout(() => errorAlert.remove(), 3000);
}

// Improved fetchBooks function with error handling
async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok)
      throw new Error("Failed to fetch books. Please try again.");
    books = await response.json();
    populateBookTable(books);
    populateBookSelect(books);
  } catch (error) {
    handleError(error.message);
  }
}

// Populate book table
function populateBookTable(books) {
  const bookTable = document.querySelector("#book-table tbody");
  bookTable.innerHTML = "";
  books.forEach((book) => {
    bookTable.innerHTML += `
      <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.price}</td>
        <td>${book.stock}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openUpdateModal(${book.id})">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
        </td>
      </tr>`;
  });
}

// Populate book dropdown in sales form
function populateBookSelect(books) {
  const bookSelect = document.querySelector("#sale-book-id");
  bookSelect.innerHTML = "";
  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.id;
    option.textContent = book.title;
    bookSelect.appendChild(option);
  });
}

// Add book form submission
document
  .getElementById("addBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (
      !title ||
      !author ||
      isNaN(price) ||
      isNaN(stock) ||
      price <= 0 ||
      stock <= 0
    ) {
      alert("Please provide valid inputs for all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, price, stock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add book"}`);
        return;
      }

      alert("Book added successfully!");
      this.reset(); // Reset form inputs
      fetchBooks(); // Refresh books list
      fetchSales();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("An error occurred while adding the book.");
    }
  });

// Update book form submission
document
  .getElementById("updateBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const bookId = parseInt(document.getElementById("update-book-id").value);
    const title = document.getElementById("update-title").value.trim();
    const author = document.getElementById("update-author").value.trim();
    const price = parseFloat(document.getElementById("update-price").value);
    const stock = parseInt(document.getElementById("update-stock").value);

    if (
      !title ||
      !author ||
      isNaN(price) ||
      isNaN(stock) ||
      price <= 0 ||
      stock <= 0
    ) {
      alert("Please provide valid inputs for all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, price, stock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to update book"}`);
        return;
      }

      alert("Book updated successfully!");
      fetchBooks(); // Refresh books list
    } catch (error) {
      console.error("Error updating book:", error);
      alert("An error occurred while updating the book.");
    }
  });

// Fetch and display sales
async function fetchSales() {
  try {
    const response = await fetch(`${API_URL}/sales`);
    if (!response.ok)
      throw new Error("Failed to fetch sales: ${response.status}");
    const sales = await response.json();

    const salesTable = document.querySelector("#sales-table tbody");
    salesTable.innerHTML = "";

    sales.forEach((sale) => {
      salesTable.innerHTML += `
        <tr>
          <td>${sale.id}</td>
          <td>${sale.title}</td>
          <td>${sale.customer_name}</td>
          <td>${sale.quantity}</td>
          <td>${sale.total_price}</td>
        </tr>`;
    });
  } catch (error) {
    console.error(error.message);
    alert("Error loading sales");
  }
}

// Add book form submission
document
  .getElementById("salesForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const bookId = parseInt(document.getElementById("sale-book-id").value);
    const customerName = document.getElementById("customer-name").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!bookId || !customerName || isNaN(quantity) || quantity <= 0) {
      alert("Please provide valid inputs.");
      return;
    }
    if (!bookId || isNaN(bookId)) {
      console.error("Invalid bookId:", bookId);
      return;
    }

    try {
      // Fetch book to check stock before recording sale
      const bookResponse = await fetch(`${API_URL}/books/${bookId}`);
      if (!bookResponse.ok) {
        const errorMessage = await bookResponse.text();
        console.error(`Error: ${bookResponse.status} - ${errorMessage}`);
        return;
      }
      const book = await bookResponse.json();

      // Check if enough stock is available
      if (book.stock < quantity) {
        alert("Not enough stock available for this sale.");
        return;
      }

      // Record the sale
      const response = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          customer_name: customerName,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to record sale"}`);
        return;
      }
      // Update book stock after sale
      await fetch(`${API_URL}/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: book.stock - quantity,
        }),
      });

      alert("Sale recorded successfully!");
      this.reset(); // Reset form inputs
      fetchBooks(); // Refresh books list to update stock
      fetchSales(); // Refresh sales table
    } catch (error) {
      console.error("Failed to record sale:", error);
      alert("An error occurred while recording the sale.");
    }
  });

// Open the Update Modal and populate fields
function openUpdateModal(bookId) {
  const book = books.find((b) => b.id === bookId); // Use the global books array
  if (book) {
    document.getElementById("update-book-id").value = book.id;
    document.getElementById("update-title").value = book.title;
    document.getElementById("update-author").value = book.author;
    document.getElementById("update-price").value = book.price;
    document.getElementById("update-stock").value = book.stock;

    const modal = new bootstrap.Modal(
      document.getElementById("updateBookModal")
    );
    modal.show();
  } else {
    alert("Book not found");
  }
}

// Delete book
async function deleteBook(bookId) {
  const confirmation = confirm("Are you sure you want to delete this book?");
  if (!confirmation) return;

  try {
    await fetch(`${API_URL}/books/${bookId}`, {
      method: "DELETE",
    });

    fetchBooks(); // Refresh books list after delete
  } catch (error) {
    alert("Failed to delete book: " + error.message);
  }
}

// Fetch and populate data on load
fetchBooks();
fetchSales();
