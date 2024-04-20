import { useEffect, useState } from "react";
import "../../App.css";
import { Order } from "../../App";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ModalEdit from "../modal";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { TfiComments } from "react-icons/tfi";
import {
  deleteOrder,
  editOrder,
  saveOrdersToLocalStorage,
} from "../../store/slice/orderSlice";
import ModalAdd from "../modal/indexNew";

function Main() {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [filteredAndHiddenOrders, setFilteredAndHiddenOrders] =
    useState<Order[]>(orders);
  useEffect(() => {
    const storedOrders = localStorage.getItem("ordersState");
    if (storedOrders) {
      dispatch(saveOrdersToLocalStorage(JSON.parse(storedOrders)));
    }
    dispatch(saveOrdersToLocalStorage());
    setFilteredAndHiddenOrders(orders);
  }, [dispatch, orders]);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    if (hideCompleted) {
      filtered = filtered.filter((order) => order.status !== "завершено");
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, hideCompleted]);

  useEffect(() => {
    let filtered = filteredOrders;
    if (hideCompleted) {
      filtered = filtered.filter((order) => order.status !== "завершено");
    }
    setFilteredAndHiddenOrders(filtered);
  }, [filteredOrders, hideCompleted]);
  const handleHideCompletedChange = () => {
    setHideCompleted(!hideCompleted);
    setFilteredAndHiddenOrders(
      !hideCompleted
        ? filteredOrders.filter((order) => order.status !== "завершено")
        : filteredOrders
    );
  };

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
    setFilteredAndHiddenOrders(
      hideCompleted
        ? filtered.filter((order) => order.status !== "завершено")
        : filtered
    );
  };

  const handleDelete = (id: number) => {
    dispatch(deleteOrder(id));

    const updatedFilteredOrders = filteredOrders.filter(
      (order) => order.id !== id
    );
    setFilteredOrders(updatedFilteredOrders);

    const updatedFilteredAndHiddenOrders = filteredAndHiddenOrders.filter(
      (order) => order.id !== id
    );
    setFilteredAndHiddenOrders(updatedFilteredAndHiddenOrders);
  };

  const handleEdit = (editedOrder: Order) => {
    dispatch(editOrder(editedOrder));
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
          ЗАЯВКИ <span>{filteredOrders.length}</span>
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
            <option value="в работе">В работе</option>
            <option value="завершено">Завершено</option>
          </select>
          <label className="label-completed">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={handleHideCompletedChange}
            />
            Скрыть завершенные заявки
          </label>
          {isAdminMode && (
            <button className="content-box-btn" onClick={handleOpenModal}>
              Создать заказ
            </button>
          )}
          {openModal && (
            <ModalAdd
              handleCloseModal={handleCloseModal}
              handleOpenModal={handleOpenModal}
              filteredOrders={filteredOrders}
              hideCompleted={hideCompleted}
              setFilteredOrders={setFilteredOrders}
              setFilteredAndHiddenOrders={setFilteredAndHiddenOrders}
            />
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
            {filteredAndHiddenOrders.map((order, id) => (
              <tr key={id}>
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
                    <FiEdit
                      onClick={() => handleOpenModalEdit(order)}
                      style={{ cursor: "pointer" }}
                    />
                    {openModalEdit && selectedOrder && (
                      <ModalEdit
                        handleCloseModalEdit={handleCloseModalEdit}
                        handleEdit={handleEdit}
                        order={selectedOrder}
                      />
                    )}
                    <AiOutlineDelete
                      onClick={() => handleDelete(order.id)}
                      style={{ cursor: "pointer" }}
                    />
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
}

export default Main;
