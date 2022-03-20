import * as Scroll from 'react-scroll';
import React, { useState, useEffect } from 'react';
import RotateLoader from "react-spinners/RotateLoader";
import httpRequestUrl from '../httpRequestUrl';
import { saveAs } from 'file-saver';
import axios from 'axios';

import burger_1 from '../assets/burger-1.jpeg'
import burger_2 from '../assets/burger-2.jpeg'
import burger_3 from '../assets/burger-3.jpeg'

let Link = Scroll.Link;

const sortItems = (a,b) => {
  return a.order - b.order
}

function Home() {
    const [menu, setMenu] = useState([]);
    const [hours, setHours]= useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [menuSelection, setMenuSelection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    // Fetch the menu
    function getMenu() {
      fetch(httpRequestUrl + '/api/menu')
        .then((res) => res.json())
        .then((data) => {
          setMenu(data.menu);
          setCategoryList(data.categories);
          setMenuSelection(data.categories[0].name);
          setHours(data.text);
          setIsLoading(false);
        })
        .catch((err) => {
          setMenu({error: 'Error fetching menu'});
          setIsLoading(false);
      })
    }

    function printMenu() {
      axios.get(httpRequestUrl + '/api/menu/pdf', {responseType: 'blob'})
        .then((res) => {
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

          saveAs(pdfBlob, 'burger_barn_menu.pdf');
        })
    }

    // Initialize the menu
    useEffect(() => {
      getMenu();
    },[]);
  
    function updateMenuSelection(e) {
      e.preventDefault();
      const category = e.target.getAttribute('id');
  
      setMenuSelection(category);
    }
  
    return(
      <div className="App">
        <div className="wrapper">
        <div className="header">
            <div className="navbar">
                <Link to="menu" className="nav-link" spy={true} smooth={true} duration={500}>Menu</Link>
                <div className="header-logo">
                    <i className="fas fa-hamburger"></i>
                </div>
                <Link to="map" className="nav-link" spy={true} smooth={true} duration={500}>Map</Link>
            </div>
            <div className="jumbotron">
                <h6>Jeffersonville, VT</h6>
                <h1>Burger Barn</h1>
                <hr className="rectangle" />
                <button className="order-btn">
                    <a href="tel:(802)730-3441">Call to order</a>
                </button>
                <h4>or</h4>
                <h3>802-730-3441</h3>
                
                <div className="hours-container">
                  <h5 className="hours">{hours}</h5>
                  <h2>*CASH ONLY*</h2>
                </div>
                <div className="continue-btn-container">
                    <Link to="menu" className="continue-link" spy={true} smooth={true} duration={500}>
                        <i className="fas fa-angle-down"></i>
                    </Link>
                </div>
                
            </div>
            
            <div className="social-links">
                <a href="https://www.facebook.com/BurgerbarnVT/" className="social-link" target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook-f"></i>
                </a>
            </div>
            <hr className="header-line header-line-1" />
            <hr className="header-line header-line-2" />
            <hr className="header-line-vert header-line-vert-1" />
            <hr className="header-line-vert header-line-vert-2"/>
        </div>
  
        <div className="menu-wrapper">
            <div className="menu-container" id="menu">
                <div className="menu-heading">
                    <h2>Our Menu</h2>
                    <hr className="rectangle rectangle-menu" />
                    <button className="print-btn" onClick={printMenu}>Print Menu</button>
                    <h3>Local grass fed gourmet hamburgers & hand cut fries. <br /> 15+ different cheeses, fried food, call ahead for take out. BYOB.</h3>
                </div>
                <div className="menu-selection">
                    {categoryList.map((cat, index) => {
                        return (
                          <React.Fragment key={cat._id}>
                          <h5 className={"menu-select" + (menuSelection === cat.name ? ' active-menu' : '')} id={cat.name} onClick={updateMenuSelection}>{cat.displayName}</h5>
                          {index >= 0 && index < categoryList.length -1 ? <div className="menu-hr"></div> : null}
                          </React.Fragment>
                        )
                    })}
                </div>
                <div className="menu-items-container">
                {isLoading? <div className="menuLoading"><RotateLoader /></div> :
                  menu.error ? <div className="error-menu">{menu.error}</div> : 
                    <div className="menu active-menu-section">
                      {menu.filter(item => item.category === menuSelection).sort(sortItems).map((item,ind) => ( <MenuItem item={item} itemInd={ind} key={ind} />))}
                    </div>
                  }
                </div>
            </div>
        </div>
  
        <div className="photos-wrapper">
            <img src={burger_1} alt="a burger" className="gallery-photo gallery-photo-1" key="burger_1" />
            <img src={burger_3} alt="Outside of Burger Barn" className="gallery-photo gallery-photo-2" key="burger_3" />
            <img src={burger_2} alt="Fries" className="gallery-photo gallery-photo-4" key="burger_2" />
        </div>
  
        <iframe
            title="map"
            id="map"
            width="100%"
            height="600px"
            style={{"border":0}}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCOpy1kHsjfQ1fhffc0j22beWG_8iuBE2o&q=4968+VT-15,+Cambridge,+VT+05464">
        </iframe>
  
        <footer>
            <a href="https://github.com/nme077/burger-barn" rel="noreferrer">View GitHub project <i className="fab fa-github"></i></a>
            <div className="copyright">&copy; Copyright Nicholas Eveland {new Date().getFullYear()}</div>
        </footer>
        </div>
      </div>
    )
  }


  function MenuItem(item) {
    item = item.item;
  
    return(
      <div className="menu-item">
        <div className="menu-item-line-1">
            <span className="menu-item-name">{item.name ? item.name : ''}</span>
            {item.prices.map((price, ind) => {
               if(price[0] || price[1]) {
                return <span className="menu-item-price" key={ind}> .... { price[0] } {price[1]}</span>
               } else {
                 return null
               }
            })}
        </div>
        <div className="menu-item-description">{item.description ? item.description : ''}</div>
      </div>
    )
  }


export default Home