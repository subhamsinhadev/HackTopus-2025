
from flask import Flask, render_template, request, jsonify, make_response
from functools import wraps

app = Flask(__name__)
volunteers = []

# Basic authentication decorator
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != 'isha' or auth.password != 'secret123':
            response = make_response(jsonify({"message": "Authentication required"}), 401)
            response.headers['WWW-Authenticate'] = 'Basic realm="Login Required"'
            return response
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/volunteer', methods=['POST'])
def volunteer():
    data = request.get_json()
    volunteers.append(data)
    return jsonify({"message": "Volunteer data received successfully."}), 200

@app.route('/volunteer', methods=['GET'])
@require_auth
def get_volunteers():
    return jsonify(volunteers)

@app.route('/admin')
@require_auth
def admin():
    return render_template('admin.html')

@app.route('/logout')
# @app.route('/logout')
def logout():
    return '''
    <html>
      <head>
        <meta http-equiv="refresh" content="1; url=/admin" />
      </head>
      <body>
        <p>Logging out... Redirecting to admin login.</p>
      </body>
    </html>
    '''


if __name__ == '__main__':
    app.run(debug=True)
