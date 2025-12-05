// Main Application Component

import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { VerificationResults } from './components/VerificationResults';
import { useFormData } from './hooks/useFormData';
import { useImageUpload } from './hooks/useImageUpload';
import { useVerification } from './hooks/useVerification';

function App() {
  const {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleNetContentsChange,
    addNetContentsField,
    removeNetContentsField,
    resetForm,
    validateForm,
  } = useFormData();

  const { imageFile, imagePreview, handleImageChange, resetImage } = useImageUpload();

  const { isProcessing, progress, result, verify, resetVerification } = useVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(imageFile)) {
      return;
    }

    await verify(imageFile!, formData);
  };

  const handleReset = () => {
    resetForm();
    resetImage();
    resetVerification();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ProductForm
            formData={formData}
            imagePreview={imagePreview}
            isProcessing={isProcessing}
            progress={progress}
            onInputChange={handleInputChange}
            onCategoryChange={handleCategoryChange}
            onNetContentsChange={handleNetContentsChange}
            onAddNetContents={addNetContentsField}
            onRemoveNetContents={removeNetContentsField}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />

          {result && <VerificationResults result={result} />}
        </div>
      </div>
    </div>
  );
}

export default App;
