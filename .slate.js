// Configs
S.cfga({
  "defaultToCurrentScreen" : true,
  "secondsBetweenRepeat" : 0.1,
  "checkDefaultsOnLoad" : true,
  "focusCheckWidthMax" : 3000,
  "orderScreensLeftToRight" : true
});

// Monitors
var monTboltL = "0";
var monTboltR = "1";
var monLaptop = "1680x1050";

// Operations
var lapChat = S.op("corner", {
  "screen" : monLaptop,
  "direction" : "top-left",
  "width" : "screenSizeX/9",
  "height" : "screenSizeY"
});
var lapMain = lapChat.dup({ "direction" : "top-right", "width" : "8*screenSizeX/9" });
var tboltLFull = S.op("move", {
  "screen" : monTboltL,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});
var tboltLLeft = tboltLFull.dup({ "width" : "screenSizeX/3" });
var tboltLMid = tboltLLeft.dup({ "x" : "screenOriginX+screenSizeX/3" });
var tboltLRight = tboltLLeft.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var tboltLLeftTop = tboltLLeft.dup({ "height" : "screenSizeY/2" });
var tboltLLeftBot = tboltLLeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltLMidTop = tboltLMid.dup({ "height" : "screenSizeY/2" });
var tboltLMidBot = tboltLMidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltLRightTop = tboltLRight.dup({ "height" : "screenSizeY/2" });
var tboltLRightBot = tboltLRightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRFull = S.op("move", {
  "screen" : monTboltR,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var tboltRLeft = tboltRFull.dup({ "width" : "screenSizeX/3" });
var tboltRMid = tboltRLeft.dup({ "x" : "screenOriginX+screenSizeX/3" });
var tboltRRight = tboltRLeft.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var tboltRLeftTop = tboltRLeft.dup({ "height" : "screenSizeY/2" });
var tboltRLeftBot = tboltRLeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRMidTop = tboltRMid.dup({ "height" : "screenSizeY/2" });
var tboltRMidBot = tboltRMidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRRightTop = tboltRRight.dup({ "height" : "screenSizeY/2" });
var tboltRRightBot = tboltRRightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

var tboltRiTerm =  S.op("move", {
  "screen" : monTboltR,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "566",
  "height" : "1413"
});
var tboltRChrome =  S.op("move", {
  "screen" : monTboltR,
  "x" : "screenOriginX+569",
  "y" : "screenOriginY",
  "width" : "1138",
  "height" : "1418"
});
var tboltRMail =  S.op("move", {
  "screen" : monTboltR,
  "x" : "screenOriginX+1706",
  "y" : "screenOriginY",
  "width" : "853",
  "height" : "1418"
});
var tboltLMailActivity =  S.op("move", {
  "screen" : monTboltL,
  "x" : "screenOriginX",
  "y" : "screenOriginY+1084",
  "width" : "419",
  "height" : "337"
});

var lapMiniPlayer =  S.op("move", {
  "screen" : monLaptop,
  "x" : "screenOriginX+1279",
  "y" : "screenOriginY",
  "width" : "400",
  "height" : "48"
});


// layout hash generators

var geniTunesHash = function() {
  return {
    "operations" : [function(windowObject) {
      var title = windowObject.title();
      if (title !== undefined && title === "MiniPlayer") {
        windowObject.doOperation(lapMiniPlayer);
      } else {
        windowObject.doOperation(tboltLMidTop);
      }
    }],
    "ignore-fail" : true,
    "repeat" : true
  };
}

var genMailHash = function() {
  return {
    "operations" : [function(windowObject) {
      var title = windowObject.title();
      if (title !== undefined && title === "Activity") {
        windowObject.doOperation(tboltLMailActivity);
      } else {
        windowObject.doOperation(tboltRMail);
      }
    }],
    "ignore-fail" : true,
    "repeat" : true
  };
}

// 3 monitor layout
var threeMonitorLayout = S.lay("threeMonitor", {
  "iTunes": geniTunesHash(),
  "Mail" : genMailHash(),
  "Google Chrome" : { "operations" : [tboltRChrome] },
  "iTerm" : {
      "operations" : [tboltRiTerm, tboltLMidBot, tboltRMidTop, tboltRMidBot, tboltRRightBot],
      "sort-title" : true,
      "repeat" : true
  }
});

// 1 monitor layout
var oneMonitorLayout = S.lay("oneMonitor", {

});

var twoMonitorLayout = oneMonitorLayout;

// Defaults
S.def(3, threeMonitorLayout);
S.def(2, twoMonitorLayout);
S.def(1, oneMonitorLayout);

// Layout Operations
var threeMonitor = S.op("layout", { "name" : threeMonitorLayout });
var twoMonitor = S.op("layout", { "name" : twoMonitorLayout });
var oneMonitor = S.op("layout", { "name" : oneMonitorLayout });
var universalLayout = function() {
  // Should probably make sure the resolutions match but w/e
  S.log("SCREEN COUNT: "+S.screenCount());
  if (S.screenCount() === 3) {
    threeMonitor.run();
  } else if (S.screenCount() === 2) {
    twoMonitor.run();
  } else if (S.screenCount() === 1) {
    oneMonitor.run();
  }
};

var centerOnScreen = function(targetScreen) {
  return S.op("throw", {
    "x": "screenOriginX+(screenSizeX-windowSizeX)/2",
    "y": "screenOriginY+(screenSizeY-windowSizeY)/2",
    "screen": targetScreen
  });
}

var maximizeYo = S.op("move", {
      "x" : "screenOriginX",
      "y" : "screenOriginY",
      "width" : "screenSizeX",
      "height" : "screenSizeY"
});

var grid =  S.op("grid", {
  "grids": {
    "0": { "width": 9, "height": 6 },
    "1": { "width": 9, "height": 6 },
    "2": { "width": 9, "height": 6 }
  }
});

S.bnda({
  "pad1:ctrl;alt" : centerOnScreen("0"),
  "pad2:ctrl;alt" : centerOnScreen("1"),
  "pad3:ctrl;alt" : centerOnScreen("2"),
  "pad.:ctrl"     : universalLayout,
  "pad5:ctrl"     : maximizeYo,
  "padEnter:ctrl" : grid,
  "esc:cmd"       : S.op("hint")
});


// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
