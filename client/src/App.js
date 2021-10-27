import './App.css';
import * as Scroll from 'react-scroll';
import React, { useEffect, useState } from 'react';
import burger_1 from './assets/burger-1.jpeg'
import burger_2 from './assets/burger-2.jpeg'
import burger_3 from './assets/burger-3.jpeg'


let Link      = Scroll.Link;

function App() {

  return (
    <Home menu />
  );
}

function Admin() {
  return (
    <div className="App">
      <div className="wrapper">
        <div id="sidebar">
            <div className="sidebar-heading">
                <i className="fas fa-hamburger sidebar-heading-icon"></i>
                <h3 className="sidebar-heading-title">Admin Panel</h3>
            </div>
            <div className="sidebar-selection-container">
                <a className="sidebar-selection active" href="#menu">
                    <i className="fas fa-utensils sidebar-selection-icon"></i> Menu
                </a>
                <a className="sidebar-selection" href="#hours">
                    <i className="far fa-clock sidebar-selection-icon"></i> Hours
                </a>
            </div>
        </div>

        <div className="main">
            <div className="main-container">
                
            </div>
        </div>
      </div>
    </div>
  );
}

function Home(data) {
  const [menu, setMenu] = useState([])
  const [menuSelection, setMenuSelection] = useState('hamburgers');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
		fetch('http://localhost:9000/api/getMenu')
			.then((res) => res.json())
			.then((data) => {
        setIsLoaded(true);
        setMenu(data);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      })
	}, [])

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
              <h6>Restaurant</h6>
              <div className="break"></div>
              <h1>Burger Barn</h1>
              <div className="break"></div>
              <hr className="rectangle" />
              <div className="break"></div>
              <button className="order-btn">
                  <a href="tel:(802)730-3441">Call to order</a>
              </button>
              <div className="break"></div>
              <div className="hours">Mon - Sat 11AM - 10PM, Sun: 12PM - 9PM</div>
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
                  <div className="menu active-menu-section">
                    {menu.filter(item => item.category === menuSelection).map((item,ind) => ( <MenuItem item={item} ind={ind} />))}
                  </div>
              </div>
          </div>
      </div>

      <div className="photos-wrapper">
          <img src={burger_1} alt="" className="gallery-photo gallery-photo-1" />
          <img src={burger_3} alt="" className="gallery-photo gallery-photo-2" />
          <img src={burger_2} alt="" className="gallery-photo gallery-photo-4" />
      </div>

      <iframe
          title="map"
          id="map"
          width="100%"
          height="600px"
          style={{"border":0}}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCOpy1kHsjfQ1fhffc0j22beWG_8iuBE2o&q=Burger+barn+vermont">
      </iframe>

      <footer>
          <div className="copyright">&copy; Copyright Nicholas Eveland {new Date().getFullYear()}</div>
      </footer>
      </div>
    </div>
  )
}

function MenuItem(item, ind) {
  item = item.item;

  return(
    <div className="menu-item">
      <div className="menu-item-line-1">
          <span className="menu-item-name">{item.name ? item.name : ''}</span>
          { item.price ? item.price.map((price, ind) => (
              <span className="menu-item-price" key={ind}>.... { Object.keys(price) } {Object.values(price)} </span>
          )) : '' }
      </div>
      <div className="menu-item-description">{item.description ? item.description : ''}</div>
    </div>
  )
}

export default App;
