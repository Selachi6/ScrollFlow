import { Search } from './pages/Search.tsx';
import { Overview } from './pages/Overview.tsx';
import { Address } from './pages/Address.tsx';

export const App = () => {
  console.log(!window.location.search);
  return (
    <div>
      {window.location.search.includes('?address=') && <Address />}
      {window.location.search.includes('?overview=true') && <Overview />}
      {!window.location.search && <Search />}
    </div>
  );
};
