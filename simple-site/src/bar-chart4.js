class BarChar4 {
  constructor(selector, data) {
    let startTime = data[0].time
    let endTime = data[data.length-1].time

    const margin = {top: 20, right: 0, bottom: 20, left: 40}

    const svg = d3.select(selector)

    const width = svg.attr("width") - margin.left - margin.right
    const height = svg.attr("height") - margin.top - margin.bottom
    const timeUnit = d3.timeMonth

    const xScale = this.createXScale(svg, data, width, height, margin, timeUnit)
    const yScale = this.createYScale(svg, data, width, height, margin)

    // console.log('startTime', this.formatTime(startTime))
    // console.log('endTime', this.formatTime(endTime))
    // console.log(data.map((d) => `${this.formatTime(d.time)}: ${d.amount}`))

    this.createLines(svg, data, xScale, yScale, width, height)

    const brush = this.createBrush(svg, xScale, yScale, width, height, startTime, endTime, margin)

    this.drawBrush(svg, brush, startTime, endTime, xScale)

    svg.on('dblclick', (event) => {
      startTime = data[0].time
      endTime = data[data.length-1].time

      this.drawBrush(svg, brush, startTime, endTime, xScale)
    })
  }

  drawBrush(svg, brush, startTime, endTime, xScale) {
    svg.select(".brush")
      .call(brush)
      .call(brush.move, [startTime, endTime].map(xScale))
  }

  createXScale(svg, data, width, height, margin, timeUnit) {
    const delta = 1000 * 60 * 60 * 24 * 2

    const times = [
      d3.min(data, (d) => d.time) - delta,
      d3.max(data, (d) => d.time) + delta
    ]

    const xScale = d3.scaleTime()
      .domain(times)
      .range([margin.left, width - margin.right])

    const xAxis = (g) =>
      g.attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(timeUnit)
        .tickPadding(1)
      )

    svg.select(".x-axis").call(xAxis)

    return xScale
  }

  createYScale(svg, data, width, height, margin) {
    const amounts = [0, d3.max(data, (d) => d.amount)]

    const yScale = d3.scaleLinear()
      .domain(amounts)
      .range([height, 0])

    const yAxis = (g) =>
      g.attr("transform", `translate(${margin.left}, 0)`)
        .style("color", "steelblue")
        .call(d3.axisLeft(yScale))

    //.ticks(null, "s"))
    // .call((g) => g.select(".domain").remove())
    // .call((g) =>
    //   g
    //     .append("text")
    //     .attr("x", -margin.left)
    //     .attr("y", 10)
    //     .attr("fill", "currentColor")
    //     .attr("text-anchor", "start")
    //     .text(data.y1)
    // )

    svg.select(".y-axis").call(yAxis)

    return yScale
  }

  createBrush(svg, xScale, yScale, width, height, startTime, endTime, margin) {
    const brush = d3.brushX()

    brush.extent([
      [margin.left, 0],
      [width, height]
    ])

    brush.on('end', (event) => {
      this.onBrushMoveEnded(event, (coordinates) => {
        const selection = coordinates.map(xScale.invert)

        console.log(selection)

        startTime = new Date(selection[0]).getTime()
        endTime = new Date(selection[1]).getTime()

        // console.log(this.formatTime(selection[0]), this.formatTime(selection[1]))
      })
    })

    return brush
  }

  onBrushMoveEnded(event, callback) {
    if (!event.sourceEvent) return // Only transition after input.
    if (!event.selection) return // Ignore empty selections.

    callback(event.selection)
  }

  createLines(svg, data, xScale, yScale, width, height) {
    // svg
    //   .select(".plot-area")
    //   .attr("fill", "steelblue")
    //   .selectAll(".bar")
    //   .data(data)
    //   .join("rect")
    //   .attr("class", "bar")
    //   .attr("x", (d) => x(d.time))
    //   .attr("width", x.bandwidth())
    //   .attr("y", (d) => y1(d.amount))
    //   .attr("height", (d) => y1(0) - y1(d.amount))
    //   .append('title')
    //   .text((d) => `Sales were ${d.amount} in ${d3.timeFormat('%m/%d/%Y')(d.time)}`)

    const lines = svg.append('g').attr('class', 'lines').selectAll('line')
      .data(data)
      .enter().append('line')
      .attr('class', 'mark')
      .attr('x1', d => xScale(d.time))
      .attr('y1', height)
      .attr('x2', d => xScale(d.time))
      .attr('y2', d => yScale(d.amount))
      //.attr('shape-rendering', 'crispEdges')
      // .attr('opacity', d => {
      //   console.log(d.time, startTime)
      //   if (d.time >= startTime && d.time <= endTime) {
      //     return '1'
      //   } else {
      //     return '0.2'
      //   }
      // })
      .attr('stroke-width', '2.5')
      .attr('stroke', '#62d573')
      //.attr('transform', 'translate(40,' + 0 + ')')

    this.handleTooltips(lines)
  }

  handleTooltips(lines) {
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)

    lines.on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9)

      tooltip.html(`${this.formatTime(d.time)}: ${d.amount}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px")
    })

    lines.on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0)
    })
  }

  formatTime(time) {
    return d3.timeFormat('%m/%d/%Y')(time)
  }
}

function getData() {
  return d3.range(5).map(() => {
    return {
      time: Math.ceil(new Date().getTime() - Math.random() * 10000000000),
      amount: Math.ceil(Math.random() * 100)
    }
  }).sort((first, second) => first.time - second.time)
}

new BarChar4('svg', getData())
