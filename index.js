(function() {
  // 變數宣告
  const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
  const SHOW_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

  const data = [];
  const dataPanel = document.getElementById("data-panel");
  const modalTitle = document.getElementById("show-user-title");
  const modalImage = document.getElementById("show-user-image");
  const modalDescription = document.getElementById("show-user-body");
  const searchForm = document.getElementById("search");
  const searchInput = document.getElementById("search-input");

  const pagination = document.getElementById("pagination");
  const ITEM_PER_PAGE = 12;
  let paginationData = [];
  let nowD = data;
  let nowP = 1;

  const selectBtn = document.getElementById("selectBtn");
  let gender = "both";
  console.log(gender);

  // 所有用戶顯示
  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results);
      console.log(data);
      getTotalPages(data);
      displayDataList(data);
      getPageData(1, data);
    })
    .catch(err => console.log(err));

  // 點擊 More 按鈕事件
  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-user")) {
      const id = event.target.dataset.id;
      console.log(event.target.dataset.id);
      modalTitle.innerHTML = "";
      modalImage.innerHTML = "";
      modalDescription.innerHTML = "";
      showUser(id);
    } else if (event.target.matches(".btn-add-favorite")) {
      addFavoriteItem(event.target.dataset.id);
    }
  });

  // 搜尋事件
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    gender = "both";
    let input = searchInput.value.toLowerCase();
    let results = data.filter(user => user.name.toLowerCase().includes(input));
    console.log(results);
    nowD = results;
    getTotalPages(results);
    getPageData(nowP, results);
    searchInput.value = "";
  });

  pagination.addEventListener("click", event => {
    console.log(event.target.dataset.page);
    if (event.target.tagName === "A") {
      getPageData(event.target.dataset.page);
    }
  });

  // 選擇性別
  selectBtn.addEventListener("click", event => {
    if (event.target.matches(".maleBtn")) {
      gender = "male";
      console.log(gender);
      let results = data.filter(user => user.gender === gender);
      getTotalPages(results);
      displayDataList(results);
      getPageData(1, results);
    } else if (event.target.matches(".femaleBtn")) {
      gender = "female";
      console.log(gender);
      let results = data.filter(user => user.gender === gender);
      getTotalPages(results);
      displayDataList(results);
      getPageData(1, results);
    } else if (event.target.matches(".bothBtn")) {
      gender = "both";
      console.log("both");
      getTotalPages(data);
      displayDataList(data);
      getPageData(1, data);
    }
  });

  // 顯示所有用戶
  function displayDataList(data) {
    let htmlContent = "";
    data.forEach(function(item, index) {
      htmlContent += `
      <div class="col-4">
        <div class="card" style = "width: 18rem" >
          <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
          <div class="card-body">
            <div class="row">
              <h5 class="card-title col-6">${item.name}</h5>
              <button class="btn btn-primary btn-show-user col-3" data-toggle="modal" data-target="#show-user-modal" data-id=${item.id}>More</button>
              <!-- favorite button -->
              <button class="btn far fa-heart btn-add-favorite fa-2x" style="color:#FF8282" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
      `;
      dataPanel.innerHTML = htmlContent;
    });
  }

  // 點擊 More 按鈕後顯示用戶個人詳細內容
  function showUser(id) {
    const url = SHOW_URL + id;
    console.log(url);
    axios
      .get(url)
      .then(response => {
        // insert data into modal ui
        const data = response.data;
        const title = data.name + " " + data.surname;
        console.log(response.data.name);
        modalTitle.textContent = title;
        modalImage.innerHTML = `<img class="card-img-top" src="${data.avatar}" alt="Card image cap">`;
        modalDescription.innerHTML = `
          <img src="${data.avatar}" class="img-fluid">
          <h6>Email : ${data.email}</h6>
          <h6>Gender : ${data.gender}</h6>
          <h6>Region : ${data.region}</h6>
          <h6>Age : ${data.age}</h6>
        `;
      })
      .catch(err => console.log(err));
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
    const user = data.find(item => item.id === Number(id));

    if (list.some(item => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list.`);
    } else {
      list.push(user);
      alert(`Added ${user.name} to your favorite list!`);
    }
    localStorage.setItem("favoriteUsers", JSON.stringify(list));
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
    let pageItemContent = "";
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i +
        1}</a>
        </li>
      `;
    }
    pagination.innerHTML = pageItemContent;
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData;
    let offset = (pageNum - 1) * ITEM_PER_PAGE;
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
    displayDataList(pageData);
  }
})();
