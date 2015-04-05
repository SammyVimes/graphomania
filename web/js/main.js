/**
 * Created by Семён on 02.04.2015.
 */

var renderOptions = {

    renderNodes: "all",
    renderCoefficients: "all"

};

(function($){
    var Renderer = function(canvas)
    {
        var canvas = $(canvas).get(0);
        var ctx = canvas.getContext("2d");
        var particleSystem;

        var colorSet = ["#72DCF0","#8BEC78","#075A9F","#A7FD2D","#7EB8DC"];

        var that = {
            init:function(system){

                particleSystem = system;
                particleSystem.screenSize(canvas.width, canvas.height);
                particleSystem.screenPadding(80);
                that.initMouseHandling();
            },

            redraw:function(){

                ctx.fillStyle = "white";
                ctx.fillRect(0,0, canvas.width, canvas.height);

                particleSystem.eachEdge(
                    function(edge, pt1, pt2){

                        var whatToRender = renderOptions.renderNodes;
                        if (whatToRender != "all") {
                            var sourceName = edge.source.name;
                            var destName = edge.target.name;
                            if (sourceName != whatToRender && destName != whatToRender) {
                                return;
                            }
                        }



                        var edgeCoeffs = edge.data.coefficients;
                        var i = 0;
                        var width = 10;

                        var start = [pt1.x, pt1.y];
                        var end = [pt2.x, pt2.y];
                        var above = 60;
                        var coeff = 0;
                        if ((edgeCoeffs.length % 2) != 0) {
                            coeff = edgeCoeffs[i].value;
                            ctx.strokeStyle = colorSet[i];
                            drawLine(ctx, start[0], start[1], end[0], end[1], coeff);
                            i++;
                        }
                        for (; i < edgeCoeffs.length; i++) {
                            coeff = edgeCoeffs[i].value;
                            if (Math.abs(coeff) < visibilityBorder) {
                                continue;
                            }
                            ctx.strokeStyle = colorSet[i];
                            ctx.lineWidth = coeff * width;
                            ctx.beginPath();
                            var control = [0.5*(start[0]+end[0]), 0.5*(start[1]+end[1])-above];
                            ctx.moveTo(start[0], start[1]);
                            if (coeff < 0) {
                                if ( ctx.setLineDash !== undefined )   ctx.setLineDash([30,5]);
                                if ( ctx.mozDash !== undefined )       ctx.mozDash = [30,5];
                            } else {
                                if ( ctx.setLineDash !== undefined )   ctx.setLineDash([]);
                                if ( ctx.mozDash !== undefined )       ctx.mozDash = [];
                            }
                            ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);
                            ctx.stroke();
                            above = -above;
                            if (above > 0) { //nth*2 iteration
                                above *= 2;
                            }
                        }

                    });

                particleSystem.eachNode(
                    function(node, pt){
                        var w = 20;
                        ctx.fillStyle = "red";
                        drawEllipseByCenter(ctx, pt.x, pt.y, w, w);
                        ctx.fillStyle = "black";
                        ctx.font = 'italic 13px sans-serif';
                        ctx.fillText (node.name, pt.x+8, pt.y+8);
                    });
            },

            initMouseHandling:function(){
                var dragged = null;
                var handler = {
                    clicked:function(e){
                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
                        dragged = particleSystem.nearest(_mouseP);
                        if (dragged && dragged.node !== null){
                            dragged.node.fixed = true;
                        }
                        $(canvas).bind('mousemove', handler.dragged);
                        $(window).bind('mouseup', handler.dropped);
                        return false;
                    },
                    dragged:function(e){
                        var pos = $(canvas).offset();
                        var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

                        if (dragged && dragged.node !== null){
                            var p = particleSystem.fromScreen(s);
                            dragged.node.p = p;
                        }

                        return false;
                    },
                    dropped:function(e){
                        if (dragged===null || dragged.node===undefined) return;
                        if (dragged.node !== null) dragged.node.fixed = false;
                        dragged = null;
                        $(canvas).unbind('mousemove', handler.dragged);
                        $(window).unbind('mouseup', handler.dropped);
                        _mouseP = null;
                        return false;
                    }
                }
                $(canvas).mousedown(handler.clicked);
            }

        }
        return that;
    }

    $(document).ready(function(){
        sys = arbor.ParticleSystem(1000);
        sys.parameters({gravity:true});
        sys.renderer = Renderer("#viewport");
        renderOptions.redraw = function() {
            sys.renderer.redraw();
        };
        var data = result;

        $.each(data.nodes, function(i,node){
            sys.addNode(node.name);
        });

        var coefficientValueability = 30;
        $.each(data.edges, function(i,edge){
            var coeffs = edge.average;
            var length = 50 + (coeffs * (-coefficientValueability));
            sys.addEdge(sys.getNode(edge["first_name"]),sys.getNode(edge["second_name"]), {length: length, coefficients: edge.coefficients, people: edge.people});
        });
    })

})(this.jQuery);

