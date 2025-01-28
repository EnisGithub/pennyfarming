from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/load":
            try:
                with open("data.json", "r") as file:
                    data = file.read()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(data.encode())
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"{}")
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/save":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data)
                with open("data.json", "w") as file:
                    json.dump(data, file, indent=4)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Data saved successfully")
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, CustomHandler)
    print("Server läuft auf Port 8000")
    httpd.serve_forever()
