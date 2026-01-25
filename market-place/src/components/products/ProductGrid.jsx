import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const featuredProducts = [
  {
    id: 1,
    name: "Elegant Evening Dress",
    price: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLJZp8Eu1EQ0IAQw_Pum0Nj7YYQWpE9S8X7hPIYxHMXOlx5hDaiTKnfw1OyY7gxmZoj9JRNtlnWeXIb2_u4yL0AatVq73ROt8Q6pfo4dTtALMaFohboKJEzIZFYpq6UlzJt_hP0cdRH9wQkvfBhoVa7a4FzU56xTeBPJ80qVXPQg2e4Vi8RjI85dvp2m5qs6rNBEO2BXkvpU1BoaMUK8cSx-W1LnCjBU0Wz0RTRV3FQcv8sJzVj28f6h6rpF_vRQlTJzoHGu-vkTU",
    category: "women",
    link: "/product/1"
  },
  {
    id: 2,
    name: "Casual Weekend Outfit",
    price: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDJhVKDLDDSJdJdb0He5RsqWrgVCi88-IlXaD3BW4rqcCnEU7i6Cp5Ckbg_lvE0XCuv9AVwp9OjHLzMfq4RqXdAc4aTmQooWDeLSwNCxnTzg4hDSseHVqLfp5_dziR-TFMYYMis0YoSGMtRXA_sabcr3lzrJUf6e1chvOi16J2DW1MwCDCzuioLAwPW9RkOK76exvDTQuAKqiQa3DbsfWCe17d96Oryk7QbxNwSJbRLh3kPIvdc14zgDE_WTeG4nQQwJGvEF_qeio",
    category: "men",
    link: "/product/2"
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: 250,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3Q5x_Rn6pAClUx_-xNk22NdVUxdCSlAoEx-zQ9tpgrchWl58P3oS9mOiBksc-zUsLhlU6vhIvN-NR2RaKKuldeUJbJs1qn2RawpCATlKLrjk1AW8GAPQi8HnDkycYvHKTU9F7lna4XjuPas013V8MVdAENLmpkISnkI43Hn114RO0Na03ug-05evoeLrwLiXF74EAqsATAQBrcznrvNjUPSdVdBUr5EutH6Uk6aR-oTy1TZU6CqrM1DVzM9_cWh_MJNoE9Ue_9v4",
    category: "accessories",
    link: "/product/3"
  },
  {
    id: 4,
    name: "Performance Sneakers",
    price: 110,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzOcHruKl8Y1CeGonUeeyGuUzho_0TTZatRte3YBxFaQCuBydD9HDmQA74z6VJPMpsEyhg8o6x5prc5MLWIMDy72FWq4E2_QEQ4Mr4hDKET__unt6n5od6uVrMASR3Kxe1h-8SIk5kftcXUNSVenyuT2-0IvoHK97UTpo_9rhsI3bFI4LWzRRgMquCZu5ncW-9Zfe234XNmy5m4B0piQZOg8IN9fD4m5yNjxODsIhJHXOfWQhDvX7LJ8M1VOJKqdryglgeq24v1BI",
    category: "shoes",
    link: "/product/4"
  }
];

const ProductGrid = ({ products = featuredProducts, title = "Featured Products", layout = "scroll" }) => {
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <>
      <h2 className="text-[#111318] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </h2>
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
        <div className="flex items-stretch p-4 gap-4 min-w-0">
          {products.map((product) => (
            <div key={product.id} className="min-w-[250px] sm:min-w-60 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ProductGrid.propTypes = {
  /** Array of products to display */
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      link: PropTypes.string,
      category: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  layout: PropTypes.oneOf(['scroll', 'grid']),
};

ProductGrid.defaultProps = {
  products: featuredProducts,
  title: "Featured Products",
  layout: "scroll",
};

export default ProductGrid;