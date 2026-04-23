document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateSearch');

    dateInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        console.log(`선택한 날짜: ${selectedDate}`);

        searchDate(selectedDate);
    });

});

function searchDate(date) {
  const selectedDate = new Date(date);
  const sdate = taskScheduler.sdate;
  const edate = taskScheduler.edate;

  if (!selectedDate || selectedDate < sdate || selectedDate > edate) {
    alert("선택한 날짜가 범위를 벗어났습니다.");
    return;
  }

  const total_days = (edate - sdate) / (1000 * 60 * 60 * 24);
  const selected_days = (selectedDate - sdate) / (1000 * 60 * 60 * 24);
  const estimated_cost = selected_days / total_days * taskScheduler.all_cost();

  // 슬라이더 값 업데이트
  const slider = document.querySelector("#slider");
  slider.value = selected_days / total_days * 100;

  // 비용 표시 업데이트
  const valueDisplay = document.querySelector("#value-display");
  valueDisplay.innerHTML = estimated_cost.toLocaleString() + "원";

  // TaskScheduler 업데이트
  taskScheduler.currentDate = selectedDate;
  taskScheduler.currentD = selected_days;
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