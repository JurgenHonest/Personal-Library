# 📚 Personal Library System  

A lightweight books management system built with **Flask**, **SQLite**, **Bootstrap**, and **JavaScript**.  

---

## 🚀 Features
- Manage books (CRUD operations).
- Record and view sales transactions.
- Real-time book stock updates upon sales.
- Responsive UI using **Bootstrap**.
- Supports light and dark themes with **lightstyle.css** and **darkstyle.css**.

---

## 🛠️ Tech Stack
- **Back-end**: Flask
- **Database**: SQLite
- **Front-end**: HTML, CSS, JavaScript, Bootstrap 5
- **Styling**: Custom and Bootstrap styles

---

## 📂 Project Structure  
```
📂 Project Directory
├── 📁 templates
│   └── index.html    # Main HTML file
├── 📁 static
│   ├── script.js     # JavaScript for dynamic functionality
│   ├── lightstyle.css # Light theme styling file
│   ├── darkstyle.css  # Dark theme styling file
│   └── favicon.png   # Favicon
├── app.py            # Flask application
├── bookstore.db      # SQLite database (generated at runtime)
└── README.md         # Project documentation
```
----

## 🚀 Getting Started
### 1. Prerequisites
Ensure you have Python 3.x installed.

### 2. Installation
#### 1. Install dependencies:
```
pip install flask flask-cors
```

#### 2. Run the Flask application:
```
python app.py
```
#### 3. Open your browser and navigate to:
```
http://127.0.0.1:5000
```
----

## 🔑API Endpoints

### Books API
| HTTP Method | Endpoint               | Description                     | Request Body             | Response          |
|-------------|------------------------|---------------------------------|--------------------------|-------------------|
| `GET`       | `/books`              | Fetch all books                | N/A                      | JSON of all books |
| `POST`      | `/books`              | Add a new book                 | `{ title, author, year }`| JSON of new book  |
| `PUT`       | `/books/:id`          | Update book details by ID      | `{ title, author, year }`| Updated book JSON |
| `DELETE`    | `/books/:id`          | Delete a book by ID            | N/A                      | Success message   |



### Sales API
| HTTP Method | Endpoint               | Description                     | Request Body             | Response          |
|-------------|------------------------|---------------------------------|--------------------------|-------------------|
| `GET`       | `/sales`              | Fetch all sales                | N/A                      | JSON of all sales |
| `POST`      | `/sales`              | Record a new sale              | `{ bookId, quantity }`   | JSON of new sale  |
| `PUT`       | `/sales/:id`          | Update sale details by ID      | `{ bookId, quantity }`   | Updated sale JSON |
| `DELETE`    | `/sales/:id`          | Delete a sale by ID            | N/A                      | Success message   |

------

## 🖼️ Screenshots
**Home Page**

![Screenshot 2025-01-31 174652](https://github.com/user-attachments/assets/3c241ece-5b06-4c3e-9a0e-6763fec7f4ff)

-----

**Add Book**

![Screenshot 2025-01-31 174818](https://github.com/user-attachments/assets/09ae10ad-cffc-40b6-96cf-ab516c64f2b1)

-----

## 📧 Contact
For any inquiries or feedback, please contact:<br>
Sumit Chhetri &nbsp; | &nbsp; [Sumit Chhetri(JurgenHonest)](https://github.com/JurgenHonest)

