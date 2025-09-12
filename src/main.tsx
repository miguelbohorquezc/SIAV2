import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import AppRouter from '@/app/routes/AppRouter';
import './index.css';
import { initAuthListener } from './features/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';


store.dispatch(initAuthListener());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
