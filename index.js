const btn = document.querySelectorAll('.btn');
const tabs = document.querySelectorAll('.tab');
let currentTab;
let cards;
const searchBtn = document.querySelector('.search-bar button');
const searchValue = document.getElementsByClassName('input')[0];
const close=document.getElementById('close');
const menuOpen=document.querySelector('#open');
const listItem=document.querySelectorAll('ul li');

listItem.forEach(item=> item.addEventListener('click',()=>document.querySelector('nav ul').classList.remove('active')))

close.addEventListener('click',()=>{
    document.querySelector('nav ul').classList.remove('active');
})
menuOpen.addEventListener('click',()=>{
    console.log(document.querySelector('nav ul'))
    document.querySelector('nav ul').classList.add('active');
})


const fetchData = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products/');
        const data = await response.json();
        cards = data;
        return data;
    }
    catch (error) {
        console.log('network error');
    }
}


const addtocarthandler = (e) => {
    const id = Number(e.target.getAttribute('data-id'));
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
        const itemID = cart.findIndex(item => item.id === id);
        if (itemID === -1) {
            cart.push(cards.find(item => item.id === id));
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    else {
        localStorage.setItem('cart', JSON.stringify([cards.find(item => item.id === id)]));
    }
}


const renderData = (data, tab) => {
    data.forEach((item) => {
        const result = document.createElement('div');
        result.classList.add('card');
        result.setAttribute('data-card',item.id);
        result.innerHTML = ` <img src=${item.image} alt='card'>
        <p id='title'>${item.title}</p>
        <p>${item.price}</p>
        <a href='#'>Read More</a>
        <div class='item-btn'>
        <button class='add itemBtn' data-id='${item.id}'>Add to Cart</button>
        <button class='remove itemBtn' data-id='${item.id}'>Remove</button>
        </div>`
        result.querySelector('.add').addEventListener('click', addtocarthandler)
        result.querySelector('.remove').addEventListener('click', removeFromCartHandler)
        tab.append(result);
    })
}

function removeFromCartHandler(e) {
    const id = Number(e.target.getAttribute('data-id'));
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
        const itemId = cart.findIndex(item => item.id === id);
        if (itemId !== -1) {
            if (cart.length > 1) {
                const newwData = cart.toSpliced(itemId, 1);
                localStorage.setItem('cart', JSON.stringify(newwData));
                document.querySelector(`[data-id=${"cart"}]`).innerHTML = '';
                renderData(newwData, document.querySelector(`[data-id=${'cart'}]`));
            }
            else {
                localStorage.clear();
                document.querySelector(`[data-id=${"cart"}]`).innerHTML = '<p>No Items Found in Cart</p>';
            }
        }
    }
}

const init = () => {
    fetchData()
        .then(data => renderData(data, tabs[0]))
        .catch(error => console.log('network Error'));
    currentTab = tabs[0].getAttribute('data-id');
    tabs[0].classList.add('active');
    document.getElementById(currentTab).classList.add('active');
}
init();

const switchTab = (newTab) => {
    document.getElementById(currentTab).classList.remove('active');
    document.querySelector(`[data-id=${currentTab}]`).classList.remove('active');
    currentTab = newTab
    document.getElementById(currentTab).classList.add('active');
    document.querySelector(`[data-id=${currentTab}]`).classList.add('active');
}

btn.forEach(item => {
    item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('active')) {
            const newTab = e.target.getAttribute('id');
            if (newTab !== 'cart') {
                fetchData()
                    .then(data =>{
                        document.querySelector(`[data-id=${newTab}]`).innerHTML='';
                         renderData(data, document.querySelector(`[data-id=${newTab}]`))
                    })
                switchTab(newTab);
            }
            else {
                const cartData = JSON.parse(localStorage.getItem('cart'));
                console.log(cartData);
                if (cartData) {
                    console.log('hi');
                    document.querySelector(`[data-id=${newTab}]`).innerHTML='';
                    renderData(cartData, document.querySelector(`[data-id=${newTab}]`));
                }
                else {
                    tabs[1].innerHTML = `<p>No Items Found in Cart</p>`;
                }
                switchTab(newTab);
            }
        }
    })
})

searchBtn.addEventListener('click', (e) => {
    if (searchValue.value.length > 0) {
        if (currentTab !== 'search') {
            switchTab('home')
        }
        const newData=cards.filter(item => item.title.toLowerCase().includes(searchValue.value.toLowerCase()));
        if(newData.length >= 1){
        document.querySelector(`[data-id=${currentTab}]`).innerHTML='';
        renderData(newData,document.querySelector(`[data-id=${currentTab}]`));
        }
        else{
            document.querySelector(`[data-id=${currentTab}]`).innerHTML='<p>No Matching Results Found</p>';
        }
    }
    else{
        document.querySelector(`[data-id=${currentTab}]`).innerHTML='';
        renderData(cards,document.querySelector(`[data-id=${currentTab}]`));
    }
})
