/**
 * Created by Semyon on 06.04.2015.
 */

$(function() {

    var $genContainer = $("#generated");

//    var appointment = "div > span a.qwerty";
    var appointment = "div span a.qwerty";
    var items = ["span", "div", "br", "script"];
    var classes = ["selectable", "scalable", "conflictable"];
    var array = appointment.split(" ");

    function generateNasty(container, i) {
        if (i <= 0) {
            return;
        }
        container.append("<br/>");
        var item = items[Math.floor(Math.random()*items.length)];
        while (true) {
            var rand = Math.random();
            if (rand > 0.5) {
                var className = classes[Math.floor(Math.random()*classes.length)];
                if (item.indexOf(className) != -1) {
                    continue
                }
                item += "." + className;
            } else {
                break;
            }
        }

        var itemArray = item.split(".");
        var itemStart = item;
        var itemEnd = item;
        if (itemArray.length > 1) {
            itemStart = itemArray[0];
            itemEnd = itemStart;
            itemStart += " class='";
            for (var j = 1; j < itemArray.length; j++) {
                itemStart += itemArray[j];
                if (j < itemArray.length - 1) {
                    itemStart += " ";
                }
            }
            itemStart += "'";
        }

        var wrapper = $("<div class='selectable offset-" + i + "'></div>");
        var xmpStartItem = $("<xmp><" + itemStart + "></xmp>");
        wrapper.append(xmpStartItem);
        i--;
        generateNasty(wrapper, i);

        var b = 0;
        while (b < 2) {
            if (Math.random() > 0.2) {
                generateNasty(wrapper, i);
            } else {
                break;
            }
            b++;
        }

        var xmpEndItem = $("<xmp></" + itemEnd + "></xmp>");
        wrapper.append(xmpEndItem);
        container.append(wrapper);
        container.append("<br/>");
    }

    function generateCurrent(container, itemName, i, lastI) {
        if (i > lastI) {
            return;
        }
        var item = array[i];

        var itemArray = item.split(".");
        var itemStart = item;
        var itemEnd = item;
        if (itemArray.length > 1) {
            itemStart = itemArray[0];
            itemEnd = itemStart;
            itemStart += " class='";
            for (var j = 1; j < itemArray.length; j++) {
                itemStart += itemArray[j];
                if (j < itemArray.length - 1) {
                    itemStart += " ";
                }
            }
            itemStart += "'";
        }

        var wrapper = $("<div class='selectable offset-" + i + "'></div>");
        var xmpStartItem = $("<xmp><" + itemStart + "></xmp><br/>");
        wrapper.append(xmpStartItem);
            i++;
            generateCurrent(wrapper, array[i], i, array.length - 1);
            generateNasty(wrapper, 2);
        var xmpEndItem = $("<br/><xmp></" + itemEnd + "></xmp>");
        wrapper.append(xmpEndItem);
        container.append(wrapper);
    }

    generateCurrent($genContainer, array[0], 0, array.length - 1);

    $('.selectable').on('mouseover', function(e){
        $(this).addClass('hover');
        e.stopPropagation();
        $(this).parent().removeClass('hover');
    }).on('mouseout', function(e){
        $(this).removeClass('hover');
    });
});