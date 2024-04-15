import { useState } from "react";
import { ordersData } from "./mocks";
import "./App.css";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { TfiComments } from "react-icons/tfi";
import { useDispatch } from "react-redux";

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
  //const orders = useSelector((state: any) => state.orders);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [newOrder, setNewOrder] = useState<Order>({
    id: 0,
    date: "",
    client: "",
    carrier: "",
    phone: "",
    comments: "",
    status: "новый",
    atiCode: "",
  });
  const [creatingOrder, setCreatingOrder] = useState<boolean>(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = orders.filter((order) =>
      Object.values(order).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    const filtered = status
      ? orders.filter((order) => order.status === status)
      : orders;
    setFilteredOrders(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleDelete = (id: number) => {};

  const handleEdit = (id: number) => {};

  const handleCreate = () => {
    const id = orders.length + 1;
    const orderToAdd: Order = { ...newOrder, id };
    setCreatingOrder(true);
    setOrders([...orders, orderToAdd]);
    setNewOrder({
      id: 0,
      date: "",
      client: "",
      carrier: "",
      phone: "",
      comments: "",
      status: "новый",
      atiCode: "",
    });
    setCreatingOrder(false);
  };

  return (
    <div className="App">
      <div className="switch-box">
        <p>АДМИНИСТРАТОР</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={isAdminMode}
            onChange={(e) => setIsAdminMode(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="content">
        <h1>ЗАКАЗЫ</h1>
        <div className="content-box">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="content-box-input"
          />
          <select
            value={statusFilter || ""}
            onChange={(e) => handleStatusFilter(e.target.value || null)}
            className="content-box-select"
          >
            <option value="">Все</option>
            <option value="новая">Новый</option>
            <option value="в работе">В работе</option>
            <option value="завершено">Завершено</option>
          </select>
          {isAdminMode && (
            <button className="content-box-btn" onClick={handleCreate}>
              Создать заказ
            </button>
          )}
          {creatingOrder && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Создание нового заказа</h2>
                <label className="modal-label">
                  Дата:
                  <input
                    className="modal-input"
                    type="date"
                    name="date"
                    value={newOrder.date}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  Клиент:
                  <input
                    className="modal-input"
                    type="text"
                    name="client"
                    value={newOrder.client}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  Перевозчик:
                  <input
                    className="modal-input"
                    type="text"
                    name="carrier"
                    value={newOrder.carrier}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  Телефон:
                  <input
                    className="modal-input"
                    type="phone"
                    name="phone"
                    value={newOrder.phone}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  Статус:
                  <input
                    className="modal-input"
                    type="text"
                    name="status"
                    value={newOrder.status}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  ATI Code:
                  <input
                    className="modal-input"
                    type="text"
                    name="atiCode"
                    value={newOrder.atiCode}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal-label">
                  Комментарий:
                  <input
                    className="modal-input"
                    type="text"
                    name="comments"
                    value={newOrder.comments}
                    onChange={handleInputChange}
                  />
                </label>
                <div className="modal-box-btn">
                  <button className="modal-button" onClick={handleCreate}>
                    Создать заказ
                  </button>
                  <button
                    className="modal-button"
                    onClick={() => setCreatingOrder(false)}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ДАТА</th>
              <th>КЛИЕНТ</th>
              <th>ПЕРЕВОЗЧИК</th>
              <th>ТЕЛЕФОН</th>
              <th>СТАТУС</th>
              <th>ATI Code</th>
              {isAdminMode && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.client}</td>
                <td>{order.carrier}</td>
                <td>{order.phone}</td>
                <td>{order.status}</td>
                <td>
                  <a
                    href={`https://ati.su/firms/${order.atiCode}/info`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {order.atiCode}
                  </a>
                </td>
                {isAdminMode && (
                  <td className="td-actions">
                    <FiEdit onClick={(id) => handleEdit} />
                    <AiOutlineDelete onClick={(id) => handleDelete} />
                    <div className="tooltip-container">
                      {order.comments.length === 0 ? (
                        <span className="tooltip-text">Нет описания</span>
                      ) : (
                        <span className="tooltip-text">{order.comments}</span>
                      )}
                      <TfiComments />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
