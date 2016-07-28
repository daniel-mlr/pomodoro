var hourglass = (function () {
    // 
    var workTime = 7000; // default work time
    var breakTime = 6000; //default break time
    var timeMark = 0;
    var upside = true;

    var lhaut = $("svg").find("#liquideHaut");
    var lbas  = $("svg").find("#liquideBas");
    var lflux = $("svg").find("#liquideFlux");
    var lturn = $("svg").find("#glass").find("#liquidTurn");

    // liquid colors
    var tomatoRed = "#E40008";
    var tomatoGreen = "#547E35";

    // glass/liquid geometry
    var turnStartLine, turnEndLine, rotateAngle, liquidColor, runTime;
    var glassTop = 65;
    var glassBottom = 465;
    var airGapFromTop = 20;    // should be computed from 
    var airGapFromNeck = 60;   // glass size and liquid volume
    var glassHeight = glassBottom - glassTop; // 200;
    var glassNeck = (glassHeight / 2) + glassTop; // 265;
    var liqHeightFromEdge = glassHeight / 2 - airGapFromNeck; // 140;
    var liqHeightFromCentre = glassHeight / 2 - airGapFromTop; // 180;
    
    var running = false; // hourglass animation running state  

    var rotateTime = 1000;
    
    function setWorkTime(time) {
        workTime = time;
    }
    function setBreakTime(time) {
        breakTime = time;
    }
    
    
    function stop() {
        // a completer
        lhaut.find("rect").velocity("stop", true);
        lbas.find("rect").velocity("stop", true);
    }

    /* à compléter */
    function reset() {
        setWorkTime();
    }
    
    function rotateGlass() {
        // hourglass is upside (starting state)
        if (upside) {
            // during rotation, a dummy element (lturn) is replacing the top,
            // bottom and flux liquids.  This dummy element start and end need
            // to be referred from bottom to top
            turnStartLine = glassBottom - liqHeightFromEdge; // 325
            turnEndLine = turnStartLine - airGapFromNeck; // 265
            
            rotateAngle = "180deg";
            liquidColor = tomatoRed;
            runFluidTime = workTime;
           
            upside = false;
            
        } else {
            // hourglass is turned from upside-down to upright direction
            // References for the dummy element change accordingly
            turnStartLine = glassTop; // 65
            turnEndLine = glassTop + airGapFromTop; // 85
            
            rotateAngle = "0deg";
            liquidColor = tomatoGreen;
            runFluidTime = breakTime;
            
            upside = true;
            
        }

        // rotate 
        // ======    
        // setting the dummy rectangle instead of the bottom and top one
        lturn.find("rect").attr("y", turnStartLine);
        lturn.find("rect").attr("height", liqHeightFromEdge);
        lturn.css("display", "inline");
        lhaut.css("display", "none");
        lbas.css("display", "none");

        // rotate the whole hourglass
        $("#glass").velocity({ rotateZ: rotateAngle }, rotateTime);

        lturn.find("rect")
        // liquid change color while hourglass is turned upside-down
        .velocity({ fill: liquidColor }, rotateTime)
        // move the liquid down to the bottleneck
        .velocity({
            y: [turnEndLine, turnStartLine],
            height: [liqHeightFromCentre, liqHeightFromEdge]
        }, {
            delay: rotateTime - 250,
            queue: false, 
            complete: function () {
                // Replacing the dummy liquid rotation element with liquids
                // elements setted at their proper values, similarly to case
                // above
                lturn.css("display", "none");
                lhaut.css("display", "inline");
                lbas.css("display", "inline");
                lhaut.find("rect").css("fill", liquidColor);
                lbas.find("rect").css("fill", liquidColor);
                lflux.find("rect").css("fill", liquidColor);

                runFluid(runFluidTime);
            }
        });
    }

    function runFluid (flowTime) {
        // Fluid in the upper part is flowing down, filling the lower part.
        
        if (flowTime > 60000) {
            // Run a less cpu-intensive animation (i.e.: without velocity) if
            // the flowtime is long enough
            var compteur = flowTime;
            var pct = 1;
            lflux.css("display", "inline");
            lhaut.find("rect").attr( "y", glassNeck - liqHeightFromCentre );
            lhaut.find("rect").attr("height", liqHeightFromCentre );
            lbas.find("rect").attr("y", glassBottom);
            lbas.find("rect").attr("height", 0);

            // show time spent and time left
            $('#remain').css("display", "inline");
            $('#runned').css("display", "inline");
            $('#remain').html(formatTime(flowTime));
            $('#runned').html(formatTime(0));
            
            var moveRect = function() {
                compteur -= 1000;
                pct = compteur / flowTime;

                lhaut.find("rect").attr( "y", 
                        glassNeck - pct * liqHeightFromCentre );
                lhaut.find("rect").attr("height", pct * liqHeightFromCentre );
                lbas.find("rect").attr("y", 
                        glassBottom - liqHeightFromEdge * (1 - pct));
                lbas.find("rect").attr("height", liqHeightFromEdge * (1 - pct));
               
                // update time spent and time left
                $('#remain').html(formatTime(compteur));
                $('#runned').html(formatTime(flowTime - compteur));
                
                if (compteur <= 0) {
                    clearInterval(anim);
                    // remove time display
                    $('#remain').css("display", "none");
                    $('#runned').css("display", "none");
                    setTimeout(rotateGlass(), 1000);
                } else if (compteur <= 1000) {
                    lflux.css("display", "none");
                    lhaut.css("display", "none");
                }
            };
            var anim = setInterval(moveRect, 1000);
       
        } else {
            // Run a velocity animation for flowing liquid
            lhaut.find("rect").velocity({
                y: [glassNeck, glassTop + airGapFromTop], // from 85 to 265
                height: [0, liqHeightFromCentre]  // from 180 to 0
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
                    // update time spent and time left
                    if (Math.floor(remaining / 1000) !== timeMark) {
                        // only call function once every second
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
                y: [glassNeck + airGapFromNeck, glassBottom], // from 465 to 325
                height: [liqHeightFromEdge, 0]  // from 0 to 140
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
        stop: stop,
        running: running
    };

}) ();

/* functions for formatting time display */
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function formatTime(milliseconds) {
    var min = Math.floor(milliseconds / 60000);
    var sec = (milliseconds - (min * 60000)) / 100000;
    var time = (min + sec).toFixed(2);
    time = pad(time, 5);
    return time.replace('.', ':');
}

$(function () {
    /* page loaded */
    
    hourglass.running = false;
    
    /* starting and stopping the pomodoro cycles */
    $("svg").click(function() {
        if (hourglass.running) {
            hourglass.running = false;
            hourglass.stop();
            // console.log('je devrais être faux: ', hourglass.running);
        } else {
            hourglass.running = true;
            hourglass.rotate();
            // console.log('je devrais être vrai: ', hourglass.running);
        }
    });
    
    /* function factories for sliders settings */
    function makeIconToolTip(id, unitLabel) {
        return function(e) {
            return "<div><img src=\"img/" + id + "-64.gif\" /><br />" + 
                e.value + " " + unitLabel + "</div>";
        };
    }
    
    function setTime(id, timeUnit) {
        if (id === "work") {
            return function(e) {
                console.log('dans setTime, e=', e.value);
                console.log('dans setTime, timeUnit= :', timeUnit);
                return hourglass.setWorkTime(e.value * 1000 * timeUnit);
            };
        } else if (id === "rest") {
            return function(e) {
                return hourglass.setBreakTime(e.value * 1000 * timeUnit);
            };
        }
    }

    // sliders common settings
    var sliderSettings = {
        radius: 70,
        width: 13,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        editableTooltip: false,
        startAngle: 315
    };
  
    // should be "const", but only available in new js version
    var T_SCALE = [
        {multiplier: 1, label: "sec."},
        {multiplier: 60, label: "min."}
    ]; 
    
    function setSliders(unit) {
        
        // set work time selector slider
        sliderSettings.max = 60;
        sliderSettings.tooltipFormat = makeIconToolTip("work", T_SCALE[unit].label);
        sliderSettings.value = 20;
        sliderSettings.stop = setTime("work", T_SCALE[unit].multiplier);
        console.log("sliderSettings:", sliderSettings);
        $("#sessionset").find("div").roundSlider(sliderSettings);
        
        // set break time selector slider
        sliderSettings.max = 30;
        sliderSettings.tooltipFormat = makeIconToolTip("rest", T_SCALE[unit].label);
        sliderSettings.value = 5;
        sliderSettings.stop = setTime("rest", T_SCALE[unit].multiplier);
        $("#breakset").find("div").roundSlider(sliderSettings);
    }

    function deleteSliders() {
        $("#sessionset").find("div").roundSlider("destroy");
        $("#breakset").find("div").roundSlider("destroy");
    }
   
    setSliders(0);


    // refactor?
    $("#checkTimeScale input:checkbox").change(function() {
        var unit = this.checked ? 0 : 1;
        console.log('unit:', unit);
        deleteSliders();
        setSliders(unit);
        console.log('work time:', 20 * T_SCALE[unit].multiplier * 1000);
        // hourglass.setWorkTime(20 * T_SCALE[unit].multiplier * 1000);
        // hourglass.setBreakTime(5 * T_SCALE[unit].multiplier * 1000);
        console.log('valeur:', $("#sessionset").find("div").roundSlider("option", "value"));
    });
    




    /*
    scale = 0;
    $("#sessionset").find("div").roundSlider("option", { 
        "value": 5,
        "tooltipFormat": makeIconToolTip("work", timeScale[scale].abbrev)
    });
    */
    
    /*
    var sessionSettings = {
        radius: 70,
        width: 13,
        max: 60,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        tooltipFormat: makeIconToolTip("work", timeScale[scale].abbrev),
        value: 20,
        editableTooltip: false,
        // stop: function(e) {
        //     hourglass.setWorkTime(e.value * 1000 * timeScale[scale].multiplier);
        // },
     *  stop: updateSessionTime,
        startAngle: 315
    };

    var breakSettings = {
        radius: 70,
        width: 13,
     *  max: 30,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
     *  tooltipFormat: makeIconToolTip("rest", timeScale[scale].abbrev),
     *  value: 10,
        editableTooltip: false,
        stop: function(e) {
            hourglass.setBreakTime(e.value * 1000 * timeScale[scale].multiplier);
        },
        startAngle: 315
    };
    */
    
    /*
    $("#sessionset").find("div").roundSlider(sessionSettings);
    $("#breakset").find("div").roundSlider(breakSettings);
    */
    
    // example:
    // $("#sessionset").find("div").roundSlider("option", { "value": 5 });
    

});
