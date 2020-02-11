const candlestickSeries = fc.seriesSvgCandlestick()
	.bandwidth(3);

const movingAverageSeries = fc.seriesSvgLine()
  .mainValue(d => d.ma)
  .crossValue(d => d.date);

const mergedSeries = fc.seriesSvgMulti()
	.series([movingAverageSeries, candlestickSeries]);

const xScale = fc.scaleDiscontinuous(d3.scaleTime())
  .discontinuityProvider(fc.discontinuitySkipWeekends());

const chart = fc.chartCartesian(
    xScale,
    d3.scaleLinear()
  )
	.yOrient('left')
	.svgPlotArea(mergedSeries);

const durationDay = 864e5;
const xExtent = fc.extentDate()
	.accessors([d => d.date])

const yExtent = fc.extentLinear()
	.accessors([d => d.high, d => d.low])
	.pad([0.1, 0.1]);

const parseDate = d3.timeParse("%m-%Y");

const ma = fc.indicatorMovingAverage()
    .value(d => d.open);

const renderDayTradeChart = day => {
  d3.csv(`http://localhost:4567/getIntraday/tradealgo/${day}`,
    row => ({
      open: Number(row.Open),
      close: Number(row.Close),
      high: Number(row.High),
      low: Number(row.Low),
      date: new Date(row.Date)
    })).then(data => {
      const maData = ma(data);
      const mergedData = data.map((d, i) =>
        Object.assign({}, d, {
          ma: maData[i]
        })
      );
     
      chart.xDomain(xExtent(mergedData))
        .yDomain(yExtent(mergedData))
  
      d3.select('#day-trade')
        .datum(mergedData)
        .call(chart);
    });
}
