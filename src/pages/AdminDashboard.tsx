import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical, 
  LogOut,
  Save,
  X,
  Upload,
  FileImage
} from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  dimensions: string;
  medium: string;
  year: string;
  thumbnailPath: string;
  originalPath: string;
  order: number;
}

interface AuctionWork {
  id: string;
  title: string;
  dimensions: string;
  medium: string;
  price: string;
  auctionHouse: string;
  image: string;
  order: number;
}

type ActiveTab = 'gallery' | 'auctions' | 'press';

/**
 * AdminDashboard Component
 * Main dashboard for managing gallery content
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [auctionWorks, setAuctionWorks] = useState<AuctionWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedAuctionWork, setSelectedAuctionWork] = useState<AuctionWork | null>(null);
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch data on mount
  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGalleryData();
    } else if (activeTab === 'auctions') {
      fetchAuctionData();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/API/auth.php');
      const data = await response.json();
      
      if (!data.data?.authenticated) {
        navigate('/admin/login');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      navigate('/admin/login');
    }
  };

  const fetchGalleryData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/API/Gallery.php');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const sortedImages = data.data.sort((a: GalleryImage, b: GalleryImage) => a.order - b.order);
        setImages(sortedImages);
      } else {
        setError('Failed to load gallery data');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Error loading gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuctionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/API/Auction.php');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const sortedWorks = data.data.sort((a: AuctionWork, b: AuctionWork) => a.order - b.order);
        setAuctionWorks(sortedWorks);
      } else {
        setError('Failed to load auction data');
      }
    } catch (err) {
      console.error('Error fetching auction data:', err);
      setError('Error loading auction data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/API/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAddImage = () => {
    setShowAddModal(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  const handleDeleteImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowDeleteModal(true);
  };

  const handleAddAuctionWork = () => {
    setShowAddModal(true);
  };

  const handleEditAuctionWork = (work: AuctionWork) => {
    setSelectedAuctionWork(work);
    setShowEditModal(true);
  };

  const handleDeleteAuctionWork = (work: AuctionWork) => {
    setSelectedAuctionWork(work);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (activeTab === 'gallery' && selectedImage) {
      try {
        const response = await fetch('/API/Gallery.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedImage.id }),
        });

        const data = await response.json();

        if (data.success) {
          setImages(images.filter(img => img.id !== selectedImage.id));
          setShowDeleteModal(false);
          setSelectedImage(null);
        } else {
          alert('Failed to delete image: ' + data.message);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting image');
      }
    } else if (activeTab === 'auctions' && selectedAuctionWork) {
      try {
        const response = await fetch('/API/Auction.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedAuctionWork.id }),
        });

        const data = await response.json();

        if (data.success) {
          setAuctionWorks(auctionWorks.filter(work => work.id !== selectedAuctionWork.id));
          setShowDeleteModal(false);
          setSelectedAuctionWork(null);
        } else {
          alert('Failed to delete auction work: ' + data.message);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting auction work');
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    if (activeTab === 'gallery') {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      
      setImages(newImages);
    } else if (activeTab === 'auctions') {
      const newWorks = [...auctionWorks];
      const draggedWork = newWorks[draggedIndex];
      
      newWorks.splice(draggedIndex, 1);
      newWorks.splice(index, 0, draggedWork);
      
      setAuctionWorks(newWorks);
    }
    
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    
    // Save new order to backend
    setReordering(true);
    try {
      if (activeTab === 'gallery') {
        const response = await fetch('/API/Gallery.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reorder',
            images: images.map((img, index) => ({
              id: img.id,
              order: index
            }))
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          alert('Failed to save order: ' + data.message);
          fetchGalleryData(); // Reload on error
        }
      } else if (activeTab === 'auctions') {
        const response = await fetch('/API/Auction.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reorder',
            works: auctionWorks.map((work, index) => ({
              id: work.id,
              order: index
            }))
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          alert('Failed to save order: ' + data.message);
          fetchAuctionData(); // Reload on error
        }
      }
    } catch (err) {
      console.error('Reorder error:', err);
      alert('Error saving order');
      if (activeTab === 'gallery') {
        fetchGalleryData(); // Reload on error
      } else if (activeTab === 'auctions') {
        fetchAuctionData(); // Reload on error
      }
    } finally {
      setReordering(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Claus Bertermann</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/20">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'gallery'
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={20} />
                <span>Gallery</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('auctions')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'auctions'
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={20} />
                <span>Auctions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('press')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'press'
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Press (Coming Soon)
            </button>
          </div>

          {/* Content */}
          {activeTab === 'gallery' && (
            <div>
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  {images.length} {images.length === 1 ? 'image' : 'images'} total
                  {reordering && <span className="ml-2 text-white">Saving order...</span>}
                </p>
            <button
              onClick={handleAddImage}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all transform hover:scale-105 border border-white/20"
            >
              <Plus size={20} />
              <span>Add Image</span>
            </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading gallery...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
                  {error}
                </div>
              )}

              {/* Gallery Grid */}
              {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white/5 border border-white/20 rounded-lg overflow-hidden transition-all hover:border-white/50 cursor-move ${
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-black/50 relative group">
                        <img
                          src={image.thumbnailPath}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                          <GripVertical size={20} className="text-white" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-2 truncate">{image.title}</h3>
                        <p className="text-gray-400 text-sm mb-1">{image.dimensions}</p>
                        <p className="text-gray-400 text-sm mb-4">{image.medium}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditImage(image)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                          >
                            <Edit2 size={16} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && images.length === 0 && (
                <div className="text-center py-12">
                  <FileImage size={64} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-4">No images yet</p>
                  <button
                    onClick={handleAddImage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all border border-white/20"
                  >
                    <Plus size={20} />
                    <span>Add Your First Image</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Auction Content */}
          {activeTab === 'auctions' && (
            <div>
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  {auctionWorks.length} {auctionWorks.length === 1 ? 'work' : 'works'} total
                  {reordering && <span className="ml-2 text-white">Saving order...</span>}
                </p>
                <button
                  onClick={handleAddAuctionWork}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all transform hover:scale-105 border border-white/20"
                >
                  <Plus size={20} />
                  <span>Add Work</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading auction works...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
                  {error}
                </div>
              )}

              {/* Auction Works Grid */}
              {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctionWorks.map((work, index) => (
                    <div
                      key={work.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white/5 border border-white/20 rounded-lg overflow-hidden transition-all hover:border-white/50 cursor-move ${
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-black/50 relative group">
                        <img
                          src={work.image}
                          alt={work.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                          <GripVertical size={20} className="text-white" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-2 truncate">{work.title}</h3>
                        <p className="text-gray-400 text-sm mb-1">{work.dimensions}</p>
                        <p className="text-gray-400 text-sm mb-1">{work.medium}</p>
                        <p className="text-white text-sm font-medium mb-1">{work.price}</p>
                        <p className="text-gray-400 text-sm mb-4">{work.auctionHouse}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAuctionWork(work)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                          >
                            <Edit2 size={16} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAuctionWork(work)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && auctionWorks.length === 0 && (
                <div className="text-center py-12">
                  <FileImage size={64} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-4">No auction works yet</p>
                  <button
                    onClick={handleAddAuctionWork}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all border border-white/20"
                  >
                    <Plus size={20} />
                    <span>Add Your First Work</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'press' && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Press management coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <ImageFormModal
          mode="add"
          type={activeTab}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            if (activeTab === 'gallery') {
              fetchGalleryData();
            } else if (activeTab === 'auctions') {
              fetchAuctionData();
            }
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && ((activeTab === 'gallery' && selectedImage) || (activeTab === 'auctions' && selectedAuctionWork)) && (
        <ImageFormModal
          mode="edit"
          type={activeTab}
          image={activeTab === 'gallery' ? selectedImage : undefined}
          auctionWork={activeTab === 'auctions' ? selectedAuctionWork : undefined}
          onClose={() => {
            setShowEditModal(false);
            setSelectedImage(null);
            setSelectedAuctionWork(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedImage(null);
            setSelectedAuctionWork(null);
            if (activeTab === 'gallery') {
              fetchGalleryData();
            } else if (activeTab === 'auctions') {
              fetchAuctionData();
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && ((activeTab === 'gallery' && selectedImage) || (activeTab === 'auctions' && selectedAuctionWork)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">
              Delete {activeTab === 'gallery' ? 'Image' : 'Work'}?
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{activeTab === 'gallery' ? selectedImage?.title : selectedAuctionWork?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedImage(null);
                    setSelectedAuctionWork(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * ImageFormModal Component
 * Modal for adding or editing images and auction works
 */
interface ImageFormModalProps {
  mode: 'add' | 'edit';
  type: 'gallery' | 'auctions';
  image?: GalleryImage;
  auctionWork?: AuctionWork;
  onClose: () => void;
  onSuccess: () => void;
}

function ImageFormModal({ mode, type, image, auctionWork, onClose, onSuccess }: ImageFormModalProps) {
  const [title, setTitle] = useState(image?.title || auctionWork?.title || '');
  const [dimensions, setDimensions] = useState(image?.dimensions || auctionWork?.dimensions || '');
  const [medium, setMedium] = useState(image?.medium || auctionWork?.medium || 'Oil on Canvas');
  const [year, setYear] = useState(image?.year || new Date().getFullYear().toString());
  const [price, setPrice] = useState(auctionWork?.price || '');
  const [auctionHouse, setAuctionHouse] = useState(auctionWork?.auctionHouse || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(image?.thumbnailPath || auctionWork?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'add') {
        // Add new item
        if (!imageFile) {
          setError('Please select an image file');
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', title);
        formData.append('dimensions', dimensions);
        formData.append('medium', medium);
        
        if (type === 'gallery') {
          formData.append('year', year);
        } else if (type === 'auctions') {
          formData.append('price', price);
          formData.append('auctionHouse', auctionHouse);
        }

        const apiEndpoint = type === 'gallery' ? '/API/Gallery.php' : '/API/Auction.php';
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          onSuccess();
        } else {
          setError(data.message || `Failed to add ${type === 'gallery' ? 'image' : 'work'}`);
        }
      } else {
        // Edit existing item
        const apiEndpoint = type === 'gallery' ? '/API/Gallery.php' : '/API/Auction.php';
        const requestBody: any = {
          action: 'update',
          id: type === 'gallery' ? image?.id : auctionWork?.id,
          title,
          dimensions,
          medium,
        };

        if (type === 'gallery') {
          requestBody.year = year;
        } else if (type === 'auctions') {
          requestBody.price = price;
          requestBody.auctionHouse = auctionHouse;
        }

        const response = await fetch(apiEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.success) {
          onSuccess();
        } else {
          setError(data.message || `Failed to update ${type === 'gallery' ? 'image' : 'work'}`);
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {mode === 'add' 
              ? `Add New ${type === 'gallery' ? 'Image' : 'Auction Work'}` 
              : `Edit ${type === 'gallery' ? 'Image' : 'Auction Work'}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload (Add mode only) */}
          {mode === 'add' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 hover:border-white/50 rounded-lg cursor-pointer transition-colors"
                >
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-400">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </span>
                </label>
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-black/50 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              placeholder="e.g., 23EB#CB – 2023"
              required
            />
          </div>

          {/* Dimensions */}
          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-300 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              placeholder="e.g., 160 × 150 cm"
            />
          </div>

          {/* Medium */}
          <div>
            <label htmlFor="medium" className="block text-sm font-medium text-gray-300 mb-2">
              Medium
            </label>
            <input
              type="text"
              id="medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              placeholder="e.g., Oil on Canvas"
            />
          </div>

          {/* Year (Gallery only) */}
          {type === 'gallery' && (
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                Year
              </label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="e.g., 2023"
              />
            </div>
          )}

          {/* Price (Auctions only) */}
          {type === 'auctions' && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                Price *
              </label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="e.g., €10,160"
                required
              />
            </div>
          )}

          {/* Auction House (Auctions only) */}
          {type === 'auctions' && (
            <div>
              <label htmlFor="auctionHouse" className="block text-sm font-medium text-gray-300 mb-2">
                Auction House *
              </label>
              <input
                type="text"
                id="auctionHouse"
                value={auctionHouse}
                onChange={(e) => setAuctionHouse(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="e.g., Artcurial, Paris"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{mode === 'add' ? 'Adding...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{mode === 'add' 
                    ? `Add ${type === 'gallery' ? 'Image' : 'Work'}` 
                    : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

