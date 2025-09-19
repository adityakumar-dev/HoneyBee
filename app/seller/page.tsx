"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading/loading';
import { useProducts, useCategories } from '@/lib/product';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/seller/ProductCard';
import ProductForm from '@/components/seller/ProductForm';
import './seller.css';

export default function SellerPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        if (!user) {
            setToken(null);
            return;
        }
        supabase.auth.getSession().then(({ data }) => {
            setToken(data.session?.access_token || null);
        });
    }, [user]);

    const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts(token);
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(token);
    
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    if (loading || productsLoading || categoriesLoading) {
        return <Loading />;
    }

    if (!user) {
        router.push('/');
        return null;
    }

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleFormClose = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        refetchProducts(); // Refresh products after add/edit
    };

    // Filter products by category
    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(p => p.category_id === selectedCategory);

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 5).length;

    return (
        <div className="seller-page">
            <div className="background"></div>
            <div className="background-2"></div>
            <Navbar />
            
            <div className="seller-header">
                <div className="seller-header-content">
                    <div className="seller-title-section">
                        <button className="back-btn" onClick={() => router.push('/profile')}>
                            ← Back to Profile
                        </button>
                        <h1 className="seller-title">Seller Dashboard</h1>
                        <p className="seller-subtitle">Manage your honey products and inventory</p>
                    </div>
                    <button className="add-product-btn" onClick={() => setShowProductForm(true)}>
                        <span className="btn-icon">+</span>
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="seller-content">
                <div className="seller-container">
                    
                    {/* Stats Overview */}
                    <div className="stats-section">
                        <h3 className="section-title">Overview</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-content">
                                    <h4>{totalProducts}</h4>
                                    <p>Total Products</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h4>${totalValue.toFixed(2)}</h4>
                                    <p>Inventory Value</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-content">
                                    <h4>{lowStockProducts}</h4>
                                    <p>Low Stock Items</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <h4>{categories.length}</h4>
                                    <p>Categories</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="filter-section">
                        <h3 className="section-title">Filter by Category</h3>
                        <div className="category-filters">
                            <button 
                                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All Products ({totalProducts})
                            </button>
                            {categories.map((category) => {
                                const count = products.filter(p => p.category_id === category.id).length;
                                return (
                                    <button 
                                        key={category.id}
                                        className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error Messages */}
                    {(productsError || categoriesError) && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {productsError || categoriesError}
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="products-section">
                        <div className="products-header">
                            <h3 className="section-title">
                                {selectedCategory === 'all' 
                                    ? 'All Products' 
                                    : `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Products`}
                            </h3>
                            <span className="product-count">{filteredProducts.length} items</span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🍯</div>
                                <h3>No products found</h3>
                                <p>
                                    {selectedCategory === 'all' 
                                        ? 'Start by adding your first honey product to begin selling'
                                        : 'No products in this category yet'
                                    }
                                </p>
                                <button className="empty-add-btn" onClick={() => setShowProductForm(true)}>
                                    Add Product
                                </button>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onEdit={handleEdit}
                                        token={token}
                                        onRefresh={refetchProducts}
                                        categories={categories}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductForm
                open={showProductForm}
                onClose={handleFormClose}
                product={editingProduct}
                token={token}
                categories={categories}
            />
        </div>
    );
}
