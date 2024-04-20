import { useState } from "react";
import { Order } from "../../App";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { addOrder } from "../../store/slice/orderSlice";

interface ModalAddProps {
  handleCloseModal: () => void;
  handleOpenModal: () => void;
  filteredOrders: Order[];
  hideCompleted: boolean;
  setFilteredOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setFilteredAndHiddenOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

function ModalAdd({
  handleCloseModal,
  handleOpenModal,
  filteredOrders,
  hideCompleted,
  setFilteredOrders,
  setFilteredAndHiddenOrders,
}: ModalAddProps) {
  const dispatch = useDispatch();
  const [date, setDate] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<string>("новый");
  const [atiCode, setAtiCode] = useState<string>("");
  const orders = useSelector((state: RootState) => state.orders);

  const handleCreate = () => {
    if (
      date.length < 3 ||
      client.length < 3 ||
      carrier.length < 3 ||
      phone.length < 3 ||
      status.length < 3 ||
      atiCode.length < 3
    ) {
      alert("Все поля должны содержать минимум 3 символа");
      return;
    }

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

    const updatedFilteredOrders = [...filteredOrders, orderToAdd].filter(
      (order) => {
        if (hideCompleted) {
          return order.status !== "завершено";
        }
        return true;
      }
    );
    setFilteredOrders(updatedFilteredOrders);

    const updatedFilteredAndHiddenOrders = [...updatedFilteredOrders];
    setFilteredAndHiddenOrders(updatedFilteredAndHiddenOrders);

    setDate("");
    setCarrier("");
    setClient("");
    setPhone("");
    setComment("");
    setAtiCode("");
    handleCloseModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Создание новой заявки</h2>
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
            defaultValue={status}
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
  );
}

export default ModalAdd;
