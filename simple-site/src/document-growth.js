// import * as d3 from 'd3';

class DocumentGrowth {
  constructor(selector) {
    const startTime = this.data[0].time
    const endTime = this.data[this.data.length-1].time

    // console.log(this.data, startTime, endTime)

    const margin = {top: 0, left: 8, right: 10, bottom: 3}

    const svg = d3.select(selector)

    const canvas = this.createCanvas(svg, margin)

    const width = svg.attr("width") - margin.left - margin.right
    const height = svg.attr("height") - margin.top - margin.bottom
    const timeUnit = d3.timeWeek

    const coordinates = this.createCoordinates(canvas, width, height, timeUnit)

    this.createLines(this.data, svg, canvas, height, coordinates.xScale, coordinates.yScale)

    // this.createBrush(canvas, coordinates.xScale, coordinates.yScale, startTime, endTime)
  }

  createCanvas(svg, margin) {
    const g = svg.append("g")

    g.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

    return g
  }

  createCoordinates(svg, width, height, timeUnit) {
    const xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.time))
      .rangeRound([0, width])

    svg.append('g')
      .attr('class', 'axis axis--axisX')
      .attr('transform', 'translate(' + 0 + ',' + height + ')')
      .call(d3.axisBottom(xScale)
        // .ticks(timeUnit)
        // .tickPadding(0)
      )
      .attr('text-anchor', null)
      .selectAll('text')
      .attr('axisX', 6);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.amount))
      .range([height, 0])

    svg.append('g')
      //.attr('transform', 'translate(0, 50)')      // This controls the vertical position of the Axis
      .call(d3.axisLeft(yScale));

    return {xScale, yScale}
  }

  createBrush(canvas, xScale, yScale, startTime, endTime) {
    const brush = d3.brushX()

    brush.extent([
        [0, 0],
        [xScale.range()[1], yScale.range()[0]]
      ])

    brush.on('end', (event) => {
      this.onBrushMoveEnded(event, xScale)
    });

    const gBrush = canvas.append('g')
      .attr('class', 'brush')

    gBrush.call(brush);
    gBrush.call(brush.move, [startTime, endTime].map(xScale))
  }

  onBrushMoveEnded(event, xScale) {
    if (!event.sourceEvent) return; // Only transition after input.
    if (!event.selection) return; // Ignore empty selections.

    const selection = event.selection.map(xScale.invert);

    console.log(event.selection)

    const startTime = new Date(selection[0]).getTime();
    const endTime = new Date(selection[1]).getTime();

    // console.log(startTime, endTime)

    // if (selection) {
    //   updater(startTime, endTime)
    // }
  }

  createLines(data, svg, canvas, height, xScale, yScale) {
    const div = d3.select('div.tooltip')
      .style('opacity', 0);

    const mouseMoving = (event, d) => {
      div.transition()
        .duration(200)
        .style('opacity', .8);

      console.log(d)
      div.html(d.time)
        //d3.timeFormat('%m/%d/%Y')(d.key) + '<br/>' + d.value)
        .style('cursor', 'pointer')
        // .style('left', (event.pageX) + 'px')
        // .style('top', (event.pageY) + 'px');
    }

    const mouseOut = () => {
      div.transition()
        .duration(500)
        .style('cursor', 'pointer')
        .style('opacity', 0);
    }

    // svg.append('g')
    //   .attr('class', 'axis axis--axisX')
    //   .attr('transform', 'translate(0,' + height + ')')
    //   .call(d3.axisBottom(xScale));

    const lines = svg.append('g').attr('class', 'lines').selectAll('line')
      .data(data)

    lines.enter().append('line')
      .attr('class', 'mark')
      .attr('x1', d => xScale(d.time))
      .attr('y1', height)
      .attr('x2', d => xScale(d.time))
      .attr('y2', d => yScale(d.amount))
      .attr('shape-rendering', 'crispEdges')
      .attr("title", "Automatic Title Tooltip")
      // .enter().append("svg:title")
      //   .text((d) => { return 'd.value' })
      // .attr('opacity', d => {
      //   if (d.key >= startTime && d.key <= endTime) {
      //     return '0.6';
      //   } else {
      //     return '0.2';
      //   }
      // })
      .attr('stroke-width', '2.5')
      .attr('stroke', '#62d573')
      // .on('mousemove', mouseMoving)
      // .on('mouseover', mouseMoving)
      // .on('mouseout', mouseOut);
  }

  get data() {
    return d3.range(5).map(() => {
      return {
        time: Math.ceil(new Date().getTime() - Math.random() * 10000000000),
        amount: Math.ceil(Math.random() * 100)
      }
    }).sort((first, second) => first.time - second.time)
  }
}

new DocumentGrowth('svg')
