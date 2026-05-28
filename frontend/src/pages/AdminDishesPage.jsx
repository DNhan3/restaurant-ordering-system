import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, LogOut, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { foodService } from '../services/api';
import { CATEGORIES } from '../utils/constants';

const initialFoodForm = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'pho',
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

  const handleCreateFood = async (event) => {
    event.preventDefault();
    setFoodMessage('');

    try {
      setIsSavingFood(true);
      let image = foodForm.image;

      if (foodImageFile) {
        const upload = await foodService.uploadImage(foodImageFile);
        image = upload.imageUrl;
      }

      await foodService.create({
        name: foodForm.name.trim(),
        price: Number(foodForm.price),
        description: foodForm.description.trim(),
        image,
        category: foodForm.category,
      });

      setFoodForm(initialFoodForm);
      setFoodImageFile(null);
      setFoodImagePreview('');
      setFoodMessage('Dish created successfully.');
      await loadFoods();
    } catch (error) {
      console.error('Failed to create food:', error);
      setFoodMessage(error.response?.data?.message || 'Failed to create dish.');
    } finally {
      setIsSavingFood(false);
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
                Manage Bills & Orders
              </Link>
              <h1 className="text-2xl font-bold">Add Custom Dish</h1>
              <p className="text-brown-300 mt-1">Create menu items with image uploads and dish details.</p>
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
                  <h2 className="text-xl font-bold text-brown-900">Create Dish</h2>
                  <p className="text-sm text-brown-500 mt-1">Upload a thumbnail and save it with the menu item.</p>
                </div>
              </div>

              <form onSubmit={handleCreateFood} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">Dish name</label>
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
                    {isSavingFood ? 'Saving...' : 'Save Dish'}
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

              <h3 className="font-semibold text-brown-900 mb-3">Latest Dishes</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {foods.slice(-8).reverse().map((food) => (
                  <div key={food.food_id} className="flex items-center gap-3">
                    <img
                      src={food.food_image || '/images/placeholder-food.png'}
                      alt={food.food_name}
                      className="w-12 h-12 rounded-lg object-cover bg-brown-100"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-brown-900 truncate">{food.food_name}</p>
                      <p className="text-xs text-brown-500">{food.food_category}</p>
                    </div>
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
