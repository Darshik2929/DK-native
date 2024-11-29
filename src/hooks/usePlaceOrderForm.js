import {useState} from 'react';

const usePlaceOrderForm = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const addProduct = () => {
    setSelectedProducts(prev => [
      ...prev,
      {
        id: '',
        category: '',
        color: '',
        thickness: '',
        steelGrade: '',
        quantity: '',
      },
    ]);
  };

  const removeProduct = index => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return {
    selectedProducts,
    addProduct,
    removeProduct,
  };
};

export default usePlaceOrderForm;
