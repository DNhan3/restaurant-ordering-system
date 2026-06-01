import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ImagePlus, LogOut, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { foodService } from '../services/api';
import { CATEGORIES } from '../utils/constants';

const initialFoodForm = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'pho',
  isAvailable: true,
};

export default function AdminDishesPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [foodImageFile, setFoodImageFile] = useState(null);
  const [foodImagePreview, setFoodImagePreview] = useState('');
  const [isSavingFood, setIsSavingFood] = useState(false);
  const [foodMessage, setFoodMessage] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }

    loadFoods();
  }, [admin, navigate]);

  const loadFoods = async () => {
    try {
      const data = await foodService.getAll();
      setFoods(data);
    } catch (error) {
      console.error('Failed to load foods:', error);
    }
  };

  const handleFoodInputChange = (event) => {
    const { name, value } = event.target;
    setFoodForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFoodImageChange = (event) => {
    const file = event.target.files?.[0];
    setFoodImageFile(file || null);
    setFoodImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmitFood = async (event) => {
    event.preventDefault();
    setFoodMessage('');

    try {
      setIsSavingFood(true);
      let image = foodForm.image;

      if (foodImageFile) {
        const upload = await foodService.uploadImage(foodImageFile);
        image = upload.imageUrl;
      }

      const payload = {
        name: foodForm.name.trim(),
        price: Number(foodForm.price),
        description: foodForm.description.trim(),
        image,
        category: foodForm.category,
        isAvailable: foodForm.isAvailable,
      };

      if (editingFoodId) {
        await foodService.update(editingFoodId, payload);
        setFoodMessage('Món ăn cập nhật thành công.');
      } else {
        await foodService.create(payload);
        setFoodMessage('Món ăn tạo thành công.');
      }

      resetFoodForm();
      await loadFoods();
    } catch (error) {
      console.error('Failed to create food:', error);
      setFoodMessage(error.response?.data?.message || 'Không thể tạo món ăn.');
    } finally {
      setIsSavingFood(false);
    }
  };

  const resetFoodForm = () => {
    setFoodForm(initialFoodForm);
    setFoodImageFile(null);
    setFoodImagePreview('');
    setEditingFoodId(null);
  };

  const handleEditFood = (food) => {
    setEditingFoodId(food.food_id);
    setFoodForm({
      name: food.food_name || '',
      price: food.food_price || '',
      description: food.food_desc || '',
      image: food.food_image || '',
      category: food.food_category || 'pho',
      isAvailable: food.food_available ?? true,
    });
    setFoodImageFile(null);
    setFoodImagePreview('');
    setFoodMessage('');
  };

  const handleDeleteFood = async (food) => {
    const confirmed = window.confirm(`Xóa món ăn "${food.food_name}"?`);
    if (!confirmed) return;

    try {
      await foodService.remove(food.food_id);
      if (editingFoodId === food.food_id) {
        resetFoodForm();
      }
      setFoodMessage('Món ăn đã bị xóa.');
      await loadFoods();
    } catch (error) {
      console.error('Failed to delete food:', error);
      setFoodMessage(error.response?.data?.message || 'Không thể xóa món ăn.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-brown-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Quản Lý Hóa Đơn & Đơn Hàng
              </Link>
              <h1 className="text-2xl font-bold">Thêm Món Án Tùy Chỉnh</h1>
              <p className="text-brown-300 mt-1">Tạo các món trong thực đơn với tải hình ánh và chi tiết món ăn.</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-light transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-brown-900">
                    {editingFoodId ? 'Chỉnh Sửa Món Án' : 'Tạo Món Án'}
                  </h2>
                  <p className="text-sm text-brown-500 mt-1">Tải lên hình thu nhỏ và lưu nó cùng với món trong menu.</p>
                </div>
                {editingFoodId && (
                  <button
                    type="button"
                    onClick={resetFoodForm}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-brown-200 text-brown-600 hover:bg-brown-50"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitFood} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Tên Món Án</label>
                  <input
                    type="text"
                    name="name"
                    value={foodForm.name}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={foodForm.price}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={foodForm.category}
                    onChange={handleFoodInputChange}
                    className="input-field"
                  >
                    {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-brown-200 px-4 py-3 text-brown-700">
                  <input
                    type="checkbox"
                    checked={foodForm.isAvailable}
                    onChange={(event) =>
                      setFoodForm((current) => ({
                        ...current,
                        isAvailable: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary"
                  />
                  Available to customers
                </label>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Thumbnail</label>
                  <label className="flex items-center justify-center gap-2 h-12 px-4 border-2 border-dashed border-brown-200 rounded-lg text-brown-600 hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-sm font-medium">{foodImageFile ? foodImageFile.name : 'Choose image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFoodImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brown-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={foodForm.image}
                    onChange={handleFoodInputChange}
                    className="input-field"
                    placeholder="Optional when uploading a file"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brown-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={foodForm.description}
                    onChange={handleFoodInputChange}
                    className="input-field min-h-[96px]"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingFood}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingFood ? 'Saving...' : editingFoodId ? 'Update Dish' : 'Save Dish'}
                  </button>
                  {foodMessage && (
                    <span className="text-sm text-brown-600">{foodMessage}</span>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:w-1/3">
              <div className="aspect-square rounded-xl overflow-hidden bg-brown-100 mb-4">
                {foodImagePreview || foodForm.image ? (
                  <img
                    src={foodImagePreview || foodForm.image}
                    alt="Food thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brown-400">
                    <ImagePlus className="w-12 h-12" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-brown-900 mb-3">Dishes</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {foods.slice().reverse().map((food) => (
                  <div key={food.food_id} className="flex items-center gap-3">
                    <img
                      src={food.food_image || '/images/placeholder-food.png'}
                      alt={food.food_name}
                      className="w-12 h-12 rounded-lg object-cover bg-brown-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-brown-900 truncate">{food.food_name}</p>
                      <p className="text-xs text-brown-500">
                        {food.food_category} - {food.food_available ?? true ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditFood(food)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brown-200 text-brown-600 hover:bg-brown-50"
                      title="Edit dish"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFood(food)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete dish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
