var hourglass = (function () {
    var workTime = 6000;
    var breakTime = 4000;
    var timeMark = 0;
    var upside = true;

    var lhaut = $("svg").find("#liquideHaut");
    var lbas  = $("svg").find("#liquideBas");
    var lflux = $("svg").find("#liquideFlux");
    var lturn = $("svg").find("#glass").find("#liquidTurn");

    var rotateTime = 500;

    function setWorkTime(time) {
        workTime = time;
        testTime(workTime, breakTime);
    }
    function setBreakTime(time) {
        breakTime = time;
        testTime(workTime, breakTime);
    }
    
    function testTime(t1, t2) {
        console.log("temp1:" + t1 + ", temp2:" + t2);
    }

    function stop() {
        lhaut.find("rect").velocity("stop");
        lbas.find("rect").velocity("stop");
    }
    
    function rotateGlass() {
        // hourglass is upside (starting state)
        /*console.log("je vois workTime, ", workTime, ", et breakTime, ", breakTime);*/
        if (upside) {

            // during rotation, a dummy element (lturn)
            // is replacing the top, bottom and flux liquids.
            // Those are reset to their original values
            lturn.find("rect").attr("y", "325px");
            lturn.find("rect").attr("height", "140px");
            lturn.css("display", "inline");
            lhaut.css("display", "none");
            lhaut.find("rect").attr("y", "85px");
            lhaut.find("rect").attr("height", "180px");
            lbas.css("display","none");
            lbas.find("rect").attr("y", "465px");
            lbas.find("rect").attr("height", "0");
            
            // turning hourglass
            $("#glass").velocity({ rotateZ: "180deg" }, rotateTime);
            
            // liquid turns red while hourglass is turned upside
            lturn.find("rect").velocity({ fill: "#E40008" });
            
            // move the liquid down to the bottleneck
            lturn.find("rect").velocity({
                y: "265px",
                height: "180px",
            }, {
                delay: rotateTime / 2,
                complete: function () {
                    // the dummy rotation element is replaced
                    // by the true liquid elements, which
                    // are resetted to their proper color, ready
                    // for the flowing down process.
                    lturn.css("display", "none");
                    lhaut.css("display", "inline");
                    lbas.css("display", "inline");
                    lhaut.find("rect").css("fill", "#E40008");
                    lbas.find("rect").css("fill", "#E40008");
                    lflux.find("rect").css("fill", "#E40008");
                    
                    lbas.find("rect").attr("y", "465px");
                    lbas.find("rect").attr("height", "0px");
                    //console.log('avant lancement de runFluid(' + workTime + ')');
                    runFluid(workTime);
                }
            });
            upside = false;
        
        } else {
            // hourglass is turned upside-down.
            // Liquids elements being prepared for 
            // rotation, similarly to first-case above
            lbas.css("display", "none");
            lhaut.css("display", "none");
            lturn.find("rect").attr("y", "65px");
            lturn.find("rect").attr("height", "140px");
            lturn.css("display", "inline");
            
            // turning hourglass
            $("#glass").velocity({ rotateZ: "0deg" }, rotateTime);
            
            // liquid turns green while hourglass is turned upside-down
            lturn.find("rect").velocity({ fill: "#547E35" });
            
            // move the liquid down to the bottleneck
            lturn.find("rect").velocity({
                y: "85px",
                height: "180px"

            }, {
                delay: (rotateTime / 2),
                complete: function () {
                    // Replacing the dummy liquid rotation element 
                    // with liquids elements setted at their 
                    // proper values, similarly to case above
                    lturn.css("display", "none");
                    lhaut.css("display", "inline");
                    lbas.css("display", "inline");
                    lhaut.find("rect").attr("y", "85px");
                    lhaut.find("rect").attr("height", "180px");
                    lhaut.find("rect").css("fill", "#547E35");
                    lbas.find("rect").attr("y", "465px");
                    lbas.find("rect").attr("height", "0px");
                    lbas.find("rect").css("fill", "#547E35");
                    lflux.find("rect").css("fill", "#547E35");

                    runFluid(breakTime);
                }
            });
            upside = true;
        }
        console.log("upside was:", upside);
    }


    function runFluid (flowTime) {
        // Fluid in the upper part is flowing down, 
        // filling the lower part.
       
        if (flowTime > 60000) {
            // Run a less granular animation (without velocity)
            // if the flowtime is long enough
       
        } else {
            // Run a velocity animation for flowing liquid
            lhaut.find("rect").velocity({
                y: 265, // from ...
                height: 0 // from 180
            }, {
                duration: flowTime, 
                easing: [1, 0.79, 1, 0.79],
                begin: function () {
                    // show liquid rope
                    lflux.css("display", "inline");
                    // show time spent and time left
                    $('#remain').css("display", "inline");
                    $('#runned').css("display", "inline");
                },
                progress: function (elements, complete, remaining) {
                    // animate time spent and time left
                    if (Math.floor(remaining / 1000) !== timeMark) {
                        // only call function every second
                        $('#remain').html(formatTime(remaining));
                        $('#runned').html(formatTime(flowTime - remaining));
                        timeMark = Math.floor(remaining / 1000);
                    }
                },
                complete: function () {
                    // remove the liquid rope
                    lflux.css("display", "none");
                    // remove time display
                    $('#remain').css("display", "none");
                    $('#runned').css("display", "none");
                    rotateGlass();
                }
            });

            // fluid accumulates in glass' lower part
            lbas.find("rect").velocity({
                y: 325,      // from ...
                height: 140  // from 0
            }, {
                duration: flowTime,
                easing: [0.76, 0.54, 0.89, 0.69]
            });
           
        }
    }

    return {
        setWorkTime: setWorkTime,
        setBreakTime: setBreakTime,
        rotate: rotateGlass,
        stop: stop
    };

}) ();

function formatTime(milliseconds) {
    var min = Math.floor(milliseconds / 60000);
    var sec = (milliseconds - (min * 60000)) / 100000;
    var time = (min + sec).toFixed(2);
    return time.replace('.', ':');
}

$(function () {
    var running = false;
    var minute = 1; 

    $(".container").find("#start").click(function () {
        console.log('this.find("button").html()', $(this).find("button").html());
        if ($(this).find("button").html() === "Stop") {
            hourglass.stop();
            $(this).find("button").html("Restart");
        } else {
            hourglass.rotate();
            $(this).find("button").html("Stop");
        }
    });


    function iconTooltip (e) {
        var timeSet = e.value;
        return "<div><img src=\"img/work-64.gif\" /><br />" + 
            timeSet + " min.</div>";
    }
    
    function iconTooltip2 (e) {
        var timeSet = e.value;
        return "<div><img src=\"img/rest-64.gif\" /><br />" + 
            timeSet + " min.</div>";
    }

    $("#sessionset").find("div").roundSlider({
        radius: 70,
        width: 13,
        max: 60,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        tooltipFormat: iconTooltip,
        value: 20,
        editableTooltip: false,
        stop: function(e) {
            hourglass.setWorkTime(e.value * 1000 * minute);
            console.log(e.value);
        },
        startAngle: 315
    });
    
    $("#breakset").find("div").roundSlider({
        radius: 70,
        width: 13,
        max: 30,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        tooltipFormat: iconTooltip2,
        value: 10,
        editableTooltip: false,
        stop: function(e) {
            hourglass.setBreakTime(e.value * 1000 * minute);
            console.log(e.value);
        },
        startAngle: 315
    });
    
});
