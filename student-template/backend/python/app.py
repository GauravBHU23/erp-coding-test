from flask import Flask, jsonify
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Configure database connection using DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")


@app.route('/api/inventory/alerts', methods=['GET'])
def get_alerts():
    """
    Return all products where quantity <= reorder_level.
    """
    connection = None

    try:
        # Connect to PostgreSQL
        connection = psycopg2.connect(DATABASE_URL)

        # Execute query
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT id, product_name, quantity, reorder_level
                FROM inventory
                WHERE quantity <= reorder_level
            """)

            products = cursor.fetchall()

        # Return JSON response
        return jsonify(products), 200

    except psycopg2.Error as e:
        app.logger.error("Database error: %s", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        if connection:
            connection.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
