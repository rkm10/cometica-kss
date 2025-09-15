import React, { useState } from 'react'
import ProductList from './ProductList'
import ProductForm from './ProductForm'

const ProductsPage = () => {
  const [currentView, setCurrentView] = useState('list')
  const [editingProduct, setEditingProduct] = useState(null)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setCurrentView('form')
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setCurrentView('form')
  }

  const handleSaveProduct = () => {
    setCurrentView('list')
    setEditingProduct(null)
  }

  const handleCancelEdit = () => {
    setCurrentView('list')
    setEditingProduct(null)
  }

  if (currentView === 'form') {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <ProductList
      onEdit={handleEditProduct}
      onAdd={handleAddProduct}
    />
  )
}

export default ProductsPage