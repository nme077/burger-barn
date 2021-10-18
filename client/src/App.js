import './App.css';
import React, { useEffect, useState } from 'react';


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

  return(
    <div className="App">
      <div className="wrapper">
      <div className="header">
          <div className="navbar">
              <a href="#menu" className="nav-link">Menu</a>
              <div className="header-logo">
                  <i className="fas fa-hamburger"></i>
              </div>
              <a href="#map" className="nav-link">Map</a>
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
                  <a href="#menu" className="continue-link">
                      <i className="fas fa-angle-down"></i>
                  </a>
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
          <hr className="header-line-vert-mid" />
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
                  <h5 className="menu-select active-menu" id="hamburgers">Hamburgers</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="seafood">Seafood</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="fried">Fried Stuff</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="egg">Egg Sandwiches</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="veggie">Veggie Options</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="sandwiches">Sandwiches</h5>
                  <div className="menu-hr"></div>
                  <h5 className="menu-select" id="dogs">Dogs</h5>
              </div>
              <div className="menu-items-container">
                  <div className="menu hamburgers active-menu-section">
                    {menu.map(item => ( item.category === 'hamburgers' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu seafood inactive-menu-section">
                    {menu.map(item => ( item.category === 'seafood' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu fried inactive-menu-section">
                    {menu.map(item => ( item.category === 'fried' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu egg inactive-menu-section">
                    {menu.map(item => ( item.category === 'egg' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu veggie inactive-menu-section">
                    {menu.map(item => ( item.category === 'veggie' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu sandwiches inactive-menu-section">
                    {menu.map(item => ( item.category === 'sandwiches' ? <MenuItem item={item} /> : null))}
                  </div>

                  <div className="menu dogs inactive-menu-section">
                    {menu.map(item => ( item.category === 'dogs' ? <MenuItem item={item} /> : null))}
                  </div>

              </div>
          </div>
      </div>

      <div className="photos-wrapper">
          <img src="/assets/images/burger-1.jpeg" alt="" className="gallery-photo gallery-photo-1" />
          <img src="/assets/images/burger-3.jpeg" alt="" className="gallery-photo gallery-photo-2" />
          <img src="/assets/images/burger-2.jpeg" alt="" className="gallery-photo gallery-photo-4" />
      </div>

      <iframe
          title="map"
          id="map"
          width="100%"
          height="600px"
          style={{"border":0}}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCOpy1kHsjfQ1fhffc0j22beWG_8iuBE2o
              &q=Burger+barn+vermont">
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
          { item.price ? item.price.map(price => (
              <span className="menu-item-price">.... { Object.keys(price) } {Object.values(price)} </span>
          )) : '' }
      </div>
      <div className="menu-item-description">{item.description ? item.description : ''}</div>
    </div>
  )
}

export default App;
