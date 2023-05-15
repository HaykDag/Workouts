import { RouterProvider } from 'react-router-dom'
import MyRouter from './hooks/useRouter'



function App() {
  const myRouter = MyRouter();
  return (
      <div className="App">
        <RouterProvider router={myRouter} />
      </div>
  );
}

export default App;
