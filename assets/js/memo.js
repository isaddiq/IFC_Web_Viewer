class memo_info {
  constructor(id, title, content, date, fileName, ifcInfo, ifcInfo_type, subsetInfo) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.date = date;
    this.fileName = fileName;
    this.ifcInfo = ifcInfo;
    this.ifcInfo_type = ifcInfo_type;
    this.subsetInfo = subsetInfo;
    this.memoMat = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.8,
      color: 0x800080,
    });
    this.isMeshVisible = false; // 추가: 메쉬가 보이는지 여부를 추적
  }

  showMesh() {
    if (this.subsetInfo) {
      ifcLoader.ifcManager.removeSubset(0, this.memoMat); // 전에 그려진 mesh 지우고 생성 (겹치지 않게)
      ifcLoader.ifcManager.createSubset({
        modelID: this.subsetInfo.modelID,
        ids: this.subsetInfo.ids,
        material: this.memoMat,
        scene: scene,
        removePrevious: true,
      });
      this.isMeshVisible = true; // 메쉬가 보임
    } else {
      console.error('subsetInfo is null or undefined');
    }
  }

  hideMesh() {
    ifcLoader.ifcManager.removeSubset(0, this.memoMat);
    this.isMeshVisible = false; // 메쉬가 안 보임
  }

  toggleMesh() {
    if (this.isMeshVisible) {
      this.hideMesh();
    } else {
      this.showMesh();
    }
  }
}

const memoBtn = document.querySelector('#saveBtn');
const pdfBtn = document.querySelector('.toPDF');
const createMemoBtn = document.querySelector('#createMemo');
const main = document.querySelector('.main');
const modal = document.getElementById('memoModal');
const closeBtn = document.getElementById('closeMemoBtn');
let selectedMemo;

let memos = JSON.parse(localStorage.getItem('memos')) || [];
memos = memos.map(memo => new memo_info(
  memo.id,
  memo.title,
  memo.content,
  memo.date,
  memo.fileName,
  memo.ifcInfo,
  memo.ifcInfo_type,
  memo.subsetInfo
));

createMemoBtn.addEventListener('click', function () {
  modal.style.display = 'block';
});

closeBtn.onclick = function() {
  modal.style.display = 'none';
};


window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

memoBtn.addEventListener('click', function () {
  const memoTitle = document.querySelector('.memo-title').value;
  const memoContent = document.querySelector('.memo-content').value;
  let id = JSON.parse(localStorage.getItem('id')) || 0;
  const now = new Date();
  const ifcMemoFileName = document.querySelector('#ifcMemoFileName').textContent;
  const ifcLevelMemo = document.querySelector('#ifcMemoLevelInfo').textContent;
  const ifcMemoTypeInfo = document.querySelector('#ifcMemoTypeInfo').textContent;

  const newMemo = new memo_info(
    id,
    memoTitle,
    memoContent,
    `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`,
    ifcMemoFileName,
    ifcLevelMemo,
    ifcMemoTypeInfo,
    intersects ? {
      modelID: 0,
      ids: exIds,
      material: {
        color: 0x800080,
        opacity: 0.8
      }
    } : null
  );
 
  memos.push(newMemo);
  setMemo();

  document.querySelector('.memo-title').value = '';
  document.querySelector('.memo-content').value = '';

  localStorage.setItem('memos', JSON.stringify(memos));
  localStorage.setItem('id', JSON.stringify(++id));

  newMemo.showMesh();
  modal.style.display = 'none';
});

