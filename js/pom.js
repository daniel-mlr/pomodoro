var hourglass = (function () {
        var time = 70000;
}) ();

var timeDisplay = function () {
    
    var precedentTime = 0;
    var actualTime = 0;
    return {
        showTime: function (milliseconds) {
            var min = Math.floor(milliseconds / 60000);
            var sec = milliseconds - (min * 60000);
            actualTime = min + ":" + sec;
            if (actualTime != precedentTime) {
                return actualTime;
            } else {
                return precedentTime;
            }
        }
    };
};

function formatTime(milliseconds) {
    var min = Math.floor(milliseconds / 60000);
    var sec = (milliseconds - (min * 60000)) / 100000;
    var time = (min + sec).toFixed(2);
    return time.replace('.', ':');
}

$(function () {
    $("#start").click(function () {
        var time = 65000;
        var timeMark = 0;
        
        var lhaut = $("svg").find("#liquideHaut").find("rect");
        var lbas = $("svg").find("#liquideBas").find("rect");
        var lflux = $("svg").find("#liquideFlux");
 
        lflux.css("display", "initial");
        lhaut.velocity({
            //tween: [0, time / 1000],
            y: 200,
            height: 0
        }, {
            duration: time, 
            easing: [1, 0.79, 1, 0.79],
            begin: function () {
                $('#remain').css("display", "inline");
                $('#runned').css("display", "inline");
            },
            progress: function (elements, complete, remaining) {
                // only call function every second
                if (Math.floor(remaining / 1000) !== timeMark) {
                    $('#remain').html(formatTime(remaining));
                    $('#runned').html(formatTime(time - remaining));
                    timeMark = Math.floor(remaining / 1000);
                    //console.log('remaining',  remaining, 'timeMark', timeMark);
                    //console.log('complete',  complete, 'timeMark', timeMark);
                }
            },
            complete: function () {
                lflux.css("display", "none");
                $('#remain').css("display", "none");
                $('#runned').css("display", "none");
            }
        });

        lbas.velocity({
            y: 260,
            height: 185
        },
        {
            duration: time,
            //easing: "linear"
            easing: [0.76, 0.54, 0.89, 0.69]
        });
    });
    
    $("#sessionset").click(function () {
        alert("hello, en bas");
    });
});
