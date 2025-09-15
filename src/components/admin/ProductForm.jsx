import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
// import { Select } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { supabase } from '../../lib/supabase'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    original_price: '',
    sale_price: '',
    discount_percentage: '',
    stock_status: 'Full-Stock',
    styles_available: '',
    image_url: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        original_price: product.original_price || '',
        sale_price: product.sale_price || '',
        discount_percentage: product.discount_percentage || '',
        stock_status: product.stock_status || 'Full-Stock',
        styles_available: product.styles_available || '',
        image_url: product.image_url || ''
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateDiscount = () => {
    const original = parseFloat(formData.original_price)
    const sale = parseFloat(formData.sale_price)
    if (original && sale && original > sale) {
      const discount = Math.round(((original - sale) / original) * 100)
      setFormData(prev => ({
        ...prev,
        discount_percentage: discount.toString()
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        sale_price: parseFloat(formData.sale_price),
        discount_percentage: parseInt(formData.discount_percentage) || 0,
        styles_available: parseInt(formData.styles_available) || 1
      }

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
        
        toast.success('Product updated successfully!', {
          description: `${formData.name} has been updated.`
        })
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
        
        toast.success('Product added successfully!', {
          description: `${formData.name} has been added to your inventory.`
        })
      }

      onSave()
    } catch (error) {
      console.error('ProductForm: Error saving product:', { error: error.message, productData: formData, timestamp: new Date().toISOString() })
      toast.error('Failed to save product', {
        description: 'An error occurred while saving the product. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Category</option>
                <option value="jeans">Jeans</option>
                <option value="shirts">Shirts</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="sneakers">Sneakers</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="original_price">Original Price ($)</Label>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={handleChange}
                onBlur={calculateDiscount}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sale_price">Sale Price ($)</Label>
              <Input
                id="sale_price"
                name="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={handleChange}
                onBlur={calculateDiscount}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="discount_percentage">Discount (%)</Label>
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                value={formData.discount_percentage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock_status">Stock Status</Label>
              <select
                id="stock_status"
                name="stock_status"
                value={formData.stock_status}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Full-Stock">Full Stock</option>
                <option value="Out-Of-Stock">Out of Stock</option>
                <option value="Promotions">Promotions</option>
                <option value="Stock">Stock</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="styles_available">Styles Available</Label>
              <Input
                id="styles_available"
                name="styles_available"
                type="number"
                value={formData.styles_available}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductForm
