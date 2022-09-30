import { Provider as PaperProvider } from 'react-native-paper';
import Navbar from "./components/Navbar";

const App = () => {

  return (
    <PaperProvider>
      <Navbar />
    </PaperProvider>
  );
}

export default App;