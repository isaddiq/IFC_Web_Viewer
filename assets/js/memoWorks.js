// // localStorage.clear();

// const memoBtn = document.querySelector('.saveBtn');
// const pdfBtn = document.querySelector('.toPDF');
// const createMemoBtn = document.querySelector('#createMemo');
// const main = document.querySelector('.main');
// let memos = JSON.parse(localStorage.getItem('memos'));
// memos = memos ?? [];


// createMemoBtn.addEventListener('click', function () {
//   memobox = document.querySelector('.memo-box');
//   if (memobox.style.visibility == "visible") {
//     memobox.style.visibility = "hidden";
//   } else {
//     memobox.style.visibility = "visible";
//   }
// });

// // 메모버튼 클릭하면
// // 로컬스토리지에 메모 추가
// // id ++

// const memoMat = new MeshLambertMaterial({
//   transparent: true,
//   opacity: 0.8,
//   color: 0x800080, 
// });


// memoBtn.addEventListener('click', function () {

//   let newMemo = {};
//   let memoTitle = main.querySelector('.memo-title').value;
//   let memoContent = main.querySelector('.memo-content').value;
//   let id = JSON.parse(localStorage.getItem('id'));
//   id = id ?? 0;
//   let now = new Date();
//   let ifcLevelMemo = document.querySelector('#ifcMemoLevelInfo').textContent; 
//   let ifcMemoTypeInfo = document.querySelector('#ifcMemoTypeInfo').textContent; 

//   newMemo.id = id;
//   newMemo.title = memoTitle;
//   newMemo.content = memoContent;
//   newMemo.date = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
//   newMemo.ifcInfo  = ifcLevelMemo; // 별도의 속성에 ifc 정보 저장
//   newMemo.ifcInfo_type  = ifcMemoTypeInfo;

//   memos.push(newMemo);

//   setMemo();
//   main.querySelector('.memo-title').value = null;
//   main.querySelector('.memo-content').value = null;
//   localStorage.setItem('memos', JSON.stringify(memos));
//   localStorage.setItem('id', JSON.stringify(++id));

//   if (intersects != null) {
//     ifcLoader.ifcManager.createSubset({
//       modelID: 0,
//       ids: exIds,
//       material: memoMat,
//       scene: scene,
//       removePrevious: true,
//     });
//   }


// });

// // 메모들 로컬스토리지에서 뚝 가져와서 붙이는 함수생성
// // 페이지 로딩될 때 실행
// // 메모버튼 눌렀을 때 실행
// function setMemo() {
//   const memo_list = main.querySelector('.memo-list');

//   // 기존의 메모 제거
//   while (memo_list.firstChild) {
//     memo_list.firstChild.remove();
//   }

//   // 로컬스토리지에서 메모 가져와서 최신순으로 정렬
//   for (let i = memos.length - 1; i >= 0; i--) {
//     // article
//     let article = document.createElement('article');
//     article.classList.add('list-article');
//     article.setAttribute('data-id', memos[i].id);

//     // h2 : title
//     let title = document.createElement('h2');
//     title.classList.add('list-title');
//     title.textContent = memos[i].title;

//     // span : date
//     let data = document.createElement('span');
//     data.textContent = memos[i].date;

//     // ifc 정보
//     let ifcLevleInfo = document.createElement('p');
//     ifcLevleInfo.textContent = memos[i].ifcInfo;

//     let ifcTypeInfo = document.createElement('p');
//     ifcTypeInfo.textContent = memos[i].ifcInfo_type;

//     // p : content
//     let content = document.createElement('p');
//     content.classList.add('list-content');
//     content.textContent = memos[i].content;

//     // button : edit
//     let editBtn = document.createElement('button');
//     editBtn.classList.add('editBtn');
//     editBtn.textContent = '수정';
//     editBtn.addEventListener('click', setEditBtn, false);

//     // button : delteBtn
//     let deleteBtn = document.createElement('button');
//     deleteBtn.classList.add('deleteBtn');
//     deleteBtn.textContent = '삭제';
//     deleteBtn.addEventListener('click', setDeleteBtn, false);

//     // button 2개 감싸는 div
//     let btnWrap = document.createElement('div');
//     btnWrap.classList.add('btnWrap');

//     btnWrap.append(editBtn, deleteBtn);
//     article.append(data, ifcLevleInfo, ifcTypeInfo, title, content, btnWrap);
//     memo_list.append(article, pdfBtn);
//   }
// }

// // 메모 삭제 버튼 누르면
// // 해당메모 로컬스토리지에서 삭제됨
// function setDeleteBtn(e) {
//   memos.forEach((a, i) => {
//     if (a.id == e.target.parentNode.parentNode.dataset.id) {
//       memos.splice(i, 1);
//       localStorage.setItem('memo', JSON.stringify(memos));
//       setMemo();
//       ifcLoader.ifcManager.removeSubset(0, memoMat);
//       return;
//     }
//   });
// }

// pdfBtn.addEventListener('click', function () {
//   setPdfBtn();
// });


// // 메모 PDF로 저장 버튼 누르면
// // 해당메모 PDF로 저장됨
// function setPdfBtn(e) {
//     let pdf = new jsPDF();
//     jsPDF.API.events.push(['addFonts', callAddFont])

//     pdf.setFont('malgun');
//     // pdf.setFont('malgunbd');
  
//     memos.forEach((memo) => {

//       // 한글폰트 가져오기
//       pdf.setFontSize(12);
//       pdf.text(memo.date, 10, 20);

//       // ifc 정보 추가
//       if(memo.ifcInfo !== undefined){
//         pdf.text(memo.ifcInfo.replace('\n', ''), 10, 30);  
//       }

//       if(memo.ifcInfo_type !== undefined){
//         pdf.text(memo.ifcInfo_type.replace('\n', ''), 10, 40);  
//       }

//       pdf.setFontSize(16);
//       pdf.text("title: " + memo.title, 10, 50);

//       pdf.setFontSize(12);
//       pdf.text("content: " + memo.content.replace('\n', ''), 10, 60);

//       pdf.addPage(); // Add a new page for each memo
//     });
//     pdf.save('memo.pdf');
// }

// // 메모 수정 버튼 누르면
// // 해당메모 메모패드에 불러오고
// function setEditBtn(e) {
//   memos.forEach((a, i) => {
//     if (a.id == e.target.parentNode.parentNode.dataset.id) {
//       main.querySelector('.memo-title').value = a.title;
//       main.querySelector('.memo-content').value = a.content;
//       memos.splice(i, 1);
//       localStorage.setItem('memo', JSON.stringify(memos));
//       setMemo();
//       return;
//     }
//   });
// }

// // 페이지 로딩되면 로컬스토리지에서 메모들 가져옴
// setMemo();
