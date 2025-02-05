import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './Store/Auth.jsx';
import { CategoriesContextProvider } from './Store/CategoryStore.jsx';


createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <CategoriesContextProvider>
      <StrictMode>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition:Bounce
        />
      </StrictMode>
      </CategoriesContextProvider>
  </AuthContextProvider>

)
