var urls = [];

testurl = 1000
end = 1200

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 250ms
};
var page = require('webpage').create()
function handle_page(url){

    page.open(url, function(){
        waitFor(function() {
           // something
           return  page.evaluate(function() {
                return document.title;
            });
        }, function() {
            var title = page.evaluate(function() {
                 return document.title;
            });
            console.log(title + '\n');
            if (title == "Steam Community :: Error"){
                console.log("EMPTY URL FOUND!");
                urls.push(url)
            }
            next_page();
        });
    });
}

function next_page(){
    var url = 'http://steamcommunity.com/id/' + (testurl+=1).toString()
    if(testurl > end){
        phantom.exit(0);
    }
    console.log(url)
    handle_page(url);
}

next_page();
console.log(urls);
