import About from './pages/About';
import Account from './pages/Account';
import Calculator from './pages/Calculator';
import CaseReview from './pages/CaseReview';
import Home from './pages/Home';
import PaymentCancel from './pages/PaymentCancel';
import PaymentSuccess from './pages/PaymentSuccess';
import Premium from './pages/Premium';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Account": Account,
    "Calculator": Calculator,
    "CaseReview": CaseReview,
    "Home": Home,
    "PaymentCancel": PaymentCancel,
    "PaymentSuccess": PaymentSuccess,
    "Premium": Premium,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};