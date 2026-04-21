export const getPages = (totalPages, page) => {
    const pages = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    }
    for (let i = 1; i <= 3; i++) pages.push(i);
    if (page > 5) pages.push("...");
    for (let i = page - 1; i <= page + 1; i++) {
        if (i > 3 && i < totalPages - 2) pages.push(i);
    }
    if (page < totalPages - 4) pages.push("...");
    for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
    return pages;
};
