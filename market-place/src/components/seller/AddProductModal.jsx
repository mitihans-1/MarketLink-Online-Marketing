import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import productService from '../../services/productService';
import AddCategoryModal from './AddCategoryModal';

const AddProductModal = ({ isOpen, onClose, onProductAdded, productToEdit = null }) => {
    const isEditMode = !!productToEdit;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        stock: '',
        image_url: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name || '',
                    description: productToEdit.description || '',
                    price: productToEdit.price || '',
                    category_id: productToEdit.category_id || '',
                    stock: productToEdit.stock || '',
                    image_url: productToEdit.image_url || ''
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category_id: '',
                    stock: '',
                    image_url: ''
                });
            }
        }
    }, [isOpen, productToEdit]);

    const fetchCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0
            };

            if (isEditMode) {
                await productService.updateProduct(productToEdit.id, payload);
            } else {
                await productService.createProduct(payload);
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onProductAdded();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{isEditMode ? 'Update Listing' : 'New Listing'}</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Product Details</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={24} className="text-gray-900" />
                        </button>
                    </div>

                    {success ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={48} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Inventory Updated</h3>
                            <p className="text-gray-500 font-medium">Changes have been saved successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-700 font-bold text-sm">
                                    <AlertCircle size={20} className="mr-3" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                                        placeholder="e.g. Vintage Leather Jacket"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-black text-gray-900"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stock Level</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-black text-gray-900"
                                        placeholder="Quantity"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                                        Collection
                                        <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="text-blue-600 font-black">+ Create</button>
                                    </label>
                                    <select
                                        name="category_id"
                                        required
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-gray-900 appearance-none bg-no-repeat bg-[right_1.25rem_center]"
                                    >
                                        <option value="">Select Gallery</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image Source</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                                            placeholder="URL to image"
                                        />
                                        <Upload size={20} className="absolute left-4 top-4 text-gray-400" />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none resize-none font-medium text-gray-700"
                                        placeholder="Story behind the product..."
                                    />
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 rounded-2xl border border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-4 px-6 rounded-2xl font-black text-white transition-all transform active:scale-95 flex items-center justify-center ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100'}`}
                                >
                                    {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'List Product'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onCategoryAdded={fetchCategories}
            />
        </>
    );
};

export default AddProductModal;
