// import {DateTime} from "luxon";


self.addEventListener("message", function(e) {
  let data = e.data;
  let [command, interval] = data;
  // console.log("received", command, interval);
  
  switch (command) {
    case "start":
      start(interval);
        break;
    case "stop":
      stop();
        break;
      default: break;
  }
});

function start(data) {
  // let start = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  // console.log(`Starting with ${data} min interval at ${start}`);
  
  let interval = 1;
  setInterval(function() {
    interval++;
    if (interval <= data ) {
      // console.log(`interval: ${interval} at ${DateTime.local().toLocaleString(DateTime.TIME_SIMPLE)}`);
    } else{
      // console.log(`stoping timer on ${interval} at ${DateTime.local().toLocaleString(DateTime.TIME_SIMPLE)}`);
      postMessage(interval);
      interval = 0;
    }
  }, 1000 * 60);

}

function stop() {
  // console.log("stopping");
  return "STOPPING!";
}