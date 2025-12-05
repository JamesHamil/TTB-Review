// Custom hook for managing form data

import { useState } from 'react';
import type { FormData, BeverageCategory } from '../types';

const initialFormData: FormData = {
  beverageCategory: 'spirits',
  brandName: '',
  productType: '',
  alcoholContent: '',
  netContents: [''],
};

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: BeverageCategory) => {
    setFormData(prev => ({ ...prev, beverageCategory: category }));
  };

  const handleNetContentsChange = (index: number, value: string) => {
    const newNetContents = [...formData.netContents];
    newNetContents[index] = value;
    setFormData(prev => ({ ...prev, netContents: newNetContents }));
  };

  const addNetContentsField = () => {
    setFormData(prev => ({ ...prev, netContents: [...prev.netContents, ''] }));
  };

  const removeNetContentsField = (index: number) => {
    if (formData.netContents.length > 1) {
      const newNetContents = formData.netContents.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, netContents: newNetContents }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (imageFile: File | null): boolean => {
    if (!imageFile) {
      alert('Please upload a label image');
      return false;
    }

    if (!formData.brandName || !formData.productType || !formData.alcoholContent) {
      alert('Please fill in all required fields (Brand Name, Product Type, and Alcohol Content)');
      return false;
    }

    const hasNetContents = formData.netContents.some(nc => nc.trim() !== '');
    if (!hasNetContents) {
      alert('Please fill in at least one Net Contents field');
      return false;
    }

    return true;
  };

  return {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleNetContentsChange,
    addNetContentsField,
    removeNetContentsField,
    resetForm,
    validateForm,
  };
}

