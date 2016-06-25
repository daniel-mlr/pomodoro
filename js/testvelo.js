function premier_mouvement() {
    // Unlike HTML, SVG positioning is NOT defined with top/right/bottom/left,
    // float, or margin properties
    // Rectangles have their x (left) and y (top) values defined relative to their
    // top-left corner
    $("rect").delay(1000).velocity(
            { x: 100, y: 40}, 
            {loop: 3, easing: "easeInOutSine"});
    
    // In contrast, circles have their x and y values defined relative to their
    // center (hence, cx and cy properties)
    $("circle").velocity({ cx: 100, cy: 20 }, {loop: 2});
    //deuxieme_mouvement();
}

function deuxieme_mouvement() {
    //$("rect").velocity("reverse", 3000);
    $("circle").velocity("reverse");
    premier_mouvement();
}

premier_mouvement();
