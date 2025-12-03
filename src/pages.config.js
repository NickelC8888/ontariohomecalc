import Home from './pages/Home';
import SavedScenarios from './pages/SavedScenarios';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "SavedScenarios": SavedScenarios,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};