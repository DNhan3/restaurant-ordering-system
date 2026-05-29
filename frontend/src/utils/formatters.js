export const formatPrice = (amount) => {
    return `${parseFloat(amount || 0).toLocaleString('vi-VN')}đ`;
};