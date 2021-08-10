import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import storage from 'local-storage-fallback';
import GlobalStyles from '../globalStyle';
import styled, { ThemeProvider } from 'styled-components';
//Components
import Header from '../Header/Header';
import SideDrawerDesktop from '../SideDrawer/SideDrawerDesktop';
import StorePage from '../StorePage/StorePage';
import CategoryPage from '../categoryPage/CategoryPage';
import PurchasesPage from '../purchasesPage/PurchasesPage';
import authArea from '../authArea/AuthArea';
import UserProfile from '../userSection/UserProfile';
import ItemPage from '../ItemPage/ItemPage';
import CartPage from '../cartPage/CartPage';
import Result from '../Result/Result';
//DdContent
import whatIsGiftCard from '../ddContent/whatIsGiftCard';
import faq from '../ddContent/faq';
import contactUs from '../ddContent/contactUs';
import learn from '../ddContent/learn';

const LightTheme = {
  Status:true,
  BlackGray: '#000', // Icons
  GrayGray: '#CECECE',
  GrayGrayR: '#A8A8A8',
  OrangePurple: '#FF9575',
  GrayWhite: '#F3F4F7', //Border
  ShopCard: '#7F7F7F',
  ShopCardPadding: '#F6F7F8',
  BackGround: '#FFFFFF',
  BlackWhite: "#000000",
  WhiteBlack: '#FFFFFF',
  BlackGray: '#000000',

}

const DarkTheme = {
  Status:false,
  BlackGray: '#A8A8A8',
  GrayGray: '#A8A8A8',
  GrayGrayR: '#CECECE',
  OrangePurple: '#BB86FC',
  GrayWhite: '#FFFFFF',
  ShopCard: 'EDEDED',
  ShopCardPadding: '#1E1E1E',
  BackGround: '#121212',
  BlackWhite: "#FFFFFF",
  WhiteBlack: '#000000',
  BlackGray: '#CECECE',

}

const themes = {
  light: LightTheme,
  dark: DarkTheme,
}

const AppContainer = styled.div`
  display: flex;
  flex-flow: row wrap;

  @media only screen and (max-width: 769px) {
    grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
    }

`;

function App() {
  const getInitialTheme = () => {
    const savedTheme = storage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : { mode: 'light' };
  };
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => {
    storage.setItem('theme', JSON.stringify(theme))
  }, [theme]);
  const themeHandler = () => {
    setTheme(theme.mode === 'dark' ? { mode: 'light' } : { mode: 'dark' })
  };

  return (
    <Router>
      <Switch>
      <ThemeProvider theme={themes[theme.mode]}>
        <AppContainer>
          <GlobalStyles />
            <SideDrawerDesktop themeStatus={theme} darkModeToggle={themeHandler} />
            <Header themeStatus={theme} darkModeToggle={themeHandler} />
            <Route path="/" exact component={StorePage} />
            <Route path="/category" exact component={CategoryPage} />
            <Route path="/category/id/:pid" exact component={ItemPage} />
            <Route path="/purchases" exact component={PurchasesPage} />
            <Route path="/cart" exact component={CartPage} />
            <Route path="/result" exact component={Result} />
            <Route path="/what-is-giftcard" component={whatIsGiftCard} />
            <Route path="/faq" exact  component={faq} />
            <Route path="/contact-us" exact component={contactUs} />
            <Route path="/learn" exact  component={learn} />
            <Route path="/auth" exact component={authArea} />
            <Route path="/profile" exact component={UserProfile} />
        </AppContainer>
      </ThemeProvider>
      </Switch>
    </Router>
  );
}

export default App;
