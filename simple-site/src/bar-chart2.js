// import * as d3 from 'd3';

class BarChart2 {
  constructor(selector) {
    const svg = d3.select(selector)

    const startValue = 0.5
    const endValue = 0.8

    const margin = {top: 50, right: 10, bottom: 10, left: 10}

    const canvas = this.createCanvas(svg, margin)

    const width = svg.attr("width") - margin.left - margin.right
    const height = svg.attr("height") - margin.top - margin.bottom

    const xScale = this.createXScale(canvas, width)
    const yScale = this.createYScale(height)

    const items = this.createItems(this.data, canvas, xScale, yScale)

    const brush = this.createBrush(width, height, xScale, items)

    const gBrush = canvas.append("g")
      .attr("class", "brush")

    gBrush.call(brush)
    gBrush.call(brush.move, [startValue, endValue].map(xScale))
  }

  get data() {
    return d3.range(100).map(Math.random)
  }

  createCanvas(svg, margin) {
    const g = svg.append("g")

    g.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

    return g
  }

  createBrush(width, height, xScale, circle) {
    const brush = d3.brushX()

    brush.extent([[0, 0], [width, height]])

    const brushMoved = (event) => {
      this.brushMoved(event, xScale, circle)
    }

    brush.on("start brush end", brushMoved)

    return brush
  }

  brushMoved(event, x, items) {
    const selection = event.selection
    // console.log('brushMoved', event, selection)

    if (selection == null) {
      items.classed("active", false)
    } else {
      const sx = selection.map(x.invert)
      items.classed("active", function (d) {
        return sx[0] <= d && d <= sx[1]
      })
    }
  }

  createXScale(canvas, width) {
    const xScale = d3.scaleLinear().range([0, width])

    canvas.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0, 0)")
      .call(d3.axisTop(xScale))

    return xScale
  }

  createYScale(height) {
    return d3.randomNormal(height / 2, height / 8)
  }

  // onClick(canvas) {
  //   canvas.call(d3.brush().move, [
  //     [100, 0],
  //     [400, 100]
  //   ])
  // }

  createItems(data, canvas, xScale, yScale) {
    return canvas.append("g")
      .attr("class", "circle")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("transform", (d) => { return "translate(" + xScale(d) + "," + yScale() + ")"})
      .attr("r", 10)
  }
}

new BarChart2('svg')
