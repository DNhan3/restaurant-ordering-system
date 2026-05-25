import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Grid, LayoutList } from 'lucide-react';
import FoodCard from '../components/menu/FoodCard';
import QuickViewModal from '../components/menu/QuickViewModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { foodService } from '../services/api';
import { CATEGORIES, FOOD_STATUS } from '../utils/constants';

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under5', label: 'Under $5', min: 0, max: 5 },
  { id: '5to10', label: '$5 - $10', min: 5, max: 10 },
  { id: '10to15', label: '$10 - $15', min: 10, max: 15 },
  { id: 'over15', label: 'Over $15', min: 15, max: Infinity },
];

const STATUS_OPTIONS = [
  { id: 'best_seller', label: 'Best Seller', value: FOOD_STATUS.BEST_SELLER },
  { id: 'new', label: 'New Dishes', value: FOOD_STATUS.NEW_DISHES },
  { id: 'online_only', label: 'Online Only', value: FOOD_STATUS.ONLINE_ONLY },
  { id: 'seasonal', label: 'Seasonal', value: FOOD_STATUS.SEASONAL_DISHES },
];

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'meat', label: 'Meat' },
  { id: 'vegan', label: 'Vegan' },
];

const ITEMS_PER_PAGE = 12;

export default function MenuPage() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setIsLoading(true);
      const data = await foodService.getAll();
      setFoods(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load foods:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter foods
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      // Search query
      if (searchQuery && !food.food_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && food.food_category?.toLowerCase() !== selectedCategory) {
        return false;
      }

      // Price range
      const price = parseFloat(food.food_price) - parseFloat(food.food_discount || 0);
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range && (price < range.min || price >= range.max)) {
        return false;
      }

      // Status
      if (selectedStatuses.length > 0) {
        const hasAllStatuses = selectedStatuses.every((status) =>
          food.food_status?.includes(status)
        );
        if (!hasAllStatuses) return false;
      }

      // Type
      if (selectedType !== 'all' && food.food_type?.toLowerCase() !== selectedType) {
        return false;
      }

      return true;
    });
  }, [foods, searchQuery, selectedCategory, selectedPriceRange, selectedStatuses, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFoods.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFoods, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedStatuses, selectedType]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedStatuses([]);
    setSelectedType('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedStatuses.length > 0 ||
    selectedType !== 'all';

  const handleQuickView = (food) => {
    setSelectedFood(food);
    setIsQuickViewOpen(true);
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thực Đơn</h1>
          <p className="text-white/80">
            Khám phá các món ăn Việt Nam ngon được chế biến tươi mỗi ngày
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-brown-200 focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-brown-100 rounded-full"
              >
                <X className="w-4 h-4 text-brown-400" />
              </button>
            )}
          </div>

          {/* Filter & View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-brown-700 border-brown-200 hover:border-primary'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Bộ Lọc</span>
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedStatuses.length + (selectedCategory !== 'all' ? 1 : 0) + (selectedPriceRange !== 'all' ? 1 : 0) + (selectedType !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="flex border-2 border-brown-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-brown-700 hover:bg-brown-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-brown-700 hover:bg-brown-50'}`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-brown-900">Bộ Lọc</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-light font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-3">
                  Danh Mục
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-brown-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-3">
                  Khoảng Giá
                </label>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-brown-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-3">
                  Ưu Đãi Đặc Biệt
                </label>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((status) => (
                    <label key={status.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status.value)}
                        onChange={() => toggleStatus(status.value)}
                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-sm text-brown-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-3">
                  Loại Món
                </label>
                <div className="space-y-2">
                  {TYPE_OPTIONS.map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-brown-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-brown-500">
            Hiển thị <span className="font-semibold">{paginatedFoods.length}</span> trong{' '}
            <span className="font-semibold">{filteredFoods.length}</span> món
          </p>
        </div>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy món"
            description="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
            actionLabel="Xóa Bộ Lọc"
            actionTo="/menu"
          />
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedFoods.map((food) => (
                <FoodCard
                  key={food.food_id}
                  food={food}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border-2 border-brown-200 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-white'
                              : 'bg-white text-brown-700 hover:bg-primary/10'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-brown-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border-2 border-brown-200 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        food={selectedFood}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedFood(null);
        }}
      />
    </div>
  );
}
