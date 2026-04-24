// 플레이 버튼
AFRAME.registerComponent('play', {
  init: function () {
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var visible = true

    playbtn.addEventListener("click", (e) => {

      if(visible) {
        visible = false;
        if (taskScheduler.isPlaying()) {
          taskScheduler.pause();
          playbtn.setAttribute('visible', "false");
          pausebtn.setAttribute('visible', "true");
        }
      }
      else {
        visible = true;
        if (!taskScheduler.isPlaying()){
          taskScheduler.resume();
          pausebtn.setAttribute('visible', "false");
          playbtn.setAttribute('visible', "true")
        };
      }
    });  
  }
});

// 되감기 버튼
AFRAME.registerComponent('rewind', {
  init: function () {
    var btn = document.querySelector("#rewindbtn");
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var prpPanel = document.querySelector('#prpsetInfo');
    var modelid = 0;

    btn.addEventListener("click", (e) => {
      playbtn.setAttribute('visible', 'true');
      pausebtn.setAttribute('visible', 'false');
      // 버튼이 눌려보이는 효과
      pulseWalkButton(btn);

      if (taskScheduler.isPlaying()) {
        taskScheduler.stop();
        taskScheduler.play();
        ifcLoader.ifcManager.removeSubset(modelid, mat);
        prpPanel.setAttribute('visible', 'false');
      }
      else {
        taskScheduler.stop();
        taskScheduler.play();
      }
    });
  }
});

// w 버튼  
var WALK_BUTTON_STEP = 0.8;
var WALK_VERTICAL_STEP = 0.5;

function pulseWalkButton(btn) {
  if (!btn) return;
  btn.setAttribute('depth', "0.1");
  setTimeout(function () {
    btn.setAttribute('depth', "0.2");
  }, 100);
}

function getWalkCamera() {
  return document.querySelector("#camera");
}

function moveWalkCamera(localDirection, step) {
  var cam = getWalkCamera();
  if (!cam || !cam.object3D || !window.THREE) return;
  if (window.setViewerMode) window.setViewerMode("walk");

  var movement = localDirection.clone();
  if (movement.y === 0) {
    movement.applyQuaternion(cam.object3D.quaternion);
    movement.y = 0;
    if (movement.lengthSq() > 0) movement.normalize();
  } else {
    movement.set(0, Math.sign(movement.y), 0);
  }
  movement.multiplyScalar(step);

  var navmesh = cam.components && cam.components["simple-navmesh-constraint"];
  if (navmesh) navmesh.lastPosition = null;
  cam.object3D.position.add(movement);
  cam.setAttribute("position", {
    x: cam.object3D.position.x,
    y: cam.object3D.position.y,
    z: cam.object3D.position.z
  });
  if (window.updateWalkerFloorStatus) window.updateWalkerFloorStatus();
}

AFRAME.registerComponent("wcomponent", {
  init: function () {
    var btn = document.querySelector("#wbtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(0, 0, -1), WALK_BUTTON_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// s 버튼
AFRAME.registerComponent("scomponent", {
  init: function () {
    var btn = document.querySelector("#sbtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(0, 0, 1), WALK_BUTTON_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// a 버튼
AFRAME.registerComponent("acomponent", {
  init: function () {
    var btn = document.querySelector("#abtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(-1, 0, 0), WALK_BUTTON_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// d 버튼
AFRAME.registerComponent("dcomponent", {
  init: function () {
    var btn = document.querySelector("#dbtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(1, 0, 0), WALK_BUTTON_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

var zbtn = -30;
var xbtn = -10;
var ybtn = -8;

// up 버튼
AFRAME.registerComponent("upcomponent", {
  init: function () {
    var btn = document.querySelector("#upbtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(0, 1, 0), WALK_VERTICAL_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// down 버튼
AFRAME.registerComponent("dncomponent", {
  init: function () {
    var btn = document.querySelector("#dnbtn");

    btn.addEventListener("click", (e) => {
      moveWalkCamera(new THREE.Vector3(0, -1, 0), WALK_VERTICAL_STEP);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// 정보 on/off 버튼
AFRAME.registerComponent('show-info', {
  init: function () {
    var onbtn = document.querySelector("#onbtn");
    var offbtn = document.querySelector("#offbtn");
    var rewindbox = document.querySelector("#rewindbtn");
    var exitbtn = document.querySelector("#exitbtn");
    // var visibleimg = document.querySelector('#visibleimg');
    // var invisibleimg = document.querySelector('#invisibleimg');
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var wasdPanel = document.querySelector("#wasdPanel");
    var infoPanel = document.querySelector("#infoPanel");
    modelid = 0;

    var visible = true
    onbtn.addEventListener("click", (e) => {

      if (visible) {
        visible = false

        offbtn.setAttribute('visible', 'true');
        infoPanel.setAttribute('visible', "false");
        rewindbox.setAttribute('visible', "false");
        wasdPanel.setAttribute('visible', "false");
        playbtn.setAttribute('visible', "false");
        pausebtn.setAttribute('visible', "false");
        exitbtn.setAttribute('visible', "false");
        ifcLoader.ifcManager.removeSubset(modelid, mat);
      }
      else {
        visible = true

        onbtn.setAttribute('visible', 'true');
        offbtn.setAttribute('visible', 'false');
        infoPanel.setAttribute('visible', "true");
        playbtn.setAttribute('visible', "true");
        rewindbox.setAttribute('visible', "true");
        wasdPanel.setAttribute('visible', "true");
        exitbtn.setAttribute('visible', "true");
        ifcLoader.ifcManager.removeSubset(modelid, mat);
        if (taskScheduler.isPlaying()) {
          playbtn.setAttribute('visible', "true");
          pausebtn.setAttribute('visible', "false");
        }
        else {
          playbtn.setAttribute('visible', "false");
          pausebtn.setAttribute('visible', "true");
        }
      }
    });
  }
});

AFRAME.registerComponent('exit', {
  init: function () {
    var btn = document.querySelector("#exitbtn");
    const sceneEl = document.querySelector('a-scene');

    btn.addEventListener("click", (e) => {
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);

      sceneEl.exitVRBound();
      // if (sceneEl.addEventListener('enter-vr', function (event) {
      //   btn.style.visibility = "visible";
      // }));
      // else if(sceneEl.addEventListener('exit-vr', function (event){
      //   btn.style.visibility = "hidden";
      // }));
    });
  }
});
