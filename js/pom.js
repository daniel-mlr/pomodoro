var hourglass = (function () {
    var time = 6000;
    var timeMark = 0;
    var upside = true;

    var lhaut = $("svg").find("#liquideHaut");
    var lbas = $("svg").find("#liquideBas");
    var lflux = $("svg").find("#liquideFlux");
    var lturn = $("svg").find("#glass").find("#liquidTurn");

    var rotateTime = 1000;
    var changeColorPink = {backgroundColor: "#A21200"};
    var changeColorGreen = {backgroundColor: "#12FA00"};

    function rotateGlass() {
        // upside 
        if (upside) {

            lturn.find("rect").attr("y", "325px");
            lturn.find("rect").attr("height", "140px");
            lturn.css("display", "inline");
            lhaut.css("display", "none");
            lhaut.find("rect").attr("y", "85px");
            lhaut.find("rect").attr("height", "180px");
            lbas.css("display","none");
            lbas.find("rect").attr("y", "465px");
            lbas.find("rect").attr("height", "0");
            
            $("#glass").velocity({ 
                rotateZ: "180deg" 
            }, rotateTime);
            
            lturn.find("rect").velocity({
                y: "265px",
                height: "180px"

            }, {
                delay: rotateTime,
                complete: function () {
                   // lflux.css("display", "inline");
                    lturn.css("display", "none");
                    lhaut.css("display", "inline");
                    lbas.css("display", "inline");
                    runFluid();
                }
            });
            upside = false;
        
        } else {
            // reversed
            lbas.css("display", "none");
            lhaut.css("display", "none");
            lturn.find("rect").attr("y", "65px");
            lturn.find("rect").attr("height", "140px");
            lturn.css("display", "inline");
            $("#glass").velocity({ rotateZ: "0deg" }, rotateTime);
            
            lturn.find("rect").velocity({
                y: "85px",
                height: "180px"

            }, {
                delay: rotateTime,
                complete: function () {
                   // lflux.css("display", "inline");
                    lturn.css("display", "none");
                    lhaut.find("rect").attr("y", "85px");
                    lhaut.find("rect").attr("height", "180px");
                    lhaut.css("display", "inline");
                    lbas.find("rect").attr("y", "465px");
                    lbas.find("rect").attr("height", "0px");
                    lbas.css("display", "inline");

                    runFluid();
                }
            });
           
            upside = true;
        }
        console.log("upside:", upside);
    }


    function runFluid () {
        // fluid in upper part is flowing down
        lhaut.find("rect").velocity({
            y: 265, // from ...
            height: 0 // from 180
        }, {
            duration: time, 
            easing: [1, 0.79, 1, 0.79],
            begin: function () {
                // show time spent and time left
                lflux.css("display", "inline");
                $('#remain').css("display", "inline");
                $('#runned').css("display", "inline");
            },
            progress: function (elements, complete, remaining) {
                // animate time spent and time left
                if (Math.floor(remaining / 1000) !== timeMark) {
                    // only call function every second
                    $('#remain').html(formatTime(remaining));
                    $('#runned').html(formatTime(time - remaining));
                    timeMark = Math.floor(remaining / 1000);
                }
            },
            complete: function () {
                // remove the liquid rope
                lflux.css("display", "none");
                // remove time display
                $('#remain').css("display", "none");
                $('#runned').css("display", "none");
            }
        });

        // fluid accumulates in glass' lower part
        lbas.find("rect").velocity({
            y: 325,      // from ...
            height: 140  // from 0
        },
        {
            duration: time,
            easing: [0.76, 0.54, 0.89, 0.69]
        });
    }

    return {
        rotate: rotateGlass
    };


}) ();

function formatTime(milliseconds) {
    var min = Math.floor(milliseconds / 60000);
    var sec = (milliseconds - (min * 60000)) / 100000;
    var time = (min + sec).toFixed(2);
    return time.replace('.', ':');
}

$(function () {
    $(".container").find("#start").click(function () {
        // alert('clicked (de container)');
        hourglass.rotate();
    });
    
    $("#sessionset").click(function () {
        alert("hello, en bas");
    });
});
