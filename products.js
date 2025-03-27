let pageNumber = 1;
const pageSize = 6; // 2 satır 3 satırlık bir dizilisim sonra 3 satır 2 sütün sonra 6 satır tek sütın
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDA2MDk0NywiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.KtWRXJHklhYOimK4T_sneE27xSadCnYLug5p2neZBTA";

const createProductCard = (product) => {
    //ürün için card htmli oluşturduk
    return `
        <div class="productCard">
            <div class="productImage">
                <img src="${product.productData.productMainImage}" alt="${product.productName}">
            </div>
            <div class="productInfo">
                <h3 class="productName">${product.productName}</h3>
                <p class="productDescription">${product.productData.productInfo}</p>
                <p class="productPrice">${product.marketPrice > 0 ? product.marketPrice + " TL" : "Fiyat bilgisi yok"}</p>
                <a href="http://127.0.0.1:5500/products.html" class="productDetailButton">Detay Göster</a>
            </div>
        </div>
    `;
};

const createProductsAndPagination = async () => {
    //ürün cardlarını içerecek container
    const products = await getProducts();
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    if (products && products.length > 0) {
        productsContainer.innerHTML = products.map(product =>
            createProductCard(product)
        ).join("");
        createPagination();
    } else {
        productsContainer.innerHTML = `<p class="noProductsMessage">Hiç ürün bulunamadı</p>`;
    }
};

const createPagination = () => {
    //sayfalama yapımız lazy loading kavramı
    const paginationContainer = document.getElementById("paginationContainer");

    paginationContainer.innerHTML = `
        <button id="prevPageButton"}>Geri</button>
        <span>${pageNumber}</span>
        <button id="nextPageButton"}>İleri</button>
    `;

    //ileri veya geriye her tıklandığında 
    document.getElementById("prevPageButton").addEventListener("click", async () => {
        if (pageNumber != 1) {
            pageNumber = pageNumber - 1;
            await createProductsAndPagination();
        }
        else {
            alert("Zaten İlk Sayfadasın");
        }
    });

    document.getElementById("nextPageButton").addEventListener("click", async () => {
        pageNumber = pageNumber + 1;
        await createProductsAndPagination();
    });
};

const getProducts = async () => {
    const url = `https://api.hyperteknoloji.com.tr/Products/List?page=${pageNumber}&pageSize=${pageSize}`;
    let products = [];

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const res = await response.json();

        if (res.success) {
            products = res.data;
        }
        else {
            alert("Hata Oluştu Key=GetProductsHandleError")
            console.log("GetProductsHandleError", res.message);
        }

    }
    catch (err) {
        alert("Beklenmedik Bir Hata Oluştu Key=GetProductsUnexpectedError");
        console.log("GetProductsUnexpectedError", err);
    }
    return products;
};


document.addEventListener("DOMContentLoaded", () => {
    //sayfa ilk yüklenmesinde yıl değerini bas
    document.getElementById("footerYearLine").textContent =
        `${new Date().getFullYear()} HyperTech - Tüm hakları saklıdır`;

    //sayfada ilk yükleme ile sabitlik sağla dinamikler ileri geri ve detay butonları üzerinde renderlancak
    createProductsAndPagination();
});