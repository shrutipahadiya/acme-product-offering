const app = document.querySelector("#app");
const productApi = "https://acme-users-api-rev.herokuapp.com/api/products";
const companyApi = "https://acme-users-api-rev.herokuapp.com/api/companies";
const offeringApi = "https://acme-users-api-rev.herokuapp.com/api/offerings";

Promise.all([fetch(productApi), fetch(companyApi), fetch(offeringApi)])
  .then((res) => {
    let products = res[0].json();
    let companies = res[1].json();
    let offerings = res[2].json();
    return Promise.all([products, companies, offerings]);
  })
  .then(([products, companies, offerings]) => {
    renderProducts(products, companies, offerings, true);
    window.addEventListener("hashchange", () => {
      let hash = window.location.hash.slice(1);
      if (hash === "") {
        renderProducts(products, companies, offerings, true);
      } else {
        let product = products.filter((prod) => prod.id === hash);
        renderProducts(product, companies, offerings, false);
      }
    });
  });

const renderProducts = (products, companies, offerings, mult) => {
  //   console.log(products);
  const html = products
    .map((prod, idx) => {
      const offers = offerings.filter((offer) => {
        return prod.id === offer.productId;
      });

      const finalOffer = [];

      offers
        .map((offer) => {
          companies.map((comp) => {
            if (comp.id === offer.companyId) {
              finalOffer.push(
                `<li> Offered By: ${comp.name} at $${offer.price}</li>`
              );
            }
          });
        })
        .join("");
      return `
            <div class='card'>
                <a href='#${mult ? prod.id : ""}'>${prod.name.toUpperCase()}<a>
                <p>${prod.description}</p>
                <p>$${prod.suggestedPrice}.00</p>
                <ul>${finalOffer.join("")}</ul>
            </div>
        `;
    })
    .join("");
  app.innerHTML = html;
};