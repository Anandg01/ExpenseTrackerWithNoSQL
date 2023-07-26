let page = 1;
let perPage = 5;
let totalExpance = 0;
const token = localStorage.getItem('token')
const premium = localStorage.getItem('premimum')

const pagination = document.getElementById('pagination')

// show all expance when reset

document.addEventListener('DOMContentLoaded', async () => {
  if (premium === 'true') {
    //console.log(premium)
    addPremium();
  }
  if (!token) {
    window.location.href = './login.html';
  }
  try {
    const res = await axios.get(`/allExpance?page=1`, { headers: { 'Authorizan': token } })
    const expance = res.data;
    totalExpance = expance.total;
    expance.data.forEach(element => {
    showOncreen(element)
    })
    console.log('expenaces', expance)
    showpagination(expance)
  }
  catch (err) {
    console.log(err)
  }
})


function addexpance(e) {
  e.preventDefault();
  console.log(e.target.Description.value)
  const expanceDetais = {
    expAmount: e.target.expanceAmount.value,
    description: e.target.Description.value,
    catagory: e.target.catagory.value,
    userId: 1
  }
  //showOncreen(expanceDetais)
  const validate = axios.post(`/addExpance `, expanceDetais, { headers: { 'Authorizan': token } })
    .then(res => {
      if (perPage * page > totalExpance) {
        showOncreen(res.data)
      }
      else {
        const btn2 = document.createElement('button')
        btn2.innerHTML = page + 1
        pagination.appendChild(btn2)

      }
      totalExpance++;
      document.getElementById('expanceAmount').value = '';
      document.getElementById('Description').value = '';
    })
    .catch(err => {
      //console.log(err)
    })
}


function showOncreen(obj) {
 const id=obj._id.toString()
 console.log(id)
  const parant = document.getElementById('addTable');
  const table = `<tr id='${id}'> <td>${obj.expAmount}</td> <td>${obj.description} </td> <td>${obj.catagory} </td> <td> <button onclick="deleteClick('${id}')">Delete Expance</button></td> </tr>`
  parant.innerHTML += table;
}

async function deleteClick(id) {
  try {
    console.log(id)
    const data = await axios.delete(`/deleteExp/${id}`, { headers: { 'Authorizan': token } })
   removeOnscreen(data.data._id)
    console.log(data.data._id)
  }
  catch (err) {
    console.log(err)
  }

}

function removeOnscreen(id) {
  const tr = document.getElementById(id)
  tr.parentNode.removeChild(tr)
}

function addPremium() {
  document.getElementById('premium').innerHTML = `<h4>Premium User</h4>
   <button id="leaderbtn" onclick="leaderBoard()">LeaderBoard</button>`
}

function leaderBoard() {
  axios.get('/leaderbord').then(res => {
    document.getElementById('ledtit').innerHTML = 'LeaderBoard'
    document.getElementById('leader').innerHTML = ``
    res.data.forEach(data => {
      addleaderboard(data)
    })
  })
    .catch(err => console.log(err))
}

function addleaderboard(obj) {
  const prNode = document.getElementById('leader');
  const li = `<li>Name- ${obj.name}, Total Expance :${obj.totalexpance} </li>`
  prNode.innerHTML += li;
}



//add logout 

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = './login.html';
})

// add payment method

document.getElementById('rozerpay').addEventListener('click', async (e) => {
  let token = localStorage.getItem('token')
  const response = await axios.get(`/premium`, {
    headers: { 'Authorizan': token }
  });
  console.log(response.data.key_id, response.data.order.id);

  const options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      axios.post(`/updatetransastion`,
        { order_id: options.order_id, payment_id: response.razorpay_payment_id, paymentStatus: true },
        { headers: { 'Authorizan': token } })
      alert('you are a premimum')
      addPremium()
    }
  };

  const paymentButton = new Razorpay(options);
  paymentButton.open();
  e.preventDefault();
  paymentButton.on('payment.failed', async function (response) {
    await axios.post(`/updatetransastion`,
      { order_id: options.order_id, payment_id: response.error.metadata.payment_id, paymentStatus: false },
      { headers: { 'Authorizan': token } })
    // handle the payment failure
    console.log(response.error.metadata.payment_id)
    alert('something went wrong')

  });
});

//add download file api

async function download() {
  try {
    const response = await axios.get('/download', { headers: { "Authorizan": token } })
    if (response.status === 201) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = 'myexpense.csv';
      a.click();
    }
    else {
      throw new Error(response.data.message)
    }

  }
  catch (error) {
    showError(error)
  }
}


function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

async function downloadAll() {
  try {
    const fileURL = await axios.get('/allFileurl', { headers: { "Authorizan": token } })
    const ul = document.getElementById('listof-file')
    ul.innerHTML = ``
    fileURL.data.forEach(data => {
      const li = `<l1 id=${data._id} ><a href="${data.fileURL}">${data._id} </a>Expences</l1>`
      ul.innerHTML += li;
    })

  }
  catch {
    console.log('error on file url downloading')
  }
}

function showpagination({ hasPrev, hasNextpage, prevPage, currentPage, nextPage }) {
  pagination.innerHTML = ''
  if (hasPrev) {
    const btn2 = document.createElement('button')
    btn2.innerHTML = prevPage
    btn2.addEventListener('click', () => { page = prevPage; getProducts(prevPage) })
    pagination.appendChild(btn2)
  }
  const btn1 = document.createElement('button')
  btn1.innerHTML = `<h1>${currentPage} </h1>`
  btn1.addEventListener('click', () => getProducts(currentPage))
  pagination.appendChild(btn1)
  if (hasNextpage) {
    const btn3 = document.createElement('button')
    btn3.innerHTML = nextPage
    btn3.addEventListener('click', () => { page = nextPage; getProducts(nextPage) })
    pagination.appendChild(btn3)
  }
}

async function getProducts(page) {

  try {
    const res = await axios.get(`/allExpance?page=${page}&perPage=${perPage}`, { headers: { 'Authorizan': token } })
    const parant = document.getElementById('addTable');
    parant.innerHTML = `<tr><th>price</th><th>Description</th><th>category</th></tr>`
    const expance = res.data;
    expance.data.forEach((obj) => {
      showOncreen(obj)
    })
    showpagination(expance)
  }
  catch (error) {
    console.log('err ', error)
  }
}

const selectElement = document.getElementById('setrowExpance');

selectElement.addEventListener('change', () => {
  const selectedValue = selectElement.value;
  perPage = selectedValue;
  getProducts(page, perPage)
});

// show user details
function showuser(id){
  document.getElementById(id).style.display = "block";
}

document.getElementById("overlay").addEventListener("click", function(e) {
if (e.target.id === "overlay") {
noneShow('overlay');
}
});        
function noneShow(id){
document.getElementById(id).style.display = "none";
document.body.style.overflow = "auto";
}