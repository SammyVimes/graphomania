/**
 * Created by Семён on 02.04.2015.
 */
(function($){
    var Renderer = function(canvas)
    {
        var canvas = $(canvas).get(0);
        var ctx = canvas.getContext("2d");
        var particleSystem;

        var colorSet = [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()];

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

                        var edgeCoeffs = edge.data.coefficients;
                        var i = 0;
                        var width = 10;

                        var start = [pt1.x, pt1.y];
                        var end = [pt2.x, pt2.y];
                        var above = 60;
                        var coeff = 0;
                        if ((edgeCoeffs.length % 2) != 0) {
                            ctx.strokeStyle = colorSet[i];
                            coeff = edgeCoeffs[i];
                            ctx.lineWidth = coeff * width;
                            ctx.beginPath();
                            ctx.moveTo(start[0], start[1]);
                            ctx.lineTo(end[0], end[1]);
                            ctx.stroke();
                            i++;
                        }
                        for (; i < edgeCoeffs.length; i++) {
                            ctx.strokeStyle = colorSet[i];
                            coeff = edgeCoeffs[i];
                            ctx.lineWidth = coeff * width;
                            ctx.beginPath();
                            var control = [0.5*(start[0]+end[0]), 0.5*(start[1]+end[1])-above];
                            ctx.moveTo(start[0], start[1]);
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


        $.each(data.nodes, function(i,node){
            sys.addNode(node.name);
        });

        $.each(data.edges, function(i,edge){
            sys.addEdge(sys.getNode(edge.src),sys.getNode(edge.dest), edge.data);
        });
    })

})(this.jQuery);

var data = {
    "nodes": [
        {"name": "node_1"},
        {"name": "node_2"},
        {"name": "node_3"},
        {"name": "node_4"},
        {"name": "node_5"},
        {"name": "node_6"},
        {"name": "node_7"},
        {"name": "node_8"},
        {"name": "node_9"},
        {"name": "node_10"}
    ],
    "edges": [
        {"src": "node_3", "dest": "node_2", "data": {"coefficients": [0.6, 0.5, 0.9]}},
        {"src": "node_5", "dest": "node_3", "data": {"coefficients": [0.5, 0.8, 0.3]}},
        {"src": "node_8", "dest": "node_7", "data": {"coefficients": [0.8, 0.7, 0.5]}},
        {"src": "node_1", "dest": "node_4", "data": {"coefficients": [0.2, 0.3, 0.1]}},
        {"src": "node_7", "dest": "node_5", "data": {"coefficients": [0.9, 0.2, 0.5]}},
        {"src": "node_3", "dest": "node_9", "data": {"coefficients": [0.3, 0.6, 0.7]}},
        {"src": "node_2", "dest": "node_4", "data": {"coefficients": [0.5, 0.4, 0.2]}},
        {"src": "node_6", "dest": "node_5", "data": {"coefficients": [0.7, 0.3, 0.3]}},
        {"src": "node_9", "dest": "node_1", "data": {"coefficients": [0.5, 0.8, 0.7]}},
        {"src": "node_10", "dest": "node_2", "data": {"coefficients": [0.2, 0.5, 0.6]}},
        {"src": "node_1", "dest": "node_10", "data": {"coefficients": [0.3, 0.5, 0.5]}}
    ]
};

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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}