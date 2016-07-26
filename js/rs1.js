$(function () {
    $("#handle1").roundSlider({
        sliderType: "min-range",
        editableTooltip: false,
        radius: 100,
        width: 16,
        value: 75,
        handleSize: 0,
        handleShape: "square",
        circleShape: "pie",
        startAngle: 315,
        tooltipFormat: changeTooltip
    });

    function changeTooltip(e) {
        console.log("tooltip");
        var val = e.value, speed;
        if (val < 20) speed = "Slow";
        else if (val < 40) speed = "Normal";
        else if (val < 70) speed = "Speed";
        else speed = "Very High<br />Speed";
        //content: url("../img/work-64.gif");
        return val + " km/h" + "<div><img src=\"img/work-64.gif\"/><br />" + speed + "</div>";
    }

    
    $("#svgcont").append("<svg>");
    $("svg").append("<g id=\"gplus\"><rect x=\"10\" y=\"10\" width=\"100\" height=\"200\" fill=\"purple\" /></g>");
    //$("#gplus").append("<rect x=\"10\" y=\"10\" width=\"100\" height=\"200\" fill=\"purple\">");


});
