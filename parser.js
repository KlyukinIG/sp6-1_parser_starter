// @todo: напишите здесь код парсера

function parsePage() {
  //Meta
  const metaKeyWord = document.querySelector('meta[name="keywords"]');
  const metaDescription = document.querySelector('meta[name="description"]');

  const keys = metaKeyWord
    ? metaKeyWord.content.split(",").map((k) => k.trim())
    : [];

  const og = {};

  document.querySelectorAll('meta[property^="og:"]').forEach((meta) => {
    if (meta.getAttribute("property") && meta.getAttribute("content")) {
      const key = meta.getAttribute("property").replace("og:", "");
      og[key] = meta.getAttribute("content");
    }
  });

  const meta = {
    title: document.title.split("—")[0].trim(),
    description: metaDescription ? metaDescription.content : "",
    keywords: keys,
    language: document.documentElement.lang,
    opengraph: og,
  };

  //product

  const productSection = document.querySelector(".product");

  const productId = productSection.dataset.id;
  const productName = productSection
    .querySelector(".container .title")
    .textContent.trim();
  const isLiked = productSection
    .querySelector(".container .preview .like")
    .classList.contains("active");

  const images = [];
  const mainImg = productSection.querySelector(".preview figure img");

  images.push({
    full: mainImg.src,
    preview: mainImg.src,
    alt: mainImg.alt,
  });

  const navImage = productSection.querySelectorAll(
    ".preview nav button:not([disabled]) img"
  );

  navImage.forEach((img) => {
    images.push({
      full: img.dataset.src,
      preview: img.src,
      alt: img.alt,
    });
  });

  const category = [];
  const discount = [];
  const label = [];

  const productTags = productSection.querySelectorAll(".tags span");

  productTags.forEach((tag) => {
    const text = tag.textContent.trim();
    if (tag.classList.contains("green")) {
      category.push(text);
    }
    if (tag.classList.contains("blue")) {
      label.push(text);
    }
    if (tag.classList.contains("red")) {
      discount.push(text);
    }
  });

  const tags = {
    category,
    discount,
    label,
  };

  const priceBlock = productSection.querySelector(".price");

  const currencyMap = {
    "₽": "RUB",
    $: "USD",
    "€": "EUR",
  };

  const currency = currencyMap[priceBlock.textContent.trim().match(/[₽$€]/)];

  const price = Number(
    priceBlock.firstChild.textContent.trim().replace(/[^\d.]/g, "")
  );

  const OldPrice = Number(
    priceBlock
      .querySelector("span")
      .lastChild.textContent.trim()
      .replace(/[^\d.]/g, "")
  );

  const properties = {};
  const propertyItem = productSection.querySelectorAll(".properties li");
  propertyItem.forEach((item) => {
    const spans = item.querySelectorAll("span");
    properties[spans[0].textContent.trim()] = spans[1].textContent.trim();
  });


  const description = productSection.querySelector('.description');

  const fullDescClone = description.cloneNode(true);

  fullDescClone.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
  });

  const des = fullDescClone.innerHTML.trim();

  const product = {
    id: productId,
    name: productName,
    isLike: isLiked,
    images: images,
    tags: tags,
    price: price,
    oldPrice: OldPrice,
    currency: currency,
    properties: properties,
    description: des
  };

  return {
    meta: meta,
    product: product,
    suggested: [],
    reviews: [],
  };
}

window.parsePage = parsePage;
