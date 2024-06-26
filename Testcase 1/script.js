const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const numPoints = 10; // Number of points
const points = [];
for (let i = 0; i < numPoints; i++) {
    points.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

const numAnts = 5;
const numIterations = 100;
const alpha = 1;
const beta = 1;
const evaporationRate = 0.5;
const Q = 1;

let bestPath = null;
let bestPathLength = Infinity;

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function antColonyOptimization() {
    let pheromone = Array.from({ length: numPoints }, () => Array(numPoints).fill(1));

    for (let iteration = 0; iteration < numIterations; iteration++) {
        let paths = [];

        for (let ant = 0; ant < numAnts; ant++) {
            let visited = Array(numPoints).fill(false);
            let currentPoint = Math.floor(Math.random() * numPoints);
            visited[currentPoint] = true;
            let path = [currentPoint];
            let pathLength = 0;

            while (visited.includes(false)) {
                let unvisited = visited.map((v, i) => !v ? i : -1).filter(i => i !== -1);
                let probabilities = Array(unvisited.length).fill(0);

                unvisited.forEach((unvisitedPoint, index) => {
                    probabilities[index] = pheromone[currentPoint][unvisitedPoint] * alpha / distance(points[currentPoint], points[unvisitedPoint]) * beta;
                });

                let totalProbabilities = probabilities.reduce((acc, val) => acc + val, 0);
                probabilities = probabilities.map(prob => prob / totalProbabilities);

                let nextPoint = unvisited[Math.floor(Math.random() * unvisited.length)];
                path.push(nextPoint);
                pathLength += distance(points[currentPoint], points[nextPoint]);
                visited[nextPoint] = true;
                currentPoint = nextPoint;
            }

            paths.push({ path, pathLength });
        }

        pheromone = pheromone.map(row => row.map(col => col * evaporationRate));

        paths.forEach(({ path, pathLength }) => {
            if (pathLength < bestPathLength) {
                bestPath = path;
                bestPathLength = pathLength;
            }

            for (let i = 0; i < numPoints - 1; i++) {
                pheromone[path[i]][path[i + 1]] += Q / pathLength;
            }
            pheromone[path[path.length - 1]][path[0]] += Q / pathLength;
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.stroke();
        }
    }

    // Draw points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    });

    // Draw best path
    ctx.beginPath();
    ctx.moveTo(points[bestPath[0]].x, points[bestPath[0]].y);
    bestPath.forEach(index => ctx.lineTo(points[index].x, points[index].y));
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();
}

antColonyOptimization();
draw();





antColonyOptimization();
draw();
