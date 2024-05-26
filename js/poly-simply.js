const { fromEvent, interval } = rxjs;
const { take, map } = rxjs.operators;

const size = 600; //The size of the canvas
const margin_size = 50;
const point_size = 5;
const colors = d3.scaleOrdinal(d3.schemeCategory10);
const domain_max = 100;
const yAxisPadding = 20;

// define how may data label to show with delay
const labelDelay = 5;
// interval defines how fast the data is coming
const it = 500;
const keepData = 20;

const curves = [
    d3.curveBasis,
    d3.curveStep,
    d3.curveLinear,
    d3.curveNatura,
    d3.curveCardinal,
    d3.curveBundle
];


function genData() {
    const numbers = interval(it);
    const takeCount = 1000; // how many data to take

    const dataRange = {
        min: 0,
        max: 100
    };

    const takeNumbers = numbers.pipe(
        take(takeCount),
        map((ev) => [
            Math.floor(Math.random() * (dataRange.max - dataRange.min)) +
            dataRange.min,
            ev,
            Date.now() - Math.floor(Math.random() * 0)
        ])
    );

    return takeNumbers;
}

function getNow() {
    const now = new Date();
    return new Date().toLocaleTimeString();
}

function isAnomaly(data) {
    return data > 67;
}

$(function () {
    console.log("ready!");
    fromEvent(document, "click").subscribe(() => console.log("Clicked!"));

    const margin = {
        top: margin_size,
        right: margin_size,
        bottom: margin_size,
        left: margin_size
    },
        width = size - margin.left - margin.right,
        height = size - margin.top - margin.bottom;

    //Draw Axis
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    const root = d3
        .select("#chart")
        .append("svg")
        .attr("width", size)
        .attr("height", size);

    const rootCanvas = root
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // define the clipPath
    const clipPath = rootCanvas
        .append("clipPath")
        .attr("id", "rect-clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", size)
        .attr("height", size);

    const dataCanvas = rootCanvas
        .append("g")
        .attr("clip-path", "url(#rect-clip)");

    yScale.domain([0, domain_max]);
    const yAxis = rootCanvas
        .append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (-yAxisPadding) + ", 0) ")
        .call(d3.axisLeft(yScale).ticks(4));

    const localtimeScale = d3.scaleTime().range([0, width]);
    // 30 seconds
    const startTime = Date.now();
    const defaultDuration = 10; // second
    const endTime = startTime + defaultDuration * 1000;
    localtimeScale.domain([startTime, endTime]);

    const timeAxis = rootCanvas
        .append("g")
        .attr("class", "timeAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(localtimeScale).ticks(d3.timeSecond.every(2)));

    const graph = dataCanvas
        .append("circle")
        .attr("cx", 0)
        .attr("cy", height)
        .attr("r", 0)
        .classed("circle", true);

    const graphTimeIndicator = dataCanvas
        .append("circle")
        .attr("cx", 0)
        .attr("cy", height)
        .attr("r", 5)
        .attr("class", "data-time-indicator");

    const currentTimeIndicator = dataCanvas
        .append("circle")
        .attr("cx", 0)
        .attr("cy", height - 10)
        .attr("r", 5)
        .attr("class", "current-time-indicator");

    var lineData = [];
    var historyLine = d3
        .line()
        .curve(curves[1]) // switch to different curve here  https://github.com/d3/d3-shape/blob/main/README.md#curveLinear
        .x((d) => localtimeScale(d[2]))
        .y((d) => yScale(d[0]));

    const historyLineGraph = dataCanvas.append("path").attr("class", "line");

    const nowIndicator = rootCanvas
        .append("text")
        .attr("class", "now")
        .attr("x", margin.left + 50)
        .attr("y", margin.top + 50)
        .text(getNow());

    var drift = 0;
    var tDiffTotal = 0;
    var timeDiffTotal = 0;
    // consume data by subcribe the stream
    genData().subscribe(([d, i, t]) => {
        var prevData;
        if (lineData.length > 0) {
            prevData = lineData[lineData.length - 1];
        }
        lineData.push([d, i, t]);

        // transition historical line
        historyLineGraph.transition().delay(it).attr("d", historyLine(lineData));

        // move current data
        graph
            .transition()
            .duration(it)
            .attr("cx", localtimeScale(t))
            .attr("cy", yScale(d))
            .attr("r", 5);

        graphTimeIndicator
            .transition()
            .duration(it)
            .attr("cx", localtimeScale(t));

        currentTimeIndicator
            .transition()
            .duration(it)
            .attr("cx", localtimeScale(Date.now()));

        // draw a delta line of new moving data
        if (prevData) {
            const deltaLine = dataCanvas
                .append("line")
                .attr("x1", localtimeScale(prevData[2]))
                .attr("y1", yScale(prevData[0]))
                .attr("x2", localtimeScale(prevData[2]))
                .attr("y2", yScale(prevData[0]))
                .attr("class", "deltaline")
                .transition()
                .duration(it)
                .attr("x2", localtimeScale(t))
                .attr("y2", yScale(d))

            deltaLine
                .transition()
                .duration(it)
                .attr("stroke-width", 0);
            // todo : how to remove delta line here
        }

        // min/max indicator
        const minValue = d3.min(lineData, (d) => d[0]);
        const maxValue = d3.max(lineData, (d) => d[0]);

        const yHistoryScale = d3.scaleLinear().rangeRound([yScale(minValue), yScale(maxValue)]);
        yHistoryScale.domain([minValue, maxValue]);

        yAxis.transition().call(d3.axisLeft(yHistoryScale).tickValues(yHistoryScale.domain()).ticks(3));

        // historical data distribution
        // jitter 10 on x axis
        rootCanvas
            .append("circle")
            .attr("cx", -yAxisPadding + Math.floor(Math.random() * 10))
            .attr("cy", yScale(d))
            .attr("r", 2)
            .classed("circle", true)
            .style("opacity", 0.3);

        // fade out recent data and label
        const recentData = dataCanvas
            .append("circle")
            .attr("cx", localtimeScale(t))
            .attr("cy", yScale(d))
            .attr("r", 0)
            .classed("circle", true);

        recentData.transition()
            .delay(it)
            .attr("cx", localtimeScale(t))
            .attr("cy", yScale(d))
            .attr("r", 5)
            .transition()
            .duration(it * 3)
            .attr("r", 0)
            .on("end", function () {
                recentData.remove();
            });

        // draw anomaly
        if (isAnomaly(d)) {
            dataCanvas
                .append("text")
                .attr("class", "anomaly")
                .attr("x", localtimeScale(t))
                .attr("y", yScale(d) - 10)
                .attr("font-size", 12)
                .transition()
                .delay(it)
                .text(d);

            dataCanvas
                .append("circle")
                .attr("cx", localtimeScale(t))
                .attr("cy", yScale(d))
                .attr("r", 0)
                .classed("circle-anomaly", true)
                .transition()
                .delay(it)
                .attr("r", 8);

        } else {
            const dataLable = dataCanvas
                .append("text")
                .attr("class", "dataLabel")
                .attr("x", localtimeScale(t))
                .attr("y", yScale(d) - 10)
                .attr("font-size", 12);

            dataLable.transition()
                .delay(it)
                .text(d)
                .transition()
                .duration(it * labelDelay)
                .attr("font-size", 0)
                .on("end", function () {
                    dataLable.remove();
                });

            // TODO : remove those datalabel
        }

        if (prevData) {
            // move canvas in case the data is about of out range
            const timeDiff = t - prevData[2];
            // draw current time
            const currentTimePosition = localtimeScale(Date.now()) - 50;
            nowIndicator.text(getNow());
        }

        // moving data
        if (lineData.length > keepData) {
            // move data canvas
            const t0 = localtimeScale(t);
            const t1 = localtimeScale(prevData[2]);
            const tDiff = t0 - t1;
            tDiffTotal += tDiff;

            timeDiffTotal += t - prevData[2];

            drift -= tDiff;
            dataCanvas.transition().duration(it).attr("transform", "translate(" + drift + "," + 0 + ")");

            // move clip region
            clipPath.attr("x", -drift).attr("width", size - drift);

            // update time axis
            const updateTimeScale = d3.scaleTime().range([0, width]);
            updateTimeScale.domain([
                startTime + timeDiffTotal,
                endTime + timeDiffTotal
            ]);

            timeAxis.transition().duration(it).call(d3.axisBottom(updateTimeScale).ticks(d3.timeSecond.every(2)));
        }
    });
});
