/* global d3, crossfilter, timeSeriesChart, barChart */

// 2015-05-01 00:43:28
const dateFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");

const chartTimeline = timeSeriesChart()
  .width(1000)
  .x((d) => {return d.key;})
  .y((d) => {return d.value;});

const barChartGate = barChart()
  .width(600)
  .x(function (d) {
    return d.key;
  })
  .y(function (d) {
    return d.value;
  });

const barChartCar = barChart()
  .x(function (d) {
    return d.key;
  })
  .y(function (d) {
    return d.value;
  });

d3.csv("data/Lekagul_slice.csv",
  function (d) {
    // This function is applied to each row of the dataset
    d.Timestamp = dateFmt(d.Timestamp);
    return d;
  },
  function (err, data) {
    if (err) throw err;

    const csData = crossfilter(data);

    // We create dimensions for each attribute we want to filter by
    csData.dimTime = csData.dimension(function (d) { return d.Timestamp; });
    csData.dimCarType = csData.dimension(function (d) { return d["car-type"]; });
    csData.dimGateName = csData.dimension(function (d) { return d["gate-name"]; });

    // We bin each dimension
    csData.timesByHour = csData.dimTime.group(d3.timeHour);
    csData.carTypes = csData.dimCarType.group();
    csData.gateNames = csData.dimGateName.group();


    chartTimeline.onBrushed(function (selected) {
      csData.dimTime.filter(selected);
      update();
    });

    barChartCar.onMouseOver(function (d) {
      csData.dimCarType.filter(d.key);
      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimCarType.filterAll();
      update();
    });

    barChartGate.onMouseOver(function (d) {
      csData.dimGateName.filter(d.key);
      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimGateName.filterAll();
      update();
    });

    function update() {
      d3.select("#timeline")
        .datum(csData.timesByHour.all())
        .call(chartTimeline);

      d3.select("#carTypes")
        .datum(csData.carTypes.all())
        .call(barChartCar);

      d3.select("#gates")
        .datum(csData.gateNames.all())
        .call(barChartGate)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text")
        .attr("transform", "translate(-8,-1) rotate(-45)");

    }

    update();


  }
);
