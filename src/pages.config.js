import Home from './pages/Home';
import SavedScenarios from './pages/SavedScenarios';
import Comparison from './pages/Comparison';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SavedScenarios": SavedScenarios,
    "Comparison": Comparison,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};