// import * as d3 from 'd3';
class Example1 {
    constructor() {
        // Selecting SVG element
        const svg = d3.select("svg");
        const g = svg.append("g");
        // Creating a brush using the
        // d3.brush function
        g.call(d3.brush());
        // Use of brush.move() function
        d3.select("button").on("click", function () {
            g.call(d3.brush().move, [
                [100, 0],
                [400, 100]
            ]);
        });
    }
}

new Example1()
