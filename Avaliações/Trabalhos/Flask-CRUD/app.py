from instance.server import app

if __name__ == '__main__':
    app.run(
            port=5000,
            debug=True,
            host='127.0.0.1')