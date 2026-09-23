import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminSuppliers = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    if (userInfo?.token) fetchSuppliers();
  }, [search, userInfo]);

  const fetchSuppliers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API}/suppliers?search=${search}`, config);
      if (data.success) {
        setSuppliers(data.suppliers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        note: supplier.note || ''
      });
    } else {
      setEditingSupplier(null);
      setFormData({ name: '', phone: '', email: '', address: '', note: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingSupplier) {
        await axios.put(`${API}/suppliers/${editingSupplier._id}`, formData, config);
      } else {
        await axios.post(`${API}/suppliers`, formData, config);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa hoặc chuyển trạng thái nhà cung cấp này?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${API}/suppliers/${id}`, config);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa nhà cung cấp');
    }
  };

  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhà Cung Cấp</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
          >
            <FaPlus /> Thêm nhà cung cấp
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, sđt, email..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bảng danh sách */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b text-gray-600 font-semibold text-sm">
              <tr>
                <th className="p-4">Tên nhà cung cấp</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Email</th>
                <th className="p-4">Địa chỉ</th>
                <th className="p-4">Số đợt nhập</th>
                <th className="p-4">Tổng tiền đã nhập</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center">Đang tải dữ liệu...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">Chưa có nhà cung cấp nào</td></tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-800">{s.name}</td>
                    <td className="p-4 text-gray-600">{s.phone || '-'}</td>
                    <td className="p-4 text-gray-600">{s.email || '-'}</td>
                    <td className="p-4 text-gray-600">{s.address || '-'}</td>
                    <td className="p-4 font-medium">{s.totalOrders} đợt</td>
                    <td className="p-4 font-semibold text-emerald-600">{formatVND(s.totalSpent)}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => handleOpenModal(s)} className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Thêm / Sửa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp *</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                  <textarea
                    className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    rows="2"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSuppliers;