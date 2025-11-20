import Home from './pages/Home';
import Premium from './pages/Premium';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Account from './pages/Account';
import About from './pages/About';
import Calculator from './pages/Calculator';
import CaseReview from './pages/CaseReview';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Premium": Premium,
    "PaymentSuccess": PaymentSuccess,
    "PaymentCancel": PaymentCancel,
    "Account": Account,
    "About": About,
    "Calculator": Calculator,
    "CaseReview": CaseReview,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};