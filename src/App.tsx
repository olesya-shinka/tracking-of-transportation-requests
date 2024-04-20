import { useEffect, useState } from "react";
import "./App.css";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { TfiComments } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import {
  addOrder,
  deleteOrder,
  editOrder,
  saveOrdersToLocalStorage,
} from "./store/slice/orderSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import ModalEdit from "./components/modal";

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
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<string>("новый");
  const [atiCode, setAtiCode] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);


  useEffect(() => {
    const storedOrders = localStorage.getItem("ordersState");
    if (storedOrders) {
      dispatch(saveOrdersToLocalStorage(JSON.parse(storedOrders)));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(saveOrdersToLocalStorage());
    setFilteredOrders(orders);
  }, [orders]);

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

  const handleDelete = (id: number) => {
    dispatch(deleteOrder(id));
  };

  const handleEdit = (editedOrder: Order) => {
    dispatch(editOrder(editedOrder));
  };

  const handleCreate = () => {
    const newId = orders.length + 1;
    const orderToAdd: Order = {
      id: newId,
      date,
      client,
      carrier,
      phone,
      comments: comment,
      status,
      atiCode,
    };
    dispatch(addOrder(orderToAdd));
    handleOpenModal();
    setFilteredOrders([...filteredOrders, orderToAdd]);
    setDate("");
    setCarrier("");
    setClient("");
    setPhone("");
    setComment("");
    setAtiCode("");
    handleCloseModal();
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModalEdit = (order: Order) => {
    setSelectedOrder(order);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
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
        <h1>
          ЗАКАЗЫ <span>{filteredOrders.length}</span>
        </h1>
        <div className="content-box">
          <input
            type="text"
            placeholder="Поиск по клиентам"
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
            <button className="content-box-btn" onClick={handleOpenModal}>
              Создать заказ
            </button>
          )}
          {openModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Создание нового заказа</h2>
                <label className="modal-label">
                  Дата:
                  <input
                    className="modal-input"
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  Клиент:
                  <input
                    className="modal-input"
                    type="text"
                    name="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  Перевозчик:
                  <input
                    className="modal-input"
                    type="text"
                    name="carrier"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  Телефон:
                  <input
                    className="modal-input"
                    type="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  Статус:
                  <input
                    className="modal-input"
                    type="text"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  ATI Code:
                  <input
                    className="modal-input"
                    type="text"
                    name="atiCode"
                    value={atiCode}
                    onChange={(e) => setAtiCode(e.target.value)}
                  />
                </label>
                <label className="modal-label">
                  Комментарий:
                  <input
                    className="modal-input"
                    type="text"
                    name="comments"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </label>
                <div className="modal-box-btn">
                  <button className="modal-button" onClick={handleCreate}>
                    Создать заказ
                  </button>
                  <button className="modal-button" onClick={handleCloseModal}>
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
            {filteredOrders.map((order, id) => (
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
                    <FiEdit onClick={() => handleOpenModalEdit(order)} />
                    {openModalEdit && selectedOrder && (
                      <ModalEdit
                        handleCloseModalEdit={handleCloseModalEdit}
                        handleEdit={handleEdit}
                        order={selectedOrder}
                      />
                    )}
                    <AiOutlineDelete onClick={() => handleDelete(order.id)} />
                    <div className="tooltip-container">
                      {order.comments.length === 0 ? (
                        <span className="tooltip-text">Нет комментария</span>
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
