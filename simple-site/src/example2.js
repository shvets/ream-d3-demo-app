//import * as d3 from 'd3';
class Example2 {
    constructor() {
        const data = d3.range(25).map(Math.random);

        // Select the SVG element
        const svg = d3.select("svg"),
          margin = {
              top: 0, right: 50,
              bottom: 50, left: 50
          },
          width = svg.attr("width") -
            margin.left - margin.right,
          height = svg.attr("height") -
            margin.top - margin.bottom,
          g = svg.append("g")
            .attr("transform", "translate("
              + margin.left + "," + margin.top + ")"
            );

        const x = d3.scaleLinear().range([0, width]),
          y = d3.randomNormal(height / 2, height / 8);

        const brush = d3.brushX()
          // Use the brush.on() function
          // to set the given event listener
          .on("start brush end", brushmoved)

          .extent([[0, 0], [width, height]]);

        const circle = g.append("g")
          .attr("class", "circle")
          .selectAll("circle")
          .data(data)
          .enter().append("circle")
          .attr("transform", function (d) {
              return "translate("
                + x(d) + "," + y() + ")";
          })
          .attr("r", 10);

        const gBrush = g.append("g")
          .attr("class", "brush")
          .call(brush);

        gBrush.call(brush.move, [0.3, 0.5].map(x));

        const bs = "";

        // Define the function to be
        // called when the brush is moved
        function brushmoved(event) {
            const s = event.selection;
            console.log(s)

            if (s == null) {
                // handle.attr("display", "none");
                circle.classed("active", false);
            } else {
                const sx = s.map(x.invert);
                circle.classed("active", function (d) {
                    return sx[0] <= d && d <= sx[1];
                });
                // handle.attr("display", null)
                //   .attr("transform", function (d, i) {
                //       return "translate("
                //         + s[i] + "," + height / 2 + ")";
                //   });
            }
        }
    }
}

new Example2()
