import Home from './pages/Home';
import SavedScenarios from './pages/SavedScenarios';
import Comparison from './pages/Comparison';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SavedScenarios": SavedScenarios,
    "Comparison": Comparison,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};