import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import update from 'immutability-helper';

import { Item } from './Item.js'

import CurrencyInput from 'react-currency-input-field';


const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com/' : 'http://localhost:9000/';

function Admin() {
    // State variables
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
    const [sortedMenu, setSortedMenu] = useState([]);
    // End state variables
  
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

    const history = useHistory();
  
    function sortItems(a,b) {
      return a.order - b.order
    }
  
    // Initialize the menu on page load
    useEffect(() => {
      fetch(baseURL + 'api/menu')
          .then((res) => res.json())
          .then((data) => {
            setCategoryList(data.categories);
            setMenu(data.menu);
            setCategorySelect(data.categories[0].name);
            setSortedMenu(data.menu.filter(item => {return item.category === data.categories[0].name}).sort(sortItems))
          })
          .catch(() => {
            setMenu({error: 'Error fetching Menu'});
          })
    },[]);

    // Fetch the menu
    function getMenu() {
        fetch(baseURL + 'api/menu')
          .then((res) => res.json())
          .then((data) => {
            setCategoryList(data.categories);
            setMenu(data.menu);
            setSortedMenu(data.menu.filter(item => {return item.category === categorySelect}).sort(sortItems));
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
        getMenu();
      })
    }

    //Logout
    function logout(e) {
      fetch(baseURL + 'logout', {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        history.push('/');
      }).catch((err) => {
        console.log(err);
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
  
    function handleAddItemSubmit(e) {
      e.preventDefault();

      fetch(baseURL + 'api/menu', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(addItemData)
      }).then(() => {
        setDisplayInputForm(false); // Hide the input modal
        clearItemInfo();
        getMenu();
      })
    }
    
    function handleEditItemSubmit(e, itemId) {
      e.preventDefault();

      fetch(baseURL + 'api/menu/edit/'+itemId, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(addItemData)
      }).then(() => {
        setDisplayInputForm(false); // Hide the input modal
        clearItemInfo();
        getMenu();
      }).catch(() => {
        setDisplayInputForm(false); // Hide the input modal
      })
    }

    const moveItem = useCallback((dragIndex, hoverIndex) => {
      const dragItem = sortedMenu[dragIndex];
      
      setSortedMenu(update(sortedMenu, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragItem],
        ],
      }));
    }, [sortedMenu]);

    const handleUpdateItemOrder = useCallback(() => {
      const itemsToUpdate = sortedMenu.map((el, index) => {
        return {id: el._id, order: index, name:el.name}
      })

      fetch(baseURL + 'api/menu/edit/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(itemsToUpdate)
      }).then(() => {
        getMenu();
      }).catch((err) => {
        console.log(err)
      })
  }, [sortedMenu]);
  
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
              <div className="sidebar-selection-container logout">
                  <button className="sidebar-selection" onClick={logout}>
                      <i className="fas fa-sign-out-alt sidebar-selection-icon"></i> Logout
                  </button>
              </div>
          </div>
  
          <div className="main">
              <div className="main-container">
                <div className="header-container">
                  <select className="category-select" value={categorySelect} onChange={(e) => {setCategorySelect(e.target.value); setSortedMenu(menu.filter(item => {return item.category === e.target.value}).sort(sortItems))}}>
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
                  {menu.error ? <div className="error-menu">{menu.error}</div> : sortedMenu.map((item,ind) => 
                    <Item item={item} index={ind} test="test" key={item._id} deleteItem={deleteItem} id={item._id} showEditItem={showEditItem} moveItem={moveItem} handleUpdateItemOrder={handleUpdateItemOrder} sortedMenu={sortedMenu}/>)}
                </div>
              </div>
          </div>
        </div>
        {displayInputForm ? 
          <div className="add-item-container">
            <form className="add-item-inner" onSubmit={(e) => {editState ? handleEditItemSubmit(e, id) : handleAddItemSubmit(e)}}>
              <button className="btn-cancel" onClick={() => {setDisplayInputForm(false); clearItemInfo();}}><i className="fas fa-times"></i></button>
              <input required className="add-item-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="add-item-input" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <select required className="add-item-input add-item-input-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a Category</option>
                {categoryList.map(cat => {
                  return <option value={cat.name} key={cat._id}>{cat.name}</option>
                })}
              </select>
              <div className="price-input-group">
                <input className="add-item-input price-desc-input" type="text" placeholder="Price (1) description (optional)" value={priceDesc1} onChange={(e) => setPriceDesc1(e.target.value)} />
                <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price1} onChange={(e) => setPrice1(e.target.value.replace(/[^\d.]/gi, ""))} />
                <input className="add-item-input price-desc-input" type="text" placeholder="Price (2) description (optional)" value={priceDesc2} onChange={(e) => setPriceDesc2(e.target.value)} />
                <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price2} onChange={(e) => setPrice2(e.target.value.replace(/[^\d.]/gi, ""))} />
                <input className="add-item-input price-desc-input" type="text" placeholder="Price (3) description (optional)" value={priceDesc3} onChange={(e) => setPriceDesc3(e.target.value)} />
                <CurrencyInput prefix="$ " className="add-item-input price-input" placeholder="$ 0.00" value={price3} onChange={(e) => setPrice3(e.target.value.replace(/[^\d.]/gi, ""))} />
              </div>
              <button className="btn-add-item-submit" value="submit"><span>{editState ? 'Save changes' : 'Add item'}</span></button>
            </form>
          </div> 
          : null}
      </div>
    );
  }

  export default Admin