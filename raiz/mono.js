const { fromEvent, interval } = rxjs;
const { take, map } = rxjs.operators;

const curves = [
  d3.curveBasis,
  d3.curveStep,
  d3.curveLinear,
  d3.curveCardinal,
  d3.curveBundle
];

const margin_size = 50;
const point_size = 5;
const colors = d3.scaleOrdinal(d3.schemeCategory10);
const domain_max = 100;
const yAxisPadding = 20;
const allItems = ["A", "B", "C", "D", "E"];
const barWidth = 50;

// as seguintes opções são usadas para

const latestDataOptions = ["point", "bar", "figure"];
const labelDelay = 5; //define como o rótulo de dados pode ser mostrado com atraso
const pauseInterval = 3000;



var size = 500; //O tamanho da tela
var it = 500; // intervalo define a rapidez com que os dados estão chegando
var historyLine = d3.line().curve(curves[0]);
var latency = 0;
var timeMargin = 100;
var timeDuration = 10000; // quanto tempo para visualizar o intervalo de tempo em segundos
var shareValueRange = false;
var items = allItems.slice(0, 1); // quantos dados categóricos mostrar
var historyFadeTime = 5000;
var historyDataSize = 5;
var showRecentData = false;
var latestDataOption = "point";
var trendType = "line";

var showTimeAxis = true;
var showValueAxis = true;

var yAxis = undefined;
var timeAxis = undefined;
var localtimeScale = undefined;
var rootCanvas = undefined;
var yScale = undefined;
var dataCanvas = undefined;
var graph = undefined;
var subscribe = undefined;

var isPaused = false;

var margin = {
  top: margin_size,
  right: margin_size,
  bottom: margin_size,
  left: margin_size
};
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;

function genData() {
  const numbers = interval(it);
  const takeCount = 1000; //quantos dados levar

  const dataRange = {
    min: 0,
    max: 100
  };

  const dataPoint = function () {
    return items.map(function () {
      return (
        Math.floor(Math.random() * (dataRange.max - dataRange.min)) +
        dataRange.min
      );
    });
  };

  const takeNumbers = numbers.pipe(
    take(takeCount),
    map((ev) => [
      dataPoint(),
      ev,
      Date.now() - Math.floor(Math.random() * latency)
    ])
  );

  return takeNumbers;
}

function getNow() {
  const now = new Date();
  return new Date().toLocaleTimeString();
}

// simula o sono aqui
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function initControl() {
  $("#sizeInput").change(function (e) {
    size = parseInt(this.value);
    width = size - margin.left - margin.right;
    height = size - margin.top - margin.bottom;
    updateChart();
  });

  $("#intervalInput").change(function (e) {
    it = parseInt(this.value);
    updateChart();
  });

  $("#durationInput").change(function (e) {
    timeDuration = parseInt(this.value);
    updateChart();
  });

  $("#timeMarginInput").change(function (e) {
    timeMargin = parseInt(this.value);
  });

  $("#curveSelect").change(function (e) {
    historyLine.curve(curves[parseInt(this.value)]);
  });

  $("#latestDataTypeSelect").change(function (e) {
    latestDataOption = latestDataOptions[parseInt(this.value)];
    updateLatestGraph();
  });

  $("#numberInput").change(function (e) {
    items = allItems.slice(0, parseInt(this.value));
    updateChart();
  });

  $("#shareValueRangeInput").change(function (e) {
    shareValueRange = this.checked;
    updateYAxis();
  });

  $("#historyFadeInput").change(function (e) {
    historyFadeTime = parseInt(this.value);
  });

  $("#historySizeInput").change(function (e) {
    historyDataSize = parseInt(this.value);
  });

  $("#showRecentDataInput").change(function (e) {
    showRecentData = this.checked;
  });

  $("#showTimeAxisInput").change(function (e) {
    showTimeAxis = this.checked;
    updateTimeAxis();
  });

  $("#trendAsBarCheck").change(function (e) {
    if ( this.checked ) {
      trendType = "bar";
    } else {
      trendType = "line";
    }
  });
  
  $("#showValueAxisInput").change(function (e) {
    showValueAxis = this.checked;
    updateYAxis();
  });

  $("#restartButton").click(function () {
    updateChart();
  });

  $("#stopButton").click(function () {
    isPaused = !isPaused;
    $(this).attr("disabled", true);
  });
}

