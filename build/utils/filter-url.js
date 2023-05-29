export const filterUrl = (item) => {
    if (item.startsWith('tel:') || item.startsWith('mailto:')) {
        return false;
    }
    return true;
};
