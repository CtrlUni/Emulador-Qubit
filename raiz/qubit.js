
	var button = document.getElementById("clickme"),
	
  count = 0;
button.onclick = function() {
  count += 1;
  button.innerHTML = "Clique nos pontos" ;//+ count; 
   root.children.forEach(collapse); //começa com todos os pontos recolhidos
   update(root);
   //update(d);
count=1;

  };
	
	
	var pubs =
{
    "name": ">>>>>",
    "children": [
        
         {
            "name": "bit 0","children": [
                {"name": "FFT X","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]},
                {"name": "FFT Y","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]},
                {"name": "FFT Z","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]}
                
            ]
        },
       {
            "name": ">>>Super","children": [
                {"name": "FFT X","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"},
                ]},
                {"name": "FFT Y","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]},
                {"name": "FFT Z","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]}
                
            ]
        },
       {
            "name": "bit 1","children": [
                {"name": "FFT X","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]},
                {"name": "FFT Y","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]},
                {"name": "FFT Z","children": [
                    {"name": "128 bit"},
                    {"name": "128 bit"},
					{"name": "128 bit"}
                ]}
                
            ]
        }
    ]
};

var diameter = 550;

var margin = {top: 0, right: 0, bottom: 0, left: -100},
    width = diameter,
    height = diameter;
    
var i = 0,
    duration = 2000,
    root;

var tree = d3.layout.tree()
    .size([180, diameter / 2 - 80])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 10) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body-spin").append("svg")
    .attr("width", width )
    .attr("height", height )
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

root = pubs;
root.x0 = height ;
root.y0 = 0;

//root.children.forEach(collapse); //comece com todas as crianças desmaiadas
update(root);

d3.select(self.frameElement).style("height", "400px");

function update(source) {

  // Calcula o novo layout da árvore.
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  // Normaliza para profundidade fixa.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Atualize os nós…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Insira quaisquer novos nós na posição anterior do pai.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", 10)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Faz a transição dos nós para sua nova posição.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  // TODO: transformação apropriada
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Atualize os links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Insira quaisquer novos links na posição anterior do pai.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Links de transição para sua nova posição.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transição dos nós existentes para a nova posição do pai.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Armazena as posições antigas para transição.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Alterna os link ao clicar.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  
  update(d);
}

// Recolher nós
function collapse(d) {
  if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
} 
var backgroundInterval = setInterval(function () {
 //update(root);
}, 1000);
 
