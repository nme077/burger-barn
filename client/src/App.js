import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';
import Home from './components/Home';
import Register from './components/Login/Register';
import Login from './components/Login/Login';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com/' : 'http://localhost:9000/';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();

  return (
    <Router>
        <Switch>
          <Route path="/admin">
            {isLoggedIn ? <Redirect to="/login" /> : <Admin />}
          </Route>
          <Route path="/register">
            {isLoggedIn ? <Redirect to="/admin" /> : <Register />}
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home menu />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
    </Router>
  );

}

function Admin() {
  const [menu, setMenu] = useState([]);
  const [displayInputForm, setDisplayInputForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [price1, setPrice1] = useState('');
  const [priceDesc1, setPriceDesc1] = useState('');
  const [price2, setPrice2] = useState('');
  const [priceDesc2, setPriceDesc2] = useState('');
  const [price3, setPrice3] = useState('');
  const [priceDesc3, setPriceDesc3] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState('');
  const [id, setId] = useState('');
  const [editState, setEditState] = useState(false);
  const [categorySelect, setCategorySelect] = useState(''); // Category to display on admin page

  const addItemData = {
    name: name,
    category: category,
    price1: price1,
    priceDesc1: priceDesc1,
    price2: price2,
    priceDesc2: priceDesc2,
    price3: price3,
    priceDesc3: priceDesc3,
    description: description,
    order: order,
    id: id // Only used to edit items
  }

  const sortItems = (a,b) => {
    return a.order - b.order
  }

  // Initialize the menu
  useEffect(() => {
    fetch(baseURL + 'api/menu')
        .then((res) => res.json())
        .then((data) => {
          setCategoryList(data.categories);
          setMenu(data.menu);
          setCategorySelect(data.categories[0].name);
        })
        .catch(() => {
          setMenu({error: 'Error fetching Menu'});
        })
  },[]);

  //Check for user auth
  //useEffect(() => {
  //  fetch(baseURL + 'logged_in')
  //      .then((res) => res.json())
  //      .then((data) => {
  //        console.log(data);
  //      })
  //      .catch((err) => {
  //        console.log(err);
  //      })
  //},[]);

  // Fetch the menu
  function getMenu() {
      fetch(baseURL + 'api/menu')
        .then((res) => res.json())
        .then((data) => {
          setCategoryList(data.categories);
          setMenu(data.menu);
        })
        .catch(() => {
          setMenu({error: 'Error fetching Menu'});
        })
  }
  
  // Delete menu item route
  function deleteItem(itemId) {
    fetch(baseURL + 'api/menu/'+itemId, {
      method: 'POST'
    }).then(() => {
      console.log('deleting')
      getMenu();
    })
  }

  function showEditItem(item) {
    setEditState(true); // Set input modal to edit mode
    setDisplayInputForm(true); // Show the input modal
    // Populate the input form with corresponding item info to edit
    setName(item.name);
    setCategory(item.category);
    if(item.prices[0]) setPrice1(item.prices[0][1]);
    if(item.prices[0]) setPriceDesc1(item.prices[0][0]);
    if(item.prices[1]) setPrice2(item.prices[1][1]);
    if(item.prices[1]) setPriceDesc2(item.prices[1][0]);
    if(item.prices[2]) setPrice3(item.prices[2][1]);
    if(item.prices[2]) setPriceDesc3(item.prices[2][0]);
    setDescription(item.description);
    setOrder(item.order);
    setId(item._id)
  }

  function clearItemInfo() {
    setName('');
    setCategory('');
    setPrice1('');
    setPriceDesc1('');
    setPrice2('');
    setPriceDesc2('');
    setPrice3('');
    setPriceDesc3('');
    setDescription('');
    setOrder('');
    setEditState(false);
  }

  function handleAddItemSubmit(data) {
    fetch(baseURL + 'api/menu', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(() => {
      setDisplayInputForm(false); // Hide the input modal
      console.log('submitted')
      getMenu();
    })
  }
  
  function handleEditItemSubmit(data) {
    fetch(baseURL + 'api/menu/edit/'+data.id, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(() => {
      setDisplayInputForm(false); // Hide the input modal
      console.log('edit submitted')
      getMenu();
    }).catch(() => {
      setDisplayInputForm(false); // Hide the input modal
    })
  }

  // Create menu item route
  //const createMenuItem = () => {
  //  fetch(baseURL + '/api/menu', {
  //    method: 'POST',
  //    headers: {
  //      'Content-Type': 'application/json',
  //    },
  //    body: JSON.stringify({
  //      name: 'formData'
  //    })
  //  })
  //    .then((res) => res.json())
  //    .then((data) => {
  //      setMenu(data);
  //    })
  //}

  return (
    <div className="App">
      <div className="wrapper">
        <div id="sidebar">
            <div className="sidebar-heading">
                <i className="fas fa-hamburger sidebar-heading-icon"></i>
                <h3 className="sidebar-heading-title">Admin</h3>
            </div>
            <div className="sidebar-selection-container">
                <a className="sidebar-selection active" href="/admin">
                    <i className="fas fa-utensils sidebar-selection-icon"></i> Menu
                </a>
            </div>
        </div>

        <div className="main">
            <div className="main-container">
              <div className="header-container">
                <h2 className="heading-title">Menu</h2>
                <select className="category-select" value={categorySelect} onChange={(e) => setCategorySelect(e.target.value)}>
                  {categoryList.map(cat => {
                    return <option value={cat.name} key={cat._id}>{cat.name}</option>
                  })}
                </select>
                <div className="heading-btn-container">
                  <button className="admin-btn add-btn" onClick={() => setDisplayInputForm(true)}><i className="fas fa-plus"></i></button>
                </div>
              </div>
              <div className="column-header-container">
                <div className="col-admin col-drag"></div>
                <h3 className="col-admin col-1-admin">Name</h3>
                <h3 className="col-admin col-2-admin">Description</h3>
                <h3 className="col-admin col-3-admin">Price</h3>
                <h3 className="col-admin col-4-admin">Category</h3>
                <div className="col-admin col-5-admin"></div>
                <div className="col-admin col-6-admin"></div>
              </div>
              <div className="menu-admin">
                {menu.error ? <div className="error-menu">{menu.error}</div> : menu.filter(item => {return item.category === categorySelect}).sort(sortItems).map((item,ind) => (
                   <div key={ind}>
                   <div className="menu-item-container-admin">
                     <div className="col-admin col-drag"><i className="fas fa-bars"></i></div>
                     <div className="col-admin col-1-admin menu-item-name-admin">{item.name ? item.name : ''}</div>
                     <div className="col-admin col-2-admin menu-item-description-admin">{item.description ? item.description : ''}</div>
                     <div className="col-admin col-3-admin price-container">
                       {item.prices.map((price, ind) => {
                         return <div key={ind}>{price[0] ? `desc(${ind+1}): ` + price[0] + ', ' : ''} {price[1]}</div>;
                       })}
                     </div>
                     <div className="col-admin col-4-admin menu-item-category-admin">{item.category ? item.category : ''}</div>
                     <button className="col-admin col-5-admin form-btn" onClick={() => showEditItem(item)}>Edit</button>
                     <button className="col-admin col-6-admin form-btn delete-btn" onClick={() => deleteItem(item._id)}>Delete</button>
                   </div>
                 </div>
                ))}
              </div>
            </div>
        </div>
      </div>
      {displayInputForm ? 
        <div className="add-item-container">
          <div className="add-item-inner">
            <button className="btn-cancel" onClick={() => {setDisplayInputForm(false); clearItemInfo();}}><i className="fas fa-times"></i></button>
            <input className="add-item-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="add-item-input" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <select className="add-item-input add-item-input-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="grapefruit">Select a Category</option>
              {categoryList.map(cat => {
                return <option value={cat.name} key={cat._id}>{cat.name}</option>
              })}
            </select>
            <div className="price-input-group">
              <input className="add-item-input price-desc-input" type="text" placeholder="Price (1) description (optional)" value={priceDesc1} onChange={(e) => setPriceDesc1(e.target.value)} />
              <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price1} onChange={(e) => setPrice1(e.target.value.replace(/[^\d.]/gi, ""))} />
              <input className="add-item-input price-desc-input" type="text" placeholder="Price (2) description (optional)" value={priceDesc2} onChange={(e) => setPriceDesc2(e.target.value)} />
              <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price2} onChange={(e) => setPrice3(e.target.value.replace(/[^\d.]/gi, ""))} />
              <input className="add-item-input price-desc-input" type="text" placeholder="Price (3) description (optional)" value={priceDesc3} onChange={(e) => setPriceDesc2(e.target.value)} />
              <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price3} onChange={(e) => setPrice3(e.target.value.replace(/[^\d.]/gi, ""))} />
            </div>
            <input className="add-item-input" type="text" placeholder="Order" value={order} onChange={(e) => setOrder(e.target.value)} />
            
            {editState ? 
              <button className="btn-add-item-submit" value="submit" onClick={() => handleEditItemSubmit(addItemData)}><span>Save changes</span></button>
              : 
              <button className="btn-add-item-submit" value="submit" onClick={() => handleAddItemSubmit(addItemData)}><span>Add item</span></button>
            }
          
          </div>
        </div> 
        : null}
    </div>
  );
}

export default App;