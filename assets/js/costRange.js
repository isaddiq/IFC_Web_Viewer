
slider.addEventListener("input", CostRange); 

taskScheduler.updatedCallBacks.push(()=>{
  var slider = document.querySelector("#slider");
  slider.value = taskScheduler.current_cost() / taskScheduler.all_cost() * 100; 
});

function CostRange(){
  var slider = document.querySelector("#slider");
  var selectedCostRange = slider.value;
  const valueDisplay = document.querySelector("#value-display");
  var allCt = taskScheduler.all_cost();
  var est_cost = selectedCostRange * allCt / 100;
  
  valueDisplay.innerHTML = est_cost + "원";
  
  //var curCt = taskScheduler.current_cost();
  var edate = taskScheduler.edate;
  var sdate = taskScheduler.sdate;
  var total_day = (edate - sdate) / (1000 * 60 * 60 * 24);

  if (edate == null || sdate == null){
    return;
  }
 
  var curDt = 0;
  for(; curDt <= total_day; curDt++){
    taskScheduler.currentD = curDt; 
    taskScheduler.currentDate = new Date();
    taskScheduler.currentDate.setTime(sdate.getTime() + curDt * 24 * 60 * 60 * 1000);

    var curCt = taskScheduler.current_cost();
    if(curCt >= est_cost){
      break;
    }
  }
  //taskScheduler.updateGroups();  
  taskScheduler.update();

  // 가격조정 시 play 버튼 > pause 버튼으로 변경
  var playbtn = document.querySelector("#playbtn");
  var pausebtn = document.querySelector("#pausebtn");
  var visible = true

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

}

CostRange();
