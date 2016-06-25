$(function() {
    $("#breakset").click(function() {
        var lhaut = $("svg").find("#g1").find("rect");
        var lbas  = $("svg").find("#g2").find("rect");
        var attHaut = lhaut.attr("y");
        var attBas = lbas.attr("y");
        console.log(lhaut);
        console.log(lbas);
        lhaut.velocity({
            y: 165,
            height: 35
        }, 22000, "linear")
        .velocity({
            y: 200,
            height: 0
        }, 3000, "easeInCirc");

        lbas.velocity({
            y: 220,
            height: 180
        },
        {
            duration: 25000,
            easing: "linear"
        });
        //22000, "linear");


        /*
        lhaut.attr("y", "40");
        lhaut.attr("height", "160");
        lbas.attr("y", "360");
        lbas.attr("height", "40");
        */
    });
});