function updateTimeAxis() {
  if (!showTimeAxis) {
    $(".timeAxis").remove();
  } else {
    timeAxis = rootCanvas
      .append("g")
      .attr("class", "timeAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(localtimeScale).ticks(d3.timeSecond.every(2)));
  }
}

function updateYAxis() {
  $(".yAxis").remove();
  $(".historyDistribution").remove(); // remove historiy distribution
  const valueRange = height / items.length;
  yScale = items.map(function (item, index) {
    if (shareValueRange) {
      const scale = d3.scaleLinear().rangeRound([height, 0]);
      scale.domain([0, domain_max]);
      return scale;
    } else {
      const start = height - index * valueRange;
      const end = height - (index + 1) * valueRange;
      const scale = d3
        .scaleLinear()
        .rangeRound([
          height - index * valueRange,
          height - (index + 1) * valueRange
        ]);
      scale.domain([0, domain_max]);
      return scale;
    }
  });

  if (showValueAxis) {
    if (shareValueRange) {
      yAxis = rootCanvas
        .append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + -yAxisPadding + ", 0) ")
        .call(d3.axisLeft(yScale[0]).ticks(0));
    } else {
      yAxis = yScale.map(function (scale) {
        const axis = rootCanvas
          .append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(" + -yAxisPadding + ", 0) ")
          .call(d3.axisLeft(scale).ticks(0));
        return axis;
      });
    }
  }
}

function updateLatestGraph() {
  $(".latest").remove();
  // o gráfico é para o ponto de dados mais recente 
  // é melhor começar da posição atual
  graph = items.map(function (item) {
    if (latestDataOption == "bar") {
      return dataCanvas
        .append("rect")
        .attr("class", "latest")
        .attr("new", "1")
        .attr("x", 0)
        .attr("y", height)
        .attr("width", barWidth)
        .attr("height", 0);
    } else if (latestDataOption == "figure") {
      return dataCanvas.append("g").attr("class", "latest").attr("new", "1");
    }

    return dataCanvas
      .append("circle")
      .attr("class", "latest")
      .attr("new", "1")
      .attr("cx", 0)
      .attr("cy", height)
      .attr("r", 0);
  });
}

function drawFigure(graph, value, history, x, y, color, moveDuration) {
  var text = graph.select(".figureValue");

  if (text.empty()) {
    graph
      .append("text")
      .attr("class", "figureValue")
      .attr("x", x)
      .attr("y", y)
      .text(value)
      .style("fill", color)
      .style("font-size", 96);
  } else {
    text
      .transition()
      .duration(moveDuration)
      .attr("x", x)
      .attr("y", y)
      .text(value);
  }

  const hisLength = history.length;

  var sparkLine = history;
  if (hisLength > 20) {
    sparkLine = history.slice(hisLength - 20, hisLength);
  }

  const sparkLineLength = sparkLine.length;

  const figureXScale = d3.scaleTime().range([0, 100]);
  figureXScale.domain([sparkLine[0][2], sparkLine[sparkLineLength - 1][2]]);

  const figureYScale = d3.scaleLinear().rangeRound([50, 0]);
  figureYScale.domain([0, domain_max]);

  const figureLine = d3.line().curve(curves[3]);

  figureLine.x(function (d) {
    return figureXScale(d[2]);
  });

  figureLine.y(function (d) {
    return figureYScale(d[0]);
  });

  var figureLineGraph = graph.select(".figureLine");

  if (figureLineGraph.empty()) {
    figureLineGraph = graph
      .append("path")
      .attr("class", "figureLine")
      .style("stroke", color);
  }

  figureLineGraph
    .transition()
    .duration(moveDuration)
    .attr("transform", "translate(" + x + "," + y + ")")
    .attr("d", figureLine(sparkLine));
}

function drawBar(graph,offset,x,y,height,color){
  var w = 20 * it / 500;
  if (shareValueRange) {
    w = w/items.length;
  }
  graph
        .append("rect")
        .attr("class", "trend")
        .attr("x", x + offset - w/2 + offset*w)
        .attr("y", y + height)
        .attr("width", w)
        .attr("height", 0)
        .style("fill", color)
        .transition()
        .duration(it)
        .attr("y", y)
        .attr("height", height);
}

function updateChart() {
  $("#chart").empty();
  if (subscribe) {
    subscribe.unsubscribe();
  }

  const stream = genData();
  realtimeVizsualization(stream);
}

