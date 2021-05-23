/* global d3, crossfilter, timeSeriesChart, barChart */

class BarChart {
  xValue(d) {
    return d[0]
  }

  yValue(d) {
    return d[1]
  }

  createBrush(width, height, margin, xScale) {
    const brush = d3.brushX()

    brush.extent([[0, 0], [width - margin.right - margin.left, height - margin.bottom - margin.top]])

    const brushMoved = () => {
      this.brushMoved(xScale)
    }

    brush.on("end", brushMoved)

    return brush
  }

  brushMoved(xScale) {
    const selection = d3.event.selection

    if (!d3.event.sourceEvent || !selection) return

    const selectedTime = selection.map(d => xScale.invert(d))

    console.log('brushEnded', selectedTime)
    // onBrushed(selectedTime)
  }

  constructor(selector) {
    const dateFmt = d3.timeParse("%Y-%m-%d %H:%M:%S")

    let margin = {top: 20, right: 20, bottom: 20, left: 20}
    let width = 760
    let height = 120

    let xValue = (d) => {return d[0]}
    let yValue = (d) => {return d[1]}

    const xScale = d3.scaleTime()
    //const xScale = d3.scaleLinear().range([0, width])

    const yScale = d3.scaleLinear()

    // The x-accessor for the path generator xScale ∘ xValue.
    let X = (d) => {
      return xScale(d[0])
    }

    // The y-accessor for the path generator yScale ∘ yValue.
    let Y = (d) => {
      return yScale(d[1])
    }

    const area = d3.area()
        .x(X)
        .y1(Y)

    // const line = d3.line()
    //     .x(X)
    //     .y(Y)

    const brush = this.createBrush(width, height, margin, xScale)

    let chart = (selection) => {
      selection.each(function(data) {
        // Convert data to standard representation greedily
        // this is needed for nondeterministic accessors.
        data = data.map((d, i) => {
          return [xValue.call(data, d, i), yValue.call(data, d, i)]
        })

        // Update the x-scale.
        xScale.domain(
          d3.extent(data, (d) => {return d[0]})
        )
        .range([0, width - margin.left - margin.right])

        // Update the y-scale.
        yScale.domain([
          0,
          d3.max(data, (d) => {
            return d[1]
          })
        ])
        .range([height - margin.top - margin.bottom, 0])

        // Select the svg element, if it exists.
        const svg = d3.select(this)
          .selectAll("svg")
          .data([data])

        // Otherwise, create the skeletal chart.
        const svgEnter = svg.enter().append("svg")
        const gEnter = svgEnter.append("g")

        gEnter.append("path").attr("class", "area")
        gEnter.append("path").attr("class", "line")
        gEnter.append("g").attr("class", "x axis")
        gEnter
          .append("g")
          .attr("class", "brush")
          .call(brush)

        // Update the outer dimensions.
        svg.merge(svgEnter)
          .attr("width", width)
          .attr("height", height)

        // Update the inner dimensions.
        const g = svg.merge(svgEnter)
          .select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // Update the area path.
        g.select(".area").attr("d", area.y0(yScale.range()[0]))

        // Update the line path.
        // g.select(".line").attr("d", line)

        // Update the x-axis.
        g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(d3.axisBottom(xScale).tickSize(6, 0))
      })
    }

    chart.margin = (_) => {
      if (!arguments.length) return margin
      margin = _
      return chart
    }

    chart.width = (_) => {
      if (!arguments.length) return width
      width = _
      return chart
    }

    chart.height = (_) => {
      if (!arguments.length) return height
      height = _
      return chart
    }

    chart.x = (_) => {
      if (!arguments.length) return xValue
      xValue = _
      return chart
    }

    chart.y = (_) => {
      if (!arguments.length) return yValue
      yValue = _
      return chart
    }

    // chart.onBrushed = (_) => {
    //   if (!arguments.length) return onBrushed
    //   onBrushed = _
    //   return chart
    // }

    //const chartTimeline = chart

    chart.width(1000)
      .x((d) => {return d.key})
      .y((d) => {return d.value})

    d3.csv("data/Lekagul_slice.csv",
      (d) => {
        // This function is applied to each row of the dataset
        d.Timestamp = dateFmt(d.Timestamp)
        return d
      },
      function (err, data) {
        if (err) throw err

        const csData = crossfilter(data)

        // We create dimensions for each attribute we want to filter by
        csData.dimTime = csData.dimension(function (d) { return d.Timestamp })
        // csData.dimCarType = csData.dimension(function (d) { return d["car-type"] })
        // csData.dimGateName = csData.dimension(function (d) { return d["gate-name"] })

        // We bin each dimension
        csData.timesByHour = csData.dimTime.group(d3.timeHour)
        // csData.carTypes = csData.dimCarType.group()
        // csData.gateNames = csData.dimGateName.group()

        // chartTimeline.onBrushed((selected) => {
        //   csData.dimTime.filter(selected)
        //   update()
        // })

        function update() {
          d3.select("#timeline")
            .datum(csData.timesByHour.all())
            .call(chart)
        }

        update()
      }
    )
  }
}

new BarChart('svg')
