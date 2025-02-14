# File: app.py
from flask import Flask, render_template, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize the database and tables
def init_db():
    with sqlite3.connect("bookstore.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS books (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            author TEXT NOT NULL,
                            price REAL NOT NULL,
                            stock INTEGER NOT NULL)''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS sales (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            book_id INTEGER NOT NULL,
                            customer_name TEXT NOT NULL,
                            quantity INTEGER NOT NULL,
                            total_price REAL NOT NULL,
                            FOREIGN KEY (book_id) REFERENCES books (id))''')
        conn.commit()

# Error handler to centralize error reporting
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return render_template('index.html')

# API: Get all books or add a new book
@app.route('/api/books', methods=['GET', 'POST'])
def books_api():
    try:
        if request.method == 'POST':
            data = request.json
            title = data.get('title')
            author = data.get('author')
            price = float(data.get('price'))
            stock = int(data.get('stock'))

            if not all([title, author, price, stock]):
                return jsonify({"error": "All fields are required"}), 400

            with sqlite3.connect("bookstore.db") as conn:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)",
                               (title, author, price, stock))
                conn.commit()
            return jsonify({"message": "Book added successfully!"})

        with sqlite3.connect("bookstore.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM books")
            books = cursor.fetchall()
            books_list = [
                {"id": book[0], "title": book[1], "author": book[2], "price": book[3], "stock": book[4]} for book in books
            ]
        return jsonify(books_list)
    except Exception as e:
        return handle_exception(e)

# API: Update or delete a specific book
@app.route('/api/books/<int:book_id>', methods=['DELETE', 'PUT'])
def modify_book(book_id):
    try:
        with sqlite3.connect("bookstore.db") as conn:
            cursor = conn.cursor()

            if request.method == 'DELETE':
                cursor.execute("DELETE FROM books WHERE id = ?", (book_id,))
                conn.commit()
                return jsonify({"message": "Book deleted successfully!"})

            if request.method == 'PUT':
                data = request.json
                title = data.get('title')
                author = data.get('author')
                price = float(data.get('price'))
                stock = int(data.get('stock'))

                if not all([title, author, price, stock]):
                    return jsonify({"error": "All fields are required"}), 400

                cursor.execute("UPDATE books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?",
                               (title, author, price, stock, book_id))
                conn.commit()
                return jsonify({"message": "Book updated successfully!"})
    except Exception as e:
        return handle_exception(e)
    
# API: Record sales
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    with sqlite3.connect("bookstore.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM books WHERE id = ?", (book_id,))
        book = cursor.fetchone()
        if book:
            return jsonify({"id": book[0], "title": book[1], "author": book[2], "price": book[3], "stock": book[4]})
        return jsonify({"error": "Book not found"}), 404


# API: Manage sales
@app.route('/api/sales', methods=['GET', 'POST'])
def sales_api():
    try:
        with sqlite3.connect("bookstore.db") as conn:
            cursor = conn.cursor()

            if request.method == 'POST':
                data = request.json
                book_id = int(data.get('book_id'))
                customer_name = data.get('customer_name')
                quantity = int(data.get('quantity'))

                if not all([book_id, customer_name, quantity]) or quantity <= 0:
                    return jsonify({"error": "Invalid input"}), 400

                cursor.execute("SELECT price, stock FROM books WHERE id = ?", (book_id,))
                book = cursor.fetchone()

                if not book:
                    return jsonify({"error": "Book not found"}), 404

                price, stock = book
                if stock < quantity:
                    return jsonify({"error": "Insufficient stock"}), 400

                total_price = price * quantity
                cursor.execute("INSERT INTO sales (book_id, customer_name, quantity, total_price) VALUES (?, ?, ?, ?)",
                               (book_id, customer_name, quantity, total_price))
                cursor.execute("UPDATE books SET stock = stock - ? WHERE id = ?", (quantity, book_id))
                conn.commit()
                return jsonify({"message": "Sale recorded successfully!"})

            # GET: Fetch sales records
            cursor.execute("SELECT sales.id, books.title, sales.customer_name, sales.quantity, sales.total_price \
                            FROM sales INNER JOIN books ON sales.book_id = books.id")
            sales_records = cursor.fetchall()
            sales_list = [
                {"id": sale[0], "title": sale[1], "customer_name": sale[2], "quantity": sale[3], "total_price": sale[4]}
                for sale in sales_records
            ]
        return jsonify(sales_list)
    except Exception as e:
        return handle_exception(e)
    

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