function realtimeVizsualization(stream) {
  const root = d3
    .select("#chart")
    .append("svg")
    .attr("width", size)
    .attr("height", size);

  rootCanvas = root
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //define o clipPath
  const clipPath = rootCanvas
    .append("clipPath")
    .attr("id", "rect-clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", size)
    .attr("height", size);

  dataCanvas = rootCanvas.append("g").attr("clip-path", "url(#rect-clip)");

  updateYAxis();

  localtimeScale = d3.scaleTime().range([0, width]);
  const startTime = Date.now();
  const endTime = startTime + timeDuration;
  localtimeScale.domain([startTime, endTime]);

  if (showTimeAxis) {
    timeAxis = rootCanvas
      .append("g")
      .attr("class", "timeAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(localtimeScale).ticks(d3.timeSecond.every(2)));
  }

  // o gráfico é para o ponto de dados mais recente
  updateLatestGraph();

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

  const lineData = items.map(function (item) {
    return [];
  });

  const historyLineGraph = items.map(function (item) {
    return dataCanvas.append("path").attr("class", "line");
  });

  const nowIndicator = rootCanvas
    .append("text")
    .attr("class", "now")
    .attr("x", size / 2 - 80)
    .attr("y", height + 50)
    .text(getNow());

  historyLine.x(function (d) {
    return localtimeScale(d[2]);
  });

  var drift = 0;
  var tDiffTotal = 0;
  var timeDiffTotal = 0;

  //consome dados assinando o stream
  subscribe = stream.subscribe(([data, i, t]) => {
    if (isPaused) {
      sleep(pauseInterval);
      $("#stopButton").attr("disabled", false);
      isPaused = false;
    }

    // dois indicadores no eixo do tempo
    graphTimeIndicator.transition().duration(it).attr("cx", localtimeScale(t));
    currentTimeIndicator
      .transition()
      .duration(it)
      .attr("cx", localtimeScale(Date.now()));

    //desenha uma linha para cada item categórico 
	// TODO: deve usar a seleção d3
    items.map(function (item) {
      const itemIndex = items.indexOf(item);
      const color = colors(item);

      const d = data[itemIndex];
      const itemYscale = yScale[itemIndex];

      const itemLineData = lineData[itemIndex];
      var prevData;
      if (itemLineData.length > 0) {
        prevData = itemLineData[itemLineData.length - 1];
      }

      itemLineData.push([d, i, t]);
      const getX = function () {
        const barRange = size / items.length;
        return timeDuration == 0
          ? itemIndex * barRange + barWidth / 2
          : localtimeScale(t);
      };


      // tendência histórica de transição
      if (timeDuration != 0) {
        if (trendType == "bar") {
          var offset = 0;
          if ( shareValueRange ) {
            offset = itemIndex;
          }
          
          drawBar(
            dataCanvas,
            offset,
            getX(),
            itemYscale(d),
            itemYscale.range()[0] - itemYscale(d),
            color
          );
        } else {
          historyLine.y(function (d) {
            return itemYscale(d[0]);
          });

          historyLineGraph[itemIndex]
            .transition()
            .delay(it)
            .attr("d", historyLine(itemLineData))
            .style("stroke", color);
        }
      }
      
      //move os dados atuais
      if (timeDuration == 0) {
        const isNew = graph[itemIndex].attr("new");
        const moveDuration = isNew == "1" ? 0 : it;

        if (latestDataOption == "bar") {
          graph[itemIndex]
            .transition()
            .duration(moveDuration)
            .attr("x", getX())
            .attr("y", itemYscale(d))
            .attr("height", itemYscale.range()[0] - itemYscale(d))
            .style("fill", color);
        } else if (latestDataOption == "figure") {
          drawFigure(
            graph[itemIndex],
            d,
            itemLineData,
            getX(),
            itemYscale(50),
            color,
            moveDuration
          );
        } else {
          graph[itemIndex]
            .transition()
            .duration(it)
            .attr("cx", getX())
            .attr("cy", itemYscale(d))
            .attr("r", 5)
            .style("fill", color);
        }

        if (isNew == "1") {
          graph[itemIndex].attr("new", "0");
        }
      } else {
        graph[itemIndex]
          .transition()
          .duration(it)
          .attr("cx", getX())
          .attr("cy", itemYscale(d))
          .attr("r", 5)
          .style("fill", color);
      }

      //desenha uma linha delta de novos dados móveis
      if (prevData && timeDuration != 0) {
        const deltaLine = dataCanvas
          .append("line")
          .attr("x1", localtimeScale(prevData[2]))
          .attr("y1", itemYscale(prevData[0]))
          .attr("x2", localtimeScale(prevData[2]))
          .attr("y2", itemYscale(prevData[0]))
          .attr("class", "deltaline")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .transition()
          .duration(it)
          .attr("x2", localtimeScale(t))
          .attr("y2", itemYscale(d));

        deltaLine.transition().duration(0).attr("stroke-width", 0);
        // todo: como remover a linha delta aqui
      }

      // indicador mínimo/máximo 
	  // TODO: min/max devem ser todos dados
      if (showValueAxis) {
        const minValue = d3.min(itemLineData, (d) => d[0]);
        const maxValue = d3.max(itemLineData, (d) => d[0]);

        const yHistoryScale = d3
          .scaleLinear()
          .rangeRound([itemYscale(minValue), itemYscale(maxValue)]);
        yHistoryScale.domain([minValue, maxValue]);

        if (shareValueRange) {
          yAxis
            .transition()
            .call(
              d3
                .axisLeft(yHistoryScale)
                .tickValues(yHistoryScale.domain())
                .ticks(3)
            );
        } else {
          yAxis[itemIndex]
            .transition()
            .call(
              d3
                .axisLeft(yHistoryScale)
                .tickValues(yHistoryScale.domain())
                .ticks(3)
            );
        }

        //distribuição histórica de dados 
		// jitter 10 no eixo x
        rootCanvas
          .append("circle")
          .attr("class", "historyDistribution")
          .attr("cx", -yAxisPadding + Math.floor(Math.random() * 10))
          .attr("cy", itemYscale(d))
          .attr("r", 2)
          .style("fill", color)
          .style("opacity", 0.3);
      }

      if (showRecentData) {
        // esmaece dados e rótulos recentes
        const recentData = dataCanvas
          .append("circle")
          .attr("cx", getX())
          .attr("cy", itemYscale(d))
          .attr("r", 0)
          .classed("circle", true)
          .style("fill-opacity", 0.5);

        recentData
          .transition()
          .delay(it)
          .attr("x", getX())
          .attr("cy", itemYscale(d))
          .attr("r", historyDataSize)
          .style("fill", color)
          .transition()
          .duration(historyFadeTime)
          .attr("r", 0)
          .on("end", function () {
            recentData.remove();
          });

        const dataLable = dataCanvas
          .append("text")
          .attr("class", "dataLabel")
          .attr("x", getX() + 10)
          .attr("y", itemYscale(d) - 10)
          .attr("font-size", 12);

        dataLable
          .transition()
          .delay(it)
          .text(d)
          .transition()
          .duration(it * labelDelay)
          .attr("font-size", 0)
          .on("end", function () {
            dataLable.remove();
          });
      }
    });

    const itemLineData = lineData[0];

    if (itemLineData.length > 1) {
      const prevData = itemLineData[itemLineData.length - 1];
      const timeDiff = t - prevData[2];
      //desenha a hora atual
      const currentTimePosition = localtimeScale(Date.now()) - 50;
      nowIndicator.text(getNow());
    }

    // Precisa de atualização quando começar a se mover 
	// Precisa de um novo algoritmo para atualizar o eixo do tempo

    if (itemLineData.length > 2 && timeDuration != 0) {
      const prevData = itemLineData[itemLineData.length - 2];

      const t0 = localtimeScale(t); //posição da hora atual
      const t1 = localtimeScale(prevData[2]); //posição da última vez
      const te = localtimeScale(endTime + timeDiffTotal); //posição final

      // move a tela de dados quando restam apenas 100 ms
      if (te - t0 < timeMargin) {
        // código seguinte muda a tela para um delta único da direita para a esquerda
        const tDiff = t0 - t1;
        tDiffTotal += tDiff;
        timeDiffTotal += t - prevData[2];
        drift -= tDiff;

        dataCanvas
          .transition()
          .duration(it)
          .attr("transform", "translate(" + drift + "," + 0 + ")");

        // move a região do clipe
        clipPath.attr("x", -drift).attr("width", size - drift);

        // atualiza o tempo do eixo
        const updateTimeScale = d3.scaleTime().range([0, width]);
        updateTimeScale.domain([
          startTime + timeDiffTotal,
          endTime + timeDiffTotal
        ]);

        if (showTimeAxis) {
          timeAxis
            .transition()
            .duration(it)
            .call(d3.axisBottom(updateTimeScale).ticks(d3.timeSecond.every(2)));
        }
      }
    }
  });
}

$(function () {
  console.log("ready!");
  fromEvent(document, "click").subscribe(() => console.log("Clicked!"));

  initControl();
  updateChart();
});
