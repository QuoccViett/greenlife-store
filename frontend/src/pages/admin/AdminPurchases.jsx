import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminPurchases = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [supplierId, setSupplierId] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([
    { productId: '', quantity: 1, importPrice: 0 }
  ]);

  useEffect(() => {
    if (userInfo?.token) {
      fetchPurchases();
      fetchSuppliersAndProducts();
    }
  }, [userInfo]);

  const fetchPurchases = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API}/purchases`, config);
      if (data.success) {
        setPurchases(data.purchases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliersAndProducts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [resSuppliers, resProducts] = await Promise.all([
        axios.get(`${API}/suppliers`, config),
        axios.get(`${API}/products`)
      ]);
      if (resSuppliers.data.success) setSuppliers(resSuppliers.data.suppliers);
      if (Array.isArray(resProducts.data)) setProducts(resProducts.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, importPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'productId') {
      const prod = products.find(p => p._id === value);
      if (prod) {
        updated[index].importPrice = prod.costPrice || prod.price || 0;
      }
    }

    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.importPrice || 0)), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) return alert('Vui lòng chọn nhà cung cấp');
    if (items.some(i => !i.productId)) return alert('Vui lòng chọn đầy đủ sản phẩm');

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`${API}/purchases`, {
        supplierId,
        items,
        note
      }, config);

      if (data.success) {
        alert('Tạo phiếu nhập thành công! Giá vốn và tồn kho đã được tự động cập nhật.');
        setIsModalOpen(false);
        setSupplierId('');
        setNote('');
        setItems([{ productId: '', quantity: 1, importPrice: 0 }]);
        fetchPurchases();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi tạo phiếu nhập');
    }
  };

  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhập Hàng & Giá Vốn</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
          >
            <FaPlus /> Tạo phiếu nhập hàng
          </button>
        </div>

        {/* Bảng danh sách phiếu nhập */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b text-gray-600 font-semibold text-sm">
              <tr>
                <th className="p-4">Mã phiếu</th>
                <th className="p-4">Nhà cung cấp</th>
                <th className="p-4">Ngày nhập</th>
                <th className="p-4">Số mặt hàng</th>
                <th className="p-4">Tổng tiền nhập</th>
                <th className="p-4 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center">Đang tải danh sách phiếu nhập...</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Chưa có phiếu nhập hàng nào</td></tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-emerald-700">{p.code}</td>
                    <td className="p-4 font-medium">{p.supplier?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{new Date(p.importDate).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">{p.items.length} sản phẩm</td>
                    <td className="p-4 font-bold text-amber-600">{formatVND(p.totalAmount)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedPurchase(p)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Tạo phiếu nhập */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-xl p-6 space-y-4 my-8">
              <h2 className="text-xl font-bold text-gray-800">Tạo phiếu nhập hàng mới</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Chọn nhà cung cấp *</label>
                  <select
                    required
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.phone || 'N/A'})</option>
                    ))}
                  </select>
                </div>

                {/* Danh sách mặt hàng nhập */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Sản phẩm nhập</label>
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                      <select
                        required
                        className="flex-1 border rounded-lg p-2 outline-none text-sm"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} (Tồn hiện tại: {p.stock})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="SL"
                        className="w-20 border rounded-lg p-2 text-sm"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />

                      <input
                        type="number"
                        min="0"
                        placeholder="Giá nhập"
                        className="w-32 border rounded-lg p-2 text-sm"
                        value={item.importPrice}
                        onChange={(e) => handleItemChange(index, 'importPrice', e.target.value)}
                      />

                      <div className="w-28 text-right font-semibold text-sm text-gray-700">
                        {formatVND(item.quantity * item.importPrice)}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <FaPlus /> Thêm dòng sản phẩm
                  </button>
                </div>

                <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                  <span>Tổng tiền phiếu nhập:</span>
                  <span className="text-amber-600">{formatVND(calculateTotal())}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú phiếu nhập</label>
                  <textarea
                    className="w-full border rounded-lg p-2 mt-1 text-sm outline-none"
                    rows="2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                  >
                    Xác nhận nhập hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xem chi tiết phiếu nhập */}
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h2 className="text-xl font-bold text-emerald-700">Phiếu nhập: {selectedPurchase.code}</h2>
                  <p className="text-sm text-gray-500">
                    NCC: {selectedPurchase.supplier?.name} | Ngày nhập: {new Date(selectedPurchase.importDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <button onClick={() => setSelectedPurchase(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-2">Sản phẩm</th>
                    <th className="p-2 text-center">Số lượng</th>
                    <th className="p-2 text-right">Đơn giá nhập</th>
                    <th className="p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedPurchase.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatVND(item.importPrice)}</td>
                      <td className="p-2 text-right font-semibold">{formatVND(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Tổng cộng:</span>
                <span className="text-amber-600">{formatVND(selectedPurchase.totalAmount)}</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedPurchase(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPurchases;