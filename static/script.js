const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let nodes = [];
let edges = [];

function addNode() {
    const x = Math.random() * 700 + 50;
    const y = Math.random() * 400 + 50;
    const id = "N" + nodes.length;
    nodes.push({ id, x, y });
    draw();
}

function addEdge() {
    if (nodes.length < 2) return;

    let from = prompt("From Node (e.g. N0):");
    let to = prompt("To Node (e.g. N1):");
    let weight = parseInt(prompt("Weight:"));

    edges.push({ from, to, weight });
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(edge => {
        let n1 = nodes.find(n => n.id === edge.from);
        let n2 = nodes.find(n => n.id === edge.to);

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();

        ctx.fillText(edge.weight, (n1.x+n2.x)/2, (n1.y+n2.y)/2);
    });

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "skyblue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(node.id, node.x - 10, node.y + 5);
    });
}

function runDijkstra() {
    let start = prompt("Enter Start Node (e.g. N0)");

    let graph = {};
    nodes.forEach(n => graph[n.id] = []);

    edges.forEach(e => {
        graph[e.from].push([e.to, e.weight]);
        graph[e.to].push([e.from, e.weight]);
    });

    fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph, start })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerHTML =
            "<h3>Distances:</h3>" + JSON.stringify(data, null, 2);
    });
}