"use strict";
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const {
  init,
  render
} = require("@nexrender/core");

/* Variables */

let aepxfile = "Nexrender-project.aep";
let audiofile = "Doja-CentralCee.mp3";
let profileImage = "2016-aug-deep.jpg";
let songName = "Dojaaaa";
let songFont = "text.sourceText.style.setFont('Avenir-Black');"
let songColor = "text.sourceText.style.setFillColor(hexToRgb('F4EA9C'));"
let artistName = "Central cee";
let artistFont = "text.sourceText.style.setFont('Avenir-Light');"
let artistColor = "text.sourceText.style.setFillColor(hexToRgb('F4EA9C'));"
let datascript = "";
let duration = 25 * 5; // 25 fps * 5 = 5 seconden 



const aebinary = "/Applications/Adobe After Effects 2022/aerender";
const port = 23234;

/* Server */

let server = http.createServer((req, res) => {
  let uri = url.parse(req.url).pathname;
  let filename = path.join(process.cwd(), uri);

  fs.exists(filename, exists => {
    if (!exists) {
      res.writeHead(404, {
        "Content-Type": "text/plain"
      });
      res.write("404 Not Found\n");
      return res.end();
    }

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain"
        });
        res.write(err + "\n");
        return res.end();
      }

      // send 200
      res.writeHead(200);
      res.write(file, "binary");
      return res.end();
    });
  });
});

/* Render */

server.listen(port, () => {
  console.log("Started local static server at port:", port);

  let project = {
    template: {
      src: `http://localhost:${port}/assets/${aepxfile}`,
      composition: "Main",
      frameStart: 0,
      frameEnd: duration,
    },
    "assets": [{
        type: "data",
        layerName: "Songname",
        property: "Source Text",
        value: `${songName}`
      },

      {
        type: "data",
        layerName: "Songname",
        property: "Source Text",
        expression: `${songFont}`
      },

      {
        type: "data",
        layerName: "Songname",
        property: "Source Text",
        expression: `${songColor}`
      },

      {
        type: "data",
        layerName: "Artist",
        property: "Source Text",
        value: `${artistName}`
      },

      {
        type: "data",
        layerName: "Artist",
        property: "Source Text",
        expression: `${artistFont}`
      },

      {
        type: "data",
        layerName: "Artist",
        property: "Source Text",
        expression: `${artistColor}`
      },


      {
        type: "audio",
        layerName: "Audio",
        src: `http://localhost:${port}/assets/${audiofile}`,
      },
      {
        src: `http://localhost:${port}/assets/${profileImage}`,
        type: "image",
        layerName: "ArtistImage",
        extension: "jpg",
      }
    ],
    actions: {
      postrender: [{
          module: "@nexrender/action-encode",
          output: "output.mp4",
          preset: "mp4",
        },
        {
          module: "@nexrender/action-copy",
          input: "output.mp4",
          output: process.cwd() + "/results/output.mp4",
        },
      ],
    },
    onChange: (job, state) => console.log("testing onChange:", state),
    onRenderProgress: (job, value) =>
      console.log("testing onRenderProgress:", value),
  };

  const settings = {
    logger: console,
    workpath: process.cwd() + "/temp",
    binary: aebinary,
    debug: true,
    skipCleanup: false,
  };

  // start rendering
  render(project, init(settings))
    .then(() => {
      // success
      server.close();
      console.log("rendering finished @/results");
    })
    .catch(err => {
      // error
      console.error(err);
      server.close();
    });
});