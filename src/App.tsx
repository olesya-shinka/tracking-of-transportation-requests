import "./App.css";
import Main from "./components/main";

export interface Order {
  id: number;
  date: string;
  client: string;
  carrier: string;
  phone: string;
  comments: string;
  status: string;
  atiCode: string;
}

const App: React.FC = () => {
  return <Main />;
};

export default App;
