from flask import Flask, render_template, request, jsonify
import heapq

app = Flask(__name__)

def dijkstra(graph, start):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/run", methods=["POST"])
def run_algorithm():
    data = request.json
    graph = data["graph"]
    start = data["start"]
    result = dijkstra(graph, start)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)