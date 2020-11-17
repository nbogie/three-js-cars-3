let socket;
let remoteData;
let initialised = false;
let updateCount = 0;

function handleRemoteData(data) {
  console.log("i got remote data: ...")
  //console.log(JSON.stringify(data, null, 2));
  remoteData = data;
}

export function setupConnection(myData) {
  console.log("connecting to socket");
  socket = io.connect("https://gameserver.neillbogie.repl.co/");
  socket.on('connect', () => {
    initialiseMe(myData);
  });

  socket.on('setId', function (data) {
    console.log("got: setId")
    myData.id = data.id;
  });

  socket.on('remoteData', handleRemoteData);

  socket.on("deletePlayer", (data) => { console.log("got deletePlayer: ", data) });
}

function initialiseMe(data) {
  console.log("sending init")
  socket.emit("init", data);
  initialised = true;
}

function draw() {
  text("myData.myId: " + myData.id, 100, 50)
  text("remoteData: " + JSON.stringify(remoteData, null, 2), 100, 100)

  if (remoteData) {
    for (let remote of remoteData) {
      drawRemotePlayer(remote);
    }
  }
  if (frameCount % 20 === 0) {
    sendUpdate();
  }
}

function drawRemotePlayer(rp) {
  fill(rp.colour);
  circle(rp.x, rp.y, 30);
  text(rp.model, rp.x + 20, rp.y + 20);
}

function sendUpdate() {
  if (!socket) {
    return;
  }
  updateCount++;
  socket.emit("update", myData);
}
