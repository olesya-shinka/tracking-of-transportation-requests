import { useState } from "react";
import { Order } from "../../App";

interface ModalEditProps {
  handleCloseModalEdit: () => void;
  handleEdit: (editedOrder: Order) => void;
  order: Order;
}

function ModalEdit({
  handleCloseModalEdit,
  handleEdit,
  order,
}: ModalEditProps) {
  const [editedOrder, setEditedOrder] = useState<Order>({ ...order });
  const [newStatus, setNewStatus] = useState<string>(order.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedOrder: Order = {
      ...editedOrder,
      status: newStatus,
    };
    handleEdit(updatedOrder);
    handleCloseModalEdit();
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Редактирование заказа</h2>
        <label className="modal-label">
          Дата:
          <input
            className="modal-input"
            type="date"
            name="date"
            value={editedOrder.date}
            onChange={handleChange}
          />
        </label>
        <label className="modal-label">
          Клиент:
          <input
            className="modal-input"
            type="text"
            name="client"
            value={editedOrder.client}
            onChange={handleChange}
          />
        </label>
        <label className="modal-label">
          Перевозчик:
          <input
            className="modal-input"
            type="text"
            name="carrier"
            value={editedOrder.carrier}
            onChange={handleChange}
          />
        </label>
        <label className="modal-label">
          Телефон:
          <input
            className="modal-input"
            type="phone"
            name="phone"
            value={editedOrder.phone}
            onChange={handleChange}
          />
        </label>
        <label className="modal-label">
          Новый статус:
          <select
            className="modal-input"
            name="status"
            value={newStatus}
            onChange={handleStatusChange}
          >
            <option value="новый">Новый</option>
            <option value="в работе">В работе</option>
            <option value="завершено">Завершено</option>
          </select>
        </label>
        <label className="modal-label">
          ATI Code:
          <input
            className="modal-input"
            type="text"
            name="atiCode"
            value={editedOrder.atiCode}
            onChange={handleChange}
          />
        </label>
        <label className="modal-label">
          Комментарий:
          <input
            className="modal-input"
            type="text"
            name="comments"
            value={editedOrder.comments}
            onChange={handleChange}
          />
        </label>
        <div className="modal-box-btn">
          <button className="modal-button" onClick={handleSave}>
            Сохранить заказ
          </button>
          <button className="modal-button" onClick={handleCloseModalEdit}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdit;
