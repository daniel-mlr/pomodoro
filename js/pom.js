var hourglass = (function () {
    var time = 6500;
    var timeMark = 0;
    var upside = true;

    var ltemp;
    var lhaut = $("svg").find("#liquideHaut").find("rect");
    var lbas = $("svg").find("#liquideBas").find("rect");
    var lflux = $("svg").find("#liquideFlux");

    // lflux.css("display", "initial");
    var rotateTime = 5000;
    var changeColorPink = {backgroundColor: "#A21200"};
    var changeColorGreen = {backgroundColor: "#12FA00"};

    function rotateGlass() {
        if (upside) {

            $("#glass").velocity({ 
                rotateZ: "180deg" 
            }, rotateTime);

            $("svg").find("#liquideBas").find("rect").velocity({
                /*
                y: 0, height: 180
                */
                rotateZ: "180deg"
            }, rotateTime );
            upside = false;
        } else {
            $("#glass").velocity({ rotateZ: "0deg" }, rotateTime);
            /*
               ltemp = lhaut;
               lhaut = $("svg").find("#liquideBas").find("rect");
               lbas = ltemp;
               */
            upside = true;
        }
        console.log("upside:", upside);
    }


    function runFluid () {
        // fluid in upper part is flowing down
        lhaut.velocity({
            y: 200, // from 20
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
        lbas.velocity({
            y: 260,      // from 400
            height: 185  // from 0
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
