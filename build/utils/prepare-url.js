export const prepareUrl = (url) => {
    return url.replace('www.', '').replace(/#(.*)/, '');
};