function getClone(template) {
    var $clone = template.clone();
    $clone.removeAttr("id");
    $clone.removeClass("template");
    return $clone;
}

$(function () {
    var nodes = result.nodes;
    var template = $("#node-template");
    var $nodesContainer = $("#nodes");


    var $clone = getClone(template);
    $clone.find(".node-name").text("Все-все-все");
    $clone.find(".toggle").click(function() {
        renderAll()
    });
    $nodesContainer.append($clone);

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        $clone = getClone(template);
        $clone.find(".toggle").click(function(node) {
            return function() {
                selectNode(node.name)
            };
        }(node));
        $clone.find(".node-name").text(node.name);
        $nodesContainer.append($clone);
    }
});

function selectNode(nodeName) {
    $(".node").each(function(i, el) {
        var $el = $(el);
        var name = $el.find(".node-name").text();
        if (name != nodeName) {
            $el.find(".toggle").removeClass("active");
        } else {
            $el.find(".toggle").addClass("active");
        }
    });
    renderOptions.renderNodes = nodeName;
    renderOptions.redraw();
}

function renderAll() {
    $(".node").each(function(i, el) {
        $(el).find(".toggle").addClass("active");
    });
    renderOptions.renderNodes = "all";
    renderOptions.redraw();
}

function drawEllipseByCenter(ctx, cx, cy, w, h) {
    drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa,
        oy = (h / 2) * kappa,
        xe = x + w,
        ye = y + h,
        xm = x + w / 2,
        ym = y + h / 2;

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.fill();
}

var width = 10;
var visibilityBorder = 0.5;
function drawLine(ctx, x1, y1, x2, y2, coeff) {
    var absolute = Math.abs(coeff);
    if (absolute > visibilityBorder) {
        ctx.lineWidth = absolute * width;
        ctx.beginPath();
        if (coeff > 0) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        } else {
            ctx.dashedLine(x1, y1, x2, y2, [20, 10]);
        }
        ctx.stroke();
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getColorForCoefficient(coeff) {
//    var color = "#";
//    var val = Math.abs(coeff) * 196 + 60;
//    val = Math.abs(Math.floor(val));
//    val = val.toString(16);
//    if (coeff < 0) {
//        color +=  val +  "0000";
//    } else {
//        color +=  "00" + val +  "00";
//    }
//    return color;
    return coeff < 0 ? "red" : "green";
}

var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP && CP.lineTo){
    CP.dashedLine = function(x,y,x2,y2,dashArray){
        if (!dashArray) dashArray=[10,5];
        if (dashLength==0) dashLength = 0.001; // Hack for Safari
        var dashCount = dashArray.length;
        this.moveTo(x, y);
        var dx = (x2-x), dy = (y2-y);
        var slope = dx ? dy/dx : 1e15;
        var distRemaining = Math.sqrt( dx*dx + dy*dy );
        var dashIndex=0, draw=true;
        while (distRemaining>=0.1){
            var dashLength = dashArray[dashIndex++%dashCount];
            if (dashLength > distRemaining) dashLength = distRemaining;
            var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
            if (dx<0) xStep = -xStep;
            x += xStep;
            y += slope*xStep;
            this[draw ? 'lineTo' : 'moveTo'](x,y);
            distRemaining -= dashLength;
            draw = !draw;
        }
    };
}

(function() {
    $(function() {
        var canvas = document.getElementById('viewport'),
            context = canvas.getContext('2d');

        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width = window.innerWidth - 50;
            canvas.height = window.innerHeight - 50;
        }
        resizeCanvas();
    });
})();