function setMemo() {
  const memo_list = document.querySelector('.memo-list');

  while (memo_list.firstChild) {
    memo_list.firstChild.remove();
  }

  for (let i = memos.length - 1; i >= 0; i--) {
    
    const memo_info = memos[i];
    if(selectedMemo !=null && memo_info != selectedMemo)
      continue;

    const article = document.createElement('article');
    article.classList.add('list-article');
    article.setAttribute('data-id', memos[i].id);

    const title = document.createElement('h2');
    title.classList.add('list-title');
    title.textContent = memos[i].title;

    const date = document.createElement('span');
    date.textContent = memos[i].date;
    date.style.fontSize = '14px';

    const ifcFileInfo = document.createElement('p');
    ifcFileInfo.textContent = memos[i].fileName;
    ifcFileInfo.style.fontSize = '14px';
    ifcFileInfo.style.fontWeight = 'bold';

    const ifcLevleInfo = document.createElement('p');
    ifcLevleInfo.textContent = memos[i].ifcInfo;
    ifcLevleInfo.style.fontSize = '14px';

    const ifcTypeInfo = document.createElement('p');
    ifcTypeInfo.textContent = memos[i].ifcInfo_type;
    ifcTypeInfo.style.fontSize = '14px';

    const content = document.createElement('p');
    content.classList.add('list-content');
    content.textContent = memos[i].content;

    const meshToggleBtn = document.createElement('button');
    meshToggleBtn.classList.add('editBtn', 'meshToggleBtn');
    meshToggleBtn.textContent = memo_info.isMeshVisible ? '지우기' : '그리기';
   
    meshToggleBtn.addEventListener('click', () => {
      memo_info.toggleMesh();
      meshToggleBtn.textContent = memo_info.isMeshVisible ? '지우기' : '그리기';
    }, false);

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn', 'memoEditBtn');
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', setEditBtn, false);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn', 'memoDeleteBtn');
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', setDeleteBtn, false);

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.append(meshToggleBtn, editBtn, deleteBtn);

    article.append(title, date, ifcFileInfo, ifcLevleInfo, ifcTypeInfo, content, btnWrap);
    memo_list.append(article, pdfBtn);

    PdfBtnVisibility();
  }
}

function setDeleteBtn(e) {
  memos.forEach((a, i) => {
    if (a.id == e.target.parentNode.parentNode.dataset.id) {
      a.hideMesh();
      memos.splice(i, 1);
      localStorage.setItem('memos', JSON.stringify(memos));
      return;
    }
  });
  setMemo();
}

function setSelectedMemo(id){
  if(id ==null)
    selectedMemo = null;
  else
    selectedMemo = memos.filter(o_=>o_.subsetInfo.ids.indexOf(id) >=0 )[0];
  setMemo();
}
document.addEventListener('DOMContentLoaded', function () {
  modal.style.display = 'none';
  PdfBtnVisibility();
  pdfBtn.addEventListener('click', setPdfBtn);
});

function PdfBtnVisibility() {
  pdfBtn.style.visibility = memos.length > 0 ? 'visible' : 'hidden';
}

function setPdfBtn(e) {
  const pdf = new jsPDF();
  jsPDF.API.events.push(['addFonts', callAddFont]);
  pdf.setFont('malgun');

  memos.forEach((memo) => {
    pdf.setFontSize(12);
    pdf.text(memo.date, 10, 20);

    if (memo.fileName !== undefined) {
      pdf.text("file name: " + memo.fileName.replace('\n', ''), 10, 30);
    }

    if (memo.ifcInfo !== undefined) {
      pdf.text(memo.ifcInfo.replace('\n', ''), 10, 40);
    }

    if (memo.ifcInfo_type !== undefined) {
      pdf.text(memo.ifcInfo_type.replace('\n', ''), 10, 50);
    }

    pdf.setFontSize(16);
    pdf.text("title: " + memo.title, 10, 60);

    pdf.setFontSize(12);
    pdf.text("content: " + memo.content.replace('\n', ''), 10, 70);

    pdf.addPage();
  });

  pdf.save('memo.pdf');
}

function setEditBtn(e) {
  memos.forEach((a, i) => {
    if (a.id == e.target.parentNode.parentNode.dataset.id) {
      a.hideMesh();
      document.querySelector('.memo-title').value = a.title;
      document.querySelector('.memo-content').value = a.content;
      memos.splice(i, 1);
      localStorage.setItem('memos', JSON.stringify(memos));
      setMemo();
      modal.style.display = 'block';
      return;
    }
  });
}

setMemo();
