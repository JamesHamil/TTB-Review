// Product Form Component

import type { FormData, BeverageCategory } from '../types';
import { PLACEHOLDERS, PRODUCT_TYPE_DESCRIPTIONS } from '../constants';

interface ProductFormProps {
  formData: FormData;
  imagePreview: string;
  isProcessing: boolean;
  progress: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: BeverageCategory) => void;
  onNetContentsChange: (index: number, value: string) => void;
  onAddNetContents: () => void;
  onRemoveNetContents: (index: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function ProductForm({
  formData,
  imagePreview,
  isProcessing,
  progress,
  onInputChange,
  onCategoryChange,
  onNetContentsChange,
  onAddNetContents,
  onRemoveNetContents,
  onImageChange,
  onSubmit,
  onReset,
}: ProductFormProps) {
  return (
    <section className="bg-white rounded-xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Information</h2>
      <form onSubmit={onSubmit}>
        {/* Beverage Category */}
        <div className="mb-6">
          <label htmlFor="beverageCategory" className="block text-sm font-semibold text-gray-700 mb-2">
            Beverage Category <span className="text-red-600">*</span>
          </label>
          <select
            id="beverageCategory"
            name="beverageCategory"
            value={formData.beverageCategory}
            onChange={(e) => onCategoryChange(e.target.value as BeverageCategory)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="spirits">Distilled Spirits</option>
            <option value="wine">Wine</option>
            <option value="beer">Beer</option>
          </select>
          <small className="block mt-1 text-sm text-gray-600">
            Select the category of alcoholic beverage
          </small>
        </div>

        {/* Brand Name */}
        <div className="mb-6">
          <label htmlFor="brandName" className="block text-sm font-semibold text-gray-700 mb-2">
            Brand Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={onInputChange}
            placeholder="e.g., Old Tom Distillery"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <small className="block mt-1 text-sm text-gray-600">
            The brand under which the product is sold
          </small>
        </div>

        {/* Product Type */}
        <div className="mb-6">
          <label htmlFor="productType" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Class/Type <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={onInputChange}
            placeholder={PLACEHOLDERS[formData.beverageCategory]}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <small className="block mt-1 text-sm text-gray-600">
            {PRODUCT_TYPE_DESCRIPTIONS[formData.beverageCategory]}
          </small>
        </div>

        {/* Alcohol Content */}
        <div className="mb-6">
          <label htmlFor="alcoholContent" className="block text-sm font-semibold text-gray-700 mb-2">
            Alcohol Content (ABV %) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="alcoholContent"
            name="alcoholContent"
            value={formData.alcoholContent}
            onChange={onInputChange}
            placeholder="e.g., 45"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <small className="block mt-1 text-sm text-gray-600">Alcohol by volume percentage</small>
        </div>

        {/* Wine-specific: Sulfite Declaration */}
        {formData.beverageCategory === 'wine' && (
          <div className="mb-6">
            <label htmlFor="sulfiteDeclaration" className="block text-sm font-semibold text-gray-700 mb-2">
              Sulfite Declaration <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="sulfiteDeclaration"
              name="sulfiteDeclaration"
              value={formData.sulfiteDeclaration || ''}
              onChange={onInputChange}
              placeholder='e.g., "Contains Sulfites"'
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <small className="block mt-1 text-sm text-gray-600">Required for wine labels</small>
          </div>
        )}

        {/* Beer-specific: Ingredients */}
        {formData.beverageCategory === 'beer' && (
          <div className="mb-6">
            <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-700 mb-2">
              Ingredients (Optional)
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients || ''}
              onChange={onInputChange}
              placeholder="e.g., Water, Barley, Hops, Yeast"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <small className="block mt-1 text-sm text-gray-600">Common for beer labels</small>
          </div>
        )}

        {/* Net Contents */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Net Contents <span className="text-red-600">*</span>
          </label>
          <small className="block mb-3 text-sm text-gray-600">
            Add each content item separately (e.g., "750 mL", "97 proof")
          </small>

          <div className="space-y-3">
            {formData.netContents.map((content, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => onNetContentsChange(index, e.target.value)}
                  placeholder="e.g., 750 mL or 97 proof"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {formData.netContents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveNetContents(index)}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddNetContents}
            className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-sm"
          >
            + Add Another Content Item
          </button>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="labelImage" className="block text-sm font-semibold text-gray-700 mb-2">
            Label Image <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            id="labelImage"
            accept="image/*"
            onChange={onImageChange}
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <small className="block mt-1 text-sm text-gray-600">
            Upload a clear image of the alcohol label (JPEG, PNG, etc.)
          </small>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={imagePreview}
              alt="Label preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            disabled={isProcessing}
          >
            {isProcessing ? `Processing... ${progress}%` : 'Verify Label'}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
            onClick={onReset}
            disabled={isProcessing}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

