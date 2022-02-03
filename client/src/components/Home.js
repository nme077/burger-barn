import * as Scroll from 'react-scroll';
import React, { useState, useEffect } from 'react';
import httpRequestUrl from '../httpRequestUrl';

import burger_1 from '../assets/burger-1.jpeg'
import burger_2 from '../assets/burger-2.jpeg'
import burger_3 from '../assets/burger-3.jpeg'

let Link = Scroll.Link;

const sortItems = (a,b) => {
  return a.order - b.order
}

function Home() {
    const [menu, setMenu] = useState([]);
    const [menuSelection, setMenuSelection] = useState('hamburgers');
  
    // Fetch the menu
    function getMenu() {
      fetch(httpRequestUrl + '/api/menu')
        .then((res) => res.json())
        .then((data) => {
          setMenu(data.menu);
        })
        .catch((err) => {
          setMenu({error: 'Error fetching Menu'});
      })
    }

    // Initialize the menu
    useEffect(() => {
      getMenu();
    },[]);
  
    function updateMenuSelection(e) {
      e.preventDefault();
      const category = e.target.getAttribute('id');
      e.target.classList.add('active-menu')
  
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
                <div className="break"></div>
                <h1>Burger Barn</h1>
                <div className="break"></div>
                <hr className="rectangle" />
                <div className="break"></div>
                <button className="order-btn">
                    <a href="tel:(802)730-3441">Call to order</a>
                </button>
                <div className="break"></div>
                <div className="hours-container">
                  <h5 className="hours">Mon - Sat 11AM - 10PM, Sun: 12PM - 9PM</h5>
                </div>
                <div className="break"></div>
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
                    <div className="break"></div>
                    <hr className="rectangle rectangle-menu" />
                    <div className="break"></div>
                    <h3>Local grass fed gourmet hamburgers & hand cut fries. <br /> 15+ different cheeses, fried food, call ahead for take out. BYOB.</h3>
                </div>
                <div className="menu-selection">
                    <h5 className={"menu-select" + (menuSelection === 'hamburgers' ? ' active-menu' : '')} id="hamburgers" onClick={updateMenuSelection}>Hamburgers</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'seafood' ? ' active-menu' : '')} id="seafood" onClick={updateMenuSelection}>Seafood</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'fried' ? ' active-menu' : '')} id="fried" onClick={updateMenuSelection}>Fried Stuff</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'egg' ? ' active-menu' : '')} id="egg" onClick={updateMenuSelection}>Egg Sandwiches</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'veggie' ? ' active-menu' : '')} id="veggie" onClick={updateMenuSelection}>Veggie Options</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'sandwiches' ? ' active-menu' : '')} id="sandwiches" onClick={updateMenuSelection}>Sandwiches</h5>
                    <div className="menu-hr"></div>
                    <h5 className={"menu-select" + (menuSelection === 'dogs' ? ' active-menu' : '')} id="dogs" onClick={updateMenuSelection}>Dogs</h5>
                </div>
                <div className="menu-items-container">
                  {menu.error ? <div className="error-menu">{menu.error}</div> : 
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